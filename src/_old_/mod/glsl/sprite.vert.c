// attPosition.x is +1 or -1
// attPosition.y is +1 or -1
attribute vec2 attPosition;

// In Tlk-space: 640x480.
uniform float uniDstW;
uniform float uniDstH;
uniform float uniCenterX;
uniform float uniCenterY;


const float W = 2.0 / 640.0;
const float H = 2.0 / 480.0;


varying vec2 varUV;


void main() {
  float cx = uniCenterX * W - 1.0;
  float cy = uniCenterY * H - 1.0;
  float x = attPosition.x * uniDstW * W;
  float y = attPosition.y * uniDstH * H;

  gl_Position = vec4( cx + x, cy + y, 0.0, 1.0 );
  varUV = vec2( attPosition.x + .5, attPosition.y + .5 );
}
