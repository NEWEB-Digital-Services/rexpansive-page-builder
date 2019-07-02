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
   * Loading lazy a background image in an element
   * @param {Node} el element to lazy load a background image
   */
  var lazyLoadBkgrImg = function( el ) {
    // if ( el ) {
      var src = el.getAttribute('data-src');
      if ( null !== src ) {
        var tempImg = new Image();
        tempImg.src = el.getAttribute('data-src');
        tempImg.onload = function() {
          el.style.backgroundImage = 'url(' + el.getAttribute('data-src') + ')';
          el.removeAttribute('data-src');
          // if ( observable.getAttribute('data-rexbuilder-block-id') ) {

          // } else if ( observable.getAttribute('data-rexlive-section-id') ) {

          // }
        };

        // on case of loading error, repush the image on the visibile queue
        // so the next interval can be reprocessed
        tempImg.onerror = function() {
          console.log('errure')
          imgVisibleQueue.push( el );
        };
      }
    // }
  }

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

    var onCanPlayThroughCallback = function(event) {
      // console.log('%c canplaythrough', 'font-weight:bold;color:green;text-transform:uppercase;');
      // console.log(event.currentTarget.children[0].src);
      event.currentTarget.play();
      if ( queuing ) { videoProcessingCounter--; }
      // remove data-src attribute only if the
      // video is correctly started
      for ( var source in el.children ) {
        var videoSource = el.children[source];
        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
          videoSource.removeAttribute('data-src');
        }
      }
      // removing the callback once performed, also the onerror callback
      event.currentTarget.removeEventListener(event.type, onCanPlayThroughCallback);
      event.currentTarget.removeEventListener('error', onErrorCallback);
    }

    var onErrorCallback = function(event) {
      // console.log('%c error', 'font-weight:bold;color:red;text-transform:uppercase;');
      // console.log(event.currentTarget.children[0].src);
      // reset the video
      for ( var source in event.currentTarget.children ) {
        var videoSource = event.currentTarget.children[source];
        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
          // videoSource.src = src;
          videoSource.removeAttribute('src');
        }
      }
      event.currentTarget.load();

      if ( queuing ) { videoVisibleQueue.push(event.currentTarget); videoProcessingCounter--; }
    }

    // if video can play
    el.addEventListener('canplaythrough', onCanPlayThroughCallback);
    
    // if error, try to reload the resource
    el.addEventListener('error', onErrorCallback);

    // var testCb = function(event) {
      // console.log(event.type);
      // console.log(event.currentTarget.children[0].src);
    // }

    // el.addEventListener('stalled',testCb);
    // el.addEventListener('suspend',testCb);
    // el.addEventListener('waiting',testCb);
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

  /**
   * Handling all the intersections
   */
  var handleIntersectionObserver = function()
  {
    // console.log(queuing);
    if ('1' === _plugin_frontend_settings.fast_load )
    {
      if ("IntersectionObserver" in window) {
        // observer sections
        var sections = [].slice.call(document.querySelectorAll('.rexpansive_section'));
  
        scrollobserverSection = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if(entry.isIntersecting) {
              if ( queuing )
              {
                // check images background
                var imgWrapper = entry.target; 
                if ( imgWrapper ) {
                  imgVisibleQueue.push( imgWrapper );
                }
    
                // check video background
                var videoWrapper = entry.target.querySelector('.rex-video-container');
                if ( videoWrapper ) {
                  addLazyVideoListeners( videoWrapper );
                  videoVisibleQueue.push( videoWrapper );
                }
              }
              else
              {
                // check images background
                if ( -1 !== entry.target.className.indexOf('section-w-image') ) {
                  var imgWrapper = entry.target;
                  if ( imgWrapper ) {
                    lazyLoadBkgrImg( imgWrapper );
                  }
                }
    
                // check video background
                var videoWrapper = entry.target.querySelector('.rex-video-container');
                if ( videoWrapper ) {
                  addLazyVideoListeners( videoWrapper );
                  lazyLoadVideoHTML( videoWrapper );
                }
              }
  
              // stop observing section
              scrollobserverSection.unobserve(entry.target);
            }
          });
        });
  
        sections.forEach(function(section) {
          scrollobserverSection.observe(section);
        });
  
        // observe blocks
        var blocks = [].slice.call(document.querySelectorAll('.perfect-grid-item'));
  
        scrollobserverBlock = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if(entry.isIntersecting) 
            {
              if (queuing) {
                // check images background
                var imgWrapper = entry.target.querySelector('.rex-image-wrapper');
                if ( imgWrapper ) {
                  imgVisibleQueue.push( imgWrapper );
                }
    
                // check video background
                var videoWrapper = entry.target.querySelector('.rex-video-container');
                if ( videoWrapper ) {
                  videoVisibleQueue.push( videoWrapper );
                }
              }
              else
              {
                // check images background
                if ( -1 !== entry.target.className.indexOf('block-w-image') ) {
                  var imgWrapper = entry.target.querySelector('.rex-image-wrapper');
                  if ( imgWrapper ) {
                    lazyLoadBkgrImg( imgWrapper );
                  }
                }

                // check video background
                var videoWrapper = entry.target.querySelector('.rex-video-container');
                if ( videoWrapper ) {
                  lazyLoadVideoHTML( videoWrapper );
                }
              }
  
              // stop observing block
              scrollobserverBlock.unobserve(entry.target);
            }
          });
        });
  
        blocks.forEach(function(block) {
          scrollobserverBlock.observe(block);
        });
      }
    }
  }

  /**
   * New intersection observer handler
   * checking going in viewport and going out
   * 
   */
  var handleIntersectionObserverSmart = function()
  {
    // console.log(queuing);
    if ('1' === _plugin_frontend_settings.fast_load )
    {
      if ("IntersectionObserver" in window) {
        // observer sections
        var sections = [].slice.call(document.querySelectorAll('.rexpansive_section'));
  
        scrollobserverSection = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            var imgWrapper = null;
            var videoWrapper = null;

            if ( -1 !== entry.target.className.indexOf('section-w-image') ) {
              imgWrapper = entry.target;
            }

            // check video background
            if ( -1 !== entry.target.className.indexOf('section-w-html-video') ) {
              videoWrapper = entry.target.querySelector('.rex-video-container');
            }

            // element becomes visible
            if( entry.isIntersecting ) {

              // check images background
              if ( imgWrapper ) {
                lazyLoadBkgrImg( imgWrapper );
              }
  
              if ( videoWrapper ) {
                if ( entry.intersectionRatio >= 0.5 && 0 !== videoWrapper.readyState && videoWrapper.paused ) {
                  videoWrapper.play();
                } else {
                  lazyLoadVideoHTML( videoWrapper );
                }
              }
            }
            // element goes invisible 
            else {
              if ( videoWrapper ) {
                videoWrapper.pause();
              }
            }

            // stop observing section
            // scrollobserverSection.unobserve(entry.target);
          });
        }, {
          threshold: [0, 0.5 ,1]
        });
  
        sections.forEach(function(section) {
          // adding listeners only one time
          if ( -1 !== section.className.indexOf('section-w-html-video') ) {
            var videoWrapper = section.querySelector('.rex-video-container');
            if ( videoWrapper ) {
              addLazyVideoListeners( videoWrapper );
            }
          }

          scrollobserverSection.observe(section);
        });
  
        // observe blocks
        var blocks = [].slice.call(document.querySelectorAll('.perfect-grid-item'));
  
        scrollobserverBlock = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            var imgWrapper = null;
            var videoWrapper = null;

            if ( -1 !== entry.target.className.indexOf('block-w-image') ) {
              imgWrapper = entry.target.querySelector('.rex-image-wrapper');
            }

            // check video background
            if ( -1 !== entry.target.className.indexOf('block-w-html-video') ) {
              videoWrapper = entry.target.querySelector('.rex-video-container');
            }

            if ( entry.isIntersecting ) 
            {
              // check images background
              if ( imgWrapper ) {
                lazyLoadBkgrImg( imgWrapper );
              }

              if ( videoWrapper ) {
                if ( entry.intersectionRatio >= 0.5 && 0 !== videoWrapper.readyState && videoWrapper.paused ) {
                  videoWrapper.play();
                } else {
                  lazyLoadVideoHTML( videoWrapper );
                }
              }
  
              // stop observing block
              // scrollobserverBlock.unobserve(entry.target);
            }
            else {
              if ( videoWrapper ) {
                videoWrapper.pause();
              }
            }
          });
        },  {
          threshold: [0, 0.5 ,1]
        });
  
        blocks.forEach(function(block) {
          if ( -1 !== block.className.indexOf('block-w-html-video') ) {
            var videoWrapper = block.querySelector('.rex-video-container');
            if ( videoWrapper ) {
              addLazyVideoListeners( videoWrapper );
            }
          }

          scrollobserverBlock.observe(block);
        });
      }
    }
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
  // window.addEventListener('load', handleIntersectionObserver);
  window.addEventListener('load', handleIntersectionObserverSmart);
}());