# CLAMP()

## `CLAMP( nombre, min, max )`

Retourne un nombre encadré par un minimum et un maximum.
Cela signifie que si le nombre est entre minimum et maximum, alors on le retourne. S'il est plus petit que le minimum, on retourne minimum. Et s'il est plus grand que maximum, on retourne maximum.

### Exemple

Utilise la souris pour déplacer le bouton pour augmenter la puissance des réacteurs.

```ts
RESET()
$puissance = 70
INK(100, 5, 3, 0)
INK(101, 10, 7, 0)
INK(102, 15, 10, 0)
WHILE 1 {
    CLS()
    $puissance = INT((150 + CLAMP(MOUSEX(), -150, 150)) / 3)
    DRAW("C100M0,0R300,16M150,0D8")
    DRAW(
        "C101M-150,0D8M", -150 + ((3 * $puissance) / 2), ",0",
        "R", 3 * $puissance, ",16"
    )
    DRAW("C102M", -150 + (3 * $puissance), ",0D8")
    COLOR(24)
    MOVE(0, -60)
    LABEL("Puissance des reacteurs")
    MOVE(0, 120)
    LABEL($puissance + " %", 4)
    PAUSE()
}
```
