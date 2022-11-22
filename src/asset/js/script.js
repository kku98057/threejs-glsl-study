import * as THREE from "three";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";

import earth from "../3DTexture/earth.glb";
import land from "../3DTexture/land.glb";
import rocket from "../3DTexture/rocket.glb";
import logo from "../3DTexture/logo.glb";
import character from "../3DTexture/character.glb";
import t1Texture from "../img/circle.png";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/all";
import * as dat from "dat.gui";
import LocomotiveScroll from "locomotive-scroll";

// import fragment from "./fragment.glsl"
export default class App {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    Splitting();
    this.delay = (time, value) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(value), time);
      });

    this.renderer = new THREE.WebGLRenderer();
    this.container = document.querySelector(".webgl");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio >= 2 ? 2 : 1);
    // this.renderer.physicallyCorrectLights = true;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.clock = new THREE.Clock();

    // this.camera.position.set(0, 0, 12);
    this.camera.position.set(0, 0, window.innerWidth <= 1440 ? 5 : 4);

    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.params = {
      exposure: 1,
      bloomStrength: 1,
      bloomThreshold: 0,
      bloomRadius: 0.5,
    };

    this.bloomPass.threshold = this.params.bloomThreshold;
    this.bloomPass.strength = this.params.bloomStrength;
    this.bloomPass.radius = this.params.bloomRadius;
    this.bloomPass.exposure = this.params.exposure;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);

    this.composer.setSize(window.innerWidth, window.innerHeight);

    // this.camera.position.set(10, 3, 15);
    this.time = 0;
    this.scene.add(this.camera);
    // new OrbitControls(this.camera, this.renderer.domElement);
    this.addMesh();
    this.settings();
    this.setLight();
    this.setResize();
    this.render();
  }
  settings() {
    this.settings = {
      progress: 0,
      earth: 0,
      land: 0,
      rocket: 0,
      logo: 0,
      sphere: 0,
      setExposure: 0,
      setBloomStrength: 0,
      setBloomThreshold: 0,
      setBloomRadius: 0,
      earth: 0,
      land: 0,
      rocket: 0,
      logo: 0,
      alphaTest: 0,
    };
    this.gui = new dat.GUI();

    // this.gui.add(this.settings, "progress", 0, 1, 0.01);
    // this.gui.add(this.settings, "alphaTest", 0, 1, 0.001).onChange((value) => {
    //   this.material.uniforms.alphaTest.value = value;
    // });

    // this.cc = this.gui.addFolder("camera");
    // this.cc.open();
    // this.cc.add(this.camera.position, "x", 0, 100, 0.1);
    // this.cc.add(this.camera.position, "y", 0, 100, 0.1);
    // this.cc.add(this.camera.position, "z", 0, 100, 0.1);

    // this.pp = this.gui.addFolder("postprocessing");
    // this.pp.open();
    // this.pp.add(this.bloomPass, "threshold", 0, 1, 0.01);
    // this.pp.add(this.bloomPass, "strength", 0, 1, 0.01);
    // this.pp.add(this.bloomPass, "radius", 0, 1, 0.01);
    // this.pp.add(this.bloomPass, "exposure", 0, 1, 0.01);

    // this.md = this.gui.addFolder("model");
    // this.md.open();
    // this.md.add(this.settings, "land", 0, 1, 0.01).onChange((value) => {
    //   this.mesh.material.uniforms.u_morphTarget2.value = value;
    // });
  }
  setLight() {
    this.color = "pink";
    this.intensity = 0.5;
    this.light = new THREE.DirectionalLight(this.color, this.intensity);

    this.light.position.set(-2, 10, 0.7);

    this.scene.add(this.light);

    // this.ll = this.gui.addFolder("light");
    // this.ll.open();
    // this.ll.add(this.light.position, "x", -10, 10, 0.1);
    // this.ll.add(this.light.position, "y", -10, 10, 0.1);
    // this.ll.add(this.light.position, "z", -10, 10, 0.1);
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  async addMesh() {
    this.loader1 = new GLTFLoader();
    this.loader2 = new GLTFLoader();
    this.loader3 = new GLTFLoader();
    this.loader4 = new GLTFLoader();
    this.loader5 = new GLTFLoader();
    this.draco = new DRACOLoader();
    this.draco.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
    );
    this.loader1.setDRACOLoader(this.draco);
    this.loader2.setDRACOLoader(this.draco);
    this.loader3.setDRACOLoader(this.draco);
    this.loader4.setDRACOLoader(this.draco);
    this.loader5.setDRACOLoader(this.draco);
    this.modelData = [
      {
        src: earth,
        vertices: [],
        normal: [],
        randoms: [],
      },
      {
        src: land,
        vertices: [],
        normal: [],
        randoms: [],
      },
      {
        src: rocket,
        vertices: [],
        normal: [],
        randoms: [],
      },
      {
        src: character,
        vertices: [],
        normal: [],
        randoms: [],
      },
      {
        src: logo,
        vertices: [],
        normal: [],
        randoms: [],
      },
    ];
    this.particlesMap = {
      // min: -50,
      // max: 50
      min: -50,
      max: 50,
    };

    await this.delay(100);

    this.geometry = new THREE.BufferGeometry();
    this.loader1.load(this.modelData[0].src, (earth) => {
      this.loader2.load(this.modelData[1].src, (land) => {
        this.loader3.load(this.modelData[2].src, (rocket) => {
          this.loader3.load(this.modelData[3].src, (character) => {
            this.loader4.load(this.modelData[4].src, (logo) => {
              this.material = new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: true,
                depthWrite: false,

                extensions: {
                  derivatives:
                    "#extension GL_OES_standard_derivatives : enable",
                },
                side: THREE.DoubleSide,
                uniforms: {
                  u_time: { type: "f", value: 1 },
                  u_size: { type: "f", value: 10 },
                  u_morphTargetInfluences: {
                    type: "f",
                    value: [0, 0, 0, 0, 0],
                  },
                  u_resolution: { type: "v2", value: new THREE.Vector2() },
                  alphaTest: { value: 1 },
                  t: {
                    type: "f",
                    value: new THREE.TextureLoader().load(t1Texture),
                  },
                  u_slide: { type: "f", value: 0 },
                  u_color1: { type: "v3", value: new THREE.Color("#006dff") },
                  u_color2: { type: "v3", value: new THREE.Color("#fc0001") },
                  u_color3: { type: "v3", value: new THREE.Color("#f2e300") },
                },
              });
              this.material.uniformsNeedUpdate = true;

              earth.scene.traverse((obj) => {
                if (obj.isMesh) {
                  // 샘플러생성

                  this.temPosition = new THREE.Vector3();

                  this.positionsArray = obj.geometry.attributes.position.array;
                  let sampler = new MeshSurfaceSampler(obj).build();
                  this.modelData[0].normal.push(
                    sampler.geometry.attributes.normal.array
                  );

                  // 샘플러 위치 저장 및 난수*위치값 , 배경생성
                  for (let i = 0; i < this.positionsArray.length / 2; i++) {
                    sampler.sample(this.temPosition);

                    this.modelData[0].vertices.push(
                      this.temPosition.x,
                      this.temPosition.y,
                      this.temPosition.z
                    );
                    this.modelData[0].randoms.push(
                      Math.random() - 0.5,
                      Math.random() - 0.5,
                      Math.random() - 0.5
                    );
                  }
                }
              });
              land.scene.traverse((obj) => {
                if (obj.isMesh) {
                  // 샘플러생성

                  this.temPosition = new THREE.Vector3();

                  this.positionsArray = obj.geometry.attributes.position.array;
                  let sampler = new MeshSurfaceSampler(obj).build();
                  this.modelData[1].normal.push(
                    sampler.geometry.attributes.normal.array
                  );

                  // 샘플러 위치 저장 및 난수*위치값 , 배경생성
                  for (let i = 0; i < this.positionsArray.length; i++) {
                    sampler.sample(this.temPosition);

                    this.modelData[1].vertices.push(
                      this.temPosition.x,
                      this.temPosition.y,
                      this.temPosition.z
                    );
                    this.modelData[1].randoms.push(
                      Math.random() - 0.5,
                      Math.random() - 0.5,
                      Math.random() - 0.5
                    );
                  }
                }
              });
              rocket.scene.traverse((obj) => {
                if (obj.isMesh) {
                  // 샘플러생성

                  this.temPosition = new THREE.Vector3();

                  this.positionsArray = obj.geometry.attributes.position.array;
                  let sampler = new MeshSurfaceSampler(obj).build();
                  this.modelData[2].normal.push(
                    sampler.geometry.attributes.normal.array
                  );

                  // 샘플러 위치 저장 및 난수*위치값 , 배경생성
                  for (let i = 0; i < this.positionsArray.length; i++) {
                    sampler.sample(this.temPosition);

                    this.modelData[2].vertices.push(
                      this.temPosition.x,
                      this.temPosition.y,
                      this.temPosition.z
                    );
                  }
                }
              });
              character.scene.traverse((obj) => {
                if (obj.isMesh) {
                  // 샘플러생성

                  this.temPosition = new THREE.Vector3();

                  this.positionsArray = obj.geometry.attributes.position.array;
                  let sampler = new MeshSurfaceSampler(obj).build();
                  this.modelData[3].normal.push(
                    sampler.geometry.attributes.normal.array
                  );

                  // 샘플러 위치 저장 및 난수*위치값 , 배경생성
                  for (let i = 0; i < 27678; i++) {
                    sampler.sample(this.temPosition);

                    this.modelData[3].vertices.push(
                      this.temPosition.x,
                      this.temPosition.y,
                      this.temPosition.z
                    );
                  }
                }
              });
              logo.scene.traverse((obj) => {
                if (obj.isMesh) {
                  // 샘플러생성

                  this.temPosition = new THREE.Vector3();

                  this.positionsArray = obj.geometry.attributes.position.array;
                  let sampler = new MeshSurfaceSampler(obj).build();
                  this.modelData[4].normal.push(
                    sampler.geometry.attributes.normal.array
                  );

                  // 샘플러 위치 저장 및 난수*위치값 , 배경생성
                  for (let i = 0; i < 27678; i++) {
                    sampler.sample(this.temPosition);

                    this.modelData[4].vertices.push(
                      this.temPosition.x,
                      this.temPosition.y,
                      this.temPosition.z
                    );
                    this.modelData[4].randoms.push(
                      Math.random() - 0.5,
                      Math.random() - 0.5,
                      Math.random() - 0.5
                    );
                  }
                }
              });

              this.backgorund = [];
              this.backColor = [];
              this.backVector = new THREE.Vector3();

              for (let i = 0; i < 1500; i++) {
                let filedX = 50 * Math.random() - 25,
                  filedY = 50 * Math.random() - 25,
                  filedZ = 50 * Math.random() - 25;
                this.backgorund.push(filedX, filedY, filedZ);
                this.backColor.push(Math.random());
              }
              this.backgeo = new THREE.BufferGeometry();
              this.backgeo.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(this.backgorund, 3)
              );
              this.backgeo.setAttribute(
                "color",
                new THREE.Float32BufferAttribute(this.backColor, 3)
              );
              this.backPoints = new THREE.PointsMaterial({
                size: 0.05,
                map: new THREE.TextureLoader().load("./asset/img/circle.png"),

                vertexColors: true,
                transparent: true,
                depthTest: true,
                depthWrite: false,
              });

              this.backmesh = new THREE.Points(this.backgeo, this.backPoints);
              this.backmesh.position.set(0, 0, 0);
              this.scene.add(this.backmesh);
              this.geometry.setAttribute(
                "aRandom",
                new THREE.Float32BufferAttribute(this.modelData[0].randoms, 3)
              );
              this.geometry.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(this.modelData[0].vertices, 3)
              );
              this.geometry.setAttribute(
                "morphTarget0",
                new THREE.Float32BufferAttribute(this.modelData[0].vertices, 3)
              );
              this.geometry.setAttribute(
                "morphTarget1",
                new THREE.Float32BufferAttribute(this.modelData[1].vertices, 3)
              );
              this.geometry.setAttribute(
                "morphTarget2",
                new THREE.Float32BufferAttribute(this.modelData[2].vertices, 3)
              );
              this.geometry.setAttribute(
                "morphTarget3",
                new THREE.Float32BufferAttribute(this.modelData[3].vertices, 3)
              );
              this.geometry.setAttribute(
                "morphTarget4",
                new THREE.Float32BufferAttribute(this.modelData[4].vertices, 3)
              );

              this.mesh = new THREE.Points(this.geometry, this.material);

              this.scene.add(this.mesh);

              // this.gui.add(this.mesh.scale, "x", 0.001, 5, 0.001);
              // this.gui.add(this.mesh.scale, "y", 0.001, 5, 0.001);
              // this.gui.add(this.mesh.scale, "z", 0.001, 5, 0.001);
              // --- SETUP START ---
              // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll
              // const locoScroll = new LocomotiveScroll({
              //   el: document.querySelector(".smooth-scroll"),
              //   smooth: true,
              //   lerp: 0.05,
              //   multiplier: 0.6,
              //   tablet: { smooth: true },
              //   smartphone: { smooth: true },
              // });
              // // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
              // locoScroll.on("scroll", ScrollTrigger.update);

              // // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
              // ScrollTrigger.scrollerProxy(".smooth-scroll", {
              //   scrollTop(value) {
              //     return arguments.length
              //       ? locoScroll.scrollTo(value, {
              //           duration: 0,
              //           disableLerp: true,
              //         })
              //       : locoScroll.scroll.instance.scroll.y;
              //   }, // we don't have to define a scrollLeft because we're only scrolling vertically.
              //   getBoundingClientRect() {
              //     return {
              //       top: 0,
              //       left: 0,
              //       width: window.innerWidth,
              //       height: window.innerHeight,
              //     };
              //   },
              //   // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
              //   pinType: document.querySelector(".smooth-scroll").style
              //     .transform
              //     ? "transform"
              //     : "fixed",
              // });

              // // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
              // ScrollTrigger.addEventListener("refresh", () =>
              //   locoScroll.update()
              // );
              // ScrollTrigger.defaults({ scroller: ".smooth-scroll" });
              // --- SETUP END ---

              // const tl = gsap.timeline({
              //   scrollTrigger: {
              //     trigger: ".scroll1",
              //     // start: "0% 75%",
              //     // end: "100% 25%",
              //     scrub: 1,
              //     // pin: true,
              //     // end: `+=${window.innerHeight}`,
              //     onUpdate: (slef) => {
              //       console.log(slef);
              //     },
              //     // markers: true,
              //   },
              //   defaults: { duration: 1, ease: "none" },
              // });
              // // tl.to(this.material.uniforms.u_morphTargetInfluences.value, [
              // //   (1, 0, 0, 0, 0),
              // // ]);
              // tl.to(
              //   this.camera.position,
              //   {
              //     z: 3,
              //   },
              //   ">-0.5"
              // );
              // tl.to(
              //   this.mesh.rotation,
              //   {
              //     y: Math.PI,
              //   },
              //   ">-0.5"
              // );
              // tl.from(".s1_wrap h2", {
              //   yPercent: 100,
              //   skewY: 25,
              //   transformOrigin: "0 50%",
              // });
              // tl.from(
              //   ".s1_wrap p",
              //   {
              //     yPercent: 100,
              //     skewY: 25,
              //     transformOrigin: "0 50%",
              //   },
              //   ">-1"
              // );

              const tl2 = gsap.timeline({
                scrollTrigger: {
                  trigger: ".scroll2",
                  // start: "0% 75%",
                  // end: "100% 25%",
                  scrub: 1,
                  // pin: true,
                  // end: `+=${window.innerHeight}`,

                  // markers: true,
                },
                defaults: { duration: 1, ease: "none" },
              });
              tl2.to(".s1_wrap h2", {
                yPercent: -100,
                skewY: -15,
                transformOrigin: "0 50%",
              });
              tl2.to(
                ".s1_wrap p",
                {
                  yPercent: -100,
                  skewY: -15,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );
              tl2.from(".s2_wrap h2", {
                yPercent: 100,
                skewY: 25,
                transformOrigin: "0 50%",
              });
              tl2.from(
                ".s2_wrap p",
                {
                  yPercent: 100,
                  skewY: 25,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );
              tl2.to(
                this.camera.position,
                {
                  z: 3,
                },
                ">-1"
              );
              tl2.to(this.mesh.rotation, { y: Math.PI * 0.5 }, ">-0.5");
              tl2.to(this.camera.position, {
                z: 6,
              });

              tl2.to(".s2_wrap h2", {
                yPercent: -100,
                skewY: -15,
                transformOrigin: "0 50%",
              });
              tl2.to(
                ".s2_wrap p",
                {
                  yPercent: -100,
                  skewY: -15,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );

              const tl3 = gsap.timeline({
                scrollTrigger: {
                  trigger: ".scroll3",
                  scrub: 1,
                },
                defaults: { duration: 1, ease: "none" },
              });
              tl3.to(this.mesh.rotation, {
                y: Math.PI,
              });
              tl3.from(
                ".s3_wrap h2",
                {
                  yPercent: 100,
                  skewY: 25,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );
              tl3.from(
                ".s3_wrap p",
                {
                  yPercent: 100,
                  skewY: 25,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );
              tl3.to(".s3_wrap h2", {
                delay: 0.5,
                yPercent: -100,
                skewY: -15,
                transformOrigin: "0 50%",
              });
              tl3.to(
                ".s3_wrap p",
                {
                  delay: 0.5,
                  yPercent: -100,
                  skewY: -15,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );

              const tl4 = gsap.timeline({
                scrollTrigger: {
                  trigger: ".scroll4",
                  // start: "0% 75%",
                  // end: "100% 25%",
                  scrub: 1,
                  // pin: true,
                  // end: `+=${window.innerHeight}`,

                  // markers: true,
                },
                defaults: { duration: 1, ease: "none" },
              });
              // tl4.to(
              //   this.material.uniforms.u_morphTargetInfluences.value,
              //   [0, 0, 0, 1, 0]
              // );
              tl4.from(".s4_wrap h2", {
                yPercent: 100,
                skewY: 25,
                transformOrigin: "0 50%",
              });
              tl4.from(
                ".s4_wrap p",
                {
                  yPercent: 100,
                  skewY: 25,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );
              tl4.to(".s4_wrap h2", {
                delay: 0.5,
                yPercent: -100,
                skewY: -15,
                transformOrigin: "0 50%",
              });
              tl4.to(
                ".s4_wrap p",
                {
                  delay: 0.5,
                  yPercent: -100,
                  skewY: -15,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );
              const tl5 = gsap.timeline({
                scrollTrigger: {
                  trigger: ".scroll5",
                  // start: "0% 75%",
                  // end: "100% 25%",
                  scrub: 1,
                  // pin: true,
                  // end: `+=${window.innerHeight}`,

                  // markers: true,
                },
                defaults: { duration: 1, ease: "none" },
              });
              // tl5.to(
              //   this.material.uniforms.u_morphTargetInfluences.value,
              //   [0, 0, 0, 0, 1]
              // );
              tl5.from(".s5_wrap h2", {
                yPercent: 100,
                skewY: 25,
                transformOrigin: "0 50%",
              });
              tl5.from(
                ".s5_wrap p",
                {
                  yPercent: 100,
                  skewY: 25,
                  transformOrigin: "0 50%",
                },
                ">-1"
              );
              tl5.to(".s5_wrap h2", {});
              const tl6 = gsap.timeline({
                scrollTrigger: {
                  trigger: "main",
                  // start: "0% 75%",
                  // end: "100% 25%",
                  scrub: 1,

                  // pin: true,
                  end: "80% 0%",
                  // markers: true,
                },
                defaults: { duration: 1, ease: "none", delay: 0.2 },
              });
              tl6.to(
                this.material.uniforms.u_morphTargetInfluences.value,
                [0, 0, 0, 0, 0]
              );
              tl6.to(
                this.material.uniforms.u_morphTargetInfluences.value,
                [0, 1, 0, 0, 0]
              );
              tl6.to(
                this.material.uniforms.u_morphTargetInfluences.value,
                [0, 0, 1, 0, 0]
              );
              tl6.to(
                this.material.uniforms.u_morphTargetInfluences.value,
                [0, 0, 0, 1, 0]
              );
              tl6.to(
                this.material.uniforms.u_morphTargetInfluences.value,
                [0, 0, 0, 0, 1]
              );
              window.addEventListener("scroll", () => {
                console.log(
                  this.material.uniforms.u_morphTargetInfluences.value
                );
              });
            }); // last load
          });
        });
      });
    });
    window.addEventListener("scroll", (e) => {});
  }

  setResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.position.set(0, 0, window.innerWidth <= 1440 ? 6 : 4);
    ScrollTrigger.refresh();
    this.camera.updateProjectionMatrix();
  }
  update() {
    this.time += 0.01;
    this.delta = this.clock.getDelta();

    if (this.mesh) {
      this.mesh.rotation.y -= this.delta * 0.1;

      this.backmesh.rotation.y += this.delta * 0.1;
      this.material.uniforms.u_time.value += Math.sin(0.3);
    }
  }
  render() {
    // this.renderer.render(this.scene, this.camera);
    this.update();
    this.composer.render();
    requestAnimationFrame(this.render.bind(this));
  }
}
