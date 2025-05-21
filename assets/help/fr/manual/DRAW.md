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
| `D rayon` | `DISK(rayon)` |
| `D rx,ry` | `DISK(rx,ry)` |
| `D rx,ry,ang` | `DISK(rx,ry,ang)` |
| `D rx,ry,ang,couv` | `DISK(rx,ry,ang,couv)` |
| `D rx,ry,ang,couv,dec` | `DISK(rx,ry,ang,couv,dec)` |
| `R taille` | `RECT(taille)` |
| `R largeur,hauteur` | `RECT(largeur,hauteur)` |
| `R largeur,hauteur,angle` | `RECT(largeur,hauteur,angle)` |
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

```ts
RESET()
cls(11)
MOVE(0,0)
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
```

Voir aussi [DISK](DISK), [LABEL](LABEL), [RECT](rect), [MOVE](MOVE).
