<?php
/**
 * Print the markup of the modals of the builder
 *
 * @link       htto://www.neweb.info
 * @since      1.0.10
 * @version     1.1.2   Add Models windows
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined('ABSPATH') or exit;
?>

<div class="lean-overlay" style="display:none;"></div>
<!-- // .lean-overlay -->

<div id="builder-loading-overlay" style="display:none;position:absolute;width:100%;height:100%;top:0;right:0;background-color:rgba(0,0,0,0.5);z-index:30;">
    <h3 style="color:white;">Loading...</h3>
</div>
<!-- // #builder-loading-overlay -->

<?php include_once( 'modals/rexlive-layout-custom-modal.php' ); ?>

<?php include_once( 'modals/rexlive-css-editor-modal.php' ); ?>
<?php include_once( 'modals/rexlive-html-editor-modal.php' ); ?>

<?php include_once( 'modals/rexlive-video-insert-modal.php' ); ?>

<div class="rex-modal-wrap">
   <div id="rex-edit-background-section" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <div id="section-edit-image-bg" class="background_set_image row valign-wrapper">
                <div class="col">
                    <div class="valign-wrapper">
                        <div class="bg-image-section-active-wrapper">
                            <input type="checkbox" id="image-section-active" value="color" />
                            <label for="image-section-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div id="bg-section-set-img-wrap" class="rex-button-with-plus">
                            <div id="bg-section-img-preview" class="image-preview-logo">
                                <!-- <i class="material-icons rex-icon">p</i> -->
                                <span class="l-icon--white"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
                            </div>
                            <button id="background-section-up-img" class="rex-plus-button l-icon--white btn-floating light-blue darken-1" value="" title="Select Image">
                                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                            </button>
                            <input name="" class="file-path" type="hidden" id="background-section-url" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- /BACKGROUND IMAGE SECTION-->
            <div id="background-section-set-color" class="background_set_color row valign-wrapper">
                <div class="col">
                    <div class="valign-wrapper">
                        <div class="bg-color-section-active-wrapper">
                            <input type="checkbox" id="color-section-active" value="color" />
                            <label for="color-section-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div class="rex-relative-col">
                            <input type="hidden" id="background-section-color-runtime" name="background-section-color-runtime" value="" />
                            <input id="background-section-color" type="text" name="background-section-color" value="" size="10" />
                            <div id="background-section-preview-icon" class="preview-color-icon"></div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div id="bg-section-color-palette" class="clearfix">
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
                                <!-- <i class="material-icons rex-icon">o</i> -->
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /COLOR BACKGROUND SECTION -->
            <div id="bg-overlay-row-set-color" class="background_set_color row valign-wrapper">
                <div class="col">
                    <div class="valign-wrapper">
                        <div class="overlay-active-wrapper">
                            <input type="checkbox" id="overlay-section-active" value="color" />
                            <label for="overlay-section-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div class="rex-relative-col">
                            <div class="section-overlay-preview">
                                <input id="overlay-color-row-value" type="text" name="overlay-color-row-value" value="rgba(255,255,255,0.5)" size="10" />
                                <div id="overlay-row-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div id="bg-overlay-row-color-palette" class="col">
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
                            <input class="bg-palette-value" type="hidden" value="rgba(156,39,176,0.6))" />
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
            <!-- /OVERLAY SECTION -->
        </div>
    </div>
</div>
<!-- Edit Section Background -->

<div class="rex-modal-wrap">
    <div id="video-section-editor-wrapper" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-top-arrow.php'; ?>
        <div class="modal-content">
            <div id="edit-video-row-wrap-1" class="bl_modal-row youtube-insert-wrap video-insert-wrap">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="rex-check rex-check-icon rex-video-type-select tippy" data-tippy-content="<?php _e('Active YouTube','rexpansive'); ?>">
                        <input type="checkbox" class="rex-choose-video bl_checkbox bl_checkbox-bottom-indicator bl_checkbox-big-icon" name="rex-choose-video" value="youtube" id="rex-choose-youtube-video-section" />
                        <label for="rex-choose-youtube-video-section">
                            <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                            <i class="material-icons rex-icon">C</i>
                            <!-- <span class="rex-ripple" /> -->
                        </label>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="youtube">
                    <div class="input-field input-field--small">
                        <input id="rex-youtube-video-section" class="youtube-url" type="text" />
                        <label id="rex-youtube-video-section-label" for="rex-youtube-video-section">https://youtu.be/...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div>
            <!-- youtube video background section -->
            <div id="edit-video-row-wrap-2" class="bl_modal-row vimeo-insert-wrap video-insert-wrap">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="rex-check rex-check-icon rex-video-type-select tippy" data-tippy-content="<?php _e('Active Vimeo','rexpansive'); ?>">
                        <input type="checkbox" class="rex-choose-video bl_checkbox bl_checkbox-bottom-indicator bl_checkbox-big-icon" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo-video-section" />
                        <label for="rex-choose-vimeo-video-section">
                            <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                            <i class="material-icons rex-icon">Z</i>
                            <!-- <span class="rex-ripple" /> -->
                        </label>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="vimeo">
                    <div class="input-field input-field--small">
                        <input id="rex-vimeo-video-section" class="vimeo-url" type="text" />
                        <label id="rex-vimeo-video-section-label" for="rex-vimeo-video-section">https://player.vimeo.com/video/...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div>
            <!-- vimeo input section-->
            <div id="edit-video-row-wrap-3" class="bl_modal-row mp4-insert-wrap video-insert-wrap">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="rex-check rex-check-icon bl_modal__option-fixed-width rex-video-type-select tippy" data-tippy-content="<?php _e('Active Mp4','rexpansive'); ?>">
                        <input type="checkbox" class="rex-choose-video bl_checkbox bl_checkbox-bottom-indicator" name="rex-choose-video" value="mp4" id="rex-choose-mp4-video-section" />
                        <label id="rex-upload-mp4-video-section" for="rex-choose-mp4-video-section">
                            <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                            <i class="material-icons rex-icon">A</i>
                            <!-- <span class="rex-ripple" /> -->
                        </label>
                        <input name="" class="file-path" type="hidden" id="video-section-mp4-url" />
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="mp4">
                    <div class="input-field input-field--small">
                        <input id="rex-mp4-video-section-preview" class="mp4-video-section small-input" type="text" disabled>
                        <label id="rex-mp4-video-section-preview-label" for="rex-mp4-video-section-preview">Video URL</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div>
            <!-- mp4 input section-->
            <!-- video bg section-->
        </div>
        <?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div>

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
            <div class="bl_modal-row">
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
        </div>
    </div>
</div>

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
        </div>
        <?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div>

<!-- Block settings background settings -->
<div class="rex-modal-wrap">
    <div id="rex-block-content-position-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="background-options-area modal-content"> 
            <div id="block-set-class-wrap" class="bl_modal-row">
                <div id="block-content-positions-wrapper" class="bl_modal__option-wrap bl_jc-c">
                    <div class="radio-group__wrap">
                        <div>
                            <input id="rex-bm-content-top-left" type="radio" class="content-position small-radio with-gap" name="content-position" value="top-left" />
                            <label for="rex-bm-content-top-left" class="tippy rex-block-position" data-tippy-content="<?php _e('Top-Left Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-top-center" type="radio" class="content-position small-radio with-gap" name="content-position" value="top-center" />
                            <label for="rex-bm-content-top-center" class="tippy rex-block-position" data-tippy-content="<?php _e('Top-Center Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-top-right" type="radio" class="content-position small-radio with-gap" name="content-position" value="top-right"/>
                            <label for="rex-bm-content-top-right" class="tippy rex-block-position" data-tippy-content="<?php _e('Top-Right Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-content-middle-left" type="radio" class="content-position small-radio with-gap" name="content-position" value="middle-left" />
                            <label for="rex-bm-content-middle-left" class="tippy rex-block-position" data-tippy-content="<?php _e('Middle-Left Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-middle-center" type="radio" class="content-position small-radio with-gap" name="content-position" value="middle-center" />
                            <label for="rex-bm-content-middle-center" class="tippy rex-block-position" data-tippy-content="<?php _e('Middle-Center Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-middle-right" type="radio" class="content-position small-radio with-gap" name="content-position" value="middle-right" />
                            <label for="rex-bm-content-middle-right" class="tippy rex-block-position" data-tippy-content="<?php _e('Middle-Right Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-content-bottom-left" type="radio" class="content-position small-radio with-gap" name="content-position" value="bottom-left" />
                            <label for="rex-bm-content-bottom-left" class="tippy rex-block-position" data-tippy-content="<?php _e('Bottom-Left Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-bottom-center" type="radio" class="content-position small-radio with-gap" name="content-position" value="bottom-center" />
                            <label for="rex-bm-content-bottom-center" class="tippy rex-block-position" data-tippy-content="<?php _e('Bottom-Center Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-bottom-right" type="radio" class="content-position small-radio with-gap" name="content-position" value="bottom-right" />
                            <label for="rex-bm-content-bottom-right" class="tippy rex-block-position" data-tippy-content="<?php _e('Bottom-Right Content','rexpansive'); ?>">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <!-- POSITIONS -->
            </div>
        </div>
        <?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div>
<!-- Block settings background settings -->

<?php include_once( 'modals/rexlive-block-accordion-modal.php' ); ?>
<?php include_once( 'modals/rexlive-block-slideshow-modal.php' ); ?>

<?php include_once( 'modals/rexlive-section-background-gradient-modal.php' ); ?>
<?php include_once( 'modals/rexlive-section-overlay-gradient-modal.php' ); ?>
<?php include_once( 'modals/rexlive-block-background-gradient-modal.php' ); ?>
<?php include_once( 'modals/rexlive-block-overlay-gradient-modal.php' ); ?>
<?php include_once( 'modals/rexlive-text-color-gradient-modal.php' ); ?>

<div class="rex-modal-wrap">
    <div id="video-block-editor-wrapper" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable" data-block_tools="">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <div class="video-block-edit-wrap">
                <div id="edit-video-block-wrap-1" class="bl_modal-row youtube-insert-wrap video-insert-wrap">
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                        <div class="rex-check rex-check-icon rex-video-type-select tippy" data-tippy-content="<?php _e('Active YouTube','rexpansive'); ?>">
                            <input type="checkbox" class="rex-choose-video bl_checkbox bl_checkbox-bottom-indicator bl_checkbox-big-icon" name="rex-choose-video" value="youtube" id="rex-choose-youtube-video-block" />
                            <label for="rex-choose-youtube-video-block">
                                <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                                <i class="material-icons rex-icon">C</i>
                                <!-- <span class="rex-ripple" /> -->
                            </label>
                        </div>
                    </div>
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="youtube">
                        <div class="input-field input-field--small">
                            <input id="rex-youtube-video-block" class="youtube-url" type="text" />
                            <label id="rex-youtube-video-block-label" for="rex-youtube-video-block">https://youtu.be/...</label>
                            <span class="rex-material-bar"></span>
                        </div>
                    </div>
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                        <div class="set-video-audio-btn tippy" data-tippy-content="<?php _e('Audio ON/OFF','rexpansive'); ?>">
                            <input class="video-audio-checkbox bl_checkbox bl_checkbox-bottom-indicator" type="checkbox" id="rex-edit-block-video-youtube-audio" name="block-youtube-audio" title="Audio ON/OFF">
                            <label for="rex-edit-block-video-youtube-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                                <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                                <i class="rex-icon">
                                    <span class="rex-icon-audio bl_checked-icon">L</span><span class="rex-icon-mute bl_unchecked-icon">M</span>
                                </i>
                                <!-- <span class="rex-ripple"></span> -->
                            </label>
                        </div>
                    </div>
                </div>
                <!-- youtube video background block -->
                <div id="edit-video-block-wrap-2" class="bl_modal-row vimeo-insert-wrap video-insert-wrap">
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                        <div class="rex-check rex-check-icon rex-video-type-select tippy" data-tippy-content="<?php _e('Active Vimeo','rexpansive'); ?>">
                            <input type="checkbox" class="rex-choose-video bl_checkbox bl_checkbox-bottom-indicator bl_checkbox-big-icon" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo-video-block" />
                            <label for="rex-choose-vimeo-video-block">
                                <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                                <i class="material-icons rex-icon">Z</i>
                                <!-- <span class="rex-ripple" /> -->
                            </label>
                        </div>
                    </div>
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="vimeo">
                        <div class="input-field input-field--small">
                            <input id="rex-vimeo-video-block" class="vimeo-url" type="text" />
                            <label id="rex-vimeo-video-block-label" for="rex-vimeo-video-block">https://player.vimeo.com/video/...</label>
                            <span class="rex-material-bar"></span>
                        </div>
                    </div>
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                        <div class="set-video-audio-btn tippy" data-tippy-content="<?php _e('Audio ON/OFF','rexpansive'); ?>">
                            <input class="video-audio-checkbox bl_checkbox bl_checkbox-bottom-indicator" type="checkbox" id="rex-edit-block-video-vimeo-audio" name="block-vimeo-audio" title="Audio ON/OFF">
                            <label for="rex-edit-block-video-vimeo-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                                <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                                <i class="rex-icon">
                                    <span class="rex-icon-audio bl_checked-icon">L</span><span class="rex-icon-mute bl_unchecked-icon">M</span>
                                </i>
                                <!-- <span class="rex-ripple"></span> -->
                            </label>
                        </div>
                    </div>
                </div>
                <!-- vimeo input block-->
                <div id="edit-video-block-wrap-3" class="bl_modal-row mp4-insert-wrap video-insert-wrap">
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                        <div class="rex-check rex-check-icon bl_modal__option-fixed-width rex-video-type-select tippy" data-tippy-content="<?php _e('Active Mp4','rexpansive'); ?>">
                            <input type="checkbox" class="rex-choose-video bl_checkbox bl_checkbox-bottom-indicator" name="rex-choose-video" value="mp4" id="rex-choose-mp4-video-block" />
                            <label id="rex-upload-mp4-video-block" for="rex-choose-mp4-video-block">
                                <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                                <i class="material-icons rex-icon">A</i>
                                <!-- <span class="rex-ripple" /> -->
                            </label>
                            <input name="" class="file-path" type="hidden" id="video-block-mp4-url" />
                        </div>
                    </div>
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="mp4">
                        <div class="input-field input-field--small">
                            <input id="rex-mp4-video-block-preview" class="mp4-video-block small-input" type="text" disabled>
                            <label id="rex-mp4-video-block-preview-label" for="rex-mp4-video-block-preview">Video URL</label>
                            <span class="rex-material-bar"></span>
                        </div>
                    </div>
                    <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                        <div class="set-video-audio-btn tippy" data-tippy-content="<?php _e('Audio ON/OFF','rexpansive'); ?>">
                            <input class="video-audio-checkbox bl_checkbox bl_checkbox-bottom-indicator" type="checkbox" id="rex-edit-block-video-mp4-audio" name="block-mp4-audio" title="Audio ON/OFF">
                            <label for="rex-edit-block-video-mp4-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                                <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                                <i class="rex-icon">
                                    <span class="rex-icon-audio bl_checked-icon">L</span><span class="rex-icon-mute bl_unchecked-icon">M</span>
                                </i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <!-- mp4 input block-->
            </div>
            <!-- /VIDEO BACKGROUND BLOCK -->
        </div>
        <?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div>

<?php include_once( 'modals/rexlive-rexslider-insert-edit-modal.php' ); ?>

<div class="rex-modal-wrap">
    <div id="rex-slider__links-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php _e( 'Cancel', 'rexpansive-builder');?>" value="">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content">
            <div id="rex-slider__video-links-wrap" class="rex-modal-content__modal-area">
                <div class="valign-wrapper rex-modal-content__modal-area__row">
                    <div class="col rex-check-icon">
                        <input type="radio" class="rex-slide-choose-video with-gap" name="rex-slide-choose-video" value="youtube" id="rex-slide-choose-video--youtube">
                        <label for="rex-slide-choose-video--youtube">
                            <i class="material-icons rex-icon rex-youtube__icon">C</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div id="" class="col input-field col-spaced--right">
                        <input id="rex-slide__video-youtube" type="text">
                        <label for="rex-slide__video-youtube">https://youtu.be/...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                    <div id="" class="rex-check-icon col col-spaced--right">
                        <input id="rex-slide__video-mp4" type="hidden">
                        <input type="radio" class="rex-slide-choose-video with-gap" name="rex-slide-choose-video" value="mp4" id="rex-slide-choose-mp4">
                        <label for="rex-slide-choose-mp4">
                            <i class="material-icons rex-icon rex-cloud__icon">A</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div id="" class="col rex-check-icon">
                        <input type="checkbox" id="rex-slide__video--audio" name="rex-slide__video--audio" title="Audio ON/OFF">
                        <label for="rex-slide__video--audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                            <i class="rex-icon rex-sound__icon">
                                <span class="rex-icon-audio rex-icon--checked">L</span><span class="rex-icon-mute rex-icon--unchecked">M</span>
                            </i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
                <div class="valign-wrapper rex-modal-content__modal-area__row">
                    <div class="col rex-check-icon">
                        <input type="radio" class="rex-slide-choose-video with-gap" name="rex-slide-choose-video" value="vimeo" id="rex-slide-choose-vimeo">
                        <label for="rex-slide-choose-vimeo" data-tooltip="<?php _e('Vimeo', 'rexpansive-builder');?>">
                            <i class="material-icons rex-icon rex-vimeo__icon">Z</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div class="col input-field">
                        <input id="rex-slide__video-vimeo" type="text">
                        <label for="rex-slide__video-vimeo">https://player.vimeo.com/video/...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div><!-- // video links -->
            <div id="rex-slider__url-links-wrap">
                <div class="rex-modal-content__modal-area">
                    <div class="input-field rex-input-prefixed">
                        <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="Link">l</i>
                        <input type="text" id="rex-slider__slide-url-link" name="rex-slider__slide-url-link" value="" size="30">
                        <label for="rex-slider__slide-url-link">http://www...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div><!-- // url links -->
        </div><!-- // modal content -->
        <!-- <div class="rex-modal-footer">
            <button class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div> -->
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save Content', 'rexpansive' ); ?>" value="">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- //.rex-slider__links-editor -->

<?php include_once( 'modals/rexlive-section-settings-modal.php' ); ?>

<div class="rex-modal-wrap">
    <div id="rexeditor-modal" class="rexbuilder-materialize-wrap outside-content-modal rex-modal-draggable rex-modal">
        <div id="editor-cancel" class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php _e( 'Cancel', 'rexpansive-builder');?>">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content-wrap">
            <div class="modal-editor-header">
                <div class="rexeditor-modal__header__buttons-wrap">
                    <button id="content-position-open-modal" class="btn-floating waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e('Text Position', 'rexpansive-builder');?>">
                        <i class="material-icons rex-icon">E</i>
                    </button>
                    <button id="content-padding-open-modal" class="btn-floating waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e('Padding', 'rexpansive-builder');?>">
                        <i class="material-icons rex-icon">D</i>
                    </button>
                </div>
            </div>
            <div class="modal-content">
                <div class="modal-editor-editorarea">
                <?php wp_editor('', 'rexbuilder_editor', array('textarea_rows' => 20, 'wpautop' => false, 'editor_height' => 250));?>
                </div>
            </div>
            <!-- <div class="rexeditor_bottom rex-modal-footer clearfix">
                <button id="editor-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                    <i class="rex-icon">n</i>
                </button>
                <button id="editor-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                    <i class="rex-icon">m</i>
                </button>
            </div> -->
        </div>
        <div class="rex-modal__outside-footer">
            <div id="editor-save" class="tool-button tool-button--inline tool-button--save rex-save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save Content', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div><!-- Text Editor -->

<?php include_once( 'modals/rexlive-model-add-modal.php' ); ?>
<?php include_once( 'modals/rexlive-model-edit-modal.php' ); ?>
<?php include_once( 'modals/rexlive-model-edit-name-modal.php' ); ?>
<?php include_once( 'modals/rexlive-model-save-modal.php' ); ?>

<?php include_once( 'modals/rexlive-change-layout-modal.php' ); ?>
<?php include_once( 'modals/rexlive-resynch-content-modal.php' ); ?>

<?php include_once( 'modals/rexlive-delete-model-modal.php' ); ?>

<div class="rex-modal-wrap">
    <div id="rexlive-onbeforeunload" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black rex-change-layout-option tool-button--close tippy" data-position="bottom" data-tippy-content="<?php _e( 'Cancel', 'rexpansive-builder');?>" data-rex-option="hide">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <div class="layout-page-changed-description">
                <b><?php _e( 'Warning', 'rexpansive-builder' ); ?></b><br>
                <?php _e( 'Before closing the window/change page, verify that you saved the project', 'rexpansive-builder' ); ?>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-change-layout-option tippy" data-tippy-content="<?php _e('Yes and Continue','rexpansive'); ?>" data-rex-option="saveandclose">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
            <div class="tool-button tool-button--inline tool-button--cancel tool-button--modal rex-change-layout-option tippy" data-rex-option="cancandclose" data-tippy-content="<?php _e('No and Continue','rexpansive'); ?>">
                <span class="rex-button continue btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
            </div>
        </div>
    </div>
</div> <!-- Layout OnBeforeUnload Popup -->

<?php include_once( 'modals/rexlive-inline-video-modal.php' ); ?>
<?php include_once( 'modals/rexlive-inline-svg-modal.php' ); ?>

<div class="rex-modal-wrap">
    <div id="rex-locked-option" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--inline rex-locked-option-wrapper tool-button--black tool-button--close rex-close-button tippy" data-tippy-content="<?php _e('Close','rexpansive'); ?>">
            <span class="rex-button abort"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <div class="locked-option-changed-description">
                <?php _e('This feature is not avaiable until saved.','rexpansive'); ?>
                <?php _e('Warning! Once you have saved from live, you can not edit from backend.','rexpansive'); ?>
            </div>
            <!-- <div>
                <div class="rex-locked-option-wrapper" data-rex-option="save">
                    <button class="rex-button save-page">save</button>
                </div>
                <div class="rex-locked-option-wrapper" data-rex-option="abort">
                    <button class="rex-button abort">cancel</button>
                </div>
            </div> -->
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button rex-locked-option-wrapper tool-button--inline tool-button--save tippy" data-tippy-content="<?php _e('Save and continue','rexpansive'); ?>" data-rex-option="save">
                <span class="rex-button save-page"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
        </div>
    </div>
</div><!-- Locked feature -->

<?php include_once( 'modals/rexlive-lateral-panel.php' ); ?>
<?php include_once( 'modals/rexlive-button-editor-modal.php' ); ?>
<?php include_once( 'modals/rexlive-button-edit-model-modal.php' ); ?>
<?php include_once( 'modals/rexlive-element-choose-modal.php' ); ?>
<?php include_once( 'modals/rexlive-wpcf7-content-adder-modal.php' ); ?>
<?php include_once( 'modals/rexlive-wpcf7-content-editor-modal.php' ); ?>
<?php include_once( 'modals/rexlive-wpcf7-form-editor-modal.php' ); ?>

<div class="rex-modal-wrap">
    <div id="rex-add-button-name-modal" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content modal-content--text">
            <div class="add-button-name-model">
                <?php _e('I need a name for the new button','rexpansive'); ?>
                <br>
                <span class="info-model-name__wrap"><span class="info-model-name"></span>&nbsp;<span>?</span></span>
            </div>
            <div>
                <div id="rex-button-name-model-wrap" class="input-field col rex-input-prefixed rex-input-prefixed--no-prefix">
                    <span class="prefix"></span>
                    <input type="text" id="rex-button__name_model" name="rex-button__name_model">
                    <label for="rex-button__name_model" class=""><?php _e('Title name model button', 'rexpansive');?></label>
                    <span class="rex-material-bar"></span>
                </div>
                <div id="rex-button-name-add-model-wrap" class="add-rex-name-button-model">
                    <div class="add-label">+</div>
                </div>
            </div>
        </div>
    </div>
</div><!-- Add button name Model  -->

<?php include_once( 'modals/rexlive-page-settings-modal.php' ); ?>

<div class="rex-modal-wrap">
    <div id="rex-live-media-list" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div id="rex-live-media-list__wrap" class="rex-modal-content__modal-area"></div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="media-gallery__add-item__wrap rex-modal-content__modal-area--bordered">
                    <button id="media-gallery__add-new-item" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Add item', 'rexpansive-builder' ) ?>">
                        <i class="material-icons text-white">&#xE145;</i>
                    </button>
                </div><!-- // .rex-slider__add-slide__wrap -->
            </div>
        </div>
    </div>
</div>
