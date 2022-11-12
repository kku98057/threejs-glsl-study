"use strict";
var JT = JT || {};
!(function (t, g) {
  (JT.alert = function (e, t) {
    var o, r, i, n, a, l, u, s, d, m, c, f, v, p;
    ("object" != typeof e && "string" != typeof e) ||
      ("object" == typeof e
        ? ((i = e.message), (o = e.on_confirm), (r = e.on_cancel))
        : (i = e),
      "function" == typeof (t = void 0 === t ? "" : t) &&
        "object" != typeof e &&
        (o = t),
      (t = void 0 !== e.title && e.title),
      (i = void 0 !== e.message && e.message),
      (v = void 0 !== e.style ? e.style : "basic"),
      (n = void 0 !== e.type ? e.type : "none"),
      (a = !(void 0 === e.has_icon || "none" == e.type || !e.has_icon)),
      (l = void 0 !== e.primary_title && e.primary_title),
      (u = void 0 !== e.is_confirm && e.is_confirm),
      (s = void 0 === e.primary_button || e.primary_button),
      (d = void 0 === e.button_icon || e.button_icon),
      (m = void 0 !== e.ok ? e.ok : "확인"),
      (e = void 0 !== e.cancel ? e.cancel : "취소"),
      (f = (f = "jt-alert") + " jt-alert__style-" + v + " jt-alert__type-" + n),
      a && (f += " jt-alert--has-icon"),
      u && (f += " jt-alert--confirm"),
      l && (f += " jt-alert--primary-title"),
      s && (f += " jt-alert--primary-button"),
      d && (f += " jt-alert--button-icon"),
      i || (f += " jt-alert--no-message"),
      (v =
        (v = "") +
        '<div id="' +
        (c = "jt-alert--" + ((new Date().getTime() / 1e3) | 0)) +
        '" class="' +
        f +
        '" role="alert"><div class="jt-alert__container"><div class="jt-alert__content">'),
      t && (v += "<h1>" + t + "</h1>"),
      i && (v += "<p>" + i + "</p>"),
      (v += '</div> <div class="jt-alert__actions">'),
      u &&
        (v +=
          '<button class="jt-alert__btn jt-alert--cancel">' + e + "</button>"),
      (v =
        v +
        '<button class="jt-alert__btn jt-alert--ok">' +
        m +
        "</button></div></div> </div> "),
      g("body").append(v),
      g("#" + c + " .jt-alert--ok")
        .attr("tabindex", 0)
        .focus(),
      g("#" + c)
        .find(".jt-alert--ok")
        .on("click", function (e) {
          e.preventDefault(),
            g("#" + c).remove(),
            "function" == typeof o && o();
        }),
      g("#" + c)
        .find(".jt-alert--cancel")
        .on("click", function (e) {
          e.preventDefault(),
            g("#" + c).remove(),
            "function" == typeof r && r();
        }),
      (p = function (e) {
        "27" == e.which && g("#" + c).remove();
      }),
      g(document).off("keyup", p),
      g(document).on("keyup", function (e) {
        p(e);
      }));
  }),
    (JT.confirm = function (e) {
      confirm(e);
    }),
    (JT.loading = {
      show: function (e) {
        var t;
        (e = void 0 === e ? "로딩중" : e),
          g(".jt-alert-loading").length <= 0
            ? ((t =
                (t =
                  '<div class="jt-alert-loading"><div class="jt-alert-loading__container">') +
                '<div class="jt-alert-loading__content"><h1 class="jt-alert-loading__content-message">' +
                e +
                '</h1><div class="jt-alert-loading__progress"><div class="jt-alert-loading__progress-icon jt-alert-loading__progress-icon-01"></div><div class="jt-alert-loading__progress-icon jt-alert-loading__progress-icon-02"></div><div class="jt-alert-loading__progress-icon jt-alert-loading__progress-icon-03"></div></div> </div> </div> </div> '),
              g("body").append(t))
            : g(".jt-alert-loading__content-message").html(e);
      },
      remove: function () {
        g(".jt-alert-loading").remove();
      },
    }),
    (JT.scrollTo = function (e, t) {
      e = g(e);
      0 < e.length &&
        (t = null == t || g(t).length <= 0 ? g("html") : g(t))
          .stop()
          .animate(
            { scrollTop: e.offset().top - t.offset().top + t.scrollTop() - 10 },
            function () {}
          );
    }),
    (JT.smoothscroll = {
      passive: function () {
        var e = !1;
        try {
          document.addEventListener("test", null, {
            get passive() {
              e = !0;
            },
          });
        } catch (e) {}
        return e;
      },
      init: function () {
        var e;
        g("html").hasClass("mobile") ||
          g("html").hasClass("mac") ||
          ((e = g(window)).height(),
          this.passive()
            ? window.addEventListener("wheel", this.scrolling, { passive: !1 })
            : e.on("mousewheel DOMMouseScroll", this.scrolling));
      },
      destroy: function () {
        this.passive()
          ? window.removeEventListener("wheel", this.scrolling)
          : g(window).off("mousewheel DOMMouseScroll", this.scrolling),
          gsap.killTweensOf(g(window), { scrollTo: !0 });
      },
      scrolling: function (e) {
        e.preventDefault();
        var t = g(window),
          o = t.height() / 2.5,
          r = 0,
          r = JT.smoothscroll.passive()
            ? e.wheelDelta / 120 || -e.deltaY / 3
            : void 0 !== e.originalEvent.deltaY
            ? -e.originalEvent.deltaY / 120
            : e.originalEvent.wheelDelta / 120 || -e.originalEvent.detail / 3,
          e = t.scrollTop() - parseInt(r * o);
        gsap.to(t, {
          duration: 1,
          scrollTo: { y: e, autoKill: !0 },
          ease: Power3.easeOut,
          overwrite: 5,
        });
      },
    }),
    (JT.scroll = {
      destroy: function (e) {
        void 0 !== e && !0 === e && JT.smoothscroll.destroy(),
          this.support_passive()
            ? window.addEventListener("wheel", this.prevent_default, {
                passive: !1,
              })
            : g(window).on("mousewheel DOMMouseScroll", this.prevent_default);
      },
      restore: function (e) {
        void 0 !== e && !0 === e && JT.smoothscroll.init(),
          this.support_passive()
            ? window.removeEventListener("wheel", this.prevent_default)
            : g(window).off("mousewheel DOMMouseScroll", this.prevent_default);
      },
      support_passive: function () {
        var e = !1;
        try {
          document.addEventListener("test", null, {
            get passive() {
              e = !0;
            },
          });
        } catch (e) {}
        return e;
      },
      prevent_default: function (e) {
        e.preventDefault();
      },
    }),
    (JT.is_screen = function (e) {
      return t.matchMedia
        ? t.matchMedia("(max-width:" + e + "px)").matches
        : t.innerWidth <= e;
    }),
    (JT.win_height = function () {
      return window.screen.height === window.innerHeight
        ? window.screen.height
        : window.innerHeight;
    }),
    (JT.modal = function () {}),
    (JT.globals = {}),
    (JT.cookies = {
      create: function (e, t, o) {
        var r;
        (o = o
          ? ((r = new Date()).setTime(r.getTime() + 24 * o * 60 * 60 * 1e3),
            "; expires=" + r.toGMTString())
          : ""),
          (document.cookie = e + "=" + t + o + "; path=/");
      },
      read: function (e) {
        for (
          var t = e + "=", o = document.cookie.split(";"), r = 0;
          r < o.length;
          r++
        ) {
          for (var i = o[r]; " " == i.charAt(0); ) i = i.substring(1, i.length);
          if (0 == i.indexOf(t)) return i.substring(t.length, i.length);
        }
        return null;
      },
      destroy: function (e) {
        JT.cookies.create(e, "", -1);
      },
    }),
    (JT.history = {
      add: function (e) {
        var t;
        "history" in window &&
          "pushState" in history &&
          (((t = {})["jt-" + e] = "show"),
          history.pushState(t, null, location.href));
      },
      remove: function (e) {
        null != history.state &&
          "show" == history.state["jt-" + e] &&
          history.back();
      },
      listen: function (t, o, r, e) {
        (e = void 0 === e ? !1 : e)
          ? (window.addEventListener("hashchange", function (e) {
              r(), o(location.hash);
            }),
            window.addEventListener)
          : "PopStateEvent" in window &&
            window.addEventListener(
              "popstate",
              function (e) {
                null != e.state && "show" == e.state["jt-" + t]
                  ? "function" == typeof o && o()
                  : "function" == typeof r && r();
              },
              !1
            );
      },
    }),
    (JT.has_webgl = function () {
      try {
        var e = document.createElement("canvas");
        return (
          !!window.WebGLRenderingContext &&
          (e.getContext("webgl") || e.getContext("experimental-webgl"))
        );
      } catch (e) {
        return !1;
      }
    }),
    (JT.ui = {
      list: {},
      init: function () {
        try {
          for (var e in this.list)
            "function" == typeof this.list[e] && this.list[e].call();
        } catch (e) {
          console.log(e);
        }
      },
      add: function (e, t) {
        try {
          var o;
          "function" == typeof e &&
            ((o = e.name || e.toString().match(/^function\s*([^\s(]+)/)[1]),
            (this.list[o] = e),
            void 0 !== t && !0 === t && e.call());
        } catch (e) {
          console.log(e);
        }
      },
      del: function (e) {
        try {
          delete this.list[e];
        } catch (e) {
          console.log(e);
        }
      },
      replace: function (e, t) {
        try {
          "function" == typeof t && (this.list[e] = t);
        } catch (e) {
          console.log(e);
        }
      },
      get: function (e) {
        try {
          return this.list[e];
        } catch (e) {
          return console.log(e), null;
        }
      },
      call: function (e) {
        try {
          this.list[e].call();
        } catch (e) {
          console.log(e);
        }
      },
    }),
    (JT.josa = function (e, t, o) {
      var r = [
          function (e) {
            return i(e) ? "을" : "를";
          },
          function (e) {
            return i(e) ? "은" : "는";
          },
          function (e) {
            return i(e) ? "이" : "가";
          },
          function (e) {
            return i(e) ? "과" : "와";
          },
          function (e) {
            return i(e) ? "으로" : "로";
          },
        ],
        r = {
          "을/를": r[0],
          을: r[0],
          를: r[0],
          을를: r[0],
          "은/는": r[1],
          은: r[1],
          는: r[1],
          은는: r[1],
          "이/가": r[2],
          이: r[2],
          가: r[2],
          이가: r[2],
          "와/과": r[3],
          와: r[3],
          과: r[3],
          와과: r[3],
          "으로/로": r[4],
          으로: r[4],
          로: r[4],
          으로로: r[4],
        };
      if ("undefiend" == typeof r[t]) throw "Invalid format";
      return (o ? e : "") + r[t](e);
      function i(e) {
        return 0 < (e.charCodeAt(e.length - 1) - 44032) % 28;
      }
    }),
    (JT.task = function () {
      var t = [];
      return {
        push: function (e) {
          return t.push(e);
        },
        run: function e() {
          t.shift()(function () {
            0 < t.length && e();
          });
        },
      };
    }),
    (JT.killChildTweensOf = function (t, e) {
      var o,
        r,
        i,
        n = gsap.utils.toArray(t),
        a = n.length;
      if (1 < a) for (; -1 < --a; ) killChildTweensOf(n[a], e);
      else
        for (
          t = n[0], r = gsap.globalTimeline.getChildren(!0, !0, !1), a = 0;
          a < r.length;
          a++
        )
          for (o = (i = r[a].targets()).length, o = 0; o < i.length; o++)
            !(function (e) {
              for (; e; ) if ((e = e.parentNode) === t) return !0;
            })(i[o]) || (e && r[a].totalProgress(1), r[a].kill());
    });
})(window, jQuery),
  jQuery(function (e) {
    var t;
    gsap.config({ nullTargetWarn: !1, trialWarn: !1 }),
      (t = e("body"))
        .on("mousedown", function () {
          t.addClass("use-mouse");
        })
        .on("keydown", function () {
          t.removeClass("use-mouse");
        }),
      null != JT.globals.scroller
        ? JT.globals.scroller.update()
        : ((JT.globals.scroller = new LocomotiveScroll({
            el: document.querySelector("[data-scroll-container]"),
            lerp: 0.05,
            multiplier: 0.6,
            smooth: !0,
            tablet: { smooth: !0 },
            smartphone: { smooth: !0 },
          })),
          ScrollTrigger.scrollerProxy("[data-scroll-container]", {
            scrollTop: function (e) {
              return arguments.length
                ? JT.globals.scroller.scrollTo(e, 0, 0)
                : JT.globals.scroller.scroll.instance.scroll.y;
            },
            getBoundingClientRect: function () {
              return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
              };
            },
          }),
          JT.globals.scroller.on("scroll", function (e) {
            ScrollTrigger.update();
          }),
          ScrollTrigger.addEventListener("refresh", function () {
            JT.globals.scroller.update();
          }),
          ScrollTrigger.refresh(),
          JT.globals.scroller.stop());
  }),
  (function () {
    let t,
      J,
      N,
      W,
      O,
      Y,
      X,
      V,
      Z,
      I,
      U,
      q,
      e,
      l,
      u,
      o,
      Q,
      r,
      K,
      i,
      s,
      ee,
      te,
      oe,
      re,
      ie,
      ne,
      ae,
      ge = [],
      he = [],
      le = 1;
    const ue = ["#006dff", "#fc0001", "#f2e300"],
      we = ["#006dff", "#fc0001", "#f2e300"];
    let _e = 0.3,
      se = !1,
      de = null,
      me = null,
      ce = 0;
    var n = document.documentElement.classList.contains("win");
    const fe = n ? 20 : 40,
      ve = window.innerWidth <= 860;
    let d = 0.002;
    oe = {
      bgColor: "#000000",
      dotColor: "#ffc200",
      dotColorShadow: "#7c4a00",
      useRandColor: !1,
      useGradColor: !0,
      gradDirX: !1,
      gradDirY: !1,
      color1: ue[0],
      color2: ue[1],
      color3: ue[2],
      dotSize: fe,
      dotMinSize: n ? 0.01 : 0.07,
      num: 18e3,
      sunX: 3.6,
      sunY: 6.4,
      sunZ: 10,
      gradX: 1,
      gradY: 0,
      gradZ: 80,
      animate: !0,
      helper: !1,
      blending: "Additive",
      useMouse: !1,
      useShadowRandom: !0,
      depthWrite: !1,
      depthTest: !1,
      morph: 0,
    };
    {
      (i = new THREE.WebGLRenderer({ antialias: !0, alpha: !0 })).setPixelRatio(
        window.devicePixelRatio
      ),
        i.setSize(window.innerWidth, window.innerHeight),
        (i.shadowMap.enabled = !0),
        document.getElementById("jt-particules").appendChild(i.domElement),
        ((r = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          0.1,
          100
        )).position.z = 5),
        (r.position.y = 0),
        (e = new THREE.GLTFLoader()),
        (n = new THREE.DRACOLoader()).setDecoderPath("../draco/"),
        e.setDRACOLoader(n),
        (l = new THREE.GLTFLoader()).setDRACOLoader(n),
        (u = new THREE.GLTFLoader()).setDRACOLoader(n),
        (o = new THREE.GLTFLoader()).setDRACOLoader(n),
        ((K = new THREE.Scene()).background = new THREE.Color(oe.bgColor)),
        K.add(r),
        ((s = new THREE.OrbitControls(r, i.domElement)).enabled = !1),
        (ee = new THREE.TextureLoader().load(
          "../textures/disc-stroke-fill3.png"
        ));
      var m = "../models/earth.glb";
      e.load(m, function (k) {
        l.load("../models/land.glb", function (F) {
          u.load("../models/rocket-v2.glb", function (G) {
            o.load("../models/character-v2.glb", function (B) {
              o.load("../models/logo.glb", function (e) {
                var t = new THREE.ShaderMaterial({
                  uniforms: {
                    uColor1: { value: new THREE.Color(we[0]) },
                    uColor2: { value: new THREE.Color(we[1]) },
                    uColor3: { value: new THREE.Color(we[2]) },
                    uOpacity: { value: 0.5 },
                    uTime: { value: 0 },
                    uScale: { value: 0.6 },
                    uSize: { value: fe },
                    uTexture: { value: ee },
                  },
                  vertexShader: pe("vert2"),
                  fragmentShader: pe("frag2"),
                  depthTest: !0,
                  depthWrite: !1,
                  ransparent: !0,
                  blending: THREE.AdditiveBlending,
                });
                const o = new THREE.BufferGeometry(),
                  r = [],
                  i = [];
                for (let e = 0; e < 700; e++) {
                  var n = 40 * Math.random() - 20,
                    a = 40 * Math.random() - 20,
                    l = 40 * Math.random() - 20;
                  i.push(
                    2 * Math.random() - 1,
                    2 * Math.random() - 1,
                    2 * Math.random() - 1
                  ),
                    r.push(n, a, l);
                }
                o.setAttribute(
                  "position",
                  new THREE.Float32BufferAttribute(r, 3)
                ),
                  o.setAttribute(
                    "aRandom",
                    new THREE.Float32BufferAttribute(i, 3)
                  ),
                  ((re = new THREE.Points(o, t)).position.z = -10);
                (t = {
                  u_amplitude: { type: "f", value: oe.morph },
                  u_slide: { type: "f", value: 0 },
                  u_time: { type: "f", value: 0 },
                  u_resolution: { type: "v2", value: { x: 2048, y: 1024 } },
                  u_color: { type: "v3", value: new THREE.Color(oe.dotColor) },
                  u_colorGrad1: {
                    type: "v3",
                    value: new THREE.Color(oe.color1),
                  },
                  u_colorGrad2: {
                    type: "v3",
                    value: new THREE.Color(oe.color2),
                  },
                  u_colorGrad3: {
                    type: "v3",
                    value: new THREE.Color(oe.color3),
                  },
                  u_colorShadow: { value: new THREE.Color(oe.dotColorShadow) },
                  u_useRandColor: { value: oe.useRandColor },
                  u_useGradColor: { value: oe.useGradColor },
                  u_gradDirX: { value: oe.gradDirX },
                  u_gradDirY: { value: oe.gradDirY },
                  u_opacity: { value: 1 },
                  sunPosition: {
                    type: "v3",
                    value: { x: oe.sunX, y: oe.sunY, z: oe.sunZ },
                  },
                  u_gradPosition: {
                    type: "v3",
                    value: { x: oe.gradX, y: oe.gradY, z: oe.gradZ },
                  },
                  u_texture: ee,
                  u_size: { type: "f", value: oe.dotSize },
                  u_scale: { type: "f", value: 0.2 },
                  u_minSize: { type: "f", value: oe.dotMinSize },
                  u_mousePos: { type: "v3", value: new THREE.Vector3() },
                  u_useMouse: { value: oe.useMouse },
                  u_useShadowRandom: { value: oe.useShadowRandom },
                }),
                  (t = new THREE.ShaderMaterial({
                    uniforms: t,
                    vertexShader: pe("vert1"),
                    fragmentShader: pe("frag1"),
                    depthTest: !0,
                    depthWrite: oe.depthWrite,
                    transparent: !0,
                    blending: Te(oe.blending),
                    morphTargets: !0,
                  }));
                let u = {};
                k.scene.traverse(function (e) {
                  e.isMesh && (u = e);
                });
                var s = F.scene.children[0],
                  d = G.scene.children[0],
                  m = B.scene.children[0],
                  e = e.scene.children[0],
                  c = new THREE.SphereGeometry(1, 32, 16),
                  c = new THREE.Mesh(c);
                let f = new THREE.MeshSurfaceSampler(u)
                    .setWeightAttribute(null)
                    .build(),
                  v = new THREE.MeshSurfaceSampler(s)
                    .setWeightAttribute(null)
                    .build(),
                  p = new THREE.MeshSurfaceSampler(d)
                    .setWeightAttribute(null)
                    .build(),
                  g = new THREE.MeshSurfaceSampler(m)
                    .setWeightAttribute(null)
                    .build(),
                  h = new THREE.MeshSurfaceSampler(e)
                    .setWeightAttribute(null)
                    .build(),
                  w = new THREE.MeshSurfaceSampler(c)
                    .setWeightAttribute(null)
                    .build(),
                  _ = new THREE.Vector3(),
                  T = new THREE.Vector3(),
                  E = new THREE.Vector3(),
                  y = new THREE.Vector3(),
                  b = new THREE.Vector3(),
                  R = new THREE.Vector3(),
                  S = new THREE.Vector3(),
                  x = new THREE.Vector3(),
                  z = new THREE.Vector3(),
                  H = new THREE.Vector3(),
                  A = new THREE.Vector3(),
                  C = new THREE.Vector3(),
                  M = [],
                  P = [],
                  D = [],
                  j = [];
                s = new Array(oe.num).fill(0).map((e) => {
                  var t;
                  return (
                    P.push(0.1),
                    M.push.apply(
                      M,
                      ((t = Math.floor(Math.random() * ue.length)),
                      (t = ue[t]),
                      (t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t))
                        ? [
                            parseInt(t[1], 16) / 255,
                            parseInt(t[2], 16) / 255,
                            parseInt(t[3], 16) / 255,
                          ]
                        : null)
                    ),
                    f.sample(_, T),
                    he.push(T.x, T.y, T.z),
                    D.push(
                      2 * Math.random() - 1,
                      2 * Math.random() - 1,
                      2 * Math.random() - 1
                    ),
                    j.push(
                      -2 * Math.random() + 3,
                      -5 * Math.random() + 5,
                      -5 * Math.random() + 5
                    ),
                    ge.push(_.x, _.y, _.z),
                    _.clone()
                  );
                });
                (W = []),
                  (N = []),
                  new Array(oe.num)
                    .fill(0)
                    .map(
                      (e) => (
                        v.sample(E, y),
                        N.push(y.x, y.y, y.z),
                        W.push(E.x, E.y, E.z),
                        E.clone()
                      )
                    ),
                  (Y = []),
                  (O = []),
                  new Array(oe.num)
                    .fill(0)
                    .map(
                      (e) => (
                        p.sample(b, R),
                        O.push(R.x, R.y, R.z),
                        Y.push(b.x, b.y, b.z),
                        b.clone()
                      )
                    ),
                  (V = []),
                  (X = []),
                  new Array(oe.num)
                    .fill(0)
                    .map(
                      (e) => (
                        g.sample(S, x),
                        X.push(x.x, x.y, x.z),
                        V.push(S.x, S.y, S.z),
                        S.clone()
                      )
                    ),
                  (I = []),
                  (Z = []),
                  new Array(oe.num)
                    .fill(0)
                    .map(
                      (e) => (
                        h.sample(z, H),
                        Z.push(H.x, H.y, H.z),
                        I.push(z.x, z.y, z.z),
                        z.clone()
                      )
                    ),
                  (q = []),
                  (U = []),
                  new Array(oe.num)
                    .fill(0)
                    .map(
                      (e) => (
                        w.sample(A, C),
                        U.push(C.x, C.y, C.z),
                        q.push(A.x, A.y, A.z),
                        A.clone()
                      )
                    ),
                  (ae = new THREE.BufferGeometry().setFromPoints(
                    s
                  )).setAttribute(
                    "normal",
                    new THREE.Float32BufferAttribute(he, 3)
                  ),
                  ae.setAttribute(
                    "color",
                    new THREE.Float32BufferAttribute(M, 3)
                  ),
                  ae.setAttribute(
                    "randomess",
                    new THREE.Float32BufferAttribute(D, 3)
                  ),
                  ae.setAttribute(
                    "shadowRandomess",
                    new THREE.Float32BufferAttribute(j, 3)
                  ),
                  ae.setAttribute(
                    "sizes",
                    new THREE.Float32BufferAttribute(P, 1)
                  ),
                  ae.setAttribute(
                    "morphTarget1",
                    new THREE.Float32BufferAttribute(W, 3)
                  ),
                  ae.setAttribute(
                    "morphNormal1",
                    new THREE.Float32BufferAttribute(N, 3)
                  ),
                  ae.setAttribute(
                    "morphTarget2",
                    new THREE.Float32BufferAttribute(Y, 3)
                  ),
                  ae.setAttribute(
                    "morphNormal2",
                    new THREE.Float32BufferAttribute(O, 3)
                  ),
                  ae.setAttribute(
                    "morphTarget3",
                    new THREE.Float32BufferAttribute(V, 3)
                  ),
                  ae.setAttribute(
                    "morphNormal3",
                    new THREE.Float32BufferAttribute(X, 3)
                  ),
                  ae.setAttribute(
                    "morphTargetSphere",
                    new THREE.Float32BufferAttribute(q, 3)
                  ),
                  ae.setAttribute(
                    "morphNormalSphere",
                    new THREE.Float32BufferAttribute(U, 3)
                  ),
                  ae.setAttribute(
                    "morphTarget4",
                    new THREE.Float32BufferAttribute(I, 3)
                  ),
                  ae.setAttribute(
                    "morphNormal4",
                    new THREE.Float32BufferAttribute(Z, 3)
                  ),
                  (te = new THREE.Points(ae, t)),
                  (ne = new THREE.Group()).add(te),
                  (ne.rotation.y -= 1.3),
                  ((ie = new THREE.Group()).position.z = ve ? -0.8 : 0.8),
                  ie.add(ne),
                  K.add(ie),
                  (Q = new THREE.Group()).add(re),
                  K.add(Q),
                  (oe.num = 1e4),
                  te.geometry.setDrawRange(0, oe.num);
                {
                  de = new gsap.timeline({
                    onUpdate: K.render,
                    scrollTrigger: {
                      trigger: ".main-container",
                      scroller: "[data-scroll-container]",
                      scrub: !0,
                      start: "top top",
                      end: "bottom bottom",
                      onUpdate: (e) => {
                        le = e.direction;
                      },
                    },
                    defaults: { duration: 1, ease: "none" },
                  });
                  let e = 0;
                  (d = 2 * Math.PI),
                    de.addLabel("section0"),
                    de.add(function () {
                      te.material.uniforms.u_slide.value = 0;
                    }, e),
                    ve &&
                      ((e += 0.1),
                      de.to(
                        ".main-fullpage__scroll-btn",
                        { duration: 0.4, autoAlpha: 0 },
                        e
                      ),
                      (e += 0.1)),
                    (e += 0.001),
                    de.to(J.scale, { duration: 2, x: 0, y: 0, z: 0 }, e),
                    de.to(
                      J.position,
                      { duration: 2, x: ve ? 0 : 1.5, y: 0, z: -2.4 },
                      e
                    ),
                    de.to(ie.rotation, { duration: 2, y: d }, e),
                    de.to(
                      ie.position,
                      {
                        x: ve ? 0 : 1.5,
                        y: ve ? 0.8 : 0,
                        z: ve ? -2.4 : 0.5,
                        duration: 2,
                      },
                      e
                    ),
                    de.to(
                      oe,
                      {
                        duration: 2,
                        num: 18e3,
                        onUpdate: () => {
                          te.geometry.setDrawRange(0, oe.num);
                        },
                      },
                      e
                    ),
                    de.to(
                      te.material.uniforms.u_amplitude,
                      { duration: 2, value: 1 },
                      e
                    ),
                    (e += 2),
                    de.addLabel("section1", "+=0.4"),
                    de.add(function () {
                      let e = W,
                        t = N,
                        o = 1;
                      -1 == le && ((e = ge), (t = he), (o = 0)),
                        ae.setAttribute(
                          "position",
                          new THREE.Float32BufferAttribute(e, 3)
                        ),
                        ae.setAttribute(
                          "normal",
                          new THREE.Float32BufferAttribute(t, 3)
                        ),
                        (te.material.uniforms.u_slide.value = o),
                        (te.material.uniforms.u_amplitude.value = 0);
                    }, e),
                    (e += 0.01),
                    de.to(ie.rotation, { duration: 2, y: 1.6 * d }, e),
                    de.to(ie.position, { duration: 2, x: 0, z: 3.6, y: 0 }, e),
                    (e += 1),
                    de.to(ie.rotation, { duration: 2, y: 1.8 * d }, e),
                    de.to(
                      re.material.uniforms.uSize,
                      { duration: 2, value: 0 },
                      e
                    ),
                    de.to(
                      oe,
                      {
                        duration: 2,
                        num: 800,
                        onUpdate: () => {
                          te.geometry.setDrawRange(0, oe.num);
                        },
                      },
                      e
                    ),
                    de.to(oe, { duration: 2, dotSize: 3.5 * fe }, e),
                    de.to(oe, { duration: 2, dotMinSize: 0.03 }, e),
                    de.to(
                      te.material.uniforms.u_amplitude,
                      { duration: 2, value: 1 },
                      e
                    ),
                    (e += 2),
                    de.addLabel("section2", "+=0.4"),
                    de.add(function () {
                      let e = q,
                        t = U,
                        o = 2;
                      -1 == le && ((e = W), (t = N), (o = 1)),
                        ae.setAttribute(
                          "position",
                          new THREE.Float32BufferAttribute(e, 3)
                        ),
                        ae.setAttribute(
                          "normal",
                          new THREE.Float32BufferAttribute(t, 3)
                        ),
                        (te.material.uniforms.u_slide.value = o),
                        (te.material.uniforms.u_amplitude.value = 0);
                    }, e),
                    (e += 0.1),
                    de.to(ie.rotation, { duration: 4, y: 2 * d }, e),
                    (e += 3),
                    de.to(
                      oe,
                      {
                        duration: 2,
                        num: 1e4,
                        onUpdate: () => {
                          te.geometry.setDrawRange(0, oe.num);
                        },
                      },
                      e
                    ),
                    de.to(re.material, { duration: 2, size: _e }, e),
                    de.to(oe, { duration: 2, dotSize: fe }, e),
                    de.to(oe, { duration: 2, dotMinSize: 0.1 }, e),
                    de.to(
                      re.material.uniforms.uSize,
                      { duration: 2, value: fe },
                      e
                    ),
                    de.to(
                      ie.position,
                      {
                        x: ve ? 0 : 2,
                        y: ve ? 0.7 : 0,
                        z: ve ? -1 : 0,
                        duration: 2,
                      },
                      e
                    ),
                    de.to(
                      ie.rotation,
                      { duration: 2, y: 2 * d, z: 0.15 * d },
                      e
                    ),
                    de.to(oe, { duration: 2, gradX: 370 }, e),
                    de.to(oe, { duration: 2, gradY: 1024 }, e),
                    de.to(oe, { duration: 2, gradZ: 214 }, e),
                    de.to(
                      te.material.uniforms.u_amplitude,
                      { duration: 2, value: 1 },
                      e
                    ),
                    (e += 2),
                    de.addLabel("section3", "+=0.4"),
                    de.add(function () {
                      let e = Y,
                        t = O,
                        o = 3;
                      -1 == le && ((e = q), (t = U), (o = 2)),
                        ae.setAttribute(
                          "position",
                          new THREE.Float32BufferAttribute(e, 3)
                        ),
                        ae.setAttribute(
                          "normal",
                          new THREE.Float32BufferAttribute(t, 3)
                        ),
                        (te.material.uniforms.u_slide.value = o),
                        (te.material.uniforms.u_amplitude.value = 0);
                    }, e),
                    (e += 0.1),
                    de.to(
                      te.rotation,
                      { duration: 4, y: d, ease: "sine.inOut" },
                      e
                    ),
                    (e += 2),
                    de.to(
                      ie.position,
                      { duration: 2, x: -3, y: 3, z: 3, ease: "back.in(2)" },
                      e
                    ),
                    (e += 1),
                    de.set(oe, { animate: !0 }, e),
                    (e += 2),
                    de.set(oe, { animate: !1 }, e),
                    de.set(te.rotation, { duration: 2, y: -0.25 * d }, e),
                    de.set(ie.rotation, { duration: 2, y: 0 }, e),
                    de.set(ne.rotation, { duration: 2, y: 0 }, e),
                    de.set(ie.position, { duration: 2, z: 6, x: 0, y: 0 }, e),
                    (e += 0.1),
                    de.to(
                      oe,
                      {
                        duration: 2,
                        num: 18e3,
                        onUpdate: () => {
                          te.geometry.setDrawRange(0, oe.num);
                        },
                      },
                      e
                    ),
                    de.to(ie.rotation, { duration: 2, z: 0 }, e),
                    de.to(
                      ie.position,
                      {
                        duration: 2,
                        x: ve ? 0 : 2,
                        y: ve ? 0.5 : 0,
                        z: ve ? -1 : 0,
                      },
                      e
                    ),
                    de.to(oe, { duration: 2, gradX: 325 }, e),
                    de.to(oe, { duration: 2, gradY: 250 }, e),
                    de.to(oe, { duration: 2, gradZ: 962 }, e),
                    de.to(
                      te.material.uniforms.u_amplitude,
                      { duration: 2, value: 1, ease: "power3.in" },
                      e
                    ),
                    (e += 2),
                    de.addLabel("section4", "+=0.4"),
                    de.add(function () {
                      let e = V,
                        t = X,
                        o = 4;
                      -1 == le && ((e = Y), (t = O), (o = 3)),
                        ae.setAttribute(
                          "position",
                          new THREE.Float32BufferAttribute(e, 3)
                        ),
                        ae.setAttribute(
                          "normal",
                          new THREE.Float32BufferAttribute(t, 3)
                        ),
                        (te.material.uniforms.u_slide.value = o),
                        (te.material.uniforms.u_amplitude.value = 0);
                    }, e),
                    (e += 0.1),
                    de.to(
                      te.rotation,
                      { duration: 2.2, y: 0.2 * d, ease: "sine.inOut" },
                      e
                    ),
                    (e += 2),
                    de.to(
                      ie.position,
                      { duration: 2, z: 0, x: 0.1, y: 0.25 },
                      e
                    ),
                    de.to(ie.rotation, { duration: 2, y: 0.585 * d }, e),
                    de.to(oe, { duration: 2, dotMinSize: 0.25 }, e),
                    de.to(oe, { duration: 2, gradX: 1024 }, e),
                    de.to(oe, { duration: 2, gradY: -560 }, e),
                    de.to(oe, { duration: 2, gradZ: -518 }, e),
                    de.to(".overlay", { autoAlpha: ve ? 0.2 : 0.1 }, e),
                    ve
                      ? de.to(
                          ".footer__company-link",
                          { delay: 0.5, y: -15, autoAlpha: 1 },
                          e
                        )
                      : (de.to(
                          ".main-fullpage__scroll-btn",
                          { autoAlpha: 0 },
                          e
                        ),
                        de.set(
                          ".main-section__bottom-menu",
                          { autoAlpha: 0 },
                          e
                        )),
                    de.to(".footer__copy", { delay: 1, autoAlpha: 0.8 }, e),
                    de.to(
                      te.material.uniforms.u_amplitude,
                      { duration: 2, value: 1 },
                      e
                    ),
                    (e += 2),
                    de.addLabel("section5", "+=0.4"),
                    de.add(function () {
                      let e = I,
                        t = Z,
                        o = 5;
                      -1 == le && ((e = V), (t = X), (o = 4)),
                        ae.setAttribute(
                          "position",
                          new THREE.Float32BufferAttribute(e, 3)
                        ),
                        ae.setAttribute(
                          "normal",
                          new THREE.Float32BufferAttribute(t, 3)
                        ),
                        (te.material.uniforms.u_slide.value = o),
                        (te.material.uniforms.u_amplitude.value = 0);
                    }, e),
                    (e += 0.1),
                    de.add(function () {}, e);
                }
                {
                  me = gsap.timeline({
                    scrollTrigger: {
                      scroller: "[data-scroll-container]",
                      start: "top 50%",
                      end: "bottom 45%",
                      scrub: !0,
                      ease: "none",
                    },
                  });
                  const L = ["+=0", "-=1.2", "-=1.2", "+=0", "+=3", "+=1"];
                  $(".main-section__container .jt-split-text").each(function (
                    e
                  ) {
                    var t = $(this);
                    0 < t.find(".lineParent").length ||
                      (new SplitText(t.find("h2, p, li"), {
                        type: "lines",
                        linesClass: "lineChild",
                      }),
                      new SplitText(t.find("h2, p, li"), {
                        type: "lines",
                        linesClass: "lineParent",
                      }),
                      me.from(".lineChild", {
                        y: "50%",
                        autoAlpha: 0,
                        rotation: 5,
                        transformOrigin: "0% 50% -50",
                        duration: 3.5,
                        ease: "power3.out",
                        stagger: 0.05,
                      }),
                      me.add(function () {
                        Ee(e, le);
                      }, L[e]),
                      me.addLabel("section" + e, L[e]),
                      me.to(".lineChild", { duration: 1.5 }),
                      me.to(".lineChild", {
                        y: "-50%",
                        autoAlpha: 0,
                        rotation: -5,
                        transformOrigin: "0% 50% -50",
                        duration: 3.5,
                        ease: "power3.in",
                        stagger: 0.05,
                      }));
                  });
                }
                gsap.from(ie.rotation, {
                  duration: 3.5,
                  y: -Math.PI,
                  ease: "power3.out",
                  onComplete: function () {
                    JT.globals.scroller.start();
                  },
                }),
                  gsap.from(ie.scale, {
                    duration: 3,
                    delay: 0.3,
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    ease: "back.out(1)",
                  }),
                  gsap.to(".overlay", {
                    duration: 2,
                    autoAlpha: 0,
                    onComplete: function () {
                      gsap.set(".overlay", { zIndex: 0 });
                    },
                  }),
                  $(".jt-intro-text").each(function () {
                    var e = $(this);
                    new SplitText(e.find("h2, p"), {
                      type: "lines",
                      linesClass: "introLineChild",
                    }),
                      new SplitText(e.find("h2, p"), {
                        type: "lines",
                        linesClass: "lineParent",
                      }),
                      gsap.from(".introLineChild", {
                        y: "50%",
                        autoAlpha: 0,
                        delay: 1.5,
                        rotation: 5,
                        transformOrigin: "0% 50% -50",
                        duration: 1.2,
                        ease: "power3.out",
                        stagger: 0.05,
                      });
                  }),
                  gsap.from(".scoll-nav", {
                    duration: 1.8,
                    delay: 2,
                    opacity: 0,
                    x: "80px",
                    ease: "power3.out",
                    stagger: 0.2,
                  }),
                  gsap.from(".main-fullpage__scroll-btn", {
                    duration: 1.8,
                    delay: 2.3,
                    opacity: 0,
                    y: "80px",
                    ease: "power3.out",
                    stagger: 0.2,
                  }),
                  $(".main-fullpage__scroll-btn").on("click", function (e) {
                    e.preventDefault(),
                      !0 !== se &&
                        ((ce += 1),
                        (se = !0),
                        (e = me.scrollTrigger.labelToScroll("section" + ce)),
                        JT.globals.scroller.scrollTo(e, {
                          easing: [0.17, 0.67, 0.22, 0.99],
                          duration: 2e3,
                          callback: function () {
                            Ee(ce, le), (se = !1);
                          },
                        }));
                  });
              });
            });
          });
        });
      }),
        ((J = new THREE.Mesh(
          new THREE.SphereGeometry(3.2, 16, 16),
          new THREE.MeshBasicMaterial({ color: "black", wireframe: !1 })
        )).position.z = -5),
        K.add(J),
        (t = new THREE.EffectComposer(i)).addPass(new THREE.RenderPass(K, r));
      const a = new THREE.UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          1.5,
          0.4,
          0.85
        ),
        p =
          ((a.threshold = 0),
          (a.strength = 1.1),
          (a.radius = 0.3),
          t.addPass(a),
          new THREE.FilmPass(0.35, 0.6, 2048, !1));
      (p.renderToScreen = !0),
        t.addPass(p),
        window.addEventListener("resize", c);
    }
    function c() {
      var e = window.innerWidth / window.innerHeight;
      i.setSize(window.innerWidth, window.innerHeight),
        t.setSize(window.innerWidth, window.innerHeight),
        (r.aspect = e),
        r.updateProjectionMatrix(),
        ($("html").hasClass("ios") && $("html").hasClass("kakao")) ||
          (gsap.set(".overlay", { zIndex: 9 }),
          gsap.to(".overlay", {
            duration: 0.2,
            autoAlpha: 1,
            onComplete: function () {
              window.location.reload();
            },
          }));
    }
    !(function e() {
      s.update();
      v();
      requestAnimationFrame(e);
    })();
    let f = new THREE.Clock();
    function v() {
      var e;
      te?.material &&
        ((e = f.getElapsedTime()),
        (re.material.uniforms.uTime.value = e),
        Math.cos(parseFloat(oe.sun)),
        Math.sin(parseFloat(oe.sun)),
        (te.material.uniforms.u_texture.value = ee),
        (te.material.uniforms.u_time.value = e),
        (te.material.uniforms.u_color.value = new THREE.Color(oe.dotColor)),
        (te.material.uniforms.u_colorShadow.value = new THREE.Color(
          oe.dotColorShadow
        )),
        (te.material.uniforms.u_colorGrad1.value = new THREE.Color(oe.color1)),
        (te.material.uniforms.u_colorGrad2.value = new THREE.Color(oe.color2)),
        (te.material.uniforms.u_colorGrad3.value = new THREE.Color(oe.color3)),
        (te.material.uniforms.u_gradDirY.value = oe.gradDirY),
        (te.material.uniforms.u_gradDirX.value = oe.gradDirX),
        (te.material.uniforms.u_size.value = parseFloat(oe.dotSize)),
        (te.material.uniforms.u_minSize.value = parseFloat(oe.dotMinSize)),
        (te.material.uniforms.sunPosition.value = {
          x: oe.sunX,
          y: oe.sunY,
          z: oe.sunZ,
        }),
        (te.material.uniforms.u_gradPosition.value = {
          x: oe.gradX,
          y: oe.gradY,
          z: oe.gradZ,
        }),
        (te.material.uniforms.u_useMouse.value = oe.useMouse),
        (te.material.uniforms.u_useShadowRandom.value = oe.useShadowRandom),
        (te.material.blending = Te(oe.blending)),
        oe.animate && (ne.rotation.y += d),
        (re.rotation.y += 25e-5)),
        t.render();
    }
    function Te(e) {
      return "None" === e
        ? THREE.NoBlending
        : "Normal" === e
        ? THREE.NormalBlending
        : "Additive" === e
        ? THREE.AdditiveBlending
        : "Subtractive" === e
        ? THREE.SubtractiveBlending
        : "Multiply" === e
        ? THREE.MultiplyBlending
        : void 0;
    }
    function Ee(e, t) {
      t = -1 == t ? (e - 1 < 0 ? 0 : e - 1) : e;
      $(".swiper-pagination-bullet").removeClass(
        "swiper-pagination-bullet-active"
      ),
        $(".swiper-pagination-bullet")
          .eq(t)
          .addClass("swiper-pagination-bullet-active"),
        se || (ce = t);
    }
    function pe(e) {
      return "vert1" === e
        ? `
          attribute vec3 color;
          attribute vec3 randomess;
          attribute vec3 shadowRandomess;
          attribute vec3 morphTarget1;
          attribute vec3 morphNormal1;
          attribute vec3 morphTarget2;
          attribute vec3 morphNormal2;
          attribute vec3 morphTarget3;
          attribute vec3 morphNormal3;
          attribute vec3 morphTarget4;
          attribute vec3 morphNormal4;
          attribute vec3 morphTargetSphere;
          attribute vec3 morphNormalSphere;

          varying vec2 v_Uv;
          varying vec3 v_Normal;
          varying vec3 v_vertToLight;
          varying vec3 v_vertToGradient;
          varying vec3 vPosition;
          varying vec3 vColor;
          varying vec3 vMorphTarget1;
          varying vec3 vMorphTarget2;
          varying vec3 vMorphTarget3;
          varying vec3 vMorphTarget4;
          varying vec3 vMorphTargetSphere;

          uniform float u_slide;
          uniform vec3 sunPosition;
          uniform vec3 u_gradPosition;
          uniform float u_size;
          uniform float u_scale;
          uniform float u_minSize;
          uniform vec3 u_mousePos;
          uniform bool u_useMouse;
          uniform bool u_useShadowRandom;
          uniform float u_time;
          uniform float u_amplitude;
          
          
          highp float random(vec2 co)
          {
              highp float a = 12.9898;
              highp float b = 78.233;
              highp float c = 43758.5453;
              highp float dt= dot(co.xy ,vec2(a,b));
              highp float sn= mod(dt,3.14);
              return fract(sin(sn) * c);
          }
          
          float range(float value, float vmin, float vmax) {
            return (value - vmin) / (vmax - vmin);
          }
          
          void main() {
          
              float time = u_time * 4.0;
              vColor = color;
          
              vPosition = position; 
              
              vec3 transformed = vec3(position);
          
              // morph
              vec3 norm = normal; 

              vMorphTarget1 = morphTarget1;
              vMorphTarget2 = morphTarget2;
              vMorphTarget3 = morphTarget3;
              vMorphTarget4 = morphTarget4;
              vMorphTargetSphere = morphTargetSphere;

              if (u_slide == 0.0) {
                  transformed += ( morphTarget1 - transformed ) * u_amplitude;  
                  norm += ( morphNormal1 - norm ) * u_amplitude;
              } else if (u_slide == 1.0) {
                  transformed += ( morphTargetSphere - transformed ) * u_amplitude;  
                  norm += ( morphNormalSphere - norm ) * u_amplitude;
              } else if (u_slide == 2.0) {
                  transformed += ( morphTarget2 - transformed ) * u_amplitude;  
                  norm += ( morphNormal2 - norm ) * u_amplitude;
              }else if (u_slide == 3.0) {
                  transformed += ( morphTarget3 - transformed ) * u_amplitude;  
                  norm += ( morphNormal3 - norm ) * u_amplitude;
              }else if (u_slide == 4.0) {
                  transformed += ( morphTarget4 - transformed ) * u_amplitude;  
                  norm += ( morphNormal4 - norm ) * u_amplitude;
              } else {
                  transformed += ( position - transformed ) * u_amplitude;  
                  norm += ( normal - norm ) * u_amplitude;
              }
          
              // mouse
              if(u_useMouse){
                vec3 seg = position - u_mousePos;
                vec3 dir = normalize(seg);
                float dist = length(seg);
                if (dist < 2.){
                  float force = clamp(0.1 / (dist * dist), 0., 1.);
                  transformed += dir * (force/4.0);
                }
              }
          
              // animte particle
              transformed.x += sin(time * randomess.x) * 0.02;
              transformed.y += cos(time * randomess.y) * 0.02;
              transformed.z += cos(time * randomess.z) * 0.02;
          
              vec4 mvPosition = vec4( transformed, 1.0 );
          
              vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
              vec4 viewSunPos   = viewMatrix * vec4(sunPosition, 1.0);
              vec4 viewGradPos   = viewMatrix * vec4(u_gradPosition, 1.0);
              
              v_Uv = uv;
              
              v_Normal      = normalMatrix * norm;
              v_vertToLight = normalize(viewSunPos.xyz - viewPosition.xyz);

              v_vertToGradient = normalize(viewGradPos.xyz - viewPosition.xyz);
          
              //float minSize = range(u_minSize, u_minSize - 0.2, u_minSize + 0.2);
              //float minSize = random(vec2(u_minSize, u_minSize));
              float minSize = u_minSize;
              if(u_useShadowRandom){
                minSize = u_minSize * shadowRandomess.x;
              }
          
              float kd = max(minSize, dot(v_vertToLight, v_Normal));
              
              // SizeAttenuation 
              //vec2 scale;
              //scale *= - viewPosition.z;

              // Apply size
              gl_PointSize = (u_size / -viewPosition.z) * kd;
              //gl_PointSize = (min(15.0, u_size * ( 15.0 / length( mvPosition.xyz ) ) ) ) * 1.0;
              //gl_PointSize *= ( gl_PointSize / - transformed.z ) ;
    
              gl_Position = projectionMatrix * viewPosition;
              
              //gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1 );
          }
        `
        : "frag1" === e
        ? `
        precision highp float;
        
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec3 u_color;
        uniform vec3 u_colorShadow;
        uniform vec3 u_colorGrad1;
        uniform vec3 u_colorGrad2;
        uniform vec3 u_colorGrad3;
        uniform vec3 u_opacity;
        uniform sampler2D u_texture;
        uniform bool u_useRandColor;
        uniform bool u_useGradColor;
        uniform bool u_gradDirX;
        uniform bool u_gradDirY;
        uniform float u_amplitude;
        uniform float u_slide;
        
        varying vec2 v_Uv;
        varying vec3 v_Normal;
        varying vec3 v_vertToLight;
        varying vec3 v_vertToGradient;
        varying vec3 vPosition;
        varying vec3 vColor;
        varying vec3 vMorphTarget1;
        varying vec3 vMorphTarget2;
        varying vec3 vMorphTarget3;
        varying vec3 vMorphTarget4;
        varying vec3 vMorphTargetSphere;
        
        void main(){
            float kd = max(0.0, dot(v_vertToLight, v_Normal));
            vec4 tx = texture2D( u_texture, gl_PointCoord );
        
            vec3 color = vec3(0,0,0);
        
            float colorDirection = vPosition.z * 0.5 + 0.5;
        
            // morph
            vec3 transformed = vec3(vPosition);

            if (u_slide == 0.0) {
                transformed += ( vMorphTarget1 - transformed ) * u_amplitude;  
            } else if (u_slide == 1.0) {
                transformed += ( vMorphTargetSphere - transformed ) * u_amplitude;  
            } else if (u_slide == 2.0) {
                transformed += ( vMorphTarget2 - transformed ) * u_amplitude;  
            } else if (u_slide == 3.0) {
                transformed += ( vMorphTarget3 - transformed ) * u_amplitude;  
            } else if (u_slide == 4.0) {
                transformed += ( vMorphTarget4 - transformed ) * u_amplitude;  
            } else {
                transformed += ( vPosition - transformed ) * u_amplitude;
            }

            if(u_useRandColor){
                color = vColor;
            }else if(u_useGradColor){
              
                //float gradientDirection = transformed.z;

                //float gradientDirection =  dot(v_vertToGradient, v_Normal );
                float gradientDirection =  dot(v_vertToGradient, transformed );

                //if(u_gradDirX){
                    //gradientDirection = transformed.x;
                //}else if(u_gradDirY){
                    //gradientDirection = transformed.y;		
                //}
                
                vec3 mixA = mix(u_colorGrad1, u_colorGrad2, gradientDirection + 0.75);
                vec3 mixB = mix(u_colorGrad2, u_colorGrad3, gradientDirection - 0.25);
                color = mix(mixA, mixB, step(0.5, gradientDirection));
                //color = color * kd;
                
                //color = mix(u_colorGrad1, u_colorGrad2, vPosition.x); // two color only
            }else{
              color = mix(u_colorShadow, u_color, kd); 
          }
            
        
             gl_FragColor = tx * vec4(color, 1.0);
        }

        `
        : "vert2" === e
        ? `
          attribute vec3 aRandom;

          varying vec3 vPosition;
          varying vec3 vRandom;
          
          uniform float uTime;
          uniform float uScale;
          uniform float uSize;
          
          void main() {
            vPosition = position;
            vRandom = aRandom;
             
            float size = uSize;

            float speed = 2.8;
            float time = uTime * (speed * aRandom.x);
          
            vec3 pos = position;

            size += sin(time * (aRandom.x * aRandom.z)) * 0.01;
            size *= uScale + (sin(size * speed + time) * (1.0 - uScale));
            
            vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (8.0 / -mvPosition.z) * uSize;
          }
          `
        : "frag2" === e
        ? `
          varying vec3 vPosition;
          varying vec3 vRandom;

          uniform sampler2D uTexture; 
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          uniform float uOpacity;
          uniform float uScale;
          uniform float uTime;
          
          void main() {

              float speed = 2.8;
              float time = uTime * (speed * vRandom.x);

              float depth = vPosition.z * 0.1 + 0.8;

              vec3 transformed = vec3(vPosition);
              float gradientDirection = (transformed.x ) * 0.05 + 0.3 ;

              vec3 mixA = mix(uColor1, uColor2, gradientDirection );
              vec3 mixB = mix(uColor2, uColor3, gradientDirection );
              vec3 color = mix(mixA, mixB, step(0.2, gradientDirection));

              float opacity = uOpacity;
              float randomX = vRandom.x;
              float randomZ = vRandom.z;
              opacity += sin(time * (randomX * randomZ)) * 0.1;
              opacity *= uScale + (sin(opacity * speed + time) * (1.0 - uScale));
          
              vec4 txt = texture2D( uTexture, gl_PointCoord );
              gl_FragColor = txt * vec4(color, opacity );
          }
          `
        : void 0;
    }
    window.addEventListener("mousemove", function (e) {
      var t = e.clientX,
        e = e.clientY;
      Q &&
        (gsap.to(Q.rotation, {
          y: gsap.utils.mapRange(0, window.innerWidth, 0.15, -0.15, t),
          x: gsap.utils.mapRange(0, window.innerHeight, 0.15, -0.15, e),
          duration: 3,
          ease: "power3.out",
        }),
        gsap.to(ie.rotation, {
          x: gsap.utils.mapRange(0, window.innerHeight, 0.05, -0.05, e),
          duration: 3,
          ease: "power3.out",
        }));
    });
  })();
