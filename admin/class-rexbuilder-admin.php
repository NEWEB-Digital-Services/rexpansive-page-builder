<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 * @author     Neweb <info@neweb.info>
 */
class Rexbuilder_Admin {

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
	 * Plugin general settings to share around
	 * @var array
	 * @since  2.0.0
	 */
	private $settings;

	/**
	 * Plugin Installer handler
	 * @var Rexbuilder_Installation_Handler
	 * @since  2.0.1
	 */
	private $Installer;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $Rexbuilder       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->plugin_options = get_option( $this->plugin_name . '_options' );

		$this->settings = apply_filters( 'rexbuilder_metabox_settings', array(
			'zak' => array(
			  'active' => '0'
			)
		) );

		if( isset( $this->plugin_options['post_types'] ) ) {
			$post_to_activate = $this->plugin_options['post_types'];

			// Call the construction of the metabox
			require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-meta-box.php';

			foreach( $post_to_activate as $key => $value ) {

				if( 1 == $value ) {

					$page_builder = new Rexbuilder_Meta_Box( 
						$this->plugin_name,
						'rexbuilder', 
						'Rexpansive Builder', 
						$key, 
						'normal', 
						'high',
						'rexpansive-builder rexbuilder-materialize-wrap'
					);

					$page_builder->add_fields( array(
						array(
							'id' => '_rexbuilder_active',
							'type' => 'hidden_field',
							'default' => ( $this->is_edit_page('new') ? 'true' : 'false' ),
						),
						/*array(
							'id'	=>	'_rexbuilder_photoswipe',
							'type'	=>	'hidden_field',
							'default'	=>	'0',
						),*/
						array(
							'label' => 'Rexbuilder Header',
							'desc'	=>	'',
							'id'	=>	'_rexbuilder_custom_css',
							'type'	=>	'rexbuilder_header'
						),
						array(
							'label' => 'Rexbuilder',
							'desc' => 'Expand your mind',
							'id' => '_rexbuilder_shortcode',
							'type'	=>	'rexpansive_plugin',
						),
					) );
				}
			}
		}

		$this->Installer = null;
	}

	/**
	 * Fixing the "save from backend" builder state on wpml translation
	 *
	 * @param Array $obj
	 * @return void
	 * @since 2.0.0
	 * 
	 */
	public function wpml_translation_update_fix ( $obj ) {
		// Insert fix
		if ( isset($obj['type']) && isset($obj['context']) && 'insert' === $obj['type'] && 'post' === $obj['context'] ) 
		{
			// getting the code details of the translation
			$post_type_info = explode( '_', $obj['element_type'] );
			$args = array('element_id' => $obj['element_id'], 'element_type' => $post_type_info[1] );
			$language_code_details = apply_filters( 'wpml_element_language_details', null, $args );
			$result = '';

			if ( isset( $language_code_details ) ) {
				// query the database to find the original source of the translation
				global $wpdb;
				$result = $wpdb->get_row(
					$wpdb->prepare( 
						"
						SELECT * 
						FROM {$wpdb->prefix}icl_translations 
						WHERE element_type LIKE %s
						AND trid = %d
						AND language_code = %s
						LIMIT 1
						",
						$obj['element_type'], $obj['trid'], $language_code_details->source_language_code
					),
					ARRAY_A
				);
			}

			if ( !empty( $result ) ) {
				// save from baackend original status
				$original_savedFromBackend = get_post_meta( $result['element_id'], '_save_from_backend', true );
				update_post_meta( $obj['element_id'], '_save_from_backend', $original_savedFromBackend );
				// original shortcode
				$original_shortcode = get_post_meta( $result['element_id'], '_rexbuilder_shortcode', true );
				update_post_meta( $obj['element_id'], '_rexbuilder_shortcode', $original_shortcode );
				// original CSS
				$original_customCSS = get_post_meta( $result['element_id'], '_rexbuilder_custom_css', true );
				update_post_meta( $obj['element_id'], '_rexbuilder_custom_css', $original_customCSS );
			}
		}
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles( $hook ) {

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

		$page_info = get_current_screen();

		if( $this->builder_active_on_this_post_type( $page_info ) ) {
			wp_enqueue_style( 'material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), null, 'all' );
			wp_enqueue_style( 'materialize', REXPANSIVE_BUILDER_URL . 'admin/css/materialize.min.css', array(), null, 'all' );
			
			wp_enqueue_style( 'spectrum-style', REXPANSIVE_BUILDER_URL . 'admin/spectrum/spectrum.css', array(), null, 'all' );

			wp_enqueue_style( 'font-awesome', REXPANSIVE_BUILDER_URL . 'admin/font-awesome-4.3.0/css/font-awesome.min.css', array(), null, 'all' );
			wp_enqueue_style( 'rex-custom-fonts', REXPANSIVE_BUILDER_URL . 'admin/rexpansive-font/font.css', array(), null, 'all' );

			wp_enqueue_style( 'gridster-style', REXPANSIVE_BUILDER_URL . 'admin/css/jquery.gridster.css', array(), null, 'all' );
			wp_enqueue_style( 'custom-editor-buttons-style', REXPANSIVE_BUILDER_URL . 'admin/css/rex-custom-editor-buttons.css', array(), null, 'all' );
			wp_enqueue_style( 'rexbuilder-style', REXPANSIVE_BUILDER_URL . 'admin/css/builder.css', array(), null, 'all' );
		}
	}

	/**
	 * Register the stylesheets for the admin area for production version
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles_production( $hook ) {
		$page_info = get_current_screen();
		$ver = null;

		if( $this->builder_active_on_this_post_type( $page_info ) ) {
			wp_enqueue_style( 'material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), null, 'all' );

			wp_enqueue_style( 'font-awesome', REXPANSIVE_BUILDER_URL . 'admin/font-awesome-4.3.0/css/font-awesome.min.css', array(), null, 'all' );
			wp_enqueue_style( 'rex-custom-fonts', REXPANSIVE_BUILDER_URL . 'admin/rexpansive-font/font.css', array(), null, 'all' );
			wp_enqueue_style( 'spectrum-style', REXPANSIVE_BUILDER_URL . 'admin/spectrum/spectrum.css', array(), null, 'all' );

			if( isset( $_GET['rexlive'] ) && 'true' == $_GET['rexlive'] ) {
				wp_enqueue_style( 'rexbuilder-live-google-fonts', 'https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i', false );
				wp_enqueue_style('photoswipe-skin', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Photoswipe/default-skin/default-skin.css', array(), $ver, 'all');
				wp_enqueue_style( 'grapick', REXPANSIVE_BUILDER_URL . 'admin/grapick/grapick.min.css', array(), null, 'all' );
				wp_enqueue_style( 'rexliveStyle', REXPANSIVE_BUILDER_URL . 'admin/css/tools-def.css', array(), null, 'all' );
			} else {
				wp_enqueue_style( 'admin-style', REXPANSIVE_BUILDER_URL . 'admin/css/admin.css', array(), null, 'all' );
				wp_enqueue_style( 'admin-live-style', REXPANSIVE_BUILDER_URL . 'admin/css/admin-live.css', array(), null, 'all' );
			}
		}
		// settings page resources
		else if ( 'toplevel_page_' . $this->plugin_name === $page_info->id )
		{
			wp_enqueue_style( 'admin-settings', REXPANSIVE_BUILDER_URL . 'admin/css/admin-settings.css', array(), null, 'all' );
		}
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 * @version  2.0.3
	 */
	public function enqueue_scripts_production( $hook ) {

		$page_info = get_current_screen();

		if( $this->builder_active_on_this_post_type( $page_info ) ) {
			wp_enqueue_media();
			
			if( isset( $_GET['rexlive'] ) && 'true' == $_GET['rexlive'] ) {
				// loader
				wp_enqueue_script( 'nprogress', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/nprogress.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);
				// spectrum color picker
				wp_enqueue_script( 'spectrum-scripts', REXPANSIVE_BUILDER_URL . 'admin/spectrum/spectrum.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true );
				// grapick gradient picker
				wp_enqueue_script( 'grapick', REXPANSIVE_BUILDER_URL . 'admin/grapick/grapick.min.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true );
				// actual dimension plugion
				wp_enqueue_script( 'jquery-actual', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/jquery.actual.min.js', array('jquery'),  REXPANSIVE_BUILDER_VERSION, true );
				
				// photoswipe
				wp_enqueue_script( 'photoswipe', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Photoswipe/photoswipe.min.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);
				wp_enqueue_script( 'photoswipe-ui', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Photoswipe/photoswipe-ui-default.min.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);
				
				// tippy
				wp_enqueue_script( 'tippy', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/tippy.all.min.js', array( 'jquery' ), REXPANSIVE_BUILDER_VERSION, true );

				// editorBTT - rexAccordion
				wp_enqueue_script( 'rexAccordion', REXPANSIVE_BUILDER_URL . 'public/js/vendor/6-jquery.rexAccordion.js', array( 'jquery' ), REXPANSIVE_BUILDER_VERSION, true );

				// tmpl
				wp_enqueue_script( 'template-util', REXPANSIVE_BUILDER_URL . 'public/js/vendor/tmpl.min.js', array( 'jquery' ), REXPANSIVE_BUILDER_VERSION, true );

				wp_enqueue_script( 'ace-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/ace.js', array('jquery'),  REXPANSIVE_BUILDER_VERSION, true );
				wp_enqueue_script( 'ace-mode-css-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/mode-css.js', array('jquery'),  REXPANSIVE_BUILDER_VERSION, true );
				wp_enqueue_script( 'ace-mode-html-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/mode-html.js', array('jquery'),  REXPANSIVE_BUILDER_VERSION, true );

				global $post;
				$source = get_permalink($post->ID);
				
				wp_enqueue_script( 'rexlive-start', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive-admin.js', array( 'jquery' ), REXPANSIVE_BUILDER_VERSION, true );
				wp_localize_script( 'rexlive-start', 'live_editor_obj', $this->get_plugin_admin_settings( $source ) );
			} else {
				global $post;

				$wp_isFive = Rexbuilder_Utilities::is_version();
				$classicEditor_Active = Rexbuilder_Utilities::check_plugin_active( 'classic-editor/classic-editor.php' );
				$savedFromBackend = get_post_meta( get_the_id(), '_save_from_backend', true);

				wp_enqueue_script('jquery');
				wp_enqueue_script("jquery-ui-draggable");

				wp_enqueue_script( 'ace-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/ace.js', array('jquery'),  null, true );
				wp_enqueue_script( 'ace-mode-css-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/mode-css.js', array('jquery'),  null, true );

				wp_enqueue_script( 'admin-plugins', REXPANSIVE_BUILDER_URL . 'admin/js/plugins.js', array('jquery'),  null, true );
				wp_localize_script( 'admin-plugins', '_plugin_backend_settings', array(
					'activate_builder'	=>	'true',
					'saved_from_backend' => ( isset( $savedFromBackend ) && $savedFromBackend == "false" ? 'false' : 'true' ),
					'wp_isFive' => $wp_isFive,
					'classic_editor_active' => $classicEditor_Active
				) );
				wp_localize_script( 'admin-plugins', 'rexajax', array(
					'ajaxurl'	=>	admin_url( 'admin-ajax.php' ),
					'rexnonce'	=>	wp_create_nonce( 'rex-ajax-call-nonce' ),
				) );

				if ( isset( $post ) ) {
					if( $wp_isFive && empty( $classicEditor_Active ) && 'product' !== $post->post_type ) {
						wp_enqueue_script( 'rexbuilder-admin-gutenfix', REXPANSIVE_BUILDER_URL . 'admin/js/rexbuilder-admin-gutenfix.js', array( 'jquery' ), null, true );
					} else {
						wp_enqueue_script( 'rexbuilder-admin', REXPANSIVE_BUILDER_URL . 'admin/js/rexbuilder-admin.js', array( 'jquery' ), null, true );
					}
				}
			}
		}
		// settings page resourcers
		else if ( 'toplevel_page_' . $this->plugin_name === $page_info->id )
		{
			wp_enqueue_script( 'svgo-browser', REXPANSIVE_BUILDER_URL . 'admin/js/settings/svgo.js' );
			wp_enqueue_script( 'admin-settings', REXPANSIVE_BUILDER_URL . 'admin/js/settings/admin-settings.js' );
			wp_localize_script( 'admin-settings', 'admin_settings_vars', array(
				'labels' => array(
					'optimize_correct' => __( 'correctly optimized', 'rexpansive-builder' ),
					'existing_sprite' => __( 'already uploaded', 'rexpansive-builder' ),
					'upload_succesfull' => __( 'All icons correctly uploaded', 'rexpansive-builder' ),
					'upload_error' => __( 'Uploaded error', 'rexpansive-builder' ),
					'no_selection' => __( 'No icons selected', 'rexpansive-builder' ),
					'remove_succesfull' => __( 'Icons correctly removed', 'rexpansive-builder' ),
					'remove_error' => __( 'Remove error', 'rexpansive-builder' ),
					'install_icons_succesfull' => __( 'Icons correctly installed', 'rexpansive-builder' )
				)
			) );
		}
	}

	/**
	 * Register the JavaScript for the admin area for production version
	 *
	 * @since    1.0.0
	 * @version 2.0.0	Adding the builderlive scripts. Handling Gutenberg integration
	 * @edit 06-03-2019
	 */
	public function enqueue_scripts( $hook ) {
		$page_info = get_current_screen();

		if( $this->builder_active_on_this_post_type( $page_info ) ) {
			wp_enqueue_media();
			
			if( isset( $_GET['rexlive'] ) && 'true' == $_GET['rexlive'] ) {

				// loader
				wp_enqueue_script( 'nprogress', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/nprogress.js', array('jquery'), null, true);
				// spectrum color picker
				wp_enqueue_script( 'spectrum-scripts', REXPANSIVE_BUILDER_URL . 'admin/spectrum/spectrum.js', array('jquery'), null, true );
				// grapick gradient picker
				wp_enqueue_script( 'grapick', REXPANSIVE_BUILDER_URL . 'admin/grapick/grapick.min.js', array('jquery'), null, true );
				// actual dimension plugion
				wp_enqueue_script( 'jquery-actual', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/jquery.actual.min.js', array('jquery'),  null, true );
				
				// photoswipe
				wp_enqueue_script( 'photoswipe', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Photoswipe/photoswipe.min.js', array('jquery'), null, true);
				wp_enqueue_script( 'photoswipe-ui', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Photoswipe/photoswipe-ui-default.min.js', array('jquery'), null, true);
				
				// tippy
				wp_enqueue_script( 'tippy', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/tippy.all.min.js', array( 'jquery' ), null, true );

				// editorBTT - rexAccordion
				wp_enqueue_script( 'rexAccordion', REXPANSIVE_BUILDER_URL . 'public/js/vendor/6-jquery.rexAccordion.js', array( 'jquery' ), null, true );

				// tmpl
				wp_enqueue_script( 'template-util', REXPANSIVE_BUILDER_URL . 'public/js/vendor/tmpl.min.js', array( 'jquery' ), null, true );

				// ace
				wp_enqueue_script( 'ace-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/ace.js', array('jquery'),  null, true );
				wp_enqueue_script( 'ace-mode-css-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/mode-css.js', array('jquery'),  null, true );
				wp_enqueue_script( 'ace-mode-html-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/mode-html.js', array('jquery'),  null, true );
				// wp_enqueue_script( 'ace-ext-beautify', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/ext-beautify.js', array('jquery'),  null, true );

				// wp_enqueue_script( 'rexbuilder-admin-config', REXPANSIVE_BUILDER_URL . 'admin/js/0-Rexpansive_Builder_Admin_Config.js', array( 'jquery' ), null, true );
				// wp_enqueue_script( 'rexbuilder-admin-utilities', REXPANSIVE_BUILDER_URL . 'admin/js/0-Rexpansive_Builder_Admin_Utilities.js', array( 'jquery' ), null, true );
				// wp_enqueue_script( 'rexbuilder-admin-modals', REXPANSIVE_BUILDER_URL . 'admin/js/1-Rexpansive_Builder_Admin_Modals.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexbuilder-media-uploader', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_MediaUploader.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexbuilder-admin-text-editor', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_RexSlider_TextEditor.js', array( 'jquery' ), null, true );
				// wp_enqueue_script( 'rexbuilder-admin-padding-editor', REXPANSIVE_BUILDER_URL . 'admin/js/3-Rexpansive_Builder_Admin_PaddingEditor.js', array( 'jquery' ), null, true );
				// wp_enqueue_script( 'rexbuilder-admin-position-editor', REXPANSIVE_BUILDER_URL . 'admin/js/3-Rexpansive_Builder_Admin_PositionEditor.js', array( 'jquery' ), null, true );

				wp_enqueue_script( 'rexlive-ajax-calls', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Ajax_Calls.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-color-palette', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Color_Palette.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-overlay-palette', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Overlay_Palette.js', array( 'jquery' ), null, true );
			
				wp_enqueue_script( 'rexlive-modals-utils', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Modals_Utils.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-insert-video-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Insert_Video_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-layout-grid-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_LayoutGrid_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-width-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Width_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-grid-separatos-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Separators_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-margins-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_SectionMargins_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-row-photoswipe-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Photoswipe_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-row-hold-grid-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Hold_Grid_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-grid-fullheight-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Fullheight.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-name-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_SectionName_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-top-tools', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Top_Tools.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-custom-classes-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_CustomClasses_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-background-color-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Background_Section_Color_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-overlay-color-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Overlay_Color_Section_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-image-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Background_Image_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-video-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Video_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-background-gradient', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Background_Gradient.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-overlay-gradient', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Overlay_Gradient.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-section-background-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Section_Background_Modal.js', array( 'jquery' ), null, true );
				
				wp_enqueue_script( 'rexlive-css-editor-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_CSS_Editor_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-html-editor-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Html_Editor_Modal.js', array( 'jquery' ), null, true );

				wp_enqueue_script( 'rexlive-block-color-background', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Background_Block_Color_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-overlay-color-block', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Overlay_Color_Block_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-image-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Background_Image_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-image-setting', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Background_Image_Setting.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-video-options', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Video_Background_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-positions-options', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_ContentPosition_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-positions-settings', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_ContentPosition_Setting.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-image-positions-options', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_ImagePosition_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-image-positions-setting', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_ImagePosition_Setting.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-paddings-options', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Paddings_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-custom-classes', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Custom_Classes_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-image-editor', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Image_Editor_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-accordion-editor', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Accordion.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-slideshow-editor', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Slideshow.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-gradient-editor', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Background_Gradient.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-text-gradient-editor', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Text_Gradient.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-overlay-gradient-editor', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Overlay_Gradient.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-link-url', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Url_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-block-options', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Block_Options_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-model-options', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Model_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-model-edit-name', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Model_Edit_Name_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-open-models-warning', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Open_Models_Warning.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-custom-layouts-options', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_CustomLayout_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-edit-modals', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Model_Edit_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexbuilder-Slider', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexbuilder_RexSlider.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-ChangeLayout', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_ChangeLayout_Modal.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Inline-SVG', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Inline_SVG.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-postedit', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_PostEdit.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-postedit-medialist', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_PostEdit_MediaList.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-LockedOption-Mask', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_LockedOption_Mask.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Model-Import', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Model_Import.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Button-Import', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Button_Import.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Button-Edit', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Edit_Button.js', array( 'jquery' ), null, true );

				// elements and form logics
				wp_enqueue_script( 'Rexlive-Element-Import', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Element_Import.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Element-Choose', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Element_Choose.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Wpcf7-Add-Content', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Wpcf7_Add_Content.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Wpcf7-Edit-Content', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Wpcf7_Edit_Content.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Wpcf7-Edit-Form', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Wpcf7_Edit_Form.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'Rexlive-Lateral-Menu', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Lateral_Menu.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-modals', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Modals.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-base-settings', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Base_Settings.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-util-admin', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexbuilder_Util_Admin_Editor.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-update-video-inline', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_UpdateVideoInline.js', array( 'jquery' ), null, true );
				// Import the Javascript file to manage the ONUNLOADEVENT Popup
				// wp_enqueue_script( 'rexlive-on-before-unload', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_OnBeforeUnload.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-gradient-utils', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Gradient_Utils.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-page-margins', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Page_Margins.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rexlive-page-settings-modal', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexlive_Page_Settings_Modal.js', array( 'jquery' ), null, true );
				global $post;
				$source = get_permalink($post->ID);
				
				wp_enqueue_script( 'rexlive-start', REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexbuilder_Starting.js', array( 'jquery' ), null, true );
				wp_localize_script( 'rexlive-start', 'live_editor_obj', $this->get_plugin_admin_settings( $source ) );
			} else {
				global $post;

				$wp_isFive = Rexbuilder_Utilities::is_version();
				$classicEditor_Active = Rexbuilder_Utilities::check_plugin_active( 'classic-editor/classic-editor.php' );
				$savedFromBackend = get_post_meta( get_the_id(), '_save_from_backend', true);

				wp_enqueue_script('jquery');
				wp_enqueue_script("jquery-ui-draggable");

				wp_enqueue_script( 'ace-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/ace.js', array('jquery'),  null, true );
				wp_enqueue_script( 'ace-mode-css-scripts', REXPANSIVE_BUILDER_URL . 'admin/ace/src-min-noconflict/mode-css.js', array('jquery'),  null, true );

				wp_enqueue_script( 'admin-plugins', REXPANSIVE_BUILDER_URL . 'admin/js/plugins.js', array('jquery'),  null, true );
				wp_localize_script( 'admin-plugins', '_plugin_backend_settings', array(
					'activate_builder'	=>	'true',
					'saved_from_backend' => ( isset( $savedFromBackend ) && $savedFromBackend == "false" ? 'false' : 'true' ),
					'wp_isFive' => $wp_isFive,
					'classic_editor_active' => $classicEditor_Active
				) );
				wp_localize_script( 'admin-plugins', 'rexajax', array(
					'ajaxurl'	=>	admin_url( 'admin-ajax.php' ),
					'rexnonce'	=>	wp_create_nonce( 'rex-ajax-call-nonce' ),
				) );

				if ( isset( $post ) ) {
					if( $wp_isFive && empty( $classicEditor_Active ) && 'product' !== $post->post_type ) {
						wp_enqueue_script( 'rexbuilder-admin-gutenfix', REXPANSIVE_BUILDER_URL . 'admin/js/rexbuilder-admin-gutenfix.js', array( 'jquery' ), null, true );
					} else {
						wp_enqueue_script( 'rexbuilder-admin', REXPANSIVE_BUILDER_URL . 'admin/js/rexbuilder-admin.js', array( 'jquery' ), null, true );
					}
				}
			}
		}
		// settings page resourcers
		else if ( 'toplevel_page_' . $this->plugin_name === $page_info->id )
		{
			wp_enqueue_script( 'svgo-browser', REXPANSIVE_BUILDER_URL . 'admin/js/settings/svgo.js' );
			wp_enqueue_script( 'admin-settings', REXPANSIVE_BUILDER_URL . 'admin/js/settings/admin-settings.js' );
			wp_localize_script( 'admin-settings', 'admin_settings_vars', array(
				'labels' => array(
					'optimize_correct' => __( 'correctly optimized', 'rexpansive-builder' ),
					'existing_sprite' => __( 'already uploaded', 'rexpansive-builder' ),
					'upload_succesfull' => __( 'All icons correctly uploaded', 'rexpansive-builder' ),
					'upload_error' => __( 'Uploaded error', 'rexpansive-builder' ),
					'no_selection' => __( 'No icons selected', 'rexpansive-builder' ),
					'remove_succesfull' => __( 'Icons correctly removed', 'rexpansive-builder' ),
					'remove_error' => __( 'Remove error', 'rexpansive-builder' ),
					'install_icons_succesfull' => __( 'Icons correctly installed', 'rexpansive-builder' )
				)
			) );
		}
	}

	/**
	 * Generate LiveBuilder admin JS settings
	 * @param String $source post permalink
	 * @return Array settings
	 * @since  2.0.0
	 */
	private function get_plugin_admin_settings( $source ) {
		return array(
			'source_url' => $source,
			'ajaxurl'	=>	admin_url( 'admin-ajax.php' ),
			'rexnonce'	=>	wp_create_nonce( 'rex-ajax-call-nonce' ),
			'labels'	=>  array(
				'slider' => array(
					'new_slider' => __('New Slider','rexpansive-builder'),
					'copy_slider' => __('Copy-','rexpansive-builder'),
					'list_title_prefix' => __('Copy from "', 'rexpansive-builder'),
					'list_title_suffix' => __('"', 'rexpansive-builder')
				),
				'models' => array(
					'name_error' => __( 'Name already exists!', 'rexpansive-builder' ),
					'confirm_delete' => __( 'Are you sure you want to delete this model?', 'rexpansive-builder' ),
				),
				'rexbuttons' => array(
					'confirm_delete' => __( 'Are you sure you want to delete this button?', 'rexpansive-builder' ),
				),
				'rexelements' => array(
					'confirm_delete' => __( 'Are you sure you want to delete this element?', 'rexpansive-builder' ),
				)
			)
		);
	}

	/**
	 * Dequeue from LIVE area some admin scripts that can cause bugs
	 * - WPML popover tooltip
	 *
	 * @return void
	 * @since 2.0.0
	 * @date 07-03-2019
	 */
	public function dequeue_scripts() {
		if ( isset( $_GET['rexlive'] ) && $_GET['rexlive'] == 'true' ) {
			wp_dequeue_script( 'otgsPopoverTooltip' );
		}
	}

	/**
	 * Hooking on post duplication action of the Duplicate Post plugin
	 * Fixing builder information, like:
	 * - handlinge rexslider
	 * 
	 * @param  Integer $new_post_id     Duplicated post ID
	 * @param  WP_Post $old_post_object Old post object
	 * @param  WP_Post $new_post_status New post object
	 * @return void
	 * @since  2.0.3
	 */
	public function duplate_post_copy_fix( $new_post_id, $old_post_object, $new_post_status ) {
		// check builder active on post
		$builder_active = get_post_meta( $old_post_object->ID, '_rexbuilder_active', true );

		if ( 'true' !== $builder_active ) {
			return;
		}

		// retrieve shortcode
		$shortcode = get_post_meta( $old_post_object->ID, '_rexbuilder_shortcode', true );

		// check if shortcode exists
		if ( empty( $shortcode ) ) {
			return;
		}

		// check if rexslider is in the page
		if ( false === strpos( $shortcode, 'RexSlider' ) ) {
			return;
		}

		$pattern = get_shortcode_regex();
		$slider_pattern = '\[(\[?)(RexSlider)(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*+(?:\[(?!\/\2\])[^\[]*+)*+)\[\/\2\])?)(\]?)';

		preg_match_all( "/$pattern/", $shortcode, $sections );

		$new_shortcode = '';

		foreach( $sections[5] as $section_index => $section_content ) {
			if ( false === strpos( $section_content, 'RexSlider' ) ) {
				// section without slider, get clean section shortcode
				$new_shortcode .= $sections[0][$section_index];
				continue;
			}

			preg_match_all( "/$pattern/", $section_content, $blocks );

			$new_shortcode .= '[' . $sections[2][$section_index] . $sections[3][$section_index] . ']';

			foreach( $blocks[5] as $block_index => $block_content ) {
				$new_shortcode .= '[' . $blocks[2][$block_index] . $blocks[3][$block_index] . ']';
				if ( false === strpos( $block_content, 'RexSlider' ) ) {
					// block without slider, get its clean content
					$new_shortcode .= $block_content;
				} else {
					preg_match_all( "/$slider_pattern/", $block_content, $slider );
					$slider_attrs = shortcode_parse_atts( trim( $slider[3][0] ) );

					$slider_id = $slider_attrs['slider_id'];
					$slider_id_insert = self::clone_slider( $slider_id );

					if ( 0 === $slider_id_insert ) {
						$new_shortcode .= '';
					} else {
						$slider_attrs['slider_id'] = $slider_id_insert;
						$new_shortcode .= '[' . $slider[2][0];
						foreach ($slider_attrs as $key => $attr) {
							$new_shortcode .= ' ' . $key . '="' . $attr . '"';
						}
						$new_shortcode .= ']';
					}

				}

				$new_shortcode .= '[/' . $blocks[2][$block_index] . ']';
			}

			$new_shortcode .= '[/' . $sections[2][$section_index] . ']';
		}

		// update the cloned shortcode
		update_post_meta( $new_post_id, '_rexbuilder_shortcode', $new_shortcode );
	}

	/**
	 * Disable Gutenberg on live builder
	 * 
	 * @since 2.0.0
	 */
	public function disable_gutenberg_on_live( $state ) {
		if( isset( $_GET['rexlive'] ) && $_GET['rexlive'] == 'true' ) {
			return false;
		}
		return $state;
	}

	/**
	 * Print the code that launches the installation process
	 * @return void
	 * @since  2.0.1
	 */
	public function print_install_launcher() {
		$content_installed = get_option( REXPANSIVE_BUILDER_INSTALL_OPTION );
		if ( false === $content_installed ) {
			update_option( REXPANSIVE_BUILDER_INSTALL_OPTION, true );
			?>
<script type='text/javascript'>
/* <![CDATA[ */
;(function($) {
	function dispatch_install() {
		$.ajax({
			type: "POST", 
			url: ajaxurl, 
			data: {
				'action': 'rexpansive_install_contents',
				'nonce_param': '<?php echo wp_create_nonce( 'install-contents-nonce' ); ?>',
				'data': {
					'request': 'Run install process'
				}
			},
			success: function(data) { 
				console.log(data); 
			}
		});
	}
	document.addEventListener('DOMContentLoaded', dispatch_install);
}(jQuery));
/* ]]> */
</script>
			<?php
		}
	}

	/**
	 *	Register the administration menu for the plugin.
	 *
	 * 	@since    1.0.0
	 *  @version 1.1.3 Adding submenus correctly
	 */
	public function add_plugin_options_menu() {
		add_menu_page( 'Rexpansive Builder', 'Rexpansive Builder', 'manage_options', $this->plugin_name, array( $this, 'display_plugin_options_page' ), REXPANSIVE_BUILDER_URL . 'admin/img/favicon.ico', '80.5' );
		add_submenu_page( $this->plugin_name, 'Settings', 'Settings', 'manage_options', $this->plugin_name );
		add_submenu_page( $this->plugin_name, 'Contact Forms', 'Contact Forms', 'manage_options', 'rxcf7-list', array($this,'display_contact_form_list') );
		add_submenu_page( $this->plugin_name, 'RexSlider', 'RexSlider', 'manage_options', 'edit.php?post_type=rex_slider' );
		add_submenu_page( $this->plugin_name, 'RexModel', 'RexModel', 'manage_options', 'edit.php?post_type=rex_model' );
	}

	/**
	 *	Add settings action link to the plugin page.
	 *
	 * 	@since    1.0.0
	 */
	public function add_action_links( $links ) {
		$settings_link = array(
			'<a href="' . admin_url( 'options-general.php?page=' . $this->plugin_name ) . '">' . __( 'Settings', $this->plugin_name ) . '</a>',
		);
		return array_merge( $settings_link, $links );
	}

	/**
	 *	Register the admin top bar menu for the plugin
	 *
	 *	@since	1.0.0
	 */
	public function add_top_bar_plugin_options_menu() {
		global $wp_admin_bar;
		
		$wp_admin_bar->add_menu( array(
				'id'	=>	'rexpansive-builder-top',
				'title'	=>	__( '<img src="'. REXPANSIVE_BUILDER_URL . 'admin/img/favicon.ico" style="vertical-align:middle;margin-right:5px" alt="Rexpansive Builder" title="Rexpansive Builder" />Rexpansive Builder' ),
				'href'	=>	admin_url( 'options-general.php?page=' . $this->plugin_name )
			)
		);
	}

	/**
	 *	Render the settings page for the plugin
	 *
	 * 	@since    1.0.0
	 */
	public function display_plugin_options_page() {
		include_once( 'partials/rexbuilder-admin-display.php' );
	}

	/**
	 * Render the contact form list with the usefull ready shortcodes
	 *
	 * @return void
	 * @since 1.1.3
	 */
	public function display_contact_form_list() {
		include_once( 'partials/rexbuilder-contact-form-list.php' );
	}

	/**
	 * Including the new sprites for builder 1.0
	 *
	 * @return void
	 * @since 1.1.3
	 */
	public function include_sprites() {
		?><div style="display:none"><?php include_once( REXPANSIVE_BUILDER_PATH .  'admin/sprites/symbol/svg/sprite.symbol.svg' ); ?></div><?php
	}

	/**
	 * Including the sprites for live builder tools
	 *
	 * @since 2.0.0
	 */
	public function include_sprites_live() {
		?><div style="display:none"><?php include_once( REXPANSIVE_BUILDER_PATH .  'admin/sprites-live/symbol/svg/sprite.symbol.svg' ); ?></div><?php
	}

	/**
     * Including eventually custom sprites
     * uploaded on the backend
     *
     * @since 2.0.0
     */
    public function include_custom_sprites() {
    	$upload_dir = wp_upload_dir();
		$uploads_dirname = $upload_dir['basedir'] . '/' . REXPANSIVE_BUILDER_UPLOADS_FOLDER;

        if ( file_exists( $uploads_dirname . '/assets/symbol/sprite.symbol.svg' ) ) 
        {
        ?>
        <div style="display:none"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><?php include_once( $uploads_dirname . '/assets/symbol/sprite.symbol.svg' ); ?></svg></div>
        <?php
        }
    }

    /**
	 * Add the admin tools for the builder live mode
	 * @return null
	 * @since  2.0.0
	 */
   	public function include_live_editing() {
		include_once( 'partials/rexbuilder-live-editing.php' );
    }

    /**
     * Add RexLive class on admin body when editing a page in live mode
     * @param  Array $classes array of admin body classes
     * @return Array          array update
     * @since  2.0.0
     */
    public function rexlive_body_class( $classes ) {
	   $classes .= ' rexpansive-editor ';
	   return $classes;
	}

	/**
	 * Add link to livebuilder directly on the post list
	 * @param Array $actions     array of actions performable by post list
	 * @param WP_Post $post_object WP_Post object for a post
	 * @return Array $actions
	 * @since  2.0.0
	 */
	public function add_builderlive_link( $actions, $post_object ) {
		$page_info = get_current_screen();

		if ( isset( $page_info ) && $this->builder_active_on_this_post_type_list( $page_info->post_type ) ) {
			$actions['rexbuilder'] = '<b><a target="_blank" href="' . admin_url( 'post.php?post=' . $post_object->ID . '&action=edit&rexlive=true' ) . '">REXPANSIVE</a></b>';
		}

		return $actions;
	}

	/**
	 *	Validate the plugin settings
	 *
	 * 	@since    1.0.0
	 */
	public function plugin_options_validate( $input ) {
		$valid = array();

		foreach( $input['post_types'] as $key => $value ) :
			$valid['post_types'][$key] = ( isset( $value ) && !empty( $value ) ) ? 1 : 0;
		endforeach;

		//$valid['post_types'] = $input['post_types'];
		$valid['animation'] = ( isset( $input['animation'] ) && !empty( $input['animation'] ) ) ? 1 : 0;
		$valid['fast_load'] = ( isset( $input['fast_load'] ) && !empty( $input['fast_load'] ) ) ? 1 : 0;

		return $valid;
	}

	/**
	 *	Update the plugin settings
	 *
	 * 	@since    1.0.0
	 */
	public function plugin_options_update() {
		//register_setting( $this->plugin_name, $this->plugin_name, array( $this, 'plugin_options_validate' ) );
		register_setting( $this->plugin_name . '_options', $this->plugin_name . '_options', array( $this, 'plugin_options_validate' ) );
	}

	/**
	 * Instantiate the installer to use during the installation process
	 * @return void
	 * @since  2.0.1
	 */
	public function instantiate_installer() {
		$this->Installer = new Rexbuilder_Installation_Handler();
	}

	/**
	 * Customize the acf url setting to fix incorrect asset URLs.
	 * @param  string $url acf url
	 * @return string
	 * @since  2.0.2
	 */
	public function acf_settings_url( $url ) {
	    return REXPANSIVE_BUILDER_ACF_URL;
	}

	/**
	 * Hide the ACF admin menu item.
	 * @param  bool $show_admin condition
	 * @return bool
	 * @since  2.0.2
	 */
	public function acf_settings_show_admin( $show_admin ) {
	    return false;
	}

	/**
	 * Define ACF custom fields
	 * @return void
	 * @since  2.0.2
	 */
	public function define_acf_fields() {
		if( function_exists("register_field_group") ) {
		    register_field_group(array (
		        'id' => 'acf_rexpansive-slider',
		        'title' => 'Rexpansive Slider',
		        'fields' => array (
		            array (
		                'key' => 'field_564f2373722c3',
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
		                    array (
								'key' => 'field_5b963966471bd',
								'label' => 'Navigator Label',
								'name' => '_rex_slider_nav_label',
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
								'key' => 'field_5b963990471be',
								'label' => 'Navigator Image',
								'name' => '_rex_slider_nav_img',
								'type' => 'image',
								'column_width' => '',
								'save_format' => 'object',
								'preview_size' => 'thumbnail',
								'library' => 'all',
		                    ),
		                    array (
								'key' => 'field_5ba9ef6fef790',
								'label' => 'Hide slide',
								'name' => '_rex_slider_hide_slide',
								'type' => 'checkbox',
								'column_width' => '',
								'choices' => array (
									'hide' => 'Yes',
								),
								'default_value' => '',
								'layout' => 'horizontal',
							),
		                ),
		                'row_min' => '',
		                'row_limit' => '',
		                'layout' => 'row',
		                'button_label' => 'Add Slide',
		            ),
		            array (
		                'key' => 'field_564f1f0c050bc',
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

		$navigation_choices = array(
			'none'			=>	'None',
			// 'horizontal_points' => 'Horizontal Points',
			// 'horizontal_text' => 'Horizontal Text',
			'vertical_points' => 'Vertical Points',
		);

		// if( Rexpansive_Classic_Utilities::is_horizontal_dot_points_active() ) {
		// 	$navigation_choices['horizontal_points'] = 'Horizontal Points';
		// }

		if(function_exists("register_field_group"))
		{
			register_field_group(array (
				'id' => 'acf_internal-navigation',
				'title' => 'Internal Navigation',
				'fields' => array (
					array (
						'key' => 'field_56cb20b3f2432',
						'label' => 'Navigation Type',
						'name' => '_rex_navigation_type',
						'type' => 'select',
						'conditional_logic' => array (
							'status' => 1,
							'rules' => array (
								array (
									'field' => 'null',
									'operator' => '==',
								),
							),
							'allorany' => 'all',
						),
						'choices' => $navigation_choices,
						'default_value' => 'horizontal_points',
						'allow_null' => 0,
						'multiple' => 0,
					),
				),
				'location' => array (
					array (
						array (
							'param' => 'rexpansive_builder',
							'operator' => '==',
							'value' => 1,
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

	/**
	 * Function to pack ACF in the plugin
	 * @param  string $path acf path
	 * @return string
	 * @since 1.0.15
	 * @deprecated 2.0.2 New bundle method
	 */
	public function acf_settings_path( $path ) {
		// update path
		$path = plugin_dir_url( __FILE__ ) . 'lib/acf/advanced-custom-fields/';
		
		// return
		return $path;
	}

	/**
	 * @param  string $dir acf directory
	 * @return  string
	 * @since 1.0.15
	 * @deprecated 2.0.2 New bundle method
	 */
	public function acf_settings_dir( $dir ) {
		// update path
		$dir = plugin_dir_url( __FILE__ ) . 'lib/acf/advanced-custom-fields/';
		
		// return
		return $dir;
	}

	/**
	 * @param  bool $show_admin
	 * @return bool
	 * @since 1.0.15
	 * @deprecated 2.0.2 New bundle method
	 */
	public function acf_hide_menu( $show_admin ) {
		return false;
	}

	/**
	 * ACF Rule Type: Rexpansive Builder
	 *
	 * @param array $choices, all of the available rule types
	 * @return array
	 * @since 1.1.0
	 */
	public function acf_rule_type_rexpansive_builder( $choices ) {
		$choices['Basic']['rexpansive_builder'] = 'Rexpansive Builder';
		return $choices;
	}
	
	/**
	 * ACF Rule Values: Rexpansive Builder
	 *
	 * @param array $choices, available rule values for this type
	 * @return array
	 * @since 1.1.0
	 */
	public function acf_rule_values_rexpansive_builder( $choices ) {
		// Copied from acf/core/controllers/field_group.php
		// @see http://bit.ly/1Xnx44g

		$args = array(
			'posts_per_page' => -1,
			'post_type' => $this->plugin_options['post_types'],
			'meta_query' => array(
				array(
					'key' => '_rexbuilder_active',
					'value' => 'true',
					'compare' => 'LIKE'
				)
			)
		);

		$query = new WP_Query( $args );

		if( $query->have_posts() ) {
			while( $query->have_posts() ) {
				$query->the_post();

				$title = apply_filters( 'the_title', $query->post->post_title, $query->post->ID );
				
				$choices[ $query->post->ID ] = $title;
			}
		}

		return $choices;
	}
	
	/**
	 * ACF Rule Match: Rexpansive Builder
	 *
	 * @param boolean $match, whether the rule matches (true/false)
	 * @param array $rule, the current rule you're matching. Includes 'param', 'operator' and 'value' parameters
	 * @param array $options, data about the current edit screen (post_id, page_template...)
	 * @return boolean $match
	 * @since 1.1.0
	 */
	public function acf_rule_match_rexpansive_builder( $match, $rule, $options ) {
			
		if ( !isset( $options['post_id'] ) || ! $options['post_id'] ) {
			return false;
		}
		
		$builder_active = get_post_meta( $options['post_id'], '_rexbuilder_active', true );
		$has_builder = false;
		if( 'true' == $builder_active ) {
			$has_builder = true;
		}

		if ( '==' == $rule['operator'] ) { 
			$match = $has_builder;
		
		} elseif ( '!=' == $rule['operator'] ) {
			$match = ! $has_builder;
		}
		
		return $match;
	}

	/**
	 *	Add notifier update page
	 *
	 *	@since	1.0.3
	 */
	public function update_notifier_menu() {  
		$xml = $this->get_latest_theme_version(21600); // This tells the function to cache the remote call for 21600 seconds (6 hours)

		if( isset($xml) && $xml ) {
			$theme_data = get_plugin_data( REXPANSIVE_BUILDER_PATH . 'rexpansive-builder.php' ); // Get theme data from style.css (current version is what we want)
			
			if(version_compare($theme_data['Version'], $xml->latest) == -1) {
				add_dashboard_page( $theme_data['Name'] . 'Plugin Updates', $theme_data['Name'] . '<span class="update-plugins count-1"><span class="update-count">Updates</span></span>', 'administrator', strtolower($theme_data['Name']) . '-updates', array( $this, 'update_notifier' ) );
			}
		}
	}

	/**
	 *	Render the page
	 */
	public function update_notifier() { 
		$xml = $this->get_latest_theme_version(21600); // This tells the function to cache the remote call for 21600 seconds (6 hours)
		$theme_data = get_plugin_data( REXPANSIVE_BUILDER_PATH . 'rexpansive-builder.php' ) // Get theme data from style.css (current version is what we want) ?>

		<div class="wrap">
		
			<div id="icon-tools" class="icon32"></div>
			<h2><?php echo $theme_data['Name']; ?> Plugin Updates</h2>
		    <div id="message" class="updated below-h2"><p><strong>There is a new version of the <?php echo $theme_data['Name']; ?> plugin available.</strong> You have version <?php echo $theme_data['Version']; ?> installed. Update to version <?php echo $xml->latest; ?>.</p></div>

		    <h2>Check your email to get the automatic update download link</h2>
	        
	        <!-- <a href="http://rexpansive.neweb.info/download/1450/" class="update-notify-link" title="Update" style="background-image:url(<?php echo WP_PLUGIN_DIR . '/rexpansive-builder/screenshot.png'; ?>);">
	        	<h2>Version <?php echo $xml->latest; ?></h2>
	        	Download this update
	    		<?php 
	    			// echo do_shortcode( '[rexArrow type="download" target="_self" color="#ffffff" link="http://rexpansive.neweb.info/download/1450/" isinsidelink="true"]Download this update[/rexArrow]' ); 
	    		?>
	        </a> -->
	        <!-- <img style="float: left; margin: 0 20px 20px 0; border: 1px solid #ddd;" src="<?php echo WP_PLUGIN_DIR . '/rexpansive-builder/screenshot.png'; ?>" /> -->

	        <div id="instructions" style="max-width: 800px;">
	            <h3>Update Download and Instructions</h3>
	            <p><strong>Please note:</strong> make a <strong>backup</strong> of the Plugin inside your WordPress installation folder <strong>/wp-content/plugins/<?php echo strtolower($theme_data['Name']); ?>/</strong></p>
	            <p>To update the Plugin, login to your account, head over to your <strong>downloads</strong> section and re-download the plugin like you did when you bought it.</p>
	            <p>Extract the zip's contents, look for the extracted plugin folder, and after you have all the new files upload them using FTP to the <strong>/wp-content/plugins/<?php echo strtolower($theme_data['Name']); ?>/</strong> folder overwriting the old ones (this is why it's important to backup any changes you've made to the plugin files).</p>
	            <p>If you didn't make any changes to the plugin files, you are free to overwrite them with the new ones without the risk of losing plugin settings, pages, posts, etc, and backwards compatibility is guaranteed.</p>
	        </div>
	        
	            <div class="clear"></div>
		    
		    <h3 class="title">Changelog</h3>
		    <?php echo $xml->changelog; ?>

		</div>
	    
	<?php }

	// This function retrieves a remote xml file on my server to see if there's a new update 
	// For performance reasons this function caches the xml content in the database for XX seconds ($interval variable)
	public function get_latest_theme_version($interval) {
		// remote xml file location
		$notifier_file_url = 'https://www.neweb.info/notifier-builder-premium.xml';
		
		$db_cache_field = 'rexpansive-builder-premium-notifier-cache';
		$db_cache_field_last_updated = 'rexpansive-builder-premium-notifier-last-updated';
		$last = get_option( $db_cache_field_last_updated );
		$now = time();
		// check the cache
		if ( !$last || (( $now - $last ) > $interval) ) {
			// cache doesn't exist, or is old, so refresh it
			if( function_exists('curl_init') ) { // if cURL is available, use it...
				$ch = curl_init($notifier_file_url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_HEADER, 0);
				curl_setopt($ch, CURLOPT_TIMEOUT, 10);
				curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
				$cache = curl_exec($ch);
				curl_close($ch);
			} else {
				$cache = file_get_contents($notifier_file_url); // ...if not, use the common file_get_contents()
			}

			if ($cache) {			
				// we got good results
				update_option( $db_cache_field, $cache );
				update_option( $db_cache_field_last_updated, time() );			
			}
			// read from the cache file
			$notifier_data = get_option( $db_cache_field );
		}
		else {
			// cache file is fresh enough, so read from it
			$notifier_data = get_option( $db_cache_field );
		}
		
		$xml = simplexml_load_string($notifier_data); 
		
		return $xml;
	}

	/**
	 *	Add a swtich button under the post title/permalink to activate/deactivate the builder
	 *
	 * 	@since    1.0.0
	 * 	@version	2.0.0	Add Go Live button
	 */
	public function add_switch_under_post_title() {
		$page_info = get_current_screen();

		if( isset( $this->plugin_options['post_types'] ) )
		{
			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$page_info->id] ) )
			{
				if( ( $post_to_activate[$page_info->id] == 1 ) && ( $post_to_activate[$page_info->post_type] == 1 ) )
				{
					$builder_active = get_post_meta( get_the_id(), '_rexbuilder_active', true);
					$savedFromBackend = get_post_meta( get_the_id(), '_save_from_backend', true);

					if( $this->is_edit_page('new') ) {
						$builder_active = 'true';
					} else {
						$builder_active = get_post_meta( get_the_id(), '_rexbuilder_active', true);
					}
		?>
		<div class="builder-heading rexpansive-builder rexbuilder-materialize-wrap">
			<img src="<?php echo REXPANSIVE_BUILDER_URL; ?>admin/img/rexpansive-builder.png" alt="logo" width="260" />
			<div class="builder-switch-wrap">
				<div class="switch">
					<label>
						<input type="checkbox" id="builder-switch" <?php checked( 'true', $builder_active ); ?>/>
						<span class="lever"></span>
					</label>
				</div>
			</div>
		</div>
		<div class="live-info-wrap <?php echo ( isset( $savedFromBackend ) && $savedFromBackend == "false" ? ' live-saved' : '' ); ?>">
			<div class="go-live-advice">
				<a id="go-live-client-button" href="<?php echo admin_url( 'post.php?post=' . get_the_id() . '&action=edit&rexlive=true' ); ?>" class="cool-btn cool-bnt--primary go-live<?php echo ( 'auto-draft' == get_post_status(get_the_id()) ? ' ' : '' ); ?>" target="_blank"><?php _e( 'Live', 'rexpansive-builder' ); ?></a>
				<input type="hidden" name="force_live" value="">
				<script>
					;(function ($) {
					'use strict';
					// Waiting until the ready of the DOM
					$(function () {
						$(document).on('click', '.go-live.draft', function(e) {
							e.preventDefault();
							$('#wp-preview').val(true);
							$('input[name=force_live]').val("do_force_live");
							$('#post-preview')
								//.attr('href','<?php echo admin_url( 'post.php?post=' . get_the_id() . '&action=edit&rexlive=true' ); ?>')
								.trigger('click');
							$('input[name=force_live]').val("");
						});
					});
					})(jQuery);
	
				</script>
			</div>
			<?php
?>
<input type="hidden" name="builder-save-from-backend" value="<?php echo $savedFromBackend; ?>"><?php
if( isset( $savedFromBackend ) && $savedFromBackend == "false" ) {
?>
<div class="go-live-advice">
	<p><?php _e( "You saved from the live builder, now you can not change the page content from the old builder.",  "rexpansive" ); ?></p>
</div>
<?php
}
			?>
		</div>
		<?php
				}
			}
		}
	}

	/**
	 * Change the default preview URL to correctly open the editor
	 *
	 * @param string $url
	 * @return string $url
	 * @since 1.1.0
	 *
	 */

	public function change_preview_url( $url ) {
		if( isset( $_POST['wp-preview'] ) && "dopreview" == $_POST['wp-preview'] && isset( $_POST['force_live'] ) && "do_force_live" == $_POST['force_live'] ) {
			return admin_url( 'post.php?post=' . get_the_id() . '&action=edit&rexlive=true' );
		}
		return $url;
	}

	/**
	 * Create the variuos modal editors of the builder.
	 *
	 * @since    1.0.0
	 */
	public function create_builder_modals() {
		$page_info = get_current_screen();

		if ( !current_user_can('edit_posts') &&  !current_user_can('edit_pages') ) { 
			return; 
		}
		if( !isset( $this->plugin_options['post_types'] ) ) {
			return;
		}
		if ( get_user_option('rich_editing') == 'true') { 
			if( $this->builder_active_on_this_post_type( $page_info ) ) {
				if( isset( $_GET['rexlive'] ) && 'true' == $_GET['rexlive'] ) {
					include_once( 'partials/rexlive-modals-display.php' );
				} else {
					include_once( 'partials/rexbuilder-modals-display.php' );
				}
			}
		}
	}

	/**
	 * Create the templates for the builder used by the scripts.
	 *
	 * @since    1.0.0
	 */
	public function create_builder_templates() {
		$page_info = get_current_screen();

		if( $this->builder_active_on_this_post_type( $page_info ) ) {
			include_once( 'partials/rexbuilder-templates.php' );
		}
	}

	/**
	 * Check if the builder is active on an admin page
	 *
	 * @param Object $page_info
	 * @return bool
	 * @since 1.1.3
	 */
	public function builder_active_on_this_post_type( $page_info ) {
		$active = false;
		if( isset( $this->plugin_options['post_types'] ) ) {

			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$page_info->id] ) ) { 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) {
					$active = true;
				}
			}
		}

		return apply_filters( 'rexbuilder_admin_post_type_active', $active );
	}

	/**
	 * Check if the builder is active on an admin list of generic posts
	 *
	 * @param String $post_type
	 * @return Bool
	 * @since 2.0.0
	 * @date 22-05-2019
	 */
	public function builder_active_on_this_post_type_list( $post_type ) {
		$active = false;
		if( isset( $this->plugin_options['post_types'] ) ) {

			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$post_type] ) && $post_to_activate[$post_type] == 1 ) { 
				$active = true;
			}
		}
		return $active;
	}

	/**
	 * Enqueuing the assets of the builder on the contact form custom page
	 * to add some functionallities (like modals)
	 *
	 * @param bool $active
	 * @return bool
	 */
	public function add_builder_assets_on_contact_form_page( $active ) {
		if(is_admin() && isset($_GET['page']) && 'rxcf7-list' == $_GET['page']) {
			return true;
		}
		return $active;
	}

	/**
	 * Install the default contents of the builder
	 * @return JSON response
	 * @since  2.0.0
	 */
	public function rexpansive_install_contents() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'install-contents-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$response['request'] = $_POST['data']['request'];

		// If there is data to send to the installer, from here
		// $this->Installer->data( $response['request'] );

		// create installation queue
		require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-installation.php';
		$post_count = Rexbuilder_Installation::import_models_resources();
		$index = 0;

		$this->Installer->push_to_queue( array( 'task' => 'create_icons_folder' ) );
		$this->Installer->push_to_queue( array( 'task' => 'import_buttons' ) );
		$this->Installer->push_to_queue( array( 'task' => 'import_icons' ) );
		
		if ( 0 !== $post_count ) {
			$this->Installer->push_to_queue( array( 'task' => 'import_models_start' ) );

			while ( $index < $post_count ) {
				$this->Installer->push_to_queue( array( 
					'task' => 'import_models_interval', 
					'args' => array( 
						'start' => $index, 
						'end' => $index + 10 
					) 
				) );
				$index = $index + 10;
			}

			$this->Installer->push_to_queue( array( 'task' => 'import_models_end' ) );
		}

		// dispatch the installation process
		$this->Installer->save()->dispatch();

		$response['result'] = 'dispatched';

		wp_send_json_success( $response );
	}

	/**
	 * Saving custom sprites to reuse with live builder
	 *
	 * @since 2.0.0
	 */
	public function rexpansive_upload_sprite_icons() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'upload-icons-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		// get the optimized sprites
		$sprites = $_REQUEST['sprites'];

        if ( ! empty( $sprites ) ) {
            $spritesStripped = stripslashes( $sprites );
            $spritesData = json_decode( $spritesStripped, true );

            $upload_dir = wp_upload_dir();
			$uploads_dirname = $upload_dir['basedir'] . '/' . REXPANSIVE_BUILDER_UPLOADS_FOLDER;

            $response['path'] = $uploads_dirname . '/assets/symbol/sprite.symbol.svg';
            $response['path_ids'] = $uploads_dirname . '/assets/sprite-list.json';

            // get sprite ids JSON
            if ( file_exists( $response['path_ids'] ) )
            {
            	$sprite_list = file_get_contents( $response['path_ids'] );
            	$symbolsIdJSON = json_decode( $sprite_list, true );
            }
            else
            {
	         	$symbolsIdJSON = array(
	         		'l-svg-icons' => array()
	         	);
            }
         
            $symbolsHTML = '';

            foreach ($spritesData as $index => $spriteData) {
            	// prevent duplicates
            	if ( false === array_search( $spriteData['id'], $symbolsIdJSON['l-svg-icons']) ) {
	            	$symbolsHTML .= $spriteData['data'];
	            	array_push( $symbolsIdJSON['l-svg-icons'], $spriteData['id'] );
            	}
            }

            $response['ids'] = $symbolsIdJSON;

            // save svg symbols
            $symbolFile = fopen( $response['path'], 'a') or die( "Unable to open file!" );
            fwrite( $symbolFile, $symbolsHTML );
            fclose( $symbolFile );

            // save id list
            $listFile = fopen( $response['path_ids'], 'w') or die( "Unable to open file!" );
			fwrite( $listFile, json_encode( $symbolsIdJSON ) );
            fclose( $listFile );
        }

		wp_send_json_success( $response );
	}

	/**
	 * Removing custom sprites icons
	 *
	 * @since 2.0.0
	 */
	public function rexpansive_remove_sprite_icons() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'upload-icons-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		// get the optimized sprites
		$deleteList = $_REQUEST['deleteList'];

        if ( ! empty( $deleteList ) ) {
            $deleteListStripped = stripslashes( $deleteList );
            $deleteListData = json_decode( $deleteListStripped, true );

            $upload_dir = wp_upload_dir();
			$uploads_dirname = $upload_dir['basedir'] . '/' . REXPANSIVE_BUILDER_UPLOADS_FOLDER;

            $response['path'] = $uploads_dirname . '/assets/symbol/sprite.symbol.svg';
            $response['path_ids'] = $uploads_dirname . '/assets/sprite-list.json';

            // get sprite ids JSON
            if ( file_exists( $response['path_ids'] ) && file_exists( $response['path'] ) )
            {
            	$sprite_list = file_get_contents( $response['path_ids'] );
            	$symbolsIdJSON = json_decode( $sprite_list, true );

            	$spriteDefinitions = file_get_contents( $response['path'] );

	            foreach ( $deleteListData as $key ) {
	            	// remove symbol
	            	$re = '/<\s*symbol[^>]*id="' . $key . '"[^>]*>(?:.*?)<\s*\/\s*symbol>/m';
	            	$spriteDefinitions = preg_replace( $re, '', $spriteDefinitions );

	            	// remove index
	            	$idxDel = array_search( $key, $symbolsIdJSON['l-svg-icons'] );
	            	array_splice( $symbolsIdJSON['l-svg-icons'], $idxDel, 1 );
	            }

	            $response['ids'] = $symbolsIdJSON;
	            $response['deleteList'] = $deleteListData;

	            // save svg symbols
	            $symbolFile = fopen( $response['path'], 'w') or die( "Unable to open file!" );
	            fwrite( $symbolFile, $spriteDefinitions );
	            fclose( $symbolFile );

	            // save id list
	            $listFile = fopen( $response['path_ids'], 'w') or die( "Unable to open file!" );
				fwrite( $listFile, json_encode( $symbolsIdJSON ) );
	            fclose( $listFile );
	        }
	        else
	        {
	        	$response['msg'] = 'No sprites!';
				wp_send_json_error( $response );
	        }
        }

		wp_send_json_success( $response );
	}
	
	/**
	 * Saving a palette color to reuse it around the pages
	 * @since 2.0.0
	 */
	public function rex_save_palette_color() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$data = $_POST['data'];
		$color_palette = get_option( '_rex_color_palette', array() );
		$color_palette[$data['ID']] = $data['color'];
		$response['data'] = $color_palette;
		update_option( '_rex_color_palette', $color_palette );

		wp_send_json_success( $response );
	}

	/**
	 * Delete a color palette color
	 * @since 2.0.0
	 */
	public function rex_delete_palette_color() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$data = $_POST['data'];
		$color_palette = get_option( '_rex_color_palette', array() );
		if( !empty( $color_palette ) ) {
			unset( $color_palette[$data['ID']] );
			$response['data'] = $color_palette;
			update_option( '_rex_color_palette', $color_palette );
		}

		wp_send_json_success( $response );
	}

	/**
	 * Saving a palette color to reuse it around the pages
	 * @since 2.0.0
	 */
	public function rex_save_palette_overlay_color() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$data = $_POST['data'];
		$overlay_palette = get_option( '_rex_overlay_palette', array() );
		$overlay_palette[$data['ID']] = $data['overlay'];
		$response['data'] = $overlay_palette;
		update_option( '_rex_overlay_palette', $overlay_palette );

		wp_send_json_success( $response );
	}

	/**
	 * Delete a color palette color
	 * @since 2.0.0
	 */
	public function rex_delete_palette_overlay_color() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$data = $_POST['data'];
		$overlay_palette = get_option( '_rex_overlay_palette', array() );
		if( !empty( $overlay_palette ) ) {
			unset( $overlay_palette[$data['ID']] );
			$response['data'] = $overlay_palette;
			update_option( '_rex_overlay_palette', $overlay_palette );
		}

		wp_send_json_success( $response );
	}

	/**
	 * Saving a gradient palette color to reuse it around the pages
	 * @since 2.0.0
	 */
	public function rex_save_palette_gradient() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$data = $_POST['data'];
		$gradient_palette = get_option( '_rex_color_gradient_palette', array() );
		$gradient_palette[$data['ID']] = $data['gradient'];
		$response['data'] = $gradient_palette;
		update_option( '_rex_color_gradient_palette', $gradient_palette );

		wp_send_json_success( $response );
	}

	/**
	 * Delete a gradient palette color
	 * @since 2.0.0
	 */
	public function rex_delete_palette_gradient() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$data = $_POST['data'];
		$gradient_palette = get_option( '_rex_color_gradient_palette', array() );
		if( !empty( $gradient_palette ) ) {
			unset( $gradient_palette[$data['ID']] );
			$response['data'] = $gradient_palette;
			update_option( '_rex_color_gradient_palette', $gradient_palette );
		}

		wp_send_json_success( $response );
	}

	/**
	 * Saving a gradient palette color to reuse it around the pages
	 * @since 2.0.0
	 */
	public function rex_save_palette_overlay_gradient() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$data = $_POST['data'];
		$gradient_palette = get_option( '_rex_overlay_gradient_palette', array() );
		$gradient_palette[$data['ID']] = $data['gradient'];
		$response['data'] = $gradient_palette;
		update_option( '_rex_overlay_gradient_palette', $gradient_palette );

		wp_send_json_success( $response );
	}

	/**
	 * Delete a gradient palette color
	 * @since 2.0.0
	 */
	public function rex_delete_palette_overlay_gradient() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$data = $_POST['data'];
		$gradient_palette = get_option( '_rex_overlay_gradient_palette', array() );
		if( !empty( $gradient_palette ) ) {
			unset( $gradient_palette[$data['ID']] );
			$response['data'] = $gradient_palette;
			update_option( '_rex_overlay_gradient_palette', $gradient_palette );
		}

		wp_send_json_success( $response );
	}

	/**
	 * Ajax function to get the CF7 enhanced shortcode
	 * 
	 * @since 1.1.3
	 * @return JSON
	 */
	public function rex_get_rxcf() {
		$nonce = $_GET['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$form_data = $_GET['cf_data'];

		if ( empty( $form_data ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error 1!';
			wp_send_json_error( $response );
		}

		$response['data'] = $form_data;

		$cf_scode = get_post_meta( $form_data['id'], '_cf7_enhanced_shortcode', true );

		if( empty( $cf_scode ) ) {
			$cf_scode = '[contact-form-7 id="'. $form_data['id'] . '" title="' . get_the_title( $form_data['id'] ) . '"]';
		}

		$response['shortcode'] = $cf_scode;

		wp_send_json_success( $response );
	}

	/**
	 * Ajax function to save the CF7 enhanced shortcode
	 * 
	 * @since 1.1.3
	 * @return JSON
	 */
	public function rex_save_rxcf() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$form_data = $_POST['cf_data'];

		if ( empty( $form_data ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error 1!';
			wp_send_json_error( $response );
		}

		$response['data'] = $form_data;
		$response['saving'] = update_post_meta( $form_data['id'], '_cf7_enhanced_shortcode', $form_data['shortcode'] );

		wp_send_json_success( $response );
	}

	/**
	 * Function that adds the scripts for the handle of the custom buttons.
	 *
	 * @since    1.0.0
	 */
	public function rexbuilder_add_tinymce_plugin( $plugin_array ) {
		$plugin_array['rexbuilder_textfill_button'] = REXPANSIVE_BUILDER_URL . 'admin/js/textfill-button.js';
		//$plugin_array['rexbuilder_animation_button'] = REXPANSIVE_BUILDER_URL . 'admin/js/animation-button.js';
		$plugin_array['rexbuilder_embed_video_button'] = REXPANSIVE_BUILDER_URL . 'admin/js/embed-video.js';
		return $plugin_array;
	}

	/**
	 * Function that registers the new custom buttons.
	 *
	 * @since    1.0.0
	 */
	public function rexbuilder_register_custom_buttons( $buttons ) {
		array_push( $buttons, 'rexbuilder_textfill_button' );
		//array_push( $buttons, 'rexbuilder_animation_button' );
		array_push( $buttons, 'rexbuilder_embed_video_button' );
		return $buttons;
	}


	public function rexbuilder_add_custom_buttons() {
		global $typenow;
		if ( !current_user_can('edit_posts') &&  !current_user_can('edit_pages') ) { 
			return; 
		}
		if( ! array_key_exists( 'post_types', $this->plugin_options) ) {
			return;
		}
		if( ! array_key_exists( $typenow, $this->plugin_options['post_types'] ) ) {
			return;
		}
		if ( get_user_option('rich_editing') == 'true') { 
			add_filter('mce_external_plugins', array( $this, 'rexbuilder_add_tinymce_plugin' ) ); 
			add_filter('mce_buttons', array( $this, 'rexbuilder_register_custom_buttons' ) ); 
		}
	}

	/**
	 *	Ajax call to save the builder activate/deactive status
	 *	Used in Gutenberg envinronment
	 *
	 *	@since 2.0.0
	 */
	public function rex_change_builder_activation_status() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
			$response['error'] = true;
			$response['msg'] = 'Error!0';
			wp_send_json_error( $response );
		endif;

		if( !isset( $_POST['post_id'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!1';
			wp_send_json_error( $response );
		}

		if( !isset( $_POST['status'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!2';
			wp_send_json_error( $response );
		}

		$response['status'] = $_POST['status'];

		$response['result'] = update_post_meta( $_POST['post_id'] ,"_rexbuilder_active", $_POST['status'] );		

		wp_send_json_success( $response );
	}

	/**
	*	Retrieve the markup to display the slider on the rexbuilder
	*
	*	@since 1.0.17
	*/
	public function rex_create_rexslider_admin_markup() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
			$response['error'] = true;
			$response['msg'] = 'Error!';
			echo json_encode( $response );
			die();
		endif;

		$slider_id = $_POST['slider_id'];

		if( $slider_id ) {
			if( Rexbuilder_Utilities::check_post_exists( (int)$slider_id ) ) {

				$slider_animation = get_field( '_rex_enable_banner_animation', $slider_id );
				$slider_prev_next = get_field( '_rex_enable_banner_prev_next', $slider_id );
				$slider_dots = get_field( '_rex_enable_banner_dots', $slider_id );

				$rexslider_attrs = array(
					'auto_start' => ( is_array( $slider_animation ) ? 'true' : ( "0" == $slider_animation ? 'true' : 'false' ) ),
					'prev_next' => ( is_array( $slider_prev_next ) ? 'true' : ( "0" == $slider_prev_next ? 'true' : 'false' ) ),
					'dots' => ( is_array( $slider_dots ) ? 'true' : ( "0" == $slider_dots ? 'true' : 'false' ) ),
				);

				$slider_gallery = get_field( '_rex_banner_gallery', (int)$slider_id );

				$response['gallery_field'] = $slider_gallery;

				$slides_markup = "";

				$re = '/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';

				foreach( $slider_gallery as $j => $slide ) {

					$slide_content = $slide['_rex_banner_gallery_image_title'];
					$slide_content = preg_replace('/^<\/p>/', '', $slide_content);
					$slide_content = preg_replace('/<p>+$/', '', $slide_content);

					$video_type = "";
					$video_info_data = "";

					//youtube
					if( false !== strpos( $slide['_rex_banner_gallery_video'], "youtu" ) ) {
						$video_type = 'youtube';
						$video_info_data = $slide['_rex_banner_gallery_video'];
					//vimeo
					} else if( false !== strpos( $slide['_rex_banner_gallery_video'], "vimeo" ) ) {
						$video_type = 'vimeo';
						$video_info_data = $slide['_rex_banner_gallery_video'];
					//mp4
					} else if( $slide['_rex_banner_gallery_video_mp4'] ) {
						$video_type = 'mp4';
						$video_info_data = $slide['_rex_banner_gallery_video_mp4']['id'];
						$video_info_url = $slide['_rex_banner_gallery_video_mp4']['url'];
					}

					ob_start();
	?>
<div class="col rex-slider__slide rex-modal-content__modal-area__row" data-slider-slide-id="<?php echo $j ?>" data-block_type="slide">
	<div class="valign-wrapper space-between-wrapper">
		<button class="rex-slider__slide-index btn-circle btn-small btn-bordered grey-border border-darken-2 waves-effect waves-light white grey-text text-darken-2"><?php echo esc_attr( $j + 1 ); ?></button>

		<div class="rex-button-with-plus">
			<button class="rex-slider__slide-edit rex-slider__slide__image-preview btn-floating waves-effect waves-light tooltipped grey darken-2<?php echo ( isset( $slide['_rex_banner_gallery_image']['url'] ) ? ' rex-slider__slide__image-preview--active' : '' ); ?>" value="edit-slide" data-position="bottom" data-tooltip="<?php _e( 'Slide', 'rexpansive-builder' ); ?>" <?php echo ( isset( $slide['_rex_banner_gallery_image']['url'] ) ? 'style="background-image:url(' . $slide['_rex_banner_gallery_image']['url'] . ');"' : '' ); ?>>
				<i class="material-icons rex-icon">p</i>
			</button>
			<button class="rex-slider__slide-edit rex-plus-button btn-floating light-blue darken-1 tooltipped" value="add-slide" data-position="bottom" data-tooltip="<?php _e( 'Select Image', 'rexpansive-builder' ); ?>">
				<i class="material-icons">&#xE145;</i>
			</button>
		</div>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2<?php echo ( !empty( $slide_content ) ? ' rex-slider__slide-edit__field-active-notice' : '' ); ?>" value="text" data-position="bottom" data-tooltip="<?php _e( 'Text', 'rexpansive-builder' ); ?>">
			<i class="material-icons rex-icon">u</i>
		</button>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2<?php echo ( !empty( $video_info_data ) ? ' rex-slider__slide-edit__field-active-notice' : '' ); ?>" value="video" data-position="bottom" data-tooltip="<?php _e( 'Video', 'rexpansive-builder' ); ?>">
			<i class="material-icons">play_arrow</i>
		</button>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2<?php echo ( !empty( $slide['_rex_banner_gallery_url'] ) ? ' rex-slider__slide-edit__field-active-notice' : '' ); ?>" value="url" data-position="bottom" data-tooltip="<?php _e( 'Link', 'rexpansive-builder' ); ?>">
			<i class="material-icons rex-icon">l</i>
		</button>

		<div>
			<button class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="copy" data-tooltip="<?php _e('Copy slide', 'rexpansive-builder'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE14D;</i>
			</button>

			<div class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="move" data-tooltip="<?php _e('Move slide', 'rexpansive-builder'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
			</div>

			<button class="rex-slider__slide-edit btn-flat tooltipped" value="delete" data-position="bottom" data-tooltip="<?php _e('Delete slide', 'rexpansive-builder'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE5CD;</i>
			</button>
		</div>
	</div>

	<div class="rex-slider__slide-data" style="display:none;">
		<input type="hidden" name="rex-slider--slide-id" value="<?php echo ( isset( $slide['_rex_banner_gallery_image']['id'] ) ? $slide['_rex_banner_gallery_image']['id'] : '' ); ?>">
		<textarea rows="" cols="" name="rex-slider--slide-text"><?php echo esc_textarea( $slide_content ); ?></textarea>
		<input type="hidden" name="rex-slider--slide-video-url" value="<?php echo ( isset( $video_info_data ) ? $video_info_data : '' ); ?>" <?php echo isset($video_info_url)? "data-mp4-url=\"". $video_info_url ."\"":"" ?>>
		<input type="hidden" name="rex-slider--slide-video-type" value="<?php echo ( isset( $video_type ) ? $video_type : '' ); ?>">
		<input type="hidden" name="rex-slider--slide-url" value="<?php echo ( isset( $slide['_rex_banner_gallery_url'] ) ? esc_url( $slide['_rex_banner_gallery_url'] ) : '' ); ?>">
		<input type="hidden" name="rex-slider--slide-video-audio" value="<?php echo ( is_array( $slide['_rex_banner_gallery_video_audio'] ) ? 'true' : '' ); ?>">
	</div>
</div>
	<?php
					$slides_markup .= ob_get_clean();
				}
			}
		}

		$response['rexslider_attrs'] = $rexslider_attrs;
		$response['slides_markup'] = $slides_markup;
		$response['slider'] = array(
			'title' => get_the_title($slider_id)
		);

		wp_send_json_success( $response );
	}

	/**
	 *	Ajax call to create a rex_slider from the builder
	 *
	 *	@since 1.0.15
	 */
	public function rex_create_slider_from_builder() {
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

		if( !isset( $_POST['slider_data'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$args = array(
			'comment_status'	=>	'closed',
			'ping_status'		=>	'closed',
			'post_title'		=>	$_POST['sliderTitle'],
			'post_status'		=>	'publish',
			'post_type'		=>	'rex_slider'
		);
		
		$slider_id_insert = wp_insert_post( $args );

		if( $slider_id_insert != 0) {
			$slider_settings = $_POST['slider_data'];
			// Create the page
			$response['slider_id'] = $slider_id_insert;
			$response['slider_title'] = $args['post_title'];
			// adding the information for the slide
			$response['add_results'] = self::add_slider_fields( $slider_settings, $response['slider_id'] );
		} else {
			$response['slider_id'] = -1;
			$response['slider_title'] = "";
			// The page exists
		} // end if

		$response['args'] = $args;

		wp_send_json_success( $response );
	}

	/**
	*	Ajax call to edit a rex_slider from the builder
	*
	*	@since 1.0.15
	*/
	public function rex_edit_slider_from_builder() {
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

		if( !isset( $_POST['slider_data'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$slider_to_edit = (int)$_POST['slider_id'];

		if( Rexbuilder_Utilities::check_post_exists( $slider_to_edit ) ) {

			$slider_settings = $_POST['slider_data'];

			$new_slider_title = $_POST['sliderTitle'];
			$argsSlider = array(
				'ID'           => $slider_to_edit,
				'post_title'   => $new_slider_title
			);
			wp_update_post( $argsSlider );

			$response['slider_id'] = $slider_to_edit;
			$response['slider_title'] = $new_slider_title;

			self::clear_slider_fields( array(
				'field_564f1f0c050be',
				'field_5948cb2270b0f',
				'field_564f2373722c3',
			), $slider_to_edit );

			$response['edit_results'] = self::add_slider_fields( $slider_settings, $slider_to_edit );
		} else {
			$response['slider_id'] = -1;
			$response['slider_title'] = '';
		}

		wp_send_json_success( $response );
	}

	/**
	*	Save a rex slider
	*
	*	@param 	Multidimensional Array 	array of fields
	*	@param int 						rex slider id
	*/
	private static function add_slider_fields( $slider_settings, $slider_id ) {
		$result = array();

		if( "true" == $slider_settings['settings']['auto_start'] ) {
			update_field( 'field_564f1f0c050bc', array( "yes" ) ,$slider_id );
		} else {
			update_field( 'field_564f1f0c050bc', "" ,$slider_id );
		}

		if( "true" == $slider_settings['settings']['prev_next'] ) {
			update_field( 'field_5948caf770b0e', array( "yes" ) ,$slider_id );
		} else {
			update_field( 'field_5948caf770b0e', "" ,$slider_id );
		}

		if( "true" == $slider_settings['settings']['dots'] ) {
			update_field( 'field_5948cb2270b0f', array( "yes" ) ,$slider_id );
		} else {
			update_field( 'field_5948cb2270b0f', "" , $slider_id );
		}

		$result['slides_settings'] = $slider_settings['slides'];

		if( $slider_settings['slides'] ) {
			// update_field( '_rex_banner_gallery', count( $slider_settings['slides'] ), $slider_id );
			$slides_field_key = 'field_564f2373722c3';
			$values = array();

			foreach( $slider_settings['slides'] as $key => $slide ) {

				$slide_values = array(
					'field_5675394f2fa0f' => "",	// image
					'field_567539852fa11' => "",	// text
					'field_580e08d79f9db' => "",	// video url
					'field_5948ca17a1bb8' => "",	// video resource
					'field_5948eb01358e1' => "",	// audio
					'field_594a186edc532' => "", // block url
				);

				if( isset( $slide['slide_image_id'] ) ) {
					$slide_values['field_5675394f2fa0f'] = $slide['slide_image_id'];
				}

				if( isset( $slide['slide_text'] ) ) {
					$slide_values['field_567539852fa11'] = $slide['slide_text'];
				}

				if( isset( $slide['slide_video_type'] ) ) {
					switch( $slide['slide_video_type'] ) {
						case 'youtube':
						case 'vimeo':
							if( isset( $slide['slide_video'] ) ) {
								$slide_values['field_580e08d79f9db'] = $slide['slide_video'];
							}
							break;
						case 'mp4':
							if( isset( $slide['slide_video'] ) ) {
								$slide_values['field_5948ca17a1bb8'] = $slide['slide_video'];
							}
							break;
						default:
							break;
					}
				}

				if( isset( $slide['slide_url'] ) ) {
					$slide_values['field_594a186edc532'] = $slide['slide_url'];
				} else {
					$slide_values['field_594a186edc532'] = "";
				}

				if( "true" == $slide['slide_video_audio'] ) {
					$slide_values['field_5948eb01358e1'] = array( "yes" );
				} else {
					$slide_values['field_5948eb01358e1'] = "";
				}
				
				array_push( $values, $slide_values );
			}

			$result['values'] = $values;
			$result['slider_id'] = $slider_id;

			update_field( $slides_field_key, $values , $slider_id );
		}

		return $result;
	}

	/**
	*	Clear a slider from its fields, based on an array of fields and the post id
	*
	*	@param Array 	array of fields keys
	*	@param int 		rex slider id
	*/
	private static function clear_slider_fields( $fields, $slider_id ) {
		foreach( $fields as $field ) {
			delete_field( $field, $slider_id );
		}
	}

	/**
	 * Cloning a slider
	 * @param  Integer $original_slider_id original slider id
	 * @return Integer                     new slider id
	 * @since  2.0.3
	 */
	private static function clone_slider( $original_slider_id ) {
		$new_slider_title = get_the_title( $original_slider_id ) . '_' . date( 'YmdHis', time() );

		// create the cloned rexslider object
		$args = array(
			'comment_status'	=>	'closed',
			'ping_status'		=>	'closed',
			'post_title'		=>	$new_slider_title,
			'post_status'		=>	'publish',
			'post_type'			=>	'rex_slider'
		);
		
		$new_slider_id = wp_insert_post( $args );

		if ( 0 === $new_slider_id ) {
			return $new_slider_id;
		}

		// find all the metakeys that belongs to the slider
		// and add them to the new slider
		global $wpdb;
		$slider_definition = $wpdb->get_results(
			$wpdb->prepare( 
				"
				SELECT * 
				FROM {$wpdb->prefix}postmeta 
				WHERE post_id = %d AND 
				meta_key LIKE '%_rex_%'
				",
				$original_slider_id
			),
			ARRAY_A
		);

		foreach( $slider_definition as $meta ) {
			update_post_meta( $new_slider_id, $meta['meta_key'], maybe_unserialize( $meta['meta_value'] ) );
		}

		return $new_slider_id;
	}

	/**
	 * Define Slider Custom Post Type
	 *
	 *	@since 1.0.15
	 *	@version 	1.1.2 	Hide the default admin menu
	 */
	public function rexpansive_slider_definition() {
		$labels = array(
			'name'                => _x( 'RexSliders', 'Post Type General Name', 'rexpansive-builder' ),
			'singular_name'       => _x( 'RexSlider', 'Post Type Singular Name', 'rexpansive-builder' ),
			'menu_name'           => __( 'RexSlider', 'rexpansive-builder' ),
			'name_admin_bar'      => __( 'RexSlider', 'rexpansive-builder' ),
			'parent_item_colon'   => __( 'Parent RexSlider:', 'rexpansive-builder' ),
			'all_items'           => __( 'All RexSliders', 'rexpansive-builder' ),
			'add_new_item'        => __( 'Add New RexSlider', 'rexpansive-builder' ),
			'add_new'             => __( 'Add New', 'rexpansive-builder' ),
			'new_item'            => __( 'New RexSlider', 'rexpansive-builder' ),
			'edit_item'           => __( 'Edit RexSlider', 'rexpansive-builder' ),
			'update_item'         => __( 'Update RexSlider', 'rexpansive-builder' ),
			'view_item'           => __( 'View RexSlider', 'rexpansive-builder' ),
			'search_items'        => __( 'Search RexSlider', 'rexpansive-builder' ),
			'not_found'           => __( 'RexSlider not found', 'rexpansive-builder' ),
			'not_found_in_trash'  => __( 'RexSlider not found in Trash', 'rexpansive-builder' ),
		);
		$args = array(
			'label'               => __( 'rex_slider', 'rexpansive-builder' ),
			'description'         => __( 'RexSlider', 'rexpansive-builder' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'page-attributes' ),
			'taxonomies'          => array( 'rex_slider_taxonomy' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => false,
			'menu_position'       => 250,
			'menu_icon'           => 'dashicons-format-gallery',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => false,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => false,
			'capability_type'     => 'page',
		);
		register_post_type( 'rex_slider', $args );
	}

	// ADD shortcode column
	function rexpansive_slider_columns_head_add_column($defaults) {
		$defaults['rex_slider_shortcode'] = 'Slider Shortcode';
		return $defaults;
	}

	function rexpansive_slider_columns_reorder($defaults) {
		return array(
			'cb' => '<input type="checkbox"/>',
			'title' => __('Title'),
			'rex_slider_shortcode' => __('Slider Shortcode', 'rexpansive'),
			'date' => __('Date')
		);
	}

	function rexpansive_slider_columns_content($column_name, $post_ID) {
		if ($column_name == 'rex_slider_shortcode') {
			if( $post_ID ) {
				echo '<span class="shortcode">';
				echo '<input type="text" onfocus="this.select();" readonly="readonly" value=\'[RexSlider slider_id="' . $post_ID . '"]\' class="large-text code">';
				echo '</span>';
			}
		}
	}

	/**
	 * Registering Custom Post Meta
	 * Necessary to expose some metas to the Rest API
	 * @since 2.0.0
	 */
	function define_custom_post_metas() {
		register_meta( 'post', '_rexbuilder_active', array(
			'show_in_rest' => true
		));
	}

	/**
	 *	Define the Models Custom Post Type
	 *
	 *	@since 	1.1.2
	 */
	public function rexpansive_models_defintion() {
		$labels = array(
			'name'                  => _x( 'RexModels', 'Post Type General Name', 'rexpansive-builder' ),
			'singular_name'         => _x( 'RexModel', 'Post Type Singular Name', 'rexpansive-builder' ),
			'menu_name'             => __( 'RexModel', 'rexpansive-builder' ),
			'name_admin_bar'        => __( 'RexModel', 'rexpansive-builder' ),
			'archives'              => __( 'RexModel Archives', 'rexpansive-builder' ),
			'attributes'            => __( 'RexModel Attributes', 'rexpansive-builder' ),
			'parent_item_colon'     => __( 'Parent RexModel:', 'rexpansive-builder' ),
			'all_items'             => __( 'All RexModels', 'rexpansive-builder' ),
			'add_new_item'          => __( 'Add New RexModel', 'rexpansive-builder' ),
			'add_new'               => __( 'Add New', 'rexpansive-builder' ),
			'new_item'              => __( 'New RexModel', 'rexpansive-builder' ),
			'edit_item'             => __( 'Edit RexModel', 'rexpansive-builder' ),
			'update_item'           => __( 'Update RexModel', 'rexpansive-builder' ),
			'view_item'             => __( 'View RexModel', 'rexpansive-builder' ),
			'view_items'            => __( 'View RexModels', 'rexpansive-builder' ),
			'search_items'          => __( 'Search RexModel', 'rexpansive-builder' ),
			'not_found'             => __( 'RexModel Not found', 'rexpansive-builder' ),
			'not_found_in_trash'    => __( 'RexModel Not found in Trash', 'rexpansive-builder' ),
			'featured_image'        => __( 'Featured Image', 'rexpansive-builder' ),
			'set_featured_image'    => __( 'Set featured image', 'rexpansive-builder' ),
			'remove_featured_image' => __( 'Remove featured image', 'rexpansive-builder' ),
			'use_featured_image'    => __( 'Use as featured image', 'rexpansive-builder' ),
			'insert_into_item'      => __( 'Insert into item', 'rexpansive-builder' ),
			'uploaded_to_this_item' => __( 'Uploaded to this item', 'rexpansive-builder' ),
			'items_list'            => __( 'RexModels list', 'rexpansive-builder' ),
			'items_list_navigation' => __( 'RexModels list navigation', 'rexpansive-builder' ),
			'filter_items_list'     => __( 'Filter items list', 'rexpansive-builder' ),
		);
		$args = array(
			'label'                 => __( 'RexModel', 'rexpansive-builder' ),
			'description'           => __( 'RexModel', 'rexpansive-builder' ),
			'labels'                => $labels,
			'supports'              => array( 'title', 'editor', 'revisions', 'thumbnail'),
			'taxonomies'            => array( 'rex_model_taxonomy' ),
			'hierarchical'          => false,
			'public'                => true,
			'show_ui'               => true,
			'show_in_menu'          => false,
			'menu_position'         => 65,
			'show_in_admin_bar'     => true,
			'show_in_nav_menus'     => false,
			'can_export'            => true,
			'has_archive'           => false,
			'exclude_from_search'   => true,
			'publicly_queryable'    => true,
			'capability_type'       => 'page',
		);
		register_post_type( 'rex_model', $args );
	}

    /**
     * Saving custom layouts
     *
     * @return JSON
     */
    public function rex_save_custom_layouts()
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
        
        update_option("_rex_responsive_layouts", $_POST['custom_layouts']);

        wp_send_json_success($response);
	}
	
	/**
	 *	Ajax call to create a rex_model from the builder
	 *
	 *	@since 1.1.2
	 */
	public function rex_create_model_from_builder() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response , 500);
		endif;

		if( !isset( $_POST['model_data'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response , 500);
		}

		$model_settings = $_POST['model_data'];
		$model_shortcode = $model_settings['post_content'];

		if( empty( $model_settings['post_content'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error. No content!';
			wp_send_json_error( $response , 500);
		}

		$args = array(
			'comment_status'	=>	'closed',
			'ping_status'		=>	'closed',
			'post_title'		=>	$model_settings['post_title'],
			'post_content'		=>	"",
			'post_status'		=>	'private',
			'post_type'			=>	'rex_model'
		);

		if( null === get_page_by_title( $args['post_title'], OBJECT, 'rex_model' ) ) {
			// Create the page
			$model_insert_id = wp_insert_post( $args );
			$model_title = $args['post_title'];

			$response['model_id'] = $model_insert_id;
			$response['model_title'] = $model_title;

			// updating shortcode with post id and model name
			$model_shortcode = str_replace('rexlive_model_id=\"\"','rexlive_model_id="'.$model_insert_id.'"', $model_shortcode);
			$model_shortcode = str_replace('rexlive_model_name=\"\"', 'rexlive_model_name="'.$model_title.'"', $model_shortcode);

			// updating post content with new shortcode
			$argsModel = array(
				'ID'           => $model_insert_id,
				'post_title'   => $model_title,
				'post_content' => $model_shortcode,
			);

			wp_update_post( $argsModel );
			update_post_meta( $model_insert_id, '_rexbuilder_active', 'true' );

			$argsQuery = array(
				'post_type'		=>	'rex_model',
				'post_status'	=>	'private',
				'p'				=>	$model_insert_id
			);

			update_post_meta($model_insert_id, '_save_from_backend', "false" );
			
			$query = new WP_Query( $argsQuery );
			if ( $query->have_posts() ) {
				while ( $query->have_posts() ) {
					$query->the_post();
					$post = $query->post;
					$response['model_html'] = do_shortcode($post->post_content);
				}
			}
			wp_reset_postdata();

			$response['args'] = $args;

			wp_send_json_success( $response );
		} else {
			// The page exists
			$response['error'] = true;
			$response['model_id'] = -1;
			$response['model_title'] = "";
			$response['success'] = false;
			wp_send_json_error($response, 500);
		} // end if
	}

	function rex_fix_post_content($content)
	{
		if( function_exists( 'get_current_screen' ) ) {
			$screen = get_current_screen();
			if (is_a($screen, 'WP_Screen')) {
				$idPost = get_the_ID();
				$savedFromBackend = get_post_meta($idPost, '_save_from_backend', true);
				if (isset($savedFromBackend) && $savedFromBackend == "false") {
					$newContent = "";
					$post = get_post( (int)$idPost );
					$newContent =  $post->post_content;
					return $newContent;
				}
			}
		}
		return $content;
	}
	/**
	 * Ajax call for container margins
	 */
	public function rex_update_container_margins(){
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response , 500);
		endif;

		$pageID = $_POST["pageID"];
		// $selected_margins = $_POST["selected_margins"];
		$container_margins = $_POST["container_margins"];

		$global_settings = json_decode( stripslashes( get_option( '_rex_global_page_settings', '[]' ) ), true );
		$custom_settings = json_decode( stripslashes( get_post_meta( $pageID, '_rex_custom_page_settings', true ) ), true );

		switch( $container_margins['context'] )
		{
			case 'global':
				$global_settings['container_distancer']['top'] = $container_margins['vals']['top'];
				update_option( '_rex_global_page_settings' , json_encode( $global_settings ), true);

				$custom_settings['container_distancer']['top'] = '';
				update_post_meta( $pageID, '_rex_custom_page_settings', json_encode( $custom_settings ) );
				break;
			case 'custom':
				$custom_settings['container_distancer']['top'] = $container_margins['vals']['top'];
				update_post_meta( $pageID, '_rex_custom_page_settings', json_encode( $custom_settings ) );
				break;
			default:
				break;
		}

		$response['global_settings'] = $global_settings;
		$response['custom_settings'] = $custom_settings;

		wp_send_json_success( $response );
	}

	/**
	 * Undocumented function
	 *
	 * @return 
	 * @todo Review with spani85
	 */
    public function print_rex_buttons_style_backend()
    {
		$defaultButtonsIDs = '[]';
		$buttonsIDsJSON = get_option('_rex_buttons_ids', $defaultButtonsIDs);
		$buttonsIDsJSON = stripslashes( $buttonsIDsJSON );
		$buttonsIDsUsed = json_decode( $buttonsIDsJSON, true );
		$style = "";

		foreach ( $buttonsIDsUsed as $index => $id_button ) {
			$buttonStyle = get_option('_rex_button_'.$id_button.'_css', "");
			$buttonStyle = stripslashes($buttonStyle);
			$style .= $buttonStyle;
		}
		if($style != ''){
			wp_add_inline_style('rexliveStyle', $style);
		}	
	}
	
	/**
	 * Saves the model thumbnail
	 * @return model with new image
	 * @since  2.0.0
	 */
	public function rex_save_model_thumbnail(){
		$nonce = $_GET['nonce_param'];
		$model_target = $_GET['model_target'];
		$image_selected = $_GET['image_selected'];
		$image_size = $_GET['image_size'];

        $response = array(
            'error' => false,
            'msg' => '',
            'model_target' => $model_target,
            'selected_image' => $image_selected
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

		$response['error'] = false;

		$response['set_post_thumbnail_result'] = set_post_thumbnail($model_target, $image_selected);
		$response['set_post_thumbnail_url_result'] = update_post_meta(
			$model_target, 
			'selected_image_size', 
			$image_size
		);

		wp_send_json_success($response);
	}

	/**
	 * Deletes the model thumbnail
	 * @return model with no image
	 * @since  2.0.0
	 */
	public function rex_delete_model_thumbnail(){
		$nonce = $_GET['nonce_param'];
		$model_target = $_GET['model_target'];

        $response = array(
            'error' => false,
            'msg' => '',
            'model_target' => $model_target
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

		$response['error'] = false;

		$response['delete_post_thumbnail_result'] = delete_post_thumbnail($model_target);
		$response['delete_post_thumbnail_url_result'] = update_post_meta(
			$model_target, 
			'selected_image_size', 
			""
		);

		wp_send_json_success($response);
	}

	/**
	 * Edit the model name
	 * @return JSON response
	 * @since  2.0.0
	 */
	public function rex_edit_model_name(){
		$nonce = $_GET['nonce_param'];
		$modelData = $_GET['modelData'];

        $response = array(
            'error' => false,
            'msg' => '',
            'modelData' => $modelData
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

		$response['error'] = false;

		if ( isset( $modelData ) ) {
			$response['update'] = wp_update_post( array(
				'ID' => $modelData['id'],
				'post_title' => $modelData['name']
			) );
		}

		wp_send_json_success($response);
	}

	/**
	 * Get RexModels list to display on lateral menu, ready to drag on page
	 * @return JSON updated list
	 * @since  2.0.0
	 */
	public function rex_get_model_list(){
		$nonce = $_GET['nonce_param'];

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
		
		// WP_Query arguments
		$args = array(
			'post_type'              => array( 'rex_model' ),
			'post_status'            => array( 'publish', 'private' ),
			'posts_per_page'         => '-1',
			'orderby' => 'title',
            'order' => 'ASC'
		);

		$modelList = array();

		// The Query
		$query = new WP_Query( $args );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				
				$modelData = array();
				
				$modelData["id"] = get_the_ID();
				$modelData["name"] = get_the_title();
				$modelData["preview_image_url"] = get_the_post_thumbnail_url();

				array_push($modelList, $modelData);
			}
		} else {
			// no posts found
		}

		// Restore original Post Data
		wp_reset_postdata();

		$response["updated_list"] = $modelList;
		$response["args"] = $args;

        wp_send_json_success($response);
	}

	/**
	 * Save model edits
	 * @return JSON 
	 * @since  2.0.0
	 */
	public function rex_save_model_customization(){
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

        wp_send_json_success($response);
	}

	/**
	 * Save RexModels names
	 * @return JSON
	 * @since  2.0.0
	 */
	public function rex_save_model_customization_names(){
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

        $names = $_POST['names'];
        update_post_meta($post_id_to_update, '_rex_model_customization_names', $names);
		$response['names'] = $names;
        wp_send_json_success($response);
	}

	/**
	 * Get a single model HTML, ready to place on a page
	 * @return JSON HTML of the model and the layout definitions
	 * @since  2.0.0
	 */
	public function rex_get_model_live() {
		$nonce = $_GET['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		endif;

		if( !isset( $_GET['model_data'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$model_settings = $_GET['model_data'];

		if( empty( $model_settings['ID'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error. No model!';
			wp_send_json_error( $response );
		}

		$args = array(
			'post_type'		=>	'rex_model',
			'post_status'	=>	'private',
			'p'				=>	$model_settings['ID']
		);

		$query = new WP_Query( $args );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post = $query->post;
				$modelShortcode = $post->post_content;
				$response['model'] = do_shortcode($modelShortcode);
				$response['name'] = $post->post_title;
				$response['id'] = $post->ID;

				$re = '/rexlive_section_id="([a-zA-Z0-9]+)"/m';
				preg_match_all($re, $modelShortcode, $matches, PREG_SET_ORDER, 0);
				$response['sectionRexID'] = $matches;

				$modelCustomizationsNames = get_post_meta($post->ID, '_rex_model_customization_names', true);
				
				if($modelCustomizationsNames == ""){
					$modelCustomizationsNames = array();
				}
		
				$response['customizations_names'] = $modelCustomizationsNames;

				//Customizations Data
				$customizations = array();
				if (!empty($modelCustomizationsNames)) {
					$flag_models = true;
					foreach ($modelCustomizationsNames as $name) {
						$customization = array();
						$customization["name"] = $name;
						$customizationTargetsJSON = get_post_meta($post->ID, '_rex_model_customization_' . $name, true);
						$targetsDecoded = json_decode($customizationTargetsJSON, true);
						$customization["targets"] = $targetsDecoded;
						array_push($customizations, $customization);
					}
				}

				$response['customizations_data'] = $customizations;
			}
		}
		wp_reset_postdata();

		$response['args'] = $args;

		wp_send_json_success( $response );
	}		
	
	/**
	 * Delete a RexModel, knowing the id
	 * @return JSON delete operation response
	 * @since  2.0.0
	 */
	public function rex_delete_rexmodel() {
		$nonce = $_POST['nonce_param'];
		
        $response = array(
			'error' => false,
            'msg' => '',
        );
		
        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')) {
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        }

        if ( !isset( $_POST['model_id'] ) ) {
        	$response['msg'] = 'ID Error!';
			wp_send_json_error($response);
        }

        $response['delete_result'] = wp_delete_post( $_POST['model_id'] );

        wp_send_json_success( $response );
	}

	/**
	 * Get elements list to display on lateral menu, ready to drag on page
	 * @return JSON updated list
	 * @since  x.x.x
	 */
	public function rex_get_element_list(){
		$nonce = $_GET['nonce_param'];

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
		
		// WP_Query arguments
		$args = array(
            'post_type' => array('wpcf7_contact_form')
        );

		$elementList = array();

		// The Query
		$query = new WP_Query( $args );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				
				$elementData = array();
				
				$elementData["id"] = get_the_ID();
				$elementData["name"] = get_the_title();
				$elementData["preview_image_url"] = get_the_post_thumbnail_url();
				$elementData["element_data_html"] = get_post_meta(get_the_ID(), "_rex_element_data_html");

				array_push($elementList, $elementData);
			}
		} else {
			// No forms found
		}

		// Restore original Post Data
		wp_reset_postdata();

		$response["updated_list"] = $elementList;
		$response["args"] = $args;

        wp_send_json_success($response);
	}

	/**
	 * Delete an element, knowing the id
	 * @return JSON delete operation response
	 * @since  x.x.x
	 */
	public function rex_delete_rexelement() {
		$nonce = $_POST['nonce_param'];
		
        $response = array(
			'error' => false,
            'msg' => '',
        );
		
        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')) {
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        }

        if ( !isset( $_POST['element_id'] ) ) {
        	$response['msg'] = 'ID Error!';
			wp_send_json_error($response);
        }

        $response['delete_result'] = wp_delete_post( $_POST['element_id'] );

        wp_send_json_success( $response );
	}

	/**
	 * Save the element thumbnail
	 * @return model with new image
	 * @since  x.x.x
	 */
	public function rex_save_element_thumbnail(){
		$nonce = $_GET['nonce_param'];
		$element_target = $_GET['element_target'];
		$image_selected = $_GET['image_selected'];
		$image_size = $_GET['image_size'];

        $response = array(
            'error' => false,
            'msg' => '',
            'element_target' => $element_target,
            'selected_image' => $image_selected
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

		$response['error'] = false;

		$response['set_post_thumbnail_result'] = set_post_thumbnail($element_target, $image_selected);
		$response['set_post_thumbnail_url_result'] = update_post_meta(
			$element_target, 
			'selected_image_size', 
			$image_size
		);

		wp_send_json_success($response);
	}

	/**
	 * Deletes the model image
	 * @return model with no image
	 * @since  x.x.x
	 */
	public function rex_delete_element_thumbnail(){
		$nonce = $_GET['nonce_param'];
		$element_target = $_GET['element_target'];

        $response = array(
            'error' => false,
            'msg' => '',
            'element_target' => $element_target
        );

        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        endif;

		$response['error'] = false;

		$response['delete_post_thumbnail_result'] = delete_post_thumbnail($element_target);
		$response['delete_post_thumbnail_url_result'] = update_post_meta(
			$element_target, 
			'selected_image_size', 
			""
		);

		wp_send_json_success($response);
	}

	/**
	 * Adding a new element
	 * @return JSON operation result
	 * @since  2.0.0
	 */
	public function rex_clone_element() {
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
		
		$oldID = $_POST['old_id'];
		$newID = Rexbuilder_Utilities::duplicate($oldID);
		$response['new_id'] = $newID;

		wp_send_json_success( $response );
	}

	/**
	 * Updating a button definition
	 * @return JSON operation result
	 * @since  2.0.0
	 */
	public function rex_update_button() {
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
		
		$id_button = $_POST["id_button"];
		$html_button = trim( $_POST["html_button"] );
		$css_button = $_POST["css_button"];
		$jsonRexButtons_buttons = $_POST["jsonRexButtons"];

		update_option( '_rex_buttons_styles', $jsonRexButtons_buttons );
		update_option( '_rex_button_'.$id_button.'_css', $css_button );
		update_option( '_rex_button_'.$id_button.'_html', $html_button );
		$response['idButton'] = $id_button;
		wp_send_json_success( $response );
	}
	
	/**
	 * Update RexButton ids list
	 * @return JSON update response
	 * @since  2.0.0
	 */
	public function	rex_update_buttons_ids(){
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
		$buttons_ids = $_POST["ids_used"];
		update_option( '_rex_buttons_ids', $buttons_ids );
		$response['backIDS'] = $buttons_ids;
		wp_send_json_success( $response );
	}

	/**
	 * Delete a RexButton, knowing the id
	 * @return JSON delete operation response
	 * @since  2.0.0
	 */
	public function rex_delete_rexbutton() {
		$nonce = $_POST['nonce_param'];
		
        $response = array(
			'error' => false,
            'msg' => '',
        );
		
        if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')) {
            $response['error'] = true;
            $response['msg'] = 'Nonce Error!';
            wp_send_json_error($response);
        }

        if ( !isset( $_POST['button_id'] ) ) {
        	$response['msg'] = 'ID Error!';
			wp_send_json_error($response);
        }

        // remove button html and css definition
        $response['delete_result']['css'] = delete_option( "_rex_button_{$_POST['button_id']}_css" );
        $response['delete_result']['html'] = delete_option( "_rex_button_{$_POST['button_id']}_html" );

        // remove id from the id list
        $button_ids = json_decode( stripslashes( get_option( '_rex_buttons_ids' ) ), true );
        $button_id_index = null;
        foreach( $button_ids as $i => $id ) {
        	if ( $id === $_POST['button_id'] ) {
        		$button_id_index = $i;
        		break;
        	}
        }

        if ( null !== $button_id_index ) {
        	array_splice( $button_ids, $button_id_index, 1 );
        	$response['delete_result']['id'] = update_option( '_rex_buttons_ids', json_encode( $button_ids ) );
        }

        // remove button style
        $button_styles = json_decode( stripslashes( get_option( '_rex_buttons_styles' ) ), true );
        $button_style_index = null;
        foreach ($button_styles as $i => $style) {
        	if( $style['rexID'] === $_POST['button_id'] ) {
        		$button_style_index = $i;
        		break;
        	}
        }

        if ( null !== $button_style_index ) {
        	array_splice( $button_styles, $button_style_index, 1 );
        	$response['delete_result']['style'] = update_option( '_rex_buttons_styles', json_encode( $button_styles ) );
        }

        wp_send_json_success( $response );
	}
	
	/**
	 * Ajax call to get a rex_model and insert in the builder
	 * 
	 * @since 1.1.2
	 * @return JSON
	 */
	public function rex_get_model() {
		$nonce = $_GET['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		endif;

		if( !isset( $_GET['model_data'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		}

		$model_settings = $_GET['model_data'];

		if( empty( $model_settings['ID'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Error. No model!';
			wp_send_json_error( $response );
		}

		$checkbox_index = $model_settings['section_id'];

		$args = array(
			'post_type'			=>	'rex_model',
			'post_status'		=>	'private',
			'p'				=>	$model_settings['ID']
		);

		$query = new WP_Query( $args );
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();

				$pattern = get_shortcode_regex();
				$contents = $query->post->post_content;
				$response['model'] = $query->post;
				$response['info'] = array();

				ob_start();

				if( !empty( $contents ) ) :
					preg_match_all( "/$pattern/", $contents, $result_rows);
					foreach( $result_rows[2] as $i => $section ) {
						if( $section == 'RexpansiveSection') {
		
							$section_content = $result_rows[5][$i];
							$section_attr = shortcode_parse_atts( trim( $result_rows[3][$i] ) );

							$section_bg_setts = array(
								'color' 	=> '',
								'image' 	=> '',
								'url' 		=> '',
								'video'		=>	'',
								'youtube'	=>	'',
							);
			
							$section_bg_style = array();
							$section_bg_button_preview_style = '';
			
							if( array_key_exists('color_bg_section', $section_attr) && '' != $section_attr['color_bg_section'] ) {
								$section_bg_style['background-color'] = $section_attr['color_bg_section'];
								$section_bg_style['background-image'] = '';
								$section_bg_setts['color'] = $section_attr['color_bg_section'];
								$section_bg_button_preview_style .= 'background-color:' . $section_attr['color_bg_section'] . ';background-image:none;';
							} else if( array_key_exists('color_bg_section', $section_attr) && '' != $section_attr['image_bg_section'] ) {
								$section_bg_style['background-image'] = 'url(' . wp_get_attachment_url( $section_attr['id_image_bg_section'] ) . ')';
								$section_bg_style['background-color'] = '';
								$section_bg_setts['image'] = $section_attr['id_image_bg_section'];
								$section_bg_setts['url'] = wp_get_attachment_url( $section_attr['id_image_bg_section'] );
								$section_bg_button_preview_style .= 'background-image:url(' . wp_get_attachment_url( $section_attr['id_image_bg_section'] ) . ');';
							}
			
							if(array_key_exists('video_bg_id_section', $section_attr) && $section_attr['video_bg_id_section'] != 'undefined') :
								$section_bg_setts['video'] = $section_attr['video_bg_id_section'];
							endif;
			
							if(array_key_exists('video_bg_url_section', $section_attr) && $section_attr['video_bg_url_section'] != 'undefined') :
								$section_bg_setts['youtube'] = $section_attr['video_bg_url_section'];
							endif;
			
							if(array_key_exists('video_bg_url_vimeo_section', $section_attr) && $section_attr['video_bg_url_vimeo_section'] != 'undefined') :
								$section_bg_setts['vimeo'] = $section_attr['video_bg_url_vimeo_section'];
							endif;
			
							$response['info']['section_bg_settings'] = $section_bg_setts;
							$section_bg_setts = json_encode( $section_bg_setts );
			
							$section_dimension = '';
							if( '' != $section_attr['dimension'] ) {
								$section_dimension = $section_attr['dimension'];
							}

							$response['info']['griddimension'] = $section_dimension;
							$response['info']['section_bg_button_preview_style'] = $section_bg_button_preview_style;
							$response['info']['section_bg_style'] = $section_bg_style;

							$background_responsive = array(
								//'r' => '255',
								//'g' => '255',
								//'b' => '255',
								//'a' => '0',
								'gutter' => '20',
								'isFull' => '',
								'custom_classes' => '',
								'section_width'	=>	'',
							);
			
							$section_has_overlay = false;
							$section_overlay_style = '';
			
							$section_overlay_color = '';
			
							if( array_key_exists( 'responsive_background', $section_attr ) && '' != $section_attr['responsive_background'] ) {
							$section_overlay_color = $section_attr['responsive_background'];
							}
			
							if( array_key_exists( 'block_distance', $section_attr ) && '' != $section_attr['block_distance'] ) {
							$background_responsive['gutter'] = $section_attr['block_distance'];
							}
							if( array_key_exists( 'full_height', $section_attr ) && '' != $section_attr['full_height'] ) {
								$background_responsive['isFull'] = $section_attr['full_height'];
							}
							if( array_key_exists( 'custom_classes', $section_attr ) && '' != $section_attr['custom_classes'] ) {
							$background_responsive['custom_classes'] = $section_attr['custom_classes'];
							$section_overlay_classes = preg_match_all("/active-(small|medium|large)-overlay/", $section_attr['custom_classes'], $foo);
							if($section_overlay_classes > 0) :
								$section_has_overlay = true;
								$section_overlay_style = 'background-color:' . $section_overlay_color . ';';
							endif;
							}
							if( array_key_exists( 'section_width', $section_attr ) && '' != $section_attr['section_width'] ) {
								$background_responsive['section_width'] = $section_attr['section_width'];
							}
			
							$custom_section_name = '';
							if(array_key_exists('section_name', $section_attr) && $section_attr['section_name'] != 'undefined') :
								$custom_section_name = $section_attr['section_name'];
							endif;

							$response['info']['section_bg_responsive'] = $background_responsive;
							$response['info']['section_name'] = $custom_section_name;
							$response['info']['layout'] = $section_attr['layout'];
							$response['info']['section_overlay_color'] = $section_overlay_color;
							$response['info']['row_separator_top'] = ( isset( $section_attr['row_separator_top'] ) ? $section_attr['row_separator_top'] : '' );
							$response['info']['row_separator_bottom'] = ( isset( $section_attr['row_separator_bottom'] ) ? $section_attr['row_separator_bottom'] : '' );
							$response['info']['row_separator_left'] = ( isset( $section_attr['row_separator_left'] ) ? $section_attr['row_separator_left'] : '' );
							$response['info']['row_separator_right'] = ( isset( $section_attr['row_separator_right'] ) ? $section_attr['row_separator_right'] : '' );
							$response['info']['row_active_photoswipe'] = ( isset( $section_attr['row_active_photoswipe'] ) ? $section_attr['row_active_photoswipe'] : '' );
							$response['info']['section_has_overlay'] = $section_has_overlay;
							$response['info']['section_overlay_style'] = $section_overlay_style;
							$response['info']['section_model'] = $query->post->ID;
							
							$blocks = array();

							ob_start();
							if( !empty( $section_content ) ) {
								preg_match_all( "/$pattern/", $section_content, $result_block);

								foreach( $result_block[3] as $i => $attrs ) {
									$block_attr = shortcode_parse_atts( trim( $attrs ) );

									// Prepare the background block settings

									$background_block_setts = array(
										'color' => '',
										'image' => '',
										'url' => '',
										'bg_img_type' => '',
										'photoswipe' => '',
										'linkurl' => '',
										'video'		=>	'',
										'youtube'	=>	'',
										'block_custom_class' => '',
										'overlay_block_color' => '',
										'image_size' => '',
									);
									$style = ' style="';

									if( array_key_exists('image_bg_block', $block_attr) && array_key_exists('type_bg_block', $block_attr) && $block_attr['image_bg_block'] != '' && $block_attr['type_bg_block'] == 'full' ) {
										$style .= 'background-image:url(' . wp_get_attachment_url ($block_attr['id_image_bg_block'] ) . ');';
										$background_block_setts['image'] = $block_attr['id_image_bg_block'];
										$background_block_setts['url'] = wp_get_attachment_url ($block_attr['id_image_bg_block'] );
										$background_block_setts['bg_img_type'] = $block_attr['type_bg_block'];
									} else if( array_key_exists('color_bg_block', $block_attr) && array_key_exists('type_bg_block', $block_attr) && 	$block_attr['color_bg_block'] != '' && $block_attr['type_bg_block'] != 'full' ) {
										$style .= 'background-color:' . $block_attr['color_bg_block'] . ';';
							
										if( array_key_exists('type_bg_block', $block_attr) && $block_attr['type_bg_block'] == 'natural' ) {
											$style .= 'background-image:url(' . wp_get_attachment_url( $block_attr['id_image_bg_block'] ) . ');';
										}
							
										$background_block_setts['color'] = $block_attr['color_bg_block'];
										$background_block_setts['image'] = $block_attr['id_image_bg_block'];
										$background_block_setts['url'] = wp_get_attachment_url( $block_attr['id_image_bg_block'] );
										$background_block_setts['bg_img_type'] = $block_attr['type_bg_block'];
									} else if( array_key_exists('type_bg_block', $block_attr) && $block_attr['type_bg_block'] == 'natural' ) {
										if( array_key_exists('color_bg_block', $block_attr) && array_key_exists('type_bg_block', $block_attr) && $block_attr['color_bg_block'] != '' && $block_attr['type_bg_block'] != 'full' ) {
											$style .= 'background-color:' . $block_attr['color_bg_block'] . ';';
										}
										$style .= 'background-image:url(' . wp_get_attachment_url ($block_attr['id_image_bg_block'] ) . ');';
										$background_block_setts['image'] = $block_attr['id_image_bg_block'];
										$background_block_setts['url'] = wp_get_attachment_url ($block_attr['id_image_bg_block'] );
										$background_block_setts['bg_img_type'] = $block_attr['type_bg_block'];
							
										$classEmpty = 'hidden';
									}
							
									if(array_key_exists('video_bg_id', $block_attr) && $block_attr['video_bg_id'] != 'undefined') :
										$background_block_setts['video'] = $block_attr['video_bg_id'];
									else :
										$background_block_setts['video'] = '';
									endif;
							
									if(array_key_exists('video_bg_url', $block_attr) && $block_attr['video_bg_url'] != 'undefined') :
										$background_block_setts['youtube'] = $block_attr['video_bg_url'];
									else :
										$background_block_setts['youtube'] = '';
									endif;
							
									if(array_key_exists('video_bg_url_vimeo', $block_attr) && $block_attr['video_bg_url_vimeo'] != 'undefined') :
										$background_block_setts['vimeo'] = $block_attr['video_bg_url_vimeo'];
									else :
										$background_block_setts['vimeo'] = '';
									endif;
							
									$video_has_audio = '0';
									if(array_key_exists('video_has_audio', $block_attr) && $block_attr['video_has_audio'] != 'undefined') :
										$video_has_audio =  $block_attr['video_has_audio'];
									endif;
							
									if(array_key_exists('photoswipe', $block_attr) && $block_attr['photoswipe'] != 'undefined') :
										$background_block_setts['photoswipe'] = $block_attr['photoswipe'];
									else :
										$background_block_setts['photoswipe'] = '';
									endif;
							
									if(array_key_exists('linkurl', $block_attr) && $block_attr['linkurl'] != 'undefined') :
										$background_block_setts['linkurl'] = $block_attr['linkurl'];
									else :
										$background_block_setts['linkurl'] = '';
									endif;
							
									if(array_key_exists('image_size', $block_attr) && $block_attr['image_size'] != 'undefined') :
										$background_block_setts['image_size'] = $block_attr['image_size'];
									else :
										$background_block_setts['image_size'] = '';
									endif;
							
									$element_preview_position_classes = '';
							
									if(array_key_exists('block_custom_class', $block_attr) && $block_attr['block_custom_class'] != 'undefined') :
										$background_block_setts['block_custom_class'] = $block_attr['block_custom_class'];
										$block_custom_classes = $block_attr['block_custom_class'];
										$matches = preg_match_all("/rex-flex-(top|middle|bottom|left|center|right)/", $block_custom_classes, $content_position);
										if($matches != 0) :
											$element_preview_position_classes = ' element-content-positioned';
											foreach ($content_position[0] as $key => $class) :
												switch ($class) :
													case 'rex-flex-top':
														$element_preview_position_classes .= ' element-content-positioned-top';
														break;
													case 'rex-flex-middle':
														$element_preview_position_classes .= ' element-content-positioned-middle';
														break;
													case 'rex-flex-bottom':
														$element_preview_position_classes .= ' element-content-positioned-bottom';
														break;
													case 'rex-flex-left':
														$element_preview_position_classes .= ' element-content-positioned-left';
														break;
													case 'rex-flex-center':
														$element_preview_position_classes .= ' element-content-positioned-center';
														break;
													case 'rex-flex-right':
														$element_preview_position_classes .= ' element-content-positioned-right';
														break;
													default:
														break;
												endswitch;
											endforeach;
										endif;
									else :
										$background_block_setts['block_custom_class'] = '';
										$block_custom_classes = '';
									endif;
							
									if(array_key_exists('block_padding', $block_attr) && $block_attr['block_padding'] != 'undefined') :
										$content_padding_settings = $block_attr['block_padding'];
									else :
										$content_padding_settings = '';
									endif;
							
									if(array_key_exists('overlay_block_color', $block_attr) && $block_attr['overlay_block_color'] != 'undefined') :
										$background_block_setts['overlay_block_color'] = $block_attr['overlay_block_color'];
									endif;
							
									$style .= '"';
							
									$define_borders = ' with-border';
									if( $background_block_setts['color'] != '' || ( $background_block_setts['image'] != '' && $background_block_setts['bg_img_type'] != 'natural' ) ) :
										if( $background_block_setts['color'] != 'rgba(255,255,255,0)' ) :
											$define_borders = ' no-border';
										endif;
									endif;
							
									$temp_block_setts = $background_block_setts;
							
									$background_block_setts = json_encode( $background_block_setts );
							
									// Preapre the zak effect settings
									$zak_effect_setts = array(
										'side' => '',
										'background_url' => '',
										'background_id' => '',
										'title' => '',
										'icon_url' => '',
										'icon_id' => '',
										'content' => '',
										'foreground_url' => '',
										'foreground_id' => ''
									);
									if(array_key_exists('zak_side', $block_attr) && $block_attr['zak_side'] != 'undefined') {
										$zak_effect_setts['side'] = $block_attr['zak_side'];
									}
							
									if(array_key_exists('zak_background', $block_attr) && $block_attr['zak_background'] != 'undefined') {
										$zak_effect_setts['background_url'] = wp_get_attachment_url( $block_attr['zak_background'] );
										$zak_effect_setts['background_id'] = $block_attr['zak_background'];
									}
							
									if(array_key_exists('zak_title', $block_attr) && $block_attr['zak_title'] != 'undefined') {
										$zak_effect_setts['title'] = $block_attr['zak_title'];
									}
							
									if(array_key_exists('zak_icon', $block_attr) && $block_attr['zak_icon'] != 'undefined') {
										$zak_effect_setts['icon_url'] = ( $block_attr['zak_icon'] ) ? wp_get_attachment_url( $block_attr['zak_icon'] ) : '';
										$zak_effect_setts['icon_id'] = $block_attr['zak_icon'];
									}
									$zak_effect_setts['content'] = ($result_block[5][$i]);
							
									if(array_key_exists('zak_foreground', $block_attr) && $block_attr['zak_foreground'] != 'undefined') :
										if( '' != $block_attr['zak_foreground'] ) :
											$zak_effect_setts['foreground_url'] = wp_get_attachment_url( $block_attr['zak_foreground'] );
											$zak_effect_setts['foreground_id'] = $block_attr['zak_foreground'];
										endif;
									endif;														
							
									//var_dump(mysql_real_escape_string($result_block[5][$i]));
							
									$zak_effect_setts = json_encode( $zak_effect_setts );
							
									$block_content = $result_block[5][$i];																			
							
									$block_content = preg_replace('/^<\/p>/', '', $block_content);
									$block_content = preg_replace('/<p>+$/', '', $block_content);
							
									$slider_data_markup = "";
									$actions_args = array(
										'block_has_slider' => false
									);
									if( "rexslider" == $block_attr['type'] ) {
										preg_match_all( "/$pattern/", $block_content, $block_content_parsed);
										$slider_settings = shortcode_parse_atts(trim($block_content_parsed[3][0]));
										$slider_data_markup .= ' data-block-slider-id="' . esc_attr( $slider_settings['slider_id'] ) . '"';
										$actions_args['block_has_slider'] = true;
									}
									$b_id = 'block_' . $checkbox_index . '_' . $i;
									ob_start();
									?>
									<li id="<?php echo $b_id; ?>" class="<?php echo esc_attr( $block_attr['type'] ); echo esc_attr( $define_borders ); ?> item z-depth-1 hoverable svg-ripple-effect<?php if( isset( $block_attr['type_bg_block'] ) && $block_attr['type_bg_block'] == 'natural') : echo ' block-is-natural'; endif; ?>" data-block_type="<?php echo esc_attr( $block_attr['type'] ); ?>" data-col="<?php echo esc_attr( $block_attr['col'] ); ?>" data-row="<?php echo esc_attr( $block_attr['row'] ); ?>" data-sizex="<?php echo esc_attr( $block_attr['size_x'] ); ?>" data-sizey="<?php echo esc_attr( $block_attr['size_y'] ); ?>" data-bg_settings='<?php echo $background_block_setts; ?>' data-block-custom-classes="<?php echo esc_attr( $block_custom_classes ); ?>" data-content-padding="<?php echo esc_attr( $content_padding_settings ); ?>" data-video-has-audio="<?php echo esc_attr( $video_has_audio ); ?>"<?php echo $slider_data_markup; ?>>
										<div class="element-actions<?php echo ( $actions_args['block_has_slider'] ? ' element-actions__block-slider' : '' ); ?>">
											<div class="builder-fab-row-widgets actions-center-icons fixed-action-btn horizontal">
												<button class="btn-floating builder-show-widgets waves-effect waves-light light-blue darken-3">
												<i class="material-icons">add</i>
												</button>
												<ul>
												<li class="edit_handler text-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive-builder'); ?>">
													<i class="material-icons rex-icon">u</i>
												</li>
												<li class="edit_handler rex-slider-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Rex Slider', 'rexpansive-builder'); ?>">
													<i class="material-icons rex-icon">X</i>
												</li>
												<li class="background_handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive-builder'); ?>">
													<i class="material-icons">&#xE8B8;</i>
												</li>
												<li class="copy-handler btn-floating grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive-builder'); ?>">
													<i class="material-icons white-text">&#xE14D;</i>
												</li>
												</ul>
											</div>
											<div class="actions-center-icons">
												<div class="edit_handler text-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive-builder'); ?>">
												<i class="material-icons rex-icon">u</i>
												</div>
												<div class="edit_handler rex-slider-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Rex Slider', 'rexpansive-builder'); ?>">
												<i class="material-icons rex-icon">X</i>
												</div>
												<div class="background_handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive-builder'); ?>">
												<i class="material-icons">&#xE8B8;</i>
												</div>
												<br>
												<div class="copy-handler btn-floating grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive-builder'); ?>">
												<i class="material-icons white-text">&#xE14D;</i>
												</div>
											</div>
											<div class="delete_handler btn-floating waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexpansive-builder'); ?>">
												<i class="material-icons white-text">&#xE5CD;</i>
											</div>
										</div>
										<?php
										switch( $block_attr['type'] ) {
										case 'image':
									?>
											<div class="element-data">
											<textarea class="data-text-content" display="none"><?php echo $block_content; ?></textarea>
											</div>
											<div class="element-preview-wrap<?php echo $element_preview_position_classes; ?>"<?php echo $style; ?>>
											<div class="element-preview">
												<?php 
												if( $block_attr['type_bg_block'] == '' && $block_attr['color_bg_block'] == '' ) { 
													$control = true;
												} else {
													$control = false;
												}
												?>
												<div class="backend-image-preview" data-image_id="<?php $block_attr['id_image_bg_block']; ?>" <?php if($control) { echo 'style="display:none;"'; } ?>>
												<?php echo $block_content; ?>
												</div>
											</div>
											</div>
									<?php
											break;
										case 'text':
										case 'textfill':
										case 'rexslider':
									?>
											<div class="element-data">
											<textarea class="data-text-content" display="none"><?php echo $block_content; ?></textarea>
											</div>
											<div class="element-preview-wrap<?php echo $element_preview_position_classes; ?>"<?php echo $style; ?>>
											<div class="element-preview"><?php echo $block_content; ?></div>
											</div>
									<?php
											break;
										case 'empty':
									?>
											<div class="element-data">
											<textarea class="data-text-content" display="none"><?php echo $block_content; ?></textarea>
											</div>
											<div class="element-preview-wrap<?php echo $element_preview_position_classes; ?>"<?php if($style) { echo $style; } ?>>
											<div class="element-preview">
												<div class="element-preview"><?php echo $block_content; ?></div>
											</div>
											</div>
									<?php
											break;
										case 'video':
									?>
											<div class="element-data">
											<textarea class="data-text-content" display="none"><?php echo $block_content; ?></textarea>	
											</div>
											<div class="element-preview-wrap<?php echo $element_preview_position_classes; ?>"<?php echo $style; ?>>
											<div class="element-preview"><?php echo $block_content; ?></div>	
											</div>
									<?php
											break;	
										case 'expand':
									?>
											<div class="element-data">
											<input class="data-zak-content" type="hidden" <?php echo 'data-zak-content=\'' . $zak_effect_setts . '\'' ?>>
											</div>
											<div class="element-preview"<?php echo $style; ?>>
											<?php
												if( 'left' == $block_attr['zak_side'] ) :
											?>
												<div class="zak-block zak-image-side">
												<img src="<?php echo wp_get_attachment_url( $block_attr['zak_background'] ); ?>">
												</div>
												<div class="zak-block zak-text-side">
												<h2><?php echo $block_attr['zak_title']; ?></h2>
												<?php if( $block_attr['zak_icon'] ) : ?>
													<img src="<?php echo wp_get_attachment_url( $block_attr['zak_icon'] ); ?>" alt="">
												<?php endif; ?>
												<div class="text-preview"><?php echo $block_content; ?></div>
												</div>
											<?php
												else :
											?>
												<div class="zak-block zak-text-side">
												<h2><?php echo $block_attr['zak_title']; ?></h2>
												<?php if( $block_attr['zak_icon'] ) : ?>
													<img src="<?php echo wp_get_attachment_url( $block_attr['zak_icon'] ); ?>" alt="">
												<?php endif; ?>
												<div class="text-preview"><?php echo $block_content; ?></div>
												</div>
												<div class="zak-block zak-image-side">
												<img src="<?php echo wp_get_attachment_url( $block_attr['zak_background'] ); ?>">
												</div>
											<?php
												endif;
											?>
											</div>
									<?php
											break;
										case 'default':
											break;
										}
									?>
<div class="element-visual-info<?php
  if('' != $temp_block_setts['youtube'] || '' != $temp_block_setts['video'] || '' != $temp_block_setts['vimeo'] ) :
    echo ' ' . 'rex-active-video-notice';
  endif;
?>"<?php 
  if( '' != $temp_block_setts['overlay_block_color'] ) :
    echo ' style="background-color:' . $temp_block_setts['overlay_block_color'] . '"';
  endif;
?>>
  <div class="vert-wrap">
    <div class="vert-elem">
      <i class="material-icons rex-icon rex-notice rex-video-notice">G</i>
    </div>
  </div>
</div>
<div class="el-visual-size"><span><?php echo $block_attr['size_x'] . 'x' . $block_attr['size_y']; ?></span></div>
									</li>
									<?php
									$block = array(
										'w' => $block_attr['size_x'],
										'h' => $block_attr['size_y'],
										'col' => $block_attr['col'],
										'row' => $block_attr['row'],
										'id' => $b_id,
										'html' => trim( ob_get_clean() ),
									);
									array_push( $blocks, $block );
								}
							}
							$response['info']['tmpl'] = $blocks;
						}
					}
				endif;
			}
		} else {
			// no posts found
		}

		wp_reset_postdata();

		$response['args'] = $args;

		wp_send_json_success( $response );
	}

	/**
	 * Get post content for WPML compatibility
	 *
	 * @return void
	 * @since 1.1.0
	 */
	function live_refresh_builder() {
		$nonce = $_POST['rexnonce'];
		
		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
			die( 'Do not do this!' );
		endif;
	
	
		if ( current_user_can( 'edit_posts' ) ) :
			$pattern = get_shortcode_regex();
			$contents = get_post_field('post_content', $_POST['post_id']);
			if( !empty( $contents ) ) :
				preg_match_all( "/$pattern/", $contents, $result_rows);
	
				foreach( $result_rows[2] as $i => $section ) :
					if( $section == 'RexpansiveSection') :
	
						$section_content = $result_rows[5][$i];
						$section_attr = shortcode_parse_atts( trim( $result_rows[3][$i] ) );
						
						$section_bg_setts = array(
							'color' 	=> '',
							'image' 	=> '',
							'url' 		=> '',
							'video'		=>	'',
							'youtube'	=>	'',
						);
	
						$section_bg_style = '';
						$section_bg_button_preview_style = '';
	
						if( '' != $section_attr['color_bg_section'] ) {
							$section_bg_style = ' style="';
							$section_bg_style .= 'background-color:' . esc_attr( $section_attr['color_bg_section'] );
							$section_bg_setts['color'] = $section_attr['color_bg_section'];
							$section_bg_style .= ';"';
							$section_bg_button_preview_style .= ' style="background-color:' . esc_attr( $section_attr['color_bg_section'] ) . ';background-image:none;" ';
						} else if( '' != $section_attr['image_bg_section'] ) {
							$section_bg_style = ' style="';
							$section_bg_style .= 'background-image:url(' . wp_get_attachment_url( $section_attr['id_image_bg_section'] ) . ')';
							$section_bg_setts['image'] = $section_attr['id_image_bg_section'];
							$section_bg_setts['url'] = wp_get_attachment_url( $section_attr['id_image_bg_section'] );
							$section_bg_style .= ';"';
							$section_bg_button_preview_style .= ' style="background-image:url(' . wp_get_attachment_url( $section_attr['id_image_bg_section'] ) . ');" ';
						}
	
						if(array_key_exists('video_bg_id_section', $section_attr) && $section_attr['video_bg_id_section'] != 'undefined') :
							$section_bg_setts['video'] = $section_attr['video_bg_id_section'];
						endif;
	
						if(array_key_exists('video_bg_url_section', $section_attr) && $section_attr['video_bg_url_section'] != 'undefined') :
							$section_bg_setts['youtube'] = $section_attr['video_bg_url_section'];
						endif;
	
						if(array_key_exists('video_bg_url_vimeo_section', $section_attr) && $section_attr['video_bg_url_vimeo_section'] != 'undefined') :
							$section_bg_setts['vimeo'] = $section_attr['video_bg_url_vimeo_section'];
						endif;
	
						$section_bg_setts = json_encode( $section_bg_setts );
	
						$section_dimension = '';
						if( '' != $section_attr['dimension'] ) {
							$section_dimension = $section_attr['dimension'];
						}
	
						$background_responsive = array(
							'gutter' => '20',
							'isFull' => '',
							'custom_classes' => '',
							'section_width'	=>	'',
						);
	
						$section_has_overlay = false;
						$section_overlay_style = '';
						$section_overlay_color = '';
	
						if( array_key_exists( 'responsive_background', $section_attr ) && '' != $section_attr['responsive_background'] ) {
							$section_overlay_color = $section_attr['responsive_background'];
						}
						if( array_key_exists( 'block_distance', $section_attr ) && '' != $section_attr['block_distance'] ) {
							$background_responsive['gutter'] = $section_attr['block_distance'];
						}
						if( array_key_exists( 'full_height', $section_attr ) && '' != $section_attr['full_height'] ) {
								$background_responsive['isFull'] = $section_attr['full_height'];
							}
						if( array_key_exists( 'custom_classes', $section_attr ) && '' != $section_attr['custom_classes'] ) {
							$background_responsive['custom_classes'] = $section_attr['custom_classes'];
							$section_overlay_classes = preg_match_all("/active-(small|medium|large)-overlay/", $section_attr['custom_classes'], $foo);
							if($section_overlay_classes > 0) :
								$section_has_overlay = true;
								$section_overlay_style = ' style="background-color:' . $section_overlay_color . ';"';
							endif;
						}
						if( array_key_exists( 'section_width', $section_attr ) && '' != $section_attr['section_width'] ) {
							$background_responsive['section_width'] = $section_attr['section_width'];
						}
				
						$custom_section_name = '';
						if(array_key_exists('section_name', $section_attr) && $section_attr['section_name'] != 'undefined') :
							$custom_section_name = $section_attr['section_name'];
						endif;
						
						?>
						<div class='builder-row clearfix z-depth-1' data-count='' data-gridcontent='' data-gridproperties='<?php echo $section_bg_setts; ?>' data-griddimension='<?php echo esc_attr( $section_dimension ); ?>' data-layout='<?php echo esc_attr( $section_attr["layout"] ); ?>' data-section-overlay-color='<?php echo $section_overlay_color; ?>' data-sectionid='<?php echo esc_attr( $custom_section_name ); ?>' data-backresponsive='<?php echo htmlspecialchars(json_encode($background_responsive)); ?>' data-row-separator-top='<?php echo ( isset( $section_attr["row_separator_top"] ) ? esc_attr( $section_attr["row_separator_top"] ) : '' ); ?>' data-row-separator-bottom='<?php echo ( isset( $section_attr["row_separator_bottom"] ) ? esc_attr( $section_attr["row_separator_bottom"] ) : '' ); ?>' data-row-separator-right='<?php echo ( isset( $section_attr["row_separator_right"] ) ? esc_attr( $section_attr["row_separator_right"] ) : '' ); ?>' data-row-separator-left='<?php echo ( isset( $section_attr["row_separator_left"] ) ? esc_attr( $section_attr["row_separator_left"] ) : '' ); ?>' data-section-active-photoswipe='<?php echo ( isset( $section_attr["row_active_photoswipe"] ) ? esc_attr( $section_attr["row_active_photoswipe"] ) : '' ); ?>'>
	
							<div class="builder-row-contents">
								<div class="builder-edit-row-header">
									<button class="btn-floating builder-delete-row waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete row', 'rexpansive-builder'); ?>">
										<i class="material-icons white-text">&#xE5CD;</i>
									</button>
								</div>
								<div class="builder-edit-row-wrap clearfix row valign-wrapper">
									<div class="col s4 rex-edit-dimension-wrap valign-wrapper">
										<div>
											<input type="radio" 
												id="section-full-<?php echo esc_attr( $checkbox_index ); ?>" 
												name="section-dimension-<?php echo esc_attr( $checkbox_index ); ?>" 
												class="builder-edit-row-dimension with-gap" 
												value="full" title="Full"
											<?php
											checked( $section_attr['dimension'], 'full', 1 );
											?> />
											<label for="section-full-<?php echo esc_attr( $checkbox_index ); ?>" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Full', 'rexpansive-builder' ); ?>">
												<i class="material-icons rex-icon">v<span class="rex-ripple"></span></i>
											</label>
										</div>
										<div>
											<input id="section-boxed-<?php echo esc_attr( $checkbox_index ); ?>" type="radio" 
												name="section-dimension-<?php echo esc_attr( $checkbox_index ); ?>" 
												class="builder-edit-row-dimension with-gap" value="boxed" title="Boxed"
											<?php
											checked( $section_attr['dimension'], 'boxed', 1 );
											?> />
											<label for="section-boxed-<?php echo esc_attr( $checkbox_index ); ?>" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Boxed', 'rexpansive-builder' ); ?>">
												<i class="material-icons rex-icon">t<span class="rex-ripple"></span></i>
											</label>
										</div>
										<div class="rex-edit-layout-wrap" style="display:none;">
											<input id="section-fixed-<?php echo esc_attr( $checkbox_index ); ?>" type="radio" 
												name="section-layout-<?php echo esc_attr( $checkbox_index ); ?>" 
												class="builder-edit-row-layout with-gap" value="fixed" title="Fixed"
											<?php
											checked( $section_attr['layout'], 'fixed', 1 );
											?> />
											<label for="section-fixed-<?php echo esc_attr( $checkbox_index ); ?>" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Grid Layout', 'rexpansive-builder' ); ?>">
												<i class="material-icons">&#xE8F1;<span class="rex-ripple"></span></i>
											</label>
											<input id="section-masonry-<?php echo esc_attr( $checkbox_index ); ?>" type="radio" 
												name="section-layout-<?php echo esc_attr( $checkbox_index ); ?>" 
												class="builder-edit-row-layout with-gap" value="masonry" title="Masonry"
											<?php
											checked( $section_attr['layout'], 'masonry', 1 );
											?> />
											<label for="section-masonry-<?php echo esc_attr( $checkbox_index ); ?>" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Masonry Layout', 'rexpansive-builder' ); ?>">
												<i class="material-icons">&#xE871;<span class="rex-ripple"></span></i>
											</label>
										</div>
	
									</div>
	
									<div class="builder-buttons col s4 center-align">
										<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e( 'Image', 'rexpansive-builder' ); ?>">
											<i class="material-icons rex-icon">p</i>
										</button>
										<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="text" data-position="bottom" data-tooltip="<?php _e( 'Text', 'rexpansive-builder' ); ?>">
											<i class="material-icons rex-icon">u</i>
										</button>
										<div class="builder-fab-row-widgets fixed-action-btn horizontal">
											<button class="builder-add btn-floating builder-show-widgets waves-effect waves-light light-blue darken-3">
												<i class="material-icons">add</i>
											</button>
											<ul>
												<li>
													<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="video" data-position="bottom" data-tooltip="<?php _e( 'Video', 'rexpansive-builder' ); ?>">
														<i class="material-icons">play_arrow</i>
													</button>
												</li>
												<li>
													<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="rexslider" data-position="bottom" data-tooltip="<?php _e( 'RexSlider', 'rexpansive' ); ?>">
														<i class="material-icons rex-icon">X</i>
													</button>
												</li>
												<li>
													<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="empty" data-position="bottom" data-tooltip="<?php _e( 'Block space', 'rexpansive-builder' ); ?>">
														<i class="material-icons rex-icon">H</i>
													</button>
												</li>
												<?php if( $this->settings['zak']['active'] == '1' ) { ?>
												<li>
													<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="expand" data-position="bottom" data-tooltip="<?php _e('Effect ZAK!', $this->plugin_name); ?>">
														<i class="material-icons rex-icon">I</i>
													</button>
												</li>
												<?php } ?>
											</ul>
										</div>
									</div>
									
									<!-- Icon button -->
									<div class="col s4 right-align builder-setting-buttons">
										<div class="background_section_preview btn-floating tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Row background', 'rexpansive-builder' ); ?>"<?php echo $section_bg_button_preview_style; ?>></div>
										<button class="btn-floating builder-section-config tooltipped waves-effect waves-light" data-position="bottom" data-tooltip="<?php _e('Row settings', 'rexpansive-builder'); ?>">
											<i class="material-icons">&#xE8B8;</i>
										</button>
										<div class="btn-flat builder-copy-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy row', 'rexpansive-builder'); ?>">
											<i class="material-icons grey-text text-darken-2">&#xE14D;</i>
										</div>
										<div class="btn-flat builder-move-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Move row', 'rexpansive-builder'); ?>">
											<i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
										</div>
									</div>
								</div>
								<div class="builder-row-edit">
									
									<div class="builder-elements">
										<div class="gridster">
											<ul <?php echo $section_bg_style; ?>>
												<?php
													if( !empty( $section_content ) ) :
														preg_match_all( "/$pattern/", $section_content, $result_block);
														foreach( $result_block[3] as $i => $attrs ) :
															$block_attr = shortcode_parse_atts( trim( $attrs ) );
	
															// Prepare the background block settings
	
															$background_block_setts = array(
																'color' => '',
																'image' => '',
																'url' => '',
																'bg_img_type' => '',
																'photoswipe' => '',
																'linkurl' => '',
																'video'		=>	'',
																'youtube'	=>	'',
																'block_custom_class' => '',
																'overlay_block_color' => '',
																'image_size' => '',
															);
															$style = ' style="';
															$classEmpty = '';
	
															if( array_key_exists('image_bg_block', $block_attr) && array_key_exists('type_bg_block', $block_attr) && $block_attr['image_bg_block'] != '' && $block_attr['type_bg_block'] == 'full' ) {
																$style .= 'background-image:url(' . wp_get_attachment_url ($block_attr['id_image_bg_block'] ) . ');';
																$background_block_setts['image'] = $block_attr['id_image_bg_block'];
																$background_block_setts['url'] = wp_get_attachment_url ($block_attr['id_image_bg_block'] );
																$background_block_setts['bg_img_type'] = $block_attr['type_bg_block'];
													
																$classEmpty = 'hidden';
															} else if( array_key_exists('color_bg_block', $block_attr) && array_key_exists('type_bg_block', $block_attr) && $block_attr['color_bg_block'] != '' && $block_attr['type_bg_block'] != 'full' ) {
																$style .= 'background-color:' . $block_attr['color_bg_block'] . ';';
													
																if( array_key_exists('type_bg_block', $block_attr) && $block_attr['type_bg_block'] == 'natural' ) {
																	$style .= 'background-image:url(' . wp_get_attachment_url( $block_attr['id_image_bg_block'] ) . ');';
																}
													
																$background_block_setts['color'] = $block_attr['color_bg_block'];
																$background_block_setts['image'] = $block_attr['id_image_bg_block'];
																$background_block_setts['url'] = wp_get_attachment_url( $block_attr['id_image_bg_block'] );
																$background_block_setts['bg_img_type'] = $block_attr['type_bg_block'];
																$classEmpty = 'hidden';
															} else if( array_key_exists('type_bg_block', $block_attr) && $block_attr['type_bg_block'] == 'natural' ) {
																	if( array_key_exists('color_bg_block', $block_attr) && array_key_exists('type_bg_block', $block_attr) && $block_attr['color_bg_block'] != '' && $block_attr['type_bg_block'] != 'full' ) {
																		$style .= 'background-color:' . $block_attr['color_bg_block'] . ';';
																	}
																$style .= 'background-image:url(' . wp_get_attachment_url ($block_attr['id_image_bg_block'] ) . ');';
																$background_block_setts['image'] = $block_attr['id_image_bg_block'];
																$background_block_setts['url'] = wp_get_attachment_url ($block_attr['id_image_bg_block'] );
																$background_block_setts['bg_img_type'] = $block_attr['type_bg_block'];
													
																$classEmpty = 'hidden';
															}
													
															if(array_key_exists('video_bg_id', $block_attr) && $block_attr['video_bg_id'] != 'undefined') :
																$background_block_setts['video'] = $block_attr['video_bg_id'];
															else :
																$background_block_setts['video'] = '';
															endif;
													
															if(array_key_exists('video_bg_url', $block_attr) && $block_attr['video_bg_url'] != 'undefined') :
																$background_block_setts['youtube'] = $block_attr['video_bg_url'];
															else :
																$background_block_setts['youtube'] = '';
															endif;
													
															if(array_key_exists('video_bg_url_vimeo', $block_attr) && $block_attr['video_bg_url_vimeo'] != 'undefined') :
																$background_block_setts['vimeo'] = $block_attr['video_bg_url_vimeo'];
															else :
																$background_block_setts['vimeo'] = '';
															endif;
													
															$video_has_audio = '0';
															if(array_key_exists('video_has_audio', $block_attr) && $block_attr['video_has_audio'] != 'undefined') :
																$video_has_audio =  $block_attr['video_has_audio'];
															endif;
													
															if(array_key_exists('photoswipe', $block_attr) && $block_attr['photoswipe'] != 'undefined') :
																$background_block_setts['photoswipe'] = $block_attr['photoswipe'];
															else :
																$background_block_setts['photoswipe'] = '';
															endif;
													
															if(array_key_exists('linkurl', $block_attr) && $block_attr['linkurl'] != 'undefined') :
																$background_block_setts['linkurl'] = $block_attr['linkurl'];
															else :
																$background_block_setts['linkurl'] = '';
															endif;
													
															if(array_key_exists('image_size', $block_attr) && $block_attr['image_size'] != 'undefined') :
																$background_block_setts['image_size'] = $block_attr['image_size'];
															else :
																$background_block_setts['image_size'] = '';
															endif;
													
															$element_preview_position_classes = '';
													
															if(array_key_exists('block_custom_class', $block_attr) && $block_attr['block_custom_class'] != 'undefined') :
																$background_block_setts['block_custom_class'] = $block_attr['block_custom_class'];
																$block_custom_classes = $block_attr['block_custom_class'];
																$matches = preg_match_all("/rex-flex-(top|middle|bottom|left|center|right)/", $block_custom_classes, $content_position);
																if($matches != 0) :
																	$element_preview_position_classes = ' element-content-positioned';
																	foreach ($content_position[0] as $key => $class) :
																		switch ($class) :
																			case 'rex-flex-top':
																				$element_preview_position_classes .= ' element-content-positioned-top';
																				break;
																			case 'rex-flex-middle':
																				$element_preview_position_classes .= ' element-content-positioned-middle';
																				break;
																			case 'rex-flex-bottom':
																				$element_preview_position_classes .= ' element-content-positioned-bottom';
																				break;
																			case 'rex-flex-left':
																				$element_preview_position_classes .= ' element-content-positioned-left';
																				break;
																			case 'rex-flex-center':
																				$element_preview_position_classes .= ' element-content-positioned-center';
																				break;
																			case 'rex-flex-right':
																				$element_preview_position_classes .= ' element-content-positioned-right';
																				break;
																			default:
																				break;
																		endswitch;
																	endforeach;
																endif;
															else :
																$background_block_setts['block_custom_class'] = '';
																$block_custom_classes = '';
															endif;
													
															if(array_key_exists('block_padding', $block_attr) && $block_attr['block_padding'] != 'undefined') :
																$content_padding_settings = $block_attr['block_padding'];
															else :
																$content_padding_settings = '';
															endif;
													
															if(array_key_exists('overlay_block_color', $block_attr) && $block_attr['overlay_block_color'] != 'undefined') :
																$background_block_setts['overlay_block_color'] = $block_attr['overlay_block_color'];
															endif;
													
															$style .= '"';
													
															$define_borders = ' with-border';
															if( $background_block_setts['color'] != '' || ( $background_block_setts['image'] != '' && $background_block_setts['bg_img_type'] != 'natural' ) ) :
																if( $background_block_setts['color'] != 'rgba(255,255,255,0)' ) :
																	$define_borders = ' no-border';
																endif;
															endif;
													
															$temp_block_setts = $background_block_setts;
													
															$background_block_setts = json_encode( $background_block_setts );
													
															// Preapre the zak effect settings
															$zak_effect_setts = array(
																'side' => '',
																'background_url' => '',
																'background_id' => '',
																'title' => '',
																'icon_url' => '',
																'icon_id' => '',
																'content' => '',
																'foreground_url' => '',
																'foreground_id' => ''
															);
															if(array_key_exists('zak_side', $block_attr) && $block_attr['zak_side'] != 'undefined') {
																$zak_effect_setts['side'] = $block_attr['zak_side'];
															}
													
															if(array_key_exists('zak_background', $block_attr) && $block_attr['zak_background'] != 'undefined') {
																$zak_effect_setts['background_url'] = wp_get_attachment_url( $block_attr['zak_background'] );
																$zak_effect_setts['background_id'] = $block_attr['zak_background'];
															}
													
															if(array_key_exists('zak_title', $block_attr) && $block_attr['zak_title'] != 'undefined') {
																$zak_effect_setts['title'] = $block_attr['zak_title'];
															}
													
															if(array_key_exists('zak_icon', $block_attr) && $block_attr['zak_icon'] != 'undefined') {
																$zak_effect_setts['icon_url'] = ( $block_attr['zak_icon'] ) ? wp_get_attachment_url( $block_attr['zak_icon'] ) : '';
																$zak_effect_setts['icon_id'] = $block_attr['zak_icon'];
															}
															$zak_effect_setts['content'] = ($block_content);
													
															if(array_key_exists('zak_foreground', $block_attr) && $block_attr['zak_foreground'] != 'undefined') :
																if( '' != $block_attr['zak_foreground'] ) :
																	$zak_effect_setts['foreground_url'] = wp_get_attachment_url( $block_attr['zak_foreground'] );
																	$zak_effect_setts['foreground_id'] = $block_attr['zak_foreground'];
																endif;
															endif;														
													
															//var_dump(mysql_real_escape_string($result_block[5][$i]));
													
															$zak_effect_setts = json_encode( $zak_effect_setts );
													
															$block_content = $result_block[5][$i];																			
													
															$block_content = preg_replace('/^<\/p>/', '', $block_content);
															$block_content = preg_replace('/<p>+$/', '', $block_content);
													
															$slider_data_markup = "";
															$actions_args = array(
																'block_has_slider' => false
															);
															if( "rexslider" == $block_attr['type'] ) {
																preg_match_all( "/$pattern/", $block_content, $block_content_parsed);
																$slider_settings = shortcode_parse_atts(trim($block_content_parsed[3][0]));
																$slider_data_markup .= ' data-block-slider-id="' . esc_attr( $slider_settings['slider_id'] ) . '"';
																$actions_args['block_has_slider'] = true;
															}
															ob_start();
														?>
															<li id="<?php echo esc_attr( $block_attr['id'] ); ?>" class="<?php echo esc_attr( $block_attr['type'] ); echo esc_attr( $define_borders ); ?> item z-depth-1 hoverable svg-ripple-effect<?php if( isset( $block_attr['type_bg_block'] ) && $block_attr['type_bg_block'] == 'natural') : echo ' block-is-natural'; endif; ?>" data-block_type="<?php echo esc_attr( $block_attr['type'] ); ?>" data-col="<?php echo esc_attr( $block_attr['col'] ); ?>" data-row="<?php echo esc_attr( $block_attr['row'] ); ?>" data-sizex="<?php echo esc_attr( $block_attr['size_x'] ); ?>" data-sizey="<?php echo esc_attr( $block_attr['size_y'] ); ?>" data-bg_settings='<?php echo $background_block_setts; ?>' data-block-custom-classes="<?php echo esc_attr( $block_custom_classes ); ?>" data-content-padding="<?php echo esc_attr( $content_padding_settings ); ?>" data-video-has-audio="<?php echo esc_attr( $video_has_audio ); ?>"<?php echo $slider_data_markup; ?>>
																	<div class="element-actions">
																		<div class="builder-fab-row-widgets actions-center-icons fixed-action-btn horizontal">
																			<button class="btn-floating builder-show-widgets waves-effect waves-light light-blue darken-3">
																				<i class="material-icons">add</i>
																			</button>
																			<ul>
																				<li class="edit_handler btn-floating waves-effect waves-light tooltipped<?php if( $block_attr['type_bg_block'] == 'natural') : echo ' hide-edit-handler'; endif; ?>" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive-builder'); ?>"
																				<?php
																					if( $block_attr['type_bg_block'] == 'natural') :
																						echo ' style="display:none;"';
																					endif;
																				?>><i class="material-icons rex-icon">u</i>
																				</li>
																				<li class="background_handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive-builder'); ?>">
																					<i class="material-icons">&#xE8B8;</i>
																				</li>
																				<li class="copy-handler btn-floating grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive-builder'); ?>">
																					<i class="material-icons white-text">&#xE14D;</i>
																				</li>
																			</ul>
																		</div>
																		<div class="actions-center-icons">
																			<div class="edit_handler btn-floating waves-effect waves-light tooltipped<?php if( $block_attr['type_bg_block'] == 'natural') : echo ' hide-edit-handler'; endif; ?>" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive-builder'); ?>"
																			<?php
																				if( $block_attr['type_bg_block'] == 'natural') :
																					echo ' style="display:none;"';
																				endif;
																			?>
																			><i class="material-icons rex-icon">u</i></div>
																			<div class="background_handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive-builder'); ?>">
																				<i class="material-icons">&#xE8B8;</i>
																			</div>
																			<br>
																			<div class="copy-handler btn-floating grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive-builder'); ?>">
																				<i class="material-icons white-text">&#xE14D;</i>
																			</div>
																		</div>
																		<div class="delete_handler btn-floating waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexpansive-builder'); ?>">
																			<i class="material-icons white-text">&#xE5CD;</i>
																		</div>
																	</div>
																	<?php
				switch( $block_attr['type'] ) {
					case 'image':
				?>
				<div class="element-data">
					<textarea class="data-text-content" display="none"><?php echo esc_textarea( $block_content ); ?></textarea>
				</div>
				<div class="element-preview-wrap<?php echo $element_preview_position_classes; ?>"<?php echo $style; ?>>
					<div class="element-preview">
					<?php 
						if( $block_attr['type_bg_block'] == '' && $block_attr['color_bg_block'] == '' ) { 
							$control = true;
						} else {
							$control = false;
						}
					?>
						<div class="backend-image-preview" data-image_id="<?php esc_attr( $block_attr['id_image_bg_block'] ); ?>" <?php if($control) { echo 'style="display:none;"'; } ?>>
							<?php echo $block_content; ?>
						</div>
					</div>
				</div>
				<?php
						break;
					case 'text':
					case 'rexslider':
				?>
				<div class="element-data">
					<textarea class="data-text-content" display="none"><?php echo esc_textarea( $block_content ); ?></textarea>
				</div>
				<div class="element-preview-wrap<?php echo $element_preview_position_classes; ?>"<?php echo $style; ?>>
						<div class="element-preview"><?php echo $block_content; ?></div>
				<?php
					//endif;
				?>
				</div>
				<?php
						break;
					case 'empty':
				?>
				<div class="element-data">
					<textarea class="data-text-content" display="none"><?php echo esc_textarea( $block_content ); ?></textarea>
				</div>
				<div class="element-preview-wrap<?php echo $element_preview_position_classes; ?>"<?php if($style) { echo $style; } ?>>
					<div class="element-preview">
						<div class="element-preview"><?php echo $block_content; ?></div>
					</div>
				</div>
				<?php
						break;
					case 'video':
				?>
				<div class="element-data">
					<textarea class="data-text-content" display="none"><?php echo esc_textarea( $block_content ); ?></textarea>	
				</div>
				<div class="element-preview-wrap<?php echo $element_preview_position_classes; ?>"<?php echo $style; ?>>
					<div class="element-preview"><?php echo $block_content; ?></div>	
				</div>
				<?php
					break;
				case 'expand':
				?>
				<div class="element-data">
					<input class="data-zak-content" type="hidden" <?php echo 'data-zak-content=\'' . $zak_effect_setts . '\'' ?>>
				</div>
				<div class="element-preview"<?php echo $style; ?>>
					<?php
						if( 'left' == $block_attr['zak_side'] ) :
					?>
						<div class="zak-block zak-image-side">
							<img src="<?php echo wp_get_attachment_url( $block_attr['zak_background'] ); ?>">
						</div>
						<div class="zak-block zak-text-side">
							<h2><?php echo $block_attr['zak_title']; ?></h2>
							<?php if( $block_attr['zak_icon'] ) : ?>
								<img src="<?php echo wp_get_attachment_url( $block_attr['zak_icon'] ); ?>" alt="">
							<?php endif; ?>
							<div class="text-preview"><?php echo $block_content; ?></div>
						</div>
					<?php
						else :
					?>
						<div class="zak-block zak-text-side">
							<h2><?php echo $block_attr['zak_title']; ?></h2>
							<?php if( $block_attr['zak_icon'] ) : ?>
								<img src="<?php echo wp_get_attachment_url( $block_attr['zak_icon'] ); ?>" alt="">
							<?php endif; ?>
							<div class="text-preview"><?php echo $block_content; ?></div>
						</div>
						<div class="zak-block zak-image-side">
							<img src="<?php echo wp_get_attachment_url( $block_attr['zak_background'] ); ?>">
						</div>
					<?php
						endif;
					?>
				</div>
				<?php
					break;
				case 'default':
					break;
			}
		?>	
	<div class="element-visual-info<?php
		if('' != $temp_block_setts['youtube'] || '' != $temp_block_setts['video'] || '' != $temp_block_setts['vimeo'] ) :
			echo ' ' . 'rex-active-video-notice';
		endif;
	?>"<?php 
		if( '' != $temp_block_setts['overlay_block_color'] ) :
			echo ' style="background-color:' . esc_attr( $temp_block_setts['overlay_block_color'] ) . '"';
		endif;
	?>>
		<div class="vert-wrap">
			<div class="vert-elem">
				<i class="material-icons rex-icon rex-notice rex-video-notice">G</i>
			</div>
		</div>
	</div>
	<div class="el-visual-size"><span><?php echo $block_attr['size_x'] . 'x' . $block_attr['size_y']; ?></span></div>
			</li>
															<?php
														endforeach;
												?>
												<?php endif; ?>
											</ul>
											<div class="section-visual-info<?php if($section_has_overlay) echo ' active-section-visual-info'; ?>"<?php if($section_has_overlay) echo $section_overlay_style; ?>></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<?php
						$checkbox_index++;
					endif;
				endforeach;
			else :
			$defaultsectionproperties = json_encode( array(
					"color"			=>	"",
					"image"			=>	"",
					"url"			=>	"",
					"bg_img_type"	=>	"",
					"video"			=>	"",
					"youtube"		=>	"",
				) );
				$defaultidproperties = json_encode( array(
					"section_id"	=>	"",
					"icon_id"		=>	"",
					"icon_url"		=>	"",
					"image_id"		=>	"",
					"image_url"		=>	"",
				) );
				$defaultsectionconfigs = json_encode(array(
					'gutter' => '20',
					'isFull' => '',
					'custom_classes' => '',
					'section_width'	=>	'',
				));
			?>
				<div class="builder-row builder-new-row clearfix z-depth-1" data-count="0" data-gridcontent="" data-gridproperties="<?php echo htmlspecialchars( $defaultsectionproperties ); ?>" data-griddimension="full" data-layout="fixed" data-sectionid="" data-section-overlay-color="" data-backresponsive="<?php echo htmlspecialchars( $defaultsectionconfigs ); ?>">
					<div class="builder-row-contents">
						<div class="builder-edit-row-header">
							<button class="btn-floating builder-delete-row waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete row', 'rexpansive-builder'); ?>">
								<i class="material-icons white-text">&#xE5CD;</i>
							</button>
						</div>
						<div class="builder-edit-row-wrap clearfix row valign-wrapper">
							<div class="col s4">
								<div class="rex-edit-dimension-wrap">
									<input id="section-full-0" type="radio" 
										name="section-dimension-0" 
										class="builder-edit-row-dimension with-gap" value="full" checked title="Full" />
									<label for="section-full-0" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Full', 'rexpansive-builder' ); ?>">
										<!--<i class="material-icons">&#xE30B;</i>-->
										<i class="material-icons rex-icon">v<span class="rex-ripple"></i>
									</label>
									<input id="section-boxed-0" type="radio" 
										name="section-dimension-0" 
										class="builder-edit-row-dimension with-gap" value="boxed" title="Boxed" />
									<label for="section-boxed-0" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Boxed', 'rexpansive-builder' ); ?>">
										<!--<i class="material-icons">&#xE30C;</i>-->
										<i class="material-icons rex-icon">t<span class="rex-ripple"></i>
									</label>
								</div>
								<div class="rex-edit-layout-wrap" style="display:none;">
									<input id="section-fixed-0" type="radio" 
										name="section-layout-0" 
										class="builder-edit-row-layout with-gap" value="fixed" checked title="Grid Layout" />
									<label for="section-fixed-0" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Grid Layout', 'rexpansive-builder' ); ?>">
										<i class="material-icons">&#xE8F1;<span class="rex-ripple"></span></i>
									</label>
									<input id="section-masonry-0" type="radio" 
										name="section-layout-0" 
										class="builder-edit-row-layout with-gap" value="masonry" title="Masonry Layout" />
									<label for="section-masonry-0"  class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Masonry Layout', 'rexpansive-builder' ); ?>">
										<i class="material-icons">&#xE871;<span class="rex-ripple"></span></i>
									</label>
								</div>
							</div>
							
							<div class="builder-buttons col s4 center-align">
								<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e( 'Image', 'rexpansive-builder' ); ?>">
									<i class="material-icons rex-icon">p</i>
								</button>
								<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="text" data-position="bottom" data-tooltip="<?php _e( 'Text', 'rexpansive-builder' ); ?>">
									<i class="material-icons rex-icon">u</i>
								</button>
								<div class="builder-fab-row-widgets fixed-action-btn horizontal">
									<button class="builder-add btn-floating builder-show-widgets waves-effect waves-light light-blue darken-3">
										<i class="material-icons">add</i>
									</button>
									<ul>
										<li>
											<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="video" data-position="bottom" data-tooltip="<?php _e( 'Video', 'rexpansive-builder' ); ?>">
												<i class="material-icons">play_arrow</i>
											</button>
										</li>
										<li>
											<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="rexslider" data-position="bottom" data-tooltip="<?php _e( 'RexSlider', 'rexpansive' ); ?>">
												<i class="material-icons rex-icon">X</i>
											</button>
										</li>
										<li>
											<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="empty" data-position="bottom" data-tooltip="<?php _e( 'Block space', 'rexpansive-builder' ); ?>">
												<i class="material-icons rex-icon">H</i>
											</button>
										</li>
										<?php if( $this->settings['zak']['active'] == '1' ) { ?>
										<li>
											<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="expand" data-position="bottom" data-tooltip="<?php _e('Effect ZAK!', $this->plugin_name); ?>">
												<i class="material-icons rex-icon">I</i>
											</button>
										</li>
										<?php } ?>
									</ul>
								</div>
							</div>
							
							<div class="col s4 right-align builder-setting-buttons">
								<div class="background_section_preview btn-floating tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Row background', 'rexpansive-builder' ); ?>"></div>
								<button class="btn-floating builder-section-config tooltipped" data-position="bottom" data-tooltip="<?php _e('Row settings', 'rexpansive-builder'); ?>">
									<i class="material-icons white-text">&#xE8B8;</i>
								</button>
								<div class="btn-flat builder-copy-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy row', 'rexpansive-builder'); ?>">
									<i class="material-icons grey-text text-darken-2">&#xE14D;</i>
								</div>
								<div class="btn-flat builder-move-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Move row', 'rexpansive-builder'); ?>">
									<i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
								</div>
							</div>
						</div>
						<div class="builder-row-edit">
							<div class="builder-buttons-new-row col s3">
								<div>
									<button class="btn light-blue darken-1 builder-add waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e('Image', 'rexpansive-builder'); ?>">
										<i class="material-icons rex-icon white-text">p</i>
									</button>
									<button class="btn light-blue darken-1 builder-add waves-effect waves-light tooltipped" value="text" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive-builder'); ?>">
										<i class="material-icons rex-icon white-text">u</i>
									</button>
									<br>
									<div class="builder-fab-row-widgets fixed-action-btn horizontal">
										<button class="builder-add btn-floating builder-show-widgets waves-effect waves-light light-blue darken-3">
											<i class="material-icons">add</i>
										</button>
										<ul>
											<li>
												<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="video" data-position="bottom" data-tooltip="<?php _e( 'Video', 'rexpansive-builder' ); ?>">
													<i class="material-icons">play_arrow</i>
												</button>
											</li>
											<li>
												<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="rexslider" data-position="bottom" data-tooltip="<?php _e( 'RexSlider', 'rexpansive-builder' ); ?>">
													<i class="material-icons rex-icon">X</i>
												</button>
											</li>
											<li>
												<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="empty" data-position="bottom" data-tooltip="<?php _e( 'Block space', 'rexpansive-builder' ); ?>">
													<i class="material-icons rex-icon">z</i>
												</button>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="builder-elements">
								<div class="gridster">
									<ul>
									</ul>
									<div class="section-visual-info"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			
			<?php
				endif;
			?>
				
		<?php
		endif;
	
		exit();
	}

	/**
	 * is_edit_page 
	 * function to check if the current page is a post edit page
	 * 
	 * @author Ohad Raz <admin@bainternet.info>
	 * 
	 * @param  string  $new_edit what page to check for accepts new - new post page ,edit - edit post page, null for either
	 * @return boolean
	 */
   	private function is_edit_page($new_edit = null){
		global $pagenow;
		//make sure we are on the backend
		if (!is_admin()) return false;
	
	
		if($new_edit == "edit") {
			return in_array( $pagenow, array( 'post.php' ) );
		} elseif($new_edit == "new") {//check for new post page
			return in_array( $pagenow, array( 'post-new.php' ) );
		} else {//check for either new or edit
			return in_array( $pagenow, array( 'post.php', 'post-new.php' ) );
		}
	}
	   
	/**
	 * Allowing XML import
	 *
	 * @param Array $mimes
	 * @return Array
	 * @since 1.1.2
	 */
	function register_xml_json_mime_type( $mimes ) {
		$mimes['xml'] = 'application/xml';
		$mimes['json'] = 'application/json';
		return $mimes;
	}

	/**
	 * Import some content
	 *
	 * @return void
	 * @since 1.1.2
	 */
   	public function import_models() {
		if(isset( $_GET['builder-import-models'] ) && 'true' == $_GET['builder-import-models'] && is_admin()) {
			$imported = get_option( 'rexbuilder_models_imported' );
			if( "1" != $imported ) {
				require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-import-utilities.php';
				require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-import-xml-content.php';

				$forms_url = 'http://demo.neweb.info/wp-content/uploads/rexpansive-builder-uploads/contact-forms.xml';
				$xml_file = Rexbuilder_Import_Utilities::upload_media_file( $forms_url, 'xml' );

				if( file_exists( $xml_file['file'] ) ) {
		
					$Xml = new Rexbuilder_Import_Xml_Content( $xml_file['file'] );
			
					wp_defer_term_counting( true );
					wp_defer_comment_counting( true );
			
					wp_suspend_cache_invalidation( true );
			
					$Xml->run_import_all();
			
					wp_suspend_cache_invalidation( false );
			
					wp_defer_term_counting( false );
					wp_defer_comment_counting( false );
					
					update_option( 'rexbuilder_models_imported', '1' );
					Rexbuilder_Import_Utilities::remove_media_file( $xml_file['file'] );

					?><p><?php _e( 'CF7 Models correctly imported', 'rexpansive-builder' ); ?></p><?php
				}
			} else {
				?><p><?php _e( 'CF7 Models already imported', 'rexpansive-builder' ); ?></p><?php
			}
		}
	}
}
