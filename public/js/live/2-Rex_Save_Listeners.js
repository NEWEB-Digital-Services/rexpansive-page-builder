var Rex_Save_Listeners = (function($) {
  "use strict";

  function init() {
    Rexbuilder_Util.$document.on("rexlive:savePage", function(e) {
      var eventData = e.settings.data_to_send;
      var i, j, k, m, p, q;

      Rexbuilder_Util_Editor.savingPage = true;
      var idPost = parseInt($("#id-post").attr("data-post-id"));
      var activeLayoutName = Rexbuilder_Util.activeLayout;

      // WPCF7 Saving
      if ( 'undefined' !== typeof Rexbuilder_Rexwpcf7 ) {
        var formIDsInPage = Rexbuilder_Rexwpcf7_Editor.getIDsInPage();
        formIDsInPage.forEach(function(id) {
          Rexbuilder_Rexwpcf7_Editor.updateFormInDB(id);
        });
        if ( 0 !== formIDsInPage.length ) {
          Rexbuilder_Rexwpcf7_Editor.fixBlocksHeight();
        }
      }

      //getting custom css set in page
      var customCSS = $("#rexpansive-builder-style-inline-css")
        .text()
        .trim();

      // getting custom effects report
      var effects = _checkSpecialEffects();

      //creating customization of page
      Rexbuilder_Dom_Util.fixModelNumbers();
      var newCustomization = createCustomization(activeLayoutName);

      //updating customizations avaiable names
      var layoutsNames = Rexbuilder_Util.getPageAvaiableLayoutsNames();
      var flagNames = false;
      var tot_layoutsNames;
      for (i = 0, tot_layoutsNames = layoutsNames.length; i < tot_layoutsNames; i++) {
        if (layoutsNames[i] == newCustomization.name) {
          flagNames = true;
          break;
        }
      }
      if (!flagNames) {
        layoutsNames.push(newCustomization.name);
      }

      Rexbuilder_Util.updatePageAvaiableLayoutsNames(layoutsNames);
      Rexbuilder_Util.updatePageCustomizationsData(newCustomization);

			// Getting the RexButtons IDs in page scanning all the sections
			var rexButtonsIDsInPage = Rexbuilder_Rexbutton.findIDsInPage(false);

      var ajaxCalls = [];

      ajaxCalls.push(
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rexlive_save_buttons_in_page",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            post_id_to_update: idPost,
            ids: JSON.stringify(rexButtonsIDsInPage)
          },
          success: function(response) {
            if (response.success) {
              // Rex buttons ids on the page updated!
            }
          },
          error: function(response) {}
        })
      );

      //avaiable custom layouts
      ajaxCalls.push(
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rexlive_save_avaiable_layouts",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            post_id_to_update: idPost,
            names: layoutsNames
          },
          success: function(response) {
            if (response.success) {
              // Layout names updated!
            }
          },
          error: function(response) {}
        })
      );

      //custom css
      ajaxCalls.push(
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rexlive_save_custom_css",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            post_id_to_update: idPost,
            custom_css: customCSS
          },
          success: function(response) {
            if (response.success) {
              // Custom css updated!
            }
          },
          error: function(response) {}
        })
      );

      // custom effects
      ajaxCalls.push(
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rexlive_save_custom_effects",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            post_id_to_update: idPost,
            custom_effects: effects
          },
          success: function(response) {
            if (response.success) {
              // Custom css updated!
            }
          },
          error: function(response) {}
        })
      );

      if (activeLayoutName == "default") {
        var postClean = "";
        var shortcodePage = "";

        Rexbuilder_Util.updateDefaultLayoutState({
          pageData: newCustomization.sections,
          modelsData: Rexbuilder_Util.getModelsCustomizations()
        });

        // shortcode of page
        Rexbuilder_Util.$rexContainer
          .find(".rexpansive_section")
          .each(function() {
            var $section = $(this);
            if (!$section.hasClass("removing_section")) {
              if (!$section.hasClass("rex-model-section")) {
                shortcodePage += createSectionProperties(
                  $section,
                  "shortcode",
                  null
                );
              } else {
                shortcodePage +=
                  "[RexModel id=" +
                  $section.attr("data-rexlive-model-id") +
                  "][/RexModel]";
              }
            }
          });

        //fixing customizations in page
        var customizationsArray = [];
        // var flagSection;
        var flagTarget;
        customizationsArray = Rexbuilder_Util.getPageCustomizationsDom();
        var tot_customizationsArray, tot_newCustomization_sections, tot_customizationsArray_sections;
        for (i = 0, tot_customizationsArray = customizationsArray.length; i < tot_customizationsArray; i++) {
          var modelsNumbers = _countModels(customizationsArray[i].sections);
          for (j = 0, tot_newCustomization_sections = newCustomization.sections.length; j < tot_newCustomization_sections; j++) {
            //flagSection = false;
            for (k = 0, tot_customizationsArray_sections = customizationsArray[i].sections.length; k < tot_customizationsArray_sections; k++) {
              if (
                newCustomization.sections[j].section_rex_id ==
                customizationsArray[i].sections[k].section_rex_id
              ) {
                if (
                  customizationsArray[i].sections[
                    k
                  ].section_is_model.toString() == "true"
                ) {
                  for (m = 0; m < modelsNumbers.length; m++) {
                    if (
                      modelsNumbers[m].id ==
                      customizationsArray[i].sections[k].section_model_id
                    ) {
                      if (
                        parseInt(
                          newCustomization.sections[j].section_model_number
                        ) <= modelsNumbers[m].number
                      ) {
                        //flagSection = true;
                      }
                    }
                  }
                } else {
                  //flagSection = true;
                }

                //adding new blocks to custom layouts
                //if (flagSection && customizationsArray[i].sections[k].section_is_model.toString() != "true") {
                if (
                  customizationsArray[i].sections[
                    k
                  ].section_is_model.toString() != "true"
                ) {
                  if (
                    typeof customizationsArray[i].sections[k].targets ==
                      "undefined" ||
                    customizationsArray[i].sections[k].targets.length == 0
                  ) {
                    customizationsArray[i].sections[k].targets = [];
                    customizationsArray[i].sections[k].targets.push({
                      name: "self",
                      props: {}
                    });
                  }
                  for (
                    p = 1;
                    p < newCustomization.sections[j].targets.length;
                    p++
                  ) {
                    flagTarget = false;
                    for (
                      q = 1;
                      q < customizationsArray[i].sections[k].targets.length;
                      q++
                    ) {
                      if (
                        newCustomization.sections[j].targets[p].name ==
                        customizationsArray[i].sections[k].targets[q].name
                      ) {
                        flagTarget = true;
                      }
                    }
                    if (!flagTarget) {
                      var emptyTarget = {
                        name: newCustomization.sections[j].targets[p].name,
                        props: {}
                      };
                      customizationsArray[i].sections[k].targets.splice(
                        1,
                        0,
                        emptyTarget
                      );
                    }
                  }
                }
              }
            }
          }
        }
        customizationsArray.push(newCustomization);

        for (var i = 0; i < customizationsArray.length; i++) {
          Rexbuilder_Util.updatePageCustomizationsData( customizationsArray[i] );
          Rexbuilder_Util.updatePageCustomizationsDomOrder( customizationsArray[i] );
          ajaxCalls.push(
            $.ajax({
              type: "POST",
              dataType: "json",
              url: _plugin_frontend_settings.rexajax.ajaxurl,
              data: {
                action: "rexlive_save_customization_layout",
                nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                post_id_to_update: idPost,
                sections: JSON.stringify(customizationsArray[i].sections),
                layout_name: customizationsArray[i].name
              },
              success: function(response) {
                if (response.success) {
                  // console.log(
                  //   "layout " + response.data.layoutName + " updated!"
                  // );
                }
              },
              error: function(response) {}
            })
          );
        }

        //save shortcode page
        ajaxCalls.push(
          $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rexlive_save_shortcode",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
              post_id_to_update: idPost,
              clean_post: postClean,
              rex_shortcode: shortcodePage
            },
            success: function(response) {
              if (response.success) {
                // Shortcode updated!
                Rexbuilder_Util.$rexContainer.removeClass("backend-edited");
                Rexbuilder_Util.backendEdited = false;
              }
            },
            error: function(response) {}
          })
        );

        //save sections ids used
        var idsUsed = Rexbuilder_Util.getSectionNamesUsed();
        Rexbuilder_Util.saveSectionNamesUsed();
        ajaxCalls.push(
          $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rexlive_save_sections_rexids",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
              ids_used: JSON.stringify(idsUsed)
            },
            success: function(response) {
              if (response.success) {
                // Section names updated!
              }
            },
            error: function (response, textStatus, errorThrown) {
							Rexbuilder_Util.displayAjaxError(
								{
									response: response,
									textStatus: textStatus,
									errorThrown: errorThrown
								},
								'Error while saving sections IDs'
							);
						}
          })
				);

				// Blocks IDs used
				// (callback hell)
				ajaxCalls.push(
					$.ajax({
						type: 'GET',
						dataType: 'json',
						url: _plugin_frontend_settings.rexajax.ajaxurl,
						data: {
							action: 'rexlive_get_blocks_rexids',
							nonce_param: _plugin_frontend_settings.rexajax.rexnonce
						},
						success: function (response) {
							if (!response.success) {
								this.error(response, response.data[0].message, response.data[0].code);
								return;
							}

							// Synchronizing the IDs with the DB Array stored in Rexbuilder_Util
							Rexbuilder_Util.updateBlocksIDsUsed(JSON.parse(response.data.currentIDsUsed));

							// If a block is going to be removed, remove its ID from the used IDs Array.
							// Looping through all page sections because there could be some "new" sections
							// created by an undo event, so all sections need to be scanned and all the
							// blocks' IDs need to be updated according to their status (removing or not)
							Array.prototype.slice
								.call(Rexbuilder_Util.rexContainer.getElementsByClassName('rexpansive_section'))
								.forEach(function (section) {
									// Looping through all section's blocks
									Array.prototype.slice
										.call(section.getElementsByClassName('grid-stack-item'))
										.forEach(function (block) {
											if (Rexbuilder_Util.hasClass(section, 'removing_section')) {
												// Remove all blocks' RexIDs in the current section
												Rexbuilder_Util.removeBlockID(block.getAttribute('data-rexbuilder-block-id'));
											} else {
												var isRemovingBlock = Rexbuilder_Util.hasClass(block, 'removing_block');

												// Shorthand for less code nesting (not writing an if)
												Rexbuilder_Util[isRemovingBlock ? 'removeBlockID' : 'addBlockID'](
													block.getAttribute('data-rexbuilder-block-id')
												);
											}
										});
								});

							Rexbuilder_Util.saveBlocksIDsUsed();

							// Saving updated blocks' IDs in the DB
							$.ajax({
								type: 'POST',
								dataType: 'json',
								url: _plugin_frontend_settings.rexajax.ajaxurl,
								data: {
									action: 'rexlive_save_blocks_rexids',
									nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
									// Retrieving the DB Array stored in Rexbuilder_Util
									ids_used: JSON.stringify(Rexbuilder_Util.getBlocksIDsUsed())
								},
								success: function (response) {
									if (!response.success) {
										this.error(response, response.data[0].message, response.data[0].code);
										return;
									}
								},
								error: function (response, textStatus, errorThrown) {
									Rexbuilder_Util.displayAjaxError(
										{
											response: response,
											textStatus: textStatus,
											errorThrown: errorThrown
										},
										'Error while saving blocks IDs'
									);
								}
							});
						},
						error: function (response, textStatus, errorThrown) {
							Rexbuilder_Util.displayAjaxError(
								{
									response: response,
									textStatus: textStatus,
									errorThrown: errorThrown
								},
								'Error while getting blocks IDs'
							);
						}
					})
				);
      } else {
        //ajax calls
        ajaxCalls.push(
          $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rexlive_save_customization_layout",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
              post_id_to_update: idPost,
              sections: JSON.stringify(newCustomization.sections),
              layout_name: newCustomization.name
            },
            success: function(response) {
              if (response.success) {
                // console.log(
                //   "layout " + response.data.layoutName + " updated!"
                // );
                // console.log(newCustomization.sections);
              }
            },
            error: function(response) {}
          })
        );
      }

      // Can't pass a literal array, so use apply.
      $.when
        .apply($, ajaxCalls)
        .then(function() {
          // Do your success stuff
          Rexbuilder_Util_Editor.savingPage = false;
          var data = {
            eventName: "rexlive:savePageEnded",
            buttonData: eventData.buttonData,
            dataSaved: "page"
          };
          Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        })
        .fail(function() {
          // Probably want to catch failure
        })
        .always(function() {
          // Rexbuilder_Util_Editor.endLoading();
          // Or use always if you want to do the same thing
          // whether the call succeeds or fails
        });
    });

    Rexbuilder_Util.$document.on("rexlive:saveModel", function(e) {
      if (!Rexbuilder_Util.$rexContainer.hasClass("editing-model")) {
        return;
      }
      var ajaxCalls = [];
      Rexbuilder_Util_Editor.savingModel = true;
      var $section = Rexbuilder_Util.$rexContainer
        .find(".rex-model-section .update-model-button.unlocked")
        .eq(0)
        .parents(".rexpansive_section");
      var activeLayout = Rexbuilder_Util.activeLayout;
      var i;
      var modelID =
        typeof $section.attr("data-rexlive-model-id") != "undefined" ? $section.attr("data-rexlive-model-id") : "";
      var modelName =
        typeof $section.attr("data-rexlive-model-name") != "undefined" ? $section.attr("data-rexlive-model-name") : "";
      var modelEditedNumber =
        typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";

      var oldModels = Rexbuilder_Util.getModelsCustomizations();
      var modelActive = {};
      for (i = 0; i < oldModels.length; i++) {
        var model = oldModels[i];
        if (model.id == modelID) {
          modelActive = model;
        }
      }
      if (jQuery.isEmptyObject(modelActive)) {
        modelActive.id = modelID;
        modelActive.name = modelName;
        modelActive.customizations = [];
      }
      var modelCustomLayoutData = updateModel(
        modelActive,
        $section,
        activeLayout
      );

      Rexbuilder_Util.updateModelsCustomizationsData(modelCustomLayoutData);

      //updaiting names of avaiable layouts
      //ajax call for saving layouts type and names

      var modelSavingCustomizationNames = [];
      for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
        modelSavingCustomizationNames.push(
          modelCustomLayoutData.customizations[i].name
        );
      }
      var savingModelNamesData = {
        modelID: modelID,
        names: modelSavingCustomizationNames
      };
      Rexbuilder_Util.updateDivModelCustomizationsNames(savingModelNamesData);
      ajaxCalls.push(
        //aggiornamento nomi layout
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rexlive_save_avaiable_model_layouts_names",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            post_id_to_update: modelID,
            names: modelSavingCustomizationNames
          },
          success: function(response) {
            if (response.success) {
              // Model names updated!
            }
          },
          error: function(response) {}
        })
      );

      if (activeLayout != "default") {
        for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
          // have to update others model with same ID
          if (modelCustomLayoutData.customizations[i].name == activeLayout) {
            Rexbuilder_Util.updateModelsLive(
              modelID,
              createTargets($section, "default"),
              modelEditedNumber
            );
            ajaxCalls.push(
              $.ajax({
                type: "POST",
                dataType: "json",
                url: _plugin_frontend_settings.rexajax.ajaxurl,
                data: {
                  action: "rexlive_save_customization_model",
                  nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                  model_id_to_update: modelCustomLayoutData.id,
                  model_name: modelCustomLayoutData.customizations.name,
                  targets: JSON.stringify(
                    modelCustomLayoutData.customizations[i].targets
                  ),
                  layout_name: modelCustomLayoutData.customizations[i].name
                },
                success: function(response) {
                  if (response.success) {
                    // Custom models updated!
                  }
                },
                error: function(response) {}
              })
            );
            break;
          }
        }
      } else {
        var shortcode = createSectionProperties($section, "shortcode");

        var modelDataSaveShortcode = {
          model_id: modelID,
          post_title: modelName,
          post_content: shortcode
        };

        var dataModel = {
          modelName: modelName,
          model_number: $section.attr("data-rexlive-model-number"),
          html: "",
          modelID: modelID
        };
        ajaxCalls.push(
          $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rexlive_edit_model_shortcode_builder",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
              model_data: modelDataSaveShortcode
            },
            success: function(response) {
              if (response.success) {
                // Model shortcode updated!
                dataModel.html = response.data.model_html;
                Rexbuilder_Section.updateModelsHtmlLive(dataModel);
              }
            },
            error: function(response) {},
            complete: function(response) {}
          })
        );

        for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
          // have to update only active layout
          // if active is default, update all with new blocks
          ajaxCalls.push(
            $.ajax({
              type: "POST",
              dataType: "json",
              url: _plugin_frontend_settings.rexajax.ajaxurl,
              data: {
                action: "rexlive_save_customization_model",
                nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                model_id_to_update: modelCustomLayoutData.id,
                model_name: modelCustomLayoutData.customizations.name,
                targets: JSON.stringify(
                  modelCustomLayoutData.customizations[i].targets
                ),
                layout_name: modelCustomLayoutData.customizations[i].name
              },
              success: function(response) {
                if (response.success) {
                  // console.log(
                  //   "layout " + response.data.layoutName + " updated!"
                  // );
                }
              },
              error: function(response) {}
            })
          );
        }
      }

      // Can't pass a literal array, so use apply.
      $.when
        .apply($, ajaxCalls)
        .then(function() {
          // Do your success stuff
          var $button = Rexbuilder_Util.$rexContainer
            .find(".rex-model-section .update-model-button.unlocked")
            .eq(0);
          Rexbuilder_Dom_Util.updateLockEditModel($button, true);
          Rexbuilder_Util.$rexContainer.removeClass("editing-model");
          Rexbuilder_Util_Editor.savingModel = false;
          var data = {
            eventName: "rexlive:savePageEnded",
            dataSaved: "model",
            buttonData:
              typeof e.settings != "undefined" ? e.settings.data_to_send.buttonData : ""
          };
          Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        })
        .fail(function() {
          // Probably want to catch failure
        })
        .always(function() {
          // Or use always if you want to do the same thing
          // whether the call succeeds or fails
        });
    });

  }


  var createCustomization = function(layoutName) {
    var data = {
      name: layoutName,
      sections: []
    };
    data.sections = createSectionsCustomizations(layoutName);
    return data;
  };

  var createSectionsCustomizations = function(layoutName) {
    var output = [];
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section:not(.removing_section)")
      .each(function(i, sec) {
        var $section = $(sec);
        var sectionRexID = $section.attr("data-rexlive-section-id");

        var section_props = {
          section_rex_id: sectionRexID,
          targets: [],
          section_is_model: false,
          section_model_id: "",
          section_model_number: -1,
          section_hide: false,
          section_created_live: false
        };

        section_props.section_hide = $section.hasClass("rex-hide-section");

        if (!$section.hasClass("rex-model-section")) {
          section_props.targets = createTargets($section, layoutName);
        } else {
          section_props.section_is_model = true;
          section_props.section_model_id = $section.attr(
            "data-rexlive-model-id"
          );
          section_props.section_model_number = $section.attr(
            "data-rexlive-model-number"
          );
        }

        output.push(section_props);
      });
    return output;
  };

  var updateModel = function(model, $section, activeLayout, targets) {
    var customizations = [];
    var i, j, k;
    var flagBlock;
    //finding others customizations
    for (i = 0; i < model.customizations.length; i++) {
      if (model.customizations[i].name != activeLayout) {
        var customization = model.customizations[i];
        customizations.push(customization);
      }
    }

    targets = typeof targets !== "undefined" ? targets : createTargets($section, activeLayout);
    var newCustomization = {
      name: activeLayout,
      targets: targets
    };

    //if active layout is default, have to update custom layouts with new blocks
    if (activeLayout == "default") {
      for (i = 0; i < customizations.length; i++) {
        if (
          typeof customizations[i].targets == "undefined" ||
          customizations[i].targets == null ||
          customizations[i].targets.length == 0
        ) {
          customizations[i].targets = [];
          customizations[i].targets.push({
            name: "self",
            props: {}
          });
        }

        for (j = 1; j < newCustomization.targets.length; j++) {
          flagBlock = false;
          for (k = 1; k < customizations[i].targets.length; k++) {
            if (
              newCustomization.targets[j].name ==
              customizations[i].targets[k].name
            ) {
              flagBlock = true;
              break;
            }
          }
          if (!flagBlock) {
            var emptyTarget = {
              name: newCustomization.targets[j].name,
              props: {}
            };
            customizations[i].targets.splice(1, 0, emptyTarget);
          }
        }
      }
    }

    customizations.push(newCustomization);

    model.customizations = customizations;

    return model;
	};



  /*
    data-rexlive-section-edited="true"
    */
  var checkEditsSection = function(section) {
    return section.getAttribute("data-rexlive-section-edited") == "true";
  };

  /*
    data-rexlive-layout-changed="true"
    */
  var checkEditsLayoutGrid = function(gallery) {
    return gallery.getAttribute("data-rexlive-layout-changed") == "true";
  };

  /*
    data-rexlive-element-edited="true"
    */
  var checkEditsElement = function(elem) {
    return elem.getAttribute("data-rexlive-element-edited") == "true";
  };

  var createTargets = function($section, layoutName) {
    var section = $section[0];
    var targets = [];

    var section_props = {
      name: "self",
      props: {}
    };

    var gridGallery = section.querySelector(".grid-stack-row");
    var $gridGallery = $(gridGallery);
    var saveBlockDisposition = checkEditsLayoutGrid(gridGallery);

    if (layoutName == "default" || checkEditsSection(section)) {
      section_props.props = createSectionProperties( $section, "customLayout", null );
    }

    if ( section.getAttribute("data-rex-collapse-grid") == "true") {
      section_props.props.collapse_grid = true;
      if(!saveBlockDisposition && Rexbuilder_Util.isMobile()){
        section_props.props.pickDefaultSizeCollapse = true;
        saveBlockDisposition = false;
      } else {
        section_props.props.pickDefaultSizeCollapse = false;
      }
    }

    if (saveBlockDisposition) {
      section_props.props.gridEdited = true;
      section_props.props.full_height = gridGallery.getAttribute("data-full-height");
      section_props.props.layout = gridGallery.getAttribute("data-layout");
    } else {
      section_props.props.gridEdited = false;
    }

    targets.push(section_props);

    var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;
    var elementsOrdered = galleryIstance.getElementsTopBottom();
    var i, tot = elementsOrdered.length;

    galleryIstance.updateAllElementsProperties();

    for( i=0; i<tot; i ++ ) {
      if (! Rexbuilder_Util.hasClass(elementsOrdered[i], 'removing_block')) {
        var blockRexID = elementsOrdered[i].getAttribute("data-rexbuilder-block-id");
        var block_props = {
          name: blockRexID,
          props: {}
        };
        var check_edit = checkEditsElement(elementsOrdered[i]);

        if ( layoutName == "default" || saveBlockDisposition || check_edit ) {
          block_props.props = createBlockProperties( elementsOrdered[i], "customLayout", gridGallery );
        }

        if (
          layoutName != "default" &&
          saveBlockDisposition &&
          !check_edit
        ) {
          _clearPropsElem(block_props.props);
        }

        targets.push(block_props);
      }
    }
    return targets;
  };

  var _clearPropsElem = function(props) {
    for (var propName in props) {
      switch (propName) {
        case "rex_id":
        case "size_x":
        case "size_y":
        case "row":
        case "col":
        case "gs_start_h":
        case "gs_width":
        case "gs_height":
        case "gs_y":
        case "gs_x":
        case "block_dimensions_live_edited":
        // case "element_height_increased":
        case "element_real_fluid":
        case "hide":
        case "photoswipe":
          break;
        case "element_edited":
          props["element_edited"] = false;
          break;
        default:
          props[propName] = undefined;
          break;
      }
    }
  };

  var createCleanPost = function() {
    var post = "";
    Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function() {
      $(this)
        .children(".grid-stack-item")
        .each(function() {
          var $textWrap = $(this).find(".text-wrap");
          if ($textWrap.hasClass("medium-editor-element")) {
            var $textWrapNoEditor = $textWrap.clone(false);
            $textWrapNoEditor.children(".medium-insert-buttons").remove();
            $textWrapNoEditor.children(".text-editor-span-fix").remove();
            if ($textWrapNoEditor.text().trim().length != 0) {
              post += $textWrapNoEditor.html();
              post += "<br>";
            }
          } else {
            if ($textWrap.text().trim().length != 0) {
              post += $textWrap.html();
              post += "<br>";
            }
          }
        });
    });
    return post;
  };

  /**
   * Retrieve all the properties of a block, in JSON or SHORTCODE format
   * @param {jQuery Object} $elem block element to start
   * @param {string} mode customLayout|shortcode
   * @param {jQuery Object} $gridGallery parent gallery of the element
   */
  var createBlockProperties = function(elem, mode, gridGallery) {
    gridGallery = "undefined" !== typeof gridGallery ? gridGallery : elem.parentNode();
    var id = "",
      rex_id = "",
      type = "text",
      size_x = 1,
      size_y = 1,
      row = "",
      col = "",
      gs_start_h = 1,
      gs_width = 1,
      gs_height = 1,
      gs_y = "",
      gs_x = "",
      color_bg_block = "#ffffff",
      color_bg_block_active = "#ffffff",
      image_bg_block = "",
      image_width = 0,
      image_height = 0,
      id_image_bg_block = "",
      type_bg_block = "",
      image_size = "full",
      photoswipe = "",
      image_bg_elem_active = true,
      video_mp4_url = "",
      video_bg_id = "",
      video_bg_width = "",
      video_bg_height = "",
      video_bg_url = "",
      video_bg_url_vimeo = "",
      linkurl = "",
      block_custom_class = "",
      block_padding = "",
      overlay_block_color = "",
      overlay_block_color_active = false,
      zak_background = "",
      zak_side = "",
      zak_title = "",
      zak_icon = "",
      zak_foreground = "",
      block_animation = "fadeInUpBig",
      video_has_audio = "0",
      block_has_scrollbar = "false",
      block_dimensions_live_edited = "",
      block_flex_position = "",
      block_flex_img_position = "",
      slider_dimension_ratio = 1,
      block_ratio = 1,
      hide_block = false,
      // element_height_increased = 0,
      element_real_fluid = 0;

    var content = "";
    var textWrap;
    var itemContent = elem.querySelector('.grid-item-content');
    var itemData = elem.querySelector('.rexbuilder-block-data');
    var videoElem = elem.querySelector('.rex-video-wrap');

    id = elem.id;
    rex_id = elem.getAttribute("data-rexbuilder-block-id");
    // type = $itemData.attr('data-type') == "" ? "empty" : $itemData.attr('data-type');
    type = itemData.getAttribute("data-type") == "" ? "text" : itemData.getAttribute("data-type");
    size_x = elem.getAttribute("data-width");
    size_y = elem.getAttribute("data-height");
    row = elem.getAttribute("data-row");
    col = elem.getAttribute("data-col");
    gs_start_h = elem.getAttribute("data-gs-height");
    gs_width = elem.getAttribute("data-gs-width");
    gs_height = elem.getAttribute("data-gs-height");
    gs_y = elem.getAttribute("data-gs-y");
    gs_x = elem.getAttribute("data-gs-x");

    color_bg_block = itemData.getAttribute("data-color_bg_block") == null ? "" : itemData.getAttribute("data-color_bg_block");
    color_bg_block_active = itemData.getAttribute("data-color_bg_elem_active") != null ? itemData.getAttribute("data-color_bg_elem_active") : true;

    id_image_bg_block = itemData.getAttribute("data-id_image_bg_block") === null ? "" : itemData.getAttribute("data-id_image_bg_block");
    image_bg_block = itemData.getAttribute("data-image_bg_block") === null ? "" : itemData.getAttribute("data-image_bg_block");
    image_width = isNaN( parseInt( itemContent.getAttribute("data-background_image_width") ) ) ? "" : parseInt( itemContent.getAttribute("data-background_image_width") );
    image_height = isNaN( parseInt( itemContent.getAttribute("data-background_image_height") ) ) ? "" : parseInt( itemContent.getAttribute("data-background_image_height"));
    var defaultTypeImage = gridGallery.getAttribute("data-layout") == "fixed" ? "full" : "natural";
    type_bg_block = itemData.getAttribute("data-type_bg_block") == null ? defaultTypeImage : itemData.getAttribute("data-type_bg_block");
    image_size = itemData.getAttribute("data-image_size") == null ? "full" : itemData.getAttribute("data-image_size");
		photoswipe = itemData.getAttribute("data-photoswipe") === null ? "" : itemData.getAttribute("data-photoswipe");
    image_bg_elem_active = itemData.getAttribute("data-image_bg_elem_active") != null ? itemData.getAttribute("data-image_bg_elem_active") : true;

    video_bg_id = itemData.getAttribute("data-video_bg_id") === null ? "" : itemData.getAttribute("data-video_bg_id");
    // video dimensions fixes (we do not save them, we must save!)
    if ( videoElem ) {
      if ( '' == itemData.getAttribute("data-video_bg_width") || itemData.getAttribute("data-video_bg_width") === null ) {
        video_bg_width = videoElem.getAttribute('data-rex-video-width');
      } else {
        video_bg_width = itemData.getAttribute("data-video_bg_width");
      }

      if ( '' == itemData.getAttribute("data-video_bg_height") || itemData.getAttribute("data-video_bg_height") === null ) {
        video_bg_height = videoElem.getAttribute('data-rex-video-height');
      } else {
        video_bg_height = itemData.getAttribute("data-video_bg_height");
      }
    }

    // video_bg_width = itemData.getAttribute("data-video_bg_width") === null ? "" : itemData.getAttribute("data-video_bg_width");
    // video_bg_height = itemData.getAttribute("data-video_bg_height") === null ? "" : itemData.getAttribute("data-video_bg_height");
    video_mp4_url = itemData.getAttribute("data-video_mp4_url") === null ? "" : itemData.getAttribute("data-video_mp4_url");
    video_bg_url = itemData.getAttribute("data-video_bg_url") === null ? "" : itemData.getAttribute("data-video_bg_url");
    video_bg_url_vimeo = itemData.getAttribute("data-video_bg_url_vimeo") === null ? "" : itemData.getAttribute("data-video_bg_url_vimeo");
    video_has_audio = itemData.getAttribute("data-video_has_audio") === null ? false : itemData.getAttribute("data-video_has_audio");

    linkurl = itemData.getAttribute("data-linkurl") === null ? "" : itemData.getAttribute("data-linkurl");

    block_custom_class = itemData.getAttribute("data-block_custom_class") === null ? "" : itemData.getAttribute("data-block_custom_class");

    block_padding = itemData.getAttribute("data-block_padding") === null ? "" : itemData.getAttribute("data-block_padding");

    overlay_block_color = itemData.getAttribute("data-overlay_block_color") == null ? "" : itemData.getAttribute("data-overlay_block_color");
    overlay_block_color_active = itemData.getAttribute("data-overlay_block_color_active") != null ? itemData.getAttribute("data-overlay_block_color_active") : false;

    zak_background = itemData.getAttribute("data-zak_background") === null ? "" : itemData.getAttribute("data-zak_background");
    zak_side = itemData.getAttribute("data-zak_side") === null ? "" : itemData.getAttribute("data-zak_side");
    zak_title = itemData.getAttribute("data-zak_title") === null ? "" : itemData.getAttribute("data-zak_title");
    zak_icon = itemData.getAttribute("data-zak_icon") === null ? "" : itemData.getAttribute("data-zak_icon");
    zak_foreground = itemData.getAttribute("data-zak_foreground") === null ? "" : itemData.getAttribute("data-zak_foreground");
    block_animation = itemData.getAttribute("data-block_animation") === null ? "fadeInUpBig" : itemData.getAttribute("data-block_animation");

    block_has_scrollbar = itemData.getAttribute("data-block_has_scrollbar") === null ? "false" : itemData.getAttribute("data-block_has_scrollbar");

    if ( gridGallery.getAttribute("data-layout") == "masonry" ) {
      block_dimensions_live_edited = itemData.getAttribute("data-block_dimensions_live_edited") === null ? "" : itemData.getAttribute("data-block_dimensions_live_edited");
    } else {
      block_dimensions_live_edited = "";
    }

    block_flex_position = itemData.getAttribute("data-block_flex_position") == null ? "" : itemData.getAttribute("data-block_flex_position");

    block_flex_img_position = itemData.getAttribute("data-block_flex_img_position") == null ? "" : itemData.getAttribute("data-block_flex_img_position");

    block_ratio = ( elem.offsetHeight / elem.offsetWidth ).toFixed(3);

    if ( Rexbuilder_Util.hasClass( elem, "block-has-slider") ) {
      slider_dimension_ratio = block_ratio;
      // $itemData.attr( "data-slider_ratio", ($elem.outerHeight() / $elem.outerWidth()).toFixed(3) );
    } else {
      slider_dimension_ratio = '';
    }
    itemData.setAttribute("data-slider_ratio", slider_dimension_ratio);

    hide_block = Rexbuilder_Util.hasClass(elem, "rex-hide-element");

    // var parsedHeightIncreased = parseInt($itemData.attr("data-element_height_increased"));
    // element_height_increased = isNaN(parsedHeightIncreased) ? 0 : parsedHeightIncreased;

    var parsedElementRealFluid = parseInt( itemData.getAttribute("data-element_real_fluid") );
    element_real_fluid = ( isNaN( parsedElementRealFluid ) ? 0 : parsedElementRealFluid );

    if (mode == "shortcode") {
      textWrap = itemContent.querySelector('.text-wrap');
      if ( ! Rexbuilder_Util.hasClass( elem, "block-has-slider" ) ) {
        var savingBlock = textWrap.cloneNode(true);
        var tmpMIB = savingBlock.querySelector('.medium-insert-buttons');
        var tmpTESF = savingBlock.querySelector('.text-editor-span-fix');
        var tmpUS = savingBlock.querySelector('.ui-sortable');
        var tmpUSH = savingBlock.querySelector('.ui-sortable-handle');
        var tmpFIG = savingBlock.querySelector('figure');

        if ( tmpMIB ) { tmpMIB.parentNode.removeChild(tmpMIB); }
        if ( tmpTESF ) { tmpTESF.parentNode.removeChild(tmpTESF); }
        if ( tmpUS ) { Rexbuilder_Util.removeClass( tmpUS, 'ui-sortable' ); }
        if ( tmpUSH ) { Rexbuilder_Util.removeClass( tmpUS, 'ui-sortable-handle' ); }
        if ( tmpFIG ) {
          tmpFIG.removeAttribute('style');
          tmpFIG.removeAttribute('class');
				}

				// Replacing cf7 forms with appropriate shortcodes
				Array.prototype.slice.call(savingBlock.getElementsByClassName('rex-elements-paragraph')).forEach(function (el) {
					var formID = el.querySelector('.rex-element-wrapper').getAttribute('data-rex-element-id');
					var cf7Shortcode = el.querySelector('.string-shortcode').getAttribute('shortcode');

					// Replacing the outerHTML the HTML element gets entirely deleted
					el.outerHTML = '[RexFormWrapper id="' + formID + '"]' + cf7Shortcode + '[/RexFormWrapper]';
				});

				// Retrieve the block content
				if (savingBlock.textContent.trim() == '') {
					if (
						savingBlock.getElementsByTagName('iframe').length > 0 ||
						savingBlock.getElementsByTagName('img').length > 0 ||
						savingBlock.getElementsByTagName('i').length > 0 ||
						savingBlock.getElementsByTagName('form').length > 0 ||
						savingBlock.getElementsByTagName('hr').length > 0
					) {
						content = savingBlock.innerHTML.trim();
					} else {
						content = '';
					}
				} else {
					content = savingBlock.innerHTML.trim();

					// Why are we doing this after the retrieving of the HTML?
					Array.prototype.slice.call(savingBlock.getElementsByClassName('rex-button-data')).forEach(function (el) {
						el.removeAttribute('data-synchronize');
					});
				}
      } else {
        var sliderToSave = textWrap.querySelector('.rex-slider-wrap[data-rex-slider-active="true"]');

        if ( sliderToSave ) {
          var sliderID = parseInt( sliderToSave.getAttribute("data-slider-id") );
        }

        content = '[RexSlider slider_id="' + sliderID + '"]';
      }

      var output =
        "[RexpansiveBlock" +
        ' id="' + id + '"' +
        ' rexbuilder_block_id="' + rex_id + '"' +
        ' type="' + type + '"' +
        ' size_x="' + size_x + '"' +
        ' size_y="' + size_y + '"' +
        ' row="' + row + '"' +
        ' col="' + col + '"' +
        ' gs_start_h="' + gs_start_h + '"' +
        ' gs_width="' + gs_width + '"' +
        ' gs_height="' + gs_height + '"' +
        ' gs_y="' + gs_y + '"' +
        ' gs_x="' + gs_x + '"' +
        ' element_real_fluid="' + element_real_fluid + '"' +
        ' color_bg_block="' + color_bg_block + '"' +
        ' color_bg_block_active="' + color_bg_block_active + '"' +
        ' image_bg_block="' + image_bg_block + '"' +
        ' id_image_bg_block="' + id_image_bg_block + '"' +
        ' image_bg_elem_active="' + image_bg_elem_active + '"' +
        ' video_bg_id="' + video_bg_id + '"' +
        ' video_bg_width="' + video_bg_width + '"' +
        ' video_bg_height="' + video_bg_height + '"' +
        ' video_mp4_url="' + video_mp4_url + '"' +
        ' video_bg_url="' + video_bg_url + '"' +
        ' video_bg_url_vimeo="' + video_bg_url_vimeo + '"' +
        ' type_bg_block="' + type_bg_block + '"' +
        ' image_size="' + image_size + '"' +
        ' photoswipe="' + photoswipe + '"' +
        ' linkurl="' + linkurl + '"' +
        ' block_custom_class="' + block_custom_class + '"' +
        ' block_padding="' + block_padding + '"' +
        ' overlay_block_color="' + overlay_block_color + '"' +
        ' overlay_block_color_active="' + overlay_block_color_active + '"' +
        ( '' !== zak_background ? ' zak_background="' + zak_background + '"' : '' ) +
        ( '' !== zak_side ? ' zak_side="' + zak_side + '"' : '' ) +
        ( '' !== zak_title ? ' zak_title="' + zak_title + '"' : '' ) +
        ( '' !== zak_icon ? ' zak_icon="' + zak_icon + '"' : '' ) +
        ( '' !== zak_foreground ? ' zak_foreground="' + zak_foreground + '"' : '' ) +
        ' block_animation="' + block_animation + '"' +
        ' video_has_audio="' + (video_has_audio.toString() == "true" ? "1" : "0") + '"' +
        ' block_has_scrollbar="' + block_has_scrollbar + '"' +
        ' block_flex_position="' + block_flex_position + '"' +
        ' block_flex_img_position="' + block_flex_img_position + '"' +
        ']' +
        content +
        "[/RexpansiveBlock]";
      return output;
    } else if (mode == "customLayout") {

      var sectionId = $(gridGallery).parents('.rexpansive_section').attr('data-rexlive-section-id');
      var traceBlockData = Rexbuilder_Util.editedDataInfo.getBlockData( sectionId, rex_id );

      var props = {};

			props['hide'] = hide_block;

      if (Rexbuilder_Util.activeLayout == "default") {
        props["element_edited"] = false;
      } else {
        props["element_edited"] = true;
      }
      props["rexbuilder_block_id"] = rex_id;
      props["type"] = type;
      props["size_x"] = size_x;
      props["size_y"] = size_y;
      props["row"] = row;
      props["col"] = col;
      props["gs_start_h"] = gs_start_h;
      props["gs_width"] = gs_width;
      props["gs_height"] = gs_height;
      props["gs_y"] = gs_y;
      props["gs_x"] = gs_x;
      // props["element_height_increased"] = element_height_increased;
      props["element_real_fluid"] = element_real_fluid;
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.color_bg_block ) ) {
        props["color_bg_block"] = color_bg_block;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.color_bg_block_active ) ) {
        props["color_bg_block_active"] = color_bg_block_active;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.image_bg_url ) ) {
        props["image_bg_url"] = image_bg_block;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.image_width ) ) {
        props["image_width"] = image_width;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.image_height ) ) {
        props["image_height"] = image_height;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.id_image_bg ) ) {
        props["id_image_bg"] = id_image_bg_block;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.image_size ) ) {
        props["image_size"] = image_size;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.image_bg_elem_active ) ) {
        props["image_bg_elem_active"] = image_bg_elem_active;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.type_bg_image ) ) {
        props["type_bg_image"] = type_bg_block;
      }

      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.video_bg_id ) ) {
        props["video_bg_id"] = video_bg_id;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.video_bg_width ) ) {
        props["video_bg_width"] = video_bg_width;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.video_bg_height ) ) {
        props["video_bg_height"] = video_bg_height;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.video_mp4_url ) ) {
        props["video_mp4_url"] = video_mp4_url;
      }

      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.video_bg_url_youtube ) ) {
        props["video_bg_url_youtube"] = video_bg_url;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.video_bg_url_vimeo ) ) {
        props["video_bg_url_vimeo"] = video_bg_url_vimeo;
      }

      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.photoswipe ) ) {
        props["photoswipe"] = photoswipe;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.block_custom_class ) ) {
        props["block_custom_class"] = block_custom_class;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.block_padding ) ) {
        props["block_padding"] = block_padding;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.overlay_block_color ) ) {
        props["overlay_block_color"] = overlay_block_color;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.overlay_block_color_active ) ) {
        props["overlay_block_color_active"] = overlay_block_color_active;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.linkurl ) ) {
        props["linkurl"] = linkurl;
      }
      if ( '' !== zak_background ) props["zak_background"] = zak_background;
      if ( '' !== zak_side ) props["zak_side"] = zak_side;
      if ( '' !== zak_title ) props["zak_title"] = zak_title;
      if ( '' !== zak_icon ) props["zak_icon"] = zak_icon;
      if ( '' !== zak_foreground ) props["zak_foreground"] = zak_foreground;
      props["block_animation"] = block_animation;
      props["video_has_audio"] = video_has_audio;
      props["block_has_scrollbar"] = block_has_scrollbar;
      // props["block_dimensions_live_edited"] = block_dimensions_live_edited;
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.block_flex_position ) ) {
        props["block_flex_position"] = block_flex_position;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceBlockData && traceBlockData.block_flex_img_position ) ) {
        props["block_flex_img_position"] = block_flex_img_position;
      }
      props["slider_dimension_ratio"] = slider_dimension_ratio;
      props["block_ratio"] = block_ratio;
      return props;
    }
  };

  var createSectionProperties = function($section, mode, newID) {
    var section_name = "",
      section_nav_label = '',
      type = "perfect-grid",
      color_bg_section = "#ffffff",
      color_bg_section_active = "true",
      dimension = "full",
      margin = "",
      image_bg_section = "",
      image_width = 0,
      image_height = 0,
      image_size="full",
      id_image_bg_section = "",
      image_bg_section_active = "",
      video_bg_url_section = "",
      video_bg_id_section = "",
      video_bg_width_section = "",
      video_bg_height_section = "",
      video_mp4_url = "",
      video_bg_url_vimeo_section = "",
      full_height = "",
      block_distance = 20,
      layout = "fixed",
      responsive_background = "",
      custom_classes = "",
      section_width = "",
      row_separator_top = "",
      row_separator_bottom = "",
      row_separator_right = "",
      row_separator_left = "",
      row_margin_top = "",
      row_margin_bottom = "",
      row_margin_right = "",
      row_margin_left = "",
      row_active_photoswipe = "",
      row_overlay_color = "",
      row_overlay_active = "",
      rexlive_section_id = "",
      collapse_grid = false,
      rexlive_model_id = "",
      rexlive_model_name = "",
      grid_cell_width = 1;

    var output = "";
    var section = $section[0];
    var $gridGallery = $section.find(".grid-stack-row");
    var gridGallery = $gridGallery[0];
    var sectionData = section.querySelector('.section-data');
    var videoElem = section.querySelector('.rex-video-wrap');

    var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;

    section_name = section.getAttribute("data-rexlive-section-name");

    section_nav_label = null === sectionData.getAttribute('data-section_nav_label') ? '' : sectionData.getAttribute('data-section_nav_label');

    type = sectionData.getAttribute("data-type") === null ? "perfect-grid" : sectionData.getAttribute("data-type");

    color_bg_section = sectionData.getAttribute("data-color_bg_section") == null ? "" : sectionData.getAttribute("data-color_bg_section");
    color_bg_section_active = sectionData.getAttribute("data-color_bg_section_active") == null ? true : sectionData.getAttribute("data-color_bg_section_active");

    margin = sectionData.getAttribute("data-margin") === null ? "" : sectionData.getAttribute("data-margin");

    image_bg_section = sectionData.getAttribute("data-image_bg_section") === null ? "" : sectionData.getAttribute("data-image_bg_section");
    image_width = section.getAttribute("data-background_image_width") === null
        ? ""
        : isNaN(parseInt(section.getAttribute("data-background_image_width")))
        ? ""
        : parseInt(section.getAttribute("data-background_image_width"));
    image_height =
      section.getAttribute("data-background_image_height") === null
        ? ""
        : isNaN(parseInt(section.getAttribute("data-background_image_height")))
        ? ""
        : parseInt(section.getAttribute("data-background_image_height"));
    image_size = sectionData.getAttribute("data-image_size") == null ? "full" : sectionData.getAttribute("data-image_size");
    id_image_bg_section = sectionData.getAttribute("data-id_image_bg_section") === null ? "" : sectionData.getAttribute("data-id_image_bg_section");
    image_bg_section_active = sectionData.getAttribute("data-image_bg_section_active") == null ? true : sectionData.getAttribute("data-image_bg_section_active");

    video_mp4_url = sectionData.getAttribute("data-video_mp4_url") === null ? "" : sectionData.getAttribute("data-video_mp4_url");
    video_bg_url_section = sectionData.getAttribute("data-video_bg_url_section") === null ? "" : sectionData.getAttribute("data-video_bg_url_section");
    video_bg_id_section = sectionData.getAttribute("data-video_bg_id_section") === null ? "" : sectionData.getAttribute("data-video_bg_id_section");

    // video dimensions fixes (we do not save them, we must save!)
    if ( videoElem ) {
      if ( '' == sectionData.getAttribute("data-video_bg_width_section") || sectionData.getAttribute("data-video_bg_width_section") === null ) {
        video_bg_width_section = videoElem.getAttribute('data-rex-video-width');
      } else {
        video_bg_width_section = sectionData.getAttribute("data-video_bg_width_section");
      }

      if ( '' == sectionData.getAttribute("data-video_bg_height_section") || sectionData.getAttribute("data-video_bg_height_section") === null ) {
        video_bg_height_section = videoElem.getAttribute('data-rex-video-height');
      } else {
        video_bg_height_section = sectionData.getAttribute("data-video_bg_height_section");
      }
    }

    // video_bg_width_section = sectionData.getAttribute("data-video_bg_width_section") === null ? "" : sectionData.getAttribute("data-video_bg_width_section");
    // video_bg_height_section = sectionData.getAttribute("data-video_bg_height_section") === null ? "" : sectionData.getAttribute("data-video_bg_height_section");
    video_bg_url_vimeo_section = sectionData.getAttribute("data-video_bg_url_vimeo_section") === null ? "" : sectionData.getAttribute("data-video_bg_url_vimeo_section");

    full_height = gridGallery.getAttribute("data-full-height") === null ? "" : gridGallery.getAttribute("data-full-height");
    layout = gridGallery.getAttribute("data-layout") === null ? "" : gridGallery.getAttribute("data-layout");
    custom_classes = sectionData.getAttribute("data-custom_classes") === null ? "" : sectionData.getAttribute("data-custom_classes");

    section_width = $gridGallery.parent().css("max-width");
    dimension = section_width === "100%" || section_width == "none" ? "full" : "boxed";

    var grid_gutter = parseInt( gridGallery.getAttribute("data-separator") );
    var grid_separator_top = parseInt( gridGallery.getAttribute("data-row-separator-top") );
    var grid_separator_right = parseInt( gridGallery.getAttribute("data-row-separator-right") );
    var grid_separator_bottom = parseInt( gridGallery.getAttribute("data-row-separator-bottom") );
    var grid_separator_left = parseInt( gridGallery.getAttribute("data-row-separator-left") );

    var row_distances = {
      gutter: isNaN(grid_gutter) ? "" : grid_gutter,
      top: isNaN(grid_separator_top) ? "" : grid_separator_top,
      right: isNaN(grid_separator_right) ? "" : grid_separator_right,
      bottom: isNaN(grid_separator_bottom) ? "" : grid_separator_bottom,
      left: isNaN(grid_separator_left) ? "" : grid_separator_left
    };

    block_distance = row_distances.gutter;
    row_separator_top = row_distances.top;
    row_separator_right = row_distances.right;
    row_separator_bottom = row_distances.bottom;
    row_separator_left = row_distances.left;

    var sectionComputedStyle = getComputedStyle(section);

    var section_margin_top = parseInt( sectionComputedStyle["margin-top"].replace("px", "") );
    var section_margin_right = parseInt( sectionComputedStyle["margin-right"].replace("px", "") );
    var section_margin_bottom = parseInt( sectionComputedStyle["margin-bottom"].replace("px", "") );
    var section_margin_left = parseInt( sectionComputedStyle["margin-left"].replace("px", "") );

    var rowMargins = {
      top: isNaN(section_margin_top) ? "" : section_margin_top,
      right: isNaN(section_margin_right) ? "" : section_margin_right,
      bottom: isNaN(section_margin_bottom) ? "" : section_margin_bottom,
      left: isNaN(section_margin_left) ? "" : section_margin_left
    };

    row_margin_top = rowMargins.top;
    row_margin_right = rowMargins.right;
    row_margin_bottom = rowMargins.bottom;
    row_margin_left = rowMargins.left;

    row_active_photoswipe = sectionData.getAttribute("data-row_active_photoswipe") == null ? "0" : sectionData.getAttribute("data-row_active_photoswipe");

    responsive_background = sectionData.getAttribute("data-responsive_background") === null ? "" : sectionData.getAttribute("data-responsive_background");
    row_overlay_color = sectionData.getAttribute("data-row_overlay_color") == null ? "" : sectionData.getAttribute("data-row_overlay_color");
    if (row_overlay_color == "") {
      row_overlay_color = responsive_background;
    }
    row_overlay_active = sectionData.getAttribute("data-row_overlay_active") == null ? false : sectionData.getAttribute("data-row_overlay_active");

    if (typeof newID == "undefined" || newID === null) {
      rexlive_section_id = section.getAttribute("data-rexlive-section-id") == null ? "" : section.getAttribute("data-rexlive-section-id");
    } else {
      rexlive_section_id = newID;
    }

    collapse_grid = section.getAttribute("data-rex-collapse-grid") == null ? false : section.getAttribute("data-rex-collapse-grid").toString() == "true";

    rexlive_model_id = section.getAttribute("data-rexlive-model-id") == null ? "" : section.getAttribute("data-rexlive-model-id");
    rexlive_model_name = section.getAttribute("data-rexlive-model-name") == null ? "" : section.getAttribute("data-rexlive-model-name");
    grid_cell_width = Rexbuilder_Util.getGalleryInstance( $section ).properties.singleWidth;

    if (mode == "shortcode") {
      output =
        "[RexpansiveSection" +
        ' section_name="' + section_name + '"' +
        ' section_nav_label="' + section_nav_label + '"' +
        ' type="' + type + '"' +
        ' color_bg_section="' + color_bg_section + '"' +
        ' color_bg_section_active="' + color_bg_section_active + '"' +
        ' dimension="' + dimension + '"' +
        ' image_bg_section_active="' + image_bg_section_active + '"' +
        ' image_bg_section="' + image_bg_section + '"' +
        ' id_image_bg_section="' + id_image_bg_section + '"' +
        ' image_size="' + image_size + '"' +
        ' video_bg_url_section="' + video_bg_url_section + '"' +
        ' video_bg_id_section="' + video_bg_id_section + '"' +
        ' video_bg_width_section="' + video_bg_width_section + '"' +
        ' video_bg_height_section="' + video_bg_height_section + '"' +
        ' video_bg_url_vimeo_section="' + video_bg_url_vimeo_section + '"' +
        ' full_height="' + full_height + '"' +
        ' block_distance="' + block_distance + '"' +
        ' layout="' + layout + '"' +
        ' responsive_background="' + responsive_background + '"' +
        ' custom_classes="' + custom_classes + '"' +
        ' section_width="' + section_width + '"' +
        ' row_separator_top="' + row_separator_top + '"' +
        ' row_separator_bottom="' + row_separator_bottom + '"' +
        ' row_separator_right="' + row_separator_right + '"' +
        ' row_separator_left="' + row_separator_left + '"' +
        ' margin="' + margin + '"' +
        ' row_margin_top="' + row_margin_top + '"' +
        ' row_margin_bottom="' + row_margin_bottom + '"' +
        ' row_margin_right="' + row_margin_right + '"' +
        ' row_margin_left="' + row_margin_left + '"' +
        ' row_active_photoswipe="' + row_active_photoswipe + '"' +
        ' row_overlay_color="' + row_overlay_color + '"' +
        ' row_overlay_active="' + row_overlay_active + '"' +
        ' rexlive_section_id="' + rexlive_section_id + '"' +
        ' rexlive_model_id="' + rexlive_model_id + '"' +
        ' rexlive_model_name="' + rexlive_model_name + '"' +
        ' row_edited_live="true"]';

      galleryIstance.updateAllElementsProperties();

      var elementsOrdered = galleryIstance.getElementsTopBottom();

      // create elements shortcode
      elementsOrdered.forEach(function(el) {
        if ( ! Rexbuilder_Util.hasClass( el, 'removing_block' ) ) {
          output += createBlockProperties(el, "shortcode", gridGallery);
        }
      });

      output += fillGridEmptySpaces(galleryIstance);

      output += "[/RexpansiveSection]";
      return output;
    } else if (mode == "customLayout") {

      var traceSectionData = Rexbuilder_Util.editedDataInfo.getSectionData( rexlive_section_id );

      var props = {};

      props["collapse_grid"] = collapse_grid;
			props["grid_cell_width"] = grid_cell_width;

      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.section_name ) ) {
        props["section_name"] = section_name;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.section_nav_label ) ) {
        props["section_nav_label"] = section_nav_label;
      }
      props["type"] = type;
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.color_bg_section ) ) {
        props["color_bg_section"] = color_bg_section;
      }
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.color_bg_section_active ) ) {
        props["color_bg_section_active"] = color_bg_section_active;
      }
      props["dimension"] = dimension;
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.margin ) ) {
        props["margin"] = margin;
      }
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.image_bg_section_active ) ) {
        props["image_bg_section_active"] = image_bg_section_active;
      }
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.image_bg_section ) ) {
        props["image_bg_section"] = image_bg_section;
      }
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.image_width ) ) {
        props["image_width"] = image_width;
      }
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.image_height ) ) {
        props["image_height"] = image_height;
      }
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.id_image_bg_section ) ) {
        props["id_image_bg_section"] = id_image_bg_section;
      }
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.image_size ) ) {
        props["image_size"] = image_size;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.video_bg_id ) ) {
        props["video_bg_id"] = video_bg_id_section;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.video_bg_width_section ) ) {
        props["video_bg_width_section"] = video_bg_width_section;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.video_bg_height_section ) ) {
        props["video_bg_height_section"] = video_bg_height_section;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.video_mp4_url ) ) {
        props["video_mp4_url"] = video_mp4_url;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.video_bg_url_section ) ) {
        props["video_bg_url_section"] = video_bg_url_section;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.video_bg_url_vimeo_section ) ) {
        props["video_bg_url_vimeo_section"] = video_bg_url_vimeo_section;
			}

			props['full_height'] = full_height;

      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.block_distance ) ) {
        props["block_distance"] = block_distance;
			}

			props["layout"] = layout;

      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.custom_classes ) ) {
        props["custom_classes"] = custom_classes;
      }
      props["section_width"] = section_width;
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_separator_top ) ) {
        props["row_separator_top"] = row_separator_top;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_separator_bottom ) ) {
        props["row_separator_bottom"] = row_separator_bottom;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_separator_right ) ) {
        props["row_separator_right"] = row_separator_right;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_separator_left ) ) {
        props["row_separator_left"] = row_separator_left;
      }
      // default always save, otherwise check
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_margin_top ) ) {
        props["row_margin_top"] = row_margin_top;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_margin_bottom ) ) {
        props["row_margin_bottom"] = row_margin_bottom;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_margin_right ) ) {
        props["row_margin_right"] = row_margin_right;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_margin_left ) ) {
        props["row_margin_left"] = row_margin_left;
      }

      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_overlay_color ) ) {
        props["row_overlay_color"] = row_overlay_color;
      }
      if ( 'default' === Rexbuilder_Util.activeLayout || ( 'default' !== Rexbuilder_Util.activeLayout && traceSectionData && traceSectionData.row_overlay_active ) ) {
        props["row_overlay_active"] = row_overlay_active;
      }
      props["rexlive_model_id"] = rexlive_model_id;
      props["rexlive_model_name"] = rexlive_model_name;
      props["section_edited"] = true;
      return props;
    }
  };

  var fillGridEmptySpaces = function(galleryIstance) {
    var output = "";
    var i;
    var id = galleryIstance.getLastID();
    var rowNumber = galleryIstance.getRowNumber();
    var emptyBlocks = galleryIstance.fillEmptySpaces();

    for (i = 0; i < emptyBlocks.length; i++) {
      id = id + 1;
      output += createEmptyBlockBackendFixShortcode(
        rowNumber,
        id,
        emptyBlocks[i]
      );
    }

    return output;
  };

  var createEmptyBlockBackendFixShortcode = function(rowNumber, id, blockObj) {
    var output =
      "[RexpansiveBlock" +
      ' id="block_' +
      rowNumber +
      "_" +
      id +
      '" type="empty"' +
      ' col="' +
      (blockObj.x + 1) +
      '" row="' +
      (blockObj.y + 1) +
      '" size_x="' +
      blockObj.w +
      '" size_y="' +
      blockObj.h +
      '" color_bg_block=""' +
      ' image_bg_block=""' +
      ' id_image_bg_block=""' +
      ' type_bg_block=""' +
      ' photoswipe=""' +
      ' linkurl=""' +
      ' empty_block_backend_fix="' +
      true +
      '"][/RexpansiveBlock]';
    return output;
  };

  var _countModels = function(sections) {
    var models = [];
    var i, j;
    var tot_sections, tot_models;

    for (i = 0, tot_sections = sections.length; i < tot_sections; i++) {
      if (sections[i].section_is_model.toString() == "true") {
        var modelID = sections[i].section_model_id;
        for (j = 0, tot_models = models.length; j < tot_models; j++) {
          if (models[j].id == modelID) {
            models[j].number = models[j].number + 1;
            break;
          }
        }
        if (j == tot_models) {
          var model = {
            id: modelID,
            number: 1
          };
          models.push(model);
        }
      }
    }

    return models;
  };

  /**
   * Checking if are present some special effects inside the page
   * Checking all customizations for:
   * - section classes
   * - block classes
   * - block content
   *
   * @return {Object} list of effects and their state in the page
   * @since  2.0.0
   */
  var _checkSpecialEffects = function() {
    var blocks;
    var text, blockData, blockCustomClass, sectionData, sectionCustomClass, sectionRexID, sectionTargets, sectionDef;
    var i,len,z,l;
    var sections = [].slice.call( Rexbuilder_Util.rexContainer.querySelectorAll('.rexpansive_section:not(.removing_section)') );
    var layoutData = document.getElementById('rexbuilder-layout-data');
    // effects to check
    var effects = [
      {
        condition: 'rex-effect',
        active: false
      },
      {
        condition: 'rex-num-spin',
        active: false
      },
      {
        condition: 'rex-slideshow',
        active: false
      },
      {
        condition: 'sticky-section',
        active: false
      },
      // {
      //   condition: 'fadeUpTextCSS',
      //   active: false
      // },
      {
        condition: 'reveal-opacity-on-scroll',
        active: false
      },
      {
        condition: 'distance-accordion-toggle',
        active: false
      },
      {
        condition: 'rex-indicator__',
        active: false
      },
      {
        condition: 'popup-content-button',
        active: false
      },
      {
        condition: 'split-scrollable',
        active: false
      },
      {
        condition: 'particle-swarm',
        active: false
      }
    ];

    sections.forEach( function( section ) {
      // check all customizations
      sectionRexID = section.getAttribute( 'data-rexlive-section-id' );
      if ( sectionRexID ) {
        sectionTargets = [].slice.call( layoutData.querySelectorAll('[data-section-rex-id="' + sectionRexID + '"]') );
        sectionTargets.forEach( function( target ) {
          if ( '' !== target.innerText ) {
            sectionDef = JSON.parse( target.innerText );
            for( i = 0, len = sectionDef.length; i < len; i++ ) {
              for( z=0,l = effects.length; z < l; z++ ) {
                if ( 'undefined' !== typeof sectionDef[i].props.custom_classes ) {
                  if( -1 !== sectionDef[i].props.custom_classes.indexOf( effects[z].condition ) ) {
                    effects[z].active = true;
                  }
                }
                if ( 'undefined' !== typeof sectionDef[i].props.block_custom_class ) {
                  if( -1 !== sectionDef[i].props.block_custom_class.indexOf( effects[z].condition ) ) {
                    effects[z].active = true;
                  }
                }
              }
            }
          }
        });
      }

      // check section class
      sectionData = section.querySelector( '.section-data' );
      if ( sectionData ) {
        sectionCustomClass = sectionData.getAttribute( 'data-custom_classes' );
        if ( sectionCustomClass ) {
          for( z=0,l = effects.length; z < l; z++ ) {
            if( -1 !== sectionCustomClass.indexOf( effects[z].condition ) ) {
              effects[z].active = true;
            }
          }
        }
      }

      blocks = [].slice.call( section.querySelectorAll('.grid-stack-item:not(.removing_block)') );
      blocks.forEach( function( block ) {
        // check block classes
        blockData = block.querySelector( '.rexbuilder-block-data' );
        if ( blockData ) {
          blockCustomClass = blockData.getAttribute( 'data-block_custom_class' );
          if ( blockCustomClass ) {
            for( z=0,l = effects.length; z < l; z++ ) {
              if( -1 !== blockCustomClass.indexOf( effects[z].condition ) ) {
                effects[z].active = true;
              }
            }
          }
        }

        // check block content
        text = block.querySelector( '.text-wrap' );
        if ( text ) {
          for( z=0,l = effects.length; z < l; z++ ) {
            if( -1 !== text.innerHTML.indexOf( effects[z].condition ) ) {
              effects[z].active = true;
            }
          }
        }
      });
    });

    return effects;
  }

  return {
    init: init,
    createSectionProperties: createSectionProperties,
    createTargets: createTargets,
    createBlockProperties: createBlockProperties,
    createCustomization: createCustomization,
    updateModel: updateModel,
    _checkSpecialEffects: _checkSpecialEffects
  };
})(jQuery);
