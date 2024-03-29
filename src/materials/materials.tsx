import { useTexture } from '@react-three/drei';
import { BoxGeometry, Color, MeshStandardMaterial, NearestFilter } from 'three';
import textureAtlas from '../textures/textureAtlas.jpg';

export const water = new MeshStandardMaterial({
  color: 'blue',
  emissiveIntensity: 0.2,
});

export const building = new BoxGeometry(0.5, 0.5, 0.5);

export const Materials = () => {
  const [texture_atlas] = useTexture([textureAtlas]);
  texture_atlas.minFilter = NearestFilter;
  texture_atlas.magFilter = NearestFilter;

  const water = new MeshStandardMaterial({
    color: new Color(0x0055ff),
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.9,
    metalness: 0.7,
    roughness: 0.5,
  });

  const atlas = new MeshStandardMaterial({
    map: texture_atlas,
  });

  return {
    water,
    texture_atlas,
    atlas,
  };
};
