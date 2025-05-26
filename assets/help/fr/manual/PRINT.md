# PRINT()

## `PRINT( expression, expression, ... )`

Afficher un _texte_ à l'écran à la position courante du curseur. Il est possible de définir la position où débute l'affichage avec la procédure [`LOCATE`](LOCATE).

Si on spécifie une _pause_, les lettres s'affichent les unes à la suite des autres. Le nombre correspond au nombre de rafraichissement écran qui séparent deux lettres.

### Exemple

```ts
RESET()
PRINT("Bonjour ")
PRINT("le ", "monde ")
PRINT("de l'annees ", 1974)
```

### Exemple

Dans cet exemple, on affiche un long texte aléatoire pour montrer que l'écran défile quand le texte arrive en bas.

```ts
RESET()
$mots = ["lorem", "ipsum", "Anselm", "Alois", "quid", "seget", "pulis", "nostrum", "partum", "loomis", "spartan", "per", "nox", "surris", "illo", "sapiente", "quia", "architecto", "optio", "facilis", "accusamus", "eum", "aut", "aut", "exercitationem", "unde", "molestiae", "voluptate", "quis", "deserunt", "sit", "delectus", "magni", "id", "molestiae", "quas", "quo", "vadis", "alias", "non", "sed", "ad", "fugiat", "veritatis"
]
$texte = ""
FOR $i IN RANGE(300) $texte = $texte + PICK($mots) + " "
FOR $c IN $texte {
  PRINT($c)
  PAUSE()
}
```

## `PRINTLN( expression, expression, ... )`

En rajoutant `LN` `a la fin, on force le curseur à passer à la ligne après l'affichage du texte.

### Exemple

```ts
RESET()
PRINTLN("Maitre corbeau, sur un arbre perche,")
PRINTLN("Tenait, en son bec, un fromage.")
```

voir aussi [`LOCATE`](LOCATE).
