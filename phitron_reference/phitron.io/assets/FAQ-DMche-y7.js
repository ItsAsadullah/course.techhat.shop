import { r as p, A as l, j as t } from "./index-3GFABpq9.js";
import { L as n } from "./LongCurveIcon-Ck_Sw-Cp.js";
import { f as d } from "./faqService-jMSEld9k.js";
import { P as h } from "./PrimaryButton2-BwNEQxNC.js";
import { C as x } from "./CustomAccordion-BWHu-66s.js";
import { A as u } from "./AnimatedTitle-Dlszz4aG.js";
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
import "./index.es-BL_Cuqpi.js";
import "./AccordionSummary-CUzcqk46.js";
import "./useControlled-sPKmD958.js";
import "./Paper-ChFTbczx.js";
import "./Collapse-C1kZ8BZP.js";
import "./utils-CF7zeufV.js";
import "./useTheme-D5Kw55Xc.js";
import "./Transition-Bhu4Sc87.js";
import "./IconButton-BVDtp5lr.js";
const _ = 6,
  a = 1e3 * 60 * 24,
  f = () => d.getFaq(),
  K = () => {
    var r, i, m;
    const [e, c] = p.useState(!1),
      { data: s } = l("faq", f, { cacheTime: a, staleTime: a });
    return t.jsxs("div", {
      className: "container home-page__faq",
      children: [
        t.jsxs(u, {
          className: "home-page__title--success-count",
          children: [
            t.jsx("span", { children: "আমাদের" }),
            " ",
            t.jsx("span", { children: "নিয়ে" }),
            " ",
            t.jsxs("span", {
              className:
                "home-page__title__highlight d-flex align-items-center flex-column",
              children: ["আপনার জিজ্ঞাসা ", t.jsx(n, {})],
            }),
          ],
        }),
        t.jsx("p", {
          className: "text-center home-page__text",
          children:
            "আনলিমিটেড হেল্প, গাইডলাইন; এমনকি গুগল মিট এ স্ক্রিনশেয়ার করে সমস্যা সমাধান করতে চাইলে; এই কোর্সে জয়েন করো।",
        }),
        t.jsxs("div", {
          className: "home-page__faq__accordion",
          children: [
            (m =
              (i =
                (r = s == null ? void 0 : s.data) == null ? void 0 : r.data) ==
              null
                ? void 0
                : i.faqs) == null
              ? void 0
              : m
                  .slice(0, e ? void 0 : _)
                  .map((o) =>
                    t.jsx(
                      x,
                      {
                        title: o.question,
                        children: t.jsx("p", {
                          className: "mb-0",
                          children: o.answer,
                        }),
                      },
                      o._id
                    )
                  ),
            t.jsx(h, {
              className: "mt-4 mx-auto d-block",
              onClick: () => c(!e),
              children: e ? "Show Less" : "সমস্ত জিজ্ঞাসা",
            }),
          ],
        }),
      ],
    });
  };
export { K as default };
