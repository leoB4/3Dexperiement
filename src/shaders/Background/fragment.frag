varying float vColorMix;
varying vec3 vColor;

#define colorA vec3(0.5922, 0.3647, 0.8471)
#define colorB vec3(0.0784, 0.5882, 0.5451)

void main() {
  vec3 color = vec3(1.0,1.0,1.0);

  
  color = mix(colorA, vColor, 0.8);

  gl_FragColor = vec4(color, 1.0);
}