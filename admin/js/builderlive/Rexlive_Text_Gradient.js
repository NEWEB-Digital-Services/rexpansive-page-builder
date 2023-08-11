/**
 * Add gradient experience!
 * @since 2.0.0
 */
var Rexlive_Text_Gradient = (function($) {
  "use strict";

  var modal_props;
  var target;

  var _openModal = function(data) {
    _updateData(data);
    Rexlive_Modals_Utils.openModal(modal_props.$self.parent(".rex-modal-wrap"));
  };

  var _closeBlockOptionsModal = function() {
    const closeModalEventData = {
      eventName: 'rexlive:textGradientModal:close',
      data_to_send: {}
    }
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(closeModalEventData);

    Rexlive_Modals_Utils.closeModal(
      modal_props.$self.parent(".rex-modal-wrap")
    );

    _updateLive()
  };

  var _launchGPicker = function() {
    modal_props.gpicker = new Grapick({
      el: modal_props.gpicker_selector,
      colorEl: '<input id="colorpicker"/>'
    });

    modal_props.gpicker.setColorPicker(function(handler) {
      var el = handler.getEl().querySelector("#colorpicker");
      var $el = $(el);

      $el.spectrum({
        color: handler.getColor(),
        showAlpha: true,
        showInput: true,
        showButtons: false,
        containerClassName: 'sp-container-default sp-draggable sp-meditor',
        replacerClassName: 'sp-replacer__gradient',
        clickoutFiresChange: true,
        preferredFormat: "hex",
        show: function() {
          var container = $el.spectrum('container')[0];
          container.style.top = ( parseInt( container.style.top ) + 10 ) + 'px';

          this.setAttribute("data-revert", false);
          this.setAttribute("data-color-on-show", $el.spectrum("get").toRgbString());
        },
        change: function (color) {
          handler.setColor(color.toRgbString());
        },
        move: function(color) {
          handler.setColor(color.toRgbString(), 0);
        },
        hide: function() {
          if("true" == this.getAttribute("data-revert")) {
            handler.setColor(this.getAttribute("data-color-on-show"), 0);
          }
        }
      });

      var resetCb = function() {
        var resetData = $el.attr('data-color-on-show');
        if ( resetData ) {
          handler.setColor(resetData, 0);
          $el.spectrum('set', resetData);
        }
      };

      Rexbuilder_Util_Admin_Editor.addSpectrumCustomSaveButton($el, resetCb);
      Rexbuilder_Util_Admin_Editor.addSpectrumCustomCloseButton($el);
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

    // todo: decide what to do: keep it or not?
    // modal_props.gpicker.on("change", function(complete) {
    //   _updateLive();
    // });

    modal_props.$add_palette.on("click", function(e) {
      e.preventDefault();
      var gradient_to_save = modal_props.gpicker.getValue();
      var gradient_to_view = modal_props.gpicker.getSafeValue();
      var gradient_ID = Rexbuilder_Util_Admin_Editor.createRandomID(4);

      Rexlive_Ajax_Calls.savePaletteColorGradient( {
        gradient: gradient_to_save,
        gradient_preview: gradient_to_view,
        ID: gradient_ID
      });
    });

    modal_props.$self.on("click", ".palette-item", function(e) {
      e.preventDefault();
      var gradient = this.getAttribute("data-gradient-value");
      _setGradientPicker( gradient, false );
    });

    modal_props.$self.on("click", ".palette-item__delete", function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var gradientEl = this.parentElement;
      var gradient_ID = gradientEl.getAttribute("data-gradient-id");

      Rexlive_Ajax_Calls.deletePaletteColorGradient({
        ID: gradient_ID
      });
    });
  };
  
  var _deletePaletteItem = function( el ) {
    $(el).remove();
  };

  var _updatePalette = function() {
    modal_props.$palette_list.find('.palette-item').each(function(i,el) {
      el.style.background = Rexbuilder_Util_Admin_Editor.getGradientSafeValue( el.getAttribute('data-gradient-value') );
    });
  };

  var _updateData = function(data) {
    target = data.blockData.target;
    // Display data on gradient, not trigger change event
    _setGradientPicker( data.blockData.gradient, true );
  };

  var _setGradientPicker = function( gradient, silent ) {
    silent = "undefined" !== typeof silent ? silent : false;
    gradient = "undefined" !== typeof gradient ? gradient : "";

    if( "" !== gradient && -1 !== gradient.indexOf("gradient") ) {
      modal_props.gpicker.setValue(gradient, { silent: true });
  
      var g_type = modal_props.gpicker.getType();
      var g_direction = modal_props.gpicker.getDirection();
      modal_props.$gradient_type.find('option[value=' + g_type + ']').prop('selected', true);
      modal_props.$gradient_angle.find('option[value=' + g_direction + ']').prop('selected', true);
      if( !silent ) {
        modal_props.gpicker.change();
      }
    } else {
      modal_props.gpicker.setValue("", {
        silent: silent
      });
      modal_props.$gradient_type.val("");
      modal_props.$gradient_angle.val("");
    }
  }

  var _updateLive = function() {
    var value = modal_props.gpicker.getValue();
    var type = modal_props.$gradient_type.val();
    var direction = modal_props.$gradient_angle.val();
    direction = "135deg" === direction ? "top left" : direction;
    direction = "315deg" === direction ? "bottom right" : direction;
    var styleGradient = Rexlive_Gradient_Utils.getMarkup(type, direction, modal_props.gpicker.getHandlers(),"cover");
    if( "" === value ) return

    var data_updateBlockGradient = {
      eventName: "rexlive:setTextGradient",
      data_to_send: {
        target: target,
        color: value,
        style: styleGradient,
        active: true
      }
    };
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_updateBlockGradient);
  };

  var _getProps = function(){
    return modal_props;
  };

  var _init = function() {
    var $modal = $("#rex-text-gradient-editor");
    var gpicker_selector = "#gp-text-gradient";
    modal_props = {
      $self: $modal,

      $close_button: $modal.find(".rex-modal__close-button"),
      $save_button: $modal.find(".rex-modal__save-button"),

      $gpicker: $modal.find(gpicker_selector),
      gpicker_selector: gpicker_selector,
      gpicker: null,
      $gradient_type: $modal.find('#text-gradient-type'),
      $gradient_angle: $modal.find('#text-gradient-angle'),

      $palette_list: $modal.find('.palette-list'),
      $add_palette: $modal.find('.palette__add-gradient'),
    };

    _launchGPicker();
    _linkDocumentListeners();
    _updatePalette();
  };

  return {
    init: _init,
    openModal: _openModal,
    deletePaletteItem: _deletePaletteItem,
    getProps: _getProps
  };
})(jQuery);
