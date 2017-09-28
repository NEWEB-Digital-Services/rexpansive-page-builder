; (function ($) {
    'use strict';
    //If true table is split in 12 columns | if false table is split in width columns    

    function addToolBox($elem) {
        var $div = document.createElement("div");
        $div.setAttribute("id", "toolBox");
        addCheckBox($div);
        $elem.appendChild($div);
    }

    // add a checkbox in the bottom of the elem
    function addCheckBox($elem) {
        var $input = document.createElement('input');
        var $labelBox = document.createElement('label');
        $($labelBox).text("aabbcc");
        $input.setAttribute('type', 'checkbox');
        $input.setAttribute('id', 'tableDrag');
        //$input.setAttribute('checked', 'false');

        $($input).on('click', function () {
            if (this.checked == true) {
                console.log('first type');
                $dragType = true;
            } else {
                console.log('second type');
                $dragType = false;
            }
        });

        var $div = document.createElement('div');
        $div.setAttribute('id', 'dragging-mode');
        $div.appendChild($labelBox);
        $div.appendChild($input);
        $elem.appendChild($div);
    }

    $(function () {
       /*  console.log('adding handles');
        $('.perfect-grid-item').each(function(){
            //console.log(this);
            addHandles(this);
        }); */
        
    }); // DOM Ready

    $(window).load(function () {
        ;
    }); // Entire content loaded

})(jQuery);