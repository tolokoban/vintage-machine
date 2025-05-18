# LABEL()

## `LABEL( texte )`

Affiche un texte sur une seule ligne. Le texte sera centré sur la position courante du curseur.

### Exemple

```ts
RESET()
$y = -200
FOR $taille IN [0.5, 1, 1.5, 2, 2.5, 3, 4, 5] {
  MOVE(0,$y)
  LABEL("TLK-74", $taille)
  $y = $y + (32 * $taille)
}
```

## `LABEL( texte, taille )`

On peut spécifier une taille. 1 est la taille normale, 2 c'est le double et 0.5 la moitié. Mais tu peux utiliser tous les nombres que tu veux.

Voir aussi [DISK](DISK), [DRAW](DRAW), [MOVE](MOVE), [RECT](RECT).
