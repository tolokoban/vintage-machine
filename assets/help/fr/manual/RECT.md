# RECT()

## `RECT( taille )`

Dessine un carré centré sur la position courante du curseur.

### Exemple 1

```ts
RESET()
MOVE(0,0)
RECT(100)
```

### Exemple 2

```ts
RESET()
DEF DESSINE($x, $y, $size) {
  IF $size > 1 {
    MOVE($x, $y)
    COLOR(24)
    RECT($size)
    COLOR(0)
    RECT($size - 2)
    DESSINE($x - ($size / 2), $y - ($size / 2), $size / 1.5)
    DESSINE($x + ($size / 2), $y - ($size / 2), $size / 2)
  }
}

DESSINE(0, 120, 200)
```

## `RECT( largeur, hauteur )`

Pour faire une rectangle, on passe deux arguments.

### Exemple

```ts
RESET()
MOVE(0,0)
COLOR(15)
RECT(2 * 100, 2 * 162)
COLOR(0)
RECT(100, 162)
```

## `RECT( largeur, hauteur, angle )`

Il est aussi possible de pencher le rectangle d'un angle donné en degrés.

```ts
RESET()
MOVE(0,0)
RECT(168, 100, 30)
```

Avec un peu d'astuce, on peut faire une animation.

```ts
RESET()
FOR $angle IN RANGE(-360, 360) {
  CLS()
  $x = $angle * 1.7453292519943295
  MOVE($x,0)
  COLOR(6)
  DISK(200)
  COLOR(26)
  RECT(260,80,$angle)
  PAUSE()
}```

----

Voir aussi [DISK](DISK), [DRAW](DRAW).
