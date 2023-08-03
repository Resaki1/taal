import { Suspense, memo } from 'react';
import { Vector3 } from 'three';
import House from './buildings/House/House';
import Lumberhut from './buildings/Lumberhut/Lumberhut';
import Outpost from './buildings/Outpost/Outpost';
import Farm from './buildings/Farm/Farm';
import StoneQuarry from './buildings/StoneQuarry/StoneQuarry';

type BuildingProps = {
  type: Buildings;
};

export enum Buildings {
  Outpost,
  Lumberhut,
  House,
  Farm,
  StoneQuarry,
}

const buildingPosition = new Vector3(0, 1.25, 0);

const getBuilding = (type: Buildings) => {
  switch (type) {
    case Buildings.Outpost:
      return <Outpost position={buildingPosition} />;
    case Buildings.Lumberhut:
      return <Lumberhut position={buildingPosition} />;
    case Buildings.House:
      return <House position={buildingPosition} />;
    case Buildings.Farm:
      return <Farm position={buildingPosition} />;
    case Buildings.StoneQuarry:
      return <StoneQuarry position={buildingPosition} />;
    default:
      return <mesh />;
  }
};

const BuildingComponent = ({ type }: BuildingProps) => <Suspense>{getBuilding(type)}</Suspense>;

export const Building = memo(BuildingComponent);
