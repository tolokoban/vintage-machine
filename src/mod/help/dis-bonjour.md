# Dis bonjour !

Notre premier programme est très simple, il va demander à l'ordinateur de dire "Bonjour !".
Pour commencer, efface le programme qui est actuellement dans la partie droite de l'éditeur. Pour cela, clique dessus, tapes __CTRL__+__A__ puis sur __BACKSPACE__.

Bien, maintenant tape ceci (ou utilise la technique du _copier/coller_) :

```
SPEAK "Bonjour ! Je suis ton ordinateur personnel : TLK-74."
```

Pour exécuter ce programme, c'est-à-dire pour donner l'ordre à ton ordinateur de faire ce qu'il dit, tape sur la touche __F4__.

Sur certaines machines, tu n'entendras rien, sur d'autre, TLK-74 te parlera de sa _douce_ voix.

S'il ne te parle pas, ou si sa voix te déplait, tu peux lui demander d'écrire le texte sur l'écran.

```
PRINT "Bonjour ! Je suis ton ordinateur personnel : TLK-74."
```

Il n'y a qu'un mot qui change : `PRINT` a remplacé `SPEAK`.

Ces deux mots en début de ligne sont des __instructions__.
[`SPEAK`](ins.speak) commande à TLK-74 de parler, et [`PRINT`](ins.print) d'écrire sur l'écran (le Moniteur). Ces instructions sont suivies d'un __argument__. Dans notre cas, il s'agit d'un texte que l'on reconnait parce qu'il est entouré par des guillemets ("). Dans l'éditeur, quand un texte apparait, il est affiché en orange. Les instructions sont en bleu.

Certaines instructions peuvent avoir plusieurs arguments. C'est le cas de `PRINT`. Son deuxième argument est un nombre et il est séparé du texte à afficher par une virgule, comme dans cet exemple :

```
PRINT "Je suis ton ordinateur personnel : TLK-74.", 1
```

Comme tu le vois, avec cet argument en plus, les lettres s'affichent les unes après les autres. Essaie de remplacer le 1 par un 2 ou un 3 pour voir ce que ça fait.


