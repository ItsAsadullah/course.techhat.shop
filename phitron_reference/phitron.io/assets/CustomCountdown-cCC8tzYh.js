import { r as y, bW as c, j as l, x as N } from "./index-3GFABpq9.js";
import { H as R } from "./index-WboZPtBF.js";
function w(n, r) {
  if (!(n instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function A(n, r) {
  for (var o = 0; o < r.length; o++) {
    var e = r[o];
    (e.enumerable = e.enumerable || !1),
      (e.configurable = !0),
      "value" in e && (e.writable = !0),
      Object.defineProperty(n, e.key, e);
  }
}
function O(n, r, o) {
  return r && A(n.prototype, r), n;
}
function j(n, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  (n.prototype = Object.create(r && r.prototype, {
    constructor: { value: n, writable: !0, configurable: !0 },
  })),
    r && g(n, r);
}
function S(n) {
  return (
    (S = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        }),
    S(n)
  );
}
function g(n, r) {
  return (
    (g =
      Object.setPrototypeOf ||
      function (e, t) {
        return (e.__proto__ = t), e;
      }),
    g(n, r)
  );
}
function I() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
    return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return (
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {})),
      !0
    );
  } catch {
    return !1;
  }
}
function z(n) {
  if (n === void 0)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return n;
}
function H(n, r) {
  return r && (typeof r == "object" || typeof r == "function") ? r : z(n);
}
function x(n) {
  var r = I();
  return function () {
    var e = S(n),
      t;
    if (r) {
      var i = S(this).constructor;
      t = Reflect.construct(e, arguments, i);
    } else t = e.apply(this, arguments);
    return H(this, t);
  };
}
function $(n) {
  return L(n) || U(n) || W(n) || F();
}
function L(n) {
  if (Array.isArray(n)) return D(n);
}
function U(n) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(n)) return Array.from(n);
}
function W(n, r) {
  if (n) {
    if (typeof n == "string") return D(n, r);
    var o = Object.prototype.toString.call(n).slice(8, -1);
    if (
      (o === "Object" && n.constructor && (o = n.constructor.name),
      o === "Map" || o === "Set")
    )
      return Array.from(n);
    if (o === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o))
      return D(n, r);
  }
}
function D(n, r) {
  (r == null || r > n.length) && (r = n.length);
  for (var o = 0, e = new Array(r); o < r; o++) e[o] = n[o];
  return e;
}
function F() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function T(n) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2,
    o = String(n);
  if (r === 0) return o;
  var e = o.match(/(.*?)([0-9]+)(.*)/),
    t = e ? e[1] : "",
    i = e ? e[3] : "",
    a = e ? e[2] : o,
    s =
      a.length >= r
        ? a
        : (
            $(Array(r))
              .map(function () {
                return "0";
              })
              .join("") + a
          ).slice(r * -1);
  return "".concat(t).concat(s).concat(i);
}
var _ = { daysInHours: !1, zeroPadTime: 2 };
function V(n) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    o = r.now,
    e = o === void 0 ? Date.now : o,
    t = r.precision,
    i = t === void 0 ? 0 : t,
    a = r.controlled,
    s = r.offsetTime,
    u = s === void 0 ? 0 : s,
    p = r.overtime,
    f;
  typeof n == "string"
    ? (f = new Date(n).getTime())
    : n instanceof Date
    ? (f = n.getTime())
    : (f = n),
    a || (f += u);
  var m = a ? f : f - e(),
    d = Math.min(20, Math.max(0, i)),
    v = Math.round(
      parseFloat(((p ? m : Math.max(0, m)) / 1e3).toFixed(d)) * 1e3
    ),
    h = Math.abs(v) / 1e3;
  return {
    total: v,
    days: Math.floor(h / (3600 * 24)),
    hours: Math.floor((h / 3600) % 24),
    minutes: Math.floor((h / 60) % 60),
    seconds: Math.floor(h % 60),
    milliseconds: Number(((h % 1) * 1e3).toFixed()),
    completed: v <= 0,
  };
}
function q(n, r) {
  var o = n.days,
    e = n.hours,
    t = n.minutes,
    i = n.seconds,
    a = Object.assign(Object.assign({}, _), r),
    s = a.daysInHours,
    u = a.zeroPadTime,
    p = a.zeroPadDays,
    f = p === void 0 ? u : p,
    m = Math.min(2, u),
    d = s ? T(e + o * 24, u) : T(e, m);
  return {
    days: s ? "" : T(o, f),
    hours: d,
    minutes: T(t, m),
    seconds: T(i, m),
  };
}
var C = (function (n) {
  j(o, n);
  var r = x(o);
  function o() {
    var e;
    return (
      w(this, o),
      (e = r.apply(this, arguments)),
      (e.state = { count: e.props.count || 3 }),
      (e.startCountdown = function () {
        e.interval = window.setInterval(function () {
          var t = e.state.count - 1;
          t === 0
            ? (e.stopCountdown(), e.props.onComplete && e.props.onComplete())
            : e.setState(function (i) {
                return { count: i.count - 1 };
              });
        }, 1e3);
      }),
      (e.stopCountdown = function () {
        clearInterval(e.interval);
      }),
      (e.addTime = function (t) {
        e.stopCountdown(),
          e.setState(function (i) {
            return { count: i.count + t };
          }, e.startCountdown);
      }),
      e
    );
  }
  return (
    O(o, [
      {
        key: "componentDidMount",
        value: function () {
          this.startCountdown();
        },
      },
      {
        key: "componentWillUnmount",
        value: function () {
          clearInterval(this.interval);
        },
      },
      {
        key: "render",
        value: function () {
          return this.props.children
            ? y.cloneElement(this.props.children, { count: this.state.count })
            : null;
        },
      },
    ]),
    o
  );
})(y.Component);
C.propTypes = { count: c.number, children: c.element, onComplete: c.func };
var b = (function (n) {
  j(o, n);
  var r = x(o);
  function o(e) {
    var t;
    if (
      (w(this, o),
      (t = r.call(this, e)),
      (t.mounted = !1),
      (t.initialTimestamp = t.calcOffsetStartTimestamp()),
      (t.offsetStartTimestamp = t.props.autoStart ? 0 : t.initialTimestamp),
      (t.offsetTime = 0),
      (t.legacyMode = !1),
      (t.legacyCountdownRef = null),
      (t.tick = function () {
        var a = t.calcTimeDelta(),
          s = a.completed && !t.props.overtime ? void 0 : t.props.onTick;
        t.setTimeDeltaState(a, void 0, s);
      }),
      (t.setLegacyCountdownRef = function (a) {
        t.legacyCountdownRef = a;
      }),
      (t.start = function () {
        if (!t.isStarted()) {
          var a = t.offsetStartTimestamp;
          (t.offsetStartTimestamp = 0),
            (t.offsetTime += a ? t.calcOffsetStartTimestamp() - a : 0);
          var s = t.calcTimeDelta();
          t.setTimeDeltaState(s, "STARTED", t.props.onStart),
            !t.props.controlled &&
              (!s.completed || t.props.overtime) &&
              (t.clearTimer(),
              (t.interval = window.setInterval(t.tick, t.props.intervalDelay)));
        }
      }),
      (t.pause = function () {
        t.isPaused() ||
          (t.clearTimer(),
          (t.offsetStartTimestamp = t.calcOffsetStartTimestamp()),
          t.setTimeDeltaState(t.state.timeDelta, "PAUSED", t.props.onPause));
      }),
      (t.stop = function () {
        t.isStopped() ||
          (t.clearTimer(),
          (t.offsetStartTimestamp = t.calcOffsetStartTimestamp()),
          (t.offsetTime = t.offsetStartTimestamp - t.initialTimestamp),
          t.setTimeDeltaState(t.calcTimeDelta(), "STOPPED", t.props.onStop));
      }),
      (t.isStarted = function () {
        return t.isStatus("STARTED");
      }),
      (t.isPaused = function () {
        return t.isStatus("PAUSED");
      }),
      (t.isStopped = function () {
        return t.isStatus("STOPPED");
      }),
      (t.isCompleted = function () {
        return t.isStatus("COMPLETED");
      }),
      e.date)
    ) {
      var i = t.calcTimeDelta();
      t.state = { timeDelta: i, status: i.completed ? "COMPLETED" : "STOPPED" };
    } else t.legacyMode = !0;
    return t;
  }
  return (
    O(o, [
      {
        key: "componentDidMount",
        value: function () {
          this.legacyMode ||
            ((this.mounted = !0),
            this.props.onMount && this.props.onMount(this.calcTimeDelta()),
            this.props.autoStart && this.start());
        },
      },
      {
        key: "componentDidUpdate",
        value: function (t) {
          this.legacyMode ||
            (this.props.date !== t.date &&
              ((this.initialTimestamp = this.calcOffsetStartTimestamp()),
              (this.offsetStartTimestamp = this.initialTimestamp),
              (this.offsetTime = 0),
              this.setTimeDeltaState(this.calcTimeDelta())));
        },
      },
      {
        key: "componentWillUnmount",
        value: function () {
          this.legacyMode || ((this.mounted = !1), this.clearTimer());
        },
      },
      {
        key: "calcTimeDelta",
        value: function () {
          var t = this.props,
            i = t.date,
            a = t.now,
            s = t.precision,
            u = t.controlled,
            p = t.overtime;
          return V(i, {
            now: a,
            precision: s,
            controlled: u,
            offsetTime: this.offsetTime,
            overtime: p,
          });
        },
      },
      {
        key: "calcOffsetStartTimestamp",
        value: function () {
          return Date.now();
        },
      },
      {
        key: "addTime",
        value: function (t) {
          this.legacyCountdownRef.addTime(t);
        },
      },
      {
        key: "clearTimer",
        value: function () {
          window.clearInterval(this.interval);
        },
      },
      {
        key: "isStatus",
        value: function (t) {
          return this.state.status === t;
        },
      },
      {
        key: "setTimeDeltaState",
        value: function (t, i, a) {
          var s = this;
          if (this.mounted) {
            var u = t.completed && !this.state.timeDelta.completed,
              p = t.completed && i === "STARTED";
            u && !this.props.overtime && this.clearTimer();
            var f = function () {
              a && a(s.state.timeDelta),
                s.props.onComplete && (u || p) && s.props.onComplete(t, p);
            };
            return this.setState(function (m) {
              var d = i || m.status;
              return (
                t.completed && !s.props.overtime
                  ? (d = "COMPLETED")
                  : !i && d === "COMPLETED" && (d = "STOPPED"),
                { timeDelta: t, status: d }
              );
            }, f);
          }
        },
      },
      {
        key: "getApi",
        value: function () {
          return (this.api = this.api || {
            start: this.start,
            pause: this.pause,
            stop: this.stop,
            isStarted: this.isStarted,
            isPaused: this.isPaused,
            isStopped: this.isStopped,
            isCompleted: this.isCompleted,
          });
        },
      },
      {
        key: "getRenderProps",
        value: function () {
          var t = this.props,
            i = t.daysInHours,
            a = t.zeroPadTime,
            s = t.zeroPadDays,
            u = this.state.timeDelta;
          return Object.assign(Object.assign({}, u), {
            api: this.getApi(),
            props: this.props,
            formatted: q(u, { daysInHours: i, zeroPadTime: a, zeroPadDays: s }),
          });
        },
      },
      {
        key: "render",
        value: function () {
          if (this.legacyMode) {
            var t = this.props,
              i = t.count,
              a = t.children,
              s = t.onComplete;
            return y.createElement(
              C,
              { ref: this.setLegacyCountdownRef, count: i, onComplete: s },
              a
            );
          }
          var u = this.props,
            p = u.className,
            f = u.overtime,
            m = u.children,
            d = u.renderer,
            v = this.getRenderProps();
          if (d) return d(v);
          if (m && this.state.timeDelta.completed && !f)
            return y.cloneElement(m, { countdown: v });
          var h = v.formatted,
            P = h.days,
            M = h.hours,
            E = h.minutes,
            k = h.seconds;
          return y.createElement(
            "span",
            { className: p },
            v.total < 0 ? "-" : "",
            P,
            P ? ":" : "",
            M,
            ":",
            E,
            ":",
            k
          );
        },
      },
    ]),
    o
  );
})(y.Component);
b.defaultProps = Object.assign(Object.assign({}, _), {
  controlled: !1,
  intervalDelay: 1e3,
  precision: 0,
  autoStart: !0,
});
b.propTypes = {
  date: c.oneOfType([c.instanceOf(Date), c.string, c.number]),
  daysInHours: c.bool,
  zeroPadTime: c.number,
  zeroPadDays: c.number,
  controlled: c.bool,
  intervalDelay: c.number,
  precision: c.number,
  autoStart: c.bool,
  overtime: c.bool,
  className: c.string,
  children: c.element,
  renderer: c.func,
  now: c.func,
  onMount: c.func,
  onStart: c.func,
  onPause: c.func,
  onStop: c.func,
  onTick: c.func,
  onComplete: c.func,
};
const J = (n) => {
  const r = (t) => {
      let i = "";
      return (
        t
          .toString()
          .split("")
          .forEach((s) => {
            i =
              i +
              "<div class='each-digit d-flex align-items-center justify-content-center'>" +
              s +
              "</div>";
          }),
        R(i)
      );
    },
    o = () => l.jsx("span", {}),
    e = ({ days: t, hours: i, minutes: a, seconds: s, completed: u }) =>
      u
        ? l.jsx(o, {})
        : l.jsxs("div", {
            className: "row mx-auto justify-content-center",
            children: [
              n.helperText &&
                l.jsxs("p", {
                  className: "text-center mt-3 col-12 countdown-helper-text",
                  children: [
                    "Section will be available in ",
                    t < 10 ? "0" + t : t,
                    " days",
                    " ",
                    i < 10 ? "0" + i : i,
                    " hours ",
                    a,
                    " min",
                    " ",
                    s < 10 ? "0" + s : s,
                    " second",
                  ],
                }),
              l.jsxs("div", {
                className: "m-2 each-count-part",
                children: [
                  l.jsx("div", {
                    className: "row",
                    children: r(t < 10 ? "0" + t : t),
                  }),
                  l.jsx("div", {
                    className: "text-center digit-label",
                    children: "Days",
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "m-2 each-count-part",
                children: [
                  l.jsx("div", {
                    className: "row",
                    children: r(i < 10 ? "0" + i : i),
                  }),
                  l.jsx("div", {
                    className: "text-center digit-label",
                    children: "Hours",
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "m-2 each-count-part",
                children: [
                  l.jsx("div", {
                    className: "row",
                    children: r(a < 10 ? "0" + a : a),
                  }),
                  l.jsx("div", {
                    className: "text-center digit-label",
                    children: "Minutes",
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "m-2 each-count-part",
                children: [
                  l.jsx("div", {
                    className: "row",
                    children: r(s < 10 ? "0" + s : s),
                  }),
                  l.jsx("div", {
                    className: "text-center digit-label",
                    children: "Seconds",
                  }),
                ],
              }),
            ],
          });
  return l.jsx("div", {
    className: "custom-countdown-component",
    children: l.jsx(b, {
      now: () => N.tz("Asia/Dhaka"),
      date: n.timeRemain,
      renderer: e,
    }),
  });
};
export { J as C };
