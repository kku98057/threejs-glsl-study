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

// import fragment from "./fragment.glsl"
const tempPosition = new THREE.Vector3();
class Path {
  constructor(geometry, material, sampler, index) {
    this.vertices = [];
    this.geometry = geometry;
    this.material = material[index % 4];
    this.sampler = sampler;
    this.line = new THREE.Line(this.geometry, this.material);
    sampler.sample(tempPosition);
    this.previousPoint = tempPosition.clone();
    console.log(this.line);
  }
  update() {
    /* Variable used to exit the while loop when we find a point */
    let pointFound = false;
    /* Loop while we haven't found a point */
    while (!pointFound) {
      /* Sample a random point */
      this.sampler.sample(tempPosition);
      /* If the new point is less 30 units from the previous point */
      if (tempPosition.distanceTo(this.previousPoint) < 0.5) {
        /* Add the new point in the vertices array */
        this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
        /* Store the new point vector */
        this.previousPoint = tempPosition.clone();
        /* Exit the loop */
        pointFound = true;
      }
    }
    /* Update the geometry */
    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.vertices, 3)
    );
  }
}

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
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: true,
      depthWrite: false,

      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
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
    this.material = [
      new THREE.LineBasicMaterial({
        color: 0xfaad80,
        transparent: true,
        opacity: 0.5,
      }),
      new THREE.LineBasicMaterial({
        color: 0xff6767,
        transparent: true,
        opacity: 0.5,
      }),
      new THREE.LineBasicMaterial({
        color: 0xff3d68,
        transparent: true,
        opacity: 0.5,
      }),
      new THREE.LineBasicMaterial({
        color: 0xa73489,
        transparent: true,
        opacity: 0.5,
      }),
    ];

    this.geometry = new THREE.BufferGeometry();
    this.draco = new DRACOLoader();
    this.loader = new GLTFLoader();
    this.draco.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
    );

    this.modelData = [
      {
        vertice: [],
        paths: [],
      },
    ];
    this.group = new THREE.Group();
    this.loader.setDRACOLoader(this.draco);
    this.loader.load(rocket, (gltf) => {
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          this.sampler = new MeshSurfaceSampler(obj).build();
          for (let i = 0; i < 4; i++) {
            this.path = new Path(this.geometry, this.material, this.sampler, i);
            this.modelData[0].paths.push(this.path);
            this.group.add(this.path.line);
          }
        }
      }); //traverse

      this.scene.add(this.group);
    }); //loader
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
    // if (this.material) {
    //   this.material.uniforms.u_resolution.value.x =
    //     this.renderer.domElement.width;
    //   this.material.uniforms.u_resolution.value.y =
    //     this.renderer.domElement.height;
    // }
    // console.log(this.camera.position);
  }
  render() {
    // this.renderer.render(this.scene, this.camera);
    this.update();
    this.modelData[0].paths.forEach((path) => {
      if (this.path) {
        if (this.path.vertices.length < 15000) {
          this.path.update();
        }
      }
    });

    this.composer.render();
    requestAnimationFrame(this.render.bind(this));
  }
}
