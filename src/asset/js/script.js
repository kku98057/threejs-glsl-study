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

    this.camera.position.set(0, 0, 0);
    // this.camera.lookAt(0, 0, 0);

    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0,
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
    new OrbitControls(this.camera, this.renderer.domElement);
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
    };
    this.gui = new dat.GUI();

    this.gui.add(this.settings, "progress", 0, 1, 0.01);
    this.gui.add(this.settings, "earth", 0, 1, 0.01).onChange((value) => {
      this.mesh.morphTargetInfluences[0] = value;
    });
    this.gui.add(this.settings, "rocket", 0, 1, 0.01).onChange((value) => {
      this.mesh.morphTargetInfluences[1] = value;
    });
    this.gui.add(this.settings, "land", 0, 1, 0.01).onChange((value) => {
      this.mesh.morphTargetInfluences[2] = value;
    });
    this.gui.add(this.camera.position, "x", 0, 100, 0.1);
    this.gui.add(this.camera.position, "y", 0, 100, 0.1);
    this.gui.add(this.camera.position, "z", 0, 100, 0.1);
  }
  setLight() {
    this.color = 0xffffff;
    this.intensity = 1;
    this.light = new THREE.DirectionalLight(this.color, this.intensity);
    this.light.position.set(0.15, -0.07, 0.58);
    this.scene.add(this.light);

    this.gui.add(this.light.position, "x", -10, 10, 0.01);
    this.gui.add(this.light.position, "y", -10, 10, 0.01);
    this.gui.add(this.light.position, "z", -10, 10, 0.01);
  }
  async addMesh() {
    this.manager = new THREE.LoadingManager();
    this.loader = new GLTFLoader(this.manager);
    this.draco = new DRACOLoader();
    this.draco.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
    );
    this.loader.setDRACOLoader(this.draco);
    this.modelData = [
      {
        src: earth,
        vertices: [],
      },
      {
        src: rocket,
        vertices: [],
      },
      {
        src: land,
        vertices: [],
      },
    ];
    this.geometry = new THREE.BufferGeometry();
    await this.delay(0);
    this.loader.load(this.modelData[0].src, (gltf) => {
      this.objs = [];
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          this.objs.push(obj);
        }
        this.objs.forEach((model) => {
          this.position = model.geometry.attributes.position;
          this.positionArray = this.position.array;
          this.modelData[0].vertices = this.positionArray;
        });
      });
    });
    this.loader.load(this.modelData[1].src, (gltf) => {
      this.objs = [];
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          this.objs.push(obj);
        }
        this.objs.forEach((model) => {
          this.position = model.geometry.attributes.position;
          this.positionArray = this.position.array;
          this.modelData[1].vertices = this.position.array;
        });
      });
    });
    this.loader.load(this.modelData[2].src, (gltf) => {
      this.objs = [];
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          this.objs.push(obj);
        }
        this.objs.forEach((model) => {
          this.position = model.geometry.attributes.position;
          this.positionArray = this.position.array;

          this.modelData[2].vertices = this.position.array;
        });
      });
    });
    await this.delay(1000);
    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.modelData[0].vertices, 3)
    );
    this.material = new THREE.PointsMaterial({
      size: 0.01,
    });
    this.geometry.morphAttributes.position = [];
    this.geometry.morphAttributes.position[0] =
      new THREE.Float32BufferAttribute(this.modelData[0].vertices, 3);
    this.geometry.morphAttributes.position[1] =
      new THREE.Float32BufferAttribute(this.modelData[1].vertices, 3);
    this.geometry.morphAttributes.position[2] =
      new THREE.Float32BufferAttribute(this.modelData[2].vertices, 3);

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      morphTargets: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
      depthWrite: true,
      uniforms: {
        morphTargetInfluences: { value: [1.0, 0.0, 0.0, 0.0, 0.0] },
        uColor1: { value: new THREE.Color("#006dff") },
        uColor2: { value: new THREE.Color("#fc0001") },
        uColor3: { value: new THREE.Color("#f2e300") },
        uOpacity: { value: 0.5 },
        uTime: { value: 0 },
        uScale: { value: 0.6 },
        uSize: { value: 0 },
        t: { type: "f", value: new THREE.TextureLoader().load(t1Texture) },
      },
    });
    this.material.morphTargets = true;

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);

    await this.delay(100);
    const tl = gsap.timeline();
    tl.to(this.camera.position, {
      x: 0,
      z: 3,
      duration: 3,
    }).to(
      this.mesh.rotation,
      {
        y: Math.PI,
        duration: 3,
      },
      ">-=3"
    );
    const tl2 = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section2",
          pin: true,
          end: "+=3000",
          scrub: 3,
        },
      })
      .to(this.mesh.rotation, {
        y: Math.PI * 2,
      })
      .to(
        this.camera.position,
        {
          x: 0,
          z: 0,
        },
        ">-=0.4"
      )
      .to(this.mesh.morphTargetInfluences, 0.5, [0, 0.5, 0], ">-=0.5")
      .to(this.mesh.morphTargetInfluences, 0.5, [0, 1, 0])
      .to(
        this.camera.position,
        {
          x: 0,
          z: 3,
        },
        ">-=0.5"
      )
      .to(
        this.mesh.rotation,
        {
          y: Math.PI,
        },
        ">-=0.5"
      )
      .to(
        {},
        {
          duration: 0.5,
        }
      );

    const tl3 = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section3",
          pin: true,
          end: "+=3000",
          scrub: 3,
        },
      })
      .to(this.mesh.morphTargetInfluences, 0.5, [0, 0.5, 0.5])
      .to(this.mesh.morphTargetInfluences, 0.5, [0, 0, 1])
      .to(
        this.mesh.rotation,
        {
          y: Math.PI * 3,
          z: Math.PI * 0.5,
        },
        ">-=0.4"
      )
      .to(this.mesh.rotation, {
        y: Math.PI * 4,
        z: 0,
      })
      .to(
        {},
        {
          duration: 0.5,
        }
      );

    window.addEventListener("scroll", () => {
      console.log(this.mesh.morphTargetInfluences);
    });
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
    // console.log(this.camera.position);
  }
  render() {
    // this.renderer.render(this.scene, this.camera);
    this.update();
    this.composer.render();
    requestAnimationFrame(this.render.bind(this));
  }
}
