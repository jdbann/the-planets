/* eslint no-new: "off" */

import test from "ava";
import sinon from "sinon";

import * as THREE from "three";
import Planet from "../src/planet";

test("Planet has necessary THREE objects", t => {
  const planet = new Planet();

  t.true(Array.isArray(planet.colors));
  t.true(planet.geometry instanceof THREE.IcosahedronGeometry);
  t.true(planet.material instanceof THREE.Material);
  t.true(planet.mesh instanceof THREE.Mesh);
  t.true(planet.waterGeometry instanceof THREE.IcosahedronGeometry);
  t.true(planet.waterMaterial instanceof THREE.Material);
  t.true(planet.waterMesh instanceof THREE.Mesh);
});

test("Planet can be passed options", t => {
  const colors = [];
  const geometry = sinon.stub(THREE, "IcosahedronGeometry");
  const waterMaterial = new THREE.Material();
  const planet = new Planet(
    {
      colors,
      detail: 8,
      height: 2,
      radius: 8,
      waterMaterial
    }
  );

  t.deepEqual(planet.colors, colors);
  t.true(geometry.calledWithMatch(8, 8));
  t.is(planet.height, 2);
  t.deepEqual(planet.waterMaterial, waterMaterial);

  geometry.restore();
});

test("Planet colors must be an array", t => {
  const error = t.throws(() => {
    new Planet({colors: "not an array"});
  }, TypeError);

  t.is(error.message, "Must provide an array of color definitions");
});

test("Planet material must be a THREE.Material", t => {
  const error = t.throws(() => {
    new Planet({material: "not a material"});
  }, TypeError);

  t.is(error.message, "Must provide a THREE Material");
});

test("generateTerrain", t => {
  const planet = new Planet();
  const randomCall = sinon.stub(planet.random, "call");

  planet.generateTerrain();

  for (const vertex of planet.geometry.vertices) {
    t.true(randomCall.calledWithMatch(vertex), "calls random on vertex");
  }
  t.is(planet.geometry.verticesNeedUpdate, true, "sets geometry vertices as needing update");
});

test("newLength", t => {
  const planet = new Planet({radius: 2, height: 0.1});

  t.is(planet.newLength(1), 2.1);
  t.is(planet.newLength(0.5), 2);
  t.is(planet.newLength(0), 1.9);
});

test("addTo", t => {
  const planet = new Planet();
  const scene = new THREE.Scene();
  const addSpy = sinon.spy(scene, "add");

  planet.addTo(scene);

  t.true(addSpy.calledWith(planet.mesh));
  t.true(addSpy.calledWith(planet.waterMesh));
});

test("paintTerrain", t => {
  const red = new THREE.Color(0xFF0000);
  const blue = new THREE.Color(0x0000FF);
  const colors = [
    {
      offset: 0.5,
      color: red
    },
    {
      offset: 1,
      color: blue
    }
  ];
  const planet = new Planet({colors, height: 1, radius: 0.5});
  const redFace = sinon.spy();
  const blueFace = sinon.spy();
  planet.geometry.faces = [redFace, blueFace];
  const faceLength = sinon.stub(planet, "faceLength");
  faceLength.withArgs(redFace).returns(0.25);
  faceLength.withArgs(blueFace).returns(0.75);

  planet.paintTerrain();

  t.is(faceLength.callCount, 2);
  t.true(faceLength.calledWith(redFace));
  t.true(faceLength.calledWith(blueFace));
  t.is(redFace.color, red);
  t.is(blueFace.color, blue);
});
