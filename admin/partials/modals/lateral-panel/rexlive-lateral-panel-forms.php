<?php
/**
 * Elements panel
 * 
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div id="rex-elements-list" class="rex-lateral-panel__content">
	<?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/modals/rexlive-loader-lateral-menu.php'; ?>
	<div class="elements-list-wrapper rex-lateral-panel__list">
		<ul class="element-list" itemscope itemtype="http://schema.org/ImageGallery">
			<?php
			if ( Rexbuilder_Utilities::check_plugin_active( 'contact-form-7/wp-contact-form-7.php' ) ) {
				// WP_Query arguments
				$args = array('post_type' => array('wpcf7_contact_form'));

				// The Query
				$query = new WP_Query($args);

				// The Loop
				if ( $query->have_posts() ) {
					while ( $query->have_posts() ) {
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
										<span class="rex-element-wrapper" data-rex-element-id="<?php echo $element_id;?>">
											<span class="rex-element-data"></span>
										</span>
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
						<?php
					}
				} else {
					// There are no forms
					?>
					<div class="lateral-menu-message">
						<div id="import-forms" class="lateral-menu-message__icon-wrap 
							lateral-menu-message__icon-wrap--rounded 
							lateral-menu-message__icon-wrap--lightblue 
							lateral-menu-message__icon-wrap--shadowed 
							lateral-menu-message__icon-wrap--button
							">
							<?php Rexbuilder_Utilities::get_icon('#A013-Template-Import'); ?>
						</div>

						<p class="lateral-menu-message__header"><?php _e( 'Warning!', 'rexpansive-builder' ); ?></p>
						<div class="lateral-menu-message__body">
							<p class="lateral-menu-message__body-element">
								<?php _e( 'No template present.', 'rexpansive-builder' ); ?> 
							</p>

							<p class="lateral-menu-message__body-element">
								<strong><?php _e( 'Click on the icon', 'rexpansive-builder' ); ?></strong> <?php _e( 'to load', 'rexpansive-builder' ); ?>
							</p>

							<p class="lateral-menu-message__body-element">
								<?php _e( 'the form templates.', 'rexpansive-builder' ); ?>
							</p>
						</div>
					</div>
				<?php
				}
			} else {
				// The plugin is not active
				?>
				<div class="lateral-menu-message">
					<div class="lateral-menu-message__icon-wrap"><?php Rexbuilder_Utilities::get_icon('#Z016-Warning'); ?></div>
					<p class="lateral-menu-message__header"><?php _e( 'Warning!', 'rexpansive-builder' ); ?></p>
					<div class="lateral-menu-message__body">
						<p class="lateral-menu-message__body-element">
							<?php _e( 'Activate', 'rexpansive-builder' ); ?> "<strong><?php _e( 'Contact Form 7', 'rexpansive-builder' ); ?></strong>"
						</p>

						<p class="lateral-menu-message__body-element">
							<?php _e( 'plugin to enable form', 'rexpansive-builder' ); ?>
						</p>

						<p class="lateral-menu-message__body-element">
							<?php _e( 'templates.', 'rexpansive-builder' ); ?>
						</p>
					</div>
				</div>
			<?php
			}
			?>
		</ul>
	</div>
</div>