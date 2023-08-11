<?php
/**
 * Modal to insert a gradient as text color
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<!-- Text Gradient -->
<div class="rex-modal-wrap">
    <div id="rex-text-gradient-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div id="gp-text-gradient" class="no-draggable" style="width:100%;"></div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <select class="browser-default" id="text-gradient-type">
                        <option value="">Select Type</option>
                        <option value="radial">Radial</option>
                        <option value="linear">Linear</option>
                        <!-- <option value="repeating-radial">Repeating Radial</option>
                        <option value="repeating-linear">Repeating Linear</option> -->
                    </select>
                </div>
                <div class="bl_modal__option-wrap">
                    <select class="browser-default" id="text-gradient-angle">
                        <option value="">Select Direction</option>
                        <option value="top">Top</option>
                        <option value="right">Right</option>
                        <option value="center">Center</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="135deg">Diagonal</option>
                        <option value="315deg">Revers Diagonal</option>
                    </select>
                </div>
            </div>
            <div class="bl_modal-row">
            <?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-gradient-palette.php'; ?>
            </div><!-- PALETTE -->
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--confirm tool-button--modal rex-modal__save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive-builder' ); ?>">
                <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z016-Checked'); ?></span>
            </div>
            <div class="tool-button tool-button--inline tool-button--modal rex-modal-option rex-modal__reset-button tippy" data-rex-option="reset" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
                <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z014-Refresh'); ?></span>
            </div>
        </div>
        <?php // include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div>
<!-- // Text Gradient -->