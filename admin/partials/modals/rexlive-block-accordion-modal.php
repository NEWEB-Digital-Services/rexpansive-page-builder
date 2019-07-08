<?php
/**
 * Modal for insert/edit an accordion inside a block
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<!-- Block Accordion -->
<div class="rex-modal-wrap">
    <div id="rex-block-accordion-editor" class="rex-modal rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content"> 
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="bl_switch tippy" data-tippy-content="<?php _e('closed/open','rexpansive'); ?>">
                        <label>
                            <input class="rex-accordion-open-close-val" name="rex-accordion-open-close-val" type="checkbox">
                            <span class="lever"></span>
                            <span class="bl_switch__icon">
                                <span class="bl_switch__icon--checked"><?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?></span>
                                <span class="bl_switch__icon--unchecked"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
                            </span>
                        </label>
                    </div><!-- // Accordion open/closed -->
                </div>
                <div class="bl_modal__option-wrap" style="display:none;">
                    <input type="hidden" name="rex-accordion-toggle-icon-val">
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="modal-editor-editorarea">
                        <?php wp_editor('', 'rex-accordion-header-val', array('textarea_rows' => 20, 'wpautop' => false, 'editor_height' => 150));?>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="modal-editor-editorarea">
                        <?php wp_editor('', 'rex-accordion-content-val', array('textarea_rows' => 20, 'wpautop' => false, 'editor_height' => 150));?>
                    </div>
                </div>
                <div class="bl_modal__option-wrap">
                    <div>
                        <span class="tool-button rex-accordion-content-gallery"><?php Rexbuilder_Utilities::get_icon('#C005-Layout'); ?></span>
                    </div>
                    <div class="rex-accordion-content-gallery__preview">
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-modal__save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
        <?php // include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div>
<!-- // Block Accordion -->