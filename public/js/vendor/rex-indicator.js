/**
 * RexIndicator script in plain js
 * @version 1.0.0
 */
;( function( window, factory ) {
  'use strict';
  window.RexIndicator = factory( window );
} )( 'undefined' !== typeof window ? window : this, function() {
	const instances = []

	function RexIndicator() {
		this.element = null;
		this.inidicator = null
		// get element as first argument
		if (arguments[0]) {
			this.element = arguments[0];
		}

		var defaults = {
			indicator: '.rex-indicator__wrap--absolute',
			block_parent: '.perfect-grid-item',
			after: '.rexpansive_section'
		};

		// Create options by extending defaults with the passed in arugments
		// get options as second argument
		if (arguments[1] && typeof arguments[1] === 'object') {
			this.options = extendDefaults(defaults, arguments[1]);
		} else {
			this.options = defaults;
		}

		this.inidicator = this.element.querySelector(this.options.indicator)
		instances.push( this );
	}

	
	// Utility method to extend defaults with user options
	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}

	return RexIndicator
})