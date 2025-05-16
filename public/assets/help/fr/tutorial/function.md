
## Créer sa propre procédure

Ce serait bien d'avoir une procécure qui dessine un mickey.
On pourrrait même l'appeler `MICKEY()` pour s'en souvenir facilement.

> On peut faire ça ?

Oui. Il suffit d'apprendre cette nouvelle procédure à TLK-74 grace à l'instruction
`DEF ...`.

```ts
RESET()
REM Ici, on déclare une procédure appelée MICKEY
DEF Mickey() {
  $oeil = "C1D24,34C26D20,30C1m5,10D13"
  DRAW(
    "C1D100(m-90,-90D70)(m90,-90D70)",
    "(C1m5,55D100,45C26D96,41)",
    "C26(m-25,-10D45,60)(m25,-10D45,60)",
    "(m-25,-10", $oeil, ")",
    "(m25,-10", $oeil, ")",
    "(m5,27C1D20)",
    "(C1m10,60R50,2)",
  )
}

REM Et après, on peut l'utiliser comme n'importe quelle autre procédure
CLS(11)
MOVE(-160,-80)
MICKEY()
MOVE(160,-80)
MICKEY()
MOVE(0,140)
MICKEY()
```

## Utiliser ses propres arguments

Pour donner plus de personnalité à notre Mickey, il faudrait pouvoir changer la direction
de son regard, par exemple.
Pour cela, on va utiliser deux arguments :

* `$horizontal` : __-1__ regarde `a gauche, __0__ au milieu et __+1__ à droite.
* `$vertical` : __-1__ regarde `en haut, __0__ au milieu et __+1__ en bas.

```ts
RESET()
DEF Mickey($horizontal, $vertical) {
  $oeil = "C1D24,34C26D20,30C1m" + (8 * $horizontal) + "," +
    (13 * $vertical) + "D13"
  DRAW(
    "C1D100(m-90,-90D70)(m90,-90D70)",
    "(C1m5,55D100,45C26D96,41)",
    "C26(m-25,-10D45,60)(m25,-10D45,60)",
    "(m-25,-10", $oeil, ")",
    "(m25,-10", $oeil, ")",
    "(m", 5 * $horizontal, ",27C1D20)",
    "(C1m", 10 * $horizontal, ",60R50,2)",
  )
}

CLS(11)
MOVE(-160,-80)
MICKEY(-1, -1)
MOVE(160,-80)
MICKEY(+1, +1)
MOVE(0,140)
MICKEY(0, 0)
```

On peut même faire un petite animation rigolote.

```ts
RESET()
DEF Mickey($horizontal, $vertical) {
  $oeil = "C1D24,34C26D20,30C1m" + (8 * $horizontal) + "," +
    (13 * $vertical) + "D13"
  DRAW(
    "C1D100(m-90,-90D70)(m90,-90D70)",
    "(C1m5,55D100,45C26D96,41)",
    "C26(m-25,-10D45,60)(m25,-10D45,60)",
    "(m-25,-10", $oeil, ")",
    "(m25,-10", $oeil, ")",
    "(m", 5 * $horizontal, ",27C1D20)",
    "(C1m", 10 * $horizontal, ",60R50,2)",
  )
}

WHILE 1 {
  $t = TIME()
  CLS(11)
  MOVE(-160,-80)
  $t1 = $t / 10
  $t2 = $t / 21
  MICKEY(SIN($t1), SIN($t2))
  MOVE(160,-80)
  $t1 = $t / 27
  $t2 = $t / 23
  MICKEY(SIN($t1), SIN($t2))
  MOVE(0,140)
  $t1 = $t / -17
  $t2 = $t / 36
  MICKEY(SIN($t1), SIN($t2))
  PAUSE()
}
```

> Il ne se fatigue jamais le Mickey !
> Comment je l'arrête ?

Le bouton __RUN__ s'est rransformé en __STOP__. Clique dessus et c'est fini.

> Il y a deux nouvelles fonctions là.
> C'est quoi `TIME()` et `SIN()` ?

`TIME()` te retourne l'heure actuelle avec une précision du milliseconde.
En fait, ça te renvoit exactement le nombre de millisecondes écoulées depuis le 1er Janvier 1970.

Et `SIN()` est la fonction que les mathématitiens appellent __sinus__.
Elle a un _compagnon_ qui s'appelle le __cosinus__ (`COS()`).
Ces fonctions retournent des valeurs qui oscillent entre -1 et +1.
En prenant tout plein de valeurs à virgules.

Regarde l'animation suivante pour essayer de sentir ce que ces fonctions font, et comment elles peuvent te servir dans tes animations.

```ts
RESET()

```
