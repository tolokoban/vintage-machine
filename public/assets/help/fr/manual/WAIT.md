# WAIT

## `WAIT()`

Attend que le joueur tape une touche et retourne la valeur de cette touche.

### Exemple 1

```ts
RESET()
PRINTLN("Tape des touches, puis ENTER pour finir")
$touche = ""
COLOR(11)
WHILE $touche<>"Enter" {
  $touche=WAIT()
  PRINT($touche, " ")
  REM Si tu ne mets pas de pause,
  REM tu ne verras rien à l'écran.
  PAUSE()
}
PRINTLN()
COLOR(24)
PRINTLN("C'est fini.")
```

### Exemple 2

Voici un petit jeu où tu dois augmenter/dimunuer le niveau de rouge/vert/bleu
pour que le petit cercle ait la même couleur que le grand.

- Tape sur "r" pour réduire le rouge.
- Tape sur "R" pour augmenter le rouge.
- Tape sur "g" pour réduire le vert.
- Tape sur "G" pour augmenter le vert.
- Tape sur "b" pour réduire le bleu.
- Tape sur "B" pour augmenter le bleu.

```ts
RESET()
$r = RANDOM(16)
$g = RANDOM(16)
$b = RANDOM(16)
INK(0,0,0,0)
INK(100, $r, $g, $b)
$rr = RANDOM(16)
$gg = RANDOM(16)
$bb = RANDOM(16)
CLS()
DRAW("M0,0C100D200C101D120")
WHILE 1 {
  INK(101, $rr, $gg, $bb)
  $k = WAIT()
  IF $k == "r" $rr = $rr - 1
  ELIF $k == "R" $rr = $rr + 1
  ELIF $k == "g" $gg = $gg - 1
  ELIF $k == "G" $gg = $gg + 1
  ELIF $k == "b" $bb = $bb - 1
  ELIF $k == "B" $bb = $bb + 1
  $rr = CLAMP($rr, 0, 15)
  $gg = CLAMP($gg, 0, 15)
  $bb = CLAMP($bb, 0, 15)
}
```
