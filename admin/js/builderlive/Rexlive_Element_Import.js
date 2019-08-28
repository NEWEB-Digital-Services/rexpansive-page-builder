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
		            );
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
		    action: "rex_save_element_thumbnail",//da fare
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
	* @param element_selected
	* @return {null} 
	* @since  x.x.x
	*/
	var _deleteElementThumbnail = function(element_to_delete) {
		$.ajax({
		  type: "GET",
		  dataType: "json",
		  url: live_editor_obj.ajaxurl,
		  data: {
		    action: "rex_delete_element_thumbnail",//da fare
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
    /// OTHER FUNCTIONS
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
		  var response = confirm( live_editor_obj.labels.elements.confirm_delete );
		  if ( response ) {
		    // prepare data to ajax request
		    var data = {
		      action: "rex_delete_element",
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

	var _init = function () {
		var $self = $("#rex-elements-list");
		element_import_props = {
	      $self: $self,
	    };
	};

	return {
	    init: _init,
	    // FUNCTIONS THAT USE AJAX CALLS
	    saveElementThumbnail: _saveElementThumbnail,
	    deleteElementThumbnail: _deleteElementThumbnail,

	 	//OTHER FUNCTIONS
	    updateElementList: _updateElementList,
	    deleteElement: _deleteElement,
	    editElementThumbnail: _editElementThumbnail,
	    updateElementThumbnail: _updateElementThumbnail,
	    resetElementThumbnail: _resetElementThumbnail
	};
})(jQuery);