/**
 * Setting the content position
 * @since 2.0.0
 */
var Block_Content_Positions_Modal = (function($) {
  "use strict";

  var block_content_position_properties;
  var defaultPositionCoordinates;
  var target;
  var resetData;

  var _openBlockContentPositionModal = function(data, mousePosition) {
    resetData = data;
    _updatePosition(data.flexPosition);
    Rexlive_Modals_Utils.positionModal( block_content_position_properties.$self, mousePosition );
    Rexlive_Modals_Utils.openModal( block_content_position_properties.$self.parent(".rex-modal-wrap") );
  };

  var _closeBlockContentPositionModal = function() {
    _resetBlockContentPositionModal();
    Rexlive_Modals_Utils.closeModal(
      block_content_position_properties.$self.parent(".rex-modal-wrap")
    );
    resetData = null;
  };

  var _resetBlockContentPositionModal = function() {
    if( resetData ) {
      _updatePosition(resetData.flexPosition);
    }

    _applyBlockPosition();
  };

  var _linkDocumentListeners = function() {
    block_content_position_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      _closeBlockContentPositionModal();
    });

    // confirm-refresh options
    block_content_position_properties.$options_buttons.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        case 'save':
          _closeBlockContentPositionModal();
          break;
        case 'reset':
          _resetBlockContentPositionModal();
          break;
        default:
          break;
      }
    });
  };

  var _updatePosition = function(data) {
    target = data.target;
    _resetPosition();
    var position = data.position == "" ? defaultPositionCoordinates : data.position;
    block_content_position_properties.$positions.filter('[value="' + position + '"]').prop("checked", true);
  };

  var _resetPosition = function() {
    block_content_position_properties.$positions.prop("checked", false);
  };

  var _applyBlockPosition = function() {
    var flex_content_position = block_content_position_properties.$positions
      .filter(":checked")
      .val();
    var y = flex_content_position.split("-")[0];
    var x = flex_content_position.split("-")[1];

    var data_position = {
      eventName: "rexlive:apply_flex_position_block",
      data_to_send: {
        position: {
          x: x,
          y: y
        },
        target: target
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_position);
  };

  var _init = function($container) {
    var $self = $container;
    block_content_position_properties = {
      $self: $self,
      // block padding
      $positions: $self.find(".content-position"),
      $options_buttons: $self.find('.rex-modal-option'),
      $close_button: $self.find('.rex-modal__close-button')
    };

    defaultPositionCoordinates = "";

    _linkDocumentListeners();

    block_content_position_properties.$self
      .find(".rex-block-position")
      .on("click", function(e) {
        //waiting for ending animation
        setTimeout(function() {
          _applyBlockPosition();
        }, 50);
      });
  };

  return {
    init: _init,
    updatePosition: _updatePosition,
    resetPosition: _resetPosition,
    openBlockContentPositionModal: _openBlockContentPositionModal,
    closeBlockContentPositionModal: _closeBlockContentPositionModal
  };
})(jQuery);
