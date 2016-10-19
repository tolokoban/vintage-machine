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

const float UNIT = 1.0 / 256.0;

void main() {
  float x = ( varUV.x * uniSrcW + uniSrcX ) / 256.0;
  float y = ( (1.0 - varUV.y) * uniSrcH + uniSrcY ) / 256.0;
  float color = texture2D( texSymbols, vec2( x, y ) ).r;
  // color is between 0 and 7 * UNIT.
  if (color < UNIT) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  } else {
  // The palette index is coded on the RED composant of texPencils.
    gl_FragColor = texture2D( texPencils, vec2(color * 32.0, .5) );
  }
}

