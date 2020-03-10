var Util = (function($) {
	'use strict';
//per controllare se la pagina visualizzata è una in particolare
/*if( is_page(126) ) {
}
*/
	var $window = $(window);

	var fixSectionWidth = 0;
	var elementIsResizing = false;
	var elementIsDragging = false;

	// function to detect if we are on a mobile device
	var _detect_mobile = function() {
		if (!("ontouchstart" in document.documentElement)) {
			document.documentElement.className += " no-touch";
		} else {
			document.documentElement.className += " touch";
		}
	}

	// function to detect the viewport size
	var _viewport = function() {
		var e = window, a = 'inner';
		if (!('innerWidth' in window )) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
	};

	// function to find the youtube id based on an url
	var _getYoutubeID = function( url ) {
		var ID;
		if( url.indexOf( "youtu.be" ) > 0 ) {
				ID = url.substr( url.lastIndexOf( "/" ) + 1, url.length );
		} else if( url.indexOf( "http" ) > -1 ) {
				ID = url.match( /[\\?&]v=([^&#]*)/ )[ 1 ];				
		} else {
				ID = url.length > 15 ? null : url;
		}
		return ID;
	};

	// Get the value of a query variable from the actual url
	var _getQueryVariable = function(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
	};

	var _checkPresentationPage = function() {
		if( 0 !== $('.rexpansive_portfolio_presentation').length ) {
			return true;
		}
		return false;
	}

	var _checkStaticPresentationPage = function() {
		if( 0 !== $('.rexpansive-static-portfolio').length ) {
			return true;
		}
		return false;
	}

	var _checkPost = function() {
		if( 0 !== $('#rex-article').length ) {
			return true;
		}
		return false;
	}

	// find the animation/transition event names
	var _whichTransitionEvent = function(){
		var t,
		el = document.createElement("fakeelement");

		var transitions = {
			"transition"      : "transitionend",
			"OTransition"     : "oTransitionEnd",
			"MozTransition"   : "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		};

		for (t in transitions){
			if (el.style[t] !== undefined){
				return transitions[t];
			}
		}
	};

	var _whichAnimationEvent = function(){
		var t,
		  el = document.createElement("fakeelement");

		var animations = {
			"animation"      : "animationend",
			"OAnimation"     : "oAnimationEnd",
			"MozAnimation"   : "animationend",
			"WebkitAnimation": "webkitAnimationEnd"
		}

		for (t in animations){
			if (el.style[t] !== undefined){
			  return animations[t];
			}
		}
	};

	var _transitionEvent = '';
	var _animationEvent = '';

	var _scroll_timing = 600;

	// init the utilities
	var init = function() {
		_detect_mobile();
		this._transitionEvent = _whichTransitionEvent();
		this._animationEvent = _whichAnimationEvent();
	}

	return {
		init: init,
		viewport: _viewport,
		getYoutubeID: _getYoutubeID,
		transitionEvent: _transitionEvent,
		animationEvent: _animationEvent,
		getQueryVariable: _getQueryVariable,
		checkPresentationPage: _checkPresentationPage,
		checkStaticPresentationPage : _checkStaticPresentationPage,
		checkPost: _checkPost,
		$window: $window,
		scroll_timing: _scroll_timing,
		fixSectionWidth: fixSectionWidth,
		elementIsResizing: elementIsResizing
	};

})(jQuery);