import { Group, Color, MeshStandardMaterial } from "three";
import { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
  };
  materials: {
    ["Scene_-_Root"]: THREE.MeshStandardMaterial;
  };
};

export default function TreeBirch({
  ...props
}: JSX.IntrinsicElements["group"]) {
  const group = useRef<Group>(null!);
  const { nodes, materials } = useGLTF(
    "gltf/tree_birch/tree_birch.glb"
  ) as GLTFResult;

  // Verwenden Sie useMemo, um das Material nur einmal zu erstellen und wiederzuverwenden
  const optimizedMaterial = useMemo(() => {
    return new MeshStandardMaterial({
      color: new Color(0x228B22), // Grüner Farbwert für die Baumfarbe
      emissive: new Color(0x006400), // Dunkler Grünton für Emissive
      emissiveIntensity: 0.2,
      roughness: 0.5, // Angemessene Rauheit für eine bessere Lichtverteilung
      metalness: 0.1, // Geringe Metallizität für ein nicht-metallisches Aussehen
    });
  }, []);

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={0.012}
      rotation={[-Math.PI * 2.5, 0, 0]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_2.geometry}
        material={optimizedMaterial}
        position={[0, 0, 40]}
      />
    </group>
  );
}

useGLTF.preload("gltf/tree_birch/tree_birch.glb");
