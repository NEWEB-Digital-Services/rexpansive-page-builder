var Rexbuilder_Util = (function ($) {
	'use strict';

	var $window = $(window);

	var fixSectionWidth = 0;
	var editorMode = false;
	var windowIsResizing = false;
	var activeLayout;

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
		var idLength = 10;
		do {
			flag = true;
			id = createRandomID(idLength);
			Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function () {
				if ($(this).attr('data-rexlive-section-id') !== undefined && $(this).attr('data-rexlive-section-id') == id) {
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
		var w = $window.width();
		var $resposiveData = $("#rexbuilder-layout-data");

		if ($resposiveData.children(".layouts-data").data("empty-customizations") == "true") {
			return "default";
		}

		var $responsiveLayoutAvaible = JSON.parse($resposiveData.children(".available-layouts").text());
		var selectedLayout = "";

		$.each($responsiveLayoutAvaible, function (i, layout) {
			if (layout[1] == "") {
				layout[1] = "0";
			}
		});

		var ordered = lodash.sortBy($responsiveLayoutAvaible, [function (o) { return parseInt(o[1]); }]);

		$.each(ordered, function (i, layout) {
			if (w > layout[1]) {
				if (layout[2] != "") {
					if (w < layout[2]) {
						selectedLayout = layout[0];
					}
				} else {
					selectedLayout = layout[0];
				}
			}
		});

		if (selectedLayout === "") {
			selectedLayout = "default";
		}
		console.log(selectedLayout);
		return selectedLayout;
	}

	var _edit_dom_layout = function (chosenLayout) {
		Rexbuilder_Util.$rexContainer.attr("data-rex-layout-selected", chosenLayout);
		var $resposiveData = $("#rexbuilder-layout-data");
		if ((chosenLayout == activeLayout) || ($resposiveData.children(".layouts-customizations").data("empty-customizations") == "true")) {
			return;
		}
		activeLayout = chosenLayout;
		var layoutData = JSON.parse($resposiveData.children(".layouts-customizations").text());
		var layoutSelected;
		var i, j;
		for (i = 0; i < layoutData.length; i++) {
			if (layoutData[i].name == chosenLayout) {
				layoutSelected = layoutData[i];
				break;
			}
		}
		if (i == layoutData.length) {
			return;
		}

		console.log(layoutSelected);
		console.log("updaiting dom");

		var section;
		var sectionRexId;
		var target;
		var targetID;
		var targetProps;
		var hide;

		var $section;
		var $sectionData;

		var $gallery;
		var $block;
		var $blockContent;

		for (i = 0; i < layoutSelected.sections.length; i++) {
			section = layoutSelected.sections[i];
			sectionRexId = section.section_rex_id;
			console.log(sectionRexId);
			console.log(section);
			for (j = 0; j < section.targets.length; j++) {
				target = section.targets[j];
				targetID = target.name;
				hide = target.hide;
				targetProps = target.props;
				if (hide) {

				} else {

					console.log(targetID);
					if (targetID == "self") {
						for (const propName in targetProps) {
							console.log(propName + " " + targetProps[propName]);
						}
					} else {
						for (const propName in targetProps) {
							console.log(propName + " " + targetProps[propName]);
						}
					}
				}
			}
		}
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
			/* var $oldContainer = Rexbuilder_Util.$rexContainer;
			var $newContainer;
			var oldLayout = Rexbuilder_Util.$rexContainer.attr("data-layout-active");
			var newLayout = Rexbuilder_Util.chooseLayout();
			if(oldLayout != newLayout){
				$newContainer = $(".rex-layout-"+newLayout);
			}
			console.log($oldContainer);
			console.log($newContainer); */
			/* if ($oldContainer !== $newContainer) {
				console.log("new layout");
				//destroy
				//Rexbuilder_Util.destroyVideoPlugins();
				
				//update-container
				
				//re-create
				//Rexbuilder_Util.launchVideoPlugins();
			} else { */
			console.log("same layout");
			Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
				var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
				if (galleryEditorIstance !== undefined) {

					galleryEditorIstance._defineDynamicPrivateProperties();

					if (Rexbuilder_Util.viewport().width <= 768) {
						galleryEditorIstance.collapseElements();
					} else {
						galleryEditorIstance.restoreGrid();
					}

					var gridstack = galleryEditorIstance.$element.data('gridstack');

					galleryEditorIstance.updateBlocksHeight();

					if (galleryEditorIstance.settings.galleryLayout == 'fixed') {
						gridstack.cellHeight(galleryEditorIstance.properties.singleHeight);
						gridstack._initStyles();
						gridstack._updateStyles(galleryEditorIstance.properties.singleHeight);
					}

					galleryEditorIstance = undefined;
					gridstack = undefined;
				}
			});

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

		_updateSectionsID();

		_edit_dom_layout(chooseLayout());

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
		has_class: _has_class
	};

})(jQuery);