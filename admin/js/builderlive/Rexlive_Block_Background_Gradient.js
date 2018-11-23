/**
 * Add gradient experience!
 * @since 2.0.0
 */
var Rexlive_Block_Background_Gradient = (function($) {
  "use strict";

  var modal_props;
  var target;

  var _openModal = function(data) {
    _updateData(data);
    Rexlive_Modals_Utils.openModal(modal_props.$self.parent(".rex-modal-wrap"));
  };

  var _closeBlockOptionsModal = function() {
    Rexlive_Modals_Utils.closeModal(
      modal_props.$self.parent(".rex-modal-wrap")
    );
  };

  var _launchGPicker = function() {
    modal_props.gpicker = new Grapick({
      el: modal_props.gpicker_selector,
      colorEl: '<input id="colorpicker"/>'
    });

    modal_props.gpicker.setColorPicker(handler => {
      var el = handler.getEl().querySelector("#colorpicker");

      $(el).spectrum({
        color: handler.getColor(),
        showAlpha: true,
        showInput: true,
        containerClassName: 'sp-container-default',
        replacerClassName: 'sp-replacer-default',
        clickoutFiresChange: true,
        change(color) {
          handler.setColor(color.toRgbString());
        },
        move(color) {
          handler.setColor(color.toRgbString(), 0);
        }
      });
    });
  };

  var _linkDocumentListeners = function() {
    modal_props.$close_button.on("click", function(e) {
      e.preventDefault();
      _closeBlockOptionsModal();
    });

    modal_props.$gradient_type.on('change', function(e) {
      modal_props.gpicker.setType(this.value);
    });

    modal_props.$gradient_angle.on('change', function(e) {
      modal_props.gpicker.setDirection(this.value);
    });

    modal_props.gpicker.on("change", function(complete) {
      // console.log(modal_props.gpicker.getValue());
      // console.log(modal_props.gpicker.getSafeValue());
      // console.log(modal_props.gpicker.getPrefixedValues());
      _updateLive();
    });
  };

  var _updateData = function(data) {
    target = data.blockData.target;
    // Display data on gradient, not trigger change event
    if( "" !== data.blockData.gradient ) {
      modal_props.gpicker.setValue(data.blockData.gradient, {
        silent: true
      });
  
      var g_type = modal_props.gpicker.getType();
      var g_direction = modal_props.gpicker.getDirection();
      modal_props.$gradient_type.find('option[value=' + g_type + ']').prop('selected', true);
      modal_props.$gradient_angle.find('option[value=' + g_direction + ']').prop('selected', true);
    } else {
      modal_props.gpicker.setValue("", {
        silent: true
      });
      modal_props.$gradient_type.val("");
      modal_props.$gradient_angle.val("");
    }
  };

  var _updateLive = function() {
    var data_updateBlockGradient = {
      eventName: "rexlive:updateBlockBackgroundGradient",
      data_to_send: {
        target: target,
        color: modal_props.gpicker.getValue(),
        active: true
      }
    };
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_updateBlockGradient);
  };

  var _init = function() {
    var $modal = $("#rex-block-background-gradient-editor");
    var gpicker_selector = "#gp-block-background-gradient";
    modal_props = {
      $self: $modal,

      $close_button: $modal.find(".rex-modal__close-button"),
      $save_button: $modal.find(".rex-modal__save-button"),

      $gpicker: $modal.find(gpicker_selector),
      gpicker_selector: gpicker_selector,
      gpicker: null,
      $gradient_type: $modal.find('#block-background-gradient-type'),
      $gradient_angle: $modal.find('#block-background-gradient-angle')
    };

    _launchGPicker();
    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal
  };
})(jQuery);
