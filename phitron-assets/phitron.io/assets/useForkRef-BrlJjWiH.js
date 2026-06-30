import { r as u } from "./index-3GFABpq9.js";
function o(n, t) {
  typeof n == "function" ? n(t) : n && (n.current = t);
}
var r = typeof window < "u" ? u.useLayoutEffect : u.useEffect;
function s(n) {
  var t = u.useRef(n);
  return (
    r(function () {
      t.current = n;
    }),
    u.useCallback(function () {
      return t.current.apply(void 0, arguments);
    }, [])
  );
}
function f(n, t) {
  return u.useMemo(
    function () {
      return n == null && t == null
        ? null
        : function (e) {
            o(n, e), o(t, e);
          };
    },
    [n, t]
  );
}
export { f as a, o as s, s as u };
