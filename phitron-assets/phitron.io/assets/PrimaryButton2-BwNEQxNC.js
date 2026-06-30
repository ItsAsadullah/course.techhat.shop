import { s as a } from "./styled-v8Rvh1DA.js";
import { B as r } from "./Button-Brvz4f5T.js";
const t = a(r)((n) => ({
  background: n.outlined
    ? "transparent"
    : n.danger
    ? "var(--danger)"
    : n.warning
    ? "var(--warning)"
    : "var(--primary-gradient)",
  color: n.outlined
    ? n.danger
      ? "var(--danger)"
      : n.warning
      ? "var(--warning)"
      : "var(--primary)"
    : "#fff",
  border: "1px solid",
  borderColor: n.danger
    ? "var(--danger)"
    : n.warning
    ? "var(--warning)"
    : "var(--primary)",
  padding: n.size === "small" ? "11px 15px" : "11px 25px",
  textTransform: "capitalize",
  fontSize: n.size === "small" ? 15 : 18,
  fontWeight: 600,
  transition: "0.3s",
  fontFamily: "Hind Siliguri, sans-serif",
  borderRadius: 8,
  whiteSpace: "nowrap",
  "& span": {
    background:
      n.outlined && !n.danger && !n.warning
        ? "var(--primary-gradient)"
        : "unset",
    backgroundClip: n.outlined && !n.danger && !n.warning ? "text" : "unset",
    WebkitBackgroundClip:
      n.outlined && !n.danger && !n.warning ? "text" : "unset",
    WebkitTextFillColor:
      n.outlined && !n.danger && !n.warning ? "transparent" : "unset",
    MozTextFillColor:
      n.outlined && !n.danger && !n.warning ? "transparent" : "unset",
  },
  "&:hover": n.noHover
    ? {}
    : {
        background: n.outlined
          ? n.danger
            ? "var(--danger)"
            : n.warning
            ? "var(--warning)"
            : "var(--primary-gradient)"
          : "transparent",
        color: n.outlined
          ? "#fff"
          : n.danger
          ? "var(--danger)"
          : n.warning
          ? "var(--warning)"
          : "var(--primary)",
        borderColor: n.danger
          ? "var(--danger)"
          : n.warning
          ? "var(--warning)"
          : "var(--primary)",
        "& span": {
          background:
            n.outlined || n.danger || n.warning
              ? "unset"
              : "var(--primary-gradient)",
          backgroundClip:
            n.outlined || n.danger || n.warning ? "unset" : "text",
          WebkitBackgroundClip:
            n.outlined || n.danger || n.warning ? "unset" : "text",
          WebkitTextFillColor:
            n.outlined || n.danger || n.warning ? "unset" : "transparent",
          MozTextFillColor:
            n.outlined || n.danger || n.warning ? "unset" : "transparent",
        },
      },
  "&:disabled": { borderColor: "#d1d1d1", background: "#d1d1d1" },
}));
export { t as P };
