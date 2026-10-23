(function () {
  // Create an element and optionally set its class and plain-text content.
  window.el = function (t, c, x) {
    var e = document.createElement(t);
    if (c) e.className = c;
    if (x !== undefined) e.textContent = x;
    return e;
  };

  // Fetch JSON and turn HTTP errors into useful rejected promises.
  window.getJSON = function (u) {
    return fetch(u, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error(u + " (" + r.status + ")");
      return r.json();
    });
  };

  // Resolve the one shared data file beside this script, regardless of the
  // URL path used to open a page.
  var DATA_URL = new URL("data.json", document.currentScript.src).toString(),
    _p;
  window.loadData = function () {
    return (
      _p ||
      (_p = getJSON(DATA_URL).then(function (d) {
        if (!d || !Array.isArray(d.collaborators))
          throw new Error("data.json must contain a collaborators array");
        if (!Array.isArray(d.projects))
          throw new Error("data.json must contain a projects array");
        // Build local profile URLs from each collaborator’s path slug.
        var profilePage = new URL("portfolio.html", DATA_URL).toString();
        d.collaborators.forEach(function (c) {
          var p = c.portfolio_path || "",
            slug = p.split("/").filter(Boolean).pop();
          c.portfolio_url = slug
            ? profilePage + "?id=" + encodeURIComponent(slug)
            : "";
        });
        return d;
      }))
    );
  };
  window.fmtDate = function (iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  var page = document.body.getAttribute("data-page") || "";

  // Shared links shown on every page.
  var nav = [
    ["home", "Home", "home.html"],
    ["directory", "Directory", "index.html"],
    ["projects", "Projects", "projects.html"],
    ["announcements", "Announcements", "announcements.html"],
  ];

  var h =
    '<header class="top"><div class="top-in"><a class="logo" href="home.html">ORION <span>Scholar</span></a>' +
    '<form class="gsearch" role="search"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="M21 21l-6-6"/></svg>' +
    '<input id="q" name="q" type="search" placeholder="Search researchers, projects or handles" aria-label="Search directory" autocomplete="off"></form><nav class="nav" aria-label="Main">' +
    nav
      .map(function (n) {
        return (
          '<a href="' +
          n[2] +
          '" data-k="' +
          n[0] +
          '"' +
          (n[0] === page ? ' class="on"' : "") +
          ">" +
          n[1] +
          "</a>"
        );
      })
      .join("") +
    '</nav><div class="me" title="Guest">G</div></div></header>';

  // Insert the shared header, then connect its search form.
  document.getElementById("top").innerHTML = h;
  var q = document.getElementById("q");
  document.querySelector(".gsearch").addEventListener("submit", function (e) {
    e.preventDefault();
    location.href = "index.html?q=" + encodeURIComponent(q.value);
  });
  loadData()
    .then(function (d) {
      var a = document.querySelector(".nav [data-k=announcements]");
      if (a && d.site.announcements_url) {
        a.href = d.site.announcements_url;
      }
    })
    .catch(function () {});
})();
