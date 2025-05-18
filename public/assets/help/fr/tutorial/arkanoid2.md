Il nous faut maintenant un moyen de créer facilement différents tableaux,
en plaçant les briques où on veut.

Pour cela, on va utiliser du texte, et dessiner un tableau comme ça :

```ts
$tableau = [
    "()()()()()()()()()()",
    " ()()()()  ()()()() ",
    "  ()[]()    ()[]()  ",
    "   ()()      ()()  ",
]
```

On dira que les parenthèses représentent les briques normales,
et les crochets les briques incassables.

On va donc écrire une procédure comme celle-ci :

```ts
DEF BRIQUE($x, $y, $color) {
  MOVE($x, $y + 8)
  DRAW("C", $color, "R14,30")
  DRAW("C", $color+2, "(m0,13R14,2)(m-6,0R2,28)") REM Ombre
  DRAW("C", $color+1, "(m0,-13R14,2)(m6,0R2,28)") REM Reflet
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

COULEUR_BRIQUE1(15, 10, 0)
COULEUR_BRIQUE2(10, 10, 10)

REM ===================================

DEF DESSINER_TABLEAU($tableau) {
  $x0 = 0
  $y0 = 0
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
      $y = $y + 20
    }
    $x = $x - 5
  }
}

$tableau = [
    "()()()()()()()()()()",
    " ()()()()  ()()()() ",
    "  ()[]()    ()[]()  ",
    "   ()()      ()()  ",
]

DESSINER_TABLEAU($tableau)
```

Si tu te sens fortiche, essaie de corriger cette procédure pour qu'elle affiche le tableau
comme il faut.

<details>
<summary>Solution...</summary>

```ts
DEF BRIQUE($x, $y, $color) {
  MOVE($x, $y + 8)
  DRAW("C", $color, "R14,30")
  DRAW("C", $color+2, "(m0,13R14,2)(m-6,0R2,28)") REM Ombre
  DRAW("C", $color+1, "(m0,-13R14,2)(m6,0R2,28)") REM Reflet
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

COULEUR_BRIQUE1(15, 10, 0)
COULEUR_BRIQUE2(10, 10, 10)

REM ===================================

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

CLS()
$tableau = [
    "()()()()()()()()()()",
    " ()()()()  ()()()() ",
    "  ()[]()    ()[]()  ",
    "   ()()      ()()  ",
]

DESSINER_TABLEAU($tableau)
```

</details>
