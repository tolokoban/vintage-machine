# COLOR

## `COLOR( $numero_de_crayon )`

TLK-74 possède 256 crayons pour tout ce qu'il affiche.
Les crayons sont numérotés de 0 à 255.

Cette instruction permet de définir quel crayon utiliser pour la suite.

### Exemple

```ts
reset()
for $crayon in range(28) {
    color(24)
    print("Crayon ", PADL($crayon, 2), " ")
    color($crayon)
    println(CHR(#8F) * 29)
}
```

## `$crayon = COLOR()`

On peut aussi utiliser la fonction pour retourner le numéro du crayon courant.

### Exemple

```ts
PRINTLN("J'utilise le crayon ", COLOR(), " en ce moment.")
```

Voir aussi [LAYER](LAYER).
