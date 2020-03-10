;(function($) {
	'use strict';

	$.getVideoThumbnail = function(element, options) {
		this.options = {};

		element.data('getVideoThumbnail', this);

		this.init = function(element, options) {
			this.options = $.extend({}, $.getVideoThumbnail.defaultOptions, options);

			var video = element.find(this.options.videoContainer)[0];
			video.addEventListener("loadeddata", initScreenshot);
			//window.addEventListener("load", grabScreenshot);

			var canvas = element.find(this.options.canvasContainer)[0];
			var ctx = canvas.getContext("2d");
			var videoHeight, videoWidth;

			function initScreenshot() {
				videoHeight = video.videoHeight; 
				videoWidth = video.videoWidth;
				canvas.width = videoWidth;
				canvas.height = videoHeight;
				grabScreenshot();
			}

			function grabScreenshot() {
				ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
				var img = new Image();
				img.src = canvas.toDataURL("image/png");
				img.width = 120;
			}
		};

		this.init(element, options);
	}

	$.fn.getVideoThumbnail = function(options) {                   
		return this.each(function() {
			(new $.getVideoThumbnail($(this), options));              
		});
	};

	$.getVideoThumbnail.defaultOptions = {
		videoContainer: '.rex-video-container',
		canvasContainer: '.rex-video-mp4-thumbnail'
	};
})(jQuery);