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
class Rexbuilder_Timeline_Pro {
	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since   	2.0.0
	 * @param      string    $atts       		The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public static function render( $atts, $content = null ) {
		global $title_wrap_start;
		global $title_wrap_end;

		extract( shortcode_atts( array(
			'id' => '',
			'classes' => '',
			'title_tag' => 'h3',
			'title_color' => '',
			'dot_color' => '',
			'line_color' => '',
		), $atts ) );

		if( '' === $id ) {
			$timeline_id = 'timeline-' . rand();
		} else {
			$timeline_id = $id;
		}

		$inline_stlye = '';
		if ( ! empty( $dot_color ) ) {
			$inline_stlye .= '#' . $timeline_id . ' .timeline-indicator{background-color:' . $dot_color . ';}';
		}

		if ( ! empty( $line_color ) ) {
			$inline_stlye .= '#' . $timeline_id . ' .timeline-event:not(:first-child) .timeline-line-up{background-color:' . $line_color . ';}';
			$inline_stlye .= '#' . $timeline_id . ' .timeline-event:not(:last-child) .timeline-line-down{background-color:' . $line_color . ';}';
		}

		$title_wrap_start = '<' . $title_tag;
		if ( ! empty( $title_color ) ) {
			$title_wrap_start .= ' style="color:' . $title_color . ';"';
		}
		$title_wrap_start .= '>';
		$title_wrap_end = '</' . $title_tag . '>';

		ob_start();
?>
<?php
		if( "" !== $inline_stlye ) {
?>
<style type="text/css"><?php echo $inline_stlye; ?></style>
<?php
		}
?>
<div<?php echo ( ! empty( $id ) ? ' id="' . $id . '" ' : '' ); ?>class="timeline-pro-wrap<?php echo ( ! empty( $classes ) ? ' ' . $classes : '' ); ?>">
	<?php echo do_shortcode($content); ?>
</div>
<?php
		return ob_get_clean();
	}
}