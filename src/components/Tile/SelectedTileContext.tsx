import { createContext, useContext, useRef, MutableRefObject, ReactNode } from 'react';
import { ColoredGroup } from './Tile';

type SelectedTileRefType = MutableRefObject<ColoredGroup | undefined> | undefined;

const SelectedTileRef = createContext<SelectedTileRefType>(undefined);

export const useSelectedTile = () => {
  return useContext(SelectedTileRef);
};

interface SelectedTileProviderProps {
  children: ReactNode;
}

export const SelectedTileProvider = ({ children }: SelectedTileProviderProps) => {
  const globalRef = useRef<any>(null);

  return <SelectedTileRef.Provider value={globalRef}>{children}</SelectedTileRef.Provider>;
};
