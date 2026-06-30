import { A as u, b as r } from "./index-3GFABpq9.js";
const l = (e) => {
  var s, n;
  const t = ["my-additional-data", e],
    {
      data: i,
      status: a,
      isFetching: o,
    } = u({
      queryKey: t,
      queryFn: () => r.getMyAdditionalData(e),
      select: ({ data: d }) => d,
      staleTime: 1e3 * 60 * 60,
      refetchOnWindowFocus: !1,
      enabled: !!(
        (n = (s = r.getCurrentUser()) == null ? void 0 : s.user) != null &&
        n.role
      ),
    });
  return {
    data: i || {},
    status: a,
    isFetching: o || a === "loading",
    queryKey: t,
  };
};
export { l as u };
