<?php
/**
 * 
 * @since 2.0.0
 */
?>

<div class="bl_d-iflex bl_ai-c toolbox-left-config-area toolbox-config-area">
  <div class="tool-option tool-option--togglable tool-option--small toolbox-collapse-grid tippy" data-tippy-content="<?php _e('Collapse','rexpansive-builder'); ?>">
    <?php Rexbuilder_Utilities::get_icon('#B006-Collapse'); ?>
  </div><!-- // collapse -->

  <div class="switch-toggle switch-live--dark-alt">
    <input type="radio" class="edit-row-width-toolbox" data-section_width="full" id="row-dimension-full-toolbox" name="row-dimension-toolbox" value="100%">
    <label class="tippy" data-tippy-content="<?php _e('Full','rexpansive-builder'); ?>" for="row-dimension-full-toolbox"><span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span></label>
    <input type="radio" class="edit-row-width-toolbox" data-section_width="boxed" id="row-dimension-boxed-toolbox" name="row-dimension-toolbox" value="80%" checked>
    <label class="tippy" data-tippy-content="<?php _e('Boxed','rexpansive-builder'); ?>" for="row-dimension-boxed-toolbox"><span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span></label>
    <a></a>
  </div><!-- // Row dimension -->  
</div>

<div class="bl_d-iflex bl_ai-c toolbox-insert-area">
  <div class="toolbox-insert-area--row-info">
    <input type="hidden" name="toolbox-insert-area--row-id" value="">
    <input type="hidden" name="toolbox-insert-area--row-model-id" value="">
    <input type="hidden" name="toolbox-insert-area--row-model-editing" value="">
  </div>

  <div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat toolbox-add-new-block-image tippy" data-tippy-content="<?php _e('Image','rexpansive-builder'); ?>">
    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
  </div>

  <div class="tool-button tool-button--flat toolbox-add-new-block-text tool-button__text--flat tool-button--inline tippy" data-tippy-content="<?php _e('Text','rexpansive-builder'); ?>">
    <?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
  </div>

  <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat toolbox-add-new-block-video tippy" data-tippy-content="<?php _e('Video','rexpansive-builder'); ?>">
    <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
  </div>

  <div class="tool-button-floating tool-button__settings--flat">
    <!-- to add an empty block add this class: add-new-block-empty -->
    <div class="tool-button tool-button--flat active">
      <?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>
    </div>

    <div class="tool-button_list">
      <div class="tool-button tool-button_list--item toolbox-add-new-block-slider tippy" data-tippy-content="<?php _e('Slider','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
      </div>

      <div class="tool-button tool-button_list--item toolbox-add-new-section tippy" data-tippy-content="<?php _e('Insert Row','rexpansive-builder'); ?>" data-new-row-position="after">
        <?php Rexbuilder_Utilities::get_icon('#B016-New-Adjacent-Row'); ?>
      </div>
    </div>
  </div>
</div><!-- // insert element -->

<div class="bl_d-iflex bl_ai-c toolbox-right-config-area toolbox-config-area">
  <div class="switch-toggle switch-live--dark" style="display:none;">
    <input type="radio" class="edit-row-layout-toolbox" data-section_layout="fixed" id="row-layout-fixed-toolbox" name="row-layout-toolbox" value="fixed" checked>
    <label class="tippy" data-tippy-content="<?php _e('Grid','rexpansive-builder'); ?>" for="row-layout-fixed-toolbox"><span><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span></label>
    <input type="radio" class="edit-row-layout-toolbox" data-section_layout="masonry" id="row-layout-masonry-toolbox" name="row-layout-toolbox" value="masonry">
    <label class="tippy" data-tippy-content="<?php _e('Masonry','rexpansive-builder'); ?>" for="row-layout-masonry-toolbox"><span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span></label>
  </div><!-- // Row layout -->

  <div class="bl_switch tippy" data-tippy-content="<?php _e('Grid off/on','rexpansive-builder'); ?>">
    <label>
      <input class="edit-row-layout-toolbox-checkbox" type="checkbox">
      <span class="lever"></span>
      <span class="bl_switch__icon"><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span>
    </label>
  </div><!-- // Row grid on/off -->

  <div class="tool-button-floating toolbox-builder-section-config--wrap tool-button--model-hide">
    <div class="tool-button-floating__activator tool-option--small" data-tippy-content="<?php _e('Row settings', 'rexpansive-builder');?>" data-tippy-placement="right">
      <?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>
    </div>

    <div class="tool-button_list">	
      <div class="tool-button tool-button_list--item tool-button--full edit-background-section-toolbox tippy tool-button--hide">
        <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
      </div><!-- // Hide old tool: opens a modal with only the background settings of a row -->

      <div class="tool-button tool-button_list--item toolbox-builder-section-config tippy" data-tippy-content="<?php _e('Row settings', 'rexpansive-builder');?>">
        <?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
      </div>

      <div class="tool-button tool-button_list--item tool-button--full edit-row-image-background-toolbox tippy" data-tippy-content="<?php _e('Background Image','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
      </div>

      <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Background Color','rexpansive-builder'); ?>">
        <input class="spectrum-input-element" type="text" name="edit-row-color-background-toolbox">
        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
      </div><!-- // Change Row color background -->

      <div class="tool-button--double-icon--wrap tool-button_list--item tool-button--opacity-preview tippy" data-tippy-content="<?php _e('Overlay','rexpansive-builder'); ?>">
        <input class="spectrum-input-element" type="text" name="edit-row-overlay-color-toolbox">
        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
      </div>
      <!-- // Change Row overlay color -->

      <div class="tool-button edit-row-video-background-toolbox tool-button_list--item tippy" data-tippy-content="<?php _e('Background Video','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
      </div>
      
      <div class="tool-button open-model-toolbox tool-button_list--item tippy" data-tippy-content="<?php _e('Template','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#B005-RexModel'); ?>
      </div>
    </div>

  </div>
</div>

<?php
if( true == $small_tools ) {
  include "rexlive-toolbox--fast-config-area.php";
}