# CLS

> CLS()

Efface le calque courant.

> CLS( couleur )

Efface le calque courant et le remplit avec la couleur `couleur`.

## Exemple 1

```ts
FOR $color IN RANGE(28) {
    CLS($color)
    PAUSE(0.3)
}
```

## Exemple 2

```ts
cls(7)
color(0)
move(0,0)
label("La vie en rose", 2.5)
```

----

[Index](../index)
