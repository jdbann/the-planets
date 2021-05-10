import * as THREE from "three";
import * as perlin from "pf-perlin";

export default class Noise {
  constructor(options) {
    options = options || {};
    this.seed = options.seed || "hello";
    this.perlinThree = perlin.default({dimensions: 3, wavelength: 0.8});
  }

  call(object) {
    switch (object.constructor) {
      case THREE.Vector3:
        return this.perlinThree.get(object.x, object.y, object.z);
      default:
        return 0;
    }
  }
}
