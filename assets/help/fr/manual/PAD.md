# PADL() et PADR()

## `PADL( texte, taille )`

Force le texte à rentrer dans la taille donnée et remplit avec des espaces à droite si c'est trop grand.

### Exemple

Pratique pour faire des colonnes.

```ts
RESET()
FOR $i IN RANGE(80) {
  PRINT(PADL(RANDOM(-9999, 9999), 8))
}
```

## `PADL( texte, taille, remplissage )`

Au lieu de remplir avec des espaces, on peut utiliser n'importe quel symbole.

### Exemple

```ts
RESET()
FOR $i IN RANGE(80) {
  PRINT(PADL(RANDOM(-9999, 9999), 8, CHR(#CE)))
}
```

## `PADR( texte, taille )` ou `PADR( texte, taille, remplissage )`

On a la meme fonction pour aligner le texte à droite dans son espace confiné.

### Exemple

```ts
RESET()
FOR $i IN RANGE(80) {
  COLOR(RANDOM(2,27))
  PRINT(PADR(RANDOM(-9999, 9999), 8, CHR(#CE)))
}
```
