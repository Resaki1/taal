import { useTexture } from '@react-three/drei';
import { BoxGeometry, Color, LinearFilter, MeshPhysicalMaterial,MeshStandardMaterial } from 'three';
import textureAtlas from '../textures/textureAtlas.jpg';

export const water = new MeshPhysicalMaterial({
  color: 'DeepBlue',
  emissiveIntensity: 0.2,
});

export const building = new BoxGeometry(0.5, 0.5, 0.5);

export const Materials = () => {
  const [texture_atlas] = useTexture([textureAtlas]);
  texture_atlas.minFilter = LinearFilter;
  texture_atlas.magFilter = LinearFilter;

  const water = new MeshPhysicalMaterial({
    color: new Color(0x0055ff),
    emissive: new Color(0x0055ff),
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.8,
    metalness: 0.1,
    roughness: 0.1, 
    clearcoat: 1.0, 
    clearcoatRoughness: 0.1, 
    reflectivity: 0.9, 
  });

  

  const atlas = new MeshStandardMaterial({
    map: texture_atlas,
    roughness: 0.5, 
    metalness: 0.1, 
  });

  return {
    water,
    texture_atlas,
    atlas,
  };
};
