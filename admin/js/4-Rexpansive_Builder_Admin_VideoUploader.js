var Rexpansive_Builder_Admin_VideoUploader = (function($) {
  'use strict';

  var video_uploader_frame;

  function uploadVideoBlock() {
    // If the frame is already opened, return it
    if (video_uploader_frame) {
      video_uploader_frame.open();
      return;
    }

    //create a new Library, base on defaults
    //you can put your attributes in
    var insertVideo = wp.media.controller.Library.extend({
      defaults: _.defaults({
        id: 'insert-video',
        title: 'Insert Video',
        allowLocalEdits: true,
        displaySettings: true,
        displayUserSettings: true,
        multiple: true,
        library: wp.media.query({ type: 'video' }),
        type: 'video'//audio, video, application/pdf, ... etc
      }, wp.media.controller.Library.prototype.defaults)
    });

    //Setup media frame
    video_uploader_frame = wp.media({
      button: { text: 'Select' },
      state: 'insert-video',
      states: [
        new insertVideo()
      ]
    });

    //on close, if there is no select files, remove all the files already selected in your main frame
    video_uploader_frame.on('close', function () {
      var selection = video_uploader_frame.state('insert-video').get('selection');
      /*if(selection.length == 0) {
        video_modal_properties.$video_mp4_id.val('');
      }
      background_modal_properties.$video_mp4.prop('checked', false);
      if(!selection.length){
        console.log(selection);
        video_modal_properties.$video_mp4.prop('checked', false);
      }*/
      // video_modal_properties.$video_mp4_id.val('');
      // video_modal_properties.$video_mp4.prop('checked', false);
      Rexpansive_Builder_Admin_VideoEditor.reset_editor_mp4();
    });


    video_uploader_frame.on('select', function () {
      var state = video_uploader_frame.state('insert-video');
      var selection = state.get('selection');
      var imageArray = [];

      if (!selection) {
        return;
      }

      //to get right side attachment UI info, such as: size and alignments
      //org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
      selection.each(function (attachment) {
        var display = state.display(attachment).toJSON();
        var obj_attachment = attachment.toJSON();
        var caption = obj_attachment.caption, options, html;

        // If captions are disabled, clear the caption.
        if (!wp.media.view.settings.captions)
          delete obj_attachment.caption;

        display = wp.media.string.props(display, obj_attachment);

        options = {
          id: obj_attachment.id,
          post_content: obj_attachment.description,
          post_excerpt: caption
        };

        if (display.linkUrl)
          options.url = display.linkUrl;

        if ('video' === obj_attachment.type) {
          var img_prev_src;
          img_prev_src = obj_attachment.url;

          var bg_setts = {
            color: '',
            image: '',
            url: '',
            bg_img_type: 'full',
            image_size: '',
            block_custom_class: '',
            block_padding: '',
            photoswipe: '',
            linkurl: '',
            video: obj_attachment.id,
            youtube: '',
            overlay_block_color: '',
          };
          html = '<li id="block_' + Rexpansive_Builder_Admin_Config.global_section_reference.sectIndex + '_' + Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex + '" class="video with-border item z-depth-1 hoverable svg-ripple-effect" data-block_type="video" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'' + JSON.stringify(bg_setts) + '\' data-video-has-audio="1">' +
          Rexpansive_Builder_Admin_Templates.templates.element_actions +
            '<div class="element-data">' +
            '<textarea class="data-text-content" display="none"></textarea>' +
            '</div>' +
            '<div class="element-preview-wrap">' +
            '<div class="element-preview">' +
            '<div class="backend-image-preview" data-image_id="' + obj_attachment.id + '"></div>' +
            '</div>' +
            '</div>' +
            Rexpansive_Builder_Admin_Templates.templates.notice_video +
            '</li>';
        } else if ('image' === obj_attachment.type) {
          html = wp.media.string.video(display, obj_attachment);
        } else if ('audio' === obj_attachment.type) {
          html = wp.media.string.audio(display, obj_attachment);
        } else {
          html = wp.media.string.link(display);
          options.post_title = display.title;
        }

        //attach info to attachment.attributes object
        attachment.attributes['nonce'] = wp.media.view.settings.nonce.sendToEditor;
        attachment.attributes['attachment'] = options;
        attachment.attributes['html'] = html;
        attachment.attributes['post_id'] = wp.media.view.settings.post.id;

        Rexpansive_Builder_Admin_Config.global_section_reference.gridRef.add_widget(attachment.attributes['html'], 2, 2);
        Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#block_' + Rexpansive_Builder_Admin_Config.global_section_reference.sectIndex + '_' + Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex));
        Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex++;
        Rexpansive_Builder_Admin_Utilities.launchTooltips();
      });
      Rexpansive_Builder_Admin_Modals.CloseModal(Rexpansive_Builder_Admin_VideoEditor.$modal_wrap);
      $(document).trigger('sectionCollectData', Rexpansive_Builder_Admin_Config.global_section_reference);
    });

    //reset selection in popup, when open the popup
    video_uploader_frame.on('open', function () {
      var selection = video_uploader_frame.state('insert-video').get('selection');

      //remove all the selection first
      selection.each(function (image) {
        var attachment = wp.media.attachment(image.attributes.id);
        attachment.fetch();
        selection.remove(attachment ? [attachment] : []);
      });
    });

    //now open the popup
    video_uploader_frame.open();
  }	// uploadVideoBlock END

  return {
    uploadVideoBlock: uploadVideoBlock
  };

})(jQuery);