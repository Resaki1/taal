import { Vector3 } from '@react-three/fiber';
import { building } from '../../../../materials/materials';
import { MeshStandardMaterial } from 'three';

interface LumberhutProps {
  position: Vector3;
}

const material = new MeshStandardMaterial({
  color: '#5C4033',
  emissiveIntensity: 0.2,
});

const Lumberhut = ({ position }: LumberhutProps) => (
  <mesh material={material} geometry={building} position={position} castShadow receiveShadow />
);

export default Lumberhut;
