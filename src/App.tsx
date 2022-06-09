import { Canvas } from "@react-three/fiber";
import { Map } from "./components/Map/Map";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Canvas camera={{ fov: 25, near: 0.1, far: 1000, position: [5, 4, 5] }}>
        <ambientLight intensity={0.4} color={"white"} />
        <directionalLight color="white" position={[10, 8, 5]} intensity={0.2} />
        <Map />
      </Canvas>
    </div>
  );
};

export default App;
