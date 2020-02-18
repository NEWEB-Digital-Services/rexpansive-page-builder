// var lodash = _.noConflict();

/**
 * Add Object to wrap the DOMContentLoad and WindowLoad logic
 * @since 1.1.3
 */
var Rexbuilder_App = (function($) {
  "use strict";

  var $sections = null;
  var $grids = null;
  var $accordions = null;
  var odometers = [];
  var accordionSettings = {};
  var elements = false;

  /**
   * In case of RexButtons inside a block that is a link
   * we must fix the buttons to re-wrap them with the correct class
   *
   */
  var fixRexButtons = function() {
    var buttons = [].slice.call( document.getElementsByClassName( 'rex-button-wrapper' ) );
    var tot_buttons = buttons.length, i = 0;
    for( i = 0; i < tot_buttons; i++ ) {
      var container = buttons[i].querySelector( '.rex-button-container' );
      if ( ! container ) {
        var newContainer = document.createElement('span');
        newContainer.className = 'rex-button-container';
        var toWrap = buttons[i].querySelector( '.rex-button-background' );
        toWrap.parentNode.insertBefore( newContainer, toWrap );
        newContainer.appendChild( toWrap );
      }
    }
  }

  var _linkDocumentListeners = function() {
    function handleYTPStart(e) {
      var ytContainer = $(e.target);
      var $toggle = ytContainer
        .parents(".youtube-player")
        .eq(0)
        .children(".rex-video-toggle-audio");
      var ytpPlayer = ytContainer.YTPGetPlayer();
      if (ytpPlayer !== undefined) {
        ytContainer.optimizeDisplay();
        if ($toggle.length != 0 && !$toggle.hasClass("user-has-muted")) {
          ytContainer.YTPUnmute();
        } else {
          ytpPlayer.mute();
          ytpPlayer.isMute = true;
          ytpPlayer.setVolume(0);
        }
      }
    }
    Rexbuilder_Util.$document.on("YTPStart", handleYTPStart);

    // Pause/Play video on block click
    function handleClickYTPOverlay(e) {
      var $ytvideo = $(e.target).parents(".rex-youtube-wrap");
      if ($ytvideo.length > 0) {
        var video_state = $ytvideo[0].state;
        if (video_state == 1) {
          $ytvideo.YTPPause();
        } else {
          $ytvideo.YTPPlay();
        }
      }
    }
    Rexbuilder_Util.$document.on("click", ".YTPOverlay", handleClickYTPOverlay);

    function handleClickBlockHasSlider(e) {
      // if (!$(this).hasClass("block-has-slider")) {
        var $itemContent = $(this).find(".grid-item-content");
        var $ytvideo = $itemContent.children(".rex-youtube-wrap");
        var $vimvideo = $itemContent.children(".rex-video-vimeo-wrap--block");
        var $mpvideo = $itemContent.children(".rex-video-wrap");

        if ($ytvideo.length > 0) {
          var video_state = $ytvideo[0].state;
          if (video_state == 1) {
            $ytvideo.YTPPause();
          } else {
            $ytvideo.YTPPlay();
          }
        }

        if ($vimvideo.length > 0) {
          var player = VimeoVideo.findVideo($vimvideo.find("iframe")[0]);
          if (player) {
            player
              .getPaused()
              .then(function(paused) {
                if (paused) {
                  player.play();
                } else {
                  player.pause();
                }
              })
              .catch(function(error) {
                // an error occurred
              });
          }
        }

        if ($mpvideo.length > 0) {
          var videoMp4 = $mpvideo.find(".rex-video-container").get(0);
          if (videoMp4.paused) {
            videoMp4.play();
          } else {
            videoMp4.pause();
          }
        }
      // }
    }

    Rexbuilder_Util.$document.on("click", ".block-has-slider", handleClickBlockHasSlider);

    // Adding audio functionallity
    function handleClickVideoToggleAudio(e) {
      e.stopPropagation();
      var $toggle = $(this);
      var $ytvideo = $toggle
        .parents(".youtube-player")
        .eq(0)
        .children(".rex-youtube-wrap");
      var $mpvideo = $toggle
        .parents(".mp4-player")
        .eq(0)
        .find(".rex-video-container");
      var $vimvideo = $toggle
        .parents(".vimeo-player")
        .eq(0)
        .find(".rex-video-vimeo-wrap--block");

      //youtube video
      if ($ytvideo.length > 0) {
        var isMuted = $ytvideo.get(0).player.isMuted();
        if (isMuted) {
          $ytvideo.YTPUnmute();
          $toggle.removeClass("user-has-muted");
        } else {
          $ytvideo.YTPMute();
          $toggle.addClass("user-has-muted");
        }
      }

      //mp4 video
      if ($mpvideo.length > 0) {
        if ($mpvideo.prop("muted")) {
          $mpvideo.prop("muted", false);
          $toggle.removeClass("user-has-muted");
        } else {
          $mpvideo.prop("muted", true);
          $toggle.addClass("user-has-muted");
        }
      }

      // vimeo video
      if ($vimvideo.length > 0) {
        var player = VimeoVideo.findVideo($vimvideo.find("iframe")[0]);
        if (player) {
          player
            .getVolume()
            .then(function(volume) {
              if (0 == volume) {
                player.setVolume(1);
                $toggle.removeClass("user-has-muted");
              } else {
                player.setVolume(0);
                $toggle.addClass("user-has-muted");
              }
              // volume = the volume level of the player
            })
            .catch(function(error) {
              // an error occurred
            });
        }
      }
    }
    Rexbuilder_Util.$document.on("click", ".rex-video-toggle-audio", handleClickVideoToggleAudio);

    // video controller tools
    // play video
    function handleClickPlayVideo(ev) {
      var $tool = $(ev.currentTarget);
      var $play_tool = $tool.parent().children('.play');
      var $target = $tool.parents('.rexpansive_section');
      $tool.removeClass('video-tool--view');
      $play_tool.addClass('video-tool--view');
      Rexbuilder_Util.pauseVideo( $target );
    }
    Rexbuilder_Util.$document.on('click', '.rex-video__controls .pause', handleClickPlayVideo);

    // pause video
    function handleClickPauseVideo(ev) {
      var $tool = $(ev.currentTarget);
      var $pause_tool = $tool.parent().children('.pause');
      var $target = $tool.parents('.rexpansive_section');
      $tool.removeClass('video-tool--view');
      $pause_tool.addClass('video-tool--view');
      Rexbuilder_Util.playVideo( $target );
    }
    Rexbuilder_Util.$document.on('click', '.rex-video__controls .play', handleClickPauseVideo);

    /**
     * Video controls simulator, in case of sticky section
     * (that cause problems of z-index)
     * @param  {MouseEvent} ev click on the sticky controls area
     * @return {void}
     */
    function handleClickStickyVideoControls(ev) {
      var $activeTool = $(ev.currentTarget).prev().find('.video-tool--view');
      $activeTool.click();
    }
    Rexbuilder_Util.$document.on('click', '.sticky-video-controls', handleClickStickyVideoControls);
  };

  /**
   * Launching indicators
   * @param  {jQuery} $grids grids
   * @return {void}
   */
  function launchIndicators( $grids ) {
    if ( 'undefined' !== typeof rexIndicator ) {
      $grids.find(".rex-indicator__placeholder").rexIndicator();
    }
  }

  /**
   * Launch distortion effect
   * @return {void}
   */
  function launchEffectDistortion() {
    $(".rex-effect-distortion").each(function(i,el) {
      var $el = $(el);
      if (1 == _plugin_frontend_settings.animations ) {
        $el.one("rs-animation-complete", function() {
          $el.rexEffect({
            effect: { 
              name: 'distortion',
              properties: { startDelay: 2500 }
            }
          });
        });
      } else {
        $el.rexEffect({
          effect: { 
            name: 'distortion',
            properties: { startDelay: 2500 }
          }
        });
      }
    });

    $(".rex-effect-distortion-section").each(function(i,el) {
      var $el = $(el);
      if (1 == _plugin_frontend_settings.animations ) {
        $el.one("rs-scrolled-complete", function() {
          $el.rexEffect({
            effect: { 
              name: 'distortion-section',
              properties: { startDelay: 2500 }
            }
          });
        });
      } else {
        $el.rexEffect({
          effect: { 
            name: 'distortion-section',
            properties: { startDelay: 2500 }
          }
        });
      }
    });
  }

  /**
   * Launch border space animated animation
   * @return {void}
   */
  function launchBorderSpaceAnimated() {
    $('[class*=border-space-animated-]').each(function(i,el) {
      var $el = $(el);
      $el.addClass("border-space-animated");
      if (1 == _plugin_frontend_settings.animations ) {
        if( Rexbuilder_Util.viewport().width > 768 ) {
          $el.one("rs-animation-complete", function() {
            $el.addClass("border-active");
          });
        } else {
          $el.parents(".rexpansive_section").one("rs-scrolled-complete", function() {
            $el.addClass("border-active");
          });
        }
      } else {
        $el.parents(".rexpansive_section").one("rs-scrolled-complete", function() {
          $el.addClass("border-active");
        });
      }
    });
  }

  /**
   * Launch rexscrolled plugin on sections
   * @param  {jQuery} $sections sections
   * @return {void}
   */
  function launchRexScrolled( $sections ) {
    // $sections.rexScrolled({
    //   callback: function(el) {
    //     if (Rexbuilder_Util.hasClass(el, "rex-element--animated")) {
    //       var $el = $(el);
    //       $el
    //         .addClass("run-animation")
    //         .on(Rexbuilder_Util._transitionEvent, function(e) {});
    //     }
    //   }
    // });

    function handleElementEndAnimation(el) {
      Rexbuilder_Util.removeClass(this, 'rex-element--animated');
      this.removeEventListener(Rexbuilder_Util._transitionEvent, handleElementEndAnimation);
    }

    var $animationElements = $(document.getElementsByClassName('rex-element--animated'));
    $animationElements.rexScrolled({
      callback: function (el) {
        el.addEventListener(Rexbuilder_Util._transitionEvent, handleElementEndAnimation);
        Rexbuilder_Util.addClass(el, 'run-animation');
      }
    });
  }

  /**
   * Launch rexscrollify animation plugin
   * @return {void}
   */
  function launchRexScrollify() {
    var $animationBlocks = $(document.getElementsByClassName('rs-animation'));
    $animationBlocks.rexScrollify({
      mobile: false
    });
  }

  /**
   * Launch sticky sections if any
   */
  var launchStickySections = function() {
    if ( 'undefined' !== typeof StickySection ) {
      var stickyJS = !( Rexbuilder_Util.cssPropertyValueSupported( 'position', 'sticky' ) || Rexbuilder_Util.cssPropertyValueSupported( 'position', '-webkit-sticky' ) );
      var stickySections = [].slice.call( document.getElementsByClassName( 'sticky-section' ) );
      var tot_stickySections = stickySections.length, i = 0;
      var stickyElementSelector = '';
      var overlayAnimation = false;
      var videoEl, videoControls, stickyVideoControls;

      for( i = 0; i < tot_stickySections; i++ ) {
        if ( Rexbuilder_Util.hasClass( stickySections[i], 'mp4-player' ) ) {
          stickyElementSelector = '.rex-video-wrap';

          // video controls fix
          videoEl = stickySections[i].querySelector(stickyElementSelector);
          videoControls = videoEl.querySelector('.rex-video__controls');
          if ( videoControls ) {
            stickyVideoControls = document.createElement('div');
            Rexbuilder_Util.addClass( stickyVideoControls, 'sticky-video-controls' );
            // Rexbuilder_Util.addClass( stickyVideoControls, 'rex-video__controls' );
            // stickyVideoControls.innerHTML = '<div class="pause video-tool"><div class="indicator"></div></div><div class="play video-tool"><div class="indicator"></div></div>';
            videoEl.insertAdjacentElement('afterend', stickyVideoControls);
          }
        } else if ( '' !== stickySections[i].style.backgroundImage ) {
          stickyElementSelector = '.sticky-background-simulator';
          var adjacent = stickySections[i].querySelector('.responsive-overlay');
          adjacent.insertAdjacentHTML('beforebegin', '<div class="sticky-background-simulator"></div>');
          var backgroundSimulator = stickySections[i].querySelector('.sticky-background-simulator');
          backgroundSimulator.style.backgroundImage = stickySections[i].style.backgroundImage;
        } else if ( Rexbuilder_Util.hasClass( stickySections[i], 'section-w-image' ) ) {
          stickyElementSelector = '.sticky-background-simulator';
          var adjacent = stickySections[i].querySelector('.responsive-overlay');
          adjacent.insertAdjacentHTML('beforebegin', '<div class="sticky-background-simulator"></div>');
          var backgroundSimulator = stickySections[i].querySelector('.sticky-background-simulator');
          backgroundSimulator.style.backgroundImage = 'url(' + stickySections[i].querySelector('.section-data').getAttribute('data-image_bg_section') + ')';
        }

        overlayAnimation = ( 'true' === stickySections[i].querySelector('.section-data').getAttribute('data-row_overlay_active') ? true : false );

        var stickySection = new StickySection(stickySections[i], {
          borderAnimation: true,
          stickyJS: stickyJS,
          stickyElementSelector: stickyElementSelector,
          overlayAnimation: overlayAnimation
        });
      }
    }
  };

  /**
   * Launch eventually scroll animations
   */
  var launchScrollCSSAnimations = function() {
    if ( 'undefined' !== typeof ScrollCSSAnimation ) {
      var fadesUps = [].slice.call(document.getElementsByClassName('fadeUpTextCSS'));
      var tot_fadesUps = fadesUps.length, i = 0;
      for( i = 0; i < tot_fadesUps; i++ ) {
        var fu = new ScrollCSSAnimation(fadesUps[i],{
          offset: 0.75
        });
      }
    }
  }

  /**
   * Launch eventually distance accordion (accordion on rows)
   *
   */
  var launchDistanceAccordion = function() {
    if ( 'undefined' !== typeof DistanceAccordion ) {
      var togglers = document.getElementsByClassName('distance-accordion-toggle');
      for ( var j=0, tot = togglers.length; j < tot; j++ ) {
        var inst = new DistanceAccordion(togglers[j]);
      }
    }
  }

  /**
   * Callback after load the pop up content
   * @return {void}
   */
  var launchAllAfterLoading = function() {
    var $popUpContent = $(this.target);
    var $newGrids = $popUpContent.find(".grid-stack-row");
    var $newSections = $popUpContent.find(".rexpansive_section");
    var $newAccordions = $popUpContent.find('.rex-accordion');
    var pageGrids = $grids.length;

    // launch photoswipe
    if ( $newSections.length > 0 ) {
      var tot_newSections = $newSections.length, i;
      for( i=0; i < tot_newSections; i++ ) {
        $newSections[i].setAttribute( 'data-rexlive-section-number', pageGrids + i );
        var pswchilds = $newSections[i].getElementsByClassName( "pswp-figure" );
        if ( pswchilds.length === 0 ) {
          Rexbuilder_Util.removeClass( $newSections[i], 'photoswipe-gallery' );
        }
      }
      Rexbuilder_Photoswipe.init(".photoswipe-gallery");
    }

    // main grid
    if( $newGrids.length > 0 ) {
      $newGrids.perfectGridGalleryEditor({
        editorMode: Rexbuilder_Util.editorMode
      });
    }

    // accordions
    if( $newAccordions.length > 0 ) {
      $newAccordions.rexAccordion(accordionSettings);
    }

    // sliders
    RexSlider.init();

    // distance accordions
    if ( 'undefined' !== typeof DistanceAccordion ) {
      var togglers = this.target.getElementsByClassName('distance-accordion-toggle');
      for ( var j=0, tot = togglers.length; j < tot; j++ ) {
        var inst = new DistanceAccordion(togglers[j], {
          context: this.target
        });
      }
    }

    // split scrolls
    launchSplitScollable( this.target, this.target );
  }

  /**
   * Callback after load the popup iframe 
   * @return {void}
   */
  var fixIframeContentAfterLoading = function() {
    var rexLiveContent = this.iframeContainer.contentDocument.querySelector('.rexbuilder-live-content');
    rexLiveContent.parentElement.removeChild(rexLiveContent)
    this.iframeContainer.contentDocument.body.insertBefore(rexLiveContent, this.iframeContainer.contentDocument.body.firstChild);
  }

  /**
   * Launch popupcontent plugin on found launchers
   * @return {void}
   */
  var launchPopUpContent = function() {
    if ( 'undefined' !== typeof PopUpContent ) {     
      var btns = [].slice.call( document.getElementsByClassName('popup-content-button') );
      var tot_btns = btns.length, i = 0;

      for( i=0; i < tot_btns; i++ ) {
        new PopUpContent(btns[i], {
          // getPopUpContentComplete: launchAllAfterLoading,
          contentRetrieveMethod: 'iframe',
          getPopUpContentComplete: fixIframeContentAfterLoading,
          ajaxSettings: {
            type: "GET",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rex_get_popup_content",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            },
          }
        });
      }
    }
  }

  /**
   * Fixing a builder section that contains scrollable content
   * 1) set the blocks heights
   * 2) destroy the grid plugin
   * 3) set auto height on the section
   * @return {void}
   */
  function fixScrollableGridGallery() {
    // destroyGridGallery
    var grid = this.element.querySelector('.perfect-grid-gallery');
    var $grid = $(grid);
    var i;

    for( i=0; i < this.totScrollEls; i++ ) {
      this.scrollEls[i].style.height = this.scrollEls[i].offsetHeight + 'px';
    }

    for( i=0; i < this.totOpacityEls; i++ ) {
      this.opacityEls[i].style.height = this.opacityEls[i].offsetHeight + 'px';
    }

    // destroy tha grid
    $grid.data('plugin_perfectGridGalleryEditor').destroyGridGallery();
    grid.style.height = '';
  };

  /**
   * If SplitScrollable plugin is defined, launch it on every intersted section
   * @param  {Element} context               where to search the sections
   * @param  {customScrollContainer} customScrollContainer container in which watch the scroll event
   * @return {void}
   */
  var launchSplitScollable = function( context, customScrollContainer ) {
    if ( 'undefined' !== typeof SplitScrollable ) {
      if ( Rexbuilder_Util.viewport().width >= _plugin_frontend_settings.splitScrollable.minViewportWidth ) {
        var scrbls = [].slice.call( context.getElementsByClassName('split-scrollable') );
        var tot_scrbls = scrbls.length, i;
        for( i=0; i < tot_scrbls; i++ ) {
          var inst = new SplitScrollable(scrbls[i], {
            scrollElsToWatchClass: 'text-wrap',
            initializeComplete: fixScrollableGridGallery,
            customScrollContainer: ( 'undefined' !== typeof customScrollContainer ? customScrollContainer : null )
          });
        }
      }
    }
  };

  /**
   * Launching odometer with some options
   * Store globally the odometer elements for future use
   * @param {NODE} target element on which launch odometer
   * @since 2.0.0
   * @date 26-02-2019
   */
  var launch_odometer = function( target ) {
    if ( 'undefined' !== Odometer )
    {
      var fval = target.innerText;
      // Check if user want yearly increment of value
      if ( null !== target.getAttribute( 'data-yearly-inc' ) )
      {
        // if exists get the value, comparing today to the site date pubblication
        if ( '' !== _plugin_frontend_settings.sitedate )
        {
          var siteDate = new Date( _plugin_frontend_settings.sitedate );
          var today = new Date();
          var mult = today.getFullYear() - siteDate.getFullYear();

          var y_inc = target.getAttribute( 'data-yearly-inc' );
          fval = parseInt( fval ) + ( parseInt( y_inc ) * mult );
        }
      }

      if ( null !== target.getAttribute( 'data-montly-inc' ) )
      {
        // if exists get the value, comparing today to the site date pubblication
        if ( '' !== _plugin_frontend_settings.sitedate )
        {
          var siteDate = new Date( _plugin_frontend_settings.sitedate );
          var today = new Date();
          var mult = today.getMonth() - siteDate.getMonth();

          var m_inc = target.getAttribute( 'data-montly-inc' );
          fval = parseInt( fval ) + ( parseInt( m_inc ) * mult );
        }
      }

      target.setAttribute('data-final-value', fval);
      var tval = target.getAttribute('data-start-value');
      if ( null == tval )
      {
        tval = '';
        // console.log(target.innerText, target.innerText.length);
        for (var i=0, tot_nums = target.innerText.length; i<tot_nums; i++)
        {
          tval += "1";
        }
      }
      var oElement = new Odometer({
        el: target,
        value: tval,
        format: _plugin_frontend_settings.odometer.format,
        theme: _plugin_frontend_settings.odometer.theme,
      });
      // odometers.push(oElement);
      return oElement;
    }
  };

  function launchInlineGallery() {
    var $inline_galleries = Rexbuilder_Util.$rexContainer.find('.inline-pswp-gallery');
    $inline_galleries.on('click', Rexbuilder_Photoswipe.init_inline_pswp);
  }

  /**
   * All front end effects in one function
   * @return {vodi}
   */
  function launchFrontEndEffects() {
    if( false == _plugin_frontend_settings.user.editing ) {
      // inline photoswipe
      launchInlineGallery();

      // launch distortion effect
      launchEffectDistortion();

      // launch border space animated
      launchBorderSpaceAnimated();

      // launch rexScrolled
      launchRexScrolled( $sections );

      // launch rexScrollify
      if (1 == _plugin_frontend_settings.animations ) {
        launchRexScrollify();
      }

      // sticky sections
      launchStickySections();
      // launch scrollCSSAnimations
      launchScrollCSSAnimations();
      // launch distance accordions
      launchDistanceAccordion();
      // launch popUpContent
      launchPopUpContent();
      // launch splitScrollable
      launchSplitScollable( document );
    }
  }

  var init = function() {
    Rexbuilder_Util.init();
    Rexbuilder_Dom_Util.init();
    
    Rexbuilder_Rexbutton.init();
    
    if ( elements ) {
      Rexbuilder_Rexelement.init();   // 1st
      Rexbuilder_Rexwpcf7.init();     // 2nd
    }

    if ( Rexbuilder_Util.editorMode ) {
      /* The order between these 2 is very important! */

      Rexbuilder_CreateBlocks.init();
      Rexbuilder_Util_Editor.init();
      Rexbuilder_Color_Palette.init();
      Rexbuilder_Overlay_Palette.init();
      Rexbuilder_Section.init();
      Rexbuilder_Section_Editor.init();
      Rexbuilder_Block.init();
      Rexbuilder_Block_Editor.init();
      Rexbuilder_Util_Editor.addDocumentListeners();
      Rexbuilder_Util_Editor.addWindowListeners();
      Rexbuilder_Util_Editor.addDnDEvents();
      TextEditor.init();
      Rexbuilder_Section_Editor.triggerRowDataChange();
    } else {
      // fixes for front end only
      fixRexButtons();
    }

    Rex_Navigator.init();
    //Rexbuilder_FormFixes.init();

    Rexbuilder_Util.addWindowListeners();

    $sections = Rexbuilder_Util.$rexContainer.find(".rexpansive_section");
    $grids = Rexbuilder_Util.$rexContainer.find(".grid-stack-row");
    $accordions = Rexbuilder_Util.$rexContainer.find('.rex-accordion');

    /* -- Launching the grid -- */
    // $grids.find(".wrapper-expand-effect").expandEffect();
    if( $grids ) {
      $grids.perfectGridGalleryEditor({
        editorMode: Rexbuilder_Util.editorMode
      });
    }

    // listen one time to edit dom layout ending
    Rexbuilder_Util.$document.one( 'rexlive:editDomLayoutEnd', launchFrontEndEffects );

    Rexbuilder_Util.launchEditDomLayout();

    /** -- Launching plugins only on "real" frontend */
    if ( !Rexbuilder_Util.editorMode ) {
      /* -- Launching Photoswipe -- */
      // prevent pswp errors
      $sections.each(function(i, e) {
        var pswchilds = e.getElementsByClassName("pswp-figure");
        if ( pswchilds.length === 0 ) {
          Rexbuilder_Util.removeClass(e,'photoswipe-gallery');
        }
      });
      // Rexbuilder_Photoswipe.init(".photoswipe-gallery");

      /** -- Launching Odomter -- */
      var odometersEls = [].slice.call( document.getElementsByClassName('rex-num-spin') );
      var oindex, tot_odometersEls = odometersEls.length;
      for( oindex = 0; oindex < tot_odometersEls; oindex++ ) {
        var oElement = launch_odometer( odometersEls[oindex] );
        odometers.push(oElement);
        $(odometersEls[oindex]).rexScrolled({
          callback: function(el)
          {
            el.innerHTML = el.getAttribute('data-final-value');
          }
        })
      }

      /** -- Launching slideshow -- **/
      var $slideshow = Rexbuilder_Util.$body.find('.rex-slideshow');
      if ( $slideshow.length > 0 )
      {
        $slideshow.rexSlideshow();
      }
    }

    if ( true == _plugin_frontend_settings.native_scroll_animation ) {
      var excluded_links = [
        '[href="#"]',
        ".no-smoothing",
        ".vertical-nav-link",
        ".rex-vertical-nav-link",
        ".woocommerce-review-link"
      ];

      // Smooth scroll on all internal links
      var $linksToSmooth = Rexbuilder_Util.$body.find('a[href*="#"]');
      for (var i = 0, tot_excluded_links = excluded_links.length; i < tot_excluded_links; i++) {
        $linksToSmooth = $linksToSmooth.not(excluded_links[i]);
      }

      $linksToSmooth = $linksToSmooth.not(_filterLinksToSmooth);

      function handleLinkToSmooth() {
        if ( location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname ) {
          var target = $(this.hash);
          target = target.length
            ? target
            : Rexbuilder_Util.$rexContainer.find(
                "[name=" + this.hash.slice(1) + "]"
              );
          if (target.length) {
            Rexbuilder_Util.smoothScroll(target);
            return false;
          }
        }
      }
      $linksToSmooth.on('click', handleLinkToSmooth);

      // advanced check to exclude woocommerce tabs
      var _filterLinksToSmooth = function(index) {
        if ($(this).parents(".woocommerce-tabs").length != 0) {
          return true;
        } else {
          return false;
        }
      };
    }

    _linkDocumentListeners();

    // Starting slider
    RexSlider.init();

    Rexbuilder_Util.launchVideoPlugins();

    Rexbuilder_Util.playAllVideos();

    accordionSettings = {
      durationOpen: 10,
      durationClose: 300
    };

    if( Rexbuilder_Util.editorMode ) {
      accordionSettings.open = {
        progressClbk: function(data) {
          // var content = data.properties.$content[0];
          var block = data.properties.$content.parents('.grid-stack-item')[0];
          var grid = data.properties.$content.parents('.grid-stack').data("gridstack");
          // grid.resize(block,null,Math.round(content.offsetHeight/grid.opts.cellHeight) + data.properties.$toggle[0].offsetHeight);
          // grid.resize(block,null,Math.round( ( content.offsetHeight + data.properties.$toggle[0].offsetHeight ) / grid.opts.cellHeight ));
          grid.resize(block,null,Math.round( data.element.parentElement.offsetHeight / grid.opts.cellHeight ));
        }
      };
      accordionSettings.close = {
        progressClbk: function(data) {
          // var content = data.properties.$content[0];
          var block = data.properties.$content.parents('.grid-stack-item')[0];
          var start_h = block.children[0].getAttribute('data-gs_start_h');
          var grid = data.properties.$content.parents('.grid-stack').data("gridstack");
          grid.resize(block,null,Math.round( parseInt(start_h) ));
        }
      };
    } else {
      accordionSettings.open = {
        // startClbk: function(data) {
          // data.element.setAttribute('data-toggle-height', data.properties.$toggle[0].offsetHeight + parseInt(data.element.parentElement.style.paddingTop) + parseInt(data.element.parentElement.style.paddingBottom) );
          // data.$element.parents('.grid-stack-item-content').css('position','relative');

          // var $grid = data.properties.$content.parents('.grid-stack');
          // var pgge = $grid.data("plugin_perfectGridGalleryEditor");
          // var grid = pgge.properties.gridstackInstance;
          // grid.batchUpdate();
        // },
        // progressClbk: function(data, step) {
        //   // var content = data.properties.$content[0];
        //   var block = data.properties.$content.parents('.grid-stack-item')[0];
        //   var start_h = parseInt( block.children[0].getAttribute('data-gs_start_h') );
        //   var $grid = data.properties.$content.parents('.grid-stack');
        //   var pgge = $grid.data("plugin_perfectGridGalleryEditor");
        //   var grid = pgge.properties.gridstackInstance;
        //   var toggleHeight = parseInt( data.element.getAttribute('data-toggle-height') ) + parseInt( data.properties.$content[0].style.height );

        //   var base_h = ( 0 !== step ? toggleHeight + pgge.properties.gutter : 0 );
        //   var fstart_h = ( 0 === step ? start_h : 0 );
        //   var temp = Math.ceil( ( base_h + ( fstart_h * grid.opts.cellHeight ) ) / grid.opts.cellHeight );
        //   temp = temp < start_h ? start_h : temp;

        //   if( temp > parseInt(block.getAttribute('data-gs-height')) ) {
        //     // grid.batchUpdate();
        //     grid.resize(block,null,temp);
        //     // grid.commit();
        //   }
        // },
        completeClbk: function(data) {
          var block_height = data.$element.parents('.text-wrap')[0].offsetHeight;

          var block = data.properties.$content.parents('.grid-stack-item')[0];
          var pgge = data.properties.$content.parents('.grid-stack').data("plugin_perfectGridGalleryEditor");
          if(pgge) {
            var grid = pgge.properties.gridstackInstance;
  
            var temp = Math.ceil( ( block_height + pgge.properties.gutter ) / grid.opts.cellHeight );
            grid.batchUpdate();
            grid.resize(block,null,temp);
            grid.commit();
          }

          data.properties.$content.addClass('rSlideInTop').one(Rexbuilder_Util._animationEvent, function() {
            $(this).removeClass('rSlideInTop');
          });
          
        //   var $grid = data.properties.$content.parents('.grid-stack');
        //   var pgge = $grid.data("plugin_perfectGridGalleryEditor");
        //   var grid = pgge.properties.gridstackInstance;
        //   grid.commit();
        }
      };
      accordionSettings.close = {
        startClbk: function(data) {
          data.properties.$content.addClass('rSlideOutTop').one(Rexbuilder_Util._animationEvent, function() {
            $(this).removeClass('rSlideOutTop');
          });
          // data.element.setAttribute('data-toggle-height', data.properties.$toggle[0].offsetHeight + parseInt(data.element.parentElement.style.paddingTop) + parseInt(data.element.parentElement.style.paddingBottom) );
          
          // var $grid = data.properties.$content.parents('.grid-stack');
          // var pgge = $grid.data("plugin_perfectGridGalleryEditor");
          // var grid = pgge.properties.gridstackInstance;
          // grid.batchUpdate();
        },
        // progressClbk: function(data, step) {
        //   // var content = data.properties.$content[0];
        //   var block = data.properties.$content.parents('.grid-stack-item')[0];
        //   var start_h = parseInt( block.children[0].getAttribute('data-gs_start_h') );
        //   var $grid = data.properties.$content.parents('.grid-stack');
        //   var pgge = $grid.data("plugin_perfectGridGalleryEditor");
        //   var grid = pgge.properties.gridstackInstance;
        //   var toggleHeight = parseInt( data.element.getAttribute('data-toggle-height') ) + parseInt( data.properties.$content[0].style.height );

        //   var base_h = ( 1 !== step ? toggleHeight + pgge.properties.gutter : 0 );
        //   var fstart_h = ( 1 === step ? start_h : 0 );
        //   var temp = Math.ceil( ( base_h + ( fstart_h * grid.opts.cellHeight ) ) / grid.opts.cellHeight );
        //   temp = temp > start_h ? temp : start_h;

        //   if( temp < parseInt(block.getAttribute('data-gs-height')) ) {
        //     // grid.batchUpdate();
        //     grid.resize( block,null,temp );
        //     // grid.commit();
        //   }
        // },
        completeClbk: function(data) {
          var block_height = data.$element.parents('.text-wrap')[0].offsetHeight;

          var block = data.properties.$content.parents('.grid-stack-item')[0];
          var pgge = data.properties.$content.parents('.grid-stack').data("plugin_perfectGridGalleryEditor");
          if(pgge) {
            var grid = pgge.properties.gridstackInstance;
  
            var temp = Math.ceil( ( block_height + pgge.properties.gutter ) / grid.opts.cellHeight );
            grid.batchUpdate();
            grid.resize(block,null,temp);
            grid.commit();
          }
        //   data.$element.parents('.grid-stack-item-content').css('position','');
        //   var $grid = data.properties.$content.parents('.grid-stack');
        //   var pgge = $grid.data("plugin_perfectGridGalleryEditor");
        //   var grid = pgge.properties.gridstackInstance;
        //   grid.commit();
        }
      };
    }
    
    $accordions.rexAccordion(accordionSettings);

    // Other accordion plugin
    // var collapseSettings = {
    //   duration: 500,
    //   open: function() {
    //     var $content = $(this);
    //     $content.css('display','block');
    //     $content.imagesLoaded(function() {
    //       console.log('magini garicatre');
    //       var block_height = $content.parents('.text-wrap')[0].offsetHeight;
  
    //       var block = $content.parents('.grid-stack-item')[0];
    //       var pgge = $content.parents('.grid-stack').data("plugin_perfectGridGalleryEditor");
    //       if(pgge) {
    //         var grid = pgge.properties.gridstackInstance;
  
    //         var temp = Math.ceil( ( block_height + pgge.properties.gutter ) / grid.opts.cellHeight );
    //         grid.batchUpdate();
    //         grid.resize(block,null,temp);
    //         grid.commit();
    //       }
  
    //       $content.addClass('rSlideInTop').one(Rexbuilder_Util._animationEvent, function() {
    //         $(this).removeClass('rSlideInTop');
    //       });
    //     });
    //   },
    //   close: function() {
    //     var $content = $(this);
    //     $content.addClass('rSlideOutTop').one(Rexbuilder_Util._animationEvent, function() {
    //       $content.removeClass('rSlideOutTop').css('display','none');
    //       var block_height = $content.parents('.text-wrap')[0].offsetHeight;
  
    //       var block = $content.parents('.grid-stack-item')[0];
    //       var pgge = $content.parents('.grid-stack').data("plugin_perfectGridGalleryEditor");
    //       if(pgge) {
    //         var grid = pgge.properties.gridstackInstance;
  
    //         var temp = Math.ceil( ( block_height + pgge.properties.gutter ) / grid.opts.cellHeight );
    //         grid.batchUpdate();
    //         grid.resize(block,null,temp);
    //         grid.commit();
    //       }
    //     });        
    //   }
    // };

    // $accordions.collapse(collapseSettings);

    // Another accordion plugin

    // $accordions.dumbAccordion({
    //   controlElement: '.rex-accordion--toggle',
    //   contentElement: '.rex-accordion--content'
    // }).on('open', function() {
    //   var $content = $(this);
    //   $content.css('display','block');
    //   $content.imagesLoaded(function() {
    //     console.log('magini garicatre');
    //     var block_height = $content.parents('.text-wrap')[0].offsetHeight;

    //     var block = $content.parents('.grid-stack-item')[0];
    //     var pgge = $content.parents('.grid-stack').data("plugin_perfectGridGalleryEditor");
    //     if(pgge) {
    //       var grid = pgge.properties.gridstackInstance;

    //       var temp = Math.ceil( ( block_height + pgge.properties.gutter ) / grid.opts.cellHeight );
    //       grid.batchUpdate();
    //       grid.resize(block,null,temp);
    //       grid.commit();
    //     }

    //     $content.addClass('rSlideInTop').one(Rexbuilder_Util._animationEvent, function() {
    //       $(this).removeClass('rSlideInTop');
    //     });
    //   });
    // }).on('close',function() {
    //   var $content = $(this);
    //   $content.addClass('rSlideOutTop').one(Rexbuilder_Util._animationEvent, function() {
    //     $content.removeClass('rSlideOutTop').css('display','none');
    //     var block_height = $content.parents('.text-wrap')[0].offsetHeight;

    //     var block = $content.parents('.grid-stack-item')[0];
    //     var pgge = $content.parents('.grid-stack').data("plugin_perfectGridGalleryEditor");
    //     if(pgge) {
    //       var grid = pgge.properties.gridstackInstance;

    //       var temp = Math.ceil( ( block_height + pgge.properties.gutter ) / grid.opts.cellHeight );
    //       grid.batchUpdate();
    //       grid.resize(block,null,temp);
    //       grid.commit();
    //     }
    //   });
    // });

  };

  var load = function() {
    // @bugfix on other layouts than desktop with mixed customization definitions
    // @deprecated i don't like this solution, too much expensive
    
    // var chosenLayoutName = Rexbuilder_Util.chooseLayout();
    // if ( 'default' !== chosenLayoutName ) {
      // Rexbuilder_Util.edit_dom_layout(chosenLayoutName);
    // }

    if ( Rexbuilder_Util.editorMode ) {
      Rexbuilder_Util_Editor.load();
    }

    /* -- Launching the textfill -- */
    var $textFillContainer = $(".text-fill-container-canvas");
    if ( $textFillContainer.length > 0 ) {
      $textFillContainer.textFill({
        relative: true,
        relativeWrap: ".perfect-grid-item",
        fontFamily: _plugin_frontend_settings.textFill.font_family,
        fontWeight: _plugin_frontend_settings.textFill.font_weight
      });

      function resizeTextfillOnComplete() {
        Rexbuilder_Util.$window.resize();
      }
      $textFillContainer.on("textfill-render-complete", resizeTextfillOnComplete);
    }

    // autoplay sliders
    RexSlider.startAutoPlay();

    if( $grids ) {
      launchIndicators( $grids );
    }

    // launchFrontEndEffects();

    Rexbuilder_Util.galleryPluginActive = true;
  };

  return {
    init: init,
    load: load
  };
})(jQuery);

;(function() {
  "use strict";

  // Waiting until the ready of the DOM
  document.addEventListener('DOMContentLoaded', Rexbuilder_App.init );

  // Waiting for the complete load of the window
  window.addEventListener('load', Rexbuilder_App.load );
})();
