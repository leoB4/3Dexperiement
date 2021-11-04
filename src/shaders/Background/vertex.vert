uniform float uTime;
uniform float uPositionMultiplier;
uniform float uDirMultiplier;
uniform float colorMultiplier;

varying float vColorMix;
varying vec3 vColor;

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
  vColor = palette(pos.x*0.1 + uTime*0.05, colorA, colorB, colorC, colorD, colorMultiplier);
}