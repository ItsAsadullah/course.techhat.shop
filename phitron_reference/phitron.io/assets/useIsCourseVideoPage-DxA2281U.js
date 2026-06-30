import { e as t, r as n } from "./index-3GFABpq9.js";
function u() {
  const { pathname: e } = t();
  return n.useMemo(() => {
    const s = /\/video\//.test(e),
      o = e.includes("/conceptual-session/");
    return (
      s ||
      o ||
      /^\/bonus-course\/[^/]+(?:\/[^/]+)?$/.test(e) ||
      e.startsWith("/bootcamp-content/")
    );
  }, [e]);
}
export { u };
