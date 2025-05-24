# Mélange les couleurs

Fait varier les canaux de couleurs pour trouver la bonne.

```ts
RESET()
INK(0,0,0,0)
INK(202, 15, 0, 0)
INK(203, 0, 15, 0)
INK(204, 0, 0, 15)
INK(30, 0, 0, 0, 12)
INK(31, 15, 15, 15)
$debut = 1

DEF HELP() {
  LAYER(1)
  MODE("alpha")
  CLS(30)
  COLOR(31)
  MOVE(0, -200)
  LABEL("COLOR", 2)
  LOCATE(2,10) PRINT("Change  la  couleur  du")
  LOCATE(2,11) PRINT("petit disque pour qu'il")
  LOCATE(2,12) PRINT("disparaisse.")
  LOCATE(2,14) PRINT("Utilise les lettres ")
  COLOR(202) PRINT("R,r") COLOR(31) PRINT(",")
  LOCATE(2,15) COLOR(203) PRINT("G,g") COLOR(31)
  PRINT(",") COLOR(204) PRINT("B,b")
  COLOR(31) PRINT(" sur ton clavier")
  LOCATE(2,16) PRINT("pour changer les canaux")
  LOCATE(2,17) PRINT("rouge, vert et bleu.")
  LOCATE(2,26) PRINT("Appuie sur une touche pour commencer !")
  $touche = WAIT()
  CLS()
}

DEF CIRCLES() {
  LAYER(0)
  DRAW("M-160,-120 C202 D50 C102 D40")
  DRAW("M-160,0 C203 D50 C103 D40")
  DRAW("M-160,120 C204 D50 C104 D40")
  COLOR(0)
  MOVE(-230,0) RECT(32,480)
  COLOR(31)
  MOVE(-230,-120) LABEL(@rr)
  MOVE(-230,0) LABEL(@gg)
  MOVE(-230,120) LABEL(@bb)
}
DEF COLORS() RETURN [RANDOM(16),RANDOM(16),RANDOM(16)]

WHILE 1 {
  $[r,g,b] = COLORS()
  INK(100, $r, $g, $b)
  $[rr,gg,bb] = COLORS()
  CLS()
  DRAW("M120,0C100D200C101D120")
  $boucle = 1
  WHILE $boucle {
    INK(101, $rr, $gg, $bb)
    INK(102, $rr, 0, 0)
    INK(103, 0, $gg, 0)
    INK(104, 0, 0, $bb)
    CIRCLES()
    IF $debut {
      $debut = 0
      HELP()
    }
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
    if ($rr==$r)AND($gg==$g)AND($bb==$b) {
      $boucle = 0
    }
  }
  LAYER(0)
  DRAW("M-160,-120 C202 D50 C102 D40")
  DRAW("M-160,0 C203 D50 C103 D40")
  DRAW("M-160,120 C204 D50 C104 D40")
  LAYER(1)
  COLOR(31)
  FOR $i IN RANGE(100) {
    CLS(30)
    MOVE(0,0)
    LABEL("Bravo !", $i / 20)
    PAUSE()
  }
  $touche = WAIT()
}
```
