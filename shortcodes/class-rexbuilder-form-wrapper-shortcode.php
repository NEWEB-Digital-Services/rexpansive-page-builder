<?php

/**
 * The class that register and render a indicator element.
 *
 * @link       htto://www.neweb.info
 * @since      2.0.6
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
class Rexbuilder_FormWrapper {
	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since			2.0.6
	 * @param			string    $atts       		The attributest passed.
	 * @param			string    $content    		The content passed.
	 */
	public static function render($atts, $content = null) {
		extract(shortcode_atts(array(
			'id' => '',
		), $atts));

		if ("" === $id) {
			return;
		}

		$formWrapperID = $id;
		$formName = get_the_title($formWrapperID);
		$formDataHTML = get_post_meta($formWrapperID, "_rex_element_data_html")[0];

		ob_start();
		?>
		<span class="rex-elements-paragraph">
			<span class="rex-element-wrapper" data-rex-element-id="<?php echo $formWrapperID ?>" data-rex-element-number="1">
				<?php echo $formDataHTML ?>

				<span class="string-shortcode" shortcode="[contact-form-7 id=&quot;<?php echo $formWrapperID ?>&quot; title=&quot;<?php echo $formName ?>&quot;]"></span>

				<div class="rex-element-container">
					<?php echo do_shortcode($content); ?>
				</div>
			</span>
		</span>

		<?php

		return ob_get_clean();
	}
}
