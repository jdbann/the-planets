/* global window document requestAnimationFrame */

import * as THREE from "three";

import Planet from "./planet";
import Noise from "./noise";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x283739);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.antialias = true;

document.body.appendChild(renderer.domElement);

const material = new THREE.MeshStandardMaterial({
  metalness: 0.1,
  roughness: 1,
  shading: THREE.FlatShading,
  vertexColors: THREE.FaceColors
});
const waterMaterial = new THREE.MeshStandardMaterial(
  {
    color: 0x228896,
    metalness: 0.3,
    opacity: 0.85,
    roughness: 0.5,
    shading: THREE.FlatShading,
    transparent: true
  }
);
const random = new Noise();
const planet = new Planet({material, random, waterMaterial});
planet.generateTerrain();
planet.paintTerrain();
planet.addTo(scene);

const ambientLight = new THREE.AmbientLight(0x0D2A46, 0.6);
scene.add(ambientLight);

const parent = new THREE.Object3D();
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
pointLight.position.set(5, 10, 10);
parent.add(pointLight);
scene.add(parent);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  planet.mesh.rotation.y += 0.002;
  planet.waterMesh.rotation.y += 0.002;
  parent.rotation.y -= 0.0002;
}

render();
