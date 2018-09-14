var Model_Modal = (function ($) {
    'use strict';
    var rexmodel_modal_props;
    var model_created;

    var sectionShortCode;
    var layouts;
    var layoutsNames;

    var target;

    var modelSelectedID;
    var modelInPageNumbers;
    
    var _updateModelList = function(data){
        target = data.sectionTarget;
        modelSelectedID = data.modelID;
        sectionShortCode = data.shortCode;
        layouts = data.layouts;
        layoutsNames = data.layoutsNames;
        model_created = false;
        modelInPageNumbers = data.modelsNumbers;

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: live_editor_obj.ajaxurl,
            data: {
                action: 'rex_get_model_list',
                nonce_param: live_editor_obj.rexnonce,
            },
            success: function (response) {
                if (response.success) {
                    var currentList = [];
                    var modelObj = {
                        id: '0',
                        founded: true
                    }
                    currentList.push(modelObj);
                    rexmodel_modal_props.$model_import.children().each(function (i, model) {
                        var modelID = $(model).val();
                        if(modelID != "0"){
                            var modelObj = {
                                id: modelID,
                                founded: false
                            }
                            currentList.push(modelObj);
                        }
                    });
                    var updatedList = response.data.updated_list;
                    var i, j;

                    for(i=0; i<updatedList.length; i++){
                        updatedList[i].founded = false;
                    }
                    
                    for(i=0; i<updatedList.length; i++){
                        for(j=0; j<currentList.length; j++){
                            if(updatedList[i].id == currentList[j].id){
                                updatedList[i].founded = true;
                                currentList[j].founded = true;
                                break;
                            }
                        }
                    }

                    for(i=0; i<updatedList.length; i++){
                        if(!updatedList[i].founded){
                            rexmodel_modal_props.$model_import.children().eq(0).after('<option value="' + updatedList[i].id + '">' + updatedList[i].name + '</option>');
                        }
                    }

                    for(i=0; i<currentList.length; i++){
                        if(!currentList[i].founded){
                            rexmodel_modal_props.$model_import.find('option[value=' + currentList[i].id + ']').remove();
                        }
                    }

                    rexmodel_modal_props.$model_name.val('');
                    rexmodel_modal_props.$model_import.find('option[value=0]').prop('selected', true);
                    if (modelSelectedID != "") {
                        rexmodel_modal_props.$model_import.find('option[value=0]').prop('selected', false);
                        rexmodel_modal_props.$model_import.find('option[value=' + modelSelectedID + ']').prop('selected', true);
                    }
                    Rexlive_Modals_Utils.openModal(rexmodel_modal_props.$self.parent('.rex-modal-wrap'));
                }
            },
            error: function (response) {
                ;
            },
            complete: function (response) {
                rexmodel_modal_props.$self.removeClass('rex-modal--loading');
            }
        })
    }

    var _openModal = function (data) {
        rexmodel_modal_props.$model_import_wrap.removeClass("hide-import-wrap");
        rexmodel_modal_props.$model_insert_success_wrap.text("");

        //update models list
        _updateModelList(data);
    }

    var _closeModal = function () {
        Rexlive_Modals_Utils.closeModal(rexmodel_modal_props.$self.parent('.rex-modal-wrap'));
    }

    var _linkDocumentListeners = function () {
        rexmodel_modal_props.$save_button.click(function (e) {
            e.preventDefault();
            _closeModal();
        });

        rexmodel_modal_props.$cancel_button.click(function (e) {
            e.preventDefault();
            _closeModal();
        });

        rexmodel_modal_props.$model_import.on('change', function (e) {
            var model_id = rexmodel_modal_props.$model_import.val();
            if (model_id != '' && model_id != '0' && !model_created) {
                rexmodel_modal_props.$self.addClass('rex-modal--loading');
                var model = {
                    ID: model_id
                };
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: live_editor_obj.ajaxurl,
                    data: {
                        action: 'rex_get_model_live',
                        nonce_param: live_editor_obj.rexnonce,
                        model_data: model
                    },
                    success: function (response) {
                        if (response.success) {
                            var modelData = {
                                eventName: "rexlive:applyModelSection",
                                data_to_send: {
                                    sectionTarget: jQuery.extend(true, {}, target),
                                    model: response.data.model,
                                    modelName: response.data.name,
                                    modelID: response.data.id,
                                    customizationsData: response.data.customizations_data,
                                    customizationsNames: response.data.customizations_names,
                                }
                            }

                            var modelSectionRexID = response.data.sectionRexID[0][1];
                            var modelIsInpage = false;
                            var number = 1;

                            for (var i = 0; i < modelInPageNumbers.length; i++) {
                                if (response.data.id == modelInPageNumbers[i].modelID) {
                                    modelIsInpage = true;
                                    modelInPageNumbers[i].number += 1;
                                    number = modelInPageNumbers[i].number;
                                }
                            }

                            if (!modelIsInpage) {
                                modelInPageNumbers.push({
                                    modelID: response.data.id,
                                    number: number
                                });
                            }

                            target = {
                                sectionID: modelSectionRexID,
                                modelNumber: number
                            }

                            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(modelData);
                        }
                    },
                    error: function (response) {

                    },
                    complete: function (response) {
                        rexmodel_modal_props.$self.removeClass('rex-modal--loading');
                    }
                });
            }
        });

        rexmodel_modal_props.$model_name.on('focusout', function (e) {
            e.preventDefault();
            rexmodel_modal_props.$model_name.parent().removeClass('input-active');
        });

        rexmodel_modal_props.$model_name.on('focusin', function (e) {
            e.preventDefault();
            rexmodel_modal_props.$model_name.parent().addClass('input-active');
        });

        rexmodel_modal_props.$add_new_model.on('click', function () {
            if (rexmodel_modal_props.$model_name.val() != '') {
                var model_name = rexmodel_modal_props.$model_name.val();

                var model = {
                    'post_title': model_name,
                    'post_content': sectionShortCode
                };

                var dataModelSaved = {
                    modelID: -1,
                    modelTitle: "",
                    modelHtml: ""
                }

                $.when(
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: live_editor_obj.ajaxurl,
                        data: {
                            action: 'rex_create_model_from_builder',
                            nonce_param: live_editor_obj.rexnonce,
                            model_data: model,
                        },
                        success: function (response) {
                            if (response.success) {
                                rexmodel_modal_props.$model_import_wrap.addClass("hide-import-wrap");
                                var modelCreatedID = response.data.model_id;
                                dataModelSaved.modelID = modelCreatedID;
                                dataModelSaved.modelTitle = model_name;
                                dataModelSaved.modelHtml = response.data.model_html;
                                for (var i = 0; i < layouts.length; i++) {
                                    var name = layouts[i].name;
                                    var targets = layouts[i].targets;
                                    $.ajax({
                                        type: 'POST',
                                        dataType: 'json',
                                        url: live_editor_obj.ajaxurl,
                                        data: {
                                            action: 'rex_save_model_customization',
                                            nonce_param: live_editor_obj.rexnonce,
                                            model_id_to_update: modelCreatedID,
                                            targets: JSON.stringify(targets),
                                            layout_name: name,
                                        },
                                        success: function (response) {
                                        },
                                        error: function (response) {
                                            ;
                                        },
                                        complete: function (response) {
                                        }
                                    });
                                }

                                $.ajax({
                                    type: 'POST',
                                    dataType: 'json',
                                    url: live_editor_obj.ajaxurl,
                                    data: {
                                        action: 'rex_save_model_customization_names',
                                        nonce_param: live_editor_obj.rexnonce,
                                        model_id_to_update: modelCreatedID,
                                        names: layoutsNames,
                                    },
                                    success: function (response) {
                                    },
                                    error: function (response) {
                                        ;
                                    },
                                    complete: function (response) {
                                    }
                                });
                            }
                        },
                        error: function (response) {
                            ;
                        },
                        complete: function (response) {
                            ;
                        }
                    }),
                ).then(function () {
                    // All have been resolved (or rejected), do your thing
                    rexmodel_modal_props.$self.removeClass('rex-modal--loading');

                    var modelID = dataModelSaved.modelID;
                    var modelTitle = dataModelSaved.modelTitle;
                    var modelHTML = dataModelSaved.modelHtml;

                    rexmodel_modal_props.$model_name.val('').siblings('label').removeClass('active');
                    rexmodel_modal_props.$save_button.val('');
                    rexmodel_modal_props.$model_import.children().eq(0).after('<option value="' + modelID + '">' + modelTitle + '</option>');
                    rexmodel_modal_props.$model_import.find('option[value=' + modelID + ']').prop('selected', true);
                    var modelData = {
                        eventName: "rexlive:applyModelSection",
                        data_to_send: {
                            sectionTarget: target,
                            model: modelHTML,
                            modelName: modelTitle,
                            modelID: modelID,
                            customizationsData: layouts,
                            customizationsNames: layoutsNames,
                        }
                    }
                    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(modelData);

                    model_created = true;
                    rexmodel_modal_props.$model_insert_success_wrap.text("Modello Inserito");
                    setTimeout(function () {
                        _closeModal();
                    }, 1000);
                }, function () {
                    rexmodel_modal_props.$model_import_wrap.addClass("hide-import-wrap");
                    rexmodel_modal_props.$model_insert_success_wrap.text("Nome già presente");
                });
            } else {
                rexmodel_modal_props.$model_name.focus();
            }
        });
    }

    var _init = function () {
        var $self = $("#rex-model-block")
        var $container = $self;
        rexmodel_modal_props = {
            $self: $self,
            $save_button: $container.find('.rex-save-button'),
            $cancel_button: $container.find('.rex-cancel-button'),
            $model_import: $container.find("#rex-model__import"),
            $model_name: $container.find('#rex-model__name'),
            $add_new_model: $container.find('#rex-model__add-new-model'),
            $model_import_wrap: $container.find('.rex-model__import--wrap-active'),
            $model_insert_success_wrap: $container.find(".rex-model__model-insert-success-wrap")
        }
        model_created = false;
        modelSelectedID = "";
        sectionShortCode = "";
        _linkDocumentListeners();
    }

    return {
        init: _init,
        openModal: _openModal,
        closeModal: _closeModal
    };

})(jQuery);