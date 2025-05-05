precision mediump float;

// The symbols' page.
uniform sampler2D texSymbols;
uniform float uniColor;

// Coords of the current pixel. (0,0) is le left bottom one and (1,1) is the upper right one.
varying vec2 varUV;

// In pixels of the symbols' page.
uniform float uniSrcX;
uniform float uniSrcY;
uniform float uniSrcW;
uniform float uniSrcH;

const float UNIT = 1.0 / 256.0;

void main() {
  float x = ( varUV.x * uniSrcW + uniSrcX ) / 256.0;
  float y = ( (1.0 - varUV.y) * uniSrcH + uniSrcY ) / 256.0;
  float color = texture2D( texSymbols, vec2( x, y ) ).r;
  if (color < 0.5) discard;
  
  gl_FragColor = vec4( vec3(color) * uniColor, 1.0);
}
