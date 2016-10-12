precision mediump float;

// The symbols' page.
uniform sampler2D texSymbols;

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
  gl_FragColor = texture2D( texSymbols, vec2( x, y ) );
  float intensity = gl_FragColor.r + gl_FragColor.g + gl_FragColor.b;
  if (intensity < 1.0 / 256.0) gl_FragColor.a = 0.0;
}
