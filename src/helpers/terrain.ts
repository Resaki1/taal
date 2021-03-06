const noisejs = require("noisejs");
const terrain = new noisejs.Noise(0);

export enum Terrain {
  WATER,
  BEACH,
  MEADOW,
  FOREST,
  MOUNTAIN,
}

export const getTerrainValue = (x: number, y: number): number => {
  return terrain.perlin2(x / 8, y / 8);
};

export const getTerrainType = (x: number, y: number): Terrain => {
  const value = getTerrainValue(x, y);
  if (value < -0.2) return Terrain.WATER;
  if (value < -0.1) return Terrain.BEACH;
  if (value < 0.1) return Terrain.MEADOW;
  if (value < 0.4) return Terrain.FOREST;
  return Terrain.MOUNTAIN;
};

export const getTerrainHeight = (x: number, y: number): number => {
  const value = getTerrainValue(x, y);
  return value * value * value * 10;
};
