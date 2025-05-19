# MODE()

## `MODE( mode )`

Cette procédure controle comment ce calque va se superposer à celui du dessous.

Il existe trois modes qui sont les textes suivants :

- `"alpha"` : si une coleur est transparent, on verra un peu du calque de dessous.
- `"add"` : les couleurs de ce calque s'ajoutent à celles du dessous.
- `"replace"` : les couleurs de ce calque cachent complètement celle du calque dessous. La transparence n'a pas d'effet sur le calque du dessous.

### Exemple

Voici comment utiliser le mode `"add"` pour montrer comment les couleurs se mélangent.

```ts
RESET()
INK(0, 0, 0, 0)
INK(100, 15, 0, 0, 7)
INK(101, 0, 15, 0, 7)
INK(102, 0, 0, 15, 7)
INK(200, 8, 0, 0, 7)
INK(201, 0, 8, 0, 7)
INK(202, 0, 0, 8, 7)
FOR $mode IN ["add", "alpha", "replace"] {
  FOR $layer IN [0,1,2] {
    LAYER($layer)
    CLS()
    MODE($mode)
  }
  LOCATE(0,0)
  COLOR(24)
  PRINT("Mode : ", $mode)
  MOVE(0, 0)
  $index = 0
  FOR $red IN RANGE(1,2) {
    FOR $green IN RANGE(1,2) {
      FOR $blue IN RANGE(1,2) {
        $col = $index % 4
        $row = INT(($index - $col) / 4)
        MOVE(160 * ($col - 1.5), 240 * ($row - 0.5))
        $index = $index + 1
        LAYER(0)
        COLOR(0 + (100 * $red))
        MOVER(0, 25)
        DISK(50)
        MOVER(0, -25)
        LAYER(1)
        COLOR(1 + (100 * $green))
        MOVER(-25, -15)
        DISK(50)
        MOVER(25, 15)
        LAYER(2)
        COLOR(2 + (100 * $blue))
        MOVER(25, -15)
        DISK(50)
        MOVER(-25, 15)
      }
    }
  }
  PAUSE(5)
}
```

## `MODE()`

Retourne le mode courant.

### Exemple

```ts
LOCATE(0, 0)
COLOR(24)
PRINTLN("Mode actuel : ", MODE())
```

----

Voir aussi [LAYER](LAYER).
