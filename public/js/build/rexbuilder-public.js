var lodash = _.noConflict();

/**
 * Add Object to wrap the DOMContentLoad and WindowLoad logic
 * @since 1.1.3
 */
var Rexbuilder_App = (function($) {
  "use strict";

  var $sections = null;
  var $grids = null;
  var $accordions = null;

  var init = function() {
    Rexbuilder_Util.init();
    Rexbuilder_Dom_Util.init();

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
    }

    Rex_Navigator.init();
    //Rexbuilder_FormFixes.init();

    Rexbuilder_Util.addWindowListeners();

    $sections = Rexbuilder_Util.$rexContainer.find(".rexpansive_section");
    $grids = Rexbuilder_Util.$rexContainer.find(".grid-stack-row");
    $accordions = Rexbuilder_Util.$rexContainer.find('.rex-accordion');

    /* -- Launching the grid -- */
    // $grids.find(".wrapper-expand-effect").expandEffect();
    $grids.perfectGridGalleryEditor();

    /* -- Launching Photoswipe -- */
    if (!Rexbuilder_Util.editorMode) {
      // prevent pswp errors
      $sections.each(function(i, e) {
        var pswchilds = e.getElementsByClassName("pswp-figure");
        if (pswchilds.length === 0) {
          $(e).removeClass("photoswipe-gallery");
        }
      });
      initPhotoSwipeFromDOM(".photoswipe-gallery");
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
      for (var i = 0; i < excluded_links.length; i++) {
        $linksToSmooth = $linksToSmooth.not(excluded_links[i]);
      }

      $linksToSmooth = $linksToSmooth.not(_filterLinksToSmooth);

      $linksToSmooth.click(function() {
        if (
          location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
          location.hostname == this.hostname
        ) {
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
      duration: 300,
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
          var grid = data.properties.$content.parents('.grid-stack').data("gridstack");
          // grid.resize(block,null,Math.round(content.offsetHeight/grid.opts.cellHeight) + data.properties.$toggle[0].offsetHeight);
          // grid.resize(block,null,Math.round( ( content.offsetHeight + data.properties.$toggle[0].offsetHeight ) / grid.opts.cellHeight ));
          grid.resize(block,null,Math.round( data.element.parentElement.offsetHeight / grid.opts.cellHeight ));
        }
      };
    } else {
      accordionSettings.open = {
        progressClbk: function(data) {
          // var content = data.properties.$content[0];
          var block = data.properties.$content.parents('.grid-stack-item')[0];
          var grid = data.properties.$content.parents('.grid-stack').data("gridstack");
          grid.resize(block,null,Math.round( data.element.parentElement.offsetHeight / grid.opts.cellHeight ));
        }
      };
      accordionSettings.close = {
        progressClbk: function(data) {
          // var content = data.properties.$content[0];
          var block = data.properties.$content.parents('.grid-stack-item')[0];
          var grid = data.properties.$content.parents('.grid-stack').data("gridstack");
          grid.resize(block,null,Math.round( data.element.parentElement.offsetHeight / grid.opts.cellHeight ));
        }
      };
    }

    $accordions.rexAccordion(accordionSettings);
  };

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
  };

  var load = function() {
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

    $grids.find(".rex-indicator__placeholder").rexIndicator();

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

    if (typeof _plugin_frontend_settings !== "undefined") {
      if (1 == _plugin_frontend_settings.animations ) {
        if( false == _plugin_frontend_settings.user.editing ) {
          // Activate animations
          $(".rs-animation").rexScrollify({
            mobile: false
          });
        } else {
          $(".rs-animation").removeClass("has-rs-animation");
        }
      }
    }

    Rexbuilder_Util.galleryPluginActive = true;
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
      if (
        $(e.target)
          .parents(".perfect-grid-item")
          .find(".element-link").length > 0 ||
        $(e.target).is("a")
      ) {
        return;
      }

      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      var eTarget = e.target || e.srcElement;

      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
        return el.tagName && el.tagName.toUpperCase() === "FIGURE";
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
      for (var i = 0; i < vars.length; i++) {
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
  $(function() {
    Rexbuilder_App.init();
  });

  // Waiting for the complete load of the window
  $(window).load(function() {
    Rexbuilder_App.load();
  });
})(jQuery);
