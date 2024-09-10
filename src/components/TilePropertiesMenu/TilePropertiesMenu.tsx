import { useStore } from '../../store/store';
import './TilePropertiesMenu.scss';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../../hooks';
import { useState } from 'react';

export const TilePropertiesMenu = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const selected = useStore((state) => state.selected);
  const modalRef = useClickOutside(() => setModalOpen(false));

  const saveLocation = useStore((state) => state.saveLocation);

  const handleAdd = (t: string, x: number, y: number) => {
    saveLocation(t, x, y);
    selected!.object.userData.update();
    setModalOpen(false);
  };
  
  return (
    <>
      <button
        className={`TilePropertiesMenu__button ${success ? 'success' : ''}`}
        onClick={() => {
          setModalOpen(true);
        }}
        disabled={!selected}
      >
       📍 
      </button>
  
      {modalOpen &&
        createPortal(
          <div className="TilePropertiesMenu__modal" ref={modalRef}>
            <button
              className="TilePropertiesMenu__modal-confirm"
              disabled={!selected}
              onClick={() => {
                const { x, y } = selected!.object.position;
                handleAdd('test', x, y);
              }}
            >
            Save Location [{selected!.object.position.x.toFixed(2)}  {selected!.object.position.y.toFixed(2)}]
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};

export default TilePropertiesMenu;