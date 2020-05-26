<?php
/**
* Modal to set custom settings for a page
*
* @since 2.0.0
* @package    Rexbuilder
* @subpackage Rexbuilder/admin/partials/modals
*/
defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap rex-modal-resize-min">
    <div id="rex-page-settings-modal" class="rex-modal rex-modal--small rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
        <div class="tool-button tool-button--black rex-cancel-button rex-modal__close-button tool-button--close tippy" data-tippy-content="<?php _e( 'Close', 'rexpansive-builder' ); ?>" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content">
            <div class="bl_modal-row bl_modal-row--no-padding">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--fluid">
                    <div class="tippy" data-tippy-content="<?php _e( 'Top Distance', 'rexpansive-builder' ); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z012-HeightBars', 'l-svg-icons--big'); ?>
                    </div>
                </div>
                <div>
                    <div class="bl_modal-row">
                        <div class="bl_modal__option-wrap bl_modal__option-wrap--fluid">
                            <div class="rex-check rex-check-icon tippy" data-tippy-content="<?php _e( 'All pages', 'rexpansive-builder' ); ?>">
                                <label>
                                    <input type="radio" name="container-distancer" value="global" class="with-gap">
                                    <span>
                                        <?php Rexbuilder_Utilities::get_icon('#Z013-Pages'); ?>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div class="bl_modal__option-wrap">
                            <div class="input-field input-field--medium">
                                <input type="text" id="container-distancer--global-mtop" data-context="global" name="container-distancer--mtop">
                            </div>
                            <span class="bl_input-indicator">PX</span>
                        </div>
                    </div>
                    <div class="bl_modal-row">
                        <div class="bl_modal__option-wrap bl_modal__option-wrap--fluid">
                            <div class="rex-check rex-check-icon tippy" data-tippy-content="<?php _e( 'This page', 'rexpansive-builder' ); ?>">
                                <label>
                                    <input type="radio" name="container-distancer" value="custom" class="with-gap">
                                    <span>
                                        <?php Rexbuilder_Utilities::get_icon('#Z012-Page'); ?>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div class="bl_modal__option-wrap">
                            <div class="input-field input-field--medium">
                                <input type="text" id="container-distancer--custom-mtop" data-context="custom" name="container-distancer--mtop">
                            </div>
                            <span class="bl_input-indicator">PX</span>
                        </div>
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
    </div>
</div><!-- page settings -->