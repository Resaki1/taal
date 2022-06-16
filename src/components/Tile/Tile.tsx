import { useMemo } from "react";
import { Euler } from "three";
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
  const geometry = useMemo(() => tile, []);
  const material = useMemo(
    () =>
      type <= -0.2
        ? water
        : type < -0.15
        ? sand
        : type < 0.1
        ? meadow
        : type < 0.6
        ? forest
        : mountain,
    [type]
  );

  return (
    <mesh
      position={[x, 0, y]}
      geometry={geometry}
      material={material}
      rotation={new Euler(-Math.PI / 2)}
    ></mesh>
  );
};
