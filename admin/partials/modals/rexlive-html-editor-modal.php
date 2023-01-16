<?php
/**
 * Modal to edit the text inside a block as HTML
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-html-text-editor" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable setting-edited">
        <div class="tool-button tool-button--inline tool-button--black tool-button--close rex-modal__close-button tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </div>
        <div class="modal-content">
            <div id="rex-html-ace-editor" class="rex-ace-editor"></div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--confirm tool-button--modal rex-modal__save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive-builder' ); ?>">
                <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z016-Checked'); ?></span>
            </div>
            <div class="tool-button tool-button--inline tool-button--modal rex-modal-option tippy" data-rex-option="reset" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
                <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z014-Refresh'); ?></span>
            </div>
        </div>
    </div>
</div>
<!-- HTML Editor -->