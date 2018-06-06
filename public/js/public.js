var Util = (function($) {
	'use strict';

	var $window = $(window);

	var fixSectionWidth = 0;
	var elementIsResizing = false;
	var elementIsDragging = false;

	// function to detect if we are on a mobile device
	var _detect_mobile = function() {
		if (!("ontouchstart" in document.documentElement)) {
			document.documentElement.className += " no-touch";
		} else {
			document.documentElement.className += " touch";
		}
	}

	// function to detect the viewport size
	var _viewport = function() {
		var e = window, a = 'inner';
		if (!('innerWidth' in window )) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
	};

	// function to find the youtube id based on an url
	var _getYoutubeID = function( url ) {
		var ID;
		if( url.indexOf( "youtu.be" ) > 0 ) {
				ID = url.substr( url.lastIndexOf( "/" ) + 1, url.length );
		} else if( url.indexOf( "http" ) > -1 ) {
				ID = url.match( /[\\?&]v=([^&#]*)/ )[ 1 ];				
		} else {
				ID = url.length > 15 ? null : url;
		}
		return ID;
	};

	// Get the value of a query variable from the actual url
	var _getQueryVariable = function(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
	};

	var _checkPresentationPage = function() {
		if( 0 !== $('.rexpansive_portfolio_presentation').length ) {
			return true;
		}
		return false;
	}

	var _checkStaticPresentationPage = function() {
		if( 0 !== $('.rexpansive-static-portfolio').length ) {
			return true;
		}
		return false;
	}

	var _checkPost = function() {
		if( 0 !== $('#rex-article').length ) {
			return true;
		}
		return false;
	}

	// find the animation/transition event names
	var _whichTransitionEvent = function(){
		var t,
		el = document.createElement("fakeelement");

		var transitions = {
			"transition"      : "transitionend",
			"OTransition"     : "oTransitionEnd",
			"MozTransition"   : "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		};

		for (t in transitions){
			if (el.style[t] !== undefined){
				return transitions[t];
			}
		}
	};

	var _whichAnimationEvent = function(){
		var t,
		  el = document.createElement("fakeelement");

		var animations = {
			"animation"      : "animationend",
			"OAnimation"     : "oAnimationEnd",
			"MozAnimation"   : "animationend",
			"WebkitAnimation": "webkitAnimationEnd"
		}

		for (t in animations){
			if (el.style[t] !== undefined){
			  return animations[t];
			}
		}
	};

	var _transitionEvent = '';
	var _animationEvent = '';

	var _scroll_timing = 600;

	// init the utilities
	var init = function() {
		_detect_mobile();
		this._transitionEvent = _whichTransitionEvent();
		this._animationEvent = _whichAnimationEvent();
	}

	return {
		init: init,
		viewport: _viewport,
		getYoutubeID: _getYoutubeID,
		transitionEvent: _transitionEvent,
		animationEvent: _animationEvent,
		getQueryVariable: _getQueryVariable,
		checkPresentationPage: _checkPresentationPage,
		checkStaticPresentationPage : _checkStaticPresentationPage,
		checkPost: _checkPost,
		$window: $window,
		scroll_timing: _scroll_timing,
		fixSectionWidth: fixSectionWidth,
		elementIsResizing: elementIsResizing
	};

})(jQuery);
var RexSlider = (function($) {
  'use strict';

  var slider_class = '.rex-slider-wrap';
  var slider_element_class = '.rex-slider-element';
  var slider_element_title_wrap = '.rex-slider-element-title';
  var context = '.rexpansive_section';

  var box_slider_class = '.rex-box-slider-wrap';
  var box_slider_element_class = '.rex-box-slider-element';

  var _rexSliderInit = function() {
    if($(slider_class, context).length) {
      $(slider_class, context).each(function(i, el) {
        var settings = {
          cellAlign: 'left',
          // contain: true,
          prevNextButtons: false,
          pageDots: false,
          cellSelector: slider_element_class,
          selectedAttraction: 0.018,
          friction: 0.30,
          wrapAround: true,
          setGallerySize: false,
          adaptiveHeight: true,
          arrowShape: 'm 38.79662,40.087413 0,0 c -0.387529,0 -0.757576,-0.154429 -1.031468,-0.425408 L 1.2470862,3.1322842 c -0.56818177,-0.5681815 -0.56818177,-1.4918411 0,-2.060023 0.5681819,-0.56818197 1.4918415,-0.56818197 2.0600234,0 L 38.793706,36.570513 74.294872,1.0722612 c 0.568182,-0.56818197 1.491842,-0.56818197 2.060023,0 0.568182,0.5681819 0.568182,1.4918415 0,2.060023 L 39.825175,39.659091 c -0.273893,0.273893 -0.641026,0.428322 -1.028555,0.428322 l 0,0 0,0 z'
        };

        var auto_player = $(el).attr('data-rex-slider-animation');
        if('undefined' != typeof auto_player && 'true' == auto_player) {
          settings.autoPlay = true;
        }

        var prev_next = $(el).attr('data-rex-slider-prev-next');
        if('undefined' != typeof prev_next && '1' == prev_next) {
          settings.prevNextButtons = true;
        }

        var dots = $(el).attr('data-rex-slider-dots');
        if('undefined' != typeof dots && '1' == dots) {
          settings.pageDots = true;
        }

        $(el).flickity( settings );
        $(el).flickity('stopPlayer');

        // if( $(el).find('.rex-slider-element:not(:first-child) .youtube-player').length ) {
        //   // var video_state = $(el).find('.rex-slider-element:first-child .youtube-player')[0].state;
        //   // if(video_state != 1) {
        //     $(el).find('.rex-slider-element:not(first-child) .youtube-player').each(function() {
        //       $(this).YTPStop();
        //     })
        //   // }
        // }

        Util.$window.on('resize', function() {
          if( $(el).data('flickity') ) {
            $(el).flickity('resize');
          }
        });

        $(el).on( 'dragStart.flickity', function( ) {
          $(this).addClass('is-dragging');
        });

        $(el).on( 'dragEnd.flickity', function( ) {
          $(this).removeClass('is-dragging');
        });

        $(el).on( 'select.flickity', function() {
          var $videoSlide = $(this).find('.rex-slider-element.is-selected .youtube-player');
          if( $videoSlide.length ) {
            var video_state = $videoSlide[0].state;
            if(video_state != 1) {
              $videoSlide.YTPPlay();
            }
          }
        });
      });
    }

    if($(box_slider_class, context).length) {
      $(box_slider_class, context).each(function(i, el) {
        var settings = {
          cellAlign: 'center',
          // contain: true,
          prevNextButtons: true,
          pageDots: true,
          cellSelector: box_slider_element_class,
          selectedAttraction: 0.018,
          friction: 0.30,
          initialIndex: ( 'undefined' !== typeof ( $(el).attr('data-rex-box-slider-initialIndex') ) ? parseInt( $(el).attr('data-rex-box-slider-initialIndex') ) : 0 ),
          // groupCells: 3,
          // wrapAround: true,
          setGallerySize: false,
          // adaptiveHeight: true,
          arrowShape: 'm 38.79662,40.087413 0,0 c -0.387529,0 -0.757576,-0.154429 -1.031468,-0.425408 L 1.2470862,3.1322842 c -0.56818177,-0.5681815 -0.56818177,-1.4918411 0,-2.060023 0.5681819,-0.56818197 1.4918415,-0.56818197 2.0600234,0 L 38.793706,36.570513 74.294872,1.0722612 c 0.568182,-0.56818197 1.491842,-0.56818197 2.060023,0 0.568182,0.5681819 0.568182,1.4918415 0,2.060023 L 39.825175,39.659091 c -0.273893,0.273893 -0.641026,0.428322 -1.028555,0.428322 l 0,0 0,0 z'
        };

        var auto_player = $(el).attr('data-rex-slider-animation');
        if('undefined' != typeof auto_player && 'true' == auto_player) {
          settings.autoPlay = true;
        }

        $(el).flickity( settings );
        $(el).flickity('stopPlayer');

        // if( $(el).find('.rex-slider-element:not(:first-child) .youtube-player').length ) {
        //   // var video_state = $(el).find('.rex-slider-element:first-child .youtube-player')[0].state;
        //   // if(video_state != 1) {
        //     $(el).find('.rex-slider-element:not(first-child) .youtube-player').each(function() {
        //       $(this).YTPStop();
        //     })
        //   // }
        // }

        Util.$window.on('resize', function() {
          $(el).flickity('resize');
        });

        $(el).on( 'dragStart.flickity', function( ) {
          $(this).addClass('is-dragging');
        });

        $(el).on( 'dragEnd.flickity', function( ) {
          $(this).removeClass('is-dragging');
        });

      });
    }
  };

  var _rexSliderDestroy = function() {
    if($(slider_class, context).length) {
      $(slider_class, context).each(function(i,el) {
        if( 'undefined' !== typeof $(el).data('flickity') ) {
          $(el).flickity('destroy');
        }
      });
    }

    if($(box_slider_class, context).length) {
      $(box_slider_class, context).each(function(i,el) {
        if( 'undefined' !== typeof $(el).data('flickity') ) {
          $(el).flickity('destroy');
        }
      });
    }
  };

  var init = function() {
    _rexSliderInit();
  };

  var _startSliders = function() {
    if($(slider_class, context).length) {
      $(slider_class, context).each(function(i,el) {
        var auto_player = $(el).attr('data-rex-slider-animation');
        if('undefined' != typeof auto_player && 'true' == auto_player) {
          $(el).flickity('playPlayer');
        }
      });
    }
  }

  return {
    init: init,
    startAutoPlay: _startSliders,
    destroy: _rexSliderDestroy,
  };

})(jQuery);

var VimeoVideo = (function($){
    'use strict';

    var $vimeoSectionVideos = null;
    var $vimeoBlockVideos = null;
    
    var _initObjects = function() {
        $vimeoSectionVideos = $('.rex-video-vimeo-wrap--section');
        $vimeoBlockVideos = $('.rex-video-vimeo-wrap--block');
    };

    /**
     *  init videos for a section
     *  always muted
     */
    var _initSectionVideos = function() {
        // check if exists
        if( $vimeoSectionVideos.length > 0 ) {
            // cycle foreach section
            $vimeoSectionVideos.each(function(i, el) {
                // mute videos on section
                var video = $(el).find('iframe')[0];
                if("undefined" != typeof Vimeo) {
                    var player = new Vimeo.Player(video);
                    player.ready().then(function() {
                        player.setVolume(0);
                    });
                }
            });
        }
    };

    /**
     * Initi videos for a block
     * user can set if video has or not audio
     * @param {jQuery Object} reference 
     */
    var _initBlockVideos = function( reference ) {
        var VimeoObj = reference;
        if( $vimeoBlockVideos.length > 0 ) {
            // cycle foreach section
            $vimeoBlockVideos.each(function(i, el) {
                // mute videos on block if set to do that
                var mute = $(el).attr('data-vimeo-video-mute');
                var video = $(el).find('iframe')[0];
                if("undefined" != typeof Vimeo) {
                    var player = new Vimeo.Player(video);
                    if( "1" == mute ) {
                        // set to mute -> videos remain mute
                        player.ready().then(function() {
                            player.setVolume(0);
                        });
                    } else {
                        // save info to later use -> videos can change audio state
                        var video_block = {
                            el: video,
                            player: player
                        };
                        VimeoObj.blockVideos.push(video_block);
                    }
                }
            });
        }
    };

    /**
     * finding the player relative to the iframe passed
     * searching in the array of players
     * @param {DOM object} el 
     */
    var _findVideo = function( el ) {
        for( var i = 0; i < this.blockVideos.length; i++ ) {
            if( this.blockVideos[i].el === el ) {
                return this.blockVideos[i].player;
            }
        }
        return null;
    };

    /**
     * init function
     */
    var init = function() {
        this.blockVideos = [];
        _initObjects();
        _initSectionVideos();
        _initBlockVideos( this );
    };

    return {
        init: init,
        findVideo: _findVideo,
    }
})(jQuery);
(function ($) {
	'use strict';

	var $window = $(window);

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

	// function to detect if we are on a mobile device
	var _detect_mobile = function () {
		if (!("ontouchstart" in document.documentElement)) {
			document.documentElement.className += " no-touch";
		} else {
			document.documentElement.className += " touch";
		}
	}

	var getYotubeID = function (url) {
		var ID;
		if (url.indexOf("youtu.be") > 0) {
			ID = url.substr(url.lastIndexOf("/") + 1, url.length);
		} else if (url.indexOf("http") > -1) {
			ID = url.match(/[\\?&]v=([^&#]*)/)[1];
		} else {
			ID = url.length > 15 ? null : url;
		}
		return ID;
	};

	function viewport() {
		var e = window, a = 'inner';
		if (!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width: e[a + 'Width'], height: e[a + 'Height'] };
	}

	// Waiting for the complete load of the window
	$window.load(function () {
		/* -- Launching the textfill -- */
		var $textFillContainer = $(".text-fill-container-canvas");
		if ($textFillContainer.length > 0) {
			$textFillContainer.textFill({
				relative: true,
				relativeWrap: '.perfect-grid-item',
			});
			$textFillContainer.on('textfill-render-complete', function () {
				//$(this).parents('.perfect-grid-gallery').isotope('layout');
				$window.resize();
				// $('.perfect-grid-gallery').perfectGridGallery('relayoutGrid');
			});
		}

		/* -- Launching TextResize ------ */
		//$('.perfect-grid-gallery').textResize();

		if (typeof _plugin_frontend_settings !== 'undefined') {
			if (1 == _plugin_frontend_settings.animations) {
				// Activate animations
				// var wow = new WOW({
				// 	mobile: false,
				// 	callback: function(el) {
				// 		$(el).removeClass('has-wow');
				// 	}
				// });
				// wow.init();
				// if(wow._util.isMobile(navigator.userAgent)) {
				// 	$('.wow').removeClass('has-wow');
				// }

				$('.rs-animation').rexScrollify({
					mobile: false,
				});
			}
		}
		//$(".perfect-grid-item:not(.horizontal-carousel) .rex-custom-scrollbar").mCustomScrollbar();

		/* -- Launching scrollbar on full-height/boxed sections -- */
		/* var $block_scrollable = $('.perfect-grid-gallery[data-layout=fixed][data-full-height=true] .text-content .rex-custom-scrollbar');

		$block_scrollable.mCustomScrollbar();

		if( 0 != $block_scrollable.length ) {
			$window.resize(function() {
				if(viewport().width < 768) {
					$block_scrollable.mCustomScrollbar('destroy');
				} else {
					$block_scrollable.mCustomScrollbar();
				}
			});
		} */
	});

	// Waiting until the ready of the DOM
	$(function () {
		Util.init();
		_detect_mobile();

		/* -- Launching the grid -- */
		console.log("Launching grid");
		$('.perfect-grid-gallery').perfectGridGalleryEditor();

		/* -- Launching Photoswipe -- */
		initPhotoSwipeFromDOM('.photoswipe-gallery');

		RexSlider.init();

		VimeoVideo.init();

		/* -- Launching YouTube Video -- */
		// declare object for video
		if (!jQuery.browser.mobile) {
			$(".youtube-player").YTPlayer();

			$(".youtube-player").on("YTPReady", function () {
				$(this).optimizeDisplay();
			});
		} else {
			$('.youtube-player').each(function (i, el) {
				var $this = $(el),
					data_yt = eval('(' + $this.attr('data-property') + ')'),
					url = data_yt.videoURL,
					id = getYotubeID(url);

				$this.css('background-image', 'url(http://img.youtube.com/vi/' + id + '/0.jpg)');
				$this.click(function (e) {
					e.preventDefault();
					window.location.href = url;
				});

			});
			// $('.rex-video-wrap').getVideoThumbnail();
		}

		// Pause/Play video on block click
		$(document).on("click", ".perfect-grid-item", function () {
			if (!$(this).hasClass('block-has-slider')) {
				var $ytvideo = $(this).find(".youtube-player");
				var $mpvideo = $(this).find(".rex-video-container");

				if ($ytvideo.length > 0) {
					var video_state = $ytvideo[0].state;
					if (video_state == 1) {
						$ytvideo.YTPPause();
					} else {
						$ytvideo.YTPPlay();
					}
				}
				if ($mpvideo.length > 0) {
					$mpvideo.get(0).paused ? $mpvideo.get(0).play() : $mpvideo.get(0).pause();
				}
			}
		});

		// Adding audio functionallity
		$('.perfect-grid-item').on('click', '.rex-video-toggle-audio', function (e) {
			e.stopPropagation();
			var $ytvideo = $(this).parents(".youtube-player");
			var $mpvideo = $(this).parents('.mp4-player').find('.rex-video-container');
			var $vimvideo = $(this).parents('.vimeo-player').find('.rex-video-vimeo-wrap--block');
			var $toggle = $(this);

			if ($ytvideo.length > 0) {
				var isMuted = $ytvideo.get(0).player.isMuted();
				if (isMuted) {
					$ytvideo.YTPUnmute();
					$(this).removeClass('user-has-muted');
				} else {
					$ytvideo.YTPMute();
					$(this).addClass('user-has-muted');
				}
			}

			if ($mpvideo.length > 0) {
				if ($mpvideo.prop('muted')) {
					$mpvideo.prop('muted', false);
					$(this).removeClass('user-has-muted');
				} else {
					$mpvideo.prop('muted', true);
					$(this).addClass('user-has-muted');
				}
			}

			// vimeo video
			if ($vimvideo.length > 0) {
				var player = VimeoVideo.findVideo($vimvideo.find('iframe')[0]);
				if (player) {
					player.getVolume().then(function (volume) {
						if (0 == volume) {
							player.setVolume(1);
							$toggle.removeClass('user-has-muted');
						} else {
							player.setVolume(0);
							$toggle.addClass('user-has-muted');
						}
						// volume = the volume level of the player
					}).catch(function (error) {
						// an error occurred
					});
				}
			}
		});

		// Smooth scroll on all internal links
		$('a[href*="#"]:not([href="#"]):not(.rex-vertical-nav-link)').click(function () {
			if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				if (target.length) {
					$('html, body').animate({
						scrollTop: target.offset().top
					}, 600);
					return false;
				}
			}
		});

		/* -- Handle dot behaviour --- */

		var contentSections = $('.rexpansive_section'),
			navigationItems = $('#rex-vertical-nav a');

		updateNavigation();
		$window.on('scroll', function () {
			updateNavigation();
		});

		//smooth scroll to the section
		navigationItems.on('click', function (event) {
			event.preventDefault();
			smoothScroll($(this.hash));
		});
		//smooth scroll to second section

		//open-close navigation on touch devices
		$('.touch .rex-nav-trigger').on('click', function () {
			$('.touch #rex-vertical-nav').toggleClass('open');

		});
		//close navigation on touch devices when selectin an elemnt from the list
		var $touch_navigation_links = $('.touch #rex-vertical-nav a');

		$touch_navigation_links.on('click', function () {
			$touch_navigation_links.find('.rex-label').removeClass('fadeInAndOut');
			$(this).find('.rex-label').addClass('fadeInAndOut');
			$('.touch #rex-vertical-nav').removeClass('open');
		});

		function updateNavigation() {
			contentSections.each(function () {
				var $this = $(this);
				if (typeof $this.attr('id') != 'undefined' && $this.attr('id') != '') {
					var activeSection = $('#rex-vertical-nav a[href="#' + $this.attr('id') + '"]').data('number') - 1;
					if (($this.offset().top - $window.height() / 2 < $window.scrollTop()) && ($this.offset().top + $this.height() - $window.height() / 2 > $window.scrollTop())) {
						navigationItems.eq(activeSection).addClass('is-selected');
					} else {
						navigationItems.eq(activeSection).removeClass('is-selected');
					}
				}
			});
		}

		function smoothScroll(target) {
			$('body,html').animate(
				{ 'scrollTop': target.offset().top },
				600
			);
		}
	});

	// Launch Photoswipe
	var initPhotoSwipeFromDOM = function (gallerySelector) {

		// parse slide data (url, title, size ...) from DOM elements 
		// (children of gallerySelector)
		var parseThumbnailElements = function (el) {
			//var thumbElements = el.childNodes,

			var thumbElements = $(el).find('.pswp-figure').get(),
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

				size = linkEl.getAttribute('data-size').split('x');

				// create slide object
				item = {
					src: linkEl.getAttribute('href'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};

				if (figureEl.children.length > 1) {
					// <figcaption> content
					item.title = figureEl.children[1].innerHTML;
				}

				if (linkEl.children.length > 0) {
					// <img> thumbnail element, retrieving thumbnail url
					item.msrc = linkEl.children[0].getAttribute('data-thumburl');
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

		var collectionHas = function (a, b) { //helper function (see below)
			for (var i = 0, len = a.length; i < len; i++) {
				if (a[i] == b) return true;
			}
			return false;
		};
		var findParentBySelector = function (elm, selector) {
			var all = document.querySelectorAll(selector);
			var cur = elm.parentNode;
			while (cur && !collectionHas(all, cur)) { //keep going up until you find a match
				cur = cur.parentNode; //go up
			}
			return cur; //will return null if not found
		};

		// triggers when user clicks on thumbnail
		var onThumbnailsClick = function (e) {
			e = e || window.event;

			// Bug fix for Block links and links inside blocks
			if ($(e.target).parents('.perfect-grid-item').find('.element-link').length > 0 || $(e.target).is('a')) {
				return;
			}

			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;

			// find root element of slide
			var clickedListItem = closest(eTarget, function (el) {
				return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
			});

			if (!clickedListItem) {
				return;
			}

			// find index of clicked item by looping through all child nodes
			// alternatively, you may define index via data- attribute
			// var clickedGallery = clickedListItem.parentNode,
			//var clickedGallery = findParentBySelector(clickedListItem, '.my-gallery'),
			var clickedGallery = $(clickedListItem).parents(gallerySelector)[0],
				//childNodes = clickedListItem.parentNode.childNodes,
				childNodes = $(clickedGallery).find('.pswp-figure').get(),
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
		var photoswipeParseHash = function () {
			var hash = window.location.hash.substring(1),
				params = {};

			if (hash.length < 5) {
				return params;
			}

			var vars = hash.split('&');
			for (var i = 0; i < vars.length; i++) {
				if (!vars[i]) {
					continue;
				}
				var pair = vars[i].split('=');
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

		var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0],
				gallery,
				options,
				items;

			items = parseThumbnailElements(galleryElement);

			// define options (if needed)
			options = {

				// define gallery index (for URL)
				galleryUID: galleryElement.getAttribute('data-pswp-uid'),

				getThumbBoundsFn: function (index) {
					// See Options -> getThumbBoundsFn section of documentation for more info
					var thumbnail = items[index].el.getElementsByClassName('pswp-item-thumb')[0], // find thumbnail
						image_content = items[index].el.getElementsByClassName('rex-custom-scrollbar')[0],
						pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
						rect = image_content.getBoundingClientRect(),
						image_type = thumbnail.getAttribute('data-thumb-image-type');

					if (image_type == 'natural') {

						return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
					} else {
						// var full_rect = items[index].el.getBoundingClientRect();
						// return {x:full_rect.left, y:full_rect.top + pageYScroll, w:full_rect.width};;
						return null
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
					for (var j = 0; j < items.length; j++) {
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

			gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
		};

		// loop through all gallery elements and bind events
		var galleryElements = document.querySelectorAll(gallerySelector);

		for (var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i + 1);
			galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if (hashData.pid && hashData.gid) {
			openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
		}
	};

	// execute above function
	var rexpansiveSections = document.getElementsByClassName('rexpansive_section'),
		index = 0;

	for (index = 0; index < rexpansiveSections.length; index++) {
		var thisSection = rexpansiveSections[index],
			pswchilds = thisSection.getElementsByClassName('pswp-figure');
		if (pswchilds.length === 0) {
			$(thisSection).removeClass('photoswipe-gallery');
		}
	}

})(jQuery);
