# PRINT

> PRINT texte
> PRINT texte, pause

Afficher un _texte_ à l'écran avec le stylo 1. Il est possible de définir la position où débute l'affichage avec l'instruction [`LOCATE`](ins.locate).

Si on spécifie une _pause_, les lettres s'affichent les unes à la suite des autres. Le nombre correspond au nombre de rafraichissement écran qui séparent deux lettres.

Exemples :

```
PRINT "Bonjour le monde !"
PRINT "Bonjour " + "comment " + "va la " + "famille ?"
```

voir aussi [`LOCATE`](ins.locate)

----

[Index](index)
