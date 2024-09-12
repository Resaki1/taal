import { Ressources } from '../../store/store';
import { BuildingType } from './Building';
import { getCostsOfBuilding } from './buildings';

type BuildingRessourcesType = {
  [key in BuildingType]: Partial<{
    [key in Ressources]: number;
  }>;
};

export const SELLFACTOR = 0.5;

const extractAmount = (cost: { amount: number; emoji: string } | undefined) => cost ? Math.ceil(cost.amount * SELLFACTOR) : 0;

export const BuildingSellBenefits: BuildingRessourcesType = {
  [BuildingType.Outpost]: {
    wood: extractAmount(getCostsOfBuilding(BuildingType.Outpost).wood),
    gold: extractAmount(getCostsOfBuilding(BuildingType.Outpost).gold),
  },
  [BuildingType.Lumberhut]: {
    wood: extractAmount(getCostsOfBuilding(BuildingType.Lumberhut).wood),
    gold: extractAmount(getCostsOfBuilding(BuildingType.Lumberhut).gold),
    villager: getCostsOfBuilding(BuildingType.Lumberhut).villager?.amount!,
  },
  [BuildingType.House]: {
    wood: extractAmount(getCostsOfBuilding(BuildingType.House).wood),
    gold: extractAmount(getCostsOfBuilding(BuildingType.House).gold),
    villager: getCostsOfBuilding(BuildingType.House).villager?.amount!,
  },
  [BuildingType.CornField]: {
    gold: extractAmount(getCostsOfBuilding(BuildingType.CornField).gold),
  },
  [BuildingType.StoneQuarry]: {
    wood: extractAmount(getCostsOfBuilding(BuildingType.StoneQuarry).wood),
    gold: extractAmount(getCostsOfBuilding(BuildingType.StoneQuarry).gold),
    villager: getCostsOfBuilding(BuildingType.StoneQuarry).villager?.amount!,
  },
};