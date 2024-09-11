import { useStore } from '../../store/store';
import classNames from 'classnames';
import './RessourceMenu.scss';

export const RessourceMenu = () => {
  const ressources = useStore((state) => ({ ...state.ressources }));
  const buildingOutputs = useStore((state) => state.buildingOutputs);
  const selected = useStore((state) => state.selected);
  const reset = useStore((state) => state.reset);

  const valueSmoothener = (buildingsOutputValue: number) => Math.round((buildingsOutputValue * 6000) / 100);

  const remainingRessources = (ressourcesPerMinute: number, totalRessources: number) => {
    if (ressourcesPerMinute < 0) {
      return Math.ceil(totalRessources / (ressourcesPerMinute * -1)) + 'min';
    }

    return '♾';
  };

  return (
    <div
      className={classNames({
        'ressource-menu': true,
        'ressource-menu-extended': selected,
      })}
    >
      <table>
        <thead>
          <tr>
            <th></th>
            <th title="Gold for buying">💰</th>
            <th title="Wood from your Lumberhut">🪵</th>
            <th title="Stones produced by Quarry">🪨</th>
            <th title="Food for you villagers">🍟</th>
            <th title="Amazing villagers">🧑‍🦱</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="key-column">
              <b>∑</b>
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
            <td>
              <b>{Math.floor(ressources.villager)}</b>
            </td>
          </tr>
          <>
            {selected && (
              <tr className="ressource-menu-extended-items">
                <td>
                  <b>⏳</b>
                </td>
                <td>{remainingRessources(valueSmoothener(buildingOutputs.gold), Math.floor(ressources.gold))} </td>
                <td>{remainingRessources(valueSmoothener(buildingOutputs.wood), Math.floor(ressources.wood))}</td>
                <td>{remainingRessources(valueSmoothener(buildingOutputs.stone), Math.floor(ressources.stone))}</td>
                <td>{remainingRessources(valueSmoothener(buildingOutputs.food), Math.floor(ressources.food))}</td>
                <td></td>
              </tr>
            )}
          </>
        </tbody>
      </table>
      {selected && (
        <tfoot>
          <tr>
            <td colSpan={7}>
              <button onClick={() => reset()}>Restart</button>
            </td>
          </tr>
        </tfoot>
      )}
    </div>
  );
};
