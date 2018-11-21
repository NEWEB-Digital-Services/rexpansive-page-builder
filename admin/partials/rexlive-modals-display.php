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

<div class="rex-modal-wrap">
    <div id="rex-css-editor" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable setting-edited">
        <div id="css-editor-cancel" class="tool-button tool-button--inline tool-button--black tool-button--close rex-cancel-button tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive' ); ?>">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </div>
        <div class="modal-content">
            <div id="rex-css-ace-editor" class="rex-ace-editor"></div>
        </div>
        <div class="rex-modal__outside-footer">
            <div id="css-editor-save" class="tool-button tool-button--inline tool-button--save rex-save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- CSS Editor -->

<div class="rex-modal-wrap">
    <div id="rex-html-text-editor" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable setting-edited">
        <div class="tool-button tool-button--inline tool-button--black tool-button--close rex-modal__close-button tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive' ); ?>">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </div>
        <div class="modal-content">
            <div id="rex-html-ace-editor" class="rex-ace-editor"></div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-modal__save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- HTML Editor -->

<div class="rex-modal-wrap">
    <div id="rex-insert-new-video-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <div id="insert-video-block-wrap-1" class="bl_modal-row youtube-insert-wrap video-insert-wrap">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="rex-check rex-check-icon rex-video-type-select tippy" data-tippy-content="<?php _e('Insert YouTube','rexpansive'); ?>">
                        <input type="radio" class="rex-choose-video bl_radio-big-icon bl_radio bl_radio-bottom-indicator" name="rex-choose-video" value="youtube" id="rex-choose-youtube-video">
                        <label for="rex-choose-youtube-video">
                            <span class="bl_radio-indicator"></span>
                            <i class="material-icons rex-icon">C</i>
                            <!-- <span class="rex-ripple"></span> -->
                        </label>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="youtube">
                    <div class="input-field input-field--small">
                        <input id="rex-insert-youtube-url" class="youtube-url small-input" type="text">
                        <label id="rex-insert-youtube-url-label" for="rex-insert-youtube-url">https://youtu.be/...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="set-video-audio-btn tippy" data-tippy-content="<?php _e('Audio ON/OFF','rexpansive'); ?>">
                        <input class="video-audio-checkbox bl_checkbox bl_checkbox-bottom-indicator" type="checkbox" id="rex-new-block-video-youtube-audio" name="block-youtube-audio" title="Audio ON/OFF">
                        <label for="rex-new-block-video-youtube-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                            <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                            <i class="rex-icon">
                                <span class="rex-icon-audio bl_checked-icon">L</span><span class="rex-icon-mute bl_unchecked-icon">M</span>
                            </i>
                            <!-- <span class="rex-ripple"></span> -->
                        </label>
                    </div>
                </div>
                <!-- youtube input -->
            </div>
            <div id="insert-video-block-wrap-2" class="bl_modal-row vimeo-insert-wrap video-insert-wrap">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="rex-check rex-check-icon rex-video-type-select tippy" data-tippy-content="<?php _e('Insert Vimeo','rexpansive'); ?>">
                        <input type="radio" class="rex-choose-video bl_radio-big-icon bl_radio bl_radio-bottom-indicator" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo-video">
                        <label for="rex-choose-vimeo-video">
                            <span class="bl_radio-indicator"></span>
                            <i class="material-icons rex-icon">Z</i>
                            <!-- <span class="rex-ripple"></span> -->
                        </label>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="vimeo">
                    <div class="input-field input-field--small">
                        <input id="rex-insert-vimeo-url" class="vimeo-url small-input" type="text">
                        <label id="rex-insert-vimeo-url-label" for="rex-insert-vimeo-url">https://player.vimeo.com/video/...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="set-video-audio-btn tippy" data-tippy-content="<?php _e('Audio ON/OFF','rexpansive'); ?>">
                        <input class="video-audio-checkbox bl_checkbox bl_checkbox-bottom-indicator" type="checkbox" id="rex-new-block-video-vimeo-audio" name="block-vimeo-audio" title="Audio ON/OFF">
                        <label for="rex-new-block-video-vimeo-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                        <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                            <i class="rex-icon">
                                <span class="rex-icon-audio bl_checked-icon">L</span><span class="rex-icon-mute bl_unchecked-icon">M</span>
                            </i>
                            <!-- <span class="rex-ripple"></span> -->
                        </label>
                    </div>
                </div>
                <!-- vimeo input -->
            </div>
            <div id="insert-video-block-wrap-3" class="bl_modal-row mp4-insert-wrap video-insert-wrap">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="rex-check rex-check-icon bl_modal__option-fixed-width rex-video-type-select tippy" data-tippy-content="<?php _e('Insert Mp4','rexpansive'); ?>">
                        <input type="radio" class="rex-choose-video bl_radio bl_radio-bottom-indicator" name="rex-choose-video" value="mp4" id="rex-choose-mp4-video">
                        <label id="rex-upload-mp4-video" for="rex-choose-mp4">
                            <span class="bl_radio-indicator"></span>
                            <i class="material-icons rex-icon">A</i>
                            <!-- <span class="rex-ripple"></span> -->
                        </label>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border" data-rex-video-type="mp4">
                    <div class="input-field input-field--small">
                        <input id="rex-insert-mp4-url" class="mp4-url small-input" type="text" disabled>
                        <label id="rex-insert-mp4-url-label" for="rex-insert-mp4-url">Video URL</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
                <div class="bl_modal__option-wrap bl_modal__option-wrap--no-border bl_modal__option-wrap--fluid">
                    <div class="set-video-audio-btn tippy" data-tippy-content="<?php _e('Audio ON/OFF','rexpansive'); ?>">
                        <input class="video-audio-checkbox bl_checkbox bl_checkbox-bottom-indicator" type="checkbox" id="rex-new-block-video-mp4-audio" name="block-mp4-audio" title="Audio ON/OFF">
                        <label for="rex-new-block-video-mp4-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                        <span class="bl_check-indicator--wrap"><span class="bl_check-indicator"></span></span>
                            <i class="rex-icon">
                                <span class="rex-icon-audio bl_checked-icon">L</span><span class="rex-icon-mute bl_unchecked-icon">M</span>
                            </i>
                            <!-- <span class="rex-ripple"></span> -->
                        </label>
                    </div>
                </div>
                <!-- mp4 input -->
            </div>
        </div>
        <!-- <div class="rex-modal-footer"> -->
            <!-- <button id="rex-insert-video-block-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button> -->
            <!-- <button id="rex-insert-video-block-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button> -->
        <!-- </div> -->
        <div class="rex-modal__outside-footer">
            <div id="rex-insert-video-block-save" class="tool-button tool-button--inline tool-button--save rex-save-button tippy" data-tippy-content="<?php esc_attr_e( 'Insert Video', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div><!-- Insert New Block Video -->

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
        <div class="background-options-area modal-content">
            <div id="block-edit-image-setting-bg" class="background_set_image bl_modal-row">
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

<!-- Block Accordion -->
<div class="rex-modal-wrap">
    <div id="rex-block-accordion-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content"> 
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="bl_switch tippy" data-tippy-content="<?php _e('closed/open','rexpansive'); ?>">
                        <label>
                            <input class="rex-accordion-open-close-val" name="rex-accordion-open-close-val" type="checkbox">
                            <span class="lever"></span>
                            <span class="bl_switch__icon">
                                <span class="bl_switch__icon--checked"><?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?></span>
                                <span class="bl_switch__icon--unchecked"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
                            </span>
                        </label>
                    </div><!-- // Accordion open/closed -->
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="modal-editor-editorarea">
                        <?php wp_editor('', 'rex-accordion-header-val', array('textarea_rows' => 20, 'wpautop' => false, 'editor_height' => 150));?>
                    </div>
                </div>
            </div>
            <div class="bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div class="modal-editor-editorarea">
                        <?php wp_editor('', 'rex-accordion-content-val', array('textarea_rows' => 20, 'wpautop' => false, 'editor_height' => 150));?>
                    </div>
                </div>
                <div class="bl_modal__option-wrap">
                    <div>
                        <span class="tool-button rex-accordion-content-gallery"><?php Rexbuilder_Utilities::get_icon('#C005-Layout'); ?></span>
                    </div>
                    <div class="rex-accordion-content-gallery__preview">
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-modal__save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
        <?php // include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-bottom-arrow.php'; ?>
    </div>
</div>
<!-- Block Accordion -->

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

<div class="rex-modal-wrap">
    <div id="rex-slider-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <?php include 'rexbuilder-modal-loader.php';?>
            <div class="rex-slider__import--wrap rex-modal-content__modal-area--bordered">
            <?php
            // WP_Query arguments
            $args = array(
                'post_type' => array('rex_slider'),
                'post_status' => array('publish'),
                'posts_per_page' => '-1',
            );
            // The Query
            $query = new WP_Query($args);
            ?>
                <div class="bl_d-flex bl_ai-c bl_jc-sb bl_rex-slider__list-wrap">
                    <div class="bl_rex-slider__list-icon">
                        <div class="tool-button tool-button--inline tool-button--flat" data-tippy-content="<?php esc_attr_e( 'Models', 'rexpansive' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#A012-Models-List'); ?>
                        </div>
                    </div>
                    <div class="rx__select-wrap">
                        <select id="rex-slider__import" class="rx__form-input">
                            <option value="0"><?php _e('Copy from sliders', 'rexpansive-classic');?></option>
                            <?php
                            // Printing all sliders avaiable
                            if ($query->have_posts()) {
                                while ($query->have_posts()) {
                                    $query->the_post();
                                    ?>
                            <option value="<?php the_ID();?>" data-rex-slider-title="<?php the_title(); ?>"><?php _e('Copy from ','rexpansive'); ?>"<?php the_title();?>"</option>
                            <?php
                                }
                            } else {
                                // no posts found
                            }
                            ?>
                        </select>
                        <div class="rx__form-input__select-arrow">
                            <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
                        </div>
                    </div>
                    <?php
                        // Restore original Post Data
                        wp_reset_postdata();
                    ?>
                </div>
            </div>
            <div class="rex-slider__import--wrap rex-modal-content__modal-area rex-modal-content__modal-area--bordered">
                <div class="input-field input-field--small bl_d-flex bl_ai-c">
                    <input class="title-slider" type="text" value="<?php _e('New Slider','rexpansive'); ?>" disabled>
                    <div class="rex_edit_title_slider">
                        <span id="edit_slider_title_live_btn"><?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?></span>
                    </div>
                </div>
                <!-- <div class="rex_edit_slider_title_toolbox">
                    <div class="rex_edit_title_slider">
                        <button id="edit_slider_title_btn">e</button>
                    </div>
                    <div class="rex_save_title_slider">
                        <button id="save_slider_title_btn">s</button>
                    </div>
                    <div class="rex_cancel_title_slider">
                        <button id="cancel_slider_title_btn">c</button>
                    </div>
                </div> -->
            </div>
            <div class="rex-slider__slide-list rex-modal-content__modal-area">
                <div class="col rex-slider__slide rex-modal-content__modal-area__row" data-slider-slide-id="0" data-block_type="slide">
                    <div class="valign-wrapper space-between-wrapper">
                        <button class="rex-slider__slide-index btn-circle btn-small btn-bordered grey-border border-darken-2 waves-effect waves-light white grey-text text-darken-2">1</button>
                        <div class="rex-button-with-plus">
                            <button class="rex-slider__slide-edit rex-slider__slide__image-preview btn-floating waves-effect waves-light tippy grey darken-2" value="edit-slide" data-position="bottom" data-tippy-content="<?php _e('Slide', 'rexpansive-classic');?>">
                                <i class="material-icons rex-icon">p</i>
                            </button>
                            <button class="rex-slider__slide-edit rex-plus-button btn-floating light-blue darken-1 tippy" value="add-slide" data-position="bottom" data-tippy-content="<?php _e('Select Image', 'rexpansive-classic');?>">
                                <i class="material-icons">&#xE145;</i>
                            </button>
                        </div>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tippy grey darken-2" value="text" data-position="bottom" data-tippy-content="<?php _e('Text', 'rexpansive-classic');?>">
                            <i class="material-icons rex-icon">u</i>
                        </button>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tippy grey darken-2" value="video" data-position="bottom" data-tippy-content="<?php _e('Video', 'rexpansive-classic');?>">
                            <i class="material-icons">play_arrow</i>
                        </button>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tippy grey darken-2" value="url" data-position="bottom" data-tippy-content="<?php _e('Link', 'rexpansive-classic');?>">
                            <i class="material-icons rex-icon">l</i>
                        </button>
                        <div>
                            <button class="rex-slider__slide-edit btn-flat tippy" data-position="bottom" value="copy" data-tippy-content="<?php _e('Copy slide', 'rexpansive-classic');?>">
                                <i class="material-icons grey-text text-darken-2">&#xE14D;</i>
                            </button>
                            <div class="rex-slider__slide-edit btn-flat tippy" data-position="bottom" value="move" data-tippy-content="<?php _e('Move slide', 'rexpansive-classic');?>">
                                <i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
                            </div>
                            <button class="rex-slider__slide-edit btn-flat tippy" value="delete" data-position="bottom" data-tippy-content="<?php _e('Delete slide', 'rexpansive-classic');?>">
                                <i class="material-icons grey-text text-darken-2">&#xE5CD;</i>
                            </button>
                        </div>
                    </div>
                    <div class="rex-slider__slide-data" style="display:none;">
                        <input type="hidden" name="rex-slider--slide-id" value="">
                        <textarea rows="" cols="" name="rex-slider--slide-text"></textarea>
                        <input type="hidden" name="rex-slider--slide-video-url" value="">
                        <input type="hidden" name="rex-slider--slide-video-type" value="">
                        <input type="hidden" name="rex-slider--slide-url" value="">
                        <input type="hidden" name="rex-slider--slide-video-audio" value="">
                    </div>
                </div>
                <!-- Here goes other slides -->
            </div>
            <div class="rex-slider__add-slide__wrap rex-modal-content__modal-area--bordered">
                <button id="rex-slider__add-new-slide" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tippy" data-position="bottom" data-tippy-content="<?php _e('Add slide', 'rexpansive-classic')?>">
                    <i class="material-icons text-white">&#xE145;</i>
                </button>
            </div>
            <!-- // .rex-slider__add-slide__wrap -->
            <div class="rex-slider__settings--wrap rex-modal-content__modal-area">
                <div class="col">
                    <div class="valign-wrapper space-between-wrapper">
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__autostart" name="rex-slider__autostart" title="<?php _e('Autostart', 'rexpansive-classic');?>">
                            <label for="rex-slider__autostart" class="tippy" data-position="bottom" data-tippy-content="<?php _e('Autostart', 'rexpansive-classic');?>">
                                <i class="rex-icon">J</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__prev-next" name="rex-slider__prev-next" title="<?php _e('Prev Next', 'rexpansive-classic');?>">
                            <label for="rex-slider__prev-next" class="tippy" data-position="bottom" data-tippy-content="<?php _e('Prev Next', 'rexpansive-classic');?>">
                                <i class="rex-icon">K</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__dots" name="rex-slider__dots" title="<?php _e('Dots', 'rexpansive-classic');?>">
                            <label for="rex-slider__dots" class="tippy" data-position="bottom" data-tippy-content="<?php _e('Dots', 'rexpansive-classic');?>">
                                <i class="rex-icon">Y</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="rex-modal-footer">
            <button id="" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div> -->
        <div class="rex-modal__outside-footer">
            <div id="rex-insert-video-block-save" class="tool-button tool-button--inline tool-button--save rex-save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save Slider', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
            <div class="tool-button tool-button--inline tool-button--cancel tool-button--modal rex-undo-button tippy" data-tippy-content="<?php esc_attr_e( 'Undo', 'rexpansive' ); ?>" data-slider-to-edit="">
                <?php Rexbuilder_Utilities::get_icon('#A003-Undo'); ?>
            </div>
        </div>
    </div>
</div>
<!-- Insert RexSlider -->

<div class="rex-modal-wrap">
    <div id="rex-slider__links-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php _e( 'Cancel', 'rexspansive');?>" value="">
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
                        <label for="rex-slide-choose-vimeo" data-tooltip="<?php _e('Vimeo', 'rexpansive-classic');?>">
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

<div class="rex-modal-wrap">
    <div id="modal-background-responsive-set" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button('Close'); ?>
        <?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/rexlive-modals-top-arrow.php'; ?>
        <div class="modal-content section-width-wrapper">
            <div id="section-config-first-row" class="bl_modal-row">
                <div class="rex-edit-layout-wrap bl_modal__option-wrap bl_modal__col-4">
                    <div class="rexlive-layout-type bl_modal__single-option tippy" data-rex-layout="fixed" data-tippy-content="<?php _e( 'Grid', 'rexpansive' ); ?>" style="display:none;">
                        <label>
                            <input type="radio" id="section-fixed" name="section-layout" class="builder-edit-row-layout with-gap" value="fixed" checked title="Grid Layout" />
                            <span><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span>
                        </label>
                    </div>
                    <div class="rexlive-layout-type bl_modal__single-option tippy" data-rex-layout="masonry" data-tippy-content="<?php _e( 'Masonry', 'rexpansive' ); ?>" style="display:none;">
                        <label>
                            <input type="radio" id="section-masonry" name="section-layout" class="builder-edit-row-layout with-gap" value="masonry" title="Masonry Layout" />
                            <span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span>
                        </label>
                    </div>
                    <div class="bl_switch tippy" data-tippy-content="<?php _e('Grid off/on','rexpansive'); ?>">
                        <label>
                            <input class="builder-edit-row-layout-checkbox" name="builder-edit-row-layout-checkbox" type="checkbox">
                            <span class="lever"></span>
                            <span class="bl_switch__icon"><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span>
                        </label>
                    </div><!-- // Row grid on/off -->
                </div><!-- Grid fixed or masonry -->

                <div class="layout-wrap rex-edit-row-width rex-edit-row-width-wrapper bl_modal__option-wrap bl_modal__col-4 bl_jc-c">
                    <div class="rexlive-section-width bl_modal__single-option tippy" data-rex-section-width="full" data-tippy-content="<?php _e( 'Full', 'rexpansive' ); ?>">
                        <label>
                            <input type="radio" id="section-full-modal" name="section-dimension-modal" class="builder-edit-row-dimension-modal with-gap" value="full" title="Full" />
                            <span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
                        </label>
                    </div>
                    <div class="rexlive-section-width bl_modal__single-option tippy" data-rex-section-width="boxed" data-tippy-content="<?php _e( 'Boxed', 'rexpansive' ); ?>">
                        <label>
                            <input id="section-boxed-modal" type="radio" name="section-dimension-modal" class="builder-edit-row-dimension-modal with-gap" value="boxed" title="Boxed" />
                            <span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
                        </label>
                        
                    </div>
                </div><!-- Full section width or boxed -->

                <div class="bl_modal__option-wrap bl_modal__col-4">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed bl_modal__input-prefixed--small tippy" data-tippy-content="<?php _e('Boxed Width', 'rexpansive');?>">
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
                        <input type="text" id="" class="section-set-boxed-width" name="section-set-boxed-width" value="0000" placeholder="" size="23">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="section-set-boxed-width-wrap">
                        <div class="rex-check-text percentage-width boxed-width-type-wrap" data-rex-section-width-type="%">
                            <input id="block-width-percentage" type="radio" class="section-width-type with-gap" name="section-width-type" value="percentage" checked />
                            <label for="block-width-percentage">
                                <?php _e('%', 'rexpansive');?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-text pixel-width boxed-width-type-wrap" data-rex-section-width-type="px">
                            <input id="block-width-pixel" type="radio" class="section-width-type with-gap" name="section-width-type" value="pixel" />
                            <label for="block-width-pixel">
                                <?php _e('PX', 'rexpansive');?>
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
                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Top', 'rexpansive' ); ?>">
                                <input type="text" size="5" id="row-margin-top" class="block-padding-values" name="row-margin-top" value=""
                                    placeholder="0" />
                                <span class="bl_input-indicator">px</span>
                            </div><!-- // row margin top -->
                        </div>
                        <div class="bl_d-flex bl_ai-c bl_jc-sb">
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Left', 'rexpansive' ); ?>">
                                    <input type="text" size="5" id="row-margin-left" class="block-padding-values" name="row-margin-left" value=""
                                        placeholder="0" />
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- // row margin left -->
                            </div>
                            <div class="rex-live__row-padding-wrap">
                                <div class="bl_d-flex bl_jc-c">
                                    <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Top', 'rexpansive' ); ?>">
                                        <input type="text" size="5" id="row-separator-top" class="block-padding-values" name="row-separator-top"
                                            value="" placeholder="" />
                                        <span class="bl_input-indicator">px</span>
                                    </div><!-- // row padding top -->
                                </div>
                                <div class="bl_d-flex bl_ai-c bl_jc-sb">
                                    <div>
                                        <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Left', 'rexpansive' ); ?>">
                                            <input type="text" size="5" id="row-separator-left" class="block-padding-values" name="row-separator-left"
                                                value="" placeholder="" />
                                            <span class="bl_input-indicator">px</span>
                                        </div><!-- // row padding left -->
                                    </div>
                                    <div class="rex-live__row-gutter-wrap bl_d-flex bl_jc-c bl_ai-c">
                                        <div class="rex-live__gutter-wrap--xaxis"></div>
                                        <div class="rex-live__row-gutter bl_d-flex bl_jc-c bl_ai-c">
                                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Gutter', 'rexpansive' ); ?>">
                                                <input type="text" size="5" id="" class="section-set-block-gutter block-padding-values" name="section-set-block-gutter"
                                                    value="" placeholder="" size="15">
                                                <span class="bl_input-indicator">px</span>
                                            </div><!-- // row gutter -->
                                        </div>
                                        <div class="rex-live__gutter-wrap--yaxis"></div>
                                    </div>
                                    <div>
                                        <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Right', 'rexpansive' ); ?>">
                                            <input type="text" size="5" id="row-separator-right" class="block-padding-values" name="row-separator-right"
                                                value="" placeholder="" />
                                            <span class="bl_input-indicator">px</span>
                                        </div><!-- // row padding right -->
                                    </div>
                                </div>
                                <div class="bl_d-flex bl_jc-c">
                                    <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Bottom', 'rexpansive' ); ?>">
                                        <input type="text" size="5" id="row-separator-bottom" class="block-padding-values" name="row-separator-bottom"
                                            value="" placeholder="" />
                                        <span class="bl_input-indicator">px</span>
                                    </div><!-- // row paddig bottom -->
                                </div>
                            </div>
                            <div>
                                <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Right', 'rexpansive' ); ?>">
                                    <input type="text" size="5" id="row-margin-right" class="block-padding-values" name="row-margin-right" value=""
                                        placeholder="0" />
                                    <span class="bl_input-indicator">px</span>
                                </div><!-- //row margin right -->
                            </div>
                        </div>
                        <div class="bl_d-flex bl_jc-c">
                            <div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Bottom', 'rexpansive' ); ?>">
                                <input type="text" size="5" id="row-margin-bottom" class="block-padding-values" name="row-margin-bottom" value=""
                                    placeholder="0" />
                                <span class="bl_input-indicator">px</span>
                            </div><!-- //row margin bottom -->
                        </div>
                    </div><!-- // row padding, gutter, margin new -->
                </div>
                <div class="bl_modal__option-wrap">
                    <div>
                        <div id="bg-set-full-section" class="rex-check-icon bl_modal__single-option--vertical tippy" data-tippy-content="<?php _e( 'Full Height', 'rexpansive' ); ?>">
                            <label>
                                <input type="checkbox" id="section-is-full" name="section-is-full" value="full-height">
                                <span>
                                    <?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>
                                    <span class="bl_input-indicator">100%</span>
                                </span>
                            </label>
                        </div>
                        <div id="bg-set-photoswipe" class="rex-check-icon bl_modal__single-option--vertical tippy" data-tippy-content="<?php _e( 'All Images Zoom', 'rexpansive' ); ?>">
                            <label>
                                <input type="checkbox" id="section-active-photoswipe" name="section-active-photoswipe" title="<?php _e('All Images Zoom', 'rexpansive');?>">
                                <span>
                                    <?php Rexbuilder_Utilities::get_icon('#Z007-Zoom'); ?>
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
                                    <?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>
                                    <span class="bl_input-indicator">100%</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div id="bg-set-photoswipe" class="b-col b--border-right rex-check-icon">
                    <label>
                        <input type="checkbox" id="section-active-photoswipe" name="section-active-photoswipe" title="<?php _e('All Images Zoom', 'rexpansive');?>">
                        <span>
                            <?php Rexbuilder_Utilities::get_icon('#Z007-Zoom'); ?>
                        </span>
                    </label>
                </div>

                <div id="rx-set-hold-grid" class="b-col">
                    <div id="rx-hold-grid__wrap" class="rex-check-icon col">
                        <input type="checkbox" id="rx-hold-grid" name="rx-hold-grid" value="full-height">
                        <label for="rx-hold-grid" class="tooltipped" data-position="bottom" data-tooltip="<?php // _e('Grid On Mobile', 'rexpansive');?>">
                            <i class="rex-icon">V</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>

            </div> -->

            <div class="id-class-row-wrap bl_modal-row">
                <div class="bl_modal__option-wrap">
                    <div id="rex-config-id" class="input-field rex-input-prefixed tippy"  data-tippy-content="<?php _e( 'Section Name', 'rexpansive' ); ?>">
                        <!-- <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e('Section Name', 'rexpansive');?>">B</i> -->
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#B013-Row-ID'); ?></span>
                        <input type="text" id="sectionid-container" class="small-input" name="sectionid-container">
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
                <div class="bl_modal__option-wrap">
                    <div id="section-set-class-wrap" class="input-field rex-input-prefixed tippy"  data-tippy-content="<?php _e( 'Custom Classes', 'rexpansive' ); ?>">
                        <!-- <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e('Custom Class', 'rexpansive');?>">e</i> -->
                        <span class="prefix"><?php Rexbuilder_Utilities::get_icon('#A008-Code'); ?></span>
                        <input type="text" id="section-set-custom-class" name="section-set-custom-class" class="small-input" value="" size="10">
                        <label for="section-set-custom-class">
                            <?php _e('Classes', 'rexpansive');?>
                        </label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div><!-- custom classes -->
        </div>
    </div>
</div><!-- Section settings -->

<div class="rex-modal-wrap">
    <div id="rexeditor-modal" class="rexbuilder-materialize-wrap outside-content-modal rex-modal-draggable rex-modal">
        <div id="editor-cancel" class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php _e( 'Cancel', 'rexspansive');?>">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content-wrap">
            <div class="modal-editor-header">
                <div class="rexeditor-modal__header__buttons-wrap">
                    <button id="content-position-open-modal" class="btn-floating waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e('Text Position', 'rexspansive');?>">
                        <i class="material-icons rex-icon">E</i>
                    </button>
                    <button id="content-padding-open-modal" class="btn-floating waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e('Padding', 'rexspansive');?>">
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

<div class="rex-modal-wrap">
    <div id="rex-model-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="Cancel" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content">

            <?php include 'rexbuilder-modal-loader.php';?>

            <div class="rex-model__add-model__wrap rex-modal-content__modal-area" style="display:flex;">
                <div id="rex-model__name__wrap" class="input-field col rex-input-prefixed rex-input-prefixed--no-prefix" style="width:100%;">
                    <span class="prefix"></span>
                    <input type="text" id="rex-model__name" name="rex-model__name">
                    <label for="rex-model__name" class=""><?php _e('Model name', 'rexpansive');?></label>
                    <span class="rex-material-bar"></span>
                </div>
            </div><!-- // .rex-model__add-model__wrap -->

        </div>

        <div class="rex-modal__outside-footer">
            <div id="rex-model__add-new-model" class="tool-button tool-button--inline tool-button--save tippy" data-tippy-content="<?php esc_attr_e( 'Create Model', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div><!-- RexModel modal -->

<div class="rex-modal-wrap">
    <div id="rex-edit-model-choose" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content modal-content--text">
            <div class="edit-model-description">
                <?php _e('What kind of editing do you want to make to the model:','rexpansive'); ?>
                <br>
                <span class="info-model-name__wrap"><span class="info-model-name"></span>&nbsp;<span>?</span></span>
            </div>
            <!-- <div>
                <div class="rex-edit-model-option" data-rex-option="edit">
                    <button class="rex-button edit-model">Edita</button>
                </div>
                <div class="rex-edit-model-option" data-rex-option="remove">
                    <button class="rex-button remove-model">Togli</button>
                </div>
            </div> -->
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button--double-icon--wrap tool-button--double-icon--active tool-button--double-icon--big rex-button edit-model rex-edit-option tippy" data-tippy-content="<?php esc_attr_e( 'Edit synchronized model', 'rexpansive' ); ?>" data-rex-option="edit">
                <div class="tool-button tool-button--inline tool-button--blue tool-button--modal">
                    <?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--black tool-button--double-icon">
                    <?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?>
                </div>
            </div>

            <div class="tool-button tool-button--inline tool-button--modal tool-button--blue rex-button remove-model rex-edit-option tippy" data-tippy-content="<?php esc_attr_e( 'Edit removing sync', 'rexpansive' ); ?>" data-rex-option="remove">
                <?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?>
            </div>
        </div>
    </div>
</div><!-- Edit Model  -->

<div class="rex-modal-wrap">
    <div id="rex-open-models-warning" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content modal-content--text">
            <div class="open-models-message">
                <?php _e( "Warning, there are some models open.", 'rexpansive' ); ?>
                <br>
                <?php _e( "Close them before save:", 'rexpansive'); ?>
                <br><br>
                <div class="open-models-list"></div>
            </div>
        </div>
    </div>
</div><!-- Edit Model  -->

<div class="rex-modal-wrap">
    <div id="rex-layout-page-changed" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black rex-change-layout-option tool-button--close tippy" data-position="bottom" data-tippy-content="<?php _e( 'Cancel', 'rexspansive');?>" data-rex-option="abort">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <div class="layout-page-changed-description">
                <?php _e( 'Save changes', 'rexpansive-builder' ); ?>:
                <span class="layout-name__wrap"><span class="layout-name"></span><span>&nbsp;?</span></span>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-change-layout-option tippy" data-tippy-content="<?php _e('Yes and Continue','rexpansive'); ?>" data-rex-option="save">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
            <div class="tool-button tool-button--inline tool-button--cancel tool-button--modal rex-change-layout-option tippy" data-rex-option="continue" data-tippy-content="<?php _e('No and Continue','rexpansive'); ?>">
                <span class="rex-button continue btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
            </div>
        </div>
    </div>
</div><!-- Layout page Changed -->

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

<!-- <div class="rex-modal-wrap" style="width:500px;overflow:visible;left:70%;"> -->
    <div id="rex-models-list" class="rex-lateral-panel">
        <div class="rex-lateral-panel__content">
            <div class="bl_d-flex bl_jc-fe">
                <div class="tool-button tool-button--inline tool-button--flat rex-close-button">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div>
            <div class="models-list-wrapper">
                <ul class="model-list model-list--pswp" itemscope itemtype="http://schema.org/ImageGallery">
                    <?php
                // WP_Query arguments
                $args = array(
                    'post_type' => array('rex_model'),
                    'post_status' => array('publish', 'private'),
                    'posts_per_page' => '-1',
                );

                // The Query
                
                $query = new WP_Query($args);
                // The Loop
                if ($query->have_posts()) {
                    while ($query->have_posts()) {
                        $query->the_post();
                        $model_id = get_the_ID();
                        $model_title =  get_the_title();
                        $model_previewUrl = get_the_post_thumbnail_url();
                        ?>
                        <li class="model__element bl_d-flex bl_ai-c" draggable="true" data-rex-model-id="<?php echo $model_id;?>">
                            <div class="model-preview bl_d-flex bl_jc-c bl_ai-c<?php echo ( $model_previewUrl != "" ? ' model-preview--active' : '' ); ?>"<?php echo ( $model_previewUrl != "" ? 'style="background-image:url(' . $model_previewUrl . ');"' : '' ); ?> itemprop="contentUrl" data-href="<?php echo ( $model_previewUrl != "" ? esc_url($model_previewUrl) : "https://via.placeholder.com/640x480" ); ?>" data-size="640x480">
                                <span class="model-preview__placeholder"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
                                <div class="model-name bl_d-flex bl_jc-c bl_ai-fe"><div><?php echo $model_title;?></div></div>
                            </div>
                        </li>
                        <?php
                    }
                } else {
                    // no posts found
                }
                // Restore original Post Data
                wp_reset_postdata(); 

                ?></ul>
            </div>
        </div>
    </div>
<!-- </div> -->
<!-- Model Lists -->