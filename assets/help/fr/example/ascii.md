# Afficher la table ASCII (table des 256 caractères)

```ts
RESET()
COLOR(24)
LOCATE(0,1)
PRINT("Voici la table des caracteres :")
FOR $row IN RANGE(16) {
  FOR $col IN RANGE(16) {
    COLOR(25 + (($col + $row)%2))
    LOCATE($col + 12, $row + 6)
    PRINT(CHR($col + (16 * $row)))
  }
}
COLOR(15)
$i = 0
FOR $c IN "0123456789ABCDEF" {
    LOCATE($i + 12, 5) PRINT($c)
    LOCATE($i + 12, 22) PRINT($c)
    LOCATE(11, $i + 6) PRINT($c)
    LOCATE(28, $i + 6) PRINT($c)
    $i = $i + 1
}
COLOR(24)
LOCATE(0,26)
PRINTLN("La bombe (", CHR(#FC), ") s'obtient comme ceci :")
PRINTLN()
COLOR(7)
PRINTLN("PRINT( CHR( #FC ) )")
```
