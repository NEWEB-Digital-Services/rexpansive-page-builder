/**
 *	perfectGridGallery
 */
;(function( $, window, document, undefined ) {
	$.perfectGridGallery = function(element, options) {
		this.options = {};

		element.data('perfectGridGallery', this);

		this.init = function(element, options) {         
			this.options = $.extend({}, $.perfectGridGallery.defaultOptions, options);

			var percentualWidth = 0;
			//if($(window).innerWidth() >= 768) {
				percentualWidth = this.options.gridItemWidth;
			//} else {
			//	percentualWidth = 0.5;
			//}

			var $perfectGridGallery = element,
				gridItemSelector = this.options.itemSelector,
				separator = $perfectGridGallery.data('separator'),
				halfSeparator = Math.round( separator / 2 ),
				gallLayout = $perfectGridGallery.attr('data-layout') || this.options.galleryLayout,
				gridItemSizerSelector = this.options.gridSizerSelector,
				is_full_height = $perfectGridGallery.attr('data-full-height');

			var row_separator_top = ( 'undefined' !== typeof $perfectGridGallery.attr('data-row-separator-top') ? parseInt( $perfectGridGallery.attr('data-row-separator-top') ) : null );
			var row_separator_right = ( 'undefined' !== typeof $perfectGridGallery.attr('data-row-separator-right') ? parseInt( $perfectGridGallery.attr('data-row-separator-right') ) : null );
			var row_separator_bottom = ( 'undefined' !== typeof $perfectGridGallery.attr('data-row-separator-bottom') ? parseInt( $perfectGridGallery.attr('data-row-separator-bottom') ) : null );
			var row_separator_left = ( 'undefined' !== typeof $perfectGridGallery.attr('data-row-separator-left') ? parseInt( $perfectGridGallery.attr('data-row-separator-left') ) : null );

			var padding_only_top_bottom = check_parent_class( 'distance-block-top-bottom' );

			if( viewport().width >= 768 ) {

				if( null !== row_separator_top ) {
					$perfectGridGallery.css( 'margin-top', row_separator_top - halfSeparator );
				} else {
					$perfectGridGallery.css( 'margin-top', halfSeparator );
				}

				if( null !== row_separator_bottom ) {
					$perfectGridGallery.css( 'margin-bottom', row_separator_bottom - halfSeparator );
				} else {
					$perfectGridGallery.css( 'margin-bottom', halfSeparator );
				}

				if( !padding_only_top_bottom ) {

					if( null !== row_separator_left ) {
						$perfectGridGallery.css( 'margin-left', row_separator_left - halfSeparator );
					} else {
						$perfectGridGallery.css( 'margin-left', halfSeparator );
					}

					if( null !== row_separator_right ) {
						$perfectGridGallery.css( 'margin-right', row_separator_right - halfSeparator );
					} else {
						$perfectGridGallery.css( 'margin-right', halfSeparator );
					}
				}

				if($perfectGridGallery.find( gridItemSelector ).hasClass('wrapper-expand-effect')) {
					$perfectGridGallery.find( gridItemSelector ).css( 'padding-bottom', halfSeparator );
					$perfectGridGallery.find( gridItemSelector ).css( 'padding-left', halfSeparator );
					$perfectGridGallery.find( gridItemSelector ).css( 'padding-right', halfSeparator );
				} else {
					if( padding_only_top_bottom ) {
						$perfectGridGallery.find( gridItemSelector ).css( 'padding-top', halfSeparator );
						$perfectGridGallery.find( gridItemSelector ).css( 'padding-bottom', halfSeparator );
					} else {
						$perfectGridGallery.find( gridItemSelector ).css( 'padding', halfSeparator );
					}
				}

			} else {
				$perfectGridGallery.find( gridItemSelector ).css( 'padding-top', halfSeparator );
				$perfectGridGallery.find( gridItemSelector ).css( 'padding-bottom', halfSeparator );
				$perfectGridGallery.find( gridItemSelector ).css( 'padding-left', 0 );
				$perfectGridGallery.find( gridItemSelector ).css( 'padding-right', 0 );
			}

			var wrapWidth = Math.round($perfectGridGallery.width()),
				singleWidth = Math.round(wrapWidth * percentualWidth);

			var grid_total_area = 0;
			calculateArea();	// Calcuating the area of the grid
			var wrap_height;

			var grid_active = false;

			this.getSingleWidth = singleWidth;
			this.getSeparator = separator;

			// Elements height resize

			if( gallLayout == 'fixed' ) {								// If fix isset, calculate the heights of the elements
				if(viewport().width >= 768) {
					if(is_full_height == 'true') {

						wrap_height = viewport().height;
					
						var new_height = Math.round(wrap_height / ( grid_total_area / 12 ) );
						recalculateHeights(new_height);

					} else {
						recalculateHeights(singleWidth);
					}
				} else {
					//$perfectGridGallery.find(gridItemSelector).css('height', 'auto');
					//setBackgroundImagesHeight();
				}
			} else if( gallLayout == 'masonry' ) {
				recalculateHeightsMasonry(singleWidth);
			}

			// Launch Isotope on the Grid Gallery
			var isoOptions = {
				itemSelector: gridItemSelector,
				masonry: {
					columnWidth: gridItemSizerSelector,
				},
				percentPosition: false,
				animationEngine: 'css',
			};

			$perfectGridGallery.isotope(isoOptions);
			grid_active = true;

			$(window).load(function() {
				if(viewport().width < 768) {
					$perfectGridGallery.isotope('destroy');
					grid_active = false;
				} else {
					$perfectGridGallery.isotope('layout');
					grid_active = true;
				}
			});

			/*$perfectGridGallery.imagesLoaded( function() {
				$perfectGridGallery.isotope('layout');
			});	*/
			
			// Recalculate the elements height on the window resize
			$(window).on('resize', function() {
				var cofficent;
				
				if(viewport().width >= 768) {

					if( null !== row_separator_top ) {
						$perfectGridGallery.css( 'margin-top', row_separator_top - halfSeparator );
					} else {
						$perfectGridGallery.css( 'margin-top', halfSeparator );
					}

					if( null !== row_separator_bottom ) {
						$perfectGridGallery.css( 'margin-bottom', row_separator_bottom - halfSeparator );
					} else {
						$perfectGridGallery.css( 'margin-bottom', halfSeparator );
					}

					if( !padding_only_top_bottom ) {

						if( null !== row_separator_left ) {
							$perfectGridGallery.css( 'margin-left', row_separator_left - halfSeparator );
						} else {
							$perfectGridGallery.css( 'margin-left', halfSeparator );
						}

						if( null !== row_separator_right ) {
							$perfectGridGallery.css( 'margin-right', row_separator_right - halfSeparator );
						} else {
							$perfectGridGallery.css( 'margin-right', halfSeparator );
						}
					}
					
					if($perfectGridGallery.find( gridItemSelector ).hasClass('wrapper-expand-effect')) {
						$perfectGridGallery.find( gridItemSelector ).css( 'padding-bottom', halfSeparator );
						$perfectGridGallery.find( gridItemSelector ).css( 'padding-left', halfSeparator );
						$perfectGridGallery.find( gridItemSelector ).css( 'padding-right', halfSeparator );
					} else {
						if( padding_only_top_bottom ) {
							$perfectGridGallery.find( gridItemSelector ).css( 'padding-top', halfSeparator );
							$perfectGridGallery.find( gridItemSelector ).css( 'padding-bottom', halfSeparator );
						} else {
							$perfectGridGallery.find( gridItemSelector ).css( 'padding', halfSeparator );
						}
					}

					coefficent = percentualWidth;

					var newSingleWidth = Math.round( Math.round( $perfectGridGallery.width() ) * coefficent);

					this.getSingleWidth = newSingleWidth;

					if( gallLayout == 'fixed' ) {
						if(is_full_height == 'true') {
							wrap_height = viewport().height;
					
							var new_height = Math.round(wrap_height / ( grid_total_area / 12 ) );
							recalculateHeights(new_height);
						} else {
							recalculateHeights(newSingleWidth);
						}
					} else if( gallLayout == 'masonry' ) {

						recalculateHeightsMasonry(singleWidth);
					}

					if( !grid_active ) {
						$perfectGridGallery.isotope(isoOptions);
						grid_active = true;
					} else {
						$perfectGridGallery.isotope('layout');
					}
					
					$perfectGridGallery.trigger('rearrangeComplete');

				} else {
					//$perfectGridGallery.find(gridItemSelector).css('height', 'auto');
					//setBackgroundImagesHeight();
					$perfectGridGallery.find( gridItemSelector ).css( 'padding-top', halfSeparator );
					$perfectGridGallery.find( gridItemSelector ).css( 'padding-bottom', halfSeparator );
					$perfectGridGallery.find( gridItemSelector ).css( 'padding-left', 0 );
					$perfectGridGallery.find( gridItemSelector ).css( 'padding-right', 0 );
					//resetHeights();
					if(grid_active) {
						$perfectGridGallery.isotope('destroy');
						grid_active = false;
					}
				}
			});

			this.exposeRecalculate = function() {
				this.getSingleWidth = Math.round( Math.round( $perfectGridGallery.width() ) * this.options.gridItemWidth);
				recalculateHeights(this.getSingleWidth);
			}

			this.exposeRelayout = function() {
				$perfectGridGallery.isotope('layout');
			}

			function recalculateHeights(elWidth) {
				// Calculate the height based on the data attribute choose by the user

				//$perfectGridGallery.find(gridItemSelector + ':not(.wrapper-expand-effect):not(.horizontal-carousel)')
				$perfectGridGallery.find(gridItemSelector + ':not(.horizontal-carousel)')
					.add($perfectGridGallery.find(gridItemSelector + '.only-gallery'))
					//.not($perfectGridGallery.find(gridItemSelector + '.wrapper-expand-effect'))
					.each(function() {
						//var gridHeight = elWidth * $(this).data('height') + separator * ( $(this).data('height') - 1);
						//var gridHeight = elWidth * $(this).data('height') - separator * $(this).data('height');
						var gridHeight = ( elWidth * $(this).attr('data-height') ) - separator;
						$(this).height(gridHeight);
				});
			}



			function recalculateHeightsMasonry(elWidth) {
				$perfectGridGallery.find(gridItemSelector + ' .empty-content')
					.add($perfectGridGallery.find(gridItemSelector + ' .image-content :not(.text-wrap)'))
					.add($perfectGridGallery.find(gridItemSelector + '.only-background').children())
					//.add($perfectGridGallery.find(gridItemSelector + ' .image-content'))
					.each(function() {
						var $this = $(this);
						if( $this.css('background-image') != 'none' || $this.hasClass('empty-content') || ( $this.css('background-color') != 'none' && $this.find('img').length === 0 ) ) {
								var gridHeight = elWidth * $this.parent().attr('data-height') - separator;
								$this.height(gridHeight);
						}
					//var gridHeight = elWidth * $(this).data('height') + separator * ( $(this).data('height') - 1);
				});
			}

			function resetHeights() {
				$perfectGridGallery.find(gridItemSelector).each(function(index, el) {
					$(this).height('');
				});
			}

			// Fit the height of the background images elements
			function setBackgroundImagesHeight() {
				$perfectGridGallery.find(gridItemSelector + '.only-background').each(function() {
					$this = $(this);
					if($this.attr('data-height') == 1) {
						$this.height( Math.round( viewport().width/ 2 ) );
					} else {
						$this.height( Math.round( viewport().width * 0.75 ) );
					}
				});
			}

			function viewport() {
				var e = window, a = 'inner';
				if (!('innerWidth' in window )) {
					a = 'client';
					e = document.documentElement || document.body;
				}
				return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
			}

			function calculateArea() {
				$perfectGridGallery.find(gridItemSelector).each(function() {
					grid_total_area += parseInt($(this).attr('data-height')) * parseInt($(this).attr('data-width'));
				});
			}

			function check_parent_class( c ) {
				if( $perfectGridGallery.parents('.rexpansive_section').hasClass( c ) ) {
					return true;
				} else {
					return false;
				}
			}

			/**
			 *	Example of public method for the plugin
			 */

			$.fn.perfectGridGallery.setElementResponsiveWidth = function() {
				return wrapWidth * percentualWidth;
			};

			$.fn.perfectGridGallery.getIsotopeData = function() {
				return $perfectGridGallery.data('isotope');
			};

			$.fn.perfectGridGallery.getElementWidth = function(w) {
				return singleWidth;
			};

		};

		// Public functions

		this.init(element, options);
	};

	$.fn.perfectGridDestroy = function() {
		$(window).off('resize');
	};

	$.fn.perfectGridGallery = function(options) {                   
		return this.each(function() {
			(new $.perfectGridGallery($(this), options));              
		});
	};

	//Private functions

	$.perfectGridGallery.defaultOptions = {
		itemSelector: '.perfect-grid-item',
		gridItemWidth: 0.0833333333,
		gridSizerSelector: '.perfect-grid-sizer',
		galleryLayout: 'fixed'
	};
 
})( jQuery, window, document );