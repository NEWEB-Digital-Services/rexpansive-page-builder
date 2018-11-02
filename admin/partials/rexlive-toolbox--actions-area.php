<div class="right-tools rexlive-builder-actions">
  <?php include_once 'rexlive-toolbox--layout-area-dropdown.php'; ?>
  <div class="tool-option btn-undo tippy" data-tippy-content="<?php esc_attr_e( 'Undo', 'rexpansive' ); ?>">
    <?php Rexbuilder_Utilities::get_icon('#A003-Undo'); ?>
  </div>
  <div class="tool-option btn-redo tippy" data-tippy-content="<?php esc_attr_e( 'Redo', 'rexpansive' ); ?>">
    <?php Rexbuilder_Utilities::get_icon('#A002-Redo'); ?>
  </div>
  <div class="tool-option btn-save tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive' ); ?>">
    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
  </div>
</div>