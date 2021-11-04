#define colorA vec3(0.5176, 0.3686, 0.8667)
#define colorB vec3(0.3686, 0.6431, 0.8667)
#define colorC vec3(1.0, 1.0, 1.0)
#define colorD vec3(0.00, 0.10, 0.20)
#define colorE vec3(0.8667, 0.651, 0.0549)
#define colorF vec3(0.1059, 0.8039, 0.9255)

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d, in float colorMultiplier ) {
  return a + b*cos( colorMultiplier*(c*t+d) );
}

#pragma glslify: export(palette)