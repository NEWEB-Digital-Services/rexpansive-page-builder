var Background_Image_Modal = (function ($) {
    'use strict';

    var background_image_properties;
    var backgroundImageActive;

    var _updateImageModal = function (data) {
        background_image_properties.$image_url.val(data.idImage);
        if (data.idImage != "") {
            background_image_properties.$image_preview.css('backgroundImage', 'url(' + data.imageUrl + ')')
            background_image_properties.$image_preview.find("i").css("display", "none");
            background_image_properties.$image_url.attr("data-rex-image-bg-url", data.imageUrl);
            background_image_properties.$image_url.attr("data-rex-image-width", data.width);
            background_image_properties.$image_url.attr("data-rex-image-height", data.height);
        }
        backgroundImageActive = data.active.toString() == "true";
        if (backgroundImageActive) {
            background_image_properties.$image_active.prop('checked', true);
        } else {
            background_image_properties.$image_active.prop('checked', false);
        }
    }

    var _resetImageModal = function () {
        background_image_properties.$image_url.val("");
        background_image_properties.$image_preview.css('backgroundImage', "")
        background_image_properties.$image_preview.find("i").css("display", "block");
        background_image_properties.$image_url.attr("data-rex-image-bg-url", "");
        background_image_properties.$image_url.attr("data-rex-image-width", "");
        background_image_properties.$image_url.attr("data-rex-image-height", "");
        backgroundImageActive = true;
        background_image_properties.$image_active.prop('checked', true);
    }

    var _updateImageBackground = function () {
        var status = true === background_image_properties.$image_active.prop('checked');
        backgroundImageActive = status;
        var idImage = background_image_properties.$image_url.val();
        var urlImage = typeof background_image_properties.$image_url.attr("data-rex-image-bg-url") == "undefined" ? "" : background_image_properties.$image_url.attr("data-rex-image-bg-url");
        var width = typeof background_image_properties.$image_url.attr("data-rex-image-width") == "undefined" ? "" : background_image_properties.$image_url.attr("data-rex-image-width");
        var height = typeof background_image_properties.$image_url.attr("data-rex-image-height") == "undefined" ? "" : background_image_properties.$image_url.attr("data-rex-image-height");

        var data_image = {
            eventName: "rexlive:apply_background_image_section",
            data_to_send: {
                idImage: backgroundImageActive ? idImage : "",
                urlImage: backgroundImageActive ? urlImage : "",
                width: backgroundImageActive ? width : "",
                height: backgroundImageActive ? height : "",
                active: backgroundImageActive
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_image);
    }

    var _addDocumentListeners = function () {

        background_image_properties.$image_active_wrapper.click(function (e) {
            e.preventDefault();
            var status = true === background_image_properties.$image_active.prop('checked');
            if (status) {
                background_image_properties.$image_active.prop('checked', false);
            } else {
                background_image_properties.$image_active.prop('checked', true);
            }
            backgroundImageActive = status;
            _updateImageBackground();
        });

        background_image_properties.$image_upload_wrap.click(function (e) {
            Rexlive_MediaUploader.openEditImageMediaUploader(background_image_properties.$image_url, background_image_properties.$image_preview, background_image_properties.$image_url.val());
        });
    }

    var _init = function ($container) {

        background_image_properties = {
            $image_upload_wrap: $container.find('#bg-section-set-img-wrap'),
            $image_active: $container.find("#image-section-active"),
            $image_active_wrapper: $container.find(".bg-image-section-active-wrapper"),
            $image_preview: $container.find('#bg-section-img-preview'),
            $image_preview_icon: $container.find('#bg-section-img-preview i'),
            $image_url: $container.find('#background-section-url'),
            $image_id: $container.find('#background-section-up-img'),
        }

        backgroundImageActive = true;
        _addDocumentListeners();
    }

    return {
        init: _init,
        updateImageModal: _updateImageModal,
        resetImageModal: _resetImageModal,
        updateImageBackground: _updateImageBackground
    };

})(jQuery);