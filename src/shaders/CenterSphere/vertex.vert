varying float vDistort;

uniform float uTime;
uniform float uSpeed;
uniform float uNoiseDensity;
uniform float uNoiseStrength;
uniform float uFrequency;
uniform float uAmplitude;

varying float vColorMix;
varying vec3 vColor;

#pragma glslify: noise = require(../modules/pnoise.glsl);
#pragma glslify: rotateY = require(../modules/rotateY.glsl);
#pragma glslify: palette = require(../modules/palette.glsl)

void main() {
  float t = uTime * uSpeed;
  float distortion = noise((normal + t), vec3(10.0) * uSpeed+ uNoiseDensity) * uNoiseStrength;

  vec3 pos = position + (normal * distortion) ;

  float angle = sin(uv.y * uFrequency + t) * uAmplitude;
  pos = rotateY(pos, angle);

  vDistort = distortion;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vColorMix = vDistort * uAmplitude;
  vColor = palette(vColorMix + uTime*0.05, colorE, colorF, colorC, colorD);
}