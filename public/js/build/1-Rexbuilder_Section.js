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
            Rexbuilder_Util_Editor.fixCopiedElementSlider($elem);
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

            if($newSection.hasClass("rex-model-section")){
                var modelID = $newSection.attr("data-rexlive-model-id");
                var modelNumber = 1;
                Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function (i, sec) {
                    var $sec = $(sec);
                    if ($sec.attr("data-rexlive-model-id") == modelID) {
                        modelNumber = modelNumber + 1;
                    }
                });
                $newSection.attr("data-rexlive-model-number", modelNumber);
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
            var $grid = $section.find(".grid-stack-row");
            var galleryEditorInstance = $grid.data().plugin_perfectGridGalleryEditor;
            var isCollapsed = galleryEditorInstance.properties.oneColumModeActive;
            if (!isCollapsed) {
                var layout = {
                    layout: galleryEditorInstance.settings.galleryLayout,
                    fullHeight: galleryEditorInstance.settings.fullHeight,
                    singleHeight: galleryEditorInstance.properties.singleHeight
                };

                var oldDisposition = galleryEditorInstance.createActionDataMoveBlocksGrid();

                var reverseData = {
                    gridInstance: galleryEditorInstance,
                    gridLayout: layout,
                    blockDisposition: oldDisposition,
                    collapse: isCollapsed
                }

                galleryEditorInstance.collapseElementsProperties();
                galleryEditorInstance.collapseElements(reverseData);
            } else {
                var layout = {
                    layout: galleryEditorInstance.settings.galleryLayout,
                    fullHeight: galleryEditorInstance.settings.fullHeight,
                    singleHeight: galleryEditorInstance.properties.singleHeight
                };

                var oldDisposition = galleryEditorInstance.createActionDataMoveBlocksGrid();

                var reverseData = {
                    gridInstance: galleryEditorInstance,
                    gridLayout: layout,
                    blockDisposition: oldDisposition,
                    collapse: true
                }

                Rexbuilder_Dom_Util.collapseGrid(galleryEditorInstance, false, galleryEditorInstance.properties.dispositionBeforeCollapsing, galleryEditorInstance.properties.layoutBeforeCollapsing);

                var actionData = {
                    gridInstance: galleryEditorInstance,
                    gridLayout: galleryEditorInstance.properties.layoutBeforeCollapsing,
                    blockDisposition: galleryEditorInstance.properties.dispositionBeforeCollapsing,
                    collapse: false
                }

                Rexbuilder_Util_Editor.pushAction($section, "collapseSection", actionData, reverseData);
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
            console.log(data);

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
                if ($sec.attr("data-rexlive-model-id") == data.modelID) {
                    modelNumber = modelNumber + 1;
                }
            });

            $oldSection.after(html);

            var $newSection = $(html);

            var dataModel = {
                modelID: data.modelID,
                modelName: data.modelName,
                sectionID: $newSection.attr("data-rexlive-section-id"),
                $section: $newSection,
                modelNumber: modelNumber,
                isModel: true
            }

            var addingModelCustomizationsNames = {
                modelID: dataModel.modelID,
                names: data.customizationsNames
            };

            Rexbuilder_Dom_Util.updateDivModelCustomizationsNames(addingModelCustomizationsNames);

            var addingModelCustomizationsData = {
                id: dataModel.modelID,
                name: dataModel.modelName,
                customizations: data.customizationsData
            };

            Rexbuilder_Dom_Util.updateDivModelCustomizationsData(addingModelCustomizationsData);

            Rexbuilder_Dom_Util.updateSectionBecameModel(dataModel);

            Rexbuilder_Section.prepareSectionCopied($newSection);
            var $newSectionData = $newSection.children(".section-data");
            $newSectionData.after(tmpl("tmpl-toolbox-section"));
            var $buttonModel = $newSection.find(".update-model-button");
            Rexbuilder_Dom_Util.updateLockEditModel($buttonModel, true);

            var $row = $newSection.find('.grid-stack-row');

            $row.perfectGridGalleryEditor();

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
        var editedModelNumber =  data.model_number;
        var modelName =  data.modelName;
        
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section:not(.removing_section)").each(function (i, sec) {
            var $section = $(sec);
            if ($section.attr("data-rexlive-model-id") == idModel && $section.attr("data-rexlive-model-number") != editedModelNumber) {
                var modelNumber = 1;
                Rexbuilder_Util.$rexContainer.children(".rexpansive_section:not(.removing_section)").each(function (i, sec) {
                    if ($(sec).attr("data-rexlive-model-id") == idModel) {
                        modelNumber = modelNumber + 1;
                    }
                });
                
                var html = $.parseHTML(newHtml);
                $section.after(html);

                var $newSection = $(html);

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
        
        Rexbuilder_Dom_Util.fixModelNumbersSaving();
        
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