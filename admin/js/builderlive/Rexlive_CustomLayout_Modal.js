var CustomLayouts_Modal = (function ($) {
    'use strict';

    var $buttonsWrapper;

    var $custom_layout_modal;
    var $layoutData;

    /**
     * Creating the ID of a new layout. Checks if one exists
     * @return {string} id
     */
    var create_layout_id = function () {
        var id;
        var flag;
        var idLength = 4;
        do {
            flag = true;
            id = Rexbuilder_Util_Admin_Editor.createRandomID(idLength);
            $custom_layout_modal.find('.layout__item').each(function () {
                if ($(this).find('input[name=rexlive-layout-id]').val() == id) {
                    flag = false;
                }
            });
        } while (!flag);
        return id;
    }

    var _updateLayouts = function (newLayout, oldLayouts) {
        var availableLayoutsData = [];

        var i;
        for (i = 0; i < oldLayouts.length; i++) {
            var layout = oldLayouts[i];

            //se è presente aggiorno i dati del layout
            if (layout.id == newLayout.id) {
                if (layout.min != newLayout.min) {
                    layout.min = newLayout.min;
                }
                if (layout.max != newLayout.max) {
                    layout.max = newLayout.max;
                }
                if (layout.label != newLayout.label) {
                    layout.label = newLayout.label;
                }
                newLayout.presente = true;
            }
            availableLayoutsData.push(layout);
        }

        if (typeof newLayout.presente == "undefined") {
            availableLayoutsData.push(newLayout);
        }
        return availableLayoutsData;
    }

    var _updateLayoutsDB = function (updatedLayouts) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: live_editor_obj.ajaxurl,
            data: {
                action: 'rex_save_custom_layouts',
                nonce_param: live_editor_obj.rexnonce,
                custom_layouts: updatedLayouts
            },
            success: function (response) {
                console.log(response);
                if (response.success) {
                    console.log('cusotm layouts aggiornati');
                }
                console.log('chiama effettuata con successo');
            },
            error: function (response) {
                console.log('errore chiama ajax');
            }
        });
    }

    var _updateLayoutsDataIframe = function (data) {
        var dataLayout = {
            eventName: "rexlive:updateLayoutsDimensions",
            data_to_send: {
                layouts: data
            }
        }
        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataLayout);
    }

    var _updateLayoutsDataDiv = function (data) {
        $layoutData.text(JSON.stringify(data));
    }

    var _openModal = function(){
        Rexpansive_Builder_Admin_Modals.OpenModal($custom_layout_modal.parent('.rex-modal-wrap'));
    }

    var _closeModal = function(){
        Rexpansive_Builder_Admin_Modals.CloseModal($custom_layout_modal.parent('.rex-modal-wrap'));
    }

    var _updateButtons = function(data){
        console.log(data);
    }

    var _linkDocumentListeners = function () {
        $buttonsWrapper.find('.builder-config-layouts').on('click', function (e) {
            e.preventDefault();
            _openModal();
        });

        $custom_layout_modal.on('click', '.rex-cancel-button', function (e) {
            Rexpansive_Builder_Admin_Modals.CloseModal($custom_layout_modal.parent('.rex-modal-wrap'));
        });

        $custom_layout_modal.on('click', '.rex-save-button', function (e) {
            var layoutsToSave = [];
            tmpl.arg = "button";

            $custom_layout_modal.find('.layout__item').each(function (i, e) {
                var $item = $(e);

                if(!$item.hasClass("removing-item")){

                    var buttonData = {
                        'id': $item.find('input[name=rexlive-layout-id]').val(),
                        'label': $item.find('input[name=rexlive-layout-label]').val(),
                        'min': $item.find('input[name=rexlive-layout-min]').val(),
                        'max': $item.find('input[name=rexlive-layout-max]').val(),
                        'type': $item.find('input[name=rexlive-layout-type]').val(),
                    };

                    layoutsToSave.push(buttonData);

                    if($item.hasClass("new-layout")){
                        var newButtonData = jQuery.extend(true, {}, buttonData);
                        if(newButtonData.maxWidth == ""){
                            newButtonData.maxWidth = "&infin;"
                        } else{
                            newButtonData.maxWidth = buttonData.maxWidth + "px";
                        }
                        console.log(newButtonData);
                        var $itemBefore = $item.prev();
                        $itemBefore.after(tmpl("rexlive-tmpl-custom-layout-modal"), newButtonData); 
                        $item.remove();
                    }
                }
            });

            _updateLayoutsDB(layoutsToSave);
            _updateLayoutsDataIframe(layoutsToSave);
            _updateLayoutsDataDiv(layoutsToSave);
            _updateButtons(layoutsToSave);

            _closeModal();
        });

        $custom_layout_modal.on('click', '#rexlive-add-custom-layout', function () {
            $custom_layout_modal.find('.layout__list').append(tmpl('rexlive-tmpl-new-layout', { l_id: create_layout_id() }));
        });

        $custom_layout_modal.on('click', '.rexlive-layout--edit', function (e) {
            $(e.currentTarget).find('.dashicons-before').toggleClass('hide-icon');

            if ($(e.target).hasClass('dashicons-yes')) {
                $(this).parents('.layout__item').removeClass('editing').find('input[data-editable-field=true]').attr('type', 'hidden');
            } else if ($(e.target).hasClass('dashicons-edit')) {
                $(this).parents('.layout__item').addClass('editing').find('input[data-editable-field=true]').attr('type', 'input');
            }
        });

        $custom_layout_modal.on('click', '.rexlive-layout--delete', function () {
            $(this).parents('.layout__item').addClass("removing-item");
        });

        $custom_layout_modal.on('click', '.rexlive-remove-custom-layout', function () {
            $(this).parents('.layout__item').remove();
        });
    }


    var _init = function () {

        $custom_layout_modal = $('#rexlive-custom-layout-modal');
        $buttonsWrapper = Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.find(".rexlive-responsive-buttons-wrapper");
        $layoutData = Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.find("#rexbuilder-layout-data-backend > .avaiable-layouts");

        _linkDocumentListeners();
    }

    return {
        init: _init,
    };

})(jQuery);