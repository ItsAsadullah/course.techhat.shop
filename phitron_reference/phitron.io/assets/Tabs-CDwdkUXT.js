import {
  w as ae,
  a as y,
  $ as B,
  r as a,
  _ as X,
  c as k,
} from "./index-3GFABpq9.js";
import { c as Be } from "./capitalize-DJ5c-VNF.js";
import { B as ke } from "./ButtonBase-B4sdbh7v.js";
import { d as de } from "./debounce-DtXjJkxj.js";
import { o as De } from "./ownerWindow-DsnALE3J.js";
import { u as se } from "./useForkRef-BrlJjWiH.js";
import { u as Ke } from "./useTheme-D5Kw55Xc.js";
import { c as $e } from "./createSvgIcon-CRfkuHZE.js";
var Ve = function (e) {
    var i;
    return {
      root: y(
        {},
        e.typography.button,
        ((i = {
          maxWidth: 264,
          minWidth: 72,
          position: "relative",
          boxSizing: "border-box",
          minHeight: 48,
          flexShrink: 0,
          padding: "6px 12px",
        }),
        B(i, e.breakpoints.up("sm"), { padding: "6px 24px" }),
        B(i, "overflow", "hidden"),
        B(i, "whiteSpace", "normal"),
        B(i, "textAlign", "center"),
        B(i, e.breakpoints.up("sm"), { minWidth: 160 }),
        i)
      ),
      labelIcon: {
        minHeight: 72,
        paddingTop: 9,
        "& $wrapper > *:first-child": { marginBottom: 6 },
      },
      textColorInherit: {
        color: "inherit",
        opacity: 0.7,
        "&$selected": { opacity: 1 },
        "&$disabled": { opacity: 0.5 },
      },
      textColorPrimary: {
        color: e.palette.text.secondary,
        "&$selected": { color: e.palette.primary.main },
        "&$disabled": { color: e.palette.text.disabled },
      },
      textColorSecondary: {
        color: e.palette.text.secondary,
        "&$selected": { color: e.palette.secondary.main },
        "&$disabled": { color: e.palette.text.disabled },
      },
      selected: {},
      disabled: {},
      fullWidth: { flexShrink: 1, flexGrow: 1, flexBasis: 0, maxWidth: "none" },
      wrapped: { fontSize: e.typography.pxToRem(12), lineHeight: 1.5 },
      wrapper: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        flexDirection: "column",
      },
    };
  },
  je = a.forwardRef(function (e, i) {
    var n = e.classes,
      f = e.className,
      m = e.disabled,
      u = m === void 0 ? !1 : m,
      b = e.disableFocusRipple,
      $ = b === void 0 ? !1 : b,
      c = e.fullWidth,
      E = e.icon,
      N = e.indicator,
      I = e.label,
      w = e.onChange,
      M = e.onClick,
      F = e.onFocus,
      h = e.selected,
      C = e.selectionFollowsFocus,
      K = e.textColor,
      G = K === void 0 ? "inherit" : K,
      V = e.value,
      S = e.wrapped,
      re = S === void 0 ? !1 : S,
      U = X(e, [
        "classes",
        "className",
        "disabled",
        "disableFocusRipple",
        "fullWidth",
        "icon",
        "indicator",
        "label",
        "onChange",
        "onClick",
        "onFocus",
        "selected",
        "selectionFollowsFocus",
        "textColor",
        "value",
        "wrapped",
      ]),
      J = function (W) {
        w && w(W, V), M && M(W);
      },
      Q = function (W) {
        C && !h && w && w(W, V), F && F(W);
      };
    return a.createElement(
      ke,
      y(
        {
          focusRipple: !$,
          className: k(
            n.root,
            n["textColor".concat(Be(G))],
            f,
            u && n.disabled,
            h && n.selected,
            I && E && n.labelIcon,
            c && n.fullWidth,
            re && n.wrapped
          ),
          ref: i,
          role: "tab",
          "aria-selected": h,
          disabled: u,
          onClick: J,
          onFocus: Q,
          tabIndex: h ? 0 : -1,
        },
        U
      ),
      a.createElement("span", { className: n.wrapper }, E, I),
      N
    );
  });
const bt = ae(Ve, { name: "MuiTab" })(je),
  qe = $e(
    a.createElement("path", {
      d: "M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z",
    })
  ),
  Oe = $e(
    a.createElement("path", {
      d: "M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z",
    })
  );
var D;
function Ne() {
  if (D) return D;
  var r = document.createElement("div"),
    e = document.createElement("div");
  return (
    (e.style.width = "10px"),
    (e.style.height = "1px"),
    r.appendChild(e),
    (r.dir = "rtl"),
    (r.style.fontSize = "14px"),
    (r.style.width = "4px"),
    (r.style.height = "1px"),
    (r.style.position = "absolute"),
    (r.style.top = "-1000px"),
    (r.style.overflow = "scroll"),
    document.body.appendChild(r),
    (D = "reverse"),
    r.scrollLeft > 0
      ? (D = "default")
      : ((r.scrollLeft = 1), r.scrollLeft === 0 && (D = "negative")),
    document.body.removeChild(r),
    D
  );
}
function Te(r, e) {
  var i = r.scrollLeft;
  if (e !== "rtl") return i;
  var n = Ne();
  switch (n) {
    case "negative":
      return r.scrollWidth - r.clientWidth + i;
    case "reverse":
      return r.scrollWidth - r.clientWidth - i;
    default:
      return i;
  }
}
function Xe(r) {
  return (1 + Math.sin(Math.PI * r - Math.PI / 2)) / 2;
}
function Ge(r, e, i) {
  var n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {},
    f =
      arguments.length > 4 && arguments[4] !== void 0
        ? arguments[4]
        : function () {},
    m = n.ease,
    u = m === void 0 ? Xe : m,
    b = n.duration,
    $ = b === void 0 ? 300 : b,
    c = null,
    E = e[r],
    N = !1,
    I = function () {
      N = !0;
    },
    w = function M(F) {
      if (N) {
        f(new Error("Animation cancelled"));
        return;
      }
      c === null && (c = F);
      var h = Math.min(1, (F - c) / $);
      if (((e[r] = u(h) * (i - E) + E), h >= 1)) {
        requestAnimationFrame(function () {
          f(null);
        });
        return;
      }
      requestAnimationFrame(M);
    };
  return E === i
    ? (f(new Error("Element already at target position")), I)
    : (requestAnimationFrame(w), I);
}
var Ue = {
  width: 99,
  height: 99,
  position: "absolute",
  top: -9999,
  overflow: "scroll",
};
function Je(r) {
  var e = r.onChange,
    i = X(r, ["onChange"]),
    n = a.useRef(),
    f = a.useRef(null),
    m = function () {
      n.current = f.current.offsetHeight - f.current.clientHeight;
    };
  return (
    a.useEffect(
      function () {
        var u = de(function () {
          var b = n.current;
          m(), b !== n.current && e(n.current);
        });
        return (
          window.addEventListener("resize", u),
          function () {
            u.clear(), window.removeEventListener("resize", u);
          }
        );
      },
      [e]
    ),
    a.useEffect(
      function () {
        m(), e(n.current);
      },
      [e]
    ),
    a.createElement("div", y({ style: Ue, ref: f }, i))
  );
}
var Qe = function (e) {
    return {
      root: {
        position: "absolute",
        height: 2,
        bottom: 0,
        width: "100%",
        transition: e.transitions.create(),
      },
      colorPrimary: { backgroundColor: e.palette.primary.main },
      colorSecondary: { backgroundColor: e.palette.secondary.main },
      vertical: { height: "100%", width: 2, right: 0 },
    };
  },
  Ye = a.forwardRef(function (e, i) {
    var n = e.classes,
      f = e.className,
      m = e.color,
      u = e.orientation,
      b = X(e, ["classes", "className", "color", "orientation"]);
    return a.createElement(
      "span",
      y(
        {
          className: k(
            n.root,
            n["color".concat(Be(m))],
            f,
            u === "vertical" && n.vertical
          ),
          ref: i,
        },
        b
      )
    );
  });
const Ze = ae(Qe, { name: "PrivateTabIndicator" })(Ye);
var et = {
    root: {
      width: 40,
      flexShrink: 0,
      opacity: 0.8,
      "&$disabled": { opacity: 0 },
    },
    vertical: {
      width: "100%",
      height: 40,
      "& svg": { transform: "rotate(90deg)" },
    },
    disabled: {},
  },
  tt = a.createElement(qe, { fontSize: "small" }),
  at = a.createElement(Oe, { fontSize: "small" }),
  rt = a.forwardRef(function (e, i) {
    var n = e.classes,
      f = e.className,
      m = e.direction,
      u = e.orientation,
      b = e.disabled,
      $ = X(e, [
        "classes",
        "className",
        "direction",
        "orientation",
        "disabled",
      ]);
    return a.createElement(
      ke,
      y(
        {
          component: "div",
          className: k(
            n.root,
            f,
            b && n.disabled,
            u === "vertical" && n.vertical
          ),
          ref: i,
          role: null,
          tabIndex: null,
        },
        $
      ),
      m === "left" ? tt : at
    );
  });
const lt = ae(et, { name: "MuiTabScrollButton" })(rt);
var ot = function (e) {
    return {
      root: {
        overflow: "hidden",
        minHeight: 48,
        WebkitOverflowScrolling: "touch",
        display: "flex",
      },
      vertical: { flexDirection: "column" },
      flexContainer: { display: "flex" },
      flexContainerVertical: { flexDirection: "column" },
      centered: { justifyContent: "center" },
      scroller: {
        position: "relative",
        display: "inline-block",
        flex: "1 1 auto",
        whiteSpace: "nowrap",
      },
      fixed: { overflowX: "hidden", width: "100%" },
      scrollable: {
        overflowX: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      },
      scrollButtons: {},
      scrollButtonsDesktop: B({}, e.breakpoints.down("xs"), {
        display: "none",
      }),
      indicator: {},
    };
  },
  nt = a.forwardRef(function (e, i) {
    var n = e["aria-label"],
      f = e["aria-labelledby"],
      m = e.action,
      u = e.centered,
      b = u === void 0 ? !1 : u,
      $ = e.children,
      c = e.classes,
      E = e.className,
      N = e.component,
      I = N === void 0 ? "div" : N,
      w = e.indicatorColor,
      M = w === void 0 ? "secondary" : w,
      F = e.onChange,
      h = e.orientation,
      C = h === void 0 ? "horizontal" : h,
      K = e.ScrollButtonComponent,
      G = K === void 0 ? lt : K,
      V = e.scrollButtons,
      S = V === void 0 ? "auto" : V,
      re = e.selectionFollowsFocus,
      U = e.TabIndicatorProps,
      J = U === void 0 ? {} : U,
      Q = e.TabScrollButtonProps,
      Y = e.textColor,
      W = Y === void 0 ? "inherit" : Y,
      le = e.value,
      ue = e.variant,
      fe = ue === void 0 ? "standard" : ue,
      Ie = X(e, [
        "aria-label",
        "aria-labelledby",
        "action",
        "centered",
        "children",
        "classes",
        "className",
        "component",
        "indicatorColor",
        "onChange",
        "orientation",
        "ScrollButtonComponent",
        "scrollButtons",
        "selectionFollowsFocus",
        "TabIndicatorProps",
        "TabScrollButtonProps",
        "textColor",
        "value",
        "variant",
      ]),
      Z = Ke(),
      j = fe === "scrollable",
      R = Z.direction === "rtl",
      p = C === "vertical",
      ee = p ? "scrollTop" : "scrollLeft",
      T = p ? "top" : "left",
      te = p ? "bottom" : "right",
      ve = p ? "clientHeight" : "clientWidth",
      q = p ? "height" : "width",
      me = a.useState(!1),
      be = me[0],
      Me = me[1],
      he = a.useState({}),
      z = he[0],
      pe = he[1],
      ge = a.useState({ start: !1, end: !1 }),
      _ = ge[0],
      Fe = ge[1],
      ye = a.useState({ overflow: "hidden", marginBottom: null }),
      We = ye[0],
      Re = ye[1],
      we = new Map(),
      x = a.useRef(null),
      L = a.useRef(null),
      Ce = function () {
        var t = x.current,
          l;
        if (t) {
          var s = t.getBoundingClientRect();
          l = {
            clientWidth: t.clientWidth,
            scrollLeft: t.scrollLeft,
            scrollTop: t.scrollTop,
            scrollLeftNormalized: Te(t, Z.direction),
            scrollWidth: t.scrollWidth,
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
          };
        }
        var d;
        if (t && le !== !1) {
          var g = L.current.children;
          if (g.length > 0) {
            var v = g[we.get(le)];
            d = v ? v.getBoundingClientRect() : null;
          }
        }
        return { tabsMeta: l, tabMeta: d };
      },
      O = se(function () {
        var o,
          t = Ce(),
          l = t.tabsMeta,
          s = t.tabMeta,
          d = 0;
        if (s && l)
          if (p) d = s.top - l.top + l.scrollTop;
          else {
            var g = R
              ? l.scrollLeftNormalized + l.clientWidth - l.scrollWidth
              : l.scrollLeft;
            d = s.left - l.left + g;
          }
        var v = ((o = {}), B(o, T, d), B(o, q, s ? s[q] : 0), o);
        if (isNaN(z[T]) || isNaN(z[q])) pe(v);
        else {
          var A = Math.abs(z[T] - v[T]),
            H = Math.abs(z[q] - v[q]);
          (A >= 1 || H >= 1) && pe(v);
        }
      }),
      oe = function (t) {
        Ge(ee, x.current, t);
      },
      Se = function (t) {
        var l = x.current[ee];
        p
          ? (l += t)
          : ((l += t * (R ? -1 : 1)), (l *= R && Ne() === "reverse" ? -1 : 1)),
          oe(l);
      },
      ze = function () {
        Se(-x.current[ve]);
      },
      _e = function () {
        Se(x.current[ve]);
      },
      Le = a.useCallback(function (o) {
        Re({ overflow: null, marginBottom: -o });
      }, []),
      Pe = function () {
        var t = {};
        t.scrollbarSizeListener = j
          ? a.createElement(Je, { className: c.scrollable, onChange: Le })
          : null;
        var l = _.start || _.end,
          s = j && ((S === "auto" && l) || S === "desktop" || S === "on");
        return (
          (t.scrollButtonStart = s
            ? a.createElement(
                G,
                y(
                  {
                    orientation: C,
                    direction: R ? "right" : "left",
                    onClick: ze,
                    disabled: !_.start,
                    className: k(
                      c.scrollButtons,
                      S !== "on" && c.scrollButtonsDesktop
                    ),
                  },
                  Q
                )
              )
            : null),
          (t.scrollButtonEnd = s
            ? a.createElement(
                G,
                y(
                  {
                    orientation: C,
                    direction: R ? "left" : "right",
                    onClick: _e,
                    disabled: !_.end,
                    className: k(
                      c.scrollButtons,
                      S !== "on" && c.scrollButtonsDesktop
                    ),
                  },
                  Q
                )
              )
            : null),
          t
        );
      },
      xe = se(function () {
        var o = Ce(),
          t = o.tabsMeta,
          l = o.tabMeta;
        if (!(!l || !t)) {
          if (l[T] < t[T]) {
            var s = t[ee] + (l[T] - t[T]);
            oe(s);
          } else if (l[te] > t[te]) {
            var d = t[ee] + (l[te] - t[te]);
            oe(d);
          }
        }
      }),
      P = se(function () {
        if (j && S !== "off") {
          var o = x.current,
            t = o.scrollTop,
            l = o.scrollHeight,
            s = o.clientHeight,
            d = o.scrollWidth,
            g = o.clientWidth,
            v,
            A;
          if (p) (v = t > 1), (A = t < l - s - 1);
          else {
            var H = Te(x.current, Z.direction);
            (v = R ? H < d - g - 1 : H > 1), (A = R ? H > 1 : H < d - g - 1);
          }
          (v !== _.start || A !== _.end) && Fe({ start: v, end: A });
        }
      });
    a.useEffect(
      function () {
        var o = de(function () {
            O(), P();
          }),
          t = De(x.current);
        return (
          t.addEventListener("resize", o),
          function () {
            o.clear(), t.removeEventListener("resize", o);
          }
        );
      },
      [O, P]
    );
    var ne = a.useCallback(
      de(function () {
        P();
      })
    );
    a.useEffect(
      function () {
        return function () {
          ne.clear();
        };
      },
      [ne]
    ),
      a.useEffect(function () {
        Me(!0);
      }, []),
      a.useEffect(function () {
        O(), P();
      }),
      a.useEffect(
        function () {
          xe();
        },
        [xe, z]
      ),
      a.useImperativeHandle(
        m,
        function () {
          return { updateIndicator: O, updateScrollButtons: P };
        },
        [O, P]
      );
    var Ee = a.createElement(
        Ze,
        y({ className: c.indicator, orientation: C, color: M }, J, {
          style: y({}, z, J.style),
        })
      ),
      ie = 0,
      Ae = a.Children.map($, function (o) {
        if (!a.isValidElement(o)) return null;
        var t = o.props.value === void 0 ? ie : o.props.value;
        we.set(t, ie);
        var l = t === le;
        return (
          (ie += 1),
          a.cloneElement(o, {
            fullWidth: fe === "fullWidth",
            indicator: l && !be && Ee,
            selected: l,
            selectionFollowsFocus: re,
            onChange: F,
            textColor: W,
            value: t,
          })
        );
      }),
      He = function (t) {
        var l = t.target,
          s = l.getAttribute("role");
        if (s === "tab") {
          var d = null,
            g = C !== "vertical" ? "ArrowLeft" : "ArrowUp",
            v = C !== "vertical" ? "ArrowRight" : "ArrowDown";
          switch (
            (C !== "vertical" &&
              Z.direction === "rtl" &&
              ((g = "ArrowRight"), (v = "ArrowLeft")),
            t.key)
          ) {
            case g:
              d = l.previousElementSibling || L.current.lastChild;
              break;
            case v:
              d = l.nextElementSibling || L.current.firstChild;
              break;
            case "Home":
              d = L.current.firstChild;
              break;
            case "End":
              d = L.current.lastChild;
              break;
          }
          d !== null && (d.focus(), t.preventDefault());
        }
      },
      ce = Pe();
    return a.createElement(
      I,
      y({ className: k(c.root, E, p && c.vertical), ref: i }, Ie),
      ce.scrollButtonStart,
      ce.scrollbarSizeListener,
      a.createElement(
        "div",
        {
          className: k(c.scroller, j ? c.scrollable : c.fixed),
          style: We,
          ref: x,
          onScroll: ne,
        },
        a.createElement(
          "div",
          {
            "aria-label": n,
            "aria-labelledby": f,
            className: k(
              c.flexContainer,
              p && c.flexContainerVertical,
              b && !j && c.centered
            ),
            onKeyDown: He,
            ref: L,
            role: "tablist",
          },
          Ae
        ),
        be && Ee
      ),
      ce.scrollButtonEnd
    );
  });
const ht = ae(ot, { name: "MuiTabs" })(nt);
export { ht as T, bt as a };
