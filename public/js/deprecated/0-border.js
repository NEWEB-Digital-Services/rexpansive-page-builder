var RexBuilderBorder = (function($){
    'use strict';

    var init = function() {
         var $i;
         var $parent = $('.rexpansive_section').parent();
         for($i =0; $i < 3; $i++){
             $boxes[$i] = document.createElement('div');
         }
         $parent.append(document.createElement('div'));
    };

    return {
        init: init,
    }
})(jQuery);