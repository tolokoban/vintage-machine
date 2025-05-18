# LOCATE

## `LOCATE(colonne, ligne)`

L'écran est composé de 30 lignes et 40 colonnes.
Cette fonction permet de définir où sera affiché le prochain symbole avec un [PRINT](PRINT).

Cela va aussi affecter les autres procédure de dessin, comme [DRAW](DRAW), [DISK](DISK), [LABEL](LABEL), [RECT](RECT), ...
Meme si, pour ces dernières, on préferera utiliser [MOVE](MOVE).

### Exemple

```ts
CLS()
LOCATE(15,14)
PRINT("Coucou !")
```

voir aussi [CLS](CLS), [MOVE](MOVE), [PRINT](PRINT).
