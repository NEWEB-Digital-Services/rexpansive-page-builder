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
    Rexbuilder_Util.$rexContainer.on('click', '.edit-row-image-background', function(e) {
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
    Rexbuilder_Util.$rexContainer.on('click', '.deactivate-row-image-background', function(e) {
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
    Rexbuilder_Util.$rexContainer.on('click', '.deactivate-row-color-background', function(e) {
      e.stopPropagation()
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
    Rexbuilder_Util.$rexContainer.on('click', '.deactivate-row-overlay-color', function(e) {
      e.stopPropagation()
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
    Rexbuilder_Util.$rexContainer.on('click', '.edit-row-video-background', function(e) {
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
    Rexbuilder_Util.$rexContainer.on('click', '.deactivate-row-video-background', function(e) {
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

    // global spectrum logic -> click handlers on color tools
    Rexbuilder_Util.$rexContainer.on("click", ".edit-row-color-background", handleSectionBackgroundColorTool);
    Rexbuilder_Util.$rexContainer.on("click", ".edit-row-overlay-color", handleSectionOverlayColorTool);

    // synch section content to default layout
    Rexbuilder_Util.$rexContainer.on('click', '.synch-section-content', function(event) {
      event.preventDefault();

      var $section = $(event.target).parents(".rexpansive_section");
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
            rexID: 'self'
          },
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });
  };

  /**
   * Setting the row live color pickers for the background
   * @since 2.0.0
   * @deprecated 2.0.4
   */
  var _setRowColorBackgroundPicker = function() {
    $('input[name=edit-row-color-background]').each(function(i, el) {
      _launchSpectrumPickerBackgorundColorRow( el );
    });
  };

  /**
   * Setting the row live color pickers for the overlay
   * @since 2.0.0
   * @deprecated 2.0.4
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
   * @deprecated 2.0.4
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
      beforeShow: function() {
        Rexbuilder_Color_Palette.show({
          $target: $picker,
          object: "section",
          action: "background"
        });
      },
      show: function() {
        // fix picker position
        _fixPickerContainerPosition( $picker );

        flagPickerUsed = false;
        $section.addClass('activeRowTools');
        $picker.parents('.tool-button-floating').addClass('tool-button-floating--active');

        var $this_picker = $(this);
        var $this_picker_section = $this_picker.parents('.rexpansive_section');

        settings.data_to_send.sectionTarget.sectionID = $this_picker_section.attr("data-rexlive-section-id");
        settings.data_to_send.sectionTarget.modelNumber = typeof $this_picker_section.attr("data-rexlive-model-number") != "undefined"
        ? $this_picker_section.attr("data-rexlive-model-number")
        : "";
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
        Rexbuilder_Color_Palette.hide();
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

        Rexbuilder_Live_Utilities.hideAllTools();

        flagPickerUsed = false;
      },
      // cancelText: "",
      // chooseText: ""
    });

		// var close = tmpl('tmpl-tool-close', {});
    var close = Rexbuilder_Live_Templates.getTemplate('tmpl-tool-close');
		
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
   * @deprecated 2.0.4
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
      beforeShow: function() {
        Rexbuilder_Overlay_Palette.show({
          $target: $picker,
          object: "section",
          action: "overlay"
        });
      },
      show: function() {
        _fixPickerContainerPosition( $picker );

        flagPickerUsed = false;
        $section.addClass('activeRowTools');
        $picker.parents('.tool-button-floating').addClass('tool-button-floating--active');

        var $this_picker = $(this);
        var $this_picker_section = $this_picker.parents('.rexpansive_section');

        changeColorEvent.data_to_send.sectionTarget.sectionID = $this_picker_section.attr("data-rexlive-section-id");
        changeColorEvent.data_to_send.sectionTarget.modelNumber = typeof $this_picker_section.attr("data-rexlive-model-number") != "undefined"
        ? $this_picker_section.attr("data-rexlive-model-number")
        : "";
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
        Rexbuilder_Overlay_Palette.hide();
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

        Rexbuilder_Live_Utilities.hideAllTools();

        flagPickerUsed = false;
      },
      // cancelText: "",
      // chooseText: ""
    });

    // var close = tmpl('tmpl-tool-close', {});
    var close = Rexbuilder_Live_Templates.getTemplate('tmpl-tool-close')
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
   * @deprecated 2.0.4
   */
  var _setTools = function() {
    _setRowColorBackgroundPicker();
    _setRowOverlayColorPicker();
  };

  /**
   * Launch the row tools
   * @param {jQuery element} $row new row
   * @deprecated 2.0.4
   */
  var _updateRowTools = function( $row ) {
    $row.find('input[name=edit-row-color-background]').each(function(i,el) {
      _launchSpectrumPickerBackgorundColorRow(el);
    });
    $row.find('input[name=edit-row-overlay-color]').each(function(i,el) {
      _launchSpectrumPickerOverlayColorRow(el);
    });
  };

  /** GLOBAL SPECTRUM LOGIC */

  var $spGlRowBackground;   // spectrum global row background
  var $spGlRowOverlay;      // spectrum global row overlay

  var backgroundPickerUsed;   // global flags to check if the background picker is used
  var overlayPickerUsed;      // global flags to check if the overlay picker is used

  var $actualSection;             // actual edited section
  var $actualSectionData;         // actual edited section data
  var bgColorActive;              // is background color active on the actual edited section?
  var overlayColorActive;         // is overlay color active on the actual edited section?

  var backgroundColorEventSettings;   // setting object for the background color event
  var overlayColorEventSettings;      // setting object for the overlay color event

  function _setGlobalPickers() {
    // setting globals
    $spGlRowBackground = $(document.getElementById('global-spectrum-row-background'));
    $spGlRowOverlay = $(document.getElementById('global-spectrum-row-overlay'));

    $actualSection = null;
    $actualSectionData = null;

    backgroundPickerUsed = false;
    overlayPickerUsed = false;

    backgroundColorEventSettings = {
      data_to_send: {
        color: null,
        sectionTarget: {
          sectionID: '',
          modelNumber: ''
        }
      },
    };

    overlayColorEventSettings = {
      data_to_send: {
        color: null,
        active: false,
        sectionTarget: {
          sectionID: '',
          modelNumber: ''
        }
      }
    };

    // close button HTML
    var close = Rexbuilder_Live_Templates.getTemplate('tmpl-tool-close');

    // launch spectrum for row background
    $spGlRowBackground.spectrum({
      color: '',
      showAlpha: true,
      allowEmpty:true,
      replacerClassName: 'spectrum-placeholder',
      preferredFormat: "hex",
      showPalette: false,
      showInput: true,
      showButtons: false,
      beforeShow: function() {
        Rexbuilder_Color_Palette.show({
          $target: $spGlRowBackground,
          object: "section",
          action: "background"
        });
      },
      move: spRowBackgroundOnMove,
      hide: spRowBackgroundOnHide
    });

    // launch spectrum for row overlay
    $spGlRowOverlay.spectrum({
      color: '',
      showAlpha: true,
      allowEmpty:true,
      replacerClassName: 'spectrum-placeholder',
      preferredFormat: "hex",
      showPalette: false,
      showInput: true,
      showButtons: false,
      beforeShow: function() {
        Rexbuilder_Overlay_Palette.show({
          $target: $spGlRowOverlay,
          object: "section",
          action: "overlay"
        });
      },
      move: spRowOverlayOnMove,
      hide: spRowOverlayOnHide
    });

    // create close button for background color
    var $spRowBkgrClose = $(close);
    $spGlRowBackground.spectrum('container').append($spRowBkgrClose);

    $spRowBkgrClose.on('click', function(e) {
      e.preventDefault();
      $spGlRowBackground.spectrum('hide');
    });

    // create close button for overlay color
    var $spRowOverlayClose = $(close);
    $spGlRowOverlay.spectrum('container').append($spRowOverlayClose);

    $spRowOverlayClose.on('click', function(e) {
      e.preventDefault();
      $spGlRowOverlay.spectrum('hide');
    });
  }

  // spectrum handlers
  function spRowBackgroundOnMove(color) {
    backgroundPickerUsed = true;

    backgroundColorEventSettings.data_to_send.color = bgColorActive
      ? color.toRgbString()
      : "";
    
    var event = jQuery.Event("rexlive:change_section_bg_color");
    event.settings = backgroundColorEventSettings;
    Rexbuilder_Util.$document.trigger(event);
  }

  function spRowBackgroundOnHide(color) {
    if ( backgroundPickerUsed && color ) {
      // send data to row
      var colorActive = color.toRgbString();

      backgroundColorEventSettings.data_to_send.color = ( bgColorActive ? colorActive : "" );
      backgroundColorEventSettings.data_to_send.active = bgColorActive;

      var event = jQuery.Event("rexlive:apply_background_color_section");
      event.settings = backgroundColorEventSettings;
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

    // hide section tools
    // Rexbuilder_Color_Palette.hide();
    Rexbuilder_Live_Utilities.hideAllTools();

    $spGlRowOverlay.spectrum('set','');
    // clear global vars

    $actualSection = null;
    $actualSectionData = null;
    bgColorActive = false;

    backgroundPickerUsed = false;
  }

  function spRowOverlayOnMove(color) {
    overlayPickerUsed = true;

    overlayColorEventSettings.data_to_send.active = true;
    overlayColorEventSettings.data_to_send.color = color.toRgbString();
    if( overlayColorActive ) {
      var event = jQuery.Event("rexlive:change_section_overlay_color");
    } else {
      var event = jQuery.Event("rexlive:change_section_overlay");
    }
    event.settings = overlayColorEventSettings;
    Rexbuilder_Util.$document.trigger(event);
  }

  function spRowOverlayOnHide(color) {
    if ( overlayPickerUsed && color ) {
      overlayColorEventSettings.data_to_send.color = color.toRgbString();
      overlayColorEventSettings.data_to_send.active = true;

      var event = jQuery.Event("rexlive:change_section_overlay");
      event.settings = overlayColorEventSettings;
      Rexbuilder_Util.$document.trigger(event);

      // Synch Top Toolbar
      var data = {
        eventName: "rexlive:updateTopToolbar",
        updateInfo: {
          row_overlay_color: overlayColorEventSettings.data_to_send.color,
          row_overlay_active: true
        }
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    }

    // Rexbuilder_Color_Palette.hide();
    Rexbuilder_Live_Utilities.hideAllTools();

    $spGlRowBackground.spectrum('set','');
    // clear global vars

    $actualSection = null;
    $actualSectionData = null;
    overlayColorActive = false;

    overlayPickerUsed = false;
  }

  // section tools color handlers
  function handleSectionBackgroundColorTool(ev) {
    ev.preventDefault()

    // set some globals to prevent useless element search
    $actualSection = $(ev.currentTarget).parents(".rexpansive_section");
    $actualSectionData = $actualSection.children('.section-data');
    backgroundColorEventSettings.data_to_send.sectionTarget.sectionID = $actualSection.attr("data-rexlive-section-id");
    backgroundColorEventSettings.data_to_send.sectionTarget.modelNumber =
      typeof $actualSection.attr("data-rexlive-model-number") != "undefined"
        ? $actualSection.attr("data-rexlive-model-number")
        : "";

    // retrieving actual color background, if any
    bgColorActive = ( 'undefined' !== typeof $actualSectionData.attr('data-color_bg_section_active') ? $actualSectionData.attr('data-color_bg_section_active') : 'true' );
    var colorActive = $actualSectionData.attr('data-color_bg_section');

    // maintain tools visible
    $actualSection.addClass('activeRowTools');
    $(ev.currentTarget).parents('.tool-button-floating').addClass('tool-button-floating--active');

    // set and open spectrum
    backgroundPickerUsed = false;
    $spGlRowBackground.spectrum('set',colorActive);

    $spGlRowBackground.spectrum('show');
    $spGlRowBackground.spectrum('container').css('top', ev.pageY + 'px');
    $spGlRowBackground.spectrum('container').css('left', ev.pageX + 'px');
    _fixPickerContainerPosition( $spGlRowBackground, ev.currentTarget );

    return false;
  }

  function handleSectionOverlayColorTool(ev) {
    ev.preventDefault()

    // set some globals to prevent useless element search

    $actualSection = $(ev.currentTarget).parents(".rexpansive_section");
    $actualSectionData = $actualSection.children('.section-data');
    overlayColorEventSettings.data_to_send.sectionTarget.sectionID = $actualSection.attr("data-rexlive-section-id");
    overlayColorEventSettings.data_to_send.sectionTarget.modelNumber =
      typeof $actualSection.attr("data-rexlive-model-number") != "undefined"
        ? $actualSection.attr("data-rexlive-model-number")
        : "";

    overlayColorActive = JSON.parse( ( 'undefined' !== typeof $actualSectionData.attr('data-row_overlay_active') ? $actualSectionData.attr('data-row_overlay_active') : false ) );
    var overlayValue = $actualSectionData.attr('data-row_overlay_color');

    // maintain tools visible
    $actualSection.addClass('activeRowTools');
    $(ev.currentTarget).parents('.tool-button-floating').addClass('tool-button-floating--active');

    // set and open spectrum
    overlayPickerUsed = false;
    $spGlRowOverlay.spectrum('set',overlayValue);

    $spGlRowOverlay.spectrum('show');
    $spGlRowOverlay.spectrum('container').css('top', ev.pageY + 'px');
    $spGlRowOverlay.spectrum('container').css('left', ev.pageX + 'px');
    _fixPickerContainerPosition( $spGlRowOverlay, ev.currentTarget );

    return false;
  }

  /**
   * Setting section dimension tools
   * @param {jQuery Element} $target Section target
   * @param {JS Object} data Section dimension data
   */
  var _updateSectionDimensionTool = function( $target, data ) {
    data = 'undefined' !== typeof data ? data : null;
    if ( null === data )
    {
      data = {};
      data.dimension = $target.find('.section-data').attr('data-dimension');
    }
    $target.find(".edit-row-width[data-section_width=" + data.dimension + "]").prop('checked',true);
  };

  /**
   * Setting section layout tool
   * @param {jQuery Element} $target Section target
   * @param {JS Object} data Section layout data
   */
  var _updateSectionLayoutTool = function( $target, data ) {
    data = 'undefined' !== typeof data ? data : null;
    if ( null === data )
    {
      data = {};
      data.layout = $target.find('.section-data').attr('data-layout');
    }

    switch(data.layout) {
      case "masonry":
        $target.find(".edit-row-layout-checkbox").prop("checked",false);
        break;
      case "fixed":
        $target.find(".edit-row-layout-checkbox").prop("checked",true);
        break;
      default:
        break;
    }
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
      .find('.edit-row-color-background');
    var $picker_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('.edit-row-color-background');

    if( "" != color ) {
      // $picker_fast
      //   .val(color)
      //   .spectrum('set',color);
      $picker_fast
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_fast
        .siblings('.tool-button--color-preview')
        .css('background-color',color);

      $picker_standard
        // .val(color)
        // .spectrum('set',color)
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
   * Setting the tool for the row color background preview
   * @param {jQuery Object} $target edited row
   * @param {string} color color to set
   */
  var _updateRowBackgroundGradientTool = function( $target, color ) {
    var $picker_fast = $target
      .find('.row-toolBox__fast-configuration')
      .find('.edit-row-color-background');
    var $picker_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('.edit-row-color-background');

    if( "" != color ) {
      // $picker_fast
      //   .val(color)
      //   .spectrum('set',color);
      $picker_fast
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_fast
        .siblings('.tool-button--color-preview')
        .css('background',color);

      $picker_standard
        // .val(color)
        // .spectrum('set',color)
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
      .find('.edit-row-color-background');
    // Set live picker
    // $picker
    //   .val(color)
    //   .spectrum('set',color);
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
      .find('.edit-row-overlay-color');
    var $picker_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('.edit-row-overlay-color');

    if( overlay_data.active.toString() == "true" ) {
      // $picker_fast
      //   .val(overlay_data.color)
      //   .spectrum("set",overlay_data.color)

      $picker_fast
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_fast
        .siblings('.tool-button--color-preview')
        .css('background-color',overlay_data.color);

      $picker_standard
        // .val(overlay_data.color)
        // .spectrum('set',overlay_data.color)
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

  /**
   * Update the overlay tools
   * @param {jQuery Object} $target row edited
   * @param {JS Object} overlay_data object with the overlay data
   */
  var _updateRowOverlayGradientTool = function( $target, overlay_data ) {
    var $picker_fast = $target
      .find('.row-toolBox__fast-configuration')
      .find('.edit-row-overlay-color');
    var $picker_standard = $target
      .find('.row-toolBox__standard-configuration')
      .find('.edit-row-overlay-color');

    if( overlay_data.active.toString() == "true" ) {
      // $picker_fast
      //   .val(overlay_data.color)
      //   .spectrum("set",overlay_data.color)

      $picker_fast
        .parent()
        .addClass('tool-button--picker-preview')
        .removeClass('tool-button--hide')
      $picker_fast
        .siblings('.tool-button--color-preview')
        .css('background',overlay_data.color);

      $picker_standard
        // .val(overlay_data.color)
        // .spectrum('set',overlay_data.color)
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
      .find('.edit-row-overlay-color');

    // $picker
    //   .val(color)
    //   .spectrum("set",color)
    
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

  var _openSectionBackgroundGradient = function( $section ) {
    $section = ( 0 === $section.length ? $actualSection : $section );
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";
    var $section_data = $section.children('.section-data');

    var colorActive = $section_data.attr('data-color_bg_section');

    var data = {
      eventName: "rexlive:editSectionBackgroundGradient",
      activeRowData: {
        gradient: colorActive,
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        },
      }
    };

    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  var _openRowOverlayGradient = function( $section ) {
    $section = ( 0 === $section.length ? $actualSection : $section );
    var $section_data = $section.children('.section-data');
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";

    var data = {
      eventName: "rexlive:editRowOverlayGradient",
      activeRowData: {
        gradient: $section_data.attr('data-row_overlay_color'),        
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        }
      }
    };

    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  /**
   * Listen row data changing to show/hide fast configuration toolbar
   * @since 2.0.0
   */
  var _listenRowDataChange = function() {
    // Select the data nodes to observe
    Rexbuilder_Section_Editor.dataNodes = Array.prototype.slice.call( document.getElementsByClassName('section-data') );

    // Callback
    var callback = function(mutationsList, observer) {
      if( ( "false" == mutationsList[0].target.getAttribute("data-color_bg_section_active") || "" == mutationsList[0].target.getAttribute("data-color_bg_section") ) && ( "false" == mutationsList[0].target.getAttribute('data-image_bg_section_active') || "" == mutationsList[0].target.getAttribute("data-id_image_bg_section") ) && ( "false" == mutationsList[0].target.getAttribute("data-row_overlay_active") || "" == mutationsList[0].target.getAttribute("data-row_overlay_color") ) && "" == mutationsList[0].target.getAttribute("data-video_bg_url_section") && "" == mutationsList[0].target.getAttribute("data-video_bg_id_section") && "" == mutationsList[0].target.getAttribute("data-video_bg_url_vimeo_section") ) {
        Rexbuilder_Util.addClass( mutationsList[0].target.parentNode, 'rowTools__hide-fast-data' );
      } else {
        Rexbuilder_Util.removeClass( mutationsList[0].target.parentNode, 'rowTools__hide-fast-data' );
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
   * Fix the picker container positon to a correctly view
   * @since 2.0.0
   */
  var _fixPickerContainerPosition = function( $picker, pickerTool ) {
    var container = $picker.spectrum('container')[0];
    var containerInfo = container.getBoundingClientRect();
    var topPosition = containerInfo.top
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
  }

  /**
   * Initing the row toolbar
   */
  var init = function() {
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
    // _setTools();
    _setGlobalPickers();
		_listenRowDataChange();
  };

  return {
    init: init,
    // launchSpectrumPickerBackgorundColorRow: _launchSpectrumPickerBackgorundColorRow,
    // launchSpectrumPickerOverlayColorRow: _launchSpectrumPickerOverlayColorRow,
    // updateRowTools: _updateRowTools,
    updateSectionDimensionTool: _updateSectionDimensionTool,
    updateSectionLayoutTool: _updateSectionLayoutTool,
    updateRowBackgroundImageTool: _updateRowBackgroundImageTool,
    resetRowBackgroundImageTool: _resetRowBackgroundImageTool,
    updateRowBackgroundColorTool: _updateRowBackgroundColorTool,
    updateRowBackgroundColorToolLive: _updateRowBackgroundColorToolLive,
    updateRowBackgroundGradientTool: _updateRowBackgroundGradientTool,
    updateRowOverlayColorTool: _updateRowOverlayColorTool,
    updateRowOverlayColorToolLive: _updateRowOverlayColorToolLive,
    updateRowOverlayGradientTool: _updateRowOverlayGradientTool,
    updateRowBackgroundVideo: _updateRowBackgroundVideo,
    triggerRowDataChange: _triggerRowDataChange,
    listenNewRowDataChange: _listenNewRowDataChange,
    openSectionBackgroundGradient: _openSectionBackgroundGradient,
    openRowOverlayGradient: _openRowOverlayGradient
  }
})(jQuery);