class LazyVideoLoader {
  constructor() {
    this.videos = [].slice.call(document.querySelectorAll('.hero__bgvideo'));

    // Abort when:
    //  - The browser does not support Promises.
    //  - There no videos.
    //  - If the user prefers reduced motion.
    //  - Device is mobile.
    if (
      typeof Promise === 'undefined'
      || !this.videos
      || window.matchMedia('(prefers-reduced-motion)').matches
      // || window.innerWidth < 992
    ) {
      return;
    }

    this.videos.forEach(this.loadVideo.bind(this));
  }

  loadVideo(video) {
    this.setSource(video);

    video.load();

    this.checkLoadTime(video);
  }

  /**
   * Find the children of the video that are <source> tags.
   * Set the src attribute for each <source> based on the
   * data-src attribute.
   *
   * @param {object} video The video element.
   * @returns {void}
   */
  setSource(video) {
    const children = [].slice.call(video.children);
    children.forEach((child) => {
      if (
        child.tagName === 'SOURCE' &&
        typeof child.dataset.src !== 'undefined'
      ) {
        child.setAttribute('src', child.dataset.src);
      }
    });
  }

  /**
   * Checks if the video will be able to play through before
   * a predetermined time has passed.
   * @param {object} video The video element.
   * @returns {void}
   */
  checkLoadTime(video) {
    // Create a promise that resolves when the
    // video.canplaythrough event triggers.
    const videoLoad = new Promise((resolve) => {
      video.addEventListener('canplaythrough', () => {
        resolve('can play');
      });
    });

    // Create a promise that resolves after a
    // predetermined time (2sec)
    const videoTimeout = new Promise((resolve) => {
      setTimeout(() => {
        resolve('The video timed out.');
      }, 20000);
    });

    // Race the promises to see which one resolves first.
    Promise.race([videoLoad, videoTimeout]).then((data) => {
      console.log(data);
      if (data === 'can play') {
        video.play();
        setTimeout(() => {
          video.classList.add('video-loaded');
        }, 500);
      }
      else {
        this.cancelLoad(video);
      }
    });
  }

  /**
   * Cancel the video loading by removing all
   * <source> tags and then triggering video.load().
   *
   * @param {object} video The video element.
   * @returns {void}
   */
  cancelLoad(video) {
    const children = [].slice.call(video.children);
    children.forEach((child) => {
      if (
        child.tagName === 'SOURCE' &&
        typeof child.dataset.src !== 'undefined'
      ) {
        child.parentNode.removeChild(child);
      }
    });

    // reload the video without <source> tags so it
    // stops downloading.
    video.load();
  }
}

new LazyVideoLoader();
