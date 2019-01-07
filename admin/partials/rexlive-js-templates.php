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
    <div class="model-preview bl_d-flex bl_jc-c bl_ai-c" style="background-image:url({%=model.preview%})" itemprop="contentUrl">
        <span class="model-preview__placeholder"><?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?></span>
        <div class="model-name bl_d-flex bl_jc-c bl_ai-fe"><div>{%=model.name%}</div></div>
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
<script type="text/x-tmpl" id="tmpl-rex-button">
<span class="rex-button-wrapper" data-rex-button-id="{%=button.id%}">
    <span class="rex-button-data" style="display:none;" data-text-color="{%=button.text_color%}" data-text-size="{%=button.font_size%}" data-background-color="{%=button.background_color%}" data-background-color-hover="{%=button.hover_color%}" data-border-width="{%=button.border_width%}" data-border-color="{%=button.border_color%}" data-border-radius="{%=button.border_radius%}" data-button-height="{%=button.button_height%}" data-margin-top="{%=button.margin_top%}" data-margin-bottom="{%=button.margin_bottom%}" data-link-target="{%=button.link_taget%}" data-link-type="{%=button.link_type%}" data-button-name="{%=button.button_name%}"></span>
    <a href="{%=button.link_taget%}" class="rex-button-container" type="{%=button.link_type%}">
        <span class="rex-button-background">
            <span class="rex-button-text">{%=button.text%}</span>
        </span>
    </a>
</span>
</script>