;(function ($) {
	$(document).ready(function() {
        console.log('creo il pulsante');
        
        var bottone = document.createElement('button');
        var section = $('.rexpansive_section');
        $(bottone).appendTo(section[0]);
        $(bottone).attr({
            'id': 'frontend-button',
            'data-uploader_title': 'test',
            'data-uploader_button_text': 'test2'
        });
        var file_frame; // variable for the wp.media file_frame
        
        // attach a click event (or whatever you want) to some element on
        // your page
        $('#frontend-button').on('click', function (event) {
            event.preventDefault();
        
            // if the file_frame has already been created, just reuse it
            if (file_frame) {
                file_frame.open();
                return;
            }
        
            file_frame = wp.media.frames.file_frame = wp.media({
                title: $(this).data('uploader_title'),
                button: {
                    text: $(this).data('uploader_button_text'),
                },
                multiple: false // set this to true for multiple file
                // selection
            });
        
            console.log(file_frame);
        
            file_frame.on('select', function () {
                var attachment = file_frame.state().get('selection').first().toJSON();
        
                // do something with the file here
                $('#frontend-button').hide();
                $('#frontend-image').attr('src', attachment.url);
                console.log(attachment);
            });
        
            file_frame.open();
        });
	});
})(jQuery);


