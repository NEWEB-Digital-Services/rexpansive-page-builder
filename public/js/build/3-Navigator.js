var Rex_Navigator = (function ($) {
  'use strict';
  /* -- Handle dot behaviour --- */
  var navigationItems;
  var $sections;
  var $touch_navigation_links;
  var verticalNav;

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
          // if (($this.offset().top - Rexbuilder_Util.$window.height() / 2 < Rexbuilder_Util.$window.scrollTop()) && ($this.offset().top + $this.height() - Rexbuilder_Util.$window.height() / 2 > Rexbuilder_Util.$window.scrollTop())) {
          if (($this.offset().top - Rexbuilder_Util.globalViewport.height / 2 < Rexbuilder_Util.$window.scrollTop()) && ($this.offset().top + $this.height() - Rexbuilder_Util.globalViewport.height / 2 > Rexbuilder_Util.$window.scrollTop())) {
            navigationItems.eq(activeSection).addClass('is-selected');
          } else {
            navigationItems.eq(activeSection).removeClass('is-selected');
          }
        }
      }
    });
  }

  var updateSections = function () {
    $sections = Rexbuilder_Util.$rexContainer.children(".rexpansive_section");
  }

  var updateNavigationItems = function () {
    navigationItems = Rexbuilder_Util.$document.find('.vertical-nav a');
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
  var _updateNavigatorItem = function ($section, newSafeName, newName) {
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
  }

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
  }

  var init = function () {
    var $navigatorWrap = Rexbuilder_Util.$document.find("nav[class*=\"vertical-nav\"]");
    if ($navigatorWrap.length != 0 && $navigatorWrap.hasClass("nav-editor-mode-disable")) {
      _updateNavigatorDom($navigatorWrap);
    }

    verticalNav = document.querySelector('.vertical-nav');

    if ( verticalNav ) {
      Rexbuilder_Util.$window.on('scroll', function () {
        updateNavigation();
      });
    }

    linkDocumentEvents();
    updateNavigator();
  }

  return {
    init: init,
    updateNavigator: updateNavigator,
    updateNavigatorItem: _updateNavigatorItem,
    fixNavigatorItemOrder: _fixNavigatorItemOrder
  };

})(jQuery);