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

            Rexbuilder_Dom_Util.updateImageBG($el.find(".grid-item-content"), idImage, urlImage, w, h, type);

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
        var $section = Rexbuilder_Util_Editor.sectionAddingElementObj,
            galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var data = e.settings.data_to_send;
        var audio = typeof data.audio == "undefined" ? "" : data.audio;
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

        Rexbuilder_Util_Editor.sectionAddingElementRexID = null;
        Rexbuilder_Util_Editor.sectionAddingElementObj = null;
    });

    $(document).on("rexlive:insert_new_slider", function (e) {
        var $section = Rexbuilder_Util_Editor.sectionAddingElementObj,
            galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var data = e.settings.data_to_send;

        console.log(data);

        var $el = _createBlockGrid(galleryInstance, 12, 4);
        var $textWrap = $el.find(".text-wrap");

        $el.addClass("block-has-slider");
        $el.children(".rexbuilder-block-data").attr("data-type", "rexslider");
        $textWrap.children().remove();

        _createSliderWrap($textWrap, data.slider_id, data.slider_settings);

        var $sliderWrap = $textWrap.children(".rex-slider-wrap");

        var slides = data.slider_slides;

        for (var i = 0; i < slides.length; i++) {
            tmpl.arg = "slide";

            var $slide = $(tmpl("tmpl-new-slider-element", {}));

            if (slides[i].slide_image_url != "none") {
                $slide.css("background-image", "url('" + slides[i].slide_image_url + "')");
            }

            if (slides[i].slide_text.trim().length != 0) {
                $slide.children(".rex-slider-element-title").text(slides[i].slide_text);
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
                        break;

                    case "vimeo":
                        $videoElement.prepend(tmpl("tmpl-video-vimeo", {
                            url: slides[i].slide_video
                        }));
                        $videoElement.addClass("vimeo-player");

                        var vimeoFrame = $videoElement.children(".rex-video-vimeo-wrap").find("iframe")[0];
                        VimeoVideo.addPlayer("1", vimeoFrame);
                        break;
                    case "youtube":
                        console.log("youtybrr");
                        break;
                    default:
                        break;
                }

                if (slides[i].slide_video_audio.toString() == "true") {
                    $videoElement.append(tmpl("tmpl-video-toggle-audio"));
                }
            }
        }

        Rexbuilder_Util_Editor.sectionAddingElementRexID = null;
        Rexbuilder_Util_Editor.sectionAddingElementObj = null;
    });

    var _createSliderWrap = function ($textWrap, slider_id, settings) {
        tmpl.arg = "slider";

        var $sliderWrap = $(tmpl("tmpl-new-slider-wrap", {
            id: slider_id,
            animation: settings.auto_start ? 1 : 0,
            dots: settings.dots ? 1 : 0,
            prevnext: settings.prev_next ? 1 : 0
        }));

        $textWrap.append($sliderWrap[0]);
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
})(jQuery);