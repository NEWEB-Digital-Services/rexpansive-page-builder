<?php
/**
 * Print the markup of the templates
 *
 * @link       htto://www.neweb.info
 * @since      1.0.10
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined( 'ABSPATH' ) or exit;

?>
<script id="rexbuilder-tmpl-element-actions" type="text/html">
<div class="element-actions">
	<div class="builder-fab-row-widgets actions-center-icons fixed-action-btn horizontal">
		<button class="btn-floating builder-show-widgets waves-effect waves-light light-blue darken-3">
			<i class="material-icons">add</i>
		</button>
		<ul>
			<li class="edit_handler text-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive'); ?>">
				<i class="material-icons rex-icon">u</i>
			</li>
            <div class="edit_handler rex-slider-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Rex Slider', 'rexpansive'); ?>">
				<i class="material-icons rex-icon">X</i>
			</div>
			<li class="background_handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive'); ?>">
					<i class="material-icons">&#xE8B8;</i>
			</li>
			<li class="copy-handler btn-floating grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive'); ?>">
					<i class="material-icons white-text">&#xE14D;</i>
			</li>	
		</ul>
	</div>
	<div class="actions-center-icons">
		<div class="edit_handler text-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive'); ?>">
			<i class="material-icons rex-icon">u</i>
        </div>
        <div class="edit_handler rex-slider-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Rex Slider', 'rexpansive'); ?>">
			<i class="material-icons rex-icon">X</i>
		</div>
		<div class="background_handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive'); ?>">
			<i class="material-icons">&#xE8B8;</i>
		</div>
		<br>
		<div class="copy-handler btn-floating grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive'); ?>">
			<i class="material-icons white-text">&#xE14D;</i>
		</div>
	</div>
	<div class="delete_handler btn-floating waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexpansive'); ?>">
		<i class="material-icons white-text">&#xE5CD;</i>
	</div>
</div>
</script><!-- element actions template -->

<script id="rexbuilder-tmpl-text-element" type="text/html">
<li id="data.imageid" class="data.blocktype item with-border z-depth-1 hoverable svg-ripple-effect" data-block_type="data.blocktype" data-block-custom-classes="" data-content-padding="" data-bg_settings="">
	data.elementactionsplaceholder
	<div class="element-data">
		<textarea class="data-text-content" display="none"></textarea>
	</div>
	<div class="element-preview-wrap">
		<div class="element-preview"></div>
	</div>
	<div class="element-visual-info">
		<div class="vert-wrap">
			<div class="vert-elem">
				<i class="material-icons rex-icon rex-notice rex-video-notice">G</i>
			</div>
		</div>
	</div>
	<div class="el-visual-size"><span></span></div>
</li>
</script><!-- text element template -->

<script id="rexbuilder-tmpl-image-element" type="text/html">
<li id="data.textid" class="image item z-depth-1 hoverable svg-ripple-effect data.isnaturalimage" data-block_type="text" data-block-custom-classes="" data-content-padding="" data-bg_settings='data.bgblocksetts'>
	data.elementactionsplaceholder
	<div class="element-data">
		<textarea class="data-text-content" display="none"></textarea>
	</div>
	<div class="element-preview-wrap" style="background-image:url(data.imgprevsrc);">
		<div class="element-preview">
			<div class="backend-image-preview" data-image_id="data.attachmentid"></div>
		</div>
	</div>
	<div class="element-visual-info">
		<div class="vert-wrap">
			<div class="vert-elem">
				<i class="material-icons rex-icon rex-notice rex-video-notice">G</i>
			</div>
		</div>
	</div>
	<div class="el-visual-size"><span></span></div>
</li>
</script><!-- image element template -->

<script id="rexbuilder-tmpl-empty-element" type="text/html">
<li id="data.emptyid" class="empty with-border item z-depth-1 hoverable svg-ripple-effect" data-block_type="empty" data-bg_settings="" data-block-custom-classes="" data-content-padding="">
	<div class="element-actions">
		<div class="builder-fab-row-widgets actions-center-icons fixed-action-btn horizontal">
			<button class="btn-floating builder-show-widgets waves-effect waves-light light-blue darken-3">
				<i class="material-icons">add</i>
			</button>
			<ul>
				<li class="edit_handler text-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive'); ?>">
					<i class="material-icons rex-icon">u</i>
				</li>
                <div class="edit_handler rex-slider-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Rex Slider', 'rexpansive'); ?>">
					<i class="material-icons rex-icon">X</i>
				</div>
				<li class="background_handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive'); ?>">
						<i class="material-icons">&#xE8B8;</i>
				</li>
				<li class="copy-handler btn-floating grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive'); ?>">
						<i class="material-icons white-text">&#xE14D;</i>
				</li>	
			</ul>
		</div>
		<div class="actions-center-icons">
			<div class="edit_handler text-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Text', 'rexpansive'); ?>">
				<i class="material-icons rex-icon">u</i>
			</div>
            <div class="edit_handler rex-slider-handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Rex Slider', 'rexpansive'); ?>">
				<i class="material-icons rex-icon">X</i>
			</div>
			<div class="background_handler btn-floating waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive'); ?>">
				<i class="material-icons">&#xE8B8;</i>
			</div>
			<br>
			<div class="copy-handler btn-floating grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive'); ?>">
				<i class="material-icons white-text">&#xE14D;</i>
			</div>
		</div>
		<div class="delete_handler btn-floating waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexpansive'); ?>">
			<i class="material-icons white-text">&#xE5CD;</i>
		</div>
	</div>
	<div class="element-data">
		<textarea class="data-text-content" display="none"></textarea>
	</div>
	<div class="element-preview-wrap">
		<div class="element-preview"></div>	
	</div>
	<div class="element-visual-info">
		<div class="vert-wrap">
			<div class="vert-elem">
				<i class="material-icons rex-icon rex-notice rex-video-notice">G</i>
			</div>
		</div>
	</div>
	<div class="el-visual-size"><span></span></div>
</li>
</script><!-- empty element template -->
<script id="rexbuilder-tmpl-notice-video" type="text/html">
<div class="element-visual-info rex-active-video-notice">
	<div class="vert-wrap">
		<div class="vert-elem">
			<i class="material-icons rex-icon rex-notice rex-video-notice">G</i>
		</div>
	</div>
</div>
<div class="el-visual-size"><span></span></div>
</script><!-- rexbuilder-tmpl-notice-video -->
		<?php
			$defaultsectionproperties = json_encode( array(
				"color"			=>	"",
				"image"			=>	"",
				"url"			=>	"",
				"bg_img_type"	=>	"",
				"video"			=>	"",
				"youtube"		=>	"",
			) );
			$defaultidproperties = json_encode( array(
				"section_id"	=>	"",
				"icon_id"		=>	"",
				"icon_url"		=>	"",
				"image_id"		=>	"",
				"image_url"		=>	"",
			) );
			$defaultsectionconfigs = json_encode( array(
				'gutter' => '20',
				'isFull' => '',
				'custom_classes' => '',
				'section_width'	=>	'',
			) );
		?>
<script id="rexbuilder-tmpl-section" type="text/html">
<div class="builder-row clearfix z-depth-1" data-count="" data-gridcontent='' data-gridproperties='<?php echo htmlspecialchars( $defaultsectionproperties ); ?>' data-griddimension='full' data-layout='fixed' data-sectionid='' data-section-overlay-color='' data-backresponsive='<?php echo htmlspecialchars( $defaultsectionconfigs ); ?>' data-row-separator-top="" data-row-separator-bottom="" data-row-separator-right="" data-row-separator-left="" data-section-active-photoswipe="">
	<div class="builder-row-contents">
		<div class="builder-edit-row-header">
			<button class="btn-floating builder-delete-row waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete row', 'rexspansive'); ?>">
				<i class="material-icons white-text">&#xE5CD;</i>
			</button>
		</div>
		<div class="builder-edit-row-wrap clearfix row valign-wrapper">
			<div class="col s4 rex-edit-dimension-wrap valign-wrapper">
				<div>
					<input type="radio"
						id="section-full-data.index"
						name="section-dimension-data.index" 
						class="builder-edit-row-dimension with-gap" 
						value="full" checked title="Full" />
					<label for="section-full-data.index" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Full', 'rexspansive' ); ?>">
						<i class="material-icons rex-icon">v<span class="rex-ripple"></span></i>
					</label>
				</div>
				<div>
					<input type="radio"
						id="section-boxed-data.index" 
						name="section-dimension-data.index" 
						class="builder-edit-row-dimension with-gap" 
						value="boxed" title="Boxed" />
					<label for="section-boxed-data.index" class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Boxed', 'rexspansive' ); ?>">
						<i class="material-icons rex-icon">t<span class="rex-ripple"></span></i>
					</label>
				</div>
				<div class="rex-edit-layout-wrap" style="display:none;">
					<input type="radio"
						id="section-fixed-data.index" 
						name="section-layout-data.index" 
						class="builder-edit-row-layout with-gap" 
						value="fixed" checked title="Fixed" />
					<label for="section-fixed-data.index"  class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Grid Layout', 'rexspansive' ); ?>">
						<i class="material-icons">&#xE8F1;<span class="rex-ripple"></span></i>
					</label>
					<input type="radio" 
						id="section-masonry-data.index" 
						name="section-layout-data.index" 
						class="builder-edit-row-layout with-gap" 
						value="masonry" title="Masonry" />
					<label for="section-masonry-data.index"  class="tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Masonry Layout', 'rexspansive' ); ?>">
						<i class="material-icons">&#xE871;<span class="rex-ripple"></span></i>
					</label>
				</div>
			</div>
			
			<div class="builder-buttons col s4 center-align">
				<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="image" data-position="bottom" data-tooltip="<?php _e( 'Image', 'rexspansive' ); ?>">
					<i class="material-icons rex-icon">p</i>
				</button>
				<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="text" data-position="bottom" data-tooltip="<?php _e( 'Text', 'rexspansive' ); ?>">
					<i class="material-icons rex-icon">u</i>
				</button>
				<div class="builder-fab-row-widgets fixed-action-btn horizontal">
					<button class="builder-add btn-floating builder-show-widgets waves-effect waves-light light-blue darken-3">
						<i class="material-icons">add</i>
					</button>
					<ul>
						<li>
							<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="video" data-position="bottom" data-tooltip="<?php _e( 'Video', 'rexpansive' ); ?>">
								<i class="material-icons">play_arrow</i>
							</button>
						</li>
						<li>
							<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="empty" data-position="bottom" data-tooltip="<?php _e( 'Block space', 'rexspansive' ); ?>">
								<i class="material-icons rex-icon">H</i>
							</button>
						</li>
                        <li>
							<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="rexslider" data-position="bottom" data-tooltip="<?php _e( 'RexSlider', 'rexpansive' ); ?>">
								<i class="material-icons rex-icon">X</i>
							</button>
						</li>
						<!-- <li>
							<button class="btn-floating builder-add waves-effect waves-light tooltipped" value="text-fill" data-position="bottom" data-tooltip="<?php _e( 'TextFill', 'rexspansive' ); ?>">
								<span style="color:white;">T</span>
							</button>
						</li> -->
					</ul>
				</div>
			</div>
			
			<div class="col s4 right-align builder-setting-buttons">
				<div class="background_section_preview btn-floating tooltipped" data-position="bottom" data-tooltip="<?php _e( 'Row background', 'rexspansive' ); ?>"></div>
				<button class="btn-floating builder-section-config tooltipped" data-position="bottom" data-tooltip="<?php _e('Row settings', 'rexspansive'); ?>">
					<i class="material-icons">&#xE8B8;</i>
				</button>
				<div class="btn-flat builder-copy-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy row', 'rexspansive'); ?>">
					<i class="material-icons grey-text text-darken-2">&#xE14D;</i>
				</div>
				<div class="btn-flat builder-move-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Move row', 'rexspansive'); ?>">
					<i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
				</div>
			</div>
		</div>
		<div class="builder-row-edit">
			
			<div class="builder-elements">
				<div class="gridster">
					<ul>
					</ul>
					<div class="section-visual-info"></div>
				</div>
			</div>
		</div>
	</div>
</div>
</script>
<script id="rex-slider__new-slide-tmpl" type="text/html">
<div class="col rex-slider__slide rex-modal-content__modal-area__row" data-slider-slide-id="data.slideindex" data-block_type="slide">
	<div class="valign-wrapper space-between-wrapper">
		<button class="rex-slider__slide-index btn-circle btn-small btn-bordered grey-border border-darken-2 waves-effect waves-light white grey-text text-darken-2">data.slideindexfront</button>

		<div class="rex-button-with-plus">
			<button class="rex-slider__slide-edit rex-slider__slide__image-preview btn-floating waves-effect waves-light tooltipped grey darken-2" value="edit-slide" data-position="bottom" data-tooltip="<?php _e( 'Slide', 'rexpansive' ); ?>">
				<i class="material-icons rex-icon">p</i>
			</button>
			<button class="rex-slider__slide-edit rex-plus-button btn-floating light-blue darken-1 tooltipped" value="add-slide" data-position="bottom" data-tooltip="<?php _e( 'Select Image', 'rexpansive' ); ?>">
				<i class="material-icons">&#xE145;</i>
			</button>
		</div>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="text" data-position="bottom" data-tooltip="<?php _e( 'Text', 'rexpansive' ); ?>">
			<i class="material-icons rex-icon">u</i>
		</button>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="video" data-position="bottom" data-tooltip="<?php _e( 'Video', 'rexpansive' ); ?>">
			<i class="material-icons">play_arrow</i>
		</button>

		<button class="rex-slider__slide-edit btn-floating waves-effect waves-light tooltipped grey darken-2" value="url" data-position="bottom" data-tooltip="<?php _e( 'Link', 'rexpansive' ); ?>">
			<i class="material-icons rex-icon">l</i>
		</button>

		<div>
			<button class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="copy" data-tooltip="<?php _e('Copy slide', 'rexpansive'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE14D;</i>
			</button>

			<div class="rex-slider__slide-edit btn-flat tooltipped" data-position="bottom" value="move" data-tooltip="<?php _e('Move slide', 'rexpansive'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
			</div>

			<button class="rex-slider__slide-edit btn-flat tooltipped" value="delete" data-position="bottom" data-tooltip="<?php _e('Delete slide', 'rexpansive'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE5CD;</i>
			</button>
		</div>
	</div>

	<div class="rex-slider__slide-data" style="display:none;">
		<input type="hidden" name="rex-slider--slide-id" value="">
		<textarea rows="" cols="" name="rex-slider--slide-text"></textarea>
		<input type="hidden" name="rex-slider--slide-video-url" value="">
		<input type="hidden" name="rex-slider--slide-video-type" value="">
		<input type="hidden" name="rex-slider--slide-url" value="">
		<input type="hidden" name="rex-slider--slide-video-audio" value="">
	</div>
</div>
</script>