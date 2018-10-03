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

<div class="rex-modal-wrap rex-fade">
    <div id="rex-css-editor" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <div id="rex-css-ace-editor" class="rex-ace-editor"></div>
        </div>
        <div class="rex-modal-footer">
            <button id="css-editor-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="css-editor-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div>
<!-- CSS Editor -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-insert-new-video-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <div id="insert-video-block-wrap-1" class="row valign-wrapper youtube-insert-wrap video-insert-wrap">
                <div class="rex-check rex-check-icon col rex-video-type-select">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="youtube" id="rex-choose-youtube-video">
                    <label for="rex-choose-youtube-video">
                        <i class="material-icons rex-icon">C</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col" data-rex-video-type="youtube">
                    <input id="rex-insert-youtube-url" class="youtube-url" type="text">
                    <label id="rex-insert-youtube-url-label" for="rex-insert-youtube-url">https://youtu.be/...</label>
                </div>
                <div class="set-video-audio-btn col">
                    <input class="video-audio-checkbox" type="checkbox" id="rex-new-block-video-youtube-audio" name="block-youtube-audio" title="Audio ON/OFF">
                    <label for="rex-new-block-video-youtube-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                        <i class="rex-icon">
                            <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                        </i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <!-- youtube input -->
            </div>
            <div id="insert-video-block-wrap-2" class="row valign-wrapper vimeo-insert-wrap video-insert-wrap" style="padding-top:16px;">
                <div class="rex-check rex-check-icon col rex-video-type-select" style="margin-right:5px;">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo-video">
                    <label for="rex-choose-vimeo-video">
                        <i class="material-icons rex-icon">Z</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col" data-rex-video-type="vimeo">
                    <input id="rex-insert-vimeo-url" class="vimeo-url" type="text">
                    <label id="rex-insert-vimeo-url-label" for="rex-insert-vimeo-url">https://player.vimeo.com/video/...</label>
                </div>
                <div class="set-video-audio-btn col">
                    <input class="video-audio-checkbox" type="checkbox" id="rex-new-block-video-vimeo-audio" name="block-vimeo-audio" title="Audio ON/OFF">
                    <label for="rex-new-block-video-vimeo-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                        <i class="rex-icon">
                            <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                        </i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <!-- vimeo input -->
            </div>
            <div id="insert-video-block-wrap-3" class="row valign-wrapper mp4-insert-wrap video-insert-wrap" style="padding-top:16px;">
                <div class="rex-check rex-check-icon col rex-video-type-select ">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="mp4" id="rex-choose-mp4-video">
                    <label id="rex-upload-mp4-video" for="rex-choose-mp4">
                        <i class="material-icons rex-icon">A</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="set-video-audio-btn col">
                    <input class="video-audio-checkbox" type="checkbox" id="rex-new-block-video-mp4-audio" name="block-mp4-audio" title="Audio ON/OFF">
                    <label for="rex-new-block-video-mp4-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                        <i class="rex-icon">
                            <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                        </i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <!-- mp4 input -->
            </div>
        </div>
        <div class="rex-modal-footer">
            <button id="rex-insert-video-block-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="rex-insert-video-block-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- Insert New Block Video -->

<div class="rex-modal-wrap rex-fade">
   <div id="rex-edit-background-section" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
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
                                <i class="material-icons rex-icon">p</i>
                            </div>
                            <button id="background-section-up-img" class="rex-plus-button btn-floating light-blue darken-1" value="" title="Select Image">
                                <i class="material-icons"></i>
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
                                <i class="material-icons rex-icon">o</i>
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
                                <i class="material-icons rex-icon">o</i>
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

<div class="rex-modal-wrap rex-fade">
    <div id="video-section-editor-wrapper" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <div id="edit-video-row-wrap-1" class="row valign-wrapper youtube-insert-wrap video-insert-wrap">
                <div class="rex-check rex-check-icon col rex-video-type-select">
                    <input type="checkbox" class="rex-choose-video with-gap" name="rex-choose-video" value="youtube" id="rex-choose-youtube-video-section" />
                    <label for="rex-choose-youtube-video-section">
                        <i class="material-icons rex-icon">C</i>
                        <span class="rex-ripple" />
                    </label>
                </div>
                <div class="input-field col" data-rex-video-type="youtube">
                    <input id="rex-youtube-video-section" class="youtube-url" type="text" />
                    <label id="rex-youtube-video-section-label" for="rex-youtube-video-section">https://youtu.be/...</label>
                </div>
            </div>
            <!-- youtube video background section -->
            <div id="edit-video-row-wrap-2" class="row valign-wrapper vimeo-insert-wrap video-insert-wrap" style="padding-top:16px;">
                <div class="rex-check rex-check-icon col rex-video-type-select" style="margin-right:5px;">
                    <input type="checkbox" class="rex-choose-video with-gap" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo-video-section" />
                    <label for="rex-choose-vimeo-video-section">
                        <i class="material-icons rex-icon">Z</i>
                        <span class="rex-ripple" />
                    </label>
                </div>
                <div class="input-field col" data-rex-video-type="vimeo">
                    <input id="rex-vimeo-video-section" class="vimeo-url" type="text" />
                    <label id="rex-vimeo-video-section-label" for="rex-vimeo-video-section">https://player.vimeo.com/video/...</label>
                </div>
            </div>
            <!-- vimeo input section-->
            <div id="edit-video-row-wrap-3" class="row valign-wrapper mp4-insert-wrap video-insert-wrap" style="padding-top:16px;">
                <div class="rex-check rex-check-icon col rex-video-type-select ">
                    <input type="checkbox" class="rex-choose-video with-gap" name="rex-choose-video" value="mp4" id="rex-choose-mp4-video-section" />
                    <label id="rex-upload-mp4-video-section" for="rex-choose-mp4-video-section">
                        <i class="material-icons rex-icon">A</i>
                        <span class="rex-ripple" />
                    </label>
                    <input name="" class="file-path" type="hidden" id="video-section-mp4-url" />
                </div>
            </div>
            <!-- mp4 input section-->
            <!-- video bg section-->
        </div>
    </div>
</div>

<div class="rex-modal-wrap rex-fade">
    <div id="rex-block-options" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="background-options-area modal-content">
            <div id="block-edit-image-bg" class="background_set_image row valign-wrapper">
                <div class="col">
                    <div class="valign-wrapper">
                        <div class="bg-image-block-active-wrapper">
                            <input type="checkbox" id="image-block-active" value="color" />
                            <label for="image-block-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div id="bg-block-set-img-wrap" class="rex-button-with-plus">
                            <div id="bg-block-img-preview" class="image-preview-logo">
                                <i class="material-icons rex-icon">p</i>
                            </div>
                            <button id="background-block-up-img" class="rex-plus-button btn-floating light-blue darken-1" value="" title="Select Image">
                                <i class="material-icons"></i>
                            </button>
                            <input name="" class="file-path" type="hidden" id="background-block-url" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div id="set-image-size">
                        <input type="hidden" id="set-image-size-value" name="set-image-size-value" value="">
                    </div>
                    <div id="bg-set-img-type" class="col clearfix">
                        <div class="rex-background-image-type-wrap" data-rex-type-image="full">
                            <input id="bg-img-type-full" class="background_image_type with-gap" type="radio" name="background_image_type" value="full">
                            <label for="bg-img-type-full" class="tooltipped" data-position="bottom" data-tooltip="Full">
                                <i class="material-icons rex-icon">j</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-background-image-type-wrap" data-rex-type-image="natural">
                            <input id="bg-img-type-natural" class="background_image_type with-gap" type="radio" name="background_image_type" value="natural">
                            <label for="bg-img-type-natural" class="tooltipped" data-position="bottom" data-tooltip="Natural">
                                <i class="material-icons rex-icon">k</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div id="bg-set-photoswipe" class="col rex-check-icon">
                        <input type="checkbox" id="background_photoswipe" name="background_photoswipe" title="Photo Zoom">
                        <label for="background_photoswipe" class="tooltipped" data-position="bottom" data-tooltip="Photo Zoom">
                            <i class="rex-icon">g</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
            </div>
            <!-- /BACKGROUND IMAGE -->
            <div id="background-block-set-color" class="background_set_color row valign-wrapper">
                <div class="col">
                    <div class="valign-wrapper">
                        <div class="bg-color-block-active-wrapper">
                            <input type="checkbox" id="color-block-active" value="color" />
                            <label for="color-block-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div class="rex-relative-col">
                            <input type="hidden" id="background-block-color-runtime" name="background-block-color-runtime" value="" />
                            <input id="background-block-color" type="text" name="background-block-color" value="" size="10" />
                            <div id="background-block-preview-icon" class="preview-color-icon"></div>
                        </div>
                    </div>
                </div>
                <div class="col">
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
                                <i class="material-icons rex-icon">o</i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /COLOR BACKGROUND BLOCK -->
            <div id="bg-overlay-block-set-color" class="background_set_color block valign-wrapper">
                <div class="col">
                    <div class="valign-wrapper">
                        <div class="overlay-active-wrapper">
                            <input type="checkbox" id="overlay-block-active" value="color" />
                            <label for="overlay-block-active">
                                <span class="rex-ripple" />
                            </label>
                        </div>
                        <div class="rex-relative-col">
                            <div class="block-overlay-preview">
                                <input id="overlay-color-block-value" type="text" name="overlay-color-block-value" value="rgba(255,255,255,0.5)" size="10" />
                                <div id="overlay-block-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
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
                                <i class="material-icons rex-icon">o</i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div id ="video-block-editor-wrapper" class="video-block-edit-wrap">
                <div id="edit-video-block-wrap-1" class="row valign-wrapper youtube-insert-wrap video-insert-wrap">
                    <div class="rex-check rex-check-icon col rex-video-type-select">
                        <input type="checkbox" class="rex-choose-video with-gap" name="rex-choose-video" value="youtube" id="rex-choose-youtube-video-block" />
                        <label for="rex-choose-youtube-video-block">
                            <i class="material-icons rex-icon">C</i>
                            <span class="rex-ripple" />
                        </label>
                    </div>
                    <div class="input-field col" data-rex-video-type="youtube">
                        <input id="rex-youtube-video-block" class="youtube-url" type="text" />
                        <label id="rex-youtube-video-block-label" for="rex-youtube-video-block">https://youtu.be/...</label>
                    </div>
                    <div class="set-video-audio-btn col">
                        <input class="video-audio-checkbox" type="checkbox" id="rex-edit-block-video-youtube-audio" name="block-youtube-audio" title="Audio ON/OFF">
                        <label for="rex-edit-block-video-youtube-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                            <i class="rex-icon">
                                <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                            </i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
                <!-- youtube video background block -->
                <div id="edit-video-block-wrap-2" class="row valign-wrapper vimeo-insert-wrap video-insert-wrap" style="padding-top:16px;">
                    <div class="rex-check rex-check-icon col rex-video-type-select" style="margin-right:5px;">
                        <input type="checkbox" class="rex-choose-video with-gap" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo-video-block" />
                        <label for="rex-choose-vimeo-video-block">
                            <i class="material-icons rex-icon">Z</i>
                            <span class="rex-ripple" />
                        </label>
                    </div>
                    <div class="input-field col" data-rex-video-type="vimeo">
                        <input id="rex-vimeo-video-block" class="vimeo-url" type="text" />
                        <label id="rex-vimeo-video-block-label" for="rex-vimeo-video-block">https://player.vimeo.com/video/...</label>
                    </div>
                    <div class="set-video-audio-btn col">
                        <input class="video-audio-checkbox" type="checkbox" id="rex-edit-block-video-vimeo-audio" name="block-vimeo-audio" title="Audio ON/OFF">
                        <label for="rex-edit-block-video-vimeo-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                            <i class="rex-icon">
                                <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                            </i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
                <!-- vimeo input block-->
                <div id="edit-video-block-wrap-3" class="row valign-wrapper mp4-insert-wrap video-insert-wrap" style="padding-top:16px;">
                    <div class="rex-check rex-check-icon col rex-video-type-select ">
                        <input type="checkbox" class="rex-choose-video with-gap" name="rex-choose-video" value="mp4" id="rex-choose-mp4-video-block" />
                        <label id="rex-upload-mp4-video-block" for="rex-choose-mp4-video-block">
                            <i class="material-icons rex-icon">A</i>
                            <span class="rex-ripple" />
                        </label>
                        <input name="" class="file-path" type="hidden" id="video-block-mp4-url" />
                    </div>
                    <div class="set-video-audio-btn col">
                        <input class="video-audio-checkbox" type="checkbox" id="rex-edit-block-video-mp4-audio" name="block-mp4-audio" title="Audio ON/OFF">
                        <label for="rex-edit-block-video-mp4-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                            <i class="rex-icon">
                                <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                            </i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
                <!-- mp4 input block-->
            </div>
            <!-- /VIDEO BACKGROUND BLOCK -->
            <div id="block-set-class-wrap" class="row valign-wrapper">
                <div id="block-content-positions-wrapper">
                    <div class="col">
                        <div>
                            <input id="rex-bm-content-top-left" type="radio" class="content-position with-gap" name="content-position" value="top-left" />
                            <label for="rex-bm-content-top-left" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Top-Left">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-top-center" type="radio" class="content-position with-gap" name="content-position" value="top-center" />
                            <label for="rex-bm-content-top-center" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Top-Center">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-top-right" type="radio" class="content-position with-gap" name="content-position" value="top-right"/>
                            <label for="rex-bm-content-top-right" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Top-Right">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-content-middle-left" type="radio" class="content-position with-gap" name="content-position" value="middle-left" />
                            <label for="rex-bm-content-middle-left" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Middle-Left">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-middle-center" type="radio" class="content-position with-gap" name="content-position" value="middle-center" />
                            <label for="rex-bm-content-middle-center" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Middle-Center">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-middle-right" type="radio" class="content-position with-gap" name="content-position" value="middle-right" />
                            <label for="rex-bm-content-middle-right" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Middle-Right">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input id="rex-bm-content-bottom-left" type="radio" class="content-position with-gap" name="content-position" value="bottom-left" />
                            <label for="rex-bm-content-bottom-left" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Bottom-Left">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-bottom-center" type="radio" class="content-position with-gap" name="content-position" value="bottom-center" />
                            <label for="rex-bm-content-bottom-center" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Bottom-Center">
                                <span class="rex-ripple"></span>
                            </label>
                            <input id="rex-bm-content-bottom-right" type="radio" class="content-position with-gap" name="content-position" value="bottom-right" />
                            <label for="rex-bm-content-bottom-right" class="tooltipped rex-block-position" data-position="bottom" data-tooltip="Bottom-Right">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <!-- POSITIONS -->
                <div id="block-paddings-wrapper">
                    <div class="col">
                        <div class="clearfix">
                            <div class="block-padding-wrap">
                                <input type="text" id="bm-block-padding-top" class="block-padding-values" name="block-padding-top" value="5" />
                                <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Top">d</i>
                            </div>
                        </div>
                        <div class="clearfix">
                            <div class="block-padding-wrap">
                                <input type="text" id="bm-block-padding-left" class="block-padding-values" name="block-padding-left" value="5" />
                                <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Left">a</i>
                            </div>
                            <div id="block-padding-future-content"></div>
                            <div class="block-padding-wrap">
                                <input type="text" id="bm-block-padding-right" class="block-padding-values" name="block-padding-right" value="5" />
                                <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Right">c</i>
                            </div>
                        </div>
                        <div class="clearfix">
                            <div class="block-padding-wrap">
                                <input type="text" id="bm-block-padding-bottom" class="block-padding-values" name="block-padding-bottom" value="5" />
                                <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Bottom">b</i>
                            </div>
                        </div>
                    </div>
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
                </div>
                <!-- PADDINGS -->
            </div>
            <!-- /POSITION & PADDING -->
            <div id="bg-set-link-wrap" class="row">
                <div class="col block-url-link-wrapper">
                    <div class="input-field rex-input-prefixed">
                        <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="Link">l</i>
                        <input type="text" id="block_link_value" name="block_link_value" value="" size="30">
                        <label for="block_link_value">http://www...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
                <div class="col block-custom-class-wrapper">
                    <div class="input-field rex-col2 rex-input-prefixed">
                        <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="Custom Class">e</i>
                        <input type="text" id="rex_block_custom_class" name="rex_block_custom_class" value="">
                        <label for="rex_block_custom_class">
                            Classes
                        </label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div>
            <!-- /LINK CLASSES -->
        </div>
    </div>
</div>
<!-- Block settings background settings -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-slider-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <?php include 'rexbuilder-modal-loader.php';?>
            <div class="rex-slider__slide-list rex-modal-content__modal-area">
                <div class="col rex-slider__slide rex-modal-content__modal-area__row" data-slider-slide-id="0" data-block_type="slide">
                    <div class="valign-wrapper space-between-wrapper">
                        <button class="rex-slider__slide-index btn-circle btn-small btn-bordered grey-border border-darken-2 waves-effect waves-light white grey-text text-darken-2">1</button>
                        <div class="rex-button-with-plus">
                            <button class="rex-slider__slide-edit rex-slider__slide__image-preview btn-floating waves-effect waves-light tooltipped grey darken-2" value="edit-slide" data-position="bottom" data-tooltip="<?php _e('Slide', 'rexpansive-classic');?>">
                                <i class="material-icons rex-icon">p</i>
                            </button>
                            <button class="rex-slider__slide-edit rex-plus-button btn-floating light-blue darken-1 tooltipped" value="add-slide" data-position="bottom" data-tooltip="<?php _e('Select Image', 'rexpansive-classic');?>">
                                <i class="material-icons">&#xE145;</i>
                            </button>
                        </div>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="text" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive-classic');?>">
                            <i class="material-icons rex-icon">u</i>
                        </button>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="video" data-position="bottom" data-tooltip="<?php _e('Video', 'rexpansive-classic');?>">
                            <i class="material-icons">play_arrow</i>
                        </button>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="url" data-position="bottom" data-tooltip="<?php _e('Link', 'rexpansive-classic');?>">
                            <i class="material-icons rex-icon">l</i>
                        </button>
                        <div>
                            <button class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="copy" data-tooltip="<?php _e('Copy slide', 'rexpansive-classic');?>">
                                <i class="material-icons grey-text text-darken-2">&#xE14D;</i>
                            </button>
                            <div class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="move" data-tooltip="<?php _e('Move slide', 'rexpansive-classic');?>">
                                <i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
                            </div>
                            <button class="rex-slider__slide-edit btn-flat tooltipped" value="delete" data-position="bottom" data-tooltip="<?php _e('Delete slide', 'rexpansive-classic');?>">
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
                <button id="rex-slider__add-new-slide" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Add slide', 'rexpansive-classic')?>">
                    <i class="material-icons text-white">&#xE145;</i>
                </button>
            </div>
            <!-- // .rex-slider__add-slide__wrap -->
            <div class="rex-slider__settings--wrap rex-modal-content__modal-area rex-modal-content__modal-area--bordered">
                <div class="col">
                    <div class="valign-wrapper space-between-wrapper">
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__autostart" name="rex-slider__autostart" title="<?php _e('Autostart', 'rexpansive-classic');?>">
                            <label for="rex-slider__autostart" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Autostart', 'rexpansive-classic');?>">
                                <i class="rex-icon">J</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__prev-next" name="rex-slider__prev-next" title="<?php _e('Prev Next', 'rexpansive-classic');?>">
                            <label for="rex-slider__prev-next" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Prev Next', 'rexpansive-classic');?>">
                                <i class="rex-icon">K</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__dots" name="rex-slider__dots" title="<?php _e('Dots', 'rexpansive-classic');?>">
                            <label for="rex-slider__dots" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Dots', 'rexpansive-classic');?>">
                                <i class="rex-icon">Y</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rex-slider__import--wrap rex-modal-content__modal-area">
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
                <div class="rx__select-wrap">
                    <input class="title-slider" type="text">
                    <select id="rex-slider__import" class="rx__form-input">
                        <option value="0"><?php _e('New Slider', 'rexpansive-classic');?></option>
                        <?php
                        // Printing all sliders avaiable
                        if ($query->have_posts()) {
                            while ($query->have_posts()) {
                                $query->the_post();
                                ?>
                        <option value="<?php the_ID();?>"><?php the_title();?></option>
                        <?php
                            }
                        } else {
                            // no posts found
                        }
                        ?>
                    </select>
                    <div class="rx__form-input__select-arrow"></div>
                </div>
                <div class="rex_edit_slider_title_toolbox">
                    <div class="rex_edit_title_slider">
                        <button id="edit_slider_title_btn">e</button>
                    </div>
                    <div class="rex_save_title_slider">
                        <button id="save_slider_title_btn">s</button>
                    </div>
                    <div class="rex_cancel_title_slider">
                        <button id="cancel_slider_title_btn">c</button>
                    </div>
                </div>
                <?php
                    // Restore original Post Data
                    wp_reset_postdata();
                ?>
            </div>
        </div>
        <div class="rex-modal-footer">
            <button id="" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div>
<!-- Insert RexSlider -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-slider__links-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
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
        <div class="rex-modal-footer">
            <button class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div>
<!-- //.rex-slider__links-editor -->

<div class="rex-modal-wrap rex-fade">
    <div id="modal-background-responsive-set" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <div id="section-config-first-row" class="row valign-wrapper">
                <div class="col valign-wrapper">
                    <div class="rex-edit-layout-wrap">
                        <div class="rexlive-layout-type" data-rex-layout="fixed">
                            <input type="radio" id="section-fixed" name="section-layout" class="builder-edit-row-layout with-gap" value="fixed" checked title="Grid Layout" />
                            <label for="section-fixed"  class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Grid Layout', 'rexspansive');?>">
                                <i class="material-icons">&#xE8F1;</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rexlive-layout-type" data-rex-layout="masonry">
                            <input type="radio" id="section-masonry" name="section-layout" class="builder-edit-row-layout with-gap" value="masonry" title="Masonry Layout" />
                            <label for="section-masonry"  class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Masonry Layout', 'rexspansive');?>">
                                <!-- <i class="material-icons">&#xE871;</i>
                                <span class="rex-ripple"></span> -->
                                <?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?>
                            </label>
                        </div>
                    </div>
                </div><!-- Grid fixed or masonry -->

                <div>
                </div>
                <div class="section-width-wrapper">
                    <div class="col valign-wrapper layout-wrap rex-edit-row-width-wrapper">
                        <div class="rexlive-section-width" data-rex-section-width="full">
                            <input type="radio" id="section-full-modal" name="section-dimension-modal" class="builder-edit-row-dimension-modal with-gap" value="full" title="Full" />
                            <label for="section-full-modal" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Full', $this->plugin_name);?>">
                                <i class="material-icons rex-icon">v</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rexlive-section-width" data-rex-section-width="boxed">
                            <input id="section-boxed-modal" type="radio" name="section-dimension-modal" class="builder-edit-row-dimension-modal with-gap" value="boxed" title="Boxed" />
                            <label for="section-boxed-modal" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Boxed', $this->plugin_name);?>">
                                <i class="material-icons rex-icon">t</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div><!-- Full section width or boxed -->

                    <div class="col valign-wrapper">
                        <div id="section-set-dimension" class="input-field rex-input-prefixed col">
                            <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e('Boxed Width', 'rexpansive');?>">t</i>
                            <input type="text" id="" class="section-set-boxed-width" name="section-set-boxed-width" value="0000" placeholder="" size="23">
                            <span class="rex-material-bar"></span>
                        </div>
                        <div class="section-set-boxed-width-wrap col">
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
                </div>
            </div><!-- /full-heigth, boxed dimension, block distance -->

            <div id="section-config-third-row" class="b-row align-items-center b--border-bottom">
                <div class="b-col" style="padding-top: 17px;">
                    <div class="cross-style-wrap" style="min-height:153px;">
                        <div class="block-padding-wrap" style="padding-bottom: 6px;">
                            <input type="text" id="row-separator-top" class="block-padding-values" name="row-separator-top" value="" placeholder="" />
                            <!-- <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Row Margin Top">P</i> -->
                            <i class="b-svg-icons tooltipped" data-position="bottom" data-tooltip="Row Margin Top"><svg><use xlink:href="#ico-distance-top"></use></svg></i>
                            <span class="block-padding-label">PX</span>
                        </div>
                        <div class="b-row justify-content-space-between">
                            <div class="block-padding-wrap">
                                <input type="text" id="row-separator-left" class="block-padding-values" name="row-separator-left" value="" placeholder="" />
                                <!-- <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Row Margin Left">Q</i> -->
                                <i class="b-svg-icons tooltipped" data-position="bottom" data-tooltip="Row Margin Left"><svg><use xlink:href="#ico-distance-left"></use></svg></i>
                                <span class="block-padding-label">PX</span>
                            </div>
                            <div class="block-padding-wrap">
                                <input type="text" id="" class="section-set-block-gutter block-padding-values" name="section-set-block-gutter" value="" placeholder="" size="15">
                                <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e('Block Distance', 'rexpansive');?>">S</i>
                                <span class="block-padding-label">PX</span>
                                <span class="rex-material-bar"></span>
                            </div>
                            <div class="block-padding-wrap">
                                <input type="text" id="row-separator-right" class="block-padding-values" name="row-separator-right" value="" placeholder="" />
                                <!-- <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Row Margin Right">O</i> -->
                                <i class="b-svg-icons tooltipped" data-position="bottom" data-tooltip="Row Margin Right"><svg><use xlink:href="#ico-distance-right"></use></svg></i>
                                <span class="block-padding-label">PX</span>
                            </div>
                        </div>
                        <div class="block-padding-wrap">
                            <input type="text" id="row-separator-bottom" class="block-padding-values" name="row-separator-bottom" value="" placeholder="" />
                            <!-- <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Row Margin Bottom">N</i> -->
                            <i class="b-svg-icons tooltipped" data-position="bottom" data-tooltip="Row Margin Bottom"><svg><use xlink:href="#ico-distance-bottom"></use></svg></i>
                            <span class="block-padding-label">PX</span>
                        </div>
                    </div>
                </div>

                <div class="b-col">
                    <div class="cross-style-wrap" style="max-width:210px;margin-left:12px;">
                        <div class="block-padding-wrap">
                            <input type="text" id="row-margin-top" class="block-padding-values" name="row-margin-top" value="" placeholder="0" />
                            <span class="block-padding-label">PX</span>
                        </div>
                        <div class="b-row justify-content-space-between align-items-center" style="padding: 15px 0;">
                            <div class="block-padding-wrap">
                                <input type="text" id="row-margin-left" class="block-padding-values" name="row-margin-left" value="" placeholder="0" />
                                <span class="block-padding-label">PX</span>
                            </div>
                            <div class="block-padding-wrap" style="padding-left: 10px;">
                                <i class="b-svg-icons b-svg__margin-icon"><svg><use xlink:href="#Ico_Margin"></use></svg></i>
                            </div>
                            <div class="block-padding-wrap">
                                <input type="text" id="row-margin-right" class="block-padding-values" name="row-margin-right" value="" placeholder="0" />
                                <span class="block-padding-label">PX</span>
                            </div>
                        </div>
                        <div class="block-padding-wrap">
                            <input type="text" id="row-margin-bottom" class="block-padding-values" name="row-margin-bottom" value="" placeholder="0" />
                            <span class="block-padding-label">PX</span>
                        </div>
                    </div>
                </div>

            </div><!-- custom classes -->

            <div class="b-row align-items-center b--border-bottom">
                <div class="b-col b--border-right">
                    <div class="b-row justify-content-center">
                        <div id="bg-set-full-section" class="rex-check-icon col">
                            <input type="checkbox" id="section-is-full" name="section-is-full" value="full-height">
                            <label for="section-is-full" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Full Height', 'rexpansive');?>">
                                <i class="rex-icon">s</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div id="bg-set-full-text" class="rex-col-text col">
                            <span>100%</span>
                        </div>
                    </div>
                </div>

                <div id="bg-set-photoswipe" class="b-col b--border-right rex-check-icon">
                    <input type="checkbox" id="section-active-photoswipe" name="section-active-photoswipe" title="<?php _e('All Images Zoom', 'rexpansive');?>">
                    <label for="section-active-photoswipe" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('All Images Zoom', 'rexpansive');?>">
                        <i class="rex-icon">R</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>

                <!-- <div id="rx-set-hold-grid" class="b-col">
                    <div id="rx-hold-grid__wrap" class="rex-check-icon col">
                        <input type="checkbox" id="rx-hold-grid" name="rx-hold-grid" value="full-height">
                        <label for="rx-hold-grid" class="tooltipped" data-position="bottom" data-tooltip="<?php // _e('Grid On Mobile', 'rexpansive');?>">
                            <i class="rex-icon">V</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div> -->

            </div>

            <div class="row valign-wrapper id-class-row-wrap">
                <div id="rex-config-id" class="input-field col rex-input-prefixed">
                    <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e('Section Name', 'rexpansive');?>">B</i>
                    <input type="text" id="sectionid-container" name="sectionid-container">
                    <span class="rex-material-bar"></span>
                </div>
                <div id="section-set-class-wrap" class="input-field col rex-input-prefixed">
                    <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e('Custom Class', 'rexpansive');?>">e</i>
                    <input type="text" id="section-set-custom-class" name="section-set-custom-class" value="" size="10">
                    <label for="section-set-custom-class">
                        <?php _e('Classes', 'rexpansive');?>
                    </label>
                    <span class="rex-material-bar"></span>
                </div>
            </div><!-- custom classes -->
        </div>
    </div>
</div><!-- Section settings -->

<div class="rex-modal-wrap rex-fade">
    <div id="rexeditor-modal" class="rexbuilder-materialize-wrap outside-content-modal rex-modal-draggable z-depth-4 rex-modal">
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
            <div class="rexeditor_bottom rex-modal-footer clearfix">
                <button id="editor-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                    <i class="rex-icon">n</i>
                </button>
                <button id="editor-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                    <i class="rex-icon">m</i>
                </button>
            </div>
        </div>
    </div>
</div><!-- Text Editor -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-model-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">

            <?php include 'rexbuilder-modal-loader.php';?>

            <div class="rex-model__add-model__wrap rex-modal-content__modal-area--bordered rex-modal-content__modal-area" style="display:flex;">
                <div id="rex-model__name__wrap" class="input-field col rex-input-prefixed rex-input-prefixed--no-prefix" style="width:100%;">
                    <span class="prefix"></span>
                    <input type="text" id="rex-model__name" name="rex-model__name">
                    <label for="rex-model__name" class=""><?php _e('Model name', 'rexpansive');?></label>
                    <span class="rex-material-bar"></span>
                </div>
                <button id="rex-model__add-new-model" class="builder-button btn-floating btn-no-shadow btn-bordered btn-bordered--inactive tooltipped" data-position="bottom" data-tooltip="<?php _e('Add model', 'rexpansive-classic')?>">
                    <i class="material-icons">&#xE145;</i>
                </button>
            </div><!-- // .rex-model__add-model__wrap -->

            <div class="rex-model__import--wrap rex-modal-content__modal-area">
                <div class="rex-model__model-insert-success-wrap"></div>
                <div class="rex-model__import--wrap-active">
            <?php
// WP_Query arguments
$args = array(
    'post_type' => array('rex_model'),
    'post_status' => array('publish', 'private'),
    'posts_per_page' => '-1',
);

// The Query
$query = new WP_Query($args);

?><div class="rx__select-wrap">
                <select id="rex-model__import" class="rx__form-input">
                <option value="0"><?php _e('New Model', 'rexpansive-classic');?></option>
                <?php
// The Loop
if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();
        ?>
        <option value="<?php the_ID();?>" data-preview-url="<?php echo get_permalink(); ?>"><?php the_title();?></option>
        <?php
    }
} else {
    // no posts found
}

?>
                </select>
                <div class="rx__form-input__select-arrow"></div>
            </div>
            <?php

// Restore original Post Data
wp_reset_postdata();
?>

            <div id="rex-model__open-preview">
                <i class="rex-icon">g</i>
            </div>
        </div>
            </div>
        </div>

        <div class="rex-modal-footer">
            <button id="" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- RexModel modal -->
<div class="rex-modal-wrap rex-fade">
    <div id="rex-edit-model-choose" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <div class="edit-model-description">
                Cosa vuoi fare?
            </div>
            <div>
                <div class="rex-edit-model-option" data-rex-option="edit">
                    <button class="rex-button edit-model">Edita</button>
                </div>
                <div class="rex-edit-model-option" data-rex-option="remove">
                    <button class="rex-button remove-model">Togli</button>
                </div>
            </div>
        </div>
    </div>
</div><!-- Edit Model  -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-layout-page-changed" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <div class="layout-page-changed-description">
                Save changes?
            </div>
            <div>
                <div class="rex-change-layout-option" data-rex-option="save">
                    <button class="rex-button save-page">yes</button>
                </div>
                <div class="rex-change-layout-option" data-rex-option="continue">
                    <button class="rex-button continue">no</button>
                </div>
                <div class="rex-change-layout-option" data-rex-option="abort">
                    <button class="rex-button abort">cancel</button>
                </div>
            </div>
        </div>
    </div>
</div><!-- Layout page Changed -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-locked-option" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <div class="locked-option-changed-description">
            This feature is not avaiable until saved.
            Attention! Once you have saved from live, you can not edit from backend.
            </div>
            <div>
                <div class="rex-locked-option-wrapper" data-rex-option="save">
                    <button class="rex-button save-page">save</button>
                </div>
                <div class="rex-locked-option-wrapper" data-rex-option="abort">
                    <button class="rex-button abort">cancel</button>
                </div>
            </div>
        </div>
    </div>
</div><!-- Locked feature -->

<div class="rex-modal-wrap rex-fade" style="width:500px;overflow:visible;left:70%;">
    <div id="rex-models-list" class="rex-modal rexbuilder-materialize-wrap z-depth-4">
        <div class="modal-content">
            <div class="models-list-wrapper">
                <ul class="model-list">
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
                        <li class="model__element" draggable="true" data-rex-model-id="<?php echo $model_id;?>">
                            <div class="model-name"><?php echo $model_title;?></div>
                            <div class="model-preview"><img class="model-thumbnail"<?php
                            if($model_previewUrl != ""){
                                echo " src=\"" . $model_previewUrl . "\"";
                            }
                            ?>></div>
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
            <div class="rexeditor_bottom rex-modal-footer clearfix">
                <button class="waves-effect waves-light btn-flat grey rex-close-button" value="">
                    <i class="rex-icon">n</i>
                </button>
            </div>
        </div>
    </div>
</div><!-- Model Lists -->