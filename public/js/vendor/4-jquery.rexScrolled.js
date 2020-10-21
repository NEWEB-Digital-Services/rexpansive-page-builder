/*
 *  rexScrolled - v0.1
 *
 *  Made by NEWEB di Simone Forgiarini
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

	"use strict";

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "rexScrolled",
		defaults = {
			offset: 0,
			mobile: true,
			force_launch: false,
			callback: null,
			visiblePercentage: 50	// percentage of element amount that triggers the animation
		};

	// maintain an array of rexScrolled callbacks
	// to call on one single scroll handler
	var instances = [];
	var mainScrollHandler = function() {  
		for( var i=0; i<instances.length; i++) {
			if ( null !== instances[i] ) {
				instances[i].call();
			}
		}
	};

	window.addEventListener( 'scroll', mainScrollHandler );

	// remove instance from array, puttin it to null
	// check if the array is filled only with null
	// if yes, remove scroll handler
	function clearInstance( index ) {
		instances[index] = null;
		for( var i=0; i<instances.length; i++) {
			if ( null !== instances[i] ) return;
		}
		window.removeEventListener( 'scroll', mainScrollHandler );
	}

	// viewport size shared var
	// the window height do not depends on the elements to scroll position
	// its the same for everyone
	// so I can share it between the plugin instances and update it on the page resize
	var globalViewportSize = viewport();
	window.addEventListener('resize', updateGlobalViewportSize);

	/**
	 * Updating the viewport size only if occurs a window resize
	 */
	function updateGlobalViewportSize() {
		globalViewportSize = viewport();
	}

	/**
	 * Find the viewport scroll top value
	 */
	function scrollDocumentPositionTop() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}

	/**
	 * Find the element offset top in the viewport
	 * @param {Element} el element to analize
	 * @param {Int} scrollTop window scroll top value
	 */
	function offsetTop(el, scrollTop) {
		scrollTop = 'undefined' !== typeof scrollTop ? scrollTop : (window.pageYOffset || document.documentElement.scrollTop);
		var rect = el.getBoundingClientRect();
		return rect.top + scrollTop;
	}

	function viewport() {
		var e = window, a = 'inner';
		if (!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width: e[a + 'Width'], height: e[a + 'Height'] };
	}

	// The actual plugin constructor
	function rexScrolled(element, options) {
		this.element = element;

		this.$element = $(element);

		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.properties = {
			launched: false
		};

		this.settings.offset = parseInt(this.element.getAttribute('data-rs-animation-offset') || this.settings.offset);
		this.settings.force_launch = this.element.getAttribute('data-rs-animation-force-launch') || this.settings.force_launch;
		this.settings.visiblePercentage = ( parseInt( this.element.getAttribute('data-rs-animation-visible-percentage') ) || this.settings.visiblePercentage ) / 100;

		// this.bindedScrollHandler = null;

		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(rexScrolled.prototype, {
		init: function () {

			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.settings
			// you can add more functions like the one below and
			// call them like the example bellow
			// vanilla binding

			// this.bindedScrollHandler = this.has_scrolled.bind(this);
			// save instance index
			this.instance_index = instances.length;
			instances.push( this.has_scrolled.bind(this) );

			this.has_scrolled( false );
		},
		has_scrolled: function ( stop_watch ) {
			// prevent remove handler on first launch, to wait the complete creation
			// of the instances array
			stop_watch = 'undefined' === typeof stop_watch ? true : stop_watch;
			if (globalViewportSize.width <= 767 && !this.settings.mobile) {

				this.properties.launched = true;
				if ( stop_watch ) this.removeScrollHandler();
			} else {
				if ( this.properties.launched ) {
					if ( stop_watch ) this.removeScrollHandler();
					return;
				}
				
				var that = this;

				var win_height = globalViewportSize.height,
					scrolled = scrollDocumentPositionTop();

				var blockPositionTop = offsetTop(this.element, scrolled);
				var blockHeight = this.element.offsetHeight;
				var blockPositionBottom = blockPositionTop + blockHeight;

				var offset = win_height * ( this.settings.offset / 100 );

				if ( ( blockPositionTop > ( scrolled + offset ) && blockPositionBottom < ( scrolled + win_height - offset ) ) // full element in viewport
					|| ( ( blockPositionTop + blockHeight * this.settings.visiblePercentage ) < ( scrolled + win_height - offset ) && blockPositionBottom > ( scrolled + win_height - offset ) ) // element in viewport from bottom
					|| ( ( blockPositionTop + blockHeight * this.settings.visiblePercentage ) >= ( scrolled + offset ) && blockPositionTop < ( scrolled + offset ) ) ) /* element in viewport form top */ 
				{
					that.properties.launched = true;
					that.$element.trigger('rs-scrolled-complete');
					if( this.settings.callback && 'function' === typeof this.settings.callback ) {
						this.settings.callback( this.element );
					}
					if ( stop_watch ) this.removeScrollHandler();
				}
			}
		},
		removeScrollHandler: function() {
			clearInstance( this.instance_index );
		}
	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options) {
		var args = arguments;

		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new rexScrolled(this, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof rexScrolled && typeof instance[options] === 'function') {
					returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}
				if (options === 'destroy') {
					$.data(this, 'plugin_' + pluginName, null);
				}
			});
			return returns !== undefined ? returns : this;
		}
	};

})(jQuery, window, document);
