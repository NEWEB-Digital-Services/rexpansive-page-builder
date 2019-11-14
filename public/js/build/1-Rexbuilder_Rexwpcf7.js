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

        _fixRowNumbersAndClasses($formToAddRow);
        _saveAddedRow(formID, numberRowBefore);
    }

    var _addClonedColumnRow = function (formID, clonedColumnNumber, numberRowBefore) {
        var $formToAddRow = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-form"); // There may be more than 1 form
        var $rowBefore = $formToAddRow.find(".wpcf7-row[wpcf7-row-number=\"" + numberRowBefore + "\"]");
        var $rowToAdd = $($rowBefore[0]).clone();
        
        $rowToAdd.insertAfter($rowBefore);  // Inserting the new row in the form
        _fixRowNumbersAndClasses($formToAddRow);      // After this function row numbers are now correct

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

        _fixRowNumbersAndClasses($formToDeleteRow);
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
            $(this).find(".wpcf7-row").each(function(index) {
                $(this).attr("wpcf7-row-number", index + 1);
            });
        })
    }

    var _fixRowNumbersAndClasses = function ($forms) {
        $forms.each(function() {
            var formID = $(this).parents(".rex-element-wrapper").attr("data-rex-element-id");
            $(this).find(".wpcf7-row").each(function(index) {
                var $formRow = $(this);

                // Removing all styles of the column
                $formRow.find(".wpcf7-column").each(function () {
                    var $formColumn = $(this);

                    _removeColumnContentStyle($formColumn);
                });

                $formRow.attr("wpcf7-row-number", index + 1);

                // Adding all styles of the column
                $formRow.find(".wpcf7-column").each(function () {
                    var $formColumn = $(this);
                    _addColumnContentStyle($formColumn);
                });
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

        var data = {
            editPoint: {
                element_id: formID,
                column_number:column,
                row_number: row
            }
        }

        _updateFormInDB(formID);
        // _updateFormInDBNoRefresh(formID);
    }

    var _saveNewRow = function (formID, $newRow) {
        var $formToAddRow = $formsInPage[formID];
        var $lastRow = $formToAddRow.find(".wpcf7-row").last();

        $newRow.insertAfter($lastRow);

        _updateFormInDBNoRefresh(formID);
    }

    var _saveAddedRow = function (formID, rowNumber) {
        var $formToAddRow = $formsInPage[formID];
        var $rowBefore = $formToAddRow.find(".wpcf7-row[wpcf7-row-number=\"" + rowNumber + "\"]");
        var $rowToAdd = $rowBefore.clone();

        $rowToAdd.insertAfter($rowBefore);
        _fixRowNumbers($formToAddRow);
        _updateFormInDBNoRefresh(formID);
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

        _updateFormInDBNoRefresh(formID);
    }

    var _saveDeletingRow = function (formID, rowNumberToDelete) {
        var $formToDeleteRow = $formsInPage[formID];
        var $rowToDelete = $formToDeleteRow.find(".wpcf7-row[wpcf7-row-number=\"" + rowNumberToDelete + "\"]");

        $rowToDelete.remove();

        _fixRowNumbers($formToDeleteRow);
        _updateFormInDBNoRefresh(formID);
    }

    var _saveDeletingColumnContent = function (formID, rowNumberToDelete, columnNumberToDelete) {
        var $formToDeleteColumn = $formsInPage[formID];
        var $columnToDelete = $formToDeleteColumn.find(".wpcf7-row[wpcf7-row-number=\"" + rowNumberToDelete + "\"]").find(".wpcf7-column[wpcf7-column-number=\"" + columnNumberToDelete + "\"]");

        $columnToDelete.empty();
        var $plusButton = tmpl("tmpl-plus-button-inside-wpcf7-row", {});
        $columnToDelete.append($plusButton);

        _updateFormInDBNoRefresh(formID);
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

    var _updateFormInDBNoRefresh = function (formID) {
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
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + fieldClass + "{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            // styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType + "{" + property + "}", styleSheet.cssRules.length);
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + fieldClass + "{" + property + "}", styleSheet.cssRules.length);
        }
    }

    // Style is changed to the column content, not to the whole column
    var _addColumnContentFocusRule = function (formID, row, column, fieldClass, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + fieldClass + ":focus{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + fieldClass + ":focus{" + property + "}", styleSheet.cssRules.length);
        }
    }

    // Style is changed to the column content, not to the whole column
    var _addColumnContentHoverRule = function (formID, row, column, fieldClass, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + fieldClass + ":hover{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + fieldClass + ":hover{" + property + "}", styleSheet.cssRules.length);
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
    var _updateColumnContentRule = function (formID, row, column, selector, rule, value) {

        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            // if (
            //     //chrome firefox
            //     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + contentType ||
            //     // edge
            //     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + contentType
            // ) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + selector ||
                // edge
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + selector
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
    var _updateColumnContentFocusRule = function (formID, row, column, selector, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            // if (
            //     //chrome firefox
            //     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + selector + ":focus" ||
            //     // edge
            //     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + selector + ":focus"
            // ) {
            if (
                // chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + selector + ":focus" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper ." + selector + ":focus"
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
    var _updateColumnContentHoverRule = function (formID, row, column, selector, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            // if (
            //     //chrome firefox
            //     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + selector + ":focus" ||
            //     // edge
            //     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + selector + ":focus"
            // ) {
            if (
                // chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + selector + ":hover" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper ." + selector + ":hover"
            ) {
                switch (rule) {
                    case "text-color":
                        styleSheet.cssRules[i].style.color = value;
                        break;
                    case "background-color":
                        styleSheet.cssRules[i].style.backgroundColor = value;
                        break;
                    case "border-color":
                        styleSheet.cssRules[i].style.borderColor = value;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
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

    var _removeColumnContentRule = function (formID, row, column, selector) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + selector) {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    var _removeColumnContentHoverRule = function (formID, row, column, selector) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + selector + ":hover") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    var _removeColumnContentFocusRule = function (formID, row, column, selector) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] ." + selector + ":focus") {
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
            // _addFormInputsCSSRules(formID, formData);
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
        
        _updateFormContent(data.elementData);

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
            $formData.attr("data-wpcf7-content-width", formData.content.width);
            $formData.attr("data-wpcf7-content-height", formData.content.height);
            $formData.attr("data-wpcf7-content-font-size", formData.content.font_size);
            $formData.attr("data-wpcf7-content-border-width", formData.content.border_width);
            $formData.attr("data-wpcf7-content-text-color", formData.content.text_color);
            $formData.attr("data-wpcf7-content-text-color-hover", formData.content.text_color_hover);
            $formData.attr("data-wpcf7-content-background-color", formData.content.background_color);
            $formData.attr("data-wpcf7-content-background-color-hover", formData.content.background_color_hover);
            $formData.attr("data-wpcf7-content-border-color", formData.content.border_color);
            $formData.attr("data-wpcf7-content-border-color-hover", formData.content.border_color_hover);
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Form content functions
    
    var _updateFormContentLive = function (data) {
        var elementID = data.element_target.element_id;
        Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .wpcf7-column").each( function () {
            var $currentColumn = $(this);
            if ($currentColumn.find(".wpcf7-add-new-form-content").length == 0) {
                var spanDataExists = $currentColumn.find(".rex-wpcf7-column-content-data").length != 0 ? true : false;
                var currentColumnData = _generateColumnContentData($currentColumn, spanDataExists);
                var updateData = {
                    target: currentColumnData.target,
                    content: currentColumnData,
                    propertyType: data.propertyType,
                    propertyName: data.propertyName,
                    newValue: data.newValue
                }
                _updateColumnContentLive(updateData);
            }
        })
    }
    
    var _updateFormContent = function (data) {
        var formData = data;
        var elementID = data.element_target.element_id;
        Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .wpcf7-column").each( function () {
            var $currentColumn = $(this);
            if ($currentColumn.find(".wpcf7-add-new-form-content").length == 0) {
                var spanDataExists = $currentColumn.find(".rex-wpcf7-column-content-data").length != 0 ? true : false;
                var currentColumnData = _generateColumnContentData($currentColumn, spanDataExists);
                
                currentColumnData.input_width = formData.wpcf7_data.content.width;
                currentColumnData.input_height = formData.wpcf7_data.content.height;
                currentColumnData.font_size = formData.wpcf7_data.content.font_size;
                currentColumnData.border_width = formData.wpcf7_data.content.border_width;
                currentColumnData.text_color = formData.wpcf7_data.content.text_color;
                currentColumnData.text_color_hover = formData.wpcf7_data.content.text_color_hover;
                currentColumnData.background_color = formData.wpcf7_data.content.background_color;
                currentColumnData.background_color_hover = formData.wpcf7_data.content.background_color_hover;
                currentColumnData.border_color = formData.wpcf7_data.content.border_color;
                currentColumnData.border_color_hover = formData.wpcf7_data.content.border_color_hover;

                var updateData = {
                    columnContentData: currentColumnData
                }
                _updateColumnContent(updateData);
            }
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
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

        // Taking data form Rexelement span data
        var $rexelementSpanData = $formColumn.parents(".rex-element-wrapper").find(".rex-element-data");
        $spanData.attr("data-background-color", $rexelementSpanData.attr("data-wpcf7-content-background-color"));
        $spanData.attr("data-wpcf7-input-width", $rexelementSpanData.attr("data-wpcf7-content-width"));
        $spanData.attr("data-wpcf7-input-height", $rexelementSpanData.attr("data-wpcf7-content-height"));
        $spanData.attr("data-text-color", $rexelementSpanData.attr("data-wpcf7-content-text-color"));
        $spanData.attr("data-border-color", $rexelementSpanData.attr("data-wpcf7-content-border-color"));
        $spanData.attr("data-wpcf7-font-size", $rexelementSpanData.attr("data-wpcf7-content-font-size"));
        $spanData.attr("data-wpcf7-border-width", $rexelementSpanData.attr("data-wpcf7-content-border-width"));
        $spanData.attr("data-text-color-hover", $rexelementSpanData.attr("data-wpcf7-content-text-color-hover"));
        $spanData.attr("data-background-color-hover", $rexelementSpanData.attr("data-wpcf7-content-background-color-hover"));
        $spanData.attr("data-border-color-hover", $rexelementSpanData.attr("data-wpcf7-content-border-color-hover"));

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

    var _removeColumnContentStyle = function ($formColumn) {
        var formID = $formColumn.parents(".rex-element-wrapper").attr("data-rex-element-id");
        var rowNumber = $formColumn.parents(".wpcf7-row").attr("wpcf7-row-number");
        var columnNumber = $formColumn.attr("wpcf7-column-number");

        if ($formColumn.find(".wpcf7-add-new-form-content").length == 0) {
            var fieldClass = /[a-z]+\-[0-9]+/.exec($formColumn.find(".wpcf7-form-control")[0].classList);
            if (null == fieldClass) {
                fieldClass = /[a-z]+\-[0-9]+/.exec($formColumn.find(".wpcf7-form-control-wrap")[0].classList)[0];
            } else {
                fieldClass = fieldClass[0];
            }

            var inputType = /[a-z]+/.exec(fieldClass)[0];
            inputType = (inputType == "menu") ? "select" : inputType;

            var cssSelector;
            switch (inputType) {
                case "text":
                    // if ($formColumn.find(".rex-wpcf7-column-content-data").attr("data-wpcf7-only-numbers") == "true") {
                    //     cssSelector = "wpcf7-number";
                    // } else {
                    //     cssSelector = "wpcf7-text";
                    // }
                    // break;
                case "textarea":
                case "number":
                case "select":
                    cssSelector = "wpcf7-" + inputType;
                    break;
                case "acceptance":
                case "submit":
                case "file":
                    cssSelector = fieldClass;
                    break;
                case "radio":
                    cssSelector =  "wpcf7-form-control-wrap."+ fieldClass;
                    break;
                default:
                  break;
            }

            _removeColumnContentRule(formID, rowNumber, columnNumber, cssSelector);
            _removeColumnContentHoverRule (formID, rowNumber, columnNumber, cssSelector);
            _removeColumnContentFocusRule (formID, rowNumber, columnNumber, cssSelector);
        }
    }

    var _updateColumnContentLive = function (data) {
    	var formID = data.target.element_id;
    	var row = data.target.row_number;
    	var column = data.target.column_number;
        var $formColumns = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number='" + row + "'] .wpcf7-column[wpcf7-column-number='" + column + "']");   // > 1 if there are > 1 forms with the same ID in page
    	// var contentType = data.content.type;
        var fieldClass = data.content.field_class;
        var inputType = data.content.input_type;
        var propertyName = data.propertyName;
        var propertyType = data.propertyType;
        var newValue = data.newValue;

        var isSetRequiredField = String(data.content.wpcf7_required_field) == "true";
        var onlyNumbers = String(data.content.wpcf7_only_numbers) == "true";

        var cssSelector;
        switch (inputType) {
            case "text":
            case "textarea":
            case "number":
            case "select":
                cssSelector = "wpcf7-" + inputType;
                break;
            case "acceptance":
            case "submit":
            case "file":
                cssSelector = fieldClass;
                break;
            case "radio":
                cssSelector =  "wpcf7-form-control-wrap."+ fieldClass;
                break;
            default:
              break;
        }

        switch (propertyType) {
            case "background-color":
            case "width":
            case "height":
            case "font-size":
            case "border-width":
            case "text-color":
            case "border-color":
                _updateColumnContentRule(formID, row, column, cssSelector, propertyName, newValue);
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
                    _updateColumnContentRule(formID, row, column, cssSelector + " label", propertyName, newValue);
                } else {
                    _updateColumnContentRule(formID, row, column, cssSelector, propertyName, newValue);
                }
                break;
            case "text-color-hover":
            case "background-color-hover":
            case "border-color-hover":
                _updateColumnContentHoverRule(formID, row, column, cssSelector, propertyName, newValue);
            case "text-focus":
                _updateColumnContentFocusRule(formID, row, column, cssSelector, propertyName, newValue);
                break;
            case "button-text-color-hover":
            case "button-background-color-hover":
            case "button-border-color-hover":
                if (inputType == "file") {
                   _updateColumnContentHoverRule(formID, row, column, cssSelector + " label", propertyName, newValue);
                } else {
                    _updateColumnContentHoverRule(formID, row, column, cssSelector, propertyName, newValue);
                }
                break;
            case "wpcf7-required":
                if (isSetRequiredField) {   // Setting required field in the DOM element
                    switch (inputType) {
                        case "text":
                            if (onlyNumbers) {
                                $formColumns.find(".wpcf7-number").addClass("wpcf7-validates-as-required");
                                $formColumns.find(".wpcf7-number").attr("aria-required", "true");
                            } else {
                                $formColumns.find(".wpcf7-text").addClass("wpcf7-validates-as-required");
                                $formColumns.find(".wpcf7-text").attr("aria-required", "true");
                            }
                            break;
                        case "number":
                        case "select":
                        case "file":
                        case "textarea":
                            $formColumns.find(".wpcf7-" + inputType).addClass("wpcf7-validates-as-required");
                            $formColumns.find(".wpcf7-" + inputType).attr("aria-required", "true");
                            break;
                        case "acceptance":
                            $formColumns.find(".wpcf7-acceptance").removeClass("optional");
                            break;
                        default:
                            break;
                    }   
                } else {    // Unsetting required field in the DOM element
                    switch (inputType) {
                        case "text":
                            if (onlyNumbers) {
                                $formColumns.find(".wpcf7-number" ).removeClass("wpcf7-validates-as-required");
                                $formColumns.find(".wpcf7-number").removeAttr("aria-required");
                            } else {
                                $formColumns.find(".wpcf7-text").removeClass("wpcf7-validates-as-required");
                                $formColumns.find(".wpcf7-text").removeAttr("aria-required");
                            }
                            break;
                        case "number":
                        case "select":
                        case "file":
                        case "textarea":
                            $formColumns.find(".wpcf7-" + inputType).removeClass("wpcf7-validates-as-required");
                            $formColumns.find(".wpcf7-" + inputType).removeAttr("aria-required");
                            break;
                        case "acceptance":
                            $formColumns.find(".wpcf7-acceptance").addClass("optional");
                            break;
                        default:
                            break;
                    }
                }
                break;
            case "wpcf7-only-numbers":
                if (onlyNumbers) {  // Setting only numbers
                    inputType = "text";
                    if (inputType == "text") {
                        var $input = $formColumns.find(".wpcf7-text");

                        $input.attr("type", "number");
                        $input.attr("name", "number-" + /[0-9]+/.exec($input.attr("name"))[0]);
                        $input.removeClass("text-" + /[0-9]+/.exec($input.attr("name"))[0]);
                        $input.addClass("number-" + /[0-9]+/.exec($input.attr("name"))[0]);
                        $input.removeClass("wpcf7-text");
                        $input.addClass("wpcf7-number");
                        $input.addClass("wpcf7-validates-as-number");
                    }
                } else {    // Unsetting only numbers
                    inputType = "number";
                    if (inputType == "number") {
                        var $input = $formColumns.find(".wpcf7-number");

                        $input.attr("type", "text");
                        $input.attr("name", "text-" + /[0-9]+/.exec($input.attr("name"))[0]);
                        $input.removeClass("number-" + /[0-9]+/.exec($input.attr("name"))[0]);
                        $input.addClass("text-" + /[0-9]+/.exec($input.attr("name"))[0]);
                        $input.removeClass("wpcf7-number");
                        $input.addClass("wpcf7-text");
                        $input.removeClass("wpcf7-validates-as-number");
                    }
                }

                $formColumns.each(function() {
                    _removeColumnContentStyle($(this));
                    _addColumnContentStyle($(this));
                });
                break;
            case "wpcf7-placeholder":
                switch (inputType) {
                    case "text":
                    case "number":
                    case "textarea":
                        $formColumns.find(".wpcf7-" + inputType).attr("placeholder", newValue);
                        break;
                    case "select":
                        $formColumns.find(".wpcf7-" + inputType + " option[disabled='disabled']").text(newValue);
                        break;
                    default:
                        break;
                }
                break;
            case "wpcf7-default-check":
                $formColumns.find(".wpcf7-acceptance input[type='checkbox']").prop("checked", newValue);
                break;
            case "wpcf7-text-editor":
                newValue = newValue.replace(/<p>\s<\/p>/g, "");
                switch (inputType) {
                    case "acceptance":
                        $formColumns.find(".wpcf7-list-item-label").html(newValue);
                        break;
                    case "file":
                        $formColumns.find(".wpcf7-file-caption").html(newValue);
                        break;
                    default:
                        break;
                }
                break;
            case "wpcf7-file-dimensions":
                // It's not possible to change it live, beacuse this data is processed by CF7.
                break;
            case "wpcf7-list":
                var formID = $formColumns.parents(".rex-element-wrapper").eq(0).attr("data-rex-element-id");
                var numberOfFormsInPage = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id='" + formID + "']").length;
                switch (inputType) {
                    case "select":
                        for (var i = 0; i < numberOfFormsInPage; i++) {
                            for (var j = 0; j < newValue.length; j++) {
                                $formColumns.find(".wpcf7-select option").not("[disabled='disabled']").eq(j).text(newValue[j]);
                                $formColumns.find(".wpcf7-select option").not("[disabled='disabled']").eq(j).val(newValue[j]);
                            }
                        }
                        break;
                    case "radio":
                        for (var i = 0; i < numberOfFormsInPage; i++) {
                            for (var j = 0; j < newValue.length; j++) {
                                $formColumns.find(".wpcf7-radio .wpcf7-list-item").removeClass("first");
                                $formColumns.find(".wpcf7-radio .wpcf7-list-item").removeClass("last");
                                $formColumns.find(".wpcf7-radio .wpcf7-list-item").eq(j).find("input").val(newValue[j]);
                                $formColumns.find(".wpcf7-radio .wpcf7-list-item").eq(j).find(".wpcf7-list-item-label").text(newValue[j]);
                            }
                        }
                        // $formColumns.find(".wpcf7-radio .wpcf7-list-item").eq(0).addClass("first");
                        // $formColumns.find(".wpcf7-radio .wpcf7-list-item").eq(newValue.length - 1).addClass("last");
                        break;
                    case "file":
                        for (var i = 0; i < newValue.length; i++) {
                            newValue[i] = "." + newValue[i];
                        }
                        $formColumns.find(".wpcf7-file").attr("accept", newValue);
                        break;
                    default:
                        break;
                }
                break;
            case "wpcf7-list-add":
                switch (inputType) {
                    case "select":
                        var $newOption = $(document.createElement("option"));
                        $newOption.attr("value", "");
                        $formColumns.find(".wpcf7-select").append($newOption);
                        break;
                    case "radio":
                        var numberOfRadios = $formColumns.find(".wpcf7-radio").eq(0).find(".wpcf7-list-item").length;
                        var $newRadio = $formColumns.find(".wpcf7-radio .wpcf7-list-item.last").eq(0).clone();

                        $formColumns.find(".wpcf7-radio .wpcf7-list-item.last").removeClass("last");
                        $newRadio.find("[type='radio']").attr("id", "wpcf7-radio-" + (numberOfRadios + 1));
                        $newRadio.find(".wpcf7-list-item-label").attr("for", "wpcf7-radio-" + (numberOfRadios + 1));
                        $newRadio.find(".wpcf7-list-item-label").text("");
                        $newRadio.find("[type='radio']").val("");
                        $formColumns.find(".wpcf7-radio").append($newRadio);
                        break;
                    case "file":
                        $formColumns.find(".wpcf7-file").attr("accept", $formColumns.find(".wpcf7-file").attr("accept") + ",");
                        break;
                    default:
                        break;
                }
                break;
            case "wpcf7-list-remove":
                var numberOfSelects = $formColumns.find(".wpcf7-select").length;
                newValue = parseInt(newValue);
                switch (inputType) {
                    case "select":
                        for (var i = 0; i < numberOfSelects; i++) {
                            $formColumns.find(".wpcf7-select").eq(i).find("option").eq(newValue).remove();
                        }
                        break;
                    case "radio":
                        break;
                    case "file":
                        break;
                    default:
                        break;
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
     * @param {jQuery} $formColumn Column of the form we are editing
     * @param {boolean} spanDataExists Does the span containing the data exist? 
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
            border_width: "",
            background_color: "",
            background_color_hover: "",
            border_color: "",
            border_color_hover: "",
            text_color: "",
            text_color_hover: "",
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
        // columnContentData.type = $formColumn.find(".wpcf7-form-control").prop("nodeName").toLowerCase();

        // Field class
        columnContentData.field_class = /[a-z]+\-[0-9]+/.exec($formColumn.find(".wpcf7-form-control")[0].classList);
        if(null == columnContentData.field_class) {
            columnContentData.field_class = /[a-z]+\-[0-9]+/.exec($formColumn.find(".wpcf7-form-control-wrap")[0].classList)[0];
        } else {
            columnContentData.field_class = columnContentData.field_class[0];
        }
        
        // Input type
        columnContentData.input_type = /[a-z]+/.exec(columnContentData.field_class)[0];
        columnContentData.input_type = (columnContentData.input_type == "menu") ? "select" : columnContentData.input_type;
        
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
                if($(field).val() != "" && !$(field).attr("disabled")) {
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
            columnContentData.wpcf7_required_field = (columnContentDataEl.getAttribute("data-wpcf7-required-field") ? columnContentDataEl.getAttribute("data-wpcf7-required-field") : defaultColumnContentValues.wpcf7_required_field);

            // Only numbers
            columnContentData.wpcf7_only_numbers = (columnContentDataEl.getAttribute("data-wpcf7-only-numbers") ? columnContentDataEl.getAttribute("data-wpcf7-only-numbers").toString() : defaultColumnContentValues.wpcf7_only_numbers);

            // Default check
            columnContentData.wpcf7_default_check = (columnContentDataEl.getAttribute("data-wpcf7-default-check") ? columnContentDataEl.getAttribute("data-wpcf7-default-check").toString() : defaultColumnContentValues.wpcf7_default_check);

            // Placeholder
            columnContentData.wpcf7_placeholder = (columnContentDataEl.getAttribute("data-wpcf7-placeholder") ? columnContentDataEl.getAttribute("data-wpcf7-placeholder").toString() : defaultColumnContentValues.wpcf7_placeholder);

            // File max dimensions
            columnContentData.wpcf7_file_max_dimensions = (columnContentDataEl.getAttribute("data-wpcf7-file-max-dimensions") ? columnContentDataEl.getAttribute("data-wpcf7-file-max-dimensions").toString() : defaultColumnContentValues.wpcf7_file_max_dimensions);

            // File types
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_list_fields = (columnContentDataEl.getAttribute("data-wpcf7-file-types") ? columnContentDataEl.getAttribute("data-wpcf7-file-types").toString().split(",") : ["png", "jpg", "jpeg", "pdf"]);
            }

        	// Width & height
            columnContentData.input_width = (columnContentDataEl.getAttribute("data-wpcf7-input-width") ? columnContentDataEl.getAttribute("data-wpcf7-input-width").toString() : $formColumn.find("." + columnContentData.field_class).eq(0).css("width"));    // @toedit Non del tutto corretto

            columnContentData.input_height = (columnContentDataEl.getAttribute("data-wpcf7-input-height") ? columnContentDataEl.getAttribute("data-wpcf7-input-height").toString() : $formColumn.find("." + columnContentData.field_class).eq(0).css("height"));    // @toedit Non del tutto corretto

            // Font size
            columnContentData.font_size = (columnContentDataEl.getAttribute("data-wpcf7-font-size") ? columnContentDataEl.getAttribute("data-wpcf7-font-size").toString() : defaultColumnContentValues.font_size);

            // Background color
        	columnContentData.background_color = (columnContentDataEl.getAttribute("data-background-color") ? columnContentDataEl.getAttribute("data-background-color").toString() : $formColumn.find("." + columnContentData.field_class).eq(0).css("background-color"));

            // Text color
            columnContentData.text_color = (columnContentDataEl.getAttribute("data-text-color") ? columnContentDataEl.getAttribute("data-text-color").toString() : $formColumn.find("." + columnContentData.field_class).eq(0).css("color"));

            // Text color focus
            columnContentData.text_color_focus = (columnContentDataEl.getAttribute("data-text-color-focus") ? columnContentDataEl.getAttribute("data-text-color-focus").toString() : defaultColumnContentValues.text_color_focus);

            // ONLY GENERAL MODAL OPTIONS
            
            // Border width
            columnContentData.border_width = (columnContentDataEl.getAttribute("data-wpcf7-border-width") ? columnContentDataEl.getAttribute("data-wpcf7-border-width").toString() : defaultColumnContentValues.border_width);

            // Background color hover
            columnContentData.background_color_hover = (columnContentDataEl.getAttribute("data-background-color-hover") ? columnContentDataEl.getAttribute("data-background-color-hover").toString() : "");

            // Text color hover
            columnContentData.text_color_hover = (columnContentDataEl.getAttribute("data-text-color-hover") ? columnContentDataEl.getAttribute("data-text-color-hover").toString() : "");

            // Border color
            columnContentData.border_color = (columnContentDataEl.getAttribute("data-border-color") ? columnContentDataEl.getAttribute("data-border-color").toString() : $formColumn.find("." + columnContentData.field_class).eq(0).css("border-color"));

            // Border color hover
            columnContentData.border_color_hover = (columnContentDataEl.getAttribute("data-border-color-hover") ? columnContentDataEl.getAttribute("data-border-color-hover").toString() : "");

            /* BUTTON */
            // Button Text
            if (columnContentDataEl.getAttribute("data-button-text")) {
                columnContentData.wpcf7_button.text = columnContentDataEl.getAttribute("data-button-text").toString()
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.text = "Choose a file";
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.text = "Send";
                }
            }

            // Button font size
            if (columnContentDataEl.getAttribute("data-button-text-font-size")) {
                columnContentData.wpcf7_button.font_size = columnContentDataEl.getAttribute("data-button-text-font-size").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.font_size = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("font-size");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.font_size = $formColumn.find("." + columnContentData.field_class).eq(0).css("font-size");
                }
            }

            // Button height
            if (columnContentDataEl.getAttribute("data-button-height")) {
                columnContentData.wpcf7_button.height = columnContentDataEl.getAttribute("data-button-height").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.height = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("height");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.height = $formColumn.find("." + columnContentData.field_class).eq(0).css("height");
                }
            }

            // Button width
            if (columnContentDataEl.getAttribute("data-button-width")) {
                columnContentData.wpcf7_button.width = columnContentDataEl.getAttribute("data-button-width").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.width = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("width");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.width = $formColumn.find("." + columnContentData.field_class).eq(0).css("width");
                }
            }

            // Button border width
            if (columnContentDataEl.getAttribute("data-button-border-width")) {
                columnContentData.wpcf7_button.border_width = columnContentDataEl.getAttribute("data-button-border-width").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.border_width = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("border-width");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.border_width = $formColumn.find("." + columnContentData.field_class).eq(0).css("border-width");
                }
            }

            // Button border radius
            if (columnContentDataEl.getAttribute("data-button-border-radius")) {
                columnContentData.wpcf7_button.border_radius = columnContentDataEl.getAttribute("data-button-border-radius").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.border_radius = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("border-radius");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.border_radius = $formColumn.find("." + columnContentData.field_class).eq(0).css("border-radius");
                }
            }

            // Button margin
            if (columnContentDataEl.getAttribute("data-button-margin-top")) {
                columnContentData.wpcf7_button.margin_top = columnContentDataEl.getAttribute("data-button-margin-top").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.margin_top = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("margin-top");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.margin_top = $formColumn.find("." + columnContentData.field_class).eq(0).css("margin-top");
                }
            }

            if (columnContentDataEl.getAttribute("data-button-margin-right")) {
                columnContentData.wpcf7_button.margin_right = columnContentDataEl.getAttribute("data-button-margin-right").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.margin_right = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("margin-right");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.margin_right = $formColumn.find("." + columnContentData.field_class).eq(0).css("margin-right");
                }
            }
            
            if (columnContentDataEl.getAttribute("data-button-margin-bottom")) {
                columnContentData.wpcf7_button.margin_bottom = columnContentDataEl.getAttribute("data-button-margin-bottom").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.margin_bottom = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("margin-bottom");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.margin_bottom = $formColumn.find("." + columnContentData.field_class).eq(0).css("margin-bottom");
                }
            }

            if (columnContentDataEl.getAttribute("data-button-margin-left")) {
                columnContentData.wpcf7_button.margin_left = columnContentDataEl.getAttribute("data-button-margin-left").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.margin_left = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("margin-left");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.margin_left = $formColumn.find("." + columnContentData.field_class).eq(0).css("margin-left");
                }
            }

            // Button padding
            if (columnContentDataEl.getAttribute("data-button-padding-top")) {
                columnContentData.wpcf7_button.padding_top = columnContentDataEl.getAttribute("data-button-padding-top").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.padding_top = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("padding-top");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.padding_top = $formColumn.find("." + columnContentData.field_class).eq(0).css("padding-top");
                }
            }

            if (columnContentDataEl.getAttribute("data-button-padding-right")) {
                columnContentData.wpcf7_button.padding_right = columnContentDataEl.getAttribute("data-button-padding-right").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.padding_right = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("padding-right");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.padding_right = $formColumn.find("." + columnContentData.field_class).eq(0).css("padding-right");
                }
            }

            if (columnContentDataEl.getAttribute("data-button-padding-bottom")) {
                columnContentData.wpcf7_button.padding_bottom = columnContentDataEl.getAttribute("data-button-padding-bottom").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.padding_bottom = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("padding-bottom");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.padding_bottom = $formColumn.find("." + columnContentData.field_class).eq(0).css("padding-bottom");
                }
            }

            if (columnContentDataEl.getAttribute("data-button-padding-left")) {
                columnContentData.wpcf7_button.padding_left = columnContentDataEl.getAttribute("data-button-padding-left").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.padding_left = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("padding-left");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.padding_left = $formColumn.find("." + columnContentData.field_class).eq(0).css("padding-left");
                }
            }

            // Button text color
            if (columnContentDataEl.getAttribute("data-button-text-color")) {
                columnContentData.wpcf7_button.text_color = columnContentDataEl.getAttribute("data-button-text-color").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.text_color = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("color");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.text_color = $formColumn.find("." + columnContentData.field_class).eq(0).css("color");
                }
            }

            // Button text color hover
            columnContentData.wpcf7_button.text_color_hover = (columnContentDataEl.getAttribute("data-button-text-color-hover") ? columnContentDataEl.getAttribute("data-button-text-color-hover").toString() : defaultColumnContentValues.wpcf7_button.text_color_hover);

            // Button background color
            if (columnContentDataEl.getAttribute("data-button-background-color")) {
                columnContentData.wpcf7_button.background_color = columnContentDataEl.getAttribute("data-button-background-color").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.background_color = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("background-color");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.background_color = $formColumn.find("." + columnContentData.field_class).eq(0).css("background-color");
                }
            }

            // Button background color hover
            columnContentData.wpcf7_button.background_color_hover = (columnContentDataEl.getAttribute("data-button-background-color-hover") ? columnContentDataEl.getAttribute("data-button-background-color-hover").toString() : defaultColumnContentValues.wpcf7_button.background_color_hover);

            // Button border color
            if (columnContentDataEl.getAttribute("data-button-border-color")) {
                columnContentData.wpcf7_button.border_color = columnContentDataEl.getAttribute("data-button-border-color").toString();
            } else {
                if (columnContentData.input_type == "file") {
                    columnContentData.wpcf7_button.border_color = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("border-color");
                } else if (columnContentData.input_type == "submit") {
                    columnContentData.wpcf7_button.border_color = $formColumn.find("." + columnContentData.field_class).eq(0).css("border-color");
                }
            }

            // Button border color hover
            columnContentData.wpcf7_button.border_color_hover = (columnContentDataEl.getAttribute("data-button-border-color-hover") ? columnContentDataEl.getAttribute("data-button-border-color-hover").toString() : defaultColumnContentValues.wpcf7_button.border_color_hover);
            
        } else {
            /* Extracting data from the element in the DOM */
            // var $field = $formColumn.find("[name='" + columnContentData.field_class + "']");

            // if (columnContentData.input_type == "radio" || columnContentData.input_type == "acceptance") {
            //     $field = $field.parents(".wpcf7-form-control");
            // }

            ///////
            
            // Required field
            columnContentData.wpcf7_required_field = defaultColumnContentValues.wpcf7_required_field;

            // Only numbers
            columnContentData.wpcf7_only_numbers = defaultColumnContentValues.wpcf7_only_numbers;

            // Default check
            columnContentData.wpcf7_default_check = defaultColumnContentValues.wpcf7_default_check;

            // Placeholder
            columnContentData.wpcf7_placeholder = defaultColumnContentValues.wpcf7_placeholder;

            // File max dimensions
            columnContentData.wpcf7_file_max_dimensions = defaultColumnContentValues.wpcf7_file_max_dimensions;

            // File types
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_list_fields = ["png", "jpg", "jpeg", "pdf"];
            }

            // Width & height
            columnContentData.input_width = $formColumn.find("." + columnContentData.field_class).eq(0).css("width");   // @toedit Non del tutto corretto
            columnContentData.input_height = $formColumn.find("." + columnContentData.field_class).eq(0).css("height"); // @toedit Non del tutto corretto

            // Font size
            columnContentData.font_size = defaultColumnContentValues.font_size;

            // Background color
            columnContentData.background_color = $formColumn.find("." + columnContentData.field_class).eq(0).css("background-color");

            // Text color
            columnContentData.text_color = $formColumn.find("." + columnContentData.field_class).eq(0).css("color");

            // Text color focus
            columnContentData.text_color_focus = defaultColumnContentValues.text_color_focus;
            
            /* BUTTON */
            // Button text
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.text = "Choose a file";
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.text = "Send";
            }

            // Button font size
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.font_size = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("font-size");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.font_size = $formColumn.find("." + columnContentData.field_class).eq(0).css("font-size");
            }

            // Button height
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.height = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("height");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.height = $formColumn.find("." + columnContentData.field_class).eq(0).css("height");
            }

            // Button width
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.width = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("width");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.width = $formColumn.find("." + columnContentData.field_class).eq(0).css("width");
            }

            // Button border width
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.border_width = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("border-width");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.border_width = $formColumn.find("." + columnContentData.field_class).eq(0).css("border-width");
            }

            // Button border radius
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.border_radius = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("border-radius");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.border_radius = $formColumn.find("." + columnContentData.field_class).eq(0).css("border-radius");
            }

            // Button margin
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.margin_top = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("margin-top");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.margin_top = $formColumn.find("." + columnContentData.field_class).eq(0).css("margin-top");
            }

            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.margin_right = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("margin-right");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.margin_right = $formColumn.find("." + columnContentData.field_class).eq(0).css("margin-right");
            }

            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.margin_bottom = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("margin-bottom");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.margin_bottom = $formColumn.find("." + columnContentData.field_class).eq(0).css("margin-bottom");
            }

            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.margin_left = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("margin-left");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.margin_left = $formColumn.find("." + columnContentData.field_class).eq(0).css("margin-left");
            }

            // Button padding
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.padding_top = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("padding-top");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.padding_top = $formColumn.find("." + columnContentData.field_class).eq(0).css("padding-top");
            }

            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.padding_right = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("padding-right");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.padding_right = $formColumn.find("." + columnContentData.field_class).eq(0).css("padding-right");
            }

            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.padding_bottom = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("padding-bottom");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.padding_bottom = $formColumn.find("." + columnContentData.field_class).eq(0).css("padding-bottom");
            }

            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.padding_left = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("padding-left");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.padding_left = $formColumn.find("." + columnContentData.field_class).eq(0).css("padding-left");
            }

            // Button text color
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.text_color = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("color");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.text_color = $formColumn.find("." + columnContentData.field_class).eq(0).css("color");
            }

            // Button text color hover
            columnContentData.wpcf7_button.text_color_hover = defaultColumnContentValues.wpcf7_button.text_color_hover;

            // Button background color
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.background_color = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("background-color");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.background_color = $formColumn.find("." + columnContentData.field_class).eq(0).css("background-color");
            }

            // Button background color hover
            columnContentData.wpcf7_button.background_color_hover = defaultColumnContentValues.wpcf7_button.background_color_hover;

            // Button border color
            if (columnContentData.input_type == "file") {
                columnContentData.wpcf7_button.border_color = $formColumn.find("." + columnContentData.field_class + " label").eq(0).css("border-color");
            } else if (columnContentData.input_type == "submit") {
                columnContentData.wpcf7_button.border_color = $formColumn.find("." + columnContentData.field_class).eq(0).css("border-color");
            }
            
            // Button border color hover
            columnContentData.wpcf7_button.border_color_hover = defaultColumnContentValues.wpcf7_button.border_color_hover;
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
        // var contentType = columnContentData.type;
        var fieldClass = columnContentData.field_class;
        var inputType = columnContentData.input_type;
        var cssSelector;
        var columnContentHoverRule = "";

        switch (inputType) {
            case "text":
            case "textarea":
            case "number":
            case "select":
                cssSelector = "wpcf7-" + inputType;
                break;
            case "acceptance":
            case "submit":
            case "file":
                cssSelector = fieldClass;
                break;
            case "radio":
                cssSelector =  "wpcf7-form-control-wrap."+ fieldClass;
                break;
            default:
              break;
        }

        var columnContentFocusRule = "";

        columnContentFocusRule += "color: " + columnContentData.text_color_focus + ";";
        _addColumnContentFocusRule(formID, row, column, cssSelector, columnContentFocusRule);

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

            _addColumnContentRule(formID, row, column, cssSelector   + " label", columnContentFileButtonRule);
            _addColumnContentHoverRule(formID, row, column, cssSelector  + " label", columnContentFileButtonHoverRule);
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

            _addColumnContentRule(formID, row, column, cssSelector, columnContentButtonRule);
            _addColumnContentHoverRule(formID, row, column, cssSelector, columnContentButtonHoverRule);
        } else { // Other fields
            var columnContentRule = "";

            if (inputType == "acceptance" || inputType == "radio" || inputType == "file") {
                columnContentRule += "float: left;";
            }

            columnContentRule += "background-color: " + columnContentData.background_color + ";";
            columnContentRule += "color: " + columnContentData.text_color + ";";
            columnContentRule += "border-color: " + columnContentData.border_color + ";";
            columnContentRule += "width: " + columnContentData.input_width + ";";
            columnContentRule += "height: " + columnContentData.input_height + ";";
            columnContentRule += "font-size: " + columnContentData.font_size + ";";
            columnContentRule += "border-style: solid;";
            columnContentRule += "border-width: " + columnContentData.border_width + ";";
            _addColumnContentRule(formID, row, column, cssSelector, columnContentRule);
            
            columnContentHoverRule += "color: " + columnContentData.text_color_hover + ";";
            columnContentHoverRule += "background-color: " + columnContentData.background_color_hover + ";";
            columnContentHoverRule += "border-color: " + columnContentData.border_color_hover + ";";
            _addColumnContentHoverRule(formID, row, column, cssSelector, columnContentHoverRule);
        }
    }

    var _updateColumnContent = function (data) {
        var columnContentData = data.columnContentData;
        var formID = columnContentData.target.element_id;
        var row = columnContentData.target.row_number;
        var column = columnContentData.target.column_number;
        // var contentType = columnContentData.type;
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
        var backgroundColorHover = columnContentData.background_color_hover;
        var textColor = columnContentData.text_color;
        var textColorHover = columnContentData.text_color_hover;
        var textColorFocus = columnContentData.text_color_focus;
        var borderColor = columnContentData.border_color;
        var borderColorHover = columnContentData.border_color_hover;
        var buttonTextColor = columnContentData.wpcf7_button.text_color;
        var buttonTextColorHover = columnContentData.wpcf7_button.text_color_hover;
        var buttonBackgroundColor = columnContentData.wpcf7_button.background_color;
        var buttonBackgroundColorHover = columnContentData.wpcf7_button.background_color_hover;
        var buttonBorderColor = columnContentData.wpcf7_button.border_color;
        var buttonBorderColorHover = columnContentData.wpcf7_button.border_color_hover;

        var cssSelector;
        switch (inputType) {
            case "text":
            case "textarea":
            case "number":
            case "select":
                cssSelector = "wpcf7-" + inputType;
                break;
            case "acceptance":
            case "submit":
            case "file":
                cssSelector = fieldClass;
                break;
            case "radio":
                cssSelector =  "wpcf7-form-control-wrap."+ fieldClass;
                break;
            default:
              break;
        }

        if (inputType == "acceptance" || inputType == "radio") {
            _updateColumnContentRule(formID, row, column, cssSelector, "float", "left");
        }

        if (inputType != "submit") {
            _updateColumnContentHoverRule(formID, row, column, cssSelector, "text-color", textColorHover);
            _updateColumnContentHoverRule(formID, row, column, cssSelector, "background-color", backgroundColorHover);
            _updateColumnContentHoverRule(formID, row, column, cssSelector, "border-color", borderColorHover);

            _updateColumnContentRule(formID, row, column, cssSelector, "width", columnContentData.input_width);
            _updateColumnContentRule(formID, row, column, cssSelector, "height", columnContentData.input_height);
            _updateColumnContentRule(formID, row, column, cssSelector, "font-size", columnContentData.font_size);
            _updateColumnContentRule(formID, row, column, cssSelector, "border-width", columnContentData.border_width);
            _updateColumnContentRule(formID, row, column, cssSelector, "text-color", textColor);
            _updateColumnContentRule(formID, row, column, cssSelector, "background-color",backgroundColor);
            _updateColumnContentRule(formID, row, column, cssSelector, "border-color", borderColor);

            if (inputType == "file") {
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "height", buttonHeight);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "width", buttonWidth);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "border-width", buttonBorderWidth);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "border-radius", buttonBorderRadius);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "margin-top", buttonMarginTop);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "margin-right", buttonMarginRight);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "margin-bottom", buttonMarginBottom);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "margin-left", buttonMarginLeft);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "padding-top", buttonPaddingTop);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "padding-right", buttonPaddingRight);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "padding-bottom", buttonPaddingBottom);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "padding-left", buttonPaddingLeft);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "font-size", buttonFontSize);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "text-color", buttonTextColor);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "background-color", buttonBackgroundColor);
                _updateColumnContentRule(formID, row, column, cssSelector + " label", "border-color", buttonBorderColor);

                _updateColumnContentHoverRule(formID, row, column, cssSelector + " label", "text-color", buttonTextColorHover);
                _updateColumnContentHoverRule(formID, row, column, cssSelector + " label", "background-color", buttonBackgroundColorHover);
                _updateColumnContentHoverRule(formID, row, column, cssSelector + " label", "border-color", buttonBorderColorHover);
            }
        } else {    // Field is submit
            _updateColumnContentRule(formID, row, column, cssSelector, "height", buttonHeight);
            _updateColumnContentRule(formID, row, column, cssSelector, "width", buttonWidth);
            _updateColumnContentRule(formID, row, column, cssSelector, "border-width", buttonBorderWidth);
            _updateColumnContentRule(formID, row, column, cssSelector, "border-radius", buttonBorderRadius);
            _updateColumnContentRule(formID, row, column, cssSelector, "margin-top", buttonMarginTop);
            _updateColumnContentRule(formID, row, column, cssSelector, "margin-right", buttonMarginRight);
            _updateColumnContentRule(formID, row, column, cssSelector, "margin-bottom", buttonMarginBottom);
            _updateColumnContentRule(formID, row, column, cssSelector, "margin-left", buttonMarginLeft);
            _updateColumnContentRule(formID, row, column, cssSelector, "padding-top", buttonPaddingTop);
            _updateColumnContentRule(formID, row, column, cssSelector, "padding-right", buttonPaddingRight);
            _updateColumnContentRule(formID, row, column, cssSelector, "padding-bottom", buttonPaddingBottom);
            _updateColumnContentRule(formID, row, column, cssSelector, "padding-left", buttonPaddingLeft);
            _updateColumnContentRule(formID, row, column, cssSelector, "font-size", buttonFontSize);
            _updateColumnContentRule(formID, row, column, cssSelector, "text-color", buttonTextColor);
            _updateColumnContentRule(formID, row, column, cssSelector, "background-color", buttonBackgroundColor);
            _updateColumnContentRule(formID, row, column, cssSelector, "border-color", buttonBorderColor);

            _updateColumnContentHoverRule(formID, row, column, cssSelector, "text-color", buttonTextColorHover);
            _updateColumnContentHoverRule(formID, row, column, cssSelector, "background-color", buttonBackgroundColorHover);
            _updateColumnContentHoverRule(formID, row, column, cssSelector, "border-color", buttonBorderColorHover);
        }
        _updateColumnContentFocusRule(formID, row, column, cssSelector, "text-color", textColorFocus);

        _updateColumnContentShortcode(formID, row, column, inputType, columnContentData);
        _updateSpanData(formID, columnContentData);
        _updateFormInDBNoRefresh(formID);
    }

    var _updateColumnContentShortcode = function (formID, row, column, inputType, columnContentData) {
        var $formToUpdateDB = $formsInPage[formID];
        var $columnToUpdateDB = $formToUpdateDB.find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"]");
        var shortcode = $columnToUpdateDB.find(".wpcf7-column-content").html();

        if ("undefined" == typeof shortcode) {
            shortcode = $columnToUpdateDB.html();
        }

        var isSetRequiredField = String(columnContentData.wpcf7_required_field) == "true";
        var onlyNumbers = String(columnContentData.wpcf7_only_numbers) == "true";
        var isSetDefaultCheck = String(columnContentData.wpcf7_default_check) == "true";
        var placeholder = columnContentData.wpcf7_placeholder;
        var fieldText = columnContentData.text;
        var listFields = columnContentData.wpcf7_list_fields;
        var fileMaxDim = columnContentData.wpcf7_file_max_dimensions;
        var buttonText = columnContentData.wpcf7_button.text;

        if(inputType == "text" || inputType == "select" || inputType == "file" || inputType == "textarea") {   // Required field
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
            if (isAlreadyRequiredField) {
                if (!isSetRequiredField) {
                    shortcode = shortcode.replace(/\]/, " optional]");
                }
            } else {
                if (isSetRequiredField) {
                    shortcode = shortcode.replace(" optional", "");
                }
            }
        }

        if(inputType == "text" || inputType == "number") {   // Only number
            // Changes the shortcode in [number number-xxx ...] or vice versa
            if (onlyNumbers) {
                shortcode = shortcode.replace(/\[[a-z]+\*? [a-z]+/, "[number" + (isSetRequiredField ? "*": "") + " number");
                shortcode = shortcode.replace(/class:[a-z]+/, "class:number");

                inputType = "number";
            } else {
                shortcode = shortcode.replace(/\[[a-z]+\*? [a-z]+/, "[text" + (isSetRequiredField ? "*": "") + " text");
                shortcode = shortcode.replace(/class:[a-z]+/, "class:text");

                inputType = "text";
            }
        }

        if (inputType == "acceptance") {   // Default check
            // Puts (or removes) the "default:on" string
            var isAlreadyDefaultCheck = /default\:on/.test(shortcode);
            if (isAlreadyDefaultCheck) {
                if (!isSetDefaultCheck) {    // Unsetting default check
                    shortcode = shortcode.replace("default:on", "");
                }
            } else {
                if (isSetDefaultCheck) {    // Setting default check
                    shortcode = shortcode.replace(/\[[a-z]+ [a-z]+\-[0-9]+ /, /\[[a-z]+ [a-z]+\-[0-9]+ /.exec(shortcode) + "default:on ");
                }
            }
        }

        if (inputType == "text" || inputType == "number" || inputType == "textarea") {   // Placeholder
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

        if (inputType == "select" || inputType == "radio") {  // Lists
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

        if (inputType == "submit") {    // Submit button text
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
            $columnData.attr("data-wpcf7-border-width", columnContentData.border_width);
            $columnData.attr("data-background-color", columnContentData.background_color);
            $columnData.attr("data-background-color-hover", columnContentData.background_color_hover);
            $columnData.attr("data-text-color", columnContentData.text_color);
            $columnData.attr("data-text-color-hover", columnContentData.text_color_hover);
            $columnData.attr("data-text-color-focus", columnContentData.text_color_focus);
            $columnData.attr("data-border-color", columnContentData.border_color);
            $columnData.attr("data-border-color-hover", columnContentData.border_color_hover);

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
        $columnDataInDB.attr("data-wpcf7-border-width", columnContentData.border_width);
        $columnDataInDB.attr("data-background-color", columnContentData.background_color);
        $columnDataInDB.attr("data-background-color-hover", columnContentData.background_color_hover);
        $columnDataInDB.attr("data-text-color", columnContentData.text_color);
        $columnDataInDB.attr("data-text-color-hover", columnContentData.text_color_hover);
        $columnDataInDB.attr("data-text-color-focus", columnContentData.text_color_focus);
        $columnDataInDB.attr("data-border-color", columnContentData.border_color);
        $columnDataInDB.attr("data-border-color-hover", columnContentData.border_color_hover);

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
    
    var $formsInPage;   // JQuery Array of DB side of forms in page

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

    var _setRowsSortable = function () {
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper");

        if (!$elementWrappers.find(".wpcf7-rows").hasClass("ui-sortable")) {
            $elementWrappers.find(".wpcf7-rows").addClass("ui-sortable");
        }

        $elementWrappers.find(".wpcf7-rows").sortable({
            revert: true,
            handle: ".rex-wpcf7-row-drag",
            cursor: "pointer",
            update: function(e, ui) {
                var formID = ui.item.parents(".rex-element-wrapper").attr("data-rex-element-id");
                
                var startPosition = parseInt(ui.item.attr("wpcf7-row-number")); // Getting the old row position
                _fixRowNumbersAndClasses($elementWrappers.find(".wpcf7-form"));
                var endPosition = parseInt(ui.item.attr("wpcf7-row-number"));   // Getting the new row position

                // Sorting rows in DB forms
                var $rowInDBMoved = $formsInPage[formID].find(".wpcf7-row[wpcf7-row-number='" + startPosition +"']");
                var $rowInDBAfter = $formsInPage[formID].find(".wpcf7-row[wpcf7-row-number='" + endPosition +"']");

                if (startPosition < endPosition) {
                    $rowInDBMoved.insertAfter($rowInDBAfter);
                } else {
                    $rowInDBMoved.insertBefore($rowInDBAfter);
                }
                
                _fixRowNumbers($formsInPage[formID]);

                _updateFormInDBNoRefresh(formID);
            }
        });
    }

    var _fixColumnContentClasses = function (formID) {
        // Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").each(function () {

        // });
        // Rexbuilder_Rexelement.addStyles();
        // $elementWrapper.find(".wpcf7-column").each(function(){
        //     Rexbuilder_Rexwpcf7.addColumnContentStyle($(this));
        // })
    }

	var _init = function () {
		styleSheet = null;
        $formsInPage = {};

        defaultColumnContentValues = {
            wpcf7_required_field: false,
            wpcf7_only_numbers: false,
            wpcf7_default_check: false,
            wpcf7_placeholder: "Write here...",
            // wpcf7_list_fields: [],
            wpcf7_file_max_dimensions: "25mb",
            wpcf7_button: {
                // text: "",
                // font_size: "18px",
                // height: "50px",
                // width: "200px",
                // border_width: "2px",
                // border_radius: "10px",
                // margin_top: "0px",
                // margin_right: "0px",
                // margin_bottom: "0px",
                // margin_left: "0px",
                // padding_top: "5px",
                // padding_right: "15px",
                // padding_bottom: "5px",
                // padding_left: "15px",
                // text_color: "rgb(86, 86, 86)",
                text_color_hover: "rgb(255, 255, 255)",
                // background_color: "rgb(255, 255, 255)",
                background_color_hover: "rgb(86, 86, 86)",
                // border_color: "rgb(86, 86, 86)",
                border_color_hover: "rgb(255, 255, 255)",
            },
            // input_width: "",
            // input_height: "",
            // font_size: "",
            // background_color: "",
            // text_color: "", 
            text_color_focus: "rgb(0, 0, 0)",
            // text: "",
            // type: "",
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
        updateFormInDB: _updateFormInDB,

        // Rows function
        setRowsSortable: _setRowsSortable,

		// Column content functions
		createColumnContentSpanData: _createColumnContentSpanData,
		removeColumnContentSpanData: _removeColumnContentSpanData,
		generateColumnContentData: _generateColumnContentData,
		updateColumnContentLive: _updateColumnContentLive,
        updateFormContentLive: _updateFormContentLive,
		updateColumnContent: _updateColumnContent,
	}
})(jQuery);