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
  var resetData;

  /**
   * Private method to cache some values
   */
  var _cache_variables = function() {
    var $modal = $('#rex-block-image-editor');
    block_image_editor_properties = {
      $modal: $modal,
      $options_buttons: $modal.find('.rex-modal-option'),
      $close_button: $modal.find('.rex-modal__close-button'),
    };

    $modal_wrap = block_image_editor_properties.$modal.parent('.rex-modal-wrap');
  };

  var _openModal = function(data, mousePosition) {
    resetData = data;

    _updateData( data );
    
    Rexlive_Modals_Utils.positionModal( block_image_editor_properties.$modal, mousePosition );
    Rexlive_Modals_Utils.openModal($modal_wrap);
  };

  var _updateData = function(data) {
    Background_Block_Image_Setting.updateImageModal(data.imageBG);
    Block_Image_Positions_Setting.updatePosition(data.flexImgPosition);
    Block_Photoswipe_Setting.updatePhotoswipeModal(data.imageBG);
  };

  var _applyData = function() {
    Background_Block_Image_Setting.updateImageBackground();
    Block_Image_Positions_Setting.applyBlockPosition();
    Block_Photoswipe_Setting.updateBlockPhotoswipe();
  };

  var _closeModal = function() {
    _resetBlockImageEditorModal();
    Rexlive_Modals_Utils.closeModal( $modal_wrap );
    resetData = null;
  };

  var _resetBlockImageEditorModal = function() {
    if ( resetData ) {
      _updateData( resetData );
    }

    _applyData();

    // restore the blocks dimensions, probably changed
    var event = {
      eventName: "rexlive:update_block_size",
      data_to_send: {
        sectionTarget: resetData.sectionTarget,
        blockState: resetData.blockState
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(event);
  };

  var _listen_events = function() {
    block_image_editor_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      
    });

    block_image_editor_properties.$options_buttons.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        case 'save':
          _closeModal();
          break;
        case 'reset':
          _resetBlockImageEditorModal();
          break;
        default:
          break;
      }
    });
  };

  var init = function(data) {
    _cache_variables();
    _listen_events();
    Background_Block_Image_Setting.init(block_image_editor_properties.$modal);
    Block_Image_Positions_Setting.init(block_image_editor_properties.$modal);
    Block_Photoswipe_Setting.init(block_image_editor_properties.$modal);
  };

  return {
    init: init,
    openModal: _openModal
  };
})(jQuery);