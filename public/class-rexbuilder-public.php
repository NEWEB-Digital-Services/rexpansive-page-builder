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

            if (!is_404()) { // TODO
                // if( Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo', $post->post_content ) > 0 || Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo_slide', $post->post_content ) > 0 ) {
                wp_enqueue_script('vimeo-player', 'https://player.vimeo.com/api/player.js', array('jquery'), '20120206', true);
                // }
            }

            $cartella = "public/";
            $cartella_admin = "admin/";

            wp_enqueue_style('material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), null, 'all');

            wp_enqueue_style('photoswipe-skin', REXPANSIVE_BUILDER_URL . $cartella . 'Photoswipe/default-skin/default-skin.css', array(), null, 'all');

            wp_enqueue_style('jquery.mb.YTPlayer-style', REXPANSIVE_BUILDER_URL . $cartella . 'jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css', array(), null, 'all');

            wp_enqueue_style('rex-custom-fonts', REXPANSIVE_BUILDER_URL . $cartella_admin . 'rexpansive-font/font.css', array(), null, 'all');

            wp_enqueue_style('font-awesome', REXPANSIVE_BUILDER_URL . $cartella_admin . 'font-awesome-4.3.0/css/font-awesome.min.css', array(), null, 'all');

            wp_enqueue_style('overlay-scrollbar-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/OverlayScrollbars.min.css', array(), null, 'all');

            wp_enqueue_style('animate-css', REXPANSIVE_BUILDER_URL . $cartella . 'css/animate.css', array(), null, 'all');
            wp_enqueue_style('textfill-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/textFill.css', array(), null, 'all');
            wp_enqueue_style('rexbuilder-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/builder.css', array(), null, 'all');
            wp_enqueue_style('materialize', REXPANSIVE_BUILDER_URL . $cartella . 'css/materialize.min.css', array(), null, 'all');
            wp_enqueue_style('custom-editor-buttons-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/rex-custom-editor-buttons.css', array(), null, 'all');

            wp_enqueue_style('jquery-ui-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/jquery-ui.min.css', array(), null, 'all');
            wp_enqueue_style('gridstack-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/gridstack.css', array(), null, 'all');

            wp_enqueue_style('spectrum-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/spectrum.css', array(), null, 'all');

            wp_enqueue_style('medium-editor-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/medium-editor.css', array(), null, 'all');
            //wp_enqueue_style( 'medium-editor-instert-style', REXPANSIVE_BUILDER_URL  . $cartella. 'css/medium-editor-insert-plugin.min.css', array(), null, 'all' );
            wp_enqueue_style('medium-editor-insert-frontend-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/medium-editor-insert-plugin-frontend.min.css', array(), null, 'all');
            //TODO ci penseremo dopo
            //wp_enqueue_style( 'medium-editor-tables-style.css', REXPANSIVE_BUILDER_URL  . $cartella. 'css/medium-editor-tables.min.css', array(), null, 'all' );
            //che è sta roba? editor di testo?
            wp_enqueue_style('input-spinner', REXPANSIVE_BUILDER_URL . $cartella . 'css/input-spinner.css', array(), null, 'all');

            wp_enqueue_style('rexpansive-admin-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/admin.css', array(), null, 'all');
            wp_enqueue_style('rexpansive-builder-style', REXPANSIVE_BUILDER_URL . $cartella . 'css/public.css', array(), null, 'all');

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

            wp_enqueue_style('photoswipe-skin', REXPANSIVE_BUILDER_URL . 'public/Photoswipe/default-skin/default-skin.css', array(), null, 'all');

            wp_enqueue_style('jquery.mb.YTPlayer-style', REXPANSIVE_BUILDER_URL . 'public/jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css', array(), null, 'all');

            wp_enqueue_style('rexpansive-builder-style', REXPANSIVE_BUILDER_URL . 'public/css/public.css', array(), null, 'all');
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

            $cartella = "public/";
            //include media libray
            wp_enqueue_media();

            wp_enqueue_script('tmpl', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/tmpl.min.js', array('jquery'), null, true);

            wp_enqueue_script('photoswipe', REXPANSIVE_BUILDER_URL . $cartella . 'Photoswipe/photoswipe.min.js', array('jquery'), null, true);
            wp_enqueue_script('photoswipe-ui', REXPANSIVE_BUILDER_URL . $cartella . 'Photoswipe/photoswipe-ui-default.min.js', array('jquery'), null, true);

            wp_enqueue_script('YTPlayer', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.mb.YTPlayer.min.js', array('jquery'), null, true);

            wp_enqueue_script('ace-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/ace.js', array('jquery'), null, true);
            wp_enqueue_script('ace-mode-css-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/mode-css.js', array('jquery'), null, true);

            wp_enqueue_script('storeVariables', REXPANSIVE_BUILDER_URL . $cartella . 'js/store.legacy.min.js', array('jquery'), null, true);

            wp_enqueue_script('1-RexUtil', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/1-Rexbuilder_Util.js', array('jquery'), null, true);
            wp_enqueue_script('1-RexUtilEditor', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/1-Rexbuilder_Util_Editor.js', array('jquery'), null, true);
            wp_enqueue_script('1-RexCreateBlocks', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/1-Rexbuilder_CreateBlocks.js', array('jquery'), null, true);
            wp_enqueue_script('1-RexDomUtil', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/1-Rexbuilder_Dom_Util.js', array('jquery'), null, true);
            wp_enqueue_script('2-RexSaveListeners', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/2-Rex_Save_Listeners.js', array('jquery'), null, true);
            wp_enqueue_script('3-Navigator', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/3-Navigator.js', array('jquery'), null, true);
            wp_enqueue_script('5-flickity', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/flickity.pkgd.min.js', array('jquery'), null, true);
            wp_enqueue_script('2-RexSlider', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/2-RexSlider.js', array('jquery'), null, true);
            wp_enqueue_script('8-VimeoVideo', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/8-VimeoVideo.js', array('jquery'), null, true);
            //wp_enqueue_script( 'textfill', REXPANSIVE_BUILDER_URL  . $cartella. 'js/__jquery.textFill.js', array( 'jquery' ), null, true );
            //wp_enqueue_script( 'text-resize', REXPANSIVE_BUILDER_URL  . $cartella. 'js/__TextResize.js', array( 'jquery' ), null, true );

            //gridstack
            wp_enqueue_script('jquery-ui', REXPANSIVE_BUILDER_URL . $cartella . 'js/jquery-ui.min.js', array('jquery'), null, true);
            wp_enqueue_script('touchPunch', REXPANSIVE_BUILDER_URL . $cartella . 'js/jquery.ui.touch-punch.js', array('jquery'), null, true);
            wp_enqueue_script('lodash', REXPANSIVE_BUILDER_URL . $cartella . 'js/lodash.js', array('jquery'), null, true);
            wp_enqueue_script('gridstack', REXPANSIVE_BUILDER_URL . $cartella . 'js/gridstack.js', array('jquery'), null, true);
            wp_enqueue_script('gridstackUI', REXPANSIVE_BUILDER_URL . $cartella . 'js/gridstack.jQueryUI.js', array('jquery'), null, true);
            //
            wp_enqueue_script('scrolled', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/4-jquery.rexScrolled.js', array('jquery'), null, true);
            wp_enqueue_script('indicator', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/5-jquery.rexIndicator.js', array('jquery'), null, true);

            //editor text
            wp_enqueue_script('spectrumColor', REXPANSIVE_BUILDER_URL . $cartella . 'js/spectrum.js', array('jquery'), null, true);
            wp_enqueue_script('medium-editor', REXPANSIVE_BUILDER_URL . $cartella . 'js/medium-editor.js', array('jquery'), null, true);
            wp_enqueue_script('mediumEditorToolbarStates', REXPANSIVE_BUILDER_URL . $cartella . 'js/medium-editor-toolbar-states.min.js', array('jquery'), null, true);

            wp_enqueue_script('handlebars-runtime', REXPANSIVE_BUILDER_URL . $cartella . 'js/handlebars.runtime.js', array('jquery'), null, true);
            wp_enqueue_script('jquery-fileupload', REXPANSIVE_BUILDER_URL . $cartella . 'js/jquery.fileupload.js', array('jquery'), null, true);
            wp_enqueue_script('jquery-cycle2', REXPANSIVE_BUILDER_URL . $cartella . 'js/jquery.cycle2.min.js', array('jquery'), null, true);
            wp_enqueue_script('cycle2-center', REXPANSIVE_BUILDER_URL . $cartella . 'js/jquery.cycle2.center.min.js', array('jquery'), null, true);
            wp_enqueue_script('medium-editor-insert', REXPANSIVE_BUILDER_URL . $cartella . 'js/medium-editor-insert-plugin.min.js', array('jquery'), null, true);
            //wp_enqueue_script( 'medium-editor-tables', REXPANSIVE_BUILDER_URL  . $cartella. 'js/medium-editor-tables.min.js', array( 'jquery' ), null, true );
            //wp_enqueue_script( 'medium-editor-insert-tables', REXPANSIVE_BUILDER_URL  . $cartella. 'js/medium-editor-insert-tables.js', array( 'jquery' ), null, true );

            wp_enqueue_script('utilities', REXPANSIVE_BUILDER_URL . $cartella . 'js/utilities.js', array('jquery'), null, true);

            wp_enqueue_script('overlay-scrollbar', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/jquery.overlayScrollbars.min.js', array('jquery'), null, true);

            wp_enqueue_script('2-jqueryEditor', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/2-jquery.perfectGridGalleryEditor.js', array('jquery'), null, true);

            wp_enqueue_script('3-velocity', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/3-velocity.min.js', array('jquery'), null, true);
            wp_enqueue_script('3-velocityui', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/3-velocity.ui.min.js', array('jquery'), null, true);
            wp_enqueue_script('4-jqueryScrollify', REXPANSIVE_BUILDER_URL . $cartella . 'js/vendor/4-jquery.rexScrollify.js', array('jquery'), null, true);

            wp_enqueue_script('section-js', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/1-Rexbuilder_Section.js', array('jquery'), null, true);
            wp_enqueue_script('block-js', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/1-Rexbuilder_Block.js', array('jquery'), null, true);

            wp_enqueue_script('rexbuilder', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/rexbuilder-public.js', array('jquery'), null, true);

            wp_enqueue_script('4-modals', REXPANSIVE_BUILDER_URL . $cartella . 'js/build/4-modals.js', array('jquery'), null, true);

            wp_localize_script('rexbuilder', '_plugin_frontend_settings', apply_filters('rexbuilder_js_settings', array(
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
            )
            ));

        }
    }

    /**
     * Register the stylesheets for the public-facing side of the site for production
     *
     * @since    1.0.0
     */
    public function enqueue_scripts_production()
    {

        $message = "right answer";
        echo "<script type='text/javascript'>alert('$message');</script>";
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
            wp_enqueue_script('jquery');
            wp_enqueue_script('public-plugins', REXPANSIVE_BUILDER_URL . 'public/js/plugins.js', array('jquery'), null, true);
            wp_localize_script('public-plugins', '_plugin_frontend_settings', apply_filters('rexbuilder_js_settings', array(
                'animations' => apply_filters('rexbuilder_animation_enabled', $this->plugin_options['animation']),
                'textFill' => array(
                    'font_family' => 'sans-serif',
                    'font_weight' => 'bold',
                ),
                'native_scroll_animation' => true,
            )));
            wp_enqueue_script('rexbuilder-public', REXPANSIVE_BUILDER_URL . 'public/js/public.js', array('jquery'), null, true);
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
        include_once REXPANSIVE_BUILDER_PATH . "public/partials/rexbuilder-js-templates.php";
    }
    /**
     * Create the variuos modal editors of the builder.
     *
     * @since    1.0.0
     */
    public function create_builder_modals()
    {

        //$page_info = get_current_screen();

        if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) {
            return;
        }
        if (!isset($this->plugin_options['post_types'])) {
            return;
        }

        include_once 'partials/rexbuilder-modals-display.php';

        ?>
			<div id="id-post" data-post-id="<?php echo esc_attr(get_the_ID()); ?>"></div>
		<?php

/*
if ( get_user_option('rich_editing') == 'true') {
$post_to_activate = $this->plugin_options['post_types'];
if( isset( $post_to_activate[$page_info->id] ) ) :
if( ( $post_to_activate[$page_info->id] == 1 ) &&
( $post_to_activate[$page_info->post_type] == 1 ) ) :

endif;
endif;
} */
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
        $avaiable_layouts = $_POST['avaiable_layouts'];

        update_post_meta($post_id_to_update, '_rex_responsive_layouts_names', $names);
        // update_post_meta($post_id_to_update, '_rex_responsive_layouts', $avaiable_layouts);

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

        update_post_meta($post_id_to_update, '_rex_customization_' . $layout_name, $layout);

        $response['id_recived'] = $post_id_to_update;

        wp_send_json_success($response);
    }

    /**
     * Saving custom layouts
     *
     * @return JSON
     */
    public function rexlive_save_custom_layouts()
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

        if (!isset($_POST['custom_layouts'])) {
            $response['error'] = true;
            $response['msg'] = 'Data error!';
            wp_send_json_error($response);
        }

        $response['error'] = false;

        $post_id_to_update = intval($_POST['post_id_to_update']);
        update_post_meta($post_id_to_update, '_rex_responsive_layouts', $_POST['custom_layouts']);

        wp_send_json_success($response);
    }

    /**
     *    Ajax call to save sections status
     *
     *    @since 1.0.15
     */
    public function rexlive_save_default_layout()
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

        $update = wp_update_post($args);

        update_post_meta($post_id_to_update, '_rex_default_layout', $shortcode);

        $response['update'] = $update;
        $response['id_recived'] = $post_id_to_update;

        wp_send_json_success($response);
    }

    public function generate_builder_content($content)
    {
        global $post;
        $editor = $_GET['editor'];

        $defaultPage = get_post_meta($post->ID, '_rex_default_layout', true);

        if ($defaultPage == "") {
            $defaultPage = get_post_meta($post->ID, '_rex_content_mydesktop', true);
        }

        $customizations_array = array();
        $customizations_names = get_post_meta($post->ID, '_rex_responsive_layouts_names', true);
        $customization = array();

        if (!empty($customizations_names)) {
            foreach ($customizations_names as $name) {
                $customization["name"] = $name;
                $customization["sections"] = get_post_meta($post->ID, '_rex_customization_' . $name, true);
                array_push($customizations_array, $customization);
            }
        }
        //$customizations = get_post_meta($post->ID, '_rex_customization', true);

        $layoutsAvaiable = get_post_meta($post->ID, '_rex_responsive_layouts', true);

        if ($layoutsAvaiable == null) {
            $layoutsAvaiable = array(array("default", "", ""));
        }

        ?>
        <div id="rexbuilder-layout-data" style="display: none;">
            <div class = "layouts-customizations"
            <?php
if (empty($customizations_array)) {
            echo 'data-empty-customizations="true">';
        } else {
            ?>
            >
            <?php
echo json_encode($customizations_array);
        }
        ?>
            </div>
            <div class = "available-layouts">
                <?php
echo json_encode($layoutsAvaiable);
        ?>
            </div>
            <div class = "available-layouts-names">
                <?php
echo json_encode($customizations_names);
        ?>
            </div>
        </div>
        <?php
if ($editor == "true") {
            ?>
        <button id="rex-open-ace-css-editor" class="btn-floating tooltipped" data-position="bottom" data-tooltip="<?php _e('CSS Editor', $this->plugin_name);?>">
            <i class="material-icons">&#xE314;</i><span>CSS</span><i class="material-icons">&#xE315;</i>
        </button>
        <textarea style="display:none;" name="_rexbuilder_custom_css" id="_rexbuilder_custom_css">
<?php
$meta = get_post_meta($post->ID, '_rexbuilder_custom_css', true);
            if ('' !== ($meta)) {
                echo htmlspecialchars($meta);
            }
            ?>
        </textarea>
            <?php
}
        ?>
        <div class="rex-container" data-rex-layout-selected="">
		<?php
echo do_shortcode($defaultPage);
        ?>
	</div>
	<?php

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
                wp_add_inline_style('rexpansive-builder-style', $meta);
            endif;
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
                $content = get_post_meta($post->ID, '_rex_default_layout', true);
                $pattern = get_shortcode_regex();

                preg_match_all("/$pattern/", $content, $content_shortcodes);
                // Check for section titles; if no one has a title, don't display the navigation
                $titles = array();
                foreach ($content_shortcodes[3] as $attrs):
                    $x = shortcode_parse_atts(trim($attrs));
                    if (isset($x['section_name']) && $x['section_name'] != ''):
                        $titles[] = $x['section_name'];
                    endif;
                endforeach;

                var_dump('peter');
                var_dump($titles);

                if (count($titles) > 0) {
                    include Rexbuilder_Utilities::get_plugin_templates_path('rexbuilder-' . $nav . '-template.php');
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
     * - text_color
     * - link_color
     * - input_color
     * - input_background
     * - input_border
     * - input_border_width
     * - input_border_radius
     * - placeholder_color
     * - submit_color
     * - submit_background
     * - submit_border
     * - submit_width
     * - submit_height
     * - error_color
     * - error_background
     * - error_border
     * - success_color
     * - success_background
     * - success_border
     * - acceptance_color
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
    public function cf7_custom_style($out, $pairs, $atts, $shortcode)
    {
        $cstyle = '';

        if (isset($atts['input_color']) || isset($atts['input_border']) || isset($atts['input_border_width']) || isset($atts['input_border_radius']) || isset($atts['input_background']) || isset($atts['form_background']) || isset($atts['form_padding']) || isset($atts['placeholder_color']) || isset($atts['text_color']) || isset($atts['link_color']) || isset($atts['submit_color']) || isset($atts['submit_background']) || isset($atts['submit_border']) || isset($atts['submit_width']) || isset($atts['submit_height']) || isset($atts['error_color']) || isset($atts['error_background']) || isset($atts['error_border']) || isset($atts['success_color']) || isset($atts['success_background']) || isset($atts['success_border']) || isset($atts['acceptance_color']) || isset($atts['checkbox_border']) || isset($atts['checkbox_border_width']) || isset($atts['checkbox_background']) || isset($atts['loader_background']) || isset($atts['loader_color'])) {
            ob_start();

            ?><style><?php

            /* Input and textarea text color */
            if (isset($atts['input_color'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input, .wpcf7 .wpcf7-form.rxcf7-custom-style textarea { color: <?php echo $atts['input_color']; ?>;	}
			<?php
}

            /* Input and textarea background */
            if (isset($atts['input_background'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input, .wpcf7 .wpcf7-form.rxcf7-custom-style textarea { background-color: <?php echo $atts['input_background']; ?>; }
			<?php
}

            /* Input and textarea border color */
            if (isset($atts['input_border'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input, .wpcf7 .wpcf7-form.rxcf7-custom-style textarea { border-color: <?php echo $atts['input_border']; ?>;	}
			<?php
}

            /* Input and textarea border color */
            if (isset($atts['input_border_width'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input, .wpcf7 .wpcf7-form.rxcf7-custom-style textarea { border-width: <?php echo $atts['input_border_width']; ?>px;	}
			<?php
}

            /* Input and textarea border color */
            if (isset($atts['input_border_radius'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input, .wpcf7 .wpcf7-form.rxcf7-custom-style textarea { border-radius: <?php echo $atts['input_border_radius']; ?>;	}
			<?php
}

            /* Form text color */
            if (isset($atts['text_color'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style {	color: <?php echo $atts['text_color']; ?>; }
			<?php
}

            /* Form links color */
            if (isset($atts['link_color'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style a {	color: <?php echo $atts['link_color']; ?>; }
			<?php
}

            /* Form background_color */
            if (isset($atts['form_background'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style {	background-color: <?php echo $atts['form_background']; ?>; }
			<?php
}

            /* Form background_color */
            if (isset($atts['form_padding'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style {	padding: <?php echo $atts['form_padding']; ?>; }
			<?php
}

            /* Form text color */
            if (isset($atts['placeholder_color'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input::-webkit-input-placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.rxcf7-custom-style input::-moz-placeholder {	color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.rxcf7-custom-style input:-ms-input-placeholder {	color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.rxcf7-custom-style input::placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.rxcf7-custom-style textarea::-webkit-input-placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.rxcf7-custom-style textarea::-moz-placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.rxcf7-custom-style textarea:-ms-input-placeholder { color: <?php echo $atts['placeholder_color']; ?>; }
			.wpcf7 .wpcf7-form.rxcf7-custom-style textarea::placeholder { color: <?php echo $atts['placeholder_color']; ?>;	}
			<?php
}

            /* Submit text color */
            if (isset($atts['submit_color'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input[type="submit"] { color: <?php echo $atts['submit_color']; ?>; }
			<?php
}

            /* Submit background color */
            if (isset($atts['submit_background'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input[type="submit"] { background-color: <?php echo $atts['submit_background']; ?>; }
			<?php
}

            /* Submit border color */
            if (isset($atts['submit_border'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input[type="submit"] { border-color: <?php echo $atts['submit_border']; ?>; }
			<?php
}

            /* Submit width */
            if (isset($atts['submit_width'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input[type="submit"] { width: <?php echo $atts['submit_width']; ?>; }
			<?php
}

            /* Submit height */
            if (isset($atts['submit_height'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style input[type="submit"] { height: <?php echo $atts['submit_height']; ?>; }
			<?php
}

            /* Error color */
            if (isset($atts['error_color'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-validation-errors, .wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-acceptance-missing { color:<?php echo $atts['error_color']; ?>; }
			<?php
}

            /* Error background */
            if (isset($atts['error_background'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-validation-errors, .wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-acceptance-missing { background-color:<?php echo $atts['error_background']; ?>; }
			<?php
}

            /* Error border */
            if (isset($atts['error_border'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-validation-errors, .wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-acceptance-missing { border-color:<?php echo $atts['error_border']; ?>; }
			<?php
}

            /* Success color */
            if (isset($atts['success_color'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-mail-sent-ok { color:<?php echo $atts['success_color']; ?>; }
			<?php
}

            /* Success background */
            if (isset($atts['success_background'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-mail-sent-ok { background-color:<?php echo $atts['success_background']; ?>; }
			<?php
}

            /* Success border */
            if (isset($atts['success_border'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style div.wpcf7-mail-sent-ok { border-color:<?php echo $atts['success_border']; ?>; }
			<?php
}

            /* Acceptance text color */
            if (isset($atts['acceptance_color'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-style .wpcf7-acceptance .wpcf7-list-item-label { color:<?php echo $atts['acceptance_color']; ?>; }
			<?php
}

            /* Checkbox border color */
            if (isset($atts['checkbox_border'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox .rex-checkbox__indicator{outline-color:<?php echo $atts['checkbox_border']; ?>;}
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox .rex-checkbox__indicator:after{border-color:<?php echo $atts['checkbox_border']; ?>;}
			<?php
}

            /* Checkbox border color */
            if (isset($atts['checkbox_border_width'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox .rex-checkbox__indicator{outline-width:<?php echo $atts['checkbox_border_width']; ?>px;}
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox .rex-checkbox__indicator:after{border-width:0 <?php echo $atts['checkbox_border_width']; ?>px <?php echo $atts['checkbox_border_width']; ?>px 0;}
			<?php
}

            /* Checkbox background color */
            if (isset($atts['checkbox_background'])) {
                ?>
			.wpcf7 .wpcf7-form.rxcf7-custom-checkbox .rex-checkbox__indicator{background-color:<?php echo $atts['checkbox_background']; ?>;}
			<?php
}

            /* Loader background color */
            if (isset($atts['loader_background'])) {
                ?>
			div.wpcf7 .rxcf7-custom-loader .ajax-loader{background-color:<?php echo $atts['loader_background']; ?>;}
			<?php
}

            /* Loader color */
            if (isset($atts['loader_color'])) {
                ?>
			.rxcf7-custom-loader .sk-double-bounce .sk-child{background-color:<?php echo $atts['loader_color']; ?>;}
			<?php
}

            ?></style><?php

            $cstyle = ob_get_clean();
        }

        echo trim($cstyle);

        $out['html_class'] .= ' rxcf7-custom-style';

        return $out;
    }
}
