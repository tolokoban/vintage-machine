attribute vec2 attPosition;

const float W = 2.0 / 640.0;
const float H = 2.0 / 480.0;

varying vec2 varUV;

void main() {
  gl_Position = vec4( attPosition.x * W, attPosition.y * H, 0.0, 1.0 );
  varUV = vec2( attPosition.x * W, attPosition.y * H );
}
