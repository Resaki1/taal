import { Instance, Instances } from "@react-three/drei";
import { Tile, TileProps } from "../Tile/Tile";

export const Map = () => {
  const map: {
    tiles: TileProps[];
  } = {
    tiles: [],
  };

  const MAPSIZE = 128;

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
      <boxGeometry />
      <meshStandardMaterial />
      {map.tiles.map((tile) => (
        <Tile
          key={`${tile.x}/${tile.y}`}
          x={tile.x}
          y={tile.y}
          type={tile.type}
        />
      ))}
      // As many as you want, make them conditional, mount/unmount them, lazy
      load them, etc ...
    </Instances>
  );
};
