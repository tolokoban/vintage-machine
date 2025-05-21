Execute le programme suivant :

```ts
CLS()
$nom = ASK("Comment tu t'appelles ? ")
$age = ASKINT("Et tu as quel age ", $nom, " ? ")
PRINT("Dans 2 ans, ", $nom, " aura ", $age + 2, " ans.")
```

En français, ce programme veut dire :

- _Éfface l'écran._
- _Affiche le texte "Comment tu t'appelles ?"._
- _Attend que le joueur tapes du texte puis la touche ENTER._
- _Assigne la variable $nom avec le texte tapé par le joueur._
- _Affiche le texte "Et tu as quel age",_
- _suivi du texte qu'il y a en ce moment dans la variable $nom,_
- _suivi du texte "?"._
- _Attend que le joueur tapes son age en texte._
- _Transform ce texte en nombre entier (sans virgule)._
- _Met ce nombre dans la variable $age._
- _Affiche le texte "Dans 2 ans",_
- _suivi du texte contenu dans la variable $nom,_
- _suivi du texte "aura",_
- _suivi du nombre contenu dans $age plus deux,_
- _suivi du texte "ans."._

Quand TLK-74 te le demande, tape ton nom au clavier et termine par la touche __Entrée__. Fait pareil pour ton âge, et voilà.

> Pourquoi on a `ASK()` et aussi `ASKINT()` ?
> C'est quoi la différence ?

`ASK()` s'attend à ce que tu tapes un __texte__,
alors que `ASKINT()` s'attend à un __nombre entier__.

Regarde ce qu'il se passe si tu utilises `ASK()` pour demander l'age.

```ts
CLS()
$nom = ASK("Comment tu t'appelles ? ")
$age = ASK("Et tu as quel age ", $nom, " ? ")
PRINT("Dans 2 ans, ", $nom, " aura ", $age + 2, " ans.")
```

On a déjà vu qu'on pouvait multiplier des textes.
Ça répète le texte autant de fois.

Et bien quand on ajoute une valeur à un texte, ça la colle au bout.

> Et si je veux un nombre à virgule ?

Il existe aussi `ASKNUM()`.

```ts
CLS()
$temperature = ASKNUM("Quelle est la plus haute fievre que tu as eu ? ")
PRINTLN("Et bien moi, j'ai deja eu ", $temperature * 1.2)
```

## Exercice

Écris un programme qui demande deux nombres et qui affiche leur somme (l'addition des 2), puis leur produit (la multiplication).

Attention ! En BASIK, la multiplication s'écrit `*`. Comme dans cet exemple :

```ts
CLS()
PRINT( 3*7 )
```

<details>
<summary>Solution...</summary>

```ts
$a = ASKNUM("Donne-moi un nombre : ")
$b = ASKNUM("Encore un : ")
PRINTLN()
PRINTLN($a, " + ", $b, " = ", $a + $b)
PRINTLN()
PRINTLN($a, " x ", $b, " = ", $a * $b)
```

</details>
