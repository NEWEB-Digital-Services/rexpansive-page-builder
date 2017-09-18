; (function ($) {
    'use strict';

    function addHandles($elem) {
        var $handles = [];
        for (var $i = 0; $i < 8; $i++) {
            $handles[$i] = document.createElement('span');
        }

        function resizeHeight($elem){
            console.log($elem);
        }

        $handles[0].setAttribute('class', 'handle top-left');
        $handles[1].setAttribute('class', 'handle top-center');
        $handles[2].setAttribute('class', 'handle top-right');
        $handles[3].setAttribute('class', 'handle mid-left');
        $handles[4].setAttribute('class', 'handle mid-right');
        $handles[5].setAttribute('class', 'handle bottom-left');
        $handles[6].setAttribute('class', 'handle bottom-center');
        $handles[7].setAttribute('class', 'handle bottom-right');
        console.log($('#'+$elem['id']+' .top-left'));
        for (var $i = 0; $i < 8; $i++) {
            console.log($('#'+$elem['id']));
            //$handles[$i].on();
            $('#'+$elem['id']).append($handles[$i]);
        }
        //$('#'+$elem['id']+' .top-left').on('click', this, resizeHeight);
    }

    $(function () {
        var $i = 0;
        $('.perfect-grid-item').each(function () {
            addHandles(this);
        });
        $(document).on('click', '.handle', function(){
            console.log(this.parentNode);
        })
        //var $x = $('.perfect-grid-gallery');
        //console.log($x);
        // console.log($x.data('plugin_perfectGridGallery'));
    }); // DOM Ready

    $(window).load(function () {
        console.log("abc");
    }); // Entire content loaded


})(jQuery);