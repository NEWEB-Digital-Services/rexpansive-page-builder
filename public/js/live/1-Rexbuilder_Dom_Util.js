var Rexbuilder_Dom_Util = (function($) {
  "use strict";

  var _updateSlider = function(data) {
    var $textWrap = data.textWrap;
    var numberSliderToActive = data.sliderNumberToActive;
    var $sliderToDestroy = $textWrap.children( '.rex-slider-wrap:not([data-rex-slider-number="' + data.sliderNumberToActive + '"])' );

    $sliderToDestroy
      .each(function(i, slider) {
        var $slider = $(slider);
        slider.style.display = 'none';
        slider.setAttribute('data-rex-slider-active', false);
        RexSlider.destroySliderPlugins($slider);
      });

    var $sliderToActive = $textWrap.children( '.rex-slider-wrap[data-rex-slider-number="' + numberSliderToActive + '"]' );
    if ($sliderToActive.length == 0) {
      var newSliderData = data.newSliderData;
      if (typeof newSliderData != "undefined") {
        var $elem = $textWrap.parents(".grid-stack-item");
        Rexbuilder_CreateBlocks.createSlider(
          data.newSliderData,
          $elem,
          numberSliderToActive
        );
      }
    } else {
      var sliderToActive = $sliderToActive[0];
      sliderToActive.style.display = '';
      RexSlider.initSlider($sliderToActive);
    }
  };

  /**
   * Update a slider on the live builder with new slide and settings
   * @param {Object} data Slider data settings
   */
  var _updateSliderStack = function(data) {
    var $section;

    if (data.target.modelNumber != "") {
      $section = Rexbuilder_Util.$rexContainer.find(
        'section[data-rexlive-section-id="' +
          data.target.sectionID +
          '"][data-rexlive-model-number="' +
          data.target.modelNumber +
          '"]'
      );
    } else {
      $section = Rexbuilder_Util.$rexContainer.find(
        'section[data-rexlive-section-id="' + data.target.sectionID + '"]'
      );
    }

    var $elem = $section.find(
      'div [data-rexbuilder-block-id="' + data.target.rexID + '"]'
    );
    var $textWrap = $elem.find(".text-wrap");
    var $sliderObj = $textWrap.find(
      '.rex-slider-wrap[data-rex-slider-number="' +
        data.target.sliderNumber +
        '"]'
    );

    var reverseData = {
      textWrap: $textWrap,
      sliderNumberToActive: parseInt($sliderObj.attr("data-rex-slider-number"))
    };

    Rexbuilder_Dom_Util.lastSliderNumber = Rexbuilder_Dom_Util.lastSliderNumber + 1;

    var actionData = {
      textWrap: $textWrap,
      sliderNumberToActive: Rexbuilder_Dom_Util.lastSliderNumber,
      newSliderData: data
    };

    _updateSlider(actionData);

    Rexbuilder_Util_Editor.pushAction(
      $section,
      "updateSlider",
      actionData,
      reverseData
    );
  };

  var _updateRow = function( $section, $sectionData, $galleryElement, rowSettings ) {
    var grid_gutter = parseInt(rowSettings.gutter);
    var grid_separator_top = parseInt(rowSettings.top);
    var grid_separator_right = parseInt(rowSettings.right);
    var grid_separator_bottom = parseInt(rowSettings.bottom);
    var grid_separator_left = parseInt(rowSettings.left);

    var defaultGutter = 20;
    var row_distances = {
      gutter: isNaN(grid_gutter) ? defaultGutter : grid_gutter,
      top: isNaN(grid_separator_top) ? defaultGutter : grid_separator_top,
      right: isNaN(grid_separator_right) ? defaultGutter : grid_separator_right,
      bottom: isNaN(grid_separator_bottom)
        ? defaultGutter
        : grid_separator_bottom,
      left: isNaN(grid_separator_left) ? defaultGutter : grid_separator_left
    };

    var gutter = row_distances.gutter,
      separatorTop = row_distances.top,
      separatorRight = row_distances.right,
      separatorBottom = row_distances.bottom,
      separatorLeft = row_distances.left,
      layout =
        typeof rowSettings.layout === "undefined"
          ? "fixed"
          : rowSettings.layout,
      fullHeight =
        typeof rowSettings.full_height === "undefined" || layout == "masonry"
          ? false
          : rowSettings.full_height,
      sectionWidth =
        typeof rowSettings.section_width === "undefined"
          ? "100%"
          : "" + rowSettings.section_width,
      widthType =
        typeof rowSettings.dimension === "undefined"
          ? "full"
          : rowSettings.dimension,
      collapseElements = Rexbuilder_Util.editorMode
        ? false
        : rowSettings.collapse_grid,
      $galleryParent = $galleryElement.parent();

    var galleryParent = $galleryParent[0];

    if (widthType == "full") {
      $galleryParent.removeClass("center-disposition");
      $galleryParent.addClass("full-disposition");
      // $galleryParent.css("max-width", "100%");
      galleryParent.style.maxWidth = '100%';
    } else {
      $galleryParent.removeClass("full-disposition");
      $galleryParent.addClass("center-disposition");
      // $galleryParent.css("max-width", sectionWidth);
      galleryParent.style.maxWidth = sectionWidth;
    }

    $galleryElement.attr("data-separator", gutter);
    $galleryElement.attr("data-row-separator-top", separatorTop);
    $galleryElement.attr("data-row-separator-right", separatorRight);
    $galleryElement.attr("data-row-separator-bottom", separatorBottom);
    $galleryElement.attr("data-row-separator-left", separatorLeft);
    $galleryElement.attr("data-layout", layout);
    $galleryElement.attr("data-full-height", fullHeight);

    $sectionData.attr("data-section_width", sectionWidth);
    $sectionData.attr("data-dimension", widthType);
    $sectionData.attr('data-no-mobile-layout', rowSettings.noMobileLayoutSaved);
    $sectionData.attr("data-responsive_collapse", collapseElements);

    $section.attr("data-rex-collapse-grid", collapseElements);

    var galleryData = $galleryElement.data();
    if (galleryData !== undefined) {
      var galleryEditorInstance = galleryData.plugin_perfectGridGalleryEditor;
      if (galleryEditorInstance !== undefined) {
        galleryEditorInstance.updateGridSettingsChangeLayout(rowSettings);
      }
    }

    // update row tools: layout, layout and collapse
    if ( Rexbuilder_Util.editorMode )
    {
      Rexbuilder_Section_Editor.updateSectionDimensionTool( $section, rowSettings );
      Rexbuilder_Section_Editor.updateSectionLayoutTool( $section, rowSettings ); 
    }
  };

  var _updateImageBG = function($target, data) {
    if ($target.hasClass("rexpansive_section")) {
      var $sectionData = $target.children(".section-data");
      if (data.idImage == "" || data.active.toString() != "true") {
        _resetImageSection($target, $sectionData);
        if ( ! Rexbuilder_Util.editorMode ) {
          $target.removeClass('section-w-image');
        }
      } else {
        _updateImageSection($target, $sectionData, data);
        if ( ! Rexbuilder_Util.editorMode ) {
          $target.addClass('section-w-image');
        }
      }
    } else if ($target.hasClass("grid-item-content")) {
      var $elem = $target.parents(".grid-stack-item");
      var $elemData = $elem.children(".rexbuilder-block-data");
      if (data.idImage == "" || data.active.toString() != "true") {
        _resetImageBlock($target, $elemData, data);
        if ( ! Rexbuilder_Util.editorMode ) {
          $elem.removeClass('block-w-image');
        }
      } else {
        if ( ! Rexbuilder_Util.editorMode ) {
          $elem.addClass('block-w-image');
        }
        _updateImageBlock($target, $elemData, data);
      }
    }
  };

  var _updateImageSection = function($section, $sectionData, data) {
    if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
      Rexbuilder_Section_Editor.updateRowBackgroundImageTool($section,data);
    }
    if ( data.idImage == parseInt( $sectionData.attr( "data-id_image_bg_section" ) ) ) {
      //same image
      return;
    }
    var section = $section[0];

    if ( ! Rexbuilder_Util.editorMode ) {
      section.setAttribute('data-src', data.urlImage)
    } else {
      section.style.backgroundImage = "url(" + data.urlImage + ")";
    }

    // $section.css("background-image", "url(" + data.urlImage + ")");
    section.setAttribute("data-background_image_width", data.width);
    section.setAttribute("data-background_image_height", data.height);
    $sectionData.attr("data-image_size", data.image_size);
    $sectionData.attr("data-id_image_bg_section", data.idImage);
    $sectionData.attr("data-image_bg_section", data.urlImage);
    $sectionData.attr("data-image_bg_section_active", data.active);

    // Rexbuilder_Util_Editor.activeAddSection( $section );
  };

  var _updateBlockPhotoswipe = function( data ) {
    var $elemData = data.$elem.children('.rexbuilder-block-data');
    $elemData.attr("data-photoswipe", data.photoswipe);
  };

  var _updateImageBlock = function($itemContent, $elemData, data) {
    $elemData.attr("data-id_image_bg_block", data.idImage);
    $elemData.attr("data-type_bg_block", data.typeBGimage);
    $elemData.attr("data-image_bg_block", data.urlImage);
		$elemData.attr("data-image_size", data.sizeImage);
		// $elemData.attr("data-photoswipe", data.photoswipe);
    $elemData.attr("data-image_bg_elem_active", data.active);

    if (data.typeBGimage == 'full') {
			_addImageFullBgBlock($itemContent, data);
		} else if (data.typeBGimage == 'natural') {
			_addImageNaturalBgBlock($itemContent, data);
		}

    $itemContent.attr("data-background_image_width", data.width);
    $itemContent.attr("data-background_image_height", data.height);

    if( 'undefined' !== typeof Rexbuilder_Block_Editor ) {
      Rexbuilder_Block_Editor.updateBlockBackgroundImageTool($itemContent, data);
      Rexbuilder_Block_Editor.updateBlockImagePositionTool($itemContent, data);
		}
	};
	
  var _addImageNaturalBgBlock = function($itemContent, data) {
    var $imageDiv = $itemContent.find(".rex-image-wrapper");
    var $overlayDiv = $itemContent.find(".responsive-block-overlay");
    if ($imageDiv.length == 0) {
      var el = document.createElement("div");
      $imageDiv = $(el);
      $imageDiv.addClass("rex-image-wrapper");
      $imageDiv.prependTo($overlayDiv[0]);
    } else if ($imageDiv.hasClass("full-image-background")) {
      $imageDiv.detach().prependTo($overlayDiv[0]);
      $imageDiv.removeClass("full-image-background");
    }

    var imageDiv = $imageDiv[0];

    $imageDiv.addClass("natural-image-background");
    if ( Rexbuilder_Util.editorMode ) {
      imageDiv.style.backgroundImage = "url(" + data.urlImage + ")";
		} else {
      imageDiv.setAttribute('data-src', data.urlImage);
    }
    // $imageDiv.css("background-image", "url(" + data.urlImage + ")");
    var $elem = $itemContent.parents(".grid-stack-item");
    var elem = $elem[0];
    if ( elem ) {
      if ( elem.offsetWidth < data.width) {
        $imageDiv.addClass("small-width");
      } else {
        $imageDiv.removeClass("small-width");
      }
		}
  };

  var _removeImageBlock = function($itemContent) {
    var $imageDiv = $itemContent.find(".rex-image-wrapper");
    if ($imageDiv.length != 0) {
      $imageDiv.remove();
    }
  };

  var _addImageFullBgBlock = function($itemContent, data) {
    var $imageDiv = $itemContent.find(".rex-image-wrapper");
    // var $dragHandle = $itemContent.children(".rexlive-block-drag-handle");
    var $overlayBlock = $itemContent.find('.responsive-block-overlay');

    if ( $imageDiv.length == 0 ) {
      var el = document.createElement("div");
      $imageDiv = $(el);
      $imageDiv.addClass("rex-image-wrapper");
      $imageDiv.insertBefore($overlayBlock[0]);
    } else if ($imageDiv.hasClass("natural-image-background")) {
      $imageDiv.detach().insertBefore($overlayBlock[0]);
      $imageDiv.removeClass("natural-image-background");
      $imageDiv.removeClass("small-width");
    }

    var imageDiv = $imageDiv[0];

    $imageDiv.addClass("full-image-background");
    if ( ! Rexbuilder_Util.editorMode ) {
      imageDiv.setAttribute('data-src', data.urlImage);
    } else {
      imageDiv.style.backgroundImage = "url(" + data.urlImage + ")";
    }
  };

  var _resetImageSection = function($section, $sectionData) {
    var section = $section[0];
    $sectionData.attr("data-image_bg_section", "");
    $sectionData.attr("data-id_image_bg_section", "");
    $sectionData.data("data-image_size", "");
    section.setAttribute( "data-background_image_width", "" );
    section.setAttribute( "data-background_image_height", "" );
    section.style.backgroundImage = '';

    if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
      Rexbuilder_Section_Editor.resetRowBackgroundImageTool( $section );
    }
  };

  var _resetImageBlock = function($itemContent, $elemData, data) {
    $elemData.attr("data-id_image_bg_block", "");
    $elemData.attr("data-type_bg_block", "");
    $elemData.attr("data-image_bg_block", "");
    $elemData.attr("data-image_size", "");
    if ( $itemContent.parents('.grid-stack-item').hasClass('block-has-slider') )
    {
      $elemData.attr("data-photoswipe", data.photoswipe);
    } else {
      $elemData.attr("data-photoswipe", "");
    }
    $elemData.attr("data-image_bg_elem_active", "");
    _removeImageBlock($itemContent);
    $itemContent.attr("data-background_image_width", "");
    $itemContent.attr("data-background_image_height", "");
  };

  var _removeYoutubeVideo = function($target, removeFromDom) {
    var $ytpWrapper = $target.children(".rex-youtube-wrap");
    var $toggleAudio = $target.children(".rex-video-toggle-audio");
    if ($ytpWrapper.length != 0) {
      removeFromDom =
        typeof removeFromDom == "undefined" ? true : removeFromDom;
      $target.removeClass("youtube-player");
      if (removeFromDom) {
        if ($ytpWrapper.YTPGetPlayer() !== undefined) {
          $ytpWrapper.YTPPlayerDestroy();
        }
        $ytpWrapper.remove();
        if ($toggleAudio.length != 0) {
          $toggleAudio.remove();
        }
      } else {
        var videoID;

        if ($ytpWrapper.YTPGetPlayer() !== undefined) {
          videoID = $ytpWrapper.YTPGetVideoID();
          $ytpWrapper.YTPPlayerDestroy();
        } else {
          var elemData = jQuery.extend(
            true,
            {},
            eval("(" + $ytpWrapper.attr("data-property") + ")")
          );
          videoID = elemData.videoURL;
        }

        var wasSlide = $ytpWrapper.parents(".rex-slider-element").length != 0;
        var hadAudio = $toggleAudio.length != 0;

        if (wasSlide) {
          hadAudio =
            $ytpWrapper.children(".rex-video-toggle-audio").length != 0;
        }

        $ytpWrapper.remove();

        tmpl.arg = "video";
        // $target.prepend(
        //   tmpl("tmpl-video-youtube", { url: videoID, audio: false })
        // );
        $target.prepend('<div class="rex-youtube-wrap" data-property="{videoURL:\'' + videoID + '\',containment:\'self\',startAt:0,mute:' + false + ',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}"></div>');

        if (hadAudio && wasSlide) {
          // var $toggle = $(tmpl("tmpl-video-toggle-audio"));
          var $toggle = $('<div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div>');
          $toggle.addClass("removing-toggle-audio");
          $toggle.appendTo($target.children(".rex-youtube-wrap")[0]);
        }
      }
    }
  };

  var _removeVimeoVideo = function($target, removeFromDom) {
    var $vimeoWrap = $target.children(".rex-video-vimeo-wrap");
    var $toggleAudio = $target.children(".rex-video-toggle-audio");

    if ($vimeoWrap.length != 0) {
      var iframeVimeo = $vimeoWrap.children("iframe")[0];
      removeFromDom =
        typeof removeFromDom == "undefined" ? true : removeFromDom;
      $target.removeClass("vimeo-player");

      if (removeFromDom) {
        VimeoVideo.removePlayer(iframeVimeo);
        $vimeoWrap.remove();
        if ($toggleAudio.length != 0) {
          $toggleAudio.remove();
        }
      } else {
        var player = VimeoVideo.findVideo(iframeVimeo);
        if ( player ) {
          player.unload()
        }
        // VimeoVideo.findVideo(iframeVimeo).unload();
        if ($toggleAudio.length != 0) {
          $toggleAudio.addClass("removing-toggle-audio");
        }
      }
    }
  };

  var _removeMp4Video = function($target, removeFromDom) {
		var $videoWrap = $target.children(".rex-video-wrap");
    var $toggleAudio = $target.children(".rex-video-toggle-audio");
    if ($videoWrap.length != 0) {
      removeFromDom =
        typeof removeFromDom == "undefined" ? true : removeFromDom;
      var videoEl = $videoWrap.find("video")[0];
      videoEl.pause();
      videoEl.currentTime = 0;
      $target.removeClass("mp4-player");
      if (removeFromDom) {
        $videoWrap.remove();
        if ($toggleAudio.length != 0) {
          $toggleAudio.remove();
        }
      } else {
        $videoWrap.addClass("removing-video-mp4");
        if ($toggleAudio.length != 0) {
          $toggleAudio.addClass("removing-toggle-audio");
        }
      }
    }
  };

  /**
   * Add a mp4 video to a rexpansive-builder object (section or block)
   * @param {jQuery Object} $target destination in which insert a video, section or block
   * @param {Object} mp4Data mp4 video data
   * @param {Boolean} hasAudio the video has audio?
   * @since 2.0.0
   * @edit  01-02-2019  Check if the user is in live or front area, to append correctly the video wrap
   */
  var _addMp4Video = function($target, mp4Data, hasAudio) {
    var $videoWrap = $target.children(".rex-video-wrap");
    var $toggleAudio = $target.children(".rex-video-toggle-audio");

    var tempSrc = $videoWrap.find("source");
		var tempSrcUrl = ( ! Rexbuilder_Util.editorMode ? tempSrc.attr('data-src') : tempSrc.attr('src') );
		
		
    if ( ($videoWrap.length != 0 && tempSrcUrl != mp4Data.linkMp4) || $videoWrap.length == 0 ) {
			_removeMp4Video($target, true);
			
      $target.addClass("mp4-player");
			tmpl.arg = "video";

      var mp4Tmpl = '<div class="rex-video-wrap" data-rex-video-width="' + mp4Data.width + '" data-rex-video-height="' + mp4Data.height + '"><video width="' + mp4Data.width + '" height="' + mp4Data.height + '" class="rex-video-container" preload autoplay loop muted><source type="video/mp4" src="' + mp4Data.linkMp4 + '"></video></div>';

      if ($target.is("section")) {
        var insert_after = "";
        if ( Rexbuilder_Util.editorMode )
        {
          insert_after = ".section-toolBox";
        } 
        else
        {
          insert_after = ".section-data";
        }
        $target
          .children(insert_after)
          .after(mp4Tmpl);
      } else {
        var $dragHandle = $target.find(".rexlive-block-drag-handle");

        if ($dragHandle.length == 0) {
          $target.prepend(mp4Tmpl);
        } else {
          $dragHandle.after(mp4Tmpl);
        }
      }
    } else if ($videoWrap.length != 0) {
      $videoWrap.removeClass("removing-video-mp4");
      if ( Rexbuilder_Util.editorMode ) {
        $videoWrap.find("video")[0].play();
      }
    }

    if ($toggleAudio.length == 0) {
      if (hasAudio) {
        // $target.append(tmpl("tmpl-video-toggle-audio"));
        $target.append('<div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div>');
      }
    } else {
      if (hasAudio) {
        $toggleAudio.removeClass("removing-toggle-audio");
      } else {
        $toggleAudio.remove();
      }
    }
  };

  var fixVideoProportion = function(el) {
    var video = Array.prototype.slice.call( el.getElementsByClassName('rex-video-wrap') );
    var i, tot_video = video.length;
    for ( i=0; i<tot_video; i++ ) {
      video[i].children[0].style.maxWidth = _findVideoMaxWidth(video[i]);
    }
  }

  var _findVideoMaxWidth = function(el) {
    var c_w, c_h, v_w, v_h;
    v_w = el.getAttribute('data-rex-video-width');
    v_h = el.getAttribute('data-rex-video-height');
		var maxWidth = '100%';
		
    c_w = el.offsetWidth;
    c_h = el.offsetHeight;
	
    if ( ( v_w / v_h ) > ( c_w / c_h ) ) {
      maxWidth =  ( ( ( c_h * v_w ) / v_h ) * 100 ) / c_w;
      maxWidth = maxWidth + '%';
    }

    return maxWidth;
  };

  var _addYoutubeVideo = function($target, urlYoutube, hasAudio) {
    var $ytpWrapper = $target.children(".rex-youtube-wrap");
    var $toggleAudio = $target.children(".rex-video-toggle-audio");
    if ($ytpWrapper.length != 0) {
      var elemData = jQuery.extend(
        true,
        {},
        eval("(" + $ytpWrapper.attr("data-property") + ")")
      );
      var activeUrl = elemData.videoURL;

      var videoID = Rexbuilder_Util.getYoutubeID(activeUrl);
      var urlID = Rexbuilder_Util.getYoutubeID(urlYoutube);

      if (videoID != urlID) {
        if ($ytpWrapper.YTPGetPlayer() === undefined) {
          $ytpWrapper.attr(
            "data-property",
            "{videoURL:'" +
              urlYoutube +
              "',containment:'self',startAt:0,mute:'" +
              !hasAudio +
              "',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}"
          );
          $ytpWrapper.addClass("youtube-player-launching");
          $ytpWrapper.YTPlayer();
        } else {
          _removeYoutubeVideo($target, true);

          //waiting to youtube plugin dead
          setTimeout(
            function() {
              tmpl.arg = "video";
              // $target.prepend(
              //   tmpl("tmpl-video-youtube", {
              //     url: urlYoutube,
              //     audio: !hasAudio
              //   })
              // );
              $target.prepend('<div class="rex-youtube-wrap" data-property="{videoURL:\'' + urlYoutube + '\',containment:\'self\',startAt:0,mute:' + !hasAudio + ',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}"></div>');

              $target.children(".rex-youtube-wrap").YTPlayer();
              var $toggleAudio = $target.children(".rex-video-toggle-audio");
              if ($toggleAudio.length == 0) {
                if (hasAudio) {
                  // $target.append(tmpl("tmpl-video-toggle-audio"));
                  $target.append('<div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div>');
                }
              } else {
                if (hasAudio) {
                  $toggleAudio.removeClass("removing-toggle-audio");
                } else {
                  $toggleAudio.remove();
                }
              }
            },
            1000,
            $target,
            urlYoutube,
            hasAudio
          );
        }
      } else {
        if ($ytpWrapper.YTPGetPlayer() === undefined) {
          $ytpWrapper.addClass("youtube-player-launching");
          $ytpWrapper.YTPlayer();
        }
      }
    } else {
      tmpl.arg = "video";
      // $target.prepend(
      //   tmpl("tmpl-video-youtube", { url: urlYoutube, audio: !hasAudio })
      // );
      $target.prepend('<div class="rex-youtube-wrap" data-property="{videoURL:\'' + urlYoutube + '\',containment:\'self\',startAt:0,mute:' + !hasAudio + ',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}"></div>');
      $target.children(".rex-youtube-wrap").YTPlayer();
    }

    $target.addClass("youtube-player");
    if ($toggleAudio.length == 0) {
      if (hasAudio) {
        // $target.append(tmpl("tmpl-video-toggle-audio"));
        $target.append('<div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div>');
      }
    } else {
      if (hasAudio) {
        $toggleAudio.removeClass("removing-toggle-audio");
      } else {
        $toggleAudio.remove();
      }
    }
  };

  var _addVimeoVideo = function($target, urlVimeo, hasAudio) {
    var $vimeoWrap = $target.children(".rex-video-vimeo-wrap");
    var $toggleAudio = $target.children(".rex-video-toggle-audio");
    $target.addClass("vimeo-player");
    if (urlVimeo == "") {
      _removeVimeoVideo($target, true);
    } else {
      if (
        ($vimeoWrap.length != 0 &&
          $vimeoWrap
            .children("iframe")
            .attr("src")
            .split("?")[0] != urlVimeo) ||
        $vimeoWrap.length == 0
      ) {
        _removeVimeoVideo($target, true);
        tmpl.arg = "video";
        urlVimeo +=
          "?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0&muted=" +
          (hasAudio.toString() == "true" ? "0" : "1") +
          "&background=1";
        // $target.prepend(tmpl("tmpl-video-vimeo", { url: urlVimeo }));
        $target.prepend('<div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block"><iframe src="' + urlVimeo + '" width="640" height="360" frameborder="0" allow="autoplay"  webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
        var vimeoFrame = $target
          .children(".rex-video-vimeo-wrap")
          .find("iframe")[0];
        VimeoVideo.addPlayer("1", vimeoFrame);
      } else if ($vimeoWrap.length != 0) {
        var vimeoPlugin = VimeoVideo.findVideo($vimeoWrap.find("iframe")[0]);
        if (vimeoPlugin != null) {
          vimeoPlugin.play();
        }
      }
    }
    if ($toggleAudio.length == 0) {
      if (hasAudio) {
        // $target.append(tmpl("tmpl-video-toggle-audio"));
        $target.append('<div class="rex-video-toggle-audio"><div class="rex-video-toggle-audio-shadow"></div></div>');
      }
    } else {
      if (hasAudio) {
        $toggleAudio.removeClass("removing-toggle-audio");
      } else {
        $toggleAudio.remove();
      }
    }
  };

  var _updateVideos = function($target, videoOptions) {
    var targetType = "";
    if ($target.hasClass("rexpansive_section")) {
      var $sectionData = $target.children(".section-data");
      targetType = "section";
    } else if ($target.hasClass("grid-item-content")) {
      var $el = $target.parents(".grid-stack-item")
      var $elemData = $el.children(".rexbuilder-block-data");
      targetType = "block";
    } else if ($target.hasClass("rex-slider-video-wrapper")) {
      targetType = "slide";
    } else {
      return;
    }
    
    var type = videoOptions.typeVideo;
    if (type == "") {
      _removeMp4Video($target, true);
      _removeYoutubeVideo($target, true);
      _removeVimeoVideo($target, true);
    } else if (type == "mp4") {
      _removeYoutubeVideo($target, true);
      _removeVimeoVideo($target, true);
      _addMp4Video($target, videoOptions.mp4Data, videoOptions.audio);
    } else if (type == "vimeo") {
      _removeYoutubeVideo($target, true);
      _removeMp4Video($target, true);
      _addVimeoVideo($target, videoOptions.vimeoUrl, videoOptions.audio);
    } else if (type == "youtube") {
      _removeVimeoVideo($target, true);
      _removeMp4Video($target, true);
      _addYoutubeVideo($target, videoOptions.youtubeUrl, videoOptions.audio);
    }

    if (targetType == "section") {
      $sectionData.attr("data-video_mp4_url", videoOptions.mp4Data.linkMp4);
      $sectionData.attr("data-video_bg_id_section", videoOptions.mp4Data.idMp4);
      $sectionData.attr("data-video_bg_width_section", videoOptions.mp4Data.width);
      $sectionData.attr("data-video_bg_height_section", videoOptions.mp4Data.height);
      $sectionData.attr("data-video_bg_url_section", videoOptions.youtubeUrl);
      $sectionData.attr("data-video_bg_url_vimeo_section",videoOptions.vimeoUrl);
      if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
        Rexbuilder_Section_Editor.updateRowBackgroundVideo( $target, videoOptions );
      }
      // Rexbuilder_Util_Editor.activeAddSection( $target );
      if (type == "mp4") {
        $target.addClass('section-w-html-video');
      } else {
        $target.removeClass('section-w-html-video');
      }
    } else if (targetType == "block") {
      $elemData.attr("data-video_mp4_url", videoOptions.mp4Data.linkMp4);
      $elemData.attr("data-video_bg_id", videoOptions.mp4Data.idMp4);
      $elemData.attr("data-video_bg_width", videoOptions.mp4Data.width);
      $elemData.attr("data-video_bg_height", videoOptions.mp4Data.height);
      $elemData.attr("data-video_bg_url", videoOptions.youtubeUrl);
      $elemData.attr("data-video_bg_url_vimeo", videoOptions.vimeoUrl);
      $elemData.attr("data-video_has_audio", videoOptions.audio);
      if (type == "mp4") {
        $el.addClass('block-w-html-video');
      } else {
        $el.removeClass('block-w-html-video');
      }
    } else if (targetType == "slide") {
    }
  };

  var _updateBlockPaddings = function($elem, paddings) {
    var $elData = $elem.children(".rexbuilder-block-data");
    $elData.attr( "data-block_padding", Rexbuilder_Util.paddingsToString(paddings) );
    var $textWrap = $elem.find(".text-wrap");
    if ($textWrap.length != 0) {
      var textWrap = $textWrap[0];
      textWrap.style.paddingTop = "" + paddings.top + paddings.type;
      textWrap.style.paddingRight = "" + paddings.right + paddings.type;
      textWrap.style.paddingBottom = "" + paddings.bottom + paddings.type;
      textWrap.style.paddingLeft = "" + paddings.left + paddings.type;
    }
  };

  var _updateBlocksLayout = function( dataToUse ) {
    var blocksDimensions = dataToUse.blocks;
    var i;
    var x, y, w, h;
    var elem;
    var gridstack = dataToUse.gridstackInstance;
    if (blocksDimensions.length > 0) {
      var $section = $(dataToUse.blocks[0].elem).parents(".rexpansive_section");
      if (!Rexbuilder_Util_Editor.updatingGridstack) {
        if ( gridstack.grid ) {
          gridstack.batchUpdate();
        }
      }
      for (i = 0; i < blocksDimensions.length; i++) {
        x = blocksDimensions[i].x;
        y = blocksDimensions[i].y;
        w = blocksDimensions[i].w;
        h = blocksDimensions[i].h;
        elem = blocksDimensions[i].elem;
        gridstack.update(elem, x, y, w, h);
      }
      if (!Rexbuilder_Util_Editor.updatingGridstack) {
        if ( gridstack.grid ) {
          gridstack.commit();
        }
      }

      setTimeout( Rexbuilder_Util.fixYoutube.bind( null, $section[0] ), 1500 );
    }
  };

  var _collapseGrid = function( gridInstance, collapse, blockDisposition, layout ) {
    Rexbuilder_Util_Editor.updatingCollapsedGrid = true;
    if (collapse) {
      gridInstance.collapseElementsProperties();
    } else {
      gridInstance.removeCollapseElementsProperties();
    }
    gridInstance.updateGridLayoutCollapse(layout);
    _updateBlocksLayout(blockDisposition);
    setTimeout(function() {
      Rexbuilder_Util_Editor.updatingCollapsedGrid = false;
      gridInstance._fixImagesDimension();
      gridInstance._createFirstReverseStack();
      if ( Rexbuilder_Util.editorMode ) {
        gridInstance._updateElementsSizeViewers();
      }
    }, 200);
  };

  var _updateRemovingBlock = function(
    $elem,
    hasToBeRemoved,
    galleryEditorInstance
  ) {
    if (hasToBeRemoved) {
      galleryEditorInstance.removeBlock($elem.get(0));
      Rexbuilder_Util.stopBlockVideos($elem);
    } else {
      galleryEditorInstance.reAddBlock($elem);
      Rexbuilder_Util.playBlockVideos($elem);
    }

    if (galleryEditorInstance.properties.numberBlocksVisibileOnGrid == 0) {
      $elem.parents(".rexpansive_section").addClass("empty-section");
    } else {
      var $section = $elem.parents(".rexpansive_section");
      $section.removeClass("empty-section");
      // Rexbuilder_Util_Editor.activeAddSection($section);
    }
  };

  var _updateSectionName = function($section, newName) {
    if ( null !== newName ) {
      $section.attr("data-rexlive-section-name", newName);
      if ( '' !== newName ) {
        var newSafeName = newName.replace(/\s/gm, "");
        Rex_Navigator.updateNavigatorItem($section, newSafeName, newName);
      }
    }
  };

  var _updateSectionNavLabel = function($section, newNavLabel) {
    $section.children('.section-data').attr("data-section_nav_label", newNavLabel);
  };

  /**
   * Reordering the DOM
   * @param  {Array} newOrder     array of sections
   * @param  {bool} domUpdating  @deprecated ?
   * @param  {bool} sectionMoved the section was moved
   * @return {vodi}
   */
  var _fixSectionDomOrder = function(newOrder, domUpdating, sectionMoved) {
    var sections = [];
    var $section, $sec;
    var i, j;
    domUpdating = typeof domUpdating === "undefined" ? false : domUpdating;
    var allSections = [].slice.call( Rexbuilder_Util.rexContainer.getElementsByClassName('rexpansive_section') );
    var z, tot_allSections = allSections.length;

    for( z=0; z < tot_allSections; z++ ) {
      $sec = $(allSections[z]);
      var sectionObj = {
        rexID: allSections[z].getAttribute("data-rexlive-section-id"),
        section_is_model: Rexbuilder_Util.hasClass( allSections[z], "rex-model-section" ),
        section_model_id: allSections[z].getAttribute("data-rexlive-model-id"),
        section_model_number: allSections[z].getAttribute("data-rexlive-model-number"),
        $section: $sec.detach()
      };
      sections.push(sectionObj);
    }

    for (i = 0; i < newOrder.length; i++) {
      for (j = 0; j < sections.length; j++) {
        if (sections[j].rexID == newOrder[i].rexID) {
          if (sections[j].section_is_model) {
            if (sections[j].section_model_number == newOrder[i].modelNumber) {
              $section = sections[j].$section;
              break;
            }
          } else {
            $section = sections[j].$section;
            break;
          }
        }
      }
      Rexbuilder_Util.$rexContainer.append($section);
      sections.splice(j, 1);
    }

    for (j = 0; j < sections.length; j++) {
      Rexbuilder_Util.$rexContainer.append(sections[j].$section);
    }

    if (Rexbuilder_Util.activeLayout == "default") {
      Rexbuilder_Util.updateDefaultLayoutStateDOMOrder(newOrder);
      //fixing custom layouts dom order
      if (typeof sectionMoved !== "undefined") {
        Rexbuilder_Util.updateSectionOrderCustomLayouts(sectionMoved, newOrder);
      }
    }
  };

  /**
   * Add photoswipe to all blocks of a section
   * @param		{jQuery}	$section	section to edit
   * @since		2.0.0
	 * @version	2.0.4			Changed to vanilla js
   */
  function _enablePhotoswipeAllBlocksSection($section) {
		var section = $section.get(0);
		var sectionBlocks = section.querySelectorAll('.grid-stack-item:not(.removing_block)');
		var sectionBlock;
		var tot_sectionBlocks = sectionBlocks.length;

		var blockData;
		var blockHasSlider;
		var blockHasText;
		var blockHasBackgroundImage;

		var i = 0;

		for (; i < tot_sectionBlocks; i++) {
			sectionBlock = sectionBlocks[i];
			blockData = sectionBlock.querySelector('.rexbuilder-block-data');

			blockHasSlider = Rexbuilder_Util.hasClass(sectionBlock, 'block-has-slider');
			blockHasText = 0 !== Rexbuilder_Util_Editor.getTextWrapLength($(sectionBlock));
			blockHasBackgroundImage = '' !== blockData.getAttribute('data-image_bg_block');

			sectionBlock.setAttribute('data-rexlive-element-edited', true);

			if ((blockHasBackgroundImage && !blockHasText) || blockHasSlider) {
				blockData.setAttribute('data-photoswipe', true);
			}
		}
	}

  /**
   * Remove photoswipe from all blocks of a section
   * @param		{jQuery}	$section	section to edit
   * @since		2.0.0
   * @date		16-05-2019
	 * @version	2.0.4		Changed to vanilla js
   */
  function _removePhotoswipeAllBlocksSection($section) {
		var section = $section.get(0);
		var sectionBlocks = section.querySelectorAll('.grid-stack-item:not(.removing_block)');
		var tot_sectionBlocks = sectionBlocks.length;

		var blockData;

		var i = 0;

		for (; i < tot_sectionBlocks; i++) {
			blockData = sectionBlocks[i].querySelector('.rexbuilder-block-data');

			sectionBlocks[i].setAttribute('data-rexlive-element-edited', true);
			blockData.setAttribute('data-photoswipe', false);
		}
	}

  var _updateSectionPhotoswipe = function(elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].$data.attr("data-photoswipe", elements[i].photoswipe);
    }
  };

  /**
   *
   * @param {*} $target target (section or block)
   * @param {*} newClasses array of new classes (strings)
   */
  var _updateCustomClasses = function($target, newClasses) {
    var $targetData;
    var oldClasses = "";

    if ($target.is("section")) {
      $targetData = $target.children(".section-data");
      oldClasses = $targetData.attr("data-custom_classes");
    } else {
      $targetData = $target.children(".rexbuilder-block-data");
      oldClasses = $targetData.attr("data-block_custom_class");
    }

    if (typeof oldClasses == "undefined") {
      oldClasses = "";
    }

    oldClasses = oldClasses.trim();
    var oldClassesList = oldClasses.split(/\s+/);

    //removing oldClasses
    for (var i = 0; i < oldClassesList.length; i++) {
      Rexbuilder_Util_Editor.removeCustomClass(oldClassesList[i], $targetData);
      $target.removeClass(oldClassesList[i]);
    }

    // adding new Classes
    for (var i = 0; i < newClasses.length; i++) {
      Rexbuilder_Util_Editor.addCustomClass(newClasses[i], $targetData);
      $target.addClass(newClasses[i]);
    }
  };

  var _updateBlockUrl = function($elem, url) {
    var $elemData = $elem.children(".rexbuilder-block-data");
    $elemData.attr("data-linkurl", url);
  };

  /**
   * Update block content position
   * @param  {jQuery} $elem        block to edit
   * @param  {Object} flexPosition x and y flex positions
   * @return {vodi}
   */
  var _updateFlexPostition = function($elem, flexPosition) {
    if ( $elem.hasClass("block-has-slider") ) return;
      
    var flexClasses =
      "rex-flex-top rex-flex-middle rex-flex-bottom rex-flex-left rex-flex-center rex-flex-right";
    $elem.removeClass(flexClasses);
    var $elemData = $elem.children(".rexbuilder-block-data");
    $elemData.attr("data-block_flex_position", "");
    if (flexPosition.x != "" && flexPosition.y != "") {
      $elem.addClass("rex-flex-" + flexPosition.x);
      $elem.addClass("rex-flex-" + flexPosition.y);
      $elemData.attr(
        "data-block_flex_position",
        flexPosition.x + " " + flexPosition.y
      );
    }
  };

  /**
   * Update the block image position
   * @param  {jQuery} $elem        block to edit
   * @param  {Object} flexPosition x and y flex positions
   * @return {void}
   */
  var _updateImageFlexPostition = function($elem, flexPosition) {
    if ( $elem.hasClass("block-has-slider") ) return;

    var flexClasses =
      "rex-flex-img-top rex-flex-img-middle rex-flex-img-bottom rex-flex-img-left rex-flex-img-center rex-flex-img-right";
    $elem.removeClass(flexClasses);
    var $elemData = $elem.children(".rexbuilder-block-data");
    $elemData.attr("data-block_flex_img_position", "");
    if (flexPosition.x != "" && flexPosition.y != "") {
      $elem.addClass("rex-flex-img-" + flexPosition.x);
      $elem.addClass("rex-flex-img-" + flexPosition.y);
      $elemData.attr(
        "data-block_flex_img_position",
        flexPosition.x + " " + flexPosition.y
      );
    }
  };

  /**
   * Update inline custom style
   *
   * @since 2.0.0
   * @date 11-07-2019 Rewrite for vanilla JS
   */
  var _updateCustomCSS = function(newCss) {
    // $("#rexpansive-builder-style-inline-css").text(newCss);
    var builderInlineStyleEl = document.getElementById('rexpansive-builder-style-inline-css');
    if ( builderInlineStyleEl ) {
      builderInlineStyleEl.textContent = newCss;
    }
  };

  var _updateSectionVideoBackground = function($section, videoOpt) {
    _updateVideos($section, videoOpt);
  };

  var _updateSectionBackgroundColorLive = function(data, color) {
    var $target;

    if (data.modelNumber != "") {
      $target = Rexbuilder_Util.$rexContainer
        .find(
          'section[data-rexlive-section-id="' +
            data.sectionID +
            '"][data-rexlive-model-number="' +
            data.modelNumber +
            '"]'
        );
      if( -1 !== $target.css("background").indexOf("linear-gradient") ) {
        $target.css("background","");
      }
      $target
        .css("background-color", color);
    } else {
      $target = Rexbuilder_Util.$rexContainer
        .find('section[data-rexlive-section-id="' + data.sectionID + '"]');
      if( -1 !== $target.css("background").indexOf("linear-gradient") ) {
        $target.css("background","");
      }
      $target
        .css("background-color", color);
    }
    
    if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
      Rexbuilder_Section_Editor.updateRowBackgroundColorToolLive( $target, color );
    }
  };

  /**
   * Updating the background color of a row
   * Called at loading of a layout
   * @param {jQuery Object} $section row in which update the background color
   * @param {Object} bgColor object with color background info
   */
  var _updateSectionBackgroundColor = function($section, bgColor) {
    var $sectionData = $section.children(".section-data");
    var section = $section[0];

    if( -1 !== getComputedStyle(section)['background'].indexOf('linear-gradient') ) {
      section.style.background = '';
    }

    section.style.backgroundColor = bgColor.color;
    $sectionData.attr("data-color_bg_section", bgColor.color);
    $sectionData.attr("data-color_bg_section_active", bgColor.active);

    if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
      Rexbuilder_Section_Editor.updateRowBackgroundColorTool( $section, bgColor.color );
    }
    // Rexbuilder_Util_Editor.activeAddSection( $section );
  };

  var _updateSectionBackgroundGradient = function($section, bgColor) {
    var $sectionData = $section.children(".section-data");
    var safeGradient = Rexbuilder_Util_Editor.getGradientSafeValue( bgColor.color );
    var section = $section[0];
    section.style.background = safeGradient;
    // $section.css("background", safeGradient);
    $sectionData.attr("data-color_bg_section", bgColor.color);
    $sectionData.attr("data-color_bg_section_active", bgColor.active);

    if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
      Rexbuilder_Section_Editor.updateRowBackgroundGradientTool( $section, safeGradient );
    }
    // Rexbuilder_Util_Editor.activeAddSection( $section );
  };

  var _updateBlockBackgroundColorLive = function(data, color) {
    var $target;
    var target;
    if (data.modelNumber != "") {
      var section_selector = 'section[data-rexlive-section-id="' +data.sectionID +'"][data-rexlive-model-number="' +data.modelNumber +'"]';
      var block_selector = 'div[data-rexbuilder-block-id="' +data.rexID +'"] .grid-item-content';
      $target = Rexbuilder_Util.$rexContainer
        .find( section_selector )
        .find( block_selector );
      
      target = $target[0];
      if( -1 !== getComputedStyle(target)['background'].indexOf('linear-gradient') ) {
        target.style.background = '';
      }
      target.style.backgroundColor = color;
    } else {
      $target = Rexbuilder_Util.$rexContainer
        .find('section[data-rexlive-section-id="' + data.sectionID + '"]')
        .find(
          'div [data-rexbuilder-block-id="' +
            data.rexID +
            '"] .grid-item-content'
        );

      target = $target[0];
      if( -1 !== getComputedStyle(target)['background'].indexOf('linear-gradient') ) {
        target.style.background = '';
      }
      target.style.backgroundColor = color;
    }

    if( 'undefined' !== typeof Rexbuilder_Block_Editor ) {
      Rexbuilder_Block_Editor.updateBlockBackgroundColorToolLive( $target, color );
    }
    // Rexbuilder_Util_Editor.activeAddSection( $target );
  };

  /**
   * Updating the color of a block
   * @param {Ojbect} data object with the information on which block to update an how
   */
  var _updateBlockBackgroundColor = function(data) {
    var $elem = data.$elem;
    var $itemContent = $elem.find(".grid-item-content");
    var itemContent = $itemContent[0];
    var $elemData = $elem.children(".rexbuilder-block-data");

    if( -1 !== getComputedStyle(itemContent)['background'].indexOf('linear-gradient') ) {
      itemContent.style.background = '';
    }

    itemContent.style.backgroundColor = data.color;
    $elemData.attr("data-color_bg_block", data.color);
    $elemData.attr("data-color_bg_elem_active", data.active);

    if( 'undefined' !== typeof Rexbuilder_Block_Editor ) {
      Rexbuilder_Block_Editor.updateBlockBackgroundColorTool($elem,data.color);
    }
  };

  /**
   * Updating the background gradient of a block
   * @param {Ojbect} data object with the information on which block to update an how
   */
  var _updateBlockBackgroundGradient = function(data) {
    var $elem = data.$elem;
    var $itemContent = $elem.find(".grid-item-content");
    var itemContent = $itemContent[0];
    var $elemData = $elem.children(".rexbuilder-block-data");

    var safeGradient = Rexbuilder_Util_Editor.getGradientSafeValue( data.color );
    // $itemContent.css("background", safeGradient);
    itemContent.style.background = safeGradient;
    $elemData.attr("data-color_bg_block", data.color);
    $elemData.attr("data-color_bg_elem_active", data.active);

    if( 'undefined' !== typeof Rexbuilder_Block_Editor ) {
      Rexbuilder_Block_Editor.updateBlockBackgroundGradientTool($elem,safeGradient);
    }
  };

  var _updateSectionOverlayColorLive = function(data, color) {
    var $target;
    if (data.modelNumber != "") {
      $target = Rexbuilder_Util.$rexContainer
        .find(
          'section[data-rexlive-section-id="' +
            data.sectionID +
            '"][data-rexlive-model-number="' +
            data.modelNumber +
            '"]'
        );
      if( -1 !== $target.children(".responsive-overlay").css("background").indexOf("linear-gradient") ) {
        $target.children(".responsive-overlay").css("background","");
      }
      $target
        .children(".responsive-overlay")
        .css("background-color", color);
    } else {
      $target = Rexbuilder_Util.$rexContainer
        .find('section[data-rexlive-section-id="' + data.sectionID + '"]');
      if( -1 !== $target.children(".responsive-overlay").css("background").indexOf("linear-gradient") ) {
        $target.children(".responsive-overlay").css("background","");
      }
      $target
        .children(".responsive-overlay")
        .css("background-color", color);
    }

    // Set live picker
    if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
      Rexbuilder_Section_Editor.updateRowOverlayColorToolLive( $target, color );
    }
    // Rexbuilder_Util_Editor.activeAddSection( $target );
  };

  var _updateSectionOverlay = function($section, overlay) {
    var $overlayElem = $section.children(".responsive-overlay");
    var overlayElem = $overlayElem[0];
    var $sectionData = $section.children(".section-data");

    if( -1 !== getComputedStyle(overlayElem)['background'].indexOf('linear-gradient') ) {
      overlayElem.style.background = '';
    }
    overlayElem.style.backgroundColor = overlay.color;

    $sectionData.attr("data-row_overlay_color", overlay.color);
    $sectionData.attr("data-row_overlay_active", overlay.active);

    if (overlay.active.toString() == "true") {
      $overlayElem.addClass("rex-active-overlay");
      // Set tools
    } else {
      $overlayElem.removeClass("rex-active-overlay");
    }
    
    if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
      Rexbuilder_Section_Editor.updateRowOverlayColorTool( $section, overlay );
    }
    // Rexbuilder_Util_Editor.activeAddSection( $section );
  };

  var _updateSectionOverlayGradient = function($section, overlay) {
    var $sectionData = $section.children(".section-data");
    var $overlayElem = $section.children(".responsive-overlay");
    var overlayElem = $overlayElem[0];

    var safeGradient = Rexbuilder_Util_Editor.getGradientSafeValue( overlay.color );
    overlayElem.style.background = safeGradient;

    $sectionData.attr("data-row_overlay_color", overlay.color);
    $sectionData.attr("data-row_overlay_active", overlay.active);

    if (overlay.active.toString() == "true") {
      $overlayElem.addClass("rex-active-overlay");
      // Set tools
    } else {
      $overlayElem.removeClass("rex-active-overlay");
    }

    if( 'undefined' !== typeof Rexbuilder_Section_Editor ) {
      Rexbuilder_Section_Editor.updateRowOverlayGradientTool( $section, {
        active: overlay.active,
        color: safeGradient
      } );
    }
    // Rexbuilder_Util_Editor.activeAddSection( $section );
  };

  /**
   * Updating the overlay color visualization on the builder
   * @param {Object} data block info
   * @param {Object} color overlay color info
   */
  var _updateBlockOverlayColorLive = function(data, color) {
		var $target;
    if (data.modelNumber != "") {
      var section_selector = 'section[data-rexlive-section-id="' + data.sectionID + '"][data-rexlive-model-number="' + data.modelNumber + '"]';
      var block_selector = 'div [data-rexbuilder-block-id="' + data.rexID + '"] .responsive-block-overlay';
      $target = Rexbuilder_Util.$rexContainer
        .find( section_selector )
        .find( block_selector );
      if( -1 !== $target.css("background").indexOf("linear-gradient") ) {
        $target.css("background","");
      }
      $target
        .css("background-color", color);
    } else {
      $target = Rexbuilder_Util.$rexContainer
        .find('section[data-rexlive-section-id="' + data.sectionID + '"]')
        .find(
          'div [data-rexbuilder-block-id="' +
            data.rexID +
            '"] .responsive-block-overlay'
				);
				
			var $overlayTargets = Rexbuilder_Util.$rexContainer.find(
				'[data-rexbuilder-block-id="' + data.rexID + '"] .slider-overlay'
			);

      if( -1 !== $target.css("background").indexOf("linear-gradient") ) {
        $target.css("background","");
			}

			$target.css("background-color", color);

			if (0 === $overlayTargets.length) {
				var $sliderElements = Rexbuilder_Util.$rexContainer.find(
					'[data-rexbuilder-block-id="' + data.rexID + '"] .rex-slider-element'
				);

        if( '' !== color ) {
				  $sliderElements.append('<div class="slider-overlay" style="background-color:' + color + '"></div>')
        }
			} else {
				$overlayTargets.css('background-color', color);
			}
    }

    if( 'undefined' !== typeof Rexbuilder_Block_Editor ) {
      Rexbuilder_Block_Editor.updateBlockOverlayColorToolLive( $target, color );
    }
  };

  /**
   * Update the overlay color visualization on the front end
   * @param {Object} data block info data
   */
  var _updateBlockOverlay = function(data) {
    var color = data.color;
    var active = data.active;

		var $elem = data.$elem;
    var $elemData = $elem.children(".rexbuilder-block-data");
    var $elemOverlay = $elem.find(".responsive-block-overlay");
		var elemOverlay = $elemOverlay[0];
		var $sliderOverlays = $elemOverlay.find('.slider-overlay');

    if( -1 !== getComputedStyle(elemOverlay)['background'].indexOf('linear-gradient') ) {
      elemOverlay.style.background = '';
    }
		elemOverlay.style.backgroundColor = color;

		if (0 === $sliderOverlays.length) {
			var $sliderElements = $elem.find('.rex-slider-element');

      if( '' !== color ) {
        $sliderElements.append('<div class="slider-overlay" style="background-color:' + color + '"></div>');
      }
		} else {
			$sliderOverlays.css('background-color', color);
		}

		$elemData.attr("data-overlay_block_color", color);
    $elemData.attr("data-overlay_block_color_active", active);

    if (active.toString() == "true") {
      $elemOverlay.addClass("rex-active-overlay");
    } else {
      $elemOverlay.removeClass("rex-active-overlay");
    }

    if( 'undefined' !== typeof Rexbuilder_Block_Editor ) {
      Rexbuilder_Block_Editor.updateBlockOverlayColorTool( $elem, color );
    }
  };

  /**
   * Updating the overlay gradient of a block
   * @param {Ojbect} data object with the information on which block to update an how
   */
  var _updateBlockOverlayGradient = function(data) {
    var color = data.color;
    var active = data.active;

    var $elem = data.$elem;
    var $elemData = $elem.children(".rexbuilder-block-data");
    var $elemOverlay = $elem.find(".responsive-block-overlay");

    var safeGradient = Rexbuilder_Util_Editor.getGradientSafeValue( data.color );
    var elemOverlay = $elemOverlay[0];
    elemOverlay.style.background = safeGradient;
    // $elemOverlay.css("background", safeGradient);

    $elemData.attr("data-overlay_block_color", color);
    $elemData.attr("data-overlay_block_color_active", active);

    if (active.toString() == "true") {
      $elemOverlay.addClass("rex-active-overlay");
    } else {
      $elemOverlay.removeClass("rex-active-overlay");
    }

    if( 'undefined' !== typeof Rexbuilder_Block_Editor ) {
      Rexbuilder_Block_Editor.updateBlockOverlayGradientTool( $elem, safeGradient );
    }
  };

  var _updateSectionBackgroundImage = function($section, data) {
    _updateImageBG($section, data);
  };

  var _updateSectionVisibility = function( $section, show, layoutsOrder, defaultStateSections ) {
    if (show) {
      if (Rexbuilder_Util.activeLayout == "default") {
        $section.removeClass("removing_section");
        Rexbuilder_Util.addSectionID($section.attr("data-rexlive-section-id"));
      }
      $section.removeClass("rex-hide-section");
      Rexbuilder_Util.playPluginsSection($section);
    } else {
      Rexbuilder_Util.stopPluginsSection($section);
      if (Rexbuilder_Util.activeLayout == "default") {
        $section.addClass("removing_section");
        Rexbuilder_Util.removeSectionID(
          $section.attr("data-rexlive-section-id")
        );
      }
      $section.addClass("rex-hide-section");
    }
    if (typeof layoutsOrder !== "undefined" && layoutsOrder != null) {
      Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);
    }
    if (
      typeof defaultStateSections !== "undefined" &&
      defaultStateSections != null
    ) {
      Rexbuilder_Util.updateDefaultLayoutState({
        pageData: defaultStateSections
      });
    }
  };

  var _updateModelVisibility = function(data) {
    var $sectionToHide = data.$sectionToHide;
    var $sectionToShow = data.$sectionToShow;
    var layoutsOrder = data.layoutsOrder;
    var defaultStateSections = data.defaultStateSections;

    _updateSectionVisibility($sectionToHide, false);
    _updateSectionVisibility($sectionToShow, true);

    if (typeof layoutsOrder !== "undefined" && layoutsOrder != null) {
      Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);
    }

    if (
      typeof defaultStateSections !== "undefined" &&
      defaultStateSections != null
    ) {
      Rexbuilder_Util.updateDefaultLayoutState({
        pageData: defaultStateSections
      });
    }
  };

  var _updateSectionBecameModel = function(data) {
    var $section = data.$section;
    var layoutsOrder = data.layoutsOrder;
    var defaultStateSections = data.defaultStateSections;
    if (data.isModel) {
      $section.addClass("rex-model-section");
      $section.addClass("rexlive-block-grid-editing");
      $section.attr("data-rexlive-model-editing","false");
      if (
        $section
          .find(".grid-stack-row")
          .parent()
          .children(".rexpansive-block-grid").length == 0
      ) {
        $section
          .find(".grid-stack-row")
          .parent()
          .prepend('<div class="rexpansive-block-grid"></div>');
      }
      if ($section.find(".rexpansive-block-section-toolbox").length == 0) {
        $section
          .find(".section-toolBox")
          .parent()
          .prepend('<div class="rexpansive-block-section-toolbox"></div>');
      }
    } else {
      $section.removeClass("rex-model-section");
      $section.removeClass("rexlive-block-grid-editing");
      $section.attr("data-rexlive-model-editing","false");
      $section
        .find(".grid-stack-row")
        .parent()
        .children(".rexpansive-block-grid")
        .remove();
      $section.find(".rexpansive-block-section-toolbox").remove();
    }
    $section.attr("data-rexlive-model-id", data.modelID);
    $section.attr("data-rexlive-model-name", data.modelName);
    $section.attr("data-rexlive-model-number", data.modelNumber);
    $section.attr("data-rexlive-section-id", data.sectionID);

    if (typeof layoutsOrder !== "undefined" && layoutsOrder != null) {
      Rexbuilder_Util.updatePageCustomizationsDomOrder(layoutsOrder);
    }

    if (
      typeof defaultStateSections !== "undefined" &&
      defaultStateSections != null
    ) {
      Rexbuilder_Util.updateDefaultLayoutState({
        pageData: defaultStateSections
      });
    }
  };

  var _updateLockEditModel = function($button, lock) {
    var $section = $button.parents(".rexpansive_section");
    if (lock) {
      $section.addClass("rexlive-block-grid-editing");
      $section.attr("data-rexlive-model-editing","false");
      if (
        $section
          .find(".grid-stack-row")
          .parent()
          .children(".rexpansive-block-grid").length == 0
      ) {
        $section
          .find(".grid-stack-row")
          .parent()
          .prepend('<div class="rexpansive-block-grid"></div>');
      }
      if ($section.find(".rexpansive-block-section-toolbox").length == 0) {
        $section
          .find(".section-toolBox")
          .parent()
          .prepend('<div class="rexpansive-block-section-toolbox"></div>');
      }
      $button.removeClass("unlocked");
      $button.addClass("locked");
    } else {
      $button.addClass("unlocked");
      $button.removeClass("locked");
      $section.removeClass("rexlive-block-grid-editing");
      $section.attr("data-rexlive-model-editing","true");
      $section
        .find(".grid-stack-row")
        .parent()
        .children(".rexpansive-block-grid")
        .remove();
      $section.find(".rexpansive-block-section-toolbox").remove();
    }
  };

  var _fixModelNumbers = function() {
    var models = [];
    var i;
    var flagNumbers;
    
    if ( ! Rexbuilder_Util.rexContainer ) {
      return;
    }

    var sections = [].slice.call( Rexbuilder_Util.rexContainer.querySelectorAll('.rexpansive_section:not(.removing_section)') );
    var j, tot_sections = sections.length;

    for( j=0; j < tot_sections; j++ ) {
      if ( Rexbuilder_Util.hasClass( sections[j], 'rex-model-section' ) ) {
        var modelID = sections[j].getAttribute( 'data-rexlive-model-id' );
        flagNumbers = false;
        for (i = 0; i < models.length; i++) {
          if ( models[i].id == modelID ) {
            models[i].number = models[i].number + 1;
            sections[j].setAttribute( 'data-rexlive-model-number', models[i].number );
            flagNumbers = true;
          }
        }
        if ( !flagNumbers ) {
          var model = {
            id: modelID,
            number: 1
          };
          models.push(model);
          sections[j].setAttribute( 'data-rexlive-model-number', model.number );
        }
      }
    }
  };

  /**
   * Tracing the state of the current width
   * @param {jQuery Object} $section Edited Row
   * @param {Object} data Width data to set. sectionWidth: value of the width; widthType: full|boxed
   */
  var _updateSectionWidthData = function($section, data) {
    var $sectionData = $section.children(".section-data");
    $sectionData.attr("data-section_width", data.sectionWidth);
    $sectionData.attr("data-dimension", data.widthType);
  };

  var _updateSectionWidth = function($section, data) {
    var sectionWidth = data.section_width;
    var widthType = data.dimension;
    var galleryInstance = data.galleryInstance;

    _updateSectionWidthData($section, {
      sectionWidth: sectionWidth,
      widthType: widthType
    });

    galleryInstance.updateSectionWidthWrap(sectionWidth);

    Rexbuilder_Util_Editor.updatingGridstack = true;
    galleryInstance.batchGridstack();
    galleryInstance.updateGridstackGridSizes(
      data.singleWidth,
      data.singleHeight
    );
    _updateBlocksLayout(data.blocksDisposition);
    galleryInstance.commitGridstack();
    Rexbuilder_Util_Editor.updatingGridstack = false;
  };

  var _updateRowDistancesData = function($gallery, newDistances) {
    var $sectionData = $gallery
      .parents(".rexpansive_section")
      .children(".section-data");

    $gallery.attr("data-separator", newDistances.gutter);
    $gallery.attr("data-row-separator-top", newDistances.top);
    $gallery.attr("data-row-separator-right", newDistances.right);
    $gallery.attr("data-row-separator-bottom", newDistances.bottom);
    $gallery.attr("data-row-separator-left", newDistances.left);

    $sectionData.attr("data-block_distance", newDistances.gutter);
    $sectionData.attr("data-row_separator_top", newDistances.top);
    $sectionData.attr("data-row_separator_right", newDistances.right);
    $sectionData.attr("data-row_separator_bottom", newDistances.bottom);
    $sectionData.attr("data-row_separator_left", newDistances.left);
  };

  var _updateRowDistances = function($section, data) {
    var newDistances = data.rowDistances;
    var $gallery = $section.find(".grid-stack-row");
    var galleryInstance = data.galleryInstance;

    _updateRowDistancesData($gallery, newDistances);
    galleryInstance.updateRowDistances(newDistances);

    Rexbuilder_Util_Editor.updatingGridstack = true;
    galleryInstance.batchGridstack();
    galleryInstance.updateGridstackGridSizes(
      data.singleWidth,
      data.singleHeight
    );
    _updateBlocksLayout(data.blocksDisposition);
    galleryInstance.commitGridstack();
    Rexbuilder_Util_Editor.updatingGridstack = false;
  };

  /**
   * Setting the css margins of a section
   * @param {jQuery Object} $section section to edit
   * @param {Object} margins values to set
   * @since 2.0.0
   */
  var _updateSectionMarginsData = function($section, margins) {
    var section = $section[0];
    section.style.marginTop = margins.top + "px";
    section.style.marginRight = margins.right + "px";
    section.style.marginBottom = margins.bottom + "px";
    section.style.marginLeft = margins.left + "px";
  };

  var _updateSectionMargins = function($section, data) {
    _updateSectionMarginsData($section, data.marginsSection);
    var galleryInstance = data.galleryInstance;
    Rexbuilder_Util_Editor.updatingGridstack = true;
    galleryInstance.batchGridstack();
    galleryInstance.updateGridstackGridSizes(
      data.singleWidth,
      data.singleHeight
    );
    _updateBlocksLayout(data.blocksDisposition);
    galleryInstance.commitGridstack();
    Rexbuilder_Util_Editor.updatingGridstack = false;
  };

  var _updateGridLayoutDomProperties = function($gallery, layout) {
    var $sectionData = $gallery
      .parents(".rexpansive_section")
      .children(".section-data");
    $gallery.attr("data-layout", layout);
    $gallery.attr("data-full-height", false);
    $sectionData.attr("data-layout", layout);
    $sectionData.attr("data-full_height", false);
  };

  var _updateSectionLayout = function($gallery, data) {
    _updateGridLayoutDomProperties($gallery, data.layout);

    var galleryInstance = data.galleryInstance;
    Rexbuilder_Util_Editor.updatingGridstack = true;
    galleryInstance.settings.galleryLayout = data.layout;
    galleryInstance.batchGridstack();
    galleryInstance.updateFloatingElementsGridstack();
    galleryInstance.updateGridstackGridSizes(
      data.singleWidth,
      data.singleHeight
    );
    _updateBlocksLayout(data.blocksDisposition);
    galleryInstance.commitGridstack();
    Rexbuilder_Util_Editor.updatingGridstack = false;
  };

  var _updateSectionFullHeight = function(data) {
    data.galleryInstance.updateFullHeight(data.fullHeight.toString() == "true");
  };

  /**
   * Update the props of a section in a "bulky" way
   * @param  {Object} targetInfo  Section info
   * @param  {Object} changedData list of changed data to revert to default
   * @param  {Array} defaultData array of objects with default data
   * @return {void}
   * @since  2.0.5
   */
  function _updateBulkSection( targetInfo, changedData, defaultData ) {
    var $section;
    if ( targetInfo.modelNumber != "" ) {
      $section = Rexbuilder_Util.$rexContainer.find(
        'section[data-rexlive-section-id="' +
          targetInfo.sectionID +
          '"][data-rexlive-model-number="' +
          targetInfo.modelNumber +
          '"]'
      );
    } else {
      $section = Rexbuilder_Util.$rexContainer.find( 'section[data-rexlive-section-id="' + targetInfo.sectionID + '"]' );
    }

    var defaultProps;
    var i, tot = defaultData.length;
    for( i=0; i<tot; i++ ) {
      if ( 'self' === defaultData[i].name ) {
        defaultProps = defaultData[i].props;
        break;
      }
    }

    // handle multiple value props, to prevent duplicate reset
    var colorChanged = false;
    var imageChanged = false;
    var videoMp4Changed = false;
    var gutterChanged = false;
    var marginChanged = false;
    var overlayChanged = false;

    for( var prop in changedData ) {
      if ( ! changedData[prop] ) continue;
      switch( prop ) {
        case 'section_name':
          _updateSectionName($section, defaultProps.sectionName);
          break;
        case 'color_bg_section':
        case 'color_bg_section_active':
          if ( colorChanged ) break;

          _updateSectionBackgroundColor( $section, {
            color: defaultProps.color_bg_section,
            active: defaultProps.color_bg_section_active
          });
          colorChanged = true;

          break;
        case 'image_bg_section_active':
        case 'image_bg_section':
        case 'image_width':
        case 'image_height':
        case 'id_image_bg_section':
        case 'image_size':
          if ( imageChanged ) break;

          _updateSectionBackgroundImage( $section, {
            width: defaultProps.image_width,
            height: defaultProps.image_height,
            image_size: defaultProps.image_size,
            idImage: defaultProps.id_image_bg_section,
            urlImage: defaultProps.image_bg_section,
            active: defaultProps.image_bg_section_active
          });
          imageChanged = true;

          break;
        case 'video_bg_id_section':
        case 'video_mp4_url':
        case 'video_bg_width_section':
        case 'video_bg_height_section':
          if ( videoMp4Changed ) break;

          _updateSectionVideoBackground( $section, {
            typeVideo: 'mp4',
            mp4Data: {
              linkMp4: defaultProps.video_mp4_url,
              idMp4: defaultProps.video_bg_id_section,
              width: defaultProps.video_bg_width_section,
              height: defaultProps.video_bg_height_section,
            }
          });
          videoMp4Changed = true;

          break;
        case 'video_bg_url_section':
          _updateSectionVideoBackground( $section, {
            typeVideo: 'youtube',
            youtubeUrl: defaultProps.video_bg_url_section
          });
          break;
        case 'video_bg_url_vimeo_section':
          _updateSectionVideoBackground( $section, {
            typeVideo: 'vimeo',
            vimeoUrl: defaultProps.video_bg_url_vimeo_section
          });
          break;
        case 'block_distance':
        case 'row_separator_top':
        case 'row_separator_bottom':
        case 'row_separator_right':
        case 'row_separator_left':
          if ( gutterChanged ) break;

          var galleryInstance = $section.find('.perfect-grid-gallery').data().plugin_perfectGridGalleryEditor;
          _updateRowDistances( $section, {
            rowDistances: {
              gutter: defaultProps.block_distance,
              top: defaultProps.row_separator_top,
              right:defaultProps.row_separator_right,
              bottom: defaultProps.row_separator_bottom,
              left: defaultProps.row_separator_left
            },
            galleryInstance: galleryInstance,
            singleWidth: galleryInstance.properties.singleWidth,
            singleHeight: galleryInstance.properties.singleHeight,
            blocksDisposition: $.extend(
              true,
              {},
              galleryInstance.createActionDataMoveBlocksGrid()
            )
          });
          gutterChanged = true;

          break;
        case 'margin':
        case 'row_margin_top':
        case 'row_margin_bottom':
        case 'row_margin_right':
        case 'row_margin_left':
          if( marginChanged ) break;

          var galleryInstance = $section.find('.perfect-grid-gallery').data().plugin_perfectGridGalleryEditor;
          _updateSectionMargins( $section, {
            marginsSection: {
              top: defaultProps.row_margin_top,
              bottom: defaultProps.row_margin_bottom,
              right: defaultProps.row_margin_right,
              left: defaultProps.row_margin_left
            },
            galleryInstance: galleryInstance,
            singleWidth: galleryInstance.properties.singleWidth,
            singleHeight: galleryInstance.properties.singleHeight,
            blocksDisposition: $.extend(
              true,
              {},
              galleryInstance.createActionDataMoveBlocksGrid()
            )
          });
          marginChanged = true;

          break;
        case 'custom_classes':
          _updateCustomClasses( $section, defaultProps.custom_classes );
          break;
        case 'row_overlay_color':
        case 'row_overlay_active':         // they go togheter, find a way to prevent double call
          if ( overlayChanged ) break;

          _updateSectionOverlay( $section, {
            color: defaultProps.row_overlay_color,
            active: defaultProps.row_overlay_active
          });
          overlayChanged = true;

          break;
        default: break;
      }
    }
  }

  /**
   * Update the props of a block in a "bulky" way
   * @param  {Object} targetInfo  Section info
   * @param  {Object} changedData list of changed data to revert to default
   * @param  {Array} defaultData array of objects with default data
   * @return {void}
   * @since  2.0.5
   */
  function _updateBulkBlock( targetInfo, changedData, defaultData ) {
    var $elem;
    if ( targetInfo.modelNumber != "" ) {
      $elem = Rexbuilder_Util.$rexContainer
        .find(
          'section[data-rexlive-section-id="' +
            targetInfo.sectionID +
            '"][data-rexlive-model-number="' +
            targetInfo.modelNumber +
            '"]'
        )
        .find('div [data-rexbuilder-block-id="' + targetInfo.rexID + '"]');
    } else {
      $elem = Rexbuilder_Util.$rexContainer
        .find('section[data-rexlive-section-id="' + targetInfo.sectionID + '"]')
        .find('div [data-rexbuilder-block-id="' + targetInfo.rexID + '"]');
    }

    var defaultProps;
    var i, tot = defaultData.length;
    for( i=0; i<tot; i++ ) {
      if ( targetInfo.rexID === defaultData[i].name ) {
        defaultProps = defaultData[i].props;
        break;
      }
    }

    // handle multiple value props, to prevent duplicate reset
    var colorChanged = false;
    var imageChanged = false;
    var videoMp4Changed = false;
    var overlayChanged = false;

    for( var prop in changedData ) {
      if ( ! changedData[prop] ) continue;
      switch( prop ) {
        case 'color_bg_block':
        case 'color_bg_block_active':
          if ( colorChanged ) break;

          _updateBlockBackgroundColor({ 
            $elem: $elem,
            color: defaultProps.color_bg_block,
            active: defaultProps.color_bg_block_active
          });
          colorChanged = true;

          break;
        case 'image_bg_url':
        case 'image_width':
        case 'image_height':
        case 'id_image_bg':
        case 'image_size':
        case 'image_bg_elem_active':
        case 'type_bg_image':
          if ( imageChanged ) break;

          _updateImageBG( $elem.find(".grid-item-content"), {
            width: defaultProps.image_width,
            height: defaultProps.image_height,
            sizeImage: defaultProps.image_size,
            idImage: defaultProps.id_image_bg,
            urlImage: defaultProps.image_bg_url,
            active: defaultProps.image_bg_elem_active,
            typeBGimage: defaultProps.type_bg_image
          });

          imageChanged = true;

          break;
        case 'video_bg_id':
        case 'video_bg_width':
        case 'video_bg_height':
        case 'video_mp4_url':
          if( videoMp4Changed ) break;

          _updateVideos( $elem, {
            typeVideo: 'mp4',
            mp4Data: {
              linkMp4: defaultProps.video_mp4_url,
              idMp4: defaultProps.video_bg_id,
              width: defaultProps.video_bg_width,
              height: defaultProps.video_bg_height,
            }
          });

          videoMp4Changed = true;
        case 'video_bg_url_youtube':
          _updateVideos( $elem, {
            typeVideo: 'youtube',
            vimeoUrl: defaultProps.video_bg_url_youtube
          });
          break;
        case 'video_bg_url_vimeo':
          _updateVideos( $elem, {
            typeVideo: 'vimeo',
            vimeoUrl: defaultProps.video_bg_url_vimeo
          });
          break;
        case 'photoswipe':
          _updateBlockPhotoswipe({
            $elem: $elem,
            photoswipe: defaultProps.photoswipe
          });
          break;
        case 'block_custom_class':
          _updateCustomClasses( $elem, defaultProps.block_custom_class );
          break;
        case 'block_padding':
          var paddingType = ( -1 !== defaultProps.block_padding.indexOf('px') ? 'px' : ( -1 !== defaultProps.block_padding.indexOf('%') ? '%' : '' ) );
          var paddingString = defaultProps.block_padding;
          paddingString = paddingString.replace( /px|%/g, '' );
          var paddingVals = paddingString.split(';');

          _updateBlockPaddings( $elem, {
            top: paddingVals[0],
            right: paddingVals[1],
            bottom: paddingVals[2],
            left: paddingVals[3],
            type: paddingType
          });
          break;
        case 'overlay_block_color':
        case 'overlay_block_color_active':
          if ( overlayChanged ) break;

          _updateBlockOverlay( {
            $elem: $elem,
            color: defaultProps.overlay_block_color,
            active: defaultProps.overlay_block_color_active
          });

          overlayChanged = true;
          break;
        case 'linkurl':
          _updateBlockUrl( $elem, defaultProps.linkurl );
          break;
        case 'block_flex_position':
          var flexCoords = defaultProps.block_flex_position.split(' ');
          _updateFlexPostition( $elem, { x: flexCoords[0], y: flexCoords[1] } );
          break;
        case 'block_flex_img_position':
          var flexCoords = defaultProps.block_flex_img_position.split(' ');
          _updateImageFlexPostition( $elem, { x: flexCoords[0], y: flexCoords[1] } );
          break;
        default: break;
      }
    }
  }
  
  /**
   * @param {String} HTML representing a single element
   * @return {Element}
   */
  function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }

  var _updateRexButton= function(data){
    Rexbuilder_Rexbutton.updateButton(data);
  }

  var _performAction = function(action, flag) {
    var dataToUse;

    if (flag) {
      dataToUse = action.performActionData;
      Rexbuilder_Util_Editor.undoActive = false;
      Rexbuilder_Util_Editor.redoActive = true;
    } else {
      dataToUse = action.reverseActionData;
      Rexbuilder_Util_Editor.redoActive = false;
      Rexbuilder_Util_Editor.undoActive = true;
    }

    var $section;

    if (action.modelNumber != "") {
      $section = Rexbuilder_Util.$rexContainer.find(
        'section[data-rexlive-section-id="' +
          action.sectionID +
          '"][data-rexlive-model-number="' +
          action.modelNumber +
          '"]'
      );
    } else {
      $section = Rexbuilder_Util.$rexContainer.find(
        'section[data-rexlive-section-id="' + action.sectionID + '"]'
      );
    }

    var $galleryElement = $section.find(".grid-stack-row");

    var galleryData = $galleryElement.data();
    if (galleryData !== undefined) {
      var galleryEditorInstance = $galleryElement.data()
        .plugin_perfectGridGalleryEditor;
    }

    switch (action.actionName) {
      case "updateSectionLayout":
        _updateSectionLayout($galleryElement, dataToUse);
        break;
      case "updateSectionFullHeight":
        _updateSectionFullHeight(dataToUse);
        break;
      case "updateSectionBlocksDisposition":
        if (galleryEditorInstance !== undefined) {
          _updateBlocksLayout(dataToUse);
          setTimeout(galleryEditorInstance._updateElementsSizeViewers(), 200);
        }
        break;
      //Used to delete or recreate block
      case "updateBlockVisibility":
        if (galleryEditorInstance !== undefined) {
          _updateRemovingBlock(
            dataToUse.targetElement,
            dataToUse.hasToBeRemoved,
            dataToUse.galleryInstance
          );
        }
        break;
      case "updateSlider":
        _updateSlider(dataToUse);
        break;
      case "updateSectionName":
        _updateSectionName($section, dataToUse.sectionName);
        break;
      case "updateSectionPhotoswipe":
        _updateSectionPhotoswipe(dataToUse.elements);
        break;
      case "collapseSection":
        _collapseGrid(
          dataToUse.gridInstance,
          dataToUse.collapse,
          dataToUse.blockDisposition,
          dataToUse.gridLayout
        );
        break;
      case "updateCustomClasses":
        _updateCustomClasses(dataToUse.$target, dataToUse.classes);
        break;
      case "updateCustomCSS":
        _updateCustomCSS(dataToUse.css);
        break;
      case "_updateSectionBackgroundColor":
        _updateSectionBackgroundColor($section, dataToUse);
        break;
      case "updateSectionOverlay":
        _updateSectionOverlay($section, dataToUse);
        break;
      case "updateSectionImageBG":
        _updateImageBG($section, dataToUse);
        break;
      case "updateSectionVideoBG":
        Rexbuilder_Dom_Util.updateVideos($section, dataToUse);
        break;
      case "updateBlockBackgroundColor":
        _updateBlockBackgroundColor(dataToUse);
        break;
      case "updateBlockBackgroundGradient":
        _updateBlockBackgroundGradient(dataToUse);
        break;
      case "updateBlockOverlayGradient":
        _updateBlockOverlayGradient(dataToUse);
        break;
      case "updateBlockOverlay":
        _updateBlockOverlay(dataToUse);
        break;
      case "updateBlockImageBG":
        Rexbuilder_Util_Editor.updatingImageBg = true;
        _updateImageBG(dataToUse.$itemContent, dataToUse.imageOpt);
        if (galleryEditorInstance !== undefined) {
          if (galleryEditorInstance.settings.galleryLayout == "masonry") {
            galleryEditorInstance.updateElementHeight(
              dataToUse.$itemContent.parents(".grid-stack-item").get(0)
            );
          }
        }
        Rexbuilder_Util_Editor.updatingImageBg = false;
        break;
      case "updateBlockPhotoswipe":
        _updateBlockPhotoswipe(dataToUse);
        break;
      case "updateBlockPadding":
        Rexbuilder_Util_Editor.updatingPaddingBlock = true;
        _updateBlockPaddings(dataToUse.$elem, dataToUse.dataPadding);
        if (galleryEditorInstance !== undefined) {
          if (galleryEditorInstance.settings.galleryLayout == "masonry") {
            galleryEditorInstance.updateElementHeight(dataToUse.$elem[0], true);
          }
        }
        Rexbuilder_Util_Editor.updatingPaddingBlock = false;
        break;
      case "updateBlockVideoBG":
        Rexbuilder_Dom_Util.updateVideos(
          dataToUse.$itemContent,
          dataToUse.videoOpt
        );
        break;
      case "updateBlockFlexPosition":
        _updateFlexPostition(dataToUse.$elem, dataToUse.dataPosition);
        break;
      case "updateBlockImageFlexPosition":
        _updateImageFlexPostition(dataToUse.$elem, dataToUse.dataPosition);
        break;
      case "updateBlockUrl":
        _updateBlockUrl(dataToUse.$elem, dataToUse.url);
        break;
      case "updateSectionVisibility":
        _updateSectionVisibility(
          $section,
          dataToUse.show,
          dataToUse.layoutsOrder,
          dataToUse.stateDefault
        );
        break;
      case "updateSectionModel":
        _updateModelVisibility(dataToUse);
        break;
      case "sectionBecameModel":
        _updateSectionBecameModel(dataToUse);
        break;
      case "updateSectionOrder":
        _fixSectionDomOrder(
          dataToUse.sectionOrder,
          false,
          dataToUse.sectionMoved
        );
        break;
      case "updateLockButton":
        _updateLockEditModel(dataToUse.$button, dataToUse.lock);
        break;
      case "updateSectionWidth":
        _updateSectionWidth($section, dataToUse);
        break;
      case "updateGridDistances":
        _updateRowDistances($section, dataToUse);
        break;
      case "updateSectionMargins":
        _updateSectionMargins($section, dataToUse);
        break;
      case "updateRexButton":
        _updateRexButton(dataToUse);
        break;
      default:
        break;
    }

    Rexbuilder_Util_Editor.undoActive = false;
    Rexbuilder_Util_Editor.redoActive = false;
  };

  var init = function() {
    this.lastSliderNumber = 0;
  };

  return {
    init: init,
    updateRow: _updateRow,
    updateSectionMargins: _updateSectionMargins,
    updateSectionMarginsData: _updateSectionMarginsData,
    updateImageBG: _updateImageBG,
    updateBlockPhotoswipe: _updateBlockPhotoswipe,
    performAction: _performAction,
    addYoutubeVideo: _addYoutubeVideo,
    removeYoutubeVideo: _removeYoutubeVideo,
    addVimeoVideo: _addVimeoVideo,
    removeVimeoVideo: _removeVimeoVideo,
    addMp4Video: _addMp4Video,
    removeMp4Video: _removeMp4Video,
    fixVideoProportion: fixVideoProportion,
    updateSlider: _updateSlider,
    updateSliderStack: _updateSliderStack,
    updateSectionName: _updateSectionName,
    updateSectionNavLabel: _updateSectionNavLabel,
    enablePhotoswipeAllBlocksSection: _enablePhotoswipeAllBlocksSection,
    removePhotoswipeAllBlocksSection: _removePhotoswipeAllBlocksSection,
    updateCustomClasses: _updateCustomClasses,
    collapseGrid: _collapseGrid,
    updateCustomCSS: _updateCustomCSS,
    updateSectionVideoBackground: _updateSectionVideoBackground,
    updateSectionBackgroundImage: _updateSectionBackgroundImage,
    updateSectionBackgroundColor: _updateSectionBackgroundColor,
    updateSectionBackgroundColorLive: _updateSectionBackgroundColorLive,
    updateSectionBackgroundGradient: _updateSectionBackgroundGradient,
    updateSectionOverlay: _updateSectionOverlay,
    updateSectionOverlayColorLive: _updateSectionOverlayColorLive,
    updateSectionOverlayGradient: _updateSectionOverlayGradient,
    updateBlockBackgroundColor: _updateBlockBackgroundColor,
    updateBlockBackgroundColorLive: _updateBlockBackgroundColorLive,
    updateBlockBackgroundGradient: _updateBlockBackgroundGradient,
    updateBlockOverlayColorLive: _updateBlockOverlayColorLive,
    updateBlockOverlay: _updateBlockOverlay,
    updateBlockOverlayGradient: _updateBlockOverlayGradient,
    updateVideos: _updateVideos,
    updateBlockPaddings: _updateBlockPaddings,
    updateFlexPostition: _updateFlexPostition,
    updateImageFlexPostition: _updateImageFlexPostition,
    updateBlockUrl: _updateBlockUrl,
    updateSectionVisibility: _updateSectionVisibility,
    fixSectionDomOrder: _fixSectionDomOrder,
    updateSectionBecameModel: _updateSectionBecameModel,
    updateLockEditModel: _updateLockEditModel,
    fixModelNumbers: _fixModelNumbers,
    updateSectionWidthData: _updateSectionWidthData,
    updateSectionWidth: _updateSectionWidth,
    updateRowDistancesData: _updateRowDistancesData,
    updateGridLayoutDomProperties: _updateGridLayoutDomProperties,
    htmlToElement: htmlToElement,
    updateBulkSection: _updateBulkSection,
    updateBulkBlock: _updateBulkBlock
  };
})(jQuery);
