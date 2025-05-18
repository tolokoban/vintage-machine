# CLS

## `CLS()`

Efface le calque courant.

### Exemple 1

```ts
FOR $boucle IN RANGE(10) {
  FOR $x IN RANGE(34) {
    CLS()
    LOCATE($x, 15)
    PRINT("Anselm")
    PAUSE(0.02)
  }
}
```

## `CLS( $couleur )`

Efface le calque courant et le remplit avec la couleur `couleur`.

### Exemple 2

```ts
FOR $color IN RANGE(28) {
    CLS($color)
    PAUSE(0.3)
}
```

### Exemple 3

```ts
cls(7)
color(0)
move(0,0)
label("La vie en rose", 2.5)
```
