;(function() {
  // DOM elements
  var uploadIcons;
  var removeIcons;
  var uploadIconsForm;
  var uploadIconsNonce;
  var iconsPreview;
  var iconsNum;
  var uploadIconsMsgs;
  var iconsSpinner;

  // SVGO optimizire intance
  var svgoInstance;

  // request information reference
  var timeoutSimulator;

  // global sprites counter and storage
  var totalSprites;
  var spritesObj;

  /**
   * Init SVGO plugin
   *
   */
  function initSVGO() {
    var config = {
      full: true,
      plugins: [
        {cleanupAttrs         : true}, // cleanup attributes from newlines, trailing, and repeating spaces
        {removeDoctype          : true}, // remove doctype declaration
        {removeXMLProcInst        : true}, // remove XML processing instructions
        {removeComments         : true}, // remove comments
        {removeMetadata         : true}, // remove <metadata>
        {removeTitle          : true}, // remove <title>
        {removeDesc           : true}, // remove <desc>
        {removeUselessDefs        : true}, // remove elements of <defs> without id
        {removeXMLNS          : true}, // removes xmlns attribute (for inline svg, disabled by default)
        {removeEditorsNSData      : true}, // remove editors namespaces, elements, and attributes
        {removeEmptyAttrs       : true}, // remove empty attributes
        {removeHiddenElems        : true}, // remove hidden elements
        {removeEmptyText        : true}, // remove empty Text elements
        {removeEmptyContainers      : true}, // remove empty Container elements
        {removeViewBox          : true}, // remove viewBox attribute when possible
        {cleanupEnableBackground    : true}, // remove or cleanup enable-background attribute when possible
        {minifyStyles         : false}, // minify <style> elements content with CSSO
        {convertStyleToAttrs      : false}, // convert styles into attributes
        { inlineStyles: false }, // Move <style> definitions to inline style attributes where possible
        {convertColors          : true}, // convert colors (from rgb() to #rrggbb, from #rrggbb to #rgb)
        {convertPathData        : true}, // convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more
        {convertTransform       : true}, // collapse multiple transforms into one, convert matrices to the short aliases, and much more
        {removeUnknownsAndDefaults    : true}, // remove unknown elements content and attributes, remove attrs with default values
        {removeNonInheritableGroupAttrs : true}, // remove non-inheritable group's "presentation" attributes
        {removeUselessStrokeAndFill   : true}, // remove useless stroke and fill attrs
        {removeUnusedNS         : true}, // remove unused namespaces declaration
        {cleanupIDs           : true}, // remove unused and minify used IDs
        {cleanupNumericValues     : true}, // round numeric values to the fixed precision, remove default px units
        {cleanupListOfValues      : true}, // round numeric values in attributes that take a list of numbers (like viewBox or enable-background)
        {moveElemsAttrsToGroup      : true}, // move elements' attributes to their enclosing group
        { moveGroupAttrsToElems: true }, // move some group attributes to the contained elements
        {collapseGroups         : true}, // collapse useless groups
        {removeRasterImages       : true}, // remove raster images (disabled by default)
        {mergePaths           : true}, // merge multiple Paths into one
        {convertShapeToPath       : true}, // convert some basic shapes to <path>
        {sortAttrs            : true}, // sort element attributes for epic readability (disabled by default)
        {removeDimensions       : true}, // remove width/height attributes if viewBox is present (opposite to removeViewBox, disable it first) (disabled by default)
        {removeAttrs          : true}, // remove attributes by pattern (disabled by default)
        {removeElementsByAttr     : true}, // remove arbitrary elements by ID or className (disabled by default)
        {addClassesToSVGElement     : true}, // add classnames to an outer <svg> element (disabled by default)
        {addAttributesToSVGElement    : true}, // adds attributes to an outer <svg> element (disabled by default)
        {removeStyleElement       : false}, // remove <style> elements (disabled by default)
        {removeScriptElement      : true}, // remove <script> elements (disabled by default)
      ]
    };

    svgoInstance = new SVGO( config );
  }

  /**
   * Chace some vars
   *
   */
  function cacheVars() {
    uploadIcons = document.getElementById('uploadIcons');
    removeIcons = document.getElementById('removeIcons');
    uploadIconsForm = document.getElementById('uploadIconsForm');
    uploadIconsNonce = document.getElementById('uploadIconsNonce');
    iconsPreview = document.getElementById('iconsPreview');
    iconsNum = document.getElementById('icons-num');
    uploadIconsMsgs = document.getElementById('uploadIconsMsgs');
    iconsSpinner = document.getElementById('iconsSpinner');

    totalSprites = 0;
    spritesObj = [];
  }

  /**
   * handle upload icons from os file window
   * 
   * @param {Event} file element input event
   */
  function handleUploadIcons(ev) {
    uploadIconsMsgs.innerHTML = '';
    iconsNum.innerText = ev.currentTarget.files.length;

    var event = document.createEvent('HTMLEvents');
    event.initEvent('submit', true, false);
    uploadIconsForm.dispatchEvent(event);
  };

  /**
   * Handling remove icons
   *
   * @param {Event} remove button click event
   */
  function handleRemoveIcons(ev) {
    ev.preventDefault();
    var previewsSelected = [].slice.call( iconsPreview.querySelectorAll('.preview-wrap.selected') );
    if ( 0 !== previewsSelected.length ) {
      startLoading();

      var deleteList = [];
      previewsSelected.forEach( function(el) {
        deleteList.push( el.getAttribute( 'data-sprite-id' ) );
      });     

      var data = {
        action: "rexpansive_remove_sprite_icons",
        nonce_param: uploadIconsNonce.value,
        deleteList: JSON.stringify( deleteList )
      };

      // encode data to send request
      var encodedData = encodeData(data);

      var request = new XMLHttpRequest();
      request.open('POST', ajaxurl, true);

      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      // handling correct load
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var response = JSON.parse(request.responseText);

          // remove previews
          response.data.deleteList.forEach( function(spriteId) {
            var toRemove = iconsPreview.querySelector('.preview-wrap[data-sprite-id="' + spriteId + '"]');
            if ( toRemove ) {
              toRemove.parentNode.removeChild(toRemove);
            }
          });
          
          // successful removed
          writeMessage( response.data.deleteList.length + ' ' + admin_settings_vars.labels.remove_succesfull )
        }
      }
      // handling error
      request.onerror = function() {
        // There was a connection error of some sort
        writeMessage( admin_settings_vars.labels.remove_error );
      };

      // request end
      request.onloadend = function() {
        stopLoading();
      }
      // send request
      request.send(encodedData);
    }
    else {
      writeMessage( admin_settings_vars.labels.no_selection );
    }
  }

  /**
   * Optimize the icons before save them
   *
   * @param {Event} form submit event
   */
  function handleSubmitIcons(ev) {
    ev.preventDefault();

    startLoading();

    // start timeout to check optimization complete
    checkOptimizationComplete();

    var files = uploadIcons.files;
    for( var i=0, tot = files.length; i < tot; i++ ) {
      var spriteId = files[i].name.replace('.svg','');
      // check if sprite already exists
      var previewSprite = [].slice.call( iconsPreview.querySelectorAll('.preview-wrap[data-sprite-id="' + spriteId + '"]') );
      if ( previewSprite.length === 0 ) {
        // update sprite global counter
        totalSprites++;
        var temp = {
          id: spriteId,
          data: null
        }
        // read the files with a separate reader
        // to allow multiple files
        var reader = new FileReader();
        reader.addEventListener('load', handleFileLoader.bind(this, temp));
        
        reader.readAsText(files[i]);
      } else {
        // already existing sprite
        writeMessage( spriteId + ' ' + admin_settings_vars.labels.existing_sprite );
      }
    }
  };

  /**
   * Handling the load of a file with the FileReader API
   *
   * @param {Object} temp object to represent current icon
   * @param {Event} load event of FileReader
   */
  function handleFileLoader(temp, ev) {
    // once a file is loaded, optimize it with SVGO
    var optimized = svgoInstance.optimize(ev.target.result);

    optimized.then((optimized) => {
      // sprite preview
      // wrapper
      var wrap = document.createElement('span');
      wrap.className = 'preview-wrap';
      wrap.setAttribute( 'data-sprite-id', temp.id );

      wrap.addEventListener('click', handlePreviewSelect);

      // sprite ID
      var label = document.createElement('span');
      label.className = 'label';
      label.innerText = temp.id;

      // sprite preview
      var preview = document.createElement('i');
      preview.className = 'icon';
      preview.innerHTML = optimized.data;

      wrap.appendChild(preview);
      wrap.appendChild(label);
      iconsPreview.appendChild(wrap);

      // adding ID to sprite and convert to symbol element
      var tempWrapper = document.createElement('span');
      tempWrapper.innerHTML = optimized.data;
      var symbol = document.createElement('symbol');
      symbol.setAttribute('id', temp.id);
      symbol.setAttribute('viewBox', tempWrapper.children[0].getAttribute('viewBox'));
      symbol.setAttribute('xmlns', tempWrapper.children[0].getAttribute('xmlns'));
      symbol.innerHTML = tempWrapper.children[0].innerHTML;
      var symbolWrapper = document.createElement('span');
      symbolWrapper.appendChild(symbol);

      // succesfull message
      writeMessage( temp.id + ' ' + admin_settings_vars.labels.optimize_correct );

      temp.data = symbolWrapper.innerHTML;
      spritesObj.push(temp);
      totalSprites--;
    });
  }

  /**
   * Attach event handlers
   *
   */
  function attachEventListeners() {
    uploadIcons.addEventListener('input', handleUploadIcons);
    uploadIconsForm.addEventListener('submit', handleSubmitIcons);
    removeIcons.addEventListener('click', handleRemoveIcons);

    // icon selection to delete
    var previews = [].slice.call( iconsPreview.querySelectorAll('.preview-wrap') );
    previews.forEach( function(el) {
      el.addEventListener('click', handlePreviewSelect);
    });
  }

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
   * Upload optimized sprites
   *
   */
  function uploadSprites() {
    // clear timeout
    cancelAnimationFrame(timeoutSimulator);
    totalSprites = 0;
    iconsNum.innerText = '0';
    uploadIconsForm.reset();

    // if there aren't sprites uploaded, do not call
    if ( spritesObj.length > 0 ) {
      var data = {
        action: "rexpansive_upload_sprite_icons",
        nonce_param: uploadIconsNonce.value,
        sprites: JSON.stringify( spritesObj )
      };

      // clear global sprites
      spritesObj = [];

      // encode data to send request
      var encodedData = encodeData(data);

      var request = new XMLHttpRequest();
      request.open('POST', ajaxurl, true);

      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      // handling correct load
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var response = JSON.parse(request.responseText);
          
          // successful uploaded
          writeMessage( admin_settings_vars.labels.upload_succesfull );
        }
      }
      // handling error
      request.onerror = function() {
        // There was a connection error of some sort
        writeMessage( admin_settings_vars.labels.upload_error );
      };

      // end request
      request.onloadend = function() {
        stopLoading();
      }
      // send request
      request.send(encodedData);
    }
    else
    {
      stopLoading();
    }
  }

  /**
   * Simulate a timeout with requestAnimationFrame
   * to send the sprites when are all optimized
   */
  function checkOptimizationComplete() {
    var now;
    var then = Date.now();
    var interval = 100;

    /**
     * Setting up an interval with request animation frame
     */
    var runInterval = function() {
      timeoutSimulator = requestAnimationFrame(runInterval);

      now = Date.now();
      delta = now - then;
  
      if (delta > interval && totalSprites === 0 ) {
        uploadSprites();
        then = now - (delta % interval);
      }
    }

    runInterval();
  };

  /**
   * select an icon or deselect it on click
   *
   */
  function handlePreviewSelect(ev) {
    if ( -1 === ev.currentTarget.className.indexOf( 'selected' ) )
    {
      ev.currentTarget.className += ' selected';
    }
    else
    {
      ev.currentTarget.className = ev.currentTarget.className.replace('selected','').trim();
    }
  }

  /** 
   * Helper function to write messages to the user
   *
   */
  function writeMessage( msg ) {
    var msgEl = document.createElement('p');
    msgEl.innerText = msg;
    uploadIconsMsgs.appendChild( msgEl );
  }

  function startLoading() {
    iconsSpinner.style.visibility = 'visible';
  }

  function stopLoading() {
    iconsSpinner.style.visibility = ''; 
  }

  /**
   * On DOM load
   */
  function DOMLoad() {
    initSVGO();
    cacheVars();
    attachEventListeners();
  };

  document.addEventListener('DOMContentLoaded', DOMLoad);
}());