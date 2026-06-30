import {
  w as tt,
  r as i,
  f as et,
  _ as nt,
  a as y,
  c as it,
  bF as rt,
} from "./index-3GFABpq9.js";
import { g as A } from "./utils-CF7zeufV.js";
import { u as ot } from "./useTheme-D5Kw55Xc.js";
import { a as at } from "./useForkRef-BrlJjWiH.js";
import { T as st } from "./Transition-Bhu4Sc87.js";
var lt = function (e) {
    return {
      root: {
        height: 0,
        overflow: "hidden",
        transition: e.transitions.create("height"),
      },
      entered: { height: "auto", overflow: "visible" },
      hidden: { visibility: "hidden" },
      wrapper: { display: "flex" },
      wrapperInner: { width: "100%" },
    };
  },
  F = i.forwardRef(function (e, L) {
    var j = e.children,
      c = e.classes,
      k = e.className,
      h = e.collapsedHeight,
      C = e.collapsedSize,
      v = C === void 0 ? "0px" : C,
      T = e.component,
      W = T === void 0 ? "div" : T,
      w = e.disableStrictModeCompat,
      q = w === void 0 ? !1 : w,
      H = e.in,
      S = e.onEnter,
      b = e.onEntered,
      _ = e.onEntering,
      R = e.onExit,
      B = e.onExited,
      D = e.onExiting,
      E = e.style,
      z = e.timeout,
      s = z === void 0 ? et.standard : z,
      M = e.TransitionComponent,
      G = M === void 0 ? st : M,
      J = nt(e, [
        "children",
        "classes",
        "className",
        "collapsedHeight",
        "collapsedSize",
        "component",
        "disableStrictModeCompat",
        "in",
        "onEnter",
        "onEntered",
        "onEntering",
        "onExit",
        "onExited",
        "onExiting",
        "style",
        "timeout",
        "TransitionComponent",
      ]),
      g = ot(),
      N = i.useRef(),
      l = i.useRef(null),
      p = i.useRef(),
      m = typeof (h || v) == "number" ? "".concat(h || v, "px") : h || v;
    i.useEffect(function () {
      return function () {
        clearTimeout(N.current);
      };
    }, []);
    var f = g.unstable_strictMode && !q,
      x = i.useRef(null),
      K = at(L, f ? x : void 0),
      u = function (n) {
        return function (r, o) {
          if (n) {
            var a = f ? [x.current, r] : [r, o],
              d = rt(a, 2),
              P = d[0],
              $ = d[1];
            $ === void 0 ? n(P) : n(P, $);
          }
        };
      },
      Q = u(function (t, n) {
        (t.style.height = m), S && S(t, n);
      }),
      U = u(function (t, n) {
        var r = l.current ? l.current.clientHeight : 0,
          o = A({ style: E, timeout: s }, { mode: "enter" }),
          a = o.duration;
        if (s === "auto") {
          var d = g.transitions.getAutoHeightDuration(r);
          (t.style.transitionDuration = "".concat(d, "ms")), (p.current = d);
        } else t.style.transitionDuration = typeof a == "string" ? a : "".concat(a, "ms");
        (t.style.height = "".concat(r, "px")), _ && _(t, n);
      }),
      V = u(function (t, n) {
        (t.style.height = "auto"), b && b(t, n);
      }),
      X = u(function (t) {
        var n = l.current ? l.current.clientHeight : 0;
        (t.style.height = "".concat(n, "px")), R && R(t);
      }),
      Y = u(B),
      Z = u(function (t) {
        var n = l.current ? l.current.clientHeight : 0,
          r = A({ style: E, timeout: s }, { mode: "exit" }),
          o = r.duration;
        if (s === "auto") {
          var a = g.transitions.getAutoHeightDuration(n);
          (t.style.transitionDuration = "".concat(a, "ms")), (p.current = a);
        } else t.style.transitionDuration = typeof o == "string" ? o : "".concat(o, "ms");
        (t.style.height = m), D && D(t);
      }),
      O = function (n, r) {
        var o = f ? n : r;
        s === "auto" && (N.current = setTimeout(o, p.current || 0));
      };
    return i.createElement(
      G,
      y(
        {
          in: H,
          onEnter: Q,
          onEntered: V,
          onEntering: U,
          onExit: X,
          onExited: Y,
          onExiting: Z,
          addEndListener: O,
          nodeRef: f ? x : void 0,
          timeout: s === "auto" ? null : s,
        },
        J
      ),
      function (t, n) {
        return i.createElement(
          W,
          y(
            {
              className: it(
                c.root,
                c.container,
                k,
                { entered: c.entered, exited: !H && m === "0px" && c.hidden }[t]
              ),
              style: y({ minHeight: m }, E),
              ref: K,
            },
            n
          ),
          i.createElement(
            "div",
            { className: c.wrapper, ref: l },
            i.createElement("div", { className: c.wrapperInner }, j)
          )
        );
      }
    );
  });
F.muiSupportAuto = !0;
const ht = tt(lt, { name: "MuiCollapse" })(F);
export { ht as C };
