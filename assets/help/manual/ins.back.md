# BACK

> BACK couleur
> BACK couleur, temps

Definir la couleur d'arrière plan. Si un deuxième argument est fourni, il correspond à la durée de transition en millisecondes.

Voici comment définir rapidement un fond orange :

```
BACK &f70
```

Et voici comment le faire en passant par la fonction [`COLOR`](fun.color) :

```
BACK COLOR(15, 7, 0)
```

Si on veut que la couleur se dégrade vers le orange en 3 secondes, on écrira :

```
BACK &f70, 3000
```

Voir aussi [`COLOR`](fun.color).

----

[Index](../index)
