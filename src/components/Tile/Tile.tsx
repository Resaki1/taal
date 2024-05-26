import { Instance } from '@react-three/drei';
import { ThreeEvent, invalidate, useFrame } from '@react-three/fiber';
import { memo, startTransition, Suspense, useRef, useState } from 'react';
import { useStore } from '../../store/store';
import { Building } from '../Building/Building';
import { Color, Group } from 'three';
import { getTerrainHeight } from '../../helpers/terrain';
import { useSelectedTile } from './SelectedTileContext';

export interface ColoredGroup extends Group {
  color: Color;
}

const lightGray = new Color(0xa0a0a0);
const grayScale = new Color('hsla(62, 0%, 20%)');
const noColor = new Color();

const TileComponent = () => {
  const ref = useRef<ColoredGroup>(null!);

  const globalSelected = useSelectedTile();

  const [, setValue] = useState(0);

  const forceUpdate = () => setValue((value) => value + 1);

  const buildings = useStore((state) => state.buildings);
  const unlocked = useStore((state) => state.unlocked);
  const setGlobalSelected = useStore((state) => state.setSelected);

  const hasBuilding =
    ref?.current &&
    buildings[ref.current.position.x] &&
    buildings[ref.current.position.x][ref.current.position.z] !== undefined;

  let x: number;
  let y: number;

  const updateColor = () => {
    x = ref.current.position.x;
    y = ref.current.position.z;

    if (globalSelected?.current?.id === ref.current.id) {
      ref.current.color = noColor;
      return;
    }

    if (unlocked[x]?.[y] === undefined || unlocked[x]?.[y] < 1) {
      // tile is shown as unlocked but should be locked
      ref.current.color = grayScale;
    } else {
      // tile is shown as locked but should be unlocked
      ref.current.color = lightGray;
    }
  };

  const updateTile = () => {
    x = ref.current.position.x;
    y = ref.current.position.z;

    updateColor();

    ref.current.position.y = getTerrainHeight(x, y) - 0.5;
  };

  const onRefChange = () => {
    if (hasBuilding || buildings[ref.current.position.x]?.[ref.current.position.z] !== undefined)
      startTransition(() => forceUpdate());

    updateTile();
    globalSelected?.current?.id === ref.current.id && deselect();
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (globalSelected?.current?.id !== ref.current.id) {
      select();
    } else {
      deselect();
    }
  };

  const select = () => {
    if (globalSelected) {
      globalSelected.current = ref.current;
      setGlobalSelected({ type: 'tile', object: ref.current });
      invalidate();
    }
  };

  const deselect = () => {
    if (globalSelected) {
      globalSelected.current = undefined;
      setGlobalSelected(undefined);
      invalidate();
    }
  };

  useFrame(() => {
    updateColor();
  });

  return (
    <Suspense>
      <Instance
        ref={(el: ColoredGroup) => {
          ref.current = el;
        }}
        userData={{ update: () => onRefChange(), deselect: () => deselect() }}
        onClick={(e) => handleClick(e)}
        color={grayScale}
      >
        {hasBuilding && <Building type={buildings[ref.current.position.x][ref.current.position.z]} />}
      </Instance>
      {/* {ref?.current?.position && !hasBuilding && (
        <Foilage position={ref.current.position} />
      )} */}
    </Suspense>
  );
};

export const Tile = memo(TileComponent);
