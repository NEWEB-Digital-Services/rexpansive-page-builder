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
<script type="text/x-tmpl" id="tmpl-video-youtube">
data-property="{videoURL:'{%=video.url%}',containment:\'self\',startAt:0,mute:' . $mute . ',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}"';

</script>
<script type="text/x-tmpl" id="tmpl-video-vimeo">
<div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block">
    <iframe src="{%=video.url%}?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0&muted=1" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
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