import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from "three";

export const tile = new BoxBufferGeometry(1, 1, 1);
export const tileMesh = (material: MeshStandardMaterial) =>
  new Mesh(tile, material);

export const water = new MeshStandardMaterial({
  color: "blue",
  emissiveIntensity: 0.2,
});
export const sand = new MeshStandardMaterial({
  color: "yellow",
  emissiveIntensity: 0.2,
});
export const meadow = new MeshStandardMaterial({
  color: "green",
  emissiveIntensity: 0.2,
});
export const forest = new MeshStandardMaterial({
  color: "darkgreen",
  emissiveIntensity: 0.2,
});
export const mountain = new MeshStandardMaterial({
  color: "grey",
  emissiveIntensity: 0.2,
});

export const building = new BoxBufferGeometry(0.5, 0.5, 0.5);
