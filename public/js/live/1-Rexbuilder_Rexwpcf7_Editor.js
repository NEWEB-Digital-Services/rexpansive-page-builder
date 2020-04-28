var Rexbuilder_Rexwpcf7_Editor = (function($) {
  var styleSheet;

  /* ===== PUBLIC METHODS ===== */

  function addField(data) {
    var insertionPoint = data.insertionPoint;
    var formID = insertionPoint.formID;
    var fieldType = data.fieldType;
    var fieldShortcode;
    var fieldNumber = Rexbuilder_Util.createRandomNumericID(3);
    var row = insertionPoint.row_number;
    var column = insertionPoint.column_number;
    var $columnToAddField = Rexbuilder_Util.$rexContainer.find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"]");
    var $columnToAddFieldInDB = $formsInPage[formID].find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"]");

    $columnToAddField.empty().removeClass('with-button');
    $columnToAddFieldInDB.empty().removeClass('with-button');
    
    var $span = $(document.createElement("span")).addClass("wpcf7-column-content");
    $columnToAddField.append($span);
    var $columnContent = $columnToAddField.find('.wpcf7-column-content');
    
    // Selecting the field
    switch (fieldType) {
        case "text":
            fieldShortcode = '[text text-' + fieldNumber + ' class:text-' + fieldNumber + ']';
            $columnContent.prepend('<span class="wpcf7-form-control-wrap your-name text-' + fieldNumber + '"><input type="text" name="text-' + fieldNumber + '" value="" class="wpcf7-form-control wpcf7-text text-' + fieldNumber + '" aria-invalid="false" style=""></span>');
            break;
        case "textarea":
            fieldShortcode = "[textarea textarea-" + fieldNumber + " class:textarea-" + fieldNumber + "]";
            $columnContent.prepend('<span class="wpcf7-form-control-wrap textarea-' + fieldNumber + '"><textarea name="textarea-' + fieldNumber + '" class="wpcf7-form-control wpcf7-textarea textarea-' + fieldNumber + '" aria-invalid="false" style=""></textarea></span>');
            break;
        case "menu":
            fieldShortcode = '[select menu-' + fieldNumber + ' class:menu-' + fieldNumber + ' "Field 1" "Field 2"]';
            $columnContent.prepend('<span class="wpcf7-form-control-wrap menu-' + fieldNumber + '"><select name="menu-' + fieldNumber + '" class="wpcf7-form-control wpcf7-select menu-' + fieldNumber + '" aria-invalid="false" style=""><option value="" disabled selected>Select something</option><option value="Field 1">Field 1</option><option value="Field 2">Field 2</option></select></span>');
            break;
        case "radiobuttons":
            fieldShortcode = "[radio radio-" + fieldNumber + " default:1  \"Option 1\" \"Option 2\" ]";
            $columnContent.prepend("<span class=\"wpcf7-form-control-wrap radio-" + fieldNumber + "\" style=\"\"><span class=\"wpcf7-form-control wpcf7-radio\"><span class=\"wpcf7-list-item first\"><input type=\"radio\" name=\"radio-" + fieldNumber + "\" value=\"Option 1\" checked=\"checked\" class=\"with-gap\" id=\"wpcf7-radio-1\"><span class=\"wpcf7-list-item-label\">Option 1</span></span><span class=\"wpcf7-list-item last\"><input type=\"radio\" name=\"radio-" + fieldNumber + "\" value=\"Option 2\" class=\"with-gap\" id=\"wpcf7-radio-2\"><span class=\"wpcf7-list-item-label\">Option 2</span></span></span></span>");
            break;
        case "acceptance":
            fieldShortcode = "[acceptance acceptance-" + fieldNumber + " optional]<p>Your text</p>[/acceptance]";
            $columnContent.prepend("<span class=\"wpcf7-form-control-wrap acceptance-" + fieldNumber + "\" style=\"\"><span class=\"wpcf7-form-control wpcf7-acceptance optional\"><span class=\"wpcf7-list-item\"><label><input type=\"checkbox\" name=\"acceptance-" + fieldNumber + "\" value=\"1\" aria-invalid=\"false\"><span class=\"wpcf7-list-item-label\"><p>Your text</p></span></label></span></span></span>");
            break;
        case "file":
            fieldShortcode = "[file file-" + fieldNumber + " filetypes: limit:]<div class='wpcf7-file-caption'>Your text here</div>";
            $columnContent.prepend("<span class=\"wpcf7-form-control-wrap file-" + fieldNumber + "\" style=\"\"><input type=\"file\" name=\"file-" + fieldNumber + "\" size=\"40\" class=\"wpcf7-form-control wpcf7-file\" accept=\".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.ppt,.pptx,.odt,.avi,.ogg,.m4a,.mov,.mp3,.mp4,.mpg,.wav,.wmv\" aria-invalid=\"false\" id=\"wpcf7-file-2\"><label for=\"wpcf7-file-2\">Choose file</label><div class=\"wpcf7-file-caption\">Your text here</div></span>");
            break;
        case "submit":
            fieldShortcode = '[submit class:submit-' + fieldNumber + ' "Send"]';
            $columnContent.prepend('<input type="submit" value="Send" class="wpcf7-form-control wpcf7-submit submit-' + fieldNumber + '" style="">');
            break;
        default:
            break;
    }

    _saveNewField(insertionPoint, fieldShortcode);
    createColumnContentSpanData({
      editPoint: {
        element_id: formID,
        row_number: row,
        column_number: column,
      }
    });

    Rexbuilder_Rexwpcf7.fixWpcf7RadioButtons();
    Rexbuilder_Rexwpcf7.addColumnContentStyle($columnToAddField);
  }

  function addNewRow(formID, columnsSelected) {
    var $formToAddRow = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]').find('.wpcf7-form');
    var $newRow = $(document.createElement('div'));
    var newRowNumber = parseInt($formToAddRow.find('.wpcf7-row').last().attr('wpcf7-row-number')) + 1;

    switch (columnsSelected) {
      case 1:
        $newRow.addClass('wpcf7-row wpcf7-row__1-column');
        break;
      case 2:
        $newRow.addClass('wpcf7-row wpcf7-row__2-columns');
        break;
      case 3:
        $newRow.addClass('wpcf7-row wpcf7-row__3-columns');
        break;
      case 4:
        $newRow.addClass('wpcf7-row wpcf7-row__4-columns');
        break;
      default: break;
    }

    $newRow.attr('wpcf7-row-number', newRowNumber);

    var $columnsToInsert = [];

    for(var i = 0; i < columnsSelected; i++) {
      $columnsToInsert[i] = $(document.createElement('div'));
      $columnsToInsert[i].addClass('wpcf7-column with-button');
      $columnsToInsert[i].attr('wpcf7-column-number', (i+1));

      // Creating the + buttons for adding content
      var plusButton = tmpl('tmpl-plus-button-inside-wpcf7-row', {});
      $columnsToInsert[i].append(plusButton);

      $newRow.append($columnsToInsert[i]);
    }

    $formToAddRow.each(function() {
      var $newRowClone = $newRow.clone();
      $(this).find('.wpcf7-rows').append($newRowClone);
    })

    _saveNewRow(formID, $newRow);
  }

  function addRow(formID, $rowToAdd, numberRowBefore) {
    var $formToAddRow = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]').find('.wpcf7-form');
    var $rowBefore = $formToAddRow.find('.wpcf7-row[wpcf7-row-number="' + numberRowBefore + '"]');

    $rowToAdd.insertAfter($rowBefore);

    _fixRowNumbersAndClasses($formToAddRow);
    _saveAddedRow(formID, numberRowBefore);
  }

  function addClonedColumnRow(formID, clonedColumnNumber, numberRowBefore) {
    var $formToAddRow = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]').find('.wpcf7-form');       // There may be more than 1 form
    var $rowBefore = $formToAddRow.find('.wpcf7-row[wpcf7-row-number="' + numberRowBefore + '"]');
    var $rowToAdd = $($rowBefore[0]).clone();
    
    $rowToAdd.insertAfter($rowBefore);          // Inserting the new row in the form
    _fixRowNumbersAndClasses($formToAddRow);    // After this function row numbers are now correct

    var newRowNumber = numberRowBefore + 1;
    var $rowAdded = $formToAddRow.find('.wpcf7-row[wpcf7-row-number="' + newRowNumber + '"]'); // Need to declare this after _fixRowNumbers

    $rowAdded.each(function (index, row) {      // There may be more than 1 row (multiple forms)
      $(row).find('.wpcf7-column').each(function (index, column) {
        if((index + 1) != clonedColumnNumber) {
          $(column).empty();

          var plusButton = tmpl('tmpl-plus-button-inside-wpcf7-row', {});
          $(column)
            .append(plusButton)
            .addClass('with-button');
        }
      });
    })

    _saveClonedColumnRow(formID, clonedColumnNumber, numberRowBefore);
  }

  function deleteRow(formID, rowNumberToDelete, blockIDToFocusAfterDelete) {
    var $formToDeleteRow = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]').find('.wpcf7-form');      // There may be more than 1 form
    var $rowToDelete = $formToDeleteRow.find('.wpcf7-row[wpcf7-row-number="' + rowNumberToDelete + '"]');

    $rowToDelete.remove();

    _fixRowNumbersAndClasses($formToDeleteRow);
    _saveDeletingRow(formID, rowNumberToDelete);
  }

  function deleteColumnContent(formID, rowNumberToDelete, columnNumberToDelete) {
    var $formToDeleteColumn = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]').find('.wpcf7-form');     // There may be more than 1 form
    var $columnToDelete = $formToDeleteColumn.find('.wpcf7-row[wpcf7-row-number="' + rowNumberToDelete + '"] .wpcf7-column[wpcf7-column-number="' + columnNumberToDelete + '"]');

    $columnToDelete.empty();
    var $plusButton = tmpl('tmpl-plus-button-inside-wpcf7-row', {});
    $columnToDelete
      .append($plusButton)
      .addClass('with-button');

    _saveDeletingColumnContent(formID, rowNumberToDelete, columnNumberToDelete);
  }

  function updateFormLive(data) {
    var formID = data.element_target.element_id;
    var propertyType = data.propertyType;
    var propertyName = data.propertyName;
    var newValue = data.newValue;
    var $textWraps = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]').parents('.text-wrap');

    switch (propertyType) {
      case 'background':
      case 'border':
      case 'border-width':
      case 'margin':
        Rexbuilder_Rexwpcf7.updateFormRule(formID, propertyName, newValue);
        $textWraps.each(function(index, textWrap) {
          Rexbuilder_Util_Editor.updateBlockContainerHeight($(textWrap));
        });
        break;
      case 'validation-error':
        Rexbuilder_Rexwpcf7.updateFormMessageRule(formID, 'wpcf7-validation-errors', propertyName, newValue);
        break;
      case 'send-message':
        Rexbuilder_Rexwpcf7.updateFormMessageRule(formID, 'wpcf7-mail-sent-ok', propertyName, newValue);
        break;
      case 'columns-padding':
        Rexbuilder_Rexwpcf7.updateFormColumnsRule(formID, propertyName, newValue);
        $textWraps.each(function(index, textWrap) {
          Rexbuilder_Util_Editor.updateBlockContainerHeight($(textWrap));
        });
        break;
      default: break;
    }
  }

  function updateFormContentLive(data) {
    var elementID = data.element_target.element_id;
    Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + elementID + '"] .wpcf7-column').not('.with-button').each(function (index, column) {
      var $currentColumn = $(column);
      var spanDataExists = $currentColumn.find('.rex-wpcf7-column-content-data').length != 0;
      var currentColumnData = Rexbuilder_Rexwpcf7.generateColumnContentData($currentColumn, spanDataExists);
      if (currentColumnData.input_type != 'submit') {
        var updateData = {
          target: currentColumnData.target,
          content: currentColumnData,
          propertyType: data.propertyType,
          propertyName: data.propertyName,
          newValue: data.newValue
        }
        updateColumnContentLive(updateData);
      }
    })
  }

  function updateColumnContentLive(data) {
    var formID = data.target.element_id;
    var row = data.target.row_number;
    var column = data.target.column_number;
    var $formColumns = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number='" + row + "'] .wpcf7-column[wpcf7-column-number='" + column + "']");   // > 1 if there are > 1 forms with the same ID in page
    var fieldClass = data.content.field_class;
    var inputType = data.content.input_type;
    var propertyName = data.propertyName;
    var propertyType = data.propertyType;
    var newValue = data.newValue;

    var isSetRequiredField = data.content.wpcf7_required_field;
    var onlyNumbers = data.content.wpcf7_only_numbers;
    var isSetEmail = data.content.wpcf7_email;

    inputType = inputType === "text" ? (onlyNumbers ? "number" : (isSetEmail ? "email" : "text")) : inputType;
    var cssSelector;
    switch (inputType) {
      case "text":
      case "email":
      case "number":
      case "textarea":
      case "select":
        cssSelector = "wpcf7-" + inputType;
        break;
      case "acceptance":
        cssSelector =  "wpcf7-form-control-wrap";
        break;
      case "submit":
      case "file":
        cssSelector = fieldClass;
        break;
      case "radio":
        cssSelector =  "wpcf7-form-control-wrap."+ fieldClass;
        break;
      default: break;
    }
    // console.log('%c '+inputType+' '+propertyType, 'background: ' + newValue+';color: #000');

    switch (propertyType) {
        case "background-color":
        case "border-width":
        case "border-radius":
        case "border-color":
          if (inputType != "file" && inputType != "radio" && inputType != "acceptance") {
            Rexbuilder_Rexwpcf7.updateColumnContentRule(formID, row, column, cssSelector, propertyName, newValue);
          }
          break;
        case "font-size":
          Rexbuilder_Rexwpcf7.updateColumnContentRule(formID, row, column, cssSelector, propertyName, newValue);
          Rexbuilder_Rexwpcf7.updateColumnContentRule(formID, row, column, cssSelector + ' .wpcf7-radio-label', propertyName, newValue);
          Rexbuilder_Rexwpcf7.updateColumnContentRule(formID, row, column, cssSelector + ' .wpcf7-list-item-label', propertyName, newValue);
          break;
        case "width":
        case "height":
        case "text-color":
          Rexbuilder_Rexwpcf7.updateColumnContentRule(formID, row, column, cssSelector, propertyName, newValue);
          break;
        case "placeholder-color":
          // @bug: cssSelector does not change properly. Maybe caused by ::placeholder?
          // console.group('placeholder')
          // console.log('%c Placeholder color ', 'background: '+newValue+'; color: #000');
          // console.log('cssSelector', cssSelector)
          // console.groupEnd('placeholder')
          Rexbuilder_Rexwpcf7.updateColumnContentRule(formID, row, column, cssSelector + "::placeholder", propertyName, newValue);
          break;
        case "select-color":
          if (/color\:/.test($formColumns.find(".wpcf7-select").attr("style"))) {
              $formColumns.find(".wpcf7-select").css("color", newValue);
          }
          break;
        case "button-text":
          if ( 'file' === inputType ) {
              $formColumns.find('label').text(newValue);
          } else if ( 'submit' === inputType ) {
              $formColumns.find('[type=submit]').val(newValue);
          }
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
              Rexbuilder_Rexwpcf7.updateColumnContentRule(formID, row, column, cssSelector + " label", propertyName, newValue);
          } else {
              Rexbuilder_Rexwpcf7.updateColumnContentRule(formID, row, column, cssSelector, propertyName, newValue);
          }
          break;
        case "background-color-hover":
        case "border-color-hover":
          if (inputType != "file" && inputType != "radio" && inputType != "acceptance") {
              Rexbuilder_Rexwpcf7.updateColumnContentHoverRule(formID, row, column, cssSelector, propertyName, newValue);
          }
          break;
        case "text-color-hover":
          Rexbuilder_Rexwpcf7.updateColumnContentHoverRule(formID, row, column, cssSelector, propertyName, newValue);
          break;
        case "placeholder-color-hover":
          Rexbuilder_Rexwpcf7.updateColumnContentPlaceholderHoverRule(formID, row, column, cssSelector, propertyName, newValue);
          break;
        case "text-focus":
          Rexbuilder_Rexwpcf7.updateColumnContentFocusRule(formID, row, column, cssSelector, propertyName, newValue);
          break;
        case "button-text-color-hover":
        case "button-background-color-hover":
        case "button-border-color-hover":
          if (inputType == "file") {
             Rexbuilder_Rexwpcf7.updateColumnContentHoverRule(formID, row, column, cssSelector + " label", propertyName, newValue);
          } else {
              Rexbuilder_Rexwpcf7.updateColumnContentHoverRule(formID, row, column, cssSelector, propertyName, newValue);
          }
          break;
        case "wpcf7-required":
            if ( isSetRequiredField ) {   // Setting required field in the DOM element
                switch (inputType) {
                    case "text":
                    case "email":
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
                    case "email":
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
        case "wpcf7-email":
            if ( isSetEmail ) {  // Setting e-mail
                var $input = $formColumns.find(".wpcf7-form-control");
                var oldFieldType = $input.attr('type');
                var classRegexp = new RegExp(oldFieldType + '-[\\d]+');
                var classToRemove = classRegexp.exec($input[0].classList)[0];
                var classToAdd = "email-" + /[0-9]+/.exec(classToRemove)[0];

                $input.attr("type", "email");
                $input.removeClass(classToRemove)
                    .removeClass("wpcf7-" + oldFieldType)
                    .removeClass("wpcf7-validates-as-number");
                $input.addClass(classToAdd)
                    .addClass("wpcf7-email")
                    .addClass("wpcf7-validates-as-email");

                inputType = "email";
            } else {    // Unsetting e-mail
                inputType = onlyNumbers ? "number" : "text";
                var $input = $formColumns.find(".wpcf7-email");
                var classToRemove = /email-[\d]+/.exec($input[0].classList)[0];
                var classToAdd = inputType + "-" + /[0-9]+/.exec(classToRemove)[0];

                $input.attr("type", inputType);
                $input.removeClass(classToRemove)
                    .removeClass("wpcf7-email")
                    .removeClass("wpcf7-validates-as-email");
                $input.addClass(classToAdd)
                    .addClass("wpcf7-" + inputType);

                if ( 'number' === inputType ) {
                    $input.addClass("wpcf7-validates-as-number");
                }
            }

            $formColumns.each(function(index, column) {
              Rexbuilder_Rexwpcf7.refreshColumnContentStyle($(column));
            });
            break;
        case "wpcf7-only-numbers":
            if ( onlyNumbers ) {  // Setting only numbers
                var $input = $formColumns.find(".wpcf7-form-control");
                var oldFieldType = $input.attr('type');
                var classRegexp = new RegExp(oldFieldType + '-[\\d]+');
                var classToRemove = classRegexp.exec($input[0].classList)[0];
                var classToAdd = "number-" + /[0-9]+/.exec(classToRemove)[0];

                $input.attr('type', 'number');
                $input.removeClass(classToRemove)
                    .removeClass("wpcf7-" + oldFieldType)
                    .removeClass("wpcf7-validates-as-email");
                $input.addClass(classToAdd)
                    .addClass("wpcf7-number")
                    .addClass("wpcf7-validates-as-number");

                inputType = "number";
            } else {    // Unsetting only numbers
                inputType = isSetEmail ? 'email' : 'text';
                var $input = $formColumns.find('.wpcf7-number');
                var classToRemove = /number-[\d]+/.exec($input[0].classList)[0];
                var classToAdd = inputType + "-" + /[0-9]+/.exec(classToRemove)[0];

                $input.attr("type", inputType);
                $input.removeClass(classToRemove)
                    .removeClass("wpcf7-number")
                    .removeClass("wpcf7-validates-as-number");
                $input.addClass(classToAdd)
                    .addClass("wpcf7-" + inputType);

                if ( 'email' === inputType ) {
                    $input.addClass("wpcf7-validates-as-email");
                }
            }

            $formColumns.each(function(index, column) {
                Rexbuilder_Rexwpcf7.refreshColumnContentStyle($(column));
            });
            break;
        case "wpcf7-placeholder":
            switch (inputType) {
                case "text":
                case "email":
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
            newValue = newValue.replace(/<p>[\u25A0\u00A0\s]*<\/p>/g, '');  // Removes p empty elements with standard whitespaces, non-breaking spaces and bullet points
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
                    var list = newValue.fields;
                    var editingType = newValue.type;
                    var listLength = list.length;

                    switch(editingType) {
                        case 'resetting':
                            var numberOfInputs = $formColumns[0].querySelectorAll('.wpcf7-list-item').length;
                            // console.log({
                            //     numberOfInputs: numberOfInputs,
                            //     listLength: listLength,
                            //     list: list.toString()
                            // })

                            if ( numberOfInputs < listLength ) {
                                for (var i = 0; i < listLength - numberOfInputs; i++) {
                                    updateColumnContentLive({
                                        target: data.target,
                                        content: data.content,
                                        propertyType: 'wpcf7-list-add',
                                        propertyName: undefined,
                                        newValue: undefined
                                    })
                                }
                            } else if ( numberOfInputs > listLength ) {
                                for (var i = 0; i < numberOfInputs - listLength; i++) {
                                    updateColumnContentLive({
                                        target: data.target,
                                        content: data.content,
                                        propertyType: 'wpcf7-list-remove',
                                        propertyName: undefined,
                                        newValue: numberOfInputs - 1 - i
                                    })
                                }
                            }
                        case 'sorting':
                            for (var i = 0; i < numberOfFormsInPage; i++) {
                                var $listItems = $formColumns.eq(i).find('.wpcf7-radio .wpcf7-list-item');

                                $listItems
                                    .removeClass('first')
                                    .removeClass('last');
                                $listItems.first().addClass('first');
                                $listItems.last().addClass('last');
                            }
                        case 'writing':
                            for (var i = 0; i < numberOfFormsInPage; i++) {
                                for (var j = 0; j < listLength; j++) {
                                    $formColumns.eq(i).find(".wpcf7-radio .wpcf7-list-item").eq(j)
                                        .find("input")
                                        .val(list[j])
                                    .end()
                                        .find(".wpcf7-radio-label")
                                        .text(list[j]);
                                }
                            }
                            break;
                        default: break;
                    }
                    
                    for (var i = 0; i < numberOfFormsInPage; i++) {
                        for (var j = 0; j < listLength; j++) {
                            $formColumns.find(".wpcf7-radio .wpcf7-list-item")
                                .removeClass("first")
                                .removeClass("last");
                            $formColumns.find(".wpcf7-radio .wpcf7-list-item").eq(j).find("input").val(list[j]);
                            $formColumns.find(".wpcf7-radio .wpcf7-list-item").eq(j).find(".wpcf7-radio-label").text(list[j]);
                        }
                    }
                    $formColumns.find(".wpcf7-radio .wpcf7-list-item").eq(0).addClass("first");
                    $formColumns.find(".wpcf7-radio .wpcf7-list-item").eq(listLength - 1).addClass("last");
                    break;
                case "file":
                    for (var i = 0; i < listLength; i++) {
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
                    var inputEmpty = $formColumns.find(".wpcf7-radio .wpcf7-list-item").length == 0;
                    var $inputs = $formColumns.find(".wpcf7-radio");
                    if (inputEmpty) {
                        var newRadio = tmpl("tmpl-rexwpcf7-new-radio-field", {});
                        $inputs.append(newRadio);
                    } else {
                        var $newRadio = $formColumns.find(".wpcf7-radio .wpcf7-list-item.last").eq(0).clone();

                        $formColumns.find(".wpcf7-radio .wpcf7-list-item.last").removeClass("last");
                        $newRadio.find(".wpcf7-radio-label").text("");
                        $newRadio.find("[type='radio']").val("");
                        $newRadio.addClass("last");
                        $newRadio.removeClass("first");
                        $inputs.append($newRadio);
                    }

                    fixWpcf7RadioButtons();
                    break;
                case "file":
                    $formColumns.find(".wpcf7-file").attr("accept", $formColumns.find(".wpcf7-file").attr("accept") + ",");
                    break;
                default:
                    break;
            }
            break;
        case "wpcf7-list-remove":
            var toRemove = parseInt(newValue);

            switch (inputType) {
                case "select":
                    var numberOfSelectsInPage = $formColumns.find(".wpcf7-select").length;
                    for (var i = 0; i < numberOfSelectsInPage; i++) {
                        $formColumns.find(".wpcf7-select").eq(i).find("option").eq(toRemove).remove();
                    }
                    break;
                case "radio":
                    var numberOfColumns = $formColumns.length;

                    for (var i = 0; i < numberOfColumns; i++) {
                        var $actualInput = $($formColumns[i].querySelectorAll('.wpcf7-radio'));
                        var $fieldToRemove = $($actualInput[0].querySelectorAll('.wpcf7-list-item')[toRemove - 1]);

                        var wasFirst = $fieldToRemove.hasClass("first");
                        var wasLast = $fieldToRemove.hasClass("last");
                        $fieldToRemove.remove();

                        if (wasFirst && wasLast) {
                            // Do nothing, it was deleted the only radio
                        } else {
                            if (wasFirst) {
                                $fieldToRemove = $actualInput.find(".wpcf7-list-item").first().addClass("first");
                            }

                            if (wasLast) {
                                $fieldToRemove = $actualInput.find(".wpcf7-list-item").last().addClass("last");
                            }
                        }

                        var $radios = $actualInput.find(".wpcf7-list-item");

                        for (var j = 0; j < $radios.length; j++) {
                            var classToRemove = /wpcf7-radio\-[0-9]+/.exec($radios.find("[type='radio']")[j].id)[0];
                            $($radios.find("[type='radio']")[j]).removeClass(classToRemove);
                        }
                    }

                    fixWpcf7RadioButtons();
                    break;
                case "file":
                    var fileTypesArray = $formColumns.find(".wpcf7-file").attr("accept").split(",");
                    fileTypesArray.splice(newValue - 1, 1);
                    $formColumns.find(".wpcf7-file").attr("accept", fileTypesArray);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
  }

  function createColumnContentSpanData(data) {
    var editPoint = data.editPoint;
    var formID = editPoint.element_id;
    var row_number = editPoint.row_number;
    var column_number = editPoint.column_number;
    var $formColumn = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

      var $formInDB = $formsInPage[formID];
      var $formColumnInDB = $formInDB.find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

    var $spanData = $(document.createElement("span"));
    $spanData.addClass("rex-wpcf7-column-content-data");

    // var columnHasText = $formColumn.find('.wpcf7-text').length != 0;
    // var columnHasEmail = $formColumn.find('.wpcf7-email').length != 0;
    // var columnHasNumber = $formColumn.find('.wpcf7-number').length != 0;
    // var columnHasTextarea = $formColumn.find('.wpcf7-textarea').length != 0;
    // var columnHasSelect = $formColumn.find('.wpcf7-select').length != 0;
    var columnHasRadio = $formColumn.find('.wpcf7-radio').length != 0;
    var columnHasCheckbox = $formColumn.find('.wpcf7-acceptance').length != 0;
    var columnHasFile = $formColumn.find('.wpcf7-file').length != 0;
    var columnHasSubmit = $formColumn.find('.wpcf7-submit').length != 0;

      // Taking data form Rexelement span data
      var $rexelementSpanData = $formColumn.parents(".rex-element-wrapper").find(".rex-element-data");

      if ( !columnHasRadio && !columnHasCheckbox && !columnHasFile && !columnHasSubmit ) {
          $spanData.attr("data-background-color", $rexelementSpanData.attr("data-wpcf7-content-background-color"));
          $spanData.attr("data-border-color", $rexelementSpanData.attr("data-wpcf7-content-border-color"));
          $spanData.attr("data-wpcf7-border-width", $rexelementSpanData.attr("data-wpcf7-content-border-width"));
          $spanData.attr("data-background-color-hover", $rexelementSpanData.attr("data-wpcf7-content-background-color-hover"));
          $spanData.attr("data-border-color-hover", $rexelementSpanData.attr("data-wpcf7-content-border-color-hover"));
      }

      if ( !columnHasSubmit ) {
          $spanData.attr("data-wpcf7-input-width", $rexelementSpanData.attr("data-wpcf7-content-width"));
          $spanData.attr("data-wpcf7-input-height", $rexelementSpanData.attr("data-wpcf7-content-height"));
          $spanData.attr("data-text-color", $rexelementSpanData.attr("data-wpcf7-content-text-color"));
          $spanData.attr("data-wpcf7-font-size", $rexelementSpanData.attr("data-wpcf7-content-font-size"));
          $spanData.attr("data-text-color-hover", $rexelementSpanData.attr("data-wpcf7-content-text-color-hover"));
      }

      var $spanDataInDB = $spanData.clone();
    $formColumn.prepend($spanData);

      if( 0 === $formColumnInDB.find('.wpcf7-column-content').length ) {
          var shortcode = $formColumnInDB.html(); // Not .text() because some shortcodes have HTML too (e.g. file)
          var $columnContent = $('<span class="wpcf7-column-content">' + shortcode + '</div>');
          $formColumnInDB.empty().append($columnContent);
      }

      $formColumnInDB.prepend($spanDataInDB);
  }

  function updateColumnContentShortcode(data) {
    var columnContentData = data.columnContentData;

    var formID = columnContentData.target.element_id;
    var row = columnContentData.target.row_number;
    var column = columnContentData.target.column_number;
    var inputType = columnContentData.input_type;

    var $formToUpdateDB = $formsInPage[formID];
    var $columnToUpdateDB = $formToUpdateDB.find(".wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"]");
    var shortcode = $columnToUpdateDB.find(".wpcf7-column-content").html();
    if ("undefined" == typeof shortcode) {
        shortcode = $columnToUpdateDB.html();
    }

    var isSetRequiredField = String(columnContentData.wpcf7_required_field) == "true";
    var isSetEmail = String(columnContentData.wpcf7_email) == "true";
    var onlyNumbers = String(columnContentData.wpcf7_only_numbers) == "true";
    var isSetDefaultCheck = String(columnContentData.wpcf7_default_check) == "true";
    var placeholder = columnContentData.wpcf7_placeholder;
    var fieldText = columnContentData.text;
    var listFields = columnContentData.wpcf7_list_fields;
    var fileMaxDim = columnContentData.wpcf7_file_max_dimensions;
    var buttonText = columnContentData.wpcf7_button.text;

    if (
        inputType == "text" || 
        inputType == "email" || 
        inputType == "number" || 
        inputType == "select" || 
        inputType == "file" || 
        inputType == "textarea"
        ) {   // Required field
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

    if(inputType == "text" || inputType == "email" || inputType == "number") {   // E-Mail
        // Changes the shortcode in [number number-xxx ...] or vice versa
        if (isSetEmail) {
            shortcode = shortcode.replace(/\[[a-z]+\*? [a-z]+/, "[number" + (isSetRequiredField ? "*": "") + " number");
            shortcode = shortcode.replace(/class:[a-z]+/, "class:number");

            inputType = "number";
        } else {
            var newFieldType = onlyNumbers ? "number" : "text";

            shortcode = shortcode.replace(/\[[a-z]+\*? [a-z]+/, "[" + newFieldType + (isSetRequiredField ? "*": "") + " " + newFieldType);
            shortcode = shortcode.replace(/class:[a-z]+/, "class:" + newFieldType);

            inputType = newFieldType;
        }
    }

    if(inputType == "text" || inputType == "email" || inputType == "number") {   // Only number
        // Changes the shortcode in [number number-xxx ...] or vice versa
        if (onlyNumbers) {
            shortcode = shortcode.replace(/\[[a-z]+\*? [a-z]+/, "[number" + (isSetRequiredField ? "*": "") + " number");
            shortcode = shortcode.replace(/class:[a-z]+/, "class:number");

            inputType = "number";
        } else {
            var newFieldType = isSetEmail ? "email" : "text";

            shortcode = shortcode.replace(/\[[a-z]+\*? [a-z]+/, "[" + newFieldType + (isSetRequiredField ? "*": "") + " " + newFieldType);
            shortcode = shortcode.replace(/class:[a-z]+/, "class:" + newFieldType);

            inputType = newFieldType;
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

    if (inputType == "text" || inputType == "email" || inputType == "number" || inputType == "textarea") {   // Placeholder
        /* Puts the "placeholder" string and the placeholder value at the end 
        of the shortcode or removes it */
			var valueIsEmpty = placeholder === '';
			var thereIsPlaceholder = /placeholder/.test(shortcode);
			if (valueIsEmpty) {
				shortcode = shortcode.replace(/\splaceholder ".+"/, '');
			} else {
				if (!thereIsPlaceholder) {
					shortcode = shortcode.replace(/\]/, ' placeholder "' + placeholder + '"]');
				} else {
					shortcode = shortcode.replace(/placeholder ".+"/, 'placeholder "' + placeholder + '"');
				}
			}
		}

		if (inputType == 'acceptance') {
			// Checkbox text
			shortcode = shortcode.replace(/\][\s\S]+\[/, ']' + fieldText + '[');
			shortcode = shortcode.replace(/<p>\s<\/p>/g, '');
		}

		if (inputType == 'select' || inputType == 'radio') {
			// Lists
			shortcode = shortcode.replace(/\s[\"\'][\s\S]+[\"\']/, '');
			for (var fieldIndex in listFields) {
				shortcode = shortcode.replace(']', " '" + listFields[fieldIndex] + "']");
			}
		}

		if (inputType == 'file') {
			// File max dimensions
			shortcode = shortcode.replace(/limit\:[\w]*/, 'limit:' + fileMaxDim); // A intuito da problemi se non ho impostato un limite dal backend
		}

		if ('file' === inputType) {
			// File types
			var fileTypesString = 'filetypes:';
			for (var i = 0; i < listFields.length; i++) {
				listFields[i] = listFields[i].toLowerCase();
				fileTypesString += listFields[i];

				if (i != listFields.length - 1) {
					fileTypesString += '|';
				}
			}
			shortcode = shortcode.replace(/filetypes\:[\w\|]*/, fileTypesString);
		}

		if (inputType == 'file') {
			// File caption
			var $fileCaption = $($.parseHTML(shortcode)[1]);
			$fileCaption.empty();
			$fileCaption.append(fieldText);
			shortcode = shortcode.replace(/\][\s\S]*/, ']' + $fileCaption[0].outerHTML);
		}

		if (inputType == 'submit') {
			// Submit button text
			shortcode = shortcode.replace(/[\"\'][\s\S]*[\"\']/, '"' + buttonText + '"');
		}

		var $columnShortcode = $columnToUpdateDB.find('.wpcf7-column-content');
		$columnShortcode.empty();
		$columnShortcode.append(shortcode);

		_updateSpanDataInDB(formID, columnContentData);
	}

	function fixBlocksHeight() {
		var rowTools = document.getElementById('rex-wpcf7-tools');
		if (null !== rowTools) {
			var height = parseInt($(rowTools).parents('.grid-stack-item').attr('data-gs-height'));
			height--;
			$(rowTools).parents('.grid-stack-item').attr('data-gs-height', height);
		}
	}

	/* ===== FormsInPage Functions ===== */

	/**
	 * Adds a newly inserted form in the Object
	 * of forms in current page and updates
	 * occurrencies and ids.
	 * @param {String} formID id of the new form
	 * @param {jQuery} $rows  rows of the new form, ready to
	 *                        eventually be saved in DB
	 */
	function addFormInPage(formID, $rows) {
		$formsInPage[formID] = $rows;

		formOccurencies[formID] = formOccurencies[formID] ? formOccurencies[formID] + 1 : 1;

		idsInPage.push(formID);
		idsInPage = idsInPage.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		});
	}

	function removeFormInPage(formID) {
		if (1 === formOccurencies[formID]) {
			// Means that the one we are removing is the last one in page
			delete $formsInPage[formID];
			delete formOccurencies[formID];
			idsInPage.splice(idsInPage.indexOf(formID), 1);
		} else {
			formOccurencies[formID] -= 1;
		}
	}

	function updateDBFormsInPage(formID, needToAddElementStyle) {
		var $elementWrappers = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper').has('.wpcf7-form');

		if (0 === $elementWrappers.length) {
			return;
		}

		idsInPage = [];
		$elementWrappers.each(function () {
			idsInPage.push($(this).attr('data-rex-element-id'));
		});

		formOccurencies = {};
		for (var i = 0; i < idsInPage.length; i++) {
			var id = idsInPage[i];
			formOccurencies[id] = formOccurencies[id] ? formOccurencies[id] + 1 : 1;
		}

		idsInPage = idsInPage.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		});

		// Check if ok
		// idsInPage = Rexbuilder_Util.removeArrayDuplicates(idsInPage);

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: _plugin_frontend_settings.rexajax.ajaxurl,
			data: {
				action: 'rex_wpcf7_get_forms',
				nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
				form_id: idsInPage
			},
			success: function (response) {
				if (response.success) {
					var i = 0;

					for (; i < idsInPage.length; i++) {
						$formsInPage[idsInPage[i]] = $(response.data.html_forms[i].toString().trim());

						if (needToAddElementStyle && idsInPage[i] == formID) {
							Rexbuilder_Rexelement.addElementStyle($elementWrappers.filter('[data-rex-element-id="' + formID + '"]'));
						}
					}

					Rexbuilder_Rexwpcf7.fixInputs();

					var $importedElementWrapper = Rexbuilder_Util.$rexContainer.find('.importing-element');

					Rexbuilder_Util_Editor.updateBlockContainerHeight($importedElementWrapper.parents('.text-wrap'));
					$importedElementWrapper.removeClass('importing-element');
				}
			}
		});
	}

	function updateFormInDB(formID) {
		if (undefined !== $formsInPage[formID]) {
			var formToUpdateString = $formsInPage[formID][0].outerHTML;
			var elementDataString = Rexbuilder_Util.$rexContainer
				.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]')
				.eq(0)
				.find('.rex-element-data')[0].outerHTML;

			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: _plugin_frontend_settings.rexajax.ajaxurl,
				data: {
					action: 'rex_wpcf7_save_changes',
					nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
					form_id: formID,
					new_form_string: formToUpdateString,
					element_data_string: elementDataString
				},
				success: function (response) {
					if (response.success) {
						formToUpdateString = '';
					}
				},
				error: function (response) {}
			});
		}
	}

	function getIDsInPage() {
		return idsInPage;
	}

	/* ===== FormsInPage Functions End ===== */
	/* ===== PUBLIC METHODS END ===== */

	/* ===== PRIVATE METHODS ===== */

	/* ===== FormsInPage Functions ===== */

	var $formsInPage; // Array of DB side of forms in page
	var idsInPage = [];
	var formOccurencies = {};

	function _updateSpanDataInDB(formID, columnContentData) {
		var $formInDB = $formsInPage[formID];
		var row = columnContentData.target.row_number;
		var column = columnContentData.target.column_number;
		var $columnDataInDB = $formInDB
			.find('.wpcf7-row[wpcf7-row-number="' + row + '"]')
			.find('.wpcf7-column[wpcf7-column-number="' + column + '"]')
			.find('.rex-wpcf7-column-content-data');
		var inputType = columnContentData.input_type;

		if ('submit' !== inputType && 'radio' !== inputType) {
			$columnDataInDB.attr('data-wpcf7-required-field', columnContentData.wpcf7_required_field);
		}

		if ('text' === inputType || 'email' === inputType || 'number' === inputType) {
			$columnDataInDB.attr('data-wpcf7-email', columnContentData.wpcf7_email);
			$columnDataInDB.attr('data-wpcf7-only-numbers', columnContentData.wpcf7_only_numbers);
		}

		if ('acceptance' === inputType) {
			$columnDataInDB.attr('data-wpcf7-default-check', columnContentData.wpcf7_default_check);
		}

		if (
			'text' === inputType ||
			'email' === inputType ||
			'number' === inputType ||
			'textarea' === inputType ||
			'select' === inputType
		) {
			$columnDataInDB.attr('data-wpcf7-placeholder', columnContentData.wpcf7_placeholder);
		}

		if ('file' === inputType) {
			$columnDataInDB.attr('data-wpcf7-file-max-dimensions', columnContentData.wpcf7_file_max_dimensions);
			$columnDataInDB.attr('data-wpcf7-file-types', columnContentData.wpcf7_list_fields);
		}

		if (inputType != 'file' && inputType != 'radio' && inputType != 'acceptance') {
			$columnDataInDB.attr('data-wpcf7-border-width', columnContentData.border_width);
			$columnDataInDB.attr('data-wpcf7-border-radius', columnContentData.border_radius);
			$columnDataInDB.attr('data-background-color', columnContentData.background_color);
			$columnDataInDB.attr('data-background-color-hover', columnContentData.background_color_hover);
			$columnDataInDB.attr('data-border-color', columnContentData.border_color);
			$columnDataInDB.attr('data-border-color-hover', columnContentData.border_color_hover);
		}

		$columnDataInDB.attr('data-wpcf7-input-width', columnContentData.input_width);
		$columnDataInDB.attr('data-wpcf7-input-height', columnContentData.input_height);
		$columnDataInDB.attr('data-wpcf7-font-size', columnContentData.font_size);
		$columnDataInDB.attr('data-text-color', columnContentData.text_color);
		$columnDataInDB.attr('data-text-color-hover', columnContentData.text_color_hover);
		$columnDataInDB.attr('data-text-color-focus', columnContentData.text_color_focus);

		if ('select' === inputType) {
			$columnDataInDB.attr('data-select-color-after-selection', columnContentData.select_color_after_selection);
		}

		if ('text' === inputType || 'email' === inputType || 'number' === inputType || 'textarea' === inputType) {
			$columnDataInDB.attr('data-placeholder-color', columnContentData.placeholder_color);
			$columnDataInDB.attr('data-placeholder-hover-color', columnContentData.placeholder_hover_color);
		}

		if ('file' === inputType || 'submit' === inputType) {
			$columnDataInDB.attr('data-button-text', columnContentData.wpcf7_button.text);
			$columnDataInDB.attr('data-button-text-font-size', columnContentData.wpcf7_button.font_size);
			$columnDataInDB.attr('data-button-height', columnContentData.wpcf7_button.height);
			$columnDataInDB.attr('data-button-width', columnContentData.wpcf7_button.width);
			$columnDataInDB.attr('data-button-border-width', columnContentData.wpcf7_button.border_width);
			$columnDataInDB.attr('data-button-border-radius', columnContentData.wpcf7_button.border_radius);
			$columnDataInDB.attr('data-button-margin-top', columnContentData.wpcf7_button.margin_top);
			$columnDataInDB.attr('data-button-margin-right', columnContentData.wpcf7_button.margin_right);
			$columnDataInDB.attr('data-button-margin-bottom', columnContentData.wpcf7_button.margin_bottom);
			$columnDataInDB.attr('data-button-margin-left', columnContentData.wpcf7_button.margin_left);
			$columnDataInDB.attr('data-button-padding-top', columnContentData.wpcf7_button.padding_top);
			$columnDataInDB.attr('data-button-padding-right', columnContentData.wpcf7_button.padding_right);
			$columnDataInDB.attr('data-button-padding-bottom', columnContentData.wpcf7_button.padding_bottom);
			$columnDataInDB.attr('data-button-padding-left', columnContentData.wpcf7_button.padding_left);
			$columnDataInDB.attr('data-button-text-color', columnContentData.wpcf7_button.text_color);
			$columnDataInDB.attr('data-button-text-color-hover', columnContentData.wpcf7_button.text_color_hover);
			$columnDataInDB.attr('data-button-background-color', columnContentData.wpcf7_button.background_color);
			$columnDataInDB.attr('data-button-background-color-hover', columnContentData.wpcf7_button.background_color_hover);
			$columnDataInDB.attr('data-button-border-color', columnContentData.wpcf7_button.border_color);
			$columnDataInDB.attr('data-button-border-color-hover', columnContentData.wpcf7_button.border_color_hover);
		}

		// $columnDataInDB.attr("data-wpcf7-required-field", columnContentData.wpcf7_required_field);
		// $columnDataInDB.attr("data-wpcf7-email", columnContentData.wpcf7_email);
		// $columnDataInDB.attr("data-wpcf7-only-numbers", columnContentData.wpcf7_only_numbers);
		// $columnDataInDB.attr("data-wpcf7-default-check", columnContentData.wpcf7_default_check);
		// $columnDataInDB.attr("data-wpcf7-placeholder", columnContentData.wpcf7_placeholder);
		// $columnDataInDB.attr("data-wpcf7-file-max-dimensions", columnContentData.wpcf7_file_max_dimensions);

		// if (inputType == "file") {
		//     $columnDataInDB.attr("data-wpcf7-file-types", columnContentData.wpcf7_list_fields);
		// }

		// if (inputType != "file" && inputType != "radio" && inputType != "acceptance") {
		//     $columnDataInDB.attr("data-wpcf7-border-width", columnContentData.border_width);
		//     $columnDataInDB.attr("data-wpcf7-border-radius", columnContentData.border_radius);
		//     $columnDataInDB.attr("data-background-color", columnContentData.background_color);
		//     $columnDataInDB.attr("data-background-color-hover", columnContentData.background_color_hover);
		//     $columnDataInDB.attr("data-border-color", columnContentData.border_color);
		//     $columnDataInDB.attr("data-border-color-hover", columnContentData.border_color_hover);
		// }

		// $columnDataInDB.attr("data-wpcf7-input-width", columnContentData.input_width);
		// $columnDataInDB.attr("data-wpcf7-input-height", columnContentData.input_height);
		// $columnDataInDB.attr("data-wpcf7-font-size", columnContentData.font_size);
		// $columnDataInDB.attr("data-text-color", columnContentData.text_color);
		// $columnDataInDB.attr("data-text-color-hover", columnContentData.text_color_hover);
		// $columnDataInDB.attr("data-text-color-focus", columnContentData.text_color_focus);
		// $columnDataInDB.attr("data-select-color-after-selection", columnContentData.select_color_after_selection);
		// $columnDataInDB.attr("data-placeholder-color", columnContentData.placeholder_color);
		// $columnDataInDB.attr("data-placeholder-hover-color", columnContentData.placeholder_hover_color);

		// $columnDataInDB.attr("data-button-text", columnContentData.wpcf7_button.text);
		// $columnDataInDB.attr("data-button-text-font-size", columnContentData.wpcf7_button.font_size);
		// $columnDataInDB.attr("data-button-height", columnContentData.wpcf7_button.height);
		// $columnDataInDB.attr("data-button-width", columnContentData.wpcf7_button.width);
		// $columnDataInDB.attr("data-button-border-width", columnContentData.wpcf7_button.border_width);
		// $columnDataInDB.attr("data-button-border-radius", columnContentData.wpcf7_button.border_radius);
		// $columnDataInDB.attr("data-button-margin-top", columnContentData.wpcf7_button.margin_top);
		// $columnDataInDB.attr("data-button-margin-right", columnContentData.wpcf7_button.margin_right);
		// $columnDataInDB.attr("data-button-margin-bottom", columnContentData.wpcf7_button.margin_bottom);
		// $columnDataInDB.attr("data-button-margin-left", columnContentData.wpcf7_button.margin_left);
		// $columnDataInDB.attr("data-button-padding-top", columnContentData.wpcf7_button.padding_top);
		// $columnDataInDB.attr("data-button-padding-right", columnContentData.wpcf7_button.padding_right);
		// $columnDataInDB.attr("data-button-padding-bottom", columnContentData.wpcf7_button.padding_bottom);
		// $columnDataInDB.attr("data-button-padding-left", columnContentData.wpcf7_button.padding_left);
		// $columnDataInDB.attr("data-button-text-color", columnContentData.wpcf7_button.text_color);
		// $columnDataInDB.attr("data-button-text-color-hover", columnContentData.wpcf7_button.text_color_hover);
		// $columnDataInDB.attr("data-button-background-color", columnContentData.wpcf7_button.background_color);
		// $columnDataInDB.attr("data-button-background-color-hover", columnContentData.wpcf7_button.background_color_hover);
		// $columnDataInDB.attr("data-button-border-color", columnContentData.wpcf7_button.border_color);
		// $columnDataInDB.attr("data-button-border-color-hover", columnContentData.wpcf7_button.border_color_hover);
	}

	function _getDBFormsInPage() {
		var $elementWrappers = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper').has('.wpcf7-form');

		if (0 === $elementWrappers.length) {
			return;
		}

		idsInPage = [];
		$elementWrappers.each(function () {
			idsInPage.push($(this).attr('data-rex-element-id'));
		});

		formOccurencies = {};
		for (var i = 0; i < idsInPage.length; i++) {
			var id = idsInPage[i];
			formOccurencies[id] = formOccurencies[id] ? formOccurencies[id] + 1 : 1;
		}

		idsInPage = idsInPage.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		});

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: _plugin_frontend_settings.rexajax.ajaxurl,
			data: {
				action: 'rex_wpcf7_get_forms',
				nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
				form_id: idsInPage
			},
			success: function (response) {
				if (response.success) {
					var i = 0;
					for (i = 0; i < idsInPage.length; i++) {
						$formsInPage[idsInPage[i]] = $(response.data.html_forms[i].toString().trim());
					}

					_setRowsSortable();
					Rexbuilder_Rexwpcf7.fixInputs();
					Rexbuilder_Rexelement.addStyles();
				}
			},
			error: function (response) {}
		});
	}

	function _saveNewField(insertionPoint, fieldShortcode) {
		var formID = insertionPoint.formID;
		var row = insertionPoint.row_number;
		var column = insertionPoint.column_number;

		var $columnToUpdateDB = $formsInPage[formID].find(
			'.wpcf7-row[wpcf7-row-number="' + row + '"] .wpcf7-column[wpcf7-column-number="' + column + '"]'
		);
		$columnToUpdateDB
			.removeClass('with-button')
			/*.find('.wpcf7-column-content')*/
			.append(fieldShortcode);
	}

	function _saveNewRow(formID, $newRow) {
		var $formToAddRow = $formsInPage[formID];
		var $lastRow = $formToAddRow.find('.wpcf7-row').last();

		$newRow.insertAfter($lastRow);
	}

	function _saveAddedRow(formID, rowNumber) {
		var $formToAddRow = $formsInPage[formID];
		var $rowBefore = $formToAddRow.find('.wpcf7-row[wpcf7-row-number="' + rowNumber + '"]');
		var $rowToAdd = $rowBefore.clone();

		$rowToAdd.insertAfter($rowBefore);
		_fixRowNumbers($formToAddRow);
	}

	function _saveClonedColumnRow(formID, clonedColumnNumber, numberRowBefore) {
		var $formToAddRow = $formsInPage[formID];

		var $rowBefore = $formToAddRow.find('.wpcf7-row[wpcf7-row-number="' + numberRowBefore + '"]');
		var $rowToAdd = $rowBefore.clone();

		$rowToAdd.insertAfter($rowBefore); // Inserting the new row in the form
		_fixRowNumbers($formToAddRow); // After this function row numbers are now correct

		var newRowNumber = numberRowBefore + 1;
		var $rowAdded = $formToAddRow.find('.wpcf7-row[wpcf7-row-number="' + newRowNumber + '"]'); // Need to declare this after _fixRowNumbers

		$rowAdded.find('.wpcf7-column').each(function (index, column) {
			if (index + 1 != clonedColumnNumber) {
				$(column).empty();

				var $plusButton = tmpl('tmpl-plus-button-inside-wpcf7-row', {});
				$(column).append($plusButton).addClass('with-button');
			}
		});
	}

	function _saveDeletingRow(formID, rowNumberToDelete) {
		var $formToDeleteRow = $formsInPage[formID];
		var $rowToDelete = $formToDeleteRow.find('.wpcf7-row[wpcf7-row-number="' + rowNumberToDelete + '"]');

		$rowToDelete.remove();

		_fixRowNumbers($formToDeleteRow);
	}

	function _saveDeletingColumnContent(formID, rowNumberToDelete, columnNumberToDelete) {
		var $formToDeleteColumn = $formsInPage[formID];
		var $columnToDelete = $formToDeleteColumn
			.find('.wpcf7-row[wpcf7-row-number="' + rowNumberToDelete + '"]')
			.find('.wpcf7-column[wpcf7-column-number="' + columnNumberToDelete + '"]');

		$columnToDelete.empty();
		var $plusButton = tmpl('tmpl-plus-button-inside-wpcf7-row', {});
		$columnToDelete.append($plusButton).addClass('with-button');
	}

	/* ===== FormsInPage Functions End ===== */

	function _fixRowNumbers($forms) {
		$forms.each(function (index, form) {
			$(form)
				.find('.wpcf7-row')
				.each(function (index, formRow) {
					$(formRow).attr('wpcf7-row-number', index + 1);
				});
		});
	}

	function _fixRowNumbersAndClasses($forms) {
		$forms.each(function (index, element) {
			$(element)
				.find('.wpcf7-row')
				.each(function (index, element) {
					var $formRow = $(element);

					$formRow.attr('wpcf7-row-number', index + 1);
				});
		});

		$forms
			.eq(0)
			.find('.wpcf7-row')
			.each(function (index) {
				var $formRow = $(this);

				// Refreshing all styles of the columns
				$formRow.find('.wpcf7-column').each(function () {
					var $formColumn = $(this);

					Rexbuilder_Rexwpcf7.refreshColumnContentStyle($formColumn);
				});
			});
	}

	function _setRowsSortable() {
		var $elementWrappers = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper');

		$elementWrappers
			.find('.wpcf7-rows')
			.addClass('ui-sortable')
			.sortable({
				// revert: true,
				direction: 'vertical',
				handle: '.rex-wpcf7-row-drag',
				cursor: 'pointer',
				update: function (e, ui) {
					var formID = ui.item.parents('.rex-element-wrapper').attr('data-rex-element-id');

					var startPosition = parseInt(ui.item.attr('wpcf7-row-number')); // Getting the old row position
					_fixRowNumbersAndClasses($elementWrappers.find('.wpcf7-form'));
					var endPosition = parseInt(ui.item.attr('wpcf7-row-number')); // Getting the new row position

					// Sorting rows in DB forms
					var $rowInDBMoved = $formsInPage[formID].find(".wpcf7-row[wpcf7-row-number='" + startPosition + "']");
					var $rowInDBAfter = $formsInPage[formID].find(".wpcf7-row[wpcf7-row-number='" + endPosition + "']");

					if (startPosition < endPosition) {
						$rowInDBMoved.insertAfter($rowInDBAfter);
					} else {
						$rowInDBMoved.insertBefore($rowInDBAfter);
					}

					_fixRowNumbers($formsInPage[formID]);
					// aggiornare pulsante salvataggio
				}
			});
	}

	/* ===== PRIVATE METHODS END ===== */

	function init() {
		styleSheet = null;
		$formsInPage = {};

		_getDBFormsInPage();
	}

	return {
		init: init,

		addField: addField,
		addNewRow: addNewRow,
		addRow: addRow,
		addClonedColumnRow: addClonedColumnRow,

		deleteRow: deleteRow,
		deleteColumnContent: deleteColumnContent,

		updateFormInDB: updateFormInDB,

		/* --- Modals --- */
		updateFormLive: updateFormLive,
		updateFormContentLive: updateFormContentLive,
		updateColumnContentLive: updateColumnContentLive,
		updateColumnContentShortcode: updateColumnContentShortcode,

		addFormInPage: addFormInPage,
		removeFormInPage: removeFormInPage,
		updateDBFormsInPage: updateDBFormsInPage,
		getIDsInPage: getIDsInPage,
		fixBlocksHeight: fixBlocksHeight,

		createColumnContentSpanData: createColumnContentSpanData
	};
})(jQuery);
