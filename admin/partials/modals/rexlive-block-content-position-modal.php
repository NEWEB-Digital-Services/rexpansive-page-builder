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
    <div id="rex-block-content-position-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="background-options-area modal-content"> 
            <div id="block-set-class-wrap" class="bl_modal-row bl_modal-row--no-border">
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
</div>
<!-- Block settings background settings -->