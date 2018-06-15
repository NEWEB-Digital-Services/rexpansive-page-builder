var lodash = _.noConflict();

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
    
    // Waiting for the complete load of the window
    $window.load(function () {
        /* -- Launching the textfill -- */
        var $textFillContainer = $(".text-fill-container-canvas");
        if ($textFillContainer.length > 0) {
            $textFillContainer.textFill({
                relative: true,
                relativeWrap: '.perfect-grid-item',
                fontFamily: _plugin_frontend_settings.textFill.font_family,
                fontWeight: _plugin_frontend_settings.textFill.font_weight
            });
            $textFillContainer.on('textfill-render-complete', function () {
                //$(this).parents('.perfect-grid-gallery').isotope('layout');
                $window.resize();
                // $('.perfect-grid-gallery').perfectGridGallery('relayoutGrid');
            });
        }

        RexSlider.startAutoPlay();

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
        /*var $block_scrollable = $('.perfect-grid-gallery[data-layout=fixed][data-full-height=true] .text-content .rex-custom-scrollbar');

        $block_scrollable.mCustomScrollbar();

        if (0 != $block_scrollable.length) {
            $window.resize(function () {
                if (Rexbuilder_Util.viewport().width < 768) {
                    $block_scrollable.mCustomScrollbar('destroy');
                } else {
                    $block_scrollable.mCustomScrollbar();
                }
            });
        }*/
    });

    // Waiting until the ready of the DOM
    $(function () {
        Rexbuilder_Util.init();

        Rexbuilder_Util.editorMode = true;

        Rexbuilder_Section.init();

        _detect_mobile();
        
        //Rexbuilder_FormFixes.init();

        /* -- Launching the grid -- */
        Rexbuilder_Util.$rexContainer.find('.grid-stack-row').perfectGridGalleryEditor();

        Rexbuilder_Util_Editor.addBlockToolboxListeners();
        
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

        if (true == _plugin_frontend_settings.native_scroll_animation) {

            var excluded_links = [
                '[href="#"]',
                '.no-smoothing',
                '.vertical-nav-link',
                '.rex-vertical-nav-link',
                '.woocommerce-review-link',
            ];

            // Smooth scroll on all internal links
            var $linksToSmooth = Rexbuilder_Util.$body.find('a[href*="#"]');
            for (var i = 0; i < excluded_links.length; i++) {
                $linksToSmooth = $linksToSmooth.not(excluded_links[i]);
            }

            $linksToSmooth = $linksToSmooth.not(_filterLinksToSmooth);

            $linksToSmooth.click(function () {
                if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        smoothScroll(target);
                        return false;
                    }
                }
            });
        };

        /* -- Handle dot behaviour --- */

        var contentSections = $('.rexpansive_section'),
            navigationItems = $('.vertical-nav a');

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
            $('.touch .vertical-nav').toggleClass('open');

        });
        //close navigation on touch devices when selectin an elemnt from the list
        var $touch_navigation_links = $('.touch .vertical-nav a');

        $touch_navigation_links.on('click', function () {
            $touch_navigation_links.find('.rex-label').removeClass('fadeInAndOut');
            $(this).find('.rex-label').addClass('fadeInAndOut');
            $('.touch .vertical-nav').removeClass('open');
        });

        function updateNavigation() {
            contentSections.each(function () {
                var $this = $(this);
                if (typeof $this.attr('id') != 'undefined' && $this.attr('id') != '') {
                    var activeSection = $('.vertical-nav a[href="#' + $this.attr('id') + '"]').data('number') - 1;
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

        // advanced check to exclude woocommerce tabs
        var _filterLinksToSmooth = function (index) {
            if ($(this).parents(".woocommerce-tabs").length != 0) {
                return true;
            } else {
                return false;
            }
        };
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
