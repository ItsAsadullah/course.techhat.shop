const o = (t) => {
    var e;
    return (
      ((e = t.split("v=")[1]) == null ? void 0 : e.split("&")[0]) ||
      t.split("youtu.be/")[1]
    );
  },
  s = (t, e = "mqdefault") => `https://img.youtube.com/vi/${t}/${e}.jpg`,
  r = (t, e = "mqdefault") => {
    const u = o(t);
    return u ? s(u, e) : null;
  };
export { r as a, s as b, o as g };
