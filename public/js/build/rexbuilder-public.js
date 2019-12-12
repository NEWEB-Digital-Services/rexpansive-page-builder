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

  var init = function() {
    Rexbuilder_Util.init();
    Rexbuilder_Dom_Util.init();
    
    Rexbuilder_Rexbutton.init();
    
    if (Rexbuilder_Util.editorMode) {
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

    /** -- Launching plugins only on "real" frontend */
    if (!Rexbuilder_Util.editorMode) {
      /* -- Launching Photoswipe -- */
      // prevent pswp errors
      $sections.each(function(i, e) {
        var pswchilds = e.getElementsByClassName("pswp-figure");
        if (pswchilds.length === 0) {
          $(e).removeClass("photoswipe-gallery");
        }
      });
      initPhotoSwipeFromDOM(".photoswipe-gallery");

      /** -- Launching Odomter -- */
      Rexbuilder_Util.$body.find('.rex-num-spin').each(function(i,el) {
        var oElement = launch_odometer(el);
        odometers.push(oElement);
        $(el).rexScrolled({
          callback: function(el)
          {
            el.innerHTML = el.getAttribute('data-final-value');
          }
        })
      });

      /** -- Launching slideshow -- **/
      var $slideshow = Rexbuilder_Util.$body.find('.rex-slideshow');
      if ( $slideshow.length > 0 )
      {
        $slideshow.rexSlideshow();
      }
    }

    if (true == _plugin_frontend_settings.native_scroll_animation) {
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

      $linksToSmooth.click(function() {
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
      });

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

    var accordionSettings = {
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

    /* $accordions.rexAccordion();
    console.log("init - rexAccordion()"); */

  };

  /**
   * In case of RexButtons inside a block that is a link
   * we must fix the buttons to re-wrap them with the correct class
   *
   */
  var fixRexButtons = function() {
    var buttons = [].slice.call( document.getElementsByClassName('rex-button-wrapper') );
    buttons.forEach(function( btn ) {
      var container = btn.querySelector( '.rex-button-container' );
      if ( ! container ) {
        var newContainer = document.createElement('span');
        newContainer.className = 'rex-button-container';
        var toWrap = btn.querySelector('.rex-button-background');
        toWrap.parentNode.insertBefore( newContainer, toWrap );
        newContainer.appendChild( toWrap );
      }
    });
  }

  var _linkDocumentListeners = function() {
    $(document).on("YTPStart", function(e) {
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
    });

    // Pause/Play video on block click
    $(document).on("click", ".YTPOverlay", function(e) {
      var $ytvideo = $(e.target).parents(".rex-youtube-wrap");
      if ($ytvideo.length > 0) {
        var video_state = $ytvideo[0].state;
        if (video_state == 1) {
          $ytvideo.YTPPause();
        } else {
          $ytvideo.YTPPlay();
        }
      }
    });

    $(document).on("click", ".perfect-grid-item", function() {
      if (!$(this).hasClass("block-has-slider")) {
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
      }
    });

    // Adding audio functionallity
    $(document).on("click", ".rex-video-toggle-audio", function(e) {
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
    });

    // video controller tools
    // play video
    $(document).on('click', '.rex-video__controls .pause', function(ev) {
      var $tool = $(ev.currentTarget);
      var $play_tool = $tool.parent().children('.play');
      var $target = $tool.parents('.rexpansive_section');
      $tool.removeClass('video-tool--view');
      $play_tool.addClass('video-tool--view');
      Rexbuilder_Util.pauseVideo( $target );
    });

    // pause video
    $(document).on('click', '.rex-video__controls .play', function(ev) {
      var $tool = $(ev.currentTarget);
      var $pause_tool = $tool.parent().children('.pause');
      var $target = $tool.parents('.rexpansive_section');
      $tool.removeClass('video-tool--view');
      $pause_tool.addClass('video-tool--view');
      Rexbuilder_Util.playVideo( $target );
    });
  };

  var load = function() {
    if (Rexbuilder_Util.editorMode) {
      Rexbuilder_Util_Editor.load();
    }
    /* -- Launching the textfill -- */
    var $textFillContainer = $(".text-fill-container-canvas");
    if ($textFillContainer.length > 0) {
      $textFillContainer.textFill({
        relative: true,
        relativeWrap: ".perfect-grid-item",
        fontFamily: _plugin_frontend_settings.textFill.font_family,
        fontWeight: _plugin_frontend_settings.textFill.font_weight
      });
      $textFillContainer.on("textfill-render-complete", function() {
        Rexbuilder_Util.$window.resize();
      });
    }

    // autoplay sliders
    RexSlider.startAutoPlay();    

    /* -- Launching TextResize ------ */
    //$grids.textResize();

    if( $grids ) {
      if ( 'undefined' !== typeof rexIndicator ) {
        $grids.find(".rex-indicator__placeholder").rexIndicator();
      }
    }

    if( false == _plugin_frontend_settings.user.editing ) {
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

    if( false == _plugin_frontend_settings.user.editing ) {
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

    // launch rexScrolled
    if( false == _plugin_frontend_settings.user.editing ) {
      $sections.rexScrolled({
        callback: function(el) {
          if (Rexbuilder_Util.has_class(el, "rex-element--animated")) {
            var $el = $(el);
            $el
              .addClass("run-animation")
              .on(Rexbuilder_Util.transitionEvent, function(e) {});
          }
        }
      });
    }

    // launch rexScrollify
    if (typeof _plugin_frontend_settings !== "undefined") {
      if (1 == _plugin_frontend_settings.animations ) {
        if( false == _plugin_frontend_settings.user.editing ) {
          // Activate animations
          $(".rs-animation").rexScrollify({
            mobile: false
          });
        } else {
          $(".rs-animation").removeClass("has-rs-animation");
          // $(".has-rs-animation").removeClass("has-rs-animation");
        }
      }
    }

    if( false == _plugin_frontend_settings.user.editing ) {
      // sticky sections
      launchStickySections();    
      // launch scrollCSSAnimations
      launchScrollCSSAnimations();
      // launch distance accordions
      launchDistanceAccordion();
    }

    Rexbuilder_Util.galleryPluginActive = true;
  };

  /**
   * Launch sticky sections if any
   */
  var launchStickySections = function() {
    if ( 'undefined' !== typeof StickySection ) {
      var stickyJS = !( Rexbuilder_Util.cssPropertyValueSupported( 'position', 'sticky' ) || Rexbuilder_Util.cssPropertyValueSupported( 'position', '-webkit-sticky' ) );
      var stickySections = [].slice.call( document.getElementsByClassName( 'sticky-section' ) );

      stickySections.forEach(function (el, index) {
        var stickyElementSelector = '';
        if ( Rexbuilder_Util.has_class( el, 'mp4-player' ) ) {
          stickyElementSelector = '.rex-video-wrap';
        } else if ( '' !== el.style.backgroundImage ) {
          stickyElementSelector = '.sticky-background-simulator';
          var adjacent = el.querySelector('.responsive-overlay');
          adjacent.insertAdjacentHTML('beforebegin', '<div class="sticky-background-simulator"></div>');
          var backgroundSimulator = el.querySelector('.sticky-background-simulator');
          backgroundSimulator.style.backgroundImage = el.style.backgroundImage;
        } else if ( Rexbuilder_Util.has_class( el, 'section-w-image' ) ) {
          stickyElementSelector = '.sticky-background-simulator';
          var adjacent = el.querySelector('.responsive-overlay');
          adjacent.insertAdjacentHTML('beforebegin', '<div class="sticky-background-simulator"></div>');
          var backgroundSimulator = el.querySelector('.sticky-background-simulator');
          backgroundSimulator.style.backgroundImage = 'url(' + el.querySelector('.section-data').getAttribute('data-image_bg_section') + ')';
        }

        var stickySection = new StickySection(el, {
          borderAnimation: true,
          stickyJS: stickyJS,
          stickyElementSelector: stickyElementSelector
        });
      });
    }
  };

  /**
   * Launch eventually scroll animations
   */
  var launchScrollCSSAnimations = function() {
    if ( 'undefined' !== typeof ScrollCSSAnimation ) {
      var fadesUps = [].slice.call(document.getElementsByClassName('fadeUpTextCSS'));
      fadesUps.forEach(function(el) {
        var fu = new ScrollCSSAnimation(el,{
          offset: 0.75
        });
      });
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
   * Launching odometer with some options
   * Store globally the odometer elements for future use
   * @param {NODE} target element on which launch odometer
   * @since 2.0.0
   * @date 26-02-2019
   */
  var launch_odometer = function( target )
  {
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

  // Launch Photoswipe
  var initPhotoSwipeFromDOM = function(gallerySelector) {
    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
      //var thumbElements = el.childNodes,

      var thumbElements = $(el)
          .find(".pswp-figure")
          .get(),
        numNodes = thumbElements.length,
        items = [],
        figureEl,
        linkEl,
        size,
        item;

      for (var i = 0; i < numNodes; i++) {
        figureEl = thumbElements[i]; // <figure> element

        // include only element nodes
        if (figureEl.nodeType !== 1) {
          continue;
        }

        linkEl = figureEl.children[0]; // <a> element

        size = linkEl.getAttribute("data-size").split("x");

        // create slide object
        item = {
          src: linkEl.getAttribute("href"),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10)
        };

        if (figureEl.children.length > 1) {
          // <figcaption> content
          item.title = figureEl.children[1].innerHTML;
        }

        if (linkEl.children.length > 0) {
          // <img> thumbnail element, retrieving thumbnail url
          item.msrc = linkEl.children[0].getAttribute("data-thumburl");
        }

        item.el = figureEl; // save link to element for getThumbBoundsFn
        items.push(item);
      }

      return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
      return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    var collectionHas = function(a, b) {
      //helper function (see below)
      for (var i = 0, len = a.length; i < len; i++) {
        if (a[i] == b) return true;
      }
      return false;
    };

    var findParentBySelector = function(elm, selector) {
      var all = document.querySelectorAll(selector);
      var cur = elm.parentNode;
      while (cur && !collectionHas(all, cur)) {
        //keep going up until you find a match
        cur = cur.parentNode; //go up
      }
      return cur; //will return null if not found
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
      e = e || window.event;

      // Bug fix for Block links and links inside blocks
      if ( $(e.target).parents(".perfect-grid-item").find(".element-link").length > 0 || $(e.target).is("a") ) {
        return;
      }

      var eTarget = e.target || e.srcElement;
      
      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
        return el.tagName && el.tagName.toUpperCase() === "FIGURE";
      });

      if (!clickedListItem) {
        return;
      }

      // move the prevent default here, cause if the element clicked can't be
      // a photoswipe element, we must prevent default after decided that
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      // find index of clicked item by looping through all child nodes
      // alternatively, you may define index via data- attribute
      // var clickedGallery = clickedListItem.parentNode,
      //var clickedGallery = findParentBySelector(clickedListItem, '.my-gallery'),
      var clickedGallery = $(clickedListItem).parents(gallerySelector)[0],
        //childNodes = clickedListItem.parentNode.childNodes,
        childNodes = $(clickedGallery)
          .find(".pswp-figure")
          .get(),
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;

      for (var i = 0; i < numChildNodes; i++) {
        if (childNodes[i].nodeType !== 1) {
          continue;
        }

        if (childNodes[i] === clickedListItem) {
          index = nodeIndex;
          break;
        }
        nodeIndex++;
      }

      if (index >= 0) {
        // open PhotoSwipe if valid index found
        openPhotoSwipe(index, clickedGallery);
      }
      return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
        params = {};

      if (hash.length < 5) {
        return params;
      }

      var vars = hash.split("&");
      for (var i = 0, tot_vars = vars.length; i < tot_vars; i++) {
        if (!vars[i]) {
          continue;
        }
        var pair = vars[i].split("=");
        if (pair.length < 2) {
          continue;
        }
        params[pair[0]] = pair[1];
      }

      if (params.gid) {
        params.gid = parseInt(params.gid, 10);
      }

      return params;
    };

    var openPhotoSwipe = function(
      index,
      galleryElement,
      disableAnimation,
      fromURL
    ) {
      var pswpElement = document.querySelectorAll(".pswp")[0],
        gallery,
        options,
        items;

      items = parseThumbnailElements(galleryElement);

      // define options (if needed)
      options = {
        // define gallery index (for URL)
        galleryUID: galleryElement.getAttribute("data-pswp-uid"),

        getThumbBoundsFn: function(index) {
          // See Options -> getThumbBoundsFn section of documentation for more info
          var thumbnail = items[index].el.getElementsByClassName(
              "pswp-item-thumb"
            )[0], // find thumbnail
            image_content = items[index].el.getElementsByClassName(
              "rex-custom-scrollbar"
            )[0],
            pageYScroll =
              window.pageYOffset || document.documentElement.scrollTop,
            rect = image_content.getBoundingClientRect(),
            image_type = thumbnail.getAttribute("data-thumb-image-type");

          if (image_type == "natural") {
            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          } else {
            // var full_rect = items[index].el.getBoundingClientRect();
            // return {x:full_rect.left, y:full_rect.top + pageYScroll, w:full_rect.width};;
            return null;
          }
        },

        closeOnScroll: false,
        showHideOpacity: true
      };

      // PhotoSwipe opened from URL
      if (fromURL) {
        if (options.galleryPIDs) {
          // parse real index when custom PIDs are used
          // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
          for (var j = 0, tot_items = items.length; j < tot_items; j++) {
            if (items[j].pid == index) {
              options.index = j;
              break;
            }
          }
        } else {
          // in URL indexes start from 1
          options.index = parseInt(index, 10) - 1;
        }
      } else {
        options.index = parseInt(index, 10);
      }

      // exit if index not found
      if (isNaN(options.index)) {
        return;
      }

      if (disableAnimation) {
        options.showAnimationDuration = 0;
      }

      // Pass data to PhotoSwipe and initialize it

      gallery = new PhotoSwipe(
        pswpElement,
        PhotoSwipeUI_Default,
        items,
        options
      );
      gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute("data-pswp-uid", i + 1);
      galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
      openPhotoSwipe(
        hashData.pid,
        galleryElements[hashData.gid - 1],
        true,
        true
      );
    }
  };

  return {
    init: init,
    load: load
  };
})(jQuery);

(function($) {
  "use strict";

  /**
   * All of the code for your public-facing JavaScript source
   * should reside in this file.
   *
   * Note that this assume you're going to use jQuery, so it prepares
   * the $ function reference to be used within the scope of this
   * function.
   *
   * From here, you're able to define handlers for when the DOM is
   * ready:
   *
   * $(function() {
   *
   * });
   *
   * Or when the window is loaded:
   *
   * $( window ).load(function() {
   *
   * });
   *
   * ...and so on.
   *
   * Remember that ideally, we should not attach any more than a single DOM-ready or window-load handler
   * for any particular page. Though other scripts in WordPress core, other plugins, and other themes may
   * be doing this, we should try to minimize doing that in our own work.
   */
  // Waiting until the ready of the DOM
  document.addEventListener('DOMContentLoaded', Rexbuilder_App.init );

  // Waiting for the complete load of the window
  window.addEventListener('load', Rexbuilder_App.load );
})(jQuery);
