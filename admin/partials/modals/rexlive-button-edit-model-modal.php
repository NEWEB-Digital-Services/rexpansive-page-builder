<?php
/**
 * Modal that warns the user that he is trying to edit a
 * button that is synchornized with a model
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-button-model-choose" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content modal-content--text">
            <div class="edit-button-model-choose">
                <?php _e('Warning, you are about to change the style of a model! What do you want to do?','rexpansive-builder'); ?>
                <br>
                <span class="info-model-name__wrap"><span class="info-model-name"></span>&nbsp;</span>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button--double-icon--wrap tool-button--double-icon--active tool-button--double-icon--big rex-button remove-button-model tippy" data-tippy-content="<?php esc_attr_e( 'Maintain', 'rexpansive-builder' ); ?>" data-rex-option="edit">
                <div class="tool-button tool-button--inline tool-button--blue tool-button--modal">
                    <?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--black tool-button--double-icon">
                    <?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?>
                </div>
            </div>

            <div class="tool-button tool-button--inline tool-button--modal tool-button--blue rex-button edit-button-model tippy" data-tippy-content="<?php esc_attr_e( 'Separate', 'rexpansive-builder' ); ?>" data-rex-option="remove">
                <?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?>
            </div>
        </div>
    </div>
</div><!-- Edit button Model  -->