type TileProps = { x: number; y: number; color: [number, number, number] };

export const Tile = ({ x, y, color }: TileProps) => (
  <group position={[x, 0, y]}>
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);
