/**
 * https://www.html5rocks.com/en/tutorials/dnd/basics/
 * https://github.com/StackHive/DragDropInterface
 * http://mereskin.github.io/dnd/
 */

var Model_Import_Modal = (function ($) {
	'use strict';
	var rexmodel_import_props;
	var image_uploader_frame_direct; //used for the media library opener
	var dragDropHelper;

	/**
	 * Saves the model thumbnail in the db using an AJAX call.
	 * @param model_selected
	 * @param selected_image_id Wordpress id of the new thumbnail image
	 * @param selected_image_size
	 * @return {null}
	 * @since  2.0.0
	 */
	var _saveModelThumbnail = function (model_selected, selected_image_id, selected_image_size) {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_save_model_thumbnail',
				nonce_param: live_editor_obj.rexnonce,
				model_target: model_selected,
				image_selected: selected_image_id,
				image_size: selected_image_size,
				set_post_thumbnail_result: null,
				set_post_thumbnail_url_result: null
			},
			success: function (response) {
				if (response.success) {
				}
			},
			error: function (response) {}
		});
	};

	/**
	 * Deletes the model thumbnail from the db using an AJAX call.
	 * @param model_to_delete
	 * @return {null}
	 * @since  2.0.0
	 */
	var _deleteModelThumbnail = function (model_to_delete) {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_delete_model_thumbnail',
				nonce_param: live_editor_obj.rexnonce,
				model_target: model_to_delete,
				delete_post_thumbnail_result: null,
				delete_post_thumbnail_url_result: null
			},
			success: function (response) {
				if (response.success) {
				}
			},
			error: function (response) {}
		});
	};

	/**
	 * Editing a model name
	 * @param  {Object} modelData model to edit info
	 * @return {null}
	 * @since  2.0.0
	 */
	var _editModelName = function (modelData) {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_edit_model_name',
				nonce_param: live_editor_obj.rexnonce,
				modelData: modelData
			},
			success: function (response) {
				if (response.success) {
					if (response.data.update !== 0 && response.data.update === parseInt(response.data.modelData.id)) {
						rexmodel_import_props.self.querySelector(
							'[data-rex-model-id="' + response.data.modelData.id + '"] .model-name'
						).innerHTML = '<div>' + response.data.modelData.name + '</div>';
						_sortModelList();
					}
				}
			},
			error: function (response) {}
		});
	};

	var _updateModelList = function () {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_get_model_list',
				nonce_param: live_editor_obj.rexnonce
			},
			success: function (response) {
				if (response.success) {
					var currentList = [];
					var listChanged = false;
					rexmodel_import_props.$self.find('.model__element').each(function (i, model) {
						var modelID = $(model).attr('data-rex-model-id');
						var modelObj = {
							id: modelID,
							founded: false
						};
						currentList.push(modelObj);
					});

					var updatedList = response.data.updated_list;

					var i, j;

					for (i = 0; i < updatedList.length; i++) {
						updatedList[i].founded = false;
					}

					for (i = 0; i < updatedList.length; i++) {
						for (j = 0; j < currentList.length; j++) {
							if (updatedList[i].id == currentList[j].id) {
								updatedList[i].founded = true;
								currentList[j].founded = true;
								break;
							}
						}
					}

					tmpl.arg = 'model';

					for (i = 0; i < updatedList.length; i++) {
						if (!updatedList[i].founded) {
							listChanged = true;
							var modelPreview = tmpl('rexlive-tmpl-model-item-list', {
								id: updatedList[i].id,
								name: updatedList[i].name,
								preview: updatedList[i].preview_image_url != '' ? updatedList[i].preview_image_url : ''
							});
							rexmodel_import_props.$self.find('.model-list').prepend(modelPreview);
						}
					}

					// remove useless models
					for (i = 0; i < currentList.length; i++) {
						if (!currentList[i].founded) {
							listChanged = true;
							rexmodel_import_props.$self
								.find('.model__element[data-rex-model-id="' + currentList[i].id + '"]')
								.remove();
						}
					}

					// order models
					if (listChanged) {
						_sortModelList();
					}

					var event = jQuery.Event('rexlive:lateralMenuReady');
					$(document).trigger(event);
				}
			},
			error: function (response) {},
			complete: function (response) {
				rexmodel_import_props.$self.removeClass('rex-modal--loading');
			}
		});
	};

	/**
	 * Sorting the model list by model name
	 * @return {null} [description]
	 * @since  2.0.0
	 */
	var _sortModelList = function () {
		var modelWrap = rexmodel_import_props.$self.find('.model-list')[0];
		var models = [].slice.call(modelWrap.getElementsByClassName('model__element'));
		models.sort(function (a, b) {
			var a_title = a.querySelector('.model-name').textContent.toUpperCase();
			var b_title = b.querySelector('.model-name').textContent.toUpperCase();

			if (a_title < b_title) {
				return -1;
			}
			if (a_title > b_title) {
				return 1;
			}

			return 0;
		});
		modelWrap.innerHTML = '';
		models.forEach(function (model) {
			modelWrap.appendChild(model);
		});
	};

	/**
	 * Send a POST request to delete a model
	 * @param  {Node} model model Element
	 * @return {null}
	 * @since  2.0.0
	 */
	var _deleteModel = function (model) {
		var model_id = model.getAttribute('data-rex-model-id');
		if (model_id) {
			var response = confirm(live_editor_obj.labels.models.confirm_delete);
			if (response) {
				// prepare data to ajax request
				var data = {
					action: 'rex_delete_rexmodel',
					nonce_param: live_editor_obj.rexnonce,
					model_id: model_id
				};
				var endcodedData = Rexlive_Base_Settings.encodeData(data);

				// prepare ajax request
				var request = new XMLHttpRequest();
				request.open('POST', live_editor_obj.ajaxurl, true);
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

				// handle request response
				request.onloadstart = function () {
					rexmodel_import_props.$self.addClass('rex-modal--loading');
				};
				request.onload = function () {
					if (request.status >= 200 && request.status < 400) {
						model.style.display = 'none';
					}
				};
				request.onerror = function () {};
				request.onloadend = function () {
					rexmodel_import_props.$self.removeClass('rex-modal--loading');
				};

				// send request
				request.send(endcodedData);
			}
		}
	};

	/**
	 * Edit the model thumbnail
	 * @param model_id
	 * @param thumbnail_id
	 * @return media library
	 * @since  2.0.0
	 */
	var _editModelThumbnail = function (model_id, thumbnail_id) {
		// sets default image size
		setUserSetting('imgsize', 'medium'); // before merge was a comment. beware!

		// If the frame is already opened, return it
		if (image_uploader_frame_direct) {
			image_uploader_frame_direct
				.state('live-image-model')
				.set('selected_image', thumbnail_id)
				.set('selected_model', model_id);
			image_uploader_frame_direct.open();

			return;
		}

		//create a new Library, base on defaults
		//you can put your attributes in
		var insertImage = wp.media.controller.Library.extend({
			defaults: _.defaults(
				{
					id: 'live-image-model',
					title: 'Edit Model Thumbnail',
					allowLocalEdits: true,
					displaySettings: true,
					displayUserSettings: true,
					multiple: false,
					library: wp.media.query({ type: 'image' }),
					selected_image: thumbnail_id,
					selected_model: model_id,
					type: 'image' //audio, video, application/pdf, ... etc
				},
				wp.media.controller.Library.prototype.defaults
			)
		});

		//Setup media frame
		image_uploader_frame_direct = wp.media({
			button: { text: 'Select' },
			state: 'live-image-model',
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
			var selection = image_uploader_frame_direct.state('live-image-model').get('selection');

			//remove all the selection first
			selection.each(function (video) {
				attachment = wp.media.attachment(video.attributes.id);
				attachment.fetch();
				selection.remove(attachment ? [attachment] : []);
			});

			var image_id = image_uploader_frame_direct.state('live-image-model').get('selected_image');

			// Check the already inserted image
			if (image_id) {
				attachment = wp.media.attachment(image_id);
				attachment.fetch();

				selection.add(attachment ? [attachment] : [], { imgsize: '' });
			}
		});

		image_uploader_frame_direct.on('select', function () {
			var state = image_uploader_frame_direct.state('live-image-model');
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
				if (!wp.media.view.settings.captions) delete obj_attachment.caption;

				display = wp.media.string.props(display, obj_attachment);

				// data.data_to_send.media.push(to_send);
				data.data_to_send.idImage = obj_attachment.id;
				data.data_to_send.urlImage = display.src;
			});

			_updateModelThumbnail(display.src, display.size, obj_attachment.id);
		});

		image_uploader_frame_direct.on('close', function () {
			// resets the option for the image size
			setUserSetting('imgsize', 'medium'); // before merge was comment. beware!
		});

		//now open the popup
		image_uploader_frame_direct.open();
	};

	/**
	 * Updates the model with the new thumbnail selected
	 * @param display_src
	 * @param display_size
	 * @param obj_attachment_id
	 * @return {null}
	 */
	var _updateModelThumbnail = function (display_src, display_size, obj_attachment_id) {
		var model_selected = image_uploader_frame_direct.state('live-image-model').get('selected_model');
		var element = $('.model__element[data-rex-model-id="' + model_selected + '"]');

		element.attr('data-rex-model-thumbnail-id', obj_attachment_id);
		element.attr('data-rex-model-thumbnail-size', display_size);
		// sets the background of the model
		element
			.find('.model-preview')
			.addClass('model-preview--active')
			.css('background-image', 'url("' + display_src + '")');
		// sets the background of the edit model thumbnail button
		element
			.find('.model__element--edit-thumbnail')
			.addClass('tool-button--image-preview')
			.css('background-image', 'url("' + display_src + '")');

		// saves the changes
		_saveModelThumbnail(model_selected, obj_attachment_id, display_size);
	};

	/**
	 * Deletes the model thumbnail
	 * @param model_id
	 * @return media library
	 * @since  2.0.0
	 */
	var _resetModelThumbnail = function (model_id) {
		var element = $('.model__element[data-rex-model-id="' + model_id + '"]');

		element.attr('data-rex-model-thumbnail-id', '');
		element.attr('data-rex-model-thumbnail-size', '');
		// removes the background of the model
		element.find('.model-preview').css('background-image', 'url("")').removeClass('model-preview--active');
		// removes the background of the edit model thumbnail button
		element
			.find('.tool-button--image-preview')
			.css('background-image', 'url("")')
			.removeClass('tool-button--image-preview');

		// saves the changes
		_deleteModelThumbnail(model_id);
	};

	/**
	 * Updates the model list using an AJAX call.
	 * @return {null}
	 * @since  x.x.x
	 */
	var _updateModelList = function () {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: live_editor_obj.ajaxurl,
			data: {
				action: 'rex_get_model_list',
				nonce_param: live_editor_obj.rexnonce
			},
			success: function (response) {
				if (response.success) {
					var currentList = [];
					rexmodel_import_props.$self.find('.model__element').each(function (i, model) {
						var modelID = $(model).attr('data-rex-model-id');
						var modelObj = {
							id: modelID,
							founded: false
						};
						currentList.push(modelObj);
					});

					var updatedList = response.data.updated_list;

					var i, j;

					for (i = 0; i < updatedList.length; i++) {
						updatedList[i].founded = false;
					}

					for (i = 0; i < updatedList.length; i++) {
						for (j = 0; j < currentList.length; j++) {
							if (updatedList[i].id == currentList[j].id) {
								updatedList[i].founded = true;
								currentList[j].founded = true;
								break;
							}
						}
					}

					tmpl.arg = 'model';

					for (i = 0; i < updatedList.length; i++) {
						if (!updatedList[i].founded) {
							rexmodel_import_props.$self.find('.model-list').prepend(
								tmpl('rexlive-tmpl-model-item-list', {
									id: updatedList[i].id,
									name: updatedList[i].name,
									preview: updatedList[i].preview_image_url != '' ? updatedList[i].preview_image_url : ''
								})
							);
						}
					}

					for (i = 0; i < currentList.length; i++) {
						if (!currentList[i].founded) {
							rexmodel_import_props.$self
								.find('.model__element[data-rex-model-id="' + currentList[i].id + '"]')
								.remove();
						}
					}

					var event = jQuery.Event('rexlive:lateralMenuReady');
					$(document).trigger(event);
				}
			},
			error: function (response) {},
			complete: function (response) {
				rexmodel_import_props.$self.removeClass('rex-modal--loading');
			}
		});
	};

	var _linkDocumentListeners = function () {};

	var _linkDraggable = function () {
		var isIE = /*@cc_on!@*/ false || !!document.documentMode;
		var $currentElement, currentElementChangeFlag, elementRectangle, countdown, dragoverqueue_processtimer;

		var clientFrameWindow = Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow;
		var $frameContentWindow = $(clientFrameWindow);

		var mouseClientX = 0;
		var mouseClientY = 0;

		var previousMouseClientX = 0;
		var previousMouseClientY = 0;

		var scrollAmount = 15;

		function onModelDragStart(event) {
			Rexbuilder_Util_Admin_Editor.dragImportType = 'rexmodel';

			Rexbuilder_Util_Admin_Editor.hideLateralMenu();
			Rexbuilder_Util_Admin_Editor.blockIframeRows();

			event.originalEvent.dataTransfer.effectAllowed = 'all';

			dragoverqueue_processtimer = setInterval(function () {
				dragDropHelper.processDragOverQueue();
			}, 100);

			tmpl.arg = 'o';

			var insertingHTML = tmpl('rexlive-tmpl-insert-model-loader', {
				model_id: $(this).attr('data-rex-model-id')
			});

			var dataType = 'text/plain';

			if (isIE) {
				dataType = 'text';
			}

			event.originalEvent.dataTransfer.setData(dataType, insertingHTML);

			var dataDnDstart = {
				eventName: 'rexlive:drag_drop_started',
				data_to_send: {}
			};
			Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDstart);
		}

		function onModelDrag() {
			Rexbuilder_Util_Admin_Editor.setStopScroll(true);
			Rexbuilder_Util_Admin_Editor.checkLateralMenu(mouseClientX);

			if (mouseClientY < 150) {
				Rexbuilder_Util_Admin_Editor.scrollFrame(scrollAmount * -1);
			}

			if (mouseClientY > $frameContentWindow.height() - 150) {
				Rexbuilder_Util_Admin_Editor.scrollFrame(scrollAmount);
			}
		}

		function onModelDragEnd(event) {
			Rexbuilder_Util_Admin_Editor.setStopScroll(true);
			Rexbuilder_Util_Admin_Editor.releaseIframeRows();

			clearInterval(dragoverqueue_processtimer);

			dragDropHelper.removeAllPlaceholders();
			dragDropHelper.clearContainerContextMarker();

			Rexbuilder_Util_Admin_Editor.dragImportType = '';

			var dataDnDend = {
				eventName: 'rexlive:drag_drop_ended',
				data_to_send: {}
			};

			Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDend);
		}

		function onIFrameLoad() {
			var $rexContainer = $(clientFrameWindow.document).find('.rex-container').eq(0);
			var mousePosition = {};

			function onDragOverWindow(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexmodel') return;
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
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexmodel') return;
				event.stopPropagation();

				$currentElement = $(event.target);
				currentElementChangeFlag = true;
				elementRectangle = event.target.getBoundingClientRect();
				countdown = 1;
			}

			function onDragOverContainer(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexmodel') return;

				if (countdown % 15 != 0 && currentElementChangeFlag == false) {
					countdown = countdown + 1;
					return;
				}

				event = event || window.event;
				countdown = countdown + 1;
				currentElementChangeFlag = false;

				mousePosition.xCoord = event.originalEvent.clientX;
				mousePosition.yCoord = event.originalEvent.clientY;

				dragDropHelper.addEntryToDragOverQueue($currentElement, elementRectangle, mousePosition);
			}

			function onDropContainer(event) {
				if (Rexbuilder_Util_Admin_Editor.dragImportType !== 'rexmodel') return;
				event.preventDefault();
				event.stopPropagation();

				var e;

				if (event.isTrigger) {
					e = triggerEvent.originalEvent;
				} else {
					e = event.originalEvent;
				}

				try {
					var textData = e.dataTransfer.getData('text/plain');
					var $insertionPoint = Rexbuilder_Util_Admin_Editor.$frameBuilder.contents().find('.drop-marker');
					var $divInsert = $(jQuery.parseHTML(textData));

					$divInsert.insertAfter($insertionPoint[0]);
					$insertionPoint.remove();

					var dataEndDrop = {
						eventName: 'rexlive:importModels'
					};
					Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataEndDrop);
				} catch (e) {
					console.error(e);
				}
			}

			Model_Import_Modal.onDragOverWindow = onDragOverWindow;
			$rexContainer.on('dragenter', onDragEnterRow);
			$rexContainer.on('dragover', onDragOverContainer);
			$rexContainer.on('drop', onDropContainer);
		}

		Rexlive_Base_Settings.$document.on('dragstart', '.model-list li', onModelDragStart);
		Rexlive_Base_Settings.$document.on('drag', '.model-list li', onModelDrag);
		Rexlive_Base_Settings.$document.on('dragend', '.model-list li', onModelDragEnd);
		Rexbuilder_Util_Admin_Editor.$frameBuilder.load(onIFrameLoad);
	};

	var initPhotoSwipeFromDOM = function (gallerySelector) {
		// parse slide data (url, title, size ...) from DOM elements
		// (children of gallerySelector)
		var parseThumbnailElements = function (el) {
			var thumbElements = el.childNodes,
				numNodes = thumbElements.length,
				items = [],
				figureEl,
				linkEl,
				size,
				item;

			for (var i = 0; i < numNodes; i++) {
				figureEl = thumbElements[i]; // <figure> element

				// include only element nodes
				if (figureEl.nodeType !== 1) {
					continue;
				}

				linkEl = figureEl.children[0]; // <a> element

				size = linkEl.getAttribute('data-size').split('x');

				// create slide object
				item = {
					src: linkEl.getAttribute('data-href'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};

				if (figureEl.children.length > 1) {
					// <figcaption> content
					item.title = figureEl.children[1].innerHTML;
				}

				if (linkEl.children.length > 0) {
					// <img> thumbnail element, retrieving thumbnail url
					item.msrc = linkEl.children[0].getAttribute('src');
				}

				item.el = figureEl; // save link to element for getThumbBoundsFn
				items.push(item);
			}

			return items;
		};

		// find nearest parent element
		var closest = function closest(el, fn) {
			return el && (fn(el) ? el : closest(el.parentNode, fn));
		};

		// triggers when user clicks on thumbnail
		var onThumbnailsClick = function (e) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);

			var eTarget = e.target;

			// find root element of slide
			var clickedListItem = closest(eTarget, function (el) {
				return el.tagName && el.tagName.toUpperCase() === 'LI';
			});

			if (!clickedListItem) {
				return;
			}

			// find index of clicked item by looping through all child nodes
			// alternatively, you may define index via data- attribute
			var clickedGallery = clickedListItem.parentNode,
				childNodes = clickedListItem.parentNode.childNodes,
				numChildNodes = childNodes.length,
				nodeIndex = 0,
				index;

			for (var i = 0; i < numChildNodes; i++) {
				if (childNodes[i].nodeType !== 1) {
					continue;
				}

				if (childNodes[i] === clickedListItem) {
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}

			if (index >= 0) {
				// open PhotoSwipe if valid index found
				openPhotoSwipe(index, clickedGallery);
			}
			return false;
		};

		// parse picture index and gallery index from URL (#&pid=1&gid=2)
		var photoswipeParseHash = function () {
			var hash = window.location.hash.substring(1),
				params = {};

			if (hash.length < 5) {
				return params;
			}

			var vars = hash.split('&');
			for (var i = 0; i < vars.length; i++) {
				if (!vars[i]) {
					continue;
				}
				var pair = vars[i].split('=');
				if (pair.length < 2) {
					continue;
				}
				params[pair[0]] = pair[1];
			}

			if (params.gid) {
				params.gid = parseInt(params.gid, 10);
			}

			return params;
		};

		var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0],
				gallery,
				options,
				items;

			items = parseThumbnailElements(galleryElement);

			// define options (if needed)
			options = {
				// define gallery index (for URL)
				galleryUID: galleryElement.getAttribute('data-pswp-uid')

				// getThumbBoundsFn: function(index) {
				//   // See Options -> getThumbBoundsFn section of documentation for more info
				//   var thumbnail = items[index].el.getElementsByTagName("img")[0], // find thumbnail
				//     pageYScroll =
				//       window.pageYOffset || document.documentElement.scrollTop,
				//     rect = thumbnail.getBoundingClientRect();

				//   return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
				// }
			};

			// PhotoSwipe opened from URL
			if (fromURL) {
				if (options.galleryPIDs) {
					// parse real index when custom PIDs are used
					// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
					for (var j = 0; j < items.length; j++) {
						if (items[j].pid == index) {
							options.index = j;
							break;
						}
					}
				} else {
					// in URL indexes start from 1
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}

			// exit if index not found
			if (isNaN(options.index)) {
				return;
			}

			if (disableAnimation) {
				options.showAnimationDuration = 0;
			}

			// Pass data to PhotoSwipe and initialize it
			gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
		};

		// loop through all gallery elements and bind events
		var galleryElements = document.querySelectorAll(gallerySelector);

		for (var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i + 1);
			galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if (hashData.pid && hashData.gid) {
			openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
		}
	};

	var _init = function () {
		Rexbuilder_Util_Admin_Editor.frameBuilder.addEventListener('load', _handleIFrameLoad);

		var self = document.getElementById('rex-models-list');
		var $self = $(self);
		rexmodel_import_props = {
			self: self,
			$self: $self
		};
		_linkDocumentListeners();
		_linkDraggable();
		// execute above function
		// initPhotoSwipeFromDOM(".model-list--pswp");
	};

	function _handleIFrameLoad() {
		var context = Rexbuilder_Util_Admin_Editor.frameBuilder.contentDocument;
		dragDropHelper = new RexModelDragDrop(context);
	}

	return {
		init: _init,
		saveModelThumbnail: _saveModelThumbnail,
		updateModelThumbnail: _updateModelThumbnail,
		updateModelList: _updateModelList,
		editModelThumbnail: _editModelThumbnail,
		resetModelThumbnail: _resetModelThumbnail,
		deleteModel: _deleteModel,
		editModelName: _editModelName
	};
})(jQuery);
