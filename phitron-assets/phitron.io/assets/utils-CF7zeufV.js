var i = function (o) {
  return o.scrollTop;
};
function a(t, o) {
  var r = t.timeout,
    e = t.style,
    n = e === void 0 ? {} : e;
  return {
    duration: n.transitionDuration || typeof r == "number" ? r : r[o.mode] || 0,
    delay: n.transitionDelay,
  };
}
export { a as g, i as r };
