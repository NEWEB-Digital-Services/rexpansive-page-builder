<?php
/**
 * Right fast configuration area
 * 
 * @since 2.0.0
 */
?>
<div class="bl_d-iflex bl_ai-c toolbox-right-fast-config-area toolbox-config-area">
  <div class="tool-button--double-icon--wrap tool-button--hide tippy" data-tippy-content="<?php _e('Background Image','rexpansive'); ?>">
    <div class="tool-button tool-button--full edit-row-image-background-toolbox">
      <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
    </div>
    <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-image-background-toolbox">
      <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
  </div>

  <div class="tool-button--double-icon--wrap tool-button--hide tippy" data-tippy-content="<?php _e('Background Color','rexpansive'); ?>">
    <input class="spectrum-input-element" type="text" name="edit-row-color-background-toolbox">
    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
    <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-color-background-toolbox">
      <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
  </div><!-- // Change Row color background -->

  <div class="tool-button--double-icon--wrap tool-button--hide tool-button--opacity-preview tippy" data-tippy-content="<?php _e('Overlay','rexpansive'); ?>">
    <input class="spectrum-input-element" type="text" name="edit-row-overlay-color-toolbox">
    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
    <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-overlay-color-toolbox">
      <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
  </div>
  <!-- // Change Row overlay color -->

  <div class="tool-button--double-icon--wrap tool-button--hide tippy" data-tippy-content="<?php _e('Background Video','rexpansive'); ?>">
    <div class="tool-button tool-button__fast-video edit-row-video-background-toolbox">
      <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
    </div>
    <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background-toolbox">
      <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
  </div>
</div>