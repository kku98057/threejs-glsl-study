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
import t1Texture from "../img/circle.png";
import gsap, { snap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import * as dat from "dat.gui";
import { Vector3 } from "three";

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

    this.camera.position.set(0, 0, window.innerWidth <= 1440 ? 6 : 4);

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
      setExposure: 0,
      setBloomStrength: 0,
      setBloomThreshold: 0,
      setBloomRadius: 0,
      earth: 0,
      land: 0,
      rocket: 0,
      logo: 0,
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
    this.cc = this.gui.addFolder("camera");
    this.cc.open();
    this.cc.add(this.camera.position, "x", 0, 100, 0.1);
    this.cc.add(this.camera.position, "y", 0, 100, 0.1);
    this.cc.add(this.camera.position, "z", 0, 100, 0.1);

    this.pp = this.gui.addFolder("postprocessing");
    this.pp.open();
    this.pp.add(this.bloomPass, "threshold", 0, 10, 1);
    this.pp.add(this.bloomPass, "strength", 0, 10, 1);
    this.pp.add(this.bloomPass, "radius", 0, 10, 1);
    this.pp.add(this.bloomPass, "exposure", 0, 10, 1);

    this.md = this.gui.addFolder("model");
    this.md.open();
    this.md.add(this.settings, "land", 0, 1, 0.01).onChange((value) => {
      this.mesh.material.uniforms.u_morphTarget2.value = value;
    });
  }
  setLight() {
    // this.color = 0xffffff;
    // this.intensity = 1;
    // this.light = new THREE.DirectionalLight(this.color, this.intensity);
    // this.light.position.set(0.15, -0.07, 0.58);
    // this.scene.add(this.light);
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
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

        colors: [],
        randoms: [],
      },
      {
        src: land,
        vertices: [],
        colors: [],
        randoms: [],
      },
      {
        src: rocket,
        vertices: [],
        colors: [],
        randoms: [],
      },
      {
        src: logo,
        vertices: [],
        colors: [],
        randoms: [],
      },
    ];
    this.geometry = new THREE.BufferGeometry();
    this.particlesMap = {
      // min: -50,
      // max: 50
      min: -50,
      max: 50,
    };

    await this.delay(0);

    this.loader.load(this.modelData[0].src, (gltf) => {
      this.objs = [];
      gltf.scene.traverse((obj) => {
        this.sampler;
        if (obj.isMesh) {
          this.sampler = new MeshSurfaceSampler(obj)
            .setWeightAttribute(null)
            .build();

          this.objs.push(this.sampler);
        }
        this.objs.forEach((model, idx) => {
          this.temPosition = new Vector3();
          this.position = model.geometry.attributes.position;
          this.positionArray = this.position.array;
          this.positionArrayLength = this.position.array.length;

          for (let i = 0; i < this.positionArray.length / 1.2; i++) {
            model.sample(this.temPosition);

            this.modelData[0].vertices.push(
              this.temPosition.x,
              this.temPosition.y,
              this.temPosition.z
            );
            this.modelData[0].randoms.push(
              Math.random() - 0.5 + this.temPosition.x,
              Math.random() - 0.5 + this.temPosition.y,
              Math.random() - 0.5 + this.temPosition.z
            );
          }
          for (let i = 0; i < 700; i++) {
            let filedX = 40 * Math.random() - 20,
              filedY = 40 * Math.random() - 20,
              filedZ = 40 * Math.random() - 20;
            this.modelData[0].vertices.push(filedX, filedY, filedZ);
          }
        });
      });
    });
    this.loader.load(this.modelData[1].src, (gltf) => {
      this.objs = [];
      gltf.scene.traverse((obj) => {
        this.sampler;
        if (obj.isMesh) {
          this.sampler = new MeshSurfaceSampler(obj)
            .setWeightAttribute(null)
            .build();

          this.objs.push(this.sampler);
        }
        this.objs.forEach((model, idx) => {
          this.temPosition = new Vector3();
          this.position = model.geometry.attributes.position;
          this.positionArray = this.position.array;
          this.positionArrayLength = this.position.array.length;

          for (let i = 0; i < this.positionArray.length / 1.2; i++) {
            model.sample(this.temPosition);
            this.modelData[1].vertices.push(
              this.temPosition.x,
              this.temPosition.y,
              this.temPosition.z
            );
            this.modelData[1].randoms.push(
              Math.random() - 0.5 + this.temPosition.x,
              Math.random() - 0.5 + this.temPosition.y,
              Math.random() - 0.5 + this.temPosition.z
            );
          }
        });
      });
    });
    this.loader.load(this.modelData[2].src, (gltf) => {
      this.objs = [];
      gltf.scene.traverse((obj) => {
        this.sampler;
        if (obj.isMesh) {
          this.sampler = new MeshSurfaceSampler(obj)
            .setWeightAttribute(null)
            .build();

          this.objs.push(this.sampler);
        }
        this.objs.forEach((model, idx) => {
          this.temPosition = new Vector3();
          this.position = model.geometry.attributes.position;
          this.positionArray = this.position.array;
          this.positionArrayLength = this.position.array.length;

          for (let i = 0; i < this.positionArray.length / 1.2; i++) {
            this.modelData[2].vertices.push(
              this.temPosition.x,
              this.temPosition.y,
              this.temPosition.z
            );
            this.modelData[2].randoms.push(
              Math.random() - 0.5 + this.temPosition.x,
              Math.random() - 0.5 + this.temPosition.y,
              Math.random() - 0.5 + this.temPosition.z
            );
          }
        });
      });
    });
    this.loader.load(this.modelData[3].src, (gltf) => {
      this.objs = [];
      gltf.scene.traverse((obj) => {
        this.sampler;
        if (obj.isMesh) {
          this.sampler = new MeshSurfaceSampler(obj)
            .setWeightAttribute(null)
            .build();

          this.objs.push(this.sampler);
        }
        this.objs.forEach((model, idx) => {
          this.temPosition = new Vector3();
          this.position = model.geometry.attributes.position;
          this.positionArray = this.position.array;
          this.positionArrayLength = this.position.array.length;

          for (let i = 0; i < this.positionArray.length / 1.2; i++) {
            model.sample(this.temPosition);

            this.modelData[3].vertices.push(
              this.temPosition.x,
              this.temPosition.y,
              this.temPosition.z
            );
            this.modelData[3].randoms.push(
              Math.random() - 0.5 + this.temPosition.x,
              Math.random() - 0.5 + this.temPosition.y,
              Math.random() - 0.5 + this.temPosition.z
            );
          }
        });
      });
    });
    await this.delay(1000);

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.modelData[0].vertices, 3)
    );
    this.geometry.setAttribute(
      "position1",
      new THREE.Float32BufferAttribute(this.modelData[1].vertices, 3)
    );
    this.geometry.setAttribute(
      "position2",
      new THREE.Float32BufferAttribute(this.modelData[2].vertices, 3)
    );
    this.geometry.setAttribute(
      "position3",
      new THREE.Float32BufferAttribute(this.modelData[3].vertices, 3)
    );
    // console.log(this.modelData[0].vertices);
    // this.geometry.setAttribute(
    //   "color",
    //   new THREE.Float32BufferAttribute(this.modelData[0].vertices, 3)
    // );
    this.geometry.setAttribute(
      "aRandom",
      new THREE.Float32BufferAttribute(this.modelData[0].randoms, 3)
    );
    this.geometry.setAttribute(
      "aRandom1",
      new THREE.Float32BufferAttribute(this.modelData[1].randoms, 3)
    );
    this.geometry.setAttribute(
      "aRandom2",
      new THREE.Float32BufferAttribute(this.modelData[2].randoms, 3)
    );
    this.geometry.setAttribute(
      "aRandom3",
      new THREE.Float32BufferAttribute(this.modelData[3].randoms, 3)
    );
    this.geometry.setAttribute(
      "morphTarget",
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

    this.geometry.morphAttributes.position = [];
    this.geometry.morphAttributes.color = [];
    this.geometry.morphAttributes.random = [];

    // earth
    this.geometry.morphAttributes.position[0] =
      new THREE.Float32BufferAttribute(this.modelData[0].vertices, 3);

    this.geometry.morphAttributes.color[0] = new THREE.Float32BufferAttribute(
      this.modelData[0].vertices,
      3
    );

    this.geometry.morphAttributes.random[0] = new THREE.Float32BufferAttribute(
      this.modelData[0].randoms,
      3
    );

    // land
    this.geometry.morphAttributes.position[1] =
      new THREE.Float32BufferAttribute(this.modelData[1].vertices, 3);

    this.geometry.morphAttributes.color[1] = new THREE.Float32BufferAttribute(
      this.modelData[1].vertices,
      3
    );

    this.geometry.morphAttributes.random[1] = new THREE.Float32BufferAttribute(
      this.modelData[1].randoms,
      3
    );
    // rocket
    this.geometry.morphAttributes.position[2] =
      new THREE.Float32BufferAttribute(this.modelData[2].vertices, 3);

    this.geometry.morphAttributes.color[2] = new THREE.Float32BufferAttribute(
      this.modelData[2].vertices,
      3
    );

    this.geometry.morphAttributes.random[2] = new THREE.Float32BufferAttribute(
      this.modelData[2].randoms,
      3
    );

    // logo
    this.geometry.morphAttributes.position[3] =
      new THREE.Float32BufferAttribute(this.modelData[3].vertices, 3);

    this.geometry.morphAttributes.color[3] = new THREE.Float32BufferAttribute(
      this.modelData[3].vertices,
      3
    );

    this.geometry.morphAttributes.random[3] = new THREE.Float32BufferAttribute(
      this.modelData[3].randoms,
      3
    );

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
      depthWrite: true,
      morphTargets: true,
      vertexColors: true,
      uniforms: {
        u_time: { type: "f", value: 1 },
        u_size: { type: "f", value: 1 },
        u_morphTargetInfluences: { type: "f", value: [1.0, 0.0, 0.0, 0.0] },
        u_morphTarget1: { type: "f", value: 0 },
        u_morphTarget2: { type: "f", value: 0 },
        u_morphTarget3: { type: "f", value: 0 },
        u_slide: { type: "f", value: 0.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_opacity: { type: "v2", value: 0.5 },
        t: { type: "f", value: new THREE.TextureLoader().load(t1Texture) },
        u_color1: { type: "v3", value: new THREE.Color("#006dff") },
        u_color2: { type: "v3", value: new THREE.Color("#fc0001") },
        u_color3: { type: "v3", value: new THREE.Color("#f2e300") },
        u_amplitude: { type: "f", value: 0 },
      },
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.scale.set(3, 3, 3);

    this.mesh.updateMorphTargets();
    this.material.morphTargets = true;

    this.scene.add(this.mesh);
    this.material.uniforms.u_morphTargetInfluences =
      this.mesh.morphTargetInfluences;
    console.log(this.material.uniforms.u_morphTargetInfluences);
    this.gui
      .add(this.material.uniforms.u_morphTarget1, "value", 0, 1, 0.001)
      .onChange((value) => {
        this.mesh.material.uniforms.u_morphTarget1.value = value;
      });

    await this.delay(100);

    const tl = gsap.timeline();

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".section2",

        markers: true,
      },
    });

    const tl3 = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section3",
          pin: true,
          end: "+=3000",
          scrub: 3,
          markers: true,
        },
      })

      .to(this.mesh.rotation, {
        y: Math.PI,
      })
      .to(
        this.camera.position,
        {
          z: 15,
        },
        ">-=0.5"
      );

    //   .to(this.mesh.morphTargetInfluences, 0.5, [0, 0.5, 0.5], ">-=0.5")
    //   .to(this.mesh.morphTargetInfluences, 0.5, [0, 0, 1])
    //   .to(
    //     this.mesh.rotation,
    //     {
    //       y: Math.PI * 3,
    //       z: Math.PI * 0.5,
    //     },
    //     ">-=0.4"
    //   )
    //   .to(this.mesh.rotation, {
    //     y: Math.PI * 4,
    //     z: 0,
    //   })
    //   .to(
    //     {},
    //     {
    //       duration: 0.5,
    //     }
    //   );
    // window.addEventListener("scroll", () => {
    //   console.log(this.mesh.material.uniforms.u_morphTargetInfluences.value);
    // });
    console.log(this.mesh);
  }

  setResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.position.set(0, 0, window.innerWidth <= 1440 ? 6 : 4);
    this.camera.updateProjectionMatrix();
  }
  update() {
    this.time += 0.01;
    this.delta = this.clock.getDelta();
    if (this.material) {
      this.mesh.rotation.y -= this.delta * 0.1;
      this.material.uniforms.u_time.value += Math.sin(0.05);
    }
  }
  render() {
    // this.renderer.render(this.scene, this.camera);
    this.update();
    this.composer.render();
    requestAnimationFrame(this.render.bind(this));
  }
}
