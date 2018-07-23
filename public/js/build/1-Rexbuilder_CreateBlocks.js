var Rexbuilder_CreateBlocks = (function ($) {
    'use strict';

    $(document).on("rexlive:insert_image", function (e) {
        var data = e.settings.data_to_send;
/*         console.log(data);
        console.log(data.info); */
        var sectionRexId = data.info;
        var $section = Rexbuilder_Util.$rexContainer.children('section[data-rexlive-section-id="' + sectionRexId + '"]');
        var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var i;

        var media = data.media;
        for (i = 0; i < media.length; i++) {
            var $el,
                idImage = media[i].media_info.id,
                urlImage = media[i].display_info.src,
                w = media[i].display_info.width,
                h = media[i].display_info.height,
                type = "";

            if (galleryInstance.settings.galleryLayout == "fixed") {
                $el = galleryInstance.addNewBlockFixed();
                type = "full";
            } else {
                $el = galleryInstance.addNewBlockMasonry(w, h);
                type = "natural";
            }
            Rexbuilder_Dom_Util.updateImageBG($el.find(".grid-item-content"), idImage, urlImage, w, h, type);
        }
    });
})(jQuery);