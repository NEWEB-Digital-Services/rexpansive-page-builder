<?php
/**
 * Modal for RexButton editing
 *
 * @since x.x.x
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
	<div id="rex-wpcf7-content-adder" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
		<!-- Closing button -->
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <!-- General wrap -->
        <div class="modal-content">
        	<?php include 'rexlive-loader-modal.php'; ?> <!-- // Add text field -->
            <div class="bl_modal-row">
        		<div class="rexwpcf7-cont_row">
                    <div class="rex-accordion--toggle bl_d-iflex">                                
                        <div class="rexwpcf7-upd-add_button rex-add-text-field tippy" data-tippy-content="<?php esc_attr_e( 'Text', 'rexpansive-builder' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
                    </div>
                    <div id="rex-wpcf7-add-text-field" class="l-icon--dark-grey bl_d-iflex">
                        <?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
                    </div>
        		</div>
            </div>
            <!-- Add textarea field -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rex-accordion--toggle bl_d-iflex">                                
                        <div class="rexwpcf7-upd-add_button rex-add-textarea-field tippy" data-tippy-content="<?php esc_attr_e( 'Textarea', 'rexpansive-builder' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
                    </div>
                    <div id="rex-wpcf7-add-textarea-field" class="l-icon--dark-grey bl_d-iflex">
                        <?php Rexbuilder_Utilities::get_icon('#B029-Input-Text-Area'); ?>
                    </div>
                </div>
            </div>
            <!-- Add menu field -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rex-accordion--toggle bl_d-iflex">                                
                        <div class="rexwpcf7-upd-add_button rex-add-menu-field tippy" data-tippy-content="<?php esc_attr_e( 'Menu', 'rexpansive-builder' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
                    </div>
                    <div id="rex-wpcf7-add-select-field" class="l-icon--dark-grey bl_d-iflex">
                        <?php Rexbuilder_Utilities::get_icon('#B030-Input-Select'); ?>
                    </div>
                </div>
            </div>
            <!-- Add radiobuttons -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rex-accordion--toggle bl_d-iflex">                                
                        <div class="rexwpcf7-upd-add_button rex-add-radiobuttons-field tippy" data-tippy-content="<?php esc_attr_e( 'Radio buttons', 'rexpansive-builder' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
                    </div>
                    <div id="rex-wpcf7-add-radio-field" class="l-icon--dark-grey bl_d-iflex">
                        <?php Rexbuilder_Utilities::get_icon('#B031-Input-Radio'); ?>
                    </div>
                </div>
            </div>
            <!-- // Add Checkbox -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rex-accordion--toggle bl_d-iflex">                                
                        <div class="rexwpcf7-upd-add_button rex-add-checkbox-field tippy" data-tippy-content="<?php esc_attr_e( 'Checkbox', 'rexpansive-builder' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
                    </div>
                    <div id="rex-wpcf7-add-checkbox-field" class="l-icon--dark-grey bl_d-iflex">
                        <?php Rexbuilder_Utilities::get_icon('#B032-Input-Checkbox'); ?>
                    </div>
                </div>
            </div>
            <!-- Add file -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rex-accordion--toggle bl_d-iflex">                                
                        <div class="rexwpcf7-upd-add_button rex-add-file-field tippy" data-tippy-content="<?php esc_attr_e( 'File', 'rexpansive-builder' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
                    </div>
                    <div id="rex-wpcf7-add-file-field" class="l-icon--dark-grey bl_d-iflex">
                        <?php Rexbuilder_Utilities::get_icon('#B033-Input-Upload'); ?>
                    </div>
                </div>
            </div>
            <!-- Add submit button -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rex-accordion--toggle bl_d-iflex">
                        <div class="rexwpcf7-upd-add_button rex-add-submit-button tippy" data-tippy-content="<?php esc_attr_e( 'Submit button', 'rexpansive-builder' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
                    </div>
                    <div id="rex-wpcf7-add-submit-field" class="l-icon--dark-grey bl_d-iflex">
                        <?php Rexbuilder_Utilities::get_icon('#B034-Input-Button'); ?>
                    </div>
                </div>
            </div>
        </div>
	</div>
</div>
<!-- Add Form Content -->