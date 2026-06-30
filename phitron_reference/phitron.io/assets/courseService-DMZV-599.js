import { M as t, b as n } from "./index-3GFABpq9.js";
const r = "https://phitron.io/api/",
  o = () => {
    const a = n.getCurrentUser() && n.getCurrentUser().token;
    t.defaults.headers.common = { Authorization: `${a}` };
  };
class l {
  constructor() {
    o();
  }
  createCourse(e) {
    return (
      o(),
      t.post(r + "course/addCourse", e, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  }
  patchCourse(e, s) {
    return t.patch(r + `course/course/${e}`, s);
  }
  getCourses(e) {
    return t.get(r + "course/course", { params: { ...e } });
  }
  getAdminCourseList(e) {
    return t.get(r + "course/admin-course-list", { params: { ...e } });
  }
  getCourseListWithChildCourse(e) {
    return t.get(r + "course/course-list-with-child", { params: { ...e } });
  }
  getCourseDetail(e) {
    return t.get(r + `course/course/${e}`);
  }
  getAdminCourseDetail(e) {
    return t.get(r + `course/admin-course-tree/${e}`);
  }
  getStudentCourseDetail(e, s) {
    return t
      .get(r + `course/student-course-tree/${e}`, { params: s })
      .then((u) => {
        var i, d, c, g;
        return (
          localStorage.setItem(
            "courseName",
            (d = (i = u.data) == null ? void 0 : i.data) == null
              ? void 0
              : d.title
          ),
          localStorage.setItem(
            "courseId",
            (g = (c = u.data) == null ? void 0 : c.data) == null
              ? void 0
              : g._id
          ),
          u
        );
      });
  }
  addMilestone(e) {
    return t.post(r + "milestone/milestone", e);
  }
  patchMilestone(e, s) {
    return t.patch(r + `milestone/milestone/${e}`, s);
  }
  addModule(e) {
    return t.post(r + "module/module", e);
  }
  patchModule(e, s) {
    return t.patch(r + `module/module/${e}`, s);
  }
  addVideo(e) {
    return t.post(r + "video/video", e);
  }
  addAssignment(e) {
    return t.post(r + "assignment/assignment", e);
  }
  addQuiz(e) {
    return t.post(r + "quiz/addQuiz", e);
  }
  getCourseSearch(e) {
    return t.get(r + "course/course-search", { params: { ...e } });
  }
  addFeedback(e) {
    return t.post(r + "feedback/addFeedback ", e, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  addStudentFeedback(e) {
    return t.post(r + "feedback/addFeedback ", e);
  }
  updateStudentFeedback(e, s) {
    return t.patch(r + "feedback/update-student-feedback/" + s, e);
  }
  getFeedback(e, s = {}) {
    return t.get(r + `feedback/getfeedbacks/${e}`, { params: { ...s } });
  }
  getFeaturedFeedbacks(e = {}) {
    return t.get(r + "feedback/featured-feedbacks", { payload: e });
  }
  getFeedbackDetail(e) {
    return t.get(r + `feedback/${e}`);
  }
  deleteFeedback(e) {
    return t.delete(r + `feedback/deletefeedback/${e}`);
  }
  updateFeedback(e, s) {
    return t.patch(r + `feedback/updatefeedback/${e}`, s, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  getUnitContent(e, s) {
    return t.get(r + `unit/get-unit-content/${e}`, { params: { ...s } });
  }
  deleteUnit(e) {
    return t.delete(r + `unit/unit/${e}`);
  }
  deleteMilestone(e, s) {
    return t.delete(r + `milestone/milestone/${e}`, s);
  }
  deleteModule(e, s) {
    return t.delete(r + `module/module/${e}`, s);
  }
  patchAssignment(e, s) {
    return t.patch(r + `assignment/assignment/${e}`, s);
  }
  patchVideo(e, s) {
    return t.patch(r + `video/video/${e}`, s);
  }
  addUnitHistory(e) {
    return t.post(r + "unit/unit-history", e);
  }
  getUnitHistory(e) {
    if (e) return t.get(r + `unit/unit-history/${e}`);
  }
  getUnitHistoryList(e) {
    return o(), t.get(r + `unit/unit-history-list/${e}`);
  }
  getUnit() {
    return t.get(r + "unit/unit");
  }
  getSingleCourseUnitList(e) {
    return t.get(r + `unit/single-course-unit-list/${e}`);
  }
  getNextUnitOfCourse(e, s = {}) {
    if (!(!e || !(n.getCurrentUser() && n.getCurrentUser().token)))
      return o(), t.get(r + `course/getNext/${e}`, { params: s });
  }
  addStudentToACourseManually(e) {
    return t.post(r + "purchaseHistory", e);
  }
  getCourseAssignment(e) {
    return t.get(r + "course/course-assignment-list", { params: { ...e } });
  }
  getModule(e) {
    return t.get(r + "module/module", { params: { ...e } });
  }
  getCourseCurriculum(e) {
    return t.get(r + "course-curriculum", { params: { ...e } });
  }
  addCourseCurriculum(e) {
    return t.post(r + "course-curriculum", e);
  }
  patchCourseCurriculum(e, s) {
    return t.patch(r + `course-curriculum/${e}`, s);
  }
  deleteCourseCurriculum(e, s) {
    return t.delete(r + `course-curriculum/${e}`, s);
  }
  getPublicCourseDetail(e) {
    return t.get(r + "course/public-course-detail", { params: { ...e } });
  }
  generateLeaderBoard(e) {
    return t.get(r + "leader-board/ranked-data", { params: { ...e } });
  }
  generateSemesterLeaderBoard(e = {}) {
    return t.post(r + "leader-board/semester-wise-rank-data", e);
  }
  getReindexcourse(e) {
    return t.get(r + `course/re-index/${e}`);
  }
  getCourseModuleList(e) {
    return t.get(r + "course/course-module-list", { params: { ...e } });
  }
  getCourseCertification(e) {
    return t.get(r + "certification", { params: { ...e } });
  }
  getDSACertification(e) {
    return t.get(r + "certification/generate-dsa-certificate", { params: e });
  }
  sendDSACertificate(e) {
    return t.post(
      r + "certification/generate-dsa-certificate",
      {},
      { params: e }
    );
  }
  getCourseGenerateCertification(e) {
    return t.get(r + "certification/get-generate-certification", {
      params: { ...e },
    });
  }
  getCourseModuleStatistics(e) {
    return t.get(r + "user/get-course-module-statistics", { params: e });
  }
  getModuleUnitList(e) {
    return t.get(r + "module/get-module-unit-list", { params: { ...e } });
  }
  getModuleAssignmentList(e) {
    return t.get(r + "module/get-single-module-assignment-list", {
      params: { ...e },
    });
  }
  getResetUnitHistory(e) {
    return t.get(r + "unit/reset-course-unit-history", { params: { ...e } });
  }
  getEnrolledStudentSheet(e, s) {
    return t.get(r + `course/get-enrolled-student-sheet/${e}`, {
      responseType: "blob",
      params: { ...s },
    });
  }
  bulkRemoveStudentFromCourse(e) {
    return t.post(r + "course/bulk-student-remove-from-course", e);
  }
  getCourseMilestoneList() {
    return t.get(r + "course/course-milestone-list");
  }
  addCourseModuleExport(e) {
    return t.post(r + "course/export-module-master-to-child", e);
  }
  addCourseUnitExport(e) {
    return t.post(r + "course/export-unit-master-to-child", e);
  }
  addCourseMilestoneExport(e) {
    return t.post(r + "course/export-milestone-master-to-child", e);
  }
  addCourseExport(e) {
    return t.post(r + "course/export-course-master-to-child", e);
  }
  addTeamAssignment(e) {
    return t.post(r + "team-assignment/add-team-assignment", e);
  }
  patchTeamAssignment(e, s) {
    return t.patch(r + `team-assignment/update-team-assignment/${e}`, s);
  }
  getCourseListDynamicPropery(e) {
    return t.get(r + "course/course-list-dynamic-property", {
      params: { ...e },
    });
  }
  addAccOrResetCourse(e, s) {
    return t.patch(r + `course/add-acc-or-rest/${e}`, s);
  }
  removeAccOrResetCourse(e, s) {
    return t.patch(r + `course/remove-acc-or-rest/${e}`, s);
  }
  getCourseUnitList(e) {
    return t.get(r + "course/course-unit-list", { params: { ...e } });
  }
  addAutoCourseCompleteHistory(e) {
    return t.post(r + "course/auto-course-complete-history", e);
  }
  getCourseRegistration(e) {
    return t.get(r + "course/get-course-registration-validity", {
      params: { ...e },
    });
  }
  getParentCourseChildCourseList(e) {
    return t.get(r + "course/get-parent-course-child-course-list", {
      params: e,
    });
  }
  getVideoToken(e) {
    return t.get(r + `v2/drm-video/video/${e}`);
  }
  userEnrollToCourse(e) {
    return t.post(r + "course/user-enroll-to-course", e);
  }
  userEnrollToCourseBulk(e) {
    return t.post(r + "course/user-enroll-to-course-bulk", e);
  }
  userEnrollRemoveCourse(e) {
    return t.post(r + "course/user-enroll-to-course-remove", e);
  }
  getXpscWeekList(e) {
    return t.get(r + `milestone/getXpscWeekList/${e}`);
  }
  getVJudgeContestList() {
    return t.get(r + "milestone/getVJudgeContestList");
  }
  updateVJudgeToken(e) {
    return t.patch(r + "vjudge/token", e);
  }
  generateVJudgeContestSubmissions(e) {
    return t.patch(r + `vjudge/generate/${e}`, {});
  }
  getVJudgeContestSubmissions(e, s) {
    return t.get(r + `vjudge/${e}`, { params: s });
  }
  vJudgeContestSubmissionsExcel(e) {
    return t.get(r + `vjudge/excel-download/${e}`, { responseType: "blob" });
  }
  getStudentCourseDetails(e) {
    return t.get(r + `course/student-course/${e}`);
  }
  getVideoStatus(e) {
    return t.get(r + `v2/drm-video/status/${e}`);
  }
}
const p = new l();
export { p as c };
