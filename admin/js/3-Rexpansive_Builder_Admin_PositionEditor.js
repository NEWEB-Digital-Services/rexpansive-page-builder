/**
 * Object that contains the Position Editor functionallyties
 */
var Rexpansive_Builder_Admin_PositionEditor = (function($) {
  'use strict';

  var $modal_wrap;
  var block_content_position_properties;

  /**
   * Private method to cache some values
   */
  var _cache_variables = function() {
    block_content_position_properties = {
      $trigger: $('#content-position-open-modal'),
      $modal: $('#block-modal-content-position'),
      $save_button: $('#block-set-content-position-save'),
      $cancel_button: $('#block-set-content-position-cancel'),
      $positions: $('#block-modal-content-position .content-position'),
    };

    $modal_wrap = block_content_position_properties.$modal.parent('.rex-modal-wrap');
  };

  /**
   * Private method to attach the event handlers
   */
  var _listen_events = function() {
    block_content_position_properties.$trigger.on('click', function () {
      var block_id = $('#editor-save').val(),
        saved = $(block_id).attr('data-block-custom-classes');

      block_content_position_properties.$positions.prop('checked', false);

      if (typeof saved != 'undefined' && saved != '') {
        var coordinates = saved.match(/rex-flex-(top|middle|bottom|left|center|right)/g);
        if (coordinates && coordinates.length > 0) {

          coordinates[0] = coordinates[0].replace('rex-flex-', '');
          coordinates[1] = coordinates[1].replace('rex-flex-', '');
          var filter = '[value=';
          if (coordinates[0].search(/(top|middle|bottom)/g) != -1) {
            filter += coordinates[0] + '-' + coordinates[1] + ']';
          } else {
            filter += coordinates[1] + '-' + coordinates[0] + ']';
          }
          block_content_position_properties.$positions.filter(filter).prop('checked', true);
        } else {
          block_content_position_properties.$positions.prop('checked', false);
        }
      }

      Rexpansive_Builder_Admin_TextEditor.$text_editor.addClass('push-down-modal');
      Rexlive_Modals_Utils.openModal($modal_wrap, true);
    });

    block_content_position_properties.$save_button.on('click', function () {
      var block_id = $('#editor-save').val(),
        saved = $(block_id).attr('data-block-custom-classes'),
        set = '',
        set_preview = '';

      if (typeof saved == 'undefined' || saved == '') {
        saved = '';
      }

      /* -- Setting Content Position -- */
      var flex_content_position = block_content_position_properties.$positions.filter(':checked').val();
      saved = saved.replace(/rex-flex-(top|middle|bottom|left|center|right)\s*/g, '');

      if (typeof flex_content_position != 'undefined' && flex_content_position !== '') {
        set_preview += 'element-content-positioned';
        var coordinates = flex_content_position.match(/(top|middle|bottom|left|center|right)/g);
        switch (coordinates[0]) {
          case 'top':
            set += ' rex-flex-top';
            set_preview += ' element-content-positioned-top';
            break;
          case 'middle':
            set += ' rex-flex-middle';
            set_preview += ' element-content-positioned-middle';
            break;
          case 'bottom':
            set += ' rex-flex-bottom';
            set_preview += ' element-content-positioned-bottom';
            break;
          default:
            break;
        }
        switch (coordinates[1]) {
          case 'left':
            set += ' rex-flex-left';
            set_preview += ' element-content-positioned-left';
            break;
          case 'center':
            set += ' rex-flex-center';
            set_preview += ' element-content-positioned-center';
            break;
          case 'right':
            set += ' rex-flex-right';
            set_preview += ' element-content-positioned-right';
            break;
          default:
            break;
        }
      }

      saved = saved + ' ' + set.trim();
      $(block_id).attr('data-block-custom-classes', saved.trim());
      $(block_id)
        .find('.element-preview-wrap')
        .removeClass('element-content-positioned-top element-content-positioned-middle element-content-positioned-bottom element-content-positioned-left element-content-positioned-center element-content-positioned-right')
        .addClass(set_preview);

      Rexpansive_Builder_Admin_TextEditor.$text_editor.removeClass('push-down-modal');
      Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap, true);
    });

    block_content_position_properties.$cancel_button.on('click', function () {
      Rexpansive_Builder_Admin_TextEditor.$text_editor.removeClass('push-down-modal');
      Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap, true);
    });
  };

  var init = function() {
    _cache_variables();
    _listen_events();
    this.$modal_wrap = $modal_wrap;
  };

  return {
    init: init,
  };
    
  })(jQuery);