import { Instance, Instances } from "@react-three/drei";
import { Tile, TileProps } from "../Tile/Tile";

export const Map = () => {
  const map: {
    tiles: TileProps[];
  } = {
    tiles: [],
  };

  const MAPSIZE = 32;
  for (var x = -MAPSIZE / 2; x < MAPSIZE / 2; x++) {
    for (var y = -MAPSIZE / 2; y < MAPSIZE / 2; y++) {
      map.tiles.push({
        x,
        y,
        type: Math.round(Math.random() * 3),
      });
    }
  }

  return (
    <Instances
      /* limit={1000} */ // Optional: max amount of items (for calculating buffer size)
      range={20} // Optional: draw-range
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
