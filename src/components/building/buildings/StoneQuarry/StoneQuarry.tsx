import { Vector3 } from '@react-three/fiber';
import { building } from '../../../../materials/materials';
import { MeshStandardMaterial } from 'three';

interface StoneQuarryProps {
  position: Vector3;
}

const material = new MeshStandardMaterial({
  color: 'black',
  emissiveIntensity: 0.2,
});

const StoneQuarry = ({ position }: StoneQuarryProps) => (
  <mesh material={material} geometry={building} position={position} castShadow receiveShadow />
);

export default StoneQuarry;
