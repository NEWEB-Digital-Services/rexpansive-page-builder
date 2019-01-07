
var Model_Lateral_Menu = (function ($) {
    "use strict";
    var rexmodel_lateral_menu;
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
        $(document).on("rexlive:lateralMenuReady", function () {
            console.log("porcodio apriti");
            console.log(rexmodel_lateral_menu.$self);
            rexmodel_lateral_menu.$self.addClass("rex-lateral-panel--open");
            rexmodel_lateral_menu.$tabs.eq(0).show();
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
        })
    }

    var _init = function () {
        var $self = $("#rexbuilder-lateral-panel");
        rexmodel_lateral_menu = {
            $self: $self,
            $close_button: $self.find(".rex-close-button"),
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
