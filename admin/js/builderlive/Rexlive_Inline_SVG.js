/**
 * Insertint inline SVG icons
 * @since 2.0.0
 * @date 27-02-2019
 */
var Rexlive_Inline_SVG = (function($) {
  "use strict";
  var inline_svg_props;

  /**
   * Open the modal
   * @param {Object} data options
   * @since 2.0.0
   */
  var _openModal = function( data ) {
    // If passing an svg id, select the relative option
    if ( 'undefined' !== typeof data.id )
    {
      // inline_svg_props.$icon_select.find('option[value='+data.id+']').attr('selected','selected');
      inline_svg_props.$icon_select_box.find('.select-box__input[value="'+data.id+'"]').prop('checked', true);
    }
    else
    {
      inline_svg_props.$icon_select_box.find('.select-box__input[value=""]').prop('checked', true);
    }

    Rexlive_Modals_Utils.openModal(
      inline_svg_props.$self.parent(".rex-modal-wrap")
    );
  };

  /**
   * Close the modal
   * @since 2.0.0
   */
  var _closeModal = function() {
    inline_svg_props.$icon_select.val('');
    inline_svg_props.selected_icon = null;
    Rexlive_Modals_Utils.closeModal(
      inline_svg_props.$self.parent(".rex-modal-wrap")
    );
  };

  /**
   * Add event listeners to the modal
   * @since 2.0.0
   */
  var _linkDocumentListeners = function() {
    /**
     * On button close click
     * @event click
     */
    inline_svg_props.$close_button.on('click', function(e) {
      _closeModal();
    });

    /**
     * On button save click
     * @event click
     */
    inline_svg_props.$save_button.on('click', function(e) {
      // var icon_to_insert = inline_svg_props.$icon_select.val();
      var $icon_to_insert_el = inline_svg_props.$icon_select_box.find('.select-box__input:checked');
      var icon_to_insert = $icon_to_insert_el.val();
      // If icon was choosen
      if( '' !== icon_to_insert )
      {
        var icon_class = $icon_to_insert_el.attr('data-svg-class');
        var settings = {
          eventName: "rexlive:mediumEditor:inlineSVG",
          data_to_send: {
            svg_ID: icon_to_insert,
            svg_class: icon_class
          }
        };
        // Tell the public iframe to insert an icon
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(settings);
      }
      _closeModal();
    });
  };

  var _init = function() {
    var $self = $("#rexlive-inline-svg");
    var $container = $self;
    inline_svg_props = {
      $self: $self,
      $close_button: $container.find(".tool-button--close"),
      $save_button: $container.find(".tool-button--save"),
      $icon_select: $container.find("#rexlive-inline-svg-select"),
      $icon_select_box: $container.find('.select-box__current'),
      selected_icon: null
    };
    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal,
    closeModal: _closeModal
  };

})(jQuery);