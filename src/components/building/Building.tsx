import { useMemo } from "react";
import { Vector3 } from "three";
import Lumberhut from "./buildings/Lumberhut/Lumberhut";
import Outpost from "./buildings/Outpost/Outpost";

type BuildingProps = {
  position: Vector3;
  type: Buildings;
};

export enum Buildings {
  Outpost,
  Lumberhut,
}

export const Building = ({ position, type }: BuildingProps) => {
  const buildingPosition = useMemo(
    () => new Vector3(position.x, position.y + 0.75, position.z),
    [position]
  );

  const getBuilding = () => {
    switch (type) {
      case Buildings.Outpost:
        return <Outpost position={buildingPosition} />;
      case Buildings.Lumberhut:
        return <Lumberhut position={buildingPosition} />;
      default:
        return <mesh />;
    }
  };

  return getBuilding();
};
