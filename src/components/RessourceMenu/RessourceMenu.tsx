import { useStore } from "../../store/store";
import "./RessourceMenu.scss";

export const RessourceMenu = () => {
  const ressources = useStore((state) => ({ ...state.ressources }));
  const reset = useStore((state) => state.reset);

  return (
    <div className="ressource-menu">
      <ul>
        <li>
          <button onClick={() => reset()}>reset</button>
        </li>
        <li>Coins: {Math.floor(ressources.gold)}</li>
        <li>Wood: {Math.floor(ressources.wood)}</li>
        <li>Stone: {Math.floor(ressources.stone)}</li>
        <li>Villagers: {Math.floor(ressources.villager)}</li>
      </ul>
    </div>
  );
};
