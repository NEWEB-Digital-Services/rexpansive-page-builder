<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 * @author     Neweb <info@neweb.info>
 */
class Rexbuilder {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Rexbuilder_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	protected $plugin_public;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {

		$this->plugin_name = 'rexpansive-builder';
		$this->version = REXPANSIVE_BUILDER_VERSION;

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_shortcodes();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Rexbuilder_Loader. Orchestrates the hooks of the plugin.
	 * - Rexbuilder_i18n. Defines internationalization functionality.
	 * - Rexbuilder_Admin. Defines all hooks for the admin area.
	 * - Rexbuilder_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * Add TGMPA funcionallity to include external plugin
		 */
		require_once REXPANSIVE_BUILDER_PATH . 'admin/required-plugins/plugins.php';

		/**
		 * Pack ACF inside the plugin
		 */
		require_once REXPANSIVE_BUILDER_PATH . 'admin/lib/acf/rexbuilder-include-acf.php';

		/**
		 * The class that helds some usefull utilties
		 */
		require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-utilities.php';

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once REXPANSIVE_BUILDER_PATH . 'admin/class-rexbuilder-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once REXPANSIVE_BUILDER_PATH . 'public/class-rexbuilder-public.php';

		/**
		 * The classes responsible for defining all the shortcodes.
		 */
		require_once REXPANSIVE_BUILDER_PATH . 'shortcodes/class-rexbuilder-section-shortcode.php';
		require_once REXPANSIVE_BUILDER_PATH . 'shortcodes/class-rexbuilder-block-shortcode.php';
		require_once REXPANSIVE_BUILDER_PATH . 'shortcodes/class-rexbuilder-textfill-shortcode.php';
		require_once REXPANSIVE_BUILDER_PATH . 'shortcodes/class-rexbuilder-rexslider-shortcode.php';
		require_once REXPANSIVE_BUILDER_PATH . 'shortcodes/class-rexbuilder-indicator-shortcode.php';
		require_once REXPANSIVE_BUILDER_PATH . 'shortcodes/class-rexbuilder-model-shortcode.php';
		require_once REXPANSIVE_BUILDER_PATH . 'shortcodes/class-rexbuilder-button-shortcode.php';
		require_once REXPANSIVE_BUILDER_PATH . 'shortcodes/class-rexbuilder-accordion-shortcode.php';

		$this->loader = new Rexbuilder_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Rexbuilder_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Rexbuilder_i18n();
		$plugin_i18n->set_domain( $this->get_plugin_name() );

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}
	
	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {
		
		$plugin_admin = new Rexbuilder_Admin( $this->get_plugin_name(), $this->get_version() );
		
		// Slider custom post type
		$this->loader->add_action( 'init', $plugin_admin, 'rexpansive_slider_definition' );
		$this->loader->add_action( 'init', $plugin_admin, 'rexpansive_models_defintion' );
		
		$this->loader->add_filter( 'manage_rex_slider_posts_columns', $plugin_admin, 'rexpansive_slider_columns_head_add_column' );
		$this->loader->add_filter( 'manage_rex_slider_posts_columns', $plugin_admin, 'rexpansive_slider_columns_reorder' );
		$this->loader->add_action( 'manage_rex_slider_posts_custom_column', $plugin_admin, 'rexpansive_slider_columns_content', 10, 2 );

		$this->loader->add_filter( 'preview_post_link', $plugin_admin, 'change_preview_url' );
		$this->loader->add_filter( 'post_row_actions', $plugin_admin, 'add_builderlive_link', 10, 2 );
		$this->loader->add_filter( 'page_row_actions', $plugin_admin, 'add_builderlive_link', 10, 2 );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles_production' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts_production' );

		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_plugin_options_menu' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'update_notifier_menu' );
		
		$this->loader->add_action( 'admin_bar_menu', $plugin_admin, 'add_top_bar_plugin_options_menu', 1000 );
		
		$plugin_basename = plugin_basename( plugin_dir_path( __DIR__ ) . $this->plugin_name . '.php' );
		$this->loader->add_filter( 'plugin_action_links_' . $plugin_basename, $plugin_admin, 'add_action_links' );
		
		$this->loader->add_action( 'admin_init', $plugin_admin, 'plugin_options_update' );
		
		// live builder		
		$this->loader->add_filter( 'content_save_pre', $plugin_admin, 'rex_fix_post_content' );
		
		if( isset( $_GET['rexlive'] ) && 'true' == $_GET['rexlive'] ) {
			$this->loader->add_action( 'admin_footer', $plugin_admin, 'include_sprites_live' );
			$this->loader->add_action( 'admin_footer', $plugin_admin, 'include_live_editing' );
			$this->loader->add_filter( 'admin_body_class', $plugin_admin, 'rexlive_body_fix' );
			$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'print_rex_buttons_style_backend' );
		}
		
		$this->loader->add_action( 'admin_footer', $plugin_admin, 'create_builder_modals' );
		$this->loader->add_action( 'admin_footer', $plugin_admin, 'create_builder_templates' );
		$this->loader->add_action( 'admin_footer', $plugin_admin, 'include_sprites' );
		
		$this->loader->add_action( 'admin_head', $plugin_admin, 'rexbuilder_add_custom_buttons' );
		
		$this->loader->add_action( 'edit_form_after_title', $plugin_admin, 'add_switch_under_post_title' );
		
		$this->loader->add_filter( 'upload_mimes', $plugin_admin, 'register_xml_json_mime_type' );
		$this->loader->add_action( 'upgrader_process_complete', $plugin_admin, 'import_models' );
		$this->loader->add_action( 'rexpansive_builder_after_contacts_settings', $plugin_admin, 'import_models' );
		
		$this->loader->add_filter( 'rexbuilder_admin_post_type_active', $plugin_admin, 'add_builder_assets_on_contact_form_page' );
		
		// Ajax functions
		$this->loader->add_action( 'wp_ajax_rex_edit_slider_from_builder', $plugin_admin, 'rex_edit_slider_from_builder' );
		$this->loader->add_action( 'wp_ajax_rex_create_slider_from_builder', $plugin_admin, 'rex_create_slider_from_builder' );
		$this->loader->add_action( 'wp_ajax_rex_create_rexslider_admin_markup', $plugin_admin, 'rex_create_rexslider_admin_markup' );
		$this->loader->add_action( 'wp_ajax_live_refresh_builder', $plugin_admin, 'live_refresh_builder' );
		
		$this->loader->add_action( 'wp_ajax_rex_create_model_from_builder', $plugin_admin, 'rex_create_model_from_builder' );
		$this->loader->add_action( 'wp_ajax_rex_save_model_customization', $plugin_admin, 'rex_save_model_customization' );
		$this->loader->add_action( 'wp_ajax_rex_save_model_customization_names', $plugin_admin, 'rex_save_model_customization_names' );
		$this->loader->add_action( 'wp_ajax_rex_get_model_live', $plugin_admin, 'rex_get_model_live' );
		$this->loader->add_action( 'wp_ajax_rex_save_custom_layouts', $plugin_admin, 'rex_save_custom_layouts' );
		$this->loader->add_action( 'wp_ajax_rex_get_model', $plugin_admin, 'rex_get_model' );
		$this->loader->add_action( 'wp_ajax_rex_get_model_list', $plugin_admin, 'rex_get_model_list' );
		$this->loader->add_action( 'wp_ajax_rex_update_buttons_ids', $plugin_admin, 'rex_update_buttons_ids' );
		$this->loader->add_action( 'wp_ajax_rex_update_button', $plugin_admin, 'rex_update_button' );

		// COLOR PALETTE APIs
		$this->loader->add_action( 'wp_ajax_rex_save_palette_color', $plugin_admin, 'rex_save_palette_color' );
		$this->loader->add_action( 'wp_ajax_rex_delete_palette_color', $plugin_admin, 'rex_delete_palette_color' );
		$this->loader->add_action( 'wp_ajax_rex_save_palette_overlay_color', $plugin_admin, 'rex_save_palette_overlay_color' );
		$this->loader->add_action( 'wp_ajax_rex_delete_palette_overlay_color', $plugin_admin, 'rex_delete_palette_overlay_color' );
		$this->loader->add_action( 'wp_ajax_rex_save_palette_gradient', $plugin_admin, 'rex_save_palette_gradient' );
		$this->loader->add_action( 'wp_ajax_rex_delete_palette_gradient', $plugin_admin, 'rex_delete_palette_gradient' );
		$this->loader->add_action( 'wp_ajax_rex_save_palette_overlay_gradient', $plugin_admin, 'rex_save_palette_overlay_gradient' );
		$this->loader->add_action( 'wp_ajax_rex_delete_palette_overlay_gradient', $plugin_admin, 'rex_delete_palette_overlay_gradient' );

		$this->loader->add_action( 'wp_ajax_rex_get_rxcf', $plugin_admin, 'rex_get_rxcf' );
		$this->loader->add_action( 'wp_ajax_rex_save_rxcf', $plugin_admin, 'rex_save_rxcf' );
		
		// bundle ACF
		$this->loader->add_filter( 'acf/settings/path', $plugin_admin, 'acf_settings_path' );
		$this->loader->add_filter( 'acf/settings/dir', $plugin_admin, 'acf_settings_dir' );
		$this->loader->add_filter( 'acf/settings/show_admin', $plugin_admin, 'acf_hide_menu' );
		
		$this->loader->add_filter( 'acf/location/rule_types', $plugin_admin, 'acf_rule_type_rexpansive_builder' );
		$this->loader->add_filter( 'acf/location/rule_values/rexpansive_builder', $plugin_admin, 'acf_rule_values_rexpansive_builder' );
		$this->loader->add_filter( 'acf/location/rule_match/rexpansive_builder', $plugin_admin, 'acf_rule_match_rexpansive_builder', 10, 3 );
		
	}
	
	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Rexbuilder_Public( $this->get_plugin_name(), $this->get_version() );

		//per la release
//		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles_production' );
//		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts_production' );

		//per lo sviluppo
		// filter for the media library
		//$this->loader->add_filter( 'ajax_query_attachments_args', $plugin_public, 'filter_media' );
		
		/* 			
			funzione per vedere se un utente è loggato
			if ( is_user_logged_in() ) {
				echo "<script type='text/javascript'>alert('Welcome, registered user');</script>";
			} else {
				echo "<script type='text/javascript'>alert('Welcome, visitor');</script>";
			}
 */
		$this->loader->add_filter( 'body_class', $plugin_public, 'rexlive_body_class', 10, 1 );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'print_post_custom_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'print_rex_buttons_style' );

		$this->loader->add_action( 'wp_footer', $plugin_public, 'print_photoswipe_template' );
		
		$this->loader->add_action( 'wp_footer', $plugin_public, 'print_vertical_dots' );
		
		$this->loader->add_action( 'wp_footer', $plugin_public, 'print_post_id' );

		//$this->loader->add_action( 'wp_footer', $plugin_public, 'create_builder_modals' );
		
		$this->loader->add_action( 'wp_footer', $plugin_public, 'include_js_template' );
		$this->loader->add_action( 'wp_footer', $plugin_public, 'include_sprites' );
		$this->loader->add_action( 'wp_footer', $plugin_public, 'include_sprites_live' );

		$this->loader->add_action( 'wp_ajax_rexlive_save_shortcode', $plugin_public, 'rexlive_save_shortcode' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_save_shortcode', $plugin_public, 'rexlive_save_shortcode' );

		$this->loader->add_action( 'wp_ajax_rexlive_save_avaiable_layouts', $plugin_public, 'rexlive_save_avaiable_layouts' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_save_avaiable_layouts', $plugin_public, 'rexlive_save_avaiable_layouts' );

		$this->loader->add_action( 'wp_ajax_rexlive_save_customization_layout', $plugin_public, 'rexlive_save_customization_layout' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_save_customization_layout', $plugin_public, 'rexlive_save_customization_layout' );
		
		$this->loader->add_action( 'wp_ajax_rexlive_save_custom_css', $plugin_public, 'rexlive_save_custom_css' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_save_custom_css', $plugin_public, 'rexlive_save_custom_css' );

		$this->loader->add_action( 'wp_ajax_rexlive_save_customization_model', $plugin_public, 'rexlive_save_customization_model' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_save_customization_model', $plugin_public, 'rexlive_save_customization_model' );

		$this->loader->add_action( 'wp_ajax_rexlive_save_avaiable_model_layouts_names', $plugin_public, 'rexlive_save_avaiable_model_layouts_names' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_save_avaiable_model_layouts_names', $plugin_public, 'rexlive_save_avaiable_model_layouts_names' );

		$this->loader->add_action( 'wp_ajax_rexlive_edit_model_shortcode_builder', $plugin_public, 'rexlive_edit_model_shortcode_builder' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_edit_model_shortcode_builder', $plugin_public, 'rexlive_edit_model_shortcode_builder' );
		
		$this->loader->add_action( 'wp_ajax_rexlive_save_sections_rexids', $plugin_public, 'rexlive_save_sections_rexids' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_save_sections_rexids', $plugin_public, 'rexlive_save_sections_rexids' );

		$this->loader->add_action( 'wp_ajax_rexlive_get_embed_code', $plugin_public, 'rexlive_get_embed_code' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_get_embed_code', $plugin_public, 'rexlive_get_embed_code' );
		$this->loader->add_action( 'wp_ajax_rexlive_save_buttons_in_page', $plugin_public, 'rexlive_save_buttons_in_page' );
		$this->loader->add_action( 'wp_ajax_nopriv_rexlive_save_buttons_in_page', $plugin_public, 'rexlive_save_buttons_in_page' );

		// $this->loader->add_action( 'wpcf7_contact_form', $plugin_public, 'cf7_custom_script_guard' );
		$this->loader->add_action( 'shortcode_atts_wpcf7', $plugin_public, 'cf7_custom_style', 10, 4 );
		$this->loader->add_filter( "the_content", $plugin_public, "generate_builder_content");
	}

	/**
	 * Register all of the shortcodes related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    	1.0.0
	 * @access   	private
	 * @version 	1.1.3	Add Indicator shortcode
	 */
	private function define_shortcodes() {
		$section = new Rexbuilder_Section();
		$block = new Rexbuilder_Block();
		$textfill = new Rexbuilder_TextFill();
		$slider = new Rexbuilder_RexSlider();
		$indicator = new Rexbuilder_Indicator();
		$model = new Rexbuilder_Model();
		$button = new Rexbuilder_Button();
		$accordion = new Rexbuilder_Accordion();

		$this->loader->add_shortcode( 'RexpansiveSection', $section, 'render_section' );
		$this->loader->add_shortcode( 'RexpansiveBlock', $block, 'render_block' );
		$this->loader->add_shortcode( 'TextFill', $textfill, 'render_textfill' );
		$this->loader->add_shortcode( 'RexSlider', $slider, 'render_slider' );
		$this->loader->add_shortcode( 'RexIndicator', $indicator, 'render_indicator' );
		$this->loader->add_shortcode( 'RexModel', $model, 'render_model' );
		$this->loader->add_shortcode( 'RexButton', $button, 'render_button' );
		$this->loader->add_shortcode( 'RexAccordion', $accordion, 'render_accordion' );
        $this->loader->add_shortcode( 'RexAccordionHeader', $accordion, 'render_accordion_header' );
        $this->loader->add_shortcode( 'RexAccordionContent', $accordion, 'render_accordion_content' );
        $this->loader->add_shortcode( 'RexAccordionFooter', $accordion, 'render_accordion_footer' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Rexbuilder_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
