# DISK()

> DISK( taille )

Dessine un cercle.

> DISK( largeur, hauteur )

Dessine une ellipse.

## Exemple

```ts
cls()
for $i in range(1000) {
  color(random(256))
  move(random(-320, 320), random(-240, 240))
  disk(random(200), random(200))
  pause()
}
```
