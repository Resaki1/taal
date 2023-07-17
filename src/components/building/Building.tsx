import { Suspense, memo } from 'react';
import { Vector3 } from 'three';
import House from './buildings/House/House';
import Lumberhut from './buildings/Lumberhut/Lumberhut';
import Outpost from './buildings/Outpost/Outpost';

type BuildingProps = {
  type: Buildings;
};

export enum Buildings {
  Outpost,
  Lumberhut,
  House,
}

const buildingPosition = new Vector3(0, 0.75, 0);

const getBuilding = (type: Buildings) => {
  switch (type) {
    case Buildings.Outpost:
      return <Outpost position={buildingPosition} />;
    case Buildings.Lumberhut:
      return <Lumberhut position={buildingPosition} />;
    case Buildings.House:
      return <House position={buildingPosition} />;
    default:
      return <mesh />;
  }
};

const BuildingComponent = ({ type }: BuildingProps) => <Suspense>{getBuilding(type)}</Suspense>;

export const Building = memo(BuildingComponent);
