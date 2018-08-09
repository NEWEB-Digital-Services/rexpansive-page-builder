var Rexbuilder_CreateBlocks = (function ($) {
    'use strict';

    $(document).on("click", ".add-new-block-empty", function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var $section = $(e.target).parents(".rexpansive_section");
        var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var $el = galleryInstance.createNewBlock(galleryInstance.settings.galleryLayout);

        galleryInstance.addTextEditor($el);
        galleryInstance.addScrollbar($el);
    });

    $(document).on("click", ".add-new-block-text", function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var $section = $(e.target).parents(".rexpansive_section");
        var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var $el = galleryInstance.createNewBlock(galleryInstance.settings.galleryLayout);

        galleryInstance.addTextEditor($el);
        galleryInstance.addScrollbar($el);

        var event = jQuery.Event("mouseup");
        event.target = $el.find(".rexlive-block-drag-handle");
        event.offsetY = 0;
        $el.trigger(event);
    });

    $(document).on("rexlive:insert_image", function (e) {
        var data = e.settings.data_to_send;

        var $section = Rexbuilder_Util_Editor.sectionAddingElementObj;
        var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var i;

        var media = data.media;

        var gridWidth = galleryInstance.properties.wrapWidth;
        var singleWidth = galleryInstance.properties.singleWidth;
        var masonryHeight = galleryInstance.settings.cellHeightMasonry;

        for (i = 0; i < media.length; i++) {
            var $el,
                idImage = media[i].media_info.id,
                urlImage = media[i].display_info.src,
                w = media[i].display_info.width,
                h = media[i].display_info.height,
                type = "",
                blockW = 1,
                blockH = 1;

            if (w > gridWidth) {
                blockW = 6;
            } else {
                blockW = Math.max(Math.round(w * 6 / gridWidth), 1);
            }
            blockH = Math.max(Math.round(h * blockW / w), 1);

            if (galleryInstance.settings.galleryLayout == "fixed") {
                $el = galleryInstance.createNewBlock("fixed", blockW, blockH);
                type = "full";
            } else {
                var gutter = galleryInstance.properties.gutter;
                if (blockW * singleWidth < w) {
                    blockH = ((h * blockW * singleWidth) / w);
                } else {
                    blockH = h + gutter;
                }
                blockH = Math.max(Math.round(blockH / masonryHeight), 1);
                $el = galleryInstance.createNewBlock("masonry", blockW, blockH);
                type = "natural";
            }

            var dataImage = {
                idImage: idImage,
                urlImage: urlImage,
                width: w,
                height: h,
                type: type
            }

            Rexbuilder_Dom_Util.updateImageBG($el.find(".grid-item-content"), dataImage);

            if (galleryInstance.settings.galleryLayout == "masonry") {
                galleryInstance._fixImageSize($el);
            }

            galleryInstance.addScrollbar($el);
            galleryInstance.addTextEditor($el);
        }

        Rexbuilder_Util_Editor.sectionAddingElementRexID = null;
        Rexbuilder_Util_Editor.sectionAddingElementObj = null;
    });

    $(document).on("rexlive:insert_video", function (e) {
        var data = e.settings.data_to_send;
        if (!(typeof data.typeVideo == "undefined")) {
            var $section = Rexbuilder_Util_Editor.sectionAddingElementObj,
                galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
            var audio = typeof data.hasAudio == "undefined" ? "" : data.hasAudio;
            var urlYoutube = typeof data.urlYoutube == "undefined" ? "" : data.urlYoutube;
            var urlVimeo = typeof data.urlVimeo == "undefined" ? "" : data.urlVimeo;
            var videoMp4 = typeof data.videoMp4 == "undefined" ? "" : data.videoMp4;
            if (videoMp4.length == 0) {
                var $el = _createBlockGrid(galleryInstance, 3, 3);
                var $itemContent = $el.find(".grid-item-content");
                var $itemData = $el.children(".rexbuilder-block-data");
                var videoOptions = {
                    targetData: $itemData,
                    target: $itemContent,
                    idMp4: "",
                    urlMp4: "",
                    urlVimeo: urlVimeo,
                    urlYoutube: urlYoutube,
                    targetType: "block",
                    hasAudio: audio
                }
                Rexbuilder_Util.updateVideos(videoOptions);
                galleryInstance.addScrollbar($el);
                galleryInstance.addTextEditor($el);
            } else {
                for (var i = 0; i < videoMp4.length; i++) {
                    var $el = _createBlockGrid(galleryInstance, 3, 3);
                    var $itemContent = $el.find(".grid-item-content");
                    var $itemData = $el.children(".rexbuilder-block-data");
                    var videoMp4Url = videoMp4[i].videoUrl;
                    var videoMp4ID = videoMp4[i].videoID;
                    var videoOptions = {
                        targetData: $itemData,
                        target: $itemContent,
                        idMp4: videoMp4ID,
                        urlMp4: videoMp4Url,
                        urlVimeo: "",
                        urlYoutube: "",
                        targetType: "block",
                        hasAudio: audio
                    }
                    Rexbuilder_Util.updateVideos(videoOptions);
                    galleryInstance.addScrollbar($el);
                    galleryInstance.addTextEditor($el);
                }
            }
        }

        Rexbuilder_Util_Editor.sectionAddingElementRexID = null;
        Rexbuilder_Util_Editor.sectionAddingElementObj = null;
    });

    $(document).on("rexlive:insert_new_slider", function (e) {
        _createSlider(e.settings.data_to_send);
    });

    var _createSlider = function (data, $elem) {
        Rexbuilder_Dom_Util.lastSliderNumber = Rexbuilder_Dom_Util.lastSliderNumber + 1;
        var sliderNumber = Rexbuilder_Dom_Util.lastSliderNumber;
        var slides = data.slides;

        var sliderData = {
            id: data.id,
            settings: data.settings,
            numberSlides: slides.length
        }

        var $el;
        var $textWrap;
        if (typeof $elem == "undefined") {
            var $section = Rexbuilder_Util_Editor.sectionAddingElementObj;
            var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
            // 
            $el = _createBlockGrid(galleryInstance, 12, 4);
            $textWrap = $el.find(".text-wrap");
            $textWrap.children().remove();
        } else {
            $el = $elem;
            $textWrap = $el.find(".text-wrap");
        }

        $el.addClass("block-has-slider");
        $el.children(".rexbuilder-block-data").attr("data-type", "rexslider");

        var $sliderWrap = _createSliderWrap($textWrap, sliderData);

        for (var i = 0; i < slides.length; i++) {
            tmpl.arg = "slide";

            var $slide = $(tmpl("tmpl-new-slider-element", {}));

            if (slides[i].slide_image_url != "none") {
                $slide.css("background-image", "url(" + slides[i].slide_image_url + ")");
                $slide.attr("data-rex-slide-image-id", slides[i].slide_image_id);
            }

            if (slides[i].slide_text.trim().length != 0) {
                $slide.children(".rex-slider-element-title").html(slides[i].slide_text);
            }

            $slide.appendTo($sliderWrap[0]);
            //url over slide text
            if (slides[i].slide_url != "") {
                tmpl.arg = "link";

                var $linkEl = $(tmpl("tmpl-new-slider-element-link", {
                    url: slides[i].slide_url
                }));

                $slide.children(".rex-slider-element-title").detach().appendTo($linkEl[0]);
                $slide.append($linkEl[0]);
            }

            if (slides[i].slide_video_type != "") {

                tmpl.arg = "video";
                var $videoElement = $slide.children(".rex-slider-video-wrapper");

                switch (slides[i].slide_video_type) {
                    case "mp4":
                        $videoElement.prepend(tmpl("tmpl-video-mp4", {
                            url: slides[i].slide_videoMp4Url
                        }));
                        $videoElement.addClass("mp4-player");
                        $videoElement.children(".rex-video-wrap").attr("data-rex-video-mp4-id", slides[i].slide_video);
                        break;

                    case "vimeo":
                        $videoElement.prepend(tmpl("tmpl-video-vimeo", {
                            url: slides[i].slide_video
                        }));
                        $videoElement.addClass("vimeo-player");
                        break;
                    case "youtube":
                        var div = document.createElement("div");
                        var $div = $(div);
                        $videoElement.addClass("rex-ytp-wrapper");
                        $div.prependTo($videoElement[0]);
                        $div.addClass("rexpansive-ytp youtube-player");
                        $div.attr("data-property", "{videoURL: '" + slides[i].slide_video + "', containment: 'self',startAt: 0,mute: true,autoPlay: true,loop: true,opacity: 1,showControls: false,showYTLogo: false}");

                        break;
                    default:
                        break;
                }

                if (slides[i].slide_video_audio.toString() == "true") {
                    $videoElement.append(tmpl("tmpl-video-toggle-audio"));
                }
            }
        }

        $sliderWrap.attr("data-rex-slider-number", sliderNumber);

        RexSlider.initSlider($sliderWrap);

        Rexbuilder_Util_Editor.sectionAddingElementRexID = null;
        Rexbuilder_Util_Editor.sectionAddingElementObj = null;
    }

    var _createSliderWrap = function ($textWrap, data) {
        tmpl.arg = "slider";
        var $sliderWrap = $(tmpl("tmpl-new-slider-wrap", {
            id: data.id,
            animation: data.settings.auto_start ? true : 0,
            dots: data.settings.dots ? 1 : 0,
            prevnext: data.settings.prev_next ? 1 : 0,
            numberSlides: data.numberSlides
        }));

        $textWrap.append($sliderWrap[0]);
        return $sliderWrap;
    }

    var _createBlockGrid = function (galleryInstance, w, h) {
        var $el;
        var singleWidth = galleryInstance.properties.singleWidth,
            blockW = w,
            blockH = h;
        if (galleryInstance.settings.galleryLayout == "fixed") {
            $el = galleryInstance.createNewBlock("fixed", blockW, blockH);
        } else {
            blockH = Math.max(Math.round(blockH * singleWidth / galleryInstance.settings.cellHeightMasonry), 1);
            $el = galleryInstance.createNewBlock("masonry", blockW, blockH);
        }
        return $el;
    }

    var _createCopyBlock = function ($elem) {
        var $gallery = $elem.parents('.grid-stack-row');
        Rexbuilder_Util_Editor.sectionAddingElementObj = $gallery.parents(".rexpansive_section");
        var galleryEditorIstance = $gallery.data().plugin_perfectGridGalleryEditor;
        var gridstack = $gallery.data("gridstack");
        var $newBlock;

        $newBlock = $elem.clone(false);
        var $newBlockData = $newBlock.children(".rexbuilder-block-data");

        galleryEditorIstance._removeHandles($newBlock);

        var newRexID = Rexbuilder_Util.createBlockID();

        galleryEditorIstance.properties.lastIDBlock = galleryEditorIstance.properties.lastIDBlock + 1;

        var newBlockID = "block_" + galleryEditorIstance.properties.sectionNumber + "_" + galleryEditorIstance.properties.lastIDBlock;

        $newBlock.attr("data-rexbuilder-block-id", newRexID);
        $newBlockData.attr("data-rexbuilder_block_id", newRexID);
        $newBlock.attr("id", newBlockID);
        $newBlockData.attr("data-id", newBlockID);
        $newBlockData.attr("id", newBlockID + "-builder-data");

        $newBlock.appendTo($gallery.eq(0));

        var w = parseInt($newBlock.attr("data-gs-width"));
        var h = parseInt($newBlock.attr("data-gs-height"));

        Rexbuilder_Util_Editor.removeScrollBar($newBlock);
        Rexbuilder_Util_Editor.removeTextEditor($newBlock);

        galleryEditorIstance._prepareElement($newBlock.eq(0));

        galleryEditorIstance.unFocusElementEditing($newBlock);

        gridstack.addWidget($newBlock, 0, 0, w, h, true);

        $newBlock.attr("data-gs-auto-position", "");

        var $textWrap = $newBlock.find(".text-wrap");

        if ($elem.hasClass("block-has-slider")) {
            var $oldSlider = $elem.find(".text-wrap").children(".rex-slider-wrap[data-rex-slider-active=\"true\"]");
            $textWrap.children().remove();
            var sliderData = Rexbuilder_Util_Editor.createSliderData($oldSlider);
            Rexbuilder_Util_Editor.blockCopyingObj = $newBlock;
            Rexbuilder_Util_Editor.saveSliderOnDB(sliderData, true, newBlockID);
        } else {
            galleryEditorIstance.addScrollbar($newBlock);
            galleryEditorIstance.addTextEditor($newBlock);
        }
    }
    $(document).on("rexlive:newSliderSavedOnDB", function (e) {
        if (Rexbuilder_Util_Editor.blockCopyingObj !== null) {
            _createSlider(e.settings.data_to_send, Rexbuilder_Util_Editor.blockCopyingObj);
        }
        Rexbuilder_Util_Editor.blockCopyingObj = null;
    });

    return {
        createSlider: _createSlider,
        createCopyBlock: _createCopyBlock
    };

})(jQuery);