// var lodash = _.noConflict();

/**
 * Add Object to wrap the DOMContentLoad and WindowLoad logic
 * @since 1.1.3
 */
var Rexbuilder_App = (function($) {
	"use strict";

	// Constants
	var IS_CHROME = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	var SPLIT_SCROLLABLE_IN_PAGE = 'undefined' !== typeof SplitScrollable;
	var STICKY_SECTION_IN_PAGE = 'undefined' !== typeof StickySection;

  var $sections = null;
  var $grids = null;
  var $builderAccordions = null;
  var $otherAccordions = null;
  var odometers = [];
  var accordionSettings = {};
  var gridInstances = [];

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
  };

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
      var $activeTool = $(ev.currentTarget).parent().find('.video-tool--view');
      $activeTool.click();
    }
    Rexbuilder_Util.$document.on('click', '.sticky-video-controls', handleClickStickyVideoControls);
  };

  /**
   * Launch textFill plugin
   * @return {void}
   */
  function launchTextFill() {
    var $textFillContainer = $(".text-fill-container-canvas");
    if ( $textFillContainer.length === 0 ) return;

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

  /**
   * Launching indicators
   * @param  {jQuery} $grids grids
   * @return {void}
   */
  function launchIndicators( $grids ) {
    if ( 'undefined' === typeof rexIndicator ) return;

    $grids.find(".rex-indicator__placeholder").rexIndicator();
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
        if( Rexbuilder_Util.globalViewport.width > 768 ) {
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
	 * @returns	{void}
	 * @since		2.0.?
	 * @version	2.0.4		Refactor: removed simulation background blocks from here,
	 * 									put them in StickySection.prepare
   */
  function launchStickySections() {
    if ( !STICKY_SECTION_IN_PAGE ) return;

    var stickyJS = !( Rexbuilder_Util.cssPropertyValueSupported( 'position', 'sticky' ) || Rexbuilder_Util.cssPropertyValueSupported( 'position', '-webkit-sticky' ) );
		var stickySections = Array.prototype.slice.call( document.getElementsByClassName( 'sticky-section' ) );
		var stickySection;
    var tot_stickySections = stickySections.length, i = 0;
    var stickyElementSelector = '';
		var overlayAnimation = false;

		StickySection.destroyHandlers();

    for( i = 0; i < tot_stickySections; i++ ) {
			stickySection = stickySections[i];

      // Destroy before re-launching
      if (null !== StickySection.data(stickySection)) {
      	StickySection.data(stickySection).destroy();
      }

      if (Rexbuilder_Util.hasClass(stickySection, 'mp4-player')) {
      	stickyElementSelector = '.rex-video-wrap';
      } else if ('' !== stickySection.style.backgroundImage || Rexbuilder_Util.hasClass(stickySection, 'section-w-image')) {
      	stickyElementSelector = '.sticky-background-simulator';
      }

      overlayAnimation = ( 'true' === stickySection.querySelector('.section-data').getAttribute('data-row_overlay_active') ? true : false );

      new StickySection(stickySection, {
        borderAnimation: true,
        stickyJS: stickyJS,
        stickyElementSelector: stickyElementSelector,
        overlayAnimation: overlayAnimation
      });

      // activate reveal text on scroll effect
      // and remove animated blocks, sticky is enough
      // using RexGrid instance to avoid selectors
      if ( 'undefined' !== typeof RevealOpacityOnScroll && _plugin_frontend_settings.stickySection.revealContentOnScroll ) {
        var rexgrid = RexGrid.data(stickySection.querySelector('.perfect-grid-gallery'));
        for ( var j=0; j < rexgrid.gridBlocksTotal; j++ ) {
          Rexbuilder_Util.removeClass( rexgrid.gridBlocks[j].el, 'has-rs-animation' );
          Rexbuilder_Util.removeClass( rexgrid.gridBlocks[j].el, 'rs-animation' );

          var textWrap = rexgrid.gridBlocks[j].el.querySelector('.text-wrap');
          new RevealOpacityOnScroll( textWrap, {
            offset: 1,
            transition: false
          } );
        }

        // var bs = Array.prototype.slice.call( stickySection.getElementsByClassName('perfect-grid-item') );
        // var z, tot = bs.length;
        // for( z=0; z<tot; z++ ) {
        //   bs[z].setAttribute('data-rs-animation-force-launch', true);
        //   var j, textWrap = bs[z].querySelector('.text-wrap');
        //   new RevealOpacityOnScroll( textWrap, {
        //     offset: 1,
        //     transition: false
        //   } );
        // }
      }
    }
  }

  /**
   * Launch eventually scroll animations
   * @deprecated 2.0.5
   */
  var launchScrollCSSAnimations = function() {
    if ( 'undefined' === typeof ScrollCSSAnimation ) return;

    var fadesUps = [].slice.call(document.getElementsByClassName('fadeUpTextCSS'));
    var tot_fadesUps = fadesUps.length, i = 0;
    for( i = 0; i < tot_fadesUps; i++ ) {
      var fu = new ScrollCSSAnimation(fadesUps[i],{
        offset: 0.75
      });
    }
  }

  /**
   * Launch eventually distance accordion (accordion on rows)
   *
   */
  var launchDistanceAccordion = function() {
    if ( 'undefined' === typeof DistanceAccordion ) {
      return;
    }
    var togglers = document.getElementsByClassName('distance-accordion-toggle');
    for ( var j=0, tot = togglers.length; j < tot; j++ ) {
      var inst = new DistanceAccordion(togglers[j]);
    }
  }

  /**
   * Callback after load the popup iframe
   * @return {void}
   */
  var fixIframeContentAfterLoading = function() {
    var rexLiveContent = this.iframeContainer.contentDocument.querySelector('.rexbuilder-live-content');
    rexLiveContent.parentElement.removeChild(rexLiveContent);
    this.iframeContainer.contentDocument.body.insertBefore(rexLiveContent, this.iframeContainer.contentDocument.body.firstChild);
  };

  /**
   * Launch popupcontent plugin on found launchers
   * @return {void}
   */
  var launchPopUpContent = function() {
    if ( 'undefined' === typeof PopUpContent ) {
      return;
    }

    var btns = [].slice.call( document.getElementsByClassName('popup-content-button') );
    var tot_btns = btns.length, i = 0;

    for( i=0; i < tot_btns; i++ ) {
      if (null !== PopUpContent.data(btns[i])) continue;

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
  };

  function listenPopUpContentEvents() {
    if ( 'undefined' === typeof PopUpContent ) {
      return;
    }

    if ( ! Rexbuilder_Util.isIframe ) {
      // listen messages from popupcontent iframe
      window.addEventListener("message", receivePopUpContentMsgs, false);

      // listen events from popupcontent object
      document.addEventListener('popUpContent:open', onPopUpContentOpen);
      document.addEventListener('popUpContent:close', opPopUpContentClose);

      var sliders = Array.prototype.slice.call( document.getElementsByClassName('rex-slider-wrap'));
      var i, tot = sliders.length;
      var flktData = [];

      for( i=0; i<tot; i++ ) {
        var flkt = Flickity.data( sliders[i] );
        if ( !flkt ) continue;
        flktData.push( flkt );
      }

      function onPopUpContentOpen() {
        // on popup open, stop all the autoplay sliders
        var j;
        for( j=0; j<flktData.length; j++ ) {
          if ( flktData[j].options.autoPlay ) {
            flktData[j].pausePlayer();
          }
        }
      }

      function opPopUpContentClose() {
        // on popup close, restart the autoplays
        var j;
        for( j=0; j<flktData.length; j++ ) {
          if ( flktData[j].options.autoPlay ) {
            flktData[j].unpausePlayer();
          }
        }
      }
    }
  }

  function receivePopUpContentMsgs( event ) {
    if ( ! event.data.rexliveEvent ) {
      return;
    }

    switch( event.data.eventName ) {
      case "popUpContent:pswpOpened":
        Rexbuilder_Util.addClass( document.body, 'popup-content--active--pswp-open' );
        break;
      case "popUpContent:pswpClosed":
        Rexbuilder_Util.removeClass( document.body, 'popup-content--active--pswp-open' );
        break;
      case 'popUpContent:changePage':
        if ( '' !== event.data.href ) {
          window.location = event.data.href;
        }
        break;
      default:
        break;
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
    var rexGridEl = this.element.querySelector('.perfect-grid-gallery');
    var gridInfo = getRexGridInstance( rexGridEl );
    var i, j;

    if ( ! gridInfo.instance ) return;

    reorderScrollableEls( this, gridInfo.instance );
    reorderOpacityEls( this, gridInfo.instance );

    for( i=0; i < this.totScrollEls; i++ ) {
      this.scrollEls[i].style.height = '';
    }

    for( i=0; i < this.totOpacityEls; i++ ) {
      this.opacityEls[i].style.top = '';
    }

    // set RexBlock options on scroll and opacity blocks
    for( i=0; i < gridInfo.instance.gridBlocksTotal; i++ ) {
      for( j=0; j<this.totScrollEls; j++ ) {
        if ( this.scrollEls[j] === gridInfo.instance.gridBlocks[i].el ) {
					gridInfo.instance.gridBlocks[i].setHeight = false;
					break;
        }
      }

      for( j=0; j<this.totOpacityEls; j++ ) {
				if ( this.opacityEls[j] === gridInfo.instance.gridBlocks[i].el ) {
					gridInfo.instance.gridBlocks[i].setTop = false;
					break;
        }
      }
    }

    // do not set the grid height, its uneccessary
    rexGridEl.style.height = '';
    gridInfo.instance.properties.gridHeightSettable = false;
	};

	/**
	 * Orders the scrollable elements from SplitScrollable
	 * based on the already ordered gridBlocks.
	 * @param		{SplitScrollable}		splitScrollableInstance
	 * @param		{RexGrid}						rexGridInstance
	 * @returns	{void}
	 * @since		2.0.4
	 */
	function reorderScrollableEls(splitScrollableInstance, rexGridInstance) {
		// Reordering scrollable elements based on the already ordered gridBlocks
		splitScrollableInstance.scrollEls = rexGridInstance.gridBlocks
			.filter(function(gridBlock) {
				return Rexbuilder_Util.hasClass(gridBlock.el, splitScrollableInstance.options.scrollElsClass);
			})
			.map(function(gridBlock) {
				return gridBlock.el;
			});

		splitScrollableInstance.scrollElsToWatch = rexGridInstance.gridBlocks
			.filter(function(gridBlock) {
				return Rexbuilder_Util.hasClass(gridBlock.el, splitScrollableInstance.options.scrollElsClass);
			})
			.map(function(gridBlock) {
				return gridBlock.el.querySelector('.' + splitScrollableInstance.options.scrollElsToWatchClass);
			});

		var i = 0;
		var j = 0;
		var count = 0;

		for (; i < rexGridInstance.gridBlocksTotal; i++) {
			for (j = 0; j < splitScrollableInstance.totScrollEls; j++) {
				if (splitScrollableInstance.scrollEls[j] === rexGridInstance.gridBlocks[i].el) {
					splitScrollableInstance.scrollEls[j].style.WebKitBoxOrdinalGroup = count + 1;
					splitScrollableInstance.scrollEls[j].style.MozFlexOrder = count;
					splitScrollableInstance.scrollEls[j].style.OOrder = count;
					splitScrollableInstance.scrollEls[j].style.MSOrder = count;
					splitScrollableInstance.scrollEls[j].style.order = count;
					splitScrollableInstance.scrollElsToWatch[j].setAttribute('data-scroll-el-index', count);

					count++;
					break;
				}
			}
		}
	}

  /**
   * Reorder opacity blocks based on grid order for a SplitScrollable element
   * @param  {SplitScrollable} splitScrollableInstance split scrollable instance passed by reference
   * @param  {RexGrid} rexGridInstance         rexgrid instance passed by reference
   * @return {void}
   */
  function reorderOpacityEls( splitScrollableInstance, rexGridInstance ) {
    splitScrollableInstance.opacityEls = rexGridInstance.gridBlocks.filter( function( gridBlock ) {
      return Rexbuilder_Util.hasClass( gridBlock.el, splitScrollableInstance.options.opacityElsClass );
    }).map( function( gridBlock ) {
      return gridBlock.el;
    });
  }

  /**
   * If SplitScrollable plugin is defined, launch it on every intersted section
   * @return {void}
   */
  function launchSplitScrollable() {
  	if (!SPLIT_SCROLLABLE_IN_PAGE) return;

  	if (Rexbuilder_Util.globalViewport.width < _plugin_frontend_settings.splitScrollable.minViewportWidth) {
  		return;
  	}

  	var scrbls = Array.prototype.slice.call(document.getElementsByClassName('split-scrollable'));
  	var tot_scrbls = scrbls.length,
  		i;
  	for (i = 0; i < tot_scrbls; i++) {
  		if (null !== SplitScrollable.data(scrbls[i])) continue;

  		new SplitScrollable(scrbls[i], {
  			scrollElsToWatchClass: 'text-wrap',
  			initializeComplete: fixScrollableGridGallery
  		});
  	}
  };

  /**
   * if ParticleSwarm plugin is defined, launch on every section
   * creates a canvas, insert inside the section and launch the effect
   * @return {void}
   */
  function launchParticleSwarm() {
    if ( 'undefined' === typeof ParticleSwarm ) {
      return;
    }

    var particleSwarm = Array.prototype.slice.call( document.getElementsByClassName('particle-swarm') );
    var i, tot_particelSwarm = particleSwarm.length;
    for( i=0; i < tot_particelSwarm; i++ ) {
      var c = document.createElement('canvas');
      particleSwarm[i].insertBefore(c, particleSwarm[i].firstChild);
      new ParticleSwarm(c);
    }
  }

  function disableGrids() {
		var gridsToDisable = Array.prototype.slice.call( document.getElementsByClassName( 'disable-grid' ) );
  	var i, tot_gridsToDisable = gridsToDisable.length;

  	for ( i = 0; i < tot_gridsToDisable; i++ ) {
			var grid = gridsToDisable[ i ].querySelector( '.perfect-grid-gallery' );

  		var bs = Array.prototype.slice.call( gridsToDisable[ i ].getElementsByClassName( 'grid-stack-item' ) );
  		var j, tot_bs = bs.length;
  		var blocksHeights = [];

  		for ( j = 0; j < tot_bs; j++ ) {
  			blocksHeights.push( bs[ j ].style.height );
  		}

  		// Destroying RexGrid
  		destroyRexGridInstance( grid );
  		Rexbuilder_Util.addClass( gridsToDisable[ i ], 'disabled' );
			$(grid).find('.rex-animate-lazy-loaded-resource .rex-image-wrapper').addClass('rex-image-wrapper--lazy-show');

  		for ( j = 0; j < tot_bs; j++ ) {
  			bs[ j ].style.height = blocksHeights[ j ];
  		}
  	}
  }

  /**
   * Launching odometer with some options
   * Store globally the odometer elements for future use
   * @param {NODE} target element on which launch odometer
   * @since 2.0.0
   * @date 26-02-2019
   */
  var launch_odometer = function( target ) {
    if ( 'undefined' === typeof Odometer ) {
      return;
    }

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
  };

  function launchInlineGallery() {
    var $inline_galleries = Rexbuilder_Util.$rexContainer.find('.inline-pswp-gallery');
    $inline_galleries.on('click', Rexbuilder_Photoswipe.init_inline_pswp);
	}

	function launchAccordions() {
    $builderAccordions = Rexbuilder_Util.$rexContainer.find('.rex-accordion');
    $otherAccordions = Rexbuilder_Util.$document.find('.rex-accordion').not( $builderAccordions );

    accordionSettings = {
      onSetup: function() {
        if( ! Rexbuilder_Util.editorMode ) {
          var $grid = this.$element.parents( '.perfect-grid-gallery' );
          var $blocks = $grid.find( '.perfect-grid-item' );
          var grid = $grid.get(0);
          var block = this.$element.parents( '.perfect-grid-item' ).get( 0 );
          var rexGridInstance = getRexGridInstance( grid );

          this.caching = {
            $grid: $grid,
            grid: grid,
            $blocks: $blocks,
            block: block,
            $block: $(block),
            rexGridInstance: rexGridInstance
          };
        }
      }
    };

    if( Rexbuilder_Util.editorMode ) {
      accordionSettings.open = {
      	progressClbk: function( data ) {
      		// var content = data.properties.$content[0];
      		var block = data.properties.$content.parents( '.grid-stack-item' )[ 0 ];
      		var grid = data.properties.$content.parents( '.grid-stack' ).data( "gridstack" );
      		grid.resize( block, null, Math.round( data.element.parentElement.offsetHeight / grid.opts.cellHeight ) );
      	},
      };
      accordionSettings.close = {
      	progressClbk: function( data ) {
      		// var content = data.properties.$content[0];
      		var block = data.properties.$content.parents( '.grid-stack-item' )[ 0 ];
      		var start_h = block.children[ 0 ].getAttribute( 'data-gs_start_h' );
      		var grid = data.properties.$content.parents( '.grid-stack' ).data( "gridstack" );
      		grid.resize( block, null, Math.round( parseInt( start_h ) ) );
      	}
      };
    } else {
      accordionSettings.open = {
        startClbk: function( data ) {
        	// var $grid = data.$element.parents( '.perfect-grid-gallery' );
        	// var $blocks = $grid.find( '.perfect-grid-item' );

         //  $blocks.addClass( 'accordion-animate-block' );

        	data.caching.$blocks.addClass( 'accordion-animate-block' );
        },
        progressClbk: function( data ) {
        	// var grid = data.$element.parents( '.perfect-grid-gallery' ).get( 0 );
        	// var block = data.$element.parents( '.perfect-grid-item' ).get( 0 );
        	// var rexGridInstance = getRexGridInstance( grid );

         //  if ( rexGridInstance ) {
         //    rexGridInstance.instance.reCalcBlockHeight( block );
         //  }

         if ( data.caching.rexGridInstance ) {
            data.caching.rexGridInstance.instance.reCalcBlockHeight( data.caching.block );
          }
        }
      };
      accordionSettings.close = {
        progressClbk: function( data ) {
        	// var grid = data.$element.parents( '.perfect-grid-gallery' ).get( 0 );
        	// var block = data.$element.parents( '.perfect-grid-item' ).get( 0 );
        	// var rexGridInstance = getRexGridInstance( grid );

         //  if ( rexGridInstance ) {
         //    rexGridInstance.instance.reCalcBlockHeight( block );
         //  }
          if ( data.caching.rexGridInstance ) {
            data.caching.rexGridInstance.instance.reCalcBlockHeight( data.caching.block );
          }
        },
        completeClbk: function( data ) {
        	// var $grid = data.$element.parents( '.perfect-grid-gallery' );
        	// var $blocks = $grid.find( '.perfect-grid-item' );
        	// var block = data.$element.parents( '.perfect-grid-item' ).get( 0 );

        	// $( block ).one( Rexbuilder_Util._transitionEvent, function() {
        	// 	$blocks.removeClass( 'accordion-animate-block' );
        	// } );

          data.caching.$block.one( Rexbuilder_Util._transitionEvent, function() {
            data.caching.$blocks.removeClass( 'accordion-animate-block' );
          } );
        }
      };
    }

    $builderAccordions.rexAccordion(accordionSettings);
    $otherAccordions.rexAccordion({
      open: {},
      close: {}
    });
  }

  /**
   * Check empty rows to add correctly a "spacer" class
   * @return {void}
   */
  function checkEmptyRows() {
    for( var z=0; z < gridInstances.length; z++) {
      Rexbuilder_Util.removeClass( gridInstances[z].section, 'empty-section' );
      if ( 0 === gridInstances[z].gridBlocksTotal ) {
        Rexbuilder_Util.addClass( gridInstances[z].section, 'empty-section' );
      } else {
        for( var k=0; k<gridInstances[z].gridBlocksTotal; k++ ) {
          if ( ! Rexbuilder_Util.hasClass( gridInstances[z].gridBlocks[k].el, 'rex-hide-element' ) ) break;
        }

        if ( k !== gridInstances[z].gridBlocksTotal - 1 ) {
          Rexbuilder_Util.addClass( gridInstances[z].section, 'empty-section' );
        }
      }
    }
  }

  /**
   * All front end effects in one function
   * @return {vodi}
   */
  function launchFrontEndEffects() {
    if( !Rexbuilder_Util.editorMode ) {
			disableGrids();

      Rexbuilder_Photoswipe.init('.photoswipe-gallery');

      // inline photoswipe
      launchInlineGallery();

      // launch distortion effect
      launchEffectDistortion();

      // launch border space animated
      launchBorderSpaceAnimated();

      // sticky sections
      launchStickySections();

      // launch rexScrolled
      launchRexScrolled( $sections );

      // launch rexScrollify
      if (1 == _plugin_frontend_settings.animations ) {
        launchRexScrollify();
      }

      // launch distance accordions
      launchDistanceAccordion();
      // launch popUpContent
      launchPopUpContent();
      // launch splitScrollable
      launchSplitScrollable();

      launchParticleSwarm();

      // listen iframe events (for popupcontent)
      listenPopUpContentEvents();
    }
  }

	/**
	 * Prevents <video> tag bug that auto scrolls window.
	 * Controls if the page is the same.
	 * Sets the previously stored position.
	 * @returns		{void}
	 * @since			2.0.4
	 */
	function _fixWindowScrollPosition() {
		var perfEntries = performance.getEntriesByType('navigation')[0];
		var navigationType = perfEntries.type;

		if ('navigate' === navigationType || 'prerender' === navigationType) { return; }

		var scrld = store.get('scrollPosition');
		if ('undefined' !== typeof scrld) {
			setTimeout(function () {
				window.scrollTo(0, scrld);
			}, 0);
		}
	}

  /**
   * Launching the different grids, back and front
   * @since  2.0.4
   */
	function _launchGrids() {
		if ( 0 === $grids.length ) return;

		if ( Rexbuilder_Util.editorMode ) {
			$grids.perfectGridGalleryEditor({
				editorMode: Rexbuilder_Util.editorMode,
			});
		} else {
			// Get layout information and set this information on the grids
			var choosedLayout = Rexbuilder_Util.chooseLayout();
			Rexbuilder_Util.handleLayoutChange(choosedLayout);

			// Launching RexGrid
			var grids = Array.prototype.slice.call(document.getElementsByClassName('perfect-grid-gallery'));
			var tot_grids = grids.length;
			var i = 0;

			for (i = 0; i < tot_grids; i++) {
				var rexGridInstance = new RexGrid(grids[i]);

				gridInstances.push(rexGridInstance);
			}

			for (i = 0; i < tot_grids; i++) {
				if (STICKY_SECTION_IN_PAGE && Rexbuilder_Util.hasClass(gridInstances[i].section, 'sticky-section')) {
					StickySection.prepare(gridInstances[i].section);
				}
			}

			window.FastLoad.init();
		}
	}

  var hooks = [];

  function addAction( action, cb ) {
    if ( 'undefined' === typeof hooks[action] ) hooks[action] = [];

    hooks[action].push( cb );
  }

  function doAction( action ) {
    if ( 'undefined' === typeof hooks[action] ) return;

    hooks[action].forEach(function( cb ) {
      cb.call();
    });
  }

	function init() {
		Rexbuilder_Util.init();
		Rexbuilder_Dom_Util.init();

		$sections = Rexbuilder_Util.$rexContainer.find('.rexpansive_section');
		$grids = Rexbuilder_Util.$rexContainer.find('.grid-stack-row');

    doAction( 'builder_before_launch_grids' );

		_launchGrids();

    Rexbuilder_Rexbutton.init();
    Rexbuilder_Rexelement.init();
		Rexbuilder_Rexwpcf7.init();

    if ( Rexbuilder_Util.editorMode ) {
			Rex_Save_Listeners.init();
      Rexbuilder_Rexelement_Editor.init();
      Rexbuilder_Rexwpcf7_Editor.init();
      Rexbuilder_CreateBlocks.init();
      Rexbuilder_Util_Editor.init();
      Rexbuilder_Color_Palette.init();
      Rexbuilder_Overlay_Palette.init();
      Rexbuilder_Section.init();
      Rexbuilder_Section_Editor.init();
      Rexbuilder_Block.init();
      Rexbuilder_Block_Editor.init();
      Rexbuilder_Live_Utilities.addBuilderListeners();
			TextEditor.init();
      Rexbuilder_Section_Editor.triggerRowDataChange();
    } else {
			// fixes for front end only
      fixRexButtons();
		}

    Rex_Navigator.init();
		//Rexbuilder_FormFixes.init();

		if ( Rexbuilder_Util.editorMode ) {
			// Fix needed because grids are launched before TextEditor
			$grids.each(function (index, grid) {
				TextEditor.launchTextEditors( grid );
			});
		}

    if ( Rexbuilder_Util.editorMode ) {
			Rexbuilder_Util.launchEditDomLayout();
    }

    /* ===== Launching plugins only on public side ===== */
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
        if ( oElement ) {
          odometers.push(oElement);
          $(odometersEls[oindex]).rexScrolled({
            callback: function(el)
            {
              el.innerHTML = el.getAttribute('data-final-value');
            }
          });
        }
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

      function handleLinkToSmooth(clickEvent) {
				// Needed to prevent scrolling when clicking on a RexButton to edit it
				if (Rexbuilder_Util.editorMode && clickEvent.currentTarget.matches('.rex-button-container')) {
					return;
				}

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

    if (Rexbuilder_Util.editorMode) {
      // Starting slider
			Rexbuilder_Util.$document.on( 'rexlive:editDomLayoutEnd', RexSlider.init );
			// RexSlider.init();
			Rexbuilder_Util.launchVideoPlugins();

      Rexbuilder_Util.playAllVideos();

			launchAccordions();
		}
  }

  function load() {
    // @bugfix on other layouts than desktop with mixed customization definitions

    if ( Rexbuilder_Util.editorMode ) {
      TextEditor.load();
      Rexbuilder_Util_Editor.load();
			Rexbuilder_Live_Utilities.load();
    } else {
      var tot_grids = gridInstances.length;
      var i = 0;

      for (; i < tot_grids; i++) {
        gridInstances[i].fixAfterLoad();
      }

			RexSlider.init();   // Starting slider

      Rexbuilder_Util.launchVideoPlugins();
      Rexbuilder_Util.playAllVideos();
      launchAccordions();
		}

    /* -- Launching the textfill -- */
    launchTextFill();

    // autoplay sliders
    RexSlider.startAutoPlay();

    if( $grids ) {
      launchIndicators( $grids );
    }

    checkEmptyRows();
		launchFrontEndEffects();

		Rexbuilder_Util.galleryPluginActive = true;

		if (IS_CHROME && !Rexbuilder_Util.editorMode) {
			_fixWindowScrollPosition();
		}
	}

  /**
   * Returns the instance of the grid DOM Element passed.
   * @param  {Element} grid   DOM Element of the grid
   * @return {RexGrid|null}   RexGrid instance if exists, null otherwise
   * @since  2.0.4
   */
  function getRexGridInstance( grid ) {
    var gridId = grid.getAttribute( 'data-rex-grid-id' );

  	var i = 0;
  	var tot_instances = gridInstances.length;

  	for ( i = 0; i < tot_instances; i++ ) {
  		if ( gridId === gridInstances[ i ].properties.id && grid === gridInstances[ i ].element ) {
  			return {
          instance: gridInstances[ i ],
          index: i
        };
  		}
  	}

  	return null;
  }

  function destroyRexGridInstance( grid ) {
    var gridInfo = getRexGridInstance( grid );
    if ( null === gridInfo ) {
      return;
    }

    gridInfo.instance.destroy();
    gridInstances.splice( gridInfo.index, 1 );
	}

	/**
   * Handles live resize.
   * @returns	{void}
	 * @since		2.0.4
   */
  function handleLiveResize() {
		// Rexbuilder_Util.globalViewport = Rexbuilder_Util.viewport();

		if (!Rexbuilder_Util_Editor.elementIsResizing) {
			Rexbuilder_Util.windowIsResizing = true;

			if (Rexbuilder_Util.loadWidth !== Rexbuilder_Util.globalViewport.width) {
				Rexbuilder_Util.doneResizing();
			}
		}
	}

  /**
   * Handles front end resize.
	 * The function adjustes the grid and re-launches effects
   * @return	{void}
	 * @since		2.0.4
   */
  function handleFrontEndResize() {
  	var actualLayout = Rexbuilder_Util.findFrontLayout();
    var tot_grids = gridInstances.length;

  	// Find actual layout
  	if ( Rexbuilder_Util.startFrontLayout != actualLayout ) {
  		Rexbuilder_Util.changedFrontLayout = true;
  		Rexbuilder_Util.startFrontLayout = actualLayout;
		}

  	// Find and set new layout information
  	if ( Rexbuilder_Util.changedFrontLayout ) {
			doAction( 'builder_before_layout_change' );

      var choosedLayout = Rexbuilder_Util.chooseLayout();
  		Rexbuilder_Util.handleLayoutChange( choosedLayout );
		}

    // update the viewport size vars inside RexGrid
    RexGrid.updateViewportSize();

		var i = 0;
		var j = 0;
		var splitScrollableInstance = null;

		for (; i < tot_grids; i++) {
			if (SPLIT_SCROLLABLE_IN_PAGE) {
				splitScrollableInstance = SplitScrollable.data(gridInstances[i].section);
			}

			// Checking if we passed from a non-mobile layout to a mobile layout
			if (
				splitScrollableInstance &&
				Rexbuilder_Util.changedFrontLayout &&
				Rexbuilder_Util.globalViewport.width < _plugin_frontend_settings.splitScrollable.minViewportWidth
			) {
				// Destroying SplitScrollable instance because it's not used on mobile
				splitScrollableInstance.destroy();
				splitScrollableInstance = null;

				// Resetting RexGrid and RexBlock properties to make RexGrid work normally
				gridInstances[i].properties.gridHeightSettable = true;

				for (j = 0; j < gridInstances[i].gridBlocksTotal; j++) {
					gridInstances[i].gridBlocks[j].setHeight = true;
					gridInstances[i].gridBlocks[j].setTop = true;
				}
			}

			// RexGrid operations on resize
			if (Rexbuilder_Util.changedFrontLayout) {
				gridInstances[i].endChangeLayout();
			}

			gridInstances[i].endResize();

			// SplitScrollable operations on resize
			if (splitScrollableInstance) {
				if (Rexbuilder_Util.changedFrontLayout) {
					reorderScrollableEls(splitScrollableInstance, gridInstances[i]);
					reorderOpacityEls(splitScrollableInstance, gridInstances[i]);

					splitScrollableInstance.refreshScrollableIndex();
				}

				splitScrollableInstance.callFixStickyHeight();
			}

			// StickySection operations on resize
			// Creating sticky section background simulators.
			// Need to create them before launching fast load to prevent
			// fast load fixing happening before this operation.
			if (STICKY_SECTION_IN_PAGE && Rexbuilder_Util.changedFrontLayout) {
				var stickySectionInstance = StickySection.data(gridInstances[i].section);

				if (stickySectionInstance) {
					// Using static function beacuse it's used on load too
					// In that case we still don't have SplitSrollable launched
					StickySection.prepare(gridInstances[i].section);
				}
			}
		}


    if ( Rexbuilder_Util.changedFrontLayout ) {
			// Resetting fast load (that contains IntersectionObserver)
			window.FastLoad.destroy();
			window.FastLoad.init();

      checkEmptyRows();

      // Re-launch effects
      launchFrontEndEffects();
    }

    Rex_Navigator.getNavigationDotsPosition();

  	Rexbuilder_Util.changedFrontLayout = false;
  }

  return {
    init: init,
    load: load,
    handleLiveResize: handleLiveResize,
    handleFrontEndResize: handleFrontEndResize,

    addAction: addAction,

    // RexGrid functions
    getRexGridInstance: getRexGridInstance,
    destroyRexGridInstance: destroyRexGridInstance,
  };
})(jQuery);
