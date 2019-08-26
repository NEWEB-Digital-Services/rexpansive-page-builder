<?php
/**
 *
 * @link       htto://www.neweb.info
 * @since      x.x.x
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
?>

<script type="text/x-tmpl" id="tmpl-photoswipe-block-inline">
<figure class="pswp-figure" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject" style="width: {%=image.width%}; height:{%=image.height%}">
    <a class="pswp-item" href="{%=image.link%}" itemprop="contentUrl" data-size="{%=image.width%}x{%=image.height%}" style="width: {%=image.width%}; height:{%=image.height%}">
        <div class="pswp-item-thumb" data-thumb-image-type="{%=image.type%}" data-thumburl="{%=image.link%}" itemprop="thumbnail"></div>
        <div class="full-image-background" style="background-image:url('{%=image.link%}');"></div>
        <div class="rex-custom-scrollbar rex-custom-position"></div>
    </a>
    <figcaption class="pswp-item-caption" itemprop="caption description"></figcaption>
</figure>
</script>