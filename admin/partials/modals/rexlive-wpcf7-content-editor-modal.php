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
            <div class="bl_modal-row">
                <!-- REQUIRED FIELD -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1">
                        <div class="tippy" data-tippy-content="<?php _e( 'Required', 'rexpansive-builder' ); ?>">
                            <label>
                                <input type="checkbox" id="wpcf7-required-field" name="wpcf7-required-field" value="required">
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Required field?</span>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <!-- E-Mail Field -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1">
                        <div class="tippy" data-tippy-content="<?php _e( 'E-Mail', 'rexpansive-builder' ); ?>">
                            <label>
                                <input type="checkbox" id="wpcf7-set-email" name="wpcf7-set-email" value="set-email">
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <span class="">E-Mail</span>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <!-- Only Numbers -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1">
                        <div class="tippy" data-tippy-content="<?php _e( 'Only Numbers', 'rexpansive-builder' ); ?>">
                            <label>
                                <input type="checkbox" id="wpcf7-only-numbers" name="wpcf7-only-numbers" value="only-numbers">
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Only numbers</span>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <!-- DEFAULT CHECK -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1">
                        <div class="tippy" data-tippy-content="<?php _e( 'Default Check', 'rexpansive-builder' ); ?>">
                            <label>
                                <input type="checkbox" id="wpcf7-default-check" name="wpcf7-default-check" value="default-check">
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <span class="">Default check</span>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row"> <!-- // Placeholder -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_2 input-field">
                        <input type="text" id="wpcf7-placeholder" name="wpcf7-placeholder">
                        <label for="wpcf7-placeholder">
                            <?php _e('Placeholder', 'rexpansive-builder');?>
                        </label>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <!-- WIDTH & HEIGHT -->
                <div class="bl_modal__option-wrap bl_modal__col-4">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Width', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
                        <input type="text" id="wpcf7-input-width" class="rexwpcf7-set-width-input" name="" size="23">
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
                <div class="bl_modal__option-wrap bl_modal__col-4">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Height', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?></span>
                        <input type="text" id="wpcf7-input-height" class="rexwpcf7-set-height-input" name="" size="23">
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
            <div class="bl_modal-row">
                <!-- FONT SIZE -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_4">
                        <input type="text" id="wpcf7-set-font-size" name="" class="rexwpcf7-set-font-size">
                    </div>
                    <div class="rexwpcf7-count-column_5">
                        <div class="label-px">px</div>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close">
                <div class="bl_modal-row">
                    <!-- TEXT COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Text Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-background-color-runtime" name="rex-wpcf7-background-color-runtime" value="" />
                                <input id="rex-wpcf7-background-color" type="text" name="rex-wpcf7-background-color" value="" size="10" />
                                <div id="rex-wpcf7-background-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-wpcf7-background-preview-wrap">
                                <div id="rex-wpcf7-preview-background"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                    <!-- <div class="rexwpcf7-count-column_4">
                        <input type="text" id="wpcf7-set-font-size" name="" class="rexwpcf7-set-font-size">
                    </div>
                    <div class="rexwpcf7-count-column_5">
                        <div class="label-px">px</div> -->
                    </div> 
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- TEXT FOCUS COLOR -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Focus Color', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-focus-color-runtime" name="rex-wpcf7-focus-color-runtime" value="" />
                                    <input id="rex-wpcf7-focus-color" type="text" name="rex-wpcf7-focus-color" value="" size="10" />
                                    <div id="rex-wpcf7-focus-color-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-focus-preview-wrap">
                                    <div id="rex-wpcf7-preview-focus"></div>
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
                    <!-- SELECT TEXT COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Text Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-select-text-color-runtime" name="rex-wpcf7-select-text-color-runtime" value="" />
                                <input id="rex-wpcf7-select-text-color" type="text" name="rex-wpcf7-select-text-color" value="" size="10" />
                                <div id="rex-wpcf7-select-text-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-wpcf7-select-text-preview-wrap">
                                <div id="rex-wpcf7-preview-select-text"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- SELECT TEXT COLOR AFTER FIRST SELECTION -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Text Color After Selection', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-select-text-color-after-selection-runtime" name="rex-wpcf7-select-text-color-after-selection-runtime" value="" />
                                    <input id="rex-wpcf7-select-text-color-after-selection" type="text" name="rex-wpcf7-select-text-color-after-selection" value="" size="10" />
                                    <div id="rex-wpcf7-select-text-color-after-selection-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-select-text-after-selection-preview-wrap">
                                    <div id="rex-wpcf7-preview-select-text-after-selection"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close">
                <div class="bl_modal-row">
                    <!-- PLACEHOLDER COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Placeholder Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-placeholder-color-runtime" name="rex-wpcf7-placeholder-color-runtime" value="" />
                                <input id="rex-wpcf7-placeholder-color" type="text" name="rex-wpcf7-placeholder-color" value="" size="10" />
                                <div id="rex-wpcf7-placeholder-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-wpcf7-placeholder-preview-wrap">
                                <div id="rex-wpcf7-preview-placeholder"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                        <div class="rexwpcf7-count-column_4"></div>
                        <div class="rexwpcf7-count-column_5"></div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- PLACEHOLDER HOVER COLOR -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Placeholder Hover Color', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-placeholder-hover-color-runtime" name="rex-wpcf7-placeholder-hover-color-runtime" value="" />
                                    <input id="rex-wpcf7-placeholder-hover-color" type="text" name="rex-wpcf7-placeholder-hover-color" value="" size="10" />
                                    <div id="rex-wpcf7-placeholder-hover-color-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-placeholder-hover-preview-wrap">
                                    <div id="rex-wpcf7-preview-placeholder-hover"></div>
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
                <!-- TEXT EDITOR -->
                <div id="wpcf7-text-editor" class="modal-editor-editorarea">
                    <?php wp_editor(
                        '',
                        'wpcf7_text_editor',
                        array('textarea_rows' => 10,
                            'wpautop' => false,
                            'editor_height' => 100,
                            'media_buttons' => false,
                            'teeny' => false,
                            'tinymce' => array(
                            // 'toolbar1' => 'bold',    // Toolbar fields
                                'block_formats' => 'Paragraph=p;'
                            ),
                        )
                    );?>
                </div>
            </div>
            <div class="bl_modal-row">
                <!-- FILE MAX DIMENSIONS -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1">Max file size</div>
                    <div class="rexwpcf7-count-column_4">
                        <input type="text" name="wpcf7-file-max-dimensions" id="wpcf7-file-max-dimensions">
                    </div>
                    <div class="rexwpcf7-count-column_2">
                        <select name="wpcf7-file-max-dimensions-unit" id="wpcf7-file-max-dimensions-unit">
                            <option value="kb">KB</option>
                            <option value="mb">MB</option>
                            <option value="gb">GB</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row wpcf7-list-fields ui-sortable">
                <!-- LIST -->
            </div>
            <div class="bl_modal-row">
                <!-- ADD FIELD IN LIST -->
                <div class="rexwpcf7-cont_row">
                    <div class="rexwpcf7-count-column_accord"></div>
                    <div class="rexwpcf7-count-column_1"></div>
                    <div class="rexwpcf7-count-column_2"></div>
                    <div class="rexwpcf7-count-column_3">
                        <button id="rex-wpcf7-add-list-field" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tippy" data-position="bottom" data-tippy-content="<?php _e('Add field', 'rexpansive-builder')?>">
                            <i class="material-icons text-white">&#xE145;</i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close">
                <div class="bl_modal-row">
                    <!-- BUTTON TEXT COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Button Text Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-button-text-color-runtime" name="rex-wpcf7-button-text-color-runtime" value="" />
                                <input id="rex-wpcf7-button-text-color" type="text" name="rex-wpcf7-button-text-color" value="" size="10" />
                                <div id="rex-wpcf7-button-text-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-button-label-wrap">
                                <input type="text" id="rex-wpcf7-button-text-label" name="rex-wpcf7-button-text-label" class="rexbutton-upd-textbox">
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                        <div class="rexwpcf7-count-column_4">
                            <input type="text" id="wpcf7-button-text-font-size" name="" class="rexwpcf7-button-text-font-size">
                        </div>
                        <div class="rexwpcf7-count-column_5">
                            <div class="label-px">px</div>
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- BUTTON TEXT COLOR HOVER -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Button Text Hover Color', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-button-text-color-hover-runtime" name="rex-wpcf7-button-text-color-hover-runtime" value="" />
                                    <input id="rex-wpcf7-button-text-color-hover" type="text" name="rex-wpcf7-button-text-color-hover" value="" size="10" />
                                    <div id="rex-wpcf7-button-text-color-hover-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-button-text-color-preview-wrap">
                                    <div id="rex-wpcf7-preview-button-text-color-hover"></div>
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
                    <!-- BUTTON BACKGROUND COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Button Background Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-button-background-color-runtime" name="rex-wpcf7-button-background-color-runtime" value="" />
                                <input id="rex-wpcf7-button-background-color" type="text" name="rex-wpcf7-button-background-color" value="" size="10" />
                                <div id="rex-wpcf7-button-background-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-wpcf7-button-background-preview-wrap">
                                <div id="rex-wpcf7-preview-button-background-color"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                        <div class="rexwpcf7-count-column_4"></div>
                        <div class="rexwpcf7-count-column_5"></div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- BUTTON BACKGROUND COLOR HOVER -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Button Background Hover Color', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-button-background-color-hover-runtime" name="rex-wpcf7-button-background-color-hover-runtime" value="" />
                                    <input id="rex-wpcf7-button-background-color-hover" type="text" name="rex-wpcf7-button-background-color-hover" value="" size="10" />
                                    <div id="rex-wpcf7-button-background-color-hover-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-button-background-color-hover-preview-wrap">
                                    <div id="rex-wpcf7-preview-button-background-color-hover"></div>
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
                    <!-- BUTTON BORDER COLOR -->
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Button Border Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-button-border-color-runtime" name="rex-wpcf7-button-border-color-runtime" value="" />
                                <input id="rex-wpcf7-button-border-color" type="text" name="rex-wpcf7-button-border-color" value="" size="10" />
                                <div id="rex-wpcf7-button-border-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_2">
                            <div id="rex-wpcf7-button-border-color-preview-wrap">
                                <div id="rex-wpcf7-preview-button-border-color"></div>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                        <div class="rexwpcf7-count-column_4">
                            <div id="rex-button-border-width-wrap">
                                <input type="text" id="wpcf7-button-border-width" name="wpcf7-button-border-width" class="rexbutton-upd-textbox tippy" placeholder="5" data-tippy-content="<?php _e( 'Button Border Width', 'rexpansive-builder' ); ?>"/>
                            </div>
                        </div>
                        <div class="rexwpcf7-count-column_5">
                            <div class="label-px">px</div>
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <div class="bl_modal-row">
                        <!-- BUTTON BORDER COLOR HOVER -->
                        <div class="rexwpcf7-cont_row">
                            <div class="rexwpcf7-count-column_accord"></div>
                            <div class="rexwpcf7-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Button Border Hover Color', 'rexpansive-builder');?>" tabindex="0">
                                    <input type="hidden" id="rex-wpcf7-focus-color-runtime" name="rex-wpcf7-button-border-color-hover-runtime" value="" />
                                    <input id="rex-wpcf7-button-border-color-hover" type="text" name="rex-wpcf7-button-border-color-hover" value="" size="10" />
                                    <div id="rex-wpcf7-button-border-color-hover-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_2">
                                <div id="rex-wpcf7-button-border-color-hover-preview-wrap">
                                    <div id="rex-wpcf7-preview-button-border-color-hover"></div>
                                </div>
                            </div>
                            <div class="rexwpcf7-count-column_3"><!-- space for icons --></div>
                            <div class="rexwpcf7-count-column_4"><!-- space for dimensions --></div>
                            <div class="rexwpcf7-count-column_5"><!-- space for unit measurement --></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row no12dx">
                <!-- BUTTON -->
                <div class="rexbutton-cont_row23">
                    <div class="rexbutton-count-column_6">
                        <div class="rex-live__row-margin-padding block-padding-wrap">
                            <div class="bl_d-flex bl_jc-c">
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Top', 'rexpansive-builder' ); ?>">
                                    <input type="text" id="wpcf7-button-margin-top" name="wpcf7-button-margin-top" class="block-padding-values" placeholder="20"/>
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- // row margin top -->
                            </div>
                            <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                <div>
                                    <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Left', 'rexpansive-builder' ); ?>">
                                        <input type="text" id="wpcf7-button-margin-left" name="wpcf7-button-margin-left" class="block-padding-values" placeholder="20"/>
                                        <span class="bl_input-indicator">px</span>
                                    </div><!-- // row margin left -->
                                </div>
                                <div class="rex-live__row-padding-wrap">
                                    <div class="bl_d-flex bl_jc-c">
                                        <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Top', 'rexpansive-builder' ); ?>">
                                            <input type="text" id="wpcf7-button-padding-top" name="wpcf7-button-padding-top" class="block-padding-values" placeholder="20"/>
                                            <span class="bl_input-indicator">px</span>
                                        </div><!-- // row padding top -->
                                    </div>
                                    <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                        <div class="zl_cfd_a">BUTTON</div>
                                        <div>
                                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Left', 'rexpansive-builder' ); ?>">
                                                <input type="text" id="wpcf7-button-padding-left" name="wpcf7-button-padding-left" class="block-padding-values" placeholder="20"/>
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // row padding left -->
                                        </div>
                                        <div class="rex-live__row-gutter-wrap bl_d-flex bl_jc-c bl_ai-c"></div>
                                        <div>
                                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Right', 'rexpansive-builder' ); ?>">
                                                <input type="text" id="wpcf7-button-padding-right" name="wpcf7-button-padding-right" class="block-padding-values" placeholder="20"/>
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // row padding right -->
                                        </div>
                                    </div>
                                    <div class="bl_d-flex bl_jc-c">
                                        <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Bottom', 'rexpansive-builder' ); ?>">
                                            <input type="text" id="wpcf7-button-padding-bottom" name="wpcf7-button-padding-bottom" class="block-padding-values" placeholder="20"/>
                                            <span class="bl_input-indicator">px</span>
                                        </div><!-- // row paddig bottom -->
                                    </div>
                                </div>
                                <div>
                                    <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Right', 'rexpansive-builder' ); ?>">
                                        <input type="text" id="wpcf7-button-margin-right" name="wpcf7-button-margin-right" class="block-padding-values" placeholder="20"/>
                                        <span class="bl_input-indicator">px</span>
                                    </div><!-- //row margin right -->
                                </div>
                            </div>
                            <div class="bl_d-flex bl_jc-c">
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Bottom', 'rexpansive-builder' ); ?>">
                                    <input type="text" id="wpcf7-button-margin-bottom" name="wpcf7-button-margin-bottom" class="block-padding-values" placeholder="20"/>
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
                                <input type="text" id="wpcf7-button-border-radius" name="wpcf7-button-border-radius" placeholder="10" class="rexbutton-upd-textbox"/>
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
                                <input type="text" id="wpcf7-button-height" name="wpcf7-button-height" placeholder="70" class="rexbutton-upd-textbox"/>
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
                                <input type="text" id="wpcf7-button-width" name="wpcf7-button-width" placeholder="100" class="rexbutton-upd-textbox"/>
                            </div>
                            <div class="subRow7_3">PX</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer -->
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-apply-button tippy" data-tippy-content="<?php _e('Save','rexpansive-builder'); ?>" data-rex-option="save">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
            <div class="tool-button tool-button--inline tool-button--cancel rex-reset-button tippy" data-rex-option="continue" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
                <span class="rex-button continue btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
            </div>
        </div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
                <!-- Wpcf7 Field Editor -->