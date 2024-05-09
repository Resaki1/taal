import { useStore } from '../../store/store';

import './RessourceMenu.scss';

export const RessourceMenu = () => {
  const ressources = useStore((state) => ({ ...state.ressources }));
  const buildingOutputs = useStore((state) => state.buildingOutputs);
  const reset = useStore((state) => state.reset);

  const valueSmoothener = (buildingsOutputValue: number) => Math.round((buildingsOutputValue * 6000) / 100);

  const remainingRessources = (ressourcesPerMinute: number, totalRessources: number) => {
    if (ressourcesPerMinute < 0) {
      return Math.ceil(totalRessources / (ressourcesPerMinute * -1)) + 'min';
    }

    return '♾';
  };

  return (
    <div className="ressource-menu">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>💵</th>
            <th>🪵</th>
            <th>🪨</th>
            <th>🍟</th>
            <th></th>
            <th>🧑‍🦱</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <b>Total</b>
            </td>
            <td>
              <b>{Math.floor(ressources.gold)}</b> ({valueSmoothener(buildingOutputs.gold)})
            </td>
            <td>
              <b>{Math.floor(ressources.wood)}</b> ({valueSmoothener(buildingOutputs.wood)})
            </td>
            <td>
              <b>{Math.floor(ressources.stone)}</b> ({valueSmoothener(buildingOutputs.stone)})
            </td>
            <td>
              <b>{Math.floor(ressources.food)}</b> ({valueSmoothener(buildingOutputs.food)})
            </td>
            <td></td>
            <td>{Math.floor(ressources.villager)}</td>
          </tr>
          <tr>
            <td>
              <b>Remaining</b>
            </td>
            <td>{remainingRessources(valueSmoothener(buildingOutputs.gold), Math.floor(ressources.gold))} </td>
            <td>{remainingRessources(valueSmoothener(buildingOutputs.wood), Math.floor(ressources.wood))}</td>
            <td>{remainingRessources(valueSmoothener(buildingOutputs.stone), Math.floor(ressources.stone))}</td>
            <td>{remainingRessources(valueSmoothener(buildingOutputs.food), Math.floor(ressources.food))}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7}>
              <button onClick={() => reset()}>Restart</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
