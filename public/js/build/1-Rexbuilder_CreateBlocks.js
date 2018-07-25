var Rexbuilder_CreateBlocks = (function ($) {
    'use strict';

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
            var $el = _createBlockVideoGrid(galleryInstance);
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
        } else {
            for (var i = 0; i < videoMp4.length; i++) {
                var $el = _createBlockVideoGrid(galleryInstance);
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
            }
        }

        Rexbuilder_Util_Editor.sectionAddingElementRexID = null;
        Rexbuilder_Util_Editor.sectionAddingElementObj = null;
    });

    var _createBlockVideoGrid = function (galleryInstance) {
        var $el;
        var singleWidth = galleryInstance.properties.singleWidth,
            blockW = 3,
            blockH = 3;
        if (galleryInstance.settings.galleryLayout == "fixed") {
            $el = galleryInstance.createNewBlock("fixed", blockW, blockH);
        } else {
            blockH = Math.max(Math.round(blockH * singleWidth / galleryInstance.settings.cellHeightMasonry), 1);
            $el = galleryInstance.createNewBlock("masonry", blockW, blockH);
        }
        return $el;
    }
})(jQuery);