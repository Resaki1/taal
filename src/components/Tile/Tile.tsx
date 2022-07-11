import { Select } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../../store/store";
import {
  water,
  sand,
  meadow,
  forest,
  mountain,
  tileMesh,
  building,
} from "../../materials/materials";

export type TileProps = {
  tileRef: (el: any) => any;
  terrain: any;
};

export const Tile = ({ tileRef, terrain }: TileProps) => {
  const ref = useRef<any>();
  const [type, setType] = useState<number>(0);
  const [, setValue] = useState(0);

  const forceUpdate = () => setValue((value) => value + 1);

  useEffect(() => {
    if (ref && ref.current) {
      setType(
        terrain.perlin2(ref.current.position.x / 8, ref.current.position.z / 8)
      );
      ref.current.position.y = type * type * type * 10;
    }
  }, [terrain, type]);

  const buildings = useStore((state) => state.buildings);
  const addBuilding = useStore((state) => state.addBuilding);
  const hasBuilding =
    ref?.current &&
    buildings[ref.current.position.x] &&
    buildings[ref.current.position.x][ref.current.position.z] !== undefined;

  useEffect(() => console.log("rendered Tile"));

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
    addBuilding(ref.current.position.x, ref.current.position.z, "test");
    console.log(buildings);
    forceUpdate();
  };

  const onRefChange = () => {
    if (
      hasBuilding ||
      (buildings[ref.current.position.x] &&
        buildings[ref.current.position.x][ref.current.position.z] !== undefined)
    )
      forceUpdate();

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
      {hasBuilding && (
        <mesh
          material={mountain}
          geometry={building}
          position={[
            ref.current.position.x,
            ref.current.position.y + 0.75,
            ref.current.position.z,
          ]}
        />
      )}
    </Suspense>
  );
};
