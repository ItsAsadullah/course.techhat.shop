import { M as t, b as o } from "./index-3GFABpq9.js";
const r = "https://phitron.io/api/",
  a = () => {
    const u = o.getCurrentUser() && o.getCurrentUser().token;
    t.defaults.headers.common = { Authorization: `${u}` };
  };
class n {
  constructor() {
    a();
  }
  createBatch(e) {
    return (
      a(),
      t.post(r + "batch", e, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  }
  getBatches(e) {
    return t.get(r + "batch", { params: { ...e } });
  }
  getBatchSearch(e) {
    return t.get(r + "batch", { params: { ...e } });
  }
  getBatchList(e) {
    return t.get(r + "batch/all/list", { params: { ...e } });
  }
  getBatchDetails(e) {
    return t.get(r + `batch/detail/${e}`);
  }
  patchBatch(e, s) {
    return t.patch(r + `batch/${e}`, s);
  }
  createSemester(e) {
    return t.post(r + "semester", e);
  }
  getSemesters(e) {
    return t.get(r + "semester", { params: { ...e } });
  }
  getSemesterList(e) {
    return t.get(r + "semester/all/list", { params: { ...e } });
  }
  getSemesterDetails(e) {
    return t.get(r + `semester/${e}`);
  }
  patchSemester(e, s) {
    return t.patch(r + `semester/${e}`, s);
  }
  createBaseCourse(e) {
    return t.post(r + "course/base-course", e);
  }
  getBaseCourses(e) {
    return t.get(r + "course/base-course", { params: { ...e } });
  }
  getBaseCourseList() {
    return t.get(r + "course/base-course-list");
  }
  getBaseCourseInfo(e) {
    return t.get(r + "course/base-course-list", { params: { ...e } });
  }
  getBaseCourseDetails(e) {
    return t.get(r + `course/base-course/${e}`);
  }
  patchBaseCourse(e, s) {
    return t.patch(r + `course/base-course/${e}`, s);
  }
  createCourse(e) {
    return (
      a(),
      t.post(r + "course/addcourse", e, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  }
  createSemesterEnroll(e) {
    return t.post(r + "semester/enroll/student", e);
  }
  createBulkSemesterEnroll(e) {
    return t.post(r + "semester/enroll/bulk-student", e);
  }
  removeSemesterEnroll(e) {
    return t.delete(r + "semester/enroll/student", { data: e });
  }
  createMarksDistribution(e) {
    return t.post(r + "mark-distribution", e);
  }
  getMarksDistributionList(e) {
    return t.get(r + "mark-distribution", { params: { ...e } });
  }
  getMarksDistributionDetails(e) {
    return t.get(r + `mark-distribution/${e}`);
  }
  patchMarksDistribution(e, s) {
    return t.patch(r + `mark-distribution/${e}`, s);
  }
  deleteMarksDistribution(e) {
    return t.delete(r + `mark-distribution/${e}`);
  }
  getGradePointList(e) {
    return t.get(r + "grade", { params: { ...e } });
  }
  createGradePoint(e) {
    return t.post(r + "grade", e);
  }
  getGradePointDetail(e) {
    return t.get(r + `grade/${e}`);
  }
  patchGradePoint(e, s) {
    return t.patch(r + `grade/${e}`, s);
  }
  deleteGradepoint(e) {
    return t.delete(r + `grade/${e}`);
  }
  getSemesterModuleList() {
    return t.get(r + "semester/module/list");
  }
  getSemesterSummary() {
    return t.get(r + "semester/summery/overview");
  }
  getBatchListDynamicPropery(e) {
    return t.get(r + "batch/batch-list-dynamic-property", { params: { ...e } });
  }
  getCertificateAvailableBatchList() {
    return t.get(r + "batch/certificate-batch-list");
  }
  createCourseOutline(e) {
    return t.post(r + "course/add-course-outline", e);
  }
  getCourseOutlineList(e) {
    return t.get(r + "course/get-course-outline-list", { params: { ...e } });
  }
  getSingleCourseOutline(e) {
    return t.get(r + `course/get-course-outline/${e}`);
  }
  updateCourseOutline(e, s) {
    return t.patch(r + `course/course-outline/${e}`, s);
  }
  deleteCourseOutline(e) {
    return t.delete(r + `course/course-outline/${e}`);
  }
  getBatchCompleteHistory(e) {
    return t.get(r + `course/course-outline/${e}`);
  }
  getFeaturedBatch(e) {
    return t.get(r + "batch/featured-batch-info", { params: e });
  }
}
const c = new n();
export { c as b };
