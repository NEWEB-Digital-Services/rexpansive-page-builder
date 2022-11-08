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
		this.indicator = null
		// get element as first argument
		if (arguments[0]) {
			this.element = arguments[0];
		}

		const defaults = {
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

		var inlineOptionsAttr = this.element.getAttribute('data-rex-indicator-options')
		if (null !== inlineOptionsAttr) {
			try {
				var inlineOptions = JSON.parse(inlineOptionsAttr)
				this.options = extendDefaults(this.options, inlineOptions);
			} catch (error) {
				console.warn('[RexIndicator]: inline options passed in wrong manner')
			}
		}

		this.indicator = this.element.querySelector(this.options.indicator)
		this.block_ref = parents(this.element, this.options.block_parent)
		this.after_ref = parents(this.element, this.options.after)
		console.log(this)
		instances.push( this );
	}

	function parents(el, selector) {
		const parents = [];
		while ((el = el.parentNode) && el !== document) {
			if (!selector || el.matches(selector)) parents.unshift(el);
		}
		return parents;
	}

	// Utility method to extend defaults with user options
	function extendDefaults(source, properties) {
		let property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}

	return RexIndicator
})