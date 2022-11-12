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

    this.camera.position.set(0, 0, 5);

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
      diffuse: {
        r: 1,
        g: 1,
        b: 1,
      },
      params: {
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0,
        bloomRadius: 0,
      },
      earth: 0,
      land: 0,
      particleScale: 1,
      dotScale: 1,
    };
    this.gui = new dat.GUI();

    this.gui.add(this.settings, "progress", 0, 1, 0.01);
    this.gui.add(this.settings.diffuse, "r", 0, 1, 0.1);
    this.gui.add(this.settings.diffuse, "g", 0, 1, 0.1);
    this.gui.add(this.settings.diffuse, "b", 0, 1, 0.1);

    this.gui.add(this.settings.params, "exposure", 0, 5, 0.1);
    this.gui.add(this.settings.params, "bloomStrength", 0, 5, 0.1);
    this.gui.add(this.settings.params, "bloomThreshold", 0, 5, 0.1);
    this.gui.add(this.settings.params, "bloomRadius", 0, 5, 0.1);
    this.gui.add(this.settings, "particleScale", 1, 100, 1);

    this.gui.add(this.settings, "dotScale", 1, 100, 1);

    this.gui.add(this.settings, "earth", 0, 1, 0.01);
    this.gui.add(this.settings, "land", 0, 1, 0.01);
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
  addMesh() {
    this.manager = new THREE.LoadingManager();

    this.modelData = [
      {
        vertice: [],
        random: [],
        colors: new THREE.Vector3(),
      },
      {
        vertice: [],
        random: [],
        colors: new THREE.Vector3(),
      },
      {
        vertice: [],
        random: [],
        colors: new THREE.Vector3(),
      },
      {
        vertice: [],
        random: [],
        colors: new THREE.Vector3(),
      },
    ];

    this.loader = new GLTFLoader(this.manager);
    this.loader2 = new GLTFLoader(this.manager);
    this.loader3 = new GLTFLoader();
    this.loader4 = new GLTFLoader();

    this.draco = new DRACOLoader();

    this.loader.setDRACOLoader(this.draco);
    this.loader2.setDRACOLoader(this.draco);
    this.loader3.setDRACOLoader(this.draco);
    this.loader4.setDRACOLoader(this.draco);

    this.draco.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
    );

    this.loader.load(earth, (gltf) => {
      this.color = new THREE.Color();
      this.objs = [];
      let gltfObjs = this.objs;

      this.vector = new THREE.Vector3();
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          this.objs.push(obj);
        }
      });
      this.objs.forEach((obj) => {
        this.geoPosition = obj.geometry.attributes.position;
        this.geoArray = this.geoPosition.array;
        this.vetice = new Float32Array(this.geoArray);
        this.modelData[0].colors = new Float32Array(this.geoArray);
        this.randoms = new Float32Array(this.geoArray);
        this.centers = new Float32Array(this.geoArray.length * 3);

        for (let i = 0; i < this.geoPosition.count; i += 3) {
          let r = Math.random();
          this.randoms[i] = r;
          this.randoms[i + 1] = r;
          this.randoms[i + 2] = r;
          this.modelData[0].random.push(r);

          this.vector.x = this.geoArray[i];
          this.vector.y = this.geoArray[i + 1];
          this.vector.z = this.geoArray[i + 2];
          this.modelData[0].vertice.push(
            this.vector.x,
            this.vector.y,
            this.vector.z
          );

          this.color.setHSL(0.01 + 0.1 * (i / this.geoPosition.count), 1, 1.0);
          this.color.toArray(this.colors, i * 3);

          // let x = this.geo.attributes.position.array[i * 3];
          // let y = this.geo.attributes.position.array[i * 3 + 1];
          // let z = this.geo.attributes.position.array[i * 3 + 2];

          // let x1 = this.geo.attributes.position.array[i * 3 + 3];
          // let y1 = this.geo.attributes.position.array[i * 3 + 4];
          // let z1 = this.geo.attributes.position.array[i * 3 + 5];

          // let x2 = this.geo.attributes.position.array[i * 3 + 6];
          // let y2 = this.geo.attributes.position.array[i * 3 + 7];
          // let z2 = this.geo.attributes.position.array[i * 3 + 8];

          // let center = new THREE.Vector3(x, y, z)
          //   .add(new THREE.Vector3(x1, y1, z1))
          //   .add(new THREE.Vector3(x2, y2, z2))
          //   .divideScalar(3);
          // this.centers.set([center.x, center.y, center.z], i * 3);
          // this.centers.set([center.x, center.y, center.z], (i + 1) * 3);
          // this.centers.set([center.x, center.y, center.z], (i + 2) * 3);
        }
      });
    });
    this.loader.load(land, (gltf) => {
      this.color = new THREE.Color();
      this.objs = [];
      let gltfObjs = this.objs;

      this.vector = new THREE.Vector3();
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          this.objs.push(obj);
        }
      });
      this.objs.forEach((obj) => {
        this.geoPosition = obj.geometry.attributes.position;
        this.geoArray = this.geoPosition.array;
        this.vetice = new Float32Array(this.geoArray);
        this.colors = new Float32Array(this.geoArray);
        this.randoms = new Float32Array(this.geoArray);
        this.centers = new Float32Array(this.geoArray.length * 3);

        for (let i = 0; i < this.geoPosition.count; i += 3) {
          let r = Math.random();
          this.randoms[i] = r;
          this.randoms[i + 1] = r;
          this.randoms[i + 2] = r;
          this.modelData[1].random.push(r);

          this.vector.x = this.geoArray[i];
          this.vector.y = this.geoArray[i + 1];
          this.vector.z = this.geoArray[i + 2];
          this.modelData[1].vertice.push(
            this.vector.x,
            this.vector.y,
            this.vector.z
          );

          this.color.setHSL(0.01 + 0.1 * (i / this.geoArray.count), 1, 1.0);
          this.color.toArray(this.colors, i * 3);

          // let x = this.geo.attributes.position.array[i * 3];
          // let y = this.geo.attributes.position.array[i * 3 + 1];
          // let z = this.geo.attributes.position.array[i * 3 + 2];

          // let x1 = this.geo.attributes.position.array[i * 3 + 3];
          // let y1 = this.geo.attributes.position.array[i * 3 + 4];
          // let z1 = this.geo.attributes.position.array[i * 3 + 5];

          // let x2 = this.geo.attributes.position.array[i * 3 + 6];
          // let y2 = this.geo.attributes.position.array[i * 3 + 7];
          // let z2 = this.geo.attributes.position.array[i * 3 + 8];

          // let center = new THREE.Vector3(x, y, z)
          //   .add(new THREE.Vector3(x1, y1, z1))
          //   .add(new THREE.Vector3(x2, y2, z2))
          //   .divideScalar(3);
          // this.centers.set([center.x, center.y, center.z], i * 3);
          // this.centers.set([center.x, center.y, center.z], (i + 1) * 3);
          // this.centers.set([center.x, center.y, center.z], (i + 2) * 3);
        }
      });
    });
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v2", value: new THREE.Vector2() },
        progress: { type: "f", value: 0 },
        t: {
          type: "f",
          value: new THREE.TextureLoader().load(t1Texture),
        },
        diffuse: {
          type: "vec3",
          value: { r: 1, g: 1, b: 1 },
        },
        random: {
          type: "f",
          value: Math.random(),
        },
        array: {
          type: "f",
          value: this.modelData[0].vertice,
        },
        particleScale: {
          type: "f",
          value: 0,
        },
        dotScale: { type: "f", value: 1 },
        color: { value: new THREE.Color(0xffffff) },
        alphaTest: { value: 0.1 },
      },
      vertexColors: true,
      fragmentShader: fragment,
      vertexShader: vertex,
      side: THREE.DoubleSide,
    });
    this.manager.onLoad = () => {
      // diffuse(컬러) 추가
      this.geometry.setAttribute(
        "aDiffuse",
        new THREE.Float32BufferAttribute(this.colors, 3)
      );
      this.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(this.modelData[0].vertice, 3)
      );

      // morph 배열생성
      this.geometry.morphAttributes.position = [];
      // morph포지션 속성추가
      this.geometry.morphAttributes.position[0] =
        new THREE.Float32BufferAttribute(this.modelData[0].vertice, 3);
      this.geometry.morphAttributes.position[1] =
        new THREE.Float32BufferAttribute(this.modelData[1].vertice, 3);
      this.mesh = new THREE.Points(this.geometry, this.material);

      this.scene.add(this.mesh);
    };
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
    this.bloomPass.threshold = this.settings.params.bloomThreshold;
    this.bloomPass.strength = this.settings.params.bloomStrength;
    this.bloomPass.radius = this.settings.params.bloomRadius;
    this.bloomPass.exposure = this.settings.params.exposure;
    // if (this.mixer) this.mixer.update(this.delta);

    // console.log(this.material.uniforms.time.value);
    this.material.uniforms.particleScale.value =
      this.material.uniforms.particleScale.value;
    this.material.uniforms.progress.value =
      this.material.uniforms.progress.value;

    if (this.mesh) {
      this.mesh.morphTargetInfluences[0] = this.settings.earth;
      this.mesh.morphTargetInfluences[1] = this.settings.land;
    }
    this.material.uniforms.dotScale.value = this.settings.dotScale;
  }
  render() {
    // this.renderer.render(this.scene, this.camera);
    this.update();
    this.composer.render();
    requestAnimationFrame(this.render.bind(this));
  }
}
