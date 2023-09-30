import { ReactNode, RefObject, createContext, useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Camera, Euler, Group, InstancedBufferAttribute, InstancedMesh, Matrix4, Mesh, Object3D, Vector3 } from 'three';
import debounce from 'lodash.debounce';
import { getTerrainHeight, getTerrainType, Terrain } from '../../helpers/terrain';

interface Props {
  camera?: Camera;
  instancedMesh?: RefObject<InstancedMesh>;
  waterRef?: RefObject<Mesh>;
  tileRef?: RefObject<Group[][]>;
}

export const MapContext = createContext<Props>({});

const RENDER_DISTANCE = 32;
const mapSize = 4225; // Math.sqrt(RENDER_DISTANCE * 2 + 1)

export const map = Array.from({ length: RENDER_DISTANCE * 2 + 1 }, () => true);

const saveCameraPositionDebounced = debounce((cameraMatrix: number[]) => {
  localStorage.setItem('cameraPosition', JSON.stringify(cameraMatrix));
}, 1000);

const target = new Vector3();
const newPosition = new Vector3();
const vec = new Vector3();
const direction = new Vector3();
const moveVector = new Vector3();
export const waterRotation = new Euler(-Math.PI / 2, 0, 0);
const texIdxArray = new Float32Array(mapSize).fill(0);
const bufferAttribute = new InstancedBufferAttribute(texIdxArray, 1);
const centerBlockVector = new Vector3(9999, 0, 0);
export const texStep = 1 / (Terrain.MOUNTAIN + 1); // last value of Terrain enum + 1

// TODO: Do I really need tile refs, and if so, what do I need them for?
// TODO: If I don't need them, can I remove useLayoutEffect hook?
// TODO: Initiliaze initial camera position before actually rendering the map, and if a previous camera pos has been stored, initialize the camera accordingly (in App.tsx)

export const MapContextProvider = ({ children }: { children: ReactNode }) => {
  const centerBlock = useRef(centerBlockVector);
  const tileRef = useRef<Group[][]>([[]]);
  const instancedMesh = useRef<InstancedMesh>(null!);
  const waterRef = useRef<Mesh>(null!);

  const camera = useThree(({ camera }) => {
    const storedCameraPosition = localStorage.getItem('cameraPosition');
    if (storedCameraPosition) {
      const position = JSON.parse(storedCameraPosition) as number[];
      const matrix = new Matrix4().fromArray(position);
      const vector = new Vector3().setFromMatrixPosition(matrix);
      const euler = new Euler().setFromRotationMatrix(matrix, 'XYZ');
      console.log(storedCameraPosition);
      console.log('we are setting a cam pos ', JSON.stringify(vector));
      console.log(euler);
      camera.matrix.copy(matrix);
      console.log(JSON.stringify(camera.matrix.elements));
      console.log(JSON.stringify(camera.position));
    }
    return camera;
  });

  let texIdx = new Float32Array(mapSize).fill(0);
  let index = 0;

  useLayoutEffect(() => {
    // calculate the coordinates of the block the camera is currently looking at. This will be the center of the map
    console.log('we are setting a layout effect ', JSON.stringify(camera.position));
    // TODO: can this be removed?
    newPosition.copy(camera.position); // set newPosition to camera position
    vec.copy(camera.getWorldDirection(target).multiplyScalar(camera.position.y / camera.getWorldDirection(target).y));
    waterRef.current.position.copy(newPosition.sub(vec).round()); // shift in direction of camera

    console.log('waterRef.current.position is ', JSON.stringify(waterRef.current.position));

    let posX = 0;
    let posY = 0;
    let tile: Group;
    waterRef.current.position.x = waterRef.current.position.x;
    waterRef.current.position.z = waterRef.current.position.z;

    map.forEach((_, x) => {
      map.forEach((_, y) => {
        posX = x - RENDER_DISTANCE;
        posY = y - RENDER_DISTANCE;
        tile = tileRef.current[x][y];

        tile.position.set(posX, getTerrainHeight(posX, posY), posY);

        texIdx[index] = getTerrainType(posX, posY);
        tile.userData.update();
        index++;
      });
    });

    bufferAttribute.array = texIdx;
    instancedMesh.current.geometry.setAttribute('texIdx', bufferAttribute);
    instancedMesh.current.frustumCulled = false;
  }, [camera.position]);

  let updated = false;
  let tile;

  useFrame(({ camera }, _, xFrame) => {
    console.log(xFrame);
    const storedCameraPosition = localStorage.getItem('cameraPosition');
    console.log(storedCameraPosition);
    if (storedCameraPosition) {
      camera.rotation.setFromRotationMatrix(new Matrix4().fromArray(JSON.parse(storedCameraPosition) as number[]));
    }

    /* camera.position.setFromMatrixPosition(
      new Matrix4().fromArray([
        0.9288444686214533, 2.7755575615628914e-17, -0.3704699085098949, 0, -0.31732768774086184, 0.5160564831208542,
        -0.7956059607757935, 0, 0.19118339808772097, 0.8565545553138665, 0.4793362098430458, 0, 0, 10, 0, 1,
      ]),
    ); */

    console.log(JSON.stringify(camera.position));
    newPosition.copy(camera.position); // set newPosition to camera position
    vec.copy(camera.getWorldDirection(target)); // set vec to camera direction
    // TODO: Maybe use .projectOnPlane()?
    vec.multiplyScalar(camera.position.y / vec.y); // magic
    newPosition.sub(vec).round(); // set newPosition to tile in center of view

    if (waterRef.current.position.distanceTo(newPosition) > 0) {
      console.log('frame update with camera update ', JSON.stringify(newPosition));
      direction.copy(newPosition).sub(waterRef.current.position); // set direction to where the camera has moved
      // only update if camera has moved less than 1 tile to fix distorted map
      if (Math.abs(direction.x) <= 1 && Math.abs(direction.z) <= 1) {
        moveVector
          .copy(direction)
          .multiplyScalar(RENDER_DISTANCE * 2)
          .add(direction);

        texIdx = instancedMesh.current.geometry.attributes.texIdx.array as Float32Array;

        instancedMesh.current.children.forEach((child: Object3D, index: number) => {
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
          if (updated) {
            texIdx[index] = getTerrainType(tile.position.x, tile.position.z);
            tile.userData.update && tile.userData.update();
          }
        });

        bufferAttribute.array = texIdx;
        bufferAttribute.needsUpdate = true;
        instancedMesh.current.geometry.setAttribute('texIdx', bufferAttribute);

        saveCameraPositionDebounced(camera.matrix.elements);
      }

      waterRef.current.position.copy(newPosition);
      waterRef.current.position.copy(newPosition);
    }
  });

  return <MapContext.Provider value={{ camera, instancedMesh, waterRef, tileRef }}>{children}</MapContext.Provider>;
};
