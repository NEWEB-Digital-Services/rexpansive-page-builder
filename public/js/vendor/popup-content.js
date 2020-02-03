/**
 * PopUp Content plugin
 * 
 */
;(function($) {
	this.PopUpContent = function() {
		// call object (button)
		this.element = null;
		this.iframeContainer = null;

		// popup element
		this.hashTarget = '';
		this.target = null;
		this.urlTarget = '';

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
			contentInjectorPoint: 'rexpansive_section',
			loadTiming: 'hover',				// hover | load | scroll(?)
			contentRetrieveMethod: 'ajax',		// ajax | iframe
			getPopUpContentComplete: null,
			ajaxSettings: null,
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

		initialize.call(this);

		if( null === this.target ) {
			return;
		}

		attachEventHandlers.call(this);

		this.element.PopUpContentInstance = this;
	};

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
				}
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
	}

	function togglePopUp(ev) {
		ev.preventDefault();
		toggleClass(this.target, this.options.popupViewClass);
		toggleClass(document.body, this.options.bodyPopUpViewClass);
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
	function onIframeLoadComplete() {
		addClass( this.iframeContainer.contentDocument.body, this.options.iframePopUpLoadClass );
		addClass( this.target, this.options.popUpContentLoaded );
		if ( 'function' === typeof this.options.getPopUpContentComplete ) {
			this.options.getPopUpContentComplete.call(this)
		}
	}

	function generatePopUpContainer( options ) {
		var popUpContainer = document.createElement('div');
		addClass( popUpContainer,options.popUpWrapper );
		addClass( popUpContainer, 'popup-content__method--' + options.contentRetrieveMethod );
		var closeWrapper = document.createElement('div');
		addClass( closeWrapper,options.popUpCloseWrapper );
		var closeBtn = document.createElement('div');
		closeBtn.innerHTML = '<i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i>';
		addClass( closeBtn, options.popUpCloseClass );
		var popUpContent = document.createElement('div');
		addClass( popUpContent, options.popUpContent );

		closeWrapper.appendChild(closeBtn);
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
	}

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
}(jQuery));