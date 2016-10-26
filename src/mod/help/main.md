# Introduction

Le __TLK-74__ est un ordinateur programmable qui peut produire du son et afficher jusqu'à 4096 couleurs. Sous certaines conditions, il est même capable d'atteindre 16 millions de couleurs !

Ce manuel va t'apprendre à le programmer dans son langage à lui : le __BASIK__.

> Quoi ? C'est quoi ce __BASIK__ ? Pourquoi ne parle-t-il pas le français comme tout le monde celui-là ?

Eh bien, vois-tu, ton ordinateur travaille vite et bien, mais il n'a pas d'imagination. Il doit comprendre avec précision ce que tu veux qu'il fasse pour toi. Et il se trouve qu'en français, ce n'est pas toujours facile de se comprendre.

Par exemple, si tu lui dis "_dessine un gros cercle_", il ne va pas savoir ce que tu entends par _gros_. Le français n'est pas une langue précise, alors que le __BASIK__ si. Pour dessiner un cercle, il faudra écrire, par exemple, ceci :

```
MOVE 320, 240
DISK 200
```

Ça peut paraître barbare à première lecture, mais c'est très simple : on demande d'abord à TLK-74 de se placer au centre de l'écran (`MOVE 320,240`) puis de dessiner un disque (un cercle plein) de rayon 200 (`DISK 200`).

Mais nous y reviendrons. Pour le moment, il faut apprendre à utiliser le clavier et la souris.

----

Chapitre suivant : [Editeur et Moniteur](editor-monitor)
