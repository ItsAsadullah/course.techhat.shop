import { r as s, j as e } from "./index-3GFABpq9.js";
import { u as _ } from "./useFeaturedBatch-CokVvzLs.js";
import { E as h } from "./EnrollnowButton-DFXyOomy.js";
import { u as j } from "./useMediaQuery-psuZDLLE.js";
import "./batchService-OUj-wn8o.js";
import "./getPendingBatch-B516wMuf.js";
import "./WaitingEnroll-Dp9i8Nln.js";
import "./modal-xlRO5FO8.js";
import "./getEnrollmentContent-EKKttjBQ.js";
import "./index.es-BL_Cuqpi.js";
import "./index-D9BrGFpu.js";
import "./warning-C20GYw-A.js";
import "./react-lifecycles-compat.es-Crfa1e2_.js";
import "./react-lifecycles-compat.es-BO9d1diy.js";
import "./PrimaryButton2-BwNEQxNC.js";
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
import "./useSelector-DAUY7f9C.js";
const b = "/assets/ready-man-BkOuh8y7.png",
  x = 3e3,
  S = () => {
    const { featuredBatch: y, isLoading: d } = _("main"),
      n = j("(min-width:1200px)"),
      i = s.useRef(null),
      o = s.useRef(null),
      p = s.useRef(null),
      c = s.useRef(null);
    return (
      s.useEffect(() => {
        if (!n || !i.current || !o.current) return;
        let u;
        const a = o.current,
          l = i.current,
          t = p.current,
          r = c.current,
          m = () => {
            (a.style.filter = "blur(5px)"),
              (l.style.filter = "blur(0px)"),
              (t.style.opacity = "1"),
              (r.style.opacity = "0"),
              (t.style.filter = "blur(0px)"),
              (r.style.filter = "blur(5px)"),
              (u = setTimeout(() => {
                (a.style.filter = "blur(0px)"),
                  (l.style.filter = "blur(5px)"),
                  (t.style.opacity = "0"),
                  (r.style.opacity = "1"),
                  (t.style.filter = "blur(5px)"),
                  (r.style.filter = "blur(0px)");
              }, x));
          };
        m();
        const f = setInterval(m, x * 3);
        return () => {
          clearInterval(f),
            clearTimeout(u),
            (a.style.filter = "blur(0px)"),
            (l.style.filter = "blur(0px)"),
            (t.style.opacity = "0"),
            (r.style.opacity = "0");
        };
      }, [n]),
      e.jsx("div", {
        className: "container home-page__are-you-ready",
        children: e.jsxs("div", {
          className: "home-page__are-you-ready__inner",
          children: [
            e.jsxs("div", {
              children: [
                e.jsxs("div", {
                  className: "position-relative",
                  children: [
                    e.jsx("h2", {
                      ref: i,
                      className:
                        "home-page__title justify-content-start text-white mb-3",
                      children: "তুমি রেডি তো...?",
                    }),
                    e.jsxs("div", {
                      ref: p,
                      className: "home-page__are-you-ready__inner__focus-box",
                      children: [
                        e.jsx("span", {}),
                        e.jsx("span", {}),
                        e.jsx("span", {}),
                        e.jsx("span", {}),
                      ],
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "position-relative",
                  children: [
                    e.jsx("p", {
                      ref: o,
                      className: "home-page__text text-white",
                      children:
                        "একজন দক্ষ প্রোগ্রমার হতে চাইলে এই কোর্সে জয়েন করো। শিখতে গেলে যা যা লাগবে সেগুলো প্রোভাইড করব আমরা তোমার শুধু লেগে থাকতে হবে, হার্ড ওয়ার্ক করতে হবে।",
                    }),
                    e.jsxs("div", {
                      ref: c,
                      "data-box": 2,
                      className: "home-page__are-you-ready__inner__focus-box",
                      children: [
                        e.jsx("span", {}),
                        e.jsx("span", {}),
                        e.jsx("span", {}),
                        e.jsx("span", {}),
                      ],
                    }),
                  ],
                }),
                !d && e.jsx(h, { outlined: !0, courseDetail: y }),
              ],
            }),
            e.jsx("img", {
              className: "home-page__are-you-ready__inner__img",
              src: b,
              alt: "ready-man",
              loading: "lazy",
            }),
          ],
        }),
      })
    );
  };
export { S as default };
