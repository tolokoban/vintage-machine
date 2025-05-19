# MOUSEX() et MOUSEY()

## `MOUSEX()` et `MOUSEY()`

Retourne la coordonnée X ou Y de la position courante de la souris quand le bouton est enfoncé.

### Exemple

En déplaçant la souris lentement, tu peux faire un dessin :

```ts
RESET()
WHILE 1 {
  MOVE(MOUSEX(), MOUSEY())
  DISK(4)
  PAUSE()
}
```
