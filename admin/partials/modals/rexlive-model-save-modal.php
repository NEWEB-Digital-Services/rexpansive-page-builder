<?php
/**
 * Modal to warn the user to close a synchronize model
 * before save the page, or leave it
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-open-models-warning" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content modal-content--text">
            <div class="open-models-message">
                <div><?php _e( "Warning, there are some models open.", 'rexpansive' ); ?></div>
                <div><?php _e( 'To close a model press on the flashing padlock in the row tools.', 'rexpansive' ); ?></div>
                <img src="<?php echo REXPANSIVE_BUILDER_URL . 'admin/img/close-model.jpg'; ?>" alt="<?php _e( 'close model', 'rexpansive' ); ?>">
                <?php // _e( "Close them before save:", 'rexpansive'); ?>
                <!-- <div class="open-models-list"></div> -->
            </div>
        </div>
    </div>
</div><!-- Edit Model  -->