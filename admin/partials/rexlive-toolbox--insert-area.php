<?php
/**
 * @since 2.0.0
 */
?>

<div class="bl_d-iflex bl_ai-c toolbox-insert-area">
  <div class="toolbox-insert-area--row-info">
    <input type="hidden" name="toolbox-insert-area--row-id" value="">
    <input type="hidden" name="toolbox-insert-area--row-model-id" value="">
  </div>

  <div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat toolbox-add-new-block-image tippy" data-tippy-content="<?php _e('Image','rexpansive'); ?>">
    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
  </div>

  <div class="tool-button tool-button--flat toolbox-add-new-block-text tool-button__text--flat tool-button--inline tippy" data-tippy-content="<?php _e('Text','rexpansive'); ?>">
    <?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
  </div>

  <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat toolbox-add-new-block-video tippy" data-tippy-content="<?php _e('Video','rexpansive'); ?>">
    <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
  </div>

  <!-- Pulsante per importare i modelli -->
  <div class="tool-button tool-button--flat tool-button--inline btn-models tippy" data-tippy-content="<?php esc_attr_e( 'Models', 'rexpansive' ); ?>">
    <?php Rexbuilder_Utilities::get_icon('#A012-Models-List'); ?>
  </div>

  <div class="tool-button-floating">
    <!-- to add an empty block add this class: add-new-block-empty -->
    <div class="tool-button tool-button--flat active">
      <?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>
    </div>

    <div class="tool-button_list">
      <div class="tool-button tool-button_list--item toolbox-add-new-block-slider tippy" data-tippy-content="<?php _e('Slider','rexpansive'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
      </div>

      <div class="tool-button tool-button_list--item toolbox-add-new-section tippy" data-tippy-content="<?php _e('Insert Row','rexpansive'); ?>" data-new-row-position="after">
        <?php Rexbuilder_Utilities::get_icon('#B016-New-Adjacent-Row'); ?>
      </div>
    </div>
  </div>
</div><!-- // insert element -->