import { u as l } from "./hooks-BgAlzOWb.js";
import { r as a } from "./index-3GFABpq9.js";
const i = (o = !1) => {
  const t = l((r) => {
    var e;
    return (e = r.user) == null ? void 0 : e.data;
  });
  return a.useMemo(() => {
    var r;
    return o ||
      !(
        (r = t == null ? void 0 : t.enrolledBatchesWithCourseList) != null &&
        r.length
      )
      ? !1
      : t.enrolledBatchesWithCourseList.every((e) => {
          var s;
          return (
            ((s = e == null ? void 0 : e.batch) == null ? void 0 : s.type) ===
            "bootcamp"
          );
        });
  }, [t == null ? void 0 : t.enrolledBatchesWithCourseList, o]);
};
export { i as u };
