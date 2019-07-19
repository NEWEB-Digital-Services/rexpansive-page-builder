<?php
/**
 * Modal for insert a video block inside a row
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
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