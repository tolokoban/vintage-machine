# ASC()

## `ASC( $texte )`

Retourne le code ASCII de la première lettre du texte passé en argument.

### Exemple 1

```ts
$lettre = ASK("Tape une lettre (puis ENTER) : ")
PRINTLN("Le code ASCII de " + $lettre + " est " + ASC($lettre))
```

### Exemple 2

```ts
$texte = ASK("Tape la phrase que tu veux coder : ")
PRINT("Voici comment elle est, une fois codee :")
FOR $lettre IN $texte
  PRINT(HEX(CHR(ASC($lettre) + 1)))
NEXT
```

Voir aussi [CHR](CHR), [HEX](HEX).
