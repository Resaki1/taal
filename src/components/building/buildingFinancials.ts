import { Ressources } from '../../store/store';
import { BuildingType } from './Building';
import { getCostsOfBuilding } from './buildings';

type BuildingRessourcesType = {
  [key in BuildingType]: Partial<{
    [key in Ressources]: number;
  }>;
};

export const SELLFACTOR = 0.5;
export const BuildingSellBenefits: BuildingRessourcesType = {
  [BuildingType.Outpost]: {
    wood: Math.ceil(getCostsOfBuilding(BuildingType.Outpost).wood! * SELLFACTOR),
    gold: Math.ceil(getCostsOfBuilding(BuildingType.Outpost).gold! * SELLFACTOR),
  },
  [BuildingType.Lumberhut]: {
    wood: Math.ceil(getCostsOfBuilding(BuildingType.Lumberhut).wood! * SELLFACTOR),
    gold: Math.ceil(getCostsOfBuilding(BuildingType.Lumberhut).gold! * SELLFACTOR),
    villager: getCostsOfBuilding(BuildingType.Lumberhut).villager!,
  },
  [BuildingType.House]: {
    wood: Math.ceil(getCostsOfBuilding(BuildingType.House).wood! * SELLFACTOR),
    gold: Math.ceil(getCostsOfBuilding(BuildingType.House).gold! * SELLFACTOR),
    villager: getCostsOfBuilding(BuildingType.House).villager!,
  },
  [BuildingType.CornField]: {
    gold: Math.ceil(getCostsOfBuilding(BuildingType.House).gold! * SELLFACTOR),
  },
  [BuildingType.StoneQuarry]: {
    wood: Math.ceil(getCostsOfBuilding(BuildingType.House).wood! * SELLFACTOR),
    gold: Math.ceil(getCostsOfBuilding(BuildingType.House).gold! * SELLFACTOR),
    villager: getCostsOfBuilding(BuildingType.House).villager!,
  },
};
