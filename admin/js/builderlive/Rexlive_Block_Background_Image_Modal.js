var Background_Block_Image_Modal = (function($) {
  "use strict";

  var background_block_image_properties;
  var backgroundImageActive;
  var target;

  var _updateImageModal = function(data) {
    _resetImageModal();
    target = data.target;
    background_block_image_properties.$image_url.val(data.idImage);
    if (data.idImage != "") {
      background_block_image_properties.$image_preview.css(
        "backgroundImage",
        "url(" + data.imageUrl + ")"
      );
      background_block_image_properties.$image_preview
        .children()
        .css("display", "none");
      background_block_image_properties.$image_url.attr(
        "data-rex-image-bg-url",
        data.imageUrl
      );
      background_block_image_properties.$image_url.attr(
        "data-rex-image-width",
        data.width
      );
      background_block_image_properties.$image_url.attr(
        "data-rex-image-height",
        data.height
      );
    }

    _focusImageType(
      data.typeBGimage == "" ? data.defaultTypeImage : data.typeBGimage
    );
    _updatePhotoswipe(data.photoswipe);

    backgroundImageActive = data.active.toString() == "true";
    if (backgroundImageActive) {
      background_block_image_properties.$image_active.prop("checked", true);
    } else {
      background_block_image_properties.$image_active.prop("checked", false);
    }
  };

  var _resetImageModal = function() {
    background_block_image_properties.$image_url.val("");
    background_block_image_properties.$image_preview.css("backgroundImage", "");
    background_block_image_properties.$image_preview
      .children()
      .css("display", "block");
    background_block_image_properties.$image_url.attr(
      "data-rex-image-bg-url",
      ""
    );
    background_block_image_properties.$image_url.attr(
      "data-rex-image-width",
      ""
    );
    background_block_image_properties.$image_url.attr(
      "data-rex-image-height",
      ""
    );
    backgroundImageActive = true;
    background_block_image_properties.$image_active.prop("checked", true);
    background_block_image_properties.$checkboxPhotoswipe.prop(
      "checked",
      false
    );
    background_block_image_properties.$image_type_typeWrap.removeClass(
      "selected"
    );
  };

  var _updateImageBackground = function() {
    var status =
      true === background_block_image_properties.$image_active.prop("checked");
    backgroundImageActive = status;
    var idImage = background_block_image_properties.$image_url.val();
    var urlImage =
      typeof background_block_image_properties.$image_url.attr(
        "data-rex-image-bg-url"
      ) == "undefined"
        ? ""
        : background_block_image_properties.$image_url.attr(
            "data-rex-image-bg-url"
          );
    var width =
      typeof background_block_image_properties.$image_url.attr(
        "data-rex-image-width"
      ) == "undefined"
        ? ""
        : background_block_image_properties.$image_url.attr(
            "data-rex-image-width"
          );
    var height =
      typeof background_block_image_properties.$image_url.attr(
        "data-rex-image-height"
      ) == "undefined"
        ? ""
        : background_block_image_properties.$image_url.attr(
            "data-rex-image-height"
          );

    var $wrapImageType =
      background_block_image_properties.$image_type_types_wrap;
    var typeBGimage = $wrapImageType
      .children(".selected")
      .attr("data-rex-type-image");
    var photoswipe =
      true ===
      background_block_image_properties.$checkboxPhotoswipe.prop("checked")
        ? "true"
        : "false";

    var data_image = {
      eventName: "rexlive:apply_background_image_block",
      data_to_send: {
        idImage: backgroundImageActive ? idImage : "",
        urlImage: backgroundImageActive ? urlImage : "",
        width: backgroundImageActive ? width : "",
        height: backgroundImageActive ? height : "",
        typeBGimage: backgroundImageActive ? typeBGimage : "",
        // photoswipe: backgroundImageActive ? photoswipe : "",
        photoswipe: photoswipe,
        active: backgroundImageActive,
        target: target
      }
    }; 

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_image);
  };

  var _updatePhotoswipe = function(active) {
    background_block_image_properties.$checkboxPhotoswipe.prop(
      "checked",
      active.toString() == "true"
    );
  };

  var _focusImageType = function(imageType) {
    var $imageTypeWrap = background_block_image_properties.$image_type_types_wrap.children(
      '[data-rex-type-image="' + imageType + '"]'
    );
    $imageTypeWrap.addClass("selected");
    $imageTypeWrap.find("input").attr("checked", true);
  };

  var _clearImageTypeSelection = function() {
    background_block_image_properties.$image_type_typeWrap.each(function(
      i,
      el
    ) {
      $(el).removeClass("selected");
      $(el)
        .find("input")
        .attr("checked", false);
    });
  };

  var _addDocumentListeners = function() {
    background_block_image_properties.$image_active_wrapper.click(function(e) {
      e.preventDefault();
      var status =
        true ===
        background_block_image_properties.$image_active.prop("checked");
      if (status) {
        background_block_image_properties.$image_active.prop("checked", false);
      } else {
        background_block_image_properties.$image_active.prop("checked", true);
      }
      backgroundImageActive = status;
      _updateImageBackground();
    });

    background_block_image_properties.$image_upload_wrap.click(function(e) {
      Rexlive_MediaUploader.openEditImageMediaUploader(
        background_block_image_properties.$image_url,
        background_block_image_properties.$image_preview,
        background_block_image_properties.$image_url.val()
      );
    });

    background_block_image_properties.$image_type_typeWrap.click(function(e) {
      e.preventDefault();
      var $imageTypeWrap = $(e.target).parents(
        ".rex-background-image-type-wrap"
      );
      if (!$imageTypeWrap.hasClass("selected")) {
        _clearImageTypeSelection();
        $imageTypeWrap.addClass("selected");
        $imageTypeWrap.find("input").attr("checked", true);
        _updateImageBackground();
      }
    });

    background_block_image_properties.$is_photoswipe.click(function(e) {
      e.preventDefault();
      var status =
        true ===
        background_block_image_properties.$checkboxPhotoswipe.prop("checked");
      if (status) {
        background_block_image_properties.$checkboxPhotoswipe.prop(
          "checked",
          false
        );
      } else {
        background_block_image_properties.$checkboxPhotoswipe.prop(
          "checked",
          true
        );
      }
      _updateImageBackground();
    });
  };

  var _init = function($container) {
    var $self = $container.find(".background_set_image");

    background_block_image_properties = {
      // Choose image
      $image_upload_wrap: $self.find("#bg-block-set-img-wrap"),
      $image_active: $self.find("#image-block-active"),
      $image_active_wrapper: $self.find(".bg-image-block-active-wrapper"),
      $image_preview: $self.find("#bg-block-img-preview"),
      $image_preview_icon: $self.find("#bg-block-img-preview i"),
      $image_url: $self.find("#background-block-url"),
      $image_id: $self.find("#background-block-up-img"),

      // Natural or Full
      $image_type_typeWrap: $self.find(".rex-background-image-type-wrap"),
      $image_type_types_wrap: $self.find("#bg-set-img-type"),

      // Photoswipe
      $is_photoswipe: $self.find("#bg-set-photoswipe"),
      $checkboxPhotoswipe: $self.find("#background_photoswipe")
    };

    backgroundImageActive = true;
    _addDocumentListeners();
  };

  return {
    init: _init,
    updateImageModal: _updateImageModal,
    resetImageModal: _resetImageModal,
    updateImageBackground: _updateImageBackground
  };
})(jQuery);
