/**
 * Object that handles all the live events triggered on a block
 * To edit a selected block
 * @since 2.0.0
 */
var Rexbuilder_Block_Editor = (function($) {
  "use strict";

  /**
   * Attaching events for block editing buttons
   * @since 2.0.0
   */
  var _attachEvents = function() {
    /**
     * Edit a block background image
     * @since 2.0.0
     */
    $(document).on('click', '.edit-block-image', function(e) {
      var $elem = $(e.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $itemContent = $elem.find(".grid-item-content");

      var idImage =
        typeof $elemData.attr("data-id_image_bg_block") == "undefined"
          ? ""
          : $elemData.attr("data-id_image_bg_block");
      var imageUrl =
        typeof $elemData.attr("data-image_bg_block") == "undefined"
          ? ""
          : $elemData.attr("data-image_bg_block");
      var width =
        typeof $itemContent.attr("data-background_image_width") == "undefined"
          ? ""
          : $itemContent.attr("data-background_image_width");
      var height =
        typeof $itemContent.attr("data-background_image_height") == "undefined"
          ? ""
          : $itemContent.attr("data-background_image_height");
      var activeImage =
        typeof $elemData.attr("data-image_bg_elem_active") != "undefined"
          ? $elemData.attr("data-image_bg_elem_active")
          : true;
      var defaultTypeImage =
        $elem.parents(".grid-stack-row").attr("data-layout") == "fixed"
          ? "full"
          : "natural";
      var typeBGimage =
        ( typeof $elemData.attr("data-type_bg_block") == "undefined" || "" == $elemData.attr("data-type_bg_block") )
          ? defaultTypeImage
          : $elemData.attr("data-type_bg_block");
      var activePhotoswipe =
        typeof $elemData.attr("data-photoswipe") == "undefined"
          ? ""
          : $elemData.attr("data-photoswipe");

      var activeImage = true;

      var data = {
        eventName: "rexlive:openLiveImageUploader",
        live_uploader_data: {
          idImage: activeImage ? idImage : "",
          urlImage: activeImage ? imageUrl : "",
          width: activeImage ? width : "",
          height: activeImage ? height : "",
          typeBGimage: activeImage ? typeBGimage : "",
          photoswipe: activeImage ? activePhotoswipe : "",
          active: activeImage,
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          returnEventName: "rexlive:apply_background_image_block",
          data_to_send: {
            idImage: activeImage ? idImage : "",
            urlImage: activeImage ? imageUrl : "",
            width: activeImage ? width : "",
            height: activeImage ? height : "",
            typeBGimage: activeImage ? typeBGimage : "",
            photoswipe: activeImage ? activePhotoswipe : "",
            active: activeImage,
            sectionTarget: {
              sectionID: sectionID,
              modelNumber: modelNumber,
              rexID: rex_block_id
            },
          }
        },
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });
  };

  var _setTools = function() {

  };

  /**
   * Initing the block toolbar
   */
  var init = function() {
    _attachEvents();
    _setTools();
  };

  return {
    init: init,
  }
})(jQuery);