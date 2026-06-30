import { bE as Y, k as $, a6 as Z, l as ee } from "./index-3GFABpq9.js";
import { C as te } from "./CircularProgress-BYL1-oIM.js";
import { r as re, b as ne, c as ae } from "./grey-BpIXr15l.js";
import { r as ie, a as oe } from "./createSvgIcon-0oNFAs65.js";
const ue = Object.freeze(
  Object.defineProperty({ __proto__: null, default: te }, Symbol.toStringTag, {
    value: "Module",
  })
);
var w = {},
  q = {},
  D = {};
const le = Y(ue);
var p = {},
  k;
function fe() {
  if (k) return p;
  k = 1;
  var l = re(),
    u = ie();
  Object.defineProperty(p, "__esModule", { value: !0 }), (p.default = void 0);
  var o = u($()),
    f = l(oe()),
    c = (0, f.default)(
      o.createElement("path", {
        d: "M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z",
      }),
      "BrokenImage"
    );
  return (p.default = c), p;
}
var T;
function ce() {
  return (
    T ||
      ((T = 1),
      (function (l) {
        Object.defineProperty(l, "__esModule", { value: !0 }),
          (l.default = void 0);
        var u = F($()),
          o = s(Z()),
          f = s(le),
          c = s(ne()),
          z = s(ae()),
          B = s(fe());
        function s(e) {
          return e && e.__esModule ? e : { default: e };
        }
        function C() {
          if (typeof WeakMap != "function") return null;
          var e = new WeakMap();
          return (
            (C = function () {
              return e;
            }),
            e
          );
        }
        function F(e) {
          if (e && e.__esModule) return e;
          if (e === null || (d(e) !== "object" && typeof e != "function"))
            return { default: e };
          var r = C();
          if (r && r.has(e)) return r.get(e);
          var n = {},
            a = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var t in e)
            if (Object.prototype.hasOwnProperty.call(e, t)) {
              var i = a ? Object.getOwnPropertyDescriptor(e, t) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(n, t, i)
                : (n[t] = e[t]);
            }
          return (n.default = e), r && r.set(e, n), n;
        }
        function d(e) {
          "@babel/helpers - typeof";
          return (
            typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
              ? (d = function (n) {
                  return typeof n;
                })
              : (d = function (n) {
                  return n &&
                    typeof Symbol == "function" &&
                    n.constructor === Symbol &&
                    n !== Symbol.prototype
                    ? "symbol"
                    : typeof n;
                }),
            d(e)
          );
        }
        function v() {
          return (
            (v =
              Object.assign ||
              function (e) {
                for (var r = 1; r < arguments.length; r++) {
                  var n = arguments[r];
                  for (var a in n)
                    Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
                }
                return e;
              }),
            v.apply(this, arguments)
          );
        }
        function x(e, r) {
          if (e == null) return {};
          var n = N(e, r),
            a,
            t;
          if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(e);
            for (t = 0; t < i.length; t++)
              (a = i[t]),
                !(r.indexOf(a) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(e, a) &&
                  (n[a] = e[a]);
          }
          return n;
        }
        function N(e, r) {
          if (e == null) return {};
          var n = {},
            a = Object.keys(e),
            t,
            i;
          for (i = 0; i < a.length; i++)
            (t = a[i]), !(r.indexOf(t) >= 0) && (n[t] = e[t]);
          return n;
        }
        function j(e, r) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            r &&
              (a = a.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              n.push.apply(n, a);
          }
          return n;
        }
        function g(e) {
          for (var r = 1; r < arguments.length; r++) {
            var n = arguments[r] != null ? arguments[r] : {};
            r % 2
              ? j(Object(n), !0).forEach(function (a) {
                  _(e, a, n[a]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : j(Object(n)).forEach(function (a) {
                  Object.defineProperty(
                    e,
                    a,
                    Object.getOwnPropertyDescriptor(n, a)
                  );
                });
          }
          return e;
        }
        function V(e, r) {
          if (!(e instanceof r))
            throw new TypeError("Cannot call a class as a function");
        }
        function L(e, r) {
          for (var n = 0; n < r.length; n++) {
            var a = r[n];
            (a.enumerable = a.enumerable || !1),
              (a.configurable = !0),
              "value" in a && (a.writable = !0),
              Object.defineProperty(e, a.key, a);
          }
        }
        function A(e, r, n) {
          return r && L(e.prototype, r), n && L(e, n), e;
        }
        function G(e, r) {
          if (typeof r != "function" && r !== null)
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          (e.prototype = Object.create(r && r.prototype, {
            constructor: { value: e, writable: !0, configurable: !0 },
          })),
            r && h(e, r);
        }
        function h(e, r) {
          return (
            (h =
              Object.setPrototypeOf ||
              function (a, t) {
                return (a.__proto__ = t), a;
              }),
            h(e, r)
          );
        }
        function H(e) {
          var r = J();
          return function () {
            var a = m(e),
              t;
            if (r) {
              var i = m(this).constructor;
              t = Reflect.construct(a, arguments, i);
            } else t = a.apply(this, arguments);
            return K(this, t);
          };
        }
        function K(e, r) {
          return r && (d(r) === "object" || typeof r == "function") ? r : b(e);
        }
        function b(e) {
          if (e === void 0)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return e;
        }
        function J() {
          if (
            typeof Reflect > "u" ||
            !Reflect.construct ||
            Reflect.construct.sham
          )
            return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return (
              Date.prototype.toString.call(
                Reflect.construct(Date, [], function () {})
              ),
              !0
            );
          } catch {
            return !1;
          }
        }
        function m(e) {
          return (
            (m = Object.setPrototypeOf
              ? Object.getPrototypeOf
              : function (n) {
                  return n.__proto__ || Object.getPrototypeOf(n);
                }),
            m(e)
          );
        }
        function _(e, r, n) {
          return (
            r in e
              ? Object.defineProperty(e, r, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (e[r] = n),
            e
          );
        }
        var O = (function (e) {
          G(n, e);
          var r = H(n);
          function n(a) {
            var t;
            return (
              V(this, n),
              (t = r.call(this, a)),
              _(b(t), "handleLoadImage", function (i) {
                t.setState({ imageLoaded: !0, imageError: !1 }),
                  t.props.onLoad && t.props.onLoad(i);
              }),
              _(b(t), "handleImageError", function (i) {
                t.props.src &&
                  (t.setState({ imageError: !0 }),
                  t.props.onError && t.props.onError(i));
              }),
              (t.state = { imageError: !1, imageLoaded: !1, src: t.props.src }),
              (t.image = u.default.createRef()),
              t
            );
          }
          return (
            A(
              n,
              [
                {
                  key: "componentDidMount",
                  value: function () {
                    var t = this.image.current;
                    t &&
                      t.complete &&
                      (t.naturalWidth === 0
                        ? this.handleImageError()
                        : this.handleLoadImage());
                  },
                },
                {
                  key: "getStyles",
                  value: function () {
                    var t = this.props,
                      i = t.animationDuration,
                      P = t.aspectRatio,
                      S = t.cover,
                      I = t.color,
                      E = t.imageStyle,
                      R = t.disableTransition,
                      y = t.iconContainerStyle,
                      Q = t.style,
                      U = !R && {
                        opacity: this.state.imageLoaded ? 1 : 0,
                        filterBrightness: this.state.imageLoaded ? 100 : 0,
                        filterSaturate: this.state.imageLoaded ? 100 : 20,
                        transition: `
        filterBrightness `
                          .concat(
                            i * 0.75,
                            `ms cubic-bezier(0.4, 0.0, 0.2, 1),
        filterSaturate `
                          )
                          .concat(
                            i,
                            `ms cubic-bezier(0.4, 0.0, 0.2, 1),
        opacity `
                          )
                          .concat(i / 2, "ms cubic-bezier(0.4, 0.0, 0.2, 1)"),
                      },
                      X = {
                        root: g(
                          {
                            backgroundColor: I,
                            paddingTop: "calc(1 / ".concat(P, " * 100%)"),
                            position: "relative",
                          },
                          Q
                        ),
                        image: g(
                          g(
                            {
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              objectFit: S ? "cover" : "inherit",
                              top: 0,
                              left: 0,
                            },
                            U
                          ),
                          E
                        ),
                        iconContainer: g(
                          {
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                          },
                          y
                        ),
                      };
                    return X;
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var t = this.getStyles(),
                      i = this.props;
                    i.animationDuration, i.aspectRatio, i.color, i.cover;
                    var P = i.disableError,
                      S = i.disableSpinner;
                    i.disableTransition;
                    var I = i.errorIcon;
                    i.iconContainerStyle, i.imageStyle;
                    var E = i.loading,
                      R = i.onClick;
                    i.style;
                    var y = x(i, [
                      "animationDuration",
                      "aspectRatio",
                      "color",
                      "cover",
                      "disableError",
                      "disableSpinner",
                      "disableTransition",
                      "errorIcon",
                      "iconContainerStyle",
                      "imageStyle",
                      "loading",
                      "onClick",
                      "style",
                    ]);
                    return u.default.createElement(
                      "div",
                      { style: t.root, onClick: R },
                      y.src &&
                        u.default.createElement(
                          "img",
                          v({}, y, {
                            ref: this.image,
                            style: t.image,
                            onLoad: this.handleLoadImage,
                            onError: this.handleImageError,
                          })
                        ),
                      u.default.createElement(
                        "div",
                        { style: t.iconContainer },
                        !S &&
                          !this.state.imageLoaded &&
                          !this.state.imageError &&
                          E,
                        !P && this.state.imageError && I
                      )
                    );
                  },
                },
              ],
              [
                {
                  key: "getDerivedStateFromProps",
                  value: function (t, i) {
                    return i.src !== t.src
                      ? { imageError: !1, imageLoaded: !1, src: t.src }
                      : null;
                  },
                },
              ]
            ),
            n
          );
        })(u.Component);
        (l.default = O),
          (O.defaultProps = {
            animationDuration: 3e3,
            aspectRatio: 1,
            color: c.default.white,
            disableError: !1,
            disableSpinner: !1,
            disableTransition: !1,
            errorIcon: u.default.createElement(B.default, {
              style: { width: 48, height: 48, color: z.default[300] },
            }),
            loading: u.default.createElement(f.default, { size: 48 }),
          }),
          (O.propTypes = {
            animationDuration: o.default.number,
            aspectRatio: o.default.number,
            cover: o.default.bool,
            color: o.default.string,
            disableError: o.default.bool,
            disableSpinner: o.default.bool,
            disableTransition: o.default.bool,
            errorIcon: o.default.node,
            iconContainerStyle: o.default.object,
            imageStyle: o.default.object,
            loading: o.default.node,
            onClick: o.default.func,
            onError: o.default.func,
            onLoad: o.default.func,
            src: o.default.string.isRequired,
            style: o.default.object,
          });
      })(D)),
    D
  );
}
var M;
function se() {
  return (
    M ||
      ((M = 1),
      (function (l) {
        Object.defineProperty(l, "__esModule", { value: !0 }),
          Object.defineProperty(l, "default", {
            enumerable: !0,
            get: function () {
              return u.default;
            },
          });
        var u = o(ce());
        function o(f) {
          return f && f.__esModule ? f : { default: f };
        }
      })(q)),
    q
  );
}
var W;
function de() {
  return (
    W ||
      ((W = 1),
      (function (l) {
        Object.defineProperty(l, "__esModule", { value: !0 }),
          (l.default = void 0);
        var u = o(se());
        function o(c) {
          return c && c.__esModule ? c : { default: c };
        }
        var f = u.default;
        l.default = f;
      })(w)),
    w
  );
}
var pe = de();
const he = ee(pe);
export { he as I };
