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
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2">
                        <span class="">TEXT FIELD</span>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
        		<div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
        			<div class="rexwpcf7-count-column_1">
                        <div id="bg-set-full-section" class="rex-check-icon bl_modal__single-option--vertical tippy" data-tippy-content="<?php _e( 'Full Height', 'rexpansive-builder' ); ?>">
                            <!-- <input type="checkbox" id="section-is-full" name="section-is-full" value="full-height"> -->
                            <input type="checkbox" id="wpcf7-required-field" name="wpcf7-required-field" class="tippy" data-tippy-content="<?php esc_attr_e( 'Required', 'rexpansive-builder' ); ?>" value="required" >
                            <span></span>
                        </div>
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Required field?</span>
                    </div>
        		</div>
            </div>
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1">
                        <input type="checkbox" id="wpcf7-only-numbers" class="tippy" data-tippy-content="<?php esc_attr_e( 'Only numbers', 'rexpansive-builder' ); ?>" value="Only Numbers" >
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Only numbers</span>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <input type="text" id="wpcf7-placeholder">
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <p>Placeholder</p>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap bl_modal__col-4"><!-- 1 -->
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Width', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
                        <input type="text" id="wpcf7-input-width" class="set-width-input" name="" value="0000" placeholder="" size="23">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="">
                        <div class="rex-check-text percentage-width boxed-width-type-wrap" data-rex-section-width-type="%">
                            <input id="wpcf7-input-width-percentage" type="radio" class="wpcf7-input-width-type with-gap" name="wpcf7-input-width-type" value="percentage" checked />
                            <label for="wpcf7-input-width-percentage">
                                <?php _e('%', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-text pixel-width boxed-width-type-wrap" data-rex-section-width-type="px">
                            <input id="wpcf7-input-width-pixel" type="radio" class="wpcf7-input-width-type with-gap" name="wpcf7-input-width-type" value="pixel" />
                            <label for="wpcf7-input-width-pixel">
                                <?php _e('PX', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div> 
                <div class="bl_modal__option-wrap bl_modal__col-4"><!-- 2 -->
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Height', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?></span>
                        <input type="text" id="wpcf7-input-height" class="set-height-input" name="" value="0000" placeholder="" size="23">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="">
                        <div class="" data-rex-section-width-type="%"> <!-- class=rex-check-text percentage-width boxed-width-type-wrap -->
                            <input id="wpcf7-input-height-percentage" type="radio" class="wpcf7-input-height-type with-gap" name="wpcf7-input-height-type" value="percentage" checked />
                            <label for="wpcf7-input-height-percentage">
                                <?php _e('%', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="" data-rex-section-width-type="px">
                            <input id="wpcf7-input-height-pixel" type="radio" class="wpcf7-input-height-type with-gap" name="wpcf7-input-height-type" value="pixel" />
                            <label for="wpcf7-input-height-pixel">
                                <?php _e('PX', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="bl_modal-row">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2"></div>
                    <div class="rexwpcf7-count-column_3"></div>
                    <div class="rexwpcf7-count-column_4"></div>
                    <div class="rexwpcf7-count-column_5"></div>
                </div>
            </div> -->
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Field name</span>
                        <input type="text" class="">
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Default value</span>
                        <input type="text">
                    </div>
                    <!-- <div class="rexwpcf7-count-column_2">
                        <input type="checkbox" class="">
                        <span class="">Placeholder?</span>
                    </div> -->
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="rexelement-count-column_1">
                    <div class="rex-relative-col tippy" data-tippy-content="Text Color" tabindex="0">
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
            <div class="bl_modal-row row-hidden">
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