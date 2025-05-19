# HOUR(), MINUTE() et SECOND()

## `HOUR()`

Retourne l'heure courante.

## `MINUTE()`

Retourne la minute courante.

## `SECONDE()`

Retourne la seconde courante.

### Exemple

Voici une horloge numérique :

```ts
RESET()
INK(0, 0, 0, 0)
INK(1, 5, 15, 5)
WJHILE 1 {
    CLS()
    MOVE(0,0)
    COLOR(1)
    LABEL(PADR(HOUR(),2) + ":" + PADR(MINUTE(), 2, "0") + ":" + PADR(SECOND(), 2, "0"))
    PAUSE(1)
}
```

----

Voir aussi [TIME](TIME)
