# Afficher la palette courante

```ts
RESET()
for $row in range(16) {
  color(26)
  locate($row + 1, 0)
  print(HEX($row))
  locate($row + 1, 17)
  print(HEX($row))
  locate(0, $row + 1)
  print(HEX($row))
  locate(17, $row + 1)
  print(HEX($row))
  for $col in range(16) {
    $color = (16 * $row) + $col
    color($color)
    locate($col + 1, $row + 1)
    print(chr(#8f))
  }
}```
