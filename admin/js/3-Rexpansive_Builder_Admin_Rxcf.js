/**
 * Contact Form Shortcode Editor panel
 */
var Rexpansive_Builder_Admin_Rxcf = (function($) {
  'use strict';

  var $panel;
  var $editor;
  var $copy;
  var $save;
  var $cancel;
  var $modal_wrap;

  var _cache_vars = function() {
    $panel = $('#rex-rxcf-editor');
    $modal_wrap = $panel.parent();
    $editor = $panel.find('#rex-rxcf-editor_input');
    $copy = $panel.find('.rex-rxcf-editor_copy');
    $save = $panel.find('.rex-save-button');
    $cancel = $panel.find('.rex-cancel-button');
  };

  var _listen_events = function() {
    $(document).on('click', '.rxcf7-get_shortcode', function(e) {
      e.preventDefault();

      // open editor
      Rexpansive_Builder_Admin_Modals.OpenModal($modal_wrap);
      $panel.addClass('rex-modal--loading');
      $editor.val('');
      
      var cf = {
        id: $(this).attr('data-cfid'),
      };
      
      $save.val(cf.id);

      // ajax call to retrieve the shortcode
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: rexajax.ajaxurl,
        data: {
          action: 'rex_get_rxcf',
          nonce_param: rexajax.rexnonce,
          cf_data: cf
        },
        success: function (response) {
          if (response.success) {
            $editor.val(response.data.shortcode);
          }
        },
        complete: function(response) {
          $panel.removeClass('rex-modal--loading');
        }
      });
    });

    $save.on('click', function(e) {
      var cf = {
        id: $(this).val(),
        shortcode: $editor.val()
      };

      if( "" != cf.shortcode ) {
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: rexajax.ajaxurl,
          data: {
            action: 'rex_save_rxcf',
            nonce_param: rexajax.rexnonce,
            cf_data: cf
          },
          success: function (response) {
            if (response.success) {
              // $editor.val(response.data.shortcode);
              console.log(response);
            }
          },
          complete: function(response) {
            $panel.removeClass('rex-modal--loading');
            Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
          }
        });
      } else {
        Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
      }
    });

    $cancel.on('click', function(e) {
      Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
    });

    $copy.on('click', function(e) {
      e.preventDefault();
      $editor.select();
      document.execCommand('copy');
    });
  };

  var init = function() {
    _cache_vars();
    _listen_events();
  };

  return {
    init: init,
  }

})(jQuery);