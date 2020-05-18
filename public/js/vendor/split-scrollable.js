;(function(window, factory) {
	'use strict';
	window.SplitScrollable = factory(window);
})( 'undefined' !== typeof window ? window : this, function() {
	var instances = [];

	// Callbacks arrays
	var scrollCallbacksArray = [];
	var resizeCallbacksArray = [];

	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this;
			var args = arguments;
			var later = function () {
			timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	var globalViewport = _viewport();

	function SplitScrollable() {
		this.element = null;

		this.splitScrollWrapper = null;

		this.scrollElsWrapper = null;
		this.scrollEls = [];
		this.scrollElsToWatch = [];
		this.totScrollEls = 0;
		this.totScrollElsToWatch = 0;
		this.actualScrollEl = null;

		this.opacityElsWrapper = null;
		this.opacityEls = [];
		this.totOpacityEls = 0;

		this.scrollElsState = [];

		this.scrollObserver = null;
		this.userScrolled = false;

		if (arguments[0]) {
			this.element = arguments[0];
		}

		var defaults = {
			splitScrollElClass: 'split-scrollable-container',
			splitScrollActiveElClass: 'split-scrollable--active',
			scrollElsWrapClass: 'scroll-block-wrapper',
			scrollElsClass: 'scroll-block',
			scrollElsToWatchClass: 'scroll-block',
			scrollElActiveClass: 'scroll-block-active',
			opacityElsWrapClass: 'opacity-block-wrapper',
			opacityElsClass: 'opacity-block',
			opacityFakeElClass: 'opacity-block-fake',
			opacityElActiveClass: 'opacity-block-active',
			initializeComplete: null
		};

		// Create options by extending defaults with the passed in arugments
		if (arguments[1] && typeof arguments[1] === "object") {
			this.options = extendDefaults(defaults, arguments[1]);
		} else {
			this.options = defaults;
		}

		_initialize.call(this);
		_addWrappers.call(this);

		if ( 'function' === typeof this.options.initializeComplete ) {
			this.options.initializeComplete.call(this);
		}

		_fixStickyHeight.call(this);
		
		// resizeCallbacksArray.push(_handleResize.bind(this));

		// check first scroll
		_handleScroll.call(this);
		scrollCallbacksArray.push(_handleScroll.bind(this));

		// simulateLast.call(this);
		instances.push( this );
	};

	function _initialize() {
		this.scrollEls = [].slice.call( this.element.getElementsByClassName(this.options.scrollElsClass) );
		this.totScrollEls = this.scrollEls.length;
		if ( this.options.scrollElsClass === this.options.scrollElsToWatchClass ) {
			this.scrollElsToWatch = this.scrollEls;
		} else {
			for( var j=0; j < this.totScrollEls; j++ ) {
				this.scrollElsToWatch.push( this.scrollEls[j].querySelector('.' + this.options.scrollElsToWatchClass ) );
			}
		}
		this.totScrollElsToWatch = this.scrollElsToWatch.length;

		this.opacityEls = [].slice.call( this.element.getElementsByClassName(this.options.opacityElsClass) );
		this.totOpacityEls = this.opacityEls.length;

		var i=0;
		for( i=0; i < this.totScrollEls; i++ ) {
			this.scrollElsToWatch[i].setAttribute('data-scroll-el-index', i);
			this.scrollElsState.push(null)
		}

		addClass( this.element, this.options.splitScrollActiveElClass );
	}

	function _addWrappers() {
		if ( ! hasClass( this.scrollEls[0].parentNode, this.options.scrollElsWrapClass ) ) {
			this.scrollElsWrapper = document.createElement('div');
			addClass( this.scrollElsWrapper, this.options.scrollElsWrapClass );

			this.scrollEls[0].parentNode.appendChild( this.scrollElsWrapper );
			for( var i=0; i < this.totScrollEls; i++ ) {
				this.scrollElsWrapper.appendChild( this.scrollEls[i] );
			}
		} else {
			this.scrollElsWrapper = this.scrollEls[0].parentNode;
		}

		if ( ! hasClass( this.opacityEls[0].parentNode, this.options.opacityElsWrapClass ) ) {
			this.opacityElsWrapper = document.createElement('div');
			addClass( this.opacityElsWrapper, this.options.opacityElsWrapClass );

			this.opacityEls[0].parentNode.appendChild( this.opacityElsWrapper );
			for( var i=0; i < this.totOpacityEls; i++ ) {
				this.opacityElsWrapper.appendChild( this.opacityEls[i] );
			}
		} else {
			this.opacityElsWrapper = this.opacityEls[0].parentNode;
		}

		if ( ! hasClass( this.scrollElsWrapper.parentNode, this.options.splitScrollElClass ) ) {
			this.splitScrollWrapper = document.createElement('div');
			addClass( this.splitScrollWrapper, this.options.splitScrollElClass );
			this.scrollElsWrapper.parentNode.appendChild(this.splitScrollWrapper);
			this.splitScrollWrapper.appendChild(this.scrollElsWrapper);
			this.splitScrollWrapper.appendChild(this.opacityElsWrapper);
		} else {
			this.splitScrollWrapper = this.element;
		}
	}

	function _destroyWrappers() {
		unwrap(this.scrollElsWrapper);
		unwrap(this.opacityElsWrapper);

		unwrap(this.splitScrollWrapper);
	}

	/**
	 * Updates global viewport
	 * @returns	{void}
	 * @since		1.1.0
	 */
	function _updateGlobalViewport() {
		globalViewport = _viewport();
	}

	// In this way when resizing there will be
	// a globalViewport update before all the
	// resize operations
	resizeCallbacksArray.push(_updateGlobalViewport);

	/**
	 * Fix the height of the container of the opacity blocks
	 * to stop the sticky effect inside the container
	 * otherwise it goes on.
	 * @returns	{void}
	 * @since		1.0.0
	 */
	function _fixStickyHeight() {
		this.opacityElsWrapper.style.height = parseFloat( getComputedStyle( this.opacityEls[this.opacityEls.length-1], null ).top.replace("px", "") ) + 
		( this.opacityEls[this.opacityEls.length-1].offsetHeight ) + 'px';
	}

	/* ===== Scroll handling ===== */
	/**
	 * Watching the browser scrolling, bouncing the event
	 * every 150 ms to prevent event polling
	 * @return {void}
	 * @deprecated 2.0.5
	 */
	function _watchScroll() {
		var userScrolled = false;

		function scrollHandler() {
			userScrolled = true;
		}

		window.addEventListener( 'scroll', scrollHandler );

		rInterval( function handleInterval() {
			if ( userScrolled ) {
				scrollCallbacksArray.forEach(function (cb) {
					cb.call();
				});
				userScrolled = false;
			}
		}, 150);
	}

	function scrollHandler(event) {
		scrollCallbacksArray.forEach(function (cb) {
			cb.call();
		});
	}

	/**
	 * Guesses and sets the index to show in the viewport.
	 * @returns		{void}
	 * @since			1.0.0
	 */
	function _handleScroll() {
		var guessedIndex = _guessIndex.call(this);

		// get last guess
		if ( guessedIndex ) {
			if ( this.actualScrollEl !== guessedIndex ) {
				_setGuessedIndex.call( this, guessedIndex );
			}
		}
	}

	/**
	 * Retrieving the index of the element we want to see on the viewport.
	 * @returns	The index of the element to show
	 * @since		1.1.0
	 */
	function _guessIndex() {
		var totscroll = scrollDocumentPositionTop();
		var scrollOffset = 0;		// Never set, not necessary I think
		var i, offsetEl, guessedIndex = null;
		var generalCondition = false;
		// var heightFactor = ( this.aspectRatio >= 1 ? 0.5 : 0.2 );

		// De-comment for debugging
		// this.debugEl.innerText = totscroll + ' + ' + globalViewport.height + ' = ' + ( totscroll + globalViewport.height ) + '\n';
		
		for( i=0; i < this.totScrollElsToWatch; i++ ) {
			if ( this.scrollElsToWatch[i] ) {
				offsetEl = offsetAbsolute( this.scrollElsToWatch[i] );

				// De-comment for debugging
				// this.debugEl.innerText += i + ' : ' + offsetEl.top + ' -- ' + offsetEl.height + ' ## ' + ( offsetEl.top - totscroll ) + '\n';

				// view conditions
				generalCondition = ( (offsetEl.top > totscroll + scrollOffset) || ( offsetEl.top + offsetEl.height > totscroll + scrollOffset ) ) && ( offsetEl.top < totscroll + globalViewport.height + scrollOffset );

				if ( generalCondition ) {
					guessedIndex = this.scrollElsToWatch[i].getAttribute('data-scroll-el-index');
					break;
				}
			}
		}

		return guessedIndex;
	}

	/**
	 * Setting the index of the element to show in the viewport.
	 * @param		{Number}	index			The index of the element to show
	 * @return	{void}
	 * @since		1.1.0
	 */
	function _setGuessedIndex( index ) {
		_activateScrollEl.call( this, index );
		this.actualScrollEl = index;
	}

	/**
	 * Shows the indexed element in the viewport
	 * by adding specific classes. Hides other elements
	 * @param		{Number}	targetIndex		The index of the element to show
	 * @since		1.0.0
	 */
	function _activateScrollEl( targetIndex ) {
		for( var i=0; i < this.totScrollEls; i++ ) {
			if ( this.scrollElsToWatch[i].getAttribute('data-scroll-el-index') == targetIndex ) {
				if (this.scrollEls[i]) {
					addClass( this.scrollEls[i], this.options.scrollElActiveClass );
				}
				if (this.opacityEls[i]) {
					addClass( this.opacityEls[i], this.options.opacityElActiveClass );
				}
			} else {
				if (this.scrollEls[i]) {
					removeClass( this.scrollEls[i], this.options.scrollElActiveClass );
				}
				if (this.opacityEls[i]) {
					removeClass( this.opacityEls[i], this.options.opacityElActiveClass );
				}
			}
		}
	}

	/* ===== Resize handling ===== */
	/**
	 * Watch resize
	 * @return {void}
	 * @deprecated 2.0.5
	 */
	function _watchResize() {
		var userResized = false;

		function resizeHandler() {
			userResized = true;
		}

		window.addEventListener( 'resize', resizeHandler );

		rInterval( function() {
			if ( userResized ) {
				resizeCallbacksArray.forEach(function (cb) {
					cb.call();
				});
				userResized = false;
			}
		}, 150);
	}

	function resizeHandler(event) {
		resizeCallbacksArray.forEach(function (cb) {
			cb.call();
		});
	}

	// function _handleResize() {
		// calculate sticky wrapper height
		// fixStickyHeight.call(this);
	// }

	// Utilities
	// Class utilities
	var hasClass, addClass, removeClass, toggleClass;
	if ('classList' in document.documentElement) {
		hasClass = function (el, className) { return el.classList.contains(className); };
		addClass = function (el, className) { el.classList.add(className); };
		removeClass = function (el, className) { el.classList.remove(className); };
	} else {
		hasClass = function (el, className) {
			return new RegExp('\\b' + className + '\\b').test(el.className);
		};
		addClass = function (el, className) {
			if (!hasClass(el, className)) { el.className += ' ' + className; }
		};
		removeClass = function (el, className) {
			el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
		};
	}

	toggleClass = function (el, className) {
		if (hasClass(el, className)) {
			removeClass(el, className);
		} else {
			addClass(el, className);
		}
	}

	/**
	 * Unwraps a DOM Element
	 * @param		{Element}	element DOM Element to move children and delete
	 * @returns	{void}
	 * @since		1.1.0
	 */
	function unwrap(element) {
		// Get the element's parent node
		var parent = element.parentNode;

		// Move all children out of the element
		while (element.firstChild) {
			parent.insertBefore(element.firstChild, element);
		}

		// Remove the empty element
		parent.removeChild(element);
	}

	// scroll and size utilities
	/**
	 * Find element offset relative to scroll of the viewport
	 * @param  {Element} el element to check
	 * @return {Object}    top and left scroll of the element
	 */
	function offsetRelative( el ) {
		var rect = el.getBoundingClientRect();

		return {
			top: rect.top,
			left: rect.left,
			height: rect.height
		}
	}

	/**
	 * Find element offset relative to the document
	 * @param  {Element} el element to check
	 * @return {Object}    top, left and height of the element
	 */
	function offsetAbsolute( el ) {
		var rect = el.getBoundingClientRect();

		return {
			top: rect.top  + ( window.pageYOffset || document.body.scrollTop )  - ( document.body.clientTop  || 0 ),
  			left: rect.left + ( window.pageXOffset || document.body.scrollLeft ) - ( document.body.clientLeft || 0 ),
  			height: rect.height
		}
	}

	/**
	 * Find the viewport scroll top value
	 * @return {Number} scroll top value
	 */
	function scrollDocumentPositionTop() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}

	/**
	 * Calculate viewport window and height
	 * @return {Object} width, height of the viewport
	 */
	function _viewport() {
		var e = window, a = 'inner';
		if (!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width: e[a + 'Width'], height: e[a + 'Height'] };
	}

	// timing utilities

	/**
	 * Set interval function rewritten with requestanimation frame
	 * @param  {Function} callback [description]
	 * @param  {Number}   delay    delay time
	 * @return {Object}
	 */
	function rInterval( callback, delay ) {
		var dateNow = Date.now,
			requestAnimation = window.requestAnimationFrame,
			start = dateNow(),
			stop,
			intervalFunc = function() {
				dateNow() - start < delay || ( start += delay, callback());
				stop || requestAnimation( intervalFunc )
			}
		requestAnimation( intervalFunc );

		return {
			clear: function(){ stop=1 }
		}
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

	/* ===== Deprecated functions ===== */

	/**
	 * @deprecated	1.1.0
	 */
	function intersectionObserverCallback(entries, observer) {
		var entry;
		var entryIndex;
		
		var tot_entries = entries.length;
		var i = 0;
		for (; i < tot_entries; i++) {
			// handleEntityObserve.call(that, entries[i]);
			// newHandleEntityObserve.call(that, entries[i]);	// è questa qua sotto

			entry = entries[i];
			entryIndex = parseInt(entry.target.getAttribute('data-scroll-el-index'));
			this.scrollElsState[entryIndex] = entry;

			if (entry.isIntersecting) {
				if (entry.intersectionRatio > 0.8) {
					// activeElementOnScroll.call(this, entryIndex)
					entry.target.setAttribute('data-ratio-greater-08', 1);
				} else {
					entry.target.setAttribute('data-ratio-greater-08', 0);
				}
			} else {
				entry.target.setAttribute('data-ratio-greater-08', 0);
			}
		}

		for (i = 0; i < this.totScrollEls; i++) {
			if (this.scrollElsToWatch[i].getAttribute('data-ratio-greater-08') == '1') {
				// that.scrollElsToWatch[i].style.backgroundColor = 'red';
				activeElementOnScroll.call(this, i);

				// break;
			} else {
				// 	that.scrollElsToWatch[i].style.backgroundColor = '';
			}
		}
	}

	/**
	 * @deprecated	1.1.0
	 */
	function watchIntersectionObserver() {
		this.scrollObserver = new IntersectionObserver( intersectionObserverCallback.bind(this), {
			// threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
			threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
		});

		var j = 0;
		for( j=0; j < this.totScrollEls; j++ ) {
			this.scrollObserver.observe( this.scrollElsToWatch[j] );
		}
	}

	/**
	 * @deprecated	1.1.0
	 */
	function handleEntityObserve(entry) {
		var entryIndex = parseInt(entry.target.getAttribute('data-scroll-el-index'));
		this.scrollElsState[entryIndex] = entry;

		if (entry.isIntersecting) {
			if (entry.intersectionRatio > 0.8) {
				// activeElementOnScroll.call(this, entryIndex)
				entry.target.setAttribute('data-ratio-greater-08', 1);
				
			} else {
				entry.target.setAttribute('data-ratio-greater-08', 0);
			}
		} else {
			entry.target.setAttribute('data-ratio-greater-08', 0);
		}
	}

	/**
	 * Simulating the last opacity block
	 * @return {void}
	 * @deprecated	1.0.0
	 */
	function simulateLast() {
		var lastEl = this.opacityEls[this.totOpacityEls-1];
		var fakeFirst = lastEl.cloneNode(true);
		removeClass(fakeFirst, this.options.opacityElsClass);
		addClass(fakeFirst, this.options.opacityFakeElClass);
		this.opacityEls[0].parentNode.append(fakeFirst);
		// this.opacityEls[0].parentNode.insertBefore(fakeFirst, this.opacityEls[0]);
	}

	/**
	 * @deprecated	1.1.0
	 */
	function activeElementOnScroll( index ) {
		for( var i=0; i < this.totScrollEls; i++ ) {
			if ( index === i ) {
				addClass( this.scrollEls[i], this.options.scrollElActiveClass );
			} else {
				removeClass( this.scrollEls[i], this.options.scrollElActiveClass );
			}
		}

		for( var i=0; i < this.totOpacityEls; i++ ) {
			if ( index === i ) {
				addClass( this.opacityEls[i], this.options.opacityElActiveClass );
			} else {
				removeClass( this.opacityEls[i], this.options.opacityElActiveClass );
			}
		}
	}

	/* ===== Exposed functions ===== */
	SplitScrollable.prototype.refreshScrollableIndex = function() {
		var guessedIndex = _guessIndex.call(this);

		// get last guess
		if (guessedIndex) {
			_setGuessedIndex.call(this, guessedIndex);
		}
	};

	SplitScrollable.prototype.callFixStickyHeight = function() {
		_fixStickyHeight.call(this);
	};

	SplitScrollable.prototype.destroy = function () {
		removeClass(this.element, this.options.splitScrollActiveElClass);
		
		// Destroy wrappers
		_destroyWrappers.call(this);
		
		function removeInstance(instance) {
			return instance.element !== this.element;
		}
		
		instances = instances.filter(removeInstance.bind(this));
	}
	
	/**
	 * Static function that retrieves the SplitScrollable
	 * instance of the DOM Element passed.
	 * @param		{Element}				el	Element to retrieve the instance
	 * @returns	{Element|null}	SplitScrollable instance
	 * @since		1.1.0
	 */
	SplitScrollable.data = function(el) {
		var i = 0,
			tot = instances.length;
		for (i = 0; i < tot; i++) {
			if (el === instances[i].element) {
				return instances[i];
			}
		}

		return null;
	};

	// Invoking global Events watchers
	// _watchScroll();
	window.addEventListener('scroll', debounce( scrollHandler, 150, true ));
	// _watchResize();
	window.addEventListener('resize', debounce( resizeHandler, 150 ));

	return SplitScrollable;
});