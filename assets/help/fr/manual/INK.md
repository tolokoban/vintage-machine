# INK()

## `INK($crayon, $rouge, $vert, $bleu)`

Il est possible de definir la couleur de chaque crayon grāce a cette procédure.

Les valeurs `$rouge`, `$vert` et `$bleu` sont comprises entre 0 et 15.
Elles représentent l'intensité lumineuse de chaque micro-ampoule derrière les pixels.

Le crayon 0 est particulier : il définit la couleur de l'arrière plan, qui va plus loin que l'écran sur lequel on peut afficher.

### Exemple

```ts
RESET()
CLS(2)
COLOR(24)
PRINT("Bonjour ")
COLOR(17)
PRINT("le monde !")
INK(0, 15, 13, 13)
INK(2, 10, 9, 9)
INK(24, 15, 0, 0)
INK(17, 12, 4, 4)
```

### `INK($crayon, $rouge, $vert, $bleu, $opacite)`

Le dernier argument contrōle l'opacité de cette couleur.
Les valeurs vont de 0 à 15. Une valeur de 0 signifie "invisible".
Et june valeur de 1 "par transparent du tout", c'est-à-dire "opaque".

```ts
RESET()
INK(100, 15, 0, 0, 10)
INK(101, 0, 15, 0, 10)
INK(102, 0, 0, 15, 10)
LAYER(0)
COLOR(100)
MOVE(0, 50)
DISK(100)
LAYER(1)
COLOR(101)
MOVE(-50, -30)
DISK(100)
LAYER(2)
COLOR(102)
MOVE(50, -30)
DISK(100)
```
