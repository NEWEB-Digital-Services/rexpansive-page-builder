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
    <div class="model-preview" style="background-image:url({%=model.preview%})"></div>
    <div class="model-name">{%=model.name%}</div>
</li>
</script>