(function( ) {
	var re_number = new RegExp("^[0-9]+$"),
		check = true;

	var inputElementCheck = function(i) {
		var id;

		if(typeof this._id === 'undefined') {
			id = '#' + i;
		} else {
			id = '#' + this._id;
		}

		var $el = jQuery(id);

		if(re_number.test($el.val()) || $el.val() === '' ) {
			// Correct number
			$el.css('border-color', '#ddd');
			check = true;
		} else {
			// Wrong number
			$el.css('border-color', 'red');
			check = check && false;
		}
	};

	var getLocation = function(href) {
		var l = document.createElement("a");
		l.href = href;
		return l;
	};

	tinymce.PluginManager.add('rexbuilder_textfill_button', function( editor, url ) {
		editor.addButton( 'rexbuilder_textfill_button', {
			title: 'Text Fill',
			icon: 'icon custom-icon',
			onclick: function() {
				editor.windowManager.open( {
					title: 'Insert text fill',
					body: [{
						type: 'textbox',
						name: 'title',
						label: 'Your text',
						autofocus: true
					},
					{
						type: 'listbox',
						name: 'textAlignement',
						label: 'Text Align',
						'values': [
							{text: 'center', value: 'center'},
							{text: 'left', value: 'left'},
							{text: 'right', value: 'right'}
						]
					},
					{
						type: 'textbox',
						name: 'uploadUrl',
						label: 'Background Url',
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
						type: 'textbox',
						name: 'wrapBackgroundColor',
						label: 'Background Color',
						classes: 'tf-background-color'
					},
					{
						type: 'textbox',
						name: 'maxFontSize',
						label: 'Max Font Size',
					},
					{
						type: 'textbox',
						name: 'padTop',
						label: 'Padding Top',
						classes: 'padTop padset',
						oninput: inputElementCheck
					},
					{
						type: 'textbox',
						name: 'padRight',
						label: 'Padding Right',
						classes: 'padRight padset',
						oninput: inputElementCheck
					},
					{
						type: 'textbox',
						name: 'padBottom',
						label: 'Padding Bottom',
						classes: 'padBottom padset',
						oninput: inputElementCheck
					},
					{
						type: 'textbox',
						name: 'padLeft',
						label: 'Padding Left',
						classes: 'padLeft padset',
						oninput: inputElementCheck
					},
					{
						type: 'textbox',
						name: 'marginTop',
						label: 'Margin Top',
						classes: 'marginset',
						oninput: inputElementCheck
					},
					{
						type: 'textbox',
						name: 'marginRight',
						label: 'Margin Right',
						classes: 'marginset',
						oninput: inputElementCheck
					},
					{
						type: 'textbox',
						name: 'marginBottom',
						label: 'Margin Bottom',
						classes: 'marginset',
						oninput: inputElementCheck
					},
					{
						type: 'textbox',
						name: 'marginLeft',
						label: 'Margin Left',
						classes: 'marginset',
						oninput: inputElementCheck
					}],
					onsubmit: function( e ) {
						var window_id = this._id,
							inputs = jQuery('#' + window_id + '-body').find('.mce-formitem input'),
							re_number = new RegExp("^[0-9]+$"),
							re_weburl = new RegExp(
							  "^" +
							    // protocol identifier
							    "(?:(?:https?|ftp)://)" +
							    // user:pass authentication
							    "(?:\\S+(?::\\S*)?@)?" +
							    "(?:" +
							      // IP address exclusion
							      // private & local networks
							      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
							      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
							      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
							      // IP address dotted notation octets
							      // excludes loopback network 0.0.0.0
							      // excludes reserved space >= 224.0.0.0
							      // excludes network & broacast addresses
							      // (first & last IP address of each class)
							      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
							      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
							      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
							    "|" +
							      // host name
							      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
							      // domain name
							      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
							      // TLD identifier
							      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
							    ")" +
							    // port number
							    "(?::\\d{2,5})?" +
							    // resource path
							    "(?:/\\S*)?" +
							  "$", "i"
							);

						jQuery(inputs.get(1)).css('border-color', '#ddd');

						inputs.filter('.mce-padset').each(function() {
							inputElementCheck(jQuery(this).attr('id'));
						});

						inputs.filter('.mce-marginset').each(function() {
							inputElementCheck(jQuery(this).attr('id'));
						});

						//if(e.data.uploadUrl === '' || !re_weburl.test(e.data.uploadUrl)) { //this control is for production (it doesnt works with localhost)
						if(e.data.uploadUrl === '') {
							//editor.windowManager.alert('Plese, insert an image for the background');
							jQuery(inputs.get(1)).css('border-color', 'red');
							check = check && false;
							// URL not present
						} else {
							// URL presente

						}

						//console.log(check);

						if(!check) { return false; }

						// var bg_url = getLocation(e.data.uploadUrl);
						var bg_url = e.data.uploadUrl;
						//console.log(bg_url);

						//console.log(bg_url.protocol); // => "http:"
						//console.log(bg_url.host);     // => "example.com:3000"
						//console.log(bg_url.hostname); // => "example.com"
						//console.log(bg_url.port);     // => "3000"
						//console.log(bg_url.pathname); // => "/pathname/"
						//console.log(bg_url.hash);     // => "#hash"
						//console.log(bg_url.search);   // => "?search=test"

						var shortcode = '[TextFill background="' + bg_url + '"';

						shortcode += ' background_id="' + jQuery(inputs.get(1)).attr('data-image_id') + '"';

						if( '' !== e.data.maxFontSize ) {
							shortcode += ' max_font_size="' + e.data.maxFontSize + '"';
						}
						if( '' !== e.data.textAlignement ) {
							shortcode += ' textalignement="' + e.data.textAlignement + '"';
						}
						if( '' !== e.data.wrapBackgroundColor ) {
							shortcode += ' backgroundcolor="' + e.data.wrapBackgroundColor + '"';
						}
						if( '' !== e.data.padTop ) {
							shortcode += ' pad_top="' + e.data.padTop + '"';
						}
						if( '' !== e.data.padRight ) {
							shortcode += ' pad_right="' + e.data.padRight + '"';
						}
						if( '' !== e.data.padBottom ) {
							shortcode += ' pad_bottom="' + e.data.padBottom + '"';
						}
						if( '' !== e.data.padLeft ) {
							shortcode += ' pad_left="' + e.data.padLeft + '"';
						}
						if( '' !== e.data.marginTop ) {
							shortcode += ' margin_top="' + e.data.marginTop + '"';
						}
						if( '' !== e.data.marginRight ) {
							shortcode += ' margin_right="' + e.data.marginRight + '"';
						}
						if( '' !== e.data.marginBottom ) {
							shortcode += ' margin_bottom="' + e.data.marginBottom + '"';
						}
						if( '' !== e.data.marginLeft ) {
							shortcode += ' margin_left="' + e.data.marginLeft + '"';
						}
						shortcode += ']' + e.data.title + '[/TextFill]';

						editor.insertContent( shortcode );
					},
				});
			}
		});
	});

	var uploadPerforateBackground = function($wrap) {
		// if( textfill_background_frame ) {
		// 	textfill_background_frame.open();
		// 	return;
		// }
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
		            library: wp.media.query( { type: 'image' } ),
		            type : 'image'//audio, video, application/pdf, ... etc
		      }, wp.media.controller.Library.prototype.defaults )
		});

		//Setup media frame
		var textfill_background_frame = wp.media({
		    button : { text : 'Select' },
		    state : 'upload-background',
		    states : [
		        new editImage()
		    ]
		});

		//on close, if there is no select files, remove all the files already selected in your main frame
		textfill_background_frame.on('close',function() {
		    var selection = textfill_background_frame.state('upload-background').get('selection');
		    if(!selection.length){
		        //console.log(selection);
		    }
		});


		textfill_background_frame.on( 'select', function() {
		    var state = textfill_background_frame.state('upload-background');
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

				//var relative_image_url = obj_attachment.url.match(/\/wp-content\/\S+/g);

		       	$wrap.val(obj_attachment.url);
		       	$wrap.attr('data-image_id', obj_attachment.id);
		    });
		});

		//reset selection in popup, when open the popup
		textfill_background_frame.on('open',function() {
		    var selection = textfill_background_frame.state('upload-background').get('selection'), attachment;

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
		textfill_background_frame.open();
	};

})(jQuery);