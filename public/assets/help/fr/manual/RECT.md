# RECT()

> RECT( taille )

Dessine un carré.

> RECT( largeur, hauteur )

Dessine un rectangle.

## Exemple

```ts
cls()
for $i in range(1000) {
  color(random(256))
  move(random(-320, 320), random(-240, 240))
  rect(random(200), random(200))
  pause()
}
```
