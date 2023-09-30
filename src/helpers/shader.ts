import { Shader, Texture } from 'three';
import { Terrain } from './terrain';

export const tileShader = (shader: Shader, texture: Texture) => {
  shader.uniforms.texAtlas = { value: texture };
  shader.vertexShader = `
    	attribute float texIdx;
    	varying float vTexIdx;
      ${shader.vertexShader}
    `.replace(
    `void main() {`,
    `void main() {
      	vTexIdx = texIdx;
      `,
  );
  shader.fragmentShader = `
    	uniform sampler2D texAtlas;
    	varying float vTexIdx;
      ${shader.fragmentShader}
    `.replace(
    `#include <map_fragment>`,
    `#include <map_fragment>
      	
       	vec2 blockUv = ${
          1 / (Terrain.MOUNTAIN + 1) /* last value of Terrain enum + 1 */
        } * (floor(vTexIdx + 0.1) + vUv); 
        vec4 blockColor = texture(texAtlas, blockUv);
        diffuseColor *= blockColor;
      `,
  );
};
