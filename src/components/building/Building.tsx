import { Suspense, memo } from 'react';
import { Vector3 } from 'three';
import House from './buildings/House/House';
import Lumberhut from './buildings/Lumberhut/Lumberhut';
import Outpost from './buildings/Outpost/Outpost';
import CornField from './buildings/CornField/CornField';
import StoneQuarry from './buildings/StoneQuarry/StoneQuarry';

export enum BuildingType {
  Outpost,
  Lumberhut,
  House,
  CornField,
  StoneQuarry,
}

type Building = {
  type: BuildingType;
  name: string;
  icon: string;
};

type BuildingProps = {
  type: BuildingType;
};
const buildingPosition = new Vector3(0, 1.25, 0);

const getBuilding = (type: BuildingType) => {
  switch (type) {
    case BuildingType.Outpost:
      return <Outpost position={buildingPosition} />;
    case BuildingType.Lumberhut:
      return <Lumberhut position={buildingPosition} />;
    case BuildingType.House:
      return <House position={buildingPosition} />;
    case BuildingType.CornField:
      return <CornField position={buildingPosition} />;
    case BuildingType.StoneQuarry:
      return <StoneQuarry position={buildingPosition} />;
    default:
      return <mesh />;
  }
};

const BuildingComponent = ({ type }: BuildingProps) => <Suspense>{getBuilding(type)}</Suspense>;

export const Building = memo(BuildingComponent);
