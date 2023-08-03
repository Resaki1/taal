import { Vector3 } from '@react-three/fiber';
import { building } from '../../../../materials/materials';
import { MeshStandardMaterial } from 'three';

interface FarmProps {
  position: Vector3;
}

const material = new MeshStandardMaterial({
  color: 'green',
  emissiveIntensity: 0.2,
});

const Farm = ({ position }: FarmProps) => (
  <mesh material={material} geometry={building} position={position} castShadow receiveShadow />
);

export default Farm;
