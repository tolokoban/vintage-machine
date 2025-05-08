# Dis bonjour

Notre premier programme est très simple, il va demander à l'ordinateur de dire "Bonjour !".
Pour commencer, efface le programme qui est actuellement dans la partie droite de l'éditeur. Pour cela, clique dessus, tapes __CTRL__+__A__ puis sur __BACKSPACE__.

Bien, maintenant tape ceci (ou utilise la technique du _copier/coller_) :

```ts
PRINT("Bonjour ! Je suis ton ordinateur personnel : TLK-74.")
```

Pour exécuter ce programme, c'est-à-dire pour donner l'ordre à ton ordinateur de faire ce qu'il dit, tape sur la touche __F4__.

Le mot [`PRINT`](manual/ins.print) en début de ligne est une __instruction__.
Elle commande à TLK-74 d'écrire sur l'écran (le Moniteur).

Les instructions sont suivies d'__arguments__.
Dans notre cas, il s'agit d'un texte que l'on reconnait parce qu'il est entouré par des guillemets (").
Dans l'éditeur, quand un texte apparait, il est affiché en orange. Les instructions sont en bleu.

Certaines instructions peuvent avoir plusieurs arguments. C'est le cas de `PRINT` qui va écrire tous ses arguments à la suite, comme dans cet exemple :

```ts
PRINT("Je suis ton ordinateur personnel :",  "TLK-", 74, ".")
```

Essaie d'appuyer plusieurs fois sur `F4` pour exécuter plusieurs fois ton programme.

> Wahou ! C'est en train de me remplir l'écran ton truc là.
> Comment je fais pour tout effacer ?

Il faut utiliser une autre instruction :

```ts
CLS()
```

En anglais, c'est l'abréviation de `CLear Screen` (effacer l'écran).

----

* Chapitre suivant : [Les coordonnées](coords)
* Chapitre précédent : [Éditeur et moniteur](editor-monitor)
