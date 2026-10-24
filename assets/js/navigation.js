(function () {
  var menuToggle = document.getElementById("menu-toggle");
  var navigation = document.getElementById("site-navigation");
  var closeButton = document.querySelector(".menu-close");
  var mobileLayout = window.matchMedia("(max-width: 1090px)");

  if (!menuToggle || !navigation || !closeButton) {
    return;
  }

  function setMenuOpen(isOpen, restoreFocus) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      closeButton.focus();
    } else if (restoreFocus && mobileLayout.matches) {
      menuToggle.focus();
    }
  }

  menuToggle.addEventListener("click", function () {
    setMenuOpen(true);
  });

  closeButton.addEventListener("click", function () {
    setMenuOpen(false, true);
  });

  navigation.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false, true);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, true);
    }
  });

  document.addEventListener("click", function (event) {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  navigation.addEventListener("focusout", function (event) {
    if (event.relatedTarget && !navigation.contains(event.relatedTarget)) {
      setMenuOpen(false);
    }
  });

  mobileLayout.addEventListener("change", function () {
    var focusedElement = document.activeElement;
    var restoreFocus = navigation.contains(focusedElement);
    setMenuOpen(false, restoreFocus);
    if (!mobileLayout.matches && (focusedElement === closeButton || focusedElement === menuToggle)) {
      navigation.querySelector("a").focus();
    }
  });

  window.addEventListener("pagehide", function () {
    setMenuOpen(false);
  });

  window.addEventListener("pageshow", function () {
    setMenuOpen(false);
  });
})();
