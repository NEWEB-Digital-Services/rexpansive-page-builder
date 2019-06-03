;(function () {
  var fieldsEditable;
  var postID;

  var findFields = function() {
    fieldsEditable = [].slice.call(document.querySelectorAll('.builderlive-editable-field'));
  };

  var init = function() {
    findFields();
    postID = parseInt( document.getElementById( 'id-post' ).getAttribute( 'data-post-id' ) );
  };

  var makeFieldsEditable = function() {
    fieldsEditable.forEach(function(field, index) {
      var editableType = field.getAttribute('data-editable-type');
      switch( editableType ) {
        case 'html':
        case 'float':
        case 'text':
          field.setAttribute('contenteditable', true);
          break;
        case 'media':
          field.setAttribute('data-editable-id', editableType + index);
          field.addEventListener('click', handleMediaClick);
          break;
        default:
          break;
      }
      
      // field.addEventListener('blur', function(event) {
      //   console.log(event);
      // });
    });
  };

  /**
   * Handling the click on a editable media
   * Opening the wordpress media uploader to edit
   * @param {Event} event click event
   */
  var handleMediaClick = function(event) {
    event.preventDefault();

    var data = {
      eventName: "rexlive:openPostEditMediaUploader",
      mediaData: {
        mediaId: event.currentTarget.getAttribute( 'data-editable-value' ),
        fieldId: event.currentTarget.getAttribute( 'data-editable-id' )
      }
    };

    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  var handleMediaEdit = function( data ) {
    var target = document.querySelector( '.builderlive-editable-field[data-editable-id="' + data.media_data.fieldId + '"]' );
    target.setAttribute( 'data-editable-value', data.imgData[0].media_info.id );
  };

  var getFieldData = function() {
    var data = [];
    fieldsEditable.forEach(function(field) {
      var editableInfo = field.getAttribute('data-editable-info');
      var editableType = field.getAttribute('data-editable-type');
      var editableFormat = field.getAttribute('data-editable-format');

      var temp = {
        value: null,
        info: ( '' !== editableInfo ? JSON.parse( editableInfo ) : [] )
      };

      switch( editableType ) {
        case 'media':
          temp.value = field.getAttribute('data-editable-value');
          break;
        case 'html':
          temp.value = field.innerHTML.trim();
          break;
        case 'float':
          var tempVal = field.innerText.trim();
          if ( null !== editableFormat ) {
            var separators = editableFormat.split('x');
            tempVal = tempVal.replace(separators[1], '');
            tempVal = tempVal.replace(separators[2], '.');
          }
          temp.value = parseFloat( tempVal );
          break;
        case 'text':
        default:
          temp.value = field.innerText.trim();
          break;
      }
      data.push(temp);
    });

    return data;
  };

  /**
   * Prepare data for a XHR request encoding it
   * @param {Object} data data to encode
   */
  var encodeData = function( data ) {
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    var name;
  
    // Turn the data object into an array of URL-encoded key/value pairs.
    for(name in data) {
      urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
  
    // Combine the pairs into a single string and replace all %-encoded spaces to 
    // the '+' character; matches the behaviour of browser form submissions.
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

    return urlEncodedData;
  }

  /**
   * Listening to the message communication between iframe
   * and parent window to save the changed data
   * @param {Event} event window iframe message
   */
  var handleSavePage = function(event) {
    if (event.data.rexliveEvent) {
      // saving post live edit information
      if ( 'rexlive:savePage' === event.data.eventName ) {
        var fieldData = getFieldData();
        
        var data = {
          action: "rexlive_save_editable_fields",
          nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
          postID: postID,
          fieldData: JSON.stringify( fieldData )
        };

        var encodedData = encodeData(data);

        var request = new XMLHttpRequest();
        request.open('POST', _plugin_frontend_settings.rexajax.ajaxurl, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            // Success!
            var response = JSON.parse(request.responseText);
            if ( response.success ) {
              console.log(response.data);
            }
          } else {
            // We reached our target server, but it returned an error
          }
        };
        
        request.onerror = function() {
          // There was a connection error of some sort
        };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(encodedData);
      }

      // handling media uploading
      if ( 'rexlive:liveMediaEdit' === event.data.eventName ) {
        handleMediaEdit(event.data.data_to_send);
        console.log(event.data.data_to_send);
      }

      // if ( 'rexlive:closeLiveMediaUploader' === event.data.eventName ) {
      //   console.log('closing');
      // }
    }
  };

  var load = function() {
    makeFieldsEditable();
  };

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('message', handleSavePage, false);
  window.addEventListener('load', load);
}());