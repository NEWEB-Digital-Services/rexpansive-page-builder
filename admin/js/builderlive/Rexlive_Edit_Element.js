/**
 * Editor for the elements (contact forms, ...)
 * @since x.x.x
 */
var Element_Edit_Modal = (function ($) {

	///////////////////////////////////////////////////////////////////////////////////////////////
    /// PANEL FOR CHOSE IF EDIT ELEMENT OR ELEMENT MODEL
    /////////////////////////////////////////////////////////////////////////////////////////////// 


    var rex_edit_model_element_panel_properties;

    var _openChooseElementEdit = function () {
        Rexlive_Modals_Utils.openModal(
            rex_edit_model_element_panel_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _closeChooseElementEdit = function () {
        Rexlive_Modals_Utils.closeModal(
            rex_edit_model_element_panel_properties.$self.parent(".rex-modal-wrap")
        );
    };

    var _linkDocumentPanelChooseListeners = function () {
        rex_edit_model_element_panel_properties.$element.on("click", function (e) {
            var optionSelected = this.getAttribute("data-rex-option");
            switch (optionSelected) {
                case "remove":
                    _separateRexElement();
                    break;
                case "edit":
                    editingModelElement = true;
                    element_editor_properties.$self.addClass("editing-model");
                    Rexlive_Modals_Utils.openModal(
                        element_editor_properties.$self.parent(".rex-modal-wrap")
                    );
                    _staySynchronized();
                    break;
                default:
                    break;
            }
            _closeChooseElementEdit();
        });

        rex_edit_model_element_panel_properties.$close_button.on("click", function () {
            _closeChooseElementEdit();
        })
    };

    var _initPanelChoose = function () {
        var $self = $("#rex-element-model-choose");
        var $container = $self;
        rex_edit_model_element_panel_properties = {
            $self: $self,
            $element: $container.find(".rex-button"),
            $close_button: $container.find(".rex-modal__close-button")
        };
        _linkDocumentPanelChooseListeners();
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////

    var element_editor_properties;
    var elementData;
    var editingModelElement;
    // var rexButtonsJSON;
    var elementssIDsUsed;
    // var reverseData;
    // var resetData;
    // var alreadyChooseToSynchronize;
    // var defaultButtonValues;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// SAVING FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Creates a new ID, adds to used IDs and updates on DB the used ids
     */
    var _separateRexElement = function () {
        var newID = _createNewElementID(); // Da aggiungere e forse modificare
        _addIDElement(newID); // Da aggiungere
        _updateElementsIDSUsed({ // Da aggiungere
            rexID: newID,
            separate: true
        });
    }

    // L'ID dovrebbe essere numerico, ma per ora lo lascio alfanumerico random
    var _createNewElementID = function () {
        var newID = "";
        var flag;
        var i;
        do {
            flag = true;
            newID = Rexbuilder_Util_Admin_Editor.createRandomID(4);
            for (i = 0; i < elementsIDsUsed.length; i++) {
                if (newID == elementsIDsUsed[i]) {
                    flag = false;
                    break;
                }
            }
        } while (!flag);
        return newID;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT TELL THE IFRAME WHAT TO DO
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    var _staySynchronized = function () {
        var elementDataToIframe = {
            eventName: "rexlive:lock_synchronize_on_element",
            data_to_send: {
                buttonTarget: elementData.buttonTarget
            }
        };
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(buttonDataToIframe);
    }

    var _linkDocumentListeners = function () {};

	var _init = function() {
		var $self = $("#rex-element-editor");
        // var $accordions = $self.find('.rexpansive-accordion');
        var $container = $self;

        element_editor_properties = {}
		
		rexElementsJSON = JSON.parse($("#rex-elements-json-css").text());
		elementsIDsUsed = JSON.parse($("#rex-elements-ids-used").text());
		_linkDocumentListeners();
		// Qua ci andranno i valori di default degli stili che verranno scelti
        defaultElementValues = {
            // Prova
            input: {
                text: {
                    "border-color": "#c935bd",
                }
            }
        };
		elementData = {};

		// _linkTextInputs();
  //       _linkNumberInputs();
  //       _linkDropDownMenus();

  //       _linkTextColorEditor();
  //       _linkBackgroundColorEditor();
  //       _linkBackgroundHoverColorEditor();
  //       _linkBorderHoverColorEditor();
  //       _linkTextHoverColorEditor();
  //       _linkBorderColorEditor();

		_initPanelChoose();

        // $accordions.rexAccordion({open:{},close:{},});

	}

	return {
		init: _init,
        // openElementEditorModal: _openElementEditorModal,
        // removeIDElement: _removeIDElement,
        // removeIDElementSoft: _removeIDElementSoft
	}
})(jQuery);