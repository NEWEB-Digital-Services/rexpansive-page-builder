(function() {

  var queuing = true;

  var scrollobserverSection;
  var scrollobserverBlock;

  var maxImgs = 10;
  var maxVideos = 1;

  var imgVisibleQueue = [];
  var videoVisibleQueue = [];
  
  var videoProcessingQueue = [];

  var processingImgs = false;
  var processingVideos = false;

  var processingImgCounter = 0;

  /**
   * Loading lazy a background image in an element
   * @param {Node} el element to lazy load a background image
   */
  var lazyLoadBkgrImg = function( el ) {
    if ( el ) {
      var src = el.getAttribute('data-src');
      if ( src ) {
        if ( queuing ) { processingImgCounter++; }
        var tempImg = new Image();
        tempImg.src = el.getAttribute('data-src');
        tempImg.onload = function() {
          el.style.backgroundImage = 'url(' + el.getAttribute('data-src') + ')';
          el.removeAttribute('data-src');
          if ( queuing ) { processingImgCounter--; }
        }
      }
    }
  }

  /**
   * Removing the video loader on video play
   * Binding the loader to the this object
   * @param {Event} event HTMLMediaElement play event
   */
  var removeVideoLoader = function(event) {
    this.className = this.className.replace('loader--view','').trim();
  }

  /**
   * Loading lazy a video/source in an element
   * @param {Node} el element to lazy load a video/source
   */
  var lazyLoadVideoHTML = function( el ) {
    if ( el ) {
      // handling loader icon
      var controls = el.nextElementSibling;
      if ( controls ) {
        var loader = controls.querySelector('.loader');
        if ( loader ) {
          el.addEventListener('play', removeVideoLoader.bind(loader), {once:true});
        }
      }

      el.addEventListener('canplaythrough', function(event) {
        console.log('%c canplaythrough', 'font-weight:bold;color:green;text-transform:uppercase;');
      },{once:true});

      // if error, try to reload the resource
      el.addEventListener('error', function(event) {
        // if ( queuing ) { videoVisibleQueue.push(el); }
        console.log('%c error', 'font-weight:bold;color:red;text-transform:uppercase;');
        console.log(event.target.children[0].src);
      });
      
      // el.addEventListener('emptied', function(event) {
      //   console.log('emptied')
      //   console.log(event.target);
      // });
      
      // el.addEventListener('stalled', function(event) {
      //   // if ( queuing ) { videoVisibleQueue.push(el); }
      //   console.log('stalled')
      //   console.log(event.target);
      // });
      
      // el.addEventListener('suspend', function(event) {
      //   console.log('suspend')
      //   console.log(event.target);
      // });

      // el.addEventListener('ended', function(event) {
      //   console.log('ended')
      //   console.log(event.target);
      // });

      for ( var source in el.children ) {
        var videoSource = el.children[source];
        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
          var src = videoSource.getAttribute('data-src');
          if ( src ) {
            videoSource.src = src;
            videoSource.removeAttribute('data-src');
          }
        }
      }
      el.load();
    }
  }

  var handleIntersectionObserver = function()
  {
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
                  videoVisibleQueue.push( videoWrapper );
                }
              }
              else
              {
                // check images background
                var imgWrapper = entry.target;
                lazyLoadBkgrImg( imgWrapper );
    
                // check video background
                var videoWrapper = entry.target.querySelector('.rex-video-container');
                lazyLoadVideoHTML( videoWrapper );
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
                var imgWrapper = entry.target.querySelector('.rex-image-wrapper');
                lazyLoadBkgrImg( imgWrapper );

                // check video background
                var videoWrapper = entry.target.querySelector('.rex-video-container');
                lazyLoadVideoHTML( videoWrapper );
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
   * Handling lazy request within a queue
   */
  var handlingQueues = function() {
    var request;
    var now;
    var then = Date.now();
    var interval = 500;
    processingImgs = false;
    processingVideos = false;

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
      //console.log(processingImgCounter);
      //console.log(imgVisibleQueue);
      // console.log(processingVideoCounter);
      // console.log(videoVisibleQueue);
      // console.log(processingImgCounter,maxImgs,processingImgs);
      if ( processingImgCounter < maxImgs && ! processingImgs ) {
        processingImgs = true;
        var i = 0;
        for ( var i = 0, totIQ = imgVisibleQueue.length; i < totIQ; i++ ) {
          // if ( i < maxImgs ) {
            var temp = imgVisibleQueue.shift();
            lazyLoadBkgrImg( temp );
          // }
        }
        processingImgs = false;
      }

      // console.log('visible');
      // console.log(videoVisibleQueue);

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

      // console.log('processing');
      // console.log(videoProcessingQueue);

      var i = 0;
      var totPQ = videoProcessingQueue.length;
      while ( i < totPQ ) {
        var temp = videoProcessingQueue.shift();
        lazyLoadVideoHTML( temp );
        i++;
      }

      // console.log(processingVideoCounter,maxVideos,processingVideos);
      /*if ( processingVideoCounter < maxVideos && ! processingVideos ) {
        processingVideos = true;
        for ( var i = 0, totVQ = videoVisibleQueue.length; i < totVQ; i++ ) {
          if ( i < maxVideos ) {
            var temp = videoVisibleQueue.shift();
            lazyLoadVideoHTML( temp );
          }
        }
        processingVideos = false;
      }*/
    }

    runInterval();
  }

  /**
   * Wait dom load to subscribe the elements to the intersection observer
   */
  // document.addEventListener('DOMContentLoaded', handleIntersectionObserver);
  if ( queuing ) {
    document.addEventListener('DOMContentLoaded', handlingQueues);
  }
  window.addEventListener('load', handleIntersectionObserver);
}());