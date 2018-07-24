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
})(jQuery);