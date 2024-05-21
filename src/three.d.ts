import 'three';

declare module 'three' {
  interface UniformValue {
    value:
      | THREE.Texture
      | number
      | THREE.Vector2
      | THREE.Vector3
      | THREE.Vector4
      | THREE.Color
      | THREE.Matrix3
      | THREE.Matrix4
      | THREE.DataTexture
      | Array<number>
      | Array<THREE.Vector2>
      | Array<THREE.Vector3>
      | Array<THREE.Vector4>
      | Array<THREE.Matrix4>
      | Array<THREE.Texture>;
  }

  interface Shader {
    uniforms: { [key: string]: UniformValue };
    vertexShader: string;
    fragmentShader: string;
  }
}
