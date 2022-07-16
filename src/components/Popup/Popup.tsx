import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { Vector3 } from "three";
import "./Popup.scss";

type PopupProps = {
  position: { x: number; y: number; z: number };
};

export const Popup = ({ position }: PopupProps) => {
  const popupPosition = useMemo(
    () => new Vector3(position.x, position.y + 1, position.z),
    [position]
  );

  return (
    <Html position={popupPosition}>
      <div className="popup">test</div>
    </Html>
  );
};
