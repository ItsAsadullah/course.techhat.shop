var y = function (a, n) {
  return (
    (y =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (t, r) {
          t.__proto__ = r;
        }) ||
      function (t, r) {
        for (var i in r)
          Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
      }),
    y(a, n)
  );
};
function h(a, n) {
  if (typeof n != "function" && n !== null)
    throw new TypeError(
      "Class extends value " + String(n) + " is not a constructor or null"
    );
  y(a, n);
  function t() {
    this.constructor = a;
  }
  a.prototype =
    n === null ? Object.create(n) : ((t.prototype = n.prototype), new t());
}
var p = function () {
  return (
    (p =
      Object.assign ||
      function (n) {
        for (var t, r = 1, i = arguments.length; r < i; r++) {
          t = arguments[r];
          for (var e in t)
            Object.prototype.hasOwnProperty.call(t, e) && (n[e] = t[e]);
        }
        return n;
      }),
    p.apply(this, arguments)
  );
};
function _(a, n, t, r) {
  var i = arguments.length,
    e =
      i < 3 ? n : r === null ? (r = Object.getOwnPropertyDescriptor(n, t)) : r,
    c;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    e = Reflect.decorate(a, n, t, r);
  else
    for (var l = a.length - 1; l >= 0; l--)
      (c = a[l]) && (e = (i < 3 ? c(e) : i > 3 ? c(n, t, e) : c(n, t)) || e);
  return i > 3 && e && Object.defineProperty(n, t, e), e;
}
function b(a, n, t, r) {
  function i(e) {
    return e instanceof t
      ? e
      : new t(function (c) {
          c(e);
        });
  }
  return new (t || (t = Promise))(function (e, c) {
    function l(u) {
      try {
        o(r.next(u));
      } catch (s) {
        c(s);
      }
    }
    function f(u) {
      try {
        o(r.throw(u));
      } catch (s) {
        c(s);
      }
    }
    function o(u) {
      u.done ? e(u.value) : i(u.value).then(l, f);
    }
    o((r = r.apply(a, n || [])).next());
  });
}
function d(a, n) {
  var t = {
      label: 0,
      sent: function () {
        if (e[0] & 1) throw e[1];
        return e[1];
      },
      trys: [],
      ops: [],
    },
    r,
    i,
    e,
    c = Object.create(
      (typeof Iterator == "function" ? Iterator : Object).prototype
    );
  return (
    (c.next = l(0)),
    (c.throw = l(1)),
    (c.return = l(2)),
    typeof Symbol == "function" &&
      (c[Symbol.iterator] = function () {
        return this;
      }),
    c
  );
  function l(o) {
    return function (u) {
      return f([o, u]);
    };
  }
  function f(o) {
    if (r) throw new TypeError("Generator is already executing.");
    for (; c && ((c = 0), o[0] && (t = 0)), t; )
      try {
        if (
          ((r = 1),
          i &&
            (e =
              o[0] & 2
                ? i.return
                : o[0]
                ? i.throw || ((e = i.return) && e.call(i), 0)
                : i.next) &&
            !(e = e.call(i, o[1])).done)
        )
          return e;
        switch (((i = 0), e && (o = [o[0] & 2, e.value]), o[0])) {
          case 0:
          case 1:
            e = o;
            break;
          case 4:
            return t.label++, { value: o[1], done: !1 };
          case 5:
            t.label++, (i = o[1]), (o = [0]);
            continue;
          case 7:
            (o = t.ops.pop()), t.trys.pop();
            continue;
          default:
            if (
              ((e = t.trys),
              !(e = e.length > 0 && e[e.length - 1]) &&
                (o[0] === 6 || o[0] === 2))
            ) {
              t = 0;
              continue;
            }
            if (o[0] === 3 && (!e || (o[1] > e[0] && o[1] < e[3]))) {
              t.label = o[1];
              break;
            }
            if (o[0] === 6 && t.label < e[1]) {
              (t.label = e[1]), (e = o);
              break;
            }
            if (e && t.label < e[2]) {
              (t.label = e[2]), t.ops.push(o);
              break;
            }
            e[2] && t.ops.pop(), t.trys.pop();
            continue;
        }
        o = n.call(a, t);
      } catch (u) {
        (o = [6, u]), (i = 0);
      } finally {
        r = e = 0;
      }
    if (o[0] & 5) throw o[1];
    return { value: o[0] ? o[1] : void 0, done: !0 };
  }
}
function v(a) {
  var n = typeof Symbol == "function" && Symbol.iterator,
    t = n && a[n],
    r = 0;
  if (t) return t.call(a);
  if (a && typeof a.length == "number")
    return {
      next: function () {
        return (
          a && r >= a.length && (a = void 0), { value: a && a[r++], done: !a }
        );
      },
    };
  throw new TypeError(
    n ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function w(a, n) {
  var t = typeof Symbol == "function" && a[Symbol.iterator];
  if (!t) return a;
  var r = t.call(a),
    i,
    e = [],
    c;
  try {
    for (; (n === void 0 || n-- > 0) && !(i = r.next()).done; ) e.push(i.value);
  } catch (l) {
    c = { error: l };
  } finally {
    try {
      i && !i.done && (t = r.return) && t.call(r);
    } finally {
      if (c) throw c.error;
    }
  }
  return e;
}
function g(a, n, t) {
  if (t || arguments.length === 2)
    for (var r = 0, i = n.length, e; r < i; r++)
      (e || !(r in n)) &&
        (e || (e = Array.prototype.slice.call(n, 0, r)), (e[r] = n[r]));
  return a.concat(e || Array.prototype.slice.call(n));
}
export { b as _, h as a, p as b, v as c, w as d, d as e, g as f, _ as g };
