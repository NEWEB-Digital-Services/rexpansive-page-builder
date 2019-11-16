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
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2">
                        <input type="text" id="rex-wpcf7-mail-to" name="" class="rex-wpcf7-mail-to">
                    </div>
                    <div class="rexwpcf7-count-column_3">Your Mail</div>
                </div>
            </div>
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
            <div class="bl_modal-row">
                <!-- WIDTH & HEIGHT -->
                <div class="bl_modal__option-wrap bl_modal__col-4">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Width', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
                        <input type="text" id="rex-wpcf7-content-width" class="rex-wpcf7-content-width rexwpcf7-set-width-input" name="" size="23">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="">
                        <div class="rex-check-text percentage-width boxed-width-type-wrap" data-rex-section-width-type="%">
                            <input id="rex-wpcf7-content-width-percentage" type="radio" class="rex-wpcf7-content-width-type with-gap" name="rex-wpcf7-content-width-type" value="percentage" checked />
                            <label for="rex-wpcf7-content-width-percentage">
                                <?php _e('%', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-text pixel-width boxed-width-type-wrap" data-rex-section-width-type="px">
                            <input id="rex-wpcf7-content-width-pixel" type="radio" class="rex-wpcf7-content-width-type with-gap" name="rex-wpcf7-content-width-type" value="pixel" />
                            <label for="rex-wpcf7-content-width-pixel">
                                <?php _e('PX', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div> 
                <div class="bl_modal__option-wrap bl_modal__col-4">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Height', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?></span>
                        <input type="text" id="rex-wpcf7-content-height" class="rex-wpcf7-content-height rexwpcf7-set-height-input" name="" size="23">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="">
                        <div class="" data-rex-section-width-type="%"> <!-- class=rex-check-text percentage-width boxed-width-type-wrap -->
                            <input id="rex-wpcf7-content-height-percentage" type="radio" class="rex-wpcf7-content-height-type with-gap" name="rex-wpcf7-content-height-type" value="percentage" checked />
                            <label for="rex-wpcf7-content-height-percentage">
                                <?php _e('%', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="" data-rex-section-width-type="px">
                            <input id="rex-wpcf7-content-height-pixel" type="radio" class="rex-wpcf7-content-height-type with-gap" name="rex-wpcf7-content-height-type" value="pixel" />
                            <label for="rex-wpcf7-content-height-pixel">
                                <?php _e('PX', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close">
                <div class="bl_modal-row">
                    <!-- CONTENT TEXT COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">                                
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Text Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-content-text-color-runtime" name="rex-wpcf7-content-text-color-runtime" value="" />
                                <input id="rex-wpcf7-content-text-color" type="text" name="rex-wpcf7-content-text-color" value="" size="10" />
                                <div id="rex-wpcf7-content-text-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-wpcf7-content-text-preview-wrap">
                                <div id="rex-wpcf7-content-preview-text-color"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                        <div class="rexwpcf7-count-column_4">
                            <input type="text" id="rex-wpcf7-set-content-font-size" name="" class="rex-wpcf7-set-content-font-size">
                        </div>
                        <div class="rexwpcf7-count-column_5">
                            <div class="label-px">px</div>
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- CONTENT TEXT COLOR HOVER -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Text Color Hover', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-content-text-color-hover-runtime" name="rex-wpcf7-content-text-color-hover-runtime" value="" />
                                    <input id="rex-wpcf7-content-text-color-hover" type="text" name="rex-wpcf7-content-text-color-hover" value="" size="10" />
                                    <div id="rex-wpcf7-content-text-color-hover-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-content-text-preview-wrap">
                                    <div id="rex-wpcf7-content-preview-text-color-hover"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_3"><!-- space for icons --></div>
                            <div class="rexwpcf7-count-column_4"><!-- space for dimensions --></div>
                            <div class="rexwpcf7-count-column_5"><!-- space for unit measurement --></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close">
                <div class="bl_modal-row">
                    <!-- CONTENT BACKGROUND COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">                                
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Background Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-content-background-color-runtime" name="rex-wpcf7-content-background-color-runtime" value="" />
                                <input id="rex-wpcf7-content-background-color" type="text" name="rex-wpcf7-content-background-color" value="" size="10" />
                                <div id="rex-wpcf7-content-background-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-wpcf7-content-background-preview-wrap">
                                <div id="rex-wpcf7-content-preview-background-color"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                        <div class="rexwpcf7-count-column_4"></div>
                        <div class="rexwpcf7-count-column_5"></div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- CONTENT BACKGROUND COLOR HOVER -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Background Color Hover', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-content-background-color-hover-runtime" name="rex-wpcf7-content-background-color-hover-runtime" value="" />
                                    <input id="rex-wpcf7-content-background-color-hover" type="text" name="rex-wpcf7-content-background-color-hover" value="" size="10" />
                                    <div id="rex-wpcf7-content-background-color-hover-preview-icon" class="preview-color-hover-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-content-background-preview-wrap">
                                    <div id="rex-wpcf7-content-preview-background-color-hover"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_3"><!-- space for icons --></div>
                            <div class="rexwpcf7-count-column_4"><!-- space for dimensions --></div>
                            <div class="rexwpcf7-count-column_5"><!-- space for unit measurement --></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close">
                <div class="bl_modal-row">
                    <!-- CONTENT BORDER COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">                                
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Border Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-content-border-color-runtime" name="rex-wpcf7-content-border-color-runtime" value="" />
                                <input id="rex-wpcf7-content-border-color" type="text" name="rex-wpcf7-content-border-color" value="" size="10" />
                                <div id="rex-wpcf7-content-border-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-wpcf7-content-border-preview-wrap">
                                <div id="rex-wpcf7-content-preview-border-color"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                        <div class="rexwpcf7-count-column_4">
                            <input type="text" id="rex-wpcf7-set-content-border-width" name="" class="rex-wpcf7-set-content-border-width">
                        </div>
                        <div class="rexwpcf7-count-column_5">
                            <div class="label-px">px</div>
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- CONTENT BORDER COLOR HOVER -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Border Color Hover', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-content-border-color-hover-runtime" name="rex-wpcf7-content-border-color-hover-runtime" value="" />
                                    <input id="rex-wpcf7-content-border-color-hover" type="text" name="rex-wpcf7-content-border-color-hover" value="" size="10" />
                                    <div id="rex-wpcf7-content-border-color-hover-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-content-border-preview-wrap">
                                    <div id="rex-wpcf7-content-preview-border-color-hover"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_3"><!-- space for icons --></div>
                            <div class="rexwpcf7-count-column_4"><!-- space for dimensions --></div>
                            <div class="rexwpcf7-count-column_5"><!-- space for unit measurement --></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="rexwpcf7-count-column_4 tippy" data-tippy-content="<?php _e('Border Radius', 'rexpansive-builder');?>">
                    <input type="text" id="rex-wpcf7-set-content-border-radius" name="" class="rex-wpcf7-set-content-border-radius">
                </div>
                <div class="rexwpcf7-count-column_5">
                    <div class="label-px">px</div>
                </div>
            </div>
            <div class="bl_modal-row">
                <!-- ERROR MESSAGE -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_1">
                        <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Color', 'rexpansive-builder');?>" tabindex="0">
                            <input type="hidden" id="rex-wpcf7-error-message-color-runtime" name="rex-wpcf7-error-message-color-runtime" value="" />
                            <input id="rex-wpcf7-error-message-color" type="text" name="rex-wpcf7-error-message-color" value="" size="10" />
                            <div id="rex-wpcf7-error-message-color-preview-icon" class="rex-wpcf7-error-message-color-preview-icon"></div>
                        </div>
                    </div>
                    <!-- <div class="rexwpcf7-count-column_2">
                        <div id="rex-wpcf7-border-preview-wrap">
                            <div id="rex-wpcf7-preview-border"></div>
                        </div>
                    </div> -->
                    <div class="rexwpcf7-count-column_2">
                        <input type="text" id="rex-wpcf7-error-message" name="" class="rex-wpcf7-error-message" placeholder="Error Message">
                    </div>
                    <!-- ERROR MESSAGE FONT SIZE -->
                    <div class="rexwpcf7-count-column_4">
                        <input type="text" id="rex-wpcf7-set-error-message-font-size" name="" class="rex-wpcf7-set-error-message-font-size">
                    </div>
                    <div class="rexwpcf7-count-column_5">
                        <div class="label-px">px</div>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <!-- SEND MESSAGE -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_1">
                        <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Color', 'rexpansive-builder');?>" tabindex="0">
                            <input type="hidden" id="rex-wpcf7-send-message-color-runtime" name="rex-wpcf7-send-message-color-runtime" value="" />
                            <input id="rex-wpcf7-send-message-color" type="text" name="rex-wpcf7-send-message-color" value="" size="10" />
                            <div id="rex-wpcf7-send-message-color-preview-icon" class="rex-wpcf7-send-message-color-preview-icon"></div>
                        </div>
                    </div>
                    <!-- <div class="rexwpcf7-count-column_2">
                        <div id="rex-wpcf7-border-preview-wrap">
                            <div id="rex-wpcf7-preview-border"></div>
                        </div>
                    </div> -->
                    <div class="rexwpcf7-count-column_2">
                        <input type="text" id="rex-wpcf7-send-message" name="" class="rex-wpcf7-send-message" placeholder="Send Message">
                    </div>
                    <!-- SEND MESSAGE FONT SIZE -->
                    <div class="rexwpcf7-count-column_4">
                        <input type="text" id="rex-wpcf7-set-error-message-font-size" name="" class="rex-wpcf7-set-error-message-font-size">
                    </div>
                    <div class="rexwpcf7-count-column_5">
                        <div class="label-px">px</div>
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