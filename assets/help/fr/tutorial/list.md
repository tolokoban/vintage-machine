Dans la vie de tous les jours, les __listes__ sont bien pratiques.
Si on va faire les courses, par exemples, on peut prendre la liste
des trucs à acheter.

Et bien en BASIK, on peut avoir des listes de valeurs et on peut les assigner à des variables.

Pour créer une liste, on peut utiliser les crochets et mettre les éléments dedans,
séparés par des virgules.

```ts
RESET()
$fruits = ["Pomme", "Banane", "Fraise"]
PRINTLN($fruits)
```

Tu peux mettre autant d'espace que tu veux entre les éléments de ta liste.
Ça peut t'aider à lire ton programme plus facilement.

```ts
RESET()
$fruits = [
    "Pomme", 
    "Banane", 
    "Fraise"
]
PRINTLN($fruits)
```

## Compter les élément d'une liste

La fonction `LEN()` te retourne la taille de la liste.

```ts
RESET()
$fruits = ["Pomme", "Banane", "Fraise"]
PRINTLN("J'ai ", LEN($fruits), " fruits dans ma liste")
```

## Accéder aux éléments de la liste

Imagine qu'on fasse un jeu de rôle.
Il nous faut des personnages avec des caractéristiques :

- Le nom (un texte)
- L'attaque (un nombre)
- La défense (un nombre)

On va donc représenter un personnage par la liste de ses caractéristiques :

```ts
RESET()
$dragon = [
    "Drogo le Fourbe",
    75,
    36
]
```

Pour affichier ses caractéristiques, il faut pouvoir lire les éléments de la variable `$dragon`. Et ça se fait aussi avec des crochets :

```ts
RESET()
$dragon = [
    "Drogo le Fourbe",
    75,
    36
]
PRINTLN("Vous venez de rencontrer un monstre !")
PRINTLN("Nom : ", $dragon[0])
PRINTLN("Att : ", $dragon[1])
PRINTLN("Def : ", $dragon[2])
```

Les crochets après une variable signifie qu'il faut prendre l'élément dont l'__index__
est entre les crochets. L'index __commence toujours par zéro__.
Donc `$dragon[0]` est le premier élément de la liste `$dragon`.

> Un bon copain m'a dit qu'on pouvait utiliser des
> index négatifs.
> C'est vrai ce mensonge ?

Oui ! C'est tout à fait vrai.
Les index négatifs prennent les éléments depuis la fin.
Donc `$dragon[-1]` est le dernier élément de la liste `$dragon`, et on peut réécrire notre programme comme ceci, si on veut :

```ts
RESET()
$dragon = [
    "Drogo le Fourbe",
    75,
    36
]
PRINTLN("Vous venez de rencontrer un monstre !")
PRINTLN("Nom : ", $dragon[-3])
PRINTLN("Att : ", $dragon[-2])
PRINTLN("Def : ", $dragon[-1])
```

## La destructuration

Parfois on a envie d'extraire les éléments d'une liste et les mettre dans plusieurs variables. On peut faire ça de deux façons.

La méthode classique :

```ts
RESET()
$dragon = [
    "Drogo le Fourbe",
    75,
    36
]

$nom = $dragon[0]
$att = $dragon[1]
$def = $dragon[2]

PRINTLN("Vous venez de rencontrer un monstre !")
PRINTLN("Nom : ", $nom)
PRINTLN("Att : ", $att)
PRINTLN("Def : ", $def)
```

La destructuration :

```ts
RESET()
$dragon = [
    "Drogo le Fourbe",
    75,
    36
]

$[nom, att, def] = $dragon

PRINTLN("Vous venez de rencontrer un monstre !")
PRINTLN("Nom : ", $nom)
PRINTLN("Att : ", $att)
PRINTLN("Def : ", $def)
```

La destructuration rend le code plus lisible et plus court.

## Extraire une sous-liste

Si on met deux entier entre les crochets, on n'extrait plus juste un élément,
mais une sous-liste.

```ts
RESET()
$fruits = ["Pomme", "Banane", "Cerise", "Fraise", "Abricot"]
PRINTLN( $fruits[1,3] )
PRINTLN( $fruits[0,-2] )
PRINTLN( $fruits[-2,-1] )
```

## Les textes sont des listes de symboles

Tout ce qu'on dit ici pour les listes fonctionne de la même façon pour les textes.

```ts
RESET()
$fruit = "Abricot"
PRINTLN( $fruit[1,3] )
PRINTLN( $fruit[0,-2] )
PRINTLN( $fruit[-2,-1] )
```

## Assigner un élément d'une liste

Si une variable est une liste (ou un texte), on peut assigner une valeur à l'un de ses éléments,
en utilisant encore une fois la syntaxe avec des crochets.

Dans l'exemple suivant, on ajoute un bonus en défense pour notre dragon.

```ts
RESET()
$dragon = [
    "Drogo le Fourbe",
    75,
    36
]
$bonus = 100

$dragon[2] = $dragon[2] + $bonus

$[nom, att, def] = $dragon
PRINTLN("Vous venez de rencontrer un monstre !")
PRINTLN("Nom : ", $nom)
PRINTLN("Att : ", $att)
PRINTLN("Def : ", $def)
```

## Remplacer une sous-liste

En utilisant la même technique, mais avec deux entiers entre les crochets,
on peut remplacer pluseurs élément d'un coup.

```ts
RESET()
$dragon = [
    "Drogo le Fourbe",
    75,
    36
]

$dragon[1, 2] = [ 56, 100 ]

$[nom, att, def] = $dragon
PRINTLN("Vous venez de rencontrer un monstre !")
PRINTLN("Nom : ", $nom)
PRINTLN("Att : ", $att)
PRINTLN("Def : ", $def)
```

En utilisant une liste vide (`[]`), on peut supprimer des éléments de la liste.

```ts
RESET()
$fruits = ["Pomme", "Banane", "Cerise", "Fraise", "Abricot"]
PRINTLN( $fruits )
$fruits[-1,-1] = []
PRINTLN( $fruits )
$fruits[1,2] = []
PRINTLN( $fruits )
```

## Ajouter des éléments dans une liste

Pour ajouter un élément à la fin d'une liste on peut utiliser un index plus grand que la taille de la liste,
ou ne pas spécifier de valeur du tout.

```ts
RESET()
$fruits = ["Pomme", "Banane", "Cerise"]
PRINTLN( $fruits )
$fruits[999] = "Abricot"
PRINTLN( $fruits )
$fruits[] = "Fraise"
PRINTLN( $fruits )
```

Et pour insérer ailleurs, il faut utiliser la fonction `INSERT()`.

```ts
RESET()
$fruits = ["Pomme", "Banane", "Cerise"]
PRINTLN( $fruits )
$fruits = INSERT($fruits, 0, "Abricot")
PRINTLN( $fruits )
$fruits = INSERT($fruits, -1, "Fraise")
PRINTLN( $fruits )
```
