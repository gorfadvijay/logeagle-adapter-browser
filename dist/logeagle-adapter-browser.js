var logeagle = (function () {
  "use strict";
  var e = {
      generateUTCInSeconds: {
        generateUTCInSeconds: function () {
          return Math.floor(Date.now() / 1e3);
        },
      }.generateUTCInSeconds,
      parseStacktrace: function (e) {
        var t = !1;
        if (!e.stack) {
          t = !0;
          try {
            synthethicError();
          } catch (t) {
            e.stack = t.stack;
          }
        }
        var n = "";
        "@" === e.stack[0] && (n = "@"),
          "at " === e.stack.split("").splice(0, 3).join("") && (n = "at "),
          "global code@" === e.stack.split("").splice(0, 12).join("") &&
            (n = "global code@");
        var o = e.stack.replace(n, "").split("\n");
        t && delete o[1];
        var r = (o = (o = o.filter(Boolean)).length > 1 ? o[1] : o[0]).split(
          ":"
        );
        return { line: r[r.length - 2], path: r.slice(0, -2).join(":").trim() };
      },
      includes: function (e, t) {
        for (var n = 0; n < e.length; n++) if (e[n] === t) return !0;
        return !1;
      },
    },
    t = (function () {
      var t = [];
      return {
        add: function (n) {
          var o = {
            innerText: n.target.innerText,
            timestamp: e.generateUTCInSeconds(),
            element: n.target.tagName.toLowerCase(),
            elementId: n.target.id,
            location: window.location.pathname,
          };
          t.push(o), t.length > 25 && t.shift();
        },
        get: function () {
          return t;
        },
      };
    })(),
    n = {
      focusableElements: [
        "button",
        "details",
        "input",
        "iframe",
        "select",
        "textarea",
      ],
      connectivity: { serviceURL: "https://apilogeagle.jarviot.tech" },
      adapter: {
        name: "logeagle-adapter-browser",
        type: "browser",
        version: "v2.1.0",
      },
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
      consentKey: "logeagle-analytics-enabled",
      sessionKey: "logeagle-analytics-active-session",
    };
  function o(e) {
    return (o =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function r(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function i(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      t &&
        (o = o.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, o);
    }
    return n;
  }
  function a(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? i(Object(n), !0).forEach(function (t) {
            r(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : i(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  var s,
    c,
    l,
    d =
      ((s = { sendAnalytics: !1, anonymizeData: !0 }),
      {
        set: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if ("object" !== o(e) || e.constructor !== Object)
            throw new Error(
              "the provided Log Eagle config is not a valid object"
            );
          if (
            !e.ticket ||
            "string" != typeof e.ticket ||
            50 !== e.ticket.length
          )
            throw new Error("the provided Log Eagle ticket is invalid");
          if (e.badges && e.badges.constructor !== Object)
            throw new Error(
              "the provided Log Eagle badges need to be an object"
            );
          if (e.urlBlacklist && !Array.isArray(e.urlBlacklist))
            throw new Error(
              "the provided Log Eagle URL blacklist needs to be an array"
            );
          Object.keys(e.badges || {}).forEach(function (t) {
            if ("string" != typeof e.badges[t])
              throw new Error("Log Eagle badges can only contain strings");
          }),
            (s = a({}, s, {}, e));
        },
        setSendAnalytics: function (e) {
          return (s = a({}, s, { sendAnalytics: e }));
        },
        get: function () {
          return s;
        },
      }),
    u =
      ((c = {}),
      (l = new Date()),
      {
        add: function (e) {
          e &&
            "object" === o(e) &&
            e.constructor === Object &&
            (c = a({}, c, {}, e));
        },
        setBasicAnalyticData: function () {
          var e = d.get().urlBlacklist,
            t = window.location.pathname;
          if (
            ((c.isNewVisitor = null === localStorage.getItem(n.consentKey)),
            (c.isNewSession = null === sessionStorage.getItem(n.sessionKey)),
            (c.page = "/" === t[0] ? t : "/" + t),
            (c.referrer = document.referrer || "direct"),
            e)
          )
            for (var o = 0; o < e.length; o++)
              if (-1 !== c.page.indexOf(e[o])) {
                c.page = "blacklisted";
                break;
              }
          localStorage.setItem(n.consentKey, "true"),
            sessionStorage.setItem(n.sessionKey, "true");
        },
        get: function () {
          return (
            (c.timeOnPage = Math.floor((new Date() - l) / 1e3)),
            n.isMobile && (c.timeOnPage = 0),
            c
          );
        },
      }),
    g = function () {
      var e = d.get(),
        t = n.connectivity.serviceURL;
      return e.endpoint && (t = e.endpoint), t;
    },
    y = function (e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "error",
        n = new XMLHttpRequest(),
        o = g(),
        r = "/logging/" + t;
      n.open("POST", o + r, "error" === t),
        n.setRequestHeader("Content-Type", "application/json"),
        n.send(JSON.stringify(e)),
        (n.onreadystatechange = function () {
          4 === this.readyState &&
            200 !== this.status &&
            console.error(
              "failed to send event to Log Eagle with error:",
              this.statusText
            );
        });
    },
    f = y,
    p = function (e) {
      if ("sendBeacon" in navigator && !n.isMobile) {
        var t = g();
        navigator.sendBeacon(t + "/logging/analytics", JSON.stringify(e));
      } else y(e, "analytics");
    },
    b = (function () {
      var t = [];
      return {
        add: function (n) {
          "string" == typeof n &&
            (t.push({
              timestamp: e.generateUTCInSeconds(),
              type: "log",
              log: n,
            }),
            t.length > 15 && t.shift());
        },
        get: function () {
          return t;
        },
      };
    })(),
    v = function (o) {
      var r = o.message,
        i = o.path,
        s = void 0 === i ? "" : i,
        c = o.line,
        l = void 0 === c ? "" : c,
        u = o.stack,
        g = o.constructor,
        y = d.get();
      if (r && u && y.ticket) {
        var p = a(
          {
            ticket: y.ticket,
            anonymizeData: y.anonymizeData,
            message: r,
            path: s,
            logs: b.get(),
          },
          y.badges && { badges: y.badges },
          {
            line: l.toString(),
            type: (g && g.name) || "error",
            userInteractions: t.get(),
            host: window.location.origin,
            stacktrace: u,
            adapter: n.adapter,
            timestamp: e.generateUTCInSeconds(),
          }
        );
        f(p);
      }
    },
    m = function () {
      var e = d.get(),
        t = u.get();
      (t.ticket = e.ticket), e.sendAnalytics && p(t);
    },
    h = function () {
      var t = "";
      (window.onerror = function (e, n, o, r) {
        var i =
          arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
        if (e === t) return !1;
        (t = e),
          setTimeout(function () {
            return (t = "");
          }, 2e3);
        var a = {
          message: e,
          path: n,
          line: o,
          column: (r = r || (window.event && window.event.errorCharacter)),
          stack: i.stack,
          constructor: i.constructor,
        };
        return v(a), !1;
      }),
        (window.onunhandledrejection = function (t) {
          var n = new Error();
          n.stack = t.reason.stack;
          var o = e.parseStacktrace(n),
            r = {
              message: t.reason.message,
              path: o.path,
              line: o.line,
              stack: t.reason.stack,
              constructor: { name: t.type },
            };
          v(r);
        });
    },
    w = function () {
      var o = n.focusableElements;
      window.addEventListener("focusin", function (n) {
        var r = n.target.tagName.toLowerCase();
        e.includes(o, r) && t.add(n);
      }),
        document.addEventListener("click", function (n) {
          var r = n.target.tagName.toLowerCase();
          e.includes(o, r) || t.add(n);
        });
    },
    k = function () {
      window.addEventListener("beforeunload", m);
    },
    S = function () {
      var e = console.log.bind(console);
      console.log = function () {
        for (var t = arguments.length, n = new Array(t), o = 0; o < t; o++)
          n[o] = arguments[o];
        b.add(n.join(" ")), e.apply(void 0, n);
      };
      var t = console.info.bind(console);
      console.info = function () {
        for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++)
          n[o] = arguments[o];
        b.add(n.join(" ")), t.apply(void 0, n);
      };
      var n = console.error.bind(console);
      console.error = function () {
        for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++)
          t[o] = arguments[o];
        b.add(t.join(" ")), n.apply(void 0, t);
      };
    },
    O = function (e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
        o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "",
        r = document.createElement("div"),
        i = document.createElement("p"),
        a = document.createElement("button"),
        s = document.createElement("button");
      (t && "string" == typeof t) ||
        (t =
          "We would like to collect anonymized data to improve your experience."),
        (n && "string" == typeof n) || (n = "Accept"),
        (o && "string" == typeof o) || (o = "Cancel");
      var c = function () {
          document.body.removeChild(r), e();
        },
        l = function () {
          document.body.removeChild(r);
        };
      (r.style.position = "fixed"),
        (r.style.right = "20px"),
        (r.style.bottom = "25px"),
        (r.style.left = "20px"),
        (r.style.maxWidth = "510px"),
        (r.style.display = "flex"),
        (r.style.justifyContent = "space-between"),
        (r.style.alignItems = "center"),
        (r.style.margin = "0 auto"),
        (r.style.padding = "10px"),
        (r.style.borderRadius = "7px"),
        (r.style.backgroundColor = "rgba(255, 255, 255, 0.7)"),
        (r.style.boxShadow = "rgba(190, 210, 250, 0.8) 0 2px 20px 0"),
        (r.style.backdropFilter = "blur(20px)"),
        (r.style.boxSizing = "border-box"),
        (r.id = "logeagle-banner"),
        (i.style.margin = "0"),
        (i.style.fontFamily = "Helvetica, sans-serif"),
        (i.style.fontSize = "12px"),
        (i.style.color = "#5B6F8C"),
        (i.innerText = t),
        (a.style.padding = "5px 10px"),
        (a.style.border = "none"),
        (a.style.borderRadius = "4px"),
        (a.style.backgroundColor = "#0368ff"),
        (a.style.fontFamily = "Helvetica, sans-serif"),
        (a.style.fontSize = "12px"),
        (a.style.color = "white"),
        (a.style.outline = "none"),
        (a.style.cursor = "pointer"),
        (a.innerText = n),
        (a.onclick = c),
        (s.style.padding = "5px 10px"),
        (s.style.border = "none"),
        (s.style.backgroundColor = "transparent"),
        (s.style.fontFamily = "Helvetica, sans-serif"),
        (s.style.fontWeight = "500"),
        (s.style.color = "#5B6F8C"),
        (s.style.cursor = "pointer"),
        (s.innerText = o),
        (s.onclick = l),
        r.appendChild(i),
        r.appendChild(s),
        r.appendChild(a),
        (window.onload = function () {
          return document.body.appendChild(r);
        });
    },
    x = function () {
      d.setSendAnalytics(!0), u.setBasicAnalyticData(), n.isMobile ? m() : k();
    };
  return {
    init: function (e) {
      var t = null !== localStorage.getItem(n.consentKey);
      "sendAnalytics" in e || (e.sendAnalytics = t),
        d.set(e),
        e.showBanner &&
          !t &&
          O(x, e.bannerText, e.bannerAcceptLabel, e.bannerRejectLabel),
        S(),
        w(),
        h(),
        e.sendAnalytics && (u.setBasicAnalyticData(), n.isMobile ? m() : k());
    },
    emitError: function (t) {
      var n = e.parseStacktrace(t);
      (t.line = n.line), (t.path = n.path), v(t);
    },
    enableAnalytics: x,
    disableAnalytics: function () {
      d.setSendAnalytics(!1),
        sessionStorage.removeItem(n.sessionKey),
        localStorage.removeItem(n.consentKey);
    },
  };
})();