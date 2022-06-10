import { Tile, TileProps } from "../Tile/Tile";

export const Map = () => {
  const map: {
    tiles: TileProps[];
  } = {
    tiles: [],
  };

  const MAPSIZE = 40;
  for (var x = 0; x < MAPSIZE; x++) {
    for (var y = 0; y < MAPSIZE; y++) {
      map.tiles.push({
        x,
        y,
        color: [Math.random(), Math.random(), Math.random()],
      });
    }
  }

  return (
    <group>
      {map.tiles.map((tile) => (
        <Tile
          key={`${tile.x}/${tile.y}`}
          x={tile.x}
          y={tile.y}
          color={tile.color as [number, number, number]}
        />
      ))}
    </group>
  );
};
