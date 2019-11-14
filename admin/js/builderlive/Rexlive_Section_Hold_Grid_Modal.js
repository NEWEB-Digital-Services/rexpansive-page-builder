var Hold_Grid_Modal = (function ($) {
	'use strict';

	var props;
	var defaultValue;
	var sectionTarget;

	var _reset = function () {
		props.$element.attr("checked", defaultValue);
	}

	var _update = function (data) {
		sectionTarget = data.sectionTarget;
		var checked = false;
		if ( -1 !== data.customClasses.indexOf('rex-block-grid') ) {
			checked = true;
		}
		props.$element.attr("checked", checked);
	}

	var _getData = function () {
		return props.$element.prop('checked');
	}

	var _apply = function () {
		var checked = _getData();
		var cls = Section_CustomClasses_Modal.getData();
		var payload = {
			sectionTarget: sectionTarget,
			customClasses: ''
		}

		if ( checked ) {
            // set the custom class to hold the grid
            payload.customClasses = cls + ' rex-block-grid';
        } else {
        	cls = cls.replace( /\s*rex-block-grid/, '' );

            // remove the custom class to hold the grid
            payload.customClasses = cls;
        }

        payload.customClasses = payload.customClasses.trim();

        Section_CustomClasses_Modal.update(payload);

        // apply the class change
        Section_CustomClasses_Modal.apply();
    }

    var _linkDocumentListeners = function () {
    	props.$element.click(_apply);
    }

    var _init = function ($container) {
    	props = {
    		$element: $container.find('#rx-hold-grid')
    	}

    	defaultValue = false;
    	_reset();
    	_linkDocumentListeners();
    }

    return {
        init: _init,        // C
        getData: _getData,  // R
        update: _update,    // U
        reset: _reset,      // D
    };

})(jQuery);