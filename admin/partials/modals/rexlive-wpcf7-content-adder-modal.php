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
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php esc_attr_e( 'Cancel', 'rexpansive-builder' ); ?>" value="" tabindex="0">
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
                            <div class="rexwpcf7-upd-add_button rex-add-text-field tippy" data-tippy-content="<?php esc_attr_e( 'Add text', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Text field -->
                        <input type="text">
                    </div>
        		</div>
            </div>
            <!-- Add menu field (to finish)-->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-menu-field tippy" data-tippy-content="<?php esc_attr_e( 'Add menu', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Menu field -->
                        <select>
                            <option value="First">First</option>
                            <option value="Second">Second</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- Add checkboxes (to finish)-->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-checkboxes-field tippy" data-tippy-content="<?php esc_attr_e( 'Add checkboxes', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Checkboxes -->
                        <input type="checkbox" value="Checkbox 1">
                        <input type="checkbox" value="Checkbox 2">
                    </div>
                </div>
            </div>
            <!-- Add radiobuttons (to finish)-->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-radiobuttons-field tippy" data-tippy-content="<?php esc_attr_e( 'Add radio buttons', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- Radio buttons -->
                        <input type="radio" value="Radio Button 1" checked="checked">
                        <input type="radio" value="Radio Button 2" checked="checked">
                    </div>
                </div>
            </div>
            <!-- Add file field (to finish)-->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-file-field tippy" data-tippy-content="<?php esc_attr_e( 'Add file', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                        </span>
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <!-- File field -->
                        <input type="file">
                    </div>
                </div>
            </div>
            <!-- Add submit button (to finish)-->
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexwpcf7-upd-add_button rex-add-submit-button tippy" data-tippy-content="<?php esc_attr_e( 'Add submit button', 'rexpansive-builder' ); ?>"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
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