uniform float uTime;
uniform float uPositionMultiplier;
uniform float uDirMultiplier;
uniform float colorMultiplier;

varying float vColorMix;
varying vec3 vColor;

uniform vec3 uBrightness;
uniform vec3 uContrast;
uniform vec3 uOscilation;
uniform vec3 uPhase;

#pragma glslify: noise = require(../modules/noise.glsl)
#pragma glslify: palette = require(../modules/palette.glsl)

void main() {
  float n = noise(position*uPositionMultiplier + uTime*0.1);
  n = n*0.5 + 0.5;

  vec3 pos = position;
  vec3 dir = normalize(pos - vec3(0.0));
  pos -= dir*n*uDirMultiplier;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vColorMix = n;
  vColor = palette(pos.x*0.1 + uTime*0.05, uBrightness, uContrast, uOscilation, uPhase, colorMultiplier);
}