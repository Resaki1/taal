import { Vector3 } from "@react-three/fiber";
import { building, water } from "../../../../materials/materials";

interface OutpostProps {
  position: Vector3;
}

const Outpost = ({ position }: OutpostProps) => (
  <mesh material={water} geometry={building} position={position} />
);

export default Outpost;
