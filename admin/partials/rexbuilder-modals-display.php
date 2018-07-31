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

defined( 'ABSPATH' ) or exit;
?>
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
</div><!-- CSS Editor -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-rxcf-editor" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <?php include('rexbuilder-modal-loader.php'); ?>
            <div class="rex-modal-content__modal-area">
                <textarea name="rex-rxcf-editor_input" id="rex-rxcf-editor_input" cols="30" rows="10" style="height:200px"></textarea>
            </div>
            <div class="row valign-wrapper">
                <a class="rex-rxcf-editor_copy" href="#">
                    <i class="material-icons grey-text text-darken-2">&#xE14D;</i>
                </a>
            </div>
        </div>
        <div class="rex-modal-footer">
            <button class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- CF7 Editor -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-video-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <div id="section-set-video-wrap" class="row valign-wrapper">
                <div class="rex-check rex-check-icon col">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="youtube" id="rex-choose-youtube">
                    <label for="rex-choose-youtube">
                        <i class="material-icons rex-icon">C</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col">
                    <input id="rex-mp4-id" type="hidden">
                    <input id="rex-youtube-url" type="text">
                    <label id="rex-youtube-url-label" for="rex-youtube-url">https://youtu.be/...</label>
                </div>
                <div class="rex-check rex-check-icon col">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="mp4" id="rex-choose-mp4">
                    <label id="rex-upload-mp4" for="rex-choose-mp4">
                        <i class="material-icons rex-icon">A</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
            </div>
            <div id="section-set-video-wrap-2" class="row valign-wrapper" style="padding-top:16px;">
                <div class="rex-check rex-check-icon col" style="margin-right:5px;">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo">
                    <label for="rex-choose-vimeo">
                        <i class="material-icons rex-icon">Z</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col">
                    <input id="rex-vimeo-url" type="text">
                    <label id="rex-vimeo-url-label" for="rex-vimeo-url">https://player.vimeo.com/video/...</label>
                </div><!-- vimeo input -->
            </div>
        </div>
        <div class="rex-modal-footer">
            <button id="rex-video-block-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="rex-video-block-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- Block Video Editor -->

<div class="rex-modal-wrap rex-fade">
    <div id="rexeditor-modal" class="rexbuilder-materialize-wrap outside-content-modal rex-modal-draggable z-depth-4 rex-modal">
        <div class="modal-content-wrap">
            <div class="modal-editor-header">
                <div class="rexeditor-modal__header__buttons-wrap">
                    <button id="content-position-open-modal" class="btn-floating waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e( 'Text Position', 'rexspansive' ); ?>">
                        <i class="material-icons rex-icon">E</i>
                    </button>
                    <button id="content-padding-open-modal" class="btn-floating waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e( 'Padding', 'rexspansive' ); ?>">
                        <i class="material-icons rex-icon">D</i>
                    </button>
                </div>
            </div>
            <div class="modal-content">
                <div class="modal-editor-editorarea">
                <?php wp_editor( '', 'rexbuilder_editor', array( 'textarea_rows' => 20, 'wpautop' => false, 'editor_height' => 250 ) ); ?>
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
    <div id="block-modal-content-padding" class="rex-modal rexbuilder-materialize-wrap z-depth-4">
        <div class="modal-content">
            <div class="row valign-wrapper">
                <div class="col">
                    <div class="clearfix">
                        <div class="block-padding-wrap">
                            <input type="text" id="block-padding-top" class="block-padding-values" name="block-padding-top" value="5" />
                            <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Top">d</i>
                        </div>
                    </div>
                    <div class="clearfix">
                        <div class="block-padding-wrap">				
                            <input type="text" id="block-padding-left" class="block-padding-values" name="block-padding-left" value="5" />
                            <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Left">a</i>
                        </div>
                        <div id="block-padding-future-content"></div>
                        <div class="block-padding-wrap">
                            <input type="text" id="block-padding-right" class="block-padding-values" name="block-padding-right" value="5" />
                            <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Right">c</i>
                        </div>
                    </div>
                    <div class="clearfix">
                        <div class="block-padding-wrap">				
                            <input type="text" id="block-padding-bottom" class="block-padding-values" name="block-padding-bottom" value="5" />
                            <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Bottom">b</i>
                        </div>
                    </div>
                </div>

                <div class="rex-vertical-check-wrap col">
                    <div class="rex-check-text">
                        <input id="block-pad-percentage" type="radio" class="block-padding-type with-gap" name="block-padding-type" value="percentage" checked />
                        <label for="block-pad-percentage">
                            %
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div class="rex-check-text">
                        <input id="block-pad-pixel" type="radio" class="block-padding-type with-gap" name="block-padding-type" value="pixel" />
                        <label for="block-pad-pixel">
                            PX
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="rex-modal-footer">
            <button id="block-set-content-padding-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="block-set-content-padding-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="" data-block_id="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- Block Content Padding Modal -->

<div class="rex-modal-wrap rex-fade">
    <div id="block-modal-content-position" class="rex-modal rexbuilder-materialize-wrap z-depth-4">
        <div class="modal-content">
            <div class="row valign-wrapper">
                <div class="col">
                    <div>
                        <input id="rex-content-top-left" type="radio" class="content-position with-gap" name="content-position" value="top-left" />
                        <label for="rex-content-top-left" class="tooltipped" data-position="bottom" data-tooltip="Align Top Left">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-content-top-center" type="radio" class="content-position with-gap" name="content-position" value="top-center" />
                        <label for="rex-content-top-center" class="tooltipped" data-position="bottom" data-tooltip="Align Top Center">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-content-top-right" type="radio" class="content-position with-gap" name="content-position" value="top-right"/>
                        <label for="rex-content-top-right" class="tooltipped" data-position="bottom" data-tooltip="Align Top Right">
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div>
                        <input id="rex-content-middle-left" type="radio" class="content-position with-gap" name="content-position" value="middle-left" />
                        <label for="rex-content-middle-left" class="tooltipped" data-position="bottom" data-tooltip="Align Middle Left">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-content-middle-center" type="radio" class="content-position with-gap" name="content-position" value="middle-center" />
                        <label for="rex-content-middle-center" class="tooltipped" data-position="bottom" data-tooltip="Align Middle Center">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-content-middle-right" type="radio" class="content-position with-gap" name="content-position" value="middle-right" />
                        <label for="rex-content-middle-right" class="tooltipped" data-position="bottom" data-tooltip="Align Middle Right">
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div>
                        <input id="rex-content-bottom-left" type="radio" class="content-position with-gap" name="content-position" value="bottom-left" />
                        <label for="rex-content-bottom-left" class="tooltipped" data-position="bottom" data-tooltip="Align Bottom Left">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-content-bottom-center" type="radio" class="content-position with-gap" name="content-position" value="bottom-center" />
                        <label for="rex-content-bottom-center" class="tooltipped" data-position="bottom" data-tooltip="Align Bottom Center">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-content-bottom-right" type="radio" class="content-position with-gap" name="content-position" value="bottom-right" />
                        <label for="rex-content-bottom-right" class="tooltipped" data-position="bottom" data-tooltip="Align Bottom Right">
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="rex-modal-footer">
            <button id="block-set-content-position-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="block-set-content-position-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="" data-block_id="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- Block Content Position Modal -->

<div class="rex-modal-wrap rex-fade">
    <div id="background_block_set" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="background-options-area modal-content">
            <div class="background_set_image row valign-wrapper">
                <div class="col">
                    <div class="valign-wrapper">
                        <div class="rex-check">
                            <input type="radio" id="background-value-image" class="background_type with-gap" name="background_type" value="image" />
                            <label for="background-value-image" title="Image">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div id="bg-set-img-wrap" class="rex-button-with-plus">
                            <div id="bg-img-preview">
                                <i class="material-icons rex-icon">p</i>
                            </div>
                            <button id="background_up_img" class="rex-plus-button btn-floating light-blue darken-1" value="" title="Select Image">
                                <i class="material-icons">&#xE145;</i>
                            </button>
                            <input name="" class="file-path" type="hidden" id="background_url" />
                        </div>
                    </div>
                </div>
                <div id="set-image-size">
                    <input type="hidden" id="set-image-size-value" name="set-image-size-value" value="">
                </div>
                <div id="bg-set-img-type" class="col clearfix">
                    <div>
                        <input id="bg-img-type-full" class="background_image_type with-gap" type="radio" name="background_image_type" value="full" checked>
                        <label for="bg-img-type-full" class="tooltipped" data-position="bottom" data-tooltip="Full">
                            <i class="material-icons rex-icon">j</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div>
                        <input id="bg-img-type-natural" class="background_image_type with-gap" type="radio" name="background_image_type" value="natural">
                        <label for="bg-img-type-natural" class="tooltipped" data-position="bottom" data-tooltip="Natural">
                            <i class="material-icons rex-icon">k</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
                <div id="bg-set-photoswipe" class="col rex-check-icon">
                    <input type="checkbox" id="background_photoswipe" name="background_photoswipe" title="Photo Zoom">
                    <label for="background_photoswipe" class="tooltipped" data-position="bottom" data-tooltip="Photo Zoom">
                        <i class="rex-icon">g</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
            </div><!-- /BACKGROUND IMAGE -->

            <div id="background-set-color" class="background_set_color row valign-wrapper">
                <div class="col">
                    <div class="valign-wrapper">
                        <div class="">
                            <input type="radio" id="background-value-color" class="background_type with-gap" name="background_type" value="color" />
                            <label for="background-value-color">
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-relative-col">
                            <input type="hidden" id="background-block-color-runtime" name="background-block-color-runtime" value="">
                            <input id="background-block-color" type="text" name="background-block-color" value="" size="10">
                            <div id="background-preview-icon" class="preview-color-icon"></div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div id="bg-color-palette" class="clearfix">
                        <div id="palette-blue" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)" />
                            <span class="bg-palette-button"></span>
                        </div>
                        <div id="palette-green" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)" />
                            <span class="bg-palette-button"></span>
                        </div>
                        <div id="palette-black" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)" />
                            <span class="bg-palette-button"></span>
                        </div>
                        <div id="palette-red" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)" />
                            <span class="bg-palette-button"></span>
                        </div>
                        <div id="palette-orange" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(255,152,0,1)" />
                            <span class="bg-palette-button"></span>
                        </div>						
                        <div id="palette-purple" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(156,39,176,1)" />
                            <span class="bg-palette-button"></span>
                        </div>						
                        <div id="palette-transparent" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)" />
                            <span class="bg-palette-button">
                                <i class="material-icons rex-icon">o</i>
                            </span>
                        </div>
                    </div>
                </div>				
            </div><!-- /COLOR BACKGROUND -->

            <div id="block-set-video-wrap" class="row valign-wrapper">
                <div class="col rex-check-icon">
                    <input type="radio" class="rex-block-choose-video with-gap" name="rex-block-choose-video" value="youtube" id="rex-block-choose-youtube">
                    <label for="rex-block-choose-youtube">
                        <i class="material-icons rex-icon">C</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div id="block-set-youtube-video-wrap" class="col input-field">
                    <input id="rex-block-mp4-id" type="hidden">
                    <input id="rex-block-youtube-url" type="text">
                    <label id="rex-block-youtube-url-label" for="rex-block-youtube-url">https://youtu.be/...</label>
                    <span class="rex-material-bar"></span>
                </div>
                <div id="block-set-mp4-video-wrap" class="rex-check-icon col">
                    <input type="radio" class="rex-block-choose-video with-gap" name="rex-block-choose-video" value="mp4" id="rex-block-choose-mp4">
                    <label id="rex-block-upload-mp4" for="rex-block-choose-mp4">
                        <i class="material-icons rex-icon">A</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div id="block-set-video-has-audio" class="col">
                    <input type="checkbox" id="rex-block-video-has-audio" name="rex-block-video-has-audio" title="Audio ON/OFF">
                    <label for="rex-block-video-has-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                        <i class="rex-icon">
                            <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                        </i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
            </div><!-- /VIDEO -->

            <div id="block-set-video-wrap-2" class="row valign-wrapper">
                <div class="col rex-check-icon">
                    <input type="radio" class="rex-block-choose-video with-gap" name="rex-block-choose-video" value="vimeo" id="rex-block-choose-vimeo">
                    <label for="rex-block-choose-vimeo" data-tooltip="<?php _e( 'Vimeo', 'rexpansive' ); ?>">
                        <i class="material-icons rex-icon">Z</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div id="block-set-vimeo-video-wrap" class="col input-field">
                    <input id="rex-block-vimeo-url" type="text">
                    <label id="rex-block-vimeo-url-label" for="rex-block-vimeo-url">https://player.vimeo.com/video/...</label>
                    <span class="rex-material-bar"></span>
                </div>
            </div>

            <div id="block-set-class-wrap" class="row valign-wrapper">
                <div class="col">
                    <div>
                        <input id="rex-bm-content-top-left" type="radio" class="content-position with-gap" name="content-position" value="top-left" />
                        <label for="rex-bm-content-top-left" class="tooltipped" data-position="bottom" data-tooltip="Top-Left">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-bm-content-top-center" type="radio" class="content-position with-gap" name="content-position" value="top-center" />
                        <label for="rex-bm-content-top-center" class="tooltipped" data-position="bottom" data-tooltip="Top-Center">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-bm-content-top-right" type="radio" class="content-position with-gap" name="content-position" value="top-right"/>
                        <label for="rex-bm-content-top-right" class="tooltipped" data-position="bottom" data-tooltip="Top-Right">
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div>
                        <input id="rex-bm-content-middle-left" type="radio" class="content-position with-gap" name="content-position" value="middle-left" />
                        <label for="rex-bm-content-middle-left" class="tooltipped" data-position="bottom" data-tooltip="Middle-Left">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-bm-content-middle-center" type="radio" class="content-position with-gap" name="content-position" value="middle-center" />
                        <label for="rex-bm-content-middle-center" class="tooltipped" data-position="bottom" data-tooltip="Middle-Center">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-bm-content-middle-right" type="radio" class="content-position with-gap" name="content-position" value="middle-right" />
                        <label for="rex-bm-content-middle-right" class="tooltipped" data-position="bottom" data-tooltip="Middle-Right">
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div>
                        <input id="rex-bm-content-bottom-left" type="radio" class="content-position with-gap" name="content-position" value="bottom-left" />
                        <label for="rex-bm-content-bottom-left" class="tooltipped" data-position="bottom" data-tooltip="Bottom-Left">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-bm-content-bottom-center" type="radio" class="content-position with-gap" name="content-position" value="bottom-center" />
                        <label for="rex-bm-content-bottom-center" class="tooltipped" data-position="bottom" data-tooltip="Bottom-Center">
                            <span class="rex-ripple"></span>
                        </label>
                        <input id="rex-bm-content-bottom-right" type="radio" class="content-position with-gap" name="content-position" value="bottom-right" />
                        <label for="rex-bm-content-bottom-right" class="tooltipped" data-position="bottom" data-tooltip="Bottom-Right">
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>

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

                <div class="rex-vertical-check-wrap col">
                    <div class="rex-check-text">
                        <input id="bm-block-pad-percentage" type="radio" class="bm-block-padding-type with-gap" name="block-padding-type" value="percentage" checked />
                        <label for="bm-block-pad-percentage">
                            %
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div class="rex-check-text">
                        <input id="bm-block-pad-pixel" type="radio" class="bm-block-padding-type with-gap" name="block-padding-type" value="pixel" />
                        <label for="bm-block-pad-pixel">
                            PX
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
            </div><!-- /POSITION & PADDING -->

            <div id="block-overlay-wrap" class="row valign-wrapper">
                <div class="col">
                    <div id="bg-set-block-overlay" class="col rex-check-icon">
                        <input type="checkbox" id="block-has-overlay-small" class="block-has-overlay" name="block-has-overlay-small" value="small">
                        <label for="block-has-overlay-small" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Overlay Mobile', 'rexpansive' ); ?>">
                            <i class="rex-icon">r</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div class="col rex-check-icon">
                        <input type="checkbox" id="block-has-overlay-medium" class="block-has-overlay" name="block-has-overlay-medium" value="medium">
                        <label for="block-has-overlay-medium" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Overlay Tablet', 'rexpansive' ); ?>">
                            <i class="rex-icon">y</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div class="col rex-check-icon">
                        <input type="checkbox" id="block-has-overlay-large" class="block-has-overlay" name="block-has-overlay-large" value="large">
                        <label for="block-has-overlay-large" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Overlay Desktop', 'rexpansive' ); ?>">
                            <i class="rex-icon">x</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>
                <div class="col row">
                    <div id="bg-overlay-block-color-col" class="col">
                        <div>
                            <input id="overlay-color-block-value" type="text" name="overlay-color-block-value" value="rgba(255,255,255,0.5)" size="10">
                            <div id="overlay-block-preview-icon" class="preview-color-icon"></div>
                        </div>
                    </div>
                    <div id="bg-overlay-block-color-palette" class="col">
                        <div id="overlay-block-palette-blue" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,0.6)" />
                            <span class="bg-palette-button"></span>
                        </div>
                        <div id="overlay-block-palette-green" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,0.6)" />
                            <span class="bg-palette-button"></span>
                        </div>
                        <div id="overlay-block-palette-black" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,0.6)" />
                            <span class="bg-palette-button"></span>
                        </div>
                        <div id="overlay-block-palette-red" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,0.6)" />
                            <span class="bg-palette-button"></span>
                        </div>
                        <div id="overlay-block-palette-orange" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(255,152,0,0.6)" />
                            <span class="bg-palette-button"></span>
                        </div>	
                        <div id="overlay-block-palette-transparent" class="bg-palette-selector">
                            <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)" />
                            <span class="bg-palette-button">
                                <i class="material-icons rex-icon">o</i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="bg-set-link-wrap" class="row">
                <div class="col">
                    <div class="input-field rex-input-prefixed">
                        <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="Link">l</i>
                        <input type="text" id="block_link_value" name="block_link_value" value="" size="30">
                        <label for="block_link_value">http://www...</label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
                <div class="col">
                    <div class="input-field rex-col2 rex-input-prefixed">
                        <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="Custom Class">e</i>
                        <input type="text" id="block_custom_class" name="block_custom_class" value="">
                        <label for="block_custom_class">
                            Classes
                        </label>
                        <span class="rex-material-bar"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="background_set_bottom rex-modal-footer">
            <button id="background_set_cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="image">
                <i class="rex-icon">n</i>
            </button>
            <button id="background_set_save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="" data-block_id="" data-block_parent="" data-section_id="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- Block settings and section background settings -->

<div class="rex-modal-wrap rex-fade">
    <div id="modal-background-responsive-set" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">

            <div id="section-config-first-row" class="row valign-wrapper">

                <div class="col valign-wrapper">
                    <div class="rex-edit-layout-wrap">
                        <div>
                            <input type="radio" id="section-fixed" name="section-layout" class="builder-edit-row-layout with-gap" value="fixed" checked title="Grid Layout" />
                            <label for="section-fixed"  class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Grid Layout', 'rexspansive' ); ?>">
                                <i class="material-icons">&#xE8F1;</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="section-masonry" name="section-layout" class="builder-edit-row-layout with-gap" value="masonry" title="Masonry Layout" />
                            <label for="section-masonry"  class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Masonry Layout', 'rexspansive' ); ?>">
                                <i class="material-icons">&#xE871;</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div></div>

                <div class="col row valign-wrapper layout-wrap">
                    <div>
                        <input type="radio" id="section-full-modal" name="section-dimension-modal" class="builder-edit-row-dimension-modal with-gap" value="full" title="Full" />
                        <label for="section-full-modal" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Full', $this->plugin_name ); ?>">
                            <i class="material-icons rex-icon">v</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                    <div>
                        <input id="section-boxed-modal" type="radio" name="section-dimension-modal" class="builder-edit-row-dimension-modal with-gap" value="boxed" title="Boxed" />
                        <label for="section-boxed-modal" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Boxed', $this->plugin_name ); ?>">
                            <i class="material-icons rex-icon">t</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>

                <div class="col row valign-wrapper">
                    <div id="section-set-dimension" class="input-field rex-input-prefixed col">
                        <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Boxed Width', 'rexpansive' ); ?>">t</i>
                        <input type="text" id="" class="section-set-boxed-width" name="section-set-boxed-width" value="0000" placeholder="" size="23">
                        <span class="rex-material-bar"></span>
                    </div>
                    <div class="section-set-boxed-width-wrap col">
                        <div class="rex-check-text">
                            <input id="block-width-percentage" type="radio" class="section-width-type with-gap" name="section-width-type" value="percentage" checked />
                            <label for="block-width-percentage">
                                <?php _e( '%', 'rexpansive' ); ?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-text">
                            <input id="block-width-pixel" type="radio" class="section-width-type with-gap" name="section-width-type" value="pixel" />
                            <label for="block-width-pixel">
                                <?php _e( 'PX', 'rexpansive' ); ?>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
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
                                <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Block Distance', 'rexpansive' ); ?>">S</i>
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
                            <label for="section-is-full" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Full Height', 'rexpansive' ); ?>">
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
                    <input type="checkbox" id="section-active-photoswipe" name="section-active-photoswipe" title="<?php _e( 'All Images Zoom', 'rexpansive' ); ?>">
                    <label for="section-active-photoswipe" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'All Images Zoom', 'rexpansive' ); ?>">
                        <i class="rex-icon">R</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>

                <div id="rx-set-hold-grid" class="b-col">
                    <div id="rx-hold-grid__wrap" class="rex-check-icon col">
                        <input type="checkbox" id="rx-hold-grid" name="rx-hold-grid" value="full-height">
                        <label for="rx-hold-grid" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Grid On Mobile', 'rexpansive' ); ?>">
                            <i class="rex-icon">V</i>
                            <span class="rex-ripple"></span>
                        </label>
                    </div>
                </div>

            </div>

            <div class="row valign-wrapper id-class-row-wrap">
                <div id="rex-config-id" class="input-field col rex-input-prefixed">
                    <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Section Name', 'rexpansive' ); ?>">B</i>
                    <input type="text" id="sectionid-container" name="sectionid-container">
                    <span class="rex-material-bar"></span>
                </div>
                <div id="section-set-class-wrap" class="input-field col rex-input-prefixed">
                    <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Custom Class', 'rexpansive' ); ?>">e</i>
                    <input type="text" id="section-set-custom-class" name="section-set-custom-class" value="" size="10">
                    <label for="section-set-custom-class">
                        <?php _e( 'Classes', 'rexpansive'); ?>
                    </label>
                    <span class="rex-material-bar"></span>
                </div>
            </div><!-- custom classes -->
        </div>
        <div class="backresponsive-set-bottom rex-modal-footer">
            <button id="backresponsive-set-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button">
                <i class="rex-icon">n</i>
            </button>
            <button id="backresponsive-set-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" data-section_id="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- Section settings -->

<div id="modal-text-fill" class="modal rex-modal rexbuilder-materialize-wrap" style="display:none;">
    <div class="modal-content">

        <div class="row">
            <div class="col">
                <div class="valign-wrapper">
                    <div id="" class="rex-button-with-plus">
                        <div id="bg-img-preview">
                            <i class="material-icons rex-icon">p</i>
                        </div>
                        <button id="textfill-background-upload-button" class="rex-plus-button btn-floating light-blue darken-1" value="" title="Select Image">
                            <i class="material-icons">&#xE145;</i>
                        </button>
                        <input id="textfill-background-image-url" type="hidden" name="textfill-background-image-url" value="">
                        <input id="textfill-background-image-id" type="hidden" name="textfill-background-image-id" value="">
                    </div>
                </div>
            </div>
            <div class="rex-space rex-space-12"></div>
            <div class="col">
                <div class="input-field rex-col2 rex-input-prefixed">
                    <i class="material-icons rex-icon prefix tooltipped" data-position="bottom" data-tooltip="Custom Class">e</i>
                    <input type="text" id="textfill-text" name="textfill-text" value="">
                    <label for="textfill-text">
                        Text
                    </label>
                    <span class="rex-material-bar"></span>
                </div>
            </div>
            <div class="col valign-wrapper">
                <div class="input-field rex-input-prefixed col">
                    <input type="text" id="textfill-font-size" class="" name="textfill-font-size" value="00" placeholder="" size="15">
                    <span class="rex-material-bar"></span>
                </div>
                <div class="rex-col-text col">
                    <span>PX</span>
                </div>
            </div>
        </div>

        <div id="background-set-color" class="background_set_color row valign-wrapper">
            <div class="col">
                <div class="valign-wrapper">
                    <div class="rex-relative-col">
                        <input type="hidden" id="textfill-background-color-runtime" name="textfill-background-color-runtime" value="">
                        <input id="textfill-background-color" type="text" name="textfill-background-color" value="" size="10">
                        <div id="background-preview-icon" class="preview-color-icon"></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div id="bg-color-palette" class="clearfix">
                    <div id="palette-blue" class="bg-palette-selector">
                        <input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)" />
                        <span class="bg-palette-button"></span>
                    </div>
                    <div id="palette-green" class="bg-palette-selector">
                        <input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)" />
                        <span class="bg-palette-button"></span>
                    </div>
                    <div id="palette-black" class="bg-palette-selector">
                        <input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)" />
                        <span class="bg-palette-button"></span>
                    </div>
                    <div id="palette-red" class="bg-palette-selector">
                        <input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)" />
                        <span class="bg-palette-button"></span>
                    </div>
                    <div id="palette-orange" class="bg-palette-selector">
                        <input class="bg-palette-value" type="hidden" value="rgba(255,152,0,1)" />
                        <span class="bg-palette-button"></span>
                    </div>						
                    <div id="palette-purple" class="bg-palette-selector">
                        <input class="bg-palette-value" type="hidden" value="rgba(156,39,176,1)" />
                        <span class="bg-palette-button"></span>
                    </div>						
                    <div id="palette-transparent" class="bg-palette-selector">
                        <input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)" />
                        <span class="bg-palette-button">
                            <i class="material-icons rex-icon">o</i>
                        </span>
                    </div>
                </div>
            </div>				
        </div>

        <div id="textfill-set-align-wrap" class="row valign-wrapper">
            <div class="col">
                <div>
                    <div>
                        <input id="textfill-text-align-left" type="radio" class="content-position with-gap" name="textfill-text-align" value="left" />
                        <label for="textfill-text-align-left" class="tooltipped" data-position="bottom" data-tooltip="Left">
                            <span class="rex-ripple"></span>
                            <i class="material-icons">&#xE236;</i>
                        </label>
                    </div>
                    <input id="textfill-text-align-center" type="radio" class="content-position with-gap" name="textfill-text-align" value="center" />
                    <label for="textfill-text-align-center" class="tooltipped" data-position="bottom" data-tooltip="Center">
                        <span class="rex-ripple"></span>
                        <i class="material-icons">&#xE234;</i>
                    </label>
                    <input id="textfill-text-align-right" type="radio" class="content-position with-gap" name="textfill-text-align" value="right" />
                    <label for="textfill-text-align-right" class="tooltipped" data-position="bottom" data-tooltip="Right">
                        <span class="rex-ripple"></span>
                        <i class="material-icons">&#xE237;</i>
                    </label>
                </div>
            </div>

            <div class="col">
                <div class="clearfix">
                    <div class="block-padding-wrap">
                        <input type="text" id="textfill-padding-top" class="block-padding-values" name="textfill-padding-top" value="0" />
                        <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Top">d</i>
                    </div>
                </div>
                <div class="clearfix">
                    <div class="block-padding-wrap">				
                        <input type="text" id="textfill-padding-left" class="block-padding-values" name="textfill-padding-left" value="0" />
                        <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Left">a</i>
                    </div>
                    <div id="block-padding-future-content"></div>
                    <div class="block-padding-wrap">
                        <input type="text" id="bm-textfill-padding-right" class="block-padding-values" name="textfill-padding-right" value="0" />
                        <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Right">c</i>
                    </div>
                </div>
                <div class="clearfix">
                    <div class="block-padding-wrap">				
                        <input type="text" id="textfill-padding-bottom" class="block-padding-values" name="textfill-padding-bottom" value="0" />
                        <i class="rex-icon tooltipped" data-position="bottom" data-tooltip="Padding Bottom">b</i>
                    </div>
                </div>
            </div>

            <div class="rex-vertical-check-wrap col">
                <div class="rex-check-text">
                    <input id="texftill-pad-percentage" type="radio" class="bm-block-padding-type with-gap" name="textfill-padding-type" value="percentage" checked />
                    <label for="texftill-pad-percentage">
                        %
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="rex-check-text">
                    <input id="texftill-pad-pixel" type="radio" class="bm-block-padding-type with-gap" name="textfill-padding-type" value="pixel" />
                    <label for="texftill-pad-pixel">
                        PX
                        <span class="rex-ripple"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
        
    <div class="rex-modal-footer">
        <button id="textfill-set-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button">
            <i class="rex-icon">n</i>
        </button>
        <button id="textfill-set-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" data-section_id="">
            <i class="rex-icon">m</i>
        </button>
    </div>
</div> <!-- TextFill Settings -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-slider-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">

            <?php include('rexbuilder-modal-loader.php'); ?>

            <div class="rex-slider__slide-list rex-modal-content__modal-area">
                <div class="col rex-slider__slide rex-modal-content__modal-area__row" data-slider-slide-id="0" data-block_type="slide">

                    <div class="valign-wrapper space-between-wrapper">
                        <button class="rex-slider__slide-index btn-circle btn-small btn-bordered grey-border border-darken-2 waves-effect waves-light white grey-text text-darken-2">1</button>

                        <div class="rex-button-with-plus">
                            <button class="rex-slider__slide-edit rex-slider__slide__image-preview btn-floating waves-effect waves-light tooltipped grey darken-2" value="edit-slide" data-position="bottom" data-tooltip="<?php _e( 'Slide', 'rexpansive-classic' ); ?>">
                                <i class="material-icons rex-icon">p</i>
                            </button>
                            <button class="rex-slider__slide-edit rex-plus-button btn-floating light-blue darken-1 tooltipped" value="add-slide" data-position="bottom" data-tooltip="<?php _e( 'Select Image', 'rexpansive-classic' ); ?>">
                                <i class="material-icons">&#xE145;</i>
                            </button>
                        </div>

                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="text" data-position="bottom" data-tooltip="<?php _e( 'Text', 'rexpansive-classic' ); ?>">
                            <i class="material-icons rex-icon">u</i>
                        </button>

                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="video" data-position="bottom" data-tooltip="<?php _e( 'Video', 'rexpansive-classic' ); ?>">
                            <i class="material-icons">play_arrow</i>
                        </button>

                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="url" data-position="bottom" data-tooltip="<?php _e( 'Link', 'rexpansive-classic' ); ?>">
                            <i class="material-icons rex-icon">l</i>
                        </button>
                        
                        <div>
                            <button class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="copy" data-tooltip="<?php _e('Copy slide', 'rexpansive-classic'); ?>">
                                <i class="material-icons grey-text text-darken-2">&#xE14D;</i>
                            </button>

                            <div class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="move" data-tooltip="<?php _e('Move slide', 'rexpansive-classic'); ?>">
                                <i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
                            </div>

                            <button class="rex-slider__slide-edit btn-flat tooltipped" value="delete" data-position="bottom" data-tooltip="<?php _e('Delete slide', 'rexpansive-classic'); ?>">
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
                <button id="rex-slider__add-new-slide" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Add slide', 'rexpansive-classic' ) ?>">
                    <i class="material-icons text-white">&#xE145;</i>
                </button>
            </div><!-- // .rex-slider__add-slide__wrap -->

            <div class="rex-slider__settings--wrap rex-modal-content__modal-area rex-modal-content__modal-area--bordered">
                <div class="col">
                    <div class="valign-wrapper space-between-wrapper">
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__autostart" name="rex-slider__autostart" title="<?php _e('Autostart','rexpansive-classic'); ?>">
                            <label for="rex-slider__autostart" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Autostart','rexpansive-classic'); ?>">
                                <i class="rex-icon">J</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__prev-next" name="rex-slider__prev-next" title="<?php _e('Prev Next','rexpansive-classic'); ?>">
                            <label for="rex-slider__prev-next" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Prev Next','rexpansive-classic'); ?>">
                                <i class="rex-icon">K</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__dots" name="rex-slider__dots" title="<?php _e('Dots','rexpansive-classic'); ?>">
                            <label for="rex-slider__dots" class="tooltipped" data-position="bottom" data-tooltip="<?php _e('Dots','rexpansive-classic'); ?>">
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
                'post_type'              => array( 'rex_slider' ),
                'post_status'            => array( 'publish' ),
                'posts_per_page'         => '-1',
            );

            // The Query
            $query = new WP_Query( $args );

            ?>
                <div class="rx__select-wrap">
                    <input class="title-slider" type="text">
                    <select id="rex-slider__import" class="rx__form-input">
                        <option value="0"><?php _e( 'New Slider', 'rexpansive-classic' ); ?></option>
                        <?php
                        // Printing all sliders avaiable
                        if ( $query->have_posts() ) {
                            while ( $query->have_posts() ) {
                                $query->the_post();
                                ?>
                        <option value="<?php the_ID(); ?>"><?php the_title(); ?></option>
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
    </div><!-- Insert RexSlider -->

</div>

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
                        <label for="rex-slide-choose-vimeo" data-tooltip="<?php _e( 'Vimeo', 'rexpansive-classic' ); ?>">
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
    </div><!-- //.rex-slider__links-editor -->

</div>

<div class="rex-modal-wrap rex-fade">
    <div id="rex-model-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">

            <?php include('rexbuilder-modal-loader.php'); ?>

            <div class="rex-model__add-model__wrap rex-modal-content__modal-area--bordered rex-modal-content__modal-area" style="display:flex;">
                <div id="rex-model__name__wrap" class="input-field col rex-input-prefixed rex-input-prefixed--no-prefix" style="width:100%;">
                    <span class="prefix"></span>
                    <input type="text" id="rex-model__name" name="rex-model__name">
                    <label for="rex-model__name" class=""><?php _e( 'Model name', 'rexpansive' ); ?></label>
                    <span class="rex-material-bar"></span>
                </div>
                <button id="rex-model__add-new-model" class="builder-button btn-floating btn-no-shadow btn-bordered btn-bordered--inactive tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Add model', 'rexpansive-classic' ) ?>">
                    <i class="material-icons">&#xE145;</i>
                </button>
            </div><!-- // .rex-model__add-model__wrap -->

            <div class="rex-model__import--wrap rex-modal-content__modal-area">

            <?php
            // WP_Query arguments
            $args = array(
                'post_type'              => array( 'rex_model' ),
                'post_status'            => array( 'publish', 'private' ),
                'posts_per_page'         => '-1',
            );

            // The Query
            $query = new WP_Query( $args );

            ?><div class="rx__select-wrap">
                <select id="rex-model__import" class="rx__form-input"><option value="0"><?php _e( 'New Model', 'rexpansive-classic' ); ?></option><?php
            // The Loop
            if ( $query->have_posts() ) {
                while ( $query->have_posts() ) {
                    $query->the_post();
                    ?><option value="<?php the_ID(); ?>" data-preview-url="<?php echo get_permalink(); ?>"><?php the_title(); ?></option><?php
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

<div class="rex-lightbox" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="rex-lightbox__bg"></div>

	<div class="rex-lightbox__scroll-wrap">
		<div class="rex-lightbox__container">
			<div class="rex-lightbox__item"></div>
		</div>
        <div class="rex-lightbox__ui rex-lightbox__ui--hidden">
			<div class="rex-lightbox__top-bar">
                <button class="rex-lightbox__button rex-lightbox__button--close" title="<?php _e( 'Close (Esc)', 'rexpansive-builder' ); ?>"><i class="material-icons white-text">&#xE5CD;</i></button>
            </div>
        </div>
    </div>
</div><!-- Lightbox -->

<div class="rex-modal-wrap rex-fade">

    <div id="rexeditor-expand-modal" class="rex-modal-draggable z-depth-4">
        <div class="modal-wrap">
            <header class="rexeditor-header clearfix">
                <h2><?php _e('Insert content', 'rexpansive-classic'); ?></h2>
                <div id="rexeditor-expand-close"><span class="dashicons dashicons-no-alt"></span></div>
            </header>

            <div class="expand-editor-fieldwrap">
                <div class="expand-editor-topfields">
                    <label for="expand-background"><?php _e( 'Background Image', 'rexpansive-classic' ); ?></label>
                    <input type="text" name="expand-background" class="exp-back-holder" data-image_id=''>
                    <button class="button button-primary button-large exp-back-upload"><?php _e( 'Select Background', 'rexpansive-classic' ); ?></button><br><br>
                    <label for="expand-side"><?php _e( 'Choose Expand Side', 'rexpansive-classic' ); ?></label>
                    <input type="radio" class="exp-side-holder" name="expand-side" value="left" checked><?php _e( 'Left', 'rexpansive-classic' ); ?>
                    <input type="radio" class="exp-side-holder" name="expand-side" value="right"><?php _e( 'Right', 'rexpansive-classic' ); ?><br><br>
                    <label for="expand-title"><?php _e( 'Title', 'rexpansive-classic' ); ?></label>
                    <input type="text" name="expand-title" class="exp-title-holder"/>
                    <input type="text" name="expand-icon" class="exp-icon-holder" data-icon_id=''/>
                    <button class="button button-primary button-large exp-icon-upload"><?php _e( 'Select Icon', 'rexpansive-classic' ); ?></button>
                    <br><br>
                    <label for="expand-foreground"><?php _e( 'Foreground Image', 'rexpansive-classic' ); ?>
                        <input type="text" name="expand-foreground" class="zak-foreground-holder" data-foreground-id=''/>
                    </label>
                    <button class="button button-primary button-large zak-foreground-upload"><?php _e( 'Select Foreground', 'rexpansive-classic' ); ?></button>
                </div>
                
                <div class="modal-editor-editorarea">
                    <?php wp_editor( '', 'rexbuilder_expand_editor', array( 'editor_height' => 150) ); ?>
                </div>

                <div class="expand-editor-bottomfields">
                    
                </div>
            </div>

            <div class="rexeditor_bottom">
                <button id="expand-editor-cancel" class="button button-large" value="image"><?php _e('Cancel', 'rexpansive-classic'); ?></button>
                <button id="expand-editor-save" class="button button-primary button-large" value=""><?php _e('Save', 'rexpansive-classic'); ?></button>
            </div>
        </div>
    </div><!-- ZAK Editor -->
</div>

<div class="lean-overlay" style="display:none;"></div>
<!-- // .lean-overlay -->

<div id="builder-loading-overlay" style="display:none;position:absolute;width:100%;height:100%;top:0;right:0;background-color:rgba(0,0,0,0.5);z-index:30;">
    <h3 style="color:white;">Loading...</h3>
</div><!-- // #builder-loading-overlay -->

<div class="rex-modal-wrap rex-fade">
    <div id="rex-insert-new-video-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <div class="row valign-wrapper">
                <div class="rex-check rex-check-icon col">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="youtube" id="rex-choose-youtube">
                    <label for="rex-choose-youtube">
                        <i class="material-icons rex-icon">C</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col">
                    <input id="rex-youtube-url" type="text">
                    <label id="rex-youtube-url-label" for="rex-youtube-url">https://youtu.be/...</label>
                </div>
                <div class="set-video-audio-btn col">
                    <input type="checkbox" id="rex-block-video-has-audio" name="rex-block-video-has-audio" title="Audio ON/OFF">
                    <label for="rex-block-video-has-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                        <i class="rex-icon">
                            <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                        </i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <!-- youtube input -->
            </div>
            <div id="section-set-video-wrap-2" class="row valign-wrapper" style="padding-top:16px;">
                <div class="rex-check rex-check-icon col" style="margin-right:5px;">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo">
                    <label for="rex-choose-vimeo">
                        <i class="material-icons rex-icon">Z</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col">
                    <input id="rex-vimeo-url" type="text">
                    <label id="rex-vimeo-url-label" for="rex-vimeo-url">https://player.vimeo.com/video/...</label>
                </div>
                <div class="set-video-audio-btn col">
                    <input type="checkbox" id="rex-block-video-has-audio" name="rex-block-video-has-audio" title="Audio ON/OFF">
                    <label for="rex-block-video-has-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
                        <i class="rex-icon">
                            <span class="rex-icon-audio">L</span><span class="rex-icon-mute">M</span>
                        </i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <!-- vimeo input -->
            </div>
            <div id="section-set-video-wrap-3" class="row valign-wrapper" style="padding-top:32px;">
                <div class="rex-check rex-check-icon col">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="mp4" id="rex-choose-mp4">
                    <label id="rex-upload-mp4" for="rex-choose-mp4">
                        <i class="material-icons rex-icon">A</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col">
                    <input id="rex-mp4-id" type="text">
                    <label id="rex-vimeo-url-label" for="rex-vimeo-url">https://site_name/wp-content/uploads/.../file_name.mp4</label>
                </div>
                <div class="set-video-audio-btn col">
                    <input type="checkbox" id="rex-block-video-has-audio" name="rex-block-video-has-audio" title="Audio ON/OFF">
                    <label for="rex-block-video-has-audio" class="tooltipped" data-position="bottom" data-tooltip="Audio ON/OFF">
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