import { Ressources } from '../../store/store';
import { BuildingType } from './Building';

type BuildingRessourcesType = {
  [key in BuildingType]: Partial<{
    [key in Ressources]: number;
  }>;
};

export const BuildingCosts: BuildingRessourcesType = {
  [BuildingType.Outpost]: {
    wood: 10,
    gold: 600,
  },
  [BuildingType.Lumberhut]: {
    wood: 2,
    gold: 10,
    villager: 1,
  },
  [BuildingType.House]: {
    wood: 6,
    gold: 100,
    villager: -4,
  },
  [BuildingType.CornField]: {
    gold: 30,
  },
  [BuildingType.StoneQuarry]: {
    wood: 6,
    gold: 40,
    villager: 4,
  },
};

const SELLFACTOR = 0.5;
export const BuildingSellBenefits: BuildingRessourcesType = {
  [BuildingType.Outpost]: {
    wood: Math.ceil(BuildingCosts[BuildingType.Outpost].wood! * SELLFACTOR),
    gold: Math.ceil(BuildingCosts[BuildingType.Outpost].gold! * SELLFACTOR),
  },
  [BuildingType.Lumberhut]: {
    wood: Math.ceil(BuildingCosts[BuildingType.Lumberhut].wood! * SELLFACTOR),
    gold: Math.ceil(BuildingCosts[BuildingType.Lumberhut].gold! * SELLFACTOR),
    villager: BuildingCosts[BuildingType.Lumberhut].villager!,
  },
  [BuildingType.House]: {
    wood: Math.ceil(BuildingCosts[BuildingType.House].wood! * SELLFACTOR),
    gold: Math.ceil(BuildingCosts[BuildingType.House].gold! * SELLFACTOR),
    villager: BuildingCosts[BuildingType.House].villager!,
  },
  [BuildingType.CornField]: {
    gold: Math.ceil(BuildingCosts[BuildingType.House].gold! * SELLFACTOR),
  },
  [BuildingType.StoneQuarry]: {
    wood: Math.ceil(BuildingCosts[BuildingType.House].wood! * SELLFACTOR),
    gold: Math.ceil(BuildingCosts[BuildingType.House].gold! * SELLFACTOR),
    villager: BuildingCosts[BuildingType.House].villager!,
  },
};

// use negative values for costs (i.e. output 'gold: -10 / 60' means the building costs 10 gold per minute)
export const BuildingOutputs: BuildingRessourcesType = {
  [BuildingType.Outpost]: {
    gold: -20 / 60,
  },
  [BuildingType.Lumberhut]: {
    wood: 2 / 60,
    gold: -6 / 60,
  },
  [BuildingType.House]: {
    gold: 12 / 60,
    food: -1 / 60,
  },
  [BuildingType.CornField]: {
    gold: -8 / 60,
    food: 4 / 60,
  },
  [BuildingType.StoneQuarry]: {
    gold: -12 / 60,
    stone: 2 / 60,
  },
};
