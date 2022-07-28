import { Instances, Plane } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  BoxGeometry,
  Color,
  Euler,
  Group,
  Matrix4,
  Vector2,
  Vector3,
} from "three";
import { getTerrainHeight } from "../../helpers/terrain";
import { Materials } from "../../materials/materials";
import { Tile } from "../Tile/Tile";

const RENDER_DISTANCE = 32;

let map: boolean[] = [];
for (let x = 0; x <= RENDER_DISTANCE * 2; x++) {
  map[x] = true;
}

const target = new Vector3();
const newPosition = new Vector3();
const vec = new Vector3();
const direction = new Vector3();
const moveVector = new Vector3();

export const Map = () => {
  const MATERIALS = Materials();
  const { camera } = useThree();
  const centerBlock = useRef(new Vector3(9999, 0, 0));
  const tileRef = useRef<any[][]>([[]]);
  const groupRef = useRef<any>();
  const waterRef = useRef<any>();

  useLayoutEffect(() => {
    newPosition.set(camera.position.x, camera.position.y, camera.position.z);
    direction.copy(camera.getWorldDirection(target));
    vec.copy(direction.multiplyScalar(camera.position.y / direction.y));
    // shift in direction of camera
    centerBlock.current.copy(newPosition.sub(vec).round());

    let posX = 0;
    let posY = 0;
    waterRef.current.position.x = centerBlock.current.x;
    waterRef.current.position.z = centerBlock.current.z;

    tileRef.current[posX][posY].parent.material = MATERIALS.atlas;
    tileRef.current[posX][posY].parent.material.map.repeat.set(0.1, 0.1);

    map.forEach((_, x) => {
      map.forEach((_, y) => {
        vec.set(x - RENDER_DISTANCE, 0, y - RENDER_DISTANCE);
        posX = x - RENDER_DISTANCE;
        posY = y - RENDER_DISTANCE;

        tileRef.current[x][y].position.set(
          posX,
          getTerrainHeight(posX, posY),
          posY
        );

        tileRef.current[x][y].material = MATERIALS.atlas;

        //tileRef.current[x][y].material.map.repeat.set(0.5, 0.5);
      });
    });
    //tileRef.current[posX][posY].parent.material = MATERIALS.get(posX, posY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let updated = false;
  let tile;
  useFrame(() => {
    newPosition.copy(camera.position); // set newPosition to camera position
    vec.copy(camera.getWorldDirection(target)); // set vec to camera direction
    // TODO: Maybe use .projectOnPlane()?
    vec.multiplyScalar(camera.position.y / vec.y); // magic
    newPosition.sub(vec).round(); // set newPosition to tile in center of view

    if (centerBlock.current.distanceTo(newPosition) > 0) {
      direction.copy(newPosition).sub(centerBlock.current); // set direction to where the camera has moved
      // only update if camera has moved less than 1 tile to fix distorted map
      if (Math.abs(direction.x) <= 1 && Math.abs(direction.z) <= 1) {
        moveVector
          .copy(direction)
          .multiplyScalar(RENDER_DISTANCE * 2)
          .add(direction);

        groupRef.current.children.forEach((child: Group) => {
          tile = child;

          updated = false;
          if (Math.abs(tile?.position.x - newPosition.x) > RENDER_DISTANCE) {
            tile.position.x += moveVector.x;
            updated = true;
          }
          if (Math.abs(tile?.position.z - newPosition.z) > RENDER_DISTANCE) {
            tile.position.z += moveVector.z;
            updated = true;
          }
          if (updated) tile.userData.update && tile.userData.update();
        });
      }

      waterRef.current.position.copy(newPosition);
      centerBlock.current.copy(newPosition);
    }
  });

  return (
    <group>
      <Instances ref={groupRef} limit={4225}>
        <boxBufferGeometry />
        <meshStandardMaterial />
        {map.map((_, x) => {
          return map.map((_, y) => {
            if (!tileRef.current[x]) tileRef.current[x] = [];
            return (
              <Tile
                tileRef={(el: any) => (tileRef.current[x][y] = el)}
                key={`${x}/${y}`}
              />
            );
          });
        })}
      </Instances>
      <Plane
        args={[RENDER_DISTANCE * 2 + 1, RENDER_DISTANCE * 2 + 1]}
        rotation={new Euler(-Math.PI / 2, 0, 0)}
        position={[0, 0, 0]}
        material={MATERIALS.water}
        onClick={(e) => e.stopPropagation()}
        ref={waterRef}
      />
    </group>
  );
};
