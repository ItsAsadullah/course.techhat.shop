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
  A as c,
  bQ as m,
  r as d,
  t as u,
  j as e,
  bR as p,
  i as h,
} from "./index-3GFABpq9.js";
import { a as x } from "./modal-xlRO5FO8.js";
import { g as f } from "./getEnrollmentContent-EKKttjBQ.js";
import { F as j, f as y } from "./index.es-BL_Cuqpi.js";
import { M as g } from "./index-D9BrGFpu.js";
import { P as v } from "./PrimaryButton2-BwNEQxNC.js";
const N = ["server-time"],
  E = 1e3 * 5,
  T = () =>
    fetch("https://phitron.io/api/server-time")
      .then((s) => s.json())
      .then((s) => m.tz(s.currentTime, "Asia/Dhaka")),
  M = () => {
    const {
      data: s,
      isFetching: t,
      isLoading: r,
      refetch: o,
    } = c({ queryFn: T, queryKey: N, refetchOnWindowFocus: !0, staleTime: E });
    return { currentTime: s, isFetching: t, isLoading: r, refetch: o };
  },
  R = p(() =>
    h(
      () => import("./EnrollNow-sa_QXuvl.js"),
      __vite__mapDeps([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46,
      ])
    )
  ),
  _ = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      width: "36%",
      bottom: "auto",
      overflow: "visible",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: 20,
    },
  },
  b = " তুমি আপাতত রেজিস্ট্রেশন করে রাখো।",
  O = ({ modalIsOpen: s, registered: t, handleModalClose: r, batch: o }) => {
    const [i, n] = d.useState(!1),
      a = u(),
      l = () => {
        o === "AI/ML" ? n(!0) : a.push("/register");
      };
    return e.jsxs(e.Fragment, {
      children: [
        !i &&
          e.jsx(g, {
            id: "easy-checkout-modal",
            isOpen: s,
            style: _,
            appElement: x,
            children: e.jsxs("div", {
              className: "enroll-modal",
              children: [
                e.jsx("div", {
                  className: "ml-3 mr-2",
                  children: e.jsx("div", {
                    className: "d-flex justify-content-end",
                    children: e.jsx(j, {
                      className: "enroll-modal-close-icon cursor-pointer",
                      icon: y,
                      onClick: r,
                    }),
                  }),
                }),
                e.jsxs("div", {
                  className: "text-center",
                  children: [
                    e.jsxs("p", {
                      className: "p-3",
                      children: [f(o), !t && b],
                    }),
                    !t &&
                      e.jsx("div", {
                        className: "mb-4 pb-2",
                        children: e.jsx(v, {
                          onClick: l,
                          size: "small",
                          className: "rounded-pill px-4",
                          children: "Register Now",
                        }),
                      }),
                  ],
                }),
              ],
            }),
          }),
        i &&
          e.jsx(R, {
            redirect: "/ai-ml-course",
            modalIsOpen: i,
            handleModalClose: r,
          }),
      ],
    });
  };
export { O as W, M as u };
