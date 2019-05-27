(function() {

  /**
   * Loading lazy a background image in an element
   * @param {Node} el element to lazy load a background image
   */
  var lazyLoadBkgrImg = function( el ) {
    if ( el ) {
      var src = el.getAttribute('data-src');
      if ( src ) {
        el.style.backgroundImage = 'url(' + el.getAttribute('data-src') + ')';
        el.onload = function() {
          el.removeAttribute('data-src');
        };
      }
    }
  }

  /**
   * Loading lazy a video/source in an element
   * @param {Node} el element to lazy load a video/source
   */
  var lazyLoadVideoHTML = function( el ) {
    if ( el ) {
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
      // handling loader icon
      var loader = el.nextElementSibling.querySelector('.loader');
      if ( loader ) {
        el.addEventListener('play', function() {
          loader.className = loader.className.replace('loader--view','').trim();
        }, {once: true});
      }
    }
  }

  var handleIntersectionObserver = function()
  {
    if ('1' === _plugin_frontend_settings.fast_load )
    {
      if ("IntersectionObserver" in window) {
        // observer sections
        var sections = [].slice.call(document.querySelectorAll('.rexpansive_section'));
  
        var scrollobserverSection = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if(entry.isIntersecting) {
              // check images background
              var imgWrapper = entry.target;
              lazyLoadBkgrImg( imgWrapper );
  
              // check video background
              var videoWrapper = entry.target.querySelector('.rex-video-container');
              lazyLoadVideoHTML( videoWrapper );
  
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
  
        var scrollobserverBlock = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if(entry.isIntersecting) {
              // check images background
              var imgWrapper = entry.target.querySelector('.rex-image-wrapper');
              lazyLoadBkgrImg( imgWrapper );
  
              // check video background
              var videoWrapper = entry.target.querySelector('.rex-video-container');
              lazyLoadVideoHTML( videoWrapper );
  
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
   * Wait dom load to subscribe the elements to the intersection observer
   */
  document.addEventListener('DOMContentLoaded', handleIntersectionObserver);
}());