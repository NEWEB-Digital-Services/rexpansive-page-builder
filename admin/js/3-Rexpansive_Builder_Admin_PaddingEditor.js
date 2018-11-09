/**
 * Object that contains the Padding Editor functionallyties
 */
var Rexpansive_Builder_Admin_PaddingEditor = (function($) {
  'use strict';

  var $modal_wrap;
  var block_content_padding_properties;

  /**
   * Private method to cache some values
   */
  var _cache_variables = function() {
    block_content_padding_properties = {
      $trigger: $('#content-padding-open-modal'),
      $modal: $('#block-modal-content-padding'),
      $block_padding_top: $('#block-padding-top'),
      $block_padding_right: $('#block-padding-right'),
      $block_padding_bottom: $('#block-padding-bottom'),
      $block_padding_left: $('#block-padding-left'),
      $block_padding_type_pixel: $('.block-padding-type[value=pixel]'),
      $block_padding_type_percentage: $('.block-padding-type[value=percentage]'),
      $save_button: $('#block-set-content-padding-save'),
      $cancel_button: $('#block-set-content-padding-cancel')
    };

    $modal_wrap = block_content_padding_properties.$modal.parent('.rex-modal-wrap');
  };

  /**
   * Private method to attach the event handlers
   */
  var _listen_events = function() {
    block_content_padding_properties.$trigger.on('click', function () {
      var block_id = $('#editor-save').val(),
        saved = $(block_id).attr('data-content-padding');

      /* ------------ Content Padding Handle ---------------------- */
      if (typeof saved != 'undefined' && '' != saved) {
        var paddings = saved.split(';');
        if (paddings.length > 1) {
          block_content_padding_properties.$block_padding_top.val(paddings[0].replace(/[\D]+/g, ''));
          block_content_padding_properties.$block_padding_right.val(paddings[1].replace(/[\D]+/g, ''));
          block_content_padding_properties.$block_padding_bottom.val(paddings[2].replace(/[\D]+/g, ''));
          block_content_padding_properties.$block_padding_left.val(paddings[3].replace(/[\D]+/g, ''));
        } else {
          block_content_padding_properties.$block_padding_top.val(paddings[0].replace(/[\D]+/g, ''));
          block_content_padding_properties.$block_padding_right.val(paddings[0].replace(/[\D]+/g, ''));
          block_content_padding_properties.$block_padding_bottom.val(paddings[0].replace(/[\D]+/g, ''));
          block_content_padding_properties.$block_padding_left.val(paddings[0].replace(/[\D]+/g, ''));
        }
        var width_type = paddings[0].match(/[\D]+/g)[0];
        switch (width_type) {
          case 'px':
            block_content_padding_properties.$block_padding_type_pixel.prop('checked', true);
            break;
          case '%':
            block_content_padding_properties.$block_padding_type_percentage.prop('checked', true);
            break;
          default:
            break;
        }
      } else {
        block_content_padding_properties.$block_padding_top.val('5');
        block_content_padding_properties.$block_padding_right.val('5');
        block_content_padding_properties.$block_padding_bottom.val('5');
        block_content_padding_properties.$block_padding_left.val('5');
        block_content_padding_properties.$block_padding_type_pixel.prop('checked', true);
      }

      // $text_editor.addClass('push-down-modal');
      Rexpansive_Builder_Admin_Modals.OpenModal($modal_wrap, true);
    });

    block_content_padding_properties.$save_button.on('click', function () {
      var block_id = $('#editor-save').val(),
        block_padding = '',
        padding_type = $('.block-padding-type:checked').val(),
        padding_unit_measure = '';

      switch (padding_type) {
        case 'percentage':
          padding_unit_measure = '%;';
          break;
        case 'pixel':
          padding_unit_measure = 'px;';
          break;
        default:
          break;
      }

      var pt = block_content_padding_properties.$block_padding_top.val();
      var pr = block_content_padding_properties.$block_padding_right.val();
      var pb = block_content_padding_properties.$block_padding_bottom.val();
      var pl = block_content_padding_properties.$block_padding_left.val();

      if (typeof pt != 'undefined' && pt != '' && pt.search(/[\d]+/g) !== -1) {
        block_padding += pt + padding_unit_measure;
      } else {
        block_padding += '0' + padding_unit_measure;
      }

      if (typeof pr != 'undefined' && pr != '' && pr.search(/[\d]+/g) !== -1) {
        block_padding += pr + padding_unit_measure;
      } else {
        block_padding += '0' + padding_unit_measure;
      }

      if (typeof pb != 'undefined' && pb != '' && pb.search(/[\d]+/g) !== -1) {
        block_padding += pb + padding_unit_measure;
      } else {
        block_padding += '0' + padding_unit_measure;
      }

      if (typeof pl != 'undefined' && pl != '' && pl.search(/[\d]+/g) !== -1) {
        block_padding += pl + padding_unit_measure;
      } else {
        block_padding += '0' + padding_unit_measure;
      }

      $(block_id).attr('data-content-padding', block_padding);

      // $text_editor.removeClass('push-down-modal');
      // block_content_padding_properties.$modal.hide();
      Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap, true);
    });

    block_content_padding_properties.$cancel_button.on('click', function () {
      // $text_editor.removeClass('push-down-modal');
      // block_content_padding_properties.$modal.hide();
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