# ASK

## `ASK( texte, texte, ... )`

Demander à l'utilisateur de taper un texte au clavier et retourner sa valeur quand l'utilisateur tapes sur _ENTER_.

On peut lui passer autant d'arguments que l'on veut. Chaque argument sera collé au précédent pour expliquer à l'utilisateur ce que l'on attend de lui.

### Exemple 1

```ts
reset()
$nom = ASK("Bonjour. ", "Quel est ton nom ? ")
println("Enchante ", $nom)
```

Ici, TLK-74 va afficher `Bonjour. Quel est ton nom ?`. À cet endroit, un cursor (carré clignotant) apparait. L'utilisateur peut alors taper du texte. Il peut même effacer le dernier symbole tapé avec la touche _BACKSPACE_. Pour terminer son texte, il doit taper sur la toucher _ENTER_.

### Exemple 2

Voici un exemple plus compliqué à comprendre :

```ts
reset()
PRINTLN(
    "Bonjour ", 
    ASK("Nom : "), " ", 
    ASK("Prenom : "), 
    ", comment vas-tu ?"
)
```

## `ASKINT( texte, texte, ... )`

Fait la meme chose, mais retourne un nombre entier.

## `ASKNUM( texte, texte, ... )`

Fait la meme chose, mais retourne un nombre à virgule.
