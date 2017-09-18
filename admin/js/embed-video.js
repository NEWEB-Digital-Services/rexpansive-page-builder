(function() {
	tinymce.PluginManager.add('rexbuilder_embed_video_button', function( editor, url ) {
		editor.addButton( 'rexbuilder_embed_video_button', { 
			title: 'Rexbuilder Embed Video',
			icon: 'icon custom-icon-embed-video fa fa-youtube-play',
			onclick: function() {
				editor.windowManager.open( { 
					title: 'Insert Youtube Video',
					body: [
					{
						type: 'textbox',
						name: 'uploadVideoUrl',
						label: 'Video Url',
						classes: 'upload-video-url'
					},
					{
						type: 'textbox',
						name: 'playerWidth',
						label: 'Width',
						classes: 'upload-player-width'
					},
					{
						type: 'textbox',
						name: 'playerHeight',
						label: 'Height',
						classes: 'upload-player-height'
					}], 
					onsubmit: function( e ) {
						var embedVideoShortcode = '';
						
						if( '' !== e.data.uploadVideoUrl ) {
							embedVideoShortcode = '[video ';
							if( '' !== e.data.playerWidth ) {
								embedVideoShortcode += 'width="' + e.data.playerWidth + '" ';
							}
							if( '' !== e.data.playerHeight ) {
								embedVideoShortcode += 'height="' + e.data.playerHeight + '" ';
							}
							embedVideoShortcode += 'src="' + e.data.uploadVideoUrl + '"]';
						}

						editor.insertContent( embedVideoShortcode ); 
					},
				});
			} 
		});
	});
})(jQuery);