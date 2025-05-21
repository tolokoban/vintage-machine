
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
DEF LIGNE($y, $op, $angle) {
    $w = 480 / 2
    $x = 0
    IF $op == "COS" { $valeur = COS($angle) }
    ELSe { $valeur = SIN($angle) }
    COLOR(#B)
    DRAW("M",$x,$y,"R",$w*2,2,"R1,10m",$w,0,"R1,10m",-($w*2),0,"R1,10")
    $y = $y - 24
    MOVE($x,$y) LABEL("0")
    MOVE($x-$w,$y) LABEL("-1")
    MOVE($x+$w,$y) LABEL("+1")

    COLOR(15)
    $y = $y + 24    
    MOVE($x + ($valeur*$w),$y)
    DISK(10)
    MOVER(0,24)
    LABEL($op + "( " + INT($angle) + " )")
}

WHILE 1 {
  FOR $angle IN RANGE(0, 360, .1) {
    CLS()
    LIGNE(60, "SIN", $angle)
    LIGNE(-60, "COS", $angle)
    PAUSE()
  }
}
```

## Variables globales et variables locales

Regarde cet exemple :

```ts
RESET()
$nombre = 27
DEF TEST() {
    $nombre = 11
    PRINTLN("Local: ", $nombre)
}

PRINTLN("Global: ", $nombre)
TEST()
PRINTLN("Global: ", $nombre)
```

La fonction `TEST()` assigne __11__ à la variable `$nombre`.
Pourtant, quand on l'affiche àprès avoir appelé `TEST()`,
elle est toujours à __27__. Pourquoi ?

> C'est le TLK-74 qui est tout buggué, oui !

On pourrait le croire, mais en fait, ce comportement est volontaire.

Toutes les variables assignées en dehors d'une fonction sont appelées
__variables globales__. Et celles assignées dans une fonction sont appelées
__variables locales__.

Pour éviter qu'une fonction ne modifie par erreur une variable globales,
TLK-74 crée un espace mémoire local dans chaque fonction.

Et quand tu assignes __11__ à `$nombre` dans la fonction `TEST()`,
c'est une variable qui n'est connue que de cette fonction, et qui disparaît
quand tu sors de la fonction.

Ça explique aussi pourquoi le programme suivant produit une erreur :

```ts
RESET()
DEF TEST() {
    $nombre = 1974
    PRINTLN("nombre = ", $nombre)
}

TEST()
PRINTLN("nombre = ", $nombre)
```

Si tu veux passer des valeurs à une fonction, il faut utiliser les arguments.
Car chaque argument est transformé en variable locale.

> Mais pourquoi cette limitation ?

C'est pour t'éviter de faire des bugs qui sont très compliqués à repérer et corriger.
Écrire dans une variable utilisée ailleurs peut être embêtant.

> OK, mais si je ne fais que lire une variable globale,
> quel est le problème ?

Tu as raison : il n'y a pas de problème si tu ne fais que lire.
Et tu as donc le droit de faire ça, mais il faut utiliser une syntaxe différente.

```ts
RESET()
$bonus = 1000
DEF AJOUTER_BONUS($attaque) {
    $bonus = 2000
    RETURN $attaque + $bonus + @bonus
}
PRINTLN("Attaque avec bonus : ", AJOUTER_BONUS(55))
```

Remarque qu'on a utilisé `@bonus` et pas `$bonus`.

Cet arobase (`@`) signifie qu'on veut lire la valeur de la variable __globale__.
