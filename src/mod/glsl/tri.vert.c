attribute vec2 attPosition;
attribute float attColor;

const float W = 2.0 / 640.0;
const float H = 2.0 / 480.0;

varying float varColor;

void main() {
  varColor = clamp( attColor, 0.0, 63.0 ) / 63.0;
  gl_Position = vec4( attPosition.x * W - 1.0, attPosition.y * H - 1.0, 0.0, 1.0 );
}
