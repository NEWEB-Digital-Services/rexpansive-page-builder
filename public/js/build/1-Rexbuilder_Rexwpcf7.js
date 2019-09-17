var Rexbuilder_Rexwpcf7 = (function ($) {
	"use strict";

	var styleSheet;
	var defaultFormValues;

    /**
     * Add the new field shortcode in the DOM
     * @param data
     */
    var _addField = function(data) {
        var insertionPoint = data.insertionPoint;
        var formID = insertionPoint.formID;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]");

        var $insertionPoint = $elementWrapper.find(".wpcf7-row[wpcf7-row-number=\"" + insertionPoint.row_number + "\"]").find(".wpcf7-column[wpcf7-column-number=\"" + insertionPoint.column_number + "\"]");

        var fieldType = data.fieldType;
        var fieldShortcode;

        // Selecting the field
        switch(fieldType) {
            case "text":
                fieldShortcode = "[text text-" + Rexbuilder_Util.createRandomNumericID(3) + "]";
                break;
            case "textarea":
                fieldShortcode = "[textarea textarea-" + Rexbuilder_Util.createRandomNumericID(3) + "]";
                break;
            case "menu":
                fieldShortcode = "[select menu-" + Rexbuilder_Util.createRandomNumericID(3) + " include_blank 'Field 1' 'Field 2']";
                break;
            case "radiobuttons":
                fieldShortcode = "[radio radio-" + Rexbuilder_Util.createRandomNumericID(3) + "  default:1 \"Option 1\" \"Option 2\"]";
                break;
            case "date":
                fieldShortcode = "[date date-" + Rexbuilder_Util.createRandomNumericID(3) + "]";
                break;
            case "checkboxes":
                fieldShortcode = "[checkbox checkbox-" + Rexbuilder_Util.createRandomNumericID(3) + " \"Option 1\" \"Option 2\"]";
                break;
            case "acceptance":
                fieldShortcode = "[acceptance acceptance-" + Rexbuilder_Util.createRandomNumericID(3) + " optional] Acceptance text [/acceptance]";
                break;
            case "submit":
                fieldShortcode = "[submit]";
                break;
        }

        $insertionPoint.empty();
        $insertionPoint.append(fieldShortcode);

        var $formToSave = $elementWrapper.find(".wpcf7-form");
        
        _saveChanges($formToSave, insertionPoint.row_number, insertionPoint.column_number, true);
    }

    var _saveChanges = function($formToSave, rowToSave, columnToSave, needToRefresh) {
        var formID = $formToSave.parents(".rex-element-wrapper").attr("data-rex-element-id");
        var $toSave = $formToSave.find(".wpcf7-row[wpcf7-row-number='" + rowToSave + "']").find(".wpcf7-column[wpcf7-column-number='" + columnToSave + "']").clone();

        $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rex_wpcf7_get_form",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
              form_id: formID
            },
            success: function(response) {
              if (response.success) {
                var $formRowsInDB = $(response.data.html_form.toString());

                // Clearing the linefeeds
                // $formRowsInDB = $formRowsInDB.filter(function (){
                //   return !("undefined" == typeof this.outerHTML);
                // });

                $formRowsInDB.each(function() {
                    if($(this).attr("wpcf7-row-number") == rowToSave) {
                        $(this).find(".wpcf7-column[wpcf7-column-number='" + columnToSave + "']").replaceWith($toSave);
                        return false;
                    }
                });

                _saveDBChanges($formRowsInDB, formID, needToRefresh);
              }
            },
            error: function(response) {}
        });
    }

    var _saveDBChanges = function ($formRowsToSave, formID, needToRefresh) {
      var formRowsToSaveString = "";

      $formRowsToSave.each(function(){
        formRowsToSaveString += this.outerHTML;
      });

      $.ajax({
        type: "POST",
        dataType: "json",
        url: _plugin_frontend_settings.rexajax.ajaxurl,
        data: {
          action: "rex_wpcf7_save_changes",
          nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
          form_id: formID,
          new_form_string: formRowsToSaveString
        },
        success: function(response) {
          if (response.success) {
            formRowsToSaveString = "";
            if (needToRefresh) {
            	Rexbuilder_Rexelement.refreshRexElement(formID);
            }
          }
        },
        error: function(response) {}
      });
    }

	/////////////////////////////////////////////////////////////////////////////////////////////////
	/// CSS FUNCTIONS
	/////////////////////////////////////////////////////////////////////////////////////////////////

	var _fixCustomStyleForm = function () {
        if (Rexbuilder_Rexwpcf7.$rexformsStyle.length == 0) {
            var css = "",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");

            style.type = "text/css";
            style.id = "rexpansive-builder-rexwpcf7-style-inline-css";
            style.dataset.rexName = "rexwpcf7-style";
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].ownerNode.id == "rexpansive-builder-rexwpcf7-style-inline-css") {
                styleSheet = document.styleSheets[i];
            }
        }
	}

	var _getActiveStyleSheet = function () {
        return styleSheet;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Adding rules

    // Background is changed to the column content, not to the whole column
    var _addColumnContentBackgroundRule = function (formID, row, column, contentType, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + "{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + "{" + property + "}", styleSheet.cssRules.length);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Updating rules
    
    var _updateColumnContentBackgroundRule = function (formID, row, column, contentType, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + contentType
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
    
    var _removeColumnContentBackgroundRule = function (formID, row, column, contentType) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType) {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    var _createSpanData = function (data) {
    	var editPoint = data.editPoint;
    	var formID = editPoint.element_id;
    	var row_number = editPoint.row_number;
    	var column_number = editPoint.column_number;

    	var $formColumn = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

    	var $spanData = $(document.createElement("span"));
    	$spanData.addClass("rex-wpcf7-column-content-data");

    	$formColumn.prepend($spanData);

    	_addColumnContentStyle($formColumn);
    }

    var _removeSpanData = function (data) {
    	var editPoint = data.editPoint;
    	var formID = editPoint.element_id;
    	var row_number = editPoint.row_number;
    	var column_number = editPoint.column_number;

    	var $editPoint = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

    	$editPoint.find(".rex-wpcf7-column-content-data").remove();

    	_removeColumnContentStyle(formID, row_number, column_number);
    }

    var _addColumnContentStyle = function ($formColumn) {
        if ($formColumn.find(".rex-wpcf7-column-content-data").eq(0).length != 0) {
            var columnContentProperties = _generateColumnContentData($formColumn, true);
            var formID = columnContentProperties.target.element_id;
            _addCSSRules(formID, columnContentProperties);
        }
    }

    var _removeColumnContentStyle = function (formID, row_number, column_number) {
        // _removeColumnContentContainerRule(formID, row_number, column_number);
        _removeColumnContentBackgroundRule(formID, row_number, column_number);
        // _removeColumnContentBackgroundHoverRule(formID, row_number, column_number);
        // _removeColumnContentTextRule(formID, row_number, column_number);
        // _removeColumnContentContainerHoverRule(formID, row_number, column_number);
    }

    var _updateColumnContentLive = function (data) {
    	var formID = data.target.element_id;
    	var row = data.target.row_number;
    	var column = data.target.column_number;
    	var contentType = data.content.type;

        switch (data.propertyType) {
            // case "text":
            //     _updateButtonTextRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            // case "container":
            //     _updateButtonContainerRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            case "background":
                _updateColumnContentBackgroundRule(formID, row, column, contentType, data.propertyName, data.newValue);
                break;
            // case "backgroundHover":
            // case "borderHover":
            //     _updateButtonBackgroundHoverRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            // case "textHover":
            //     _updateContainerHoverRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            // case "button":
            //     var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + data.buttonTarget.button_id + "\"][data-rex-button-number=\"" + data.buttonTarget.button_number + "\"]");
            //     switch (data.propertyName) {
            //         case "link_target":
            //             $elementWrapper.find("a.rex-button-container").eq(0).attr("href", data.newValue);
            //             break;
            //         case "link_type":
            //             $elementWrapper.find("a.rex-button-container").eq(0).attr("target", data.newValue);
            //             break;
            //         case "button_label":
            //             $elementWrapper.find(".rex-button-text").eq(0).text(data.newValue);
            //             break;
            //         case "button_name":
            //             $elementWrapper.find(".rex-button-data").eq(0).attr("data-button-name", data.newValue);
            //             break;
            //         default:
            //             break;
            //     }
            //     break;
            default:
                break;
        }
    }

    /**
     * Generate column content data form span element in the DOM.
     * 
     * The obtained object has 1 field:
     * columnContentProperties - properties of the column content
     * 
     * @returns {Object} data
     */
    var _generateColumnContentData = function ($formColumn, spanDataExists) {
        var columnContentProperties = {
            // Da aggiornare
            
            // text_color: "",
            // text: "",
            // font_size: "",
            background_color: "",
            // button_height: "",
            // button_width: "",
            // hover_color: "",
            // hover_border: "",
            // hover_text: "",
            // border_color: "",
            // border_width: "",
            // border_radius: "",
            // margin_top: "",
            // margin_bottom: "",
            // margin_right: "",
            // margin_left: "",
            // padding_top: "",
            // padding_bottom: "",
            // padding_right: "",
            // padding_left: "",
            // link_target: "",
            // link_type: "",
            target: {
                element_id: "",
                row_number: "",
                column_number: "",
            },
            content: {
            	type: "",
            }
        };

        columnContentProperties.target.element_id = $formColumn.parents(".rex-element-wrapper").attr("data-rex-element-id");
        columnContentProperties.target.row_number = $formColumn.parents(".wpcf7-row").attr("wpcf7-row-number");
        columnContentProperties.target.column_number = $formColumn.attr("wpcf7-column-number");
        columnContentProperties.content.type = $formColumn.find(".wpcf7-form-control").prop("nodeName").toLowerCase();

        if (spanDataExists) {
        	var $columnContentData = $formColumn.find(".rex-wpcf7-column-content-data").eq(0);
        	var columnContentDataEl = $columnContentData[0];

        	// Da aggiornare quando si sapranno le proprietà
        	columnContentProperties.background_color = (columnContentDataEl.getAttribute("data-background-color") ? columnContentDataEl.getAttribute("data-background-color").toString() : '');
        }

        var data = columnContentProperties;

        return data;
    }

    // Da aggiornare quando si sapranno le proprietà
    var _addCSSRules = function (formID, columnContentProperties) {
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        var containerRule = "";

        var row = columnContentProperties.target.row_number;
        var column = columnContentProperties.target.column_number;
        var contentType = columnContentProperties.content.type;

        // containerRule += "color: " + columnContentProperties.text_color + ";";

        // checking font size, if value is not valid default font size will be applied
        // currentTextSize = isNaN(parseInt(columnContentProperties.font_size.replace("px", ""))) ? defaultButtonValues.font_size : columnContentProperties.font_size;
        // containerRule += "font-size: " + currentTextSize + ";";

        // checking button dimensions, if value is not valid default dimensions will be applied
        // currentDimension = isNaN(parseInt(columnContentProperties.button_height.replace("px", ""))) ? defaultButtonValues.dimensions.height : columnContentProperties.button_height;
        // containerRule += "min-height: " + currentDimension + ";";
        // currentDimension = isNaN(parseInt(columnContentProperties.button_width.replace("px", ""))) ? defaultButtonValues.dimensions.width : columnContentProperties.button_width;
        // containerRule += "min-width: " + currentDimension + ";";

        // checking margins, if they are not valid default value will be applied
        // currentMargin = isNaN(parseInt(columnContentProperties.margin_top.replace("px", ""))) ? defaultButtonValues.margins.top : columnContentProperties.margin_top;
        // containerRule += "margin-top: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentProperties.margin_right.replace("px", ""))) ? defaultButtonValues.margins.right : columnContentProperties.margin_right;
        // containerRule += "margin-right: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentProperties.margin_bottom.replace("px", ""))) ? defaultButtonValues.margins.bottom : columnContentProperties.margin_bottom;
        // containerRule += "margin-bottom: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentProperties.margin_left.replace("px", ""))) ? defaultButtonValues.margins.left : columnContentProperties.margin_left;
        // containerRule += "margin-left: " + currentMargin + ";";

        // _addElementContainerRule(elementID, containerRule);

        var backgroundRule = "";
        // backgroundRule += "border-color: " + columnContentProperties.border_color + ";";
        // backgroundRule += "border-style: " + "solid" + ";";

        // checking border dimensions, if they are not valid default value will be applied
        // currentBorderDimension = isNaN(parseInt(columnContentProperties.border_width.replace("px", ""))) ? defaultButtonValues.border.width : columnContentProperties.border_width;
        // backgroundRule += "border-width: " + currentBorderDimension + ";";
        // currentBorderDimension = isNaN(parseInt(columnContentProperties.border_radius.replace("px", ""))) ? defaultButtonValues.border.radius : columnContentProperties.border_radius;
        // backgroundRule += "border-radius: " + currentBorderDimension + ";";

        backgroundRule += "background-color: " + columnContentProperties.background_color + ";";
        // _addElementContainerRule(elementID, backgroundRule);
        _addColumnContentBackgroundRule(formID, row, column, contentType, backgroundRule);

        var textRule = "";
        // checking paddings, if they are not valid default value will be applied
        // currentPadding = isNaN(parseInt(columnContentProperties.padding_top.replace("px", ""))) ? defaultButtonValues.paddings.top : columnContentProperties.padding_top;
        // textRule += "padding-top: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentProperties.padding_right.replace("px", ""))) ? defaultButtonValues.paddings.right : columnContentProperties.padding_right;
        // textRule += "padding-right: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentProperties.padding_bottom.replace("px", ""))) ? defaultButtonValues.paddings.bottom : columnContentProperties.padding_bottom;
        // textRule += "padding-bottom: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentProperties.padding_left.replace("px", ""))) ? defaultButtonValues.paddings.left : columnContentProperties.padding_left;
        // textRule += "padding-left: " + currentPadding + ";";
        // _addElementTextRule(elementID, textRule);

        var backgroundHoverRule = "";
        // backgroundHoverRule += "background-color: " + columnContentProperties.hover_color + ";";
        // backgroundHoverRule += "border-color: " + columnContentProperties.hover_border + ";";
        // _addElementBackgroundHoverRule(elementID, backgroundHoverRule);

        var containerHoverRule = "";
        // containerHoverRule += "color: " + columnContentProperties.hover_text + ";";
        // _addElementContainerHoverRule(elementID, containerHoverRule);
    }

    var _updateColumnContent = function (data) {
        var columnContentProperties = data.columnContentProperties;
        var formID = columnContentProperties.target.element_id;
        var row = columnContentProperties.target.row_number;
        var column = columnContentProperties.target.column_number;
        var contentType = columnContentProperties.content.type;
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        _updateColumnContentBackgroundRule(formID, row, column, contentType, "background-color", columnContentProperties.background_color);

        // If editing a separate element, will always be length = 1
        // If editing a model element, will be length >= 1
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]");
        _updateElementsData($elementWrappers, columnContentProperties);
    }

    /**
     * Updates multiple elements data.
     * @param  {jQuery} $elementWrappers
     * @param  {Array} columnContentProperties Data to update
     * @return {null}
     */
    var _updateElementsData = function ($elementWrappers, columnContentProperties) {
    	var row = columnContentProperties.target.row_number;
        var column = columnContentProperties.target.column_number;

        $elementWrappers.each(function() {
            var $columnData = $(this).find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"]").find(".wpcf7-column[wpcf7-column-number=\"" + column + "\"]").find(".rex-wpcf7-column-content-data").eq(0);
            $columnData.attr("data-background-color", columnContentProperties.background_color);

            var $formToSave = $(this).find(".wpcf7-form");
            _saveChanges($formToSave, row, column, false);
        })
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// REXWPCF7 GENERIC FUNCTIONS
    /////////////////////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////

	var _init = function () {
		styleSheet = null;
		// Qua ci andranno i valori di default degli stili che verranno scelti
        defaultFormValues = {
            // Prova
            input: {
                text: {
                    background_color: "",
                }
            }
        };
        this.$rexformsStyle = $("#rexpansive-builder-rexwpcf7-style-inline-css");

        _fixCustomStyleForm();
	}

	return {
		init: _init,

		addField: _addField,

		// CSS functions
		addColumnContentStyle: _addColumnContentStyle,

		// Rexwpcf7 generic functions
		createSpanData: _createSpanData,
		removeSpanData: _removeSpanData,
		generateColumnContentData: _generateColumnContentData,
		updateColumnContentLive: _updateColumnContentLive,
		updateColumnContent: _updateColumnContent,
	}
})(jQuery);