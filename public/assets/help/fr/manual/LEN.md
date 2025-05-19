# LEN()

## `LEN( expression )`

Si l'argument est une liste, `LEN` retourne le nombre d'éléments de cette liste. Si c'est un texte, il retourne le nombre de symboles.

Il y a aussi un cas particulier pour les nombres. Dans ce cas, la fonction retourne le nombre de chiffres avant la virgule.

### Exemple

```ts
RESET()
FOR $arg In ["Anselm", [1, "deux", 3], [1, [2, 3]], 1974, 27.11] {
  PRINTLN()
  PRINTLN("LEN( ", $arg, " ) = ", LEN($arg))
}
```

Voir aussi [LIST](LIST), [RANGE](RANGE).
