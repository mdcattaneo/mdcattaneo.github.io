/**
 * @file
 * Functions to improve the usability of the main menu.
 */

(function ($) {
  'use strict';

  $(document).ready(function () {

    /*
    * Enhances menus for screen readers.
    * Requires Drupal active-link.js to fire first.
    */
    $('.nav .toggle-submenu').each(function () {
      // Improve the SR label of the sub-menu toggle by prepending the name of
      // the parent menu item. For example, instead of just "Submenu", it would
      // now read "Undergraduate Submenu".
      $(this).find('.sr-only').prepend($(this).prev().text() + ' ');

      // Close the submenu when escape key used and shift focus back to the
      // toggle button.
      $(this).next().keydown(function (e) {
        if (e.key === 'Escape') {
          $(this).prev().click().focus();
        }
      });
    });

    /*
     * Provide alt text for visible screen active menu item indicators.
     */
    $('.nav .active > a').each(function () {
      if ($(this).hasClass('is-active')) {
        $(this).append('<span class="sr-only">, (current page)</span>');
      }
      else {
        $(this).append('<span class="sr-only">, (current section)</span>');
      }
    });

    /*
     * Menu toggle.
     * 1) Swaps Font Awesome icon on mobile menu when clicked.
     * Note this only sets a class. You can override what
     * icon shows for this class in your theme.
     * 2) Prevents overflow leak issues on mobile by hiding other elements.
     */
    let menuOpen = 0;
    $('.toggle-mobile-menu').click(function () {
      $(this).find('i').toggleClass('fa-bars fa-times');
      if (!menuOpen) {
        menuOpen = 1;
        $('body').addClass('mobile-menu-open');
      }
      else {
        menuOpen = 0;
        $('body').removeClass('mobile-menu-open');
      }
      window.setTimeout(function () {
        mobileMenuSanityCheck();
      }, 500);
    });
    function mobileMenuSanityCheck() {
      // Race condition can leave this out of sync with the unbutton code.
      let buttonThinks = $('.toggle-mobile-menu[aria-expanded="true"]').length;
      let bodyThinks = $('body.mobile-menu-open').length;
      if (bodyThinks !== buttonThinks) {
        $('body').toggleClass('mobile-menu-open');
      }
      if (menuOpen !== buttonThinks) {
        menuOpen = buttonThinks;
      }
    }

    /*
     * Applies toggle function to next ul in main menu
     * And swaps font awesome icon on toggle.
     */
    let menuTouch = false;
    let menuPanelStatus = 'hovering';

    $('.toggle-submenu').each( function() {
      $(this).click(function () {
        if ($(this).attr('aria-expanded') !== 'true') {
          // Toggled panel is closed; open it.
          $(this).parent().addClass('open');
          $(this).attr('aria-expanded','true');
          $(this).next().collapse('toggle');
          menuPanelStatus = 'open';
        }
        else {
          // Close open panel via .hover-lock or toggle.
          $(this).attr('aria-expanded','false');
          $(this).next().collapse('toggle');
          $(this).parent().removeClass('open');
          menuPanelStatus = 'closed';
        }
        $(this).find('i').toggleClass('fa-plus fa-minus');
        if ($(this).css('z-index') !== 'auto') {
          // Only one can be open on desktop.
          closeSubmenus($(this).prev().attr('href'));
        }

        // Disable mouse hover; menuMouseWatch & menuResizeWatch can enable.
        $('.main-menu').not('.hover-lock').addClass('hover-lock');
      });
    });

    /*
     * On hover:
     * Remove touch mode,
     * Clear .hover-lock if all menu panels are closed,
     * Maintain .hover-lock if any panels are open.
     */
    $('.main-menu .navbar-nav > .expanded').mouseenter(function () {
      if (menuTouch === true) {
        // Remove touch mode if active.
        $('.main-menu.touchable').removeClass('touchable');
        menuTouch = false;
      }
      if (menuPanelStatus === 'closed') {
        $('.main-menu.hover-lock').removeClass('hover-lock');
        menuPanelStatus = 'hovering';
      }

      // If the dropdown menu will overflow the container, add a class to shift
      // its direction so it fits.
      if ($(this).children('.submenu').length && ($(window).width() <= ($(this)[0].getBoundingClientRect().left + $(this).children('.submenu').outerWidth()))) {
        $(this).addClass('submenu--move-right');
      }
      else {
        $(this).removeClass('submenu--move-right');
      }

    });

    // Close all open panels; if HREF is passed leave that one open.
    function closeSubmenus(href) {
      $('.toggle-submenu').each(function () {
        if ($(this).prev().attr('href') !== href) {
          $(this).next('.show').collapse('toggle');
          $(this).find('i').removeClass('fa-plus fa-minus').addClass('fa-plus');
          $(this).parent().removeClass('open');
          $(this).attr('aria-expanded','false');
        }
      });
    }

    // Close open panels on resize at desktop widths.
    let resizePrev = 0;
    $(document).on('debouncedResize', function () {
      let resizeNow = psWindowEmWidth();
      let breakpoint = 61.9375;
      if (((resizeNow > breakpoint) && (breakpoint > resizePrev)) ||
          ((resizeNow < breakpoint) && (breakpoint < resizePrev))) {
        closeSubmenus();
        menuPanelStatus = 'hovering';
      }
      resizePrev = resizeNow;
    });
  });

  /*
   * Sticky Menu
   */
  let headerOffset = 100; // Override in subthemes as needed.
  let headerStuck = false;
  const jumplinksMenu = $(".jump-link-menu-horizontal");
  let isSticky = jumplinksMenu.length === 0 || !jumplinksMenu.find('ui-tabs-nav');

  if (isSticky) {
    // Let css know that there are no jumplinks and the header can get sticky.
    $('.sticky-main-menu .header').addClass('is-sticky');
  }
  function unStickMenu() {
    $('.sticky-main-menu .header').removeClass('stuck');
    headerStuck = false;
  }

  document.addEventListener('scroll', stickyWatch);

  function stickyWatch() {
    let scrollPosition = window.scrollY;
    // Don't stick if there is a sticky jump menu.
    if (headerStuck === false && isSticky) {
      if (scrollPosition > headerOffset) {
        // Window was scrolled past offset point. Check for no-stick requests.
        if ($('.no-stick').length === 0) {
          // Stick if the menu is not currently being interacted with.
          if ($('header nav').find('.show, .open, :hover').length === 0 ){
            $('.sticky-main-menu .header').addClass('stuck');
            outFromUnderMenu();
            headerStuck = true;
          }
        }
        else {
          // A module asked us to never stick; remove event listener.
          document.removeEventListener('scroll', stickyWatch);
        }
      }
    }
    else {
      // When the header is stuck: unstick when scrolling up past offset.
      if (scrollPosition < headerOffset) {
        unStickMenu();
      }
    }
  }

  // Scroll down if the sticky menu covers elements on Tab navigation.
  let outFromUnderReady = false;
  function outFromUnderMenu() {
    // Only set listeners once.
    if (outFromUnderReady === false) {
      outFromUnderReady = true;
      $('#header ~ *, #main').find('a, input, button, select, textarea, [tabindex]').focus(function () {
        let stickyMenu = document.querySelector('.header-container');
        let activeElement = document.activeElement;
        let activeRect = activeElement.getBoundingClientRect();
        let stickyMenuBottom = 0;
        if (headerStuck === true) {
          let stickyMenuRect = stickyMenu.getBoundingClientRect();
          stickyMenuBottom = stickyMenuRect.bottom;
          let stickyOffset = activeRect.bottom - stickyMenuBottom - 64;
          // Pop out from under the menu a bit if too high.
          if (stickyOffset < 64 && stickyOffset < 0) {
            window.scrollBy(0, stickyOffset);
          }
        }
        let windowHeight = window.innerHeight;
        let bottomOffset = activeRect.bottom - windowHeight;
        if (bottomOffset > 0) {
          // We're off the bottom.
          let roomToScroll = windowHeight - stickyMenuBottom;
          if (roomToScroll > 0) {
            // Room to scroll.
            window.scrollBy(0, Math.min(bottomOffset,roomToScroll));
          }
        }
      });
    }
  }

  // Disable sticky menu if jump links have been shown.
  let neverStick = false;
  $('a.sr-only, a.visually-hidden').focus(function () {
    if (neverStick === false) {
      document.removeEventListener('scroll', stickyWatch);
      if (headerStuck === true) {
        unStickMenu();
      }
      neverStick = true;
    }
  });

  /*
   * If "skip to search" is clicked in a theme with a "show/hide search"
   * toggle, show search before trying to transfer focus. Also force a scroll
   * to the top, as some themes can accept focus within the search form
   * when it is visibly hidden due to the sticky menu.
   */
  $('a[href="#edit-search-keys"]').click(function (event) {
    event.preventDefault();
    if ($('#search-bar-container').css('display') === 'none') {
      $('.toggle-searchbar').click();
    }
    else {
      window.scrollTo(0,0);
      $('input#edit-search-keys').focus();
    }
  });

  /*
   * Swaps Font Awesome icon on full width search bar
   * and adds focus to search input field
   */
  $('.toggle-searchbar').click(function () {
    $(this).find('.toggle-search-icon i').toggleClass('fa-search fa-times');
    if ($('body').hasClass('full-width-search-box')) {
      $('#search-bar-container').after($(this));
    }
    if ($(this).attr('aria-expanded') === 'false') {
      setTimeout(function () {
        if ($('input#edit-search-keys').is(":focus") !== 'true') {
          $('input#edit-search-keys').focus();
          // Prevent menu from sticking as focus is transferred.
          window.scrollTo(0,0);
        }
      }, 250);
    }
  });

})(jQuery);
