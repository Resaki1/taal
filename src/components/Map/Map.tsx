import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { useStore } from "../../store/store";
import { Tile } from "../Tile/Tile";

export const Map = () => {
  const RENDER_DISTANCE = 32;

  let map: number[][] = [[]];
  for (let x = 0; x <= RENDER_DISTANCE * 2; x++) {
    map[x] = [];
    for (let y = 0; y <= RENDER_DISTANCE * 2; y++) {
      map[x][y] = Math.random();
    }
  }

  const noisejs = require("noisejs");

  useEffect(() => console.log("Map UseEffect"));

  const terrain = new noisejs.Noise(0);
  const { camera } = useThree();
  const centerBlock = useRef(new Vector3(9999, 0, 0));
  const tileRef = useRef<any[][]>([[]]);
  const groupRef = useRef<any>();

  const buildings = useStore((state) => state.buildings);

  const target = new Vector3();
  const newPosition = new Vector3();
  const vec = new Vector3();
  const direction = new Vector3();
  const moveVector = new Vector3();

  useLayoutEffect(() => {
    newPosition.set(camera.position.x, camera.position.y, camera.position.z);
    direction.copy(camera.getWorldDirection(target));
    vec.copy(direction.multiplyScalar(camera.position.y / direction.y));
    // shift in direction of camera
    centerBlock.current.copy(newPosition.sub(vec).round());

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
    console.log(buildings);
  });

  useFrame(() => {
    newPosition.copy(camera.position); // set newPosition to camera position
    vec.copy(camera.getWorldDirection(target)); // set vec to camera direction
    // TODO: Maybe use .projectOnPlane()?
    vec.multiplyScalar(camera.position.y / vec.y); // magic
    newPosition.sub(vec).round(); // set newPosition to tile in center of view

    if (centerBlock.current.distanceTo(newPosition) > 0) {
      direction.copy(newPosition).sub(centerBlock.current); // set direction to where the camera has moved
      moveVector
        .copy(direction)
        .multiplyScalar(RENDER_DISTANCE * 2)
        .add(direction);

      groupRef.current.children.forEach((child: Group) => {
        const tile = child.children[0];

        let updated = false;
        if (Math.abs(tile?.position.x - newPosition.x) > RENDER_DISTANCE) {
          tile.position.x += moveVector.x;
          updated = true;
        }
        if (Math.abs(tile?.position.z - newPosition.z) > RENDER_DISTANCE) {
          tile.position.z += moveVector.z;
          updated = true;
        }
        if (updated) tile.userData.update();
      });

      centerBlock.current.copy(newPosition);
    }
  });

  return (
    <group ref={groupRef}>
      {map.map((_, x) => {
        return map.map((_, y) => {
          if (!tileRef.current[x]) tileRef.current[x] = [];
          return (
            <Tile
              tileRef={(el: any) => (tileRef.current[x][y] = el)}
              key={`${x}/${y}`}
              terrain={terrain}
            />
          );
        });
      })}
    </group>
  );
};
