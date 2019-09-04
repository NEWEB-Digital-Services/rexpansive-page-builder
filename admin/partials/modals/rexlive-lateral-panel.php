<?php
/**
 * Panel that contains models for rows and buttons
 * and that slides from the left on a button click
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div id="rexbuilder-lateral-panel" class="rex-lateral-panel">
    <div class="top-lateral-tools clearfix">
        <ul class="rex-lateral-tabs-list bl_d-flex" data-tabgroup="rex-lateral-tabs">
            <li><a href="#" data-rex-tab-target="rex-models-list" class="active"><?php _e( 'Models', '' ); ?></a></li>
            <li><a href="#" data-rex-tab-target="rex-buttons-list"><?php _e( 'Buttons', '' ); ?></a></li>
            <li><a href="#" data-rex-tab-target="rex-elements-list"><?php _e( 'Elements', '' ); ?></a></li>
        </ul>
        <div class="tool-button tool-button--black tool-button--close rex-close-button rex-lateral-panel--close">
            <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
        </div>
    </div>
    <div id="rex-lateral-tabs" class="tabgroup">
        <div id="rex-models-list" class="rex-lateral-panel__content">
            <?php include 'rexlive-loader-modal.php'; ?>
            <div class="models-list-wrapper rex-lateral-panel__list">
                <ul class="model-list model-list--pswp" itemscope itemtype="http://schema.org/ImageGallery">
                    <?php
                // WP_Query arguments
                $args = array(
                    'post_type' => array('rex_model'),
                    'post_status' => array('publish', 'private'),
                    'posts_per_page' => '-1',
                );

                // The Query
                
                $query = new WP_Query($args);
                // The Loop
                if ($query->have_posts()) {
                    while ($query->have_posts()) {
                        $query->the_post();
                        $model_id = get_the_ID();
                        $model_title =  get_the_title();
                        $image_size = get_post_meta($model_id, 'selected_image_size', true);
                        $model_previewUrl = get_the_post_thumbnail_url($model_id, $image_size);
                        $image_id = get_post_thumbnail_id();
                        ?>
                        <li class="model__element bl_d-flex bl_ai-c" draggable="true" data-rex-model-id="<?php echo $model_id;?>" data-rex-model-thumbnail-id="<?php echo $image_id;?>" data-rex-model-thumbnail-size="<?php echo $image_size;?>">
                            <div class="model-preview bl_d-flex bl_jc-c bl_ai-c<?php echo ( $model_previewUrl != "" ? ' model-preview--active' : '' ); ?>"<?php echo ( $model_previewUrl != "" ? 'style="background-image:url(' . $model_previewUrl . ');"' : '' ); ?> itemprop="contentUrl" data-href="<?php echo ( $model_previewUrl != "" ? esc_url($model_previewUrl) : "https://via.placeholder.com/640x480" ); ?>" data-size="640x480">
                                <span class="model-preview__placeholder"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
                                <div class="model-name bl_d-flex bl_jc-c bl_ai-fe"><div><?php echo $model_title;?></div></div>
                                <div class="model-tools">
                                    <div class="tool-button--double-icon--wrap tool-button--edit-thumbnail tippy" data-tippy-content="<?php _e('Thumbnail','rexpansive-builder'); ?>">
                                        <div class="tool-button tool-button--inline tool-button--black model__element--edit-thumbnail <?php echo ( $model_previewUrl != "" ? 'tool-button--image-preview' : '' ); ?>" <?php echo ( $model_previewUrl != "" ? 'style="background-image:url(' . $model_previewUrl . ');"' : '' ); ?>>
                                            <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                                        </div>
                                        <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate tool-button--reset-thumbnail model__element--reset-thumbnail">
                                            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                                        </div>
                                    </div>
                                    <div class="tool-button tool-button--black rex-close-button model__element--delete" >
                                        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <?php
                    }
                } else {
                    // no posts found
                }
                // Restore original Post Data
                wp_reset_postdata(); 
                ?></ul>
            </div>
        </div>
        <div id="rex-buttons-list" class="rex-lateral-panel__content">
            <?php include 'rexlive-loader-modal.php'; ?>
            <div class="buttons-list-wrapper rex-lateral-panel__list">
                <ul class="button-list button-list--pswp">
                        <?php 
                        // it's possibile to query like '_rex_button_%%_html0'?
                    $defaultButtonsIDs = '[]';
                    $buttonsIDsJSON = get_option('_rex_buttons_ids', $defaultButtonsIDs);
                    $buttonsIDsJSON = stripslashes($buttonsIDsJSON);
                    $buttonsIDsUsed = json_decode($buttonsIDsJSON, true);
                    foreach ($buttonsIDsUsed as $index => $id_button) {
                        $buttonHTML = get_option('_rex_button_'.$id_button.'_html', "");
                        if($buttonHTML != ""){
                            $buttonHTML = stripslashes($buttonHTML);
                            ?>
                            <li class="button-list__element" draggable="true">
                                <div class="rex-container"><?php echo $buttonHTML ?></div>
                                <div class="button-list__element__tools">
                                    <div class="tool-button tool-button--black rex-close-button button__element--delete">
                                        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                                    </div>
                                </div>
                            </li>
                            <?php
                        }
                    }
                    ?>
                </ul>
            </div>
        </div>
        <div id="rex-elements-list" class="rex-lateral-panel__content">
            <?php include 'rexlive-loader-modal.php'; ?>
            <div class="elements-list-wrapper rex-lateral-panel__list">
                <ul class="element-list element-list--pswp" itemscope itemtype="http://schema.org/ImageGallery">
                    <?php
                        // WP_Query arguments
                        $args = array(
                            'post_type' => array('wpcf7_contact_form')
                        );

                        // The Query
                        $query = new WP_Query($args);

                        // The Loop
                        if ($query->have_posts()) {
                            while ($query->have_posts()) {
                                // In this loop elements are CF7 forms
                                $query->the_post();
                                $element_id = get_the_ID();
                                $element_title =  get_the_title();
                                $image_size = get_post_meta($element_id, 'selected_image_size', true);
                                $image_id = get_post_thumbnail_id();
                                $element_thumbnail_url = get_the_post_thumbnail_url($element_id, $image_size);

                                $shortcodeCF7 = "[contact-form-7 id=\"".$element_id."\" title=\"".$element_title."\"]";
                                ?>

                                <li class="element-list__element bl_d-flex bl_ai-c" draggable="true" data-rex-element-id="<?php echo $element_id;?>"data-rex-element-thumbnail-id="<?php echo $image_id;?>" data-rex-element-thumbnail-size="<?php echo $image_size;?>">
                                        <div class="element-list-preview bl_d-flex bl_jc-c bl_ai-c<?php echo ( $element_thumbnail_url != "" ? ' element-list-preview--active' : '' ); ?>"<?php echo ( $element_thumbnail_url != "" ? 'style="background-image:url(' . $element_thumbnail_url . ');"' : '' ); ?> itemprop="contentUrl" data-href="<?php echo ( $element_thumbnail_url != "" ? esc_url($element_thumbnail_url) : "https://via.placeholder.com/640x480" ); ?>" data-size="640x480">
                                            <span class="element-list-preview__placeholder"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
                                            <div class="element-name bl_d-flex bl_jc-c bl_ai-fe"><div><?php echo $element_title;?></div></div>
                                            <div class="rex-container">
                                                <div class="rex-element-wrapper" data-rex-element-id="<?php echo $element_id;?>"></div>
                                            </div>
                                            <div class="element-tools">
                                                <div class="tool-button--double-icon--wrap tool-button--edit-thumbnail tippy" data-tippy-content="<?php _e('Thumbnail','rexpansive-builder'); ?>">
                                                    <div class="tool-button tool-button--inline tool-button--black element-list__element--edit-thumbnail <?php echo ( $element_thumbnail_url != "" ? 'tool-button--image-preview' : '' ); ?>" <?php echo ( $element_thumbnail_url != "" ? 'style="background-image:url(' . $element_thumbnail_url . ');"' : '' ); ?>>
                                                        <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                                                    </div>
                                                    <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate tool-button--reset-thumbnail element-list__element--reset-thumbnail">
                                                        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                                                    </div>
                                                </div>
                                                <div class="tool-button tool-button--black rex-close-button element-list__element--delete" >
                                                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                                                </div>
                                            </div>
                                        </div>
                                </li>
                                <?
                            }
                        } else {
                            // No forms
                        }?>
                </ul>
            </div>
        </div>
    </div>
</div>