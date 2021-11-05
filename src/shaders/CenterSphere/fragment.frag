varying vec2 vUv;
varying float vDistort;

uniform float uTime;
uniform float uIntensity;
uniform vec3 uBrightness;
uniform vec3 uContrast;
uniform vec3 uOscilation;
uniform vec3 uPhase;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(2.28318 * (c * t + d));
}     

void main() {
  float distort = vDistort * uIntensity;
  
  vec3 brightness = uBrightness;
  vec3 contrast = uContrast;
  vec3 oscilation = uOscilation;
  vec3 phase = uPhase;
  // vec3 brightness = vec3(0.8863, 0.4784, 0.4784);
  // vec3 contrast = vec3(0.5686, 0.8314, 0.5451);
  // vec3 oscilation = vec3(1.0, 1.0, 1.0);
  // vec3 phase = vec3(0.7647, 0.8078, 0.8549);

  vec3 color = cosPalette(distort, brightness, contrast, oscilation, phase);
  
  gl_FragColor = vec4(color, 1.0);
}  