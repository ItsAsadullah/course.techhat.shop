import { r as n, j as c } from "./index-3GFABpq9.js";
const a = (s) => {
    const e = n.useRef(null),
      [t, r] = n.useState(!1);
    return (
      n.useEffect(() => {
        if (!e.current) return;
        const i = new IntersectionObserver(([o]) => {
          r(o.isIntersecting);
        }, s);
        return (
          i.observe(e.current),
          () => {
            i.disconnect();
          }
        );
      }, [s]),
      { ref: e, isVisible: t }
    );
  },
  u = { threshold: 0.3 },
  b = ({ children: s, className: e = "" }) => {
    const { ref: t, isVisible: r } = a(u);
    return c.jsx("h2", {
      ref: t,
      className: `text-center home-page__title ${e}`,
      "data-state": r ? "visible" : "hidden",
      children: s,
    });
  };
export { b as A, a as u };
