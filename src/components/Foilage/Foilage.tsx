import { Suspense } from "react";
import { Vector3 } from "three";
import { getTerrainType, Terrain } from "../../helpers/terrain";
import TreeBirch from "./foilage/TreeBirch";

interface FoilageProps {
  position: Vector3;
}

export const Foilage = ({ position }: FoilageProps) => {
  const getFoilage = () => {
    const type = getTerrainType(position.x, position.z);

    switch (type) {
      case Terrain.FOREST:
        return <TreeBirch position={position} />;
      default:
        return <></>;
    }
  };
  return <Suspense>{getFoilage()}</Suspense>;
};
