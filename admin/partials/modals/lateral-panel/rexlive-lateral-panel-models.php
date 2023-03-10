<?php
/**
 * Models panel
 * 
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div id="rex-models-list" class="rex-lateral-panel__content">
	<?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/modals/rexlive-loader-modal.php'; ?>
	<div class="models-list-wrapper rex-lateral-panel__list">
		<ul class="model-list model-list--pswp" itemscope itemtype="http://schema.org/ImageGallery">
		<?php
		// WP_Query arguments
		$args = array(
			'post_type' => array('rex_model'),
			'post_status' => array('publish', 'private'),
			'posts_per_page' => '-1',
			'orderby' => 'title',
			'order' => 'ASC'
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
							<div class="tool-button tool-button--black model__element--title-edit tippy" style="margin-right:15px;" data-tippy-content="<?php _e('Edit Title','rexpansive-builder'); ?>">
								<?php Rexbuilder_Utilities::get_icon('#Z008-Edit'); ?>
							</div>
							<div class="tool-button--double-icon--wrap tool-button--edit-thumbnail tippy" data-tippy-content="<?php _e('Thumbnail','rexpansive-builder'); ?>">
								<div class="tool-button tool-button--inline tool-button--black model__element--edit-thumbnail <?php echo ( $model_previewUrl != "" ? 'tool-button--image-preview' : '' ); ?>" <?php echo ( $model_previewUrl != "" ? 'style="background-image:url(' . $model_previewUrl . ');"' : '' ); ?>>
									<?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
								</div>
								<div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate tool-button--reset-thumbnail model__element--reset-thumbnail">
									<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
								</div>
							</div>
							<div class="tool-button tool-button--black rex-close-button model__element--delete tippy" data-tippy-content="<?php _e('Delete','rexpansive-builder'); ?>">
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