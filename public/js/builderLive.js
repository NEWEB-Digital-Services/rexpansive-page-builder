;(function($) {
    'use strict';
    var $elements = [];
    $(function() {
        var $i=0;
        $('.perfect-grid-item').each(function(){
            $elements[$i] = this.attributes;
            $i++;
        });
        var $x = $('.perfect-grid-gallery');
        console.log($x);
        console.log($x.data('plugin_perfectGridGallery'));
    }); // DOM Ready

    $(window).load(function() {
        console.log($elements.length)
        for(var $i=0; $i<$elements.length; $i++){
            console.log($elements[$i]["data-height"]);
        }

    }); // Entire content loaded

    
})(jQuery);