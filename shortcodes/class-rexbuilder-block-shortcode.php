<?php

/**
 * The class that register and render a block.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 */

/**
 * Defines the characteristics of the RexbuilderBlock
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 * @author     Neweb <info@neweb.info>
 *
 */
class Rexbuilder_Block {
	private $plugin_name;

	/**
	 * Class that identifies that a block is a popup content
	 *
	 * @var String
	 * @since 2.0.14
	 */
	private $POPUP_CONTENT_BUTTON_CLASSNAME;

	/**
	 * Class that identifies that a block is a popup video
	 *
	 * @var String
	 * @since 2.0.14
	 */
	private $POPUP_VIDEO_BUTTON_CLASSNAME;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct()
	{
		$this->plugin_name = 'rexpansive-builder';

		$this->POPUP_CONTENT_BUTTON_CLASSNAME = 'popup-content-button';
		$this->POPUP_VIDEO_BUTTON_CLASSNAME = 'popup-video-button';
	}

	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since    1.0.0
	 * @param      string    $a                   The attributest passed.
	 * @param      string    $content            The content passed.
	 * @version 1.1.3    Add handling photoswipe on slider
	 */
	public function render_block($atts, $content = null)
	{
		extract(shortcode_atts(array(
			"id" => "",
			"type" => "text",
			"size_x" => 1,
			"size_y" => 1,
			"row" => '',
			"col" => '',
			"gs_width" => 1,
			"gs_height" => 1,
			"gs_y" => '',
			"gs_x" => '',
			"color_bg_block" => "#ffffff",
			"image_bg_block" => "",
			"id_image_bg_block" => "",
			'image_bg_elem_active' => '',
			'video_bg_id' => "",
			"video_bg_url" => "",
			'video_bg_width' => '',
			'video_bg_height' => '',
			"video_bg_url_vimeo" => "",
			"type_bg_block" => "",
			'image_size' => 'full',
			"photoswipe" => '',
			"linkurl" => '',
			'block_custom_class' => '',
			'block_padding' => '',
			'overlay_block_color' => '',
			'overlay_block_color_active' => '',
			"zak_background" => "",
			"zak_side" => "",
			"zak_title" => "",
			"zak_icon" => "",
			"zak_foreground" => "",
			"block_animation" => "fadeInUpBig",
			"video_has_audio" => '0',
			"rexbuilder_block_id" => "",
			"edited_from_backend" => "",
			"empty_block_backend_fix" => "false",
			"block_flex_position" => "",
			"block_flex_img_position" => "",
			"fast_load" => "true"
		), $atts));

		if($empty_block_backend_fix == "true"){
			ob_start();
			echo "";
			return ob_get_clean();
		}

		$editor = Rexbuilder_Utilities::isBuilderLive();
		$fast_load = ( "true" == $fast_load ? true : false );

		global $section_layout;

		$options = get_option( $this->plugin_name . '_options' );
		$animation = apply_filters('rexbuilder_animation_enabled', $options['animation']);

		$element_link_cc = apply_filters('rexpansive_block_element_link_custom_class', '');
		$grid_item_content_cc = apply_filters('rexpansive_block_grid_item_content_custom_class', '');
		$text_wrap_cc = apply_filters('rexpansive_block_text_wrap_custom_class', '');

		$section = explode('_', $id);
		$section = $section[1];

		$content = preg_replace('/^<\/p>/', '', $content);
		$content = preg_replace('/<p>+$/', '', $content);

		$shortcode_blacklist = Rexbuilder_Utilities::shortcode_black_list();
		if (!empty($shortcode_blacklist)) {
			foreach ($shortcode_blacklist as $shortcode) {
				if ( false !== strpos( $content, $shortcode ) ) {
				// if (has_shortcode($content, $shortcode)) {
					ob_start();
					echo do_shortcode($content);
					return ob_get_clean();
				}
			}
		}

		// Construct the style property for the background

		$block_background_style = "";
		if (!empty($color_bg_block)) {
			$block_background_style = ' style="background-color:' . $color_bg_block . ';"';
		}

		$block_link_pre = '';
		$block_link_before = '';

		if ( $linkurl != '' && $photoswipe == 'true' ) {
			$photoswipe = 'false';
			$atts['photoswipe'] = '';
		}

		$block_custom_class = apply_filters('rexpansive_block_custom_class', trim($block_custom_class), $id);

		$flex_positioned = true;
		$flex_position = array();

		$flex_positioned_active = false;
		if (preg_match_all('/rex-flex-(top|middle|bottom|left|center|right)/', $block_custom_class, $matches) != 0) {
			$flex_positioned_active = true;
			$flex_position = $matches[1];
			$block_custom_class = str_replace($matches[0], "", $block_custom_class);
			$atts["block_custom_class"] = $block_custom_class;
		}

		if($block_flex_position != "") {
			$flex_positioned_active = true;
			$flex_position = explode(" ", $block_flex_position);
		}

		$flex_img_positioned_active = false;
		if($block_flex_img_position != "") {
			$flex_img_positioned_active = true;
			$flex_img_position = explode(" ", $block_flex_img_position);
		}

		$background_img_style = "";
		$alt_tag = '';
		if ("" != $id_image_bg_block) {
			$img_attrs = wp_get_attachment_image_src($id_image_bg_block, $image_size);

			$alt_value = get_post_meta($id_image_bg_block, '_wp_attachment_image_alt', true);
			if ( ! $editor && $fast_load ) {
				$background_img_style = ' data-res-lazy-loading="false" data-src="' . $img_attrs[0] . '"';
			} else {
				$background_img_style = ' style="background-image:url(\'' . $img_attrs[0] . '\');"';
			}
			if ("" !== $alt_value) {
				$alt_tag = ' alt="' . esc_attr($alt_value) . '" ';
			}
		} else {
			$type_bg_block = "";
		}

		$has_popup_content = false;
		if (false !== strpos($block_custom_class, $this->POPUP_CONTENT_BUTTON_CLASSNAME)) {
			$has_popup_content = true;
		}

		$has_popup_video = false;
		if (false !== strpos($block_custom_class, $this->POPUP_VIDEO_BUTTON_CLASSNAME)) {
			$has_popup_video = true;
		}

		if ( !$editor ) {
			if ($photoswipe == 'true' && '' == $video_bg_id && '' == $video_bg_url && isset($img_attrs[0]) && '' != $img_attrs[0]) {
				$block_link_pre .= '<figure class="pswp-figure" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">';
				$block_link_pre .= '<a class="pswp-item" href="' . $img_attrs[0] . '" itemprop="contentUrl" data-size="' . $img_attrs[1] . 'x' . $img_attrs[2] . '">';
				$block_link_pre .= '<div class="pswp-item-thumb" data-thumb-image-type="' . $type_bg_block . '" data-thumburl="' . $img_attrs[0] . '" itemprop="thumbnail"></div>';
				$block_link_before .= '</a>';
				$block_link_before .= '<figcaption class="pswp-item-caption" itemprop="caption description">';
				ob_start();
				do_action( 'rexbuilder_block_pswp_item_caption' );
				$caption = ob_get_clean();
				$block_link_before .= $caption . '</figcaption>';
				$block_link_before .= '</figure>';
				$content = strip_tags($content, '<p><h1><h2><h3><h4><h5><h6><strong><i><hr><div><span><pre><b><blockquote><address><cite><code><del><q><small><sub><sup><time><img><canvas><video><ul><ol><li><br><font>');
			}
			if ($linkurl != '') {
				$element_link_target = '_self';
				if (preg_match_all('/element-link-target--(blank|self|parent|top)/', $block_custom_class, $target_matches) != 0) {
					$element_link_target = "_{$matches[1]}";
				}

				$block_link_pre .= '<a class="element-link hovered' . $element_link_cc . ($has_popup_content ? " {$this->POPUP_CONTENT_BUTTON_CLASSNAME}" : '') . ($has_popup_video ? " {$this->POPUP_VIDEO_BUTTON_CLASSNAME}" : '') . '" href="' . $linkurl . '" title="' . trim(strip_tags($linkurl)) . '" target="' . $element_link_target . '">';
				$block_link_before .= '</a>';
				$content = strip_tags($content, '<p><h1><h2><h3><h4><h5><h6><strong><i><hr><div><span><pre><b><blockquote><address><cite><code><del><q><small><sub><sup><time><img><canvas><video><ul><ol><li><br><svg><use><font>');
			}
		}

		if( "" !== $content && "" === $id_image_bg_block ) {
			$block_custom_class .= ' block--only-content';
		} else if ( "" === $content && "" !== $id_image_bg_block ) {
			$block_custom_class .= ' block--only-image';
		}

		$block_is_static = false;
		if ( ! $editor && false !== strpos( $block_custom_class, 'rex-static-block' ) ) {
			$block_is_static = true;
		}

		$block_has_slider = false;
		if ( false !== strpos( $content, 'RexSlider' ) ) {
			$block_has_slider = true;
			$content = Rexbuilder_Utilities::remove_shortcode_wrap_paragraphs( $content, 'RexSlider' );

			// pass the overlay parameter to slider if present
			if ( '' !== $overlay_block_color ) {
				Rexbuilder_Utilities::add_attribute_to_shortcode( $content, array(
					'shortcode' => 'RexSlider',
					'attribute' => 'overlay="' . $overlay_block_color . '"',
				) );
			}

			// pass down block classes to slider shortcode
			Rexbuilder_Utilities::add_attribute_to_shortcode( $content, array(
				'shortcode' => 'RexSlider',
				'attribute' => 'block_classes="' . $block_custom_class . '"',
			) );
		}

		if ( false !== strpos( $content, 'RexSliderDefintion' ) ) {
			$block_has_slider = true;
			$content = Rexbuilder_Utilities::remove_shortcode_wrap_paragraphs($content, 'RexSliderDefintion');
		}

		if ( false !== strpos( $content, 'RexIndicator' ) ) {
			$block_has_indicator = true;
			$content = Rexbuilder_Utilities::remove_shortcode_wrap_paragraphs($content, 'RexIndicator');
		}

		if ( false !== strpos( $content, 'RexLoad_Carousel' ) ) {
			$content = Rexbuilder_Utilities::remove_shortcode_wrap_paragraphs($content, 'RexLoad_Carousel');
		}

		if ($block_has_slider && 'true' == $photoswipe) {
			// strpos($content,']')
			$last = strpos($content, ']');
			$s1 = substr($content, 0, $last);
			$s2 = substr($content, $last);
			$content = $s1 . ' photoswipe="true"' . $s2;
		}

		$floating_border = '';
		if (strpos($block_custom_class, 'rex-floating-') !== false) {
			$floating_border = '<div class="rex-floating-bordered-block" data-floating-block-bg="' . $color_bg_block . '">' .
			'<div class="bordered-card-before"></div><div class="bordered-card-after"></div>' .
			// '<div class="bordered-card-hover"><div class="hovered-card-before"></div><div class="hovered-card-after"></div></div>'.
			'</div>';
		}

		$floating_horizontal = false;
		$floating_vertical = false;
		if ((strpos($block_custom_class, 'rex-floating-top') !== false) || (strpos($block_custom_class, 'rex-floating-bottom') !== false)) {
			$floating_vertical = true;
		}

		if ((strpos($block_custom_class, 'rex-floating-left') !== false) || (strpos($block_custom_class, 'rex-floating-right') !== false)) {
			$floating_horizontal = true;
		}

		if ($block_is_static) {
			if (strpos($block_custom_class, 'rex-static-block-border-top') !== false) {
				$floating_border = '<div class="rex-static-bordered-block rex-static-bordered-block-top"><div class="bordered-card-before"></div><div class="bordered-card-after"></div></div>';
			}

			if (strpos($block_custom_class, 'rex-static-block-border-bottom') !== false) {
				$floating_border .= '<div class="rex-static-bordered-block rex-static-bordered-block-bottom"><div class="bordered-card-before"></div><div class="bordered-card-after"></div></div>';
			}

			if (strpos($block_custom_class, 'rex-static-block-border-left') !== false) {
				$floating_border .= '<div class="rex-static-bordered-block rex-static-bordered-block-left"><div class="bordered-card-before"></div><div class="bordered-card-after"></div></div>';
			}

			if (strpos($block_custom_class, 'rex-static-block-border-right') !== false) {
				$floating_border .= '<div class="rex-static-bordered-block rex-static-bordered-block-right"><div class="bordered-card-before"></div><div class="bordered-card-after"></div></div>';
			}

		}

		$block_delayed = false;
		if (strpos($block_custom_class, 'rex-animation-delay') !== false) {
			$block_delayed = true;
		}

		$block_offset = false;
		if (strpos($block_custom_class, 'rs-animation-offset') !== false) {
			$block_offset = true;
		}

		$visible_element_percentage = null;
		if( strpos($block_custom_class, 'scrolled-block--percentage-' ) ) {
			preg_match( '/scrolled-block--percentage-(\d+)/', $block_custom_class, $match );
			if ( ! empty( $match ) ) {
				$visible_element_percentage = (int) $match[1];
			}
		}

		if ( false !== strpos( $content, 'RexGoogleMap' ) ) {
			$content = Rexbuilder_Utilities::remove_shortcode_wrap_paragraphs($content, 'RexGoogleMap');
		}

		// add block classes to array for better readability
		$block_classes = array();
		if (!$block_is_static) {
			array_push($block_classes, 'perfect-grid-item');
			array_push($block_classes, 'grid-stack-item');
		}

		if ("" == $block_background_style && "" == $id_image_bg_block && "" == $content && (empty($video_bg_id) || 'undefined' == $video_bg_id) && (empty($video_bg_url) || 'undefined' == $video_bg_url) && (empty($video_bg_url_vimeo) || 'undefined' == $video_bg_url_vimeo)) {
			array_push($block_classes, 'real-empty');
		}

		if (('full' == $type_bg_block && "" != $id_image_bg_block && "" == $content && $section_layout == 'fixed') || (!empty($video_bg_id) && "" == $content) || (!empty($video_bg_url) && "" == $content) || (!empty($video_bg_url_vimeo) && "" == $content)) {
			array_push($block_classes, 'only-background');
		}

		if ('full' == $type_bg_block && $section_layout == 'masonry' && "" == $content) {
			array_push($block_classes, 'natural-fluid-image');
		}

		if (!$editor && $animation == 1 && $block_animation && !$block_is_static) {
			array_push($block_classes, 'has-rs-animation');
			array_push($block_classes, 'rs-animation');
		}

		array_push($block_classes, 'w' . $size_x);
		if (! $editor && '' !== $id_image_bg_block) {
			array_push($block_classes, 'block-w-image');
		}
		if (! $editor && '' != $video_bg_id && 'undefined' != $video_bg_id) {
			array_push($block_classes, 'block-w-html-video');
		}
		if ($block_has_slider) {
			array_push($block_classes, 'block-has-slider');
		} else if ($editor) {
			array_push($block_classes, 'rex-text-editable');
		}

		if($flex_positioned_active && !$block_has_slider){
			array_push($block_classes, "rex-flex-".$flex_position[0]);
			array_push($block_classes, "rex-flex-".$flex_position[1]);
		}
		if($flex_img_positioned_active && !$block_has_slider){
			array_push($block_classes, "rex-flex-img-".$flex_img_position[0]);
			array_push($block_classes, "rex-flex-img-".$flex_img_position[1]);
		}
		if ('expand' == $type) {
			array_push($block_classes, 'wrapper-expand-effect');
			array_push($block_classes, 'effect-expand-' . $zak_side);
		}
		if ( false !== strpos( $content, 'RexLastWorks' ) ) {
			array_push($block_classes, 'horizontal-carousel');
		}
		if ($floating_horizontal || $floating_vertical) {
			array_push($block_classes, ' rex-floating-block');
		}

		$block_custom_class_arr = explode(' ', trim($block_custom_class));
		$block_classes_array = array_merge($block_classes, $block_custom_class_arr);
		$block_classes_array = apply_filters('rexbuilder_block_classes', $block_classes_array);

		// add block attributes to array for better readability
		$data_attrs_arr = array();
		array_push($data_attrs_arr, 'data-height="' . $size_y . '"');
		array_push($data_attrs_arr, 'data-width="' . $size_x . '"');
		array_push($data_attrs_arr, 'data-row="' . $row . '"');
		array_push($data_attrs_arr, 'data-col="' . $col . '"');
		if ($edited_from_backend == "true") {
			array_push($data_attrs_arr, 'data-gs-height="' . $size_y . '"');
			array_push($data_attrs_arr, 'data-gs-width="' . $size_x . '"');
			array_push($data_attrs_arr, 'data-gs-y="' . ($row - 1) . '"');
			array_push($data_attrs_arr, 'data-gs-x="' . ($col - 1) . '"');
		} else {
			array_push($data_attrs_arr, 'data-gs-height="' . $gs_height . '"');
			array_push($data_attrs_arr, 'data-gs-width="' . $gs_width . '"');
			array_push($data_attrs_arr, 'data-gs-y="' . $gs_y . '"');
			array_push($data_attrs_arr, 'data-gs-x="' . $gs_x . '"');
		}

		array_push($data_attrs_arr, 'data-rexbuilder-block-id="' . $rexbuilder_block_id . '"');
		if ($floating_border != '') {
			array_push($data_attrs_arr, 'data-rs-animation-delay="0.5s"');
			if ($floating_horizontal) {
				array_push($data_attrs_arr, 'data-rs-animation-offset="50"');
			} else if ($floating_vertical) {
				array_push($data_attrs_arr, 'data-rs-animation-offset="-50"');
			}
		}
		if ($block_delayed) {
			array_push($data_attrs_arr, 'data-rs-animation-delay="0.5s"');
		}
		if ($block_offset) {
			array_push($data_attrs_arr, 'data-rs-animation-offset="10"');
		}
		if ($visible_element_percentage) {
			array_push($data_attrs_arr, ' data-rs-animation-visible-percentage="' . $visible_element_percentage . '"');
		}

		$block_style_padding = '';
		if ('' != $block_padding):
			$block_padding_values = explode(';', $block_padding);
			if (count($block_padding_values) > 1):
				$block_style_padding = ' style="padding-top:' . $block_padding_values[0] . ';';
				$block_style_padding .= 'padding-right:' . $block_padding_values[1] . ';';
				$block_style_padding .= 'padding-bottom:' . $block_padding_values[2] . ';';
				$block_style_padding .= 'padding-left:' . $block_padding_values[3] . ';"';
			else:
				$block_style_padding = ' style="padding:' . $block_padding . '"';
			endif;
		endif;

		ob_start();
		?>
<div id="<?php echo $id; ?>" class="<?php echo implode(' ', $block_classes_array); ?>"<?php echo implode(' ', $data_attrs_arr); ?>><?php

		$bg_video_toggle_audio_markup = "";

		if ($video_has_audio == '1') {
			$bg_video_toggle_audio_markup .= '<div class="rex-video-toggle-audio">';
			$bg_video_toggle_audio_markup .= '<div class="rex-video-toggle-audio-shadow"></div>';
			$bg_video_toggle_audio_markup .= '</div>';
		}

		$videoTypeActive = '';

		$bg_video_markup = '';
		if ('' != $video_bg_id && 'undefined' != $video_bg_id) {
			$videoTypeActive = 'mp4-player';
			$video_mp4_url = wp_get_attachment_url($video_bg_id);
			$videoMP4Data = wp_get_attachment_metadata($video_bg_id);
			$videoMp4Width = $videoMP4Data["width"];
			$videoMp4Height = $videoMP4Data["height"];
			$bg_video_markup .= '<div class="rex-video-wrap intrinsic-ignore" data-rex-video-width="'.$videoMp4Width.'" data-rex-video-height="'.$videoMp4Height.'">';
			$bg_video_markup .= '<video class="rex-video-container"' . ( ! $editor ? ' preload="none"' : ' preload autoplay' ) . ' loop playsinline'. ($bg_video_toggle_audio_markup != "" ? "": " muted").'>';
			if ( ! $editor && $fast_load ) {
				$bg_video_markup .= '<source type="video/mp4" data-res-lazy-loading="false" data-src="' . $video_mp4_url . '" />';
			} else {
				$bg_video_markup .= '<source type="video/mp4" src="' . $video_mp4_url . '" />';
			}
			$bg_video_markup .= '</video>';
			$bg_video_markup .= '</div>';
		}

		$bg_youtube_video_markup = '';

		if ('' != $video_bg_url && 'undefined' != $video_bg_url) {
			$videoTypeActive = 'youtube-player';
			$mute = ($bg_video_toggle_audio_markup != "" ? "false" : "true");
			$bg_youtube_video_markup .= '<div class="rex-youtube-wrap" data-property="{videoURL:\'' . $video_bg_url . '\',containment:\'self\',startAt:0,mute:' . $mute . ',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}"></div>';
		}


		$bg_video_vimeo_markup = '';

		if ('' != $video_bg_url_vimeo && 'undefined' != $video_bg_url_vimeo) {
			$videoTypeActive = 'vimeo-player';
			$muteVideo = ($bg_video_toggle_audio_markup != "" ? "0" : "1");
			$bg_video_vimeo_markup .= '<div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block">';
			$bg_video_vimeo_markup .= '<iframe src="' . $video_bg_url_vimeo . '?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0&muted='.$muteVideo.'&background=1" width="640" height="360" frameborder="0" allow="autoplay" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
			$bg_video_vimeo_markup .= '</div>';
		}

		echo '<div id="' . $id . '-builder-data" class="rexbuilder-block-data" ';
		foreach ( $atts as $property_name => $value_property ) {
			if($property_name != "block_flex_position"){
				echo 'data-' . $property_name . '="' . ($value_property != "undefined"? $value_property : "" ). '" ';
			}
		}

		unset($property_name);
		unset($value_property);

		if ('' != $video_bg_id && 'undefined' != $video_bg_id) {
			echo 'data-video_mp4_url="' . $video_mp4_url . '"';
		}

		if($flex_positioned_active){
			echo "data-block_flex_position=\"".$flex_position[0]." ".$flex_position[1]."\"";
		}

		if($flex_img_positioned_active) {
			echo "data-block_flex_img_position=\"".$flex_img_position[0]." ".$flex_img_position[1]."\"";
		}

		echo '></div>';

		echo '<div class="grid-stack-item-content">';
		echo '<div class="grid-item-content-wrap">';

		switch ( $type ) {
			case 'image':
			case 'text':
			case 'rexslider':
			case 'video':
			case 'empty':
				echo ( $floating_border == '' ? $block_link_pre : '' );
				echo '<div class="grid-item-content';
				if ( 'image' == $type ) {
					echo ' image-content ';
				} else if ( 'empty' == $type ) {
					echo ' empty-content ';
				} else {
					echo ' text-content ';
				}
				echo (($flex_positioned && !$block_has_slider) ? 'rex-flexbox ' : '');
				echo $videoTypeActive;
				echo $grid_item_content_cc;
				echo '"'; // close class attribute
				echo $block_background_style;
				if ( "" != $id_image_bg_block ) {
					echo ' data-background_image_width="' . $img_attrs[1] . '" ';
					echo ' data-background_image_height="' . $img_attrs[2]. '"';
				}
				echo '>';	// <\.grid-item-content>

				echo "<div class=\"rex-image-wrapper {$type_bg_block}-image-background\"".$background_img_style;
				echo $alt_tag;
				echo "></div>";

				echo $bg_video_markup;
				echo $bg_video_vimeo_markup;
				echo $bg_youtube_video_markup;

				echo '<div class="responsive-block-overlay"'.($overlay_block_color != "" ? ' style="background-color:' .  $overlay_block_color . ';"' : ''). '>';
				echo '<div class="rex-custom-scrollbar' . (($flex_positioned && !$block_has_slider) ? ' rex-custom-position' : '') . '">';
				echo (($floating_border != '' && $block_link_pre != '') ? $block_link_pre : '');
				echo $floating_border;
				echo '<div class="text-wrap' . ("fixed" == $section_layout ? ' rex-content-resizable' : '');
				echo $text_wrap_cc;
				echo '"';
				echo $block_style_padding;
				echo '>';
				if ( "" != $content ) {
					echo do_shortcode($content);
				}
				echo '</div>';
				echo (($floating_border != '' && $block_link_before != '') ? $block_link_before : '');
				echo '</div>';
				echo '</div>';
				if ( $videoTypeActive != '' ) {
					echo $bg_video_toggle_audio_markup;
				}
				echo '</div>';
				echo ( $floating_border == '' ? $block_link_before : '' );
				break;
			case 'expand':
				echo '<div class="expand-effect-content" ' . $block_background_style . '>';
				echo '<article class="expanded-description"><div class="expanded-icon">';
				if ($zak_icon):
					echo wp_get_attachment_image($zak_icon, 'full');
				endif;
				echo '</div>';
				echo '<div class="expanded-title">';
				echo '<h2 class="underline">' . $zak_title . '</h2></div>';
				echo '<div class="expanded-text">';
				echo do_shortcode($content);
				echo '</div></article>';
				echo '<figure class="expanded-image">';
				echo '<div class="expanded-image-before" ' . $block_background_style . '></div>';
				if ($zak_foreground):
					echo '<div class="zak-hovered-image">';
					echo '<span class="zak-foreground-responsive-wrap">';
					echo wp_get_attachment_image($zak_foreground, 'full');
					echo '</span>';
					echo '</div>';
				endif;
				echo '<div class="expanded-image-overlay"><div class="exp-overlay-hover"><div class="ico-expansive">';
				echo '<svg version="1.1" id="Livello_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox="0 0 28.4 28.4" enable-background="new 0 0 28.4 28.4" xml:space="preserve"><g>	<polygon fill="#FFFFFF" points="28,2.1 28.3,0 26.3,0.4 26.2,0.4 26.2,0.4 18.5,1.9 21.6,5 15.2,11.5 16.9,13.2 23.4,6.7 26.5,9.9
					27.9,2.1 28,2.1 	"/>	<polygon fill="#FFFFFF" points="11.1,15.5 5,21.6 1.8,18.5 0.4,26.2 0.4,26.2 0.4,26.3 0,28.4 2.1,28 2.1,28 2.1,27.9 9.9,26.5
					6.7,23.4 12.9,17.2 	"/></g></svg>';
				echo '</div>';
				echo '<div class="ico-more">';
				echo '<svg version="1.1" id="Livello_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox="0 0 28.4 28.4" enable-background="new 0 0 28.4 28.4" xml:space="preserve"><polygon fill="#FFFFFF" points="28.3,12.9 15.5,12.9 15.5,0 12.9,0 12.9,12.9 0,12.9 0,15.5 12.9,15.5 12.9,28.3 15.5,28.3
				15.5,15.5 28.3,15.5 "/></svg>';
				echo '</div></div></div>';
				echo '<img src="' . wp_get_attachment_url($zak_background, 'full') . '" alt="" />';
				echo '<div class="expanded-image-after" style="border-color:' . $color_bg_block . '"></div>';
				echo '</figure>';
				echo '</div>';
				break;
			default:
				break;
		}

		echo '</div>';
		echo '</div>';

		echo '</div>';

		return ob_get_clean();
	}
}
