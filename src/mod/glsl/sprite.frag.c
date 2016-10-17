precision mediump float;

// The symbols' page.
uniform sampler2D texSymbols;
// The pencils used.
uniform sampler2D texPencils;

// Coords of the current pixel. (0,0) is le left bottom one and (1,1) is the upper right one.
varying vec2 varUV;

// In pixels of the symbols' page.
uniform float uniSrcX;
uniform float uniSrcY;
uniform float uniSrcW;
uniform float uniSrcH;


void main() {
  float x = ( varUV.x * uniSrcW + uniSrcX ) / 256.0;
  float y = ( (1.0 - varUV.y) * uniSrcH + uniSrcY ) / 256.0;
  float color = texture2D( texSymbols, vec2( x, y ) ).r * 256.0;
  if (color < 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  } else {
    color =  color / 64.0;
    gl_FragColor = vec4(color, color, color, 1.0);
  }
}
