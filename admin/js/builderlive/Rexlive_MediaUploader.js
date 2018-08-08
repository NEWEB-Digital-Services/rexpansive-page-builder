/**
 * Object that contains the image media uploader
 */
var Rexlive_MediaUploader = (function ($) {
    'use strict';

    var image_multiple_uploader_frame;
    var image_uploader_frame;
    var video_uploader_frame;

    function _openMediaUploaderMultipleImage(info) {
        // If the frame is already opened, return it
        if (image_multiple_uploader_frame) {
            image_multiple_uploader_frame.open();
            return;
        }

        //create a new Library, base on defaults
        //you can put your attributes in
        var insertImage = wp.media.controller.Library.extend({
            defaults: _.defaults({
                id: 'insert-image',
                title: 'Insert Image',
                allowLocalEdits: true,
                displaySettings: true,
                displayUserSettings: true,
                multiple: true,
                library: wp.media.query({ type: 'image' }),
                type: 'image'//audio, video, application/pdf, ... etc
            }, wp.media.controller.Library.prototype.defaults)
        });

        //Setup media frame
        image_multiple_uploader_frame = wp.media({
            button: { text: 'Select' },
            state: 'insert-image',
            states: [
                new insertImage()
            ]
        });

        image_multiple_uploader_frame.on('select', function () {
            var state = image_multiple_uploader_frame.state('insert-image');
            var selection = state.get('selection');
            var data = {
                eventName: 'rexlive:insert_image',
                data_to_send: {
                    info: info,
                    media: []
                }
            };

            if (!selection) return;

            //to get right side attachment UI info, such as: size and alignments
            //org code from /wp-includes/js/media-editor.js, arround `line 603 -- send: { ... attachment: function( props, attachment ) { ... `
            selection.each(function (attachment) {
                var display = state.display(attachment).toJSON();
                var obj_attachment = attachment.toJSON();

                // If captions are disabled, clear the caption.
                if (!wp.media.view.settings.captions)
                    delete obj_attachment.caption;

                display = wp.media.string.props(display, obj_attachment);

                var to_send = {
                    media_info: obj_attachment,
                    display_info: display
                };

                data.data_to_send.media.push(to_send);
            });

            // Launch image insert event to the iframe
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
        });

        image_multiple_uploader_frame.on('close', function () {

        });

        //reset selection in popup, when open the popup
        image_multiple_uploader_frame.on('open', function () {
            var selection = image_multiple_uploader_frame.state('insert-image').get('selection');
            //remove all the selection first
            selection.each(function (image) {
                if ('undefined' !== typeof image) {
                    var attachment = wp.media.attachment(image.attributes.id);
                    attachment.fetch();
                    selection.remove(attachment ? [attachment] : []);
                }
            });
        });

        //now open the popup
        image_multiple_uploader_frame.open();
    }	// openMediaUploader IMAGE END

    function _openMediaUploaderImage($data, $preview, image_id) {
        image_id = typeof image_id !== 'undefined' ? image_id : null;

        if (image_uploader_frame) {
            // setting my custom data
            image_uploader_frame.state('upload-image-bg').set('$data', $data);
            image_uploader_frame.state('upload-image-bg').set('$preview', $preview);
            image_uploader_frame.state('upload-image-bg').set('image_id', image_id);

            image_uploader_frame.open();
            return;
        }

        //create a new Library, base on defaults
        //you can put your attributes in
        var uplaodImage = wp.media.controller.Library.extend({
            defaults: _.defaults({
                id: 'upload-image-bg',
                title: 'Select Background Image',
                allowLocalEdits: true,
                displaySettings: true,
                displayUserSettings: true,
                multiple: false,
                library: wp.media.query({ type: 'image' }),
                type: 'image',//audio, video, application/pdf, ... etc
                $data: $data,
                $preview: $preview,
                image_id: image_id
            }, wp.media.controller.Library.prototype.defaults)
        });

        //Setup media frame
        image_uploader_frame = wp.media({
            button: { text: 'Select' },
            state: 'upload-image-bg',
            states: [
                new uplaodImage()
            ]
        });

        //on close, if there is no select files, remove all the files already selected in your main frame
        image_uploader_frame.on('close', function () {
            var selection = image_uploader_frame.state('upload-image-bg').get('selection');
            if (selection.length == 0) {
                $data.val();
            }
        });

        image_uploader_frame.on('select', function () {

            var state = image_uploader_frame.state('upload-image-bg');
            var selection = state.get('selection');

            if (!selection) return;

            selection.each(function (attachment) {
                var display = state.display(attachment).toJSON();
                var obj_attachment = attachment.toJSON();

                // If captions are disabled, clear the caption.
                if (!wp.media.view.settings.captions)
                    delete obj_attachment.caption;

                display = wp.media.string.props(display, obj_attachment);

                var $data = image_uploader_frame.state('upload-image-bg').get('$data');

                // save id image info
                $data.val(obj_attachment.id);
                $data.attr("data-rex-image-bg-url", display.src);
                $data.attr("data-rex-image-width", display.width);
                $data.attr("data-rex-image-height", display.height);

                // create image preview
                image_uploader_frame.state('upload-image-bg').get('$preview').css('backgroundImage', 'url(' + obj_attachment.url + ')');
                image_uploader_frame.state('upload-image-bg').get('$preview').find("i").css("display", "none");

                if($data.parents("#rex-edit-background-section").length != 0){
                    Background_Image_Modal.updateImageBackground();
                }
            });
        });

        //reset selection in popup, when open the popup
        image_uploader_frame.on('open', function () {
            var attachment;
            var selection = image_uploader_frame.state('upload-image-bg').get('selection');

            //remove all the selection first
            selection.each(function (video) {
                attachment = wp.media.attachment(video.attributes.id);
                attachment.fetch();
                selection.remove(attachment ? [attachment] : []);
            });

            var image_id = image_uploader_frame.state('upload-image-bg').get('image_id');

            // Check the already inserted image
            if (image_id) {
                attachment = wp.media.attachment(image_id);
                attachment.fetch();

                selection.add(attachment ? [attachment] : []);
            }
        });

        //now open the popup
        image_uploader_frame.open();
    }


    function openMediaUploaderVideo(info) {
        // If the frame is already opened, return it
        if (video_uploader_frame) {
            video_uploader_frame.open();
            return;
        }

        //create a new Library, base on defaults
        //you can put your attributes in
        var insertVideo = wp.media.controller.Library.extend({
            defaults: _.defaults({
                id: 'insert-video',
                title: 'Insert Video',
                allowLocalEdits: true,
                displaySettings: true,
                displayUserSettings: true,
                multiple: true,
                library: wp.media.query({ type: 'video' }),
                type: 'video'//audio, video, application/pdf, ... etc
            }, wp.media.controller.Library.prototype.defaults)
        });

        //Setup media frame
        video_uploader_frame = wp.media({
            button: { text: 'Select' },
            state: 'insert-video',
            states: [
                new insertVideo()
            ]
        });

        //on close, if there is no select files, remove all the files already selected in your main frame
        video_uploader_frame.on('close', function () {
            ;
        });

        video_uploader_frame.on('select', function () {
            var state = video_uploader_frame.state('insert-video');
            var selection = state.get('selection');
            var videoArray = [];

            if (!selection) return;

            selection.each(function (attachment) {
                var videoObj = {
                    videoID: -1,
                    videoUrl: ""
                };

                var display = state.display(attachment).toJSON();
                var obj_attachment = attachment.toJSON();

                // If captions are disabled, clear the caption.
                if (!wp.media.view.settings.captions)
                    delete obj_attachment.caption;

                display = wp.media.string.props(display, obj_attachment);
                videoObj.videoID = obj_attachment.id;
                videoObj.videoUrl = obj_attachment.url;
                videoArray.push(videoObj);
            });

            Insert_Video_Modal.updateMp4VideoModal(videoArray);
        });

        //reset selection in popup, when open the popup
        video_uploader_frame.on('open', function () {
            var selection = video_uploader_frame.state('insert-video').get('selection');
            //remove all the selection first
            selection.each(function (video) {
                if ('undefined' !== typeof video) {
                    var attachment = wp.media.attachment(video.attributes.id);
                    attachment.fetch();
                    selection.remove(attachment ? [attachment] : []);
                }
            });
        });

        //now open the popup
        video_uploader_frame.open();
    }	// openMediaUploader VIDEO END

    return {
        openInsertImageBlocksMediaUploader: _openMediaUploaderMultipleImage,
        openEditImageMediaUploader: _openMediaUploaderImage,
        openMediaUploaderVideo: openMediaUploaderVideo,
    };

})(jQuery);