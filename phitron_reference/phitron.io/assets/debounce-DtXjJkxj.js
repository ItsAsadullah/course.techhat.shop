function l(u) {
  var o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 166,
    e;
  function n() {
    for (var r = arguments.length, a = new Array(r), t = 0; t < r; t++)
      a[t] = arguments[t];
    var i = this,
      c = function () {
        u.apply(i, a);
      };
    clearTimeout(e), (e = setTimeout(c, o));
  }
  return (
    (n.clear = function () {
      clearTimeout(e);
    }),
    n
  );
}
export { l as d };
