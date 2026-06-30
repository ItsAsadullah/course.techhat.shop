import { b as u } from "./batchService-OUj-wn8o.js";
import { A as o } from "./index-3GFABpq9.js";
const i = ["featured-batch"],
  f = (e) => {
    const {
      data: t,
      error: s,
      isLoading: a,
      isFetching: c,
    } = o({
      queryKey: [...i, e],
      queryFn: () => u.getFeaturedBatch(e ? { type: e } : void 0),
      staleTime: 3e5,
      refetchOnWindowFocus: !1,
      retry: !1,
      select: ({ data: r }) => (r == null ? void 0 : r.data),
    });
    return { featuredBatch: t, error: s, isFetching: c, isLoading: a };
  };
export { f as u };
