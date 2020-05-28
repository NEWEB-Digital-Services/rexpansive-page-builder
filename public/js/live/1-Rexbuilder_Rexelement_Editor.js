var Rexbuilder_Rexelement_Editor = (function ($) {
	'use strict';

	/* ===== GLOBAL VARIABLES ===== */
	var elementsInPage = [];

	/**
	 * Fixes the dragged element in the DOM. Called right after
	 * the drag & drop event in Rexlive_Form_Import.js
	 * @param		{Object}	data	Contains mouse position of the drop.
	 * @since 	2.0.4
	 */
	function fixImportedElement(data) {
		var $elementWrapper = Rexbuilder_Util.$rexContainer.find('.rex-loading-element .rex-element-wrapper');
		var elementID = $elementWrapper.attr('data-rex-element-id');
		var $textWrap = $elementWrapper.parents('.text-wrap').eq(0);
		var $gridGallery = $elementWrapper.parents('.grid-stack-row').eq(0);
		var $section = $elementWrapper.parents('.rexpansive_section').eq(0);

		// Necessary to detect the element
		$elementWrapper.addClass('importing-element');
		// Removing element unnecessary data

		$elementWrapper.detach();

		$gridGallery.find('.element-list-preview').remove();

		var dropType;
		if ($textWrap.length == 0) {
			if ($gridGallery.length !== 0) {
				dropType = 'inside-row';
			}
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
			success: function (response) {
				// If success get the element HTML and append it to a new div
				if (response.success) {
					var shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);
					var formFieldsString = response.data.form_content.toString().trim();
					var $elementContainer = $('<div class="rex-element-container"></div>');

					$elementContainer.append(shortcodeTransformed);
					$elementWrapper.append($elementContainer);

					// Get the shortcode and keep it as an attribute
					var shortcode = response.data.shortcode;
					var spanShortcode = $('<span class="string-shortcode"></span>').get(0);

					spanShortcode.setAttribute('shortcode', shortcode);
					$elementWrapper.prepend(spanShortcode);

					var $elementData = $elementWrapper.find('.rex-element-data');
					var elementDataFromDB = $.parseHTML(response.data.element_data_html[0]);

					$elementData.attr('data-synchronize', false);

					if (null !== elementDataFromDB) {
						$elementData.remove();
						var $elementDataFromDB = $(elementDataFromDB);
						$elementWrapper.prepend($elementDataFromDB);
						$elementDataFromDB.attr('data-synchronize', false);
					}

					switch (dropType) {
						case 'inside-block':
							$elementWrapper.wrap('<span class="rex-elements-paragraph"></span>');
							$textWrap.prepend($elementWrapper);

							setupElement($elementWrapper, formFieldsString);

							Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
							break;

						case 'inside-row':
							var ev = jQuery.Event('rexlive:insert_new_text_block');

							ev.settings = {
								data_to_send: {
									$elementWrapper: $elementWrapper,
									$section: $section,
									addBlockElement: true,
									mousePosition: data.mousePosition,
									formFieldsString: formFieldsString,
									sectionTarget: {
										sectionID: $section.attr('data-rexlive-section-id'),
										modelNumber:
											undefined !== $section.attr('data-rexlive-model-number')
												? $section.attr('data-rexlive-model-number')
												: ''
									}
								}
							};

							Rexbuilder_Util.$document.trigger(ev);
							break;

						default:
							break;
					}
				}
			},
			error: function (response) {}
		});
	}

	function handleCompleteImportElement(e) {
		var data = e.settings;
		var $newDOMElement = data.$elementAdded;
		var $elementWrapper = data.$elementWrapper;
		var formFieldsString = data.formFieldsString;

		$elementWrapper.detach().prependTo($newDOMElement.find('.text-wrap').eq(0));
		$elementWrapper.wrap('<span class="rex-elements-paragraph"></span>');

		setupElement($elementWrapper, formFieldsString);
	}

	function separateRexElement(data) {
		var elementData = data.elementData;
		var newID = data.newID;
		var elementID = elementData.element_target.element_id;

		var $elementWrapper = Rexbuilder_Util.$rexContainer.find(
			'.rex-element-wrapper[data-rex-element-id="' +
				elementID +
				'"][data-rex-element-number="' +
				elementData.element_target.element_number +
				'"]'
		);

		$elementWrapper.addClass('rex-separate-form');
		$elementWrapper.attr('data-rex-element-id', newID);
		$elementWrapper.attr('data-rex-element-number', 1);

		elementsInPage.push({
			id: newID,
			number: 1
		});

		// If element was last of that model in page, remove it form elementsInPage array
		if (
			0 === Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper[data-rex-element-id="' + elementID + '"]').length
		) {
			for (var i = 0; i < elementsInPage.length; i++) {
				if (elementsInPage[i].id == elementID) break;
			}

			if (i != elementsInPage.length) {
				elementsInPage.splice(i, 1);
			}
		}

		Rexbuilder_Rexwpcf7_Editor.removeFormInPage(elementID);
	}

	/**
	 * Situation:
	 * The form with the passed ID has been deleted, and its "instances" in other
	 * site's posts have been separated.
	 *
	 * This function separates its "instances" in the current page, avoiding the
	 * need of a page refresh. To make this possible, the DB side of this page
	 * has not been edited while deleting the other forms.
	 * @param {Object} payload { formID }
	 * @since	2.0.5
	 */
	// function separateCurrentPageForms(payload) {
	// 	var formID = payload.formID;

	// 	var elementWrappers = Rexbuilder_Util.$rexContainer
	// 		.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]')
	// 		.get();

	// 	var calls = [];

	// 	elementWrappers.forEach(function (wrapper) {
	// 		calls.push(
	// 			$.post(
	// 				_plugin_frontend_settings.rexajax.ajaxurl,
	// 				{
	// 					action: 'rex_separate_element',
	// 					nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
	// 					old_id: formID
	// 				},
	// 				function (response) {
	// 					console.log(response);
	// 					if (!response.success) return;

	// 					var newID = response.data.new_id;

	// 					var partialElementData = {
	// 						element_target: {
	// 							element_id: formID,
	// 							element_number: wrapper.dataset.rexElementNumber
	// 						}
	// 					};

	// 					console.log({ newID, oldElementID: formID, elementData: partialElementData });

	// 					separateRexElement({ newID: newID, elementData: partialElementData });
	// 					refreshSeparatedRexElement({ elementID: newID, oldElementID: formID, elementData: partialElementData });
	// 				},
	// 				'json'
	// 			)
	// 		);
	// 	});

	// 	// Can't pass a literal array, so use apply.
	// 	$.when
	// 		.apply($, calls)
	// 		.then(function () {
	// 			// Do your success stuff
	// 		})
	// 		.fail(function () {
	// 			// Probably want to catch failure
	// 		})
	// 		.always(function () {
	// 			// Or use always if you want to do the same thing
	// 			// whether the call succeeds or fails
	// 		});
	// }

	/**
	 * Refreshes the element from the shortcode. This happens when we
	 * have a separate element
	 * @param  data
	 */
	function refreshSeparatedRexElement(data) {
		var elementID = data.elementID.toString();
		var oldElementID = data.oldElementID.toString();
		var elementData = data.elementData;

		var $elementWrapper = Rexbuilder_Util.$rexContainer.find(
			'.rex-element-wrapper[data-rex-element-id="' + elementID + '"]'
		);

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
			success: function (response) {
				console.log(response);
				if (!response.success) return;

				var formFieldsString = response.data.form_content.toString().trim();

				// Deleting the old element
				var $elementContainer = $elementWrapper.find('.rex-element-container');
				$elementContainer.empty();

				// Get the element HTML and append it to the right div
				var $shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);
				$elementContainer.append($shortcodeTransformed);

				lockSynchronize(elementData);
				setupElement($elementWrapper, formFieldsString);
			},
			error: function (response) {}
		});
	}

	function lockSynchronize(data) {
		var elementID = data.element_target.element_id;

		var $elementWrapper = Rexbuilder_Util.$rexContainer.find(
			'.rex-element-wrapper[data-rex-element-id="' +
				elementID +
				'"][data-rex-element-number="' +
				data.element_target.element_number +
				'"]'
		);

		$elementWrapper.find('.rex-element-data').attr('data-synchronize', true);
	}

	function setupElement($elementWrapper, formFieldsString) {
		var elementWrapper = $elementWrapper.get(0);
		var addingWpcf7 = 0 !== $elementWrapper.find('.wpcf7').length;
		var elementID = $elementWrapper.attr('data-rex-element-id');
		var flagElementFound = false;

		// Updating elements in page if the new element
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

		// If separating, get true
		// If not separating, check the flag
		var needToAddElementStyle = Rexbuilder_Util.hasClass(elementWrapper, 'rex-separate-form') || !flagElementFound;

		// Removing medium editor placeholder if there
		var $textWrap = $elementWrapper.parents('.text-wrap');

		if ($textWrap.length != 0) {
			TextEditor.removePlaceholder($textWrap.eq(0));
		}

		if (addingWpcf7) {
			var firstTimeAdding = 0 === $elementWrapper.find('.wpcf7-rows').length;
			var formID = elementID;

			if (firstTimeAdding) {
				var $form = $elementWrapper.find('.wpcf7-form');
				var $formChildren = $form.children().not('.wpcf7-response-output').not($form.children().first());

				$formChildren.wrapAll('<div class="wpcf7-rows ui-sortable"></div>');

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

				var $childrenWithInputs = $rows.children().filter(function (index, element) {
					// Getting only the children containing the form fields
					var $field = $(element);
					return (
						$field.find('.wpcf7-form-control-wrap').length != 0 ||
						$field.find('.wpcf7-form-control').length != 0 ||
						$field.is('.wpcf7-form-control-wrap') ||
						$field.is('.wpcf7-form-control')
					);
				});

				var $formFields = $();

				$childrenWithInputs.each(function (index, element) {
					var $element = $(element);

					if (0 !== $element.find('.wpcf7-form-control-wrap').length) {
						$element = $element.find('.wpcf7-form-control-wrap');

						if (0 !== $element.parent('label').length) {
							// Searching only on the first parent because there may be a label
							// containing more than 1 input, and this should not happen

							var labelParagraphTemplate = Rexbuilder_Public_Templates.getTemplate('label-text-paragraph');

							// Add custom class to the label
							var $label = $element.parent('label');

							// Using $label.contents() and filtering the result deletes the text from the jQuery object
							$label.contents().wrapAll(labelParagraphTemplate);
							$label.append($element);
							$element = $label.addClass('wpcf7-label-text');
						}
					} else {
						if (0 !== $element.find('.wpcf7-form-control').length) {
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
					var $newRowInDB = $(document.createElement('div'))
						.addClass('wpcf7-row wpcf7-row__1-column')
						.attr('wpcf7-row-number', i + 1);

					var $newColumnInDB = $(document.createElement('div'))
						.addClass('wpcf7-column')
						.attr('wpcf7-column-number', '1');

					var $newColumnContentInDB = $(document.createElement('span')).addClass('wpcf7-column-content').append(el);

					$newColumnInDB.append($newColumnContentInDB);
					$newRowInDB.append($newColumnInDB);
					$rowsInDB.append($newRowInDB);

					var $newRow = $(document.createElement('div'))
						.addClass('wpcf7-row wpcf7-row__1-column')
						.attr('wpcf7-row-number', i + 1);

					var $newColumn = $(document.createElement('div')).addClass('wpcf7-column').attr('wpcf7-column-number', '1');
					var $newColumnContent = $(document.createElement('span')).addClass('wpcf7-column-content').append(el);

					$newColumn.append($newColumnContent);
					$newRow.append($newColumn);
					$rows.append($newRow);
					$newColumnContentInDB.append($el[0].outerHTML);

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

					if (containsText) {
						// Fixing all the fields
						var newClass = 'text-' + fieldsNumbers[i];

						// DOM
						var $input = $el.find('.wpcf7-text');

						$input.addClass(newClass);
						$el.addClass(newClass); // Needed?
						$input.attr('size', '');

						// Shortcode
						formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');

						var regexpToSearch = /\[text\*? [^(\s|\])]+/;

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,
							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
					} else if (containsEmail) {
						var newClass = 'email-' + fieldsNumbers[i];

						// DOM
						var $input = $el.find('.wpcf7-email');

						$input.addClass(newClass);
						$el.addClass(newClass); // Needed?
						$input.attr('size', '');

						// Shortcode

						formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');

						var regexpToSearch = /\[email\*? [^(\s|\])]+/;

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,
							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
					} else if (containsNumber) {
						var newClass = 'number-' + fieldsNumbers[i];

						// DOM
						var $input = $el.find('.wpcf7-number');

						$input.addClass(newClass);
						$el.addClass(newClass); // Needed?
						$input.attr('size', '');

						// Shortcode
						formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');

						var regexpToSearch = /\[number\*? [^(\s|\])]+/;

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,
							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
					} else if (containsTextarea) {
						var newClass = 'textarea-' + fieldsNumbers[i];

						// DOM
						var $input = $el.find('.wpcf7-textarea');
						$input.addClass(newClass);
						$el.addClass(newClass);
						$input.attr('size', '');

						// Shortcode
						formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');

						var regexpToSearch = /\[textarea\*? [^(\s|\])]+/;

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,

							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
					} else if (containsSelect) {
						var newClass = 'menu-' + fieldsNumbers[i];

						// DOM
						var $input = $el.find('.wpcf7-select');
						$input.addClass(newClass);
						$el.addClass(newClass);
						$input.prepend('<option value="" disabled selected>Select something</option>');
						$input.attr('size', '');

						// Shortcode
						formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');

						var regexpToSearch = /\[select\*? [^(\s|\])]+/;

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,
							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
					} else if (containsRadioButtons) {
						var newClass = 'radio-' + fieldsNumbers[i];
						var fieldName = $el.find('[type=radio]').attr('name');

						// DOM
						$el.addClass(newClass);
						$el.removeClass(fieldName);

						// Shortcode
						formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');

						var regexpToSearch = /\[radio\*? [^(\s|\])]+/;

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,
							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
					} else if (containsCheckbox) {
						var newClass = 'acceptance-' + fieldsNumbers[i];
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

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,
							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
					} else if (containsFile) {
						var newClass = 'file-' + fieldsNumbers[i];
						var fieldName = $el.find('[type=file]').attr('name');

						// DOM
						$el.append('<div class="wpcf7-file-caption">Your text here</div>');
						$el.addClass(newClass);
						$el.removeClass(fieldName);

						// Shortcode
						formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');

						var regexpToSearch = /\[file\*? [^(\s|\])]+/;

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,
							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							']',
							']' + '<div class="wpcf7-file-caption">Your text here</div>'
						);
						$newColumnContentInDB.find('.wpcf7-form-control-wrap').replaceWith(fieldsShortcodes[i]);
					} else if (containsSubmit) {
						var newClass = 'submit-' + randomNumber;

						// DOM
						$el.addClass(newClass);

						// Shortcode
						formFieldsString = formFieldsString.replace(fieldsShortcodes[i], '');

						var regexpToSearch = /\[submit/;

						fieldsShortcodes[i] = fieldsShortcodes[i].replace(
							regexpToSearch,
							regexpToSearch.exec(fieldsShortcodes[i])[0] + ' class:' + newClass
						);

						$newColumnContentInDB.find('.wpcf7-form-control').replaceWith(fieldsShortcodes[i]);
					}

					if (!/\]/.test(fieldsShortcodes[i])) {
						fieldsShortcodes[i] += ']';
					}
				});

				// Necessary for creating column content data
				Rexbuilder_Rexwpcf7_Editor.addFormInPage(formID, $rowsInDB);

				$rowsInDB.find('.wpcf7-column').each(function (index) {
					Rexbuilder_Rexwpcf7_Editor.createColumnContentSpanData({
						editPoint: {
							element_id: formID,

							row_number: index + 1,

							column_number: 1
						}
					});
				});

				var $elementWrapper = Rexbuilder_Util.$rexContainer
					.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]')
					.eq(0);

				Rexbuilder_Rexelement.addElementStyle($elementWrapper);
				Rexbuilder_Rexwpcf7.fixInputs();
				Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);

				// non c'è in separate (importa poco)
				$elementWrapper.removeClass('importing-element');
			} else {
				Rexbuilder_Rexwpcf7_Editor.updateDBFormsInPage(elementID, needToAddElementStyle);
			}

			Rexbuilder_Rexwpcf7_Editor.wrapButtons();
			Rexbuilder_Rexwpcf7_Editor.setRowsSortable();
			Rexbuilder_Rexwpcf7_Editor.addMissingTools(formID);
			_addElementToolsToDOM();
			focusRexElement($textWrap);
		}

		Rexbuilder_Live_Utilities.launchTooltips();
	}

	function _updateElementListInPage() {
		var j;
		var flagElementFound = false;

		Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper').each(function (i, element) {
			var $elementWrapper = $(element);
			var elementID = $elementWrapper.attr('data-rex-element-id');
			var elementNumber = parseInt($elementWrapper.attr('data-rex-element-number'));

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

	function _addElementToolsToDOM() {
		var toolsTemplate = Rexbuilder_Live_Templates.getTemplate('rexelement-tools', { settingsType: 'form_settings' });
		var rexElements = Array.prototype.slice.call(
			Rexbuilder_Util.rexContainer.querySelectorAll('.wpcf7-form:not(.no-builder-form)')
		);

		for (var i = 0; i < rexElements.length; i++) {
			if (rexElements[i].querySelector('.rexelement-tools')) continue;

			rexElements[i].insertAdjacentHTML('afterbegin', toolsTemplate);
		}
	}

	function focusRexElement($textWrap) {
		var textWrap = $textWrap.get(0);
		var $gallery = $textWrap.parents('.grid-stack-row');
		var pgge = $gallery.data().plugin_perfectGridGalleryEditor;

		// By passing no parameters only the section will be focused
		pgge.focusElement();

		// By setting this, it is possible to unfocus the block when clicking out of it
		textWrap.setAttribute('data-medium-focused', true);

		// Triggering focus event on current text wrap
		TextEditor.triggerMEEvent({
			name: 'focus',
			data: {},
			editable: textWrap
		});
	}

	function init() {
		_addElementToolsToDOM();

		_updateElementListInPage();
	}

	return {
		init: init,
		focusRexElement: focusRexElement,
		fixImportedElement: fixImportedElement,
		setupElement: setupElement,
		handleCompleteImportElement: handleCompleteImportElement,
		lockSynchronize: lockSynchronize,

		/* --- Element Separation --- */
		separateRexElement: separateRexElement,
		// separateCurrentPageForms: separateCurrentPageForms,
		refreshSeparatedRexElement: refreshSeparatedRexElement
	};
})(jQuery);
