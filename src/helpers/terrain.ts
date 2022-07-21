const noisejs = require("noisejs");
const terrain = new noisejs.Noise(0);

export const getTerrainValue = (x: number, y: number): number => {
  return terrain.perlin2(x / 8, y / 8);
};

export const getTerrainHeight = (x: number, y: number): number => {
  const value = getTerrainValue(x, y);
  return value * value * value * 10;
};
