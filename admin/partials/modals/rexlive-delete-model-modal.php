<?php
/**
 * Modal that ask the user if want to continue deleting a model
 * (button, template, form)
 *
 * @since 2.0.5
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-delete-model" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black tool-button--close rex-delete-model-option tippy" data-position="bottom" data-tippy-content="<?php _e( 'Cancel', 'rexpansive-builder');?>" data-rex-option="abort">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <div class="layout-page-changed-description">
                <strong><?php _e( 'WARNING!', 'rexpansive-builder' ); ?></strong> <?php _e( 'If you delete this template and it is present within the pages, it will still be saved but will be made totally independent. Continue?', 'rexpansive-builder' ); ?>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-delete-model-option tippy" data-tippy-content="<?php _e( 'Yes','rexpansive-builder' ); ?>" data-rex-option="confirm">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
        </div>
    </div>
</div><!-- Delete Model (template, button, form) -->