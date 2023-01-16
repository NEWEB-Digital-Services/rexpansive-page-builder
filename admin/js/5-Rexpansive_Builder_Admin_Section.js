/**
 * Object that contains a Section Object
 * @todo  substitue events with methods
 */
var Rexpansive_Builder_Admin_Section = (function($) {
  'use strict';

  function Section($el, i) {
    this.sectionRef = $el;			//jQuery reference for the row
    this.gridRef = null;			//Reference for the grid
    this.sectIndex = i;				//Index of the section
    this.gridSerialized = null;		//JSON object representing the content of the grid
    this.internalIndex = 0;			//Internal index for the grid widgets
    this.gridster_options = null;

    this.init = function () {
      this.sectionRef.attr('data-count', this.sectIndex);
      this.launchGrid();
      //Set the internal index to the max + 1 index, to avoid conflicts with removes and inserts
      //Using UnderscoreJS
      var nextIndex = _.max(_.map(_.pluck(this.gridRef.$widgets, 'id'), function (string) {
        return parseInt(string.substring(string.lastIndexOf('_') + 1, string.length));
      })) + 1;

      if (nextIndex != '-Infinity') {
        this.internalIndex = nextIndex;
      }
    };

    this.launchGrid = function () {
      var wdim = Rexpansive_Builder_Admin_Config.grid_settings.widget_dimension,
        wmar = Rexpansive_Builder_Admin_Config.grid_settings.widget_margins;
      this.gridster_options = {
        widget_selector: '.item',
        resize: {
          enabled: true,
          axes: ['x', 'y', 'both'],
          stop: function (e, ui, $widget) {
            Rexpansive_Builder_Admin_Utilities.update_live_visual_size($widget);
            Rexpansive_Builder_Admin_Utilities.set_all_posts_modified(Rexpansive_Builder_Admin_Config.post_modified);
          },
        },
        draggable: {
          stop: function(event, ui) {
            Rexpansive_Builder_Admin_Utilities.set_all_posts_modified(Rexpansive_Builder_Admin_Config.post_modified);
          }
        },
        widget_margins: [wmar, wmar],
        widget_base_dimensions: [wdim, wdim],
        min_cols: Rexpansive_Builder_Admin_Config.grid_settings.grid_columns,
        serialize_params: function ($w, wgd) {
          var type = $w.attr("data-block_type"),
            content = '',
            bg_info = $w.attr('data-bg_settings'),
            class_info = $w.attr('data-block-custom-classes'),
            padding_info = $w.attr('data-content-padding'),
            video_has_audio = $w.attr('data-video-has-audio');
          switch (type) {
            case 'text':
              content = $w.find(".data-text-content").text();
              break;
            case 'rexslider':
              content = $w.find(".data-text-content").text();
              break;
            case 'video':
              content = $w.find(".data-text-content").text();
              break;
            case 'image':
              content = $w.find(".data-text-content").text();
              break;
            case 'expand':
              content = $w.find('.data-zak-content').attr('data-zak-content');
              break;
            case 'empty':
              if ($w.find(".data-text-content").length > 0) {
                content = $w.find(".data-text-content").text();
              }
              break;
            default:
              break;
          }
          var output = '';
          output += '[RexpansiveBlock id="' + $w.prop("id") + '" type="' + type +
            '" col="' + wgd.col + '" row="' + wgd.row +
            '" size_x="' + wgd.size_x + '" size_y="' + wgd.size_y + '"';
          if (bg_info) {
            var bg_block_info = JSON.parse(bg_info);
            output += ' color_bg_block="' + bg_block_info.color + '" image_bg_block="' + bg_block_info.url +
              '" id_image_bg_block="' + bg_block_info.image +
              '" type_bg_block="' + bg_block_info.bg_img_type +
              '" video_bg_id="' + bg_block_info.video +
              '" video_bg_url="' + bg_block_info.youtube +
              '" video_bg_url_vimeo="' + bg_block_info.vimeo +
              '" photoswipe="' + bg_block_info.photoswipe +
              '" linkurl="' + bg_block_info.linkurl +
              '" image_size="' + bg_block_info.image_size +
              //'" block_custom_class="' + bg_block_info.block_custom_class +
              '" overlay_block_color="' + bg_block_info.overlay_block_color + '"';
          } else {
            output += ' color_bg_block="" image_bg_block="" id_image_bg_block="" type_bg_block="" photoswipe="" linkurl=""';
          }
          if (class_info) {
            output += ' block_custom_class="' + class_info + '" ';
          }
          if (padding_info) {
            output += ' block_padding="' + padding_info + '" ';
          }
          if (video_has_audio && video_has_audio == '1') {
            output += ' video_has_audio="1" ';
          }
          if (type == 'expand') {
            var zak_content = JSON.parse(content);
            output += ' zak_background="' + zak_content.background_id + '" zak_title="' + zak_content.title +
              '" zak_side="' + zak_content.side + '" zak_icon="' + zak_content.icon_id + '"' +
              ' zak_foreground="' + zak_content.foreground_id + '"';
          } else {
            //output += ' zak_background="" zak_title="" zak_side="" zak_icon=""';
          }
          output += " edited_from_backend=\"true\"";
          output += ']';
          if (type == 'expand') {
            output += JSON.parse(content).content;
          } else {
            output += content;
          }
          output += '[/RexpansiveBlock]';

          return {
            id: $w.prop("id"),
            content: output,
            col: wgd.col,
            row: wgd.row,
            size_x: wgd.size_x,
            size_y: wgd.size_y
          };
        },
      };
      //var settings = $.extend({}, rex_gridster_parameters, this.gridster_options);
      var settings = this.gridster_options;
      this.gridRef = this.sectionRef.find('.gridster > ul').gridster(settings).data('gridster');
      // this.sectionRef.find('.gridster > ul').css('min-height', wdim * 2);

      $(document).trigger('sectionCollectData', [this]);
    };

    this.addElementOnGrid = function (type) {
      var gridElement,
        gridElementId = 'block_' + this.sectIndex + '_' + this.internalIndex,
        this_section = this;

      Rexpansive_Builder_Admin_Config.global_section_reference = this;

      switch (type) {
        case 'image':
          Rexpansive_Builder_Admin_MediaUploader.RenderMediaUploader();
          break;
        case 'text':
          Rexpansive_Builder_Admin_TextEditor.openTextEditor('.builder-row[data-count="' + this.sectIndex + '"] #' + gridElementId, '');
          $('#editor-cancel').val('new-block');
          break;
        case 'expand':
          // openExpandEditor('.builder-row[data-count="' + this.sectIndex + '"] #' + gridElementId, '');

          Rexpansive_Builder_Admin_Config.$builderArea.trigger('rexpansive-builder.open-zak-editor', ['.builder-row[data-count="' + this.sectIndex + '"] #' + gridElementId, '']);

          gridElement = '<li id="' + gridElementId + '" class="expand item z-depth-1 hoverable svg-ripple-effect" data-block_type="expand" data-block-custom-classes=\'\' data-content-padding=\'\' data-bg_settings=\'\'>' +
          Rexpansive_Builder_Admin_Templates.templates.element_actions +
            '<div class="element-data">' +
            // Use the value to send the shortcode to the DB
            // Use the data attribute to set preview and comunicate with the editor
            '<input class="data-zak-content" type="hidden" value=\'\' data-zak-content=\'\'>' +
            '</div>' +
            '<div class="element-preview">' +
            '<div class="zak-block zak-image-side"></div>' +
            '<div class="zak-block zak-text-side"></div>' +
            '</div>' +
            '</li>';
          this.gridRef.add_widget(gridElement, 12, 2);
          Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#' + gridElementId));
          this.internalIndex++;
          Rexpansive_Builder_Admin_Utilities.launchTooltips();
          break;
        case 'video':
          Rexpansive_Builder_Admin_VideoEditor.reset_editor();
          Rexpansive_Builder_Admin_Modals.OpenModal(Rexpansive_Builder_Admin_VideoEditor.$modal_wrap);
          break;
        case 'rexslider':
          // openSliderEditor();
          Rexpansive_Builder_Admin_Config.$builderArea.trigger('rexpansive-builder.open-slider-editor');
          break;
        case 'empty':
          gridElement = Rexpansive_Builder_Admin_Templates.templates.empty.replace(/\bdata.emptyid\b/g, gridElementId);
          this.gridRef.add_widget(gridElement, 2, 2);
          Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#' + gridElementId));
          this.internalIndex++;
          Rexpansive_Builder_Admin_Utilities.launchTooltips();
          break;
        // case 'textfill':
        // 	openTextFillEditor();
        default:
          break;
      }
    };

    this.copyElementToGrid = function ($el) {
      var new_id = $el.attr('id').match(/block_\d+_/g);
      if (new_id.length > 0) {
        new_id = new_id[0] + this.internalIndex;
        $el.attr('id', new_id);
        var w = parseInt($el.attr('data-sizex'));
        var h = parseInt($el.attr('data-sizey'));
        var copy_markup = $el.wrap('<p/>').parent().html();

        this.gridRef.add_widget(copy_markup, w, h);
        this.internalIndex++;
        Rexpansive_Builder_Admin_Utilities.launchTooltips();
      }
    };

    this.removeElementFromGrid = function (el) {
      this.gridRef.remove_widget(el);
      $(document).trigger('sectionCollectData', [this]);
    };

    this.collectGridData = function () {
      this.gridSerialized = this.gridRef.serialize();

      this.gridSerialized = Gridster.sort_by_row_and_col_asc(this.gridSerialized);

      var c = _.map(this.gridSerialized, function (obj) {
        return _.first(_.values(_.pick(obj, 'content')));
      });

      this.sectionRef.attr('data-gridcontent', c.join(''));
    };

    this.fillEmptyCells = function () {
      var gridElementId,
        gridElement,
        cols = this.gridRef.container_width / this.gridRef.min_widget_width,
        rows = this.gridRef.container_height / this.gridRef.min_widget_width,
        i,
        j;
      var guard;
      var w, h;
      var internal_i, internal_j;

      for (j = 1; j <= rows; j++) {
        for (i = 1; i <= cols; i++) {
          if (this.gridRef.is_empty(i, j)) {
            guard = 0;
            w = h = 1;
            internal_i = i;
            internal_j = j;

            while (internal_i <= cols && this.gridRef.is_empty(internal_i, internal_j)) {
              guard = internal_i;
              internal_i++;
            }
            w = internal_i - i;
            internal_j++;
            internal_i = i;

            while (internal_j <= rows) {
              while (internal_i <= guard) {
                if (this.gridRef.is_empty(internal_i, internal_j)) {
                  internal_i++;
                } else {
                  break;
                }
              }
              if (internal_i - 1 == guard) {
                internal_j++;
                internal_i = i;
              } else {
                break;
              }
            }

            h = internal_j - j;

            gridElementId = 'block_' + this.sectIndex + '_' + this.internalIndex;
            gridElement = Rexpansive_Builder_Admin_Templates.templates.empty.replace(/\bdata.emptyid\b/g, gridElementId);
            this.gridRef.add_widget(gridElement, w, h, i, j);
            Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#' + gridElementId));
            this.internalIndex++;
          }
        }
      }
      Rexpansive_Builder_Admin_Utilities.launchTooltips();
    };
  };
  
  return {
    Section: Section
  };
  
})(jQuery);
