<?php
/**
 * Modal to edit block properties
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;

?>
<div class="rex-modal-wrap">
    <div id="rex-block-options" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="background-options-area modal-content">
            <div id="block-edit-image-bg" class="background_set_image bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="valign-wrapper">
                        <div class="bg-image-block-active-wrapper tippy" data-tippy-content="<?php _e( 'Active Background Image', 'rexpansive'); ?>">
                            <input type="checkbox" id="image-block-active" value="color" />
                            <label for="image-block-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div id="bg-block-set-img-wrap" class="rex-button-with-plus tippy" data-tippy-content="<?php _e( 'Background Image', 'rexpansive'); ?>">
                            <div id="bg-block-img-preview" class="image-preview-logo">
                                <!-- <i class="material-icons rex-icon">p</i> -->
                                <span class="l-icon--white"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
                            </div>
                            <button id="background-block-up-img" class="rex-plus-button btn-floating l-icon--white light-blue darken-1" value="" title="Select Image">
                                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                            </button>
                            <input name="" class="file-path" type="hidden" id="background-block-url" />
                        </div>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--fluid">
                    <div id="set-image-size">
                        <input type="hidden" id="set-image-size-value" name="set-image-size-value" value="">
                    </div>
                    <div id="bg-set-img-type" class="col clearfix">
                        <div class="rex-background-image-type-wrap tippy" data-tippy-content="<?php _e( 'Image Full', 'rexpansive'); ?>" data-rex-type-image="full" style="margin-bottom:6px;">
                            <label>
                                <input id="bg-img-type-full" class="background_image_type with-gap" type="radio" name="background_image_type" value="full">
                                <span><?php Rexbuilder_Utilities::get_icon('#C003-Image-Full'); ?></span>
                            </label>
                            <!-- <label for="bg-img-type-full" class="tooltipped" data-position="bottom" data-tooltip="Full">
                                <i class="material-icons rex-icon">j</i>
                                <span class="rex-ripple"></span>
                            </label> -->
                        </div>
                        <div class="rex-background-image-type-wrap tippy" data-tippy-content="<?php _e( 'Image Natural', 'rexpansive'); ?>" data-rex-type-image="natural">
                            <label>
                                <input id="bg-img-type-natural" class="background_image_type with-gap" type="radio" name="background_image_type" value="natural">
                                <span><?php Rexbuilder_Utilities::get_icon('#C004-Image-Natural'); ?></span>
                            </label>
                            <!-- <label for="bg-img-type-natural" class="tooltipped" data-position="bottom" data-tooltip="Natural">
                                <i class="material-icons rex-icon">k</i>
                                <span class="rex-ripple"></span>
                            </label> -->
                        </div>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--fluid">
                    <div id="bg-set-photoswipe" class="rex-check-icon tippy" data-tippy-content="<?php _e( 'Photo Zoom', 'rexpansive'); ?>">
                        <label>
                            <input type="checkbox" id="background_photoswipe" name="background_photoswipe" title="<?php _e( 'Photo Zoom', 'rexpansive' ); ?>">
                            <span>
                                <?php Rexbuilder_Utilities::get_icon('#Z007-Zoom'); ?>
                            </span>
                        </label>
                        <!-- <input type="checkbox" id="background_photoswipe" name="background_photoswipe" title="Photo Zoom">
                        <label for="background_photoswipe" class="tooltipped" data-position="bottom" data-tooltip="Photo Zoom">
                            <i class="rex-icon">g</i>
                            <span class="rex-ripple"></span>
                        </label> -->
                    </div>
                </div>

                <div class="bl_modal__option-wrap bl_jc-c">
                    <div id="rex-block-image-position-editor" class="radio-group__wrap">
                        <div>
                            <input id="rex-bm-image-top-left" type="radio" class="image-position small-radio with-gap" name="image-position" value="top-left" />
                            <label for="rex-bm-image-top-left" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Top-Left Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-top-center" type="radio" class="image-position small-radio with-gap" name="image-position" value="top-center" />
                            <label for="rex-bm-image-top-center" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Top-Center Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-top-right" type="radio" class="image-position small-radio with-gap" name="image-position" value="top-right"/>
                            <label for="rex-bm-image-top-right" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Top-Right Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-image-middle-left" type="radio" class="image-position small-radio with-gap" name="image-position" value="middle-left" />
                            <label for="rex-bm-image-middle-left" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Middle-Left Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-middle-center" type="radio" class="image-position small-radio with-gap" name="image-position" value="middle-center" />
                            <label for="rex-bm-image-middle-center" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Middle-Center Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-middle-right" type="radio" class="image-position small-radio with-gap" name="image-position" value="middle-right" />
                            <label for="rex-bm-image-middle-right" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Middle-Right Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-image-bottom-left" type="radio" class="image-position small-radio with-gap" name="image-position" value="bottom-left" />
                            <label for="rex-bm-image-bottom-left" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Bottom-Left Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-bottom-center" type="radio" class="image-position small-radio with-gap" name="image-position" value="bottom-center" />
                            <label for="rex-bm-image-bottom-center" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Bottom-Center Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-bottom-right" type="radio" class="image-position small-radio with-gap" name="image-position" value="bottom-right" />
                            <label for="rex-bm-image-bottom-right" class="rex-block-image-position tippy" data-tippy-content="<?php _e( 'Bottom-Right Image', 'rexpansive' ); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /BACKGROUND IMAGE -->
            <div id="background-block-set-color" class="background_set_color bl_modal-row">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="valign-wrapper">
                        <div class="bg-color-block-active-wrapper tippy" data-tippy-content="<?php _e( 'Active Background Color', 'rexpansive'); ?>">
                            <input type="checkbox" id="color-block-active" value="color" />
                            <label for="color-block-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div class="rex-relative-col tippy" data-tippy-content="<?php _e( 'Background Color', 'rexpansive'); ?>">
                            <input type="hidden" id="background-block-color-runtime" name="background-block-color-runtime" value="" />
                            <input id="background-block-color" type="text" name="background-block-color" value="" size="10" />
                            <div id="background-block-preview-icon" class="preview-color-icon"></div>
                        </div>
                    </div>
                </div>
                <div class="bl_modal__option-wrap">
                    <div id="bg-block-color-palette" class="clearfix">
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)" />
                            <span class="bg-palette-button bg-palette-blue" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)" />
                            <span class="bg-palette-button bg-palette-green" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)" />
                            <span class="bg-palette-button bg-palette-black" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)" />
                            <span class="bg-palette-button bg-palette-red" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(255,152,0,1)" />
                            <span class="bg-palette-button bg-palette-orange" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(156,39,176,1)" />
                            <span class="bg-palette-button bg-palette-purple" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)" />
                            <span class="bg-palette-button bg-palette-transparent">
                                <?php Rexbuilder_Utilities::get_icon('#C002-No-Select'); ?>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /COLOR BACKGROUND BLOCK -->
            <div id="bg-overlay-block-set-color" class="background_set_color bl_modal-row">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="valign-wrapper">
                        <div class="overlay-active-wrapper tippy" data-tippy-content="<?php _e( 'Active Overlay Color', 'rexpansive'); ?>">
                            <input type="checkbox" id="overlay-block-active" value="color" />
                            <label for="overlay-block-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div class="rex-relative-col tippy" data-tippy-content="<?php _e( 'Overlay Color', 'rexpansive'); ?>">
                            <div class="block-overlay-preview">
                                <input id="overlay-color-block-value" type="text" name="overlay-color-block-value" value="rgba(255,255,255,0.5)" size="10" />
                                <div id="overlay-block-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bl_modal__option-wrap">
                    <div id="bg-overlay-block-color-palette" class="col">
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,0.6)" />
                            <span class="bg-palette-button overlay-palette-blue" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,0.6)" />
                            <span class="bg-palette-button overlay-palette-green" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,0.6)" />
                            <span class="bg-palette-button overlay-palette-black" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,0.6)" />
                            <span class="bg-palette-button overlay-palette-red" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(255,152,0,0.6)" />
                            <span class="bg-palette-button overlay-palette-orange" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(156,39,176,0.6)" />
                            <span class="bg-palette-button overlay-palette-purple" />
                        </div>
                        <div class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)" />
                            <span class="bg-palette-button overlay-palette-transparent">
                                <?php Rexbuilder_Utilities::get_icon('#C002-No-Select'); ?>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="block-set-class-wrap" class="bl_modal-row">
                <div id="block-paddings-wrapper" class="bl_modal__option-wrap">
                    <div class="rex-live__block-padding-wrap">
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c">
                                <input type="text" id="bm-block-padding-top" class="block-padding-values" name="block-padding-top" value="5" />
                            </div><!-- // block padding top -->
                        </div>
                        <div class="bl_d-flex bl_ai-c bl_jc-sb">
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c">
                                    <input type="text" id="bm-block-padding-left" class="block-padding-values" name="block-padding-left" value="5" />
                                </div><!-- // block padding left -->
                            </div>
                            <div class="rex-live__row-gutter-wrap bl_d-flex bl_jc-c bl_ai-c">
                                <div class="rex-live__gutter-wrap--xaxis"></div>
                                <div class="rex-live__row-gutter bl_d-flex bl_jc-c bl_ai-c">
                                    <div class="val-wrap bl_d-iflex bl_ai-c">
                                        <div id="block-padding-type-select" class="rex-vertical-check-wrap col">
                                            <div class="rex-check-text rex-block-padding-type-wrap" data-rex-type-padding="%">
                                                <input id="bm-block-pad-percentage" type="radio" class="bm-block-padding-type with-gap" name="block-padding-type" value="percentage" checked />
                                                <label for="bm-block-pad-percentage">
                                                    %
                                                    <span class="rex-ripple"></span>
                                                </label>
                                            </div>
                                            <div class="rex-check-text rex-block-padding-type-wrap" data-rex-type-padding="px">
                                                <input id="bm-block-pad-pixel" type="radio" class="bm-block-padding-type with-gap" name="block-padding-type" value="pixel" />
                                                <label for="bm-block-pad-pixel">
                                                    PX
                                                    <span class="rex-ripple"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div><!-- // block padding unit measure -->
                                </div>
                                <div class="rex-live__gutter-wrap--yaxis"></div>
                            </div>
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c">
                                    <input type="text" id="bm-block-padding-right" class="block-padding-values" name="block-padding-right" value="5" />
                                </div><!-- // block padding right -->
                            </div>
                        </div>
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c">
                                <input type="text" id="bm-block-padding-bottom" class="block-padding-values" name="block-padding-bottom" value="5" />
                            </div><!-- // block paddig bottom -->
                        </div>
                    </div><!-- // block padding -->
                </div>
                <!-- PADDINGS -->
                <div id="block-content-positions-wrapper" class="bl_modal__option-wrap bl_jc-c">
                    <div class="radio-group__wrap">
                        <div>
                            <input id="rex-bm-content-setup-top-left" type="radio" class="content-position small-radio with-gap" name="content-position" value="top-left" />
                            <label for="rex-bm-content-setup-top-left" class="tippy rex-block-position" data-tippy-content="<?php _e('Top-Left Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-setup-top-center" type="radio" class="content-position small-radio with-gap" name="content-position" value="top-center" />
                            <label for="rex-bm-content-setup-top-center" class="tippy rex-block-position" data-tippy-content="<?php _e('Top-Center Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-setup-top-right" type="radio" class="content-position small-radio with-gap" name="content-position" value="top-right"/>
                            <label for="rex-bm-content-setup-top-right" class="tippy rex-block-position" data-tippy-content="<?php _e('Top-Right Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-content-setup-middle-left" type="radio" class="content-position small-radio with-gap" name="content-position" value="middle-left" />
                            <label for="rex-bm-content-setup-middle-left" class="tippy rex-block-position" data-tippy-content="<?php _e('Middle-Left Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-setup-middle-center" type="radio" class="content-position small-radio with-gap" name="content-position" value="middle-center" />
                            <label for="rex-bm-content-setup-middle-center" class="tippy rex-block-position" data-tippy-content="<?php _e('Middle-Center Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-setup-middle-right" type="radio" class="content-position small-radio with-gap" name="content-position" value="middle-right" />
                            <label for="rex-bm-content-setup-middle-right" class="tippy rex-block-position" data-tippy-content="<?php _e('Middle-Right Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-content-setup-bottom-left" type="radio" class="content-position small-radio with-gap" name="content-position" value="bottom-left" />
                            <label for="rex-bm-content-setup-bottom-left" class="tippy rex-block-position" data-tippy-content="<?php _e('Bottom-Left Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-setup-bottom-center" type="radio" class="content-position small-radio with-gap" name="content-position" value="bottom-center" />
                            <label for="rex-bm-content-setup-bottom-center" class="tippy rex-block-position" data-tippy-content="<?php _e('Bottom-Center Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-setup-bottom-right" type="radio" class="content-position small-radio with-gap" name="content-position" value="bottom-right" />
                            <label for="rex-bm-content-setup-bottom-right" class="tippy rex-block-position" data-tippy-content="<?php _e('Bottom-Right Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <!-- POSITIONS -->
            </div>
            <!-- /POSITION & PADDING -->
            <div id="bg-set-link-wrap" class="bl_modal-row">
                <div class="bl_modal__option-wrap block-url-link-wrapper tippy" data-tippy-content="<?php _e( 'Link', 'rexpansive'); ?>">
                    <div class="input-field rex-input-prefixed">
                        <!-- <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="Link">l</i> -->
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#C001-Link'); ?></span>
                        <input type="text" id="block_link_value" class="small-input" name="block_link_value" value="" size="30">
                        <label for="block_link_value">https://www...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div>
            <!-- //LINK -->
            <div class="bl_modal-row bl_modal-row--no-border">
                <div class="bl_modal__option-wrap block-custom-class-wrapper">
                    <div class="input-field rex-input-prefixed tippy" data-tippy-content="<?php _e( 'Custom Classes', 'rexpansive'); ?>">
                        <!-- <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="Custom Class">e</i> -->
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#A008-Code'); ?></span>
                        <input type="text" id="rex_block_custom_class" class="small-input" name="rex_block_custom_class" value="">
                        <label for="rex_block_custom_class">
                            Classes
                        </label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div>
            <!-- //CLASSES -->
            <div class="bl_modal-row"><div class="bl_modal__option-wrap"></div></div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--confirm tool-button--modal rex-modal-option tippy" data-tippy-content="<?php _e('Save','rexpansive-builder'); ?>" data-rex-option="save">
                <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z016-Checked'); ?></span>
            </div>
            <div class="tool-button tool-button--inline tool-button--modal rex-modal-option tippy" data-rex-option="reset" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
                <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z014-Refresh'); ?></span>
            </div>
        </div>
    </div>
</div>