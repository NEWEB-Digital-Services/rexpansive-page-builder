/**
 * Object that handles all the live events triggered on a row
 * To edit a selected row
 * @since 2.0.0
 */
var Rexbuilder_Section_Editor = (function($) {
  "use strict";

  // var $row_backgrond_color_pickers = null;
  // var $row_overlay_color_pickers = null;
  var row_picker_classes;

  /**
   * Caching some elements
   * @since 2.0.0
   * @deprecated  decide if useless
   */
  var _cache_elements = function() {
    // $row_backgrond_color_pickers = $('input[name=edit-row-color-background]');
    // $row_overlay_color_pickers = $('input[name=edit-row-overlay-color]');
  };

  var _attachEvents = function() {
    /**
     * Event attached on change row dimension radio buttons
     * 
     * At the width selection, create a rexlive:set_section_width event with all the needed data
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('change', '.edit-row-width', function(e) {
      // var rexID = e.target.name.split('-')[2];
      // var $section_data = $(e.target).parents('.rexpansive_section').children('.section-data');
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var width = '';
      var type = '';
      var vals = e.target.value.trim().split(/(\d+)/);
      width = vals[1];
      type = vals[2];
      
      var settings = {
        data_to_send: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          sectionWidth: {
            width: width,
            type: type
          },
        },
        forged: true
      };

      var event = jQuery.Event("rexlive:set_section_width");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);
    });

    /**
     * Event attached on row layout changed
     * @since 2.0.0
     * @deprecated Now we have the checkbox
     */
    Rexbuilder_Util.$document.on('change', '.edit-row-layout', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      // var $section_data = $section.children('.section-data');
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          layout: e.target.value
        },
        forged: true
      };

      var event = jQuery.Event("rexlive:set_gallery_layout");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);
    });

    /**
     * Event attached on row layout changed with the checkbox
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('change', '.edit-row-layout-checkbox', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      // var $section_data = $section.children('.section-data');
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          layout: ( e.target.checked ? 'fixed' : 'masonry' )
        },
        forged: true
      };

      var event = jQuery.Event("rexlive:set_gallery_layout");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);
    });

    /**
     * Event attached on background image button
     * 
     * Create a rexlive:openLiveImageUploader message to send to iframe parent
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-row-image-background', function(e) {
      var $section = $(this).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var data = {
        eventName: "rexlive:openLiveImageUploader",
        live_uploader_data: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          idImage: this.getAttribute('value'),
          returnEventName: 'rexlive:apply_background_image_section',
          data_to_send: {
            active: true
          }
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * De-selecting the image on a background row
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.deactivate-row-image-background', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $section_data = $section.children('.section-data');

      var idImage = $section_data.attr('data-id_image_bg_section');

      if( "" !== idImage) {
        var settings = {
          data_to_send: {
            sectionTarget: {
              sectionID: sectionID,
              modelNumber: modelNumber
            },
            active: false,
            idImage: idImage,
            urlImage: $section_data.attr('data-image_bg_section'),
            width: $section.attr('data-background_image_width'),
            height: $section.attr('data-background_image_height'),
          },
        };
        var event = jQuery.Event("rexlive:apply_background_image_section");
        event.settings = settings;
        Rexbuilder_Util.$document.trigger(event);

        // Synch Top Toolbar
        var data = {
          eventName: "rexlive:updateTopToolbar",
          updateInfo: {
            image_bg_section: "",
            image_bg_section_active: false
          }
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      }
    });

    /**
     * De-selecting the color on a background row
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.deactivate-row-color-background', function(e) {
      var $btn = $(e.target);
      var $section = $(e.target).parents(".rexpansive_section");
      // var $section_data = $section.children('.section-data');
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          color: "",
          active: false,
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          }
        },
      };

      var event = jQuery.Event("rexlive:apply_background_color_section");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);

      // Synch Top Toolbar
      var data = {
        eventName: "rexlive:updateTopToolbar",
        updateInfo: {
          color_bg_section: "",
          color_bg_section_active: false
        }
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * De-selecting the overlay color on a background row
     */
    Rexbuilder_Util.$document.on('click', '.deactivate-row-overlay-color', function(e) {
      var $section = $(e.target).parents(".rexpansive_section");
      var $section_data = $section.children('.section-data');
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          color: $section_data.attr('data-row_overlay_color'),
          active: false,
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          }
        }
      }

      var event = jQuery.Event("rexlive:change_section_overlay");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);

      // Synch Top Toolbar
      var data = {
        eventName: "rexlive:updateTopToolbar",
        updateInfo: {
          row_overlay_color: "",
          row_overlay_active: false
        }
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Open the modal to editing or insert a background video on a row
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.edit-row-video-background', function(e) {
      e.preventDefault();
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $sectionData = $section.children(".section-data");

      var mp4Video =
        typeof $sectionData.attr("data-video_mp4_url") == "undefined"
          ? ""
          : $sectionData.attr("data-video_mp4_url");
      var youtubeVideo =
        typeof $sectionData.attr("data-video_bg_url_section") == "undefined"
          ? ""
          : $sectionData.attr("data-video_bg_url_section");
      var mp4VideoID =
        typeof $sectionData.attr("data-video_bg_id_section") == "undefined"
          ? ""
          : $sectionData.attr("data-video_bg_id_section");
      var vimeoUrl =
        typeof $sectionData.attr("data-video_bg_url_vimeo_section") ==
        "undefined"
          ? ""
          : $sectionData.attr("data-video_bg_url_vimeo_section");

      var isFastButton = $(e.target).parents('.row-toolBox__fast-configuration').length;
      var mousePosition = null;
      if( isFastButton > 0 ) {
        mousePosition = Rexbuilder_Util_Editor.getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );
      }

      $section.addClass('activeRowTools');

      var data = {
        eventName: "rexlive:editRowVideoBackground",
        activeBG: {
          bgVideo: {
            sectionTarget: {
              sectionID: sectionID,
              modelNumber: modelNumber
            },
            youtubeVideo: youtubeVideo,
            vimeoUrl: vimeoUrl,
            mp4Video: mp4Video,
            mp4VideoID: mp4VideoID
          }
        },
        mousePosition: mousePosition
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Deactivating a video (everyone) on a background of a row
     * @since 2.0.0
     */
    Rexbuilder_Util.$document.on('click', '.deactivate-row-video-background', function(e) {
      e.preventDefault();

      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var settings = {
        data_to_send: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          typeVideo: "",
          urlVimeo: "",
          urlYoutube: "",
          videoMp4: {
            idMp4: "",
            linkMp4: "",
          },
        }
      };

      var event = jQuery.Event("rexlive:update_section_background_video");
      event.settings = settings;
      Rexbuilder_Util.$document.trigger(event);

      // Synch Top Toolbar
      var data = {
        eventName: "rexlive:updateTopToolbar",
        updateInfo: {
          video_bg_url_section: "",
          video_bg_id_section: "",
          video_bg_url_vimeo_section: "",
          video_mp4_url: "",
        }
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });
  };

  /**
   * Setting the row live color pickers for the background
   * @since 2.0.0
   */
  var _setRowColorBackgroundPicker = function() {
    $('input[name=edit-row-color-background]').each(function(i, el) {
      _launchSpectrumPickerBackgorundColorRow( el );
    });
  };

  /**
   * Setting the row live color pickers for the overlay
   * @since 2.0.0
   */
  var _setRowOverlayColorPicker = function() {
    $('input[name=edit-row-overlay-color]').each(function(i, el) {
      _launchSpectrumPickerOverlayColorRow( el );
    });
  };

  /**
   * Launching the spectrum color picker on an input element, for the row background color
   * @param {DOM element} el input element in which launch the color picker
   * @since 2.0.0
   */
  var _launchSpectrumPickerBackgorundColorRow = function( el ) {
    var $picker = $(el);

    var $section = $picker.parents(".rexpansive_section");
    var $section_data = $section.children('.section-data');
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";

    var bgColorActive = ( 'undefined' !== typeof $section_data.attr('data-color_bg_section_active') ? $section_data.attr('data-color_bg_section_active') : 'true' );
    var colorActive = $section_data.attr('data-color_bg_section');
    var settings = {
      // eventName: "rexlive:change_section_bg_color",
      data_to_send: {
        color: null,
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        }
      },
    };

    var flagPickerUsed = false;

    $picker.spectrum({
      replacerClassName: row_picker_classes,
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
      // containerClassName: "rexbuilder-materialize-wrap block-background-color-picker",
      show: function() {
        flagPickerUsed = false;
        $section.addClass('activeRowTools');
        $picker.parents('.tool-button-floating').addClass('tool-button-floating--active');
      },
      move: function(color) {
        settings.data_to_send.color = bgColorActive
          ? color.toRgbString()
          : "";
        
        var event = jQuery.Event("rexlive:change_section_bg_color");
        event.settings = settings;
        Rexbuilder_Util.$document.trigger(event);

        flagPickerUsed = true;
      },
      change: function(color) {
        // nothing to do
      },
      hide: function(color) {
        if (flagPickerUsed) {
          colorActive = color.toRgbString();
          
          var data_color = {
            data_to_send: {
              color: bgColorActive ? colorActive : "",
              active: bgColorActive,
              sectionTarget: settings.data_to_send.sectionTarget
            }
          };
  
          settings.data_to_send = data_color.data_to_send;
  
          var event = jQuery.Event("rexlive:apply_background_color_section");
          event.settings = settings;
          Rexbuilder_Util.$document.trigger(event);

          // Synch Top Toolbar
          var data = {
            eventName: "rexlive:updateTopToolbar",
            updateInfo: {
              color_bg_section: colorActive,
              color_bg_section_active: bgColorActive
            }
          };
          Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        }

        Rexbuilder_Util_Editor.hideAllTools();

        flagPickerUsed = false;
      },
      // cancelText: "",
      // chooseText: ""
    });

    var close = tmpl('tmpl-tool-close', {});
    var $close = $(close);
    $picker.spectrum('container').append($close);

    $close.on('click', function(e) {
      e.preventDefault();
      $picker.spectrum('hide');
    });

    $picker.prev('.edit-row-color-background').on('click', function() {
      $picker.spectrum('show');
    });
  };

  /**
   * Launching the spectrum color picker on an input element, for the row overlay color
   * @param {DOM element} el input element in which launch the color picker
   * @since 2.0.0
   */
  var _launchSpectrumPickerOverlayColorRow = function( el ) {
    var $picker = $(el);

    var $section = $picker.parents(".rexpansive_section");
    var $section_data = $section.children('.section-data');
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";
    
    var flagPickerUsed = false;

    var overlayColorActive = JSON.parse( ( 'undefined' !== typeof $section_data.attr('data-row_overlay_active') ? $section_data.attr('data-row_overlay_active') : false ) );
    var changeColorEvent = {
      eventName: "rexlive:change_section_overlay_color",
      data_to_send: {
        color: null,
        active: false,
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        }
      }
    };
    
    $picker.spectrum({
      replacerClassName: row_picker_classes,
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
      // containerClassName: "rexbuilder-materialize-wrap block-overlay-color-picker",
      show: function() {
        flagPickerUsed = false;
        $section.addClass('activeRowTools');
        $picker.parents('.tool-button-floating').addClass('tool-button-floating--active');
      },
      move: function(color) {
        changeColorEvent.data_to_send.active = true;
        changeColorEvent.data_to_send.color = color.toRgbString();
        if( overlayColorActive ) {
          var event = jQuery.Event("rexlive:change_section_overlay_color");
        } else {
          var event = jQuery.Event("rexlive:change_section_overlay");
        }
        event.settings = changeColorEvent;
        Rexbuilder_Util.$document.trigger(event);

        flagPickerUsed = true;
      },
      change: function(color) {
        //
      },
      hide: function(color) {
        if(flagPickerUsed) {
          changeColorEvent.data_to_send.color = color.toRgbString();
          changeColorEvent.data_to_send.active = true;

          var event = jQuery.Event("rexlive:change_section_overlay");
          event.settings = changeColorEvent;
          Rexbuilder_Util.$document.trigger(event);

          // Synch Top Toolbar
          var data = {
            eventName: "rexlive:updateTopToolbar",
            updateInfo: {
              row_overlay_color: changeColorEvent.data_to_send.color,
              row_overlay_active: true
            }
          };
          Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        }

        Rexbuilder_Util_Editor.hideAllTools();

        flagPickerUsed = false;
      },
      // cancelText: "",
      // chooseText: ""
    });

    var close = tmpl('tmpl-tool-close', {});
    var $close = $(close);
    $picker.spectrum('container').append($close);

    $close.on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      // $picker.spectrum('revert');
      $picker.spectrum('hide');
    });
  };

  /**
   * Setting the row tools that need some logic
   * @since 2.0.0
   */
  var _setTools = function() {
    _setRowColorBackgroundPicker();
    _setRowOverlayColorPicker();
  };

  /**
   * Launch the row tools
   * @param {jQuery element} $row new row
   */
  var _updateRowTools = function( $row ) {
    $row.find('input[name=edit-row-color-background]').each(function(i,el) {
      _launchSpectrumPickerBackgorundColorRow(el);
    });
    $row.find('input[name=edit-row-overlay-color]').each(function(i,el) {
      _launchSpectrumPickerOverlayColorRow(el);
    });
  };

  /**
   * Setting the tool for the row image background preview
   * @param {jQuery Object} $target edited row
   * @param {JS object} data background image data
   */
  var _updateRowBackgroundImageTool = function( $target, data ) {
    var $tool_fast = $target
      .find('.row-toolBox__fast-configuration')
      .find('.edit-row-image-background');
    var $tool_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('.edit-row-image-background');

    $tool_fast
      .addClass('tool-button--image-preview')
      .attr('value',data.idImage)
      .css('background-image','url('+data.urlImage+')')
      .parent()
      .removeClass('tool-button--hide');

    $tool_standard
      .addClass('tool-button--hide');
  };

  /**
   * Reset the background image tools
   * @param {jQuery Object} $target row edited
   */
  var _resetRowBackgroundImageTool = function( $target ) {
    var $tool_fast = $target
      .find('.row-toolBox__fast-configuration')
      .find('.edit-row-image-background');
    var $tool_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('.edit-row-image-background');

    $tool_fast
      .removeClass('tool-button--image-preview')
      .attr('value','')
      .css('background-image','none')
      .parent()
      .addClass('tool-button--hide');

    $tool_standard
      // .parent()
      .removeClass('tool-button--hide');
  }

  /**
   * Setting the tool for the row color background preview
   * @param {jQuery Object} $target edited row
   * @param {string} color color to set
   */
  var _updateRowBackgroundColorTool = function( $target, color ) {
    var $picker_fast = $target
      .find('.row-toolBox__fast-configuration')
      .find('input[name=edit-row-color-background]');
    var $picker_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('input[name=edit-row-color-background]');

    if( "" != color ) {
      $picker_fast
        .val(color)
        .spectrum('set',color);
      $picker_fast
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_fast
        .siblings('.tool-button--color-preview')
        .css('background-color',color);

      $picker_standard
        .val(color)
        .spectrum('set',color)
        .parent()
        .addClass('tool-button--hide');
    } else {
      $picker_standard
        .parent()
        .removeClass('tool-button--hide');
      $picker_fast
        .parent()
        .addClass('tool-button--hide');
    }
  };

  /**
   * 
   * @param {*} $target 
   * @param {*} color 
   */
  var _updateRowBackgroundColorToolLive = function( $target, color ) {
    var $picker = $target
      .find('input[name=edit-row-color-background]');
    // Set live picker
    $picker
      .val(color)
      .spectrum('set',color);
    $picker
      .parent()
      .addClass('tool-button--picker-preview')
      .removeClass('tool-button--hide')
    $picker
      .siblings('.tool-button--color-preview')
      .css('background-color',color);
  };

  /**
   * Update the overlay tools
   * @param {jQuery Object} $target row edited
   * @param {JS Object} overlay_data object with the overlay data
   */
  var _updateRowOverlayColorTool = function( $target, overlay_data ) {
    var $picker_fast = $target
      .find('.row-toolBox__fast-configuration')
      .find('input[name=edit-row-overlay-color]');
    var $picker_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('input[name=edit-row-overlay-color]');

    if( overlay_data.active.toString() == "true" ) {
      $picker_fast
        .val(overlay_data.color)
        .spectrum("set",overlay_data.color)

      $picker_fast
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_fast
        .siblings('.tool-button--color-preview')
        .css('background-color',overlay_data.color);

      $picker_standard
        .val(overlay_data.color)
        .spectrum('set',overlay_data.color)
        .parent()
        .addClass('tool-button--hide');
    } else {
      $picker_standard
        .parent()
        .removeClass('tool-button--hide');
      $picker_fast
        .parent()
        .addClass('tool-button--hide');
    }
  }

  var _updateRowOverlayColorToolLive = function( $target, color ) {
    var $picker = $target
      .find('input[name=edit-row-overlay-color]');

    $picker
      .val(color)
      .spectrum("set",color)
    
    $picker
      .parent()
      .addClass('tool-button--picker-preview')
    $picker
      .siblings('.tool-button--color-preview')
      .css('background-color',color);
  }

  /**
   * Updating the video tools for a row
   * @param {jQuery Object} $target row edited
   * @param {JS Object} info information about the row background video
   */
  var _updateRowBackgroundVideo = function( $target, info ) {
    var $tool_fast = $target
      .find('.row-toolBox__fast-configuration')
      .find('.edit-row-video-background');
    var $tool_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('.edit-row-video-background');

    if( "" == info.typeVideo ) {
      $tool_fast
        .parent()
        .addClass('tool-button--hide');
      $tool_standard
        .removeClass('tool-button--hide');
    } else {
      $tool_fast
        .parent()
        .removeClass('tool-button--hide');
      $tool_standard
        .addClass('tool-button--hide');
    }
  };

  /**
   * Listen row data changing to show/hide fast configuration toolbar
   * @since 2.0.0
   */
  var _listenRowDataChange = function() {
    // Select the data nodes to observe
    Rexbuilder_Section_Editor.dataNodes = document.getElementsByClassName('section-data');

    // Callback
    var callback = function(mutationsList, observer) {
      if( ( "false" == mutationsList[0].target.getAttribute("data-color_bg_section_active") || "" == mutationsList[0].target.getAttribute("data-color_bg_section") ) && ( "false" == mutationsList[0].target.getAttribute('data-image_bg_section_active') || "" == mutationsList[0].target.getAttribute("data-id_image_bg_section") ) && ( "false" == mutationsList[0].target.getAttribute("data-row_overlay_active") || "" == mutationsList[0].target.getAttribute("data-row_overlay_color") ) && "" == mutationsList[0].target.getAttribute("data-video_bg_url_section") && "" == mutationsList[0].target.getAttribute("data-video_bg_id_section") && "" == mutationsList[0].target.getAttribute("data-video_bg_url_vimeo_section") ) {
        $(mutationsList[0].target.parentNode).addClass('rowTools__hide-fast-data');
      } else {
        $(mutationsList[0].target.parentNode).removeClass('rowTools__hide-fast-data');
      }
    };

    // Create the MutationObserver
    Rexbuilder_Section_Editor.dataObserver = new MutationObserver(callback);

    // Monitor the data nodes
    for(var i=0; i<Rexbuilder_Section_Editor.dataNodes.length; i++) {
      Rexbuilder_Section_Editor.dataObserver.observe(Rexbuilder_Section_Editor.dataNodes[i], Rexbuilder_Section_Editor.config);
    }

    // Stop observe
    // Rexbuilder_Section_Editor.dataObserver.disconnect();
  };

  /**
   * Add dynamic observer on new rows
   * @param {HTML Node} data new row to listen
   */
  var _listenNewRowDataChange = function( dataEl ) {
    Rexbuilder_Section_Editor.dataObserver.observe( dataEl, Rexbuilder_Section_Editor.config);
    // triggering change to launch control
    dataEl.setAttribute("data-load", "true");
  };

  var _triggerRowDataChange = function() {
    // Mutate section data to trigger the check for fast configuration
    for(var i=0; i < Rexbuilder_Section_Editor.dataNodes.length; i++ ) {
      Rexbuilder_Section_Editor.dataNodes[i].setAttribute('data-load','true');
    }
  };

  /**
   * Initing the row toolbar
   */
  var init = function() {
    // _cache_elements();
    this.dataObserver = null;
    this.dataNodes = null;
    // Config the observer
    this.config = { 
      attributes: true, 
      childList: false, 
      subtree: false, 
      attributeFilter: ["data-load", "data-color_bg_section_active", "data-color_bg_section", 'data-image_bg_section_active', "data-id_image_bg_section", "data-row_overlay_active", "data-row_overlay_color", "data-video_bg_url_section", "data-video_bg_id_section", "data-video_bg_url_vimeo_section"] 
    };

    row_picker_classes = 'tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum';
    _attachEvents();
    _setTools();
    _listenRowDataChange();
  };

  return {
    init: init,
    launchSpectrumPickerBackgorundColorRow: _launchSpectrumPickerBackgorundColorRow,
    launchSpectrumPickerOverlayColorRow: _launchSpectrumPickerOverlayColorRow,
    updateRowTools: _updateRowTools,
    updateRowBackgroundImageTool: _updateRowBackgroundImageTool,
    resetRowBackgroundImageTool: _resetRowBackgroundImageTool,
    updateRowBackgroundColorTool: _updateRowBackgroundColorTool,
    updateRowBackgroundColorToolLive: _updateRowBackgroundColorToolLive,
    updateRowOverlayColorTool: _updateRowOverlayColorTool,
    updateRowOverlayColorToolLive: _updateRowOverlayColorToolLive,
    updateRowBackgroundVideo: _updateRowBackgroundVideo,
    triggerRowDataChange: _triggerRowDataChange,
    listenNewRowDataChange: _listenNewRowDataChange
  }
})(jQuery);