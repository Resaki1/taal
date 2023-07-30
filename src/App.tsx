import { Canvas } from '@react-three/fiber';
import { Map } from './components/Map/Map';
import { AdaptiveDpr, AdaptiveEvents, MapControls, Sky, Stats } from '@react-three/drei';
import { BuildMenu } from './components/BuildMenu/BuildMenu';
import { RessourceMenu } from './components/RessourceMenu/RessourceMenu';
import { useStore } from './store/store';
import { useEffect, useRef } from 'react';
import { DirectionalLight } from 'three';
import './App.scss';

const App = () => {
  const sun = useRef<DirectionalLight>(null!);
  const addRessources = useStore((state) => state.addRessources);
  const buildingOutputs = useStore((state) => state.buildingOutputs);

  useEffect(() => {
    const tickWorker = new Worker('tickWorker.js');
    tickWorker.onmessage = () => addRessources(buildingOutputs);

    return () => tickWorker.terminate();
  });

  return (
    <div className="App">
      <Canvas frameloop="demand" camera={{ fov: 25, near: 0.1, far: 1000, position: [6, 5, 6] }} flat shadows>
        <ambientLight intensity={0.2} color={'#91AFFF'} />
        <directionalLight
          color="#ffdf91"
          position={[100, 60, 100]}
          ref={sun}
          intensity={3}
          castShadow
          shadow-mapSize-height={2048}
          shadow-mapSize-width={2048}
          shadow-camera-left={-42}
          shadow-camera-right={42}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
          shadow-camera-visible={true}
        />
        <Sky distance={4500000} sunPosition={[100, 15, 80]} inclination={0} azimuth={0} rayleigh={0} turbidity={0.5} />
        <MapControls />
        <Map sun={sun} />
        <Stats showPanel={0} className="stats" />
        <AdaptiveEvents />
        <AdaptiveDpr pixelated />
      </Canvas>
      <BuildMenu />
      <RessourceMenu />
    </div>
  );
};

export default App;
