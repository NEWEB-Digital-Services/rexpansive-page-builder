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

		if ($resposiveData.children(".layouts-data").data("empty-customizations") == "true") {
			return "default";
		}

		var $responsiveLayoutAvaible = JSON.parse($resposiveData.children(".available-layouts").text());
		var selectedLayoutName = "";
		console.log($responsiveLayoutAvaible);
		$.each($responsiveLayoutAvaible, function (i, layout) {
			if (layout['min'] == "") {
				layout['min'] = "0";
			}
		});

		var ordered = lodash.sortBy($responsiveLayoutAvaible, [function (o) { return parseInt(o['min']); }]);

		$.each(ordered, function (i, layout) {
			if (w >= layout['min']) {
				if (layout['max'] != "") {
					if (w < layout['max']) {
						selectedLayoutName = layout['id'];
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
		console.log("chosen: " + chosenLayoutName);
		Rexbuilder_Util.$rexContainer.attr("data-rex-layout-selected", chosenLayoutName);
		var $resposiveData = $("#rexbuilder-layout-data");
		if (chosenLayoutName == Rexbuilder_Util.activeLayout) {
			return;
		}

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

					for (var propName in targetProps) {
						switch (propName) {
							case "hide":
								;
								break;
							case "rexbuilder_block_id":
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
								}
								break;

							case "image_height":
								if (targetProps[propName] != "") {
									$itemContent.attr('data-background-image-height', parseInt(targetProps[propName]));
								}
								break;

							case "id_image_bg_block":
								if (targetProps[propName] != "") {
									$itemData.attr('data-id_image_bg_block', targetProps[propName]);
								}
								break;
							//video mp4
							case "video_bg_id":
								;
								break;
							case "video_mp4_url":
								var $videoWrap = $itemContent.children(".rex-video-wrap");
								var $toggleAudio = $itemContent.children(".rex-video-toggle-audio");
								if ($videoWrap.length != 0) {
									if (false) {
										$videoWrap.remove();
										$toggleAudio.remove();
									}
								}
								if (targetProps[propName] != "") {
									tmpl.arg = "video";
									$itemContent.prepand(tmpl("tmpl-video-mp4", { url: targetProps[propName] }));
									$itemContent.append(tmpl("tmpl-video-toggle-audio"));
								}
								break;

							// video youtube
							case "video_bg_url":

								break;

							// video vimeo
							case "video_bg_url_vimeo":

								break;

							case "type_bg_block":
								break;

							case "image_size":
								break;

							case "photoswipe":
								break;

							case "block_custom_class":
								break;

							case "block_padding":
								break;

							case "overlay_block_color":
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

			if (!editorMode) {
				console.log("not editor, changing layout");
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
		defaultLayoutSections: defaultLayoutSections
	};

})(jQuery);