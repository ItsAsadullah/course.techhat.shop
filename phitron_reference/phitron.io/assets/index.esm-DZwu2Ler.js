import {
  a as q,
  b as F,
  c as P,
  d as T,
  _ as Q,
  e as ee,
  f as H,
} from "./tslib.es6-CVDtlBZX.js";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var $ = function (t) {
    for (var e = [], r = 0, n = 0; n < t.length; n++) {
      var i = t.charCodeAt(n);
      i < 128
        ? (e[r++] = i)
        : i < 2048
        ? ((e[r++] = (i >> 6) | 192), (e[r++] = (i & 63) | 128))
        : (i & 64512) === 55296 &&
          n + 1 < t.length &&
          (t.charCodeAt(n + 1) & 64512) === 56320
        ? ((i = 65536 + ((i & 1023) << 10) + (t.charCodeAt(++n) & 1023)),
          (e[r++] = (i >> 18) | 240),
          (e[r++] = ((i >> 12) & 63) | 128),
          (e[r++] = ((i >> 6) & 63) | 128),
          (e[r++] = (i & 63) | 128))
        : ((e[r++] = (i >> 12) | 224),
          (e[r++] = ((i >> 6) & 63) | 128),
          (e[r++] = (i & 63) | 128));
    }
    return e;
  },
  te = function (t) {
    for (var e = [], r = 0, n = 0; r < t.length; ) {
      var i = t[r++];
      if (i < 128) e[n++] = String.fromCharCode(i);
      else if (i > 191 && i < 224) {
        var a = t[r++];
        e[n++] = String.fromCharCode(((i & 31) << 6) | (a & 63));
      } else if (i > 239 && i < 365) {
        var a = t[r++],
          s = t[r++],
          f = t[r++],
          h =
            (((i & 7) << 18) | ((a & 63) << 12) | ((s & 63) << 6) | (f & 63)) -
            65536;
        (e[n++] = String.fromCharCode(55296 + (h >> 10))),
          (e[n++] = String.fromCharCode(56320 + (h & 1023)));
      } else {
        var a = t[r++],
          s = t[r++];
        e[n++] = String.fromCharCode(
          ((i & 15) << 12) | ((a & 63) << 6) | (s & 63)
        );
      }
    }
    return e.join("");
  },
  re = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    HAS_NATIVE_SUPPORT: typeof atob == "function",
    encodeByteArray: function (t, e) {
      if (!Array.isArray(t))
        throw Error("encodeByteArray takes an array as a parameter");
      this.init_();
      for (
        var r = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
          n = [],
          i = 0;
        i < t.length;
        i += 3
      ) {
        var a = t[i],
          s = i + 1 < t.length,
          f = s ? t[i + 1] : 0,
          h = i + 2 < t.length,
          c = h ? t[i + 2] : 0,
          m = a >> 2,
          p = ((a & 3) << 4) | (f >> 4),
          u = ((f & 15) << 2) | (c >> 6),
          o = c & 63;
        h || ((o = 64), s || (u = 64)), n.push(r[m], r[p], r[u], r[o]);
      }
      return n.join("");
    },
    encodeString: function (t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? btoa(t)
        : this.encodeByteArray($(t), e);
    },
    decodeString: function (t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? atob(t)
        : te(this.decodeStringToByteArray(t, e));
    },
    decodeStringToByteArray: function (t, e) {
      this.init_();
      for (
        var r = e ? this.charToByteMapWebSafe_ : this.charToByteMap_,
          n = [],
          i = 0;
        i < t.length;

      ) {
        var a = r[t.charAt(i++)],
          s = i < t.length,
          f = s ? r[t.charAt(i)] : 0;
        ++i;
        var h = i < t.length,
          c = h ? r[t.charAt(i)] : 64;
        ++i;
        var m = i < t.length,
          p = m ? r[t.charAt(i)] : 64;
        if ((++i, a == null || f == null || c == null || p == null))
          throw Error();
        var u = (a << 2) | (f >> 4);
        if ((n.push(u), c !== 64)) {
          var o = ((f << 4) & 240) | (c >> 2);
          if ((n.push(o), p !== 64)) {
            var g = ((c << 6) & 192) | p;
            n.push(g);
          }
        }
      }
      return n;
    },
    init_: function () {
      if (!this.byteToCharMap_) {
        (this.byteToCharMap_ = {}),
          (this.charToByteMap_ = {}),
          (this.byteToCharMapWebSafe_ = {}),
          (this.charToByteMapWebSafe_ = {});
        for (var t = 0; t < this.ENCODED_VALS.length; t++)
          (this.byteToCharMap_[t] = this.ENCODED_VALS.charAt(t)),
            (this.charToByteMap_[this.byteToCharMap_[t]] = t),
            (this.byteToCharMapWebSafe_[t] =
              this.ENCODED_VALS_WEBSAFE.charAt(t)),
            (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]] = t),
            t >= this.ENCODED_VALS_BASE.length &&
              ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)] = t),
              (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)] = t));
      }
    },
  },
  ne = function (t) {
    var e = $(t);
    return re.encodeByteArray(e, !0);
  },
  k = function (t) {
    return ne(t).replace(/\./g, "");
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ie(t) {
  return w(void 0, t);
}
function w(t, e) {
  if (!(e instanceof Object)) return e;
  switch (e.constructor) {
    case Date:
      var r = e;
      return new Date(r.getTime());
    case Object:
      t === void 0 && (t = {});
      break;
    case Array:
      t = [];
      break;
    default:
      return e;
  }
  for (var n in e) !e.hasOwnProperty(n) || !ae(n) || (t[n] = w(t[n], e[n]));
  return t;
}
function ae(t) {
  return t !== "__proto__";
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var oe = (function () {
  function t() {
    var e = this;
    (this.reject = function () {}),
      (this.resolve = function () {}),
      (this.promise = new Promise(function (r, n) {
        (e.resolve = r), (e.reject = n);
      }));
  }
  return (
    (t.prototype.wrapCallback = function (e) {
      var r = this;
      return function (n, i) {
        n ? r.reject(n) : r.resolve(i),
          typeof e == "function" &&
            (r.promise.catch(function () {}), e.length === 1 ? e(n) : e(n, i));
      };
    }),
    t
  );
})();
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Je(t, e) {
  if (t.uid)
    throw new Error(
      'The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.'
    );
  var r = { alg: "none", type: "JWT" },
    n = e || "demo-project",
    i = t.iat || 0,
    a = t.sub || t.user_id;
  if (!a)
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  var s = F(
      {
        iss: "https://securetoken.google.com/" + n,
        aud: n,
        iat: i,
        exp: i + 3600,
        auth_time: i,
        sub: a,
        user_id: a,
        firebase: { sign_in_provider: "custom", identities: {} },
      },
      t
    ),
    f = "";
  return [k(JSON.stringify(r)), k(JSON.stringify(s)), f].join(".");
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function L() {
  return typeof navigator < "u" && typeof navigator.userAgent == "string"
    ? navigator.userAgent
    : "";
}
function Ke() {
  return (
    typeof window < "u" &&
    !!(window.cordova || window.phonegap || window.PhoneGap) &&
    /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(L())
  );
}
function G() {
  try {
    return (
      Object.prototype.toString.call(global.process) === "[object process]"
    );
  } catch {
    return !1;
  }
}
function se() {
  return typeof self == "object" && self.self === self;
}
function Xe() {
  var t =
    typeof chrome == "object"
      ? chrome.runtime
      : typeof browser == "object"
      ? browser.runtime
      : void 0;
  return typeof t == "object" && t.id !== void 0;
}
function Ze() {
  return typeof navigator == "object" && navigator.product === "ReactNative";
}
function qe() {
  return L().indexOf("Electron/") >= 0;
}
function Qe() {
  var t = L();
  return t.indexOf("MSIE ") >= 0 || t.indexOf("Trident/") >= 0;
}
function et() {
  return L().indexOf("MSAppHost/") >= 0;
}
function tt() {
  return (
    !G() &&
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome")
  );
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var ue = "FirebaseError",
  fe = (function (t) {
    q(e, t);
    function e(r, n, i) {
      var a = t.call(this, n) || this;
      return (
        (a.code = r),
        (a.customData = i),
        (a.name = ue),
        Object.setPrototypeOf(a, e.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(a, x.prototype.create),
        a
      );
    }
    return e;
  })(Error),
  x = (function () {
    function t(e, r, n) {
      (this.service = e), (this.serviceName = r), (this.errors = n);
    }
    return (
      (t.prototype.create = function (e) {
        for (var r = [], n = 1; n < arguments.length; n++)
          r[n - 1] = arguments[n];
        var i = r[0] || {},
          a = this.service + "/" + e,
          s = this.errors[e],
          f = s ? le(s, i) : "Error",
          h = this.serviceName + ": " + f + " (" + a + ").",
          c = new fe(a, h, i);
        return c;
      }),
      t
    );
  })();
function le(t, e) {
  return t.replace(ce, function (r, n) {
    var i = e[n];
    return i != null ? String(i) : "<" + n + "?>";
  });
}
var ce = /\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function W(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
function he(t, e) {
  var r = new pe(t, e);
  return r.subscribe.bind(r);
}
var pe = (function () {
  function t(e, r) {
    var n = this;
    (this.observers = []),
      (this.unsubscribes = []),
      (this.observerCount = 0),
      (this.task = Promise.resolve()),
      (this.finalized = !1),
      (this.onNoObservers = r),
      this.task
        .then(function () {
          e(n);
        })
        .catch(function (i) {
          n.error(i);
        });
  }
  return (
    (t.prototype.next = function (e) {
      this.forEachObserver(function (r) {
        r.next(e);
      });
    }),
    (t.prototype.error = function (e) {
      this.forEachObserver(function (r) {
        r.error(e);
      }),
        this.close(e);
    }),
    (t.prototype.complete = function () {
      this.forEachObserver(function (e) {
        e.complete();
      }),
        this.close();
    }),
    (t.prototype.subscribe = function (e, r, n) {
      var i = this,
        a;
      if (e === void 0 && r === void 0 && n === void 0)
        throw new Error("Missing Observer.");
      de(e, ["next", "error", "complete"])
        ? (a = e)
        : (a = { next: e, error: r, complete: n }),
        a.next === void 0 && (a.next = M),
        a.error === void 0 && (a.error = M),
        a.complete === void 0 && (a.complete = M);
      var s = this.unsubscribeOne.bind(this, this.observers.length);
      return (
        this.finalized &&
          this.task.then(function () {
            try {
              i.finalError ? a.error(i.finalError) : a.complete();
            } catch {}
          }),
        this.observers.push(a),
        s
      );
    }),
    (t.prototype.unsubscribeOne = function (e) {
      this.observers === void 0 ||
        this.observers[e] === void 0 ||
        (delete this.observers[e],
        (this.observerCount -= 1),
        this.observerCount === 0 &&
          this.onNoObservers !== void 0 &&
          this.onNoObservers(this));
    }),
    (t.prototype.forEachObserver = function (e) {
      if (!this.finalized)
        for (var r = 0; r < this.observers.length; r++) this.sendOne(r, e);
    }),
    (t.prototype.sendOne = function (e, r) {
      var n = this;
      this.task.then(function () {
        if (n.observers !== void 0 && n.observers[e] !== void 0)
          try {
            r(n.observers[e]);
          } catch (i) {
            typeof console < "u" && console.error && console.error(i);
          }
      });
    }),
    (t.prototype.close = function (e) {
      var r = this;
      this.finalized ||
        ((this.finalized = !0),
        e !== void 0 && (this.finalError = e),
        this.task.then(function () {
          (r.observers = void 0), (r.onNoObservers = void 0);
        }));
    }),
    t
  );
})();
function de(t, e) {
  if (typeof t != "object" || t === null) return !1;
  for (var r = 0, n = e; r < n.length; r++) {
    var i = n[r];
    if (i in t && typeof t[i] == "function") return !0;
  }
  return !1;
}
function M() {}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function rt(t) {
  return t && t._delegate ? t._delegate : t;
}
var z = (function () {
  function t(e, r, n) {
    (this.name = e),
      (this.instanceFactory = r),
      (this.type = n),
      (this.multipleInstances = !1),
      (this.serviceProps = {}),
      (this.instantiationMode = "LAZY"),
      (this.onInstanceCreated = null);
  }
  return (
    (t.prototype.setInstantiationMode = function (e) {
      return (this.instantiationMode = e), this;
    }),
    (t.prototype.setMultipleInstances = function (e) {
      return (this.multipleInstances = e), this;
    }),
    (t.prototype.setServiceProps = function (e) {
      return (this.serviceProps = e), this;
    }),
    (t.prototype.setInstanceCreatedCallback = function (e) {
      return (this.onInstanceCreated = e), this;
    }),
    t
  );
})();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var C = "[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var ve = (function () {
  function t(e, r) {
    (this.name = e),
      (this.container = r),
      (this.component = null),
      (this.instances = new Map()),
      (this.instancesDeferred = new Map()),
      (this.instancesOptions = new Map()),
      (this.onInitCallbacks = new Map());
  }
  return (
    (t.prototype.get = function (e) {
      var r = this.normalizeInstanceIdentifier(e);
      if (!this.instancesDeferred.has(r)) {
        var n = new oe();
        if (
          (this.instancesDeferred.set(r, n),
          this.isInitialized(r) || this.shouldAutoInitialize())
        )
          try {
            var i = this.getOrInitializeService({ instanceIdentifier: r });
            i && n.resolve(i);
          } catch {}
      }
      return this.instancesDeferred.get(r).promise;
    }),
    (t.prototype.getImmediate = function (e) {
      var r,
        n = this.normalizeInstanceIdentifier(e == null ? void 0 : e.identifier),
        i =
          (r = e == null ? void 0 : e.optional) !== null && r !== void 0
            ? r
            : !1;
      if (this.isInitialized(n) || this.shouldAutoInitialize())
        try {
          return this.getOrInitializeService({ instanceIdentifier: n });
        } catch (a) {
          if (i) return null;
          throw a;
        }
      else {
        if (i) return null;
        throw Error("Service " + this.name + " is not available");
      }
    }),
    (t.prototype.getComponent = function () {
      return this.component;
    }),
    (t.prototype.setComponent = function (e) {
      var r, n;
      if (e.name !== this.name)
        throw Error(
          "Mismatching Component " + e.name + " for Provider " + this.name + "."
        );
      if (this.component)
        throw Error(
          "Component for " + this.name + " has already been provided"
        );
      if (((this.component = e), !!this.shouldAutoInitialize())) {
        if (ge(e))
          try {
            this.getOrInitializeService({ instanceIdentifier: C });
          } catch {}
        try {
          for (
            var i = P(this.instancesDeferred.entries()), a = i.next();
            !a.done;
            a = i.next()
          ) {
            var s = T(a.value, 2),
              f = s[0],
              h = s[1],
              c = this.normalizeInstanceIdentifier(f);
            try {
              var m = this.getOrInitializeService({ instanceIdentifier: c });
              h.resolve(m);
            } catch {}
          }
        } catch (p) {
          r = { error: p };
        } finally {
          try {
            a && !a.done && (n = i.return) && n.call(i);
          } finally {
            if (r) throw r.error;
          }
        }
      }
    }),
    (t.prototype.clearInstance = function (e) {
      e === void 0 && (e = C),
        this.instancesDeferred.delete(e),
        this.instancesOptions.delete(e),
        this.instances.delete(e);
    }),
    (t.prototype.delete = function () {
      return Q(this, void 0, void 0, function () {
        var e;
        return ee(this, function (r) {
          switch (r.label) {
            case 0:
              return (
                (e = Array.from(this.instances.values())),
                [
                  4,
                  Promise.all(
                    H(
                      H(
                        [],
                        T(
                          e
                            .filter(function (n) {
                              return "INTERNAL" in n;
                            })
                            .map(function (n) {
                              return n.INTERNAL.delete();
                            })
                        )
                      ),
                      T(
                        e
                          .filter(function (n) {
                            return "_delete" in n;
                          })
                          .map(function (n) {
                            return n._delete();
                          })
                      )
                    )
                  ),
                ]
              );
            case 1:
              return r.sent(), [2];
          }
        });
      });
    }),
    (t.prototype.isComponentSet = function () {
      return this.component != null;
    }),
    (t.prototype.isInitialized = function (e) {
      return e === void 0 && (e = C), this.instances.has(e);
    }),
    (t.prototype.getOptions = function (e) {
      return e === void 0 && (e = C), this.instancesOptions.get(e) || {};
    }),
    (t.prototype.initialize = function (e) {
      var r, n;
      e === void 0 && (e = {});
      var i = e.options,
        a = i === void 0 ? {} : i,
        s = this.normalizeInstanceIdentifier(e.instanceIdentifier);
      if (this.isInitialized(s))
        throw Error(this.name + "(" + s + ") has already been initialized");
      if (!this.isComponentSet())
        throw Error("Component " + this.name + " has not been registered yet");
      var f = this.getOrInitializeService({
        instanceIdentifier: s,
        options: a,
      });
      try {
        for (
          var h = P(this.instancesDeferred.entries()), c = h.next();
          !c.done;
          c = h.next()
        ) {
          var m = T(c.value, 2),
            p = m[0],
            u = m[1],
            o = this.normalizeInstanceIdentifier(p);
          s === o && u.resolve(f);
        }
      } catch (g) {
        r = { error: g };
      } finally {
        try {
          c && !c.done && (n = h.return) && n.call(h);
        } finally {
          if (r) throw r.error;
        }
      }
      return f;
    }),
    (t.prototype.onInit = function (e, r) {
      var n,
        i = this.normalizeInstanceIdentifier(r),
        a =
          (n = this.onInitCallbacks.get(i)) !== null && n !== void 0
            ? n
            : new Set();
      a.add(e), this.onInitCallbacks.set(i, a);
      var s = this.instances.get(i);
      return (
        s && e(s, i),
        function () {
          a.delete(e);
        }
      );
    }),
    (t.prototype.invokeOnInitCallbacks = function (e, r) {
      var n,
        i,
        a = this.onInitCallbacks.get(r);
      if (a)
        try {
          for (var s = P(a), f = s.next(); !f.done; f = s.next()) {
            var h = f.value;
            try {
              h(e, r);
            } catch {}
          }
        } catch (c) {
          n = { error: c };
        } finally {
          try {
            f && !f.done && (i = s.return) && i.call(s);
          } finally {
            if (n) throw n.error;
          }
        }
    }),
    (t.prototype.getOrInitializeService = function (e) {
      var r = e.instanceIdentifier,
        n = e.options,
        i = n === void 0 ? {} : n,
        a = this.instances.get(r);
      if (
        !a &&
        this.component &&
        ((a = this.component.instanceFactory(this.container, {
          instanceIdentifier: me(r),
          options: i,
        })),
        this.instances.set(r, a),
        this.instancesOptions.set(r, i),
        this.invokeOnInitCallbacks(a, r),
        this.component.onInstanceCreated)
      )
        try {
          this.component.onInstanceCreated(this.container, r, a);
        } catch {}
      return a || null;
    }),
    (t.prototype.normalizeInstanceIdentifier = function (e) {
      return (
        e === void 0 && (e = C),
        this.component ? (this.component.multipleInstances ? e : C) : e
      );
    }),
    (t.prototype.shouldAutoInitialize = function () {
      return (
        !!this.component && this.component.instantiationMode !== "EXPLICIT"
      );
    }),
    t
  );
})();
function me(t) {
  return t === C ? void 0 : t;
}
function ge(t) {
  return t.instantiationMode === "EAGER";
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var ye = (function () {
  function t(e) {
    (this.name = e), (this.providers = new Map());
  }
  return (
    (t.prototype.addComponent = function (e) {
      var r = this.getProvider(e.name);
      if (r.isComponentSet())
        throw new Error(
          "Component " +
            e.name +
            " has already been registered with " +
            this.name
        );
      r.setComponent(e);
    }),
    (t.prototype.addOrOverwriteComponent = function (e) {
      var r = this.getProvider(e.name);
      r.isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
    }),
    (t.prototype.getProvider = function (e) {
      if (this.providers.has(e)) return this.providers.get(e);
      var r = new ve(e, this);
      return this.providers.set(e, r), r;
    }),
    (t.prototype.getProviders = function () {
      return Array.from(this.providers.values());
    }),
    t
  );
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */ function E() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++)
    t += arguments[e].length;
  for (var n = Array(t), i = 0, e = 0; e < r; e++)
    for (var a = arguments[e], s = 0, f = a.length; s < f; s++, i++)
      n[i] = a[s];
  return n;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var S,
  B = [],
  l;
(function (t) {
  (t[(t.DEBUG = 0)] = "DEBUG"),
    (t[(t.VERBOSE = 1)] = "VERBOSE"),
    (t[(t.INFO = 2)] = "INFO"),
    (t[(t.WARN = 3)] = "WARN"),
    (t[(t.ERROR = 4)] = "ERROR"),
    (t[(t.SILENT = 5)] = "SILENT");
})(l || (l = {}));
var Y = {
    debug: l.DEBUG,
    verbose: l.VERBOSE,
    info: l.INFO,
    warn: l.WARN,
    error: l.ERROR,
    silent: l.SILENT,
  },
  be = l.INFO,
  Ee =
    ((S = {}),
    (S[l.DEBUG] = "log"),
    (S[l.VERBOSE] = "log"),
    (S[l.INFO] = "info"),
    (S[l.WARN] = "warn"),
    (S[l.ERROR] = "error"),
    S),
  _e = function (t, e) {
    for (var r = [], n = 2; n < arguments.length; n++) r[n - 2] = arguments[n];
    if (!(e < t.logLevel)) {
      var i = new Date().toISOString(),
        a = Ee[e];
      if (a) console[a].apply(console, E(["[" + i + "]  " + t.name + ":"], r));
      else
        throw new Error(
          "Attempted to log a message with an invalid logType (value: " +
            e +
            ")"
        );
    }
  },
  Ie = (function () {
    function t(e) {
      (this.name = e),
        (this._logLevel = be),
        (this._logHandler = _e),
        (this._userLogHandler = null),
        B.push(this);
    }
    return (
      Object.defineProperty(t.prototype, "logLevel", {
        get: function () {
          return this._logLevel;
        },
        set: function (e) {
          if (!(e in l))
            throw new TypeError(
              'Invalid value "' + e + '" assigned to `logLevel`'
            );
          this._logLevel = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.setLogLevel = function (e) {
        this._logLevel = typeof e == "string" ? Y[e] : e;
      }),
      Object.defineProperty(t.prototype, "logHandler", {
        get: function () {
          return this._logHandler;
        },
        set: function (e) {
          if (typeof e != "function")
            throw new TypeError(
              "Value assigned to `logHandler` must be a function"
            );
          this._logHandler = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "userLogHandler", {
        get: function () {
          return this._userLogHandler;
        },
        set: function (e) {
          this._userLogHandler = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.debug = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this._userLogHandler &&
          this._userLogHandler.apply(this, E([this, l.DEBUG], e)),
          this._logHandler.apply(this, E([this, l.DEBUG], e));
      }),
      (t.prototype.log = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this._userLogHandler &&
          this._userLogHandler.apply(this, E([this, l.VERBOSE], e)),
          this._logHandler.apply(this, E([this, l.VERBOSE], e));
      }),
      (t.prototype.info = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this._userLogHandler &&
          this._userLogHandler.apply(this, E([this, l.INFO], e)),
          this._logHandler.apply(this, E([this, l.INFO], e));
      }),
      (t.prototype.warn = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this._userLogHandler &&
          this._userLogHandler.apply(this, E([this, l.WARN], e)),
          this._logHandler.apply(this, E([this, l.WARN], e));
      }),
      (t.prototype.error = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this._userLogHandler &&
          this._userLogHandler.apply(this, E([this, l.ERROR], e)),
          this._logHandler.apply(this, E([this, l.ERROR], e));
      }),
      t
    );
  })();
function Ae(t) {
  B.forEach(function (e) {
    e.setLogLevel(t);
  });
}
function Se(t, e) {
  for (
    var r = function (s) {
        var f = null;
        e && e.level && (f = Y[e.level]),
          t === null
            ? (s.userLogHandler = null)
            : (s.userLogHandler = function (h, c) {
                for (var m = [], p = 2; p < arguments.length; p++)
                  m[p - 2] = arguments[p];
                var u = m
                  .map(function (o) {
                    if (o == null) return null;
                    if (typeof o == "string") return o;
                    if (typeof o == "number" || typeof o == "boolean")
                      return o.toString();
                    if (o instanceof Error) return o.message;
                    try {
                      return JSON.stringify(o);
                    } catch {
                      return null;
                    }
                  })
                  .filter(function (o) {
                    return o;
                  })
                  .join(" ");
                c >= (f ?? h.logLevel) &&
                  t({
                    level: l[c].toLowerCase(),
                    message: u,
                    args: m,
                    type: h.name,
                  });
              });
      },
      n = 0,
      i = B;
    n < i.length;
    n++
  ) {
    var a = i[n];
    r(a);
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var A,
  Ce =
    ((A = {}),
    (A["no-app"] =
      "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()"),
    (A["bad-app-name"] = "Illegal App name: '{$appName}"),
    (A["duplicate-app"] = "Firebase App named '{$appName}' already exists"),
    (A["app-deleted"] = "Firebase App named '{$appName}' already deleted"),
    (A["invalid-app-argument"] =
      "firebase.{$appName}() takes either no argument or a Firebase App instance."),
    (A["invalid-log-argument"] =
      "First argument to `onLog` must be null or a function."),
    A),
  O = new x("app", "Firebase", Ce),
  J = "@firebase/app",
  Oe = "0.6.30",
  Ne = "@firebase/analytics",
  we = "@firebase/app-check",
  Te = "@firebase/auth",
  De = "@firebase/database",
  Re = "@firebase/functions",
  Le = "@firebase/installations",
  Pe = "@firebase/messaging",
  Me = "@firebase/performance",
  Fe = "@firebase/remote-config",
  xe = "@firebase/storage",
  ze = "@firebase/firestore",
  Be = "firebase-wrapper";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var v,
  R = "[DEFAULT]",
  je =
    ((v = {}),
    (v[J] = "fire-core"),
    (v[Ne] = "fire-analytics"),
    (v[we] = "fire-app-check"),
    (v[Te] = "fire-auth"),
    (v[De] = "fire-rtdb"),
    (v[Re] = "fire-fn"),
    (v[Le] = "fire-iid"),
    (v[Pe] = "fire-fcm"),
    (v[Me] = "fire-perf"),
    (v[Fe] = "fire-rc"),
    (v[xe] = "fire-gcs"),
    (v[ze] = "fire-fst"),
    (v["fire-js"] = "fire-js"),
    (v[Be] = "fire-js-all"),
    v);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var N = new Ie("@firebase/app");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var D = (function () {
  function t(e, r, n) {
    var i = this;
    (this.firebase_ = n),
      (this.isDeleted_ = !1),
      (this.name_ = r.name),
      (this.automaticDataCollectionEnabled_ =
        r.automaticDataCollectionEnabled || !1),
      (this.options_ = ie(e)),
      (this.container = new ye(r.name)),
      this._addComponent(
        new z(
          "app",
          function () {
            return i;
          },
          "PUBLIC"
        )
      ),
      this.firebase_.INTERNAL.components.forEach(function (a) {
        return i._addComponent(a);
      });
  }
  return (
    Object.defineProperty(t.prototype, "automaticDataCollectionEnabled", {
      get: function () {
        return this.checkDestroyed_(), this.automaticDataCollectionEnabled_;
      },
      set: function (e) {
        this.checkDestroyed_(), (this.automaticDataCollectionEnabled_ = e);
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, "name", {
      get: function () {
        return this.checkDestroyed_(), this.name_;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, "options", {
      get: function () {
        return this.checkDestroyed_(), this.options_;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (t.prototype.delete = function () {
      var e = this;
      return new Promise(function (r) {
        e.checkDestroyed_(), r();
      })
        .then(function () {
          return (
            e.firebase_.INTERNAL.removeApp(e.name_),
            Promise.all(
              e.container.getProviders().map(function (r) {
                return r.delete();
              })
            )
          );
        })
        .then(function () {
          e.isDeleted_ = !0;
        });
    }),
    (t.prototype._getService = function (e, r) {
      var n;
      r === void 0 && (r = R), this.checkDestroyed_();
      var i = this.container.getProvider(e);
      return (
        !i.isInitialized() &&
          ((n = i.getComponent()) === null || n === void 0
            ? void 0
            : n.instantiationMode) === "EXPLICIT" &&
          i.initialize(),
        i.getImmediate({ identifier: r })
      );
    }),
    (t.prototype._removeServiceInstance = function (e, r) {
      r === void 0 && (r = R), this.container.getProvider(e).clearInstance(r);
    }),
    (t.prototype._addComponent = function (e) {
      try {
        this.container.addComponent(e);
      } catch (r) {
        N.debug(
          "Component " +
            e.name +
            " failed to register with FirebaseApp " +
            this.name,
          r
        );
      }
    }),
    (t.prototype._addOrOverwriteComponent = function (e) {
      this.container.addOrOverwriteComponent(e);
    }),
    (t.prototype.toJSON = function () {
      return {
        name: this.name,
        automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
        options: this.options,
      };
    }),
    (t.prototype.checkDestroyed_ = function () {
      if (this.isDeleted_)
        throw O.create("app-deleted", { appName: this.name_ });
    }),
    t
  );
})();
(D.prototype.name && D.prototype.options) ||
  D.prototype.delete ||
  console.log("dc");
var Ve = "8.10.0";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function He(t) {
  var e = {},
    r = new Map(),
    n = {
      __esModule: !0,
      initializeApp: s,
      app: a,
      registerVersion: c,
      setLogLevel: Ae,
      onLog: m,
      apps: null,
      SDK_VERSION: Ve,
      INTERNAL: {
        registerComponent: h,
        removeApp: i,
        components: r,
        useAsService: p,
      },
    };
  (n.default = n), Object.defineProperty(n, "apps", { get: f });
  function i(u) {
    delete e[u];
  }
  function a(u) {
    if (((u = u || R), !W(e, u))) throw O.create("no-app", { appName: u });
    return e[u];
  }
  a.App = t;
  function s(u, o) {
    if ((o === void 0 && (o = {}), typeof o != "object" || o === null)) {
      var g = o;
      o = { name: g };
    }
    var y = o;
    y.name === void 0 && (y.name = R);
    var d = y.name;
    if (typeof d != "string" || !d)
      throw O.create("bad-app-name", { appName: String(d) });
    if (W(e, d)) throw O.create("duplicate-app", { appName: d });
    var I = new t(u, y, n);
    return (e[d] = I), I;
  }
  function f() {
    return Object.keys(e).map(function (u) {
      return e[u];
    });
  }
  function h(u) {
    var o = u.name;
    if (r.has(o))
      return (
        N.debug(
          "There were multiple attempts to register component " + o + "."
        ),
        u.type === "PUBLIC" ? n[o] : null
      );
    if ((r.set(o, u), u.type === "PUBLIC")) {
      var g = function (b) {
        if ((b === void 0 && (b = a()), typeof b[o] != "function"))
          throw O.create("invalid-app-argument", { appName: o });
        return b[o]();
      };
      u.serviceProps !== void 0 && w(g, u.serviceProps),
        (n[o] = g),
        (t.prototype[o] = function () {
          for (var b = [], _ = 0; _ < arguments.length; _++)
            b[_] = arguments[_];
          var Z = this._getService.bind(this, o);
          return Z.apply(this, u.multipleInstances ? b : []);
        });
    }
    for (var y = 0, d = Object.keys(e); y < d.length; y++) {
      var I = d[y];
      e[I]._addComponent(u);
    }
    return u.type === "PUBLIC" ? n[o] : null;
  }
  function c(u, o, g) {
    var y,
      d = (y = je[u]) !== null && y !== void 0 ? y : u;
    g && (d += "-" + g);
    var I = d.match(/\s|\//),
      b = o.match(/\s|\//);
    if (I || b) {
      var _ = [
        'Unable to register library "' + d + '" with version "' + o + '":',
      ];
      I &&
        _.push(
          'library name "' +
            d +
            '" contains illegal characters (whitespace or "/")'
        ),
        I && b && _.push("and"),
        b &&
          _.push(
            'version name "' +
              o +
              '" contains illegal characters (whitespace or "/")'
          ),
        N.warn(_.join(" "));
      return;
    }
    h(
      new z(
        d + "-version",
        function () {
          return { library: d, version: o };
        },
        "VERSION"
      )
    );
  }
  function m(u, o) {
    if (u !== null && typeof u != "function")
      throw O.create("invalid-log-argument");
    Se(u, o);
  }
  function p(u, o) {
    if (o === "serverAuth") return null;
    var g = o;
    return g;
  }
  return n;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function K() {
  var t = He(D);
  t.INTERNAL = F(F({}, t.INTERNAL), {
    createFirebaseNamespace: K,
    extendNamespace: e,
    createSubscribe: he,
    ErrorFactory: x,
    deepExtend: w,
  });
  function e(r) {
    w(t, r);
  }
  return t;
}
var j = K();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var ke = (function () {
  function t(e) {
    this.container = e;
  }
  return (
    (t.prototype.getPlatformInfoString = function () {
      var e = this.container.getProviders();
      return e
        .map(function (r) {
          if (We(r)) {
            var n = r.getImmediate();
            return n.library + "/" + n.version;
          } else return null;
        })
        .filter(function (r) {
          return r;
        })
        .join(" ");
    }),
    t
  );
})();
function We(t) {
  var e = t.getComponent();
  return (e == null ? void 0 : e.type) === "VERSION";
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Ue(t, e) {
  t.INTERNAL.registerComponent(
    new z(
      "platform-logger",
      function (r) {
        return new ke(r);
      },
      "PRIVATE"
    )
  ),
    t.registerVersion(J, Oe, e),
    t.registerVersion("fire-js", "");
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ if (se() && self.firebase !== void 0) {
  N.warn(`
    Warning: Firebase is already defined in the global scope. Please make sure
    Firebase library is only loaded once.
  `);
  var U = self.firebase.SDK_VERSION;
  U &&
    U.indexOf("LITE") >= 0 &&
    N.warn(`
    Warning: You are trying to load Firebase while using Firebase Performance standalone script.
    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.
    `);
}
var $e = j.initializeApp;
j.initializeApp = function () {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  return (
    G() &&
      N.warn(`
      Warning: This is a browser-targeted Firebase bundle but it appears it is being
      run in a Node environment.  If running in a Node environment, make sure you
      are using the bundle specified by the "main" field in package.json.
      
      If you are using Webpack, you can specify "main" as the first item in
      "resolve.mainFields":
      https://webpack.js.org/configuration/resolve/#resolvemainfields
      
      If using Rollup, use the @rollup/plugin-node-resolve plugin and specify "main"
      as the first item in "mainFields", e.g. ['main', 'module'].
      https://github.com/rollup/@rollup/plugin-node-resolve
      `),
    $e.apply(void 0, t)
  );
};
var V = j;
Ue(V);
var Ge = "firebase",
  X = "8.10.1";
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ V.registerVersion(Ge, X, "app");
V.SDK_VERSION = X;
export {
  z as C,
  Ie as L,
  Ke as a,
  Ze as b,
  qe as c,
  Qe as d,
  et as e,
  V as f,
  L as g,
  Xe as h,
  tt as i,
  rt as j,
  Je as k,
  l,
};
