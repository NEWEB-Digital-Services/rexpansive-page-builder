/**
 * Object that contains the Model Editor functionallyties
 * @since 1.1.2
 */
var Rexpansive_Builder_Admin_ModelEditor = (function($) {
  'use strict';

  var $modal_wrap;
  var rexmodel_modal_props;
  var model_created;

  /**
   * Private method to cache some values
   */
  var _cache_variables = function() {
    rexmodel_modal_props = {
      $modal: $('#rex-model-block'),
      $cancel_button: null,
      $save_button: null,
      $model_name: null,
      $add_new_model: null,
      $model_import: null,
      $model_preview: null,
    };

    $modal_wrap = rexmodel_modal_props.$modal.parent('.rex-modal-wrap');

    rexmodel_modal_props.$cancel_button = rexmodel_modal_props.$modal.find('.rex-cancel-button');
    rexmodel_modal_props.$save_button = rexmodel_modal_props.$modal.find('.rex-save-button');
    rexmodel_modal_props.$model_name = rexmodel_modal_props.$modal.find('#rex-model__name');
    rexmodel_modal_props.$add_new_model = rexmodel_modal_props.$modal.find('#rex-model__add-new-model');
    rexmodel_modal_props.$model_preview = rexmodel_modal_props.$modal.find('#rex-model__open-preview');

    rexmodel_modal_props.$model_import = rexmodel_modal_props.$modal.find('#rex-model__import');

    model_created = false;
  };

  /**
   * Private method to attach the event handlers
   */
  var _listen_events = function() {
    $(document).on('click', '.builder-model', function (e) {
      e.preventDefault();
      e.stopPropagation();
      model_created = false;

      var $container_row = $(this).parents('.builder-row');
      rexmodel_modal_props.$save_button.val( $container_row.attr('data-count') );

      rexmodel_modal_props.$model_name.val('');
      rexmodel_modal_props.$model_import.find('option[value=0]').prop('selected',true);

      if('undefined' != typeof $container_row.attr('data-section-model') && '' != $container_row.attr('data-section-model') ) {
        rexmodel_modal_props.$model_import.find('option[value='+$container_row.attr('data-section-model')+']').prop('selected',true);
      }
      Rexpansive_Builder_Admin_Modals.OpenModal($modal_wrap);
    });

    rexmodel_modal_props.$model_name.on('focusout', function(e) {
      e.preventDefault();
      rexmodel_modal_props.$model_name.parent().removeClass('input-active');
    });
    
    rexmodel_modal_props.$model_name.on('focusin', function(e) {
      e.preventDefault();
      rexmodel_modal_props.$model_name.parent().addClass('input-active');
    });

    rexmodel_modal_props.$save_button.on('click', function () {
      var model_id = rexmodel_modal_props.$model_import.val();
      if(model_id != '' && model_id != '0' && !model_created) {

        rexmodel_modal_props.$modal.addClass('rex-modal--loading');

        var model = {
          ID: model_id,
          section_id: rexmodel_modal_props.$save_button.val(),
        };

        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: rexajax.ajaxurl,
          data: {
            action: 'rex_get_model',
            nonce_param: rexajax.rexnonce,
            model_data: model
          },
          success: function (response) {
            if (response.success) {
              
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-dimension', response.data.info.dimension);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-layout', response.data.info.layout);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-section-active-photoswipe', response.data.info.row_active_photoswipe);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-row-separator-top', response.data.info.row_separator_top);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-row-separator-bottom', response.data.info.row_separator_bottom);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-row-separator-left', response.data.info.row_separator_left);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-row-separator-right', response.data.info.row_separator_right);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-backresponsive', JSON.stringify(response.data.info.section_bg_responsive));
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-gridproperties', JSON.stringify(response.data.info.section_bg_settings));
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-data-sectionid', response.data.info.section_name);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-section-overlay-color', response.data.info.section_overlay_color);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.attr('data-section-model', response.data.info.section_model);

              for(var prop in response.data.info.section_bg_style) {
                Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.find('.gridster ul').css(prop,response.data.info.section_bg_style[prop]);
              }
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.find('.background_section_preview').attr('style',response.data.info.section_bg_button_preview_style);
              Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.find('.builder-edit-row-dimension[value='+response.data.info.dimension+']').prop('checked','true');
              
              if(response.data.info.section_has_overlay == true) {
                Rexpansive_Builder_Admin_Config.collect[model.section_id].sectionRef.find('.section-visual-info').addClass('active-section-visual-info').attr('style',response.data.info.section_overlay_style);
              }

              Rexpansive_Builder_Admin_Config.collect[model.section_id].gridRef.remove_all_widgets();

              if( response.data.info.tml ) {
                for(var b=0; b<response.data.info.tmpl.length;b++) {
                  Rexpansive_Builder_Admin_Config.collect[model.section_id].gridRef.add_widget(response.data.info.tmpl[b].html, parseInt( response.data.info.tmpl[b].w ), parseInt( response.data.info.tmpl[b].h ), parseInt( response.data.info.tmpl[b].col ), parseInt( response.data.info.tmpl[b].row ) );
                  Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#' + response.data.info.tmpl[b].id));
                  Rexpansive_Builder_Admin_Config.collect[model.section_id].internalIndex++;
                }
              }
              
              Rexpansive_Builder_Admin_Utilities.launchTooltips();
              // Rexpansive_Builder_Admin_Config.$builderArea.find('.builder-row[data-count='+model.section_id+']').after(response.data.tmpl).remove();
              // Rexpansive_Builder_Admin_Config.$builderArea.append(response.data.tmpl);
            }
          },
          error: function(response) {
          },
          complete: function(response) {
            rexmodel_modal_props.$modal.removeClass('rex-modal--loading');
            Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
          }
        });
      } else {
        Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
      }
    });

    rexmodel_modal_props.$cancel_button.on('click', function () {
      model_created = false;
      Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
    });

    rexmodel_modal_props.$add_new_model.on('click', function() {
      if(rexmodel_modal_props.$model_name.val() != '') {
        rexmodel_modal_props.$modal.addClass('rex-modal--loading');

        var model_name = rexmodel_modal_props.$model_name.val();
        var model = {
          'post_title': model_name,
          'post_content': ''
        };

        var section_id = rexmodel_modal_props.$save_button.val();

        var block_data = Rexpansive_Builder_Admin_Config.collect[section_id].gridRef.serialize();
        var blocks = '';

        for(var i=0;i<block_data.length;i++) {
          blocks += block_data[i].content;
        }

        var sectionBackground = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-gridproperties');
        var sectionDimension = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-griddimension');
        var sectionLayout = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-layout');
        var sectionIdentifiers = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-sectionid');
        var sectionOverlayColor = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-section-overlay-color');
        var sectionBackgroundResponsive = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-backresponsive');

        var sectionSeparatorTop = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-row-separator-top');
        var sectionSeparatorRight = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-row-separator-right');
        var sectionSeparatorBottom = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-row-separator-bottom');
        var sectionSeparatorLeft = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-row-separator-left');

        var sectionActivePhotoswipe = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-section-active-photoswipe');
        var sectionModel = Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-section-model');

        model.post_content = Rexpansive_Builder_Admin_Utilities.createSectionShortcode(blocks, sectionBackground, sectionDimension, sectionLayout, sectionIdentifiers, sectionOverlayColor, sectionBackgroundResponsive, sectionSeparatorTop, sectionSeparatorRight, sectionSeparatorBottom, sectionSeparatorLeft, sectionActivePhotoswipe, sectionModel);

        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: rexajax.ajaxurl,
          data: {
            action: 'rex_create_model_from_builder',
            nonce_param: rexajax.rexnonce,
            model_data: model
          },
          success: function (response) {
            if (response.success) {
              rexmodel_modal_props.$model_name.val('').siblings('label').removeClass('active');
              rexmodel_modal_props.$save_button.val('');
              rexmodel_modal_props.$model_import.children().eq(0).after('<option value="'+response.data.model_id+'">'+response.data.model_title+'</option>');
              rexmodel_modal_props.$model_import.find('option[value='+response.data.model_id+']').prop('selected',true);
              Rexpansive_Builder_Admin_Config.collect[section_id].sectionRef.attr('data-section-model',response.data.model_id);
              // Rexpansive_Builder_Admin_Modals.CloseModal($modal_wrap);
              model_created = true;
            }
          },
          error: function (response) {
            model_created = false;
          },
          complete: function(response) {
            rexmodel_modal_props.$modal.removeClass('rex-modal--loading');
          }
        });
      } else {
        rexmodel_modal_props.$model_name.focus();
      }
    });

    
    $(document).on('rexbuilder:section_bg_edit',_reset_model);
    $(document).on('rexbuilder:block_bg_edit',_reset_model);
    $(document).on('rexbuilder:block_deleted',_reset_model);
    $(document).on('rexbuilder:block_content_edit',_reset_model);

    /**
     * Open model preview
     * @since 1.1.2
     */
    rexmodel_modal_props.$model_preview.on('click', function(e) {
      var m_id = rexmodel_modal_props.$model_import.val();
      if( 0 != m_id ) {
        var src = rexmodel_modal_props.$model_import.find('option[value='+m_id+']').attr('data-preview-url');
        Rexpansive_Builder_Admin_Lightbox.open('<iframe class="rex-model__preview" src="'+src+'"></iframe>');
      }
    });
    
  };

  /**
   *  Reset model id if user edit the row
   *
   *  @since  1.1.2
   */
  var _reset_model = function(event,el) {
    if($(el).hasClass('builder-row')) {
      el.setAttribute('data-section-model','');
    } else if($(el).hasClass('item')) {
      $(el).parents('.builder-row').attr('data-section-model','');
    }
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