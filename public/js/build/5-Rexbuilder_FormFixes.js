/**
 * JS object to fix CF7 forms if user wants some materialize style
 */
var Rexbuilder_FormFixes = (function($) {
  'use strict';
  
  var $forms;

  var _cache_variables = function() {
    $forms = $('.wpcf7-form');
  };
  
  var _fix_checkboxes = function() {
    $forms.each(function(i,e) {
      var $this = $(e);
      if($this.hasClass('rxcf7-custom-checkbox')) {
        $this.find('.wpcf7-checkbox').each(function(i,e) {
          if($(e).find('label').length>0 && 0 == $(e).find('.rex-checkbox__indicator').length) {
            $(e).find('input[type=checkbox]').after('<span class="rex-checkbox__indicator"></span>');
          }
        });
        $this.find('.wpcf7-acceptance').each(function(i,e) {
          if($(e).find('label').length>0 && 0 == $(e).find('.rex-checkbox__indicator').length) {
            $(e).find('input[type=checkbox]').after('<span class="rex-checkbox__indicator"></span>');
          }
        });
      }
      if($this.hasClass('rxcf7-custom-loader') && 0 == $this.find('.sk-double-bounce').length) {
        $this.find('.ajax-loader').append('<div class="sk-double-bounce"><div class="sk-child sk-double-bounce1"></div><div class="sk-child sk-double-bounce2"></div></div>');
      }
    });
  };

  var _listen_events = function() {
    document.addEventListener( 'wpcf7submit', function( event ) {
      var $g = $(event.srcElement).parents('.perfect-grid-gallery');
      if($g.length>0) {
        setTimeout(function() {
          $g.perfectGridGallery("refreshGrid");
        }, 200);
      }
    }, false );
  };

	// init the utilities
	var init = function() {
    _cache_variables();
    _listen_events();
    _fix_checkboxes();
	};

	return {
		init: init,
	};

})(jQuery);