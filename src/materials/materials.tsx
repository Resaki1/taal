import { useTexture } from "@react-three/drei";
import {
  BoxBufferGeometry,
  Mesh,
  MeshStandardMaterial,
  NearestFilter,
} from "three";
import tile_meadow from "../textures/tile_meadow.jpg";
import tile_beach from "../textures/tile_beach.jpg";
import tile_forest from "../textures/tile_forest.jpg";
import tile_mountain from "../textures/tile_mountain.jpg";
import { getTerrainType, getTerrainValue, Terrain } from "../helpers/terrain";

export const tile = new BoxBufferGeometry(1, 1, 1);
export const tileMesh = (material: MeshStandardMaterial) =>
  new Mesh(tile, material);

export const water = new MeshStandardMaterial({
  color: "blue",
  emissiveIntensity: 0.2,
});
export const mountain = new MeshStandardMaterial({
  color: "grey",
  emissiveIntensity: 0.2,
});

export const building = new BoxBufferGeometry(0.5, 0.5, 0.5);

export const Materials = () => {
  const [forest_texture, meadow_texture, beach_texture, mounatin_texture] =
    useTexture([tile_forest, tile_meadow, tile_beach, tile_mountain]);
  forest_texture.minFilter = NearestFilter;
  forest_texture.magFilter = NearestFilter;
  meadow_texture.minFilter = NearestFilter;
  meadow_texture.magFilter = NearestFilter;
  beach_texture.minFilter = NearestFilter;
  beach_texture.magFilter = NearestFilter;
  mounatin_texture.minFilter = NearestFilter;
  mounatin_texture.magFilter = NearestFilter;

  const forest = new MeshStandardMaterial({
    emissiveIntensity: 0.2,
    map: forest_texture,
    color: "gray",
  });
  const meadow = new MeshStandardMaterial({
    emissiveIntensity: 0.2,
    map: meadow_texture,
    color: "gray",
  });
  const sand = new MeshStandardMaterial({
    emissiveIntensity: 0.2,
    map: beach_texture,
    color: "gray",
  });
  const mountain = new MeshStandardMaterial({
    emissiveIntensity: 0.2,
    map: mounatin_texture,
    color: "gray",
  });

  const get = (x: number, y: number) => {
    const type = getTerrainType(x, y);
    if (type === Terrain.WATER) return water;
    if (type === Terrain.BEACH) return sand;
    if (type === Terrain.MEADOW) return meadow;
    if (type === Terrain.FOREST) return forest;
    return mountain;
  };

  const cube = new Mesh(new BoxBufferGeometry(1, 1, 1));

  return { forest, meadow, sand, mountain, get, cube };
};
