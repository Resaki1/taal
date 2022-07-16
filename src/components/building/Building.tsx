import { useMemo } from "react";
import { Vector3 } from "three";
import { building, mountain } from "../../materials/materials";

type BuildingProps = {
  position: Vector3;
};

export const Building = ({ position }: BuildingProps) => {
  const buildingPosition = useMemo(
    () => new Vector3(position.x, position.y + 0.75, position.z),
    [position]
  );

  return (
    <mesh material={mountain} geometry={building} position={buildingPosition} />
  );
};
