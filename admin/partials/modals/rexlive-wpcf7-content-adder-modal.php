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
		<!-- ClosIng Button -->
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <!-- General Wrap -->
        <div class="modal-content">
        	<?php include 'rexlive-loader-modal.php'; ?> <!-- // Add text field -->
            <div id="rex-add-text-field" class="bl_modal-row">
                <div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper" >
                    <!-- <div class="rexwpcf7-upd-add_button  tippy" data-tippy-content="<?php esc_attr_e( 'Text', 'rexpansive-builder' ); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </div> -->
                    <div class="rexwpcf7-add-content tool-button tool-button--flat tool-button--add-big-grey tippy" data-tippy-content="<?php _e('Text', 'rexpansive-builder'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </div>
                    <div id="rex-wpcf7-add-text-field" class="l-icon--dark-grey bl_d-iblock">
                        <?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
                    </div>
                    <div class="bl_d-iblock modal-field-name">text</div>
                </div>
            </div>
            <!-- // Add Textarea Field -->
            <div id="rex-add-textarea-field" class="bl_modal-row">
                <div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper" >
                    <div class="rexwpcf7-add-content tool-button tool-button--flat tool-button--add-big-grey tippy" data-tippy-content="<?php _e('Textarea', 'rexpansive-builder'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </div>
                    <div id="rex-wpcf7-add-textarea-field" class="l-icon--dark-grey bl_d-iblock">
                        <?php Rexbuilder_Utilities::get_icon('#B029-Input-Text-Area'); ?>
                    </div>
                    <div class="bl_d-iblock modal-field-name">textarea</div>
                </div>
            </div>
            <!-- // Add Menu Field -->
            <div id="rex-add-menu-field" class="bl_modal-row">
                <div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper" >
                    <div class="rexwpcf7-add-content tool-button tool-button--flat tool-button--add-big-grey tippy" data-tippy-content="<?php _e('Select', 'rexpansive-builder'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </div>
                    <div id="rex-wpcf7-add-select-field" class="l-icon--dark-grey bl_d-iblock">
                        <?php Rexbuilder_Utilities::get_icon('#B030-Input-Select'); ?>
                    </div>
                    <div class="bl_d-iblock modal-field-name">select</div>
                </div>
            </div>
            <!-- // Add radiobuttons -->
            <div id="rex-add-radiobuttons-field" class="bl_modal-row">
                <div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper" >
                    <div class="rexwpcf7-add-content tool-button tool-button--flat tool-button--add-big-grey tippy" data-tippy-content="<?php _e('Radio Buttons', 'rexpansive-builder'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </div>
                    <div id="rex-wpcf7-add-radio-field" class="l-icon--dark-grey bl_d-iblock">
                        <?php Rexbuilder_Utilities::get_icon('#B031-Input-Radio'); ?>
                    </div>
                    <div class="bl_d-iblock modal-field-name">radio buttons</div>
                </div>
            </div>
            <!-- // Add Checkbox -->
            <div id="rex-add-checkbox-field" class="bl_modal-row">
                <div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper" >
                    <div class="rexwpcf7-add-content tool-button tool-button--flat tool-button--add-big-grey tippy" data-tippy-content="<?php _e('Checkbox', 'rexpansive-builder'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </div>
                    <div id="rex-wpcf7-add-checkbox-field" class="l-icon--dark-grey bl_d-iblock">
                        <?php Rexbuilder_Utilities::get_icon('#B032-Input-Checkbox'); ?>
                    </div>
                    <div class="bl_d-iblock modal-field-name ">checkbox</div>
                </div>
            </div>
            <!-- // Add File -->
            <div id="rex-add-file-field" class="bl_modal-row">
                <div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper" >
                    <div class="rexwpcf7-add-content tool-button tool-button--flat tool-button--add-big-grey tippy" data-tippy-content="<?php _e('File', 'rexpansive-builder'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </div>
                    <div id="rex-wpcf7-add-file-field" class="l-icon--dark-grey bl_d-iblock">
                        <?php Rexbuilder_Utilities::get_icon('#B033-Input-Upload'); ?>
                    </div>
                    <div class="bl_d-iblock modal-field-name">file</div>
                </div>
            </div>
            <!-- // Add Submit Button -->
            <div id="rex-add-submit-button" class="bl_modal-row">
                <div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper" >
                    <div class="rexwpcf7-add-content tool-button tool-button--flat tool-button--add-big-grey tippy" data-tippy-content="<?php _e('Button', 'rexpansive-builder'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                    </div>
                    <div id="rex-wpcf7-add-submit-field" class="l-icon--dark-grey bl_d-iblock">
                        <?php Rexbuilder_Utilities::get_icon('#B034-Input-Button'); ?>
                    </div>
                    <div class="bl_d-iblock modal-field-name">button</div>
                </div>
            </div>
        </div>
	</div>
</div>
<!-- Add Form Content -->