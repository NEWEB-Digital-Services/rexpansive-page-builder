<?php
/**
 * Modal to insert/edit RexSliders
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
    <div id="rex-slider-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable">
        <?php Rexbuilder_Utilities::close_button(); ?>
        <div class="modal-content">
            <?php include 'rexbuilder-modal-loader.php';?>
            <div class="rex-slider__import--wrap rex-modal-content__modal-area--bordered">
            <?php
            // WP_Query arguments
            $args = array(
                'post_type' => array('rex_slider'),
                'post_status' => array('publish'),
                'posts_per_page' => '-1',
            );
            // The Query
            $query = new WP_Query($args);
            ?>
                <div class="bl_d-flex bl_ai-c bl_jc-sb bl_rex-slider__list-wrap">
                    <div class="bl_rex-slider__list-icon">
                        <div class="tool-button tool-button--inline tool-button--flat" data-tippy-content="<?php esc_attr_e( 'Models', 'rexpansive' ); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#A012-Models-List'); ?>
                        </div>
                    </div>
                    <div class="rx__select-wrap">
                        <select id="rex-slider__import" class="rx__form-input">
                            <option value="0"><?php _e('Copy from sliders', 'rexpansive-classic');?></option>
                            <?php
                            // Printing all sliders avaiable
                            if ($query->have_posts()) {
                                while ($query->have_posts()) {
                                    $query->the_post();
                                    ?>
                            <option value="<?php the_ID();?>" data-rex-slider-title="<?php the_title(); ?>"><?php _e('Copy from ','rexpansive'); ?>"<?php the_title();?>"</option>
                            <?php
                                }
                            } else {
                                // no posts found
                            }
                            ?>
                        </select>
                        <div class="rx__form-input__select-arrow">
                            <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
                        </div>
                    </div>
                    <?php
                        // Restore original Post Data
                        wp_reset_postdata();
                    ?>
                </div>
            </div>
            <div class="rex-slider__import--wrap rex-modal-content__modal-area rex-modal-content__modal-area--bordered">
                <div class="input-field input-field--small bl_d-flex bl_ai-c">
                    <input class="title-slider" type="text" value="<?php _e('New Slider','rexpansive'); ?>" disabled>
                    <div class="rex_edit_title_slider">
                        <span id="edit_slider_title_live_btn"><?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?></span>
                    </div>
                </div>
                <!-- <div class="rex_edit_slider_title_toolbox">
                    <div class="rex_edit_title_slider">
                        <button id="edit_slider_title_btn">e</button>
                    </div>
                    <div class="rex_save_title_slider">
                        <button id="save_slider_title_btn">s</button>
                    </div>
                    <div class="rex_cancel_title_slider">
                        <button id="cancel_slider_title_btn">c</button>
                    </div>
                </div> -->
            </div>
            <div class="rex-slider__slide-list rex-modal-content__modal-area">
                <div class="col rex-slider__slide rex-modal-content__modal-area__row" data-slider-slide-id="0" data-block_type="slide">
                    <div class="valign-wrapper space-between-wrapper">
                        <button class="rex-slider__slide-index btn-circle btn-small btn-bordered grey-border border-darken-2 waves-effect waves-light white grey-text text-darken-2">1</button>
                        <div class="rex-button-with-plus">
                            <button class="rex-slider__slide-edit rex-slider__slide__image-preview btn-floating waves-effect waves-light tippy grey darken-2" value="edit-slide" data-position="bottom" data-tippy-content="<?php _e('Slide', 'rexpansive-classic');?>">
                                <i class="material-icons rex-icon">p</i>
                            </button>
                            <button class="rex-slider__slide-edit rex-plus-button btn-floating light-blue darken-1 tippy" value="add-slide" data-position="bottom" data-tippy-content="<?php _e('Select Image', 'rexpansive-classic');?>">
                                <i class="material-icons">&#xE145;</i>
                            </button>
                        </div>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tippy grey darken-2" value="text" data-position="bottom" data-tippy-content="<?php _e('Text', 'rexpansive-classic');?>">
                            <i class="material-icons rex-icon">u</i>
                        </button>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tippy grey darken-2" value="video" data-position="bottom" data-tippy-content="<?php _e('Video', 'rexpansive-classic');?>">
                            <i class="material-icons">play_arrow</i>
                        </button>
                        <button class="rex-slider__slide-edit btn-floating waves-effect waves-light tippy grey darken-2" value="url" data-position="bottom" data-tippy-content="<?php _e('Link', 'rexpansive-classic');?>">
                            <i class="material-icons rex-icon">l</i>
                        </button>
                        <div>
                            <button class="rex-slider__slide-edit btn-flat tippy" data-position="bottom" value="copy" data-tippy-content="<?php _e('Copy slide', 'rexpansive-classic');?>">
                                <i class="material-icons grey-text text-darken-2">&#xE14D;</i>
                            </button>
                            <div class="rex-slider__slide-edit btn-flat tippy" data-position="bottom" value="move" data-tippy-content="<?php _e('Move slide', 'rexpansive-classic');?>">
                                <i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
                            </div>
                            <button class="rex-slider__slide-edit btn-flat tippy" value="delete" data-position="bottom" data-tippy-content="<?php _e('Delete slide', 'rexpansive-classic');?>">
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
                <button id="rex-slider__add-new-slide" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tippy" data-position="bottom" data-tippy-content="<?php _e('Add slide', 'rexpansive-classic')?>">
                    <i class="material-icons text-white">&#xE145;</i>
                </button>
            </div>
            <!-- // .rex-slider__add-slide__wrap -->
            <div class="rex-slider__settings--wrap rex-modal-content__modal-area">
                <div class="col">
                    <div class="valign-wrapper space-between-wrapper">
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__autostart" name="rex-slider__autostart" title="<?php _e('Autostart', 'rexpansive-classic');?>">
                            <label for="rex-slider__autostart" class="tippy" data-position="bottom" data-tippy-content="<?php _e('Autostart', 'rexpansive-classic');?>">
                                <i class="rex-icon">J</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__prev-next" name="rex-slider__prev-next" title="<?php _e('Prev Next', 'rexpansive-classic');?>">
                            <label for="rex-slider__prev-next" class="tippy" data-position="bottom" data-tippy-content="<?php _e('Prev Next', 'rexpansive-classic');?>">
                                <i class="rex-icon">K</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                        <div class="rex-check-icon">
                            <input type="checkbox" id="rex-slider__dots" name="rex-slider__dots" title="<?php _e('Dots', 'rexpansive-classic');?>">
                            <label for="rex-slider__dots" class="tippy" data-position="bottom" data-tippy-content="<?php _e('Dots', 'rexpansive-classic');?>">
                                <i class="rex-icon">Y</i>
                                <span class="rex-ripple"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="rex-modal-footer">
            <button id="" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div> -->
        <div class="rex-modal__outside-footer">
            <div id="rex-insert-video-block-save" class="tool-button tool-button--inline tool-button--save rex-save-button tippy" data-tippy-content="<?php esc_attr_e( 'Save Slider', 'rexpansive' ); ?>">
                <div class="btn-save--wrap">
                    <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                    <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
                </div>
            </div>
            <div class="tool-button tool-button--inline tool-button--cancel tool-button--modal rex-undo-button tippy" data-tippy-content="<?php esc_attr_e( 'Undo', 'rexpansive' ); ?>" data-slider-to-edit="">
                <?php Rexbuilder_Utilities::get_icon('#A003-Undo'); ?>
            </div>
        </div>
    </div>
</div>
<!-- Insert RexSlider -->