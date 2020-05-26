<?php
/**
 * Modal that allows to add custom CSS to a page
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-css-editor" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable setting-edited">
        <div id="css-editor-cancel" class="tool-button tool-button--inline tool-button--black tool-button--close rex-cancel-button tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </div>
        <div class="modal-content">
            <div id="rex-css-ace-editor" class="rex-ace-editor"></div>
        </div>
        <div class="rex-modal__outside-footer">
            <div id="css-editor-save" class="tool-button tool-button--inline tool-button--save rex-save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive-builder' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
            <div class="tool-button tool-button--inline tool-button--modal rex-modal-option tippy" data-rex-option="reset" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
                <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z014-Refresh'); ?></span>
            </div>
        </div>
    </div>
</div>
<!-- CSS Editor -->