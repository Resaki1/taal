import { Instances, Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { Euler, InstancedBufferAttribute, InstancedMesh, Mesh, Object3D, Vector3 } from 'three';
import debounce from 'lodash.debounce';
import { getTerrainHeight, getTerrainType } from '../../helpers/terrain';
import { Materials } from '../../materials/materials';
import { Tile } from '../Tile/Tile';
import { tileShader } from '../../helpers/shader';
import { useStore } from '../../store/store';

const RENDER_DISTANCE = 32;
const MAP_LENGTH = RENDER_DISTANCE * 2 + 1;
const MAP_SIZE = Math.pow(MAP_LENGTH, 2);

// initialize three.js objects outside of component to avoid re-creating them on every render => better performance
const newPosition = new Vector3();
const direction = new Vector3();
const moveVector = new Vector3();
const waterRotation = new Euler(-Math.PI / 2, 0, 0);
const bufferAttribute = new InstancedBufferAttribute(new Int8Array(MAP_SIZE).fill(0), 1);

export const Map = () => {
  const MATERIALS = Materials();
  const { camera } = useThree();
  const instancedMesh = useRef<InstancedMesh>(null!);
  const waterRef = useRef<Mesh>(null!); // ref to the water plane; its position is also used as center point of the map
  const cameraHistory = useStore((state) => state.camera);
  const setCamera = useStore((state) => state.setCamera);

  const saveCameraPositionDebounced = debounce((cameraPosition: Vector3, centerBlock: Vector3) => {
    setCamera(cameraPosition, centerBlock);
  }, 2000);

  useLayoutEffect(() => {
    if (cameraHistory) {
      camera.position.copy(cameraHistory.position);
      waterRef.current.position.copy(cameraHistory.lookAt);
    }

    instancedMesh.current.children.forEach((tile, index) => {
      const posX = (index % MAP_LENGTH) - RENDER_DISTANCE + waterRef.current.position.x;
      const posY = Math.floor(index / MAP_LENGTH) - RENDER_DISTANCE + waterRef.current.position.z;

      tile.position.set(posX, getTerrainHeight(posX, posY), posY);

      bufferAttribute.array[index] = getTerrainType(posX, posY);
      tile.userData.update();
    });

    instancedMesh.current.geometry.setAttribute('texIdx', bufferAttribute);
    instancedMesh.current.frustumCulled = false;
  }, []);

  let updated = false;

  useFrame(() => {
    newPosition.copy(camera.position); // set newPosition to camera position
    camera.getWorldDirection(direction); // set vec to camera direction
    // TODO: Maybe use .projectOnPlane()?
    direction.multiplyScalar(camera.position.y / direction.y); // magic
    newPosition.sub(direction).round(); // set newPosition to tile in center of view

    if (waterRef.current.position.distanceTo(newPosition) > 0) {
      direction.copy(newPosition).sub(waterRef.current.position); // set direction to where the camera has moved
      // only update if camera has moved less than 1 tile to fix distorted map
      if (Math.abs(direction.x) <= 1 && Math.abs(direction.z) <= 1) {
        moveVector
          .copy(direction)
          .multiplyScalar(RENDER_DISTANCE * 2)
          .add(direction);

        bufferAttribute.array = instancedMesh.current.geometry.attributes.texIdx.array;

        instancedMesh.current.children.forEach((tile: Object3D, index: number) => {
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
            bufferAttribute.array[index] = getTerrainType(tile.position.x, tile.position.z);
            tile.userData.update && tile.userData.update();
          }
        });

        bufferAttribute.needsUpdate = true;
        instancedMesh.current.geometry.setAttribute('texIdx', bufferAttribute);
      }

      waterRef.current.position.copy(newPosition);
      saveCameraPositionDebounced(camera.position, waterRef.current.position);
    }
  });

  return (
    <>
      {/* TODO: fix type */}
      <Instances ref={instancedMesh as any} limit={MAP_SIZE} castShadow receiveShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial
          onBeforeCompile={(shader) => tileShader(shader, MATERIALS.texture_atlas)}
          defines={{ USE_UV: '' }}
        />
        {[...Array(MAP_SIZE)].map((_, index) => (
          <Tile key={index} />
        ))}
      </Instances>
      <Plane
        args={[MAP_LENGTH, MAP_LENGTH]}
        rotation={waterRotation}
        position={[0, 0, 0]}
        material={MATERIALS.water}
        onClick={(e) => e.stopPropagation()}
        ref={waterRef}
        receiveShadow
      />
    </>
  );
};
