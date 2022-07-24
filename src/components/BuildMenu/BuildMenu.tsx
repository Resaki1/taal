import { getTerrainType, Terrain } from "../../helpers/terrain";
import { Ressources, useStore } from "../../store/store";
import { BuildingCosts, Buildings } from "../Building/Building";
import "./BuildMenu.scss";

var classNames = require("classnames");

export const BuildMenu = () => {
  const selected = useStore((state) => state.selected);
  const buildings = useStore((state) => state.buildings);
  const ressources = useStore((state) => ({ ...state.ressources }));
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
    if (selected && selected.object?.position) {
      const type = getTerrainType(
        selected.object.position.x,
        selected.object.position.z
      );

      if (type === Terrain.BEACH)
        return [
          { type: Buildings.Outpost, name: "Outpost" },
          { type: Buildings.House, name: "House" },
        ];
      if (type === Terrain.MEADOW)
        return [
          { type: Buildings.Outpost, name: "Outpost" },
          { type: Buildings.House, name: "House" },
        ];
      if (Terrain.FOREST)
        return [
          { type: Buildings.Outpost, name: "Outpost" },
          { type: Buildings.Lumberhut, name: "Lumberhut" },
          { type: Buildings.House, name: "House" },
        ];
    } else return [];
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
