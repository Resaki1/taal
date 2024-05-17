import { useTexture } from '@react-three/drei';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { BoxGeometry, Color, LinearFilter, MeshPhysicalMaterial,MeshStandardMaterial, NearestFilter, LinearMipmapLinearFilter } from 'three';
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
    roughness: 0.1, // Niedrigere Rauheit für glänzenderes Wasser
    clearcoat: 1.0, // Klarlack für zusätzliche Glanzschicht
    clearcoatRoughness: 0.1, // Rauheit der Klarlackschicht
    reflectivity: 0.9, // Hohe Reflektivität für Spiegelungen
  });

  

  const atlas = new MeshStandardMaterial({
    map: texture_atlas,
    roughness: 0.5, // Mittlere Rauheit für ein ausgewogenes Aussehen
    metalness: 0.1, // Geringer Metallgehalt für natürliche Oberflächen
  });

  return {
    water,
    texture_atlas,
    atlas,
  };
};
