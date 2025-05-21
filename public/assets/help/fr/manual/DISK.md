# DISK()

## `DISK( taille )`

Dessine un cercle.

### Exemple

```ts
RESET()
MOVE(0,0)
DISK(200)
```

## `DISK( largeur, hauteur )`

Dessine une ellipse.

### Exemple

```ts
cls()
for $i in range(1000) {
  color(random(256))
  move(random(-320, 320), random(-240, 240))
  disk(random(200), random(200))
  pause()
}
```

## `DISK( largeur, hauteur, angle )`

Il est aussi possible de pencher une ellipse d'un certain angle (exprimé en degrés) :

```ts
RESET()
INK(0,0,0,1)
INK(1,15,15,14)
COLOR(1)
MOVE(0, 100)
DISK(300,20,30)
DISK(300,20,-30)
MOVE(0,-100)
DISK(160, 100)
MOVE(0,-50)
DISK(100, 100)
COLOR(0)
MOVE(80,-100)
DISK(50,30,45)
MOVE(-80,-100)
DISK(50,30,-45)
MOVE(20,-30)
DISK(10,20,-20)
MOVE(-20,-30)
DISK(10,20,20)
```

## `DISK( largeur, hauteur, angle, couverture )` ou `DISK( largeur, hauteur, angle, couverture, decalage )`

La `couverture` permet de dessiner des camemberts.
Une couverture de 360 degrés permet de dessiner un cercle (ou une ellipse) complets.
Toute valeur en dessous, va laisser un bout en moins.

Le `decalage` permet de définir où le bout manquant doit commencer.
Il est aussi exprimé en degrés entre 0 et 360.

```ts
RESET()
MOVE(0,0)
DRAW("D200,200,0,200")
COLOR(6)
DRAW("D200,200,0,40,200")
COLOR(11)
DRAW("D200,200,0,120,240")

```

----

Voir aussi [DRAW](DRAW), [LABEL](LABEL), [RECT](rect), [MOVE](MOVE).
