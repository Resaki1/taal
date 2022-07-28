import { Instance, Select } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { startTransition, Suspense, useMemo, useRef, useState } from "react";
import { useStore } from "../../store/store";
import { Building } from "../Building/Building";
import { Object3D, Event, MeshStandardMaterial, Color } from "three";
import { gray, Materials } from "../../materials/materials";
import { getTerrainHeight } from "../../helpers/terrain";
import { Foilage } from "../Foilage/Foilage";

export type TileProps = {
  tileRef: (el: any) => any;
};

let newMaterial: MeshStandardMaterial;
const noColor = new Color();

export const Tile = ({ tileRef }: TileProps) => {
  const ref = useRef<any>();

  const MATERIALS = Materials();

  const [, setValue] = useState(0);
  const [selected, setSelected] = useState(false);
  const [isUnlocked, setUnlocked] = useState(false);

  const forceUpdate = () => setValue((value) => value + 1);

  const buildings = useStore((state) => state.buildings);
  const setGlobalSelected = useStore((state) => state.setSelected);
  const unlocked = useStore((state) => state.unlocked);

  const hasBuilding =
    ref?.current &&
    buildings[ref.current.position.x] &&
    buildings[ref.current.position.x][ref.current.position.z] !== undefined;

  let x: number;
  let y: number;
  const updateTile = () => {
    x = ref.current.position.x;
    y = ref.current.position.z;
    ref.current.material = MATERIALS.get(x, y);

    if (isUnlocked) {
      if (!unlocked[x]?.[y]) {
        // tile is shown as unlocked but should be locked
        ref.current.material.color = gray;
        startTransition(() => setUnlocked(false));
      } else ref.current.material.color = noColor; // unlocked tile is deselected
    } else if (!isUnlocked && unlocked[x]?.[y]) {
      // tile is shown as locked but should be unlocked
      startTransition(() => setUnlocked(true));
      ref.current.material.color = noColor;
    }

    ref.current.position.y = getTerrainHeight(x, y);
  };

  const onRefChange = () => {
    if (
      hasBuilding ||
      (buildings[ref.current.position.x] &&
        buildings[ref.current.position.x][ref.current.position.z] !== undefined)
    )
      startTransition(() => forceUpdate());

    updateTile();
    selected && deselect();
  };

  const object = useMemo(() => MATERIALS.cube, [MATERIALS.cube]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    console.log(e.object.position)
    /* e.intersections.forEach((intersection, index) => {
      if (index > 0)
        intersection.object.userData.deselect &&
          startTransition(() => intersection.object.userData.deselect());
    });
    if (!selected) {
      select(e.object);
    } else {
      deselect();
    } */
  };

  const select = (object: Object3D<Event>) => {
    newMaterial = ref.current.material.clone();
    newMaterial.color = noColor;
    newMaterial.emissive.set(0xffffff);
    ref.current.material = newMaterial;
    setGlobalSelected({ type: "tile", object: object });
    setSelected(true);
  };

  const deselect = () => {
    updateTile();
    setGlobalSelected(undefined);
    setSelected(false);
  };

  useFrame(() => {
    if (
      !isUnlocked &&
      unlocked[ref.current.position.x] &&
      unlocked[ref.current.position.x][ref.current.position.z]
    ) {
      startTransition(() => setUnlocked(true));
      newMaterial = ref.current.material.clone();
      newMaterial.color = noColor;
      ref.current.material = newMaterial;
    } else if (isUnlocked && !unlocked[ref.current.position.x]) {
      startTransition(() => setUnlocked(false));
      newMaterial = ref.current.material.clone();
      newMaterial.color = gray;
      ref.current.material = newMaterial;
    }
  });

  return (
    <Suspense>
        <Instance
          ref={(el: any) => {
            ref.current = el;
            tileRef(el);
          }}
          userData={{ update: () => onRefChange(), deselect: () => deselect() }}
        onClick={(e) => handleClick(e)}
        onPointerMissed={() => selected && deselect()}
        />
      {hasBuilding && (
        <Building
          position={ref.current.position}
          type={buildings[ref.current.position.x][ref.current.position.z]}
        />
      )}
      {/* {ref?.current?.position && !hasBuilding && (
        <Foilage position={ref.current.position} />
      )} */}
    </Suspense>
  );
};
