;(function() {
	this.SplitScrollable = function() {
		this.element = null;

		this.splitScrollWrapper = null;

		this.scrollElsWrapper = null;
		this.scrollEls = [];
		this.scrollElsToWatch = [];
		this.totScrollEls = 0;
		this.totScrollElsToWatch = 0;

		this.opacityElsWrapper = null;
		this.opacityEls = [];
		this.totOpacityEls = 0;

		this.scrollElsState = [];

		this.scrollObserver = null;

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
			initializeComplete: null
		};

		// Create options by extending defaults with the passed in arugments
		if (arguments[1] && typeof arguments[1] === "object") {
			this.options = extendDefaults(defaults, arguments[1]);
		} else {
			this.options = defaults;
		}

		initialize.call(this);
		addWrappers.call(this);

		if ( 'function' === typeof this.options.initializeComplete ) {
			this.options.initializeComplete.call(this);
		}

		fixStickyHeight.call(this);

		watchScroll.call(this);

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

	function watchScroll() {
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
			if ( entry.intersectionRatio > 0.8  ) {
				activeElementOnScroll.call(this, entryIndex)
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

	function simulateLast() {
		var lastEl = this.opacityEls[this.totOpacityEls-1];
		var fakeFirst = lastEl.cloneNode(true);
		removeClass(fakeFirst, this.options.opacityElsClass);
		addClass(fakeFirst, this.options.opacityFakeElClass);
		this.opacityEls[0].parentNode.append(fakeFirst);
		// this.opacityEls[0].parentNode.insertBefore(fakeFirst, this.opacityEls[0]);
	}

	function fixStickyHeight() {
		this.opacityElsWrapper.style.height = parseFloat( getComputedStyle( this.opacityEls[this.opacityEls.length-1], null ).top.replace("px", "") ) + 
		( this.opacityEls[this.opacityEls.length-1].offsetHeight ) + 'px';
	}

	// Utilities
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