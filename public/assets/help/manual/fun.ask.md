# ASK

> ASK([texte[, texte[, texte, ...]]])

Demander à l'utilisateur de taper un texte au clavier et retourner sa valeur quand l'utilisateur tapes sur _ENTER_.

On peut lui passer autant d'arguments que l'on veut. Chaque argument sera une ligne de texte affichée pour expliquer à l'utilisateur ce que l'on attend de lui.

Exemple :

```
$nom = ASK("Bonjour", "Quel est ton nom ? ")
```

Ici, TLK-74 va afficher `Bonjour`, puis il va passer à la ligne suivante et afficher `Quel est ton nom ?`. A cet endroit, un cursor (carré clignotant) apparait. L'utilisateur peut alors taper du texte. Il peut même effacer le dernier caractère tapé avec la touche _BACKSPACE_. Pour terminer son texte, il doit taper sur la toucher _ENTER_.

Voici un exemple plus compliqué à comprendre :

```
PRINT "Bonjour " + ASK("Nom : ") + " " + ASK("Prenom : ") + ", comment vas-tu ?"
```

----
[Index](../index)
