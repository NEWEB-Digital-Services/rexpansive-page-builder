/**
 * Handling lateral menu to import various models (templates, buttons, elements)
 * @since  2.0.0
 */
var Model_Lateral_Menu = (function ($) {
  "use strict";
  var rexmodel_lateral_menu;

  function _openModal() {
    Model_Import_Modal.updateModelList();
    Element_Import_Modal.updateElementList();
  };

	/**
	 * Makes the lateral menu not visible anymore.
	 * @returns	{void}
	 * @since		2.0.5
	 */
	function hide() {
		rexmodel_lateral_menu.$self
			.addClass('rex-lateral-panel--close')
			.one(Rexbuilder_Util_Admin_Editor.animationEvent, function (e) {
				rexmodel_lateral_menu.$self.removeClass('rex-lateral-panel--open rex-lateral-panel--close');
			});
	};
	
	/**
	 * Makes the lateral menu visible.
	 * @returns	{void}
	 * @since		2.0.5
	 */
	function show() {
		rexmodel_lateral_menu.$self.addClass('rex-lateral-panel--open');

		var activeTab = rexmodel_lateral_menu.$tabsButtons.filter('.active').parent().index();
		rexmodel_lateral_menu.$tabs.eq(activeTab).show();
	}

  function _linkDocumentListeners() {
		Rexlive_Base_Settings.$document.on('rexlive:lateralMenuReady', function () {
			show();
		});

    rexmodel_lateral_menu.$close_button.click(function (e) {
      e.preventDefault();
      hide();
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
        if ($(tab).attr('id') == target){
          $(tab).show();
        }
      });
    });

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
        $model.attr("data-rex-model-id"),
        $model.attr("data-rex-model-thumbnail-id")
      );
    });

    /**
     * Handling Model delete
     * @param  {MouseEvent} e) Click event
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.model__element--delete', function (e) {
      var model = this.parentNode.parentNode.parentNode;
      Model_Import_Modal.deleteModel( model );
    });

    /**
     * Deletes model thumbnail
     * @param  {MouseEvent} e) Click event
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.model__element--reset-thumbnail', function (e) {
      var $model = $(this).parents('.model__element');

      Model_Import_Modal.resetModelThumbnail(
        $model.attr("data-rex-model-id")
      );
    });

    /**
     * Handling element delete
     * @param  {MouseEvent} e) Click event
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.element-list__element--delete', function (e) {
      var element = this.parentNode.parentNode.parentNode;
      Element_Import_Modal.deleteElement( element );
    });

    /**
     * Handling element thumbnail change. Opens media library
     * @param  {MouseEvent} e) Click event
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.element-list__element--edit-thumbnail', function (e) {
      var $element = $(this).parents('.element-list__element');

      Element_Import_Modal.editElementThumbnail(
        $element.attr("data-rex-element-id"),
        $element.attr("data-rex-element-thumbnail-id")
      );
    });

    /**
     * Deletes element thumbnail
     * @param  {MouseEvent} e) Click event
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.element-list__element--reset-thumbnail', function (e) {
      var $element = $(this).parents('.element-list__element');

      Element_Import_Modal.resetElementThumbnail(
        $element.attr("data-rex-element-id")
      );
    });
  }

  function _init() {
    var $self = $("#rexbuilder-lateral-panel");
    rexmodel_lateral_menu = {
      $self: $self,
      $close_button: $self.find(".rex-lateral-panel--close"),
      $tabs: $self.find(".tabgroup > div"),
      $tabsButtons: $self.find(".rex-lateral-tabs-list a")
    };

    rexmodel_lateral_menu.$tabs.hide();

    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal,
		hide: hide,
		show: show
  };
})(jQuery);
