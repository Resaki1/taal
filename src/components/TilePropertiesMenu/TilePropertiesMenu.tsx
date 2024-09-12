import { useStore } from '../../store/store';
import { useState } from 'react';
import './TilePropertiesMenu.scss';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../../hooks';
import { Vector3 } from 'three';

export const TilePropertiesMenu = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [locationTitle, setLocationTitle] = useState('');

  const selected = useStore((state) => state.selected);
  const modalRef = useClickOutside(() => setModalOpen(false));
  const setCamera = useStore((state) => state.setCamera);

  const locations = useStore((state) => state.locations);

  const saveLocation = useStore((state) => state.saveLocation);

  const handleAdd = (t: string, x: number, y: number) => {
    saveLocation(t, x, y);
    selected!.object.userData.update();
    setModalOpen(false);
    setLocationTitle('');
  };

  return (
    <>
      <button
        className="TilePropertiesMenu__button"
        disabled={!selected}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        📍
      </button>

      {modalOpen &&
        createPortal(
          <div className="TilePropertiesMenu__modal" ref={modalRef}>
            <input
              type="text"
              value={locationTitle}
              onChange={(e) => setLocationTitle(e.target.value)}
              placeholder="Enter location title"
              className="TilePropertiesMenu__input"
            />
            <button
              className="TilePropertiesMenu__modal-confirm"
              disabled={!selected || !locationTitle.trim()}
              onClick={() => {
                const { x, y } = selected!.object.position;
                handleAdd(locationTitle, x, y);
              }}
            >
              💾
            </button>

            <h3>Saved Locations</h3>

            <ul>
              {Object.entries(locations).map(([title, { positionX, positionY }]) => (
                <li key={title} className="TilePropertiesMenu__locations-item">
                  {title}: ({positionX.toFixed(2)}, {positionY.toFixed(2)})
                  <button
                    onClick={() => {
                      const newPosition = new Vector3(positionX, positionY, 10);
                      setCamera(newPosition as Vector3, new Vector3(positionX, positionY, 0) as Vector3);
                    }}
                    className="TilePropertiesMenu__locations-button"
                  >
                    ▶
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
};

export default TilePropertiesMenu;
