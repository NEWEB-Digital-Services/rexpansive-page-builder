/**
 * Slider Modal
 * @since 2.0.0
 */
var Rexbuilder_RexSlider = (function($) {
  var rexslider_modal_properties;
  var slide_tmpl;
  var rexslider_modal_links_editor;
  var slide_uploader_frame;
  var slide_uploader_video_frame;
  var $selectedOptionImport;
  var editingSliderTitle;
  var target;

  /**
   * Retrieve the data of the slider
   * @return	Object	slider object data
   */
  var _retrieveSliderData = function() {
    var slider = {
      slides: [],
      settings: {}
    };

    var $slides = rexslider_modal_properties.$modal.find(".rex-slider__slide");

    if ($slides.length > 0) {
      slider.settings[
        "auto_start"
      ] = rexslider_modal_properties.$slider_autostart.prop("checked");
      slider.settings[
        "prev_next"
      ] = rexslider_modal_properties.$slider_prev_next.prop("checked");
      slider.settings["dots"] = rexslider_modal_properties.$slider_dots.prop(
        "checked"
      );

      $slides.each(function(i, el) {
        var $this_slide = $(el);
        var $this_slide_data = $this_slide.children(".rex-slider__slide-data");

        var imageID = $this_slide_data
          .find("input[name=rex-slider--slide-id]")
          .val();
        var imageUrl = "";
        var text = $this_slide_data
          .find("textarea[name=rex-slider--slide-text]")
          .text();
        var videoUrl = $this_slide_data
          .find("input[name=rex-slider--slide-video-url]")
          .val();
        var videoType = $this_slide_data
          .find("input[name=rex-slider--slide-video-type]")
          .val();
        var mp4Url = "";
        var videoAudio = $this_slide_data
          .find("input[name=rex-slider--slide-video-audio]")
          .val();
        var url = $this_slide_data
          .find("input[name=rex-slider--slide-url]")
          .val();

        if (typeof imageID !== "undefined") {
          var bgUrl = $this_slide
            .find(".rex-slider__slide__image-preview")
            .css("background-image");
          imageUrl = bgUrl
            .replace("url(", "")
            .replace(")", "")
            .replace(/\"/gi, "");
        }

        if (videoType == "mp4") {
          mp4Url = $this_slide_data
            .find("input[name=rex-slider--slide-video-url]")
            .attr("data-mp4-url");
        }

        var temp_slide = {
          slide_image_id: imageID,
          slide_image_url: imageUrl,
          slide_text: text,
          slide_video: videoUrl,
          slide_videoMp4Url: mp4Url,
          slide_video_type: videoType,
          slide_video_audio: videoAudio,
          slide_url: url
        };
        slider.slides.push(temp_slide);
      });
    }

    return slider;
  };

  /**
   * Update the index of the slides at every sort
   * @param {Event} event slider update event
   * @param {Object} ui jQueryUI Object
   */
  var _update_slide_list_index = function(event, ui) {
    var $this_slides = $(ui.item)
      .siblings()
      .add($(ui.item));
    $this_slides.each(function(i, e) {
      $(e)
        .attr("data-slider-slide-id", i)
        .find(".rex-slider__slide-index")
        .text(i + 1);
    });
  };

  /**
   * Open Links editor for a Slide
   *
   * @param	state	string	state of the modal
   */
  var openSlideLinksEditor = function(state, slide) {
    // clean and prepare the editor
    rexslider_modal_links_editor.$modal.removeClass(
      rexslider_modal_links_editor.visibility_classes.join(" ")
    );
    rexslider_modal_links_editor.$save_button.val("").val(slide);

    switch (state) {
      case "video":
        rexslider_modal_links_editor.$video_type.prop("checked", false);
        rexslider_modal_links_editor.$video_audio.prop("checked", false);
        rexslider_modal_links_editor.$video_youtube
          .val("")
          .next()
          .removeClass("active");
        rexslider_modal_links_editor.$video_mp4.val("");
        rexslider_modal_links_editor.$video_vimeo
          .val("")
          .next()
          .removeClass("active");

        var $slide = $(slide);
        var saved_type = $slide
          .find("input[name=rex-slider--slide-video-type]")
          .val();
        var saved_link = $slide
          .find("input[name=rex-slider--slide-video-url]")
          .val();
        var saved_audio = $slide
          .find("input[name=rex-slider--slide-video-audio]")
          .val();

        if (saved_link && saved_type) {
          rexslider_modal_links_editor.$video_type
            .filter("[value=" + saved_type + "]")
            .prop("checked", true);
          rexslider_modal_links_editor.$video_audio.prop(
            "checked",
            saved_audio
          );
          switch (saved_type) {
            case "youtube":
              rexslider_modal_links_editor.$video_youtube
                .val(saved_link)
                .next()
                .addClass("active");
              break;
            case "mp4":
              rexslider_modal_links_editor.$video_mp4.val(saved_link);
              break;
            case "vimeo":
              rexslider_modal_links_editor.$video_vimeo
                .val(saved_link)
                .next()
                .addClass("active");
              break;
            default:
              break;
          }
        }

        rexslider_modal_links_editor.$modal.addClass("video-links--visible");
        break;
      case "url":
        rexslider_modal_links_editor.$link_value
          .val("")
          .next()
          .removeClass("active");
        var saved_link = $(slide)
          .find("input[name=rex-slider--slide-url]")
          .val();
        if (saved_link) {
          rexslider_modal_links_editor.$link_value
            .val(saved_link)
            .next()
            .addClass("active");
        }

        rexslider_modal_links_editor.$modal.addClass("url-links--visible");
        break;
      default:
        break;
    }

    Rexlive_Modals_Utils.openModal(
      rexslider_modal_links_editor.$modal_wrap,
      true
    );
  };

  /**
   * Setting the global attributes of a slider
   * @param {js Object} attrs Object with attributes for the slider
   */
  var _setSliderGlobalOptions = function(attrs) {
    rexslider_modal_properties.$slider_autostart.prop("checked", false);
    rexslider_modal_properties.$slider_prev_next.prop("checked", false);
    rexslider_modal_properties.$slider_dots.prop("checked", false);
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        var element = attrs[key];
        switch (key) {
          case "auto_start":
            if ("true" == element) {
              rexslider_modal_properties.$slider_autostart.prop(
                "checked",
                true
              );
            }
            break;
          case "prev_next":
            if ("true" == element) {
              rexslider_modal_properties.$slider_prev_next.prop(
                "checked",
                true
              );
            }
            break;
          case "dots":
            if ("true" == element) {
              rexslider_modal_properties.$slider_dots.prop("checked", true);
            }
            break;
          default:
            break;
        }
      }
    }
  };

  // cleaning data
  var _cleanSliderData = function() {
    rexslider_modal_properties.$slider_autostart.prop("checked", false);
    rexslider_modal_properties.$slider_prev_next.prop("checked", false);
    rexslider_modal_properties.$slider_dots.prop("checked", false);
    rexslider_modal_properties.$slide_list.empty();
    rexslider_modal_properties.$slider_import.val("0");
    rexslider_modal_properties.$modal.removeClass("rex-slider-block--editing");
    rexslider_modal_properties.$slide_title.prop('disabled',true);
  };

  /**
   * Open the slider editor, retrieving the slider data from the shortcode
   * @param {string} id id of the block on the editor
   * @param {string} data shortcode of the slider
   * @param {string} slider_id id of the rex slider to edit
   */
  var _openSliderEditor = function(id, data, slider_id, targetToEdit) {
    _cleanSliderData();

    id = typeof id !== "undefined" ? id : "";
    data = typeof data !== "undefined" ? data : "";
    slider_id = typeof slider_id !== "undefined" ? slider_id : "";
    target = targetToEdit;

    if (id && data && slider_id) {
      // save id block information
      rexslider_modal_properties.$save_button.attr("data-block-to-edit", id);
      rexslider_modal_properties.$save_button.attr(
        "data-slider-to-edit",
        slider_id
      );
      rexslider_modal_properties.$undo_button.attr(
        "data-slider-to-edit",
        slider_id
      );
      // inform the user of which slider is selected: no more!
      // rexslider_modal_properties.$slider_import.val(slider_id);
      // based on the slider shortcode, create the slider information
      // using ajax function to take advantage of WP shortocodes functions
      rexslider_modal_properties.$modal.addClass("rex-modal--loading");

      $.ajax({
        type: "POST",
        url: live_editor_obj.ajaxurl,
        data: {
          action: "rex_create_rexslider_admin_markup",
          nonce_param: live_editor_obj.rexnonce,
          data: data,
          slider_id: slider_id
        },
        success: function(response) {
          if (response.success) {
            // setting slider options
            _setSliderGlobalOptions(response.data.rexslider_attrs);
            // setting slides
            rexslider_modal_properties.$slide_title.val(Rexlive_Base_Settings.htmlDecode(response.data.slider.title));
            rexslider_modal_properties.$slide_list.append(
              response.data.slides_markup
            );
            rexslider_modal_properties.$slide_list.sortable("refresh");
            rexslider_modal_properties.$modal.removeClass("rex-modal--loading");
          }
        },
        error: function(response) {
          rexslider_modal_properties.$modal.removeClass("rex-modal--loading");
        }
      });

      // open the editor
      Rexlive_Modals_Utils.openModal(rexslider_modal_properties.$modal_wrap);
    } else {
      rexslider_modal_properties.$slider_autostart.prop("checked", true);
      rexslider_modal_properties.$slider_prev_next.prop("checked", true);
      rexslider_modal_properties.$slider_dots.prop("checked", true);

      rexslider_modal_properties.$save_button.attr("data-block-to-edit", "");
      rexslider_modal_properties.$save_button.attr("data-slider-to-edit", "");

      rexslider_modal_properties.$slide_title.val(live_editor_obj.labels.slider.new_slider).prop('disabled',false);

      rexslider_modal_properties.$slide_list.append(
        slide_tmpl
          .replace(/\bdata.slideindex\b/g, "0")
          .replace(/\bdata.slideindexfront\b/g, "1")
      );

      rexslider_modal_properties.$slide_list.sortable("refresh");

      // open modal
      Rexlive_Modals_Utils.openModal(rexslider_modal_properties.$modal_wrap);
    }
  };

  function SlideImageMediaHandler($data, $preview, image_id) {
    image_id = typeof image_id !== "undefined" ? image_id : null;

    if (slide_uploader_frame) {
      // setting my custom data
      slide_uploader_frame.state("upload-slide").set("$data", $data);
      slide_uploader_frame.state("upload-slide").set("$preview", $preview);
      slide_uploader_frame.state("upload-slide").set("image_id", image_id);

      slide_uploader_frame.open();
      return;
    }

    //create a new Library, base on defaults
    //you can put your attributes in
    var uploadSlide = wp.media.controller.Library.extend({
      defaults: _.defaults(
        {
          id: "upload-slide",
          title: "Select Slide Image",
          allowLocalEdits: true,
          displaySettings: true,
          displayUserSettings: true,
          multiple: false,
          library: wp.media.query({ type: "image" }),
          type: "image", //audio, video, application/pdf, ... etc
          $data: $data,
          $preview: $preview,
          image_id: image_id
        },
        wp.media.controller.Library.prototype.defaults
      )
    });

    //Setup media frame
    slide_uploader_frame = wp.media({
      button: { text: "Select" },
      state: "upload-slide",
      states: [new uploadSlide()]
    });

    //on close, if there is no select files, remove all the files already selected in your main frame
    slide_uploader_frame.on("close", function() {
      var selection = slide_uploader_frame
        .state("upload-slide")
        .get("selection");

      if (selection.length == 0) {
        $data.val();
      }
    });

    slide_uploader_frame.on("select", function() {
      var state = slide_uploader_frame.state("upload-slide");
      var selection = state.get("selection");
      var imageArray = [];

      if (!selection) return;

      //to get right side attachment UI info, such as: size and alignments
      //org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
      selection.each(function(attachment) {
        var display = state.display(attachment).toJSON();
        var obj_attachment = attachment.toJSON();
        var caption = obj_attachment.caption,
          options,
          html;

        // If captions are disabled, clear the caption.
        if (!wp.media.view.settings.captions) delete obj_attachment.caption;

        display = wp.media.string.props(display, obj_attachment);

        options = {
          id: obj_attachment.id,
          post_content: obj_attachment.description,
          post_excerpt: caption
        };

        if (display.linkUrl) options.url = display.linkUrl;

        if ("image" === obj_attachment.type) {
        } else if ("video" === obj_attachment.type) {
          html = wp.media.string.video(display, obj_attachment);
        } else if ("audio" === obj_attachment.type) {
          html = wp.media.string.audio(display, obj_attachment);
        } else {
          html = wp.media.string.link(display);
          options.post_title = display.title;
        }

        //attach info to attachment.attributes object
        attachment.attributes["nonce"] =
          wp.media.view.settings.nonce.sendToEditor;
        attachment.attributes["attachment"] = options;
        attachment.attributes["html"] = html;
        attachment.attributes["post_id"] = wp.media.view.settings.post.id;

        // save id image info
        slide_uploader_frame
          .state("upload-slide")
          .get("$data")
          .val(obj_attachment.id);
        // create image preview
        slide_uploader_frame
          .state("upload-slide")
          .get("$preview")
          .css("backgroundImage", "url(" + obj_attachment.url + ")")
          .addClass("rex-slider__slide__image-preview--active");
      });
    });

    //reset selection in popup, when open the popup
    slide_uploader_frame.on("open", function() {
      var attachment;
      var selection = slide_uploader_frame
        .state("upload-slide")
        .get("selection");

      //remove all the selection first
      selection.each(function(video) {
        attachment = wp.media.attachment(video.attributes.id);
        attachment.fetch();
        selection.remove(attachment ? [attachment] : []);
      });

      var image_id = slide_uploader_frame.state("upload-slide").get("image_id");

      // Check the already inserted image
      if (image_id) {
        attachment = wp.media.attachment(image_id);
        attachment.fetch();

        selection.add(attachment ? [attachment] : []);
      }
    });

    //now open the popup
    slide_uploader_frame.open();
  } // SlideImageMediaHandler END

  /**
   * Handle Insert or Edit Slide Image
   * @param {jQuery Object} $data
   */
  function SlideVideoHandler($data) {
    if (slide_uploader_video_frame) {
      // setting my custom data
      slide_uploader_video_frame
        .state("upload-slide-video")
        .set("$data", $data);

      slide_uploader_video_frame.open();
      return;
    }

    //create a new Library, base on defaults
    //you can put your attributes in
    var uploadSlideVideo = wp.media.controller.Library.extend({
      defaults: _.defaults(
        {
          id: "upload-slide-video",
          title: "Select Slide Video",
          allowLocalEdits: true,
          displaySettings: true,
          displayUserSettings: true,
          multiple: false,
          library: wp.media.query({ type: "video" }),
          type: "video", //audio, video, application/pdf, ... etc
          $data: $data
        },
        wp.media.controller.Library.prototype.defaults
      )
    });

    //Setup media frame
    slide_uploader_video_frame = wp.media({
      button: { text: "Select" },
      state: "upload-slide-video",
      states: [new uploadSlideVideo()]
    });

    //on close, if there is no select files, remove all the files already selected in your main frame
    slide_uploader_video_frame.on("close", function() {
      var selection = slide_uploader_video_frame
        .state("upload-slide-video")
        .get("selection");

      if (selection.length == 0) {
        $data.val();
      }
    });

    slide_uploader_video_frame.on("select", function() {
      var state = slide_uploader_video_frame.state("upload-slide-video");
      var selection = state.get("selection");

      if (!selection) return;

      selection.each(function(attachment) {
        var videoObj = {
          videoID: -1,
          videoUrl: ""
        };

        var display = state.display(attachment).toJSON();
        var obj_attachment = attachment.toJSON();

        // If captions are disabled, clear the caption.
        if (!wp.media.view.settings.captions) delete obj_attachment.caption;

        display = wp.media.string.props(display, obj_attachment);

        videoObj.videoID = obj_attachment.id;
        videoObj.videoUrl = obj_attachment.url;

        // save id image info
        slide_uploader_video_frame
          .state("upload-slide-video")
          .get("$data")
          .val(videoObj.videoID);
        slide_uploader_video_frame
          .state("upload-slide-video")
          .get("$data")
          .attr("data-video-mp4-url", videoObj.videoUrl);
      });
    });

    //reset selection in popup, when open the popup
    slide_uploader_video_frame.on("open", function() {
      var attachment;
      var selection = slide_uploader_video_frame
        .state("upload-slide-video")
        .get("selection");

      //remove all the selection first
      selection.each(function(video) {
        if ("undefined" !== typeof video) {
          attachment = wp.media.attachment(video.attributes.id);
          attachment.fetch();
          selection.remove(attachment ? [attachment] : []);
        }
      });

      var video_id = slide_uploader_video_frame
        .state("upload-slide-video")
        .get("$data")
        .val();

      // Check the already inserted image
      if (video_id) {
        attachment = wp.media.attachment(video_id);
        attachment.fetch();

        selection.add(attachment ? [attachment] : []);
      }
    });

    //now open the popup
    slide_uploader_video_frame.open();
  } // SlideVideoHandler END

  var _saveSlider = function(
    sliderData,
    block_to_edit,
    rex_slider_to_edit,
    saveNewSlider,
    savingLiveSlider,
    targetToEdit
  ) {
    var saveNew = typeof saveNewSlider != "undefined" ? saveNewSlider : false;
    var saveLive =
      typeof savingLiveSlider != "undefined" ? savingLiveSlider : false;
    var idSlideToEdit;

    if (rex_slider_to_edit == "" && !saveNew) {
      idSlideToEdit = 0;
    } else {
      idSlideToEdit = rex_slider_to_edit;
    }

    if (typeof targetToEdit != "undefined") {
      target = targetToEdit;
    }

    // var sliderTitle = rexslider_modal_properties.$slider_import
    //   .find('option[value="' + idSlideToEdit + '"]')
    //   .text();

    var sliderTitle = rexslider_modal_properties.$slide_title.val();

    if (sliderTitle == "" || sliderTitle == "New Slider") {
      function pad2(n) {
        return n < 10 ? "0" + n : n;
      }
      var date = new Date();
      sliderTitle =
        "SLIDER_" +
        date.getFullYear().toString() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        pad2(date.getSeconds());
    } else {
      if (saveNew) {
        if (sliderTitle.indexOf(" - copy") != -1) {
          var regex = /copy(?:\s+([0-9]+))*/gm;
          var m;
          var num = -1;
          while ((m = regex.exec(sliderTitle)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            if (typeof m[1] == "undefined") {
              num = 0;
            } else {
              num = parseInt(m[1]);
            }
          }
          sliderTitle = sliderTitle.replace(regex, "");
          num = num + 1;
          sliderTitle += "copy " + num;
        } else {
          sliderTitle += " - copy";
        }
      }
    }

    if (rex_slider_to_edit && !saveNew) {
      // ajx call
      // - clear previuos data
      // - save new data
      $.ajax({
        type: "POST",
        dataType: "json",
        url: live_editor_obj.ajaxurl,
        data: {
          action: "rex_edit_slider_from_builder",
          nonce_param: live_editor_obj.rexnonce,
          slider_data: sliderData,
          slider_id: rex_slider_to_edit,
          sliderTitle: sliderTitle
        },
        success: function(response) {
          if (response.success) {
            if (!saveLive) {
              // updating info
              var data = {
                eventName: "",
                data_to_send: {
                  id: response.data.slider_id,
                  settings: sliderData.settings,
                  slides: sliderData.slides,
                  target: target
                }
              };
              if (block_to_edit) {
                data.eventName = "rexlive:updateSlider";
              } else {
                data.eventName = "rexlive:insert_new_slider";
              }
              Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
            }
          }
        },
        error: function(response) {}
      });
    } else {
      // ajax call:
      // - create a new rex_slider post
      // - add the correct information
      // - return with the id, to append the shortcode in the block

      $.ajax({
        type: "POST",
        dataType: "json",
        url: live_editor_obj.ajaxurl,
        data: {
          action: "rex_create_slider_from_builder",
          nonce_param: live_editor_obj.rexnonce,
          slider_data: sliderData,
          sliderTitle: sliderTitle
        },
        success: function(response) {
          if (response.success) {
            // updating info
            var data = {
              eventName: "",
              data_to_send: {
                id: response.data.slider_id,
                settings: sliderData.settings,
                slides: sliderData.slides,
                target: target
              }
            };
            if (!saveNew) {
              if (block_to_edit) {
                data.eventName = "rexlive:updateSlider";
              } else {
                data.eventName = "rexlive:insert_new_slider";
              }
              // Update Slider List
            } else {
              data.eventName = "rexlive:newSliderSavedOnDB";
            }
            rexslider_modal_properties.$slider_import.append(
              '<option value="' + response.data.slider_id + '">' + live_editor_obj.labels.slider.list_title_prefix + response.data.slider_title + live_editor_obj.labels.slider.list_title_suffix + "</option>"
            );
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
          }
        },
        error: function(response) {}
      });
    }
  };

  var _linkEvents = function() {
    // Live activation/deactivation of radio button on url insertion/delete
    rexslider_modal_links_editor.$video_youtube.on(
      "change keyup paste",
      function() {
        if ($(this).val() != "") {
          rexslider_modal_links_editor.$video_type
            .filter("[value=youtube]")
            .attr("checked", true);
        } else {
          rexslider_modal_links_editor.$video_type
            .filter("[value=youtube]")
            .attr("checked", false);
        }
      }
    );

    rexslider_modal_links_editor.$video_vimeo.on(
      "change keyup paste",
      function() {
        if ($(this).val() != "") {
          rexslider_modal_links_editor.$video_type
            .filter("[value=vimeo]")
            .attr("checked", true);
        } else {
          rexslider_modal_links_editor.$video_type
            .filter("[value=vimeo]")
            .attr("checked", false);
        }
      }
    );

    /**
     * Slider Edit Slide Event
     */
    Rexlive_Base_Settings.$document.on(
      "click",
      ".rex-slider__slide-edit",
      function(e) {
        e.preventDefault();
        var $button = $(this);
        var $slide = $button.parents(".rex-slider__slide");
        var $data_area = $slide.find(".rex-slider__slide-data");
        var action = $button.attr("value");
        var slide_id = $slide.attr("data-slider-slide-id");

        switch (action) {
          case "add-slide":
            var $image_id_val = $data_area.find(
              "input[name=rex-slider--slide-id]"
            );
            var $image_slide_preview = $slide.find(
              ".rex-slider__slide__image-preview"
            );

            SlideImageMediaHandler($image_id_val, $image_slide_preview);
            break;
          case "edit-slide":
            var $image_id_val = $data_area.find(
              "input[name=rex-slider--slide-id]"
            );
            var $image_slide_preview = $slide.find(
              ".rex-slider__slide__image-preview"
            );
            var image_id = $image_id_val.val();

            SlideImageMediaHandler(
              $image_id_val,
              $image_slide_preview,
              image_id
            );
            break;
          case "text":
            var $slide_text_wrap = $data_area.find(
              "textarea[name=rex-slider--slide-text]"
            );
            var slide_text = $slide_text_wrap.text();
            var slide_selector =
              ".rex-slider__slide[data-slider-slide-id=" + slide_id + "]";

            // rexslider_modal_properties.$modal.addClass('push-down-modal');
            Rexpansive_Builder_Admin_TextEditor.openTextEditor(
              slide_selector,
              slide_text,
              true,
              ["hide-padding-position"]
            );
            break;
          case "video":
            rexslider_modal_properties.$modal.addClass("push-down-modal");
            openSlideLinksEditor(
              "video",
              ".rex-slider__slide[data-slider-slide-id=" + slide_id + "]"
            );
            break;
          case "url":
            rexslider_modal_properties.$modal.addClass("push-down-modal");
            openSlideLinksEditor(
              "url",
              ".rex-slider__slide[data-slider-slide-id=" + slide_id + "]"
            );
            break;
          case "copy":
            // copy slide
            var last_slide_id = parseInt(
              rexslider_modal_properties.$modal.find(".rex-slider__slide")
                .length
            );
            var $cloned_slide = $slide.clone();
            $cloned_slide.attr("data-slider-slide-id", last_slide_id);
            $cloned_slide
              .find(".rex-slider__slide-index")
              .text(last_slide_id + 1);
            rexslider_modal_properties.$slide_list.append($cloned_slide);
            rexslider_modal_properties.$slide_list.sortable("refresh");
            Rexlive_Modals_Utils.resetModalDimensions(
              rexslider_modal_properties.$modal
            );
            break;
          case "delete":
            // remove slide
            $slide.remove();
            rexslider_modal_properties.$modal
              .find(".rex-slider__slide")
              .each(function(i, e) {
                $(e)
                  .attr("data-slider-slide-id", i)
                  .find(".rex-slider__slide-index")
                  .text(i + 1);
              });
            Rexlive_Modals_Utils.resetModalDimensions(
              rexslider_modal_properties.$modal
            );
            break;
          default:
            break;
        }
      }
    );

    /**
     * Slider Add New Slide Event
     */
    rexslider_modal_properties.$add_new_slide.on("click", function() {
      var last_slide_id = parseInt(
        rexslider_modal_properties.$modal.find(".rex-slider__slide").length
      );
      var new_slide_tmpl = slide_tmpl
        .replace(/\bdata.slideindex\b/g, last_slide_id)
        .replace(/\bdata.slideindexfront\b/g, last_slide_id + 1);
      rexslider_modal_properties.$slide_list.append(new_slide_tmpl);
      rexslider_modal_properties.$slide_list.sortable("refresh");
      Rexlive_Modals_Utils.resetModalDimensions(
        rexslider_modal_properties.$modal
      );
    });

    /**
     * Modal Slider Close Event
     */
    rexslider_modal_properties.$cancel_button.on("click", function() {
      if (editingSliderTitle) {
        return;
      }
      Rexlive_Modals_Utils.closeModal(rexslider_modal_properties.$modal_wrap);
    });

    /**
     * Modal Slider Undo Event
     * Go back to the saved slider information
     * @since 2.0.0
     */
    rexslider_modal_properties.$undo_button.on("click", function() {
      if (editingSliderTitle) {
        return;
      }
      var restore_slider_id = $(this).attr('data-slider-to-edit');
      if("" === restore_slider_id) {
        // empty slider editor
        rexslider_modal_properties.$slider_autostart.prop("checked", true);
        rexslider_modal_properties.$slider_prev_next.prop("checked", true);
        rexslider_modal_properties.$slider_dots.prop("checked", true);

        rexslider_modal_properties.$save_button.attr("data-block-to-edit", "");
        rexslider_modal_properties.$save_button.attr("data-slider-to-edit", "");

        rexslider_modal_properties.$slide_title.val(live_editor_obj.labels.slider.new_slider).prop('disabled',true);

        rexslider_modal_properties.$slide_list.empty().append(
          slide_tmpl
            .replace(/\bdata.slideindex\b/g, "0")
            .replace(/\bdata.slideindexfront\b/g, "1")
        );

        rexslider_modal_properties.$slide_list.sortable("refresh");
      } else {
        // get the slider and recreate it
        rexslider_modal_properties.$modal.addClass("rex-modal--loading");

        $.ajax({
          type: "POST",
          url: live_editor_obj.ajaxurl,
          data: {
            action: "rex_create_rexslider_admin_markup",
            nonce_param: live_editor_obj.rexnonce,
            slider_id: restore_slider_id
          },
          success: function(response) {
            _setSliderGlobalOptions(response.data.rexslider_attrs);
            rexslider_modal_properties.$slide_list
              .empty()
              .append(response.data.slides_markup);
            rexslider_modal_properties.$slide_list.sortable("refresh");
            rexslider_modal_properties.$slide_title.val(live_editor_obj.labels.slider.copy_slider + Rexlive_Base_Settings.htmlDecode(response.data.slider.title));
            // rexslider_modal_properties.$save_button.attr(
            //   "data-slider-to-edit",
            //   slider_id
            // );

            rexslider_modal_properties.$undo_button.attr(
              "data-slider-to-edit",
              restore_slider_id
            );
            rexslider_modal_properties.$modal.removeClass("rex-modal--loading");

            Rexlive_Modals_Utils.resetModalDimensions(
              rexslider_modal_properties.$modal
            );
          },
          error: function(response) {
            rexslider_modal_properties.$modal.removeClass("rex-modal--loading");
          }
        });
      }
      // Rexlive_Modals_Utils.closeModal(rexslider_modal_properties.$modal_wrap);
    });

    /**
     * Modal Slider Save Event
     */
    rexslider_modal_properties.$save_button.on("click", function(e) {
      // var slide_reference = $(this).val();
      if (editingSliderTitle) {
        return;
      }
      // Retrieve Slider Data
      var sliderData = _retrieveSliderData();
      var block_to_edit = $(this).attr("data-block-to-edit");
      var rex_slider_to_edit = $(this).attr("data-slider-to-edit");

      _saveSlider(sliderData, block_to_edit, rex_slider_to_edit);

      Rexlive_Modals_Utils.closeModal(rexslider_modal_properties.$modal_wrap);
    });

    /**
     * Chose Slider To Import Event
     * @since 2.0.0
     * @version 2.0.0 When import prevent the synch with the slider id, so every time a new slider
     *                is created
     */
    rexslider_modal_properties.$slider_import.on("change", function(e) {
      e.preventDefault();

      var slider_id = $(this).val();

      if ("0" != slider_id) {
        rexslider_modal_properties.$modal.addClass("rex-modal--loading");

        $.ajax({
          type: "POST",
          url: live_editor_obj.ajaxurl,
          data: {
            action: "rex_create_rexslider_admin_markup",
            nonce_param: live_editor_obj.rexnonce,
            slider_id: slider_id
          },
          success: function(response) {
            _setSliderGlobalOptions(response.data.rexslider_attrs);
            rexslider_modal_properties.$slide_list
              .empty()
              .append(response.data.slides_markup);
            rexslider_modal_properties.$slide_list.sortable("refresh");
            rexslider_modal_properties.$slide_title.val(live_editor_obj.labels.slider.copy_slider + Rexlive_Base_Settings.htmlDecode(response.data.slider.title));
            // rexslider_modal_properties.$save_button.attr(
            //   "data-slider-to-edit",
            //   slider_id
            // );

            rexslider_modal_properties.$undo_button.attr(
              "data-slider-to-edit",
              slider_id
            );
            rexslider_modal_properties.$modal.removeClass("rex-modal--loading");

            Rexlive_Modals_Utils.resetModalDimensions(
              rexslider_modal_properties.$modal
            );
          },
          error: function(response) {
            rexslider_modal_properties.$modal.removeClass("rex-modal--loading");
          }
        });
      } else {
        rexslider_modal_properties.$save_button.attr("data-slider-to-edit", "");
        rexslider_modal_properties.$undo_button.attr("data-slider-to-edit", "");
        // New slider from edited

        // Modal to initial state
        rexslider_modal_properties.$slide_list.empty();
        rexslider_modal_properties.$slider_autostart.prop("checked", true);
        rexslider_modal_properties.$slider_prev_next.prop("checked", true);
        rexslider_modal_properties.$slider_dots.prop("checked", true);

        rexslider_modal_properties.$slide_title.val(live_editor_obj.labels.slider.new_slider);

        var last_slide_id = 0;
        var new_slide_tmpl = slide_tmpl
          .replace(/\bdata.slideindex\b/g, last_slide_id)
          .replace(/\bdata.slideindexfront\b/g, last_slide_id + 1);
        rexslider_modal_properties.$slide_list.append(new_slide_tmpl);
        rexslider_modal_properties.$slide_list.sortable("refresh");
        Rexlive_Modals_Utils.resetModalDimensions(
          rexslider_modal_properties.$modal
        );
      }
    });

    /**
     * Modal Slider Links Close Event
     */
    rexslider_modal_links_editor.$cancel_button.on("click", function() {
      rexslider_modal_properties.$modal.removeClass("push-down-modal");
      Rexlive_Modals_Utils.closeModal(
        rexslider_modal_links_editor.$modal_wrap,
        true
      );
    });

    /**
     * Modal Slider Links Save Event
     */
    rexslider_modal_links_editor.$save_button.on("click", function() {
      var $slide_reference = $(this["attributes"]["value"].value);

      if (
        rexslider_modal_links_editor.$modal.hasClass("video-links--visible")
      ) {
        var video_type = rexslider_modal_links_editor.$video_type
          .filter(":checked")
          .val();
        var video_information = "";
        var videoMp4Url = "";

        $slide_reference
          .find("input[name=rex-slider--slide-video-type]")
          .val(video_type);

        switch (video_type) {
          case "youtube":
            video_information = rexslider_modal_links_editor.$video_youtube.val();
            break;
          case "mp4":
            video_information = rexslider_modal_links_editor.$video_mp4.val();
            videoMp4Url = rexslider_modal_links_editor.$video_mp4.attr(
              "data-video-mp4-url"
            );
            break;
          case "vimeo":
            video_information = rexslider_modal_links_editor.$video_vimeo.val();
            break;
          default:
            break;
        }

        if ("" != video_information) {
          $slide_reference
            .find("input[name=rex-slider--slide-video-url]")
            .val(video_information)
            .attr("data-mp4-url", videoMp4Url);
          $slide_reference
            .find(".rex-slider__slide-edit[value=video]")
            .addClass("rex-slider__slide-edit__field-active-notice");
        } else {
          $slide_reference
            .find(".rex-slider__slide-edit[value=video]")
            .removeClass("rex-slider__slide-edit__field-active-notice");
        }

        $slide_reference
          .find("input[name=rex-slider--slide-video-audio]")
          .val(rexslider_modal_links_editor.$video_audio.prop("checked"));
      } else if (
        rexslider_modal_links_editor.$modal.hasClass("url-links--visible")
      ) {
        var link = rexslider_modal_links_editor.$link_value.val();
        if ("" != link) {
          $slide_reference.find("input[name=rex-slider--slide-url]").val(link);
          $slide_reference
            .find(".rex-slider__slide-edit[value=url]")
            .addClass("rex-slider__slide-edit__field-active-notice");
        } else {
          $slide_reference.find("input[name=rex-slider--slide-url]").val("");
          $slide_reference
            .find(".rex-slider__slide-edit[value=url]")
            .removeClass("rex-slider__slide-edit__field-active-notice");
        }
      }

      rexslider_modal_properties.$modal.removeClass("push-down-modal");
      Rexlive_Modals_Utils.closeModal(
        rexslider_modal_links_editor.$modal_wrap,
        true
      );
    });

    /**
     * Modal Slider Links Update Mp4 Event
     */
    rexslider_modal_links_editor.$video_mp4_add.on("click", function(e) {
      SlideVideoHandler(rexslider_modal_links_editor.$video_mp4);
    });

    Rexlive_Base_Settings.$document.on(
      "click",
      "#edit_slider_title_btn",
      function(e) {
        var $button = $(e.target);
        var $selectWrap = $button
          .parents('#rex-slider-block')
          .find(".rx__select-wrap");
        
        $selectedOptionImport = $selectWrap
          .children("select")
          .find(":selected");
        $selectWrap.addClass("editing-title-slider");

        // var $inputField = rexslider_modal_properties.$modal.find(".title-slider");
        var selectedSliderID = $selectedOptionImport.val();

        rexslider_modal_properties.$slide_title.val($selectedOptionImport.text());
        rexslider_modal_properties.$slide_title.attr("data-rex-slider-id", selectedSliderID);

        editingSliderTitle = true;
      }
    );

    Rexlive_Base_Settings.$document.on(
      "click",
      "#edit_slider_title_live_btn",
      function(e) {
        var $button = $(e.target);
        var $selectWrap = $button
          .parents('#rex-slider-block')
          .find(".rx__select-wrap");
        
        $selectedOptionImport = $selectWrap
          .children("select")
          .find(":selected");
        $selectWrap.addClass("editing-title-slider");

        rexslider_modal_properties.$slide_title.prop('disabled', function(i, v) { return !v; });

        // var $inputField = rexslider_modal_properties.$modal.find(".title-slider");
        // var selectedSliderID = $selectedOptionImport.val();

        // rexslider_modal_properties.$slide_title.val($selectedOptionImport.text());
        // rexslider_modal_properties.$slide_title.attr("data-rex-slider-id", selectedSliderID);
      }
    );

    Rexlive_Base_Settings.$document.on(
      "click",
      "#save_slider_title_btn",
      function(e) {
        var $button = $(e.target);
        var $selectWrap = $button
          .parents('#rex-slider-block')
          .find(".rx__select-wrap");

        // var $inputField = rexslider_modal_properties.$modal.find(".title-slider");
        var newName = rexslider_modal_properties.$slide_title.val();

        $selectedOptionImport.text(newName);

        rexslider_modal_properties.$slide_title.attr("data-rex-slider-id", "");
        rexslider_modal_properties.$slide_title.val("");
        $selectWrap.removeClass("editing-title-slider");

        editingSliderTitle = false;
      }
    );

    Rexlive_Base_Settings.$document.on(
      "click",
      "#cancel_slider_title_btn",
      function(e) {
        var $button = $(e.target);
        var $selectWrap = $button
          .parents('#rex-slider-block')
          .find(".rx__select-wrap");
        // var $inputField = rexslider_modal_properties.$modal.find(".title-slider");

        rexslider_modal_properties.$slide_title.attr("data-rex-slider-id", "");
        rexslider_modal_properties.$slide_title.val("");

        $selectWrap.removeClass("editing-title-slider");
        editingSliderTitle = false;
      }
    );
  };

  /**
   * Init slider variables
   */
  var init = function() {
    //Slide Template Markup
    slide_tmpl = $("#rex-slider__new-slide-tmpl")
      .html()
      .trim();
    //Modal Slider Definition
    rexslider_modal_properties = {
      $modal: $("#rex-slider-block"),
      $modal_wrap: null,
      $cancel_button: null,
      $undo_button: null,
      $save_button: null,
      $add_new_slide: null,
      $slide_list: null,
      $slide_title: null,
      $slider_autostart: null,
      $slider_prev_next: null,
      $slider_dots: null,
      $slider_import: null
    };
    rexslider_modal_properties.$modal_wrap = rexslider_modal_properties.$modal.parent(
      ".rex-modal-wrap"
    );

    rexslider_modal_properties.$cancel_button = rexslider_modal_properties.$modal.find(
      ".rex-modal__close-button"
    );
    rexslider_modal_properties.$save_button = rexslider_modal_properties.$modal.find(
      ".rex-save-button"
    );
    rexslider_modal_properties.$undo_button = rexslider_modal_properties.$modal.find(
      ".rex-undo-button"
    );
    rexslider_modal_properties.$add_new_slide = rexslider_modal_properties.$modal.find(
      "#rex-slider__add-new-slide"
    );
    rexslider_modal_properties.$slide_list = rexslider_modal_properties.$modal.find(
      ".rex-slider__slide-list"
    );

    rexslider_modal_properties.$slide_title = rexslider_modal_properties.$modal.find(
      ".title-slider"
    );

    rexslider_modal_properties.$slider_autostart = rexslider_modal_properties.$modal.find(
      "#rex-slider__autostart"
    );
    rexslider_modal_properties.$slider_prev_next = rexslider_modal_properties.$modal.find(
      "#rex-slider__prev-next"
    );
    rexslider_modal_properties.$slider_dots = rexslider_modal_properties.$modal.find(
      "#rex-slider__dots"
    );

    rexslider_modal_properties.$slider_import = rexslider_modal_properties.$modal.find(
      "#rex-slider__import"
    );

    rexslider_modal_properties.$slide_list.sortable({
      revert: true,
      handle: ".rex-slider__slide-edit[value=move]",
      update: function(e, ui) {
        _update_slide_list_index(e, ui);
      }
    });

    /**
     * Modal Slider Links Definition
     */
    rexslider_modal_links_editor = {
      $modal: $("#rex-slider__links-editor"),
      $modal_wrap: null,
      $cancel_button: null,
      $save_button: null,
      visibility_classes: ["video-links--visible", "url-links--visible"],
      $link_value: null,
      $video_type: null,
      $video_youtube: null,
      $video_mp4: null,
      $video_mp4_add: null,
      $video_vimeo: null,
      $video_audio: null
    };

    rexslider_modal_links_editor.$modal_wrap = rexslider_modal_links_editor.$modal.parent(
      ".rex-modal-wrap"
    );

    rexslider_modal_links_editor.$cancel_button = rexslider_modal_links_editor.$modal.find(
      ".rex-cancel-button"
    );
    rexslider_modal_links_editor.$save_button = rexslider_modal_links_editor.$modal.find(
      ".rex-save-button"
    );
    rexslider_modal_links_editor.$link_value = rexslider_modal_links_editor.$modal.find(
      "#rex-slider__slide-url-link"
    );
    rexslider_modal_links_editor.$video_type = rexslider_modal_links_editor.$modal.find(
      "input[name=rex-slide-choose-video]"
    );

    rexslider_modal_links_editor.$video_mp4_add = rexslider_modal_links_editor.$modal.find(
      "#rex-slide-choose-mp4"
    );

    rexslider_modal_links_editor.$video_youtube = rexslider_modal_links_editor.$modal.find(
      "#rex-slide__video-youtube"
    );
    rexslider_modal_links_editor.$video_mp4 = rexslider_modal_links_editor.$modal.find(
      "#rex-slide__video-mp4"
    );
    rexslider_modal_links_editor.$video_vimeo = rexslider_modal_links_editor.$modal.find(
      "#rex-slide__video-vimeo"
    );
    rexslider_modal_links_editor.$video_audio = rexslider_modal_links_editor.$modal.find(
      "#rex-slide__video--audio"
    );

    $selectedOptionImport = null;
    editingSliderTitle = false;
    _linkEvents();
  };

  return {
    init: init,
    openSliderModal: _openSliderEditor,
    saveSlider: _saveSlider
  };
})(jQuery);
