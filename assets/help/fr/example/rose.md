# Éclosion d'une fleur digitale

```ts
RESET()
FOR $coeff IN RANGE(1000) {
  CLS()
  MOVE(0, 0)
  FOR $ang IN RANGE(0, 360, 18) {
    COLOR(($ang % 26) + 2)
    DISK(320, 60, $ang * $coeff / 1000)
  }
  PAUSE()
}
```
