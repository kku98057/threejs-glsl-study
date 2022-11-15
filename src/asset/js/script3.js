import * as THREE from "three";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import earth from "../3DTexture/earth.glb";
import land from "../3DTexture/land.glb";
import rocket from "../3DTexture/rocket.glb";
import logo from "../3DTexture/logo.glb";
import t1Texture from "../img/circle.png";
import gsap, { snap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import * as dat from "dat.gui";

// import fragment from "./fragment.glsl"
export default class App {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    this.delay = (time, value) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(value), time);
      });

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.container = document.querySelector(".webgl");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio >= 2 ? 2 : 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.clock = new THREE.Clock();

    this.camera.position.set(0, 0, 4);
    // this.camera.lookAt(0, 0, 0);

    // this.renderScene = new RenderPass(this.scene, this.camera);

    // this.bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(window.innerWidth, window.innerHeight),
    //   1.5,
    //   0.4,
    //   0.85
    // );
    // this.params = {
    //   exposure: 1,
    //   bloomStrength: 1.5,
    //   bloomThreshold: 0,
    //   bloomRadius: 0,
    // };

    // this.bloomPass.threshold = this.params.bloomThreshold;
    // this.bloomPass.strength = this.params.bloomStrength;
    // this.bloomPass.radius = this.params.bloomRadius;
    // this.bloomPass.exposure = this.params.exposure;

    // this.composer = new EffectComposer(this.renderer);
    // this.composer.addPass(this.renderScene);
    // this.composer.addPass(this.bloomPass);

    // this.composer.setSize(window.innerWidth, window.innerHeight);

    // this.camera.position.set(10, 3, 15);
    this.time = 0;
    this.scene.add(this.camera);
    new OrbitControls(this.camera, this.renderer.domElement);
    this.addMesh();
    this.settings();
    this.setLight();
    this.setResize();
    this.render();
  }
  settings() {}
  setLight() {
    this.color = 0xffffff;
    this.intensity = 1;
    this.light = new THREE.DirectionalLight(this.color, this.intensity);
    this.light.position.set(0.15, -0.07, 0.58);
    this.scene.add(this.light);
  }
  addMesh() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
      depthWrite: true,
      uniforms: {
        u_time: { type: "f", value: 1 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_opacity: { type: "v2", value: 0.5 },
        t: { type: "f", value: new THREE.TextureLoader().load(t1Texture) },
        u_color1: { type: "v3", value: new THREE.Color("#006dff") },
        u_color2: { type: "v3", value: new THREE.Color("#fc0001") },
        u_color3: { type: "v3", value: new THREE.Color("#f2e300") },
      },
    });

    this.box = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);

    this.mesh = new THREE.Points(this.box, this.material);

    this.scene.add(this.mesh);
  }

  setResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  update() {
    this.time += 0.01;
    this.delta = this.clock.getDelta();
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    this.update();
    // this.composer.render();
    requestAnimationFrame(this.render.bind(this));
  }
}
