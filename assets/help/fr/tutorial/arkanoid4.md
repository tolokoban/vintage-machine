## Faire rebondir la balle

```ts
RESET()
DEF BALLE($coords, $dt) {
  $xmin = -320
  $xmax = 320
  $ymin = -240
  $ymax = 240
  $x = $coords[0]
  $y = $coords[1]
  $vx = $coords[2]
  $vy = $coords[3]
  $x = $x + ($dt * $vx)
  $y = $y + ($dt * $vy)
  IF $x > $xmax { $vx=-$vx $x=$xmax }
  IF $x < $xmin { $vx=-$vx $x=$xmin }
  IF $y > $ymax { $vy=-$vy $y=$ymax }
  IF $y < $ymin { $vy=-$vy $y=$ymin }
  RETURN [$x, $y, $vx, $vy]
}

$coords = [0, 0, 1, 1]
$t0 = TIME()
WHILE 1 {
  CLS()
  $t1 = TIME()
  $dt = ($t1 - $t0) / 4
  $t0 = $t1
  $coords = BALLE($coords, $dt)
  $x = $coords[0]
  $y = $coords[1]
  MOVE($x, $y)
  DISK(8)
  PAUSE()
}
```
