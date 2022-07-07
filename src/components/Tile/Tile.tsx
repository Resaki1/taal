import { Select } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  building?: string;
  addBuilding: (x: number, y: number) => void;
  tileRef: (el: any) => any;
  terrain: any;
};

export const Tile = ({
  building,
  addBuilding,
  tileRef,
  terrain,
}: TileProps) => {
  const ref = useRef<any>();
  const [type, setType] = useState<number>(0);

  useEffect(() => {
    if (ref && ref.current) {
      setType(
        terrain.perlin2(ref.current.position.x / 8, ref.current.position.z / 8)
      );
      ref.current.position.y = type * type * type * 10;
    }
  }, [terrain, type]);

  const getMaterial = (type: number) =>
    type <= -0.2
      ? water
      : type < -0.1
      ? sand
      : type < 0.1
      ? meadow
      : type < 0.4
      ? forest
      : mountain;

  const object = useMemo(() => tileMesh(getMaterial(type)), [type]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
  };

  const onRefChange = () => {
    const type = terrain.perlin2(
      ref.current.position.x / 8,
      ref.current.position.z / 8
    );
    ref.current.position.y = type * type * type * 10;
    ref.current.material = getMaterial(type);
  };

  return (
    <Suspense>
      <Select key={Math.random()} box onClick={(e) => handleClick(e)}>
        <primitive
          object={object}
          ref={(el: any) => {
            ref.current = el;
            tileRef(el);
          }}
          userData={{ update: () => onRefChange() }}
        />
      </Select>
      {building && <mesh material={mountain} geometry={tile} />}
    </Suspense>
  );
};
