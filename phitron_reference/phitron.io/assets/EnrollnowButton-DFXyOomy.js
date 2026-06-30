const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/EnrollNow-sa_QXuvl.js",
      "assets/index-3GFABpq9.js",
      "assets/index-CFEvRnVk.css",
      "assets/ai-ml-batch-B5ou_jmW.js",
      "assets/index.es-BL_Cuqpi.js",
      "assets/index-D9BrGFpu.js",
      "assets/warning-C20GYw-A.js",
      "assets/react-lifecycles-compat.es-Crfa1e2_.js",
      "assets/react-lifecycles-compat.es-BO9d1diy.js",
      "assets/ReactToastify-B7JNTpGN.js",
      "assets/ReactToastify-Bgano2bG.css",
      "assets/loginRegisterForm-DGXWLB1F.js",
      "assets/success-email-BdioytQO.js",
      "assets/chekmail-CWAOodzL.js",
      "assets/processing-qXwRGN2_.js",
      "assets/useSearchParams-CGLljhQk.js",
      "assets/regex-C-w4AztA.js",
      "assets/js.cookie-Cz0CWeBA.js",
      "assets/index.esm-5PLeMIfy.js",
      "assets/CustomDialog-BrfKpqUF.js",
      "assets/withStyles-B1IuUwKu.js",
      "assets/grey-BpIXr15l.js",
      "assets/defaultTheme-wLAKn6fj.js",
      "assets/classCallCheck-MFKM5G8b.js",
      "assets/DialogContent-9uDLpnz2.js",
      "assets/capitalize-DJ5c-VNF.js",
      "assets/Modal-DSJdFoID.js",
      "assets/ownerDocument-DW-IO8s5.js",
      "assets/createChainedFunction-Da-WpsAN.js",
      "assets/useForkRef-BrlJjWiH.js",
      "assets/ownerWindow-DsnALE3J.js",
      "assets/Backdrop-CKim0D1Q.js",
      "assets/useTheme-D5Kw55Xc.js",
      "assets/utils-CF7zeufV.js",
      "assets/Transition-Bhu4Sc87.js",
      "assets/TransitionGroupContext-CJT0Ny2r.js",
      "assets/Paper-ChFTbczx.js",
      "assets/TextField-DYylxtBO.js",
      "assets/Select-azyuuvbX.js",
      "assets/isMuiElement-DolIe283.js",
      "assets/useFormControl-TOhcjoXR.js",
      "assets/Menu-D75pj1sg.js",
      "assets/debounce-DtXjJkxj.js",
      "assets/List-C2OHR8qS.js",
      "assets/useControlled-sPKmD958.js",
      "assets/createSvgIcon-CRfkuHZE.js",
      "assets/loginRegisterForm-DpsRipQV.css",
    ])
) => i.map((i) => d[i]);
import {
  r as f,
  j as t,
  x as H,
  u as W,
  t as z,
  bR as G,
  i as P,
  b as v,
  D as R,
  E as L,
} from "./index-3GFABpq9.js";
import { g as D } from "./getPendingBatch-B516wMuf.js";
import { W as q } from "./WaitingEnroll-Dp9i8Nln.js";
import { P as O } from "./PrimaryButton2-BwNEQxNC.js";
import { u as w } from "./useSelector-DAUY7f9C.js";
const J = ({ text: n = "এখনই এনরোল করো !", ...a }) => {
    const e = f.useRef(`id-${Math.random().toString(36).slice(2)}`).current;
    return t.jsx("button", {
      className: "enroll-now-svg-button",
      ...a,
      children: t.jsxs("svg", {
        width: "160",
        height: "58",
        viewBox: "0 0 160 58",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          t.jsx("rect", {
            x: "0.5",
            y: "10.5",
            width: "159",
            height: "47",
            rx: "7.5",
            fill: "none",
            stroke: `url(#paint0_linear_${e})`,
            strokeDasharray: "3 3",
          }),
          t.jsx("path", {
            d: "M5 17C5 12.5817 8.58172 9 13 9H147C151.418 9 155 12.5817 155 17V45C155 49.4183 151.418 53 147 53H13C8.58172 53 5 49.4183 5 45V17Z",
            fill: "#1A3663",
          }),
          t.jsx("mask", {
            id: `path-3-inside-1_${e}`,
            fill: "white",
            children: t.jsx("path", {
              d: "M5 13C5 8.58172 8.58172 5 13 5H147C151.418 5 155 8.58172 155 13V41C155 45.4183 151.418 49 147 49H13C8.58172 49 5 45.4183 5 41V13Z",
            }),
          }),
          t.jsx("path", {
            d: "M5 13C5 8.58172 8.58172 5 13 5H147C151.418 5 155 8.58172 155 13V41C155 45.4183 151.418 49 147 49H13C8.58172 49 5 45.4183 5 41V13Z",
            fill: "#2374EB",
            "data-hover": "1",
          }),
          t.jsx("path", {
            d: "M5 5H155H5M155 41C155 46.5228 150.523 51 145 51H15C9.47715 51 5 46.5228 5 41C5 44.3137 8.58172 47 13 47H147C151.418 47 155 44.3137 155 41ZM155 41M5 49V5V49M5 49M155 5V49V5",
            fill: "#175BC2",
            "data-hover": "2",
            mask: `url(#path-3-inside-1_${e})`,
          }),
          t.jsx("mask", {
            id: `path-5-inside-2_${e}`,
            fill: "white",
            children: t.jsx("path", {
              d: "M5 13C5 8.58172 8.58172 5 13 5H21V49H13C8.58172 49 5 45.4183 5 41V13Z",
            }),
          }),
          t.jsx("path", {
            d: "M5 13C5 8.58172 8.58172 5 13 5H21V49H13C8.58172 49 5 45.4183 5 41V13Z",
            fill: "#1A54AA",
          }),
          t.jsx("path", {
            d: "M5 5H21H5M21 51H15C9.47715 51 5 46.5228 5 41C5 44.3137 8.58172 47 13 47H21V51ZM21 47M5 49V5V49M5 49M21 5V49V5",
            fill: "#134EA5",
            mask: `url(#path-5-inside-2_${e})`,
          }),
          t.jsx("rect", {
            x: "6",
            y: "1",
            width: "148",
            height: "39",
            rx: "7",
            fill: `url(#paint1_linear_${e})`,
            stroke: `url(#paint2_linear_${e})`,
            strokeWidth: "2",
          }),
          t.jsx("path", {
            "data-hover": "3",
            d: "M10.3366 18.3125C10.2375 21.575 8.77567 36.9233 12.8327 36.855C17.8465 36.7705 31.8516 36.6649 26.4925 34.7317C21.1337 32.7993 13.6663 33.9413 13.2272 27.1769C12.788 20.4124 10.5267 12.0709 10.3366 18.3125Z",
            fill: `url(#paint3_linear_${e})`,
          }),
          t.jsx("path", {
            d: "M10.4943 32.4736C11.0378 35.0541 11.2983 35.8996 13.7955 35.9879C16.2926 36.0754 15.4143 34.1207 13.4816 32.858C11.5488 31.5953 9.79183 29.1355 10.4943 32.4736Z",
            fill: "white",
          }),
          t.jsx("path", {
            d: "M10.5452 10.4817C9.54451 13.0144 10.0604 32.2412 12.0605 27.7998C13.9594 23.5834 11.9286 6.97928 10.5452 10.4817Z",
            fill: "white",
          }),
          t.jsx("path", {
            d: "M78 42C106.719 42 130 40.8807 130 39.5C130 38.1193 106.719 37 78 37C49.2812 37 26 38.1193 26 39.5C26 40.8807 49.2812 42 78 42Z",
            fill: `url(#paint4_radial_${e})`,
            children: t.jsx("animateTransform", {
              attributeName: "transform",
              type: "translate",
              values: `
      0 0;
      30 0;
      -30 0;
      0 0
    `,
              dur: "4s",
              repeatCount: "indefinite",
            }),
          }),
          t.jsx("path", {
            d: "M80 5C108.719 5 132 3.88071 132 2.5C132 1.11929 108.719 0 80 0C51.2812 0 28 1.11929 28 2.5C28 3.88071 51.2812 5 80 5Z",
            fill: `url(#paint5_radial_${e})`,
            children: t.jsx("animateTransform", {
              attributeName: "transform",
              type: "translate",
              values: `
      0 0;
      -30 0;
      30 0;
      0 0
    `,
              dur: "4s",
              repeatCount: "indefinite",
            }),
          }),
          t.jsx("text", {
            fill: "#fff",
            x: "50%",
            y: "36%",
            textAnchor: "middle",
            dominantBaseline: "middle",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "Hind Siliguri",
            children: n,
          }),
          t.jsxs("defs", {
            children: [
              t.jsxs("linearGradient", {
                id: `paint0_linear_${e}`,
                x1: "0",
                y1: "34",
                x2: "160",
                y2: "34",
                gradientUnits: "userSpaceOnUse",
                children: [
                  t.jsx("stop", { stopColor: "#583CEA", stopOpacity: "0" }),
                  t.jsx("stop", { offset: "0.25", stopColor: "#3564FF" }),
                  t.jsx("stop", { offset: "0.751504", stopColor: "#583CEA" }),
                  t.jsx("stop", {
                    offset: "1",
                    stopColor: "#3564FF",
                    stopOpacity: "0",
                  }),
                  t.jsx("animate", {
                    attributeName: "x1",
                    from: "-160",
                    to: "160",
                    dur: "3s",
                    repeatCount: "indefinite",
                  }),
                  t.jsx("animate", {
                    attributeName: "x2",
                    from: "0",
                    to: "320",
                    dur: "3s",
                    repeatCount: "indefinite",
                  }),
                ],
              }),
              t.jsxs("linearGradient", {
                id: `paint1_linear_${e}`,
                x1: "80",
                y1: "40.821",
                x2: "80",
                y2: "0.460889",
                gradientUnits: "userSpaceOnUse",
                children: [
                  t.jsx("stop", { stopColor: "#043ECF", "data-hover": "4" }),
                  t.jsx("stop", {
                    offset: "1",
                    stopColor: "#027DF4",
                    "data-hover": "5",
                  }),
                ],
              }),
              t.jsxs("linearGradient", {
                id: `paint2_linear_${e}`,
                x1: "5",
                y1: "20.5",
                x2: "155",
                y2: "20.5",
                gradientUnits: "userSpaceOnUse",
                children: [
                  t.jsx("stop", { stopColor: "white", stopOpacity: "0.2" }),
                  t.jsx("stop", { offset: "0.25", stopColor: "#00CAFC" }),
                  t.jsx("stop", { offset: "0.751504", stopColor: "#00C6FB" }),
                  t.jsx("stop", {
                    offset: "1",
                    stopColor: "white",
                    stopOpacity: "0.2",
                  }),
                ],
              }),
              t.jsxs("linearGradient", {
                id: `paint3_linear_${e}`,
                x1: "18.8472",
                y1: "16.113",
                x2: "18.8472",
                y2: "36.8552",
                gradientUnits: "userSpaceOnUse",
                children: [
                  t.jsx("stop", { stopColor: "#093EA7" }),
                  t.jsx("stop", { offset: "1", stopColor: "#0344D3" }),
                ],
              }),
              t.jsxs("radialGradient", {
                id: `paint4_radial_${e}`,
                cx: "0",
                cy: "0",
                r: "1",
                gradientUnits: "userSpaceOnUse",
                gradientTransform:
                  "translate(78.0039 39.4992) scale(36.9072 1.67775)",
                children: [
                  t.jsx("stop", { stopColor: "white" }),
                  t.jsx("stop", {
                    offset: "1",
                    stopColor: "white",
                    stopOpacity: "0",
                  }),
                ],
              }),
              t.jsxs("radialGradient", {
                id: `paint5_radial_${e}`,
                cx: "0",
                cy: "0",
                r: "1",
                gradientUnits: "userSpaceOnUse",
                gradientTransform:
                  "translate(80.0039 2.49918) scale(36.9072 1.67775)",
                children: [
                  t.jsx("stop", { stopColor: "white" }),
                  t.jsx("stop", {
                    offset: "1",
                    stopColor: "white",
                    stopOpacity: "0",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  },
  K = G(() =>
    P(
      () => import("./EnrollNow-sa_QXuvl.js"),
      __vite__mapDeps([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46,
      ])
    )
  ),
  st = (n) => {
    var S;
    const {
        _id: a,
        batchId: e,
        name: V,
        price: $,
        thumbnail: U,
        registrationStartDate: x,
        registrationEndDate: u,
      } = n.courseDetail || {},
      [l, k] = f.useState(H().toISOString()),
      C = w((i) => i.cart),
      s = w((i) => {
        var r;
        return ((r = i.user) == null ? void 0 : r.data) || {};
      }),
      A = w((i) => Array.isArray(i.user)),
      B = W(),
      j = z(),
      [m, d] = f.useState(!1),
      o =
        typeof (s == null ? void 0 : s.enrolledBatches) == "object" &&
        ((S = s == null ? void 0 : s.enrolledBatches) == null
          ? void 0
          : S.find((i) => i === a)),
      g = () => {
        var r, p;
        if (o) {
          j.push("/dashboard");
          return;
        }
        if ((s == null ? void 0 : s.lastOrdered) === "pending") {
          j.push("/payment-pending");
          return;
        }
        const i =
          (p = (r = v.getCurrentUser()) == null ? void 0 : r.user) == null
            ? void 0
            : p._id;
        if (i && u < l) {
          d(!0);
          return;
        }
        if (i && x > l) {
          d(!0);
          return;
        }
        Z({
          _id: a,
          batch: e,
          name: V,
          price: $,
          thumbnail: U,
          registrationStartDate: x,
          registrationEndDate: u,
        });
      },
      M = () => {
        d(!1);
      };
    f.useEffect(() => {
      setInterval(() => {
        k(H().toISOString());
      }, 6e4);
    }, []);
    const Z = ({
        _id: i,
        batch: r,
        name: p,
        price: F,
        thumbnail: N,
        registrationStartDate: T,
        registrationEndDate: I,
      }) => {
        var E;
        const c = (E = v.getCurrentUser()) == null ? void 0 : E.user;
        if (!(C != null && C.find((h) => h._id === i))) {
          const h = {
            _id: i,
            batch: r,
            title: p,
            price: F,
            thumbnail: N,
            registrationStartDate: T,
            registrationEndDate: I,
          };
          R.updateCartToLocalStorage(
            (c == null ? void 0 : c._id) || "anonymous",
            [h]
          ),
            B(L(h));
        }
        if (!c) {
          d(!0);
          return;
        }
        j.push(`/checkout/${r}`);
      },
      { pending: _, pendingBatch: b } = D(
        s == null ? void 0 : s.lastOrdered,
        s == null ? void 0 : s.lastOrderedBatches,
        a
      ),
      y = !a || A;
    return t.jsxs(t.Fragment, {
      children: [
        m && x <= l && u >= l
          ? t.jsx(K, { modalIsOpen: m, handleModalClose: M, batchId: e })
          : t.jsx(q, {
              registered: !!(s != null && s._id),
              modalIsOpen: m,
              handleModalClose: M,
            }),
        o || _
          ? t.jsx(O, {
              outlined: n.outlined,
              fullWidth: n.fullWidth,
              size: n.size,
              title: _ && b ? `Payment Under review for batch ${b}` : "",
              warning: _ && !o,
              onClick: g,
              noHover: o && n.outlined,
              className: "enroll-now-button",
              "data-state": o ? "enrolled" : "pending",
              children: o ? "তুমি ভর্তি আছো" : "পেমেন্ট যাচাই করা হচ্ছে",
            })
          : n.old || y
          ? t.jsx(O, {
              outlined: n.outlined,
              fullWidth: n.fullWidth,
              size: n.size,
              onClick: g,
              className: "enroll-now-button",
              disabled: y,
              style: y ? { background: "#d1d1d1" } : void 0,
              children: "এখনই এনরোল করো !",
            })
          : t.jsx(J, { text: "এখনই এনরোল করো !", onClick: g }),
      ],
    });
  };
export { st as E };
