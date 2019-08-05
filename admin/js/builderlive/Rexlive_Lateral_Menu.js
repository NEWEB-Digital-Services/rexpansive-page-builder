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
     * Write on console "ciao Roberto" and opens media library
     * @param  {null}
     * @return {null}
     */
    Rexlive_Base_Settings.$document.on('click', '.model__element--edit', function (e) {
      //test
      Model_Import_Modal.writeOnConsole();

      // If the frame is already opened, return it
      if (image_uploader_frame_direct) {
        image_uploader_frame_direct
          .state("live-image")
          .set("liveTarget", ""/*info.sectionTarget*/)
          .set("selected_image", ""/*info.idImage*/)
          .set("eventName", ""/*info.returnEventName*/)
          .set("data_to_send", ""/*info.data_to_send*/)
        image_uploader_frame_direct.open();
        return;
      }

      //create a new Library, base on defaults
      //you can put your attributes in
      var insertImage = wp.media.controller.Library.extend({
        defaults: _.defaults(
          {
            id: "live-image",
            title: "Edit Image",
            allowLocalEdits: true,
            displaySettings: true,
            displayUserSettings: true,
            multiple: false,
            library: wp.media.query({ type: "image" }),
            liveTarget: ""/*info.sectionTarget*/,
            eventName: ""/*info.returnEventName*/,
            data_to_send: ""/*info.data_to_send*/,
            selected_image: ""/*info.idImage*/,
            type: "image" //audio, video, application/pdf, ... etc
          },
          wp.media.controller.Library.prototype.defaults
        )
      }); 

      //Setup media frame
      image_uploader_frame_direct = wp.media({
        button: { text: "Select" },
        state: "live-image",
        states: [new insertImage()]
      });

      // prevent attachment size strange selections
      // image_uploader_frame_direct.on('selection:toggle', function(e) {
      //   var attachmentSizeEl = document.querySelector( 'select[name="size"]' );
      //   if ( attachmentSizeEl ) {
      //     attachmentSizeEl.value = 'full';
      //   }
      // });

      //reset selection in popup, when open the popup
      // image_uploader_frame_direct.on("open", function() {
      //   var attachment;
      //   var selection = image_uploader_frame_direct
      //     .state("live-image")
      //     .get("selection");

      //   //remove all the selection first
      //   selection.each(function(video) {
      //     attachment = wp.media.attachment(video.attributes.id);
      //     attachment.fetch();
      //     selection.remove(attachment ? [attachment] : []);
      //   });

      //   var image_id = image_uploader_frame_direct
      //     .state("live-image")
      //     .get("selected_image");

      //   var image_info = image_uploader_frame_direct
      //     .state("live-image")
      //     .get("data_to_send");

      //   // Check the already inserted image
      //   if (image_id) {
      //     attachment = wp.media.attachment(image_id);
      //     attachment.fetch();

      //     selection.add(attachment ? [attachment] : [], { size: 'thumbnail' });
      //   }
      // });

      image_uploader_frame_direct.on("select", function() {
        var state = image_uploader_frame_direct.state("live-image");
        var sectionTarget = state.get("liveTarget");
        var eventName = state.get("eventName");
        var data_to_send = state.get("data_to_send");

        var selection = state.get("selection");
        var data = {
          eventName: eventName,
          data_to_send: {
            // info: info,
            // media: [],
            sectionTarget: sectionTarget,
            target: sectionTarget
          }
          // data_to_send: data_to_send
        };

        if (!selection) return;

        //to get right side attachment UI info, such as: size and alignments
        //org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
        selection.each(function(attachment) {
          var display = state.display(attachment).toJSON();
          var obj_attachment = attachment.toJSON();

          // If captions are disabled, clear the caption.
          if (!wp.media.view.settings.captions) delete obj_attachment.caption;

          display = wp.media.string.props(display, obj_attachment);

          // var to_send = {
          //   media_info: obj_attachment,
          //   display_info: display
          // };

          // data.data_to_send.media.push(to_send);
          data.data_to_send.idImage = obj_attachment.id;
          data.data_to_send.urlImage = display.src;
          data.data_to_send.width = display.width;
          data.data_to_send.height = display.height;

          if( 'undefined' !== typeof data_to_send.photoswipe ) {
            data.data_to_send.photoswipe = data_to_send.photoswipe;
          }

          if( 'undefined' !== typeof data_to_send.active ) {
            data.data_to_send.active = data_to_send.active;
          }

          if( 'undefined' !== typeof data_to_send.typeBGimage ) {
            data.data_to_send.typeBGimage = data_to_send.typeBGimage;
          }
        });

        // Synch top toolbar tools
        Rexbuilder_Util_Admin_Editor.highlightRowSetData({
          image_bg_section_active: data.data_to_send.active,
          image_bg_section: data.data_to_send.urlImage,
          id_image_bg_section: data.data_to_send.idImage
        });
        Rexbuilder_Util_Admin_Editor.updateBkgrImgTool();

        data.data_to_send.tools = data_to_send.tools;

        // Launch image insert event to the iframe
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
      });

      image_uploader_frame_direct.on("close", function() {});

      //now open the popup
      image_uploader_frame_direct.open();
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
