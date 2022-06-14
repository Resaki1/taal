import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState, useTransition } from "react";
import { Ray, Vector3 } from "three";
import { Tile, TileProps } from "../Tile/Tile";

export const Map = () => {
  const map: {
    tiles: TileProps[];
  } = {
    tiles: [],
  };

  const MAPSIZE = 96;

  const noisejs = require("noisejs");

  const terrain = new noisejs.Noise(0);
  const { camera } = useThree();
  const [centerBlock, setCenterBlock] = useState(new Vector3(9999, 0, 0));
  const [isPending, startTransition] = useTransition();

  const [test, setTest] = useState([[0, 0]]);

  for (var x = -MAPSIZE / 2; x < MAPSIZE / 2; x++) {
    for (var y = -MAPSIZE / 2; y < MAPSIZE / 2; y++) {
      map.tiles.push({
        x,
        y,
        type: terrain.perlin2(x / 24, y / 24),
      });
    }
  }

  const size = 48;

  const target = new Vector3();
  useFrame(() => {
    const position = camera.position.clone();
    const direction = camera.getWorldDirection(target);
    const ray = direction.multiplyScalar(camera.position.y / direction.y);
    const newCenter = position.sub(ray).round();

    if (centerBlock.distanceTo(newCenter) > 8) {
      setCenterBlock(newCenter);

      let newMap: number[][] = [];
      for (var x = newCenter.x - size; x < newCenter.x + (size + 1); x++) {
        for (var y = newCenter.z - size; y < newCenter.z + (size + 1); y++) {
          newMap.push([x, y]);
        }
      }
      startTransition(() => setTest(newMap));
    }
  });

  return (
    <>
      {test.map((tile) => (
        <Tile
          key={`${tile[0]}/${tile[1]}`}
          x={tile[0]}
          y={tile[1]}
          type={terrain.perlin2(tile[0] / 24, tile[1] / 24)}
        />
      ))}
    </>
  );
};
