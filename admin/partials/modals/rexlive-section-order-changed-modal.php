<?php
/**
 * Modal that warns of a layout change in case of not saved changes
 *
 * @since 2.0.10
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-layout-section-order-changed" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black rex-section-order-changed-option tool-button--close tippy" data-position="bottom" data-tippy-content="<?php _e( 'Cancel', 'rexpansive-builder');?>" data-rex-option="abort">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <div class="layout-page-changed-description">
                <?php _e( 'The order of the sections has been changed.', 'rexpansive-builder' ); ?><br />
                <?php _e( 'Do you want to synchronize this order also for the other devices?', 'rexpansive-builder' ); ?>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-section-order-changed-option tippy" data-tippy-content="<?php _e('Yes and Continue','rexpansive-builder'); ?>" data-rex-option="save">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
            <div class="tool-button tool-button--inline tool-button--cancel tool-button--modal rex-section-order-changed-option tippy" data-rex-option="continue" data-tippy-content="<?php _e('No and Continue','rexpansive-builder'); ?>">
                <span class="rex-button continue btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
            </div>
        </div>
    </div>
</div><!-- Layout page Changed -->