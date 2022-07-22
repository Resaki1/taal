import { getTerrainType, Terrain } from "../../helpers/terrain";
import { useStore } from "../../store/store";
import { Buildings } from "../Building/Building";
import "./BuildMenu.scss";

var classNames = require("classnames");

export const BuildMenu = () => {
  const selected = useStore((state) => state.selected);
  const buildings = useStore((state) => state.buildings);
  const addBuilding = useStore((state) => state.addBuilding);
  const removeBuilding = useStore((state) => state.removeBuilding);

  const hasBuilding =
    selected &&
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
    const type = getTerrainType(
      selected!.object.position.x,
      selected!.object.position.z
    );

    if (type === Terrain.BEACH)
      return [{ type: Buildings.Outpost, name: "Outpost" }];
    if (type === Terrain.MEADOW)
      return [{ type: Buildings.Outpost, name: "Outpost" }];
    if (Terrain.FOREST)
      return [
        { type: Buildings.Outpost, name: "Outpost" },
        { type: Buildings.Lumberhut, name: "Lumberhut" },
      ];
    else return [];
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
        getPossibleBuildings().map((building) => (
          <button key={building.type} onClick={() => handleAdd(building.type)}>
            {building.name}
          </button>
        ))}
      {hasBuilding && <button onClick={() => handleDelete()}>delete</button>}
    </div>
  );
};
