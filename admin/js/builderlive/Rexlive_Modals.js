
var Rexlive_Modals = (function ($) {
  'use strict';


  function init() {
    // Top Tools
    Rexlive_Top_Tools.init();
    
    // Section
    Section_Modal.init();

    // New blocks video
    Insert_Video_Modal.init();

    // Custom css
    CssEditor_Modal.init();

    // HTML editor
    HtmlEditor_Modal.init();

    // Background row
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

    // models edit title
    Rexlive_Model_Edit_Name_Modal.init();

    // models open warning
    Open_Models_Warning.init();

    // layouts
    CustomLayouts_Modal.init();

    // change active layout
    Change_Layout_Modal.init();

    // resynch content with default
    Resynch_Content_Modal.init();

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

    // Element chooser
    Element_Choose_Modal.init();
    
    // Wpcf7 Content Adder
    Wpcf7_Add_Content_Modal.init();

    // Wpcf7 Content Editor
    Wpcf7_Edit_Content_Modal.init();

    // Wpcf7 Form Editor
    Wpcf7_Edit_Form_Modal.init();

    // Delete Model (Template, button, form)
    Delete_Model_Modal.init();

    // live media list
    Rexlive_PostEdit_MediaList.init();
  }

  return {
    init: init,
  };

})(jQuery);