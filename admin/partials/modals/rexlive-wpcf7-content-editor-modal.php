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
        <div class="modal-content"> <!-- // Required Field, E-Mail Field, Only Numbers  -->
            <?php include 'rexlive-loader-modal.php'; ?>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap bl_jc-c ptb24">
                    <div id="" class="bl_modal__single-option valign-wrapper tippy" data-tippy-content="<?php _e('Required Field', 'rexpansive-builder');?>">
                        <label>
                            <input type="checkbox" id="wpcf7-required-field" name="wpcf7-required-field" value="required">
                            <span id="rex-wpcf7-required-icon">
                                <?php Rexbuilder_Utilities::get_icon('#B036-Input-Obligatory'); ?>
                            </span>
                        </label>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_jc-c ptb24">
                    <div id="" class="bl_modal__single-option valign-wrapper tippy" data-tippy-content="<?php _e('Email Field', 'rexpansive-builder');?>">
                        <label>
                            <input type="checkbox" id="wpcf7-set-email" name="wpcf7-set-email" value="set-email">
                            <span id="rex-wpcf7-email-icon">
                                <?php Rexbuilder_Utilities::get_icon('#B018-Mail'); ?>
                            </span>
                        </label>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_jc-c ptb24">
                    <div id="" class="bl_modal__single-option valign-wrapper tippy" data-tippy-content="<?php _e('Numbers Field', 'rexpansive-builder');?>">
                        <label>
                            <input type="checkbox" id="wpcf7-only-numbers" name="wpcf7-only-numbers" value="only-numbers">
                            <span id="rex-wpcf7-numbers-icon">
                                <?php Rexbuilder_Utilities::get_icon('#B035-Input-Number'); ?>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row"> <!-- // Default Check -->
                <div class="rexwpcf7-cont_row">
                    <label>
                        <input type="checkbox" id="wpcf7-default-check" name="wpcf7-default-check" value="default-check">
                        <span></span>
                    </label>
                    <div id="rex-wpcf7-numbers-icon" class="l-icon--dark-grey">
                        <?php Rexbuilder_Utilities::get_icon('#B032-Input-Checkbox'); ?>
                    </div>
                    <!-- <div class="rexwpcf7-count-column_1">
                        <div class="tippy" data-tippy-content="<?php _e( 'Default Check', 'rexpansive-builder' ); ?>">
                            <label>
                                <input type="checkbox" id="wpcf7-default-check" name="wpcf7-default-check" value="default-check">
                                <span></span>
                            </label>
                        </div>
                    </div> -->
                    <!-- <div class="rexwpcf7-count-column_2">
                        <span class="">Default check</span>
                    </div> -->
                </div>
            </div>
            <div class="bl_modal-row"> <!-- // Placeholder -->
                <div class="rexwpcf7-cont_row">
                    <div class="input-field rex-input-prefixed pl4">
                        <span class="prefix prova-icon">
                            <?php Rexbuilder_Utilities::get_icon('#B038-Input-Text-Placeholder'); ?>
                        </span>
                        <input type="text" id="wpcf7-placeholder" name="wpcf7-placeholder">
                        <label id="wpcf7-placeholder-label" for="wpcf7-placeholder">
                            <?php _e('Placeholder', 'rexpansive-builder');?>
                        </label>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row"> <!-- // Width & Height -->
                <div class="bl_modal__option-wrap bl_jc-c rex-wpcf7-modal-row-tall tippy" data-tippy-content="<?php _e('Width', 'rexpansive-builder');?>">
                    <div class="rex-input-prefixed input-field w67 with-text">
                        <span class="prefix">
                            <?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?>
                        </span>
                        <input type="text" id="wpcf7-input-width" class="rexwpcf7-set-width-input" name="">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="ml12">
                        <div class="rex-check-text percentage-width boxed-width-type-wrap">
                            <input id="wpcf7-input-width-percentage" type="radio" class="wpcf7-input-width-type with-gap" name="wpcf7-input-width-type" value="percentage" checked />
                            <label for="wpcf7-input-width-percentage">
                                <?php _e('%', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-text pixel-width boxed-width-type-wrap">
                            <input id="wpcf7-input-width-pixel" type="radio" class="wpcf7-input-width-type with-gap" name="wpcf7-input-width-type" value="pixel" />
                            <label for="wpcf7-input-width-pixel">
                                <?php _e('PX', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_jc-c rex-wpcf7-modal-row-tall tippy" data-tippy-content="<?php _e('Height', 'rexpansive-builder');?>">
                    <div class="rex-input-prefixed input-field w67 with-text">
                        <span class="prefix">
                            <?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>  
                        </span>
                        <input type="text" id="wpcf7-input-height" class="rexwpcf7-set-height-input" name="">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="ml12">
                        <div>
                            <input id="wpcf7-input-height-percentage" type="radio" class="wpcf7-input-height-type with-gap" name="wpcf7-input-height-type" value="percentage" checked />
                            <label for="wpcf7-input-height-percentage">
                                <?php _e('%', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="wpcf7-input-height-pixel" type="radio" class="wpcf7-input-height-type with-gap" name="wpcf7-input-height-type" value="pixel" />
                            <label for="wpcf7-input-height-pixel">
                                <?php _e('PX', 'rexpansive-builder');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div id="rex-wpcf7-font-size-row" class="bl_modal-row row-hidden"> <!-- // Font Size -->
                <div class="rexwpcf7-cont_row font-size-row">
                    <!-- <div class="rexwpcf7-count-column_4 tippy" data-tippy-content="<?php _e('Font Size', 'rexpansive-builder');?>">
                        <input type="text" id="wpcf7-set-font-size" name="" class="rexwpcf7-set-font-size">
                    </div>
                    <div class="rexwpcf7-count-column_5">
                        <div class="label-px">px</div>
                    </div> -->
                    <div id="rex-wpcf7-font-size-field" class="bl_d-iblock with-text ml24 tippy" data-tippy-content="<?php _e('Font Size', 'rexpansive-builder');?>">
                        <input type="text" id="wpcf7-set-font-size" name="" class="rexwpcf7-set-font-size">
                        <div class="bl_d-iblock label-px">px</div>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close"> <!-- // Text -->
                <!-- <div class="bl_modal-row">
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
                     <div class="rexwpcf7-count-column_4">
                        <input type="text" id="wpcf7-set-font-size" name="" class="rexwpcf7-set-font-size">
                    </div>
                    <div class="rexwpcf7-count-column_5">
                        <div class="label-px">px</div>
                    </div> 
                </div> -->
                <!-- -------- -->
                <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                        <div class="bl_d-iblock ml4-2">
                            <span class="rex-accordion--toggle">
                                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                            </span>
                        </div>
                        <div class="bl_d-iblock prova-icon ml12 l-icon--dark-grey">
                            <?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
                        </div>
                        <div class="bl_d-iblock ml19 tippy" tabindex="0" data-tippy-content="<?php _e('Text Color', 'rexpansive-builder');?>">
                            <input type="hidden" id="rex-wpcf7-background-color-runtime" name="rex-wpcf7-background-color-runtime" value="" />
                            <input id="rex-wpcf7-background-color" type="text" name="rex-wpcf7-background-color" value="" size="10" />
                            <div id="rex-wpcf7-background-color-preview-icon" class="preview-color-icon"></div>
                        </div>
                        <div id="content-text-color-palette" class="ml12 clearfix">
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
                                <span class="bg-palette-button bg-palette-blue"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
                                <span class="bg-palette-button bg-palette-green"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
                                <span class="bg-palette-button bg-palette-black"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
                                <span class="bg-palette-button bg-palette-red"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
                                <span class="bg-palette-button bg-palette-transparent">
                                    <i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
                                </span>
                            </div>
                        </div>
                        <!-- <div class="bl_d-iblock with-text ml24 tippy" data-tippy-content="<?php _e('Font Size', 'rexpansive-builder');?>">
                            <input type="text" id="rex-wpcf7-set-content-font-size" name="" class="bl_d-iblock rex-wpcf7-set-content-font-size">
                            <div class="bl_d-iblock label-px">px</div>
                        </div> -->
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <!-- <div class="bl_modal-row">
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
                            <div class="rexwpcf7-count-column_3"></div>
                            <div class="rexwpcf7-count-column_4"></div>
                            <div class="rexwpcf7-count-column_5"></div>
                        </div>
                    </div> -->
                    <div class="bl_modal-row rex-wpcf7-modal-row-tall">
                        <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                            <div class="bl_d-iblock ml4-2" style="width:20px;"></div>
                            <div class="bl_d-iblock ml12 prova-icon l-icon--dark-grey">
                                <?php Rexbuilder_Utilities::get_icon('#B037-Input-Text-Focus'); ?>
                            </div>
                            <div class="bl_d-iblock ml19 tippy" tabindex="0" data-tippy-content="<?php _e('Focus Text Color', 'rexpansive-builder');?>">
                                <input type="hidden" id="rex-wpcf7-focus-color-runtime" name="rex-wpcf7-focus-color-runtime" value="" />
                                    <input id="rex-wpcf7-focus-color" type="text" name="rex-wpcf7-focus-color" value="" size="10" />
                                    <div id="rex-wpcf7-focus-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                            <div id="focus-text-color-palette" class="ml12 clearfix">
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
                                    <span class="bg-palette-button bg-palette-blue"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
                                    <span class="bg-palette-button bg-palette-green"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
                                    <span class="bg-palette-button bg-palette-black"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
                                    <span class="bg-palette-button bg-palette-red"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
                                    <span class="bg-palette-button bg-palette-transparent">
                                        <i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close"> <!-- // Select Text -->
                <!-- <div class="bl_modal-row">
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button">
                                    <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                                </div>
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
                </div> -->
                
                <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                        <div class="bl_d-iblock ml4-2">
                            <span class="rex-accordion--toggle">
                                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                            </span>
                        </div>
                        <div class="bl_d-iblock prova-icon ml12 l-icon--dark-grey">
                            <?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
                        </div>
                        <div class="bl_d-iblock ml19 tippy" tabindex="0" data-tippy-content="<?php _e('Text Color', 'rexpansive-builder');?>">
                            <input type="hidden" id="rex-wpcf7-select-text-color-runtime" name="rex-wpcf7-select-text-color-runtime" value="" />
                                <input id="rex-wpcf7-select-text-color" type="text" name="rex-wpcf7-select-text-color" value="" size="10" />
                                <div id="rex-wpcf7-select-text-color-preview-icon" class="preview-color-icon"></div>
                        </div>
                        <div id="select-color-palette" class="ml12 clearfix">
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
                                <span class="bg-palette-button bg-palette-blue"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
                                <span class="bg-palette-button bg-palette-green"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
                                <span class="bg-palette-button bg-palette-black"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
                                <span class="bg-palette-button bg-palette-red"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
                                <span class="bg-palette-button bg-palette-transparent">
                                    <i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
                                </span>
                            </div>
                        </div>
                        <!-- <div class="bl_d-iblock with-text ml24 tippy" data-tippy-content="<?php _e('Font Size', 'rexpansive-builder');?>">
                            <input type="text" id="rex-wpcf7-set-content-font-size" name="" class="bl_d-iblock rex-wpcf7-set-content-font-size">
                            <div class="bl_d-iblock label-px">px</div>
                        </div> -->
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <!-- <div class="bl_modal-row">
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
                    </div> -->

                    <div class="bl_modal-row rex-wpcf7-modal-row-tall">
                        <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                            <div class="bl_d-iblock ml4-2" style="width:20px;"></div>
                            <div class="bl_d-iblock ml12 prova-icon l-icon--dark-grey">
                                <?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
                            </div>
                            <div class="bl_d-iblock ml19 tippy" tabindex="0" data-tippy-content="<?php _e('Text Color After Selection', 'rexpansive-builder');?>">
                                <input type="hidden" id="rex-wpcf7-select-text-color-after-selection-runtime" name="rex-wpcf7-select-text-color-after-selection-runtime" value="" />
                                <input id="rex-wpcf7-select-text-color-after-selection" type="text" name="rex-wpcf7-select-text-color-after-selection" value="" size="10" />
                                <div id="rex-wpcf7-select-text-color-after-selection-preview-icon" class="preview-color-icon"></div>
                            </div>
                            <div id="select-color-after-selection-palette" class="ml12 clearfix">
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
                                    <span class="bg-palette-button bg-palette-blue"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
                                    <span class="bg-palette-button bg-palette-green"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
                                    <span class="bg-palette-button bg-palette-black"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
                                    <span class="bg-palette-button bg-palette-red"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
                                    <span class="bg-palette-button bg-palette-transparent">
                                        <i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rexpansive-accordion close"> <!-- // Placeholder Color -->
                <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                        <div class="bl_d-iblock ml4-2">
                            <span class="rex-accordion--toggle">
                                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                            </span>
                        </div>
                        <div class="bl_d-iblock prova-icon ml12 l-icon--dark-grey">
                            <?php Rexbuilder_Utilities::get_icon('#B038-Input-Text-Placeholder'); ?>
                        </div>
                        <div class="bl_d-iblock ml19 tippy" tabindex="0" data-tippy-content="<?php _e('Placeholder Color', 'rexpansive-builder');?>">
                            <input type="hidden" id="rex-wpcf7-placeholder-color-runtime" name="rex-wpcf7-placeholder-color-runtime" value="" />
                                <input id="rex-wpcf7-placeholder-color" type="text" name="rex-wpcf7-placeholder-color" value="" size="10" />
                                <div id="rex-wpcf7-placeholder-color-preview-icon" class="preview-color-icon"></div>
                        </div>
                        <div id="placeholder-color-palette" class="ml12 clearfix">
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
                                <span class="bg-palette-button bg-palette-blue"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
                                <span class="bg-palette-button bg-palette-green"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
                                <span class="bg-palette-button bg-palette-black"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
                                <span class="bg-palette-button bg-palette-red"></span>
                            </div>
                            <div class="bg-palette-selector">
                                <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
                                <span class="bg-palette-button bg-palette-transparent">
                                    <i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <!-- <div class="bl_modal-row">
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
                            <div class="rexwpcf7-count-column_3"></div>
                            <div class="rexwpcf7-count-column_4"></div>
                            <div class="rexwpcf7-count-column_5"></div>
                        </div>
                    </div> -->

                    <div class="bl_modal-row rex-wpcf7-modal-row-tall">
                        <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                            <div class="bl_d-iblock ml4-2" style="width:20px;"></div>
                            <div class="bl_d-iblock ml12 prova-icon l-icon--dark-grey">
                                <?php Rexbuilder_Utilities::get_icon('#B039-Input-Text-Placeholder-Hover'); ?>
                            </div>
                            <div class="bl_d-iblock ml19 tippy" tabindex="0" data-tippy-content="<?php _e('Hover Placeholder Color', 'rexpansive-builder');?>">
                                <input type="hidden" id="rex-wpcf7-placeholder-hover-color-runtime" name="rex-wpcf7-placeholder-hover-color-runtime" value="" />
                                <input id="rex-wpcf7-placeholder-hover-color" type="text" name="rex-wpcf7-placeholder-hover-color" value="" size="10" />
                                <div id="rex-wpcf7-placeholder-hover-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                            <div id="hover-placeholder-color-palette" class="ml12 clearfix">
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
                                    <span class="bg-palette-button bg-palette-blue"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
                                    <span class="bg-palette-button bg-palette-green"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
                                    <span class="bg-palette-button bg-palette-black"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
                                    <span class="bg-palette-button bg-palette-red"></span>
                                </div>
                                <div class="bg-palette-selector">
                                    <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
                                    <span class="bg-palette-button bg-palette-transparent">
                                        <i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row"> <!-- // Text Editor -->
                <div id="wpcf7-text-editor" class="rexwpcf7-cont_row modal-editor-editorarea">
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
            <div class="bl_modal-row"> <!-- // File Max Dimensions -->
                <div class="rexwpcf7-cont_row rex-wpcf7-modal-row-tall valign-wrapper bl_jc-c bl_d-flex tippy" data-tippy-content="<?php _e('File Max Size', 'rexpansive-builder')?>">
                    <div class="input-field rex-input-prefixed with-text w82 bl_d-iblock">
                        <span id="rex-wpcf7-file-size-icon" class="prefix">
                            <?php Rexbuilder_Utilities::get_icon('#B040-Input-Dimension-File'); ?>
                        </span>
                        <input type="text" id="wpcf7-file-max-dimensions" name="wpcf7-file-max-dimensions">
                    </div>
                    <div class="bl_d-iblock ml12">
                        <select id="wpcf7-file-max-dimensions-unit" name="wpcf7-file-max-dimensions-unit">
                            <option value="kb">KB</option>
                            <option value="mb">MB</option>
                            <option value="gb">GB</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="wpcf7-list-fields" class="bl_modal-row ui-sortable"></div> <!-- // List -->
            <div class="bl_modal-row"> <!-- // Add Field In List -->
                <div class="rexwpcf7-cont_row bl_d-flex bl_jc-c mb36">
                    <button id="rex-wpcf7-add-list-field" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tippy" data-position="bottom" data-tippy-content="<?php _e('Add Field', 'rexpansive-builder')?>">
                        <i class="material-icons text-white">&#xE145;</i>
                        <!-- <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?> -->
                    </button>
                </div>
            </div>
            <div class="rexpansive-accordion close"> <!-- // Button Text -->
                <div class="bl_modal-row">
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
                            </span>
                        </div>
                        <div class="rexwpcf7-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="<?php _e('Button Text Color', 'rexpansive-builder');?>" tabindex="0">
                                <input type="hidden" id="rex-wpcf7-button-text-color-runtime" name="rex-wpcf7-button-text-color-runtime" value="" />
                                <input id="rex-wpcf7-button-text-color" type="text" name="rex-wpcf7-button-text-color" value="" size="10" />
                                <div id="rex-wpcf7-button-text-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="input-field rex-input-prefixed with-text-left">
                            <span class="prefix"></span>
                            <input type="text" id="rex-wpcf7-button-text" name="rex-wpcf7-button-text" class="rexbutton-upd-textbox">
                            <label id="rex-wpcf7-button-text-label" for="rex-wpcf7-button-text">
                                <?php _e('Button Text', 'rexpansive-builder');?>
                            </label>
                        </div>
                        <div class="rexwpcf7-count-column_3"></div>
                        <div class="rexwpcf7-count-column_4 with-text">
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
            <div class="rexpansive-accordion close"> <!-- // Button Background Color -->
                <div class="bl_modal-row">
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
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
            <div class="rexpansive-accordion close"> <!-- // Button Border Color -->
                <div class="bl_modal-row">
                    <div class="rexwpcf7-cont_row">
                        <div class="rexwpcf7-count-column_accord">
                            <span class="rex-accordion--toggle">
                                <div class="rexwpcf7-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?></div>
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
            <div class="bl_modal-row no12dx"> <!-- // Button -->
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