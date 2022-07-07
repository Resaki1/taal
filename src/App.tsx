import { Canvas } from "@react-three/fiber";
import { Map } from "./components/Map/Map";
import "./App.css";
import { AdaptiveDpr, MapControls, Stats } from "@react-three/drei";

const App = () => {
  return (
    <div className="App">
      <Canvas
        frameloop="demand"
        camera={{ fov: 25, near: 0.1, far: 1000, position: [6, 5, 6] }}
      >
        <ambientLight intensity={0.6} color={"white"} />
        <directionalLight color="white" position={[10, 8, 5]} intensity={0.6} />
        <MapControls />
        <Map />
        {/* <fog attach="fog" args={["white", 72, 82]} /> */}
        <Stats showPanel={0} className="stats" />
        <AdaptiveDpr pixelated />
        {/* <gridHelper args={[500, 500]} /> */}
      </Canvas>
    </div>
  );
};

export default App;
