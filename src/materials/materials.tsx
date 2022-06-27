import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from "three";

export const tile = new BoxBufferGeometry(1, 3, 1);
export const tileMesh = (material: MeshStandardMaterial) =>
  new Mesh(tile, material);

export const water = new MeshStandardMaterial({ color: "blue" });
export const sand = new MeshStandardMaterial({ color: "yellow" });
export const meadow = new MeshStandardMaterial({ color: "green" });
export const forest = new MeshStandardMaterial({ color: "darkgreen" });
export const mountain = new MeshStandardMaterial({ color: "grey" });
