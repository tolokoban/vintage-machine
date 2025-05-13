# LAYER

## `LAYER( $index_calque )`

TLK-74 utilise 3 calques pour dessiner sur l'écran.
Le calque 0 est en dessous des autres, et le 2 est au dessus.
Donc si tu dessines quelque chose sur le calque 2,
ça va cacher ce qu'il y a à cet endroit sur les calques 1 et 0.

La procédure `LAYER()` te permets de dire quel calque utiliser pour les
prochains affichages.

### Exemple

```ts
RESET()
REM On commence par dessiner l'arriere-plan
LAYER(0)
FOR $boucles IN RANGE(200) {
    MOVE(RANDOM(-320, 320), RANDOM(-240, 240))
    COLOR(2)
    $rayon = RANDOM(10, 100)
    DISK($rayon + 2)
    COLOR(0)
    DISK($rayon)
}

REM Et on met quelque trucs en avant plan
LAYER(2)
INK(150, 15, 8, 0, 8)
FOR $boucles IN RANGE(20) {
    MOVE(RANDOM(-320, 320), RANDOM(-240, 240))
    COLOR(15)
    RECT(40)
    COLOR(150)
    RECT(30)
}

REM Maintenant on peut animer le calque du milieu
LAYER(1)
$x = RANDOM(160, 320)
$y = RANDOM(60, 120)
$vx = 0
$vy = 1
$vitesse = 0.01
WHILE 1 {
    CLS()
    MOVE($x, $y)
    COLOR(24)
    DISK(100)
    COLOR(0)
    DISK(50)
    IF $x > 0 { $vx = $vx - $vitesse }
    ELSE { $vx = $vx + $vitesse }
    IF $y > 0 { $vy = $vy - $vitesse }
    ELSE { $vy = $vy + $vitesse }
    $x = $x + $vx
    $y = $y + $vy
    PAUSE()
}
```
