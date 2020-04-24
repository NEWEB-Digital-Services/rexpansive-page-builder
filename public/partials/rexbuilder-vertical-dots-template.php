<?php

/**
 * Provide the template for the photoswipe galleries
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */
?>
<!-- Root element of PhotoSwipe. Must have class pswp. -->
<?php
$content = get_the_content();
$pattern = get_shortcode_regex();

preg_match_all( "/$pattern/", $content, $content_shortcodes);
// Check for section titles; if no one has a title, don't display the navigation
$titles = array();
foreach( $content_shortcodes[3] as $attrs ) {
	$x = shortcode_parse_atts( trim( $attrs ) );
	if( isset($x['section_name']) && $x['section_name'] != '' ) {
		$titles[] = $x['section_name'];
	}
}

if( count($titles) > 0 ) {
?>
<p id="vertical-nav-label" class="label white-black"></p>
<nav class="vertical-nav">
	<ul>
	<?php
		$i = 1;
		foreach($titles as $title) :
			if(!empty($title)) :
				$id_nospaces = preg_replace('/\s+/', '', $title);
			?>
			<li>
				<a href="<?php echo '#' . $id_nospaces; ?>" class="vertical-nav-link not-smooth-anchor-scroll" data-number="<?php echo $i; ?>">
					<span class="dot-cont">
						<span class="dot"></span>
					</span>
				</a>
			</li>
			<?php
				$i++;
			endif;
		endforeach;
	?>
	</ul>
</nav>
<?php
}
?>
