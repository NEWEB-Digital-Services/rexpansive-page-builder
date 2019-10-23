var Rexbuilder_Rexwpcf7 = (function ($) {
	"use strict";

	var styleSheet;
	var defaultFormValues;
    var defaultColumnContentValues;

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// REXWPCF7 GENERIC FUNCTIONS
    /////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Add the new field shortcode in the DOM
     * @param data
     */
    var _addField = function(data) {
        var insertionPoint = data.insertionPoint;
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
        
        _saveNewField(insertionPoint, fieldShortcode);
    }

    var _addNewRow = function (formID, columnsSelected) {
        var $formToAddRow = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-form");
        var $newRow = $(document.createElement("div"));
        var newRowNumber = parseInt($formToAddRow.find(".wpcf7-row").last().attr("wpcf7-row-number")) + 1;

        switch (columnsSelected) {
            case 1:
                $newRow.addClass("wpcf7-row wpcf7-row__1-column");
                break;
            case 2:
                $newRow.addClass("wpcf7-row wpcf7-row__2-columns");
                break;
            case 3:
                $newRow.addClass("wpcf7-row wpcf7-row__3-columns");
                break;
            case 4:
                $newRow.addClass("wpcf7-row wpcf7-row__4-columns");
                break;
        }

        $newRow.attr("wpcf7-row-number", newRowNumber);

        var $columnsToInsert = [];

        for(var i = 0; i < columnsSelected; i++) {
            $columnsToInsert[i] = $(document.createElement("div"));
            $columnsToInsert[i].addClass("wpcf7-column");
            $columnsToInsert[i].attr("wpcf7-column-number", (i+1));

            // Creating the + buttons for adding content
            var plusButton = tmpl("tmpl-plus-button-inside-wpcf7-row", {});
            $columnsToInsert[i].append(plusButton);

            $newRow.append($columnsToInsert[i]);
        }

        $formToAddRow.each(function() {
            var $newRowClone = $newRow.clone();
            $(this).find(".wpcf7-rows").append($newRowClone);
        })

        _saveNewRow(formID, $newRow);
    }

    /**
     * Adds a new row in the form specified by the form ID.
     * @param formID
     * @param $rowToAdd   Row that has to be added
     * @param numberRowBefore
     */
    var _addRow = function (formID, $rowToAdd, numberRowBefore) {
        var $formToAddRow = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-form");
        var $rowBefore = $formToAddRow.find(".wpcf7-row[wpcf7-row-number=\"" + numberRowBefore + "\"]");

        $rowToAdd.insertAfter($rowBefore);

        _fixRowNumbers($formToAddRow);
        _saveAddedRow(formID, numberRowBefore);
    }

    var _addClonedColumnRow = function (formID, clonedColumnNumber, numberRowBefore) {
        var $formToAddRow = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-form"); // There may be more than 1 form
        var $rowBefore = $formToAddRow.find(".wpcf7-row[wpcf7-row-number=\"" + numberRowBefore + "\"]");
        var $rowToAdd = $($rowBefore[0]).clone();
        
        $rowToAdd.insertAfter($rowBefore);  // Inserting the new row in the form
        _fixRowNumbers($formToAddRow);      // After this function row numbers are now correct

        var newRowNumber = numberRowBefore + 1;
        var $rowAdded = $formToAddRow.find(".wpcf7-row[wpcf7-row-number=\"" + newRowNumber + "\"]"); // Need to declare this after _fixRowNumbers

        $rowAdded.each(function () {    // There may be more than 1 row (multiple forms)
            $(this).find(".wpcf7-column").each(function (index) {
                if((index + 1) != clonedColumnNumber) {
                    $(this).empty();

                    var $plusButton = tmpl("tmpl-plus-button-inside-wpcf7-row", {});
                    $(this).append($plusButton);
                }
            });
        })

        _saveClonedColumnRow(formID, clonedColumnNumber, numberRowBefore);
    }

    var _deleteRow = function (formID, rowNumberToDelete) {
        var $formToDeleteRow = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-form"); // There may be more than 1 form
        var $rowToDelete = $formToDeleteRow.find(".wpcf7-row[wpcf7-row-number=\"" + rowNumberToDelete + "\"]");

        $rowToDelete.remove();

        _fixRowNumbers($formToDeleteRow);
        _saveDeletingRow(formID, rowNumberToDelete);
    }

    var _deleteColumnContent = function (formID, rowNumberToDelete, columnNumberToDelete) {
        var $formToDeleteColumn = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-form"); // There may be more than 1 form
        var $columnToDelete = $formToDeleteColumn.find(".wpcf7-row[wpcf7-row-number=\"" + rowNumberToDelete + "\"] .wpcf7-column[wpcf7-column-number=\"" + columnNumberToDelete + "\"]");

        $columnToDelete.empty();
        var $plusButton = tmpl("tmpl-plus-button-inside-wpcf7-row", {});
        $columnToDelete.append($plusButton);

        _saveDeletingColumnContent(formID, rowNumberToDelete, columnNumberToDelete);
    }

    var _fixRowNumbers = function ($forms) {
        $forms.each(function() {
            $(this).find(".wpcf7-row").each(function(index){
                $(this).attr("wpcf7-row-number", index + 1);
            });
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// SAVING FUNCTIONS
    //////////////////////////////////////////////////////////////////////////////////////////////// 

    var _saveNewField = function (insertionPoint, fieldShortcode) {
        var formID = insertionPoint.formID;
        var row = insertionPoint.row_number;
        var column = insertionPoint.column_number;

        var $columnToUpdate = $formsInPage[formID].find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"]");

        $columnToUpdate.empty();
        $columnToUpdate.append(fieldShortcode);

        _updateFormInDB(formID);
    }

    var _saveNewRow = function (formID, $newRow) {
        var $formToAddRow = $formsInPage[formID];
        var $lastRow = $formToAddRow.find(".wpcf7-row").last();

        $newRow.insertAfter($lastRow);

        _updateFormInDB(formID);
    }

    var _saveAddedRow = function (formID, rowNumber) {
        var $formToAddRow = $formsInPage[formID];
        var $rowBefore = $formToAddRow.find(".wpcf7-row[wpcf7-row-number=\"" + rowNumber + "\"]");
        var $rowToAdd = $rowBefore.clone();

        $rowToAdd.insertAfter($rowBefore);
        _fixRowNumbers($formToAddRow);
        _updateFormInDB(formID);
    }

    var _saveClonedColumnRow = function (formID, clonedColumnNumber, numberRowBefore) {
        var $formToAddRow = $formsInPage[formID];

        var $rowBefore = $formToAddRow.find(".wpcf7-row[wpcf7-row-number=\"" + numberRowBefore + "\"]");
        var $rowToAdd = $rowBefore.clone();
        
        $rowToAdd.insertAfter($rowBefore);  // Inserting the new row in the form
        _fixRowNumbers($formToAddRow);      // After this function row numbers are now correct

        var newRowNumber = numberRowBefore + 1;
        var $rowAdded = $formToAddRow.find(".wpcf7-row[wpcf7-row-number=\"" + newRowNumber + "\"]"); // Need to declare this after _fixRowNumbers

        $rowAdded.find(".wpcf7-column").each(function (index) {
            if((index + 1) != clonedColumnNumber) {
                $(this).empty();

                var $plusButton = tmpl("tmpl-plus-button-inside-wpcf7-row", {});
                $(this).append($plusButton);
            }
        });

        _updateFormInDB(formID);
    }

    var _saveDeletingRow = function (formID, rowNumberToDelete) {
        var $formToDeleteRow = $formsInPage[formID];
        var $rowToDelete = $formToDeleteRow.find(".wpcf7-row[wpcf7-row-number=\"" + rowNumberToDelete + "\"]");

        $rowToDelete.remove();

        _fixRowNumbers($formToDeleteRow);
        _updateFormInDB(formID);
    }

    var _saveDeletingColumnContent = function (formID, rowNumberToDelete, columnNumberToDelete) {
        var $formToDeleteColumn = $formsInPage[formID];
        var $columnToDelete = $formToDeleteColumn.find(".wpcf7-row[wpcf7-row-number=\"" + rowNumberToDelete + "\"]").find(".wpcf7-column[wpcf7-column-number=\"" + columnNumberToDelete + "\"]");

        $columnToDelete.empty();
        var $plusButton = tmpl("tmpl-plus-button-inside-wpcf7-row", {});
        $columnToDelete.append($plusButton);

        _updateFormInDB(formID);
    }

    var _updateFormInDB = function (formID) {
        var formToUpdateString = $formsInPage[formID][0].outerHTML; // Don't need to get the form in db before, already have it
        $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rex_wpcf7_save_changes",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
              form_id: formID,
              new_form_string: formToUpdateString
            },
            success: function(response) {
              if (response.success) {
                formToUpdateString = "";
                Rexbuilder_Rexelement.refreshRexElement(formID);
              }
            },
            error: function(response) {}
        });
    }

	/////////////////////////////////////////////////////////////////////////////////////////////////
	/// CSS FUNCTIONS
	/////////////////////////////////////////////////////////////////////////////////////////////////
	
	var formContentTypes = [
		"input",
		"textarea",
		"select",
		"range"
	];

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
    
    var _addFormRule = function (formID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form" + "{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form" + "{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addFormInputsRule = function (formID, property) {
        var contentType;
    	for (contentType of formContentTypes) {
    		if ("insertRule" in styleSheet) {
	            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form " + contentType + "{" + property + "}", styleSheet.cssRules.length);
	        }
	        else if ("addRule" in styleSheet) {
	            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form " + contentType + "{" + property + "}", styleSheet.cssRules.length);
	        }
    	}
    }

    // Style is changed to the column content, not to the whole column
    var _addColumnContentRule = function (formID, row, column, contentType, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + "{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + "{" + property + "}", styleSheet.cssRules.length);
        }
    }

    // Style is changed to the column content, not to the whole column
    var _addColumnContentFocusRule = function (formID, row, column, contentType, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + ":focus{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + ":focus{" + property + "}", styleSheet.cssRules.length);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Updating rules
    
    var _updateFormRule = function (formID, rule, value) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper .wpcf7-form"
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

    var _updateFormInputsRule = function (formID, rule, value) {
        var contentType;
        for (contentType of formContentTypes) {
            for (var i = 0; i < styleSheet.cssRules.length; i++) {
                if (
                    //chrome firefox
                    styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form " + contentType ||
                    // edge
                    styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper .wpcf7-form " + contentType
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
    }

    // Style is changed to the column content, not to the whole column
    var _updateColumnContentRule = function (formID, row, column, contentType, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + contentType
            ) {
                switch (rule) {
                    case "width":
                        styleSheet.cssRules[i].style.width = value;
                        break;
                    case "height":
                        styleSheet.cssRules[i].style.height = value;
                        break;
                    case "text-color":
                        styleSheet.cssRules[i].style.color = value;
                        break;
                    case "font-size":
                        styleSheet.cssRules[i].style.fontSize = value;
                        break;
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

    // Style is changed to the column content, not to the whole column
    var _updateColumnContentFocusRule = function (formID, row, column, contentType, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + ":focus" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + contentType + ":focus"
            ) {
                switch (rule) {
                    case "text-color":
                        styleSheet.cssRules[i].style.color = value;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Removing rules
    
    var _removeFormRule = function (formID) {
        var contentType;
    	for (contentType of formContentTypes) {
    		for (var i = 0; i < styleSheet.cssRules.length; i++) {
	            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form") {
	                styleSheet.deleteRule(i);
	                break;
	            }
	        }
    	}
    }

    var _removeFormInputsRule = function (formID) {
        var contentType;
        for (contentType of formContentTypes) {
            for (var i = 0; i < styleSheet.cssRules.length; i++) {
                if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form " + contentType) {
                    styleSheet.deleteRule(i);
                    break;
                }
            }
        }
    }

    var _removeColumnContentRule = function (formID, row, column, contentType) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType) {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Form functions

    var _addFormStyle = function ($form) {
        if ($form.find(".rex-wpcf7-form-data").eq(0).length != 0) {
            var formData = _generateFormData($form);
            var formID = formData.target.form_id;
            _addFormCSSRules(formID, formData);
            _addFormInputsCSSRules(formID, formData);
        }
    }

    // If there will be more rules, they will have to be removed here
    var _removeFormStyle = function (formID) {
        _removeFormRule(formID);
        _removeFormInputsRule(formID);
    }

    // Da aggiornare quando si sapranno le proprietà
    var _addFormCSSRules = function (formID, formData) {
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";
        var containerRule = "";

        // containerRule += "color: " + columnContentData.text_color + ";";

        // checking font size, if value is not valid default font size will be applied
        // currentTextSize = isNaN(parseInt(columnContentData.font_size.replace("px", ""))) ? defaultButtonValues.font_size : columnContentData.font_size;
        // containerRule += "font-size: " + currentTextSize + ";";

        // checking button dimensions, if value is not valid default dimensions will be applied
        // currentDimension = isNaN(parseInt(columnContentData.button_height.replace("px", ""))) ? defaultButtonValues.dimensions.height : columnContentData.button_height;
        // containerRule += "min-height: " + currentDimension + ";";
        // currentDimension = isNaN(parseInt(columnContentData.button_width.replace("px", ""))) ? defaultButtonValues.dimensions.width : columnContentData.button_width;
        // containerRule += "min-width: " + currentDimension + ";";

        // checking margins, if they are not valid default value will be applied
        // currentMargin = isNaN(parseInt(columnContentData.margin_top.replace("px", ""))) ? defaultButtonValues.margins.top : columnContentData.margin_top;
        // containerRule += "margin-top: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentData.margin_right.replace("px", ""))) ? defaultButtonValues.margins.right : columnContentData.margin_right;
        // containerRule += "margin-right: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentData.margin_bottom.replace("px", ""))) ? defaultButtonValues.margins.bottom : columnContentData.margin_bottom;
        // containerRule += "margin-bottom: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentData.margin_left.replace("px", ""))) ? defaultButtonValues.margins.left : columnContentData.margin_left;
        // containerRule += "margin-left: " + currentMargin + ";";

        // _addElementContainerRule(elementID, containerRule);

        var backgroundRule = "";
        // backgroundRule += "border-color: " + columnContentData.border_color + ";";
        // backgroundRule += "border-style: " + "solid" + ";";

        // checking border dimensions, if they are not valid default value will be applied
        // currentBorderDimension = isNaN(parseInt(columnContentData.border_width.replace("px", ""))) ? defaultButtonValues.border.width : columnContentData.border_width;
        // backgroundRule += "border-width: " + currentBorderDimension + ";";
        // currentBorderDimension = isNaN(parseInt(columnContentData.border_radius.replace("px", ""))) ? defaultButtonValues.border.radius : columnContentData.border_radius;
        // backgroundRule += "border-radius: " + currentBorderDimension + ";";

        backgroundRule += "background-color: " + formData.background_color + ";";
        // _addElementContainerRule(elementID, backgroundRule);
        _addFormRule(formID, backgroundRule);

        var textRule = "";
        // checking paddings, if they are not valid default value will be applied
        // currentPadding = isNaN(parseInt(columnContentData.padding_top.replace("px", ""))) ? defaultButtonValues.paddings.top : columnContentData.padding_top;
        // textRule += "padding-top: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentData.padding_right.replace("px", ""))) ? defaultButtonValues.paddings.right : columnContentData.padding_right;
        // textRule += "padding-right: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentData.padding_bottom.replace("px", ""))) ? defaultButtonValues.paddings.bottom : columnContentData.padding_bottom;
        // textRule += "padding-bottom: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentData.padding_left.replace("px", ""))) ? defaultButtonValues.paddings.left : columnContentData.padding_left;
        // textRule += "padding-left: " + currentPadding + ";";
        // _addElementTextRule(elementID, textRule);

        var backgroundHoverRule = "";
        // backgroundHoverRule += "background-color: " + columnContentData.hover_color + ";";
        // backgroundHoverRule += "border-color: " + columnContentData.hover_border + ";";
        // _addElementBackgroundHoverRule(elementID, backgroundHoverRule);

        var containerHoverRule = "";
        // containerHoverRule += "color: " + columnContentData.hover_text + ";";
        // _addElementContainerHoverRule(elementID, containerHoverRule);
    }

    var _updateFormLive = function (data) {
        var formID = data.target.form_id;
        var propertyType = data.propertyType;
        var propertyName = data.propertyName;
        var newValue = data.newValue;

        switch (propertyType) {
            // case "text":
            //     _updateButtonTextRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            // case "container":
            //     _updateButtonContainerRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            case "background":
                _updateFormRule(formID, propertyName, newValue);
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
     * Generate form data form span element in the DOM.
     * 
     * @returns {Object} formData Properties of the form
     */
    var _generateFormData = function ($form) {
        var formData = {
            background_color: "",
            content: {
                background_color: "",
            },
            target: {
                form_id: "",
            },
        };

        formData.target.form_id = $form.parents(".rex-element-wrapper").attr("data-rex-element-id");

        var $formData = $form.find(".rex-wpcf7-form-data").eq(0);
        var formDataEl = $formData[0];

        // Da aggiornare quando si sapranno le proprietà
        // Whole form
        formData.background_color = (formDataEl.getAttribute("data-form-background-color") ? formDataEl.getAttribute("data-form-background-color").toString() : '');

        // Only content (inputs, selects, ecc...)
        formData.content.background_color = (formDataEl.getAttribute("data-content-background-color") ? formDataEl.getAttribute("data-content-background-color").toString() : '');

        return formData;
    }

    var _updateForm = function (data) {
        var formData = data.formData;
        var formID = formData.target.form_id;
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        _updateFormRule(formID, "background-color", formData.background_color);
        _updateFormInputsRule(formID, "background-color", formData.content.background_color);

        // If editing a separate element, will always be length = 1,
        // if editing a model element, will be length >= 1
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]");
        _updateFormsData($elementWrappers, formData);
    }

    /**
     * Updates multiple forms data.
     * @param  {jQuery} $elementWrappers
     * @param  {Array} formData Data to update
     * @return {null}
     */
    var _updateFormsData = function ($elementWrappers, formData) {
        $elementWrappers.each(function() {
            var $formData = $(this).find(".wpcf7").find(".rex-wpcf7-form-data").eq(0);

            $formData.attr("data-form-background-color", formData.background_color);
            $formData.attr("data-content-background-color", formData.content.background_color);
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Form inputs functions

    // Da aggiornare quando si sapranno le proprietà
    var _addFormInputsCSSRules = function (formID, formData) {
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";
        var containerRule = "";

        // containerRule += "color: " + columnContentData.text_color + ";";

        // checking font size, if value is not valid default font size will be applied
        // currentTextSize = isNaN(parseInt(columnContentData.font_size.replace("px", ""))) ? defaultButtonValues.font_size : columnContentData.font_size;
        // containerRule += "font-size: " + currentTextSize + ";";

        // checking button dimensions, if value is not valid default dimensions will be applied
        // currentDimension = isNaN(parseInt(columnContentData.button_height.replace("px", ""))) ? defaultButtonValues.dimensions.height : columnContentData.button_height;
        // containerRule += "min-height: " + currentDimension + ";";
        // currentDimension = isNaN(parseInt(columnContentData.button_width.replace("px", ""))) ? defaultButtonValues.dimensions.width : columnContentData.button_width;
        // containerRule += "min-width: " + currentDimension + ";";

        // checking margins, if they are not valid default value will be applied
        // currentMargin = isNaN(parseInt(columnContentData.margin_top.replace("px", ""))) ? defaultButtonValues.margins.top : columnContentData.margin_top;
        // containerRule += "margin-top: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentData.margin_right.replace("px", ""))) ? defaultButtonValues.margins.right : columnContentData.margin_right;
        // containerRule += "margin-right: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentData.margin_bottom.replace("px", ""))) ? defaultButtonValues.margins.bottom : columnContentData.margin_bottom;
        // containerRule += "margin-bottom: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(columnContentData.margin_left.replace("px", ""))) ? defaultButtonValues.margins.left : columnContentData.margin_left;
        // containerRule += "margin-left: " + currentMargin + ";";

        // _addElementContainerRule(elementID, containerRule);

        var backgroundRule = "";
        // backgroundRule += "border-color: " + columnContentData.border_color + ";";
        // backgroundRule += "border-style: " + "solid" + ";";

        // checking border dimensions, if they are not valid default value will be applied
        // currentBorderDimension = isNaN(parseInt(columnContentData.border_width.replace("px", ""))) ? defaultButtonValues.border.width : columnContentData.border_width;
        // backgroundRule += "border-width: " + currentBorderDimension + ";";
        // currentBorderDimension = isNaN(parseInt(columnContentData.border_radius.replace("px", ""))) ? defaultButtonValues.border.radius : columnContentData.border_radius;
        // backgroundRule += "border-radius: " + currentBorderDimension + ";";

        backgroundRule += "background-color: " + formData.content.background_color + ";";
        // _addElementContainerRule(elementID, backgroundRule);
        _addFormInputsRule(formID, backgroundRule);

        var textRule = "";
        // checking paddings, if they are not valid default value will be applied
        // currentPadding = isNaN(parseInt(columnContentData.padding_top.replace("px", ""))) ? defaultButtonValues.paddings.top : columnContentData.padding_top;
        // textRule += "padding-top: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentData.padding_right.replace("px", ""))) ? defaultButtonValues.paddings.right : columnContentData.padding_right;
        // textRule += "padding-right: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentData.padding_bottom.replace("px", ""))) ? defaultButtonValues.paddings.bottom : columnContentData.padding_bottom;
        // textRule += "padding-bottom: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(columnContentData.padding_left.replace("px", ""))) ? defaultButtonValues.paddings.left : columnContentData.padding_left;
        // textRule += "padding-left: " + currentPadding + ";";
        // _addElementTextRule(elementID, textRule);

        var backgroundHoverRule = "";
        // backgroundHoverRule += "background-color: " + columnContentData.hover_color + ";";
        // backgroundHoverRule += "border-color: " + columnContentData.hover_border + ";";
        // _addElementBackgroundHoverRule(elementID, backgroundHoverRule);

        var containerHoverRule = "";
        // containerHoverRule += "color: " + columnContentData.hover_text + ";";
        // _addElementContainerHoverRule(elementID, containerHoverRule);
    }

    var _updateFormInputsLive = function (data) {
    	var formID = data.target.form_id;
        var propertyType = data.propertyType;
    	var propertyName = data.propertyName;
    	var newValue = data.newValue;

        switch (propertyType) {
            // case "text":
            //     _updateButtonTextRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            // case "container":
            //     _updateButtonContainerRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            case "background":
                _updateFormInputsRule(formID, propertyName, newValue);
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /// Column content functions

    var _createColumnContentSpanData = function (data) {
    	var editPoint = data.editPoint;
    	var formID = editPoint.element_id;
    	var row_number = editPoint.row_number;
    	var column_number = editPoint.column_number;

    	var $formColumn = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

        var $formInDB = $formsInPage[formID];
        var $formColumnInDB = $formInDB.find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

    	var $spanData = $(document.createElement("span"));
    	$spanData.addClass("rex-wpcf7-column-content-data");
        var $spanDataInDB = $spanData.clone();

    	$formColumn.prepend($spanData);

        var shortcode = $formColumnInDB.text();
        $formColumnInDB.empty();
        var $span = $(document.createElement("span"));
        $span.addClass("wpcf7-column-content-shortcode");
        $span.append(shortcode);
        $formColumnInDB.append($span);
        $formColumnInDB.prepend($spanDataInDB);

        _updateFormInDB(formID);
    	_addColumnContentStyle($formColumn);
    }

    var _removeColumnContentSpanData = function (data) {
    	var editPoint = data.editPoint;
    	var formID = editPoint.element_id;
    	var row_number = editPoint.row_number;
    	var column_number = editPoint.column_number;

    	var $editPoint = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

        var $editPointInDB = $formsInPage[formID].find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

    	$editPoint.find(".rex-wpcf7-column-content-data").remove();
        $editPointInDB.find(".rex-wpcf7-column-content-data").remove();

    	_removeColumnContentStyle(formID, row_number, column_number);
    }

    var _addColumnContentStyle = function ($formColumn) {
        if ($formColumn.find(".rex-wpcf7-column-content-data").eq(0).length != 0) {
            var columnContentData = _generateColumnContentData($formColumn, true);
            var formID = columnContentData.target.element_id;
            _addColumnContentCSSRules(formID, columnContentData);
        }
    }

    var _removeColumnContentStyle = function (formID, row_number, column_number) {
        _removeColumnContentRule(formID, row_number, column_number);
    }

    var _updateColumnContentLive = function (data) {
    	var formID = data.target.element_id;
    	var row = data.target.row_number;
    	var column = data.target.column_number;
    	var contentType = data.content.type;
        var propertyName = data.propertyName;
        var newValue = data.newValue;

        switch (data.propertyType) {
            case "background-color":
            case "width":
            case "height":
            case "font-size":
            case "text":
                _updateColumnContentRule(formID, row, column, contentType, propertyName, newValue);
                break;
            case "text-focus":
                _updateColumnContentFocusRule(formID, row, column, contentType, propertyName, newValue);
                break;
            default:
                break;
        }
    }

    /**
     * Generate column content data form span element in the DOM.
     * 
     * The obtained object has 1 field:
     * columnContentData - properties of the column content
     * 
     * @returns {Object} data
     */
    var _generateColumnContentData = function ($formColumn, spanDataExists) {
        var columnContentData = {
            wpcf7_required_field: "",
            wpcf7_only_numbers: "",
            wpcf7_placeholder: "",
            input_width: "",
            input_height: "",
            font_size: "",
            type: "",
            input_type: "",
            background_color: "",
            text_color: "",
            text_color_focus: "",
            target: {
                element_id: "",
                row_number: "",
                column_number: "",
            }
        };

        columnContentData.target.element_id = $formColumn.parents(".rex-element-wrapper").attr("data-rex-element-id");
        columnContentData.target.row_number = $formColumn.parents(".wpcf7-row").attr("wpcf7-row-number");
        columnContentData.target.column_number = $formColumn.attr("wpcf7-column-number");
        columnContentData.type = $formColumn.find(".wpcf7-form-control").prop("nodeName").toLowerCase();
        columnContentData.input_type = $formColumn.find(".wpcf7-form-control").attr("type");

        if (spanDataExists) {
        	var $columnContentData = $formColumn.find(".rex-wpcf7-column-content-data").eq(0);
        	var columnContentDataEl = $columnContentData[0];

            // Wpcf7 Properties
            columnContentData.wpcf7_placeholder = (columnContentDataEl.getAttribute("data-wpcf7-placeholder") ? columnContentDataEl.getAttribute("data-wpcf7-placeholder").toString() : '');
            columnContentData.wpcf7_only_numbers = (columnContentDataEl.getAttribute("data-wpcf7-only-numbers") ? columnContentDataEl.getAttribute("data-wpcf7-only-numbers").toString() : '');
            columnContentData.wpcf7_required_field = (columnContentDataEl.getAttribute("data-wpcf7-required-field") ? columnContentDataEl.getAttribute("data-wpcf7-required-field").toString() : '');
            columnContentData.input_width = (columnContentDataEl.getAttribute("data-wpcf7-input-width") ? columnContentDataEl.getAttribute("data-wpcf7-input-width").toString() : defaultColumnContentValues.input_width);
            columnContentData.input_height = (columnContentDataEl.getAttribute("data-wpcf7-input-height") ? columnContentDataEl.getAttribute("data-wpcf7-input-height").toString() : defaultColumnContentValues.input_height);
            columnContentData.font_size = (columnContentDataEl.getAttribute("data-wpcf7-font-size") ? columnContentDataEl.getAttribute("data-wpcf7-font-size").toString() : defaultColumnContentValues.font_size);

        	// Style properties
        	columnContentData.background_color = (columnContentDataEl.getAttribute("data-background-color") ? columnContentDataEl.getAttribute("data-background-color").toString() : '');
            columnContentData.text_color = (columnContentDataEl.getAttribute("data-text-color") ? columnContentDataEl.getAttribute("data-text-color").toString() : '');
            columnContentData.text_color_focus = (columnContentDataEl.getAttribute("data-text-color-focus") ? columnContentDataEl.getAttribute("data-text-color-focus").toString() : '');
        }

        var data = columnContentData;

        return data;
    }

    var _addColumnContentCSSRules = function (formID, columnContentData) {
        // @todo
        // var currentMargin = "";
        // var currentPadding = "";
        // var currentDimension = "";
        // var currentBorderDimension = "";
        // var currentTextSize = "";

        var row = columnContentData.target.row_number;
        var column = columnContentData.target.column_number;
        var contentType = columnContentData.type;
        var columnContentRule = "";

        columnContentRule += "width: " + columnContentData.input_width + ";";
        columnContentRule += "height: " + columnContentData.input_height + ";";
        columnContentRule += "color: " + columnContentData.text_color + ";";
        columnContentRule += "font-size: " + columnContentData.font_size + ";";
        _addColumnContentRule(formID, row, column, contentType, columnContentRule);

        var columnContentFocusRule = "";

        columnContentFocusRule += "color: " + columnContentData.text_color_focus + ";";
        _addColumnContentFocusRule(formID, row, column, contentType, columnContentFocusRule);
    }

    var _updateColumnContent = function (data) {
        var columnContentData = data.columnContentData;
        var formID = columnContentData.target.element_id;
        var row = columnContentData.target.row_number;
        var column = columnContentData.target.column_number;
        var contentType = columnContentData.type;
        var inputType = columnContentData.input_type;

        _updateColumnContentRule(formID, row, column, contentType, "text-color", columnContentData.text_color);
        _updateColumnContentRule(formID, row, column, contentType, "width", columnContentData.input_width);
        _updateColumnContentRule(formID, row, column, contentType, "height", columnContentData.input_height);
        _updateColumnContentRule(formID, row, column, contentType, "font-size", columnContentData.font_size);

        _updateColumnContentFocusRule(formID, row, column, contentType, "text-color", columnContentData.text_color_focus);

        _updateColumnContentShortcode(formID, row, column, inputType, columnContentData);
        _updateSpanData(formID, columnContentData);
        _updateFormInDB(formID);
    }

    var _updateColumnContentShortcode = function (formID, row, column, inputType, columnContentData) {
        var $formToUpdateDB = $formsInPage[formID];
        var $columnToUpdateDB = $formToUpdateDB.find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"]");
        var shortcode = $columnToUpdateDB.text();
        var isSetRequiredField = columnContentData.wpcf7_required_field;
        var onlyNumbers = columnContentData.wpcf7_only_numbers;
        var placeholder = columnContentData.wpcf7_placeholder;

        if(inputType == "text") {   // Required field
            // Puts (or removes) the * after [(type)
            var isAlreadyRequiredField = /\[[a-z]+\*/.test(shortcode);
            if(isAlreadyRequiredField) {
                if(!isSetRequiredField) {
                    shortcode = shortcode.replace(/\[[a-z]+\*/, /\[[a-z]+/.exec(shortcode)[0]);
                }
            } else {
                if(isSetRequiredField) {
                    shortcode = shortcode.replace(/\[[a-z]+/, /\[[a-z]+/.exec(shortcode)[0] + "*");
                }
            }
            // if(requiredField) {
            //     shortcode = shortcode.replace(/\[[a-z]+/, /\[[a-z]+/.exec(shortcode)[0] + "*");
            // } else {
            //     shortcode = shortcode.replace(/\[[a-z]+\*/, /\[[a-z]+/.exec(shortcode)[0]);
            // }
        }

        if(inputType == "text" || inputType == "number") {   // Only number
            // Changes the shortcode in [number number-xxx ...] or vice versa
            if(onlyNumbers) {
                shortcode = shortcode.replace(/\[[a-z]+ [a-z]+/, "[number number");
            } else {
                shortcode = shortcode.replace(/\[[a-z]+ [a-z]+/, "[text text");
            }
        }

        if(inputType == "text") {   // Placeholder
            /* Puts the "placeholder" string and the placeholder value at the end 
            of the shortcode orremoves it */
            var valueIsEmpty = placeholder === "";
            var thereIsPlaceholder = /placeholder/.test(shortcode);
            if(valueIsEmpty) {
                shortcode = shortcode.replace(/placeholder ".+"/, "");
            } else {
                if(!thereIsPlaceholder) {
                    shortcode = shortcode.replace(/\]/, "placeholder \"" + placeholder + "\"]");
                } else {
                    shortcode = shortcode.replace(/placeholder ".+"/, "placeholder \"" + placeholder + "\"");
                }
            }
        }

        var $columnShortcode = $columnToUpdateDB.find(".wpcf7-column-content-shortcode");
        $columnShortcode.empty();
        $columnShortcode.append(shortcode);

        // _updateFormInDB(formID);
    }

    /**
     * Updates multiple column content data.
     * @param  {jQuery} $elementWrappers
     * @param  {Array} columnContentData Data to update
     * @return {null}
     */
    var _updateSpanData = function (formID, columnContentData) {
        // If editing a separate element, will always be length = 1
        // If editing a model element, will be length >= 1
        var $formToUpdate = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-form");
    	var row = columnContentData.target.row_number;
        var column = columnContentData.target.column_number;

        $formToUpdate.each(function() {
            var $columnData = $(this).find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"]").find(".wpcf7-column[wpcf7-column-number=\"" + column + "\"]").find(".rex-wpcf7-column-content-data");
            $columnData.attr("data-background-color", columnContentData.background_color);
            $columnData.attr("data-text-color", columnContentData.text_color);
            $columnData.attr("data-wpcf7-placeholder", columnContentData.wpcf7_placeholder);
            $columnData.attr("data-wpcf7-only-numbers", columnContentData.wpcf7_only_numbers);
            $columnData.attr("data-wpcf7-required-field", columnContentData.wpcf7_required_field);
            $columnData.attr("data-wpcf7-input-width", columnContentData.input_width);
            $columnData.attr("data-wpcf7-input-height", columnContentData.input_height);
            $columnData.attr("data-wpcf7-font-size", columnContentData.font_size);
            $columnData.attr("data-text-color-focus", columnContentData.text_color_focus);
        })

        _updateSpanDataInDB(formID, columnContentData);
    }

    var _updateSpanDataInDB = function (formID, columnContentData) {
        var $formInDB = $formsInPage[formID];
        var row = columnContentData.target.row_number;
        var column = columnContentData.target.column_number;
        var $columnDataInDB = $formInDB.find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"]").find(".wpcf7-column[wpcf7-column-number=\"" + column + "\"]").find(".rex-wpcf7-column-content-data");

        $columnDataInDB.attr("data-background-color", columnContentData.background_color);
        $columnDataInDB.attr("data-text-color", columnContentData.text_color);
        $columnDataInDB.attr("data-wpcf7-placeholder", columnContentData.wpcf7_placeholder);
        $columnDataInDB.attr("data-wpcf7-only-numbers", columnContentData.wpcf7_only_numbers);
        $columnDataInDB.attr("data-wpcf7-required-field", columnContentData.wpcf7_required_field);
        $columnDataInDB.attr("data-wpcf7-input-width", columnContentData.input_width);
        $columnDataInDB.attr("data-wpcf7-input-height", columnContentData.input_height);
        $columnDataInDB.attr("data-wpcf7-font-size", columnContentData.font_size);
        $columnDataInDB.attr("data-text-color-focus", columnContentData.text_color_focus);

        // _updateFormInDB(formID);
    }

	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
    
    // JQuery Array of DB side of forms in page
    var $formsInPage;

    var _getDBFormsInPage = function () {
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper");

        var idsInPage = [];
        $elementWrappers.each(function(){
            idsInPage.push($(this).attr("data-rex-element-id"));
        })
        idsInPage = Array.from(new Set(idsInPage));

        $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rex_wpcf7_get_forms",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
              form_id: idsInPage
            },
            success: function(response) {
              if (response.success) {
                var id, i = 0;
                for (id of idsInPage) {
                    $formsInPage[id] = $(response.data.html_forms[i].toString().trim());

                    i++;
                }
              }
            },
            error: function(response) {}
        });
    }

	var _init = function () {
		styleSheet = null;
        $formsInPage = {};

        defaultColumnContentValues = {
                input_width: "150px",
                input_height: "50px",
                font_size: "15px",
        }

        this.$rexformsStyle = $("#rexpansive-builder-rexwpcf7-style-inline-css");

        _fixCustomStyleForm();
        _getDBFormsInPage();
	}

	return {
		init: _init,

        // Rexwpcf7 generic functions
		addField: _addField,
        addNewRow: _addNewRow,
        addRow: _addRow,
        addClonedColumnRow: _addClonedColumnRow,
        deleteRow: _deleteRow,
        deleteColumnContent: _deleteColumnContent,

		/* CSS functions */
		addFormStyle: _addFormStyle,
		addColumnContentStyle: _addColumnContentStyle,

		// Form functions
		generateFormData: _generateFormData,
        updateFormLive: _updateFormLive,
		updateFormInputsLive: _updateFormInputsLive,
        updateForm: _updateForm,

		// Column content functions
		createColumnContentSpanData: _createColumnContentSpanData,
		removeColumnContentSpanData: _removeColumnContentSpanData,
		generateColumnContentData: _generateColumnContentData,
		updateColumnContentLive: _updateColumnContentLive,
		updateColumnContent: _updateColumnContent,
	}
})(jQuery);