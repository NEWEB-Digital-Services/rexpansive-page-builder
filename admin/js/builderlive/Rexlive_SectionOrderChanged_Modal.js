/**
 * @since 2.0.10
 */
var SectionOrderChanged_Modal = (function ($) {
	'use strict';
	var section_order_changed_props;
	var activeLayoutPage;
	var buttonData;

	var _openModal = function (data) {
		// buttonData = data.buttonData;
		Rexlive_Modals_Utils.openModal(section_order_changed_props.$self.parent('.rex-modal-wrap'));
	};

	var _closeModal = function () {
		Rexlive_Modals_Utils.closeModal(section_order_changed_props.$self.parent('.rex-modal-wrap'));
	};

	var _linkDocumentListeners = function () {
		section_order_changed_props.$button.on('click', function (e) {
			var $button = $(e.currentTarget);
			var optionSelected = $button.attr('data-rex-option');

			switch (optionSelected) {
				case 'save':
					Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.btn-save').addClass('rex-saving');
					var dataSavePage = {
						eventName: 'rexlive:savePage',
						data_to_send: {
							buttonData: buttonData
						}
					};
					var dataSaveModel = {
						eventName: 'rexlive:saveModel',
						data_to_send: {
							buttonData: buttonData
						}
					};
					Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataSavePage);
					Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataSaveModel);
					Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage({
						eventName: 'rexlive:startChangeLayout'
					});
					Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.removeClass('btn-redo--active btn-undo--active');
					break;
				case 'continue':
					var data = {
						eventName: 'rexlive:dropChanges',
						data_to_send: {
							selected: activeLayoutPage,
							eventName: '',
							buttonData: buttonData
						}
					};
					Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
					Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.removeClass('btn-redo--active btn-undo--active');
					Rexbuilder_Util_Admin_Editor.activeSavePageButton();
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
