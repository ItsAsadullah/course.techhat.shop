import {
  bM as S,
  bN as M,
  bO as q,
  bP as D,
  r as o,
  w as A,
  _,
  bF as H,
  a as C,
  c as d,
} from "./index-3GFABpq9.js";
import { u as L } from "./useControlled-sPKmD958.js";
import { P as O } from "./Paper-ChFTbczx.js";
import { C as W } from "./Collapse-C1kZ8BZP.js";
import { B as j } from "./ButtonBase-B4sdbh7v.js";
import { I as F } from "./IconButton-BVDtp5lr.js";
function G(r) {
  return S(r) || M(r) || q(r) || D();
}
var P = o.createContext({}),
  z = function (e) {
    var n = { duration: e.transitions.duration.shortest };
    return {
      root: {
        position: "relative",
        transition: e.transitions.create(["margin"], n),
        "&:before": {
          position: "absolute",
          left: 0,
          top: -1,
          right: 0,
          height: 1,
          content: '""',
          opacity: 1,
          backgroundColor: e.palette.divider,
          transition: e.transitions.create(["opacity", "background-color"], n),
        },
        "&:first-child": { "&:before": { display: "none" } },
        "&$expanded": {
          margin: "16px 0",
          "&:first-child": { marginTop: 0 },
          "&:last-child": { marginBottom: 0 },
          "&:before": { opacity: 0 },
        },
        "&$expanded + &": { "&:before": { display: "none" } },
        "&$disabled": { backgroundColor: e.palette.action.disabledBackground },
      },
      rounded: {
        borderRadius: 0,
        "&:first-child": {
          borderTopLeftRadius: e.shape.borderRadius,
          borderTopRightRadius: e.shape.borderRadius,
        },
        "&:last-child": {
          borderBottomLeftRadius: e.shape.borderRadius,
          borderBottomRightRadius: e.shape.borderRadius,
          "@supports (-ms-ime-align: auto)": {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        },
      },
      expanded: {},
      disabled: {},
    };
  },
  J = o.forwardRef(function (e, n) {
    var l = e.children,
      a = e.classes,
      c = e.className,
      u = e.defaultExpanded,
      y = u === void 0 ? !1 : u,
      p = e.disabled,
      m = p === void 0 ? !1 : p,
      h = e.expanded,
      f = e.onChange,
      s = e.square,
      b = s === void 0 ? !1 : s,
      x = e.TransitionComponent,
      i = x === void 0 ? W : x,
      v = e.TransitionProps,
      $ = _(e, [
        "children",
        "classes",
        "className",
        "defaultExpanded",
        "disabled",
        "expanded",
        "onChange",
        "square",
        "TransitionComponent",
        "TransitionProps",
      ]),
      N = L({
        controlled: h,
        default: y,
        name: "Accordion",
        state: "expanded",
      }),
      g = H(N, 2),
      t = g[0],
      B = g[1],
      E = o.useCallback(
        function (w) {
          B(!t), f && f(w, !t);
        },
        [t, f, B]
      ),
      T = o.Children.toArray(l),
      I = G(T),
      R = I[0],
      k = I.slice(1),
      V = o.useMemo(
        function () {
          return { expanded: t, disabled: m, toggle: E };
        },
        [t, m, E]
      );
    return o.createElement(
      O,
      C(
        {
          className: d(
            a.root,
            c,
            t && a.expanded,
            m && a.disabled,
            !b && a.rounded
          ),
          ref: n,
          square: b,
        },
        $
      ),
      o.createElement(P.Provider, { value: V }, R),
      o.createElement(
        i,
        C({ in: t, timeout: "auto" }, v),
        o.createElement(
          "div",
          {
            "aria-labelledby": R.props.id,
            id: R.props["aria-controls"],
            role: "region",
          },
          k
        )
      )
    );
  });
const re = A(z, { name: "MuiAccordion" })(J);
var K = function (e) {
    return { root: { display: "flex", padding: e.spacing(1, 2, 2) } };
  },
  Q = o.forwardRef(function (e, n) {
    var l = e.classes,
      a = e.className,
      c = _(e, ["classes", "className"]);
    return o.createElement("div", C({ className: d(l.root, a), ref: n }, c));
  });
const te = A(K, { name: "MuiAccordionDetails" })(Q);
var U = function (e) {
    var n = { duration: e.transitions.duration.shortest };
    return {
      root: {
        display: "flex",
        minHeight: 48,
        transition: e.transitions.create(["min-height", "background-color"], n),
        padding: e.spacing(0, 2),
        "&:hover:not($disabled)": { cursor: "pointer" },
        "&$expanded": { minHeight: 64 },
        "&$focused, &$focusVisible": {
          backgroundColor: e.palette.action.focus,
        },
        "&$disabled": { opacity: e.palette.action.disabledOpacity },
      },
      expanded: {},
      focused: {},
      focusVisible: {},
      disabled: {},
      content: {
        display: "flex",
        flexGrow: 1,
        transition: e.transitions.create(["margin"], n),
        margin: "12px 0",
        "&$expanded": { margin: "20px 0" },
      },
      expandIcon: {
        transform: "rotate(0deg)",
        transition: e.transitions.create("transform", n),
        "&:hover": { backgroundColor: "transparent" },
        "&$expanded": { transform: "rotate(180deg)" },
      },
    };
  },
  X = o.forwardRef(function (e, n) {
    var l = e.children,
      a = e.classes,
      c = e.className,
      u = e.expandIcon,
      y = e.focusVisibleClassName,
      p = e.IconButtonProps,
      m = p === void 0 ? {} : p,
      h = e.onClick,
      f = _(e, [
        "children",
        "classes",
        "className",
        "expandIcon",
        "focusVisibleClassName",
        "IconButtonProps",
        "onClick",
      ]),
      s = o.useContext(P),
      b = s.disabled,
      x = b === void 0 ? !1 : b,
      i = s.expanded,
      v = s.toggle,
      $ = function (g) {
        v && v(g), h && h(g);
      };
    return o.createElement(
      j,
      C(
        {
          focusRipple: !1,
          disableRipple: !0,
          disabled: x,
          component: "div",
          "aria-expanded": i,
          className: d(a.root, c, x && a.disabled, i && a.expanded),
          focusVisibleClassName: d(a.focusVisible, a.focused, y),
          onClick: $,
          ref: n,
        },
        f
      ),
      o.createElement("div", { className: d(a.content, i && a.expanded) }, l),
      u &&
        o.createElement(
          F,
          C(
            {
              className: d(a.expandIcon, i && a.expanded),
              edge: "end",
              component: "div",
              tabIndex: null,
              role: null,
              "aria-hidden": !0,
            },
            m
          ),
          u
        )
    );
  });
const se = A(U, { name: "MuiAccordionSummary" })(X);
export { re as A, se as a, te as b };
