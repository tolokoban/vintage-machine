# SOUND()

## `SOUND( frequence, durée )`

Émet un son d'une fréquence donnée et pendant un nombre de secondes données. Si on ne précise pas la durée, le son dure 0.1 secondes (un dixième de secondes).

La fréquence de la note LA est 440.
À l'octave du dessus, c'est 880 (le double), et à l'octave du dessous, c'est 220 (la moitié).

### Exemple

```ts
RESET()
DEF BIP() { SOUND(440, .6) }
DEF BALLE($coords, $dt) {
  $xmin = -160
  $xmax = 160
  $ymin = -120
  $ymax = 120
  $x = $coords[0]
  $y = $coords[1]
  $vx = $coords[2]
  $vy = $coords[3]
  $x = $x + ($dt * $vx)
  $y = $y + ($dt * $vy)
  IF $x > $xmax { $vx=-$vx $x=$xmax BIP() }
  IF $x < $xmin { $vx=-$vx $x=$xmin BIP() }
  IF $y > $ymax { $vy=-$vy $y=$ymax BIP() }
  IF $y < $ymin { $vy=-$vy $y=$ymin BIP() }
  RETURN [$x, $y, $vx, $vy]
}

$coords = [0, 0, RANDOMF(0.8, 1.2), RANDOMF(0.8, 1.2)]
$t0 = TIME()
WHILE 1 {
  COLOR(11)
  MOVE(0,0)
  RECT(336, 256)
  $t1 = TIME()
  $dt = ($t1 - $t0) / 4
  $t0 = $t1
  $coords = BALLE($coords, $dt)
  $x = $coords[0]
  $y = $coords[1]
  COLOR(24)
  MOVE($x, $y)
  DISK(8)
  PAUSE()
}
```
