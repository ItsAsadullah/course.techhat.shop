import { r, j as c } from "./index-3GFABpq9.js";
const x = {
    default: { base: 235, spread: 0 },
    blue: { base: 220, spread: 200 },
    purple: { base: 280, spread: 300 },
    green: { base: 120, spread: 200 },
    red: { base: 0, spread: 200 },
    orange: { base: 30, spread: 200 },
  },
  b = ({
    children: u,
    isVisible: s = !1,
    className: i = "",
    glowColor: l = "default",
  }) => {
    const e = r.useRef(null),
      n = r.useRef(s);
    r.useEffect(() => {
      n.current = s;
    }, [s]),
      r.useEffect(() => {
        if (!e.current) return;
        let t = null;
        const a = (m) => {
          t ||
            !n.current ||
            (t = requestAnimationFrame(() => {
              const { clientX: o, clientY: d } = m;
              e.current.style.setProperty("--x", o.toFixed(2)),
                e.current.style.setProperty(
                  "--xp",
                  (o / window.innerWidth).toFixed(2)
                ),
                e.current.style.setProperty("--y", d.toFixed(2)),
                e.current.style.setProperty(
                  "--yp",
                  (d / window.innerHeight).toFixed(2)
                ),
                (t = null);
            }));
        };
        return (
          document.addEventListener("pointermove", a),
          () => {
            document.removeEventListener("pointermove", a),
              cancelAnimationFrame(t);
          }
        );
      }, []);
    const { base: p, spread: f } = x[l];
    return c.jsxs("div", {
      ref: e,
      style: { "--base": p, "--spread": f },
      className: `custom-spotlight-card ${i}`,
      children: [c.jsx("div", { "data-glow": !0 }), u],
    });
  };
export { b as default };
