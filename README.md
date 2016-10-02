# vintage-machine
Virtual old-fashion machine to learn basic concepts of computer programming.


## Graphic model

The Tlk-64 has 4 overlayed screens of 640x480 pixels. Pixels can take up to 64 different colors taken from a palette of 100x100x100 nuances.
Color 0 has a special meaning in screens 1, 2 and 3: full transparency.
Screen 3 is over screen 2, which is over screen 1, etc.
Blending is allowed between screens.

```
// In WebGL, we can mask color channels like this.
gl.colorMask( true, false, false, false );
```

