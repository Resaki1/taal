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
    buildingToRemove && (
      <>
        <button className="building-menu__entry" onClick={() => setModalOpen(true)}>
          <figure className="building-menu__entry-icon">❌</figure>
          remove building
        </button>
        {modalOpen &&
          createPortal(
            <div className="building-menu__modal" ref={modalRef}>
              <h2>remove {buildingToRemove.name}?</h2>
              <p>
                Are you sure you want to remove this {buildingToRemove.name}? You will be refunded {SELLFACTOR * 100}%
                of the building costs.
              </p>
              <button
                className="building-menu__modal-accept"
                onClick={() => {
                  handleDelete && handleDelete();
                  setModalOpen(false);
                }}
              >
                remove
              </button>
              <button className="building-menu__modal-close" onClick={() => setModalOpen(false)}>
                close
              </button>
            </div>,
            document.body,
          )}
      </>
    )
  );
};

export default BuildingMenuEntry;
