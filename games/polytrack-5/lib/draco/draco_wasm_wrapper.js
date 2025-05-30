var $jscomp = $jscomp || {};
$jscomp.scope = {}, $jscomp.arrayIteratorImpl = function(t) {
  var e = 0;
  return function() {
    return e < t.length ? {
      done: !1,
      value: t[e++]
    } : {
      done: !0
    }
  }
}, $jscomp.arrayIterator = function(t) {
  return {
    next: $jscomp.arrayIteratorImpl(t)
  }
}, $jscomp.makeIterator = function(t) {
  var e = "undefined" != typeof Symbol && Symbol.iterator && t[Symbol.iterator];
  return e ? e.call(t) : $jscomp.arrayIterator(t)
}, $jscomp.ASSUME_ES5 = !1, $jscomp.ASSUME_NO_NATIVE_MAP = !1, $jscomp.ASSUME_NO_NATIVE_SET = !1, $jscomp.SIMPLE_FROUND_POLYFILL = !1, $jscomp.ISOLATE_POLYFILLS = !1, $jscomp.FORCE_POLYFILL_PROMISE = !1, $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1, $jscomp.getGlobal = function(t) {
  t = ["object" == typeof globalThis && globalThis, t, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
  for (var e = 0; e < t.length; ++e) {
    var r = t[e];
    if (r && r.Math == Math) return r
  }
  throw Error("Cannot find global object")
}, $jscomp.global = $jscomp.getGlobal(this), $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(t, e, r) {
  return t == Array.prototype || t == Object.prototype || (t[e] = r.value), t
}, $jscomp.IS_SYMBOL_NATIVE = "function" == typeof Symbol && "symbol" == typeof Symbol("x"), $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE, $jscomp.polyfills = {}, $jscomp.propertyToPolyfillSymbol = {}, $jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(t, e) {
  var r = $jscomp.propertyToPolyfillSymbol[e];
  return null == r ? t[e] : void 0 !== (r = t[r]) ? r : t[e]
};
$jscomp.polyfill = function(t, e, r, n) {
  e && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(t, e, r, n) : $jscomp.polyfillUnisolated(t, e, r, n))
}, $jscomp.polyfillUnisolated = function(t, e, r, n) {
  for (r = $jscomp.global, t = t.split("."), n = 0; n < t.length - 1; n++) {
    var o = t[n];
    if (!(o in r)) return;
    r = r[o]
  }(e = e(n = r[t = t[t.length - 1]])) != n && null != e && $jscomp.defineProperty(r, t, {
    configurable: !0,
    writable: !0,
    value: e
  })
}, $jscomp.polyfillIsolated = function(t, e, r, n) {
  var o = t.split(".");
  t = 1 === o.length, n = o[0], n = !t && n in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var _ = 0; _ < o.length - 1; _++) {
    var i = o[_];
    if (!(i in n)) return;
    n = n[i]
  }
  o = o[o.length - 1], null != (e = e(r = $jscomp.IS_SYMBOL_NATIVE && "es6" === r ? n[o] : null)) && (t ? $jscomp.defineProperty($jscomp.polyfills, o, {
    configurable: !0,
    writable: !0,
    value: e
  }) : e !== r && (void 0 === $jscomp.propertyToPolyfillSymbol[o] && (r = 1e9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[o] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(o) : $jscomp.POLYFILL_PREFIX + r + "$" + o), $jscomp.defineProperty(n, $jscomp.propertyToPolyfillSymbol[o], {
    configurable: !0,
    writable: !0,
    value: e
  })))
}, $jscomp.polyfill("Promise", (function(t) {
  function e() {
    this.batch_ = null
  }

  function r(t) {
    return t instanceof o ? t : new o((function(e, r) {
      e(t)
    }))
  }
  if (t && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && void 0 === $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return t;
  e.prototype.asyncExecute = function(t) {
    if (null == this.batch_) {
      this.batch_ = [];
      var e = this;
      this.asyncExecuteFunction((function() {
        e.executeBatch_()
      }))
    }
    this.batch_.push(t)
  };
  var n = $jscomp.global.setTimeout;
  e.prototype.asyncExecuteFunction = function(t) {
    n(t, 0)
  }, e.prototype.executeBatch_ = function() {
    for (; this.batch_ && this.batch_.length;) {
      var t = this.batch_;
      this.batch_ = [];
      for (var e = 0; e < t.length; ++e) {
        var r = t[e];
        t[e] = null;
        try {
          r()
        } catch (t) {
          this.asyncThrow_(t)
        }
      }
    }
    this.batch_ = null
  }, e.prototype.asyncThrow_ = function(t) {
    this.asyncExecuteFunction((function() {
      throw t
    }))
  };
  var o = function(t) {
    this.state_ = 0, this.result_ = void 0, this.onSettledCallbacks_ = [], this.isRejectionHandled_ = !1;
    var e = this.createResolveAndReject_();
    try {
      t(e.resolve, e.reject)
    } catch (t) {
      e.reject(t)
    }
  };
  o.prototype.createResolveAndReject_ = function() {
    function t(t) {
      return function(n) {
        r || (r = !0, t.call(e, n))
      }
    }
    var e = this,
      r = !1;
    return {
      resolve: t(this.resolveTo_),
      reject: t(this.reject_)
    }
  }, o.prototype.resolveTo_ = function(t) {
    if (t === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
    else if (t instanceof o) this.settleSameAsPromise_(t);
    else {
      t: switch (typeof t) {
        case "object":
          var e = null != t;
          break t;
        case "function":
          e = !0;
          break t;
        default:
          e = !1
      }
      e ? this.resolveToNonPromiseObj_(t) : this.fulfill_(t)
    }
  }, o.prototype.resolveToNonPromiseObj_ = function(t) {
    var e = void 0;
    try {
      e = t.then
    } catch (t) {
      return void this.reject_(t)
    }
    "function" == typeof e ? this.settleSameAsThenable_(e, t) : this.fulfill_(t)
  }, o.prototype.reject_ = function(t) {
    this.settle_(2, t)
  }, o.prototype.fulfill_ = function(t) {
    this.settle_(1, t)
  }, o.prototype.settle_ = function(t, e) {
    if (0 != this.state_) throw Error("Cannot settle(" + t + ", " + e + "): Promise already settled in state" + this.state_);
    this.state_ = t, this.result_ = e, 2 === this.state_ && this.scheduleUnhandledRejectionCheck_(), this.executeOnSettledCallbacks_()
  }, o.prototype.scheduleUnhandledRejectionCheck_ = function() {
    var t = this;
    n((function() {
      if (t.notifyUnhandledRejection_()) {
        var e = $jscomp.global.console;
        void 0 !== e && e.error(t.result_)
      }
    }), 1)
  }, o.prototype.notifyUnhandledRejection_ = function() {
    if (this.isRejectionHandled_) return !1;
    var t = $jscomp.global.CustomEvent,
      e = $jscomp.global.Event,
      r = $jscomp.global.dispatchEvent;
    return void 0 === r || ("function" == typeof t ? t = new t("unhandledrejection", {
      cancelable: !0
    }) : "function" == typeof e ? t = new e("unhandledrejection", {
      cancelable: !0
    }) : (t = $jscomp.global.document.createEvent("CustomEvent")).initCustomEvent("unhandledrejection", !1, !0, t), t.promise = this, t.reason = this.result_, r(t))
  }, o.prototype.executeOnSettledCallbacks_ = function() {
    if (null != this.onSettledCallbacks_) {
      for (var t = 0; t < this.onSettledCallbacks_.length; ++t) _.asyncExecute(this.onSettledCallbacks_[t]);
      this.onSettledCallbacks_ = null
    }
  };
  var _ = new e;
  return o.prototype.settleSameAsPromise_ = function(t) {
    var e = this.createResolveAndReject_();
    t.callWhenSettled_(e.resolve, e.reject)
  }, o.prototype.settleSameAsThenable_ = function(t, e) {
    var r = this.createResolveAndReject_();
    try {
      t.call(e, r.resolve, r.reject)
    } catch (t) {
      r.reject(t)
    }
  }, o.prototype.then = function(t, e) {
    function r(t, e) {
      return "function" == typeof t ? function(e) {
        try {
          n(t(e))
        } catch (t) {
          _(t)
        }
      } : e
    }
    var n, _, i = new o((function(t, e) {
      n = t, _ = e
    }));
    return this.callWhenSettled_(r(t, n), r(e, _)), i
  }, o.prototype.catch = function(t) {
    return this.then(void 0, t)
  }, o.prototype.callWhenSettled_ = function(t, e) {
    function r() {
      switch (n.state_) {
        case 1:
          t(n.result_);
          break;
        case 2:
          e(n.result_);
          break;
        default:
          throw Error("Unexpected state: " + n.state_)
      }
    }
    var n = this;
    null == this.onSettledCallbacks_ ? _.asyncExecute(r) : this.onSettledCallbacks_.push(r), this.isRejectionHandled_ = !0
  }, o.resolve = r, o.reject = function(t) {
    return new o((function(e, r) {
      r(t)
    }))
  }, o.race = function(t) {
    return new o((function(e, n) {
      for (var o = $jscomp.makeIterator(t), _ = o.next(); !_.done; _ = o.next()) r(_.value).callWhenSettled_(e, n)
    }))
  }, o.all = function(t) {
    var e = $jscomp.makeIterator(t),
      n = e.next();
    return n.done ? r([]) : new o((function(t, o) {
      function _(e) {
        return function(r) {
          i[e] = r, 0 == --p && t(i)
        }
      }
      var i = [],
        p = 0;
      do {
        i.push(void 0), p++, r(n.value).callWhenSettled_(_(i.length - 1), o), n = e.next()
      } while (!n.done)
    }))
  }, o
}), "es6", "es3"), $jscomp.owns = function(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e)
}, $jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(t, e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r];
    if (n)
      for (var o in n) $jscomp.owns(n, o) && (t[o] = n[o])
  }
  return t
}, $jscomp.polyfill("Object.assign", (function(t) {
  return t || $jscomp.assign
}), "es6", "es3"), $jscomp.checkStringArgs = function(t, e, r) {
  if (null == t) throw new TypeError("The 'this' value for String.prototype." + r + " must not be null or undefined");
  if (e instanceof RegExp) throw new TypeError("First argument to String.prototype." + r + " must not be a regular expression");
  return t + ""
}, $jscomp.polyfill("String.prototype.startsWith", (function(t) {
  return t || function(t, e) {
    var r = $jscomp.checkStringArgs(this, t, "startsWith");
    t += "";
    var n = r.length,
      o = t.length;
    e = Math.max(0, Math.min(0 | e, r.length));
    for (var _ = 0; _ < o && e < n;)
      if (r[e++] != t[_++]) return !1;
    return _ >= o
  }
}), "es6", "es3"), $jscomp.polyfill("Array.prototype.copyWithin", (function(t) {
  function e(t) {
    return 1 / 0 === (t = Number(t)) || -1 / 0 === t ? t : 0 | t
  }
  return t || function(t, r, n) {
    var o = this.length;
    if (t = e(t), r = e(r), n = void 0 === n ? o : e(n), t = 0 > t ? Math.max(o + t, 0) : Math.min(t, o), r = 0 > r ? Math.max(o + r, 0) : Math.min(r, o), n = 0 > n ? Math.max(o + n, 0) : Math.min(n, o), t < r)
      for (; r < n;) r in this ? this[t++] = this[r++] : (delete this[t++], r++);
    else
      for (t += (n = Math.min(n, o + r - t)) - r; n > r;) --n in this ? this[--t] = this[n] : delete this[--t];
    return this
  }
}), "es6", "es3"), $jscomp.typedArrayCopyWithin = function(t) {
  return t || Array.prototype.copyWithin
}, $jscomp.polyfill("Int8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5"), $jscomp.polyfill("Uint8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5"), $jscomp.polyfill("Uint8ClampedArray.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5"), $jscomp.polyfill("Int16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5"), $jscomp.polyfill("Uint16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5"), $jscomp.polyfill("Int32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5"), $jscomp.polyfill("Uint32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5"), $jscomp.polyfill("Float32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5"), $jscomp.polyfill("Float64Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
var DracoDecoderModule = function() {
  var t = "undefined" != typeof document && document.currentScript ? document.currentScript.src : void 0;
  return "undefined" != typeof __filename && (t = t || __filename),
    function(e) {
      function r(t, e, r) {
        var n = e + r;
        for (r = e; t[r] && !(r >= n);) ++r;
        if (16 < r - e && t.buffer && it) return it.decode(t.subarray(e, r));
        for (n = ""; e < r;) {
          var o = t[e++];
          if (128 & o) {
            var _ = 63 & t[e++];
            if (192 == (224 & o)) n += String.fromCharCode((31 & o) << 6 | _);
            else {
              var i = 63 & t[e++];
              65536 > (o = 224 == (240 & o) ? (15 & o) << 12 | _ << 6 | i : (7 & o) << 18 | _ << 12 | i << 6 | 63 & t[e++]) ? n += String.fromCharCode(o) : (o -= 65536, n += String.fromCharCode(55296 | o >> 10, 56320 | 1023 & o))
            }
          } else n += String.fromCharCode(o)
        }
        return n
      }

      function n(t, e) {
        return t ? r(et, t, e) : ""
      }

      function o() {
        var t = Z.buffer;
        C.HEAP8 = tt = new Int8Array(t), C.HEAP16 = new Int16Array(t), C.HEAP32 = rt = new Int32Array(t), C.HEAPU8 = et = new Uint8Array(t), C.HEAPU16 = new Uint16Array(t), C.HEAPU32 = nt = new Uint32Array(t), C.HEAPF32 = new Float32Array(t), C.HEAPF64 = new Float64Array(t)
      }

      function _(t) {
        throw C.onAbort && C.onAbort(t), J(t = "Aborted(" + t + ")"), _t = !0, t = new WebAssembly.RuntimeError(t + ". Build with -sASSERTIONS for more info."), L(t), t
      }

      function i(t) {
        try {
          if (t == ft && X) return new Uint8Array(X);
          if (H) return H(t);
          throw "both async and sync fetching of the wasm failed"
        } catch (t) {
          _(t)
        }
      }

      function p(t) {
        for (; 0 < t.length;) t.shift()(C)
      }

      function a(t) {
        this.excPtr = t, this.ptr = t - 24, this.set_type = function(t) {
          nt[this.ptr + 4 >> 2] = t
        }, this.get_type = function() {
          return nt[this.ptr + 4 >> 2]
        }, this.set_destructor = function(t) {
          nt[this.ptr + 8 >> 2] = t
        }, this.get_destructor = function() {
          return nt[this.ptr + 8 >> 2]
        }, this.set_refcount = function(t) {
          rt[this.ptr >> 2] = t
        }, this.set_caught = function(t) {
          tt[this.ptr + 12 | 0] = t ? 1 : 0
        }, this.get_caught = function() {
          return 0 != tt[this.ptr + 12 | 0]
        }, this.set_rethrown = function(t) {
          tt[this.ptr + 13 | 0] = t ? 1 : 0
        }, this.get_rethrown = function() {
          return 0 != tt[this.ptr + 13 | 0]
        }, this.init = function(t, e) {
          this.set_adjusted_ptr(0), this.set_type(t), this.set_destructor(e), this.set_refcount(0), this.set_caught(!1), this.set_rethrown(!1)
        }, this.add_ref = function() {
          rt[this.ptr >> 2] += 1
        }, this.release_ref = function() {
          var t = rt[this.ptr >> 2];
          return rt[this.ptr >> 2] = t - 1, 1 === t
        }, this.set_adjusted_ptr = function(t) {
          nt[this.ptr + 16 >> 2] = t
        }, this.get_adjusted_ptr = function() {
          return nt[this.ptr + 16 >> 2]
        }, this.get_exception_ptr = function() {
          if (Zr(this.get_type())) return nt[this.excPtr >> 2];
          var t = this.get_adjusted_ptr();
          return 0 !== t ? t : this.excPtr
        }
      }

      function c() {
        function t() {
          if (!Jr && (Jr = !0, C.calledRun = !0, !_t)) {
            if (st = !0, p(at), F(C), C.onRuntimeInitialized && C.onRuntimeInitialized(), C.postRun)
              for ("function" == typeof C.postRun && (C.postRun = [C.postRun]); C.postRun.length;) ct.unshift(C.postRun.shift());
            p(ct)
          }
        }
        if (!(0 < ut)) {
          if (C.preRun)
            for ("function" == typeof C.preRun && (C.preRun = [C.preRun]); C.preRun.length;) pt.unshift(C.preRun.shift());
          p(pt), 0 < ut || (C.setStatus ? (C.setStatus("Running..."), setTimeout((function() {
            setTimeout((function() {
              C.setStatus("")
            }), 1), t()
          }), 1)) : t())
        }
      }

      function s() {}

      function u(t) {
        return (t || s).__cache__
      }

      function y(t, e) {
        var r = u(e),
          n = r[t];
        return n || ((n = Object.create((e || s).prototype)).ptr = t, r[t] = n)
      }

      function l(t) {
        if ("string" == typeof t) {
          for (var e = 0, r = 0; r < t.length; ++r) {
            var n = t.charCodeAt(r);
            127 >= n ? e++ : 2047 >= n ? e += 2 : 55296 <= n && 57343 >= n ? (e += 4, ++r) : e += 3
          }
          if (r = 0, 0 < (n = (e = Array(e + 1)).length)) {
            n = r + n - 1;
            for (var o = 0; o < t.length; ++o) {
              var _ = t.charCodeAt(o);
              if (55296 <= _ && 57343 >= _) _ = 65536 + ((1023 & _) << 10) | 1023 & t.charCodeAt(++o);
              if (127 >= _) {
                if (r >= n) break;
                e[r++] = _
              } else {
                if (2047 >= _) {
                  if (r + 1 >= n) break;
                  e[r++] = 192 | _ >> 6
                } else {
                  if (65535 >= _) {
                    if (r + 2 >= n) break;
                    e[r++] = 224 | _ >> 12
                  } else {
                    if (r + 3 >= n) break;
                    e[r++] = 240 | _ >> 18, e[r++] = 128 | _ >> 12 & 63
                  }
                  e[r++] = 128 | _ >> 6 & 63
                }
                e[r++] = 128 | 63 & _
              }
            }
            e[r] = 0
          }
          return t = tn.alloc(e, tt), tn.copy(e, tt, t), t
        }
        return t
      }

      function f(t) {
        if ("object" == typeof t) {
          var e = tn.alloc(t, tt);
          return tn.copy(t, tt, e), e
        }
        return t
      }

      function m() {
        throw "cannot construct a VoidPtr, no constructor in IDL"
      }

      function d() {
        this.ptr = ht(), u(d)[this.ptr] = this
      }

      function b() {
        this.ptr = Dt(), u(b)[this.ptr] = this
      }

      function h() {
        this.ptr = Et(), u(h)[this.ptr] = this
      }

      function A() {
        this.ptr = vt(), u(A)[this.ptr] = this
      }

      function T() {
        this.ptr = Ct(), u(T)[this.ptr] = this
      }

      function D() {
        this.ptr = Wt(), u(D)[this.ptr] = this
      }

      function I() {
        this.ptr = Yt(), u(I)[this.ptr] = this
      }

      function j() {
        this.ptr = Kt(), u(j)[this.ptr] = this
      }

      function E() {
        this.ptr = re(), u(E)[this.ptr] = this
      }

      function G() {
        throw "cannot construct a Status, no constructor in IDL"
      }

      function v() {
        this.ptr = ae(), u(v)[this.ptr] = this
      }

      function O() {
        this.ptr = ye(), u(O)[this.ptr] = this
      }

      function P() {
        this.ptr = de(), u(P)[this.ptr] = this
      }

      function R() {
        this.ptr = Te(), u(R)[this.ptr] = this
      }

      function S() {
        this.ptr = Ee(), u(S)[this.ptr] = this
      }

      function M() {
        this.ptr = Pe(), u(M)[this.ptr] = this
      }

      function N() {
        this.ptr = Ne(), u(N)[this.ptr] = this
      }

      function U() {
        this.ptr = Le(), u(U)[this.ptr] = this
      }

      function g() {
        this.ptr = xe(), u(g)[this.ptr] = this
      }
      var F, L, C = void 0 !== (e = void 0 === e ? {} : e) ? e : {};
      C.ready = new Promise((function(t, e) {
        F = t, L = e
      }));
      var $ = !1,
        w = !1;
      C.onRuntimeInitialized = function() {
        $ = !0, w && "function" == typeof C.onModuleLoaded && C.onModuleLoaded(C)
      }, C.onModuleParsed = function() {
        w = !0, $ && "function" == typeof C.onModuleLoaded && C.onModuleLoaded(C)
      }, C.isVersionSupported = function(t) {
        return "string" == typeof t && (!(2 > (t = t.split(".")).length || 3 < t.length) && (1 == t[0] && 0 <= t[1] && 5 >= t[1] || !(0 != t[0] || 10 < t[1])))
      };
      var z = Object.assign({}, C),
        V = "object" == typeof window,
        B = "function" == typeof importScripts,
        W = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
        k = "";
      if (W) {
        var x = require("fs"),
          Q = require("path");
        k = B ? Q.dirname(k) + "/" : __dirname + "/";
        var Y = function(t, e) {
            return t = t.startsWith("file://") ? new URL(t) : Q.normalize(t), x.readFileSync(t, e ? void 0 : "utf8")
          },
          H = function(t) {
            return (t = Y(t, !0)).buffer || (t = new Uint8Array(t)), t
          },
          q = function(t, e, r) {
            t = t.startsWith("file://") ? new URL(t) : Q.normalize(t), x.readFile(t, (function(t, n) {
              t ? r(t) : e(n.buffer)
            }))
          };
        1 < process.argv.length && process.argv[1].replace(/\\/g, "/"), process.argv.slice(2), C.inspect = function() {
          return "[Emscripten Module object]"
        }
      } else(V || B) && (B ? k = self.location.href : "undefined" != typeof document && document.currentScript && (k = document.currentScript.src), t && (k = t), k = 0 !== k.indexOf("blob:") ? k.substr(0, k.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", Y = function(t) {
        var e = new XMLHttpRequest;
        return e.open("GET", t, !1), e.send(null), e.responseText
      }, B && (H = function(t) {
        var e = new XMLHttpRequest;
        return e.open("GET", t, !1), e.responseType = "arraybuffer", e.send(null), new Uint8Array(e.response)
      }), q = function(t, e, r) {
        var n = new XMLHttpRequest;
        n.open("GET", t, !0), n.responseType = "arraybuffer", n.onload = function() {
          200 == n.status || 0 == n.status && n.response ? e(n.response) : r()
        }, n.onerror = r, n.send(null)
      });
      var X, K = C.print || console.log.bind(console),
        J = C.printErr || console.warn.bind(console);
      Object.assign(C, z), z = null, C.wasmBinary && (X = C.wasmBinary), "object" != typeof WebAssembly && _("no native wasm support detected");
      var Z, tt, et, rt, nt, ot, _t = !1,
        it = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
        pt = [],
        at = [],
        ct = [],
        st = !1,
        ut = 0,
        yt = null,
        lt = null,
        ft = "draco_decoder.wasm";
      ft.startsWith("data:application/octet-stream;base64,") || (ot = ft, ft = C.locateFile ? C.locateFile(ot, k) : k + ot);
      var mt = [null, [],
          []
        ],
        dt = {
          b: function(t, e, r) {
            throw new a(t).init(e, r), t
          },
          a: function() {
            _("")
          },
          g: function(t, e, r) {
            et.copyWithin(t, e, e + r)
          },
          e: function(t) {
            var e = et.length;
            if (2147483648 < (t >>>= 0)) return !1;
            for (var r = 1; 4 >= r; r *= 2) {
              var n = e * (1 + .2 / r);
              n = Math.min(n, t + 100663296);
              var _ = Math;
              n = Math.max(t, n), _ = _.min.call(_, 2147483648, n + (65536 - n % 65536) % 65536);
              t: {
                n = Z.buffer;
                try {
                  Z.grow(_ - n.byteLength + 65535 >>> 16), o();
                  var i = 1;
                  break t
                } catch (t) {}
                i = void 0
              }
              if (i) return !0
            }
            return !1
          },
          f: function(t) {
            return 52
          },
          d: function(t, e, r, n, o) {
            return 70
          },
          c: function(t, e, n, o) {
            for (var _ = 0, i = 0; i < n; i++) {
              var p = nt[e >> 2],
                a = nt[e + 4 >> 2];
              e += 8;
              for (var c = 0; c < a; c++) {
                var s = et[p + c],
                  u = mt[t];
                0 === s || 10 === s ? ((1 === t ? K : J)(r(u, 0)), u.length = 0) : u.push(s)
              }
              _ += a
            }
            return nt[o >> 2] = _, 0
          }
        };
      ! function() {
        function t(t, e) {
          C.asm = t.exports, Z = C.asm.h, o(), at.unshift(C.asm.i), ut--, C.monitorRunDependencies && C.monitorRunDependencies(ut), 0 == ut && (null !== yt && (clearInterval(yt), yt = null), lt && (t = lt, lt = null, t()))
        }

        function e(e) {
          t(e.instance)
        }

        function r(t) {
          return function() {
            if (!X && (V || B)) {
              if ("function" == typeof fetch && !ft.startsWith("file://")) return fetch(ft, {
                credentials: "same-origin"
              }).then((function(t) {
                if (!t.ok) throw "failed to load wasm binary file at '" + ft + "'";
                return t.arrayBuffer()
              })).catch((function() {
                return i(ft)
              }));
              if (q) return new Promise((function(t, e) {
                q(ft, (function(e) {
                  t(new Uint8Array(e))
                }), e)
              }))
            }
            return Promise.resolve().then((function() {
              return i(ft)
            }))
          }().then((function(t) {
            return WebAssembly.instantiate(t, n)
          })).then((function(t) {
            return t
          })).then(t, (function(t) {
            J("failed to asynchronously prepare wasm: " + t), _(t)
          }))
        }
        var n = {
          a: dt
        };
        if (ut++, C.monitorRunDependencies && C.monitorRunDependencies(ut), C.instantiateWasm) try {
          return C.instantiateWasm(n, t)
        } catch (t) {
          J("Module.instantiateWasm callback failed with error: " + t), L(t)
        }(X || "function" != typeof WebAssembly.instantiateStreaming || ft.startsWith("data:application/octet-stream;base64,") || ft.startsWith("file://") || W || "function" != typeof fetch ? r(e) : fetch(ft, {
          credentials: "same-origin"
        }).then((function(t) {
          return WebAssembly.instantiateStreaming(t, n).then(e, (function(t) {
            return J("wasm streaming compile failed: " + t), J("falling back to ArrayBuffer instantiation"), r(e)
          }))
        }))).catch(L)
      }();
      var bt = C._emscripten_bind_VoidPtr___destroy___0 = function() {
          return (bt = C._emscripten_bind_VoidPtr___destroy___0 = C.asm.k).apply(null, arguments)
        },
        ht = C._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = function() {
          return (ht = C._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = C.asm.l).apply(null, arguments)
        },
        At = C._emscripten_bind_DecoderBuffer_Init_2 = function() {
          return (At = C._emscripten_bind_DecoderBuffer_Init_2 = C.asm.m).apply(null, arguments)
        },
        Tt = C._emscripten_bind_DecoderBuffer___destroy___0 = function() {
          return (Tt = C._emscripten_bind_DecoderBuffer___destroy___0 = C.asm.n).apply(null, arguments)
        },
        Dt = C._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = function() {
          return (Dt = C._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = C.asm.o).apply(null, arguments)
        },
        It = C._emscripten_bind_AttributeTransformData_transform_type_0 = function() {
          return (It = C._emscripten_bind_AttributeTransformData_transform_type_0 = C.asm.p).apply(null, arguments)
        },
        jt = C._emscripten_bind_AttributeTransformData___destroy___0 = function() {
          return (jt = C._emscripten_bind_AttributeTransformData___destroy___0 = C.asm.q).apply(null, arguments)
        },
        Et = C._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
          return (Et = C._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = C.asm.r).apply(null, arguments)
        },
        Gt = C._emscripten_bind_GeometryAttribute___destroy___0 = function() {
          return (Gt = C._emscripten_bind_GeometryAttribute___destroy___0 = C.asm.s).apply(null, arguments)
        },
        vt = C._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
          return (vt = C._emscripten_bind_PointAttribute_PointAttribute_0 = C.asm.t).apply(null, arguments)
        },
        Ot = C._emscripten_bind_PointAttribute_size_0 = function() {
          return (Ot = C._emscripten_bind_PointAttribute_size_0 = C.asm.u).apply(null, arguments)
        },
        Pt = C._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = function() {
          return (Pt = C._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = C.asm.v).apply(null, arguments)
        },
        Rt = C._emscripten_bind_PointAttribute_attribute_type_0 = function() {
          return (Rt = C._emscripten_bind_PointAttribute_attribute_type_0 = C.asm.w).apply(null, arguments)
        },
        St = C._emscripten_bind_PointAttribute_data_type_0 = function() {
          return (St = C._emscripten_bind_PointAttribute_data_type_0 = C.asm.x).apply(null, arguments)
        },
        Mt = C._emscripten_bind_PointAttribute_num_components_0 = function() {
          return (Mt = C._emscripten_bind_PointAttribute_num_components_0 = C.asm.y).apply(null, arguments)
        },
        Nt = C._emscripten_bind_PointAttribute_normalized_0 = function() {
          return (Nt = C._emscripten_bind_PointAttribute_normalized_0 = C.asm.z).apply(null, arguments)
        },
        Ut = C._emscripten_bind_PointAttribute_byte_stride_0 = function() {
          return (Ut = C._emscripten_bind_PointAttribute_byte_stride_0 = C.asm.A).apply(null, arguments)
        },
        gt = C._emscripten_bind_PointAttribute_byte_offset_0 = function() {
          return (gt = C._emscripten_bind_PointAttribute_byte_offset_0 = C.asm.B).apply(null, arguments)
        },
        Ft = C._emscripten_bind_PointAttribute_unique_id_0 = function() {
          return (Ft = C._emscripten_bind_PointAttribute_unique_id_0 = C.asm.C).apply(null, arguments)
        },
        Lt = C._emscripten_bind_PointAttribute___destroy___0 = function() {
          return (Lt = C._emscripten_bind_PointAttribute___destroy___0 = C.asm.D).apply(null, arguments)
        },
        Ct = C._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = function() {
          return (Ct = C._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = C.asm.E).apply(null, arguments)
        },
        $t = C._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = function() {
          return ($t = C._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = C.asm.F).apply(null, arguments)
        },
        wt = C._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = function() {
          return (wt = C._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = C.asm.G).apply(null, arguments)
        },
        zt = C._emscripten_bind_AttributeQuantizationTransform_min_value_1 = function() {
          return (zt = C._emscripten_bind_AttributeQuantizationTransform_min_value_1 = C.asm.H).apply(null, arguments)
        },
        Vt = C._emscripten_bind_AttributeQuantizationTransform_range_0 = function() {
          return (Vt = C._emscripten_bind_AttributeQuantizationTransform_range_0 = C.asm.I).apply(null, arguments)
        },
        Bt = C._emscripten_bind_AttributeQuantizationTransform___destroy___0 = function() {
          return (Bt = C._emscripten_bind_AttributeQuantizationTransform___destroy___0 = C.asm.J).apply(null, arguments)
        },
        Wt = C._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = function() {
          return (Wt = C._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = C.asm.K).apply(null, arguments)
        },
        kt = C._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = function() {
          return (kt = C._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = C.asm.L).apply(null, arguments)
        },
        xt = C._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = function() {
          return (xt = C._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = C.asm.M).apply(null, arguments)
        },
        Qt = C._emscripten_bind_AttributeOctahedronTransform___destroy___0 = function() {
          return (Qt = C._emscripten_bind_AttributeOctahedronTransform___destroy___0 = C.asm.N).apply(null, arguments)
        },
        Yt = C._emscripten_bind_PointCloud_PointCloud_0 = function() {
          return (Yt = C._emscripten_bind_PointCloud_PointCloud_0 = C.asm.O).apply(null, arguments)
        },
        Ht = C._emscripten_bind_PointCloud_num_attributes_0 = function() {
          return (Ht = C._emscripten_bind_PointCloud_num_attributes_0 = C.asm.P).apply(null, arguments)
        },
        qt = C._emscripten_bind_PointCloud_num_points_0 = function() {
          return (qt = C._emscripten_bind_PointCloud_num_points_0 = C.asm.Q).apply(null, arguments)
        },
        Xt = C._emscripten_bind_PointCloud___destroy___0 = function() {
          return (Xt = C._emscripten_bind_PointCloud___destroy___0 = C.asm.R).apply(null, arguments)
        },
        Kt = C._emscripten_bind_Mesh_Mesh_0 = function() {
          return (Kt = C._emscripten_bind_Mesh_Mesh_0 = C.asm.S).apply(null, arguments)
        },
        Jt = C._emscripten_bind_Mesh_num_faces_0 = function() {
          return (Jt = C._emscripten_bind_Mesh_num_faces_0 = C.asm.T).apply(null, arguments)
        },
        Zt = C._emscripten_bind_Mesh_num_attributes_0 = function() {
          return (Zt = C._emscripten_bind_Mesh_num_attributes_0 = C.asm.U).apply(null, arguments)
        },
        te = C._emscripten_bind_Mesh_num_points_0 = function() {
          return (te = C._emscripten_bind_Mesh_num_points_0 = C.asm.V).apply(null, arguments)
        },
        ee = C._emscripten_bind_Mesh___destroy___0 = function() {
          return (ee = C._emscripten_bind_Mesh___destroy___0 = C.asm.W).apply(null, arguments)
        },
        re = C._emscripten_bind_Metadata_Metadata_0 = function() {
          return (re = C._emscripten_bind_Metadata_Metadata_0 = C.asm.X).apply(null, arguments)
        },
        ne = C._emscripten_bind_Metadata___destroy___0 = function() {
          return (ne = C._emscripten_bind_Metadata___destroy___0 = C.asm.Y).apply(null, arguments)
        },
        oe = C._emscripten_bind_Status_code_0 = function() {
          return (oe = C._emscripten_bind_Status_code_0 = C.asm.Z).apply(null, arguments)
        },
        _e = C._emscripten_bind_Status_ok_0 = function() {
          return (_e = C._emscripten_bind_Status_ok_0 = C.asm._).apply(null, arguments)
        },
        ie = C._emscripten_bind_Status_error_msg_0 = function() {
          return (ie = C._emscripten_bind_Status_error_msg_0 = C.asm.$).apply(null, arguments)
        },
        pe = C._emscripten_bind_Status___destroy___0 = function() {
          return (pe = C._emscripten_bind_Status___destroy___0 = C.asm.aa).apply(null, arguments)
        },
        ae = C._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = function() {
          return (ae = C._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = C.asm.ba).apply(null, arguments)
        },
        ce = C._emscripten_bind_DracoFloat32Array_GetValue_1 = function() {
          return (ce = C._emscripten_bind_DracoFloat32Array_GetValue_1 = C.asm.ca).apply(null, arguments)
        },
        se = C._emscripten_bind_DracoFloat32Array_size_0 = function() {
          return (se = C._emscripten_bind_DracoFloat32Array_size_0 = C.asm.da).apply(null, arguments)
        },
        ue = C._emscripten_bind_DracoFloat32Array___destroy___0 = function() {
          return (ue = C._emscripten_bind_DracoFloat32Array___destroy___0 = C.asm.ea).apply(null, arguments)
        },
        ye = C._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
          return (ye = C._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = C.asm.fa).apply(null, arguments)
        },
        le = C._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
          return (le = C._emscripten_bind_DracoInt8Array_GetValue_1 = C.asm.ga).apply(null, arguments)
        },
        fe = C._emscripten_bind_DracoInt8Array_size_0 = function() {
          return (fe = C._emscripten_bind_DracoInt8Array_size_0 = C.asm.ha).apply(null, arguments)
        },
        me = C._emscripten_bind_DracoInt8Array___destroy___0 = function() {
          return (me = C._emscripten_bind_DracoInt8Array___destroy___0 = C.asm.ia).apply(null, arguments)
        },
        de = C._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = function() {
          return (de = C._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = C.asm.ja).apply(null, arguments)
        },
        be = C._emscripten_bind_DracoUInt8Array_GetValue_1 = function() {
          return (be = C._emscripten_bind_DracoUInt8Array_GetValue_1 = C.asm.ka).apply(null, arguments)
        },
        he = C._emscripten_bind_DracoUInt8Array_size_0 = function() {
          return (he = C._emscripten_bind_DracoUInt8Array_size_0 = C.asm.la).apply(null, arguments)
        },
        Ae = C._emscripten_bind_DracoUInt8Array___destroy___0 = function() {
          return (Ae = C._emscripten_bind_DracoUInt8Array___destroy___0 = C.asm.ma).apply(null, arguments)
        },
        Te = C._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = function() {
          return (Te = C._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = C.asm.na).apply(null, arguments)
        },
        De = C._emscripten_bind_DracoInt16Array_GetValue_1 = function() {
          return (De = C._emscripten_bind_DracoInt16Array_GetValue_1 = C.asm.oa).apply(null, arguments)
        },
        Ie = C._emscripten_bind_DracoInt16Array_size_0 = function() {
          return (Ie = C._emscripten_bind_DracoInt16Array_size_0 = C.asm.pa).apply(null, arguments)
        },
        je = C._emscripten_bind_DracoInt16Array___destroy___0 = function() {
          return (je = C._emscripten_bind_DracoInt16Array___destroy___0 = C.asm.qa).apply(null, arguments)
        },
        Ee = C._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = function() {
          return (Ee = C._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = C.asm.ra).apply(null, arguments)
        },
        Ge = C._emscripten_bind_DracoUInt16Array_GetValue_1 = function() {
          return (Ge = C._emscripten_bind_DracoUInt16Array_GetValue_1 = C.asm.sa).apply(null, arguments)
        },
        ve = C._emscripten_bind_DracoUInt16Array_size_0 = function() {
          return (ve = C._emscripten_bind_DracoUInt16Array_size_0 = C.asm.ta).apply(null, arguments)
        },
        Oe = C._emscripten_bind_DracoUInt16Array___destroy___0 = function() {
          return (Oe = C._emscripten_bind_DracoUInt16Array___destroy___0 = C.asm.ua).apply(null, arguments)
        },
        Pe = C._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = function() {
          return (Pe = C._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = C.asm.va).apply(null, arguments)
        },
        Re = C._emscripten_bind_DracoInt32Array_GetValue_1 = function() {
          return (Re = C._emscripten_bind_DracoInt32Array_GetValue_1 = C.asm.wa).apply(null, arguments)
        },
        Se = C._emscripten_bind_DracoInt32Array_size_0 = function() {
          return (Se = C._emscripten_bind_DracoInt32Array_size_0 = C.asm.xa).apply(null, arguments)
        },
        Me = C._emscripten_bind_DracoInt32Array___destroy___0 = function() {
          return (Me = C._emscripten_bind_DracoInt32Array___destroy___0 = C.asm.ya).apply(null, arguments)
        },
        Ne = C._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = function() {
          return (Ne = C._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = C.asm.za).apply(null, arguments)
        },
        Ue = C._emscripten_bind_DracoUInt32Array_GetValue_1 = function() {
          return (Ue = C._emscripten_bind_DracoUInt32Array_GetValue_1 = C.asm.Aa).apply(null, arguments)
        },
        ge = C._emscripten_bind_DracoUInt32Array_size_0 = function() {
          return (ge = C._emscripten_bind_DracoUInt32Array_size_0 = C.asm.Ba).apply(null, arguments)
        },
        Fe = C._emscripten_bind_DracoUInt32Array___destroy___0 = function() {
          return (Fe = C._emscripten_bind_DracoUInt32Array___destroy___0 = C.asm.Ca).apply(null, arguments)
        },
        Le = C._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = function() {
          return (Le = C._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = C.asm.Da).apply(null, arguments)
        },
        Ce = C._emscripten_bind_MetadataQuerier_HasEntry_2 = function() {
          return (Ce = C._emscripten_bind_MetadataQuerier_HasEntry_2 = C.asm.Ea).apply(null, arguments)
        },
        $e = C._emscripten_bind_MetadataQuerier_GetIntEntry_2 = function() {
          return ($e = C._emscripten_bind_MetadataQuerier_GetIntEntry_2 = C.asm.Fa).apply(null, arguments)
        },
        we = C._emscripten_bind_MetadataQuerier_GetIntEntryArray_3 = function() {
          return (we = C._emscripten_bind_MetadataQuerier_GetIntEntryArray_3 = C.asm.Ga).apply(null, arguments)
        },
        ze = C._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = function() {
          return (ze = C._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = C.asm.Ha).apply(null, arguments)
        },
        Ve = C._emscripten_bind_MetadataQuerier_GetStringEntry_2 = function() {
          return (Ve = C._emscripten_bind_MetadataQuerier_GetStringEntry_2 = C.asm.Ia).apply(null, arguments)
        },
        Be = C._emscripten_bind_MetadataQuerier_NumEntries_1 = function() {
          return (Be = C._emscripten_bind_MetadataQuerier_NumEntries_1 = C.asm.Ja).apply(null, arguments)
        },
        We = C._emscripten_bind_MetadataQuerier_GetEntryName_2 = function() {
          return (We = C._emscripten_bind_MetadataQuerier_GetEntryName_2 = C.asm.Ka).apply(null, arguments)
        },
        ke = C._emscripten_bind_MetadataQuerier___destroy___0 = function() {
          return (ke = C._emscripten_bind_MetadataQuerier___destroy___0 = C.asm.La).apply(null, arguments)
        },
        xe = C._emscripten_bind_Decoder_Decoder_0 = function() {
          return (xe = C._emscripten_bind_Decoder_Decoder_0 = C.asm.Ma).apply(null, arguments)
        },
        Qe = C._emscripten_bind_Decoder_DecodeArrayToPointCloud_3 = function() {
          return (Qe = C._emscripten_bind_Decoder_DecodeArrayToPointCloud_3 = C.asm.Na).apply(null, arguments)
        },
        Ye = C._emscripten_bind_Decoder_DecodeArrayToMesh_3 = function() {
          return (Ye = C._emscripten_bind_Decoder_DecodeArrayToMesh_3 = C.asm.Oa).apply(null, arguments)
        },
        He = C._emscripten_bind_Decoder_GetAttributeId_2 = function() {
          return (He = C._emscripten_bind_Decoder_GetAttributeId_2 = C.asm.Pa).apply(null, arguments)
        },
        qe = C._emscripten_bind_Decoder_GetAttributeIdByName_2 = function() {
          return (qe = C._emscripten_bind_Decoder_GetAttributeIdByName_2 = C.asm.Qa).apply(null, arguments)
        },
        Xe = C._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = function() {
          return (Xe = C._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = C.asm.Ra).apply(null, arguments)
        },
        Ke = C._emscripten_bind_Decoder_GetAttribute_2 = function() {
          return (Ke = C._emscripten_bind_Decoder_GetAttribute_2 = C.asm.Sa).apply(null, arguments)
        },
        Je = C._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = function() {
          return (Je = C._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = C.asm.Ta).apply(null, arguments)
        },
        Ze = C._emscripten_bind_Decoder_GetMetadata_1 = function() {
          return (Ze = C._emscripten_bind_Decoder_GetMetadata_1 = C.asm.Ua).apply(null, arguments)
        },
        tr = C._emscripten_bind_Decoder_GetAttributeMetadata_2 = function() {
          return (tr = C._emscripten_bind_Decoder_GetAttributeMetadata_2 = C.asm.Va).apply(null, arguments)
        },
        er = C._emscripten_bind_Decoder_GetFaceFromMesh_3 = function() {
          return (er = C._emscripten_bind_Decoder_GetFaceFromMesh_3 = C.asm.Wa).apply(null, arguments)
        },
        rr = C._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = function() {
          return (rr = C._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = C.asm.Xa).apply(null, arguments)
        },
        nr = C._emscripten_bind_Decoder_GetTrianglesUInt16Array_3 = function() {
          return (nr = C._emscripten_bind_Decoder_GetTrianglesUInt16Array_3 = C.asm.Ya).apply(null, arguments)
        },
        or = C._emscripten_bind_Decoder_GetTrianglesUInt32Array_3 = function() {
          return (or = C._emscripten_bind_Decoder_GetTrianglesUInt32Array_3 = C.asm.Za).apply(null, arguments)
        },
        _r = C._emscripten_bind_Decoder_GetAttributeFloat_3 = function() {
          return (_r = C._emscripten_bind_Decoder_GetAttributeFloat_3 = C.asm._a).apply(null, arguments)
        },
        ir = C._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = function() {
          return (ir = C._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = C.asm.$a).apply(null, arguments)
        },
        pr = C._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = function() {
          return (pr = C._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = C.asm.ab).apply(null, arguments)
        },
        ar = C._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = function() {
          return (ar = C._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = C.asm.bb).apply(null, arguments)
        },
        cr = C._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = function() {
          return (cr = C._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = C.asm.cb).apply(null, arguments)
        },
        sr = C._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = function() {
          return (sr = C._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = C.asm.db).apply(null, arguments)
        },
        ur = C._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = function() {
          return (ur = C._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = C.asm.eb).apply(null, arguments)
        },
        yr = C._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = function() {
          return (yr = C._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = C.asm.fb).apply(null, arguments)
        },
        lr = C._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = function() {
          return (lr = C._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = C.asm.gb).apply(null, arguments)
        },
        fr = C._emscripten_bind_Decoder_GetAttributeDataArrayForAllPoints_5 = function() {
          return (fr = C._emscripten_bind_Decoder_GetAttributeDataArrayForAllPoints_5 = C.asm.hb).apply(null, arguments)
        },
        mr = C._emscripten_bind_Decoder_SkipAttributeTransform_1 = function() {
          return (mr = C._emscripten_bind_Decoder_SkipAttributeTransform_1 = C.asm.ib).apply(null, arguments)
        },
        dr = C._emscripten_bind_Decoder_GetEncodedGeometryType_Deprecated_1 = function() {
          return (dr = C._emscripten_bind_Decoder_GetEncodedGeometryType_Deprecated_1 = C.asm.jb).apply(null, arguments)
        },
        br = C._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = function() {
          return (br = C._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = C.asm.kb).apply(null, arguments)
        },
        hr = C._emscripten_bind_Decoder_DecodeBufferToMesh_2 = function() {
          return (hr = C._emscripten_bind_Decoder_DecodeBufferToMesh_2 = C.asm.lb).apply(null, arguments)
        },
        Ar = C._emscripten_bind_Decoder___destroy___0 = function() {
          return (Ar = C._emscripten_bind_Decoder___destroy___0 = C.asm.mb).apply(null, arguments)
        },
        Tr = C._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = function() {
          return (Tr = C._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = C.asm.nb).apply(null, arguments)
        },
        Dr = C._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = function() {
          return (Dr = C._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = C.asm.ob).apply(null, arguments)
        },
        Ir = C._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = function() {
          return (Ir = C._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = C.asm.pb).apply(null, arguments)
        },
        jr = C._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = function() {
          return (jr = C._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = C.asm.qb).apply(null, arguments)
        },
        Er = C._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
          return (Er = C._emscripten_enum_draco_GeometryAttribute_Type_INVALID = C.asm.rb).apply(null, arguments)
        },
        Gr = C._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function() {
          return (Gr = C._emscripten_enum_draco_GeometryAttribute_Type_POSITION = C.asm.sb).apply(null, arguments)
        },
        vr = C._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
          return (vr = C._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = C.asm.tb).apply(null, arguments)
        },
        Or = C._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
          return (Or = C._emscripten_enum_draco_GeometryAttribute_Type_COLOR = C.asm.ub).apply(null, arguments)
        },
        Pr = C._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
          return (Pr = C._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = C.asm.vb).apply(null, arguments)
        },
        Rr = C._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
          return (Rr = C._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = C.asm.wb).apply(null, arguments)
        },
        Sr = C._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
          return (Sr = C._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = C.asm.xb).apply(null, arguments)
        },
        Mr = C._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
          return (Mr = C._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = C.asm.yb).apply(null, arguments)
        },
        Nr = C._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
          return (Nr = C._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = C.asm.zb).apply(null, arguments)
        },
        Ur = C._emscripten_enum_draco_DataType_DT_INVALID = function() {
          return (Ur = C._emscripten_enum_draco_DataType_DT_INVALID = C.asm.Ab).apply(null, arguments)
        },
        gr = C._emscripten_enum_draco_DataType_DT_INT8 = function() {
          return (gr = C._emscripten_enum_draco_DataType_DT_INT8 = C.asm.Bb).apply(null, arguments)
        },
        Fr = C._emscripten_enum_draco_DataType_DT_UINT8 = function() {
          return (Fr = C._emscripten_enum_draco_DataType_DT_UINT8 = C.asm.Cb).apply(null, arguments)
        },
        Lr = C._emscripten_enum_draco_DataType_DT_INT16 = function() {
          return (Lr = C._emscripten_enum_draco_DataType_DT_INT16 = C.asm.Db).apply(null, arguments)
        },
        Cr = C._emscripten_enum_draco_DataType_DT_UINT16 = function() {
          return (Cr = C._emscripten_enum_draco_DataType_DT_UINT16 = C.asm.Eb).apply(null, arguments)
        },
        $r = C._emscripten_enum_draco_DataType_DT_INT32 = function() {
          return ($r = C._emscripten_enum_draco_DataType_DT_INT32 = C.asm.Fb).apply(null, arguments)
        },
        wr = C._emscripten_enum_draco_DataType_DT_UINT32 = function() {
          return (wr = C._emscripten_enum_draco_DataType_DT_UINT32 = C.asm.Gb).apply(null, arguments)
        },
        zr = C._emscripten_enum_draco_DataType_DT_INT64 = function() {
          return (zr = C._emscripten_enum_draco_DataType_DT_INT64 = C.asm.Hb).apply(null, arguments)
        },
        Vr = C._emscripten_enum_draco_DataType_DT_UINT64 = function() {
          return (Vr = C._emscripten_enum_draco_DataType_DT_UINT64 = C.asm.Ib).apply(null, arguments)
        },
        Br = C._emscripten_enum_draco_DataType_DT_FLOAT32 = function() {
          return (Br = C._emscripten_enum_draco_DataType_DT_FLOAT32 = C.asm.Jb).apply(null, arguments)
        },
        Wr = C._emscripten_enum_draco_DataType_DT_FLOAT64 = function() {
          return (Wr = C._emscripten_enum_draco_DataType_DT_FLOAT64 = C.asm.Kb).apply(null, arguments)
        },
        kr = C._emscripten_enum_draco_DataType_DT_BOOL = function() {
          return (kr = C._emscripten_enum_draco_DataType_DT_BOOL = C.asm.Lb).apply(null, arguments)
        },
        xr = C._emscripten_enum_draco_DataType_DT_TYPES_COUNT = function() {
          return (xr = C._emscripten_enum_draco_DataType_DT_TYPES_COUNT = C.asm.Mb).apply(null, arguments)
        },
        Qr = C._emscripten_enum_draco_StatusCode_OK = function() {
          return (Qr = C._emscripten_enum_draco_StatusCode_OK = C.asm.Nb).apply(null, arguments)
        },
        Yr = C._emscripten_enum_draco_StatusCode_DRACO_ERROR = function() {
          return (Yr = C._emscripten_enum_draco_StatusCode_DRACO_ERROR = C.asm.Ob).apply(null, arguments)
        },
        Hr = C._emscripten_enum_draco_StatusCode_IO_ERROR = function() {
          return (Hr = C._emscripten_enum_draco_StatusCode_IO_ERROR = C.asm.Pb).apply(null, arguments)
        },
        qr = C._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = function() {
          return (qr = C._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = C.asm.Qb).apply(null, arguments)
        },
        Xr = C._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = function() {
          return (Xr = C._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = C.asm.Rb).apply(null, arguments)
        },
        Kr = C._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = function() {
          return (Kr = C._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = C.asm.Sb).apply(null, arguments)
        };
      C._malloc = function() {
        return (C._malloc = C.asm.Tb).apply(null, arguments)
      }, C._free = function() {
        return (C._free = C.asm.Ub).apply(null, arguments)
      };
      var Jr, Zr = function() {
        return (Zr = C.asm.Vb).apply(null, arguments)
      };
      if (C.___start_em_js = 15856, C.___stop_em_js = 15954, lt = function t() {
          Jr || c(), Jr || (lt = t)
        }, C.preInit)
        for ("function" == typeof C.preInit && (C.preInit = [C.preInit]); 0 < C.preInit.length;) C.preInit.pop()();
      c(), s.prototype = Object.create(s.prototype), s.prototype.constructor = s, s.prototype.__class__ = s, s.__cache__ = {}, C.WrapperObject = s, C.getCache = u, C.wrapPointer = y, C.castObject = function(t, e) {
        return y(t.ptr, e)
      }, C.NULL = y(0), C.destroy = function(t) {
        if (!t.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
        t.__destroy__(), delete u(t.__class__)[t.ptr]
      }, C.compare = function(t, e) {
        return t.ptr === e.ptr
      }, C.getPointer = function(t) {
        return t.ptr
      }, C.getClass = function(t) {
        return t.__class__
      };
      var tn = {
        buffer: 0,
        size: 0,
        pos: 0,
        temps: [],
        needed: 0,
        prepare: function() {
          if (tn.needed) {
            for (var t = 0; t < tn.temps.length; t++) C._free(tn.temps[t]);
            tn.temps.length = 0, C._free(tn.buffer), tn.buffer = 0, tn.size += tn.needed, tn.needed = 0
          }
          tn.buffer || (tn.size += 128, tn.buffer = C._malloc(tn.size), tn.buffer || _(void 0)), tn.pos = 0
        },
        alloc: function(t, e) {
          return tn.buffer || _(void 0), t = (t = t.length * e.BYTES_PER_ELEMENT) + 7 & -8, tn.pos + t >= tn.size ? (0 < t || _(void 0), tn.needed += t, e = C._malloc(t), tn.temps.push(e)) : (e = tn.buffer + tn.pos, tn.pos += t), e
        },
        copy: function(t, e, r) {
          switch (r >>>= 0, e.BYTES_PER_ELEMENT) {
            case 2:
              r >>>= 1;
              break;
            case 4:
              r >>>= 2;
              break;
            case 8:
              r >>>= 3
          }
          for (var n = 0; n < t.length; n++) e[r + n] = t[n]
        }
      };
      return m.prototype = Object.create(s.prototype), m.prototype.constructor = m, m.prototype.__class__ = m, m.__cache__ = {}, C.VoidPtr = m, m.prototype.__destroy__ = m.prototype.__destroy__ = function() {
          bt(this.ptr)
        }, d.prototype = Object.create(s.prototype), d.prototype.constructor = d, d.prototype.__class__ = d, d.__cache__ = {}, C.DecoderBuffer = d, d.prototype.Init = d.prototype.Init = function(t, e) {
          var r = this.ptr;
          tn.prepare(), "object" == typeof t && (t = f(t)), e && "object" == typeof e && (e = e.ptr), At(r, t, e)
        }, d.prototype.__destroy__ = d.prototype.__destroy__ = function() {
          Tt(this.ptr)
        }, b.prototype = Object.create(s.prototype), b.prototype.constructor = b, b.prototype.__class__ = b, b.__cache__ = {}, C.AttributeTransformData = b, b.prototype.transform_type = b.prototype.transform_type = function() {
          return It(this.ptr)
        }, b.prototype.__destroy__ = b.prototype.__destroy__ = function() {
          jt(this.ptr)
        }, h.prototype = Object.create(s.prototype), h.prototype.constructor = h, h.prototype.__class__ = h, h.__cache__ = {}, C.GeometryAttribute = h, h.prototype.__destroy__ = h.prototype.__destroy__ = function() {
          Gt(this.ptr)
        }, A.prototype = Object.create(s.prototype), A.prototype.constructor = A, A.prototype.__class__ = A, A.__cache__ = {}, C.PointAttribute = A, A.prototype.size = A.prototype.size = function() {
          return Ot(this.ptr)
        }, A.prototype.GetAttributeTransformData = A.prototype.GetAttributeTransformData = function() {
          return y(Pt(this.ptr), b)
        }, A.prototype.attribute_type = A.prototype.attribute_type = function() {
          return Rt(this.ptr)
        }, A.prototype.data_type = A.prototype.data_type = function() {
          return St(this.ptr)
        }, A.prototype.num_components = A.prototype.num_components = function() {
          return Mt(this.ptr)
        }, A.prototype.normalized = A.prototype.normalized = function() {
          return !!Nt(this.ptr)
        }, A.prototype.byte_stride = A.prototype.byte_stride = function() {
          return Ut(this.ptr)
        }, A.prototype.byte_offset = A.prototype.byte_offset = function() {
          return gt(this.ptr)
        }, A.prototype.unique_id = A.prototype.unique_id = function() {
          return Ft(this.ptr)
        }, A.prototype.__destroy__ = A.prototype.__destroy__ = function() {
          Lt(this.ptr)
        }, T.prototype = Object.create(s.prototype), T.prototype.constructor = T, T.prototype.__class__ = T, T.__cache__ = {}, C.AttributeQuantizationTransform = T, T.prototype.InitFromAttribute = T.prototype.InitFromAttribute = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), !!$t(e, t)
        }, T.prototype.quantization_bits = T.prototype.quantization_bits = function() {
          return wt(this.ptr)
        }, T.prototype.min_value = T.prototype.min_value = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), zt(e, t)
        }, T.prototype.range = T.prototype.range = function() {
          return Vt(this.ptr)
        }, T.prototype.__destroy__ = T.prototype.__destroy__ = function() {
          Bt(this.ptr)
        }, D.prototype = Object.create(s.prototype), D.prototype.constructor = D, D.prototype.__class__ = D, D.__cache__ = {}, C.AttributeOctahedronTransform = D, D.prototype.InitFromAttribute = D.prototype.InitFromAttribute = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), !!kt(e, t)
        }, D.prototype.quantization_bits = D.prototype.quantization_bits = function() {
          return xt(this.ptr)
        }, D.prototype.__destroy__ = D.prototype.__destroy__ = function() {
          Qt(this.ptr)
        }, I.prototype = Object.create(s.prototype), I.prototype.constructor = I, I.prototype.__class__ = I, I.__cache__ = {}, C.PointCloud = I, I.prototype.num_attributes = I.prototype.num_attributes = function() {
          return Ht(this.ptr)
        }, I.prototype.num_points = I.prototype.num_points = function() {
          return qt(this.ptr)
        }, I.prototype.__destroy__ = I.prototype.__destroy__ = function() {
          Xt(this.ptr)
        }, j.prototype = Object.create(s.prototype), j.prototype.constructor = j, j.prototype.__class__ = j, j.__cache__ = {}, C.Mesh = j, j.prototype.num_faces = j.prototype.num_faces = function() {
          return Jt(this.ptr)
        }, j.prototype.num_attributes = j.prototype.num_attributes = function() {
          return Zt(this.ptr)
        }, j.prototype.num_points = j.prototype.num_points = function() {
          return te(this.ptr)
        }, j.prototype.__destroy__ = j.prototype.__destroy__ = function() {
          ee(this.ptr)
        }, E.prototype = Object.create(s.prototype), E.prototype.constructor = E, E.prototype.__class__ = E, E.__cache__ = {}, C.Metadata = E, E.prototype.__destroy__ = E.prototype.__destroy__ = function() {
          ne(this.ptr)
        }, G.prototype = Object.create(s.prototype), G.prototype.constructor = G, G.prototype.__class__ = G, G.__cache__ = {}, C.Status = G, G.prototype.code = G.prototype.code = function() {
          return oe(this.ptr)
        }, G.prototype.ok = G.prototype.ok = function() {
          return !!_e(this.ptr)
        }, G.prototype.error_msg = G.prototype.error_msg = function() {
          return n(ie(this.ptr))
        }, G.prototype.__destroy__ = G.prototype.__destroy__ = function() {
          pe(this.ptr)
        }, v.prototype = Object.create(s.prototype), v.prototype.constructor = v, v.prototype.__class__ = v, v.__cache__ = {}, C.DracoFloat32Array = v, v.prototype.GetValue = v.prototype.GetValue = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), ce(e, t)
        }, v.prototype.size = v.prototype.size = function() {
          return se(this.ptr)
        }, v.prototype.__destroy__ = v.prototype.__destroy__ = function() {
          ue(this.ptr)
        }, O.prototype = Object.create(s.prototype), O.prototype.constructor = O, O.prototype.__class__ = O, O.__cache__ = {}, C.DracoInt8Array = O, O.prototype.GetValue = O.prototype.GetValue = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), le(e, t)
        }, O.prototype.size = O.prototype.size = function() {
          return fe(this.ptr)
        }, O.prototype.__destroy__ = O.prototype.__destroy__ = function() {
          me(this.ptr)
        }, P.prototype = Object.create(s.prototype), P.prototype.constructor = P, P.prototype.__class__ = P, P.__cache__ = {}, C.DracoUInt8Array = P, P.prototype.GetValue = P.prototype.GetValue = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), be(e, t)
        }, P.prototype.size = P.prototype.size = function() {
          return he(this.ptr)
        }, P.prototype.__destroy__ = P.prototype.__destroy__ = function() {
          Ae(this.ptr)
        }, R.prototype = Object.create(s.prototype), R.prototype.constructor = R, R.prototype.__class__ = R, R.__cache__ = {}, C.DracoInt16Array = R, R.prototype.GetValue = R.prototype.GetValue = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), De(e, t)
        }, R.prototype.size = R.prototype.size = function() {
          return Ie(this.ptr)
        }, R.prototype.__destroy__ = R.prototype.__destroy__ = function() {
          je(this.ptr)
        }, S.prototype = Object.create(s.prototype), S.prototype.constructor = S, S.prototype.__class__ = S, S.__cache__ = {}, C.DracoUInt16Array = S, S.prototype.GetValue = S.prototype.GetValue = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), Ge(e, t)
        }, S.prototype.size = S.prototype.size = function() {
          return ve(this.ptr)
        }, S.prototype.__destroy__ = S.prototype.__destroy__ = function() {
          Oe(this.ptr)
        }, M.prototype = Object.create(s.prototype), M.prototype.constructor = M, M.prototype.__class__ = M, M.__cache__ = {}, C.DracoInt32Array = M, M.prototype.GetValue = M.prototype.GetValue = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), Re(e, t)
        }, M.prototype.size = M.prototype.size = function() {
          return Se(this.ptr)
        }, M.prototype.__destroy__ = M.prototype.__destroy__ = function() {
          Me(this.ptr)
        }, N.prototype = Object.create(s.prototype), N.prototype.constructor = N, N.prototype.__class__ = N, N.__cache__ = {}, C.DracoUInt32Array = N, N.prototype.GetValue = N.prototype.GetValue = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), Ue(e, t)
        }, N.prototype.size = N.prototype.size = function() {
          return ge(this.ptr)
        }, N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
          Fe(this.ptr)
        }, U.prototype = Object.create(s.prototype), U.prototype.constructor = U, U.prototype.__class__ = U, U.__cache__ = {}, C.MetadataQuerier = U, U.prototype.HasEntry = U.prototype.HasEntry = function(t, e) {
          var r = this.ptr;
          return tn.prepare(), t && "object" == typeof t && (t = t.ptr), e = e && "object" == typeof e ? e.ptr : l(e), !!Ce(r, t, e)
        }, U.prototype.GetIntEntry = U.prototype.GetIntEntry = function(t, e) {
          var r = this.ptr;
          return tn.prepare(), t && "object" == typeof t && (t = t.ptr), e = e && "object" == typeof e ? e.ptr : l(e), $e(r, t, e)
        }, U.prototype.GetIntEntryArray = U.prototype.GetIntEntryArray = function(t, e, r) {
          var n = this.ptr;
          tn.prepare(), t && "object" == typeof t && (t = t.ptr), e = e && "object" == typeof e ? e.ptr : l(e), r && "object" == typeof r && (r = r.ptr), we(n, t, e, r)
        }, U.prototype.GetDoubleEntry = U.prototype.GetDoubleEntry = function(t, e) {
          var r = this.ptr;
          return tn.prepare(), t && "object" == typeof t && (t = t.ptr), e = e && "object" == typeof e ? e.ptr : l(e), ze(r, t, e)
        }, U.prototype.GetStringEntry = U.prototype.GetStringEntry = function(t, e) {
          var r = this.ptr;
          return tn.prepare(), t && "object" == typeof t && (t = t.ptr), e = e && "object" == typeof e ? e.ptr : l(e), n(Ve(r, t, e))
        }, U.prototype.NumEntries = U.prototype.NumEntries = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), Be(e, t)
        }, U.prototype.GetEntryName = U.prototype.GetEntryName = function(t, e) {
          var r = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), n(We(r, t, e))
        }, U.prototype.__destroy__ = U.prototype.__destroy__ = function() {
          ke(this.ptr)
        }, g.prototype = Object.create(s.prototype), g.prototype.constructor = g, g.prototype.__class__ = g, g.__cache__ = {}, C.Decoder = g, g.prototype.DecodeArrayToPointCloud = g.prototype.DecodeArrayToPointCloud = function(t, e, r) {
          var n = this.ptr;
          return tn.prepare(), "object" == typeof t && (t = f(t)), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), y(Qe(n, t, e, r), G)
        }, g.prototype.DecodeArrayToMesh = g.prototype.DecodeArrayToMesh = function(t, e, r) {
          var n = this.ptr;
          return tn.prepare(), "object" == typeof t && (t = f(t)), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), y(Ye(n, t, e, r), G)
        }, g.prototype.GetAttributeId = g.prototype.GetAttributeId = function(t, e) {
          var r = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), He(r, t, e)
        }, g.prototype.GetAttributeIdByName = g.prototype.GetAttributeIdByName = function(t, e) {
          var r = this.ptr;
          return tn.prepare(), t && "object" == typeof t && (t = t.ptr), e = e && "object" == typeof e ? e.ptr : l(e), qe(r, t, e)
        }, g.prototype.GetAttributeIdByMetadataEntry = g.prototype.GetAttributeIdByMetadataEntry = function(t, e, r) {
          var n = this.ptr;
          return tn.prepare(), t && "object" == typeof t && (t = t.ptr), e = e && "object" == typeof e ? e.ptr : l(e), r = r && "object" == typeof r ? r.ptr : l(r), Xe(n, t, e, r)
        }, g.prototype.GetAttribute = g.prototype.GetAttribute = function(t, e) {
          var r = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), y(Ke(r, t, e), A)
        }, g.prototype.GetAttributeByUniqueId = g.prototype.GetAttributeByUniqueId = function(t, e) {
          var r = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), y(Je(r, t, e), A)
        }, g.prototype.GetMetadata = g.prototype.GetMetadata = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), y(Ze(e, t), E)
        }, g.prototype.GetAttributeMetadata = g.prototype.GetAttributeMetadata = function(t, e) {
          var r = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), y(tr(r, t, e), E)
        }, g.prototype.GetFaceFromMesh = g.prototype.GetFaceFromMesh = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!er(n, t, e, r)
        }, g.prototype.GetTriangleStripsFromMesh = g.prototype.GetTriangleStripsFromMesh = function(t, e) {
          var r = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), rr(r, t, e)
        }, g.prototype.GetTrianglesUInt16Array = g.prototype.GetTrianglesUInt16Array = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!nr(n, t, e, r)
        }, g.prototype.GetTrianglesUInt32Array = g.prototype.GetTrianglesUInt32Array = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!or(n, t, e, r)
        }, g.prototype.GetAttributeFloat = g.prototype.GetAttributeFloat = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!_r(n, t, e, r)
        }, g.prototype.GetAttributeFloatForAllPoints = g.prototype.GetAttributeFloatForAllPoints = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!ir(n, t, e, r)
        }, g.prototype.GetAttributeIntForAllPoints = g.prototype.GetAttributeIntForAllPoints = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!pr(n, t, e, r)
        }, g.prototype.GetAttributeInt8ForAllPoints = g.prototype.GetAttributeInt8ForAllPoints = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!ar(n, t, e, r)
        }, g.prototype.GetAttributeUInt8ForAllPoints = g.prototype.GetAttributeUInt8ForAllPoints = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!cr(n, t, e, r)
        }, g.prototype.GetAttributeInt16ForAllPoints = g.prototype.GetAttributeInt16ForAllPoints = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!sr(n, t, e, r)
        }, g.prototype.GetAttributeUInt16ForAllPoints = g.prototype.GetAttributeUInt16ForAllPoints = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!ur(n, t, e, r)
        }, g.prototype.GetAttributeInt32ForAllPoints = g.prototype.GetAttributeInt32ForAllPoints = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!yr(n, t, e, r)
        }, g.prototype.GetAttributeUInt32ForAllPoints = g.prototype.GetAttributeUInt32ForAllPoints = function(t, e, r) {
          var n = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), !!lr(n, t, e, r)
        }, g.prototype.GetAttributeDataArrayForAllPoints = g.prototype.GetAttributeDataArrayForAllPoints = function(t, e, r, n, o) {
          var _ = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), r && "object" == typeof r && (r = r.ptr), n && "object" == typeof n && (n = n.ptr), o && "object" == typeof o && (o = o.ptr), !!fr(_, t, e, r, n, o)
        }, g.prototype.SkipAttributeTransform = g.prototype.SkipAttributeTransform = function(t) {
          var e = this.ptr;
          t && "object" == typeof t && (t = t.ptr), mr(e, t)
        }, g.prototype.GetEncodedGeometryType_Deprecated = g.prototype.GetEncodedGeometryType_Deprecated = function(t) {
          var e = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), dr(e, t)
        }, g.prototype.DecodeBufferToPointCloud = g.prototype.DecodeBufferToPointCloud = function(t, e) {
          var r = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), y(br(r, t, e), G)
        }, g.prototype.DecodeBufferToMesh = g.prototype.DecodeBufferToMesh = function(t, e) {
          var r = this.ptr;
          return t && "object" == typeof t && (t = t.ptr), e && "object" == typeof e && (e = e.ptr), y(hr(r, t, e), G)
        }, g.prototype.__destroy__ = g.prototype.__destroy__ = function() {
          Ar(this.ptr)
        },
        function() {
          function t() {
            C.ATTRIBUTE_INVALID_TRANSFORM = Tr(), C.ATTRIBUTE_NO_TRANSFORM = Dr(), C.ATTRIBUTE_QUANTIZATION_TRANSFORM = Ir(), C.ATTRIBUTE_OCTAHEDRON_TRANSFORM = jr(), C.INVALID = Er(), C.POSITION = Gr(), C.NORMAL = vr(), C.COLOR = Or(), C.TEX_COORD = Pr(), C.GENERIC = Rr(), C.INVALID_GEOMETRY_TYPE = Sr(), C.POINT_CLOUD = Mr(), C.TRIANGULAR_MESH = Nr(), C.DT_INVALID = Ur(), C.DT_INT8 = gr(), C.DT_UINT8 = Fr(), C.DT_INT16 = Lr(), C.DT_UINT16 = Cr(), C.DT_INT32 = $r(), C.DT_UINT32 = wr(), C.DT_INT64 = zr(), C.DT_UINT64 = Vr(), C.DT_FLOAT32 = Br(), C.DT_FLOAT64 = Wr(), C.DT_BOOL = kr(), C.DT_TYPES_COUNT = xr(), C.OK = Qr(), C.DRACO_ERROR = Yr(), C.IO_ERROR = Hr(), C.INVALID_PARAMETER = qr(), C.UNSUPPORTED_VERSION = Xr(), C.UNKNOWN_VERSION = Kr()
          }
          st ? t() : at.unshift(t)
        }(), "function" == typeof C.onModuleParsed && C.onModuleParsed(), C.Decoder.prototype.GetEncodedGeometryType = function(t) {
          if (t.__class__ && t.__class__ === C.DecoderBuffer) return C.Decoder.prototype.GetEncodedGeometryType_Deprecated(t);
          if (8 > t.byteLength) return C.INVALID_GEOMETRY_TYPE;
          switch (t[7]) {
            case 0:
              return C.POINT_CLOUD;
            case 1:
              return C.TRIANGULAR_MESH;
            default:
              return C.INVALID_GEOMETRY_TYPE
          }
        }, e.ready
    }
}();
"object" == typeof exports && "object" == typeof module ? module.exports = DracoDecoderModule : "function" == typeof define && define.amd ? define([], (function() {
  return DracoDecoderModule
})) : "object" == typeof exports && (exports.DracoDecoderModule = DracoDecoderModule);