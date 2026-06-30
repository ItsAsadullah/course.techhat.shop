import { j as a } from "./index-3GFABpq9.js";
const l = ({
  children: e,
  duration: s = 150,
  direction: r = "linear",
  className: t = "",
  pause: o = !1,
  ...u
}) =>
  a.jsx("div", {
    className: `marquee-carousel ${t}`,
    ...u,
    children: a.jsx("div", {
      style: { "--duration": `${s}s` },
      "data-direction": r,
      "data-pause": o,
      className: "marquee-carousel__track",
      children: e,
    }),
  });
export { l as M };
