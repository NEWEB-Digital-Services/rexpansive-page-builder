var Rexbuilder_Section = (function($) {
  "use strict";

  var _showSectionToolBox = function($section) {
    $section.children(".section-toolBox").addClass("tool-box-active");
  };

  /**
   * Position correctly the section to toolbox
   * If in mobile, take care of an eventually section margin
   * to prevent overlapping tools
   * @param {jQuery Object} $section section to fix
   * @since 2.0.0
   * @date 11-05-2019
   */
  var _fixSectionToolbox = function( $section, margins ) {
    var toolBox = $section.find('.section-toolBox')[0];
    if ( 'mobile' === Rexbuilder_Util.activeLayout )
    {
      toolBox.style.marginLeft = '-' + margins.left + 'px';
      toolBox.style.marginRight = '-' + margins.right + 'px';
    }
    else
    {
      toolBox.style.marginLeft = '';
      toolBox.style.marginRight = '';
    }
  };

  /**
   * Check the top padding of a section, to tell the block
   * tools that is or not enought space to view them
   * @param {jQuery Object} $section section to check
   * @param {JS Object} settings section settings
   * @since 2.0.0
   * @date 11-05-2019
   */
  var _fixBlockToolsAccordingToSeparator = function( $section, settings ) {
    if ( settings.top > 25 )
    {
      $section.removeClass('ui-tools--near-top');
    }
    else
    {
      $section.addClass('ui-tools--near-top');
    }
  };

  /**
   * Launch text editors inside a row
   * @param  {Element} rowEl row element
   * @return {void}
   * @since  2.0.5
   */
  function launchSectionTextEditors( rowEl ) {
    var blocks = Array.prototype.slice.call( rowEl.getElementsByClassName( 'perfect-grid-item' ) );
    var i, totBlocks = blocks.length;

    for( i=0; i<totBlocks; i++ ) {
      if ( Rexbuilder_Util.hasClass( blocks[i], 'block-has-slider' ) ) continue;
      TextEditor.addElementToTextEditor( blocks[i].querySelector(".text-wrap") );
    }
  }

  /**
   * Fix the copied row
   * @param {Object} $section jQuery section copied
   * @since 2.0.0
   */
  var _prepareSectionCopied = function($section) {
    var oldSectionNumber = parseInt(
      $section.attr("data-rexlive-section-number")
    );
    Rexbuilder_Util.lastSectionNumber = Rexbuilder_Util.lastSectionNumber + 1;

    $section.attr(
      "data-rexlive-section-number",
      Rexbuilder_Util.lastSectionNumber
    );

    var $gallery = $section.find(".grid-stack-row");

    $gallery.removeClass("grid-number-" + oldSectionNumber);

    //removing old gridstack instance class
    $gallery.removeClass(function(index, className) {
      return (className.match(/grid-stack-instance-\d+/g) || []).join(" ");
    });

    Rexbuilder_Live_Utilities.removeDeletedBlocks($gallery);

    // Change section rexID
    // Do this first to prevent synch bugs
    if (!Rexbuilder_Util_Editor.insertingModel) {
      var newSectionId = Rexbuilder_Util.createSectionID();
      $section.attr( "data-rexlive-section-id", newSectionId);
      $section.attr("data-rexlive-section-name", "");

      // fix section data id
      var sectionData = $section[0].querySelector('.section-data');
      sectionData.setAttribute('data-rexlive_section_id',newSectionId);

      // fix sectiom width tool
      var sectionWidthTools = [].slice.call( $section[0].getElementsByClassName('edit-row-width') );
      sectionWidthTools.forEach( function(el,i) {
        var fieldId = 'row-dimension-' + el.getAttribute('data-section_width') + '-' + newSectionId;
        el.setAttribute('name', 'row-dimension-' + newSectionId);
        el.setAttribute('id', fieldId);
        el.nextElementSibling.setAttribute('for',fieldId);
      });

      // fix section layout tool
      var sectionLayoutTools = [].slice.call( $section[0].getElementsByClassName('edit-row-layout') );
      sectionLayoutTools.forEach( function(el,i) {
        var fieldId = 'row-layout-' + el.getAttribute('data-section_layout') + '-' + newSectionId;
        el.setAttribute('name', 'row-layout-' + newSectionId);
        el.setAttribute('id', fieldId);
        el.nextElementSibling.setAttribute('for',fieldId);
      });
    }

    tmpl.arg = "block";
    var contentEl;
    // var dragHandlerHTML = tmpl("tmpl-block-drag-handle")().trim();
    var dragHandlerHTML = Rexbuilder_Live_Templates.getTemplate('tmpl-block-drag-handle');

    var tmplToolbox = '';
    // removing scrollbars and text editor
    $gallery.find(".grid-stack-item").each(function(i, el) {
      var $elem = $(el);
      var tools_info = {
        block_type: ''
      };
      if (!Rexbuilder_Util_Editor.insertingModel) {
        Rexbuilder_Live_Utilities.generateElementNewIDs(
          $elem,
          i,
          Rexbuilder_Util.lastSectionNumber
        );
      }
      // Rexbuilder_Util_Editor.removeScrollBar($elem);
      Rexbuilder_Live_Utilities.removeHandles($elem);
      Rexbuilder_Live_Utilities.removeTextEditor($elem);
      if (!Rexbuilder_Util_Editor.insertingModel) {
        Rexbuilder_Live_Utilities.fixCopiedElementSlider($elem);
      }
      if ($elem.find(".rexlive-block-toolbox").length == 0) {
        tmplToolbox = Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-block-wrap', tools_info);
        $elem
          .find(".grid-stack-item-content")
          // .after(tmpl("tmpl-toolbox-block", tools_info))
          // .after(tmpl("tmpl-toolbox-block-bottom", tools_info))
          // .after(tmpl("tmpl-toolbox-block-floating"));
          // .after(tmpl("tmpl-toolbox-block-wrap", tools_info));
          .after(tmplToolbox);
      }

      // add dragging element, to drag blocks
      if ( null === el.querySelector('.rexlive-block-drag-handle') ) {
        contentEl = el.querySelector('.grid-item-content');
        contentEl.insertAdjacentHTML( 'beforebegin', dragHandlerHTML );
      }

      // sanitize block content
      Rexbuilder_CreateBlocks.sanitizeBlockContent( el );
    });

    tmpl.arg = "section";

    // Rexbuilder_Section.linkHoverSection($section);

    // Rexbuilder_Section.hideSectionToolBox($section);
  };

  /**
   * Toggle a collapse on a certain row
   * @param {jQUery Object} $section row to toggle collapse
   * @since 2.0.0
   */
  var _toggleGridCollapse = function( $section ) {
    // actual section collapsing state
    var gridCollapsed;
    if ( typeof $section.attr("data-rex-collapse-grid") != "undefined" && $section.attr("data-rex-collapse-grid").toString() == "true" ) {
      gridCollapsed = true;
    } else {
      gridCollapsed = false;
    }

    var galleryEditorInstance = Rexbuilder_Util.getGalleryInstance($section);

    var layout = {
      layout: galleryEditorInstance.settings.galleryLayout,
      fullHeight: galleryEditorInstance.settings.fullHeight,
      singleHeight: galleryEditorInstance.properties.singleHeight
    };

    var reverseData = {
      gridInstance: galleryEditorInstance,
      gridLayout: layout,
      blockDisposition: galleryEditorInstance.createActionDataMoveBlocksGrid(),
      collapse: gridCollapsed
    };

    // if the section is NOT collapsed
    if (!gridCollapsed) {
      // here: remove hold grid from everywhere
      // remove the hold grid option
      $section.removeClass('rex-block-grid');
      var cls = $section.children('.section-data').attr('data-custom_classes');
      $section.children('.section-data').attr('data-custom_classes', cls.replace( /\s*rex-block-grid/, '' ));
      
      galleryEditorInstance.collapseElementsProperties();
      galleryEditorInstance.collapseElements(reverseData);
    } else {
      Rexbuilder_Util_Editor.updatingCollapsedGrid = true;

      var elemetsDisposition = Rexbuilder_Util.getLayoutLiveSectionTargets( $section );
      var galleryLayoutToActive = Rexbuilder_Util.getGridLayoutLive($section);

      // if(typeof elemetsDisposition[0].props.pickDefaultSizeCollapse !== "undefined" && elemetsDisposition[0].props.pickDefaultSizeCollapse.toString() == "true"){
      if ( 'mobile' === Rexbuilder_Util.activeLayout || Rexbuilder_Util.isMobile() ) {
        Rexbuilder_Util.applyDefaultBlocksDimentions($section, elemetsDisposition, galleryLayoutToActive);
      }

      var gridstackInstance = galleryEditorInstance.properties.gridstackInstance;
      var fullHeight = galleryLayoutToActive.fullHeight.toString() == "true";
      var singleHeight;

      if (galleryLayoutToActive.layout == "masonry") {
        singleHeight = 5;
      } else {
        singleHeight = galleryEditorInstance.$element.outerWidth() / 12;
      }

      var galleryLayout = {
        layout: galleryLayoutToActive.layout,
        fullHeight: fullHeight,
        singleHeight: singleHeight
      };

      galleryEditorInstance.element.setAttribute( "data-layout", galleryLayout.layout );
      galleryEditorInstance.element.setAttribute( "data-full-height", galleryLayout.fullHeight );

      galleryEditorInstance.updateGridLayoutCollapse(galleryLayout);

      galleryEditorInstance.batchGridstack();

      var section = $section[0];
      var elem,
        elemData,
        props,
        postionData;

      for (var i = 1; i < elemetsDisposition.length; i++) {
        elem = section.querySelector( 'div[data-rexbuilder-block-id="' + elemetsDisposition[i].name + '"]' );
        elemData = elem.querySelector(".rexbuilder-block-data");
        props = elemetsDisposition[i].props;
        postionData = {
          x: props.gs_x,
          y: props.gs_y,
          w: props.gs_width,
          h: props.gs_height,
          startH: props.gs_start_h,
          gridstackInstance: gridstackInstance
        };
        Rexbuilder_Util.updateElementDimensions( elem, elemData, postionData );
        // update size viewers
        galleryEditorInstance.updateSizeViewerText( elem, postionData.w, postionData.h );
      }

      galleryEditorInstance.commitGridstack();

      galleryEditorInstance.removeCollapseElementsProperties();

      if (galleryLayout.layout == "masonry") {
        setTimeout(
          function() {
            galleryEditorInstance.updateBlocksHeight();
            setTimeout(
              function() {
                var actionData = {
                  gridInstance: galleryEditorInstance,
                  gridLayout: galleryLayout,
                  blockDisposition: galleryEditorInstance.createActionDataMoveBlocksGrid(),
                  collapse: false
                };
                galleryEditorInstance._fixImagesDimension();
                Rexbuilder_Util_Editor.pushAction(
                  $section,
                  "collapseSection",
                  actionData,
                  reverseData
                );
                Rexbuilder_Util_Editor.updatingCollapsedGrid = false;
              },
              400,
              reverseData,
              $section,
              galleryEditorInstance,
              galleryLayout
            );
          },
          300,
          reverseData,
          $section,
          galleryEditorInstance,
          galleryLayout
        );
      } else {
        if (fullHeight) {
          setTimeout(
            function() {
              galleryEditorInstance.properties.gridBlocksHeight = galleryEditorInstance._calculateGridHeight();
              galleryLayout.singleHeight =
                Rexbuilder_Util.globalViewport.height /
                galleryEditorInstance.properties.gridBlocksHeight;
              galleryEditorInstance.updateGridstackStyles(
                galleryLayout.singleHeight
              );
              setTimeout(
                function() {
                  var actionData = {
                    gridInstance: galleryEditorInstance,
                    gridLayout: galleryLayout,
                    blockDisposition: galleryEditorInstance.createActionDataMoveBlocksGrid(),
                    collapse: false
                  };
                  Rexbuilder_Util_Editor.pushAction(
                    $section,
                    "collapseSection",
                    actionData,
                    reverseData
                  );
                  galleryEditorInstance._fixImagesDimension();
                  Rexbuilder_Util_Editor.updatingCollapsedGrid = false;
                },
                100,
                reverseData,
                $section,
                galleryEditorInstance,
                galleryLayout
              );
            },
            300,
            reverseData,
            $section,
            galleryEditorInstance,
            galleryLayout
          );
        } else {
          setTimeout(
            function() {
              var actionData = {
                gridInstance: galleryEditorInstance,
                gridLayout: galleryLayout,
                blockDisposition: galleryEditorInstance.createActionDataMoveBlocksGrid(),
                collapse: false
              };
              galleryEditorInstance._fixImagesDimension();
              Rexbuilder_Util_Editor.pushAction(
                $section,
                "collapseSection",
                actionData,
                reverseData
              );
              Rexbuilder_Util_Editor.updatingCollapsedGrid = false;
            },
            400,
            reverseData,
            $section,
            galleryEditorInstance,
            galleryLayout
          );
        }
      }
    }

    var data = {
      eventName: "rexlive:edited",
      modelEdited: $section.hasClass("rex-model-section")
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);

    if (Rexbuilder_Util.activeLayout == "default") {
      Rexbuilder_Util.updateDefaultLayoutStateSection($section);
    }
  };

  function handleBuilderDeleteRow(e) {
    var $section = $(e.currentTarget).parents(".rexpansive_section");
    var layoutsOrder = null;
    var modelNumber = -1;
    var modelID = -1;
    var rexID = $section.attr("data-rexlive-section-id");
    var defaultStateSections = null;
    if (Rexbuilder_Util.activeLayout == "default") {
      defaultStateSections = Rexbuilder_Util.getDefaultLayoutState();
      layoutsOrder = Rexbuilder_Util.getPageCustomizationsDom();
      if ($section.hasClass("rex-model-section")) {
        modelNumber = parseInt($section.attr("data-rexlive-model-number"));
        modelID = parseInt($section.attr("data-rexlive-model-id"));
      }
    }

    if ( 'undefined' !== typeof Rexbuilder_Rexwpcf7_Editor ) {
      var $elementsInSection = $section.find('.rex-element-wrapper').has('.wpcf7-form');
      $elementsInSection.each(function(index, el) {
        var $elem = $(el);

        if ( 0 !== $elem.find('.wpcf7-form').length ) {
          var formID = $elem.attr('data-rex-element-id');
          Rexbuilder_Rexwpcf7_Editor.removeFormInPage(formID);
        }
      });
		}

		// RexButtons operations
		Rexbuilder_Rexbutton.refreshNumbers();
		Rexbuilder_Rexbutton.updateButtonListInPage();

    var reverseData = {
      show: true,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null,
      stateDefault:
        defaultStateSections != null
          ? jQuery.extend(true, [], defaultStateSections)
          : null
    };

    Rexbuilder_Dom_Util.updateSectionVisibility($section, false);
    if (layoutsOrder != null) {
      var i, j;
      Rexbuilder_Dom_Util.fixModelNumbers();
      for (i = 0; i < layoutsOrder.length; i++) {
        for (j = 0; j < layoutsOrder[i].sections.length; j++) {
          if (layoutsOrder[i].sections[j].section_is_model) {
            if (
              layoutsOrder[i].sections[j].section_model_id == modelID &&
              layoutsOrder[i].sections[j].section_model_number == modelNumber
            ) {
              layoutsOrder[i].sections.splice(j, 1);
              break;
            }
          } else {
            if (rexID == layoutsOrder[i].sections[j].section_rex_id) {
              layoutsOrder[i].sections.splice(j, 1);
              break;
            }
          }
        }
        if (modelID != -1) {
          var k = 1;
          for (j = 0; j < layoutsOrder[i].sections.length; j++) {
            if (layoutsOrder[i].sections[j].section_model_id == modelID) {
              layoutsOrder[i].sections[j].section_model_number = k;
              k = k + 1;
            }
          }
        }
      }

      Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);

      for (j = 0; j < defaultStateSections.length; j++) {
        if (defaultStateSections[j].section_is_model) {
          if (
            defaultStateSections[j].section_model_id == modelID &&
            defaultStateSections[j].section_model_number == modelNumber
          ) {
            defaultStateSections.splice(j, 1);
            break;
          }
        } else {
          if (rexID == defaultStateSections[j].section_rex_id) {
            defaultStateSections.splice(j, 1);
            break;
          }
        }
      }

      if (modelID != -1) {
        var k = 1;
        for (j = 0; j < defaultStateSections.length; j++) {
          if (defaultStateSections[j].section_model_id == modelID) {
            defaultStateSections[j].section_model_number = k;
            k = k + 1;
          }
        }
      }

      Rexbuilder_Util.updateDefaultLayoutState({
        pageData: defaultStateSections
      });
    }

    // if the page remains empty
    // make sure that the "add row" button is visible
    if( 0 === Rexbuilder_Util.rexContainer.querySelectorAll(".rexpansive_section:not(.removing_section)").length ) {
      Rexbuilder_Util_Editor.activeAddSection();
    }

    var actionData = {
      show: false,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null,
      stateDefault:
        defaultStateSections != null
          ? jQuery.extend(true, [], defaultStateSections)
          : null
    };

    Rexbuilder_Util_Editor.pushAction(
      $section,
      "updateSectionVisibility",
      actionData,
      reverseData
    );

    var data = {
      eventName: "rexlive:edited",
      modelEdited: false
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  }

  /**
   * Handling the copy of a section
   * @since 2.0.0
   */
  function handleBuilderCopyRow(e) {		
    Rexbuilder_Util_Editor.sectionCopying = true;
    var $section = $(e.currentTarget).parents(".rexpansive_section");
    var $newSection = $section.clone(false);

    var layoutsOrder = null;
    if (Rexbuilder_Util.activeLayout == "default") {
      layoutsOrder = Rexbuilder_Util.getPageCustomizationsDom();
    }

    var oldRexID = $section.attr("data-rexlive-section-id");
    var oldModelID = -1;
    var oldModelNumber = -1;

    if ($section.hasClass("rex-model-section")) {
      oldModelID = $section.attr("data-rexlive-model-id");
      oldModelNumber = $section.attr("data-rexlive-model-number");
    }
    var newSectionNumber = -1;

    // search the copyed section index
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section:not(.removing_section)")
      .each(function(i, sec) {
        var $sec = $(sec);
        if ($sec.attr("data-rexlive-section-id") == oldRexID) {
          if ($section.hasClass("rex-model-section")) {
            if (
              $sec.attr("data-rexlive-model-id") == oldModelID &&
              $sec.attr("data-rexlive-model-number") == oldModelNumber
            ) {
              newSectionNumber = i + 1;
              return false;
            }
          } else {
            newSectionNumber = i + 1;
            return false;
          }
        }
      });

    if ($section.hasClass("rex-model-section")) {
      Rexbuilder_Util_Editor.insertingModel = true;
      var modelID = $newSection.attr("data-rexlive-model-id");
      var modelNumber = 1;
      Rexbuilder_Util.$rexContainer
        .children(".rexpansive_section")
        .each(function(i, sec) {
          var $sec = $(sec);
          if ($sec.attr("data-rexlive-model-id") == modelID) {
            modelNumber = modelNumber + 1;
          }
        });
      $newSection.attr("data-rexlive-model-number", modelNumber);
      var $buttonModel = $newSection.find(".update-model-button");
      Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);
    }

    Rexbuilder_Live_Utilities.removeColorPicker($newSection);

    // insert the copyed row
    Rexbuilder_Section.prepareSectionCopied($newSection);
    $newSection.insertAfter($section);

    Rexbuilder_Section_Editor.listenNewRowDataChange( $newSection.children('.section-data')[0] );

    var $row = $newSection.find(".grid-stack-row");

    // launch the grid on the new section
		$row.perfectGridGalleryEditor({editorMode: true});
		
		Rexbuilder_Rexbutton.refreshNumbers();
		Rexbuilder_Rexbutton.updateButtonListInPage();

    // relaunch sortable
    Rexbuilder_Util.$rexContainer.sortable("refresh");

    launchSectionTextEditors( $row[0] );
    
    // update the tools
    // Rexbuilder_Section_Editor.updateRowTools( $newSection );
    // Rexbuilder_Block_Editor.updateBlockToolsOnRow( $newSection );
    Rexbuilder_Live_Utilities.launchTooltips();

    var reverseData = {
      show: false,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null
    };

    Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);
    if (layoutsOrder != null) {
      var i, j;
      var sectionObj = {
        section_rex_id: $newSection.attr("data-rexlive-section-id"),
        targets: [],
        section_is_model: false,
        section_model_id: "",
        section_model_number: -1,
        section_hide: false,
        section_created_live: true
      };

      if ($newSection.hasClass("rex-model-section")) {
        sectionObj.section_is_model = true;
        sectionObj.section_model_id = $newSection.attr(
          "data-rexlive-model-id"
        );
      }

      for (i = 0; i < layoutsOrder.length; i++) {
        if (sectionObj.section_is_model) {
          var modelNumber = 1;
          for (j = 0; j < layoutsOrder[i].sections.length; j++) {
            if (
              layoutsOrder[i].sections[j].section_model_id ==
              sectionObj.section_model_id
            ) {
              modelNumber = modelNumber + 1;
            }
          }
          sectionObj.section_model_number = modelNumber;
        }
        if (newSectionNumber != -1) {
          layoutsOrder[i].sections.splice(newSectionNumber, 0, sectionObj);
        } else {
          layoutsOrder[i].sections.push(sectionObj);
        }
      }
      Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);
    }

    var actionData = {
      show: true,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null
    };

    Rexbuilder_Util_Editor.pushAction(
      $newSection,
      "updateSectionVisibility",
      actionData,
      reverseData
    );

    Rexbuilder_Util_Editor.sectionCopying = false;
    Rexbuilder_Util_Editor.insertingModel = false;

    var data = {
      eventName: "rexlive:edited",
      modelEdited: false
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);

    // @todo (handle also blocks inside the copied section...)
    Rexbuilder_Util.editedDataInfo.addSectionData( $newSection.attr("data-rexlive-section-id") ); 
    if (Rexbuilder_Util.activeLayout == "default") {
      Rexbuilder_Util.updateDefaultLayoutStateSection(
        $newSection,
        newSectionNumber
      );
    }
  }

  /**
   * Listen to click on collapse row button
   * @since 2.0.0
   */
  function handleCollapseGrid(e) {
    var $section = $(e.target).parents(".rexpansive_section");

    _toggleGridCollapse( $section );
  }

  /**
   * Listen to event that launchs a collapse on a row
   * @since 2.0.0
   */
  function handleCollapseRow(e) {
    var data = e.settings.data_to_send;

    var $section;
    if (data.sectionTarget.modelNumber != "") {
      $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"][data-rexlive-model-number="' + data.sectionTarget.modelNumber + '"]');
    } else {
      $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"]');
    }

    _toggleGridCollapse( $section );
  }

  /**
   * Listening collapse row end
   */
  function handleCollapsingElementsEnded(e) {
    var galleryEditorInstance = e.settings.galleryEditorInstance;
    var reverseData = e.settings.reverseData;
    var $section = e.settings.$section;
    if (typeof reverseData.collapse != "undefined") {
      var newDispostion = galleryEditorInstance.createActionDataMoveBlocksGrid();
      var actionData = {
        gridInstance: galleryEditorInstance,
        gridLayout: {
          layout: "masonry",
          fullHeight: false,
          singleHeight: galleryEditorInstance.settings.cellHeightMasonry
        },
        blockDisposition: newDispostion,
        collapse: true
      };
      Rexbuilder_Util_Editor.pushAction(
        $section,
        "collapseSection",
        actionData,
        reverseData
      );
    }
  }

  /**
   * Adding a new row
   * Here are the new row defaults
   * @since 2.0.0
   */
  function handleAddNewSection(e) {
    var rexIdSection = Rexbuilder_Util.createSectionID();
    var $btn = $(this);
    var newRowPosition = $btn.attr('data-new-row-position');

    var layoutsOrder = null;
    if (Rexbuilder_Util.activeLayout == "default") {
      layoutsOrder = Rexbuilder_Util.getPageCustomizationsDom();
    }

    tmpl.arg = "section";

    // New Row Defaults
    var new_row_defaults = {
      rexID: rexIdSection,
      dimension: "full",
      dimensionClass: "full-disposition",
      sectionWidth: "100%",
      fullHeight: "false",
      blockDistance: 20,
      layout: "fixed",
      rowSeparatorTop: 20,
      rowSeparatorBottom: 20,
      rowSeparatorRight: 20,
      rowSeparatorLeft: 20
    };

    // var newSection = tmpl("tmpl-new-section", new_row_defaults);
    var newSection = Rexbuilder_Live_Templates.getTemplate('tmpl-new-section', new_row_defaults);

    var $newSection = $(newSection);
    var $newSectionData = $newSection.children(".section-data");

		// $newSectionData.after( tmpl("tmpl-toolbox-section", new_row_defaults) );
    $newSectionData.after(Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-section', new_row_defaults));
		
    // add after the last row
    switch( newRowPosition ) {
      case 'bottom':
        var $prevRow = Rexbuilder_Util.$rexContainer.children("section:last");
        break;
      case 'after':
        var $prevRow = $btn.parents(".rexpansive_section");
        break;
      default:
        break;
    }

    if ($prevRow.length != 0) {
      $newSection.insertAfter($prevRow);
    } else {
      $newSection.appendTo(Rexbuilder_Util.$rexContainer);
    }

    // Rexbuilder_Section.linkHoverSection($newSection);

    Rexbuilder_Util.lastSectionNumber = Rexbuilder_Util.lastSectionNumber + 1;

    $newSection.attr( "data-rexlive-section-number", Rexbuilder_Util.lastSectionNumber );
    $newSection.find(".grid-stack-row").perfectGridGalleryEditor({editorMode:true});

    Rexbuilder_Util.$rexContainer.sortable("refresh");

    // Rexbuilder_Section_Editor.updateRowTools( $newSection );
    Rexbuilder_Live_Utilities.launchTooltips();

    var reverseData = {
      show: false,
      layoutsOrder: layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null
    };

    Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);

    if (layoutsOrder != null) {
      var i;
      var sectionObj = {
        section_rex_id: $newSection.attr("data-rexlive-section-id"),
        targets: [],
        section_is_model: false,
        section_model_id: "",
        section_model_number: -1,
        section_hide: false,
        section_created_live: true
      };

      for (i = 0; i < layoutsOrder.length; i++) {
        layoutsOrder[i].sections.push(sectionObj);
      }

      Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);
    }

    var actionData = {
      show: true,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null
    };

    Rexbuilder_Util_Editor.pushAction(
      $newSection,
      "updateSectionVisibility",
      actionData,
      reverseData
    );

    var data = {
      eventName: "rexlive:edited",
      modelEdited: false
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);

    Rexbuilder_Util.editedDataInfo.addSectionData( rexIdSection );
    if ( Rexbuilder_Util.activeLayout == "default" ) {
      Rexbuilder_Util.updateDefaultLayoutStateSection($newSection);
    }
  }

  /**
  * Adding a new row
  * @since 2.0.0
  */
  function handleAddNewSectionAfter(e) {
    var rexIdSection = Rexbuilder_Util.createSectionID();
    var data = e.settings.data_to_send;
    var newRowPosition = data.position;

    var $section;
    if (data.sectionTarget.modelNumber != "") {
      $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"][data-rexlive-model-number="' + data.sectionTarget.modelNumber + '"]');
    } else {
      $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"]');
    }

    var layoutsOrder = null;
    if (Rexbuilder_Util.activeLayout == "default") {
      layoutsOrder = Rexbuilder_Util.getPageCustomizationsDom();
    }

    tmpl.arg = "section";

    // New Row Defaults
    var new_row_defaults = {
      rexID: rexIdSection,
      dimension: "full",
      dimensionClass: "center-disposition",
      sectionWidth: "100%",
      fullHeight: "false",
      blockDistance: 20,
      layout: "fixed",
      rowSeparatorTop: 20,
      rowSeparatorBottom: 20,
      rowSeparatorRight: 20,
      rowSeparatorLeft: 20
    };
    
    // var newSection = tmpl("tmpl-new-section", new_row_defaults);
    var newSection = Rexbuilder_Live_Templates.getTemplate('tmpl-new-section', new_row_defaults);

    var $newSection = $(newSection);
    var $newSectionData = $newSection.children(".section-data");

    // $newSectionData.after(tmpl("tmpl-toolbox-section", new_row_defaults));
    $newSectionData.after(Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-section', new_row_defaults));
		// For now it's ok adding after the last section
    switch( newRowPosition ) {
      case 'bottom':
        var $prevRow = Rexbuilder_Util.$rexContainer.children("section:last");
        break;
      case 'after':
        var $prevRow = $section;
        break;
      default:
        break;
    }

    if ($prevRow.length != 0) {
      $newSection.insertAfter($prevRow);
    } else {
      $newSection.appendTo(Rexbuilder_Util.$rexContainer);
    }

    Rexbuilder_Section_Editor.listenNewRowDataChange( $newSectionData[0] );

    // Rexbuilder_Section.linkHoverSection($newSection);

    Rexbuilder_Util.lastSectionNumber = Rexbuilder_Util.lastSectionNumber + 1;

    $newSection.attr(
      "data-rexlive-section-number",
      Rexbuilder_Util.lastSectionNumber
    );
    $newSection.find(".grid-stack-row").perfectGridGalleryEditor({editorMode:true});

    Rexbuilder_Util.$rexContainer.sortable("refresh");

    // Rexbuilder_Section_Editor.updateRowTools( $newSection );
    Rexbuilder_Live_Utilities.launchTooltips();

    var reverseData = {
      show: false,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null
    };

    Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);

    if (layoutsOrder != null) {
      var i;
      var sectionObj = {
        section_rex_id: $newSection.attr("data-rexlive-section-id"),
        targets: [],
        section_is_model: false,
        section_model_id: "",
        section_model_number: -1,
        section_hide: false,
        section_created_live: true
      };

      for (i = 0; i < layoutsOrder.length; i++) {
        layoutsOrder[i].sections.push(sectionObj);
      }

      Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);
    }

    var actionData = {
      show: true,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null
    };

    Rexbuilder_Util_Editor.pushAction(
      $newSection,
      "updateSectionVisibility",
      actionData,
      reverseData
    );

    var data = {
      eventName: "rexlive:edited",
      modelEdited: false
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);

    Rexbuilder_Util.editedDataInfo.addSectionData( rexIdSection );
    if (Rexbuilder_Util.activeLayout == "default") {
      Rexbuilder_Util.updateDefaultLayoutStateSection($newSection);
    }
  }

  /**
   * Place a correctly imported row model
   *
   * @since 2.0.0
   */
  function handleApplyModelSection(e) {
    Rexbuilder_Util_Editor.sectionCopying = true;
    Rexbuilder_Util_Editor.insertingModel = true;

    var data = e.settings.data_to_send;

    var newSectionHtml = data.model;
    var html = $.parseHTML(newSectionHtml);
    var $oldSection;
    var oldModelNumberEdited = data.sectionTarget.modelNumber;
    var oldModelID = -1;
    var oldRexID = data.sectionTarget.sectionID;
    var defaultStateSections = null;
    var layoutsOrder = null;
    if (Rexbuilder_Util.activeLayout == "default") {
      defaultStateSections = Rexbuilder_Util.getDefaultLayoutState();
      layoutsOrder = Rexbuilder_Util.getPageCustomizationsDom();
    }

    if (oldModelNumberEdited != "") {
      $oldSection = Rexbuilder_Util.$rexContainer.find(
        'section[data-rexlive-section-id="' +
          oldRexID +
          '"][data-rexlive-model-number="' +
          oldModelNumberEdited +
          '"]'
      );
      oldModelID = parseInt($oldSection.attr("data-rexlive-model-id"));
    } else {
      $oldSection = Rexbuilder_Util.$rexContainer.find(
        'section[data-rexlive-section-id="' + oldRexID + '"]'
      );
    }

    var modelNumber = 1;
    Rexbuilder_Util.$rexContainer
      .children(
        ".rexpansive_section.rex-model-section:not(.removing_section)"
      )
      .each(function(i, sec) {
        var $sec = $(sec);
        if ($sec.attr("data-rexlive-model-id") == data.modelID) {
          modelNumber = modelNumber + 1;
        }
      });

    $oldSection.after(html);

    var $newSection = $(html);
    var newSectionRexID = $newSection.attr("data-rexlive-section-id");
    var dataModel = {
      id: data.modelID,
      modelName: data.modelName,
      sectionID: newSectionRexID,
      $section: $newSection,
      modelNumber: modelNumber,
      isModel: true
    };

    var addingModelCustomizationsNames = {
      id: dataModel.id,
      names: data.customizationsNames
    };

    Rexbuilder_Util.updateDivModelCustomizationsNames(
      addingModelCustomizationsNames
    );

    var addingModelCustomizationsData = {
      id: dataModel.id,
      name: dataModel.modelName,
      customizations: data.customizationsData
    };

    Rexbuilder_Util.updateModelsCustomizationsData(
      addingModelCustomizationsData
    );

    Rexbuilder_Dom_Util.updateSectionBecameModel(dataModel);

    Rexbuilder_Section.prepareSectionCopied($newSection);
    var $newSectionData = $newSection.children(".section-data");
    // $newSectionData.after(tmpl("tmpl-toolbox-section"));
    $newSectionData.after(Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-section'));
    var $buttonModel = $newSection.find(".update-model-button");
    Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);

    var $row = $newSection.find(".grid-stack-row");

    $row.perfectGridGalleryEditor({editorMode:true});

    // Launching and Updating tools
    Rexbuilder_Live_Utilities.updateModelSectionTools( $newSection, $newSectionData );

    //starting sliders after grid is up
    setTimeout(
      function() {
        $row.children(".grid-stack-item").each(function(i, el) {
          var $sliderToActive = $(el).find(".rex-slider-wrap");
          if ($sliderToActive.length != 0) {
            RexSlider.initSlider($sliderToActive);
          }
        });
      },
      500,
      $row
    );

    Rexbuilder_Util.$rexContainer.sortable("refresh");

    var reverseData = {
      $sectionToHide: $newSection,
      $sectionToShow: $oldSection,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null,
      stateDefault:
        defaultStateSections != null
          ? jQuery.extend(true, [], defaultStateSections)
          : null
    };

    Rexbuilder_Dom_Util.updateSectionVisibility($oldSection, false);
    Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);

    // fixing dom order in default and custom layouts
    if (layoutsOrder != null) {
      var i, j;
      var modelObj = {
        section_rex_id: newSectionRexID,
        targets: [],
        section_is_model: true,
        section_model_id: data.modelID,
        section_model_number: modelNumber,
        section_hide: false,
        section_created_live: true
      };

      for (i = 0; i < layoutsOrder.length; i++) {
        for (j = 0; j < layoutsOrder[i].sections.length; j++) {
          if (layoutsOrder[i].sections[j].section_is_model) {
            if (
              layoutsOrder[i].sections[j].section_model_id == oldModelID &&
              layoutsOrder[i].sections[j].section_model_number ==
                oldModelNumberEdited
            ) {
              break;
            }
          } else {
            if (oldRexID == layoutsOrder[i].sections[j].section_rex_id) {
              break;
            }
          }
        }
        if (layoutsOrder[i].sections[j].section_created_live) {
          layoutsOrder[i].sections.splice(
            j,
            1,
            jQuery.extend(true, {}, modelObj)
          );
        } else {
          modelObj.section_created_live = false;
          layoutsOrder[i].sections.splice(j, 1);
          layoutsOrder[i].sections.push(jQuery.extend(true, {}, modelObj));
        }
        modelObj.section_created_live = true;
      }
      Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);

      for (j = 0; j < defaultStateSections.length; j++) {
        if (defaultStateSections[j].section_is_model) {
          if (
            defaultStateSections[j].section_model_id == oldModelID &&
            defaultStateSections[j].section_model_number ==
              oldModelNumberEdited
          ) {
            break;
          }
        } else {
          if (oldRexID == defaultStateSections[j].section_rex_id) {
            break;
          }
        }
      }
      defaultStateSections.splice(j, 1, modelObj);
      Rexbuilder_Util.updateDefaultLayoutState({
        pageData: defaultStateSections,
        modelsData: Rexbuilder_Util.getModelsCustomizations()
      });
    }

    var actionData = {
      $sectionToHide: $oldSection,
      $sectionToShow: $newSection,
      layoutsOrder:
        layoutsOrder != null ? jQuery.extend(true, [], layoutsOrder) : null,
      stateDefault:
        defaultStateSections != null
          ? jQuery.extend(true, [], defaultStateSections)
          : null
    };

    Rexbuilder_Util_Editor.pushAction(
      $newSection,
      "updateSectionModel",
      actionData,
      reverseData
    );

    Rexbuilder_Util_Editor.sectionCopying = false;
    Rexbuilder_Util_Editor.insertingModel = false;
    var data = {
      eventName: "rexlive:edited",
      modelEdited: false
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  }

  function handleImportModels(e) {
    if (Rexbuilder_Util.activeLayout != "default") {
      return;
    }

    var $model_to_import = Rexbuilder_Util.$rexContainer.find( ".import-model" );

    if ($model_to_import.length == 0) {
      return;
    }

    //positioning before first section
    if ($model_to_import.next().is("#textEditorToolbar")) {
      Rexbuilder_Util.$rexContainer
        .find(".rexpansive_section")
        .eq(0)
        .before($model_to_import.detach());
		}

    $.ajax({
      type: "GET",
      dataType: "json",
      url: _plugin_frontend_settings.rexajax.ajaxurl,
      data: {
        action: "rex_get_model_live",
        nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
        model_data: {
          ID: parseInt($model_to_import.attr("data-rex-model-id"))
        }
      },
      success: function(response) {
        if (response.success) {
          var modelData = {
            model: response.data.model,
            modelName: response.data.name,
            modelID: response.data.id,
            customizationsData: response.data.customizations_data,
            customizationsNames: response.data.customizations_names
					};

          Rexbuilder_Util_Editor.sectionCopying = true;
          Rexbuilder_Util_Editor.insertingModel = true;

          var modelNumber = 1;
          Rexbuilder_Util.$rexContainer
            .children( ".rexpansive_section.rex-model-section:not(.removing_section)" )
            .each(function(i, sec) {
              var $sec = $(sec);
              if ($sec.attr("data-rexlive-model-id") == modelData.modelID) {
                modelNumber = modelNumber + 1;
              }
            });

          var html = $.parseHTML(modelData.model);
          $model_to_import.after(html);
          $model_to_import.remove();

          var defaultStateSections = Rexbuilder_Util.getDefaultLayoutState();
          var layoutsOrder = Rexbuilder_Util.getPageCustomizationsDom();

          var $newSection = $(html);
          var newSectionRexID = $newSection.attr("data-rexlive-section-id");
          $newSection.attr("data-rexlive-model-number", modelNumber);

          var addingModelCustomizationsNames = {
            id: modelData.modelID,
            names: modelData.customizationsNames
          };

          Rexbuilder_Util.updateDivModelCustomizationsNames(
            addingModelCustomizationsNames
          );

          var addingModelCustomizationsData = {
            id: modelData.modelID,
            name: modelData.modelName,
            customizations: modelData.customizationsData
          };

          Rexbuilder_Util.updateModelsCustomizationsData( addingModelCustomizationsData );

          Rexbuilder_Section.prepareSectionCopied($newSection);
          var $newSectionData = $newSection.children(".section-data");
          // $newSectionData.after(tmpl("tmpl-toolbox-section"));
          $newSectionData.after(Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-section'));
          var $buttonModel = $newSection.find(".update-model-button");
          Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);

          var $row = $newSection.find(".grid-stack-row");

					$row.perfectGridGalleryEditor({editorMode:true});
					
					// Replacing RexButtons in the model with the fresh HTML from the DB
					_replaceRexButtons($row, response);

					// Adding the necessary to forms that are present in the model
					$row.find('.rex-element-wrapper').each(function (index, wrapper) {
						Rexbuilder_Rexelement_Editor.setupElement($(wrapper));
					})

          // Launching and Updating tools
          Rexbuilder_Live_Utilities.updateModelSectionTools( $newSection, $newSectionData );

          //starting sliders after grid is up
          setTimeout(
            function() {
              $row.find(".grid-stack-item").each(function(i, el) {
                var $sliderToActive = $(el).find(".rex-slider-wrap");
                if ($sliderToActive.length != 0) {
                  RexSlider.initSlider($sliderToActive);
                }
              });
            },
            500,
            $row
          );

          launchSectionTextEditors( $row.get(0) );

          Rexbuilder_Live_Utilities.launchTooltips();

          // update block tools
          var blocks = Array.prototype.slice.call( $row.get(0).getElementsByClassName('perfect-grid-item') );
          var i, tot = blocks.length;
          for( i=0; i<tot; i++ ) {
            var $itemContent = $(blocks[i]).find('.grid-item-content');

            var blockData = blocks[i].querySelector('.rexbuilder-block-data');
            
            // update image tool
            var imageActive = blockData.getAttribute('data-image_bg_elem_active');
            var imageUrl = blockData.getAttribute('data-image_bg_block')

            if ( 'true' == imageActive && '' !== imageUrl ) {
              var data = {
                active: imageActive,
                urlImage: imageUrl,
              };

              // brutal fix
              Rexbuilder_Util.addClass( blocks[i].querySelector('.rexlive-block-toolbox.top-tools .edit-block-image').parentElement, 'tool-button--hide' );
              Rexbuilder_Block_Editor.updateBlockBackgroundImageTool($itemContent, data);
              Rexbuilder_Block_Editor.updateBlockImagePositionTool($itemContent, data);
            }

            // update color tool
            var color = blockData.getAttribute('data-color_bg_block');
            var colorActive = blockData.getAttribute('data-color_bg_block_active');

            if ( 'true' == colorActive && '' !== color ) {
              Rexbuilder_Block_Editor.updateBlockBackgroundColorToolLive( $itemContent, color );
            }

            // update overlay tool
            var overlay = blockData.getAttribute('data-overlay_block_color');
            var overlayActive = blockData.getAttribute('data-overlay_block_color_active');

            if ( 'true' == overlayActive && '' !== overlay ) {
              Rexbuilder_Block_Editor.updateBlockOverlayColorToolLive( $itemContent, overlay );
            }

            // update video tool
            var mp4Video = blockData.getAttribute('data-video_bg_id');
            var youtubeVideo = blockData.getAttribute('data-video_bg_url');
            var vimeoVideo = blockData.getAttribute('data-video_bg_url_vimeo');

            if ( '' !== mp4Video || '' !== youtubeVideo || '' !== vimeoVideo ) {
              Rexbuilder_Util.addClass( blocks[i].querySelector('.rexlive-block-toolbox.top-tools .edit-block-video-background').parentElement, 'tool-button--hide' );
              Rexbuilder_Util.removeClass( blocks[i].querySelector('.rexlive-block-toolbox.bottom-tools .edit-block-video-background').parentElement, 'tool-button--hide' );
            }

            // update text tool
            Rexbuilder_Block_Editor.updateTextTool( blocks[i].querySelector('.text-wrap') );
          }

          Rexbuilder_Util.$rexContainer.sortable("refresh");

          var reverseData = {
            show: false,
            layoutsOrder:
              layoutsOrder != null
                ? jQuery.extend(true, [], layoutsOrder)
                : null
          };

          Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);

          // fixing dom order in default and custom layouts
          if (layoutsOrder != null) {
            var modelPosition = 0;
            Rexbuilder_Util.$rexContainer
              .children(".rexpansive_section:not(.removing_section)")
              .each(function(i, sec) {
                var $sec = $(sec);
                if (
                  $sec.attr("data-rexlive-model-id") == modelData.modelID &&
                  $sec.attr("data-rexlive-model-number") == modelNumber
                ) {
                  modelPosition = i;
                  return false;
                }
              });
            var i;

            var modelObj = {
              section_rex_id: newSectionRexID,
              targets: [],
              section_is_model: true,
              section_model_id: modelData.modelID,
              section_model_number: modelNumber,
              section_hide: false,
              section_created_live: true
            };

            for (i = 0; i < layoutsOrder.length; i++) {
              layoutsOrder[i].sections.splice(
                modelPosition,
                0,
                jQuery.extend(true, {}, modelObj)
              );
            }

            defaultStateSections.splice(
              modelPosition,
              0,
              jQuery.extend(true, {}, modelObj)
            );

            Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);

            Rexbuilder_Util.updateDefaultLayoutState({
              pageData: defaultStateSections,
              modelsData: Rexbuilder_Util.getModelsCustomizations()
            });
          }

          var actionData = {
            show: true,
            layoutsOrder:
              layoutsOrder != null
                ? jQuery.extend(true, [], layoutsOrder)
                : null
          };

          Rexbuilder_Util_Editor.pushAction(
            $newSection,
            "updateSectionVisibility",
            actionData,
            reverseData
          );

          Rexbuilder_Util_Editor.sectionCopying = false;
          Rexbuilder_Util_Editor.insertingModel = false;
          var data = {
            eventName: "rexlive:edited",
            modelEdited: false
          };
          Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        }
      },
      error: function(response) {},
      complete: function(response) {}
    });
    //$model_to_import.children().remove();
	}
	
	/**
	 * Replaces model RexButtons with the DB-retrieved HTML
	 * @param		{jQuery}	$row 
	 * @param		{jQuery}	$buttonsWrappers 
	 * @param		{Object}	response 
	 * @returns	{void}
	 * @since		2.0.4
	 */
	function _replaceRexButtons($row, response) {
		// Keeping jQuery for consistency motivations
		var $buttonsWrappers = $row.find('.rex-button-wrapper');
		var buttonID = '';
		var databaseButtonsArray = response.data.rexButtonsHTML;
		var tot_databaseButtonsArray = databaseButtonsArray.length;
		var databaseButton;
		var i;

		$buttonsWrappers.each(function (index, element) {
			var $element = $(element);

			buttonID = $element.attr('data-rex-button-id');

			for (i = 0; i < tot_databaseButtonsArray; i++) {
				databaseButton = databaseButtonsArray[i];
				if (-1 !== databaseButton.search(buttonID)) {
					$element.replaceWith(databaseButton);
					break;
				}
			}
		});

		// Refreshing the jQuery element because of the replacements
		// Needed because when replacing, the jQuery object is not updated
		// with the new DOM references
		$buttonsWrappers = $row.find('.rex-button-wrapper');

		$buttonsWrappers.each(function (index, element) {
			Rexbuilder_Rexbutton.endFixingButtonImported($(element));
		});
	}

  var _addSectionToolboxListeners = function() {
    Rexbuilder_Util.$rexContainer.on("click", ".builder-delete-row", handleBuilderDeleteRow);
    Rexbuilder_Util.$rexContainer.on("click", ".builder-copy-row", handleBuilderCopyRow);
		Rexbuilder_Util.$rexContainer.on("click", ".collapse-grid", handleCollapseGrid);
		
		Rexbuilder_Util.$document.on("click", ".add-new-section", handleAddNewSection);
		
    Rexbuilder_Util.$document.on("rexlive:collapse_row", handleCollapseRow);
    Rexbuilder_Util.$document.on("rexlive:collapsingElementsEnded", handleCollapsingElementsEnded);

    Rexbuilder_Util.$document.on("rexlive:add_new_section_after", handleAddNewSectionAfter);

    Rexbuilder_Util.$document.on("rexlive:applyModelSection", handleApplyModelSection);

    Rexbuilder_Util.$document.on("rexlive:importModels", handleImportModels);
  };

  /**
   * Update Models HTML live when something change
   *
   * @since 2.0.0
   */
  var _updateModelsHtmlLive = function(data) {
    Rexbuilder_Util_Editor.sectionCopying = true;
    Rexbuilder_Util_Editor.insertingModel = true;
    var idModel = data.modelID;
    var newHtml = data.html;
    var editedModelNumber = data.model_number;
    var modelName = data.modelName;

    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section.rex-model-section:not(.removing_section)")
      .each(function(i, sec) {
        var $section = $(sec);
        if ( sec.getAttribute("data-rexlive-model-id") == idModel && sec.getAttribute("data-rexlive-model-number") != editedModelNumber ) {
          var oldSectionModelSavedNumber = isNaN(
            parseInt($section.attr("data-rexlive-model-number"))
          )
            ? ""
            : $section.attr("data-rexlive-model-number");
          var modelNumber = 1;
          Rexbuilder_Util.$rexContainer
            .children(".rexpansive_section:not(.removing_section)")
            .each(function(i, sec) {
              if ($(sec).attr("data-rexlive-model-id") == idModel) {
                modelNumber = modelNumber + 1;
              }
            });

          var html = $.parseHTML(newHtml);
          $section.after(html);

          var $newSection = $(html);
          $newSection.attr(
            "data-rexlive-model-number",
            oldSectionModelSavedNumber
          );

          var dataModel = {
            modelID: idModel,
            modelName: modelName,
            modelNumber: modelNumber,
            sectionID: $newSection.attr("data-rexlive-section-id"),
            isModel: true,
            $section: $newSection
          };

          Rexbuilder_Dom_Util.updateSectionBecameModel(dataModel);

          Rexbuilder_Section.prepareSectionCopied($newSection);
          var $newSectionData = $newSection.children(".section-data");

          var newSectionID = $newSection.attr("data-rexlive-section-id");

          // $newSectionData.after(tmpl("tmpl-toolbox-section", {
          //   rexID: newSectionID
          // }));
          $newSectionData.after(Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-section', {
            rexID: newSectionID
          }));

          var $buttonModel = $newSection.find(".update-model-button");
          Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);

          var $row = $newSection.find(".grid-stack-row");

          $row.perfectGridGalleryEditor({editorMode:true});

          // Launching and Updating tools
          Rexbuilder_Live_Utilities.updateModelSectionTools( $newSection, $newSectionData );
          Rexbuilder_Live_Utilities.launchTooltips();

          Rexbuilder_Util.$rexContainer.sortable("refresh");
          Rexbuilder_Dom_Util.updateSectionVisibility($section, false);
          Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);
        }
      });

    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section.removing_section.rex-model-section")
      .each(function(i, sec) {
        $(sec).attr("data-rexlive-model-number", "");
      });

    Rexbuilder_Util_Editor.sectionCopying = false;
    Rexbuilder_Util_Editor.insertingModel = false;
	};

  function _prependToolBoxVanilla() {
    var new_row_defaults = {
      rexID: '',
      dimension: 'full',
      dimensionClass: 'center-disposition',
      sectionWidth: '100%',
      fullHeight: 'false',
      blockDistance: 20,
      layout: 'fixed',
      rowSeparatorTop: 20,
      rowSeparatorBottom: 20,
      rowSeparatorRight: 20,
      rowSeparatorLeft: 20
    };

    var sections = Array.prototype.slice.call( Rexbuilder_Util.rexContainer.querySelectorAll('.rexpansive_section') );
    var section;
    var sectionID;

    var tot_sections = sections.length;
    var i = 0;
    for (; i < tot_sections; i++) {
      section = sections[i];

      sectionID = section.getAttribute('data-rexlive-section-id');
      new_row_defaults.rexID = sectionID;
      var string = Rexbuilder_Live_Templates.getTemplate('tmpl-toolbox-section', new_row_defaults);

      $(section).find('.section-data').after(string);
    }
  }
	
	function _prependToolBox() {
		tmpl.arg = 'section';

		var sectionToolboxTemplate = tmpl('tmpl-toolbox-section');

		var new_row_defaults = {
			rexID: '',
			dimension: 'full',
			dimensionClass: 'center-disposition',
			sectionWidth: '100%',
			fullHeight: 'false',
			blockDistance: 20,
			layout: 'fixed',
			rowSeparatorTop: 20,
			rowSeparatorBottom: 20,
			rowSeparatorRight: 20,
			rowSeparatorLeft: 20
		};

		var sections = Rexbuilder_Util.rexContainer.querySelectorAll('.rexpansive_section');
		var section;
		var sectionID;

		var tot_sections = sections.length;
		var i = 0;
		for (; i < tot_sections; i++) {
			section = sections[i];

			sectionID = section.getAttribute('data-rexlive-section-id');
			new_row_defaults.rexID = sectionID;

			$(section).prepend(sectionToolboxTemplate(new_row_defaults));
		}
	}

  var init = function() {
    //Setting row number
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function(i, section) {
        var $section = $(section);
        // Rexbuilder_Section.linkHoverSection($section);
        if ($section.hasClass("rex-model-section")) {
          $section.addClass("rexlive-block-grid-editing");
          $section
            .find(".grid-stack-row")
            .parent()
            .prepend('<div class="rexpansive-block-grid"></div>');
          $section
            .find(".section-toolBox")
            .parent()
            .prepend('<div class="rexpansive-block-section-toolbox"></div>');
        }

        if (typeof $section.attr("id") == "undefined") {
          $section.attr("id", "");
        }

        if (typeof $section.attr("data-rexlive-section-name") == "undefined") {
          $section.attr("data-rexlive-section-name", "");
        }
      });

    var startingSectionsOrder = [];
    var endSectionsOrder = [];
    //launching sortable
    Rexbuilder_Util.$rexContainer.sortable({
      iframeFix: true,
      start: function(event, ui) {
        Rexbuilder_Dom_Util.fixModelNumbers();
        startingSectionsOrder = [];
        Rexbuilder_Util.$rexContainer
          .children(
            ".rexpansive_section:not(.removing_section):not(.ui-sortable-placeholder)"
          )
          .each(function(i, el) {
            var $section = $(el);

            var sectionObj = {
              rexID: $section.attr("data-rexlive-section-id"),
              modelID: -1,
              modelNumber: -1
            };

            if ($section.hasClass("rex-model-section")) {
              sectionObj.modelID = $section.attr("data-rexlive-model-id");
              sectionObj.modelNumber = $section.attr(
                "data-rexlive-model-number"
              );
            }

            startingSectionsOrder.push(sectionObj);
          });
      },
      handle: ".builder-move-row",
      stop: function(event, ui) {
        var $section = $(event.srcElement).parents(".rexpansive_section");
        var sectionMovedObj = {
          rexID: $section.attr("data-rexlive-section-id"),
          modelID: -1,
          modelNumber: -1
        };

        if ($section.hasClass("rex-model-section")) {
          sectionMovedObj.modelID = $section.attr("data-rexlive-model-id");
          sectionMovedObj.modelNumber = $section.attr(
            "data-rexlive-model-number"
          );
        }

        endSectionsOrder = [];
        Rexbuilder_Util.$rexContainer
          .children(
            ".rexpansive_section:not(.removing_section):not(.ui-sortable-placeholder)"
          )
          .each(function(i, el) {
            var $sec = $(el);

            var sectionObj = {
              rexID: $sec.attr("data-rexlive-section-id"),
              modelID: -1,
              modelNumber: -1
            };

            if ($sec.hasClass("rex-model-section")) {
              sectionObj.modelID = $sec.attr("data-rexlive-model-id");
              sectionObj.modelNumber = $sec.attr("data-rexlive-model-number");
            }

            endSectionsOrder.push(sectionObj);
          });

        if (Rexbuilder_Util.activeLayout == "default") {
          Rexbuilder_Util.updateDefaultLayoutStateDOMOrder(endSectionsOrder);
        }
        var reverseData = {
          sectionOrder: startingSectionsOrder,
          sectionMoved: sectionMovedObj
        };

        Rexbuilder_Util.updateSectionOrderCustomLayouts(
          sectionMovedObj,
          endSectionsOrder
        );

        var actionData = {
          sectionOrder: endSectionsOrder,
          sectionMoved: sectionMovedObj
        };

        Rexbuilder_Util_Editor.pushAction(
          "document",
          "updateSectionOrder",
          actionData,
          reverseData
        );

        var data = {
          eventName: "rexlive:edited",
          modelEdited: false
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);

        Rex_Navigator.fixNavigatorItemOrder($section);
      }
		});
		
		// _prependToolBox()
    _prependToolBoxVanilla();
		
    // linking listeners to row setting buttons
    _addSectionToolboxListeners();
  };

  return {
    init: init,
    prepareSectionCopied: _prepareSectionCopied,
    showSectionToolBox: _showSectionToolBox,
    updateModelsHtmlLive: _updateModelsHtmlLive,
    fixSectionToolbox : _fixSectionToolbox,
    fixBlockToolsAccordingToSeparator: _fixBlockToolsAccordingToSeparator
  };
})(jQuery);
