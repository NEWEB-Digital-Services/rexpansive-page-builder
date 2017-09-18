<?php

/**
 * The class that register and render a section.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
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
class Rexbuilder_Section {
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
	 */
	public function render_section( $atts, $content = null ) {
		extract( shortcode_atts( array(
			"section_name" => "",
			"type" => "perfect-grid",
			"color_bg_section" => "#ffffff",
			"dimension" => "full",
			"margin" => "",
			"image_bg_section" => "",
			"id_image_bg_section" => "",
			'video_bg_url_section' => '',
			'video_bg_id_section' => '',
			'video_bg_url_vimeo_section' => '',
			'full_height' => '',
			"block_distance" => 20,
			"layout" => "fixed",
			'responsive_background' => '',
			'custom_classes' =>	'',
			'section_width' => '',
			'row_separator_top'	=>	'',
			'row_separator_bottom'	=>	'',
			'row_separator_right'	=>	'',
			'row_separator_left'	=>	'',
		), $atts ) );

		global $post;
		$builder_active = get_post_meta( $post->ID, '_rexbuilder_active', true);

		if('true' == $builder_active) {
			global $section_layout;
			$section_layout = $layout;

			$section_style = "";
			if( !empty( $image_bg_section ) ) {
				$section_style = ' style="background-image:url(\'' . wp_get_attachment_url( $id_image_bg_section ) . '\');"';
			} else if( !empty( $color_bg_section ) ) {
				$section_style = ' style="background-color:' . $color_bg_section . ';"';
			}

			$section_responsive_style = '';
			if( "" != $responsive_background ) :
				$section_responsive_style = ' style="background-color:' . $responsive_background . ';"';
			endif;

			$custom_classes = trim( $custom_classes );

			$row_separators = '';
			if( '' != $row_separator_top ) {
				$row_separators .= ' data-row-separator-top="' . $row_separator_top . '"';
			}

			if( '' != $row_separator_right ) {
				$row_separators .= ' data-row-separator-right="' . $row_separator_right . '"';
			}

			if( '' != $row_separator_bottom ) {
				$row_separators .= ' data-row-separator-bottom="' . $row_separator_bottom . '"';
			}

			if( '' != $row_separator_left ) {
				$row_separators .= ' data-row-separator-left="' . $row_separator_left . '"';
			}

			$content_has_photoswipe = preg_match('/photoswipe="true"/', $content);

			echo '<section';
			if($section_name != '') :
				$x = preg_replace('/[\W\s+]/', '', $section_name);
				echo ' href="#' . $x . '" id="' . $x . '"';
			endif;

			echo ' class="rexpansive_section' .
				( ( $content_has_photoswipe > 0 ) ? ' photoswipe-gallery' : '' ) . 
				( ( '' != $custom_classes ) ? ' ' . $custom_classes : '' ) . 
				( ( 'true' == $full_height ) ? ' full-height-section' : '' ) .
				( ( '' != $video_bg_url_section && 'undefined' != $video_bg_url_section ) ? ' youtube-player' : '' ) .
				'" itemscope itemtype="http://schema.org/ImageGallery"' .
				( ( '' != $video_bg_url_section && 'undefined' != $video_bg_url_section ) ? ' data-property="{videoURL:\'' . $video_bg_url_section . '\',containment:\'self\',startAt:0,mute:true,autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}"' : '' ) .
				$section_style . '>';

			if( '' != $video_bg_url_vimeo_section && 'undefined' != $video_bg_url_vimeo_section ) {
?>
<div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--section">
<iframe src="<?php echo $video_bg_url_vimeo_section; ?>?autoplay=1&loop=1&byline=0&title=0&autopause=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>
<?php
			}

			if( "" != $responsive_background )
				echo '<div class="responsive-overlay"' . $section_responsive_style . '">';

			if( '' != $video_bg_id_section && 'undefined' != $video_bg_id_section ) :
				echo '<div class="rex-video-section-wrap">';
				echo '<video class="rex-video-container" preload muted autoplay loop>';
				echo '<source type="video/mp4" src="' . wp_get_attachment_url( $video_bg_id_section ) . '" />';
				echo '</video>';
				echo '</div>';
			endif;

			if( 'boxed' == $dimension ) {
				echo '<div class="center-disposition"';
				if( '' != $section_width ) {
					echo ' style="max-width:' . $section_width . ';"';
				}
				echo '>';
			} else {
				echo '<div class="full-disposition">';
			}

			echo '<div class="perfect-grid-gallery" data-separator="' . $block_distance . '" data-layout="' . $layout . '" data-full-height="' . ( ( 'true' == $full_height ) ? 'true' : 'false' ) . '"' . $row_separators . '>';
			echo '<div class="perfect-grid-sizer"></div>';
			echo do_shortcode( $content );
			echo '</div>';
			echo '</div>';

			if( "" != $responsive_background )
				echo '</div>';

			echo '</section>';

		} else {

			echo do_shortcode( $content );

		}
	}
}