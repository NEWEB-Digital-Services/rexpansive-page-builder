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
    <div id="rex-block-image-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="background-options-area modal-content background_set_image">
            <div id="block-edit-image-setting-bg" class="bl_modal-row">
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
                        </div>
                        <div class="rex-background-image-type-wrap tippy" data-tippy-content="<?php _e( 'Image Natural', 'rexpansive'); ?>" data-rex-type-image="natural">
                            <label>
                                <input id="bg-img-type-natural" class="background_image_type with-gap" type="radio" name="background_image_type" value="natural">
                                <span><?php Rexbuilder_Utilities::get_icon('#C004-Image-Natural'); ?></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap bl_jc-c">
                    <div id="rex-block-image-position-setting" class="radio-group__wrap">
                        <div>
                            <input id="rex-bm-image-setup-top-left" type="radio" class="image-position small-radio with-gap" name="image-position" value="top-left" />
                            <label for="rex-bm-image-setup-top-left" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Top-Left Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-setup-top-center" type="radio" class="image-position small-radio with-gap" name="image-position" value="top-center" />
                            <label for="rex-bm-image-setup-top-center" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Top-Center Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-setup-top-right" type="radio" class="image-position small-radio with-gap" name="image-position" value="top-right"/>
                            <label for="rex-bm-image-setup-top-right" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Top-Right Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-image-setup-middle-left" type="radio" class="image-position small-radio with-gap" name="image-position" value="middle-left" />
                            <label for="rex-bm-image-setup-middle-left" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Middle-Left Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-setup-middle-center" type="radio" class="image-position small-radio with-gap" name="image-position" value="middle-center" />
                            <label for="rex-bm-image-setup-middle-center" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Middle-Center Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-setup-middle-right" type="radio" class="image-position small-radio with-gap" name="image-position" value="middle-right" />
                            <label for="rex-bm-image-setup-middle-right" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Middle-Right Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-image-setup-bottom-left" type="radio" class="image-position small-radio with-gap" name="image-position" value="bottom-left" />
                            <label for="rex-bm-image-setup-bottom-left" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Bottom-Left Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-setup-bottom-center" type="radio" class="image-position small-radio with-gap" name="image-position" value="bottom-center" />
                            <label for="rex-bm-image-setup-bottom-center" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Bottom-Center Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-image-setup-bottom-right" type="radio" class="image-position small-radio with-gap" name="image-position" value="bottom-right" />
                            <label for="rex-bm-image-setup-bottom-right" class="rex-block-image-position tippy" data-tippy-content="<?php _e('Bottom-Right Image','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
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
                    </div>
                </div>
            </div>
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
        <?php // include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div><!-- Block settings background settings -->