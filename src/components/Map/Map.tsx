import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState, useTransition } from "react";
import { Vector3 } from "three";
import { Tile } from "../Tile/Tile";

export const Map = () => {
  const RENDER_DISTANCE = 32;

  let map: boolean[][] = [[]];
  for (let x = 0; x <= RENDER_DISTANCE * 2; x++) {
    map[x] = [];
    for (let y = 0; y <= RENDER_DISTANCE * 2; y++) {
      map[x][y] = true;
    }
  }

  const noisejs = require("noisejs");

  const terrain = new noisejs.Noise(0);
  const { camera } = useThree();
  const centerBlock = useRef(new Vector3(9999, 0, 0));
  const tileRef = useRef<any[][]>([[]]);

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
  const vec = new Vector3();

  useLayoutEffect(() => {
    position.set(camera.position.x, camera.position.y, camera.position.z);
    const direction = camera.getWorldDirection(target);
    const ray = direction.multiplyScalar(camera.position.y / direction.y);
    // shift in direction of camera
    const newCenter = position.sub(ray).round();
    centerBlock.current = newCenter.clone();

    map.forEach((xRow, x) => {
      xRow.forEach((_, y) => {
        vec.set(x - RENDER_DISTANCE, 0, y - RENDER_DISTANCE);
        tileRef.current[x][y].position.set(
          x - RENDER_DISTANCE,
          0,
          y - RENDER_DISTANCE
        );
      });
    });
  });

  useFrame(() => {
    position.set(camera.position.x, camera.position.y, camera.position.z);
    const direction = camera.getWorldDirection(target);
    const ray = direction.multiplyScalar(camera.position.y / direction.y);

    // TODO: Create vectors once and then set position here
    const newCenter = position.sub(ray).round();

    if (centerBlock.current.distanceTo(newCenter) > 0) {
      const dir = newCenter.clone().sub(centerBlock.current);
      console.log(dir);
      const test = dir
        .clone()
        .multiplyScalar(RENDER_DISTANCE * 2)
        .add(dir.clone());

      for (let x in tileRef.current) {
        for (let y in tileRef.current[x]) {
          const tile = tileRef.current[x][y];
          const centerDistance = tile?.position.distanceTo(newCenter);

          if (Math.abs(tile?.position.x - newCenter.x) > RENDER_DISTANCE) {
            tile.position.add(new Vector3(test.x, 0, 0));
          }
          if (Math.abs(tile?.position.z - newCenter.z) > RENDER_DISTANCE) {
            tile.position.add(new Vector3(0, 0, test.z));
          }
        }
      }

      centerBlock.current = newCenter.clone();
    }
  });

  return (
    <>
      {map.map((_, x) => {
        return map.map((_, y) => {
          if (!buildings[x]) addXArray(x);
          if (!tileRef.current[x]) tileRef.current[x] = [];
          return (
            <Tile
              tileRef={(el: any) => (tileRef.current[x][y] = el)}
              key={`${x}/${y}`}
              type={terrain.perlin2(x / 8, y / 8)}
              building={buildings[x][y]}
              addBuilding={addBuilding}
            />
          );
        });
      })}
    </>
  );
};
