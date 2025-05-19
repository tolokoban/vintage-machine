# TIME()

## `TIME()`

Retourner le nombre de millisecondes qui se sont écoulées depuis le 1er janvier 1970.

### Exemple

```ts
RESET()
$mot = "Anselm"
$record = 60
WHILE 1 {
  CLS()
  COLOR(24)
  PRINTLN("Le record pour taper ", $mot, " est de")
  COLOR(11)
  PRINTLN($record, " secondes.")
  COLOR(24)
  PRINTLN("Essaie de le battre !")
  PRINTLN()
  PRINTLN("Pour cela, tape ENTER, puis tape ", $mot, " le plus vite possible, puis ENTER.")
  PRINTLN()
  $ignore = ASK("Tape ENTER...")
  PRINTLN()
  $t = TIME()
  $entree = ASK("Tape ", $mot, " : ")
  $temps = (TIME() - $t) / 1000
  PRINTLN()
  IF $mot <> $entree {
    CoLOR(6)
    PRINTLN("Tu n'as pas tape le bon mot...")
  } ELSE {
    PRINTLN("Tu as mis ", $temps, " secondes.")
    IF $temps < $record {
      COLOR(#12)
      PRINTLN(
        "Bravo ! Tu as battu le precedent record de ",
        $record, " secondes."
      )
      $record = $temps
    }
  }
  PRINTLN()
  COLOR(24)
  $ignore = ASK("Tape ENTER pour recommencer.")
}
```

----

Voir aussi [HOUR](HMS), [MINUTE](HMS), [SECONDE](HMS).
