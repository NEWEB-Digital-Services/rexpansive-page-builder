var Rexbuilder_Section = (function ($) {
    'use strict';
    var _showSectionToolBox = function ($section) {
        $section.children('.section-toolBox').addClass('tool-box-active');
    }

    var _hideSectionToolBox = function ($section) {
        $section.children('.section-toolBox').removeClass('tool-box-active');
    }

    var _linkHoverSection = function ($section) {
        $section.hover(function (event) {
            Rexbuilder_Section.showSectionToolBox($section);
        }, function (event) {
            if ($(event.toElement).parents(".medium-editor-toolbar").length == 0) {
                Rexbuilder_Section.hideSectionToolBox($section);
            }
        });
    }

    var _prepareSectionCopied = function ($section) {
        var oldSectionNumber = parseInt($section.attr("data-rexlive-section-number"));
        Rexbuilder_Util.lastSectionNumber = Rexbuilder_Util.lastSectionNumber + 1;

        $section.attr("data-rexlive-section-number", Rexbuilder_Util.lastSectionNumber);

        var $gallery = $section.find(".grid-stack-row");

        $gallery.removeClass("grid-number-" + oldSectionNumber);

        $gallery.removeClass(function (index, className) {
            return (className.match(/grid-stack-instance-\d+/g) || []).join(' ');
        });

        Rexbuilder_Util_Editor.removeDeletedBlocks($gallery);

        // removing scrollbars and text editor
        $gallery.find(".grid-stack-item").each(function (i, el) {
            var $elem = $(el);
            if (!Rexbuilder_Util_Editor.insertingModel) {
                Rexbuilder_Util_Editor.generateElementNewIDs($elem, i, Rexbuilder_Util.lastSectionNumber);
            }
            Rexbuilder_Util_Editor.removeScrollBar($elem);
            Rexbuilder_Util_Editor.removeHandles($elem);
            Rexbuilder_Util_Editor.removeTextEditor($elem);
            if (!Rexbuilder_Util_Editor.insertingModel) {
                Rexbuilder_Util_Editor.fixCopiedElementSlider($elem);
            }
            if ($elem.find(".rexlive-block-toolbox").length == 0) {
                $elem.find(".grid-stack-item-content").after(tmpl("tmpl-toolbox-block", {}));
            }
        });

        if (!Rexbuilder_Util_Editor.insertingModel) {
            $section.attr("data-rexlive-section-id", Rexbuilder_Util.createSectionID());
            $section.attr("data-rexlive-section-name", "");
        }

        Rexbuilder_Section.linkHoverSection($section);

        Rexbuilder_Section.hideSectionToolBox($section);
    }

    var _addSectionToolboxListeners = function () {
        $(document).on('click', '.builder-delete-row', function (e) {
            var $section = $(e.currentTarget).parents('.rexpansive_section');

            var reverseData = {
                show: true
            };

            Rexbuilder_Dom_Util.updateSectionVisibility($section, false);

            var actionData = {
                show: false
            };

            Rexbuilder_Util_Editor.pushAction($section, "updateSectionVisibility", actionData, reverseData);
        });

        $(document).on('click', '.builder-copy-row', function (e) {
            console.log("copying section");

            Rexbuilder_Util_Editor.sectionCopying = true;
            var $section = $(e.currentTarget).parents('.rexpansive_section');
            var $newSection = $section.clone(false);
            if ($section.hasClass("rex-model-section")) {
                Rexbuilder_Util_Editor.insertingModel = true;
            }

            if ($newSection.hasClass("rex-model-section")) {
                var modelID = $newSection.attr("data-rexlive-model-id");
                var modelNumber = 1;
                Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function (i, sec) {
                    var $sec = $(sec);
                    if ($sec.attr("data-rexlive-model-id") == modelID) {
                        modelNumber = modelNumber + 1;
                    }
                });
                $newSection.attr("data-rexlive-model-number", modelNumber);
                var $buttonModel = $newSection.find(".update-model-button");
                Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);
            }

            $newSection.insertAfter($section);
            Rexbuilder_Section.prepareSectionCopied($newSection);

            var $row = $newSection.find('.grid-stack-row');

            $row.perfectGridGalleryEditor();

            Rexbuilder_Util.$rexContainer.sortable("refresh");

            var reverseData = {
                show: false
            };

            Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);

            var actionData = {
                show: true
            };

            Rexbuilder_Util_Editor.pushAction($newSection, "updateSectionVisibility", actionData, reverseData);

            Rexbuilder_Util_Editor.sectionCopying = false;
            Rexbuilder_Util_Editor.insertingModel = false;
        });

        $(document).on("click", ".collapse-grid", function (e) {
            var $section = $(e.target).parents(".rexpansive_section");

            var gridCollapsed;
            if (typeof $section.attr("data-rex-collapse-grid") != "undefined" && $section.attr("data-rex-collapse-grid").toString() == "true") {
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
            }

            if (!gridCollapsed) {
                galleryEditorInstance.collapseElementsProperties();
                galleryEditorInstance.collapseElements(reverseData);
            } else {
                Rexbuilder_Util_Editor.updatingCollapsedGrid = true;

                var elemetsDisposition;
                var galleryLayoutToActive;
                var defaultLayout;

                if (Rexbuilder_Util.customizationExists(Rexbuilder_Util.activeLayout)) {
                    elemetsDisposition = Rexbuilder_Util.getLayoutTargets($section, Rexbuilder_Util.activeLayout);
                    galleryLayoutToActive = Rexbuilder_Util.getGridLayout($section, Rexbuilder_Util.activeLayout);
                } else {
                    elemetsDisposition = Rexbuilder_Util.getLayoutTargets($section, "default");
                    galleryLayoutToActive = Rexbuilder_Util.getGridLayout($section, "default");
                }
                defaultLayout = Rexbuilder_Util.getGridLayout($section, "default");

                var i;
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
                    singleHeight: singleHeight,
                }

                galleryEditorInstance.$element.attr("data-layout", galleryLayout.layout);
                galleryEditorInstance.$element.attr("data-full-height", galleryLayout.fullHeight);

                galleryEditorInstance.updateGridLayoutCollapse(galleryLayout);

                galleryEditorInstance.batchGridstack();

                for (i = 1; i < elemetsDisposition.length; i++) {
                    var $elem = $section.find("div[data-rexbuilder-block-id=\"" + elemetsDisposition[i].name + "\"]");
                    var $elemData = $elem.children(".rexbuilder-block-data");
                    var props = elemetsDisposition[i].props;
                    if (typeof props === "undefined") {
                        props = Rexbuilder_Util.getDefaultBlockProps($section, elemetsDisposition[i].name);
                        if (defaultLayout.layout != galleryLayout.layout) {
                            if (defaultLayout.layout == "masonry") {
                                props.gs_y = Math.round(props.gs_y / 5);
                                props.gs_height = Math.round(props.gs_height / 5);
                            } else {
                                props.gs_y = props.gs_y * 5;
                                props.gs_height = props.gs_height * 5;
                            }
                        }
                    }
                    var postionData = {
                        x: props.gs_x,
                        y: props.gs_y,
                        w: props.gs_width,
                        h: props.gs_height,
                        startH: props.gs_start_h,
                        gridstackInstance: gridstackInstance,
                    };
                    Rexbuilder_Util.updateElementDimensions($elem, $elemData, postionData);
                }

                galleryEditorInstance.commitGridstack();

                galleryEditorInstance.removeCollapseElementsProperties();

                if (galleryLayout.layout == "masonry") {
                    setTimeout(function () {

                        galleryEditorInstance.updateBlocksHeight();
                        setTimeout(function () {
                            var actionData = {
                                gridInstance: galleryEditorInstance,
                                gridLayout: galleryLayout,
                                blockDisposition: galleryEditorInstance.createActionDataMoveBlocksGrid(),
                                collapse: false
                            }
                            galleryEditorInstance._fixImagesDimension();
                            Rexbuilder_Util_Editor.pushAction($section, "collapseSection", actionData, reverseData);
                            Rexbuilder_Util_Editor.updatingCollapsedGrid = false;
                        }, 400, reverseData, $section, galleryEditorInstance, galleryLayout);
                    }, 300, reverseData, $section, galleryEditorInstance, galleryLayout);
                } else {
                    if (fullHeight) {
                        setTimeout(function () {
                            galleryEditorInstance.properties.gridBlocksHeight = galleryEditorInstance._calculateGridHeight();
                            galleryLayout.singleHeight = galleryEditorInstance._viewport().height / galleryEditorInstance.properties.gridBlocksHeight;
                            galleryEditorInstance.updateGridstackStyles(galleryLayout.singleHeight);
                            setTimeout(function () {
                                var actionData = {
                                    gridInstance: galleryEditorInstance,
                                    gridLayout: galleryLayout,
                                    blockDisposition: galleryEditorInstance.createActionDataMoveBlocksGrid(),
                                    collapse: false
                                }
                                Rexbuilder_Util_Editor.pushAction($section, "collapseSection", actionData, reverseData);
                                galleryEditorInstance._fixImagesDimension();
                                Rexbuilder_Util_Editor.updatingCollapsedGrid = false;
                            }, 100, reverseData, $section, galleryEditorInstance, galleryLayout);
                        }, 300, reverseData, $section, galleryEditorInstance, galleryLayout);
                    } else {
                        setTimeout(function () {
                            var actionData = {
                                gridInstance: galleryEditorInstance,
                                gridLayout: galleryLayout,
                                blockDisposition: galleryEditorInstance.createActionDataMoveBlocksGrid(),
                                collapse: false
                            }
                            galleryEditorInstance._fixImagesDimension();
                            Rexbuilder_Util_Editor.pushAction($section, "collapseSection", actionData, reverseData);
                            Rexbuilder_Util_Editor.updatingCollapsedGrid = false;
                        }, 400, reverseData, $section, galleryEditorInstance, galleryLayout);
                    }
                }
            }
        });

        $(document).on("rexlive:collapsingElementsEnded", function (e) {
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
                }
                Rexbuilder_Util_Editor.pushAction($section, "collapseSection", actionData, reverseData);
            }
        });

        $(document).on("click", ".add-new-section", function (e) {
            console.log("have to add new Section");
            var rexIdSection = Rexbuilder_Util.createSectionID();
            tmpl.arg = "section";

            var newSection = tmpl("tmpl-new-section", {
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
            });

            var $newSection = $(newSection);
            var $newSectionData = $newSection.children(".section-data");
            $newSectionData.after(tmpl("tmpl-toolbox-section"));
            //per ora viene aggiunta dopo l'ultima section
            var $last = Rexbuilder_Util.$rexContainer.children("section:last");

            if ($last.length != 0) {
                $newSection.insertAfter($last);
            } else {
                $newSection.appendTo(Rexbuilder_Util.$rexContainer);
            }

            Rexbuilder_Section.linkHoverSection($newSection);

            Rexbuilder_Util.lastSectionNumber = Rexbuilder_Util.lastSectionNumber + 1;
            $newSection.attr("data-rexlive-section-number", Rexbuilder_Util.lastSectionNumber)
            Rexbuilder_Util.$rexContainer.sortable("refresh");
            var $row = $newSection.find(".grid-stack-row");
            $row.perfectGridGalleryEditor();

            var reverseData = {
                show: false
            };

            Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);

            var actionData = {
                show: true
            };

            Rexbuilder_Util_Editor.pushAction($newSection, "updateSectionVisibility", actionData, reverseData);
        });

        $(document).on("rexlive:applyModelSection", function (e) {

            Rexbuilder_Util_Editor.sectionCopying = true;
            Rexbuilder_Util_Editor.insertingModel = true;

            var data = e.settings.data_to_send;

            var newSectionHtml = data.model;
            var html = $.parseHTML(newSectionHtml);
            var $oldSection;

            if (data.sectionTarget.modelNumber != "") {
                $oldSection = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"][data-rexlive-model-number="' + data.sectionTarget.modelNumber + '"]');
            } else {
                $oldSection = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"]');
            }

            var modelNumber = 1;
            Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function (i, sec) {
                var $sec = $(sec);
                if ($sec.attr("data-rexlive-model-id") == data.id) {
                    modelNumber = modelNumber + 1;
                }
            });

            $oldSection.after(html);

            var $newSection = $(html);
            
            var dataModel = {
                id: data.modelID,
                modelName: data.modelName,
                sectionID: $newSection.attr("data-rexlive-section-id"),
                $section: $newSection,
                modelNumber: modelNumber,
                isModel: true
            }

            var addingModelCustomizationsNames = {
                id: dataModel.id,
                names: data.customizationsNames
            };

            Rexbuilder_Util.updateDivModelCustomizationsNames(addingModelCustomizationsNames);

            var addingModelCustomizationsData = {
                id: dataModel.id,
                name: dataModel.modelName,
                customizations: data.customizationsData
            };
            
            Rexbuilder_Util.updateModelsCustomizationsData(addingModelCustomizationsData);

            Rexbuilder_Dom_Util.updateSectionBecameModel(dataModel);

            Rexbuilder_Section.prepareSectionCopied($newSection);
            var $newSectionData = $newSection.children(".section-data");
            $newSectionData.after(tmpl("tmpl-toolbox-section"));
            var $buttonModel = $newSection.find(".update-model-button");
            Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);

            var $row = $newSection.find('.grid-stack-row');

            $row.perfectGridGalleryEditor();

            //starting sliders after grid is up
            setTimeout(function () {
                $row.children(".grid-stack-item").each(function (i, el) {
                    var $sliderToActive = $(el).find(".rex-slider-wrap");
                    if ($sliderToActive.length != 0) {
                        RexSlider.initSlider($sliderToActive);
                    }
                });
            }, 500, $row);

            Rexbuilder_Util.$rexContainer.sortable("refresh");

            var reverseData = {
                $sectionToHide: $newSection,
                $sectionToShow: $oldSection,
            };

            Rexbuilder_Dom_Util.updateSectionVisibility($oldSection, false);
            Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);

            var actionData = {
                $sectionToHide: $oldSection,
                $sectionToShow: $newSection,
            };

            Rexbuilder_Util_Editor.pushAction($newSection, "updateSectionModel", actionData, reverseData);

            Rexbuilder_Util_Editor.sectionCopying = false;
            Rexbuilder_Util_Editor.insertingModel = false;

        });
    }

    var _updateModelsHtmlLive = function (data) {
        Rexbuilder_Util_Editor.sectionCopying = true;
        Rexbuilder_Util_Editor.insertingModel = true;
        var idModel = data.modelID;
        var newHtml = data.html;
        var editedModelNumber = data.model_number;
        var modelName = data.modelName;

        Rexbuilder_Util.$rexContainer.children(".rexpansive_section.rex-model-section:not(.removing_section)").each(function (i, sec) {
            var $section = $(sec);
            if ($section.attr("data-rexlive-model-id") == idModel && $section.attr("data-rexlive-model-number") != editedModelNumber) {
                var oldSectionModelSavedNumber = isNaN(parseInt($section.attr("data-rexlive-saved-model-number")))? "": $section.attr("data-rexlive-saved-model-number");
                var modelNumber = 1;
                Rexbuilder_Util.$rexContainer.children(".rexpansive_section:not(.removing_section)").each(function (i, sec) {
                    if ($(sec).attr("data-rexlive-model-id") == idModel) {
                        modelNumber = modelNumber + 1;
                    }
                });

                var html = $.parseHTML(newHtml);
                $section.after(html);

                var $newSection = $(html);
                $newSection.attr("data-rexlive-saved-model-number", oldSectionModelSavedNumber);
                
                var dataModel = {
                    modelID: idModel,
                    modelName: modelName,
                    modelNumber, modelNumber,
                    sectionID: $newSection.attr("data-rexlive-section-id"),
                    isModel: true,
                    $section: $newSection
                }

                Rexbuilder_Dom_Util.updateSectionBecameModel(dataModel);

                Rexbuilder_Section.prepareSectionCopied($newSection);
                var $newSectionData = $newSection.children(".section-data");
                $newSectionData.after(tmpl("tmpl-toolbox-section"));
                var $buttonModel = $newSection.find(".update-model-button");
                Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);

                var $row = $newSection.find('.grid-stack-row');

                $row.perfectGridGalleryEditor();

                Rexbuilder_Util.$rexContainer.sortable("refresh");
                Rexbuilder_Dom_Util.updateSectionVisibility($section, false);
                Rexbuilder_Dom_Util.updateSectionVisibility($newSection, true);
            }
        });

        Rexbuilder_Util.$rexContainer.children(".rexpansive_section.removing_section.rex-model-section").each(function (i, sec) {
            $(sec).attr("data-rexlive-saved-model-number", "");
        });

        Rexbuilder_Util_Editor.sectionCopying = false;
        Rexbuilder_Util_Editor.insertingModel = false;
    }

    var init = function () {
        //Setting row number
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function (i, section) {
            var $section = $(section);
            Rexbuilder_Section.linkHoverSection($section);
            if ($section.hasClass("rex-model-section")) {
                $section.addClass("rexlive-block-grid-editing");
                $section.find(".grid-stack-row").parent().prepend(tmpl("tmpl-div-block-grid", {}));
                $section.find(".section-toolBox").parent().prepend(tmpl("tmpl-div-block-section-toolbox", {}));
            }

            if (typeof $section.attr("id") == "undefined") {
                $section.attr("id", "");
            };

            if (typeof $section.attr("data-rexlive-section-name") == "undefined") {
                $section.attr("data-rexlive-section-name", "");
            };
        });

        var startingSectionsOrder = [];
        var endSectionsOrder = [];
        //launching sortable
        Rexbuilder_Util.$rexContainer.sortable({
            start: function (event, ui) {
                startingSectionsOrder = [];

                Rexbuilder_Util.$rexContainer.children(".rexpansive_section:not(.removing_section)").each(function (i, el) {
                    var $section = $(el);

                    var sectionObj = {
                        rexID: $section.attr("data-rexlive-section-id"),
                        modelID: -1,
                        modelNumber: -1,
                    }

                    if ($section.hasClass("rex-model-section")) {
                        sectionObj.modelID = $section.attr("data-rexlive-model-id");
                        sectionObj.modelNumber = $section.attr("data-rexlive-model-number");
                    }

                    startingSectionsOrder.push(sectionObj);
                });
            },
            handle: ".builder-move-row",
            stop: function (event, ui) {
                endSectionsOrder = [];
                Rexbuilder_Util.$rexContainer.children(".rexpansive_section:not(.removing_section)").each(function (i, el) {
                    var $section = $(el);

                    var sectionObj = {
                        rexID: $section.attr("data-rexlive-section-id"),
                        modelID: -1,
                        modelNumber: -1,
                    }

                    if ($section.hasClass("rex-model-section")) {
                        sectionObj.modelID = $section.attr("data-rexlive-model-id");
                        sectionObj.modelNumber = $section.attr("data-rexlive-model-number");
                    }

                    endSectionsOrder.push(sectionObj);
                });

                var actionData = {
                    sectionOrder: endSectionsOrder
                };

                var reverseData = {
                    sectionOrder: startingSectionsOrder
                };

                Rexbuilder_Util_Editor.pushAction("document", "updateSectionOrder", actionData, reverseData);

                Rex_Navigator.fixNavigatorItemOrder($(event.srcElement).parents(".rexpansive_section"));
            }
        });

        // linking listeners to row setting buttons
        _addSectionToolboxListeners();

    }

    return {
        init: init,
        prepareSectionCopied: _prepareSectionCopied,
        showSectionToolBox: _showSectionToolBox,
        hideSectionToolBox: _hideSectionToolBox,
        linkHoverSection: _linkHoverSection,
        updateModelsHtmlLive: _updateModelsHtmlLive
    }
})(jQuery);