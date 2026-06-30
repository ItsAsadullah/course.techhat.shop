const N =
    "data:image/png;base64,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",
  p = (A) => {
    var g, r, n, s, e, c, a, o, t, l;
    return (l =
      (t =
        (o =
          (a =
            (c =
              (e =
                (s =
                  (n =
                    (r =
                      (g =
                        A == null
                          ? void 0
                          : A.replace(/০/g, "<strong>০</strong>")) == null
                        ? void 0
                        : g.replace(/১/g, "<strong>১</strong>")) == null
                      ? void 0
                      : r.replace(/২/g, "<strong>২</strong>")) == null
                    ? void 0
                    : n.replace(/৩/g, "<strong>৩</strong>")) == null
                  ? void 0
                  : s.replace(/৪/g, "<strong>৪</strong>")) == null
                ? void 0
                : e.replace(/৫/g, "<strong>৫</strong>")) == null
              ? void 0
              : c.replace(/৬/g, "<strong>৬</strong>")) == null
            ? void 0
            : a.replace(/৭/g, "<strong>৭</strong>")) == null
          ? void 0
          : o.replace(/৮/g, "<strong>৮</strong>")) == null
        ? void 0
        : t.replace(/৯/g, "<strong>৯</strong>")) == null
      ? void 0
      : l.replace(/%/g, "<strong>%</strong>");
  };
export { p as b, N as n };
