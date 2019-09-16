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
	<div id="rex-wpcf7-content-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
		<!-- Closing button -->
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <!-- General wrap -->
        <div class="modal-content">
        	<?php include 'rexlive-loader-modal.php'; ?>
            <!-- Common options -->
            <div class="bl_modal-row">
                <div class="rexelement-count-column_1">
                    <div class="rex-relative-col tippy" data-tippy-content="Background Color" tabindex="0">
                        <input type="hidden" id="rex-element-background-color-runtime" name="rex-element-background-color-runtime" value="" />
                        <input id="rex-element-background-color" type="text" name="rex-element-background-color" value="" size="10" />
                        <div id="rex-element-background-color-preview-icon" class="preview-color-icon"></div>
                    </div>
                </div>
                <div class="rexelement-count-column_2">
                    <div id="rex-element-background-preview-wrap">
                        <div id="rex-element-preview-background"></div>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
        		<div class="rexwpcf7-cont_row row-hidden">
        			<div class="rexwpcf7-count-colum_accord">
                        <input type="checkbox" id="required_field" class="tippy" data-tippy-content="<?php esc_attr_e( 'Required', 'rexpansive-builder' ); ?>">
                    </div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Required field?</span>
                    </div>
        		</div>
            </div>
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Field name</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Default value</span>
                        <input type="text" class="">
                    </div>
                    <!-- <div class="rexwpcf7-count-column_2">
                        <input type="checkbox" class="">
                        <span class="">Placeholder?</span>
                    </div> -->
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Class names</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Id names</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <!-- Text fields options -->
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Min length</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Max length</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Size</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Cols x rows</span>
                        <input type="text" class="">
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <!-- Number fields options -->
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Min</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Max</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Step</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <!-- Date fields options -->
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Min</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Max</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>

        </div>
        <!-- Footer -->
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-apply-button tippy" data-tippy-content="<?php _e('Save','rexpansive-builder'); ?>" data-rex-option="save">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
            <!-- <div class="tool-button tool-button--inline tool-button--cancel rex-reset-button tippy" data-rex-option="continue" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
                <span class="rex-button continue btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
            </div> -->
        </div>
	</div>
</div>