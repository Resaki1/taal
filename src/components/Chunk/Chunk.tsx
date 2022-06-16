import { DoubleSide, Euler } from "three";

export const Chunk = () => (
  <mesh rotation={new Euler(-Math.PI / 2)}>
    <planeBufferGeometry />
    <meshBasicMaterial side={DoubleSide} />
  </mesh>
);
