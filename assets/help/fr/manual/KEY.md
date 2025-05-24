# KEY()

## `KEY( touche, touche, ... )`

Retourne 1 si toutes les touches passées en argument sont enfoncées,
sinon retourne 0.

### Exemple

Appuie sur 2, 4, 6 ou 8 pour déplacer la boule.

```ts
RESET()
$x = 0
$y = 0
WHILE 1 {
    CLS()
    MOVE($x, $y)
    DISK(50)
    $vx = 0
    $vy = 0
    IF KEY("4") $vx = -1
    ELIF KEY("6") $vx = +1
    ELIF KEY("8") $vy = -1
    ELIF KEY("2") $vy = +1
    $x = $x + $vx
    $y = $y + $vy
    PAUSE()
}
```

----

Voir aussi [INPUTDIR](INPUTDIR), [WAIT](WAIT).
