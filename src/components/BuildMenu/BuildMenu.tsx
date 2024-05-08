import { getTerrainType, Terrain } from '../../helpers/terrain';
import { Ressources, useStore } from '../../store/store';
import { BuildingType } from '../Building/Building';
import classNames from 'classnames';
import './BuildMenu.scss';
import { BuildingCosts } from '../Building/buildingFinancials';
import { getPossibleBuildingsForTerrain } from '../Building/buildings';

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

  const handleAdd = (building: BuildingType) => {
    addBuilding(selected!.object.position.x, selected!.object.position.z, building);
    selected!.object.userData.update();
  };

  const handleDelete = () => {
    removeBuilding(selected!.object.position.x, selected!.object.position.z);
    selected!.object.userData.update();
  };

  const getPossibleBuildingType = () => {
    const position = selected?.object?.position;
    if (!position) return;

    const terrain = getTerrainType(position.x, position.z);
    const isUnlocked = unlocked[position.x] && unlocked[position.x][position.z];

    if (Object.keys(unlocked).length === 0) {
      if (terrain !== Terrain.WATER && terrain !== Terrain.MOUNTAIN) {
        return [{ type: BuildingType.Outpost, name: 'Outpost' }];
      }
    } else if (isUnlocked) {
      return getPossibleBuildingsForTerrain(terrain);
    }
  };

  const hasEnoughRessources = (building: BuildingType) => {
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
        getPossibleBuildingType()?.map((building) => (
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
