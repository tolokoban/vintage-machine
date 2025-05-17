Aujourd'hui, nous allons créer, ensemble, un jeu de casse briques.

Le joueur possède une raquette qu'il utilise pour casser des briques à l'aide
d'une balle. S'il casse toutes les briques, ils gagne et passe au niveau suivant.
Si la balle lui échappe, il perd une vie. Quand il n'a plus de vie, il a perdu la partie.

## Dessiner les briques

Les briques sont deux fois pus hautes que larges, et dans un tableau, on peut en mettre
8 verticalement.

Créons une fonction qui dessine une brique, et utilisons là pour en afficher 4 :

```ts
RESET()
DEF BRIQUE($x, $y) {
  MOVE($x, $y)
  DRAW("C100m0,8R14,30")
}

BRIQUE(0, 0)
BRIQUE(0, 32)
BRIQUE(16, 16)
BRIQUE(16, 16 + 32)
```

> Pas mal ! Mais elles font un peu plates, non ?

C'est vrai. Rajoutons des reflets et des ombres alors.

```ts
RESET()
DEF BRIQUE($x, $y) {
  MOVE($x, $y + 8)
  DRAW("C100R14,30")
  DRAW("C102(m0,13R14,2)(m-6,0R2,28)") REM Ombre
  DRAW("C101(m0,-13R14,2)(m6,0R2,28)") REM Reflet
}

FOR $x IN RANGE(-32, 32, 32) {
  FOR $y IN RANGE(-64, 64, 32) {
    BRIQUE($x, $y)
    BRIQUE($x + 16, $y + 16)
  }
}
```

> Bof... Je ne vois pas beaucoup de changement là.

C'est vrai que ça ne se voit pas, mais tout est là !

La brique est dessinée avec la couleur 100, le reflet avec la couleur 101 et l'ombre avec la 102.
Écrivont une procédure qui permet d'assigner une couleur à cette brique et calculer automatiquement
la couleur du reflet et de l'ombre.

```ts
RESET()
DEF BRIQUE($x, $y) {
  MOVE($x, $y + 8)
  DRAW("C100R14,30")
  DRAW("C102(m0,13R14,2)(m-6,0R2,28)") REM Ombre
  DRAW("C101(m0,-13R14,2)(m6,0R2,28)") REM Reflet
}

DEF COULEUR_BRIQUE($rouge, $vert, $bleu) {
  $a = 30
  $b = 3
  INK(100, $rouge, $vert, $bleu)
  INK(101, ($a + $rouge) / $b, ($a + $vert) / $b, ($a + $bleu) / $b)
  INK(102, $rouge/2, $vert/2, $bleu/2)  
}

COULEUR_BRIQUE(15, 10, 0)

FOR $x IN RANGE(-32, 32, 32) {
  FOR $y IN RANGE(-64, 64, 32) {
    BRIQUE($x, $y)
    BRIQUE($x + 16, $y + 16)
  }
}
```

> C'est mieux.
> Mais j'aimerais avoir des briques incassables, en plus ce celles-là.

OK, alors il nous faut deux plages de couleurs :

- (100, 101, 102) pour les briques cassables (`BRIQUE1`).
- (103, 104, 105) pour les incassables (`BRIQUE2`).

Utilisons une procédure commune pour cela :

```ts
RESET()
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

FOR $x IN RANGE(-32, 32, 32) {
  FOR $y IN RANGE(-128, 144, 32) {
    BRIQUE1($x, $y)
    BRIQUE2($x + 16, $y + 16)
  }
}
```
