var a = { exports: {} },
  p;
function l() {
  return (
    p ||
      ((p = 1),
      (function (e) {
        function r(t) {
          return t && t.__esModule ? t : { default: t };
        }
        (e.exports = r),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      })(a)),
    a.exports
  );
}
var n = { exports: {} },
  i;
function c() {
  return (
    i ||
      ((i = 1),
      (function (e) {
        function r(t) {
          "@babel/helpers - typeof";
          return (
            (e.exports = r =
              typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
                ? function (o) {
                    return typeof o;
                  }
                : function (o) {
                    return o &&
                      typeof Symbol == "function" &&
                      o.constructor === Symbol &&
                      o !== Symbol.prototype
                      ? "symbol"
                      : typeof o;
                  }),
            (e.exports.__esModule = !0),
            (e.exports.default = e.exports),
            r(t)
          );
        }
        (e.exports = r),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      })(n)),
    n.exports
  );
}
var u = {},
  s;
function d() {
  if (s) return u;
  (s = 1),
    Object.defineProperty(u, "__esModule", { value: !0 }),
    (u.default = void 0);
  var e = { black: "#000", white: "#fff" },
    r = e;
  return (u.default = r), u;
}
var f = {},
  y;
function x() {
  if (y) return f;
  (y = 1),
    Object.defineProperty(f, "__esModule", { value: !0 }),
    (f.default = void 0);
  var e = {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#d5d5d5",
      A200: "#aaaaaa",
      A400: "#303030",
      A700: "#616161",
    },
    r = e;
  return (f.default = r), f;
}
export { c as a, d as b, x as c, l as r };
