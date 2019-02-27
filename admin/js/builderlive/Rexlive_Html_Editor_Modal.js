/**
 * Editor for html inside blocks
 * @since 2.0.0
 */
var HtmlEditor_Modal = (function($) {
  "use strict";

  // dichiarare le variabili iniziali per poi poterle richiamare ove necessario
  var html_editor_modal_properties;
  var editor;
  var defaultHTML;

  var _openModal = function(customHTML) { // funzione per l'apertura della finestra contenente l'Editor HTML
    if (typeof customHTML == "undefined" || customHTML.trim() == "") {  // verificare se il valore customHTML non è definito, rimozione degli spazi con .trim()
      editor.setValue(defaultHTML);   // attribuire il valore di default all'editor, caricare i dati base prestabiliti
    } else {
      editor.setValue(customHTML);  // attribuire un valore all'editor, caricare i dati html degli elementi presenti all'interno dell'elemento
    }

    editor.clearSelection();  // funzione per la pulizia/reset del seguente elemento: "rex-html-ace-editor"                                     JavaScript:81
    Rexlive_Modals_Utils.openModal(html_editor_modal_properties.$modal_wrap); // elemento collegato all'apertura di ".rex-modal-wrap"           JavaScript:79
  };

  var _closeModal = function() {  // funzione per la chiusura della finestra contenente l'Editor HTML
    Rexlive_Modals_Utils.closeModal( html_editor_modal_properties.$modal_wrap );  // elemento collegato alla chiusura di ".rex-modal-wrap"      JavaScript:79
  };

  var _linkDocumentListeners = function() { // funzione per l'analisi e il salvataggio dei dati inseriti/rimossi dall'Editor HTML
    html_editor_modal_properties.$save_button.on("click", function(e) { // funzione eseguibile al click sul pulsante di salvataggio, cliccatosi dall'utente
      e.preventDefault(); // impostare i valori di default alla variabile "e"
      
      var customHTML = editor.getValue();   // stabilire che la variabile "customHTML" deve contenere i dati presenti all'interno dell'elemento "#rex-html-ace-editor"
      var data_customHTML = {               // raccogliere i dati utili/necessari all'interno della variabile "data_customHTML"
        eventName: "rexlive:SetcustomHTML", // impostare l'evento da eseguire per il corretto salvataggio dei dati inseriti nell'Editor HTML
        data_to_send: {                     
          customHTML: customHTML            // sovrascrivere i vecchi dati di customHTML con quelli più recenti
        }
      };

      console.log("publicHTML || "+customHTML)                                                                               // NOTIFICA
      Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_customHTML);   // inviare i dati della variabile "data_customHTML"

      html_editor_modal_properties.$self.addClass("setting-saving").on(Rexbuilder_Util_Admin_Editor.animationEvent, function(e) {
        _closeModal();  // eseguire la funzione di chiusura dell'Editor HTML
        html_editor_modal_properties.$self.removeClass("setting-saving");   // rimuovere la classe setting-saving dalle proprietà
      });
    });

    html_editor_modal_properties.$close_button.on("click", function(e) {  // funzione eseguibile al click sul pulsante di chiusura, cliccatosi dall'utente
      _closeModal();    // eseguire la funzione di chiusura dell'Editor HTML
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
