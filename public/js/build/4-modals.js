(function($) {
  "use strict";

  $(function() {
    /**
     * Listening for events to update live a row or a block
     * 1) Row Full Height : rexlive:set_row_fullHeight
     * 2) Row Layout : rexlive:set_gallery_layout
     * 3) Row Layout : rexlive:galleryLayoutChanged
     * 4) Row Gutter : rexlive:set_row_separatos
     * 5) Row Gutter : rexlive:rowDistancesApplied
     * 6) Row Margins : rexlive:set_section_margins
     * 7) Row Margins : rexlive:sectionMarginsApplied
     * 8) Row Width : rexlive:set_section_width
     * 9) Row Width : rexlive:sectionWidthApplyed
     * 10) Row Photoswipe : rexlive:set_row_photoswipe
     * 11) Row Name : rexlive:change_section_name
     * 12) Row Custom Classes : rexlive:apply_section_custom_classes
     * 13) Custom CSS : rexlive:SetCustomCSS
     * 14) Row Background Color : rexlive:apply_background_color_section
     * 15) Row Overlay : rexlive:change_section_overlay
     * 16) Row Image Background : rexlive:apply_background_image_section
     * 17) Row Video Background : rexlive:update_section_background_video
     * 18) Block Background Color : rexlive:apply_background_color_block
     * 19) Block Overlay : rexlive:change_block_overlay
     * 20) Block Image : rexlive:apply_background_image_block
     * 21) Block Video Background : rexlive:update_block_background_video
     * 22) Block Paddings : rexlive:apply_paddings_block
     * 23) Block Content Position : rexlive:apply_flex_position_block
     * 24) Block Custom Classes : rexlive:apply_block_custom_classes
     * 25) Block Custom Link : rexlive:apply_block_link_url
     * 26) Model : rexlive:editModel
     * 27) Model : rexlive:modelBecameSection
     * 28) Custom CSS : rexlive:getCustomCss
     */

    $(document).on("rexlive:set_row_fullHeight", function(e) {
      var data = e.settings.data_to_send;
      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var $gallery = $section.find(".grid-stack-row");
      var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);

      var reverseData = {
        fullHeight: $gallery.attr("data-full-height"),
        galleryInstance: galleryInstance
      };

      galleryInstance.updateFullHeight(data.fullHeight.toString() == "true");

      var actionData = {
        fullHeight: data.fullHeight.toString(),
        galleryInstance: galleryInstance
      };

      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionFullHeight",
        actionData,
        reverseData
      );
      $section.attr("data-rexlive-section-edited", true);
    });

    $(document).on("rexlive:set_gallery_layout", function(e) {
      // se simone cambia idea e vuole che tornando a schiacciare su fixed senza aver fatto modifiche si torni nella configurazione con i buchi, triggerare undo

      var data = e.settings.data_to_send;
      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var $gallery = $section.find(".grid-stack-row");
      var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);

      var reverseData = {
        collapse_grid: $section.attr("data-rex-collapse-grid"),
        gridLayout: galleryInstance.settings.galleryLayout,
        galleryInstance: galleryInstance,
        singleWidth: galleryInstance.properties.singleWidth,
        singleHeight: galleryInstance.properties.singleHeight,
        blocksDisposition: $.extend(
          true,
          {},
          galleryInstance.createActionDataMoveBlocksGrid()
        )
      };
      Rexbuilder_Util_Editor.updatingSectionLayout = true;
      $section.attr("data-rexlive-section-edited", true);
      Rexbuilder_Dom_Util.updateGridLayoutDomProperties($gallery, data.layout);
      galleryInstance.updateGridLayout(data.layout, reverseData);
    });

    $(document).on("rexlive:galleryLayoutChanged", function(e) {
      var galleryInstance = e.settings.galleryEditorInstance;
      var reverseData = e.settings.reverseData;
      var $section = e.settings.$section;

      var actionData = {
        gridLayout: e.settings.layout,
        galleryInstance: galleryInstance,
        singleWidth: galleryInstance.properties.singleWidth,
        singleHeight: galleryInstance.properties.singleHeight,
        blocksDisposition: $.extend(
          true,
          {},
          galleryInstance.createActionDataMoveBlocksGrid()
        )
      };
      Rexbuilder_Util_Editor.updatingSectionLayout = false;
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionLayout",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:set_row_separatos", function(e) {
      var data = e.settings.data_to_send;
      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var $gallery = $section.find(".grid-stack-row");
      var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);

      //reverseData: STATO PRIMA
      var oldDisposition = galleryInstance.createActionDataMoveBlocksGrid();

      var oldRowDistances = {
        gutter: parseInt($gallery.attr("data-separator")),
        top: parseInt($gallery.attr("data-row-separator-top")),
        bottom: parseInt($gallery.attr("data-row-separator-bottom")),
        right: parseInt($gallery.attr("data-row-separator-right")),
        left: parseInt($gallery.attr("data-row-separator-left"))
      };

      var reverseData = {
        rowDistances: oldRowDistances,
        galleryInstance: galleryInstance,
        singleWidth: galleryInstance.properties.singleWidth,
        singleHeight: galleryInstance.properties.singleHeight,
        blocksDisposition: $.extend(true, {}, oldDisposition)
      };

      Rexbuilder_Util_Editor.updatingRowDistances = true;

      Rexbuilder_Dom_Util.updateRowDistancesData($gallery, data.distances);
      galleryInstance.updateRowDistances(data.distances, reverseData);
      $section.attr("data-rexlive-section-edited", true);
    });

    $(document).on("rexlive:rowDistancesApplied", function(e) {
      var galleryInstance = e.settings.galleryEditorInstance;
      var reverseData = e.settings.reverseData;
      var $section = e.settings.$section;

      var actionData = {
        rowDistances: jQuery.extend({}, true, e.settings.newDistances),
        galleryInstance: galleryInstance,
        singleWidth: galleryInstance.properties.singleWidth,
        singleHeight: galleryInstance.properties.singleHeight,
        blocksDisposition: $.extend(
          true,
          {},
          galleryInstance.createActionDataMoveBlocksGrid()
        )
      };
      Rexbuilder_Util_Editor.updatingRowDistances = false;
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateGridDistances",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:set_section_margins", function(e) {
      var data = e.settings.data_to_send;
      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);

      var oldDisposition = galleryInstance.createActionDataMoveBlocksGrid();

      var section_margin_top = parseInt(
        $section.css("margin-top").split("px")[0]
      );
      var section_margin_right = parseInt(
        $section.css("margin-right").split("px")[0]
      );
      var section_margin_bottom = parseInt(
        $section.css("margin-bottom").split("px")[0]
      );
      var section_margin_left = parseInt(
        $section.css("margin-left").split("px")[0]
      );

      var oldMargins = {
        top: isNaN(section_margin_top) ? 0 : section_margin_top,
        right: isNaN(section_margin_right) ? 0 : section_margin_right,
        bottom: isNaN(section_margin_bottom) ? 0 : section_margin_bottom,
        left: isNaN(section_margin_left) ? 0 : section_margin_left
      };

      var reverseData = {
        marginsSection: oldMargins,
        galleryInstance: galleryInstance,
        singleWidth: galleryInstance.properties.singleWidth,
        singleHeight: galleryInstance.properties.singleHeight,
        blocksDisposition: $.extend(true, {}, oldDisposition)
      };

      Rexbuilder_Util_Editor.updatingSectionMargins = true;

      Rexbuilder_Dom_Util.updateSectionMarginsData($section, data.margins);
      galleryInstance.updateRowSectionMargins(data.margins, reverseData);

      $section.attr("data-rexlive-section-edited", true);
    });

    $(document).on("rexlive:sectionMarginsApplied", function(e) {
      var galleryInstance = e.settings.galleryEditorInstance;
      var reverseData = e.settings.reverseData;
      var $section = e.settings.$section;

      var actionData = {
        marginsSection: jQuery.extend({}, true, e.settings.newMargins),
        galleryInstance: galleryInstance,
        singleWidth: galleryInstance.properties.singleWidth,
        singleHeight: galleryInstance.properties.singleHeight,
        blocksDisposition: $.extend(
          true,
          {},
          galleryInstance.createActionDataMoveBlocksGrid()
        )
      };

      Rexbuilder_Util_Editor.updatingSectionMargins = false;
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionMargins",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:set_section_width", function(e) {
      var data = e.settings.data_to_send;
      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var $gallery = $section.find(".grid-stack-row");
      var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
      var newSectionWidth =
        "" + data.sectionWidth.width + data.sectionWidth.type;
      Rexbuilder_Util_Editor.updatingSectionWidth = true;

      var sectionWidth =
        $gallery.parent().css("max-width") == "none"
          ? "100%"
          : $gallery.parent().css("max-width");
      var widthType = $gallery.parent().hasClass("full-disposition")
        ? "full"
        : "boxed";
      var oldDisposition = galleryInstance.createActionDataMoveBlocksGrid();
      var reverseData = {
        section_width: sectionWidth,
        dimension: widthType,
        galleryInstance: galleryInstance,
        singleWidth: galleryInstance.properties.singleWidth,
        singleHeight: galleryInstance.properties.singleHeight,
        blocksDisposition: $.extend(true, {}, oldDisposition)
      };

      galleryInstance.updateSectionWidthWrap(newSectionWidth, reverseData);
      Rexbuilder_Dom_Util.updateSectionWidthData($section, {
        sectionWidth: sectionWidth,
        widthType: widthType
      });

      if('undefined' == typeof e.settings.forged) {
        $section.find('.edit-row-width[data-section_width='+widthType+']').prop('checked',true).val(sectionWidth);
      }
      
      $section.attr("data-rexlive-section-edited", true);
    });

    $(document).on("rexlive:sectionWidthApplyed", function(e) {
      var galleryInstance = e.settings.galleryEditorInstance;
      var reverseData = e.settings.reverseData;
      var $section = e.settings.$section;
      var sectionWidth =
        galleryInstance.$element.parent().css("max-width") == "none"
          ? "100%"
          : galleryInstance.$element.parent().css("max-width");
      var widthType = galleryInstance.$element
        .parent()
        .hasClass("full-disposition")
        ? "full"
        : "boxed";

      var actionData = {
        section_width: sectionWidth,
        dimension: widthType,
        galleryInstance: galleryInstance,
        singleWidth: galleryInstance.properties.singleWidth,
        singleHeight: galleryInstance.properties.singleHeight,
        blocksDisposition: $.extend(
          true,
          {},
          galleryInstance.createActionDataMoveBlocksGrid()
        )
      };
      Rexbuilder_Util_Editor.updatingSectionWidth = false;
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionWidth",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:set_row_photoswipe", function(e) {
      var data = e.settings.data_to_send;
      if (data.photoswipe.toString() == "true") {
        var $section;

        if (data.sectionTarget.modelNumber != "") {
          $section = Rexbuilder_Util.$rexContainer.find(
            'section[data-rexlive-section-id="' +
              data.sectionTarget.sectionID +
              '"][data-rexlive-model-number="' +
              data.sectionTarget.modelNumber +
              '"]'
          );
        } else {
          $section = Rexbuilder_Util.$rexContainer.find(
            'section[data-rexlive-section-id="' +
              data.sectionTarget.sectionID +
              '"]'
          );
        }

        var $gallery = $section.find(".grid-stack-row");

        var elementsBefore = Rexbuilder_Util_Editor.getElementsPhotoswipe(
          $gallery
        );
        var reverseData = {
          elements: elementsBefore
        };

        Rexbuilder_Dom_Util.enablePhotoswipeAllBlocksSection($section);

        //actionData: STATO DOPO
        var elementsAfter = Rexbuilder_Util_Editor.getElementsPhotoswipe(
          $gallery
        );
        var actionData = {
          elements: elementsAfter
        };
        Rexbuilder_Util_Editor.pushAction(
          $section,
          "updateSectionPhotoswipe",
          actionData,
          reverseData
        );
        $section.attr("data-rexlive-section-edited", true);
      }
    });

    $(document).on("rexlive:change_section_name", function(e) {
      var data = e.settings.data_to_send;
      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var reverseData = {
        sectionName: $section.attr("data-rexlive-section-name")
      };

      Rexbuilder_Dom_Util.updateSectionName($section, data.sectionName);

      var actionData = {
        sectionName: data.sectionName
      };
      $section.attr("data-rexlive-section-edited", true);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionName",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:apply_section_custom_classes", function(e) {
      var data = e.settings.data_to_send;

      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var oldClasses = $section
        .children(".section-data")
        .attr("data-custom_classes");
      oldClasses = oldClasses.trim();
      var oldClassesList = oldClasses.split(/\s+/);

      var reverseData = {
        $target: $section,
        classes: oldClassesList
      };

      Rexbuilder_Dom_Util.updateCustomClasses($section, data.customClasses);

      var actionData = {
        $target: $section,
        classes: data.customClasses
      };
      $section.attr("data-rexlive-section-edited", true);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateCustomClasses",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:SetCustomCSS", function(e) {
      var data = e.settings.data_to_send;

      var oldCSS = Rexbuilder_Util_Editor.$styleElement.text();

      var reverseData = {
        css: oldCSS
      };

      Rexbuilder_Dom_Util.updateCustomCSS(data.customCSS);

      var actionData = {
        css: data.customCSS
      };

      Rexbuilder_Util_Editor.pushAction(
        "document",
        "updateCustomCSS",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:apply_background_color_section", function(e) {
      var data = e.settings.data_to_send;

      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var $dataSection = $section.children(".section-data");
      var oldColor = $dataSection.attr("data-color_bg_section");
      var oldActive = $dataSection.attr("data-color_bg_section_active");

      var reverseData = {
        color: oldColor,
        active: oldActive
      };

      Rexbuilder_Dom_Util.updateSectionBackgroundColor($section, data);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var actionData = {
        color: data.color,
        active: data.active
      };
      $section.attr("data-rexlive-section-edited", true);

      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionBackgroundColor",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:change_section_overlay", function(e) {
      var data = e.settings.data_to_send;

      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }
      var $dataSection = $section.children(".section-data");
      var oldColor = $dataSection.attr("data-row_overlay_color");
      var oldActive = $dataSection.attr("data-row_overlay_active");

      var reverseData = {
        color: oldColor,
        active: oldActive
      };

      Rexbuilder_Dom_Util.updateSectionOverlay($section, data);

      var actionData = {
        color: data.color,
        active: data.active
      };
      $section.attr("data-rexlive-section-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }

      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);

      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionOverlay",
        actionData,
        reverseData
      );
    });

    /**
     * Listen event to apply an image on a row
     * @since 2.0.0
     */
    $(document).on("rexlive:apply_background_image_section", function(e) {
      var data = e.settings.data_to_send;

      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }
      var $sectionData = $section.children(".section-data");

      var idImage =
        typeof $sectionData.attr("data-id_image_bg_section") == "undefined"
          ? ""
          : $sectionData.attr("data-id_image_bg_section");
      var imageUrl =
        typeof $sectionData.attr("data-image_bg_section") == "undefined"
          ? ""
          : $sectionData.attr("data-image_bg_section");
      var width =
        typeof $section.attr("data-background_image_width") == "undefined"
          ? ""
          : $section.attr("data-background_image_width");
      var height =
        typeof $section.attr("data-background_image_height") == "undefined"
          ? ""
          : $section.attr("data-background_image_height");
      var activeImage =
        typeof $sectionData.attr("data-image_bg_section_active") != "undefined"
          ? $sectionData.attr("data-image_bg_section_active")
          : true;

      var reverseData = {
        active: activeImage,
        idImage: idImage,
        urlImage: imageUrl,
        width: width,
        height: height
      };

      Rexbuilder_Dom_Util.updateImageBG($section, data);
      $section.find('.edit-row-image-background').attr('value',data.idImage);

      var actionData = {
        active: data.active,
        idImage: data.idImage,
        urlImage: data.urlImage,
        width: data.width,
        height: data.height
      };
      $section.attr("data-rexlive-section-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }

      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionImageBG",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:update_section_background_video", function(e) {
      var data = e.settings.data_to_send;

      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

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
      var type = "";

      if (mp4VideoID != "") {
        type = "mp4";
      } else if (vimeoUrl != "") {
        type = "vimeo";
      } else if (youtubeVideo != "") {
        type = "youtube";
      }

      var reverseData = {
        mp4Data: {
          idMp4: mp4VideoID,
          linkMp4: mp4Video,
          width: "",
          height: ""
        },
        vimeoUrl: vimeoUrl,
        youtubeUrl: youtubeVideo,
        audio: false,
        typeVideo: type
      };

      var videoOptions = {
        mp4Data: {
          idMp4: data.videoMp4.idMp4,
          linkMp4: data.videoMp4.linkMp4,
          width: "",
          height: ""
        },
        vimeoUrl: data.urlVimeo,
        youtubeUrl: data.urlYoutube,
        audio: false,
        typeVideo: data.typeVideo
      };

      Rexbuilder_Dom_Util.updateVideos($section, videoOptions);

      var actionData = {
        mp4Data: {
          idMp4: data.videoMp4.idMp4,
          linkMp4: data.videoMp4.linkMp4,
          width: "",
          height: ""
        },
        vimeoUrl: data.urlVimeo,
        youtubeUrl: data.urlYoutube,
        audio: false,
        typeVideo: data.typeVideo
      };
      $section.attr("data-rexlive-section-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionVideoBG",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:apply_background_color_block", function(e) {
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

      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");
      var oldColor = $elemData.attr("data-color_bg_block");
      var oldActive =
        typeof $elemData.attr("data-color_bg_elem_active") != "undefined"
          ? $elemData.attr("data-color_bg_elem_active")
          : true;

      var reverseData = {
        $elem: $elem,
        color: oldColor,
        active: oldActive
      };

      var actionData = {
        $elem: $elem,
        color: data.color,
        active: data.active
      };

      Rexbuilder_Dom_Util.updateBlockBackgroundColor(actionData);
      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockBackgroundColor",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:change_block_overlay", function(e) {
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

      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");
      var oldOverlayColor =
        typeof $elemData.attr("data-overlay_block_color") != "undefined"
          ? $elemData.attr("data-overlay_block_color")
          : "";
      var oldOverlayActive =
        typeof $elemData.attr("data-overlay_block_color_active") != "undefined"
          ? $elemData.attr("data-overlay_block_color_active")
          : false;

      var reverseData = {
        $elem: $elem,
        color: oldOverlayColor,
        active: oldOverlayActive
      };

      var actionData = {
        $elem: $elem,
        color: data.color,
        active: data.active
      };

      Rexbuilder_Dom_Util.updateBlockOverlay(actionData);
      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockOverlay",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:apply_background_image_block", function(e) {    
      var data = e.settings.data_to_send;
      Rexbuilder_Util_Editor.updatingImageBg = true;
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

      var $itemContent = $elem.find(".grid-item-content");
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");
      var galleryEditorInstance = Rexbuilder_Util.getGalleryInstance($section);

      var old_idImage =
        typeof $elemData.attr("data-id_image_bg_block") == "undefined"
          ? ""
          : $elemData.attr("data-id_image_bg_block");
      var old_imageUrl =
        typeof $elemData.attr("data-image_bg_block") == "undefined"
          ? ""
          : $elemData.attr("data-image_bg_block");
      var old_width =
        typeof $itemContent.attr("data-background_image_width") == "undefined"
          ? ""
          : $itemContent.attr("data-background_image_width");
      var old_height =
        typeof $itemContent.attr("data-background_image_height") == "undefined"
          ? ""
          : $itemContent.attr("data-background_image_height");
      var old_activeImage =
        typeof $elemData.attr("data-image_bg_elem_active") != "undefined"
          ? $elemData.attr("data-image_bg_elem_active")
          : true;

      var defaultTypeImage;
      if (old_activeImage.toString() == "true") {
        defaultTypeImage =
          $elem.parents(".grid-stack-row").attr("data-layout") == "fixed"
            ? "full"
            : "natural";
      } else {
        defaultTypeImage = "";
      }

      var old_typeBGimage =
        typeof $elemData.attr("data-type_bg_block") == "undefined"
          ? defaultTypeImage
          : $elemData.attr("data-type_bg_block");
      var old_photoswipe =
        typeof $elemData.attr("data-photoswipe") == "undefined"
          ? ""
          : $elemData.attr("data-photoswipe");

      var oldOpt = {
        active: old_activeImage,
        idImage: old_idImage,
        urlImage: old_imageUrl,
        width: old_width,
        height: old_height,
        typeBGimage: old_typeBGimage,
        photoswipe: old_photoswipe
      };
      var reverseData = {
        $itemContent: $itemContent,
        imageOpt: oldOpt
      };

      var imageOpt = {
        active: data.active,
        idImage: data.idImage,
        urlImage: data.urlImage,
        width: data.width,
        height: data.height,
        typeBGimage: data.typeBGimage,
        photoswipe: data.photoswipe
      };

      Rexbuilder_Dom_Util.updateImageBG($itemContent, imageOpt);
      if (galleryEditorInstance.settings.galleryLayout == "masonry") {
        galleryEditorInstance.updateElementHeight($elem);
      }

      var actionData = {
        $itemContent: $itemContent,
        imageOpt: imageOpt
      };
      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockImageBG",
        actionData,
        reverseData
      );
      Rexbuilder_Util_Editor.updatingImageBg = false;
    });

    $(document).on("rexlive:update_block_background_video", function(e) {
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

      var $itemContent = $elem.find(".grid-item-content");
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");
      var galleryEditorInstance = Rexbuilder_Util.getGalleryInstance($section);

      var oldmp4Video =
        typeof $elemData.attr("data-video_mp4_url") == "undefined"
          ? ""
          : $elemData.attr("data-video_mp4_url");
      var oldmp4VideoID =
        typeof $elemData.attr("data-video_bg_id") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_id");
      var oldyoutubeUrl =
        typeof $elemData.attr("data-video_bg_url") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_url");
      var oldvimeoUrl =
        typeof $elemData.attr("data-video_bg_url_vimeo") == "undefined"
          ? ""
          : $elemData.attr("data-video_bg_url_vimeo");

      var $videoMp4Wrap = $itemContent.children(".rex-video-wrap");
      var oldmp4VideoWidth = "";
      var oldmp4VideoHeight = "";

      if ($videoMp4Wrap.length != 0) {
        oldmp4VideoWidth = parseInt($videoMp4Wrap.attr("data-rex-video-width"));
        oldmp4VideoHeight = parseInt(
          $videoMp4Wrap.attr("data-rex-video-height")
        );
      }
      var oldAudio =
        $itemContent.children(".rex-video-toggle-audio").length != 0;
      var type = "";

      if (oldmp4VideoID != "") {
        type = "mp4";
      } else if (oldyoutubeUrl != "") {
        type = "youtube";
      } else if (oldvimeoUrl != "") {
        type = "vimeo";
      }

      var reverseData = {
        $itemContent: $itemContent,
        videoOpt: {
          mp4Data: {
            idMp4: oldmp4VideoID,
            linkMp4: oldmp4Video,
            width: oldmp4VideoWidth,
            height: oldmp4VideoHeight
          },
          vimeoUrl: oldvimeoUrl,
          youtubeUrl: oldyoutubeUrl,
          audio: oldAudio,
          typeVideo: type
        }
      };

      var videoOptions = {
        mp4Data: {
          idMp4: data.videoMp4.idMp4,
          linkMp4: data.videoMp4.linkMp4,
          width: data.videoMp4.width,
          height: data.videoMp4.height
        },
        vimeoUrl: data.urlVimeo,
        youtubeUrl: data.urlYoutube,
        audio: data.audio.toString() == "true",
        typeVideo: data.typeVideo
      };

      Rexbuilder_Dom_Util.updateVideos($itemContent, videoOptions);
      if (galleryEditorInstance.settings.galleryLayout == "masonry") {
        //galleryEditorInstance.updateElementHeight($elem);
      }

      var actionData = {
        $itemContent: $itemContent,
        videoOpt: videoOptions
      };
      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockVideoBG",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:apply_paddings_block", function(e) {
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

      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");
      var galleryEditorInstance = Rexbuilder_Util.getGalleryInstance($section);

      var paddingsElemData =
        typeof $elemData.attr("data-block_padding") == "undefined"
          ? ""
          : $elemData.attr("data-block_padding");
      var oldPaddings = Rexbuilder_Util.getPaddingsDataString(paddingsElemData);

      var reverseData = {
        $elem: $elem,
        dataPadding: oldPaddings
      };

      Rexbuilder_Util_Editor.updatingPaddingBlock = true;
      Rexbuilder_Dom_Util.updateBlockPaddings($elem, data.paddings);
      if (galleryEditorInstance.settings.galleryLayout == "masonry") {
        galleryEditorInstance.updateElementHeight($elem);
      }
      Rexbuilder_Util_Editor.updatingPaddingBlock = false;

      var actionData = {
        $elem: $elem,
        dataPadding: data.paddings
      };
      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockPadding",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:apply_flex_position_block", function(e) {
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

      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");

      var oldFlexPosition =
        typeof $elemData.attr("data-block_flex_position") == "undefined"
          ? ""
          : $elemData.attr("data-block_flex_position");

      var flexPosition = {
        x: "",
        y: ""
      };

      if (oldFlexPosition != "") {
        var pos = oldFlexPosition.split(" ");
        flexPosition.x = pos[0];
        flexPosition.y = pos[1];
      }

      var reverseData = {
        $elem: $elem,
        dataPosition: flexPosition
      };

      Rexbuilder_Dom_Util.updateFlexPostition($elem, data.position);

      var actionData = {
        $elem: $elem,
        dataPosition: data.position
      };
      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockFlexPosition",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:apply_block_custom_classes", function(e) {
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

      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");

      var oldClasses =
        typeof $elemData.attr("data-block_custom_class") == "undefined"
          ? ""
          : $elemData.attr("data-block_custom_class");

      oldClasses = oldClasses.trim();
      var oldClassesList = oldClasses.split(/\s+/);

      var reverseData = {
        $target: $elem,
        classes: oldClassesList
      };

      Rexbuilder_Dom_Util.updateCustomClasses($elem, data.customClasses);

      var actionData = {
        $target: $elem,
        classes: data.customClasses
      };

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateCustomClasses",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:apply_block_link_url", function(e) {
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

      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");

      var oldUrl =
        typeof $elemData.attr("data-linkurl") == "undefined"
          ? ""
          : $elemData.attr("data-linkurl");

      var reverseData = {
        $elem: $elem,
        url: oldUrl
      };

      Rexbuilder_Dom_Util.updateBlockUrl($elem, data.url);

      var actionData = {
        $elem: $elem,
        url: data.url
      };

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var data = {
        eventName: "rexlive:edited",
        modelEdited: $section.hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockUrl",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:editModel", function(e) {
      var data = e.settings.data_to_send;
      var $section;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"][data-rexlive-model-number="' +
            data.sectionTarget.modelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            data.sectionTarget.sectionID +
            '"]'
        );
      }

      var $button = $section.find(".update-model-button");

      var reverseData = {
        $button: $button,
        lock: true
      };

      var actionData = {
        $button: $button,
        lock: false
      };

      Rexbuilder_Dom_Util.updateLockEditModel($button, false);
      Rexbuilder_Util.$rexContainer.addClass("editing-model");

      Rexbuilder_Util_Editor.pushAction(
        "document",
        "updateLockButton",
        actionData,
        reverseData
      );
    });

    $(document).on("rexlive:modelBecameSection", function(e) {
      var data = e.settings.data_to_send;
      var $section;
      var defaultStateSections = null;
      var layoutsOrder = null;

      if (Rexbuilder_Util.activeLayout == "default") {
        defaultStateSections = Rexbuilder_Util.getDefaultLayoutState();
        layoutsOrder = Rexbuilder_Util.getPageCustomizationsDom();
      }

      var oldRexID = data.sectionTarget.sectionID;
      var oldModelID = data.modelID;
      var oldModelNumber = data.sectionTarget.modelNumber;

      if (data.sectionTarget.modelNumber != "") {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' +
            oldRexID +
            '"][data-rexlive-model-number="' +
            oldModelNumber +
            '"]'
        );
      } else {
        $section = Rexbuilder_Util.$rexContainer.find(
          'section[data-rexlive-section-id="' + oldRexID + '"]'
        );
      }

      var reverseData = {
        modelID: oldModelID,
        modelName: data.modelName,
        modelNumber: oldModelNumber,
        sectionID: $section.attr("data-rexlive-section-id"),
        isModel: true,
        $section: $section,
        layoutsOrder:
          layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null,
        stateDefault:
          defaultStateSections != null
            ? jQuery.extend(true, [], defaultStateSections)
            : null
      };

      var oldRexID = data.sectionTarget.sectionID;
      var oldModelID = data.modelID;
      var oldModelNumber = data.sectionTarget.modelNumber;
      var newRexID = Rexbuilder_Util.createSectionID();

      // fixing dom order in default and custom layouts
      if (layoutsOrder != null) {
        var i, j;

        var sectionObj = {
          section_rex_id: newRexID,
          targets: [],
          section_is_model: false,
          section_model_id: -1,
          section_model_number: -1,
          section_hide: false,
          section_created_live: true
        };

        for (i = 0; i < layoutsOrder.length; i++) {
          for (j = 0; j < layoutsOrder[i].sections.length; j++) {
            if (layoutsOrder[i].sections[j].section_is_model) {
              if (
                layoutsOrder[i].sections[j].section_model_id == oldModelID &&
                layoutsOrder[i].sections[j].section_model_number ==
                  oldModelNumber
              ) {
                break;
              }
            } else {
              if (oldRexID == layoutsOrder[i].sections[j].section_rex_id) {
                break;
              }
            }
          }
          layoutsOrder[i].sections.splice(
            j,
            1,
            jQuery.extend(true, {}, sectionObj)
          );
        }
        Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);

        for (j = 0; j < defaultStateSections.length; j++) {
          if (defaultStateSections[j].section_is_model) {
            if (
              defaultStateSections[j].section_model_id == oldModelID &&
              defaultStateSections[j].section_model_number == oldModelNumber
            ) {
              break;
            }
          } else {
            if (oldRexID == defaultStateSections[j].section_rex_id) {
              break;
            }
          }
        }

        sectionObj.targets = Rex_Save_Listeners.createTargets(
          $section,
          "default"
        );
        defaultStateSections.splice(j, 1, sectionObj);
        Rexbuilder_Util.updateDefaultLayoutState({
          pageData: defaultStateSections
        });
      }

      Rexbuilder_Dom_Util.updateSectionBecameModel({
        modelID: "",
        modelName: "",
        modelNumber: "",
        sectionID: newRexID,
        isModel: false,
        $section: $section
      });

      var actionData = {
        modelID: "",
        modelName: "",
        modelNumber: "",
        sectionID: newRexID,
        isModel: false,
        $section: $section,
        layoutsOrder:
          layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null,
        stateDefault:
          defaultStateSections != null
            ? jQuery.extend(true, [], defaultStateSections)
            : null
      };

      Rexbuilder_Util_Editor.pushAction(
        $section,
        "sectionBecameModel",
        actionData,
        reverseData
      );
    });

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    // Launch to the iframe parent the event to open the CSS editor
    $(document).on("rexlive:getCustomCss", function() {
      var currentStyle = $("#rexpansive-builder-style-inline-css")
        .text()
        .replace(/^\s+|\s+$/g, "");
      var data = {
        eventName: "rexlive:openCssEditor",
        currentStyle: currentStyle
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    $(document).on("click", ".builder-section-config", function(e) {
      e.preventDefault();

      var $section = $(e.target).parents(".rexpansive_section");

      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var $gridElement = $section.find(".grid-stack-row");

      var activeLayout = $gridElement.attr("data-layout");
      var fullHeight = $gridElement.attr("data-full-height");
      var section_width = $gridElement.parent().css("max-width");
      var dimension =
        section_width === "100%" || section_width == "none" ? "full" : "boxed";
      var paddingsRow = {
        gutter: parseInt($gridElement.attr("data-separator")),
        top: parseInt($gridElement.attr("data-row-separator-top")),
        bottom: parseInt($gridElement.attr("data-row-separator-bottom")),
        right: parseInt($gridElement.attr("data-row-separator-right")),
        left: parseInt($gridElement.attr("data-row-separator-left"))
      };

      var marginsSection = {
        top: parseInt($section.css("margin-top").split("px")[0]),
        right: parseInt($section.css("margin-right").split("px")[0]),
        bottom: parseInt($section.css("margin-bottom").split("px")[0]),
        left: parseInt($section.css("margin-left").split("px")[0])
      };

      var photoswipe = true;

      //i blocchi che possono avere photoswipe
      var imageBloks = [];

      $gridElement
        .children(".grid-stack-item:not(.removing_block)")
        .each(function(i, el) {
          var $el = $(el);
          var $elData = $el.children(".rexbuilder-block-data");
          var textWrapLength = Rexbuilder_Util_Editor.getTextWrapLength($el);
          if (
            $elData.attr("data-image_bg_block") != "" &&
            $elData.attr("data-image_bg_block") != "" &&
            textWrapLength == 0
          ) {
            imageBloks.push($elData);
          }
        });

      if (imageBloks.length > 0) {
        for (var i = 0; i < imageBloks.length; i++) {
          if (imageBloks[i].attr("data-photoswipe").toString() != "true") {
            photoswipe = false;
          }
        }
      } else {
        photoswipe = false;
      }

      var nameSection = $section.attr("data-rexlive-section-name");
      var customClasses = $section
        .children(".section-data")
        .attr("data-custom_classes");

      var data = {
        eventName: "rexlive:openSectionModal",
        section_options_active: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },

          activeLayout: activeLayout,
          fullHeight: fullHeight,

          section_width: section_width,
          dimension: dimension,

          rowDistances: paddingsRow,

          marginsSection: marginsSection,
          photoswipe: photoswipe,

          sectionName: nameSection,
          customClasses: customClasses
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    // Launch to the iframe parent the event to open the Media Uploader
    $(document).on("click", ".add-new-block-image", function(e) {
      e.preventDefault();
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var data = {
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        },
        returnEventName: "rexlive:insert_image",
        eventName: "rexlive:openMediaUploader"
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    // Launch to the iframe parent the event to open the add video modal
    $(document).on("click", ".add-new-block-video", function(e) {
      e.preventDefault();
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var data = {
        eventName: "rexlive:addNewBlockVideo",
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    $(document).on("click", ".add-new-block-slider", function(e) {
      e.preventDefault();
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var data = {
        eventName: "rexlive:addNewSlider",
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    $(document).on("click", ".edit-background-section", function(e) {
      e.preventDefault();
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $sectionData = $section.children(".section-data");

      var color =
        typeof $sectionData.attr("data-color_bg_section") != "undefined"
          ? $sectionData.attr("data-color_bg_section")
          : "";
      if (color == "") {
        color = "rgba(0,0,0,0)";
      }
      var colorActive =
        typeof $sectionData.attr("data-color_bg_section_active") != "undefined"
          ? $sectionData.attr("data-color_bg_section_active")
          : true;

      var overlayColor =
        typeof $sectionData.attr("data-row_overlay_color") != "undefined"
          ? $sectionData.attr("data-row_overlay_color")
          : "";
      if (overlayColor == "") {
        overlayColor =
          $sectionData.attr("data-responsive_background") === undefined
            ? ""
            : $sectionData.attr("data-responsive_background");
        if (overlayColor == "") {
          overlayColor = "rgba(0,0,0,0)";
        }
      }

      var overlayActive;
      if (
        $section.hasClass("active-large-overlay") ||
        $section.hasClass("active-medium-overlay") ||
        $section.hasClass("active-small-overlay")
      ) {
        overlayActive = false;
      } else {
        overlayActive =
          typeof $sectionData.attr("data-row_overlay_active") != "undefined"
            ? $sectionData.attr("data-row_overlay_active")
            : false;
      }
      var $sectionOverlayDiv = $section.find(".responsive-overlay");

      if (!overlayActive) {
        if (
          Rexbuilder_Util.activeLayout == "default" &&
          $section.hasClass("active-large-overlay")
        ) {
          overlayActive = true;
          $section.removeClass("active-large-overlay");
          $sectionData.attr("data-row_overlay_active", true);
          Rexbuilder_Util_Editor.removeCustomClass(
            "active-large-overlay",
            $sectionData
          );
          $sectionOverlayDiv.addClass("rex-active-overlay");
        }
        if (
          Rexbuilder_Util.activeLayout == "tablet" &&
          $section.hasClass("active-medium-overlay")
        ) {
          overlayActive = true;
          $section.removeClass("active-medium-overlay");
          $sectionData.attr("data-row_overlay_active", true);
          Rexbuilder_Util_Editor.removeCustomClass(
            "active-medium-overlay",
            $sectionData
          );
          $sectionOverlayDiv.addClass("rex-active-overlay");
        }
        if (
          Rexbuilder_Util.activeLayout == "mobile" &&
          $section.hasClass("active-small-overlay")
        ) {
          overlayActive = true;
          $section.removeClass("active-small-overlay");
          $sectionData.attr("data-row_overlay_active", true);
          Rexbuilder_Util_Editor.removeCustomClass(
            "active-small-overlay",
            $sectionData
          );
          $sectionOverlayDiv.addClass("rex-active-overlay");
        }
      }

      var idImage =
        typeof $sectionData.attr("data-id_image_bg_section") == "undefined"
          ? ""
          : $sectionData.attr("data-id_image_bg_section");
      var imageUrl =
        typeof $sectionData.attr("data-image_bg_section") == "undefined"
          ? ""
          : $sectionData.attr("data-image_bg_section");
      var width =
        typeof $section.attr("data-background_image_width") == "undefined"
          ? ""
          : $section.attr("data-background_image_width");
      var height =
        typeof $section.attr("data-background_image_height") == "undefined"
          ? ""
          : $section.attr("data-background_image_height");
      var activeImage =
        typeof $sectionData.attr("data-image_bg_section_active") != "undefined"
          ? $sectionData.attr("data-image_bg_section_active")
          : true;

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

      var currentBackgroundData = {
        bgColor: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          color: color,
          active: colorActive
        },
        imageBG: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          idImage: idImage,
          imageUrl: imageUrl,
          width: width,
          height: height,
          active: activeImage
        },
        bgVideo: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          youtubeVideo: youtubeVideo,
          vimeoUrl: vimeoUrl,
          mp4Video: mp4Video,
          mp4VideoID: mp4VideoID
        },
        overlay: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          color: overlayColor,
          active: overlayActive
        }
      };

      var data = {
        eventName: "rexlive:editBackgroundSection",
        activeBG: currentBackgroundData
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    $(document).on("click", ".builder-edit-block", function(e) {
      e.preventDefault();

      var $elem = $(e.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $itemContent = $elem.find(".grid-item-content");

      var color = $elemData.attr("data-color_bg_block");
      var colorActive =
        typeof $elemData.attr("data-color_bg_elem_active") != "undefined"
          ? $elemData.attr("data-color_bg_elem_active")
          : true;
      if (color == "") {
        color = "rgba(0,0,0,0)";
      }
      var colorData = {
        color: color,
        active: colorActive,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        }
      };

      var overlayColor =
        typeof $elemData.attr("data-overlay_block_color") != "undefined"
          ? $elemData.attr("data-overlay_block_color")
          : "";
      if (overlayColor == "") {
        overlayColor = "rgba(0,0,0,0)";
      }

      var overlayActive;
      if (
        $elem.hasClass("active-large-block-overlay") ||
        $elem.hasClass("active-medium-block-overlay") ||
        $elem.hasClass("active-small-block-overlay")
      ) {
        overlayActive = false;
      } else {
        overlayActive =
          typeof $elemData.attr("data-overlay_block_color_active") !=
          "undefined"
            ? $elemData.attr("data-overlay_block_color_active")
            : false;
      }

      var $blockOverlayDiv = $elem.find(".responsive-block-overlay");
      if (!overlayActive) {
        if (
          Rexbuilder_Util.activeLayout == "default" &&
          $elem.hasClass("active-large-block-overlay")
        ) {
          overlayActive = true;
          $elem.removeClass("active-large-block-overlay");
          $elemData.attr("data-row_overlay_active", true);
          Rexbuilder_Util_Editor.removeCustomClass(
            "active-large-block-overlay",
            $elemData
          );
          $blockOverlayDiv.addClass("rex-active-overlay");
        }
        if (
          Rexbuilder_Util.activeLayout == "tablet" &&
          $elem.hasClass("active-medium-block-overlay")
        ) {
          overlayActive = true;
          $elem.removeClass("active-medium-block-overlay");
          $elemData.attr("data-row_overlay_active", true);
          Rexbuilder_Util_Editor.removeCustomClass(
            "active-medium-block-overlay",
            $elemData
          );
          $blockOverlayDiv.addClass("rex-active-overlay");
        }
        if (
          Rexbuilder_Util.activeLayout == "mobile" &&
          $elem.hasClass("active-small-block-overlay")
        ) {
          overlayActive = true;
          $elem.removeClass("active-small-block-overlay");
          $elemData.attr("data-row_overlay_active", true);
          Rexbuilder_Util_Editor.removeCustomClass(
            "active-small-block-overlay",
            $elemData
          );
          $blockOverlayDiv.addClass("rex-active-overlay");
        }
      }

      var overlayData = {
        color: overlayColor,
        active: overlayActive,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        }
      };

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
        }
      };

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

      var videoData = {
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
        }
      };

      var paddingsElemData =
        typeof $elemData.attr("data-block_padding") == "undefined"
          ? ""
          : $elemData.attr("data-block_padding");
      var paddingsData = {
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
        paddings: Rexbuilder_Util.getPaddingsDataString(paddingsElemData)
      };

      var blockFlexPosition =
        typeof $elemData.attr("data-block_flex_position") == "undefined"
          ? ""
          : $elemData.attr("data-block_flex_position");
      var blockFlexPositionArr = blockFlexPosition.split(" ");
      var blockFlexPositionString =
        blockFlexPositionArr[1] + "-" + blockFlexPositionArr[0];
      var position = {
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
        position: blockFlexPositionString
      };

      var classes =
        typeof $elemData.attr("data-block_custom_class") == "undefined"
          ? ""
          : $elemData.attr("data-block_custom_class");

      var blockUrl =
        typeof $elemData.attr("data-linkurl") == "undefined"
          ? ""
          : $elemData.attr("data-linkurl");

      var currentBlockData = {
        bgColor: colorData,
        imageBG: imageData,
        bgVideo: videoData,
        overlay: overlayData,
        paddings: paddingsData,
        flexPosition: position,
        customClasses: {
          classes: classes,
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          }
        },
        linkBlock: {
          link: blockUrl,
          target: {
            sectionID: sectionID,
            modelNumber: modelNumber,
            rexID: rex_block_id
          }
        }
      };

      var data = {
        eventName: "rexlive:editBlockOptions",
        activeBlockData: currentBlockData
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      return;
    });

    $(document).on("click", ".open-model", function(e) {
      Rexbuilder_Util_Editor.openingModel = true;
      var $section = $(e.target).parents(".rexpansive_section");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";
      var newSectionID = Rexbuilder_Util.createSectionID();
      var shortCode = Rex_Save_Listeners.createSectionProperties(
        $section,
        "shortcode",
        newSectionID
      );
      var sectionCustomizations = Rexbuilder_Util.getSectionCustomLayouts(
        sectionID
      );
      var names = [];
      var i;
      if (sectionCustomizations.length != 0) {
        for (i = 0; i < sectionCustomizations.length; i++) {
          names.push(sectionCustomizations[i].name);
          if (sectionCustomizations[i].name == "default") {
            sectionCustomizations[i].targets = Rex_Save_Listeners.createTargets(
              $section,
              "default"
            );
          }
        }
      } else {
        names.push("default");
        sectionCustomizations.push({
          name: "default",
          targets: Rex_Save_Listeners.createTargets($section, "default")
        });
      }

      var modelID =
        typeof $section.attr("data-rexlive-model-id") != "undefined"
          ? $section.attr("data-rexlive-model-id")
          : "";

      var modelsCounted = [];
      var modelFoundFlag = false;

      var k;

      Rexbuilder_Util.$rexContainer
        .find(".rexpansive_section.rex-model-section")
        .each(function(i, sec) {
          var $sec = $(sec);
          var modelID = parseInt($sec.attr("data-rexlive-model-id"));
          var modelNumber = parseInt($sec.attr("data-rexlive-model-number"));
          modelFoundFlag = false;

          for (k = 0; k < modelsCounted.length; k++) {
            if (
              modelID == modelsCounted[k].modelID &&
              modelNumber > modelsCounted[k].number
            ) {
              modelsCounted[k].number = modelNumber;
              modelFoundFlag = true;
            }
          }
          if (!modelFoundFlag) {
            modelsCounted.push({
              modelID: modelID,
              number: modelNumber
            });
          }
        });

      var data = {
        eventName: "rexlive:openModalMenu",
        modelData: {
          modelID: modelID,
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },
          shortCode: shortCode,
          layouts: sectionCustomizations,
          layoutsNames: names,
          modelsNumbers: modelsCounted
        }
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      Rexbuilder_Util_Editor.openingModel = false;
    });

    $(document).on("click", ".update-model-button", function(e) {
      var $button = $(this);
      var $section = $button.parents(".rexpansive_section");

      if ($button.hasClass("locked")) {
        var sectionID = $section.attr("data-rexlive-section-id");
        var modelID =
          typeof $section.attr("data-rexlive-model-id") != "undefined"
            ? $section.attr("data-rexlive-model-id")
            : "";
        var modelName =
          typeof $section.attr("data-rexlive-model-name") != "undefined"
            ? $section.attr("data-rexlive-model-name")
            : "";
        var modelNumber =
          typeof $section.attr("data-rexlive-model-number") != "undefined"
            ? $section.attr("data-rexlive-model-number")
            : "";

        var data = {
          eventName: "rexlive:editRemoveModal",
          modelData: {
            modelName: modelName,
            modelNumber: modelNumber,
            modelID: modelID,
            sectionTarget: {
              sectionID: sectionID,
              modelNumber: modelNumber
            },
            layoutActive: Rexbuilder_Util.activeLayout
          }
        };

        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        Rexbuilder_Util_Editor.openingModel = false;
      } else {
        var event = jQuery.Event("rexlive:saveModel");
        $(document).trigger(event);
      }
    });
  }); // End of the DOM ready
})(jQuery);
