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
	<div id="rex-wpcf7-form-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
		<!-- Closing button -->
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <!-- General wrap -->
        <div class="modal-content">
        	<?php include 'rexlive-loader-modal.php'; ?>
            <div class="bl_modal-row">
                <!-- BACKGROUND COLOR -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_1">
                        <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Background Color', 'rexpansive-builder');?>" tabindex="0">
                            <input type="hidden" id="rex-wpcf7-background-color-runtime" name="rex-wpcf7-background-color-runtime" value="" />
                            <input id="rex-wpcf7-background-color" type="text" name="rex-wpcf7-background-color" value="" size="10" />
                            <div id="rex-wpcf7-background-color-preview-icon" class="rex-wpcf7-background-color-preview-icon"></div>
                        </div>
                    </div>
                    <!-- <div class="rexwpcf7-count-column_2">
                        <div id="rex-wpcf7-background-preview-wrap">
                            <div id="rex-wpcf7-preview-background"></div>
                        </div>
                    </div> -->
                    <div class="rexwpcf7-count-column_2">Form Background Color</div>
                </div>
            </div>
            <div class="bl_modal-row">
                <!-- BORDER COLOR -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_1">
                        <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Border Color', 'rexpansive-builder');?>" tabindex="0">
                            <input type="hidden" id="rex-wpcf7-border-color-runtime" name="rex-wpcf7-border-color-runtime" value="" />
                            <input id="rex-wpcf7-border-color" type="text" name="rex-wpcf7-border-color" value="" size="10" />
                            <div id="rex-wpcf7-border-color-preview-icon" class="rex-wpcf7-border-color-preview-icon"></div>
                        </div>
                    </div>
                    <!-- <div class="rexwpcf7-count-column_2">
                        <div id="rex-wpcf7-border-preview-wrap">
                            <div id="rex-wpcf7-preview-border"></div>
                        </div>
                    </div> -->
                    <div class="rexwpcf7-count-column_2">Form Border Color</div>
                    <!-- BORDER WIDTH -->
                    <div class="rexwpcf7-count-column_4">
                        <input type="text" id="rex-wpcf7-set-border-width" name="" class="rex-wpcf7-set-border-width">
                    </div>
                    <div class="rexwpcf7-count-column_5">
                        <div class="label-px">px</div>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row no12dx">
                <!-- FORM MARGINS -->
                <div class="rexbutton-cont_row23">
                    <div class="rexbutton-count-column_6">
                    <div class="rex-live__row-margin-padding block-padding-wrap">
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Top', 'rexpansive-builder' ); ?>">
                                <input type="text" id="rex-wpcf7-margin-top" name="rex-wpcf7-margin-top" class="block-padding-values"/>
                                <span class="bl_input-indicator">px</span>
                            </div><!-- // form margin top -->
                        </div>
                        <div class="bl_d-flex bl_ai-c bl_jc-sb">
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Left', 'rexpansive-builder' ); ?>">
                                <input type="text" id="rex-wpcf7-margin-left" name="rex-wpcf7-margin-left" class="block-padding-values"/>
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- // row margin left -->
                            </div>
                            <div class="rex-live__row-padding-wrap">
                                <div class="bl_d-flex bl_jc-c">
                                </div>
                                <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                    <div class="zl_cfd_a">FORM</div>
                                        <div class="rex-live__row-gutter-wrap bl_d-flex bl_jc-c bl_ai-c">
                                        </div>
                                    </div>
                                    <div class="bl_d-flex bl_jc-c">
                                    </div>
                                </div>
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Right', 'rexpansive-builder' ); ?>">
                                    <input type="text" id="rex-wpcf7-margin-right" name="rex-wpcf7-margin-right" class="block-padding-values"/>
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- //form margin right -->
                            </div>
                        </div>
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Bottom', 'rexpansive-builder' ); ?>">
                                <input type="text" id="rex-wpcf7-margin-bottom" name="rex-wpcf7-margin-bottom" class="block-padding-values"/>
                                <span class="bl_input-indicator">px</span>
                            </div><!-- //form margin bottom -->
                        </div>
                    </div><!-- // form margin new -->
                    </div>
                </div>
            </div>
            <div class="bl_modal-row no12dx">
                <!-- COLUMN PADDING -->
                <div class="rexbutton-cont_row23">
                    <div class="rexbutton-count-column_6">
                    <div class="rex-live__row-margin-padding block-padding-wrap">
                        <div class="bl_d-flex bl_jc-c">
                        </div>
                        <div class="bl_d-flex bl_ai-c bl_jc-sb">
                            <div>
                            </div>
                            <div class="rex-live__row-padding-wrap">
                                <div class="bl_d-flex bl_jc-c">
                                    <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Top', 'rexpansive-builder' ); ?>">
                                    <input type="text" id="rex-wpcf7-columns-padding-top" name="rex-wpcf7-columns-padding-top" class="block-padding-values"/>
                                        <span class="bl_input-indicator">px</span>
                                    </div><!-- // column padding top -->
                                </div>
                                <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                    <div class="zl_cfd_a">COLUMN</div>
                                        <div>
                                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Left', 'rexpansive-builder' ); ?>">
                                            <input type="text" id="rex-wpcf7-columns-padding-left" name="rex-wpcf7-columns-padding-left" class="block-padding-values"/>
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // column padding left -->
                                        </div>
                                        <div class="rex-live__row-gutter-wrap bl_d-flex bl_jc-c bl_ai-c">
                                        </div>
                                        <div>
                                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Right', 'rexpansive-builder' ); ?>">
                                            <input type="text" id="rex-wpcf7-columns-padding-right" name="rex-wpcf7-columns-padding-right" class="block-padding-values"/>
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // column padding right -->
                                        </div>
                                    </div>
                                    <div class="bl_d-flex bl_jc-c">
                                        <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Bottom', 'rexpansive-builder' ); ?>">
                                            <input type="text" id="rex-wpcf7-columns-padding-bottom" name="rex-wpcf7-columns-padding-bottom" class="block-padding-values"/>
                                            <span class="bl_input-indicator">px</span>
                                        </div><!-- // column paddig bottom -->
                                    </div>
                                </div>
                            <div>
                            </div>
                        </div>
                        <div class="bl_d-flex bl_jc-c">
                        </div>
                    </div><!-- // column padding -->
                    </div>
                </div>
            </div>
            <div class="bl_modal-row row-hidden">
                <div class="rexwpcf7-count-column_1">
                    <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Inputs Color', 'rexpansive-builder');?>" tabindex="0">
                        <input type="hidden" id="rex-wpcf7-inputs-background-color-runtime" name="rex-wpcf7-inputs-background-color-runtime" value="" />
                        <input id="rex-wpcf7-inputs-background-color" type="text" name="rex-wpcf7-inputs-background-color" value="" size="10" />
                        <div id="rex-wpcf7-inputs-background-color-preview-icon" class="rex-wpcf7-inputs-background-color-preview-icon"></div>
                    </div>
                </div>
                <div class="rexwpcf7-count-column_2">
                    <div id="rex-wpcf7-inputs-background-preview-wrap">
                        <div id="rex-wpcf7-preview-inputs-background"></div>
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