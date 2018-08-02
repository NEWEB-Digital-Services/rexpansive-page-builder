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
class Rexbuilder_Section
{
    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     */
    public function __construct()
    {

    }

    /**
     * Function that render the shortcode, merging the attributes and displaying the template.
     *
     * @since    1.0.0
     * @param      string    $a                   The attributest passed.
     * @param      string    $content            The content passed.
     */
    public function render_section($atts, $content = null)
    {
        $parsed_atts = shortcode_atts(array(
            "section_name" => "",
            "type" => "perfect-grid",
            "color_bg_section" => "#ffffff",
            "dimension" => "full",
            "margin" => "",
            "image_bg_section" => "",
            "id_image_bg_section" => "",
            "image_size" => "full",
            'video_bg_url_section' => '',
            'video_bg_id_section' => '',
            'video_bg_url_vimeo_section' => '',
            'full_height' => '',
            "block_distance" => 20,
            "layout" => "fixed",
            'responsive_background' => '',
            'custom_classes' => '',
            'section_width' => '',
            'row_separator_top' => '',
            'row_separator_bottom' => '',
            'row_separator_right' => '',
            'row_separator_left' => '',
            'row_margin_top' => '',
            'row_margin_bottom' => '',
            'row_margin_right' => '',
            'row_margin_left' => '',
            'section_model' => '',
            'row_edited_live' => '',
            'section_model' => '',
            'rexlive_section_id' => '',
            'row_active_photoswipe' => ''
        ), $atts, 'RexpansiveSection');

        extract($parsed_atts);

        // Applying a filter to the content
        // Passing all the attributes as reference to edit them based on the content
        $content = apply_filters('rexpansive_filter_section', $content, array(&$parsed_atts));

        global $post;
        $builder_active = apply_filters('rexbuilder_post_active', get_post_meta($post->ID, '_rexbuilder_active', true));

        if ('true' == $builder_active) {

            global $section_layout;
            $section_layout = $layout;
            $editor = $_GET['editor'];

            $section_style = 'style="';
            if ("" != $id_image_bg_section) {
                $img_attrs = wp_get_attachment_image_src($id_image_bg_section, $image_size);
                $section_style .= 'background-image:url(\'' . $img_attrs[0] . '\');';
            } else if (!empty($color_bg_section)) {
                $section_style .= 'background-color:' . $color_bg_section . ';';
            }

            if ('' != $row_margin_top) {
                $section_style .= 'margin-top:' . $row_margin_top . 'px;';
            }

            if ('' != $row_margin_right) {
                $section_style .= 'margin-right:' . $row_margin_right . 'px;';
            }

            if ('' != $row_margin_bottom) {
                $section_style .= 'margin-bottom:' . $row_margin_bottom . 'px;';
            }

            if ('' != $row_margin_left) {
                $section_style .= 'margin-left:' . $row_margin_left . 'px;';
            }

            $section_responsive_style = '';
            if ("" != $responsive_background):
                $section_responsive_style = ' style="background-color:' . $responsive_background . ';"';
            endif;

            $custom_classes = trim($custom_classes);

            $row_separators = '';
            if ('' != $row_separator_top) {
                $row_separators .= ' data-row-separator-top="' . $row_separator_top . '"';
            }

            if ('' != $row_separator_right) {
                $row_separators .= ' data-row-separator-right="' . $row_separator_right . '"';
            }

            if ('' != $row_separator_bottom) {
                $row_separators .= ' data-row-separator-bottom="' . $row_separator_bottom . '"';
            }

            if ('' != $row_separator_left) {
                $row_separators .= ' data-row-separator-left="' . $row_separator_left . '"';
            }

            ob_start();

            echo '<section';
            if ($section_name != ''):
                $x = preg_replace('/[\W\s+]/', '', $section_name);
                echo ' href="#' . $x . '" id="' . $x . '"';
            endif;

            $content_has_photoswipe = strpos($content, 'photoswipe="true"');

            $content_has_floating_blocks = strpos($content, 'rex-floating-');

            $content_has_static_block = strpos($content, 'rex-static-block');

            $row_has_accordion = has_shortcode($content, 'RexAccordion');

            echo ' class="rexpansive_section' .
            (($content_has_photoswipe > 0) ? ' photoswipe-gallery' : '') .
            (('' != $custom_classes) ? ' ' . $custom_classes : '') .
            (('true' == $full_height) ? ' full-height-section' : '') .
            (('' != $video_bg_url_section && 'undefined' != $video_bg_url_section) ? ' youtube-player' : '') .
            (($content_has_floating_blocks !== false) ? ' rex-section-has-floating-blocks' : '') .
            (($content_has_static_block !== false) ? ' rex-section-has-static-blocks' : '') .
            ((false !== $row_has_accordion) ? ' rex-section-has-accordion' : '') .
            apply_filters('rexpansive_builder_section_class', '', $parsed_atts) .
                '"' .
                (($content_has_photoswipe > 0) ? ' itemscope itemtype="http://schema.org/ImageGallery"' : '') .
                (('' != $video_bg_url_section && 'undefined' != $video_bg_url_section) ? ' data-property="{videoURL:\'' . $video_bg_url_section . '\',containment:\'self\',startAt:0,mute:true,autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}"' : '') .
                (strlen($section_style) > 7 ? ' ' . $section_style . '"' : '');
            
                if ("" != $id_image_bg_section) {
                echo ' data-background_image_width="' . $img_attrs[1] . '" ';
                echo ' data-background_image_height="' . $img_attrs[2]. '" ';
            }

            if ($rexlive_section_id != '') {
                echo ' data-rexlive-section-id="' . $rexlive_section_id . '"';
            }
            echo '>';

            echo '<div class="section-data" style="display: none;" ';
            foreach ($atts as $property_name => $value_property) {
                echo 'data-' . $property_name . '="' . $value_property . '" ';
            }
            unset($property_name);
            unset($value_property);
            if( '' != $video_bg_id_section && 'undefined' != $video_bg_id_section ){
                $video_mp4_url = wp_get_attachment_url($video_bg_id_section);
				echo 'data-video_mp4_url="'. $video_mp4_url .'"';
			}
            echo '></div>';
            if (isset($editor)) {
                include REXPANSIVE_BUILDER_PATH . "public/partials/rexlive-section-tools.php";
            }

            if ('' != $video_bg_url_vimeo_section && 'undefined' != $video_bg_url_vimeo_section) {
                ?>
                <div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--section">
                <iframe src="<?php echo $video_bg_url_vimeo_section; ?>?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0&muted=1" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                </div>
                <?php
            }

            if ('' != $video_bg_id_section && 'undefined' != $video_bg_id_section):
                echo '<div class="rex-video-section-wrap">';
                echo '<video class="rex-video-container" preload muted autoplay loop>';
                echo '<source type="video/mp4" src="' . $video_mp4_url . '" />';
                echo '</video>';
                echo '</div>';
            endif;

            echo '<div class="responsive-overlay"';
            if ("" != $responsive_background) {
                echo $section_responsive_style;
            }
            echo '>';

            if ('boxed' == $dimension) {
                echo '<div class="center-disposition"';
                if ('' != $section_width) {
                    echo ' style="max-width:' . $section_width . ';"';
                }
                echo '>';
            } else {
                echo '<div class="full-disposition">';
            }

            do_action('rexpansive_section_before_grid', array(&$parsed_atts));

            echo '<div class="perfect-grid-gallery grid-stack grid-stack-row" data-separator="' . $block_distance . '" data-layout="' . $layout . '" data-full-height="' . (('true' == $full_height) ? 'true' : 'false') . '"' . $row_separators . '>';
            echo '<div class="perfect-grid-sizer"></div>';
            echo do_shortcode($content);
            echo '</div>';
            echo '</div>';

            if ("" != $responsive_background) {
                echo '</div>';
            }

            echo '</section>';
            return ob_get_clean();
        } else {
            ob_start();
            echo do_shortcode($content);
            return ob_get_clean();
        }
    }
}