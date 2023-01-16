<?php

/**
 * The class that register and render a indicator element.
 *
 * @link       htto://www.neweb.info
 * @since      1.1.4
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/shortcodes
 */

/**
 * Defines the characteristics of the indicator
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/shortcodes
 * @author     Neweb <info@neweb.info>
 *
 */
class Rexbuilder_Timeline_Event {
	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since   	1.1.4
	 * @param      string    $atts       		The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public static function render( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'title' => '',
			'desc' => '',
		), $atts ) );

		global $title_tag;
		global $desc_tag;

		ob_start();
?>
<li class="event">
	<span class="event-line"></span>
	<?php if( "" !== $title ) { ?>
	<div class="event-title">
		<<?php echo $title_tag; ?>><?php echo $title; ?></<?php echo $title_tag; ?>>
    </div>
	<?php } ?>
	<?php if( "" !== $desc ) { ?>
	<div class="event-content">
    	<<?php echo $desc_tag; ?>><?php echo $desc; ?></<?php echo $desc_tag; ?>>
    </div>
	<?php } ?>
	<span class="event-dot"></span>
</li>
<?php
		return ob_get_clean();
	}
}