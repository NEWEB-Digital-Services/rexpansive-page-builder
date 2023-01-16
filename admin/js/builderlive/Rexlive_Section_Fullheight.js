var FullHeight_Modal = (function ($) {
	'use strict';

	var section_layout_modal_properties;
	var defaultFullHeight;
	var sectionTarget;

	function resetFullHeight() {
		section_layout_modal_properties.$is_full.prop('checked', defaultFullHeight);
	}

	function updateFullHeight(data) {
		sectionTarget = data.sectionTarget;
		section_layout_modal_properties.$is_full.prop('checked', data.fullHeight == 'true');
		if ( 'masonry' === data.activeLayout ) {
			section_layout_modal_properties.$is_full.prop('disabled', true);
		} else {
			section_layout_modal_properties.$is_full.prop('disabled', false);
		}
	}

	function _getData() {
		var fullHeight = true === section_layout_modal_properties.$is_full.prop('checked') ? 'true' : 'false';
		return fullHeight;
	}

	function applyFullHeight() {
		var fullHeight = _getData();

		Rexbuilder_Util_Admin_Editor.highlightRowSetData({
			full_height: fullHeight
		});

		var data_fullHeight = {
			eventName: 'rexlive:set_row_fullHeight',
			data_to_send: {
				sectionTarget: sectionTarget,
				fullHeight: fullHeight
			}
		};

		Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_fullHeight);
	}

	function _linkDocumentListeners() {
		section_layout_modal_properties.$is_full.click(function () {
			applyFullHeight();
		});
	}

	function init($container) {
		section_layout_modal_properties = {
			$is_full: $container.find('#section-is-full')
		};

		defaultFullHeight = false;
		resetFullHeight();
		_linkDocumentListeners();
	}

	return {
		init: init,
		update: updateFullHeight,
		apply: applyFullHeight,
		reset: resetFullHeight
	};
})(jQuery);
