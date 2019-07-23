<?php
/**
 * Modal for transform a row into a Model
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-model-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="Cancel" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content">

            <?php include 'rexlive-loader-modal.php'; ?>

            <div class="rex-model__add-model__wrap rex-modal-content__modal-area" style="display:flex;">
                <div id="rex-model__name__wrap" class="input-field col input-field--small" style="width:100%;">
                    <input type="text" id="rex-model__name" name="rex-model__name">
                    <label for="rex-model__name" class=""><?php _e('Model name', 'rexpansive');?></label>
                    <span class="rex-material-bar"></span>
                </div>
            </div><!-- // .rex-model__add-model__wrap -->

        </div>

        <div class="rex-modal__outside-footer">
            <div id="rex-model__add-new-model" class="tool-button tool-button--inline tool-button--save tippy" data-tippy-content="<?php esc_attr_e( 'Create Model', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div><!-- RexModel modal -->