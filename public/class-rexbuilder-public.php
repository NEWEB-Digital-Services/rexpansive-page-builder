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
	public function __construct($plugin_name, $version) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->plugin_options = get_option($this->plugin_name . '_options');

		// $ex_tools = array( 'accordion', 'slideshow' );
		// $ex_tools = array();
		// $this->experimental_tools = apply_filters( 'rexbuilder_live_experimental_tools', $ex_tools );
	}

	/**
	 * Add classes to the public body of a page
	 *
	 * @param array $classes
	 * @return array
	 * @since 2.0.0
	 */
	public function rexlive_body_class( $classes ) {
		if( Rexbuilder_Utilities::isBuilderLive() ) {
			// live builder main body class
			$classes[] = 'rexbuilder-live-active';

			// post status class
			global $post;
			$classes[] = 'rexbuilder-live--' . $post->post_status;
			
			// live builder extra tools classes
			$ex_tools = array();
			$experimental_tools = apply_filters( 'rexbuilder_live_experimental_tools', $ex_tools );
			foreach( $experimental_tools as $tool )
			{
				$classes[] = "rexbuilder-live-{$tool}--active";
			}
		} else {
			// live builder main body class
			$classes[] = 'rexbuilder-live-front';
		}

		return $classes;
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

		global $post;
		if ( $this->builder_active_on_this_post_type() ) {

			$ver = null;

			$folder = "public/";
			$folder_admin = "admin/";

			if( Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_style( 'rexbuilder-live-google-fonts', 'https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i', false );
				wp_enqueue_style('material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), $ver, 'all');
				wp_enqueue_style('font-awesome', REXPANSIVE_BUILDER_URL . $folder_admin . 'font-awesome-4.3.0/css/font-awesome.min.css', array(), $ver, 'all');

				wp_enqueue_style('rex-custom-fonts', REXPANSIVE_BUILDER_URL . $folder_admin . 'rexpansive-font/font.css', array(), $ver, 'all');

				wp_enqueue_style('rexbuilder-style', REXPANSIVE_BUILDER_URL . $folder_admin . 'css/builder.css', array(), $ver, 'all');
				wp_enqueue_style('custom-editor-buttons-style', REXPANSIVE_BUILDER_URL . $folder_admin . 'css/rex-custom-editor-buttons.css', array(), $ver, 'all');

				wp_enqueue_style('spectrum-style', REXPANSIVE_BUILDER_URL . $folder . 'css/spectrum.css', array(), $ver, 'all');
				wp_enqueue_style('medium-editor-style', REXPANSIVE_BUILDER_URL . $folder . 'css/medium-editor.css', array(), $ver, 'all');
			}

			wp_enqueue_style('photoswipe-skin', REXPANSIVE_BUILDER_URL . $folder . 'Photoswipe/default-skin/default-skin.css', array(), $ver, 'all');

			wp_enqueue_style('jquery.mb.YTPlayer-style', REXPANSIVE_BUILDER_URL . $folder . 'jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css', array(), $ver, 'all');

			wp_enqueue_style('animate-css', REXPANSIVE_BUILDER_URL . $folder . 'css/animate.css', array(), $ver, 'all');
			wp_enqueue_style('textfill-style', REXPANSIVE_BUILDER_URL . $folder . 'css/textFill.css', array(), $ver, 'all');

			wp_enqueue_style('jquery-ui-style', REXPANSIVE_BUILDER_URL . $folder . 'css/jquery-ui.min.css', array(), $ver, 'all');
			wp_enqueue_style('gridstack-style', REXPANSIVE_BUILDER_URL . $folder . 'gridstack/dist/gridstack.css', array(), $ver, 'all');

			wp_enqueue_style('rexpansive-builder-rexbutton-style', REXPANSIVE_BUILDER_URL . $folder . 'css/rex_buttons.css', array(), $ver, 'all');
			if( Rexbuilder_Utilities::isBuilderLive() ) 
			{
				wp_enqueue_style('rexpansive-builder-style', REXPANSIVE_BUILDER_URL . $folder . 'css/public-editor.css', array(), $ver, 'all');
			}
			else
			{
				wp_enqueue_style('rexpansive-builder-style', REXPANSIVE_BUILDER_URL . $folder . 'css/public.css', array(), $ver, 'all');
			}

			wp_enqueue_style('rexpansive-builder-editor-style', REXPANSIVE_BUILDER_URL .'admin/css/live-def.css', array(), $ver, 'all');
		}
	}

	/**
	 * Register the stylesheets for the public-facing side of the site for production
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles_production() {
		global $post;
		if ( $this->builder_active_on_this_post_type() ) {
			wp_enqueue_style('rexpansive-builder-rexbutton-style', REXPANSIVE_BUILDER_URL . 'public/css/rex_buttons.css', array(), REXPANSIVE_BUILDER_VERSION, 'all');

			if( Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_style( 'rexbuilder-live-google-fonts', 'https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i', false );
				wp_enqueue_style('material-design-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), false, 'all');
				wp_enqueue_style('font-awesome', REXPANSIVE_BUILDER_URL . 'admin/font-awesome-4.3.0/css/font-awesome.min.css', array(), false, 'all');

				wp_enqueue_style($this->plugin_name . '-style', REXPANSIVE_BUILDER_URL . 'admin/css/builderlive-editor.css', array(), REXPANSIVE_BUILDER_VERSION, 'all');
			} else {
				wp_enqueue_style($this->plugin_name . '-style', REXPANSIVE_BUILDER_URL . 'public/css/builderlive-public.css', array(), REXPANSIVE_BUILDER_VERSION, 'all');
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

		global $post;
		if ( $this->builder_active_on_this_post_type() ) {
			$ver = null;
			$customEffects = get_post_meta( $post->ID, '_rexbuilder_custom_effects', true );

			$fast_load = ( isset( $this->plugin_options['fast_load'] ) ? $this->plugin_options['fast_load'] : 0 );

			wp_enqueue_script('vimeo-player', 'https://player.vimeo.com/api/player.js', array('jquery'), '20120206', true);
			if( Rexbuilder_Utilities::isBuilderLive() ) {
				//include media libray
				wp_enqueue_media();
				
				// TIPPY
				wp_enqueue_script( 'tippy', REXPANSIVE_BUILDER_URL . 'public/js/vendor/tippy.all.min.js', array( 'jquery' ), null, true );
	
				// RANGY
				wp_enqueue_script( 'rangy-core', REXPANSIVE_BUILDER_URL . 'public/js/vendor/rangy-1.3.0/rangy-core.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rangy-classapplier', REXPANSIVE_BUILDER_URL . 'public/js/vendor/rangy-1.3.0/rangy-classapplier.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rangy-selectionsaverestore', REXPANSIVE_BUILDER_URL . 'public/js/vendor/rangy-1.3.0/rangy-selectionsaverestore.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'rangy-textrange', REXPANSIVE_BUILDER_URL . 'public/js/vendor/rangy-1.3.0/rangy-textrange.js', array( 'jquery' ), null, true );

				// SPECTRUM COLOR PICKER
				wp_enqueue_script('spectrumColor', REXPANSIVE_BUILDER_URL . 'public/js/vendor/spectrum.js', array('jquery'), $ver, true);

				// MEDIUM EDITOR
				wp_enqueue_script('medium-editor', REXPANSIVE_BUILDER_URL . 'public/js/vendor/medium-editor.js', array('jquery'), $ver, true);
				wp_enqueue_script('mediumEditorToolbarStates', REXPANSIVE_BUILDER_URL . 'public/js/vendor/medium-editor-toolbar-states.min.js', array('jquery'), $ver, true);

				// Rexbuilder
				wp_enqueue_script('1-RexUtilEditorUtilities', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Live_Utilities.js', array('jquery'), $ver, true);
				wp_enqueue_script('0-Rexbuilder_Array_Utilities', REXPANSIVE_BUILDER_URL . 'public/js/live/0-Rexbuilder_Array_Utilities.js', array('jquery'), $ver, true);
				wp_enqueue_script('1-RexColorPalette', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Color_Palette.js', array('jquery'), $ver, true);
				wp_enqueue_script('1-RexOverlayPalette', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Overlay_Palette.js', array('jquery'), $ver, true);

				wp_enqueue_script('textEditor', REXPANSIVE_BUILDER_URL . 'public/js/live/2-Text_Editor.js', array('jquery'), $ver, true);

				wp_enqueue_script('section-js', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Section.js', array('jquery'), $ver, true);
				wp_enqueue_script('section-editor-js', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Section_Editor.js', array('jquery'), $ver, true);
				wp_enqueue_script('block-js', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Block.js', array('jquery'), $ver, true);
				wp_enqueue_script('block-editor-js', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Block_Editor.js', array('jquery'), $ver, true);
				wp_enqueue_script('4-modals', REXPANSIVE_BUILDER_URL . 'public/js/live/4-modals.js', array('jquery'), $ver, true);
				wp_enqueue_script('live-post-edit', REXPANSIVE_BUILDER_URL . 'public/js/live/4-Rexbuilder_Live_Post_Edit.js', array('jquery'), $ver, true);
			}
			else
			{
				wp_enqueue_script('1-RexUtilEditorUtilities', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Live_Utilities.js', array('jquery'), $ver, true);
				wp_enqueue_script('0-Rexbuilder_Array_Utilities', REXPANSIVE_BUILDER_URL . 'public/js/live/0-Rexbuilder_Array_Utilities.js', array('jquery'), $ver, true);
				wp_enqueue_script('intersection-observer', REXPANSIVE_BUILDER_URL . 'public/js/vendor/intersection-observer.js', array(), $ver, true);
			}

			// requestanimationframe
			wp_enqueue_script('jquery-requestanimationframe', REXPANSIVE_BUILDER_URL . 'public/js/vendor/jquery.requestanimationframe.min.js', array('jquery'), $ver, true);
			// JS TMPL
			wp_enqueue_script('tmpl', REXPANSIVE_BUILDER_URL . 'public/js/vendor/tmpl.min.js', array('jquery'), $ver, true);

			// PHOTOSWIPE
			wp_enqueue_script('photoswipe', REXPANSIVE_BUILDER_URL . 'public/Photoswipe/photoswipe.min.js', array('jquery'), $ver, true);
			wp_enqueue_script('photoswipe-ui', REXPANSIVE_BUILDER_URL . 'public/Photoswipe/photoswipe-ui-default.min.js', array('jquery'), $ver, true);

			// YTPLAYER
			wp_enqueue_script('YTPlayer', REXPANSIVE_BUILDER_URL . 'public/js/vendor/jquery.mb.YTPlayer.min.js', array('jquery'), $ver, true);

			// STORE JS
			wp_enqueue_script('storeVariables', REXPANSIVE_BUILDER_URL . 'public/js/vendor/store.legacy.min.js', array('jquery'), $ver, true);

			// REXBUILDER
			wp_enqueue_script('1-RexUtil', REXPANSIVE_BUILDER_URL . 'public/js/build/1-Rexbuilder_Util.js', array('jquery'), $ver, true);
			wp_enqueue_script('1-RexPhotoswipe', REXPANSIVE_BUILDER_URL . 'public/js/build/1-Rexbuilder_Photoswipe.js', array('jquery'), $ver, true);
			wp_enqueue_script('1-RexUtilEditor', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Util_Editor.js', array('jquery'), $ver, true);
			if( Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_script('1-RexCreateBlocks', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_CreateBlocks.js', array('jquery'), $ver, true);
			}
			wp_enqueue_script('1-RexDomUtil', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Dom_Util.js', array('jquery'), $ver, true);
			if( Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_script('1-RexColorPalette', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Color_Palette.js', array('jquery'), $ver, true);
				wp_enqueue_script('1-Rexelement-Editor', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Rexelement_Editor.js', array('jquery'), $ver, true);
				wp_enqueue_script('1-Rexwpcf7-Editor', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Rexwpcf7_Editor.js', array('jquery'), $ver, true);
			}
			wp_enqueue_script('1-Rexbutton', REXPANSIVE_BUILDER_URL . 'public/js/build/1-Rexbuilder_Rexbutton.js', array('jquery'), $ver, true);
			wp_enqueue_script('1-Rexelement', REXPANSIVE_BUILDER_URL . 'public/js/build/1-Rexbuilder_Rexelement.js', array('jquery'), $ver, true);
			wp_enqueue_script('1-Rexwpcf7', REXPANSIVE_BUILDER_URL . 'public/js/build/1-Rexbuilder_Rexwpcf7.js', array('jquery'), $ver, true);
			if( Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_script('1-RexOverlayPalette', REXPANSIVE_BUILDER_URL . 'public/js/live/1-Rexbuilder_Overlay_Palette.js', array('jquery'), $ver, true);
				wp_enqueue_script('2-RexSaveListeners', REXPANSIVE_BUILDER_URL . 'public/js/live/2-Rex_Save_Listeners.js', array('jquery'), $ver, true);
			}

			//gridstack
			if( Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_script('jquery-ui', REXPANSIVE_BUILDER_URL . 'public/js/vendor/jquery-ui.min.js', array('jquery'), $ver, true);
				wp_enqueue_script('touchPunch', REXPANSIVE_BUILDER_URL . 'public/js/vendor/jquery.ui.touch-punch.js', array('jquery'), $ver, true);
			}
			wp_enqueue_script('lodash-live', REXPANSIVE_BUILDER_URL . 'public/js/vendor/lodash.js', array('jquery'), $ver, true);
			wp_enqueue_script('gridstack', REXPANSIVE_BUILDER_URL . 'public/gridstack/dist/gridstack.js', array('jquery'), $ver, true);
			if( Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_script('gridstackUI', REXPANSIVE_BUILDER_URL . 'public/gridstack/dist/gridstack.jQueryUI.js', array('jquery'), $ver, true);
			}

			// Scripts
			wp_enqueue_script('3-Navigator', REXPANSIVE_BUILDER_URL . 'public/js/build/3-Navigator.js', array('jquery'), $ver, true);
			wp_enqueue_script('5-flickity', REXPANSIVE_BUILDER_URL . 'public/js/vendor/flickity.pkgd.min.js', array('jquery'), $ver, true);
			wp_enqueue_script('flickity-bglazy-load', REXPANSIVE_BUILDER_URL . 'public/js/vendor/bg-lazyload.js', array('jquery','5-flickity'), $ver, true);
			wp_enqueue_script('2-RexSlider', REXPANSIVE_BUILDER_URL . 'public/js/build/2-RexSlider.js', array('jquery'), $ver, true);
			wp_enqueue_script('textfill', REXPANSIVE_BUILDER_URL  . 'public/js/vendor/2-jquery.textFill.js', array( 'jquery' ), $ver, true );
			wp_enqueue_script('8-VimeoVideo', REXPANSIVE_BUILDER_URL . 'public/js/build/8-VimeoVideo.js', array('jquery'), $ver, true);
			if( !Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_script('scrolled', REXPANSIVE_BUILDER_URL . 'public/js/vendor/4-jquery.rexScrolled.js', array('jquery'), $ver, true);
			}
			wp_enqueue_script('rex-accordion', REXPANSIVE_BUILDER_URL . 'public/js/vendor/jquery.rexAccordion.js', array('jquery'), $ver, true);
			
			if ( false !== strpos( $customEffects, 'rex-indicator__placeholder' ) ) {
				wp_enqueue_script('indicator', REXPANSIVE_BUILDER_URL . 'public/js/vendor/6-jquery.rexIndicator.js', array('jquery'), $ver, true);
			}
			
			if( !Rexbuilder_Utilities::isBuilderLive() ) {
				if ( false !== strpos( $customEffects, 'rex-effect' ) ) {
					wp_enqueue_script('pixi', REXPANSIVE_BUILDER_URL . 'public/js/vendor/pixi.min.js', array('jquery'), $ver, true);
					wp_enqueue_script('effect', REXPANSIVE_BUILDER_URL . 'public/js/vendor/jquery.rexEffect.js', array('jquery'), $ver, true);
				}

				if ( false !== strpos( $customEffects, 'rex-num-spin' ) ) {
					wp_enqueue_script('odometer', REXPANSIVE_BUILDER_URL . 'public/js/vendor/odometer.min.js', array('jquery'), $ver, true);
				}
				
				if ( false !== strpos( $customEffects, 'rex-slideshow' ) ) {
					wp_enqueue_script('rex-slideshow', REXPANSIVE_BUILDER_URL . 'public/js/vendor/6-jquery.rexSlideshow.js', array('jquery'), $ver, true);
				}

				if ( false !== strpos( $customEffects, 'sticky-section' ) ) {
					wp_enqueue_script('sticky-section', REXPANSIVE_BUILDER_URL . 'public/js/vendor/sticky-section.js', array(), $ver, true);
				}

				if ( false !== strpos( $customEffects, 'fadeUpTextCSS' ) ) {
					wp_enqueue_script('scroll-css-animation', REXPANSIVE_BUILDER_URL . 'public/js/vendor/scroll-css-animation.js', array(), $ver, true);
				}

				if ( false !== strpos( $customEffects, 'distance-accordion-toggle' ) ) {
					wp_enqueue_script('distance-accordion', REXPANSIVE_BUILDER_URL . 'public/js/vendor/distance-accordion.js', array(), $ver, true);
				}

				if ( false !== strpos( $customEffects, 'popup-content-button' ) ) {
					wp_enqueue_script('popup-content', REXPANSIVE_BUILDER_URL . 'public/js/vendor/popup-content.js', array(), $ver, true);
					// @todo fix me
					wp_enqueue_script('split-scrollable', REXPANSIVE_BUILDER_URL . 'public/js/vendor/split-scrollable.js', array(), $ver, true);
					wp_enqueue_script('distance-accordion', REXPANSIVE_BUILDER_URL . 'public/js/vendor/distance-accordion.js', array(), $ver, true);
				}

				if ( false !== strpos( $customEffects, 'split-scrollable' ) ) {
					wp_enqueue_script('split-scrollable', REXPANSIVE_BUILDER_URL . 'public/js/vendor/split-scrollable.js', array(), $ver, true);
				}
			}


			wp_enqueue_script('utilities', REXPANSIVE_BUILDER_URL . 'public/js/vendor/utilities.js', array('jquery'), $ver, true);
			wp_enqueue_script('2-jqueryEditor', REXPANSIVE_BUILDER_URL . 'public/js/live/2-jquery.perfectGridGalleryEditor.js', array('jquery'), null, true);

			wp_enqueue_script('3-velocity', REXPANSIVE_BUILDER_URL . 'public/js/vendor/3-velocity.min.js', array('jquery'), $ver, true);
			wp_enqueue_script('3-velocityui', REXPANSIVE_BUILDER_URL . 'public/js/vendor/3-velocity.ui.min.js', array('jquery'), $ver, true);
			if( !Rexbuilder_Utilities::isBuilderLive() ) {
				wp_enqueue_script('4-jqueryScrollify', REXPANSIVE_BUILDER_URL . 'public/js/vendor/4-jquery.rexScrollify.js', array('jquery'), $ver, true);
			}
			
			wp_enqueue_script('rexbuilder', REXPANSIVE_BUILDER_URL . 'public/js/build/rexbuilder-public.js', array('jquery'), $ver, true);

			if( !Rexbuilder_Utilities::isBuilderLive() && 1 == $fast_load ) {
				wp_enqueue_script('fast-load', REXPANSIVE_BUILDER_URL . 'public/js/build/fast-load.js', array('intersection-observer'), $ver, true);
			}

			wp_localize_script('rexbuilder', '_plugin_frontend_settings', apply_filters('rexbuilder_js_settings', $this->get_plugin_frontend_settings() ) );
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

		global $post;
		if ( $this->builder_active_on_this_post_type() ) {
			$customEffects = get_post_meta( $post->ID, '_rexbuilder_custom_effects', true );
			$fast_load = ( isset( $this->plugin_options['fast_load'] ) ? $this->plugin_options['fast_load'] : 0 );
			
			wp_enqueue_script('vimeo-player', 'https://player.vimeo.com/api/player.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);

			if( Rexbuilder_Utilities::isBuilderLive() ) {
				if ( false !== strpos( $customEffects, 'rex-indicator__placeholder' ) ) {
					wp_enqueue_script('indicator', REXPANSIVE_BUILDER_URL . 'public/js/vendor/6-jquery.rexIndicator.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);
				}
				wp_enqueue_script( $this->plugin_name, REXPANSIVE_BUILDER_URL . 'public/js/builderlive-editor.js', array( 'jquery' ), REXPANSIVE_BUILDER_VERSION, true );

			} else {
				if ( false !== strpos( $customEffects, 'rex-effect' ) ) {
					wp_enqueue_script('pixi', REXPANSIVE_BUILDER_URL . 'public/js/vendor/pixi.min.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);
					wp_enqueue_script('effect', REXPANSIVE_BUILDER_URL . 'public/js/vendor/jquery.rexEffect.min.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);
				}

				if ( false !== strpos( $customEffects, 'rex-num-spin' ) ) {
					wp_enqueue_script('odometer', REXPANSIVE_BUILDER_URL . 'public/js/vendor/odometer.min.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);
				}
				
				if ( false !== strpos( $customEffects, 'rex-slideshow' ) ) {
					wp_enqueue_script('rex-slideshow', REXPANSIVE_BUILDER_URL . 'public/js/vendor/6-jquery.rexSlideshow.min.js', array('jquery'), REXPANSIVE_BUILDER_VERSION, true);
				}

				if ( false !== strpos( $customEffects, 'sticky-section' ) ) {
					wp_enqueue_script('sticky-section', REXPANSIVE_BUILDER_URL . 'public/js/vendor/sticky-section.min.js', array(), REXPANSIVE_BUILDER_VERSION, true);
				}

				if ( false !== strpos( $customEffects, 'fadeUpTextCSS' ) ) {
					wp_enqueue_script('scroll-css-animation', REXPANSIVE_BUILDER_URL . 'public/js/vendor/scroll-css-animation.min.js', array(), REXPANSIVE_BUILDER_VERSION, true);
				}

				if ( false !== strpos( $customEffects, 'distance-accordion-toggle' ) ) {
					wp_enqueue_script('distance-accordion', REXPANSIVE_BUILDER_URL . 'public/js/vendor/distance-accordion.min.js', array(), REXPANSIVE_BUILDER_VERSION, true);
				}

				if ( false !== strpos( $customEffects, 'popup-content-button' ) ) {
					wp_enqueue_script('popup-content', REXPANSIVE_BUILDER_URL . 'public/js/vendor/popup-content.min.js', array(), REXPANSIVE_BUILDER_VERSION, true);
					// @todo: fix me
					wp_enqueue_script('split-scrollable', REXPANSIVE_BUILDER_URL . 'public/js/vendor/split-scrollable.min.js', array(), REXPANSIVE_BUILDER_VERSION, true);
					wp_enqueue_script('distance-accordion', REXPANSIVE_BUILDER_URL . 'public/js/vendor/distance-accordion.min.js', array(), REXPANSIVE_BUILDER_VERSION, true);
				}

				if ( false !== strpos( $customEffects, 'split-scrollable' ) ) {
					wp_enqueue_script('split-scrollable', REXPANSIVE_BUILDER_URL . 'public/js/vendor/split-scrollable.min.js', array(), REXPANSIVE_BUILDER_VERSION, true);
				}

				wp_enqueue_script( $this->plugin_name, REXPANSIVE_BUILDER_URL . 'public/js/builderlive-public.js', array( 'jquery' ), REXPANSIVE_BUILDER_VERSION, true );

				if( !Rexbuilder_Utilities::isBuilderLive() && 1 == $fast_load ) {
					wp_enqueue_script('fast-load', REXPANSIVE_BUILDER_URL . 'public/js/vendor/fast-load.min.js', array( $this->plugin_name ), REXPANSIVE_BUILDER_VERSION, true);
				}
			}

			wp_localize_script( $this->plugin_name, '_plugin_frontend_settings', apply_filters('rexbuilder_js_settings', $this->get_plugin_frontend_settings() ) );
		}
	}

	/**
	 * Generating a JS global object to store plugins settings
	 *
	 * @return  Array
	 * @since   2.0.0
	 * @date    26-03-2019
	 */
	private function get_plugin_frontend_settings()
	{
		return array(
			'animations' => apply_filters('rexbuilder_animation_enabled', $this->plugin_options['animation']),
			'fast_load' => ( isset( $this->plugin_options['fast_load'] ) ? $this->plugin_options['fast_load'] : 0 ),
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
			'sitedate' => '01/01/2019',
			'odometer' => array(
				'theme' => 'digital',
				'format' => '(.ddd),dd'
			),
			'splitScrollable' => array(
				'minViewportWidth' => 768
			),
			'old_builder' => Rexbuilder_Utilities::postSavedFromBackend()
		);
	}

	/**
	 * Prevent rendering of some shortcodes on builderlive side
	 * To avoid style or scripts errors
	 *
	 * @return void
	 * @since 2.0.0
	 * @date 03-05-2019
	 */
	public function remove_shortcodes_from_live() {
		if ( Rexbuilder_Utilities::isBuilderLive() ) {
			$shortcodes = apply_filters( 'rexpansive_builder_remove_shortcodes_live', array( 'RexTimelinePro', 'RexTimelineProEvent', 'RexliveIcon' ) );
			foreach( $shortcodes as $shortcode ) {
				remove_shortcode( $shortcode );
			}
		}
	}

	public function include_js_template() {
		if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
			return;
		}
		if ( ! isset( $this->plugin_options['post_types'] ) ) {
			return;
		}
		if ( Rexbuilder_Utilities::isBuilderLive() ) {
			include_once REXPANSIVE_BUILDER_PATH . "public/partials/rexbuilder-js-templates.php";
		} else {
			include_once REXPANSIVE_BUILDER_PATH . "public/partials/rexbuilder-js-templates-public.php";
		}
	}

	/**
	 * Including the new sprites
	 *
	 * @return void
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
	 * Saves new form row in the DB
	 * @return model with no image
	 * @since  x.x.x
	 */
	public function rex_wpcf7_save_changes(){
		$nonce = $_POST['nonce_param'];
		$elementID = $_POST['elementID'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;
		
		$formID = $_POST['form_id'];
		// Updating the form fields
		$newFormString = $_POST['new_form_string'];
		update_post_meta($formID, "_form", $newFormString);

		// Updating element data
		$elementDataString = trim( $_POST["element_data_string"] );
		update_post_meta($formID, '_rex_element_data_html', $elementDataString );

		wp_send_json_success($response);
	}

	/**
	 * Saves new form row in the DB
	 * @return model with no image
	 * @since  x.x.x
	 */
	public function rex_wpcf7_save_new_row(){
		$nonce = $_POST['nonce_param'];
		$elementID = $_POST['elementID'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;
		
		$formID = $_POST['form_id'];
		$newRowString = $_POST['row_to_add_string'];

		$formHTML = get_post_meta($formID, "_form");
		$formHTML = implode($formHTML);         // Converting in string type
		$formHTML = $formHTML.$newRowString;    // Union of the strings
		update_post_meta($formID, "_form", $formHTML);
		$response['form_html'] = $formHTML;

		wp_send_json_success($response);
	}

	public function rex_wpcf7_get_forms(){
		$nonce = $_POST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;

		$formIDs = $_POST['form_id'];
		
		for ($i = 0; $i < count($formIDs); $i++) {
			$formsHTML[$i] = get_post_meta($formIDs[$i], "_form");
		}
		$response['html_forms'] = $formsHTML;

		wp_send_json_success($response);
	}

	public function rex_wpcf7_get_mail_settings(){
		$nonce = $_POST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;

		$formID = $_POST['form_id'];
		$response['mail_settings'] = get_post_meta($formID, "_mail");
		$response['messages'] = get_post_meta($formID, "_messages");

		wp_send_json_success($response);
	}

	public function rex_wpcf7_save_mail_settings(){
		$nonce = $_POST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;

		$formID = $_POST['form_id'];

		$newMailSettings = $_POST['new_mail_settings'];
		$response['result'] = update_post_meta($formID, "_mail", $newMailSettings);

		$newMessages = $_POST['new_messages'];
		$response['result2'] = update_post_meta($formID, "_messages", $newMessages);

		wp_send_json_success($response);
	}

	public function rex_transform_element_shortcode() {
		$nonce = $_POST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;

		$elementID = $_POST['elementID'];

		$elementTitle = get_the_title($elementID);
		$shortcode = "[contact-form-7 id=\"".$elementID."\" title=\"".$elementTitle."\"]";

		$response['shortcode'] = $shortcode;
		$response['shortcode_transformed'] = do_shortcode($shortcode);
		$response['element_data_html'] = get_post_meta($elementID, "_rex_element_data_html");
		
		$postType = get_post_type($elementID);
		if ($postType == "wpcf7_contact_form") {
			$response['form_content'] = get_post_meta($elementID, "_form");
		}

		wp_send_json_success($response);
	}

	/**
	 * Saves wpcf7 data
	 * @return model with no image
	 * @since  x.x.x
	 */
	public function rex_element_get_span_data () {
		$nonce = $_POST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;

		$elementID = $_POST['element_id'];

		$response['element_data_html'] = get_post_meta($elementID, "_rex_element_data_html");

		wp_send_json_success($response);
	}

	/**
	 * Saves wpcf7 data
	 * @return model with no image
	 * @since  x.x.x
	 */
	public function rex_wpcf7_get_form_data(){
		$nonce = $_POST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;

		$formID = $_POST['form_id'];

		$response['wpcf7_data_html'] = get_post_meta($formID, "_rex_wpcf7_data_html");

		wp_send_json_success($response);
	}

	/**
	 * Saves wpcf7 data
	 * @return model with no image
	 * @since  x.x.x
	 */
	public function rex_wpcf7_save_form_data(){
		$nonce = $_POST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => ''
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		$response['error'] = false;

		$formID = $_POST['form_id'];
		$formDataHTML = $_POST['form_data_html'];

		update_post_meta($formID, "_rex_wpcf7_data_html", $formDataHTML);

		wp_send_json_success($response);
	}

	/**
	 * Save section rexids
	 *
	 * @since 2.0.0
	 */
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

	/**
	 * Saving custom CSS on a single page
	 * 
	 * @return JSON saving response
	 * @since  2.0.0
	 */
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

	/**
	 * Tracing custom effects present on a page
	 * to load js resources in an optimized way
	 * 
	 * @return JSON saving response
	 * @since  2.0.0
	 */
	public function rexlive_save_custom_effects()
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

		$custom_effects = $_POST['custom_effects'];
		$custom_effects_active = array();

		foreach ( $custom_effects as $key => $effect ) {
			if ( 'true' == $effect['active'] ) {
				array_push( $custom_effects_active, $effect['condition'] );
			}    
		}

		update_post_meta( $post_id_to_update, '_rexbuilder_custom_effects', join( $custom_effects_active, ',' ) );

		wp_send_json_success($response);
	}

	/**
	 * Saving available layouts names on a single page
	 * 
	 * @return JSON saving response
	 * @since  2.0.0
	 */
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
	 * Saving editable fields changes
	 *
	 * @return JSON
	 * @since 2.0.0
	 * @date 31-05-2019
	 */
	public function rexlive_save_editable_fields() {
		$nonce = $_REQUEST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => '',
		);

		if (!wp_verify_nonce($nonce, 'rex-ajax-call-nonce')):
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		endif;

		if ( ! isset( $_REQUEST['fieldData'] ) || ! isset( $_REQUEST['postID'] ) ) {
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		}

		$response['error'] = false;
		$fieldDataEncoded = $_REQUEST['fieldData'];
		$postID = $_REQUEST['postID'];

		if ( ! empty( $fieldDataEncoded ) ) {
			$fieldDataEncodedStripped = stripslashes( $fieldDataEncoded );
			$fieldData = json_decode( $fieldDataEncodedStripped, true );

			$update_post = false;
			$post_args = array(
				'ID' => $postID
			);
			
			foreach( $fieldData as $field ) {
				foreach( $field['info'] as $info ) {
					switch( $info['table'] ) {
						case 'post':
							$update_post = true;
							$post_args[$info['field']] = $field['value'];
							break;
						case 'postmeta':
							$temp = array(
								'field' => $info['field'],
								'value' => $field['value'],
								'prev_value' => $field['prev_value'],
								'type' => $field['type'],
								'result' => null
							);

							// handling particular field types
							$update_value;
							switch( $field['type'] ) {
								case 'media_list':
									$old_value = get_post_meta( $postID, $info['field'], true );
									if ( ! empty( $old_value ) ) {
										$explode_old_value = explode( ',', $old_value );
									} else {
										$explode_old_value = array();   
									}
									if ( ! empty( $field['prev_value'] ) ) {
										foreach( $explode_old_value as $i => $media_list_id ) {
											if ( $field['prev_value'] == $media_list_id ) {
												// handling media replace
												if ( ! empty( $field['value'] ) ) {
													$explode_old_value[$i] = $field['value'];
												} else {    // handling media remove
													unset( $explode_old_value[$i] );
												}
											}
										}
									} else {
										// handling media add
										$explode_old_value[] = $field['value'];
									}
									$update_value = implode( ',', $explode_old_value );
									break;
								default:
									$update_value = $field['value'];
									break;
							}

							$temp['result'] = update_post_meta( $postID, $info['field'], $update_value );
							$response['update_post_meta'][] = $temp;
							break;
						default:
							break;
					}
				}
			}

			$response['update_post'] = $post_args;

			if ( $update_post ) {
				$update_post_response = wp_update_post( $post_args );
			}

			do_action( 'rexpansive_builder_live_after_save_editable_fields', $postID, $response );
		}

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
	public function rexlive_get_embed_code() {  // Public function that allows inline video to be loaded into the element

		$nonce = $_GET['nonce_param'];  // $nonce is a data that is received by a form via a method = GET

		$response = array(  // $response is a binder containing two values which are 'error' and 'msg'
			'error' => false,   // 'error' is set to false as an initial value
			'msg' => '',        // 'msg' it is set as a nothing
		);

		if ( ! wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) : // The presence of the value sent by the input is verified
			$response['error'] = true;          // 'error' change the default status is enabled to 'true'
			$response['msg'] = 'Error!';        // 'msg' takes a textual value
			wp_send_json_error( $response );    // viene sent the error via json, named "$ response"
		endif;                                  // the verification ends

		$url_to_embed = $_GET['url_to_embed'];  // $url_to_embed è il valore che viene preso al momento del caricamento del video
		if( false === wp_http_validate_url( $url_to_embed ) ) { // SE, in seguito al controllo, si verifica l'invalidità del valore
			$response['error'] = true;          // 'error' change the default status is enabled to 'true'
			$response['msg'] = 'Error!';        // 'msg' takes a textual value
			wp_send_json_error( $response );    // viene sent the error via json, named "$ response"
		}

		$embed = '[embed]' . $url_to_embed . '[/embed]';    // The html / php structure is constructed for the final value

		$response['shortcode'] = $embed;    // $response['shortcode'] is equal to the value of $ embed preconfigured above
		
		// Must run the shortcode in this manner
		// Cause do_shortcode do not work for [embed]

		global $wp_embed;   // It calls back $wp_embed
		$response['embed'] = $wp_embed->run_shortcode($embed);  // $response['embed'] is compressed into $embed, via $wp_embed

		wp_send_json_success($response);    // the result is sent via json, called "$response"
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
	 * Get the content of a page to display inside a popup
	 * @return JSON response
	 * @since  2.0.3
	 */
	public function rex_get_popup_content() {
		$nonce = $_REQUEST['nonce_param'];

		$response = array(
			'error' => false,
			'msg' => '',
		);

		if( !wp_verify_nonce( $nonce, 'rex-ajax-call-nonce' ) ) {
			$response['error'] = true;
			$response['msg'] = 'Nonce Error!';
			wp_send_json_error($response);
		}

		// $t1 = microtime(true);
		$maybe_id = url_to_postid( $_REQUEST['target'] );
		// $t2 = microtime(true);
		// $response['utp_T'] = $t2 - $t1;

		$response['error'] = false;
		$response['ID'] = $maybe_id;
		$argsQuery = array(
			'p' => $maybe_id,
			'post_type' => 'any'
		);

		$query = new WP_Query( $argsQuery );

		if ( $query->have_posts() ) {
			add_filter( 'rexbuilder_fast_load', function() { return 0; } );
			add_filter( 'rexbuilder_animation_enabled', function() { return false; } );
			while ( $query->have_posts() ) {
				$query->the_post();
				$post = $query->post;
				ob_start();
				the_content();
				$response['data'] = ob_get_clean();
			}
		}
		wp_reset_postdata();

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
	 * @version  2.0.2 Fix the return of the content for the builder to return only "the content" without
	 *                 "doing" the shortcode
	 */
	public function generate_builder_content( $content ) {
		global $post;      

		if ( isset ( $post ) ) {
			$builder_active = apply_filters('rexbuilder_post_active', get_post_meta($post->ID, '_rexbuilder_active', true));
			
			if ( 'true' == $builder_active ) {
				ob_start();

				if( Rexbuilder_Utilities::isBuilderLive() ) {
					$editor = $_GET['editor'];
				} else{
					$editor = false;
				}

				$defaultButtonsIDs = '[]';
				$buttonsIDsJSON = get_option( '_rex_buttons_ids', $defaultButtonsIDs );
				$stripped = stripslashes( $buttonsIDsJSON );
				$buttonsIDsUsed = json_decode($stripped, true);

				$rexContainerMargins = "";
				if ( $editor ) {
					$fixTopMargins = false;
					$globalMargins = get_option("_rex_global_margins_container", "");
					$pageMargins = get_post_meta($post->ID, '_margins_container', true);
					$globalMarginsStripped = stripslashes( $globalMargins );
					$globalMarginsDecoded = json_decode($globalMarginsStripped, true);
					$pageMarginsStripped = stripslashes( $pageMargins );
					$pageMarginsDecoded = json_decode($pageMarginsStripped, true);
					
					if ( $pageMarginsDecoded !== null ) {
						$rexContainerMargins = "margin-top: ".$pageMarginsDecoded["top"]."px";
						if($pageMarginsDecoded["top"] > 0){
							$fixTopMargins = true;
						}
					} else if ( $globalMarginsDecoded !== null ) {
						$rexContainerMargins = "margin-top: ".$globalMarginsDecoded["top"]."px";
						if( $globalMarginsDecoded["top"] > 0 ) {
							$fixTopMargins = true;
						}
					}

					$global_settings = json_decode( stripslashes( get_option( '_rex_global_page_settings', '[]' ) ), true );
					$custom_settings = json_decode( stripslashes( get_post_meta( $post->ID, '_rex_custom_page_settings', true ) ), true );

					if ( isset( $custom_settings['container_distancer']['top'] ) && '' !== $custom_settings['container_distancer']['top'] )
					{
						$fixTopMargins = true;
						$custom_style = ' style="margin-top:' . $custom_settings['container_distancer']['top'] . 'px;"';
					} else if ( isset( $global_settings['container_distancer']['top'] ) && '' !== $global_settings['container_distancer']['top'] ) {
						$fixTopMargins = true;
						$custom_style = ' style="margin-top:' . $global_settings['container_distancer']['top'] . 'px;"';
					}
				}

?>
	<div class="rexbuilder-live-content<?php echo ($editor ? ' rexbuilder-live-content--editing add-new-section--hide'.($fixTopMargins ? ' fix-tools-first-row' : '') : ''); ?>"<?php echo ( $editor && $fixTopMargins ? $custom_style : ''); ?>>
		<?php
		$backendEditing = "true";
		if( get_post_meta( $post->ID, '_save_from_backend', true ) == "false" ) {
			$backendEditing = "false";
		}
		
		require REXPANSIVE_BUILDER_PATH . "public/partials/rexlive-page-information.php";

		?>
		<div class="rex-container" data-rex-layout-selected="" data-backend-edited="<?php echo $backendEditing;?>">
		<?php echo $rexbuilderShortcode; ?>
		<?php do_action( 'rexbuilder_builder_after_live_content' ); ?>
		</div>
		<?php 
		if ( isset( $editor ) && $editor == "true" ) {
?>
			<div class="bl_d-flex bl_jc-c add-new-section__wrap">
				<div class="tool-button tool-button--inline tool-button--flat tool-button--add-big add-new-section tippy" data-new-row-position="bottom" data-tippy-content="<?php _e( 'Add Row','rexpansive-builder' ); ?>">
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
			}
		}
		
		return $content;
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
	public function print_photoswipe_template() {
		global $post;
		if ( $this->builder_active_on_this_post_type() ) {
			include Rexbuilder_Utilities::get_plugin_templates_path('rexbuilder-photoswipe-template.php');
		}
	}

	/**
	 * Print the custom styles defined in the builder
	 *
	 * @since    1.0.0
	 */
	public function print_post_custom_styles() {
		global $post;
		if ( $this->builder_active_on_this_post_type() ) {
			$meta = get_post_meta($post->ID, '_rexbuilder_custom_css', true);
			if ($meta != ''):
				wp_add_inline_style( $this->plugin_name . '-style', $meta);
			endif;
		}
	}
	
	/**
	 * Printing the custom buttons style
	 * @return void
	 * @since  2.0.0
	 */
	public function print_rex_buttons_style() {
		global $post;
		if ( $this->builder_active_on_this_post_type() ) {
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
	public function print_vertical_dots() {
		global $post;

		if ( $this->builder_active_on_this_post_type() ) {
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
	 *  Filtering YOAST SEO plugin meta description generator
	 *  @since 2.0.0
	 */
	public function filter_yoast_seo_description( $description ) {
		global $post;

		if ( $this->builder_active_on_this_post_type() ) {
			$yoast_metadesc = get_post_meta( $post->ID, '_yoast_wpseo_metadesc', true );
			if ( '' == $yoast_metadesc ) {
				$content = get_post_meta( $post->ID, '_rexbuilder_shortcode', true );
				$stripped_content = preg_replace('#\[[^\]]+\]#', '', $content);
				$stripped_content = strip_tags($stripped_content);
				
				$stripped_content_lenght = strlen( $stripped_content );
				if ( 0 === $stripped_content_lenght ) {
					$stripped_content = get_the_title();
				} else if ( $stripped_content_lenght > 340 ) {
					$stripped_content = substr( $stripped_content, 0, 340 );
				}

				return $stripped_content;
			}
		}

		return $description;
	}

	/**
	 * Check if the builder is active on this post type
	 *
	 * @return bool
	 * @since 1.1.1
	 */
	private function builder_active_on_this_post_type() {
		global $post;

		$post_to_activate = $this->plugin_options['post_types'];
		$this_post_type = get_post_type();
		$post_id = get_the_ID();
		$builder_active = get_post_meta( $post_id, '_rexbuilder_active', true );

		$condition = isset( $post_to_activate ) && $this_post_type && array_key_exists( $this_post_type, $post_to_activate ) && $post_id && 'true' == $builder_active;

		return ( apply_filters( 'rexbuilder_post_type_active', $condition ) );
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
		
		// adding a global suffix, to prevent duplicate 
		// contact forms on the same page conflicts
		global $rsuffix;
		if ( !isset ( $rsuffix ) )
		{
			$rsuffix = 0;
		}
		else
		{
			$rsuffix++;
		}
		$cclass = 'rxcf7-custom-style-' . ( isset( $atts['id'] ) ? $atts['id'] : '' ) . '-' . $rsuffix;
		
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
