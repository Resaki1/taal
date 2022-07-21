const noisejs = require("noisejs");
const terrain = new noisejs.Noise(0);

const getTerrainValue = (x: number, y: number): number => {
  return terrain.perlin2(x, y);
};

export default getTerrainValue;
