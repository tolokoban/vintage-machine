# RANDOM() et RANDOMF()

## `RANDOM( compte )`

Retourner un nombre aléatoire entier entre __0__ et __compte - 1__.
Donc `RANDOM(3)` retourne un nombre aléatoire parmi __0__, __1__ et __2__.

## `RANDOM( debut, fin )`

Retourner un nombre aléatoire entier entre __debut__ et __fin__.

## `RANDOM()`

Retourner un nombre aléatoire à virgule entre __0.0__ et __1.0__. Mais ça ne sera jamais __1.0__, meme si ça peut etre __0.99999999999999999999999999__.

## `RANDOMF( debut, fin )`

Retourner un nombre aléatoire à virgule entre __debut__ et __fin__.

### Exemple

Dessinons des cercles de couleurs aléatoires n'importe où et avec des tailles quelconques.

```ts
RESET()
FOR $c IN RANGE(100) {
    COLOR(RANDOM(256))
    MOVE(RANDOM(-320, +320), RANDOM(-240, 240))
    DISK(RANDOM(300))
}
