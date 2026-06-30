import { s as a } from "./styled-v8Rvh1DA.js";
import { B as i } from "./Button-Brvz4f5T.js";
import "./index-3GFABpq9.js";
import "./grey-BpIXr15l.js";
import "./defaultTheme-wLAKn6fj.js";
import "./classCallCheck-MFKM5G8b.js";
import "./capitalize-DJ5c-VNF.js";
import "./ButtonBase-B4sdbh7v.js";
import "./useForkRef-BrlJjWiH.js";
import "./useIsFocusVisible-DtmZ3vI4.js";
import "./TransitionGroupContext-CJT0Ny2r.js";
const b = a(i)((r) => ({
  background: `${
    r.previous
      ? "transparent"
      : r.gradient
      ? "var(--gradient-bg)"
      : "var(--primary)"
  }`,
  color: `${r.previous ? "var(--secondary)" : "var(--white)"}`,
  padding: `${r.previous ? "5px" : "6px"} 15px`,
  textTransform: "capitalize",
  fontSize: 16,
  borderRadius: 30,
  border: `${r.previous ? "1px solid var(--border-3)" : "none"}`,
  minWidth: 120,
  whiteSpace: "nowrap",
  fontFamily: "'Poppins', sans-serif",
  "@media (max-width:450px)": { minWidth: 110, padding: "5px 10px" },
  "&:hover": {
    background: `${
      r.previous
        ? "transparent"
        : r.gradient
        ? "var(--gradient-bg)"
        : "var(--primary)"
    }`,
  },
  "&:disabled": { background: "var(--disabled)", color: "var(--muted)" },
}));
export { b as default };
