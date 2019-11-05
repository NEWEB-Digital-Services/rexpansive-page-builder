var Rexbuilder_Rexwpcf7 = (function ($) {
	"use strict";

	var styleSheet;
	var defaultFormValues;
    var defaultColumnContentValues;

    var $fileCaption;

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
        var fieldNumber = Rexbuilder_Util.createRandomNumericID(3);

        // Selecting the field
        switch(fieldType) {
            case "text":
                fieldShortcode = "[text text-" + fieldNumber + " class:text-" + fieldNumber + "]";
                break;
            case "textarea":
                fieldShortcode = "[textarea textarea-" + fieldNumber + " class:textarea-" + fieldNumber + "]";
                break;
            case "menu":
                fieldShortcode = "[select menu-" + fieldNumber + " include_blank class:menu-" + fieldNumber + " 'Field 1' 'Field 2']";
                break;
            case "radiobuttons":
                fieldShortcode = "[radio radio-" + fieldNumber + " default:1 class:radio-" + fieldNumber + " \"Option 1\" \"Option 2\" ]";
                break;
            case "checkbox":
                fieldShortcode = "[checkbox checkbox-" + fieldNumber + " class:checkbox-" + fieldNumber + " \"Checkbox text\"]";
                break;
            case "acceptance":
                fieldShortcode = "[acceptance acceptance-" + fieldNumber + " optional] Your text [/acceptance]";
                break;
            case "file":
                fieldShortcode = "[file file-" + fieldNumber + " filetypes: limit:]<div class='wpcf7-file-caption'>Your text here</div>";
                break;
            case "submit":
                fieldShortcode = "[submit class:submit-" + fieldNumber + " 'Send']";
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

        var $columnToUpdateDB = $formsInPage[formID].find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"]");

        $columnToUpdateDB.empty();
        $columnToUpdateDB.append(fieldShortcode);

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

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Adding rules
    
    var _addFormRule = function (formID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form" + "{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form" + "{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addFormColumnsRule = function (formID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form .wpcf7-column" + "{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form .wpcf7-column" + "{" + property + "}", styleSheet.cssRules.length);
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
    var _addColumnContentRule = function (formID, row, column, fieldClass, property) {
        if ("insertRule" in styleSheet) {
            // styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + "{" + property + "}", styleSheet.cssRules.length);
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] ." + fieldClass + "{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            // styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + "{" + property + "}", styleSheet.cssRules.length);
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] " + fieldClass + "{" + property + "}", styleSheet.cssRules.length);
        }
    }

    // Style is changed to the column content, not to the whole column
    var _addColumnContentFocusRule = function (formID, row, column, fieldClass, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] ." + fieldClass + ":focus{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] ." + fieldClass + ":focus{" + property + "}", styleSheet.cssRules.length);
        }
    }

    // Style is changed to the column content, not to the whole column
    var _addColumnContentHoverRule = function (formID, row, column, fieldClass, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] ." + fieldClass + ":hover{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] ." + fieldClass + ":hover{" + property + "}", styleSheet.cssRules.length);
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
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
                    case "margin-top":
                        styleSheet.cssRules[i].style.marginTop = value;
                        break;
                    case "margin-bottom":
                        styleSheet.cssRules[i].style.marginBottom = value;
                        break;
                    case "margin-left":
                        styleSheet.cssRules[i].style.marginLeft = value;
                        break;
                    case "margin-right":
                        styleSheet.cssRules[i].style.marginRight = value;
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

    var _updateFormColumnsRule = function (formID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-form .wpcf7-column" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper .wpcf7-form .wpcf7-column"
            ) {
                switch (rule) {
                    case "padding-top":
                        styleSheet.cssRules[i].style.paddingTop = value;
                        break;
                    case "padding-left":
                        styleSheet.cssRules[i].style.paddingLeft = value;
                        break;
                    case "padding-right":
                        styleSheet.cssRules[i].style.paddingRight = value;
                        break;
                    case "padding-bottom":
                        styleSheet.cssRules[i].style.paddingBottom = value;
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
    var _updateColumnContentRule = function (formID, row, column, fieldClass, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            // if (
            //     //chrome firefox
            //     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType ||
            //     // edge
            //     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + contentType
            // ) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] ." + fieldClass ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper ." + fieldClass
            ) {
                switch (rule) {
                    case "float":
                        styleSheet.cssRules[i].style.float = value;
                        break;
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
                    case "margin-top":
                        styleSheet.cssRules[i].style.marginTop = value;
                        break;
                    case "margin-bottom":
                        styleSheet.cssRules[i].style.marginBottom = value;
                        break;
                    case "margin-left":
                        styleSheet.cssRules[i].style.marginLeft = value;
                        break;
                    case "margin-right":
                        styleSheet.cssRules[i].style.marginRight = value;
                        break;
                    case "padding-top":
                        styleSheet.cssRules[i].style.paddingTop = value;
                        break;
                    case "padding-bottom":
                        styleSheet.cssRules[i].style.paddingBottom = value;
                        break;
                    case "padding-left":
                        styleSheet.cssRules[i].style.paddingLeft = value;
                        break;
                    case "padding-right":
                        styleSheet.cssRules[i].style.paddingRight = value;
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
            // if (
            //     //chrome firefox
            //     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + ":focus" ||
            //     // edge
            //     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + contentType + ":focus"
            // ) {
            if (
                // chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] ." + contentType + ":focus" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper ." + contentType + ":focus"
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

    // Style is changed to the column content, not to the whole column
    var _updateColumnContentHoverRule = function (formID, row, column, contentType, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            // if (
            //     //chrome firefox
            //     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + ":focus" ||
            //     // edge
            //     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + contentType + ":focus"
            // ) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] ." + contentType + ":hover" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper ." + contentType + ":hover"
            ) {
                switch (rule) {
                    case "text-color":
                        styleSheet.cssRules[i].style.color = value;
                        break;
                    case "border-color":
                        styleSheet.cssRules[i].style.borderColor = value;

                        styleSheet.cssRules[i].style.borderTopColor = value;
                        styleSheet.cssRules[i].style.borderLeftColor = value;
                        styleSheet.cssRules[i].style.borderRightColor = value;
                        styleSheet.cssRules[i].style.borderBottomColor = value;

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

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Form functions

    var _addFormStyle = function ($form) {
        var $elementWrapper = $form.parents(".rex-element-wrapper");
        if ($elementWrapper.find(".rex-element-data").eq(0).length != 0) {
            var formData = Rexbuilder_Rexelement.generateElementData($elementWrapper);
            var formID = formData.elementInfo.element_target.element_id;
            formData = formData.elementInfo.wpcf7_data;
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

        var formRule = "";

        formRule += "background-color: " + formData.background_color + ";";
        formRule += "border-style: solid;";
        formRule += "border-color: " + formData.border_color + ";";
        formRule += "border-width: " + formData.border_width + ";";
        formRule += "margin-top: " + formData.margin_top + ";";
        formRule += "margin-left: " + formData.margin_left + ";";
        formRule += "margin-right: " + formData.margin_right + ";";
        formRule += "margin-bottom: " + formData.margin_bottom + ";";
        _addFormRule(formID, formRule);

        var formColumnsRule = "";

        formColumnsRule += "padding-top: " + formData.columns.padding_top + ";";
        formColumnsRule += "padding-left: " + formData.columns.padding_left + ";";
        formColumnsRule += "padding-right: " + formData.columns.padding_right + ";";
        formColumnsRule += "padding-bottom: " + formData.columns.padding_bottom + ";";

        _addFormColumnsRule(formID, formColumnsRule);
    }

    var _updateFormLive = function (data) {
        var formID = data.element_target.element_id;
        var propertyType = data.propertyType;
        var propertyName = data.propertyName;
        var newValue = data.newValue;

        switch (propertyType) {
            case "background":
            case "border":
            case "border-width":
            case "margin":
                _updateFormRule(formID, propertyName, newValue);
                break;
            case "columns-padding":
                _updateFormColumnsRule(formID, propertyName, newValue);
                break;
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
        var formData = data.elementData.wpcf7_data;
        var formID = data.elementData.element_target.element_id;
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        _updateFormRule(formID, "background-color", formData.background_color);
        _updateFormRule(formID, "border-color", formData.border_color);
        _updateFormRule(formID, "border-width", formData.border_width);
        _updateFormRule(formID, "margin-top", formData.margin_top);
        _updateFormRule(formID, "margin-left", formData.margin_left);
        _updateFormRule(formID, "margin-right", formData.margin_right);
        _updateFormRule(formID, "margin-bottom", formData.margin_bottom);

        _updateFormColumnsRule(formID, "padding-top", formData.columns.padding_top);
        _updateFormColumnsRule(formID, "padding-left", formData.columns.padding_left);
        _updateFormColumnsRule(formID, "padding-right", formData.columns.padding_right);
        _updateFormColumnsRule(formID, "padding-bottom", formData.columns.padding_bottom);
        // _updateFormInputsRule(formID, "background-color", formData.content.background_color);

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
            var $formData = $(this).find(".rex-element-data").eq(0);

            $formData.attr("data-wpcf7-background-color", formData.background_color);
            $formData.attr("data-wpcf7-border-color", formData.border_color);
            $formData.attr("data-wpcf7-border-width", formData.border_width);
            $formData.attr("data-wpcf7-margin-top", formData.margin_top);
            $formData.attr("data-wpcf7-margin-left", formData.margin_left);
            $formData.attr("data-wpcf7-margin-right", formData.margin_right);
            $formData.attr("data-wpcf7-margin-bottom", formData.margin_bottom);
            $formData.attr("data-wpcf7-columns-padding-top", formData.columns.padding_top);
            $formData.attr("data-wpcf7-columns-padding-left", formData.columns.padding_left);
            $formData.attr("data-wpcf7-columns-padding-right", formData.columns.padding_right);
            $formData.attr("data-wpcf7-columns-padding-bottom", formData.columns.padding_bottom);
            $formData.attr("data-wpcf7-content-background-color", formData.content.background_color);
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

        var backgroundRule = "";

        backgroundRule += "background-color: " + formData.content.background_color + ";";
        // _addElementContainerRule(elementID, backgroundRule);
        _addFormInputsRule(formID, backgroundRule);
    }

    var _updateFormInputsLive = function (data) {
    	var formID = data.target.form_id;
        var propertyType = data.propertyType;
    	var propertyName = data.propertyName;
    	var newValue = data.newValue;

        switch (propertyType) {
            case "background":
                _updateFormInputsRule(formID, propertyName, newValue);
                break;
            default:
                break;
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
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

        var shortcode = $formColumnInDB.html();
        $formColumnInDB.empty();
        var $span = $(document.createElement("span"));
        $span.addClass("wpcf7-column-content");
        $span.append(shortcode);
        $formColumnInDB.append($span);
        $formColumnInDB.prepend($spanDataInDB);

        // _updateFormInDB(formID);
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
        var fieldClass = data.content.field_class;
        var inputType = data.content.input_type;
        var propertyName = data.propertyName;
        var newValue = data.newValue;

        switch (data.propertyType) {
            case "background-color":
            case "width":
            case "height":
            case "font-size":
            case "text-color":
                _updateColumnContentRule(formID, row, column, fieldClass, propertyName, newValue);
                break;
            case "button-width":
            case "button-height":
            case "button-border-width":
            case "button-border-radius":
            case "button-margin-top":
            case "button-margin-right":
            case "button-margin-bottom":
            case "button-margin-left":
            case "button-padding-top":
            case "button-padding-right":
            case "button-padding-bottom":
            case "button-padding-left":
            case "button-font-size":
            case "button-text-color":
            case "button-background-color":
            case "button-border-color":
                if (inputType == "file") {
                    _updateColumnContentRule(formID, row, column, fieldClass + " label", propertyName, newValue);
                } else {
                    _updateColumnContentRule(formID, row, column, fieldClass, propertyName, newValue);
                }
                break;
            case "text-focus":
                _updateColumnContentFocusRule(formID, row, column, fieldClass, propertyName, newValue);
                break;
            case "button-text-color-hover":
            case "button-background-color-hover":
            case "button-border-color-hover":
                if (inputType == "file") {
                   _updateColumnContentHoverRule(formID, row, column, fieldClass + " label", propertyName, newValue);
                } else {
                    _updateColumnContentHoverRule(formID, row, column, fieldClass, propertyName, newValue);
                }
                break;
            default:
                break;
        }
    }

    /**
     * Generate column content data from the DOM and from the span
     * element in the DOM.
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
            wpcf7_default_check: "",
            wpcf7_placeholder: "",
            wpcf7_list_fields: [],
            wpcf7_file_max_dimensions: "",
            wpcf7_button: {
                text: "",
                font_size: "",
                height: "",
                width: "",
                border_width: "",
                border_radius: "",
                margin_top: "",
                margin_right: "",
                margin_bottom: "",
                margin_left: "",
                padding_top: "",
                padding_right: "",
                padding_bottom: "",
                padding_left: "",
                text_color: "",
                text_color_hover: "",
                background_color: "",
                background_color_hover: "",
                border_color: "",
                border_color_hover: "",
            },
            input_width: "",
            input_height: "",
            font_size: "",
            background_color: "",
            text_color: "",
            text_color_focus: "",
            text: "",
            type: "",
            field_class: "",
            input_type: "",
            target: {
                element_id: "",
                row_number: "",
                column_number: "",
            }
        }

        // Element ID
        columnContentData.target.element_id = $formColumn.parents(".rex-element-wrapper").attr("data-rex-element-id");

        //Row number
        columnContentData.target.row_number = $formColumn.parents(".wpcf7-row").attr("wpcf7-row-number");

        // Column number
        columnContentData.target.column_number = $formColumn.attr("wpcf7-column-number");

        // Type
        columnContentData.type = $formColumn.find(".wpcf7-form-control").prop("nodeName").toLowerCase();

        // Field class
        columnContentData.field_class = /[a-z]+\-[0-9]+/.exec($formColumn.find(".wpcf7-form-control")[0].classList);
        if(null == columnContentData.field_class) {
            columnContentData.field_class = /[a-z]+\-[0-9]+/.exec($formColumn.find(".wpcf7-form-control-wrap")[0].classList)[0];
        } else {
            columnContentData.field_class = columnContentData.field_class[0];
        }
        
        // Input type
        columnContentData.input_type = /[a-z]+/.exec(columnContentData.field_class)[0];
        
        // Checkbox text editor
        if (columnContentData.input_type == "acceptance") {
            columnContentData.text = $formColumn.find(".wpcf7-list-item-label").html();
        }

        // File text editor
        if (columnContentData.input_type == "file") {
            columnContentData.text = $formColumn.find(".wpcf7-file-caption").html();
        }

        // Menu fields
        var $listFields = $formColumn.find(".wpcf7-select").eq(0).find("option");
        if ($listFields.length != 0) {
            for (var field of $listFields) {
                if($(field).val() != "") {
                    columnContentData.wpcf7_list_fields.push($(field).text());
                } 
            }
        }
        
        // Radio fields
        var $listFields2 = $formColumn.find(".wpcf7-radio").eq(0).find(".wpcf7-list-item-label");
        if ($listFields2.length != 0) {
            for (var field of $listFields2) {
                columnContentData.wpcf7_list_fields.push($(field).text());
            }
        }

        if (spanDataExists) {
            /* Extracting data from span in the DOM */
        	var $columnContentData = $formColumn.find(".rex-wpcf7-column-content-data").eq(0);
        	var columnContentDataEl = $columnContentData[0];

            // Required field
            columnContentData.wpcf7_required_field = (columnContentDataEl.getAttribute("data-wpcf7-required-field") ? columnContentDataEl.getAttribute("data-wpcf7-required-field").toString() : '');

            // Only numbers
            columnContentData.wpcf7_only_numbers = (columnContentDataEl.getAttribute("data-wpcf7-only-numbers") ? columnContentDataEl.getAttribute("data-wpcf7-only-numbers").toString() : '');

            // Default check
            columnContentData.wpcf7_default_check = (columnContentDataEl.getAttribute("data-wpcf7-default-check") ? columnContentDataEl.getAttribute("data-wpcf7-default-check").toString() : '');

            // Placeholder
            columnContentData.wpcf7_placeholder = (columnContentDataEl.getAttribute("data-wpcf7-placeholder") ? columnContentDataEl.getAttribute("data-wpcf7-placeholder").toString() : '');

            // File max dimensions
            columnContentData.wpcf7_file_max_dimensions = (columnContentDataEl.getAttribute("data-wpcf7-file-max-dimensions") ? columnContentDataEl.getAttribute("data-wpcf7-file-max-dimensions").toString() : '');

            // File types
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_list_fields = (columnContentDataEl.getAttribute("data-wpcf7-file-types") ? columnContentDataEl.getAttribute("data-wpcf7-file-types").toString().split(",") : '');
            }

        	// Width & height
            columnContentData.input_width = (columnContentDataEl.getAttribute("data-wpcf7-input-width") ? columnContentDataEl.getAttribute("data-wpcf7-input-width").toString() : defaultColumnContentValues.input_width);
            columnContentData.input_height = (columnContentDataEl.getAttribute("data-wpcf7-input-height") ? columnContentDataEl.getAttribute("data-wpcf7-input-height").toString() : defaultColumnContentValues.input_height);

            // Font size
            columnContentData.font_size = (columnContentDataEl.getAttribute("data-wpcf7-font-size") ? columnContentDataEl.getAttribute("data-wpcf7-font-size").toString() : defaultColumnContentValues.font_size);

            // Background color
        	columnContentData.background_color = (columnContentDataEl.getAttribute("data-background-color") ? columnContentDataEl.getAttribute("data-background-color").toString() : '');

            // Text color
            columnContentData.text_color = (columnContentDataEl.getAttribute("data-text-color") ? columnContentDataEl.getAttribute("data-text-color").toString() : '');

            // Text focus color
            columnContentData.text_color_focus = (columnContentDataEl.getAttribute("data-text-color-focus") ? columnContentDataEl.getAttribute("data-text-color-focus").toString() : '');

            // Button
            columnContentData.wpcf7_button.text = (columnContentDataEl.getAttribute("data-button-text") ? columnContentDataEl.getAttribute("data-button-text").toString() : '');
            columnContentData.wpcf7_button.font_size = (columnContentDataEl.getAttribute("data-button-text-font-size") ? columnContentDataEl.getAttribute("data-button-text-font-size").toString() : '');
            columnContentData.wpcf7_button.height = (columnContentDataEl.getAttribute("data-button-height") ? columnContentDataEl.getAttribute("data-button-height").toString() : '');
            columnContentData.wpcf7_button.width = (columnContentDataEl.getAttribute("data-button-width") ? columnContentDataEl.getAttribute("data-button-width").toString() : '');
            columnContentData.wpcf7_button.border_width = (columnContentDataEl.getAttribute("data-button-border-width") ? columnContentDataEl.getAttribute("data-button-border-width").toString() : '');
            columnContentData.wpcf7_button.border_radius = (columnContentDataEl.getAttribute("data-button-border-radius") ? columnContentDataEl.getAttribute("data-button-border-radius").toString() : '');
            columnContentData.wpcf7_button.margin_top = (columnContentDataEl.getAttribute("data-button-margin-top") ? columnContentDataEl.getAttribute("data-button-margin-top").toString() : '');
            columnContentData.wpcf7_button.margin_right = (columnContentDataEl.getAttribute("data-button-margin-right") ? columnContentDataEl.getAttribute("data-button-margin-right").toString() : '');
            columnContentData.wpcf7_button.margin_bottom = (columnContentDataEl.getAttribute("data-button-margin-bottom") ? columnContentDataEl.getAttribute("data-button-margin-bottom").toString() : '');
            columnContentData.wpcf7_button.margin_left = (columnContentDataEl.getAttribute("data-button-margin-left") ? columnContentDataEl.getAttribute("data-button-margin-left").toString() : '');
            columnContentData.wpcf7_button.padding_top = (columnContentDataEl.getAttribute("data-button-padding-top") ? columnContentDataEl.getAttribute("data-button-padding-top").toString() : '');
            columnContentData.wpcf7_button.padding_right = (columnContentDataEl.getAttribute("data-button-padding-right") ? columnContentDataEl.getAttribute("data-button-padding-right").toString() : '');
            columnContentData.wpcf7_button.padding_bottom = (columnContentDataEl.getAttribute("data-button-padding-bottom") ? columnContentDataEl.getAttribute("data-button-padding-bottom").toString() : '');
            columnContentData.wpcf7_button.padding_left = (columnContentDataEl.getAttribute("data-button-padding-left") ? columnContentDataEl.getAttribute("data-button-padding-left").toString() : '');
            columnContentData.wpcf7_button.text_color = (columnContentDataEl.getAttribute("data-button-text-color") ? columnContentDataEl.getAttribute("data-button-text-color").toString() : '');
            columnContentData.wpcf7_button.text_color_hover = (columnContentDataEl.getAttribute("data-button-text-color-hover") ? columnContentDataEl.getAttribute("data-button-text-color-hover").toString() : '');
            columnContentData.wpcf7_button.background_color = (columnContentDataEl.getAttribute("data-button-background-color") ? columnContentDataEl.getAttribute("data-button-background-color").toString() : '');
            columnContentData.wpcf7_button.background_color_hover = (columnContentDataEl.getAttribute("data-button-background-color-hover") ? columnContentDataEl.getAttribute("data-button-background-color-hover").toString() : '');
            columnContentData.wpcf7_button.border_color = (columnContentDataEl.getAttribute("data-button-border-color") ? columnContentDataEl.getAttribute("data-button-border-color").toString() : '');
            columnContentData.wpcf7_button.border_color_hover = (columnContentDataEl.getAttribute("data-button-border-color-hover") ? columnContentDataEl.getAttribute("data-button-border-color-hover").toString() : '');
            
        } else {
            /* Extracting data from the element in the DOM */
            var $field = $formColumn.find("[name='" + columnContentData.field_class + "']");

            if (columnContentData.input_type == "radio" || columnContentData.input_type == "acceptance") {
                $field = $field.parents(".wpcf7-form-control");
            }

            // Width & height
            columnContentData.input_width = $field.css("width");
            columnContentData.input_height = $field.css("height");

            // Font size
            columnContentData.font_size = $field.css("font-size");

            // Text color
            columnContentData.text_color = $field.css("color");

            // Text focus color
            // columnContentData.text_color_focus = field.css("")
        }

        var data = columnContentData;

        return data;
    }

    var _addColumnContentCSSRules = function (formID, columnContentData) {
        // @todo Minimum size
        // var currentMargin = "";
        // var currentPadding = "";
        // var currentDimension = "";
        // var currentBorderDimension = "";
        // var currentTextSize = "";

        var row = columnContentData.target.row_number;
        var column = columnContentData.target.column_number;
        var contentType = columnContentData.type;
        var fieldClass = columnContentData.field_class;
        var inputType = columnContentData.input_type;
        var columnContentFocusRule = "";

        columnContentFocusRule += "color: " + columnContentData.text_color_focus + ";";
        _addColumnContentFocusRule(formID, row, column, fieldClass, columnContentFocusRule);

        if (inputType == "file") {
            var columnContentFileButtonRule = "";

            columnContentFileButtonRule += "font-size: " + columnContentData.wpcf7_button.font_size + ";";
            columnContentFileButtonRule += "height: " + columnContentData.wpcf7_button.height + ";";
            columnContentFileButtonRule += "width: " + columnContentData.wpcf7_button.width + ";";
            columnContentFileButtonRule += "border-width: " + columnContentData.wpcf7_button.border_width + ";";
            columnContentFileButtonRule += "border-radius: " + columnContentData.wpcf7_button.border_radius + ";";
            columnContentFileButtonRule += "border-style: solid;";
            columnContentFileButtonRule += "margin-top: " + columnContentData.wpcf7_button.margin_top + ";";
            columnContentFileButtonRule += "margin-right: " + columnContentData.wpcf7_button.margin_right + ";";
            columnContentFileButtonRule += "margin-bottom: " + columnContentData.wpcf7_button.margin_bottom + ";";
            columnContentFileButtonRule += "margin-left: " + columnContentData.wpcf7_button.margin_left + ";";
            columnContentFileButtonRule += "padding-top: " + columnContentData.wpcf7_button.padding_top + ";";
            columnContentFileButtonRule += "padding-right: " + columnContentData.wpcf7_button.padding_right + ";";
            columnContentFileButtonRule += "padding-bottom: " + columnContentData.wpcf7_button.padding_bottom + ";";
            columnContentFileButtonRule += "padding-left: " + columnContentData.wpcf7_button.padding_left + ";";
            columnContentFileButtonRule += "color: " + columnContentData.wpcf7_button.text_color + ";";
            columnContentFileButtonRule += "background-color: " + columnContentData.wpcf7_button.background_color + ";";
            columnContentFileButtonRule += "border-color: " + columnContentData.wpcf7_button.border_color + ";";

            var columnContentFileButtonHoverRule = "";

            columnContentFileButtonHoverRule += "color: " + columnContentData.wpcf7_button.text_color_hover + ";";
            columnContentFileButtonHoverRule += "background-color: " + columnContentData.wpcf7_button.background_color_hover + ";";
            columnContentFileButtonHoverRule += "border-color: " + columnContentData.wpcf7_button.border_color_hover + ";";

            _addColumnContentRule(formID, row, column, fieldClass + " label", columnContentFileButtonRule);
            _addColumnContentHoverRule(formID, row, column, fieldClass + " label", columnContentFileButtonHoverRule);
        }

        if (inputType == "submit") {
            var columnContentButtonRule = "";

            columnContentButtonRule += "font-size: " + columnContentData.wpcf7_button.font_size + ";";
            columnContentButtonRule += "height: " + columnContentData.wpcf7_button.height + ";";
            columnContentButtonRule += "width: " + columnContentData.wpcf7_button.width + ";";
            columnContentButtonRule += "border-width: " + columnContentData.wpcf7_button.border_width + ";";
            columnContentButtonRule += "border-radius: " + columnContentData.wpcf7_button.border_radius + ";";
            columnContentButtonRule += "border-style: solid;";
            columnContentButtonRule += "margin-top: " + columnContentData.wpcf7_button.margin_top + ";";
            columnContentButtonRule += "margin-right: " + columnContentData.wpcf7_button.margin_right + ";";
            columnContentButtonRule += "margin-bottom: " + columnContentData.wpcf7_button.margin_bottom + ";";
            columnContentButtonRule += "margin-left: " + columnContentData.wpcf7_button.margin_left + ";";
            columnContentButtonRule += "padding-top: " + columnContentData.wpcf7_button.padding_top + ";";
            columnContentButtonRule += "padding-right: " + columnContentData.wpcf7_button.padding_right + ";";
            columnContentButtonRule += "padding-bottom: " + columnContentData.wpcf7_button.padding_bottom + ";";
            columnContentButtonRule += "padding-left: " + columnContentData.wpcf7_button.padding_left + ";";
            columnContentButtonRule += "color: " + columnContentData.wpcf7_button.text_color + ";";
            columnContentButtonRule += "background-color: " + columnContentData.wpcf7_button.background_color + ";";
            columnContentButtonRule += "border-color: " + columnContentData.wpcf7_button.border_color + ";";

            var columnContentButtonHoverRule = "";

            columnContentButtonHoverRule += "color: " + columnContentData.wpcf7_button.text_color_hover + ";";
            columnContentButtonHoverRule += "background-color: " + columnContentData.wpcf7_button.background_color_hover + ";";
            columnContentButtonHoverRule += "border-color: " + columnContentData.wpcf7_button.border_color_hover + ";";

            _addColumnContentRule(formID, row, column, fieldClass, columnContentButtonRule);
            _addColumnContentHoverRule(formID, row, column, fieldClass, columnContentButtonHoverRule);
        } else {
            var columnContentRule = "";

            if (inputType == "acceptance" || inputType == "radio" || inputType == "file") {
                columnContentRule += "float: left;";
            }

            columnContentRule += "width: " + columnContentData.input_width + ";";
            columnContentRule += "height: " + columnContentData.input_height + ";";
            columnContentRule += "color: " + columnContentData.text_color + ";";
            columnContentRule += "font-size: " + columnContentData.font_size + ";";
            _addColumnContentRule(formID, row, column, fieldClass, columnContentRule);
            }
    }

    var _updateColumnContent = function (data) {
        var columnContentData = data.columnContentData;
        var formID = columnContentData.target.element_id;
        var row = columnContentData.target.row_number;
        var column = columnContentData.target.column_number;
        var contentType = columnContentData.type;
        var inputType = columnContentData.input_type;
        var fieldClass = columnContentData.field_class;

        var buttonHeight = columnContentData.wpcf7_button.height;
        var buttonWidth = columnContentData.wpcf7_button.width;
        var buttonBorderWidth = columnContentData.wpcf7_button.border_width;
        var buttonBorderRadius = columnContentData.wpcf7_button.border_radius;
        var buttonMarginTop = columnContentData.wpcf7_button.margin_top;
        var buttonMarginRight = columnContentData.wpcf7_button.margin_right;
        var buttonMarginBottom = columnContentData.wpcf7_button.margin_bottom;
        var buttonMarginLeft = columnContentData.wpcf7_button.margin_left;
        var buttonPaddingTop = columnContentData.wpcf7_button.padding_top;
        var buttonPaddingRight = columnContentData.wpcf7_button.padding_right;
        var buttonPaddingBottom = columnContentData.wpcf7_button.padding_bottom;
        var buttonPaddingLeft = columnContentData.wpcf7_button.padding_left;
        var buttonFontSize = columnContentData.wpcf7_button.font_size;

        var backgroundColor = columnContentData.background_color;
        var textColor = columnContentData.text_color;
        var textColorFocus = columnContentData.text_color_focus;
        var buttonTextColor = columnContentData.wpcf7_button.text_color;
        var buttonTextColorHover = columnContentData.wpcf7_button.text_color_hover;
        var buttonBackgroundColor = columnContentData.wpcf7_button.background_color;
        var buttonBackgroundColorHover = columnContentData.wpcf7_button.background_color_hover;
        var buttonBorderColor = columnContentData.wpcf7_button.border_color;
        var buttonBorderColorHover = columnContentData.wpcf7_button.border_color_hover;

        if (inputType == "acceptance" || inputType == "radio") {
            _updateColumnContentRule(formID, row, column, fieldClass, "float", "left");
        }

        if (inputType != "submit") {
            _updateColumnContentRule(formID, row, column, fieldClass, "width", columnContentData.input_width);
            _updateColumnContentRule(formID, row, column, fieldClass, "height", columnContentData.input_height);
            _updateColumnContentRule(formID, row, column, fieldClass, "font-size", columnContentData.font_size);
            _updateColumnContentRule(formID, row, column, fieldClass, "text-color", textColor);
            _updateColumnContentRule(formID, row, column, fieldClass, "background-color",backgroundColor);

            if (inputType == "file") {
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "height", buttonHeight);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "width", buttonWidth);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "border-width", buttonBorderWidth);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "border-radius", buttonBorderRadius);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "margin-top", buttonMarginTop);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "margin-right", buttonMarginRight);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "margin-bottom", buttonMarginBottom);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "margin-left", buttonMarginLeft);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "padding-top", buttonPaddingTop);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "padding-right", buttonPaddingRight);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "padding-bottom", buttonPaddingBottom);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "padding-left", buttonPaddingLeft);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "font-size", buttonFontSize);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "text-color", buttonTextColor);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "background-color", buttonBackgroundColor);
                _updateColumnContentRule(formID, row, column, fieldClass + " label", "border-color", buttonBorderColor);

                _updateColumnContentHoverRule(formID, row, column, fieldClass + " label", "text-color", buttonTextColorHover);
                _updateColumnContentHoverRule(formID, row, column, fieldClass + " label", "background-color", buttonBackgroundColorHover);
                _updateColumnContentHoverRule(formID, row, column, fieldClass + " label", "border-color", buttonBorderColorHover);
            }
        } else {
            _updateColumnContentRule(formID, row, column, fieldClass, "height", buttonHeight);
            _updateColumnContentRule(formID, row, column, fieldClass, "width", buttonWidth);
            _updateColumnContentRule(formID, row, column, fieldClass, "border-width", buttonBorderWidth);
            _updateColumnContentRule(formID, row, column, fieldClass, "border-radius", buttonBorderRadius);
            _updateColumnContentRule(formID, row, column, fieldClass, "margin-top", buttonMarginTop);
            _updateColumnContentRule(formID, row, column, fieldClass, "margin-right", buttonMarginRight);
            _updateColumnContentRule(formID, row, column, fieldClass, "margin-bottom", buttonMarginBottom);
            _updateColumnContentRule(formID, row, column, fieldClass, "margin-left", buttonMarginLeft);
            _updateColumnContentRule(formID, row, column, fieldClass, "padding-top", buttonPaddingTop);
            _updateColumnContentRule(formID, row, column, fieldClass, "padding-right", buttonPaddingRight);
            _updateColumnContentRule(formID, row, column, fieldClass, "padding-bottom", buttonPaddingBottom);
            _updateColumnContentRule(formID, row, column, fieldClass, "padding-left", buttonPaddingLeft);
            _updateColumnContentRule(formID, row, column, fieldClass, "font-size", buttonFontSize);
            _updateColumnContentRule(formID, row, column, fieldClass, "text-color", buttonTextColor);
            _updateColumnContentRule(formID, row, column, fieldClass, "background-color", buttonBackgroundColor);
            _updateColumnContentRule(formID, row, column, fieldClass, "border-color", buttonBorderColor);

            _updateColumnContentHoverRule(formID, row, column, fieldClass, "text-color", buttonTextColorHover);
            _updateColumnContentHoverRule(formID, row, column, fieldClass, "background-color", buttonBackgroundColorHover);
            _updateColumnContentHoverRule(formID, row, column, fieldClass, "border-color", buttonBorderColorHover);
        }

        _updateColumnContentFocusRule(formID, row, column, fieldClass, "text-color", textColorFocus);

        _updateColumnContentShortcode(formID, row, column, inputType, columnContentData);
        _updateSpanData(formID, columnContentData);
        _updateFormInDB(formID);
    }

    var _updateColumnContentShortcode = function (formID, row, column, inputType, columnContentData) {
        var $formToUpdateDB = $formsInPage[formID];
        var $columnToUpdateDB = $formToUpdateDB.find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"]");
        var shortcode = $columnToUpdateDB.find(".wpcf7-column-content").html()
        var isSetRequiredField = columnContentData.wpcf7_required_field;
        var onlyNumbers = columnContentData.wpcf7_only_numbers;
        var isSetDefaultCheck = columnContentData.wpcf7_default_check;
        var placeholder = columnContentData.wpcf7_placeholder;
        var fieldText = columnContentData.text;
        var listFields = columnContentData.wpcf7_list_fields;
        var fileMaxDim = columnContentData.wpcf7_file_max_dimensions;
        var buttonText = columnContentData.wpcf7_button.text;

        if(inputType == "text" || inputType == "menu" || inputType == "file" || inputType == "textarea") {   // Required field
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
        }

        if(inputType == "acceptance") {   // Required field (acceptance)
            // Puts (or removes) "optional" string
            var isAlreadyRequiredField = !/optional/.test(shortcode);
            if(isAlreadyRequiredField) {
                if(!isSetRequiredField) {
                    shortcode = shortcode.replace(/\]/, " optional]");
                }
            } else {
                if(isSetRequiredField) {
                    shortcode = shortcode.replace(" optional", "");
                    
                }
            }
        }

        if(inputType == "text" || inputType == "number") {   // Only number
            // Changes the shortcode in [number number-xxx ...] or vice versa
            if (onlyNumbers) {
                shortcode = shortcode.replace(/\[[a-z]+\*? [a-z]+/, "[number" + (isSetRequiredField? "*": "") + " number");
            } else {
                shortcode = shortcode.replace(/\[[a-z]+\*? [a-z]+/, "[text" + (isSetRequiredField? "*": "") + " text");
            }
        }

        if(inputType == "acceptance") {   // Default check
            // Puts (or removes) the "default:on" string
            var isAlreadyDefaultCheck = /default\:on/.test(shortcode);
            if(isAlreadyDefaultCheck) {
                if(!isSetDefaultCheck) {
                    shortcode = shortcode.replace(/default\:on/, "");
                }
            } else {
                if(isSetDefaultCheck) {
                    shortcode = shortcode.replace(/\[[a-z]+ [a-z]+\-[0-9]+ [a-z]+\:[\w]+\-[\w]+ /, /\[[a-z]+ [a-z]+\-[0-9]+ [a-z]+\:[\w]+\-[\w]+ /.exec(shortcode) + "default:on ");
                }
            }
        }

        if(inputType == "text" || inputType == "textarea") {   // Placeholder
            /* Puts the "placeholder" string and the placeholder value at the end 
            of the shortcode or removes it */
            var valueIsEmpty = placeholder === "";
            var thereIsPlaceholder = /placeholder/.test(shortcode);
            if(valueIsEmpty) {
                shortcode = shortcode.replace(/\splaceholder ".+"/, "");
            } else {
                if(!thereIsPlaceholder) {
                    shortcode = shortcode.replace(/\]/, " placeholder \"" + placeholder + "\"]");
                } else {
                    shortcode = shortcode.replace(/placeholder ".+"/, "placeholder \"" + placeholder + "\"");
                }
            }
        }

        if(inputType == "acceptance") {    // Checkbox text
            shortcode = shortcode.replace(/\][\s\S]+\[/, ']' + fieldText + '[');
            shortcode = shortcode.replace(/<p>\s<\/p>/g, "");
        }

        if (inputType == "menu" || inputType == "radio") {  // Lists
            shortcode = shortcode.replace(/\s[\"\'][\s\S]+[\"\']/, "");
            for (var field of listFields) {
                shortcode = shortcode.replace("]", " '" + field + "']");
            }
        }

        if (inputType == "file") {  // File max dimensions
            shortcode = shortcode.replace(/limit\:[\w]*/, "limit:" + fileMaxDim);
        }

        if (inputType == "file") {  // File types
            var fileTypesString = "filetypes:";
            for (var i = 0; i < listFields.length; i++) {
                listFields[i] = listFields[i].toLowerCase();
                fileTypesString += listFields[i];

                if (i != (listFields.length - 1)) {
                    fileTypesString += "|";
                }
            }
            shortcode = shortcode.replace(/filetypes\:[\S]*/, fileTypesString);
        }

        if (inputType == "file") {  // File caption
            var $fileCaption = $($.parseHTML(shortcode)[1]);
            $fileCaption.empty();
            $fileCaption.append(fieldText);
            shortcode = shortcode.replace(/\][\s\S]*/, "]" + $fileCaption[0].outerHTML);
        }

        if (inputType == "submit") {
            shortcode = shortcode.replace(/[\"\'][\s\S]*[\"\']/, '"' + buttonText + '"');
        }

        var $columnShortcode = $columnToUpdateDB.find(".wpcf7-column-content");
        $columnShortcode.empty();
        $columnShortcode.append(shortcode);

        // _updateFormInDB(formID);
    }

    /**
     * Updates multiple column content data.
     * @param  {string/int} formID
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
            $columnData.attr("data-wpcf7-required-field", columnContentData.wpcf7_required_field);
            $columnData.attr("data-wpcf7-only-numbers", columnContentData.wpcf7_only_numbers);
            $columnData.attr("data-wpcf7-default-check", columnContentData.wpcf7_default_check);
            $columnData.attr("data-wpcf7-placeholder", columnContentData.wpcf7_placeholder);
            $columnData.attr("data-wpcf7-file-max-dimensions", columnContentData.wpcf7_file_max_dimensions);

            if (columnContentData.input_type == "file") {
                $columnData.attr("data-wpcf7-file-types", columnContentData.wpcf7_list_fields);
            }

            $columnData.attr("data-wpcf7-input-width", columnContentData.input_width);
            $columnData.attr("data-wpcf7-input-height", columnContentData.input_height);
            $columnData.attr("data-wpcf7-font-size", columnContentData.font_size);
            $columnData.attr("data-text-color", columnContentData.text_color);
            $columnData.attr("data-text-color-focus", columnContentData.text_color_focus);

            $columnData.attr("data-button-text", columnContentData.wpcf7_button.text);
            $columnData.attr("data-button-text-font-size", columnContentData.wpcf7_button.font_size);
            $columnData.attr("data-button-height", columnContentData.wpcf7_button.height);
            $columnData.attr("data-button-width", columnContentData.wpcf7_button.width);
            $columnData.attr("data-button-border-width", columnContentData.wpcf7_button.border_width);
            $columnData.attr("data-button-border-radius", columnContentData.wpcf7_button.border_radius);
            $columnData.attr("data-button-margin-top", columnContentData.wpcf7_button.margin_top);
            $columnData.attr("data-button-margin-right", columnContentData.wpcf7_button.margin_right);
            $columnData.attr("data-button-margin-bottom", columnContentData.wpcf7_button.margin_bottom);
            $columnData.attr("data-button-margin-left", columnContentData.wpcf7_button.margin_left);
            $columnData.attr("data-button-padding-top", columnContentData.wpcf7_button.padding_top);
            $columnData.attr("data-button-padding-right", columnContentData.wpcf7_button.padding_right);
            $columnData.attr("data-button-padding-bottom", columnContentData.wpcf7_button.padding_bottom);
            $columnData.attr("data-button-padding-left", columnContentData.wpcf7_button.padding_left);
            $columnData.attr("data-button-text-color", columnContentData.wpcf7_button.text_color);
            $columnData.attr("data-button-text-color-hover", columnContentData.wpcf7_button.text_color_hover);
            $columnData.attr("data-button-background-color", columnContentData.wpcf7_button.background_color);
            $columnData.attr("data-button-background-color-hover", columnContentData.wpcf7_button.background_color_hover);
            $columnData.attr("data-button-border-color", columnContentData.wpcf7_button.border_color);
            $columnData.attr("data-button-border-color-hover", columnContentData.wpcf7_button.border_color_hover);
        })

        _updateSpanDataInDB(formID, columnContentData);
    }

    var _updateSpanDataInDB = function (formID, columnContentData) {
        var $formInDB = $formsInPage[formID];
        var row = columnContentData.target.row_number;
        var column = columnContentData.target.column_number;
        var $columnDataInDB = $formInDB.find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"]").find(".wpcf7-column[wpcf7-column-number=\"" + column + "\"]").find(".rex-wpcf7-column-content-data");

        $columnDataInDB.attr("data-background-color", columnContentData.background_color);
        $columnDataInDB.attr("data-wpcf7-required-field", columnContentData.wpcf7_required_field);
        $columnDataInDB.attr("data-wpcf7-only-numbers", columnContentData.wpcf7_only_numbers);
        $columnDataInDB.attr("data-wpcf7-default-check", columnContentData.wpcf7_default_check);
        $columnDataInDB.attr("data-wpcf7-placeholder", columnContentData.wpcf7_placeholder);
        $columnDataInDB.attr("data-wpcf7-file-max-dimensions", columnContentData.wpcf7_file_max_dimensions);

        if (columnContentData.input_type == "file") {
            $columnDataInDB.attr("data-wpcf7-file-types", columnContentData.wpcf7_list_fields);
        }

        $columnDataInDB.attr("data-wpcf7-input-width", columnContentData.input_width);
        $columnDataInDB.attr("data-wpcf7-input-height", columnContentData.input_height);
        $columnDataInDB.attr("data-wpcf7-font-size", columnContentData.font_size);
        $columnDataInDB.attr("data-text-color", columnContentData.text_color);
        $columnDataInDB.attr("data-text-color-focus", columnContentData.text_color_focus);

        $columnDataInDB.attr("data-button-text", columnContentData.wpcf7_button.text);
        $columnDataInDB.attr("data-button-text-font-size", columnContentData.wpcf7_button.font_size);
        $columnDataInDB.attr("data-button-height", columnContentData.wpcf7_button.height);
        $columnDataInDB.attr("data-button-width", columnContentData.wpcf7_button.width);
        $columnDataInDB.attr("data-button-border-width", columnContentData.wpcf7_button.border_width);
        $columnDataInDB.attr("data-button-border-radius", columnContentData.wpcf7_button.border_radius);
        $columnDataInDB.attr("data-button-margin-top", columnContentData.wpcf7_button.margin_top);
        $columnDataInDB.attr("data-button-margin-right", columnContentData.wpcf7_button.margin_right);
        $columnDataInDB.attr("data-button-margin-bottom", columnContentData.wpcf7_button.margin_bottom);
        $columnDataInDB.attr("data-button-margin-left", columnContentData.wpcf7_button.margin_left);
        $columnDataInDB.attr("data-button-padding-top", columnContentData.wpcf7_button.padding_top);
        $columnDataInDB.attr("data-button-padding-right", columnContentData.wpcf7_button.padding_right);
        $columnDataInDB.attr("data-button-padding-bottom", columnContentData.wpcf7_button.padding_bottom);
        $columnDataInDB.attr("data-button-padding-left", columnContentData.wpcf7_button.padding_left);
        $columnDataInDB.attr("data-button-text-color", columnContentData.wpcf7_button.text_color);
        $columnDataInDB.attr("data-button-text-color-hover", columnContentData.wpcf7_button.text_color_hover);
        $columnDataInDB.attr("data-button-background-color", columnContentData.wpcf7_button.background_color);
        $columnDataInDB.attr("data-button-background-color-hover", columnContentData.wpcf7_button.background_color_hover);
        $columnDataInDB.attr("data-button-border-color", columnContentData.wpcf7_button.border_color);
        $columnDataInDB.attr("data-button-border-color-hover", columnContentData.wpcf7_button.border_color_hover);

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
                input_width: "100%",
                input_height: "100%",
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