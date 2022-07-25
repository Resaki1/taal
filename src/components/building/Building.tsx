import { Suspense, useMemo } from "react";
import { Vector3 } from "three";
import { Ressources } from "../../store/store";
import House from "./buildings/House/House";
import Lumberhut from "./buildings/Lumberhut/Lumberhut";
import Outpost from "./buildings/Outpost/Outpost";

type BuildingProps = {
  position: Vector3;
  type: Buildings;
};

export enum Buildings {
  Outpost,
  Lumberhut,
  House,
}

type BuildingRessourcesType = {
  [key in Buildings]: Partial<{
    [key in Ressources]: number;
  }>;
};

export const BuildingCosts: BuildingRessourcesType = {
  [Buildings.Outpost]: {
    wood: 10,
    gold: 100,
  },
  [Buildings.Lumberhut]: {
    wood: 2,
    gold: 10,
    villager: 1,
  },
  [Buildings.House]: {
    wood: 6,
    gold: 100,
    villager: -4,
  },
};

const SELLFACTOR = 0.5;
export const BuildingSellBenefits: BuildingRessourcesType = {
  [Buildings.Outpost]: {
    wood: Math.ceil(BuildingCosts[Buildings.Outpost].wood! * SELLFACTOR),
    gold: Math.ceil(BuildingCosts[Buildings.Outpost].gold! * SELLFACTOR),
  },
  [Buildings.Lumberhut]: {
    wood: Math.ceil(BuildingCosts[Buildings.Lumberhut].wood! * SELLFACTOR),
    gold: Math.ceil(BuildingCosts[Buildings.Lumberhut].gold! * SELLFACTOR),
    villager: BuildingCosts[Buildings.Lumberhut].villager!,
  },
  [Buildings.House]: {
    wood: Math.ceil(BuildingCosts[Buildings.House].wood! * SELLFACTOR),
    gold: Math.ceil(BuildingCosts[Buildings.House].gold! * SELLFACTOR),
    villager: BuildingCosts[Buildings.House].villager!,
  },
};

export const BuildingOutputs: BuildingRessourcesType = {
  [Buildings.Outpost]: {
    gold: -10 / 60,
  },
  [Buildings.Lumberhut]: {
    wood: 2 / 60,
    gold: -6 / 60,
  },
  [Buildings.House]: {
    gold: 6 / 60,
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
    if (type === Buildings.House)
      return (
        <House
          position={[
            buildingPosition.x,
            buildingPosition.y - 0.25,
            buildingPosition.z,
          ]}
        />
      );
    return <mesh />;
  };

  return <Suspense>{getBuilding()}</Suspense>;
};
