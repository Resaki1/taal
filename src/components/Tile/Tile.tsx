import {
  tile,
  water,
  sand,
  meadow,
  forest,
  mountain,
} from "../../materials/materials";

export type TileProps = {
  x: number;
  y: number;
  type: number;
};

export const Tile = ({ x, y, type }: TileProps) => {
  const material =
    type <= -0.2
      ? water
      : type < -0.15
      ? sand
      : type < 0.1
      ? meadow
      : type < 0.6
      ? forest
      : mountain;

  return (
    <group position={[x, 0, y]}>
      <mesh geometry={tile} material={material}></mesh>
    </group>
  );
};
