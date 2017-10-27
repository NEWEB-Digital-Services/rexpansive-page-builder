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
class Rexbuilder_Public {
	
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
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->plugin_options = get_option( $this->plugin_name . '_options' );
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

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

		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];
			$this_post_type = get_post_type();

			if( $this_post_type && array_key_exists( $this_post_type, $post_to_activate ) ) :	

				if( !is_404() ) { // TODO
					// if( Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo', $post->post_content ) > 0 || Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo_slide', $post->post_content ) > 0 ) {
						wp_enqueue_script( 'vimeo-player', 'https://player.vimeo.com/api/player.js', array('jquery'), '20120206', true );
					// }
				}			

				wp_enqueue_style( 'rexbuilder-grid-style', plugin_dir_url( __FILE__ ) . 'css/perfectGridGallery.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'malihu-custom-scrollbar-style', plugin_dir_url( __FILE__ ) . 'css/jquery.mCustomScrollbar.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'animate-css', plugin_dir_url( __FILE__ ) . 'css/animate.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'textfill-style', plugin_dir_url( __FILE__ ) . 'css/textFill.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'photoswipe-skin', plugin_dir_url( __FILE__ ) . 'Photoswipe/default-skin/default-skin.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'jquery.mb.YTPlayer-style', plugin_dir_url( __FILE__ ) . 'jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'rexpansive-builder-style', plugin_dir_url( __FILE__ ) . 'css/rexbuilder-public.css', array(), $this->version, 'all' );
				
			endif;
		endif;
	}

	/**
	 * Register the stylesheets for the public-facing side of the site for production
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles_production() {
		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];
			$this_post_type = get_post_type();
			
			if( $this_post_type && array_key_exists( $this_post_type, $post_to_activate ) ) :
				
				if( !is_404() ) { // TODO
					// if( Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo', $post->post_content ) > 0 || Rexpansive_Classic_Utilities::find_property_inside_content( 'vimeo_slide', $post->post_content ) > 0 ) {
						wp_enqueue_script( 'vimeo-player', 'https://player.vimeo.com/api/player.js', array('jquery'), '20120206', true );
						// }
				}
					
				wp_enqueue_style( 'material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), $this->version, 'all' );
				wp_enqueue_style( 'materialize', plugin_dir_url( __FILE__ ) . 'css/materialize.min.css', array(), $this->version, 'all' );
					
				wp_enqueue_style( 'spectrum-style', plugin_dir_url( __FILE__ ) . 'spectrum/spectrum.css', array(), $this->version, 'all' );

				wp_enqueue_style( 'font-awesome', plugin_dir_url( __FILE__ ) . 'font-awesome-4.3.0/css/font-awesome.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'rex-custom-fonts', plugin_dir_url( __FILE__ ) . 'rexpansive-font/font.css', array(), $this->version, 'all' );

				wp_enqueue_style( 'gridster-style', plugin_dir_url( __FILE__ ) . 'css/jquery.gridster.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'custom-editor-buttons-style', plugin_dir_url( __FILE__ ) . 'css/rex-custom-editor-buttons.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'rexbuilder-style', plugin_dir_url( __FILE__ ) . 'css/builder.css', array(), $this->version, 'all' );

				wp_enqueue_style( 'photoswipe-skin', plugin_dir_url( __FILE__ ) . 'Photoswipe/default-skin/default-skin.css', array(), $this->version, 'all' );
				//wp_enqueue_style( 'bootstrap', plugin_dir_url( __FILE__ ) . 'css/bootstrap.min.css', array(), $this->version, 'all' );

				wp_enqueue_style( 'jquery.mb.YTPlayer-style', plugin_dir_url( __FILE__ ) . 'jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css', array(), $this->version, 'all' );
				
				wp_enqueue_style( 'rexpansive-builder-style', plugin_dir_url( __FILE__ ) . 'css/public.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'jquery-style', plugin_dir_url( __FILE__ ) . 'css/jquery-ui.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'gridstack-style', plugin_dir_url( __FILE__ ) . 'css/gridstack.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'spectrum-style', plugin_dir_url( __FILE__ ) . 'css/spectrum.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'medium-editor-style', plugin_dir_url( __FILE__ ) . 'css/medium-editor.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'medium-editor-instert-style', plugin_dir_url( __FILE__ ) . 'css/medium-editor-insert-plugin.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'medium-editor-insert-frontend-style', plugin_dir_url( __FILE__ ) . 'css/medium-editor-insert-plugin-frontend.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'medium-editor-tables-style.css', plugin_dir_url( __FILE__ ) . 'css/medium-editor-tables.min.css', array(), $this->version, 'all' );
				//wp_enqueue_style( 'bootstrap-touchspin', plugin_dir_url( __FILE__ ) . 'css/jquery.bootstrap-touchspin.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'input-spinner', plugin_dir_url( __FILE__ ) . 'css/input-spinner.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'rexpansive-builderLive-style', plugin_dir_url( __FILE__ ) . 'css/builderL.css', array(), $this->version, 'all' );

			endif;
		endif;
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

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

		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];
			$this_post_type = get_post_type();

			if( $this_post_type && array_key_exists( $this_post_type, $post_to_activate ) ) :
				wp_enqueue_script( 'jquery' );
				wp_enqueue_script( 'isotope-script', plugin_dir_url( __FILE__ ) . 'js/isotope.pkgd.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'rexbuilder-grid-script', plugin_dir_url( __FILE__ ) . 'js/jquery.perfectGridGallery.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'malihu-custom-scrollbar-script', plugin_dir_url( __FILE__ ) . 'js/jquery.mCustomScrollbar.concat.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'wow', plugin_dir_url( __FILE__ ) . 'js/wow.min.js', array( 'jquery' ), $this->version, true );
				wp_localize_script( 'wow', '_plugin_frontend_settings', array(
					'animations'	=>	$this->plugin_options['animation'],
				) );
				wp_enqueue_script( 'textfill', plugin_dir_url( __FILE__ ) . 'js/jquery.textFill.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'photoswipe', plugin_dir_url( __FILE__ ) . 'Photoswipe/photoswipe.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'photoswipe-ui', plugin_dir_url( __FILE__ ) . 'Photoswipe/photoswipe-ui-default.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'jquery.mb.YTPlayer-script', plugin_dir_url( __FILE__ ) . 'jquery.mb.YTPlayer/jquery.mb.YTPlayer.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'rexbuilder', plugin_dir_url( __FILE__ ) . 'js/rexbuilder-public.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'underscorejs', plugin_dir_url( __FILE__ ) . 'js/underscore-min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'text-resize', plugin_dir_url( __FILE__ ) . 'js/TextResize.js', array( 'jquery' ), $this->version, true );
			endif;
		endif;
	}

	/**
	 * Register the stylesheets for the public-facing side of the site for production
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts_production() {

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
		
		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];
			$this_post_type = get_post_type();

			if( $this_post_type && array_key_exists( $this_post_type, $post_to_activate ) ) :
				wp_enqueue_script( 'custom-scrollbar', plugin_dir_url( __FILE__ ) . 'js/1-jquery.mCustomScrollbar.concat.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'jqueryui', plugin_dir_url( __FILE__ ) . 'js/jquery-ui.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'touchPunch', plugin_dir_url( __FILE__ ) . 'js/jquery.ui.touch-punch.js', array( 'jquery' ), $this->version, true );
				if( is_page(126) ) {
					wp_enqueue_script( 'packery', plugin_dir_url( __FILE__ ) . 'js/packery.pkgd.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( '2-jqueryEditor', plugin_dir_url( __FILE__ ) . 'js/test/2-jquery.perfectGridGallery.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'rexbuilder-public', plugin_dir_url( __FILE__ ) . 'js/test/public.js', array( 'jquery' ), $this->version, true );
				} else {
					wp_enqueue_script( '0-isotope', plugin_dir_url( __FILE__ ) . 'js/0-isotope.pkgd.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'rangy-core', plugin_dir_url( __FILE__ ) . 'js/rangy-core.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'rangy-classapplier', plugin_dir_url( __FILE__ ) . 'js/rangy-classapplier.js', array( 'jquery' ), $this->version, true );
					// wp_enqueue_script( 'lodash', plugin_dir_url( __FILE__ ) . 'js/lodash.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'gridstack', plugin_dir_url( __FILE__ ) . 'js/gridstack.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'gridstackUI', plugin_dir_url( __FILE__ ) . 'js/gridstack.jQueryUI.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'spectrumColor', plugin_dir_url( __FILE__ ) . 'js/spectrum.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'medium-editor', plugin_dir_url( __FILE__ ) . 'js/medium-editor.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'mediumEditorToolbarStates', plugin_dir_url( __FILE__ ) . 'js/medium-editor-toolbar-states.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'handlebars-runtime', plugin_dir_url( __FILE__ ) . 'js/handlebars.runtime.js', array( 'jquery' ), $this->version, true );
					
					wp_enqueue_script( 'jquery-fileupload', plugin_dir_url( __FILE__ ) . 'js/jquery.fileupload.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'jquery-cycle2', plugin_dir_url( __FILE__ ) . 'js/jquery.cycle2.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'cycle2-center', plugin_dir_url( __FILE__ ) . 'js/jquery.cycle2.center.min.js', array( 'jquery' ), $this->version, true );
					
					wp_enqueue_script( 'medium-editor-insert', plugin_dir_url( __FILE__ ) . 'js/medium-editor-insert-plugin.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'medium-editor-tables', plugin_dir_url( __FILE__ ) . 'js/medium-editor-tables.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( '2-jqueryEditor', plugin_dir_url( __FILE__ ) . 'js/2-jquery.perfectGridGalleryEditor.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( '4-modals', plugin_dir_url( __FILE__ ) . 'js/4-modals.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( '2-jquery', plugin_dir_url( __FILE__ ) . 'js/2-jquery.perfectGridGallery.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'rexbuilder-public', plugin_dir_url( __FILE__ ) . 'js/public.js', array( 'jquery' ), $this->version, true );
				}
				wp_enqueue_script( 'storeVariables', plugin_dir_url( __FILE__ ) . 'js/store.legacy.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '2-TextResize', plugin_dir_url( __FILE__ ) . 'js/2-TextResize.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '3-velocity', plugin_dir_url( __FILE__ ) . 'js/3-velocity.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '3-velocityui', plugin_dir_url( __FILE__ ) . 'js/3-velocity.ui.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '4-jquery', plugin_dir_url( __FILE__ ) . 'js/4-jquery.rexScrollify.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '5-flickity', plugin_dir_url( __FILE__ ) . 'js/5-flickity.pkgd.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'photoswipe-min', plugin_dir_url( __FILE__ ) . 'Photoswipe/photoswipe.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'photoswipeui', plugin_dir_url( __FILE__ ) . 'Photoswipe/photoswipe-ui-default.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'jquerymb', plugin_dir_url( __FILE__ ) . 'jquery.mb.YTPlayer/jquery.mb.YTPlayer.min.js', array( 'jquery' ), $this->version, true );
				wp_localize_script( 'rexbuilder-public', '_plugin_frontend_settings', array(
					'animations'	=>	$this->plugin_options['animation']
				));
				wp_localize_script( 'rexbuilder-public', 'rexajax', array(
					'ajaxurl'	=>	admin_url( 'admin-ajax.php' ),
					'rexnonce'	=>	wp_create_nonce( 'rex-ajax-call-nonce' )
				));
				
				//wp_enqueue_script( 'resizeElement', plugin_dir_url( __FILE__ ) . 'js/jquery-resizable.min.js', array( 'jquery' ), $this->version, true );
				//wp_enqueue_script( 'interact', plugin_dir_url( __FILE__ ) . 'js/interact.min.js', array( 'jquery' ), $this->version, true );
				/* if( !is_page(126) ){
					wp_enqueue_script( 'sectionBorder', plugin_dir_url( __FILE__ ) . 'js/0-border.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'builderLive', plugin_dir_url( __FILE__ ) . 'js/builderLive.js', array( 'jquery' ), $this->version, true );
				}	 */
				endif;
		endif;
	}

	/**
	 * Prepare the html template for photoswipe gallery.
	 *
	 * @since    1.0.0
	 */
	public function print_photoswipe_template() {
		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];
			$this_post_type = get_post_type();

			if( $this_post_type && array_key_exists( $this_post_type, $post_to_activate ) ) :
				include_once( 'partials/rexbuilder-photoswipe-template.php' );
			endif;
		endif;
	}

	/**
	 * Print the custom styles defined in the builder
	 *
	 * @since	1.0.0
	 */
	public function print_post_custom_styles() {
		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];
			$this_post_type = get_post_type();

			if( $this_post_type && array_key_exists( $this_post_type, $post_to_activate ) ) :
				global $post;
				$meta = get_post_meta( $post->ID, '_rexbuilder_custom_css', true );
				if( $meta != '' ) :
					wp_add_inline_style( 'rexpansive-builder-style', $meta );
				endif;
			endif;
		endif;
	}

	/**
	 *	Prepare the html template for the vertical internal navigation (dots)
	 *
	 *	@since	1.0.0
	 */
	public function print_vertical_dots() {
		if( isset( $this->plugin_options['post_types'] ) ) :
			$post_to_activate = $this->plugin_options['post_types'];
			$this_post_type = get_post_type();

			if( $this_post_type && array_key_exists( $this_post_type, $post_to_activate ) ) :
				include_once( 'partials/rexbuilder-vertical-dots-template.php' );
			endif;
		endif;
	}

	/**
	 * Create the variuos modal editors of the builder.
	 *
	 * @since    1.0.0
	 */
	public function create_builder_modals() {
		
		//$page_info = get_current_screen();

		if ( !current_user_can('edit_posts') &&  !current_user_can('edit_pages') ) { 
			return; 
		}
		if( !isset( $this->plugin_options['post_types'] ) ) {
			return;
		}

		include_once( 'partials/rexbuilder-modals-display.php' );

		?>
			<div id="id-post" data-post-id="<?php echo esc_attr( get_the_ID() ); ?>"></div>
		<?php
		

/* 		if ( get_user_option('rich_editing') == 'true') { 
			$post_to_activate = $this->plugin_options['post_types'];
			if( isset( $post_to_activate[$page_info->id] ) ) : 
				if( ( $post_to_activate[$page_info->id] == 1 ) && 
					( $post_to_activate[$page_info->post_type] == 1 ) ) :


				endif;
			endif;
		} */
	}
	public function create_rexlive_fixed_buttons(){
		if ( !current_user_can('edit_posts') &&  !current_user_can('edit_pages') ) { 
			return; 
		}
		if( !isset( $this->plugin_options['post_types'] ) ) {
			return;
		}
		include_once('partials/rexlive-buttons-fixed.php');
	}
	/**
	*	Ajax call to save sections status
	*
	*	@since 1.0.15
	*/
	public function rexlive_save_sections() {
		$nonce = $_POST['nonce_param'];
		$response = array(
			'error' => false,
			'msg' => '',
		);
		$shortcode = $_POST['shortcode'];
		$post_id_to_update = intval($_POST['post_id_to_update']);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) :
			$response['error'] = true;
			$response['msg'] = 'Error!';
			wp_send_json_error( $response );
		endif;

		$response['error'] = false;
		
		$args = array(
			'ID'           => $post_id_to_update,
			'post_content' => $shortcode,
		);
		
		$update = wp_update_post($args);

		$response['update'] = $update;
		$response['id_recived'] = $post_id_to_update;

		wp_send_json_success( $response );
	}


		
	/**
	 * Call wp_enqueue_media() to load up all the scripts we need for media uploader
	 */
	function enqueue_media_uploader() {
		wp_enqueue_media();
		wp_enqueue_script(
			'some-script',
			plugins_url( '/', __FILE__ ) . 'js/frontend.js',
			array( 'jquery' ),
			'2015-05-07'
		);
	}
	/**
	 * This filter insures users only see their own media
	 */
	function filter_media( $query ) {
		// admins get to see everything
		if ( ! current_user_can( 'manage_options' ) )
			$query['author'] = get_current_user_id();
		return $query;
	}
	function frontend_shortcode( $args ) {
		// check if user can upload files
		if ( current_user_can( 'upload_files' ) ) {
			$str = __( 'Select File', 'frontend-media' );
			return '<input id="frontend-button" type="button" value="' . $str . '" class="button" style="position: relative; z-index: 1;"><img id="frontend-image" />';
		}
		return __( 'Please Login To Upload', 'frontend-media' );
	}
}
