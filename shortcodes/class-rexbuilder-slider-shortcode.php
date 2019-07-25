<?php
/**
 * Class that wraps the hooks to define slider shortcode
 *
 * @since  1.0.21 
 * @package rexpansive-builder
 * @deprecated
 */
class Rexbuilder_Slider_Shortcode {

    public function __construct() {
        // $this->attach_hooks();
    }

    /**
     * Add shortcode for handle sliders
     */
    public function render_slider( $atts, $content = null ) {
        extract( shortcode_atts( array(
            'slider_id' => '',
            'class' => '',
        ), $atts ) );

        ob_start();

        if( Rexbuilder_Utilities::check_post_exists( $slider_id ) ) :

            $slider_animation = get_field( '_rex_enable_banner_animation', $slider_id );
            $slider_prev_next = get_field( '_rex_enable_banner_prev_next', $slider_id );
            $slider_dots = get_field( '_rex_enable_banner_dots', $slider_id );

            $slider_gallery = get_field( '_rex_banner_gallery', $slider_id );

            $re = '/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';

            if( !empty( $slider_gallery ) ) :
    ?>
    <div class="rex-slider-wrap" data-rex-slider-animation="<?php echo ( is_array( $slider_animation ) ? 'true': ( "0" == $slider_animation ? 'true' : 'false' ) ); ?>" data-rex-slider-prev-next="<?php echo ( is_array( $slider_prev_next ) ? '1': ( "0" == $slider_prev_next ? 'true' : 'false' ) ); ?>" data-rex-slider-dots="<?php echo ( is_array( $slider_dots ) ? '1': ( "0" == $slider_dots ? 'true' : 'false' ) ); ?>">
        <?php
                foreach( $slider_gallery as $key => $slide ) :
                    $slider_el_style = '';
                    if( isset( $slide['_rex_banner_gallery_image']['url'] ) ) {
                        $slider_el_style = ' style="background-image:url(' . $slide['_rex_banner_gallery_image']['url'] . ')"';
                    }
    ?>
        <div class="rex-slider-element"<?php echo $slider_el_style; ?>>
    <?php
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
    ?>
    <div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div>
    <?php
                }
            } else if( false !== strpos( $slide['_rex_banner_gallery_video'], "vimeo" ) ) {
    ?>
    <div class="vimeo-player">
        <div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block" data-vimeo-video-mute="<?php echo ( is_array( $slide['_rex_banner_gallery_video_audio'] ) ? '0' : '1' ); ?>">
            <iframe src="<?php echo $slide['_rex_banner_gallery_video']; ?>?autoplay=1&loop=1&byline=0&title=0&autopause=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        </div>
    <?php
                if( is_array( $slide['_rex_banner_gallery_video_audio'] ) ) {
    ?>
        <div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div>
    <?php
                }
    ?>
    </div>
    <?php
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
        echo '<div>';
        echo do_shortcode( apply_filters( 'rexpansive_slider_filter_element_title', $slide['_rex_banner_gallery_image_title'], $slide ) );
        echo '</div>';
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
    ?>
        </div>
    <?php
                endforeach;
        ?>
    </div>
    <?php
            endif;
        endif;
        return ob_get_clean();
    }

    /**
     *	RexSliderDefinition shortcode. To use with new slider handler
    *
    */
    public function render_slider_defintion( $atts, $content = null ) {
        extract( shortcode_atts( array(
            'auto_start' => '',
            'prev_next' => '',
            'dots'		=> '',
        ), $atts ) );

        ob_start();

    ?>
    <div class="rex-slider-wrap" data-rex-slider-animation="<?php echo ( 'true' == $auto_start ? 'true': '' ); ?>" data-rex-slider-prev-next="<?php echo ( 'true' == $prev_next ? '1': '' ); ?>" data-rex-slider-dots="<?php echo ( 'true' == $dots ? '1': '' ); ?>">
        <?php echo do_shortcode( $content ); ?>
    </div>
    <?php
        return ob_get_clean();
    }

    public function render_single_slide( $atts, $content = null ) {
        extract( shortcode_atts( array(
            'slide_image_id' => '',
            'slide_video' => '',
            'slide_video_type'		=> '',
            'slide_video_audio'		=> '',
            'slide_url'	=>	''
        ), $atts ) );

        ob_start();
        $slider_el_style = '';
        if( $slide_image_id ) {
            $slider_el_style .= ' style="background-image:url(' . wp_get_attachment_url( $slide_image_id ) . ')"';
        }
    ?>
        <div class="rex-slider-element"<?php echo $slider_el_style; ?>>
    <?php
    if( $slide_video ) {
        // check if is a valid URL
        $re = '/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';
        preg_match($re, $slide_video, $matches, PREG_OFFSET_CAPTURE, 0);
        
        if( count($matches) > 0 ) {
            switch( $slide_video_type ) {
                case 'youtube':
    ?>
        <div class="youtube-player" data-property="{videoURL:'<?php echo $slide_video; ?>',containment:'self',startAt:0,mute:<?php echo ( "true" == $slide_video_audio ? 'false' : 'true' ); ?>,autoPlay:1,loop:true,opacity:1,showControls:false,showYTLogo:false}" data-ytvideo-stop-on-click="false">
    <?php
                    break;
                case 'vimeo':
    ?>
    <div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block" data-vimeo-video-mute="<?php echo ( "true" == $slide_video_audio ? '0' : '1' ); ?>">
        <iframe src="<?php echo $slide_video; ?>?autoplay=1&loop=1&byline=0&title=0&autopause=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
    <?php
                    break;
                default:
                    break;
            }
        } else {
            if( 'mp4' == $slide_video_type ) {
    ?>
    <div class="rex-video-section-wrap">
        <video class="rex-video-container" preload <?php echo ( "true" == $slide_video_audio ? '' : 'muted' ); ?> autoplay loop>
            <source type="video/mp4" src="<?php echo wp_get_attachment_url( $slide_video ); ?>" />
        </video>
    </div>
    <?php
            }
        }
    }

    if( $slide_url ) {
    ?>
    <a class="rex-slider-element-link" href="<?php echo esc_url( $slide_url ); ?>" target="_blank">
    <?php
    }

    if( $content ) {
        echo '<div class="rex-slider-element-title">';
        echo do_shortcode( $content );
        echo '</div>';
    }

        if( $slide_url ) {
    ?>
    </a>
    <?php
        }

    if( $slide_video ) {
        if( count($matches) > 0 ) {
            switch( $slide_video_type ) {
                case 'youtube':
    ?>
            </div>
    <?php
                break;
            default:
                break;
            }
        }
    }
    ?>
        </div>
    <?php
        return ob_get_clean();
    }
}