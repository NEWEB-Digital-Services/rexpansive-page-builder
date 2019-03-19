<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public
 * @author     Neweb <info@neweb.info>
 */
class Rexbuilder_Public
{

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;

    /**
     * The options of the plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      array    $plugin_options    The options of the plugin.
     */
    private $plugin_options;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $plugin_name       The name of the plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;

        $this->plugin_options = get_option($this->plugin_name . '_options');
    }

    public function rexlive_body_class( $classes ) {
        if( Rexbuilder_Utilities::isBuilderLive() ) {
            // array_push( $classes, 'rexbuilder-live-active' );
            $classes[] = 'rexbuilder-live-active';
        }
        return $classes;
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_styles()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Rexbuilder_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Rexbuilder_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        if ($this->builder_active_on_this_post_type()) {

            $ver = null;

            if (!is_404()) { // TODO
                // if( Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo', $post->post_content ) > 0 || Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo_slide', $post->post_content ) > 0 ) {
                wp_enqueue_script('vimeo-player', 'https://player.vimeo.com/api/player.js', array('jquery'), '20120206', true);
                // }
            }

            $cartella = "public/";
            $cartella_admin = "admin/";

            if( Rexbuilder_Utilities::isBuilderLive() ) {
                wp_enqueue_style( 'rexbuilder-live-google-fonts', 'https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i', false );
                wp_enqueue_style('material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), $ver, 'all');
                wp_enqueue_style('font-awesome', REXPANSIVE_BUILDER_URL . $cartella_admin . 'font-awesome-4.3.0/css/font-awesome.min.css', array(), $ver, 'all');

                wp_enqueue_style('rex-custom-fonts', REXPANSIVE_BUILDER_URL . $cartella_admin . 'rexpansive-font/font.css', array(), $ver, 'all');

                wp_enqueue_style('rexbuilder-style', REXPANSIVE_BUILDER_URL . $cartella_admin . 'css/builder.css', array(), $ver, 'all');
                wp_enqueue_style('custom-editor-buttons-style', REXPANSIVE_BUILDER_URL . $cartella_admin . 'css/rex-custom-editor-buttons.css', array(), $ver, 'all');

                wp_enqueue_style('spectrum-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/spectrum.css', array(), $ver, 'all');
                wp_enqueue_style('medium-editor-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/medium-editor.css', array(), $ver, 'all');
                wp_enqueue_style('medium-editor-insert-frontend-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/medium-editor-insert-plugin-frontend.css', array(), $ver, 'all');
            }

            // wp_enqueue_style('jquery-dumb-accordion', REXPANSIVE_BUILDER_URL . $cartella . 'css/jquery.accordion.css', array(), $ver, 'all');

            wp_enqueue_style('photoswipe-skin', REXPANSIVE_BUILDER_URL . $cartella . 'Photoswipe/default-skin/default-skin.css', array(), $ver, 'all');

            wp_enqueue_style('jquery.mb.YTPlayer-style', REXPANSIVE_BUILDER_URL . $cartella . 'jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css', array(), $ver, 'all');

            // wp_enqueue_style('overlay-scrollbar-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/OverlayScrollbars.min.css', array(), $ver, 'all');

            wp_enqueue_style('animate-css', REXPANSIVE_BUILDER_URL . $cartella . 'css/animate.css', array(), $ver, 'all');
            wp_enqueue_style('textfill-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/textFill.css', array(), $ver, 'all');

            wp_enqueue_style('jquery-ui-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/jquery-ui.min.css', array(), $ver, 'all');
            wp_enqueue_style('gridstack-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/gridstack.css', array(), $ver, 'all');

            // wp_enqueue_style('input-spinner', REXPANSIVE_BUILDER_URL . $cartella . 'css/input-spinner.css', array(), $ver, 'all');

            wp_enqueue_style('rexpansive-builder-rexbutton-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/rex_buttons.css', array(), $ver, 'all');
            if( Rexbuilder_Utilities::isBuilderLive() ) 
            {
                wp_enqueue_style('rexpansive-builder-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/public-editor.css', array(), $ver, 'all');
            }
            else
            {
                wp_enqueue_style('rexpansive-builder-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/public.css', array(), $ver, 'all');
            }

            wp_enqueue_style('rexpansive-builder-editor-style', REXPANSIVE_BUILDER_URL .'admin/css/live-def.css', array(), $ver, 'all');
        }
    }

    /**
     * Register the stylesheets for the public-facing side of the site for production
     *
     * @since    1.0.0
     */
    public function enqueue_styles_production()
    {
        if ($this->builder_active_on_this_post_type()) {

            if (!is_404()) { // TODO
                // if( Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo', $post->post_content ) > 0 || Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo_slide', $post->post_content ) > 0 ) {
                wp_enqueue_script('vimeo-player', 'https://player.vimeo.com/api/player.js', array('jquery'), '20120206', true);
                // }
            }

            if( Rexbuilder_Utilities::isBuilderLive() ) {
                wp_enqueue_style( 'rexbuilder-live-google-fonts', 'https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i', false );
                wp_enqueue_style('material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), false, 'all');
                wp_enqueue_style('font-awesome', REXPANSIVE_BUILDER_URL . 'admin/font-awesome-4.3.0/css/font-awesome.min.css', array(), false, 'all');

                wp_enqueue_style($this->plugin_name . '-style', REXPANSIVE_BUILDER_URL . 'admin/css/builderlive-editor.css', array(), null, 'all');
            } else {
                wp_enqueue_style($this->plugin_name . '-style', REXPANSIVE_BUILDER_URL . 'public/css/builderlive.css', array(), null, 'all');
            }
        }
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Rexbuilder_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Rexbuilder_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        if ($this->builder_active_on_this_post_type()) {
            $ver = null;

            $cartella = "public/";
            if( Rexbuilder_Utilities::isBuilderLive() ) {
                //include media libray
                wp_enqueue_media();
                
                // TIPPY
                wp_enqueue_script( 'tippy', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/tippy.all.min.js', array( 'jquery' ), null, true );
    
                // RANGY
                wp_enqueue_script( 'rangy-core', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/rangy-1.3.0/rangy-core.js', array( 'jquery' ), null, true );
                wp_enqueue_script( 'rangy-classapplier', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/rangy-1.3.0/rangy-classapplier.js', array( 'jquery' ), null, true );
                wp_enqueue_script( 'rangy-selectionsaverestore', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/rangy-1.3.0/rangy-selectionsaverestore.js', array( 'jquery' ), null, true );
                wp_enqueue_script( 'rangy-textrange', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/rangy-1.3.0/rangy-textrange.js', array( 'jquery' ), null, true );

                // SPECTRUM COLOR PICKER
                wp_enqueue_script('spectrumColor', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/spectrum.js', array('jquery'), $ver, true);

                // MEDIUM EDITOR
                wp_enqueue_script('medium-editor', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/medium-editor.js', array('jquery'), $ver, true);
                wp_enqueue_script('mediumEditorToolbarStates', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/medium-editor-toolbar-states.min.js', array('jquery'), $ver, true);
                // wp_enqueue_script('handlebars-runtime', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/handlebars.runtime.js', array('jquery'), $ver, true);
                // wp_enqueue_script('jquery-fileupload', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.fileupload.js', array('jquery'), $ver, true);
                // wp_enqueue_script('jquery-cycle2', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.cycle2.min.js', array('jquery'), $ver, true);
                // wp_enqueue_script('cycle2-center', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.cycle2.center.min.js', array('jquery'), $ver, true);
                // wp_enqueue_script('medium-editor-insert', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/medium-editor-insert-plugin.js', array('jquery'), $ver, true);

                // Rexbuilder
                wp_enqueue_script('1-RexUtilEditorUtilities', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Util_Editor_Utilities.js', array('jquery'), $ver, true);
                wp_enqueue_script('0-Rexbuilder_Array_Utilities', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/0-Rexbuilder_Array_Utilities.js', array('jquery'), $ver, true);
                wp_enqueue_script('1-RexColorPalette', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Color_Palette.js', array('jquery'), $ver, true);
                wp_enqueue_script('1-RexOverlayPalette', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Overlay_Palette.js', array('jquery'), $ver, true);

                wp_enqueue_script('textEditor', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/2-Text_Editor.js', array('jquery'), $ver, true);

                wp_enqueue_script('section-js', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Section.js', array('jquery'), $ver, true);
                wp_enqueue_script('section-editor-js', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Section_Editor.js', array('jquery'), $ver, true);
                wp_enqueue_script('block-js', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Block.js', array('jquery'), $ver, true);
                wp_enqueue_script('block-editor-js', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Block_Editor.js', array('jquery'), $ver, true);
                wp_enqueue_script('4-modals', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/4-modals.js', array('jquery'), $ver, true);
            }

            // wp_enqueue_script('jquery-dumb-accordion', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.accordion.js', array('jquery'), $ver, true);

            // imagesloaded
            // wp_enqueue_script('imagesloaded', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/imagesloaded.pkgd.min.js', array('jquery'), $ver, true);
            // requestanimationframe
            wp_enqueue_script('jquery-requestanimationframe', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.requestanimationframe.min.js', array('jquery'), $ver, true);
            // JS TMPL
            wp_enqueue_script('tmpl', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/tmpl.min.js', array('jquery'), $ver, true);

            // PHOTOSWIPE
            wp_enqueue_script('photoswipe', REXPANSIVE_BUILDER_URL . $cartella . 'Photoswipe/photoswipe.min.js', array('jquery'), $ver, true);
            wp_enqueue_script('photoswipe-ui', REXPANSIVE_BUILDER_URL . $cartella . 'Photoswipe/photoswipe-ui-default.min.js', array('jquery'), $ver, true);

            // YTPLAYER
            wp_enqueue_script('YTPlayer', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.mb.YTPlayer.min.js', array('jquery'), $ver, true);

            // STORE JS
            wp_enqueue_script('storeVariables', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/store.legacy.min.js', array('jquery'), $ver, true);

            // REXBUILDER
            wp_enqueue_script('1-RexUtil', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/1-Rexbuilder_Util.js', array('jquery'), $ver, true);
            wp_enqueue_script('1-RexUtilEditor', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Util_Editor.js', array('jquery'), $ver, true);
            wp_enqueue_script('1-RexCreateBlocks', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_CreateBlocks.js', array('jquery'), $ver, true);
            wp_enqueue_script('1-RexDomUtil', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Dom_Util.js', array('jquery'), $ver, true);
            wp_enqueue_script('1-RexColorPalette', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Color_Palette.js', array('jquery'), $ver, true);
            wp_enqueue_script('1-Rexbutton', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/1-Rexbuilder_Rexbutton.js', array('jquery'), $ver, true);
            wp_enqueue_script('1-RexOverlayPalette', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/1-Rexbuilder_Overlay_Palette.js', array('jquery'), $ver, true);
            wp_enqueue_script('2-RexSaveListeners', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/2-Rex_Save_Listeners.js', array('jquery'), $ver, true);

            //gridstack
            wp_enqueue_script('jquery-ui', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery-ui.min.js', array('jquery'), $ver, true);
            wp_enqueue_script('touchPunch', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.ui.touch-punch.js', array('jquery'), $ver, true);
            wp_enqueue_script('lodash-live', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/lodash.js', array('jquery'), $ver, true);
            wp_enqueue_script('gridstack', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/gridstack.js-0.4.0/src/gridstack.js', array('jquery'), $ver, true);
            wp_enqueue_script('gridstackUI', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/gridstack.js-0.4.0/src/gridstack.jQueryUI.js', array('jquery'), $ver, true);

            // Scripts
            wp_enqueue_script('3-Navigator', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/3-Navigator.js', array('jquery'), $ver, true);
            // wp_enqueue_script('5-FormFixes', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/5-Rexbuilder_FormFixes.js', array('jquery'), $ver, true);
            wp_enqueue_script('5-flickity', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/flickity.pkgd.min.js', array('jquery'), $ver, true);
            wp_enqueue_script('2-RexSlider', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/2-RexSlider.js', array('jquery'), $ver, true);
            wp_enqueue_script( 'textfill', REXPANSIVE_BUILDER_URL  . $cartella. 'js/vendor/2-jquery.textFill.js', array( 'jquery' ), $ver, true );
            wp_enqueue_script('8-VimeoVideo', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/8-VimeoVideo.js', array('jquery'), $ver, true);
            //wp_enqueue_script( 'text-resize', REXPANSIVE_BUILDER_URL  . $cartella. 'js/__TextResize.js', array( 'jquery' ), $ver, true );
            wp_enqueue_script('scrolled', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/4-jquery.rexScrolled.js', array('jquery'), $ver, true);
            wp_enqueue_script('rex-accordion', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/6-jquery.rexAccordion.js', array('jquery'), $ver, true);
            wp_enqueue_script('indicator', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/6-jquery.rexIndicator.js', array('jquery'), $ver, true);
            wp_enqueue_script('pixi', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/pixi.min.js', array('jquery'), $ver, true);
            if( !Rexbuilder_Utilities::isBuilderLive() ) {
                wp_enqueue_script('odometer', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/odometer.min.js', array('jquery'), $ver, true);
            }
            wp_enqueue_script('effect', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.rexEffect.js', array('jquery'), $ver, true);

            wp_enqueue_script('utilities', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/utilities.js', array('jquery'), $ver, true);
            // wp_enqueue_script('overlay-scrollbar', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.overlayScrollbars.min.js', array('jquery'), $ver, true);
            wp_enqueue_script('2-jqueryEditor', REXPANSIVE_BUILDER_URL . $cartella . 'js/live/2-jquery.perfectGridGalleryEditor.js', array('jquery'), null, true);

            wp_enqueue_script('3-velocity', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/3-velocity.min.js', array('jquery'), $ver, true);
            wp_enqueue_script('3-velocityui', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/3-velocity.ui.min.js', array('jquery'), $ver, true);
            wp_enqueue_script('4-jqueryScrollify', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/4-jquery.rexScrollify.js', array('jquery'), $ver, true);
            
            wp_enqueue_script('rexbuilder', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/rexbuilder-public.js', array('jquery'), $ver, true);

            wp_localize_script('rexbuilder', '_plugin_frontend_settings', apply_filters('rexbuilder_js_settings', array(
                'plugin_base_url' => REXPANSIVE_BUILDER_URL,
                'animations' => apply_filters('rexbuilder_animation_enabled', $this->plugin_options['animation']),
                'textFill' => array(
                    'font_family' => 'sans-serif',
                    'font_weight' => 'bold',
                ),
                'native_scroll_animation' => true,
                'user' => array(
                    'logged' => is_user_logged_in(),
                    'editing' => ((isset($_GET['editor']) && $_GET['editor'] == "true") ? true : false),
                ),
                'rexajax' => array(
                    'ajaxurl' => admin_url('admin-ajax.php'),
                    'rexnonce' => wp_create_nonce('rex-ajax-call-nonce'),
                ),
                'defaultSettings' => array(
                    'collapseWidth' => 768,
                ),
                'siteurl' => get_site_url(),
                'odometer' => array(
                    'theme' => 'digital',
                    'format' => '(.ddd),dd'
                )
            )
            ) );
        }
    }

    /**
     * Register the stylesheets for the public-facing side of the site for production
     *
     * @since    1.0.0
     */
    public function enqueue_scripts_production()
    {
        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Rexbuilder_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Rexbuilder_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        if ($this->builder_active_on_this_post_type()) {
            if( Rexbuilder_Utilities::isBuilderLive() ) {
                wp_enqueue_script( $this->plugin_name, REXPANSIVE_BUILDER_URL . 'public/js/builderlive-editor.js', array( 'jquery' ), null, true );
            } else {
                wp_enqueue_script( $this->plugin_name, REXPANSIVE_BUILDER_URL . 'public/js/builderlive.js', array( 'jquery' ), null, true );
            }

            wp_localize_script( $this->plugin_name, '_plugin_frontend_settings', apply_filters('rexbuilder_js_settings', array(
                'animations' => apply_filters('rexbuilder_animation_enabled', $this->plugin_options['animation']),
                'textFill' => array(
                    'font_family' => 'sans-serif',
                    'font_weight' => 'bold',
                ),
                'native_scroll_animation' => true,
                'user' => array(
                    'logged' => is_user_logged_in(),
                    'editing' => ((isset($_GET['editor']) && $_GET['editor'] == "true") ? true : false),
                ),
                'rexajax' => array(
                    'ajaxurl' => admin_url('admin-ajax.php'),
                    'rexnonce' => wp_create_nonce('rex-ajax-call-nonce'),
                ),
                'defaultSettings' => array(
                    'collapseWidth' => 768,
                ),
                'siteurl' => get_site_url(),
                'plugin_base_url' => REXPANSIVE_BUILDER_URL,
                'odometer' => array(
                    'theme' => 'digital',
                    'format' => '(.ddd),dd'
                )
                )
            ) );
        }
    }

    public function include_js_template()
    {
        if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) {
            return;
        }
        if (!isset($this->plugin_options['post_types'])) {
            return;
        }
        // if ( Rexbuilder_Utilities::isBuilderLive() ) {
            include_once REXPANSIVE_BUILDER_PATH . "public/partials/rexbuilder-js-templates.php";
        // }
    }

    /**
     * Including the new sprites
     *
     * @return void
     * @since 1.1.3
     */
    public function include_sprites()
    {
        ?><div style="display:none"><?php include_once REXPANSIVE_BUILDER_PATH . 'admin/sprites/symbol/svg/sprite.symbol.svg';?></div><?php
    }

    public function include_sprites_live() {
		?><div style="display:none"><?php include_once( REXPANSIVE_BUILDER_PATH .  'admin/sprites_live_new/symbol/svg/sprite.symbol.svg' ); ?></div><?php
    }
    
    /**
     * Test purpose
     *
     * @return void
     * @todo    Remove me on production
     */
    public function include_sprites_test() {
		?><div style="display:none"><?php include_once( REXPANSIVE_BUILDER_PATH .  'admin/sprites_test_2/sprite.symbol.svg' ); ?></div><?php
	}

    public function rexlive_save_sections_rexids()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

        if (!isset($_POST['ids_used'])) {
            $response['error'] = true;
            $response['msg'] = 'Data error!';
            wp_send_json_error($response);
        }

        $response['error'] = false;
        
        $clearData = stripslashes($_POST['ids_used']);
        update_option("_rex_section_ids_used", $clearData);

        wp_send_json_success($response);
    }

    public function rexlive_save_custom_css()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

        $response['error'] = false;

        $post_id_to_update = intval($_POST['post_id_to_update']);

        $custom_css = $_POST['custom_css'];

        update_post_meta($post_id_to_update, '_rexbuilder_custom_css', $custom_css);

        wp_send_json_success($response);
    }

    public function rexlive_save_avaiable_layouts()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

        $response['error'] = false;

        $post_id_to_update = intval($_POST['post_id_to_update']);

        $names = $_POST['names'];

        update_post_meta($post_id_to_update, '_rex_responsive_layouts_names', $names);

        wp_send_json_success($response);
    }

    public function rexlive_save_avaiable_model_layouts_names()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

        $response['error'] = false;

        $post_id_to_update = intval($_POST['post_id_to_update']);

        $names = $_POST['names'];
        
        update_post_meta($post_id_to_update, '_rex_model_customization_names', $names);
        wp_send_json_success($response);
    }

    public function rexlive_save_customization_layout()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

        $response['error'] = false;

        $post_id_to_update = intval($_POST['post_id_to_update']);

        $layout = $_POST['sections'];
        $layout_name = $_POST['layout_name'];

        $clearData = stripslashes($_POST['sections']);
        update_post_meta($post_id_to_update, '_rex_customization_' . $layout_name, $clearData);

        $response['id_received'] = $post_id_to_update;
        $response['layoutName'] = $layout_name;
        wp_send_json_success($response);
    }

    public function rexlive_save_customization_model()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

        $response['error'] = false;

        $post_id_to_update = intval($_POST['model_id_to_update']);

        $targets = $_POST['targets'];
        $layout_name = $_POST['layout_name'];
        
        $targetsData = stripslashes($targets);
        update_post_meta($post_id_to_update, '_rex_model_customization_' . $layout_name, $targetsData);

        $response['id_received'] = $post_id_to_update;
        $response['layoutName'] = $layout_name;

        wp_send_json_success($response);
    }

    /**
     *    Ajax call to save sections status
     *
     *    @since 1.0.15
     * 
     */
    public function rexlive_save_shortcode()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

        $response['error'] = false;

        $post_id_to_update = intval($_POST['post_id_to_update']);
        $cleanPost = $_POST['clean_post'];
        $shortcode = $_POST['rex_shortcode'];

        $args = array(
            'ID' => $post_id_to_update,
            'post_content' => $cleanPost,
        );

        // $update = wp_update_post($args);
        // $response['update'] = $update;

        update_post_meta($post_id_to_update, '_rexbuilder_shortcode', $shortcode);

        update_post_meta($post_id_to_update, '_save_from_backend', "false" );

        $response['id_received'] = $post_id_to_update;

        wp_send_json_success($response);
    }

    /**
     * Using Wordpress embed feature to get an embed iframe from an url
     * @since 2.0.0
     */
    public function rexlive_get_embed_code() {  // Funzione pubblica che permette il caricamento del video inline nell'elemento

        $nonce = $_GET['nonce_param'];  // $nonce è un dato che viene ricevuto da un form tramite un method=GET

        $response = array(  // $response è un raccoglitore contenente due valori che sono 'error' e 'msg'
            'error' => false,   // 'error' è settato false come valore iniziale
            'msg' => '',        // 'msg' è settato come un nothing
        );

        if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) : // Si verifica la presenza del valore inviato dall'imput
            $response['error'] = true;          // 'error' cambia lo stato di default è viene abilitato a 'true'
            $response['msg'] = 'Error!';        // 'msg' assume un valore testuale    
            wp_send_json_error( $response );    // viene mandato l'errore tramite json, denominato "$response"
        endif;                                  // termina la verifica

        $url_to_embed = $_GET['url_to_embed'];  // $url_to_embed è il valore che viene preso al momento del caricamento del video
        if( false === wp_http_validate_url( $url_to_embed ) ) { // SE, in seguito al controllo, si verifica l'invalidità del valore
            $response['error'] = true;          // 'error' cambia lo stato di default è viene abilitato a 'true'
            $response['msg'] = 'Error!';        // 'msg' assume un valore testuale
            wp_send_json_error( $response );    // viene mandato l'errore tramite json, denominato "$response"
        }

        $embed = '[embed]' . $url_to_embed . '[/embed]';    // Viene costruita la struttura html/php per il valore finale

        $response['shortcode'] = $embed;    // $response['shortcode'] è uguale al valore di $embed preconfigurato qua sopra
        
        // Must run the shortcode in this manner
        // Cause do_shortcode do not work for [embed]

        global $wp_embed;   // Si richiama $wp_embed
        $response['embed'] = $wp_embed->run_shortcode($embed);  // Si comprime $response['embed'] in $embed, tramite $wp_embed

        wp_send_json_success($response);    // viene mandato il risultato tramite json, denominato "$response"
    }

    public function rexlive_edit_model_shortcode_builder()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
            $response['error'] = true;
            $response['msg'] = 'Error!';
            wp_send_json_error( $response );
        endif;

        if( !isset( $_POST['model_data'] ) ) {
            $response['error'] = true;
            $response['msg'] = 'Error!';
            wp_send_json_error( $response );
        }

        $model_settings = $_POST['model_data'];

        if( empty( $model_settings['post_content'] ) ) {
            $response['error'] = true;
            $response['msg'] = 'Error. No content!';
            wp_send_json_error( $response );
        }

        $model_to_edit = (int)$model_settings['model_id'];

        if( Rexbuilder_Utilities::check_post_exists( $model_to_edit ) ) {

            $new_model_title = $model_settings['post_title'];

            $argsModel = array(
                'ID'           => $model_to_edit,
                'post_title'   => $new_model_title,
                'post_content' => $model_settings['post_content']
            );

            wp_update_post( $argsModel );
            
            $argsQuery = array(
				'post_type'		=>	'rex_model',
				'post_status'	=>	'private',
				'p'				=>	 $model_to_edit
			);

			$query = new WP_Query( $argsQuery );
			if ( $query->have_posts() ) {
				while ( $query->have_posts() ) {
					$query->the_post();
					$post = $query->post;
					$response['model_html'] = do_shortcode($post->post_content);
				}
			}
            wp_reset_postdata();
            
            update_post_meta($model_to_edit, '_save_from_backend', "false" );
            $response['model_id'] = $argsModel["ID"];
        } else {
            $response['model_id'] = -1;
        }
        wp_send_json_success( $response );
    }

    public function rexlive_save_buttons_in_page()
    {
        $nonce = $_POST['nonce_param'];

        $response = array(
            'error' => false,
            'msg' => '',
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

        $response['error'] = false;

        $post_id_to_update = intval($_POST['post_id_to_update']);
        $ids_in_page = $_POST['ids'];

        update_post_meta($post_id_to_update, '_rexbuilder_buttons_ids_in_page', $ids_in_page);
        $response['backIDS'] = $ids_in_page;
        wp_send_json_success($response);
    }

    /**
     * Get the post ID. Check if WooCommerce is active and if the current page is a shop page
     * to correctly retreive its id
     *
     * @return void
     * @since 2.0.0
     * @edit 04-02-2019
     */
    public function print_post_id()
    {
        $page_id = null;
        if ( function_exists( 'is_shop' ) && is_shop() && function_exists( 'wc_get_page_id' ) )
        {
            $page_id = wc_get_page_id( 'shop' );
        }
        else
        {
            $page_id = get_the_ID();
        }
        ?>
        <div id="id-post" data-post-id="<?php echo esc_attr( $page_id ); ?>"></div>
        <?php
    }
    
    /**
     * Filtering post_content to add builder live information
     * @since 2.0.0
     */
    public function generate_builder_content($content) {
        global $post;      

        $builder_active = apply_filters('rexbuilder_post_active', get_post_meta($post->ID, '_rexbuilder_active', true));
        
        if ('true' == $builder_active) {

            ob_start();

            if( Rexbuilder_Utilities::isBuilderLive() ){
                $editor = $_GET['editor'];
            } else{
                $editor = false;
            }

        $defaultButtonsIDs = '[]';
        $buttonsIDsJSON = get_option( '_rex_buttons_ids', $defaultButtonsIDs );
        $stripped = stripslashes( $buttonsIDsJSON );
        $buttonsIDsUsed = json_decode($stripped, true);

        $rexContainerMargins = "";
        if($editor){
            $fixTopMargins = false;
            $globalMargins = get_option("_rex_global_margins_container", "");
            $pageMargins = get_post_meta($post->ID, '_margins_container', true);
            $globalMarginsStripped = stripslashes( $globalMargins );
            $globalMarginsDecoded = json_decode($globalMarginsStripped, true);
            $pageMarginsStripped = stripslashes( $pageMargins );
            $pageMarginsDecoded = json_decode($pageMarginsStripped, true);
            
            if($pageMarginsDecoded !== null){
                $rexContainerMargins = "margin-top: ".$pageMarginsDecoded["top"]."px";
                if($pageMarginsDecoded["top"] > 0){
                    $fixTopMargins = true;
                }
            } else if($globalMarginsDecoded !== null){
                $rexContainerMargins = "margin-top: ".$globalMarginsDecoded["top"]."px";
                if($globalMarginsDecoded["top"] > 0){
                    $fixTopMargins = true;
                }
            }
        }

?>
    <div class="rexbuilder-live-content<?php echo ($editor ? ' rexbuilder-live-content--editing add-new-section--hide'.($fixTopMargins ? ' fix-tools-first-row' : '') : ''); ?>"<?php echo ($rexContainerMargins != "" ? " style=".$rexContainerMargins."\"" : "");?>>
        <?php
        require REXPANSIVE_BUILDER_PATH . "public/partials/rexlive-page-information.php";

        $backendEditing = "true";
        if(get_post_meta($post->ID, '_save_from_backend', true) == "false"){
            $backendEditing = "false";
        }
        ?>
        <div class="rex-container" data-rex-layout-selected="" data-backend-edited="<?php echo $backendEditing;?>">
        <?php
        echo do_shortcode($rexbuilderShortcode);
        ?>
        </div>
        <?php 
        if (isset($editor) && $editor == "true") {
?>
            <div class="bl_d-flex bl_jc-c add-new-section__wrap">
                <div class="tool-button tool-button--inline tool-button--flat tool-button--add-big add-new-section tippy" data-new-row-position="bottom" data-tippy-content="<?php _e('Add Row','rexpansive'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                </div>
            </div>
            <?php include_once REXPANSIVE_BUILDER_PATH . "public/partials/rexlive-loader.php"; ?>
            <?php include_once REXPANSIVE_BUILDER_PATH . "public/partials/rexlive-color-palette.php"; ?>
            <?php include_once REXPANSIVE_BUILDER_PATH . "public/partials/rexlive-overlay-palette.php"; ?>
        <?php
            }
        ?>
    </div>
    <?php
            return ob_get_clean();
        } else {
            return $content;
        }
    }
    /**
     * This filter insures users only see their own media
     */
    public function filter_media($query)
    {
        // admins get to see everything
        if (!current_user_can('manage_options')) {
            $query['author'] = get_current_user_id();
        }

        return $query;
    }

    /**
     * Prepare the html template for photoswipe gallery.
     *
     * @since    1.0.0
     */
    public function print_photoswipe_template()
    {
        if ($this->builder_active_on_this_post_type()) {
            include Rexbuilder_Utilities::get_plugin_templates_path('rexbuilder-photoswipe-template.php');
        }
    }

    /**
     * Print the custom styles defined in the builder
     *
     * @since    1.0.0
     */
    public function print_post_custom_styles()
    {
        if ($this->builder_active_on_this_post_type()) {
            global $post;
            $meta = get_post_meta($post->ID, '_rexbuilder_custom_css', true);
            if ($meta != ''):
                wp_add_inline_style( $this->plugin_name . '-style', $meta);
            endif;
        }
    }
    
    public function print_rex_buttons_style()
    {
        if ($this->builder_active_on_this_post_type()) {
            global $post;
            $buttonsIDs = get_post_meta($post->ID, '_rexbuilder_buttons_ids_in_page', true);
            $buttonsInPage = json_decode($buttonsIDs, true);
            $style = "";
            if ( null !== $buttonsInPage )
            {
                foreach ( $buttonsInPage as $index => $id_button ) {
                    $buttonStyle = get_option('_rex_button_'.$id_button.'_css', "");
                    $buttonStyle = stripslashes($buttonStyle);
                    $style .= $buttonStyle;
                }
            }
            if($style != ''){
                wp_add_inline_style('rexpansive-builder-rexbutton-style', $style);
            }
        }
    }
    /**
     *    Prepare the html template for the vertical internal navigation (dots)
     *
     *    @since    1.0.0
     */
    public function print_vertical_dots()
    {
        global $post;

        if ($this->builder_active_on_this_post_type()) {
            $nav = get_post_meta(get_the_ID(), '_rex_navigation_type', true);

            if (!empty($nav) && !empty(Rexbuilder_Utilities::get_plugin_templates_path('rexbuilder-' . $nav . '-template.php'))) {
                $rexbuilderShortcode = get_post_meta($post->ID, '_rexbuilder_shortcode', true);
                
                if ($rexbuilderShortcode == "") {
                    $rexbuilderShortcode = $post->post_content;
                }
                $pattern = get_shortcode_regex();

                preg_match_all("/$pattern/", $rexbuilderShortcode, $content_shortcodes);
                // Check for section titles; if no one has a title, don't display the navigation
                $titles = array();
                foreach ($content_shortcodes[3] as $attrs):
                    $x = shortcode_parse_atts(trim($attrs));
                    if (isset($x['section_name']) && $x['section_name'] != ''):
                        $titles[] = $x['section_name'];
                    endif;
                endforeach;

                if (count($titles) > 0) {
                    include Rexbuilder_Utilities::get_plugin_templates_path('rexbuilder-' . $nav . '-template.php');
                } else{
                    if ( Rexbuilder_Utilities::isBuilderLive() ){
                        ?> 
                        <nav class="vertical-nav nav-editor-mode-enable">
                            <ul>
                            </ul>
                        </nav>
                        <?php
                    }
                }
            } else {
                if( Rexbuilder_Utilities::isBuilderLive() ){
                    ?> 
                    <nav class="vertical-nav nav-editor-mode-disable">
                        <ul>
                        </ul>
                    </nav>
                    <?php
                }
            }
        }
    }

    /**
     * Check if the builder is active on this post type
     *
     * @return bool
     * @since 1.1.1
     */
    private function builder_active_on_this_post_type()
    {
        $post_to_activate = $this->plugin_options['post_types'];
        $this_post_type = get_post_type();

        return (apply_filters('rexbuilder_post_type_active', isset($post_to_activate) && $this_post_type && array_key_exists($this_post_type, $post_to_activate)));
    }

    /**
	 * Searching for custom attributes inside cf7 shortcode, to style the modules
	 * Searching for
	 * - form_background
	 * - form_padding
	 * - form_width
	 * - form_font_size
	 * - form_text_align
	 * - text_color
	 * - link_color
	 * - input_color
	 * - input_width
	 * - input_height
	 * - input_background
	 * - input_border
	 * - input_border_width
	 * - input_border_radius
	 * - input_font_size
	 * - input_font_weight
	 * - input_letter_spacing
	 * - input_padding
	 * - input_required_color
	 * - input_required_background
	 * - input_required_border
	 * - placeholder_color
	 * - placeholder_font_weight
	 * - placeholder_letter_spacing
	 * - placeholder_text_transform
	 * - submit_color
	 * - submit_background
	 * - submit_border
	 * - submit_border_radius
	 * - submit_width
	 * - submit_height
	 * - submit_font_size
	 * - submit_font_weight
	 * - submit_letter_spacing
	 * - submit_padding
	 * - reset_color
	 * - reset_background
	 * - reset_border
	 * - reset_border_radius
	 * - reset_width
	 * - reset_height
	 * - reset_font_size
	 * - reset_font_weight
	 * - reset_letter_spacing
	 * - reset_padding
	 * - error_color
	 * - error_background
	 * - error_border
	 * - success_color
	 * - success_background
	 * - success_border
	 * - acceptance_color
	 * - acceptance_font_size
	 * - acceptance_letter_spacing
	 * - acceptance_line_height
	 * - acceptance_text_align
	 * - checkbox_border
	 * - checkbox_border_width
	 * - checkbox_background
	 * - loader_background
	 * - loader_color
	 *
	 * @param array $out
	 * @param array $pairs
	 * @param array $atts
	 * @param string $shortcode
	 * @return array
	 * @since 1.1.2
	 */
	public function cf7_custom_style($out, $pairs, $atts, $shortcode) {
		$cstyle = '';
		
		$cclass = 'rxcf7-custom-style-' . $atts['id'];
		
		if( isset( $atts['input_color'] ) || isset( $atts['input_width'] ) || isset( $atts['input_height'] ) || isset( $atts['input_font_size'] ) || isset( $atts['input_font_weight'] ) || isset( $atts['input_letter_spacing'] ) || isset( $atts['input_padding'] ) || isset( $atts['input_border'] ) || isset( $atts['input_border_width'] ) || isset( $atts['input_border_radius'] ) || isset( $atts['input_background'] ) || isset( $atts['input_required_color'] ) || isset( $atts['input_required_background'] ) || isset( $atts['input_required_border'] ) || isset( $atts['form_background'] ) || isset( $atts['form_padding'] ) || isset( $atts['form_font_size'] ) || isset( $atts['form_text_align'] ) || isset( $atts['form_width'] ) || isset( $atts['placeholder_color'] ) || isset( $atts['placeholder_font_weight'] ) || isset( $atts['placeholder_letter_spacing'] ) || isset( $atts['placeholder_text_transform'] ) || isset( $atts['text_color'] ) || isset( $atts['link_color'] ) || isset( $atts['submit_color'] ) || isset( $atts['submit_background'] ) || isset( $atts['submit_border'] ) || isset( $atts['submit_border_radius'] ) || isset( $atts['submit_padding'] ) || isset( $atts['submit_width'] ) || isset( $atts['submit_font_size'] ) || isset( $atts['submit_font_weight'] ) || isset( $atts['submit_letter_spacing'] ) || isset( $atts['submit_height'] ) || isset( $atts['reset_color'] ) || isset( $atts['reset_background'] ) || isset( $atts['reset_border'] ) || isset( $atts['reset_border_radius'] ) || isset( $atts['reset_padding'] ) || isset( $atts['reset_width'] ) || isset( $atts['reset_font_size'] ) || isset( $atts['reset_height'] ) || isset( $atts['error_color'] ) || isset( $atts['error_background'] ) || isset( $atts['error_border'] ) || isset( $atts['success_color'] ) || isset( $atts['success_background'] ) || isset( $atts['success_border'] ) || isset( $atts['acceptance_color'] ) || isset( $atts['acceptance_line_height'] ) || isset( $atts['acceptance_text_align'] ) || isset( $atts['acceptance_letter_spacing'] ) || isset( $atts['acceptance_font_size'] ) || isset( $atts['checkbox_border'] ) || isset( $atts['checkbox_border_width'] ) || isset( $atts['checkbox_background'] ) || isset( $atts['loader_background'] ) || isset( $atts['loader_color'] ) ) {
			ob_start();

			?><style><?php

			/* Form background_color */
			if( isset( $atts['form_background'] ) && "" !== $atts['form_background'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> {	background-color: <?php echo $atts['form_background']; ?>; }
			<?php
			}

			/* Form background_color */
			if( isset( $atts['form_padding'] ) && "" !== $atts['form_padding'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> {	padding: <?php echo $atts['form_padding']; ?>; }
			<?php
			}

			/* Form width */
			if( isset( $atts['form_width'] ) && "" !== $atts['form_width'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> {	max-width: <?php echo $atts['form_width']; ?>; }
			<?php
			}

			/* Form width */
			if( isset( $atts['form_font_size'] ) && "" !== $atts['form_font_size'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> {	font-size: <?php echo $atts['form_font_size']; ?>; }
			<?php
			}

			/* Form width */
			if( isset( $atts['form_text_align'] ) && "" !== $atts['form_text_align'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> {	text-align: <?php echo $atts['form_text_align']; ?>; }
			<?php
			}

			/* Input and textarea text color */
			if( isset( $atts['input_color'] ) && "" !== $atts['input_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { color: <?php echo $atts['input_color']; ?>;	}
			<?php
			}

			/* Input and textarea text color */
			if( isset( $atts['input_width'] ) && "" !== $atts['input_width'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { width: <?php echo $atts['input_width']; ?>;	}
			<?php
			}

			/* Input and textarea text color */
			if( isset( $atts['input_height'] ) && "" !== $atts['input_height'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { min-height: <?php echo $atts['input_height']; ?>;	}
			<?php
			}

			/* Input and textarea font size */
			if( isset( $atts['input_font_size'] ) && "" !== $atts['input_font_size'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { font-size: <?php echo $atts['input_font_size']; ?>;	}
			<?php
			}

			/* Input and textarea font size */
			if( isset( $atts['input_font_weight'] ) && "" !== $atts['input_font_weight'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { font-weight: <?php echo $atts['input_font_weight']; ?>;	}
			<?php
			}

			/* Input and textarea letter spacing */
			if( isset( $atts['input_letter_spacing'] ) && "" !== $atts['input_letter_spacing'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { letter-spacing: <?php echo $atts['input_letter_spacing']; ?>;	}
			<?php
			}

			/* Input and textarea font size */
			if( isset( $atts['input_padding'] ) && "" !== $atts['input_padding'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { padding: <?php echo $atts['input_padding']; ?>;	}
			<?php
			}

			/* Input and textarea background */
			if( isset( $atts['input_background'] ) && "" !== $atts['input_background'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { background-color: <?php echo $atts['input_background']; ?>; }
			<?php
			}

			/* Input and textarea border color */
			if( isset( $atts['input_border'] ) && "" !== $atts['input_border'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { border-color: <?php echo $atts['input_border']; ?>;	}
			<?php
			}

			/* Input and textarea border color */
			if( isset( $atts['input_border_width'] ) && "" !== $atts['input_border_width'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { border-width: <?php echo $atts['input_border_width']; ?>px;	}
			<?php
			}

			/* Input and textarea border color */
			if( isset( $atts['input_border_radius'] ) && "" !== $atts['input_border_radius'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea { border-radius: <?php echo $atts['input_border_radius']; ?>;	}
			<?php
			}

			/* Input and textarea required text color */
			if( isset( $atts['input_required_color'] ) && "" !== $atts['input_required_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[aria-required=true], .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea[aria-required=true] { color: <?php echo $atts['input_required_color']; ?>;	}
			<?php
			}

			/* Input and textarea required background */
			if( isset( $atts['input_required_background'] ) && "" !== $atts['input_required_background'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[aria-required=true], .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea[aria-required=true] { background-color: <?php echo $atts['input_required_background']; ?>; }
			<?php
			}

			/* Input and textarea required border color */
			if( isset( $atts['input_required_border'] ) && "" !== $atts['input_required_border'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[aria-required=true], .wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea[aria-required=true] { border-color: <?php echo $atts['input_required_border']; ?>;	}
			<?php
			}

			/* Form text color */
			if( isset( $atts['text_color'] ) && "" !== $atts['text_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> {	color: <?php echo $atts['text_color']; ?>; }
			<?php
			}

			/* Form links color */
			if( isset( $atts['link_color'] ) && "" !== $atts['link_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> a {	color: <?php echo $atts['link_color']; ?>; }
			<?php
			}

			/* Placeholder color */
			if( isset( $atts['placeholder_color'] ) && "" !== $atts['placeholder_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::-webkit-input-placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::-moz-placeholder {	color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input:-ms-input-placeholder {	color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::-webkit-input-placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::-moz-placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea:-ms-input-placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::placeholder { color: <?php echo $atts['placeholder_color']; ?>;	}
			<?php
			}

			/* Placeholder font weight */
			if( isset( $atts['placeholder_font_weight'] ) && "" !== $atts['placeholder_font_weight'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::-webkit-input-placeholder { font-weight: <?php echo $atts['placeholder_font_weight']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::-moz-placeholder {	font-weight: <?php echo $atts['placeholder_font_weight']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input:-ms-input-placeholder {	font-weight: <?php echo $atts['placeholder_font_weight']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::placeholder { font-weight: <?php echo $atts['placeholder_font_weight']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::-webkit-input-placeholder { font-weight: <?php echo $atts['placeholder_font_weight']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::-moz-placeholder { font-weight: <?php echo $atts['placeholder_font_weight']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea:-ms-input-placeholder { font-weight: <?php echo $atts['placeholder_font_weight']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::placeholder { font-weight: <?php echo $atts['placeholder_font_weight']; ?>;	}
			<?php
			}

			/* Placeholder letter spacing */
			if( isset( $atts['placeholder_letter_spacing'] ) && "" !== $atts['placeholder_letter_spacing'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::-webkit-input-placeholder { letter-spacing: <?php echo $atts['placeholder_letter_spacing']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::-moz-placeholder {	letter-spacing: <?php echo $atts['placeholder_letter_spacing']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input:-ms-input-placeholder {	letter-spacing: <?php echo $atts['placeholder_letter_spacing']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::placeholder { letter-spacing: <?php echo $atts['placeholder_letter_spacing']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::-webkit-input-placeholder { letter-spacing: <?php echo $atts['placeholder_letter_spacing']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::-moz-placeholder { letter-spacing: <?php echo $atts['placeholder_letter_spacing']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea:-ms-input-placeholder { letter-spacing: <?php echo $atts['placeholder_letter_spacing']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::placeholder { letter-spacing: <?php echo $atts['placeholder_letter_spacing']; ?>;	}
			<?php
			}

			/* Placeholder text transform */
			if( isset( $atts['placeholder_text_transform'] ) && "" !== $atts['placeholder_text_transform'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::-webkit-input-placeholder { text-transform: <?php echo $atts['placeholder_text_transform']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::-moz-placeholder {	text-transform: <?php echo $atts['placeholder_text_transform']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input:-ms-input-placeholder {	text-transform: <?php echo $atts['placeholder_text_transform']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input::placeholder { text-transform: <?php echo $atts['placeholder_text_transform']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::-webkit-input-placeholder { text-transform: <?php echo $atts['placeholder_text_transform']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::-moz-placeholder { text-transform: <?php echo $atts['placeholder_text_transform']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea:-ms-input-placeholder { text-transform: <?php echo $atts['placeholder_text_transform']; ?>; }
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> textarea::placeholder { text-transform: <?php echo $atts['placeholder_text_transform']; ?>;	}
			<?php
			}

			/* Submit text color */
			if( isset( $atts['submit_color'] ) && "" !== $atts['submit_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { color: <?php echo $atts['submit_color']; ?>; }
			<?php
			}

			/* Submit background color */
			if( isset( $atts['submit_background'] ) && "" !== $atts['submit_background'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { background-color: <?php echo $atts['submit_background']; ?>; }
			<?php
			}

			/* Submit border color */
			if( isset( $atts['submit_border'] ) && "" !== $atts['submit_border'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { border-color: <?php echo $atts['submit_border']; ?>; }
			<?php
			}

			/* Submit border radius */
			if( isset( $atts['submit_border_radius'] ) && "" !== $atts['submit_border_radius'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { border-radius: <?php echo $atts['submit_border_radius']; ?>;	}
			<?php
			}

			/* Submit width */
			if( isset( $atts['submit_width'] ) && "" !== $atts['submit_width']  ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { width: <?php echo $atts['submit_width']; ?>; }
			<?php
			}

			/* Submit height */
			if( isset( $atts['submit_height'] ) && "" !== $atts['submit_height'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { height: <?php echo $atts['submit_height']; ?>; }
			<?php
			}

			/* Submit font size */
			if( isset( $atts['submit_font_size'] ) && "" !== $atts['submit_font_size'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { font-size: <?php echo $atts['submit_font_size']; ?>; }
			<?php
			}

			/* Submit font weight */
			if( isset( $atts['submit_font_weight'] ) && "" !== $atts['submit_font_weight'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { font-weight: <?php echo $atts['submit_font_weight']; ?>; }
			<?php
			}

			/* Submit letter spacing */
			if( isset( $atts['submit_letter_spacing'] ) && "" !== $atts['submit_letter_spacing'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { letter-spacing: <?php echo $atts['submit_letter_spacing']; ?>; }
			<?php
			}

			/* Submit padding */
			if( isset( $atts['submit_padding'] ) && "" !== $atts['submit_padding'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="submit"] { padding: <?php echo $atts['submit_padding']; ?>; }
			<?php
			}

			/* reset text color */
			if( isset( $atts['reset_color'] ) && "" !== $atts['reset_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { color: <?php echo $atts['reset_color']; ?>; }
			<?php
			}

			/* reset background color */
			if( isset( $atts['reset_background'] ) && "" !== $atts['reset_background'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { background-color: <?php echo $atts['reset_background']; ?>; }
			<?php
			}

			/* reset border color */
			if( isset( $atts['reset_border'] ) && "" !== $atts['reset_border'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { border-color: <?php echo $atts['reset_border']; ?>; }
			<?php
			}

			/* reset border radius */
			if( isset( $atts['reset_border_radius'] ) && "" !== $atts['reset_border_radius'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { border-radius: <?php echo $atts['reset_border_radius']; ?>;	}
			<?php
			}

			/* reset width */
			if( isset( $atts['reset_width'] ) && "" !== $atts['reset_width']  ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { width: <?php echo $atts['reset_width']; ?>; }
			<?php
			}

			/* reset height */
			if( isset( $atts['reset_height'] ) && "" !== $atts['reset_height'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { height: <?php echo $atts['reset_height']; ?>; }
			<?php
			}

			/* reset font size */
			if( isset( $atts['reset_font_size'] ) && "" !== $atts['reset_font_size'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { font-size: <?php echo $atts['reset_font_size']; ?>; }
			<?php
			}

			/* Reset font weight */
			if( isset( $atts['reset_font_weight'] ) && "" !== $atts['reset_font_weight'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { font-weight: <?php echo $atts['reset_font_weight']; ?>; }
			<?php
			}

			/* Reset letter spacing */
			if( isset( $atts['reset_letter_spacing'] ) && "" !== $atts['reset_letter_spacing'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { letter-spacing: <?php echo $atts['reset_letter_spacing']; ?>; }
			<?php
			}

			/* reset padding */
			if( isset( $atts['reset_padding'] ) && "" !== $atts['reset_padding'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> input[type="reset"] { padding: <?php echo $atts['reset_padding']; ?>; }
			<?php
			}

			/* Error color */
			if( isset( $atts['error_color'] ) && "" !== $atts['error_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-validation-errors, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-acceptance-missing { color:<?php echo $atts['error_color']; ?>; }
			<?php
			}
			
			/* Error background */
			if( isset( $atts['error_background'] ) && "" !== $atts['error_background'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-validation-errors, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-acceptance-missing { background-color:<?php echo $atts['error_background']; ?>; }
			<?php
			}

			/* Error border */
			if( isset( $atts['error_border'] ) && "" !== $atts['error_border'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-validation-errors, .wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-acceptance-missing { border-color:<?php echo $atts['error_border']; ?>; }
			<?php
			}

			/* Success color */
			if( isset( $atts['success_color'] ) && "" !== $atts['success_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-mail-sent-ok { color:<?php echo $atts['success_color']; ?>; }
			<?php
			}
			
			/* Success background */
			if( isset( $atts['success_background'] ) && "" !== $atts['success_background'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-mail-sent-ok { background-color:<?php echo $atts['success_background']; ?>; }
			<?php
			}

			/* Success border */
			if( isset( $atts['success_border'] ) && "" !== $atts['success_border'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> div.wpcf7-mail-sent-ok { border-color:<?php echo $atts['success_border']; ?>; }
			<?php
			}

			/* Acceptance text color */
			if( isset( $atts['acceptance_color'] ) && "" !== $atts['acceptance_color'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> .wpcf7-acceptance .wpcf7-list-item-label { color:<?php echo $atts['acceptance_color']; ?>; }
			<?php
			}

			/* Acceptance text font size */
			if( isset( $atts['acceptance_font_size'] ) && "" !== $atts['acceptance_font_size'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> .wpcf7-acceptance .wpcf7-list-item-label { font-size:<?php echo $atts['acceptance_font_size']; ?>; }
			<?php
			}

			/* Acceptance text font size */
			if( isset( $atts['acceptance_letter_spacing'] ) && "" !== $atts['acceptance_letter_spacing'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> .wpcf7-acceptance .wpcf7-list-item-label { letter-spacing:<?php echo $atts['acceptance_letter_spacing']; ?>; }
			<?php
			}

			/* Acceptance text font size */
			if( isset( $atts['acceptance_line_height'] ) && "" !== $atts['acceptance_line_height'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> .wpcf7-acceptance .wpcf7-list-item { line-height:<?php echo $atts['acceptance_line_height']; ?>; }
			<?php
			}

			/* Acceptance text align */
			if( isset( $atts['acceptance_text_align'] ) && "" !== $atts['acceptance_text_align'] ) {
			?>
			.wpcf7 .wpcf7-form.<?php echo $cclass; ?> .wpcf7-acceptance .wpcf7-list-item { text-align:<?php echo $atts['acceptance_text_align']; ?>; }
			<?php
			}

			/* Checkbox border color */
			if( isset( $atts['checkbox_border'] ) && "" !== $atts['checkbox_border'] ) {
			?>
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox.<?php echo $cclass; ?> .rex-checkbox__indicator{outline-color:<?php echo $atts['checkbox_border']; ?>;}
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox.<?php echo $cclass; ?> .rex-checkbox__indicator:after{border-color:<?php echo $atts['checkbox_border']; ?>;}
			<?php
			}

			/* Checkbox border color */
			if( isset( $atts['checkbox_border_width'] ) && "" !== $atts['checkbox_border_width'] ) {
			?>
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox.<?php echo $cclass; ?> .rex-checkbox__indicator{outline-width:<?php echo $atts['checkbox_border_width']; ?>px;}
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox.<?php echo $cclass; ?> .rex-checkbox__indicator:after{border-width:0 <?php echo $atts['checkbox_border_width']; ?>px <?php echo $atts['checkbox_border_width']; ?>px 0;}
			<?php
			}
			
			/* Checkbox background color */
			if( isset( $atts['checkbox_background'] ) && "" !== $atts['checkbox_background'] ) {
			?>
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox.<?php echo $cclass; ?> .rex-checkbox__indicator{background-color:<?php echo $atts['checkbox_background']; ?>;}
			<?php
			}

			/* Loader background color */
			if( isset( $atts['loader_background'] ) && "" !== $atts['loader_background'] ) {
			?>
			div.wpcf7 .rxcf7-custom-loader .ajax-loader{background-color:<?php echo $atts['loader_background']; ?>;}
			<?php
			}

			/* Loader color */
			if( isset( $atts['loader_color'] ) && "" !== $atts['loader_color'] ) {
			?>
			.rxcf7-custom-loader.<?php echo $cclass; ?> .sk-double-bounce .sk-child{background-color:<?php echo $atts['loader_color']; ?>;}
			<?php
			}

			?></style><?php

			$cstyle = ob_get_clean();

			$out['html_class'] .= ' rxcf7-custom-style ' . $cclass;
		}

		echo trim( $cstyle );

		return $out;
	}
}
