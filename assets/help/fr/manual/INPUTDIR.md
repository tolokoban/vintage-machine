# INPUTDIR()

## `INPUTDIR()`

Regarde quelles touches fléchées sont enfoncées et
retourne une liste de deux nombres :

- la direction horizontale (-1, 0 ou +1),
- la direction verticale (-1, 0 ou +1).

### Exemple

```ts
RESET()
$x = 0
$y = 0
WHILE 1 {
    CLS()
    MOVE($x, $y)
    DISK(50)
    $[vx, vy] = INPUTDIR()
    $x = $x + $vx
    $y = $y + $vy
    PAUSE()
}
```

----

Voir aussi [KEY](KEY), [WAIT](WAIT).
