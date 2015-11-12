"use strict";

define(["config/config"], function (cfg) {
  return function Analitics() {

    if (cfg.analitics) {
      /* jshint ignore:start */
      (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
          }, i[r].l = 1 * new Date();
        a = s.createElement(o),
          m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
      /* jshint ignore:end */
      ga('create', 'UA-65547748-3', 'auto');
      ga('send', 'pageview', '/home');
    }
    else {
      window.ga = function () {
      };
    }
  };
});
