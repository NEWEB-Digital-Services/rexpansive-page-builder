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
class Rexbuilder_Timeline {
	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since   	1.1.4
	 * @param      string    $atts       		The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public static function render( $atts, $content = null ) {
		global $title_tag;
		global $desc_tag;

		extract( shortcode_atts( array(
			'id' => '',
			'classes' => '',
			'title' => '',
			'title_tag' => 'h3',
			'desc_tag' => 'p',
			'title_color' => '#000',
			'desc_color' => '#000',
			'dot_color' => '',
			'line_color' => '',
			'dot_top' => '',
			'event_space' => '',
			'first_event_space' => '',
			'margin_left' => '',
		), $atts ) );

		if( '' === $id ) {
			$timeline_id = 'timeline-' . rand();
		} else {
			$timeline_id = $id;
		}
		
		$inline_stlye = "";

		if( "" !== $dot_color ) {
			$inline_stlye .= '#' . $timeline_id . ' .timeline .event-dot{background-color:' . $dot_color . '}';
		}

		if( "" !== $line_color ) {
			$inline_stlye .= '#' . $timeline_id . ' .timeline .event-line{background-color:' . $line_color . '}';
		}

		if( "" !== $title_color ) {
			$inline_stlye .= '#' . $timeline_id . ' ' . $title_tag . '{color:' . $title_color . '}';
		}

		if( "" !== $desc_color ) {
			$inline_stlye .= '#' . $timeline_id . ' ' . $desc_tag . '{color:' . $desc_color . '}';
		}

		if( "" !== $dot_top ) {
			$inline_stlye .= '#' . $timeline_id . ' .timeline .event-dot{top:' . $dot_top . 'px}';
			$inline_stlye .= '#' . $timeline_id . ' .timeline .event:first-of-type .event-dot{top:0}';
			$inline_stlye .= '#' . $timeline_id . ' .timeline .event:last-of-type .event-line{bottom:calc(100% - ' . $dot_top . 'px)}';
		}

		if( "" !== $event_space ) {
			$inline_stlye .= '#' . $timeline_id . ' .timeline .event{padding-top:' . $event_space . 'px}';
		}
		
		if( "" !== $first_event_space ) {
			$inline_stlye .= '#' . $timeline_id . ' .timeline .event:first-of-type{padding-top:' . $first_event_space . 'px}';
		}
		
		if( "" !== $margin_left ) {
			$inline_stlye .= '#' . $timeline_id . '.timeline-wrap{margin-left:' . $margin_left . 'px}';
		}

		ob_start();
?>
<div id="<?php echo esc_attr( $timeline_id ); ?>" class="timeline-wrap">
<?php
		if( "" !== $inline_stlye ) {
?>
<style type="text/css"><?php echo $inline_stlye; ?></style>
<?php
		}
?>
<?php
		if( "" !== $title ) {
?>
	<div class="timeline-wrap--title-wrap">
		<div class="timeline-wrap--title">
			<<?php echo $title_tag; ?>><?php echo $title; ?></<?php echo $title_tag; ?>>
		</div>
	</div>
<?php
		}
?>
	<ul class="timeline">
		<?php echo do_shortcode('[RexTimelineEvent]'); ?>
		<?php echo do_shortcode($content); ?>
	</ul>
</div>
<?php
		return ob_get_clean();
	}
}