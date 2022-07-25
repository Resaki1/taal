import { Select } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import {
  startTransition,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStore } from "../../store/store";
import { Building } from "../Building/Building";
import { Object3D, Event, MeshStandardMaterial, Color } from "three";
import { gray, Materials } from "../../materials/materials";
import { getTerrainHeight } from "../../helpers/terrain";

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
    if (isUnlocked) ref.current.material.color = "";
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
      <Select
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
          position={ref?.current && ref.current.position}
          material={ref?.current && ref.current.material}
          userData={{ update: () => onRefChange() }}
        />
      </Select>
      {hasBuilding && (
        <Building
          position={ref.current.position}
          type={buildings[ref.current.position.x][ref.current.position.z]}
        />
      )}
    </Suspense>
  );
};
