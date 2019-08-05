/**
 * Handling lateral menu to import various models (buttons, sections, ...)
 * @since  2.0.0
 */
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
     * Write on console "ciao Roberto"
     * @param  {null}
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.model__element--edit', function (e) {
      Model_Import_Modal.writeOnConsole();
    });

    /**
     * Edit a model background image
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.edit-model-image', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $itemContent = $elem.find(".grid-item-content");

      var tools = '';
      var $btn_container = $btn.parents('.rexlive-block-toolbox');
      if( $btn_container.hasClass('bottom-tools') ) {
        tools = 'bottom';
      } else if ($btn_container.hasClass('top-tools')) {
        tools = 'top';
      }

      var idImage =
        typeof $elemData.attr("data-id_image_bg_block") == "undefined"
          ? ""
          : $elemData.attr("data-id_image_bg_block");
      var imageUrl =
        typeof $elemData.attr("data-image_bg_block") == "undefined"
          ? ""
          : $elemData.attr("data-image_bg_block");
      var width =
        typeof $itemContent.attr("data-background_image_width") == "undefined"
          ? ""
          : $itemContent.attr("data-background_image_width");
      var height =
        typeof $itemContent.attr("data-background_image_height") == "undefined"
          ? ""
          : $itemContent.attr("data-background_image_height");
      var activeImage =
        typeof $elemData.attr("data-image_bg_elem_active") != "undefined"
          ? $elemData.attr("data-image_bg_elem_active")
          : true;
      var defaultTypeImage =
        $elem.parents(".grid-stack-row").attr("data-layout") == "fixed"
          ? "full"
          : "natural";
      var typeBGimage =
        ( typeof $elemData.attr("data-type_bg_block") == "undefined" || "" == $elemData.attr("data-type_bg_block") )
          ? defaultTypeImage
          : $elemData.attr("data-type_bg_block");
      var activePhotoswipe =
        typeof $elemData.attr("data-photoswipe") == "undefined"
          ? ""
          : $elemData.attr("data-photoswipe");
      var imageSize = typeof $elemData.attr("data-image_size") == "undefined" ? "" : $elemData.attr("data-image_size");

      var activeImage = true;

      var data = {
        eventName: "rexlive:openLiveImageUploader",
        live_uploader_data: {
          idImage: activeImage ? idImage : "",
          urlImage: activeImage ? imageUrl : "",
          width: activeImage ? width : "",
          height: activeImage ? height : "",
          typeBGimage: activeImage ? typeBGimage : "",
          photoswipe: activeImage ? activePhotoswipe : "",
          imageSize: activeImage ? imageSize :"",
          active: activeImage,
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          // returnEventName: "rexlive:apply_background_image_block",
          // data_to_send: {
          //   idImage: activeImage ? idImage : "",
          //   urlImage: activeImage ? imageUrl : "",
          //   width: activeImage ? width : "",
          //   height: activeImage ? height : "",
          //   typeBGimage: activeImage ? typeBGimage : "",
          //   photoswipe: activeImage ? activePhotoswipe : "",
          //   imageSize: activeImage ? imageSize :"",
          //   active: activeImage,
          //   updateBlockHeight: true,
          //   tools: tools,        
          //   sectionTarget: {
          //     sectionID: sectionID,
          //     modelNumber: modelNumber,
          //     rexID: rex_block_id
          //   },
          // }
        },
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
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
