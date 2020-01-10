<?php
/**
 * Modal to edit section properties
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="modal-background-responsive-set" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button('Close'); ?>
        <?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-top-arrow.php'; ?>
        <div class="modal-content section-width-wrapper">
            <div id="section-config-first-row" class="bl_modal-row">
                <div class="rex-edit-layout-wrap bl_modal__option-wrap bl_modal__col-4">
                    <div class="rexlive-layout-type bl_modal__single-option tippy" data-rex-layout="fixed" data-tippy-content="<?php _e( 'Grid', 'rexpansive-builder' ); ?>" style="display:none;">
                        <label>
                            <input type="radio" id="section-fixed" name="section-layout" class="builder-edit-row-layout with-gap" value="fixed" checked title="Grid Layout" />
                            <span><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span>
                        </label>
                    </div>
                    <div class="rexlive-layout-type bl_modal__single-option tippy" data-rex-layout="masonry" data-tippy-content="<?php _e( 'Masonry', 'rexpansive-builder' ); ?>" style="display:none;">
                        <label>
                            <input type="radio" id="section-masonry" name="section-layout" class="builder-edit-row-layout with-gap" value="masonry" title="Masonry Layout" />
                            <span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span>
                        </label>
                    </div>
                    <div class="bl_switch tippy" data-tippy-content="<?php _e('Grid off/on','rexpansive-builder'); ?>">
                        <label>
                            <input class="builder-edit-row-layout-checkbox" name="builder-edit-row-layout-checkbox" type="checkbox">
                            <span class="lever"></span>
                            <span class="bl_switch__icon"><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span>
                        </label>
                    </div><!-- // Row grid on/off -->
                </div><!-- Grid fixed or masonry -->

                <div class="layout-wrap rex-edit-row-width rex-edit-row-width-wrapper bl_modal__option-wrap bl_modal__col-4 bl_jc-c">
                    <div class="rexlive-section-width bl_modal__single-option tippy" data-rex-section-width="full" data-tippy-content="<?php _e( 'Full', 'rexpansive-builder' ); ?>">
                        <label>
                            <input type="radio" id="section-full-modal" name="section-dimension-modal" class="builder-edit-row-dimension-modal with-gap" value="full" title="Full" />
                            <span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
                        </label>
                    </div>
                    <div class="rexlive-section-width bl_modal__single-option tippy" data-rex-section-width="boxed" data-tippy-content="<?php _e( 'Boxed', 'rexpansive-builder' ); ?>">
                        <label>
                            <input id="section-boxed-modal" type="radio" name="section-dimension-modal" class="builder-edit-row-dimension-modal with-gap" value="boxed" title="Boxed" />
                            <span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
                        </label>
                        
                    </div>
                </div><!-- Full section width or boxed -->

                <div class="bl_modal__option-wrap bl_modal__col-4">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Boxed Width', 'rexpansive-builder');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
                        <input type="text" class="section-set-boxed-width" name="section-set-boxed-width" value="0000" placeholder="" size="23">
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
                </div><!-- Boxed section options-->
            </div><!-- /full-heigth, boxed dimension, block distance -->

            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="rex-live__row-margin-padding block-padding-wrap">
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Top', 'rexpansive-builder' ); ?>">
                                <input type="text" size="5" id="row-margin-top" class="block-padding-values" name="row-margin-top" value=""
                                    placeholder="0" />
                                <span class="bl_input-indicator">px</span>
                            </div><!-- // row margin top -->
                        </div>
                        <div class="bl_d-flex bl_ai-c bl_jc-sb">
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Left', 'rexpansive-builder' ); ?>">
                                    <input type="text" size="5" id="row-margin-left" class="block-padding-values" name="row-margin-left" value=""
                                        placeholder="0" />
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- // row margin left -->
                            </div>
                            <div class="rex-live__row-padding-wrap">
                                <div class="bl_d-flex bl_jc-c">
                                    <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Top', 'rexpansive-builder' ); ?>">
                                        <input type="text" size="5" id="row-separator-top" class="block-padding-values" name="row-separator-top"
                                            value="" placeholder="" />
                                        <span class="bl_input-indicator">px</span>
                                    </div><!-- // row padding top -->
                                </div>
                                <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                    <div>
                                        <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Left', 'rexpansive-builder' ); ?>">
                                            <input type="text" size="5" id="row-separator-left" class="block-padding-values" name="row-separator-left"
                                                value="" placeholder="" />
                                            <span class="bl_input-indicator">px</span>
                                        </div><!-- // row padding left -->
                                    </div>
                                    <div class="rex-live__row-gutter-wrap bl_d-flex bl_jc-c bl_ai-c">
                                        <div class="rex-live__gutter-wrap--xaxis"></div>
                                        <div class="rex-live__row-gutter bl_d-flex bl_jc-c bl_ai-c">
                                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Gutter', 'rexpansive-builder' ); ?>">
                                                <input type="text" size="5" id="" class="section-set-block-gutter block-padding-values" name="section-set-block-gutter"
                                                    value="" placeholder="" size="15">
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // row gutter -->
                                        </div>
                                        <div class="rex-live__gutter-wrap--yaxis"></div>
                                    </div>
                                    <div>
                                        <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Right', 'rexpansive-builder' ); ?>">
                                            <input type="text" size="5" id="row-separator-right" class="block-padding-values" name="row-separator-right"
                                                value="" placeholder="" />
                                            <span class="bl_input-indicator">px</span>
                                        </div><!-- // row padding right -->
                                    </div>
                                </div>
                                <div class="bl_d-flex bl_jc-c">
                                    <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Bottom', 'rexpansive-builder' ); ?>">
                                        <input type="text" size="5" id="row-separator-bottom" class="block-padding-values" name="row-separator-bottom"
                                            value="" placeholder="" />
                                        <span class="bl_input-indicator">px</span>
                                    </div><!-- // row paddig bottom -->
                                </div>
                            </div>
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Right', 'rexpansive-builder' ); ?>">
                                    <input type="text" size="5" id="row-margin-right" class="block-padding-values" name="row-margin-right" value=""
                                        placeholder="0" />
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- //row margin right -->
                            </div>
                        </div>
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Bottom', 'rexpansive-builder' ); ?>">
                                <input type="text" size="5" id="row-margin-bottom" class="block-padding-values" name="row-margin-bottom" value=""
                                    placeholder="0" />
                                <span class="bl_input-indicator">px</span>
                            </div><!-- //row margin bottom -->
                        </div>
                    </div><!-- // row padding, gutter, margin new -->
                </div>
                <div class="bl_modal__option-wrap">
                    <div>
                        <div id="bg-set-full-section" class="rex-check-icon bl_modal__single-option--vertical tippy" data-tippy-content="<?php _e( 'Full Height', 'rexpansive-builder' ); ?>">
                            <label>
                                <input type="checkbox" id="section-is-full" name="section-is-full" value="full-height">
                                <span>
                                    <?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>
                                    <span class="bl_input-indicator">100%</span>
                                </span>
                            </label>
                        </div>
                        <div id="bg-set-photoswipe" class="rex-check-icon bl_modal__single-option--vertical tippy" data-tippy-content="<?php _e( 'All Images Zoom', 'rexpansive-builder' ); ?>">
                            <label>
                                <input type="checkbox" id="section-active-photoswipe" name="section-active-photoswipe" title="<?php _e('All Images Zoom', 'rexpansive-builder');?>">
                                <span>
                                    <?php Rexbuilder_Utilities::get_icon('#Z007-Zoom'); ?>
                                </span>
                            </label>
                        </div>
                        <div id="rx-hold-grid__wrap" class="rex-check-icon bl_modal__single-option--vertical tippy" data-tippy-content="<?php _e('Grid On Mobile', 'rexpansive-builder'); ?>">
                            <label>
                                <input type="checkbox" id="rx-hold-grid" name="rx-hold-grid" value="full-height" title="<?php _e('Grid On Mobile', 'rexpansive-builder'); ?>">
                                <span>
                                    <?php Rexbuilder_Utilities::get_icon('#B018-Mobile-Grid'); ?>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div class="b-row align-items-center b--border-bottom">
                <div class="b-col b--border-right">
                    <div class="b-row justify-content-center">
                        <div id="bg-set-full-section" class="rex-check-icon col">
                            <label>
                                <input type="checkbox" id="section-is-full" name="section-is-full" value="full-height">
                                <span>
                                    <?php // Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>
                                    <span class="bl_input-indicator">100%</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div id="bg-set-photoswipe" class="b-col b--border-right rex-check-icon">
                    <label>
                        <input type="checkbox" id="section-active-photoswipe" name="section-active-photoswipe" title="<?php // _e('All Images Zoom', 'rexpansive-builder');?>">
                        <span>
                            <?php // Rexbuilder_Utilities::get_icon('#Z007-Zoom'); ?>
                        </span>
                    </label>
                </div>

                <div id="rx-set-hold-grid" class="b-col">
                    <div id="rx-hold-grid__wrap" class="rex-check-icon col">
                        <input type="checkbox" id="rx-hold-grid" name="rx-hold-grid" value="full-height">
                        <label for="rx-hold-grid" class="tooltipped" data-position="bottom" data-tooltip="<?php // _e('Grid On Mobile', 'rexpansive-builder');?>">
                            <i class="rex-icon">V</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>

            </div> -->

            <div class="id-class-row-wrap bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div id="rex-config-id" class="input-field rex-input-prefixed tippy"  data-tippy-content="<?php _e( 'Section Name', 'rexpansive-builder' ); ?>">
                        <!-- <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php // _e('Section Name', 'rexpansive-builder');?>">B</i> -->
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B013-Row-ID'); ?></span>
                        <input type="text" id="sectionid-container" class="small-input" name="sectionid-container">
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
                <div class="bl_modal__option-wrap">
                    <div id="section-set-class-wrap" class="input-field rex-input-prefixed tippy"  data-tippy-content="<?php _e( 'Custom Classes', 'rexpansive-builder' ); ?>">
                        <!-- <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php // _e('Custom Class', 'rexpansive-builder');?>">e</i> -->
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#A008-Code'); ?></span>
                        <input type="text" id="section-set-custom-class" name="section-set-custom-class" class="small-input" value="" size="10">
                        <label for="section-set-custom-class">
                            <?php _e('Classes', 'rexpansive-builder');?>
                        </label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div><!-- custom classes -->
        </div>
    </div>
</div><!-- Section settings -->