import { useStore } from '../../store/store';
import './RessourceMenu.scss';

export const RessourceMenu = () => {
  const ressources = useStore((state) => ({ ...state.ressources }));
  const buildingOutputs = useStore((state) => state.buildingOutputs);
  const reset = useStore((state) => state.reset);

  return (
    <div className="ressource-menu">
        <table>
          <tr>
            <th></th>
            <th>💵</th>
            <th>🪵</th>
            <th>🪨</th>
            <th>🍟</th>
            <th></th>
            <th>🧑‍🦱</th>
          </tr>
          <tr>
            <td>Per Minute</td>
            <td>{Math.round(buildingOutputs.gold * 6000) / 100}</td>
            <td>{Math.round(buildingOutputs.wood * 6000) / 100}</td>
            <td>{Math.round(buildingOutputs.stone * 6000) / 100}</td>
            <td>{Math.round(buildingOutputs.food * 6000) / 100}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td>{Math.floor(ressources.gold)} </td>
            <td>{Math.floor(ressources.wood)}</td>
            <td>{Math.floor(ressources.stone)}</td>
            <td>{Math.floor(ressources.food)}</td>
            <td></td>
            <td>{Math.floor(ressources.villager)}</td>
          </tr>
          <td colSpan="7">
         <button onClick={() => reset()}>Restart</button>
          </td>
        </table>
    </div>
  );
};

