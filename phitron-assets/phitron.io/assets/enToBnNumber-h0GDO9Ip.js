import { e as t } from "./englishToBanglaNumber-DBWF_PNB.js";
const g = (e) => {
  var r;
  return (r = e == null ? void 0 : e.toString()) == null
    ? void 0
    : r.replace(/\d/g, (o) => t[+o]);
};
export { g as e };
