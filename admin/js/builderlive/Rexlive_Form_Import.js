var Form_Import_Modal = (function ($) {
	'use strict';
	var elementImportProps = {};
	var image_uploader_frame_direct; // Used for the media library opener
	var dragDropHelper;

	/**
	 * Updates the element list using an AJAX call.
	 * @return	{null}
	 * @since		2.0.x
	 * @version	2.0.5
	 */
	function updateList() {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_get_form_list',
				nonce_param: live_editor_obj.rexnonce
			},
			success: function (response) {
				if (!response.success) {
					$(elementImportProps.self).addClass('rex-elements-list--hidden');
					$(elementImportProps.pluginNotActiveMessage).removeClass('lateral-menu-message--hidden');
					return;
				}

				$(elementImportProps.self).removeClass('rex-elements-list--hidden');
				$(elementImportProps.pluginNotActiveMessage).addClass('lateral-menu-message--hidden');

				$(elementImportProps.noFormsMessage).addClass('lateral-menu-message--hidden');
				$(elementImportProps.loadingPlaceholder).addClass('loading-placeholder--hidden');

				refreshElements(response.data);

				var event = jQuery.Event('rexlive:lateralMenuReady');
				$(document).trigger(event);
			},
			complete: function () {
				elementImportProps.$self.removeClass('rex-modal--loading');
			}
		});
	}

	function refreshElements(data) {
		$(elementImportProps.noFormsMessage).addClass('lateral-menu-message--hidden');

		var updatedList = data.updated_list;
		var currentList = [];

		elementImportProps.$self.find('.element-list__element').each(function (i, element) {
			element.style.display = '';
			$(element).removeClass('element-list__element--separated');

			currentList.push({
				id: element.getAttribute('data-rex-element-id'),
				found: false
			});
		});

		for (var i = 0; i < updatedList.length; i++) {
			updatedList[i].found = false;
		}

		for (var i = 0; i < updatedList.length; i++) {
			for (var j = 0; j < currentList.length; j++) {
				if (updatedList[i].id == currentList[j].id) {
					updatedList[i].found = true;
					currentList[j].found = true;
					break;
				}
			}
		}

		tmpl.arg = 'element';
		for (var i = 0; i < updatedList.length; i++) {
			if (!updatedList[i].found) {
				elementImportProps.$self
					.find('.element-list')
					.prepend(
						tmpl('rexlive-tmpl-element-item-list', {
							id: updatedList[i].id,
							name: updatedList[i].name,
							preview: updatedList[i].preview_image_url || ''
						})
					)
					.find('.rex-element-wrapper')
					.prepend(updatedList[i].element_data_html[0]);
			}
		}

		for (var i = 0; i < currentList.length; i++) {
			if (!currentList[i].found) {
				elementImportProps.$self
					.find('.element-list__element[data-rex-element-id="' + currentList[i].id + '"]')
					.remove();
			}
		}

		if (data.separatedForms) {
			// Hiding separated forms
			if (data.separatedForms) {
				data.separatedForms.forEach(function (formID) {
					elementImportProps.$self
						.find('.element-list__element[data-rex-element-id="' + formID + '"]')
						.addClass('element-list__element--separated');
				});
			}
		}

		var elements = elementImportProps.$self.find('.element-list__element').get();

		elements = elements.filter(function (element) {
			// Checks the computed display property
			return 'none' !== $(element).css('display');
		});

		if (0 === elements.length) {
			$(elementImportProps.noFormsMessage).removeClass('lateral-menu-message--hidden');
		}
	}

	/**
	 * Saves the element thumbnail in the db using an AJAX call.
	 * @param element_selected
	 * @param selected_image_id Wordpress id of the new thumbnail image
	 * @param selected_image_size
	 * @return {null}
	 * @since  2.0.x
	 */
	var _saveElementThumbnail = function (element_selected, selected_image_id, selected_image_size) {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_save_element_thumbnail',
				nonce_param: live_editor_obj.rexnonce,
				element_target: element_selected,
				image_selected: selected_image_id,
				image_size: selected_image_size,
				set_post_thumbnail_result: null,
				set_post_thumbnail_url_result: null
			},
			success: function (response) {},
			error: function (response) {}
		});
	};

	/**
	 * Deletes the element thumbnail from the db using an AJAX call.
	 * @param element_to_delete
	 * @return {null}
	 * @since  x.x.x
	 */
	var _deleteElementThumbnail = function (element_to_delete) {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_delete_element_thumbnail',
				nonce_param: live_editor_obj.rexnonce,
				element_target: element_to_delete,
				delete_post_thumbnail_result: null,
				delete_post_thumbnail_url_result: null
			},
			success: function (response) {},
			error: function (response) {}
		});
	};

	/**
	 * Send a POST request to delete an element.
	 * @param		{Element}	element	The element to delete from the lateral menu
	 * @since 	2.0.x
	 * @version	2.0.5			- Switched from XHR to AJAX.
	 * 										- Added live separation calls. They need to happen
	 * 											before the deletion, 'cause the separation actually
	 * 											duplicates EXISTING posts and then changes their IDs.
	 */
	function deleteForm(element) {
		var formID = element.getAttribute('data-rex-element-id');
		var postID = parseInt(
			Rexbuilder_Util_Admin_Editor.frameBuilder.contentDocument.getElementById('id-post').getAttribute('data-post-id')
		);

		if (!postID || !formID) return;

		var calls = _prepareLiveSeparationCalls(formID);

		// When all the separation calls succeded, delete the form in the db and separate it in other pages
		$.when.apply($, calls).then(function () {
			// All calls have succeded
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: live_editor_obj.ajaxurl,
				data: {
					action: 'rex_delete_rexelement',
					nonce_param: live_editor_obj.rexnonce,
					element_id: formID,
					postID: postID
				},
				beforeSend: function () {
					elementImportProps.$self.addClass('rex-modal--loading');
				},
				success: function (response) {
					if (!response.success && !response.data.error) return;

					/* Deleting happened */

					element.style.display = 'none';
					_checkIfShowMessage();
				},
				error: function (response, textStatus, errorThrown) {
					alert('Something went wrong when trying to delete the Contact Form. Please try again.');

					console.error('[Rexpansive] Something went wrong with your deletion AJAX request.', {
						status: response.status,
						message: textStatus,
						errorThrown: errorThrown
					});
				},
				complete: function () {
					elementImportProps.$self.removeClass('rex-modal--loading');
				}
			});
		});
	}

	/**
	 * Edits the element thumbnail.
	 * @param element_id
	 * @param thumbnail_id
	 * @return media library
	 * @return {media uploader}
	 * @since  x.x.x
	 */
	var editElementThumbnail = function (element_id, thumbnail_id) {
		// sets default image size
		setUserSetting('imgsize', 'medium');

		// If the frame is already opened, return it
		if (image_uploader_frame_direct) {
			image_uploader_frame_direct
				.state('live-image-element')
				.set('selected_image', thumbnail_id)
				.set('selected_element', element_id);
			image_uploader_frame_direct.open();

			return;
		}

		//create a new Library, base on defaults
		//you can put your attributes in
		var insertImage = wp.media.controller.Library.extend({
			defaults: _.defaults(
				{
					id: 'live-image-element',
					title: 'Edit Element Thumbnail',
					allowLocalEdits: true,
					displaySettings: true,
					displayUserSettings: true,
					multiple: false,
					library: wp.media.query({ type: 'image' }),
					selected_image: thumbnail_id,
					selected_element: element_id,
					type: 'image' //audio, video, application/pdf, ... etc
				},
				wp.media.controller.Library.prototype.defaults
			)
		});

		//Setup media frame
		image_uploader_frame_direct = wp.media({
			button: { text: 'Select' },
			state: 'live-image-element',
			states: [new insertImage()]
		});

		// prevent attachment size strange selections
		/*image_uploader_frame_direct.on('selection:toggle', function(e) {
	    var attachmentSizeEl = document.querySelector( 'select[name="size"]' );
	    if ( attachmentSizeEl ) {
	      attachmentSizeEl.value = 'full';
	    }
	  });*/

		//reset selection in popup, when open the popup
		image_uploader_frame_direct.on('open', function () {
			var attachment;
			var selection = image_uploader_frame_direct.state('live-image-element').get('selection');

			//remove all the selection first
			selection.each(function (video) {
				attachment = wp.media.attachment(video.attributes.id);
				attachment.fetch();
				selection.remove(attachment ? [attachment] : []);
			});

			var image_id = image_uploader_frame_direct.state('live-image-element').get('selected_image');

			// Check the already inserted image
			if (image_id) {
				attachment = wp.media.attachment(image_id);
				attachment.fetch();

				selection.add(attachment ? [attachment] : [], { imgsize: '' });
			}
		});

		image_uploader_frame_direct.on('select', function () {
			var state = image_uploader_frame_direct.state('live-image-element');
			var sectionTarget = state.get('liveTarget');
			var eventName = state.get('eventName');
			var data_to_send = state.get('data_to_send');

			var selection = state.get('selection');
			var data = {
				eventName: eventName,
				data_to_send: {
					// info: info,
					// media: [],
					sectionTarget: sectionTarget,
					target: sectionTarget
				}
				// data_to_send: data_to_send
			};

			if (!selection) return;

			//to get right side attachment UI info, such as: size and alignments
			//org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
			var display;
			var obj_attachment;
			selection.each(function (attachment) {
				display = state.display(attachment).toJSON();
				obj_attachment = attachment.toJSON();

				// If captions are disabled, clear the caption.
				if (!wp.media.view.settings.captions) {
					delete obj_attachment.caption;
				}

				display = wp.media.string.props(display, obj_attachment);

				// data.data_to_send.media.push(to_send);
				data.data_to_send.idImage = obj_attachment.id;
				data.data_to_send.urlImage = display.src;
			});

			_updateElementThumbnail(display.src, display.size, obj_attachment.id);
		});

		image_uploader_frame_direct.on('close', function () {
			// Resets the option for the image size
			setUserSetting('imgsize', 'medium');
		});

		//now open the popup
		image_uploader_frame_direct.open();
	};

	/**
	 * Updates the element with the new thumbnail selected.
	 * @param display_src
	 * @param display_size
	 * @param obj_attachment_id
	 * @return {null}
	 * @since  x.x.x
	 */
	var _updateElementThumbnail = function (display_src, display_size, obj_attachment_id) {
		var element_selected = image_uploader_frame_direct.state('live-image-element').get('selected_element');
		var element = $('.element-list__element[data-rex-element-id="' + element_selected + '"]');

		element.attr('data-rex-element-thumbnail-id', obj_attachment_id);
		element.attr('data-rex-element-thumbnail-size', display_size);
		// sets the background of the element
		element
			.find('.element-list-preview')
			.addClass('element-list-preview--active')
			.css('background-image', 'url("' + display_src + '")');
		// sets the background of the edit element thumbnail button
		element
			.find('.element-list__element--edit-thumbnail')
			.addClass('tool-button--image-preview')
			.css('background-image', 'url("' + display_src + '")');

		// saves the changes
		_saveElementThumbnail(element_selected, obj_attachment_id, display_size);
	};

	/**
	 * Resets the element thumbnail.
	 * @param element_id
	 * @return media library
	 * @return {null}
	 * @since  x.x.x
	 */
	var resetElementThumbnail = function (element_id) {
		var element = $('.element-list__element[data-rex-element-id="' + element_id + '"]');

		element.attr('data-rex-element-thumbnail-id', '');
		element.attr('data-rex-element-thumbnail-size', '');
		// Removes The Background Of The Element
		element
			.find('.element-list-preview')
			.css('background-image', 'url("")')
			.removeClass('element-list-preview--active');
		// Removes The Background Of The Edit Element Thumbnail Button
		element
			.find('.tool-button--image-preview')
			.css('background-image', 'url("")')
			.removeClass('tool-button--image-preview');

		// Saves The Changes
		_deleteElementThumbnail(element_id);
	};

	/**
	 * Returns an array of AJAX calls that separate the forms
	 * with the passed ID in the current page.
	 * @param		{String}	formID
	 * @return	{Array}		Array of AJAX calls
	 * @since		2.0.5
	 */
	function _prepareLiveSeparationCalls(formID) {
		var elementWrappers = $(Rexbuilder_Util_Admin_Editor.frameBuilder.contentDocument)
			.find('.rex-container .rex-element-wrapper[data-rex-element-id="' + formID + '"]')
			.get();

		var calls = [];

		elementWrappers.forEach(function (wrapper) {
			calls.push(
				$.post(
					live_editor_obj.ajaxurl,
					{
						action: 'rex_separate_form',
						nonce_param: live_editor_obj.rexnonce,
						old_id: formID
					},
					function (response) {
						if (!response.success) return;

						var newID = response.data.new_id;

						// Data needed to the below function
						var partialElementData = {
							element_target: {
								element_id: formID,
								element_number: wrapper.dataset.rexElementNumber
							}
						};

						Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage({
							eventName: 'rexlive:separate_rex_element',
							data_to_send: {
								newID: newID,
								elementData: partialElementData
							}
						});

						Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage({
							eventName: 'rexlive:refresh_separated_rex_element',
							data_to_send: {
								elementID: newID,
								oldElementID: formID,
								elementData: partialElementData
							}
						});

						Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage({
							eventName: 'rexlive:lock_synchronize_on_element',
							data_to_send: partialElementData
						});
					},
					'json'
				)
			);
		});

		return calls;
	}

	function _loadDefaultForms() {
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_load_default_forms',
				nonce_param: live_editor_obj.rexnonce
			},
			beforeSend: function () {
				$(elementImportProps.loadingPlaceholder).removeClass('loading-placeholder--hidden');
			},
			success: function (response) {
				if (!response.success) {
					this.error(response, response.data[0].message, response.data[0].code);
					return;
				}

				refreshElements(response.data);
			},
			error: function (response, textStatus, errorThrown) {
				$(elementImportProps.noFormsMessage).removeClass('lateral-menu-message--hidden');

				Rexbuilder_Util_Admin_Editor.displayAjaxError(
					{ response: response, textStatus: textStatus, errorThrown: errorThrown },
					'Something went wrong when trying to import the Contact Forms. Please try again after refreshing the page.'
				);
			},
			complete: function () {
				$(elementImportProps.loadingPlaceholder).addClass('loading-placeholder--hidden');
			}
		});
	}

	function _checkIfShowMessage() {
		var elements = elementImportProps.$self.find('.element-list__element').get();

		elements = elements.filter(function (element) {
			return 'none' !== $(element).css('display');
		});

		if (0 === elements.length) {
			$(elementImportProps.loadingPlaceholder).addClass('loading-placeholder--hidden');
			$(elementImportProps.noFormsMessage).removeClass('lateral-menu-message--hidden');
		}
	}

	function _linkListeners() {
		elementImportProps.importFormsButton.addEventListener('click', function (clickEvent) {
			clickEvent.stopPropagation();

			// Show loading placeholder
			$(elementImportProps.noFormsMessage).addClass('lateral-menu-message--hidden');

			// Loading default forms from database
			_loadDefaultForms();
		});
	}

	// Functions for drag & drop
	function _linkDraggable() {
		var isIE = /*@cc_on!@*/ false || !!document.documentMode;
		var currentElement, currentElementChangeFlag, elementRectangle, countdown, dragoverqueue_processtimer;

		var clientFrameWindow = Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow;
		var $frameContentWindow = $(clientFrameWindow);

		var mouseClientX = 0;
		var mouseClientY = 0;

		var previousMouseClientX = 0;
		var previousMouseClientY = 0;

		var scrollAmount = 15;

		function onDragStartForm(event) {
			Rexbuilder_Util_Admin_Editor.dragImportType = 'rexelement';
			Rexbuilder_Util_Admin_Editor.hideLateralMenu();

			event.originalEvent.dataTransfer.effectAllowed = 'all';
			dragoverqueue_processtimer = setInterval(function () {
				dragDropHelper.processDragOverQueue();
			}, 100);

			var insertingHTML = $(this).html();

			if (isIE) {
				event.originalEvent.dataTransfer.setData('text', insertingHTML);
			} else {
				event.originalEvent.dataTransfer.setData('text/plain', insertingHTML);
			}

			Rexbuilder_Util_Admin_Editor.addClassToLiveFrameRexContainer('rex-dragging-element');

			var dataDnDstart = {
				eventName: 'rexlive:drag_drop_starded',
				data_to_send: {}
			};
			Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDstart);
		}

		function onDragForm() {
			Rexbuilder_Util_Admin_Editor.setStopScroll(true);
			Rexbuilder_Util_Admin_Editor.checkLateralMenu(mouseClientX);

			if (mouseClientY < 150) {
				// Rexbuilder_Util_Admin_Editor.setStopScroll(false);
				Rexbuilder_Util_Admin_Editor.scrollFrame(scrollAmount * -1);
			}

			if (mouseClientY > $frameContentWindow.height() - 150) {
				// Rexbuilder_Util_Admin_Editor.setStopScroll(false);
				Rexbuilder_Util_Admin_Editor.scrollFrame(scrollAmount);
			}
		}

		function onDragEndForm() {
			clearInterval(dragoverqueue_processtimer);

			Rexbuilder_Util_Admin_Editor.setStopScroll(true);

			dragDropHelper.removeAllPlaceholders();
			dragDropHelper.clearContainerContextMarker();

			Rexbuilder_Util_Admin_Editor.removeClassToLiveFrameRexContainer('rex-dragging-element');

			Rexbuilder_Util_Admin_Editor.dragImportType = '';
			var dataDnDend = {
				eventName: 'rexlive:drag_drop_ended',
				data_to_send: {}
			};
			Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDend);
		}

		function onIFrameLoad() {
			var mousePosition = {};
			var mousePositionToIFrame = {};

			function onDragOverWindow(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexelement') return;
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
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexelement') return;

				currentElement = $(event.target);
				currentElementChangeFlag = true;
				elementRectangle = event.target.getBoundingClientRect();
				countdown = 1;
			}

			function onDragOverRow(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexelement') return;
				// Updating mouseClinentX & mouseClientY variables to make possible
				// dragging even on sections
				mouseClientX = event.originalEvent.clientX;
				mouseClientY = event.originalEvent.clientY;

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

				dragDropHelper.addEntryToDragOverQueue(currentElement, elementRectangle, mousePosition);
			}

			function onDropRow(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexelement') return;
				event.preventDefault();
				event.stopPropagation();

				var e;
				if (event.isTrigger) {
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

					var $divInsert = $($.parseHTML(textData));
					$divInsert.addClass('rex-loading-element');
					$divInsert.insertAfter($insertionPoint[0]);
					$divInsert.hide();
					$insertionPoint.remove();

					var dataEndDrop = {
						eventName: 'rexlive:importElement',
						data: {
							mousePosition: mousePositionToIFrame
						}
					};
					Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataEndDrop);
				} catch (e) {
					console.error(e);
				}
			}

			Form_Import_Modal.onDragOverWindow = onDragOverWindow;
			Form_Import_Modal.onDragEnterRow = onDragEnterRow;
			Form_Import_Modal.onDragOverRow = onDragOverRow;
			Form_Import_Modal.onDropRow = onDropRow;
		}

		Rexlive_Base_Settings.$document.on('dragstart', '.element-list li', onDragStartForm);
		Rexlive_Base_Settings.$document.on('drag', '.element-list li', onDragForm);
		Rexlive_Base_Settings.$document.on('dragend', '.element-list li', onDragEndForm);
		Rexbuilder_Util_Admin_Editor.$frameBuilder.load(onIFrameLoad);
	}

	function init() {
		Rexbuilder_Util_Admin_Editor.frameBuilder.addEventListener('load', _handleIFrameLoad);
		var self = document.getElementById('rex-elements-list');

		elementImportProps = {
			self: self,
			$self: $(self),
			pluginNotActiveMessage: document.getElementById('cf7-not-active-message'),
			noFormsMessage: document.getElementById('no-forms-message'),
			loadingPlaceholder: self.querySelector('.loading-placeholder'),
			importFormsButton: document.getElementById('import-forms')
		};

		_linkListeners();
		_linkDraggable();
	}

	function _handleIFrameLoad() {
		var context = Rexbuilder_Util_Admin_Editor.frameBuilder.contentDocument;
		dragDropHelper = new RexWpcf7DragDrop(context);
	}

	return {
		init: init,

		// Functions that use Ajax calls
		updateList: updateList,

		//Element functions
		deleteForm: deleteForm,
		editElementThumbnail: editElementThumbnail,
		resetElementThumbnail: resetElementThumbnail
	};
})(jQuery);
