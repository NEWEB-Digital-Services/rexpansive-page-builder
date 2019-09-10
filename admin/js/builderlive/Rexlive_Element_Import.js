var Element_Import_Modal = (function ($) {
    "use strict";
    var element_import_props;
    var image_uploader_frame_direct;  //used for the media library opener

    /////////////////////////////////////////////////////////////////////
    /// FUNCTIONS THAT USE AJAX CALLS
    /////////////////////////////////////////////////////////////////////
    
    /**
	* Updates the element list using an AJAX call.
	* @return {null} 
	* @since  x.x.x
	*/
    var _updateElementList = function() {
		$.ajax({
		  type: "GET",
		  dataType: "json",
		  url: live_editor_obj.ajaxurl,
		  data: {
		    action: "rex_get_element_list",
		    nonce_param: live_editor_obj.rexnonce
		  },
		  success: function(response) {
			if (response.success) {
		    	var currentList = [];
				element_import_props.$self
				.find(".element-list__element")
				.each(function(i, element) {
					var elementID = $(element).attr("data-rex-element-id");
					var elementObj = {
					  id: elementID,
					  founded: false
					};
					currentList.push(elementObj);
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

				tmpl.arg = "element";

				for (i = 0; i < updatedList.length; i++) {
					if (!updatedList[i].founded) {
					  element_import_props.$self.find(".element-list").prepend(
					    tmpl("rexlive-tmpl-element-item-list", {
					      id: updatedList[i].id,
					      name: updatedList[i].name,
					      preview:
					      updatedList[i].preview_image_url != ""
					      ? updatedList[i].preview_image_url
					      : ""
					    })
					    ).find(".rex-element-wrapper").prepend(updatedList[i].element_data_html[0]);
					}
				}

				for (i = 0; i < currentList.length; i++) {
					if (!currentList[i].founded) {
					  element_import_props.$self
					  .find(
					    '.element-list__element[data-rex-element-id="' +
					    currentList[i].id +
					    '"]'
					    )
					  .remove();
					}
				}

				var event = jQuery.Event("rexlive:lateralMenuReady");
				$(document).trigger(event);
			}
		  },
		  error: function(response) {},
		  complete: function(response) {
		    element_import_props.$self.removeClass("rex-modal--loading");
		  }
		});
	};

    /**
	* Saves the element thumbnail in the db using an AJAX call.
	* @param element_selected
	* @param selected_image_id Wordpress id of the new thumbnail image
	* @param selected_image_size
	* @return {null} 
	* @since  x.x.x
	*/
	var _saveElementThumbnail = function(element_selected, selected_image_id, selected_image_size) {
		$.ajax({
		  type: "GET",
		  dataType: "json",
		  url: live_editor_obj.ajaxurl,
		  data: {
		    action: "rex_save_element_thumbnail",
		    nonce_param: live_editor_obj.rexnonce,
		    element_target: element_selected,
		    image_selected: selected_image_id,
		    image_size: selected_image_size,
		    set_post_thumbnail_result: null,
		    set_post_thumbnail_url_result: null
		  },
		  success: function(response) {
		    if (response.success) {}
		  },
		  error: function(response) {}
		});
	};

	/**
	* Deletes the element thumbnail from the db using an AJAX call.
	* @param element_to_delete
	* @return {null} 
	* @since  x.x.x
	*/
	var _deleteElementThumbnail = function(element_to_delete) {
		$.ajax({
		  type: "GET",
		  dataType: "json",
		  url: live_editor_obj.ajaxurl,
		  data: {
		    action: "rex_delete_element_thumbnail",
		    nonce_param: live_editor_obj.rexnonce,
		    element_target: element_to_delete,
		    delete_post_thumbnail_result: null,
		    delete_post_thumbnail_url_result: null
		  },
		  success: function(response) {
		    if (response.success) {}
		  },
		  error: function(response) {}
		});
	};

	/////////////////////////////////////////////////////////////////////
    /// ELEMENT FUNCTIONS
    /////////////////////////////////////////////////////////////////////

	/**
	* Send a POST request to delete an element.
	* @param  {Node} element
	* @return {null}
	* @since  x.x.x
	*/
	var _deleteElement = function( element ) {
		var element_id = element.getAttribute('data-rex-element-id');
		if ( element_id ) {
			var response = confirm( live_editor_obj.labels.rexelements.confirm_delete );
			if ( response ) {
			// prepare data to ajax request
			var data = {
			  action: "rex_delete_rexelement",
			  nonce_param: live_editor_obj.rexnonce,
			  element_id: element_id
			};
			var endcodedData = Rexlive_Base_Settings.encodeData(data);

			// prepare ajax request
			var request = new XMLHttpRequest();
			request.open('POST', live_editor_obj.ajaxurl, true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

			// handle request response
			request.onloadstart = function() {
			  element_import_props.$self.addClass('rex-modal--loading');
			}
			request.onload = function() {
			  if (request.status >= 200 && request.status < 400) {
			    element.style.display = 'none';
			  }
			};
			request.onerror = function() {};
			request.onloadend = function() {
			  element_import_props.$self.removeClass('rex-modal--loading');
			};

			// send request
			request.send(endcodedData);
			}
		}
	}

	/**
	* Edits the element thumbnail.
	* @param element_id
	* @param thumbnail_id
	* @return media library
	* @return {media uploader} 
	* @since  x.x.x
	*/
	var _editElementThumbnail = function(element_id, thumbnail_id) {
	  // sets default image size
	  setUserSetting('imgsize', 'medium');

	 // If the frame is already opened, return it
	  if (image_uploader_frame_direct) {
	    image_uploader_frame_direct
	      .state("live-image-element")
	      .set("selected_image", thumbnail_id)
	      .set("selected_element", element_id);
	    image_uploader_frame_direct.open();

	    return;
	  }

	  //create a new Library, base on defaults
	  //you can put your attributes in
	  var insertImage = wp.media.controller.Library.extend({
	    defaults: _.defaults(
	      {
	        id: "live-image-element",
	        title: "Edit Element Thumbnail",
	        allowLocalEdits: true,
	        displaySettings: true,
	        displayUserSettings: true,
	        multiple: false,
	        library: wp.media.query({ type: "image" }),
	        selected_image: thumbnail_id,
	        selected_element: element_id,
	        type: "image" //audio, video, application/pdf, ... etc
	      },
	      wp.media.controller.Library.prototype.defaults
	    )
	  });

	  //Setup media frame
	  image_uploader_frame_direct = wp.media({
	    button: { text: "Select" },
	    state: "live-image-element",
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
	  image_uploader_frame_direct.on("open", function() {
	    var attachment;
	    var selection = image_uploader_frame_direct
	      .state("live-image-element")
	      .get("selection");

	    //remove all the selection first
	    selection.each(function(video) {
	      attachment = wp.media.attachment(video.attributes.id);
	      attachment.fetch();
	      selection.remove(attachment ? [attachment] : []);
	    });

	    var image_id = image_uploader_frame_direct
	      .state("live-image-element")
	      .get("selected_image");

	    // Check the already inserted image
	    if (image_id) {
	      attachment = wp.media.attachment(image_id);
	      attachment.fetch();

	      selection.add(attachment ? [attachment] : [], { 'imgsize': '' });
	    }
	  });

	  image_uploader_frame_direct.on("select", function() {
	    var state = image_uploader_frame_direct.state("live-image-element");
	    var sectionTarget = state.get("liveTarget");
	    var eventName = state.get("eventName");
	    var data_to_send = state.get("data_to_send");

	    var selection = state.get("selection");
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
	    selection.each(function(attachment) {
	      display = state.display(attachment).toJSON();
	      obj_attachment = attachment.toJSON();

	      // If captions are disabled, clear the caption.
	      if (!wp.media.view.settings.captions) delete obj_attachment.caption;

	      display = wp.media.string.props(display, obj_attachment);

	      // data.data_to_send.media.push(to_send);
	      data.data_to_send.idImage = obj_attachment.id;
	      data.data_to_send.urlImage = display.src;
	    });

	    _updateElementThumbnail(display.src, display.size, obj_attachment.id);
	  });

	  image_uploader_frame_direct.on("close", function() {
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
	var _updateElementThumbnail = function(display_src, display_size, obj_attachment_id) {
		var element_selected = image_uploader_frame_direct.state("live-image-element").get("selected_element");
		var element = $('.element-list__element[data-rex-element-id="' + element_selected + '"]');

		element.attr("data-rex-element-thumbnail-id", obj_attachment_id);
		element.attr("data-rex-element-thumbnail-size", display_size);
		// sets the background of the element
		element.find(".element-list-preview").addClass("element-list-preview--active").css('background-image', 'url("' + display_src + '")');
		// sets the background of the edit element thumbnail button
		element.find('.element-list__element--edit-thumbnail').addClass("tool-button--image-preview").css('background-image', 'url("' + display_src + '")');

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
	var _resetElementThumbnail = function(element_id) {
		var element = $('.element-list__element[data-rex-element-id="' + element_id + '"]');

		element.attr("data-rex-element-thumbnail-id", "");
		element.attr("data-rex-element-thumbnail-size", "");
		// removes the background of the element
		element.find(".element-list-preview").css('background-image', 'url("")').removeClass("element-list-preview--active");
		// removes the background of the edit element thumbnail button
		element.find(".tool-button--image-preview").css('background-image', 'url("")').removeClass("tool-button--image-preview");

		// saves the changes
		_deleteElementThumbnail(element_id);
	};

	/////////////////////////////////////////////////////////////////////////////////////////
    /// FUNCTION FOR DRAG & DROP
    /////////////////////////////////////////////////////////////////////////////////////////
	 
	var _linkDraggable = function () {
        var currentElement,
            currentElementChangeFlag,
            elementRectangle,
            countdown,
            dragoverqueue_processtimer;

        var clientFrameWindow = Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow;
        var $frameContentWindow = $(clientFrameWindow);

        var elementDimensions = {
            width: 0,
            height: 0
        }
        var breakPointNumber = { x: 10, y: 10 };
        var fixedBreakPoints = false;
        var customBreakPoints = { x: 50, y: 50 };

        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        // to understand, need for button near the mouse during the drag
        // var $imgPreview;

        var mouseClientX = 0,
            mouseClientY = 0;

        Rexlive_Base_Settings.$document.on("dragstart", ".element-list li", function (
            event
        ) {
            Rexbuilder_Util_Admin_Editor.dragImportType = "rexelement";
            event.originalEvent.dataTransfer.effectAllowed = "all";
            dragoverqueue_processtimer = setInterval(function () {
                DragDropFunctions.ProcessDragOverQueue();
            }, 100);

            
            var insertingHTML = $(this).html();
            if(isIE){
                event.originalEvent.dataTransfer.setData("text", insertingHTML);
            } else {
                event.originalEvent.dataTransfer.setData("text/plain", insertingHTML);
            }
            Rexbuilder_Util_Admin_Editor.addClassToLiveFrameRexContainer("rex-dragging-element");

            var dataDnDstart = {
                eventName: "rexlive:drag_drop_starded",
                data_to_send: {}
            };
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDstart);
        });

        // definisce quando bisogna scrollare in alto o in basso
        Rexlive_Base_Settings.$document.on("drag", ".element-list li", function (
            event
        ) {
            Rexbuilder_Util_Admin_Editor.setScroll(true);

            if (mouseClientY < 150) {
                Rexbuilder_Util_Admin_Editor.setScroll(false);
                Rexbuilder_Util_Admin_Editor.scrollFrame(-1);
            }

            if (mouseClientY > $frameContentWindow.height() - 150) {
                Rexbuilder_Util_Admin_Editor.setScroll(false);
                Rexbuilder_Util_Admin_Editor.scrollFrame(1);
            }
        });

        Rexlive_Base_Settings.$document.on("dragend", ".element-list li", function (event) {
            clearInterval(dragoverqueue_processtimer);

            Rexbuilder_Util_Admin_Editor.setScroll(true);

            DragDropFunctions.removePlaceholder();
            DragDropFunctions.ClearContainerContext();
            Rexbuilder_Util_Admin_Editor.removeClassToLiveFrameRexContainer("rex-dragging-element");
            Rexbuilder_Util_Admin_Editor.dragImportType = "";
            var dataDnDend = {
                eventName: "rexlive:drag_drop_ended",
                data_to_send: {}
            };
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDend);
        });

        Rexbuilder_Util_Admin_Editor.$frameBuilder.load(function () {
            var $rexContainer = $(Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow.document).find(".rex-container").eq(0);

            var mousePosition = {};
            var mousePositionToIFrame = {};

            $frameContentWindow.on('dragover', function (event) {
                if (Rexbuilder_Util_Admin_Editor.dragImportType == "rexelement") {
                    // mouse position for scrolling
                    event.preventDefault();
                    event.stopPropagation();
                    mouseClientX = event.originalEvent.clientX;
                    mouseClientY = event.originalEvent.clientY;
                }
            });

            $rexContainer.on('dragenter', ".grid-stack-row", function (event) {
                if (Rexbuilder_Util_Admin_Editor.dragImportType == "rexelement") {
                    currentElement = $(event.target);
                    currentElementChangeFlag = true;
                    elementRectangle = event.target.getBoundingClientRect();
                    countdown = 1;
                }
            });

            $rexContainer.on('dragover', ".grid-stack-row", function (event) {
                if (Rexbuilder_Util_Admin_Editor.dragImportType == "rexelement") {

                    if (countdown % 15 != 0 && currentElementChangeFlag == false) {
                        countdown = countdown + 1;
                        return;
                    }
                    event = event || window.event;
                    countdown = countdown + 1;
                    currentElementChangeFlag = false;

                    mousePosition.x = event.originalEvent.clientX;
                    mousePosition.y = event.originalEvent.clientY;

                    mousePositionToIFrame.x = event.originalEvent.pageX;
                    mousePositionToIFrame.y = event.originalEvent.pageY;
                    DragDropFunctions.AddEntryToDragOverQueue(currentElement, elementRectangle, mousePosition);
                }
            });

            $rexContainer.on('drop', ".grid-stack-row", function (event) {
                if (Rexbuilder_Util_Admin_Editor.dragImportType == "rexelement") {
                    event.preventDefault();
                    event.stopPropagation();
                    var e;
                    if (event.isTrigger) {
                        e = triggerEvent.originalEvent;
                    } else {
                        e = event.originalEvent;
                    }
                    try {
                        var textData = "";
                        if(isIE){
                            textData = e.dataTransfer.getData("text");
                        } else {
                            textData = e.dataTransfer.getData("text/plain");
                        }
                        var $insertionPoint = Rexbuilder_Util_Admin_Editor.$frameBuilder
                            .contents()
                            .find(".drop-marker");

                        textData = textData.trim();

                        var $divInsert = $(jQuery.parseHTML(textData));
                        $divInsert.addClass("rex-loading-button");
                        $divInsert.insertAfter($insertionPoint[0]);
                        $insertionPoint.remove();
                        var dataEndDrop = {
                            eventName: "rexlive:importElement",
                            data_to_send: {
                            	elementDimensions: elementDimensions,
                                mousePosition: mousePositionToIFrame
                            }
                        };
                        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataEndDrop);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            });
        });
        
        var mousePercents;
        var voidelements = ['i', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'video', 'iframe', 'source', 'track', 'wbr'];
        var selectorVoidElements = voidelements.join(",");
        
        var DragDropFunctions =
        {
            dragoverqueue: [],
            GetMouseBearingsPercentage: function ($element, elementRect, mousePos) {
                if (!elementRect) {
                    elementRect = $element.get(0).getBoundingClientRect();
                }
                return {
                    x: ((mousePos.x - elementRect.left) / (elementRect.right - elementRect.left)) * 100,
                    y: ((mousePos.y - elementRect.top) / (elementRect.bottom - elementRect.top)) * 100
                };
            },
            OrchestrateDragDrop: function ($element, elementRect, mousePos) {
                //If no element is hovered or element hovered is the placeholder -> not valid -> return false;
                if (!$element || $element.length == 0 || !elementRect || !mousePos) {
                    return false;
                }

                if ($element.is('html')) {
                    $element = $element.find('body');
                }
                //Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]

                mousePercents = this.GetMouseBearingsPercentage($element, elementRect, mousePos);

                // If I have to go inside the element
                if ($element.hasClass("rex-element-wrapper") || $element.parents(".rex-element-wrapper").length != 0) {
                    $element = $element.hasClass("rex-element-wrapper") ? $element : $element.parents(".rex-element-wrapper").eq(0);
                    customBreakPoints = jQuery.extend(true, {}, breakPointNumber);
                    fixedBreakPoints = true;
                    breakPointNumber.x = 50;
                    breakPointNumber.y = 50;
                }
                if ((mousePercents.x > breakPointNumber.x && mousePercents.x < 100 - breakPointNumber.x)
                    && (mousePercents.y > breakPointNumber.y && mousePercents.y < 100 - breakPointNumber.y)) {
                    //Case 1 -
                    var $tempelement = $element.clone();
                    $tempelement.find(".drop-marker").remove();
                    if ($tempelement.html() == "" && !this.checkVoidElement($tempelement)) {
                        if (mousePercents.y < 90) {
                            return this.PlaceInside($element);
                        }
                    } else if ($tempelement.children().length == 0) {
                        //text element detected
                        this.DecideBeforeAfter($element, mousePercents);
                    } else if ($tempelement.children().length == 1) {
                        //only 1 child element detected
                        if ($tempelement.hasClass("rex-elements-paragraph")) {
                            var positionAndElement = this.findNearestElement($element, mousePos.x, mousePos.y);
                            this.DecideBeforeAfter(positionAndElement.el, mousePercents, mousePos);
                        } else {
                            this.DecideBeforeAfter($element.children(":not(.drop-marker,[data-dragcontext-marker])").first(), mousePercents);
                        }
                    } else {
                        var positionAndElement = this.findNearestElement($element, mousePos.x, mousePos.y);
                        this.DecideBeforeAfter(positionAndElement.el, mousePercents, mousePos);
                    }
                } else if ((mousePercents.x <= breakPointNumber.x) || (mousePercents.y <= breakPointNumber.y)) {
                    if (mousePercents.y <= mousePercents.x) {
                        validElement = this.FindValidParent($element, 'top');
                    } else {
                        validElement = this.FindValidParent($element, 'left');
                    }

                    if (validElement.is("body,html")) {
                        validElement = Rexbuilder_Util_Admin_Editor.$frameBuilder.contents().find("body").children(":not(.drop-marker,[data-dragcontext-marker])").first();
                    }
                    this.DecideBeforeAfter(validElement, mousePercents, mousePos);
                } else if ((mousePercents.x >= 100 - breakPointNumber.x) || (mousePercents.y >= 100 - breakPointNumber.y)) {
                    var validElement = null;
                    if (mousePercents.y >= mousePercents.x) {
                        validElement = this.FindValidParent($element, 'bottom');
                    } else {
                        validElement = this.FindValidParent($element, 'right');
                    }

                    if (validElement.is("body,html")) {
                        validElement = Rexbuilder_Util_Admin_Editor.$frameBuilder.contents().find("body").children(":not(.drop-marker,[data-dragcontext-marker])").last();
                    }
                    this.DecideBeforeAfter(validElement, mousePercents, mousePos);
                }
                if (fixedBreakPoints) {
                    breakPointNumber.x = customBreakPoints.x;
                    breakPointNumber.y = customBreakPoints.y;
                    fixedBreakPoints = false;
                }

                /**
                 * Checks if current element, where placeholder is, is a valid element. If not checks if has a grid-stack-item as parent. If has moves placeholder in right position
                 */
                if (!$element.hasClass("rex-elements-paragraph") && !$element.hasClass("text-wrap") && !$element.hasClass(".rex-element-wrapper")) {
                    var $gridItem = $element.parents(".grid-stack-item");
                    if ($gridItem.length != 0) {
                        this.removePlaceholder();
                        $gridItem.find(".text-wrap").eq(0).append(this.getPlaceHolder());
                    }
                }
            },
            DecideBeforeAfter: function ($targetElement, mousePercents, mousePos) {
                if (mousePos) {
                    mousePercents = this.GetMouseBearingsPercentage($targetElement, null, mousePos);
                }

                /*if(!mousePercents)
                 {
                 mousePercents = this.GetMouseBearingsPercentage($targetElement, $targetElement.get(0).getBoundingClientRect(), mousePos);
                 } */

                var $orientation = ($targetElement.css('display') == "inline" || $targetElement.css('display') == "inline-block" || $targetElement.css('display') == "inline-flex");
                if ($targetElement.is("br")) {
                    $orientation = false;
                }

                if ($orientation) {
                    if (mousePercents.x < 50) {
                        return this.PlaceBefore($targetElement);
                    }
                    else {
                        return this.PlaceAfter($targetElement);
                    }
                }
                else {
                    if (mousePercents.y < 50) {
                        return this.PlaceBefore($targetElement);
                    }
                    else {
                        return this.PlaceAfter($targetElement);
                    }
                }
            },
            checkVoidElement: function ($element) {
                return $element.is(selectorVoidElements);
            },
            calculateDistance: function (elementData, mouseX, mouseY) {
                return Math.sqrt(Math.pow(elementData.x - mouseX, 2) + Math.pow(elementData.y - mouseY, 2));
            },
            FindValidParent: function ($element, direction) {
                switch (direction) {
                    case "left":
                        while (true) {
                            var elementRect = $element.get(0).getBoundingClientRect();
                            var $tempElement = $element.parent();
                            var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                            if ($element.is("body") || $element.hasClass("grid-stack-row") || $tempElement.hasClass("rex-elements-paragraph")) {
                                return $element;
                            }
                            if (Math.abs(tempelementRect.left - elementRect.left) == 0) {
                                $element = $element.parent();
                            } else {
                                if ($element.parents(".rex-element-wrapper").length != 0) {
                                    return $element.parents(".rex-element-wrapper").eq(0);
                                }
                                return $element;
                            }
                        }
                        break;
                    case "right":
                        while (true) {
                            var elementRect = $element.get(0).getBoundingClientRect();
                            var $tempElement = $element.parent();
                            var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                            if ($element.is("body") || $element.hasClass("grid-stack-row") || $tempElement.hasClass("rex-elements-paragraph")) {
                                return $element;
                            }
                            if (Math.abs(tempelementRect.right - elementRect.right) == 0) {
                                $element = $element.parent();
                            } else {
                                if ($element.parents(".rex-element-wrapper").length != 0) {
                                    return $element.parents(".rex-element-wrapper").eq(0);
                                }
                                return $element;
                            }
                        }
                        break;
                    case "top":
                        while (true) {
                            var elementRect = $element.get(0).getBoundingClientRect();
                            var $tempElement = $element.parent();
                            var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                            if ($element.is("body") || $element.hasClass("grid-stack-row") || $tempElement.hasClass("rex-elements-paragraph")) {
                                return $element;
                            }
                            if (Math.abs(tempelementRect.top - elementRect.top) == 0) {
                                $element = $element.parent();
                            } else {
                                if ($element.parents(".rex-element-wrapper").length != 0) {
                                    return $element.parents(".rex-element-wrapper").eq(0);
                                }
                                return $element;
                            }
                        }
                        break;
                    case "bottom":
                        while (true) {
                            var elementRect = $element.get(0).getBoundingClientRect();
                            var $tempElement = $element.parent();
                            var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                            if ($element.is("body") || $element.hasClass("grid-stack-row") || $tempElement.hasClass("rex-elements-paragraph"))
                                return $element;
                            if (Math.abs(tempelementRect.bottom - elementRect.bottom) == 0) {
                                $element = $element.parent();
                            } else {
                                if ($element.parents(".rex-element-wrapper").length != 0) {
                                    return $element.parents(".rex-element-wrapper").eq(0);
                                }
                                return $element;
                            }
                        }
                        break;
                    default:
                        break;
                }
            },
            addPlaceHolder: function ($element, position, placeholder) {
                if (!placeholder)
                    placeholder = this.getPlaceHolder();
                this.removePlaceholder();
                switch (position) {
                    case "before":
                        placeholder.find(".message").html($element.data('sh-dnd-error'));
                        //elements have to be inside grid-stack-row
                        if ($element.hasClass("grid-stack-row")) {
                            $element.prepend(placeholder);
                        } else {
                            $element.before(placeholder);
                        }
                        this.AddContainerContext($element, 'sibling');
                        break;
                    case "after":
                        placeholder.find(".message").html($element.data('sh-dnd-error'));
                        //elements have to be inside grid-stack-row
                        if ($element.hasClass("grid-stack-row")) {
                            $element.append(placeholder);
                        } else {
                            $element.after(placeholder);
                        }
                        this.AddContainerContext($element, 'sibling');
                        break;
                    case "inside-prepend":
                        placeholder.find(".message").html($element.data('sh-dnd-error'));
                        $element.prepend(placeholder);
                        this.AddContainerContext($element, 'inside');
                        break;
                    case "inside-append":
                        placeholder.find(".message").html($element.data('sh-dnd-error'));
                        $element.append(placeholder);
                        this.AddContainerContext($element, 'inside');
                        break;
                }
            },
            removePlaceholder: function () {
                Rexbuilder_Util_Admin_Editor.$frameBuilder
                    .contents()
                    .find(".drop-marker")
                    .remove();
            },
            getPlaceHolder: function () {
                return $("<li class='drop-marker'></li>");
            },
            PlaceInside: function ($element) {
                var placeholder = this.getPlaceHolder();
                placeholder.addClass('horizontal').css('width', $element.width() + "px");
                this.addPlaceHolder($element, "inside-append", placeholder);
            },
            PlaceBefore: function ($element) {
                var placeholder = this.getPlaceHolder();

                var inlinePlaceholder = ($element.css('display') == "inline" || $element.css('display') == "inline-block" || $element.css('display') == "inline-flex");
                if ($element.is("br")) {
                    inlinePlaceholder = false;
                }
                else if ($element.is("td,th")) {
                    placeholder.addClass('horizontal').css('width', $element.width() + "px");
                    return this.addPlaceHolder($element, "inside-prepend", placeholder);
                }
                if (inlinePlaceholder) {
                    placeholder.addClass("vertical").css('height', $element.innerHeight() + "px");
                } else {
                    placeholder.addClass("horizontal").css('width', $element.parent().width() + "px");
                }
                this.addPlaceHolder($element, "before", placeholder);
            },

            PlaceAfter: function ($element) {
                var placeholder = this.getPlaceHolder();
                var inlinePlaceholder = ($element.css('display') == "inline" || $element.css('display') == "inline-block" || $element.css('display') == "inline-flex");
                if ($element.is("br")) {
                    inlinePlaceholder = false;
                }
                else if ($element.is("td,th")) {
                    placeholder.addClass('horizontal').css('width', $element.width() + "px");
                    return this.addPlaceHolder($element, "inside-append", placeholder);
                }
                if (inlinePlaceholder)
                    placeholder.addClass("vertical").css('height', $element.innerHeight() + "px");
                else
                    placeholder.addClass("horizontal").css('width', $element.parent().width() + "px");
                this.addPlaceHolder($element, "after", placeholder);
            },

            findNearestElement: function ($container, clientX, clientY) {
                var _this = this;
                var previousElData = null;
                var childElement = $container.children(":not(.drop-marker,[data-dragcontext-marker])");
                if (childElement.length > 0) {
                    childElement.each(function () {
                        if ($(this).is(".drop-marker"))
                            return;

                        var offset = $(this).get(0).getBoundingClientRect();
                        var distance = 0;
                        var distance1, distance2 = null;
                        var position = '';
                        var xPosition1 = offset.left;
                        var xPosition2 = offset.right;
                        var yPosition1 = offset.top;
                        var yPosition2 = offset.bottom;
                        var corner1 = null;
                        var corner2 = null;

                        //Parellel to Yaxis and intersecting with x axis
                        if (clientY > yPosition1 && clientY < yPosition2) {
                            if (clientX < xPosition1 && clientY < xPosition2) {
                                corner1 = { x: xPosition1, y: clientY, 'position': 'before' };
                            }
                            else {
                                corner1 = { x: xPosition2, y: clientY, 'position': 'after' };
                            }

                        }
                        //Parellel to xAxis and intersecting with Y axis
                        else if (clientX > xPosition1 && clientX < xPosition2) {
                            if (clientY < yPosition1 && clientY < yPosition2) {
                                corner1 = { x: clientX, y: yPosition1, 'position': 'before' };
                            }
                            else {
                                corner1 = { x: clientX, y: yPosition2, 'position': 'after' };
                            }

                        }
                        else {
                            //runs if no element found!
                            if (clientX < xPosition1 && clientX < xPosition2) {
                                corner1 = { x: xPosition1, y: yPosition1, 'position': 'before' };          //left top
                                corner2 = { x: xPosition1, y: yPosition2, 'position': 'after' };       //left bottom
                            }
                            else if (clientX > xPosition1 && clientX > xPosition2) {
                                //console.log('I m on the right of the element');
                                corner1 = { x: xPosition2, y: yPosition1, 'position': 'before' };   //Right top
                                corner2 = { x: xPosition2, y: yPosition2, 'position': 'after' }; //Right Bottom
                            }
                            else if (clientY < yPosition1 && clientY < yPosition2) {
                                // console.log('I m on the top of the element');
                                corner1 = { x: xPosition1, y: yPosition1, 'position': 'before' }; //Top Left
                                corner2 = { x: xPosition2, y: yPosition1, 'position': 'after' }; //Top Right
                            }
                            else if (clientY > yPosition1 && clientY > yPosition2) {
                                // console.log('I m on the bottom of the element');
                                corner1 = { x: xPosition1, y: yPosition2, 'position': 'before' }; //Left bottom
                                corner2 = { x: xPosition2, y: yPosition2, 'position': 'after' }; //Right Bottom
                            }
                        }

                        distance1 = _this.calculateDistance(corner1, clientX, clientY);

                        if (corner2 !== null)
                            distance2 = _this.calculateDistance(corner2, clientX, clientY);

                        if (distance1 < distance2 || distance2 === null) {
                            distance = distance1;
                            position = corner1.position;
                        }
                        else {
                            distance = distance2;
                            position = corner2.position;
                        }

                        if (previousElData !== null) {
                            if (previousElData.distance < distance) {
                                return true; //continue statement
                            }
                        }
                        previousElData = {
                            'el': this,
                            'distance': distance,
                            'xPosition1': xPosition1,
                            'xPosition2': xPosition2,
                            'yPosition1': yPosition1,
                            'yPosition2': yPosition2,
                            'position': position
                        };
                    });
                    if (previousElData !== null) {
                        var position = previousElData.position;
                        return {
                            'el': $(previousElData.el),
                            'position': position
                        };
                    }
                    else {
                        return false;
                    }
                }
            },
            AddEntryToDragOverQueue: function ($element, elementRect, mousePos) {
                var newEvent = [$element, elementRect, mousePos];
                this.dragoverqueue.push(newEvent);
            },
            ProcessDragOverQueue: function ($element, elementRect, mousePos) {
                var processing = this.dragoverqueue.pop();
                this.dragoverqueue = [];
                if (processing && processing.length == 3) {
                    var $el = processing[0];
                    var elRect = processing[1];
                    var mousePos = processing[2];
                    this.OrchestrateDragDrop($el, elRect, mousePos);
                }

            },
            GetContextMarker: function () {
                var $contextMarker = $("<div data-dragcontext-marker><span data-dragcontext-marker-text></span></div>");
                return $contextMarker;
            },
            AddContainerContext: function ($element, position) {
                var $contextMarker = this.GetContextMarker();
                this.ClearContainerContext();
                if ($element.is("html,body")) {
                    position = "inside";
                    $element = Rexbuilder_Util_Admin_Editor.$frameBuilder
                        .contents()
                        .find("body");
                }
                switch (position) {
                    case "inside":
                        this.PositionContextMarker($contextMarker, $element);
                        if ($element.hasClass("stackhive-nodrop-zone"))
                            $contextMarker.addClass("invalid");
                        var name = this.getElementName($element);
                        $contextMarker.find("[data-dragcontext-marker-text]").html(name);
                        if (
                            Rexbuilder_Util_Admin_Editor.$frameBuilder
                                .contents()
                                .find("body [data-sh-parent-marker]").length != 0
                        ) {
                            Rexbuilder_Util_Admin_Editor.$frameBuilder
                                .contents()
                                .find("body [data-sh-parent-marker]")
                                .first()
                                .before($contextMarker);
                        } else {

                        }
                        break;
                    case "sibling":
                        this.PositionContextMarker($contextMarker, $element.parent());
                        if ($element.parent().hasClass("stackhive-nodrop-zone"))
                            $contextMarker.addClass("invalid");
                        var name = this.getElementName($element.parent());
                        $contextMarker.find("[data-dragcontext-marker-text]").html(name);
                        $contextMarker.attr("data-dragcontext-marker", name.toLowerCase());
                        if (
                            Rexbuilder_Util_Admin_Editor.$frameBuilder
                                .contents()
                                .find("body [data-sh-parent-marker]").length != 0
                        ) {

                            Rexbuilder_Util_Admin_Editor.$frameBuilder
                                .contents()
                                .find("body [data-sh-parent-marker]")
                                .first()
                                .before($contextMarker);
                        } else {

                        }
                        break;
                    default:
                        break;
                }
            },
            PositionContextMarker: function ($contextMarker, $element) {
                var rect = $element.get(0).getBoundingClientRect();
                $contextMarker.css({
                    height: rect.height + 4 + "px",
                    width: rect.width + 4 + "px",
                    top:
                        rect.top +
                        $frameContentWindow.scrollTop() -
                        2 +
                        "px",
                    left:
                        rect.left +
                        $frameContentWindow.scrollLeft() -
                        2 +
                        "px"
                });
                if (
                    rect.top +
                    Rexbuilder_Util_Admin_Editor.$frameBuilder
                        .contents()
                        .find("body")
                        .scrollTop() <
                    24
                )
                    $contextMarker
                        .find("[data-dragcontext-marker-text]")
                        .css("top", "0px");
            },
            ClearContainerContext: function () {
                Rexbuilder_Util_Admin_Editor.$frameBuilder
                    .contents()
                    .find("[data-dragcontext-marker]")
                    .remove();
            },
            getElementName: function ($element) {
                return $element.prop('tagName');
            }
        };
    };

	var _init = function () {
		var $self = $("#rex-elements-list");
		element_import_props = {
	      $self: $self,
	    };

	    _linkDraggable();
	};

	return {
	    init: _init,
	    // Functions that use Ajax calls
	    saveElementThumbnail: _saveElementThumbnail,
	    deleteElementThumbnail: _deleteElementThumbnail,
	    updateElementList: _updateElementList,

	 	//Element functions
	    deleteElement: _deleteElement,
	    editElementThumbnail: _editElementThumbnail,
	    updateElementThumbnail: _updateElementThumbnail,
	    resetElementThumbnail: _resetElementThumbnail
	};
})(jQuery);