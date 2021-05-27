/**
 * @since 2.0.10
 */
var SectionOrderChanged_Modal = (function ($) {
	'use strict';
	var section_order_changed_props;
	var openModalData = null;

	var _openModal = function (data) {
		openModalData = data
		Rexlive_Modals_Utils.openModal(section_order_changed_props.$self.parent('.rex-modal-wrap'));
	};

	var _closeModal = function () {
		openModalData = null;
		Rexlive_Modals_Utils.closeModal(section_order_changed_props.$self.parent('.rex-modal-wrap'));
	};

	var _linkDocumentListeners = function () {
		section_order_changed_props.$button.on('click', function (e) {
			var $button = $(e.currentTarget);
			var optionSelected = $button.attr('data-rex-option');

			switch (optionSelected) {
				case 'save':
					Rexbuilder_Util_Admin_Editor.isSectionOrderChanged = false
					var dataSyncSectionOrder = {
						eventName: 'rexlive:syncSectionOrderThroughLayouts',
						data: openModalData
					}
					Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataSyncSectionOrder)
					break;
				case 'continue':
					if ('changeLayout' === openModalData.initiator) {
						Change_Layout_Modal.openModal(openModalData.dataObj)
					} else {
						Rexbuilder_Util_Admin_Editor.isSectionOrderChanged = false
						Rexbuilder_Util_Admin_Editor.runSavingProcess()
					}
					break;
				case 'abort':
					break;
				default:
					break;
			}

			_closeModal();
		});
	};

	var _init = function () {
		var $self = $('#rex-layout-section-order-changed');
		var $container = $self;
		section_order_changed_props = {
			$self: $self,
			$button: $container.find('.rex-section-order-changed-option')
		};
		_linkDocumentListeners();
	};

	return {
		init: _init,
		openModal: _openModal,
		closeModal: _closeModal
	};
})(jQuery);
