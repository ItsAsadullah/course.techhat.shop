import { r as s, ac as l } from "./index-3GFABpq9.js";
var i = !0,
  u = !1,
  a = null,
  o = {
    text: !0,
    search: !0,
    url: !0,
    tel: !0,
    email: !0,
    password: !0,
    number: !0,
    date: !0,
    month: !0,
    week: !0,
    time: !0,
    datetime: !0,
    "datetime-local": !0,
  };
function d(e) {
  var t = e.type,
    r = e.tagName;
  return !!(
    (r === "INPUT" && o[t] && !e.readOnly) ||
    (r === "TEXTAREA" && !e.readOnly) ||
    e.isContentEditable
  );
}
function c(e) {
  e.metaKey || e.altKey || e.ctrlKey || (i = !0);
}
function n() {
  i = !1;
}
function f() {
  this.visibilityState === "hidden" && u && (i = !0);
}
function y(e) {
  e.addEventListener("keydown", c, !0),
    e.addEventListener("mousedown", n, !0),
    e.addEventListener("pointerdown", n, !0),
    e.addEventListener("touchstart", n, !0),
    e.addEventListener("visibilitychange", f, !0);
}
function m(e) {
  var t = e.target;
  try {
    return t.matches(":focus-visible");
  } catch {}
  return i || d(t);
}
function h() {
  (u = !0),
    window.clearTimeout(a),
    (a = window.setTimeout(function () {
      u = !1;
    }, 100));
}
function v() {
  var e = s.useCallback(function (t) {
    var r = l.findDOMNode(t);
    r != null && y(r.ownerDocument);
  }, []);
  return { isFocusVisible: m, onBlurVisible: h, ref: e };
}
export { v as u };
