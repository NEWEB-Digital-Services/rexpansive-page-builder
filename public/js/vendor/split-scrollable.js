;(function() {
	this.SplitScrollable = function() {
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

		this.viewportSizes = null;
		this.scrollContainer = null;

		if (arguments[0]) {
			this.element = arguments[0];
		}

		var defaults = {
			splitScrollElClass: 'split-scrollable-container',
			scrollElsWrapClass: 'scroll-block-wrapper',
			scrollElsClass: 'scroll-block',
			scrollElsToWatchClass: 'scroll-block',
			scrollElActiveClass: 'scroll-block-active',
			opacityElsWrapClass: 'opacity-block-wrapper',
			opacityElsClass: 'opacity-block',
			opacityFakeElClass: 'opacity-block-fake',
			opacityElActiveClass: 'opacity-block-active',
			initializeComplete: null,
			customScrollContainer: null
		};

		// Create options by extending defaults with the passed in arugments
		if (arguments[1] && typeof arguments[1] === "object") {
			this.options = extendDefaults(defaults, arguments[1]);
		} else {
			this.options = defaults;
		}

		// this.debugEl = null;
		// debugging.call(this);

		initialize.call(this);
		addWrappers.call(this);

		if ( 'function' === typeof this.options.initializeComplete ) {
			this.options.initializeComplete.call(this);
		}

		fixStickyHeight.call(this);

		attachListeners.call(this);

		// simulateLast.call(this);

		// attach plugin instance to dom element
		this.element.DistanceAccordionInstance = this;
	};

	function initialize() {
		var that = this;
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

		this.viewportSizes = viewport();

		if ( this.options.customScrollContainer ) {
			this.scrollContainer = this.options.customScrollContainer;
		} else {
			this.scrollContainer = window;
		}
	}

	function addWrappers() {
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

	/**
	 * Fix the height of the container of the opacity blocks
	 * to stop the sticky effect inside the container
	 * otherwise it goes on
	 */
	function fixStickyHeight() {
		this.opacityElsWrapper.style.height = parseFloat( getComputedStyle( this.opacityEls[this.opacityEls.length-1], null ).top.replace("px", "") ) + 
		( this.opacityEls[this.opacityEls.length-1].offsetHeight ) + 'px';
	}

	function attachListeners() {
		// scroll event
		// watchScroll.call(this);
		// // check first scroll
		// handleScroll.call(this);
		
		watchIntersectionObserver.call(this);

		// resize event
		watchResize.call(this);
	}

	/**
	 * SCROLL HANDLING
	 */
	/**
	 * Watching the browser scrolling, bouncing the event
	 * every 150 ms to prevent event polling
	 * @return {void}
	 */
	function watchScroll() {
		userScrolled = false;
		var that = this;

		function scrollHandler() {
			userScrolled = true;
		}

		this.scrollContainer.addEventListener( 'scroll', scrollHandler);

		rInterval( function() {
			if ( userScrolled ) {
				handleScroll.call(that);
				userScrolled = false;
			}
		}, 150);
	}

	function handleScroll() {
		var totscroll = scrollDocumentPositionTop();
		var scrollOffset = 0;
		var i, toSet, offsetEl, guessedIndex = null;
		var generalCondition = false, firstElementCondition = false;
		// var heightFactor = ( this.aspectRatio >= 1 ? 0.5 : 0.2 );

		this.debugEl.innerText = totscroll + ' + ' + this.viewportSizes.height + ' = ' + ( totscroll + this.viewportSizes.height ) + '\n';

		for( i=0; i < this.totScrollElsToWatch; i++ ) {
			if ( this.scrollElsToWatch[i] ) {
				offsetEl = offsetAbsolute( this.scrollElsToWatch[i] );

				this.debugEl.innerText += i + ' : ' + offsetEl.top + ' -- ' + offsetEl.height + ' ## ' + ( offsetEl.top - totscroll ) + '\n';

				// view conditions
				generalCondition = ( offsetEl.top - totscroll ) > 0 && ( ( offsetEl.top ) < ( totscroll + this.viewportSizes.height + scrollOffset ) ) && ( ( offsetEl.top + offsetEl.height ) > ( totscroll + scrollOffset ) );

				if ( generalCondition ) {
					guessedIndex = this.scrollElsToWatch[i].getAttribute('data-scroll-el-index');
					break;
				}
			}
		}

		// get last guess
		if ( guessedIndex ) {
			if ( this.actualScrollEl !== guessedIndex ) {
				activateScrollEl.call( this, guessedIndex );
				this.actualScrollEl = guessedIndex;
			}
		}
	}

	function watchIntersectionObserver() {
		var that = this;
		this.scrollObserver = new IntersectionObserver( function( entries, observer ) {
			var tot_entries = entries.length, i = 0;
			for( i=0; i < tot_entries; i++ ) {
				// handleEntityObserve.call(that, entries[i]);
				newHandleEntityObserve.call(that, entries[i]);
			}
		}, {
			threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
		});

		var j = 0;
		for( j=0; j < this.totScrollEls; j++ ) {
			this.scrollObserver.observe( this.scrollElsToWatch[j] );
		}
	}

	/**
	 * deprecated
	 * @param  {[type]} entry [description]
	 * @return {[type]}       [description]
	 */
	function handleEntityObserve(entry) {
		var entryIndex = parseInt( entry.target.getAttribute('data-scroll-el-index') );
		this.scrollElsState[entryIndex] = entry;
		if( entry.isIntersecting ) {

			console.log(entryIndex)
			console.log(this.scrollEls[entryIndex].previousElementSibling)

			if ( entry.boundingClientRect.top > 0 && ( null === this.scrollEls[entryIndex].previousElementSibling || ! hasClass( this.scrollEls[entryIndex].previousElementSibling, this.options.scrollElActiveClass ) ) ) {
				addClass( this.scrollEls[entryIndex], this.options.scrollElActiveClass );
				if ( this.opacityEls[entryIndex] ) {
					addClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
				}
			} else {
				removeClass( this.scrollEls[entryIndex], this.options.scrollElActiveClass );
				// if ( i+1 !== this.totOpacityEls ) {
				if ( this.opacityEls[entryIndex] ) {
					removeClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
				}
				// }

				if ( this.scrollEls[entryIndex].nextElementSibling ) {
					addClass( this.scrollEls[entryIndex].nextElementSibling, this.options.scrollElActiveClass );
					// var i = parseInt( entry.target.nextElementSibling.getAttribute('data-scroll-el-index') );
					// if( i+1 === this.totOpacityEls ) {
					// 	removeClass( this.opacityEls[i], this.options.opacityElActiveClass );
					// }
				}
			}
		} else {
			removeClass( this.scrollEls[entryIndex], this.options.scrollElActiveClass );
			// if ( i+1 !== this.totOpacityEls ) {
			if( this.opacityEls[entryIndex] ) {
				removeClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
			}
			// }
		}
	}

	function newHandleEntityObserve(entry) {
		var entryIndex = parseInt( entry.target.getAttribute('data-scroll-el-index') );
		this.scrollElsState[entryIndex] = entry;

		if( entry.isIntersecting ) {
			console.log(entry.intersectionRatio, entry.target)
			if ( entry.intersectionRatio > 0.8  ) {
				console.log('beccato', entryIndex)
				activeElementOnScroll.call(this, entryIndex)
			}
		}
	}

	function activateScrollEl( targetIndex ) {
		for( var i=0; i < this.totScrollEls; i++ ) {
			if ( this.scrollElsToWatch[i].getAttribute('data-scroll-el-index') == targetIndex ) {
				addClass( this.scrollEls[i], this.options.scrollElActiveClass );
				addClass( this.opacityEls[i], this.options.opacityElActiveClass );
			} else {
				removeClass( this.scrollEls[i], this.options.scrollElActiveClass );
				removeClass( this.opacityEls[i], this.options.opacityElActiveClass );
			}
		}
	}

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

	function otherHandleEntityObserve(entry) {
		var entryIndex = parseInt( entry.target.getAttribute('data-scroll-el-index') );
		this.scrollElsState[entryIndex] = entry;

		if( entry.isIntersecting ) {
			// if( 0 === entryIndex ) {
			// 	addClass( entry.target, this.options.scrollElActiveClass );
			// 	addClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
			// } else {
				if ( this.scrollElsState[entryIndex].boundingClientRect.top > 0  ) {
					addClass( this.scrollEls[entryIndex], this.options.scrollElActiveClass );
					addClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );

					// removeClass( this.scrollElsState[entryIndex-1].target, this.options.scrollElActiveClass );
					// removeClass( this.opacityEls[entryIndex-1], this.options.opacityElActiveClass );
				}
			// }
		} else {
			removeClass( this.scrollEls[entryIndex], this.options.scrollElActiveClass );
			removeClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
		}
	}

	// handle resize
	function watchResize() {
		userResized = false;
		var that = this;

		function resizeHandler() {
			userResized = true;
		}

		window.addEventListener( 'resize', resizeHandler );

		rInterval( function() {
			if ( userResized ) {
				handleResize.call(that);
				userResized = false;
			}
		}, 150);
	}

	function handleResize() {
		this.viewportSizes = viewport();
	}

	/**
	 * Simulating the last opacity block
	 * @return {void}
	 * @deprecated
	 */
	function simulateLast() {
		var lastEl = this.opacityEls[this.totOpacityEls-1];
		var fakeFirst = lastEl.cloneNode(true);
		removeClass(fakeFirst, this.options.opacityElsClass);
		addClass(fakeFirst, this.options.opacityFakeElClass);
		this.opacityEls[0].parentNode.append(fakeFirst);
		// this.opacityEls[0].parentNode.insertBefore(fakeFirst, this.opacityEls[0]);
	}

	function debugging() {
		this.debugEl = document.createElement('div');
		this.debugEl.style.position = 'fixed'
		this.debugEl.style.bottom = '0px'
		this.debugEl.style.right = '0px'
		this.debugEl.style.backgroundColor = '#ddd'
		this.debugEl.style.padding = '10px'
		this.debugEl.style.zIndex = '9999'
		this.debugEl.style.fontSize = '15px'
		document.body.appendChild(this.debugEl)
	}

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
	function viewport() {
		var e = window, a = 'inner';
		if (!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width: e[a + 'Width'], height: e[a + 'Height'] };
	}

	// timing utilities
	/**
	 * Set timeout function rewritten with requestanimation frame
	 * @param  {Function} callback [description]
	 * @param  {Number}   delay    delay time
	 * @return {Object}
	 */
	function rtimeOut( callback, delay ) {
		var dateNow = Date.now,
			requestAnimation = window.requestAnimationFrame,
			start = dateNow(),
			stop,
			timeoutFunc = function(){
				dateNow() - start < delay ? stop || requestAnimation(timeoutFunc) : callback()
			};
		requestAnimation(timeoutFunc);

		return {
			clear:function(){stop=1}
		}
	}

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
}());