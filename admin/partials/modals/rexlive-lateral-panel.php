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
        </ul>
        <div class="tool-button tool-button--black tool-button--close rex-close-button rex-lateral-panel--close">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
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
                        $model_previewUrl = get_the_post_thumbnail_url();
                        ?>
                        <li class="model__element bl_d-flex bl_ai-c" draggable="true" data-rex-model-id="<?php echo $model_id;?>">
                            <div class="model-preview bl_d-flex bl_jc-c bl_ai-c<?php echo ( $model_previewUrl != "" ? ' model-preview--active' : '' ); ?>"<?php echo ( $model_previewUrl != "" ? 'style="background-image:url(' . $model_previewUrl . ');"' : '' ); ?> itemprop="contentUrl" data-href="<?php echo ( $model_previewUrl != "" ? esc_url($model_previewUrl) : "https://via.placeholder.com/640x480" ); ?>" data-size="640x480">
                                <span class="model-preview__placeholder"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
                                <div class="model-name bl_d-flex bl_jc-c bl_ai-fe"><div><?php echo $model_title;?></div></div>
                                <div class="tool-button tool-button--black tool-button--close rex-close-button model__element--edit" style="position:absolute;top:0;right:20px;">
                                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                                </div>
                                <div class="tool-button tool-button--black tool-button--close rex-close-button model__element--delete">
                                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
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
                                <div class="tool-button tool-button--black tool-button--close rex-close-button button__element--delete">
                                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                                </div>
                            </li>
                            <?php
                        }
                    }
                    ?>
                </ul>
            </div>
        </div>
    </div>
</div>