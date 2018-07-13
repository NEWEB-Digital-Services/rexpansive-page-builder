var Rex_Navigator = (function ($) {
    'use strict';
    /* -- Handle dot behaviour --- */
    var navigationItems;
    var $sections;
    var $touch_navigation_links;

    var updateNavigation = function () {
        $sections.each(function () {
            var $this = $(this);
            if (typeof $this.attr('id') != 'undefined' && $this.attr('id') != '') {
                var activeSection = $(document).find('.vertical-nav a[href="#' + $this.attr('id') + '"]').data('number') - 1;
                if (($this.offset().top - Rexbuilder_Util.$window.height() / 2 < Rexbuilder_Util.$window.scrollTop()) && ($this.offset().top + $this.height() - Rexbuilder_Util.$window.height() / 2 > Rexbuilder_Util.$window.scrollTop())) {
                    navigationItems.eq(activeSection).addClass('is-selected');
                } else {
                    navigationItems.eq(activeSection).removeClass('is-selected');
                }
            }
        });
    }

    var updateSections = function () {
        $sections = Rexbuilder_Util.$rexContainer.children(".rexpansive_section");
    }

    var updateNavigationItems = function () {
        navigationItems = $(document).find('.vertical-nav a');
    };

    var updateTouchNavigationLinks = function () {
        $touch_navigation_links = $(document).find('.touch .vertical-nav a');
    }

    var updateNavigator = function () {
        updateSections();
        updateNavigationItems();
        updateTouchNavigationLinks();

        updateNavigation();
    }

    var linkDocumentEvents = function () {
        $(document).on("click", ".vertical-nav a", function (event) {
            event.preventDefault();
            var $target = $(event.target);
            if (!$target.is("a")) {
                $target = $target.parents("a");
            }
            var selector = $target.attr("href");
            var $targetSection = Rexbuilder_Util.$rexContainer.children(selector);
            Rexbuilder_Util.smoothScroll($targetSection);
        });

        $(document).on('click', ".touch .vertical-nav a", function () {
            $touch_navigation_links.find('.rex-label').removeClass('fadeInAndOut');
            $(this).find('.rex-label').addClass('fadeInAndOut');
            $(document).find('.touch .vertical-nav').removeClass('open');
        });
    }

    var init = function () {

        Rexbuilder_Util.$window.on('scroll', function () {
            updateNavigation();
        });

        linkDocumentEvents();
        updateNavigator();
    }

    return {
        init: init,
        updateNavigator: updateNavigator
    };

})(jQuery);