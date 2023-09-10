import { Instances, Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { Euler, Group, InstancedBufferAttribute, InstancedMesh, Mesh, Object3D, Vector3 } from 'three';
import debounce from 'lodash.debounce';
import { getTerrainHeight, getTerrainType, Terrain } from '../../helpers/terrain';
import { Materials } from '../../materials/materials';
import { Tile } from '../Tile/Tile';
import { tileShader } from '../../helpers/shader';
import { useStore } from '../../store/store';

const RENDER_DISTANCE = 32;
const mapSize = 4225; // Math.sqrt(RENDER_DISTANCE * 2 + 1)

const map = Array.from({ length: RENDER_DISTANCE * 2 + 1 }, () => true);

// initialize three.js objects outside of component to avoid re-creating them on every render => better performance
const target = new Vector3();
const newPosition = new Vector3();
const vec = new Vector3();
const direction = new Vector3();
const moveVector = new Vector3();
const waterRotation = new Euler(-Math.PI / 2, 0, 0);
const texIdxArray = new Float32Array(mapSize).fill(0);
const bufferAttribute = new InstancedBufferAttribute(texIdxArray, 1);
const centerBlockVector = new Vector3(0, 0, 0);

export const Map = () => {
  const MATERIALS = Materials();
  const { camera } = useThree();
  const centerBlock = useRef(centerBlockVector);
  const tileRef = useRef<Group[][]>([[]]);
  const instancedMesh = useRef<InstancedMesh>(null!);
  const waterRef = useRef<Mesh>(null!);
  const cameraHistory = useStore((state) => state.camera);
  const setCamera = useStore((state) => state.setCamera);

  const saveCameraPositionDebounced = debounce((cameraPosition: Vector3, centerBlock: Vector3) => {
    setCamera(cameraPosition, centerBlock);
  }, 2000);

  const texStep = 1 / (Terrain.MOUNTAIN + 1); // last value of Terrain enum + 1

  let texIdx = new Float32Array(mapSize).fill(0);
  let index = 0;

  useLayoutEffect(() => {
    if (cameraHistory) {
      camera.position.copy(cameraHistory.position);
      centerBlock.current.copy(cameraHistory.lookAt);
    }

    let posX = 0;
    let posY = 0;
    let tile: Group;
    waterRef.current.position.copy(centerBlock.current);

    map.forEach((_, x) => {
      map.forEach((_, y) => {
        posX = x - RENDER_DISTANCE + centerBlock.current.x;
        posY = y - RENDER_DISTANCE + centerBlock.current.z;
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
      }

      waterRef.current.position.copy(newPosition);
      centerBlock.current.copy(newPosition);

      saveCameraPositionDebounced(camera.position, centerBlock.current);
    }
  });

  return (
    <>
      {/* TODO: fix type */}
      <Instances ref={instancedMesh as any} limit={mapSize} castShadow receiveShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial
          onBeforeCompile={(shader) => tileShader(shader, MATERIALS.texture_atlas, texStep)}
          defines={{ USE_UV: '' }}
        />
        {map.map((_, x) => {
          return map.map((_, y) => {
            if (!tileRef.current[x]) tileRef.current[x] = [];
            return <Tile tileRef={(el: Group) => (tileRef.current[x][y] = el)} key={`${x}/${y}`} />;
          });
        })}
      </Instances>
      <Plane
        args={[RENDER_DISTANCE * 2 + 1, RENDER_DISTANCE * 2 + 1]}
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
