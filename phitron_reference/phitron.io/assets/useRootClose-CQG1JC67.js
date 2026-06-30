import { l as D, r as l, X as T } from "./index-3GFABpq9.js";
import { r as P } from "./warning-C20GYw-A.js";
var E, L;
function S() {
  if (L) return E;
  L = 1;
  var e = function (n, r, t, i, f, u, v, d) {
    if (!n) {
      var c;
      if (r === void 0)
        c = new Error(
          "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
        );
      else {
        var w = [t, i, f, u, v, d],
          g = 0;
        (c = new Error(
          r.replace(/%s/g, function () {
            return w[g++];
          })
        )),
          (c.name = "Invariant Violation");
      }
      throw ((c.framesToPop = 1), c);
    }
  };
  return (E = e), E;
}
var $ = S();
const O = D($);
function q(e) {
  return (e && e.ownerDocument) || document;
}
const x = !!(
  typeof window < "u" &&
  window.document &&
  window.document.createElement
);
var C = !1,
  h = !1;
try {
  var b = {
    get passive() {
      return (C = !0);
    },
    get once() {
      return (h = C = !0);
    },
  };
  x &&
    (window.addEventListener("test", b, b),
    window.removeEventListener("test", b, !0));
} catch {}
function B(e, n, r, t) {
  if (t && typeof t != "boolean" && !h) {
    var i = t.once,
      f = t.capture,
      u = r;
    !h &&
      i &&
      ((u =
        r.__once ||
        function v(d) {
          this.removeEventListener(n, v, f), r.call(this, d);
        }),
      (r.__once = u)),
      e.addEventListener(n, u, C ? t : f);
  }
  e.addEventListener(n, r, t);
}
function F(e, n, r, t) {
  var i = t && typeof t != "boolean" ? t.capture : t;
  e.removeEventListener(n, r, i),
    r.__once && e.removeEventListener(n, r.__once, i);
}
function p(e, n, r, t) {
  return (
    B(e, n, r, t),
    function () {
      F(e, n, r, t);
    }
  );
}
function U(e) {
  const n = l.useRef(e);
  return (
    l.useEffect(() => {
      n.current = e;
    }, [e]),
    n
  );
}
function k(e) {
  const n = U(e);
  return l.useCallback(
    function (...r) {
      return n.current && n.current(...r);
    },
    [n]
  );
}
function j(e, n) {
  if (e.contains) return e.contains(n);
  if (e.compareDocumentPosition)
    return e === n || !!(e.compareDocumentPosition(n) & 16);
}
var I = P();
const V = D(I);
function W(e) {
  return e && "setState" in e ? T.findDOMNode(e) : e ?? null;
}
const X = function (e) {
  return q(W(e));
};
var z = 27,
  M = function () {};
function A(e) {
  return e.button === 0;
}
function G(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
var R = function (n) {
  return n && ("current" in n ? n.current : n);
};
function Q(e, n, r) {
  var t = r === void 0 ? {} : r,
    i = t.disabled,
    f = t.clickTrigger,
    u = f === void 0 ? "click" : f,
    v = l.useRef(!1),
    d = n || M,
    c = l.useCallback(
      function (o) {
        var s,
          m = R(e);
        V(
          !!m,
          "RootClose captured a close event but does not have a ref to compare it to. useRootClose(), should be passed a ref that resolves to a DOM node"
        ),
          (v.current =
            !m ||
            G(o) ||
            !A(o) ||
            !!j(
              m,
              (s = o.composedPath == null ? void 0 : o.composedPath()[0]) !=
                null
                ? s
                : o.target
            ));
      },
      [e]
    ),
    w = k(function (o) {
      v.current || d(o);
    }),
    g = k(function (o) {
      o.keyCode === z && d(o);
    });
  l.useEffect(
    function () {
      if (!(i || e == null)) {
        var o = window.event,
          s = X(R(e)),
          m = p(s, u, c, !0),
          _ = p(s, u, function (a) {
            if (a === o) {
              o = void 0;
              return;
            }
            w(a);
          }),
          K = p(s, "keyup", function (a) {
            if (a === o) {
              o = void 0;
              return;
            }
            g(a);
          }),
          y = [];
        return (
          "ontouchstart" in s.documentElement &&
            (y = [].slice.call(s.body.children).map(function (a) {
              return p(a, "mousemove", M);
            })),
          function () {
            m(),
              _(),
              K(),
              y.forEach(function (a) {
                return a();
              });
          }
        );
      }
    },
    [e, i, u, c, w, g]
  );
}
export {
  k as a,
  B as b,
  j as c,
  O as i,
  p as l,
  q as o,
  W as s,
  Q as u,
  V as w,
};
