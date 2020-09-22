;(function(window, factory) {
	'use strict';
	window.PopUpVideo = factory(window);
})(typeof window !== 'undefined' ? window : this, function() {
	function PopUpVideoModal() {
		this.element = null;
		this.content = null;
		this.close = null;

		if (arguments[0]) {
			this.element = arguments[0];
		}

		if ( null === this.element ) {
			var element = document.createElement('div');
			element.className = 'popup-video__modal';

			var close = document.createElement('div');
			close.className = 'popup-video__modal__close';
			close.innerHTML = '<i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i>';

			var content = document.createElement('div');
			content.className = 'popup-video__modal__content';

			element.appendChild(close);
			element.appendChild(content);
			document.body.appendChild(element);

			this.element = element;
		}

		this.content = this.element.querySelector('.popup-video__modal__content');
		this.close = this.element.querySelector('.popup-video__modal__close');

		this.element.addEventListener('click', handlePopUpVideoModalClose.bind(this));
		this.close.addEventListener('click', handlePopUpVideoModalClose.bind(this));
	}

	function handlePopUpVideoModalClose(ev) {
		ev.preventDefault();
		this.element.style.display = '';
		this.content.innerHTML = '';
	}

	// maintain a global modal
	var popup_video_modal = new PopUpVideoModal(document.querySelector('.popup-video__modal'));

	function PopUpVideo() {
		this.element = null;
		this.typology = null;

		if (arguments[0]) {
			this.element = arguments[0];
		}

		var defaults = {};

		// Create options by extending defaults with the passed in arugments
		if (arguments[1] && typeof arguments[1] === "object") {
			this.options = extendDefaults(defaults, arguments[1]);
		} else {
			this.options = defaults;
		}

		if ( null === this.element ) return;
		if ( '' === this.element.href ) return;

		initialize.call( this );

		if ( ! this.typology ) return;

		attachEventHandlers.call( this );
	}

	function initialize() {
		if ( -1 !== this.element.href.search(/https?:\/\/youtu.be\/[a-zA-Z0-9]+$/g) ) {
			this.typology = 'youtube';

			// get video id
			var t = /https+:\/\/youtu.be\/([a-zA-Z0-9]+)$/g;
			var m = t.exec(this.element.href);
			this.resource_id = m[1];

		} else if ( -1 !== this.element.href.search(/https?:\/\/vimeo.com\/[a-zA-Z0-9]+$/g) ) {
			this.typology = 'vimeo';

			// get video id
			var t1 = /https?:\/\/vimeo.com\/([a-zA-Z0-9]+)$/g;
			var m1 = t1.exec(this.element.href);
			this.resource_id = m1[1];

		} else if ( -1 !== this.element.href.search(/https?:\/\/\S*\.mp4$/g) ) {
			this.typology = 'mp4';
		}
	}

	function attachEventHandlers() {
		this.element.addEventListener('click', handleTargetClick.bind(this));
	}

	function handleTargetClick(ev) {
		ev.preventDefault();

		var video_element;
		switch( this.typology ) {
			case 'youtube':
				video_element = document.createElement('iframe');
				video_element.setAttribute('allowfullscreen', true);
				video_element.setAttribute('frameborder', '0');
				video_element.setAttribute('allow', 'autoplay');
				video_element.setAttribute('src', 'https://www.youtube.com/embed/' + this.resource_id + '?autoplay=1&rel=0&color=white&frameborder=0');
				break;
			case 'vimeo':
				video_element = document.createElement('iframe');
				video_element.setAttribute('allowfullscreen', true);
				video_element.setAttribute('frameborder', '0');
				video_element.setAttribute('allow', 'autoplay,fullscreen');
				video_element.setAttribute('src', 'https://player.vimeo.com/video/' + this.resource_id + '?autoplay=1' );
				break;
			case 'mp4':
				video_element = document.createElement('video');
				var source = document.createElement('source');
				video_element.setAttribute('autoplay', true);
				video_element.setAttribute('controls', true);
				video_element.setAttribute('preload', 'metadata');

				video_element.appendChild(source);
				source.setAttribute('type', 'video/mp4');
				source.setAttribute('src', this.element.href );
				break;
			default:
				break;
		}

		popup_video_modal.content.appendChild(video_element);
		popup_video_modal.element.style.display = 'block';
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

	return PopUpVideo;
});