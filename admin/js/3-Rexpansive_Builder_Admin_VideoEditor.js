/**
 * Object that contains the TextEditor definition
 */
var Rexpansive_Builder_Admin_VideoEditor = (function($) {
    'use strict';

    var video_modal_properties;
    var $modal_wrap;

    var _listen_events = function() {
      video_modal_properties.$save_button.on('click', function () {
        var bg_setts = {
          color: '',
          image: '',
          url: '',
          bg_img_type: 'full',
          linkurl: '',
          video: '',
          youtube: video_modal_properties.$video_youtube_url.val(),
          vimeo: video_modal_properties.$video_vimeo_url.val()
        };

        if (video_modal_properties.$video_youtube_url.val() != '') {
          var html = '<li id="block_' + Rexpansive_Builder_Admin_Config.global_section_reference.sectIndex + '_' + Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex + '" class="video with-border item z-depth-1 hoverable svg-ripple-effect" data-block_type="video" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'' + JSON.stringify(bg_setts) + '\' data-video-has-audio="1">' +
            Rexpansive_Builder_Admin_Templates.templates.element_actions +
            '<div class="element-data">' +
            '<textarea class="data-text-content" display="none"></textarea>' +
            '</div>' +
            '<div class="element-preview-wrap">' +
            '<div class="element-preview">' +
            '<div class="backend-image-preview" data-image_id=""></div>' +
            '</div>' +
            '</div>' +
            Rexpansive_Builder_Admin_Templates.templates.notice_video +
            '</li>';

          Rexpansive_Builder_Admin_Config.global_section_reference.gridRef.add_widget(html, 2, 2);
          Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#block_' + Rexpansive_Builder_Admin_Config.global_section_reference.sectIndex + '_' + Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex));
          Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex++;
        } else if (video_modal_properties.$video_vimeo_url.val() != '') {
          var html = '<li id="block_' + Rexpansive_Builder_Admin_Config.global_section_reference.sectIndex + '_' + Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex + '" class="video with-border item z-depth-1 hoverable svg-ripple-effect" data-block_type="video" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'' + JSON.stringify(bg_setts) + '\' data-video-has-audio="1">' +
          Rexpansive_Builder_Admin_Templates.templates.element_actions +
            '<div class="element-data">' +
            '<textarea class="data-text-content" display="none"></textarea>' +
            '</div>' +
            '<div class="element-preview-wrap">' +
            '<div class="element-preview">' +
            '<div class="backend-image-preview" data-image_id=""></div>' +
            '</div>' +
            '</div>' +
            Rexpansive_Builder_Admin_Templates.templates.notice_video +
            '</li>';

          Rexpansive_Builder_Admin_Config.global_section_reference.gridRef.add_widget(html, 2, 2);
          Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#block_' + Rexpansive_Builder_Admin_Config.global_section_reference.sectIndex + '_' + Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex));
          Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex++;
        }

        Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
      });

      video_modal_properties.$cancel_button.on('click', function () {
        Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
      });

      video_modal_properties.$video_upload.on('click', function () {
        Rexpansive_Builder_Admin_VideoUploader.uploadVideoBlock();
      });

      // Live activation/deactivation of radio button on url insertion/delete
      video_modal_properties.$video_youtube_url.on('change keyup paste', function () {
        if ($(this).val() != '') {
          video_modal_properties.$video_youtube.prop('checked', true);
        } else {
          video_modal_properties.$video_youtube.prop('checked', false);
        }
      });

      video_modal_properties.$video_vimeo_url.on('change keyup paste', function () {
        if ($(this).val() != '') {
          video_modal_properties.$video_vimeo.prop('checked', true);
        } else {
          video_modal_properties.$video_vimeo.prop('checked', false);
        }
      });
    };

    var _cache_variables = function() {
      video_modal_properties = {
        $modal: $('#rex-video-block'),
        $modal_wrap: null,
        $video_choose: $('.rex-choose-video'),
        $video_upload: $('#rex-upload-mp4'),
        $video_mp4: $('#rex-choose-mp4'),
        $video_mp4_id: $('#rex-mp4-id'),
        $video_youtube: $('#rex-choose-youtube'),
        $video_youtube_url: $('#rex-youtube-url'),
        $video_youtube_label: $('#rex-youtube-url-label'),
        $video_vimeo: $('#rex-choose-vimeo'),
        $video_vimeo_url: $('#rex-vimeo-url'),
        $video_vimeo_label: $('#rex-vimeo-url-label'),
        $save_button: $('#rex-video-block-save'),
        $cancel_button: $('#rex-video-block-cancel'),
      };

      $modal_wrap = video_modal_properties.$modal.parent('.rex-modal-wrap');
    };

    var reset_editor = function() {
      video_modal_properties.$video_choose.prop('checked', false);
      video_modal_properties.$video_mp4_id.val('');
      video_modal_properties.$video_youtube_url.val('');
      video_modal_properties.$video_youtube_label.removeClass('active');
      video_modal_properties.$video_vimeo_url.val('');
      video_modal_properties.$video_vimeo_label.removeClass('active');
    };

    var reset_editor_mp4 = function() {
      video_modal_properties.$video_mp4_id.val('');
      video_modal_properties.$video_mp4.prop('checked', false);
    };

    var init = function() {
      _cache_variables();
      _listen_events();

      this.$modal_wrap = $modal_wrap;
    };

    return {
      init: init,
      reset_editor: reset_editor,
      reset_editor_mp4: reset_editor_mp4
    };

  })(jQuery);
