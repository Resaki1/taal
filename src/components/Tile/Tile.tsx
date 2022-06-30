import { Html, Select } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Vector3 } from "three";
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
  type: number;
  building?: string;
  addBuilding: (x: number, y: number) => void;
  tileRef: (el: any) => any;
};

export const Tile = ({ type, building, addBuilding, tileRef }: TileProps) => {
  const material = useMemo(
    () =>
      type <= -0.2
        ? water
        : type < -0.1
        ? sand
        : type < 0.1
        ? meadow
        : type < 0.4
        ? forest
        : mountain,
    [type]
  );

  const object = useMemo(() => tileMesh(material), [material]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <>
      <Select box onClick={(e) => handleClick(e)}>
        <primitive object={object} ref={tileRef} />
      </Select>
      {building && <mesh material={mountain} geometry={tile} />}
    </>
  );
};
