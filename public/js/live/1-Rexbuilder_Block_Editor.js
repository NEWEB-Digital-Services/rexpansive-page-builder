/**
 * Object that handles all the live events triggered on a block
 * To edit a selected block
 * @since 2.0.0
 */
var Rexbuilder_Block_Editor = (function($) {
  "use strict";

	var block_picker_classes;
	var $closeButtonTemplate = $(Rexbuilder_Live_Templates.getParsedTemplate('tmpl-tool-close'));
	var $optionsButtonTemplate = $(Rexbuilder_Live_Templates.getParsedTemplate('tmpl-tool-save'));

  /**
   * Attaching events for block editing buttons
   * @since 2.0.0
   */
  var _attachEvents = function() {
    /**
     * Edit a block background image
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-block-image', function(e) {
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
      var $textcontent = $elem.find('.text-wrap');

      var blockTextEmpty = textContentEmpty( $textcontent.get(0) );

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
      var defaultTypeImage = $elem.parents(".grid-stack-row").attr("data-layout") == "fixed" ? "full" : "natural";
      if ( ! blockTextEmpty ) {
        defaultTypeImage = 'full';
      }

      var typeBGimage =
        ( typeof $elemData.attr("data-type_bg_block") == "undefined" || "" == $elemData.attr("data-type_bg_block") )
          ? defaultTypeImage
          : $elemData.attr("data-type_bg_block");
      var activePhotoswipe = typeof $elemData.attr("data-photoswipe") == "undefined" ? "" : $elemData.attr("data-photoswipe");
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
          returnEventName: "rexlive:apply_background_image_block",
          data_to_send: {
            idImage: activeImage ? idImage : "",
            urlImage: activeImage ? imageUrl : "",
            width: activeImage ? width : "",
            height: activeImage ? height : "",
            typeBGimage: activeImage ? typeBGimage : "",
            photoswipe: activeImage ? activePhotoswipe : "",
            imageSize: activeImage ? imageSize :"",
            active: activeImage,
            updateBlockHeight: ( blockTextEmpty ? true : false ),
            tools: tools,
            sectionTarget: {
              sectionID: sectionID,
              modelNumber: modelNumber,
              rexID: rex_block_id
            },
          }
        },
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Edit a block background video
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-block-video-background', function(e) {
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

      var mp4Video =
        typeof $elemData.attr("data-video_mp4_url") == "undefined"
          ? ""
          : $elemData.attr("data-video_mp4_url");
      var mp4VideoID =
        typeof $elemData.attr("data-video_bg_id") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_id");
      var youtubeUrl =
        typeof $elemData.attr("data-video_bg_url") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_url");
      var vimeoUrl =
        typeof $elemData.attr("data-video_bg_url_vimeo") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_url_vimeo");
      var $videoMp4Wrap = $itemContent.children(".rex-video-wrap");
      var mp4VideoWidth = "";
      var mp4VideoHeight = "";
      if ($videoMp4Wrap.length != 0) {
        mp4VideoWidth = parseInt($videoMp4Wrap.attr("data-rex-video-width"));
        mp4VideoHeight = parseInt($videoMp4Wrap.attr("data-rex-video-height"));
      }

      var type = "";
      var audio = $itemContent.children(".rex-video-toggle-audio").length != 0;

      if (mp4VideoID != "") {
        type = "mp4";
      } else if (youtubeUrl != "") {
        type = "youtube";
      } else if (vimeoUrl != "") {
        type = "vimeo";
      }

      Rexbuilder_Util_Editor.manageElement = true;

      // $btn.parents('.tool-button-floating').addClass('tool-button-floating--active');

      var isFastButton = $btn.parents('.block-toolBox__fast-configuration').length;
      var mousePosition = null;
      if( isFastButton > 0 ) {
        mousePosition = Rexbuilder_Util_Editor.getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );
      }

      var data = {
        eventName: "rexlive:editBlockVideoBackground",
        activeBlockData: {
          bgVideo: {
            type: type,
            mp4Data: {
              idMp4: mp4VideoID,
              linkMp4: mp4Video,
              width: mp4VideoWidth,
              height: mp4VideoHeight
            },
            vimeoUrl: vimeoUrl,
            youtubeUrl: youtubeUrl,
            audio: audio,
            target: {
              sectionID: sectionID,
              modelNumber: modelNumber,
              rexID: rex_block_id
            },
            tools: tools
          }
        },
        mousePosition: mousePosition
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Deactivate a block image
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.deactivate-block-image-background', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var $btn_container = $btn.parents('.rexlive-block-toolbox');

      if( $btn_container.hasClass('bottom-tools') ) {
        $btn.parents('.tool-button--double-icon--wrap').addClass('tool-button--hide');
        $btn_container.find('.edit-block-image-position').addClass('tool-button--hide');
        $elem.find('.rexlive-block-toolbox.top-tools').find('.edit-block-image').parents('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
      }

      var settings = {
        data_to_send: {
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          idImage: "",
          urlImage: "",
          width: "",
          height: "",
          typeBGimage: "",
          photoswipe: "",
          active: false,
        },
      };

      var event = jQuery.Event("rexlive:apply_background_image_block");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);
    });

    /**
     * Deactivate a block color
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.deactivate-block-color-background', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      // var $elemData = $elem.children(".rexbuilder-block-data");
      // var bgColorActive = $elemData.attr('data-color_bg_block_active');

      var $btn_container = $btn.parents('.rexlive-block-toolbox');

      if( $btn_container.hasClass('bottom-tools') ) {
        $btn.parents('.tool-button--double-icon--wrap').addClass('tool-button--hide');
        $elem.find('.rexlive-block-toolbox.top-tools').find('.edit-block-color-background').parents('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
      }

      var settings = {
        data_to_send: {
          color: "",
          active: false,
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
        }
      };

      var event = jQuery.Event("rexlive:apply_background_color_block");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);
    });

    /**
     * Deactivate an overlay color
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.deactivate-block-overlay-color', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var $btn_container = $btn.parents('.rexlive-block-toolbox');

      if( $btn_container.hasClass('bottom-tools') ) {
        $btn.parents('.tool-button--double-icon--wrap').addClass('tool-button--hide');
        $elem.find('.rexlive-block-toolbox.top-tools').find('.edit-block-overlay-color').parents('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
      }

      var settings = {
        data_to_send: {
          color: "",
          active: false,
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
        }
      };

      var event = jQuery.Event("rexlive:change_block_overlay");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);
    });

    /**
     * Deactivate a video background
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on( 'click', '.deactivate-block-video-background', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var $btn_container = $btn.parents('.rexlive-block-toolbox');

      if( $btn_container.hasClass('bottom-tools') ) {
        $btn.parents('.tool-button--double-icon--wrap').addClass('tool-button--hide');
        $elem.find('.rexlive-block-toolbox.top-tools').find('.edit-block-video-background').parents('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
      }

      var settings = {
        data_to_send: {
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          urlYoutube: "",
          urlVimeo: "",
          videoMp4: {
						idMp4: '',
						linkMp4: '',
						width: '',
						height: ''
					},
          audio: "",
          typeVideo: ""
        }
      };

      var event = jQuery.Event("rexlive:update_block_background_video");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);
    });

    /**
     * Focus the text editor on click of this button
     * @since 2.0.0
     * @todo
     */
    Rexbuilder_Util.$document.on('click', '.edit-block-content', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");

      var event = jQuery.Event("dblclick");
      event.target = $elem.get(0);
      event.offsetY = 0;
      $elem.parents('.perfect-grid-gallery').trigger(event);
    });

    /**
     * Edit the block content position
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-block-content-position', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var $elemData = $elem.children(".rexbuilder-block-data");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var blockFlexPosition =
        typeof $elemData.attr("data-block_flex_position") == "undefined"
          ? ""
          : $elemData.attr("data-block_flex_position");
      var blockFlexPositionArr = blockFlexPosition.split(" ");
      var blockFlexPositionString =
        blockFlexPositionArr[1] + "-" + blockFlexPositionArr[0];

      var settings = {
        flexPosition: {
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          position: blockFlexPositionString,
        }
      }

      Rexbuilder_Util_Editor.manageElement = true;
      var mousePosition = Rexbuilder_Util_Editor.getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );

      var data = {
        eventName: "rexlive:editBlockContentPosition",
        activeBlockData: settings,
        mousePosition: mousePosition
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Edit the block accordion
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-block-accordion', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var $elemData = $elem.children(".rexbuilder-block-data");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var $accordion = $elem.find(".rex-accordion");
      var a_header = "";
      var a_content = "";
      var a_state = ( $accordion.hasClass("open") ? 'open' : 'close' );
      var a_t_state = ( $accordion.hasClass('no-toggle') ? 'hide' : 'visible' );
      var a_icon = "";
      var a_gallery = false;
      var $temp_h = $accordion.find(".rex-accordion--toggle").clone();
      $temp_h.find(".rex-accordion--toggle-icon").remove();
      if( $accordion.length > 0 ) {
        a_header = $temp_h.html().trim(),
        a_content = $accordion.find(".rex-accordion--content").html().trim();
        a_icon = $accordion.find(".rex-accordion--toggle-icon").html().trim();
        if( $accordion.find(".rex-accordion--content").hasClass("rex-accordion--gallery") ) {
          a_gallery = true;
        }
      }

      var settings = {
        blockData: {
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          accordion: {
            header: a_header,
            icon: a_icon,
            content: a_content,
            state: a_state,
            toggle_state: a_t_state,
            is_gallery: a_gallery
          },
        }
      };

      Rexbuilder_Util_Editor.manageElement = true;
      // var mousePosition = Rexbuilder_Util_Editor.getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );

      var data = {
        eventName: "rexlive:editBlockAccordion",
        activeBlockData: settings,
        // mousePosition: mousePosition
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Edit a block slideshow
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-block-slideshow', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var $elemData = $elem.children(".rexbuilder-block-data");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var slides = [];
      var $slideshow = $elem.find('.rex-slideshow');
      if ( $slideshow.length > 0 )
      {
        $slideshow.find('.rex-slideshow__slide').each(function(i,el) {
          slides.push( el.innerHTML );
        });
      }

      var settings = {
        blockData: {
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
          slideshow: {
            slides: slides
          },
        }
      };

      var data = {
        eventName: "rexlive:editBlockSlideshow",
        activeBlockData: settings,
        // mousePosition: mousePosition
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Listen to updating slideshow by the modal
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('rexlive:updateSlideshow', function(e) {
      var data = e.settings.data_to_send;

      var target = data.target;
      var $elem;

      if (target.modelNumber != "") {
        $elem = Rexbuilder_Util.$rexContainer
          .find(
            'section[data-rexlive-section-id="' +
              target.sectionID +
              '"][data-rexlive-model-number="' +
              target.modelNumber +
              '"]'
          )
          .find('div [data-rexbuilder-block-id="' + target.rexID + '"]');
      } else {
        $elem = Rexbuilder_Util.$rexContainer
          .find('section[data-rexlive-section-id="' + target.sectionID + '"]')
          .find('div [data-rexbuilder-block-id="' + target.rexID + '"]');
      }

      $elem.find(".text-wrap.medium-editor-element").html(data.slideshow.slides);
      // $elem.find(".rex-accordion").rexAccordion();
    });

    /**
     * Edit the block gradient
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-block-gradient', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      _openBlockBackgroundGradient( $elem );
    });

    /**
     * Listen to updating accordion by the modal
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('rexlive:updateAccordion', function(e) {
      var data = e.settings.data_to_send;

      var target = data.target;
      var $elem;

      if (target.modelNumber != "") {
        $elem = Rexbuilder_Util.$rexContainer
          .find(
            'section[data-rexlive-section-id="' +
              target.sectionID +
              '"][data-rexlive-model-number="' +
              target.modelNumber +
              '"]'
          )
          .find('div [data-rexbuilder-block-id="' + target.rexID + '"]');
      } else {
        $elem = Rexbuilder_Util.$rexContainer
          .find('section[data-rexlive-section-id="' + target.sectionID + '"]')
          .find('div [data-rexbuilder-block-id="' + target.rexID + '"]');
      }

      var $accordion_toReplace = $elem.find(".text-wrap.medium-editor-element").find('.rex-accordion');
      if ( $accordion_toReplace.length > 0 ) {
        $accordion_toReplace.replaceWith(data.accordion.complete);
      } else {
        $elem.find(".text-wrap.medium-editor-element").html(data.accordion.complete);
      }

      Rexbuilder_Util_Editor.builderEdited(false);
      // $elem.find(".rex-accordion").rexAccordion();
    });

    /**
     * Edit the block image settings
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-block-image-position', function(e) {
      var $btn = $(e.target);
      var $elem = $btn.parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var $elemData = $elem.children(".rexbuilder-block-data");
      var sectionID = $section.attr("data-rexlive-section-id");
      var $itemContent = $elem.find(".grid-item-content");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

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
        typeof $elemData.attr("data-type_bg_block") == "undefined"
          ? defaultTypeImage
          : $elemData.attr("data-type_bg_block");
      var activePhotoswipe =
        typeof $elemData.attr("data-photoswipe") == "undefined"
          ? ""
          : $elemData.attr("data-photoswipe");
      var imageData = {
        idImage: idImage,
        imageUrl: imageUrl,
        width: width,
        height: height,
        typeBGimage: typeBGimage,
        active: activeImage,
        defaultTypeImage: defaultTypeImage,
        photoswipe: activePhotoswipe,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
      };

      var blockFlexImgPosition =
        typeof $elemData.attr("data-block_flex_img_position") == "undefined"
          ? ""
          : $elemData.attr("data-block_flex_img_position");
      if ( '' === blockFlexImgPosition ) blockFlexImgPosition = 'center middle';

      var blockFlexImgPositionArr = blockFlexImgPosition.split(" ");
      var blockFlexImgPositionString =
        blockFlexImgPositionArr[1] + "-" + blockFlexImgPositionArr[0];
      var img_position = {
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
        position: blockFlexImgPositionString
      };

      var blockState = {
        rexID: rex_block_id,
        x: parseInt( $elem.attr('data-gs-x')),
        y: parseInt( $elem.attr('data-gs-y')),
        w: parseInt( $elem.attr('data-gs-width')),
        h: parseInt( $elem.attr('data-gs-height'))
      };

      var settings = {
        imageBG: imageData,
        flexImgPosition: img_position,
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber,
        },
        blockState: blockState
      };

      Rexbuilder_Util_Editor.manageElement = true;
      var mousePosition = Rexbuilder_Util_Editor.getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );

      var data = {
        eventName: "rexlive:editBlockImageSettings",
        activeBlockData: settings,
        mousePosition: mousePosition
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Triggering the event on MediumEditor when the user close the HTML editor window pressing the saving button
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('rexlive:SetcustomHTML',function(e) {
      TextEditor.triggerMEEvent({
        name:"rexlive:mediumEditor:saveHTMLContent",
        data: e.settings.data_to_send,
        editable: null
      });
    });

    /**
     * Triggering the event on MediumEditor when the user selects a media from the Media Library
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('rexlive:inlineImageEdit',function(e) {
      TextEditor.triggerMEEvent({
        name:"rexlive:mediumEditor:inlineImageEdit",
        data: e.settings.data_to_send,
        editable: null
      });
    });

    /**
     * Triggering the event on MediumEditor when the user selects a media from the Video Library
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('rexlive:mediumEditor:inlineVideoEditor',function(e) {
      TextEditor.triggerMEEvent({
        name:"rexlive:mediumEditor:inlineVideoEditor:Transfer",
        data: e.settings.data_to_send,
        editable: null
      });
    });

    /**
     * Triggering the event on MediumEditor when user selects an icon from the icon list
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('rexlive:mediumEditor:inlineSVG',function(e) {
      TextEditor.triggerMEEvent({
        name:"rexlive:mediumEditor:inlineSVG:transfer",
        data: e.settings.data_to_send,
        editable: null
      });
    });

    // global spectrum logic -> click handlers on color tools
    Rexbuilder_Util.$rexContainer.on("click", ".edit-block-color-background", handleBlockBackgroundColorTool);
    Rexbuilder_Util.$rexContainer.on("click", ".edit-block-overlay-color", handleBlockOverlayColorTool);

    // synch block content to default layout
    Rexbuilder_Util.$rexContainer.on('click', '.synch-block-content', function(event) {
      event.preventDefault();

      var $elem = $(event.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var data = {
        eventName: "rexlive:reSynchContent",
        data: {
          targetInfo: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          },
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });
  };

  /**
   * Launching the spectrum color picker on an input element, for the block background color
   * @param {DOM element} el input element in which launch the color picker
   * @since 2.0.0
   * @deprecated 2.0.4
   */
  var _launchSpectrumPickerBackgorundColorBlock = function( el ) {
    var $picker = $(el);

    var $elem = $picker.parents(".grid-stack-item");
    var $section = $elem.parents(".rexpansive_section");
    var rex_block_id = $elem.attr("data-rexbuilder-block-id");
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";
    var $elemData = $elem.children(".rexbuilder-block-data");

    var bgColorActive = $elemData.attr('data-color_bg_block_active');
    var colorActive = $elemData.attr('data-color_bg_block');

    var $btn_container = $picker.parents('.rexlive-block-toolbox');

    var flagPickerUsed;

    var settings = {
      data_to_send: {
        color: bgColorActive ? colorActive : "",
        active: true,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
      }
    };

    $picker.spectrum({
      replacerClassName: block_picker_classes,
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
      beforeShow: function() {
        Rexbuilder_Color_Palette.show({
          $target: $picker,
          action: "background",
          object: "block"
        });
      },
      show: function() {
        // fix picker position
        _fixPickerContainerPosition( $picker );

        flagPickerUsed = false;
        Rexbuilder_Util_Editor.manageElement = true;
        $picker.parents('.tool-button-floating').addClass('tool-button-floating--active');

        var $this_picker = $(this);
        var $this_picker_block = $this_picker.parents('.grid-stack-item');
        var $this_picker_section = $this_picker_block.parents('.rexpansive_section');

        settings.data_to_send.target.rexID = $this_picker_block.attr("data-rexbuilder-block-id");
        settings.data_to_send.target.sectionID = $this_picker_section.attr("data-rexlive-section-id");
        settings.data_to_send.target.modelNumber = typeof $this_picker_section.attr("data-rexlive-model-number") != "undefined"
        ? $this_picker_section.attr("data-rexlive-model-number")
        : "";
      },
      move: function(color) {
        settings.data_to_send.color = settings.data_to_send.active
          ? color.toRgbString()
          : "";

        var event = jQuery.Event("rexlive:change_block_bg_color");
        event.settings = settings;
        Rexbuilder_Util.$document.trigger(event);

        flagPickerUsed = true;
      },
      change: function(color) {
        //
      },
      hide: function(color) {
        Rexbuilder_Color_Palette.hide();
        if ( flagPickerUsed ) {
          colorActive = color.toRgbString();
          if( $btn_container.hasClass('top-tools') ) {
            $(this).parents('.tool-button--double-icon--wrap').addClass('tool-button--hide');
            $(this).parents('.grid-stack-item').find('.rexlive-block-toolbox.bottom-tools').find('input[name=edit-block-color-background]').parents('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
          }

          settings.data_to_send.color = colorActive;

          var event = jQuery.Event("rexlive:apply_background_color_block");
          event.settings = settings;
          Rexbuilder_Util.$document.trigger(event);
        }

        Rexbuilder_Live_Utilities.hideAllTools();
        flagPickerUsed = false;
      },
    });

		var $close = $closeButtonTemplate.clone();
    $picker.spectrum('container').append($close);

    $close.on('click', function(e) {
      e.preventDefault();
      $picker.spectrum('hide');
    });
  };

  /**
   * Launching spcetrum color picker on an input element, for the block overlay color
   * @param {DOM Element} el input element on which launch spectrum
   * @since 2.0.0
	 * @deprecated 2.0.4
   */
  var _launchSpectrumPickerOverlayColorBlock = function( el ) {
    var $picker = $(el);

    var $elem = $picker.parents(".grid-stack-item");
    var $section = $elem.parents(".rexpansive_section");
    var rex_block_id = $elem.attr("data-rexbuilder-block-id");
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";
    var $elemData = $elem.children(".rexbuilder-block-data");

    var $btn_container = $picker.parents('.rexlive-block-toolbox');

    var flagPickerUsed = false;

    var overlayActive;
    if (
      $elem.hasClass("active-large-block-overlay") ||
      $elem.hasClass("active-medium-block-overlay") ||
      $elem.hasClass("active-small-block-overlay")
    ) {
      overlayActive = false;
    } else {
      overlayActive =
        typeof $elemData.attr("data-overlay_block_color_active") != "undefined" && "" !== $elemData.attr("data-overlay_block_color_active")
          ? JSON.parse( $elemData.attr("data-overlay_block_color_active") )
          : false;
		}

    if (!overlayActive) {
      if (
        Rexbuilder_Util.activeLayout == "default" &&
        $elem.hasClass("active-large-block-overlay")
      ) {
        overlayActive = true;
      }
      if (
        Rexbuilder_Util.activeLayout == "tablet" &&
        $elem.hasClass("active-medium-block-overlay")
      ) {
        overlayActive = true;
      }
      if (
        Rexbuilder_Util.activeLayout == "mobile" &&
        $elem.hasClass("active-small-block-overlay")
      ) {
        overlayActive = true;
      }
		}

    var settings = {
      data_to_send: {
        color: null,
        active: false,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
      }
		};

    $picker.spectrum({
      replacerClassName: block_picker_classes,
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
      beforeShow: function() {
        Rexbuilder_Overlay_Palette.show({
          $target: $picker,
          action: "overlay",
          object: "block"
        });
      },
      show: function() {
        // fix picker position
        _fixPickerContainerPosition( $picker );

        flagPickerUsed = false;
        Rexbuilder_Util_Editor.manageElement = true;
        $picker.parents('.tool-button-floating').addClass('tool-button-floating--active');

        var $this_picker = $(this);
        var $this_picker_block = $this_picker.parents('.grid-stack-item');
        var $this_picker_section = $this_picker_block.parents('.rexpansive_section');

        settings.data_to_send.target.rexID = $this_picker_block.attr("data-rexbuilder-block-id");
        settings.data_to_send.target.sectionID = $this_picker_section.attr("data-rexlive-section-id");
        settings.data_to_send.target.modelNumber = typeof $this_picker_section.attr("data-rexlive-model-number") != "undefined"
        ? $this_picker_section.attr("data-rexlive-model-number")
        : "";
      },
      move: function(color) {
        settings.data_to_send.active = true;
				settings.data_to_send.color =  color.toRgbString();

        if( overlayActive ) {
          var event = jQuery.Event("rexlive:change_block_overlay_color");
        } else {
          var event = jQuery.Event("rexlive:change_block_overlay");
        }

        event.settings = settings;
        Rexbuilder_Util.$document.trigger(event);

        flagPickerUsed = true;
      },
      change: function(color) {
        //
      },
      hide: function(color) {
        Rexbuilder_Overlay_Palette.hide();
        if (flagPickerUsed) {
          settings.data_to_send.active = true;
          settings.data_to_send.color = color.toRgbString();

          if( $btn_container.hasClass('top-tools') ) {
            $(this).parents('.tool-button--double-icon--wrap').addClass('tool-button--hide');
            $(this).parents('.grid-stack-item').find('.rexlive-block-toolbox.bottom-tools').find('input[name=edit-block-overlay-color]').parents('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
          }

          var event = jQuery.Event("rexlive:change_block_overlay");
          event.settings = settings;
          Rexbuilder_Util.$document.trigger(event);
        }

        Rexbuilder_Live_Utilities.hideAllTools();

        flagPickerUsed = false;
      },
    });

    // var close = tmpl('tmpl-tool-close', {});
    // var close = Rexbuilder_Live_Templates.getTemplate('tmpl-tool-close');
		var $close = $closeButtonTemplate.clone();
    $picker.spectrum('container').append($close);

    $close.on('click', function(e) {
      e.preventDefault();
      $picker.spectrum('hide');
    });
  };

  var _openBlockBackgroundGradient = function( $elem ) {
    $elem = ( 0 === $elem.length ? $actualBlock : $elem );
    var $section = $elem.parents(".rexpansive_section");
    var rex_block_id = $elem.attr("data-rexbuilder-block-id");
    var $elemData = $elem.children(".rexbuilder-block-data");
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";

    var bgGradientCol = $elemData.attr('data-color_bg_block');

    var settings = {
      blockData: {
        gradient: bgGradientCol,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
      }
    };

    Rexbuilder_Util_Editor.manageElement = true;
    // var mousePosition = Rexbuilder_Util_Editor.getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );

    var data = {
      eventName: "rexlive:editBlockGradient",
      activeBlockData: settings,
      // mousePosition: mousePosition
    };

    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  var _openBlockOverlayGradient = function( $elem ) {
    $elem = ( 0 === $elem.length ? $actualBlock : $elem );
    var $section = $elem.parents(".rexpansive_section");
    var rex_block_id = $elem.attr("data-rexbuilder-block-id");
    var $elemData = $elem.children(".rexbuilder-block-data");
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";

    var overlayGradientCol = $elemData.attr('data-overlay_block_color');

    var settings = {
      blockData: {
        gradient: overlayGradientCol,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
      }
    };

    Rexbuilder_Util_Editor.manageElement = true;
    // var mousePosition = Rexbuilder_Util_Editor.getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );

    var data = {
      eventName: "rexlive:editBlockOverlayGradient",
      activeBlockData: settings,
      // mousePosition: mousePosition
    };

    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  /**
   * View or hide the T tool on the blocks, if there is or isn't text inside
   * @param  {Element} textElem text wrap
   * @return {void}
   * @since  2.0.5
   */
  function _updateTextTool( textElem ) {
    var $top_tools = $(textElem).parents('.grid-stack-item').find('.block-toolBox__editor-tools');
    var $T_tool = $top_tools.find('.edit-block-content');
    var $content_position_tool = $top_tools.find('.edit-block-content-position');

    if ( textContentEmpty( textElem ) ) {
      $T_tool.removeClass('tool-button--hide');
      $content_position_tool.addClass('tool-button--hide');
    } else {
      $T_tool.addClass('tool-button--hide');
      $content_position_tool.removeClass('tool-button--hide');
    }
  }

  /**
   * Check if a text wrap is empty
   *
   * @param  {Element} elem text element
   * @return {Boolean}      is empty or not
   * @since  2.0.4
   * @version  2.0.5  Moved inside block editor
   */
  function textContentEmpty( elem ) {
    // no childre, text element empty
    if ( 0 === elem.childElementCount ) return true;

    // no text, one children as the span fix
    if ( '' === elem.textContent.trim() && 1 === elem.childElementCount && elem.querySelector('.text-editor-span-fix') ) return true;

    var totImgs = Array.prototype.slice.call( elem.getElementsByTagName('img') ).length;
    var totSvgs = Array.prototype.slice.call( elem.getElementsByTagName('svg') ).length;
    var totIframes = Array.prototype.slice.call( elem.getElementsByTagName('iframe') ).length;

    // text empty and no images, icons or embed as childrens
    return ( 0 === ( totImgs + totSvgs + totIframes ) && '' === elem.textContent.trim() );
  }

  /**
   * Setting the block live color pickers for the background
	 * @returns		{void}
   * @since			2.0.0
	 * @version		2.0.4		Transformed into vanilla js
   * @deprecated 2.0.4
   */
  function _setBlockColorBackgroundPicker() {
  	var inputs = Array.prototype.slice.call(document.querySelectorAll('input[name=edit-block-color-background]'));
  	var tot_inputs = inputs.length;
  	var i = 0;

  	for (; i < tot_inputs; i++) {
  		_launchSpectrumPickerBackgorundColorBlock(inputs[i]);
  	}
  };

  /**
   * Setting the block live color pickers for the overlay
	 * @returns		{void}
   * @since			2.0.0
	 * @version		2.0.4		Transformed into vanilla js
   * @deprecated 2.0.4
   */
  function _setBlockOverlayColorPicker() {
  	var inputs = Array.prototype.slice.call(document.querySelectorAll('input[name=edit-block-overlay-color]'));
  	var tot_inputs = inputs.length;
  	var i = 0;

  	for (; i < tot_inputs; i++) {
  		_launchSpectrumPickerOverlayColorBlock(inputs[i]);
  	}
  };

  /**
   * Set the block tools that need some logic
   * @since 2.0.0
   * @deprecated 2.0.4
   */
  var _setTools = function() {
    _setBlockColorBackgroundPicker();
    _setBlockOverlayColorPicker();
  };

  /**
   * Launch the tools of blocks in a new row
   * @param {jQuery element} $row New row
   * @deprecated 2.0.4
   */
  var _updateBlockToolsOnRow = function( $row ) {
    $row.find('input[name=edit-block-color-background]').each(function(i,el) {
      _launchSpectrumPickerBackgorundColorBlock(el);
    });
    $row.find('input[name=edit-block-overlay-color]').each(function(i,el) {
      _launchSpectrumPickerOverlayColorBlock(el);
    });
  };

  /**
   * Launch the color tools on a block
   * @param  {jQuery Element} $block new block
   * @return {void}
   * @deprecated 2.0.4
   */
  var _updateBlockTools = function( $block ) {
    $block.find('input[name=edit-block-color-background]').each(function(i,el) {
      _launchSpectrumPickerBackgorundColorBlock(el);
    });
    $block.find('input[name=edit-block-overlay-color]').each(function(i,el) {
      _launchSpectrumPickerOverlayColorBlock(el);
    });
  };

  /** GLOBAL SPECTRUM LOGIC */

  var $spGlBlockBackground;   // spectrum global block background
  var $spGlBlockOverlay;      // spectrum global block overlay

  var backgroundPickerUsed;   // global flags to check if the background picker is used
  var overlayPickerUsed;      // global flags to check if the overlay picker is used

  var $actualBlock;             // actual edited block
  var $actualBlockData;         // actual edited block data
  var $actualSection;           // actual edited section
  var $actualBtn;
  var $actualBlockContainerTools;

  var bgColorActive;          // is background color active on the actual edited block?
  var bgColorActiveValue;     // background color on picker opening
  var overlayActive;          // is overlay color active on the actual edited block?
  var overlayActiveValue;     // overlay color on picker opening

  var backgroundColorEventSettings;   // setting object for the background color event
  var overlayColorEventSettings;      // setting object for the overlay color event

  function _setGlobalPickers() {
    // setting globals
    $spGlBlockBackground = $(document.getElementById('global-spectrum-block-background'));
    $spGlBlockOverlay = $(document.getElementById('global-spectrum-block-overlay'));

    $actualBlock = null;
    $actualBlockData = null;

    backgroundPickerUsed = false;
    overlayPickerUsed = false;

    backgroundColorEventSettings = {
      data_to_send: {
        color: "",
        active: false,
        target: {
          sectionID: "",
          modelNumber: "",
          rexID: ""
        },
      }
    };

    overlayColorEventSettings = {
      data_to_send: {
        color: "",
        active: false,
        target: {
          sectionID: "",
          modelNumber: "",
          rexID: ""
        },
      }
    };

    $spGlBlockBackground.spectrum({
      color: '',
      showAlpha: true,
      allowEmpty:true,
      replacerClassName: 'spectrum-placeholder',
      preferredFormat: "hex",
      showPalette: false,
      showInput: true,
      showButtons: false,
      containerClassName: "sp-draggable sp-meditor",
      beforeShow: function() {
        Rexbuilder_Color_Palette.show({
          $target: $spGlBlockBackground,
          action: "background",
          object: "block"
        });
      },
      move: spBlockBackgroundOnMove,
      hide: spBlockBackgroundOnHide
    });

    $spGlBlockOverlay.spectrum({
      color: '',
      showAlpha: true,
      allowEmpty:true,
      replacerClassName: 'spectrum-placeholder',
      preferredFormat: "hex",
      showPalette: false,
      showInput: true,
      showButtons: false,
      containerClassName: "sp-draggable sp-meditor",
      beforeShow: function() {
        Rexbuilder_Overlay_Palette.show({
          $target: $spGlBlockOverlay,
          action: "overlay",
          object: "block"
        });
      },
      move: spBlockOverlayOnMove,
      hide: spBlockOverlayOnHide
    });

    // create close button for background color
		var $spBlockBkgrClose = $closeButtonTemplate.clone();
    $spGlBlockBackground.spectrum('container').append($spBlockBkgrClose);

    $spBlockBkgrClose.on('click', function(event) {
      event.preventDefault();
      if ( null !== bgColorActiveValue ) {
        $spGlBlockBackground.spectrum('set', bgColorActiveValue);
        $spGlBlockBackground.spectrum('container').find('.sp-input').trigger('change');
      }
      $spGlBlockBackground.spectrum('hide');
    });

    // create confirm/reset buttons for background color
    var $spBlockBkgrOptions = $optionsButtonTemplate.clone();
    var $spBlockBkgrOption = $spBlockBkgrOptions.find('.rex-modal-option');
    $spGlBlockBackground.spectrum('container').append($spBlockBkgrOptions);

    $spBlockBkgrOption.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        case 'save':
          $spGlBlockBackground.spectrum('hide');
          break;
        case 'reset':
          if ( null !== bgColorActiveValue ) {
            $spGlBlockBackground.spectrum('set', bgColorActiveValue);
            $spGlBlockBackground.spectrum('container').find('.sp-input').trigger('change');
          }
          break;
        default: break;
      }
    });

    // create close button for overlay color
    var $spBlockOverlayClose = $closeButtonTemplate.clone();
    $spGlBlockOverlay.spectrum('container').append($spBlockOverlayClose);

    $spBlockOverlayClose.on('click', function(e) {
      e.preventDefault();
      if ( null !== overlayActiveValue ) {
        $spGlBlockOverlay.spectrum('set', overlayActiveValue);
        $spGlBlockOverlay.spectrum('container').find('.sp-input').trigger('change');
      }
      $spGlBlockOverlay.spectrum('hide');
    });

    // create confirm/reset buttons for overlay color
    var $spBlockOverlayOptions = $optionsButtonTemplate.clone();
    var $spBlockOverlayOption = $spBlockOverlayOptions.find('.rex-modal-option');
    $spGlBlockOverlay.spectrum('container').append($spBlockOverlayOptions);

    $spBlockOverlayOption.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        case 'save':
          $spGlBlockOverlay.spectrum('hide');
          break;
        case 'reset':
          if ( null !== overlayActiveValue ) {
            $spGlBlockOverlay.spectrum('set', overlayActiveValue);
            $spGlBlockOverlay.spectrum('container').find('.sp-input').trigger('change');
          }
          break;
        default: break;
      }
    });

    // make pickers draggable
    $spGlBlockBackground.spectrum("container").draggable();
    $spGlBlockOverlay.spectrum("container").draggable();
  }

  function spBlockBackgroundOnMove(color) {
    backgroundPickerUsed = true;

    backgroundColorEventSettings.data_to_send.active = true;
    backgroundColorEventSettings.data_to_send.color = backgroundColorEventSettings.data_to_send.active ? ( color ? color.toRgbString() : '' ) : "";

    var event = jQuery.Event("rexlive:change_block_bg_color");
    event.settings = backgroundColorEventSettings;
    Rexbuilder_Util.$document.trigger(event);
  }

  function spBlockBackgroundOnHide(color) {
    if ( backgroundPickerUsed && color ) {
      if( $actualBlockContainerTools.hasClass('top-tools') ) {
        $actualBtn.parents('.tool-button--double-icon--wrap').addClass('tool-button--hide');
        $actualBtn.parents('.grid-stack-item').find('.rexlive-block-toolbox.bottom-tools').find('.edit-block-color-background').parents('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
      }

      backgroundColorEventSettings.data_to_send.color = color.toRgbString();

      var event = jQuery.Event("rexlive:apply_background_color_block");
      event.settings = backgroundColorEventSettings;
      Rexbuilder_Util.$document.trigger(event);
    }

    // hide block tools
    Rexbuilder_Live_Utilities.hideAllTools();

    $spGlBlockBackground.spectrum('set','');

    // clear globs
    $actualBlock = null;
    $actualBlockData = null;
    $actualSection = null;
    $actualBtn = null;
    $actualBlockContainerTools = null;
    bgColorActive = false;
    bgColorActiveValue = null;

    backgroundPickerUsed = false;
  }

  function spBlockOverlayOnMove(color) {
    overlayPickerUsed = true;
    overlayColorEventSettings.data_to_send.active = true;
    overlayColorEventSettings.data_to_send.color =  ( color ? color.toRgbString() : '' );

    if( overlayActive ) {
      var event = jQuery.Event("rexlive:change_block_overlay_color");
    } else {
      var event = jQuery.Event("rexlive:change_block_overlay");
    }

    event.settings = overlayColorEventSettings;
    Rexbuilder_Util.$document.trigger(event);
  }

  function spBlockOverlayOnHide(color) {
    if ( overlayPickerUsed && color ) {
      overlayColorEventSettings.data_to_send.active = true;
      overlayColorEventSettings.data_to_send.color = color.toRgbString();

      if( $actualBlockContainerTools.hasClass('top-tools') ) {
        $actualBtn.parents('.tool-button--double-icon--wrap').addClass('tool-button--hide');
        $actualBtn.parents('.grid-stack-item').find('.rexlive-block-toolbox.bottom-tools').find('.edit-block-overlay-color').parents('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
      }

      var event = jQuery.Event("rexlive:change_block_overlay");
      event.settings = overlayColorEventSettings;
      Rexbuilder_Util.$document.trigger(event);
    }

    // hide block tools
    Rexbuilder_Live_Utilities.hideAllTools();

    $spGlBlockOverlay.spectrum('set','');

    // clear globs
    $actualBlock = null;
    $actualBlockData = null;
    $actualSection = null;
    $actualBtn = null;
    $actualBlockContainerTools = null;
    overlayActive = false;
    overlayActiveValue = null;

    overlayPickerUsed = false;
  }

  function handleBlockBackgroundColorTool(ev) {
    ev.preventDefault();

    // set some globals to prevent useless element search
    $actualBtn = $(ev.currentTarget);
    $actualBlock = $actualBtn.parents('.grid-stack-item');
    $actualBlockData = $actualBlock.children(".rexbuilder-block-data");
    $actualSection = $actualBlock.parents('.rexpansive_section');
    $actualBlockContainerTools = $actualBtn.parents('.rexlive-block-toolbox');

    backgroundColorEventSettings.data_to_send.target.rexID = $actualBlock.attr("data-rexbuilder-block-id");
    backgroundColorEventSettings.data_to_send.target.sectionID = $actualSection.attr("data-rexlive-section-id");
    backgroundColorEventSettings.data_to_send.target.modelNumber = typeof $actualSection.attr("data-rexlive-model-number") != "undefined" ? $actualSection.attr("data-rexlive-model-number") : "";

    // retrieving actual color background, if any
    bgColorActive = $actualBlockData.attr('data-color_bg_block_active');
    bgColorActiveValue = $actualBlockData.attr('data-color_bg_block');

    // maintain tools visible
    Rexbuilder_Util_Editor.manageElement = true;
    $actualBtn.parents('.tool-button-floating').addClass('tool-button-floating--active');

    // set and open spectrum
    backgroundPickerUsed = false;
    $spGlBlockBackground.spectrum('set',bgColorActiveValue);

    $spGlBlockBackground.spectrum('show');
    $spGlBlockBackground.spectrum('container').css('top', ev.pageY + 'px');
    $spGlBlockBackground.spectrum('container').css('left', ev.pageX + 'px');
    _fixPickerContainerPosition( $spGlBlockBackground, ev.currentTarget );

    return false;
  }

  function handleBlockOverlayColorTool(ev) {
    ev.preventDefault();

    $actualBtn = $(ev.currentTarget);
    $actualBlock = $actualBtn.parents('.grid-stack-item');
    $actualBlockData = $actualBlock.children(".rexbuilder-block-data");
    $actualSection = $actualBlock.parents('.rexpansive_section');
    $actualBlockContainerTools = $actualBtn.parents('.rexlive-block-toolbox');

    overlayColorEventSettings.data_to_send.target.rexID = $actualBlock.attr("data-rexbuilder-block-id");
    overlayColorEventSettings.data_to_send.target.sectionID = $actualSection.attr("data-rexlive-section-id");
    overlayColorEventSettings.data_to_send.target.modelNumber = typeof $actualSection.attr("data-rexlive-model-number") != "undefined"
    ? $actualSection.attr("data-rexlive-model-number")
    : "";

    if (
      $actualBlock.hasClass("active-large-block-overlay") ||
      $actualBlock.hasClass("active-medium-block-overlay") ||
      $actualBlock.hasClass("active-small-block-overlay")
    ) {
      overlayActive = false;
    } else {
      overlayActive =
        typeof $actualBlockData.attr("data-overlay_block_color_active") != "undefined" && "" !== $actualBlockData.attr("data-overlay_block_color_active")
          ? JSON.parse( $actualBlockData.attr("data-overlay_block_color_active") )
          : false;
    }

    if (!overlayActive) {
      if (
        Rexbuilder_Util.activeLayout == "default" &&
        $actualBlock.hasClass("active-large-block-overlay")
      ) {
        overlayActive = true;
      }
      if (
        Rexbuilder_Util.activeLayout == "tablet" &&
        $actualBlock.hasClass("active-medium-block-overlay")
      ) {
        overlayActive = true;
      }
      if (
        Rexbuilder_Util.activeLayout == "mobile" &&
        $actualBlock.hasClass("active-small-block-overlay")
      ) {
        overlayActive = true;
      }
    }

    overlayActiveValue = $actualBlockData.attr('data-overlay_block_color');

    // maintain tools visible
    Rexbuilder_Util_Editor.manageElement = true;
    $actualBtn.parents('.tool-button-floating').addClass('tool-button-floating--active');

    // set and open spectrum
    overlayPickerUsed = false;
    $spGlBlockOverlay.spectrum('set',overlayActiveValue);

    $spGlBlockOverlay.spectrum('show');
    $spGlBlockOverlay.spectrum('container').css('top', ev.pageY + 'px');
    $spGlBlockOverlay.spectrum('container').css('left', ev.pageX + 'px');
    _fixPickerContainerPosition( $spGlBlockOverlay, ev.currentTarget );

    return false;
  }

  var _updateBlockBackgroundImageTool = function( $target, data ) {
    // var $tool_top = $target
    //   .parents('.grid-stack-item')
    //   .find('.rexlive-block-toolbox.top-tools')
    //   .find('.edit-block-image');

    var $edit_image_tool = $target
      .parents('.grid-stack-item')
      .find('.rexlive-block-toolbox.bottom-tools')
      .find('.edit-block-image');

    $edit_image_tool
      .addClass('tool-button--image-preview')
      .css('background-image','url('+data.urlImage+')')
      .parent()
      .removeClass('tool-button--hide');
  }

  /**
   * Make visibile the tool to edit the block image position
   * @param {jQuery Object} $target Block Item Content
   * @param {JS Object} data Block Image data
   */
  var _updateBlockImagePositionTool = function( $target, data ) {
    var $image_position_tool = $target
      .parents('.grid-stack-item')
      .find('.rexlive-block-toolbox.bottom-tools')
      .find('.edit-block-image-position');

    $image_position_tool
      .removeClass('tool-button--hide');
  }

  var _updateBlockBackgroundColorToolLive = function( $target, color ) {
    // Set live picker
    var $picker_top = $target
      .parents('.grid-stack-item')
      .find('.rexlive-block-toolbox.top-tools')
      .find('.edit-block-color-background');

    var $picker_bottom = $target
      .parents('.grid-stack-item')
      .find('.rexlive-block-toolbox.bottom-tools')
      .find('.edit-block-color-background');

    if( "" != color ) {
      // $picker_bottom
      //   .val(color)
      //   .spectrum('set',color);
      $picker_bottom
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_bottom
        .siblings('.tool-button--color-preview')
        .css('background-color',color);

      $picker_top
        // .val(color)
        // .spectrum('set',color)
        .parent()
        .addClass('tool-button--hide');
    } else {
      $picker_top
        .parent()
        .removeClass('tool-button--hide');
      $picker_bottom
        .parent()
        .addClass('tool-button--hide');
    }
  };

  var _updateBlockBackgroundColorTool = function($target, color, active) {
    // Set tool picker
    var $picker_top = $target
      .find('.rexlive-block-toolbox.top-tools')
      .find('.edit-block-color-background');

    var $picker_bottom = $target
      .find('.rexlive-block-toolbox.bottom-tools')
      .find('.edit-block-color-background');

    if( "" != color && active ) {
      // $picker_bottom
      //   .val(color)
      //   .spectrum('set',color);
      $picker_bottom
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_bottom
        .siblings('.tool-button--color-preview')
        .css('background-color',color);
      $picker_top
        // .val(color)
        // .spectrum('set',color)
        .parent()
        .addClass('tool-button--hide');
    } else {
      $picker_top
        .parent()
        .removeClass('tool-button--hide');
      $picker_bottom
        .parent()
        .addClass('tool-button--hide');
    }
  }

  var _updateBlockBackgroundGradientTool = function($target, color) {
    // Set tool picker
    var $picker_top = $target
      .find('.rexlive-block-toolbox.top-tools')
      .find('.edit-block-color-background');

    var $picker_bottom = $target
      .find('.rexlive-block-toolbox.bottom-tools')
      .find('.edit-block-color-background');

    if( "" != color ) {
      // $picker_bottom
      //   .val(color)
      //   .spectrum('set',color);
      $picker_bottom
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_bottom
        .siblings('.tool-button--color-preview')
        .css('background',color);
      $picker_top
        // .val(color)
        // .spectrum('set',color)
        .parent()
        .addClass('tool-button--hide');
    } else {
      $picker_top
        .parent()
        .removeClass('tool-button--hide');
      $picker_bottom
        .parent()
        .addClass('tool-button--hide');
    }
  }

  var _updateBlockOverlayColorToolLive = function( $target, color ) {
    // Set live picker
    var $picker_top = $target
      .parents('.grid-stack-item')
      .find('.rexlive-block-toolbox.top-tools')
      .find('.edit-block-overlay-color');

    var $picker_bottom = $target
      .parents('.grid-stack-item')
      .find('.rexlive-block-toolbox.bottom-tools')
      .find('.edit-block-overlay-color');

    if( "" != color ) {
      // $picker_bottom
      //   .val(color)
      //   .spectrum('set',color);
      $picker_bottom
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_bottom
        .siblings('.tool-button--color-preview')
        .css('background-color',color);

      $picker_top
        // .val(color)
        // .spectrum('set',color)
        .parent()
        .addClass('tool-button--hide');
    } else {
      $picker_top
        .parent()
        .removeClass('tool-button--hide');
      $picker_bottom
        .parent()
        .addClass('tool-button--hide');
    }
  };

  var _updateBlockOverlayColorTool = function($target, color, active) {
    // Set tool picker
    var $picker_top = $target
      .find('.rexlive-block-toolbox.top-tools')
      .find('.edit-block-overlay-color');

    var $picker_bottom = $target
      .find('.rexlive-block-toolbox.bottom-tools')
      .find('.edit-block-overlay-color');

    if( "" != color && active ) {
      // $picker_bottom
      //   .val(color)
      //   .spectrum('set',color);
      $picker_bottom
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_bottom
        .siblings('.tool-button--color-preview')
        .css('background-color',color);
      $picker_top
        // .val(color)
        // .spectrum('set',color)
        .parent()
        .addClass('tool-button--hide');
    } else {
      $picker_top
        .parent()
        .removeClass('tool-button--hide');
      $picker_bottom
        .parent()
        .addClass('tool-button--hide');
    }
  }

  var _updateBlockOverlayGradientTool = function($target, color) {
    // Set tool picker
    var $picker_top = $target
      .find('.rexlive-block-toolbox.top-tools')
      .find('.edit-block-overlay-color');

    var $picker_bottom = $target
      .find('.rexlive-block-toolbox.bottom-tools')
      .find('.edit-block-overlay-color');

    if( "" != color ) {
      // $picker_bottom
      //   .val(color)
      //   .spectrum('set',color);
      $picker_bottom
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_bottom
        .siblings('.tool-button--color-preview')
        .css('background',color);
      $picker_top
        // .val(color)
        // .spectrum('set',color)
        .parent()
        .addClass('tool-button--hide');
    } else {
      $picker_top
        .parent()
        .removeClass('tool-button--hide');
      $picker_bottom
        .parent()
        .addClass('tool-button--hide');
    }
  };

  /**
   * Fix the picker container positon to a correctly view
   * @since 2.0.0
   */
  var _fixPickerContainerPosition = function( $picker, pickerTool ) {
    var container = $picker.spectrum('container')[0];
    var containerInfo = container.getBoundingClientRect();
    var topPosition = containerInfo.top;
    var pickerInfo;
    if ( 'undefined' !== typeof pickerTool ) {
      pickerInfo = pickerTool.parentNode.getBoundingClientRect();
    } else {
      pickerInfo = $picker[0].parentNode.getBoundingClientRect();
    }

    var leftPosition = parseInt( container.style.left );

    if( topPosition + containerInfo.height == pickerInfo.top ) {
      container.style.top = ( parseInt( container.style.top ) - 10 ) + 'px';
    } else if ( topPosition == pickerInfo.top + pickerInfo.height ) {
      container.style.top = ( parseInt( container.style.top ) + 10 ) + 'px';
    }

    if ( leftPosition + container.offsetWidth + 15 >= document.body.offsetWidth ) {
      if ( leftPosition - container.offsetWidth < 0 ) {
        container.style.left = '15px';
      } else {
        container.style.left = ( leftPosition - container.offsetWidth ) + 'px';
      }
    }
  };

  /**
   * Initing the block toolbar
   */
  var init = function() {
    block_picker_classes = 'tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum';
    _attachEvents();
    // _setTools();
    _setGlobalPickers();
  };

  return {
    init: init,
    // launchSpectrumPickerBackgorundColorBlock: _launchSpectrumPickerBackgorundColorBlock,
    // launchSpectrumPickerOverlayColorBlock: _launchSpectrumPickerOverlayColorBlock,
    // updateBlockToolsOnRow: _updateBlockToolsOnRow,
    // updateBlockTools: _updateBlockTools,
    updateBlockBackgroundImageTool: _updateBlockBackgroundImageTool,
    updateBlockImagePositionTool: _updateBlockImagePositionTool,
    updateBlockBackgroundColorToolLive: _updateBlockBackgroundColorToolLive,
    updateBlockBackgroundColorTool: _updateBlockBackgroundColorTool,
    updateBlockBackgroundGradientTool: _updateBlockBackgroundGradientTool,
    updateBlockOverlayColorToolLive: _updateBlockOverlayColorToolLive,
    updateBlockOverlayColorTool: _updateBlockOverlayColorTool,
    updateBlockOverlayGradientTool: _updateBlockOverlayGradientTool,
    openBlockBackgroundGradient: _openBlockBackgroundGradient,
    openBlockOverlayGradient: _openBlockOverlayGradient,
    updateTextTool: _updateTextTool
  }
})(jQuery);