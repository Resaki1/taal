import { Instance } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { memo, startTransition, Suspense, useRef, useState } from 'react';
import { useStore } from '../../store/store';
import { Building } from '../Building/Building';
import { Color, Group } from 'three';
import { getTerrainHeight } from '../../helpers/terrain';

const lightGray = new Color(0xa0a0a0);
const grayScale = new Color('hsla(62, 0%, 20%)');
const noColor = new Color();

const TileComponent = () => {
  const ref = useRef<Group>(null!);

  const [, setValue] = useState(0);
  const [selected, setSelected] = useState(false);
  const [isUnlocked, setUnlocked] = useState(false);

  const forceUpdate = () => setValue((value) => value + 1);

  const buildings = useStore((state) => state.buildings);
  const setGlobalSelected = useStore((state) => state.setSelected);
  const unlocked = useStore((state) => state.unlocked);

  const hasBuilding =
    ref?.current &&
    buildings[ref.current.position.x] &&
    buildings[ref.current.position.x][ref.current.position.z] !== undefined;

  let x: number;
  let y: number;

  const updateTile = () => {
    x = ref.current.position.x;
    y = ref.current.position.z;

    if (isUnlocked) {
      if (unlocked[x][y] < 1) {
        // tile is shown as unlocked but should be locked
        startTransition(() => setUnlocked(false));
      }
    } else if (!isUnlocked && unlocked[x]?.[y] > 0) {
      // tile is shown as locked but should be unlocked
      startTransition(() => setUnlocked(true));
    }

    ref.current.position.y = getTerrainHeight(x, y) - 0.5;
  };

  const onRefChange = () => {
    if (
      hasBuilding ||
      (buildings[ref.current.position.x] && buildings[ref.current.position.x][ref.current.position.z] !== undefined)
    )
      startTransition(() => forceUpdate());

    updateTile();
    selected && deselect();
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.intersections.forEach((intersection, index) => {
      if (index > 0)
        intersection.object.userData.deselect && startTransition(() => intersection.object.userData.deselect());
    });
    if (!selected) {
      select();
    } else {
      deselect();
    }
  };

  const select = () => {
    setGlobalSelected({ type: 'tile', object: ref.current });
    setSelected(true);
  };

  const deselect = () => {
    updateTile();
    setGlobalSelected(undefined);
    setSelected(false);
  };

  useFrame(() => {
    if (
      !isUnlocked &&
      unlocked[ref.current.position.x] &&
      unlocked[ref.current.position.x][ref.current.position.z] > 0
    ) {
      startTransition(() => setUnlocked(true));
    } else if (isUnlocked && unlocked[ref.current.position.x]?.[ref.current.position.z] < 1) {
      startTransition(() => setUnlocked(false));
    }
  });

  return (
    <Suspense>
      <Instance
        ref={(el: Group) => {
          ref.current = el;
        }}
        userData={{ update: () => onRefChange(), deselect: () => deselect() }}
        onClick={(e) => handleClick(e)}
        onPointerMissed={() => selected && deselect()}
        color={selected ? noColor : isUnlocked ? lightGray : grayScale}
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
