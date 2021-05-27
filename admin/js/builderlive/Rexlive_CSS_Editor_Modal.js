var CssEditor_Modal = (function ($) {
    'use strict';
    var ace_css_editor_modal_properties;
    var editor;
    var defaultCss;
    var resetData;

    var _openModal = function (customCSS) {
        resetData = customCSS;
        _updateModal( customCSS );
        Rexlive_Modals_Utils.openModal(ace_css_editor_modal_properties.$modal_wrap);
    };

    var _updateModal = function( data ) {
        if (typeof data == "undefined" || data.trim() == "") {
            editor.setValue(defaultCss);
        } else {
            editor.setValue(data);
        }

        editor.clearSelection();
    };

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(ace_css_editor_modal_properties.$modal_wrap);
        resetData = null;
    };

    var _resetModal = function() {
        if ( null !== resetData ) {
            _updateModal( resetData );
        }
    };

    var _linkDocumentListeners = function () {
        ace_css_editor_modal_properties.$save_button.on('click', function (e) {
            e.preventDefault();
            var customCSS = editor.getValue();
            var data_customCSS = {
                eventName: "rexlive:SetCustomCSS",
                data_to_send: {
                    customCSS: customCSS
                }
            };
            
            ace_css_editor_modal_properties.$self.addClass('setting-saving'); // .on(Rexbuilder_Util_Admin_Editor.animationEvent, function(e) {
            setTimeout(function() {
                Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_customCSS);
                _closeModal();
                ace_css_editor_modal_properties.$self.removeClass('setting-saving');
            }, 800);
        });
        
        ace_css_editor_modal_properties.$cancel_button.on('click', function (e) {
            _closeModal();
        });
        
        ace_css_editor_modal_properties.$open_button.on('click', function (e) {
            var open_css = {
                eventName: "rexlive:getCustomCss",
            };
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(open_css);
        });

        // confirm-refresh options
        ace_css_editor_modal_properties.$options_buttons.on('click', function(event) {
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

    var _init = function () {
        var $modal = $('#rex-css-editor');
        ace_css_editor_modal_properties = {
            $self: $modal,
            $modal_wrap: null,
            $save_button: $modal.find('#css-editor-save'),
            $cancel_button: $modal.find('#css-editor-cancel'),
            $options_buttons: $modal.find('.rex-modal-option'),
            $open_button: Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find("#open-css-editor")
        };

        editor = ace.edit('rex-css-ace-editor');
        ace_css_editor_modal_properties.$modal_wrap = $modal.parent('.rex-modal-wrap');
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/css");
        editor.on("change", function(e){
            Rexbuilder_Util_Admin_Editor.deactiveSavePageButton();
        });
        defaultCss = "";
        _linkDocumentListeners();
    };

    return {
        init: _init,
        openModal: _openModal
    };

})(jQuery);