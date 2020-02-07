var Rexbuilder_Rexelement_Editor = (function($) {
	"use strict";

	var elementsInPage;

	var _endFixingImportedElement = function ($elementWrapper, formFieldsString) {
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
		var $gridGallery = $elementWrapper.parents(".grid-stack-row").eq(0);
		var galleryData = $gridGallery.data();
		var galleryEditorInstance = galleryData.plugin_perfectGridGalleryEditor;
		var $block = $elementWrapper.parents(".grid-stack-item");

		// Removing medium editor placeholder if there
		var $textWrap = $elementWrapper.parents(".text-wrap");
		// console.log($textWrap[0].outerHTML)
		if ($textWrap.length != 0) {
			TextEditor.removePlaceholder($textWrap.eq(0));
		}

		// Adding form rows if element is wpcf7 and first time we are adding it
		if ($elementWrapper.find(".wpcf7").length != 0 && $elementWrapper.find(".wpcf7-rows").length == 0) {
			var $form = $elementWrapper.find(".wpcf7-form");
			var formID = elementID;
			var $formChilds = $form.children().not('.wpcf7-response-output').not($form.children().first());
			$formChilds.wrapAll('<div class="wpcf7-rows ui-sortable"></div>');
			var $rows = $form.find('.wpcf7-rows');

			// Removing unwanted elements
			// Check that everything is removed from the DOM
			$form.find('[type=url]').parents('.wpcf7-form-control-wrap').remove();
			$form.find('[type=tel]').parents('.wpcf7-form-control-wrap').remove();
			$form.find('[type=date]').parents('.wpcf7-form-control-wrap').remove();
			$form.find('[type=range]').parents('.wpcf7-form-control-wrap').remove();
			$form.find('.wpcf7-checkbox').parents('.wpcf7-form-control-wrap').remove();
			$form.find('.wpcf7-quiz-label').parents('.wpcf7-form-control-wrap').remove();

			var regexToFind = /\[(url|tel|date|checkbox|quiz|range)\*?[^\]]+\]/g;
			
			formFieldsString = formFieldsString.replace(regexToFind, '');

			var $childrenWithInputs = $rows.children().filter(function() {      // Getting only the children containing the form fields
				var $field = $(this);
				return $field.find('.wpcf7-form-control-wrap').length != 0 || $field.find('.wpcf7-form-control').length != 0 ||  $field.is('.wpcf7-form-control-wrap') || $field.is('.wpcf7-form-control')
			});

			var $formFields = $();
			$childrenWithInputs.each(function(i, el) {
				var $el = $(el);

				if ( 0 !== $el.find('.wpcf7-form-control-wrap').length ) {
					$el = $el.find('.wpcf7-form-control-wrap');
					if ( 0 != $el.parent('label').length ) {
						$el = $el.parent('label');  // Searching only on the first parent because there may be a label containing more inputs, and this should not happen
					}
				} else {
					if ( 0 !== $el.find('.wpcf7-form-control').length ) {
						$el = $el.find('.wpcf7-form-control');
					}
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
			Rexbuilder_Rexwpcf7_Editor.fixInputs();
		} else {    // If it's not a new element
			Rexbuilder_Rexwpcf7_Editor.updateDBFormsInPage(elementID, !flagElementFound);
		}
		
		Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);

		/* Copied form Rexbuilder_Rexbutton */
		// locking grid to prevent errors on focus right text node
		// var $element = $textWrap.parents(".grid-stack-item");
		// var $section = $element.parents(".rexpansive_section");
		// Rexbuilder_Util.getGalleryInstance($section).focusElement($element);
	}

	var _addElementStyle = function ($elementWrapper) {
        // Adding form style if the element is a form
        if ( 0 !== $elementWrapper.find('.wpcf7-form').length ) {
            Rexbuilder_Rexwpcf7.refreshFormStyle($elementWrapper.find(".wpcf7-form"), true);
            $elementWrapper.find(".wpcf7-column").each(function(){
                Rexbuilder_Rexwpcf7.refreshColumnContentStyle($(this));
            })
        }
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

	// public methods
	function handleCompleteImportElement( e ) {
		var data = e.settings;
		var $newDOMElement = data.$elementAdded;
		var $elementWrapper = data.$elementWrapper;
		var formFieldsString = data.formFieldsString;
		$elementWrapper.detach().prependTo($newDOMElement.find(".text-wrap").eq(0));
		$elementWrapper.wrap("<span class=\"rex-elements-paragraph\"></span>");
		_endFixingImportedElement($elementWrapper, formFieldsString);
	}

	function init() {
		elementsInPage = [];

		_updateElementListInPage();
	}

	return {
		init: init,
		handleCompleteImportElement: handleCompleteImportElement
	}
})(jQuery);