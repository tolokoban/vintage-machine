# MOVE() et MOVER()

## `MOVE( $x, $y )`

Le curseur est un point invisible qui permet de savoir où
TLK-74 doit dessiner.
Pour le placer, on utilise les coordonnées X et Y.

Sur l'écran, le centre se trouve en (X=0, Y=0).

- __X__ est compris entre -320 (bord gauche) et + 320 (bord droit)
- __Y__ est compris entre -240 (bord haut) et +240 (bord bas)

### Exemple

Afficher 4 ellipses qui se touchent.

```ts
RESET()
$w0 = 160
$h0 = 120
FOR $c IN RANGE(1, 10) {
  $w = $w0 / $c
  $h = $h0 / $c
  COLOR($c)
  INK($c, 16 - $c, 10 - ($c / 2), 0)
  MOVE(-$w, -$h) DISK($w, $h)
  MOVE(-$w, +$h) DISK($w, $h)
  MOVE(+$w, -$h) DISK($w, $h)
  MOVE(+$w, +$h) DISK($w, $h)
}
```

## `MOVER( deltaX, deltaY )`

Le __R__ à la fin signifie _relative_ (relatif).
Ça veut dire qu'on ne va pas mettre le curseur à la position demandée, mais qu'on va le déplacer par rapport à sa position actuelle.

### Exemple

```ts
RESET()
MOVE(-320, -240)
FOR $i IN RANGE(20) {
    COLOR(RANDOM(30))
    DISK(20)
    MOVER(32, 24)
}
```

Voir aussi [LOCATE](LOCATE).
