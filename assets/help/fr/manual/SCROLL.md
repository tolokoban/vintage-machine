# SCROLL

## `SCROLL( x, y )`

Décale le calque courant du nombre de pixels donnés en arguments.

### Exemple

```ts
RESET()
FOR $c IN RANGE(100) {
  $x = RANDOM(0, 640)
  $y = RANDOM(0, 480)
  $r = RANDOM(30, 60)
  COLOR(RANDOM(256))
  MOVE($x, $y) DISK($r)
  MOVE($x - 640, $y) DISK($r)
  MOVE($x, $y - 480) DISK($r)
  MOVE($x - 640, $y - 480) DISK($r)
}
COLOR(11)
MOVE(0,0)
WHILE 1 {
  SCROLL(-2, 4 * SIN(TIME() / 100))
  DISK(2)
  PAUSE()
}
```
