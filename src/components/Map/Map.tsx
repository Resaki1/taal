import { Tile } from "../Tile/Tile";

export const Map = () => {
  const map = {
    tiles: [
      {
        x: 0,
        y: 0,
        color: [Math.random(), Math.random(), Math.random()],
      },
      {
        x: 1,
        y: 0,
        color: [Math.random(), Math.random(), Math.random()],
      },
      {
        x: 0,
        y: 1,
        color: [Math.random(), Math.random(), Math.random()],
      },
      {
        x: 1,
        y: 1,
        color: [Math.random(), Math.random(), Math.random()],
      },
      {
        x: -1,
        y: 0,
        color: [Math.random(), Math.random(), Math.random()],
      },
      {
        x: -1,
        y: -1,
        color: [Math.random(), Math.random(), Math.random()],
      },
      {
        x: 0,
        y: -1,
        color: [Math.random(), Math.random(), Math.random()],
      },
      {
        x: -1,
        y: 1,
        color: [Math.random(), Math.random(), Math.random()],
      },
      {
        x: 1,
        y: -1,
        color: [Math.random(), Math.random(), Math.random()],
      },
    ],
  };

  return (
    <group>
      {map.tiles.map((tile) => (
        <Tile
          key={`${tile.x}-${tile.y}`}
          x={tile.x}
          y={tile.y}
          color={tile.color as [number, number, number]}
        />
      ))}
    </group>
  );
};
