import { useMemo } from "react";
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
        : type < 0.4
        ? forest
        : mountain,
    [type]
  );

  const object = useMemo(() => tileMesh(material), [material]);
  const position = useMemo(() => [x, Math.pow(type, 3)*20, y], [x, y, type]);

  return (
    <primitive position={position} object={object} />
  );
};
