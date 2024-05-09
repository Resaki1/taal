import { BuildingType } from '../../Building/Building';
import { Building } from '../../Building/buildings';

import './BuildMenuEntry.scss';

type BuildMenuEntryProps = {
  building?: Building;
  handleAdd?: (building: BuildingType) => void;
  handleDelete?: () => void;
  hasEnoughRessources: (building: BuildingType) => boolean;
};

const BuildingMenuEntry = ({ building, handleAdd, handleDelete, hasEnoughRessources }: BuildMenuEntryProps) => {
  return building && handleAdd ? (
    <button
      className="building-menu__entry"
      onClick={() => handleAdd(building.type)}
      disabled={!hasEnoughRessources(building.type)}
    >
      <figure className="building-menu__entry-icon">{building.icon}</figure>
      {building.name}
    </button>
  ) : (
    <button className="building-menu__entry" onClick={handleDelete}>
      <figure className="building-menu__entry-icon">❌</figure>
      remove building
    </button>
  );
};

export default BuildingMenuEntry;
