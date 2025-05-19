# ASC()

## `ASC( $texte )`

Retourne le code ASCII de la première lettre du texte passé en argument.

### Exemple 1

```ts
RESET()
$lettre = ASK("Tape une lettre (puis ENTER) : ")
PRINTLN("Le code ASCII de " + $lettre + " est " + ASC($lettre))
```

### Exemple 2

```ts
RESET()
$texte = ASK("Tape la phrase que tu veux coder : ")
PRINT("Voici comment elle est, une fois codee :")
FOR $lettre IN $texte {
  PRINT(HEX(ASC($lettre) + 1))
}
```

### Exemple 3

```ts
RESET()
DEF ENCODE($phrase) {
    $resultat = ""
    FOR $lettre IN $phrase {
        $resultat = $resultat + CHR(ASC($lettre) + 3)
    }
    RETURN $resultat
}

DEF DECODE($phrase) {
    $resultat = ""
    FOR $lettre IN $phrase {
        $resultat = $resultat + CHR(ASC($lettre) - 3)
    }
    RETURN $resultat
}

WHILE 1 {
  CLS()
  PRINTLN("Le code secret de Jules Cesar")
  PRINTLN()
  PRINTLN("Que vexu-tu faire ?")
  PRINTLN(" 1) Coder un message.")
  PRINTLN(" 2) Decoder un message.")
  PRINTLN(" 3) Sortir d'ici.")
  PRINTLN()
  $choix = ASKINT("Ton choix ? ")
  PRINTLN()
  IF $choix == 1 {
    PRINTLN("Tape la phrase a coder :")
    $clair = ASK("> ")
    PRINTLN("  ", ENCODE($clair))
  }
  IF $choix == 2 {
    PRINTLN("Tape la phrase a decoder :")
    $code = ASK("> ")
    PRINTLN("  ", DECODE($code))

  }
  IF ($choix <> 1) AND ($choix <> 2) { EXIT() }
  PRINTLN()
  $ignore = ASK("Tape ENTER pour continuer...")
}
```

Voir aussi [CHR](CHR), [HEX](HEX).
