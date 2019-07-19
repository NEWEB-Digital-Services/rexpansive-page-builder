<?php
/**
 * Modal for choose how to edit a modal
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-edit-model-choose" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content modal-content--text">
            <div class="edit-model-description">
                <?php _e('What kind of editing do you want to make to the model:','rexpansive'); ?>
                <br>
                <span class="info-model-name__wrap"><span class="info-model-name"></span>&nbsp;<span>?</span></span>
            </div>
            <!-- <div>
                <div class="rex-edit-model-option" data-rex-option="edit">
                    <button class="rex-button edit-model">Edita</button>
                </div>
                <div class="rex-edit-model-option" data-rex-option="remove">
                    <button class="rex-button remove-model">Togli</button>
                </div>
            </div> -->
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button--double-icon--wrap tool-button--double-icon--active tool-button--double-icon--big rex-button edit-model rex-edit-option tippy" data-tippy-content="<?php esc_attr_e( 'Edit synchronized model', 'rexpansive' ); ?>" data-rex-option="edit">
                <div class="tool-button tool-button--inline tool-button--blue tool-button--modal">
                    <?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--black tool-button--double-icon">
                    <?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?>
                </div>
            </div>

            <div class="tool-button tool-button--inline tool-button--modal tool-button--blue rex-button remove-model rex-edit-option tippy" data-tippy-content="<?php esc_attr_e( 'Edit removing sync', 'rexpansive' ); ?>" data-rex-option="remove">
                <?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?>
            </div>
        </div>
    </div>
</div><!-- Edit Model  -->