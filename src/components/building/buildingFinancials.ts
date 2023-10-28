import { Ressources } from '../../store/store';
import { Buildings } from './Building';

type BuildingRessourcesType = {
  [key in Buildings]: Partial<{
    [key in Ressources]: number;
  }>;
};

export const BuildingCosts: BuildingRessourcesType = {
  [Buildings.Outpost]: {
    wood: 10,
    gold: 600,
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
  [Buildings.CornField]: {
    gold: 30,
  },
  [Buildings.StoneQuarry]: {
    wood: 6,
    gold: 40,
    villager: 4,
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
  [Buildings.CornField]: {
    gold: Math.ceil(BuildingCosts[Buildings.House].gold! * SELLFACTOR),
  },
  [Buildings.StoneQuarry]: {
    wood: Math.ceil(BuildingCosts[Buildings.House].wood! * SELLFACTOR),
    gold: Math.ceil(BuildingCosts[Buildings.House].gold! * SELLFACTOR),
    villager: BuildingCosts[Buildings.House].villager!,
  },
};

// use negative values for costs (i.e. output 'gold: -10 / 60' means the building costs 10 gold per minute)
export const BuildingOutputs: BuildingRessourcesType = {
  [Buildings.Outpost]: {
    gold: -20 / 60,
  },
  [Buildings.Lumberhut]: {
    wood: 2 / 60,
    gold: -6 / 60,
  },
  [Buildings.House]: {
    gold: 6 / 60,
    food: -1 / 60,
  },
  [Buildings.CornField]: {
    gold: -8 / 60,
    food: 4 / 60,
  },
  [Buildings.StoneQuarry]: {
    gold: -12 / 60,
    stone: 2 / 60,
  },
};
