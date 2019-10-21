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
                        <input type="checkbox" id="required_field" class="tippy" data-tippy-content="<?php esc_attr_e( 'Required', 'rexpansive-builder' ); ?>">
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
                        <div>
                          <input type="radio" id="password" name="pw_or_number" value="password"
                                 checked>
                        </div>
                        <div>
                          <input type="radio" id="number" name="pw_or_number" value="number">
                        </div>
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <label for="password">Password</label>
                        <label for="number">Only number</label>
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
                <div class="bl_modal__option-wrap bl_modal__col-4">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Boxed Width', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
                        <input type="text" id="" class="section-set-boxed-width" name="section-set-boxed-width" value="0000" placeholder="" size="23">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="section-set-boxed-width-wrap">
                        <div class="rex-check-text percentage-width boxed-width-type-wrap" data-rex-section-width-type="%">
                            <input id="block-width-percentage" type="radio" class="section-width-type with-gap" name="section-width-type" value="percentage" checked />
                            <label for="block-width-percentage">
                                <?php _e('%', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-text pixel-width boxed-width-type-wrap" data-rex-section-width-type="px">
                            <input id="block-width-pixel" type="radio" class="section-width-type with-gap" name="section-width-type" value="pixel" />
                            <label for="block-width-pixel">
                                <?php _e('PX', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div> <!-- 1 -->
                <div class="bl_modal__option-wrap bl_modal__col-4">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Boxed Width', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
                        <input type="text" id="" class="section-set-boxed-width" name="section-set-boxed-width" value="0000" placeholder="" size="23">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="section-set-boxed-width-wrap">
                        <div class="rex-check-text percentage-width boxed-width-type-wrap" data-rex-section-width-type="%">
                            <input id="block-width-percentage" type="radio" class="section-width-type with-gap" name="section-width-type" value="percentage" checked />
                            <label for="block-width-percentage">
                                <?php _e('%', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-text pixel-width boxed-width-type-wrap" data-rex-section-width-type="px">
                            <input id="block-width-pixel" type="radio" class="section-width-type with-gap" name="section-width-type" value="pixel" />
                            <label for="block-width-pixel">
                                <?php _e('PX', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div><!-- 2 -->
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
                        <input type="text" id="wpcf7-default-value">
                    </div>
                    <!-- <div class="rexwpcf7-count-column_2">
                        <input type="checkbox" class="">
                        <span class="">Placeholder?</span>
                    </div> -->
                </div>
            </div>
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