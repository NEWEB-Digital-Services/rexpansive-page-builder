var Rexbuilder_Rexelement = (function ($) {
	"use strict";

    var styleSheet;
    var elementsInPage;
    var defaultElementValues;

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// CSS RULES EDITING
    /////////////////////////////////////////////////////////////////////////////////////////////////
    
    var _fixCustomStyleElement = function () {
        if (Rexbuilder_Rexelement.$rexelementsStyle.length == 0) {
            var css = "",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");

            style.type = "text/css";
            style.id = "rexpansive-builder-rexelement-style-inline-css";
            style.dataset.rexName = "rexelements-style";
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].ownerNode.id == "rexpansive-builder-rexelement-style-inline-css") {
                styleSheet = document.styleSheets[i];
            }
        }
    };

    var _getActiveStyleSheet = function () {
        return styleSheet;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Adding rules

    var _addElementBackgroundRule = function (elementID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container{" + property + "}", styleSheet.cssRules.length);
            //rex-element-container cambiarlo?
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container{" + property + "}", styleSheet.cssRules.length);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Updating rules
    
    var _updateElementBackgroundRule = function (elementID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id='" + elementID + "'].rex-element-wrapper .rex-element-container"
            ) {
                switch (rule) {
                    case "border-width":
                        styleSheet.cssRules[i].style.borderWidth = value;

                        styleSheet.cssRules[i].style.borderTopWidth = value;
                        styleSheet.cssRules[i].style.borderLeftWidth = value;
                        styleSheet.cssRules[i].style.borderRightWidth = value;
                        styleSheet.cssRules[i].style.borderBottomWidth = value;

                        styleSheet.cssRules[i].style.borderTop = value + " " + styleSheet.cssRules[i].style.borderTopStyle + " " + styleSheet.cssRules[i].style.borderTopColor;
                        styleSheet.cssRules[i].style.borderLeft = value + " " + styleSheet.cssRules[i].style.borderLeftStyle + " " + styleSheet.cssRules[i].style.borderLeftColor;
                        styleSheet.cssRules[i].style.borderRight = value + " " + styleSheet.cssRules[i].style.borderRightStyle + " " + styleSheet.cssRules[i].style.borderRightColor;
                        styleSheet.cssRules[i].style.borderBottom = value + " " + styleSheet.cssRules[i].style.borderBottomStyle + " " + styleSheet.cssRules[i].style.borderBottomColor;
                        break;
                    case "border-color":
                        styleSheet.cssRules[i].style.borderColor = value;

                        styleSheet.cssRules[i].style.borderTopColor = value;
                        styleSheet.cssRules[i].style.borderLeftColor = value;
                        styleSheet.cssRules[i].style.borderRightColor = value;
                        styleSheet.cssRules[i].style.borderBottomColor = value;

                        break;
                    case "border-style":
                        styleSheet.cssRules[i].style.borderStyle = value;

                        styleSheet.cssRules[i].style.borderTopStyle = value;
                        styleSheet.cssRules[i].style.borderLeftStyle = value;
                        styleSheet.cssRules[i].style.borderRightStyle = value;
                        styleSheet.cssRules[i].style.borderBottomStyle = value;

                        styleSheet.cssRules[i].style.borderTop = styleSheet.cssRules[i].style.borderTopWidth + " " + value + " " + styleSheet.cssRules[i].style.borderTopColor;
                        styleSheet.cssRules[i].style.borderLeft = styleSheet.cssRules[i].style.borderLeftWidth + " " + value + " " + styleSheet.cssRules[i].style.borderLeftColor;
                        styleSheet.cssRules[i].style.borderRight = styleSheet.cssRules[i].style.borderRightWidth + " " + value + " " + styleSheet.cssRules[i].style.borderRightColor;
                        styleSheet.cssRules[i].style.borderBottom = styleSheet.cssRules[i].style.borderBottomWidth + " " + value + " " + styleSheet.cssRules[i].style.borderBottomColor;
                        break;
                    case "border-radius":
                        styleSheet.cssRules[i].style.borderRadius = value;

                        styleSheet.cssRules[i].style.borderTopLeftRadius = value;
                        styleSheet.cssRules[i].style.borderTopRightRadius = value;
                        styleSheet.cssRules[i].style.borderBottomLeftRadius = value;
                        styleSheet.cssRules[i].style.borderBottomRightRadius = value;
                        styleSheet.cssRules[i].style.webkitBorderRadius = value;

                        styleSheet.cssRules[i].style.webkitBorderTopLeftRadius = value;
                        styleSheet.cssRules[i].style.webkitBorderTopRightRadius = value;
                        styleSheet.cssRules[i].style.webkitBorderBottomLeftRadius = value;
                        styleSheet.cssRules[i].style.webkitBorderBottomRightRadius = value;
                        break;
                    case "background-color":
                        styleSheet.cssRules[i].style.backgroundColor = value;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Removing rules
    
    var _removeElementBackgroundRule = function (elementID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /// REXELEMENT GENERIC FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Fixes the dragged element in the DOM.
     * @param  data
     * @since x.x.x
     */
	var _fixImportedElement = function (data) {
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .rex-element-wrapper");
        var elementID = $elementWrapper.attr("data-rex-element-id");
        var $elementsParagraph = $elementWrapper.parents(".rex-elements-paragraph").eq(0);
        var $textWrap = $elementWrapper.parents(".text-wrap").eq(0);
        var $gridGallery = $elementWrapper.parents(".grid-stack-row").eq(0);
        var $section = $elementWrapper.parents(".rexpansive_section").eq(0);

        // Removing element unnecessary data
        $elementWrapper.detach().appendTo($textWrap);
        $gridGallery.find('.element-list-preview').remove();

        var dropType;
        if ($textWrap.length == 0) {
            if ($gridGallery.length != 0) {
                dropType = "inside-row";
            } else {
                dropType = "inside-new-row";
            }
        } else if ($elementsParagraph.length != 0) {
            dropType = "inside-paragraph";
        } else {
            dropType = "inside-block";
        }

        // Ajax call to get the html of the element
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rex_transform_element_shortcode",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            elementID: elementID
          },
          success: function(response) {
            if (response.success) {
                // If success get the element HTML and append it to the right div
                var $shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);
                var $divContainer = $(document.createElement("div"));
                $divContainer.addClass("rex-element-container");
                $elementWrapper.append($divContainer);
                $divContainer.append($shortcodeTransformed);

                // Get the shortcode and insert it in a new block inside $elementListHTML
                var shortcode = response.data.shortcode;
                var $spanShortcode = $(document.createElement("span"));
                $spanShortcode.addClass("string-shortcode");
                $spanShortcode.attr("shortcode", shortcode);
                $elementWrapper.prepend($spanShortcode);

                var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
                $elementData.remove();
                $elementData = $.parseHTML(response.data.element_data_html[0]);
                $elementWrapper.prepend($elementData);

                switch (dropType) {
                    case "inside-block":
                        $elementWrapper.wrap("<span class=\"rex-elements-paragraph\"></span>");
                        _endFixingElementImported($elementWrapper);
                        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                        break;
                    case "inside-paragraph":
                        _endFixingElementImported($elementWrapper);
                        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                        break;
                    case "inside-row":
                        var ev = jQuery.Event("rexlive:insert_new_text_block");
                        ev.settings = {
                            data_to_send: {
                                $elementWrapper: $elementWrapper,
                                $section: $section,
                                addBlockElement: true,
                                mousePosition: data.mousePosition
                            }
                        };
                        Rexbuilder_Util.$document.trigger(ev);
                        break;
                    case "inside-new-row":
                            // @todo
                        break;
                    default:
                        break;
                }
            }
          },
          error: function(response) {}
        });
    };

    var _endFixingElementImported = function ($elementWrapper) {
        var elementID = $elementWrapper.attr("data-rex-element-id");
        var flagElementFound = false;
        $elementWrapper.attr("data-rex-element-number", 1);
        for (var i = 0; i < elementsInPage.length; i++) {
            if (elementsInPage[i].id == elementID) {
                elementsInPage[i].number += 1;
                $elementWrapper.attr("data-rex-element-number", elementsInPage[i].number);
                flagElementFound = true;
                break;
            }
        }
        if (!flagElementFound) {
            _addElementStyle($elementWrapper);
            elementsInPage.push({
                id: elementID,
                number: 1
            });
        }

        // Setting the block height
        var $gridGallery = $elementWrapper.parents(".grid-stack-row").eq(0);
		var galleryData = $gridGallery.data();
        var galleryEditorInstance = galleryData.plugin_perfectGridGalleryEditor;
        var $block = $elementWrapper.parents(".grid-stack-item");
        galleryEditorInstance.updateElementHeight($block);

        //removes medium editor placeholder if there
        var $textWrap = $elementWrapper.parents(".text-wrap");
        if ($textWrap.length != 0) {
            TextEditor.removePlaceholder($textWrap.eq(0));
        }

        // locking grid to prevent errors on focus right text node
        // var $element = $textWrap.parents(".grid-stack-item");
        // var $section = $element.parents(".rexpansive_section");
        // Rexbuilder_Util.getGalleryInstance($section).focusElement($element);
    }

    var _updateElementListInPage = function () {
        var j;
        var flagElementFound = false;
        Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper").each(function (i, element) {
            var $elementWrapper = $(element);
            var elementID = $elementWrapper.attr("data-rex-element-id");
            var elementNumber = parseInt($elementWrapper.attr("data-rex-element-number"));
            flagElementFound = false;
            for (j = 0; j < elementsInPage.length; j++) {
                if (elementsInPage[j].id == elementID) {
                    flagElementFound = true;
                    break;
                }
            }
            flagElementFound = false;
            if (!flagElementFound) {
                elementsInPage.push({
                    id: parseInt(elementID),
                    number: elementNumber
                });

                // var $menuInForm = $(element).find(".wpcf7").find(".wpcf7-select");
                // $menuInForm.each(function () {
                //     if ($(this).find("option").eq(0).val() == "") {
                //         var $option = $(this).find("option").eq(0);
                //         $option.attr("disabled", "");
                //         $option.attr("selected", "");

                //         var placeholder = $option.parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-wpcf7-placeholder");
                //         $option.text(placeholder);
                //     }
                // });

                // Adding form span data
                // if ($elementWrapper.find(".wpcf7").length != 0) {
                //     var $formToAddData = $elementWrapper.find(".wpcf7");
                //     _addFormData($formToAddData);
                // }
                
                
                // if ($elementWrapper.hasClass("rex-separate-element")) {
                //     // We are not editing an element model, but a separate element
                //     _addElementStyle($elementWrapper);
                // } else {
                //     // We are editing an element model. Add the style only if there's
                //     // no existing style
                //     if (i !== 0 && elementsInPage[i].id == elementsInPage[i-1].id) {
                //         // Do nothing
                //     } else {
                //         _addElementStyle($elementWrapper);
                //     }
                // }
            }
            if (elementsInPage[j].number < elementNumber) {
                elementsInPage[j].number = elementNumber;
            }
        });
    }

    var _getElementsInPage = function () {
        return elementsInPage;
    }

    var _addStyles = function () {
        Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper").each(function (i, element) {
            var $elementWrapper = $(element);
            var elementID = $elementWrapper.attr("data-rex-element-id");
            // Adding form span data
            // if ($elementWrapper.find(".wpcf7").length != 0) {
                // var $formToAddData = $elementWrapper.find(".wpcf7");
                // _addFormData($formToAddData);
            // }
            // _addElementData($elementWrapper, i);
            
            if ($elementWrapper.hasClass("rex-separate-element")) {
                // We are not editing an element model, but a separate element
                _addElementStyle($elementWrapper);
            } else {
                // We are editing an element model. Add the style only if there's
                // no existing style
                if (i !== 0 && elementsInPage[i].id == elementsInPage[i-1].id) {
                    // Do nothing
                } else {
                    _addElementStyle($elementWrapper);
                }
            }
        });
    }

    var _fixWpcf7 = function () {
        _addWpcf7MenuPlaceholders();
        _fixWpcf7RadioButtons();
        _fixWpcf7Files();
    }

    var _addColumnContentSpanDatas = function () {
        Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper").each(function (i, element) {
            var $columnsInForm = $(element).find(".wpcf7 .wpcf7-column");
            $columnsInForm.each(function () {
                var $column = $(this);
                if ($column.children(".wpcf7-add-new-form-content").length == 0 && $column.children(".rex-wpcf7-column-content-data").length == 0) {
                    var formID = $column.parents(".rex-element-wrapper").attr("data-rex-element-id");
                    var row = $column.parents(".wpcf7-row").attr("wpcf7-row-number");
                    var column = $column.attr("wpcf7-column-number");

                    var data = {
                        editPoint: {
                            element_id: formID,
                            row_number: row,
                            column_number: column
                        }
                    }

                    Rexbuilder_Rexwpcf7.createColumnContentSpanData(data);
                    Rexbuilder_Rexwpcf7.updateFormInDB(formID);
                }
            });
        });
    }

    /**
     * Adding what wpcf7 can't do: set the menu placeholder
     * @return {null}
     */
    var _addWpcf7MenuPlaceholders = function () {
        Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper").each(function (i, element) {
            var $menuInForm = $(element).find(".wpcf7").find(".wpcf7-select");
            $menuInForm.each(function () {
                if ($(this).find("option").eq(0).val() == "") {
                    var $option = $(this).find("option").eq(0);
                    $option.attr("disabled", "");
                    $option.attr("selected", "");

                    var placeholder = $option.parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-wpcf7-placeholder");
                    $option.text(placeholder);
                }
            });
        });
    }

    /**
     * Fixing radio buttons to make them clickable
     * @return {null}
     */
    var _fixWpcf7RadioButtons = function () {
        // @toedit Provvisorio. Lo span contenente il testo dovrebbe essere eliminato ma
        // così facendo elimino i before e after che mostrano il radio. Come fare?
        Rexbuilder_Util.$rexContainer.find(".wpcf7 input[type='radio']").each(function (i, element) {
            var $element = $(element);

            $element.addClass("with-gap");
            $element.attr("id", "wpcf7-radio-" + (i + 1));
            var text = $element.siblings(".wpcf7-list-item-label").text();
            $element.siblings(".wpcf7-list-item-label").empty();
            var $label = $(document.createElement("label"));
            $label.addClass("wpcf7-list-item-label");
            $label.attr("for",  $element.attr("id"));
            $label.text(text);
            $label.insertAfter($element.siblings(".wpcf7-list-item-label"));
            $element.siblings("span.wpcf7-list-item-label").removeClass("wpcf7-list-item-label");
        });
    }

    var _fixWpcf7Files = function () {
        Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper").each(function (i, element) {
            var $filesInForm = $(element).find(".wpcf7 .wpcf7-form-control-wrap").has(" .wpcf7-file");
            $filesInForm.each(function (i) {
                if ($(this).find(".wpcf7-file-caption").length == 0) {
                    $(this).siblings(".wpcf7-file-caption").detach().appendTo($(this));
                }

                var $element = $(this).find("input[type='file']");
                $element.attr("id", "wpcf7-file-" + (i + 1));
                var $fileLabel = $(document.createElement("label"));
                $fileLabel.attr("for",  $element.attr("id"));
                $fileLabel.insertAfter($element);

                if ($(this).parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").length != 0) {
                    var buttonText = $(this).parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-button-text");
                    $fileLabel.text(buttonText);
                } else {
                    $fileLabel.text("Choose a file");
                }
            });
        });
    }

    var _addElementData = function ($elementToAddData, index) {
        var elementID = $elementToAddData.attr("data-rex-element-id");
        // var $elementWrapper = $formToAddData.parents(".rex-element-wrapper");
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper");

        $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
                action: "rex_element_get_span_data",
                nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                element_id: elementID
            },
            success: function(response) {
                if (response.success) {
                    var elementData = response.data.element_data_html;

                    if ($elementToAddData.find(".rex-element-data").length != 0) {
                        $elementToAddData.find(".rex-element-data").remove();
                    }

                    if ("undefined" == typeof elementData[0]) {
                        // If there's not a span element, create it
                        var $elementData = $(document.createElement("span"));
                        $elementData.addClass("rex-wpcf7-form-data");
                        $elementToAddData.prepend($elementData);

                    } else {
                        // If there is a span element, add it in the DOM
                        var $elementData = $.parseHTML(elementData[0]);
                        $elementToAddData.prepend($elementData);
                    }
                }
            },
            error: function(response) {}
        });
    }

    var _addFormData = function ($formToAddData) {
        var formID = $formToAddData.parents(".rex-element-wrapper").attr("data-rex-element-id");
        // var $elementWrapper = $formToAddData.parents(".rex-element-wrapper");
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper");

        $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
            action: "rex_wpcf7_get_form_data",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            form_id: formID
            },
            success: function(response) {
                if (response.success) {
                    var wpcf7Data = response.data.wpcf7_data_html;

                    if("undefined" == typeof wpcf7Data[0]) {
                        // If there's not a span element, create it
                        var $formData = $(document.createElement("span"));
                        $formData.addClass("rex-wpcf7-form-data");
                        $formToAddData.prepend($formData);
                    } else {
                        // If there is a span element, add it in the DOM
                        var $wpcf7Data = $.parseHTML(wpcf7Data[0]);
                        $formToAddData.prepend($wpcf7Data);
                    }

                    if ($elementWrappers.find(".rex-wpcf7-form-data").length == 1) {
                    	// Adds form style only the first time a span data element is inserted
                    	Rexbuilder_Rexwpcf7.addFormStyle($formToAddData);
                    }
                }
            },
            error: function(response) {}
        });
    }

    var _separateRexElement = function (data) {
        var elementData = data.elementData;
        var newID = data.newID;
        var elementID = elementData.element_target.element_id;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"][data-rex-element-number=\"" + elementData.element_target.element_number + "\"]");
        $elementWrapper.addClass("rex-separate-element");
        $elementWrapper.attr("data-rex-element-id", newID);
        $elementWrapper.attr("data-rex-element-number", 1);
        elementsInPage.push({
            id: newID,
            number: 1
        });

        _updateElementsData($elementWrapper, elementData);
        
        // Removes the element style if no other element is present in page
        for (i = 0; i < elementsInPage.length; i++) {
            if(!elementsInPage[i].id == elementID){
                _removeElementStyle(elementID);
            }
        }

        //if element was last of that model in page, remove it form elementsInPage array
        if (Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]").length == 0) {
            var i;
            for (i = 0; i < elementsInPage.length; i++) {
                if (elementsInPage[i].id == elementID) {
                    break;
                }
            }
            if (i != elementsInPage.length) {
                elementsInPage.splice(i, 1);
            }
        }

        _addElementStyle($elementWrapper);
    }

    /**
     * Refreshes the element from the shortcode
     * @param  elementID
     * @return {null}
     */
    var _refreshRexElement = function (elementID) {
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]");
        Rexbuilder_Util_Editor.startLoading();
        // Ajax call to get the html of the element
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rex_transform_element_shortcode",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            elementID: elementID
          },
          success: function(response) {
            if (response.success) {
                // Deleting the old element
                var $elementContainer = $elementWrapper.find(".rex-element-container");
                $elementContainer.empty();

                // If success get the element HTML and append it to the right div
                var $shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);
                $elementContainer.append($shortcodeTransformed);

                if ($elementWrapper.find(".wpcf7").length != 0) {
                    var $formToAddData = $elementWrapper.find(".wpcf7");
                    _addFormData($formToAddData);
                    _fixWpcf7();
                    _addColumnContentSpanDatas();
                }
            }
          },
          error: function(response) {},
          complete: function (response) {
            Rexbuilder_Util_Editor.endLoading();
            console.log("Refresh ok");
          }
        });
    }

    /**
     * Refreshes the element from the shortcode. This happens when we 
     * have a separate element
     * @param  data
     * @return {null}
     */
    var _refreshSeparatedRexElement = function (data) {
        var elementID = data.elementID.toString();
        var oldElementModelID = data.oldElementModelID.toString();
        var elementData = data.elementData;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]");
        var $elementData = $elementWrapper.find(".rex-element-data");
        var $elementShortcode = $elementWrapper.find(".string-shortcode");
        var elementShortcode = $elementShortcode.attr("shortcode").toString();

        var newElementShortcode = elementShortcode.replace(oldElementModelID, elementID);
        $elementShortcode.attr("shortcode", newElementShortcode);

        // Deleting the style
        // _removeElementStyle(elementID);

        // Ajax call to get the html of the element
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rex_transform_element_shortcode",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            elementID: elementID
          },
          success: function(response) {
            if (response.success) {
                // Deleting the old element
                var $elementContainer = $elementWrapper.find(".rex-element-container");
                $elementContainer.empty();

                // If success get the element HTML and append it to the right div
                var $shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);
                $elementContainer.append($shortcodeTransformed);

                // Updating element data
                $elementData.remove();
                $elementData = $.parseHTML(response.data.element_data_html[0]);
                $elementWrapper.prepend($elementData);

                _lockSynchronize(elementData);
            }
          },
          error: function(response) {}
        });
    }

    /**
     * Updates multiple elements data.
     * @param  {jQuery} $elementWrappers
     * @param  {Array} elementData Data to update
     * @return {null}
     */
    var _updateElementsData = function ($elementWrappers, elementData) {
        $elementWrappers.each(function() {
            var $elementData = $(this).find(".rex-element-data").eq(0);
            $elementData.attr("data-background-color", elementData.background_color);
        })
    }

    var _addSeparateAttributes = function ($elementWrapper, elementData) {
        var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
        // $elementData.attr("data-text-color", elementData.text_color);
        // $elementData.attr("data-text-size", elementData.font_size);
        $elementData.attr("data-background-color", elementData.background_color);
        // $elementData.attr("data-background-color-hover", elementData.hover_color);
        // $elementData.attr("data-border-color-hover", elementData.hover_border);
        // $elementData.attr("data-text-color-hover", elementData.hover_text);
        // $elementData.attr("data-border-width", elementData.border_width);
        // $elementData.attr("data-border-color", elementData.border_color);
        // $elementData.attr("data-border-radius", elementData.border_radius);
        // $elementData.attr("data-button-height", elementData.button_height);
        // $elementData.attr("data-button-width", elementData.button_width);
        // $elementData.attr("data-margin-top", elementData.margin_top);
        // $elementData.attr("data-margin-bottom", elementData.margin_bottom);
        // $elementData.attr("data-margin-right", elementData.margin_right);
        // $elementData.attr("data-margin-left", elementData.margin_left);
        // $elementData.attr("data-padding-top", elementData.padding_top);
        // $elementData.attr("data-padding-bottom", elementData.padding_bottom);
        // $elementData.attr("data-padding-right", elementData.padding_right);
        // $elementData.attr("data-padding-left", elementData.padding_left);
        // $elementData.attr("data-button-name", elementData.element_target.element_name);
    }

    /**
     * Generate element data from RexElement dom Element.
     * If getAllData is true, will get data from dom even if element is a model
     * 
     * The obtained object has 2 fields:
     * 
     * separateElement - true if element is separate, false if it is a model
     * 
     * elementInfo - properties of the element
     * 
     * @param {*} $elementWrapper DOM element wrapper
     * @param {Boolean} getAllData flag to generate all data
     * @returns {Object} data
     */
    var _generateElementData = function ($elementWrapper, getAllData) {
        getAllData = typeof getAllData === "undefined" ? false : getAllData.toString() == "true";
        var elementData = {
            synchronize: "",
            wpcf7_data: {
                background_color: "",
                border_color: "",
                border_width: "",
                margin_top: "",
                margin_left: "",
                margin_right: "",
                margin_bottom: "",
                columns: {
                    padding_top: "",
                    padding_left: "",
                    padding_right: "",
                    padding_bottom: "",
                },
                content: {
                    background_color: "",
                    background_color_hover: "",
                    text_color: "",
                    text_color_hover: "",
                    border_color: "",
                    border_color_hover: "",
                    width: "",
                    height: "",
                    font_size: "",
                    border_width: "",
                    border_radius: "",
                }
            },
            element_target: {
                element_id: "",
                element_number: "",
            }
        };

        var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
        var elementDataEl = $elementData[0];

        /* ELEMENT GENERAL DATA */
        elementData.element_target.element_id = $elementWrapper.attr("data-rex-element-id");
        elementData.element_target.element_number = parseInt($elementWrapper.attr("data-rex-element-number"));

        elementData.synchronize = typeof $elementData.attr("data-synchronize") == "undefined" ? false : $elementData.attr("data-synchronize").toString();

        var separate = false;
        if ($elementWrapper.hasClass("rex-separate-element") || getAllData) {
            separate = true;
        }

        /* WPCF7 */
        // Background color
        elementData.wpcf7_data.background_color = (elementDataEl.getAttribute("data-wpcf7-background-color") ? elementDataEl.getAttribute("data-wpcf7-background-color").toString() : '');

        // Border color
        elementData.wpcf7_data.border_color = (elementDataEl.getAttribute("data-wpcf7-border-color") ? elementDataEl.getAttribute("data-wpcf7-border-color").toString() : '');

        // Border width
        elementData.wpcf7_data.border_width = (elementDataEl.getAttribute("data-wpcf7-border-width") ? elementDataEl.getAttribute("data-wpcf7-border-width").toString() : '');

        // Margins
        elementData.wpcf7_data.margin_top = (elementDataEl.getAttribute("data-wpcf7-margin-top") ? elementDataEl.getAttribute("data-wpcf7-margin-top").toString() : '');
        elementData.wpcf7_data.margin_left = (elementDataEl.getAttribute("data-wpcf7-margin-left") ? elementDataEl.getAttribute("data-wpcf7-margin-left").toString() : '');
        elementData.wpcf7_data.margin_right = (elementDataEl.getAttribute("data-wpcf7-margin-right") ? elementDataEl.getAttribute("data-wpcf7-margin-right").toString() : '');
        elementData.wpcf7_data.margin_bottom = (elementDataEl.getAttribute("data-wpcf7-margin-bottom") ? elementDataEl.getAttribute("data-wpcf7-margin-bottom").toString() : '');

        // Columns padding
        elementData.wpcf7_data.columns.padding_top = (elementDataEl.getAttribute("data-wpcf7-columns-padding-top") ? elementDataEl.getAttribute("data-wpcf7-columns-padding-top").toString() : '');
        elementData.wpcf7_data.columns.padding_left = (elementDataEl.getAttribute("data-wpcf7-columns-padding-left") ? elementDataEl.getAttribute("data-wpcf7-columns-padding-left").toString() : '');
        elementData.wpcf7_data.columns.padding_right = (elementDataEl.getAttribute("data-wpcf7-columns-padding-right") ? elementDataEl.getAttribute("data-wpcf7-columns-padding-right").toString() : '');
        elementData.wpcf7_data.columns.padding_bottom = (elementDataEl.getAttribute("data-wpcf7-columns-padding-bottom") ? elementDataEl.getAttribute("data-wpcf7-columns-padding-bottom").toString() : '');

        /* WPCF7 CONTENT */
        // Content width
        elementData.wpcf7_data.content.width = (elementDataEl.getAttribute("data-wpcf7-content-width") ? elementDataEl.getAttribute("data-wpcf7-content-width").toString() : "");

        // Content height
        elementData.wpcf7_data.content.height = (elementDataEl.getAttribute("data-wpcf7-content-height") ? elementDataEl.getAttribute("data-wpcf7-content-height").toString() : "");

        // Content font size
        elementData.wpcf7_data.content.font_size = (elementDataEl.getAttribute("data-wpcf7-content-font-size") ? elementDataEl.getAttribute("data-wpcf7-content-font-size").toString() : "");

        // Content border width
        elementData.wpcf7_data.content.border_width = (elementDataEl.getAttribute("data-wpcf7-content-border-width") ? elementDataEl.getAttribute("data-wpcf7-content-border-width").toString() : "");

        // Content text color
        elementData.wpcf7_data.content.text_color = (elementDataEl.getAttribute("data-wpcf7-content-text-color") ? elementDataEl.getAttribute("data-wpcf7-content-text-color").toString() : '');

        // Content background color
        elementData.wpcf7_data.content.background_color = (elementDataEl.getAttribute("data-wpcf7-content-background-color") ? elementDataEl.getAttribute("data-wpcf7-content-background-color").toString() : '');

        // Content border color
        elementData.wpcf7_data.content.border_color = (elementDataEl.getAttribute("data-wpcf7-content-border-color") ? elementDataEl.getAttribute("data-wpcf7-content-border-color").toString() : '');

        // Content text color hover
        elementData.wpcf7_data.content.text_color_hover = (elementDataEl.getAttribute("data-wpcf7-content-text-color-hover") ? elementDataEl.getAttribute("data-wpcf7-content-text-color-hover").toString() : '');

        // Content background color hover
        elementData.wpcf7_data.content.background_color_hover = (elementDataEl.getAttribute("data-wpcf7-content-background-color-hover") ? elementDataEl.getAttribute("data-wpcf7-content-background-color-hover").toString() : '');

        // Content border color hover
        elementData.wpcf7_data.content.border_color_hover = (elementDataEl.getAttribute("data-wpcf7-content-border-color-hover") ? elementDataEl.getAttribute("data-wpcf7-content-border-color-hover").toString() : '');

        var data = {
            elementInfo: elementData,
            separateElement: separate
        }

        return data;
    }

    var _removeModelData = function ($elementWrapper) {
        var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
        // $elementData.removeAttr("data-text-color");
        // $elementData.removeAttr("data-text-size");
        $elementData.removeAttr("data-background-color");
        // $elementData.removeAttr("data-background-color-hover");
        // $elementData.removeAttr("data-border-color-hover");
        // $elementData.removeAttr("data-text-color-hover");
        // $elementData.removeAttr("data-border-width");
        // $elementData.removeAttr("data-border-color");
        // $elementData.removeAttr("data-border-radius");
        // $elementData.removeAttr("data-button-height");
        // $elementData.removeAttr("data-button-width");
        // $elementData.removeAttr("data-margin-top");
        // $elementData.removeAttr("data-margin-bottom");
        // $elementData.removeAttr("data-margin-left");
        // $elementData.removeAttr("data-margin-right");
        // $elementData.removeAttr("data-padding-top");
        // $elementData.removeAttr("data-padding-bottom");
        // $elementData.removeAttr("data-padding-left");
        // $elementData.removeAttr("data-padding-right");
        // $elementData.removeAttr("data-button-name");
    }

    var _addElementStyle = function ($elementWrapper) {
        if ($elementWrapper.find(".rex-element-data").eq(0).length != 0) {
            var elementData = _generateElementData($elementWrapper, true);
            var elementID = elementData.elementInfo.element_target.element_id;
            // _addCSSRules(elementID, elementData.elementInfo);
            Rexbuilder_Rexwpcf7.addFormStyle($elementWrapper.find(".wpcf7-form"));
        }
        $elementWrapper.find(".wpcf7-column").each(function(){
            Rexbuilder_Rexwpcf7.addColumnContentStyle($(this));
        })
    }

    var _addCSSRules = function (elementID, elementData) {
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        var backgroundRule = "";
        backgroundRule += "background-color: " + elementData.background_color + ";";
        _addElementBackgroundRule(elementID, backgroundRule);
    }

    var _updateElement = function (data) {
        var elementProperties = data.elementProperties;
        var elementID = elementProperties.element_target.element_id;
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        _updateElementBackgroundRule(elementID, "background-color", elementProperties.background_color);

        // If editing a separate element, will always be length = 1
        // If editing a model element, will be length >= 1
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]");
        _updateElementsData($elementWrappers, elementProperties);
    }

    var _updateElementLive = function (data) {
        switch (data.propertyType) {
            case "background":
                _updateElementBackgroundRule(data.element_target.element_id, data.propertyName, data.newValue);
                break;
            default:
                break;
        }
    }

    var _removeElementStyle = function (elementID) {
        // _removeElementContainerRule(elementID);
        _removeElementBackgroundRule(elementID);
        // _removeElementBackgroundHoverRule(elementID);
        // _removeElementTextRule(elementID);
        // _removeElementContainerHoverRule(elementID);
    }

    var _removeSeparateElement = function (data) {
        var elementID = data.element_target.element_id;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]");
        $elementWrapper.removeClass("rex-separate-element");
        _removeModelData($elementWrapper);
    }

    var _lockSynchronize = function (data) {
        var elementID = data.element_target.element_id;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"][data-rex-element-number=\"" + data.element_target.element_number + "\"]");
        $elementWrapper.find(".rex-element-data").attr("data-synchronize", true);
    }

    var _linkDocumentListeners = function () {
	    Rexbuilder_Util.$document.on("rexlive:completeImportElement", function (e) {
	        var data = e.settings;
	        var $newDOMElement = data.$elementAdded;
	        var $elementWrapper = data.$elementWrapper;
	        $elementWrapper.detach().prependTo($newDOMElement.find(".text-wrap").eq(0));
	        $elementWrapper.wrap("<span class=\"rex-elements-paragraph\"></span>");
	        _endFixingElementImported($elementWrapper);
	    });
    }

	var init = function() {
        styleSheet = null;
        elementsInPage = [];
        // Qua ci andranno i valori di default degli stili che verranno scelti
        defaultElementValues = {
            // Prova
            input: {
                text: {
                    background_color: "",
                }
            }
        };
        this.$rexelementsStyle = $("#rexpansive-builder-rexelement-style-inline-css");

        _fixCustomStyleElement();
        _updateElementListInPage();
        _addStyles();
        _fixWpcf7();
		_linkDocumentListeners();
	}

	return {
		init: init,

        // CSS Rules Editing
        generateElementData: _generateElementData,

        // Rexelement functions
		fixImportedElement: _fixImportedElement,
        getElementsInPage: _getElementsInPage,
        lockSynchronize: _lockSynchronize,
        separateRexElement: _separateRexElement,
        refreshRexElement: _refreshRexElement,
        refreshSeparatedRexElement: _refreshSeparatedRexElement,
        updateElement: _updateElement,
        updateElementLive: _updateElementLive,
        removeSeparateElement: _removeSeparateElement
	}
})(jQuery);