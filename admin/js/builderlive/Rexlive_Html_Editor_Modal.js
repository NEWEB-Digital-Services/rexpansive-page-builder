/**
 * Editor for html inside blocks
 * @since 2.0.0
 */
var HtmlEditor_Modal = (function($) {
  "use strict";
  var html_editor_modal_properties;
  var editor;
  var defaultHTML;

  var _openModal = function(customHTML) {
    if (typeof customHTML == "undefined" || customHTML.trim() == "") {
      editor.setValue(defaultHTML);
    } else {
      editor.setValue(customHTML);
    }

    editor.clearSelection();
    Rexlive_Modals_Utils.openModal(html_editor_modal_properties.$modal_wrap);
  };

  var _closeModal = function() {
    Rexlive_Modals_Utils.closeModal( html_editor_modal_properties.$modal_wrap );
  };

  var _linkDocumentListeners = function() {
    html_editor_modal_properties.$save_button.on("click", function(e) {
      e.preventDefault();

      var customHTML = editor.getValue();
      var data_customHTML = {
        eventName: "rexlive:SetcustomHTML",
        data_to_send: {
          customHTML: customHTML
        }
      };
      Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_customHTML);

      html_editor_modal_properties.$self.addClass("setting-saving").on(Rexbuilder_Util_Admin_Editor.animationEvent, function(e) {
        _closeModal();
        html_editor_modal_properties.$self.removeClass("setting-saving");
      });
    });

    html_editor_modal_properties.$close_button.on("click", function(e) {
      _closeModal();
    });

    // html_editor_modal_properties.$open_button.on("click", function(e) {
    //   var open_css = {
    //     eventName: "rexlive:getcustomHTML"
    //   };
    //   Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(open_css);
    // });

    // editor.on("change", function(e) {
    //   Rexbuilder_Util_Admin_Editor.editPageProperties();
    // });
  };

  var _init = function() {
    var $modal = $("#rex-html-text-editor");
    html_editor_modal_properties = {
      $self: $modal,
      $modal_wrap: null,
      $save_button: $modal.find(".rex-modal__save-button"),
      $close_button: $modal.find(".rex-modal__close-button"),
      $open_button: Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find( "#test-html-editor" )
    };

    html_editor_modal_properties.$modal_wrap = $modal.parent( ".rex-modal-wrap" );

    editor = ace.edit("rex-html-ace-editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");
    editor.getSession().setUseWrapMode(true);

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
