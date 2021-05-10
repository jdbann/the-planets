import * as THREE from "three";

export const DefaultPlanetColors = [
  {
    offset: 0.25,
    color: new THREE.Color(0x000000)
  },
  {
    offset: 0.45,
    color: new THREE.Color(0x228896)
  },
  {
    offset: 0.575,
    color: new THREE.Color(0xFFEC85)
  },
  {
    offset: 0.7,
    color: new THREE.Color(0xA9C52F)
  },
  {
    offset: 0.85,
    color: new THREE.Color(0xC0C0C0)
  },
  {
    offet: 1,
    color: new THREE.Color(0xFFFFFF)
  }
];

export default class Planet {
  constructor(options) {
    options = options || {};
    this.colors = options.colors || DefaultPlanetColors;
    this.detail = "detail" in options ? options.detail : 4;
    this.height = options.height || 0.4;
    this.material = options.material || new THREE.Material();
    this.radius = options.radius || 2;
    this.random = options.random || Math.random;
    this.waterMaterial = options.waterMaterial || new THREE.Material();

    if (!(Array.isArray(this.colors))) {
      throw new TypeError("Must provide an array of color definitions");
    }

    if (!(this.material instanceof THREE.Material)) {
      throw new TypeError("Must provide a THREE Material");
    }

    this.geometry = new THREE.IcosahedronGeometry(this.radius, this.detail);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.waterGeometry = new THREE.IcosahedronGeometry(this.radius, this.detail);
    this.waterMesh = new THREE.Mesh(this.waterGeometry, this.waterMaterial);
  }

  faceLength(face) {
    return (
          this.geometry.vertices[face.a].length() +
          this.geometry.vertices[face.b].length() +
          this.geometry.vertices[face.b].length()
        ) / 3;
  }

  generateTerrain() {
    for (const vertex of this.geometry.vertices) {
      vertex.setLength(this.newLength(this.random.call(vertex)));
    }
    this.geometry.verticesNeedUpdate = true;
  }

  newLength(value) {
    return ((value - 0.5) * 2 * this.height) + this.radius;
  }

  originalLength(value) {
    return ((value - this.radius) / 2 / this.height) + 0.5;
  }

  paintTerrain() {
    for (const face of this.geometry.faces) {
      const length = this.faceLength(face);
      const adjustedLength = this.originalLength(length);
      for (const colorRule of this.colors) {
        if (adjustedLength <= colorRule.offset) {
          face.color = colorRule.color;
          break;
        }
      }
    }
  }

  addTo(scene) {
    scene.add(this.mesh);
    scene.add(this.waterMesh);
  }
}
