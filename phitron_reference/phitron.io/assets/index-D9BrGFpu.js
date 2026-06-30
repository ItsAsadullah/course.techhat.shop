import { k as de, a6 as pe, a7 as Ce, l as ge } from "./index-3GFABpq9.js";
import { r as _e } from "./warning-C20GYw-A.js";
import { r as Ee } from "./react-lifecycles-compat.es-Crfa1e2_.js";
var V = { exports: {} },
  k = {},
  G = { exports: {} },
  N = {},
  J = { exports: {} },
  ee;
function ve() {
  return (
    ee ||
      ((ee = 1),
      (function (g, h) {
        Object.defineProperty(h, "__esModule", { value: !0 }), (h.default = l);
        /*!
         * Adapted from jQuery UI core
         *
         * http://jqueryui.com
         *
         * Copyright 2014 jQuery Foundation and other contributors
         * Released under the MIT license.
         * http://jquery.org/license
         *
         * http://api.jqueryui.com/category/ui-core/
         */ var y = "none",
          f = "contents",
          c = /^(input|select|textarea|button|object|iframe)$/;
        function d(o, s) {
          return (
            s.getPropertyValue("overflow") !== "visible" ||
            (o.scrollWidth <= 0 && o.scrollHeight <= 0)
          );
        }
        function E(o) {
          var s = o.offsetWidth <= 0 && o.offsetHeight <= 0;
          if (s && !o.innerHTML) return !0;
          try {
            var a = window.getComputedStyle(o),
              p = a.getPropertyValue("display");
            return s ? p !== f && d(o, a) : p === y;
          } catch {
            return console.warn("Failed to inspect element style"), !1;
          }
        }
        function t(o) {
          for (
            var s = o, a = o.getRootNode && o.getRootNode();
            s && s !== document.body;

          ) {
            if ((a && s === a && (s = a.host.parentNode), E(s))) return !1;
            s = s.parentNode;
          }
          return !0;
        }
        function _(o, s) {
          var a = o.nodeName.toLowerCase(),
            p = (c.test(a) && !o.disabled) || (a === "a" && o.href) || s;
          return p && t(o);
        }
        function m(o) {
          var s = o.getAttribute("tabindex");
          s === null && (s = void 0);
          var a = isNaN(s);
          return (a || s >= 0) && _(o, !a);
        }
        function l(o) {
          var s = [].slice
            .call(o.querySelectorAll("*"), 0)
            .reduce(function (a, p) {
              return a.concat(p.shadowRoot ? l(p.shadowRoot) : [p]);
            }, []);
          return s.filter(m);
        }
        g.exports = h.default;
      })(J, J.exports)),
    J.exports
  );
}
var te;
function Me() {
  if (te) return N;
  (te = 1),
    Object.defineProperty(N, "__esModule", { value: !0 }),
    (N.resetState = E),
    (N.log = t),
    (N.handleBlur = _),
    (N.handleFocus = m),
    (N.markForFocusLater = l),
    (N.returnFocus = o),
    (N.popWithoutFocus = s),
    (N.setupScopedFocus = a),
    (N.teardownScopedFocus = p);
  var g = ve(),
    h = y(g);
  function y(O) {
    return O && O.__esModule ? O : { default: O };
  }
  var f = [],
    c = null,
    d = !1;
  function E() {
    f = [];
  }
  function t() {}
  function _() {
    d = !0;
  }
  function m() {
    if (d) {
      if (((d = !1), !c)) return;
      setTimeout(function () {
        if (!c.contains(document.activeElement)) {
          var O = (0, h.default)(c)[0] || c;
          O.focus();
        }
      }, 0);
    }
  }
  function l() {
    f.push(document.activeElement);
  }
  function o() {
    var O = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1,
      T = null;
    try {
      f.length !== 0 && ((T = f.pop()), T.focus({ preventScroll: O }));
      return;
    } catch {
      console.warn(
        [
          "You tried to return focus to",
          T,
          "but it is not in the DOM anymore",
        ].join(" ")
      );
    }
  }
  function s() {
    f.length > 0 && f.pop();
  }
  function a(O) {
    (c = O),
      window.addEventListener
        ? (window.addEventListener("blur", _, !1),
          document.addEventListener("focus", m, !0))
        : (window.attachEvent("onBlur", _), document.attachEvent("onFocus", m));
  }
  function p() {
    (c = null),
      window.addEventListener
        ? (window.removeEventListener("blur", _),
          document.removeEventListener("focus", m))
        : (window.detachEvent("onBlur", _), document.detachEvent("onFocus", m));
  }
  return N;
}
var Q = { exports: {} },
  ne;
function Se() {
  return (
    ne ||
      ((ne = 1),
      (function (g, h) {
        Object.defineProperty(h, "__esModule", { value: !0 }), (h.default = E);
        var y = ve(),
          f = c(y);
        function c(t) {
          return t && t.__esModule ? t : { default: t };
        }
        function d() {
          var t =
            arguments.length > 0 && arguments[0] !== void 0
              ? arguments[0]
              : document;
          return t.activeElement.shadowRoot
            ? d(t.activeElement.shadowRoot)
            : t.activeElement;
        }
        function E(t, _) {
          var m = (0, f.default)(t);
          if (!m.length) {
            _.preventDefault();
            return;
          }
          var l = void 0,
            o = _.shiftKey,
            s = m[0],
            a = m[m.length - 1],
            p = d();
          if (t === p) {
            if (!o) return;
            l = a;
          }
          if ((a === p && !o && (l = s), s === p && o && (l = a), l)) {
            _.preventDefault(), l.focus();
            return;
          }
          var O = /(\bChrome\b|\bSafari\b)\//.exec(navigator.userAgent),
            T =
              O != null &&
              O[1] != "Chrome" &&
              /\biPod\b|\biPad\b/g.exec(navigator.userAgent) == null;
          if (T) {
            var R = m.indexOf(p);
            if ((R > -1 && (R += o ? -1 : 1), (l = m[R]), typeof l > "u")) {
              _.preventDefault(), (l = o ? a : s), l.focus();
              return;
            }
            _.preventDefault(), l.focus();
          }
        }
        g.exports = h.default;
      })(Q, Q.exports)),
    Q.exports
  );
}
var A = {},
  L = {},
  X = { exports: {} };
/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/ var re;
function we() {
  return (
    re ||
      ((re = 1),
      (function (g) {
        (function () {
          var h = !!(
              typeof window < "u" &&
              window.document &&
              window.document.createElement
            ),
            y = {
              canUseDOM: h,
              canUseWorkers: typeof Worker < "u",
              canUseEventListeners:
                h && !!(window.addEventListener || window.attachEvent),
              canUseViewport: h && !!window.screen,
            };
          g.exports ? (g.exports = y) : (window.ExecutionEnvironment = y);
        })();
      })(X)),
    X.exports
  );
}
var oe;
function Z() {
  if (oe) return L;
  (oe = 1),
    Object.defineProperty(L, "__esModule", { value: !0 }),
    (L.canUseDOM = L.SafeNodeList = L.SafeHTMLCollection = void 0);
  var g = we(),
    h = y(g);
  function y(d) {
    return d && d.__esModule ? d : { default: d };
  }
  var f = h.default,
    c = f.canUseDOM ? window.HTMLElement : {};
  return (
    (L.SafeHTMLCollection = f.canUseDOM ? window.HTMLCollection : {}),
    (L.SafeNodeList = f.canUseDOM ? window.NodeList : {}),
    (L.canUseDOM = f.canUseDOM),
    (L.default = c),
    L
  );
}
var ae;
function me() {
  if (ae) return A;
  (ae = 1),
    Object.defineProperty(A, "__esModule", { value: !0 }),
    (A.resetState = d),
    (A.log = E),
    (A.assertNodeList = t),
    (A.setElement = _),
    (A.validateElement = m),
    (A.hide = l),
    (A.show = o),
    (A.documentNotReadyOrSSRTesting = s);
  var g = _e(),
    h = f(g),
    y = Z();
  function f(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var c = null;
  function d() {
    c &&
      (c.removeAttribute
        ? c.removeAttribute("aria-hidden")
        : c.length != null
        ? c.forEach(function (a) {
            return a.removeAttribute("aria-hidden");
          })
        : document.querySelectorAll(c).forEach(function (a) {
            return a.removeAttribute("aria-hidden");
          })),
      (c = null);
  }
  function E() {}
  function t(a, p) {
    if (!a || !a.length)
      throw new Error(
        "react-modal: No elements were found for selector " + p + "."
      );
  }
  function _(a) {
    var p = a;
    if (typeof p == "string" && y.canUseDOM) {
      var O = document.querySelectorAll(p);
      t(O, p), (p = O);
    }
    return (c = p || c), c;
  }
  function m(a) {
    var p = a || c;
    return p
      ? Array.isArray(p) || p instanceof HTMLCollection || p instanceof NodeList
        ? p
        : [p]
      : ((0, h.default)(
          !1,
          [
            "react-modal: App element is not defined.",
            "Please use `Modal.setAppElement(el)` or set `appElement={el}`.",
            "This is needed so screen readers don't see main content",
            "when modal is opened. It is not recommended, but you can opt-out",
            "by setting `ariaHideApp={false}`.",
          ].join(" ")
        ),
        []);
  }
  function l(a) {
    var p = !0,
      O = !1,
      T = void 0;
    try {
      for (
        var R = m(a)[Symbol.iterator](), P;
        !(p = (P = R.next()).done);
        p = !0
      ) {
        var F = P.value;
        F.setAttribute("aria-hidden", "true");
      }
    } catch (D) {
      (O = !0), (T = D);
    } finally {
      try {
        !p && R.return && R.return();
      } finally {
        if (O) throw T;
      }
    }
  }
  function o(a) {
    var p = !0,
      O = !1,
      T = void 0;
    try {
      for (
        var R = m(a)[Symbol.iterator](), P;
        !(p = (P = R.next()).done);
        p = !0
      ) {
        var F = P.value;
        F.removeAttribute("aria-hidden");
      }
    } catch (D) {
      (O = !0), (T = D);
    } finally {
      try {
        !p && R.return && R.return();
      } finally {
        if (O) throw T;
      }
    }
  }
  function s() {
    c = null;
  }
  return A;
}
var W = {},
  le;
function Te() {
  if (le) return W;
  (le = 1),
    Object.defineProperty(W, "__esModule", { value: !0 }),
    (W.resetState = f),
    (W.log = c);
  var g = {},
    h = {};
  function y(m, l) {
    m.classList.remove(l);
  }
  function f() {
    var m = document.getElementsByTagName("html")[0];
    for (var l in g) y(m, g[l]);
    var o = document.body;
    for (var s in h) y(o, h[s]);
    (g = {}), (h = {});
  }
  function c() {}
  var d = function (l, o) {
      return l[o] || (l[o] = 0), (l[o] += 1), o;
    },
    E = function (l, o) {
      return l[o] && (l[o] -= 1), o;
    },
    t = function (l, o, s) {
      s.forEach(function (a) {
        d(o, a), l.add(a);
      });
    },
    _ = function (l, o, s) {
      s.forEach(function (a) {
        E(o, a), o[a] === 0 && l.remove(a);
      });
    };
  return (
    (W.add = function (l, o) {
      return t(
        l.classList,
        l.nodeName.toLowerCase() == "html" ? g : h,
        o.split(" ")
      );
    }),
    (W.remove = function (l, o) {
      return _(
        l.classList,
        l.nodeName.toLowerCase() == "html" ? g : h,
        o.split(" ")
      );
    }),
    W
  );
}
var K = {},
  se;
function he() {
  if (se) return K;
  (se = 1),
    Object.defineProperty(K, "__esModule", { value: !0 }),
    (K.log = f),
    (K.resetState = c);
  function g(d, E) {
    if (!(d instanceof E))
      throw new TypeError("Cannot call a class as a function");
  }
  var h = function d() {
      var E = this;
      g(this, d),
        (this.register = function (t) {
          E.openInstances.indexOf(t) === -1 &&
            (E.openInstances.push(t), E.emit("register"));
        }),
        (this.deregister = function (t) {
          var _ = E.openInstances.indexOf(t);
          _ !== -1 && (E.openInstances.splice(_, 1), E.emit("deregister"));
        }),
        (this.subscribe = function (t) {
          E.subscribers.push(t);
        }),
        (this.emit = function (t) {
          E.subscribers.forEach(function (_) {
            return _(t, E.openInstances.slice());
          });
        }),
        (this.openInstances = []),
        (this.subscribers = []);
    },
    y = new h();
  function f() {
    console.log("portalOpenInstances ----------"),
      console.log(y.openInstances.length),
      y.openInstances.forEach(function (d) {
        return console.log(d);
      }),
      console.log("end portalOpenInstances ----------");
  }
  function c() {
    y = new h();
  }
  return (K.default = y), K;
}
var $ = {},
  ue;
function Re() {
  if (ue) return $;
  (ue = 1),
    Object.defineProperty($, "__esModule", { value: !0 }),
    ($.resetState = E),
    ($.log = t);
  var g = he(),
    h = y(g);
  function y(l) {
    return l && l.__esModule ? l : { default: l };
  }
  var f = void 0,
    c = void 0,
    d = [];
  function E() {
    for (var l = [f, c], o = 0; o < l.length; o++) {
      var s = l[o];
      s && s.parentNode && s.parentNode.removeChild(s);
    }
    (f = c = null), (d = []);
  }
  function t() {
    console.log("bodyTrap ----------"), console.log(d.length);
    for (var l = [f, c], o = 0; o < l.length; o++) {
      var s = l[o],
        a = s || {};
      console.log(a.nodeName, a.className, a.id);
    }
    console.log("edn bodyTrap ----------");
  }
  function _() {
    d.length !== 0 && d[d.length - 1].focusContent();
  }
  function m(l, o) {
    !f &&
      !c &&
      ((f = document.createElement("div")),
      f.setAttribute("data-react-modal-body-trap", ""),
      (f.style.position = "absolute"),
      (f.style.opacity = "0"),
      f.setAttribute("tabindex", "0"),
      f.addEventListener("focus", _),
      (c = f.cloneNode()),
      c.addEventListener("focus", _)),
      (d = o),
      d.length > 0
        ? (document.body.firstChild !== f &&
            document.body.insertBefore(f, document.body.firstChild),
          document.body.lastChild !== c && document.body.appendChild(c))
        : (f.parentElement && f.parentElement.removeChild(f),
          c.parentElement && c.parentElement.removeChild(c));
  }
  return h.default.subscribe(m), $;
}
var ie;
function Ne() {
  return (
    ie ||
      ((ie = 1),
      (function (g, h) {
        Object.defineProperty(h, "__esModule", { value: !0 });
        var y =
            Object.assign ||
            function (r) {
              for (var n = 1; n < arguments.length; n++) {
                var b = arguments[n];
                for (var e in b)
                  Object.prototype.hasOwnProperty.call(b, e) && (r[e] = b[e]);
              }
              return r;
            },
          f =
            typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
              ? function (r) {
                  return typeof r;
                }
              : function (r) {
                  return r &&
                    typeof Symbol == "function" &&
                    r.constructor === Symbol &&
                    r !== Symbol.prototype
                    ? "symbol"
                    : typeof r;
                },
          c = (function () {
            function r(n, b) {
              for (var e = 0; e < b.length; e++) {
                var u = b[e];
                (u.enumerable = u.enumerable || !1),
                  (u.configurable = !0),
                  "value" in u && (u.writable = !0),
                  Object.defineProperty(n, u.key, u);
              }
            }
            return function (n, b, e) {
              return b && r(n.prototype, b), e && r(n, e), n;
            };
          })(),
          d = de(),
          E = pe(),
          t = B(E),
          _ = Me(),
          m = D(_),
          l = Se(),
          o = B(l),
          s = me(),
          a = D(s),
          p = Te(),
          O = D(p),
          T = Z(),
          R = B(T),
          P = he(),
          F = B(P);
        Re();
        function D(r) {
          if (r && r.__esModule) return r;
          var n = {};
          if (r != null)
            for (var b in r)
              Object.prototype.hasOwnProperty.call(r, b) && (n[b] = r[b]);
          return (n.default = r), n;
        }
        function B(r) {
          return r && r.__esModule ? r : { default: r };
        }
        function q(r, n) {
          if (!(r instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function j(r, n) {
          if (!r)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return n && (typeof n == "object" || typeof n == "function") ? n : r;
        }
        function Y(r, n) {
          if (typeof n != "function" && n !== null)
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof n
            );
          (r.prototype = Object.create(n && n.prototype, {
            constructor: {
              value: r,
              enumerable: !1,
              writable: !0,
              configurable: !0,
            },
          })),
            n &&
              (Object.setPrototypeOf
                ? Object.setPrototypeOf(r, n)
                : (r.__proto__ = n));
        }
        var H = {
            overlay: "ReactModal__Overlay",
            content: "ReactModal__Content",
          },
          I = function (n) {
            return n.code === "Tab" || n.keyCode === 9;
          },
          v = function (n) {
            return n.code === "Escape" || n.keyCode === 27;
          },
          i = 0,
          C = (function (r) {
            Y(n, r);
            function n(b) {
              q(this, n);
              var e = j(
                this,
                (n.__proto__ || Object.getPrototypeOf(n)).call(this, b)
              );
              return (
                (e.setOverlayRef = function (u) {
                  (e.overlay = u), e.props.overlayRef && e.props.overlayRef(u);
                }),
                (e.setContentRef = function (u) {
                  (e.content = u), e.props.contentRef && e.props.contentRef(u);
                }),
                (e.afterClose = function () {
                  var u = e.props,
                    S = u.appElement,
                    M = u.ariaHideApp,
                    w = u.htmlOpenClassName,
                    x = u.bodyOpenClassName,
                    U = u.parentSelector,
                    z = (U && U().ownerDocument) || document;
                  x && O.remove(z.body, x),
                    w && O.remove(z.getElementsByTagName("html")[0], w),
                    M && i > 0 && ((i -= 1), i === 0 && a.show(S)),
                    e.props.shouldFocusAfterRender &&
                      (e.props.shouldReturnFocusAfterClose
                        ? (m.returnFocus(e.props.preventScroll),
                          m.teardownScopedFocus())
                        : m.popWithoutFocus()),
                    e.props.onAfterClose && e.props.onAfterClose(),
                    F.default.deregister(e);
                }),
                (e.open = function () {
                  e.beforeOpen(),
                    e.state.afterOpen && e.state.beforeClose
                      ? (clearTimeout(e.closeTimer),
                        e.setState({ beforeClose: !1 }))
                      : (e.props.shouldFocusAfterRender &&
                          (m.setupScopedFocus(e.node), m.markForFocusLater()),
                        e.setState({ isOpen: !0 }, function () {
                          e.openAnimationFrame = requestAnimationFrame(
                            function () {
                              e.setState({ afterOpen: !0 }),
                                e.props.isOpen &&
                                  e.props.onAfterOpen &&
                                  e.props.onAfterOpen({
                                    overlayEl: e.overlay,
                                    contentEl: e.content,
                                  });
                            }
                          );
                        }));
                }),
                (e.close = function () {
                  e.props.closeTimeoutMS > 0
                    ? e.closeWithTimeout()
                    : e.closeWithoutTimeout();
                }),
                (e.focusContent = function () {
                  return (
                    e.content &&
                    !e.contentHasFocus() &&
                    e.content.focus({ preventScroll: !0 })
                  );
                }),
                (e.closeWithTimeout = function () {
                  var u = Date.now() + e.props.closeTimeoutMS;
                  e.setState({ beforeClose: !0, closesAt: u }, function () {
                    e.closeTimer = setTimeout(
                      e.closeWithoutTimeout,
                      e.state.closesAt - Date.now()
                    );
                  });
                }),
                (e.closeWithoutTimeout = function () {
                  e.setState(
                    {
                      beforeClose: !1,
                      isOpen: !1,
                      afterOpen: !1,
                      closesAt: null,
                    },
                    e.afterClose
                  );
                }),
                (e.handleKeyDown = function (u) {
                  I(u) && (0, o.default)(e.content, u),
                    e.props.shouldCloseOnEsc &&
                      v(u) &&
                      (u.stopPropagation(), e.requestClose(u));
                }),
                (e.handleOverlayOnClick = function (u) {
                  e.shouldClose === null && (e.shouldClose = !0),
                    e.shouldClose &&
                      e.props.shouldCloseOnOverlayClick &&
                      (e.ownerHandlesClose()
                        ? e.requestClose(u)
                        : e.focusContent()),
                    (e.shouldClose = null);
                }),
                (e.handleContentOnMouseUp = function () {
                  e.shouldClose = !1;
                }),
                (e.handleOverlayOnMouseDown = function (u) {
                  !e.props.shouldCloseOnOverlayClick &&
                    u.target == e.overlay &&
                    u.preventDefault();
                }),
                (e.handleContentOnClick = function () {
                  e.shouldClose = !1;
                }),
                (e.handleContentOnMouseDown = function () {
                  e.shouldClose = !1;
                }),
                (e.requestClose = function (u) {
                  return e.ownerHandlesClose() && e.props.onRequestClose(u);
                }),
                (e.ownerHandlesClose = function () {
                  return e.props.onRequestClose;
                }),
                (e.shouldBeClosed = function () {
                  return !e.state.isOpen && !e.state.beforeClose;
                }),
                (e.contentHasFocus = function () {
                  return (
                    document.activeElement === e.content ||
                    e.content.contains(document.activeElement)
                  );
                }),
                (e.buildClassName = function (u, S) {
                  var M =
                      (typeof S > "u" ? "undefined" : f(S)) === "object"
                        ? S
                        : {
                            base: H[u],
                            afterOpen: H[u] + "--after-open",
                            beforeClose: H[u] + "--before-close",
                          },
                    w = M.base;
                  return (
                    e.state.afterOpen && (w = w + " " + M.afterOpen),
                    e.state.beforeClose && (w = w + " " + M.beforeClose),
                    typeof S == "string" && S ? w + " " + S : w
                  );
                }),
                (e.attributesFromObject = function (u, S) {
                  return Object.keys(S).reduce(function (M, w) {
                    return (M[u + "-" + w] = S[w]), M;
                  }, {});
                }),
                (e.state = { afterOpen: !1, beforeClose: !1 }),
                (e.shouldClose = null),
                (e.moveFromContentToOverlay = null),
                e
              );
            }
            return (
              c(n, [
                {
                  key: "componentDidMount",
                  value: function () {
                    this.props.isOpen && this.open();
                  },
                },
                {
                  key: "componentDidUpdate",
                  value: function (e, u) {
                    this.props.isOpen && !e.isOpen
                      ? this.open()
                      : !this.props.isOpen && e.isOpen && this.close(),
                      this.props.shouldFocusAfterRender &&
                        this.state.isOpen &&
                        !u.isOpen &&
                        this.focusContent();
                  },
                },
                {
                  key: "componentWillUnmount",
                  value: function () {
                    this.state.isOpen && this.afterClose(),
                      clearTimeout(this.closeTimer),
                      cancelAnimationFrame(this.openAnimationFrame);
                  },
                },
                {
                  key: "beforeOpen",
                  value: function () {
                    var e = this.props,
                      u = e.appElement,
                      S = e.ariaHideApp,
                      M = e.htmlOpenClassName,
                      w = e.bodyOpenClassName,
                      x = e.parentSelector,
                      U = (x && x().ownerDocument) || document;
                    w && O.add(U.body, w),
                      M && O.add(U.getElementsByTagName("html")[0], M),
                      S && ((i += 1), a.hide(u)),
                      F.default.register(this);
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var e = this.props,
                      u = e.id,
                      S = e.className,
                      M = e.overlayClassName,
                      w = e.defaultStyles,
                      x = e.children,
                      U = S ? {} : w.content,
                      z = M ? {} : w.overlay;
                    if (this.shouldBeClosed()) return null;
                    var ye = {
                        ref: this.setOverlayRef,
                        className: this.buildClassName("overlay", M),
                        style: y({}, z, this.props.style.overlay),
                        onClick: this.handleOverlayOnClick,
                        onMouseDown: this.handleOverlayOnMouseDown,
                      },
                      be = y(
                        {
                          id: u,
                          ref: this.setContentRef,
                          style: y({}, U, this.props.style.content),
                          className: this.buildClassName("content", S),
                          tabIndex: "-1",
                          onKeyDown: this.handleKeyDown,
                          onMouseDown: this.handleContentOnMouseDown,
                          onMouseUp: this.handleContentOnMouseUp,
                          onClick: this.handleContentOnClick,
                          role: this.props.role,
                          "aria-label": this.props.contentLabel,
                        },
                        this.attributesFromObject(
                          "aria",
                          y({ modal: !0 }, this.props.aria)
                        ),
                        this.attributesFromObject(
                          "data",
                          this.props.data || {}
                        ),
                        { "data-testid": this.props.testId }
                      ),
                      Oe = this.props.contentElement(be, x);
                    return this.props.overlayElement(ye, Oe);
                  },
                },
              ]),
              n
            );
          })(d.Component);
        (C.defaultProps = {
          style: { overlay: {}, content: {} },
          defaultStyles: {},
        }),
          (C.propTypes = {
            isOpen: t.default.bool.isRequired,
            defaultStyles: t.default.shape({
              content: t.default.object,
              overlay: t.default.object,
            }),
            style: t.default.shape({
              content: t.default.object,
              overlay: t.default.object,
            }),
            className: t.default.oneOfType([
              t.default.string,
              t.default.object,
            ]),
            overlayClassName: t.default.oneOfType([
              t.default.string,
              t.default.object,
            ]),
            parentSelector: t.default.func,
            bodyOpenClassName: t.default.string,
            htmlOpenClassName: t.default.string,
            ariaHideApp: t.default.bool,
            appElement: t.default.oneOfType([
              t.default.instanceOf(R.default),
              t.default.instanceOf(T.SafeHTMLCollection),
              t.default.instanceOf(T.SafeNodeList),
              t.default.arrayOf(t.default.instanceOf(R.default)),
            ]),
            onAfterOpen: t.default.func,
            onAfterClose: t.default.func,
            onRequestClose: t.default.func,
            closeTimeoutMS: t.default.number,
            shouldFocusAfterRender: t.default.bool,
            shouldCloseOnOverlayClick: t.default.bool,
            shouldReturnFocusAfterClose: t.default.bool,
            preventScroll: t.default.bool,
            role: t.default.string,
            contentLabel: t.default.string,
            aria: t.default.object,
            data: t.default.object,
            children: t.default.node,
            shouldCloseOnEsc: t.default.bool,
            overlayRef: t.default.func,
            contentRef: t.default.func,
            id: t.default.string,
            overlayElement: t.default.func,
            contentElement: t.default.func,
            testId: t.default.string,
          }),
          (h.default = C),
          (g.exports = h.default);
      })(G, G.exports)),
    G.exports
  );
}
var fe;
function Ae() {
  if (fe) return k;
  (fe = 1),
    Object.defineProperty(k, "__esModule", { value: !0 }),
    (k.bodyOpenClassName = k.portalClassName = void 0);
  var g =
      Object.assign ||
      function (v) {
        for (var i = 1; i < arguments.length; i++) {
          var C = arguments[i];
          for (var r in C)
            Object.prototype.hasOwnProperty.call(C, r) && (v[r] = C[r]);
        }
        return v;
      },
    h = (function () {
      function v(i, C) {
        for (var r = 0; r < C.length; r++) {
          var n = C[r];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(i, n.key, n);
        }
      }
      return function (i, C, r) {
        return C && v(i.prototype, C), r && v(i, r), i;
      };
    })(),
    y = de(),
    f = T(y),
    c = Ce(),
    d = T(c),
    E = pe(),
    t = T(E),
    _ = Ne(),
    m = T(_),
    l = me(),
    o = O(l),
    s = Z(),
    a = T(s),
    p = Ee;
  function O(v) {
    if (v && v.__esModule) return v;
    var i = {};
    if (v != null)
      for (var C in v)
        Object.prototype.hasOwnProperty.call(v, C) && (i[C] = v[C]);
    return (i.default = v), i;
  }
  function T(v) {
    return v && v.__esModule ? v : { default: v };
  }
  function R(v, i) {
    if (!(v instanceof i))
      throw new TypeError("Cannot call a class as a function");
  }
  function P(v, i) {
    if (!v)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return i && (typeof i == "object" || typeof i == "function") ? i : v;
  }
  function F(v, i) {
    if (typeof i != "function" && i !== null)
      throw new TypeError(
        "Super expression must either be null or a function, not " + typeof i
      );
    (v.prototype = Object.create(i && i.prototype, {
      constructor: { value: v, enumerable: !1, writable: !0, configurable: !0 },
    })),
      i &&
        (Object.setPrototypeOf
          ? Object.setPrototypeOf(v, i)
          : (v.__proto__ = i));
  }
  var D = (k.portalClassName = "ReactModalPortal"),
    B = (k.bodyOpenClassName = "ReactModal__Body--open"),
    q = s.canUseDOM && d.default.createPortal !== void 0,
    j = function (i) {
      return document.createElement(i);
    },
    Y = function () {
      return q
        ? d.default.createPortal
        : d.default.unstable_renderSubtreeIntoContainer;
    };
  function H(v) {
    return v();
  }
  var I = (function (v) {
    F(i, v);
    function i() {
      var C, r, n, b;
      R(this, i);
      for (var e = arguments.length, u = Array(e), S = 0; S < e; S++)
        u[S] = arguments[S];
      return (
        (b =
          ((r =
            ((n = P(
              this,
              (C = i.__proto__ || Object.getPrototypeOf(i)).call.apply(
                C,
                [this].concat(u)
              )
            )),
            n)),
          (n.removePortal = function () {
            !q && d.default.unmountComponentAtNode(n.node);
            var M = H(n.props.parentSelector);
            M && M.contains(n.node)
              ? M.removeChild(n.node)
              : console.warn(
                  'React-Modal: "parentSelector" prop did not returned any DOM element. Make sure that the parent element is unmounted to avoid any memory leaks.'
                );
          }),
          (n.portalRef = function (M) {
            n.portal = M;
          }),
          (n.renderPortal = function (M) {
            var w = Y(),
              x = w(
                n,
                f.default.createElement(
                  m.default,
                  g({ defaultStyles: i.defaultStyles }, M)
                ),
                n.node
              );
            n.portalRef(x);
          }),
          r)),
        P(n, b)
      );
    }
    return (
      h(
        i,
        [
          {
            key: "componentDidMount",
            value: function () {
              if (s.canUseDOM) {
                q || (this.node = j("div")),
                  (this.node.className = this.props.portalClassName);
                var r = H(this.props.parentSelector);
                r.appendChild(this.node), !q && this.renderPortal(this.props);
              }
            },
          },
          {
            key: "getSnapshotBeforeUpdate",
            value: function (r) {
              var n = H(r.parentSelector),
                b = H(this.props.parentSelector);
              return { prevParent: n, nextParent: b };
            },
          },
          {
            key: "componentDidUpdate",
            value: function (r, n, b) {
              if (s.canUseDOM) {
                var e = this.props,
                  u = e.isOpen,
                  S = e.portalClassName;
                r.portalClassName !== S && (this.node.className = S);
                var M = b.prevParent,
                  w = b.nextParent;
                w !== M && (M.removeChild(this.node), w.appendChild(this.node)),
                  !(!r.isOpen && !u) && !q && this.renderPortal(this.props);
              }
            },
          },
          {
            key: "componentWillUnmount",
            value: function () {
              if (!(!s.canUseDOM || !this.node || !this.portal)) {
                var r = this.portal.state,
                  n = Date.now(),
                  b =
                    r.isOpen &&
                    this.props.closeTimeoutMS &&
                    (r.closesAt || n + this.props.closeTimeoutMS);
                b
                  ? (r.beforeClose || this.portal.closeWithTimeout(),
                    setTimeout(this.removePortal, b - n))
                  : this.removePortal();
              }
            },
          },
          {
            key: "render",
            value: function () {
              if (!s.canUseDOM || !q) return null;
              !this.node && q && (this.node = j("div"));
              var r = Y();
              return r(
                f.default.createElement(
                  m.default,
                  g(
                    { ref: this.portalRef, defaultStyles: i.defaultStyles },
                    this.props
                  )
                ),
                this.node
              );
            },
          },
        ],
        [
          {
            key: "setAppElement",
            value: function (r) {
              o.setElement(r);
            },
          },
        ]
      ),
      i
    );
  })(y.Component);
  return (
    (I.propTypes = {
      isOpen: t.default.bool.isRequired,
      style: t.default.shape({
        content: t.default.object,
        overlay: t.default.object,
      }),
      portalClassName: t.default.string,
      bodyOpenClassName: t.default.string,
      htmlOpenClassName: t.default.string,
      className: t.default.oneOfType([
        t.default.string,
        t.default.shape({
          base: t.default.string.isRequired,
          afterOpen: t.default.string.isRequired,
          beforeClose: t.default.string.isRequired,
        }),
      ]),
      overlayClassName: t.default.oneOfType([
        t.default.string,
        t.default.shape({
          base: t.default.string.isRequired,
          afterOpen: t.default.string.isRequired,
          beforeClose: t.default.string.isRequired,
        }),
      ]),
      appElement: t.default.oneOfType([
        t.default.instanceOf(a.default),
        t.default.instanceOf(s.SafeHTMLCollection),
        t.default.instanceOf(s.SafeNodeList),
        t.default.arrayOf(t.default.instanceOf(a.default)),
      ]),
      onAfterOpen: t.default.func,
      onRequestClose: t.default.func,
      closeTimeoutMS: t.default.number,
      ariaHideApp: t.default.bool,
      shouldFocusAfterRender: t.default.bool,
      shouldCloseOnOverlayClick: t.default.bool,
      shouldReturnFocusAfterClose: t.default.bool,
      preventScroll: t.default.bool,
      parentSelector: t.default.func,
      aria: t.default.object,
      data: t.default.object,
      role: t.default.string,
      contentLabel: t.default.string,
      shouldCloseOnEsc: t.default.bool,
      overlayRef: t.default.func,
      contentRef: t.default.func,
      id: t.default.string,
      overlayElement: t.default.func,
      contentElement: t.default.func,
    }),
    (I.defaultProps = {
      isOpen: !1,
      portalClassName: D,
      bodyOpenClassName: B,
      role: "dialog",
      ariaHideApp: !0,
      closeTimeoutMS: 0,
      shouldFocusAfterRender: !0,
      shouldCloseOnEsc: !0,
      shouldCloseOnOverlayClick: !0,
      shouldReturnFocusAfterClose: !0,
      preventScroll: !1,
      parentSelector: function () {
        return document.body;
      },
      overlayElement: function (i, C) {
        return f.default.createElement("div", i, C);
      },
      contentElement: function (i, C) {
        return f.default.createElement("div", i, C);
      },
    }),
    (I.defaultStyles = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
      },
      content: {
        position: "absolute",
        top: "40px",
        left: "40px",
        right: "40px",
        bottom: "40px",
        border: "1px solid #ccc",
        background: "#fff",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: "4px",
        outline: "none",
        padding: "20px",
      },
    }),
    (0, p.polyfill)(I),
    (k.default = I),
    k
  );
}
var ce;
function Pe() {
  return (
    ce ||
      ((ce = 1),
      (function (g, h) {
        Object.defineProperty(h, "__esModule", { value: !0 });
        var y = Ae(),
          f = c(y);
        function c(d) {
          return d && d.__esModule ? d : { default: d };
        }
        (h.default = f.default), (g.exports = h.default);
      })(V, V.exports)),
    V.exports
  );
}
var Le = Pe();
const Fe = ge(Le);
export { Fe as M };
