import { j as e, r as _, L as m } from "./index-3GFABpq9.js";
import { P as i } from "./PrimaryButton2-BwNEQxNC.js";
import { A as l } from "./AnimatedTitle-Dlszz4aG.js";
import { M as t } from "./MarqueeCarousel-BfJA_Txl.js";
import { j as n, l as p, a as h } from "./jobPlacement-DfYML6oj.js";
import { a as d, p as y } from "./XPSC_success-C9TnZYej.js";
import { p as x } from "./play-DmRMrYcX.js";
import { b } from "./getYoutubeImage-BiZM9XOy.js";
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
import "./WaitingEnroll-Dp9i8Nln.js";
import "./modal-xlRO5FO8.js";
import "./getEnrollmentContent-EKKttjBQ.js";
import "./index.es-BL_Cuqpi.js";
import "./index-D9BrGFpu.js";
import "./warning-C20GYw-A.js";
import "./react-lifecycles-compat.es-Crfa1e2_.js";
import "./react-lifecycles-compat.es-BO9d1diy.js";
const j = ({ student: s }) => {
    const { name: a, jobTitle: r, company: o, image: c } = s;
    return e.jsxs("div", {
      className:
        "d-flex home-page__success-story__carousel__card home-page__success-story__carousel__card--job-placement",
      children: [
        e.jsx("img", {
          src: c || d,
          className: "home-page__success-story__carousel__card__avatar",
          alt: a,
        }),
        e.jsxs("div", {
          children: [
            e.jsx("h5", {
              className: "home-page__success-story__carousel__card__name",
              children: a,
            }),
            e.jsx("p", {
              className:
                "mb-1 home-page__success-story__carousel__card__job-title",
              children: r,
            }),
            e.jsx("p", {
              className:
                "mb-0 home-page__success-story__carousel__card__company",
              children: o,
            }),
          ],
        }),
      ],
    });
  },
  g = n.filter(({ image: s }) => s).sort((s, a) => a.batch - s.batch),
  I = () =>
    e.jsx(t, {
      duration: 200,
      className: "home-page__success-story__carousel",
      children: g.map((s, a) => e.jsx(j, { student: s }, a)),
    }),
  N = ({ student: s }) => {
    const {
      codeforcesRank: a,
      codechefRank: r,
      batch: o,
      name: c,
      imageLink: u,
    } = s;
    return e.jsxs("div", {
      className: "d-flex home-page__success-story__carousel__card",
      children: [
        e.jsx("img", {
          src: u || d,
          className: "home-page__success-story__carousel__card__avatar",
          alt: c,
        }),
        e.jsxs("div", {
          children: [
            e.jsxs("div", {
              className: "d-flex flex-wrap gap-2 mb-2 align-items-center",
              children: [
                e.jsxs("p", {
                  className:
                    "mb-0 home-page__success-story__carousel__card__batch",
                  children: ["Batch - ", o],
                }),
                e.jsx("p", {
                  className:
                    "mb-0 home-page__success-story__carousel__card__badge",
                  children: r,
                }),
              ],
            }),
            e.jsx("h5", {
              className: "home-page__success-story__carousel__card__name",
              children: c,
            }),
            a &&
              e.jsxs("div", {
                className:
                  "d-flex home-page__success-story__carousel__card__judge",
                children: [
                  e.jsx("img", { src: p, alt: "logoCodeforces" }),
                  e.jsx("p", { className: "mb-0", children: a }),
                ],
              }),
            e.jsxs("div", {
              className:
                "d-flex home-page__success-story__carousel__card__judge mt-1",
              children: [
                e.jsx("img", { src: h, alt: "logoCodeChef" }),
                e.jsx("p", { className: "mb-0", children: r }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  v = y.filter((s) => !!s.codeforcesRank).sort((s, a) => a.batch - s.batch),
  f = () =>
    e.jsx(t, {
      duration: 200,
      direction: "reverse",
      className: "home-page__success-story__carousel",
      children: v.map((s, a) => e.jsx(N, { student: s }, a)),
    }),
  S = ({ youtubeId: s, playVideo: a, setPlayVideo: r, index: o }) =>
    e.jsx("div", {
      className: "home-page__success-story__video-marquee__card",
      children:
        a === o
          ? e.jsx("iframe", {
              width: "100%",
              height: "100%",
              src: `https://www.youtube.com/embed/${s}?autoplay=1&playsinline=1`,
              title: "YouTube video player",
              frameBorder: "0",
              allow:
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: !0,
              className: "d-block mx-auto",
            })
          : e.jsxs("div", {
              className: "position-relative",
              children: [
                e.jsx("img", {
                  src: b(s),
                  alt: s,
                  className:
                    "mx-auto d-block home-page__success-story__video-marquee__card__thumbnail",
                  loading: "lazy",
                }),
                e.jsx("div", {
                  onClick: () => r(o),
                  className: "position-absolute home-page__banner__play-icon",
                  children: e.jsx("img", {
                    src: x,
                    alt: "play-icon",
                    loading: "lazy",
                  }),
                }),
              ],
            }),
    }),
  w = [
    { youtubeId: "KEFwIw9iLeo" },
    { youtubeId: "odvYEqdSuZU" },
    { youtubeId: "dcGqA7hZp2k" },
    { youtubeId: "aNUImxq9_MQ" },
    { youtubeId: "WD1ySWKM8Xg" },
    { youtubeId: "Vt_WnXsNwOw" },
    { youtubeId: "_SLASzDRAcI" },
    { youtubeId: "FnJBzD9jYW4" },
    { youtubeId: "yx2OEnMmhZ4" },
    { youtubeId: "_4kGNO9AUvM" },
    { youtubeId: "jo29Ra0z3u0" },
    { youtubeId: "C9O7dL-U7Aw" },
    { youtubeId: "OqdiVYf5MRM" },
    { youtubeId: "D0tT-3x8AlY" },
    { youtubeId: "KEFwIw9iLeo" },
    { youtubeId: "odvYEqdSuZU" },
    { youtubeId: "dcGqA7hZp2k" },
    { youtubeId: "aNUImxq9_MQ" },
    { youtubeId: "WD1ySWKM8Xg" },
    { youtubeId: "Vt_WnXsNwOw" },
    { youtubeId: "_SLASzDRAcI" },
    { youtubeId: "FnJBzD9jYW4" },
    { youtubeId: "yx2OEnMmhZ4" },
    { youtubeId: "_4kGNO9AUvM" },
    { youtubeId: "jo29Ra0z3u0" },
    { youtubeId: "C9O7dL-U7Aw" },
    { youtubeId: "OqdiVYf5MRM" },
    { youtubeId: "D0tT-3x8AlY" },
  ],
  A = () => {
    const [s, a] = _.useState(null);
    return e.jsx(t, {
      duration: 80,
      pause: s !== null,
      className: "home-page__success-story__video-marquee",
      children: w.map((r, o) =>
        e.jsx(
          S,
          { playVideo: s, setPlayVideo: a, youtubeId: r.youtubeId, index: o },
          o
        )
      ),
    });
  },
  ee = () =>
    e.jsxs("div", {
      className: "home-page__success-story",
      children: [
        e.jsxs(l, {
          className: "text-white",
          children: [
            e.jsx("span", { children: "সফলতার" }),
            " ",
            e.jsx("span", { children: "গল্প" }),
            " ",
            e.jsx("span", { children: "শোনো" }),
          ],
        }),
        e.jsx(A, {}),
        e.jsxs(l, {
          className: "text-white pt-3 pt-md-5",
          children: [
            e.jsx("span", { children: "সাফল্যের" }),
            " ",
            e.jsx("span", { children: "দৌড়ে" }),
            " ",
            e.jsx("span", { children: "আমাদের" }),
            " ",
            e.jsx("span", { children: "স্টুডেন্টরা..." }),
          ],
        }),
        e.jsx(f, {}),
        e.jsx(I, {}),
        e.jsx("div", {
          className: "text-center mt-3",
          children: e.jsx(m, {
            to: "/success-story",
            children: e.jsx(i, { children: "আরো মতামত দেখো" }),
          }),
        }),
      ],
    });
export { ee as default };
