var Rexbuilder_Util = (function ($) {
	'use strict';

	var $window = $(window);

	var fixSectionWidth = 0;
	var editorMode = false;
	var windowIsResizing = false;
	var responsiveLayouts;
	var defaultLayoutSections;

	var createRandomID = function (n) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < n; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}

	var createSectionID = function () {
		var id;
		var flag;
		var idLength = 4;
		do {
			flag = true;
			id = createRandomID(idLength);
			Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function () {
				if (id == "self" || ($(this).attr('data-rexlive-section-id') !== undefined && $(this).attr('data-rexlive-section-id') == id)) {
					flag = false;
				}
			});
		} while (!flag);
		return id;
	}

	var createBlockID = function () {
		var id;
		var flag;
		var idLength = 4;
		var $this;
		do {
			flag = true;
			id = createRandomID(idLength);
			Rexbuilder_Util.$rexContainer.find('.grid-stack-item').each(function () {
				$this = $(this);
				if (id == "self" || ($this.attr('data-rexbuilder-block-id') !== undefined && $this.attr('data-rexbuilder-block-id') == id)) {
					flag = false;
				}
			});
		} while (!flag);
		return id;
	}

	var _updateSectionsID = function () {
		var id;
		var $sec;
		Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function (i, e) {
			$sec = $(e);
			if ($sec.attr('data-rexlive-section-id') === undefined) {
				id = createSectionID();
				$sec.attr('data-rexlive-section-id', id);
			}
		});
	}

	var _updateSectionsNumber = function () {
		var last;
		var $sec;
		Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function (i, e) {
			$sec = $(e);
			$sec.attr('data-rexlive-section-number', i);
			last = i;
		});
		Rexbuilder_Util.lastSectionNumber = last;
	}

	var chooseLayout = function () {
		var w = _viewport().width;
		console.log(w);
		var $resposiveData = $("#rexbuilder-layout-data");

		if ($resposiveData.children(".layouts-data").data("empty-customizations") == "true" || (Rexbuilder_Util.editorMode && Rexbuilder_Util.firstStart)) {
			return "default";
		}

		var $responsiveLayoutAvaible = JSON.parse($resposiveData.children(".available-layouts").text());
		var selectedLayoutName = "";
		console.log($responsiveLayoutAvaible);
		$.each($responsiveLayoutAvaible, function (i, layout) {
			if (layout["min"] == "") {
				layout["min"] = 0;
			}
		});

		var ordered = lodash.sortBy($responsiveLayoutAvaible, [function (o) { return parseInt(o["min"]); }]);

		$.each(ordered, function (i, layout) {
			if (w >= layout["min"]) {
				if (layout["max"] != "") {
					if (w < layout["max"]) {
						selectedLayoutName = layout["id"];
					}
				} else {
					selectedLayoutName = layout['id'];
				}
			}
		});

		if (selectedLayoutName === "") {
			selectedLayoutName = "default";
		}
		console.log(selectedLayoutName);
		return selectedLayoutName;
	}

	var _edit_dom_layout = function (chosenLayoutName) {

		if (chosenLayoutName == Rexbuilder_Util.activeLayout) {
			return;
		}
		console.log("chosen: " + chosenLayoutName);

		Rexbuilder_Util.$rexContainer.attr("data-rex-layout-selected", chosenLayoutName);
		var $resposiveData = $("#rexbuilder-layout-data");

		Rexbuilder_Util.activeLayout = chosenLayoutName;

		var data = {
			eventName: "rexlive:layoutChanged",
			activeLayoutName: chosenLayoutName
		}

		Rexbuilder_Util_Editor.sendParentIframeMessage(data);

		if (($resposiveData.children(".layouts-customizations").data("empty-customizations") == "true") || $resposiveData.children(".layouts-customizations").data("empty-customizations")) {
			return;
		}

		var layoutData = JSON.parse($resposiveData.children(".layouts-customizations").text());

		responsiveLayouts = layoutData;
		console.log(layoutData);
		$.each(layoutData, function (i, layout) {
			if (layout.name == "default") {
				defaultLayoutSections = layout.sections;
			}
		});

		var layoutSelected;
		var i;
		for (i = 0; i < layoutData.length; i++) {
			if (layoutData[i].name == chosenLayoutName) {
				layoutSelected = layoutData[i];
				break;
			}
		}

		var customSections;

		if (i == layoutData.length) {
			console.log("loading default layout");
			customSections = {};
		} else {
			customSections = layoutSelected.sections;
		}
		console.log("updaiting dom");
		var sectionRexId;
		var blockRexId;

		var targetName;
		var targetHide;
		var targetProps;
		var $section;
		var $sectionData;

		var $gallery;
		var $elem;
		var $itemContent;
		var $itemData;

		console.log(defaultLayoutSections);
		console.log(customSections);

		/* 		var x = lodash.merge({}, defaultLayoutSections);
				var y = lodash.merge({}, x, customSections);
				var z = lodash.merge({}, x, y);
				console.log(x);
				console.log(y);
				console.log(z); */

		var mergedEdits = lodash.merge({}, defaultLayoutSections, customSections);
		console.log(mergedEdits);
		$.each(mergedEdits, function (i, section) {
			sectionRexId = section.section_rex_id;
			$section = Rexbuilder_Util.$rexContainer.children('section[data-rexlive-section-id="' + sectionRexId + '"]');
			$gallery = $section.find(".grid-stack-row");
			$.each(section.targets, function (i, target) {
				targetName = target.name;
				targetProps = target.props;
				if (targetName == "self") {
					/* console.log("setting section properties: "+targetName);
					for (const propName in targetProps) {
						console.log(propName + " " + targetProps[propName]);
					} */
				} else {
					//console.log("setting block properties: " + targetName);
					$elem = $gallery.children('div[data-rexbuilder-block-id="' + targetName + '"]');
					$itemData = $elem.children(".rexbuilder-block-data");
					$itemContent = $elem.find(".grid-item-content");

					_updateVideosBlock($itemData, $itemContent, targetProps["video_mp4_url"], targetProps["video_bg_url_vimeo"], targetProps["video_bg_url_youtube"]);



					for (var propName in targetProps) {
						switch (propName) {
							case "hide":
								;
								break;
							case "type":
								$itemData.attr('data-type', targetProps[propName]);
								break;

							case "size_x":
								$elem.attr('data-width', targetProps[propName]);
								break;

							case "size_y":
								$elem.attr('data-height', targetProps[propName]);
								break;

							case "row":
								$elem.attr('data-row', targetProps[propName]);
								break;

							case "col":
								$elem.attr('data-col', targetProps[propName]);
								break;

							/* 								case "gs_start_h":
																break;
							
															case "gs_width":
																$elem.attr('data-gs-width', targetProps[propName]);
																break;
							
															case "gs_height":
																$elem.attr('data-gs-height', targetProps[propName]);
																break;
							
															case "gs_y":
																$elem.attr('data-gs-y', targetProps[propName]);
																break;
							
															case "gs_x":
																$elem.attr('data-gs-x', targetProps[propName]);
																break;
							 */
							case "color_bg_block":
								console.log("setting bg color");
								console.log(targetProps[propName]);
								$itemContent.css('background-color', targetProps[propName]);
								break;

							case "image_bg_block":
								if (targetProps[propName] != "") {
									$itemContent.attr("style", "background-image: url('" + targetProps[propName] + "'); background-color: rgba(0, 0, 0, 0);");
								}
								break;

							case "image_width":
								if (targetProps[propName] != "") {
									$itemContent.attr('data-background-image-width', parseInt(targetProps[propName]));
								} else {
									$itemContent.attr('data-background-image-width', "");
								}
								break;

							case "image_height":
								if (targetProps[propName] != "") {
									$itemContent.attr('data-background-image-height', parseInt(targetProps[propName]));
								} else {
									$itemContent.attr('data-background-image-height', "");
								}
								break;

							case "id_image_bg_block":
								if (targetProps[propName] != "") {
									$itemContent.attr('data-id_image_bg_block', parseInt(targetProps[propName]));
								} else {
									$itemContent.attr('data-id_image_bg_block', "");
								}
								break;

							case "type_bg_block":
								$itemData.attr('data-type_bg_block', targetProps[propName]);
								break;

							case "image_size":
								if (targetProps[propName] != "") {
									if (targetProps[propName] == "full") {
										$itemContent.removeClass("natural-image-background");
										$itemContent.addClass("full-image-background");
									} else {
										$itemContent.removeClass("full-image-background");
										$itemContent.addClass("natural-image-background");
									}
								} else {
									$itemContent.removeClass("natural-image-background");
									$itemContent.removeClass("small-width");
								}
								$itemData.attr('data-image_size', targetProps[propName]);
								break;

							case "block_custom_class":
								$elem.removeClass();
								$elem.addClass("perfect-grid-item grid-stack-item w" + parseInt($elem.attr("data-gs-width")));
								if (editorMode) {
									$elem.addClass("rex-text-editable");
								}
								$elem.addClass(targetProps[propName]);
								$itemData.attr("data-block_custom_class", targetProps[propName]);
								break;

							case "block_padding":
								break;

							case "overlay_block_color":
								var $overlayDiv = $elem.find(".responsive-block-overlay");
								if (targetProps[propName] != "") {
									if ($overlayDiv.length != 0) {
										$overlayDiv.css("background-color", targetProps[propName]);
									} else {
										tmpl.arg = "overlay";
										var overlayDiv = tmpl("tmpl-overlay-block-div", { color: targetProps[propName] });
										$itemContent.children().wrapAll(overlayDiv);
									}
								} else {
									if ($overlayDiv.length != 0) {
										$overlayDiv.children().eq(0).unwrap()
									}
								}
								$itemData.attr("data-overlay_block_color", targetProps[propName]);
								break;
							case "photoswipe":
								if (!Rexbuilder_Util.editorMode) {
									if (targetProps[propName] == "true") {
										addPhotoSwipeElement($itemContent, targetProps['image_bg_block'], parseInt(targetProps['image_width']), parseInt(targetProps['image_height']), targetProps['image_size']);
										$section.addClass("photoswipe-gallery");
									} else {
										removePhotoSwipeElement($itemContent);
									}
									$itemData.attr("data-photoswipe", targetProps[propName]);
								}
								break;

							case "zak_background":
								break;

							case "zak_side":
								break;

							case "zak_title":
								break;

							case "zak_icon":
								break;

							case "zak_foreground":
								break;

							case "block_animation":
								break;

							case "video_has_audio":
								break;

							case "block_has_scrollbar":
								break;

							case "block_live_edited":
								break;

							default:
								console.log("rip");
								break;
						}
					}

				}
			});
		});

		if (!Rexbuilder_Util.editorMode) {
			initPhotoSwipe(".photoswipe-gallery");
		}
	}

	var addPhotoSwipeElement = function ($itemContent, url, w, h, t) {
		tmpl.arg = "image";
		var $gridstackItemContent = $itemContent.parents(".grid-stack-item-content");
		console.log("checking if is already photoswipe");
		if ($itemContent.parents(".pswp-figure").length == 0) {
			console.log("not");
			$itemContent.parent().prepend(tmpl("tmpl-photoswipe-block", {
				link: url,
				width: w,
				height: h,
				type: t
			}));
			var $pspwItem = $gridstackItemContent.find(".pswp-item");
			$itemContent.detach().appendTo($pspwItem)
		}
	}

	var removePhotoSwipeElement = function ($itemContent) {
		console.log("removing photoswipe");
		console.log($itemContent);
		var $pswpFigure = $itemContent.parents(".pswp-figure");
		console.log($pswpFigure);
		if ($pswpFigure.length != 0) {
			console.log("removing ps");
			var $pspwParent = $pswpFigure.parent();
			$itemContent.detach().appendTo($pspwParent);
			$pswpFigure.remove();
		}
	}

	var initPhotoSwipe = function (gallerySelector) {

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

	/**
	 * Updates video background of an element
	 * 
	 * @param {*} $itemData 
	 * @param {*} $itemContent 
	 * @param {*} urlMp4 mp4 url
	 * @param {*} urlVimeo vimeo url
	 * @param {*} urlYoutube youtube url
	 */
	var _updateVideosBlock = function ($itemData, $itemContent, urlMp4, urlVimeo, urlYoutube) {
		if ((urlMp4 == "") && (urlYoutube == "") && (urlVimeo == "")) {
			removeMp4Video($itemContent);
			removeYoutubeVideo($itemContent);
			removeVimeoVideo($itemContent);
		}
		if ((urlMp4 != "") && (urlYoutube == "") && (urlVimeo == "")) {
			removeYoutubeVideo($itemContent);
			removeVimeoVideo($itemContent);
			addMp4Video($itemContent, urlMp4);
		}
		if ((urlMp4 == "") && (urlYoutube != "") && (urlVimeo == "")) {
			removeMp4Video($itemContent);
			removeVimeoVideo($itemContent);
			addYoutubeVideo($itemContent, urlYoutube);
		}
		if ((urlMp4 == "") && (urlYoutube == "") && (urlVimeo != "")) {
			removeMp4Video($itemContent);
			removeYoutubeVideo($itemContent);
			addVimeoVideo($itemContent, urlVimeo);
		}

		$itemData.attr("data-video_mp4_url", urlMp4);
		$itemData.attr("data-video_bg_url", urlYoutube);
		$itemData.attr("data-video_bg_url_vimeo", urlVimeo);
	}

	var removeMp4Video = function ($itemContent) {
		var $videoWrap = $itemContent.children(".rex-video-wrap");
		var $toggleAudio = $itemContent.children(".rex-video-toggle-audio");
		if ($videoWrap.length != 0) {
			console.log("removing mp4 video");
			$itemContent.removeClass("mp4-player");
			$videoWrap.remove();
			$toggleAudio.remove();
		}
	}

	var removeYoutubeVideo = function ($itemContent) {
		if ($itemContent.hasClass("youtube-player")) {
			var $toggleAudio = $itemContent.children(".rex-video-toggle-audio");
			$itemContent.YTPPlayerDestroy();
			$itemContent.removeAttr("data-property");
			$itemContent.removeAttr("id");
			$itemContent.removeClass("youtube-player mb_YTPlayer isMuted");
			$toggleAudio.remove();
		}
	}

	var removeVimeoVideo = function ($itemContent) {
		var $vimeoWrap = $itemContent.children('.rex-video-vimeo-wrap');
		var $toggleAudio = $itemContent.children(".rex-video-toggle-audio");
		if ($vimeoWrap.length != 0) {
			var iframeVimeo = $vimeoWrap.children("iframe")[0];
			VimeoVideo.removePlayer(iframeVimeo);
			$itemContent.removeClass("vimeo-player");
			$vimeoWrap.remove();
			$toggleAudio.remove();
		}
	}

	var addMp4Video = function ($itemContent, urlmp4) {
		var $videoWrap = $itemContent.children(".rex-video-wrap");

		if ($videoWrap.length != 0 && $videoWrap.find("source").attr("src") == urlmp4) {
			return;
		}

		removeMp4Video($itemContent);
		console.log("adding mp4 video")

		tmpl.arg = "video";
		$itemContent.prepend(tmpl("tmpl-video-mp4", { url: urlmp4 }));
		$itemContent.append(tmpl("tmpl-video-toggle-audio"));
		$itemContent.addClass("mp4-player");
	}

	var addYoutubeVideo = function ($itemContent, urlYoutube) {
		if ($itemContent.hasClass("youtube-player")) {
			var ytPlayer = $itemContent.YTPGetPlayer();
			if (ytPlayer === undefined) {
				return;
			}
			var videoID = $itemContent.YTPGetVideoID();
			var urlID = getYoutubeID(urlYoutube);
			if (videoID != urlID) {
				$itemContent.YTPChangeMovie({
					videoURL: urlYoutube,
					containment: 'self',
					startAt: 0,
					mute: true,
					autoPlay: true,
					loop: true,
					opacity: 1,
					showControls: false,
					showYTLogo: false
				});
			}
		} else {
			$itemContent.addClass("youtube-player");
			$itemContent.attr("data-property", "{videoURL:'" + urlYoutube + "',containment:'self',startAt:0,mute:true,autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}");
			$itemContent.YTPlayer();
			$itemContent.append(tmpl("tmpl-video-toggle-audio"));
		}
	}

	var addVimeoVideo = function ($itemContent, urlVimeo) {
		var $vimeoWrap = $itemContent.children(".rex-video-vimeo-wrap");
		urlVimeo += "?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0&muted=1";
		if ($vimeoWrap.length != 0 && ($vimeoWrap.children("iframe").attr("src") == urlVimeo)) {
			return;
		}
		removeVimeoVideo($itemContent);

		console.log("adding vimeo video")

		tmpl.arg = "video";
		$itemContent.prepend(tmpl("tmpl-video-vimeo", { url: urlVimeo }));
		$itemContent.append(tmpl("tmpl-video-toggle-audio"));
		$itemContent.addClass("vimeo-player");

		var vimeoFrame = $itemContent.children(".rex-video-vimeo-wrap").find("iframe")[0];
		VimeoVideo.addPlayer("1", vimeoFrame);
	}


	// function to detect if we are on a mobile device
	var _detect_mobile = function () {
		if (!("ontouchstart" in document.documentElement)) {
			document.documentElement.className += " no-touch";
		} else {
			document.documentElement.className += " touch";
		}
	}

	// function to detect the viewport size
	var _viewport = function () {
		var e = window, a = 'inner';
		if (!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width: e[a + 'Width'], height: e[a + 'Height'] };
	};

	// function to find the youtube id based on an url
	var getYoutubeID = function (url) {
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

	// Get the value of a query variable from the actual url
	var _getQueryVariable = function (variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) { return pair[1]; }
		}
		return (false);
	};

	var _checkPresentationPage = function () {
		if (0 !== $('.rexpansive_portfolio_presentation').length) {
			return true;
		}
		return false;
	}

	var _checkStaticPresentationPage = function () {
		if (0 !== $('.rexpansive-static-portfolio').length) {
			return true;
		}
		return false;
	}

	var _checkPost = function () {
		if (0 !== $('#rex-article').length) {
			return true;
		}
		return false;
	}

	// find the animation/transition event names
	var _whichTransitionEvent = function () {
		var t,
			el = document.createElement("fakeelement");

		var transitions = {
			"transition": "transitionend",
			"OTransition": "oTransitionEnd",
			"MozTransition": "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		};

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	};

	var _whichAnimationEvent = function () {
		var t,
			el = document.createElement("fakeelement");

		var animations = {
			"animation": "animationend",
			"OAnimation": "oAnimationEnd",
			"MozAnimation": "animationend",
			"WebkitAnimation": "webkitAnimationEnd"
		}

		for (t in animations) {
			if (el.style[t] !== undefined) {
				return animations[t];
			}
		}
	};

	var addWindowListeners = function () {
		var firstResize = true;
		var timeout;
		Rexbuilder_Util.$window.on('resize', function (event) {
			if (!Rexbuilder_Util_Editor.elementIsResizing) {

				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();

				Rexbuilder_Util.windowIsResizing = true;
				if (firstResize) {
					Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
						var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
						if (galleryEditorIstance !== undefined) {
							galleryEditorIstance.removeScrollbars();
						}
					});
					firstResize = false;
				}

				clearTimeout(timeout);
				timeout = setTimeout(doneResizing, 1000);
			}
		});

		function doneResizing() {
			console.log("window resized");
			Rexbuilder_Util.windowIsResizing = true;

			/* Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
				var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
				if (galleryEditorIstance !== undefined) {
					galleryEditorIstance.batchGridstack();
				}
			}); */

			if (Rexbuilder_Util.editorMode && !Rexbuilder_Util_Editor.buttonResized) {
				return;
			}

			if (Rexbuilder_Util.editorMode) {
				Rexbuilder_Util_Editor.buttonResized = false;
				_edit_dom_layout(Rexbuilder_Util_Editor.clickedLayoutID);
			} else {
				_edit_dom_layout(chooseLayout());
			}


			Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
				var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
				if (galleryEditorIstance !== undefined) {

					galleryEditorIstance._defineDynamicPrivateProperties();

					/* if (Rexbuilder_Util.viewport().width <= 768) {
						galleryEditorIstance.collapseElements();
					} else {
						galleryEditorIstance.restoreGrid();
					} */


					galleryEditorIstance.updateBlocksHeight();

					if (galleryEditorIstance.settings.galleryLayout == 'fixed') {
						galleryEditorIstance.updateGridstackFixedMode();

					}
					galleryEditorIstance = undefined;
				}
			});

			/* Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
				var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
				if (galleryEditorIstance !== undefined) {
					galleryEditorIstance.commitGridstack();
				}
			}); */

			Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
				var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
				if (galleryEditorIstance !== undefined) {
					galleryEditorIstance.createScrollbars();
				}
			});

			Rexbuilder_Util.windowIsResizing = false;
			firstResize = true;
		}

	}

	var _destroyVideoPlugins = function () {
		console.log(Rexbuilder_Util.$rexContainer.find(".youtube-player"));
		//casa.find(".youtube-player").YTPPlayerDestroy();
	}

	var _launchVideoPlugins = function () {
		/* -- Launching YouTube Video -- */
		// declare object for video
		if (!jQuery.browser.mobile) {
			Rexbuilder_Util.$rexContainer.find(".youtube-player").YTPlayer();
		} else {
			Rexbuilder_Util.$rexContainer.find('.youtube-player').each(function (i, el) {
				var $this = $(el),
					data_yt = eval('(' + $this.attr('data-property') + ')'),
					url = data_yt.videoURL,
					id = getYoutubeID(url);

				$this.css('background-image', 'url(http://img.youtube.com/vi/' + id + '/0.jpg)');
				$this.click(function (e) {
					e.preventDefault();
					window.location.href = url;
				});

			});
			// $('.rex-video-wrap').getVideoThumbnail();
		}

		RexSlider.init();

		VimeoVideo.init();
	}

	var setContainer = function ($container) {
		this.$rexContainer = $container;
	}

	/**
	 * Javascript crossbrowser class search
	 * @param {node} el js element
	 * @param {string} c class name to find
	 * @since 1.1.3
	 */
	var _has_class = function (el, c) {
		if (el.classList) {
			return el.classList.contains(c);
		} else {
			return new RegExp('(^| )' + c + '( |$)', 'gi').test(el.className);
		}
	}
	var _transitionEvent = '';
	var _animationEvent = '';

	var _scroll_timing = 600;

	// init the utilities
	var init = function () {
		this.firstStart = true;

		if (_plugin_frontend_settings.user.logged && _plugin_frontend_settings.user.editing) {
			this.editorMode = true;
		} else {
			this.editorMode = false;
		}

		this.$window = $(window);
		this.$body = $("body");

		this.$rexContainer = $(".rex-container");

		this.lastSectionNumber = -1;

		this.activeLayout = "";
		_updateSectionsID();

		var l = chooseLayout();
		console.log(l);

		_edit_dom_layout(l);

		_updateSectionsNumber();

		_detect_mobile();

		this._transitionEvent = _whichTransitionEvent();
		this._animationEvent = _whichAnimationEvent();

		this.scrollbarProperties = {
			//className: "rex-overlay-scrollbar", per quando dobbiamo stilare usiamo questa classe
			className: "os-theme-dark",
			overflowBehavior: { x: "hidden" },
			autoUpdate: false
		};
		this.firstStart = false;
	}

	return {
		init: init,
		viewport: _viewport,
		getYoutubeID: getYoutubeID,
		transitionEvent: _transitionEvent,
		animationEvent: _animationEvent,
		getQueryVariable: _getQueryVariable,
		checkPresentationPage: _checkPresentationPage,
		checkStaticPresentationPage: _checkStaticPresentationPage,
		checkPost: _checkPost,
		$window: $window,
		scroll_timing: _scroll_timing,
		fixSectionWidth: fixSectionWidth,
		editorMode: editorMode,
		windowIsResizing: windowIsResizing,
		addWindowListeners: addWindowListeners,
		launchVideoPlugins: _launchVideoPlugins,
		destroyVideoPlugins: _destroyVideoPlugins,
		chooseLayout: chooseLayout,
		setContainer: setContainer,
		createSectionID: createSectionID,
		createBlockID: createBlockID,
		has_class: _has_class,
		responsiveLayouts: responsiveLayouts,
		defaultLayoutSections: defaultLayoutSections,
		edit_dom_layout: _edit_dom_layout
	};

})(jQuery);