<div class="right-tools rexlive-builder-actions">
  <?php
  if( false == $small_tools ) {
    include "rexlive-toolbox--fast-config-area.php";
  }
  ?>
  <?php include_once 'rexlive-toolbox--layout-area-dropdown.php'; ?>
  <div class="tool-option btn-undo tippy" data-tippy-content="<?php esc_attr_e( 'Undo', 'rexpansive-builder' ); ?>">
    <?php Rexbuilder_Utilities::get_icon('#A003-Undo'); ?>
  </div>
  <div class="tool-option tool-option--full btn-redo tippy" data-tippy-content="<?php esc_attr_e( 'Redo', 'rexpansive-builder' ); ?>">
    <?php Rexbuilder_Utilities::get_icon('#A002-Redo'); ?>
  </div>
  <div class="tool-option tool-option--full btn-custom-css tippy" id="open-css-editor" data-tippy-content="<?php esc_attr_e( 'Css', 'rexpansive-builder' ); ?>">
    <?php Rexbuilder_Utilities::get_icon('#A008-Code'); ?>
  </div>
</div>