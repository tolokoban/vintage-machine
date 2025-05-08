# ASC()

> `ASC( texte )`

Retourne le code ASCII de la première lettre du texte passé en argument.

Exemple 1 :

```
$lettre = ASK("Tape une lettre (puis ENTER) : ")
PRINT "Le code ASCII de " + $lettre + " est " + ASC($lettre)
```

Exemple 2 :

```
$texte = ASK("Tape la phrase que tu veux coder : ")
PRINT "Voici comment elle est, une fois codee :" + NL
FOR $lettre IN $texte
  PRINT CHR(ASC($lettre) + 1)
NEXT
```

Voir aussi [CHR](fun.chr)

----
[Index](../index)
