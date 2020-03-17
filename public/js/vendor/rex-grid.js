;(function(window, factory) {
	'use strict';
	window.RexGrid = factory(window);
})( 'undefined' !== typeof window ? window : this, function() {

	/* ===== Utilities ===== */
	var Utils = {
		/**
		 * Calculate viewport window and height.
		 * @return	{Object}	Window width & height
		 * @since		1.0.0
		 */
		viewport: function() {
			var e = window, a = 'inner';
			if (!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width: e[a + 'Width'], height: e[a + 'Height'] };
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
				if ( properties.hasOwnProperty(property) ) {
					source[property] = properties[property];
				}
			}
			return source;
		},

		toggleClass: function(el, className) {
			if (hasClass(el, className)) {
				Utils.removeClass(el, className);
			} else {
				Utils.addClass(el, className);
			}
		}
	}

	// Class manipulation utils
	if ('classList' in document.documentElement) {
		Utils.hasClass = function (el, className) { return el.classList.contains(className); };
		Utils.addClass = function (el, className) { el.classList.add(className); };
		Utils.removeClass = function (el, className) { el.classList.remove(className); };
	} else {
		Utils.hasClass = function (el, className) {	return new RegExp('\\b' + className + '\\b').test(el.className); };
		Utils.addClass = function (el, className) { if (!hasClass(el, className)) { el.className += ' ' + className }; };
		Utils.removeClass = function (el, className) { el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), ''); };
	}

	/* ===== Global vars ===== */
	var globalViewportSize = Utils.viewport();
	var globalGridWidthsCallbacks = [];

	/* ===== Plugin constructor ===== */
	function RexGrid() {
		this.element = null;
		this.gridBlocks = [];

		// Get element as first argument
		if ( arguments[0] ) {
			this.element = arguments[0];
		}

		var defaults = {
			type: 'fixed'
		};

		// Create options by extending defaults with the passed in arugments.
		// Get options as second argument
		if ( arguments[1] && 'object' === typeof arguments[1] ) {
			this.options = Utils.extendDefaults(defaults, arguments[1]);
		} else {
			this.options = defaults;
		}

		this.properties = {};

		// Making the instance accessible from the outside
		this.RexGridInstance = this;
		
		_init.call(this);
	}

	/* ===== Private Methods ===== */
	function _init() {
		// Calculations of grid width. In this way it's possible to access to this
		// value without causing a layout reflow
		_calcGridWidth.call(this);
		globalGridWidthsCallbacks.push( _calcGridWidth.bind(this) );

		// Finding the block inside the grid
		_getGridBlocks.call(this);

		this.calcBlocksHeights();
	}

	function _calcGridWidth() {
		this.properties.gridWidth = this.element.offsetWidth;		// Can cause a layout reflow
	}

	function _calcSingleHeight() {
		this.properties.singleHeight = this.properties.gridWidth / 12;
		this.properties.singleWidth = this.properties.singleHeight;
	}

	function _getGridBlocks() {
		var gridElement = this.element;
		var blocksArray = Array.prototype.slice.call( gridElement.getElementsByClassName( 'rex-grid-block' ) );

		this.gridBlocks = blocksArray;
	}

	/**
	 * Calculating height of the grid blocks.
	 * @since	1.0.0
	 */
	RexGrid.prototype.calcBlocksHeights = function(){
		_calcSingleHeight.call(this);

		var tot_blocksArray = this.gridBlocks.length;
		var i = 0;

		var currentBlockGridWidth = 0;
		var currentBlockGridHeight = 0;
		var currentBlockRealWidth = 0;
		var currentBlockRealHeight = 0;

		// for native loop guarantees more performance efficiency
		for ( i = 0; i < tot_blocksArray; i++ ) {
			var currentBlock = this.gridBlocks[i];

			currentBlockGridWidth = currentBlock.getAttribute( 'data-rex-grid-width' );
			currentBlockGridHeight = currentBlock.getAttribute( 'data-rex-grid-height' );

			currentBlockRealWidth = this.properties.singleWidth * currentBlockGridWidth;
			currentBlockRealHeight = this.properties.singleHeight * currentBlockGridHeight;

			currentBlock.style.width = currentBlockRealWidth + 'px';
			currentBlock.style.height = currentBlockRealHeight + 'px';
		}

		// console.log( 'fine' );
		
	}

	/* ===== Global events ===== */
	window.addEventListener('resize', handleResizeEvent);

	/**
	 * Changing viewport sizes and grids widths.
	 * @since		1.0.0
	 */
	function handleResizeEvent() {
		globalViewportSize = Utils.viewport();
		
		globalGridWidthsCallbacks.forEach(function(el) {
			el.call();
		});
	}

	return RexGrid;
});