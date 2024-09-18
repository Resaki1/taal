import { Noise } from 'noisejs';
const terrain = new Noise(0);

export enum Terrain {
  WATER,
  BEACH,
  MEADOW,
  FOREST,
  MOUNTAIN,
}

export const WATER_HEIGHT = 0;
const WATER_BUFFER = 0.07;
const HEIGHT_SCALE = 5;

export const getTerrainValue = (x: number, y: number, scale: number): number => {
  return terrain.perlin2(x / scale, y / scale);
};

export const getTerrainType = (height: number): Terrain => {
  //const value = getTerrainValue(x, y, 1);
  switch (true) {
    case height < 0.3 * HEIGHT_SCALE - (1 - WATER_HEIGHT):
      return Terrain.BEACH;
    case height < 1 * HEIGHT_SCALE - (1 - WATER_HEIGHT):
      return Terrain.MEADOW;
    case height < 2 * HEIGHT_SCALE - (1 - WATER_HEIGHT):
      return Terrain.FOREST;
    default:
      return Terrain.MOUNTAIN;
  }
};

const getOctaveNoise = (x: number, y: number, octaves: number, persistence: number, scale: number): number => {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0; // Used for normalizing result to 0.0 - 1.0

  for (let i = 0; i < octaves; i++) {
    total += (1 / frequency) * terrain.perlin2((x * frequency) / scale, (y * frequency) / scale) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return total / maxValue;
};

export const getTerrainHeight = (x: number, y: number): number => {
  const value = getOctaveNoise(x, y, 7, 1.1, 128);

  let height = value * 40 * HEIGHT_SCALE;

  // Adjust the height if it falls within the buffer range around the water height
  /*  if (height > WATER_HEIGHT - WATER_BUFFER && height < WATER_HEIGHT + WATER_BUFFER) {
    height = WATER_HEIGHT + (height > WATER_HEIGHT ? WATER_BUFFER : -WATER_BUFFER);
  } */

  if (height < WATER_BUFFER && height > 0) height += 0.01;

  return height;
};
