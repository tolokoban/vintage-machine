precision mediump float;

// The symbols' page.
uniform sampler2D texSymbols;
uniform float uniColor;

// Coords of the current pixel. (0,0) is le left bottom one and (1,1) is the upper right one.
varying vec2 varUV;

void main() {
  float alpha = texture2D( texSymbols, varUV ).a;
  if (alpha < 0.5) discard;
  
  gl_FragColor = vec4( vec3(uniColor), 1.0);
//   if (varUV.x < 32.0 / 256.0) {
//     gl_FragColor = vec4(0, 1, 0, 1);
//   } else {
//     gl_FragColor = vec4(1, 0, 0, 1);
//   }
}
