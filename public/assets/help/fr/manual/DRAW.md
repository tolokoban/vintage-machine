# DRAW()

## `DRAW( commandes, commandes, ... )`

Dessine plusieurs formes en une fois.

Les commandes sont écrites sous forme de texte.
Chaque commande commande par un mot (souvent d'une seule lettre) suivi de nombres séparés par des virgules ou des espaces.

Voici un tableau des commandes existantes :

| Commande | Signification |
| -------- | --------- |
| `C x` | `COLOR(x)` |
| `M x,y` | `MOVE(x,y)` |
| `m x,y` | `MOVER(x,y)` |
| `D rx,ry` | `DISK(rx,ry)` |
| `R rx,ry` | `RECT(rx,ry)` |
| `(` | sauvegarder la positon courante du curseur |
| `)` | Remettre le curseur à la position sauvegardée |

Attention ! Il y a une différence entre majuscules et minuscules.

Le curseur peut se déplacer avec certaines commandes (par exemple `m` et `M`), mais il est possible de sauver puis récupérer la position courante du curseur en utilisant les parenthèses.

### Exemple

```ts
RESET()
MOVE(-160,0)
DRAW("C1 D100 m-90,-90 D70 m90,-90 D70")
MOVE(160,0)
DRAW("C1 D100 (m-90,-90 D70) m90,-90 D70")
```

Voir aussi [DISK](DISK), [LABEL](LABEL), [RECT](rect), [MOVE](MOVE).
