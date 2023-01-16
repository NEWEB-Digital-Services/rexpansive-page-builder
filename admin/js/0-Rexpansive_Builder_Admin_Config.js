/**
 * Object that contains all the builder configuration infos
 */
var Rexpansive_Builder_Admin_Config = (function($) {
  'use strict';

  var init = function() {
    this.collect = [];
    this.counter = 0;
    this.real_area = $('#rexbuilder').parent('.meta-box-sortables').width();
    this.grid_settings = {
      grid_area_width: this.real_area - 46,	// Width of a '.gridster ul'
      grid_columns: 12,									// Number of max columns
      widget_margins: 8,								// Margins of the blocks
      widget_dimension: null							// Block base dimension
    };
    
    this.grid_settings.widget_dimension = Math.round((
      this.grid_settings.grid_area_width - (
        this.grid_settings.widget_margins * (this.grid_settings.grid_columns * 2))) / this.grid_settings.grid_columns);

    this.$builderArea = $('#builder-area');
    this.global_section_reference;
    this.$actual_block_ref = null;
    this.$lean_overlay = $('.lean-overlay');

    this.post_modified = [];
    this.grid_appearance_modified = false;
  }

  var _set_grid_dimensions = function() {
    this.real_area = $('#rexbuilder').parent('.meta-box-sortables').width();
    this.grid_settings = {
      grid_area_width: this.real_area - 46,	// Width of a '.gridster ul'
      grid_columns: 12,									// Number of max columns
      widget_margins: 8,								// Margins of the blocks
      widget_dimension: null							// Block base dimension
    };

    this.grid_settings.widget_dimension = Math.round((
      this.grid_settings.grid_area_width - (
        this.grid_settings.widget_margins * (this.grid_settings.grid_columns * 2))) / this.grid_settings.grid_columns);
  }
  
  return {
    init: init,
    set_grid_dimensions: _set_grid_dimensions
  };
  
})(jQuery);