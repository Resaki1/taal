import { Suspense, useMemo } from "react";
import { Vector3 } from "three";
import { Ressources } from "../../store/store";
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

type BuildingRessourcesType = {
  [key in Buildings]: Partial<{
    [key in Ressources]: number;
  }>;
};

export const BuildingCosts: BuildingRessourcesType = {
  [Buildings.Outpost]: {
    wood: 10,
  },
  [Buildings.Lumberhut]: {
    wood: 2,
  },
};

export const BuildingOutputs: BuildingRessourcesType = {
  [Buildings.Outpost]: {
    gold: 10,
  },
  [Buildings.Lumberhut]: {
    wood: 1,
  },
};

export const Building = ({ position, type }: BuildingProps) => {
  const buildingPosition = useMemo(
    () => new Vector3(position.x, position.y + 0.75, position.z),
    [position]
  );

  const getBuilding = () => {
    if (type === Buildings.Outpost)
      return <Outpost position={buildingPosition} />;
    if (type === Buildings.Lumberhut)
      return <Lumberhut position={buildingPosition} />;
    return <mesh />;
  };

  return <Suspense>{getBuilding()}</Suspense>;
};
