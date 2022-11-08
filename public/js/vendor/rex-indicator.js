/**
 * RexIndicator script in plain js
 * @version 1.0.0
 */
;( function( window, factory ) {
  'use strict';
  window.RexIndicator = factory( window );
} )( 'undefined' !== typeof window ? window : this, function() {
	const instances = []

	/**
	 * Handling indicator positions on resize
	 * Keeping a single resize handler with multiple callbacks 
	 */
	const resizeCallbacks = []
		function globalResizeHandler() {
		for (let i = 0; i < resizeCallbacks.length; i++) {
			if (null === resizeCallbacks[i]) continue
			resizeCallbacks[i].call()
		}
	}

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

		// get eventually inline options
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
		this.block_ref = parents(this.element, this.options.block_parent).pop()
		this.after_ref = parents(this.element, this.options.after).pop()
		this.indicator_moved_parent = null

		init.call(this)

		instances.push( this );

		console.log(this)
	}

	function init() {
		move_indicator.call(this)
		set_indicator_dimension.call(this)
	}

	function move_indicator() {
		this.after_ref.after(this.indicator)
		this.indicator_moved_parent = this.indicator.parentElement
	}

    /**
     * Set indicator dimension
     * @returns void
     */
    function set_indicator_dimension() {
      if (this.options.to_amount === 'auto') return

      // todo: refactor
      switch (this.options.to) {
        case 'left': {
          const L = this.element.getBoundingClientRect().x
          const l = this.indicator_moved_parent.getBoundingClientRect().x
          this.indicator.style.setProperty('--rex-indicator-wrap-width', `${L - l}px`)
          break
        }
        case 'right': {
          const info = this.indicator_moved_parent.getBoundingClientRect()
          const L = this.element.getBoundingClientRect().x
          const newWidth = info.x + info.width - L
          this.indicator.style.setProperty('--rex-indicator-wrap-width', `${newWidth}px`)
          break
        }
        case 'bottom': {
          // const
          const parentInfo = this.$after_ref.get().pop().getBoundingClientRect()
          const elementInfo = this.element.getBoundingClientRect()
          const newHeight = parentInfo.y + parentInfo.height - elementInfo.y - (elementInfo.height / 2)
          this.indicator.style.setProperty('--rex-indicator-wrap-height', `${newHeight}px`)
          break
        }
        case 'top': {
          const parentInfo = this.$after_ref.get().pop().getBoundingClientRect()
          const elementInfo = this.element.getBoundingClientRect()
          const newHeight = elementInfo.y - parentInfo.y + (elementInfo.height / 2)
          this.indicator.style.setProperty('--rex-indicator-wrap-height', `${newHeight}px`)
          break
        }
        default:
          break
      }
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