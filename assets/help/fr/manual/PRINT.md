# PRINT()

## `PRINT( expression, expression, ... )

Afficher un _texte_ à l'écran à la position courante du curseur. Il est possible de définir la position où débute l'affichage avec la procédure [`LOCATE`](LOCATE).

Si on spécifie une _pause_, les lettres s'affichent les unes à la suite des autres. Le nombre correspond au nombre de rafraichissement écran qui séparent deux lettres.

Exemples :

```ts
RESET()
PRINT("Bonjour ")
PRINT("le ", "monde ")
PRINT("de l'annees ", 1974)
```

## `PRINTLN( expression, expression, ... )`

En rajoutant `LN` `a la fin, on force le curseur à passer à la ligne après l'affichage du texte.

```ts
RESET()
PRINTLN("Maitre corbeau, sur un arbre perche,")
PRINTLN("Tenait, en son bec, un fromage.")
```

voir aussi [`LOCATE`](LOCATE).
