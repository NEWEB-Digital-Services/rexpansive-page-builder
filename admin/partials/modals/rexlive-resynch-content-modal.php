<?php
/**
 * Modal that ask the user if want to continue with the synch operation
 * This action bring back the block/section desired to the default layout
 * re-synch its settings
 *
 * @since 2.0.5
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-resynch-content" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black tool-button--close rex-resynch-content-option tippy" data-position="bottom" data-tippy-content="<?php _e( 'Cancel', 'rexpansive-builder');?>" data-rex-option="abort">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <div class="layout-page-changed-description">
                <strong><?php _e( 'WARNING:', 'rexpansive-builder' ); ?></strong> <?php _e( 'you are about to reset the settings of this element to those of the default layout. Are you sure?', 'rexpansive-builder' ); ?>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-resynch-content-option tippy" data-tippy-content="<?php _e( 'Yes','rexpansive-builder' ); ?>" data-rex-option="save">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
        </div>
    </div>
</div><!-- Layout page Changed -->