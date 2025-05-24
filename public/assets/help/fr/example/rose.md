# Éclosion d'une fleur digitale

```ts
RESET()
FOR $coeff IN RANGE(1000) {
  CLS()
  MOVE(0, 0)
  FOR $ang IN RANGE(0, 720, 9) {
    COLOR(($ang % 64) + 2)
    $s = (720 - $ang) / 720
    DISK(320*$s, 60*$s, $ang * $coeff / 1000)
  }
  PAUSE()
}
```
