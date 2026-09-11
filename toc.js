// Highlights the table-of-contents link for the section currently in view.
// Progressive enhancement: the page and its anchor links work without this.
(function () {
  var toc = document.querySelector(".toc");
  if (!toc) return;

  // Open on wide screens, collapsed on narrow ones. Without JS the CSS keeps
  // it visible on desktop and the <details> stays user-toggleable on mobile.
  if (toc.tagName === "DETAILS" && "matchMedia" in window) {
    var wide = window.matchMedia("(min-width: 60rem)");
    var syncOpen = function () {
      toc.open = wide.matches;
    };
    syncOpen();
    wide.addEventListener("change", syncOpen);
  }

  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  var byId = {};
  var targets = [];
  links.forEach(function (link) {
    var id = decodeURIComponent(link.getAttribute("href").slice(1));
    var el = document.getElementById(id);
    if (!el) return;
    byId[id] = link;
    targets.push(el);
  });

  var current = null;
  function setActive(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (l) {
      l.classList.remove("is-active");
      l.removeAttribute("aria-current");
    });
    if (byId[id]) {
      byId[id].classList.add("is-active");
      byId[id].setAttribute("aria-current", "true");
    }
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
