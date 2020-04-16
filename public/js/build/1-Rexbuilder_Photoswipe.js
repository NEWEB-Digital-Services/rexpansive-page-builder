var Rexbuilder_Photoswipe = (function($){
	"use strict";

	var init_inline_pswp = function(e) {
		var initiator = e.target;
		var data_items = initiator.getAttribute('data-inline-pswp-info');

		if( 'undefined' !== typeof data_items && "" !== data_items ) {

			var pswpElement = document.querySelectorAll('.pswp')[0];
			var disableAnimation = false;

			// build items array
			var items = JSON.parse(data_items);

			var options = {
				// define gallery index (for URL)
				galleryUID: initiator.getAttribute('data-pswp-uid'),

				closeOnScroll: false,
				showHideOpacity: true
			};

			if (disableAnimation) {
				options.showAnimationDuration = 0;
			}

			var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
		}
	};

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
		/*Setting photoswipe*/

		// selects the alignment of the image
		var align = $img.attr("class").split(' ')[1];

		tmpl.arg = "image";
		$img.before(tmpl("tmpl-photoswipe-block-inline", {
			link: $img.attr("src"),
			width: $img.css("width"),
			height: $img.css("height"),
			type: "natural",
			align: align
			})
		);

		var $pswpItems = $img.parents(".text-wrap").find(".pswp-item");
		var $pswpItemWithoutImage = $pswpItems.filter(function(index){
			return $(this).children().length == 3;
		});

		$img.detach().appendTo($pswpItemWithoutImage);
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
		var parseThumbnailElements = function(el, index) {
			//var thumbElements = el.childNodes,
			/*if ( Rexbuilder_Util.hasClass( el, 'split-scrollable--active' ) ) {
				var thumbElements = $(el)
					.find('.opacity-block-active')
					.find(".pswp-figure")
					.get()
			} else*if ( Rexbuilder_Util.hasClass( el, 'split-scrollable' ) && 'undefined' !== typeof index ) {
				var thumbElements = $(el)
					.find('.opacity-block')
					.eq(index)
					.find('.pswp-figure')
					.get()
			} else {*/
				var thumbElements = $(el)
					// .find(".pswp-figure")
					.find(".pswp-figure")
					.get();	
			//}

			var splitScrollableGallery = Rexbuilder_Util.hasClass( el, 'split-scrollable' );
		  
			var numNodes = thumbElements.length,
				items = [],
				figureEl,
				linkEl,
				size,
				item;

			for (var i = 0; i < numNodes; i++) {
				if ( splitScrollableGallery && 'undefined' !== typeof index ) {
					// here handling splitscrollable
					// @todo WORK HERE
				} else {
					figureEl = thumbElements[i]; // <figure> element

					// include only element nodes
					if (figureEl.nodeType !== 1) {
						continue;
					}
				}

				linkEl = figureEl.children[0]; // <a> element

				size = linkEl.getAttribute("data-size").replace("px", "").split("x");

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
					'a' === e.target.tagName.toUpperCase()
				) {
				return;
			}

			var eTarget = e.target || e.srcElement;

			// find root element of slide
			var clickedListItem = closest(eTarget, function(el) {
				return el.tagName && el.tagName.toUpperCase() === "FIGURE";
			});

			if ( !clickedListItem) {
				return;
			}

			// prevent default click, if we found a correct pswp item
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);

			// find index of clicked item by looping through all child nodes
			// alternatively, you may define index via data- attribute
			// var clickedGallery = clickedListItem.parentNode,
			//var clickedGallery = findParentBySelector(clickedListItem, '.my-gallery'),
			var clickedGallery = $(clickedListItem).parents(gallerySelector)[0];
			//childNodes = clickedListItem.parentNode.childNodes,
			var childNodes = Array.prototype.slice.call( clickedGallery.getElementsByClassName('pswp-figure'))
			// var childNodes = $(clickedGallery)
			// 	.find(".pswp-figure")
			// 	.get(),
			var numChildNodes = childNodes.length,
				nodeIndex = 0,
				index;

			console.log(clickedListItem.children[0].href)

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

		var onOpenPhotoswipeInsideIframe = function() {
			var data = {
				eventName: "popUpContent:pswpOpened",
			};

			Rexbuilder_Util_Editor.sendParentIframeMessage( data );
		}

		var onClosePhotoswipeInsideIframe = function() {
			var data = {
				eventName: "popUpContent:pswpClosed",
			};

			Rexbuilder_Util_Editor.sendParentIframeMessage( data );
		}

		var openPhotoSwipe = function( index, galleryElement, disableAnimation, fromURL ) {
			var pswpElement = document.querySelectorAll(".pswp")[0],
				gallery,
				options,
				items;

			console.log('openPhotoSwipe', index)

			items = parseThumbnailElements(galleryElement, index);

			console.log(items)

			// define options (if needed)
			options = {
				// define gallery index (for URL)
				galleryUID: galleryElement.getAttribute("data-pswp-uid"),

				getThumbBoundsFn: function(index) {
					console.log('getThumbBoundsFn', index)
					// See Options -> getThumbBoundsFn section of documentation for more info
					var thumbnail = items[index].el.getElementsByClassName( "pswp-item-thumb" )[0], // find thumbnail
						image_content = items[index].el.getElementsByClassName( "rex-custom-scrollbar" )[0],
						pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
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
			if ( Rexbuilder_Util.isIframe ) {
				onOpenPhotoswipeInsideIframe();
				gallery.listen('close', onClosePhotoswipeInsideIframe);
			}
		};

		// loop through all gallery elements and bind events
		var galleryElements = document.querySelectorAll(gallerySelector);

		for (var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute("data-pswp-uid", i + 1);
			galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if ( hashData.pid && hashData.gid ) {
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
		removeElement: _removeElement,
		init_inline_pswp: init_inline_pswp
	};
})(jQuery);