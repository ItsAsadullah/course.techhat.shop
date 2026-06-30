import { e as S, t as P, r as o } from "./index-3GFABpq9.js";
const L = () => {
  const { search: n, pathname: e } = S(),
    a = P(),
    s = o.useMemo(() => new URLSearchParams(n), [n]),
    i = o.useCallback(
      (r, h = !1) => {
        const t = h ? a.replace.bind(a) : a.push.bind(a);
        if (typeof r == "function") {
          const c = {};
          s.forEach((f, m) => (c[m] = f));
          const u = r(c);
          t(`${e}?${new URLSearchParams(u).toString()}`);
          return;
        }
        if (r instanceof URLSearchParams) return t(`${e}?${r.toString()}`);
        t(`${e}?${new URLSearchParams(r).toString()}`);
      },
      [e, a, s]
    );
  return [s, i];
};
export { L as u };
