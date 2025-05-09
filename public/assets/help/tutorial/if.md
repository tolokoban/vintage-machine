```ts
$de = RANDOM(1, 6)
println("J'ai lance un de a 6 faces.")
$prop = int(ask("Devine sa valeur : "))
if $prop == $de {
    println("Tu as gagne. Bravo !")
}
else {
    println("Non. C'etait ", $de)
}
```

TLK-74 tire un nombre au hasard entre 1 et 6 grace à la fonction `RANDOM()`.
Puis il te demande de le deviner.

Si tu as trouvé, il te dit bravo.

> Mais ça veut dire quoi __IF__ et __ELSE__ ?

Comme souvent, les mots de programmation viennent de l'anglais.
Et du coup, __IF__ veut dire __si__ et __ELSE__ veut dire __sinon__.

Du coup, ce programme dit : __si__ `$prop` est égal à `$de` alors afficher "Tu as gagne. Bravo", __sinon__ afficher "Non. C'etait ...".

```ts
CLS()
$nombre = random(1, 100)
println("Je pense a un nombre entre 1 et 100...")
$continuer = 1
$coups = 0
while $continuer AND ($coups < 10) {
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
    color(9)
    println("Bravo tu as gagne en ", $coups, " coups.")
} else {
    COLOR(6)
    PRINTLN("Perdu !")
    PRINTLn("Il fallait trouver en moins de 10 coups.")
}
```
