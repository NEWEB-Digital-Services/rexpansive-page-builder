<?php
/**
 * Modal for RexButton editing
 *
 * @since x.x.x
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-element-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
        <!-- Closing button -->
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="Cancel" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <!-- General wrap -->
        <div class="modal-content">
            <?php include 'rexlive-loader-modal.php'; ?>
            <!-- ACCORDION 1 -->
            <div class="rexpansive-accordion close"></div>
            <!-- ACCORDION 2 -->
            <div class="rexpansive-accordion close">
                <!-- third row -->  
                <div class="bl_modal-row">
                    <div class="rexelement-cont_row10">
                        <div class="rexelement-count-colum_accord">
                            <span class="rex-accordion--toggle">                                
                                <div class="rexbutton-upd-accord_button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                            </span>
                        </div>
                        <div class="rexelement-count-column_1">
                            <div class="rex-relative-col tippy" data-tippy-content="Background Color" tabindex="0">
                                <input type="hidden" id="rex-element-background-color-runtime" name="rex-element-background-color-runtime" value="" />
                                <input id="rex-element-background-color" type="text" name="rex-element-background-color" value="" size="10" />
                                <div id="rex-element-background-color-preview-icon" class="preview-color-icon"></div>
                            </div>
                        </div>
                        <div class="rexelement-count-column_2">
                            <div id="rex-element-background-preview-wrap">
                                <div id="rex-element-preview-background"></div>
                            </div>
                        </div>
                        <div class="rexelement-count-column_3">
                            <i class="fas fa-arrows-alt-v"></i>
                        </div>
                        <div class="rexelement-count-column_4">
                            <!--<input type="text" id="rex-button-height" name="rex-button-height" class="rexbutton-upd-textbox"/>-->
                        </div>
                        <div class="rexelement-count-column_5">
                            <!--<div class="label-px">h</div>-->
                        </div>
                    </div>
                </div>
                <div class="rex-accordion--content" style="display:none;" data-item-status="close">
                    <!-- fourth row -->
                    <div class="bl_modal-row">
                        <div class="rexbutton-cont_row10">
                            <div class="rexbutton-count-colum_accord">
                                <div class="rexbutton-count-colum_accord"></div>
                            </div>
                            <div class="rexbutton-count-column_1">
                                <div class="rex-relative-col tippy" data-tippy-content="Background Hover Color" tabindex="0">
                                    <input type="hidden" id="rex-button-background-hover-color-runtime" name="rex-button-background-hover-color-runtime" value="" />
                                    <input id="rex-button-background-hover-color" type="text" name="rex-button-background-hover-color" value="" size="10" />
                                    <div id="rex-button-background-hover-color-preview-icon" class="preview-color-icon"></div>
                                </div>
                            </div>
                            <div class="rexbutton-count-column_2">
                                <div id="rex-button-background-hover-preview-wrap">
                                    <div id="rex-button-preview-background-hover"></div>
                                </div>
                            </div>
                            <div class="rexbutton-count-column_3"><!-- space for icons --></div>
                            <div class="rexbutton-count-column_4"><!-- space for dimensions --></div>
                            <div class="rexbutton-count-column_5"><!-- space for unit measurement --></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ACCORDION 3 -->
            <div class="rexpansive-accordion close"></div>
        </div>
        <!-- Footer -->
    </div>
</div>
<!-- Edit Element -->