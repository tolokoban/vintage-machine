# Les couleurs principales

```ts
RESET()
INK(0, 0, 0, 0)
INK(100, 15, 0, 0)
INK(101, 0, 15, 0)
INK(102, 0, 0, 15)
INK(200, 8, 0, 0)
INK(201, 0, 8, 0)
INK(202, 0, 0, 8)

DEF SHAKE($r, $g, $b) {
  $t = TIME() / 1000
  $r = 10
  $x = COS($t * ($r + 2.5) - ($g * 300))
  $y = SIN($t * ($g + 2.5) - ($b * 300))
  MOVER($r * $x, $r * $y)
}

WHILE 1 {
  MOVE(0, 0)
  FOR $layer IN [0,1,2] {
    LAYER($layer)
    CLS()
    MODE("add")
  }
  $index = 0
  FOR $red IN RANGE(1,2) {
    FOR $green IN RANGE(1,2) {
      FOR $blue IN RANGE(1,2) {
        $col = $index % 4
        $row = INT(($index - $col) / 4)
        MOVE(160 * ($col - 1.5), 240 * ($row - 0.5))
        $index = $index + 1
        LAYER(0)
        COLOR(0 + (100 * $red))
        MOVER(0, 25)
        SHAKE($red, $green, $blue)
        DISK(50)
        MOVER(0, -25)
        LAYER(1)
        COLOR(1 + (100 * $green))
        MOVER(-25, -15)
        SHAKE($red, $green, $blue)
        DISK(50)
        MOVER(25, 15)
        LAYER(2)
        COLOR(2 + (100 * $blue))
        MOVER(25, -15)
        SHAKE($red, $green, $blue)
        DISK(50)
        MOVER(-25, 15)
      }
    }
  }
  PAUSE()
}
```
