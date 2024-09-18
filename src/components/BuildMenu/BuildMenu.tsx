import { getTerrainType, Terrain } from '../../helpers/terrain';
import { Ressources, useStore } from '../../store/store';
import { BuildingType } from '../Building/Building';
import classNames from 'classnames';
import './BuildMenu.scss';
import { allBuildings, getCostsOfBuilding, getPossibleBuildingsForTerrain } from '../Building/buildings';
import BuildingMenuEntry from './BuildMenuEntry/BuildMenuEntry';

export const BuildMenu = () => {
  const selected = useStore((state) => state.selected);
  const buildings = useStore((state) => state.buildings);
  const ressources = useStore((state) => ({ ...state.ressources }));
  const unlocked = useStore((state) => state.unlocked);
  const addBuilding = useStore((state) => state.addBuilding);
  const removeBuilding = useStore((state) => state.removeBuilding);

  const existingBuilding =
    selected && selected.object?.position
      ? buildings[selected.object.position.x]?.[selected.object.position.z]
      : undefined;

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
    if (!position) return [];

    const terrain = getTerrainType(position.y);
    const isUnlocked = unlocked[position.x] && unlocked[position.x][position.z];

    if (Object.keys(unlocked).length === 0) {
      if (terrain !== Terrain.WATER && terrain !== Terrain.MOUNTAIN) {
        return [allBuildings.find((building) => building.type === BuildingType.Outpost)];
      }
    } else if (isUnlocked) {
      return getPossibleBuildingsForTerrain(terrain);
    }

    return [];
  };

  const hasEnoughRessources = (building: BuildingType) => {
    const recipe = getCostsOfBuilding(building);
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
      {selected && existingBuilding === undefined ? (
        getPossibleBuildingType()?.map(
          (building) =>
            building && (
              <BuildingMenuEntry
                key={building.type}
                building={building}
                handleAdd={handleAdd}
                hasEnoughRessources={hasEnoughRessources}
              />
            ),
        )
      ) : (
        <BuildingMenuEntry
          handleDelete={handleDelete}
          buildingTypeToRemove={existingBuilding}
          hasEnoughRessources={hasEnoughRessources}
        />
      )}
    </div>
  );
};
