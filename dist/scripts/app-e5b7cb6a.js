"use strict";
function data(e, t, i) {
  return {label: e, menu: !1, order: 10, parent: i, icon: t}
}
angular.module("db", ["pouchdb", "utility"]), angular.module("db").service("pouchDBbService", ["pouchdb", function () {
}]), angular.module("db").service("pouchdb", ["config", "pouchDB", "$rootScope", "$window", function (e, t, i, a) {
  function r() {
    return a.openDatabase
  }
  
  var s = this, n = e.db || "vmsClient", l = {auto_compaction: !0};
  l.adapter = r() ? "websql" : "idb";
  var o = t(n, l);
  s.addTimeInfo = function (e) {
    var t = (new Date).toJSON();
    return e.createdOn || (e.createdOn = t), e.modifiedOn = t, e
  }, s.save = function (e) {
    function t(e) {
      return e._id ? s.update(e).catch(function () {
        return o.put(e).then(function (t) {
          return e._id = t.id, e._rev = t.rev, e
        })
      }) : s.insert(e)
    }
    
    return e = s.addTimeInfo(e), t(e)
  }, s.get = function (e) {
    return o.get(e)
  }, s.delete = function (e) {
    return o.get(e._id).then(function (e) {
      return o.remove(e)
    })
  }, s.insert = function (e) {
    return e = s.addTimeInfo(e), o.post(e).then(function (t) {
      return e._id = t.id, e._rev = t.rev, e
    })
  }, s.insertWithId = function (e, t) {
    return e = s.addTimeInfo(e), o.put(e, t)
  }, s.update = function (e) {
    return e = s.addTimeInfo(e), o.get(e._id).then(function (t) {
      return e._rev = t._rev, o.put(e, e._id).then(function (t) {
        return e._id = t.id, e._rev = t.rev, e
      })
    })
  }, s.getView = function (e, t) {
    return o.query(e, t)
  }, s.saveDocs = function (e, t) {
    var i = {all_or_nothing: !0};
    return t && (i = t), o.bulkDocs(e, i)
  }
}]), angular.module("db").service("couchDBService", function () {
}), angular.module("db").service("apiService", ["$http", "configService", "$cookies", "log", "$q", "utility", function (e, t, i, a, r, s) {
  function n(e) {
    var t = "";
    if (e && !s.isEmptyObject(e)) {
      var i = [];
      for (var a in e)e.hasOwnProperty(a) && i.push([a, e[a]].join("="));
      i.length > 0 && (t = ["?", i.join("&")].join(""))
    }
    return t
  }
  
  function l(e) {
    var t = {Authorization: ["Token", i.getObject("vi-token")].join(" ")};
    return angular.isDefined(e) && "login" === e && delete t.Authorization, {timeout: 9e3, headers: t}
  }
  
  var o = t.api.url, d = this;
  this.put = function (t, i) {
    var s = r.defer(), n = [o, t, i._id].join("/");
    return e.put(n, i, l()).then(function (e) {
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), s.resolve(t)
    }, function (e) {
      (-1 === e.status || 0 === e.status) && a.error("serverNotAvailable");
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), s.reject(t)
    }), s.promise
  }, d.post = function (t, i) {
    var s = r.defer();
    return e.post([o, t].join("/"), i, l(t)).then(function (e) {
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), s.resolve(t)
    }, function (e) {
      (-1 === e.status || 0 === e.status) && a.error("serverNotAvailable");
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), s.reject(t)
    }), s.promise
  }, d.all = function (t, i) {
    i = i || {};
    var s = r.defer();
    return e.get([[o, t].join("/"), n(i)].join(""), l()).then(function (e) {
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), s.resolve(t)
    }, function (e) {
      (-1 === e.status || 0 === e.status) && a.error("serverNotAvailable");
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), s.reject(t)
    }), s.promise
  }, d.get = function (t, i, s) {
    s = s || {};
    var d = r.defer();
    return e.get([[o, t, i].join("/"), n(s)].join(""), l()).then(function (e) {
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), d.resolve(t)
    }, function (e) {
      (-1 === e.status || 0 === e.status) && a.error("serverNotAvailable");
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), d.reject(t)
    }), d.promise
  }, d.remove = function (t, i, s) {
    var d = r.defer();
    return e.delete([[o, t, i].join("/"), n(s)].join(""), l()).then(function (e) {
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), d.resolve(t)
    }, function (e) {
      (-1 === e.status || 0 === e.status) && a.error("serverNotAvailable");
      var t = e;
      e.hasOwnProperty("data") && (t = e.data), d.reject(t)
    }), d.promise
  }
}]), function (e) {
  e.fn.aceWizard = e.fn.ace_wizard = function (t) {
    return this.each(function () {
      var i = e(this);
      i.wizard(), ace.vars.old_ie && i.find("ul.steps > li").last().addClass("last-child");
      var a = t && t.buttons ? e(t.buttons) : i.siblings(".wizard-actions").eq(0), r = i.data("fu.wizard");
      r.$prevBtn.remove(), r.$nextBtn.remove(), r.$prevBtn = a.find(".btn-prev").eq(0).on(ace.click_event, function () {
        r.previous()
      }).attr("disabled", "disabled"), r.$nextBtn = a.find(".btn-next").eq(0).on(ace.click_event, function () {
        r.next()
      }).removeAttr("disabled"), r.nextText = r.$nextBtn.text();
      var s = t && (t.selectedItem && t.selectedItem.step || t.step);
      s && (r.currentStep = s, r.setState())
    }), this
  }
}(window.jQuery), function (e, t) {
  var i = function (i, a) {
    function r(e) {
      e.preventDefault(), e.stopPropagation();
      var t = k.offset(), i = t[v], a = y ? e.pageY : e.pageX;
      a > i + D ? (D = a - i - B + T, D > N && (D = N)) : (D = a - i - T, 0 > D && (D = 0)), m.update_scroll()
    }
    
    function s(t) {
      t.preventDefault(), t.stopPropagation(), it = tt = y ? t.pageY : t.pageX, G = !0, e("html").off("mousemove.ace_scroll").on("mousemove.ace_scroll", n), e(L).off("mouseup.ace_scroll").on("mouseup.ace_scroll", l), k.addClass("active"), R && m.$element.trigger("drag.start")
    }
    
    function n(e) {
      e.preventDefault(), e.stopPropagation(), it = y ? e.pageY : e.pageX, it - tt + D > N ? it = tt + N - D : 0 > it - tt + D && (it = tt - D), D += it - tt, tt = it, 0 > D ? D = 0 : D > N && (D = N), m.update_scroll()
    }
    
    function l(t) {
      t.preventDefault(), t.stopPropagation(), G = !1, e("html").off(".ace_scroll"), e(L).off(".ace_scroll"), k.removeClass("active"), R && m.$element.trigger("drag.end"), x && J && !K && d()
    }
    
    function o(e) {
      var t = +new Date;
      if (Q && t - rt > 1e3) {
        var i = M[C];
        X != i && (X = i, et = !0, m.reset(!0)), rt = t
      }
      x && J && (null != at && (clearTimeout(at), at = null), k.addClass("not-idle"), K || 1 != e || d())
    }
    
    function d() {
      null != at && (clearTimeout(at), at = null), at = setTimeout(function () {
        at = null, k.removeClass("not-idle")
      }, Z)
    }
    
    function c() {
      k.css("visibility", "hidden").addClass("scroll-hover"), j = y ? parseInt(k.outerWidth()) || 0 : parseInt(k.outerHeight()) || 0, k.css("visibility", "").removeClass("scroll-hover")
    }
    
    function p() {
      if (Y !== !1) {
        var e = S.offset(), t = e.left, i = e.top;
        y ? z || (t += S.outerWidth() - j) : z || (i += S.outerHeight() - j), Y === !0 ? k.css({
          top: parseInt(i),
          left: parseInt(t)
        }) : "left" === Y ? k.css("left", parseInt(t)) : "top" === Y && k.css("top", parseInt(i))
      }
    }
    
    var m = this, u = ace.helper.getAttrSettings(i, e.fn.ace_scroll.defaults), f = e.extend({}, e.fn.ace_scroll.defaults, a, u);
    this.size = 0, this.lock = !1, this.lock_anyway = !1, this.$element = e(i), this.element = i;
    var v, g, h, b, w, C, y = !0, _ = !1, x = !1, P = !1, S = null, M = null, k = null, A = null, E = null, $ = null, I = null, B = 0, D = 0, N = 0, T = 0, U = !0, O = !1, q = "", z = !1, j = 0, F = 1, V = !1, G = !1, L = "onmouseup" in window ? window : "html", R = f.dragEvent || !1, H = a.scrollEvent || !1, W = f.detached || !1, Y = f.updatePos || !1, J = f.hideOnIdle || !1, Z = f.hideDelay || 1500, K = !1, Q = f.observeContent || !1, X = 0, et = !0;
    this.create = function (t) {
      if (!P) {
        t && (f = e.extend({}, e.fn.ace_scroll.defaults, t)), this.size = parseInt(this.$element.attr("data-size")) || f.size || 200, y = !f.horizontal, v = y ? "top" : "left", g = y ? "height" : "width", h = y ? "maxHeight" : "maxWidth", b = y ? "clientHeight" : "clientWidth", w = y ? "scrollTop" : "scrollLeft", C = y ? "scrollHeight" : "scrollWidth", this.$element.addClass("ace-scroll"), "static" == this.$element.css("position") ? (V = this.element.style.position, this.element.style.position = "relative") : V = !1;
        var i = null;
        W ? i = e('<div class="scroll-track scroll-detached"><div class="scroll-bar"></div></div>').appendTo("body") : (this.$element.wrapInner('<div class="scroll-content" />'), this.$element.prepend('<div class="scroll-track"><div class="scroll-bar"></div></div>')), S = this.$element, W || (S = this.$element.find(".scroll-content").eq(0)), y || S.wrapInner("<div />"), M = S.get(0), W ? (k = i, p()) : k = this.$element.find(".scroll-track").eq(0), A = k.find(".scroll-bar").eq(0), E = k.get(0), $ = A.get(0), I = $.style, y || k.addClass("scroll-hz"), f.styleClass && (q = f.styleClass, k.addClass(q), z = !!q.match(/scroll\-left|scroll\-top/)), 0 == j && (k.show(), c()), k.hide(), k.on("mousedown", r), A.on("mousedown", s), S.on("scroll", function () {
          U && (D = parseInt(Math.round(this[w] * F)), I[v] = D + "px"), U = !1, H && this.$element.trigger("scroll", [M])
        }), f.mouseWheel && (this.lock = f.mouseWheelLock, this.lock_anyway = f.lockAnyway, this.$element.on(e.event.special.mousewheel ? "mousewheel.ace_scroll" : "mousewheel.ace_scroll DOMMouseScroll.ace_scroll", function (t) {
          if (!_) {
            if (o(!0), !x)return !m.lock_anyway;
            G && (G = !1, e("html").off(".ace_scroll"), e(L).off(".ace_scroll"), R && m.$element.trigger("drag.end")), t.deltaY = t.deltaY || 0;
            var i = t.deltaY > 0 || t.originalEvent.detail < 0 || t.originalEvent.wheelDelta > 0 ? 1 : -1, a = !1, r = M[b], s = M[w];
            m.lock || (a = -1 == i ? M[C] <= s + r : 0 == s), m.move_bar(!0);
            var n = parseInt(r / 8);
            return 80 > n && (n = 80), n > m.size && (n = m.size), n += 1, M[w] = s - i * n, a && !m.lock_anyway
          }
        }));
        var a = ace.vars.touch && "ace_drag" in e.event.special && f.touchDrag;
        if (a) {
          var n = "", l = a ? "ace_drag" : "swipe";
          this.$element.on(l + ".ace_scroll", function (e) {
            if (_)return void(e.retval.cancel = !0);
            if (o(!0), !x)return void(e.retval.cancel = this.lock_anyway);
            if (n = e.direction, y && ("up" == n || "down" == n) || !y && ("left" == n || "right" == n)) {
              var t = y ? e.dy : e.dx;
              0 != t && (Math.abs(t) > 20 && a && (t = 2 * t), m.move_bar(!0), M[w] = M[w] + t)
            }
          })
        }
        J && k.addClass("idle-hide"), Q && k.on("mouseenter.ace_scroll", function () {
          K = !0, o(!1)
        }).on("mouseleave.ace_scroll", function () {
          K = !1, 0 == G && d()
        }), this.$element.on("mouseenter.ace_scroll touchstart.ace_scroll", function () {
          et = !0, Q ? o(!0) : f.hoverReset && m.reset(!0), k.addClass("scroll-hover")
        }).on("mouseleave.ace_scroll touchend.ace_scroll", function () {
          k.removeClass("scroll-hover")
        }), y || S.children(0).css(g, this.size), S.css(h, this.size), _ = !1, P = !0
      }
    }, this.is_active = function () {
      return x
    }, this.is_enabled = function () {
      return !_
    }, this.move_bar = function (e) {
      U = e
    }, this.get_track = function () {
      return E
    }, this.reset = function (e) {
      if (!_) {
        P || this.create();
        var t = this.size;
        if (!e || et) {
          if (et = !1, W) {
            var i = parseInt(Math.round((parseInt(S.css("border-top-width")) + parseInt(S.css("border-bottom-width"))) / 2.5));
            t -= i
          }
          var a = y ? M[C] : t;
          if (y && 0 == a || !y && 0 == this.element.scrollWidth)return void k.removeClass("scroll-active");
          var r = y ? t : M.clientWidth;
          y || S.children(0).css(g, t), S.css(h, this.size), a > r ? (x = !0, k.css(g, r).show(), F = parseFloat((r / a).toFixed(5)), B = parseInt(Math.round(r * F)), T = parseInt(Math.round(B / 2)), N = r - B, D = parseInt(Math.round(M[w] * F)), I[g] = B + "px", I[v] = D + "px", k.addClass("scroll-active"), 0 == j && c(), O || (f.reset && (M[w] = 0, I[v] = 0), O = !0), W && p()) : (x = !1, k.hide(), k.removeClass("scroll-active"), S.css(h, ""))
        }
      }
    }, this.disable = function () {
      M[w] = 0, I[v] = 0, _ = !0, x = !1, k.hide(), this.$element.addClass("scroll-disabled"), k.removeClass("scroll-active"), S.css(h, "")
    }, this.enable = function () {
      _ = !1, this.$element.removeClass("scroll-disabled")
    }, this.destroy = function () {
      x = !1, _ = !1, P = !1, this.$element.removeClass("ace-scroll scroll-disabled scroll-active"), this.$element.off(".ace_scroll"), W || (y || S.find("> div").children().unwrap(), S.children().unwrap(), S.remove()), k.remove(), V !== !1 && (this.element.style.position = V), null != at && (clearTimeout(at), at = null)
    }, this.modify = function (t) {
      t && (f = e.extend({}, f, t)), this.destroy(), this.create(), et = !0, this.reset(!0)
    }, this.update = function (i) {
      i && (f = e.extend({}, f, i)), this.size = i.size || this.size, this.lock = i.mouseWheelLock || this.lock, this.lock_anyway = i.lockAnyway || this.lock_anyway, i.styleClass != t && (q && k.removeClass(q), q = i.styleClass, q && k.addClass(q), z = !!q.match(/scroll\-left|scroll\-top/))
    }, this.start = function () {
      M[w] = 0
    }, this.end = function () {
      M[w] = M[C]
    }, this.hide = function () {
      k.hide()
    }, this.show = function () {
      k.show()
    }, this.update_scroll = function () {
      U = !1, I[v] = D + "px", M[w] = parseInt(Math.round(D / F))
    };
    var tt = -1, it = -1, at = null, rt = 0;
    return this.track_size = function () {
      return 0 == j && c(), j
    }, this.create(), et = !0, this.reset(!0), X = M[C], this
  };
  e.fn.ace_scroll = function (a, r) {
    var s, n = this.each(function () {
      var t = e(this), n = t.data("ace_scroll"), l = "object" == typeof a && a;
      n || t.data("ace_scroll", n = new i(this, l)), "string" == typeof a && (s = n[a](r))
    });
    return s === t ? n : s
  }, e.fn.ace_scroll.defaults = {
    size: 200,
    horizontal: !1,
    mouseWheel: !0,
    mouseWheelLock: !1,
    lockAnyway: !1,
    styleClass: !1,
    observeContent: !1,
    hideOnIdle: !1,
    hideDelay: 1500,
    hoverReset: !0,
    reset: !1,
    dragEvent: !1,
    touchDrag: !0,
    touchSwipe: !1,
    scrollEvent: !1,
    detached: !1,
    updatePos: !0
  }
}(window.jQuery), function (e, t) {
  function i(t, i) {
    var r = this, s = e(t), n = "right", l = !1, o = s.hasClass("fade"), d = ace.helper.getAttrSettings(t, e.fn.ace_aside.defaults);
    if (this.settings = e.extend({}, e.fn.ace_aside.defaults, i, d), !this.settings.background || i.scroll_style || d.scroll_style || (this.settings.scroll_style = "scroll-white no-track"), this.container = this.settings.container, this.container)try {
      e(this.container).get(0) == document.body && (this.container = null)
    } catch (c) {
    }
    this.container && (this.settings.backdrop = !1, s.addClass("aside-contained"));
    var p = s.find(".modal-dialog"), m = s.find(".modal-content"), u = 300;
    this.initiate = function () {
      t.className = t.className.replace(/(\s|^)aside\-(right|top|left|bottom)(\s|$)/gi, "$1$3"), n = this.settings.placement, n && (n = e.trim(n.toLowerCase())), n && /right|top|left|bottom/.test(n) || (n = "right"), s.attr("data-placement", n), s.addClass("aside-" + n), /right|left/.test(n) ? (l = !0, s.addClass("aside-vc")) : s.addClass("aside-hz"), this.settings.fixed && s.addClass("aside-fixed"), this.settings.background && s.addClass("aside-dark"), this.settings.offset && s.addClass("navbar-offset"), this.settings.transition || s.addClass("transition-off"), s.addClass("aside-hidden"), this.insideContainer(), p = s.find(".modal-dialog"), m = s.find(".modal-content"), this.settings.body_scroll || s.on("mousewheel.aside DOMMouseScroll.aside touchmove.aside pointermove.aside", function (t) {
        return e.contains(m[0], t.target) ? void 0 : (t.preventDefault(), !1)
      }), 0 == this.settings.backdrop && s.addClass("no-backdrop")
    }, this.show = function () {
      if (0 == this.settings.backdrop)try {
        s.data("bs.modal").$backdrop.remove()
      } catch (t) {
      }
      this.container ? e(this.container).addClass("overflow-hidden") : s.css("position", "fixed"), s.removeClass("aside-hidden")
    }, this.hide = function () {
      this.container && (this.container.addClass("overflow-hidden"), ace.vars.firefox && t.offsetHeight), f(), ace.vars.transition && !o && s.one("bsTransitionEnd", function () {
        s.addClass("aside-hidden"), s.css("position", ""), r.container && r.container.removeClass("overflow-hidden")
      }).emulateTransitionEnd(u)
    }, this.shown = function () {
      if (f(), e("body").removeClass("modal-open").css("padding-right", ""), "invisible" == this.settings.backdrop)try {
        s.data("bs.modal").$backdrop.css("opacity", 0)
      } catch (t) {
      }
      var i = l ? m.height() : p.height();
      ace.vars.touch ? m.addClass("overflow-scroll").css("max-height", i + "px") : m.hasClass("ace-scroll") || m.ace_scroll({
        size: i,
        reset: !0,
        mouseWheelLock: !0,
        lockAnyway: !this.settings.body_scroll,
        styleClass: this.settings.scroll_style,
        observeContent: !0,
        hideOnIdle: !ace.vars.old_ie,
        hideDelay: 1500
      }), a.off("resize.modal.aside").on("resize.modal.aside", function () {
        if (ace.vars.touch)m.css("max-height", (l ? m.height() : p.height()) + "px"); else {
          m.ace_scroll("disable");
          var e = l ? m.height() : p.height();
          m.ace_scroll("update", {size: e}).ace_scroll("enable").ace_scroll("reset")
        }
      }).triggerHandler("resize.modal.aside"), r.container && ace.vars.transition && !o && s.one("bsTransitionEnd", function () {
        r.container.removeClass("overflow-hidden")
      }).emulateTransitionEnd(u)
    }, this.hidden = function () {
      a.off(".aside"), (!ace.vars.transition || o) && (s.addClass("aside-hidden"), s.css("position", ""))
    }, this.insideContainer = function () {
      var t = e(".main-container"), i = s.find(".modal-dialog");
      if (i.css({right: "", left: ""}), t.hasClass("container")) {
        var r = !1;
        1 == l && (i.css(n, parseInt((a.width() - t.width()) / 2)), r = !0), r && ace.vars.firefox && ace.helper.redraw(t[0])
      }
    }, this.flip = function () {
      var e = {right: "left", left: "right", top: "bottom", bottom: "top"};
      s.removeClass("aside-" + n).addClass("aside-" + e[n]), n = e[n]
    };
    var f = function () {
      var e = s.find(".aside-trigger");
      if (0 != e.length) {
        e.toggleClass("open");
        var t = e.find(ace.vars[".icon"]);
        0 != t.length && t.toggleClass(t.attr("data-icon1") + " " + t.attr("data-icon2"))
      }
    };
    this.initiate(), this.container && (this.container = e(this.container)), s.appendTo(this.container || "body")
  }
  
  var a = e(window);
  e(document).on("show.bs.modal", ".modal.aside", function () {
    e(".aside.in").modal("hide"), e(this).ace_aside("show")
  }).on("hide.bs.modal", ".modal.aside", function () {
    e(this).ace_aside("hide")
  }).on("shown.bs.modal", ".modal.aside", function () {
    e(this).ace_aside("shown")
  }).on("hidden.bs.modal", ".modal.aside", function () {
    e(this).ace_aside("hidden")
  }), e(window).on("resize.aside_container", function () {
    e(".modal.aside").ace_aside("insideContainer")
  }), e(document).on("settings.ace.aside", function (t, i) {
    "main_container_fixed" == i && e(".modal.aside").ace_aside("insideContainer")
  }), e.fn.aceAside = e.fn.ace_aside = function (a, r) {
    var s, n = this.each(function () {
      var t = e(this), n = t.data("ace_aside"), l = "object" == typeof a && a;
      n || t.data("ace_aside", n = new i(this, l)), "string" == typeof a && "function" == typeof n[a] && (s = r instanceof Array ? n[a].apply(n, r) : n[a](r))
    });
    return s === t ? n : s
  }, e.fn.ace_aside.defaults = {
    fixed: !1,
    background: !1,
    offset: !1,
    body_scroll: !1,
    transition: !0,
    scroll_style: "scroll-dark no-track",
    container: null,
    backdrop: !1,
    placement: "right"
  }
}(window.jQuery), function (e, t) {
  function i(t, i) {
    var a = t.find(".widget-main").eq(0);
    e(window).off("resize.widget.scroll");
    var r = ace.vars.old_ie || ace.vars.touch;
    if (i) {
      var s = a.data("ace_scroll");
      s && a.data("save_scroll", {size: s.size, lock: s.lock, lock_anyway: s.lock_anyway});
      var n = t.height() - t.find(".widget-header").height() - 10;
      n = parseInt(n), a.css("min-height", n), r ? (s && a.ace_scroll("disable"), a.css("max-height", n).addClass("overflow-scroll")) : (s ? a.ace_scroll("update", {
        size: n,
        mouseWheelLock: !0,
        lockAnyway: !0
      }) : a.ace_scroll({
        size: n,
        mouseWheelLock: !0,
        lockAnyway: !0
      }), a.ace_scroll("enable").ace_scroll("reset")), e(window).on("resize.widget.scroll", function () {
        var e = t.height() - t.find(".widget-header").height() - 10;
        e = parseInt(e), a.css("min-height", e), r ? a.css("max-height", e).addClass("overflow-scroll") : a.ace_scroll("update", {size: e}).ace_scroll("reset")
      })
    } else {
      a.css("min-height", "");
      var l = a.data("save_scroll");
      l && a.ace_scroll("update", {
        size: l.size,
        mouseWheelLock: l.lock,
        lockAnyway: l.lock_anyway
      }).ace_scroll("enable").ace_scroll("reset"), r ? a.css("max-height", "").removeClass("overflow-scroll") : l || a.ace_scroll("disable")
    }
  }
  
  var a = function (t) {
    this.$box = e(t);
    this.reload = function () {
      var e = this.$box, t = !1;
      "static" == e.css("position") && (t = !0, e.addClass("position-relative")), e.append('<div class="widget-box-overlay"><i class="' + ace.vars.icon + 'loading-icon fa fa-spinner fa-spin fa-2x white"></i></div>'), e.one("reloaded.ace.widget", function () {
        e.find(".widget-box-overlay").remove(), t && e.removeClass("position-relative")
      })
    }, this.close = function () {
      var e = this.$box, t = 300;
      e.fadeOut(t, function () {
        e.trigger("closed.ace.widget"), e.remove()
      })
    }, this.toggle = function (e, t) {
      var i = this.$box, a = i.find(".widget-body").eq(0), r = null, s = "undefined" != typeof e ? e : i.hasClass("collapsed") ? "show" : "hide", n = "show" == s ? "shown" : "hidden";
      if ("undefined" == typeof t && (t = i.find("> .widget-header a[data-action=collapse]").eq(0), 0 == t.length && (t = null)), t) {
        r = t.find(ace.vars[".icon"]).eq(0);
        var l, o = null, d = null;
        (o = r.attr("data-icon-show")) ? d = r.attr("data-icon-hide") : (l = r.attr("class").match(/fa\-(.*)\-(up|down)/)) && (o = "fa-" + l[1] + "-down", d = "fa-" + l[1] + "-up")
      }
      var c = 250, p = 200;
      "show" == s ? (r && r.removeClass(o).addClass(d), a.hide(), i.removeClass("collapsed"), a.slideDown(c, function () {
        i.trigger(n + ".ace.widget")
      })) : (r && r.removeClass(d).addClass(o), a.slideUp(p, function () {
        i.addClass("collapsed"), i.trigger(n + ".ace.widget")
      }))
    }, this.hide = function () {
      this.toggle("hide")
    }, this.show = function () {
      this.toggle("show")
    }, this.fullscreen = function () {
      var e = this.$box.find("> .widget-header a[data-action=fullscreen]").find(ace.vars[".icon"]).eq(0), t = null, a = null;
      (t = e.attr("data-icon1")) ? a = e.attr("data-icon2") : (t = "fa-expand", a = "fa-compress"), this.$box.hasClass("fullscreen") ? (e.addClass(t).removeClass(a), this.$box.removeClass("fullscreen"), i(this.$box, !1)) : (e.removeClass(t).addClass(a), this.$box.addClass("fullscreen"), i(this.$box, !0)), this.$box.trigger("fullscreened.ace.widget")
    }
  };
  e.fn.widget_box = function (i, r) {
    var s, n = this.each(function () {
      var t = e(this), n = t.data("widget_box"), l = "object" == typeof i && i;
      n || t.data("widget_box", n = new a(this, l)), "string" == typeof i && (s = n[i](r))
    });
    return s === t ? n : s
  }, e(document).on("click.ace.widget", ".widget-header a[data-action]", function (t) {
    t.preventDefault();
    var i = e(this), r = i.closest(".widget-box");
    if (0 != r.length && !r.hasClass("ui-sortable-helper")) {
      var s = r.data("widget_box");
      s || r.data("widget_box", s = new a(r.get(0)));
      var n = i.data("action");
      if ("collapse" == n) {
        var l, o = r.hasClass("collapsed") ? "show" : "hide";
        if (r.trigger(l = e.Event(o + ".ace.widget")), l.isDefaultPrevented())return;
        s.toggle(o, i)
      } else if ("close" == n) {
        var l;
        if (r.trigger(l = e.Event("close.ace.widget")), l.isDefaultPrevented())return;
        s.close()
      } else if ("reload" == n) {
        i.blur();
        var l;
        if (r.trigger(l = e.Event("reload.ace.widget")), l.isDefaultPrevented())return;
        s.reload()
      } else if ("fullscreen" == n) {
        var l;
        if (r.trigger(l = e.Event("fullscreen.ace.widget")), l.isDefaultPrevented())return;
        s.fullscreen()
      } else"settings" == n && r.trigger("setting.ace.widget")
    }
  })
}(window.jQuery), function (e, t) {
  function i(i, r) {
    function s() {
      this.mobile_view = this.mobile_style < 4 && this.is_mobile_view(), this.collapsible = !this.mobile_view && this.is_collapsible(), this.minimized = !this.collapsible && this.$sidebar.hasClass(p) || 3 == this.mobile_style && this.mobile_view && this.$sidebar.hasClass(m), this.horizontal = !(this.mobile_view || this.collapsible) && this.$sidebar.hasClass(u)
    }
    
    var n = this;
    this.$sidebar = e(i), this.$sidebar.attr("data-sidebar", "true"), this.$sidebar.attr("id") || this.$sidebar.attr("id", "id-sidebar-" + ++a);
    var l = ace.helper.getAttrSettings(i, e.fn.ace_sidebar.defaults, "sidebar-");
    this.settings = e.extend({}, e.fn.ace_sidebar.defaults, r, l), this.minimized = !1, this.collapsible = !1, this.horizontal = !1, this.mobile_view = !1, this.vars = function () {
      return {
        minimized: this.minimized,
        collapsible: this.collapsible,
        horizontal: this.horizontal,
        mobile_view: this.mobile_view
      }
    }, this.get = function (e) {
      return this.hasOwnProperty(e) ? this[e] : void 0
    }, this.set = function (e, t) {
      this.hasOwnProperty(e) && (this[e] = t)
    }, this.ref = function () {
      return this
    };
    var o = function (i) {
      var a, r, s = e(this).find(ace.vars[".icon"]);
      s.length > 0 && (a = s.attr("data-icon1"), r = s.attr("data-icon2"), i !== t ? i ? s.removeClass(a).addClass(r) : s.removeClass(r).addClass(a) : s.toggleClass(a).toggleClass(r))
    }, d = function () {
      var t = n.$sidebar.find(".sidebar-collapse");
      return 0 == t.length && (t = e('.sidebar-collapse[data-target="#' + (n.$sidebar.attr("id") || "") + '"]')), t = 0 != t.length ? t[0] : null
    };
    this.toggleMenu = function (e, t) {
      if (!this.collapsible) {
        this.minimized = !this.minimized;
        try {
          ace.settings.sidebar_collapsed(i, this.minimized, !(e === !1 || t === !1))
        } catch (a) {
          this.minimized ? this.$sidebar.addClass("menu-min") : this.$sidebar.removeClass("menu-min")
        }
        e || (e = d()), e && o.call(e, this.minimized), ace.vars.old_ie && ace.helper.redraw(i)
      }
    }, this.collapse = function (e, t) {
      this.collapsible || (this.minimized = !1, this.toggleMenu(e, t))
    }, this.expand = function (e, t) {
      this.collapsible || (this.minimized = !0, this.toggleMenu(e, t))
    }, this.toggleResponsive = function (t) {
      if (this.mobile_view && 3 == this.mobile_style) {
        if (this.$sidebar.hasClass("menu-min")) {
          this.$sidebar.removeClass("menu-min");
          var i = d();
          i && o.call(i)
        }
        if (this.minimized = !this.$sidebar.hasClass("responsive-min"), this.$sidebar.toggleClass("responsive-min responsive-max"), t || (t = this.$sidebar.find(".sidebar-expand"), 0 == t.length && (t = e('.sidebar-expand[data-target="#' + (this.$sidebar.attr("id") || "") + '"]')), t = 0 != t.length ? t[0] : null), t) {
          var a, r, s = e(t).find(ace.vars[".icon"]);
          s.length > 0 && (a = s.attr("data-icon1"), r = s.attr("data-icon2"), s.toggleClass(a).toggleClass(r))
        }
        e(document).triggerHandler("settings.ace", ["sidebar_collapsed", this.minimized])
      }
    }, this.is_collapsible = function () {
      var t;
      return this.$sidebar.hasClass("navbar-collapse") && null != (t = e('.navbar-toggle[data-target="#' + (this.$sidebar.attr("id") || "") + '"]').get(0)) && t.scrollHeight > 0
    }, this.is_mobile_view = function () {
      var t;
      return null != (t = e('.menu-toggler[data-target="#' + (this.$sidebar.attr("id") || "") + '"]').get(0)) && t.scrollHeight > 0
    }, this.$sidebar.on(ace.click_event + ".ace.submenu", ".nav-list", function (t) {
      var i = this, a = e(t.target).closest("a");
      if (a && 0 != a.length) {
        var r = n.minimized && !n.collapsible;
        if (a.hasClass("dropdown-toggle")) {
          t.preventDefault();
          var s = a.siblings(".submenu").get(0);
          if (!s)return !1;
          var l = e(s), o = 0, d = s.parentNode.parentNode;
          if (r && d == i || l.parent().hasClass("hover") && "absolute" == l.css("position") && !n.collapsible)return !1;
          var c = 0 == s.scrollHeight;
          return c && e(d).find("> .open > .submenu").each(function () {
            this == s || e(this.parentNode).hasClass("active") || (o -= this.scrollHeight, n.hide(this, n.settings.duration, !1))
          }), c ? (n.show(s, n.settings.duration), 0 != o && (o += s.scrollHeight)) : (n.hide(s, n.settings.duration), o -= s.scrollHeight), 0 != o && ("true" != n.$sidebar.attr("data-sidebar-scroll") || n.minimized || n.$sidebar.ace_sidebar_scroll("prehide", o)), !1
        }
        if ("tap" == ace.click_event && r && a.get(0).parentNode.parentNode == i) {
          var p = a.find(".menu-text").get(0);
          if (null != p && t.target != p && !e.contains(p, t.target))return t.preventDefault(), !1
        }
        if (ace.vars.ios_safari && "false" !== a.attr("data-link"))return document.location = a.attr("href"), t.preventDefault(), !1
      }
    });
    var c = !1;
    this.show = function (t, i, a) {
      if (a = a !== !1, a && c)return !1;
      var r, s = e(t);
      if (s.trigger(r = e.Event("show.ace.submenu")), r.isDefaultPrevented())return !1;
      a && (c = !0), i = i || this.settings.duration, s.css({
        height: 0,
        overflow: "hidden",
        display: "block"
      }).removeClass("nav-hide").addClass("nav-show").parent().addClass("open"), t.scrollTop = 0, i > 0 && s.css({
        height: t.scrollHeight,
        "transition-property": "height",
        "transition-duration": i / 1e3 + "s"
      });
      var n = function (t, i) {
        t && t.stopPropagation(), s.css({
          "transition-property": "",
          "transition-duration": "",
          overflow: "",
          height: ""
        }), i !== !1 && s.trigger(e.Event("shown.ace.submenu")), a && (c = !1)
      };
      return i > 0 && e.support.transition.end ? s.one(e.support.transition.end, n) : n(), ace.vars.android && setTimeout(function () {
        n(null, !1), ace.helper.redraw(t)
      }, i + 20), !0
    }, this.hide = function (t, i, a) {
      if (a = a !== !1, a && c)return !1;
      var r, s = e(t);
      if (s.trigger(r = e.Event("hide.ace.submenu")), r.isDefaultPrevented())return !1;
      a && (c = !0), i = i || this.settings.duration, s.css({
        height: t.scrollHeight,
        overflow: "hidden",
        display: "block"
      }).parent().removeClass("open"), t.offsetHeight, i > 0 && s.css({
        height: 0,
        "transition-property": "height",
        "transition-duration": i / 1e3 + "s"
      });
      var n = function (t, i) {
        t && t.stopPropagation(), s.css({
          display: "none",
          overflow: "",
          height: "",
          "transition-property": "",
          "transition-duration": ""
        }).removeClass("nav-show").addClass("nav-hide"), i !== !1 && s.trigger(e.Event("hidden.ace.submenu")), a && (c = !1)
      };
      return i > 0 && e.support.transition.end ? s.one(e.support.transition.end, n) : n(), ace.vars.android && setTimeout(function () {
        n(null, !1), ace.helper.redraw(t)
      }, i + 20), !0
    }, this.toggle = function (e, t) {
      if (t = t || n.settings.duration, 0 == e.scrollHeight) {
        if (this.show(e, t))return 1
      } else if (this.hide(e, t))return -1;
      return 0
    };
    var p = "menu-min", m = "responsive-min", u = "h-sidebar", f = function () {
      this.mobile_style = 1, this.$sidebar.hasClass("responsive") && !e('.menu-toggler[data-target="#' + this.$sidebar.attr("id") + '"]').hasClass("navbar-toggle") ? this.mobile_style = 2 : this.$sidebar.hasClass(m) ? this.mobile_style = 3 : this.$sidebar.hasClass("navbar-collapse") && (this.mobile_style = 4)
    };
    f.call(n), e(window).on("resize.sidebar.vars", function () {
      s.call(n)
    }).triggerHandler("resize.sidebar.vars")
  }
  
  var a = 0;
  e(document).on(ace.click_event + ".ace.menu", ".menu-toggler", function (t) {
    var i = e(this), a = e(i.attr("data-target"));
    if (0 != a.length) {
      t.preventDefault(), a.toggleClass("display"), i.toggleClass("display");
      var r = ace.click_event + ".ace.autohide", s = "true" === a.attr("data-auto-hide");
      return i.hasClass("display") ? (s && e(document).on(r, function (t) {
        return a.get(0) == t.target || e.contains(a.get(0), t.target) ? void t.stopPropagation() : (a.removeClass("display"), i.removeClass("display"), void e(document).off(r))
      }), "true" == a.attr("data-sidebar-scroll") && a.ace_sidebar_scroll("reset")) : s && e(document).off(r), !1
    }
  }).on(ace.click_event + ".ace.menu", ".sidebar-collapse", function (t) {
    var i = e(this).attr("data-target"), a = null;
    i && (a = e(i)), (null == a || 0 == a.length) && (a = e(this).closest(".sidebar")), 0 != a.length && (t.preventDefault(), a.ace_sidebar("toggleMenu", this))
  }).on(ace.click_event + ".ace.menu", ".sidebar-expand", function (t) {
    var i = e(this).attr("data-target"), a = null;
    if (i && (a = e(i)), (null == a || 0 == a.length) && (a = e(this).closest(".sidebar")), 0 != a.length) {
      var r = this;
      t.preventDefault(), a.ace_sidebar("toggleResponsive", this);
      var s = ace.click_event + ".ace.autohide";
      "true" === a.attr("data-auto-hide") && (a.hasClass("responsive-max") ? e(document).on(s, function (t) {
        return a.get(0) == t.target || e.contains(a.get(0), t.target) ? void t.stopPropagation() : (a.ace_sidebar("toggleResponsive", r), void e(document).off(s))
      }) : e(document).off(s))
    }
  }), e.fn.ace_sidebar = function (a, r) {
    var s, n = this.each(function () {
      var t = e(this), n = t.data("ace_sidebar"), l = "object" == typeof a && a;
      n || t.data("ace_sidebar", n = new i(this, l)), "string" == typeof a && "function" == typeof n[a] && (s = r instanceof Array ? n[a].apply(n, r) : n[a](r))
    });
    return s === t ? n : s
  }, e.fn.ace_sidebar.defaults = {duration: 300}
}(window.jQuery), function (e, t) {
  function i(t, i) {
    var s = this, n = e(window), l = e(t), o = l.find(".nav-list"), d = l.find(".sidebar-toggle").eq(0), c = l.find(".sidebar-shortcuts").eq(0), p = o.get(0);
    if (p) {
      var m = ace.helper.getAttrSettings(t, e.fn.ace_sidebar_scroll.defaults);
      this.settings = e.extend({}, e.fn.ace_sidebar_scroll.defaults, i, m);
      var u = s.settings.scroll_to_active;
      this.only_if_fixed = s.settings.only_if_fixed;
      var f = l.ace_sidebar("ref");
      l.attr("data-sidebar-scroll", "true");
      var v = function () {
        return "absolute" == l.first("li.hover > .submenu").css("position")
      }, g = null, h = null, b = null;
      this.is_scrolling = !1;
      var w = !1;
      this.sidebar_fixed = r(t, "fixed");
      var C, y, _ = function () {
        var e = o.parent().offset();
        return s.sidebar_fixed && (e.top -= ace.helper.scrollTop()), n.innerHeight() - e.top - (s.settings.include_toggle ? 0 : d.outerHeight())
      }, x = function () {
        return p.scrollHeight
      }, P = function (e) {
        if (!w && !(s.only_if_fixed && !s.sidebar_fixed || v())) {
          if (o.wrap('<div class="nav-wrap-up" />'), s.settings.include_shortcuts && 0 != c.length && o.parent().prepend(c), s.settings.include_toggle && 0 != d.length && o.parent().append(d), g = o.parent().ace_scroll({
              size: _(),
              reset: !0,
              mouseWheelLock: !0,
              lockAnyway: s.settings.lock_anyway,
              styleClass: s.settins.scroll_style,
              hoverReset: !1
            }).closest(".ace-scroll").addClass("nav-scroll"), b = g.data("ace_scroll"), h = g.find(".scroll-content").eq(0), a && !s.settings.include_toggle) {
            var t = d.get(0);
            t && h.on("scroll.safari", function () {
              ace.helper.redraw(t)
            })
          }
          w = !0, 1 == e && (s.reset(), u && s.scroll_to_active(), u = !1)
        }
      };
      this.scroll_to_active = function () {
        if (b && b.is_active())try {
          var e, t = f.vars(), i = l.find(".nav-list");
          t.minimized && !t.collapsible ? e = i.find("> .active") : (e = o.find("> .active.hover"), 0 == e.length && (e = o.find(".active:not(.open)")));
          var a = e.outerHeight();
          i = i.get(0);
          for (var r = e.get(0); r != i;)a += r.offsetTop, r = r.parentNode;
          var s = a - g.height();
          s > 0 && h.scrollTop(s)
        } catch (n) {
        }
      }, this.reset = function (e) {
        if (e === !0 && (this.sidebar_fixed = r(t, "fixed")), this.only_if_fixed && !this.sidebar_fixed || v())return void this.disable();
        w || P(), l.addClass("sidebar-scroll");
        var i = f.vars(), a = !i.minimized && !i.collapsible && !i.horizontal && (C = _()) < (y = p.parentNode.scrollHeight);
        this.is_scrolling = !0, a && b && (b.update({size: C}), b.enable(), b.reset()), a && b.is_active() || this.is_scrolling && this.disable()
      }, this.disable = function () {
        this.is_scrolling = !1, b && b.disable(), l.removeClass("sidebar-scroll")
      }, this.prehide = function (e) {
        if (this.is_scrolling && !f.get("minimized"))if (x() + e < _())this.disable(); else if (0 > e) {
          var t = h.scrollTop() + e;
          if (0 > t)return;
          h.scrollTop(t)
        }
      }, this._reset = function (e) {
        e === !0 && (this.sidebar_fixed = r(t, "fixed")), ace.vars.webkit ? setTimeout(function () {
          s.reset()
        }, 0) : this.reset()
      }, this.get = function (e) {
        return this.hasOwnProperty(e) ? this[e] : void 0
      }, this.set = function (e, t) {
        this.hasOwnProperty(e) && (this[e] = t)
      }, this.ref = function () {
        return this
      }, this.updateStyle = function (e) {
        null != b && b.update({styleClass: e})
      }, l.on("hidden.ace.submenu.sidebar_scroll shown.ace.submenu.sidebar_scroll", ".submenu", function (e) {
        e.stopPropagation(), f.get("minimized") || s._reset()
      }), P(!0)
    }
  }
  
  var a = ace.vars.safari && navigator.userAgent.match(/version\/[1-5]/i), r = "getComputedStyle" in window ? function (e, t) {
    return e.offsetHeight, window.getComputedStyle(e).position == t
  } : function (t, i) {
    return t.offsetHeight, e(t).css("position") == i
  };
  e(document).on("settings.ace.sidebar_scroll", function (t, i, a) {
    e(".sidebar[data-sidebar-scroll=true]").each(function () {
      var t = e(this), s = t.ace_sidebar_scroll("ref");
      if ("sidebar_collapsed" == i)"true" == t.attr("data-sidebar-hover") && t.ace_sidebar_hover("reset"), 1 == a ? s.disable() : s.reset(); else if ("sidebar_fixed" === i || "navbar_fixed" === i) {
        var n = s.get("is_scrolling"), l = r(this, "fixed");
        s.set("sidebar_fixed", l), l && !n ? s.reset() : !l && s.get("only_if_fixed") && s.disable()
      }
    })
  }), e(window).on("resize.ace.sidebar_scroll", function () {
    e(".sidebar[data-sidebar-scroll=true]").each(function () {
      var t = e(this).ace_sidebar_scroll("ref"), i = r(this, "fixed");
      t.set("sidebar_fixed", i), t.reset()
    })
  }), e.fn.ace_sidebar_scroll || (e.fn.ace_sidebar_scroll = function (a, r) {
    var s, n = this.each(function () {
      var t = e(this), n = t.data("ace_sidebar_scroll"), l = "object" == typeof a && a;
      n || t.data("ace_sidebar_scroll", n = new i(this, l)), "string" == typeof a && "function" == typeof n[a] && (s = n[a](r))
    });
    return s === t ? n : s
  }, e.fn.ace_sidebar_scroll.defaults = {
    scroll_to_active: !0,
    include_shortcuts: !0,
    include_toggle: !1,
    scroll_style: "",
    lock_anyway: !1,
    only_if_fixed: !0
  })
}(window.jQuery), function (e, t) {
  function i(t, i) {
    var s = this, n = e(window), l = e(t), o = l.find(".nav-list"), d = l.find(".sidebar-toggle").eq(0), c = l.find(".sidebar-shortcuts").eq(0), p = o.get(0);
    if (p) {
      var m = ace.helper.getAttrSettings(t, e.fn.ace_sidebar_scroll.defaults);
      this.settings = e.extend({}, e.fn.ace_sidebar_scroll.defaults, i, m);
      var u = s.settings.scroll_to_active, f = l.ace_sidebar("ref");
      l.attr("data-sidebar-scroll", "true");
      var v = null, g = null, h = null, b = null, w = null, C = null;
      this.is_scrolling = !1;
      var y = !1;
      this.sidebar_fixed = r(t, "fixed");
      var _, x, P = function () {
        var e = o.parent().offset();
        return s.sidebar_fixed && (e.top -= ace.helper.scrollTop()), n.innerHeight() - e.top - (s.settings.include_toggle ? 0 : d.outerHeight())
      }, S = function () {
        return p.clientHeight
      }, M = function (t) {
        if (!y && s.sidebar_fixed) {
          o.wrap('<div class="nav-wrap-up pos-rel" />'), o.after("<div><div></div></div>"), o.wrap('<div class="nav-wrap" />'), s.settings.include_toggle || d.css({"z-index": 1}), s.settings.include_shortcuts || c.css({"z-index": 99}), v = o.parent().next().ace_scroll({
            size: P(),
            mouseWheelLock: !0,
            hoverReset: !1,
            dragEvent: !0,
            styleClass: s.settings.scroll_style,
            touchDrag: !1
          }).closest(".ace-scroll").addClass("nav-scroll"), C = v.data("ace_scroll"), g = v.find(".scroll-content").eq(0), h = g.find(" > div").eq(0), w = e(C.get_track()), b = w.find(".scroll-bar").eq(0), s.settings.include_shortcuts && 0 != c.length && (o.parent().prepend(c).wrapInner("<div />"), o = o.parent()), s.settings.include_toggle && 0 != d.length && (o.append(d), o.closest(".nav-wrap").addClass("nav-wrap-t")), o.css({position: "relative"}), 1 == s.settings.scroll_outside && v.addClass("scrollout"), p = o.get(0), p.style.top = 0, g.on("scroll.nav", function () {
            p.style.top = -1 * this.scrollTop + "px"
          }), o.on(e.event.special.mousewheel ? "mousewheel.ace_scroll" : "mousewheel.ace_scroll DOMMouseScroll.ace_scroll", function (e) {
            return s.is_scrolling && C.is_active() ? v.trigger(e) : !s.settings.lock_anyway
          }), o.on("mouseenter.ace_scroll", function () {
            w.addClass("scroll-hover")
          }).on("mouseleave.ace_scroll", function () {
            w.removeClass("scroll-hover")
          });
          var i = g.get(0);
          if (o.on("ace_drag.nav", function (t) {
              if (!s.is_scrolling || !C.is_active())return void(t.retval.cancel = !0);
              if (0 != e(t.target).closest(".can-scroll").length)return void(t.retval.cancel = !0);
              if ("up" == t.direction || "down" == t.direction) {
                C.move_bar(!0);
                var a = t.dy;
                a = parseInt(Math.min(_, a)), Math.abs(a) > 2 && (a = 2 * a), 0 != a && (i.scrollTop = i.scrollTop + a, p.style.top = -1 * i.scrollTop + "px")
              }
            }), s.settings.smooth_scroll && o.on("touchstart.nav MSPointerDown.nav pointerdown.nav", function () {
              o.css("transition-property", "none"), b.css("transition-property", "none")
            }).on("touchend.nav touchcancel.nav MSPointerUp.nav MSPointerCancel.nav pointerup.nav pointercancel.nav", function () {
              o.css("transition-property", "top"), b.css("transition-property", "top")
            }), a && !s.settings.include_toggle) {
            var r = d.get(0);
            r && g.on("scroll.safari", function () {
              ace.helper.redraw(r)
            })
          }
          if (y = !0, 1 == t && (s.reset(), u && s.scroll_to_active(), u = !1), "number" == typeof s.settings.smooth_scroll && s.settings.smooth_scroll > 0 && (o.css({
              "transition-property": "top",
              "transition-duration": (s.settings.smooth_scroll / 1e3).toFixed(2) + "s"
            }), b.css({
              "transition-property": "top",
              "transition-duration": (s.settings.smooth_scroll / 1500).toFixed(2) + "s"
            }), v.on("drag.start", function (e) {
              e.stopPropagation(), o.css("transition-property", "none")
            }).on("drag.end", function (e) {
              e.stopPropagation(), o.css("transition-property", "top")
            })), ace.vars.android) {
            var n = ace.helper.scrollTop();
            2 > n && (window.scrollTo(n, 0), setTimeout(function () {
              s.reset()
            }, 20));
            var l, m = ace.helper.winHeight();
            e(window).on("scroll.ace_scroll", function () {
              s.is_scrolling && C.is_active() && (l = ace.helper.winHeight(), l != m && (m = l, s.reset()))
            })
          }
        }
      };
      this.scroll_to_active = function () {
        if (C && C.is_active())try {
          var e, t = f.vars(), i = l.find(".nav-list");
          t.minimized && !t.collapsible ? e = i.find("> .active") : (e = o.find("> .active.hover"), 0 == e.length && (e = o.find(".active:not(.open)")));
          var a = e.outerHeight();
          i = i.get(0);
          for (var r = e.get(0); r != i;)a += r.offsetTop, r = r.parentNode;
          var s = a - v.height();
          s > 0 && (p.style.top = -s + "px", g.scrollTop(s))
        } catch (n) {
        }
      }, this.reset = function (e) {
        if (e === !0 && (this.sidebar_fixed = r(t, "fixed")), !this.sidebar_fixed)return void this.disable();
        y || M();
        var i = f.vars(), a = !i.collapsible && !i.horizontal && (_ = P()) < (x = p.clientHeight);
        this.is_scrolling = !0, a && (h.css({
          height: x,
          width: 8
        }), v.prev().css({"max-height": _}), C.update({size: _}), C.enable(), C.reset()), a && C.is_active() ? l.addClass("sidebar-scroll") : this.is_scrolling && this.disable()
      }, this.disable = function () {
        this.is_scrolling = !1, v && (v.css({height: "", "max-height": ""}), h.css({
          height: "",
          width: ""
        }), v.prev().css({"max-height": ""}), C.disable()), parseInt(p.style.top) < 0 && s.settings.smooth_scroll && e.support.transition.end ? o.one(e.support.transition.end, function () {
          l.removeClass("sidebar-scroll"), o.off(".trans")
        }) : l.removeClass("sidebar-scroll"), p.style.top = 0
      }, this.prehide = function (e) {
        if (this.is_scrolling && !f.get("minimized"))if (S() + e < P())this.disable(); else if (0 > e) {
          var t = g.scrollTop() + e;
          if (0 > t)return;
          p.style.top = -1 * t + "px"
        }
      }, this._reset = function (e) {
        e === !0 && (this.sidebar_fixed = r(t, "fixed")), ace.vars.webkit ? setTimeout(function () {
          s.reset()
        }, 0) : this.reset()
      }, this.set_hover = function () {
        w && w.addClass("scroll-hover")
      }, this.get = function (e) {
        return this.hasOwnProperty(e) ? this[e] : void 0
      }, this.set = function (e, t) {
        this.hasOwnProperty(e) && (this[e] = t)
      }, this.ref = function () {
        return this
      }, this.updateStyle = function (e) {
        null != C && C.update({styleClass: e})
      }, l.on("hidden.ace.submenu.sidebar_scroll shown.ace.submenu.sidebar_scroll", ".submenu", function (e) {
        e.stopPropagation(), f.get("minimized") || (s._reset(), "shown" == e.type && s.set_hover())
      }), M(!0)
    }
  }
  
  var a = ace.vars.safari && navigator.userAgent.match(/version\/[1-5]/i), r = "getComputedStyle" in window ? function (e, t) {
    return e.offsetHeight, window.getComputedStyle(e).position == t
  } : function (t, i) {
    return t.offsetHeight, e(t).css("position") == i
  };
  e(document).on("settings.ace.sidebar_scroll", function (t, i) {
    e(".sidebar[data-sidebar-scroll=true]").each(function () {
      var t = e(this), a = t.ace_sidebar_scroll("ref");
      if ("sidebar_collapsed" == i && r(this, "fixed"))"true" == t.attr("data-sidebar-hover") && t.ace_sidebar_hover("reset"), a._reset(); else if ("sidebar_fixed" === i || "navbar_fixed" === i) {
        var s = a.get("is_scrolling"), n = r(this, "fixed");
        a.set("sidebar_fixed", n), n && !s ? a._reset() : n || a.disable()
      }
    })
  }), e(window).on("resize.ace.sidebar_scroll", function () {
    e(".sidebar[data-sidebar-scroll=true]").each(function () {
      var t = e(this);
      "true" == t.attr("data-sidebar-hover") && t.ace_sidebar_hover("reset");
      var i = e(this).ace_sidebar_scroll("ref"), a = r(this, "fixed");
      i.set("sidebar_fixed", a), i._reset()
    })
  }), e.fn.ace_sidebar_scroll || (e.fn.ace_sidebar_scroll = function (a, r) {
    var s, n = this.each(function () {
      var t = e(this), n = t.data("ace_sidebar_scroll"), l = "object" == typeof a && a;
      n || t.data("ace_sidebar_scroll", n = new i(this, l)), "string" == typeof a && "function" == typeof n[a] && (s = n[a](r))
    });
    return s === t ? n : s
  }, e.fn.ace_sidebar_scroll.defaults = {
    scroll_to_active: !0,
    include_shortcuts: !0,
    include_toggle: !1,
    smooth_scroll: 150,
    scroll_outside: !1,
    scroll_style: "",
    lock_anyway: !1
  })
}(window.jQuery), function (e) {
  var t = e(".navbar").eq(0), i = e(".navbar-container").eq(0), a = e(".sidebar").eq(0), r = e(".main-container").get(0), s = e(".breadcrumbs").eq(0), n = e(".page-content").get(0), l = 8;
  t.length > 0 && (e(window).on("resize.auto_padding", function () {
    if ("fixed" == t.css("position")) {
      var e = ace.vars.nav_collapse ? i.outerHeight() : t.outerHeight();
      if (e = parseInt(e), r.style.paddingTop = e + "px", ace.vars.non_auto_fixed && a.length > 0 && (a.get(0).style.top = "fixed" == a.css("position") ? e + "px" : ""), s.length > 0)if ("fixed" == s.css("position")) {
        var o = l + s.outerHeight() + parseInt(s.css("margin-top"));
        o = parseInt(o), n.style.paddingTop = o + "px", ace.vars.non_auto_fixed && (s.get(0).style.top = e + "px")
      } else n.style.paddingTop = "", ace.vars.non_auto_fixed && (s.get(0).style.top = "")
    } else r.style.paddingTop = "", n.style.paddingTop = "", ace.vars.non_auto_fixed && (a.length > 0 && (a.get(0).style.top = ""), s.length > 0 && (s.get(0).style.top = ""))
  }).triggerHandler("resize.auto_padding"), e(document).on("settings.ace.auto_padding", function (i, a) {
    ("navbar_fixed" == a || "breadcrumbs_fixed" == a) && (ace.vars.webkit && (t.get(0).offsetHeight, s.length > 0 && s.get(0).offsetHeight), e(window).triggerHandler("resize.auto_padding"))
  }))
}(window.jQuery), angular.module("log", ["toastr"]), angular.module("log").constant("WARNING_MESSAGES", {
  templateLoadFail: {
    title: "Loading templates failed",
    message: "could not load template. This is due to either internal or not template has been set.",
    remedy: "try again or add a new template, if this persist contact support"
  }
}), angular.module("log").constant("SUCCESS_MESSAGES", {
  authSuccess: {
    title: "Authentication",
    message: "Login success"
  },
  userCreated: {title: "Users", message: "User created"},
  userUpdated: {title: "Users", message: "User updated"},
  userRemoved: {title: "Users", message: "User deleted"},
  logoutSuccess: {title: "Logout Success", message: "You've been logged out of the system successfully!"},
  recordRemovedSuccessfully: {title: "Record Removed", message: "Record Removed Successfully"}
}), angular.module("log").constant("INFO_MESSAGES", {}), angular.module("log").constant("ERROR_MESSAGES", {
  stateChangeError: {
    title: "Application error",
    message: "Could not load page",
    remedy: "Please try that again"
  },
  unknownError: {title: "Error", message: "An error has occurred", remedy: "Please try again"},
  authInvalid: {title: "Authentication", message: "Invalid username or password", remedy: "Please try again"},
  networkError: {
    title: "Network",
    message: "Network error",
    remedy: "Please check your internet connection and try again"
  },
  userExists: {
    title: "Users",
    message: "A user with the specified email exists",
    remedy: "Please use another email address"
  },
  invalidUserId: {title: "Users", message: "Invalid user id", remedy: "Please select a valid user from the list"},
  unauthorizedAccess: {
    title: "Unauthorized access",
    message: "You are not allowed to access or perform this operation",
    remedy: "Please, re-login, try again if you have access and contact support if it persists"
  },
  updateConflict: {
    title: "Document update conflict",
    message: "The document you want to modified has been updated or created",
    remedy: "Please, refresh and try again"
  },
  serverNotAvailable: {
    title: "Server Offline",
    message: "Please, check your connection again, it looks like you are offline",
    remedy: "check if your internet connection or the api server is running"
  }
}), angular.module("db").service("driverService", ["config", "apiService", "couchDBService", "pouchDBbService", function (e, t, i, a) {
  var r = this;
  r.getService = function () {
    return {api: t, couchDB: i, pouchDB: a}
  }, r.getDriver = function () {
    return e.driver || "api"
  }, r.get = function () {
    var e = r.getService(), t = r.getDriver();
    return e.hasOwnProperty(t) ? e[t] : e.pouchDB
  }
}]), angular.module("visitorsGroup", ["core", "db", "utility", "form"]), angular.module("visitorsGroup").config(["$stateProvider", function (e) {
  e.state("visitorsGroup.profile", {
    url: "/profile",
    parent: "visitorsGroup",
    templateUrl: "app/visitors-group/profile/profile.html",
    controller: "VisitorsGroupProfileCtrl",
    controllerAs: "profileCtrl"
  }).state("visitorsGroup.detail", {
    url: "/detail?_id",
    parent: "visitorsGroup",
    templateUrl: "app/visitors-group/profile/profile.html",
    controller: "VisitorsGroupProfileCtrl",
    controllerAs: "profileCtrl"
  }).state("visitorsGroup.remove", {
    url: "/remove?_id",
    parent: "visitorsGroup",
    templateUrl: "app/visitors-group/profile/profile.html",
    controller: "RemoveVisitorsGroupProfileCtrl",
    controllerAs: "removeProfileCtrl"
  })
}]), angular.module("visitorsGroup").controller("VisitorsGroupProfileCtrl", ["visitorsGroupService", "$stateParams", function (e, t) {
  var i = this;
  e.get(t._id).then(function (e) {
    i.profile = e
  }).catch(function () {
  })
}]).controller("RemoveVisitorsGroupProfileCtrl", ["visitorsGroupService", "$state", "$stateParams", "authService", function (e, t, i) {
  var a = i._id;
  e.remove(a).then(function () {
    t.go("visitorsGroup.all")
  }).catch(function (e) {
    console.log(e)
  })
}]), angular.module("visitorsGroup").config(["$stateProvider", function (e) {
  e.state("visitorsGroup.add", {
    parent: "visitorsGroup",
    url: "/add",
    templateUrl: "app/visitors-group/form/form.html",
    controller: "VGFormCtrl",
    controllerAs: "formCtrl",
    data: data("Add Visitors Group", "fa fa-plus-square", "visitorsGroup.all")
  }).state("visitorsGroup.edit", {
    parent: "visitorsGroup",
    url: "/edit?_id",
    templateUrl: "app/visitors-group/form/form.html",
    controller: "VGFormCtrl",
    controllerAs: "formCtrl",
    data: data("Edit Visitors Group", "fa fa-edit-square", "visitorsGroup.all")
  })
}]), angular.module("visitorsGroup").controller("VGFormCtrl", ["visitorsGroupService", "$state", "$stateParams", "utility", "formService", function (e, t, i, a, r) {
  var s = 1, n = this;
  n.errorMsg = {}, n.viewModel = {}, n.column = 12 / s, n.model = e.model, n.form = r.modelToForm(n.model, s);
  var l = i._id;
  l && e.get(l).then(function (e) {
    n.viewModel = e
  }).catch(function (e) {
    console.log(e)
  }), n.save = function () {
    e.validate(n.viewModel).then(function (i) {
      a.isEmptyObject(i) ? e.save(n.viewModel).then(function () {
        t.go("visitorsGroup.all")
      }).catch(function (e) {
        angular.merge(n.errorMsg, e)
      }) : n.errorMsg = i
    }).catch(function (e) {
      console.log(e)
    })
  }, n.validateField = function (t) {
    n.errorMsg[t] = "", n.model.hasOwnProperty(t) && e.validateField(n.viewModel[t], t, n.viewModel._id).then(function (e) {
      n.errorMsg[t] = e
    }).catch(function (e) {
      console.log(e)
    })
  }, n.cancel = function () {
    t.go("visitorsGroup.all")
  }
}]), angular.module("visitorsGroup").config(["$stateProvider", function (e) {
  e.state("visitorsGroup.all", {
    url: "/all",
    parent: "visitorsGroup",
    templateUrl: "app/visitors-group/all/all.html",
    controller: "VisitorsGroupAllCtrl",
    controllerAs: "allCtrl"
  })
}]), angular.module("visitorsGroup").controller("VisitorsGroupAllCtrl", ["visitorsGroupService", function (e) {
  function t(e) {
    return i.orderByColumn[e] ? i.orderByColumn[e].reverse = !i.orderByColumn[e].reverse : (i.orderByColumn = {}, i.orderByColumn[e] = {reverse: !0}), i.orderByColumn
  }
  
  var i = this;
  i.users = [], i.pagination = {maxSize: 100}, i.orderByColumn = {date_joined: !0}, i.updateView = function (a) {
    var r = {};
    if (angular.isDefined(i.pagination.currentPage) ? r.page = i.pagination.currentPage : i.pagination.currentPage = 1, angular.isDefined(i.pagination.itemsPerPage) ? r.limit = i.pagination.itemsPerPage : i.pagination.itemsPerPage = 10, a) {
      var s = t(a);
      r.order_by = s[a].reverse ? a : ["-", a].join("")
    }
    e.all(r).then(function (e) {
      i.items = e.results, i.pagination.totalItems = e.count, i.pagination.numPages = Math.ceil(i.pagination.totalItems / i.pagination.itemsPerPage)
    }).catch(function (e) {
      console.log(e)
    })
  }, i.updateView()
}]), angular.module("visitors", ["core", "db", "utility", "form"]), angular.module("visitors").config(["$stateProvider", function (e) {
  e.state("visitors.profile", {
    url: "/profile",
    parent: "visitors",
    templateUrl: "app/visitors/profile/profile.html",
    controller: "VisitorProfileCtrl",
    controllerAs: "profileCtrl"
  }).state("visitors.detail", {
    url: "/detail?_id",
    parent: "visitors",
    templateUrl: "app/visitors/profile/profile.html",
    controller: "VisitorProfileCtrl",
    controllerAs: "profileCtrl"
  }).state("visitors.remove", {
    url: "/remove?_id",
    parent: "visitors",
    templateUrl: "app/visitors/profile/profile.html",
    controller: "RemoveVisitorProfileCtrl",
    controllerAs: "removeProfileCtrl"
  })
}]), angular.module("visitors").controller("VisitorProfileCtrl", ["visitorService", "authService", "$stateParams", function (e, t, i) {
  var a = this;
  i._id ? e.get(i._id).then(function (e) {
    a.profile = e
  }).catch(function () {
  }) : a.profile = t.currentUser()
}]).controller("RemoveVisitorProfileCtrl", ["visitorService", "$state", "$stateParams", "authService", function (e, t, i, a) {
  var r = i._id;
  r && a.currentUser()._id !== r && e.remove(r).then(function () {
    t.go("visitors.all")
  }).catch(function (e) {
    console.log(e)
  })
}]), angular.module("visitors").config(["$stateProvider", function (e) {
  e.state("visitors.add", {
    parent: "visitors",
    url: "/add?visitor",
    templateUrl: "app/visitors/form/form.html",
    controller: "VFormCtrl",
    controllerAs: "formCtrl",
    data: data("Add Visitor", "fa fa-plus-square", "visitors.all")
  }).state("visitors.edit", {
    parent: "visitors",
    url: "/edit?_id&visitor",
    templateUrl: "app/visitors/form/form.html",
    controller: "VFormCtrl",
    controllerAs: "formCtrl",
    data: data("Edit Visitor", "fa fa-edit-square", "visitors.all")
  })
}]), angular.module("visitors").controller("VFormCtrl", ["visitorService", "companyService", "$state", "$stateParams", "utility", "visitorsGroupService", "formService", "$scope", "$window", "$timeout", function (e, t, i, a, r, s, n, l, o, d) {
  var c = 2, p = this;
  p.upload = {status: !0}, p.errorMsg = {}, p.viewModel = {}, p.viewModel.company = p.viewModel.company || {}, p.column = 12 / c, p.companyResponse = {}, p.phone = {prefixes: n.phonePrefixes()}, p.model = e.model, p.form = n.modelToForm(p.model, c);
  var m = a._id;
  m && e.get(m).then(function (t) {
    p.viewModel = t, p.viewModel["company.name"] = p.viewModel.company.name, p.viewModel["company.address"] = p.viewModel.company.address, p.viewModel.group = p.viewModel.group._id || "";
    var i = e.recoverPhone(p.viewModel.phone);
    p.viewModel = angular.merge({}, p.viewModel, i)
  }).catch(function (e) {
    console.log(e)
  }), s.choices().then(function (e) {
    p.model.group.choices = e
  }).catch(function () {
  }), p.save = function () {
    p.viewModel.phone = e.getPhone(p.viewModel["phone.prefix"], p.viewModel["phone.suffix"]), e.validate(p.viewModel).then(function (t) {
      t = e.updateForPhone(t), t = e.updateForPrefix(t, p.viewModel["phone.prefix"]), r.isEmptyObject(t) ? (e.isEmpty(p.viewModel["company.name"]) || (p.viewModel.company = {name: p.viewModel["company.name"]}), e.isEmpty(p.viewModel["company.address"]) || e.isEmpty(p.viewModel["company.name"]) || (p.viewModel.company.address = p.viewModel["company.address"]), e.save(p.viewModel).then(function () {
        i.go("visitors.all")
      }).catch(function (e) {
        angular.merge(p.errorMsg, e)
      })) : p.errorMsg = t
    }).catch(function (e) {
      console.log(e)
    })
  }, p.cancel = function () {
    i.go("visitors.all")
  }, p.validateField = function (t) {
    if (p.errorMsg[t] = "", p.model.hasOwnProperty(t)) {
      if ("phone.suffix" === t)"Others" === p.viewModel["phone.prefix"] ? (p.model["phone.suffix"].minLength = 6, p.model["phone.suffix"].maxLength = 15) : (p.model["phone.suffix"].maxLength = 7, p.model["phone.suffix"].minLength = 7); else if ("phone.prefix" === t && "Others" === p.viewModel["phone.prefix"])return [];
      e.validateField(p.model[t], p.viewModel[t], p.viewModel._id).then(function (e) {
        p.errorMsg[t] = "phone.prefix" === t && e.length > 0 ? ["Please select from list"] : e
      }).catch(function (e) {
        console.log(e)
      })
    }
    "phone.prefix" !== t && "phone.suffix" !== t || e.isEmpty(p.viewModel["phone.prefix"]) || e.isEmpty(p.viewModel["phone.suffix"]) || e.validateField(p.viewModel[t], t, p.viewModel._id).then(function (e) {
      p.errorMsg.phone = e.length ? e : ""
    }).catch(function (e) {
      console.log(e)
    })
  }, p.getCompanies = function (e) {
    return t.all({q: e}).then(function (e) {
      return e.results.map(function (e) {
        return p.companyResponse[e.name] = e, e.name
      })
    }).catch(function () {
    })
  }, p.updateCompany = function (e) {
    p.viewModel["company.address"] = p.companyResponse[e].address
  }, p.placeholder = n.placeholder, l.closeCameraNow = function () {
    p.upload.status = !p.upload.status
  }, l.$on("picTaken", function (e, t) {
    p.viewModel.image = t.image
  }), l.setFiles = function (e, t) {
    var i = e.files[0];
    if (i.type.match("image*")) {
      var a = new o.FileReader;
      a.onload = function (e) {
        d(function () {
          var i = document.createElement("img");
          i.src = e.target.result;
          var a = document.createElement("canvas"), r = a.getContext("2d");
          r.drawImage(i, 0, 0);
          var s = 280, n = 300, l = i.width, o = i.height;
          l > o ? l > s && (o *= s / l, l = s) : o > n && (l *= n / o, o = n), a.width = l, a.height = o;
          var d = a.getContext("2d");
          d.drawImage(i, 0, 0, l, o), p.viewModel[t] = a.toDataURL("image/png")
        }, 1e3)
      }, a.readAsDataURL(i)
    }
  }
}]), angular.module("visitors").config(["$stateProvider", function (e) {
  e.state("visitors.all", {
    url: "/all",
    parent: "visitors",
    templateUrl: "app/visitors/all/all.html",
    controller: "VisitorAllCtrl",
    controllerAs: "visitorAllCtrl"
  })
}]), angular.module("visitors").controller("VisitorAllCtrl", ["visitorService", function (e) {
  function t(e) {
    return i.orderByColumn[e] ? i.orderByColumn[e].reverse = !i.orderByColumn[e].reverse : (i.orderByColumn = {}, i.orderByColumn[e] = {reverse: !0}), i.orderByColumn
  }
  
  var i = this;
  i.users = [], i.pagination = {maxSize: 100}, i.orderByColumn = {created: !0}, i.updateView = function (a) {
    var r = {};
    if (angular.isDefined(i.pagination.currentPage) ? r.page = i.pagination.currentPage : i.pagination.currentPage = 1, angular.isDefined(i.pagination.itemsPerPage) ? r.limit = i.pagination.itemsPerPage : i.pagination.itemsPerPage = 10, a) {
      var s = t(a);
      r.order_by = s[a].reverse ? a : ["-", a].join("")
    }
    e.all(r).then(function (e) {
      i.visitors = e.results, i.pagination.totalItems = e.count, i.pagination.numPages = Math.ceil(i.pagination.totalItems / i.pagination.itemsPerPage)
    }).catch(function (e) {
      console.log(e)
    })
  }, i.updateView()
}]), angular.module("users", ["core", "db", "utility", "form"]), angular.module("users").config(["$stateProvider", function (e) {
  e.state("users.profile", {
    url: "/profile",
    parent: "users",
    templateUrl: "app/users/profile/profile.html",
    controller: "UserProfileCtrl",
    controllerAs: "profileCtrl",
    data: data("Profile", "fa fa-user", "users.all")
  }).state("users.detail", {
    url: "/detail?_id",
    parent: "users",
    templateUrl: "app/users/profile/profile.html",
    controller: "UserProfileCtrl",
    controllerAs: "profileCtrl",
    data: data("Profile", "fa fa-user", "users.all")
  }).state("users.remove", {
    url: "/remove?_id",
    parent: "users",
    templateUrl: "app/users/profile/profile.html",
    controller: "RemoveUserProfileCtrl",
    controllerAs: "removeProfileCtrl"
  })
}]), angular.module("users").controller("UserProfileCtrl", ["userService", "authService", "$stateParams", "appointmentService", "utility", "log", function (e, t, i, a, r, s) {
  function n() {
    l.getRejected(), l.getInProgress(), l.getUpcoming(), l.getAwaitingApproval()
  }
  
  var l = this, o = i._id;
  o ? e.get(o).then(function (e) {
    l.profile = e
  }).catch(function () {
  }) : l.profile = t.currentUser(), l.getInProgress = function () {
    o = o || t.currentUser()._id, a.inProgress({host: o}).then(function (e) {
      l.inProgress = e.results
    })
  }, l.getUpcoming = function () {
    o = o || t.currentUser()._id, a.upcoming({host: o}).then(function (e) {
      l.upcoming = e.results
    })
  }, l.getAwaitingApproval = function () {
    o = o || t.currentUser()._id, a.awaitingApproval({host: o}).then(function (e) {
      l.awaitingApproval = e.results
    })
  }, l.getRejected = function () {
    o = o || t.currentUser()._id, a.rejected({host: o}).then(function (e) {
      l.rejected = e.results
    })
  }, l.timeSince = function (e) {
    return r.timeSince(e)
  }, l.updateApp = function (e, t) {
    e.is_approved = "true" === t, e.host = e.host._id, e.visitor = e.visitor._id, a.save(e).then(function () {
      n()
    }).catch(function (e) {
      console.log(e), s.error(e.detail || e)
    })
  }, n()
}]).controller("RemoveUserProfileCtrl", ["userService", "$state", "$stateParams", "authService", function (e, t, i, a) {
  var r = i._id;
  r && a.currentUser()._id !== r && e.remove(r).then(function () {
    t.go("users.all")
  }).catch(function (e) {
    console.log(e)
  })
}]), angular.module("users").config(["$stateProvider", function (e) {
  e.state("users.add", {
    parent: "users",
    url: "/add",
    templateUrl: "app/users/form/form.html",
    controller: "FormCtrl",
    controllerAs: "formCtrl",
    data: data("Add User", "fa fa-plus-square", "users.all")
  }).state("users.edit", {
    parent: "users",
    url: "/edit?_id",
    templateUrl: "app/users/form/form.html",
    controller: "FormCtrl",
    controllerAs: "formCtrl",
    data: data("Edit User", "fa fa-edit-square", "users.all")
  })
}]), angular.module("users").controller("FormCtrl", ["userService", "$state", "$stateParams", "utility", "formService", "departmentService", "$scope", "$window", "$timeout", function (e, t, i, a, r, s, n, l, o) {
  var d = e.currentUser(), c = 2, p = this;
  p.errorMsg = {}, p.viewModel = {}, p.column = 12 / c, p.model = e.model, s.choices().then(function (e) {
    p.model.department.choices = e
  }).catch(function () {
  }), p.form = r.modelToForm(p.model, c, {instance: this});
  var m = i._id;
  m && e.get(m).then(function (e) {
    p.viewModel = e, p.viewModel.department = p.viewModel.department._id || "", p.model.password.required = !1, p.model.password2.required = !1, p.form = r.modelToForm(p.model, c, {instance: this})
  }).catch(function (e) {
    console.log(e)
  }), p.save = function () {
    e.validate(p.viewModel).then(function (i) {
      a.isEmptyObject(i) ? e.save(p.viewModel).then(function (i) {
        i._id === d._id && e.updateCurrentUser(i), t.go("users.all")
      }).catch(function (e) {
        angular.merge(p.errorMsg, e)
      }) : p.errorMsg = i
    }).catch(function (e) {
      console.log(e)
    })
  }, p.validateField = function (t) {
    p.errorMsg[t] = "", p.model.hasOwnProperty(t) && e.validateField(p.viewModel[t], t, p.viewModel._id).then(function (i) {
      return i = i || [], 0 === i.length && -1 !== ["password", "password2"].indexOf(t) ? e.validatePasswordMatch(p.viewModel.password, p.viewModel.password2) : i
    }).then(function (e) {
      "[object Object]" === toString.call(e) ? (p.errorMsg.password = e.password || [], p.errorMsg.password2 = e.password2 || []) : p.errorMsg[t] = e
    }).catch(function (e) {
      console.log(e)
    })
  }, p.placeholder = r.placeholder, n.closeCameraNow = function () {
    p.upload.status = !p.upload.status
  }, n.$on("picTaken", function (e, t) {
    p.viewModel.image = t.image
  }), n.setFiles = function (e, t) {
    var i = e.files[0];
    if (i.type.match("image*")) {
      var a = new l.FileReader;
      a.onload = function (e) {
        o(function () {
          var i = document.createElement("img");
          i.src = e.target.result;
          var a = document.createElement("canvas"), r = a.getContext("2d");
          r.drawImage(i, 0, 0);
          var s = 280, n = 300, l = i.width, o = i.height;
          l > o ? l > s && (o *= s / l, l = s) : o > n && (l *= n / o, o = n), a.width = l, a.height = o;
          var d = a.getContext("2d");
          d.drawImage(i, 0, 0, l, o), p.viewModel[t] = a.toDataURL("image/png")
        }, 1e3)
      }, a.readAsDataURL(i)
    }
  }, p.cancel = function () {
    t.go("users.all")
  }
}]), angular.module("users").config(["$stateProvider", function (e) {
  e.state("users.all", {
    url: "/all",
    parent: "users",
    templateUrl: "app/users/all/all.html",
    controller: "UserAllCtrl",
    controllerAs: "allCtrl",
    resolve: {
      currentState: ["userService", function (e) {
        return e.getState().catch(function () {
          return {}
        })
      }]
    }
  })
}]), angular.module("users").controller("UserAllCtrl", ["userService", "dialog", "log", "changesService", "currentState", function (e, t, i, a, r) {
  function s() {
    l.pagination = o.pagination || {}, l.pagination.maxSize = l.pagination.maxSize || 100, l.pagination.itemsPerPage = l.pagination.itemsPerPage || 10, l.pagination.currentPage = l.pagination.currentPage || 1, l.orderByColumn = o.orderByColumn || {}, 0 === Object.keys(o.orderByColumn || {}).length && (l.orderByColumn.date_joined = l.orderByColumn.date_joined || !0)
  }
  
  function n(e) {
    return l.orderByColumn[e] ? l.orderByColumn[e].reverse = !l.orderByColumn[e].reverse : (l.orderByColumn = {}, l.orderByColumn[e] = {reverse: !0}), cache.set("orderByColumn", l.orderByColumn), l.orderByColumn
  }
  
  var l = this, o = r || {};
  l.users = [], l.inProgress = !1, s(), l.updateView = function (t) {
    l.inProgress = !0;
    var a = {};
    if (a.page = angular.isDefined(l.pagination.currentPage) ? l.pagination.currentPage : 1, a.limit = angular.isDefined(l.pagination.itemsPerPage) ? l.pagination.itemsPerPage : 10, t) {
      var r = n(t);
      a.order_by = r[t].reverse ? t : ["-", t].join("")
    }
    e.all(a).then(function (t) {
      l.users = t.results, l.pagination.totalItems = t.count, l.pagination.itemsPerPage = parseInt(l.pagination.itemsPerPage, 10), l.pagination.numPages = Math.ceil(parseInt(l.pagination.totalItems, 10) / parseInt(l.pagination.itemsPerPage, 10)), o.pagination = l.pagination, o.orderByColumn = l.orderByColumn, o.lastCheckTime = (new Date).getTime(), e.setState(o).catch(function (e) {
        console.log(e)
      }), l.inProgress = !1
    }).catch(function (e) {
      l.inProgress = !1, i.error(e)
    })
  }, l.remove = function (a) {
    t.confirm("Do you want to remove this record permanently?").then(function () {
      e.remove(a).then(function () {
        l.updateView(), i.success("recordRemovedSuccessfully")
      }).catch(function (e) {
        i.error(e.detail || e)
      })
    })
  }, l.updateView(), a.pollForChanges(l, e, "userprofile")
}]), angular.module("departments", ["core"]), angular.module("departments").config(["$stateProvider", function (e) {
  e.state("departments.all", {
    url: "/all",
    parent: "departments",
    templateUrl: "app/departments/all/all.html",
    controller: "DepartmentAllCtrl",
    controllerAs: "allCtrl"
  })
}]), angular.module("departments").controller("DepartmentAllCtrl", ["departmentService", "dialog", "log", function (e, t, i) {
  function a(e) {
    return r.orderByColumn[e] ? r.orderByColumn[e].reverse = !r.orderByColumn[e].reverse : (r.orderByColumn = {}, r.orderByColumn[e] = {reverse: !0}), r.orderByColumn
  }
  
  var r = this;
  r.items = [], r.pagination = {maxSize: 100}, r.orderByColumn = {created: !0}, r.updateView = function (t) {
    var i = {};
    if (angular.isDefined(r.pagination.currentPage) ? i.page = r.pagination.currentPage : r.pagination.currentPage = 1, angular.isDefined(r.pagination.itemsPerPage) ? i.limit = r.pagination.itemsPerPage : r.pagination.itemsPerPage = 10, t) {
      var s = a(t);
      i.order_by = s[t].reverse ? t : ["-", t].join("")
    }
    e.all(i).then(function (e) {
      r.items = e.results, r.pagination.totalItems = e.count, r.pagination.numPages = Math.ceil(r.pagination.totalItems / r.pagination.itemsPerPage)
    }).catch(function (e) {
      console.log(e)
    })
  }, r.remove = function (a) {
    t.confirm("Do you want to remove this record permanently?").then(function () {
      e.remove(a).then(function () {
        r.updateView(), i.success("recordRemovedSuccessfully")
      }).catch(function (e) {
        i.error(e.detail || e)
      })
    })
  }, r.updateView()
}]), angular.module("departments").config(["$stateProvider", function (e) {
  e.state("departments.profile", {
    url: "/profile",
    parent: "departments",
    templateUrl: "app/departments/profile/profile.html",
    controller: "DepartmentProfileCtrl",
    controllerAs: "profileCtrl"
  }).state("departments.detail", {
    url: "/detail?_id",
    parent: "departments",
    templateUrl: "app/departments/profile/profile.html",
    controller: "UserProfileCtrl",
    controllerAs: "profileCtrl"
  }).state("departments.remove", {
    url: "/remove?_id",
    parent: "departments",
    templateUrl: "app/departments/profile/profile.html",
    controller: "RemoveUserProfileCtrl",
    controllerAs: "removeProfileCtrl"
  })
}]), angular.module("departments").controller("DepartmentProfileCtrl", ["userService", "authService", "$stateParams", function (e, t, i) {
  var a = this;
  i._id ? e.get(i._id).then(function (e) {
    a.profile = e
  }).catch(function () {
  }) : a.profile = t.currentUser()
}]).controller("RemoveDepartmentProfileCtrl", ["userService", "$state", "$stateParams", "dialog", function (e, t, i) {
  var a = i._id;
  a && e.remove(a).then(function () {
    t.go("departments.all")
  }).catch(function (e) {
    t.go("departments.all"), console.log(e)
  })
}]), angular.module("departments").config(["$stateProvider", function (e) {
  e.state("departments.add", {
    parent: "departments",
    url: "/add",
    templateUrl: "app/departments/form/form.html",
    controller: "DFormCtrl",
    controllerAs: "formCtrl",
    data: data("Add Department", "fa fa-plus-square", "departments.all")
  }).state("departments.edit", {
    parent: "departments",
    url: "/edit?_id",
    templateUrl: "app/departments/form/form.html",
    controller: "DFormCtrl",
    controllerAs: "formCtrl",
    data: data("Edit Department", "fa fa-edit-square", "departments.all")
  })
}]), angular.module("departments").controller("DFormCtrl", ["userService", "$state", "$stateParams", "utility", "formService", "departmentService", function (e, t, i, a, r, s) {
  var n = 1, l = this;
  l.errorMsg = {}, l.viewModel = {}, l.column = 12 / n, l.model = s.model, l.form = r.modelToForm(l.model, n);
  var o = i._id;
  o && s.get(o).then(function (e) {
    l.viewModel = e
  }).catch(function (e) {
    console.log(e)
  }), l.save = function () {
    s.validate(l.viewModel).then(function (e) {
      a.isEmptyObject(e) ? s.save(l.viewModel).then(function () {
        t.go("departments.all")
      }).catch(function (e) {
        angular.merge(l.errorMsg, e)
      }) : l.errorMsg = e
    }).catch(function (e) {
      console.log(e)
    })
  }, l.validateField = function (e) {
    l.errorMsg[e] = "", l.model.hasOwnProperty(e) && s.validateField(l.viewModel[e], e, l.viewModel._id).then(function (t) {
      l.errorMsg[e] = t
    }).catch(function (e) {
      console.log(e)
    })
  }, l.cancel = function () {
    t.go("departments.all")
  }
}]), angular.module("company", ["core", "utility"]), angular.module("company").config(["$stateProvider", function (e) {
  e.state("company.add", {
    parent: "company",
    url: "/add",
    templateUrl: "app/company/form/form.html",
    controller: "CFormCtrl",
    controllerAs: "formCtrl",
    data: data("Add Company", "fa fa-plus-square", "company.all")
  }).state("company.edit", {
    parent: "company",
    url: "/edit?_id",
    templateUrl: "app/company/form/form.html",
    controller: "CFormCtrl",
    controllerAs: "formCtrl",
    data: data("Edit Company", "fa fa-edit-square", "company.all")
  })
}]), angular.module("company").controller("CFormCtrl", ["companyService", "$state", "$stateParams", "utility", "formService", function (e, t, i, a, r) {
  var s = 1, n = this;
  n.errorMsg = {}, n.viewModel = {}, n.column = 12 / s, n.model = e.model, n.form = r.modelToForm(n.model, s);
  var l = i._id;
  l && e.get(l).then(function (e) {
    n.viewModel = e
  }).catch(function (e) {
    console.log(e)
  }), n.save = function () {
    e.validate(n.viewModel).then(function (i) {
      console.log(i), a.isEmptyObject(i) ? e.save(n.viewModel).then(function () {
        t.go("company.all")
      }).catch(function (e) {
        angular.merge(n.errorMsg, e)
      }) : n.errorMsg = i
    }).catch(function (e) {
      console.log(e)
    })
  }, n.validateField = function (t) {
    n.errorMsg[t] = "", n.model.hasOwnProperty(t) && e.validateField(n.viewModel[t], t, n.viewModel._id).then(function (e) {
      n.errorMsg[t] = e
    }).catch(function (e) {
      console.log(e)
    })
  }, n.cancel = function () {
    t.go("company.all")
  }
}]), angular.module("company").config(["$stateProvider", function (e) {
  e.state("company.all", {
    url: "/all",
    parent: "company",
    templateUrl: "app/company/all/all.html",
    controller: "CompanyAllCtrl",
    controllerAs: "allCtrl"
  })
}]), angular.module("company").controller("CompanyAllCtrl", ["companyService", function (e) {
  function t(e) {
    return i.orderByColumn[e] ? i.orderByColumn[e].reverse = !i.orderByColumn[e].reverse : (i.orderByColumn = {}, i.orderByColumn[e] = {reverse: !0}), i.orderByColumn
  }
  
  var i = this;
  i.companies = [], i.pagination = {maxSize: 100}, i.orderByColumn = {created: !0}, i.updateView = function (a) {
    var r = {};
    if (angular.isDefined(i.pagination.currentPage) ? r.page = i.pagination.currentPage : i.pagination.currentPage = 1, angular.isDefined(i.pagination.itemsPerPage) ? r.limit = i.pagination.itemsPerPage : i.pagination.itemsPerPage = 10, a) {
      var s = t(a);
      r.order_by = s[a].reverse ? a : ["-", a].join("")
    }
    e.all(r).then(function (e) {
      i.companies = e.results, i.pagination.totalItems = e.count, i.pagination.numPages = Math.ceil(i.pagination.totalItems / i.pagination.itemsPerPage)
    }).catch(function (e) {
      console.log(e)
    })
  }, i.updateView()
}]), angular.module("appointments", ["core", "db", "utility", "form"]), angular.module("appointments").config(["$stateProvider", function (e) {
  e.state("appointments.detail", {
    url: "/detail?_id",
    templateUrl: "app/appointments/logs/checkin.html",
    controller: "CheckInCtrl",
    controllerAs: "logCtrl",
    data: data("Appointment Detail", null, "appointments.all")
  }).state("appointments.remove", {
    url: "/remove?_id",
    parent: "appointments",
    templateUrl: "app/appointments/profile/profile.html",
    controller: "RemoveAppointmentsProfileCtrl",
    controllerAs: "removeProfileCtrl"
  })
}]), angular.module("appointments").controller("AppointmentsProfileCtrl", ["appointmentService", "authService", "$stateParams", function (e, t, i) {
  {
    var a = this;
    i._id
  }
  i._id && (a.item = e.get())
}]).controller("RemoveAppointmentsProfileCtrl", ["userService", "$state", "$stateParams", "authService", function (e, t, i, a) {
  var r = i._id;
  r && a.currentUser()._id !== r && e.remove(r).then(function () {
    t.go("appointments.all")
  }).catch(function (e) {
    console.log(e)
  })
}]), angular.module("appointments").config(["$stateProvider", function (e) {
  e.state("appointments.checkin", {
    url: "/checkin?_id",
    templateUrl: "app/appointments/logs/checkin.html",
    controller: "CheckInCtrl",
    controllerAs: "logCtrl",
    data: data("Check Out Appointment", null, "appointments.all")
  }).state("appointments.checkout", {
    url: "/checkout?_id",
    templateUrl: "app/appointments/logs/checkout.html",
    controller: "CheckOutCtrl",
    controllerAs: "logCtrl"
  })
}]), angular.module("appointments").controller("CheckInCtrl", ["appointmentService", "$stateParams", "$state", "dialogs", function (e, t, i, a) {
  var r = this;
  e.get(t._id).then(function (e) {
    r.item = e
  }).catch(function () {
  }), r.checkIn = function () {
    e.saveLog({
      checked_in: (new Date).toJSON(),
      appointment: r.item._id,
      label_code: (new Date).getTime().toString().splice(0, -1)
    }).then(function () {
      i.go("appointments.all")
    }).catch(function () {
    })
  }, r.printLabel = function () {
    var e = a.create("app/appointments/logs/partials/pass-template.html", "PrintLabelCtrl", r.item, "lg");
    e.result.then(function () {
    }, function () {
    })
  }
}]).controller("PrintLabelCtrl", ["$scope", "$modalInstance", "data", "$timeout", function (e, t, i, a) {
  e.appointment = i;
  var r = e.appointment.logs[0] || {}, s = r.label_code.toString();
  s.length > 12 && (s = s.slice(0, -1)), a(function () {
    JsBarcode("#barcode").options({font: "OCR-B"}).EAN13(s, {fontSize: 11, textMargin: 0, height: 20}).render()
  }, 2e3)
}]).controller("CheckOutCtrl", ["appointmentService", function () {
}]), angular.module("appointments").config(["$stateProvider", function (e) {
  e.state("appointments.add", {
    parent: "appointments",
    url: "/add?visitor",
    templateUrl: "app/appointments/form/form.html",
    controller: "AFormCtrl",
    controllerAs: "formCtrl",
    data: data("Add Appointments", "fa fa-plus-square", "appointments.all")
  }).state("appointments.edit", {
    parent: "appointments",
    url: "/edit?_id&visitor",
    templateUrl: "app/appointments/form/form.html",
    controller: "AFormCtrl",
    controllerAs: "formCtrl",
    data: data("Edit Appointments", "fa fa-plus-square", "appointments.all")
  })
}]), angular.module("appointments").controller("AFormCtrl", ["appointmentService", "$state", "$stateParams", "utility", "formService", "userService", "visitorService", "$filter", function (e, t, i, a, r, s, n, l) {
  function o(e) {
    e.preventDefault(), e.stopPropagation(), this.opened = !this.opened
  }
  
  function d() {
    var e = [];
    if (!r.isEmpty(m.viewModel.purpose) && "personal" === m.viewModel.purpose.toLowerCase()) {
      var t = moment(m.viewModel.start_date).weekday(), i = moment.weekdaysShort(t), a = l("date")(m.viewModel.start_time, "HH:mm:ss").substr(0, 2), s = l("date")(m.viewModel.end_time, "HH:mm:ss").substr(0, 2);
      "Tue" !== i && "Thu" !== i ? e.push("Personal visitors are only allowed on Tuesday and Thursday between 1pm and 3pm") : (13 > a || a > 15 || s > 15) && e.push("Personal visits are only allowed between the hours of 1pm and 3pm on Tuesday and Thursday")
    }
    return {purpose: e}
  }
  
  function c(e) {
    e && (m.viewModel = e, m.selected.host = m.viewModel.host, m.selected.visitor = m.viewModel.visitor);
    var t = angular.isString(m.viewModel.start_date) ? m.viewModel.start_date : l("date")(m.viewModel.start_date, "yyyy-MM-dd"), i = angular.isString(m.viewModel.end_date) ? m.viewModel.end_date : l("date")(m.viewModel.end_date, "yyyy-MM-dd"), a = angular.isString(m.viewModel.start_time) ? m.viewModel.start_time : l("date")(m.viewModel.start_time, "HH:mm:ss"), r = angular.isString(m.viewModel.end_time) ? m.viewModel.end_time : l("date")(m.viewModel.end_time, "HH:mm:ss");
    m.viewModel.host = [m.selected.host.last_name, m.selected.host.first_name].join(" "), m.viewModel.visitor = [m.selected.visitor.last_name, m.selected.visitor.first_name].join(" "), m.viewModel.start_time = moment([t, a].join(" "), "YYYY-MM-DD HH:mm:ss").toDate(), m.viewModel.end_time = moment([i, r].join(" "), "YYYY-MM-DD HH:mm:ss").toDate()
  }
  
  var p = 2, m = this;
  m.errorMsg = {}, m.viewModel = {}, m.viewModel.start_date = new Date, m.viewModel.end_date = new Date, m.viewModel.start_time = new Date, m.viewModel.end_time = moment().add(30, "m").toDate(), m.column = 12 / p, m.selected = {}, m.model = e.model, m.form = r.modelToForm(m.model, p), m.visitor = {
    exists: !r.isEmpty(i.visitor),
    _id: i.visitor
  }, m.visitor.exists && n.get(m.visitor._id).then(function (e) {
    m.selected.visitor = e, m.viewModel.visitor = [e.last_name, e.first_name].join(" "), m.model.visitor.formType = "text"
  }).catch();
  var u = i._id;
  u && e.get(u).then(function (e) {
    c(e)
  }).catch(function (e) {
    console.log(e)
  }), m.save = function () {
    e.validate(m.viewModel).then(function (i) {
      d(), a.isEmptyObject(i) ? (m.viewModel.host = m.selected.host._id, m.viewModel.visitor = m.selected.visitor._id, m.viewModel.start_date = l("date")(m.viewModel.start_date, "yyyy-MM-dd"), m.viewModel.end_date = l("date")(m.viewModel.end_date, "yyyy-MM-dd"), m.viewModel.start_time = l("date")(m.viewModel.start_time, "HH:mm:ss"), m.viewModel.end_time = l("date")(m.viewModel.end_time, "HH:mm:ss"), console.log(m.viewModel.end_time = l("date")(m.viewModel.end_time, "HH:mm:ss")), e.save(m.viewModel).then(function () {
        t.go("appointments.all")
      }).catch(function (e) {
        c(), angular.merge(m.errorMsg, e)
      })) : m.errorMsg = i
    }).catch(function (e) {
      console.log(e)
    })
  }, m.validateField = function (t) {
    m.errorMsg[t] = [];
    var i = {};
    -1 !== ["start_time", "end_time"].indexOf(t) ? (m.errorMsg.start_time = [], m.errorMsg.end_time = [], new Date(m.viewModel.start_time).getTime() > new Date(m.viewModel.end_time).getTime() && (m.viewModel.end_time = moment(m.viewModel.start_time).add(30, "m")), i = e.dateTimeValidation(m.viewModel.start_time, m.viewModel.end_time, "time")) : -1 !== ["start_date", "end_date"].indexOf(t) && (m.errorMsg.start_date = [], m.errorMsg.end_date = [], new Date(m.viewModel.start_date).getTime() > new Date(m.viewModel.end_date).getTime() && (m.viewModel.end_date = m.viewModel.start_date), i = e.dateTimeValidation(m.viewModel.start_date, m.viewModel.end_date, "date")), m.model.hasOwnProperty(t) && e.validateField(m.viewModel[t], t, m.viewModel._id).then(function (e) {
      m.errorMsg[t] = e, m.errorMsg = angular.merge(m.errorMsg, i)
    }).catch(function (e) {
      console.log(e)
    })
  }, m.date = {start_date: {opened: !1, open: o}, end_date: {opened: !1, open: o}}, m.time = {
    start_time: {
      hstep: 1,
      mstep: 15,
      ismeridian: !0,
      toggleMode: function () {
        this.ismeridian = !this.ismeridian
      }
    }, end_time: {
      hstep: 1, mstep: 15, ismeridian: !0, toggleMode: function () {
        this.ismeridian = !this.ismeridian
      }
    }
  }, m.typeahead = {
    host: {
      get: function (e) {
        return s.all({q: e, "only-fields": "first_name,last_name,phone"}).then(function (e) {
          return e.results.map(function (e) {
            return {name: [e.last_name, e.first_name].join(" "), _id: e._id}
          })
        }).catch(function (e) {
          console.log(e)
        })
      }, onSelect: function (e) {
        m.selected.host = e
      }, editable: !1, disabled: !1
    }, visitor: {
      get: function (e) {
        return n.all({q: e, "only-fields": "first_name,last_name,phone"}).then(function (e) {
          return e.results.map(function (e) {
            return {name: [e.last_name, e.first_name].join(" "), _id: e._id}
          })
        }).catch(function (e) {
          console.log(e)
        })
      }, onSelect: function (e) {
        m.selected.visitor = e
      }, editable: !1, disabled: m.visitor.exists
    }
  }, m.placeholder = r.placeholder, m.cancel = function () {
    t.go("appointments.all")
  }
}]), angular.module("appointments").config(["$stateProvider", function (e) {
  e.state("appointments.all", {
    url: "/all",
    parent: "appointments",
    templateUrl: "app/appointments/all/all.html",
    controller: "AppointmentsAllCtrl",
    controllerAs: "allCtrl",
    resolve: {
      currentState: ["appointmentService", function (e) {
        return e.getState().catch(function () {
          return {}
        })
      }]
    }
  })
}]), angular.module("appointments").controller("AppointmentsAllCtrl", ["appointmentService", "changesService", "currentState", function (e, t, i) {
  function a() {
    var e = n.get() || {};
    s.pagination = e.pagination || {}, s.pagination.maxSize = s.pagination.maxSize || 100, s.pagination.itemsPerPage = s.pagination.itemsPerPage || 10, s.orderByColumn = e.orderByColumn || {}, 0 === Object.keys(e.orderByColumn || {}).length && (s.orderByColumn.created = s.orderByColumn.created || !0)
  }
  
  function r(t) {
    return s.orderByColumn[t] ? s.orderByColumn[t].reverse = !s.orderByColumn[t].reverse : (s.orderByColumn = {}, s.orderByColumn[t] = {reverse: !0}), l.orderByColumn = s.orderByColumn, e.setState(l).catch(function (e) {
      console.log(e)
    }), s.orderByColumn
  }
  
  var s = this, n = e.cache(), l = i || {};
  s.inProgress = !1, s.items = [], a(), s.updateView = function (t) {
    var i = {};
    if (angular.isDefined(s.pagination.currentPage) ? i.page = s.pagination.currentPage : s.pagination.currentPage = 1, angular.isDefined(s.pagination.itemsPerPage) ? i.limit = s.pagination.itemsPerPage : s.pagination.itemsPerPage = 10, t) {
      var a = r(t);
      i.order_by = a[t].reverse ? t : ["-", t].join("")
    }
    e.all(i).then(function (t) {
      s.items = t.results, s.pagination.totalItems = t.count, s.pagination.numPages = Math.ceil(s.pagination.totalItems / s.pagination.itemsPerPage), l.pagination = s.pagination, l.orderByColumn = s.orderByColumn, l.lastCheckTime = (new Date).getTime(), e.setState(l).catch(function (e) {
        console.log(e)
      })
    }).catch(function (e) {
      console.log(e)
    })
  }, s.status = e.status, s.updateView(), t.pollForChanges(s, e, "appointments")
}]), angular.module("validation", ["core"]), angular.module("validation").service("validationService", ["$q", function (e) {
  var t = this, i = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i, a = /^[A-Za-z0-9_]{3,20}$/;
  t.BASIC = function (e) {
    e = e || {};
    var t = {
      required: !0,
      pattern: "",
      checkLength: !1,
      minLength: 0,
      maxLength: 0,
      unique: !1,
      dbName: "",
      type: "basic"
    };
    for (var i in e)e.hasOwnProperty(i) && (t[i] = e[i]);
    return t
  }, t.INT = function (e) {
    var t = {
      required: !1,
      pattern: "/^[0-9]/",
      checkLength: !1,
      minLength: 0,
      maxLength: 0,
      unique: !1,
      dbName: "",
      type: "int"
    };
    for (var i in e)e.hasOwnProperty(i) && (t[i] = e[i]);
    return t
  }, t.EMAIL = function (e) {
    var t = {
      required: !1,
      pattern: i,
      checkLength: !1,
      unique: !1,
      dbName: "",
      fieldName: "",
      dataList: [],
      type: "email"
    };
    for (var a in e)e.hasOwnProperty(a) && (t[a] = e[a]);
    return t
  }, t.USERNAME = function (e) {
    var t = {required: !1, pattern: a, checkLength: !0, minLength: 3, maxLength: 20, unique: !0, type: "username"};
    for (var i in e)e.hasOwnProperty(i) && (t[i] = e[i]);
    return t
  }, t.validateRequired = function (e, i) {
    var a = i || t.BASIC();
    return "" !== e && void 0 !== e || !a.required ? [] : ["This field is required"]
  }, t.validateStringLength = function (e, i) {
    var a = i || t.BASIC(), r = [];
    return a.checkLength && a.minLength > e.length && r.push("character length is less than " + a.minLength), a.checkLength && 0 !== a.maxLength && e.length > a.maxLength && r.push("you have exceeded the maximum characters allowed (" + a.maxLength + ")"), r
  }, t.validateInt = function (e, i) {
    var a = i || t.BASIC(), r = [];
    return "" !== a.pattern && a.pattern.test(e) && r.push("Only integers are allowed."), r
  }, t.validateEmail = function (e, i) {
    var a = i || t.EMAIL(), r = [];
    return t.isEmpty(e) || a.pattern.test(e) || r.push("invalid email provided"), r
  }, t.validateUnique = function (i, a, r) {
    var s = e.defer();
    if (a = a || {}, a.unique && a.hasOwnProperty("serviceInstance") && !t.isEmpty(i)) {
      var n = {};
      return n[a.fieldName] = i, t.isEmpty(r) || (n["_id-ne"] = r), a.serviceInstance.all(n).then(function (e) {
        return e.count > 0 ? [[a.fieldName, "already exists, kindly provide another"].join(" ")] : []
      })
    }
    return s.resolve([]), s.promise
  }, t.validateFields = function (i, a, r) {
    var s = {};
    return angular.isObject(i) && Object.keys(i).length > 0 && Object.keys(i).forEach(function (e) {
      s[e] = t.validateField(i[e], a[e], r)
    }), e.all(s)
  }, t.validateField = function (e, i, a) {
    var r = [], s = t.validateRequired(i, e), n = angular.isDefined(i) ? t.validateStringLength(i, e) : [], l = "email" === e.type && angular.isDefined(i) ? t.validateEmail(i, e) : [], o = "int" === e.type && angular.isDefined(i) ? t.validateInt(i, e) : [], d = r.concat(s, n, l, o);
    return t.validateUnique(i, e, a).then(function (e) {
      return d.concat(e)
    })
  }, t.isEmpty = function (e) {
    return void 0 === e || "" === e || null === e
  }, t.eliminateEmpty = function (e) {
    var t = {};
    for (var i in e)e.hasOwnProperty(i) && e[i].length > 0 && (t[i] = e[i]);
    return t
  }, t.mergeErrorMsg = function (e, t) {
    for (var i in t)t.hasOwnProperty(i) && e.hasOwnProperty(i) ? e[i] = e[i].concat(t[i]) : t.hasOwnProperty(i) && (e[i] = t[i]);
    return e
  }
}]), angular.module("utility", []), angular.module("utility").service("utility", ["$filter", "config", function (e, t) {
  this.formatDate = function (i, a) {
    var r = a || t.dateFormat;
    return e("date")(new Date(i), r)
  }, this.takeFirst = function (e) {
    return e[0]
  }, this.extractDate = function (e) {
    return new Date(this.formatDate(e))
  }, this.isValidDate = function (e) {
    return e && null !== e && "Invalid Date" !== new Date(e).toString()
  }, this.isEmptyObject = function (e) {
    return "[object Object]" === toString.call(e) && 0 === Object.keys(e).length
  }, this.contains = function (e, t) {
    return -1 !== e.indexOf(t)
  }, this.capitalize = function (e) {
    return e.replace(/\w\S*/g, function (e) {
      return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
    })
  }, this.hashBy = function (e, t) {
    var i = {};
    return e.forEach(function (e) {
      var a = e[t];
      i[a] = e
    }), i
  }, this.getUUID = function () {
    var e = Date.now();
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (t) {
      var i = (e + 16 * Math.random()) % 16 | 0;
      return e = Math.floor(e / 16), ("x" === t ? i : 7 & i | 8).toString(16)
    })
  }, this.chunk = function (e, t) {
    t = t || 1;
    for (var i = []; e.length > 0;)i.push(e.splice(0, t));
    return i
  }, this.timeSince = function (e) {
    if (!e || null === e || "Invalid Date" === new Date(e).toString())return "Never";
    "object" != typeof e && (e = new Date(e));
    var t, i = Math.floor((new Date - e) / 1e3), a = Math.floor(i / 31536e3);
    return a >= 1 ? t = "year" : (a = Math.floor(i / 2592e3), a >= 1 ? t = "month" : (a = Math.floor(i / 86400), a >= 1 ? t = "day" : (a = Math.floor(i / 3600), a >= 1 ? t = "hour" : (a = Math.floor(i / 60), a >= 1 ? t = "minute" : (a = i, t = "second"))))), (a > 1 || 0 === a) && (t += "s"), a + " " + t
  }
}]), angular.module("sidebar", ["core", "config"]), angular.module("sidebar").service("sidebarService", ["$state", function (e) {
  this.get = function () {
    for (var t = [], i = {}, a = e.get(), r = a.length; r--;) {
      var s = a[r];
      if (s.hasOwnProperty("data") && s.data.hasOwnProperty("label") && s.data.hasOwnProperty("menu") && !i.hasOwnProperty(s.data.label) && s.data.menu) {
        i[s.data.label] = !0;
        var n = s.data;
        n.link = s.data.link || s.name, t.push(s.data)
      }
    }
    return t.sort(function (e, t) {
      return e.order - t.order
    }), t
  }
}]), angular.module("sidebar").controller("SidebarCtrl", ["$state", "config", "sidebarService", function (e, t, i) {
  this.name = t.name, this.items = i.get()
}]), angular.module("ngVPrint", []), angular.module("ngVPrint").directive("ngPrint", function () {
  function e(e, a, r) {
    a.on("click", function () {
      var e = document.getElementById(r.printElementId);
      e && t(e)
    }), window.onafterprint = function () {
      i.innerHTML = ""
    }
  }
  
  function t(e) {
    var t = e.cloneNode(!0);
    i.appendChild(t), window.print()
  }
  
  var i = document.getElementById("printSection");
  return i || (i = document.createElement("div"), i.id = "printSection", document.body.appendChild(i)), {
    restrict: "A",
    link: e
  }
}), angular.module("navbar", ["core", "config"]), angular.module("navbar").service("navbarService", ["$state", function (e) {
  this.get = function () {
    function t(e) {
      return !e.abstract && e.data && e.data.label
    }
    
    function i(e) {
      var t = !1, i = e.name.split(".")[0];
      return r[i] || (r[i] = t = !0), t
    }
    
    function a(e) {
      return {name: e.name, label: e.data.label}
    }
    
    var r = {}, s = e.get();
    return s.filter(t).filter(i).map(a)
  }
}]), angular.module("navbar").controller("NavbarCtrl", ["$state", "config", "navbarService", function (e, t, i) {
  this.name = t.name, this.items = i.get()
}]), angular.module("mailer", []), angular.module("mailer").service("mandrillService", ["$http", function (e) {
  function t() {
    var e = this;
    e.to = [], this.setHTML = function (t) {
      e.html = t
    }, this.setText = function (t) {
      e.text = t
    }, this.setSubject = function (t) {
      e.subject = t
    }, this.setSender = function (t, i) {
      e.from_email = t, e.from_name = i
    }, this.addRecipients = function (t) {
      e.to = e.to.concat(t)
    }, this.addRecipient = function (t) {
      e.to.push(t)
    }
  }
  
  var i = {};
  this.setConfig = function (e) {
    i = e
  }, this.getConfig = function () {
    return i
  }, this.Email = function () {
    return new t
  }, this.send = function (t) {
    var a = {key: i.apiKey, message: t}, r = {method: "POST", url: i.apiUrl, data: a};
    return e(r)
  }
}]), angular.module("mailer").service("mailerService", ["mandrillService", function (e) {
  var t = {};
  this.setConfig = function (i) {
    t = i, e.setConfig(t)
  }, this.getConfig = function () {
    return t
  }, this.Email = function () {
    return e.Email()
  }, this.send = function (t) {
    return e.send(t)
  }
}]), angular.module("log").service("log", ["$log", "toastr", "ERROR_MESSAGES", "WARNING_MESSAGES", "INFO_MESSAGES", "SUCCESS_MESSAGES", "$cookies", function (e, t, i, a, r, s, n) {
  function l(e, i, a, r) {
    angular.isObject(i) || (i = {log: i, toastr: i});
    var s = a[e] || {message: ""}, n = [s.message];
    return r && n.push(r), ("error" === i.log || "warn" === i.log) && n.push(s.remedy), n = n.join(". ") + ".", t[i.toastr](n, s.title)
  }
  
  function o(e, t, i) {
    var a = n.getObject("vi-persistent") || [];
    a.push({key: e, message: t, type: i}), n.putObject("vi-persistent", a)
  }
  
  function d() {
    for (var e = n.getObject("vi-persistent") || [], t = e.length; t--;) {
      var i = e[t];
      c.hasOwnProperty(i.type) && c[i.type](i.key, i.type, i.message)
    }
    n.remove("vi-persistent")
  }
  
  var c = this;
  c.error = function (e, a) {
    return 1 === arguments.length && angular.isDefined(arguments[0]) && !i.hasOwnProperty(e) ? t.error(arguments[0], "Error") : l(e, "error", i, a)
  }, c.warning = function (e, t) {
    var i = {log: "warn", toastr: "warning"};
    return l(e, i, a, t)
  }, c.info = function (e, t) {
    return l(e, "info", r, t)
  }, c.success = function (e, t) {
    var i = {log: "log", toastr: "success"};
    return l(e, i, s, t)
  }, c.persist = {
    error: function (e, t) {
      return o(e, t, "error")
    }, warn: function (e, t) {
      return o(e, t, "warn")
    }, success: function (e, t) {
      return o(e, t, "success")
    }, info: function (e, t) {
      return o(e, t, "info")
    }, load: d
  }
}]), angular.module("form", ["utility"]), angular.module("form").service("formService", ["utility", function (e) {
  var t = this;
  t.chunk = function (t, i) {
    return i = i || 2, e.chunk(t, i)
  }, t.modelToForm = function (e, i, a) {
    a = a || {};
    var r = [];
    for (var s in e)if (e.hasOwnProperty(s) && !e[s].hasOwnProperty("hidden")) {
      var n = a[s] || {};
      e[s].fieldName = e[s].fieldName || s, e[s].options = e[s].options || {}, e[s].options = angular.merge({}, e[s].options, n), r.push(e[s])
    }
    return t.chunk(r, i)
  }, t.placeholder = function (e, t) {
    var i = ["Enter", e, "Here"].join(" ");
    return t || i
  }, t.isEmpty = function (e) {
    return void 0 === e || "" === e || null === e
  }, t.phonePrefixes = function () {
    return ["0701", "0703", "0705", "0706", "0708", "0802", "0803", "0804", "0805", "0806", "0807", "0808", "0809", "0810", "0811", "0812", "0813", "0814", "0815", "0816", "0817", "0818", "0819", "0909", "0902", "0903", "0905", "Others"]
  }, t.eliminateEmpty = function (e) {
    var t = {};
    for (var i in e)e.hasOwnProperty(i) && e[i].length > 0 && (t[i] = e[i]);
    return t
  }, t.mergeErrorMsg = function (e, t) {
    for (var i in t)t.hasOwnProperty(i) && e.hasOwnProperty(i) ? e[i] = e[i].concat(t[i]) : t.hasOwnProperty(i) && (e[i] = t[i]);
    return e
  }
}]), angular.module("footer", ["core", "config"]), angular.module("footer").controller("FooterCtrl", ["config", function (e) {
  this.year = (new Date).getFullYear(), this.author = e.author, this.version = e.version
}]), angular.module("eha-drag-n-drop", []).directive("ehaDraggable", function () {
  return {
    scope: {dragStartHandler: "=dragStart"}, link: function (e, t) {
      console.log(e), t[0].addEventListener("dragstart", e.dragStartHandler, !1)
    }
  }
}), angular.module("dialog", ["dialogs.main"]).config(["$translateProvider", function (e) {
  e.translations("en", {
    DIALOGS_YES: "Yes",
    DIALOGS_NO: "No"
  }), e.preferredLanguage("en"), e.useSanitizeValueStrategy("sanitize")
}]), angular.module("dialog").service("dialog", ["dialogs", "$q", function (e, t) {
  var i = this;
  i.confirm = function (i, a, r) {
    var s = t.defer();
    a = a || "Confirmation Dialog", i = i || "", r = r || {};
    var n = {size: "sm", animation: !0};
    return e.confirm(a, i, angular.merge({}, r, n)).result.then(function (e) {
      s.resolve(e)
    }, function (e) {
      s.reject(e)
    }), s.promise
  }
}]), angular.module("db").service("pouchUtil", ["$q", function (e) {
  function t(e, t) {
    function i(e) {
      return e[t]
    }
    
    return e.rows.map(i)
  }
  
  this.key = function (e) {
    return {startkey: e, endkey: e + "￰"}
  }, this.pluckIDs = function (e) {
    return t(e, "id")
  }, this.pluckValues = function (e) {
    return t(e, "value")
  }, this.pluckDocs = function (e) {
    return t(e, "doc")
  }, this.rejectIfEmpty = function (t) {
    return 0 === t.length ? e.reject({code: 404, msg: "No document found"}) : t
  }
}]), angular.module("db").service("dbService", ["config", "pouchDB", "driverService", "utility", "$cookies", function (e, t, i, a, r) {
  var s = this, n = i.get();
  s.get = function (e, t, i) {
    return n.get(e, t, i)
  }, s.all = function (e, t) {
    return n.all(e, t)
  }, s.save = function (e, t, i) {
    return t.hasOwnProperty("_id") ? (t.modified = (new Date).toJSON(), t.modified_by = s.currentUser()._id, t.created_by = t.created_by || s.currentUser()._id) : (t._id = a.getUUID(), t.created = (new Date).toJSON(), t.created_by = s.currentUser()._id), n.put(e, t, i)
  }, s.remove = function (e, t) {
    return n.remove(e, t)
  }, s.currentUser = function () {
    return r.getObject("vi-user")
  }, s.db = n, s.tables = {
    APPOINTMENT: "appointment",
    APPOINTMENT_LOGS: "appointment-logs",
    COMPANIES: "company",
    DEPARTMENT: "department",
    ENTRANCE: "entrance",
    RESTRICTED_ITEMS: "restricted-items",
    USER: "user",
    VEHICLES: "vehicle",
    VISITOR: "visitor",
    VISITORS_GROUP: "visitor-group"
  }
}]), angular.module("core", ["ui.router", "ui.bootstrap"]), angular.module("m.config", ["config"]), angular.module("m.config").service("configService", ["config", "$window", function (e, t) {
  function i(e) {
    return void 0 === e || "" === e || null === e
  }
  
  var a = this;
  a.apiUrl = function () {
    var a = e.api.protocol || t.location.protocol;
    return i(e.api.url) ? [a, "//", t.location.hostname, ":", e.api.port, e.api.path].join("") : e.api.url
  }, this.api = {url: a.apiUrl()}
}]), angular.module("changes", []), angular.module("changes").service("changesService", ["dbService", "$rootScope", "$interval", "config", function (e, t, i, a) {
  var r = "_changes", s = this;
  s.get = function (t, i) {
    return e.get(r, t, i)
  }, s.all = function (t) {
    return e.all(r, t)
  }, s.hasChanged = function (e, t) {
    if (!e)return !1;
    var i = {model: e, load: "changes", limit: 1, order_by: "-created"};
    return t && (i["last-checked"] = t), s.all(i).then(function (e) {
      return e.count > 0
    })
  }, this.pollForChanges = function (e, r, n) {
    t.resetTimer = i(function () {
      if (!e.inProgress) {
        e.inProgress = !0;
        var t = {};
        r.getState().then(function (e) {
          return t = e || t, s.hasChanged(n, t.lastCheckTime)
        }).then(function (i) {
          return i ? void e.updateView() : (e.inProgress = !1, t.lastCheckTime = (new Date).getTime(), r.setState(t))
        }).catch(function () {
          return e.inProgress = !1, t.lastCheckTime = (new Date).getTime(), r.setState(t)
        })
      }
    }, a.refreshIntervals || 3e3)
  }
}]), angular.module("vi.camera", ["core"]), angular.module("vi.camera").service("cameraService", ["$window", function (e) {
  var t = function () {
    return !!i()
  }, i = function () {
    return navigator.getUserMedia = e.navigator.getUserMedia || e.navigator.webkitGetUserMedia || e.navigator.mozGetUserMedia || e.navigator.msGetUserMedia, navigator.getUserMedia
  };
  return {hasUserMedia: t(), getUserMedia: i}
}]), angular.module("vi.camera").directive("viCamera", ["cameraService", function (e) {
  return {
    restrict: "EA",
    replace: !0,
    transclude: !0,
    scope: {},
    controller: ["$state", "$scope", "$timeout", "$q", function (e, t, i, a) {
      this.takeSnapshot = function () {
        var e = document.querySelector("canvas"), r = e.getContext("2d"), s = document.querySelector("video"), n = a.defer();
        return e.width = t.w, e.height = t.h, i(function () {
          r.fillRect(0, 0, t.w, t.h), r.drawImage(s, 0, 0, t.w, t.h), n.resolve(e.toDataURL())
        }, 0), n.promise
      }
    }],
    template: '<div class="camera"><video class="camera" autoplay="" width="300px" /><div ng-transclude></div></div>',
    link: function (t, i, a) {
      var r = a.width || 280, s = a.height || 300;
      if (e.hasUserMedia) {
        var n = (e.getUserMedia(), document.querySelector("video")), l = function (e) {
          if (navigator.mozGetUserMedia)n.mozSrcObject = e; else {
            {
              window.URL || window.webkitURL
            }
            n.src = window.URL.createObjectURL(e)
          }
          n.play()
        }, o = function (e) {
          console.error(e)
        };
        navigator.getUserMedia({video: {mandatory: {maxHeight: s, maxWidth: r}}, audio: !1}, l, o), t.w = r, t.h = s
      }
    }
  }
}]).directive("cameraControlSnapshot", ["$rootScope", function (e) {
  return {
    restrict: "EA",
    require: "^viCamera",
    scope: !0,
    template: '<a class="btn btn-info" ng-model="formCtrl.viewModel.image" ng-change="takenSnapshot()" ng-click="takeSnapshot()"><i class="fa fa-eye"></i> Take snapshot</a><span style="margin-left: 10px" class="btn btn-danger" ng-click="closeCameraNow()"><i class="fa fa-times-circle-o"></i> Close Camera</span>',
    link: function (t, i, a, r) {
      t.takeSnapshot = function () {
        r.takeSnapshot().then(function (t) {
          e.takenImg = t, e.$broadcast("picTaken", {image: t})
        })
      }
    }
  }
}]), angular.module("cache", ["ngCookies"]), angular.module("cache").service("cache", ["$cookies", function (e) {
  var t = this, i = "vi-cache-params";
  t.VIEW_KEY = "", t.get = function () {
    var a = e.getObject(i) || {};
    return a.hasOwnProperty(t.VIEW_KEY) ? a[t.VIEW_KEY] : {}
  }, t.set = function (a, r) {
    var s = e.getObject(i) || {};
    s = s.hasOwnProperty(t.VIEW_KEY) ? s[t.VIEW_KEY] : {}, s[a] = r;
    var n = {};
    return n[t.VIEW_KEY] = s, e.putObject(i, n)
  }, this.getView = function () {
    return t.VIEW_KEY
  }
}]), angular.module("breadcrumbs", ["core", "config"]), angular.module("breadcrumbs").directive("viBreadcrumbs", ["$log", "breadcrumbService", function () {
  return {
    restrict: "AE", template: "this is the breadcrumbs", replace: !0, compile: function () {
      return function () {
      }
    }
  }
}]), angular.module("breadcrumbs").service("breadcrumbsService", ["$state", "utility", function (e, t) {
  function i() {
    for (var e = {}, t = r.length; t--;) {
      var i = r[t];
      e[i.name] = i
    }
    return e
  }
  
  var a = this, r = e.get(), s = i();
  a.get = function (e) {
    return s[e] || {}
  }, a.all = function () {
    return s
  }, a.getBreadCrumbs = function (e) {
    var t = [], i = e.data || {};
    return "home" !== e.name && e.hasOwnProperty("data") && t.push({
      name: e.data.label,
      url: e.name,
      last: !0
    }), a.getParent(t, i.parent), t
  }, a.getParent = function (e, i) {
    var r = a.get(i), s = r.data || {};
    t.isEmptyObject(r) || (r.hasOwnProperty("data") && e.unshift({
      name: r.data.label,
      url: r.data.link
    }), a.getParent(e, s.parent))
  }
}]), angular.module("breadcrumbs").controller("BreadcrumbsCtrl", ["$state", "$rootScope", "breadcrumbsService", function (e, t, i) {
  var a = this;
  a.breadcrumbs = i.getBreadCrumbs(e.current), t.$on("$stateChangeStart", function (e, t) {
    a.breadcrumbs = i.getBreadCrumbs(t)
  })
}]), angular.module("auth", ["core", "utility", "m.config"]),angular.module("auth").service("authService", ["$q", "$cookies", "log", "dbService", function (e, t, i, a) {
  var r = this;
  r.login = function (e, i) {
    return a.db.post("login", {username: e, password: i}).then(function (e) {
      var i = e;
      return t.putObject("vi-token", i.token), t.putObject("vi-user", i.user), e
    })
  }, r.logout = function () {
    t.remove("vi-token"), t.remove("vi-user")
  }, r.loggedIn = function () {
    return angular.isDefined(t.getObject("vi-token"))
  }, r.currentUser = function () {
    return t.getObject("vi-user")
  }, r.updateCurrentUser = function (e) {
    var i = r.currentUser();
    for (var a in e)e.hasOwnProperty(a) && (i[a] = e[a]);
    t.putObject("vi-user", i)
  }
}]),angular.module("visitorsGroup").config(["$stateProvider", function (e) {
  e.state("visitorsGroup", {
    url: "/visitors-group",
    parent: "index",
    "abstract": !0,
    templateUrl: "app/visitors-group/visitors-group.html",
    data: {label: "Visitors Group", menu: !0, icon: "fa fa-sitemap", link: "visitorsGroup.all", order: 5}
  })
}]),angular.module("visitorsGroup").service("visitorsGroupService", ["dbService", "validationService", "authService", function (e, t) {
  var i = e.tables.VISITORS_GROUP, a = this;
  a.model = {
    name: t.BASIC({
      required: !0,
      unique: !0,
      fieldName: "name",
      serviceInstance: a,
      label: "Group",
      formType: "text"
    }),
    black_listed: t.BASIC({
      required: !1,
      fieldName: "black_listed",
      serviceInstance: a,
      label: "Black Listed ?",
      formType: "checkbox"
    })
  }, a.get = function (t) {
    return e.get(i, t)
  }, a.all = function (t, a) {
    return e.all(i, t, a)
  }, a.remove = function (t, a) {
    return e.remove(i, t, a)
  }, a.save = function (t, a) {
    return e.save(i, t, a)
  }, a.validateField = function (e, i, r) {
    return t.validateField(a.model[i], e, r)
  }, a.choices = function () {
    return a.all().then(function (e) {
      for (var t = [], i = e.count; i--;) {
        var a = e.results[i];
        t.push({value: a._id, text: a.name})
      }
      return t
    })
  }, a.validate = function (e) {
    return t.validateFields(a.model, e, e._id).then(function (e) {
      return t.eliminateEmpty(angular.merge({}, e))
    })
  }
}]),angular.module("visitors").config(["$stateProvider", function (e) {
  e.state("visitors", {
    url: "/visitors",
    parent: "index",
    "abstract": !0,
    templateUrl: "app/visitors/visitors.html",
    data: {label: "Visitors", menu: !0, icon: "fa fa-street-view", link: "visitors.all", order: 4}
  })
}]),angular.module("visitors").service("visitorService", ["dbService", "validationService", "authService", function (e, t) {
  function i(e) {
    var t = {};
    for (var i in e)e.hasOwnProperty(i) && e[i].length > 0 && (t[i] = e[i]);
    return t
  }
  
  var a = "visitor", r = this;
  r.model = {
    first_name: t.BASIC({
      required: !0,
      fieldName: "first_name",
      pattern: /^[a-zA-Z]/,
      label: "First Name",
      formType: "text"
    }),
    last_name: t.BASIC({
      required: !0,
      fieldName: "last_name",
      pattern: /^[a-zA-Z]/,
      label: "Last Name",
      formType: "text"
    }),
    phone: t.BASIC({
      required: !0,
      unique: !0,
      fieldName: "phone",
      serviceInstance: r,
      label: "Phone",
      formType: "text",
      custom: !0,
      template: "app/visitors/form/partials/phone.html"
    }),
    email: t.EMAIL({
      required: !1,
      unique: !0,
      fieldName: "email",
      serviceInstance: r,
      label: "Email",
      formType: "text"
    }),
    gender: t.BASIC({
      required: !1,
      label: "Gender",
      fieldName: "gender",
      formType: "select",
      choices: [{value: "Male", text: "Male"}, {value: "Female", text: "Female"}]
    }),
    "company.name": t.BASIC({
      required: !1,
      label: "Company Name",
      fieldName: "company.address",
      formType: "typeahead",
      custom: !0,
      template: "app/visitors/form/partials/company.html"
    }),
    "company.address": t.BASIC({
      required: !1,
      label: "Company Address",
      formType: "textarea",
      fieldName: "company.address"
    }),
    occupation: t.BASIC({required: !1, label: "Occupation", formType: "text", fieldName: "occupation"}),
    group: t.BASIC({required: !1, label: "Visitor Group", formType: "select", fieldName: "group"}),
    "phone.prefix": t.BASIC({
      required: !0,
      pattern: /^[0-9]/,
      label: "Phone Prefix",
      formType: "text",
      fieldName: "phone.prefix",
      hidden: !0
    }),
    "phone.suffix": t.BASIC({
      required: !0,
      checkLength: !0,
      maxLength: 7,
      minLength: 7,
      pattern: /^[0-9]/,
      label: "Phone Suffix",
      formType: "text",
      fieldName: "phone.suffix",
      hidden: !0
    })
  }, r.get = function (t, i) {
    return e.get(a, t, i)
  }, r.all = function (t) {
    return e.all(a, t)
  }, r.remove = function (t, i) {
    return e.remove(a, t, i)
  }, r.save = function (t, i) {
    return e.save(a, t, i)
  }, r.validateField = function (e, i, a) {
    return t.validateField(e, i, a)
  }, r.validate = function (e) {
    return t.validateFields(r.model, e, e._id).then(function (e) {
      return i(angular.merge({}, e))
    })
  }, r.getPassCode = function () {
  }, r.updateForPhone = function (e) {
    return (e.hasOwnProperty("phone.prefix") || e.hasOwnProperty("phone.suffix")) && (e.phone = []), e
  }, r.updateForPrefix = function (e, t) {
    return e.hasOwnProperty("phone.prefix") && "Others" === t && (e["phone.prefix"] = []), e
  }, r.getPhone = function (e, t) {
    var i = [];
    return r.isEmpty(e) || r.isEmpty(t) || ("Others" !== e && i.push(e), i.push(t)), i.join("")
  }, r.recoverPhone = function (e) {
    var t = {};
    return e.length > 7 ? (t["phone.prefix"] = e.slice(0, 4), t["phone.suffix"] = e.slice(4, e.length)) : e.length <= 7 && (t["phone.prefix"] = "Others", t["phone.suffix"] = e), t
  }, r.isEmpty = t.isEmpty, this.setState = function (e) {
    return e._id = CACHEDB, pouchdb.save(e)
  }, this.getState = function () {
    return pouchdb.get(CACHEDB)
  }
}]),angular.module("users").config(["$stateProvider", function (e) {
  e.state("users", {
    url: "/users",
    parent: "index",
    "abstract": !0,
    templateUrl: "app/users/users.html",
    data: {label: "Users", menu: !0, icon: "fa fa-users", link: "users.all", order: 2}
  })
}]),angular.module("users").service("userService", ["dbService", "validationService", "authService", "$q", "cache", "pouchdb", function (e, t, i, a, r, s) {
  function n(t) {
    var i = a.defer(), r = [e.all(e.tables.APPOINTMENT, {host: t})];
    return a.all(r).then(function (e) {
      var t = [];
      e[0].count > 0 && t.push("User has been tied to appointments before, kindly delete the appointment"), 0 === t.length ? i.resolve([]) : i.reject(t.join("\n"))
    }).catch(function (e) {
      i.reject(e)
    }), i.promise
  }
  
  var l = "user", o = [l, "_cache"].join(""), d = this;
  d.model = {
    username: t.USERNAME({
      required: !0,
      unique: !0,
      fieldName: "username",
      serviceInstance: d,
      label: "Username",
      formType: "text"
    }),
    email: t.EMAIL({
      required: !0,
      unique: !0,
      fieldName: "email",
      serviceInstance: d,
      label: "Email",
      formType: "text"
    }),
    password: t.BASIC({
      required: !0,
      fieldName: "password",
      serviceInstance: d,
      label: "Password",
      formType: "password"
    }),
    password2: t.BASIC({
      required: !0,
      fieldName: "password2",
      serviceInstance: d,
      label: "Confirm Password",
      formType: "password"
    }),
    first_name: t.BASIC({
      required: !0,
      fieldName: "first_name",
      pattern: "/^[a-zA-Z]/",
      label: "First Name",
      formType: "text"
    }),
    last_name: t.BASIC({
      required: !0,
      fieldName: "last_name",
      pattern: "/^[a-zA-Z]/",
      label: "Last Name",
      formType: "text"
    }),
    phone: t.BASIC({
      required: !0,
      unique: !0,
      fieldName: "phone",
      serviceInstance: d,
      label: "Phone",
      formType: "text"
    }),
    work_phone: t.BASIC({
      required: !1,
      unique: !0,
      fieldName: "work_phone",
      serviceInstance: d,
      label: "Work Phone",
      formType: "text"
    }),
    home_phone: t.BASIC({
      required: !1,
      unique: !0,
      fieldName: "home_phone",
      serviceInstance: d,
      label: "Home Phone",
      formType: "text"
    }),
    gender: t.BASIC({
      required: !1,
      label: "Gender",
      fieldName: "gender",
      formType: "select",
      choices: [{value: "Male", text: "Male"}, {value: "Female", text: "Female"}]
    }),
    department: t.BASIC({required: !1, label: "Department", fieldName: "department", formType: "select", choices: []}),
    is_superuser: t.BASIC({required: !1, label: "Super User", formType: "checkbox", fieldName: "is_superuser"}),
    is_staff: t.BASIC({required: !1, label: "Admin Access", formType: "checkbox", fieldName: "is_staff"}),
    is_active: t.BASIC({required: !1, label: "User Active", formType: "checkbox", fieldName: "is_active"})
  }, d.get = function (t, i) {
    return e.get(l, t, i)
  }, d.all = function (t) {
    return e.all(l, t)
  }, d.remove = function (t, i) {
    return n(t).then(function () {
      return e.remove(l, t, i)
    })
  }, d.save = function (t, i) {
    return e.save(l, t, i)
  }, d.currentUser = function () {
    return i.currentUser()
  }, d.updateCurrentUser = function (e) {
    return i.updateCurrentUser(e)
  }, d.validateField = function (e, i, a) {
    return t.validateField(d.model[i], e, a)
  }, d.validate = function (e) {
    var i = {};
    return console.log("here"), e.hasOwnProperty("password") && ("" === e.password ? i.password = ["This field is required"] : e.password !== e.password2 && (i.password = ["Passwords does not match"], i.password2 = ["Passwords does not match"])), t.validateFields(d.model, e, e._id).then(function (e) {
      return t.eliminateEmpty(angular.merge({}, e, i))
    })
  }, d.validatePasswordMatch = function (e, i) {
    var r = a.defer(), s = {};
    return t.isEmpty(e) || t.isEmpty(i) || e === i || (s.password = ["Passwords does not match"], s.password2 = ["Passwords does not match"]), r.resolve(s), r.promise
  }, this.cache = function () {
    return r.VIEW_KEY = l, r
  }, this.setState = function (e) {
    return e._id = o, s.save(e)
  }, this.getState = function () {
    return s.get(o)
  }
}]),angular.module("settings", ["core", "db", "utility", "form"]),angular.module("settings").config(["$stateProvider", function (e) {
  e.state("settings", {
    parent: "index",
    url: "/settings",
    templateUrl: "app/settings/settings.html",
    controller: "SettingsCtrl",
    controllerAs: "settingsCtrl",
    data: {label: "System Settings", menu: !0, link: "settings", icon: "fa fa-cogs", order: 8}
  })
}]),angular.module("settings").service("settingService", ["validationService", "dbService", function (e, t) {
  var i = "settings", a = this;
  this.model = {
    name: e.BASIC({
      pattern: "/^[a-zA-Z]/",
      required: !0,
      unique: !0,
      fieldName: "name",
      serviceInstance: a,
      label: "Company Name",
      formType: "text"
    }), address: e.BASIC({pattern: "/^[a-zA-Z]/", label: "Address", fieldName: "address", formType: "text"})
  }, a.get = function (e, a) {
    return t.get(i, e, a)
  }, a.all = function (e) {
    return t.all(i, e)
  }, a.remove = function (e, a) {
    return t.remove(i, e, a)
  }, a.save = function (e, a) {
    return t.save(i, e, a)
  }, a.validateField = function (t, i) {
    return e.validateField(a.model[i], t)
  }, a.validate = function (t) {
    return e.validateFields(a.model, t, t._id).then(function (t) {
      return e.eliminateEmpty(angular.merge({}, t))
    })
  }
}]),angular.module("settings").controller("SettingsCtrl", ["settingService", function (e) {
  e.all().then(function () {
  }).catch(function () {
  })
}]),angular.module("login", ["core", "config"]),angular.module("login").config(["$stateProvider", function (e) {
  e.state("login", {
    url: "/login",
    views: {login: {templateUrl: "app/login/login.html", controller: "LoginCtrl", controllerAs: "loginCtrl"}}
  }).state("logout", {
    url: "logout", parent: "index", controller: ["authService", "log", "$window", function (e, t, i) {
      e.logout(), i.location.href = "#/login", t.success("logoutSuccess")
    }]
  })
}]),angular.module("login").service("loginService", ["authService", function (e) {
  var t = this;
  t.login = function (t, i) {
    return e.login(t, i)
  }
}]),angular.module("login").controller("LoginCtrl", ["$state", "config", "loginService", "$rootScope", "log", "$window", function (e, t, i, a, r) {
  a.loginMode = !0;
  var s = this;
  s.credentials = {}, s.login = function () {
    angular.isUndefined(s.credentials.username) && angular.isUndefined(s.credentials.password) ? r.error("authInvalid") : i.login(s.credentials.username, s.credentials.password).then(function () {
      e.go("home"), r.success("authSuccess")
    }).catch(function (e) {
      e && r.error("authInvalid")
    })
  }
}]),angular.module("home", ["core"]),angular.module("home").config(["$stateProvider", function (e) {
  e.state("home", {
    parent: "index",
    url: "/",
    controller: "HomeCtrl",
    controllerAs: "homeCtrl",
    templateUrl: "app/home/home.html",
    data: {label: "Dashboard", menu: !0, icon: "fa fa-home", order: 1}
  })
}]),angular.module("home").service("homeService", ["userService", "appointmentService", "visitorService", function () {
}]),angular.module("viLogged", ["ngSanitize", "ngCookies", "core", "breadcrumbs", "sidebar", "navbar", "footer", "home", "log", "auth", "login", "users", "changes", "validation", "departments", "visitors", "appointments", "company", "vi.camera", "visitorsGroup", "dialog", "db", "utility", "ui.calendar", "settings", "cache", "ngVPrint"]).run(["$rootScope", "$state", "log", "authService", "$window", "$interval", function (e, t, i, a, r, s) {
  i.persist.load(), e.$on("$stateChangeStart", function () {
    e.resetTimer && s.cancel(e.resetTimer), a.loggedIn() ? e.currentUser = a.currentUser() : r.location.href = "#/login"
  })
}]).config(["$compileProvider", function (e) {
  e.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/)
}]),angular.module("viLogged").controller("HomeCtrl", ["$window", "log", "utility", "dialog", "appointmentService", function (e, t, i, a, r) {
  var s = this;
  s.eventSources = [], s.uiConfig = {
    calendar: {
      height: 450,
      editable: !0,
      header: {left: "month", center: "title", right: "today prev,next"},
      dayClick: function () {
      },
      eventDrop: function () {
      },
      eventResize: function () {
      }
    }
  }, s.getInProgress = function () {
    r.inProgress().then(function (e) {
      s.inProgress = e.results
    })
  }, s.getUpcoming = function () {
    r.upcoming().then(function (e) {
      s.upcoming = e.results
    })
  }, s.getAwaitingApproval = function () {
    r.awaitingApproval().then(function (e) {
      s.awaitingApproval = e.results
    })
  }, s.getInProgress(), s.getUpcoming(), s.getAwaitingApproval()
}]),angular.module("departments").config(["$stateProvider", function (e) {
  e.state("departments", {
    url: "/departments",
    parent: "index",
    "abstract": !0,
    templateUrl: "app/departments/departments.html",
    data: {label: "Departments", menu: !0, icon: "fa fa-bank", link: "departments.all", order: 6}
  })
}]),angular.module("departments").service("departmentService", ["dbService", "validationService", "$q", function (e, t, i) {
  function a(t) {
    var a = i.defer();
    return e.all(e.tables.USER, {department: t}).then(function (e) {
      e.count > 0 ? a.reject(["Department is still tied to some users", "Kindly reassign Users to another department"].join("\n")) : a.resolve("")
    }).catch(function (e) {
      a.reject(e)
    }), a.promise
  }
  
  var r = "department", s = this;
  s.model = {
    name: t.BASIC({
      pattern: "/^[a-zA-Z]/",
      required: !0,
      unique: !0,
      fieldName: "name",
      serviceInstance: s,
      label: "Department"
    }), floor: t.BASIC({required: !1, label: "Floor"})
  }, s.choices = function () {
    return s.all().then(function (e) {
      for (var t = [], i = e.count; i--;) {
        var a = e.results[i];
        t.push({value: a._id, text: a.name})
      }
      return t
    })
  }, s.get = function (t, i) {
    return e.get(r, t, i)
  }, s.all = function (t, i) {
    return e.all(r, t, i)
  }, s.remove = function (t, i) {
    return a(t).then(function () {
      return e.remove(r, t, i)
    })
  }, s.save = function (t, i) {
    return e.save(r, t, i)
  }, s.validateField = function (e, i) {
    return t.validateField(s.model[i], e)
  }, s.validate = function (e) {
    return t.validateFields(s.model, e, e._id).then(function (e) {
      return t.eliminateEmpty(angular.merge({}, e))
    })
  }
}]),angular.module("company").config(["$stateProvider", function (e) {
  e.state("company", {
    url: "/company",
    "abstract": !0,
    parent: "index",
    templateUrl: "app/company/company.html",
    data: {label: "Companies", menu: !0, order: 7, link: "company.all", icon: "fa fa-building"}
  })
}]),angular.module("company").service("companyService", ["$q", "dbService", "validationService", function (e, t, i) {
  var a = "company", r = this;
  r.model = {
    name: i.BASIC({
      pattern: "/^[a-zA-Z]/",
      required: !0,
      unique: !0,
      fieldName: "name",
      serviceInstance: r,
      label: "Company Name",
      formType: "text"
    }), address: i.BASIC({pattern: "/^[a-zA-Z]/", label: "Address", fieldName: "address", formType: "text"})
  }, r.choices = function () {
    return r.all().then(function (e) {
      for (var t = [], i = e.count; i--;) {
        var a = e.results[i];
        t.push({value: a._id, text: a.name})
      }
      return t
    })
  }, r.get = function (e, i) {
    return t.get(a, e, i)
  }, r.all = function (e) {
    return t.all(a, e)
  }, r.remove = function (e, i) {
    return t.remove(a, e, i)
  }, r.save = function (e, i) {
    return t.save(a, e, i)
  }, r.validateField = function (e, t) {
    return i.validateField(r.model[t], e)
  }, r.validate = function (e) {
    return i.validateFields(r.model, e, e._id).then(function (e) {
      return i.eliminateEmpty(angular.merge({}, e))
    })
  }
}]),angular.module("appointments").config(["$stateProvider", function (e) {
  e.state("appointments", {
    url: "/appointments",
    parent: "index",
    "abstract": !0,
    templateUrl: "app/appointments/appointments.html",
    data: {label: "Appointments", menu: !0, icon: "fa fa-newspaper-o", link: "appointments.all", order: 3}
  })
}]),angular.module("appointments").service("appointmentService", ["dbService", "validationService", "cache", "pouchdb", "$filter", function (e, t, i, a) {
  var r = e.tables.APPOINTMENT, s = [r, "_cache"].join(""), n = this;
  n.model = {
    visitor: t.BASIC({required: !0, fieldName: "visitor", label: "Visitor", formType: "typeahead-remote"}),
    host: t.BASIC({required: !0, fieldName: "host", label: "Host", formType: "typeahead-remote"}),
    start_date: t.BASIC({
      required: !0,
      fieldName: "start_date",
      pattern: "/^[a-zA-Z]/",
      label: "Appointment Start Date",
      formType: "date"
    }),
    end_date: t.BASIC({
      required: !0,
      fieldName: "end_date",
      pattern: "/^[a-zA-Z]/",
      label: "Appointment End Date",
      formType: "date"
    }),
    start_time: t.BASIC({required: !0, fieldName: "start_time", label: "Appointment Start time", formType: "time"}),
    end_time: t.BASIC({
      required: !0,
      fieldName: "end_time",
      serviceInstance: n,
      label: "Appointment End Time",
      formType: "time"
    }),
    representing: t.BASIC({
      required: !1,
      fieldName: "representing",
      serviceInstance: n,
      label: "You are Representing who?",
      formType: "text"
    }),
    purpose: t.BASIC({
      required: !1,
      label: "Purpose of Appointment",
      fieldName: "purpose",
      formType: "select",
      choices: [{value: "personal", text: "Personal"}, {value: "official", text: "Official"}, {
        value: "others",
        text: "Others"
      }]
    }),
    is_approved: t.BASIC({required: !1, label: "Approved", formType: "checkbox", fieldName: "is_approved", hidden: !0}),
    is_expired: t.BASIC({required: !1, label: "Expired", formType: "checkbox", fieldName: "is_expired", hidden: !0}),
    teams: t.BASIC({required: !1, label: "Team Members", formType: "multi-select", fieldName: "teams"}),
    entrance: t.BASIC({required: !1, label: "Entrance", formType: "select", fieldName: "entrance"}),
    escort_required: t.BASIC({
      required: !1,
      label: "Escort Required ?",
      fieldName: "escort_required",
      formType: "checkbox"
    })
  }, n.get = function (t, i) {
    return e.get(r, t, i)
  }, n.all = function (t) {
    return e.all(r, t)
  }, n.remove = function (t, i) {
    return e.remove(r, t, i)
  }, n.save = function (t, i) {
    return e.save(r, t, i)
  }, n.getLog = function (t, i) {
    return e.get(e.tables.APPOINTMENT_LOGS, t, i)
  }, n.allLogs = function (t) {
    return e.all(e.tables.APPOINTMENT_LOGS, t)
  }, n.saveLog = function (t, i) {
    return e.save(e.tables.APPOINTMENT_LOGS, t, i)
  }, n.validateField = function (e, i, a) {
    return t.validateField(n.model[i], e, a)
  }, n.validate = function (e) {
    return t.validateFields(n.model, e, e._id).then(function (e) {
      return t.eliminateEmpty(angular.merge({}, e))
    })
  }, n.dateTimeValidation = function (e, i, a) {
    var r = {}, s = [];
    return t.isEmpty(e) || t.isEmpty(i) || (e = new Date(e), i = new Date(i), e.getTime() > i.getTime() ? s.push("start " + a + " can't be greater than end time") : e.getTime() === i.getTime(), r["start_" + a] = s.length ? s : []), r
  }, n.inProgress = function (e) {
    e = e || {};
    var t = angular.merge({}, {load: "in-progress"}, e);
    return n.all(t)
  }, n.upcoming = function (e) {
    e = e || {};
    var t = angular.merge({}, {load: "upcoming"}, e);
    return n.all(t)
  }, n.awaitingApproval = function (e) {
    e = e || {};
    var t = angular.merge({}, {load: "pending"}, e);
    return n.all(t)
  }, n.rejected = function (e) {
    e = e || {};
    var t = angular.merge({}, {load: "rejected"}, e);
    return n.all(t)
  }, n.status = {REJECTED: 0, UPCOMING: 1, PENDING: 2, EXPIRED: 3, IN_PROGRESS: 4}, n.getStatus = function (e) {
    if (e.hasOwnProperty("status") && n.status.hasOwnProperty(e.status))return n.status[e.status];
    if (e.hasOwnProperty("status") && null === e.status) {
      var t = (new Date(e.start_date).getTime(), (new Date).getTime());
      new Date(e.end_date).getTime() > t
    }
  }, this.cache = function () {
    return i.VIEW_KEY = r, i
  }, this.setState = function (e) {
    return e._id = s, a.save(e)
  }, this.getState = function () {
    return a.get(s)
  }
}]),angular.module("viLogged").config(["$stateProvider", "$urlRouterProvider", function (e, t) {
  t.otherwise("/"), e.state("root", {
    "abstract": !0,
    views: {root: {templateUrl: "app/index.html", controller: "IndexCtrl", controllerAs: "indexCtrl"}}
  }).state("index", {
    parent: "root",
    "abstract": !0,
    views: {
      header: {
        templateUrl: "components/navbar/navbar.html",
        controller: "NavbarCtrl",
        controllerAs: "navbarCtrl"
      },
      sidenav: {templateUrl: "components/sidebar/sidebar.html", controller: "SidebarCtrl", controllerAs: "sidebarCtrl"},
      breadcrumbs: {
        templateUrl: "components/breadcrumbs/breadcrumbs.html",
        controller: "BreadcrumbsCtrl",
        controllerAs: "bcCtrl"
      },
      content: {},
      footer: {templateUrl: "components/footer/footer.html", controller: "FooterCtrl", controllerAs: "footerCtrl"}
    }
  })
}]),angular.module("viLogged").controller("IndexCtrl", ["$rootScope", "log", function (e, t) {
  function i(e) {
    t.error("stateChangeError", e)
  }
  
  e.loginMode = !1, e.$on("$stateChangeError", i)
}]),angular.module("viLogged").run(["$templateCache", function (e) {
  e.put("app/index.html", '<div ui-view="header" id="navbar" class="navbar navbar-default navbar-collapse navbar-fixed-top"></div><div class="main-container" id="main-container"><div ui-view="sidenav" id="sidebar" class="sidebar responsive sidebar-fixed sidebar-scroll"></div><div class="main-content"><div class="main-content-inner"><div ui-view="breadcrumbs"></div><div class="page-content"><div ui-view="content"><div ui-view=""></div></div></div></div></div></div>'), e.put("app/root.html", "<ui-view></ui-view>"), e.put("components/breadcrumbs/breadcrumbs.html", '<div id="breadcrumbs" class="breadcrumbs"><ul class="breadcrumb"><li><i class="ace-icon fa fa-home home-icon"></i> <a ui-sref="home">Home</a></li><li class="active" ng-repeat="item in bcCtrl.breadcrumbs"><a ng-if="!item.last" ui-sref="{{item.url}}" ng-bind="item.name"></a> <span ng-if="item.last" ng-bind="item.name"></span></li></ul></div>'), e.put("components/footer/footer.html", '<div class="footer"><div class="footer-inner"><div class="footer-content"></div></div></div>'), e.put("components/form/partials.html", ""), e.put("components/navbar/navbar.html", '<div class="navbar-container" id="navbar-container"><button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar"><span class="sr-only">Toggle sidebar</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button><div class="navbar-header pull-left"><a ui-sref="home" class="navbar-brand">viLogged VMS</a></div><div class="navbar-buttons navbar-header pull-right" role="navigation"><ul class="nav vi-nav"><li class="light-blue"><a data-toggle="dropdown" href="#" class="dropdown-toggle"><img ng-if="currentUser.image" class="nav-user-photo" ng-src="currentUser.image"> <img ng-show="!currentUser.image" class="nav-user-photo" src="../../assets/avatars/avatar2.png"> <span class="user-info" ng-bind="currentUser.first_name || currentUser.last_name || currentUser.username"></span> <i class="ace-icon fa fa-caret-down"></i></a><ul class="user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close"><li><a ui-sref="users.changePassword"><i class="ace-icon fa fa-cog"></i> Change Password</a></li><li><a ui-sref="users.profile"><i class="ace-icon fa fa-user"></i> Profile</a></li><li class="divider"></li><li><a ui-sref="logout"><i class="ace-icon fa fa-power-off"></i> Logout</a></li></ul></li></ul></div></div>'), e.put("components/sidebar/sidebar.html", '<ul class="nav nav-list"><li ng-repeat="item in sidebarCtrl.items"><a ui-sref="{{ item.link }}"><i class="menu-icon {{ item.icon }}"></i> <span class="menu-text" ng-bind="item.label"></span></a></li></ul>'), e.put("app/appointments/appointments.html", "<ui-view></ui-view>"), e.put("app/company/company.html", "<ui-view></ui-view>"), e.put("app/departments/departments.html", "<ui-view></ui-view>"), e.put("app/home/home.html", '<div class="row"><div class="col-md-8"><div class="row"><div class="col-sm-12"><div class="page-header">Appointments in Progress</div></div><div class="col-sm-12" ng-if="homeCtrl.inProgress.length === 0"><div class="alert alert-info">No data Found</div></div><div class="col-sm-12" ng-if="homeCtrl.inProgress.length > 0"><table class="table table-striped"><thead><tr><th>#</th><th>Host</th><th>Guest</th><th>Start Date</th><th>End Date</th><th>Start Time</th><th>End Time</th></tr></thead><tbody><tr ng-repeat="item in homeCtrl.inProgress"><td ng-bind="::$index+1"></td><td ng-bind="::item.host.last_name +\' \'+item.host.first_name"></td><td ng-bind="::item.visitor.last_name+\' \'+item.visitor.first_name"></td><td ng-bind="::item.start_date"></td><td ng-bind="::item.end_date"></td><td ng-bind="::item.start_time"></td><td ng-bind="::item.end_time"></td></tr></tbody></table></div></div><div class="row"><div class="col-sm-12"><div class="page-header">Upcoming Appointments</div></div><div class="col-sm-12" ng-if="homeCtrl.upcoming.length === 0"><div class="alert alert-info">No data Found</div></div><div class="col-sm-12" ng-if="homeCtrl.upcoming.length > 0"><table class="table table-striped"><thead><tr><th>#</th><th>Host</th><th>Guest</th><th>Start Date</th><th>End Date</th><th>Start Time</th><th>End Time</th></tr></thead><tbody><tr ng-repeat="item in homeCtrl.upcoming"><td ng-bind="::$index+1"></td><td ng-bind="::item.host.last_name +\' \'+item.host.first_name"></td><td ng-bind="::item.visitor.last_name+\' \'+item.visitor.first_name"></td><td ng-bind="::item.start_date"></td><td ng-bind="::item.end_date"></td><td ng-bind="::item.start_time"></td><td ng-bind="::item.end_time"></td></tr></tbody></table></div></div><div class="row"><div class="col-sm-12"><div class="page-header">Appointments Awaiting Approval</div></div><div class="col-sm-12" ng-if="homeCtrl.awaitingApproval.length === 0"><div class="alert alert-info">No data Found</div></div><div class="col-sm-12" ng-if="homeCtrl.awaitingApproval.length > 0"><table class="table table-striped"><thead><tr><th>#</th><th>Host</th><th>Guest</th><th>Start Date</th><th>End Date</th><th>Start Time</th><th>End Time</th></tr></thead><tbody><tr ng-repeat="item in homeCtrl.awaitingApproval"><td ng-bind="::$index+1"></td><td ng-bind="::item.host.last_name +\' \'+item.host.first_name"></td><td ng-bind="::item.visitor.last_name+\' \'+item.visitor.first_name"></td><td ng-bind="::item.start_date"></td><td ng-bind="::item.end_date"></td><td ng-bind="::item.start_time"></td><td ng-bind="::item.end_time"></td></tr></tbody></table></div></div></div><div class="col-md-4"><div ng-include="\'app/home/partials/calendar.html\'"></div></div></div>'), e.put("app/login/login.html", '<div class="main-container"><div class="main-content"><div class="row"><div class="col-sm-10 col-sm-offset-1"><div class="login-container"><div class="center"></div><div class="space-6"></div><div class="position-relative"><div id="login-box" class="login-box visible widget-box no-border"><div class="widget-body"><div class="widget-main"><h4 class="header blue lighter bigger"><i class="ace-icon fa fa-coffee green"></i> Please Enter Your Information</h4><div class="space-6"></div><form ng-submit="loginCtrl.login()"><fieldset><label class="block clearfix"><span class="block input-icon input-icon-right"><input ng-model="loginCtrl.credentials.username" type="text" class="form-control" placeholder="Username"> <i class="ace-icon fa fa-user"></i></span></label> <label class="block clearfix"><span class="block input-icon input-icon-right"><input ng-model="loginCtrl.credentials.password" type="password" class="form-control" placeholder="Password"> <i class="ace-icon fa fa-lock"></i></span></label><div class="space"></div><div class="clearfix"><label class="inline"><input type="checkbox" class="ace"> <span class="lbl">Remember Me</span></label> <button type="submit" class="width-35 pull-right btn btn-sm btn-primary"><i class="ace-icon fa fa-key"></i> <span class="bigger-110">Login</span></button></div><div class="space-4"></div></fieldset></form><div class="space-6"></div></div></div></div></div></div></div></div></div></div>'), e.put("app/settings/settings.html", '<div class="row"><div class="col-sm-8 col-sm-offset-2"><div class="page-header"><h1 class="clearfix">Systems Settings<div class="pull-right" ng-include="\'components/form/partials/elements/submit-small.html\'"></div></h1></div><form><div class="form-group"><div class="row"><div class="col-sm-12"><div id="recent-box" class="widget-box transparent"><div class="widget-header"><h4 class="widget-title lighter smaller"><i class="ace-icon fa fa-rss orange"></i>RECENT</h4><div class="widget-toolbar no-border"><ul id="recent-tab" class="nav nav-tabs"><li class="active"><a href="#task-tab" data-toggle="tab">Database</a></li><li><a href="#member-tab" data-toggle="tab">LDAP</a></li><li><a href="#comment-tab" data-toggle="tab">Settings</a></li></ul></div></div><div class="widget-body"></div></div></div></div></div><div class="row"><div class="col-sm-12" ng-include="\'components/form/partials/elements/submit.html\'"></div></div></form></div></div>'), e.put("app/users/users.html", "<ui-view></ui-view>"), e.put("app/visitors/visitors.html", "<ui-view></ui-view>"), e.put("app/visitors-group/visitors-group.html", "<ui-view></ui-view>"), e.put("components/form/partials/form-field.html", '<label ng-bind="elem.label"></label> <strong class="text-danger" ng-if="elem.required">*</strong><div class="form-input" ng-include="\'components/form/partials/elements/\'+(elem.formType || \'text\')+\'.html\'"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[elem.fieldName].length"><span ng-repeat="error in formCtrl.errorMsg[elem.fieldName]"><i class="fa fa-exclamation-triangle"></i> {{ error }}</span></div>'), e.put("app/appointments/all/all.html", '<div class="page-header"><h1>Appointments</h1></div><div class="row"><div class="col-sm-12"><div class="custom-form-save clearfix"><a class="btn btn-primary pull-right" ui-sref="appointments.add"><i class="fa fa-plus-circle"></i> Create</a></div></div></div><div class="row" ng-if="allCtrl.items.length === 0"><div class="col-sm-12"><div class="alert alert-info"><i class="fa fa-exclamation-circle"></i> No Data Found</div></div></div><div class="row" ng-if="allCtrl.items.length > 0"><div class="col-xs-12"><div class="row"><div class="col-xs-12"><table id="simple-table" class="table table-striped table-bordered table-hover"><thead><tr><th>#</th><th><span class="pointer block" ng-click="allCtrl.updateView(\'host\')">Host <span ng-show="allCtrl.orderByColumn[\'host\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'host\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'host\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'visitor\')">Visitor <span ng-show="allCtrl.orderByColumn[\'visitor\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'visitor\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'visitor\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'start_date\')">Start Date <span ng-show="allCtrl.orderByColumn[\'start_date\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'start_date\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'start_date\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'start_time\')">Start Time <span ng-show="allCtrl.orderByColumn[\'start_time\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'start_time\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'start_time\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'end_date\')">End Date <span ng-show="allCtrl.orderByColumn[\'end_date\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'end_date\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'end_date\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'end_time\')">End Date <span ng-show="allCtrl.orderByColumn[\'end_time\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'end_time\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'end_time\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'is_approved\')">Status <span ng-show="allCtrl.orderByColumn[\'is_approved\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'is_approved\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'is_approved\'].reverse}"></span></span></th><th>Acions</th></tr></thead><tbody><tr ng-repeat="item in allCtrl.items"><td ng-bind="$index + 1 + ((allCtrl.pagination.currentPage-1) * allCtrl.pagination.itemsPerPage)"></td><td><a ui-sref="appointments.detail({_id: item._id})" ng-bind="item.host.last_name+\' \'+item.host.first_name"></a></td><td ng-bind="item.visitor.last_name+\' \'+item.visitor.first_name"></td><td ng-bind="item.start_date"></td><td ng-bind="item.start_time"></td><td ng-bind="item.end_date"></td><td ng-bind="item.end_time"></td><td><span class="label" ng-class="{ \'label-success arrowed-in arrowed-in-right\': [allCtrl.status.UPCOMING, allCtrl.status.IN_PROGRESS].indexOf(item.status) >= 0, \'label-danger arrowed-right arrowed-in\': [allCtrl.status.REJECTED, allCtrl.status.EXPIRED].indexOf(item.status) >= 0, \'label-default arrowed arrowed-right\': item.status === allCtrl.status.PENDING }"><span ng-if="item.status === allCtrl.status.UPCOMING">Upcoming</span> <span ng-if="item.status === allCtrl.status.REJECTED">Rejected</span> <span ng-if="item.status === allCtrl.status.PENDING">Pending</span> <span ng-if="item.status === allCtrl.status.EXPIRED">Expired</span> <span ng-if="item.status === allCtrl.status.IN_PROGRESS">In Progress</span></span></td><td><div class="hidden-sm hidden-xs action-buttons"><a ng-if="item.status === allCtrl.status.UPCOMING" class="badge badge-info" ui-sref="appointments.checkin({_id: item._id})">Checkin</a> <a ng-if="item.status === allCtrl.status.IN_PROGRESS" class="badge badge-info" ui-sref="appointments.checkin({_id: item._id})">Check out</a> <a ui-sref="appointments.detail({_id: item._id})" class="blue"><i class="ace-icon fa fa-eye bigger-130"></i></a> <a ui-sref="appointments.edit({_id: item._id})" class="green"><i class="ace-icon fa fa-pencil bigger-130"></i></a> <a ui-sref="appointments.remove({_id: item._id})" class="red"><i class="ace-icon fa fa-trash-o bigger-130"></i></a></div><div class="hidden-md hidden-lg"><div class="inline pos-rel"><button data-position="auto" data-toggle="dropdown" class="btn btn-minier btn-yellow dropdown-toggle" aria-expanded="false"><i class="ace-icon fa fa-caret-down icon-only bigger-120"></i></button><ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close" style=""><li><a title="" data-rel="tooltip" class="tooltip-info" ui-sref="appointments.detail({_id: item._id})" data-original-title="View"><span class="blue"><i class="ace-icon fa fa-search-plus bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-success" ui-sref="appointments.edit({_id: item._id})" data-original-title="Edit"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-error" ui-sref="appointments.remove({_id: item._id})" data-original-title="Delete"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a></li></ul></div></div></td></tr></tbody></table></div></div><div class="row"><div class="col-xs-11"><uib-pagination total-items="allCtrl.pagination.totalItems" ng-model="allCtrl.pagination.currentPage" max-size="allCtrl.pagination.maxSize" class="allCtrl.pagination-sm pull-right" boundary-links="true" rotate="false" ng-change="allCtrl.updateView()" items-per-page="allCtrl.pagination.itemsPerPage" num-pages="allCtrl.pagination.numPages"></uib-pagination></div><div class="col-xs-1"><label class="pull-right"><select ng-model="allCtrl.pagination.itemsPerPage" ng-change="allCtrl.updateView()" class="form-control input-sm"><option ng-selected="allCtrl.pagination.itemsPerPage === 10" value="10">10</option><option ng-selected="allCtrl.pagination.itemsPerPage === 25" value="25">25</option><option ng-selected="allCtrl.pagination.itemsPerPage === 50" value="50">50</option><option ng-selected="allCtrl.pagination.itemsPerPage === 100" value="100">100</option></select></label></div></div></div></div>'), e.put("app/appointments/form/form.html", '<div class="row"><div class="col-sm-8 col-sm-offset-2"><div class="page-header"><h1 class="clearfix">Appointment Form<div class="pull-right" ng-include="\'components/form/partials/elements/submit-small.html\'"></div></h1></div><form><div class="form-group" ng-repeat="form in formCtrl.form"><div class="row"><div ng-repeat="elem in form" class="col-sm-{{formCtrl.column}}"><div class="custom-form" ng-include="\'components/form/partials/form-field.html\'"></div></div></div></div><div class="row"><div class="col-sm-12" ng-include="\'components/form/partials/elements/submit.html\'"></div></div></form></div></div>'), e.put("app/appointments/logs/checkin.html", '<div class="space-6"></div><div class="well well-sm clearfix"><div class="infobox infobox-blue"><div class="infobox-icon"><i class="ace-icon fa fa-calendar"></i></div><div class="infobox-data"><span class="infobox-data-content">Arrival Date</span><div class="infobox-content"><span ng-bind="::logCtrl.item.start_date"></span></div></div></div><div class="infobox infobox-brown"><div class="infobox-icon"><i class="ace-icon fa fa-clock-o"></i></div><div class="infobox-data"><span class="infobox-data-content">Arrival Time</span><div class="infobox-content"><span ng-bind="::logCtrl.item.start_time"></span></div></div></div><div class="infobox infobox-brown"><div class="infobox-icon"><i class="ace-icon fa fa-clock-o"></i></div><div class="infobox-data"><span class="infobox-data-content">Departure Time</span><div class="infobox-content"><span ng-bind="::logCtrl.item.end_time"></span></div></div></div><div class="infobox infobox-blue3 pointer" ng-click="logCtrl.printLabel()"><div class="infobox-icon"><i class="ace-icon fa fa-print"></i></div><div class="infobox-data"><span class="infobox-data-content"><h3>Print</h3></span></div></div><button class="btn btn-success pull-right" ng-click="logCtrl.checkIn(item)" ng-disabled="logCtrl.item.status !== 1"><i class="fa fa-check-square-o"></i> Check In</button></div><div class="hr hr12 dotted"></div><div class="row"><div class="col-sm-6"><div class="row"><div class="col-sm-12"><h3 class="page-header">Host Detail</h3></div></div><div class="row"><div class="col-sm-12"><div><div id="user-profile-1" class="user-profile row"><div class="col-sm-4 center"><div><span class="profile-picture"><img ng-if="!logCtrl.item.host.image" id="avatar" class="editable img-responsive" alt="" src="../assets/avatars/profile-pic.jpg"> <img style="max-height: 250px" ng-if="logCtrl.item.host.image" id="avatar" class="editable img-responsive" alt="" ng-src="{{ logCtrl.item.host.image }}"></span><div class="space-4"></div></div><div class="space-6"></div></div><div class="col-sm-8"><div class="profile-user-info profile-user-info-striped"><div class="profile-info-row"><div class="profile-info-name">First Name</div><div class="profile-info-value"><span class="editable" id="first_name" ng-bind="logCtrl.item.host.first_name"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Last Name</div><div class="profile-info-value"><span class="editable" id="last_name" ng-bind="logCtrl.item.host.last_name"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Username</div><div class="profile-info-value"><span class="editable" id="username" ng-bind="logCtrl.item.host.username"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Email</div><div class="profile-info-value" ng-bind="logCtrl.item.host.email"></div></div><div class="profile-info-row"><div class="profile-info-name">Gender</div><div class="profile-info-value" ng-bind="logCtrl.item.host.gender"></div></div><div class="profile-info-row"><div class="profile-info-name">Joined</div><div class="profile-info-value"><span class="editable" id="signup" ng-bind="logCtrl.item.host.date_joined | date:\'yyyy/MM/dd\'">2010/06/20</span></div></div></div><div class="space-20"></div><div class="space-6"></div></div></div></div></div></div></div><div class="col-sm-6"><div class="row"><div class="col-sm-12"><h3 class="page-header">Guest Detail</h3></div></div><div class="row"><div class="col-sm-12"><div><div id="user-profile-1" class="user-profile row"><div class="col-sm-4 center"><div><span class="profile-picture"><img ng-if="!logCtrl.item.visitor.image" id="avatar" class="editable img-responsive" alt="" src="../assets/avatars/profile-pic.jpg"> <img style="max-height: 180px" ng-if="logCtrl.item.visitor.image" id="avatar" class="editable img-responsive" alt="" ng-src="{{ logCtrl.item.visitor.image }}"></span><div class="space-4"></div></div><div class="space-6"></div></div><div class="col-sm-8"><div class="profile-user-info profile-user-info-striped"><div class="profile-info-row"><div class="profile-info-name">First Name</div><div class="profile-info-value"><span class="editable" id="first_name" ng-bind="logCtrl.item.visitor.first_name"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Last Name</div><div class="profile-info-value"><span class="editable" id="last_name" ng-bind="logCtrl.item.visitor.last_name"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Email</div><div class="profile-info-value" ng-bind="logCtrl.item.visitor.email"></div></div><div class="profile-info-row"><div class="profile-info-name">Gender</div><div class="profile-info-value" ng-bind="logCtrl.item.visitor.gender"></div></div><div class="profile-info-row"><div class="profile-info-name">Created</div><div class="profile-info-value"><span class="editable" id="signup" ng-bind="logCtrl.item.visitor.created | date:\'yyyy/MM/dd\'">2010/06/20</span></div></div><div class="profile-info-row"><div class="profile-info-name"></div><div class="profile-info-value"><span class="editable" id="signup">&nbsp;</span></div></div></div><div class="space-20"></div><div class="space-6"></div></div></div></div></div></div></div></div>'), e.put("app/appointments/profile/profile.html", '<div class="page-header"><h1>User Profile Page</h1></div><div class="row"><div class="col-xs-12"><div><div id="user-profile-1" class="user-profile row"><div class="col-xs-12 col-sm-3 center"><div><span class="profile-picture"><img style="max-height: 200px; max-width: 180px;" ng-if="!profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" src="../assets/avatars/profile-pic.jpg"> <img ng-if="profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" ng-src="profileCtrl.profile.image"></span><div class="space-4"></div><div class="width-80 label label-info label-xlg arrowed-in arrowed-in-right"><div class="inline position-relative"><a ui-sref="users.edit({_id: profileCtrl.profile._id})" class="user-title-label dropdown-toggle" data-toggle="dropdown"><i class="ace-icon fa fa-circle light-green"></i> &nbsp; <span class="white" ng-bind="profileCtrl.profile.last_name+ \' \'+ profileCtrl.profile.first_name"></span></a></div></div></div><div class="space-6"></div><div class="hr hr12 dotted"></div></div><div class="col-xs-12 col-sm-9"><div class="profile-user-info profile-user-info-striped"><div class="profile-info-row"><div class="profile-info-name">Username</div><div class="profile-info-value"><span class="editable" id="username" ng-bind="profileCtrl.profile.username"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Email</div><div class="profile-info-value" ng-bind="profileCtrl.profile.email"></div></div><div class="profile-info-row"><div class="profile-info-name">Gender</div><div class="profile-info-value" ng-bind="profileCtrl.profile.gender"></div></div><div class="profile-info-row"><div class="profile-info-name">Joined</div><div class="profile-info-value"><span class="editable" id="signup" ng-bind="profileCtrl.profile.date_joined | date:\'yyyy/MM/dd\'">2010/06/20</span></div></div><div class="profile-info-row"><div class="profile-info-name">Last Online</div><div class="profile-info-value"><span class="editable" id="login">3 hours ago</span></div></div></div><div class="space-20"></div><div class="space-6"></div></div></div></div></div></div>'), e.put("app/company/all/all.html", '<div class="page-header"><h1>Companies</h1></div><div class="row"><div class="col-sm-12"><div class="custom-form-save clearfix"><a class="btn btn-primary pull-right" ui-sref="company.add"><i class="fa fa-plus-circle"></i> Create</a></div></div></div><div class="row"><div class="col-xs-12"><div class="row"><div class="col-xs-12"><table id="simple-table" class="table table-striped table-bordered table-hover"><thead><tr><th>#</th><th><span class="pointer block" ng-click="allCtrl.updateView(\'name\')">Company <span ng-show="allCtrl.orderByColumn[\'name\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'name\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'name\'].reverse}"></span></span></th><th>Address</th><th><span class="pointer block" ng-click="allCtrl.updateView(\'created\')">Date Created <span ng-show="allCtrl.orderByColumn[\'created\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'created\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'created\'].reverse}"></span></span></th><th>Acions</th></tr></thead><tbody><tr ng-repeat="item in allCtrl.companies"><td ng-bind="$index + 1 + ((allCtrl.pagination.currentPage-1) * allCtrl.pagination.itemsPerPage)"></td><td ng-bind="::item.name"></td><td ng-bind="::item.address"></td><td ng-bind="::item.created | date:\'yyyy-MM-dd\'"></td><td><div class="hidden-sm hidden-xs action-buttons"><a ui-sref="company.edit({_id: item._id})" class="green"><i class="ace-icon fa fa-pencil bigger-130"></i></a> <a ui-sref="company.remove({_id: item._id})" class="red"><i class="ace-icon fa fa-trash-o bigger-130"></i></a></div><div class="hidden-md hidden-lg"><div class="inline pos-rel"><button data-position="auto" data-toggle="dropdown" class="btn btn-minier btn-yellow dropdown-toggle" aria-expanded="false"><i class="ace-icon fa fa-caret-down icon-only bigger-120"></i></button><ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close" style=""><li><a title="" data-rel="tooltip" class="tooltip-success" ui-sref="company.edit({_id: item._id})" data-original-title="Edit"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-error" ui-sref="company.remove({_id: item._id})" data-original-title="Delete"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a></li></ul></div></div></td></tr></tbody></table></div></div><div class="row"><div class="col-xs-11"><uib-pagination total-items="allCtrl.pagination.totalItems" ng-model="allCtrl.pagination.currentPage" max-size="allCtrl.pagination.maxSize" class="allCtrl.pagination-sm pull-right" boundary-links="true" rotate="false" ng-change="allCtrl.updateView()" items-per-page="allCtrl.pagination.itemsPerPage" num-pages="allCtrl.pagination.numPages"></uib-pagination></div><div class="col-xs-1"><label class="pull-right"><select ng-model="allCtrl.pagination.itemsPerPage" ng-change="allCtrl.updateView()" class="form-control input-sm"><option ng-selected="allCtrl.pagination.itemsPerPage === 10" value="10">10</option><option ng-selected="allCtrl.pagination.itemsPerPage === 25" value="25">25</option><option ng-selected="allCtrl.pagination.itemsPerPage === 50" value="50">50</option><option ng-selected="allCtrl.pagination.itemsPerPage === 100" value="100">100</option></select></label></div></div></div></div>'), e.put("app/company/form/form.html", '<div class="row"><div class="col-sm-8 col-sm-offset-2"><div class="page-header"><h1 class="clearfix">Company<div class="pull-right" ng-include="\'components/form/partials/elements/submit-small.html\'"></div></h1></div><form><div class="form-grou" ng-repeat="form in formCtrl.form"><div class="row"><div ng-repeat="elem in form" class="col-sm-{{formCtrl.column}}"><div class="custom-form" ng-include="\'components/form/partials/form-field.html\'"></div></div></div></div><div class="row"><div class="col-sm-12" ng-include="\'components/form/partials/elements/submit.html\'"></div></div></form></div></div>'), e.put("app/departments/all/all.html", '<div class="page-header"><h1>Departments</h1></div><div class="row"><div class="col-sm-12"><div class="custom-form-save clearfix"><a class="btn btn-primary pull-right" ui-sref="departments.add"><i class="fa fa-plus-circle"></i> Create</a></div></div></div><div class="row"><div class="col-xs-12"><div class="row"><div class="col-xs-12"><table id="simple-table" class="table table-striped table-bordered table-hover"><thead><tr><th>#</th><th><span class="pointer block" ng-click="allCtrl.updateView(\'name\')">Department <span ng-show="allCtrl.orderByColumn[\'name\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'name\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'name\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'floor\')">Floor <span ng-show="allCtrl.orderByColumn[\'floor\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'floor\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'floor\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'created\')">Date Created <span ng-show="allCtrl.orderByColumn[\'created\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'created\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'created\'].reverse}"></span></span></th><th>Acions</th></tr></thead><tbody><tr ng-repeat="item in allCtrl.items"><td ng-bind="$index + 1 + ((allCtrl.pagination.currentPage-1) * allCtrl.pagination.itemsPerPage)"></td><td ng-bind="::item.name"></td><td ng-bind="::item.floor"></td><td ng-bind="::item.created | date:\'yyyy-MM-dd\'"></td><td><div class="hidden-sm hidden-xs action-buttons"><a ui-sref="departments.detail({_id: item._id})" class="blue"><i class="ace-icon fa fa-eye bigger-130"></i></a> <a ui-sref="departments.edit({_id: item._id})" class="green"><i class="ace-icon fa fa-pencil bigger-130"></i></a> <a ng-click="allCtrl.remove(item._id)" class="red pointer"><i class="ace-icon fa fa-trash-o bigger-130"></i></a></div><div class="hidden-md hidden-lg"><div class="inline pos-rel"><button data-position="auto" data-toggle="dropdown" class="btn btn-minier btn-yellow dropdown-toggle" aria-expanded="false"><i class="ace-icon fa fa-caret-down icon-only bigger-120"></i></button><ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close" style=""><li><a title="" data-rel="tooltip" class="tooltip-info" ui-sref="departments.detail({_id: item._id})" data-original-title="View"><span class="blue"><i class="ace-icon fa fa-search-plus bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-success" ui-sref="departments.edit({_id: item._id})" data-original-title="Edit"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-error" ng-click="allCtrl.remove(item._id)" data-original-title="Delete"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a></li></ul></div></div></td></tr></tbody></table></div></div><div class="row"><div class="col-xs-11"><uib-pagination total-items="allCtrl.pagination.totalItems" ng-model="allCtrl.pagination.currentPage" max-size="allCtrl.pagination.maxSize" class="allCtrl.pagination-sm pull-right" boundary-links="true" rotate="false" ng-change="allCtrl.updateView()" items-per-page="allCtrl.pagination.itemsPerPage" num-pages="allCtrl.pagination.numPages"></uib-pagination></div><div class="col-xs-1"><label class="pull-right"><select ng-model="allCtrl.pagination.itemsPerPage" ng-change="allCtrl.updateView()" class="form-control input-sm"><option ng-selected="allCtrl.pagination.itemsPerPage === 10" value="10">10</option><option ng-selected="allCtrl.pagination.itemsPerPage === 25" value="25">25</option><option ng-selected="allCtrl.pagination.itemsPerPage === 50" value="50">50</option><option ng-selected="allCtrl.pagination.itemsPerPage === 100" value="100">100</option></select></label></div></div></div></div>'), e.put("app/departments/form/form.html", '<div class="row"><div class="col-sm-8 col-sm-offset-2"><div class="page-header"><h1 class="clearfix">Department Profile Form<div class="pull-right" ng-include="\'components/form/partials/elements/submit-small.html\'"></div></h1></div><form><div class="form-grou" ng-repeat="form in formCtrl.form"><div class="row"><div ng-repeat="elem in form" class="col-sm-{{formCtrl.column}}"><div class="custom-form" ng-include="\'components/form/partials/form-field.html\'"></div></div></div></div><div class="row"><div class="col-sm-12" ng-include="\'components/form/partials/elements/submit.html\'"></div></div></form></div></div>'), e.put("app/departments/profile/profile.html", '<div class="page-header"><h1>User Profile Page</h1></div><div class="row"><div class="col-xs-12"><div><div id="user-profile-1" class="user-profile row"><div class="col-xs-12 col-sm-3 center"><div><span class="profile-picture"><img style="max-height: 200px; max-width: 180px;" ng-if="!profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" src="../assets/avatars/profile-pic.jpg"> <img ng-if="profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" ng-src="profileCtrl.profile.image"></span><div class="space-4"></div><div class="width-80 label label-info label-xlg arrowed-in arrowed-in-right"><div class="inline position-relative"><a ui-sref="users.edit({_id: profileCtrl.profile._id})" class="user-title-label dropdown-toggle" data-toggle="dropdown"><i class="ace-icon fa fa-circle light-green"></i> &nbsp; <span class="white" ng-bind="profileCtrl.profile.last_name+ \' \'+ profileCtrl.profile.first_name"></span></a></div></div></div><div class="space-6"></div><div class="hr hr12 dotted"></div></div><div class="col-xs-12 col-sm-9"><div class="profile-user-info profile-user-info-striped"><div class="profile-info-row"><div class="profile-info-name">Username</div><div class="profile-info-value"><span class="editable" id="username" ng-bind="profileCtrl.profile.username"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Email</div><div class="profile-info-value" ng-bind="profileCtrl.profile.email"></div></div><div class="profile-info-row"><div class="profile-info-name">Gender</div><div class="profile-info-value" ng-bind="profileCtrl.profile.gender"></div></div><div class="profile-info-row"><div class="profile-info-name">Joined</div><div class="profile-info-value"><span class="editable" id="signup" ng-bind="profileCtrl.profile.date_joined | date:\'yyyy/MM/dd\'">2010/06/20</span></div></div><div class="profile-info-row"><div class="profile-info-name">Last Online</div><div class="profile-info-value"><span class="editable" id="login">3 hours ago</span></div></div></div><div class="space-20"></div><div class="widget-box transparent"><div class="widget-header widget-header-small"><h4 class="widget-title blue smaller"><i class="ace-icon fa fa-rss orange"></i> Recent Activities</h4><div class="widget-toolbar action-buttons"><a href="#" data-action="reload"><i class="ace-icon fa fa-refresh blue"></i></a> &nbsp; <a href="#" class="pink"><i class="ace-icon fa fa-trash-o"></i></a></div></div><div class="widget-body"><div class="widget-main padding-8"></div></div></div><div class="space-6"></div></div></div></div></div></div>'), e.put("app/home/partials/calendar.html", '<div ui-calendar="homeCtrl.uiConfig.calendar" ng-model="homeCtrl.eventSources"></div>'), e.put("app/users/all/all.html", '<div class="page-header"><h1>Users</h1></div><div class="row"><div class="col-sm-12"><div class="custom-form-save clearfix"><a class="btn btn-primary pull-right" ui-sref="users.add"><i class="fa fa-plus-circle"></i> Create</a></div></div></div><div class="row"><div class="col-xs-12"><div class="row"><div class="col-xs-12"><table id="simple-table" class="table table-striped table-bordered table-hover"><thead><tr><th>#</th><th><span class="pointer block" ng-click="allCtrl.updateView(\'first_name\')">First Name <span ng-show="allCtrl.orderByColumn[\'first_name\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'first_name\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'first_name\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'last_name\')">Last Name <span ng-show="allCtrl.orderByColumn[\'last_name\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'last_name\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'last_name\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'username\')">Username <span ng-show="allCtrl.orderByColumn[\'username\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'username\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'username\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'email\')">Email <span ng-show="allCtrl.orderByColumn[\'email\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'email\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'email\'].reverse}"></span></span></th><th>Department</th><th><span class="pointer block" ng-click="allCtrl.updateView(\'date_joined\')">Date Created <span ng-show="allCtrl.orderByColumn[\'date_joined\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'date_joined\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'date_joined\'].reverse}"></span></span></th><th>Acions</th></tr></thead><tbody><tr ng-repeat="item in allCtrl.users"><td ng-bind="$index + 1 + ((allCtrl.pagination.currentPage-1) * allCtrl.pagination.itemsPerPage)"></td><td ng-bind="item.first_name"></td><td ng-bind="item.last_name"></td><td ng-bind="item.username"></td><td ng-bind="item.email"></td><td ng-bind="item.department.name"></td><td ng-bind="item.date_joined | date:\'yyyy-MM-dd\'"></td><td><div class="hidden-sm hidden-xs action-buttons"><a ui-sref="users.detail({_id: item._id})" class="blue"><i class="ace-icon fa fa-eye bigger-130"></i></a> <a ui-sref="users.edit({_id: item._id})" class="green"><i class="ace-icon fa fa-pencil bigger-130"></i></a> <a ng-click="allCtrl.remove(item._id)" class="red pointer"><i class="ace-icon fa fa-trash-o bigger-130"></i></a></div><div class="hidden-md hidden-lg"><div class="inline pos-rel"><button data-position="auto" data-toggle="dropdown" class="btn btn-minier btn-yellow dropdown-toggle" aria-expanded="false"><i class="ace-icon fa fa-caret-down icon-only bigger-120"></i></button><ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close" style=""><li><a title="" data-rel="tooltip" class="tooltip-info" ui-sref="users.detail({_id: item._id})" data-original-title="View"><span class="blue"><i class="ace-icon fa fa-search-plus bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-success" ui-sref="users.edit({_id: item._id})" data-original-title="Edit"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-error" ng-click="allCtrl.remove(item._id)" data-original-title="Delete"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a></li></ul></div></div></td></tr></tbody></table></div></div><div class="row"><div class="col-xs-11"><uib-pagination total-items="allCtrl.pagination.totalItems" ng-model="allCtrl.pagination.currentPage" max-size="allCtrl.pagination.maxSize" class="allCtrl.pagination-sm pull-right" boundary-links="true" rotate="false" ng-change="allCtrl.updateView()" items-per-page="allCtrl.pagination.itemsPerPage" num-pages="allCtrl.pagination.numPages"></uib-pagination></div><div class="col-xs-1"><label class="pull-right"><select ng-model="allCtrl.pagination.itemsPerPage" ng-change="allCtrl.updateView()" class="form-control input-sm"><option ng-selected="allCtrl.pagination.itemsPerPage === 10" value="10">10</option><option ng-selected="allCtrl.pagination.itemsPerPage === 25" value="25">25</option><option ng-selected="allCtrl.pagination.itemsPerPage === 50" value="50">50</option><option ng-selected="allCtrl.pagination.itemsPerPage === 100" value="100">100</option></select></label></div></div></div></div>'), e.put("app/users/form/form.html", '<div class="row"><div class="col-sm-8 col-sm-offset-2"><div class="page-header"><h1 class="clearfix">User Profile Form<div class="pull-right" ng-include="\'components/form/partials/elements/submit-small.html\'"></div></h1></div><form><div class="form-grou" ng-repeat="form in formCtrl.form"><div class="row"><div ng-repeat="elem in form" class="col-sm-{{formCtrl.column}}"><div class="custom-form" ng-include="\'components/form/partials/form-field.html\'"></div></div></div></div><div class="row"><div class="col-sm-12" ng-include="\'components/form/partials/elements/submit.html\'"></div></div></form></div></div>'), e.put("app/users/profile/profile.html", '<div class="page-header"><h1>User Profile Page</h1></div><div class="row"><div class="col-xs-12"><div><div id="user-profile-1" class="user-profile row"><div class="col-xs-12 col-sm-3 center"><div><span class="profile-picture"><img style="max-height: 200px; max-width: 180px;" ng-if="!profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" src="../assets/avatars/profile-pic.jpg"> <img ng-if="profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" ng-src="profileCtrl.profile.image"></span><div class="space-4"></div><div class="width-80 label label-info label-xlg arrowed-in arrowed-in-right"><div class="inline position-relative"><a ui-sref="users.edit({_id: profileCtrl.profile._id})" class="user-title-label dropdown-toggle" data-toggle="dropdown"><i class="ace-icon fa fa-circle light-green"></i> &nbsp; <span class="white" ng-bind="profileCtrl.profile.last_name+ \' \'+ profileCtrl.profile.first_name"></span></a></div></div></div><div class="space-6"></div><div class="hr hr12 dotted"></div></div><div class="col-xs-12 col-sm-9"><div class="profile-user-info profile-user-info-striped"><div class="profile-info-row"><div class="profile-info-name">Username</div><div class="profile-info-value"><span class="editable" id="username" ng-bind="profileCtrl.profile.username"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Email</div><div class="profile-info-value" ng-bind="profileCtrl.profile.email"></div></div><div class="profile-info-row"><div class="profile-info-name">Gender</div><div class="profile-info-value" ng-bind="profileCtrl.profile.gender"></div></div><div class="profile-info-row"><div class="profile-info-name">Department</div><div class="profile-info-value" ng-bind="profileCtrl.profile.department.name"></div></div><div class="profile-info-row"><div class="profile-info-name">Joined</div><div class="profile-info-value"><span class="editable" id="signup" ng-bind="profileCtrl.profile.date_joined | date:\'yyyy/MM/dd\'">2010/06/20</span></div></div><div class="profile-info-row"><div class="profile-info-name">Last Online</div><div class="profile-info-value"><span class="editable" id="login" ng-bind="::profileCtrl.timeSince(profileCtrl.profile.last_login)"></span></div></div></div><div class="space-20"></div><div class="widget-box transparent"><div class="widget-header widget-header-small"><h4 class="widget-title blue smaller"><i class="ace-icon fa fa-rss orange"></i> Recent Activities</h4><div class="widget-toolbar action-buttons"></div></div><div class="widget-body"><div class="widget-main padding-8"><div class="row"><div class="col-sm-12"><div class="page-header"><i class="fa fa-calendar-o"></i> Appointments Awaiting Approval</div></div><div class="col-sm-12" ng-if="profileCtrl.awaitingApproval.length === 0"><div class="alert alert-info">No data Found</div></div><div class="col-sm-12" ng-if="profileCtrl.awaitingApproval.length > 0"><table class="table table-striped"><thead><tr><th>#</th><th>Guest</th><th>Start Date</th><th>End Date</th><th>Start Time</th><th>End Time</th><th>Action</th></tr></thead><tbody><tr ng-repeat="item in profileCtrl.awaitingApproval"><td ng-bind="::$index+1"></td><td ng-bind="::item.visitor.last_name+\' \'+item.visitor.first_name"></td><td ng-bind="::item.start_date"></td><td ng-bind="::item.end_date"></td><td ng-bind="::item.start_time"></td><td ng-bind="::item.end_time"></td><td><button class="btn btn-success btn-sm" type="button" ng-click="profileCtrl.updateApp(item, \'true\')"><i class="fa fa-check"></i></button> <button class="btn btn-danger btn-sm" type="button" ng-click="profileCtrl.updateApp(item, \'false\')"><i class="fa fa-times"></i></button></td></tr></tbody></table></div></div><div class="row"><div class="col-sm-12"><div class="page-header"><i class="fa fa-calendar-o"></i> Rejected Appointments</div></div><div class="col-sm-12" ng-if="profileCtrl.rejected.length === 0"><div class="alert alert-info">No data Found</div></div><div class="col-sm-12" ng-if="profileCtrl.rejected.length > 0"><table class="table table-striped"><thead><tr><th>#</th><th>Guest</th><th>Start Date</th><th>End Date</th><th>Start Time</th><th>End Time</th><th>Action</th></tr></thead><tbody><tr ng-repeat="item in profileCtrl.rejected"><td ng-bind="::$index+1"></td><td ng-bind="::item.visitor.last_name+\' \'+item.visitor.first_name"></td><td ng-bind="::item.start_date"></td><td ng-bind="::item.end_date"></td><td ng-bind="::item.start_time"></td><td ng-bind="::item.end_time"></td><td><button class="btn btn-success btn-sm" type="button" ng-click="profileCtrl.updateApp(item, \'true\')"><i class="fa fa-check"></i></button></td></tr></tbody></table></div></div><div class="row"><div class="col-sm-12"><div class="page-header"><i class="fa fa-calendar-o"></i> Appointments in Progress</div></div><div class="col-sm-12" ng-if="profileCtrl.inProgress.length === 0"><div class="alert alert-info">No data Found</div></div><div class="col-sm-12" ng-if="profileCtrl.inProgress.length > 0"><table class="table table-striped"><thead><tr><th>#</th><th>Guest</th><th>Start Date</th><th>End Date</th><th>Start Time</th><th>End Time</th></tr></thead><tbody><tr ng-repeat="item in profileCtrl.inProgress"><td ng-bind="::$index+1"></td><td ng-bind="::item.visitor.last_name+\' \'+item.visitor.first_name"></td><td ng-bind="::item.start_date"></td><td ng-bind="::item.end_date"></td><td ng-bind="::item.start_time"></td><td ng-bind="::item.end_time"></td></tr></tbody></table></div></div><div class="row"><div class="col-sm-12"><div class="page-header"><i class="fa fa-calendar-o"></i> Upcoming Appointments</div></div><div class="col-sm-12" ng-if="profileCtrl.upcoming.length === 0"><div class="alert alert-info">No data Found</div></div><div class="col-sm-12" ng-if="profileCtrl.upcoming.length > 0"><table class="table table-striped"><thead><tr><th>#</th><th>Guest</th><th>Start Date</th><th>End Date</th><th>Start Time</th><th>End Time</th></tr></thead><tbody><tr ng-repeat="item in profileCtrl.upcoming"><td ng-bind="::$index+1"></td><td ng-bind="::item.visitor.last_name+\' \'+item.visitor.first_name"></td><td ng-bind="::item.start_date"></td><td ng-bind="::item.end_date"></td><td ng-bind="::item.start_time"></td><td ng-bind="::item.end_time"></td></tr></tbody></table></div></div></div></div></div><div class="space-6"></div></div></div></div></div></div>'), e.put("app/visitors/all/all.html", '<div class="page-header"><h1>Visitors</h1></div><div class="row"><div class="col-sm-12"><div class="custom-form-save clearfix"><a class="btn btn-primary pull-right" ui-sref="visitors.add"><i class="fa fa-plus-circle"></i> Create</a></div></div></div><div class="row"><div class="col-xs-12"><div class="row"><div class="col-xs-12"><table id="simple-table" class="table table-striped table-bordered table-hover"><thead><tr><th>#</th><th><span class="pointer block" ng-click="visitorAllCtrl.updateView(\'first_name\')">First Name <span ng-show="visitorAllCtrl.orderByColumn[\'first_name\']" ng-class="{\'fa fa-long-arrow-up\': visitorAllCtrl.orderByColumn[\'first_name\'].reverse, \'fa fa-long-arrow-down\': !visitorAllCtrl.orderByColumn[\'first_name\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="visitorAllCtrl.updateView(\'last_name\')">Last Name <span ng-show="visitorAllCtrl.orderByColumn[\'last_name\']" ng-class="{\'fa fa-long-arrow-up\': visitorAllCtrl.orderByColumn[\'last_name\'].reverse, \'fa fa-long-arrow-down\': !visitorAllCtrl.orderByColumn[\'last_name\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="visitorAllCtrl.updateView(\'email\')">Email <span ng-show="visitorAllCtrl.orderByColumn[\'email\']" ng-class="{\'fa fa-long-arrow-up\': visitorAllCtrl.orderByColumn[\'email\'].reverse, \'fa fa-long-arrow-down\': !visitorAllCtrl.orderByColumn[\'email\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="visitorAllCtrl.updateView(\'phone\')">Phone <span ng-show="visitorAllCtrl.orderByColumn[\'phone\']" ng-class="{\'fa fa-long-arrow-up\': visitorAllCtrl.orderByColumn[\'phone\'].reverse, \'fa fa-long-arrow-down\': !visitorAllCtrl.orderByColumn[\'phone\'].reverse}"></span></span></th><th>Company</th><th><span class="pointer block" ng-click="visitorAllCtrl.updateView(\'created\')">Date Created <span ng-show="visitorAllCtrl.orderByColumn[\'created\']" ng-class="{\'fa fa-long-arrow-up\': visitorAllCtrl.orderByColumn[\'created\'].reverse, \'fa fa-long-arrow-down\': !visitorAllCtrl.orderByColumn[\'created\'].reverse}"></span></span></th><th>Acions</th></tr></thead><tbody><tr ng-repeat="visitor in visitorAllCtrl.visitors"><td ng-bind="$index + 1 + ((visitorAllCtrl.pagination.currentPage-1) * visitorAllCtrl.pagination.itemsPerPage)"></td><td ng-bind="::visitor.first_name"></td><td ng-bind="::visitor.last_name"></td><td ng-bind="::visitor.email"></td><td ng-bind="::visitor.phone"></td><td ng-bind="::visitor.company.name"></td><td ng-bind="::visitor.created | date:\'yyyy-MM-dd\'"></td><td><div class="hidden-sm hidden-xs action-buttons"><a class="text-danger" title="Create Appointment" ui-sref="appointments.add({visitor: visitor._id})"><i class="ace-icon fa fa-calendar"></i></a> <a ui-sref="visitors.detail({_id: visitor._id})" class="blue"><i class="ace-icon fa fa-eye bigger-130"></i></a> <a ui-sref="visitors.edit({_id: visitor._id})" class="green"><i class="ace-icon fa fa-pencil bigger-130"></i></a> <a ui-sref="visitors.remove({_id: visitor._id})" class="red"><i class="ace-icon fa fa-trash-o bigger-130"></i></a></div><div class="hidden-md hidden-lg"><div class="inline pos-rel"><button data-position="auto" data-toggle="dropdown" class="btn btn-minier btn-yellow dropdown-toggle" aria-expanded="false"><i class="ace-icon fa fa-caret-down icon-only bigger-120"></i></button><ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close" style=""><li><a title="" data-rel="tooltip" class="tooltip-info" ui-sref="visitors.detail({_id: visitor._id})" data-original-title="View"><span class="blue"><i class="ace-icon fa fa-search-plus bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-success" ui-sref="visitors.edit({_id: visitor._id})" data-original-title="Edit"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-error" ui-sref="visitors.remove({_id: visitor._id})" data-original-title="Delete"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a></li></ul></div></div></td></tr></tbody></table></div></div><div class="row"><div class="col-xs-11"><uib-pagination total-items="visitorAllCtrl.pagination.totalItems" ng-model="visitorAllCtrl.pagination.currentPage" max-size="visitorAllCtrl.pagination.maxSize" class="visitorAllCtrl.pagination-sm pull-right" boundary-links="true" rotate="false" ng-change="visitorAllCtrl.updateView()" items-per-page="visitorAllCtrl.pagination.itemsPerPage" num-pages="visitorAllCtrl.pagination.numPages"></uib-pagination></div><div class="col-xs-1"><label class="pull-right"><select ng-model="visitorAllCtrl.pagination.itemsPerPage" ng-change="visitorAllCtrl.updateView()" class="form-control input-sm"><option ng-selected="visitorAllCtrl.pagination.itemsPerPage === 10" value="10">10</option><option ng-selected="visitorAllCtrl.pagination.itemsPerPage === 25" value="25">25</option><option ng-selected="visitorAllCtrl.pagination.itemsPerPage === 50" value="50">50</option><option ng-selected="visitorAllCtrl.pagination.itemsPerPage === 100" value="100">100</option></select></label></div></div></div></div>'), e.put("app/visitors/form/form.html", '<div class="row"><div class="col-sm-8 col-sm-offset-2"><div class="page-header"><h1 class="clearfix">Visitors Profile Form<div class="pull-right" ng-include="\'components/form/partials/elements/submit-small.html\'"></div></h1></div><form><div class="form-group" ng-repeat="form in formCtrl.form"><div class="row"><div ng-repeat="elem in form" class="col-sm-{{formCtrl.column}}"><div class="custom-form" ng-include="\'components/form/partials/form-field.html\'" ng-if="!elem.custom"></div><div class="custom-form" ng-include="elem.template" ng-if="elem.custom"></div></div></div></div><div ng-include="\'app/visitors/form/partials/image.html\'"></div><div class="row"><div class="col-sm-12" ng-include="\'components/form/partials/elements/submit.html\'"></div></div></form></div></div>'), e.put("app/visitors/profile/profile.html", '<div class="page-header"><h1>User Profile Page</h1></div><div class="row"><div class="col-xs-12"><div><div id="user-profile-1" class="user-profile row"><div class="col-xs-12 col-sm-3 center"><div><span class="profile-picture"><img style="max-height: 200px; max-width: 180px;" ng-if="!profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" src="../assets/avatars/profile-pic.jpg"> <img ng-if="profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" ng-src="{{ profileCtrl.profile.image }}"></span><div class="space-4"></div><div class="width-80 label label-info label-xlg arrowed-in arrowed-in-right"><div class="inline position-relative"><a ui-sref="users.edit({_id: profileCtrl.profile._id})" class="user-title-label dropdown-toggle" data-toggle="dropdown"><i class="ace-icon fa fa-circle light-green"></i> &nbsp; <span class="white" ng-bind="profileCtrl.profile.last_name+ \' \'+ profileCtrl.profile.first_name"></span></a></div></div></div><div class="space-6"></div><div class="hr hr12 dotted"></div></div><div class="col-xs-12 col-sm-9"><div class="profile-user-info profile-user-info-striped"><div class="profile-info-row"><div class="profile-info-name">First Name</div><div class="profile-info-value"><span class="editable" id="firstname" ng-bind="profileCtrl.profile.first_name"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Last Name</div><div class="profile-info-value"><span class="editable" id="lastname" ng-bind="profileCtrl.profile.last_name"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Email</div><div class="profile-info-value" ng-bind="profileCtrl.profile.email"></div></div><div class="profile-info-row"><div class="profile-info-name">Gender</div><div class="profile-info-value" ng-bind="profileCtrl.profile.gender"></div></div><div class="profile-info-row"><div class="profile-info-name">Created</div><div class="profile-info-value"><span class="editable" id="signup" ng-bind="profileCtrl.profile.created | date:\'yyyy/MM/dd\'">2010/06/20</span></div></div><div class="profile-info-row"><div class="profile-info-name">Last Online</div><div class="profile-info-value"><span class="editable" id="login">3 hours ago</span></div></div></div><div class="space-20"></div><div class="widget-box transparent"><div class="widget-header widget-header-small"><h4 class="widget-title blue smaller"><i class="ace-icon fa fa-rss orange"></i> Recent Activities</h4><div class="widget-toolbar action-buttons"><a href="#" data-action="reload"><i class="ace-icon fa fa-refresh blue"></i></a> &nbsp; <a href="#" class="pink"><i class="ace-icon fa fa-trash-o"></i></a></div></div><div class="widget-body"><div class="widget-main padding-8"></div></div></div><div class="space-6"></div></div></div></div></div></div>'), e.put("app/visitors-group/all/all.html", '<div class="page-header"><h1>Visitor Groups</h1></div><div class="row"><div class="col-sm-12"><div class="custom-form-save clearfix"><a class="btn btn-primary pull-right" ui-sref="visitorsGroup.add"><i class="fa fa-plus-circle"></i> Create</a></div></div></div><div class="row"><div class="col-xs-12"><div class="row"><div class="col-xs-12"><table id="simple-table" class="table table-striped table-bordered table-hover"><thead><tr><th>#</th><th><span class="pointer block" ng-click="allCtrl.updateView(\'name\')">Group <span ng-show="allCtrl.orderByColumn[\'first_name\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'name\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'name\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'black_listed\')">Black Listed <span ng-show="allCtrl.orderByColumn[\'black_listed\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'black_listed\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'black_listed\'].reverse}"></span></span></th><th><span class="pointer block" ng-click="allCtrl.updateView(\'created\')">Date Created <span ng-show="allCtrl.orderByColumn[\'created\']" ng-class="{\'fa fa-long-arrow-up\': allCtrl.orderByColumn[\'created\'].reverse, \'fa fa-long-arrow-down\': !allCtrl.orderByColumn[\'created\'].reverse}"></span></span></th><th>Acions</th></tr></thead><tbody><tr ng-repeat="item in allCtrl.items"><td ng-bind="$index + 1 + ((allCtrl.pagination.currentPage-1) * allCtrl.pagination.itemsPerPage)"></td><td ng-bind="::item.name"></td><td ng-bind="::item.black_listed"></td><td ng-bind="::item.created | date:\'yyyy-MM-dd\'"></td><td><div class="hidden-sm hidden-xs action-buttons"><a ui-sref="visitorsGroup.detail({_id: item._id})" class="blue"><i class="ace-icon fa fa-eye bigger-130"></i></a> <a ui-sref="visitorsGroup.edit({_id: item._id})" class="green"><i class="ace-icon fa fa-pencil bigger-130"></i></a> <a ui-sref="visitorsGroup.remove({_id: item._id})" class="red"><i class="ace-icon fa fa-trash-o bigger-130"></i></a></div><div class="hidden-md hidden-lg"><div class="inline pos-rel"><button data-position="auto" data-toggle="dropdown" class="btn btn-minier btn-yellow dropdown-toggle" aria-expanded="false"><i class="ace-icon fa fa-caret-down icon-only bigger-120"></i></button><ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close" style=""><li><a title="" data-rel="tooltip" class="tooltip-info" ui-sref="visitorsGroup.detail({_id: item._id})" data-original-title="View"><span class="blue"><i class="ace-icon fa fa-search-plus bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-success" ui-sref="visitorsGroup.edit({_id: item._id})" data-original-title="Edit"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a></li><li><a title="" data-rel="tooltip" class="tooltip-error" ui-sref="visitorsGroup.remove({_id: item._id})" data-original-title="Delete"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a></li></ul></div></div></td></tr></tbody></table></div></div><div class="row"><div class="col-xs-11"><uib-pagination total-items="allCtrl.pagination.totalItems" ng-model="allCtrl.pagination.currentPage" max-size="allCtrl.pagination.maxSize" class="allCtrl.pagination-sm pull-right" boundary-links="true" rotate="false" ng-change="allCtrl.updateView()" items-per-page="allCtrl.pagination.itemsPerPage" num-pages="allCtrl.pagination.numPages"></uib-pagination></div><div class="col-xs-1"><label class="pull-right"><select ng-model="allCtrl.pagination.itemsPerPage" ng-change="allCtrl.updateView()" class="form-control input-sm"><option ng-selected="allCtrl.pagination.itemsPerPage === 10" value="10">10</option><option ng-selected="allCtrl.pagination.itemsPerPage === 25" value="25">25</option><option ng-selected="allCtrl.pagination.itemsPerPage === 50" value="50">50</option><option ng-selected="allCtrl.pagination.itemsPerPage === 100" value="100">100</option></select></label></div></div></div></div>'), e.put("app/visitors-group/form/form.html", '<div class="col-sm-8 col-sm-offset-2"><div class="page-header"><h1 class="clearfix">Visitors Group Form<div class="pull-right" ng-include="\'components/form/partials/elements/submit-small.html\'"></div></h1></div><form><div class="form-grou" ng-repeat="form in formCtrl.form"><div class="row"><div ng-repeat="elem in form" class="col-sm-{{formCtrl.column}}"><div class="custom-form" ng-include="\'components/form/partials/form-field.html\'"></div></div></div></div><div class="row"><div class="col-sm-12" ng-include="\'components/form/partials/elements/submit.html\'"></div></div></form></div>'), e.put("app/visitors-group/profile/profile.html", '<div class="page-header"><h1>User Profile Page</h1></div><div class="row"><div class="col-xs-12"><div><div id="user-profile-1" class="user-profile row"><div class="col-xs-12 col-sm-3 center"><div><span class="profile-picture"><img style="max-height: 200px; max-width: 180px;" ng-if="!profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" src="../assets/avatars/profile-pic.jpg"> <img ng-if="profileCtrl.profile.image" id="avatar" class="editable img-responsive" alt="" ng-src="profileCtrl.profile.image"></span><div class="space-4"></div><div class="width-80 label label-info label-xlg arrowed-in arrowed-in-right"><div class="inline position-relative"><a ui-sref="users.edit({_id: profileCtrl.profile._id})" class="user-title-label dropdown-toggle" data-toggle="dropdown"><i class="ace-icon fa fa-circle light-green"></i> &nbsp; <span class="white" ng-bind="profileCtrl.profile.last_name+ \' \'+ profileCtrl.profile.first_name"></span></a></div></div></div><div class="space-6"></div><div class="hr hr12 dotted"></div></div><div class="col-xs-12 col-sm-9"><div class="profile-user-info profile-user-info-striped"><div class="profile-info-row"><div class="profile-info-name">Username</div><div class="profile-info-value"><span class="editable" id="username" ng-bind="profileCtrl.profile.username"></span></div></div><div class="profile-info-row"><div class="profile-info-name">Email</div><div class="profile-info-value" ng-bind="profileCtrl.profile.email"></div></div><div class="profile-info-row"><div class="profile-info-name">Gender</div><div class="profile-info-value" ng-bind="profileCtrl.profile.gender"></div></div><div class="profile-info-row"><div class="profile-info-name">Joined</div><div class="profile-info-value"><span class="editable" id="signup" ng-bind="profileCtrl.profile.date_joined | date:\'yyyy/MM/dd\'">2010/06/20</span></div></div><div class="profile-info-row"><div class="profile-info-name">Last Online</div><div class="profile-info-value"><span class="editable" id="login">3 hours ago</span></div></div></div><div class="space-20"></div><div class="widget-box transparent"><div class="widget-header widget-header-small"><h4 class="widget-title blue smaller"><i class="ace-icon fa fa-rss orange"></i> Recent Activities</h4><div class="widget-toolbar action-buttons"><a href="#" data-action="reload"><i class="ace-icon fa fa-refresh blue"></i></a> &nbsp; <a href="#" class="pink"><i class="ace-icon fa fa-trash-o"></i></a></div></div><div class="widget-body"><div class="widget-main padding-8"></div></div></div><div class="space-6"></div></div></div></div></div></div>'), e.put("components/form/partials/elements/checkbox.html", '<div><label class="switch"><input ng-model="formCtrl.viewModel[elem.fieldName]" ng-change="formCtrl.validateField(elem.fieldName)" type="checkbox"> <i></i></label></div>'), e.put("components/form/partials/elements/date.html", '<div class="input-group"><input type="text" class="form-control" datepicker-popup="" ng-model="formCtrl.viewModel[elem.fieldName]" ng-change="formCtrl.validateField(elem.fieldName)" is-open="formCtrl.date[elem.fieldName].opened" min-date="minDate" max-date="maxDate" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="formCtrl.date[elem.fieldName].open($event)"><i class="fa fa-calendar"></i></button></span></div>'), e.put("components/form/partials/elements/multi-select.html", '<input class="form-control" ng-model="formCtrl.viewModel[elem.fieldName]" ng-blur="formCtrl.validateField(elem.fieldName)" placeholder="{{ formCtrl.placeholder(elem.label, elem.placeholder) }}">'), e.put("components/form/partials/elements/password.html", '<input type="password" class="form-control" ng-model="formCtrl.viewModel[elem.fieldName]" ng-blur="formCtrl.validateField(elem.fieldName)" ng-disabled="formCtrl.typeahead[elem.fieldName].disabled" placeholder="{{ formCtrl.placeholder(elem.label, elem.placeholder) }}">'), e.put("components/form/partials/elements/select.html", '<select class="form-control" ng-model="formCtrl.viewModel[elem.fieldName]" ng-change="formCtrl.validateField(elem.fieldName)"><option value=""></option><option ng-repeat="option in elem.choices" ng-bind="option.text" value="{{ option.value }}"></option></select>'), e.put("components/form/partials/elements/submit-small.html", '<div class="custom-form-save clearfix"><button type="button" ng-click="formCtrl.cancel()" class="btn btn-danger btn-xs pull-right margin-10-l"><i class="fa fa-times"></i> Cancel</button> <button ng-click="formCtrl.save()" class="btn btn-success btn-xs pull-right"><i class="fa fa-save"></i> Save</button></div>'), e.put("components/form/partials/elements/submit.html", '<hr><div class="custom-form-save clearfix"><button type="button" ng-click="formCtrl.cancel()" class="btn btn-danger btn-lg pull-right margin-10-l"><i class="fa fa-times"></i> Cancel</button> <button ng-click="formCtrl.save()" class="btn btn-success btn-lg pull-right"><i class="fa fa-save"></i> Save</button></div>'), e.put("components/form/partials/elements/text.html", '<input class="form-control" ng-model="formCtrl.viewModel[elem.fieldName]" ng-blur="formCtrl.validateField(elem.fieldName)" ng-disabled="formCtrl.typeahead[elem.fieldName].disabled" placeholder="{{ formCtrl.placeholder(elem.label, elem.placeholder) }}">'), e.put("components/form/partials/elements/textarea.html", '<textarea class="form-control" ng-model="formCtrl.viewModel[elem.fieldName]" ng-blur="formCtrl.validateField(elem.fieldName)" placeholder="{{ formCtrl.placeholder(elem.label, elem.placeholder) }}">\n</textarea>'), e.put("components/form/partials/elements/time.html", '<timepicker ng-model="formCtrl.viewModel[elem.fieldName]" ng-change="formCtrl.validateField(elem.fieldName)" hour-step="formCtrl.time[elem.fieldName].hstep" minute-step="formCtrl.time[elem.fieldName].mstep" show-meridian="formCtrl.time[elem.fieldName].ismeridian"></timepicker>'), e.put("components/form/partials/elements/typeahead-remote.html", '<input type="text" class="form-control" ng-model="formCtrl.viewModel[elem.fieldName]" placeholder="{{ formCtrl.placeholder(elem.label, elem.placeholder) }}" ng-blur="formCtrl.validateField(elem.fieldName)" typeahead="data.name for data in formCtrl.typeahead[elem.fieldName].get($viewValue)" typeahead-loading="loadingRemoteData" typeahead-on-select="formCtrl.typeahead[elem.fieldName].onSelect($item, $model, $label)" typeahead-editable="formCtrl.typeahead[elem.fieldName].editable"> <i ng-show="loadingRemoteData" class="fa fa-refresh"></i>'), e.put("components/form/partials/elements/typeahead.html", '<input type="text" class="form-control" ng-model="formCtrl.viewModel[elem.fieldName]" placeholder="{{ formCtrl.placeholder(elem.label, elem.placeholder) }}" typeahead="data for data in formCtrl.typeahead[elem.fieldName].list | filter:$viewValue" typeahead-loading="loadingRemoteData" typeahead-on-select="formCtrl.typeahead[elem.fieldName].onSelect($item, $model, $label)"> <i ng-show="loadingRemoteData" class="fa fa-refresh"></i>'), e.put("app/appointments/logs/partials/pass-template.html", '<div class="clearfix"><button class="btn btn-primary" ng-print="" print-element-id="printThisElement"><i class="fa fa-print"></i> Print</button></div><div id="printThisElement" style="width: 300px; height: 470px; border: 2px solid #000; padding-left: 10px; padding-right: 10px; margin:10px auto 20px;"><div style="padding-top: 10px;"><div style="font-size: 16px; font-weight: bold; float: left;">Visitor Pass</div><div style="float: right;"></div><div style="clear: both;"></div></div><div><div><div style="width: 100%; margin-top: 5%; margin-bottom: 5%; max-height: 210px"><h3 style="text-align: center; font-weight: bold">{{ appointment.purpose | uppercase }}</h3><img ng-if="((appointment).visitor).image" ng-src="{{ appointment.visitor.image }}" alt="" width="100%" style="margin:auto; width: 244px; height: 150px; display: block" class="img-responsive"> <img ng-if="!((appointment).visitor).image" ng-src="../../assets/avatars/place_holder.jpg" alt="" style="margin:auto; width: 244px; height: 150px; display: block" class="img-responsive"></div></div><div style="font-size: 16px;"><div style="top-bottom: 10px">Name: {{ appointment.visitor.first_name }} {{ appointment.visitor.last_name }}</div><div>Host: {{ appointment.host.first_name }} {{ appointment.host.last_name }}</div><div>Department: {{ (((appointment).host).department).name }}</div><div ng-if="((((appointment).host).department).floor) !== null">Floor: <strong>{{ ((((appointment).host).department).floor) }}</strong></div><div style="text-align: center">{{ appointment.start_date | date: \'dd/MM/yyyy\' }} {{ appointment.start_time | date: \'HH:mm\' }} - {{ appointment.end_time | date: \'HH:mm\' }}</div></div><div style="clear: both"></div></div><img id="barcode" style="max-height:80px; margin-top: 10px; width:100%"></div>'), e.put("app/departments/form/partials/edit.html", ""), e.put("app/departments/form/partials/wizard.html", '<form name="userProfile"><div class="row"><div class="col-sm-6"><div class="custom-form"><label>Username</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.username" placeholder="Enter Username here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'username\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'username\']" ng-bind="error"></span></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Email</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.email" placeholder="Enter Email here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'email\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'email\']" ng-bind="error"></span></div></div></div></div><div class="row"><div class="col-sm-6"><div class="custom-form"><label>Password</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.password" type="password" placeholder="Enter password"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'password\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'password\']" ng-bind="error"></span></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Confirm Password</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.password2" type="password" placeholder="Enter password again"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'password2\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'password2\']" ng-bind="error"></span></div></div></div></div><div class="row"><div class="col-sm-6"><div class="custom-form"><label>First Name</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.first_name" placeholder="Enter First Name here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'first_name\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'first_name\']" ng-bind="error"></span></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Last Name</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.last_name" placeholder="Enter Last Name here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'last_name\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'last_name\']" ng-bind="error"></span></div></div></div></div><div class="row"><div class="col-sm-6"><div class="custom-form"><label>Phone</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.phone" placeholder="Enter Phone here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'phone\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'phone\']" ng-bind="error"></span></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Work Phone</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.work_phone" placeholder="Enter Work phone here"></div></div></div></div><div class="row"><div class="col-sm-6"><div class="custom-form"><label>Home Phone</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.home_phone" placeholder="Enter Work Phone here"></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Department</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.department.name" placeholder="Enter Department here"></div></div></div></div><div class="row"><div class="col-sm-12"><hr><div class="custom-form-save clearfix"><button ng-click="formCtrl.save()" class="btn btn-success btn-lg pull-right"><i class="fa fa-save"></i> Save</button></div></div></div></form>'), e.put("app/users/form/partials/edit.html", ""), e.put("app/users/form/partials/image.html", '<label for="image">Image</label><div><span ng-if="formCtrl.upload.status">Activate Camera</span> <span ng-if="!formCtrl.upload.status">Activate Image Upload</span> <label class="switch"><input ng-model="formCtrl.upload.status" type="checkbox"> <i></i></label></div><div class="row"><div class="col-sm-12"><div class="clearfix"><div class="pull-left"><div ng-if="formCtrl.upload.status"><input id="image" type="file" ng-model-instant="" onchange="angular.element(this).scope().setFiles(this, \'image\')"></div><div ng-if="!formCtrl.upload.status"><div vi-camera=""><div camera-control-snapshot=""></div></div></div></div><div class="pull-right"><div ng-if="formCtrl.upload.status"><img ng-if="formCtrl.viewModel.image" ng-src="{{ formCtrl.viewModel.image }}"></div><div ng-if="!formCtrl.upload.status"><canvas></canvas></div></div></div></div></div>'), e.put("app/users/form/partials/wizard.html", '<form name="userProfile"><div class="row"><div class="col-sm-6"><div class="custom-form"><label>Username</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.username" placeholder="Enter Username here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'username\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'username\']" ng-bind="error"></span></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Email</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.email" placeholder="Enter Email here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'email\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'email\']" ng-bind="error"></span></div></div></div></div><div class="row"><div class="col-sm-6"><div class="custom-form"><label>Password</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.password" type="password" placeholder="Enter password"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'password\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'password\']" ng-bind="error"></span></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Confirm Password</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.password2" type="password" placeholder="Enter password again"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'password2\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'password2\']" ng-bind="error"></span></div></div></div></div><div class="row"><div class="col-sm-6"><div class="custom-form"><label>First Name</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.first_name" placeholder="Enter First Name here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'first_name\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'first_name\']" ng-bind="error"></span></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Last Name</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.last_name" placeholder="Enter Last Name here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'last_name\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'last_name\']" ng-bind="error"></span></div></div></div></div><div class="row"><div class="col-sm-6"><div class="custom-form"><label>Phone</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.phone" placeholder="Enter Phone here"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'phone\']"><i class="fa fa-exclamation-triangle"></i> <span ng-repeat="error in formCtrl.errorMsg[\'phone\']" ng-bind="error"></span></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Work Phone</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.work_phone" placeholder="Enter Work phone here"></div></div></div></div><div class="row"><div class="col-sm-6"><div class="custom-form"><label>Home Phone</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.home_phone" placeholder="Enter Work Phone here"></div></div></div><div class="col-sm-6"><div class="custom-form"><label>Department</label><div class="form-input"><input class="form-control" ng-model="formCtrl.profile.department.name" placeholder="Enter Department here"></div></div></div></div><div class="row"><div class="col-sm-12"><hr><div class="custom-form-save clearfix"><button ng-click="formCtrl.save()" class="btn btn-success btn-lg pull-right"><i class="fa fa-save"></i> Save</button></div></div></div></form>'), e.put("app/visitors/form/partials/company.html", '<label ng-bind="elem.label"></label> <strong class="text-danger" ng-if="elem.required">*</strong><div class="form-input" ng-include="\'app/visitors/form/partials/company/company.html\'"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[elem.fieldName].length"><span ng-repeat="error in formCtrl.errorMsg[elem.fieldName]"><i class="fa fa-exclamation-triangle"></i> {{ error }}</span></div>'), e.put("app/visitors/form/partials/image.html", '<label for="image">Image</label><div><span ng-if="formCtrl.upload.status">Activate Camera</span> <span ng-if="!formCtrl.upload.status">Activate Image Upload</span> <label class="switch"><input ng-model="formCtrl.upload.status" type="checkbox"> <i></i></label></div><div class="row"><div class="col-sm-12"><div class="clearfix"><div class="pull-left"><div ng-if="formCtrl.upload.status"><input id="image" type="file" ng-model-instant="" onchange="angular.element(this).scope().setFiles(this, \'image\')"></div><div ng-if="!formCtrl.upload.status"><div vi-camera=""><div camera-control-snapshot=""></div></div></div></div><div class="pull-right"><div ng-if="formCtrl.upload.status"><img ng-if="formCtrl.viewModel.image" ng-src="{{ formCtrl.viewModel.image }}"></div><div ng-if="!formCtrl.upload.status"><canvas></canvas></div></div></div></div></div>'), e.put("app/visitors/form/partials/phone.html", '<label ng-bind="elem.label"></label> <strong class="text-danger" ng-if="elem.required">*</strong><div class="form-input"><div class="row"><div class="col-sm-3"><div ng-include="\'app/visitors/form/partials/phone/prefix.html\'"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'phone.prefix\'].length"><span ng-repeat="error in formCtrl.errorMsg[\'phone.prefix\']"><i class="fa fa-exclamation-triangle"></i> {{ error }}</span></div></div><div class="col-sm-9"><div ng-include="\'app/visitors/form/partials/phone/suffix.html\'"></div><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'phone.suffix\'].length"><span ng-repeat="error in formCtrl.errorMsg[\'phone.suffix\']"><i class="fa fa-exclamation-triangle"></i> {{ error }}</span></div></div></div></div><input type="hidden" ng-model="formCtrl.viewModel.phone" ng-bind="formCtrl.phone.prefix + formCtrl.phone.suffix"><div class="text-danger error-div" ng-if="formCtrl.errorMsg[\'phone\'].length"><span ng-repeat="error in formCtrl.errorMsg[\'phone\']"><i class="fa fa-exclamation-triangle"></i> {{ error }}</span></div>'), e.put("app/departments/form/partials/forms/contact.html", ""), e.put("app/departments/form/partials/forms/password.html", ""), e.put("app/departments/form/partials/forms/user-detail.html", ""), e.put("app/users/form/partials/forms/contact.html", ""), e.put("app/users/form/partials/forms/password.html", ""), e.put("app/users/form/partials/forms/user-detail.html", ""), e.put("app/visitors/form/partials/company/company.html", '<input type="text" ng-model="formCtrl.viewModel[\'company.name\']" placeholder="Enter Company name" typeahead="company for company in formCtrl.getCompanies($viewValue)" typeahead-loading="loadingCompanies" typeahead-on-select="formCtrl.updateCompany($item, $model, $label)" class="form-control"> <i ng-show="loadingCompanies" class="fa fa-refresh"></i>'), e.put("app/visitors/form/partials/phone/prefix.html", '<input type="text" ng-model="formCtrl.viewModel[\'phone.prefix\']" style="border: 1px #EEEEEE solid" placeholder="0803" typeahead-editable="false" ng-blur="formCtrl.validateField(\'phone.prefix\')" typeahead="prefix for prefix in formCtrl.phone.prefixes | filter:$viewValue | limitTo:8" class="form-control">'), e.put("app/visitors/form/partials/phone/suffix.html", '<input type="text" class="form-control" style="border: 1px #EEEEEE solid" placeholder="7886565" ng-blur="formCtrl.validateField(\'phone.suffix\')" ng-model="formCtrl.viewModel[\'phone.suffix\']">')
}]);
