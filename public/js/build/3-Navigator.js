var Rex_Navigator = (function ($) {
  'use strict';
  /* -- Handle dot behaviour --- */
  var verticalNav;
  var $touch_navigation_links;
	var navigationItems;

  var $sections;
  var sections;
	var tot_sections;
	var sectionsWithID;
	var tot_sectionsWithID;

  var _updateNavigatorDom = function ($navigatorWrap) {
		var $sections = Rexbuilder_Util.$rexContainer.children(".rexpansive_section");

    $sections.each(function (i, sec) {
      var $section = $(sec);
      var name = $section.attr("data-rexlive-section-name");
      if (name != "") {
        var newSafeName = name.replace(/ /gm, "");
        tmpl.arg = "navigator";
        var navItem = tmpl("tmpl-navigator-item", {
          sectionName: name,
          sectionID: newSafeName,
          number: i + 1
				});

        $navigatorWrap.children("ul").append(navItem);
      }
    });
	}

	var updateNavigation = function () {
    var $this;
    var activeSection;
    var activeSectionIndex;
    $sections.each(function () {
      $this = $(this);
      if ( null !== this.getAttribute('id') && this.getAttribute('id') != '') {
        activeSection = document.querySelector('.vertical-nav a[href="#' + this.getAttribute('id') + '"]');
        if ( activeSection ) {
          activeSectionIndex = activeSection.getAttribute('data-number') - 1;
          if (($this.offset().top - Rexbuilder_Util.globalViewport.height / 2 < Rexbuilder_Util.$window.scrollTop()) && ($this.offset().top + $this.height() - Rexbuilder_Util.globalViewport.height / 2 > Rexbuilder_Util.$window.scrollTop())) {
            navigationItems.eq(activeSectionIndex).addClass('is-selected');
          } else {
            navigationItems.eq(activeSectionIndex).removeClass('is-selected');
          }
        }
      }
    });
  }

	/**
	 * Updates the active element of the navigator.
	 * @returns	{void}
	 * @since		?.?.?
	 * @version	2.0.4			Changed in vanilla js
	 *
	 * Use this function if you want to keep in memory
	 * last section with an ID visited
	 */
  function NEW_updateNavigation() {
		var section;
		var sectionTop;

		var windowScrollTop = Rexbuilder_Util.$window.scrollTop();
		var verticalNavLink;
		var activeSectionIndex;

		// Cleaning in case we aren't "under" any section
		navigationItems.removeClass('is-selected');

		var i = tot_sectionsWithID - 1;

		for (; i >= 0; i--) {
			section = sectionsWithID[i];
			verticalNavLink = document.querySelector('.vertical-nav a[href="#' + section.getAttribute('id') + '"]');

			if (verticalNavLink) {
				// String - Number = Number
				activeSectionIndex = verticalNavLink.getAttribute('data-number') - 1;

				sectionTop = $(section).offset().top;

				if (windowScrollTop >= sectionTop) {
					// The first section that has less scrollTop
					// than the window will become the selected section,
					// because the user is "under" that section
					navigationItems.removeClass('is-selected');

					if (activeSectionIndex !== -1) {
						navigationItems.eq(activeSectionIndex).addClass('is-selected');
					}

					break;
				}
			}
		}
	}

  function updateSections() {
		$sections = Rexbuilder_Util.$rexContainer.children('.rexpansive_section');
		sections = $sections.get();
		tot_sections = sections.length;

		sectionsWithID = sections.filter(function (section) {
			return section.getAttribute('id') && '' !== section.getAttribute('id');
		});

		tot_sectionsWithID = sectionsWithID.length
	}

  var updateNavigationItems = function () {
    navigationItems = Rexbuilder_Util.$document.find('.vertical-nav a');
    // navigationItems = Rexbuilder_Util.$document.find('.rex-vertical-nav a');
  };

  var updateTouchNavigationLinks = function () {
    $touch_navigation_links = Rexbuilder_Util.$document.find('.touch .vertical-nav a');
  }

  var _fixNavigatorItemOrder = function ($section) {
    if (!($section.attr("id") == undefined || $section.attr("id") == "")) {
      var id = $section.attr("id");
      var $navigatorWrap = Rexbuilder_Util.$document.find("nav[class*=\"vertical-nav\"]");
      var $navItem = $navigatorWrap.find('li a[href="#' + id + '"]').parent();
      var $nextSection = $section;
      var nextID = "";
      do {
        $nextSection = $nextSection.next();
        nextID = $nextSection.attr("id");
        if (nextID != "") {
          break;
        }
      } while ($nextSection.length != 0);

      if (nextID == "" || nextID == undefined) {
        $navigatorWrap.children("ul").append($navItem[0]);
      } else {
        $navItem.insertBefore($navigatorWrap.find('li a[href="#' + nextID + '"]').parent());
      }
    }
  }

  /**
   * Used to change name, add or remove item from navigator
   * @param {*} $section section linked
   * @param {*} name name of the section, if name is "" the item will be removed
   */
  var _updateNavigatorItem = function ( $section, newSafeName, newName ) {
    var $navigatorWrap = Rexbuilder_Util.$document.find("nav[class*=\"vertical-nav\"]");
    if (newSafeName != "") {
      if ($section.attr("id") == "") {
        var totalSectionNumber = Rexbuilder_Util.$rexContainer.children(".rexpansive_section").length;
        var emptyIDs = Rexbuilder_Util.$rexContainer.children('.rexpansive_section[id=""]').length;
        var $nextSection = $section;
        var nextID = "";

        do {
          $nextSection = $nextSection.next();
          nextID = $nextSection.attr("id");
          if (nextID != "") {
            break;
          }
        } while ($nextSection.length != 0);

        var n = totalSectionNumber - emptyIDs + 1;
        tmpl.arg = "navigator";

        var navItem = tmpl("tmpl-navigator-item", {
          sectionName: newName,
          sectionID: newSafeName,
          number: n
        });

        if (nextID == "" || nextID == undefined) {
          $navigatorWrap.children("ul").append(navItem);
        } else {
          $(navItem).insertBefore($navigatorWrap.find('li a[href="#' + nextID + '"]').parent());
        }
      } else {
        var oldName = $section.attr("id");
        var $item = $navigatorWrap.find('li a[href="#' + oldName + '"]');
        $item.attr("href", "#" + newSafeName);
        $item.find(".label").text(newName);
      }
      $section.attr("id", newSafeName);
      $section.attr("href", "#" + newSafeName);
    } else {
      if (!($section.attr("id") == "")) {
        var oldName = $section.attr("id");
        var $item = $navigatorWrap.find('li a[href="#' + oldName + '"]').parent();
        $item.remove();
        $section.attr("id", "");
        $section.removeAttr("href");
      }
    }

    updateNavigator();
  };

  var updateNavigator = function () {
    updateSections();
    updateNavigationItems();
    updateTouchNavigationLinks();
    if ( verticalNav ) {
      updateNavigation();
    }
  };

  var linkDocumentEvents = function () {
    Rexbuilder_Util.$document.on("click", ".vertical-nav a", function (event) {
      event.preventDefault();
      var $target = $(event.target);
      if (!$target.is("a")) {
        $target = $target.parents("a");
      }
      var selector = $target.attr("href");
      var $targetSection = Rexbuilder_Util.$rexContainer.children(selector);
      Rexbuilder_Util.smoothScroll($targetSection);
    });

    Rexbuilder_Util.$document.on('click', ".touch .vertical-nav a", function () {
      $touch_navigation_links.find('.rex-label').removeClass('fadeInAndOut');
      $(this).find('.rex-label').addClass('fadeInAndOut');
      Rexbuilder_Util.$document.find('.touch .vertical-nav').removeClass('open');
    });
	};

	var targetsPositions = {};

	/**
	 * Adds mouseenter and mouseleave listeners to the vertical nav links.
	 * These listeners are used to position the label in the right place.
	 * @returns	{void}
	 * @since		2.0.4
	 */
	function _prepareNavigationLabel() {
		_getNavigationDotsPosition();

		var navigationLabel = document.getElementById('vertical-nav-label');
		var navigationLinks = Array.prototype.slice.call( document.querySelectorAll('.vertical-nav-link[href]') );

    if (null === navigationLabel) return

    var position = navigationLabel.getAttribute('data-nav-position')
    position = position ? position : 'right'

		for (var i = 0; i < navigationLinks.length; i++) {
			navigationLinks[i].addEventListener('mouseenter', function (event) {
				// When RexClassic is active this function never gets called
				var targetHref = event.target.getAttribute('href');
        var targetLabel = event.target.getAttribute('data-section_nav_label');

        if ( targetLabel ) {
          navigationLabel.innerHTML = targetLabel;
        } else {
				  navigationLabel.innerText = targetHref.replace('#', '').replace(/\-/g, ' ');
        }
				navigationLabel.style.display = 'inline';
				navigationLabel.style.opacity = '1';
				navigationLabel.style.top = ( targetsPositions[targetHref].top + ( targetsPositions[targetHref].height / 2 ) - ( navigationLabel.offsetHeight / 2 ) ) + 'px';
        var positionAmount = targetsPositions[targetHref].width * 1.5 + 'px';
        if ('right' === position) {
          navigationLabel.style.right = positionAmount
        } else {
          navigationLabel.style.left = positionAmount
        }
			});

			navigationLinks[i].addEventListener('mouseleave', function (event) {
				// When RexClassic is active this function never gets called
				navigationLabel.style.display = 'none';
				navigationLabel.style.opacity = '0';
			});
		}
	}

	/**
	 * Retrieves the coords of all the vertical nav links.
	 * @returns	{void}
	 * @since		2.0.4
	 */
	function _getNavigationDotsPosition() {
		var navigationLinks = Array.prototype.slice.call( document.querySelectorAll('.vertical-nav-link[href]') );

		for (var i = 0; i < navigationLinks.length; i++) {
			var linkHref = navigationLinks[i].getAttribute('href');
			var boundingRect = navigationLinks[i].getBoundingClientRect();

			targetsPositions[linkHref] = boundingRect;
		}
	}

  function init() {
		var $navigatorWrap = Rexbuilder_Util.$document.find("nav[class*=\"vertical-nav\"]");

    if ($navigatorWrap.length != 0 && $navigatorWrap.hasClass("nav-editor-mode-disable")) {
      _updateNavigatorDom($navigatorWrap);
    }

		verticalNav = document.querySelector('.vertical-nav');

    if ( verticalNav ) {
      Rexbuilder_Util.$window.on('scroll', function () {
        updateNavigation();
      });

      linkDocumentEvents();
    }

		updateNavigator();

		_prepareNavigationLabel();
  }

  return {
    init: init,
    updateNavigator: updateNavigator,
    updateNavigatorItem: _updateNavigatorItem,
    fixNavigatorItemOrder: _fixNavigatorItemOrder,
    getNavigationDotsPosition: _getNavigationDotsPosition
  };

})(jQuery);