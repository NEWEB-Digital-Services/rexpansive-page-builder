/**
 * Object that contains the image media uploader
 */
var Rexpansive_Builder_Admin_MediaUploader = (function($) {
  'use strict';

  var image_uploader_frame;

  function RenderMediaUploader() {
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
      if (!selection.length) {
      }
    });


    image_uploader_frame.on('select', function () {
      var state = image_uploader_frame.state('insert-image');
      var selection = state.get('selection');
      var imageArray = [];

      if (!selection) return;

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

        if ('image' === obj_attachment.type) {
          var img_prev_src;
          img_prev_src = display.src;

          var bg_img_type;
          switch (Rexpansive_Builder_Admin_Config.global_section_reference.sectionRef.attr('data-layout')) {
            case 'masonry':
              bg_img_type = 'natural';
              break;
            case 'full':
            default:
              bg_img_type = 'full';
              break;
          }

          var photoswipe;
          switch (Rexpansive_Builder_Admin_Config.global_section_reference.sectionRef.attr('data-section-active-photoswipe')) {
            case '1':
              photoswipe = "true";
              break;
            case '0':
            default:
              photoswipe = '';
              break;
          }

          var bg_setts = {
            color: '',
            image: obj_attachment.id,
            url: obj_attachment.url,
            image_size: display.size,
            bg_img_type: bg_img_type,
            photoswipe: photoswipe,
            linkurl: '',
            block_custom_class: '',
            block_padding: '',
            video: '',
            youtube: '',
            overlay_block_color: '',
          };
          var new_block_id = 'block_' + Rexpansive_Builder_Admin_Config.global_section_reference.sectIndex + '_' + Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex;
          var html = Rexpansive_Builder_Admin_Templates.templates.image
            .replace(/\bdata.textid\b/, new_block_id)
            .replace(/\bdata.bgblocksetts\b/, JSON.stringify(bg_setts))
            .replace(/\bdata.elementactionsplaceholder\b/, Rexpansive_Builder_Admin_Templates.templates.element_actions)
            .replace(/\bdata.imgprevsrc\b/, img_prev_src)
            .replace(/\bdata.attachmentid\b/, obj_attachment.id);

          if (bg_img_type == 'natural') {
            html = html.replace(/\bdata.isnaturalimage\b/, 'block-is-natural');
          } else {
            html = html.replace(/\bdata.isnaturalimage\b/, '');
          }

          /*html = '<li id="block_' + global_section_reference.sectIndex + '_' + global_section_reference.internalIndex + '" class="image item no-border z-depth-1 hoverable svg-ripple-effect" data-block_type="image" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'' + JSON.stringify( bg_setts ) + '\'>' +
                element_actions +
                '<div class="element-data">' +
                  '<textarea class="data-text-content" display="none"></textarea>' +
                '</div>' +
                '<div class="element-preview" style="background-image:url(' + img_prev_src + ');">' +
                  '<div class="backend-image-preview" data-image_id="'+ obj_attachment.id + '"></div>' +
                '</div>' +
              '</li>';*/
        } else if ('video' === obj_attachment.type) {
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
        Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#' + new_block_id));
        Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex++;
        Rexpansive_Builder_Admin_Utilities.launchTooltips();
      });
      $(document).trigger('sectionCollectData', Rexpansive_Builder_Admin_Config.global_section_reference);
    });

    //reset selection in popup, when open the popup
    image_uploader_frame.on('open', function () {
      var selection = image_uploader_frame.state('insert-image').get('selection');

      //remove all the selection first
      selection.each(function (image) {
        var attachment = wp.media.attachment(image.attributes.id);
        attachment.fetch();
        selection.remove(attachment ? [attachment] : []);
      });
    });

    //now open the popup
    image_uploader_frame.open();
  }	// RenderMediaUploader END

  return {
    RenderMediaUploader: RenderMediaUploader
  };

})(jQuery);