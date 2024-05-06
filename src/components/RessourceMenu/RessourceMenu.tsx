import { useStore } from '../../store/store';
import './RessourceMenu.scss';

export const RessourceMenu = () => {
  const ressources = useStore((state) => ({ ...state.ressources }));
  const buildingOutputs = useStore((state) => state.buildingOutputs);
  const reset = useStore((state) => state.reset);

  return (
    <div className="ressource-menu">
      <ul>
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
            <td>Total</td>
            <td>{Math.floor(ressources.gold)} </td>
            <td>{Math.floor(ressources.wood)}</td>
            <td>{Math.floor(ressources.stone)}</td>
            <td>{Math.floor(ressources.food)}</td>
            <td></td>
            <td>{Math.floor(ressources.villager)}</td>
          </tr>
          <tr>
            <td>Every Minute</td>
            <td>{Math.round(buildingOutputs.gold * 6000) / 100}</td>
            <td>{Math.round(buildingOutputs.wood * 6000) / 100}</td>
            <td>{Math.round(buildingOutputs.stone * 6000) / 100}</td>
            <td>{Math.round(buildingOutputs.food * 6000) / 100}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <button onClick={() => reset()}>Restart</button>
          </tr>
        </table>
      </ul>
    </div>
  );
};

