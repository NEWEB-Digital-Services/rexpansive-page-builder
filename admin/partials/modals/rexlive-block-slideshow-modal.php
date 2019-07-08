<?php
/**
 * Modal for insert/edit a slideshow inside a block
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<!-- Block Slideshow -->
<div class="rex-modal-wrap">
    <div id="rex-block-slideshow-editor" class="rex-modal rex-modal-draggable rexbuilder-materialize-wrap">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content"> 
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="rex-slideshow__slide-list">
                        
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <button id="rex-slideshow__add-new-slide" class="tool-button tool-button--inline tippy"  data-tippy-content="Add slide">
                    <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </button>
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
<!-- // Block Slideshow -->