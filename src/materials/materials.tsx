import * as THREE from "three";

export const tile = new THREE.PlaneBufferGeometry(1, 1, 1);

export const water = new THREE.MeshStandardMaterial({ color: "blue" });
export const sand = new THREE.MeshStandardMaterial({ color: "yellow" });
export const meadow = new THREE.MeshStandardMaterial({ color: "green" });
export const forest = new THREE.MeshStandardMaterial({ color: "darkgreen" });
export const mountain = new THREE.MeshStandardMaterial({ color: "grey" });
