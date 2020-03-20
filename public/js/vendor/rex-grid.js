;
( function( window, factory ) {
	'use strict';
	window.RexGrid = factory( window );
} )( 'undefined' !== typeof window ? window : this, function() {

	/* ===== Utilities ===== */
	var Utils = {
		/**
		 * Calculate viewport window and height.
		 * @return	{Object}	Window width & height
		 * @since		1.0.0
		 */
		viewport: function() {
			var e = window,
				a = 'inner';
			if ( !( 'innerWidth' in window ) ) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width: e[ a + 'Width' ], height: e[ a + 'Height' ] };
		},

		/**
		 * Extending defaults with user options
		 * @param  {Object} source
		 * @param  {Object} properties
		 * @since	 1.0.0
		 */
		extendDefaults: function( source, properties ) {
			var property;
			for ( property in properties ) {
				if ( properties.hasOwnProperty( property ) ) {
					source[ property ] = properties[ property ];
				}
			}
			return source;
		},

		/**
		 * Checks if an element matches a selector class
		 * @param  {Node}			el
		 * @param  {String}		selector
		 * @return {Boolean}	Does the element match the given selector?
		 */
		matches: function( el, selector ) {
			return ( el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector ).call( el, selector );
		},

		/**
		 * Search for parent ancestor element in vanillaJS
		 * @param  {Node}					el
		 * @param  {String}				selector
		 * @return {Node | null}	Parent node that matches the given selector if does exist, null otherwise
		 */
		parents: function( el, selector ) {
			while ( el.parentNode ) {
				if ( Utils.matches( el, selector ) ) {
					return el;
				}
				el = el.parentNode;
			}
			return null;
		},

		/**
		 * Checks if a number or a String
		 * representing a Number is even
		 * and returns true if so.
		 * @param  {Number | String} num		Number to check
		 * @return {Boolean}							Is the number even?
		 * @since  1.0.0
		 */
		isEven: function( num ) {
			if ( typeof num === "string" ) {
				num = parseInt( num );
			}

			if ( !isNaN( num ) ) {
				return num % 2 === 0;
			} else {
				throw new Error( 'The value passed is not a Number or a String representing a Number' )
			}
		},

		toggleClass: function( el, className ) {
			if ( hasClass( el, className ) ) {
				Utils.removeClass( el, className );
			} else {
				Utils.addClass( el, className );
			}
		}
	}

	// Class manipulation utils
	if ( 'classList' in document.documentElement ) {
		Utils.hasClass = function( el, className ) { return el.classList.contains( className ); };
		Utils.addClass = function( el, className ) { el.classList.add( className ); };
		Utils.removeClass = function( el, className ) { el.classList.remove( className ); };
	} else {
		Utils.hasClass = function( el, className ) { return new RegExp( '\\b' + className + '\\b' ).test( el.className ); };
		Utils.addClass = function( el, className ) { if ( !hasClass( el, className ) ) { el.className += ' ' + className }; };
		Utils.removeClass = function( el, className ) { el.className = el.className.replace( new RegExp( '\\b' + className + '\\b', 'g' ), '' ); };
	}

	/* ===== Global vars ===== */
	var globalViewportSize = Utils.viewport();
	var globalGridWidthsCallbacks = [];
	var blocksHeightsCallbacks = [];
	var blockFixingCallbacks = [];

	/* ===== RexBlock ===== */
	function RexBlock( options ) {
		this.el = options.el;
		this.blockData = this.el.querySelector( '.rexbuilder-block-data' );
		this.id = options.id;
		this.w = options.w;
		this.h = options.h;
		this.x = options.x;
		this.y = options.y;
		this.toCheck = options.toCheck;
		this.domIndex = this.x + ( this.y * 12 );
	}

	/* ===== Plugin constructor ===== */
	function RexGrid() {
		/**
		 * Grid DOM Element.
		 * It's identified by the class .perfect-grid-gallery
		 * because we get it from Rexpansive builder.
		 */
		this.element = null;

		/**
		 * Block elements inside the grid.
		 * It is possibile to have 0 blocks.
		 * They're identified by the class .perfect-grid-item
		 * because we get them from Rexpansive builder.
		 */
		this.gridBlocks = [];
		this.gridBlocksTotal = 0;

		/**
		 * Section DOM Element.
		 * It's identified by the class .rexpansive_section
		 * because we get it from Rexpansive builder.
		 */
		this.section = null;
		this.sectionData = null;

		// Getting grid element as first argument
		if ( arguments[ 0 ] ) {
			this.element = arguments[ 0 ];
			this.section = Utils.parents( this.element, '.rexpansive_section' );
			this.sectionData = this.section.querySelector( '.section-data' );
		}

		// Default options values
		var defaults = {
			type: 'fixed',
			gutter: 20
		};

		// Create options by extending defaults with the passed in arugments.
		// Get options as second argument
		if ( arguments[ 1 ] && 'object' === typeof arguments[ 1 ] ) {
			this.options = Utils.extendDefaults( defaults, arguments[ 1 ] );
		} else {
			this.options = defaults;
		}

		this.properties = {
			id: '',
			gridWidth: 0,
			layout: 'fixed',
			singleWidth: 0,
			singleHeight: 0,
			halfSeparator: 0,
			halfSeparatorTop: 0,
			halfSeparatorRight: 0,
			halfSeparatorBottom: 0,
			halfSeparatorLeft: 0,
			halfSeparatorElementTop: 0,
			halfSeparatorElementRight: 0,
			halfSeparatorElementBottom: 0,
			halfSeparatorElementLeft: 0,
			gridTopSeparator: null,
			gridRightSeparator: null,
			gridBottomSeparator: null,
			gridLeftSeparator: null,
			// wrapWidth: 0,
			setMobilePadding: false,
			setDesktopPadding: false,
			// elementStartingH: 0,
			// resizeHandle: "",
			sectionNumber: null,
			// serializedData: [],
			// firstStartGrid: false,
			// gridBlocksHeight: 0,
			editedFromBackend: false,
			// oneColumMode: false,
			oneColumModeActive: false,
			// gridstackBatchMode: false,
			// updatingSection: false,
			// oldLayout: "",
			// oldCellHeight: 0,
			// blocksBottomTop: null,
			// updatingSectionSameGrid: false,
			// startingLayout: "",
			// oldFullHeight: "",
			// blocksDimensions: [],
			// reverseDataGridDisposition: {},
			// updatefullHeigth2Phases: false,
			// removingCollapsedElements: false,
			// collapsingElements: false,
			// lastIDBlock: 0,
			// updatingGridWidth: false,
			// numberBlocksVisibileOnGrid: 0,
			beforeCollapseWasFixed: false,
			// dispositionBeforeCollapsing: {},
			// layoutBeforeCollapsing: {},
			// initialStateGrid: null,
			// mirrorStateGrid: null,
			// fullWidthNaturalBackground: false,
			// naturalBackground: false
		};

		_init.call( this );
	}

	/* ===== Private Methods ===== */
	function _init() {
		if ( this.sectionData.getAttribute( 'data-row_edited_live' ) != 'true' ) {
			// @todo set to false on change layout
			this.properties.editedFromBackend = true;
		}

		// Gutter functions
		_getDOMGutterOptions.call( this );
		_setGridGutterProperties.call( this );
		_setBlocksGutterProperties.call( this );

		// Applying grid separators
		_applyGridSeparators.call( this );

		this.properties.layout = this.element.getAttribute( 'data-layout' );

		// Calculations of grid width. In this way it's possible to access to this
		// value without causing a layout reflow
		_calcGridBaseAttrs.call( this );
		// globalGridWidthsCallbacks.push( _calcGridBaseAttrs.bind( this ) );

		// Finding the blocks in the DOM
		_getGridBlocks.call( this );

		// Applying blocks separators
		_applyBlocksSeparators.call( this );

		// Calculatione
		this.calcAllBlocksHeights();
		// blocksHeightsCallbacks.push( this.calcAllBlocksHeights.bind( this ) );
		this.calcBlocksTop();

		// Fixings
		// this.fixAllBlocksHeigths();
		// _fixBlockPositions.call( this );
		// blockFixingCallbacks.push( _fixBlockPositions.bind( this ) );

		_setGridHeight.call( this );
	}

	function _calcGridBaseAttrs() {
		this.properties.gridWidth = this.element.offsetWidth; // Can cause a layout reflow
		this.properties.singleWidth = this.properties.gridWidth / 12;

		if ( 'fixed' === this.properties.layout ) {
			this.properties.singleHeight = this.properties.singleWidth;
		} else if ( 'masonry' === this.properties.layout ) {
			this.properties.singleHeight = 5;
		}
	}

	function _getGridBlocks() {
		var blocksArray = Array.prototype.slice.call( this.element.getElementsByClassName( 'perfect-grid-item' ) );
		var blockInstance;

		this.gridBlocksTotal = blocksArray.length;
		var i = 0;

		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			blockInstance = new RexBlock( {
				el: blocksArray[ i ],
				id: blocksArray[ i ].getAttribute( 'data-rexbuilder-block-id' ),
				w: parseInt( blocksArray[ i ].getAttribute( 'data-gs-width' ) ),
				h: parseInt( blocksArray[ i ].getAttribute( 'data-gs-height' ) ),
				x: parseInt( blocksArray[ i ].getAttribute( 'data-gs-x' ) ),
				y: parseInt( blocksArray[ i ].getAttribute( 'data-gs-y' ) ),
				toCheck: false
			} );

			_fixNaturalImage.call( this, blockInstance );

			this.gridBlocks.push( blockInstance );
		}

		// sort blocks array by ascending DOM order
		this.gridBlocks.sort( function( bA, bB ) {
			return ( bA.domIndex - bB.domIndex )
		} );

		// Getting grid id
		this.properties.id = this.element.dataset.rexGridId;
	}

	/**
	 * Calculate the height of the text content of a block.
	 * @param  {Element}  block		Grid block element
	 * @return {Number}       		Necessary text height
	 * @since	 1.0.0
	 */
	function _calculateTextWrapHeight( block ) {
		var textWrap = block.querySelector( '.text-wrap' );
		var textHeight = 0;

		if ( textWrap ) {
			var blockHasSlider = Utils.hasClass( block, 'block-has-slider' );
			var textWrapHasContent = 0 !== textWrap.textContent.trim().length;
			var textWrapHasChildren = 0 !== textWrap.childElementCount;

			if ( !blockHasSlider && ( textWrapHasContent || textWrapHasChildren ) ) {
				textHeight = textWrap.offsetHeight;
			}
		}

		return textHeight;
	}

	function _setGridHeight() {
		var newGridHeight = _calculateGridHeight.call( this );

		this.element.style.height = newGridHeight + 'px';
	}

	/**
	 * Calculating grid DOM Element total height
	 * @return 	{Number}	Grid total height
	 * @since		1.0.0
	 */
	function _calculateGridHeight() {
		var heightTot = 0;
		var heightTemp;

		var i = 0;

		// for native loop guarantees more performance efficiency
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			if ( -1 === this.gridBlocks[ i ].el.className.indexOf( 'removing_block' ) ) {
				heightTemp = parseInt( this.gridBlocks[ i ].el.getAttribute( 'data-gs-height' ) ) + parseInt( this.gridBlocks[ i ].el.getAttribute( 'data-gs-y' ) );

				if ( heightTemp > heightTot ) {
					heightTot = heightTemp;
				}
			}
		}
		return heightTot * this.properties.singleHeight;
	};

	function _getDOMGutterOptions() {
		// Overriding blocks gutter value if there is the respective DOM Attribute
		if ( this.element.getAttribute( 'data-separator' ) ) {
			this.options.gutter = parseInt( this.element.getAttribute( 'data-separator' ) );
		};

		// Defining grid separators
		this.properties.gridTopSeparator =
			this.element.getAttribute( 'data-row-separator-top' ) ?
			parseInt( this.element.getAttribute( 'data-row-separator-top' ) ) :
			null;
		this.properties.gridRightSeparator =
			this.element.getAttribute( 'data-row-separator-right' ) ?
			parseInt( this.element.getAttribute( 'data-row-separator-right' ) ) :
			null;
		this.properties.gridBottomSeparator =
			this.element.getAttribute( 'data-row-separator-bottom' ) ?
			parseInt( this.element.getAttribute( 'data-row-separator-bottom' ) ) :
			null;
		this.properties.gridLeftSeparator =
			this.element.getAttribute( 'data-row-separator-left' ) ?
			parseInt( this.element.getAttribute( 'data-row-separator-left' ) ) :
			null;
	}

	function _setGridGutterProperties() {
		if ( Utils.isEven( this.options.gutter ) ) {
			this.properties.halfSeparatorTop = this.options.gutter / 2;
			this.properties.halfSeparatorRight = this.options.gutter / 2;
			this.properties.halfSeparatorBottom = this.options.gutter / 2;
			this.properties.halfSeparatorLeft = this.options.gutter / 2;
		} else {
			this.properties.halfSeparatorTop = Math.floor( this.options.gutter / 2 );
			this.properties.halfSeparatorRight = Math.floor( this.options.gutter / 2 );
			this.properties.halfSeparatorBottom = Math.ceil( this.options.gutter / 2 );
			this.properties.halfSeparatorLeft = Math.ceil( this.options.gutter / 2 );
		}
	}

	function _setBlocksGutterProperties() {
		if ( Utils.isEven( this.options.gutter ) ) {
			this.properties.halfSeparatorElementTop = this.options.gutter / 2;
			this.properties.halfSeparatorElementRight = this.options.gutter / 2;
			this.properties.halfSeparatorElementBottom = this.options.gutter / 2;
			this.properties.halfSeparatorElementLeft = this.options.gutter / 2;
		} else {
			this.properties.halfSeparatorElementTop = Math.floor( this.options.gutter / 2 );
			this.properties.halfSeparatorElementRight = Math.floor( this.options.gutter / 2 );
			this.properties.halfSeparatorElementBottom = Math.ceil( this.options.gutter / 2 );
			this.properties.halfSeparatorElementLeft = Math.ceil( this.options.gutter / 2 );
		}
	}

	function _applyGridSeparators() {
		if ( !this.properties.setDesktopPadding ||
			( !this.properties.setDesktopPadding &&
				!this.properties.setMobilePadding &&
				this.section.getAttribute( 'data-rex-collapse-grid' ) == 'true' )
		) {
			this.properties.setDesktopPadding = true;
			if ( this.section.getAttribute( 'data-rex-collapse-grid' ) == 'true' ) {
				this.properties.setMobilePadding = true;
			} else {
				this.properties.setMobilePadding = false;
			}

			if ( null !== this.properties.gridTopSeparator ) {
				this.element.style.marginTop = ( this.properties.gridTopSeparator - this.properties.halfSeparatorTop ) + 'px';
			} else {
				this.element.style.marginTop = this.properties.halfSeparatorTop + 'px';
			}

			if ( null !== this.properties.gridBottomSeparator ) {
				this.element.style.marginBottom = ( this.properties.gridBottomSeparator - this.properties.halfSeparatorBottom ) + 'px';
			} else {
				this.element.style.marginBottom = this.properties.halfSeparatorBottom + 'px';
			}

			if ( null !== this.properties.gridLeftSeparator ) {
				this.element.style.marginLeft = ( this.properties.gridLeftSeparator - this.properties.halfSeparatorLeft ) + 'px';
			} else {
				this.element.style.marginLeft = this.properties.halfSeparatorLeft + 'px';
			}

			if ( null !== this.properties.gridRightSeparator ) {
				this.element.style.marginRight = ( this.properties.gridRightSeparator - this.properties.halfSeparatorRight ) + 'px';
			} else {
				this.element.style.marginRight = this.properties.halfSeparatorRight + 'px';
			}
		}
	}

	function _applyBlocksSeparators() {
		var i = 0;

		// for native loop guarantees more performance efficiency
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			currentBlock = this.gridBlocks[ i ].el.querySelector( '.grid-stack-item-content' );

			currentBlock.style.paddingTop = this.properties.halfSeparatorElementTop + 'px';
			currentBlock.style.paddingRight = this.properties.halfSeparatorElementRight + 'px';
			currentBlock.style.paddingBottom = this.properties.halfSeparatorElementBottom + 'px';
			currentBlock.style.paddingLeft = this.properties.halfSeparatorElementLeft + 'px';
		}
	}

	function _fixBlockPositions() {
		var i;
		var j;

		// grid.style.display = 'none';

		// check other blocks collapse
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			if ( !this.gridBlocks[ i ].toCheck ) {
				continue;
			}

			for ( j = 0; j < this.gridBlocksTotal; j++ ) {
				if ( this.gridBlocks[ i ].el === this.gridBlocks[ j ].el ) {
					continue;
				}

				if ( this.gridBlocks[ i ].x < this.gridBlocks[ j ].x + this.gridBlocks[ j ].w &&
					this.gridBlocks[ i ].x + this.gridBlocks[ i ].w > this.gridBlocks[ j ].x &&
					this.gridBlocks[ i ].y < this.gridBlocks[ j ].y + this.gridBlocks[ j ].h &&
					this.gridBlocks[ i ].y + this.gridBlocks[ i ].h > this.gridBlocks[ j ].y ) {

					var newTop = ( this.gridBlocks[ i ].y + this.gridBlocks[ i ].h ) - this.gridBlocks[ j ].y;
					var newY = this.gridBlocks[ j ].y + newTop;

					this.gridBlocks[ j ].el.setAttribute( 'data-gs-y', newY );

					this.gridBlocks[ j ].el.style.top = ( ( newY ) * this.properties.singleHeight ) + 'px';
					this.gridBlocks[ j ].y = newY;
					this.gridBlocks[ j ].domIndex = this.gridBlocks[ j ].x + ( this.gridBlocks[ j ].y * 12 )

					this.gridBlocks[ j ].toCheck = true;
				}
			}

			this.gridBlocks[ i ].toCheck = false;
		}

		// grid.style.display = '';
	}

	/**
	 * Fix natural image with a proper class to style correctly 
	 * the image in background as a natural image with IMG tag
	 * @return {void}
	 * @since 1.0.0
	 */
	function _fixNaturalImage( gridBlockObj ) {
		var currentBlock = gridBlockObj.el;
		var naturalImage = currentBlock.querySelector( '.natural-image-background' );

		if ( null === naturalImage ) {
			return;
		}

		var itemContent = currentBlock.querySelector( '.grid-item-content' );

		if ( null === itemContent ) {
			console.warn( 'No .grid-item-content Element found in function fixNaturalImage!' );
			return;
		}

		var naturalImageWidth = parseInt( itemContent.getAttribute( 'data-background_image_width' ) );
		var blockWidth = ( this.properties.singleWidth * gridBlockObj.w ) - this.options.gutter;

		if ( naturalImageWidth > blockWidth ) {
			Utils.addClass( naturalImage, 'small-width' );
		}
	}

	function _updateBlockDataHeightProperties( blockData, newH ) {
		if ( this.properties.layout === 'masonry' ) {
			blockData.setAttribute( 'data-block_height_masonry', newH );
		} else {
			blockData.setAttribute( 'data-block_height_fixed', newH );
		}

		blockData.setAttribute( 'data-gs_start_h', newH );
		blockData.setAttribute( 'data-block_height_calculated', newH );
	}

	/* ===== Public Methods ===== */

	/**
	 * Calculating height of the grid blocks.
	 * @since	1.0.0
	 */
	RexGrid.prototype.calcAllBlocksHeights = function() {
		var i = 0;

		// for native loop guarantees more performance efficiency
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			this.calcAndSetBlockHeight( this.gridBlocks[ i ] );
		}
	}

	RexGrid.prototype.calcAndSetBlockHeight = function( gridBlockObj ) {
		gridBlockObj.el.style.height = ( this.properties.singleHeight * gridBlockObj.h ) + 'px';
	}

	RexGrid.prototype.fixAllBlocksHeigths = function() {
		var i = 0;

		// for native loop guarantees more performance efficiency
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			this.fixBlockHeight( this.gridBlocks[ i ] );
		}
	}

	RexGrid.prototype.fixBlockHeight = function( gridBlockObj ) {
		var editingBlock = typeof editingBlock !== "undefined" ? editingBlock : false;

		var currentBlock = gridBlockObj.el;

		// Properties
		var blockData = gridBlockObj.blockData;
		var startH = parseInt( blockData.getAttribute( 'data-gs_start_h' ) );

		var newH;
		var singleWidthGrid = this.properties.singleWidth;
		var singleWidth;

		if ( this.properties.oneColumModeActive ) {
			// Reflow can happen
			singleWidth = this.element.offsetWidth * this.properties.gridItemWidth;
		} else {
			singleWidth = singleWidthGrid;
		}

		var gutter = this.options.gutter;

		var originalWidth = parseInt( currentBlock.getAttribute( 'data-gs-width' ) );
		var originalHeight = parseInt( currentBlock.getAttribute( 'data-gs-height' ) );
		var spaceAvailable = originalHeight * this.properties.singleHeight;
		var elRealFluid = parseInt( blockData.getAttribute( 'data-element_real_fluid' ) );

		var backgroundHeight = 0;
		var videoHeight = 0;
		var defaultHeight = 0;
		var sliderHeight = 0;
		var emptyBlockFlag = false;
		var backImgType = blockData.getAttribute( 'data-type_bg_block' );

		var itemContent = currentBlock.querySelector( '.grid-item-content' );
		var imageWrapper = null;
		var blockHasSlider = false;
		var blockIsEmpty = false;
		var blockHasYoutube = false;
		var blockHasVideo = false;
		var blockHasVimeo = false;

		if ( itemContent ) {
			blockIsEmpty = -1 !== itemContent.className.indexOf( 'empty-content' );

			imageWrapper = itemContent.querySelector( '.rex-image-wrapper' );

			blockHasSlider = -1 !== currentBlock.className.indexOf( 'block-has-slider' );

			blockHasYoutube = -1 !== itemContent.className.indexOf( 'youtube-player' );
			blockHasVideo = -1 !== itemContent.className.indexOf( 'mp4-player' );
			blockHasVimeo = -1 !== itemContent.className.indexOf( 'vimeo-player' );
		}

		if ( blockHasSlider ) {
			return;
		}

		var currentBlockTextHeight = _calculateTextWrapHeight.call( this, currentBlock );

		if ( this.properties.oneColumModeActive ) {
			originalWidth = 12;
		}

		if ( 0 === currentBlockTextHeight ) {
			// calculating background image height
			if ( null !== imageWrapper ) {

				var imageWidth = parseInt( itemContent.getAttribute( "data-background_image_width" ) );
				var imageHeight = parseInt( itemContent.getAttribute( "data-background_image_height" ) );

				if ( currentBlock.offsetWidth < imageWidth ) {
					backgroundHeight = ( imageHeight * ( ( originalWidth * singleWidth ) - gutter ) ) / imageWidth;
				} else {
					backgroundHeight = imageHeight;
				}
			}

			// Calculate video height
			// @todo check me to prevent video auto ratio-resize 
			if ( blockHasYoutube || blockHasVideo || blockHasVimeo ) {
				videoHeight = originalHeight * this.properties.singleHeight;
			}

			// Calculate slider height
			if ( blockHasSlider ) {
				sliderHeight = originalHeight * this.properties.singleHeight;
			}

			// calculate default height (in case of block without content that pushes)
			// or else update text height
			if ( videoHeight == 0 && backgroundHeight == 0 && sliderHeight == 0 && ( Rexbuilder_Util_Editor.updatingSectionLayout || blockIsEmpty || blockHasSlider ) ) {
				if ( this.properties.editedFromBackend && this.properties.layout == "masonry" ) {
					defaultHeight = Math.round( singleWidth * startH );
				} else if ( this.properties.oneColumModeActive && this.properties.beforeCollapseWasFixed ) {
					defaultHeight = startH * this.properties.singleWidth;
				} else {
					defaultHeight = startH * this.properties.singleHeight;
				}
			}

		}

		if ( !blockHasSlider && backgroundHeight == 0 && videoHeight == 0 && currentBlockTextHeight == 0 ) {
			emptyBlockFlag = true;
		}

		// if the block has a full image background, without text
		// maintain the old height
		if ( !blockHasSlider && !blockHasYoutube && !blockHasVimeo && !blockHasVideo && ( ( ( 'full' === backImgType && 0 === currentBlockTextHeight ) || ( '' === backImgType && 0 === currentBlockTextHeight ) ) && !this.properties.oneColumModeActive ) ) {
			newH = startH * this.properties.singleHeight;
		} else {
			if ( editingBlock ) {
				startH *= this.properties.singleHeight;
			} else {
				startH = 0;
			}

			newH = Math.max(
				startH,
				backgroundHeight,
				videoHeight,
				defaultHeight,
				currentBlockTextHeight,
				sliderHeight
			);
		}

		// if ( this.properties.oneColumModeActive && !Rexbuilder_Util.windowIsResizing ) {
		if ( this.properties.oneColumModeActive ) {
			var collapsedHeight = newH;

			return {
				height: collapsedHeight,
				empty: emptyBlockFlag
			};
		}

		var resizeNotNeeded = false;

		// check if resize really needed
		// fix occurs on first start and not in editor mode
		if ( currentBlockTextHeight !== 0 ) {
			if ( 'fixed' === this.properties.layout || ( 1 !== elRealFluid && 'masonry' === this.properties.layout ) ) {
				if ( newH < spaceAvailable ) {
					resizeNotNeeded = true;
				}
			}
		} else if ( backgroundHeight !== 0 ) {
			if ( 'fixed' === this.properties.layout ) {
				resizeNotNeeded = true;
			} else if ( 'masonry' === this.properties.layout ) {
				if ( ( 'natural' === backImgType && 1 !== elRealFluid ) || 'full' === backImgType ) {
					if ( newH < spaceAvailable ) {
						resizeNotNeeded = true;
					}
				}
			}
		}

		if ( resizeNotNeeded ) {
			return;
		}

		if ( this.properties.layout == "fixed" ) {
			if ( emptyBlockFlag || blockHasYoutube || blockHasVideo || blockHasVimeo ) {
				newH = Math.round( ( newH + gutter ) / this.properties.singleHeight );
			} else {
				newH = Math.ceil( ( newH + gutter ) / this.properties.singleHeight );
			}
		} else {
			newH = Math.ceil( ( newH + gutter ) / this.properties.singleHeight );
		}

		_updateBlockDataHeightProperties.call( this, blockData, newH );

		// Setting dimensions

		gridBlockObj.h = newH;
		currentBlock.style.height = ( gridBlockObj.h * this.properties.singleHeight ) + 'px';
		currentBlock.setAttribute( 'data-gs-height', gridBlockObj.h );
		gridBlockObj.toCheck = true;
	}

	/**
	 * Calculating top of the grid blocks.
	 * @since	1.0.0
	 */
	RexGrid.prototype.calcBlocksTop = function() {
		var i = 0;

		var currentBlock;
		var currentBlockRealTop = 0;

		// for native loop guarantees more performance efficiency
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			currentBlock = this.gridBlocks[ i ].el;

			currentBlockRealTop = this.properties.singleHeight * this.gridBlocks[ i ].y;

			currentBlock.style.top = currentBlockRealTop + 'px';
		}
	}

	RexGrid.prototype.fixAfterLoad = function () {
		// Fixings
		this.fixAllBlocksHeigths();
		_fixBlockPositions.call( this );
		blockFixingCallbacks.push( _fixBlockPositions.bind( this ) );

		_setGridHeight.call( this );
	}

	/**
	 * Fix the grid after a resize
	 * @return {[type]} [description]
	 */
	RexGrid.prototype.endResize = function() {
		// update grid single height and single width
		_calcGridBaseAttrs.call( this );
		// Calculatione
		this.calcAllBlocksHeights();
		this.calcBlocksTop();

		// Fixings
		this.fixAllBlocksHeigths();
		_fixBlockPositions.call( this );

		_setGridHeight.call( this );
	}

	/**
	 * Update RexBlocks information
	 * @return {void}
	 * @since  2.0.4
	 */
	RexGrid.prototype.updateGridBlocks = function() {
		var i;
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			this.gridBlocks[i].w = parseInt( this.gridBlocks[ i ].el.getAttribute( 'data-gs-width' ) );
			this.gridBlocks[i].h = parseInt( this.gridBlocks[ i ].el.getAttribute( 'data-gs-height' ) );
			this.gridBlocks[i].x = parseInt( this.gridBlocks[ i ].el.getAttribute( 'data-gs-x' ) );
			this.gridBlocks[i].y = parseInt( this.gridBlocks[ i ].el.getAttribute( 'data-gs-y' ) );
		}
	}

	/* ===== Global event handlers ===== */

	/**
	 * Changing viewport sizes and grids widths.
	 * @since		1.0.0
	 */
	RexGrid.prototype.handleResizeEvent = function() {
		globalViewportSize = Utils.viewport();

		// Adjusting grid sizes data for every instance
		globalGridWidthsCallbacks.forEach( function( el ) {
			el.call();
		} );

		// Adjusting blocks sizes data for every instance
		blocksHeightsCallbacks.forEach( function( el ) {
			el.call();
		} );

		// Adjusting blocks sizes for every instance
		blockFixingCallbacks.forEach( function( el ) {
			el.call();
		} );
	}

	return RexGrid;
} );