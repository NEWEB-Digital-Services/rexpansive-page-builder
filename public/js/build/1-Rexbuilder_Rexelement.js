var Rexbuilder_Rexelement = (function ($) {
	"use strict";

    var styleSheet;
    var elementsInPage;
    var elementDataDefaults;

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// CSS Rules Editing
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
    /// Rexelement Generic Functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Fixes the dragged element in the DOM.
     * @param  data
     * @since x.x.x
     */
	var _fixImportedElement = function (data) {
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-loading-element .rex-element-wrapper");
        var elementID = $elementWrapper.attr("data-rex-element-id");
        var $elementsParagraph = $elementWrapper.parents(".rex-elements-paragraph").eq(0);
        var $textWrap = $elementWrapper.parents(".text-wrap").eq(0);
        var $gridGallery = $elementWrapper.parents(".grid-stack-row").eq(0);
        var $section = $elementWrapper.parents(".rexpansive_section").eq(0);

        // Removing element unnecessary data
        $elementWrapper.show();     // Was hided before calling this function
        $elementWrapper.detach();
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

        // Getting the html of the element
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
            if (response.success) {     // If success get the element HTML and append it to a new div
                var $shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);

                var $elementContainer = $(document.createElement("div"));
                $elementContainer.addClass("rex-element-container");
                $elementWrapper.append($elementContainer);
                $elementContainer.append($shortcodeTransformed);

                // Get the shortcode and keep it as an attribute
                var shortcode = response.data.shortcode;
                var $spanShortcode = $(document.createElement("span"));
                $spanShortcode.addClass("string-shortcode");
                $spanShortcode.attr("shortcode", shortcode);
                $elementWrapper.prepend($spanShortcode);

                var $elementData = $elementWrapper.find(".rex-element-data");
                var $elementDataFromDB = $.parseHTML(response.data.element_data_html[0]);
                if (null !== $elementDataFromDB) {
                    $elementData.remove();
                    $elementWrapper.prepend($elementDataFromDB);
                }

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

        // Adding element style and updating elements in page if the new element 
        // is the first of the elements with that ID
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
            // _addElementStyle($elementWrapper);
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
        // galleryEditorInstance.updateElementHeight($block);

        // Removing medium editor placeholder if there
        var $textWrap = $elementWrapper.parents(".text-wrap");
        if ($textWrap.length != 0) {
            TextEditor.removePlaceholder($textWrap.eq(0));
        }

        // Adding form rows if element is wpcf7 and first time we are adding it
        if ($elementWrapper.find(".wpcf7").length != 0 && $elementWrapper.find(".wpcf7-rows").length == 0) {
            var $form = $elementWrapper.find(".wpcf7-form");
            var formID = elementID;
            var $firstElement = $form.children().first().detach();

            var $formFields = $form.find('p').children().filter(function() {    // Getting only the form fields
                var $field = $(this);
                if (
                        $field.find('.wpcf7-form-control-wrap').length != 0 ||
                        $field.find('.wpcf7-form-control').length != 0 ||
                        $field.is('.wpcf7-form-control-wrap') ||
                        $field.is('.wpcf7-form-control')
                    ) {
                    return this;
                } else {
                    return null;
                }
            }).detach();
            
            $form.find('p').remove();

            $formFields = $formFields.filter(function(index) {   // Filtering the fields
                var $field = $(this);
                if (
                        $field.find('[type=url]').length != 0 ||
                        $field.find('[type=tel]').length != 0 ||
                        $field.find('[type=date]').length != 0 ||
                        $field.find('.wpcf7-checkbox').length != 0 ||
                        $field.find('.wpcf7-quiz-label').length != 0
                    ) {
                    return null;
                } else {
                    return this;
                }
            });

            $form.empty();
            $form.prepend($firstElement);

            var $rows = $(document.createElement("div")).addClass("wpcf7-rows ui-sortable");
            $form.append($rows);

            var fieldsNumbers = [];
            $formFields.each(function (i, el) {
                var $el = $(el);

                var $newRow = $(document.createElement("div"))
                    .addClass("wpcf7-row wpcf7-row__1-column")
                    .attr("wpcf7-row-number", (i + 1));
                var $newColumn = $(document.createElement("div"))
                    .addClass("wpcf7-column")
                    .attr("wpcf7-column-number", "1");
                var $newColumnContent = $(document.createElement("span"))
                    .addClass("wpcf7-column-content")
                    .append(el);
                $newColumn.append($newColumnContent);
                $newRow.append($newColumn);
                $rows.append($newRow);

                var containsText = $el.find('[type=text]').length != 0;
                var containsEmail = $el.find('.wpcf7-email').length != 0;
                var containsNumber = $el.find('.wpcf7-number').length != 0;
                var containsTextarea = $el.find('.wpcf7-textarea').length != 0;
                var containsSelect = $el.find('.wpcf7-select').length != 0;
                var containsRadioButtons = $el.find('.wpcf7-radio').length != 0;
                var containsCheckbox = $el.find('.wpcf7-acceptance').length != 0;
                var containsFile = $el.find('.wpcf7-file').length != 0;
                var containsSubmit = $el.is('.wpcf7-submit');

                var randomNumber = Rexbuilder_Util.createRandomNumericID(3);
                fieldsNumbers[i] = randomNumber;

                if (containsText) { // Fixing all the fields
                    var $input = $el.find('.wpcf7-text');

                    var classToDelete = $input.attr('name');
                    $el.removeClass(classToDelete);

                    var newName = "text-" + randomNumber;
                    $input.attr('name', newName);
                    $input.addClass(newName);
                    $el.addClass(newName);
                    $input.attr('size', '');
                } else if (containsEmail) {
                    var $input = $el.find('.wpcf7-email');
                    $input.removeClass('wpcf7-text');

                    var classToDelete = $input.attr('name');
                    $el.removeClass(classToDelete);

                    var newName = "email-" + randomNumber;
                    $input.attr('name', newName);
                    $input.addClass(newName);
                    $el.addClass(newName);
                    $input.attr('size', '');
                } else if (containsNumber) {
                    var $input = $el.find('.wpcf7-number');

                    var classToDelete = $input.attr('name');
                    $el.removeClass(classToDelete);

                    var newName = "number-" + randomNumber;
                    $input.attr('name', newName);
                    $input.addClass(newName);
                    $el.addClass(newName);
                    $input.attr('size', '');
                } else if (containsTextarea) {
                    var $input = $el.find('.wpcf7-textarea');

                    var classToDelete = $input.attr('name');
                    $el.removeClass(classToDelete);

                    var newName = "textarea-" + randomNumber;
                    $input.attr('name', newName);
                    $input.addClass(newName);
                    $el.addClass(newName);
                } else if (containsSelect) {
                    var $input = $el.find('.wpcf7-select');

                    var classToDelete = $input.attr('name');
                    $el.removeClass(classToDelete);

                    var newName = "menu-" + randomNumber;
                    $input.attr('name', newName);
                    $input.addClass(newName);
                    $input.prepend('<option value="" disabled="disabled" selected="selected">Select something</option>');
                    $el.addClass(newName);
                } else if (containsRadioButtons) {
                    var classToDelete = $el.find('[type=radio]').eq(0).attr('name');
                    $el.removeClass(classToDelete);

                    var newName = "radio-" + randomNumber;
                    $el.find('[type=radio]').attr('name', newName);
                    $el.addClass(newName);
                } else if (containsCheckbox) {
                    var classToDelete = $el.find('[type=checkbox]').eq(0).attr('name');
                    $el.removeClass(classToDelete);

                    var newName = "acceptance-" + randomNumber;
                    $el.find('[type=checkbox]').attr('name', newName);
                    $el.addClass(newName);
                } else if (containsFile) {
                    var classToDelete = $el.find('[type=file]').eq(0).attr('name');
                    $el.removeClass(classToDelete);

                    var newName = "file-" + randomNumber;
                    $el.find('[type=file]').attr('name', newName);
                    $el.append('<div class="wpcf7-file-caption">Your text here</div>');
                    $el.addClass(newName);
                } else if (containsSubmit) {
                    var newName = "submit-" + randomNumber;
                    $el.addClass(newName);
                }
            });

            _fixFormInDB(formID, fieldsNumbers);
        } else {    // If it's not a new element
            Rexbuilder_Rexwpcf7.updateDBFormsInPage(elementID, !flagElementFound);
        }

        Rexbuilder_Rexwpcf7.addWpcf7MenuPlaceholders();
        Rexbuilder_Rexwpcf7.fixWpcf7RadioButtons();
        Rexbuilder_Rexwpcf7.fixWpcf7Files();
        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);

        /* Copied form Rexbuilder_Rexbutton */
        // locking grid to prevent errors on focus right text node
        // var $element = $textWrap.parents(".grid-stack-item");
        // var $section = $element.parents(".rexpansive_section");
        // Rexbuilder_Util.getGalleryInstance($section).focusElement($element);
    }

    var _fixFormInDB = function (formID, fieldsNumbers) {
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
                var fieldsString = response.data.html_form.toString().trim();

                if (/\[url\*?\s/.test(fieldsString)) {
                    fieldsString = fieldsString.replace(/\[url\*?[^\]]+/.exec(fieldsString)[0] + ']', '')
                }

                if (/\[tel\*?\s/.test(fieldsString)) {
                    fieldsString = fieldsString.replace(/\[tel\*?[^\]]+/.exec(fieldsString)[0] + ']', '');
                }

                if (/\[date\*?\s/.test(fieldsString)) {
                    fieldsString = fieldsString.replace(/\[date\*?[^\]]+/.exec(fieldsString)[0] + ']', '');
                }

                if (/\[checkbox\*?\s/.test(fieldsString)) {
                    fieldsString = fieldsString.replace(/\[checkbox\*?[^\]]+/.exec(fieldsString)[0] + ']', '');
                }

                if (/\[quiz\*?\s/.test(fieldsString)) {
                    fieldsString = fieldsString.replace(/\[quiz\*?[^\]]+/.exec(fieldsString)[0] + ']', '');
                }

                var fieldsShortcodes = [];
                var i = 0;
                var $rows = $(document.createElement("div")).addClass("wpcf7-rows ui-sortable");
                while (/\[[\w]+[^\]]+/.test(fieldsString)) {
                    // Extracting and fixing wpcf7 shortcodes of the new form
                    fieldsShortcodes[i] = /\[[\w]+[^\]]+/.exec(fieldsString)[0] + ']';

                    console.log(/\[text\*? [^\s]+/.exec(fieldsShortcodes[i]));
                    if (/\[text\*?\s/.test(fieldsShortcodes[i])) {
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[text\*? [^\s]+/, '[text text-' + fieldsNumbers[i] + ' class:text-' + fieldsNumbers[i]);    // Missing: adding * if it is present in the original shortcode   
                    } else if (/\[email\*?/.test(fieldsShortcodes[i])) {
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[email\*? [^\s]+/, '[email email-' + fieldsNumbers[i] + ' class:email-' + fieldsNumbers[i]);    // Missing: adding * if it is present in the original shortcode
                    } else if (/\[number\*?/.test(fieldsShortcodes[i])) {
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[number\*? [^\s]+/, '[number number-' + fieldsNumbers[i] + ' class:number-' + fieldsNumbers[i]);    // Missing: adding * if it is present in the original shortcode
                    } else if (/\[textarea\*?/.test(fieldsShortcodes[i])) {
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[textarea\*? [^\s]+/, '[textarea textarea-' + fieldsNumbers[i] + ' class:textarea-' + fieldsNumbers[i]);    // Missing: adding * if it is present in the original shortcode
                    } else if (/\[select\*?/.test(fieldsShortcodes[i])) {
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[select\*? [^\s]+/, '[select menu-' + fieldsNumbers[i] + ' class:menu-' + fieldsNumbers[i]);    // Missing: adding * if it is present in the original shortcode
                    } else if (/\[radio\*?/.test(fieldsShortcodes[i])) {
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[radio\*? [^\s]+/, '[radio radio-' + fieldsNumbers[i]); // Missing: adding * if it is present in the original shortcode
                    } else if (/\[acceptance\*?/.test(fieldsShortcodes[i])) {
                        fieldsShortcodes[i] = /\[[\w]+[^\\/]+/.exec(fieldsString) + '/acceptance]';
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[acceptance\*? [^\s]+/, '[acceptance acceptance-' + fieldsNumbers[i]);  // Missing: adding * if it is present in the original shortcode
                    } else if (/\[file\*?/.test(fieldsShortcodes[i])) {
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[file [^\s]+/, '[file file-' + fieldsNumbers[i]);   // Missing: adding * if it is present in the original shortcode
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(']', ']' + '<div class="wpcf7-file-caption">Your text here</div>');
                    } else if (/\[submit\*?/.test(fieldsShortcodes[i])) {
                        fieldsString = fieldsString.replace(fieldsShortcodes[i], '');
                        fieldsShortcodes[i] = fieldsShortcodes[i].replace(/\[submit\*? [^\s]+/, '[submit submit-' + fieldsNumbers[i] + ' class:submit-' + fieldsNumbers[i]);    // Missing: adding * if it is present in the original shortcode
                    }
                    if (!/\]/.test(fieldsShortcodes[i])) {
                        fieldsShortcodes[i] += ']';
                    }

                    var $newRow = $(document.createElement("div"))
                        .addClass("wpcf7-row wpcf7-row__1-column")
                        .attr("wpcf7-row-number", (i + 1));
                    var $newColumn = $(document.createElement("div"))
                        .addClass("wpcf7-column")
                        .attr("wpcf7-column-number", "1")
                        .append(fieldsShortcodes[i]);
                    $newRow.append($newColumn);
                    $rows.append($newRow);

                    i++;
                }

                Rexbuilder_Rexwpcf7.addFormInPage(formID, $rows);   // Necessary for creating column content data

                $rows.find('.wpcf7-column').each(function(i, el) {
                    Rexbuilder_Rexwpcf7.createColumnContentSpanData({
                        editPoint: {
                            element_id: formID,
                            row_number: (i + 1),
                            column_number: 1,
                        }
                    });
                });

                var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").eq(0);
                _addElementStyle($elementWrapper);
              }
            },
            error: function(response) {}
        });
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

        // If element was last of that model in page, remove it form elementsInPage array
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

        // _addElementStyle($elementWrapper);
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
                // $elementData.remove();
                // $elementData = $.parseHTML(response.data.element_data_html[0]);
                // $elementWrapper.prepend($elementData);

                _endFixingElementImported($elementWrapper);

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
        $elementData.attr("data-background-color", elementData.background_color);
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
                error_message_color: "",
                error_message_font_size: "",
                send_message_color: "",
                send_message_font_size: "",
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
                },
                options_different: {
                    width: true,
                    height: true,
                    font_size: true,
                    text_color: true
                }
            },
            element_target: {
                element_id: "",
                element_number: "",
            }
        };

        var $form = $elementWrapper.find('.wpcf7-form');

        var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
        var elementDataEl = $elementData[0];

        // Element General Data 
        elementData.element_target.element_id = $elementWrapper.attr("data-rex-element-id");
        elementData.element_target.element_number = parseInt($elementWrapper.attr("data-rex-element-number"));

        elementData.synchronize = typeof $elementData.attr("data-synchronize") == "undefined" ? false : $elementData.attr("data-synchronize").toString();

        var separate = false;
        if ($elementWrapper.hasClass("rex-separate-element") || getAllData) {
            separate = true;
        }

        /* WPCF7 */
        // Background color
        elementData.wpcf7_data.background_color = (elementDataEl.getAttribute("data-wpcf7-background-color") ? elementDataEl.getAttribute("data-wpcf7-background-color").toString() : $form.css('background-color'));

        // Border color
        elementData.wpcf7_data.border_color = (elementDataEl.getAttribute("data-wpcf7-border-color") ? elementDataEl.getAttribute("data-wpcf7-border-color").toString() : $form.css('border-color'));

        // Border width
        elementData.wpcf7_data.border_width = (elementDataEl.getAttribute("data-wpcf7-border-width") ? elementDataEl.getAttribute("data-wpcf7-border-width").toString() : $form.css('border-width'));

        // Margins
        elementData.wpcf7_data.margin_top = (elementDataEl.getAttribute("data-wpcf7-margin-top") ? elementDataEl.getAttribute("data-wpcf7-margin-top").toString() : $form.css('margin-top'));
        elementData.wpcf7_data.margin_left = (elementDataEl.getAttribute("data-wpcf7-margin-left") ? elementDataEl.getAttribute("data-wpcf7-margin-left").toString() : $form.css('margin-left'));
        elementData.wpcf7_data.margin_right = (elementDataEl.getAttribute("data-wpcf7-margin-right") ? elementDataEl.getAttribute("data-wpcf7-margin-right").toString() : $form.css('margin-right'));
        elementData.wpcf7_data.margin_bottom = (elementDataEl.getAttribute("data-wpcf7-margin-bottom") ? elementDataEl.getAttribute("data-wpcf7-margin-bottom").toString() : $form.css('margin-bottom'));

        // Columns padding
        elementData.wpcf7_data.columns.padding_top = (elementDataEl.getAttribute("data-wpcf7-columns-padding-top") ? elementDataEl.getAttribute("data-wpcf7-columns-padding-top").toString() : elementDataDefaults.wpcf7_data.columns.padding_top);
        elementData.wpcf7_data.columns.padding_left = (elementDataEl.getAttribute("data-wpcf7-columns-padding-left") ? elementDataEl.getAttribute("data-wpcf7-columns-padding-left").toString() : elementDataDefaults.wpcf7_data.columns.padding_left);
        elementData.wpcf7_data.columns.padding_right = (elementDataEl.getAttribute("data-wpcf7-columns-padding-right") ? elementDataEl.getAttribute("data-wpcf7-columns-padding-right").toString() : elementDataDefaults.wpcf7_data.columns.padding_right);
        elementData.wpcf7_data.columns.padding_bottom = (elementDataEl.getAttribute("data-wpcf7-columns-padding-bottom") ? elementDataEl.getAttribute("data-wpcf7-columns-padding-bottom").toString() : elementDataDefaults.wpcf7_data.columns.padding_bottom);

        // Error Message
        elementData.wpcf7_data.error_message_color = (elementDataEl.getAttribute("data-wpcf7-error-message-color") ? elementDataEl.getAttribute("data-wpcf7-error-message-color").toString() : elementDataDefaults.wpcf7_data.error_message_color);
        elementData.wpcf7_data.error_message_font_size = (elementDataEl.getAttribute("data-wpcf7-error-message-font-size") ? elementDataEl.getAttribute("data-wpcf7-error-message-font-size").toString() : elementDataDefaults.wpcf7_data.error_message_font_size);

        // Send Message
        elementData.wpcf7_data.send_message_color = (elementDataEl.getAttribute("data-wpcf7-send-message-color") ? elementDataEl.getAttribute("data-wpcf7-send-message-color").toString() : elementDataDefaults.wpcf7_data.send_message_color);
        elementData.wpcf7_data.send_message_font_size = (elementDataEl.getAttribute("data-wpcf7-send-message-font-size") ? elementDataEl.getAttribute("data-wpcf7-send-message-font-size").toString() : elementDataDefaults.wpcf7_data.send_message_font_size);

        /* WPCF7 CONTENT */
        // Content width
        elementData.wpcf7_data.content.width = (elementDataEl.getAttribute("data-wpcf7-content-width") ? elementDataEl.getAttribute("data-wpcf7-content-width").toString() : elementDataDefaults.wpcf7_data.content.width);

        // Content height
        elementData.wpcf7_data.content.height = (elementDataEl.getAttribute("data-wpcf7-content-height") ? elementDataEl.getAttribute("data-wpcf7-content-height").toString() : elementDataDefaults.wpcf7_data.content.height);

        // Content font size
        elementData.wpcf7_data.content.font_size = (elementDataEl.getAttribute("data-wpcf7-content-font-size") ? elementDataEl.getAttribute("data-wpcf7-content-font-size").toString() : elementDataDefaults.wpcf7_data.content.font_size);

        // Content border width
        elementData.wpcf7_data.content.border_width = (elementDataEl.getAttribute("data-wpcf7-content-border-width") ? elementDataEl.getAttribute("data-wpcf7-content-border-width").toString() : elementDataDefaults.wpcf7_data.content.border_width);

        // Content border radius
        elementData.wpcf7_data.content.border_radius = (elementDataEl.getAttribute("data-wpcf7-content-border-radius") ? elementDataEl.getAttribute("data-wpcf7-content-border-radius").toString() : elementDataDefaults.wpcf7_data.content.border_radius);

        // Content text color
        elementData.wpcf7_data.content.text_color = (elementDataEl.getAttribute("data-wpcf7-content-text-color") ? elementDataEl.getAttribute("data-wpcf7-content-text-color").toString() : elementDataDefaults.wpcf7_data.content.text_color);

        // Content background color
        elementData.wpcf7_data.content.background_color = (elementDataEl.getAttribute("data-wpcf7-content-background-color") ? elementDataEl.getAttribute("data-wpcf7-content-background-color").toString() : elementDataDefaults.wpcf7_data.content.background_color);

        // Content border color
        elementData.wpcf7_data.content.border_color = (elementDataEl.getAttribute("data-wpcf7-content-border-color") ? elementDataEl.getAttribute("data-wpcf7-content-border-color").toString() : elementDataDefaults.wpcf7_data.content.border_color);

        // Content text color hover
        elementData.wpcf7_data.content.text_color_hover = (elementDataEl.getAttribute("data-wpcf7-content-text-color-hover") ? elementDataEl.getAttribute("data-wpcf7-content-text-color-hover").toString() : elementDataDefaults.wpcf7_data.content.text_color_hover);

        // Content background color hover
        elementData.wpcf7_data.content.background_color_hover = (elementDataEl.getAttribute("data-wpcf7-content-background-color-hover") ? elementDataEl.getAttribute("data-wpcf7-content-background-color-hover").toString() : elementDataDefaults.wpcf7_data.content.background_color_hover);

        // Content border color hover
        elementData.wpcf7_data.content.border_color_hover = (elementDataEl.getAttribute("data-wpcf7-content-border-color-hover") ? elementDataEl.getAttribute("data-wpcf7-content-border-color-hover").toString() : elementDataDefaults.wpcf7_data.content.border_color_hover);

        // Options different
        elementData.wpcf7_data.options_different = _scanOptionsDifferent(elementData.element_target.element_id, elementData.wpcf7_data.options_different);

        var data = {
            elementInfo: elementData,
            separateElement: separate
        }

        return data;
    }

    var _scanOptionsDifferent = function(elementID, optionsDifferent) {
        var $elementWrapperToScan = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]").eq(0);
        var $columnsSpanData = $elementWrapperToScan.find('.rex-wpcf7-column-content-data');

        // Getting data from columns span data
        var columnsWidths = $columnsSpanData.map( function(){
            return $(this).attr("data-wpcf7-input-width");
        }).get();
        var columnsHeights = $columnsSpanData.map( function(){
            return $(this).attr("data-wpcf7-input-height");
        }).get();
        var columnsTextColors = $columnsSpanData.map( function(){
            return $(this).attr("data-text-color");
        }).get();
        var columnsFontSizes = $columnsSpanData.map( function(){
            return $(this).attr("data-wpcf7-font-size");
        }).get();

        // Checking if there are different values
        optionsDifferent.width = !columnsWidths.every(function (val, i, arr) {
            return val === arr[0];
        });
        optionsDifferent.height = !columnsHeights.every(function (val, i, arr) {
            return val === arr[0];
        });
        optionsDifferent.text_color = !columnsTextColors.every(function (val, i, arr) {
            return val === arr[0];
        });
        optionsDifferent.font_size = !columnsFontSizes.every(function (val, i, arr) {
            return val === arr[0];
        });

        return optionsDifferent;
    }

    var _removeModelData = function ($elementWrapper) {
        var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
        $elementData.removeAttr("data-background-color");
    }

    var _addElementStyle = function ($elementWrapper) {
        if ($elementWrapper.find(".rex-element-data").eq(0).length != 0) {
            // var elementData = _generateElementData($elementWrapper, true);
            // var elementID = elementData.elementInfo.element_target.element_id;
            // _addCSSRules(elementID, elementData.elementInfo);
        }

        // Adding form style if the element is a form
        if ($elementWrapper.find('.wpcf7-form').length != 0) {
            Rexbuilder_Rexwpcf7.addFormStyle($elementWrapper.find(".wpcf7-form"), true);
            $elementWrapper.find(".wpcf7-column").each(function(){
                Rexbuilder_Rexwpcf7.addColumnContentStyle($(this));
            })
        }
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
        // @todo
        _removeElementBackgroundRule(elementID);
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

        elementDataDefaults = {
            synchronize: false,
            wpcf7_data: {
                background_color: 'rgb(0, 0, 0, 0)',
                border_color: 'rgb(0, 0, 0, 1)',
                border_width: '2px',
                margin_top: '5px',
                margin_left: '5px',
                margin_right: '5px',
                margin_bottom: '5px',
                error_message_color: 'rgb(0, 0, 0, 1)',
                error_message_font_size: '15px',
                send_message_color: 'rgb(0, 0, 0, 1)',
                send_message_font_size: '15px',
                columns: {
                    padding_top: '15px',
                    padding_left: '15px',
                    padding_right: '15px',
                    padding_bottom: '15px',
                },
                content: {
                    background_color: 'rgb(255, 255, 255, 1)',
                    background_color_hover: 'rgb(255, 255, 255, 1)',
                    text_color: 'rgb(0, 0, 0, 1)',
                    text_color_hover: 'rgb(0, 0, 0, 1)',
                    border_color: 'rgb(0, 0, 0, 1)',
                    border_color_hover: 'rgb(0, 0, 0, 1)',
                    width: '150px',
                    height: '50px',
                    font_size: '15px',
                    border_width: '0px',
                    border_radius: '0px',
                },
                options_different: {
                    width: true,
                    height: true,
                    font_size: true,
                    text_color: true
                }
            },
            element_target: {
                element_id: "",
                element_number: "",
            }
        };
        this.$rexelementsStyle = $("#rexpansive-builder-rexelement-style-inline-css");

        _fixCustomStyleElement();
        _updateElementListInPage();
		_linkDocumentListeners();
	}

	return {
		init: init,

        // CSS Rules Editing
        generateElementData: _generateElementData,
        addStyles: _addStyles,

        // Rexelement functions
        addElementStyle: _addElementStyle,
		fixImportedElement: _fixImportedElement,
        getElementsInPage: _getElementsInPage,
        lockSynchronize: _lockSynchronize,
        separateRexElement: _separateRexElement,
        refreshSeparatedRexElement: _refreshSeparatedRexElement,
        updateElement: _updateElement,
        updateElementLive: _updateElementLive,
        removeSeparateElement: _removeSeparateElement
	}
})(jQuery);