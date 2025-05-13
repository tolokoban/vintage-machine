# ABS()

## `ABS( $nombre )`

Retourne la _valeur absolue_ d'un nombre, c'est-à-dire ce nombre sans son signe __-__.
Du coup, `ABS(-3)=3` et `ABS(3)=3`.

Exemple :

```ts
$n1 = ASKNUM("Donne moi un nombre : ")
$n2 = ASKNUM("Donne moi-en un autre : ")
PRINT("La difference entre les deux est " + ABS($n1 - $n2))
```

Voir aussi [ASK](ASK), [PRINT](PRINT).
