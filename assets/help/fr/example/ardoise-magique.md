# Ardoise magique

- Déplace le pinceau avec 1, 2, 3, 4, 5, 6, 7, 8 et 9.
- Change l'orientation du pinceau avec + et -.
- Si tu appuies sur Espace pendant ton déplacement, le pinceau ne touche plus la feuille.

```ts
RESET()
$x = 0
$y = 0
$angle = 30
WHILE 1 {
    LAYER(1)
    CLS()
    MOVE($x, $y)
    COLOR(15)
    RECT(32,2,$angle)
    IF NOT(KEY(" ")) {
      LAYER(0)
      COLOR(11)
      RECT(32,2,$angle)
    }
    $vx = 0
    $vy = 0
    IF KEY("4") $vx = -1
    ELIF KEY("6") $vx = +1
    ELIF KEY("8") $vy = -1
    ELIF KEY("2") $vy = +1
    ELIF KEY("7") { $vx = -1 $vy = -1 }
    ELIF KEY("9") { $vx = +1 $vy = -1 }
    ELIF KEY("3") { $vx = +1 $vy = +1 }
    ELIF KEY("1") { $vx = -1 $vy = +1 }
    ELIF KEY("+") $angle = $angle + 1
    ELIF KEY("-") $angle = $angle - 1
    $x = $x + $vx
    $y = $y + $vy
    PAUSE()
}
```
