# Les coordonnées fines

Avec `LOCATE`, on a vu un système de coordonnées bien adapté aux textes.
Mais il existe un autre système, plus fin, qui permet de placer les choses
avec plus de précision.

Essaie ceci, par exemple :
```
MOVE 100, 100
PRINT "+"
MOVE 108, 104
PRINT "+"
MOVE 116, 108
PRINT "+"
MOVE 124, 112
PRINT "+"
```

Cette mignonne petite guirlande est faite avec des "+" placés suffisamment près
les uns des autres grâce à l'instruction [`MOVE`](ins.move).

Avec cette instruction, on a __640 colonnes__ et __480 lignes__.
Mais attention ! A la différence de `LOCATE`, les lignes partent du bas.
C'est-à-dire que la ligne 0 du `MOVE` est la ligne tout en bas, alors qu'avec
`LOCATE` c'est la ligne du haut.

Ce système de coordonnées est celui qui est le plus utilisé par __TLK-74__.
Car on peut affichier autre chose que du texte.
Des rectangles ([`BOX`](ins.box)) et des disques ([`DISK`](ins.disk)), par exemple.

```
PEN &FF0
MOVE 320, 240
DISK 200
# Le blanc des yeux
PEN &FFF
MOVE 320 + 60, 240 + 60
DISK 30, 50
MOVE 320 - 60, 240 + 60
DISK 30, 50
# Le bleu des yeux
PEN &005
MOVE 320 + 60, 240 + 40
DISK 20, 30
MOVE 320 - 60, 240 + 40
DISK 20, 30
# La Bouche
PEN &A00
MOVE 320, 240 - 100
DISK 100, 40
PEN &FF0
MOVE 320, 240 - 80
DISK 120, 40
```

Amuse-toi à modifier ce programme tant que tu veux.
Examine surtout comment on dessine la bouche.
Et quand tu as bien compris,
essaie de faire une tête de Mickey.

----

* Chapitre suivant : []()
* Chapitre précédent : [Les coordonnées](coords)
