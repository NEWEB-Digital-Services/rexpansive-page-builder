<?php
/**
 * Modal to insert INLINE videos (wp embed) inside the text of a block
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rexlive-updatevideoinline" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black rex-change-layout-option tool-button--close tippy" data-position="bottom" data-tippy-content="<?php _e( 'Cancel', 'rexpansive-builder');?>" data-rex-option="hide">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <div class="layout-page-changed-description">
                <b><?php _e( 'Insert video url', 'rexpansive-builder' ); ?></b><br>
                <input type="text" id="me-insert-embed-inline-video-text" class="me-insert-embed__value" placeholder="Youtube, Vimeo, DailyMotion,..."><br>
                <span id="me-insert-embed-url-isnot-valid" style="transition:1s;">
                    <b style="color:#b22222;">This value isn't a valid URL.</b>
                </span>                
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save rex-change-layout-option tippy" data-tippy-content="<?php _e('Yes and Continue','rexpansive-builder'); ?>" data-rex-option="uploadvideo">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
        </div>
    </div>
</div> <!-- Layout UpdateVideoInline Popup -->