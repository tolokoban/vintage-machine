# TRI

## `TRI( [ x,y, x,y, x,y, ... ] )`

Dessine un ou plusieurs triangles centrés sur la position courante du curseur.

### Exemple

```ts
RESET()
FOR $y IN RANGE(-180, +200, 60) {
  MOVE(0, $y)
  TRI([0, -60, -50, 30, 50, 30])
}
```

----

Voir aussi [DISK](DISK), [RECT](RECT), [DRAW](DRAW).
