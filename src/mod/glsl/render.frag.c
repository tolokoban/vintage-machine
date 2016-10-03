precision mediump float;

// The framebuffer
uniform sampler2D uniSource;

varying vec2 varUV;


void main() {
  float x = mod(varUV.x, 1.0);
  float y = mod(varUV.y, 1.0);
  vec4 color = texture2D( uniSource, vec2(x, y) );
  gl_FragColor = vec4( vec3(color.r + color.g + color.b + color.a) / 4.0, 1.0 );
}
