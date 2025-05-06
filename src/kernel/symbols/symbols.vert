// attPosition.x is +1 or -1
// attPosition.y is +1 or -1
attribute vec2 attPos;
// UV coordinates are either 0 or 1.
attribute vec2 attUV;

// Double of the inverse of screen width/height in pixels.
uniform vec2 uniScreenSizeInverse;
// Screen coordinates of the center, in pixels.
// The center of the screen is at (0,0).
uniform vec2 uniCenter;
// Size of the symbol in pixels divided by 256;
uniform vec2 uniSymbolSize;
// Position of the top left corner of the symbol,
// expressed in pixels divided by 256.
uniform vec2 uniSymbolCorner;

varying vec2 varUV;

void main() {
    vec2 center = uniCenter * uniScreenSizeInverse;
    vec2 point = 128.0 * uniSymbolSize * attPos;   // Later, we will add rotation and scale.
    gl_Position = vec4(center + point * uniScreenSizeInverse, 0.0, 1.0);
    varUV = uniSymbolCorner + uniSymbolSize * attUV;
}
