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
	 */
	public function render_slider( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'slider_id' => '',
			'class' => '',
			'photoswipe' => ''		// handling photoswipe on slider
		), $atts ) );

		ob_start();

		if( Rexbuilder_Utilities::check_post_exists( $slider_id ) ) :

			$slider_animation = get_field( '_rex_enable_banner_animation', $slider_id );
			$slider_prev_next = get_field( '_rex_enable_banner_prev_next', $slider_id );
			$slider_dots = get_field( '_rex_enable_banner_dots', $slider_id );

			$slider_gallery = get_field( '_rex_banner_gallery', $slider_id );

			$nav_previewed = get_post_meta( $slider_id, '_rex_slider_previewed_nav', true );
			$nav_previewed_html = '';

			$re = '/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';

			if( !empty( $slider_gallery ) ) :
				$num_slides = count( $slider_gallery );
	?>
	<div class="rex-slider-wrap<?php echo ( 1 == $nav_previewed ? ' rex-slider--bottom-interface' . ( 1 !== $num_slides ? ' rex-slider--bottom-interface--active' : '' ) : '' ); ?><?php echo ' rex-slider--' . $num_slides . '-slides'; ?>" data-rex-slider-animation="<?php echo ( is_array( $slider_animation ) ? 'true': ( "0" == $slider_animation ? 'true' : 'false' ) ); ?>" data-rex-slider-prev-next="<?php echo ( is_array( $slider_prev_next ) ? '1': ( "0" == $slider_prev_next ? 'true' : 'false' ) ); ?>" data-rex-slider-dots="<?php echo ( is_array( $slider_dots ) ? '1': ( "0" == $slider_dots ? 'true' : 'false' ) ); ?>" data-set-gallery-size="<?php echo esc_attr( 1 == $nav_previewed ? 'true' : 'false' ); ?>">
		<?php
				foreach( $slider_gallery as $key => $slide ) :
					$slider_el_style = '';
					if( isset( $slide['_rex_banner_gallery_image']['url'] ) ) {
						$slider_el_style = ' style="background-image:url(' . $slide['_rex_banner_gallery_image']['url'] . ')"';
					}
	?>
		<div class="rex-slider-element"<?php echo ( 1 != $nav_previewed ? $slider_el_style : '' ); ?>>
	<?php

	if( 1 == $nav_previewed && 'true' != $photoswipe && isset( $slide['_rex_banner_gallery_image']['url'] ) ) { ?>
		<img src="<?php echo esc_url( $slide['_rex_banner_gallery_image']['url'] ); ?>">
	<?php }

	$active_video = apply_filters( 'rexpansive_slider_filter_active_video', true );
	if( $slide['_rex_banner_gallery_video'] && $active_video ) {
		// check if is a valid URL
		$re = '/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';
		preg_match($re, $slide['_rex_banner_gallery_video'], $matches, PREG_OFFSET_CAPTURE, 0);

		if( count($matches) > 0 ) {
			if( false !== strpos( $slide['_rex_banner_gallery_video'], "youtu" ) ) {
	?>
		<div class="youtube-player" data-property="{videoURL:'<?php echo $slide['_rex_banner_gallery_video']; ?>',containment:'self',startAt:0,mute:<?php echo ( is_array( $slide['_rex_banner_gallery_video_audio'] ) ? 'false' : 'true' ); ?>,autoPlay:<?php echo ( $key > 0 ? 'false' : 'true' ); ?>,loop:true,opacity:1,showControls:false,showYTLogo:false}" data-ytvideo-stop-on-click="false">
	<?php
				if( is_array( $slide['_rex_banner_gallery_video_audio'] ) ) {
	?><div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div><?php
				}
			} else if( false !== strpos( $slide['_rex_banner_gallery_video'], "vimeo" ) ) {
	?>
	<div class="vimeo-player">
		<div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block" data-vimeo-video-mute="<?php echo ( is_array( $slide['_rex_banner_gallery_video_audio'] ) ? '0' : '1' ); ?>">
			<iframe src="<?php echo $slide['_rex_banner_gallery_video']; ?>?autoplay=1&loop=1&byline=0&title=0&autopause=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
		</div>
	<?php
				if( is_array( $slide['_rex_banner_gallery_video_audio'] ) ) {
	?><div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div><?php
				}
	?></div><?php
			}
		}
	}

	// mp4
	if( $slide['_rex_banner_gallery_video_mp4'] ) {
	?>
	<div class="mp4-player">
		<div class="rex-video-wrap">
			<video class="rex-video-container" preload <?php echo ( is_array( $slide['_rex_banner_gallery_video_audio'] ) ? '' : 'muted' ); ?> autoplay loop>
				<source type="video/mp4" src="<?php echo $slide['_rex_banner_gallery_video_mp4']['url']; ?>" />
			</video>
	<?php
	if( is_array( $slide['_rex_banner_gallery_video_audio'] ) ) {
	?>
	<div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div>
	<?php
		}
	?>
		</div>
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

	// closing youtube video wrap
	if( $slide['_rex_banner_gallery_video'] ) {
		if( count($matches) > 0 ) {
			if( false !== strpos( $slide['_rex_banner_gallery_video'], "youtu" ) ) {
	?>
			</div>
	<?php
			}
		}
	}

	if( 'true' == $photoswipe && "" == $slide['_rex_banner_gallery_url'] ) {
?>
<figure class="pswp-figure" itemprop="associatedMedia" itemscope="" itemtype="http://schema.org/ImageObject">
	<a class="pswp-item" href="<?php echo $slide['_rex_banner_gallery_image']['url']; ?>" itemprop="contentUrl" data-size="<?php echo $slide['_rex_banner_gallery_image']['width']; ?>x<?php echo $slide['_rex_banner_gallery_image']['height']; ?>">
		<div class="pswp-item-thumb" data-thumb-image-type="full" data-thumburl="<?php echo $slide['_rex_banner_gallery_image']['url']; ?>" itemprop="thumbnail"></div>
		<div class="rex-custom-scrollbar">
		<?php
			if( 1 == $nav_previewed && isset( $slide['_rex_banner_gallery_image']['url'] ) ) { ?>
			<img src="<?php echo esc_url( $slide['_rex_banner_gallery_image']['url'] ); ?>">
		<?php } ?>
		</div>
	</a>
	<figcaption class="pswp-item-caption" itemprop="caption description"></figcaption>
</figure>
<?php
	}
	?>
		</div>
	<?php	
				if( 1 == $nav_previewed ) {
					$nav_previewed_html .= '<li class="dot"><span' . $slider_el_style . '></span></li>';
				}
			endforeach;

			if( !empty( $nav_previewed_html ) && 1 !== $num_slides ) {
				echo  '<ol class="flickity-page-dots rex-slider__previewed-nav rex-slider__custom-nav">' . $nav_previewed_html . '</ol>';
			}
		?>
	</div>
	<?php
			
			do_action( 'rex_slider_after_gallery_render', $slider_id );
			endif;
		endif;
		return ob_get_clean();
	}
}