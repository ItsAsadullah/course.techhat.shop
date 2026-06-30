import {
  r as t,
  a2 as h,
  a3 as m,
  a4 as g,
  a5 as x,
} from "./index-3GFABpq9.js";
var y = function (a, e) {
  return a === e;
};
function E(r, a, e, v) {
  var i = t.useReducer(function (c) {
      return c + 1;
    }, 0),
    d = i[1],
    s = t.useMemo(
      function () {
        return g(e, v);
      },
      [e, v]
    ),
    u = t.useRef(),
    o = t.useRef(),
    l = t.useRef(),
    n = t.useRef(),
    b = e.getState(),
    f;
  try {
    if (r !== o.current || b !== l.current || u.current) {
      var S = r(b);
      n.current === void 0 || !a(S, n.current) ? (f = S) : (f = n.current);
    } else f = n.current;
  } catch (c) {
    throw (
      (u.current &&
        (c.message +=
          `
The error may be correlated with this previous error:
` +
          u.current.stack +
          `

`),
      c)
    );
  }
  return (
    x(function () {
      (o.current = r), (l.current = b), (n.current = f), (u.current = void 0);
    }),
    x(
      function () {
        function c() {
          try {
            var R = e.getState();
            if (R === l.current) return;
            var p = o.current(R);
            if (a(p, n.current)) return;
            (n.current = p), (l.current = R);
          } catch (C) {
            u.current = C;
          }
          d();
        }
        return (
          (s.onStateChange = c),
          s.trySubscribe(),
          c(),
          function () {
            return s.tryUnsubscribe();
          }
        );
      },
      [e, s]
    ),
    f
  );
}
function k(r) {
  r === void 0 && (r = h);
  var a =
    r === h
      ? m
      : function () {
          return t.useContext(r);
        };
  return function (v, i) {
    i === void 0 && (i = y);
    var d = a(),
      s = d.store,
      u = d.subscription,
      o = E(v, i, s, u);
    return t.useDebugValue(o), o;
  };
}
var A = k();
export { A as u };
