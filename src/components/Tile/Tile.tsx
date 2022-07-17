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
} from "../../materials/materials";
import { Building } from "../building/Building";
import { Object3D, Event } from "three";

export type TileProps = {
  tileRef: (el: any) => any;
  terrain: any;
};

export const Tile = ({ tileRef, terrain }: TileProps) => {
  const ref = useRef<any>();

  const [type, setType] = useState<number>(0);
  const [, setValue] = useState(0);
  const [selected, setSelected] = useState(false);

  const forceUpdate = () => setValue((value) => value + 1);

  useEffect(() => {
    if (ref && ref.current) {
      setType(
        terrain.perlin2(ref.current.position.x / 8, ref.current.position.z / 8)
      );
      ref.current.position.y = type * type * type * 10;
    }
  }, [terrain, type]);
  useEffect(() => console.log("useEffect"));

  const buildings = useStore((state) => state.buildings);
  const setGlobalSelected = useStore((state) => state.setSelected);

  const hasBuilding =
    ref?.current &&
    buildings[ref.current.position.x] &&
    buildings[ref.current.position.x][ref.current.position.z] !== undefined;

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
    selected && deselect();
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!selected) {
      select(e.object);
    } else {
      deselect();
    }
  };

  const select = (object: Object3D<Event>) => {
    const newMaterial = ref.current.material.clone();
    newMaterial.emissive.set(0xffffff);
    ref.current.material = newMaterial;
    setGlobalSelected({ type: "tile", object: object });
    setSelected(true);
  };

  const deselect = () => {
    ref.current.material = getMaterial(type);
    setGlobalSelected(undefined);
    setSelected(false);
  };

  return (
    <Suspense>
      <Select
        key={Math.random()}
        box
        onClick={(e) => handleClick(e)}
        onPointerMissed={() => selected && deselect()}
      >
        <primitive
          object={object}
          ref={(el: any) => {
            ref.current = el;
            tileRef(el);
          }}
          userData={{ update: () => onRefChange() }}
        />
      </Select>
      {hasBuilding && <Building position={ref.current.position} />}
    </Suspense>
  );
};
