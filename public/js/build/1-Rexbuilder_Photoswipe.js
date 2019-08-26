var Rexbuilder_Photoswipe = (function($){
	"use strict";

	var _addElement = function($itemContent, url, w, h, t) {
	    if ( !$itemContent.parents('.grid-stack-item').hasClass('block-has-slider') ) {
	      tmpl.arg = "image";
	      var $gridstackItemContent = $itemContent.parents(".grid-stack-item-content");
	      if ($itemContent.parents(".pswp-figure").length == 0) {
	        $itemContent.parent().prepend(
	          tmpl("tmpl-photoswipe-block", {
	            link: url,
	            width: w,
	            height: h,
	            type: t
	          })
	        );
	        var $pspwItem = $gridstackItemContent.find(".pswp-item");
	        $itemContent.detach().appendTo($pspwItem);
	      }
	    }
	};

	var _addElementFromInline = function($img) {
	    if ($img.attr("inline-photoswipe") == "true") {
          /*Setting photoswipe*/

          tmpl.arg = "image";
          $img.before(tmpl("tmpl-photoswipe-block", {
              link: $img.attr("src"),
              width: $img.css("width"),
              height: $img.css("height"),
              type: "full"
            })
          );

          // var $pswpItems = $img.parents(".text-wrap").find(".pswp-item");
          // var $pswpItemWithoutImage = $pswpItems.filter(function(index){
          //   return $(this).children().length == 3
          // });
          // don't know why it doesn't work
          // var $pswpItemWithoutImage = $pswpItems.filter(function(index){
          //   return $(this).children("img")
          // });
          
          // $img.detach().appendTo($pswpItemWithoutImage);
        }
	};

	var _removeElement = function($itemContent) {
		var $pswpFigure = $itemContent.parents(".pswp-figure");
		if ($pswpFigure.length != 0) {
		  var $pspwParent = $pswpFigure.parent();
		  $itemContent.detach().appendTo($pspwParent);
		  $pswpFigure.remove();
		}
	};

	var _removeElementFromInline = function($img) {
		var $pswpFigure = $img.parents(".pswp-figure");

        $img.detach().insertBefore($pswpFigure);
        $pswpFigure.remove();
	}

	var _init = function(gallerySelector) {
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
	init: _init,
	addElement: _addElement,
	addElementFromInline: _addElementFromInline,
	removeElement: _removeElement
	};
})(jQuery);