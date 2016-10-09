precision mediump float;

// Time for blinking.
uniform float uniTime;
// The framebuffer
uniform sampler2D texSource;
// The palette
uniform sampler2D texPalette;
// Coords of the current pixel. (0,0) is le left bottom one and (1,1) is the upper right one.
varying vec2 varUV;
// Under this threshold, we consider the color is 0.
const float threshold = 1.0 / 64.0;


vec4 blend( vec4 target, float color ) {
  if (color < threshold) return target;
  //float y = (1.0 + sin(uniTime * 0.0031415926535897933)) * 0.5;
  float y = mod(uniTime * 0.0005, 2.0);
  if (y > 1.0) y = 2.0 - y;
  vec4 c1 = texture2D(texPalette, vec2(color, .5));
  vec4 c2 = texture2D(texPalette, vec2(color, 1.5));
  return mix(c1, c2, y);
}


void main() {
  float x = mod( varUV.x, 1.0 );
  float y = mod( varUV.y, 1.0 );

  if (y < .1) {
    gl_FragColor = texture2D( texPalette, vec2(x, y * 10.0) );
    return;
  }

  vec4 color = texture2D( texSource, vec2(x, y) );
  // Start with a full transparent color with tint of the pen 0 of the palette.
  vec4 target = vec4( texture2D( texPalette, vec2(0.0, 0.0) ).rgb, 0.0 );

  target = blend( target, color.r );
  target = blend( target, color.g );
  target = blend( target, color.b );
  target = blend( target, color.a );
  
  gl_FragColor = target;
}
