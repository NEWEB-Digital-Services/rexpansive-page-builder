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
		$this->version = '1.0.15';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_shortcodes();
		$this->include_acf();
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
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-rexbuilder-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-rexbuilder-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-rexbuilder-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-rexbuilder-public.php';

		/**
		 * The classes responsible for defining all the shortcodes.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-rexbuilder-section-shortcode.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-rexbuilder-block-shortcode.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-rexbuilder-textfill-shortcode.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-rexbuilder-rexslider-shortcode.php';

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
		$this->loader->add_filter( 'manage_rex_slider_posts_columns', $plugin_admin, 'rexpansive_slider_columns_head_add_column' );
		$this->loader->add_filter( 'manage_rex_slider_posts_columns', $plugin_admin, 'rexpansive_slider_columns_reorder' );
		$this->loader->add_action( 'manage_rex_slider_posts_custom_column', $plugin_admin, 'rexpansive_slider_columns_content', 10, 2 );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles_production' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts_production' );

		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_plugin_options_menu' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'update_notifier_menu' );

		$this->loader->add_action( 'admin_bar_menu', $plugin_admin, 'add_top_bar_plugin_options_menu', 1000 );

		$plugin_basename = plugin_basename( plugin_dir_path( __DIR__ ) . $this->plugin_name . '.php' );
		$this->loader->add_filter( 'plugin_action_links_' . $plugin_basename, $plugin_admin, 'add_action_links' );

		$this->loader->add_action( 'admin_init', $plugin_admin, 'plugin_options_update' );

		$this->loader->add_action( 'admin_footer', $plugin_admin, 'create_builder_modals' );
		$this->loader->add_action( 'admin_footer', $plugin_admin, 'create_builder_templates' );

		$this->loader->add_action( 'admin_head', $plugin_admin, 'rexbuilder_add_custom_buttons' );

		$this->loader->add_action( 'edit_form_after_title', $plugin_admin, 'add_switch_under_post_title' );

		// Ajax functions
		$this->loader->add_action( 'wp_ajax_rex_edit_slider_from_builder', $plugin_admin, 'rex_edit_slider_from_builder' );
		$this->loader->add_action( 'wp_ajax_rex_create_slider_from_builder', $plugin_admin, 'rex_create_slider_from_builder' );
		$this->loader->add_action( 'wp_ajax_rex_create_rexslider_admin_markup', $plugin_admin, 'rex_create_rexslider_admin_markup' );

		// bundle ACF
		$this->loader->add_filter( 'acf/settings/path', $plugin_admin, 'acf_settings_path' );
		$this->loader->add_filter( 'acf/settings/dir', $plugin_admin, 'acf_settings_dir' );
		$this->loader->add_filter( 'acf/settings/show_admin', $plugin_admin, 'acf_hide_menu' );
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

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles_production' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts_production' );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'print_post_custom_styles' );

		$this->loader->add_action( 'wp_footer', $plugin_public, 'print_photoswipe_template' );

		$this->loader->add_action( 'wp_footer', $plugin_public, 'print_vertical_dots' );
	}

	/**
	 * Register all of the shortcodes related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_shortcodes() {
		$section = new Rexbuilder_Section();
		$block = new Rexbuilder_Block();
		$textfill = new Rexbuilder_TextFill();
		$slider = new Rexbuilder_RexSlider();

		$this->loader->add_shortcode( 'RexpansiveSection', $section, 'render_section' );
		$this->loader->add_shortcode( 'RexpansiveBlock', $block, 'render_block' );
		$this->loader->add_shortcode( 'TextFill', $textfill, 'render_textfill' );
		$this->loader->add_shortcode( 'RexSlider', $slider, 'render_slider' );
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

	public function include_acf() {
		define( 'ACF_LITE', true );

		// 4. Include ACF
		include_once( plugin_dir_path(__DIR__) . 'admin/lib/acf/advanced-custom-fields/acf.php' );

		// Include ACF Repeater Add-on
		include_once( plugin_dir_path(__DIR__) . 'admin/lib/acf/acf-repeater/acf-repeater.php');

		if(function_exists("register_field_group")) {
			register_field_group(array (
				'id' => 'acf_rexpansive-slider',
				'title' => 'Rexpansive Slider',
				'fields' => array (
					array (
						'key' => 'field_564f2373722c2',
						'label' => 'Slides',
						'name' => '_rex_banner_gallery',
						'type' => 'repeater',
						'sub_fields' => array (
							array (
								'key' => 'field_5675394f2fa0f',
								'label' => 'Image',
								'name' => '_rex_banner_gallery_image',
								'type' => 'image',
								'column_width' => '',
								'save_format' => 'object',
								'preview_size' => 'thumbnail',
								'library' => 'all',
							),
							array (
								'key' => 'field_567539852fa11',
								'label' => 'Title',
								'name' => '_rex_banner_gallery_image_title',
								'type' => 'wysiwyg',
								'column_width' => '',
								'default_value' => '',
								'toolbar' => 'full',
								'media_upload' => 'no',
							),
							array (
								'key' => 'field_580e08d79f9db',
								'label' => 'Video',
								'name' => '_rex_banner_gallery_video',
								'type' => 'text',
								'column_width' => '',
								'default_value' => '',
								'placeholder' => '',
								'prepend' => '',
								'append' => '',
								'formatting' => 'html',
								'maxlength' => '',
							),
							array (
								'key' => 'field_5948ca17a1bb8',
								'label' => 'Mp4',
								'name' => '_rex_banner_gallery_video_mp4',
								'type' => 'file',
								'column_width' => '',
								'save_format' => 'object',
								'library' => 'all',
							),
							array (
								'key' => 'field_5948eb01358e1',
								'label' => 'Audio',
								'name' => '_rex_banner_gallery_video_audio',
								'type' => 'checkbox',
								'column_width' => '',
								'choices' => array (
									'yes' => 'Enable',
								),
								'default_value' => '',
								'layout' => 'vertical',
							),
							array (
								'key' => 'field_594a186edc532',
								'label' => 'Url',
								'name' => '_rex_banner_gallery_url',
								'type' => 'text',
								'column_width' => '',
								'default_value' => '',
								'placeholder' => '',
								'prepend' => '',
								'append' => '',
								'formatting' => 'html',
								'maxlength' => '',
							),
						),
						'row_min' => '',
						'row_limit' => '',
						'layout' => 'row',
						'button_label' => 'Add Slide',
					),
					array (
						'key' => 'field_564f1f0c050be',
						'label' => 'Enable Animation',
						'name' => '_rex_enable_banner_animation',
						'type' => 'checkbox',
						'instructions' => 'If check, enables animation on banner images',
						'choices' => array (
							'yes' => 'Enable',
						),
						'default_value' => 'yes',
						'layout' => 'horizontal',
					),
					array (
						'key' => 'field_5948caf770b0e',
						'label' => 'View Prev Next Arrows',
						'name' => '_rex_enable_banner_prev_next',
						'type' => 'checkbox',
						'choices' => array (
							'yes' => 'Enable',
						),
						'default_value' => 'yes',
						'layout' => 'horizontal',
					),
					array (
						'key' => 'field_5948cb2270b0f',
						'label' => 'View Dots',
						'name' => '_rex_enable_banner_dots',
						'type' => 'checkbox',
						'choices' => array (
							'yes' => 'Enable',
						),
						'default_value' => 'yes',
						'layout' => 'horizontal',
					),
				),
				'location' => array (
					array (
						array (
							'param' => 'post_type',
							'operator' => '==',
							'value' => 'rex_slider',
							'order_no' => 0,
							'group_no' => 0,
						),
					),
				),
				'options' => array (
					'position' => 'normal',
					'layout' => 'default',
					'hide_on_screen' => array (
					),
				),
				'menu_order' => 0,
			));
		}
	}

}
