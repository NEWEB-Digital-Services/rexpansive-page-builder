/**
 * PopUp Content plugin
 * 
 */
;(function(window, factory) {
	'use strict';
	window.PopUpContent = factory(window);
})( 'undefined' !== typeof window ? window : this, function() {
	var instances = [];

	var popupContentCloseTmpl = document.getElementById('tmpl-popupcontent-close');

	var keydownCallbacksArray = []

	function handleKeydownGlobalListener(ev) {
		for (var i = 0; i < keydownCallbacksArray.length; i++) {
			keydownCallbacksArray[i].call(ev)
		}
	}

	document.addEventListener('keydown', handleKeydownGlobalListener)

	function PopUpContent() {
		// call object (button)
		this.element = null;
		this.iframeContainer = null;

		// popup element
		this.hashTarget = '';
		this.target = null;
		this.urlTarget = '';

		this.open = false;

		// close button (child of popupelement)
		this.closeBtn = null;

		// load content
		this.contentLoaded = false;

		if (arguments[0]) {
			this.element = arguments[0];
		}

		var defaults = {
			// classes
			bodyPopUpViewClass: 'popup-content--active',
			iframePopUpLoadClass: 'popup-iframe--loaded',
			popUpContentLoaded: 'popup-content--loaded',
			popUpWrapper: 'popup-content',
			popupViewClass: 'popup-content--view',
			popUpCloseWrapper: 'popup-content-close-wrapper',
			popUpCloseClass: 'popup-content-close',
			popUpContent: 'popup-content-content',
			popUpAnimationClass: 'popup-content--base-animation',
			contentInjectorPoint: 'rexpansive_section',
			loadTiming: 'hover',				// hover | load | scroll(?)
			contentRetrieveMethod: 'ajax',		// ajax | iframe
			getPopUpContentComplete: null,
			ajaxSettings: null,
			listenESCKey: false,
			listenClickOutside: false,
			closeCallback: null,
			openCallback: null
		};

		// Create options by extending defaults with the passed in arugments
		if (arguments[1] && typeof arguments[1] === "object") {
			this.options = extendDefaults(defaults, arguments[1]);
		} else {
			this.options = defaults;
		}

		if ( null === this.element ) {
			return;
		}

		if ( 'undefined' === typeof this.element.href ) return;

		initialize.call(this);

		if( null === this.target ) {
			return;
		}

		attachEventHandlers.call(this);

		instances.push( this );
	}

	function initialize() {
		this.hashTarget = this.element.hash.substr(1);
		if ( '' !== this.hashTarget ) {
        	this.target = document.getElementById( this.hashTarget );
        } else {
        	this.urlTarget = this.element.href;
        	this.target = generatePopUpContainer(this.options);

        	// initialize ajax settings
        	if ( null !== this.options.ajaxSettings ) {
        		this.options.ajaxSettings.data.target = this.urlTarget;
				this.options.ajaxSettings.success = ajaxSuccessWrapper.bind(this);

				this.options.ajaxSettings.error = function( response ) {
					console.log('There was an error');
				};
			}

        	var thisParent = foundParents( this.element, this.options.contentInjectorPoint );
			thisParent.insertAdjacentElement('afterend', this.target);
			if ( 'load' === this.options.loadTiming ) {
        		getPopUpContent.call(this);
			}
        }

        if ( null === this.target ) {
        	return;
        }

        this.closeBtn = [].slice.call( this.target.getElementsByClassName( this.options.popUpCloseClass ) );
        if ( this.closeBtn.length > 0 ) {
        	this.closeBtn = this.closeBtn[0];
        }
	}

	function attachEventHandlers() {
		this.element.addEventListener('click', togglePopUp.bind(this));
		if ( this.closeBtn ) {
			this.closeBtn.addEventListener('click', togglePopUp.bind(this));
		}
		if ( 'hover' === this.options.loadTiming ) {
			this.element.addEventListener('mouseover', getPopUpContent.bind(this), {once: true});
		}
		if (this.options.listenESCKey) {
			keydownCallbacksArray.push(handleKeydownEvent.bind(this))
		}
		if (this.options.listenClickOutside) {
			this.target.addEventListener('click', handleClickOutsideEvent.bind(this))
		}
	}

	function handleClickOutsideEvent(ev) {
		if (this.target !== ev.target) return
		ev.preventDefault()
		closePopUp.call(this)
	}

	function handleKeydownEvent(ev) {
		ev = ev || window.event;
		var isEscape = false;

		if ("key" in ev) {
			isEscape = (ev.key === "Escape" || ev.key === "Esc");
		} else {
			isEscape = (ev.keyCode === 27);
		}

		if(!isEscape) return

		closePopUp.call(this, ev)
	}

	function closePopUp() {
		if (!this.open) return

		removeClass(this.target, this.options.popupViewClass);
		removeClass(document.body, this.options.bodyPopUpViewClass);

		this.open = false

		if (this.options.closeCallback) {
			this.options.closeCallback.call(this)
		}

		var stateEvent = new Event( 'popUpContent:close' );
		document.dispatchEvent(stateEvent);
	}

	function togglePopUp(ev) {
		ev.preventDefault();
		toggleClass(this.target, this.options.popupViewClass);
		toggleClass(document.body, this.options.bodyPopUpViewClass);

		this.open = ! this.open;

		if (this.open) {
			if (this.options.openCallback) {
				this.options.openCallback.call(this)
			}
		} else {
			if (this.options.closeCallback) {
				this.options.closeCallback.call(this)
			}
		}

		// trigger open/close event to parent
		var eventName = ( this.open ? 'popUpContent:open' : 'popUpContent:close' );

		var stateEvent = new Event( eventName );
		document.dispatchEvent(stateEvent);
	}

	function ajaxSuccessWrapper( response ) {
		console.time('load_content')
		if ( response.success ) {
			onGetPopUpContentComplete.call( this, response.data.data );
		}
		console.timeEnd('load_content')
	}

	function getPopUpContent(ev) {
		if ( this.contentLoaded ) {
			return;
		}

		ev.preventDefault()
		var that = this;

		switch( this.options.contentRetrieveMethod ) {
			case 'iframe':
				onGetPopUpContentComplete.call( this );
				break;
			case 'append':
			default:
				if ( null !== this.options.ajaxSettings ) {
					$.ajax(this.options.ajaxSettings);
				} else {
					var request = new XMLHttpRequest();
					request.open('GET', this.urlTarget, true);

					request.onload = function() {
						if (request.status >= 200 && request.status < 400) {
							// Success!
							var resp = request.responseText;
							onGetPopUpContentComplete.call( that, resp );
						} else {
							// We reached our target server, but it returned an error
						}
					};

					request.onerror = function() {
						// There was a connection error of some sort
					};

					request.send();
				}
				break;
		}

	}

	function onGetPopUpContentComplete( content ) {
		addPopUpContent.call( this, content )
		switch( this.options.contentRetrieveMethod ) {
			case 'iframe':
				this.iframeContainer.addEventListener('load', onIframeLoadComplete.bind(this));
				break;
			case 'append':
			default:
				addClass( this.target, this.options.popUpContentLoaded );
				if ( 'function' === typeof this.options.getPopUpContentComplete ) {
					this.options.getPopUpContentComplete.call(this)
				}
				break;
		}
		this.contentLoaded = true;
	}

	function addPopUpContent(content) {
		switch( this.options.contentRetrieveMethod ) {
			case 'iframe':
				this.target.querySelector('.'+this.options.popUpContent).innerHTML = '<iframe src="' + this.urlTarget + '"></iframe>';
				this.iframeContainer = this.target.getElementsByTagName('IFRAME')[0];
				break;
			case 'append':
			default:
				this.target.querySelector('.'+this.options.popUpContent).innerHTML = content;
				break;
		}
	}

	/**
	 * On iframe correct load, add a class to the body and launch custom callback
	 * @return {void}
	 */
	function onIframeLoadComplete( event ) {
		addClass( this.iframeContainer.contentDocument.body, this.options.iframePopUpLoadClass );
		addClass( this.target, this.options.popUpContentLoaded );
		if ( 'function' === typeof this.options.getPopUpContentComplete ) {
			this.options.getPopUpContentComplete.call(this);
		}

		// trigger event on iframe document that tells that the popupcontent has ended load
		var loadCompleteEvent = new Event('popUpContent:loadComplete');
		this.iframeContainer.contentDocument.dispatchEvent(loadCompleteEvent);

		this.iframeContainer.contentWindow.addEventListener('click', onIframeClick.bind(this));
	}

	/**
	 * Listen click events inside the iframe, to correctly change page if needed
	 * @param  {MouseEvent} event mouse click
	 * @return {void}
	 * @since  2.0.5
	 */
	function onIframeClick( event ) {
		if ('A' === event.target.tagName.toUpperCase() && '' !== event.target.href ) {
			event.preventDefault();

			// close popup
			removeClass(this.target, this.options.popupViewClass);
			removeClass(document.body, this.options.bodyPopUpViewClass);

			var data = {
				rexliveEvent: true,
				eventName: "popUpContent:changePage",
				href: event.target.href
			};

			window.parent.postMessage(data, "*");
		}
	}

	function generatePopUpContainer( options ) {
		var popUpContainer = document.createElement('div');
		addClass( popUpContainer,options.popUpWrapper );
		addClass( popUpContainer, 'popup-content__method--' + options.contentRetrieveMethod );

		addClass(popUpContainer, options.popUpAnimationClass)

		var closeWrapper = document.createElement('div');
		addClass( closeWrapper,options.popUpCloseWrapper );

		// create close wrapper with a template, to make it customizable
		if ( popupContentCloseTmpl ) {
			closeWrapper.innerHTML = popupContentCloseTmpl.innerHTML;
		} else {
			var closeBtn = document.createElement('div');
			closeBtn.innerHTML = '<i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i>';
			addClass( closeBtn, options.popUpCloseClass );
			closeWrapper.appendChild(closeBtn);
		}

		var popUpContent = document.createElement('div');
		addClass( popUpContent, options.popUpContent );

		popUpContainer.appendChild(closeWrapper);
		popUpContainer.appendChild(popUpContent);

		return popUpContainer;
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
	};

	function foundParents(el, className) {
		if( null === el.parentNode || el.parentNode instanceof HTMLDocument ) { return null; }
		if( hasClass( el.parentNode, className ) ) {
			return el.parentNode;
		} else {
			return foundParents(el.parentNode, className);
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

	PopUpContent.prototype.openPopup = function() {
		var hEvent = new Event('mouseover');
		var cEvent = new Event('click');
		
		getPopUpContent.call( this, hEvent );
		togglePopUp.call( this, cEvent );
	};

	// PopUpContent.prototype.destroy = function () {
	// 	function removeInstance(instance) {
	// 		return instance.element !== this.element;
	// 	}
		
	// 	instances = instances.filter(removeInstance.bind(this));
	// }

	// PopUpContent.destroyAll = function() {
	// 	instances.forEach(function(instance) {
	// 		instance.destroy();
	// 	});
	// };

	/**
	 * Static function that retrieves the PopUpContent
	 * instance of the DOM Element passed.
	 * @param		{Element}				el	Element to retrieve the instance
	 * @returns	{Element|null}	PopUpContent instance
	 * @since		1.1.0
	 */
	PopUpContent.data = function(el) {
		var i = 0,
			tot = instances.length;
		for (i = 0; i < tot; i++) {
			if (el === instances[i].element) {
				return instances[i];
			}
		}

		return null;
	};

	return PopUpContent;
});