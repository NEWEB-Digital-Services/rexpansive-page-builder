<?php
/**
 * Templates used on public face of the plugin
 * @link       htto://www.neweb.info
 * @since      x.x.x
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
?>

<script type="text/x-tmpl" id="tmpl-video-vimeo">
	<div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block">
		<iframe src="{%=video.url%}" width="640" height="360" frameborder="0" allow="autoplay"  webkitallowfullscreen mozallowfullscreen allowfullscreen>
		</iframe>
	</div>
</script>

<script type="text/x-tmpl" id="tmpl-video-mp4">
	<div class="rex-video-wrap" data-rex-video-width="{%=video.width%}" data-rex-video-height="{%=video.height%}">
		<video class="rex-video-container" preload autoplay loop muted>
			<source type="video/mp4" {% if ( true == video.fast_load ) { %}data-src="{%=video.url%}"{% } else { %}src="{%=video.url%}"{% } %}>
		</video>
	</div>
	<div class="rex-video__controls">
		<div class="loader video-tool video-tool--view"></div>
		<div class="pause video-tool">
			<div class="indicator"></div>
		</div>
		<div class="play video-tool">
			<div class="indicator"></div>
		</div>
	</div>
</script>

<script type="text/x-tmpl" id="tmpl-video-youtube">
	<div class="rex-youtube-wrap" data-property="{videoURL:'{%=video.url%}',containment:'self',startAt:0,mute:'{%=video.audio%}',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}">
	</div>
</script>

<script type="text/x-tmpl" id="tmpl-video-toggle-audio">
	<div class="rex-video-toggle-audio">
		<div class="rex-video-toggle-audio-shadow">
		</div>
	</div>
</script>

<script type="text/x-tmpl" id="tmpl-photoswipe-block">
<figure class="pswp-figure" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
	<a class="pswp-item" href="{%=image.link%}" itemprop="contentUrl" data-size="{%=image.width%}x{%=image.height%}">
		<div class="pswp-item-thumb" data-thumb-image-type="{%=image.type%}" data-thumburl="{%=image.link%}" itemprop="thumbnail"></div>
	</a>
	<figcaption class="pswp-item-caption" itemprop="caption description"><?php do_action( 'rexbuilder_block_pswp_item_caption' ); ?></figcaption>
</figure>
</script>

<script type="text/x-tmpl" id="tmpl-photoswipe-block-inline">
<figure class="pswp-figure {%=image.align%}" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject" style="width: {%=image.width%}; height:{%=image.height%}">
	<a class="pswp-item" href="{%=image.link%}" itemprop="contentUrl" data-size="{%=image.width%}x{%=image.height%}" style="width: {%=image.width%}; height:{%=image.height%}">
		<div class="pswp-item-thumb" data-thumb-image-type="{%=image.type%}" data-thumburl="{%=image.link%}" itemprop="thumbnail"></div>
		<div class="full-image-background" style="background-image:url('{%=image.link%}');"></div>
		<div class="rex-custom-scrollbar rex-custom-position"></div>
	</a>
	<figcaption class="pswp-item-caption" itemprop="caption description"></figcaption>
</figure>
</script>