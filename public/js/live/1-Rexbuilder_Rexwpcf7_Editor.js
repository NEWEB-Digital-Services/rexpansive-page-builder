var Rexbuilder_Rexwpcf7_Editor = (function($) {

	var $formsInPage;   // JQuery Array of DB side of forms in page
	var idsInPage = [];
	var formOccurencies = {};

	var _updateDBFormsInPage = function (formID, needToAddElementStyle) {
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find('.rex-element-wrapper').has('.wpcf7-form');

        if ( 0 === $elementWrappers.length ) {
            return;
        }

        idsInPage = [];
        $elementWrappers.each(function(){
            idsInPage.push($(this).attr('data-rex-element-id'));
        })

        formOccurencies = {};
        for (var i = 0; i < idsInPage.length; i++) {
            var id = idsInPage[i];
            formOccurencies[id] = formOccurencies[id] ? formOccurencies[id] + 1 : 1;
        }

        idsInPage = Array.from(new Set(idsInPage));

        $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
                action: "rex_wpcf7_get_forms",
                nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                form_id: idsInPage
            },
            success: function(response) {
              if (response.success) {
                var id, i = 0;
                for( i=0; i<idsInPage.length; i++ ) {
                    $formsInPage[idsInPage[i]] = $(response.data.html_forms[i].toString().trim());

                    if ( needToAddElementStyle && idsInPage[i] == formID ) {
                        Rexbuilder_Rexelement.addElementStyle($elementWrappers.filter('[data-rex-element-id="' + formID + '"]'));
                    }
                }

                _fixInputs();
              }
            },
            error: function(response) {}
        });
    }

	var _addFormInPage = function (formID, $rows) {
        $formsInPage[formID] = $rows;

        idsInPage.push(formID);
        formOccurencies[formID] = formOccurencies[formID] ? formOccurencies[formID] + 1 : 1;
        idsInPage = Array.from(new Set(idsInPage));
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /// Column Content Functions

    var _createColumnContentSpanData = function (data) {
    	var editPoint = data.editPoint;
    	var formID = editPoint.element_id;
    	var row_number = editPoint.row_number;
    	var column_number = editPoint.column_number;
    	var $formColumn = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"]").find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

        var $formInDB = $formsInPage[formID];
        var $formColumnInDB = $formInDB.find(".wpcf7-row[wpcf7-row-number='" + row_number + "']").find(".wpcf7-column[wpcf7-column-number='" + column_number + "']");

    	var $spanData = $(document.createElement("span"));
    	$spanData.addClass("rex-wpcf7-column-content-data");

        var columnHasText = $formColumn.find('.wpcf7-text').length != 0;
        var columnHasEmail = $formColumn.find('.wpcf7-email').length != 0;
        var columnHasNumber = $formColumn.find('.wpcf7-number').length != 0;
        var columnHasTextarea = $formColumn.find('.wpcf7-textarea').length != 0;
        var columnHasSelect = $formColumn.find('.wpcf7-select').length != 0;
        var columnHasRadio = $formColumn.find('.wpcf7-radio').length != 0;
        var columnHasCheckbox = $formColumn.find('.wpcf7-acceptance').length != 0;
        var columnHasFile = $formColumn.find('.wpcf7-file').length != 0;
        var columnHasSubmit = $formColumn.find('.wpcf7-submit').length != 0;

        // Taking data form Rexelement span data
        var $rexelementSpanData = $formColumn.parents(".rex-element-wrapper").find(".rex-element-data");

        if ( !columnHasRadio && !columnHasCheckbox && !columnHasFile && !columnHasSubmit ) {
            $spanData.attr("data-background-color", $rexelementSpanData.attr("data-wpcf7-content-background-color"));
            $spanData.attr("data-border-color", $rexelementSpanData.attr("data-wpcf7-content-border-color"));
            $spanData.attr("data-wpcf7-border-width", $rexelementSpanData.attr("data-wpcf7-content-border-width"));
            $spanData.attr("data-background-color-hover", $rexelementSpanData.attr("data-wpcf7-content-background-color-hover"));
            $spanData.attr("data-border-color-hover", $rexelementSpanData.attr("data-wpcf7-content-border-color-hover"));
        }

        if ( !columnHasSubmit ) {
            $spanData.attr("data-wpcf7-input-width", $rexelementSpanData.attr("data-wpcf7-content-width"));
            $spanData.attr("data-wpcf7-input-height", $rexelementSpanData.attr("data-wpcf7-content-height"));
            $spanData.attr("data-text-color", $rexelementSpanData.attr("data-wpcf7-content-text-color"));
            $spanData.attr("data-wpcf7-font-size", $rexelementSpanData.attr("data-wpcf7-content-font-size"));
            $spanData.attr("data-text-color-hover", $rexelementSpanData.attr("data-wpcf7-content-text-color-hover"));
        }

        var $spanDataInDB = $spanData.clone();
    	$formColumn.prepend($spanData);

        if( 0 === $formColumnInDB.find('.wpcf7-column-content').length ) {
            var shortcode = $formColumnInDB.html(); // Not .text() because some shortcodes have HTML too (e.g. file)
            var $columnContent = $('<span class="wpcf7-column-content">' + shortcode + '</div>');
            $formColumnInDB.empty().append($columnContent);
        }

        $formColumnInDB.prepend($spanDataInDB);
    }

    var _fixInputs = function() {
        Rexbuilder_Util.$rexContainer.find('.wpcf7-column').each(function(i, el) {
            var $formColumn = $(el);

            var possibleFields = {
                text: $formColumn.find('[type=text]').length != 0,
                email: $formColumn.find('.wpcf7-email').length != 0,
                number: $formColumn.find('.wpcf7-number').length != 0,
                textarea: $formColumn.find('.wpcf7-textarea').length != 0,
                select: $formColumn.find('.wpcf7-select').length != 0,
                radio: $formColumn.find('.wpcf7-radio').length != 0,
                acceptance:$formColumn.find('.wpcf7-acceptance').length != 0, 
                file: $formColumn.find('.wpcf7-file').length != 0,
                submit: $formColumn.find('.wpcf7-submit').length != 0
            }

            for (var type in possibleFields) {
                if (possibleFields[type] == true) {
                    var elementToFix = type;
                    break;
                }
            }

            switch(elementToFix) {
                case "text":
                    var $input = $formColumn.find('.wpcf7-text');
                    $input.attr('size', '');
                    break;
                case "email":
                    var $input = $formColumn.find('.wpcf7-email');
                    $input.attr('size', '');
                    break;
                case "number":
                    var $input = $formColumn.find('.wpcf7-number');
                    $input.attr('size', '');
                    break;
                case "textarea":
                    var $input = $formColumn.find('.wpcf7-textarea');
                    $input.attr('size', '');
                    break;
                case "select":
                    var $input = $formColumn.find('.wpcf7-select');

                    if ($input.find("option").eq(0).val() == "") {
                        var $option = $input.find("option").eq(0);
                        $option.attr("disabled", "");
                        $option.attr("selected", "");

                        var placeholder = $option.parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-wpcf7-placeholder");
                        $option.text(placeholder);

                        if('' === $option.text()) {
                            $option.text('Select something');
                            $input.parents('.wpcf7-column').find('.rex-wpcf7-column-content-data').attr('data-wpcf7-placeholder', 'Select something');
                        }
                    } else {
                        var $disabledOption = $('<option value disabled selected></option>');

                        $input.prepend($disabledOption);
                        var placeholder = $input.parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-wpcf7-placeholder");
                        $disabledOption.text(placeholder);

                        if('' === $disabledOption.text()) {
                            $disabledOption.text('Select something');
                            $input.parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-wpcf7-placeholder", 'Select something');
                        }
                    }

                    $input.on("change", function () {
                        var color = $input.parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-select-color-after-selection");
                        $input.css("color", color);
                    })
                    break;
                case "radio":
                    // var $radios = $formColumn.find('input[type=radio]');

                    // $radios.each(function(index, el) {
                    //     var $element = $(el);

                    //     $element.addClass("with-gap");
                    //     $element.attr("id", "wpcf7-radio-" + (i + 1));
                    //     var $spanLabel = $element.siblings('.wpcf7-list-item-label');

                    //     if ($spanLabel.length != 0) {
                    //         var text = $spanLabel.text();
                    //         $spanLabel.empty();

                    //         var $label = $(document.createElement("label"));
                    //         $label.addClass('wpcf7-radio-label');
                    //         $label.attr('for',  $element.attr('id'));
                    //         $label.text(text);
                    //         $label.insertAfter($spanLabel);
                    //         $spanLabel.removeClass('wpcf7-list-item-label');
                    //     } else {
                    //         $element.siblings('.wpcf7-radio-label').attr('for', 'wpcf7-radio-' + (i + 1));
                    //     }
                    // });
                    break;
                case "acceptance":
                    break;
                case "file":
                    // var $inputWrap = $formColumn.find(".wpcf7-form-control-wrap");

                    // if ($inputWrap.find(".wpcf7-file-caption").length == 0) {
                    //     $inputWrap.siblings(".wpcf7-file-caption").detach().appendTo($inputWrap);
                    // }

                    // var $element = $inputWrap.find('[type=file]');
                    // $element.attr("id", "wpcf7-file-" + (i + 1));
                    // $element.siblings('label').remove();
                    // var $fileLabel = $(document.createElement("label"));
                    // $fileLabel.attr("for",  $element.attr("id"));
                    // $fileLabel.insertAfter($element);

                    // if ('undefined' != typeof $inputWrap.parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-button-text")) {
                    //     var buttonText = $inputWrap.parents(".wpcf7-column").find(".rex-wpcf7-column-content-data").attr("data-button-text");
                    //     $fileLabel.text(buttonText);
                    // } else {
                    //     $fileLabel.text("Choose a file");
                    // }
                    break;
                case "submit":
                    break;
                default:
                    break;
            }
        });
        
        _fixWpcf7RadioButtons();
        _fixWpcf7Files();
    }

    var _getDBFormsInPage = function () {
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper").has('.wpcf7-form');

        if ( 0 === $elementWrappers.length ) {
            return;
        }

        idsInPage = [];
        $elementWrappers.each(function() {
            idsInPage.push($(this).attr('data-rex-element-id'));
        });

        formOccurencies = {};
        for (var i = 0; i < idsInPage.length; i++) {
            var id = idsInPage[i];
            formOccurencies[id] = formOccurencies[id] ? formOccurencies[id] + 1 : 1;
        }

        idsInPage = Array.from(new Set(idsInPage));

        $.ajax({
            type: "POST",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
                action: "rex_wpcf7_get_forms",
                nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                form_id: idsInPage
            },
            success: function(response) {
                if (response.success) {
                    var id, i = 0;
                    for ( i=0; i < idsInPage.length; i++ ) {
                        $formsInPage[idsInPage[i]] = $(response.data.html_forms[i].toString().trim());
                    }

                    _fixWpcf7();
                    Rexbuilder_Rexelement.addStyles();
                }
            },
            error: function(response) {}
        });
    }

    function _init() {
    	$formsInPage = {};

    	_getDBFormsInPage();
    }

    return {
    	init: _init,

    	addFormInPage: _addFormInPage,
    	updateDBFormsInPage: _updateDBFormsInPage,

    	fixInputs: _fixInputs,

    	createColumnContentSpanData: _createColumnContentSpanData,
    }
})(jQuery);