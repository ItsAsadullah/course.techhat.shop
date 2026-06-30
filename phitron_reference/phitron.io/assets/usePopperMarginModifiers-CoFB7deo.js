import { r as u, Q as j, a as g, T as O } from "./index-3GFABpq9.js";
import "./useRootClose-CQG1JC67.js";
import {
  a as I,
  j as k,
  b as D,
  c as L,
  e as T,
  o as B,
  f as W,
  d as q,
  h as K,
} from "./createPopper-COpkjmc_.js";
import { h as A } from "./hasClass-D5ZjVvBY.js";
function _(e) {
  return "default" + e.charAt(0).toUpperCase() + e.substr(1);
}
function G(e) {
  var t = Q(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function Q(e, t) {
  if (typeof e != "object" || e === null) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Y(e, t, n) {
  var r = u.useRef(e !== void 0),
    o = u.useState(t),
    a = o[0],
    l = o[1],
    d = e !== void 0,
    m = r.current;
  return (
    (r.current = d),
    !d && m && a !== t && l(t),
    [
      d ? e : a,
      u.useCallback(
        function (i) {
          for (
            var v = arguments.length, s = new Array(v > 1 ? v - 1 : 0), f = 1;
            f < v;
            f++
          )
            s[f - 1] = arguments[f];
          n && n.apply(void 0, [i].concat(s)), l(i);
        },
        [n]
      ),
    ]
  );
}
function ie(e, t) {
  return Object.keys(t).reduce(function (n, r) {
    var o,
      a = n,
      l = a[_(r)],
      d = a[r],
      m = j(a, [_(r), r].map(G)),
      i = t[r],
      v = Y(d, l, e[i]),
      s = v[0],
      f = v[1];
    return g({}, m, ((o = {}), (o[r] = s), (o[i] = f), o));
  }, e);
}
function z() {
  const e = u.useRef(!0),
    t = u.useRef(() => e.current);
  return (
    u.useEffect(
      () => (
        (e.current = !0),
        () => {
          e.current = !1;
        }
      ),
      []
    ),
    t.current
  );
}
function se() {
  return u.useState(null);
}
function H(e) {
  const t = z();
  return [
    e[0],
    u.useCallback(
      (n) => {
        if (t()) return e[1](n);
      },
      [t, e[1]]
    ),
  ];
}
var J = I({ defaultModifiers: [k, D, L, T, B, W, q, K] }),
  E = function (t) {
    return {
      position: t,
      top: "0",
      left: "0",
      opacity: "0",
      pointerEvents: "none",
    };
  },
  X = { name: "applyStyles", enabled: !1 },
  Z = {
    name: "ariaDescribedBy",
    enabled: !0,
    phase: "afterWrite",
    effect: function (t) {
      var n = t.state;
      return function () {
        var r = n.elements,
          o = r.reference,
          a = r.popper;
        if ("removeAttribute" in o) {
          var l = (o.getAttribute("aria-describedby") || "")
            .split(",")
            .filter(function (d) {
              return d.trim() !== a.id;
            });
          l.length
            ? o.setAttribute("aria-describedby", l.join(","))
            : o.removeAttribute("aria-describedby");
        }
      };
    },
    fn: function (t) {
      var n,
        r = t.state,
        o = r.elements,
        a = o.popper,
        l = o.reference,
        d = (n = a.getAttribute("role")) == null ? void 0 : n.toLowerCase();
      if (a.id && d === "tooltip" && "setAttribute" in l) {
        var m = l.getAttribute("aria-describedby");
        if (m && m.split(",").indexOf(a.id) !== -1) return;
        l.setAttribute("aria-describedby", m ? m + "," + a.id : a.id);
      }
    },
  },
  V = [];
function ue(e, t, n) {
  var r = n === void 0 ? {} : n,
    o = r.enabled,
    a = o === void 0 ? !0 : o,
    l = r.placement,
    d = l === void 0 ? "bottom" : l,
    m = r.strategy,
    i = m === void 0 ? "absolute" : m,
    v = r.modifiers,
    s = v === void 0 ? V : v,
    f = j(r, ["enabled", "placement", "strategy", "modifiers"]),
    p = u.useRef(),
    b = u.useCallback(function () {
      var y;
      (y = p.current) == null || y.update();
    }, []),
    c = u.useCallback(function () {
      var y;
      (y = p.current) == null || y.forceUpdate();
    }, []),
    h = H(
      u.useState({
        placement: d,
        update: b,
        forceUpdate: c,
        attributes: {},
        styles: { popper: E(i), arrow: {} },
      })
    ),
    U = h[0],
    S = h[1],
    P = u.useMemo(
      function () {
        return {
          name: "updateStateModifier",
          enabled: !0,
          phase: "write",
          requires: ["computeStyles"],
          fn: function (F) {
            var w = F.state,
              C = {},
              $ = {};
            Object.keys(w.elements).forEach(function (M) {
              (C[M] = w.styles[M]), ($[M] = w.attributes[M]);
            }),
              S({
                state: w,
                styles: C,
                attributes: $,
                update: b,
                forceUpdate: c,
                placement: w.placement,
              });
          },
        };
      },
      [b, c, S]
    );
  return (
    u.useEffect(
      function () {
        !p.current ||
          !a ||
          p.current.setOptions({
            placement: d,
            strategy: i,
            modifiers: [].concat(s, [P, X]),
          });
      },
      [i, d, P, a]
    ),
    u.useEffect(
      function () {
        if (!(!a || e == null || t == null))
          return (
            (p.current = J(
              e,
              t,
              g({}, f, {
                placement: d,
                strategy: i,
                modifiers: [].concat(s, [Z, P]),
              })
            )),
            function () {
              p.current != null &&
                (p.current.destroy(),
                (p.current = void 0),
                S(function (y) {
                  return g({}, y, { attributes: {}, styles: { popper: E(i) } });
                }));
            }
          );
      },
      [a, e, t]
    ),
    U
  );
}
function N(e) {
  var t = {};
  return Array.isArray(e)
    ? (e == null ||
        e.forEach(function (n) {
          t[n.name] = n;
        }),
      t)
    : e || t;
}
function ee(e) {
  return (
    e === void 0 && (e = {}),
    Array.isArray(e)
      ? e
      : Object.keys(e).map(function (t) {
          return (e[t].name = t), e[t];
        })
  );
}
function fe(e) {
  var t,
    n,
    r,
    o,
    a = e.enabled,
    l = e.enableEvents,
    d = e.placement,
    m = e.flip,
    i = e.offset,
    v = e.fixed,
    s = e.containerPadding,
    f = e.arrowElement,
    p = e.popperConfig,
    b = p === void 0 ? {} : p,
    c = N(b.modifiers);
  return g({}, b, {
    placement: d,
    enabled: a,
    strategy: v ? "fixed" : b.strategy,
    modifiers: ee(
      g({}, c, {
        eventListeners: { enabled: l },
        preventOverflow: g({}, c.preventOverflow, {
          options: s
            ? g(
                { padding: s },
                (t = c.preventOverflow) == null ? void 0 : t.options
              )
            : (n = c.preventOverflow) == null
            ? void 0
            : n.options,
        }),
        offset: {
          options: g(
            { offset: i },
            (r = c.offset) == null ? void 0 : r.options
          ),
        },
        arrow: g({}, c.arrow, {
          enabled: !!f,
          options: g({}, (o = c.arrow) == null ? void 0 : o.options, {
            element: f,
          }),
        }),
        flip: g({ enabled: !!m }, c.flip),
      })
    ),
  });
}
const x = (e) =>
  !e || typeof e == "function"
    ? e
    : (t) => {
        e.current = t;
      };
function te(e, t) {
  const n = x(e),
    r = x(t);
  return (o) => {
    n && n(o), r && r(o);
  };
}
function pe(e, t) {
  return u.useMemo(() => te(e, t), [e, t]);
}
function R(e) {
  var t = window.getComputedStyle(e),
    n = parseFloat(t.marginTop) || 0,
    r = parseFloat(t.marginRight) || 0,
    o = parseFloat(t.marginBottom) || 0,
    a = parseFloat(t.marginLeft) || 0;
  return { top: n, right: r, bottom: o, left: a };
}
function ce() {
  var e = u.useRef(null),
    t = u.useRef(null),
    n = u.useRef(null),
    r = O(void 0, "popover"),
    o = O(void 0, "dropdown-menu"),
    a = u.useCallback(
      function (i) {
        !i ||
          !(A(i, r) || A(i, o)) ||
          ((t.current = R(i)), (i.style.margin = "0"), (e.current = i));
      },
      [r, o]
    ),
    l = u.useMemo(
      function () {
        return {
          name: "offset",
          options: {
            offset: function (v) {
              var s = v.placement;
              if (!t.current) return [0, 0];
              var f = t.current,
                p = f.top,
                b = f.left,
                c = f.bottom,
                h = f.right;
              switch (s.split("-")[0]) {
                case "top":
                  return [0, c];
                case "left":
                  return [0, h];
                case "bottom":
                  return [0, p];
                case "right":
                  return [0, b];
                default:
                  return [0, 0];
              }
            },
          },
        };
      },
      [t]
    ),
    d = u.useMemo(
      function () {
        return {
          name: "arrow",
          options: {
            padding: function () {
              if (!n.current) return 0;
              var v = n.current,
                s = v.top,
                f = v.right,
                p = s || f;
              return { top: p, left: p, right: p, bottom: p };
            },
          },
        };
      },
      [n]
    ),
    m = u.useMemo(
      function () {
        return {
          name: "popoverArrowMargins",
          enabled: !0,
          phase: "main",
          fn: function () {},
          requiresIfExists: ["arrow"],
          effect: function (v) {
            var s = v.state;
            if (!(!e.current || !s.elements.arrow || !A(e.current, r))) {
              if (s.modifiersData["arrow#persistent"]) {
                var f = R(s.elements.arrow),
                  p = f.top,
                  b = f.right,
                  c = p || b;
                s.modifiersData["arrow#persistent"].padding = {
                  top: c,
                  left: c,
                  right: c,
                  bottom: c,
                };
              } else n.current = R(s.elements.arrow);
              return (
                (s.elements.arrow.style.margin = "0"),
                function () {
                  s.elements.arrow && (s.elements.arrow.style.margin = "");
                }
              );
            }
          },
        };
      },
      [r]
    );
  return [a, [l, d, m]];
}
export { se as a, pe as b, ue as c, ce as d, Y as e, ie as f, fe as m, z as u };
