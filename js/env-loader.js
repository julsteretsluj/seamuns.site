/**
 * Load env.js without causing a 404 when the file is missing (e.g. on production
 * where env.js is gitignored). Fetches env.js; if missing, sets window.__ENV__ = {}.
 * Then loads all following scripts in order so Firebase and app still run.
 */
(function () {
  var loader = document.currentScript;
  var path = (loader && loader.getAttribute('data-env-path')) || 'env.js';
  var next = [];
  var s = loader && loader.nextElementSibling;
  while (s && s.tagName === 'SCRIPT') {
    next.push({ src: s.src, async: s.async, defer: s.defer });
    s.parentNode.removeChild(s);
    s = loader.nextElementSibling;
  }
  function isEnvScript(src) {
    return src && (src.slice(-7) === 'env.js' || src.indexOf('/env.js?') !== -1);
  }
  function runNext() {
    next.filter(function (o) { return !isEnvScript(o.src); }).forEach(function (o) {
      var el = document.createElement('script');
      el.src = o.src;
      if (o.async) el.async = true;
      if (o.defer) el.defer = true;
      document.body.appendChild(el);
    });
  }
  fetch(path)
    .then(function (r) { return r.ok ? r.text() : ''; })
    .then(function (t) {
      if (t) try { eval(t); } catch (e) {}
      if (typeof window !== 'undefined' && !window.__ENV__) window.__ENV__ = {};
    })
    .catch(function () {
      if (typeof window !== 'undefined') window.__ENV__ = window.__ENV__ || {};
    })
    .finally(runNext);
})();
