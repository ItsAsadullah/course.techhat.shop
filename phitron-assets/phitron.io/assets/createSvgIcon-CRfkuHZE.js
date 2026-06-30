import {
  w as N,
  r as c,
  _ as C,
  a as y,
  c as I,
  h as l,
} from "./index-3GFABpq9.js";
import { c as v } from "./capitalize-DJ5c-VNF.js";
var _ = function (o) {
    return {
      root: {
        userSelect: "none",
        width: "1em",
        height: "1em",
        display: "inline-block",
        fill: "currentColor",
        flexShrink: 0,
        fontSize: o.typography.pxToRem(24),
        transition: o.transitions.create("fill", {
          duration: o.transitions.duration.shorter,
        }),
      },
      colorPrimary: { color: o.palette.primary.main },
      colorSecondary: { color: o.palette.secondary.main },
      colorAction: { color: o.palette.action.active },
      colorError: { color: o.palette.error.main },
      colorDisabled: { color: o.palette.action.disabled },
      fontSizeInherit: { fontSize: "inherit" },
      fontSizeSmall: { fontSize: o.typography.pxToRem(20) },
      fontSizeLarge: { fontSize: o.typography.pxToRem(35) },
    };
  },
  h = c.forwardRef(function (o, t) {
    var s = o.children,
      e = o.classes,
      n = o.className,
      m = o.color,
      f = m === void 0 ? "inherit" : m,
      d = o.component,
      g = d === void 0 ? "svg" : d,
      u = o.fontSize,
      a = u === void 0 ? "medium" : u,
      z = o.htmlColor,
      r = o.titleAccess,
      S = o.viewBox,
      x = S === void 0 ? "0 0 24 24" : S,
      w = C(o, [
        "children",
        "classes",
        "className",
        "color",
        "component",
        "fontSize",
        "htmlColor",
        "titleAccess",
        "viewBox",
      ]);
    return c.createElement(
      g,
      y(
        {
          className: I(
            e.root,
            n,
            f !== "inherit" && e["color".concat(v(f))],
            a !== "default" && a !== "medium" && e["fontSize".concat(v(a))]
          ),
          focusable: "false",
          viewBox: x,
          color: z,
          "aria-hidden": r ? void 0 : !0,
          role: r ? "img" : void 0,
          ref: t,
        },
        w
      ),
      s,
      r ? c.createElement("title", null, r) : null
    );
  });
h.muiName = "SvgIcon";
const p = N(_, { name: "MuiSvgIcon" })(h);
function E(i, o) {
  var t = function (e, n) {
    return l.createElement(p, y({ ref: n }, e), i);
  };
  return (t.muiName = p.muiName), l.memo(l.forwardRef(t));
}
export { p as S, E as c };
