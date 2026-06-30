import { j as e, Z as i, r as p, L as M } from "./index-3GFABpq9.js";
import { L as B } from "./LongCurveIcon-Ck_Sw-Cp.js";
import { P as F } from "./PrimaryButton2-BwNEQxNC.js";
import { A as R } from "./AnimatedTitle-Dlszz4aG.js";
import { a as v, p as g } from "./XPSC_success-C9TnZYej.js";
import { u as k } from "./useMediaQuery-psuZDLLE.js";
import { S as f } from "./Grid-CaM5q3yV.js";
import { L as A } from "./LightPassLine-Bf9zPAXO.js";
import { T as _, a as L } from "./Tabs-CDwdkUXT.js";
import { B as T } from "./ButtonBase-B4sdbh7v.js";
import "./styled-v8Rvh1DA.js";
import "./grey-BpIXr15l.js";
import "./defaultTheme-wLAKn6fj.js";
import "./classCallCheck-MFKM5G8b.js";
import "./Button-Brvz4f5T.js";
import "./capitalize-DJ5c-VNF.js";
import "./debounce-DtXjJkxj.js";
import "./ownerWindow-DsnALE3J.js";
import "./ownerDocument-DW-IO8s5.js";
import "./useForkRef-BrlJjWiH.js";
import "./useTheme-D5Kw55Xc.js";
import "./createSvgIcon-CRfkuHZE.js";
import "./useIsFocusVisible-DtmZ3vI4.js";
import "./TransitionGroupContext-CJT0Ny2r.js";
const w = ({ studentInfo: t }) => {
    const {
        batch: n,
        imageLink: o,
        codechefHandle: c,
        codeforcesHandle: x,
        codechefRank: r,
        name: s,
      } = t || {},
      d = k("(max-width:768px)");
    return e.jsxs(i, {
      className: "student-info-popup",
      sx: {
        borderRadius: "16px",
        background: "#fff",
        border: "1px solid #0060fa80",
        padding: { xs: "20px", md: "28px" },
        whiteSpace: "nowrap",
      },
      children: [
        e.jsxs(i, {
          sx: { display: "flex", alignItems: "center", gap: "8px" },
          children: [
            e.jsxs(i, {
              sx: {
                background: "#EF55331A",
                color: "#EF5533",
                fontSize: d ? 13 : 14,
                fontWeight: 500,
                borderRadius: "64px",
                height: 31,
                px: "14px",
                py: "6px",
              },
              children: [" ", "Batch - ", n],
            }),
            e.jsx(i, {
              sx: {
                background: "#54CF681A",
                color: "#16A82D",
                fontSize: d ? 13 : 14,
                fontWeight: 500,
                borderRadius: "64px",
                height: 31,
                px: "14px",
                py: "6px",
              },
              children: r,
            }),
          ],
        }),
        e.jsxs(i, {
          sx: { display: "flex", alignItems: "center", gap: "8px", my: "16px" },
          children: [
            e.jsx(i, {
              component: "img",
              src: o || v,
              sx: {
                height: 44,
                width: 44,
                borderRadius: "50%",
                objectFit: "cover",
              },
            }),
            e.jsx(i, {
              sx: {
                background: "#e4edff",
                color: "#583CEA",
                fontSize: d ? 15 : 18,
                fontWeight: 600,
                borderRadius: "64px",
                px: d ? "18px" : "22px",
                py: d ? "6px" : "8px",
              },
              children: e.jsx(i, {
                component: "span",
                sx: {
                  background: "var(--primary-gradient)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  MozTextFillColor: "transparent",
                },
                children: s,
              }),
            }),
          ],
        }),
        e.jsxs(i, {
          sx: {
            borderLeft: "3px solid var(--primary-color)",
            pl: "12px",
            height: 52,
            display: "flex",
            flexDirection: "column",
            color: "#101010CC",
            justifyContent: "space-around",
          },
          children: [
            e.jsxs(i, {
              sx: { fontSize: { xs: "15px", md: "18px" } },
              children: ["Codeforces Handle: ", x || "N/A"],
            }),
            e.jsxs(i, {
              sx: { fontSize: { xs: "15px", md: "18px" } },
              children: ["CodeChef Handle: ", c],
            }),
          ],
        }),
      ],
    });
  },
  b = () => Math.floor(Math.random() * 9),
  E = () => {
    const [t, n] = p.useState(b),
      [o, c] = p.useState(g.slice(0, 9)),
      x = (r) => {
        n(r);
      };
    return (
      p.useEffect(() => {
        const r = setInterval(() => {
          n((s) => {
            const d = b();
            return d === s ? b() : d;
          });
        }, 3e3);
        return () => clearInterval(r);
      }, []),
      p.useEffect(() => {
        const r = setInterval(() => {
          c(g.sort(() => 0.5 - Math.random()).slice(0, 9));
        }, 15e3);
        return () => clearInterval(r);
      }, []),
      e.jsx(i, {
        sx: {
          position: "relative",
          mt: 1,
          mb: 29,
          borderRadius: "24px",
          background: "#FFFFFF",
        },
        children: e.jsx(f, {
          container: !0,
          spacing: 2,
          children: o.map((r, s) => {
            var d;
            return e.jsxs(
              f,
              {
                item: !0,
                xs: 4,
                className: "student-single",
                children: [
                  e.jsx(i, {
                    className: "info-popup",
                    sx: {
                      position: "absolute",
                      zIndex: 1,
                      top: "100%",
                      left: 0,
                      width: "100%",
                      pointerEvents: "none",
                      opacity: t === s ? 1 : 0,
                      transition: "opacity 0.7s ease",
                      "& .student-info-popup": { width: "100%" },
                    },
                    children: e.jsx(w, { studentInfo: r }),
                  }),
                  e.jsxs(i, {
                    onClick: () => x(s),
                    className: "image-item",
                    sx: {
                      borderRadius: "12px",
                      padding: "1.5px",
                      position: "relative",
                      transition: "mixBlendMode 0.5s ease",
                      zIndex: 1,
                      mixBlendMode: t === s ? "inherit" : "luminosity",
                      "& svg rect": {
                        height: "calc(100% - 3px)",
                        width: "calc(100% - 3px)",
                      },
                    },
                    children: [
                      e.jsxs("svg", {
                        style: { position: "absolute", top: 0, left: 0 },
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        children: [
                          e.jsx("rect", {
                            x: "1.5",
                            y: "1.5",
                            rx: "11.25",
                            stroke: "url(#paint1_linear_164_1825)",
                            strokeWidth: "1.5",
                          }),
                          e.jsx("defs", {
                            children: e.jsxs("linearGradient", {
                              id: "paint1_linear_164_1825",
                              x1: "86.5",
                              y1: "0",
                              x2: "86.5",
                              y2: "184",
                              gradientUnits: "userSpaceOnUse",
                              children: [
                                e.jsx("stop", { stopColor: "#0060FA" }),
                                e.jsx("stop", {
                                  offset: "1",
                                  stopColor: "white",
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      e.jsx(i, {
                        loading: "lazy",
                        component: "img",
                        src:
                          r != null && r.imageLink
                            ? r == null
                              ? void 0
                              : r.imageLink
                            : v,
                        alt:
                          (d = r == null ? void 0 : r.name) == null
                            ? void 0
                            : d.slice(0, 15),
                        sx: {
                          width: "100%",
                          objectFit: "cover",
                          aspectRatio: "17/18",
                          borderRadius: "12px",
                          background:
                            "linear-gradient(180deg, rgba(4, 100, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)",
                        },
                      }),
                    ],
                  }),
                ],
              },
              s
            );
          }),
        }),
      })
    );
  },
  S = p.forwardRef((t, n) => {
    const { direction: o, ...c } = t;
    return e.jsx(i, {
      component: T,
      ref: n,
      sx: {
        flexShrink: 0,
        width: 48,
        height: 48,
        borderRadius: "50%",
        opacity: 1,
        background: "transparent",
        border: "1px solid #10101033",
        transition: "all 0.3s ease",
        "& svg": { stroke: "#101010B2" },
        "&:hover": {
          borderColor: "#583CEA",
          background: "#583CEA",
          "& svg": { stroke: "#fff" },
        },
      },
      style: { opacity: c.disabled ? 0 : 1 },
      ...c,
      children:
        o === "left"
          ? e.jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "10",
              height: "18",
              fill: "none",
              viewBox: "0 0 10 18",
              children: e.jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeOpacity: "1",
                strokeWidth: "1.5",
                d: "M8.75 16.5L1.25 9l7.5-7.5",
              }),
            })
          : e.jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "10",
              height: "18",
              fill: "none",
              viewBox: "0 0 10 18",
              children: e.jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeOpacity: "1",
                strokeWidth: "1.5",
                d: "M1.25 1.5L8.75 9L1.25 16.5",
              }),
            }),
    });
  });
S.displayName = "TabScrollButton";
const z = ({ images: t, activeImageId: n, setActiveImageId: o }) => {
    const c = p.useRef(null),
      x = (r, s) => {
        o(s);
      };
    return e.jsx(i, {
      ScrollButtonComponent: S,
      component: _,
      sx: {
        "& .MuiTabs-scrollable": { marginInline: "40px" },
        "& .MuiTabs-indicator": { display: "none" },
        "& .MuiTabs-scrollButtons:not(.Mui-disabled):hover": {
          background: "var(--primary-gradient)",
        },
        "& .MuiTabs-scrollButtons": {
          border: "1px solid rgba(16, 16, 16, 0.2)",
          borderRadius: "999px",
        },
      },
      value: n,
      onChange: x,
      variant: "scrollable",
      scrollButtons: "on",
      ref: c,
      "aria-label": "scrollable auto tabs example",
      children:
        t == null
          ? void 0
          : t.map((r) =>
              e.jsx(
                i,
                {
                  component: L,
                  sx: {
                    fontSize: 18,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    fontFamily: "Montserrat, sans-serif !important",
                    textTransform: "capitalize !important",
                    color: "#10101080",
                    background: "transparent",
                    border: "1px solid #10101033",
                    borderRadius: "999px !important",
                    mx: "16px !important",
                    px: "24px !important",
                    maxWidth: "280px !important",
                    "&.Mui-selected": {
                      border: "1px solid #583CEA",
                      background: "#e4edff",
                      color: "#583CEA",
                      fontWeight: 600,
                      "& span": {
                        background: "var(--primary-gradient)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        MozTextFillColor: "transparent",
                      },
                    },
                  },
                  label: r == null ? void 0 : r.name,
                  value: r == null ? void 0 : r.id,
                },
                r == null ? void 0 : r.id
              )
            ),
    });
  },
  N = (t) =>
    t === 2 || t === 3 || t === 8
      ? { right: "calc(100% + 20px)" }
      : { left: "calc(100% + 20px)" },
  y = ({
    studentInfo: t,
    className: n,
    index: o,
    isOddTurn: c,
    activeImageId: x,
    setActiveImageId: r,
  }) => {
    var s;
    return e.jsxs(i, {
      className:
        x === (t == null ? void 0 : t.id)
          ? "student-single active"
          : "student-single",
      sx: {
        position: "relative",
        pointerEvents:
          (n === "even-image" && c) || (n === "odd-image" && !c)
            ? "all"
            : "none",
      },
      onMouseOver: () => r(t == null ? void 0 : t.id),
      children: [
        e.jsx(i, {
          className: "info-popup",
          sx: {
            position: "absolute",
            zIndex: 999,
            top: "52%",
            pointerEvents: "none",
            ...N(o),
          },
          children: e.jsx(w, { index: o, studentInfo: t }),
        }),
        e.jsxs(i, {
          className: `image-item ${n}`,
          sx: {
            borderRadius: "12px",
            padding: "1.5px",
            position: "relative",
            transition: "mixBlendMode 0.5s ease",
            zIndex: 1,
            "& svg rect": {
              height: "calc(100% - 3px)",
              width: "calc(100% - 3px)",
            },
          },
          children: [
            e.jsxs("svg", {
              style: { position: "absolute", top: 0, left: 0 },
              xmlns: "http://www.w3.org/2000/svg",
              width: "100%",
              height: "100%",
              fill: "none",
              children: [
                e.jsx("rect", {
                  x: "1.5",
                  y: "1.5",
                  rx: "11.25",
                  stroke: "url(#paint1_linear_164_1825)",
                  strokeWidth: "1.5",
                }),
                e.jsx("defs", {
                  children: e.jsxs("linearGradient", {
                    id: "paint1_linear_164_1825",
                    x1: "86.5",
                    y1: "0",
                    x2: "86.5",
                    y2: "184",
                    gradientUnits: "userSpaceOnUse",
                    children: [
                      e.jsx("stop", { stopColor: "#0060FA" }),
                      e.jsx("stop", { offset: "1", stopColor: "white" }),
                    ],
                  }),
                }),
              ],
            }),
            e.jsx(i, {
              loading: "lazy",
              component: "img",
              src:
                t != null && t.imageLink
                  ? t == null
                    ? void 0
                    : t.imageLink
                  : v,
              alt:
                (s = t == null ? void 0 : t.name) == null
                  ? void 0
                  : s.slice(0, 15),
              sx: {
                width: "100%",
                objectFit: "cover",
                aspectRatio: "17/18",
                borderRadius: "12px",
                background:
                  "linear-gradient(180deg, rgba(4, 100, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)",
              },
            }),
          ],
        }),
      ],
    });
  },
  m = g.slice(0, g.length > 42 ? 42 : g.length),
  W = () => {
    const [t, n] = p.useState([]),
      [o, c] = p.useState([]),
      [x, r] = p.useState(5),
      [s, d] = p.useState(!1),
      [u, h] = p.useState(null),
      C = (() => {
        let a = !1;
        const l = Math.floor(m.length / 2);
        return () => {
          a = !a;
          const j = Math.random();
          a
            ? n(
                m
                  .slice(0, l)
                  .sort(() => 0.5 - j)
                  .slice(0, 9)
              )
            : c(
                m
                  .slice(l, m.length)
                  .sort(() => 0.5 - j)
                  .slice(0, 9)
              );
        };
      })();
    return (
      p.useEffect(() => {
        var a;
        c(m.slice(0, 9)),
          n(m.slice(9, 18)),
          h((a = m[5]) == null ? void 0 : a.id);
      }, []),
      p.useEffect(() => {
        const a = setInterval(() => {
          d((l) => !l), C();
        }, 15e3);
        return () => clearInterval(a);
      }, []),
      p.useEffect(() => {
        const a = setInterval(() => {
          r(Math.floor(Math.random() * 8));
        }, 3e3);
        return () => clearInterval(a);
      }, []),
      p.useEffect(() => {
        var a, l;
        h(
          s
            ? (l = o[x]) == null
              ? void 0
              : l.id
            : (a = t[x]) == null
            ? void 0
            : a.id
        );
      }, [x, s]),
      e.jsxs(i, {
        sx: {
          position: "relative",
          mt: 7,
          mb: 6,
          p: 4,
          borderRadius: "24px",
          background: "#FFFFFF",
        },
        children: [
          e.jsx(A, { top: !0, left: !0, bottom: !0, right: !0 }),
          e.jsxs(i, {
            sx: {
              display: "grid",
              mb: 4,
              gridTemplateAreas: `
              'gridItem-0 gridItem-1 gridItem-2 gridItem-3 gridItem-4 gridItem-5'
              'gridItem-11 gridItem-10 gridItem-9 gridItem-8 gridItem-7 gridItem-6'
              'gridItem-12 gridItem-13 gridItem-14 gridItem-15 gridItem-16 gridItem-17'
              `,
              gap: "26px",
              "& .even-image": {
                animation: s
                  ? "successStudentHide 15s linear"
                  : "successStudentShow 15s linear",
              },
              "& .odd-image": {
                animation: s
                  ? "successStudentShow 15s linear"
                  : "successStudentHide 15s linear",
              },
              "& .image-item": { mixBlendMode: "luminosity" },
              "& svg": { opacity: 0.4, transition: "opacity 0.5s ease" },
              "& .info-popup": { opacity: 0, transition: "opacity 0.5s ease" },
              "& .student-single.active": {
                "& .image-item": { mixBlendMode: "inherit" },
                "& svg": { opacity: 1 },
                "& .info-popup": { opacity: 1 },
              },
              "&:hover .student-single.active": {
                "& .image-item": { mixBlendMode: "luminosity" },
                "& svg": { opacity: 0.4 },
                "& .info-popup": { opacity: 0 },
              },
              "& .student-single:hover": {
                "& .image-item": { mixBlendMode: "inherit !important" },
                "& svg": { opacity: "1 !important" },
                "& .info-popup": { opacity: "1 !important" },
              },
            },
            children: [
              o == null
                ? void 0
                : o.map((a, l) =>
                    e.jsx(
                      i,
                      {
                        sx: {
                          gridArea: `gridItem-${l * 2}`,
                          border: "1px solid #1010101A",
                          borderRadius: "16px",
                          padding: "8px",
                        },
                        children: e.jsx(y, {
                          isOddTurn: s,
                          className: "even-image",
                          studentInfo: a,
                          index: l,
                          activeImageId: u,
                          setActiveImageId: h,
                        }),
                      },
                      l
                    )
                  ),
              t == null
                ? void 0
                : t.map((a, l) =>
                    e.jsx(
                      i,
                      {
                        sx: {
                          gridArea: `gridItem-${l * 2 + 1}`,
                          border: "1px solid #1010101A",
                          borderRadius: "16px",
                          padding: "8px",
                        },
                        children: e.jsx(y, {
                          isOddTurn: s,
                          className: "odd-image",
                          studentInfo: a,
                          index: l,
                          activeImageId: u,
                        }),
                      },
                      l
                    )
                  ),
            ],
          }),
          e.jsx(i, {
            sx: {
              marginTop: "20px",
              display: "flex",
              maxWidth: "100%",
              overflowX: "auto",
              gap: "16px",
            },
            children: e.jsx(z, {
              activeImageId: u,
              images: s ? o : t,
              setActiveImageId: h,
            }),
          }),
        ],
      })
    );
  },
  pe = () => {
    const t = k("(max-width:768px)");
    return e.jsxs("div", {
      className: "container home-page__problem-solvers-club",
      children: [
        e.jsxs(R, {
          className: "home-page__title--problem-solvers-club",
          children: [
            e.jsx("span", { children: "প্রবলেম" }),
            " ",
            e.jsx("span", { children: "সল্ভারস" }),
            " ",
            e.jsx("span", { children: "ক্লাবের" }),
            " ",
            e.jsxs("span", {
              className:
                "home-page__title__highlight d-flex align-items-center flex-column",
              children: ["র‍্যাংকড কোডার ", e.jsx(B, { width: 342 })],
            }),
          ],
        }),
        e.jsx("p", {
          className: "text-center home-page__text",
          children:
            "অনটাইমে মেইন কোর্স ফিনিশ করে ছাত্রদেরকে একটা স্পেশাল এক্সাম দিয়ে প্রবলেম সল্ভারস ক্লাবে জয়েন হতে হয়। সেখানে ৩-৪ মাসের রেগোরিয়াস ট্রেনিং কমপ্লিট করে যে সকল ছাত্র বিভিন্ন অনলাইন জাজে ব্যাজ এচিভ করেছে তাদের একাংশ --",
        }),
        t ? e.jsx(E, {}) : e.jsx(W, {}),
        e.jsx("div", {
          className: "text-center",
          children: e.jsx(M, {
            to: "/success-story?tab=problem-solver",
            children: e.jsx(F, { children: "View All" }),
          }),
        }),
      ],
    });
  };
export { pe as default };
