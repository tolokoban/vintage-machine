# Toutes les forets du monde

En anglais, _SEED_ veut dire graine.
Alors quoi de mieux que d'utiliser la fonction `SEED()` pour générer des forets aléatoires ?

```ts
RESET()
INK(0, 8, 8, 8)
LAYER(1)
COLOR(2)
PRINTLN()
PRINTLN("Tapes le nom de la foret")
PRINTLN("que tu veux visiter :")
PRINTLN()
COLOR(15)
$nom = ASK()
SEED($nom)
CLS()
MOVE(0, -120)
LABEL($nom, 2)
FOR $i IN RANGE(10) {
  $r = RANDOM(4,8)
  INK(100 + $i, $r, $r * RANDOMF(.2, .8), 0)
  $g = RANDOM(8, 15)
  $r = $g * RANDOMF(0, .8)
  $b = $g * RANDOMF(0, .5)
  INK(110 + $i, $r, $g, $b)
}
INK(0, RANDOM(7,9), RANDOM(7,9), RANDOM(7,9))
DEF TREE() {
  $h = random(30,60)
  $w1 = RANDOM(40,65)
  $w2 = $w1 * RANDOMF(0.5, 1)
  $w3 = $w2 * RANDOMF(0.5, 1)
  DRAW(
    "(C1m0,", -($h/2), "R24,", $h + 4, "m0,", -($h/2),
    "T2,-42,", $w1+2, ",2,", -($w1+2), ",2",
    "m0,-30 T2,-42,", $w2+2, ",2,", -($w2+2), ",2",
    "m0,-30 T2,-42,", $w3+2, ",2,", -($w3+2), ",2)"
  )
  $c0 = RANDOM(100, 109)
  $c1 = RANDOM(110, 119)
  DRAW(
    "(C", $c0, "m0,", -($h/2), "R20,", $h, "m0,", -($h/2),
    "C", $c1, "T0,-40,", $w1, ",0,", -$w1, ",0",
    "m0,-30 T0,-40,", $w2, ",0,", -$w2, ",0",
    "m0,-30 T0,-40,", $w3, ",0,", -$w3, ",0)"
  )
}
FOR $layer IN RANGE(3) {
  LAYER($layer)
  FOR $count IN RANGE(RANDOM(1, 30)) {
    $x = RANDOM(-320, 320)
    $y = $layer * 80
    MOVE($x - 640, $y) TREE()
    MOVE($x,       $y) TREE()
    MOVE($x + 640, $y) TREE()
  }
}
WHILE 1 {
  FOR $layer IN [0,1,2] {
    LAYER($layer)
    SCROLL(-(($layer + 1)), 0)
  }
  PAUSE()
}
```
