/**
 * Handling lateral menu to import various models (buttons, sections, ...)
 * @since  2.0.0
 */
var Model_Lateral_Menu = (function ($) {
  "use strict";
  var rexmodel_lateral_menu;
  var image_uploader_frame_direct;  //used for the media library opener

  var _linkDocumentListeners = function () {
    rexmodel_lateral_menu.$close_button.click(function (e) {
      e.preventDefault();
      _closeModal();
    });
  };

  var _openModal = function () {
    Model_Import_Modal.updateModelList();
  };

  var _closeModal = function () {
    rexmodel_lateral_menu.$self
    .addClass("rex-lateral-panel--close")
    .one(Rexbuilder_Util_Admin_Editor.animationEvent, function (e) {
      rexmodel_lateral_menu.$self.removeClass(
        "rex-lateral-panel--open rex-lateral-panel--close"
        );
    });
        // Rexlive_Modals_Utils.closeModal(rexmodel_lateral_menu.$self.parent('.rex-modal-wrap'));
  };

  var _linkDocumentListeners = function () {
    Rexlive_Base_Settings.$document.on("rexlive:lateralMenuReady", function () {
      rexmodel_lateral_menu.$self.addClass("rex-lateral-panel--open");
      var activeTab = rexmodel_lateral_menu.$tabsButtons.filter('.active').parent().index();
      rexmodel_lateral_menu.$tabs.eq(activeTab).show();
    });

    rexmodel_lateral_menu.$close_button.click(function (e) {
      e.preventDefault();
      _closeModal();
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
     * Handling Model delete
     * @param  {MouseEvent} e) Click event
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.model__element--delete', function (e) {
      var model = this.parentNode.parentNode;
      Model_Import_Modal.deleteModel( model );
    });

    /**
     * Opens media library
     * @param  {MouseEvent} e) Click event
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.model__element--edit', function (e) {
      var $model = $(this).parents('.model__element');
      
      // document.querySelector('.model__element[data-rex-model-id="1574"]');

      Model_Import_Modal.editModelImage(
        $model.attr("data-rex-model-id")
        );
    });
  }

  var _init = function () {
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
    closeModal: _closeModal
  };
})(jQuery);
