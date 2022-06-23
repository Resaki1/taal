import { useMemo } from "react";
import { Euler } from "three";
import {
  water,
  sand,
  meadow,
  forest,
  mountain,
  tileMesh,
} from "../../materials/materials";

export type TileProps = {
  x: number;
  y: number;
  type: number;
};

export const Tile = ({ x, y, type }: TileProps) => {
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

  const object = useMemo(() => tileMesh(material), [material]);
  const rotation = useMemo(() => new Euler(-Math.PI / 2), []);

  return (
    <primitive position={[x, 0, y]} rotation={rotation} object={object} />
  );
};
