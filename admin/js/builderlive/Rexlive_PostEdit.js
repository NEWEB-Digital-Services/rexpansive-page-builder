var Rexlive_PostEdit = (function ($) {
  'use strict';

  var liveMediaEditUploader;

  var _openMediaUploader = function( media_data ) {

    if (liveMediaEditUploader) {
      // setting my custom data
      liveMediaEditUploader.state("live-media-edit").set("media_data", media_data);
      
      liveMediaEditUploader.open();
      return;
    }

    //create a new Library, base on defaults
    //you can put your attributes in
    var postEditLiveMedia = wp.media.controller.Library.extend({
      defaults: _.defaults(
        {
          id: "live-media-edit",
          title: "Edit Media",
          allowLocalEdits: true,
          displaySettings: true,
          displayUserSettings: true,
          multiple: false,
          library: wp.media.query({ type: "image" }),
          type: "image", //audio, video, application/pdf, ... etc,
          media_data: media_data
        },
        wp.media.controller.Library.prototype.defaults
      )
    });

    //Setup media frame
    liveMediaEditUploader = wp.media({
      button: { text: "Select" },
      state: "live-media-edit",
      states: [new postEditLiveMedia()]
    });

    //reset selection in popup, when open the popup
    liveMediaEditUploader.on("open", function() {
      var attachment;
      var selection = liveMediaEditUploader
        .state("live-media-edit")
        .get("selection");

      //remove all the selection first
      selection.each(function(image) {
        if( "undefined" !== typeof image ) {
          attachment = wp.media.attachment(image.attributes.id);
          attachment.fetch();
          selection.remove(attachment ? [attachment] : []);
        }
      });

      var g_data = liveMediaEditUploader.state("live-media-edit").get("media_data");
      // Check the already inserted image
      if ( 'undefined' !== typeof g_data.mediaId && '' !== g_data.mediaId ) {
        attachment = wp.media.attachment(g_data.mediaId);
        attachment.fetch();

        selection.add(attachment ? [attachment] : []);
      }
    });

    liveMediaEditUploader.on("select", function() {
      var state = liveMediaEditUploader.state("live-media-edit");
      var selection = state.get("selection");

      if (!selection) return;

      var g_data = state.get("media_data");
      var action = g_data.action;
      var imgs = [];

      selection.each(function(attachment) {
        var display = state.display(attachment).toJSON();
        var media_info = attachment.toJSON();
        // If captions are disabled, clear the caption.
        if (!wp.media.view.settings.captions) delete media_info.caption;
        var display_info = wp.media.string.props(display, media_info);
        imgs.push({
          media_info:media_info,
          display_info:display_info
        });
      });

      var eventName = '';
      switch( action ) {
        case 'add':
          eventName = 'rexlive:liveMediaAdd';
          break;
        case 'edit':
          eventName = 'rexlive:liveMediaEdit';
          break;
        default:
          break;
      };

      var data = {
        eventName: eventName,
        data_to_send: {
          imgData: imgs,
          media_data: g_data
          // displayData: displayData
        }
      };

      // Launch image insert event to the iframe
      Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
    });

    //on close
    liveMediaEditUploader.on("close", function() {
      // var data = {
      //   eventName: "rexlive:closeLiveMediaUploader",
      // };

      // // Launch image insert event to the iframe
      // Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
    });

    //now open the popup
    liveMediaEditUploader.open();
  };

  return {
    openMediaUploader: _openMediaUploader
  };
})(jQuery);