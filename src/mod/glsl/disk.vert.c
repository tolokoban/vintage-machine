uniform float uniX;
uniform float uniY;
uniform float uniW;
uniform float uniH;

attribute vec2 attPosition;

const float W = 2.0 / 640.0;
const float H = 2.0 / 480.0;

varying vec2 varPosition;

void main() {
  varPosition = attPosition;
  float x = (uniX + attPosition.x * uniW) * W - 1.0;
  float y = (uniY + attPosition.y * uniH) * H - 1.0;
  gl_Position = vec4( x, y, 0.0, 1.0 );
}
