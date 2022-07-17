import { useStore } from "../../store/store";
import "./BuildMenu.scss";

var classNames = require("classnames");

export const BuildMenu = () => {
  const selected = useStore((state) => state.selected);
  const addBuilding = useStore((state) => state.addBuilding);

  const handleAdd = () => {
    addBuilding(
      selected!.object.position.x,
      selected!.object.position.z,
      "test"
    );
    selected!.object.userData.update();
  };

  return (
    <div
      className={classNames({
        "build-menu": true,
        "build-menu--visible": selected,
      })}
    >
      {selected && <button onClick={() => handleAdd()}>add</button>}
    </div>
  );
};
