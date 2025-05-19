# NOT()

## `NOT( condition )`

Inverse une condition.

### Exemple

Tous les nombres qui se divisent par 11 donnent zéro quand on leur applique cette opértion `$nombre % 11`.
On peut donc écrire ce programme :

```ts
RESET()
$nombre = ASKINT("Donne-moi un nombre : ")
IF ($nombre % 11) == 0 {
    PRINTLN("Ce nombre se divise par 11.")
}
```

Si on veut l'inverse, on peut utiliser la fonctionn `NOT()` :

```ts
RESET()
$nombre = ASKINT("Donne-moi un nombre : ")
IF NOT(($nombre % 11) == 0) {
    PRINTLN("Ce nombre NE se divise PAS par 11.")
}
```
