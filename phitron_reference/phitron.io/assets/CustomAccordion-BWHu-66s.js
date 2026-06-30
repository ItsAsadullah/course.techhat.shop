import { j as n, r as i, e as x } from "./index-3GFABpq9.js";
import { F as t, m as r, n as h, o as f, p as j } from "./index.es-BL_Cuqpi.js";
import { A as C, a as E, b as w } from "./AccordionSummary-CUzcqk46.js";
const N = () =>
    n.jsx("svg", {
      width: "21",
      height: "11",
      viewBox: "0 0 21 11",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: n.jsx("path", {
        d: "M10.2102 10.3352C9.86942 10.3358 9.5392 10.2172 9.27683 9.99974L0.526826 2.70808C0.22901 2.46054 0.0417247 2.10484 0.00617094 1.71921C-0.0293828 1.33359 0.0897074 0.949642 0.337243 0.651826C0.584778 0.35401 0.940482 0.166725 1.3261 0.131171C1.71173 0.0956172 2.09568 0.214707 2.39349 0.462242L10.2102 6.99558L18.0268 0.695577C18.176 0.574439 18.3476 0.483976 18.5319 0.429388C18.7161 0.3748 18.9093 0.357163 19.1004 0.377491C19.2915 0.397819 19.4767 0.45571 19.6453 0.547839C19.814 0.639967 19.9627 0.764516 20.0831 0.914326C20.2166 1.06427 20.3178 1.24019 20.3802 1.43104C20.4426 1.6219 20.4649 1.82359 20.4457 2.02347C20.4266 2.22336 20.3663 2.41713 20.2688 2.59265C20.1713 2.76817 20.0385 2.92166 19.8789 3.04349L11.1289 10.0872C10.859 10.2703 10.5355 10.3576 10.2102 10.3352Z",
        fill: "currentColor",
      }),
    }),
  g = (e) => {
    const [a, s] = i.useState(!1),
      c = () => {
        e.noExpand || (s(!a), e.onExpand && e.onExpand(!a));
      };
    i.useEffect(() => {
      e.isExpand && s(e.isExpand.status);
    }, [e.isExpand]);
    const d = (l) => {
        l.stopPropagation(),
          e.handleEdit &&
            e.handleEdit({
              id: e.id,
              label: e.label,
              formValue: e.formValue,
              module: e.module,
              milestone: e.milestone,
            });
      },
      m = (l) => {
        l.stopPropagation(),
          e.handleDelete &&
            e.handleDelete({
              id: e.id,
              moduleId: e.module,
              label: e.label,
              title: e.title,
            });
      },
      o = e.summary || i.Fragment,
      u = e.summaryProps || {};
    return n.jsx("div", {
      className:
        "custom-accordion-component " + x().pathname == "/" ? "shadow" : "",
      children: n.jsxs(C, {
        expanded: a,
        children: [
          n.jsx(o, {
            ...u,
            children: n.jsx(E, {
              onClick: () => c(),
              expandIcon: e.noExpand
                ? void 0
                : e.icon === "module"
                ? n.jsx(N, {})
                : e.icon && typeof e.icon != "string"
                ? e.icon
                : n.jsx(t, { icon: a ? f : j }),
              className: "indicator",
              "aria-controls": "panel1a-content",
              id: "panel1a-header",
              children: n.jsxs("div", {
                className: "w-100",
                children: [
                  n.jsxs("div", {
                    className: "d-flex justify-content-between",
                    children: [
                      n.jsx("h5", {
                        className:
                          "milestone-title d-flex align-items-center mb-0",
                        children: e.title,
                      }),
                      e.actionIcon &&
                        n.jsxs("div", {
                          className: "d-flex justify-content-end",
                          children: [
                            n.jsx(t, { onClick: d, icon: r }),
                            n.jsx(t, {
                              className: "ml-3",
                              onClick: m,
                              icon: h,
                            }),
                          ],
                        }),
                    ],
                  }),
                  !!(e.minute || e.modulePart) &&
                    n.jsxs("div", {
                      className: "d-flex flex-row meta",
                      children: [
                        e.minute
                          ? n.jsxs("p", {
                              className: "sub-milestone-title ml-1",
                              children: ["● ", e.minute, " "],
                            })
                          : null,
                        e.modulePart
                          ? n.jsxs("p", {
                              className: "sub-milestone-title ml-1",
                              children: ["● ", e.modulePart],
                            })
                          : null,
                        e.unitPart
                          ? n.jsxs("p", {
                              className: "sub-milestone-title ml-1",
                              children: ["● ", e.unitPart],
                            })
                          : null,
                      ],
                    }),
                ],
              }),
            }),
          }),
          n.jsx("div", {
            className: "accordion-custom-details",
            children: n.jsx(w, { children: e.children }),
          }),
        ],
      }),
    });
  };
export { g as C };
