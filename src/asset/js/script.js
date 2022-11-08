import * as THREE from "three";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import robot from "../3DTexture/earth.glb";
import model1 from "../3DTexture/model1.glb";
import model2 from "../3DTexture/model2.glb";
import t1Texture from "../img/circle.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import * as dat from "dat.gui";

// import fragment from "./fragment.glsl"
export default class App {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    this.renderer = new THREE.WebGLRenderer();
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

    this.camera.position.set(-1, 0, 4);
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
    };
    this.gui = new dat.GUI();

    this.gui.add(this.settings, "progress", 0, 1, 0.01);
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
    // this.geo = new THREE.PlaneGeometry(3, 3, 10, 10);
    this.modelData = [
      {
        src: robot,
        vertice: [],
      },
      {
        src: model1,
        vertice: [],
      },
      {
        src: model2,
        vertice: [],
      },
    ];

    this.loader = new GLTFLoader();

    this.draco = new DRACOLoader();

    this.loader.setDRACOLoader(this.draco);

    this.draco.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
    );

    this.loader.load(this.modelData[0].src, (gltf) => {
      console.log(gltf);
      this.objs = [];
      this.vector = new THREE.Vector3();
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          this.objs.push(obj);
        }
      });
      this.objs.forEach((obj, i) => {
        this.geoPosition = obj.geometry.attributes.position;
        this.geoArray = this.geoPosition.array;
        this.randoms = new Float32Array(this.geoArray);
        for (let i = 0; i < this.geoArray.length; i += 3) {
          let r = Math.random();
          this.randoms[i] = r;
          this.randoms[i + 1] = r;
          this.randoms[i + 2] = r;
          this.vector.x = this.geoArray[i];
          this.vector.y = this.geoArray[i + 1];
          this.vector.z = this.geoArray[i + 2];
          this.modelData[0].vertice.push(
            this.vector.x,
            this.vector.y,
            this.vector.z
          );
        }
        obj.geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(this.modelData[0].vertice, 3)
        );
        obj.geometry.setAttribute(
          "aRandom",
          new THREE.Float32BufferAttribute(this.randoms, 1)
        );

        this.points = new THREE.Points(obj.geometry, this.material);
        this.scene.add(this.points);
        this.points.position.set(0, 0, 0);
        this.points.rotation.set(4.7, 0, 0);
        this.points.rotation.y += this.delta;

        const tl2 = gsap
          .timeline({
            scrollTrigger: {
              trigger: ".section2",
              scrub: 3,
              markers: true,
            },
          })
          .to(this.points.rotation, {
            x: 4.7,
            y: 0,
            z: 2,
          });

        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: ".section3",
              scrub: 3,
              markers: true,
            },
          })
          .to(this.points.rotation, {
            x: 4.7,
            y: 0,
            z: 4,
            duration: 1,
          })
          .to(
            this.camera.position,
            {
              x: -1,
              y: 0,
              z: 0,
            },
            ">-=0.5"
          )
          .to(
            this.material.uniforms.progress,
            {
              value: 1,
            },
            ">-=0.5"
          );
      });
    });

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() },
        progress: { type: "f", value: 0 },
        t1: {
          type: "f",
          value: new THREE.TextureLoader().load(t1Texture),
        },
        colors: {
          type: "v3",
          value: new THREE.Vector3(),
        },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      side: THREE.DoubleSide,
    });
  }

  setResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  update() {
    this.time += 0.01;

    this.delta = this.clock.getDelta();
    // if (this.mixer) this.mixer.update(this.delta);

    // console.log(this.material.uniforms.time.value);
    this.material.uniforms.progress.value = this.settings.progress;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    this.update();
    requestAnimationFrame(this.render.bind(this));
  }
}
