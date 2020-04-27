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
<p id="vertical-nav-label" class="label"></p>
<nav class="vertical-nav">
	<ul>
	<?php
		$i = 1;
		foreach($titles as $title) :
			if(!empty($title)) :
				$id_nospaces = preg_replace('/[\W\s+]/', '', $title);
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
