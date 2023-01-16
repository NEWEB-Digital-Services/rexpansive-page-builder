<?php

/**
 * The class that register and render a section.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.15
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 */

/**
 * Defines the characteristics of the RexbuilderSection
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 * @author     Neweb <info@neweb.info>
 *
 */
class Rexbuilder_RexSlider {
	/**
	 * @since 2.0.14
	 */
	public static $SLIDER_FLUID_BLOCK_CLASS = 'block-slider--fluid';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct( ) {

	}

	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since    1.0.0
	 * @param      string    $a       			The attributest passed.
	 * @param      string    $content    		The content passed.
	 * @version 1.1.3	Add nav preview feature
	 * @version 1.1.3	Add photoswipe on slider
	 * @version 2.0.14	Add block_classes shortocde attribute
	 * @version 2.0.14	Allow to customize render function
	 */
	public function render_slider( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'slider_id' => '',
			'class' => '',
			'photoswipe' => '',			// handling photoswipe on slider
			'overlay' => '',			// handling overlay on slides
			'block_classes' => ''		// classes that comes from parent block
		), $atts ) );

		$custom_render = apply_filters('rexbuilder_rexslider_custom_render_function', '', $atts);
		if (!empty($custom_render)) {
			return $custom_render;
		}
		ob_start();

		// slider does not exists, return empty
		if( ! Rexbuilder_Utilities::check_post_exists( $slider_id ) ) return ob_get_clean();

		$slider_gallery = get_field( '_rex_banner_gallery', $slider_id );

		if( empty( $slider_gallery ) ) return ob_get_clean();

		$editor = Rexbuilder_Utilities::isBuilderLive();

		$slider_animation = get_field( '_rex_enable_banner_animation', $slider_id );
		$slider_prev_next = get_field( '_rex_enable_banner_prev_next', $slider_id );
		$slider_dots = get_field( '_rex_enable_banner_dots', $slider_id );
		$natural_blur = get_field( '_rex_enable_banner_natural_blur', $slider_id );

		$nav_previewed = get_post_meta( $slider_id, '_rex_slider_previewed_nav', true );
		$nav_previewed_html = '';

		$nav_layout = get_post_meta( $slider_id, '_rex_slider_navigator_layout', true );

		$set_gallery_size = get_post_meta( $slider_id, '_rex_slider_set_gallery_size', true );
		$wrap_around = get_post_meta( $slider_id, '_rex_slider_wrap_around', true );

		$active_video = apply_filters( 'rexpansive_slider_filter_active_video', true );

		$num_slides = count( $slider_gallery );

		$slider_is_fluid = false !== strpos($block_classes, self::$SLIDER_FLUID_BLOCK_CLASS);

		// wrap classes
		$slider_wrap_classes = array('rex-slider-wrap');

		if (1 === $nav_previewed) {
			array_push($slider_wrap_classes, 'rex-slider--bottom-interface');
			if (1 !== $num_slides) {
				array_push($slider_wrap_classes, 'rex-slider--bottom-interface--active');
			}
		}

		array_push($slider_wrap_classes, 'rex-slider--' . $num_slides . '-slides');
		if ("" != $nav_layout) {
			array_push($slider_wrap_classes, 'rex-slider-navigator--' . $nav_layout);
		}

		if ($slider_is_fluid) {
			array_push($slider_wrap_classes, 'rex-slider-wrap--fluid');
		}

		?>
		<div data-slider-id="<?php echo $slider_id;?>" class="<?php echo implode(' ', $slider_wrap_classes); ?>" data-rex-slider-animation="<?php echo ( is_array( $slider_animation ) ? 'true': ( "0" == $slider_animation ? 'true' : 'false' ) ); ?>" data-rex-slider-prev-next="<?php echo ( is_array( $slider_prev_next ) ? '1': ( "0" == $slider_prev_next ? 'true' : 'false' ) ); ?>" data-rex-slider-dots="<?php echo ( is_array( $slider_dots ) ? '1': ( "0" == $slider_dots ? 'true' : 'false' ) ); ?>" data-set-gallery-size="<?php echo esc_attr( ( 1 == $nav_previewed || 1 == $set_gallery_size ) ? 'true' : 'false' ); ?>"<?php echo ( '' !== $wrap_around ? ' data-wrap-around="' . $wrap_around . '"' : '' ); ?> data-rexlider-lazyload="<?php echo ( ! $editor ); ?>">
		<?php

		// creating overlay element
		$overlay_el = '';
		if ( !empty( $overlay ) ) {
			$overlay_el = '<div class="slider-overlay" style="background-color:' . $overlay . '"></div>';
		}

		if ($slider_is_fluid) {
			foreach( $slider_gallery as $slide ) {
			?>
			<div class="rex-slider-element rex-slider-element--fluid"><img src="<?php echo esc_url( $slide['_rex_banner_gallery_image']['url'] ); ?>"></div>
			<?php
			}
		} else {
			foreach( $slider_gallery as $slide ) {
				$hide_slide = $slide['_rex_slider_hide_slide'];
				if( isset( $hide_slide[0] ) && 'hide' === $hide_slide[0] ) {
					continue;
				}
	
				$slider_el_style = '';
				$slideHasImage = false;
				if( isset( $slide['_rex_banner_gallery_image']['url'] ) ) {
					$slideHasImage = true;
					if ( ! $editor ) {
						$slider_el_style = ' data-flickity-bg-lazyload="' . $slide['_rex_banner_gallery_image']['url'] . '"';
					} else {
						$slider_el_style = ' style="background-image:url(' . $slide['_rex_banner_gallery_image']['url'] . ')"';
					}
					$slideImageIdAttr = " data-rex-slide-image-id=\"". $slide['_rex_banner_gallery_image']['id'] ."\"";
				}
	
				?>
				<div class="rex-slider-element<?php echo ( $slideHasImage && $natural_blur && ! 'true' == $photoswipe && "" == $slide['_rex_banner_gallery_url'] ? ' natural-slide__wrap' : '' ); ?><?php echo ( ( $active_video && ( $slide['_rex_banner_gallery_video'] || $slide['_rex_banner_gallery_video_mp4'] ) ) ? ' rex-slide--video' : '' ); ?>"<?php echo ( 1 != $nav_previewed ? ( !$natural_blur ? $slider_el_style : '' ) : '' ); echo (!$slideHasImage? "" : $slideImageIdAttr); ?>>
				<?php
	
				if ( $slideHasImage && $natural_blur && ! 'true' == $photoswipe && "" == $slide['_rex_banner_gallery_url']  ) {
					?>
					<div class="natural-blur-effect blur-slide"<?php echo $slider_el_style; ?>></div>
					<img class="natural-slide" <?php echo Rexbuilder_Utilities::isBuilderLive() ? 'src' : 'data-flickity-lazyload' ?>="<?php echo $slide['_rex_banner_gallery_image']['url']; ?>">
					<?php
				}
	
				if( 1 == $nav_previewed && 'true' != $photoswipe && isset( $slide['_rex_banner_gallery_image']['url'] ) ) {
					?>
					<img src="<?php echo esc_url( $slide['_rex_banner_gallery_image']['url'] ); ?>">
					<?php
				}
	
				if( $active_video && ( $slide['_rex_banner_gallery_video'] || $slide['_rex_banner_gallery_video_mp4'] ) ) {
					// check if is a valid URL
	
					//youtube
					if( false !== strpos( $slide['_rex_banner_gallery_video'], "youtu" ) ) {
						?>
						<div class="rex-slider-video-wrapper youtube-player">
							<div class="rex-youtube-wrap" data-property="{videoURL:'<?php echo $slide['_rex_banner_gallery_video']; ?>',containment:'self',startAt:0,mute: true,autoPlay: true,loop: true,opacity: 1,showControls: false,showYTLogo: false}" data-ytvideo-stop-on-click="false">
							</div>
					<?php
					//vimeo
					} else if( false !== strpos( $slide['_rex_banner_gallery_video'], "vimeo" ) ) {
						?>
						<div class="rex-slider-video-wrapper vimeo-player">
							<div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block">
								<iframe src="<?php echo $slide['_rex_banner_gallery_video']; ?>?autoplay=1&loop=1&byline=0&title=0&autopause=0&muted=1" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
							</div>
						<?php
					//mp4
					} else if( $slide['_rex_banner_gallery_video_mp4'] ) {
						$mp4IDattr = "data-rex-video-mp4-id=\"". $slide["_rex_banner_gallery_video_mp4"]["id"] . "\"";
	
						?>
						<div class="rex-slider-video-wrapper mp4-player">
							<div class="rex-video-wrap intrinsic-ignore" <?php echo $mp4IDattr;?>>
								<video class="rex-video-container" preload muted autoplay loop playsinline>
									<source type="video/mp4" src="<?php echo $slide['_rex_banner_gallery_video_mp4']['url']; ?>" />
								</video>
							</div>
					<?php
					}
					if( is_array( $slide['_rex_banner_gallery_video_audio'] ) ) {
					?>
						<div class="rex-video-toggle-audio">
							<div class="rex-video-toggle-audio-shadow"></div>
						</div>
					<?php
					}
					?>
					</div>
					<?php
				}
				// Link section
				if( $slide['_rex_banner_gallery_url'] ) {
				?>
				<a class="rex-slider-element-link" href="<?php echo esc_url( $slide['_rex_banner_gallery_url'] ); ?>">
				<?php
				}
	
				// text section
				if( $slide['_rex_banner_gallery_image_title'] ) {
					echo '<div class="rex-slider-element-title">';
					echo do_shortcode( apply_filters( 'rexpansive_slider_filter_element_title', $slide['_rex_banner_gallery_image_title'], $slide ) );
					echo '</div>';
				}
	
				if( $slide['_rex_banner_gallery_url'] ) {
				?>
				</a>
				<?php
				}
	
				if( 'true' == $photoswipe && "" == $slide['_rex_banner_gallery_url'] && $slideHasImage ) {
						?>
					<figure class="pswp-figure" itemprop="associatedMedia" itemscope="" itemtype="http://schema.org/ImageObject">
						<a class="pswp-item" href="<?php echo $slide['_rex_banner_gallery_image']['url']; ?>" itemprop="contentUrl" data-size="<?php echo $slide['_rex_banner_gallery_image']['width']; ?>x<?php echo $slide['_rex_banner_gallery_image']['height']; ?>">
							<div class="pswp-item-thumb" data-thumb-image-type="full" data-thumburl="<?php echo $slide['_rex_banner_gallery_image']['url']; ?>" itemprop="thumbnail"></div>
							<div class="rex-custom-scrollbar<?php echo ( $natural_blur ? ' natural-slide__wrap' : '' ); ?>">
							<?php
								if ( $natural_blur ) {
									?>
									<div class="natural-blur-effect blur-slide"<?php echo $slider_el_style; ?>></div>
									<img class="natural-slide" data-flickity-lazyload="<?php echo $slide['_rex_banner_gallery_image']['url']; ?>">
									<?php
								}
								if( 1 == $nav_previewed && isset( $slide['_rex_banner_gallery_image']['url'] ) ) { ?>
								<img src="<?php echo esc_url( $slide['_rex_banner_gallery_image']['url'] ); ?>">
							<?php } ?>
							</div>
						</a>
						<figcaption class="pswp-item-caption" itemprop="caption description">
							<?php do_action( 'rexbuilder_slider_pswp_item_caption' ); ?>
						</figcaption>
					</figure>
					<?php
				}
	
				// eventually overlay
				echo $overlay_el;
				?>
					</div>
				<?php
				if( 1 == $nav_previewed ) {
					$nav_previewed_html .= '<li class="dot"><span' . $slider_el_style . '></span></li>';
				}
			}
			
		}


		if( !empty( $nav_previewed_html ) && 1 !== $num_slides ) {
			echo  '<ol class="flickity-page-dots rex-slider__previewed-nav rex-slider__custom-nav">' . $nav_previewed_html . '</ol>';
		}

		if( "" != $nav_layout && "bottom-right-numbers" == $nav_layout ) {
			?>
			<div class="rex-slider__br-nums-wrap rex-slider__num-navigator">
				<strong class="rex-slider__num--actual-slide">1</strong><span>/</span><span class="rex-slider__num--total-slides"><?php echo $num_slides; ?></span>
			</div>
			<?php
		}

		if( "" != $nav_layout && "bottom-label-image" == $nav_layout ) {
			?>
			<div class="rex-slider__b-label-image-wrap menu-font-style">
				<ol class="rex-slider__b-label-image-nav flickity-page-dots rex-slider__custom-nav rex-slider__custom-nav__preview-slide">
				<?php
				$slide_index = 0;
				foreach ( $slider_gallery as $index => $slide ) {

					$hide_slide = $slide['_rex_slider_hide_slide'];
					if( isset( $hide_slide[0] ) && 'hide' === $hide_slide[0] ) {
						continue;
					}

					if( isset($slide['_rex_slider_nav_label'] ) && "" != $slide['_rex_slider_nav_label'] ) {
						?>
						<li class="rex-slider__b-label-image--item" data-nav-index="<?php echo esc_attr( $slide_index ); ?>">
						<?php
						if( $slide['_rex_banner_gallery_url'] ) {
							?>
							<a href="<?php echo esc_url( $slide['_rex_banner_gallery_url'] ); ?>">
								<span class="rex-slider__b-label-image__link-content">
							<?php
						}
						if( isset( $slide['_rex_slider_nav_img'] ) && "" != $slide['_rex_slider_nav_img'] ) {
							if("image/svg+xml" == $slide['_rex_slider_nav_img']['mime_type']) {
								?>
								<span class="rex-slider__b-image--item">
								<?php
								echo file_get_contents( get_attached_file( $slide['_rex_slider_nav_img']['id'] ) );
								?>
								</span>
								<?php
							} else {
								?>
								<img class="rex-slider__b-image--item" src="<?php echo esc_url( $slide['_rex_slider_nav_img']['url'] ); ?>" alt="" srcset="">
								<?php
							}
						}
						?>
						<span class="rex-slider__b-label--item"><?php _e( $slide['_rex_slider_nav_label'] ); ?></span>
						<?php
						if( $slide['_rex_banner_gallery_url'] ) {
							?>
								</span>
							</a>
							<?php
						}
						?>
						</li>
						<?php
					}
					$slide_index++;
				}
				?>
				</ol>
			</div>
			<?php
		}

		do_action( 'rex_slider_after_gallery_inside', $slider_id );
		if( 'true' == $photoswipe ) {
			?>
			<div class="pswp-item-caption pswp-item-caption__global" itemprop="caption description">
				<?php do_action( 'rexbuilder_block_pswp_item_caption' ); ?>
			</div>
			<?php
		}
		?>
		</div>
		<?php
		do_action( 'rex_slider_after_gallery_render', $slider_id );

		return ob_get_clean();
	}
}