<?php

/**
 * The class that register and render a indicator element.
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
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
class Rexbuilder_Timeline_Pro_Event {
	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since   	2.0.0
	 * @param      string    $atts       		The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public static function render( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'title' => '',
			'subtitle' => '',
			'direction' => ''
		), $atts ) );

		global $title_wrap_start;
		global $title_wrap_end;
		global $subtitle_wrap_start;
		global $subtitle_wrap_end;

		ob_start();
?>
<div class="timeline-event<?php echo ( ! empty( $direction ) ? ' timeline-event--' . $direction : '' ); ?>">
	<div class="timeline-left">
		<?php echo $title_wrap_start; ?><?php echo $title; ?></h1><?php echo $title_wrap_end; ?>
		<?php
		if (!empty($subtitle)) {
			echo $subtitle_wrap_start;
			echo $subtitle;
			echo $subtitle_wrap_end;
		}
		?>
	</div>
	<div class="timeline-line-wrap">
		<div class="timeline-line">
			<div class="timeline-line-up"></div>
			<div class="timeline-indicator"></div>
			<div class="timeline-line-down"></div>
		</div>
	</div>
	<?php if (!empty($content)) { ?>
	<div class="timeline-right">
		<?php echo do_shortcode( $content ); ?>
	</div>
	<?php } ?>
</div>
<?php
		return ob_get_clean();
	}
}