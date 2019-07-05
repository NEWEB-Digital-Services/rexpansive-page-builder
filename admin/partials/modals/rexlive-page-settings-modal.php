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
        <div class="tool-button tool-button--black rex-cancel-button rex-modal__close-button tool-button--close tippy" data-tippy-content="<?php _e( 'Close', 'rexpansive' ); ?>" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content">
            <div class="bl_modal-row bl_modal-row--no-padding">
                <div class="bl_modal__option-wrap bl_modal__option-wrap--fluid">
                    <div class="tippy" data-tippy-content="<?php _e( 'Top Distance', 'rexpansive' ); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z012-HeightBars', 'l-svg-icons--big'); ?>
                    </div>
                </div>
                <div class="">
                    <div style="width:100%;">
                        <div class="bl_modal-row">
                            <div class="bl_modal__option-wrap bl_modal__option-wrap--fluid">
                                <div class="rex-check rex-check-icon tippy" data-tippy-content="<?php _e( 'All pages', 'rexpansive' ); ?>">
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
                                <div class="rex-check rex-check-icon tippy" data-tippy-content="<?php _e( 'This page', 'rexpansive' ); ?>">
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
            </div>

            <!-- <div class="toolbox-distancer-aligner">
                <div class="toolbox-distancer-container">
                    <div class="toolbox-distancer-column1">
                        <?php Rexbuilder_Utilities::get_icon('#Z012-HeightBars'); ?>
                    </div>
                    <div class="toolbox-distancer-column2">
                        <input id="bb" type="radio" name="select-page-or-global" value="percentage" checked="checked">
                        <input id="aa" type="radio" name="select-page-or-global" value="pixel">
                        <input type="radio"name="section-width-type" checked="checked">
                        <input type="radio"name="section-width-type">
                    </div>
                    <div class="toolbox-distancer-column3">
                        <div class="toolbox-distancer-row">
                            <input type="text" id="abc" name="abc" placeholder="10" class="distancer-textbox tippy" data-tippy-content="<?php _e('page height bar','rexpansive'); ?>">
                        </div>                    
                        <div class="toolbox-distancer-row">
                            <input type="text" id="def" name="def" placeholder="20" class="distancer-textbox tippy" data-tippy-content="<?php _e('global height bar','rexpansive'); ?>">
                        </div>
                </div>
            </div> -->
        </div>
        </div>
        <!-- FOOTER
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-apply-button tippy" data-tippy-content="<?php _e('save','rexpansive'); ?>" data-rex-option="save">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
                <div class="tool-button tool-button--inline tool-button--cancel rex-reset-button tippy" data-rex-option="continue" data-tippy-content="<?php _e('reset','rexpansive'); ?>">
                <span class="rex-button continue btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
            </div>
        </div> -->
    </div>
</div><!-- page settings -->