import { useState } from 'react';
import { BuildingType } from '../../Building/Building';
import { Building, getBuildingByType } from '../../Building/buildings';

import './BuildMenuEntry.scss';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../../../hooks';
import { SELLFACTOR } from '../../Building/buildingFinancials';

type BuildMenuEntryProps = {
  building?: Building;
  buildingTypeToRemove?: BuildingType;
  handleAdd?: (building: BuildingType) => void;
  handleDelete?: () => void;
  hasEnoughRessources: (building: BuildingType) => boolean;
};

const BuildingMenuEntry = ({
  building,
  buildingTypeToRemove,
  handleAdd,
  handleDelete,
  hasEnoughRessources,
}: BuildMenuEntryProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useClickOutside(() => setModalOpen(false));

  const buildingToRemove = buildingTypeToRemove !== undefined ? getBuildingByType(buildingTypeToRemove) : undefined;

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
            <p>{building.description}</p>
            <h3>Costs to build:</h3>
            <ul>
              {Object.entries(building.costs).map(([key, value]) => (
                <li key={key}>
                  <span className="value-symbol">{value.emoji}</span>{' '}
                  <span className="value-amount">{value.amount * -1}</span>
                </li>
              ))}
            </ul>
            <button
              className="building-menu__modal-accept"
              disabled={!hasEnoughRessources(building.type)}
              onClick={() => {
                handleAdd(building.type);
                setModalOpen(false);
              }}
            >
              🔨
            </button>
            <button className="building-menu__modal-close" onClick={() => setModalOpen(false)}>
              ⭕
            </button>
          </div>,
          document.body,
        )}
    </>
  ) : (
    buildingToRemove && (
      <>
        <button className="building-menu__entry" onClick={() => setModalOpen(true)}>
          <figure className="building-menu__entry-icon">💥</figure>
          Dismantle
        </button>
        {modalOpen &&
          createPortal(
            <div className="building-menu__modal" ref={modalRef}>
              <h2>Delete {buildingToRemove.name}?</h2>
              <p>
                Do you wish to dismantle the {buildingToRemove.name}? You will reclaim {SELLFACTOR * 100}% of its
                resources.
              </p>
              <button
                className="building-menu__modal-accept-delete"
                onClick={() => {
                  handleDelete && handleDelete();
                  setModalOpen(false);
                }}
              >💲</button>
              <button className="building-menu__modal-close" onClick={() => setModalOpen(false)}>
                ⭕
              </button>
            </div>,
            document.body,
          )}
      </>
    )
  );
};

export default BuildingMenuEntry;
