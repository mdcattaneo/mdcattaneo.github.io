(function () {
  var menuToggle = document.getElementById("menu-toggle");

  if (!menuToggle) {
    return;
  }

  function setMenuOpen(isOpen) {
    menuToggle.checked = isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  }

  menuToggle.addEventListener("change", function () {
    menuToggle.setAttribute("aria-expanded", String(menuToggle.checked));
  });

  document.querySelectorAll(".navigation a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  window.addEventListener("pagehide", function () {
    setMenuOpen(false);
  });

  window.addEventListener("pageshow", function () {
    setMenuOpen(false);
  });
})();
