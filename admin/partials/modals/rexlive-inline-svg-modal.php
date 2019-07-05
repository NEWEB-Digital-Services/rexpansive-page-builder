<?php
/**
 * Modal to insert INLINE SVGs inside the text of a block
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rexlive-inline-svg" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black tool-button--close tippy" data-position="bottom" data-tippy-content="<?php _e( 'Cancel', 'rexspansive');?>" data-rex-option="hide">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <div class="rx__select-wrap">                        
                <select name="rexlive-inline-svg-select" id="rexlive-inline-svg-select" class="rx__form-input">
                    <option value=""><?php _e( 'Choose Icon', 'rexpansive-builder' ); ?></option>
                <?php
                $icons = apply_filters( 'rexpansive_builder_live_inline_icon_list', Rexbuilder_Utilities::get_icon_list() );
                if ( $icons )
                {
                    foreach( $icons as $icon_group => $icons )
                    {
                        foreach( $icons as $icon )
                        {
                            ?><option value="<?php echo esc_attr( $icon ); ?>" data-svg-class="<?php echo esc_attr( $icon_group ); ?>"><?php echo $icon; ?></option><?php
                        }
                    }
                }
                ?>
                </select>
                <div class="rx__form-input__select-arrow"></div>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save tippy" data-tippy-content="<?php _e('Yes and Continue','rexpansive'); ?>" data-rex-option="uploadvideo">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
        </div>
    </div>
</div> <!-- / #rexlive-inline-svg -->