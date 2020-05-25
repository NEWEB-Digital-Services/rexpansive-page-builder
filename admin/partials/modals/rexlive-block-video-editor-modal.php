<?php
/**
 * Modal to edit block video background
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
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
                <div id="edit-video-block-wrap-3" class="bl_modal-row mp4-insert-wrap video-insert-wrap bl_modal-row--no-border">
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
                <div class="bl_modal-row"><div class="bl_modal__option-wrap"></div></div>
            </div>
            <!-- /VIDEO BACKGROUND BLOCK -->
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
</div>