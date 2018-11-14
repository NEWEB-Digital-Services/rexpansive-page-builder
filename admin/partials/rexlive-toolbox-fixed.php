<?php
/**
 * Print the top toolbox
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined('ABSPATH') or exit;
global $layoutsAvaiable;
$small_tools = true;
?>
<div class="rexlive-toolbox__toggle-wrap">
  <div class="">
    <div class="tool-option close-toolbox tippy" data-tippy-content="<?php esc_attr_e( 'Hide', 'rexpansive' ); ?>">
      <span class="close-toolbox__logo-wrap"><?php Rexbuilder_Utilities::get_icon('#Z010-Logo'); ?></span>
      <!-- <img class="rexlive-logo" src="<?php // echo REXPANSIVE_BUILDER_URL; ?>admin/img/ico-rexpansive.png" alt="Rexpansive" width="20"> -->
      <span class="close-toolbox__icon-wrap"><?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?></span>
    </div>
  </div>
</div>
<div class="rexlive-toolbox__wrap">
  <div class="rexlive-toolbox">
    <div class="tools-container-left tools-container">
      <div class="left-tools">
        <div class="tool-option tool-option--placeholder">
          <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
        </div>

        <div class="tool-option btn-save tool-option--full-filled tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive' ); ?>">
          <span class="btn-save--icon"><?php Rexbuilder_Utilities::get_icon('#A006-Save-Clear'); ?></span>
          <!-- <span>
            <span class="btn-save--edited"><?php // Rexbuilder_Utilities::get_icon('#A006-Save-Clear'); ?></span>
            <span class="btn-save--saved"><?php // Rexbuilder_Utilities::get_icon('#A006-Save-Clear'); ?></span>
          </span> -->
          <span class="btn-save__label"><?php _e('Save','rexpansive'); ?></span>
        </div>

        <div class="tool-option tool-option--full btn-models tippy" data-tippy-content="<?php esc_attr_e( 'Models', 'rexpansive' ); ?>">
          <?php Rexbuilder_Utilities::get_icon('#A012-Models-List'); ?>
        </div>
      </div>
    </div>
    <div class="tools-container-middle tools-container tools-insert-area">
      <?php // include_once 'rexlive-toolbox--layout-area-list.php'; ?>
      <?php include_once 'rexlive-toolbox--insert-area.php'; ?>
    </div>
    <div class="tools-container-right tools-container">
      <?php include_once 'rexlive-toolbox--actions-area.php'; ?>
    </div>
  </div>
</div>