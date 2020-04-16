var Rexbuilder_Section = (function($) {
  "use strict";

  var _showSectionToolBox = function($section) {
    $section.children(".section-toolBox").addClass("tool-box-active");
  };

  var _hideSectionToolBox = function($section) {
    // $section.children(".section-toolBox").removeClass("tool-box-active");
  };

  var _linkHoverSection = function($section) {
    // $section.hover(
    //   function(event) {
    //     Rexbuilder_Section.showSectionToolBox($section);
    //   },
    //   function(event) {
    //     if ($(event.toElement).parents(".medium-editor-toolbar").length == 0) {
    //       Rexbuilder_Section.hideSectionToolBox($section);
    //     }
    //   }
    // );
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
    var dragHandlerHTML = '<div class="rexlive-block-drag-handle"></div>';

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
        $elem
          .find(".grid-stack-item-content")
          // .after(tmpl("tmpl-toolbox-block", tools_info))
          // .after(tmpl("tmpl-toolbox-block-bottom", tools_info))
          // .after(tmpl("tmpl-toolbox-block-floating"));
          // .after(tmpl("tmpl-toolbox-block-wrap", tools_info));
          .after('<div class="ui-focused-element-highlight"> <div class="rexlive-block-toolbox top-tools"> <div class="rexlive-top-block-tools"> <div class="el-size-viewer tool-indicator"><span class="el-size-viewer__val"></span> <span class="el-size-viewer__um">PX</span></div> <div class="bl_d-iflex bl_ai-c block-toolBox__editor-tools"> <div class="tool-button tool-button--inline edit-block-content"> <i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i> </div> <div class="tool-button tool-button--inline builder-edit-slider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> </div> <div class="bl_d-iflex bl_ai-c block-toolBox__config-tools"> <div class="tool-button tool-button--inline tool-button--hide edit-block-gradient tippy" data-tippy-content="Gradient" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z010-Logo"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-content-position tool-button--hide" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#C005-Layout"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-accordion tippy" data-tippy-content="Accordion" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z010-Logo"></use></svg></i> </div> <div class="tool-button tool-button--inline edit-block-slideshow tippy" data-tippy-content="Slideshow" style="margin-right:15px"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--inline builder-copy-block tippy" data-tippy-content="Copy block"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button-floating block-toolBox__config-list"> <div class="tool-button" data-tippy-content="Block settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button tool-button--inline tool-button_list--item builder-edit-block tippy" data-tippy-content="Block settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item' + ( tools_info.block_type == 'image' ? ' tool-button--hide' : '' ) + ' tippy" data-tippy-content="Background Image"> <div class="tool-button tool-button--inline edit-block-image tippy"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-block-color-background" value=""> </div> <div class="tool-button--double-icon--wrap tool-button--opacity-preview tool-button_list--item tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-block-overlay-color" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item' + ( tools_info.block_type == 'video' ? ' tool-button--hide' : '' ) + ' tippy" data-tippy-content="Background Video"> <div class="tool-button tool-button--inline edit-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> </div> <div class="tool-button tool-button--inline tool-button_list--item builder-edit-slider tippy" data-tippy-content="RexSlider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button_list--item builder-copy-block tippy" data-tippy-content="Copy block"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="Delete block"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--black builder-delete-block waves-effect tippy" data-tippy-content="Delete block"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="rexlive-block-toolbox bottom-tools" data-block_type="' + tools_info.block_type + '"> <div class="rexlive-bottom-block-tools bl_d-flex bl_jc-c"> <div class="bl_d-iflex bl_ai-c block-toolBox__fast-configuration"> <div class="tool-button--double-icon--wrap' + ( tools_info.block_type != 'image' ? ' tool-button--hide' : '' ) + ' tippy" data-tippy-content="Background Image"> <div class="tool-button tool-button--inline edit-block-image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button tool-button--inline tool-button--block-bottom--fix edit-block-image-position' + ( tools_info.block_type != 'image' ? ' tool-button--hide' : '' ) + ' tippy" data-tippy-content="Image Settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button--hide"> <input class="spectrum-input-element" type="text" name="edit-block-color-background" value=""> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--hide"> <input class="spectrum-input-element" type="text" name="edit-block-overlay-color" value=""> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap' + ( tools_info.block_type != 'video' ? ' tool-button--hide' : '' ) + '"> <div class="tool-button tool-button--inline edit-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="rexlive-block-toolbox mobile-tools"> <div class="rexlive-mobile-block-tools bl_d-flex bl_jc-sb bl_ai-c"> <div class="el-size-viewer tool-indicator"><span class="el-size-viewer__val"></span> <span class="el-size-viewer__um">PX</span></div> <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="Delete block"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div>');
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
  }

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
		console.log( 'Copy row', e.target, e.currentTarget );
		
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
    
    // update the tools
    Rexbuilder_Section_Editor.updateRowTools( $newSection );
    Rexbuilder_Block_Editor.updateBlockToolsOnRow( $newSection );
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
    var newSection = '<section class="rexpansive_section empty-section' + ( new_row_defaults.rowSeparatorTop < 25 ? ' ui-tools--near-top' : '' ) + '" data-rexlive-section-id="' + new_row_defaults.rexID + '" data-rexlive-section-name=""> <div class="section-data" style="display: none;" data-section_name="" data-type="perfect-grid" data-color_bg_section="" data-color_bg_section_active="true"data-dimension="' + new_row_defaults.dimension + '" data-image_bg_section_active="true" data-image_bg_section="" data-id_image_bg_section=""data-video_bg_url_section="" data-video_bg_id_section="" data-video_bg_width_section="" data-video_bg_height_section="" data-video_bg_url_vimeo_section="" data-full_height="' + new_row_defaults.fullHeight + '"data-block_distance="' + new_row_defaults.blockDistance + '" data-layout="' + new_row_defaults.layout + '" data-responsive_background="" data-custom_classes=""data-section_width="' + new_row_defaults.sectionWidth + '" data-row_separator_top="' + new_row_defaults.rowSeparatorTop + '" data-row_separator_bottom="' + new_row_defaults.rowSeparatorBottom + '"data-row_separator_right="' + new_row_defaults.rowSeparatorRight + '" data-row_separator_left="' + new_row_defaults.rowSeparatorLeft + '" data-margin=""data-row_margin_top="" data-row_margin_bottom="" data-row_margin_right="" data-row_margin_left="" data-row_active_photoswipe=""data-row_overlay_color="" data-row_overlay_active="false" data-rexlive_section_id="' + new_row_defaults.rexID + '" data-row_edited_live="true"></div> <div class="responsive-overlay"> <div class="rex-row__dimension ' + new_row_defaults.dimensionClass + '"> <div class="perfect-grid-gallery grid-stack grid-stack-row" data-separator="' + new_row_defaults.blockDistance + '" data-layout="' + new_row_defaults.layout + '"data-full-height="' + new_row_defaults.fullHeight + '" data-row-separator-top="' + new_row_defaults.rowSeparatorTop + '" data-row-separator-right="' + new_row_defaults.rowSeparatorRight + '"data-row-separator-bottom="' + new_row_defaults.rowSeparatorBottom + '" data-row-separator-left="' + new_row_defaults.rowSeparatorLeft + '"> <div class="perfect-grid-sizer"></div> </div> </div> </div> </section>'

    var $newSection = $(newSection);
    var $newSectionData = $newSection.children(".section-data");

		// $newSectionData.after( tmpl("tmpl-toolbox-section", new_row_defaults) );
    $newSectionData.after( '<div class="section-toolBox"><div class="tools"><div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left"><div class="switch-toggle switch-live"><input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-' + new_row_defaults.rexID + '" name="row-dimension-' + new_row_defaults.rexID + '" value="100%"' + ( 'full' == new_row_defaults.dimension ? ' checked' : '' ) + '><label class="tippy" data-tippy-content="Full" for="row-dimension-full-' + new_row_defaults.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B001-Full"></use></svg></i></span></label><input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-' + new_row_defaults.rexID + '" name="row-dimension-' + new_row_defaults.rexID + '" value="80%"' + ( 'boxed' == new_row_defaults.dimension ? ' checked' : '' ) + '><label class="tippy" data-tippy-content="Boxed" for="row-dimension-boxed-' + new_row_defaults.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B002-Boxed"></use></svg></i></span></label></div><div class="switch-toggle switch-live" style="display:none;"><input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-' + new_row_defaults.rexID + '" name="row-layout-' + new_row_defaults.rexID + '" value="fixed"><label class="tippy" data-tippy-content="Grid" for="row-layout-fixed-' + new_row_defaults.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label><input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-' + new_row_defaults.rexID + '" name="row-layout-' + new_row_defaults.rexID + '" value="masonry"><label class="tippy" data-tippy-content="Masonry" for="row-layout-masonry-' + new_row_defaults.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B010-Masonry"></use></svg></i></span></label></div><div class="bl_switch tippy" data-tippy-content="Grid off/on"><label><input class="edit-row-layout-checkbox" type="checkbox"' + ( 'fixed' == new_row_defaults.layout ? ' checked' : '' ) + '><span class="lever"></span><span class="bl_switch__icon"><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label></div><div class="tool-button tool-button--flat tool-button--inline collapse-grid tippy" data-tippy-content="Collapse"><i class="l-svg-icons"><svg><use xlink:href="#B006-Collapse"></use></svg></i></div></div><div class="bl_d-flex bl_ai-c tools-area tool-area--center"><div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="Insert Image"><i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i></div><div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline"><i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i></div> <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button-floating"> <div class="tool-button tool-button--flat active"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="Slider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="Insert Row" data-new-row-position="after"> <i class="l-svg-icons"><svg><use xlink:href="#B016-New-Adjacent-Row"></use></svg></i> </div> </div> </div> </div> <div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side"> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration"> <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="Model"> <span class="unlocked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B015-UnClosed"></use></svg></i> </span> <span class="locked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Image"> <div class="tool-button tool-button--inline edit-row-image-background tippy" data-tippy-content="" value=""> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="Background Video"> <div class="tool-button tool-button--inline tool-button--flat edit-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration"> <div class="tool-button tool-button--flat tool-button--inline builder-copy-row tippy" data-tippy-content="Copy row"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button tool-button--flat tool-button--inline builder-move-row tippy" data-tippy-content="Move row"> <i class="l-svg-icons"><svg><use xlink:href="#B007-Move"></use></svg></i> </div> <div class="tool-button-floating tool-button--model-hide"> <div class="tool-button tool-button--flat tool-button--flat--distance-fix" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="Background Image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="Background Video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="Model"> <i class="l-svg-icons"><svg><use xlink:href="#B005-RexModel"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--flat tool-button--inline builder-delete-row tippy" data-tippy-content="Delete row"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="section-toolBoox__highlight"></div> <div class="section-block-noediting-ui"> <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c"> <span class="call-update-model-button"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> </div>' );
		
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

    Rexbuilder_Section_Editor.updateRowTools( $newSection );
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
    if (Rexbuilder_Util.activeLayout == "default") {
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
    var newSection = '<section class="rexpansive_section empty-section' + ( new_row_defaults.rowSeparatorTop < 25 ? ' ui-tools--near-top' : '' ) + '" data-rexlive-section-id="' + new_row_defaults.rexID + '" data-rexlive-section-name=""> <div class="section-data" style="display: none;" data-section_name="" data-type="perfect-grid" data-color_bg_section="" data-color_bg_section_active="true"data-dimension="' + new_row_defaults.dimension + '" data-image_bg_section_active="true" data-image_bg_section="" data-id_image_bg_section=""data-video_bg_url_section="" data-video_bg_id_section="" data-video_bg_width_section="" data-video_bg_height_section="" data-video_bg_url_vimeo_section="" data-full_height="' + new_row_defaults.fullHeight + '"data-block_distance="' + new_row_defaults.blockDistance + '" data-layout="' + new_row_defaults.layout + '" data-responsive_background="" data-custom_classes=""data-section_width="' + new_row_defaults.sectionWidth + '" data-row_separator_top="' + new_row_defaults.rowSeparatorTop + '" data-row_separator_bottom="' + new_row_defaults.rowSeparatorBottom + '"data-row_separator_right="' + new_row_defaults.rowSeparatorRight + '" data-row_separator_left="' + new_row_defaults.rowSeparatorLeft + '" data-margin=""data-row_margin_top="" data-row_margin_bottom="" data-row_margin_right="" data-row_margin_left="" data-row_active_photoswipe=""data-row_overlay_color="" data-row_overlay_active="false" data-rexlive_section_id="' + new_row_defaults.rexID + '" data-row_edited_live="true"></div> <div class="responsive-overlay"> <div class="rex-row__dimension ' + new_row_defaults.dimensionClass + '"> <div class="perfect-grid-gallery grid-stack grid-stack-row" data-separator="' + new_row_defaults.blockDistance + '" data-layout="' + new_row_defaults.layout + '"data-full-height="' + new_row_defaults.fullHeight + '" data-row-separator-top="' + new_row_defaults.rowSeparatorTop + '" data-row-separator-right="' + new_row_defaults.rowSeparatorRight + '"data-row-separator-bottom="' + new_row_defaults.rowSeparatorBottom + '" data-row-separator-left="' + new_row_defaults.rowSeparatorLeft + '"> <div class="perfect-grid-sizer"></div> </div> </div> </div> </section>';

    var $newSection = $(newSection);
    var $newSectionData = $newSection.children(".section-data");

    // $newSectionData.after(tmpl("tmpl-toolbox-section", new_row_defaults));
    $newSectionData.after( '<div class="section-toolBox"><div class="tools"><div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left"><div class="switch-toggle switch-live"><input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-' + new_row_defaults.rexID + '" name="row-dimension-' + new_row_defaults.rexID + '" value="100%"' + ( 'full' == new_row_defaults.dimension ? ' checked' : '' ) + '><label class="tippy" data-tippy-content="Full" for="row-dimension-full-' + new_row_defaults.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B001-Full"></use></svg></i></span></label><input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-' + new_row_defaults.rexID + '" name="row-dimension-' + new_row_defaults.rexID + '" value="80%"' + ( 'boxed' == new_row_defaults.dimension ? ' checked' : '' ) + '><label class="tippy" data-tippy-content="Boxed" for="row-dimension-boxed-' + new_row_defaults.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B002-Boxed"></use></svg></i></span></label></div><div class="switch-toggle switch-live" style="display:none;"><input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-' + new_row_defaults.rexID + '" name="row-layout-' + new_row_defaults.rexID + '" value="fixed"><label class="tippy" data-tippy-content="Grid" for="row-layout-fixed-' + new_row_defaults.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label><input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-' + new_row_defaults.rexID + '" name="row-layout-' + new_row_defaults.rexID + '" value="masonry"><label class="tippy" data-tippy-content="Masonry" for="row-layout-masonry-' + new_row_defaults.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B010-Masonry"></use></svg></i></span></label></div><div class="bl_switch tippy" data-tippy-content="Grid off/on"><label><input class="edit-row-layout-checkbox" type="checkbox"' + ( 'fixed' == new_row_defaults.layout ? ' checked' : '' ) + '><span class="lever"></span><span class="bl_switch__icon"><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label></div><div class="tool-button tool-button--flat tool-button--inline collapse-grid tippy" data-tippy-content="Collapse"><i class="l-svg-icons"><svg><use xlink:href="#B006-Collapse"></use></svg></i></div></div><div class="bl_d-flex bl_ai-c tools-area tool-area--center"><div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="Insert Image"><i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i></div><div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline"><i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i></div> <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button-floating"> <div class="tool-button tool-button--flat active"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="Slider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="Insert Row" data-new-row-position="after"> <i class="l-svg-icons"><svg><use xlink:href="#B016-New-Adjacent-Row"></use></svg></i> </div> </div> </div> </div> <div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side"> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration"> <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="Model"> <span class="unlocked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B015-UnClosed"></use></svg></i> </span> <span class="locked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Image"> <div class="tool-button tool-button--inline edit-row-image-background tippy" data-tippy-content="" value=""> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="Background Video"> <div class="tool-button tool-button--inline tool-button--flat edit-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration"> <div class="tool-button tool-button--flat tool-button--inline builder-copy-row tippy" data-tippy-content="Copy row"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button tool-button--flat tool-button--inline builder-move-row tippy" data-tippy-content="Move row"> <i class="l-svg-icons"><svg><use xlink:href="#B007-Move"></use></svg></i> </div> <div class="tool-button-floating tool-button--model-hide"> <div class="tool-button tool-button--flat tool-button--flat--distance-fix" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="Background Image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="Background Video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="Model"> <i class="l-svg-icons"><svg><use xlink:href="#B005-RexModel"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--flat tool-button--inline builder-delete-row tippy" data-tippy-content="Delete row"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="section-toolBoox__highlight"></div> <div class="section-block-noediting-ui"> <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c"> <span class="call-update-model-button"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> </div>' );
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

    Rexbuilder_Section_Editor.updateRowTools( $newSection );
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
    $newSectionData.after('<div class="section-toolBox"><div class="tools"><div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left"><div class="switch-toggle switch-live"><input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-" name="row-dimension-" value="100%"><label class="tippy" data-tippy-content="Full" for="row-dimension-full-"><span><i class="l-svg-icons"><svg><use xlink:href="#B001-Full"></use></svg></i></span></label><input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-" name="row-dimension-" value="80%"><label class="tippy" data-tippy-content="Boxed" for="row-dimension-boxed-"><span><i class="l-svg-icons"><svg><use xlink:href="#B002-Boxed"></use></svg></i></span></label></div><div class="switch-toggle switch-live" style="display:none;"><input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-" name="row-layout-" value="fixed"><label class="tippy" data-tippy-content="Grid" for="row-layout-fixed-"><span><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label><input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-" name="row-layout-" value="masonry"><label class="tippy" data-tippy-content="Masonry" for="row-layout-masonry-"><span><i class="l-svg-icons"><svg><use xlink:href="#B010-Masonry"></use></svg></i></span></label></div><div class="bl_switch tippy" data-tippy-content="Grid off/on"><label><input class="edit-row-layout-checkbox" type="checkbox"><span class="lever"></span><span class="bl_switch__icon"><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label></div><div class="tool-button tool-button--flat tool-button--inline collapse-grid tippy" data-tippy-content="Collapse"><i class="l-svg-icons"><svg><use xlink:href="#B006-Collapse"></use></svg></i></div></div><div class="bl_d-flex bl_ai-c tools-area tool-area--center"><div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="Insert Image"><i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i></div><div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline"><i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i></div> <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button-floating"> <div class="tool-button tool-button--flat active"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="Slider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="Insert Row" data-new-row-position="after"> <i class="l-svg-icons"><svg><use xlink:href="#B016-New-Adjacent-Row"></use></svg></i> </div> </div> </div> </div> <div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side"> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration"> <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="Model"> <span class="unlocked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B015-UnClosed"></use></svg></i> </span> <span class="locked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Image"> <div class="tool-button tool-button--inline edit-row-image-background tippy" data-tippy-content="" value=""> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="Background Video"> <div class="tool-button tool-button--inline tool-button--flat edit-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration"> <div class="tool-button tool-button--flat tool-button--inline builder-copy-row tippy" data-tippy-content="Copy row"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button tool-button--flat tool-button--inline builder-move-row tippy" data-tippy-content="Move row"> <i class="l-svg-icons"><svg><use xlink:href="#B007-Move"></use></svg></i> </div> <div class="tool-button-floating tool-button--model-hide"> <div class="tool-button tool-button--flat tool-button--flat--distance-fix" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="Background Image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="Background Video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="Model"> <i class="l-svg-icons"><svg><use xlink:href="#B005-RexModel"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--flat tool-button--inline builder-delete-row tippy" data-tippy-content="Delete row"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="section-toolBoox__highlight"></div> <div class="section-block-noediting-ui"> <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c"> <span class="call-update-model-button"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> </div>');
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
          $newSectionData.after('<div class="section-toolBox"><div class="tools"><div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left"><div class="switch-toggle switch-live"><input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-" name="row-dimension-" value="100%"><label class="tippy" data-tippy-content="Full" for="row-dimension-full-"><span><i class="l-svg-icons"><svg><use xlink:href="#B001-Full"></use></svg></i></span></label><input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-" name="row-dimension-" value="80%"><label class="tippy" data-tippy-content="Boxed" for="row-dimension-boxed-"><span><i class="l-svg-icons"><svg><use xlink:href="#B002-Boxed"></use></svg></i></span></label></div><div class="switch-toggle switch-live" style="display:none;"><input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-" name="row-layout-" value="fixed"><label class="tippy" data-tippy-content="Grid" for="row-layout-fixed-"><span><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label><input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-" name="row-layout-" value="masonry"><label class="tippy" data-tippy-content="Masonry" for="row-layout-masonry-"><span><i class="l-svg-icons"><svg><use xlink:href="#B010-Masonry"></use></svg></i></span></label></div><div class="bl_switch tippy" data-tippy-content="Grid off/on"><label><input class="edit-row-layout-checkbox" type="checkbox"><span class="lever"></span><span class="bl_switch__icon"><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label></div><div class="tool-button tool-button--flat tool-button--inline collapse-grid tippy" data-tippy-content="Collapse"><i class="l-svg-icons"><svg><use xlink:href="#B006-Collapse"></use></svg></i></div></div><div class="bl_d-flex bl_ai-c tools-area tool-area--center"><div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="Insert Image"><i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i></div><div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline"><i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i></div> <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button-floating"> <div class="tool-button tool-button--flat active"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="Slider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="Insert Row" data-new-row-position="after"> <i class="l-svg-icons"><svg><use xlink:href="#B016-New-Adjacent-Row"></use></svg></i> </div> </div> </div> </div> <div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side"> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration"> <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="Model"> <span class="unlocked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B015-UnClosed"></use></svg></i> </span> <span class="locked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Image"> <div class="tool-button tool-button--inline edit-row-image-background tippy" data-tippy-content="" value=""> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="Background Video"> <div class="tool-button tool-button--inline tool-button--flat edit-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration"> <div class="tool-button tool-button--flat tool-button--inline builder-copy-row tippy" data-tippy-content="Copy row"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button tool-button--flat tool-button--inline builder-move-row tippy" data-tippy-content="Move row"> <i class="l-svg-icons"><svg><use xlink:href="#B007-Move"></use></svg></i> </div> <div class="tool-button-floating tool-button--model-hide"> <div class="tool-button tool-button--flat tool-button--flat--distance-fix" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="Background Image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="Background Video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="Model"> <i class="l-svg-icons"><svg><use xlink:href="#B005-RexModel"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--flat tool-button--inline builder-delete-row tippy" data-tippy-content="Delete row"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="section-toolBoox__highlight"></div> <div class="section-block-noediting-ui"> <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c"> <span class="call-update-model-button"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> </div>');
          var $buttonModel = $newSection.find(".update-model-button");
          Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);

          var $row = $newSection.find(".grid-stack-row");

					$row.perfectGridGalleryEditor({editorMode:true});
					
					var $buttonsWrappers = $row.find('.rex-button-wrapper');
					_replaceRexButtons($row, $buttonsWrappers, response);

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
	 * Replaces RexButtons in the model with 
	 */
	function _replaceRexButtons($row, $buttonsWrappers, response) {
		// Keeping jQuery for consistency motivations
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
          $newSectionData.after('<div class="section-toolBox"><div class="tools"><div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left"><div class="switch-toggle switch-live"><input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-' + newSectionID + '" name="row-dimension-' + newSectionID + '" value="100%"><label class="tippy" data-tippy-content="Full" for="row-dimension-full-' + newSectionID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B001-Full"></use></svg></i></span></label><input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-' + newSectionID + '" name="row-dimension-' + newSectionID + '" value="80%"><label class="tippy" data-tippy-content="Boxed" for="row-dimension-boxed-' + newSectionID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B002-Boxed"></use></svg></i></span></label></div><div class="switch-toggle switch-live" style="display:none;"><input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-' + newSectionID + '" name="row-layout-' + newSectionID + '" value="fixed"><label class="tippy" data-tippy-content="Grid" for="row-layout-fixed-' + newSectionID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label><input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-' + newSectionID + '" name="row-layout-' + newSectionID + '" value="masonry"><label class="tippy" data-tippy-content="Masonry" for="row-layout-masonry-' + newSectionID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B010-Masonry"></use></svg></i></span></label></div><div class="bl_switch tippy" data-tippy-content="Grid off/on"><label><input class="edit-row-layout-checkbox" type="checkbox"><span class="lever"></span><span class="bl_switch__icon"><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label></div><div class="tool-button tool-button--flat tool-button--inline collapse-grid tippy" data-tippy-content="Collapse"><i class="l-svg-icons"><svg><use xlink:href="#B006-Collapse"></use></svg></i></div></div><div class="bl_d-flex bl_ai-c tools-area tool-area--center"><div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="Insert Image"><i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i></div><div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline"><i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i></div> <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button-floating"> <div class="tool-button tool-button--flat active"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="Slider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="Insert Row" data-new-row-position="after"> <i class="l-svg-icons"><svg><use xlink:href="#B016-New-Adjacent-Row"></use></svg></i> </div> </div> </div> </div> <div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side"> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration"> <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="Model"> <span class="unlocked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B015-UnClosed"></use></svg></i> </span> <span class="locked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Image"> <div class="tool-button tool-button--inline edit-row-image-background tippy" data-tippy-content="" value=""> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="Background Video"> <div class="tool-button tool-button--inline tool-button--flat edit-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration"> <div class="tool-button tool-button--flat tool-button--inline builder-copy-row tippy" data-tippy-content="Copy row"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button tool-button--flat tool-button--inline builder-move-row tippy" data-tippy-content="Move row"> <i class="l-svg-icons"><svg><use xlink:href="#B007-Move"></use></svg></i> </div> <div class="tool-button-floating tool-button--model-hide"> <div class="tool-button tool-button--flat tool-button--flat--distance-fix" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="Background Image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="Background Video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="Model"> <i class="l-svg-icons"><svg><use xlink:href="#B005-RexModel"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--flat tool-button--inline builder-delete-row tippy" data-tippy-content="Delete row"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="section-toolBoox__highlight"></div> <div class="section-block-noediting-ui"> <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c"> <span class="call-update-model-button"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> </div>');

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

    var sections = Rexbuilder_Util.rexContainer.querySelectorAll('.rexpansive_section');
    var section;
    var sectionID;

    var tot_sections = sections.length;
    var i = 0;
    for (; i < tot_sections; i++) {
      section = sections[i];

      sectionID = section.getAttribute('data-rexlive-section-id');
      new_row_defaults.rexID = sectionID;

      var string = '<div class="section-toolBox"><div class="tools"><div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left"><div class="switch-toggle switch-live"><input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-' + section.rexID + '" name="row-dimension-' + section.rexID + '" value="100%"' + ( 'full' == section.dimension ? ' checked' : '' ) + '><label class="tippy" data-tippy-content="Full" for="row-dimension-full-' + section.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B001-Full"></use></svg></i></span></label><input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-' + section.rexID + '" name="row-dimension-' + section.rexID + '" value="80%"' + ( 'boxed' == section.dimension ? ' checked' : '' ) + '><label class="tippy" data-tippy-content="Boxed" for="row-dimension-boxed-' + section.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B002-Boxed"></use></svg></i></span></label></div><div class="switch-toggle switch-live" style="display:none;"><input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-' + section.rexID + '" name="row-layout-' + section.rexID + '" value="fixed"><label class="tippy" data-tippy-content="Grid" for="row-layout-fixed-' + section.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label><input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-' + section.rexID + '" name="row-layout-' + section.rexID + '" value="masonry"><label class="tippy" data-tippy-content="Masonry" for="row-layout-masonry-' + section.rexID + '"><span><i class="l-svg-icons"><svg><use xlink:href="#B010-Masonry"></use></svg></i></span></label></div><div class="bl_switch tippy" data-tippy-content="Grid off/on"><label><input class="edit-row-layout-checkbox" type="checkbox"' + ( 'fixed' == section.layout ? ' checked' : '' ) + '><span class="lever"></span><span class="bl_switch__icon"><i class="l-svg-icons"><svg><use xlink:href="#B017-Grid-Layout"></use></svg></i></span></label></div><div class="tool-button tool-button--flat tool-button--inline collapse-grid tippy" data-tippy-content="Collapse"><i class="l-svg-icons"><svg><use xlink:href="#B006-Collapse"></use></svg></i></div></div><div class="bl_d-flex bl_ai-c tools-area tool-area--center"><div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="Insert Image"><i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i></div><div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline"><i class="l-svg-icons"><svg><use xlink:href="#B003-Text"></use></svg></i></div> <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button-floating"> <div class="tool-button tool-button--flat active"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="Slider"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-RexSlider"></use></svg></i> </div> <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="Insert Row" data-new-row-position="after"> <i class="l-svg-icons"><svg><use xlink:href="#B016-New-Adjacent-Row"></use></svg></i> </div> </div> </div> </div> <div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side"> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration"> <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="Model"> <span class="unlocked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B015-UnClosed"></use></svg></i> </span> <span class="locked-icon"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Image"> <div class="tool-button tool-button--inline edit-row-image-background tippy" data-tippy-content="" value=""> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value=""> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="Background Video"> <div class="tool-button tool-button--inline tool-button--flat edit-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration"> <div class="tool-button tool-button--flat tool-button--inline builder-copy-row tippy" data-tippy-content="Copy row"> <i class="l-svg-icons"><svg><use xlink:href="#Z004-Copy"></use></svg></i> </div> <div class="tool-button tool-button--flat tool-button--inline builder-move-row tippy" data-tippy-content="Move row"> <i class="l-svg-icons"><svg><use xlink:href="#B007-Move"></use></svg></i> </div> <div class="tool-button-floating tool-button--model-hide"> <div class="tool-button tool-button--flat tool-button--flat--distance-fix" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z009-More"></use></svg></i> </div> <div class="tool-button_list"> <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="Row settings"> <i class="l-svg-icons"><svg><use xlink:href="#Z005-Setting"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="Background Image"> <i class="l-svg-icons"><svg><use xlink:href="#Z002-Image-Full"></use></svg></i> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Background Color"> <input class="spectrum-input-element" type="text" name="edit-row-color-background"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="Overlay"> <input class="spectrum-input-element" type="text" name="edit-row-overlay-color"> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div> <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div> </div> <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="Background Video"> <i class="l-svg-icons"><svg><use xlink:href="#Z006-Video"></use></svg></i> </div> <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="Model"> <i class="l-svg-icons"><svg><use xlink:href="#B005-RexModel"></use></svg></i> </div> </div> </div> <div class="tool-button tool-button--flat tool-button--inline builder-delete-row tippy" data-tippy-content="Delete row"> <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i> </div> </div> </div> </div> </div> <div class="section-toolBoox__highlight"></div> <div class="section-block-noediting-ui"> <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c"> <span class="call-update-model-button"><i class="l-svg-icons"><svg><use xlink:href="#B014-Closed"></use></svg></i> </span> </div> </div>';

      $(section).prepend(string);
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
            // .prepend(tmpl("tmpl-div-block-grid", {}));
            .prepend('<div class="rexpansive-block-grid"></div>');
          $section
            .find(".section-toolBox")
            .parent()
            // .prepend(tmpl("tmpl-div-block-section-toolbox", {}));
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
		
    // console.log('_prependToolBox')
		// _prependToolBox()
    console.log('_prependToolBoxVanilla')
    _prependToolBoxVanilla();
		
    // linking listeners to row setting buttons
    _addSectionToolboxListeners();
  };

  return {
    init: init,
    prepareSectionCopied: _prepareSectionCopied,
    showSectionToolBox: _showSectionToolBox,
    // hideSectionToolBox: _hideSectionToolBox,
    // linkHoverSection: _linkHoverSection,
    updateModelsHtmlLive: _updateModelsHtmlLive,
    fixSectionToolbox : _fixSectionToolbox,
    fixBlockToolsAccordingToSeparator: _fixBlockToolsAccordingToSeparator
  };
})(jQuery);
