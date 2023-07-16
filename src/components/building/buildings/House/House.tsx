/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: soupffle (https://sketchfab.com/soupffle)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/pixel-house-fb19698f540649d58d840e7e3459c9a6
title: Pixel House
*/

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Group, Mesh, MeshStandardMaterial } from "three";

type GLTFResult = GLTF & {
  nodes: {
    Object_4: Mesh;
  };
  materials: {
    Pixel_House_A: MeshStandardMaterial;
  };
};

export default function Model({ ...props }: JSX.IntrinsicElements["group"]) {
  const group = useRef<Group>(null!);
  const { nodes, materials } = useGLTF("/gltf/house/house.gltf") as GLTFResult;
  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={3}
      castShadow
      receiveShadow
    >
      <mesh
        position={[0, 0.028, 0]}
        geometry={nodes.Object_4.geometry}
        material={materials.Pixel_House_A}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload("/gltf/house/house.gltf");
