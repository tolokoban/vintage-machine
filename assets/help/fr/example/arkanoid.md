# Arkanoïd

```ts
RESET()
CLS(1)

DEF BRIQUE($x, $y, $color) {
  MOVE($x, $y + 8)
  DRAW("C", $color, "R14,30")
  DRAW("C", $color+2, "(m0,13R12,2)(m-5,0R2,28)") REM Ombre
  DRAW("C", $color+1, "(m0,-13R12,2)(m6,0R2,28)") REM Reflet
}
DEF BRIQUE1($x,$y) { BRIQUE($x, $y, 100) }
DEF BRIQUE2($x,$y) { BRIQUE($x, $y, 103) }
DEF COULEUR_BRIQUE($rouge, $vert, $bleu, $color) {
  $a = 30
  $b = 3
  INK($color, $rouge, $vert, $bleu)
  INK($color+1, ($a + $rouge) / $b, ($a + $vert) / $b, ($a + $bleu) / $b)
  INK($color+2, $rouge/2, $vert/2, $bleu/2)  
}
DEF COULEUR_BRIQUE1($r, $v, $b) { COULEUR_BRIQUE($r, $v, $b, 100) }
DEF COULEUR_BRIQUE2($r, $v, $b) { COULEUR_BRIQUE($r, $v, $b, 103) }

DEF DESSINER_TABLEAU($tableau) {
  $x0 = 296
  $y0 = -84
  $x = $x0
  FOR $ligne IN $tableau {
    $y = $y0
    FOR $c IN $ligne {
      IF $c == "(" {
        BRIQUE1($x, $y)
      }
      IF $c == "[" {
        BRIQUE2($x, $y)
      }
      $y = $y + 16
    }
    $x = $x - 16
  }
}

DEF RAQUETTE() {
  $r = 40
  $x = -312
  $y = 0
  MOVE($x, $y)
  DRAW("C6(m0,", -$r, "D6m0,",2*$r,"D6)C11R12,", $r*2)
}

COULEUR_BRIQUE1(15, 10, 0)
COULEUR_BRIQUE2(8, 8, 8)

$tableau = [
    "()()()()()()()()()()",
    " ()()()()  ()()()() ",
    "  ()[]()    ()[]()  ",
    "   ()()      ()()  "
]

RAQUETTE()

WHILE 0 {
  CLS(1)
  DESSINER_TABLEAU($tableau)
  PAUSE()
}
```
