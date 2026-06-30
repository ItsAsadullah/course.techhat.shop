import { a as g } from "./grey-BpIXr15l.js";
import { bE as b } from "./index-3GFABpq9.js";
import { c as y } from "./capitalize-DJ5c-VNF.js";
import { c as q } from "./createChainedFunction-Da-WpsAN.js";
import { c as I } from "./createSvgIcon-CRfkuHZE.js";
import { d as x } from "./debounce-DtXjJkxj.js";
import { i as M } from "./isMuiElement-DolIe283.js";
import { o as P } from "./ownerDocument-DW-IO8s5.js";
import { o as R } from "./ownerWindow-DsnALE3J.js";
import { s as W, u as O, a as S } from "./useForkRef-BrlJjWiH.js";
import { u as j } from "./useControlled-sPKmD958.js";
import { u as w } from "./unstable_useId-CnF-2eKx.js";
import { u as h } from "./useIsFocusVisible-DtmZ3vI4.js";
function k(r, n) {
  return function () {
    return null;
  };
}
function C(r) {
  return function () {
    return null;
  };
}
function F(r, n, u, c, f) {
  return null;
}
const N = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      capitalize: y,
      createChainedFunction: q,
      createSvgIcon: I,
      debounce: x,
      deprecatedPropType: k,
      isMuiElement: M,
      ownerDocument: P,
      ownerWindow: R,
      requirePropFactory: C,
      setRef: W,
      unstable_useId: w,
      unsupportedProp: F,
      useControlled: j,
      useEventCallback: O,
      useForkRef: S,
      useIsFocusVisible: h,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
var p = { exports: {} },
  d;
function X() {
  return (
    d ||
      ((d = 1),
      (function (r) {
        var n = g().default;
        function u(c, f) {
          if (typeof WeakMap == "function")
            var v = new WeakMap(),
              _ = new WeakMap();
          return ((r.exports = u =
            function (e, l) {
              if (!l && e && e.__esModule) return e;
              var t,
                i,
                a = { __proto__: null, default: e };
              if (e === null || (n(e) != "object" && typeof e != "function"))
                return a;
              if ((t = l ? _ : v)) {
                if (t.has(e)) return t.get(e);
                t.set(e, a);
              }
              for (var o in e)
                o !== "default" &&
                  {}.hasOwnProperty.call(e, o) &&
                  ((i =
                    (t = Object.defineProperty) &&
                    Object.getOwnPropertyDescriptor(e, o)) &&
                  (i.get || i.set)
                    ? t(a, o, i)
                    : (a[o] = e[o]));
              return a;
            }),
          (r.exports.__esModule = !0),
          (r.exports.default = r.exports))(c, f);
        }
        (r.exports = u),
          (r.exports.__esModule = !0),
          (r.exports.default = r.exports);
      })(p)),
    p.exports
  );
}
var s = {};
const E = b(N);
var m;
function Y() {
  return (
    m ||
      ((m = 1),
      (function (r) {
        Object.defineProperty(r, "__esModule", { value: !0 }),
          Object.defineProperty(r, "default", {
            enumerable: !0,
            get: function () {
              return n.createSvgIcon;
            },
          });
        var n = E;
      })(s)),
    s
  );
}
export { Y as a, X as r };
