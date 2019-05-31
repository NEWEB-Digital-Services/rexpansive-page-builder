;(function ($) {
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
    fieldsEditable.forEach(function(field) {
      field.setAttribute('contenteditable', true);
      
      // field.addEventListener('blur', function(event) {
      //   console.log(event);
      // });
    });
  };

  var getFieldData = function() {
    var data = [];
    fieldsEditable.forEach(function(field) {
      var editableInfo = field.getAttribute('data-editable-info');
      var editableType = field.getAttribute('data-editable-type');
      var temp = {
        value: null,
        info: ( '' !== editableInfo ? JSON.parse( editableInfo ) : [] )
      };

      switch( editableType ) {
        case 'html':
          temp.value = field.innerHTML.trim();
          break;
        case 'float':
          temp.value = parseFloat( field.innerText.trim() );
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

  var handleSavePage = function(event) {
    if (event.data.rexliveEvent) {
      if (event.data.eventName == "rexlive:savePage") {
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
    }
  };

  var load = function() {
    makeFieldsEditable();
  };

  document.addEventListener('DOMContentLoaded', init);
  // $(document).on('rexlive:savePage', handleSavePage);
  window.addEventListener('message', handleSavePage, false);
  window.addEventListener('load', load);
}(jQuery));