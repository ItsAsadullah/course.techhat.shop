import { r as l, j as e, L as v } from "./index-3GFABpq9.js";
import { u as x, A as E } from "./AnimatedTitle-Dlszz4aG.js";
import { p as I } from "./preFetchPage--gkhD6Fq.js";
import { r as R } from "./index.esm-e_C0fI43.js";
import { P as j } from "./PrimaryButton2-BwNEQxNC.js";
import "./iconBase-BOMk728t.js";
import "./styled-v8Rvh1DA.js";
import "./grey-BpIXr15l.js";
import "./defaultTheme-wLAKn6fj.js";
import "./classCallCheck-MFKM5G8b.js";
import "./Button-Brvz4f5T.js";
import "./capitalize-DJ5c-VNF.js";
import "./ButtonBase-B4sdbh7v.js";
import "./useForkRef-BrlJjWiH.js";
import "./useIsFocusVisible-DtmZ3vI4.js";
import "./TransitionGroupContext-CJT0Ny2r.js";
const u =
    "data:image/webp;base64,UklGRgICAABXRUJQVlA4WAoAAAAQAAAAUwAAIgAAQUxQSLIBAAANkJZte902zxgIwjcEFQMrCA4InCFIgsA2gqYIGiNYgqAqgmkI9o3Bx0GHHHf4GRETAL5fCUBKk1IMfRCAlOYI8C6U9edJyXdL6mlPGKjqZ1Sg31H2fjhO2RAoe9/HCQhU5WUV9wZ412AJkZp04TghI61jjLARWscYuXDTr43bjnYYaF+doKd9mC7Bh8ONGCaf2em3dAIszxAym80tBQjJSmZIxvbtSmYgmZPC3tAv74AoQr4G+/0dwFX2Jxh7wDktTWNbWgO/ADx5BFRojkDyWbMeDgBSuaaa5/7N5EaYe4D//7p4Ruj9dYssnZpcpi0PGLrCuaUnTw91afig/MYTnn88IUs89nzM5BL3avuWj+yb3pNqVtcZtxRgF1tCFnlcPWKfHw7wLU/R1APyZP7DuszuRPQy0etsuBNzwHA2tgXFXDacjW3BKt1XXiimSrfI7HCF5IHw6igmMBNgs3UUleqmo3ymGrrC2xXmnuYZmHuaY61xV7vhUUKLRuCwkhadL7I997gO29rxDcDWm74WJy60+chd2jh7ySxS1vHTu8wixYVWjOru3CBw2gOSrRPgAFZQOCAqAAAAEAMAnQEqVAAjAD4JAoFAgQ4AABCWkAAA3RSH6pChQoNgAP7/v7sAAAAA",
  b = ({
    width: s = 188,
    height: A = 562,
    strokeWidth: o = 10,
    color: h = "#00FA68",
    ...V
  }) => {
    const p = l.useRef(null);
    return (
      l.useEffect(() => {
        const t = p.current;
        if (!t) return;
        const n = t.getTotalLength(),
          g = [150, 258, 470, n];
        (t.style.strokeDasharray = String(n)), (t.style.strokeDashoffset = "0");
        const i = [],
          d = () => {
            const m = g[i.length];
            if (
              (i.push(
                requestAnimationFrame(() => {
                  (t.style.transition = "stroke-dashoffset 0.8s linear"),
                    (t.style.strokeDashoffset = String(-m));
                })
              ),
              i.length >= g.length)
            ) {
              clearInterval(a);
              return;
            }
          };
        let a;
        const f = setTimeout(() => {
          d(), (a = setInterval(d, 1800));
        }, 500);
        return () => {
          i.forEach((m) => cancelAnimationFrame(m)),
            clearInterval(a),
            clearTimeout(f);
        };
      }, []),
      e.jsxs("svg", {
        width: s,
        height: A,
        viewBox: "0 0 188 562",
        fill: "none",
        ...V,
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          e.jsx("path", {
            d: "M3.25671 566.285L48.3871 527.546L55.9089 443.526L122.602 327.81L176.257 310.705L140.152 286.052L170.741 96.8825L176.257 0.285156",
            stroke: h,
            strokeWidth: o,
            strokeLinecap: "round",
          }),
          e.jsx("path", {
            ref: p,
            d: "M3.25671 566.285L48.3871 527.546L55.9089 443.526L122.602 327.81L176.257 310.705L140.152 286.052L170.741 96.8825L176.257 0.285156",
            stroke: "white",
            strokeWidth: o,
          }),
        ],
      })
    );
  },
  w =
    "data:image/webp;base64,UklGRloFAABXRUJQVlA4WAoAAAAQAAAAQgAAUwAAQUxQSCsCAAAFgF5rb94k3YQyIWxSNkhYgGQDmQWQF+B4A5IJemy9ko3lfvyMCAeSpMaNfEkrIMsG8YjfSJH3yfc6X6dpikyRXSfXE7wP5sDJ8S4rZHBQJE85yxb4TVNMFKmrL9I9CQ5IjoRJEIfEvf3FwZITCewcipydt+A3y7RChlNg6mGCKVeoKFHLqpecQDBvgZPxCB2hYlTJzzdTq5zArsYDyAgdIFEiGXjiwE1/i55pMG9oMoWClZ35t8gh6hdS/LSWRU8zsz2ahwjpQZ7IDOkqBBjDCiJZaUk+CXqDnqFGxpbiJlRNZlp0kxFvsw3m5CpqmlSLv/gp08IJiQVacBNYan5A2TTV+drqoEJhm42SqFAyJVLCWVOTHhWkpSbrIgtdlXHmBGaK2s7LKkhjFM0YKGtbwwZo/W0hI/863bYaqJg2xtfx9VnvGHVLe89KGpldj3lr7RQokvKTjGsGmsi+rG2dpiGkaGQY5JQMEmmh/yHoj1blJQkjAUGgbCj08EfEtLe+FGZ1hHsBMDF1o3VpK5vmANYcwjkhUC/ZBY2OStl3dkVk3QgQB69cARLxmDdd9j4Alr3Tpcp2w7L3Q6Hsfa+PC5St7/xsPI7xnQc2hddRXu7TERYjvPwHHMoRTLLbXYBLPQ5h8lzA/uOOBLoLfSqPMfrU/QjkbzjE4pGMB9IhhmgyjwT2P5p5+PepMV5DwKf7MMrC3wTq0d0wL0ZwexTw5S2d3dfvL/4FPQEAVlA4IAgDAACwFACdASpDAFQAPgkCgUCBXgAAEJQBCTxVvIfwm/ZH+s9Rlt52O/XL+q7+gbDpi/D/xv8nfYA/EDqAP53+M38g4QH8R/gH8J9tDpAP6r/APVi/p/WAfwD+yehX/QP4B8IH6vfrZ8BP8m/jH3m6IBQp58AGuCrC/rBcVXdidTyK5D5rltapWfE+MiomFYsVIy7B/rsflcfciH47d4nXdscm/uXRTAKW7WHILLrnkAAA/v618hruQZ2md/2PsRf/CUvlvX//+R/Ds+8mGREpDsBaynIR0///+9skx3DkySsHZRMNdq+hcyLnUf+K/CGo0QR+i5PE5hLpKABxCCVHnfvbJXygl4F3NthrM1mxaOW4EJ+to+LMF/fcBfLMtU6RhdcRbo6fXup7xq//5yZmC603SwIVAgKsnq7fy//73ziNOtUFArtanD4H6IHavMwwUiJ7LnItnhRyQoXVpOkUP4j4cQ6Oh+TIg8LiV5S2GSJ28B4Y5q7//abQHNOfrCofoKZ+gCrF6TLQomGsv1XfP/vKNi4G8lJD7x9Z1V1kvDK5UaFLokbPEQpBiwB4YqkFQ37Nt3F57ReL5HtBlXgefzEEoY++x3wYwN0a51ApEhpYGDRov/4hOyA4CtEydZg+vtYskWKp/B5DabZXSs/o+sbR0cyvrjJHy7m3PTVSzjvf2BXrxVGsH5vYRF3pE1+KepAiVZU0cUHTP/4rhnipRepOnWcqb6xlIZT6UN0/br4XVcxg68NPDSvA3J77I4phmZeWahdHCR6+s8Qbw/mDroWejgg0wM5r5qXRJofXPz3a/RbeJXP2C+sCbN8HHgLgtEFH8S6xdsRRtJjQDde//9/0ygO76dmMaMz8DgJHTuHeh7sEhxMZ5E/+Pi6+5/+0QOYuyU3E8Aj8+wYzpcldoaaypOD1+tMWj30ZymqUKd7ZTF7YD0vLa+jGLt3nfNi9iHL1f1L//5u1ch4dfADNp+aNE+iC5WJEfJPkGTKdEDROo8Wl7wJWfDYcN46k8Y/mq8ShDyaO4AAAAA==",
  c =
    "data:image/webp;base64,UklGRpQEAABXRUJQVlA4WAoAAAAQAAAAgwIA7gEAVlA4THYEAAAvg4J7EFehoG0bxvxJtzsg5n/+FbRtw4bkducNDvlxOEBQwAJgABAEAAAA4ALoA94GA1gsFhRs220bSQBmCv3ZQBfQodg55/773+MEnir3nDqDiP5DYSNJkmS2g0Kbew/uXkSSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJOXx3nvvvffee++9995777333nvvvffee++9995777333nvvvffee++99957f3p+RPz7V0fEv357RPyr97fdGHcOfSIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiLySo+Ir6sj4h/EEfF2c9uNcffoM+r3GXPEH0fEOy6SMcZ/47/x3/hv/Df+G/+N//6DNP67UVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX1nR8TfPDgi/uH1EfFXL2+7Me4en7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7t/3hwR//3tEfEfvxwR//LHbTfG/fXH47/x3/hv/Df+G/+N/8Z/F5BZ3197XwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuP5yRv33OCL+w9Mj4l+8uRPHeA13d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d/c31E/LOXR8Q//OhH1H+9tMe4Xf7l+n1/Mf4b/43/xn/jv/Hf+G/8d0/H+O/9TVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX17e0T8xy9HxL/8UUfU/7y0x3h1xgnGPTvkWOfqjGOde3XGsc69vbTHuD/4ePw3/hv/jf/Gf+O/8d+sbfz3/O65xtDfsrsd/XTGN4/tx6cj4r9+PyL+7c8zvr5svy7tMe4PPh7/jf/Gf+O/8d/4b/w3/vsNN/77b/BePd/GWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lrr49Mj4l+8OSK+vqwj6r9f2mPcH3w8/hv/jf/Gf+O/8d/4b/z3G2789+46IiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIivrw4Iv7NhyPib77FEfU/Lu0xXl2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZnZy4dHxF8/OyIeb+2I+k+X9hj3Bx+P/8Z/47/x3/hv/Df+G7bvdnT8v9tRFRERERERERERERERERERERERERERERERERERERERERERkbo6Iv5BHBFvN3JE/atLe4zx/25Hx3/jv/Hf+G/8N/4b//3Pl/HfnXO+Zg9OOV+zS3uMPzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMfPTok/oy3oA6Jv7DHSA==",
  S = "/assets/mountain-B0XHJFPi.webp",
  J = "/assets/ranked-B1H6Ty3P.webp",
  r = "/assets/stepper-2-wDM3Vjzb.webp",
  L = "/assets/three-star-DGIPFfTH.webp",
  M = "/assets/xpsc-CNfHzwuL.svg",
  O = () => {
    const { isVisible: s, ref: A } = x();
    return e.jsxs("div", {
      className:
        "home-page__competitive-programming text-center position-relative",
      children: [
        e.jsx("img", {
          src: c,
          alt: "grid-1",
          className: "home-page__competitive-programming__grid",
        }),
        e.jsx("img", {
          src: c,
          alt: "grid-2",
          className: "home-page__competitive-programming__grid",
        }),
        e.jsxs("div", {
          className: "container",
          children: [
            e.jsxs(E, {
              className: "text-white mb-3",
              children: [
                e.jsx("span", { children: "কম্পিটিটিভ" }),
                " ",
                e.jsx("span", { children: "প্রোগ্রামিং" }),
                " ",
                e.jsx("span", { children: "ট্র্যাক" }),
                " ",
                e.jsx("span", { children: "to" }),
                " ",
                e.jsx("span", {
                  className: "home-page__title__highlight",
                  children: "Ranked Coder",
                }),
              ],
            }),
            e.jsx("p", {
              className: "home-page__text text-white",
              children:
                "প্রোগ্রামিংয়ের দুনিয়ায় নিজেকে আলাদা প্রমাণ করার সেরা উপায় কম্পিটিটিভ প্রোগ্রামিং। আমাদের এই ট্র্যাকে পাবে সাজানো কারিকুলাম আর এক্সপার্ট মেন্টরশিপ…যা তোমাকে বিগিনার থেকে Codeforces-এর Pupil বা CodeChef-এর 2/3 Star Rated কোডারে পরিণত করতে সাহায্য করবে।",
            }),
            e.jsx(v, {
              to: "/problem-solvers-club",
              onMouseEnter: () => void I("problem-solvers-club"),
              children: e.jsxs(j, {
                className:
                  "rounded-pill home-page__competitive-programming__button",
                children: [
                  "XPSC ক্লাব সম্পর্কে বিস্তারিত ",
                  e.jsx(R, { className: "ml-2" }),
                ],
              }),
            }),
            e.jsxs("div", {
              ref: A,
              className:
                "position-relative mx-auto home-page__competitive-programming__main",
              children: [
                e.jsx("img", {
                  "data-state": s ? "visible" : "hidden",
                  draggable: !1,
                  src: w,
                  className: "home-page__competitive-programming__flag",
                  alt: "flag",
                }),
                e.jsx("img", {
                  "data-state": s ? "visible" : "hidden",
                  draggable: !1,
                  src: J,
                  className: "home-page__competitive-programming__ranked",
                  alt: "ranked",
                }),
                e.jsx("img", {
                  "data-state": s ? "visible" : "hidden",
                  draggable: !1,
                  src: u,
                  className: "home-page__competitive-programming__coder",
                  alt: "coder",
                }),
                e.jsx("img", {
                  "data-state": s ? "visible" : "hidden",
                  draggable: !1,
                  src: L,
                  className: "home-page__competitive-programming__three-star",
                  alt: "three-star",
                }),
                e.jsx("img", {
                  className: "home-page__competitive-programming__mountain",
                  src: S,
                  draggable: !1,
                  alt: "mountain",
                }),
                s &&
                  e.jsx(b, {
                    height: "100%",
                    className: "home-page__competitive-programming__line",
                  }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      "data-state": s ? "visible" : "hidden",
                      className: "home-page__competitive-programming__stepper",
                      children: [
                        e.jsx("img", { src: r, alt: "stepper-1" }),
                        e.jsx("p", {
                          className: "mb-0",
                          children: "প্রোগ্রামিং ফান্ডামেন্টালস",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      "data-state": s ? "visible" : "hidden",
                      className: "home-page__competitive-programming__stepper",
                      children: [
                        e.jsx("img", { src: r, alt: "stepper-2" }),
                        e.jsx("p", {
                          className: "mb-0",
                          children: "ডাটা স্ট্রাকচার এবং অ্যালগরিদম",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      "data-state": s ? "visible" : "hidden",
                      className: "home-page__competitive-programming__stepper",
                      children: [
                        e.jsx("img", { src: r, alt: "stepper-3" }),
                        e.jsx("img", {
                          src: M,
                          className:
                            "home-page__competitive-programming__stepper__xpsc",
                          alt: "xpsc",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };
export { O as default };
