<?php
/**
 * Modal to insert INLINE SVGs inside the text of a block
 * The select list of the icons has a preview
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 * @date 05-07-2019 Add icon preview
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rexlive-inline-svg" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <div class="tool-button tool-button--black tool-button--close tippy" data-position="bottom" data-tippy-content="<?php _e( 'Cancel', 'rexspansive');?>" data-rex-option="hide">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <div class="modal-content modal-content--text">
            <?php $all_icons = apply_filters( 'rexpansive_builder_live_inline_icon_list', Rexbuilder_Utilities::get_icon_list() ); ?>
            
            <div class="select-box no-draggable">
                <?php
                if ( $all_icons )
                {
                ?>
                <div class="select-box__current" tabindex="1">
                <?php
                    foreach( $all_icons as $icon_group => $icons )
                    {
                        foreach( $icons as $icon )
                        {
                            ?>
                            <div class="select-box__value">
                                <input class="select-box__input" type="radio" id="select-box__input-id--<?php echo esc_attr( $icon ); ?>" value="<?php echo esc_attr( $icon ); ?>" name="rexlive-inline-svg-select" checked="checked" data-svg-class="<?php echo esc_attr( $icon_group ); ?>"/>
                                <p class="select-box__input-text"><?php Rexbuilder_Utilities::get_icon( '#' . $icon ); ?> <?php echo $icon; ?></p>
                            </div>
                            <?php
                        }
                    }
                ?>
                    <div class="select-box__value">
                        <input class="select-box__input" type="radio" value="" name="rexlive-inline-svg-select" checked="checked">
                        <p class="select-box__input-text"><?php _e( 'Select an icon', 'rexpansive-builder' ); ?></p>
                    </div>
                    <span class="select-box__icon"><span class="select-box__icon-wrap"><?php Rexbuilder_Utilities::get_icon( '#A007-Close' ); ?></span></span>
                </div>
                <ul class="select-box__list">
                <?php
                    foreach( $all_icons as $icon_group => $icons )
                    {
                        foreach( $icons as $icon )
                        {
                            ?>
                            <li>
                              <label class="select-box__option" for="select-box__input-id--<?php echo esc_attr( $icon ); ?>" aria-hidden="aria-hidden"><?php Rexbuilder_Utilities::get_icon( '#' . $icon ); ?> <?php echo esc_attr( $icon ); ?></label>
                            </li>
                            <?php
                        }
                    }
                }
                ?>
                </ul>
            </div>
        </div>
        <div class="rex-modal__outside-footer">
            <div class="tool-button tool-button--inline tool-button--save tippy" data-tippy-content="<?php _e('Yes and Continue','rexpansive'); ?>" data-rex-option="uploadvideo">
                <span class="rex-button save-page btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
            </div>
        </div>
    </div>
</div> <!-- / #rexlive-inline-svg -->