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
        	<?php include 'rexlive-loader-modal.php'; ?>
        	<!-- Add text field -->
            <div class="bl_modal-row">
        		<div class="rexwpcf7-cont_row">
        			<div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-text-field tippy" data-tippy-content="<?php esc_attr_e( 'Text', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Text field -->
                        <input type="text">
                    </div>
        		</div>
            </div>
            <!-- Add textarea field -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-textarea-field tippy" data-tippy-content="<?php esc_attr_e( 'Textarea', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Menu field -->
                        <input type="textarea">
                    </div>
                </div>
            </div>
            <!-- Add menu field -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-menu-field tippy" data-tippy-content="<?php esc_attr_e( 'Menu', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Menu field -->
                        <div class="rx__select-wrap">
                            <select id="rex-wpcf7-select-menu" class="">
                                <option value="option-1">Option 1</option>
                                <option value="option-2">Option 2</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Add radiobuttons -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-radiobuttons-field tippy" data-tippy-content="<?php esc_attr_e( 'Radio buttons', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Radio buttons -->
                        <input type="radio" id="wpfc7-radio-button-1" value="radio-button-1" name="wpcf7-add-radio-button" class="with-gap" checked="checked">
                        <label for="wpfc7-radio-button-1">
                            <?php _e('Radio Button 1', 'rexpansive-builder');?>
                            <span class="rex-ripple"></span>
                        </label>
                        <input type="radio" id="wpfc7-radio-button-2" value="radio-button-2" name="wpcf7-add-radio-button" class="with-gap">
                        <label for="wpfc7-radio-button-2">
                            <?php _e('Radio Button 2', 'rexpansive-builder');?>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
            </div>
            <!-- Add date field -->
            <!-- <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-date-field tippy" data-tippy-content="<?php esc_attr_e( 'Add date', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <input type="date">
                    </div>
                </div>
            </div> -->
            <!-- Add checkbox -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-checkbox-field tippy" data-tippy-content="<?php esc_attr_e( 'Checkbox', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- <div class="tippy" data-tippy-content="<?php _e( 'Only Numbers', 'rexpansive-builder' ); ?>"> -->
                            <label>
                                <input type="checkbox" id="wpcf7-checkbox-example" name="wpcf7-checkbox-example" value="only-numbers">
                                <span></span>
                            </label>
                        <!-- </div> -->
                    </div>
                </div>
            </div>
            <!-- Add acceptance -->
            <!-- <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-acceptance-field tippy" data-tippy-content="<?php esc_attr_e( 'Acceptance', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        Acceptance
                        <input type="checkbox" value="check">
                    </div>
                </div>
            </div> -->
            <!-- Add file -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-file-field tippy" data-tippy-content="<?php esc_attr_e( 'File', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- File field -->
                        <input type="file" name="file-example">
                    </div>
                </div>
            </div>
            <!-- Add submit button -->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-submit-button tippy" data-tippy-content="<?php esc_attr_e( 'Submit button', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Submit button -->
                        <input type="submit">
                    </div>
                </div>
            </div>
        </div>
	</div>
</div>
<!-- Add Form Content -->