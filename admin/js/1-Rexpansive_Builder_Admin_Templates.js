/**
 * Object that contains all the usefull templates for the builder
 */
var Rexpansive_Builder_Admin_Templates = (function($) {
  'use strict';
  
  var templates;

  var _set_templates = function() {
    templates = {
      element_actions: $('#rexbuilder-tmpl-element-actions').html().trim(),
      section: $('#rexbuilder-tmpl-section').html(),
      empty: $('#rexbuilder-tmpl-empty-element').html(),
      text: $('#rexbuilder-tmpl-text-element').html().trim(),
      image: $('#rexbuilder-tmpl-image-element').html().trim(),
      notice_video: $('#rexbuilder-tmpl-notice-video').html().trim(),
      add_section: $("#rexbuilder-tmpl-add-section").html(),
    };
  };

  var init = function() {
    _set_templates();
    this.templates = templates;
  }
  
  return {
    init: init,
  };
  
})(jQuery);
