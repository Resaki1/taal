import { useStore } from "../../store/store";
import "./RessourceMenu.scss";

export const RessourceMenu = () => {
  const ressources = useStore((state) => ({ ...state.ressources }));
  const buildingOutputs = useStore((state) => state.buildingOutputs);
  const reset = useStore((state) => state.reset);

  return (
    <div className="ressource-menu">
      <ul>
        <li>
          Gold: {Math.floor(ressources.gold)} |
          {Math.round(buildingOutputs.gold * 6000) / 100}/min
        </li>
        <li>
          Wood: {Math.floor(ressources.wood)} |
          {Math.round(buildingOutputs.wood * 6000) / 100}/min
        </li>
        <li>
          Stone: {Math.floor(ressources.stone)} |
          {Math.round(buildingOutputs.stone * 6000) / 100}/min
        </li>
        <li>Villagers: {Math.floor(ressources.villager)}</li>
        <li>
          <button onClick={() => reset()}>reset</button>
        </li>
      </ul>
    </div>
  );
};
