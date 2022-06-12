import { Instances } from "@react-three/drei";
import { tile } from "../../materials/materials";
import { Tile, TileProps } from "../Tile/Tile";

export const Map = () => {
  const map: {
    tiles: TileProps[];
  } = {
    tiles: [],
  };

  const MAPSIZE = 96;

  const noisejs = require("noisejs");

  const terrain = new noisejs.Noise(Math.random());

  for (var x = -MAPSIZE / 2; x < MAPSIZE / 2; x++) {
    for (var y = -MAPSIZE / 2; y < MAPSIZE / 2; y++) {
      map.tiles.push({
        x,
        y,
        type: terrain.perlin2(x / 24, y / 24),
      });
    }
  }

  return (
    <Instances
      limit={MAPSIZE * MAPSIZE} // Optional: max amount of items (for calculating buffer size)
      range={1} // Optional: draw-range
    >
      <boxBufferGeometry />
      <meshStandardMaterial />
      {map.tiles.map((tile) => (
        <Tile
          key={`${tile.x}/${tile.y}`}
          x={tile.x}
          y={tile.y}
          type={tile.type}
        />
      ))}
    </Instances>
  );
};
