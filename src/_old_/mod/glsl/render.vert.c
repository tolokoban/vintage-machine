attribute vec2 attPosition;

const float W = 2.0 / 640.0;
const float H = 2.0 / 480.0;

varying vec2 varUV;

void main() {
  float x = attPosition.x * W - 1.0;
  float y = attPosition.y * H - 1.0;
  gl_Position = vec4( x, y, 0.0, 1.0 );
  varUV = vec2( (x + 1.0) / 2.0, (y + 1.0) / 2.0 );
}
