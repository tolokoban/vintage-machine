# COS() et SIN()

## `COS( angle )` et `SIN( angle )`

### Exemple

```ts
RESET()
$rayon = 160
WHILe 1 {
  CLS()
  PRINTLN("Quelle heure est-il ?")
  COLOR(2)
  MOVE(0,0)
  DISK($rayon)
  FOR $heure IN RANGE(1, 12) {
    $angle = 30 * $heure
    $r = $rayon + 32
    COLOR(24)
    MOVE($r * SIN($angle), -$r * COS($angle))
    LABEL($heure)
  }
  $angle = 6 * SECOND()
  COLOR(#1A)
  FOR $r IN RANGE($rayon) {
    MOVE($r * SIN($angle), -$r * COS($angle))
    DISK(6)
  }
  $angle = 6 * MINUTE()
  COLOR(#14)
  FOR $r IN RANGE($rayon - 18) {
    MOVE($r * SIN($angle), -$r * COS($angle))
    DISK(9)
  }
  $angle = 30 * HOUR()
  COLOR(#B)
  FOR $r IN RANGE($rayon - 48) {
    MOVE($r * SIN($angle), -$r * COS($angle))
    DISK(12)
  }
  PAUSE(1)
}
```
