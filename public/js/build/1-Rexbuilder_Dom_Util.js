var Rexbuilder_Dom_Util = (function ($) {
    'use strict';

    var _updateSlider = function (data) {
        var $textWrap = data.textWrap;
        var numberSliderToActive = data.sliderNumberToActive;

        $textWrap.children(".rex-slider-wrap:not([data-rex-slider-number=\"" + data.sliderNumberToActive + "\"])").each(function (i, slider) {
            var $slider = $(slider);
            $slider.css("display", "none");
            $slider.attr("data-rex-slider-active", false);
            RexSlider.destroySliderPlugins($slider);
        });

        var $sliderToActive = $textWrap.children(".rex-slider-wrap[data-rex-slider-number=\"" + numberSliderToActive + "\"]");

        if ($sliderToActive.length == 0) {
            var newSliderData = data.newSliderData;
            if (typeof newSliderData != "undefined") {
                var $elem = Rexbuilder_Util_Editor.sliderEditingObj.parents(".grid-stack-item");
                Rexbuilder_CreateBlocks.createSlider(data.newSliderData, $elem);
            }
        } else {
            $sliderToActive.css("display", "");
            RexSlider.initSlider($sliderToActive);
        }
    }

    var _updateSliderStack = function (data) {
        var $section = Rexbuilder_Util_Editor.sectionEditingObj;
        var $textWrap = Rexbuilder_Util_Editor.textWrapElementEditingObj;
        var $sliderObj = Rexbuilder_Util_Editor.sliderEditingObj;

        var reverseData = {
            textWrap: $textWrap,
            sliderNumberToActive: parseInt($sliderObj.attr("data-rex-slider-number"))
        };

        Rexbuilder_Dom_Util.lastSliderNumber = Rexbuilder_Dom_Util.lastSliderNumber + 1;

        var actionData = {
            textWrap: $textWrap,
            sliderNumberToActive: Rexbuilder_Dom_Util.lastSliderNumber,
            newSliderData: data
        };

        _updateSlider(actionData);

        Rexbuilder_Util_Editor.pushAction($section, "updateSlider", actionData, reverseData);
    }

    var _updateRow = function ($section, $sectionData, $galleryElement, rowSettings) {
        var grid_gutter = parseInt(rowSettings.gutter);
        var grid_separator_top = parseInt(rowSettings.row_separator_top);
        var grid_separator_right = parseInt(rowSettings.row_separator_right);
        var grid_separator_bottom = parseInt(rowSettings.row_separator_bottom);
        var grid_separator_left = parseInt(rowSettings.row_separator_left);

        var defaultGutter = 20;
        var row_distances = {
            gutter: isNaN(grid_gutter) ? defaultGutter : grid_gutter,
            top: isNaN(grid_separator_top) ? defaultGutter : grid_separator_top,
            right: isNaN(grid_separator_right) ? defaultGutter : grid_separator_right,
            bottom: isNaN(grid_separator_bottom) ? defaultGutter : grid_separator_bottom,
            left: isNaN(grid_separator_left) ? defaultGutter : grid_separator_left,
        }

        var
            gutter = row_distances.gutter,
            separatorTop = row_distances.top,
            separatorRight = row_distances.right,
            separatorBottom = row_distances.bottom,
            separatorLeft = row_distances.left,
            layout = typeof rowSettings.layout === "undefined" ? "fixed" : rowSettings.layout,
            fullHeight = typeof rowSettings.full_height === "undefined" || layout == "masonry" ? false : rowSettings.full_height,
            sectionWidth = typeof rowSettings.section_width === "undefined" ? "100%" : "" + rowSettings.section_width,
            widthType = typeof rowSettings.dimension === "undefined" ? "full" : rowSettings.dimension,
            collapseElements = typeof rowSettings.collapse_grid === "undefined" ? false : (rowSettings.collapse_grid.toString() == "true" ? true : false),
            $galleryParent = $galleryElement.parent();

        if (widthType == "full") {
            $galleryParent.removeClass("center-disposition");
            $galleryParent.addClass("full-disposition");
            $galleryParent.css("max-width", "100%");
        } else {
            $galleryParent.removeClass("full-disposition");
            $galleryParent.addClass("center-disposition");
            $galleryParent.css("max-width", sectionWidth);
        }

        $galleryElement.attr("data-separator", gutter);
        $galleryElement.attr("data-row-separator-top", separatorTop);
        $galleryElement.attr("data-row-separator-right", separatorRight);
        $galleryElement.attr("data-row-separator-bottom", separatorBottom);
        $galleryElement.attr("data-row-separator-left", separatorLeft);
        $galleryElement.attr("data-layout", layout);
        $galleryElement.attr("data-full-height", fullHeight);

        $sectionData.attr("data-section_width", sectionWidth);
        $sectionData.attr("data-dimension", widthType);
        $sectionData.attr("data-responsive_collapse", collapseElements);

        $section.attr("data-rex-collapse-grid", collapseElements);

        var galleryData = $galleryElement.data();
        if (galleryData !== undefined) {
            var galleryEditorInstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
            if (galleryEditorInstance !== undefined) {
                galleryEditorInstance.updateGridSettingsChangeLayout(rowSettings);
            }
        }

    }

    var _updateGridDomProperties = function ($galleryElement, data) {
        $galleryElement.attr("data-layout", data.layout);
        $galleryElement.attr("data-full-height", data.fullHeight);
        $galleryElement.attr("data-separator", data.rowDistances.gutter);
        $galleryElement.attr("data-row-separator-top", data.rowDistances.top);
        $galleryElement.attr("data-row-separator-right", data.rowDistances.right);
        $galleryElement.attr("data-row-separator-bottom", data.rowDistances.bottom);
        $galleryElement.attr("data-row-separator-left", data.rowDistances.left);
    }

    var _updateSectionMargins = function ($section, margins) {
        $section.css("margin-top", margins.top + "px");
        $section.css("margin-right", margins.right + "px");
        $section.css("margin-bottom", margins.bottom + "px");
        $section.css("margin-left", margins.left + "px");
    }

    var _updateImageBG = function ($target, data) {
        if ($target.hasClass("rexpansive_section")) {
            var $sectionData = $target.children(".section-data");
            if (data.idImage == "" || data.active.toString() != "true") {
                _resetImageSection($target, $sectionData);
            } else {
                _updateImageSection($target, $sectionData, data);
            }
        } else if ($target.hasClass("grid-item-content")) {
            var $elemData = $target.parents(".grid-stack-item").children(".rexbuilder-block-data");
            if (data.idImage == "" || data.active.toString() != "true") {
                _resetImageBlock($target, $elemData);
            } else {
                _updateImageBlock($target, $elemData, data);
            }
        }
    }

    var _updateImageSection = function ($section, $sectionData, data) {
        if (idImage == parseInt($sectionData.attr("data-id_image_bg_section"))) {
            //same image
            return
        }
        $section.css("background-image", "url(" + data.urlImage + ")");
        $section.attr('data-background_image_width', data.width);
        $section.attr('data-background_image_height', data.height);
        $sectionData.attr("data-id_image_bg_section", data.idImage);
        $sectionData.attr("data-image_bg_section", data.urlImage);
        $sectionData.attr("data-image_bg_section_active", data.active);
    }

    var _updateImageBlock = function ($itemContent, $elemData, data) {
        console.log(data);
        $elemData.attr("data-id_image_bg_block", data.idImage);
        $elemData.attr("data-type_bg_block", data.typeBGimage);
        $elemData.attr("data-image_bg_block", data.urlImage);
        $elemData.attr("data-image_size", "full");
        $elemData.attr("data-photoswipe", data.photoswipe);
        $elemData.attr("data-image_bg_elem_active", data.active);
        if (data.typeBGimage == "full") {
            $itemContent.removeClass("natural-image-background");
            $itemContent.addClass("full-image-background");
        } else if (data.typeBGimage == "natural") {
            $itemContent.removeClass("full-image-background");
            $itemContent.addClass("natural-image-background");
            var $elem = $itemContent.parents(".grid-stack-item");
            if ($elem.outerWidth() < data.width) {
                $itemContent.addClass('small-width');
            } else {
                $itemContent.removeClass('small-width');
            }
        }

        $itemContent.attr('data-background_image_width', data.width);
        $itemContent.attr('data-background_image_height', data.height);
        $itemContent.css("background-image", "url(" + data.urlImage + ")");
    }

    var _resetImageSection = function ($section, $sectionData) {
        $sectionData.attr("data-image_bg_section", "");
        $sectionData.attr("data-id_image_bg_section", "");
        $sectionData.data("image_size", "");
        $section.attr('data-background_image_width', "");
        $section.attr('data-background_image_height', "");
        $section.css("background-image", "");
    }

    var _resetImageBlock = function ($itemContent, $elemData) {
        $elemData.attr("data-id_image_bg_block", "");
        $elemData.attr("data-type_bg_block", "");
        $elemData.attr("data-image_bg_block", "");
        $elemData.attr("data-image_size", "");
        $elemData.attr("data-photoswipe", "");
        $elemData.attr("data-image_bg_elem_active", "");
        $itemContent.removeClass("natural-image-background");
        $itemContent.removeClass("full-image-background");
        $itemContent.removeClass("small-width");
        $itemContent.attr('data-background_image_width', "");
        $itemContent.attr('data-background_image_height', "");
        $itemContent.css("background-image", "");
    }

    var _removeYoutubeVideo = function ($target, targetType, removeFromDom) {
        var $ytpWrapper = $target.children(".rex-youtube-wrap");
        if ($ytpWrapper.length != 0) {
            removeFromDom = typeof removeFromDom == "undefined" ? true : removeFromDom;
            if (removeFromDom) {
                $ytpWrapper.YTPPlayerDestroy();
                $ytpWrapper.remove();
            } else {
                var videoID = $ytpWrapper.YTPGetVideoID();
                var hadAudio = $ytpWrapper.children(".rex-video-toggle-audio").length != 0;

                $ytpWrapper.YTPPlayerDestroy();
                $ytpWrapper.remove();

                tmpl.arg = "video";
                $target.prepend(tmpl("tmpl-video-youtube", { url: videoID, audio: false }));
                if (hadAudio) {
                    $target.children(".rex-youtube-wrap").append(tmpl("tmpl-video-toggle-audio"));
                }
            }
        }
    }

    var _removeVimeoVideo = function ($target, targetType, removeFromDom) {
        var $vimeoWrap = $target.children('.rex-video-vimeo-wrap');
        var $toggleAudio = $target.children(".rex-video-toggle-audio");
        if ($vimeoWrap.length != 0) {
            var iframeVimeo = $vimeoWrap.children("iframe")[0];
            removeFromDom = typeof removeFromDom == "undefined" ? true : removeFromDom;
            if (removeFromDom) {
                VimeoVideo.removePlayer(iframeVimeo);
                $target.removeClass("vimeo-player");
                $vimeoWrap.remove();
                if ($toggleAudio.length != 0) {
                    $toggleAudio.remove();
                }
            } else {
                VimeoVideo.findVideo(iframeVimeo).unload();
            }
        }
    }

    var _removeMp4Video = function ($target, targetType, removeFromDom) {
        if (targetType == "section") {
            var $videoWrap = $target.children(".rex-video-section-wrap");
            if ($videoWrap.length == 0) {
                $videoWrap = $target.children(".rex-video-wrap");
            }
            ////console.log($videoWrap);
        } else if (targetType == "block") {
            var $videoWrap = $target.children(".rex-video-wrap");
            var $toggleAudio = $target.children(".rex-video-toggle-audio");
        } else {
            return;
        }
        if ($videoWrap.length != 0) {
            removeFromDom = typeof removeFromDom == "undefined" ? true : removeFromDom;
            if (removeFromDom) {
                $target.removeClass("mp4-player");
                $videoWrap.remove();
                if (targetType != "section" && $toggleAudio.length != 0) {
                    $toggleAudio.remove();
                }
            } else {
                var videoEl = $videoWrap.find("video");
                videoEl.pause();
                videoEl.currentTime = 0;
            }
        }
    }

    var _addMp4Video = function ($target, urlmp4, targetType, hasAudio) {
        if (targetType == "section") {
            var $videoWrap = $target.children(".rex-video-section-wrap");

        } else if (targetType == "block") {
            var $videoWrap = $target.children(".rex-video-wrap");
        } else {
            return;
        }
        if ($videoWrap.length != 0 && $videoWrap.find("source").attr("src") == urlmp4) {
            if (targetType != "section") {
                var $toggleAudio = $target.children(".rex-video-toggle-audio");
                if ($toggleAudio.length == 0) {
                    if (hasAudio) {
                        $target.append(tmpl("tmpl-video-toggle-audio"));
                    }
                } else {
                    if (!hasAudio) {
                        $toggleAudio.remove();
                    }
                }
            }
            return;
        }

        _removeMp4Video($target);

        tmpl.arg = "video";
        $target.prepend(tmpl("tmpl-video-mp4", { url: urlmp4 }));
        if (hasAudio) {
            $target.append(tmpl("tmpl-video-toggle-audio"));
        }
        $target.addClass("mp4-player");
    }

    var _addYoutubeVideo = function ($target, urlYoutube, targetType, hasAudio) {
        var $ytpWrapper = $target.children(".rex-youtube-wrap");
        $target.addClass("youtube-player");
        if ($ytpWrapper.length != 0) {
            if ($ytpWrapper.YTPGetPlayer() === undefined) {
                $ytpWrapper.YTPlayer();
                $ytpWrapper.addClass("youtube-player-launching");
                return;
            }
            var videoID = $ytpWrapper.YTPGetVideoID();
            var urlID = Rexbuilder_Util.getYoutubeID(urlYoutube);
            if (videoID != urlID) {
                $ytpWrapper.YTPChangeMovie({
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
            tmpl.arg = "video";
            $target.prepend(tmpl("tmpl-video-youtube", { url: urlYoutube, audio: false }));
            $target.children(".rex-youtube-wrap").YTPlayer();
        }
        if (targetType != "section") {
            var $toggleAudio = $ytpWrapper.children(".rex-video-toggle-audio");
            if ($toggleAudio.length == 0) {
                if (hasAudio) {
                    $ytpWrapper.append(tmpl("tmpl-video-toggle-audio"));
                }
            } else {
                if (!hasAudio) {
                    $toggleAudio.remove();
                }
            }
        }
    }

    var _addVimeoVideo = function ($target, urlVimeo, targetType, hasAudio) {
        var $vimeoWrap = $target.children(".rex-video-vimeo-wrap");
        urlVimeo += "?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0&muted=1";
        if ($vimeoWrap.length != 0 && ($vimeoWrap.children("iframe").attr("src") == urlVimeo)) {
            if (targetType != "section") {
                var $toggleAudio = $target.children(".rex-video-toggle-audio");
                if ($toggleAudio.length == 0) {
                    if (hasAudio) {
                        $target.append(tmpl("tmpl-video-toggle-audio"));
                    }
                } else {
                    if (!hasAudio) {
                        $toggleAudio.remove();
                    }
                }
            }
            return;
        }
        _removeVimeoVideo($target, targetType);

        tmpl.arg = "video";
        $target.prepend(tmpl("tmpl-video-vimeo", { url: urlVimeo }));
        if (hasAudio) {
            $target.append(tmpl("tmpl-video-toggle-audio"));
        }
        $target.addClass("vimeo-player");

        var vimeoFrame = $target.children(".rex-video-vimeo-wrap").find("iframe")[0];
        VimeoVideo.addPlayer("1", vimeoFrame);
    }

    var _updateBlocksLayout = function (dataToUse) {
        var blocksDimensions = dataToUse.blocks;
        var i;
        var x, y, w, h;
        var elem;
        var gridstack = dataToUse.gridstackInstance;
        if (!Rexbuilder_Util_Editor.updatingGridstack) {
            gridstack.batchUpdate();
        }
        for (i = 0; i < blocksDimensions.length; i++) {
            x = blocksDimensions[i].x;
            y = blocksDimensions[i].y;
            w = blocksDimensions[i].w;
            h = blocksDimensions[i].h;
            elem = blocksDimensions[i].elem;
            gridstack.update(elem, x, y, w, h);
        }
        if (!Rexbuilder_Util_Editor.updatingGridstack) {
            gridstack.commit();
        }
    }

    var _collapseGrid = function (gridInstance, collapse) {
        if (collapse) {
            gridInstance.collapseElements();
        } else {
            gridInstance.removeCollapseGrid();
        }
    }

    var _updateRemovingBlock = function ($elem, hasToBeRemoved, galleryEditorInstance) {
        if (hasToBeRemoved) {
            galleryEditorInstance.removeBlock($elem);
        } else {
            galleryEditorInstance.reAddBlock($elem);
        }

        if (galleryEditorInstance.properties.numberBlocksVisibileOnGrid == 0) {
            $elem.parents(".rexpansive_section").addClass("empty-section");
        } else {
            $elem.parents(".rexpansive_section").removeClass("empty-section");
        }
    };

    var _updateSectionName = function ($section, newName) {
        $section.attr("data-rexlive-section-name", newName);
        var newSafeName = newName.replace(/ /gm, "");
        Rex_Navigator.updateNavigatorItem($section, newSafeName, newName);
    }

    var _enablePhotoswipeAllBlocksSection = function ($section) {
        var $gallery = $section.find(".grid-stack-row");
        $gallery.children(".grid-stack-item:not(.removing_block)").each(function (i, el) {
            var $elData = $(el).children(".rexbuilder-block-data");
            var textWrapLength = Rexbuilder_Util_Editor.getTextWrapLength($(el));
            if ($elData.attr("data-image_bg_block") != "" && textWrapLength == 0) {
                $elData.attr("data-photoswipe", true);
            }
        });
    }

    var _updateSectionPhotoswipe = function (elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].$data.attr("data-photoswipe", elements[i].photoswipe);
        }
    }

    /**
     * 
     * @param {*} $target target (section or block)
     * @param {*} newClasses array of new classes (strings)
     */
    var _updateCustomClasses = function ($target, newClasses) {
        var $targetData;
        var oldClasses;

        if ($target.is("section")) {
            $targetData = $target.children(".section-data");
            oldClasses = $targetData.attr("data-custom_classes");
        } else {
            $targetData = $target.children(".rexbuilder-block-data");
            oldClasses = $targetData.attr("data-block_custom_class");
        }

        oldClasses = oldClasses.trim();
        var oldClassesList = oldClasses.split(/\s+/);

        //removing oldClasses
        for (var i = 0; i < oldClassesList.length; i++) {
            Rexbuilder_Util_Editor.removeCustomClass(oldClassesList[i], $targetData);
            $target.removeClass(oldClassesList[i]);
        }

        // adding new Classes
        for (var i = 0; i < newClasses.length; i++) {
            Rexbuilder_Util_Editor.addCustomClass(newClasses[i], $targetData);
            $target.addClass(newClasses[i]);
        }
    }

    var _updateCustomCSS = function (newCss) {
        $("#rexpansive-builder-style-inline-css").text(newCss);
    }

    var _updateSectionVideoBackground = function (videoOpt) {
        Rexbuilder_Util.updateVideos(videoOpt);
    }

    var _updateSectionBackgroundColorLive = function ($section, color) {
        $section.css('background-color', color);
    }

    var _updateSectionBackgroundColor = function ($section, bgColor) {
        var $sectionData = $section.children(".section-data");
        $section.css('background-color', bgColor.color);
        $sectionData.attr("data-color_bg_section", bgColor.color);
        $sectionData.attr("data-color_bg_section_active", bgColor.active);
    }

    var _updateBlockBackgroundColorLive = function (data) {
        var $itemContent = Rexbuilder_Util.$rexContainer.find("div [data-rexbuilder-block-id=\"" + data.blockRexID + "\"] .grid-item-content");
        $itemContent.css('background-color', data.color);
        $itemContent = undefined;
    }

    var _updateBlockBackgroundColor = function (data) {
        var $elem = Rexbuilder_Util.$rexContainer.find("div [data-rexbuilder-block-id=\"" + data.blockRexID + "\"]");
        var $itemContent = $elem.find(".grid-item-content");
        var $elemData = $elem.children(".rexbuilder-block-data");

        $itemContent.css('background-color', data.color);
        $elemData.attr("data-color_bg_block", data.color);
        $elemData.attr("data-color_bg_elem_active", data.active);
    }

    var _updateSectionOverlayColorLive = function ($section, color) {
        $section.children(".responsive-overlay").css("background-color", color);
    }

    var _updateSectionOverlay = function ($section, overlay) {
        var $overlayElem = $section.children(".responsive-overlay");
        var $sectionData = $section.children(".section-data");
        $overlayElem.css("background-color", overlay.color);

        $sectionData.attr("data-row_overlay_color", overlay.color);
        $sectionData.attr("data-row_overlay_active", overlay.active);

        if (overlay.active.toString() == "true") {
            $overlayElem.addClass("rex-active-overlay");
        } else {
            $overlayElem.removeClass("rex-active-overlay");
        }
    }

    var _updateBlockOverlayColorLive = function (data) {
        var $elemOverlay = Rexbuilder_Util.$rexContainer.find("div [data-rexbuilder-block-id=\"" + data.blockRexID + "\"] .responsive-block-overlay");
        $elemOverlay.css('background-color', data.color);
        $elemOverlay = undefined;
    }

    var _updateBlockOverlay = function (data) {
        var rexID = data.blockRexID;
        var color = data.color;
        var active = data.active;

        var $elem = Rexbuilder_Util.$rexContainer.find("div [data-rexbuilder-block-id=\"" + rexID + "\"]");
        var $elemData = $elem.children(".rexbuilder-block-data")
        var $elemOverlay = $elem.find(".responsive-block-overlay");

        $elemOverlay.css("background-color", color);

        $elemData.attr("data-overlay_block_color", color);
        $elemData.attr("data-overlay_block_color_active", active);

        if (active.toString() == "true") {
            $elemOverlay.addClass("rex-active-overlay");
        } else {
            $elemOverlay.removeClass("rex-active-overlay");
        }
    }

    var _updateSectionBackgroundImage = function ($section, data) {
        _updateImageBG($section, data);
    }

    var _performAction = function (action, flag) {
        var dataToUse;

        if (flag) {
            dataToUse = action.performActionData;
            Rexbuilder_Util_Editor.undoActive = false;
            Rexbuilder_Util_Editor.redoActive = true;
        } else {
            dataToUse = action.reverseActionData;
            Rexbuilder_Util_Editor.redoActive = false;
            Rexbuilder_Util_Editor.undoActive = true;
        }

        var $section = Rexbuilder_Util.$rexContainer.children('.rexpansive_section[data-rexlive-section-id="' + action.sectionID + '"]')
        var $galleryElement = $section.find(".grid-stack-row");

        var galleryData = $galleryElement.data();
        if (galleryData !== undefined) {
            var galleryEditorInstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
        }

        switch (action.actionName) {
            case "updateSection":
                if (galleryEditorInstance !== undefined) {
                    Rexbuilder_Util_Editor.updatingGridstack = true;
                    galleryEditorInstance.batchGridstack();

                    _updateBlocksLayout(dataToUse.blocksDisposition);
                    _updateSectionMargins($section, dataToUse.marginsSection);
                    _updateGridDomProperties($galleryElement, dataToUse);
                    galleryEditorInstance.updateGridSettingsModalUndoRedo(dataToUse);
                    galleryEditorInstance.updateGridstackStyles(dataToUse.blocksDisposition.cellHeight);

                    galleryEditorInstance.commitGridstack();
                    Rexbuilder_Util_Editor.updatingGridstack = false;
                    galleryEditorInstance._updateElementsSizeViewers();
                }
                break;
            case "updateSectionBlocksDisposition":
                if (galleryEditorInstance !== undefined) {
                    _updateBlocksLayout(dataToUse);
                    galleryEditorInstance._updateElementsSizeViewers();
                }
                break;
            //Used to delete or recreate block
            case "updateBlockVisibility":
                if (galleryEditorInstance !== undefined) {
                    _updateRemovingBlock(dataToUse.targetElement, dataToUse.hasToBeRemoved, dataToUse.galleryInstance);
                }
                break;
            case "updateSlider":
                _updateSlider(dataToUse);
                break;
            case "updateSectionName":
                _updateSectionName($section, dataToUse.sectionName);
                break;
            case "updateSectionPhotoswipe":
                _updateSectionPhotoswipe(dataToUse.elements);
                break;
            case "collapseSection":
                _collapseGrid(dataToUse.gridInstance, dataToUse.collapse);
                break;
            case "updateCustomClasses":
                _updateCustomClasses(dataToUse.$target, dataToUse.classes);
                break;
            case "updateCustomCSS":
                _updateCustomCSS(dataToUse.css);
                break;
            case "updateSectionBackgroundColor":
                _updateSectionBackgroundColor($section, dataToUse);
                break;
            case "updateSectionOverlay":
                _updateSectionOverlay($section, dataToUse);
                break;
            case "updateSectionImageBG":
                _updateImageBG($section, dataToUse);
                break;
            case "updateSectionVideoBG":
                Rexbuilder_Util.updateVideos(dataToUse);
                break;
            case "updateBlockBackgroundColor":
                _updateBlockBackgroundColor(dataToUse);
                break;
            case "updateBlockOverlay":
                _updateBlockOverlay(dataToUse);
                break;
            case "updateBlockImageBG":
                Rexbuilder_Util_Editor.updatingImageBg = true;
                _updateImageBG(dataToUse.$itemContent, dataToUse.imageOpt);
                if (galleryEditorInstance !== undefined) {
                    if (galleryEditorInstance.settings.galleryLayout == "masonry") {
                        galleryEditorInstance.updateElementHeight(dataToUse.$itemContent.parents(".grid-stack-item"));
                    }
                }
                Rexbuilder_Util_Editor.updatingImageBg = false;
                break;
            case "updateBlockVideoBG":
                Rexbuilder_Util.updateVideos(dataToUse);
                break;
            default:
                break;
        }

        Rexbuilder_Util_Editor.undoActive = false;
        Rexbuilder_Util_Editor.redoActive = false;
    }

    var init = function () {
        this.lastSliderNumber = 0;
    }

    return {
        init: init,
        updateRow: _updateRow,
        updateSectionMargins: _updateSectionMargins,
        updateImageBG: _updateImageBG,
        performAction: _performAction,
        addYoutubeVideo: _addYoutubeVideo,
        removeYoutubeVideo: _removeYoutubeVideo,
        addVimeoVideo: _addVimeoVideo,
        removeVimeoVideo: _removeVimeoVideo,
        addMp4Video: _addMp4Video,
        removeMp4Video: _removeMp4Video,
        updateSlider: _updateSlider,
        updateSliderStack: _updateSliderStack,
        updateGridDomProperties: _updateGridDomProperties,
        updateSectionName: _updateSectionName,
        enablePhotoswipeAllBlocksSection: _enablePhotoswipeAllBlocksSection,
        updateCustomClasses: _updateCustomClasses,
        collapseGrid: _collapseGrid,
        updateCustomCSS: _updateCustomCSS,
        updateSectionVideoBackground: _updateSectionVideoBackground,
        updateSectionBackgroundImage: _updateSectionBackgroundImage,
        updateSectionBackgroundColor: _updateSectionBackgroundColor,
        updateSectionBackgroundColorLive: _updateSectionBackgroundColorLive,
        updateSectionOverlay: _updateSectionOverlay,
        updateSectionOverlayColorLive: _updateSectionOverlayColorLive,
        updateBlockBackgroundColor: _updateBlockBackgroundColor,
        updateBlockBackgroundColorLive: _updateBlockBackgroundColorLive,
        updateBlockOverlayColorLive: _updateBlockOverlayColorLive,
        updateBlockOverlay: _updateBlockOverlay,
    };
})(jQuery);