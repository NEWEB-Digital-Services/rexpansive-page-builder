
var Rexlive_Modals = (function ($) {
    'use strict';

    var init = function () {
        // Top Tools
        Rexlive_Top_Tools.init();
        
        // section
        Section_Modal.init();

        // new blocks video
        Insert_Video_Modal.init();

        // custom css
        CssEditor_Modal.init();

        // html editor
        HtmlEditor_Modal.init();

        // background row
        SectionBackground_Modal.init();

        // Section background gradient
        Rexlive_Section_Background_Gradient.init();

        // Section overlay gradient
        Rexlive_Section_Overlay_Gradient.init();

        // background video row
        Section_Video_Background_Modal.init();

        // block options
        BlockOptions_Modal.init();

        // block content position modal
        Block_Content_Positions_Modal.init($("#rex-block-content-position-editor"));

        // Block accordion element
        Rexlive_Block_Accordion.init();

        // Block slideshow element
        Rexlive_Block_Slideshow.init();

        // Text gradient
        Rexlive_Text_Gradient.init();
        
        // Block background gradient
        Rexlive_Block_Background_Gradient.init();

        // Block Overlay gradient
        Rexlive_Block_Overlay_Gradient.init();

        // models
        Model_Modal.init();

        // models edit
        Model_Edit_Modal.init();

        // models open warning
        Open_Models_Warning.init();

        // layouts
        CustomLayouts_Modal.init();

        // change active layout
        Change_Layout_Modal.init();

        // change active layout
        LockedOptionMask.init();

        // lateral menu
        Model_Lateral_Menu.init();

        // Page tools
        Rexlive_Page_Settings_Modal.init();

        // Model import tab
        Model_Import_Modal.init();

        // Inline SVG Modal
        Rexlive_Inline_SVG.init();
        // Button import tab
        Button_Import_Modal.init();

        //editor button
        Button_Edit_Modal.init();

        // Element import tab
        Element_Import_Modal.init();
        
        // Element editor
        Element_Edit_Modal.init();

        // live media list
        Rexlive_PostEdit_MediaList.init();
    }

    return {
        init: init,
    };

})(jQuery);