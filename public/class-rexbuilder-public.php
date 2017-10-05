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

				wp_enqueue_style( 'photoswipe-skin', plugin_dir_url( __FILE__ ) . 'Photoswipe/default-skin/default-skin.css', array(), $this->version, 'all' );

				wp_enqueue_style( 'jquery.mb.YTPlayer-style', plugin_dir_url( __FILE__ ) . 'jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css', array(), $this->version, 'all' );
				
				wp_enqueue_style( 'rexpansive-builder-style', plugin_dir_url( __FILE__ ) . 'css/public.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'jquery-style', plugin_dir_url( __FILE__ ) . 'css/jquery-ui.min.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'rexpansive-builderLive-style', plugin_dir_url( __FILE__ ) . 'css/builderL.css', array(), $this->version, 'all' );
				wp_enqueue_style( 'gridstack-style', plugin_dir_url( __FILE__ ) . 'css/gridstack.css', array(), $this->version, 'all' );

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
				//wp_enqueue_script( 'jquery' );
				wp_enqueue_script( '1-jquery', plugin_dir_url( __FILE__ ) . 'js/1-jquery.mCustomScrollbar.concat.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'jqueryui', plugin_dir_url( __FILE__ ) . 'js/jquery-ui.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'touchPunch', plugin_dir_url( __FILE__ ) . 'js/jquery.ui.touch-punch.js', array( 'jquery' ), $this->version, true );
				// wp_enqueue_script( 'public-plugins', plugin_dir_url( __FILE__ ) . 'js/plugins.js', array( 'jquery' ), $this->version, true );
				if( is_page(126) ) {
					wp_enqueue_script( 'packery', plugin_dir_url( __FILE__ ) . 'js/packery.pkgd.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( '2-jqueryEditor', plugin_dir_url( __FILE__ ) . 'js/test/2-jquery.perfectGridGallery.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'rexbuilder-public', plugin_dir_url( __FILE__ ) . 'js/test/public.js', array( 'jquery' ), $this->version, true );
				} else {
					wp_enqueue_script( '0-isotope', plugin_dir_url( __FILE__ ) . 'js/0-isotope.pkgd.min.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( '2-jquery', plugin_dir_url( __FILE__ ) . 'js/2-jquery.perfectGridGallery.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'lodash', plugin_dir_url( __FILE__ ) . 'js/lodash.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'gridstack', plugin_dir_url( __FILE__ ) . 'js/gridstack.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'gridstackUI', plugin_dir_url( __FILE__ ) . 'js/gridstack.jQueryUI.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( '2-jqueryEditor', plugin_dir_url( __FILE__ ) . 'js/2-jquery.perfectGridGalleryEditor.js', array( 'jquery' ), $this->version, true );
					wp_enqueue_script( 'rexbuilder-public', plugin_dir_url( __FILE__ ) . 'js/public.js', array( 'jquery' ), $this->version, true );
				}
				wp_enqueue_script( '2-TextResize', plugin_dir_url( __FILE__ ) . 'js/2-TextResize.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '3-velocity', plugin_dir_url( __FILE__ ) . 'js/3-velocity.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '3-velocityui', plugin_dir_url( __FILE__ ) . 'js/3-velocity.ui.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '4-jquery', plugin_dir_url( __FILE__ ) . 'js/4-jquery.rexScrollify.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( '5-flickity', plugin_dir_url( __FILE__ ) . 'js/5-flickity.pkgd.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'photoswipe-min', plugin_dir_url( __FILE__ ) . 'Photoswipe/photoswipe.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'photoswipeui', plugin_dir_url( __FILE__ ) . 'Photoswipe/photoswipe-ui-default.min.js', array( 'jquery' ), $this->version, true );
				wp_enqueue_script( 'jquerymb', plugin_dir_url( __FILE__ ) . 'jquery.mb.YTPlayer/jquery.mb.YTPlayer.min.js', array( 'jquery' ), $this->version, true );
				wp_localize_script( 'public-plugins', '_plugin_frontend_settings', array(
					'animations'	=>	$this->plugin_options['animation'],
					));
				wp_enqueue_script( 'storeVariables', plugin_dir_url( __FILE__ ) . 'js/store.legacy.min.js', array( 'jquery' ), $this->version, true );
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
}
