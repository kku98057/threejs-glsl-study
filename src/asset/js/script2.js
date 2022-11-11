import * as THREE from "three";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

    // this.camera.position.set(10, 3, 15);

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
      box: 0,
      sphere: 0,
      cylinder: 0,
    };
    this.gui = new dat.GUI();

    this.gui.add(this.settings, "progress", 0, 1, 0.01);
    this.gui.add(this.settings, "box", 0, 1, 0.01).onChange((value) => {
      console.log(this.mesh.morphTargetInfluences);
      this.mesh.morphTargetInfluences[0] = value;
    });
    this.gui.add(this.settings, "sphere", 0, 1, 0.01).onChange((value) => {
      console.log(this.mesh.morphTargetInfluences);
      this.mesh.morphTargetInfluences[1] = value;
    });
    this.gui.add(this.settings, "cylinder", 0, 1, 0.01).onChange((value) => {
      console.log(this.mesh.morphTargetInfluences);
      this.mesh.morphTargetInfluences[2] = value;
    });
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
    this.box = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    this.sphere = new THREE.SphereGeometry(1, 32, 32);
    this.cylinder = new THREE.CylinderGeometry(1, 1, 5, 32, 32);
    this.bufferGeo = new THREE.BufferGeometry();

    // box position
    this.boxPosition = this.box.attributes.position;
    this.boxPositionArray = this.boxPosition.array;
    this.boxPositions = new Float32Array(this.boxPositionArray);
    for (let i = 0; i < this.boxPositionArray.count; i += 3) {
      this.boxPositionArray += this.boxPositionArray[i];
      this.boxPositionArray += this.boxPositionArray[i + 1];
      this.boxPositionArray += this.boxPositionArray[i + 2];
      this.boxPositions.push(this.boxPositionArray);
    }

    // sphere position
    this.spherePosition = this.sphere.attributes.position;
    this.spherePositionArray = this.spherePosition.array;
    this.spherePositions = new Float32Array(this.spherePositionArray);
    for (let i = 0; i < this.spherePositionArray.count; i += 3) {
      this.spherePositionArray += this.spherePositionArray[i];
      this.spherePositionArray += this.spherePositionArray[i + 1];
      this.spherePositionArray += this.spherePositionArray[i + 2];
      this.spherePositions.push(this.spherePositionArray);
    }
    // cylinder position
    this.cylinderPosition = this.cylinder.attributes.position;
    this.cylinderPositionArray = this.cylinderPosition.array;
    this.cylinderPositions = new Float32Array(this.cylinderPositionArray);
    for (let i = 0; i < this.cylinderPositionArray.count; i += 3) {
      this.cylinderPositionArray += this.cylinderPositionArray[i];
      this.cylinderPositionArray += this.cylinderPositionArray[i + 1];
      this.cylinderPositionArray += this.cylinderPositionArray[i + 2];
      this.cylinderPositions.push(this.cylinderPositionArray);
    }

    this.bufferGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.spherePositions, 3)
    );
    this.bufferGeo.morphAttributes.position = [];
    this.bufferGeo.morphAttributes.position[0] =
      new THREE.Float32BufferAttribute(this.boxPositions, 3);
    this.bufferGeo.morphAttributes.position[1] =
      new THREE.Float32BufferAttribute(this.spherePositions, 3);
    this.bufferGeo.morphAttributes.position[2] =
      new THREE.Float32BufferAttribute(this.cylinderPositions, 3);

    this.material = new THREE.PointsMaterial({ size: 0.01 });

    this.mesh = new THREE.Points(this.bufferGeo, this.material);
    console.log(this.mesh);
    this.scene.add(this.mesh);
    console.log(this.mesh.morphTargetInfluences[0]);
    let target = [0, 0, 1];
    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section1",
          scrub: 2,
          pin: true,
          end: "+=3000",
        },
      })
      .to(this.camera.position, {
        x: -window.innerWidth / 1000,
        duration: 0.5,
      })
      .to(this.mesh.morphTargetInfluences, [0, 0, 1], ">-=0.5")
      .to(this.mesh.morphTargetInfluences, 0.25, [0, 0, 0]);

    const tl2 = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section2",
          scrub: 2,
          pin: true,
          end: "+=3000",
        },
      })
      .to(this.camera.position, {
        x: 0,
        duration: 0.5,
      });

    const tl3 = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section3",
          scrub: 2,
        },
      })
      .to(this.mesh.morphTargetInfluences, 0.25, [0, 0, 0])
      .to(this.mesh.morphTargetInfluences, [1, 0, 0]);
  }
  0;
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
    // if (this.mesh) {
    //   this.mesh.morphTargetInfluences[0] = this.settings.box;
    //   this.mesh.morphTargetInfluences[1] = this.settings.sphere;
    // }
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    this.update();

    requestAnimationFrame(this.render.bind(this));
  }
}
