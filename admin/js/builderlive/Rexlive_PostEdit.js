var Rexlive_PostEdit = (function ($) {
  'use strict';

  var liveMediaEditUploader;

  var _openMediaUploader = function( media_data ) {
    var multiple = false;

    if (liveMediaEditUploader) {
      // setting my custom data
      liveMediaEditUploader.state("live-media-edit").set("media_data", media_data);
      liveMediaEditUploader.state("live-media-edit").set("multiple", multiple);

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
          multiple: multiple,
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

    liveMediaEditUploader.on("select", function() {
      var state = liveMediaEditUploader.state("live-media-edit");
      var selection = state.get("selection");

      if (!selection) return;

      var g_data = liveMediaEditUploader.state("live-media-edit").get("media_data");
      var $gallery = g_data.$gallery;
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

      console.log(imgs);

      var data = {
        eventName: "rexlive:liveMediaEdit",
        data_to_send: {
          imgData: imgs,
          media_data: media_data
          // displayData: displayData
        }
      };

      // Launch image insert event to the iframe
      Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
    });

    //on close
    liveMediaEditUploader.on("close", function() {
      // var selection = liveMediaEditUploader
      //   .state("live-media-edit")
      //   .get("selection");

      // if (selection.models.length > 0) {
        // for(var j=0; j < selection.models.length; j++ ) {
        //   if( "undefined" !== typeof selection.models[j] ) {
        //     var attachment = wp.media.attachment(selection.models[j].attributes.id);
        //     attachment.fetch();
        //     // selection.remove(attachment ? [attachment] : []);
        //   }
        // }
      // }
      var data = {
        eventName: "rexlive:closeLiveMediaUploader",
      };

      // Launch image insert event to the iframe
      Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
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

    //now open the popup
    liveMediaEditUploader.open();
  };

  return {
    openMediaUploader: _openMediaUploader
  };
})(jQuery);