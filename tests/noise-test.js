/* eslint no-new: "off" */

import test from "ava";
import sinon from "sinon";

import * as THREE from "three";
import Noise from "../src/noise";

test("Noise has properties", t => {
  const noise = new Noise();

  t.true(Object.prototype.hasOwnProperty.call(noise, "seed"));
  t.true(Object.prototype.hasOwnProperty.call(noise, "perlinThree"));
});

test("Noise can be passed options", t => {
  const noise = new Noise({seed: "this one please"});

  t.is(noise.seed, "this one please");
});

test("Noise can be called with a THREE.Vector3", t => {
  const noise = new Noise();
  const perlinGet = sinon.spy(noise.perlinThree, "get");
  const vector = new THREE.Vector3(1, 2, 3);

  t.true(typeof noise.call(vector) === "number");
  t.true(perlinGet.calledWith(1, 2, 3));
});

test("Noise fallsback to 0 with an unknown object", t => {
  const noise = new Noise();
  t.is(noise.call({}), 0);
});
