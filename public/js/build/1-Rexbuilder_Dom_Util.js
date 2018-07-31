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
        var
            gutter = typeof rowSettings.gutter === "undefined" ? 20 : parseInt(rowSettings.gutter),
            separatorTop = typeof rowSettings.row_separator_top === "undefined" ? gutter : parseInt(rowSettings.row_separator_top),
            separatorBottom = typeof rowSettings.row_separator_bottom === "undefined" ? gutter : parseInt(rowSettings.row_separator_bottom),
            separatorRight = typeof rowSettings.row_separator_right === "undefined" ? gutter : parseInt(rowSettings.row_separator_right),
            separatorLeft = typeof rowSettings.row_separator_left === "undefined" ? gutter : parseInt(rowSettings.row_separator_left),
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
            var galleryEditorIstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
            if (galleryEditorIstance !== undefined) {
                galleryEditorIstance.updateGridSettingsChangeLayout(rowSettings);
            }
        }

    }

    var _updateSectionMargins = function ($section, marginTop, marginBottom, marginRight, marginLeft) {
        var newMargins = "";
        newMargins += $.isEmptyObject(marginTop) ? 0 : marginTop;
        newMargins += "px ";
        newMargins += $.isEmptyObject(marginRight) ? 0 : marginRight;
        newMargins += "px ";
        newMargins += $.isEmptyObject(marginBottom) ? 0 : marginBottom;
        newMargins += "px ";
        newMargins += $.isEmptyObject(marginLeft) ? 0 : marginLeft;
        newMargins += "px";
        $section.css("margin", newMargins);
    }

    var _updateImageBG = function ($target, idImage, urlImage, w, h, type) {
        var $targetData = null;
        var targetType = "";
        if ($target.hasClass("rexpansive_section")) {
            $targetData = $target.children("section-data");
            targetType = "section";
            type = "";
        } else if ($target.hasClass("grid-item-content")) {
            $targetData = $target.parents(".grid-stack-item").children(".rexbuilder-block-data");
            targetType = "block";
        } else {
            $targetData = undefined;
            targetType = undefined;
            return;
        }
        if (idImage == "") {
            $targetData.attr('data-id_image_bg_' + targetType, "");
            $target.attr('data-background_image_width', "");
            $target.attr('data-background_image_height', "");

            $target.css("background-image", "");

            $target.removeClass("natural-image-background");
            $target.removeClass("full-image-background");
            $target.removeClass("small-width");

            $targetData.data("image_bg_" + targetType, "");
            $targetData.data("id_image_bg_" + targetType, "");
            $targetData.data("type_bg_" + targetType, "");
            $targetData.data("image_size", "");
        } else {
            if (idImage == parseInt($targetData.data("id_image_bg" + targetType))) {
                //same image
                return
            }
            $target.attr("style", "background-image: url('" + urlImage + "'); background-color: rgba(0, 0, 0, 0);");
            $target.attr('data-background_image_width', w);
            $target.attr('data-background_image_height', h);
            $targetData.attr('data-id_image_bg_' + targetType, idImage);
            $targetData.attr('data-type_bg_' + targetType, type);
            $targetData.attr('data-image_bg_' + targetType, urlImage);
            if (type == "natural") {
                $target.addClass("natural-image-background");
                $target.removeClass("full-image-background");
            } else {
                $target.addClass("full-image-background");
                $target.removeClass("natural-image-background");
            }
            $targetData.attr('data-image_size', type);
        }
    }

    var _removeYoutubeVideo = function ($target, targetType, removeFromDom) {
        if ($target.hasClass("youtube-player")) {
            if ($target.YTPGetPlayer() === undefined) {
                return;
            }
            removeFromDom = typeof removeFromDom == "undefined" ? true : removeFromDom;
            if (removeFromDom) {
                $target.YTPPlayerDestroy();
                $target.removeClass('youtube-player');
                if (targetType != "section") {
                    var $toggleAudio = $target.children(".rex-video-toggle-audio");
                    if ($toggleAudio.length != 0) {
                        $toggleAudio.remove();
                    }
                }
            } else {

                var videoID = $target.YTPGetVideoID();
                var $targetParent = $target.parent();
                var hadAudio = $target.children(".rex-video-toggle-audio").length != 0;
                $target.YTPPlayerDestroy();

                var wasSlide = $target.hasClass("rex-slider-video-wrapper");
                $target.remove();

                var newEl = document.createElement("div");
                var $newEl = $(newEl);

                if (hadAudio) {
                    $newEl.append(tmpl("tmpl-video-toggle-audio"));
                }

                if (wasSlide) {
                    $newEl.addClass("rex-slider-video-wrapper");
                }

                $newEl.addClass("youtube-player");
                $newEl.attr("data-property", "{videoURL: 'https://www.youtube.com/watch?v=" + videoID + "', containment: 'self',startAt: 0,mute: true,autoPlay: true,loop: true,opacity: 1,showControls: false,showYTLogo: false}");
                $newEl.prependTo($targetParent[0]);
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
            //console.log($videoWrap);
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
        if ($target.hasClass("youtube-player")) {
            if ($target.YTPGetPlayer() === undefined) {
                $target.YTPlayer();
                return;
            }
            var videoID = $target.YTPGetVideoID();
            var urlID = Rexbuilder_Util.getYoutubeID(urlYoutube);
            if (videoID != urlID) {
                $target.YTPChangeMovie({
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
            $target.addClass("youtube-player");
            $target.attr("data-property", "{videoURL: '" + urlYoutube + "', containment: 'self',startAt: 0,mute: true,autoPlay: true,loop: true,opacity: 1,showControls: false,showYTLogo: false}");
            $target.YTPlayer();
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

    var _updateRemovingBlock = function ($elem, hasToBeRemoved, galleryEditorIstance) {
        if (hasToBeRemoved) {
            galleryEditorIstance.removeBlock($elem);
        } else {
            galleryEditorIstance.reAddBlock($elem);
        }
    };

    var _performAction = function (action, flag) {

        console.log("performing action");
        console.log(action);
        var dataToUse;

        if (flag) {
            dataToUse = action.performActionData;
            Rexbuilder_Util_Editor.redoActive = true;
        } else {
            dataToUse = action.reverseActionData;
            Rexbuilder_Util_Editor.undoActive = true;
        }

        var $galleryElement = Rexbuilder_Util.$rexContainer.children('.rexpansive_section[data-rexlive-section-id="' + action.sectionID + '"]').find(".grid-stack-row");
        var galleryData = $galleryElement.data();
        if (galleryData !== undefined) {
            var galleryEditorIstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
        }

        switch (action.actionName) {
            case "updateSection":
                if (galleryEditorIstance !== undefined) {
                    Rexbuilder_Util_Editor.updatingGridstack = true;
                    galleryEditorIstance.batchGridstack();

                    _updateBlocksLayout(dataToUse.blocksDisposition);
                    galleryEditorIstance.updateGridSettingsModalUndoRedo(dataToUse);
                    galleryEditorIstance.updateGridstackStyles(dataToUse.blocksDisposition.cellHeight);

                    galleryEditorIstance.commitGridstack();
                    Rexbuilder_Util_Editor.updatingGridstack = false;
                    galleryEditorIstance._updateElementsSizeViewers();
                }
                break;
            case "updateSectionBlocksDisposition":
                if (galleryEditorIstance !== undefined) {
                    _updateBlocksLayout(dataToUse);
                    galleryEditorIstance._updateElementsSizeViewers();
                }
                break;
            //Used to delete or recreate block
            case "updateBlockVisibility":
                if (galleryEditorIstance !== undefined) {
                    _updateRemovingBlock(dataToUse.targetElement, dataToUse.hasToBeRemoved, dataToUse.galleryInstance);
                }
                break;
            case "updateSlider":
                _updateSlider(dataToUse);
                break;
            case "hideBlock":
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
        updateSliderStack: _updateSliderStack
    };
})(jQuery);