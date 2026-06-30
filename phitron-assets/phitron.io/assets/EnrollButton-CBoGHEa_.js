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
  j as t,
  Z as P,
  r as W,
  t as $,
  u as Q,
  E as U,
  D as H,
  bQ as I,
  bR as V,
  i as Y,
} from "./index-3GFABpq9.js";
import { A as M } from "./ai-ml-batch-B5ou_jmW.js";
import { u as Z } from "./useFeaturedBatch-CokVvzLs.js";
import { u as q, W as G } from "./WaitingEnroll-Dp9i8Nln.js";
import { g as J } from "./getPendingBatch-B516wMuf.js";
import { c as K } from "./index.esm-BLf48ImJ.js";
import { u as X } from "./useTheme-D5Kw55Xc.js";
import { u as tt } from "./useMediaQuery-psuZDLLE.js";
import { B as et } from "./Button-Brvz4f5T.js";
import { C as nt } from "./CircularProgress-BYL1-oIM.js";
import { u as k } from "./useSelector-DAUY7f9C.js";
const ot = ({
    text: l,
    isLoading: u = !1,
    animation: d = !0,
    shadow: m = !0,
    disabled: e,
    style: s = {},
    ...a
  }) => {
    const n = X(),
      o = tt(n.breakpoints.down("sm"));
    return t.jsx(P, {
      sx: {
        display: o ? "block" : "inline-block",
        position: "relative",
        width: o ? "100%" : "auto",
        ...s,
        "&:before": {
          content: '""',
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          animation: o || e || !d ? "none" : "focusAnimation2 2s infinite",
          borderRadius: "14px",
          border: "1px solid transparent",
          pointerEvents: "none",
        },
        "&:after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          animation: o || e || !d ? "none" : "focusAnimation1 2s infinite",
          borderRadius: "14px",
          border: "1px solid transparent",
          pointerEvents: "none",
        },
      },
      children: t.jsx(et, {
        style: {
          background: e
            ? "#9e9e9e"
            : "linear-gradient(114.29deg, #6EFFDD -11.46%, #0F77FF 34.11%, #073478 86.59%)",
          color: e ? "#757575" : "#fff",
          padding: "12px 36px",
          boxShadow:
            e || !m
              ? "none"
              : "0px 12px 30px 0px #10468C, 0px 4px 10px 0px #BAD7FFA6 inset",
          borderRadius: "12px",
          fontSize: 18,
          width: o ? "100%" : "auto",
          maxWidth: "300px",
          ...s,
        },
        ...a,
        disabled: e,
        variant: "contained",
        fullWidth: o,
        children: u
          ? t.jsxs(t.Fragment, {
              children: [
                l,
                " ",
                t.jsx(nt, { color: "primary", sx: { ml: 1 }, size: "1rem" }),
              ],
            })
          : l,
      }),
    });
  },
  rt = V(() =>
    Y(
      () => import("./EnrollNow-sa_QXuvl.js"),
      __vite__mapDeps([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46,
      ])
    )
  ),
  st = "AI/ML",
  gt = ({
    pendingAlertClassName: l = "",
    style: u,
    animation: d,
    shadow: m,
  }) => {
    const [e, s] = W.useState(!1),
      {
        _id: a,
        enrolledBatches: n,
        lastOrdered: o,
        lastOrderedBatches: S,
      } = k((r) => {
        var p;
        return ((p = r.user) == null ? void 0 : p.data) || {};
      }),
      f = k((r) => r.cart),
      { featuredBatch: w, isLoading: j } = Z(M),
      { currentTime: R, refetch: T, isFetching: F } = q(),
      x = $(),
      L = Q(),
      {
        _id: c,
        batchId: h,
        registrationStartDate: _,
        registrationEndDate: A,
      } = w || {},
      C = n == null ? void 0 : n.includes(c),
      D = (r = R) =>
        r.isBetween(I.tz(_, "Asia/Dhaka"), I.tz(A, "Asia/Dhaka"), null, "[]"),
      v = () => s(!1),
      z = async () => {
        if (!(j || F)) {
          if (C) return x.push("/dashboard");
          if (o === "pending") return x.push("/payment-pending");
          if (!D((await T()).data)) s(!0);
          else {
            const {
                name: r,
                price: p,
                thumbnail: O,
                discount: B,
                discountBatches: b,
              } = w || {},
              y = {
                _id: c,
                batch: h,
                title: r,
                price: p,
                thumbnail: O,
                registrationStartDate: _,
                registrationEndDate: A,
                type: M,
              };
            B &&
              n != null &&
              n.length &&
              b != null &&
              b.some((i) => n.includes(i)) &&
              (y.discount = B),
              (f != null &&
                f.find((i) => (i == null ? void 0 : i._id) === c)) ||
                (L(U(y)), H.updateCartToLocalStorage(a || "anonymous", [y])),
              a ? x.push(`/checkout/${h}`) : s(!0);
          }
        }
      },
      { pending: g, pendingBatch: E, isCurrent: N } = J(o, S, c);
    return t.jsxs(t.Fragment, {
      children: [
        t.jsx(ot, {
          title: g && E ? `Payment Under review for batch ${E}` : "",
          text: C
            ? "Already Enrolled"
            : g
            ? "Payment Under review"
            : "Enroll Now",
          onClick: z,
          disabled: j || F,
          style: u,
          animation: d,
          shadow: m,
        }),
        g &&
          !N &&
          t.jsxs(P, {
            sx: { maxWidth: "max-content" },
            component: "p",
            className: `mt-4 d-flex align-items-center justify-content-center bg-warning py-1 px-3 rounded ${l}`,
            children: [
              t.jsx(K, { className: "mr-1" }),
              "Payment pending for batch ",
              E,
            ],
          }),
        e &&
          (D()
            ? !a &&
              t.jsx(rt, { batchId: h, modalIsOpen: e, handleModalClose: v })
            : t.jsx(G, {
                registered: a,
                modalIsOpen: e,
                handleModalClose: v,
                batch: st,
              })),
      ],
    });
  };
export { gt as E };
