## IF $condition { ... } ELSE { ... }

Voici un petit jeu très simple.

TLK-74 tire un nombre au hasard entre 1 et 6 grace à la fonction `RANDOM()`.
Puis il te demande de le deviner.

Si tu as trouvé, il te dit bravo.

```ts
CLS()
$de = RANDOM(1, 6)
println("J'ai lance un de a 6 faces.")
$prop = askint("Devine sa valeur : ")
if $prop == $de {
    println("Tu as gagne. Bravo !")
}
else {
    println("Non. C'etait ", $de)
}
```

> Mais ça veut dire quoi __IF__ et __ELSE__ ?

Comme souvent, les mots de programmation viennent de l'anglais.
__IF__ veut dire __si__ et __ELSE__ veut dire __sinon__.

Du coup, ce programme dit : __si__ `$prop` est égal à `$de` alors afficher "Tu as gagne. Bravo", __sinon__ afficher "Non. C'etait ...".

Les accolades servent à grouper plusieurs instructions ensemble.

### Exercice

Écris un programme qui demande l'age du joueur.
Si c'est moins de 18 ans, affiche "Tu n'es pas encore majeur".
Sinon, affiche "Bonjour Monsieur".

<details>
<summary>Solution...</summary>

```ts
CLS()
$age = ASKINT("Quel est ton age ? ")
if ($age < 18) {
    PRINTLN("Tu n'es pas encore majeur")
} ELSE {
    PRINTLN("Bonjour Monieur")
}
```

</details>

## WHILE $condition { ... }

Les conditions servent aussi à faire des __boucles__.
Cela permet de répéter une partie du code plusieurs fois.

Regarde bien cet exemple :

```ts
$continuer = "oui"
while $continuer == "oui" {
  cls()
  $a = random(10000)
  $b = random(10000)
  println($a, " x ", $b, " = ", $a * $b)
  $continuer = ask("On continue ? (oui/non)  ")
}
println()
println("C'est bon, j'arrete.")
```

Ici, __WHILE__ veut dire __tant que__. Et donc le programme va continuer à afficher des multiplication tant que la réponse est "oui".

On peut maintenant faire un jeu un peu plus élaboré.
TLK-74 va penser un nombre entre 1 et 100.
Tu vas essayer de deviner en moins de 10 coups.
À chaque fois, tu sauras si ton nombre est trop grand ou trop petit.

```ts
CLS()
$nombre = random(1, 100)
println("Je pense a un nombre entre 1 et 100...")
$continuer = 1
$coups = 0
REM 'AND" veut dire "et", en anglais.
REM Il faut bien penser à mettre les parenthèses
REM autour des deux conditions.
while ($continuer == 1) AND ($coups < 10) {
    color(24)
    $proposition = int(ask("A quel nombre je pense ? "))
    $coups = $coups + 1
    if $proposition == $nombre {
        $continuer = 0
    }
    else {
        color(6)
        if ($proposition > $nombre) {
            println("Trop grand.")
        }
        else {
            println("Trop petit.")
        }
    }
}
println()
if $coups < 10 {
    color(#12)
    println("Bravo tu as gagne en ", $coups, " coups.")
} else {
    COLOR(6)
    PRINTLN("Perdu !")
    PRINTLn("Il fallait trouver en moins de 10 coups.")
}
```

## FOR $value IN $liste { ... }

Il existe aussi une façon de faire des boucles, sans utiliser de condition.
L'instruction `FOR...IN` permet de boucler sur les éléments d'une __liste__.

> C'est quoi ça, une liste ?

Une liste, c'est un ensemble de valeurs qui se suivent dans un certain ordre.
On peut dire qu'un mot est une liste de lettres, par exemple.

D'ailleurs, en Basik, les textes sont en fait des listes de symboles.

```ts
CLS()
FOR $lettre IN "Anselm" {
    println($lettre)
}
```

Mais tu peux aussi utiliser des variables :

```ts
CLS()
$nom = ASK("C'est quoi ton petit nom ? ")
println()
println(CHR(#96, #9A, #9C))
FOR $lettre IN $nom {
    println(CHR(#95), $lettre, CHR(#95))
}
println(CHR(#93, #9A, #99))
```

Une autre façon de faire une liste est d'utiliser les crochets (__[__ et __]__).

```ts
cls()
for $couleur in [1, 2, 3, 4, 5, 6] {
    color(24)
    print("Couleur ", $couleur, " : ")
    color($couleur)
    println(CHR(#8F) * 20)
}
```

Si on veut afficher les 30 premières couleurs de la palettre de TLK-74,
il faudrait écrire `[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]`.

Mais comme c'est super long, on peut utiliser la fonction `RANGE()` qui crée une liste de nombres qui se suivent.

```ts
cls()
for $couleur in RANGE(1, 30) {
    color(24)
    print("Couleur ", $couleur, " : ")
    color($couleur)
    println(CHR(#8F) * 20)
}
```
