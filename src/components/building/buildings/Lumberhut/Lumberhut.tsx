import { Vector3 } from "@react-three/fiber";
import { building, mountain } from "../../../../materials/materials";

interface LumberhutProps {
  position: Vector3;
}

const Lumberhut = ({ position }: LumberhutProps) => (
  <mesh material={mountain} geometry={building} position={position} />
);

export default Lumberhut;
