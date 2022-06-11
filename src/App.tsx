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
        <ambientLight intensity={0.4} color={"white"} />
        <directionalLight color="white" position={[10, 8, 5]} intensity={0.2} />
        <MapControls />
        <Map />
        <Stats showPanel={0} className="stats" />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default App;
