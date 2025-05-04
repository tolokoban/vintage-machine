precision mediump float;

uniform float uniR;
uniform float uniG;
uniform float uniB;
uniform float uniA;
varying vec2 varPosition;
varying float varRadius;

void main() {
  float radius = sqrt(varPosition.x * varPosition.x + varPosition.y * varPosition.y);
  if (radius > 1.0) {
    gl_FragColor = vec4(0.0,0.0,0.0,0.0);
    return;
  }
  float alpha = uniA;
  if (radius > 1.0 - varRadius) {
    alpha *= (1.0 - radius) / varRadius;
  }
  gl_FragColor = vec4(uniR, uniG, uniB, alpha);
}
