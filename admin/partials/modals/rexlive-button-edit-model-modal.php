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
                <?php _e('Warning, you are about to change the style of a model! What do you want to do?','rexpansive'); ?>
                <br>
                <span class="info-model-name__wrap"><span class="info-model-name"></span>&nbsp;</span>
            </div>
            <div>
                <div class="rex-edit-button-model-option" data-rex-option="edit">
                    <button class="rex-button edit-button-model"><?php _e( 'Maintain', 'rexpansive' ); ?></button>
                </div>
                <div class="rex-edit-button-model-option" data-rex-option="remove">
                    <button class="rex-button remove-button-model"><?php _e( 'Separate', 'rexpansive' ); ?></button>
                </div>
            </div>
        </div>
    </div>
</div><!-- Edit button Model  -->