(function() {
	tinymce.PluginManager.add('rexbuilder_animation_button', function( editor, url ) {
		editor.addButton( 'rexbuilder_animation_button', { 
			title: 'Rexbuilder Animation',
			icon: 'icon custom-icon-animation dashicons-admin-settings',
			onclick: function() {
				editor.windowManager.open( { 
					title: 'Insert Icon&Text Animation',
					body: [
					{
						type: 'textbox',
						name: 'uploadImage',
						label: 'Image',
						classes: 'upload-url'
					},
					{
						type: 'button',
						name: 'buttonUpdate',
						text: 'Upload image',
						onclick: function() {
							var $urlPlaceholder = jQuery('.mce-upload-url.mce-textbox');
							uploadPerforateBackground($urlPlaceholder);
						}
					},
					{
						type: 'listbox',
						name: 'imageAnimation',
						label: 'Choose Animation',
						'values': [
						{text: 'fadeInUpBig', value: 'fadeInUpBig'},
						{text: 'fadeInDownBig', value: 'fadeInDownBig'},
						{text: 'fadeInLeftBig', value: 'fadeInLeftBig'},
						{text: 'fadeInRightBig', value: 'fadeInRightBig'}
						]
					},
					{
						type: 'textbox',
						name: 'imageDelay',
						label: 'Image Delay',
						value: '0.8',
						classes: ''
					},
					{
						type: 'textbox',
						name: 'animatedText',
						label: 'Insert text',
						classes: 'padTop padset',
					},
					{
						type: 'listbox',
						name: 'textAnimation',
						label: 'Choose Animation',
						'values': [
						{text: 'fadeInUpBig', value: 'fadeInUpBig'},
						{text: 'fadeInDownBig', value: 'fadeInDownBig'},
						{text: 'fadeInLeftBig', value: 'fadeInLeftBig'},
						{text: 'fadeInRightBig', value: 'fadeInRightBig'}
						]
					},
					{
						type: 'textbox',
						name: 'textDelay',
						label: 'Text Delay',
						value: '1.3',
						classes: '',
					}], 
					onsubmit: function( e ) {
						var window_id = this._id,
							inputs = jQuery('#' + window_id + '-body').find('.mce-formitem input');

						//if(!check) { return false; }
						editor.insertContent( '[RexAnimation text="' + e.data.animatedText + 
							'" image="' + e.data.uploadImage + 
							'" text_animation="' + e.data.imageAnimation + '" image_animation="' + e.data.textAnimation +
							'" image_delay="' + parseFloat(e.data.imageDelay) + '" text_delay="' + parseFloat(e.data.textDelay) +
							'"]'); 
					},
				});
			} 
		});
	});

	function uploadPerforateBackground($wrap) {
		//create a new Library, base on defaults
		//you can put your attributes in
		var editImage = wp.media.controller.Library.extend({
		    defaults :  _.defaults({
		            id:        'upload-background',
		            title:      'Upload Background',
		            allowLocalEdits: true,
		            displaySettings: true,
		            displayUserSettings: true,
		            multiple : false,
		            type : 'image'//audio, video, application/pdf, ... etc
		      }, wp.media.controller.Library.prototype.defaults )
		});

		//Setup media frame
		var frame = wp.media({
		    button : { text : 'Select' },
		    state : 'upload-background',
		    states : [
		        new editImage()
		    ]
		});

		//on close, if there is no select files, remove all the files already selected in your main frame
		frame.on('close',function() {
		    var selection = frame.state('upload-background').get('selection');
		    if(!selection.length){
		        console.log(selection);
		    }
		});


		frame.on( 'select', function() {
		    var state = frame.state('upload-background');
		    var selection = state.get('selection');
		    var imageArray = [];

		    if ( ! selection ) return;

		     //to get right side attachment UI info, such as: size and alignments
		    //org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
		    selection.each(function(attachment) {
		        var display = state.display( attachment ).toJSON();
		        var obj_attachment = attachment.toJSON();
		        var caption = obj_attachment.caption, options, html;

		        // If captions are disabled, clear the caption.
		        if ( ! wp.media.view.settings.captions )
		            delete obj_attachment.caption;

		        display = wp.media.string.props( display, obj_attachment );

		        options = {
		            id:        obj_attachment.id,
		            post_content: obj_attachment.description,
		            post_excerpt: caption
		        };

		        if ( display.linkUrl )
		            options.url = display.linkUrl;

		        if ( 'image' === obj_attachment.type ) {
		           /* html = wp.media.string.image( display );
		            _.each({
		            align: 'align',
		            size:  'image-size',
		            alt:   'image_alt'
		            }, function( option, prop ) {
		            if ( display[ prop ] )
		                options[ option ] = display[ prop ];
		            });*/
					//html = '<img src="'+ obj_attachment.sizes.thumbnail.url +'" alt="'+ caption+'" title="'+obj_attachment.title+'" data-image_id="'+obj_attachment.id+'">';
		        } else if ( 'video' === obj_attachment.type ) {
		            html = wp.media.string.video( display, obj_attachment );
		        } else if ( 'audio' === obj_attachment.type ) {
		            html = wp.media.string.audio( display, obj_attachment );
		        } else {
		            html = wp.media.string.link( display );
		            options.post_title = display.title;
		        }

		        //attach info to attachment.attributes object
		        attachment.attributes['nonce'] = wp.media.view.settings.nonce.sendToEditor;
		        attachment.attributes['attachment'] = options;
		        attachment.attributes['html'] = html;
		        attachment.attributes['post_id'] = wp.media.view.settings.post.id;

		       	$wrap.val(obj_attachment.url);
		       	$wrap.attr('data-image_id', obj_attachment.id);
		    });
		});

		//reset selection in popup, when open the popup
		frame.on('open',function() {
		    var selection = frame.state('upload-background').get('selection');

		    //remove all the selection first
		    selection.each(function(image) {
		        var attachment = wp.media.attachment( image.attributes.id );
		        attachment.fetch();
		        selection.remove( attachment ? [ attachment ] : [] );
		    });

		    // Check the already inserted image
		    attachment = wp.media.attachment( $wrap.attr('data-image_id') );
            attachment.fetch();
            selection.add( attachment ? [ attachment ] : [] );
		});

		//now open the popup
		frame.open();
	}
})(jQuery);