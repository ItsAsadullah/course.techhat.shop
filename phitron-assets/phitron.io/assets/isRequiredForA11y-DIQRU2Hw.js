var r = { exports: {} },
  d;
function y() {
  return (
    d ||
      ((d = 1),
      (function (c, u) {
        Object.defineProperty(u, "__esModule", { value: !0 }), (u.default = l);
        function l(v) {
          return function (s, t, i, a, o) {
            var q = i || "<<anonymous>>",
              h = o || t;
            if (s[t] == null)
              return new Error(
                "The " +
                  a +
                  " `" +
                  h +
                  "` is required to make " +
                  ("`" + q + "` accessible for users of assistive ") +
                  "technologies such as screen readers."
              );
            for (
              var n = arguments.length, f = Array(n > 5 ? n - 5 : 0), e = 5;
              e < n;
              e++
            )
              f[e - 5] = arguments[e];
            return v.apply(void 0, [s, t, i, a, o].concat(f));
          };
        }
        c.exports = u.default;
      })(r, r.exports)),
    r.exports
  );
}
y();
