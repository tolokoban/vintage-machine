# LOWERCASE()

Transforme tous ses arguments en minuscule.

## LOWERCASE( $texte )

### Exemple

```ts
RESET()
$nom = ASK("Quel est ton nom ? ")
PRINTLN("Bonjour ", $nom, ".")
PRINTLN("Tu preferes qu'on ecrive ton nom comment ?")
PRINTLN("1) ", UPPERCASE($nom))
PRINTLN("2) ", UPPERCASE($nom[0]), LOWERCASE($nom[1,-1]))
```

Voir aussi [LOWERCASE](LOWERCASE).
