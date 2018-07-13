<?php
/**
 * Print the markup of the modals of the builder
 *
 * @link       htto://www.neweb.info
 * @since      1.0.10
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined('ABSPATH') or exit;
?>
<script type="text/x-tmpl" id="tmpl-tool-block">
<div class="rexlive-block-toolbox">
    <div class="rexlive-top-block-tools">
        <span class="el-size-viewer"></span>
        <button class="tool-button btn-floating builder-delete-block waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexspansive');?>">
		    <i class="material-icons white-text">&#xE5CD;</i>
    	</button>

	    <div class="tool-button btn-flat builder-copy-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive');?>">
		    <i class="material-icons grey-text text-darken-2">&#xE14D;</i>
        </div>
    </div>
</div>
</script>
<script type="text/x-tmpl" id="tmpl-video-vimeo">
<div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block">
    <iframe src="{%=video.url%}" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
    </iframe>
</div>
</script>
<script type="text/x-tmpl" id="tmpl-video-mp4">
<div class="rex-video-wrap">
    <video class="rex-video-container" preload autoplay loop muted>
        <source type="video/mp4" src="{%=video.url%}">
    </video>
</div>
</script>
<script type="text/x-tmpl" id="tmpl-video-toggle-audio">
<div class="rex-video-toggle-audio user-has-muted">
    <div class="rex-video-toggle-audio-shadow">
    </div>
</div>
</script>
<script type="text/x-tmpl" id="tmpl-overlay-block-div">
<div class="responsive-block-overlay" style="background-color:{%=overlay.color%}">
</div>
</script>
<script type="text/x-tmpl" id="tmpl-overlay-section-div">
<div class="responsive-section-overlay" style="background-color:{%=overlay.color%}">
</div>
</script>
<script type="text/x-tmpl" id="tmpl-photoswipe-block">
<figure class="pswp-figure" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
    <a class="pswp-item" href="{%=image.link%}" itemprop="contentUrl" data-size="{%=image.width%}x{%=image.height%}">
        <div class="pswp-item-thumb" data-thumb-image-type="{%=image.type%}" data-thumburl="{%=image.link%}" itemprop="thumbnail">
        </div>

    </a>
    <figcaption class="pswp-item-caption" itemprop="caption description">
    </figcaption>
</figure>
</script>
<script type="text/x-tmpl" id="tmpl-link-block">
<a class="element-link hovered" href="{%=link.url%}" title="{%=link.url%}">
</a>					
</script>
<script type="text/x-tmpl" id="tmpl-navigator-item">
    <li>
        <a href="#{%=navigator.title%}" class="vertical-nav-link not-smooth-anchor-scroll" data-number="{%=navigator.number%}">
            <span class="dot-cont">
                <span class="dot"></span>
            </span>
            <p class="label white-black">{%=navigator.title%}</p>
        </a>
	</li>					
</script>
