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

		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];

			// Call the construction of the metabox
			require_once plugin_dir_path( __FILE__ ) . '/class-rexbuilder-meta-box.php';

			foreach( $post_to_activate as $key => $value ) :

				if( 1 == $value ) :

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
							'default' => 'true',
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
							'id' => '_rexbuilder',
							'type'	=>	'rexpansive_plugin',
						),
					) );

				endif;

			endforeach;

		endif;
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

		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$page_info->id] ) ) : 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) :
					wp_enqueue_style( 'material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), $this->version, 'all' );
					wp_enqueue_style( 'materialize', plugin_dir_url( __FILE__ ) . 'css/materialize.min.css', array(), $this->version, 'all' );
					
					wp_enqueue_style( 'spectrum-style', plugin_dir_url( __FILE__ ) . 'spectrum/spectrum.css', array(), $this->version, 'all' );

					wp_enqueue_style( 'font-awesome', plugin_dir_url( __FILE__ ) . 'font-awesome-4.3.0/css/font-awesome.min.css', array(), $this->version, 'all' );
					wp_enqueue_style( 'rex-custom-fonts', plugin_dir_url( __FILE__ ) . 'rexpansive-font/font.css', array(), $this->version, 'all' );

					wp_enqueue_style( 'gridster-style', plugin_dir_url( __FILE__ ) . 'css/jquery.gridster.css', array(), $this->version, 'all' );
					wp_enqueue_style( 'custom-editor-buttons-style', plugin_dir_url( __FILE__ ) . 'css/rex-custom-editor-buttons.css', array(), $this->version, 'all' );
					wp_enqueue_style( 'rexbuilder-style', plugin_dir_url( __FILE__ ) . 'css/builder.css', array(), $this->version, 'all' );
					
				endif;
			endif;
		endif;
	}

	/**
	 * Register the stylesheets for the admin area for production version
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles_production( $hook ) {
		$page_info = get_current_screen();

		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$page_info->id] ) ) : 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) :
					wp_enqueue_style( 'material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), $this->version, 'all' );

					wp_enqueue_style( 'font-awesome', plugin_dir_url( __FILE__ ) . 'font-awesome-4.3.0/css/font-awesome.min.css', array(), $this->version, 'all' );
					wp_enqueue_style( 'rex-custom-fonts', plugin_dir_url( __FILE__ ) . 'rexpansive-font/font.css', array(), $this->version, 'all' );

					wp_enqueue_style( 'admin-style', plugin_dir_url( __FILE__ ) . 'css/admin.css', array(), $this->version, 'all' );
				endif;
			endif;
		endif;
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts( $hook ) {

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

		// Retrieve the page information
		// Get current screen works only from 3.1, but allows me to retrieve more specific information
		// compared to the $hook.
		$page_info = get_current_screen();

		if( isset( $this->plugin_options['post_types'] ) ) :

			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$page_info->id] ) ) : 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) :
					wp_enqueue_media();
					wp_enqueue_script('jquery');
					wp_enqueue_script("jquery-ui-draggable");

					wp_enqueue_script( 'materialize-scripts', plugin_dir_url( __FILE__ ) . 'materialize/js/materialize.js', array('jquery'), $this->version, true );
					wp_enqueue_script( 'gridster', plugin_dir_url( __FILE__ ) . 'js/jquery.gridster.js', array('jquery'),  $this->version, true );
					
					wp_enqueue_script( 'spectrum-scripts', plugin_dir_url( __FILE__ ) . 'spectrum/spectrum.js', array('jquery'),  $this->version, true );

					wp_enqueue_script( 'ace-scripts', plugin_dir_url( __FILE__ ) . 'ace/src-min-noconflict/ace.js', array('jquery'),  $this->version, true );
					wp_enqueue_script( 'ace-mode-css-scripts', plugin_dir_url( __FILE__ ) . 'ace/src-min-noconflict/mode-css.js', array('jquery'),  $this->version, true );

					wp_enqueue_script( 'rexbuilder', plugin_dir_url( __FILE__ ) . 'js/rexbuilder.js', array('jquery'),  $this->version, true );
					wp_localize_script( 'rexbuilder', '_plugin_backend_settings', array(
						'activate_builder'	=>	'true',
					) );
					wp_localize_script( 'rexbuilder', 'rexajax', array(
						'ajaxurl'	=>	admin_url( 'admin-ajax.php' ),
						'rexnonce'	=>	wp_create_nonce( 'rex-ajax-call-nonce' ),
					) );
					wp_enqueue_script( 'rexbuilder-admin', plugin_dir_url( __FILE__ ) . 'js/rexbuilder-admin.js', array( 'jquery' ), $this->version, true );
				endif;
			endif;
		endif;
	}

	/**
	 * Register the JavaScript for the admin area for production version
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts_production( $hook ) {
		$page_info = get_current_screen();

		if( isset( $this->plugin_options['post_types'] ) ) :

			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$page_info->id] ) ) : 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) :
					wp_enqueue_media();
					wp_enqueue_script('jquery');
					wp_enqueue_script("jquery-ui-draggable");

					wp_enqueue_script( 'ace-scripts', plugin_dir_url( __FILE__ ) . 'ace/src-min-noconflict/ace.js', array('jquery'),  $this->version, true );
					wp_enqueue_script( 'ace-mode-css-scripts', plugin_dir_url( __FILE__ ) . 'ace/src-min-noconflict/mode-css.js', array('jquery'),  $this->version, true );

					wp_enqueue_script( 'admin-plugins', plugin_dir_url( __FILE__ ) . 'js/plugins.js', array('jquery'),  $this->version, true );
					wp_localize_script( 'admin-plugins', '_plugin_backend_settings', array(
						'activate_builder'	=>	'true',
					) );
					wp_localize_script( 'admin-plugins', 'rexajax', array(
						'ajaxurl'	=>	admin_url( 'admin-ajax.php' ),
						'rexnonce'	=>	wp_create_nonce( 'rex-ajax-call-nonce' ),
					) );
					wp_enqueue_script( 'rexbuilder-admin', plugin_dir_url( __FILE__ ) . 'js/rexbuilder-admin.js', array( 'jquery' ), $this->version, true );
				endif;
			endif;
		endif;
	}

	/**
	 *	Register the administration menu for the plugin.
	 *
	 * 	@since    1.0.0
	 */
	public function add_plugin_options_menu() {
		add_menu_page( 'Rexpansive Builder', 'Rexpansive Builder', 'manage_options', $this->plugin_name, array( $this, 'display_plugin_options_page' ), plugin_dir_url( __FILE__ ) . 'img/favicon.ico', '80.5' );
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
				'title'	=>	__( '<img src="'. plugin_dir_url( __FILE__ ) . 'img/favicon.ico" style="vertical-align:middle;margin-right:5px" alt="Rexpansive Builder" title="Rexpansive Builder" />Rexpansive Builder' ),
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
	 *	Add notifier update page
	 *
	 *	@since	1.0.3
	 */
	public function update_notifier_menu() {  
		$xml = $this->get_latest_theme_version(21600); // This tells the function to cache the remote call for 21600 seconds (6 hours)
		
		$theme_data = get_plugin_data( WP_PLUGIN_DIR . '/rexpansive-builder/rexpansive-builder.php' ); // Get theme data from style.css (current version is what we want)
		
		if(version_compare($theme_data['Version'], $xml->latest) == -1) {
			add_dashboard_page( $theme_data['Name'] . 'Plugin Updates', $theme_data['Name'] . '<span class="update-plugins count-1"><span class="update-count">Updates</span></span>', 'administrator', strtolower($theme_data['Name']) . '-updates', array( $this, 'update_notifier' ) );
		}
	}

	/**
	 *	Render the page
	 */
	public function update_notifier() { 
		$xml = $this->get_latest_theme_version(21600); // This tells the function to cache the remote call for 21600 seconds (6 hours)
		$theme_data = get_plugin_data( WP_PLUGIN_DIR . '/rexpansive-builder/rexpansive-builder.php' ) // Get theme data from style.css (current version is what we want) ?>

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
		$notifier_file_url = 'https://rexpansive.neweb.info/notifier-builder-premium.xml';
		
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
	 */
	public function add_switch_under_post_title() {
		$page_info = get_current_screen();

		if( isset( $this->plugin_options['post_types'] ) ) :

			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$page_info->id] ) ) : 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) :
	?>
		<div class="builder-heading rexpansive-builder rexbuilder-materialize-wrap">
			<img src="<?php echo plugin_dir_url( __FILE__ ); ?>img/rexpansive-builder.png" alt="logo" width="260" />
			<div class="builder-switch-wrap">
				<div class="switch">
					<label>
						<input type="checkbox" id="builder-switch" checked />
						<span class="lever"></span>
					</label>
				</div>
			</div>
		</div>
	<?php
				endif;
			endif;
		endif;
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
			$post_to_activate = $this->plugin_options['post_types'];
			if( isset( $post_to_activate[$page_info->id] ) ) : 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) :

					include_once( 'partials/rexbuilder-modals-display.php' );

				endif;
			endif;
		}
	}

	/**
	 * Create the templates for the builder used by the scripts.
	 *
	 * @since    1.0.0
	 */
	public function create_builder_templates() {
		$page_info = get_current_screen();

		if( isset( $this->plugin_options['post_types'] ) ) :

			$post_to_activate = $this->plugin_options['post_types'];

			if( isset( $post_to_activate[$page_info->id] ) ) : 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) :

					include_once( 'partials/rexbuilder-templates.php' );

				endif;
			endif;
		endif;
	}

	/**
	 * Function that adds the scripts for the handle of the custom buttons.
	 *
	 * @since    1.0.0
	 */
	public function rexbuilder_add_tinymce_plugin( $plugin_array ) {
		$plugin_array['rexbuilder_textfill_button'] = plugin_dir_url( __FILE__ ) . 'js/textfill-button.js';
		//$plugin_array['rexbuilder_animation_button'] = plugin_dir_url( __FILE__ ) . 'js/animation-button.js';
		$plugin_array['rexbuilder_embed_video_button'] = plugin_dir_url( __FILE__ ) . 'js/embed-video.js';
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
			if( $this->check_post_exists( (int)$slider_id ) ) {

				$slider_animation = get_field( '_rex_enable_banner_animation', $slider_id );
				$slider_prev_next = get_field( '_rex_enable_banner_prev_next', $slider_id );
				$slider_dots = get_field( '_rex_enable_banner_dots', $slider_id );

				$rexslider_attrs = array(
					'auto_start' => ( is_array( $slider_animation ) ? 'true' : ( "0" == $slider_animation ? 'true' : 'false' ) ),
					'prev_next' => ( is_array( $slider_prev_next ) ? 'true' : ( "0" == $slider_prev_next ? 'true' : 'false' ) ),
					'dots' => ( is_array( $slider_dots ) ? 'true' : ( "0" == $slider_dots ? 'true' : 'false' ) ),
				);

				$slider_gallery = get_field( '_rex_banner_gallery', $slider_id );

				$slides_markup = "";

				$re = '/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';

				foreach( $slider_gallery as $j => $slide ) {

					$slide_content = $slide['_rex_banner_gallery_image_title'];
					$slide_content = preg_replace('/^<\/p>/', '', $slide_content);
					$slide_content = preg_replace('/<p>+$/', '', $slide_content);

					$video_type = "";
					$video_info_data = "";
					preg_match($re, $slide['_rex_banner_gallery_video'], $matches, PREG_OFFSET_CAPTURE, 0);
					if( count($matches) > 0 ) {
						if( false !== strpos( $slide['_rex_banner_gallery_video'], "youtu" ) ) {
							$video_type = 'youtube';
							$video_info_data = $slide['_rex_banner_gallery_video'];
						} else if( false !== strpos( $slide['_rex_banner_gallery_video'], "vimeo" ) ) {
							$video_type = 'vimeo';
							$video_info_data = $slide['_rex_banner_gallery_video'];
						}
					} else if( $slide['_rex_banner_gallery_video_mp4'] ) {
						$video_type = 'mp4';
						$video_info_data = $slide['_rex_banner_gallery_video_mp4']['id'];
					}

					ob_start();
	?>
<div class="col rex-slider__slide rex-modal-content__modal-area__row" data-slider-slide-id="<?php echo $j ?>" data-block_type="slide">
	<div class="valign-wrapper space-between-wrapper">
		<button class="rex-slider__slide-index btn-circle btn-small btn-bordered grey-border border-darken-2 waves-effect waves-light white grey-text text-darken-2"><?php echo esc_attr( $j + 1 ); ?></button>

		<div class="rex-button-with-plus">
			<button class="rex-slider__slide-edit rex-slider__slide__image-preview btn-floating waves-effect waves-light tooltipped grey darken-2<?php echo ( isset( $slide['_rex_banner_gallery_image']['url'] ) ? ' rex-slider__slide__image-preview--active' : '' ); ?>" value="edit-slide" data-position="bottom" data-tooltip="<?php _e( 'Slide', 'rexpansive' ); ?>" <?php echo ( isset( $slide['_rex_banner_gallery_image']['url'] ) ? 'style="background-image:url(' . $slide['_rex_banner_gallery_image']['url'] . ');"' : '' ); ?>>
				<i class="material-icons rex-icon">p</i>
			</button>
			<button class="rex-slider__slide-edit rex-plus-button btn-floating light-blue darken-1 tooltipped" value="add-slide" data-position="bottom" data-tooltip="<?php _e( 'Select Image', 'rexpansive' ); ?>">
				<i class="material-icons">&#xE145;</i>
			</button>
		</div>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2<?php echo ( !empty( $slide_content ) ? ' rex-slider__slide-edit__field-active-notice' : '' ); ?>" value="text" data-position="bottom" data-tooltip="<?php _e( 'Text', 'rexpansive' ); ?>">
			<i class="material-icons rex-icon">u</i>
		</button>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2<?php echo ( !empty( $video_info_data ) ? ' rex-slider__slide-edit__field-active-notice' : '' ); ?>" value="video" data-position="bottom" data-tooltip="<?php _e( 'Video', 'rexpansive' ); ?>">
			<i class="material-icons">play_arrow</i>
		</button>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2<?php echo ( !empty( $slide['_rex_banner_gallery_url'] ) ? ' rex-slider__slide-edit__field-active-notice' : '' ); ?>" value="url" data-position="bottom" data-tooltip="<?php _e( 'Link', 'rexpansive' ); ?>">
			<i class="material-icons rex-icon">l</i>
		</button>

		<div>
			<button class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="copy" data-tooltip="<?php _e('Copy slide', 'rexpansive'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE14D;</i>
			</button>

			<div class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="move" data-tooltip="<?php _e('Move slide', 'rexpansive'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
			</div>

			<button class="rex-slider__slide-edit btn-flat tooltipped" value="delete" data-position="bottom" data-tooltip="<?php _e('Delete slide', 'rexpansive'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE5CD;</i>
			</button>
		</div>
	</div>

	<div class="rex-slider__slide-data" style="display:none;">
		<input type="hidden" name="rex-slider--slide-id" value="<?php echo ( isset( $slide['_rex_banner_gallery_image']['id'] ) ? $slide['_rex_banner_gallery_image']['id'] : '' ); ?>">
		<textarea rows="" cols="" name="rex-slider--slide-text"><?php echo esc_textarea( $slide_content ); ?></textarea>
		<input type="hidden" name="rex-slider--slide-video-url" value="<?php echo ( isset( $video_info_data ) ? $video_info_data : '' ); ?>">
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
			'post_title'		=>	'slider_' . date("dmyhms"),
			'post_status'		=>	'publish',
			'post_type'		=>	'rex_slider'
		);

		if( null == get_page_by_title( $args['title'] ) ) {
			$slider_settings = $_POST['slider_data'];
			// Create the page
			$response['slider_id'] = wp_insert_post( $args );
			$response['slider_title'] = $args['post_title'];
			// adding the information for the slide
			$this->rex_add_slider_fields( $slider_settings, $response['slider_id'] );
		} else {
			$response['slider_id'] = -1;
			$response['slider_title'] = "";
			// The page exists
		} // end if

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

		if( $this->check_post_exists( $slider_to_edit ) ) {
			$slider_settings = $_POST['slider_data'];
			$response['slider_id'] = $slider_to_edit;
			$this->rex_clear_slider_fields( array(
				'field_564f1f0c050be',
				'field_5948cb2270b0f',
				'field_564f2373722c2',
			), $slider_to_edit );
			$this->rex_add_slider_fields( $slider_settings, $slider_to_edit );
		} else {
			$response['slider_id'] = -1;
		}

		wp_send_json_success( $response );
	}

	/**
	*	Save a rex slider
	*
	*	@param 	Multidimensional Array 	array of fields
	*	@param int 						rex slider id
	*/
	public function rex_add_slider_fields( $slider_settings, $slider_id ) {

		if( "true" == $slider_settings['settings']['auto_start'] ) {
			update_field( 'field_564f1f0c050be', array( "yes" ) ,$slider_id );
		} else {
			update_field( 'field_564f1f0c050be', "" ,$slider_id );
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

		if( $slider_settings['slides'] ) {
			// update_field( '_rex_banner_gallery', count( $slider_settings['slides'] ), $slider_id );
			$slides_field_key = 'field_564f2373722c2';
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

			update_field( $slides_field_key, $values , $slider_id );
		}
	}

	/**
	*	Clear a slider from its fields, based on an array of fields and the post id
	*
	*	@param Array 	array of fields keys
	*	@param int 		rex slider id
	*/
	public function rex_clear_slider_fields( $fields, $slider_id ) {
		foreach( $fields as $field ) {
			delete_field( $field, $slider_id );
		}
	}

	 /**
	 * Function to check if a post exists by id
	 *
	 *	@since 1.0.15
	 */
	public function check_post_exists( $id ) {
		if( !is_null( $id ) ) :
			return is_string( get_post_status( $id ) );
		else :
			return false;
		endif;
	}

	/**
	 * Define Slider Custom Post Type
	 *
	 *	@since 1.0.15
	 */
	public function rexpansive_slider_definition() {
		$labels = array(
			'name'                => _x( 'RexSliders', 'Post Type General Name', 'rexpansive' ),
			'singular_name'       => _x( 'RexSlider', 'Post Type Singular Name', 'rexpansive' ),
			'menu_name'           => __( 'RexSlider', 'rexpansive' ),
			'name_admin_bar'      => __( 'RexSlider', 'rexpansive' ),
			'parent_item_colon'   => __( 'Parent RexSlider:', 'rexpansive' ),
			'all_items'           => __( 'All RexSliders', 'rexpansive' ),
			'add_new_item'        => __( 'Add New RexSlider', 'rexpansive' ),
			'add_new'             => __( 'Add New', 'rexpansive' ),
			'new_item'            => __( 'New RexSlider', 'rexpansive' ),
			'edit_item'           => __( 'Edit RexSlider', 'rexpansive' ),
			'update_item'         => __( 'Update RexSlider', 'rexpansive' ),
			'view_item'           => __( 'View RexSlider', 'rexpansive' ),
			'search_items'        => __( 'Search RexSlider', 'rexpansive' ),
			'not_found'           => __( 'RexSlider not found', 'rexpansive' ),
			'not_found_in_trash'  => __( 'RexSlider not found in Trash', 'rexpansive' ),
		);
		$args = array(
			'label'               => __( 'rex_slider', 'rexpansive' ),
			'description'         => __( 'RexSlider', 'rexpansive' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'page-attributes' ),
			'taxonomies'          => array( 'rex_slider_taxonomy' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
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
	 * Function to pack ACF in the plugin
	 *
	 *	@since 1.0.15
	 */
	public function acf_settings_path( $path ) {
		// update path
		$path = plugin_dir_url( __FILE__ ) . '/lib/acf/advanced-custom-fields/';
		
		// return
		return $path;
	}

	public function acf_settings_dir( $dir ) {
		// update path
		$dir = plugin_dir_url( __FILE__ ) . '/lib/acf/advanced-custom-fields/';
		
		// return
		return $dir;
	}

	public function acf_hide_menu( $show_admin ) {
		return false;
	}
}
