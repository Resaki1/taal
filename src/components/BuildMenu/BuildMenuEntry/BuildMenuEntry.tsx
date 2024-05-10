import { useState } from 'react';
import { BuildingType } from '../../Building/Building';
import { Building } from '../../Building/buildings';

import './BuildMenuEntry.scss';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../../../hooks';

type BuildMenuEntryProps = {
  building?: Building;
  handleAdd?: (building: BuildingType) => void;
  handleDelete?: () => void;
  hasEnoughRessources: (building: BuildingType) => boolean;
};

const BuildingMenuEntry = ({ building, handleAdd, handleDelete, hasEnoughRessources }: BuildMenuEntryProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const modalRef = useClickOutside(() => setModalOpen(false));

  return building && handleAdd ? (
    <>
      <button
        className="building-menu__entry"
        onClick={() => setModalOpen(true)}
        disabled={!hasEnoughRessources(building.type)}
      >
        <figure className="building-menu__entry-icon">{building.icon}</figure>
        {building.name}
      </button>
      {modalOpen &&
        createPortal(
          <div className="building-menu__modal" ref={modalRef}>
            <h2>
              <figure>{building.icon}</figure>
              {building.name}
            </h2>
            <ul>
              {Object.entries(building.costs).map((cost) => (
                <li key={cost[0]}>
                  <span>{cost[0]}:</span> <span>{cost[1] * -1}</span>
                </li>
              ))}
            </ul>
            <button
              className="building-menu__modal-accept"
              onClick={() => {
                handleAdd(building.type);
                setModalOpen(false);
              }}
            >
              build
            </button>
            <button className="building-menu__modal-close" onClick={() => setModalOpen(false)}>
              close
            </button>
          </div>,
          document.body,
        )}
    </>
  ) : (
    <button className="building-menu__entry" onClick={handleDelete}>
      <figure className="building-menu__entry-icon">❌</figure>
      remove building
    </button>
  );
};

export default BuildingMenuEntry;
