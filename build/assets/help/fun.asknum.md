# ASKNUM

> ASKNUM([texte[, texte[, texte, ...]]])

Demander à l'utilisateur de taper un nombre.

Exemple :
```
$age = ASKNUM("Quel age as-tu ? ")
PRINT "Tu as " + $age + " ans : " + NL
PRINT "Tu es " + IIF( $age > 18 , "vieux", "jeune" ) + " alors !"
```

Voir aussi [`ASK`](fun.ask)

----

[Index](index)
