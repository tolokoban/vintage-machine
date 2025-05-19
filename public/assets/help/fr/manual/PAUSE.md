# PAUSE()

## `PAUSE( secondes )`

Interrompt l'exécution de ton programme pendant le temps
donné (en secondes).

### Exemple

Voici un programme qui compte jusqu'à dix.

```ts
RESET()
PRINTLN("Je vais compter jusqu'a 10,")
PRINTLN("alors cachez-vous bien ! à")
PRINTLN()
FOR $n IN range(1, 10) {
  PRINTLN($n)
  PAUSE(1)
}
PRINTLN()
PRINTLN("J'arrive !")
```

## `PAUSE()`

Permet de faire la plus petite pause possible.

> Hein ? Main ça sert à quoi ?

La pause a deux fonctions :

1. attendre un certain temps avant de continuer,
2. rafraichir l'écran.

Quand tu dessines quelque chose à l'écran, avec les procédures
DRAW, RECT, etc., rien ne se voit à l'écran avant le prochain
__rafraichissement__. C'est une technique qui permet à TLK-74
d'etre rapide. Il attend de savoir ce que tu veux dessiner
avant de la faire.
Si tu veux faire trois cercles, il préfère les afficher
tous en un coup plutot que chacun son tour.

Il y a cependant des cas où le rafraichissement est forcé :

1. Quand le programme se termine.
2. Quand tu usilises PRINT, ASK et CLS.
3. Quand tu utilises PAINT.

C'est pourquoi `PAUSE()` sans argument es souvent utilisé dans les animations.

```ts
RESET()
WHILE 1 {
    CLS()
    $t = TIME() / 10
    $h = ABS(200 * SIN($t))
    $y = 160 - $h
    MOVE(0, $y)
    DISK(120, MIN(120, 240 - $y))
    PAUSE()
}
```
