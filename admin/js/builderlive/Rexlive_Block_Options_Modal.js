var BlockOptions_Modal = (function($) {
  "use strict";

  var block_options_properties;
  var resetData;

  var _openBlockOptionsModal = function(data) {
    resetData = data;
    _updateBlockOptionsModal( data );
    Rexlive_Modals_Utils.openModal(
      block_options_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _updateBlockOptionsModal = function(data) {
    Background_Block_Color_Modal.updateColorModal(data.bgColor);
    Overlay_Color_block_Modal.updateOverlayModal(data.overlay);
    Background_Block_Image_Modal.updateImageModal(data.imageBG);
    Block_Video_Background_Modal.updateVideoModal(data.bgVideo);
    BlockPaddings_Modal.updatePaddings(data.paddings);
    Block_Content_Positions_Setting.updatePosition(data.flexPosition);
    Block_Photoswipe_Modal.updatePhotoswipeModal(data.imageBG);
    Block_Image_Positions_Modal.updatePosition(data.flexImgPosition);
    Block_CustomClasses_Modal.updateCustomClasses(data.customClasses);
    Block_Url_Modal.updateBlockUrl(data.linkBlock);
  };

  var _closeBlockOptionsModal = function( reset ) {
    if ( reset ) {
      _resetBlockOptionsModal();
    }
    Rexlive_Modals_Utils.closeModal( block_options_properties.$self.parent(".rex-modal-wrap") );
    resetData = null;
  };

  var _resetBlockOptionsModal = function() {
    if( resetData ) {
      _updateBlockOptionsModal( resetData );
    }

    _applyBlockOptionsModal();

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

  var _applyBlockOptionsModal = function() {
    Background_Block_Color_Modal.applyBackgroundColor();
    Overlay_Color_block_Modal.applyOverlay();
    Background_Block_Image_Modal.updateImageBackground();
    Block_Video_Background_Modal.updateVideoBackground();
    BlockPaddings_Modal.applyBlocksPaddings();
    Block_Content_Positions_Setting.applyBlockPosition();
    Block_Photoswipe_Modal.updateBlockPhotoswipe();
    Block_Image_Positions_Modal.applyBlockPosition();
    Block_CustomClasses_Modal.applyCustomClasses();
    Block_Url_Modal.applyBlockUrl();
  };

  var _linkDocumentListeners = function() {
    block_options_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      _closeBlockOptionsModal( true );
    });
    
    // confirm-refresh options
    block_options_properties.$options_buttons.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        case 'save':
          _closeBlockOptionsModal( false );
          break;
        case 'reset':
          _resetBlockOptionsModal();
          break;
        default:
          break;
      }
    });
  };

  var _init = function() {
    var $blockOptions = $("#rex-block-options");
    block_options_properties = {
      $self: $blockOptions,
      $options_buttons: $blockOptions.find('.rex-modal-option'),
      $close_button: $blockOptions.find('.rex-modal__close-button')
    };

    _linkDocumentListeners();

    Background_Block_Color_Modal.init($blockOptions);
    Overlay_Color_block_Modal.init($blockOptions);
    Background_Block_Image_Modal.init($blockOptions);
    Block_Video_Background_Modal.init($blockOptions);
    BlockPaddings_Modal.init($blockOptions);
    Block_Content_Positions_Setting.init($blockOptions);
    Block_Photoswipe_Modal.init($blockOptions);
    Block_Image_Positions_Modal.init($blockOptions);
    Block_Image_Editor_Modal.init($blockOptions);
    Block_CustomClasses_Modal.init($blockOptions);
    Block_Url_Modal.init($blockOptions);

  };

  return {
    init: _init,
    openBlockOptionsModal: _openBlockOptionsModal
  };
})(jQuery);
