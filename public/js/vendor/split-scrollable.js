;(function() {
	this.SplitScrollable = function() {
		this.element = null;
		this.splitScrollWrapper = null;
		this.scrollElsWrapper = null;
		this.scrollEls = null;
		this.opacityElsWrapper = null;
		this.opacityEls = null;
		this.totScrollEls = 0;
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

		simulateLast.call(this);

		// attach plugin instance to dom element
		this.element.DistanceAccordionInstance = this;
	};

	function initialize() {
		var that = this;
		this.scrollEls = [].slice.call( this.element.getElementsByClassName(this.options.scrollElsClass) );
		this.opacityEls = [].slice.call( this.element.getElementsByClassName(this.options.opacityElsClass) );
		this.totScrollEls = this.scrollEls.length;
		this.totOpacityEls = this.opacityEls.length;
		var i=0;
		for( i=0; i < this.totScrollEls; i++ ) {
			this.scrollEls[i].setAttribute('data-scroll-el-index', i);
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
			console.log('scrollingz')
			var tot_entries = entries.length, i = 0;
			for( i=0; i < tot_entries; i++ ) {
				handleEntityObserve.call(that, entries[i]);
				// newHandleEntityObserve.call(that, entries[i]);
			}
		}, {
			threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
		});

		var j = 0;
		for( j=0; j < this.totScrollEls; j++ ) {
			this.scrollObserver.observe( this.scrollEls[j] );
		}
	}

	function handleEntityObserve(entry) {
		var entryIndex = parseInt( entry.target.getAttribute('data-scroll-el-index') );
		this.scrollElsState[entryIndex] = entry;
		if( entry.isIntersecting ) {
			if ( entry.boundingClientRect.top > 0 && ( null === entry.target.previousElementSibling || ! hasClass( entry.target.previousElementSibling, this.options.scrollElActiveClass ) ) ) {
				// console.log('a')
				addClass( entry.target, this.options.scrollElActiveClass );
				addClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
			} else {
				// console.log('b')
				removeClass( entry.target, this.options.scrollElActiveClass );
				// if ( i+1 !== this.totOpacityEls ) {
					removeClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
				// }

				if ( entry.target.nextElementSibling ) {
					// console.log('c')
					addClass( entry.target.nextElementSibling, this.options.scrollElActiveClass );
					// var i = parseInt( entry.target.nextElementSibling.getAttribute('data-scroll-el-index') );
					// if( i+1 === this.totOpacityEls ) {
					// 	removeClass( this.opacityEls[i], this.options.opacityElActiveClass );
					// }
				}
			}
		} else {
			// console.log('d')
			removeClass( entry.target, this.options.scrollElActiveClass );
			// if ( i+1 !== this.totOpacityEls ) {
			removeClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
			// }
		}
	}

	function newHandleEntityObserve(entry) {
		var entryIndex = parseInt( entry.target.getAttribute('data-scroll-el-index') );
		this.scrollElsState[entryIndex] = entry;

		if( entry.isIntersecting ) {
			// if( 0 === entryIndex ) {
			// 	addClass( entry.target, this.options.scrollElActiveClass );
			// 	addClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );
			// } else {
				if ( this.scrollElsState[entryIndex].boundingClientRect.top > 0  ) {
					addClass( entry.target, this.options.scrollElActiveClass );
					addClass( this.opacityEls[entryIndex], this.options.opacityElActiveClass );

					// removeClass( this.scrollElsState[entryIndex-1].target, this.options.scrollElActiveClass );
					// removeClass( this.opacityEls[entryIndex-1], this.options.opacityElActiveClass );
				}
			// }
		} else {
			removeClass( entry.target, this.options.scrollElActiveClass );
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