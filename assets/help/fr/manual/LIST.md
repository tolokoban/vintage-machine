# LIST()

## `LIST( taille, element_de_remplissge )`

Retourne une liste de la taille donnée, et remplie avec l'élément donné.

### Exemple 1

```ts
RESET()
PRINTLN(LIST(5, "Hello"))
```

### Exemple 2

```ts
RESET()
DEF BOITE($largeur, $hauteur) {
    PRINTLN(CHR(#96), CHR(#9A) * $largeur, CHR(#9C))
    $modele = CHR(#95) + ($largeur * " ") + CHR(#95)
    FOR $ligne IN LIST($hauteur, $modele) {
        PRINTLN($ligne)
    }
    PRINTLN(CHR(#93), CHR(#9A) * $largeur, CHR(#99))
}

BOITE(7, 3)
BOITE(32, 12)
```
