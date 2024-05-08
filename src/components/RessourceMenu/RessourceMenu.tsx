import { useStore } from '../../store/store';

import './RessourceMenu.scss';



//const test = Math.floor(ressources.gold)

export const RessourceMenu = () => {
  const ressources = useStore((state) => ({ ...state.ressources }));
  const buildingOutputs = useStore((state) => state.buildingOutputs);
  const reset = useStore((state) => state.reset);


  const valueSmoothener: (m: number) => number = function (
    m): number {

    return (Math.round((m * 6000) / 100))
  }


  const remainingRessources: (v: number, t: number) => any = function (
    v: number,
    t: number,

  ): any {
    if (v < 0) {

      return (Math.ceil(t / (v * -1)) + "min")

    }

    return ("♾");
  };


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
          <td><b>Total</b></td>
          <td>{Math.floor(ressources.gold)} </td>
          <td>{Math.floor(ressources.wood)}</td>
          <td>{Math.floor(ressources.stone)}</td>
          <td>{Math.floor(ressources.food)}</td>
          <td></td>
          <td>{Math.floor(ressources.villager)}</td>
        </tr>
        <tr>
          <td><b>Remaining</b></td>
          <td>{remainingRessources(valueSmoothener(buildingOutputs.gold), Math.floor(ressources.gold))} </td>
          <td>{remainingRessources(valueSmoothener(buildingOutputs.wood), Math.floor(ressources.wood))}</td>
          <td>{remainingRessources(valueSmoothener(buildingOutputs.stone), Math.floor(ressources.stone))}</td>
          <td>{remainingRessources(valueSmoothener(buildingOutputs.food), Math.floor(ressources.food))}</td>
          <td></td>
          <td></td>
        </tr>
        <td colSpan="7">
          <button onClick={() => reset()}>Restart</button>
        </td>
      </table>
    </div>
  );
};

