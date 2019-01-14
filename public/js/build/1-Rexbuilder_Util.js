var Rexbuilder_Util = (function($) {
  "use strict";

  var $window = $(window);

  var fixSectionWidth = 0;
  var editorMode = false;
  var windowIsResizing = false;
  var responsiveLayouts;
  var defaultLayoutSections;
  var $modelsCustomizationsDataDiv;
  var $pageCustomizationsDataDiv;
  var $liveDataContainer;
  var $layoutsDomOrder;
  var $defaultLayoutState;
  var $usedIDSContainer;
  var sectionIDSused;
  var frontAvailableLayouts;
  var startFrontLayout;
  var changedFrontLayout;

  var createRandomID = function(n) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  var _storeNamesUsed = function() {
    sectionIDSused = ( $usedIDSContainer.length > 0 ? JSON.parse($usedIDSContainer.text()) : [] );
  };

  var _saveSectionNamesUsed = function() {
    $usedIDSContainer.text(JSON.stringify(sectionIDSused));
  };

  var _getSectionNamesUsed = function() {
    return sectionIDSused;
  };

  var _addSectionID = function(rex_id) {
    var i;
    for (i = sectionIDSused.length - 1; i >= 0; i--) {
      if (rex_id == sectionIDSused[i]) {
        break;
      }
    }
    if (i == -1) {
      sectionIDSused.push(rex_id);
    }
  };

  var _removeSectionID = function(rex_id) {
    var i = 0;
    for (i = sectionIDSused.length - 1; i >= 0; i--) {
      if (rex_id == sectionIDSused[i]) {
        break;
      }
    }
    if (i > -1) {
      sectionIDSused.splice(i, 1);
      _saveSectionNamesUsed();
    }
  };

  var _createSectionID = function() {
    console.log("creating new id");
    var id;
    var flag;
    var idLength = 4;
    var i;
    do {
      flag = true;
      id = createRandomID(idLength);
      if (id == "self") {
        flag = false;
      } else {
        for (i = 0; i < sectionIDSused.length; i++) {
          if (id == sectionIDSused[i]) {
            flag = false;
            break;
          }
        }
      }
    } while (!flag);

    _addSectionID(id);

    return id;
  };

  var createBlockID = function() {
    var id;
    var flag;
    var idLength = 4;
    var $this;

    do {
      flag = true;
      id = createRandomID(idLength);
      if (id == "self") {
        flag = false;
      } else {
        Rexbuilder_Util.$rexContainer.find(".grid-stack-item").each(function() {
          $this = $(this);
          if (
            $this.attr("data-rexbuilder-block-id") !== undefined &&
            $this.attr("data-rexbuilder-block-id") == id
          ) {
            flag = false;
          }
        });
      }
    } while (!flag);
    return id;
  };

  var _updateSectionsID = function() {
    var id;
    var $sec;
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function(i, e) {
        $sec = $(e);
        if (
          typeof $sec.attr("data-rexlive-section-id") === "undefined" ||
          $sec.attr("data-rexlive-section-id") == ""
        ) {
          id = _createSectionID();
          $sec.attr("data-rexlive-section-id", id);
        }
      });
  };

  var _updateSectionsNumber = function() {
    var last = -1;
    var $sec;
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function(i, sec) {
        $sec = $(sec);
        $sec.attr("data-rexlive-section-number", i);
        last = i;
      });
    Rexbuilder_Util.lastSectionNumber = last;
  };

  var _findLayoutType = function(name) {
    if (name == "default" || name == "tablet" || name == "mobile") {
      return "standard";
    }
    return "custom";
  };

  /**
   * Calculating the actual layout based on the device size
   * @since 2.0.0
   */
  var _findFrontLayout = function() {
    var dev_w = _viewport().width;
    for( var i=frontAvailableLayouts.length-1; i >= 0; i-- ) {
      if(dev_w >= parseInt(frontAvailableLayouts[i].min) && ( "" != frontAvailableLayouts[i].max ? dev_w <= parseInt(frontAvailableLayouts[i].max) : true ) ) {
        return frontAvailableLayouts[i].id;
      }
    }
  };

  var _getModelsCustomizations = function() {
    var data = [];
    $modelsCustomizationsDataDiv
      .children(".model-customizations-container")
      .each(function(i, modelData) {
        var $modelData = $(modelData);
        var modelID = parseInt($modelData.attr("data-model-id"));
        var customizations = [];
        $modelData
          .children(".model-customization-data")
          .each(function(j, modelCustomization) {
            var $modelCustomization = $(modelCustomization);
            var customizationName = $modelCustomization.attr(
              "data-model-layout-name"
            );
            var customizationTargets = JSON.parse($modelCustomization.text());
            var customization = {
              name: customizationName,
              targets: customizationTargets
            };
            customizations.push(customization);
          });
        var modelCustomizations = {
          id: modelID,
          customizations: customizations
        };
        data.push(modelCustomizations);
      });
    return data;
  };

  var _updateModelsCustomizationsData = function(
    updatedModelCustomizationsData
  ) {
    var i;
    var model_ID_to_update = updatedModelCustomizationsData.id;
    var $modelDataDiv = $modelsCustomizationsDataDiv.children(
      '.model-customizations-container[data-model-id="' +
        model_ID_to_update +
        '"]'
    );

    if ($modelDataDiv.length != 0) {
      $modelDataDiv.children(".model-customization-data").remove();
    } else {
      $modelDataDiv = $(document.createElement("div"));
      $modelDataDiv.addClass("model-customizations-container");
      $modelDataDiv.attr("data-model-id", model_ID_to_update);
      $modelDataDiv.appendTo($modelsCustomizationsDataDiv[0]);
    }

    for (i = 0; i < updatedModelCustomizationsData.customizations.length; i++) {
      var $div = $(document.createElement("div"));
      $div.addClass("model-customization-data");
      $div.attr(
        "data-model-layout-name",
        updatedModelCustomizationsData.customizations[i].name
      );
      $div.text(
        JSON.stringify(updatedModelCustomizationsData.customizations[i].targets)
      );
      $div.appendTo($modelDataDiv[0]);
    }
    $modelsCustomizationsDataDiv.attr(
      "data-empty-models-customizations",
      false
    );
  };

  var _updateDivModelCustomizationsNames = function(
    updatedModelCustomizationsNames
  ) {
    var $modelsAvaiableNamesDiv = $(
      "#rexbuilder-model-data .available-models-customizations-names"
    );
    var names = JSON.parse($modelsAvaiableNamesDiv.text());
    var newNamesData = [];
    var i;

    for (i = 0; i < names.length; i++) {
      var namesData = names[i];
      if (namesData.id != updatedModelCustomizationsNames.id) {
        newNamesData.push(namesData);
      }
    }

    newNamesData.push(updatedModelCustomizationsNames);
    $modelsAvaiableNamesDiv.text(JSON.stringify(newNamesData));
  };

  // returns customizations
  var _getPageCustomizations = function() {
    var data = [];

    var defaultLayout = {
      name: "default",
      sections: []
    };

    var $pageDefaultLayoutWrapper = $pageCustomizationsDataDiv.children(
      '.customization-wrap[data-customization-name="default"]'
    );
    $pageDefaultLayoutWrapper
      .children(".section-targets")
      .each(function(j, sectionTargetsElem) {
        var $sectionTargetsElem = $(sectionTargetsElem);
        var sectionRexID = $sectionTargetsElem.attr("data-section-rex-id");
        var modelID = isNaN(parseInt($sectionTargetsElem.attr("data-model-id")))
          ? -1
          : parseInt($sectionTargetsElem.attr("data-model-id"));
        var modelNumber = isNaN(
          parseInt($sectionTargetsElem.attr("data-model-number"))
        )
          ? -1
          : parseInt($sectionTargetsElem.attr("data-model-number"));
        var hideSection =
          typeof $sectionTargetsElem.attr("data-section-hide") == "undefined"
            ? false
            : $sectionTargetsElem.attr("data-section-hide").toString() == "1"
              ? true
              : false;
        var targets =
          $sectionTargetsElem.text() != ""
            ? JSON.parse($sectionTargetsElem.text())
            : [];

        defaultLayout.sections.push({
          section_rex_id: sectionRexID,
          section_model_id: modelID != -1 ? modelID : "",
          section_model_number: modelNumber != -1 ? modelNumber : "",
          section_is_model: modelID != -1,
          section_hide: hideSection,
          targets: targets
        });
      });

    data.push(defaultLayout);

    $pageCustomizationsDataDiv
      .children('.customization-wrap:not([data-customization-name="default"])')
      .each(function(i, customizationWrap) {
        var $customizationWrap = $(customizationWrap);
        var customizationName = $customizationWrap.attr(
          "data-customization-name"
        );
        var layoutCustomization = {
          name: customizationName,
          sections: []
        };

        $customizationWrap
          .children(".section-targets")
          .each(function(j, sectionTargetsElem) {
            var $sectionTargetsElem = $(sectionTargetsElem);
            var sectionRexID = $sectionTargetsElem.attr("data-section-rex-id");
            var modelID = isNaN(
              parseInt($sectionTargetsElem.attr("data-model-id"))
            )
              ? -1
              : parseInt($sectionTargetsElem.attr("data-model-id"));
            var modelNumber = isNaN(
              parseInt($sectionTargetsElem.attr("data-model-number"))
            )
              ? -1
              : parseInt($sectionTargetsElem.attr("data-model-number"));
            var hideSection =
              typeof $sectionTargetsElem.attr("data-section-hide") ==
              "undefined"
                ? false
                : $sectionTargetsElem.attr("data-section-hide").toString() ==
                  "1"
                  ? true
                  : false;
            var targets =
              $sectionTargetsElem.text() != ""
                ? JSON.parse($sectionTargetsElem.text())
                : [];
            var section_created_live =
              typeof $sectionTargetsElem.attr("data-section-created-live") ==
              "undefined"
                ? false
                : $sectionTargetsElem
                    .attr("data-section-created-live")
                    .toString() == "1"
                  ? true
                  : false;
            layoutCustomization.sections.push({
              section_rex_id: sectionRexID,
              section_model_id: modelID != -1 ? modelID : "",
              section_model_number: modelNumber != -1 ? modelNumber : "",
              section_is_model: modelID != -1,
              section_hide: hideSection,
              section_created_live: section_created_live,
              targets: targets
            });
          });
        data.push(layoutCustomization);
      });

    return data;
  };

  var _createPageCustomizationsDataLive = function(sectionsData) {
    $liveDataContainer.children().remove();
    var i;
    for (i = 0; i < sectionsData.length; i++) {
      var $div = $(document.createElement("div"));
      $div.addClass("section-targets");
      $div.attr("data-section-rex-id", sectionsData[i].section_rex_id);
      $div.attr("data-model-id", sectionsData[i].section_model_id);
      $div.attr("data-model-number", sectionsData[i].section_model_number);
      $div.attr("data-section-hide", sectionsData[i].section_hide);
      $div.text(JSON.stringify(sectionsData[i].targets));
      $div.appendTo($liveDataContainer[0]);
    }
  };

  var _updatePageCustomizationsData = function(updatedPageCustomizationsData) {
    var layoutNameToUpdate = updatedPageCustomizationsData.name;
    var $customizationWrapper = $pageCustomizationsDataDiv.children(
      '.customization-wrap[data-customization-name="' +
        layoutNameToUpdate +
        '"]'
    );
    var i;

    if ($customizationWrapper.length != 0) {
      $customizationWrapper.children(".section-targets").remove();
    } else {
      $customizationWrapper = $(document.createElement("div"));
      $customizationWrapper.addClass("customization-wrap");
      $customizationWrapper.attr("data-customization-name", layoutNameToUpdate);
      $customizationWrapper.appendTo($pageCustomizationsDataDiv[0]);
    }

    for (i = 0; i < updatedPageCustomizationsData.sections.length; i++) {
      var $div = $(document.createElement("div"));
      $div.addClass("section-targets");
      $div.attr(
        "data-section-rex-id",
        updatedPageCustomizationsData.sections[i].section_rex_id
      );
      $div.attr(
        "data-model-id",
        updatedPageCustomizationsData.sections[i].section_model_id
      );
      $div.attr(
        "data-model-number",
        updatedPageCustomizationsData.sections[i].section_model_number
      );
      $div.attr(
        "data-section-hide",
        updatedPageCustomizationsData.sections[i].section_hide
      );
      $div.attr(
        "data-section-created-live",
        updatedPageCustomizationsData.sections[
          i
        ].section_created_live.toString() == "true"
          ? "1"
          : false
      );
      if (updatedPageCustomizationsData.sections[i].section_model_id == "") {
        $div.text(
          JSON.stringify(updatedPageCustomizationsData.sections[i].targets)
        );
      }
      $div.appendTo($customizationWrapper[0]);
    }
    $pageCustomizationsDataDiv.removeAttr("data-empty-customizations");
  };

  var _updatePageAvaiableLayoutsNames = function(updatedNames) {
    var $pageLayoutsNamesDiv = $(
      "#rexbuilder-layout-data .available-layouts-names"
    );
    $pageLayoutsNamesDiv.text(JSON.stringify(updatedNames));
  };

  var _getSectionCustomLayouts = function(sectionRexID) {
    var layouts = [];

    var pageCustomizations = Rexbuilder_Util.getPageCustomizations();
    var i, j;

    for (i = 0; i < pageCustomizations.length; i++) {
      var layoutName = pageCustomizations[i].name;
      if (pageCustomizations[i].sections != null) {
        for (j = 0; j < pageCustomizations[i].sections.length; j++) {
          if (
            pageCustomizations[i].sections[j].section_rex_id == sectionRexID
          ) {
            var targets = jQuery.extend(
              true,
              [],
              pageCustomizations[i].sections[j].targets
            );
            var customization = {
              name: layoutName,
              targets: targets
            };
            layouts.push(customization);
          }
        }
      }
    }
    return layouts;
  };

  var chooseLayout = function() {
    var $responsiveData = $("#rexbuilder-layout-data");
    var $modelData = $("#rexbuilder-model-data");

    Rexbuilder_Util.chosenLayoutData = {
      min: 0,
      max: "",
      id: "default",
      label: "My Desktop",
      type: "standard"
    };

    if (
      $responsiveData
        .children(".layouts-data")
        .attr("data-empty-customizations") == "true" ||
      (Rexbuilder_Util.editorMode && Rexbuilder_Util.firstStart)
    ) {
      return "default";
    }

    var windowWidth = _viewport().width;
    var i, j, k;
    var $availableDims = $("#layout-avaiable-dimensions");
    var allLayoutsDimensions = ( $availableDims.length > 0 ? JSON.parse( $availableDims.text() ) : [] );
    var $availableModelsNames = $modelData.children(".available-models-customizations-names");
    var allModelsCustomizationsNames = ( $availableModelsNames.length > 0 ? JSON.parse( $availableModelsNames.text() ) : [] );
    var $availableLayoutNames = $responsiveData.children(".available-layouts-names");
    var avaiableNames = ( $availableLayoutNames.length > 0 ? JSON.parse( $availableLayoutNames.text() ) : [] );

    var layoutsPageNames = [];
    var flag_insert;

    for (i = 0; i < allLayoutsDimensions.length; i++) {
      flag_insert = false;
      //modelli
      for (j = 0; j < allModelsCustomizationsNames.length; j++) {
        for (k = 0; k < allModelsCustomizationsNames[j].names.length; k++) {
          if (
            allLayoutsDimensions[i].id ==
            allModelsCustomizationsNames[j].names[k]
          ) {
            var dim = allLayoutsDimensions[i];
            dim.model = true;
            flag_insert = true;
            layoutsPageNames.push(dim);
          }
        }
      }
      if (!flag_insert) {
        for (k = 0; k < avaiableNames.length; k++) {
          if (allLayoutsDimensions[i].id == avaiableNames[k]) {
            var dim = allLayoutsDimensions[i];
            dim.model = false;
            flag_insert = true;
            layoutsPageNames.push(dim);
          }
        }
      }
    }

    for (i = 0; i < layoutsPageNames.length; i++) {
      if (layoutsPageNames[i].min == "") {
        layoutsPageNames[i].min = 0;
      }
    }

    var selectedLayoutName = "";
    var ordered = lodash.sortBy(layoutsPageNames, [
      function(o) {
        return parseInt(o.min);
      }
    ]);

    for (i = 0; i < ordered.length; i++) {
      if (windowWidth >= ordered[i].min) {
        if (ordered[i].max != "") {
          if (windowWidth < ordered[i].max) {
            selectedLayoutName = ordered[i].id;
            Rexbuilder_Util.chosenLayoutData = ordered[i];
          }
        } else {
          selectedLayoutName = ordered[i].id;
          Rexbuilder_Util.chosenLayoutData = ordered[i];
        }
      }
    }

    if (selectedLayoutName === "") {
      selectedLayoutName = "default";
    }

    return selectedLayoutName;
  };

  var _createEmptyTargets = function(targetsToEmpty) {
    var emptyTargets = [];
    var i;
    for (i = 0; i < targetsToEmpty.length; i++) {
      var emptyTarget = {
        name: targetsToEmpty[i].name,
        props: {}
      };
      if (
        targetsToEmpty[i].name == "self" &&
        _viewport().width <
          _plugin_frontend_settings.defaultSettings.collapseWidth
      ) {
        emptyTarget.props.collapse_grid = true;
      }
      emptyTargets.push(emptyTarget);
    }
    return emptyTargets;
  };

  //creating default page layout, merging with models default layout
  var _getDefaultPageLayout = function(layoutDataPage, layoutDataModels) {
    var defaultLayoutSections = [];
    var i, j, p, q;
    for (i = 0; i < layoutDataPage.length; i++) {
      if (layoutDataPage[i].name == "default") {
        for (j = 0; j < layoutDataPage[i].sections.length; j++) {
          defaultLayoutSections.push(
            jQuery.extend(true, {}, layoutDataPage[i].sections[j])
          );
        }
        break;
      }
    }

    for (i = 0; i < defaultLayoutSections.length; i++) {
      if (defaultLayoutSections[i].section_is_model.toString() == "true") {
        for (p = 0; p < layoutDataModels.length; p++) {
          if (
            layoutDataModels[p].id == defaultLayoutSections[i].section_model_id
          ) {
            for (q = 0; q < layoutDataModels[p].customizations.length; q++) {
              if (layoutDataModels[p].customizations[q].name == "default") {
                defaultLayoutSections[i].targets = jQuery.extend(
                  true,
                  [],
                  layoutDataModels[p].customizations[q].targets
                );
                break;
              }
            }
            break;
          }
        }
      }
    }

    return defaultLayoutSections;
  };

  var _getDefaultModelsLayout = function(layoutDataModels) {
    var i, j;
    var data = [];
    for (i = 0; i < layoutDataModels.length; i++) {
      for (j = 0; j < layoutDataModels[i].customizations.length; j++) {
        if (layoutDataModels[i].customizations[j].name == "default") {
          data.push({
            id: layoutDataModels[i].id,
            targets: layoutDataModels[i].customizations[j].targets
          });
          break;
        }
      }
    }
    return data;
  };

  var _getCustomLayoutSections = function(
    layoutDataPage,
    layoutDataModels,
    defaultLayoutSections,
    layoutName
  ) {
    if (layoutName == "default") {
      return defaultLayoutSections;
    }

    var layoutSelectedSections = [];
    var i, j, p, q;
    var flagCustomLayoutPage = false;
    var defaultDataModels = _getDefaultModelsLayout(layoutDataModels);
    var modelCustomization;

    for (i = 0; i < layoutDataPage.length; i++) {
      if (layoutDataPage[i].name == layoutName) {
        flagCustomLayoutPage = true;
        for (j = 0; j < layoutDataPage[i].sections.length; j++) {
          layoutSelectedSections.push(
            jQuery.extend(true, {}, layoutDataPage[i].sections[j])
          );
        }
        break;
      }
    }

    //means that this page has no custom layout
    if (!flagCustomLayoutPage) {
      for (i = 0; i < defaultLayoutSections.length; i++) {
        var newCustomSection = jQuery.extend(
          true,
          {},
          defaultLayoutSections[i]
        );
        newCustomSection.targets = _createEmptyTargets(
          defaultLayoutSections[i].targets
        );
        newCustomSection.sectionCleared = true;
        layoutSelectedSections.push(newCustomSection);
      }
    }

    //fixing models custom layouts and empty targets
    for (i = 0; i < layoutSelectedSections.length; i++) {
      if (layoutSelectedSections[i].section_is_model.toString() == "true") {
        for (p = 0; p < layoutDataModels.length; p++) {
          if (
            layoutDataModels[p].id == layoutSelectedSections[i].section_model_id
          ) {
            modelCustomization = false;
            for (q = 0; q < layoutDataModels[p].customizations.length; q++) {
              if (layoutDataModels[p].customizations[q].name == layoutName) {
                modelCustomization = true;
                layoutSelectedSections[i].targets = jQuery.extend(
                  true,
                  [],
                  layoutDataModels[p].customizations[q].targets
                );
                layoutSelectedSections[i].defaultSection = false;
                layoutSelectedSections[i].sectionCleared = false;
                break;
              }
            }
            if (!modelCustomization) {
              for (q = 0; q < defaultDataModels.length; q++) {
                if (
                  layoutSelectedSections[i].section_model_id ==
                  defaultDataModels[q].id
                ) {
                  layoutSelectedSections[i].targets = _createEmptyTargets(
                    defaultDataModels[q].targets
                  );
                  layoutSelectedSections[i].sectionCleared = true;
                  break;
                }
              }
            }
            break;
          }
        }
      } else {
        if (layoutSelectedSections[i].targets.length == 0) {
          for (j = 0; j < defaultLayoutSections.length; j++) {
            if (
              layoutSelectedSections[i].section_rex_id ==
              defaultLayoutSections[j].section_rex_id
            ) {
              layoutSelectedSections[i].targets = _createEmptyTargets(
                defaultLayoutSections[j].targets
              );
              layoutSelectedSections[i].sectionCleared = true;
              break;
            }
          }
        }
      }
    }
    return layoutSelectedSections;
  };

  var _mergeSections = function(layoutSelectedSections, defaultLayoutSections) {
    var i, j, m, n;
    var targetFounded;
    // merging custom data with default data
    // console.log(
    //   "layoutSelectedSections",
    //   jQuery.extend(true, [], layoutSelectedSections)
    // );
    // console.log(
    //   "defaultLayoutSections",
    //   jQuery.extend(true, [], defaultLayoutSections)
    // );
    if (Rexbuilder_Util.activeLayout != "default") {
      for (i = 0; i < layoutSelectedSections.length; i++) {
        layoutSelectedSections[i].sectionFounded = false;
        layoutSelectedSections[i].defaultSection = false;
        for (j = 0; j < defaultLayoutSections.length; j++) {
          if (
            layoutSelectedSections[i].section_rex_id ==
            defaultLayoutSections[j].section_rex_id
          ) {
            layoutSelectedSections[i].sectionFounded = true;
            var sectionCustom = layoutSelectedSections[i];
            var sectionDefault = defaultLayoutSections[j];
            if (
              typeof sectionCustom.targets[0] == "undefined" ||
              jQuery.isEmptyObject(sectionCustom.targets[0].props) ||
              (typeof sectionCustom.sectionCleared != "undefined" &&
                sectionCustom.sectionCleared)
            ) {
              sectionCustom.defaultSection = true;
              sectionCustom.targets = jQuery.extend(
                true,
                [],
                sectionDefault.targets
              );
            }

            for (m = 0; m < sectionCustom.targets.length; m++) {
              targetFounded = false;
              for (n = 0; n < sectionDefault.targets.length; n++) {
                if (
                  sectionCustom.targets[m].name ==
                  sectionDefault.targets[n].name
                ) {
                  sectionCustom.targets[m].notDisplay = false;
                  targetFounded = true;
                  sectionDefault.targets[n].oldElement = true;

                  //fixing dimensions of new blocks in custom layout
                  if (
                    m >= 1 &&
                    jQuery.isEmptyObject(sectionCustom.targets[m].props)
                  ) {
                    if (Rexbuilder_Util.activeLayout != "default") {
                      if (
                        sectionDefault.targets[0].props.layout !=
                        sectionCustom.targets[0].props["layout"]
                      ) {
                        var cellWidth = parseFloat(
                          sectionDefault.targets[0].props.grid_cell_width
                        );
                        var cellHeightMasonry = 5;
                        if (
                          sectionDefault.targets[0].props.layout == "masonry"
                        ) {
                          sectionCustom.targets[m].props.gs_y = Math.round(
                            (sectionDefault.targets[n].props.gs_y *
                              cellHeightMasonry) /
                              cellWidth
                          );
                          sectionCustom.targets[m].props.gs_height = Math.round(
                            (sectionDefault.targets[n].props.gs_height *
                              cellHeightMasonry) /
                              cellWidth
                          );
                          sectionCustom.targets[
                            m
                          ].props.gs_start_h = Math.round(
                            (sectionDefault.targets[n].props.gs_start_h *
                              cellHeightMasonry) /
                              cellWidth
                          );
                        } else {
                          sectionCustom.targets[m].props.gs_y = Math.round(
                            (sectionDefault.targets[n].props.gs_y * cellWidth) /
                              cellHeightMasonry
                          );
                          sectionCustom.targets[m].props.gs_height = Math.round(
                            (sectionDefault.targets[n].props.gs_height *
                              cellWidth) /
                              cellHeightMasonry
                          );
                          sectionCustom.targets[
                            m
                          ].props.gs_start_h = Math.round(
                            (sectionDefault.targets[n].props.gs_start_h *
                              cellWidth) /
                              cellHeightMasonry
                          );
                        }
                      }
                    }
                  }

                  sectionCustom.targets[m].props = lodash.merge(
                    {},
                    sectionDefault.targets[n].props,
                    sectionCustom.targets[m].props
                  );
                  break;
                }
              }
              if (!targetFounded) {
                sectionCustom.targets[m].notDisplay = true;
              }
            }

            //fixing dimensions of blocks not saved
            for (n = 0; n < sectionDefault.targets.length; n++) {
              if (typeof sectionDefault.targets[n].oldElement == "undefined") {
                var newElement = jQuery.extend(
                  true,
                  {},
                  sectionDefault.targets[n]
                );
                if (Rexbuilder_Util.activeLayout != "default") {
                  if (
                    sectionDefault.targets[0].props.layout !=
                    sectionCustom.targets[0].props["layout"]
                  ) {
                    var cellWidth = parseFloat(
                      sectionDefault.targets[0].props.grid_cell_width
                    );
                    var cellHeightMasonry = 5;
                    if (sectionDefault.targets[0].props.layout == "masonry") {
                      newElement.props.gs_y = Math.round(
                        (newElement.props.gs_y * cellHeightMasonry) / cellWidth
                      );
                      newElement.props.gs_height = Math.round(
                        (newElement.props.gs_height * cellHeightMasonry) /
                          cellWidth
                      );
                      newElement.props.gs_start_h = Math.round(
                        (newElement.props.gs_start_h * cellHeightMasonry) /
                          cellWidth
                      );
                    } else {
                      newElement.props.gs_y = Math.round(
                        (newElement.props.gs_y * cellWidth) / cellHeightMasonry
                      );
                      newElement.props.gs_height = Math.round(
                        (newElement.props.gs_height * cellWidth) /
                          cellHeightMasonry
                      );
                      newElement.props.gs_start_h = Math.round(
                        (newElement.props.gs_start_h * cellWidth) /
                          cellHeightMasonry
                      );
                    }
                  }
                }
                sectionCustom.targets.splice(1, 0, newElement);
              }
            }
            break;
          }
        }
      }
      if (layoutSelectedSections.length == 0) {
        layoutSelectedSections = defaultLayoutSections;
        for (i = 0; i < layoutSelectedSections.length; i++) {
          layoutSelectedSections[i].defaultSection = true;
        }
      }
    }

    //updaiting dom custom layout
    _createPageCustomizationsDataLive(layoutSelectedSections);

    for (i = 0; i < layoutSelectedSections.length; i++) {
      if (
        layoutSelectedSections[i].sectionFounded ||
        Rexbuilder_Util.activeLayout == "default"
      ) {
        if (
          ((Rexbuilder_Util.activeLayout != "default" &&
            layoutSelectedSections[i].defaultSection) ||
            Rexbuilder_Util.activeLayout == "default") &&
          _viewport().width <
            _plugin_frontend_settings.defaultSettings.collapseWidth
        ) {
          layoutSelectedSections[i].targets[0].props.collapse_grid = true;
        }
      }
    }
    return jQuery.extend(true, {}, layoutSelectedSections);
  };

  var _edit_dom_layout = function(chosenLayoutName) {
    var response = {
      collapse_needed: false,
    };
    
    // No change layout, simple resize
    if (chosenLayoutName == Rexbuilder_Util.activeLayout) {
      if (chosenLayoutName == "default") {
        if (
          _viewport().width >=
          _plugin_frontend_settings.defaultSettings.collapseWidth
        ) {
          Rexbuilder_Util.removeCollapsedGrids();
        } else {
          if (!Rexbuilder_Util.blockGridUnder768) {
            Rexbuilder_Util.collapseAllGrids();
            response.collapse_needed = true;
          }
        }
        return response;
      }
    }

    Rexbuilder_Util.$rexContainer.attr(
      "data-rex-layout-selected",
      chosenLayoutName
    );
    Rexbuilder_Util.activeLayout = chosenLayoutName;

    var $resposiveData = $("#rexbuilder-layout-data");
    var $modelData = $("#rexbuilder-model-data");

    if (
      $resposiveData
        .children(".layouts-customizations")
        .attr("data-empty-customizations") == "true" &&
      $modelData
        .children(".models-customizations")
        .attr("data-empty-models-customizations") == "true"
    ) {
      if (
        _viewport().width >=
        _plugin_frontend_settings.defaultSettings.collapseWidth
      ) {
        removeCollapsedGrids();
      } else {
        if (!Rexbuilder_Util.blockGridUnder768) {
          Rexbuilder_Util.collapseAllGrids();
          response.collapse_needed = true;
        }
      }
      return response;
    }

    var modelsIDInPage = [];

    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section:not(.removing_section)")
      .each(function(i, el) {
        var $section = $(el);
        if ($section.hasClass("rex-model-section")) {
          modelsIDInPage.push(parseInt($section.attr("data-rexlive-model-id")));
        }
      });

    var sectionsPage = [];

    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section:not(.removing_section)")
      .each(function(i, el) {
        var $section = $(el);
        var secObj = {
          rexID: $section.attr("data-rexlive-section-id"),
          modelID: isNaN(parseInt($section.attr("data-rexlive-model-id")))
            ? ""
            : parseInt($section.attr("data-rexlive-model-id"))
        };
        sectionsPage.push(secObj);
      });

    var i, j;

    var layoutDataPage = _getPageCustomizations();

    if (Rexbuilder_Util.activeLayout == "default") {
      _saveCustomizationDomOrder(jQuery.extend(true, [], layoutDataPage));
    }

    var layoutDataModels = _getModelsCustomizations();
    var defaultLayoutSections;

    if (
      $defaultLayoutState.attr("data-empty-default-customization") == "true"
    ) {
      defaultLayoutSections = _getDefaultPageLayout(
        layoutDataPage,
        layoutDataModels
      );
      _createDefaultLayoutState(defaultLayoutSections);
    } else {
      _updateDefaultLayoutState({
        modelsData: layoutDataModels
      });
      defaultLayoutSections = _getDefaultLayoutState();
    }
    var layoutSelectedSections = _getCustomLayoutSections(
      layoutDataPage,
      layoutDataModels,
      defaultLayoutSections,
      chosenLayoutName
    );
    /*         
                console.log("defaultLayoutSections", jQuery.extend(true, [], defaultLayoutSections));
                console.log("layoutSelectedSections", jQuery.extend(true, [], layoutSelectedSections));
         */
    //fixing models numbers
    var modelsNumbers = [];
    var flagModel;
    for (i = 0; i < layoutSelectedSections; i++) {
      if (layoutSelectedSections[i].section_is_model.toString() == "true") {
        flagModel = false;
        for (j = 0; j < modelsNumbers.length; j++) {
          if (
            modelsNumbers[j].id == layoutSelectedSections[i].section_model_id
          ) {
            modelsNumbers[j].number = modelsNumbers[j].number + 1;
            layoutSelectedSections[i].section_model_number =
              modelsNumbers[j].number;
            flagModel = true;
            break;
          }
        }
        if (!flagModel) {
          layoutSelectedSections[i].section_model_number = 1;
          modelsNumbers.push({
            id: layoutSelectedSections[i].section_model_id,
            number: 1
          });
        }
      }
    }

    var mergedEdits = _mergeSections(
      layoutSelectedSections,
      defaultLayoutSections
    );

    // removing collapsed from grid
    Rexbuilder_Util.removeCollapsedGrids();
    /* 
      console.log("layoutDataPage", layoutDataPage);
      console.log("layoutDataModels", layoutDataModels);
      console.log("sectionsPage", sectionsPage);
      console.log("layoutSelectedSections", layoutSelectedSections);
      console.log("defaultLayoutSections", defaultLayoutSections);
    */
    // console.log("mergedEdits", mergedEdits);

    Rexbuilder_Util.domUpdaiting = true;
    var forceCollapseElementsGrid = false;
    var sectionDomOrder = [];

    $.each(mergedEdits, function(q, section) {
      console.log(section);
      if (!section.notInSection || chosenLayoutName == "default") {
        var sectionObj = {
          rexID: section.section_rex_id,
          modelID: -1,
          modelNumber: -1
        };

        var $section;
        if (section.section_is_model.toString() == "true") {
          sectionObj.modelID = section.section_model_id;
          sectionObj.modelNumber = section.section_model_number;
          $section = Rexbuilder_Util.$rexContainer.children(
            'section[data-rexlive-section-id="' +
              section.section_rex_id +
              '"][data-rexlive-model-number="' +
              sectionObj.modelNumber +
              '"]'
          );
        } else {
          $section = Rexbuilder_Util.$rexContainer.children(
            'section[data-rexlive-section-id="' + section.section_rex_id + '"]'
          );
        }

        if ($section.length != 0 && !$section.hasClass("removing_section")) {
          if (
            typeof section.section_hide != "undefined" &&
            section.section_hide.toString() == "true"
          ) {
            $section.addClass("rex-hide-section");
          } else {
            $section.removeClass("rex-hide-section");
            response.collapse_needed += _updateDOMelements(
              $section,
              section.targets,
              forceCollapseElementsGrid
            );
          }
          sectionDomOrder.push(sectionObj);
        }
      }
    });
    // console.log("dom applied order", jQuery.extend(true, [], sectionDomOrder));
    Rexbuilder_Dom_Util.fixSectionDomOrder(sectionDomOrder, true);

    Rexbuilder_Util.domUpdaiting = false;

    if (!Rexbuilder_Util.editorMode) {
      initPhotoSwipe(".photoswipe-gallery");
    }

    return response;
  };

  var _updateDOMelements = function(
    $section,
    targets,
    forceCollapseElementsGrid
  ) {
    var $gallery = $section.find(".grid-stack-row");
    var galleryData = $gallery.data();
    if (galleryData !== undefined) {
      var galleryEditorInstance = galleryData.plugin_perfectGridGalleryEditor;
      if (galleryEditorInstance !== undefined) {
        for (var i = 1; i < targets.length; i++) {
          var $elem = $gallery.children(
            'div[data-rexbuilder-block-id="' + targets[i].name + '"]'
          );
          var hideElement =
            typeof targets[i].props.hide == "undefined"
              ? false
              : targets[i].props.hide.toString() == "true";
          if (hideElement) {
            if (!$elem.hasClass("rex-hide-element")) {
              $elem.addClass("rex-hide-element");
              galleryEditorInstance.removeBlock($elem);
            }
          } else {
            if ($elem.hasClass("rex-hide-element")) {
              $elem.removeClass("rex-hide-element");
              galleryEditorInstance.reAddBlock($elem);
            }
          }
        }

        var gridstackInstance =
          galleryEditorInstance.properties.gridstackInstance;
        galleryEditorInstance.batchGridstack();
      }
    }
    for (var i = 1; i < targets.length; i++) {
      if (!targets[i].notDisplay || Rexbuilder_Util.activeLayout == "default") {
        var targetName = targets[i].name;
        var targetProps = targets[i].props;
        var $elem = $gallery.children(
          'div[data-rexbuilder-block-id="' + targetName + '"]'
        );
        var $itemData = $elem.children(".rexbuilder-block-data");
        var $itemContent = $elem.find(".grid-item-content");
        var positionDataActive = {
          x: $elem.attr("data-gs-x"),
          y: $elem.attr("data-gs-y"),
          w: $elem.attr("data-gs-width"),
          h: $elem.attr("data-gs-height"),
          startH: $itemData.attr("data-gs_start_h")
        };
        var positionData = {
          x:
            typeof targetProps["gs_x"] == "undefined"
              ? positionDataActive.x
              : targetProps["gs_x"],
          y:
            typeof targetProps["gs_y"] == "undefined"
              ? positionDataActive.y
              : targetProps["gs_y"],
          w:
            typeof targetProps["gs_width"] == "undefined"
              ? positionDataActive.w
              : targetProps["gs_width"],
          h:
            typeof targetProps["gs_height"] == "undefined"
              ? positionDataActive.h
              : targetProps["gs_height"],
          startH:
            typeof targetProps["gs_start_h"] == "undefined"
              ? positionDataActive.startH
              : targetProps["gs_start_h"],
          gridstackInstance: gridstackInstance
        };
        _updateElementDimensions($elem, $itemData, positionData);

        var mp4ID = !isNaN(parseInt(targetProps["video_bg_id"]))
          ? parseInt(targetProps["video_bg_id"])
          : "";
        var youtubeUrl =
          typeof targetProps["video_bg_url_youtube"] == "undefined"
            ? ""
            : targetProps["video_bg_url_youtube"];
        var vimeoUrl =
          typeof targetProps["video_bg_url_vimeo"] == "undefined"
            ? ""
            : targetProps["video_bg_url_vimeo"];
        var type = "";

        if (mp4ID != "") {
          type = "mp4";
        } else if (vimeoUrl != "") {
          type = "vimeo";
        } else if (youtubeUrl != "") {
          type = "youtube";
        }

        var videoOptions = {
          mp4Data: {
            idMp4: mp4ID,
            linkMp4:
              typeof targetProps["video_mp4_url"] == "undefined"
                ? ""
                : targetProps["video_mp4_url"],
            width: isNaN(parseInt(targetProps["video_bg_width"]))
              ? parseInt(targetProps["video_bg_width"])
              : "",
            height: isNaN(parseInt(targetProps["video_bg_height"]))
              ? parseInt(targetProps["video_bg_height"])
              : ""
          },
          vimeoUrl: vimeoUrl,
          youtubeUrl: youtubeUrl,
          audio:
            typeof targetProps["video_has_audio"] == "undefined"
              ? ""
              : targetProps["video_has_audio"] == "1" ||
                targetProps["video_has_audio"].toString() == "true"
                ? true
                : false,
          typeVideo: type
        };

        Rexbuilder_Dom_Util.updateVideos($itemContent, videoOptions);

        var activeImage =
          typeof targetProps["image_bg_elem_active"] == "undefined"
            ? true
            : targetProps["color_bg_block_active"].toString() == "true";

        var imageOptions = {
          active: activeImage,
          idImage: activeImage
            ? !isNaN(parseInt(targetProps["id_image_bg"]))
              ? parseInt(targetProps["id_image_bg"])
              : ""
            : "",
          urlImage: activeImage ? targetProps["image_bg_url"] : "",
          width: activeImage
            ? !isNaN(parseInt(targetProps["image_width"]))
              ? parseInt(targetProps["image_width"])
              : ""
            : "",
          height: activeImage
            ? !isNaN(parseInt(targetProps["image_height"]))
              ? parseInt(targetProps["image_height"])
              : ""
            : "",
          typeBGimage: activeImage ? targetProps["type_bg_image"] : "",
          photoswipe: activeImage ? targetProps["photoswipe"] : ""
        };

        Rexbuilder_Dom_Util.updateImageBG($itemContent, imageOptions);

        var bgColorOpt = {
          $elem: $elem,
          color: targetProps["color_bg_block"],
          active:
            typeof targetProps["color_bg_block_active"] == "undefined"
              ? true
              : targetProps["color_bg_block_active"].toString()
        };

        if( -1 === bgColorOpt.color.indexOf("gradient") ) {
          Rexbuilder_Dom_Util.updateBlockBackgroundColor(bgColorOpt);
        } else {
          Rexbuilder_Dom_Util.updateBlockBackgroundGradient(bgColorOpt);
        }

        var overlayBlockOpt = {
          $elem: $elem,
          color: targetProps["overlay_block_color"],
          active:
            typeof targetProps["overlay_block_color_active"] == "undefined"
              ? false
              : targetProps["overlay_block_color_active"].toString()
        };

        if( -1 === overlayBlockOpt.color.indexOf("gradient") ) {
          Rexbuilder_Dom_Util.updateBlockOverlay(overlayBlockOpt);
        } else {
          Rexbuilder_Dom_Util.updateBlockOverlayGradient(overlayBlockOpt);
        }


        Rexbuilder_Dom_Util.updateBlockPaddings(
          $elem,
          _getPaddingsDataString(
            typeof targetProps["block_padding"] != "undefined"
              ? targetProps["block_padding"]
              : ""
          )
        );

        var newClasses =
          typeof targetProps["block_custom_class"] == "undefined"
            ? ""
            : targetProps["block_custom_class"];
        var classList = [];
        if (newClasses != "") {
          newClasses = newClasses.trim();
          classList = newClasses.split(/\s+/);
        }
        Rexbuilder_Dom_Util.updateCustomClasses($elem, classList);

        var pos =
          typeof targetProps["block_flex_position"] != "undefined"
            ? targetProps["block_flex_position"].split(" ")
            : "";

        var flexPosition = {
          x: pos[0],
          y: pos[1]
        };

        Rexbuilder_Dom_Util.updateFlexPostition($elem, flexPosition);

        var sliderRatio =
          typeof targetProps["slider_dimension_ratio"] == "undefined"
            ? ""
            : targetProps["slider_dimension_ratio"];
        $itemData.attr("data-slider_ratio", sliderRatio);

        var blockEdited =
          typeof targetProps["block_dimensions_live_edited"] == "undefined"
            ? ""
            : targetProps["block_dimensions_live_edited"];
        $itemData.attr("data-block_dimensions_live_edited", blockEdited);

        var hideBlock =
          typeof targetProps["hide"] == "undefined"
            ? false
            : targetProps["hide"].toString() == "true"
              ? true
              : false;

        if (hideBlock) {
          if (!$elem.hasClass("rex-hide-element")) {
            $elem.addClass("rex-hide-element");
          }
          Rexbuilder_Util.stopBlockVideos($elem);
        } else {
          if ($elem.hasClass("rex-hide-element")) {
            $elem.removeClass("rex-hide-element");
          }
          Rexbuilder_Util.playBlockVideos($elem);
        }

        var elementEdited =
          typeof targetProps["element_edited"] == "undefined"
            ? false
            : targetProps["element_edited"].toString() == "true"
              ? true
              : false;
        $elem.attr("data-rexlive-element-edited", elementEdited);

        for (var propName in targetProps) {
          switch (propName) {
            case "type":
              $itemData.attr("data-type", targetProps["type"]);
              break;

            case "size_x":
              $elem.attr("data-width", targetProps["size_x"]);
              break;

            case "size_y":
              $elem.attr("data-height", targetProps["size_y"]);
              break;

            case "row":
              $elem.attr("data-row", targetProps["row"]);
              break;

            case "col":
              $elem.attr("data-col", targetProps["col"]);
              break;
            case "photoswipe":
              if (!Rexbuilder_Util.editorMode) {
                if (targetProps["photoswipe"] == "true") {
                  addPhotoSwipeElement(
                    $itemContent,
                    targetProps["image_bg_block"],
                    parseInt(targetProps["image_width"]),
                    parseInt(targetProps["image_height"]),
                    targetProps["image_size"]
                  );
                  $section.addClass("photoswipe-gallery");
                } else {
                  removePhotoSwipeElement($itemContent);
                }
                $itemData.attr("data-photoswipe", targetProps["photoswipe"]);
              }
              break;
            case "linkurl":
              if (!Rexbuilder_Util.editorMode) {
                var $linkEl = $itemContent.parents(".element-link");
                if (targetProps["linkurl"] != "") {
                  if ($linkEl.length != 0) {
                    //console.log("already a link");
                    $linkEl.attr("href", targetProps["linkurl"]);
                    $linkEl.attr("title", targetProps["linkurl"]);
                  } else {
                    //console.log("not a block link");
                    var $itemContentParent = $itemContent.parent();
                    tmpl.arg = "link";
                    $itemContentParent.append(
                      tmpl("tmpl-link-block", {
                        url: targetProps["linkurl"]
                      })
                    );
                    var $link = $itemContentParent.children(".element-link");
                    $itemContent.detach().appendTo($link);
                  }
                } else {
                  if ($linkEl.length != 0) {
                    $linkEl.children().unwrap();
                  }
                }
              }
              Rexbuilder_Dom_Util.updateBlockUrl($elem, targetProps["linkurl"]);
              break;
            case "zak_background":
            case "zak_side":
            case "zak_title":
            case "zak_icon":
            case "zak_foreground":
              break;
            case "block_animation":
              break;
            case "block_has_scrollbar":
              break;
            default:
              break;
          }
        }
      } else {
        var $el = $gallery.children(
          'div[data-rexbuilder-block-id="' + targetName + '"]'
        );
        if ($el.length != 0) {
          console.log("che me ne facico di lui");
          //                    $el.remove();
        }
      }
    }

    updateSection(
      $section,
      $gallery,
      targets[0].props,
      forceCollapseElementsGrid
    );
    var collapse =
      typeof targets[0].props.collapse_grid == "undefined"
        ? false
        : targets[0].props.collapse_grid.toString() == "true" ||
          forceCollapseElementsGrid;

    if (galleryData !== undefined) {
      var galleryEditorInstance = $gallery.data()
        .plugin_perfectGridGalleryEditor;
      if (galleryEditorInstance !== undefined) {
        Rexbuilder_Util.domUpdaiting = true;

        galleryEditorInstance.properties.gridstackInstance.commit();
        //waiting for gridstack updating blocks dimensions with saved data
        setTimeout(
          function() {
            Rexbuilder_Util.domUpdaiting = true;
            galleryEditorInstance.batchGridstack();
            galleryEditorInstance.properties.gridstackInstance.batchUpdate();
            galleryEditorInstance.fixBlockDomOrder();
            galleryEditorInstance.saveStateGrid();
            //updaiting blocks height for masonry
            if (
              galleryEditorInstance.settings.galleryLayout == "masonry" &&
              !collapse
            ) {
              galleryEditorInstance.updateBlocksHeight();
            } else if (
              galleryEditorInstance.settings.galleryLayout == "fixed" &&
              galleryEditorInstance.settings.fullHeight.toString() == "true"
            ) {
              galleryEditorInstance.updateFullHeight();
            }
            if (targets[0].props.collapse_grid) {
              galleryEditorInstance.collapseElements();
              galleryEditorInstance.collapseElementsProperties();
            }
            galleryEditorInstance.properties.gridstackInstance.commit();
            // row ready
            setTimeout(
              function() {
                Rexbuilder_Util.domUpdaiting = false;
                galleryEditorInstance.properties.dispositionBeforeCollapsing = galleryEditorInstance.createActionDataMoveBlocksGrid();
                galleryEditorInstance._createFirstReverseStack();
                galleryEditorInstance._fixImagesDimension();
                if (Rexbuilder_Util.editorMode) {
                  galleryEditorInstance.createScrollbars();
                }
                galleryEditorInstance._updateElementsSizeViewers();
                Rexbuilder_Util.playAllVideos();
                setTimeout(
                  function() {
                    Rexbuilder_Util.fixYoutube(galleryEditorInstance.$section);
                  },
                  1500,
                  galleryEditorInstance.$section
                );
              },
              200,
              galleryEditorInstance
            );
          },
          300,
          galleryEditorInstance
        );
      }
    }

    return collapse;
  };

  var _updateModelsLive = function(idModel, targets, editedModelNumber) {
    Rexbuilder_Util.domUpdaiting = true;
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function(i, sec) {
        var $section = $(sec);
        if (
          $section.attr("data-rexlive-model-id") == idModel &&
          $section.attr("data-rexlive-model-number") != editedModelNumber
        ) {
          _updateDOMelements($section, targets, false);
        }
      });
    Rexbuilder_Util.domUpdaiting = false;
  };

  var _saveCustomizationDomOrder = function(pageCustomizations) {
    var i, j;
    $layoutsDomOrder.children().remove();
    var sections = [];
    for (i = 0; i < pageCustomizations.length; i++) {
      var $divLayout = $(document.createElement("div"));
      $divLayout.addClass("layout-sections");
      $divLayout.attr("data-rex-layout-name", pageCustomizations[i].name);
      sections = [];
      for (j = 0; j < pageCustomizations[i].sections.length; j++) {
        sections.push(pageCustomizations[i].sections[j]);
      }
      $divLayout.text(JSON.stringify(sections));
      $divLayout.appendTo($layoutsDomOrder[0]);
    }
  };

  var _getPageCustomizationsDom = function() {
    var customizations = [];
    $layoutsDomOrder
      .children('.layout-sections:not([data-rex-layout-name="default"])')
      .each(function(i, layout) {
        var $layout = $(layout);
        customizations.push({
          name: $layout.attr("data-rex-layout-name"),
          sections: JSON.parse($layout.text())
        });
      });
    return customizations;
  };

  var _updatePageCustomizationsDomOrder = function(layoutsData) {
    console.log("layoutsData", layoutsData);
    for (var i = 0; i < layoutsData.length; i++) {
      $layoutsDomOrder
        .children(
          '.layout-sections[data-rex-layout-name="' + layoutsData[i].name + '"]'
        )
        .text(JSON.stringify(layoutsData[i].sections));
    }
  };

  var _getPageAvaiableLayoutsNames = function() {
    var $pageLayoutsNamesDiv = $(
      "#rexbuilder-layout-data .available-layouts-names"
    );
    return JSON.parse($pageLayoutsNamesDiv.text());
  };

  var _getLayoutLiveSectionTargets = function($section) {
    var targets = [];
    if ($section.hasClass("rex-model-section")) {
      var modelID = $section.attr("data-rexlive-model-id");
      $liveDataContainer.children().each(function(i, sec) {
        var $sec = $(sec);
        if (modelID == $sec.attr("data-model-id")) {
          targets = JSON.parse($sec.text());
          return false;
        }
      });
    } else {
      var rexID = $section.attr("data-rexlive-section-id");
      $liveDataContainer.children().each(function(i, sec) {
        var $sec = $(sec);
        if (rexID == $sec.attr("data-section-rex-id")) {
          targets = JSON.parse($sec.text());
          return false;
        }
      });
    }

    return targets;
  };

  var _createDefaultLayoutState = function(sectionsData) {
    $defaultLayoutState.children().remove();
    var i;
    for (i = 0; i < sectionsData.length; i++) {
      var $div = $(document.createElement("div"));
      $div.addClass("section-targets");
      $div.attr("data-section-rex-id", sectionsData[i].section_rex_id);
      $div.attr("data-model-id", sectionsData[i].section_model_id);
      $div.attr("data-model-number", sectionsData[i].section_model_number);
      $div.attr("data-section-hide", sectionsData[i].section_hide);
      $div.text(JSON.stringify(sectionsData[i].targets));
      $div.appendTo($defaultLayoutState[0]);
    }
    $defaultLayoutState.removeAttr("data-empty-default-customization");
  };

  var _updateDefaultLayoutState = function(data) {
    var updatedSectionsData =
      typeof data.pageData == "undefined" ? [] : data.pageData;
    var modelsData =
      typeof data.modelsData == "undefined" ? [] : data.modelsData;
    var p, q, r;
    if (updatedSectionsData.length == 0) {
      $defaultLayoutState
        .children(".section-targets")
        .each(function(j, sectionTargetsElem) {
          var $sectionTargetsElem = $(sectionTargetsElem);
          var modelID = isNaN(
            parseInt($sectionTargetsElem.attr("data-model-id"))
          )
            ? -1
            : parseInt($sectionTargetsElem.attr("data-model-id"));
          if (modelID != -1) {
            for (q = 0; q < modelsData.length; q++) {
              if (modelID == modelsData[q].id) {
                for (r = 0; r < modelsData[q].customizations.length; r++) {
                  if (modelsData[q].customizations[r].name == "default") {
                    $sectionTargetsElem.text(
                      JSON.stringify(modelsData[q].customizations[r].targets)
                    );
                    break;
                  }
                }
                break;
              }
            }
          }
        });
    } else {
      $defaultLayoutState.children(".section-targets").remove();
      for (p = 0; p < updatedSectionsData.length; p++) {
        var $div = $(document.createElement("div"));
        $div.addClass("section-targets");
        $div.attr("data-section-rex-id", updatedSectionsData[p].section_rex_id);
        $div.attr("data-model-id", updatedSectionsData[p].section_model_id);
        $div.attr(
          "data-model-number",
          updatedSectionsData[p].section_model_number
        );
        $div.attr("data-section-hide", updatedSectionsData[p].section_hide);
        if (
          updatedSectionsData[p].section_model_id == "" ||
          updatedSectionsData[p].section_model_id == -1
        ) {
          $div.text(JSON.stringify(updatedSectionsData[p].targets));
        } else {
          if (updatedSectionsData[p].section_model_id != -1) {
            for (q = 0; q < modelsData.length; q++) {
              if (updatedSectionsData[p].section_model_id == modelsData[q].id) {
                for (r = 0; r < modelsData[q].customizations.length; r++) {
                  if (modelsData[q].customizations[r].name == "default") {
                    $div.text(
                      JSON.stringify(modelsData[q].customizations[r].targets)
                    );
                    break;
                  }
                }
                break;
              }
            }
          }
        }
        $div.appendTo($defaultLayoutState[0]);
      }
    }
  };

  var _updateDefaultLayoutStateDOMOrder = function(newOrder) {
    var data = _getDefaultLayoutState();
    newOrder = jQuery.extend(true, [], newOrder);

    var i, j;
    var flagNumbers;
    var models = [];
    for (i = 0; i < newOrder.length; i++) {
      if (newOrder[i].modelID != -1) {
        flagNumbers = false;
        for (j = 0; j < models.length; j++) {
          if (models[j].id == newOrder[i].modelID) {
            models[j].number = models[j].number + 1;
            newOrder[i].modelNumber = models[j].number;
            flagNumbers = true;
            break;
          }
        }
        if (!flagNumbers) {
          models.push({
            id: newOrder[i].modelID,
            number: 1
          });
          newOrder[i].modelNumber = 1;
        }
      }
    }

    var newData = [];
    var section;
    for (i = 0; i < newOrder.length; i++) {
      for (j = 0; j < data.length; j++) {
        if (newOrder[i].modelID != -1) {
          if (
            newOrder[i].modelID == data[j].section_model_id &&
            newOrder[i].modelNumber == data[j].section_model_number
          ) {
            section = data.splice(j, 1);
          }
        } else {
          if (newOrder[i].rexID == data[j].section_rex_id) {
            section = data.splice(j, 1);
          }
        }
      }
      newData.push(section[0]);
    }

    _updateDefaultLayoutState({ pageData: newData });
  };

  var _updateDefaultLayoutStateSection = function($section, position) {
    position = typeof position == "undefined" ? -1 : position;
    Rexbuilder_Dom_Util.fixModelNumbers();
    var layoutData = Rex_Save_Listeners.createTargets(
      $section,
      Rexbuilder_Util.activeLayout
    );
    var sectionAdded = false;
    if ($section.hasClass("rex-model-section")) {
      var modelID = $section.attr("data-rexlive-model-id");
      var modelNumber = $section.attr("data-rexlive-section-number");
      $defaultLayoutState.children(".section-targets").each(function(i, sec) {
        var $sec = $(sec);
        if (modelID == $sec.attr("data-model-id")) {
          $sec.text(JSON.stringify(layoutData));
          if (modelNumber == $sec.attr("data-model-number")) {
            sectionAdded = true;
          }
        }
      });
    } else {
      var rexID = $section.attr("data-rexlive-section-id");
      $defaultLayoutState.children(".section-targets").each(function(i, sec) {
        var $sec = $(sec);
        if (rexID == $sec.attr("data-section-rex-id")) {
          $sec.text(JSON.stringify(layoutData));
          sectionAdded = true;
        }
      });
    }

    if (!sectionAdded) {
      var section_props = {
        section_rex_id: $section.attr("data-rexlive-section-id"),
        section_is_model: false,
        section_model_id: "",
        section_model_number: -1,
        section_hide: false
      };

      section_props.section_hide = $section.hasClass("rex-hide-section");

      if ($section.hasClass("rex-model-section")) {
        section_props.section_is_model = true;
        section_props.section_model_id = $section.attr("data-rexlive-model-id");
        section_props.section_model_number = $section.attr(
          "data-rexlive-model-number"
        );
      }

      var $div = $(document.createElement("div"));
      $div.addClass("section-targets");
      $div.attr("data-section-rex-id", section_props.section_rex_id);
      $div.attr("data-model-id", section_props.section_model_id);
      $div.attr("data-model-number", section_props.section_model_number);
      $div.attr("data-section-hide", section_props.section_hide);
      $div.text(JSON.stringify(layoutData));
      if (position == -1) {
        $div.appendTo($defaultLayoutState[0]);
      } else {
        var $selectedSection;
        position = position - 1;
        $defaultLayoutState.children(".section-targets").each(function(i, sec) {
          if (i == position) {
            $selectedSection = $(sec);
            return false;
          }
        });
        $selectedSection.after($div[0]);
      }
    }
  };

  // gets default layout
  var _getDefaultLayoutState = function() {
    var defaultLayoutSections = [];

    $defaultLayoutState
      .children(".section-targets")
      .each(function(j, sectionTargetsElem) {
        var $sectionTargetsElem = $(sectionTargetsElem);
        var sectionRexID = $sectionTargetsElem.attr("data-section-rex-id");
        var modelID = isNaN(parseInt($sectionTargetsElem.attr("data-model-id")))
          ? -1
          : parseInt($sectionTargetsElem.attr("data-model-id"));
        var modelNumber = isNaN(
          parseInt($sectionTargetsElem.attr("data-model-number"))
        )
          ? -1
          : parseInt($sectionTargetsElem.attr("data-model-number"));
        var hideSection =
          typeof $sectionTargetsElem.attr("data-section-hide") == "undefined"
            ? false
            : $sectionTargetsElem.attr("data-section-hide").toString() == "1"
              ? true
              : false;
        var targets =
          $sectionTargetsElem.text() != ""
            ? JSON.parse($sectionTargetsElem.text())
            : [];

        defaultLayoutSections.push({
          section_rex_id: sectionRexID,
          section_model_id: modelID != -1 ? modelID : "",
          section_model_number: modelNumber != -1 ? modelNumber : "",
          section_is_model: modelID != -1,
          section_hide: hideSection,
          targets: targets
        });
      });
    return defaultLayoutSections;
  };

  var _updateSectionOrderCustomLayouts = function(sectionMoved, newOrder) {
    var layoutsOrder = Rexbuilder_Util.getPageCustomizationsDom();
    var moveSection;
    var newSecPosition;
    var i, j;
    for (i = 0; i < newOrder.length; i++) {
      if (
        newOrder[i].rexID == sectionMoved.rexID &&
        newOrder[i].modelNumber == sectionMoved.modelNumber &&
        newOrder[i].modelID == sectionMoved.modelID
      ) {
        newSecPosition = i;
        break;
      }
    }

    for (i = 0; i < layoutsOrder.length; i++) {
      moveSection = false;
      for (j = 0; j < layoutsOrder[i].sections.length; j++) {
        if (layoutsOrder[i].sections[j].section_is_model) {
          if (
            layoutsOrder[i].sections[j].section_model_id ==
              sectionMoved.modelID &&
            layoutsOrder[i].sections[j].section_model_number ==
              sectionMoved.modelNumber
          ) {
            if (
              typeof layoutsOrder[i].sections[j].section_created_live !==
                "undefined" &&
              layoutsOrder[i].sections[j].section_created_live.toString() ==
                "true"
            ) {
              moveSection = true;
            }
            break;
          }
        } else {
          if (
            sectionMoved.rexID == layoutsOrder[i].sections[j].section_rex_id
          ) {
            if (
              typeof layoutsOrder[i].sections[j].section_created_live !==
                "undefined" &&
              layoutsOrder[i].sections[j].section_created_live.toString() ==
                "true"
            ) {
              moveSection = true;
            }
            break;
          }
        }
      }
      if (moveSection) {
        var oldsec = layoutsOrder[i].sections.splice(j, 1)[0];
        layoutsOrder[i].sections.splice(newSecPosition, 0, oldsec);
      }
    }
    Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);
  };

  var _updateSectionStateLive = function($section) {
    Rexbuilder_Dom_Util.fixModelNumbers();
    var layoutData = Rex_Save_Listeners.createTargets(
      $section,
      Rexbuilder_Util.activeLayout
    );
    var sectionAdded = false;
    if ($section.hasClass("rex-model-section")) {
      var modelID = $section.attr("data-rexlive-model-id");
      $liveDataContainer.children().each(function(i, sec) {
        var $sec = $(sec);
        if (modelID == $sec.attr("data-model-id")) {
          $sec.text(JSON.stringify(layoutData));
          sectionAdded = true;
        }
      });
    } else {
      var rexID = $section.attr("data-rexlive-section-id");
      $liveDataContainer.children().each(function(i, sec) {
        var $sec = $(sec);
        if (rexID == $sec.attr("data-section-rex-id")) {
          $sec.text(JSON.stringify(layoutData));
          sectionAdded = true;
        }
      });
    }

    if (!sectionAdded) {
      var section_props = {
        section_rex_id: $section.attr("data-rexlive-section-id"),
        section_is_model: false,
        section_model_id: "",
        section_model_number: -1,
        section_hide: false
      };

      section_props.section_hide = $section.hasClass("rex-hide-section");

      if ($section.hasClass("rex-model-section")) {
        section_props.section_is_model = true;
        section_props.section_model_id = $section.attr("data-rexlive-model-id");
        section_props.section_model_number = $section.attr(
          "data-rexlive-model-number"
        );
      }

      var $div = $(document.createElement("div"));
      $div.addClass("section-targets");
      $div.attr("data-section-rex-id", section_props.section_rex_id);
      $div.attr("data-model-id", section_props.section_model_id);
      $div.attr("data-model-number", section_props.section_model_number);
      $div.attr("data-section-hide", section_props.section_hide);
      $div.text(JSON.stringify(layoutData));
      $div.appendTo($liveDataContainer[0]);
    }
  };

  var _getGridLayoutLive = function($section) {
    var targets;
    var gridLayout = {
      layout: "fixed",
      fullHeight: false,
      collapsed: false
    };

    if ($section.hasClass("rex-model-section")) {
      var modelID = $section.attr("data-rexlive-model-id");
      $liveDataContainer.children(".section-targets").each(function(i, sec) {
        var $sec = $(sec);
        if (modelID == $sec.attr("data-model-id")) {
          targets = JSON.parse($sec.text());
        }
      });
    } else {
      var rexID = $section.attr("data-rexlive-section-id");
      $liveDataContainer.children(".section-targets").each(function(i, sec) {
        var $sec = $(sec);
        if (rexID == $sec.attr("data-section-rex-id")) {
          targets = JSON.parse($sec.text());
        }
      });
    }

    gridLayout.layout = targets[0].props["layout"];
    gridLayout.fullHeight = targets[0].props["full_height"];
    gridLayout.collapsed = targets[0].props["collapse_grid"];
    return gridLayout;
  };

  var _getLayoutSectionTargets = function($section, layoutName) {
    layoutName = typeof layoutName === "undefined" ? "default" : layoutName;
    var targets = [];
    var i, j;

    if ($section.hasClass("rex-model-section")) {
      var modelID = $section.attr("data-rexlive-model-id");
      var layoutDataModels = _getModelsCustomizations();

      for (i = 0; i < layoutDataModels.length; i++) {
        if (layoutDataModels[i].id == modelID) {
          for (j = 0; j < layoutDataModels[i].customizations.length; j++) {
            if (layoutDataModels[i].customizations[j].name == layoutName) {
              targets = jQuery.extend(
                true,
                [],
                layoutDataModels[i].customizations[j].targets
              );
              break;
            }
          }
          break;
        }
      }
    } else {
      var rexID = $section.attr("data-rexlive-section-id");
      var layoutDataPage = _getPageCustomizations();

      for (i = 0; i < layoutDataPage.length; i++) {
        if (
          layoutDataPage[i].name == layoutName &&
          typeof layoutDataPage[i].sections !== "undefined"
        ) {
          for (j = 0; j < layoutDataPage[i].sections.length; j++) {
            if (layoutDataPage[i].sections[j].section_rex_id == rexID) {
              targets = jQuery.extend(
                true,
                [],
                layoutDataPage[i].sections[j].targets
              );
              break;
            }
          }
          break;
        }
      }
    }
    return targets;
  };

  var _getDefaultBlockProps = function($section, blockRexID) {
    var defaultTargets = _getLayoutSectionTargets($section, "default");
    var i;
    var blockProps = {};
    for (i = 1; i < defaultTargets.length; i++) {
      if (defaultTargets[i].name == blockRexID) {
        blockProps = jQuery.extend(true, {}, defaultTargets[i].props);
        break;
      }
    }
    return blockProps;
  };

  var _getGridLayout = function($section, layoutName) {
    layoutName = typeof layoutName === "undefined" ? "default" : layoutName;
    var gridLayout = {
      layout: "fixed",
      fullHeight: false,
      collapsed: false
    };

    var i, j;

    if ($section.hasClass("rex-model-section")) {
      var modelID = $section.attr("data-rexlive-model-id");
      var layoutDataModels = _getModelsCustomizations();

      for (i = 0; i < layoutDataModels.length; i++) {
        if (layoutDataModels[i].id == modelID) {
          for (j = 0; j < layoutDataModels[i].customizations.length; j++) {
            if (layoutDataModels[i].customizations[j].name == layoutName) {
              gridLayout.layout =
                layoutDataModels[i].customizations[j].targets[0].props[
                  "layout"
                ];
              gridLayout.fullHeight =
                layoutDataModels[i].customizations[j].targets[0].props[
                  "full_height"
                ];
              gridLayout.collapsed =
                layoutDataModels[i].customizations[j].targets[0].props[
                  "collapse_grid"
                ];
              break;
            }
          }
          break;
        }
      }
    } else {
      var rexID = $section.attr("data-rexlive-section-id");
      var layoutDataPage = _getPageCustomizations();

      for (i = 0; i < layoutDataPage.length; i++) {
        if (
          layoutDataPage[i].name == layoutName &&
          typeof layoutDataPage[i].sections !== "undefined" &&
          typeof layoutDataPage[i].sections !== null
        ) {
          for (j = 0; j < layoutDataPage[i].sections.length; j++) {
            if (layoutDataPage[i].sections[j].section_rex_id == rexID) {
              if (layoutDataPage[i].sections[j].targets.length != 0) {
                gridLayout.layout =
                  layoutDataPage[i].sections[j].targets[0].props["layout"];
                gridLayout.fullHeight =
                  layoutDataPage[i].sections[j].targets[0].props["full_height"];
                gridLayout.collapsed =
                  layoutDataPage[i].sections[j].targets[0].props[
                    "collapse_grid"
                  ];
              }
              break;
            }
          }
          break;
        }
      }
    }

    return gridLayout;
  };

  var _customizationExists = function(layoutName) {
    var exists = false;
    var i;
    var $layoutsAvaiableDiv = $(
      "#rexbuilder-layout-data .available-layouts-names"
    );

    var layoutsNamesAvaiable = [];

    if ($layoutsAvaiableDiv.text() != "") {
      layoutsNamesAvaiable = JSON.parse($layoutsAvaiableDiv.text());
    }

    for (i = 0; i < layoutsNamesAvaiable.length; i++) {
      if (layoutsNamesAvaiable[i] == layoutName) {
        exists = true;
        break;
      }
    }

    return exists;
  };

  var updateSection = function(
    $section,
    $gallery,
    targetProps,
    forceCollapseElementsGrid
  ) {
    var $sectionData = $section.children(".section-data");

    var mp4ID = !isNaN(parseInt(targetProps["video_bg_id"]))
      ? parseInt(targetProps["video_bg_id"])
      : "";
    var youtubeUrl =
      typeof targetProps["video_bg_url_section"] == "undefined"
        ? ""
        : targetProps["video_bg_url_section"];
    var vimeoUrl =
      typeof targetProps["video_bg_url_vimeo_section"] == "undefined"
        ? ""
        : targetProps["video_bg_url_vimeo_section"];
    var type = "";

    if (mp4ID != "") {
      type = "mp4";
    } else if (vimeoUrl != "") {
      type = "vimeo";
    } else if (youtubeUrl != "") {
      type = "youtube";
    }

    var videoOptions = {
      mp4Data: {
        idMp4: mp4ID,
        linkMp4:
          typeof targetProps["video_mp4_url"] == "undefined"
            ? ""
            : targetProps["video_mp4_url"],
        width: "",
        height: ""
      },
      vimeoUrl: vimeoUrl,
      youtubeUrl: youtubeUrl,
      audio: false,
      typeVideo: type
    };

    Rexbuilder_Dom_Util.updateSectionVideoBackground($section, videoOptions);

    var imageOptions = {
      active:
        typeof targetProps["image_bg_section_active"] == "undefined"
          ? true
          : targetProps["image_bg_section_active"].toString(),
      idImage: isNaN(parseInt(targetProps["id_image_bg_section"]))
        ? ""
        : parseInt(targetProps["id_image_bg_section"]),
      urlImage: targetProps["image_bg_section"],
      width: parseInt(targetProps["image_width"]),
      height: parseInt(targetProps["image_height"])
    };

    var sectionOverlay = {
      color: targetProps["row_overlay_color"],
      active:
        typeof targetProps["row_overlay_active"] == "undefined"
          ? false
          : targetProps["row_overlay_active"].toString()
    };

    Rexbuilder_Dom_Util.updateImageBG($section, imageOptions);

    var backgroundColorOpt = {
      color: targetProps["color_bg_section"],
      active:
        typeof targetProps["color_bg_section_active"] == "undefined"
          ? true
          : targetProps["color_bg_section_active"].toString()
    };

    if( -1 === backgroundColorOpt.color.indexOf("gradient") ) {
      Rexbuilder_Dom_Util.updateSectionBackgroundColor( $section, backgroundColorOpt );
    } else {
      Rexbuilder_Dom_Util.updateSectionBackgroundGradient( $section, backgroundColorOpt );
    }

    if( -1 === sectionOverlay.color.indexOf("gradient") ) {
      Rexbuilder_Dom_Util.updateSectionOverlay($section, sectionOverlay);
    } else {
      Rexbuilder_Dom_Util.updateSectionOverlayGradient($section, sectionOverlay);
    }

    var margins = {
      top: isNaN(parseInt(targetProps["row_margin_top"]))
        ? 0
        : parseInt(targetProps["row_margin_top"]),
      right: isNaN(parseInt(targetProps["row_margin_right"]))
        ? 0
        : parseInt(targetProps["row_margin_right"]),
      bottom: isNaN(parseInt(targetProps["row_margin_bottom"]))
        ? 0
        : parseInt(targetProps["row_margin_bottom"]),
      left: isNaN(parseInt(targetProps["row_margin_left"]))
        ? 0
        : parseInt(targetProps["row_margin_left"])
    };

    Rexbuilder_Dom_Util.updateSectionMarginsData($section, margins);

    var rowSettings = {
      gutter: targetProps["block_distance"],
      top: targetProps["row_separator_top"],
      bottom: targetProps["row_separator_bottom"],
      right: targetProps["row_separator_right"],
      left: targetProps["row_separator_left"],

      full_height: targetProps["full_height"],
      layout: targetProps["layout"],

      section_width: targetProps["section_width"],
      dimension: targetProps["dimension"],

      collapse_grid:
        typeof targetProps["collapse_grid"] == "undefined"
          ? false
          : targetProps["collapse_grid"].toString() == "true" ||
            forceCollapseElementsGrid
    };

    Rexbuilder_Dom_Util.updateRow(
      $section,
      $sectionData,
      $gallery,
      rowSettings
    );

    var newName =
      typeof targetProps["section_name"] == "undefined"
        ? ""
        : targetProps["section_name"];
    Rexbuilder_Dom_Util.updateSectionName($section, newName);
    $section.attr("data-type", targetProps["type"]);

    var newClasses =
      typeof targetProps["custom_classes"] == "undefined"
        ? ""
        : targetProps["custom_classes"];

    var classList = [];
    if (newClasses != "") {
      newClasses = newClasses.trim();
      classList = newClasses.split(/\s+/);
    }
    Rexbuilder_Dom_Util.updateCustomClasses($section, classList);

    var sectionEdited =
      typeof targetProps["section_edited"] == "undefined"
        ? false
        : targetProps["section_edited"].toString() == "true"
          ? true
          : false;
    $section.attr("data-rexlive-section-edited", sectionEdited);
  };

  var _updateElementDimensions = function($elem, $elemData, posData) {
    var x = parseInt(posData.x);
    var y = parseInt(posData.y);
    var w = parseInt(posData.w);
    var h = parseInt(posData.h);
    var startH = parseInt(posData.startH);
    if (typeof posData.gridstackInstance != "undefined") {
      posData.gridstackInstance.update($elem[0], x, y, w, h);
    } else {
      $elem.attr("data-gs-height", h);
      $elem.attr("data-gs-width", w);
      $elem.attr("data-gs-y", y);
      $elem.attr("data-gs-x", x);
    }
    $elemData.attr("data-gs_start_h", startH);
    $elemData.attr("data-gs_width", w);
    $elemData.attr("data-gs_height", h);
    $elemData.attr("data-gs_y", y);
    $elemData.attr("data-gs_x", x);
  };

  var addPhotoSwipeElement = function($itemContent, url, w, h, t) {
    tmpl.arg = "image";
    var $gridstackItemContent = $itemContent.parents(
      ".grid-stack-item-content"
    );
    //console.log("checking if is already photoswipe");
    console.log("have to add photoswipe?");
    if ($itemContent.parents(".pswp-figure").length == 0) {
      console.log("yes?");

      //console.log("not");
      $itemContent.parent().prepend(
        tmpl("tmpl-photoswipe-block", {
          link: url,
          width: w,
          height: h,
          type: t
        })
      );
      var $pspwItem = $gridstackItemContent.find(".pswp-item");
      $itemContent.detach().appendTo($pspwItem);
    }
  };

  var removePhotoSwipeElement = function($itemContent) {
    //console.log("removing photoswipe");
    //console.log($itemContent);
    var $pswpFigure = $itemContent.parents(".pswp-figure");
    //console.log($pswpFigure);
    if ($pswpFigure.length != 0) {
      //console.log("removing ps");
      var $pspwParent = $pswpFigure.parent();
      $itemContent.detach().appendTo($pspwParent);
      $pswpFigure.remove();
    }
  };

  var initPhotoSwipe = function(gallerySelector) {
    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
      //var thumbElements = el.childNodes,

      var thumbElements = $(el)
          .find(".pswp-figure")
          .get(),
        numNodes = thumbElements.length,
        items = [],
        figureEl,
        linkEl,
        size,
        item;

      for (var i = 0; i < numNodes; i++) {
        figureEl = thumbElements[i]; // <figure> element

        // include only element nodes
        if (figureEl.nodeType !== 1) {
          continue;
        }

        linkEl = figureEl.children[0]; // <a> element

        size = linkEl.getAttribute("data-size").split("x");

        // create slide object
        item = {
          src: linkEl.getAttribute("href"),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10)
        };

        if (figureEl.children.length > 1) {
          // <figcaption> content
          item.title = figureEl.children[1].innerHTML;
        }

        if (linkEl.children.length > 0) {
          // <img> thumbnail element, retrieving thumbnail url
          item.msrc = linkEl.children[0].getAttribute("data-thumburl");
        }

        item.el = figureEl; // save link to element for getThumbBoundsFn
        items.push(item);
      }

      return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
      return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    var collectionHas = function(a, b) {
      //helper function (see below)
      for (var i = 0, len = a.length; i < len; i++) {
        if (a[i] == b) return true;
      }
      return false;
    };

    var findParentBySelector = function(elm, selector) {
      var all = document.querySelectorAll(selector);
      var cur = elm.parentNode;
      while (cur && !collectionHas(all, cur)) {
        //keep going up until you find a match
        cur = cur.parentNode; //go up
      }
      return cur; //will return null if not found
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
      e = e || window.event;

      // Bug fix for Block links and links inside blocks
      if (
        $(e.target)
          .parents(".perfect-grid-item")
          .find(".element-link").length > 0 ||
        $(e.target).is("a")
      ) {
        return;
      }

      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      var eTarget = e.target || e.srcElement;

      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
        return el.tagName && el.tagName.toUpperCase() === "FIGURE";
      });

      if (!clickedListItem) {
        return;
      }

      // find index of clicked item by looping through all child nodes
      // alternatively, you may define index via data- attribute
      // var clickedGallery = clickedListItem.parentNode,
      //var clickedGallery = findParentBySelector(clickedListItem, '.my-gallery'),
      var clickedGallery = $(clickedListItem).parents(gallerySelector)[0],
        //childNodes = clickedListItem.parentNode.childNodes,
        childNodes = $(clickedGallery)
          .find(".pswp-figure")
          .get(),
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;

      for (var i = 0; i < numChildNodes; i++) {
        if (childNodes[i].nodeType !== 1) {
          continue;
        }

        if (childNodes[i] === clickedListItem) {
          index = nodeIndex;
          break;
        }
        nodeIndex++;
      }

      if (index >= 0) {
        // open PhotoSwipe if valid index found
        openPhotoSwipe(index, clickedGallery);
      }
      return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
        params = {};

      if (hash.length < 5) {
        return params;
      }

      var vars = hash.split("&");
      for (var i = 0; i < vars.length; i++) {
        if (!vars[i]) {
          continue;
        }
        var pair = vars[i].split("=");
        if (pair.length < 2) {
          continue;
        }
        params[pair[0]] = pair[1];
      }

      if (params.gid) {
        params.gid = parseInt(params.gid, 10);
      }

      return params;
    };

    var openPhotoSwipe = function(
      index,
      galleryElement,
      disableAnimation,
      fromURL
    ) {
      var pswpElement = document.querySelectorAll(".pswp")[0],
        gallery,
        options,
        items;

      items = parseThumbnailElements(galleryElement);

      // define options (if needed)
      options = {
        // define gallery index (for URL)
        galleryUID: galleryElement.getAttribute("data-pswp-uid"),

        getThumbBoundsFn: function(index) {
          // See Options -> getThumbBoundsFn section of documentation for more info
          var thumbnail = items[index].el.getElementsByClassName(
              "pswp-item-thumb"
            )[0], // find thumbnail
            image_content = items[index].el.getElementsByClassName(
              "rex-custom-scrollbar"
            )[0],
            pageYScroll =
              window.pageYOffset || document.documentElement.scrollTop,
            rect = image_content.getBoundingClientRect(),
            image_type = thumbnail.getAttribute("data-thumb-image-type");

          if (image_type == "natural") {
            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          } else {
            // var full_rect = items[index].el.getBoundingClientRect();
            // return {x:full_rect.left, y:full_rect.top + pageYScroll, w:full_rect.width};;
            return null;
          }
        },

        closeOnScroll: false,
        showHideOpacity: true
      };

      // PhotoSwipe opened from URL
      if (fromURL) {
        if (options.galleryPIDs) {
          // parse real index when custom PIDs are used
          // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
          for (var j = 0; j < items.length; j++) {
            if (items[j].pid == index) {
              options.index = j;
              break;
            }
          }
        } else {
          // in URL indexes start from 1
          options.index = parseInt(index, 10) - 1;
        }
      } else {
        options.index = parseInt(index, 10);
      }

      // exit if index not found
      if (isNaN(options.index)) {
        return;
      }

      if (disableAnimation) {
        options.showAnimationDuration = 0;
      }

      // Pass data to PhotoSwipe and initialize it

      gallery = new PhotoSwipe(
        pswpElement,
        PhotoSwipeUI_Default,
        items,
        options
      );
      gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute("data-pswp-uid", i + 1);
      galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
      openPhotoSwipe(
        hashData.pid,
        galleryElements[hashData.gid - 1],
        true,
        true
      );
    }
  };

  // function to detect if we are on a mobile device
  var _detect_mobile = function() {
    if (!("ontouchstart" in document.documentElement)) {
      document.documentElement.className += " no-touch";
    } else {
      document.documentElement.className += " touch";
    }
  };

  // function to detect the viewport size
  var _viewport = function() {
    var e = window,
      a = "inner";
    if (!("innerWidth" in window)) {
      a = "client";
      e = document.documentElement || document.body;
    }
    return { width: e[a + "Width"], height: e[a + "Height"] };
  };

  // function to find the youtube id based on an url
  var getYoutubeID = function(url) {
    var ID;
    if (url.indexOf("youtu.be") > 0) {
      ID = url.substr(url.lastIndexOf("/") + 1, url.length);
    } else if (url.indexOf("http") > -1) {
      ID = url.match(/[\\?&]v=([^&#]*)/)[1];
    } else {
      ID = url.length > 15 ? null : url;
    }
    return ID;
  };

  // Get the value of a query variable from the actual url
  var _getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  };

  var _checkPresentationPage = function() {
    if (0 !== $(".rexpansive_portfolio_presentation").length) {
      return true;
    }
    return false;
  };

  var _checkStaticPresentationPage = function() {
    if (0 !== $(".rexpansive-static-portfolio").length) {
      return true;
    }
    return false;
  };

  var _checkPost = function() {
    if (0 !== $("#rex-article").length) {
      return true;
    }
    return false;
  };

  // find the animation/transition event names
  var _whichTransitionEvent = function() {
    var t,
      el = document.createElement("fakeelement");

    var transitions = {
      transition: "transitionend",
      OTransition: "oTransitionEnd",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd"
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  };

  var _whichAnimationEvent = function() {
    var t,
      el = document.createElement("fakeelement");

    var animations = {
      animation: "animationend",
      OAnimation: "oAnimationEnd",
      MozAnimation: "animationend",
      WebkitAnimation: "webkitAnimationEnd"
    };

    for (t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  };

  var addWindowListeners = function() {
    var firstResize = true;
    var timeout;
    Rexbuilder_Util.$window.on("resize", function(event) {
      if (!Rexbuilder_Util_Editor.elementIsResizing) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        Rexbuilder_Util.windowIsResizing = true;
        if (firstResize) {
          Rexbuilder_Util.$rexContainer
            .find(".grid-stack-row")
            .each(function(e, row) {
              var galleryEditorInstance = $(row).data()
                .plugin_perfectGridGalleryEditor;
              if (galleryEditorInstance !== undefined) {
                galleryEditorInstance.removeScrollbars();
              }
            });
          firstResize = false;
        }

        clearTimeout(timeout);
        timeout = setTimeout(doneResizing, 1000);
      }
    });

    /**
     * Function launched at the end of the resize of the window
     * @since 2.0.0
     */
    function doneResizing() {
      Rexbuilder_Util.windowIsResizing = true;
      if (Rexbuilder_Util.editorMode && !Rexbuilder_Util_Editor.buttonResized) {
        Rexbuilder_Util.windowIsResizing = false;
        return;
      }

      // Live editor resize logic
      if (Rexbuilder_Util.editorMode) {
        Rexbuilder_Util_Editor.buttonResized = false;
        var resize_info = _edit_dom_layout(Rexbuilder_Util_Editor.clickedLayoutID);

        if( 0 === resize_info.collapse_needed ) {
          Rexbuilder_Util_Editor.endLoading();
        } else {
          $(document).one("rexlive:collapsingElementsEnded", function(e) {
            Rexbuilder_Util_Editor.endLoading();
          });
        }
      } else {    // Front end resize logic
        var actualLayout = _findFrontLayout();
        
        if(startFrontLayout != actualLayout) {
          changedFrontLayout = true;
          startFrontLayout = actualLayout;
          Rexbuilder_Util_Editor.startLoading();
        }

        if(changedFrontLayout) {
          setTimeout(function() {
            var resize_info = _edit_dom_layout(chooseLayout());
            _updateGridsHeights();
    
            if(changedFrontLayout) {
              if( 0 == resize_info.collapse_needed ) {
                Rexbuilder_Util_Editor.endLoading();
              } else {
                $(document).one("rexlive:collapsingElementsEnded", function(e) {
                  Rexbuilder_Util_Editor.endLoading();
                });
              }
            }
            changedFrontLayout = false;
          }, 300);
        } else {
          var resize_info = _edit_dom_layout(chooseLayout());
          _updateGridsHeights();
        }

      }

      Rexbuilder_Util.windowIsResizing = false;
      firstResize = true;
    }
  };

  var _updateGridsHeights = function() {
    Rexbuilder_Util.$rexContainer
      .find(".grid-stack-row")
      .each(function(index, row) {
        var galleryEditorInstance = $(row).data()
          .plugin_perfectGridGalleryEditor;
        if (galleryEditorInstance !== undefined) {
          galleryEditorInstance.batchGridstack();
          galleryEditorInstance._defineDynamicPrivateProperties();
          galleryEditorInstance.updateGridstackStyles();
          galleryEditorInstance.updateBlocksHeight();
          galleryEditorInstance.commitGridstack();
          //waiting for gridstack commit
          setTimeout(galleryEditorInstance.createScrollbars(), 200);
        }
      });
  };

  var _stopBlockVideos = function($elem) {
    _stopVideo($elem.find(".grid-item-content"));
  };
  var _playBlockVideos = function($elem) {
    _playVideoFromBegin($elem.find(".grid-item-content"));
  };

  var _stopPluginsSection = function($section) {
    var $mp4Videos = $section.find(".mp4-player");
    var $vimeoVideos = $section.find(".vimeo-player");
    var $youtubeVideos = $section.find(".youtube-player");

    $.each($mp4Videos, function(i, video) {
      Rexbuilder_Util.stopVideo($(video));
    });

    $.each($vimeoVideos, function(i, video) {
      Rexbuilder_Util.stopVideo($(video));
    });

    $.each($youtubeVideos, function(i, video) {
      Rexbuilder_Util.stopVideo($(video));
    });
  };

  var _playPluginsSection = function($section) {
    var $mp4Videos = $section.find(".mp4-player");
    var $vimeoVideos = $section.find(".vimeo-player");
    var $youtubeVideos = $section.find(".youtube-player");

    $.each($mp4Videos, function(i, video) {
      Rexbuilder_Util.playVideoFromBegin($(video));
    });

    $.each($vimeoVideos, function(i, video) {
      Rexbuilder_Util.playVideoFromBegin($(video));
    });

    $.each($youtubeVideos, function(i, video) {
      Rexbuilder_Util.playVideoFromBegin($(video));
    });
  };

  var _stopVideo = function($target) {
    if ($target.hasClass("mp4-player")) {
      var mp4video = $target.children(".rex-video-wrap").find("video")[0];
      mp4video.currentTime = 0;
      mp4video.pause();
      // console.log("_stopVideo: faccio pause del video");
    } else if ($target.hasClass("vimeo-player")) {
      VimeoVideo.findVideo(
        $target.children(".rex-video-vimeo-wrap").find("iframe")[0]
      ).unload();
    } else if ($target.hasClass("youtube-player")) {
      if ($target.children(".rex-youtube-wrap").YTPGetPlayer() === undefined) {
        return;
      }
      $target.children(".rex-youtube-wrap").YTPStop();
    }
  };

  var _fixVideosAudioSection = function($section) {
    var $mp4Videos = $section.find(".mp4-player");
    var $vimeoVideos = $section.find(".vimeo-player");
    var $youtubeVideos = $section.find(".youtube-player");

    Rexbuilder_Util.fixVideoAudio($section);
    $.each($mp4Videos, function(i, video) {
      Rexbuilder_Util.fixVideoAudio($(video));
    });

    $.each($vimeoVideos, function(i, video) {
      Rexbuilder_Util.fixVideoAudio($(video));
    });

    $.each($youtubeVideos, function(i, video) {
      Rexbuilder_Util.fixVideoAudio($(video));
    });
  };

  var _fixYoutube = function($section) {
    var $youtubeVideos = $section.find(".rex-youtube-wrap");
    $.each($youtubeVideos, function(i, video) {
      var ytpObj = $(video);
      var $toggle = ytpObj
        .parents(".youtube-player")
        .eq(0)
        .children(".rex-video-toggle-audio");
      var ytpPlayer = ytpObj.YTPGetPlayer();
      if (ytpPlayer !== undefined) {
        ytpObj.optimizeDisplay();
        ytpObj.YTPPlay();
        if ($toggle.length != 0 && !$toggle.hasClass("user-has-muted")) {
          ytpObj.YTPUnmute();
        } else {
          ytpPlayer.mute();
          ytpPlayer.isMute = true;
          ytpPlayer.setVolume(0);
        }
      }
    });
  };

  var _fixVideoAudio = function($target) {
    var $toggle = $target.children("rex-video-toggle-audio");
    if ($target.hasClass("mp4-player")) {
      var mp4video = $target.children(".rex-video-wrap").find("video")[0];
      if ($toggle.length != 0 && !$toggle.hasClass("user-has-muted")) {
        $(mp4video).prop("muted", false);
      } else {
        $(mp4video).prop("muted", true);
      }
    } else if ($target.hasClass("vimeo-player")) {
      var vimPlayer = VimeoVideo.findVideo(
        $target.children(".rex-video-vimeo-wrap").find("iframe")[0]
      );
      if ($toggle.length != 0 && !$toggle.hasClass("user-has-muted")) {
        vimPlayer.setVolume(1);
      } else {
        vimPlayer.setVolume(0);
      }
    } else if ($target.hasClass("youtube-player")) {
      var ytpObj = $target.children(".rex-youtube-wrap");
      var ytpPlayer = ytpObj.YTPGetPlayer();
      if (ytpPlayer !== undefined) {
        if ($toggle.length != 0 && !$toggle.hasClass("user-has-muted")) {
          ytpObj.YTPUnmute();
        } else {
          ytpPlayer.mute();
          ytpPlayer.isMute = true;
          ytpPlayer.setVolume(0);
        }
      }
    }
  };

  var _playVideoFromBegin = function($target) {
    if ($target.hasClass("mp4-player")) {
      // console.log("_playVideoFromBegin: faccio play al video");
      var mp4video = $target.children(".rex-video-wrap").find("video")[0];
      mp4video.currentTime = 0;
      mp4video.play();
    } else if ($target.hasClass("vimeo-player")) {
      var vimPlayer = VimeoVideo.findVideo(
        $target.children(".rex-video-vimeo-wrap").find("iframe")[0]
      );
      vimPlayer.play();
    } else if ($target.hasClass("youtube-player")) {
      var ytpObj = $target.children(".rex-youtube-wrap");
      if (ytpObj.length != 0) {
        var ytpPlayer = ytpObj.YTPGetPlayer();
        if (ytpPlayer === undefined) {
          return;
        }
        ytpObj.YTPPlay();
      } else {
        return;
      }
    }
    setTimeout(
      function() {
        Rexbuilder_Util.fixVideoAudio($target);
      },
      500,
      $target
    );
  };

  var _destroyVideoPlugins = function() {
    //console.log(Rexbuilder_Util.$rexContainer.find(".youtube-player"));
  };

  var _launchVideoPlugins = function() {
    /* -- Launching YouTube Video -- */
    // declare object for video
    if (!jQuery.browser.mobile) {
      Rexbuilder_Util.$rexContainer
        .find(".rex-youtube-wrap")
        .each(function(i, el) {
          var $this = $(el);
          if (
            $this.YTPGetPlayer() === undefined &&
            !$this.hasClass("youtube-player-launching")
          ) {
            $this.YTPlayer();
            return;
          }
          $this.removeClass("youtube-player-launching");
        });
    } else {
      Rexbuilder_Util.$rexContainer
        .find(".rex-youtube-wrap")
        .each(function(i, el) {
          var $this = $(el),
            data_yt = eval("(" + $this.attr("data-property") + ")"),
            url = data_yt.videoURL,
            id = getYoutubeID(url);

          $this.css(
            "background-image",
            "url(http://img.youtube.com/vi/" + id + "/0.jpg)"
          );
          $this.click(function(e) {
            e.preventDefault();
            window.location.href = url;
          });
        });
      // $('.rex-video-wrap').getVideoThumbnail();
    }

    VimeoVideo.init();
  };

  var setContainer = function($container) {
    this.$rexContainer = $container;
  };

  /**
   * Javascript crossbrowser class search
   * @param {node} el js element
   * @param {string} c class name to find
   * @since 1.1.3
   */
  var _has_class = function(el, c) {
    if (el.classList) {
      return el.classList.contains(c);
    } else {
      return new RegExp("(^| )" + c + "( |$)", "gi").test(el.className);
    }
  };
  var _transitionEvent = "";
  var _animationEvent = "";

  var _scroll_timing = 600;

  function _smoothScroll($target) {
    $("body,html").animate(
      {
        scrollTop:
          $target.offset().top +
          _plugin_frontend_settings.scroll_animation_offset
      },
      600
    );
  }

  var _getGalleryInstance = function($section) {
    return $section.find(".grid-stack-row").data()
      .plugin_perfectGridGalleryEditor;
  };

  var removeCollapsedGrids = function() {
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function() {
        if (Rexbuilder_Util.galleryPluginActive) {
          var galleryInstance = _getGalleryInstance($(this));
          Rexbuilder_Dom_Util.collapseGrid(
            galleryInstance,
            false,
            galleryInstance.properties.dispositionBeforeCollapsing,
            galleryInstance.properties.layoutBeforeCollapsing
          );
        }
      });
  };

  var collapseAllGrids = function() {
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function(i) {
        if (Rexbuilder_Util.galleryPluginActive) {
          var galleryInstance = _getGalleryInstance($(this));
          galleryInstance._defineDynamicPrivateProperties();
          galleryInstance.collapseElements();
        }
      });
  };

  var _startVideoPlugin = function($target) {
    if ($target.hasClass("mp4-player")) {
    } else if ($target.hasClass("vimeo-player")) {
      var vimeoFrame = $target
        .children(".rex-video-vimeo-wrap")
        .find("iframe")[0];
      var opt = {
        autoplay: true,
        background: true,
        loop: true
      };
      VimeoVideo.addPlayer("1", vimeoFrame, opt);
    } else if ($target.hasClass("youtube-player")) {
      if ($target.children(".rex-youtube-wrap").YTPGetPlayer() === undefined) {
        $target.children(".rex-youtube-wrap").YTPlayer();
      }
    }
  };

  var _destroyVideo = function($target, detachDom) {
    var type = "";
    if ($target.hasClass("mp4-player")) {
      type = "mp4";
      Rexbuilder_Dom_Util.removeMp4Video($target, detachDom);
    } else if ($target.hasClass("vimeo-player")) {
      type = "vimeo";
      Rexbuilder_Dom_Util.removeVimeoVideo($target, detachDom);
    } else if ($target.hasClass("youtube-player")) {
      type = "youtube";
      Rexbuilder_Dom_Util.removeYoutubeVideo($target, detachDom);
    }
    return type;
  };

  var _pauseVideo = function($target) {
    if ($target.hasClass("mp4-player")) {
      $target
        .children(".rex-video-wrap")
        .find("video")[0]
        .pause();
      console.log("_pauseVideo: faccio pause del video");
    } else if ($target.hasClass("vimeo-player")) {
      var vimeoPlugin = VimeoVideo.findVideo(
        $target.children(".rex-video-vimeo-wrap").find("iframe")[0]
      );
      vimeoPlugin.pause();
    } else if ($target.hasClass("youtube-player")) {
      if ($target.children(".rex-youtube-wrap").YTPGetPlayer() === undefined) {
        return;
      }
      $target.children(".rex-youtube-wrap").YTPPause();
    }
  };

  //todo da finire ( non far partire video nascosti )
  var _playAllVideos = function() {
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function(i, section) {
        var $section = $(section);
        var $mp4Videos = $section.find(".mp4-player");
        var $vimeoVideos = $section.find(".vimeo-player");
        var $youtubeVideos = $section.find(".youtube-player");

        $.each($mp4Videos, function(i, video) {
          Rexbuilder_Util.playVideo($(video));
        });

        $.each($vimeoVideos, function(i, video) {
          Rexbuilder_Util.playVideo($(video));
        });

        $.each($youtubeVideos, function(i, video) {
          Rexbuilder_Util.playVideo($(video));
        });
        Rexbuilder_Util.playVideo($section);
      });
  };

  var _playVideo = function($target) {
    if ($target.hasClass("mp4-player")) {
      $target.find("video")[0].play();
    } else if ($target.hasClass("vimeo-player")) {
      var vimeoPlugin = VimeoVideo.findVideo($target.find("iframe")[0]);
      vimeoPlugin.play();
    } else if ($target.hasClass("youtube-player")) {
      if ($target.children(".rex-youtube-wrap").length != 0) {
        if (
          $target.children(".rex-youtube-wrap").YTPGetPlayer() === undefined
        ) {
          return;
        }
        $target.children(".rex-youtube-wrap").YTPPlay();
      } else {
        return;
      }
    }
  };

  var _getBackgroundUrlFromCss = function(styleBackground) {
    return styleBackground
      .replace("url(", "")
      .replace(")", "")
      .replace(/\"/gi, "");
  };

  var _getPaddingsDataString = function(paddingString) {
    var paddingsData = {
      top: "5",
      right: "5",
      bottom: "5",
      left: "5",
      type: "px"
    };
    if (paddingString != "") {
      var paddings = paddingString.split(/;/gm);
      paddingsData.top = parseInt(paddings[0].split(/\D+/gm)[0]);
      paddingsData.right = parseInt(paddings[1].split(/\D+/gm)[0]);
      paddingsData.bottom = parseInt(paddings[2].split(/\D+/gm)[0]);
      paddingsData.left = parseInt(paddings[3].split(/\D+/gm)[0]);

      var typePaddingActive = "";
      if (paddings[0].indexOf("%") != -1) {
        typePaddingActive = "%";
      } else {
        typePaddingActive = "px";
      }
      paddingsData.type = typePaddingActive;
    }
    return paddingsData;
  };

  var _paddingsToString = function(paddings) {
    var output = "";
    output += "" + paddings.top + paddings.type + ";";
    output += "" + paddings.right + paddings.type + ";";
    output += "" + paddings.bottom + paddings.type + ";";
    output += "" + paddings.left + paddings.type + ";";
    return output;
  };

  // init the utilities
  var init = function() {
    this.firstStart = true;
    _plugin_frontend_settings.scroll_animation_offset = 0;
    
    if ( _plugin_frontend_settings.user.logged && _plugin_frontend_settings.user.editing ) {
      this.editorMode = true;
    } else {
      this.editorMode = false;
      changedFrontLayout = false;
      var $availableDims = $("#layout-avaiable-dimensions");
      frontAvailableLayouts = ( $availableDims.length > 0 ? JSON.parse( $availableDims.text() ) : [] );
      startFrontLayout = _findFrontLayout();
      // console.log(frontAvailableLayouts);
      // console.log(startFrontLayout);
    }

    this.$window = $(window);
    this.$document = $(document);
    this.$body = $("body");
    $modelsCustomizationsDataDiv = $("#rexbuilder-model-data")
      .children(".models-customizations")
      .eq(0);
    $pageCustomizationsDataDiv = $("#rexbuilder-layout-data")
      .children(".layouts-customizations")
      .eq(0);
    $liveDataContainer = $("#rexbuilder-layout-data-live");
    $layoutsDomOrder = $("#rexbuilder-layouts-sections-order");
    $defaultLayoutState = $("#rexbuilder-default-layout-state");
    $usedIDSContainer = $("#sections-ids-used");
    _storeNamesUsed();
    this.$rexContainer = $(".rex-container");
    this.$loader = $(".rexlive-loader");
    this.backendEdited = false;
    if ( Rexbuilder_Util.$rexContainer.length > 0 && Rexbuilder_Util.$rexContainer.attr("data-backend-edited").toString() == "true" ) {
      Rexbuilder_Util.$rexContainer.addClass("backend-edited");
      this.backendEdited = true;
    }
    this.lastSectionNumber = -1;

    this.activeLayout = "";
    this.domUpdaiting = false;

    //da fixare, per adesso prende in cosiderazione solo la prima row, non tutte
    var oldResposiveBlockGrid = this.$rexContainer
      .children(".rexpansive_section")
      .eq(0)
      .attr("data-rex-collapse-grid");
    this.blockGridUnder768 =
      typeof oldResposiveBlockGrid != "undefined"
        ? oldResposiveBlockGrid.toString() == "false"
        : false;

    this.chosenLayoutData = null;

    _updateSectionsID();
    Rexbuilder_Dom_Util.fixModelNumbers();
    Rexbuilder_Dom_Util.fixModelNumbers();

    var l = chooseLayout();
    _edit_dom_layout(l);

    _updateSectionsNumber();

    _detect_mobile();

    this._transitionEvent = _whichTransitionEvent();
    this._animationEvent = _whichAnimationEvent();

    this.scrollbarProperties = {
      //className: "rex-overlay-scrollbar", per quando dobbiamo stilare usiamo questa classe
      className: "os-theme-dark",
      overflowBehavior: { x: "hidden" },
      autoUpdate: false
    };
    this.galleryPluginActive = false;
    this.firstStart = false;
  };

  return {
    init: init,
    viewport: _viewport,
    getYoutubeID: getYoutubeID,
    transitionEvent: _transitionEvent,
    animationEvent: _animationEvent,
    getQueryVariable: _getQueryVariable,
    checkPresentationPage: _checkPresentationPage,
    checkStaticPresentationPage: _checkStaticPresentationPage,
    checkPost: _checkPost,
    $window: $window,
    scroll_timing: _scroll_timing,
    fixSectionWidth: fixSectionWidth,
    editorMode: editorMode,
    windowIsResizing: windowIsResizing,
    addWindowListeners: addWindowListeners,
    launchVideoPlugins: _launchVideoPlugins,
    destroyVideoPlugins: _destroyVideoPlugins,
    stopPluginsSection: _stopPluginsSection,
    playPluginsSection: _playPluginsSection,
    stopBlockVideos: _stopBlockVideos,
    playBlockVideos: _playBlockVideos,
    chooseLayout: chooseLayout,
    setContainer: setContainer,
    createSectionID: _createSectionID,
    createBlockID: createBlockID,
    has_class: _has_class,
    responsiveLayouts: responsiveLayouts,
    defaultLayoutSections: defaultLayoutSections,
    edit_dom_layout: _edit_dom_layout,
    smoothScroll: _smoothScroll,
    getGalleryInstance: _getGalleryInstance,
    removeCollapsedGrids: removeCollapsedGrids,
    collapseAllGrids: collapseAllGrids,
    stopVideo: _stopVideo,
    playVideoFromBegin: _playVideoFromBegin,
    pauseVideo: _pauseVideo,
    playVideo: _playVideo,
    destroyVideo: _destroyVideo,
    startVideoPlugin: _startVideoPlugin,
    getBackgroundUrlFromCss: _getBackgroundUrlFromCss,
    getPaddingsDataString: _getPaddingsDataString,
    paddingsToString: _paddingsToString,
    playAllVideos: _playAllVideos,
    findLayoutType: _findLayoutType,
    updateModelsLive: _updateModelsLive,
    getLayoutSectionTargets: _getLayoutSectionTargets,
    updateElementDimensions: _updateElementDimensions,
    getGridLayout: _getGridLayout,
    customizationExists: _customizationExists,
    getDefaultBlockProps: _getDefaultBlockProps,
    fixVideosAudioSection: _fixVideosAudioSection,
    fixVideoAudio: _fixVideoAudio,
    fixYoutube: _fixYoutube,
    getModelsCustomizations: _getModelsCustomizations,
    updateModelsCustomizationsData: _updateModelsCustomizationsData,
    getPageCustomizations: _getPageCustomizations,
    updatePageCustomizationsData: _updatePageCustomizationsData,
    updatePageAvaiableLayoutsNames: _updatePageAvaiableLayoutsNames,
    getPageAvaiableLayoutsNames: _getPageAvaiableLayoutsNames,
    updateDivModelCustomizationsNames: _updateDivModelCustomizationsNames,
    getSectionCustomLayouts: _getSectionCustomLayouts,
    getLayoutLiveSectionTargets: _getLayoutLiveSectionTargets,
    getGridLayoutLive: _getGridLayoutLive,
    updateSectionStateLive: _updateSectionStateLive,
    updatePageCustomizationsDomOrder: _updatePageCustomizationsDomOrder,
    getPageCustomizationsDom: _getPageCustomizationsDom,
    updateDefaultLayoutState: _updateDefaultLayoutState,
    updateDefaultLayoutStateSection: _updateDefaultLayoutStateSection,
    updateDefaultLayoutStateDOMOrder: _updateDefaultLayoutStateDOMOrder,
    getDefaultLayoutState: _getDefaultLayoutState,
    updateSectionOrderCustomLayouts: _updateSectionOrderCustomLayouts,
    updateGridsHeights: _updateGridsHeights,
    getSectionNamesUsed: _getSectionNamesUsed,
    saveSectionNamesUsed: _saveSectionNamesUsed,
    addSectionID: _addSectionID,
    removeSectionID: _removeSectionID,
    createRandomID: createRandomID
  };
})(jQuery);
