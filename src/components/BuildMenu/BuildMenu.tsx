import { getTerrainType, Terrain } from '../../helpers/terrain';
import { Ressources, useStore } from '../../store/store';
import { Buildings } from '../Building/Building';
import classNames from 'classnames';
import './BuildMenu.scss';
import { BuildingCosts } from '../Building/buildingFinancials';

type BuildMenuBuilding = {
  type: Buildings;
  name: string;
};

export const BuildMenu = () => {
  const selected = useStore((state) => state.selected);
  const buildings = useStore((state) => state.buildings);
  const ressources = useStore((state) => ({ ...state.ressources }));
  const unlocked = useStore((state) => state.unlocked);
  const addBuilding = useStore((state) => state.addBuilding);
  const removeBuilding = useStore((state) => state.removeBuilding);

  const hasBuilding =
    selected &&
    selected.object?.position &&
    buildings[selected.object.position.x]?.[selected.object.position.z] !== undefined;

  const handleAdd = (building: Buildings) => {
    addBuilding(selected!.object.position.x, selected!.object.position.z, building);
    selected!.object.userData.update();
  };

  const handleDelete = () => {
    removeBuilding(selected!.object.position.x, selected!.object.position.z);
    selected!.object.userData.update();
  };

  const getPossibleBuildings = () => {
    const position = selected?.object?.position;
    if (position) {
      const type = getTerrainType(position.x, position.z);
      const isUnlocked = unlocked[position.x] && unlocked[position.x][position.z];

      const possibleBuildings: BuildMenuBuilding[] = [];

      if (Object.keys(unlocked).length === 0) {
        if (type !== Terrain.WATER && type !== Terrain.MOUNTAIN) {
          return [{ type: Buildings.Outpost, name: 'Outpost' }];
        } else return [];
      } else if (!isUnlocked) return [];
      else {
        switch (type) {
          case Terrain.BEACH:
            possibleBuildings.push(
              { type: Buildings.Outpost, name: 'Outpost' },
              { type: Buildings.House, name: 'House' },
            );
            break;
          case Terrain.MEADOW:
            possibleBuildings.push(
              { type: Buildings.Outpost, name: 'Outpost' },
              { type: Buildings.House, name: 'House' },
              { type: Buildings.CornField, name: 'CornField' },
            );
            break;
          case Terrain.FOREST:
            possibleBuildings.push(
              { type: Buildings.Outpost, name: 'Outpost' },
              { type: Buildings.House, name: 'House' },
              { type: Buildings.Lumberhut, name: 'Lumberhut' },
            );
            break;
          case Terrain.MOUNTAIN:
            possibleBuildings.push({ type: Buildings.StoneQuarry, name: 'Quarry' });
            break;
        }
      }
      return possibleBuildings;
    }
  };

  const hasEnoughRessources = (building: Buildings) => {
    const recipe = BuildingCosts[building];
    let hasEnough = true;
    Object.entries(recipe).forEach((cost) => {
      if (ressources[cost[0] as Ressources] < recipe[cost[0] as Ressources]!) hasEnough = false;
    });
    return hasEnough;
  };

  return (
    <div
      className={classNames({
        'build-menu': true,
        'build-menu--visible': selected,
      })}
    >
      {selected &&
        !hasBuilding &&
        getPossibleBuildings()?.map((building) => (
          <button
            key={building.type}
            onClick={() => handleAdd(building.type)}
            disabled={!hasEnoughRessources(building.type)}
          >
            {building.name}
          </button>
        ))}
      {hasBuilding && <button onClick={() => handleDelete()}>delete</button>}
    </div>
  );
};
