var Background_Section_Image_Modal = (function ($) {
    'use strict';

    var background_section_image_properties;
    var backgroundImageActive;
    var sectionTarget;

    var _updateImageModal = function (data) {
        sectionTarget = data.sectionTarget;
        background_section_image_properties.$image_url.val(data.idImage);
        if (data.idImage != "") {
            background_section_image_properties.$image_preview.css('backgroundImage', 'url(' + data.imageUrl + ')')
            background_section_image_properties.$image_preview.find("i").css("display", "none");
            background_section_image_properties.$image_url.attr("data-rex-image-bg-url", data.imageUrl);
            background_section_image_properties.$image_url.attr("data-rex-image-width", data.width);
            background_section_image_properties.$image_url.attr("data-rex-image-height", data.height);
        }
        backgroundImageActive = data.active.toString() == "true";
        if (backgroundImageActive) {
            background_section_image_properties.$image_active.prop('checked', true);
        } else {
            background_section_image_properties.$image_active.prop('checked', false);
        }
    }

    var _resetImageModal = function () {
        background_section_image_properties.$image_url.val("");
        background_section_image_properties.$image_preview.css('backgroundImage', "")
        background_section_image_properties.$image_preview.find("i").css("display", "block");
        background_section_image_properties.$image_url.attr("data-rex-image-bg-url", "");
        background_section_image_properties.$image_url.attr("data-rex-image-width", "");
        background_section_image_properties.$image_url.attr("data-rex-image-height", "");
        backgroundImageActive = true;
        background_section_image_properties.$image_active.prop('checked', true);
    }

    var _updateImageBackground = function () {
        var status = true === background_section_image_properties.$image_active.prop('checked');
        backgroundImageActive = status;
        var idImage = background_section_image_properties.$image_url.val();
        var urlImage = typeof background_section_image_properties.$image_url.attr("data-rex-image-bg-url") == "undefined" ? "" : background_section_image_properties.$image_url.attr("data-rex-image-bg-url");
        var width = typeof background_section_image_properties.$image_url.attr("data-rex-image-width") == "undefined" ? "" : background_section_image_properties.$image_url.attr("data-rex-image-width");
        var height = typeof background_section_image_properties.$image_url.attr("data-rex-image-height") == "undefined" ? "" : background_section_image_properties.$image_url.attr("data-rex-image-height");

        var data_image = {
            eventName: "rexlive:apply_background_image_section",
            data_to_send: {
                idImage: backgroundImageActive ? idImage : "",
                urlImage: backgroundImageActive ? urlImage : "",
                width: backgroundImageActive ? width : "",
                height: backgroundImageActive ? height : "",
                active: backgroundImageActive,
                sectionTarget: sectionTarget
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_image);
    }

    var _addDocumentListeners = function () {
        console.log(background_section_image_properties.$image_active_wrapper);
        background_section_image_properties.$image_active_wrapper.click(function (e) {
            e.preventDefault();
            var status = true === background_section_image_properties.$image_active.prop('checked');
            if (status) {
                background_section_image_properties.$image_active.prop('checked', false);
            } else {
                background_section_image_properties.$image_active.prop('checked', true);
            }
            backgroundImageActive = status;
            _updateImageBackground();
        });

        background_section_image_properties.$image_upload_wrap.click(function (e) {
            Rexlive_MediaUploader.openEditImageMediaUploader(background_section_image_properties.$image_url, background_section_image_properties.$image_preview, background_section_image_properties.$image_url.val());
        });
    }

    var _init = function ($container) {
        var $self = $container.find("#section-edit-image-bg");
        background_section_image_properties = {
            $image_upload_wrap: $self.find('#bg-section-set-img-wrap'),
            $image_active: $self.find("#image-section-active"),
            $image_active_wrapper: $self.find(".bg-image-section-active-wrapper"),
            $image_preview: $self.find('#bg-section-img-preview'),
            $image_preview_icon: $self.find('#bg-section-img-preview i'),
            $image_url: $self.find('#background-section-url'),
            $image_id: $self.find('#background-section-up-img'),
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