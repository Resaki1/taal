import { Instances, Plane } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { Euler, Group, InstancedBufferAttribute, Shader, Vector3 } from "three";
import {
  getTerrainHeight,
  getTerrainType,
  Terrain,
} from "../../helpers/terrain";
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
  const instancedMesh = useRef<any>();
  const waterRef = useRef<any>();

  const texStep = 1 / (Terrain.MOUNTAIN + 1); // last value of Terrain enum + 1
  const onBeforeCompile = (shader: Shader) => {
    shader.uniforms.texAtlas = { value: MATERIALS.texture_atlas };
    shader.vertexShader = `
    	attribute float texIdx;
    	varying float vTexIdx;
      ${shader.vertexShader}
    `.replace(
      `void main() {`,
      `void main() {
      	vTexIdx = texIdx;
      `
    );
    shader.fragmentShader = `
    	uniform sampler2D texAtlas;
    	varying float vTexIdx;
      ${shader.fragmentShader}
    `.replace(
      `#include <map_fragment>`,
      `#include <map_fragment>
      	
       	vec2 blockUv = ${texStep} * (floor(vTexIdx + 0.1) + vUv); 
        vec4 blockColor = texture(texAtlas, blockUv);
        diffuseColor *= blockColor;
      `
    );
  };

  let texIdx = new Float32Array(4225).fill(0);
  let index = 0;

  useLayoutEffect(() => {
    newPosition.set(camera.position.x, camera.position.y, camera.position.z);
    direction.copy(camera.getWorldDirection(target));
    vec.copy(direction.multiplyScalar(camera.position.y / direction.y));
    // shift in direction of camera
    centerBlock.current.copy(newPosition.sub(vec).round());

    let posX = 0;
    let posY = 0;
    let tile: any;
    waterRef.current.position.x = centerBlock.current.x;
    waterRef.current.position.z = centerBlock.current.z;

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

    instancedMesh.current.geometry.setAttribute(
      "texIdx",
      new InstancedBufferAttribute(texIdx, 1)
    );
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

        texIdx = instancedMesh.current.geometry.attributes.texIdx.array;

        instancedMesh.current.children.forEach(
          (child: Group, index: number) => {
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
          }
        );

        instancedMesh.current.geometry.setAttribute(
          "texIdx",
          new InstancedBufferAttribute(texIdx, 1)
        );
      }

      waterRef.current.position.copy(newPosition);
      centerBlock.current.copy(newPosition);
    }
  });

  return (
    <group>
      <Instances ref={instancedMesh} limit={4225}>
        <boxBufferGeometry />
        <meshStandardMaterial
          onBeforeCompile={onBeforeCompile}
          defines={{ USE_UV: "" }}
        />
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
