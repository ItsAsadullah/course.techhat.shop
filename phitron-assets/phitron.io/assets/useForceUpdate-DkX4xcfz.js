import { r as t } from "./index-3GFABpq9.js";
function s(r) {
  const e = t.useRef(null);
  return (
    t.useEffect(() => {
      e.current = r;
    }),
    e.current
  );
}
function c() {
  const [, r] = t.useReducer((e) => !e, !1);
  return r;
}
export { c as a, s as u };
