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
