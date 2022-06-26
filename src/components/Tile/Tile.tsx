import { Select } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import {
  water,
  sand,
  meadow,
  forest,
  mountain,
  tileMesh,
  tile,
} from "../../materials/materials";

export type TileProps = {
  x: number;
  y: number;
  type: number;
  building?: string;
  addBuilding: (x: number, y: number) => void;
};

export const Tile = ({ x, y, type, building, addBuilding }: TileProps) => {
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
  const position = useMemo(() => [x, Math.pow(type, 3) * 20, y], [x, y, type]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    addBuilding(x, y);
  };

  return (
    <>
      <Select box onClick={(e) => handleClick(e)}>
        <primitive position={position} object={object} />
      </Select>
      {building && (
        <mesh
          material={mountain}
          geometry={tile}
          position={[x, Math.pow(type, 3) * 20 + 1, y]}
        />
      )}
    </>
  );
};
