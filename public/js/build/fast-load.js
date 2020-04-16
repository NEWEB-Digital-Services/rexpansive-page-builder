/**
 * Lazy load logic
 * @since 2.0.0
 */
;(function() {
    var isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
      isMobile = true;
    }

  var queuing = false;
  if ( isMobile ) {
    queuing = true;
  }

  var PROMISE_EXISTS = typeof Promise !== "undefined" && Promise.toString().indexOf( "[native code]" ) !== -1;

  var scrollobserverSection;
  var scrollobserverBlock;

  var maxImgs = 10;
  var maxVideos = 1;

  var imgVisibleQueue = [];
  var videoVisibleQueue = [];
  
  var imgProcessingQueue = [];
  var videoProcessingQueue = [];  

  // counting the processing videos
  var videoProcessingCounter = 0;

  this.getQueueInfo = function() {
    return {
      'videoVisibleQueue': videoVisibleQueue,
      'videoProcessingQueue': videoProcessingQueue,
      'videoProcessingCounter': videoProcessingCounter
    };
  }

  /**
   * Fixing a sticky section with lazy load
   * @param  {Element} section maybe section to check
   * @return {void}
   * @since  2.0.4
   */
  function checkLazyStickySection( section ) {
		var sectionData = section.querySelector('.section-data');
		var bkgrSimulator = section.querySelector('.sticky-background-simulator');

    if ( null === sectionData || null === bkgrSimulator ) {
      return;
    }

    var src = sectionData.getAttribute('data-image_bg_section');
    if ( null === src ) {
      return;
    }
		
    bkgrSimulator.style.backgroundImage = 'url(' + src + ')';
  }

  function onImageLoad( el ) {
    // if ( '' === el.style.backgroundImage ) {
    if( -1 === el.style.backgroundImage.indexOf( this.src ) ) {
      el.style.backgroundImage = 'url(' + this.src + ')';
      el.removeAttribute( 'data-src' );

      if ( -1 !== el.className.indexOf( 'sticky-section' ) ) {
        checkLazyStickySection( el );
      }
    }
  }

  /**
   * Loading lazy a background image in an element
   * @param {Node} el element to lazy load a background image
   */
  var lazyLoadBkgrImg = function( el ) {
    var src = el.getAttribute('data-src');

    if ( null !== src && -1 === el.style.backgroundImage.indexOf( src ) ) {
      var tempImg = new Image();
      tempImg.src = src;
      tempImg.onload = onImageLoad.bind( tempImg, el );

      // on case of loading error, repush the image on the visibile queue
      // so the next interval can be reprocessed
      tempImg.onerror = function() {
        console.log('error')
        imgVisibleQueue.push( el );
      };
    }
  }

  /**
   * Loading lazy a background image in an element
   * @param {Node} el element to lazy load a background image
   */
  function lazyLoadBkgrImgPromise( el ) {

  	var src = el.getAttribute( 'data-src' );
  	var isLazyLoading = 'true' == el.getAttribute( 'data-res-lazy-loading' );

  	if ( null !== src && -1 === el.style.backgroundImage.indexOf( src ) && !isLazyLoading ) {
  		loadResource( src, el )
  			.then( function() {} )
  			.catch( function( err ) {
  				console.error( err )
  			} );
  	}
  }

  function loadResource( src, el ) {
    el.setAttribute('data-res-lazy-loading', true);

    return new Promise( function( resolve, reject ) {
  		// Standard XHR to load an image
  		var request = new XMLHttpRequest();
  		request.open( 'GET', src );
  		request.responseType = 'blob';

  		request.onload = function() {
  			if ( request.status === 200 ) {
  				// If successful, resolve the promise by passing back the request response
  				el.style.backgroundImage = 'url(' + src + ')';
  				el.removeAttribute( 'data-src' );
          el.setAttribute('data-res-lazy-loading', false);

  				if ( -1 !== el.className.indexOf( 'sticky-section' ) ) {
  					checkLazyStickySection( el );
  				}
  				resolve( request.response );
  			} else {
  				// If it fails, reject the promise with a error message
  				reject( new Error( 'Image didn\'t load successfully; error code:' + request.statusText ) );
  			}
  		};
			
  		request.onerror = function() {
				console.error("XHR Request didn't go correctly!");
				imgVisibleQueue.push(el);
				reject();
			};

  		// Send the request
  		request.send();
  	} );
  };

  /**
   * Adding listeners to the video element to lazy load
   * @param {Element} el video element
   */
  var addLazyVideoListeners = function( el ) {
    // handling loader icon
    var controls = el.nextElementSibling;
    if ( controls ) {
      var loader = controls.querySelector('.loader');
      var pause = controls.querySelector('.pause');
      if ( loader ) {
        // tracing the callback to succesfully remove it
        // after the call
        el.addEventListener('play', function cb(event) {
          loader.className = loader.className.replace('video-tool--view','').trim();
          pause.className = pause.className + ' video-tool--view';
          event.currentTarget.removeEventListener(event.type, cb);
        });
      }
    }

    // if video can play
    el.addEventListener('canplaythrough', onCanPlayThroughCallback);
    
    // if error, try to reload the resource
    el.addEventListener('error', onErrorCallback);

    // el.addEventListener('stalled',testCb);
    // el.addEventListener('suspend',testCb);
    // el.addEventListener('waiting',testCb);
    // el.addEventListener('reject',testCb);
    // el.addEventListener('loadeddata',testCb);
    // el.addEventListener('loadedmetadata',testCb);
    // el.addEventListener('abort',testCb);
  }

  function testCb(event) {
    console.log(event.type)
  }

  var onCanPlayThroughCallback = function(event) {
    event.currentTarget.play().then(function () {
			// console.log( '2' );
			
		});
    if ( queuing ) { videoProcessingCounter--; }
    // remove data-src attribute only if the
    // video is correctly started
    for ( var source in event.currentTarget.children ) {
      var videoSource = event.currentTarget.children[source];
      if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
        videoSource.removeAttribute('data-src');
      }
    }
    // removing the callback once performed, also the onerror callback
    event.currentTarget.removeEventListener(event.type, onCanPlayThroughCallback);
    event.currentTarget.removeEventListener('error', onErrorCallback);
  }

  var onErrorCallback = function(event) {
    // console.log('onErrorCallback')
    // reset the video
    for ( var source in event.currentTarget.children ) {
      var videoSource = event.currentTarget.children[source];
      if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
        videoSource.removeAttribute('src');
      }
    }
    event.currentTarget.load();

    if ( queuing ) { videoVisibleQueue.push(event.currentTarget); videoProcessingCounter--; }
  }

  /**
   * Loading lazy a video/source in an element
   * @param {Node} el element to lazy load a video/source
   */
  var lazyLoadVideoHTML = function( el ) {
    if ( 0 === el.readyState ) {
      for ( var source in el.children ) {
        var videoSource = el.children[source];
        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
					
          var src = videoSource.getAttribute('data-src');
          if ( src ) {
						
            videoSource.src = src;
            // videoSource.removeAttribute('data-src');
          }
        }
			}
			
			el.load();
    }
  }

  function sectionIntersectionObserverCallback(entries, sectionObserver) {
    var tot_entries = entries.length, i;
    var imgWrapper, videoWrapper;
    
    for( i=0; i < tot_entries; i++ ) {
      imgWrapper = null;
      videoWrapper = null;

      // element becomes visible
      if( entries[i].isIntersecting ) {
        if ( -1 !== entries[i].target.className.indexOf('section-w-image') ) {
          imgWrapper = entries[i].target;
        }

        // check video background
        if ( -1 !== entries[i].target.className.indexOf('section-w-html-video') ) {
          videoWrapper = entries[i].target.querySelector('.rex-video-container');
        }

        // check images background
        if ( imgWrapper ) {
          if ( PROMISE_EXISTS ) {
            lazyLoadBkgrImgPromise( imgWrapper );
          } else {
            lazyLoadBkgrImg( imgWrapper );
          }
        }

        // check video background
        if ( videoWrapper ) {
					// console.log( 'LAZY LOAD SECTION VIDEO' );
					lazyLoadVideoHTML( videoWrapper );
        }
        
        // stop observing section
        sectionObserver.unobserve(entries[i].target);
      }
    }
  }

  function blockIntersectionObserverCallback(entries, blockObserver) {
    var tot_entries = entries.length, i;
    var imgWrapper, videoWrapper;

    for( i=0; i < tot_entries; i++ ) {
      imgWrapper = null;
      videoWrapper = null;

      // check video background
      if ( -1 !== entries[i].target.className.indexOf('block-w-html-video') ) {
        videoWrapper = entries[i].target.querySelector('.rex-video-container');
      }

      if ( entries[i].isIntersecting ) {
        if ( -1 !== entries[i].target.className.indexOf('block-w-image') ) {
          imgWrapper = entries[i].target.querySelector('.rex-image-wrapper');
        }

        // check images background
        if ( imgWrapper ) {
          if ( PROMISE_EXISTS ) {
            lazyLoadBkgrImgPromise( imgWrapper );
          } else {
            lazyLoadBkgrImg( imgWrapper );
          }
				}
				
        if ( videoWrapper ) {
					// console.log( entries[i].intersectionRatio >= 0.5 && 0 !== videoWrapper.readyState && videoWrapper.paused );
					
          if ( entries[i].intersectionRatio >= 0.5 && 0 !== videoWrapper.readyState && videoWrapper.paused ) {
            // console.log('fast-load.js - 375 - play()')
            videoWrapper.play().then(function () {
							// console.log( '1' );
							
						});
          } else {
						// console.log( 'LAZY LOAD BLOCK VIDEO' );
						
            lazyLoadVideoHTML( videoWrapper );
          }
        }

        // stop observing block
        blockObserver.unobserve(entries[i].target);
      } else {
        if ( videoWrapper ) {
          videoWrapper.pause();
        }
      }
    }
  }

  /**
   * New intersection observer handler
   * checking going in viewport and going out
   * 
   */
  var handleIntersectionObserverSmart = function() {
		console.log( 'ci sono' );
		
    if ('0' === _plugin_frontend_settings.fast_load ) {
      return;
    }

    if ( ! "IntersectionObserver" in window) {
      return;
    }

    // observer sections
    var sections = [].slice.call(document.querySelectorAll('.rexpansive_section'));
    var tot_sections = sections.length, i;

    scrollobserverSection = new IntersectionObserver(
      sectionIntersectionObserverCallback, 
      {
        threshold: [0, 0.5 ,1],
        rootMargin: '100% 0% 100% 0%'
      }
    );

    for( i=0; i < tot_sections; i++ ) {
      // adding listeners only one time
      if ( -1 !== sections[i].className.indexOf('section-w-html-video') ) {
        var videoWrapper = sections[i].querySelector('.rex-video-container');
        if ( videoWrapper ) {
          addLazyVideoListeners( videoWrapper );
        }
      }

      scrollobserverSection.observe(sections[i]);
    }

    // observe blocks
    var blocks = [].slice.call(document.querySelectorAll('.perfect-grid-item'));
    var tot_blocks = blocks.length, j;

    scrollobserverBlock = new IntersectionObserver(
      blockIntersectionObserverCallback, 
      {
        threshold: [0, 0.5 ,1],
        rootMargin: '100% 0% 100% 0%'
      }
    );

    for( j=0; j < tot_blocks; j++ ) {
      if ( -1 !== blocks[j].className.indexOf('block-w-html-video') ) {
        var videoWrapper = blocks[j].querySelector('.rex-video-container');
        if ( videoWrapper ) {
          addLazyVideoListeners( videoWrapper );
        }
      }

      scrollobserverBlock.observe(blocks[j]);
    }
  }

  function destroyObservers() {
  	if ( scrollobserverSection ) {
  		scrollobserverSection.disconnect()
  		scrollobserverSection = null
  	}

  	if ( scrollobserverBlock ) {
  		scrollobserverBlock.disconnect()
  		scrollobserverBlock = null
  	}

  	imgVisibleQueue = [];
  	videoVisibleQueue = [];

  	imgProcessingQueue = [];
  	videoProcessingQueue = [];

  	videoProcessingCounter = 0;
  }

  /**
   * Handling lazy request within a queue
   */
  var handlingQueues = function() {
    var request;
    var now;
    var then = Date.now();
    var interval = 500;

    /**
     * Setting up an interval with request animation frame
     */
    var runInterval = function() {
      request = requestAnimationFrame(runInterval);

      now = Date.now();
	    delta = now - then;
  
      if (delta > interval) {
        checkQueue();
        then = now - (delta % interval);
      }
    }

    /**
     * Processing the queue, loading the data
     */
    var checkQueue = function() {
      // LOAD IMAGES
      checkImgQueue();

      // LOAD VIDEOS
      checkVideoQueue();
    }

    runInterval();
  };

  /**
   * Processing images
   */
  var checkImgQueue = function() {
    // moving the visibile images in the processing queue
    // until the processing queue is full
    var ipqL = imgProcessingQueue.length;
    if ( ipqL < maxImgs )
    {
      for ( var q in imgVisibleQueue ) {
        if ( ipqL < maxImgs ) {
          var temp = imgVisibleQueue.shift();
          imgProcessingQueue.push(temp);
          ipqL++;
        }
      }
    }

    // process the images
    var i = 0;
    var totPQ = imgProcessingQueue.length;
    while ( i < totPQ ) {
      var temp = imgProcessingQueue.shift();
      lazyLoadBkgrImg( temp );
      i++;
    }
  }

  /**
   * Processing videos
   */
  var checkVideoQueue = function() {
    // moving the visibile videos in the processing queue
    // until the processing queue is full
    var vpqL = videoProcessingQueue.length;
    if ( vpqL < maxVideos )
    {
      for ( var q in videoVisibleQueue ) {
        if ( vpqL < maxVideos ) {
          var temp = videoVisibleQueue.shift();
          videoProcessingQueue.push(temp);
          vpqL++;
        }
      }
    }

    // process the videos
    if ( 0 === videoProcessingCounter ) {
      var i = 0;
      var totPQ = videoProcessingQueue.length;
      while ( i < totPQ ) {
				var temp = videoProcessingQueue.shift();
				// console.log( 'LAZY LOAD QUEUE VIDEO' );
				lazyLoadVideoHTML( temp );
        i++;
        videoProcessingCounter++;
      }
    }
  }

  /**
   * Wait dom load to subscribe the elements to the intersection observer
   */
  if ( queuing ) {
    document.addEventListener('DOMContentLoaded', handlingQueues);
  }

  window.FastLoad = {
  	init: handleIntersectionObserverSmart,
  	destroy: destroyObservers
  };
}());