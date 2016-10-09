precision mediump float;

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
  return texture2D( texPalette, vec2(color, .5) );
}


void main() {
  float x = mod( varUV.x, 1.0 );
  float y = mod( varUV.y, 1.0 );

  vec4 color = texture2D( texSource, vec2(x, y) );
  // Start with a full transparent color with tint of the pen 0 of the palette.
  vec4 target = vec4( texture2D( texPalette, vec2(0.0, 0.0) ).rgb, 0.0 );

  target = blend( target, color.r );
  target = blend( target, color.g );
  target = blend( target, color.b );
  target = blend( target, color.a );
  
  gl_FragColor = target;
}
