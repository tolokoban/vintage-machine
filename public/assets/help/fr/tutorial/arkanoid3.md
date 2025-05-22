## Contrôler la raquette avec la souris

Voici le code pour dessiner une raquette qui suit la souris :

```ts
RESET()
DEF RAQUETTE() {
  $r = 32
  $x = -308.5
  $y = CLAMP(MOUSEY(), -84 + $r, 224 - $r)
  MOVE($x, $y)
  DRAW("C6(m0,", 6-$r, "D6m0,",2*($r-6),"D6)C11R12,", ($r-6)*2)
}

REM Boucle infinie
WHILE 1 {
    CLS()
    RAQUETTE()
    PAUSE()
}
```

La partie la plus importante (et qu'il faut expliquer un peu) est la suivante :

```ts
$r = 32
$y = CLAMP(MOUSEY(), -84 + $r, 224 - $r)
```

La fonction `MOUSEY()` retourne la position Y de la souris __quand le bouton est enfoncé__.
Il existe aussi une fonction `MOUSEX()` pour la position X, si besoin.

Et pour limiter le déplacement de la raquette, on utilise la fonction `CLAMP(valeur, min, max)`.

Si cette fonction (très pratique) n'existait pas, tu aurais pu l'écrire comme ça :

```ts
DEF MA_FONCTION_CLAMP($val, $min, $max) {
  IF $val < $min { RETURN $min }
  IF $val > $max { RETURN $max }
  RETURN $val
}
REM BEGIN Afficher la valeur Y de la souris
WHILE 1 {
    CLS()
    MOVE(0,0)
    $r = 32
    LABEL(INT(MA_FONCTION_CLAMP(MOUSEY(), -84 + $r, 224 - $r)), 5)
    PAUSE()
}
```
