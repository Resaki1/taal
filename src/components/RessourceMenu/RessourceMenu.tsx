import { useStore } from "../../store/store";
import "./RessourceMenu.scss";

export const RessourceMenu = () => {
  const ressources = useStore((state) => ({ ...state.ressources }));

  return (
    <div className="ressource-menu">
      <ul>
        <li>Wood: {ressources.wood}</li>
        <li>Stone: {ressources.stone}</li>
        <li>Coins: {ressources.gold}</li>
      </ul>
    </div>
  );
};
