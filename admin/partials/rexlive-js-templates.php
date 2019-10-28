<?php

defined('ABSPATH') or exit;

?>
<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-button">
<div class="layout-container tool-option">
    <div class="btn-builder-layout builder-{%=customLayout.id%}-layout" data-min-width="{%=customLayout.minWidth%}" data-max-width="{%=customLayout.maxWidth%}" data-name="{%=customLayout.id%}" data-layout-type="custom">
        <i class="l-svg-icons"><svg><use xlink:href="#A009-Range"></use></svg></i>
        <div class="layout-custom-number">
            <div class="rex-number"></div>
        </div>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-button-list">
<div class="layout-container tool-option tool-button_list--item tippy" data-tippy-content="Custom">
    <div class="btn-builder-layout builder-{%=customLayout.id%}-layout" data-min-width="{%=customLayout.minWidth%}" data-max-width="{%=customLayout.maxWidth%}" data-name="{%=customLayout.id%}" data-layout-type="custom">
        <span class="layout__icon"><i class="l-svg-icons"><svg><use xlink:href="#A009-Range"></use></svg></i></span>
        <div class="layout-custom-number">
            <div class="rex-number"></div>
        </div>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-modal">
<li class="layout__item layout">
    <div class="layout__setting layout__icon"><?php Rexbuilder_Utilities::get_icon('#A009-Range'); ?></div>
    <div class="layout__setting">
        <div class="input-field">
            <input type="hidden" name="rexlive-layout-id" value="{%=customLayout.id%}">
            <input id="rexlive-layout-label-{%=customLayout.id%}" class="layout-label-input" type="text" name="rexlive-layout-label" data-editable-field="true" value="{%=customLayout.label%}">
            <label for="rexlive-layout-label-{%=customLayout.id%}" class="{% if( "" != customLayout.label ) { %}active{% } %}"><?php _e('Label','rexpansive'); ?></label>
            <span class="rex-material-bar"></span>
            <span class="layout-value layout-value--hide">{%=customLayout.label%}</span>
        </div>
    </div>
    <div class="layout__setting">
        <div class="input-field">
            <input id="rexlive-layout-min-{%=customLayout.id%}" class="layout-min-input" type="text" name="rexlive-layout-min" data-editable-field="true" value="{%=customLayout.minWidth%}">
            <label for="rexlive-layout-min-{%=customLayout.id%}" class="{% if( "" != customLayout.minWidth ) { %}active{% } %}"><?php _e( 'From', 'rexpansive' ); ?></label>
            <span class="rex-material-bar"></span>
            <span class="layout-value layout-value--hide">{%=customLayout.minWidth%}px</span>
        </div>
    </div>
    <div class="layout__setting">
        <div class="input-field">
            <input id="rexlive-layout-max-{%=customLayout.id%}" class="layout-max-input" type="text" name="rexlive-layout-max" data-editable-field="true" value="{% if( "" != customLayout.maxWidth ) { %}{%=customLayout.maxWidth%}{% } else { %}&infin;{% } %}">
            <label for="rexlive-layout-max-{%=customLayout.id%}" class="active"><?php _e( 'To', 'rexpansive' ); ?></label>
            <span class="rex-material-bar"></span>
            <span class="layout-value layout-value--hide">&infin;</span>
        </div>
    </div>
    <div class="layout__setting layout-value--hide">
        <input type="hidden" name="rexlive-layout-type" value="{%=customLayout.type%}">
        <span class="rexlive-layout--edit">
            <span class="dashicons-edit dashicons-before"></span>
            <span class="dashicons-yes dashicons-before hide-icon"></span>
        </span>
    </div>
    <div class="layout__setting">
        <span class="rexlive-layout--move">
        <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
        </span>
    </div>
    <div class="layout__setting">
        <span class="rexlive-layout--delete">
        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </span>
    </div>
</li>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-handle">
<div class="layout__setting">
    <span class="rexlive-layout--move">
        <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
    </span>
</div>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-model-item-list">
<li class="model__element bl_d-flex bl_ai-c" draggable="true" data-rex-model-id="{%=model.id%}">
    <div class="model-preview bl_d-flex bl_jc-c bl_ai-c {% if ({%=model.preview%}) { %}{% } else { %} model-preview--active {% } %}" itemprop="contentUrl">
        <span class="model-preview__placeholder"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
        <div class="model-name bl_d-flex bl_jc-c bl_ai-fe"><div>{%=model.name%}</div></div>
        <div class="model-tools">
            <div class="tool-button--double-icon--wrap tool-button--edit-thumbnail tippy" data-tippy-content="<?php _e('Thumbnail','rexpansive-builder'); ?>">
                <div class="tool-button tool-button--inline tool-button--black model__element--edit-thumbnail {% if ({%=model.preview%}) { %}{% } else { %} 'tool-button--image-preview' {% } %}" {% if ({%=model.preview%}) { %}{% } else { %} 'style="background-image:url({%=model.preview%});"' {% } %}>
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate tool-button--reset-thumbnail model__element--reset-thumbnail">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div>
            <div class="tool-button tool-button--black rex-close-button model__element--delete">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div>
    </div>
</li>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-element-item-list">
<li class="element-list__element bl_d-flex bl_ai-c" draggable="true" data-rex-element-id="{%=element.id%}">
    <div class="element-list-preview bl_d-flex bl_jc-c bl_ai-c {% if ({%=element.preview%}) { %} element-list-preview--active {% } else { %}{% } %}" {% if ({%=element.preview%}) { %} style="background-image:url('{%=element.preview%}');" {% } else { %}{% } %} itemprop="contentUrl">
        <span class="element-list-preview__placeholder"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
        <div class="element-name bl_d-flex bl_jc-c bl_ai-fe"><div>{%=element.name%}</div></div>
        <div class="rex-container">
            <span class="rex-element-wrapper" data-rex-element-id="{%=element.id%}"></span>
        </div>
        <div class="element-tools">
            <div class="tool-button--double-icon--wrap tool-button--edit-thumbnail tippy" data-tippy-content="<?php _e('Thumbnail','rexpansive-builder'); ?>">
                <div class="tool-button tool-button--inline tool-button--black element-list__element--edit-thumbnail {% if ({%=element.preview%}) { %}tool-button--image-preview{% } else { %}  {% } %}" {% if ({%=element.preview%}) { %} style="background-image:url('{%=element.preview%}');" {% } else { %}{% } %}>
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate tool-button--reset-thumbnail element-list__element--reset-thumbnail">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div>
            <div class="tool-button tool-button--black rex-close-button element-list__element--delete" >
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div>
    </div>
</li>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-insert-model-loader">
<div class="import-model" data-rex-model-id="{%=o.model_id%}">
    <div class="rexlive-loader active">
        <div class="sk-double-bounce rexlive-loader--element">
            <div class="sk-child sk-double-bounce1"></div>
            <div class="sk-child sk-double-bounce2"></div>
        </div>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-tool-close">
<div class="tool-button tool-button--black tool-button--close rex-modal__close-button">
<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-accordion-gallery-item">
<div class="rex-accordion-gallery__item" data-gallery-item-id="{%=o.id%}" data-gallery-item-url="{%=o.url%}" data-gallery-item-size="{%=o.size%}" style="background-image:url({%=o.preview%})">
    <div class="tool-button tool-button--inline tool-button--deactivate rex-accordion-gallery__item__remove">
        <i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-accordion-gallery-item-live">
<img src="{%=o.url%}" alt="" data-gallery-item-id="{%=o.id%}" data-gallery-item-size="{%=o.size%}">
</script>

<script type="text/x-tmpl" id="tmpl-slideshow-item">
<div class="rex-slideshow__slide" data-slideshow-slide-id="{%=o.slide_id%}">
    <div class="rex-slideshow__slide-index tool-button tool-button--inline">{%=o.slide_id_label%}</div>

    <textarea name="rex-slideshow--slide-text" rows="10">{%=o.slide_content%}</textarea>

    <button class="rex-slideshow__slide-edit btn-flat tippy" value="copy" data-tippy-content="Copy slide" style="display:none">
    <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
    </button>

    <div class="rex-slideshow__slide-edit btn-flat tippy" value="move" data-tippy-content="Move slide">
    <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
    </div>

    <button class="rex-slideshow__slide-edit btn-flat tippy" value="delete" data-tippy-content="Delete slide">
    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </button>

    <div class="rex-slideshow__slide-data" style="display:none;">
        <input type="hidden" name="rex-slideshow--slide-id" value="">
        <textarea rows="" name="rex-slideshow--slide-text">{%=o.slide_content%}</textarea>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-palette-item">
<div class="palette-item">
    <div class="tool-button tool-button--deactivate palette-item__delete">
    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-tool-simple-save">
<div class="rex-modal__outside-footer">
    <div id="rex-model__add-new-model" class="tool-button tool-button--inline tool-button--save">
        <span class="btn-save--edited"> 
        <?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?>
        </span>
        <span class="btn-save--saved"> 
        <?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?>
        </span>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-rex-button">
<span class="rex-button-wrapper" data-rex-button-id="{%=button.id%}"><span class="rex-button-data" style="display:none;" data-text-color="{%=button.text_color%}" data-text-size="{%=button.font_size%}" data-background-color="{%=button.background_color%}" data-background-color-hover="{%=button.hover_color%}" data-border-color-hover="{%=button.hover_border%}" data-text-color-hover="{%=button.hover_text%}" data-border-width="{%=button.border_width%}" data-border-color="{%=button.border_color%}" data-border-radius="{%=button.border_radius%}" data-button-height="{%=button.button_height%}" data-button-width="{%=button.button_width%}" data-margin-top="{%=button.margin_top%}" data-margin-bottom="{%=button.margin_bottom%}" data-margin-left="{%=button.margin_left%}" data-margin-right="{%=button.margin_right%}" data-padding-left="{%=button.padding_left%}" data-padding-right="{%=button.padding_right%}" data-padding-top="{%=button.padding_top%}" data-padding-bottom="{%=button.padding_bottom%}" data-link-target="{%=button.link_target%}" data-link-type="{%=button.link_type%}" data-button-name="{%=button.button_name%}"></span><a href="{%=button.link_target%}" class="rex-button-container" target="{%=button.link_type%}"><span class="rex-button-background"><span class="rex-button-text">{%=button.text%}</span></span></a></span>
</script>

<script type="text/x-tmpl" id="tmpl-rex-element-data">
<span class="rex-element-data" style="display:none;"  data-background-color="{%=element.background_color%}"></span>
</script>

<script type="text/x-tmpl" id="tmpl-rex-wpcf7-form-data">
<span class="rex-wpcf7-form-data" style="display:none;"  data-form-background-color="{%=form.background_color%}" data-content-background-color="{%=form.content.background_color%}"></span>
</script>

<script type="text/x-tmpl" id="tmpl-rex-wpcf7-edit-content-list">
    <div class="rexwpcf7-cont_row">
        <div class="rexwpcf7-count-column_accord"></div>
        <div class="rexwpcf7-count-column_1">●</div>
        <div class="rexwpcf7-count-column_2">
            <input type="text" class="wpcf7-select-field field-{%=o.number%}">
        </div>
        <div class="rexwpcf7-count-column_3 rexwpcf7-sort">
            <i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
        </div>
        <div class="rexwpcf7-count-column_3">
            <div class="rexwpcf7-upd-accord_button cross-icon rex-wpcf7-delete-list-field tippy" data-tippy-content="<?php _e('Delete', 'rexpansive-builder');?>"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
        </div>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-rex-button-delete">
<div class="button-list__element__tools">
    <div class="tool-button tool-button--black tool-button--close rex-close-button button__element--delete">
        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-editable-media-gallery-list-item">
<div class="media-gallery__item col rex-modal-content__modal-area__row" data-media-gallery-item-index="{%=o.index%}" data-media-gallery-item-element-id="{%=o.id%}">
    <div class="valign-wrapper space-between-wrapper">
        <button class="media-gallery__item-index btn-circle btn-small btn-bordered grey-border border-darken-2 waves-effect waves-light white grey-text text-darken-2">{%=o.index%}</button>
        
        <button class="media-gallery__item-edit media-gallery__item__image-preview btn-floating waves-effect waves-light tooltipped grey darken-2{% if ( '' !== o.src ) { %} media-gallery__item__image-preview--active{% } %}" value="edit-media" data-position="bottom" data-tooltip="<?php _e( 'Image', 'rexpansive' ); ?>" style="background-image:url({%=o.src%});">
            <i class="material-icons rex-icon">p</i>
        </button>

        <div>
			<div class="media-gallery__item-edit btn-flat tooltipped" data-position="bottom" value="move" data-tooltip="<?php _e('Move image', 'rexpansive'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
			</div>

			<button class="media-gallery__item-edit btn-flat tooltipped" value="delete" data-position="bottom" data-tooltip="<?php _e('Delete image', 'rexpansive'); ?>">
				<i class="material-icons grey-text text-darken-2">&#xE5CD;</i>
			</button>
		</div>
    </div>
</div>
</script>