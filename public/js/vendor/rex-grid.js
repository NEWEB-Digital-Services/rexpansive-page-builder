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
		 * @since  1.0.0
		 */
		matches: function( el, selector ) {
			return ( el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector ).call( el, selector );
		},

		/**
		 * Search for parent ancestor element in vanillaJS
		 * @param  {Node}					el
		 * @param  {String}				selector
		 * @return {Node|null}	Parent node that matches the given selector if does exist, null otherwise
		 * @since	 1.0.0
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
		 * @return {Boolean}								Is the number even?
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
		/**
		 * Removing className if present, adding className if not present.
		 * @param  {Element} 	el
		 * @param  {String} 	className
		 * @return {void}
		 * @since  1.0.0
		 */
		toggleClass: function( el, className ) {
			if ( hasClass( el, className ) ) {
				Utils.removeClass( el, className );
			} else {
				Utils.addClass( el, className );
			}
		},

		getCoord: function( val, maxWidth ) {
			return {
				x: val % maxWidth,
				y: Math.floor( val / maxWidth )
			}
		},
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

	/* ===== RexBlock Constructor ===== */
	function RexBlock( options ) {
		this.el = options.el;
		this.blockData = this.el.querySelector( '.rexbuilder-block-data' );
		this.id = options.id;
		this.w = options.w;
		this.h = options.h;
		this.x = options.x;
		this.y = options.y;
		this.hide = options.hide;
		this.domIndex = this.x + ( this.y * 12 );
		this.toCheck = options.toCheck;
	}

	RexBlock.prototype.refreshProperties = function() {
		this.refreshCoords();
		this.refreshHide();
		this.refreshDOMIndex();
	}

	RexBlock.prototype.refreshCoords = function() {
		this.w = parseInt( this.el.getAttribute( 'data-gs-width' ) );
		this.h = parseInt( this.el.getAttribute( 'data-gs-height' ) );

		this.x = parseInt( this.el.getAttribute( 'data-gs-x' ) );
		this.y = parseInt( this.el.getAttribute( 'data-gs-y' ) );
	}

	RexBlock.prototype.refreshHide = function() {
		this.hide = Utils.hasClass( this.el, 'rex-hide-element' );
	}

	/**
	 * Re-calculating DOMIndex.
	 * @return 	{void}
	 * @since		1.0.0
	 */
	RexBlock.prototype.refreshDOMIndex = function() {
		this.domIndex = this.x + ( this.y * 12 );
	}

	/* ===== RexGrid Plugin constructor ===== */
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
			gutter: 20,
			columns: 12
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
			halfSeparatorBlockTop: 0,
			halfSeparatorBlockRight: 0,
			halfSeparatorBlockBottom: 0,
			halfSeparatorBlockLeft: 0,
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
			oneColumnModeActive: false,
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
			beforeCollapseWasFixed: true,
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
			/** @todo set to false on change layout */
			this.properties.editedFromBackend = true;
		}

		this.properties.oneColumnModeActive = 'true' == this.sectionData.getAttribute( 'data-collapse-grid' );

		// Getting gutters from DOM attributes
		_getDOMGutterOptions.call( this );

		// Setting instance properties
		_setGridGutterProperties.call( this );
		_setBlocksGutterProperties.call( this );

		// Applying grid separators
		_applyGridSeparators.call( this );

		this.properties.layout = this.element.getAttribute( 'data-layout' );

		// Calculations of grid width. In this way it's possible to access to this
		// value without causing a layout reflow
		_calcGridBaseAttrs.call( this );

		// Setting min-height to the grid for prevent loading of
		// all images on mobile
		this.element.style.minHeight = globalViewportSize.height + 'px';

		// Finding the blocks in the DOM
		_getGridBlocks.call( this );

		// Applying blocks separators
		_applyBlocksSeparators.call( this );

		// Calculations
		this.calcAllBlocksHeights();
		this.calcAllBlocksTops();

		// Fixings
		// this.fixAllBlocksHeights();
		// this.fixAllBlockPositions();

		_setGridHeight.call( this );
	}

	function _calcGridBaseAttrs() {
		this.properties.gridWidth = this.element.offsetWidth; // Can cause a layout reflow
		this.properties.singleWidth = this.properties.gridWidth / this.options.columns;

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
				hide: Utils.hasClass( blocksArray[ i ], 'rex-hide-element' ),
				toCheck: false
			} );

			_fixNaturalImage.call( this, blockInstance );

			this.gridBlocks.push( blockInstance );
		}

		// Sort blocks array by ascending DOM order
		this.sortBlocks();

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
			if ( !this.gridBlocks[ i ].hide ) {
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

	/**
	 * Sets instance grid separators (gutters) properties.
	 * @return 	{void}
	 * @since   1.0.0
	 */
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

	/**
	 * Sets instance blocks separators (gutters) properties.
	 * Blocks properties are stored in RexGrid instance because
	 * they're equal for all blocks inside the grid.
	 * @return 	{void}
	 * @since   1.0.0
	 */
	function _setBlocksGutterProperties() {
		if ( Utils.isEven( this.options.gutter ) ) {
			this.properties.halfSeparatorBlockTop = this.options.gutter / 2;
			this.properties.halfSeparatorBlockRight = this.options.gutter / 2;
			this.properties.halfSeparatorBlockBottom = this.options.gutter / 2;
			this.properties.halfSeparatorBlockLeft = this.options.gutter / 2;
		} else {
			this.properties.halfSeparatorBlockTop = Math.floor( this.options.gutter / 2 );
			this.properties.halfSeparatorBlockRight = Math.floor( this.options.gutter / 2 );
			this.properties.halfSeparatorBlockBottom = Math.ceil( this.options.gutter / 2 );
			this.properties.halfSeparatorBlockLeft = Math.ceil( this.options.gutter / 2 );
		}
	}

	/**
	 * Applies grid separators (paddings) on grid DOM Element.
	 * @return 	{void}
	 * @since		1.0.0
	 */
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

	/**
	 * Applies blocks separators (gutters) on block content DOM Element.
	 * @return 	{void}
	 * @since		1.0.0
	 */
	function _applyBlocksSeparators() {
		var i = 0;
		var currentBlock;

		// for native loop guarantees more performance efficiency
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			currentBlock = this.gridBlocks[ i ].el.querySelector( '.grid-stack-item-content' );

			currentBlock.style.paddingTop = this.properties.halfSeparatorBlockTop + 'px';
			currentBlock.style.paddingRight = this.properties.halfSeparatorBlockRight + 'px';
			currentBlock.style.paddingBottom = this.properties.halfSeparatorBlockBottom + 'px';
			currentBlock.style.paddingLeft = this.properties.halfSeparatorBlockLeft + 'px';
		}
	}

	/**
	 * Fix blocks top positions for a fixed grid.
	 * @return 	{void}
	 * @since		1.0.0
	 */
	function _fixAllBlockPositionsFixed() {
		var i = 0;
		var j = 0;

		// check other blocks collapse
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			if ( !this.gridBlocks[ i ].toCheck || this.gridBlocks[ i ].hide ) {
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
					this.gridBlocks[ j ].blockData.setAttribute( 'data-gs-y', newY );

					this.gridBlocks[ j ].el.style.top = ( ( newY ) * this.properties.singleHeight ) + 'px';
					this.gridBlocks[ j ].y = newY;
					this.gridBlocks[ j ].domIndex = this.gridBlocks[ j ].x + ( this.gridBlocks[ j ].y * this.options.columns )

					this.gridBlocks[ j ].toCheck = true;
				}
			}

			this.gridBlocks[ i ].toCheck = false;
		}
	}

	/**
	 * Fix blocks top positions for a masonry grid
	 * @return {void}
	 */
	function _fixAllBlockPositionsMasonry() {
		var i = 0;

		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			this.gridBlocks[ i ].el.setAttribute( 'data-gs-y', 0 );
			this.gridBlocks[ i ].blockData.setAttribute( 'data-gs-y', 0 );

			this.gridBlocks[ i ].el.style.top = '0px';
			this.gridBlocks[ i ].y = 0;
			this.gridBlocks[ i ].toCheck = true;
		}
	}

	/**
	 * Fix natural image with a proper class to style correctly 
	 * the image in background as a natural image with IMG tag
	 * @param		{RexBlock}	gridBlockObj	RexBlock instance of the block
	 * 																		with the image to fix
	 * @return 	{void}
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

		blockData.setAttribute( 'data-gs_height', newH );
		blockData.setAttribute( 'data-gs_start_h', newH );
		blockData.setAttribute( 'data-block_height_calculated', newH );
	}
	/**
	 * Getting the block height based on content or background
	 * @param  {RexBlock} 		gridBlockObj
	 * @return {Number|null}	Passed block height
	 * @since	 1.0.0
	 */
	function _getBlockHeight( gridBlockObj ) {
		var currentBlock = gridBlockObj.el;

		// Properties
		var blockData = gridBlockObj.blockData;
		var startH = parseInt( blockData.getAttribute( 'data-gs_start_h' ) );

		var newH;
		var singleWidth = this.properties.singleWidth;

		var gutter = this.options.gutter;

		var originalWidth = gridBlockObj.w;
		var originalHeight = gridBlockObj.h;
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

		// Prevents slider growing in height when resizing
		if ( blockHasSlider ) {
			return null;
		}

		var currentBlockTextHeight = _calculateTextWrapHeight.call( this, currentBlock );

		if ( this.properties.oneColumnModeActive ) {
			originalWidth = this.options.columns;
		}

		if ( 0 === currentBlockTextHeight ) {
			// calculating background image height
			if ( null !== imageWrapper ) {

				var imageWidth = parseInt( itemContent.getAttribute( "data-background_image_width" ) );
				var imageHeight = parseInt( itemContent.getAttribute( "data-background_image_height" ) );

				if ( ( this.properties.singleWidth * gridBlockObj.w ) < imageWidth ) {
					backgroundHeight = ( imageHeight * ( ( originalWidth * singleWidth ) - gutter ) ) / imageWidth;
				} else {
					backgroundHeight = imageHeight;
				}
			}

			// Calculate video height
			/** @todo check me to prevent video auto ratio-resize */
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
				} else if ( this.properties.oneColumnModeActive && this.properties.beforeCollapseWasFixed ) {
					defaultHeight = startH * singleWidth;
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
		if ( !blockHasSlider && !blockHasYoutube && !blockHasVimeo && !blockHasVideo && ( ( ( 'full' === backImgType && 0 === currentBlockTextHeight ) || ( '' === backImgType && 0 === currentBlockTextHeight ) ) && !this.properties.oneColumnModeActive ) ) {
			newH = startH * this.properties.singleHeight;
		} else {
			startH = 0;

			newH = Math.max(
				startH,
				backgroundHeight,
				videoHeight,
				defaultHeight,
				currentBlockTextHeight,
				sliderHeight
			);
		}

		var resizeNotNeeded = false;

		// check if resize really needed
		// fix occurs on first start and not in editor mode
		if ( 0 !== currentBlockTextHeight ) {
			console.log( this.properties.layout, { elRealFluid } );

			if ( 'fixed' === this.properties.layout || ( 1 !== elRealFluid && 'masonry' === this.properties.layout ) ) {
				console.log( { newH, spaceAvailable } );

				if ( newH <= spaceAvailable ) {
					resizeNotNeeded = true;
				}
			}
		} else if ( 0 !== backgroundHeight ) {
			if ( 'fixed' === this.properties.layout ) {
				resizeNotNeeded = true;
			} else if ( 'masonry' === this.properties.layout ) {
				if ( ( 'natural' === backImgType && 1 !== elRealFluid ) || 'full' === backImgType ) {
					if ( newH <= spaceAvailable ) {
						resizeNotNeeded = true;
					}
				}
			}
		} else if ( 0 !== videoHeight ) {
			if ( 'masonry' === this.properties.layout ) {
				resizeNotNeeded = true;
			}
		}

		console.log( { resizeNotNeeded } );

		if ( resizeNotNeeded ) {
			return null;
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

		return newH;
	}

	/**
	 * Calculate single block height, based on the assume that is a collapse
	 * and that the block properties are not defined for the collapse (no mobile layout saved).
	 * @param  {RexBlock} gridBlockObj 	Block to get the dimension
	 * @return {Number}      						Height of the collapsed block
	 * @since	 1.0.0
	 */
	function _getBlockHeightOnCollapse( gridBlockObj ) {
		var currentBlock = gridBlockObj.el;

		var elemData = currentBlock.querySelector( '.rexbuilder-block-data' );
		var textWrap = currentBlock.querySelector( '.text-wrap' );
		var imgWrap = currentBlock.querySelector( '.rex-image-wrapper' );
		var itemContent = currentBlock.querySelector( '.grid-item-content' );

		var blockHasSlider = -1 !== currentBlock.className.indexOf( 'block-has-slider' );
		// var blockIsEmpty = -1 !== itemContent.className.indexOf( 'empty-content' );
		var blockHasYoutube = -1 !== itemContent.className.indexOf( 'youtube-player' );
		var blockHasVideo = ( 0 !== [].slice.call( currentBlock.getElementsByClassName( 'rex-video-wrap' ) ).length ? true : false );
		var blockHasVimeo = -1 !== itemContent.className.indexOf( 'vimeo-player' );

		// var elRealFluid = parseInt( elemData.getAttribute( 'data-element_real_fluid' ) );
		// var backImgType = elemData.getAttribute( 'data-type_bg_block' );
		var newH = 0;
		var hasText = false;
		var spaceNeeded = null;

		// calc the new height, based on the old height props
		var spaceAvailable = gridBlockObj.h * this.properties.singleHeight;
		var newH = Math.round( spaceAvailable / this.properties.singleHeight );

		// check height if the block has text
		if ( textWrap ) {
			if ( textWrap.innerText.trim().length > 0 && textWrap.childElementCount > 0 ) {
				hasText = true;
				spaceNeeded = textWrap.offsetHeight + this.options.gutter;
			}
		}

		// check height if is a masonry grid, with a natural image, without text
		if ( !hasText && imgWrap ) {
			var imgWidth = parseInt( itemContent.getAttribute( "data-background_image_width" ) );
			var imgHeight = parseInt( itemContent.getAttribute( "data-background_image_height" ) );
			var imageWrapperWidth = ( this.properties.singleWidth * gridBlockObj.w ) - this.options.gutter;

			if ( imageWrapperWidth < imgWidth ) {
				spaceNeeded = ( imgHeight * ( ( gridBlockObj.w * this.properties.singleWidth ) - this.options.gutter ) ) / imgWidth;
				Utils.addClass( imgWrap, "small-width" );
			} else {
				spaceNeeded = imgHeight + this.options.gutter;
				Utils.removeClass( imgWrap, "small-width" );
			}
		}

		var defaultRatio = 3 / 4;

		if ( !hasText && ( blockHasYoutube || blockHasVideo || blockHasVimeo ) ) {
			spaceNeeded = Math.round( gridBlockObj.w * this.properties.singleWidth * defaultRatio );
		}

		// calculate slider height
		var sliderRatio = parseFloat( elemData.getAttribute( 'data-slider_ratio' ) );
		if ( blockHasSlider && !isNaN( sliderRatio ) ) {
			if ( !isNaN( sliderRatio ) ) {
				spaceNeeded = gridBlockObj.w * this.properties.singleWidth * sliderRatio;
			} else {
				spaceNeeded = gridBlockObj.w * this.properties.singleWidth * defaultRatio;
			}
		}

		// on collapse the height need to reflect the contents height
		newH = Math.round( spaceNeeded / this.properties.singleHeight );

		return newH;
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

	RexGrid.prototype.fixAllBlocksHeights = function() {
		var i = 0;

		// for native loop guarantees more performance efficiency
		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			if ( !this.gridBlocks[ i ].hide ) {
				this.fixBlockHeight( this.gridBlocks[ i ] );
			}
		}
	}

	/**
	 * Fix the height of a block, according to the builder contents rules
	 * @param  {RexBlock} gridBlockObj RexBlock instance
	 * @return {void}
	 * @since  1.0.0
	 */
	RexGrid.prototype.fixBlockHeight = function( gridBlockObj ) {
		var newH;

		if ( this.properties.oneColumnModeActive ) {
			newH = _getBlockHeightOnCollapse.call( this, gridBlockObj );
		} else {
			newH = _getBlockHeight.call( this, gridBlockObj );
		}

		if ( null === newH ) {
			return;
		}

		_updateBlockDataHeightProperties.call( this, gridBlockObj.blockData, newH );

		// Setting dimensions
		gridBlockObj.h = newH;
		gridBlockObj.el.style.height = ( gridBlockObj.h * this.properties.singleHeight ) + 'px';
		gridBlockObj.el.setAttribute( 'data-gs-height', gridBlockObj.h );
		gridBlockObj.el.setAttribute( 'data-height', gridBlockObj.h );
		gridBlockObj.toCheck = true;
	}

	/**
	 * Fixing the block positions according to heights
	 * @return 	{void}
	 * @since		1.0.0
	 */
	RexGrid.prototype.fixAllBlockPositions = function() {
		switch ( this.properties.layout ) {
			case 'masonry':
				// If layout is masonry we set all the y and x to 0,
				// then the normal collision detection function is called
				_fixAllBlockPositionsMasonry.call( this );
			default:
				_fixAllBlockPositionsFixed.call( this );
				break;
		}
	}

	/**
	 * Calculating top of the grid blocks.
	 * @return 	{void}
	 * @since		1.0.0
	 */
	RexGrid.prototype.calcAllBlocksTops = function() {
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
	/**
	 * Fixing of heights and positions that are necessary after
	 * the 'load' Event has fired.
	 * @return 	{void}
	 * @since		1.0.0
	 * @todo 		Change name?
	 */
	RexGrid.prototype.fixAfterLoad = function() {
		// Fixings
		this.fixAllBlocksHeights();
		this.fixAllBlockPositions();

		_setGridHeight.call( this );

		// Resetting min height that was set in _init function
		this.element.style.minHeight = '';
	}

	/**
	 * Update RexBlocks information reading from DOM attributes.
	 * @return {void}
	 * @since  1.0.0
	 */
	RexGrid.prototype.updateGridBlocks = function() {
		var i = 0;

		for ( i = 0; i < this.gridBlocksTotal; i++ ) {
			this.gridBlocks[ i ].refreshProperties();
		}
	}

	/**
	 * Sorts blocks. Order based on block DOM Index,
	 * so it has to be properly updated before calling
	 * this function.
	 * @return 	{void}
	 * @since		1.0.0
	 */
	RexGrid.prototype.sortBlocks = function() {
		this.gridBlocks.sort( function( blockA, blockB ) {
			return ( blockA.domIndex - blockB.domIndex )
		} );
	}

	/**
	 * Fix the grid after a resize
	 * @return {void}
	 * @since	 1.0.0
	 * @todo	 Change name?
	 */
	RexGrid.prototype.endResize = function() {
		// Checking layout change and if the grid has to collapse
		this.properties.layout = this.element.getAttribute( 'data-layout' );
		this.properties.oneColumnModeActive = 'true' == this.sectionData.getAttribute( 'data-collapse-grid' );

		// Update grid width, single height and single width
		_calcGridBaseAttrs.call( this );

		// Calculations
		this.calcAllBlocksHeights();
		this.calcAllBlocksTops();

		// Fixings
		this.fixAllBlocksHeights();
		this.fixAllBlockPositions();

		_setGridHeight.call( this );
	}

	/**
	 * Filter the grid elements by a certain rule
	 * @param  {String} rule class to filter
	 * @return {[type]}      [description]
	 */
	RexGrid.prototype.filter = function( rule ) {
		var i;
		var toMaintain = [];
		var toMaintainCoords = [];
		var toRemove = [];

		var idx = new IndexedGrid( this.options.columns );

		// get all elements
		if ( '*' == rule ) {
			for ( i = 0; i < this.gridBlocksTotal; i++ ) {
				toMaintain.push( this.gridBlocks[ i ].el );
				toMaintainCoords.push( {
					x: this.gridBlocks[ i ].x,
					y: this.gridBlocks[ i ].y,
					w: this.gridBlocks[ i ].w,
					h: this.gridBlocks[ i ].h
				} )
				this.gridBlocks[ i ].hide = false;
			}
		} else {
			// filter by a rule
			for ( i = 0; i < this.gridBlocksTotal; i++ ) {
				if ( Utils.hasClass( this.gridBlocks[ i ].el, rule ) ) {
					toMaintain.push( this.gridBlocks[ i ].el );
					toMaintainCoords.push( {
						x: 0,
						y: 0,
						w: this.gridBlocks[ i ].w,
						h: this.gridBlocks[ i ].h
					} )
					this.gridBlocks[ i ].hide = false;
				} else {
					this.gridBlocks[ i ].hide = true;
					toRemove.push( this.gridBlocks[ i ].el );
				}
			}

			idx.setGrid( 0, 0, toMaintainCoords[ 0 ].w, toMaintainCoords[ 0 ].h );
			var idx_pos;
			var idx_cords;
			for ( i = 1; i < toMaintainCoords.length; i++ ) {
				idx_pos = idx.willFit( toMaintainCoords[ i ].w, toMaintainCoords[ i ].h );
				if ( idx_pos ) {
					idx_cords = Utils.getCoord( idx_pos, this.options.columns );
					idx.setGrid( idx_cords.x, idx_cords.y, toMaintainCoords[ i ].w, toMaintainCoords[ i ].h )
					toMaintainCoords[ i ].x = idx_cords.x;
					toMaintainCoords[ i ].y = idx_cords.y;
				}
			}
		}

		var that = this;
		var timeline = anime.timeline( {
			duration: 200,
			easing: 'easeInOutQuad',
			begin: function() {
				// handle filter click here
			},
			complete: function( anim ) {
				// animation complete
			}
		} );

		timeline.add( {
			targets: toMaintain,
			scale: 1,
			opacity: 1,
			left: function( target, index ) {
				// target.setAttribute('data-gs-x', toMaintainCoords[index].x);
				return ( toMaintainCoords[ index ].x * that.properties.singleWidth ) + 'px';
			},
			top: function( target, index ) {
				return ( toMaintainCoords[ index ].y * that.properties.singleHeight ) + 'px';
			},
		} ).add( {
			targets: toRemove,
			scale: 0,
			opacity: 0
		}, '-=200' );
	}

	return RexGrid;
} );