import { getTerrainType, Terrain } from "../../helpers/terrain";
import { Ressources, useStore } from "../../store/store";
import { BuildingCosts, Buildings } from "../Building/Building";
import "./BuildMenu.scss";

var classNames = require("classnames");

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
    buildings[selected.object.position.x] !== undefined &&
    buildings[selected.object.position.x][selected.object.position.z] !==
      undefined;

  const handleAdd = (building: Buildings) => {
    addBuilding(
      selected!.object.position.x,
      selected!.object.position.z,
      building
    );
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
      const isUnlocked =
        unlocked[position.x] && unlocked[position.x][position.z];

      const possibleBuildings: any[] = [];

      if (Object.keys(unlocked).length === 0) {
        if (type !== Terrain.WATER && type !== Terrain.MOUNTAIN) {
          return [{ type: Buildings.Outpost, name: "Outpost" }];
        } else return [];
      } else if (!isUnlocked) return [];
      else {
        if (type === Terrain.BEACH)
          possibleBuildings.push(
            { type: Buildings.Outpost, name: "Outpost" },
            { type: Buildings.House, name: "House" }
          );
        if (type === Terrain.MEADOW)
          possibleBuildings.push(
            { type: Buildings.Outpost, name: "Outpost" },
            { type: Buildings.House, name: "House" }
          );
        if (type === Terrain.FOREST)
          possibleBuildings.push(
            { type: Buildings.Outpost, name: "Outpost" },
            { type: Buildings.House, name: "House" },
            { type: Buildings.Lumberhut, name: "Lumberhut" }
          );
      }
      return possibleBuildings;
    }
  };

  const hasEnoughRessources = (building: Buildings) => {
    const recipe = BuildingCosts[building];
    let hasEnough = true;
    Object.entries(recipe).forEach((cost) => {
      if (ressources[cost[0] as Ressources] < recipe[cost[0] as Ressources]!)
        hasEnough = false;
    });
    return hasEnough;
  };

  return (
    <div
      className={classNames({
        "build-menu": true,
        "build-menu--visible": selected,
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
