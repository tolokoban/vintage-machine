# COLOR

> COLOR(rouge, vert, bleu)
> COLOR(rouge, vert, bleu, transparence)


Retourner la valeur d'une couleur à partir de ses composantes rouge, vert et bleu.
Chaque composante est un nombre entier allant de 0 à 15.
Il faut imaginer chaque composante comme l'intensité d'une ampoule de la couleur
correspondante.

Par exemple, `COLOR(15,0,0)` signifie qu'on allume l'ampoule rouge au maximum (15)
et qu'on éteint complètement (0) la verte et la bleue. Si on prend `COLOR(10,0,0)`,
ce sera aussi du rouge, mais légèrement plus foncé.

C'est en éclairant plusieurs lampes en même temps avec des intensités différentes
qu'on peut créer les 4096 couleurs que possède __TLK-74__.

C'est pourquoi, `COLOR` ne fait rien d'autre que de retourner un nombre entier
allant de 0 à 1023.

Il est également possible d'ajouter un quatrième argument qui permet de définir
la _transparence_. La valeur 15 signifie une totale invisibilité, 0 signifie
pas de transparence du tout. Quand on dessine avec une couleur transparente,
on peut voir ce qu'il y a derrière.

Exemple :

```
PEN &f00
PEN COLOR(15,0,0)
PEN 3840
```

Ces trois lignes donnent la même couleur : un rouge qui claque.

voir aussi [`PEN`](ins.pen)

----

[Index](index)
