import { Select } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState } from "react";
import { useStore } from "../../store/store";
import { Building } from "../Building/Building";
import { Object3D, Event } from "three";
import { Materials } from "../../materials/materials";
import { getTerrainHeight } from "../../helpers/terrain";

export type TileProps = {
  tileRef: (el: any) => any;
};

export const Tile = ({ tileRef }: TileProps) => {
  const ref = useRef<any>();

  const MATERIALS = Materials();

  const [, setValue] = useState(0);
  const [selected, setSelected] = useState(false);

  const forceUpdate = () => setValue((value) => value + 1);

  const buildings = useStore((state) => state.buildings);
  const setGlobalSelected = useStore((state) => state.setSelected);

  const hasBuilding =
    ref?.current &&
    buildings[ref.current.position.x] &&
    buildings[ref.current.position.x][ref.current.position.z] !== undefined;

  const onRefChange = () => {
    if (
      hasBuilding ||
      (buildings[ref.current.position.x] &&
        buildings[ref.current.position.x][ref.current.position.z] !== undefined)
    )
      forceUpdate();

    ref.current.material = MATERIALS.get(
      ref.current.position.x,
      ref.current.position.z
    );
    ref.current.position.y = getTerrainHeight(
      ref.current.position.x,
      ref.current.position.z
    );
    selected && deselect();
  };

  const object = useMemo(() => MATERIALS.cube, []);

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
    ref.current.material = MATERIALS.get(
      ref.current.position.x,
      ref.current.position.z
    );
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
