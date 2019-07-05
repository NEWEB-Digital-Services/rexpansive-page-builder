<?php
/**
 * Modal to insert a gradient as a background for a block
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<!-- Block Background Gradient -->
<div class="rex-modal-wrap">
    <div id="rex-block-background-gradient-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div id="gp-block-background-gradient" class="no-draggable" style="width:100%;"></div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <select class="browser-default" id="block-background-gradient-type">
                        <option value="">Select Type</option>
                        <option value="radial">Radial</option>
                        <option value="linear">Linear</option>
                        <option value="repeating-radial">Repeating Radial</option>
                        <option value="repeating-linear">Repeating Linear</option>
                    </select>
                </div>
                <div class="bl_modal__option-wrap">
                    <select class="browser-default" id="block-background-gradient-angle">
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
        <?php // include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div>
<!-- // Block Background Gradient -->