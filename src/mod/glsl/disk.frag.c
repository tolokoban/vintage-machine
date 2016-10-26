precision mediump float;

uniform float uniR;
uniform float uniG;
uniform float uniB;
uniform float uniA;
varying vec2 varPosition;

void main() {
  float radius = varPosition.x * varPosition.x + varPosition.y * varPosition.y;
  if (radius > 1.0) gl_FragColor = vec4(0.0,0.0,0.0,0.0);
  else gl_FragColor = vec4(uniR, uniG, uniB, uniA);
}
