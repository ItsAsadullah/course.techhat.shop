const x = (p, n, u) => {
  var f;
  const g = p === "pending";
  let t = !1,
    i;
  if (g && n != null && n.length) {
    const o = n.find((l) => l._id === u);
    o ? ((t = !0), (i = o.title)) : (i = (f = n[0]) == null ? void 0 : f.title);
  }
  return { pending: g, isCurrent: t, pendingBatch: i };
};
export { x as g };
