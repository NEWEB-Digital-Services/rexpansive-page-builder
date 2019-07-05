;(function () {
  var fieldsEditable;
  var postID;

  /**
   * hash code generation from a string
   * to check field changes
   */
  String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  /**
   * Executing a function by its name, searching inside a context
   * @param {String} functionName function to execute
   * @param {Object} context context in which search the string by name
   */
  function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }

  /**
   * wrapping a media element and create a toolbar
   * to add a delete button
   * @param {Node} toWrap element to wrap
   */
  var wrapMediaTools = function( toWrap, type ) {
    var wrapper = document.createElement('span');
    wrapper.setAttribute('class','builderlive-editable-media__wrapper');
    wrapper.innerHTML = tmpl('tmpl-editable-media-toolbar',{type:type});

    var remove = wrapper.querySelector('[data-action="remove"]');
    if ( remove ) {
      remove.addEventListener('click', handleMediaTools.bind(wrapper));
    }

    var add = wrapper.querySelector('[data-action="add"]');
    if ( add ) {
      add.addEventListener('click', handleMediaTools.bind(wrapper));
    }

    var edit = wrapper.querySelector('[data-action="edit"]');
    if ( edit ) {
      edit.addEventListener('click', handleMediaTools.bind(wrapper));
    }

    toWrap.parentNode.appendChild(wrapper);
    return wrapper.appendChild(toWrap);
  }

  /**
   * Getting all the live editable fields
   */
  var findFields = function() {
    fieldsEditable = [].slice.call(document.querySelectorAll('.builderlive-editable-field'));
  };

  /**
   * On DOMContentLoaded event
   */
  var init = function() {
    findFields();
    postID = parseInt( document.getElementById( 'id-post' ).getAttribute( 'data-post-id' ) );
  };

  /**
   * Setting up editalbe fields, according to their type
   * 1) html: contenteditable field
   * 2) float: contenteditable field,
   * 3) text: contenteditable field,
   * 4) media: insert/edit media
   * 5) media_list: insert/edit media
   */
  var makeFieldsEditable = function() {
    fieldsEditable.forEach(function(field, index) {
      var editableType = field.getAttribute('data-editable-type');
      editableType = ( null === editableType ? 'text' : editableType );

      // common setups
      field.setAttribute('data-editable-id', 'bl_' + editableType + '_' + index);
      var hashCode = null;

      switch( editableType ) {
        case 'html':
        case 'float':
        case 'text':
          hashCode = field.innerText.trim().hashCode();
          field.setAttribute('contenteditable', true);
          field.addEventListener('click', handleContentEditableClick);
          field.addEventListener('input', handleContentEditableInput);
          break;
        case 'media':
        case 'media_list':
          wrapMediaTools( field, editableType );
          hashCode = field.getAttribute('data-editable-value').hashCode();
          field.addEventListener('click', handleMediaClick);
          break;
        case 'media_list_aggregate':
          hashCode = field.getAttribute('data-editable-value').hashCode();
          break;
        default:
          break;
      }

      // setting hash code
      field.setAttribute('data-editable-hash', hashCode );
      
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
    openEditMedia(event.currentTarget);
  };

  /**
   * Send a message to the iframe parent to open the media uploader
   * @param {Element} field field to edit, if present
   * @since 2.0.0
   */
  var openEditMedia = function( field, fromMediaListModal ) {
    field = 'undefined' !== typeof field ? field : null;
    fromMediaListModal = 'undefined' !== typeof fromMediaListModal ? fromMediaListModal : false;
    var action = '';
    var value = '';
    var id = '';

    if ( field ) {
      action = 'edit';
      value = field.getAttribute( 'data-editable-value' );
      id = field.getAttribute( 'data-editable-id' );
    } else {
      action = 'add';
    }
    
    var data = {
      eventName: "rexlive:openPostEditMediaUploader",
      mediaData: {
        action: action,
        mediaId: value,
        fieldId: id,
        fromMediaListModal: fromMediaListModal
      }
    };

    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  /**
   * Handle click on media tools
   * @param {Event} event events on tools
   * @since 2.0.0
   */
  var handleMediaTools = function(event) {
    event.preventDefault();
    var action = event.currentTarget.getAttribute('data-action');
    var media = this.querySelector('.builderlive-editable-field');

    switch( action ) {
      case 'remove':
        if ( media ) {
          media.setAttribute('data-editable-value', '');
          media.style.visibility = 'hidden';
        }
        break;
      case 'add':
        if ( media ) {
          openEditMedia();
        }
      case 'edit':
        if ( media ) {
          openEditMedia( media );
        }
      default:
        break;  
    }
  }

  /**
   * Preventing contenteditable fields over other fields (like the media)
   * @param {Event} event click event
   */
  var handleContentEditableClick = function(event) {
    event.stopPropagation();
  };

  /**
   * On contenteditable change, warn the builder of the modification
   * @param {Event} event input event
   */
  var handleContentEditableInput = function(event) {
    var data = {
      eventName: "rexlive:edited",
      modelEdited: false
    }
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  /**
   * Changing the media value
   * @param {Object} data Media uploader image object
   */
  var handleMediaEdit = function( data ) {
    var target = document.querySelector( '.builderlive-editable-field[data-editable-id="' + data.media_data.fieldId + '"]' );
    
    target.setAttribute( 'data-editable-value', data.imgData[0].media_info.id );

    switch( target.tagName.toLowerCase() ) {
      case 'img':
        // image as img
        target.setAttribute('src', data.imgData[0].display_info.src);
        target.removeAttribute('srcset');
        break;
      default:
        // maybe image background
        target.style.backgroundImage = 'url(' + data.imgData[0].display_info.src + ')';
        break;
    }

    if ( 'undefined' !== data.media_data.fromMediaListModal && data.media_data.fromMediaListModal ) {
      var msgData = {
        eventName: "rexlive:liveMediaEditFromListComplete",
        mediaData: {
          src: data.imgData[0].display_info.src,
          fieldId: data.media_data.fieldId
        }
      };
  
      Rexbuilder_Util_Editor.sendParentIframeMessage(msgData);
    }
  };

  /**
   * Reacting to add live media event
   * @param {Object} data add data media object
   */
  var handleMediaAdd = function( data ) {
    var destionationEl = document.querySelector( data.media_data.destinationSelector );
    var elData = executeFunctionByName( data.media_data.tmplDataGeneration, window, data );
    var newHTMLEl = tmpl( data.media_data.addTmplId, elData );

    // generate Node element from html
    var tempWrap = document.createElement('DIV');
    tempWrap.innerHTML = newHTMLEl;
    var newEl = tempWrap.children[0];
    
    var field;
    if ( -1 !== newEl.className.indexOf( 'builderlive-editable-field' ) ) {
      field = newEl;
    } else {
      field = newEl.querySelector('.builderlive-editable-field');
    }

    var editableType = field.getAttribute('data-editable-type');
    var index = document.getElementsByClassName('builderlive-editable-field');
    var id = 'bl_' + editableType + '_' + index.length;
    field.setAttribute('data-editable-id', id );
    var result = wrapMediaTools( field, editableType );
    field.addEventListener('click', handleMediaClick);
    
    destionationEl.appendChild( newEl );

    executeFunctionByName( data.media_data.completeAddCallback, window, newEl, elData );

    // if the call comes from the media list modal, add the item to the list
    if ( 'undefined' !== data.media_data.fromMediaListModal && data.media_data.fromMediaListModal ) {
      var msgData = {
        eventName: "rexlive:liveMediaAddFromListComplete",
        mediaData: {
          src: data.imgData[0].display_info.src,
          fieldId: id
        }
      };
  
      Rexbuilder_Util_Editor.sendParentIframeMessage(msgData);
    }
  };

  /**
   * Getting the field data, manipulating them according to their type
   * 1) media: getting the media ID
   * 2) media_list: getting the actual media ID and the previous value, to replace from the list
   * 2) html: getting the html trimmed
   * 3) float: getting the number value, eventually formatted
   * 4) text: getting the text trimmed
   */
  var getFieldData = function() {
    var data = [];

    // realunch find fields, to get dinamic generated fields
    // or reordered ones
    findFields();

    fieldsEditable.forEach(function(field) {
      var editableType = field.getAttribute('data-editable-type');
      editableType = ( null === editableType ? 'text' : editableType );
      var prevHashCode = field.getAttribute('data-editable-hash');
      var hashCode;

      switch( editableType ) {
        case 'html':
        case 'float':
        case 'text':
          hashCode = field.innerText.trim().hashCode();
          break;
        case 'media':
        case 'media_list':
        case 'media_list_aggregate':
          hashCode = field.getAttribute('data-editable-value').hashCode();
          break;
        default:
          break;
      }

      // updating data only if the hash has changed
      if ( hashCode != prevHashCode ) {
        var editableInfo = field.getAttribute('data-editable-info');
        var editableFormat = field.getAttribute('data-editable-format');
  
        var temp = {
          prev_value: null,
          value: null,
          info: ( '' !== editableInfo ? JSON.parse( editableInfo ) : [] ),
          type: editableType
        };
  
        switch( editableType ) {
          case 'media':
            temp.value = field.getAttribute('data-editable-value');
            break;
          case 'media_list':
          case 'media_list_aggregate':
            temp.prev_value = field.getAttribute('data-editable-prev-value');
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
      }
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
  var handleIframeMessage = function(event) {
    if (event.data.rexliveEvent) {
      // saving post live edit information
      if ( 'rexlive:savePage' === event.data.eventName ) {
        var fieldData = getFieldData();

        if ( fieldData.length > 0 ) {
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
                // reset hashes after save
                fieldsEditable.forEach(function(field, index) {
                  var editableType = field.getAttribute('data-editable-type');
                  editableType = ( null === editableType ? 'text' : editableType );
                  var hashCode = null;
            
                  switch( editableType ) {
                    case 'html':
                    case 'float':
                    case 'text':
                      hashCode = field.innerText.trim().hashCode();                      
                      break;
                    case 'media':
                    case 'media_list':
                    case 'media_list_aggregate':
                      hashCode = field.getAttribute('data-editable-value').hashCode();
                      break;
                    default:
                      break;
                  }
            
                  // setting hash code
                  // and prev value to the actual, cause the page was saved
                  field.setAttribute('data-editable-hash', hashCode );
                  field.setAttribute('data-editable-prev-value', field.getAttribute('data-editable-value'));
                });
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

      // handling media uploading
      if ( 'rexlive:liveMediaEdit' === event.data.eventName ) {
        handleMediaEdit(event.data.data_to_send);
        handleContentEditableInput();
      }

      if ( 'rexlive:liveMediaAdd' === event.data.eventName ) {
        handleMediaAdd(event.data.data_to_send);
        handleContentEditableInput();
      }

      // handle media edit from modal
      if ( 'rexlive:liveMediaOpenEdit' === event.data.eventName ) {
        var media = document.querySelector('.builderlive-editable-field[data-editable-id="' + event.data.data_to_send.elId + '"]');
        if ( media ) {
          openEditMedia(media, event.data.data_to_send.fromMediaListModal);
        }
      }

      if ( 'rexlive:liveMediaReorder' === event.data.eventName ) {
        if ( event.data.data_to_send ) {
          // launch a callback
          executeFunctionByName( event.data.data_to_send.completeReorderCallback, window, event.data.data_to_send );
          handleContentEditableInput();
        }
      }

      // handle media removing from modal
      if ( 'rexlive:liveMediaDelete' === event.data.eventName ) {
        var media = document.querySelector('.builderlive-editable-field[data-editable-id="' + event.data.data_to_send.elId + '"]');
        if ( media ) {
          var value = media.getAttribute('data-editable-value');
          media.setAttribute('data-editable-value', '');
          media.style.visibility = 'hidden';

          // launch a callback
          var callbackData = {
            mediaListAggregateSelector: event.data.data_to_send.mediaListAggregateSelector,
            value: value
          };
          executeFunctionByName( event.data.data_to_send.completeRemoveCallback, window, callbackData );
          handleContentEditableInput();
        }
      }
    }
  };

  /**
   * On Window load event
   */
  var load = function() {
    makeFieldsEditable();
  };

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('message', handleIframeMessage, false);
  window.addEventListener('load', load);  
}());
