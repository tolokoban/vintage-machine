# Référence du langage BASIK

Les fonctions retournent une valeur. Les procédures pas.

## Procédures

* [CLS](CLS) : effacer le calque courant
* [COLOR](COLOR) : choisir un crayon de couleur
* [DISK](DISK) : dessiner un disque ou une ellipse
* [DRAW](DRAW) : dessiner plusieurs formes d'un coup
* [CALL](CALL) : appelle une procédure dynamiquement
* [EXIT](EXIT) : terminer le programme
* [INK](INK) : changer la couleur d'un crayon
* [LABEL](LABEL) : dessiner un texte centré sur le curseur avec la taille qu'on veut
* [LAYER](LAYER) : définir le calque courant pour les prochains affichages
* [LOCATE](LOCATE) : positionner le curseur pour du texte
* [MODE](MODE) : définir comment le calque courant se mélange à celui u dessous.
* [MOVE](MOVE) : positionner le curseur plus précisément
* [MOVER](MOVE) : déplacer le curseur par rapport à sa position actuelle
* [PAUSE](PAUSE) : faire une pause et rafraichir l'écran
* [PRINT](PRINT) : afficher du texte
* [PRINTLN](PRINT) : afficher du texte et sauter une ligne
* [RECT](RECT) : dessiner un rectangle
* [RESET](RESET) : réinitialiser TLK-74
* [SCROLL](SCROLL) : décale le calque courant
* [SOUND](SOUND) : émettre un son
* [STOP](STOP) : arrête une partition de musique en train de se jouer
* [TRI](TRI) : dessine un ou plusieurs triangles

## Fonctions

* [ABS](ABS) : retourne la valeur absolue d'un nombre
* [ASC](ASC) : retourne la valeur ASCII de la première lettre d'un texte
* [ASK](ASK) : retourne le texte tapé par l'utilisateur
* [ASKINT](ASK) : retourne un nombre entier tapé par l'utilisateur
* [ASKNUM](ASK) : retourne un nombre à virgule tapé par l'utilisateur
* [CALL](CALL) : appelle une fonction dynamiquement
* [CHR](CHR) : retourne un symbole dont on passe la valeur
* [CLAMP](CLAMP) : forcer un nombre à rester entre deux valeurs
* [COLOR](COLOR) : retourne le numéro du crayon courant
* [COS](COS) : retourne le cosinus d'un angle en degrés
* [FLOOR](FLOOR) : retourne le plus grand nombre entier qui ne dépasse pas le nombre passé en argument
* [FRACT](FRACT) : retourne la partie décimale du nombre passé en argument
* [HEX](HEX) : retourne la représentation hexadécimale d'un nombre
* [HOUR](HMS) : retourne l'heure courante
* [INK](INK) : retourne une liste des composantes de la couleur d'un crayon
* [INPUTDIR](INPUTDIR) : regarde quelles touches fléchées sont enfoncées
* [INT](INT) : retourne la valeur entière la plus proche d'un nombre
* [KEY](KEY) : retourne 1 si toutes les touches passées en argument sont enfoncées.
* [LAYER](LAYER) : retourne le numéro du calque courant
* [LEN](LEN) : retourne la longueur d'un texte ou d'une liste
* [LIST](LIST) : retourne une liste remplie d'un mēme élément
* [LOWERCASE](LOWERCASE) : retourne un texte en minuscules
* [MAX](MAX) : retoune le plus grand des nombres passés en argument
* [MIN](MIN) : retoune le plus petit des nombres passés en argument
* [MINUTE](HMS) : retourne la minute courante
* [MODE](MODE) : retourne le type de mélange du calque courant avec celui du dessous
* [MOUSEX](MOUSE) : retourne la coordonnée X du pointeur de souris
* [MOUSEY](MOUSE) : retourne la coordonnée Y du pointeur de souris
* [NOT](NOT) : retourne la valeur booléenne inverse
* [PADL](PAD) : retourne un texte avec une taille donnée en remplissant à droite
* [PADR](PAD) : retourne un texte avec une taille donnée en remplissant à gauche
* [PICK](PICK) : retourne un élément au hasard d'une liste
* [PLAY](PLAY) : lance une partition et retourne immédiatement le temps en secondes que le morceau va durer.
* [RANDOM](RANDOM) : retourne un nombre aléatoire entier
* [RANDOMF](RANDOM) : retourne un nombre aléatoire à virgule
* [RANGE](RANGE) : retourne une liste de nombres qui se suivent
* [SECOND](HMS) : retourne la seconde courante
* [SIN](COS) : retourne le sinus d'un angle en degrés
* [TIME](TIME) : retourne le temps actuel en millisecondes depuis le 1er janvier 1970
* [UPPERCASE](UPPERCASE) : retourne un texte en majuscules
* [WAIT](WAIT) : attend que le joueur tape une touche et retourne sa valeur
