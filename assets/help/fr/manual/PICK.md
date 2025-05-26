# PICK

## `PICK( liste )`

Retourne un élément au hasard de la liste.

### Example

```ts
RESET()
$couleurs = CHR(#E2,#E3,#E4,#E5)
$valeurs = RANGE(1,10)
$valeurs[] = "V"
$valeurs[] = "Q"
$valeurs[] = "K"
WHILE 1 {
    COLOR(11)
    PRINTLN("Tape une touche pour tirer une carte...")
    WAIT()
    COLOR(15)
    PRINTLN(PICK($valeurs), PICK($couleurs))
}
```

----

Voir aussi [RANDOM](RANDOM).
