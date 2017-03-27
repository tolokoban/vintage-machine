# Couleurs

Une couleur est composée de 4 composantes : le __niveau de rouge__,
le __niveau de vert__, le __niveau de bleu__ et le __niveau de transparence__.

Chaque composante est un nombre entier allant de 0 à 15.
Il faut imaginer chacune des trois premières composantes comme l'intensité d'une
ampoule de la couleur correspondante.

Par exemple, al fonction `COLOR(15,0,0)` retourne la couleur rouge.
C'est comme si on allumait l'ampoule rouge au maximum (15)
et qu'on éteignait complètement (0) la verte et la bleue.
Si on prend `COLOR(10,0,0)`, ce sera aussi du rouge, mais légèrement plus foncé.

Il est également possible d'ajouter un quatrième argument qui permet de définir
la _transparence_. La valeur 15 signifie une totale invisibilité, 0 signifie
pas de transparence du tout. Quand on dessine avec une couleur transparente,
on peut voir ce qu'il y a derrière.

----

L'instruction [`PEN`](ins.pen) permet de définir la couleur des stylos.
Il existe 8 stylos différents, numérotés de 0 à 7.
Pour changer la couleur 0, il faut utiliser l'instruction [`PAPER`](ins.paper).

L'instruction [`PRINT`](ins.print) que l'on a étudiée au chapitre précédent
affiche du texte en utilisant les stylos 0 et 1.
