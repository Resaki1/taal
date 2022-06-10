export type TileProps = {
  x: number;
  y: number;
  type: number;
};

export const Tile = ({ x, y, type }: TileProps) => {
  return (
    <group position={[x, 0, y]}>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial
          color={type === 0 ? "green" : type === 1 ? "blue" : "grey"}
        />
      </mesh>
    </group>
  );
};
