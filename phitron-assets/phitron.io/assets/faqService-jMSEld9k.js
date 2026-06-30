import { b as n, M as e } from "./index-3GFABpq9.js";
const a = "https://phitron.io/api/";
class o {
  constructor() {
    const t = n.getCurrentUser() && n.getCurrentUser().token;
    e.defaults.headers.common = { Authorization: `${t}` };
  }
  getFaq() {
    return e.get(a + "faq");
  }
  getAdminFaq() {
    return e.get(a + "faq/all");
  }
  getInternalFaq() {
    return e.get(a + "faq/internal");
  }
  getFaqById(t) {
    return e.get(a + "faq/" + t);
  }
  addFaq(t) {
    return e.post(a + "faq/", t);
  }
  addVideoFaq(t) {
    return e.post(a + "faq/", t, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  updateFaq(t, r) {
    return e.patch(a + "faq/" + t, r);
  }
  updateVideoFaq(t, r) {
    return e.patch(a + "faq/" + t, r, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  deleteFaq(t) {
    return e.delete(a + `faq/${t}`);
  }
}
const u = new o();
export { u as f };
