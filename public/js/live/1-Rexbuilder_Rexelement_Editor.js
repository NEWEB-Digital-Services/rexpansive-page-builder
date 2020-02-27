var Rexbuilder_Rexelement_Editor = (function($) {
	"use strict";

  /* ===== GLOBAL VARIABLES ===== */
  
	var elementsInPage;
  var elementDataDefaults;

  /* ===== PUBLIC METHODS ===== */

  /**
   * Fixes the dragged element in the DOM. Called right after
   * the drag & drop event in Rexlive_Element_Import.js
   * @param  {Object} data Contains mouse position of the drop.
   * @since 2.0.4
   */
  function fixImportedElement( data ) {
    var $elementWrapper = Rexbuilder_Util.$rexContainer.find('.rex-loading-element .rex-element-wrapper');
    var elementID = $elementWrapper.attr('data-rex-element-id');
    var $elementsParagraph = $elementWrapper.parents('.rex-elements-paragraph').eq(0);
    var $textWrap = $elementWrapper.parents('.text-wrap').eq(0);
    var $gridGallery = $elementWrapper.parents('.grid-stack-row').eq(0);
    var $section = $elementWrapper.parents('.rexpansive_section').eq(0);

    // Removing element unnecessary data
    $elementWrapper.detach();
    $gridGallery.find('.element-list-preview').remove();

    var dropType;
    if ($textWrap.length == 0) {
      if ($gridGallery.length != 0) {
        dropType = 'inside-row';
      } else {
        dropType = 'inside-new-row';
      }
    } else if ($elementsParagraph.length != 0) {
      dropType = 'inside-paragraph';
    } else {
      dropType = 'inside-block';
    }

    // Getting the html of the element
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: _plugin_frontend_settings.rexajax.ajaxurl,
      data: {
        action: 'rex_transform_element_shortcode',
        nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
        elementID: elementID
      },
      success: function(response) {
        // If success get the element HTML and append it to a new div
        if (response.success) {
          var $shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);
          var formFieldsString = response.data.form_content.toString().trim();

          var $elementContainer = $(document.createElement('div'));
          $elementContainer.addClass('rex-element-container');
          $elementWrapper.append($elementContainer);
          $elementContainer.append($shortcodeTransformed);

          // Get the shortcode and keep it as an attribute
          var shortcode = response.data.shortcode;
          var $spanShortcode = $(document.createElement('span'));
          $spanShortcode.addClass('string-shortcode');
          $spanShortcode.attr('shortcode', shortcode);
          $elementWrapper.prepend($spanShortcode);

          var $elementData = $elementWrapper.find('.rex-element-data');
          var elementDataFromDB = $.parseHTML(response.data.element_data_html[0]);

          $elementData.attr('data-synchronize', false);

          if ( null !== elementDataFromDB ) {
            $elementData.remove();

            var $elementDataFromDB = $(elementDataFromDB);
            $elementWrapper.prepend($elementDataFromDB);
            $elementDataFromDB.attr('data-synchronize', false);
          }

          switch (dropType) {
            case "inside-block":
              $elementWrapper.wrap('<span class="rex-elements-paragraph"></span>');
              _endFixingImportedElement($elementWrapper, formFieldsString);
              Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
              break;
            case "inside-paragraph":
              _endFixingImportedElement($elementWrapper, formFieldsString);
              Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
              break;
            case "inside-row":
                var ev = jQuery.Event('rexlive:insert_new_text_block');
                ev.settings = {
                  data_to_send: {
                    $elementWrapper: $elementWrapper,
                    $section: $section,
                    addBlockElement: true,
                    mousePosition: data.mousePosition,
                    formFieldsString: formFieldsString
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
  }

  function handleCompleteImportElement( e ) {
    var data = e.settings;
    var $newDOMElement = data.$elementAdded;
    var $elementWrapper = data.$elementWrapper;
    var formFieldsString = data.formFieldsString;
    $elementWrapper.detach().prependTo($newDOMElement.find(".text-wrap").eq(0));
    $elementWrapper.wrap("<span class=\"rex-elements-paragraph\"></span>");
    _endFixingImportedElement($elementWrapper, formFieldsString);
  }

  function separateRexElement(data) {
    var elementData = data.elementData;
    var newID = data.newID;
    var elementID = elementData.element_target.element_id;
    var $elementWrapper = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + elementID + '"][data-rex-element-number="' + elementData.element_target.element_number + '"]');

    $elementWrapper.addClass('rex-separate-element');
    $elementWrapper.attr('data-rex-element-id', newID);
    $elementWrapper.attr('data-rex-element-number', 1);
    elementsInPage.push({
      id: newID,
      number: 1
    });

    // If element was last of that model in page, remove it form elementsInPage array
    if ( 0 === Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + elementID + '"]').length ) {
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

    Rexbuilder_Rexwpcf7_Editor.removeFormInPage(elementID);
  }

  /**
   * Refreshes the element from the shortcode. This happens when we 
   * have a separate element
   * @param  data
   */
  function refreshSeparatedRexElement(data) {
    var elementID = data.elementID.toString();
    var oldElementID = data.oldElementID.toString();
    var elementData = data.elementData;
    var $elementWrapper = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + elementID + '"]');
    var $elementShortcode = $elementWrapper.find('.string-shortcode');
    var elementShortcode = $elementShortcode.attr('shortcode').toString();

    var newElementShortcode = elementShortcode.replace(oldElementID, elementID);
    $elementShortcode.attr('shortcode', newElementShortcode);

    // Deleting the style
    // _removeElementStyle(elementID);

    // Ajax call to get the html of the element
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: _plugin_frontend_settings.rexajax.ajaxurl,
      data: {
        action: 'rex_transform_element_shortcode',
        nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
        elementID: elementID
      },
      success: function(response) {
        if (response.success) {
          var formFieldsString = response.data.form_content.toString().trim();
          // Deleting the old element
          var $elementContainer = $elementWrapper.find('.rex-element-container');
          $elementContainer.empty();

          // If success get the element HTML and append it to the right div
          var $shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);
          $elementContainer.append($shortcodeTransformed);

          lockSynchronize(elementData);
          _endFixingSeparatedElement($elementWrapper, formFieldsString);
        }
      },
      error: function(response) {}
    });
  }

  function lockSynchronize(data) {
    var elementID = data.element_target.element_id;
    var $elementWrapper = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + elementID + '"][data-rex-element-number="' + data.element_target.element_number + '"]');
    $elementWrapper.find('.rex-element-data').attr('data-synchronize', true);
  }

  /* ===== PUBLIC METHODS END ===== */

  /* ===== PRIVATE METHODS ===== */

  function _endFixingImportedElement($elementWrapper, formFieldsString) {
    var addingWpcf7 = 0 !== $elementWrapper.find('.wpcf7').length;

    var elementID = $elementWrapper.attr('data-rex-element-id');
		var flagElementFound = false;

		// Adding element style and updating elements in page if the new element 
		// is the first of the elements with that ID
		$elementWrapper.attr('data-rex-element-number', 1);
		for (var i = 0; i < elementsInPage.length; i++) {
			if (elementsInPage[i].id == elementID) {
				elementsInPage[i].number += 1;
				$elementWrapper.attr('data-rex-element-number', elementsInPage[i].number);
				flagElementFound = true;
				break;
			}
		}

		if (!flagElementFound) {
			elementsInPage.push({
				id: elementID,
				number: 1
			});
		}

		// Setting the block height
		// var $gridGallery = $elementWrapper.parents('.grid-stack-row').eq(0);
		// var galleryData = $gridGallery.data();
		// var galleryEditorInstance = galleryData.plugin_perfectGridGalleryEditor;
		// var $block = $elementWrapper.parents('.grid-stack-item');

		// Removing medium editor placeholder if there
		var $textWrap = $elementWrapper.parents('.text-wrap');
		if ($textWrap.length != 0) {
			TextEditor.removePlaceholder($textWrap.eq(0));
		}

    if ( addingWpcf7 ) {
      var firstTimeAdding = 0 === $elementWrapper.find('.wpcf7-rows').length;

      if ( firstTimeAdding ) {
  			var $form = $elementWrapper.find('.wpcf7-form');
  			var formID = elementID;
  			var $formChilds = $form.children().not('.wpcf7-response-output').not($form.children().first());

  			$formChilds.wrapAll('<div class="wpcf7-rows ui-sortable"></div>');
  			var $rows = $form.find('.wpcf7-rows');

  			// Removing unwanted elements
  			$form.find('[type=url]').parents('.wpcf7-form-control-wrap').remove();
  			$form.find('[type=tel]').parents('.wpcf7-form-control-wrap').remove();
  			$form.find('[type=date]').parents('.wpcf7-form-control-wrap').remove();
  			$form.find('[type=range]').parents('.wpcf7-form-control-wrap').remove();
  			$form.find('.wpcf7-checkbox').parents('.wpcf7-form-control-wrap').remove();
  			$form.find('.wpcf7-quiz-label').parents('.wpcf7-form-control-wrap').remove();

  			var regexToFind = /\[(url|tel|date|checkbox|quiz|range)\*?[^\]]+\]/g;
  
  			formFieldsString = formFieldsString.replace(regexToFind, '');

  			var $childrenWithInputs = $rows.children().filter(function(index, element) {
          // Getting only the children containing the form fields
  				var $field = $(element);
  				return $field.find('.wpcf7-form-control-wrap').length != 0 || 
            $field.find('.wpcf7-form-control').length != 0 ||
            $field.is('.wpcf7-form-control-wrap') ||
            $field.is('.wpcf7-form-control')
  			})

  			var $formFields = $();

  			$childrenWithInputs.each(function(index, element) {
  				var $element = $(element);

  				if ( 0 !== $element.find('.wpcf7-form-control-wrap').length ) {
  					$element = $element.find('.wpcf7-form-control-wrap');
  					if ( 0 != $element.parent('label').length ) {
  						$element = $element.parent('label');  // Searching only on the first parent because there may be a label containing more inputs, and this should not happen
  					}
  				} else {
  					if ( 0 !== $element.find('.wpcf7-form-control').length ) {
  						$element = $element.find('.wpcf7-form-control');
  					}
  				}

  				$formFields = $formFields.add($element);
  			});

  			$rows.empty();

  			var fieldsNumbers = [];
  			var fieldsShortcodes = [];
  			var $rowsInDB = $(document.createElement('div')).addClass('wpcf7-rows ui-sortable');

  			$formFields.each(function (i, el) {
  				var $el = $(el);

  				var $newRowInDB = $(document.createElement("div"))
  					.addClass("wpcf7-row wpcf7-row__1-column")
  					.attr("wpcf7-row-number", (i + 1));
  				var $newColumnInDB = $(document.createElement("div"))
  					.addClass("wpcf7-column")
  					.attr("wpcf7-column-number", "1");
  				var $newColumnContentInDB = $(document.createElement("span"))
  					.addClass("wpcf7-column-content")
  					.append(el);
  				$newColumnInDB.append($newColumnContentInDB);
  				$newRowInDB.append($newColumnInDB);
  				$rowsInDB.append($newRowInDB);

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
  				$newColumnContentInDB.append($el[0].outerHTML)

  				if ( $el.is('label') ) {
  					if ( undefined === $el.find('.wpcf7-form-control-wrap') ) {
  						$el = $el.find('.wpcf7-form-control');
  					} else {
  						$el = $el.find('.wpcf7-form-control-wrap');
  					}
  				}

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

  				fieldsShortcodes[i] = /\[[\w]+[^\]]+\]/.exec(formFieldsString)[0];

  				if (containsText) { // Fixing all the fields
  					var newClass = "text-" + fieldsNumbers[i];

  					// DOM
  					var $input = $el.find('.wpcf7-text');
  					$input.addClass(newClass);
  					$el.addClass(newClass);     // Serve?
  					$input.attr('size', '');

  					// Shortcode
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[text\*? [^(\s|\])]+/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

  					$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
  				} else if (containsEmail) {
  					var newClass = "email-" + fieldsNumbers[i];

  					// DOM
  					var $input = $el.find('.wpcf7-email');
  					$input.addClass(newClass);
  					$el.addClass(newClass);     // Serve?
  					$input.attr('size', '');

  					// Shortcode
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[email\*? [^(\s|\])]+/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

  					$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
  				} else if (containsNumber) {
  					var newClass = "number-" + fieldsNumbers[i];

  					// DOM
  					var $input = $el.find('.wpcf7-number');
  					$input.addClass(newClass);
  					$el.addClass(newClass);     // Serve?
  					$input.attr('size', '');

  					// Shortcode
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[number\*? [^(\s|\])]+/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

  					$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
  				} else if (containsTextarea) {
  					var newClass = "textarea-" + fieldsNumbers[i];

  					// DOM
  					var $input = $el.find('.wpcf7-textarea');
  					$input.addClass(newClass);
  					$el.addClass(newClass);
  					$input.attr('size', '');

  					// Shortcode
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[textarea\*? [^(\s|\])]+/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

  					$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
  				} else if (containsSelect) {
  					var newClass = "menu-" + fieldsNumbers[i];

  					// DOM
  					var $input = $el.find('.wpcf7-select');
  					$input.addClass(newClass);
  					$el.addClass(newClass);
  					$input.prepend('<option value="" disabled="disabled" selected="selected">Select something</option>');
  					$input.attr('size', '');

  					// Shortcode
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[select\*? [^(\s|\])]+/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

  					$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
  				} else if (containsRadioButtons) {
  					var newClass = "radio-" + fieldsNumbers[i];
  					var fieldName = $el.find('[type=radio]').attr('name');
  					
  					// DOM
  					$el.addClass(newClass);
  					$el.removeClass(fieldName);

  					// Shortcode
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[radio\*? [^(\s|\])]+/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

  					$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
  				} else if (containsCheckbox) {
  					var newClass = "acceptance-" + fieldsNumbers[i];
  					var fieldName = $el.find('[type=checkbox]').attr('name');

  					// DOM
  					$el.addClass(newClass);
  					$el.removeClass(fieldName);

  					// Shortcode
            // @tofix: If [acceptance] tag doesn't have a closing [/acceptance] tag,
            // this regexp will eat the next shortcode  
  					fieldsShortcodes[i] = /\[acceptance\*?[^(\])]+\][^(\])]+\]/.exec(formFieldsString)[0];
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[acceptance\*? [^(\s|\])]+/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

  					$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
  				} else if (containsFile) {
  					var newClass = "file-" + fieldsNumbers[i];
  					var fieldName = $el.find('[type=file]').attr('name');

  					// DOM
  					$el.append('<div class="wpcf7-file-caption">Your text here</div>');
  					$el.addClass(newClass);
  					$el.removeClass(fieldName);

  					// Shortcode
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[file\*? [^(\s|\])]+/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(']', ']' + '<div class="wpcf7-file-caption">Your text here</div>');

  					$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
  				} else if (containsSubmit) {
  					var newClass = "submit-" + randomNumber;

  					// DOM
  					$el.addClass(newClass);

  					// Shortcode
  					formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
  					var regexpToSearch = /\[submit/;
  					fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

  					$newColumnContentInDB.find('.wpcf7-form-control').replaceWith(fieldsShortcodes[i]);
  				}

  				if (!/\]/.test(fieldsShortcodes[i])) {
  					fieldsShortcodes[i] += ']';
  				}
        });

        // Necessary for creating column content data
  			Rexbuilder_Rexwpcf7_Editor.addFormInPage(formID, $rowsInDB);

        $rowsInDB.find('.wpcf7-column').each(function(index) {
          Rexbuilder_Rexwpcf7_Editor.createColumnContentSpanData({
            editPoint: {
              element_id: formID,
              row_number: (index + 1),
              column_number: 1,
            }
          });
        });

        var $elementWrapper = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]').eq(0);
        Rexbuilder_Rexelement.addElementStyle($elementWrapper);
        Rexbuilder_Rexwpcf7.fixInputs();
      } else {
        Rexbuilder_Rexwpcf7_Editor.updateDBFormsInPage(elementID, !flagElementFound);
      }
    }

    Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
	}

  function _endFixingSeparatedElement($elementWrapper, formFieldsString) {
    var elementID = $elementWrapper.attr("data-rex-element-id");
    var flagElementFound = false;

    // Adding element style and updating elements in page if the new element 
    // is the first of the elements with that ID
    $elementWrapper.attr("data-rex-element-number", 1);
    for (var i = 0; i < elementsInPage.length; i++) {
        if (elementsInPage[i].id == elementID) {
            elementsInPage[i].number += 1;
            $elementWrapper.attr('data-rex-element-number', elementsInPage[i].number);
            flagElementFound = true;
            break;
        }
    }

    if (!flagElementFound) {
        elementsInPage.push({
            id: elementID,
            number: 1
        });
    }

    // Setting the block height
    // var $gridGallery = $elementWrapper.parents(".grid-stack-row").eq(0);
    // var galleryData = $gridGallery.data();
    // var galleryEditorInstance = galleryData.plugin_perfectGridGalleryEditor;
    // var $block = $elementWrapper.parents(".grid-stack-item");
    // galleryEditorInstance.updateElementHeight($block);

    // Removing medium editor placeholder if there
    var $textWrap = $elementWrapper.parents(".text-wrap");
    if ($textWrap.length != 0) {
      TextEditor.removePlaceholder($textWrap.eq(0));
    }

    if ($elementWrapper.find(".wpcf7").length != 0 && $elementWrapper.find(".wpcf7-rows").length == 0) {
        var $form = $elementWrapper.find(".wpcf7-form");
        var formID = elementID;
        var $formChilds = $form.children().not('.wpcf7-response-output').not($form.children().first());
        $formChilds.wrapAll('<div class="wpcf7-rows ui-sortable"></div>');
        var $rows = $form.find('.wpcf7-rows');

        // Removing unwanted elements
        // CONTROLLARE CHE RIMUOVANO TUTTO, nel DOM
        $form.find('[type=url]').parents('.wpcf7-form-control-wrap').remove();
        $form.find('[type=tel]').parents('.wpcf7-form-control-wrap').remove();
        $form.find('[type=date]').parents('.wpcf7-form-control-wrap').remove();
        $form.find('[type=range]').parents('.wpcf7-form-control-wrap').remove();
        $form.find('.wpcf7-checkbox').parents('.wpcf7-form-control-wrap').remove();
        $form.find('.wpcf7-quiz-label').parents('.wpcf7-form-control-wrap').remove();

        var regexToFind = /\[(url|tel|date|checkbox|quiz|range)\*?[^\]]+\]/g;
        var result;
        while ((result = regexToFind.exec(formFieldsString)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (result.index === regexToFind.lastIndex) {
                regexToFind.lastIndex++;
            } 
            formFieldsString = formFieldsString.replace(result[0], '');
        }

        var $childrenWithInputs = $rows.children().filter(function() {      // Getting only the children containing the form fields
            var $field = $(this);
            return $field.find('.wpcf7-form-control-wrap').length != 0 || $field.find('.wpcf7-form-control').length != 0 ||  $field.is('.wpcf7-form-control-wrap') || $field.is('.wpcf7-form-control')
        });

        var $formFields = $();
        $childrenWithInputs.each(function(i, el) {
            var $el = $(el);

            if (0 != $el.find('.wpcf7-form-control-wrap').length) {
                $el = $el.find('.wpcf7-form-control-wrap');
                if (0 != $el.parent('label').length) {
                    $el = $el.parent('label');  // Searching only on the first parent because there may be a label containing more inputs, and this should not happen
                }
            } else {
                if (0 != $el.find('.wpcf7-form-control').length) {
                    $el = $el.find('.wpcf7-form-control');
                } else {}
            }

            $formFields = $formFields.add($el);
        });

        $rows.empty();

        var fieldsNumbers = [];
        var fieldsShortcodes = [];
        var $rowsInDB = $(document.createElement("div")).addClass("wpcf7-rows ui-sortable");
        $formFields.each(function (i, el) {
            var $el = $(el);

            var $newRowInDB = $(document.createElement("div"))
                .addClass("wpcf7-row wpcf7-row__1-column")
                .attr("wpcf7-row-number", (i + 1));
            var $newColumnInDB = $(document.createElement("div"))
                .addClass("wpcf7-column")
                .attr("wpcf7-column-number", "1");
            var $newColumnContentInDB = $(document.createElement("span"))
                .addClass("wpcf7-column-content")
                .append(el);
            $newColumnInDB.append($newColumnContentInDB);
            $newRowInDB.append($newColumnInDB);
            $rowsInDB.append($newRowInDB);

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
            $newColumnContentInDB.append($el[0].outerHTML)

            if ($el.is('label')) {
                if (undefined === $el.find('.wpcf7-form-control-wrap')) {
                    $el = $el.find('.wpcf7-form-control');
                } else {
                    $el = $el.find('.wpcf7-form-control-wrap');
                }
            }

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
            
            fieldsShortcodes[i] = /\[[\w]+[^\]]+\]/.exec(formFieldsString)[0];

            if (containsText) { // Fixing all the fields
                var newClass = "text-" + fieldsNumbers[i];

                // DOM
                var $input = $el.find('.wpcf7-text');
                $input.addClass(newClass);
                $el.addClass(newClass);     // Serve?
                $input.attr('size', '');

                // Shortcode
                formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
                var regexpToSearch = /\[text\*? [^(\s|\])]+/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

                $newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
            } else if (containsEmail) {
                var newClass = "email-" + fieldsNumbers[i];

                // DOM
                var $input = $el.find('.wpcf7-email');
                $input.addClass(newClass);
                $el.addClass(newClass);     // Serve?
                $input.attr('size', '');

                // Shortcode
                formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
                var regexpToSearch = /\[email\*? [^(\s|\])]+/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

                $newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
            } else if (containsNumber) {
                var newClass = "number-" + fieldsNumbers[i];

                // DOM
                var $input = $el.find('.wpcf7-number');
                $input.addClass(newClass);
                $el.addClass(newClass);     // Serve?
                $input.attr('size', '');

                // Shortcode
                formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
                var regexpToSearch = /\[number\*? [^(\s|\])]+/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

                $newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
            } else if (containsTextarea) {
                var newClass = "textarea-" + fieldsNumbers[i];

                // DOM
                var $input = $el.find('.wpcf7-textarea');
                $input.addClass(newClass);
                $el.addClass(newClass);
                $input.attr('size', '');

                // Shortcode
                formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
                var regexpToSearch = /\[textarea\*? [^(\s|\])]+/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

                $newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
            } else if (containsSelect) {
                var newClass = "menu-" + fieldsNumbers[i];

                // DOM
                var $input = $el.find('.wpcf7-select');
                $input.addClass(newClass);
                $el.addClass(newClass);
                $input.prepend('<option value="" disabled="disabled" selected="selected">Select something</option>');
                $input.attr('size', '');

                // Shortcode
                formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
                var regexpToSearch = /\[select\*? [^(\s|\])]+/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

                $newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
            } else if (containsRadioButtons) {
                var newClass = "radio-" + fieldsNumbers[i];

                // DOM
                $el.addClass(newClass);

                // Shortcode
                formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
                var regexpToSearch = /\[radio\*? [^(\s|\])]+/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

                $newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
            } else if (containsCheckbox) {
                var newClass = "acceptance-" + fieldsNumbers[i];

                // DOM
                $el.addClass(newClass);

                // Shortcode
                fieldsShortcodes[i] = /\[acceptance\*?[^(\])]+\][^(\])]+\]/.exec(formFieldsString)[0];
                formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
                var regexpToSearch = /\[acceptance\*? [^(\s|\])]+/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

                $newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
            } else if (containsFile) {
                var newClass = "file-" + fieldsNumbers[i];

                // DOM
                $el.append('<div class="wpcf7-file-caption">Your text here</div>');
                $el.addClass(newClass);

                // Shortcode
                formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');
                var regexpToSearch = /\[file\*? [^(\s|\])]+/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(']', ']' + '<div class="wpcf7-file-caption">Your text here</div>');

                $newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
            } else if (containsSubmit) {
                var newClass = "submit-" + randomNumber;

                // DOM
                $el.addClass(newClass);

                // Shortcode
                var regexpToSearch = /\[submit/;
                fieldsShortcodes[i] = fieldsShortcodes[i].replace(regexpToSearch, regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass);

                $newColumnContentInDB.find('.wpcf7-form-control').replaceWith(fieldsShortcodes[i]);
            }

            if (!/\]/.test(fieldsShortcodes[i])) {
                fieldsShortcodes[i] += ']';
            }
        });

        Rexbuilder_Rexwpcf7_Editor.addFormInPage(formID, $rowsInDB);   // Necessary for creating column content data

        $rowsInDB.find('.wpcf7-column').each(function(i, el) {
          Rexbuilder_Rexwpcf7_Editor.createColumnContentSpanData({
            editPoint: {
              element_id: formID,
              row_number: (i + 1),
              column_number: 1,
            }
          });
        });

        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").eq(0);
        _addElementStyle($elementWrapper);
        Rexbuilder_Rexwpcf7.fixInputs();
    } else {
        Rexbuilder_Rexwpcf7_Editor.updateDBFormsInPage(elementID, true);
    }

    Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
  }

	function _updateElementListInPage() {
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

  function _scanOptionsDifferent(elementID, optionsDifferent) {
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

  /* ===== PRIVATE METHODS END ===== */

	function init() {
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
          width: '200px',
          height: '100%',
          font_size: '15px',
          border_width: '1px',
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
        element_id: '',
        element_number: '',
      }
    };

		_updateElementListInPage();
	}

	return {
		init: init,

    fixImportedElement: fixImportedElement,
    handleCompleteImportElement: handleCompleteImportElement,

    lockSynchronize: lockSynchronize,

    /* --- Element Separation --- */
    separateRexElement: separateRexElement,
    refreshSeparatedRexElement: refreshSeparatedRexElement
	}
})(jQuery);