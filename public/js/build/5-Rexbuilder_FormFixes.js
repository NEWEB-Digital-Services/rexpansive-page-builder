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
          const indicatorEl = $(e).find('.rex-checkbox__indicator')
          if($(e).find('label').length>0 && 0 == indicatorEl.length) {
            $(e).find('input[type=checkbox]').after('<span class="rex-checkbox__indicator"></span>');
          }
          const checkboxInput = $(e).find('input[type=checkbox]')
          if (0 !== checkboxInput.length && 0 === indicatorEl.length) {
            checkboxInput.after('<span class="rex-checkbox__indicator"></span>');
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
        $this.find('.wpcf7-spinner').append('<div class="sk-double-bounce"><div class="sk-child sk-double-bounce1"></div><div class="sk-child sk-double-bounce2"></div></div>');
      }
    });
  };

  /**
   * Fixing a RexGrid disabled block heights
   * @param {DOMElement} gridEl DOM element of a perfect grid gallery
   * @since 2.2.0
   */
  function fixDisabledGridHeights(gridEl) {
    const blocks = Array.prototype.slice.call(gridEl.querySelectorAll('.perfect-grid-item'))
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      const content = block.querySelector('.text-wrap')
      const actualeHeight = parseInt(block.style.height)
      const mayebNewHeight = Math.ceil(content.getBoundingClientRect().height)
      if (mayebNewHeight > actualeHeight) {
        block.style.height = `${mayebNewHeight}px`
      }
    }
  }

  var _listen_events = function() {
    document.addEventListener( 'wpcf7submit', function( event ) {
      var gridEl = $(event.target).parents('.perfect-grid-gallery').get(0)
      if ('undefined' === typeof gridEl || null === gridEl) return

      var gridInstance = RexGrid.data(gridEl);
      if (gridInstance) {
        setTimeout(() => {
          gridInstance.endResize();
        }, 200);
      } else {
        setTimeout(() => {
          fixDisabledGridHeights(gridEl)
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