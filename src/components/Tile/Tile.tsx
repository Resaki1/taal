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
          color={
            type <= -0.2
              ? "blue"
              : type < -0.15
              ? "yellow"
              : type < 0.1
              ? "lightgreen"
              : type < 0.6
              ? "green"
              : "grey"
          }
        />
      </mesh>
    </group>
  );
};
