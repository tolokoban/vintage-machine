# Les coordonnées

Essaie ceci :
```
LOCATE 1,1
PRINT "Hortense"
LOCATE 2,2
PRINT "Ortense"
LOCATE 3,3
PRINT "Rtense"
LOCATE 4,4
PRINT "Tense"
LOCATE 5,5
PRINT "Ense"
LOCATE 6,6
PRINT "Nse"
LOCATE 7,7
PRINT "Se"
LOCATE 8,8
PRINT "E"
```

Comme tu le vois, il est possible d'écrire du texte à un endroit précis grâce à
l'instruction [`LOCATE`](ins.locate).
Elle attend deux arguments qu'on appelle __coordonnées__.
Le premier argument donne la colonne et la deuxième la ligne.
Sur l'écran, il y a __40 colonnes__ et __30 lignes__.

Ainsi, le numéro de colonne va de 0 à 39 et le numéro de ligne va de 0 à 29.

Voici comment placer une étoile dans chaque coin de l'écran :
```
PAPER &FF0
PEN &F0F
LOCATE 0,0
PRINT "*"
LOCATE 39,0
PRINT "*"
LOCATE 0,29
PRINT "*"
LOCATE 39,29
PRINT "*"
```

Et maintenant, voici une petite astuce pour écrire plusieurs fois le même texte
sans devoir taper trop de code : il est possible de multiplier du texte par un
nombre ! Regarde cet exemple et essaie de deviner ce qu'il fait avant de l'exécuter :
```
PRINT "Horty" * 4
```

Sympa, non ?

Grâce à cela, on peut, par exemple, dessiner deux lignes sur l'écran :
```
PAPER &FF0
PEN &F0F
LOCATE 0, 0
PRINT "-" * 40
LOCATE 0, 29
PRINT "-" * 40
```

Avec tout ça, on peux déjà se dessiner une petite maison :
```
BACK &070
PAPER &F00
LOCATE 19, 7
PRINT " "
LOCATE 18, 8
PRINT " " * 3
LOCATE 17, 9
PRINT " " * 5
LOCATE 16, 10
PRINT " " * 7
LOCATE 15, 11
PRINT " " * 9
PAPER &798
LOCATE 16, 12
PRINT " " * 7
LOCATE 16, 13
PRINT " " * 7
LOCATE 16, 14
PRINT " " * 7
LOCATE 16, 15
PRINT " " * 7
LOCATE 16, 16
PRINT " " * 7
```

A toi de jouer maintenant ! Essaie d'ajouter une petite fenêtre jaune de 3
espaces de large et 2 de haut.

----

* Chapitre suivant : [Les coordonnées fines](coords2)
* Chapitre précédent : [Un peu de couleurs !](couleurs)
