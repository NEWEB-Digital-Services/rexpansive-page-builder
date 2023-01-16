/**
 * Setting the content position
 * @since 2.0.0
 */
var Block_Content_Positions_Setting = (function($) {
  "use strict";

  var block_content_position_properties;
  var defaultPositionCoordinates;
  var target;

  var _openBlockContentPositionModal = function(data) {
    _updatePosition(data.flexPosition);
    Rexlive_Modals_Utils.openModal(
      block_content_position_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeBlockContentPositionModal = function() {
    Rexlive_Modals_Utils.closeModal(
      block_content_position_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _linkDocumentListeners = function() {
    block_content_position_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      _closeBlockContentPositionModal();
    });
  };

  var _updatePosition = function(data) {
    target = data.target;
    _resetPosition();
    var position =
      data.position == "" ? defaultPositionCoordinates : data.position;
    block_content_position_properties.$positions
      .filter('[value="' + position + '"]')
      .prop("checked", true);
  };

  var _resetPosition = function() {
    block_content_position_properties.$positions.prop("checked", false);
  };

  var _applyBlockPosition = function() {
    var flex_content_position = block_content_position_properties.$positions.filter(":checked").val();

    if ( 'undefined' === typeof flex_content_position ) return;

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
    closeBlockContentPositionModal: _closeBlockContentPositionModal,
    applyBlockPosition: _applyBlockPosition
  };
})(jQuery);
