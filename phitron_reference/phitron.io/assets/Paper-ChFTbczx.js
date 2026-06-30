import { w as m, r as c, _ as x, a as l, c as _ } from "./index-3GFABpq9.js";
var w = function (a) {
    var o = {};
    return (
      a.shadows.forEach(function (e, t) {
        o["elevation".concat(t)] = { boxShadow: e };
      }),
      l(
        {
          root: {
            backgroundColor: a.palette.background.paper,
            color: a.palette.text.primary,
            transition: a.transitions.create("box-shadow"),
          },
          rounded: { borderRadius: a.shape.borderRadius },
          outlined: { border: "1px solid ".concat(a.palette.divider) },
        },
        o
      )
    );
  },
  P = c.forwardRef(function (a, o) {
    var e = a.classes,
      t = a.className,
      r = a.component,
      v = r === void 0 ? "div" : r,
      s = a.square,
      u = s === void 0 ? !1 : s,
      n = a.elevation,
      p = n === void 0 ? 1 : n,
      i = a.variant,
      b = i === void 0 ? "elevation" : i,
      f = x(a, [
        "classes",
        "className",
        "component",
        "square",
        "elevation",
        "variant",
      ]);
    return c.createElement(
      v,
      l(
        {
          className: _(
            e.root,
            t,
            b === "outlined" ? e.outlined : e["elevation".concat(p)],
            !u && e.rounded
          ),
          ref: o,
        },
        f
      )
    );
  });
const q = m(w, { name: "MuiPaper" })(P);
export { q as P };
