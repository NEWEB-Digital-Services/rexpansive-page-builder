/**
 * Handling the modal to edit the block image properties:
 * - type: natural|full
 * - zoom
 * - position
 * @since 2.0.0
 */
var Block_Image_Editor_Modal = (function($) {
  'use strict';

  var $modal_wrap;
  var block_image_editor_properties;

  /**
   * Private method to cache some values
   */
  var _cache_variables = function() {
    block_image_editor_properties = {
      $modal: $('#rex-block-image-editor'),
      $close_button: null,
    };

    block_image_editor_properties.$close_button = block_image_editor_properties.$modal.find('.rex-modal__close-button');

    $modal_wrap = block_image_editor_properties.$modal.parent('.rex-modal-wrap');
  };

  var _openModal = function(data, mousePosition) {
    Background_Block_Image_Setting.updateImageModal(data.imageBG);
    Block_Image_Positions_Setting.updatePosition(data.flexImgPosition);
    
    Rexlive_Modals_Utils.positionModal( block_image_editor_properties.$modal, mousePosition );
    Rexlive_Modals_Utils.openModal($modal_wrap);
  };

  var _listen_events = function() {
    block_image_editor_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      Rexlive_Modals_Utils.closeModal( $modal_wrap );
    })
  };

  var init = function(data) {
    // console.log(data);
    _cache_variables();
    _listen_events();
    Background_Block_Image_Setting.init(block_image_editor_properties.$modal);
    Block_Image_Positions_Setting.init(block_image_editor_properties.$modal);
  };

  return {
    init: init,
    openModal: _openModal
  };
})(jQuery);