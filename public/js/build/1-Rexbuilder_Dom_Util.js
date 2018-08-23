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
        if (data.idImage == parseInt($sectionData.attr("data-id_image_bg_section"))) {
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
        console.log("updatiting imga block");
        $elemData.attr("data-id_image_bg_block", data.idImage);
        $elemData.attr("data-type_bg_block", data.typeBGimage);
        $elemData.attr("data-image_bg_block", data.urlImage);
        $elemData.attr("data-image_size", "full");
        $elemData.attr("data-photoswipe", data.photoswipe);
        $elemData.attr("data-image_bg_elem_active", data.active);

        if (data.typeBGimage == "full") {
            _addImageFullBgBlock($itemContent, data);
        } else if (data.typeBGimage == "natural") {
            _addImageNaturalBgBlock($itemContent, data);
        }

        $itemContent.attr('data-background_image_width', data.width);
        $itemContent.attr('data-background_image_height', data.height);
    }

    var _addImageNaturalBgBlock = function ($itemContent, data) {
        var $imageDiv = $itemContent.find(".rex-image-wrapper");
        var $overlayDiv = $itemContent.find(".responsive-block-overlay");
        if ($imageDiv.length == 0) {
            var el = document.createElement("div");
            $imageDiv = $(el);
            $imageDiv.addClass("rex-image-wrapper");
            $imageDiv.prependTo($overlayDiv[0]);
        } else if ($imageDiv.hasClass("full-image-background")) {
            $imageDiv.detach().prependTo($overlayDiv[0]);
            $imageDiv.removeClass("full-image-background");
        }

        $imageDiv.addClass("natural-image-background");
        $imageDiv.css("background-image", "url(" + data.urlImage + ")");
        var $elem = $itemContent.parents(".grid-stack-item");
        if ($elem.outerWidth() < data.width) {
            $imageDiv.addClass('small-width');
        } else {
            $imageDiv.removeClass('small-width');
        }
    }

    var _removeImageBlock = function ($itemContent) {
        var $imageDiv = $itemContent.find(".rex-image-wrapper");
        if ($imageDiv.length != 0) {
            $imageDiv.remove();
        }
    }

    var _addImageFullBgBlock = function ($itemContent, data) {
        var $imageDiv = $itemContent.find(".rex-image-wrapper");
        var $dragHandle = $itemContent.children(".rexlive-block-drag-handle");
        if ($imageDiv.length == 0) {
            var el = document.createElement("div");
            $imageDiv = $(el);
            $imageDiv.addClass("rex-image-wrapper");
            $imageDiv.insertAfter($dragHandle[0]);
        } else if ($imageDiv.hasClass("natural-image-background")) {
            $imageDiv.detach().insertAfter($dragHandle[0]);
            $imageDiv.removeClass("natural-image-background");
            $imageDiv.removeClass("small-width");
        }

        $imageDiv.addClass("full-image-background");
        $imageDiv.css("background-image", "url(" + data.urlImage + ")");
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
        _removeImageBlock($itemContent);
        $itemContent.attr('data-background_image_width', "");
        $itemContent.attr('data-background_image_height', "");
    }

    var _removeYoutubeVideo = function ($target, removeFromDom) {
        var $ytpWrapper = $target.children(".rex-youtube-wrap");
        var $toggleAudio = $target.children(".rex-video-toggle-audio");
        if ($ytpWrapper.length != 0) {
            removeFromDom = typeof removeFromDom == "undefined" ? true : removeFromDom;
            $target.removeClass("youtube-player");
            if (removeFromDom) {
                $ytpWrapper.YTPPlayerDestroy();
                $ytpWrapper.remove();
                if ($toggleAudio.length != 0) {
                    $toggleAudio.remove();
                }
            } else {
                var videoID = $ytpWrapper.YTPGetVideoID();
                $ytpWrapper.YTPPlayerDestroy();

                var wasSlide = $ytpWrapper.parents(".rex-slider-element").length != 0;
                var hadAudio = $toggleAudio.length != 0;

                if (wasSlide) {
                    hadAudio = $ytpWrapper.children(".rex-video-toggle-audio").length != 0;
                }

                $ytpWrapper.remove();

                tmpl.arg = "video";
                $target.prepend(tmpl("tmpl-video-youtube", { url: videoID, audio: false }));
                if (hadAudio && wasSlide) {
                    var $toggle = $(tmpl("tmpl-video-toggle-audio"));
                    $toggle.addClass("removing-toggle-audio");
                    $toggle.appendTo($target.children(".rex-youtube-wrap")[0]);
                }
            }
        }
    }

    var _removeVimeoVideo = function ($target, removeFromDom) {
        var $vimeoWrap = $target.children('.rex-video-vimeo-wrap');
        var $toggleAudio = $target.children(".rex-video-toggle-audio");
        if ($vimeoWrap.length != 0) {
            var iframeVimeo = $vimeoWrap.children("iframe")[0];
            removeFromDom = typeof removeFromDom == "undefined" ? true : removeFromDom;
            $target.removeClass("vimeo-player");
            if (removeFromDom) {
                VimeoVideo.removePlayer(iframeVimeo);
                $vimeoWrap.remove();
                if ($toggleAudio.length != 0) {
                    $toggleAudio.remove();
                }
            } else {
                VimeoVideo.findVideo(iframeVimeo).unload();
                if ($toggleAudio.length != 0) {
                    $toggleAudio.addClass("removing-toggle-audio");
                }
            }
        }
    }

    var _removeMp4Video = function ($target, removeFromDom) {
        var $videoWrap = $target.children(".rex-video-wrap");
        var $toggleAudio = $target.children(".rex-video-toggle-audio");
        if ($videoWrap.length != 0) {
            removeFromDom = typeof removeFromDom == "undefined" ? true : removeFromDom;
            var videoEl = $videoWrap.find("video")[0];
            videoEl.pause();
            videoEl.currentTime = 0;
            $target.removeClass("mp4-player");
            if (removeFromDom) {
                $videoWrap.remove();
                if ($toggleAudio.length != 0) {
                    $toggleAudio.remove();
                }
            } else {
                $videoWrap.addClass("removing-video-mp4");
                if ($toggleAudio.length != 0) {
                    $toggleAudio.addClass("removing-toggle-audio");
                }
            }
        }
    }

    var _addMp4Video = function ($target, mp4Data, hasAudio) {
        var $videoWrap = $target.children(".rex-video-wrap");
        var $toggleAudio = $target.children(".rex-video-toggle-audio");

        $target.addClass("mp4-player");

        if (($videoWrap.length != 0 && $videoWrap.find("source").attr("src") != mp4Data.linkMp4) || ($videoWrap.length == 0)) {
            _removeMp4Video($target, true);
            tmpl.arg = "video";
            $target.prepend(tmpl("tmpl-video-mp4", { url: mp4Data.linkMp4, width: mp4Data.width, height: mp4Data.height }));
        } else if ($videoWrap.length != 0) {
            $videoWrap.removeClass("removing-video-mp4");
            $videoWrap.find("video")[0].play();
        }

        if ($toggleAudio.length == 0) {
            if (hasAudio) {
                $target.append(tmpl("tmpl-video-toggle-audio"));
            }
        } else {
            if (hasAudio) {
                $toggleAudio.removeClass("removing-toggle-audio");
            } else {
                $toggleAudio.remove();
            }
        }
    }

    var _addYoutubeVideo = function ($target, urlYoutube, hasAudio) {
        var $ytpWrapper = $target.children(".rex-youtube-wrap");
        var $toggleAudio = $target.children(".rex-video-toggle-audio");
        $target.addClass("youtube-player");
        if ($ytpWrapper.length != 0) {
            var elemData = jQuery.extend(true, {}, eval('(' + $ytpWrapper.attr("data-property") + ')'));
            var activeUrl = elemData.videoURL;

            var videoID = Rexbuilder_Util.getYoutubeID(activeUrl);
            var urlID = Rexbuilder_Util.getYoutubeID(urlYoutube);

            if (videoID != urlID) {
                if ($ytpWrapper.YTPGetPlayer() === undefined) {
                    $ytpWrapper.attr("data-property", "{videoURL:'" + urlYoutube + "',containment:'self',startAt:0,mute:'true',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}");
                    $ytpWrapper.addClass("youtube-player-launching");
                    $ytpWrapper.YTPlayer();
                } else {
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
                if ($ytpWrapper.YTPGetPlayer() === undefined) {
                    $ytpWrapper.addClass("youtube-player-launching");
                    $ytpWrapper.YTPlayer();
                }
            }
        } else {
            tmpl.arg = "video";
            $target.prepend(tmpl("tmpl-video-youtube", { url: urlYoutube, audio: false }));
            $target.children(".rex-youtube-wrap").YTPlayer();
        }

        if ($toggleAudio.length == 0) {
            if (hasAudio) {
                $target.append(tmpl("tmpl-video-toggle-audio"));
            }
        } else {
            if (hasAudio) {
                $toggleAudio.removeClass("removing-toggle-audio");
            } else {
                $toggleAudio.remove();
            }
        }
    }

    var _addVimeoVideo = function ($target, urlVimeo, hasAudio) {
        var $vimeoWrap = $target.children(".rex-video-vimeo-wrap");
        var $toggleAudio = $target.children(".rex-video-toggle-audio");
        $target.addClass("vimeo-player");
        if (urlVimeo == "") {
            _removeVimeoVideo($target, true);
        } else {
            urlVimeo += "?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0&muted=1";
            if ($vimeoWrap.length != 0 && ($vimeoWrap.children("iframe").attr("src") != urlVimeo) || ($vimeoWrap.length == 0)) {
                _removeVimeoVideo($target, true);
                tmpl.arg = "video";
                $target.prepend(tmpl("tmpl-video-vimeo", { url: urlVimeo }));
                var vimeoFrame = $target.children(".rex-video-vimeo-wrap").find("iframe")[0];
                VimeoVideo.addPlayer("1", vimeoFrame);
            } else if ($vimeoWrap.length != 0) {
                var vimeoPlugin = VimeoVideo.findVideo($vimeoWrap.find("iframe")[0]);
                if (vimeoPlugin != null) {
                    vimeoPlugin.play();
                }
            }
        }
        if ($toggleAudio.length == 0) {
            if (hasAudio) {
                $target.append(tmpl("tmpl-video-toggle-audio"));
            }
        } else {
            if (hasAudio) {
                $toggleAudio.removeClass("removing-toggle-audio");
            } else {
                $toggleAudio.remove();
            }
        }
    }

    var _updateVideos = function ($target, videoOptions) {
        var targetType = "";
        if ($target.hasClass("rexpansive_section")) {
            var $sectionData = $target.children(".section-data");
            targetType = "section";
        } else if ($target.hasClass("grid-item-content")) {
            var $elemData = $target.parents(".grid-stack-item").children(".rexbuilder-block-data");
            targetType = "block";
        } else if ($target.hasClass("rex-slider-video-wrapper")) {
            targetType = "slide";
        } else {
            return;
        }

        var type = videoOptions.typeVideo;
        if (type == "") {
            _removeMp4Video($target, true);
            _removeYoutubeVideo($target, true);
            _removeVimeoVideo($target, true);
        } else if (type == "mp4") {
            _removeYoutubeVideo($target, true);
            _removeVimeoVideo($target, true);
            _addMp4Video($target, videoOptions.mp4Data, videoOptions.audio);
        } else if (type == "vimeo") {
            _removeYoutubeVideo($target, true);
            _removeMp4Video($target, true);
            _addVimeoVideo($target, videoOptions.vimeoUrl, videoOptions.audio);
        } else if (type == "youtube") {
            _removeVimeoVideo($target, true);
            _removeMp4Video($target, true);
            _addYoutubeVideo($target, videoOptions.youtubeUrl, videoOptions.audio);
        }

        if (targetType == "section") {
            $sectionData.attr("data-video_bg_id_section", videoOptions.mp4Data.idMp4);
            $sectionData.attr("data-video_mp4_url", videoOptions.mp4Data.linkMp4);
            $sectionData.attr("data-video_bg_url_section", videoOptions.youtubeUrl);
            $sectionData.attr("data-video_bg_url_vimeo_section", videoOptions.vimeoUrl);
        } else if (targetType == "block") {
            $elemData.attr("data-video_bg_id", videoOptions.mp4Data.idMp4);
            $elemData.attr("data-video_mp4_url", videoOptions.mp4Data.linkMp4);
            $elemData.attr("data-video_bg_url", videoOptions.youtubeUrl);
            $elemData.attr("data-video_bg_url_vimeo", videoOptions.vimeoUrl);
            $elemData.attr("data-video_has_audio", videoOptions.audio);
        } else if (targetType == "slide") {
            ;
        }
    }

    var _updateBlockPaddings = function ($elem, paddings) {
        var $elData = $elem.children(".rexbuilder-block-data");
        $elData.attr("data-block_padding", Rexbuilder_Util.paddingsToString(paddings));
        var $textWrap = $elem.find(".text-wrap");
        if ($textWrap.length != 0) {
            $textWrap.css("padding-top", "" + paddings.top + paddings.type);
            $textWrap.css("padding-right", "" + paddings.right + paddings.type);
            $textWrap.css("padding-bottom", "" + paddings.bottom + paddings.type);
            $textWrap.css("padding-left", "" + paddings.left + paddings.type);
        }
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

    var _collapseGrid = function (gridInstance, collapse, blockDisposition, layout) {
        Rexbuilder_Util_Editor.updatingCollapsedGrid = true;
        if (collapse) {
            gridInstance.collapseElementsProperties();
        } else {
            gridInstance.removeCollapseElementsProperties();
        }
        gridInstance.updateGridLayoutCollapse(layout);
        _updateBlocksLayout(blockDisposition);
        setTimeout(function () {
            Rexbuilder_Util_Editor.updatingCollapsedGrid = false;
            gridInstance._createFirstReverseStack();
            gridInstance._updateElementsSizeViewers();
        }, 500);
    }

    var _updateRemovingBlock = function ($elem, hasToBeRemoved, galleryEditorInstance) {
        if (hasToBeRemoved) {
            galleryEditorInstance.removeBlock($elem);
            Rexbuilder_Util.stopBlockVideos($elem);
        } else {
            galleryEditorInstance.reAddBlock($elem);
            Rexbuilder_Util.playBlockVideos($elem);
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

    var _fixSectionDomOrder = function (newOrder) {
        var sections = [];
        var $section;
        var i, j;
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function () {
            var sectionObj = {
                rexID: $(this).attr("data-rexlive-section-id"),
                $section: $(this).detach()
            }
            sections.push(sectionObj);
        });

        for (i = 0; i < newOrder.length; i++) {
            for (j = 0; j < sections.length; j++) {
                if (sections[j].rexID == newOrder[i]) {
                    $section = sections[j].$section;
                    break;
                }
            }
            Rexbuilder_Util.$rexContainer.append($section);
            sections.splice(j, 1);
        }

        for (j = 0; j < sections.length; j++) {
            Rexbuilder_Util.$rexContainer.append(sections[j].$section);
        }
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

    var _updateBlockUrl = function ($elem, url) {
        var $elemData = $elem.children(".rexbuilder-block-data");
        $elemData.attr("data-linkurl", url);
    }

    var _updateFlexPostition = function ($elem, flexPosition) {
        if (!$elem.hasClass("block-has-slider")) {
            var flexClasses = "rex-flex-top rex-flex-middle rex-flex-bottom rex-flex-left rex-flex-center rex-flex-right";
            $elem.removeClass(flexClasses);
            var $elemData = $elem.children(".rexbuilder-block-data");
            $elemData.attr("data-block_flex_position", "");
            if (flexPosition.x != "" && flexPosition.y != "") {
                $elem.addClass("rex-flex-" + flexPosition.x);
                $elem.addClass("rex-flex-" + flexPosition.y);
                $elemData.attr("data-block_flex_position", flexPosition.x + " " + flexPosition.y);
            }
        }
    }

    var _updateCustomCSS = function (newCss) {
        $("#rexpansive-builder-style-inline-css").text(newCss);
    }

    var _updateSectionVideoBackground = function ($section, videoOpt) {
        _updateVideos($section, videoOpt);
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

    var _updateSectionVisibility = function ($section, show) {
        if (show) {
            $section.removeClass("removing_section");
            Rexbuilder_Util.playPluginsSection($section);
        } else {
            Rexbuilder_Util.stopPluginsSection($section);
            $section.addClass("removing_section");
        }
    }

    var _performAction = function (action, flag) {
        console.log("performing " + action.actionName);
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
                _collapseGrid(dataToUse.gridInstance, dataToUse.collapse, dataToUse.blockDisposition, dataToUse.gridLayout);
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
                Rexbuilder_Dom_Util.updateVideos($section, dataToUse);
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
            case "updateBlockPadding":
                Rexbuilder_Util_Editor.updatingPaddingBlock = true;
                _updateBlockPaddings(dataToUse.$elem, dataToUse.dataPadding);
                if (galleryEditorInstance !== undefined) {
                    if (galleryEditorInstance.settings.galleryLayout == "masonry") {
                        galleryEditorInstance.updateElementHeight(dataToUse.$elem);
                    }
                }
                Rexbuilder_Util_Editor.updatingPaddingBlock = false;
                break;
            case "updateBlockVideoBG":
                Rexbuilder_Dom_Util.updateVideos(dataToUse.$itemContent, dataToUse.videoOpt);
                break;
            case "updateBlockFlexPosition":
                _updateFlexPostition(dataToUse.$elem, dataToUse.dataPosition);
                break;
            case "updateBlockUrl":
                _updateBlockUrl(dataToUse.$elem, dataToUse.url);
                break;
            case "updateSectionVisibility":
                _updateSectionVisibility($section, dataToUse.show);
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
        updateVideos: _updateVideos,
        updateBlockPaddings: _updateBlockPaddings,
        updateFlexPostition: _updateFlexPostition,
        updateBlockUrl: _updateBlockUrl,
        updateSectionVisibility: _updateSectionVisibility,
        fixSectionDomOrder: _fixSectionDomOrder
    };
})(jQuery);