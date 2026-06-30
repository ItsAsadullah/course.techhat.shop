import { r as b, j as e } from "./index-3GFABpq9.js";
import { L as v } from "./LongCurveIcon-Ck_Sw-Cp.js";
import n from "./courseDetails-CZ_QRwLP.js";
import { C as f } from "./CustomAccordion-BWHu-66s.js";
import { A as C } from "./AnimatedTitle-Dlszz4aG.js";
import "./index.es-BL_Cuqpi.js";
import "./AccordionSummary-CUzcqk46.js";
import "./useControlled-sPKmD958.js";
import "./Paper-ChFTbczx.js";
import "./Collapse-C1kZ8BZP.js";
import "./utils-CF7zeufV.js";
import "./useTheme-D5Kw55Xc.js";
import "./useForkRef-BrlJjWiH.js";
import "./Transition-Bhu4Sc87.js";
import "./TransitionGroupContext-CJT0Ny2r.js";
import "./ButtonBase-B4sdbh7v.js";
import "./useIsFocusVisible-DtmZ3vI4.js";
import "./IconButton-BVDtp5lr.js";
import "./capitalize-DJ5c-VNF.js";
const E = "/assets/codechef-T99PpFot.png",
  u = "/assets/codeforces-full-CY8nQ9I2.png",
  N = ({ topics: a }) =>
    e.jsx("ul", {
      className: "course-topics",
      children:
        a == null
          ? void 0
          : a.map(({ topic: r }, l) => e.jsxs("li", { children: [r, " "] }, l)),
    }),
  J = () => {
    var d, h, p, x;
    const [a, r] = b.useState(0),
      [l, m] = b.useState(0),
      o = (t) => () => {
        r(t), m(0);
      };
    return e.jsxs("div", {
      className: "container home-page__what-will-learn",
      children: [
        e.jsxs(C, {
          className: "home-page__title--what-will-learn",
          children: [
            e.jsx("span", { children: "এই" }),
            " ",
            e.jsx("span", { children: "কোর্স" }),
            " ",
            e.jsx("span", { children: "থেকে" }),
            " ",
            e.jsx("span", { children: "তুমি" }),
            " ",
            e.jsx("span", { children: "যা" }),
            " ",
            e.jsx("span", { children: "যা" }),
            " ",
            e.jsxs("span", {
              className:
                "home-page__title__highlight d-flex align-items-center flex-column",
              children: ["শিখতে পারবে! ", e.jsx(v, { width: 304 })],
            }),
          ],
        }),
        e.jsx("p", {
          className: "text-center home-page__text",
          children:
            "কম্পিউটার সায়েন্সের সব মেইন মেইন সাবজেক্ট, ৫০০+ প্রব্লেম সলভিং, প্রোগ্রামিং কনটেস্ট, আনলিমিটেড সাপোর্ট, সফ্টওয়ার ইঞ্জিনিয়ারিং ক্যারিয়ার, প্রতিদিন তিনবেলা গুগল মিট এ স্ক্রিনশেয়ার করে কোর্স রিলেটেড যেকোন সমস্যা লাইভ সমাধান করতে পারবে। আর কি লাগে?",
        }),
        e.jsx("div", {
          className: "home-page__what-will-learn__tab",
          children: e.jsxs("div", {
            className: "home-page__what-will-learn__tab__inner",
            children: [
              e.jsx("button", {
                "aria-selected": a === 0,
                "aria-controls": "semester-1",
                role: "tab",
                className: "home-page__what-will-learn__tab__inner__item",
                onClick: o(0),
                children: "Semester 1",
              }),
              e.jsx("button", {
                "aria-selected": a === 1,
                "aria-controls": "semester-2",
                role: "tab",
                className: "home-page__what-will-learn__tab__inner__item",
                onClick: o(1),
                children: "Semester 2",
              }),
              e.jsx("button", {
                "aria-selected": a === 2,
                "aria-controls": "semester-3",
                role: "tab",
                className: "home-page__what-will-learn__tab__inner__item",
                onClick: o(2),
                children: "Semester 3",
              }),
            ],
          }),
        }),
        e.jsx("div", {
          className: "home-page__what-will-learn__tab-content",
          children:
            a === 2
              ? (h = (d = n[a]) == null ? void 0 : d.path) == null
                ? void 0
                : h.map((t, i) => {
                    var j, g;
                    const c =
                      (g = (j = n[a]) == null ? void 0 : j.course) == null
                        ? void 0
                        : g.filter((s) => s.pathId === t.id);
                    return e.jsx(
                      "div",
                      {
                        className:
                          "home-page__what-will-learn__tab-content__semester-3",
                        children: e.jsx(f, {
                          title: t == null ? void 0 : t.title,
                          onExpand: () => m(i),
                          isExpand: { status: l === i },
                          children:
                            c == null
                              ? void 0
                              : c.map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      children: [
                                        e.jsx("h4", {
                                          className: "heading",
                                          children:
                                            t.id === 1
                                              ? s.title
                                                  .split(" ")
                                                  .map((_, w) =>
                                                    _ === "CodeChef"
                                                      ? e.jsx(
                                                          "img",
                                                          {
                                                            className:
                                                              "img-fluid mb-1 mr-2",
                                                            src: E,
                                                            width: 110,
                                                            alt: "codeChef",
                                                            loading: "lazy",
                                                          },
                                                          w
                                                        )
                                                      : _ === "CodeForces"
                                                      ? e.jsx(
                                                          "img",
                                                          {
                                                            className:
                                                              "img-fluid mb-1",
                                                            src: u,
                                                            width: 240,
                                                            alt: "codeForces",
                                                            loading: "lazy",
                                                          },
                                                          w
                                                        )
                                                      : _ + " "
                                                  )
                                              : s.title,
                                        }),
                                        e.jsx(N, {
                                          topics: s == null ? void 0 : s.topics,
                                        }),
                                      ],
                                    },
                                    s.id
                                  )
                                ),
                        }),
                      },
                      t.id
                    );
                  })
              : e.jsx("div", {
                  className: "home-page__what-will-learn__tab-content__inner",
                  children:
                    (x = (p = n[a]) == null ? void 0 : p.course) == null
                      ? void 0
                      : x.map((t, i) =>
                          e.jsx(
                            "div",
                            {
                              className:
                                n[a].course.length - 1 === i
                                  ? "home-page__what-will-learn__tab-content__inner__last-item"
                                  : "",
                              children: e.jsx(f, {
                                title: t == null ? void 0 : t.title,
                                onExpand: () => m(i),
                                isExpand: { status: l === i },
                                children: e.jsx(N, {
                                  topics: t == null ? void 0 : t.topics,
                                }),
                              }),
                            },
                            t.id
                          )
                        ),
                }),
        }),
      ],
    });
  };
export { J as default };
