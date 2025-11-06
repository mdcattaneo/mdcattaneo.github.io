/**
 * @file
 * JS behaviors for the header region.
 */

(function ($) {
  'use strict';

  $(document).ready(function () {

    /*
     * Mega Menu
     * Toggles hover active/inactive classes for 2nd level menus
     */
    $('.menu4 .main-menu .submenu-item, .menu3 .main-menu .nav-item').hover(
      function () {
        $(this).addClass('hover-active');
        $(this).siblings(this).addClass('hover-inactive');
      }, function () {
        $(this).removeClass('hover-active');
        $(this).siblings(this).removeClass('hover-inactive');
      }
    );
  });
})(jQuery);
