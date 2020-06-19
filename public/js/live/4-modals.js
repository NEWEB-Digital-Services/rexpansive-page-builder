;(function($) {
  "use strict";

  $(function() {
    // Caching the document
    var $document = $(document);
    /**
     * Listening for events to update live a row or a block
     * 01) Row Full Height : rexlive:set_row_fullHeight
     * 02) Row Layout : rexlive:set_gallery_layout
     * 03) Row Layout : rexlive:galleryLayoutChanged
     * 04) Row Gutter : rexlive:set_row_separatos
     * 05) Row Gutter : rexlive:rowDistancesApplied
     * 06) Row Margins : rexlive:set_section_margins
     * 07) Row Margins : rexlive:sectionMarginsApplied
     * 08) Row Width : rexlive:set_section_width
     * 09) Row Width : rexlive:sectionWidthApplyed
     * 10) Row Photoswipe : rexlive:set_row_photoswipe
     *   ) Row Hold Grid : rexlive:set_row_hold_grid
     * 11) Row Name : rexlive:change_section_name
     *   ) Row Nav Label: rexlive:change_section_nav_label
     * 12) Row Custom Classes : rexlive:apply_section_custom_classes
     *   ) Row Blocks Update : rexlive:update_blocks_sizes
     * 13) Custom CSS : rexlive:SetCustomCSS
     * 14) Row Background Color : rexlive:apply_background_color_section
     * 15) Row Background Gradient: rexlive:updateSectionBackgroundGradient
     * 16) Row Overlay Gradient: rexlive:updateSectionOverlayGradient
     * 17) Row Overlay : rexlive:change_section_overlay
     * 18) Row Image Background : rexlive:apply_background_image_section
     * 19) Row Video Background : rexlive:update_section_background_video
     * 20) Block Background Color : rexlive:apply_background_color_block
     * 21) Block Background Gradient: rexlive:updateBlockBackgroundGradient
     * 22) Block Overlay Gradient: rexlive:updateBlockOverlayGradient
     * 23) Block Overlay : rexlive:change_block_overlay
     * 24) Block Image : rexlive:apply_background_image_block
     *   ) Block Photoswipe : rexlive:apply_photoswipe_block
     * 25) Block Video Background : rexlive:update_block_background_video
     * 26) Block Paddings : rexlive:apply_paddings_block
     * 27) Block Content Position : rexlive:apply_flex_position_block
     * 28) Block Image Position : rexlive:apply_flex_image_position_block
     * 29) Block Custom Classes : rexlive:apply_block_custom_classes
     * 30) Block Custom Link : rexlive:apply_block_link_url
     * 31) Text Gradient: rexlive:setTextGradient
     * 32) Model : rexlive:editModel
     * 33) Model : rexlive:modelBecameSection
     * 34) Buttons: rexlive:update_button_page
     * 35) Custom CSS : rexlive:getCustomCss
     * 36) Row | Block : rexlive:apply_reSynchContent
     */

    $document.on("rexlive:set_row_fullHeight", function(e) {
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
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
    });

    $document.on("rexlive:set_gallery_layout", function(e) {
      // if we want to go back with the empty space configuration, trigger undo

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

      // Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'layout' );

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Section_Editor.updateSectionLayoutTool($section,data);

      // if('undefined' == typeof e.settings.forged) {
      //   var layout = ( e.target.checked ? 'fixed' : 'masonry' );
      //   $section.find('.edit-row-layout-checkbox').prop('checked',layout);
      // }

      Rexbuilder_Dom_Util.updateGridLayoutDomProperties($gallery, data.layout);
      galleryInstance.updateGridLayout(data.layout, reverseData);
    });

    $document.on("rexlive:galleryLayoutChanged", function(e) {
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

    $document.on("rexlive:set_row_separatos", function(e) {
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

      //reverseData: state before
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

      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'block_distance' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_separator_top' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_separator_bottom' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_separator_right' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_separator_left' );

      Rexbuilder_Section.fixBlockToolsAccordingToSeparator($section, data.distances);
      $section.attr("data-rexlive-section-edited", true);
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
    });

    $document.on("rexlive:rowDistancesApplied", function(e) {
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

    $document.on("rexlive:set_section_margins", function(e) {
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
      Rexbuilder_Section.fixSectionToolbox($section, data.margins);

      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'margin' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_margin_top' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_margin_bottom' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_margin_right' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_margin_left' );

      $section.attr("data-rexlive-section-edited", true);
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
    });

    $document.on("rexlive:sectionMarginsApplied", function(e) {
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

    $document.on("rexlive:set_section_width", function(e) {
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

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));

      Rexbuilder_Section_Editor.updateSectionDimensionTool( $section, {
        dimension: ( "100%" === newSectionWidth ? 'full' : 'boxed' )
      } );

      galleryInstance.updateSectionWidthWrap(newSectionWidth, reverseData);
      Rexbuilder_Dom_Util.updateSectionWidthData($section, {
        sectionWidth: newSectionWidth,
        widthType: ( "100%" === newSectionWidth ? 'full' : 'boxed' )
      });

      // if('undefined' == typeof e.settings.forged) {
      //   $section.find('.edit-row-width[data-section_width='+widthType+']').prop('checked',true).val(sectionWidth);
      // }

      $section.attr("data-rexlive-section-edited", true);
    });

    $document.on("rexlive:sectionWidthApplyed", function(e) {
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

    /**
     * Handling the set/unset of photoswipe on an entire section
     * @since 2.0.0
     * @edit 16-04-2019 Handling the unset of photoswipe
     */
    $document.on("rexlive:set_row_photoswipe", function(e) {
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

      var elementsBefore = Rexbuilder_Live_Utilities.getElementsPhotoswipe( $gallery );
      var reverseData = {
        elements: elementsBefore
      };

      if (data.photoswipe.toString() == "true") {   // add photoswipe to all blocks
        Rexbuilder_Dom_Util.enablePhotoswipeAllBlocksSection($section);
      }
      else if ( data.photoswipe.toString() == "false" )   // remove photoswipe from all blocks
      {
        Rexbuilder_Dom_Util.removePhotoswipeAllBlocksSection($section);
      }

      var blocks = Array.prototype.slice.call( $section.get(0).getElementsByClassName('perfect-grid-item') );
      var i, totBlocks = blocks.length;
      for( i=0; i<totBlocks; i++ ) {
        Rexbuilder_Util.editedDataInfo.setBlockData( data.sectionTarget.sectionID, blocks[i].getAttribute('data-rexbuilder-block-id'), 'photoswipe' );
      }

      //actionData: state after
      var elementsAfter = Rexbuilder_Live_Utilities.getElementsPhotoswipe(
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
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
    });

    /**
     * Handling the "Grid on Mobile" tool event
     * @param  {Event}
     * @return {void}
     * @since  2.0.5
     */
    $document.on('rexlive:set_row_hold_grid', function(e) {
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

      // trigger collapse only if there is the case
      if ( $section.attr('data-rex-collapse-grid') === e.settings.data_to_send.holdGrid ) {
        // delegate the Hold Grid logic to collapse grid button
        $section.find('.collapse-grid').trigger('click');
      }
    });

    $document.on("rexlive:change_section_name", function(e) {
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

      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'section_name' );

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionName",
        actionData,
        reverseData
      );
    });

    /**
     * On section label change
     * @param  {Event}
     * @return {void}
     * @since 2.0.5
     */
    $document.on('rexlive:change_section_nav_label', function(e) {
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
        sectionNavLabel: $section.children('.section-data').attr("data-section_nav_label")
      };

      Rexbuilder_Dom_Util.updateSectionNavLabel($section, data.sectionNavLabel);

      var actionData = {
        sectionNavLabel: data.sectionNavLabel
      };
      $section.attr("data-rexlive-section-edited", true);

      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'section_nav_label' );

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionNavLabel",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:apply_section_custom_classes", function(e) {
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

      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'custom_classes' );

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateCustomClasses",
        actionData,
        reverseData
      );
    });

    $document.on( 'rexlive:update_blocks_sizes', function(event) {
      var data = event.settings.data_to_send;

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

      var $gridElement = $section.find(".grid-stack-row");
      var pgge = $gridElement.data().plugin_perfectGridGalleryEditor;
      pgge.updateBlocksSizes( data.blocksState );
    });

    $document.on('rexlive:update_block_size', function(event) {
      var data = event.settings.data_to_send;

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

      var $gridElement = $section.find(".grid-stack-row");
      var pgge = $gridElement.data().plugin_perfectGridGalleryEditor;
      pgge.updateBlockSize( data.blockState );
    });

    $document.on("rexlive:SetCustomCSS", function(e) {
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

      Rexbuilder_Util_Editor.builderEdited( false );
    });

    $document.on("rexlive:apply_background_color_section", function(e) {
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
      // tracing data
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'color_bg_section' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'color_bg_section_active' );

      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var actionData = {
        color: data.color,
        active: data.active
      };
      $section.attr("data-rexlive-section-edited", true);

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionBackgroundColor",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:updateSectionBackgroundGradient", function(e) {
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

      Rexbuilder_Dom_Util.updateSectionBackgroundGradient($section, data);
      // tracing data
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'color_bg_section' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'color_bg_section_active' );

      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var actionData = {
        color: data.color,
        active: data.active
      };
      $section.attr("data-rexlive-section-edited", true);

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionBackgroundGradient",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:updateSectionOverlayGradient", function(e) {
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

      Rexbuilder_Dom_Util.updateSectionOverlayGradient($section, data);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      var actionData = {
        color: data.color,
        active: data.active
      };
      $section.attr("data-rexlive-section-edited", true);

      // tracing data
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_overlay_color' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_overlay_active' );

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionOverlayGradient",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:change_section_overlay", function(e) {
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

      // tracing data
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_overlay_color' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'row_overlay_active' );

      var actionData = {
        color: data.color,
        active: data.active
      };
      $section.attr("data-rexlive-section-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));

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
    $document.on("rexlive:apply_background_image_section", function(e) {
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
      var image_size = typeof $sectionData.attr("data-image_size") == "undefined"
          ? ""
          : $sectionData.attr("data-image_size");
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
        image_size: image_size,
        urlImage: imageUrl,
        width: width,
        height: height
      };

      Rexbuilder_Dom_Util.updateImageBG($section, data);

      var actionData = {
        active: data.active,
        idImage: data.idImage,
        urlImage: data.urlImage,
        image_size: data.image_size,
        width: data.width,
        height: data.height
      };
      $section.attr("data-rexlive-section-edited", true);

      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'image_bg_section_active' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'image_bg_section' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'image_width' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'image_height' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'id_image_bg_section' );
      Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'image_size' );

      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }

      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionImageBG",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:update_section_background_video", function(e) {
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

      // data for undo/redo
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
      var mp4VideoWidth =
        typeof $sectionData.attr("data-video_bg_width_section") == "undefined"
          ? ""
          : $sectionData.attr("data-video_bg_width_section");
      var mp4VideoHeight =
        typeof $sectionData.attr("data-video_bg_height_section") == "undefined"
          ? ""
          : $sectionData.attr("data-video_bg_height_section");
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
          width: mp4VideoWidth,
          height: mp4VideoHeight
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
          width: data.videoMp4.width,
          height: data.videoMp4.height
        },
        vimeoUrl: data.urlVimeo,
        youtubeUrl: data.urlYoutube,
        audio: false,
        typeVideo: data.typeVideo
      };

      Rexbuilder_Dom_Util.updateVideos($section, videoOptions);
      Rexbuilder_Dom_Util.fixVideoProportion($section[0]);

      var actionData = {
        mp4Data: {
          idMp4: data.videoMp4.idMp4,
          linkMp4: data.videoMp4.linkMp4,
          width: data.videoMp4.width,
          height: data.videoMp4.height
        },
        vimeoUrl: data.urlVimeo,
        youtubeUrl: data.urlYoutube,
        audio: false,
        typeVideo: data.typeVideo
      };

      switch (actionData.typeVideo) {
        case 'mp4':
          Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'video_bg_id_section' );
          Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'video_mp4_url' );
          Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'video_bg_width_section' );
          Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'video_bg_height_section' );
          break;
        case 'youtube':
          Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'video_bg_url_section' );
          break;
        case 'vimeo':
          Rexbuilder_Util.editedDataInfo.setSectionData( data.sectionTarget.sectionID, 'video_bg_url_vimeo_section' );
          break;
        default:
          break;
      }

      $section.attr("data-rexlive-section-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateSectionVideoBG",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:apply_background_color_block", function(e) {
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

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'color_bg_block' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'color_bg_block_active' );

      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockBackgroundColor",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:updateBlockBackgroundGradient", function(e) {
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

      Rexbuilder_Dom_Util.updateBlockBackgroundGradient(actionData);

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'color_bg_block' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'color_bg_block_active' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockBackgroundGradient",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:updateBlockOverlayGradient", function(e) {
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
      var oldColor = $elemData.attr("data-overlay_block_color");
      var oldActive =
        typeof $elemData.attr("data-overlay_block_color_active") != "undefined"
          ? $elemData.attr("data-overlay_block_color_active")
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

      Rexbuilder_Dom_Util.updateBlockOverlayGradient(actionData);

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'overlay_block_color' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'overlay_block_color_active' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockOverlayGradient",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:change_block_overlay", function(e) {
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

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'overlay_block_color' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'overlay_block_color_active' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockOverlay",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:apply_background_image_block", function(e) {
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

      var elem = $elem.get(0);

      var $itemContent = $elem.find(".grid-item-content");
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $section = $elem.parents(".rexpansive_section");
      var galleryEditorInstance = Rexbuilder_Util.getGalleryInstance($section);

      switch(data.tools) {
        case 'top':
          $elem.find('.rexlive-block-toolbox.top-tools .edit-block-image').parent('.tool-button--double-icon--wrap').addClass('tool-button--hide');
          $elem.find('.rexlive-block-toolbox.bottom-tools .edit-block-image').parent('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
        case 'bottom':
          // the click comes from the bottom block tools: do nothing for now
        default:
          break;
      };

      var old_idImage =
        typeof $elemData.attr("data-id_image_bg_block") == "undefined" ? "" : $elemData.attr("data-id_image_bg_block");
      var old_imageUrl =
        typeof $elemData.attr("data-image_bg_block") == "undefined" ? "" : $elemData.attr("data-image_bg_block");
      var old_width =
        typeof $itemContent.attr("data-background_image_width") == "undefined" ? "" : $itemContent.attr("data-background_image_width");
      var old_height =
        typeof $itemContent.attr("data-background_image_height") == "undefined" ? "" : $itemContent.attr("data-background_image_height");
      var old_activeImage =
        typeof $elemData.attr("data-image_bg_elem_active") != "undefined" ? $elemData.attr("data-image_bg_elem_active") : true;

      var defaultTypeImage;
      if (old_activeImage.toString() == "true") {
        defaultTypeImage =
          $elem.parents(".grid-stack-row").attr("data-layout") == "fixed" ? "full" : "natural";
      } else {
        defaultTypeImage = "";
      }

      var old_typeBGimage =
        typeof $elemData.attr("data-type_bg_block") == "undefined" ? defaultTypeImage : $elemData.attr("data-type_bg_block");
      var old_photoswipe =
        typeof $elemData.attr("data-photoswipe") == "undefined" ? "" : $elemData.attr("data-photoswipe");

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

			if ('masonry' === galleryEditorInstance.settings.galleryLayout) {
				galleryEditorInstance.updateElementHeight(elem);
			}

      var actionData = {
        $itemContent: $itemContent,
        imageOpt: imageOpt
      };

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'image_bg_url' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'image_width' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'image_height' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'id_image_bg' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'image_size' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'image_bg_elem_active' );
      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'type_bg_image' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockImageBG",
        actionData,
        reverseData
      );
      Rexbuilder_Util_Editor.updatingImageBg = false;
    });

    /**
     * Change photoswipe on block
     * @param  {MouseEvent}
     * @return {void}
     * @since  2.0.5
     */
    $document.on('rexlive:apply_photoswipe_block', function(e) {
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
      var old_photoswipe =
        typeof $elemData.attr("data-photoswipe") == "undefined"
          ? ""
          : $elemData.attr("data-photoswipe");

      var reverseData = {
        $elem: $elem,
        photoswipe: old_photoswipe
      };

      var actionData = {
        $elem: $elem,
        photoswipe: data.photoswipe
      };

      Rexbuilder_Dom_Util.updateBlockPhotoswipe( actionData );

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'photoswipe' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockPhotoswipe",
        actionData,
        reverseData
      );
    });

    /**
     * Updating the background of a block with a video: YouTube, Vimeo, mp4
     * @since 2.0.0
     */
    $document.on("rexlive:update_block_background_video", function(e) {
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

      // If we have a video, make checks to synch tools
      if( ( 'youtube' == data.typeVideo && '' !== data.urlYoutube ) || ( 'vimeo' == data.typeVideo && '' !== data.urlVimeo ) || ( 'mp4' == data.typeVideo && '' !== data.videoMp4.idMp4 ) ) {

        switch(data.tools) {
          case 'top':
            $elem.find('.rexlive-block-toolbox.top-tools .edit-block-video-background').parent('.tool-button--double-icon--wrap').addClass('tool-button--hide');
            $elem.find('.rexlive-block-toolbox.bottom-tools .edit-block-video-background').parent('.tool-button--double-icon--wrap').removeClass('tool-button--hide');
          case 'bottom':
            // the click comes from the bottom block tools: do nothing for now
          default:
            break;
        };

      }

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
      Rexbuilder_Dom_Util.fixVideoProportion($itemContent.get(0));
      // if (galleryEditorInstance.settings.galleryLayout == "masonry") {
        //galleryEditorInstance.updateElementHeight($elem[0]);
      // }

      var actionData = {
        $itemContent: $itemContent,
        videoOpt: videoOptions
      };
      $elem.attr("data-rexlive-element-edited", true);

      switch( data.typeVideo ) {
        case 'mp4':
          Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'video_bg_id' );
          Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'video_bg_width' );
          Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'video_bg_height' );
          Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'video_mp4_url' );
          break;
        case 'youtube':
          Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'video_bg_url_youtube' );
          break;
        case 'vimeo':
          Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'video_bg_url_vimeo' );
          break;
        default:
          break;
      }

      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockVideoBG",
        actionData,
        reverseData
      );
    });

    /**
     * Listen to changing block paddings
     * @since 2.0.0
     */
    $document.on("rexlive:apply_paddings_block", function(e) {
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
      // TODO : here is the place to study to fix the padding problem
      if (galleryEditorInstance.settings.galleryLayout == "masonry") {
        galleryEditorInstance.updateElementHeight( $elem[0], true );
        galleryEditorInstance.updateSizeViewerSizes( $elem[0] );
      }
      Rexbuilder_Util_Editor.updatingPaddingBlock = false;

      var actionData = {
        $elem: $elem,
        dataPadding: data.paddings
      };

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'block_padding' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockPadding",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:apply_flex_position_block", function(e) {
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

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'block_flex_position' );

      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockFlexPosition",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:apply_flex_image_position_block", function(e) {
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
        typeof $elemData.attr("data-block_flex_img_position") == "undefined"
          ? ""
          : $elemData.attr("data-block_flex_img_position");

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

      Rexbuilder_Dom_Util.updateImageFlexPostition($elem, data.position);

      var actionData = {
        $elem: $elem,
        dataPosition: data.position
      };

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'block_flex_img_position' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockImageFlexPosition",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:apply_block_custom_classes", function(e) {
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

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'block_custom_class' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateCustomClasses",
        actionData,
        reverseData
      );
    });

    $document.on("rexlive:apply_block_link_url", function(e) {
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

      Rexbuilder_Util.editedDataInfo.setBlockData( target.sectionID, target.rexID, 'linkurl' );

      $elem.attr("data-rexlive-element-edited", true);
      if (Rexbuilder_Util.activeLayout == "default") {
        Rexbuilder_Util.updateDefaultLayoutStateSection($section);
      }
      Rexbuilder_Util_Editor.builderEdited($section.hasClass("rex-model-section"));
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "updateBlockUrl",
        actionData,
        reverseData
      );
    });

    /**
     * Setting the text gradient with Medium Editor
     * @since 2.0.0
     */
    $document.on("rexlive:setTextGradient", function(e) {
      TextEditor.triggerMEEvent({
        name:"rexlive:mediumeditor:setTextGradient",
        data: e.settings.data_to_send,
        editable: null
      });
    });

    $document.on("rexlive:editModel", function(e) {
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

    $document.on("rexlive:modelBecameSection", function(e) {
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
          defaultStateSections != null ? jQuery.extend(true, [], defaultStateSections) : null
      };

      Rexbuilder_Util_Editor.pushAction(
        $section,
        "sectionBecameModel",
        actionData,
        reverseData
      );
    });

    $document.on("Buttons: rexlive:update_button_page", function(e) {
      var data = e.settings.data_to_send;
      var reverseData = {
        buttonProperties: jQuery.extend(true, {}, data.reverseButtonData)
      };
      var actionData = {
        buttonProperties: jQuery.extend(true, {}, data.actionButtonData)
			};

			if (data.needToSave) {
				Rexbuilder_Util_Editor.builderEdited(false);
			}

      Rexbuilder_Rexbutton.updateButton(actionData);

      Rexbuilder_Util_Editor.pushAction(
        "document",
        "updateRexButton",
        actionData,
        reverseData
      );
    });

    $document.on('rexlive:update_wcpf7_column_content_page', function(e) {
      var data = e.settings.data_to_send;
      var reverseData = {
        columnContentData: jQuery.extend(true, {}, data.reverseColumnContentData)
      };
      var actionData = {
        columnContentData: jQuery.extend(true, {}, data.actionColumnContentData)
      };
      if ( data.needToSave ) {
        Rexbuilder_Util_Editor.builderEdited(false);
      }

      Rexbuilder_Rexwpcf7.updateColumnContent(actionData);
      Rexbuilder_Rexwpcf7_Editor.updateColumnContentShortcode(actionData);

      Rexbuilder_Util_Editor.pushAction(
        "document",
        "updateRexWpcf7ColumnContent",
        actionData,
        reverseData
      );
    });

    $document.on('rexlive:update_wcpf7_page', function(e) {
      var data = e.settings.data_to_send;
      var reverseData = {
        elementData: jQuery.extend(true, {}, data.reverseFormData)
      };
      var actionData = {
        elementData: jQuery.extend(true, {}, data.actionFormData)
      }

      if ( data.needToSave ) {
        Rexbuilder_Util_Editor.builderEdited(false);
      }

      Rexbuilder_Rexwpcf7.updateForm(actionData);

      Rexbuilder_Util_Editor.pushAction(
        "document",
        "updateRexWpcf7",
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
    $document.on("rexlive:getCustomCss", function() {
      var currentStyle = $("#rexpansive-builder-style-inline-css")
        .text()
        .replace(/^\s+|\s+$/g, "");
      var data = {
        eventName: "rexlive:openCssEditor",
        currentStyle: currentStyle
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    // apply the reset of the content properties to default
    $document.on('rexlive:apply_reSynchContent', function (event) {
			// default layout, do nothing
			if (Rexbuilder_Util.activeLayout == 'default') return;

			var targetInfo = event.settings.data.targetInfo;

			var defaultContent = document
				.getElementById('rexbuilder-layout-data')
				.querySelector('.customization-wrap[data-customization-name="default"]')
				.querySelector('.section-targets[data-section-rex-id="' + targetInfo.sectionID + '"]').textContent;
			var defaultProps = '' !== defaultContent ? JSON.parse(defaultContent) : {};

			if ('self' === targetInfo.rexID) {
				/* === Updating section and its blocks === */
				Rexbuilder_Dom_Util.updateBulkSection(
					targetInfo,
					Rexbuilder_Util.editedDataInfo.getSectionData(targetInfo.sectionID),
					defaultProps
				);

				// reset: no property customized on this layout
				Rexbuilder_Util.editedDataInfo.setBulkSectionData( targetInfo.sectionID, false );

        // set layout according to default anyhow
        var $section;
        if ( targetInfo.modelNumber != "" ) {
          $section = Rexbuilder_Util.$rexContainer.find(
            'section[data-rexlive-section-id="' +
              targetInfo.sectionID +
              '"][data-rexlive-model-number="' +
              targetInfo.modelNumber +
              '"]'
          );
        } else {
          $section = Rexbuilder_Util.$rexContainer.find( 'section[data-rexlive-section-id="' + targetInfo.sectionID + '"]' );
        }
        var $galleryElement = $section.find('.perfect-grid-gallery');

        var sectionProps;
        var i, tot = defaultProps.length;
        for( i=0; i<tot; i++ ) {
          if ( 'self' === defaultProps[i].name ) {
            sectionProps = defaultProps[i].props;
            break;
          }
        }

        var galleryEditorInstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
        var resetLayout = ( Rexbuilder_Util.isMobile() ? 'masonry' : sectionProps.layout );

        var data = {
          layout: resetLayout,
          sectionTarget: {
            modelNumber: targetInfo.modelNumber,
            sectionID: targetInfo.sectionID
          }
        };

				// Resetting grid layout
        Rexbuilder_Section_Editor.updateSectionLayoutTool($section, data);
				Rexbuilder_Dom_Util.updateGridLayoutDomProperties($galleryElement, data.layout);
				galleryEditorInstance.updateGridLayout(data.layout);

				// Applying default props to all sections' blocks
				defaultProps.forEach(function (prop) {
					if ('self' === prop.name) return;

					var blockTargetInfo = {
						sectionID: targetInfo.sectionID,
						modelNumber: targetInfo.modelNumber,
						rexID: prop.name
					};

					// Restoring visibility of a block by passing false as second argument of the
					// Rexbuilder_Dom_Util.updateRemovingBlock function. This is forced because it's sure that no block
					// can be added in a layout that isn't the default one, therefore a non default layout can have
					// a number of blocks <= the default number of blocks
					var $hiddenBlock = $section.find(
						'.rex-hide-element[data-rexbuilder-block-id="' + blockTargetInfo.rexID + '"]'
					);
					if (0 !== $hiddenBlock.length) {
						Rexbuilder_Dom_Util.updateRemovingBlock($hiddenBlock, false, galleryEditorInstance);
					}

					Rexbuilder_Dom_Util.updateBulkBlock(
						blockTargetInfo,
						Rexbuilder_Util.editedDataInfo.getBlockData(blockTargetInfo.sectionID, blockTargetInfo.rexID),
						defaultProps
					);

					// reset: no property customized on this layout
					Rexbuilder_Util.editedDataInfo.setBulkBlockData(blockTargetInfo.sectionID, blockTargetInfo.rexID, false);
				});

        // fix blocks heights, i.e. with natural images that must shrink
        if ( resetLayout == "masonry" && ! sectionProps.collapse_grid ) {
          galleryEditorInstance.updateBlocksHeight();
        }

        // set collapse elements
        if ( Rexbuilder_Util.isMobile() || sectionProps.collapse_grid ) {
          galleryEditorInstance.collapseElementsProperties();
          galleryEditorInstance.collapseElements();
				}

				Rexbuilder_Dom_Util.updateSectionFullHeight({
					galleryInstance: galleryEditorInstance,
					fullHeight: sectionProps.full_height
				});

				// Necessary to keep the top fixed toolbar synchronized
				Rexbuilder_Util_Editor.sendParentIframeMessage({
					eventName: 'rexlive:highlightRowSetData',
					editedData: sectionProps
				});

        // update size viewers
        galleryEditorInstance._updateElementsSizeViewers();
			} else {
				/* === Updating a single block === */
				Rexbuilder_Dom_Util.updateBulkBlock(
					targetInfo,
					Rexbuilder_Util.editedDataInfo.getBlockData(targetInfo.sectionID, targetInfo.rexID),
					defaultProps
				);

				// reset: no property customized on this layout
				Rexbuilder_Util.editedDataInfo.setBulkBlockData(targetInfo.sectionID, targetInfo.rexID, false);

        // update size viewer
        var $block;
        if (targetInfo.modelNumber != '') {
          $block = Rexbuilder_Util.$rexContainer
            .find(
              'section[data-rexlive-section-id="' +
                targetInfo.sectionID +
                '"][data-rexlive-model-number="' +
                targetInfo.modelNumber +
                '"]'
            )
						.find('div [data-rexbuilder-block-id="' + targetInfo.rexID + '"]');
        } else {
          $block = Rexbuilder_Util.$rexContainer
            .find('section[data-rexlive-section-id="' + targetInfo.sectionID + '"]')
            .find('div [data-rexbuilder-block-id="' + targetInfo.rexID + '"]');
        }

        var $section = $block.parents('.rexpansive_section');
        var $sectionData = $section.children('.section-data');
        var galleryEditorInstance = $section.find('.grid-stack-row').data('plugin_perfectGridGalleryEditor');

        var block = $block.get(0);

        if ( 'masonry' === $sectionData.attr('data-layout') && 'false' == $section.attr( 'data-rex-collapse-grid' ) ) {
					galleryEditorInstance.updateElementHeight( block );
				} else if (Rexbuilder_Util.isMobile() || 'true' === $section.attr( 'data-rex-collapse-grid' )) {
					block.setAttribute('data-gs-width', 12);
					block.setAttribute('data-gs-x', 0);
					var newDims = galleryEditorInstance.getBlockSizeOnCollapse(block);

					galleryEditorInstance.properties.gridstackInstance.update(
						block,
						parseInt(block.getAttribute('data-gs-x')),
						parseInt(block.getAttribute('data-gs-y')),
						newDims.width,
						newDims.height
					);
				}

        galleryEditorInstance.updateSizeViewerText( block );
			}

			Rexbuilder_Util_Editor.builderEdited('' !== targetInfo.modelNumber);
		});

    /**
     * Handling the click on section configuration button
     * @since 2.0.0
     */
    $document.on("click", ".builder-section-config", function(e) {
      e.preventDefault();

      var $section = $(e.target).parents(".rexpansive_section");
      var $sectionData = $section.children(".section-data");

      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined"
          ? $section.attr("data-rexlive-model-number")
          : "";

      var $gridElement = $section.find(".grid-stack-row");
      var pgge = $gridElement.data().plugin_perfectGridGalleryEditor;
      var temp = pgge.createActionDataMoveBlocksGrid().blocks;
      var blocksState = temp.map( function( el ) {
        return {
          rexID: el.rexID,
          x: el.x,
          y: el.y,
          w: el.w,
          h: el.h
        };
      });

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

      //the blocks that can have photoswipe
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
      var customClasses = $sectionData.attr("data-custom_classes");
      var sectionNavLabel = $sectionData.attr("data-section_nav_label");

      var data = {
        eventName: "rexlive:openSectionModal",
        section_options_active: {
          sectionTarget: {
            sectionID: sectionID,
            modelNumber: modelNumber
          },

          blocksState: blocksState,

          activeLayout: activeLayout,
          fullHeight: fullHeight,

          section_width: section_width,
          dimension: dimension,

          rowDistances: paddingsRow,

          marginsSection: marginsSection,
          photoswipe: photoswipe,

          sectionName: nameSection,
          sectionNavLabel: ( 'undefined' !== typeof sectionNavLabel ? sectionNavLabel : '' ),
          customClasses: customClasses
        }
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		});

    // Launch to the iframe parent the event to open the Media Uploader
    $document.on("click", ".add-new-block-image", function(e) {
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
    $document.on("click", ".add-new-block-video", function(e) {
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

    $document.on("click", ".add-new-block-slider", function(e) {
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

    $document.on("click", ".edit-background-section", function(e) {
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

    $document.on("click", ".builder-edit-block", function(e) {
      e.preventDefault();

      var $elem = $(e.target).parents(".grid-stack-item");
      var $section = $elem.parents(".rexpansive_section");
      var rex_block_id = $elem.attr("data-rexbuilder-block-id");
      var sectionID = $section.attr("data-rexlive-section-id");
      var modelNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";
      var $elemData = $elem.children(".rexbuilder-block-data");
      var $itemContent = $elem.find(".grid-item-content");
      var $textcontent = $elem.find('.text-wrap');

      var color = $elemData.attr("data-color_bg_block");
      var colorActive =
        typeof $elemData.attr("data-color_bg_elem_active") != "undefined" ? $elemData.attr("data-color_bg_elem_active") : false;
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
        typeof $elemData.attr("data-overlay_block_color") != "undefined" ? $elemData.attr("data-overlay_block_color") : "";
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
          "undefined" ? $elemData.attr("data-overlay_block_color_active") : false;
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
      if ( '' !== $textcontent.text().trim() ) {
        defaultTypeImage = 'full';
      }

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
      if ( '' === blockFlexPosition ) blockFlexPosition = 'left top';

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

      var blockFlexImgPosition =
        typeof $elemData.attr("data-block_flex_img_position") == "undefined"
          ? ""
          : $elemData.attr("data-block_flex_img_position");
      if ( '' === blockFlexImgPosition ) blockFlexImgPosition = 'center middle';

      var blockFlexImgPositionArr = blockFlexImgPosition.split(" ");
      var blockFlexImgPositionString = blockFlexImgPositionArr[1] + "-" + blockFlexImgPositionArr[0];
      var img_position = {
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
        position: blockFlexImgPositionString
      };

      var classes =
        typeof $elemData.attr("data-block_custom_class") == "undefined"
          ? ""
          : $elemData.attr("data-block_custom_class");

      var blockUrl =
        typeof $elemData.attr("data-linkurl") == "undefined"
          ? ""
          : $elemData.attr("data-linkurl");

      var blockState = {
        rexID: rex_block_id,
        x: parseInt( $elem.attr('data-gs-x')),
        y: parseInt( $elem.attr('data-gs-y')),
        w: parseInt( $elem.attr('data-gs-width')),
        h: parseInt( $elem.attr('data-gs-height'))
      };

      var currentBlockData = {
        bgColor: colorData,
        imageBG: imageData,
        bgVideo: videoData,
        overlay: overlayData,
        paddings: paddingsData,
        flexPosition: position,
        flexImgPosition: img_position,
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
        },
        sectionTarget: {
          sectionID: sectionID,
          modelNumber: modelNumber
        },
        blockState: blockState
      };

      var data = {
        eventName: "rexlive:editBlockOptions",
        activeBlockData: currentBlockData
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      return;
    });

    /**
     * Handling creation/editing of a model
     *
     * @since 2.0.0
     */
    $document.on("click", ".open-model", function(e) {
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

    /**
     * Handling update a model
     *
     * @since 2.0.0
     */
    $document.on("click", ".call-update-model-button", function(e) {
      $(this).parents('.rexpansive_section').find(".update-model-button").trigger("click");
    });

    $document.on("click", ".update-model-button", function(e) {
      var $button = $(this);
      var $section = $button.parents(".rexpansive_section");

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

      if ($button.hasClass("locked")) {

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
        var data = {
          eventName: "rexlive:saveAndCloseModel",
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

        var event = jQuery.Event("rexlive:saveModel");
        $document.trigger(event);
      }
    });
  }); // End of the DOM ready
})(jQuery);
