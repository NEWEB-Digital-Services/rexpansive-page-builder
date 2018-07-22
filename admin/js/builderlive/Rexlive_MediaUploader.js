/**
 * Object that contains the image media uploader
 */
var Rexlive_MediaUploader = (function($) {
  'use strict';

  var image_uploader_frame;

  function openMediaUploader( info ) {
    // If the frame is already opened, return it
    if (image_uploader_frame) {
      image_uploader_frame.open();
      return;
    }

    //create a new Library, base on defaults
    //you can put your attributes in
    var insertImage = wp.media.controller.Library.extend({
      defaults: _.defaults({
        id: 'insert-image',
        title: 'Insert Image',
        allowLocalEdits: true,
        displaySettings: true,
        displayUserSettings: true,
        multiple: true,
        library: wp.media.query({ type: 'image' }),
        type: 'image'//audio, video, application/pdf, ... etc
      }, wp.media.controller.Library.prototype.defaults)
    });

    //Setup media frame
    image_uploader_frame = wp.media({
      button: { text: 'Select' },
      state: 'insert-image',
      states: [
        new insertImage()
      ]
    });

    //on close, if there is no select files, remove all the files already selected in your main frame
    image_uploader_frame.on('close', function () {
      var selection = image_uploader_frame.state('insert-image').get('selection');
      selection.each(function (image) {
        if( 'undefined' !== typeof image ) {
          var attachment = wp.media.attachment(image.attributes.id);
          attachment.fetch();
          selection.remove(attachment ? [attachment] : []);
        }
      });
    });


    image_uploader_frame.on('select', function () {
      var state = image_uploader_frame.state('insert-image');
      var selection = state.get('selection');
      var data = {
        eventName: 'rexlive:insert_image',
        data_to_send: {
          info: info,
          media: []
        }
      };

      if (!selection) return;

      //to get right side attachment UI info, such as: size and alignments
      //org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
      selection.each(function (attachment) {
        var display = state.display(attachment).toJSON();
        var obj_attachment = attachment.toJSON();

        // If captions are disabled, clear the caption.
        if (!wp.media.view.settings.captions)
          delete obj_attachment.caption;
        
        display = wp.media.string.props(display, obj_attachment);

        var to_send = {
          media_info: obj_attachment,
          display_info: display
        };
        
        data.data_to_send.media.push(to_send);
      });
      
      // Launch image insert event to the iframe
      Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
    });

    //reset selection in popup, when open the popup
    image_uploader_frame.on('open', function () {
      var selection = image_uploader_frame.state('insert-image').get('selection');
      //remove all the selection first
      selection.each(function (image) {
        if( 'undefined' !== typeof image ) {
          var attachment = wp.media.attachment(image.attributes.id);
          attachment.fetch();
          selection.remove(attachment ? [attachment] : []);
        }
      });
    });

    //now open the popup
    image_uploader_frame.open();
  }	// openMediaUploader END
  
  return {
    openMediaUploader: openMediaUploader
  };
  
})(jQuery);