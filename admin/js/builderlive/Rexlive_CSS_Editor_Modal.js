var CssEditor_Modal = (function ($) {
    'use strict';
    var ace_css_editor_modal_properties;
    var editor;
    var defaultCss;

    var _openModal = function (customCSS) {
        if (typeof customCSS == "undefined" || customCSS.trim() == "") {
            editor.setValue(defaultCss);
        } else {
            editor.setValue(customCSS);
        }

        // ace_css_editor_modal_properties.$self.removeClass('setting-edited');
        editor.clearSelection();
        Rexlive_Modals_Utils.openModal(ace_css_editor_modal_properties.$modal_wrap);
    }

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(ace_css_editor_modal_properties.$modal_wrap);
    }

    var _linkDocumentListeners = function () {
        ace_css_editor_modal_properties.$save_button.on('click', function (e) {
            e.preventDefault();
            var customCSS = editor.getValue();
            var data_customCSS = {
                eventName: "rexlive:SetCustomCSS",
                data_to_send: {
                    customCSS: customCSS
                }
            }
            
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
            }
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(open_css);
        });
    }

    var _init = function () {
        var $modal = $('#rex-css-editor');
        ace_css_editor_modal_properties = {
            $self: $modal,
            $modal_wrap: null,
            $save_button: $modal.find('#css-editor-save'),
            $cancel_button: $modal.find('#css-editor-cancel'),
            $open_button: Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find("#open-css-editor")
        };

        editor = ace.edit('rex-css-ace-editor');
        ace_css_editor_modal_properties.$modal_wrap = $modal.parent('.rex-modal-wrap');
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/css");
        editor.on("change", function(e){
            // if( e.start.row == 0 && e.start.column == 0 && e.action == 'remove' ) {
            //     $modal.removeClass('setting-edited');
            // } else {
            //     $modal.addClass('setting-edited');
            // }
            Rexbuilder_Util_Admin_Editor.editPageProperties();
        });
        defaultCss = "";
        _linkDocumentListeners();
    }

    return {
        init: _init,
        openModal: _openModal
    };

})(jQuery);