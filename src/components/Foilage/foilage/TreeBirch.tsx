/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: WaxFreeOintment (https://sketchfab.com/WaxFreeOintment)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/birch-tree-voxel-459f53f6981a4482834f7700a1f2c7a8
title: Birch Tree Voxel
*/

import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Object_2: Mesh;
  };
  materials: {
    ['Scene_-_Root']: MeshStandardMaterial;
  };
};

export default function TreeBirch({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<Group>(null!);
  const { nodes, materials } = useGLTF('gltf/tree_birch/tree_birch.glb') as GLTFResult;
  return (
    <group ref={group} {...props} dispose={null} scale={0.012} rotation={[-Math.PI * 2.5, 0, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_2.geometry}
        material={materials['Scene_-_Root']}
        position={[0, 0, 40]}
      />
    </group>
  );
}

useGLTF.preload('/scene-transformed.glb');
