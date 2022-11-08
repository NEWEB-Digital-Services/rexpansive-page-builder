/**
 * RexIndicator script in plain js
 * @version 1.0.0
 * @todo manage missing condition (view jQuery version)
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

	window.addEventListener('resize', globalResizeHandler)

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
		place_indicator.call(this)
		resizeCallbacks.push(resize_callback.bind(this))
	}

	function resize_callback() {
		set_indicator_dimension.call(this)
		place_indicator.call(this)
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
          const parentInfo = this.after_ref.getBoundingClientRect()
          const elementInfo = this.element.getBoundingClientRect()
          const newHeight = parentInfo.y + parentInfo.height - elementInfo.y - (elementInfo.height / 2)
          this.indicator.style.setProperty('--rex-indicator-wrap-height', `${newHeight}px`)
          break
        }
        case 'top': {
          const parentInfo = this.after_ref.getBoundingClientRect()
          const elementInfo = this.element.getBoundingClientRect()
          const newHeight = elementInfo.y - parentInfo.y + (elementInfo.height / 2)
          this.indicator.style.setProperty('--rex-indicator-wrap-height', `${newHeight}px`)
          break
        }
        default:
          break
      }
    }

    /**
     * moving the indicator in the right place
     */
    function place_indicator() {
      let p = {
        top: 0,
        left: 0
      }

      switch (this.options.relative_to) {
        case 'block':
        //   if (viewport().width >= parseInt(_plugin_frontend_settings.rexIndicator.collapse_dimension)) {
            p = _get_position_desktop_block_relative.call(this)
        //   } else {
        //     p = this._get_position_mobile()
        //   }
          break
        case 'start':
        //   if (viewport().width >= parseInt(_plugin_frontend_settings.rexIndicator.collapse_dimension)) {
            p = _get_position_desktop_start_relative.call(this)
        //   } else {
        //     p = this._get_position_mobile()
        //   }
          break
        case 'parent': {
        //   if (viewport().width >= parseInt(_plugin_frontend_settings.rexIndicator.collapse_dimension)) {
            p = _get_position_desktop_parent_relative.call(this)
        //   } else {
        //     p = this._get_position_mobile()
        //   }
          break
        }
        default:
          break
      }

	  setOffset(this.indicator, p)
    }

	function _get_position_desktop_block_relative() {}
	function _get_position_desktop_start_relative() {}

    /**
     * Positioning relative to the parent
     */
    function _get_position_desktop_parent_relative() {
      const p = {
        top: 0,
        left: 0
      }

      const b_offset = offset(this.block_ref)
      const p_offset = offset(this.element.parentElement)
	  const e_offset = offset(this.element)
	  const a_offset = offset(this.after_ref)

      // define top position
      if (this.options.to == 'left' || this.options.to == 'right') {
        p.top = e_offset.top + (outerHeight(this.element, true) / 2) - (this.indicator.getBoundingClientRect().height / 2)
      } else {
        if (this.options.to == 'top') {
          if (this.options.to_amount === 'auto') {
            p.top = b_offset.top - (this.indicator.getBoundingClientRect().height / 2)
          } else {
            p.top = a_offset.top
          }
        } else if (this.options.to == 'bottom') {
          if (this.options.to_amount === 'auto') {
            p.top = b_offset.top + outerHeight(this.block_ref, true) - (this.indicator.getBoundingClientRect().height / 2)
          } else {
            p.top = e_offset.top + (this.element.getBoundingClientRect().height / 2)
          }
        }
      }

      // define left position
      if (this.options.to == 'top' || this.options.to == 'bottom') {
        if (this.options.to_amount === 'auto') {
          p.left = p_offset.left + (this.indicator.getBoundingClientRect().width / 2)
        } else {
          p.left = e_offset.left - (this.indicator.getBoundingClientRect().width / 2)
        }
      } else {
        if (this.options.to == 'left') {
          if (this.options.to_amount === 'auto') {
            p.left = b_offset.left - (this.indicator.getBoundingClientRect().width / 2)
          } else {
            const line_parent_offset = this.indicator_moved_parent.getBoundingClientRect()
            p.left = line_parent_offset.left
          }
        } else if (this.options.to == 'right') {
          if (this.options.to_amount === 'auto') {
            p.left = b_offset.left + outerWidth(this.block_ref) - (this.indicator.getBoundingClientRect().width / 2)
          } else {
            const line_parent_offset = this.indicator_moved_parent.getBoundingClientRect()
            // todo: take count of indicator width
            p.left = line_parent_offset.left + line_parent_offset.width - this.indicator.getBoundingClientRect().width
          }
        }
      }

      return p
    }

	function parents(el, selector) {
		const parents = [];
		while ((el = el.parentNode) && el !== document) {
			if (!selector || el.matches(selector)) parents.unshift(el);
		}
		return parents;
	}

	function offset(el) {
		const box = el.getBoundingClientRect()
		const docElem = document.documentElement
		return {
			top: box.top + window.pageYOffset - docElem.clientTop,
			left: box.left + window.pageXOffset - docElem.clientLeft
		}
	}

	function setOffset(el, coordinates) {
		el.style.top = `${coordinates.top}px`
		el.style.left = `${coordinates.left}px`
	}

	function outerHeight(el, withMargin = false) {
		if (!withMargin) return el.offsetHeight
	
		const style = getComputedStyle(el);

		return (
			el.getBoundingClientRect().height +
			parseFloat(style.getPropertyValue('margin-top')) +
			parseFloat(style.getPropertyValue('margin-bottom'))
		);
	}

	function outerWidth(el, withMargin = false) {
		if (!withMargin) return el.offsetWidth

		const style = getComputedStyle(el);

		return (
			el.getBoundingClientRect().width +
			parseFloat(style.getPropertyValue('margin-left')) +
			parseFloat(style.getPropertyValue('margin-right'))
		);
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