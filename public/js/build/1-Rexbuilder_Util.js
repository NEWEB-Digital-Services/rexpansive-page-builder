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
            if (id == "self") {
                flag = false;
            } else {
                Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function () {
                    if ($(this).attr('data-rexlive-section-id') !== undefined && $(this).attr('data-rexlive-section-id') == id) {
                        flag = false;
                    }
                });
            }
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
            if (id == "self") {
                flag = false;
            } else {
                Rexbuilder_Util.$rexContainer.find('.grid-stack-item').each(function () {
                    $this = $(this);
                    if ($this.attr('data-rexbuilder-block-id') !== undefined && $this.attr('data-rexbuilder-block-id') == id) {
                        flag = false;
                    }
                });
            }
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
        var $responsiveData = $("#rexbuilder-layout-data");
        if ($responsiveData.children(".layouts-data").data("empty-customizations") == "true" || (Rexbuilder_Util.editorMode && Rexbuilder_Util.firstStart)) {
            return "default";
        }

        var responsiveLayouts = JSON.parse($responsiveData.children(".available-layouts").text());
        var avaiableNames = JSON.parse($responsiveData.children(".available-layouts-names").text());
        var responsiveLayoutAvaible = [];

        for (var i = 0; i < avaiableNames.length; i++) {
            for (var j = 0; j < responsiveLayouts.length; j++) {
                if (responsiveLayouts[j].id == avaiableNames[i]) {
                    responsiveLayoutAvaible.push(responsiveLayouts[j]);
                }
            }
        }

        var selectedLayoutName = "";

        $.each(responsiveLayoutAvaible, function (i, layout) {
            if (layout["min"] == "") {
                layout["min"] = 0;
            }
        });

        var ordered = lodash.sortBy(responsiveLayoutAvaible, [function (o) { return parseInt(o["min"]); }]);

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
        return selectedLayoutName;
    }

    var _edit_dom_layout = function (chosenLayoutName) {
        if (chosenLayoutName == Rexbuilder_Util.activeLayout) {
            // cos, che cazzo dovrebbe fare?
            if (chooseLayout == "default" && _viewport().width > 1024) {
                return;
            }
        }
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
        var forceCollapseElementsGrid = false;
        if (i == layoutData.length || chosenLayoutName == "default") {
            if (_viewport().width < 1025) {
                forceCollapseElementsGrid = true;
            }
            customSections = {};
        } else {
            customSections = layoutSelected.sections;
        }
        // removing collapsed from grid
        Rexbuilder_Util.removeCollapsedGrids();

        var sectionRexId;

        var targetName;
        var targetHide;
        var targetProps;
        var $section;

        var $gallery;
        var $elem;
        var $itemContent;
        var $itemData;
        var mergedEdits = lodash.merge({}, defaultLayoutSections, customSections);
        console.log("applying data");
        console.log(mergedEdits);

        Rexbuilder_Util.domUpdaiting = true;
        $.each(mergedEdits, function (i, section) {
            sectionRexId = section.section_rex_id;
            $section = Rexbuilder_Util.$rexContainer.children('section[data-rexlive-section-id="' + sectionRexId + '"]');
            $gallery = $section.find(".grid-stack-row");
            var galleryData = $gallery.data();
            if (galleryData !== undefined) {
                var galleryEditorIstance = $gallery.data().plugin_perfectGridGalleryEditor;
                if (galleryEditorIstance !== undefined) {
                    var gridstackInstance = galleryEditorIstance.properties.gridstackInstance;
                    galleryEditorIstance.batchGridstack();
                }
            }

            var targets = section.targets;

            for (var i = 1; i < targets.length; i++) {
                targetName = targets[i].name;
                targetProps = targets[i].props;
                $elem = $gallery.children('div[data-rexbuilder-block-id="' + targetName + '"]');
                $itemData = $elem.children(".rexbuilder-block-data");
                $itemContent = $elem.find(".grid-item-content");

                var videoOptions = {
                    targetData: $itemData,
                    target: $itemContent,
                    idMp4: targetProps["video_bg_id"],
                    urlMp4: targetProps["video_mp4_url"],
                    urlVimeo: targetProps["video_bg_url_vimeo"],
                    urlYoutube: targetProps["video_bg_url_youtube"],
                    targetType: "block",
                    hasAudio: targetProps['video_has_audio'] == "1" || targetProps['video_has_audio'].toString() == "true" ? true : false
                };

                _updateVideos(videoOptions);

                Rexbuilder_Dom_Util.updateImageBG($itemContent, isNaN(parseInt(targetProps['id_image_bg'])) ? "" : parseInt(targetProps['id_image_bg']), targetProps['image_bg_url'], parseInt(targetProps['image_width']), parseInt(targetProps['image_height']), targetProps['type_bg_image']);

                _updateElementDimensions($elem, $itemData, targetProps["gs_x"], targetProps["gs_y"], targetProps["gs_width"], targetProps["gs_height"], targetProps["gs_start_h"], gridstackInstance);

                for (var propName in targetProps) {
                    switch (propName) {
                        case "hide":
                            if (targetProps[propName].toString() == "true") {
                                $elem.addClass("rex-hide-element");
                            } else {
                                $elem.removeClass("rex-hide-element");
                            }
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

                        case "color_bg_block":
                            $itemContent.css('background-color', targetProps[propName]);
                            break;

                        case "block_custom_class":
                            $elem.removeClass();
                            $elem.addClass("perfect-grid-item grid-stack-item w" + parseInt($elem.attr("data-gs-width")));
                            if (Rexbuilder_Util.editorMode) {
                                $elem.addClass("rex-text-editable");
                            }
                            if ($elem.find(".rex-slider-wrap").length != 0) {
                                $elem.addClass("block-has-slider");
                            }
                            $elem.addClass(targetProps[propName]);
                            $itemData.attr("data-block_custom_class", targetProps[propName]);
                            break;

                        case "block_padding":
                            var $textWrap = $itemContent.find(".text-wrap");
                            if ($textWrap.length != 0) {
                                var newPaddings = targetProps[propName].split(/;/g);
                                $textWrap.css("padding-top", newPaddings[0]);
                                $textWrap.css("padding-right", newPaddings[1]);
                                $textWrap.css("padding-bottom", newPaddings[2]);
                                $textWrap.css("padding-left", newPaddings[3]);
                            }
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

                        case "linkurl":
                            if (!Rexbuilder_Util.editorMode) {
                                if (targetProps[propName] != "") {
                                    if ($itemContent.parents(".element-link").length != 0) {
                                        //console.log("already a link");
                                        $itemContent.parents(".element-link").attr("href", targetProps[propName]);
                                        $itemContent.parents(".element-link").attr("title", targetProps[propName]);
                                    } else {
                                        //console.log("not a block link");
                                        var $itemContentParent = $itemContent.parent();
                                        tmpl.arg = "link";
                                        $itemContentParent.append(tmpl("tmpl-link-block", {
                                            url: targetProps[propName]
                                        }));
                                        $itemContent.detach().appendTo()
                                        var $link = $itemContentParent.children(".element-link");
                                        $itemContent.detach().appendTo($link);
                                    }
                                } else {
                                    if ($itemContent.parents(".element-link").length != 0) {
                                        var $linkEl = $itemContent.parents(".element-link");
                                        $linkEl.children().unwrap();
                                    }
                                }
                            }
                            break;

                        case "zak_background":
                        case "zak_side":
                        case "zak_title":
                        case "zak_icon":
                        case "zak_foreground":
                            break;

                        case "block_animation":
                            break;

                        case "block_has_scrollbar":
                            break;

                        case "block_live_edited":
                            break;

                        case "overwritten":
                            $itemData.attr("data-custom_layout", targetProps[propName].toString());
                            break;

                        default:
                            break;
                    }
                }
            }

            updateSection($section, $gallery, targets[0].props, forceCollapseElementsGrid);

            if (galleryData !== undefined) {
                var galleryEditorIstance = $gallery.data().plugin_perfectGridGalleryEditor;
                if (galleryEditorIstance !== undefined) {
                    galleryEditorIstance.commitGridstack();
                }
            }
        });
        Rexbuilder_Util.domUpdaiting = false;

        if (!Rexbuilder_Util.editorMode) {
            initPhotoSwipe(".photoswipe-gallery");
        }
    }

    var updateSection = function ($section, $gallery, targetProps, forceCollapseElementsGrid) {
        var $sectionData = $section.children(".section-data");

        Rexbuilder_Dom_Util.updateImageBG($section, isNaN(parseInt(targetProps['id_image_bg_section'])) ? "" : parseInt(targetProps['id_image_bg_section']), targetProps['image_bg_section'], parseInt(targetProps['image_width']), parseInt(targetProps['image_height']));

        var videoOptions = {
            targetData: $sectionData,
            target: $section,
            idMp4: targetProps["video_bg_id"],
            urlMp4: targetProps["video_mp4_url"],
            urlVimeo: targetProps["video_bg_url_vimeo_section"],
            urlYoutube: targetProps["video_bg_url_section"],
            targetType: "section",
            hasAudio: false
        };

        _updateVideos(videoOptions);

        var margins = {
            top: isNaN(parseInt(targetProps["row_margin_top"])) ? 0 : parseInt(targetProps["row_margin_top"]),
            right: isNaN(parseInt(targetProps["row_margin_right"])) ? 0 : parseInt(targetProps["row_margin_right"]),
            bottom: isNaN(parseInt(targetProps["row_margin_bottom"])) ? 0 : parseInt(targetProps["row_margin_bottom"]),
            left: isNaN(parseInt(targetProps["row_margin_left"])) ? 0 : parseInt(targetProps["row_margin_left"])
        }
        
        Rexbuilder_Dom_Util.updateSectionMargins($section, margins);

        var rowSettings = {
            gutter: targetProps['block_distance'],
            row_separator_top: targetProps['row_separator_top'],
            row_separator_bottom: targetProps['row_separator_bottom'],
            row_separator_right: targetProps['row_separator_right'],
            row_separator_left: targetProps['row_separator_left'],
            full_height: targetProps['full_height'],
            layout: targetProps['layout'],
            section_width: targetProps['section_width'],
            dimension: targetProps['dimension'],
            collapse_grid: targetProps['collapse_grid'].toString() == "true" || forceCollapseElementsGrid,
        }

        Rexbuilder_Dom_Util.updateRow($section, $sectionData, $gallery, rowSettings);

        $section.css('background-color', targetProps["color_bg_section"]);
        Rexbuilder_Dom_Util.updateSectionName($section, targetProps['section_name']);
        $section.attr('data-type', targetProps['type']);
    }

    var _updateElementDimensions = function ($elem, $elemData, x, y, w, h, startH, gridstackInstance) {
        x = parseInt(x);
        y = parseInt(y);
        w = parseInt(w);
        h = parseInt(h);
        startH = parseInt(startH);
        if (typeof gridstackInstance !== "undefined") {
            gridstackInstance.update($elem[0], x, y, w, h);
        } else {
            $elem.attr("data-gs-height", h);
            $elem.attr("data-gs-width", w);
            $elem.attr("data-gs-y", y);
            $elem.attr("data-gs-x", x);
        }
        $elemData.attr("data-gs_start_h", startH);
        $elemData.attr("data-gs_width", w);
        $elemData.attr("data-gs_height", h);
        $elemData.attr("data-gs_y", y);
        $elemData.attr("data-gs_x", x);
    }

    var addPhotoSwipeElement = function ($itemContent, url, w, h, t) {
        tmpl.arg = "image";
        var $gridstackItemContent = $itemContent.parents(".grid-stack-item-content");
        //console.log("checking if is already photoswipe");
        console.log("have to add photoswipe?");
        if ($itemContent.parents(".pswp-figure").length == 0) {
            console.log("yes?");

            //console.log("not");
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
        //console.log("removing photoswipe");
        //console.log($itemContent);
        var $pswpFigure = $itemContent.parents(".pswp-figure");
        //console.log($pswpFigure);
        if ($pswpFigure.length != 0) {
            //console.log("removing ps");
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

    var _updateVideos = function (videoOptions) {
        var $targetData = videoOptions.targetData,
            $target = videoOptions.target,
            idMp4 = videoOptions.idMp4,
            urlMp4 = videoOptions.urlMp4,
            urlVimeo = videoOptions.urlVimeo,
            urlYoutube = videoOptions.urlYoutube,
            targetType = videoOptions.targetType,
            hasAudio = videoOptions.hasAudio;

        if (($.isEmptyObject(urlMp4) || urlMp4 == "undefined") && ($.isEmptyObject(urlYoutube) || urlYoutube == "undefined") && ($.isEmptyObject(urlVimeo) || urlVimeo == "undefined")) {
            //console.log("NO VIDEO ACTIVE ON THIS BLOCK"); 
            Rexbuilder_Dom_Util.removeMp4Video($target, targetType);
            Rexbuilder_Dom_Util.removeYoutubeVideo($target, targetType);
            Rexbuilder_Dom_Util.removeVimeoVideo($target, targetType);
        }
        if (!($.isEmptyObject(urlMp4) || urlMp4 == "undefined") && ($.isEmptyObject(urlYoutube) || urlYoutube == "undefined") && ($.isEmptyObject(urlVimeo) || urlVimeo == "undefined")) {
            //console.log("VIDEO MP4 ON THIS BLOCK");
            Rexbuilder_Dom_Util.removeYoutubeVideo($target, targetType);
            Rexbuilder_Dom_Util.removeVimeoVideo($target, targetType);
            Rexbuilder_Dom_Util.addMp4Video($target, urlMp4, targetType, hasAudio);
        }
        if (($.isEmptyObject(urlMp4) || urlMp4 == "undefined") && !($.isEmptyObject(urlYoutube) || urlYoutube == "undefined") && ($.isEmptyObject(urlVimeo) || urlVimeo == "undefined")) {
            //console.log("VIDEO YOUTUBE ON THIS BLOCK");
            Rexbuilder_Dom_Util.removeMp4Video($target, targetType);
            Rexbuilder_Dom_Util.removeVimeoVideo($target, targetType);
            Rexbuilder_Dom_Util.addYoutubeVideo($target, urlYoutube, targetType, hasAudio);
        }
        if (($.isEmptyObject(urlMp4) || urlMp4 == "undefined") && ($.isEmptyObject(urlYoutube) || urlYoutube == "undefined") && !($.isEmptyObject(urlVimeo) || urlVimeo == "undefined")) {
            //console.log("VIDEO VIMEO ON THIS BLOCK");
            Rexbuilder_Dom_Util.removeMp4Video($target, targetType);
            Rexbuilder_Dom_Util.removeYoutubeVideo($target, targetType);
            Rexbuilder_Dom_Util.addVimeoVideo($target, urlVimeo, targetType, hasAudio);
        }

        if (targetType == "section") {
            $targetData.attr("data-video_bg_id_section", idMp4);
            $targetData.attr("data-video_mp4_url", urlMp4);
            $targetData.attr("data-video_bg_url_section", urlYoutube);
            $targetData.attr("data-video_bg_url_vimeo_section", urlVimeo);
        } else {
            $targetData.attr("data-video_bg_id", idMp4);
            $targetData.attr("data-video_mp4_url", urlMp4);
            $targetData.attr("data-video_bg_url", urlYoutube);
            $targetData.attr("data-video_bg_url_vimeo", urlVimeo);
            $targetData.attr("data-video_has_audio", hasAudio);
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
            Rexbuilder_Util.windowIsResizing = true;
            if (Rexbuilder_Util.editorMode && !Rexbuilder_Util_Editor.buttonResized) {
                Rexbuilder_Util.windowIsResizing = false;
                return;
            }

            if (Rexbuilder_Util.editorMode) {
                Rexbuilder_Util_Editor.buttonResized = false;
                _edit_dom_layout(Rexbuilder_Util_Editor.clickedLayoutID);
            } else {
                _edit_dom_layout(chooseLayout());
            }

            if (Rexbuilder_Util.activeLayout != Rexbuilder_Util.oldLayout) {
                Rexbuilder_Util.oldLayout = Rexbuilder_Util.activeLayout;
            }

            Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
                if (galleryEditorIstance !== undefined) {
                    galleryEditorIstance.batchGridstack();
                }
            });

            Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
                if (galleryEditorIstance !== undefined) {
                    galleryEditorIstance._defineDynamicPrivateProperties();
                    galleryEditorIstance.updateGridstackStyles();
                    galleryEditorIstance.updateBlocksHeight();
                    galleryEditorIstance = undefined;
                }
            });

            Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
                if (galleryEditorIstance !== undefined) {
                    galleryEditorIstance.commitGridstack();
                    galleryEditorIstance.createScrollbars();
                }
            });

            Rexbuilder_Util.windowIsResizing = false;
            firstResize = true;
        }

    }

    //@todo per quando si elimina un blocco
    var _stopVideo = function ($target) {
        ;
    }

    //@todo per quando si fa il redo sull'eliminazione un blocco che aveva un video
    var _playVideoFromBegin = function ($target) {
        ;
    }

    var _destroyVideoPlugins = function () {
        //console.log(Rexbuilder_Util.$rexContainer.find(".youtube-player"));
    }

    var _launchVideoPlugins = function () {
        /* -- Launching YouTube Video -- */
        // declare object for video
        if (!jQuery.browser.mobile) {
            Rexbuilder_Util.$rexContainer.find(".youtube-player").each(function () {
                if ($(this).YTPGetPlayer() === undefined) {
                    $(this).YTPlayer();
                    //console.log(this);
                    return;
                }
            });
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

    function _smoothScroll($target) {
        $('body,html').animate(
            { 'scrollTop': $target.offset().top + _plugin_frontend_settings.scroll_animation_offset },
            600
        );
    }

    var _getGalleryInstance = function ($section) {
        return $section.find(".grid-stack-row").data().plugin_perfectGridGalleryEditor;
    }

    var removeCollapsedGrids = function () {
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function () {
            if (Rexbuilder_Util.galleryPluginActive) {
                _getGalleryInstance($(this)).removeCollapseGrid();
            }
        });
    }

    var _startVideoPlugin = function ($target) {
        if ($target.hasClass("mp4-player")) {
            ;
        } else if ($target.hasClass("vimeo-player")) {
            var vimeoFrame = $target.children(".rex-video-vimeo-wrap").find("iframe")[0];
            var opt = {
                autoplay: true,
                background: true,
                loop: true
            };
            VimeoVideo.addPlayer("1", vimeoFrame, opt);
        } else if ($target.hasClass("youtube-player")) {
            if ($target.YTPGetPlayer() === undefined) {
                $target.YTPlayer();
            }
        }
    }

    var _destroyVideo = function ($target, targetType, detachDom) {
        if ($target.hasClass("mp4-player")) {
            Rexbuilder_Dom_Util.removeMp4Video($target, targetType, detachDom);
        } else if ($target.hasClass("vimeo-player")) {
            Rexbuilder_Dom_Util.removeVimeoVideo($target, targetType, detachDom);
        } else if ($target.hasClass("youtube-player")) {
            Rexbuilder_Dom_Util.removeYoutubeVideo($target, targetType, detachDom);
        }
    }

    var _pauseVideo = function ($target) {
        if ($target.hasClass("mp4-player")) {
            $target.find("video")[0].pause();
        } else if ($target.hasClass("vimeo-player")) {
            var vimeoPlugin = VimeoVideo.findVideo($target.find("iframe")[0]);
            vimeoPlugin.pause();
        } else if ($target.hasClass("youtube-player")) {
            if ($target.YTPGetPlayer() === undefined) {
                return;
            }
            $target.YTPPause();
        }
    }

    var _playVideo = function ($target) {
        if ($target.hasClass("mp4-player")) {
            $target.find("video")[0].play();
        } else if ($target.hasClass("vimeo-player")) {
            var vimeoPlugin = VimeoVideo.findVideo($target.find("iframe")[0]);
            vimeoPlugin.play();
        } else if ($target.hasClass("youtube-player")) {
            if ($target.YTPGetPlayer() === undefined) {
                return;
            }
            $target.YTPPlay();
        }
    }

    var _getBackgroundUrlFromCss = function (styleBackground) {
        return styleBackground.replace('url(', '').replace(')', '').replace(/\"/gi, "");
    }
    // init the utilities
    var init = function () {
        this.firstStart = true;
        _plugin_frontend_settings.scroll_animation_offset = 0;

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
        this.domUpdaiting = false;

        _updateSectionsID();

        var l = chooseLayout();
        _edit_dom_layout(l);
        this.oldLayout = l;

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
        this.galleryPluginActive = false;
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
        edit_dom_layout: _edit_dom_layout,
        smoothScroll: _smoothScroll,
        getGalleryInstance: _getGalleryInstance,
        removeCollapsedGrids: removeCollapsedGrids,
        updateVideos: _updateVideos,
        stopVideo: _stopVideo,
        playVideoFromBegin: _playVideoFromBegin,
        pauseVideo: _pauseVideo,
        playVideo: _playVideo,
        destroyVideo: _destroyVideo,
        startVideoPlugin: _startVideoPlugin,
        getBackgroundUrlFromCss: _getBackgroundUrlFromCss
    };

})(jQuery);