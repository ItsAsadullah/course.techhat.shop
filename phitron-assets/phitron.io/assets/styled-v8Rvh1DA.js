import { l as v } from "./index-3GFABpq9.js";
import { r as m } from "./grey-BpIXr15l.js";
import { r as p, a as y, b as q } from "./defaultTheme-wLAKn6fj.js";
var e = {},
  t;
function _() {
  if (t) return e;
  t = 1;
  var r = m();
  Object.defineProperty(e, "__esModule", { value: !0 }), (e.default = void 0);
  var a = r(p()),
    u = q,
    l = r(y()),
    o = function (d) {
      var f = (0, u.styled)(d);
      return function (i, n) {
        return f(i, (0, a.default)({ defaultTheme: l.default }, n));
      };
    },
    s = o;
  return (e.default = s), e;
}
var c = _();
const T = v(c);
export { T as s };
