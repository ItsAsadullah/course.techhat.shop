import { A as N, y as k, r as x, j as s } from "./index-3GFABpq9.js";
import { L as $ } from "./LongCurveIcon-Ck_Sw-Cp.js";
import { u as _, A as y } from "./AnimatedTitle-Dlszz4aG.js";
import { g as L } from "./getImage-BV97P_4L.js";
import { g as O, $ as h, S, a as D, b as P } from "./swiper.min-BZvyi-7S.js";
function V(a, c, o, t) {
  const r = O();
  return (
    a.params.createElements &&
      Object.keys(t).forEach((l) => {
        if (!o[l] && o.auto === !0) {
          let d = a.$el.children(`.${t[l]}`)[0];
          d ||
            ((d = r.createElement("div")),
            (d.className = t[l]),
            a.$el.append(d)),
            (o[l] = d),
            (c[l] = d);
        }
      }),
    o
  );
}
function B({ swiper: a, extendParams: c, on: o, emit: t }) {
  c({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: !1,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled",
    },
  }),
    (a.navigation = {
      nextEl: null,
      $nextEl: null,
      prevEl: null,
      $prevEl: null,
    });
  function r(n) {
    let e;
    return (
      n &&
        ((e = h(n)),
        a.params.uniqueNavElements &&
          typeof n == "string" &&
          e.length > 1 &&
          a.$el.find(n).length === 1 &&
          (e = a.$el.find(n))),
      e
    );
  }
  function l(n, e) {
    const i = a.params.navigation;
    n &&
      n.length > 0 &&
      (n[e ? "addClass" : "removeClass"](i.disabledClass),
      n[0] && n[0].tagName === "BUTTON" && (n[0].disabled = e),
      a.params.watchOverflow &&
        a.enabled &&
        n[a.isLocked ? "addClass" : "removeClass"](i.lockClass));
  }
  function d() {
    if (a.params.loop) return;
    const { $nextEl: n, $prevEl: e } = a.navigation;
    l(e, a.isBeginning && !a.params.rewind), l(n, a.isEnd && !a.params.rewind);
  }
  function C(n) {
    n.preventDefault(),
      !(a.isBeginning && !a.params.loop && !a.params.rewind) &&
        (a.slidePrev(), t("navigationPrev"));
  }
  function E(n) {
    n.preventDefault(),
      !(a.isEnd && !a.params.loop && !a.params.rewind) &&
        (a.slideNext(), t("navigationNext"));
  }
  function u() {
    const n = a.params.navigation;
    if (
      ((a.params.navigation = V(
        a,
        a.originalParams.navigation,
        a.params.navigation,
        { nextEl: "swiper-button-next", prevEl: "swiper-button-prev" }
      )),
      !(n.nextEl || n.prevEl))
    )
      return;
    const e = r(n.nextEl),
      i = r(n.prevEl);
    e && e.length > 0 && e.on("click", E),
      i && i.length > 0 && i.on("click", C),
      Object.assign(a.navigation, {
        $nextEl: e,
        nextEl: e && e[0],
        $prevEl: i,
        prevEl: i && i[0],
      }),
      a.enabled || (e && e.addClass(n.lockClass), i && i.addClass(n.lockClass));
  }
  function f() {
    const { $nextEl: n, $prevEl: e } = a.navigation;
    n &&
      n.length &&
      (n.off("click", E), n.removeClass(a.params.navigation.disabledClass)),
      e &&
        e.length &&
        (e.off("click", C), e.removeClass(a.params.navigation.disabledClass));
  }
  o("init", () => {
    a.params.navigation.enabled === !1 ? b() : (u(), d());
  }),
    o("toEdge fromEdge lock unlock", () => {
      d();
    }),
    o("destroy", () => {
      f();
    }),
    o("enable disable", () => {
      const { $nextEl: n, $prevEl: e } = a.navigation;
      n &&
        n[a.enabled ? "removeClass" : "addClass"](
          a.params.navigation.lockClass
        ),
        e &&
          e[a.enabled ? "removeClass" : "addClass"](
            a.params.navigation.lockClass
          );
    }),
    o("click", (n, e) => {
      const { $nextEl: i, $prevEl: m } = a.navigation,
        g = e.target;
      if (a.params.navigation.hideOnClick && !h(g).is(m) && !h(g).is(i)) {
        if (
          a.pagination &&
          a.params.pagination &&
          a.params.pagination.clickable &&
          (a.pagination.el === g || a.pagination.el.contains(g))
        )
          return;
        let v;
        i
          ? (v = i.hasClass(a.params.navigation.hiddenClass))
          : m && (v = m.hasClass(a.params.navigation.hiddenClass)),
          t(v === !0 ? "navigationShow" : "navigationHide"),
          i && i.toggleClass(a.params.navigation.hiddenClass),
          m && m.toggleClass(a.params.navigation.hiddenClass);
      }
    });
  const j = () => {
      a.$el.removeClass(a.params.navigation.navigationDisabledClass), u(), d();
    },
    b = () => {
      a.$el.addClass(a.params.navigation.navigationDisabledClass), f();
    };
  Object.assign(a.navigation, {
    enable: j,
    disable: b,
    update: d,
    init: u,
    destroy: f,
  });
}
const A = ["author-list"],
  I = 1e3 * 60 * 5,
  Q = () => k.getAuthorInfo(),
  R = () => {
    const {
      data: a = [],
      error: c,
      isLoading: o,
    } = N({
      queryKey: A,
      queryFn: Q,
      staleTime: I,
      refetchOnWindowFocus: !1,
      select: ({ data: t }) => {
        var r;
        return (r = t == null ? void 0 : t.data) == null
          ? void 0
          : r.filter((l) => l.show === !0);
      },
    });
    return { authorList: a, error: c, isLoading: o };
  };
P.use([B]);
const p = 190,
  q = {
    1200: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    480: { slidesPerView: 1, spaceBetween: 24 },
    0: { slidesPerView: 1, spaceBetween: 18 },
  },
  F = ({ author: a }) => {
    const [c, o] = x.useState(!1),
      { name: t, image: r, quote: l } = a;
    return s.jsxs("div", {
      className: "home-page__mentors__item",
      children: [
        s.jsx("img", {
          alt: t,
          className: "img-fluid",
          src: L(r),
          loading: "lazy",
        }),
        s.jsx("h3", { className: "my-3", children: t }),
        s.jsx("p", {
          className: "mb-0",
          children:
            l.length > p
              ? s.jsxs(s.Fragment, {
                  children: [
                    c ? l : l.slice(0, p) + "...",
                    s.jsx("span", {
                      className: "ml-1",
                      onClick: () => o(!c),
                      children: c ? "বন্ধ করুন" : "আরো পড়ুন",
                    }),
                  ],
                })
              : l,
        }),
      ],
    });
  },
  U = () => {
    const { authorList: a } = R(),
      { ref: c, isVisible: o } = _(),
      t = x.useRef(null),
      r = x.useRef(null);
    return s.jsx("div", {
      className: "home-page__mentors",
      children: s.jsxs("div", {
        className: "container",
        children: [
          s.jsxs(y, {
            className: "home-page__title--mentors",
            children: [
              s.jsx("span", { children: "আমাদের" }),
              " ",
              s.jsx("span", { children: "এক্সপার্ট" }),
              " ",
              s.jsxs("span", {
                className:
                  "home-page__title__highlight d-flex align-items-center flex-column",
                children: ["Mentors ", s.jsx($, { width: 240 })],
              }),
            ],
          }),
          s.jsx(S, {
            slidesPerView: 3,
            spaceBetween: 24,
            breakpoints: q,
            className: "text-center",
            navigation: { nextEl: t.current, prevEl: r.current },
            ref: c,
            children: a.map((l) =>
              s.jsx(
                D,
                {
                  className: "animated-col-slides",
                  "data-state": o ? "visible" : "hidden",
                  children: s.jsx(F, { author: l }),
                },
                l._id
              )
            ),
          }),
          s.jsxs("div", {
            className: `position-relative${a.length <= 3 ? " d-xl-none" : ""}`,
            children: [
              s.jsx("div", { ref: r, className: "swiper-button-prev" }),
              s.jsx("div", { ref: t, className: "swiper-button-next" }),
              s.jsx("hr", {}),
            ],
          }),
        ],
      }),
    });
  };
export { U as default };
