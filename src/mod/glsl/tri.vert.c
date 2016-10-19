attribute vec2 attPosition;
attribute vec4 attColor;

const float W = 2.0 / 640.0;
const float H = 2.0 / 480.0;

varying vec4 varColor;

void main() {
  varColor = attColor;
  gl_Position = vec4( attPosition.x * W - 1.0, attPosition.y * H - 1.0, 0.0, 1.0 );
}
