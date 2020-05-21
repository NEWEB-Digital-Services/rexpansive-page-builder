<?php
/**
* Modal for RexWpcf7 Content editing
*
* @since			2.0.2
* @package    Rexbuilder
* @subpackage Rexbuilder/admin/partials/modals
*/
defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-wpcf7-content-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
        <!-- Closing button -->
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>" value="" >
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <!-- General wrap -->
        <div class="modal-content"> <!-- // Required Field, E-Mail Field, Only Numbers  -->
            <?php include 'rexlive-loader-modal.php'; ?>
            <div id="required-field-row" class="bl_modal-row modal-row-grey">
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
            <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall"> <!-- // Default Check -->
                <div id="wpcf7-default-check-wrap" class="rexwpcf7-cont_row valign-wrapper bl_jc-c" >
                    <label>
                        <input type="checkbox" id="wpcf7-default-check" name="wpcf7-default-check" value="default-check">
                        <span id="rex-wpcf7-default-check-icon">
                            <?php Rexbuilder_Utilities::get_icon('#B032-Input-Checkbox'); ?>
                            <span class="wpcf7-default-check-title">default check</span>
                        </span>
                    </label>
                </div>
            </div>
            <div class="bl_modal-row modal-row-grey"> <!-- // Placeholder -->
                <div class="rexwpcf7-cont_row">
                    <div class="input-field rex-input-prefixed pl4">
                        <span class="prefix big-icon">
                            <?php Rexbuilder_Utilities::get_icon('#B038-Input-Text-Placeholder'); ?>
                        </span>
                        <input type="text" id="wpcf7-placeholder" name="wpcf7-placeholder">
                        <label id="wpcf7-placeholder-label" for="wpcf7-placeholder">
                            <?php _e('Placeholder', 'rexpansive-builder');?>
                        </label>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall"> <!-- // Width & Height -->
                <div class="bl_modal__option-wrap bl_jc-c tippy" data-tippy-content="<?php _e('Width', 'rexpansive-builder');?>">
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
                <div class="bl_modal__option-wrap bl_jc-c tippy" data-tippy-content="<?php _e('Height', 'rexpansive-builder');?>">
                    <div class="rex-input-prefixed input-field w67 with-text">
                        <span class="prefix">
                            <?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>  
                        </span>
                        <input type="text" id="wpcf7-input-height" class="rexwpcf7-set-height-input" name="">
                        <span class="rex-material-bar"></span>
											</div>
											<div class="bl_d-iblock label-px ml12" style="font-size: 16px;">
												<?php _e('PX', 'rexpansive-builder');?>
                    </div>
                </div>
            </div>
            <div id="rex-wpcf7-font-size-row" class="bl_modal-row row-hidden"> <!-- // Font Size -->
                <div class="rexwpcf7-cont_row font-size-row">
                    <div id="rex-wpcf7-font-size-field" class="bl_d-iblock with-text ml24 tippy" data-tippy-content="<?php _e('Font Size', 'rexpansive-builder');?>">
                        <input type="text" id="wpcf7-set-font-size" name="" class="rexwpcf7-set-font-size">
                        <div class="bl_d-iblock label-px">px</div>
                    </div>
                </div>
            </div>
            <div class="rex-accordion close"> <!-- // Text -->
                <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                        <div class="bl_d-iblock rex-wpcf7-accordion-plus-wrap">
                            <span class="rex-accordion--toggle">
                                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                            </span>
                        </div>
                        <div class="bl_d-iblock big-icon ml12 l-icon--dark-grey">
                            <?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
                        </div>
                        <div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Main Text Color', 'rexpansive-builder');?>">
                            <input type="hidden" id="rex-wpcf7-text-color-runtime" name="rex-wpcf7-text-color-runtime" value="" />
                            <input id="rex-wpcf7-text-color" type="text" name="rex-wpcf7-text-color" value="" size="10" />
                            <div id="rex-wpcf7-text-color-preview-icon" class="preview-color-icon"></div>
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
                    <div class="bl_modal-row rex-wpcf7-modal-row-tall">
                        <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                            <div class="bl_d-iblock ml36 big-icon l-icon--dark-grey">
                                <?php Rexbuilder_Utilities::get_icon('#B037-Input-Text-Focus'); ?>
                            </div>
                            <div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Color When Writing', 'rexpansive-builder');?>">
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
            <div class="rex-accordion close"> <!-- // Select Text -->
                <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                        <div class="bl_d-iblock rex-wpcf7-accordion-plus-wrap">
                            <span class="rex-accordion--toggle">
                                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                            </span>
                        </div>
                        <div class="bl_d-iblock big-icon ml12 l-icon--dark-grey">
                            <?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
                        </div>
                        <div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Main Text Color', 'rexpansive-builder');?>">
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
                    <div class="bl_modal-row rex-wpcf7-modal-row-tall">
                        <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                            <div class="bl_d-iblock ml36 big-icon l-icon--dark-grey">
                                <?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
                            </div>
                            <div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Text Color After Selection', 'rexpansive-builder');?>">
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
            <div class="rex-accordion close"> <!-- // Placeholder Color -->
                <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                        <div class="bl_d-iblock rex-wpcf7-accordion-plus-wrap">
                            <span class="rex-accordion--toggle">
                                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                            </span>
                        </div>
                        <div class="bl_d-iblock big-icon ml12 l-icon--dark-grey">
                            <?php Rexbuilder_Utilities::get_icon('#B038-Input-Text-Placeholder'); ?>
                        </div>
                        <div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Placeholder Color', 'rexpansive-builder');?>">
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
                    <div class="bl_modal-row rex-wpcf7-modal-row-tall">
                        <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                            <div class="bl_d-iblock ml36 big-icon l-icon--dark-grey">
                                <?php Rexbuilder_Utilities::get_icon('#B039-Input-Text-Placeholder-Hover'); ?>
                            </div>
                            <div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Hover Placeholder Color', 'rexpansive-builder');?>">
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
            <div class="bl_modal-row modal-row-grey"> <!-- // Text Editor -->
                <div id="wpcf7-text-editor" class="rexwpcf7-cont_row modal-editor-editorarea modal-row-grey">
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
            <div class="bl_modal-row modal-row-grey"> <!-- // File Max Dimensions -->
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
            <div id="wpcf7-list-fields" class="bl_modal-row modal-row-grey ui-sortable"></div> <!-- // List -->
            <div class="bl_modal-row modal-row-grey"> <!-- // Add Field In List -->
                <div class="rexwpcf7-cont_row bl_d-flex bl_jc-c mb36">
                    <button id="rex-wpcf7-add-list-field" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tippy" data-position="bottom" data-tippy-content="<?php _e('Add Field', 'rexpansive-builder')?>">
                        <i class="material-icons text-white">&#xE145;</i>
                        <!-- <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?> -->
                    </button>
                </div>
            </div>
            <div class="rexpansive-accordion-outer close"> <!-- // Button Accordion -->
                <div id="rex-wpcf7-buttons-accordion" class="bl_modal-row rex-wpcf7-modal-row-tall rex-accordion-outer--toggle">
                    <div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper">
                        <div class="rex-wpcf7-accordion-outer-plus-wrap bl_d-iblock">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
                        <div class="rex-wpcf7-title-icon l-icon--dark-grey bl_d-iblock">
                            <?php Rexbuilder_Utilities::get_icon('#B034-Input-Button'); ?>
                        </div>
                        <div class="bl_d-iblock modal-accordion-title accotdion-button-title">button</div>
                    </div>
                </div>
                <div class="rex-accordion-outer--content" style="display:none;" data-item-status="close">
                    <div class="bl-modal-row"> <!-- // Button Settings -->
                        <div class="bl_modal-row bl_jc-c modal-row-grey rex-wpcf7-modal-row-tall"> <!-- // Button Preview -->
                            <div class="bl_d-iblock with-preview-button tippy" data-tippy-content="<?php _e('Preview', 'rexpansive-builder');?>">
                                <label id="rex-wpcf7-button-modal-preview"></label>
                            </div>
                        </div>
                        <div class="rex-accordion close"> <!-- // Button Text -->
                            <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                                <div class="rexwpcf7-cont_row valign-wrapper">
                                    <span class="rex-accordion--toggle rex-wpcf7-accordion-plus-wrap">
                                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                                    </span>
                                    <div class="ml12 tippy" data-tippy-content="<?php _e('Button Text Color', 'rexpansive-builder');?>" >
                                        <input type="hidden" id="rex-wpcf7-button-text-color-runtime" name="rex-wpcf7-button-text-color-runtime" value="" />
                                        <input id="rex-wpcf7-button-text-color" type="text" name="rex-wpcf7-button-text-color" value="" size="10" />
                                        <div id="rex-wpcf7-button-text-color-preview-icon" class="preview-color-icon"></div>
                                    </div>
                                    <div id="rex-wpcf7-button-text-editor" class="input-field rex-input-prefixed with-text-left ml19">
                                        <span class="prefix"></span>
                                        <input type="text" id="rex-wpcf7-button-text" name="rex-wpcf7-button-text">
                                        <label id="rex-wpcf7-button-text-label" for="rex-wpcf7-button-text">
                                            <?php _e('Button Text', 'rexpansive-builder');?>
                                        </label>
                                    </div>
                                    <div class="bl_d-iblock with-text ml22 tippy" data-tippy-content="<?php _e('Button Text Size', 'rexpansive-builder');?>">
                                        <input type="text" id="wpcf7-button-text-font-size" name="">
                                        <div class="bl_d-iblock label-px">px</div>
                                    </div>
                                </div>
                            </div>
                            <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                                <div class="bl_modal-row rex-wpcf7-modal-row-tall"> <!-- // Button Text Color Hover -->
                                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                                        <div class="bl_d-iblock ml36 tippy"  data-tippy-content="<?php _e('Button Hover Text Color', 'rexpansive-builder');?>">
                                            <input type="hidden" id="rex-wpcf7-button-text-color-hover-runtime" name="rex-wpcf7-button-text-color-hover-runtime" value="" />
                                            <input id="rex-wpcf7-button-text-color-hover" type="text" name="rex-wpcf7-button-text-color-hover" value="" size="10" />
                                            <div id="rex-wpcf7-button-text-color-hover-preview-icon" class="preview-color-icon"></div>
                                        </div>
                                        <div id="button-hover-text-color-palette" class="ml19 clearfix">
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
                                                <input class="bg-palette-value" type="hidden" value="rgba(255,152,0,1)">
                                                <span class="bg-palette-button bg-palette-orange">
                                                </span>
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
                        <div class="rex-accordion close"> <!-- // Button Background Color -->
                            <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                                <div class="rexwpcf7-cont_row valign-wrapper">
                                    <span class="rex-accordion--toggle rex-wpcf7-accordion-plus-wrap">
                                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                                    </span>
                                    <div class="ml12 tippy" data-tippy-content="<?php _e('Button Background Color', 'rexpansive-builder');?>" >
                                        <input type="hidden" id="rex-wpcf7-button-background-color-runtime" name="rex-wpcf7-button-background-color-runtime" value="" />
                                        <input id="rex-wpcf7-button-background-color" type="text" name="rex-wpcf7-button-background-color" value="" size="10" />
                                        <div id="rex-wpcf7-button-background-color-preview-icon" class="preview-color-icon"></div>
                                    </div>
                                    <div class="ml19">
                                        <div id="rex-wpcf7-preview-button-background-color"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                                <div class="bl_modal-row rex-wpcf7-modal-row-tall"> <!-- // Button Background Color Hover -->
                                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                                        <div class="bl_d-iblock ml36 tippy"  data-tippy-content="<?php _e('Button Hover Background Color', 'rexpansive-builder');?>">
                                            <input type="hidden" id="rex-wpcf7-button-background-color-hover-runtime" name="rex-wpcf7-button-background-color-hover-runtime" value="" />
                                            <input id="rex-wpcf7-button-background-color-hover" type="text" name="rex-wpcf7-button-background-color-hover" value="" size="10" />
                                            <div id="rex-wpcf7-button-background-color-hover-preview-icon" class="preview-color-icon"></div>
                                        </div>
                                        <div id="button-hover-background-color-palette" class="ml19 clearfix">
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
                                                <input class="bg-palette-value" type="hidden" value="rgba(255,152,0,1)">
                                                <span class="bg-palette-button bg-palette-orange">
                                                </span>
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
                        <div class="rex-accordion close"> <!-- // Button Border Color -->
                            <div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
                                <div class="rexwpcf7-cont_row valign-wrapper">
                                    <span class="rex-accordion--toggle rex-wpcf7-accordion-plus-wrap">
                                        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                                    </span>
                                    <div class="ml12 tippy" data-tippy-content="<?php _e('Button Border Color', 'rexpansive-builder');?>" >
                                        <input type="hidden" id="rex-wpcf7-button-border-color-runtime" name="rex-wpcf7-button-border-color-runtime" value="" />
                                        <input id="rex-wpcf7-button-border-color" type="text" name="rex-wpcf7-button-border-color" value="" size="10" />
                                        <div id="rex-wpcf7-button-border-color-preview-icon" class="preview-color-icon"></div>
                                    </div>
                                    <div class="ml19">
                                        <div id="rex-wpcf7-preview-button-border-color"></div>
                                    </div>
                                    <div class="bl_d-iblock with-text ml22 tippy" data-tippy-content="<?php _e('Button Border Width', 'rexpansive-builder');?>">
                                        <input type="text" id="wpcf7-button-border-width" name="wpcf7-button-border-width"/>
                                        <div class="bl_d-iblock label-px">px</div>
                                    </div>
                                </div>
                            </div>
                            <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                                <div class="bl_modal-row rex-wpcf7-modal-row-tall"> <!-- // Button Border Color Hover -->
                                    <div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
                                        <div class="bl_d-iblock ml36 tippy"  data-tippy-content="<?php _e('Button Hover Border Color', 'rexpansive-builder');?>">
                                            <input type="hidden" id="rex-wpcf7-button-border-color-hover-runtime" name="rex-wpcf7-button-border-color-hover-runtime" value="" />
                                            <input id="rex-wpcf7-button-border-color-hover" type="text" name="rex-wpcf7-button-border-color-hover" value="" size="10" />
                                            <div id="rex-wpcf7-button-border-color-hover-preview-icon" class="preview-color-icon"></div>
                                        </div>
                                        <div id="button-hover-border-color-palette" class="ml19 clearfix">
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
                                                <input class="bg-palette-value" type="hidden" value="rgba(255,152,0,1)">
                                                <span class="bg-palette-button bg-palette-orange">
                                                </span>
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
                        <div class="bl_modal-row modal-row-grey no12dx"> <!-- // Button -->
                            <div class="rexbutton-cont_row23">
                                <div class="rexbutton-count-column_6 margin-padding-area">
                                    <div class="rex-live__row-margin-padding block-padding-wrap">
                                        <div class="bl_d-flex bl_jc-c">
                                            <div class="val-wrap bl_d-iflex bl_ai-c">
                                                <input type="text" id="wpcf7-button-margin-top" name="wpcf7-button-margin-top" class="block-padding-values tippy" placeholder="20" data-tippy-content="<?php _e( 'Margin Top', 'rexpansive-builder' ); ?>"/>
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // Button Margin Top -->
                                        </div>
                                        <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                            <div>
                                                <div class="val-wrap bl_d-iflex bl_ai-c">
                                                    <input type="text" id="wpcf7-button-margin-left" name="wpcf7-button-margin-left" class="block-padding-values tippy" placeholder="20" data-tippy-content="<?php _e( 'Margin Left', 'rexpansive-builder' ); ?>"/>
                                                    <span class="bl_input-indicator">px</span>
                                                </div><!-- // Button Margin Left -->
                                            </div>
                                            <div class="rex-live__row-padding-wrap">
                                                <div class="bl_d-flex bl_jc-c">
                                                    <div class="val-wrap bl_d-iflex bl_ai-c">
                                                        <input type="text" id="wpcf7-button-padding-top" name="wpcf7-button-padding-top" class="block-padding-values tippy" placeholder="20" data-tippy-content="<?php _e( 'Padding Top', 'rexpansive-builder' ); ?>"/>
                                                        <span class="bl_input-indicator">px</span>
                                                    </div><!-- // Button Padding Top -->
                                                </div>
                                                <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                                    <div class="zl_cfd_a">BUTTON</div>
                                                    <div>
                                                        <div class="val-wrap bl_d-iflex bl_ai-c">
                                                            <input type="text" id="wpcf7-button-padding-left" name="wpcf7-button-padding-left" class="block-padding-values tippy" placeholder="20" data-tippy-content="<?php _e( 'Padding Left', 'rexpansive-builder' ); ?>"/>
                                                            <span class="bl_input-indicator">px</span>
                                                        </div><!-- // Button Padding Left -->
                                                    </div>
                                                    <div class="rex-live__row-gutter-wrap bl_d-flex bl_jc-c bl_ai-c"></div>
                                                    <div>
                                                        <div class="val-wrap bl_d-iflex bl_ai-c">
                                                            <input type="text" id="wpcf7-button-padding-right" name="wpcf7-button-padding-right" class="block-padding-values tippy" placeholder="20" data-tippy-content="<?php _e( 'Padding Right', 'rexpansive-builder' ); ?>"/>
                                                            <span class="bl_input-indicator">px</span>
                                                        </div><!-- // Button Padding Right -->
                                                    </div>
                                                </div>
                                                <div class="bl_d-flex bl_jc-c">
                                                    <div class="val-wrap bl_d-iflex bl_ai-c">
                                                        <input type="text" id="wpcf7-button-padding-bottom" name="wpcf7-button-padding-bottom" class="block-padding-values tippy" placeholder="20" data-tippy-content="<?php _e( 'Padding Bottom', 'rexpansive-builder' ); ?>"/>
                                                        <span class="bl_input-indicator">px</span>
                                                    </div><!-- // Button Paddig Bottom -->
                                                </div>
                                            </div>
                                            <div>
                                                <div class="val-wrap bl_d-iflex bl_ai-c">
                                                    <input type="text" id="wpcf7-button-margin-right" name="wpcf7-button-margin-right" class="block-padding-values tippy" placeholder="20" data-tippy-content="<?php _e( 'Margin Right', 'rexpansive-builder' ); ?>"/>
                                                    <span class="bl_input-indicator">px</span>
                                                </div><!-- //Button Margin Right -->
                                            </div>
                                        </div>
                                        <div class="bl_d-flex bl_jc-c">
                                            <div class="val-wrap bl_d-iflex bl_ai-c">
                                                <input type="text" id="wpcf7-button-margin-bottom" name="wpcf7-button-margin-bottom" class="block-padding-values tippy" placeholder="20" data-tippy-content="<?php _e( 'Margin Bottom', 'rexpansive-builder' ); ?>"/>
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- //Button Margin Bottom -->
                                        </div>
                                    </div><!-- // Button Padding, Margin -->
                                </div>
                                <div class="rexbutton-count-column_7 valign-wrapper nobord"> <!-- // Border Radius -->
                                    <div class="rexbutton-count-column_container input-field rex-input-prefixed valign-wrapper with-text tippy" data-tippy-content="<?php _e( 'Border Radius', 'rexpansive-builder' ); ?>">
                                        <span class="prefix">
                                            <?php Rexbuilder_Utilities::get_icon('#D001-Radius'); ?>
                                        </span>
                                        <input type="text" id="wpcf7-button-border-radius" name="wpcf7-button-border-radius"/>
                                        <div class="bl_d-iblock label-px ml3">px</div>
                                    </div>
                                </div>
                                <div class="rexbutton-count-column_7 valign-wrapper"> <!-- // Height -->
                                    <div class="rexbutton-count-column_container input-field rex-input-prefixed valign-wrapper with-text tippy" data-tippy-content="<?php _e( 'Button Height', 'rexpansive-builder' ); ?>">
                                        <span class="prefix">
                                            <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
                                        </span>
                                        <input type="text" id="wpcf7-button-height" name="wpcf7-button-height"/>
                                        <div class="bl_d-iblock label-px ml3">px</div>
                                    </div>
                                </div>
                                <div class="rexbutton-count-column_7 valign-wrapper"> <!-- // Width -->
                                    <div class="rexbutton-count-column_container input-field rex-input-prefixed valign-wrapper with-text tippy" data-tippy-content="<?php _e( 'Button Width', 'rexpansive-builder' ); ?>">
                                        <span class="prefix rot90">
                                            <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
                                        </span>
                                        <input type="text" id="wpcf7-button-width" name="wpcf7-button-width"/>
                                        <div class="bl_d-iblock label-px ml3">px</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer -->
        <div class="rex-modal__outside-footer">
					<div class="tool-button tool-button--inline tool-button--save rex-apply-button tippy" data-tippy-content="<?php _e('Save','rexpansive-builder'); ?>" data-rex-option="save">
						<span class="rex-button save-page btn-save--wrap">
							<?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?>
						</span>
					</div>
					<div class="tool-button tool-button--centered tool-button--cancel rex-reset-button tippy" data-rex-option="continue" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
						<?php Rexbuilder_Utilities::get_icon('#Z014-Refresh'); ?>
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