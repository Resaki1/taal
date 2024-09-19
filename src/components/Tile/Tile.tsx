import { Instance } from '@react-three/drei';
import { ThreeEvent, invalidate, useFrame } from '@react-three/fiber';
import { memo, startTransition, useRef, useState } from 'react';
import { useStore } from '../../store/store';
import { Building } from '../Building/Building';
import { Color, Group } from 'three';
import { getTerrainHeight, WATER_HEIGHT } from '../../helpers/terrain';
import { useSelectedTile } from './SelectedTileContext';

export interface ColoredGroup extends Group {
  color: Color;
}

const lightGray = new Color('hsl(0, 0%, 80%)');
const noColor = new Color();

const grayScale = (value: number) => {
  const clampedValue = Math.max(0, 50 + value * 10);
  return new Color(`hsla(62, 0%, ${clampedValue}%)`);
};

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

    if (unlocked[x]?.[y] === undefined || unlocked[x]?.[y] < 1 || ref.current.position.y < WATER_HEIGHT - 1) {
      // tile is shown as unlocked but should be locked
      ref.current.color =
        ref.current.position.y < WATER_HEIGHT - 1 ? grayScale(ref.current.position.y) : grayScale(-1 + WATER_HEIGHT);
    } else {
      // tile is shown as locked but should be unlocked
      ref.current.color = lightGray;
    }
  };

  const updateTile = () => {
    x = ref.current.position.x;
    y = ref.current.position.z;

    updateColor();

    let height = getTerrainHeight(x, y) - 0.5;
    if (height < WATER_HEIGHT - 1 + 0.01 && height > WATER_HEIGHT - 1 - 0.01) height -= 0.01;
    ref.current.position.y = height;
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
    <>
      <Instance
        ref={(el: ColoredGroup) => {
          ref.current = el;
        }}
        userData={{ update: () => onRefChange(), deselect: () => deselect() }}
        onClick={(e) => handleClick(e)}
      >
        {hasBuilding && <Building type={buildings[ref.current.position.x][ref.current.position.z]} />}
      </Instance>
      {/* {ref?.current?.position && !hasBuilding && (
        <Foilage position={ref.current.position} />
      )} */}
    </>
  );
};

export const Tile = memo(TileComponent);
