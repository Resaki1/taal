import { useFrame, useThree } from "@react-three/fiber";
import {
  useRef,
  useState,
  useTransition,
} from "react";
import { Vector3 } from "three";
import { Tile } from "../Tile/Tile";

export const Map = () => {
  const RENDER_DISTANCE = 32;

  const noisejs = require("noisejs");

  const terrain = new noisejs.Noise(0);
  const { camera } = useThree();
  const centerBlock = useRef(new Vector3(9999, 0, 0));
  const [, startTransition] = useTransition();

  const [map, setMap] = useState<number[][]>([[]]);
  const [buildings, setBuildings] = useState<any[][]>([]);

  const addBuilding = (x: number, y: number) => {
    let newBuildings = buildings;
    newBuildings[x][y] = "test";
    setBuildings(newBuildings);
  };

  const addXArray = (x: number) => {
    let newBuildings = buildings;
    newBuildings[x] = [];
    setBuildings(newBuildings);
  };

  const target = new Vector3();
  const position = new Vector3();

  useFrame(() => {
    position.set(camera.position.x, camera.position.y, camera.position.z);
    const direction = camera.getWorldDirection(target);
    const ray = direction.multiplyScalar(camera.position.y / direction.y);

    // shift in direction of camera
    const newCenter = position.sub(ray).round();

    if (centerBlock.current.distanceTo(newCenter) > 6) {

        centerBlock.current = newCenter;

        let newMap: number[][] = [];
        for (
          var x = newCenter.x - RENDER_DISTANCE;
          x < newCenter.x + (RENDER_DISTANCE + 1);
          x++
        ) {
          for (
            var y = newCenter.z - RENDER_DISTANCE;
            y < newCenter.z + (RENDER_DISTANCE + 1);
            y++
          ) {
            if (target.set(x, 0, y).distanceTo(newCenter) < RENDER_DISTANCE)
              newMap.push([x, y]);
          }
        }
        startTransition(() => setMap(newMap));
    }
  });

  return (
    <>
      {map.map((tile) => {
        if (!buildings[tile[0]]) addXArray(tile[0]);
        return (
          <Tile
            key={`${tile[0]}/${tile[1]}`}
            x={tile[0]}
            y={tile[1]}
            type={terrain.perlin2(tile[0] / 8, tile[1] / 8)}
            building={buildings[tile[0]][tile[1]]}
            addBuilding={addBuilding}
          />
        );
      })}
    </>
  );
};
