import { useStore } from "../../store/store";
import "./BuildMenu.scss";

var classNames = require("classnames");

export const BuildMenu = () => {
  const selected = useStore((state) => state.selected);
  const buildings = useStore((state) => state.buildings);
  const addBuilding = useStore((state) => state.addBuilding);
  const removeBuilding = useStore((state) => state.removeBuilding);

  const hasBuilding =
    selected &&
    buildings[selected.object.position.x] &&
    buildings[selected.object.position.x][selected.object.position.z];

  const handleAdd = () => {
    addBuilding(
      selected!.object.position.x,
      selected!.object.position.z,
      "test"
    );
    selected!.object.userData.update();
  };

  const handleDelete = () => {
    removeBuilding(selected!.object.position.x, selected!.object.position.z);
    selected!.object.userData.update();
  };

  return (
    <div
      className={classNames({
        "build-menu": true,
        "build-menu--visible": selected,
      })}
    >
      {selected && !hasBuilding && (
        <button onClick={() => handleAdd()}>add</button>
      )}
      {hasBuilding && <button onClick={() => handleDelete()}>delete</button>}
    </div>
  );
};
