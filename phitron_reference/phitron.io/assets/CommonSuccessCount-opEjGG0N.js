const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/SpotlightCard-N5SjQebn.js",
      "assets/index-3GFABpq9.js",
      "assets/index-CFEvRnVk.css",
      "assets/SpotlightCard-Cj2Bo4Wn.css",
    ])
) => i.map((i) => d[i]);
import { j as s, r as d, i as _ } from "./index-3GFABpq9.js";
import { L as p } from "./LongCurveIcon-Ck_Sw-Cp.js";
import { u as h, A as u } from "./AnimatedTitle-Dlszz4aG.js";
import { u as x } from "./useMediaQuery-psuZDLLE.js";
const g = d.lazy(() =>
    _(
      () => import("./SpotlightCard-N5SjQebn.js"),
      __vite__mapDeps([0, 1, 2, 3])
    )
  ),
  j = { 0: "", 1: "mt-4 mt-md-0", 2: "mt-4 mt-lg-0" },
  b = ({ title: c, titleHighlight: o, cards: l }) => {
    const i = x("(min-width: 768px)"),
      m = i ? g : "div",
      { isVisible: a, ref: n } = h(),
      r = i ? { isVisible: a } : {};
    return s.jsx("div", {
      className: "home-page__success-count",
      children: s.jsxs("div", {
        className: "container",
        children: [
          s.jsxs(u, {
            className: "home-page__title--success-count",
            children: [
              c.split(" ").map((e, t) => s.jsx("span", { children: e }, t)),
              s.jsxs("span", {
                className:
                  "home-page__title__highlight d-flex align-items-center flex-column",
                children: [o, " ", s.jsx(p, {})],
              }),
            ],
          }),
          s.jsx("div", {
            ref: n,
            className: "row justify-content-center",
            children: l.map((e, t) =>
              s.jsx(
                "div",
                {
                  "data-state": a ? "visible" : "hidden",
                  "data-animation": i ? "blur" : void 0,
                  className: `col-md-6 col-lg-4 animated-col-slides ${
                    j[t] ?? ""
                  }`,
                  children: s.jsxs(m, {
                    ...r,
                    className:
                      "home-page__success-count__item h-100 text-center",
                    children: [
                      s.jsx("img", {
                        src: e.icon,
                        alt: e.title,
                        loading: "lazy",
                      }),
                      s.jsx("h2", {
                        className: `mt-3 mx-auto home-page__success-count__item__${
                          t + 1
                        }-title`,
                        children: e.title,
                      }),
                      s.jsx("p", {
                        className: "mb-0",
                        children: e.description,
                      }),
                    ],
                  }),
                },
                t
              )
            ),
          }),
        ],
      }),
    });
  };
export { b as C };
