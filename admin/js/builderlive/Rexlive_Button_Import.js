var Button_Import_Modal = (function ($) {
	'use strict';
	var rexbutton_import_props;
	var styleSheet;

	/////////////////////////////////////////////////////////////////////////////////////////
	// CSS FUNCTIONS
	/////////////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////////////
	// Adding rules
	var _addButtonContainerRule = function (buttonID, property) {
		if ('insertRule' in styleSheet) {
			styleSheet.insertRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-container{' + property + '}',
				styleSheet.cssRules.length
			);
		} else if ('addRule' in styleSheet) {
			styleSheet.addRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-container{' + property + '}',
				styleSheet.cssRules.length
			);
		}
	};

	var _addButtonBackgroundRule = function (buttonID, property) {
		if ('insertRule' in styleSheet) {
			styleSheet.insertRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-background{' + property + '}',
				styleSheet.cssRules.length
			);
		} else if ('addRule' in styleSheet) {
			styleSheet.addRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-background{' + property + '}',
				styleSheet.cssRules.length
			);
		}
	};

	var _addButtonTextRule = function (buttonID, property) {
		if ('insertRule' in styleSheet) {
			styleSheet.insertRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-text{' + property + '}',
				styleSheet.cssRules.length
			);
		} else if ('addRule' in styleSheet) {
			styleSheet.addRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-text{' + property + '}',
				styleSheet.cssRules.length
			);
		}
	};

	var _addButtonBackgroundHoverRule = function (buttonID, property) {
		if ('insertRule' in styleSheet) {
			styleSheet.insertRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-background:hover{' + property + '}',
				styleSheet.cssRules.length
			);
		} else if ('addRule' in styleSheet) {
			styleSheet.addRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-background:hover{' + property + '}',
				styleSheet.cssRules.length
			);
		}
	};

	var _addButtonContainerHoverRule = function (buttonID, property) {
		if ('insertRule' in styleSheet) {
			styleSheet.insertRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-container:hover{' + property + '}',
				styleSheet.cssRules.length
			);
		} else if ('addRule' in styleSheet) {
			styleSheet.addRule(
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-container:hover{' + property + '}',
				styleSheet.cssRules.length
			);
		}
	};

	/////////////////////////////////////////////////////////////////////////////////////////
	// Removing rules

	var _removeButtonContainerRule = function (buttonID) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				styleSheet.cssRules[i].selectorText ==
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-container'
			) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	};

	var _removeButtonBackgroundRule = function (buttonID) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				styleSheet.cssRules[i].selectorText ==
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-background'
			) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	};

	var _removeButtonTextRule = function (buttonID, property) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				styleSheet.cssRules[i].selectorText ==
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-text'
			) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	};

	var _removeButtonBackgroundHoverRule = function (buttonID) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				styleSheet.cssRules[i].selectorText ==
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-background:hover'
			) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	};

	var _removeButtonContainerHoverRule = function (buttonID, property) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				styleSheet.cssRules[i].selectorText ==
				'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"] .rex-button-container:hover'
			) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	};

	/////////////////////////////////////////////////////////////////////////////////////////
	var _fixCustomStyleElement = function () {
		if (Button_Import_Modal.$buttonsStyle.length == 0) {
			var css = '',
				head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');

			style.type = 'text/css';
			style.id = 'rexliveStyle-inline-css';
			style.dataset.rexName = 'buttons-style';
			if (style.styleSheet) {
				// This is required for IE8 and below.
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			head.appendChild(style);
		}
		for (var i = 0; i < document.styleSheets.length; i++) {
			if (document.styleSheets[i].ownerNode.id == 'rexliveStyle-inline-css') {
				styleSheet = document.styleSheets[i];
			}
		}
	};

	var _addCSSRules = function (buttonID, buttonProperties) {
		var defaultButtonValues = {
			margins: {
				top: '20px',
				right: '20px',
				bottom: '20px',
				left: '20px'
			},
			paddings: {
				top: '20px',
				right: '20px',
				bottom: '20px',
				left: '20px'
			},
			dimensions: {
				height: '70px',
				width: '100px'
			},
			border: {
				width: '5px',
				radius: '10px'
			},
			font_size: '12px'
		};

		var currentMargin = '';
		var currentPadding = '';
		var currentDimension = '';
		var currentBorderDimension = '';
		var currentTextSize = '';

		var containerRule = '';
		containerRule += 'color: ' + buttonProperties.text_color + ';';

		// checking font size, if value is not valid default font size will be applied
		currentTextSize = isNaN(parseInt(buttonProperties.font_size.replace('px', '')))
			? defaultButtonValues.font_size
			: buttonProperties.font_size;
		containerRule += 'font-size: ' + currentTextSize + ';';

		// checking button dimensions, if value is not valid default dimensions will be applied
		currentDimension = isNaN(parseInt(buttonProperties.button_height.replace('px', '')))
			? defaultButtonValues.dimensions.height
			: buttonProperties.button_height;
		containerRule += 'min-height: ' + currentDimension + ';';
		currentDimension = isNaN(parseInt(buttonProperties.button_width.replace('px', '')))
			? defaultButtonValues.dimensions.width
			: buttonProperties.button_width;
		containerRule += 'min-width: ' + currentDimension + ';';

		// checking margins, if they are not valid default value will be applied
		currentMargin = isNaN(parseInt(buttonProperties.margin_top.replace('px', '')))
			? defaultButtonValues.margins.top
			: buttonProperties.margin_top;
		containerRule += 'margin-top: ' + currentMargin + ';';
		currentMargin = isNaN(parseInt(buttonProperties.margin_right.replace('px', '')))
			? defaultButtonValues.margins.right
			: buttonProperties.margin_right;
		containerRule += 'margin-right: ' + currentMargin + ';';
		currentMargin = isNaN(parseInt(buttonProperties.margin_bottom.replace('px', '')))
			? defaultButtonValues.margins.bottom
			: buttonProperties.margin_bottom;
		containerRule += 'margin-bottom: ' + currentMargin + ';';
		currentMargin = isNaN(parseInt(buttonProperties.margin_left.replace('px', '')))
			? defaultButtonValues.margins.left
			: buttonProperties.margin_left;
		containerRule += 'margin-left: ' + currentMargin + ';';

		_addButtonContainerRule(buttonID, containerRule);

		var backgroundRule = '';
		backgroundRule += 'border-color: ' + buttonProperties.border_color + ';';
		backgroundRule += 'border-style: ' + 'solid' + ';';

		// checking border dimensions, if they are not valid default value will be applied
		currentBorderDimension = isNaN(parseInt(buttonProperties.border_width.replace('px', '')))
			? defaultButtonValues.border.width
			: buttonProperties.border_width;
		backgroundRule += 'border-width: ' + currentBorderDimension + ';';
		currentBorderDimension = isNaN(parseInt(buttonProperties.border_radius.replace('px', '')))
			? defaultButtonValues.border.radius
			: buttonProperties.border_radius;
		backgroundRule += 'border-radius: ' + currentBorderDimension + ';';

		backgroundRule += 'background-color: ' + buttonProperties.background_color + ';';
		_addButtonBackgroundRule(buttonID, backgroundRule);

		var textRule = '';

		// checking paddings, if they are not valid default value will be applied
		currentPadding = isNaN(parseInt(buttonProperties.padding_top.replace('px', '')))
			? defaultButtonValues.paddings.top
			: buttonProperties.padding_top;
		textRule += 'padding-top: ' + currentPadding + ';';
		currentPadding = isNaN(parseInt(buttonProperties.padding_right.replace('px', '')))
			? defaultButtonValues.paddings.right
			: buttonProperties.padding_right;
		textRule += 'padding-right: ' + currentPadding + ';';
		currentPadding = isNaN(parseInt(buttonProperties.padding_bottom.replace('px', '')))
			? defaultButtonValues.paddings.bottom
			: buttonProperties.padding_bottom;
		textRule += 'padding-bottom: ' + currentPadding + ';';
		currentPadding = isNaN(parseInt(buttonProperties.padding_left.replace('px', '')))
			? defaultButtonValues.paddings.left
			: buttonProperties.padding_left;
		textRule += 'padding-left: ' + currentPadding + ';';
		_addButtonTextRule(buttonID, textRule);

		var backgroundHoverRule = '';
		backgroundHoverRule += 'background-color: ' + buttonProperties.hover_color + ';';
		backgroundHoverRule += 'border-color: ' + buttonProperties.hover_border + ';';
		_addButtonBackgroundHoverRule(buttonID, backgroundHoverRule);

		var containerHoverRule = '';
		containerHoverRule += 'color: ' + buttonProperties.hover_text + ';';
		_addButtonContainerHoverRule(buttonID, containerHoverRule);
	};

	var _removeCSSRules = function (buttonID) {
		_removeButtonContainerRule(buttonID);
		_removeButtonBackgroundRule(buttonID);
		_removeButtonBackgroundHoverRule(buttonID);
		_removeButtonTextRule(buttonID);
		_removeButtonContainerHoverRule(buttonID);
	};

	var _getActiveStyleSheet = function () {
		return styleSheet;
	};

	/////////////////////////////////////////////////////////////////////////////////////////
	// Buttons Functions
	/////////////////////////////////////////////////////////////////////////////////////////
	var _updateButtonList = function (data) {
		var buttonData = data.buttonData;
		var buttonID = buttonData.buttonTarget.button_id;
		var buttonHTML = data.html;
		_removeCSSRules(buttonID);
		_addCSSRules(buttonID, buttonData);

		//if button was already there, remove it and readd
		var $buttonEL = rexbutton_import_props.$buttonList.find(
			'.rex-button-wrapper[data-rex-button-id="' + buttonID + '"]'
		);
		if ($buttonEL.length == 0) {
			var $liEL = $(document.createElement('li'));
			$liEL.attr('draggable', true);
			$liEL.addClass('button-list__element');
			var $div = $(document.createElement('div'));
			$div.append($(jQuery.parseHTML(buttonHTML)));
			$div.addClass('rex-container');
			$div.appendTo($liEL);
			$liEL.appendTo(rexbutton_import_props.$buttonList);
			// add delete button
			var deleteBtn = tmpl('tmpl-rex-button-delete')();
			$liEL.append(deleteBtn);
		} else {
			var $buttonParent = $buttonEL.parent();
			$buttonEL.remove();
			$buttonParent.append($(jQuery.parseHTML(buttonHTML)));
		}
	};

	/////////////////////////////////////////////////////////////////////////////////////////
	// Function for drag & drop
	/////////////////////////////////////////////////////////////////////////////////////////

	var dragDropHelper = null;

	function _linkDraggable() {
		var isIE = /*@cc_on!@*/ false || !!document.documentMode;
		var $currentElement, currentElementChangeFlag, elementRectangle, countdown, dragoverqueue_processtimer;

		var clientFrameWindow = Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow;
		var $frameContentWindow = $(clientFrameWindow);

		var buttonDimensions = {
			width: 0,
			height: 0
		};

		var mouseClientX = 0;
		var mouseClientY = 0;

		var previousMouseClientX = 0;
		var previousMouseClientY = 0;

		var scrollAmount = 15;

		function onDragStartButton(event) {
			var $button = $(this);

			Rexbuilder_Util_Admin_Editor.dragImportType = 'rexbutton';
			Rexbuilder_Util_Admin_Editor.hideLateralMenu();

			event.originalEvent.dataTransfer.effectAllowed = 'all';

			dragoverqueue_processtimer = setInterval(function () {
				dragDropHelper.processDragOverQueue();
			}, 100);

			var insertingHTML = $button.html();
			var $buttonBackground = $button.find('.rex-button-background').eq(0);

			buttonDimensions.width = $buttonBackground.outerWidth();
			buttonDimensions.height = $buttonBackground.outerHeight();

			var dataType = 'text/plain';

			if (isIE) {
				dataType = 'text';
			}

			event.originalEvent.dataTransfer.setData(dataType, insertingHTML);

			Rexbuilder_Util_Admin_Editor.addClassToLiveFrameRexContainer('rex-dragging-button');

			var dragDropStartData = {
				eventName: 'rexlive:drag_drop_started',
				data_to_send: {}
			};
			Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dragDropStartData);
		}

		function onDragButton() {
			Rexbuilder_Util_Admin_Editor.setStopScroll(true);

			// Scrolling up
			if (mouseClientY < 150) {
				Rexbuilder_Util_Admin_Editor.scrollFrame(scrollAmount * -1);
			}

			// Scrolling down
			if (mouseClientY > $frameContentWindow.height() - 150) {
				Rexbuilder_Util_Admin_Editor.scrollFrame(scrollAmount);
			}
		}

		function onDragEndButton() {
			clearInterval(dragoverqueue_processtimer);

			Rexbuilder_Util_Admin_Editor.setStopScroll(true);

			dragDropHelper.removeAllPlaceholders();
			dragDropHelper.clearContainerContextMarker();

			Rexbuilder_Util_Admin_Editor.removeClassToLiveFrameRexContainer('rex-dragging-button');
			Rexbuilder_Util_Admin_Editor.dragImportType = '';

			var dataDnDend = {
				eventName: 'rexlive:drag_drop_ended',
				data_to_send: {}
			};
			Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDend);
		}

		Rexlive_Base_Settings.$document.on('dragstart', '.button-list li', onDragStartButton);
		Rexlive_Base_Settings.$document.on('drag', '.button-list li', onDragButton);
		Rexlive_Base_Settings.$document.on('dragend', '.button-list li', onDragEndButton);

		Rexbuilder_Util_Admin_Editor.$frameBuilder.load(function () {
			var $rexContainer = $(Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow.document)
				.find('.rex-container')
				.eq(0);

			var mousePosition = {};
			var mousePositionToIFrame = {};

			function onDragOverWindow(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexbutton') return;
				event.preventDefault();
				event.stopPropagation();

				previousMouseClientX = mouseClientX;
				previousMouseClientY = mouseClientY;

				// Mouse position for scrolling
				mouseClientX = event.originalEvent.clientX;
				mouseClientY = event.originalEvent.clientY;

				dragDropHelper.checkIfCursorMoves(previousMouseClientX, previousMouseClientY, mouseClientX, mouseClientY);

				Rexbuilder_Util_Admin_Editor.checkLateralMenu(mouseClientX);
			}

			function onDragEnterRow(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexbutton') return;
				event.stopPropagation();

				$currentElement = $(event.target);
				currentElementChangeFlag = true;
				elementRectangle = event.target.getBoundingClientRect();
				countdown = 1;
			}

			function onDragOverRow(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexbutton') return;

				if (countdown % 15 != 0 && currentElementChangeFlag == false) {
					countdown = countdown + 1;
					return;
				}

				event = event || window.event;
				countdown = countdown + 1;
				currentElementChangeFlag = false;

				mousePosition.xCoord = event.originalEvent.clientX;
				mousePosition.yCoord = event.originalEvent.clientY;

				mousePositionToIFrame.x = event.originalEvent.pageX;
				mousePositionToIFrame.y = event.originalEvent.pageY;
				dragDropHelper.addEntryToDragOverQueue($currentElement, elementRectangle, mousePosition);
			}

			function onDropRow(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexbutton') return;

				event.preventDefault();
				event.stopPropagation();

				var e;
				if (event.isTrigger) {
					// ? What's this?
					e = triggerEvent.originalEvent;
				} else {
					e = event.originalEvent;
				}

				try {
					var textData = '';
					if (isIE) {
						textData = e.dataTransfer.getData('text');
					} else {
						textData = e.dataTransfer.getData('text/plain');
					}
					var $insertionPoint = Rexbuilder_Util_Admin_Editor.$frameBuilder.contents().find('.drop-marker');

					textData = textData.trim();

					var $divInsert = $(jQuery.parseHTML(textData));
					$divInsert.addClass('rex-loading-button');
					$divInsert.insertAfter($insertionPoint[0]);
					$insertionPoint.remove();

					var dataEndDrop = {
						eventName: 'rexlive:importButton',
						data_to_send: {
							buttonDimensions: buttonDimensions,
							mousePosition: mousePositionToIFrame
						}
					};
					Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataEndDrop);
				} catch (e) {
					console.error('Error when dropping the RexButton:', e);
				}
			}

			Button_Import_Modal.onDragOverWindow = onDragOverWindow;
			Button_Import_Modal.onDragEnterRow = onDragEnterRow;
			Button_Import_Modal.onDragOverRow = onDragOverRow;
			Button_Import_Modal.onDropRow = onDropRow;
			// $frameContentWindow.on('dragover', onDragOverWindow);
			// $rexContainer.on('dragenter', '.grid-stack-row', onDragEnterRow);
			// $rexContainer.on('dragover', '.grid-stack-row', onDragOverRow);
			// $rexContainer.on('drop', '.grid-stack-row', onDropRow);
		});
	}

	var _listenOtherEvents = function () {
		/**
		 * Handling button delete
		 * @param  {MouseEvent} click
		 * @return {null}
		 * @since  2.0.0
		 */
		Rexlive_Base_Settings.$document.on('click', '.button__element--delete', function (e) {
			var button = $(this).parents('.button-list__element').find('.rex-button-wrapper')[0];
			if (button) {
				Delete_Model_Modal.openModal({
					type: 'button',
					element: button
				});
			}
		});

		/**
		 * Disable the links on the button list
		 * @param  {MouseEvent} click on button
		 * @return {null}
		 * @since 2.0.0
		 */
		Rexlive_Base_Settings.$document.on('click', '.rex-button-container', function (e) {
			e.preventDefault();
		});
	};

	/**
	 * Delete a button model
	 * @param  {Element} button node element of the button list
	 * @return {void}
	 * @since  2.0.5
	 */
	function deleteButton(button) {
		button = 'undefined' !== typeof button ? button : null;
		if (!button) return;

		var button_id = button.getAttribute('data-rex-button-id');
		if ('' === button_id) return;

		// prepare data to ajax request
		var data = {
			action: 'rex_delete_rexbutton',
			nonce_param: live_editor_obj.rexnonce,
			button_id: button_id
		};
		var endcodedData = Rexlive_Base_Settings.encodeData(data);

		// prepare ajax request
		var request = new XMLHttpRequest();
		request.open('POST', live_editor_obj.ajaxurl, true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

		// handle request response
		request.onloadstart = function () {
			rexbutton_import_props.$self.addClass('rex-modal--loading');
		};
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				button.parentNode.parentNode.style.display = 'none';
				Button_Edit_Modal.removeIDButtonSoft(button_id);
			}
		};
		request.onerror = function () {};
		request.onloadend = function () {
			rexbutton_import_props.$self.removeClass('rex-modal--loading');
		};

		// send request
		request.send(endcodedData);
	}

	function init() {
		Rexbuilder_Util_Admin_Editor.frameBuilder.addEventListener('load', _handleIFrameLoad);

		var $self = $('#rex-buttons-list');
		rexbutton_import_props = {
			$self: $self,
			$buttonList: $self.find('.button-list')
		};

		this.$buttonsStyle = $('#rexliveStyle-inline-css');
		_fixCustomStyleElement();

		_linkDraggable();
		_listenOtherEvents();
	}

	function _handleIFrameLoad() {
		var context = Rexbuilder_Util_Admin_Editor.frameBuilder.contentDocument;
		dragDropHelper = new RexButtonDragDrop(context);
	}

	return {
		init: init,
		updateButtonList: _updateButtonList,
		getActiveStyleSheet: _getActiveStyleSheet,
		deleteButton: deleteButton
	};
})(jQuery);
