import { j as e } from "./index-3GFABpq9.js";
const a = "/assets/app-Clv0hnxs.webp",
  s = "/assets/play-store-DRpGkDXV.png",
  t = () =>
    e.jsx("div", {
      className:
        "container home-page__are-you-ready home-page__are-you-ready--download-app",
      children: e.jsxs("div", {
        className: "home-page__are-you-ready__inner text-center text-md-left",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h2", {
                className:
                  "home-page__title justify-content-md-start text-white mb-3",
                children: "ডাউনলোড করুন ফাইট্রন অ্যাপ!",
              }),
              e.jsx("p", {
                className: "home-page__text text-white",
                children:
                  "লাইভ ক্লাসের বেস্ট এক্সপেরিয়েন্স পেতে, এখনই ডাউনলোড করুন আমাদের অ্যাপ!",
              }),
              e.jsx("a", {
                href: "https://play.google.com/store/apps/details?id=learn.programming.courses.phitron",
                target: "_blank",
                rel: "noopener noreferrer",
                children: e.jsx("img", {
                  className: "img-fluid",
                  src: s,
                  alt: "play-store",
                  loading: "lazy",
                }),
              }),
            ],
          }),
          e.jsx("div", {
            className:
              "home-page__are-you-ready__inner__img-container mx-auto mx-md-0 text-center",
            children: e.jsx("img", {
              className: "home-page__are-you-ready__inner__img",
              src: a,
              alt: "app",
              loading: "lazy",
            }),
          }),
        ],
      }),
    });
export { t as default };
