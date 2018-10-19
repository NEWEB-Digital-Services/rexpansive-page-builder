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

  var _openModal = function(data) {
    Background_Block_Image_Modal.updateImageModal(data.imageBG);
    Block_Image_Positions_Modal.updatePosition(data.flexImgPosition);
    Rexpansive_Builder_Admin_Modals.OpenModal($modal_wrap, true);
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
  };

  return {
    init: init,
    openModal: _openModal
  };
})(jQuery);