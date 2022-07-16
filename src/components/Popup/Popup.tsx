import { Html } from "@react-three/drei";
import { MouseEvent, useMemo } from "react";
import { Vector3 } from "three";
import { useStore } from "../../store/store";
import "./Popup.scss";

type PopupProps = {
  position: { x: number; y: number; z: number };
  addBuilding: () => void;
  removeBuilding: () => void;
};

export const Popup = ({
  position,
  addBuilding,
  removeBuilding,
}: PopupProps) => {
  const popupPosition = useMemo(
    () => new Vector3(position.x, position.y + 1, position.z),
    [position]
  );

  const buildings = useStore((state) => state.buildings);

  const hasBuilding =
    buildings[position.x] && buildings[position.x][position.z];

  const handleDelete = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    removeBuilding();
  };

  const handleAdd = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    addBuilding();
  };

  return (
    <Html position={popupPosition}>
      <div className="popup">
        {!hasBuilding && <button onClick={handleAdd}>add</button>}
        {hasBuilding && <button onClick={handleDelete}>delete</button>}
      </div>
    </Html>
  );
};
