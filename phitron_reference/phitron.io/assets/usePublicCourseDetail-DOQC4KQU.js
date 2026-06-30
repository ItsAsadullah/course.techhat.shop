import { c as a } from "./courseService-DMZV-599.js";
import { A as i } from "./index-3GFABpq9.js";
const n = (r, s = !0) => {
  const {
    data: t = {},
    error: u,
    isLoading: o,
  } = i({
    queryKey: ["course", "public-course-detail", r],
    queryFn: () => {
      const e = {};
      return r && (e.batch = r), a.getPublicCourseDetail(e);
    },
    staleTime: 3e5,
    refetchOnWindowFocus: !1,
    retry: !1,
    enabled: s,
    select: ({ data: e }) => e.data,
  });
  return { courseDetail: t, error: u, isLoading: o };
};
export { n as u };
