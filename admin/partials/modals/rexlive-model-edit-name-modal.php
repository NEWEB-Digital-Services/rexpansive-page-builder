<?php
/**
 * Modal for edit the name of a RexModel
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-model__edit-name__modal" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php _e('Cancel','rexpansive-builder'); ?>" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content">

            <?php include 'rexlive-loader-modal.php'; ?>

            <div class="rex-modal-content__modal-area">
                <div id="rex-model__edit-name__wrap" class="input-field col input-field--small">
                    <input type="text" id="rex-model__edit-name" name="rex-model__edit-name" data-rex-model-id="">
                    <label for="rex-model__edit-name" class=""><?php _e('Model name', 'rexpansive-builder');?></label>
                    <span class="rex-material-bar"></span>
                </div>
            </div>
        </div>

        <div class="rex-modal__outside-footer">
            <div id="rex-model__edit-name__save" class="tool-button tool-button--inline tool-button--save tippy" data-tippy-content="<?php esc_attr_e( 'Edit Name', 'rexpansive-builder' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div><!-- RexModel modal -->