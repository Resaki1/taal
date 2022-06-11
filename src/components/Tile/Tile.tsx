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
          color={type <= -0.2 ? "blue" : type < 0.4 ? "green" : "grey"}
        />
      </mesh>
    </group>
  );
};
