/**
 * Editor for html inside blocks
 * @since 2.0.0
 */
var HtmlEditor_Modal = (function($) {
  "use strict";

  var html_editor_modal_properties;
  var editor;
  var defaultHTML;
  var resetData;

  var _openModal = function( customHTML) {
    resetData = customHTML;
    _updateModal( customHTML );
    Rexlive_Modals_Utils.openModal(html_editor_modal_properties.$modal_wrap);
  };

  var _updateModal = function( data ) {
    if (typeof data == "undefined" || data.trim() == "") {
      editor.setValue(defaultHTML);
    } else {
      editor.setValue(data);
    }

    editor.clearSelection();
  };

  var _closeModal = function() {
    Rexlive_Modals_Utils.closeModal( html_editor_modal_properties.$modal_wrap );
    resetData = null;
  };

  var _resetModal = function() {
    if ( null !== resetData ) {
      _updateModal( resetData );
    }
    // _applyHTML();
  };

  var _applyHTML = function() {
    var customHTML = editor.getValue();
    var data_customHTML = {
      eventName: "rexlive:SetcustomHTML",
      data_to_send: {                     
        customHTML: customHTML
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_customHTML);
  };

  var _linkDocumentListeners = function() {
    html_editor_modal_properties.$save_button.on("click", function(e) {
      e.preventDefault();
      
      _applyHTML();

      html_editor_modal_properties.$self.addClass("setting-saving").on(Rexbuilder_Util_Admin_Editor.animationEvent, function(e) {
        _closeModal(); 
        html_editor_modal_properties.$self.removeClass("setting-saving");
      });
    });

    html_editor_modal_properties.$close_button.on("click", function(e) {
      _closeModal();
    });

    // confirm-refresh options
    html_editor_modal_properties.$options_buttons.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        // case 'save':
        //   _closeModal( false );
        //   break;
        case 'reset':
          _resetModal();
          break;
        default:
          break;
      }
    });
  };

  var _init = function() {
    var $modal = $("#rex-html-text-editor");
    html_editor_modal_properties = {
      $self: $modal,
      $modal_wrap: null,
      $save_button: $modal.find(".rex-modal__save-button"),
      $close_button: $modal.find(".rex-modal__close-button"),
      $options_buttons: $modal.find('.rex-modal-option'),
      $open_button: Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find( "#test-html-editor" )
    };

    html_editor_modal_properties.$modal_wrap = $modal.parent( ".rex-modal-wrap" );

    editor = ace.edit("rex-html-ace-editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setTabSize(2);

    // var beautify = ace.require("ace/ext/beautify"); // get reference to extension
    // beautify.beautify(editor.session);
    
    defaultHTML = "";
    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal
  };
})(jQuery);
