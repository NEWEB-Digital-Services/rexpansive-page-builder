/**
 * Handling lateral menu to import various models (templates, buttons, elements)
 * @since  2.0.0
 */
var Model_Lateral_Menu = (function ($) {
	('use strict');
	var rexmodel_lateral_menu;

	function openModal() {
		Model_Import_Modal.updateModelList();
		Form_Import_Modal.updateList();
	}

	/**
	 * Makes the lateral menu visible.
	 * @returns	{void}
	 * @since		2.0.5
	 */
	function showModal() {
		if (rexmodel_lateral_menu.$self.hasClass('rex-lateral-panel--open')) return;

		rexmodel_lateral_menu.$self.addClass('rex-lateral-panel--open');

		var activeTab = rexmodel_lateral_menu.$tabsButtons.filter('.active').parent().index();
		rexmodel_lateral_menu.$tabs.eq(activeTab).show();
	}

	/**
	 * Makes the lateral menu not visible anymore.
	 * @returns	{void}
	 * @since		2.0.5
	 */
	function hideModal() {
		if (rexmodel_lateral_menu.$self.hasClass('rex-lateral-panel--close')) return;

		rexmodel_lateral_menu.$self
			.addClass('rex-lateral-panel--close')
			.one(Rexbuilder_Util_Admin_Editor.animationEvent, function (e) {
				rexmodel_lateral_menu.$self.removeClass('rex-lateral-panel--open rex-lateral-panel--close');
			});
	}

	function _linkListeners() {
		Rexlive_Base_Settings.$document.on('rexlive:lateralMenuReady', function () {
			showModal();
		});

		rexmodel_lateral_menu.$close_button.click(function (e) {
			e.preventDefault();
			hideModal();
		});

		rexmodel_lateral_menu.$tabsButtons.click(function (e) {
			e.preventDefault();
			var $this = $(this),
				others = $this.closest('li').siblings().children('a'),
				target = $this.attr('data-rex-tab-target');
			others.removeClass('active');
			$this.addClass('active');
			rexmodel_lateral_menu.$tabs.hide();
			rexmodel_lateral_menu.$tabs.each(function (i, tab) {
				if ($(tab).attr('id') == target) {
					$(tab).show();
				}
			});
		});

		// TODO Move all these model/form related cb to their file
		/**
		 * Opens modal to edit the RexModel name
		 * @param  {MouseEvent} e) Click event
		 * @return {null}
		 */
		Rexlive_Base_Settings.$document.on('click', '.model__element--title-edit', function (e) {
			var model = this.parentNode.parentNode.parentNode;
			var modelData = {
				id: model.getAttribute('data-rex-model-id'),
				name: model.querySelector('.model-name').textContent
			};
			Rexlive_Model_Edit_Name_Modal.openModal(modelData);
		});

		/**
		 * Handling model thumbnail change. Opens media library
		 * @param  {MouseEvent} e) Click event
		 * @return {null}
		 */
		Rexlive_Base_Settings.$document.on('click', '.model__element--edit-thumbnail', function (e) {
			var $model = $(this).parents('.model__element');

			Model_Import_Modal.editModelThumbnail(
				$model.attr('data-rex-model-id'),
				$model.attr('data-rex-model-thumbnail-id')
			);
		});

		/**
		 * Handling Model delete
		 * @param  {MouseEvent} e) Click event
		 * @return {null}
		 */
		Rexlive_Base_Settings.$document.on('click', '.model__element--delete', function (e) {
			var model = this.parentNode.parentNode.parentNode;
			// @todo open modal with message and ask confirm before delete
			Model_Import_Modal.deleteModel(model);
		});

		/**
		 * Deletes model thumbnail
		 * @param  {MouseEvent} e) Click event
		 * @return {null}
		 */
		Rexlive_Base_Settings.$document.on('click', '.model__element--reset-thumbnail', function (e) {
			var $model = $(this).parents('.model__element');

			Model_Import_Modal.resetModelThumbnail($model.attr('data-rex-model-id'));
		});

		/**
		 * Handling element delete
		 * @param		{MouseEvent}	clickEvent
		 * @since		2.0.x
		 * @version	2.0.5					Added modal for confirm of deletion
		 */
		Rexlive_Base_Settings.$document.on('click', '.element-list__element--delete', function (clickEvent) {
			var form = $(clickEvent.target).parents('.element-list__element').get(0);
			if (!form) return;

			// Form_Import_Modal.deleteForm(element);

			Delete_Model_Modal.openModal({ type: 'form', element: form });
		});

		/**
		 * Handling element thumbnail change. Opens media library
		 * @param  {MouseEvent} e) Click event
		 * @return {null}
		 */
		Rexlive_Base_Settings.$document.on('click', '.element-list__element--edit-thumbnail', function (e) {
			var $element = $(this).parents('.element-list__element');

			Form_Import_Modal.editElementThumbnail(
				$element.attr('data-rex-element-id'),
				$element.attr('data-rex-element-thumbnail-id')
			);
		});

		/**
		 * Deletes element thumbnail
		 * @param  {MouseEvent} e) Click event
		 * @return {null}
		 */
		Rexlive_Base_Settings.$document.on('click', '.element-list__element--reset-thumbnail', function (e) {
			var $element = $(this).parents('.element-list__element');

			Form_Import_Modal.resetElementThumbnail($element.attr('data-rex-element-id'));
		});

		Rexbuilder_Util_Admin_Editor.$frameBuilder.load(onIFrameLoad);
	}

	/**
	 * @param	{string}	funcName
	 * @param	{Event}		event
	 * @since	2.0.9
	 */
	function templateDragCallback(funcName, event) {
		var handler = _getHandler();

		if (!handler || !(funcName in handler)) return;

		handler[funcName](event);
	}

	/**
	 * Retrieves the instance needed for handling the current
	 * element that is being dragged.
	 *
	 * @returns	{object|null}
	 * @since		2.0.9
	 */
	function _getHandler() {
		var currentDraggingElementType = Rexbuilder_Util_Admin_Editor.dragImportType;

		switch (currentDraggingElementType) {
			case 'rexmodel':
				return Model_Import_Modal;
			case 'rexbutton':
				return Button_Import_Modal;
			case 'rexelement':
				return Form_Import_Modal;

			default:
				return null;
		}
	}

	function init() {
		var $self = $('#rexbuilder-lateral-panel');
		rexmodel_lateral_menu = {
			$self: $self,
			$close_button: $self.find('.rex-lateral-panel--close'),
			$tabs: $self.find('.tabgroup > div'),
			$tabsButtons: $self.find('.rex-lateral-tabs-list a')
		};

		rexmodel_lateral_menu.$tabs.hide();

		_linkListeners();
	}

	/**
	 * @since		2.0.9
	 */
	function onIFrameLoad() {
		var clientFrameWindow = Rexbuilder_Util_Admin_Editor.frameBuilder.contentWindow;
		var $frameContentWindow = $(clientFrameWindow);
		var $rexContainer = $(clientFrameWindow.document.querySelector('.rex-container'));

		// Can't be throttled because that would cause the event.preventDefault() function
		// to be called a few times causing the impossibility to drop the element
		$frameContentWindow.on('dragover', templateDragCallback.bind(null, 'onDragOverWindow'));
		$rexContainer.on('dragenter', '.grid-stack-row', templateDragCallback.bind(null, 'onDragEnterRow'));
		$rexContainer.on('dragover', '.grid-stack-row', _.throttle(templateDragCallback.bind(null, 'onDragOverRow'), 50));
		$rexContainer.on('drop', '.grid-stack-row', templateDragCallback.bind(null, 'onDropRow'));
	}

	return {
		init: init,
		openModal: openModal,
		hide: hideModal,
		show: showModal
	};
})(jQuery);
