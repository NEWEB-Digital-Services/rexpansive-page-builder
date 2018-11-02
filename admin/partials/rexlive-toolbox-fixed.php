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

?>
<div class="rexlive-toolbox__toggle-wrap">
  <div class="tools-container">
    <div class="tool-option close-toolbox tippy" data-tippy-content="<?php esc_attr_e( 'Hide', 'rexpansive' ); ?>">
      <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
    </div>
  </div>
</div>
<div class="rexlive-toolbox__wrap">
  <div class="rexlive-toolbox">
    <div class="tools-container-left">
      <div class="left-tools">
        <div class="tool-option tool-option--placeholder">
          <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
        </div>
        <div class="tool-option btn-custom-css tippy" id="open-css-editor" data-tippy-content="<?php esc_attr_e( 'Css', 'rexpansive' ); ?>">
          <?php Rexbuilder_Utilities::get_icon('#A008-Code'); ?>
        </div>
      </div>
    </div>
    <div class="tools-container-middle">
      <?php // include_once 'rexlive-toolbox--layout-area-list.php'; ?>
      <?php include_once 'rexlive-toolbox--insert-area.php'; ?>
    </div>
    <div class="tools-container-right">
      <?php include_once 'rexlive-toolbox--actions-area.php'; ?>
    </div>
  </div>
</div>