/**
 * PopUp Content plugin
 * 
 */
;(function($) {
	this.PopUpContent = function() {
		// call object (button)
		this.element = null;

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
			popUpWrapper: 'popup-content',
			popupViewClass: 'popup-content--view',
			popUpCloseWrapper: 'popup-content-close-wrapper',
			popUpCloseClass: 'popup-content-close',
			popUpContent: 'popup-content-content',
			contentInjectorPoint: 'rexpansive_section',
			getPopUpContentComplete: null,
			ajaxSettings: null
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
	};

	function initialize() {
		this.hashTarget = this.element.hash.substr(1);
		if ( '' !== this.hashTarget ) {
        	this.target = document.getElementById( this.hashTarget );
        } else {
        	this.urlTarget = this.element.href;
        	this.target = generatePopUpContainer.call(this);

        	// initialize ajax settings
        	if ( null !== this.options.ajaxSettings ) {
        		var that = this;
        		this.options.ajaxSettings.data.target = this.urlTarget;
				this.options.ajaxSettings.success = function( response ) {
					if ( response.success ) {
						onGetPopUpContentComplete.call( that, response.data );
					}
				};

				this.options.ajaxSettings.error = function( response ) {
					console.log('There was an error');
				}
			}

        	var thisParent = foundParents( this.element, this.options.contentInjectorPoint );
			thisParent.insertAdjacentElement('afterend', this.target);
        	getPopUpContent.call(this);
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
	}

	function togglePopUp(ev) {
		ev.preventDefault()
		toggleClass(this.target, this.options.popupViewClass)
	}

	function getPopUpContent() {
		var that = this;

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
	}

	function onGetPopUpContentComplete( content ) {
		this.contentLoaded = true;
		addPopUpContent.call( this, content )
		if ( 'function' === typeof this.options.getPopUpContentComplete ) {
			this.options.getPopUpContentComplete.call(this)
		}
	}

	function addPopUpContent(content) {
		this.target.querySelector('.'+this.options.popUpContent).innerHTML = content;
	}

	function generatePopUpContainer() {
		var popUpContainer = document.createElement('div');
		addClass( popUpContainer,this.options.popUpWrapper );
		var closeWrapper = document.createElement('div');
		addClass( closeWrapper,this.options.popUpCloseWrapper );
		var closeBtn = document.createElement('div');
		closeBtn.innerText = 'X';
		addClass( closeBtn, this.options.popUpCloseClass );
		var popUpContent = document.createElement('div');
		addClass( popUpContent, this.options.popUpContent );

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