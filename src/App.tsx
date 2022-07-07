import { Canvas } from "@react-three/fiber";
import { Map } from "./components/Map/Map";
import "./App.css";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  MapControls,
  Sky,
  Stars,
  Stats,
} from "@react-three/drei";

const App = () => {
  return (
    <div className="App">
      <Canvas
        frameloop="demand"
        camera={{ fov: 25, near: 0.1, far: 1000, position: [6, 5, 6] }}
      >
        <ambientLight intensity={0.2} color={"white"} castShadow />
        <directionalLight
          color="#FDB813"
          position={[100, 20, 80]}
          intensity={1}
        />
        <Sky
          distance={4500000}
          sunPosition={[100, 20, 80]}
          inclination={0}
          azimuth={0}
          rayleigh={0}
          turbidity={0.5}
        />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <MapControls />
        <Map />
        <Stats showPanel={0} className="stats" />
        <AdaptiveEvents />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default App;
