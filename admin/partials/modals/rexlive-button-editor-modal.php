<?php
/**
 * Modal for RexButton editing
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-button-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
        <!-- Closing button -->
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="Cancel" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <!-- General wrap -->
        <div class="modal-content">
            <?php include 'rexlive-loader-modal.php'; ?>
            <!-- ACCORDION 1 -->
            <div class="rex-accordion close">
                <!-- first row -->
                <div class="bl_modal-row">
                    <div class="rexbutton-cont_row10">
                        <div class="rexbutton-count-colum_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexbutton-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexbutton-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="Text Color" tabindex="0">
                                <input type="hidden" id="rex-button-text-color-runtime" name="rex-button-text-color-runtime" value="" />
                                <input id="rex-button-text-color" type="text" name="rex-button-text-color" value="" size="10" />
                                <div id="rex-button-text-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexbutton-count-column_2CC">
                            <div id="rex-button-label-wrap">
                                <input type="text" id="rex-button__label" name="rex-button__label" class="rexbutton-upd-textbox"/>
                            </div>
                        </div>
                        <div class="rexbutton-count-column_3">
                            <!-- space for icons -->
                        </div>
                        <div class="rexbutton-count-column_4">
                            <div id="rex-button-font-size-wrap">
                                <input type="text" id="rex-button_text_font_size" name="rex-button_text_font_size" placeholder="12" class="rexbutton-upd-textbox tippy" data-tippy-content="<?php _e( 'Font Size', 'rexpansive-builder' ); ?>"/>
                            </div>
                        </div>
                        <div class="rexbutton-count-column_5">
                            <div class="label-px">px</div>
                        </div>
                    </div> 
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <!-- second row -->
                    <div class="bl_modal-row">
                        <!--<div class="label">hover</div>-->
                        <div class="rexbutton-cont_row10">
                            <div class="rexbutton-count-colum_accord"></div>
                            <div class="rexbutton-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="Text Hover Color" tabindex="0">
                                    <input type="hidden" id="rex-button-text-hover-color-runtime" name="rex-button-text-hover-color-runtime" value="" />
                                    <input id="rex-button-text-hover-color" type="text" name="rex-button-text-hover-color" value="" size="10" />
                                    <div id="rex-button-text-hover-color-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexbutton-count-column_2">
                                <div id="rex-button-text-hover-preview-wrap">
                                    <div id="rex-button-preview-text-hover"></div>
                                </div>
                            </div>
                            <div class="rexbutton-count-column_3"><!-- space for icons --></div>
                            <div class="rexbutton-count-column_4"><!-- space for dimensions --></div>
                            <div class="rexbutton-count-column_5"><!-- space for unit measurement --></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ACCORDION 2 -->
            <div class="rex-accordion close">
                <!-- third row -->  
                <div class="bl_modal-row">
                    <div class="rexbutton-cont_row10">
                        <div class="rexbutton-count-colum_accord">
                            <span class="rex-accordion--toggle">                                
                                <div class="rexbutton-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexbutton-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="Background Color" tabindex="0">
                                <input type="hidden" id="rex-button-background-color-runtime" name="rex-button-background-color-runtime" value="" />
                                <input id="rex-button-background-color" type="text" name="rex-button-background-color" value="" size="10" />
                                <div id="rex-button-background-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexbutton-count-column_2">
                            <div id="rex-button-background-preview-wrap">
                                <div id="rex-button-preview-background"></div>
                            </div>
                        </div>
                        <div class="rexbutton-count-column_3">
                            <i class="fas fa-arrows-alt-v"></i>
                        </div>
                        <div class="rexbutton-count-column_4">
                            <!--<input type="text" id="rex-button-height" name="rex-button-height" class="rexbutton-upd-textbox"/>-->
                        </div>
                        <div class="rexbutton-count-column_5">
                            <!--<div class="label-px">h</div>-->
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <!-- fourth row -->
                    <div class="bl_modal-row">
                        <div class="rexbutton-cont_row10">
                            <div class="rexbutton-count-colum_accord">
                                <div class="rexbutton-count-colum_accord"></div>
                            </div>
                            <div class="rexbutton-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="Background Hover Color" tabindex="0">
                                    <input type="hidden" id="rex-button-background-hover-color-runtime" name="rex-button-background-hover-color-runtime" value="" />
                                    <input id="rex-button-background-hover-color" type="text" name="rex-button-background-hover-color" value="" size="10" />
                                    <div id="rex-button-background-hover-color-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexbutton-count-column_2">
                                <div id="rex-button-background-hover-preview-wrap">
                                    <div id="rex-button-preview-background-hover"></div>
                                </div>
                            </div>
                            <div class="rexbutton-count-column_3"><!-- space for icons --></div>
                            <div class="rexbutton-count-column_4"><!-- space for dimensions --></div>
                            <div class="rexbutton-count-column_5"><!-- space for unit measurement --></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ACCORDION 3 -->
            <div class="rex-accordion close">
                <!-- fifth row -->
                <div class="bl_modal-row">
                    <div class="rexbutton-cont_row10">
                        <div class="rexbutton-count-colum_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexbutton-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexbutton-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="Border Color" tabindex="0">
                                <input type="hidden" id="rex-button-border-color-runtime" name="rex-button-border-color-runtime" value="" />
                                <input id="rex-button-border-color" type="text" name="rex-button-border-color" value="" size="10" />
                                <div id="rex-button-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexbutton-count-column_2">
                            <div id="rex-button-border-preview-wrap">
                                <div id="rex-button-border-preview"></div>
                            </div>
                        </div>
                        <div class="rexbutton-count-column_3">
                            <!-- space for icons -->
                        </div>
                        <div class="rexbutton-count-column_4">
                            <div id="rex-button-border-width-wrap">
                                <input type="text" id="rex-button-border-width" name="rex-button-border-width" class="rexbutton-upd-textbox tippy" placeholder="5" data-tippy-content="<?php _e( 'Border Width', 'rexpansive-builder' ); ?>"/>
                            </div>
                        </div>
                        <div class="rexbutton-count-column_5">
                            <div class="label-px">px</div>
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <!-- sixth row -->
                    <div class="bl_modal-row">
                        <!--<div class="label">hover</div>-->
                        <div class="rexbutton-cont_row10">
                            <div class="rexbutton-count-colum_accord">
                                <div class="rexbutton-count-colum_accord"></div>
                            </div>
                            <div class="rexbutton-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="Border Hover Color" tabindex="0">
                                <input type="hidden" id="rex-button-border-hover-color-runtime" name="rex-button-border-hover-color-runtime" value="" />
                                <input id="rex-button-border-hover-color" type="text" name="rex-button-border-hover-color" value="" size="10" />
                                <div id="rex-button-border-hover-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                            </div>
                            <div class="rexbutton-count-column_2">
                                <div id="rex-button-border-hover-preview-wrap">
                                    <div id="rex-button-preview-border-hover"></div>
                                </div>
                            </div>
                            <div class="rexbutton-count-column_3"><!-- space for icons --></div>
                            <div class="rexbutton-count-column_4"><!-- space for dimensions --></div>
                            <div class="rexbutton-count-column_5"><!-- space for unit measurement --></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- seventh row -->
            <div class="bl_modal-row no12dx">
                <div class="rexbutton-cont_row23">
                    <div class="rexbutton-count-column_6">

                    <div class="rex-live__row-margin-padding block-padding-wrap">
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Top', 'rexpansive-builder' ); ?>">
                                <input type="text" id="rex-button-margin-top-radius" name="rex-button-margin-top-radius" class="block-padding-values" placeholder="20"/>
                                <span class="bl_input-indicator">px</span>
                            </div><!-- // row margin top -->
                        </div>
                        <div class="bl_d-flex bl_ai-c bl_jc-sb">
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Left', 'rexpansive-builder' ); ?>">
                                <input type="text" id="rex-button-margin-left-radius" name="rex-button-margin-left-radius" class="block-padding-values" placeholder="20"/>
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- // row margin left -->
                            </div>
                            <div class="rex-live__row-padding-wrap">
                                <div class="bl_d-flex bl_jc-c">
                                    <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Top', 'rexpansive-builder' ); ?>">
                                    <input type="text" id="rex-button-padding-top-radius" name="rex-button-padding-top-radius" class="block-padding-values" placeholder="20"/>
                                        <span class="bl_input-indicator">px</span>
                                    </div><!-- // row padding top -->
                                </div>
                                <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                    <div class="zl_cfd_a">BUTTON</div>
                                        <div>
                                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Left', 'rexpansive-builder' ); ?>">
                                            <input type="text" id="rex-button-padding-left-radius" name="rex-button-padding-left-radius" class="block-padding-values" placeholder="20"/>
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // row padding left -->
                                        </div>
                                        <div class="rex-live__row-gutter-wrap bl_d-flex bl_jc-c bl_ai-c">
                                        </div>
                                        <div>
                                        
                                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Right', 'rexpansive-builder' ); ?>">
                                            <input type="text" id="rex-button-padding-right-radius" name="rex-button-padding-right-radius" class="block-padding-values" placeholder="20"/>
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // row padding right -->
                                        </div>
                                    </div>
                                    <div class="bl_d-flex bl_jc-c">
                                        <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Bottom', 'rexpansive-builder' ); ?>">
                                            <input type="text" id="rex-button-padding-bottom-radius" name="rex-button-padding-bottom-radius" class="block-padding-values" placeholder="20"/>
                                            <span class="bl_input-indicator">px</span>
                                        </div><!-- // row paddig bottom -->
                                    </div>
                                </div>
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Right', 'rexpansive-builder' ); ?>">
                                    <input type="text" id="rex-button-margin-right-radius" name="rex-button-margin-right-radius" class="block-padding-values" placeholder="20"/>
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- //row margin right -->
                            </div>
                        </div>
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Bottom', 'rexpansive-builder' ); ?>">
                                <input type="text" id="rex-button-margin-bottom-radius" name="rex-button-margin-bottom-radius" class="block-padding-values" placeholder="20"/>
                                <span class="bl_input-indicator">px</span>
                            </div><!-- //row margin bottom -->
                        </div>
                    </div><!-- // row padding, gutter, margin new -->
                    </div>
                    <div class="rexbutton-count-column_7 nobord"><!-- BORDER RADIUS -->
                        <div class="rexbutton-count-column_container">
                            <div class="subRow7_1">
                                <?php Rexbuilder_Utilities::get_icon('#D001-Radius'); ?>    
                            </div>
                            <div class="subRow7_2 tippy" data-tippy-content="<?php _e( 'Border Radius', 'rexpansive-builder' ); ?>">
                                <input type="text" id="rex-button-border-radius" name="rex-button-border-radius" placeholder="10" class="rexbutton-upd-textbox"/>
                            </div>  
                            <div class="subRow7_3">PX</div>
                        </div>
                    </div>
                    <div class="rexbutton-count-column_7"><!-- HEIGHT -->
                        <div class="rexbutton-count-column_container">
                            <div class="subRow7_1">
                                <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
                            </div>
                            <div class="subRow7_2 tippy" data-tippy-content="<?php _e( 'Button Height', 'rexpansive-builder' ); ?>">
                                <input type="text" id="rex-button-height" name="rex-button-height" placeholder="70" class="rexbutton-upd-textbox"/>
                            </div>  
                            <div class="subRow7_3">PX</div>
                        </div>
                    </div>
                    <div class="rexbutton-count-column_7"><!-- WIDTH -->
                        <div class="rexbutton-count-column_container">
                            <div class="subRow7_1 rotate">
                                <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
                            </div>
                            <div class="subRow7_2 tippy" data-tippy-content="<?php _e( 'Button Width', 'rexpansive-builder' ); ?>">
                            <input type="text" id="rex-button-width" name="rex-button-width" placeholder="100" class="rexbutton-upd-textbox"/>
                            </div>  
                            <div class="subRow7_3">PX</div>
                        </div>                
                    </div>                    
                    <!--    old code for handling buttons margin
                    <div class="rexbutton-count-column_8">
                        <div class="subRow8_1">
                            <div class="subColum1">
                                <input type="text" id="rex-button-margin-top-radius" name="rex-button-margin-top-radius" class="rexbutton-upd-small_textbox" placeholder="top"/>
                            </div>
                        </div>                      
                        <div class="subRow8_2">
                            <div class="subColum2">
                                <input type="text" id="rex-button-margin-left-radius" name="rex-button-margin-left-radius" class="rexbutton-upd-small_textbox" placeholder="left"/>
                            </div>
                            <div class="subColum3">
                                <div id="rex-button-preview-empty"></div>
                            </div>
                            <div class="subColum2">
                                <input type="text" id="rex-button-margin-right-radius" name="rex-button-margin-right-radius" class="rexbutton-upd-small_textbox" placeholder="right"/>
                            </div>
                        </div>
                        <div class="subRow8_3">
                            <div class="subColum1">
                                <input type="text" id="rex-button-margin-bottom-radius" name="rex-button-margin-bottom-radius" class="rexbutton-upd-small_textbox" placeholder="bottom"/>
                            </div>
                        </div>
                    </div>  -->
                </div>
            </div>
            <!-- eighth row -->
            <div class="bl_modal-row">
                <div class="rexbutton-cont_row45">
                    <div class="rexbutton-count-column_9">
                        <div id="rex-button-link-target-wrap" class="input-field col rex-input-prefixed rex-input-prefixed--no-prefix">
                            <span class="prefix"></span>
                            <input type="text" id="rex-button-link-target" name="rex-button-link-target" class="rexbutton-upd-textbox_resize">
                            <label for="rex-button-link-target" id="rex-button-link-target-label" class="rexbutton-upd-textbox_resize"><?php _e('https://...', 'rexpansive-builder');?></label>
                            <span class="rex-material-bar"></span>
                        </div>
                    </div>
                    <div class="rexbutton-count-column_10">
                        <div id="rex-button-link-type-wrap" class="rx__select-wrap">
                            <select id="rex-button-link-type" class="rx__form-input rexbutton-upd-combobox">
                                <option value="_blank">_blank</option>
                                <option value="_self">_self</option>
                            </select>
                            <!--
                            <div class="rx__form-input__select-arrow">
                                <i class="l-svg-icons"><svg><use xlink:href="#A007-Close"></use></svg></i>
                            </div>
                            -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="rexbutton-cont_row77" style="margin-bottom:12px">
                    <div class="rexbutton-count-column_11">
                        <div id="rex-button-name-wrap" class="input-field col rex-input-prefixed rex-input-prefixed--no-prefix">
                            <span class="prefix"></span>
                            <input type="text" id="rex-button__class" name="rex-button__class" class="rexbutton-upd-actiontextbox">
                            <label for="rex-button__class" id="rex-button__class-label" class=""><?php _e('Custom classes', 'rexpansive-builder');?></label>
                            <span class="rex-material-bar"></span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ninth row -->
            <div class="bl_modal-row">
                <div class="rexbutton-cont_row77">
                    <div class="rexbutton-count-column_11">
                        <div id="rex-button-name-wrap" class="input-field col rex-input-prefixed rex-input-prefixed--no-prefix">
                            <span class="prefix"></span>
                            <input type="text" id="rex-button__name" name="rex-button__name" class="rexbutton-upd-actiontextbox">
                            <label for="rex-button__name" id="rex-button__name-label" class=""><?php _e('Button model name', 'rexpansive-builder');?></label>
                            <span class="rex-material-bar"></span>
                        </div>
                    </div>
                    <div class="rexbutton-count-column_12 add-rex-button-model__wrap">
                        <div id="rex-button-add-model-wrap" class="add-rex-button-model tippy" data-tippy-content="<?php _e('Create new model','rexpansive-builder'); ?>">
                            <div class="add-label">+</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- FOOTER -->
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-apply-button tippy" data-tippy-content="<?php _e('save','rexpansive-builder'); ?>" data-rex-option="save">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
            <div class="tool-button tool-button--inline tool-button--cancel rex-reset-button tippy" data-rex-option="continue" data-tippy-content="<?php _e('reset','rexpansive-builder'); ?>">
                <span class="rex-button continue btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
            </div>
        </div>
    </div>
</div>
<!-- Edit Button -->