import { h as d, Q as h, a as v, T as C, V as m } from "./index-3GFABpq9.js";
function D() {
  for (var e = arguments.length, s = new Array(e), t = 0; t < e; t++)
    s[t] = arguments[t];
  return s
    .filter(function (i) {
      return i != null;
    })
    .reduce(function (i, r) {
      if (typeof r != "function")
        throw new Error(
          "Invalid Argument Type, must only provide functions, undefined, or null."
        );
      return i === null
        ? r
        : function () {
            for (var a = arguments.length, l = new Array(a), o = 0; o < a; o++)
              l[o] = arguments[o];
            i.apply(this, l), r.apply(this, l);
          };
    }, null);
}
var P = ["as", "disabled", "onKeyDown"];
function b(e) {
  return !e || e.trim() === "#";
}
var y = d.forwardRef(function (e, s) {
  var t = e.as,
    i = t === void 0 ? "a" : t,
    r = e.disabled,
    p = e.onKeyDown,
    a = h(e, P),
    l = function (n) {
      var u = a.href,
        f = a.onClick;
      if (((r || b(u)) && n.preventDefault(), r)) {
        n.stopPropagation();
        return;
      }
      f && f(n);
    },
    o = function (n) {
      n.key === " " && (n.preventDefault(), l(n));
    };
  return (
    b(a.href) && ((a.role = a.role || "button"), (a.href = a.href || "#")),
    r && ((a.tabIndex = -1), (a["aria-disabled"] = !0)),
    d.createElement(i, v({ ref: s }, a, { onClick: l, onKeyDown: D(o, p) }))
  );
});
y.displayName = "SafeAnchor";
var N = [
    "bsPrefix",
    "variant",
    "size",
    "active",
    "className",
    "block",
    "type",
    "as",
  ],
  g = { variant: "primary", active: !1, disabled: !1 },
  w = d.forwardRef(function (e, s) {
    var t = e.bsPrefix,
      i = e.variant,
      r = e.size,
      p = e.active,
      a = e.className,
      l = e.block,
      o = e.type,
      c = e.as,
      n = h(e, N),
      u = C(t, "btn"),
      f = m(
        a,
        u,
        p && "active",
        i && u + "-" + i,
        l && u + "-block",
        r && u + "-" + r
      );
    if (n.href)
      return d.createElement(
        y,
        v({}, n, { as: c, ref: s, className: m(f, n.disabled && "disabled") })
      );
    s && (n.ref = s), o ? (n.type = o) : c || (n.type = "button");
    var x = c || "button";
    return d.createElement(x, v({}, n, { className: f }));
  });
w.displayName = "Button";
w.defaultProps = g;
export { w as B, y as S };
