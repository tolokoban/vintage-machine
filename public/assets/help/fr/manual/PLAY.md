# PLAY()

## `PLAY( partition )`

La partition est un texte dans lequelles il y a des commandes.

- Définir le volume : `@1` (le moins fort), `@2`, `@3`, ... `@9` (le plus fort).
- Durée de la note : `:1` (ronde), `:2` (blanche), `:4` (noire), `:8` (croche), `:16` (double croche), `:32` (triple croche), `:64` (quadruple croche).
- Jouer une note: `C` (DO), `D` (RE), `E` (MI), `F` (FA), `G` (SOL), `A` (LA), `B` (SI), suivi éventuellement d'un `#` (dièse) ou un `b` (bémol), suivi de l'octave entre 1 (très grave) à 9 (très aigu).
- Faire un silence de la durée courante : `-` (un tiret).

### Exemple

```ts
PAUSE(
    PLAY(
        "- C4 C4 C4 D4 :2 E4 D4 :4 - C4 E4 :8 D4 D4 :1 @9 C4"
    )
)
```

## `PLAY( partition, tempo )`

Par défaut le tempo est de 120 noires par minute. Ça veut dire 120 noires pour 60 secondes, donc 2 noires par secondes et donc une noire dure une demi-seconde.

Mais on peut choirir un autre tempo.

```ts
PAUSE(
    PLAY(
        "- C4 C4 C4 D4 :2 E4 D4 :4 - C4 E4 D4 D4 :1 @9 C4",
        240
    )
)
```

## `PLAY( list_de_partitions, tempo )`

Ici aussi, si on ne passe pas `tempo` en argument, on considère ue c'est 120.

On peut jouer plusieurs partitions en meme temps en les passant en tant que liste.

### Exemple

```ts
PAUSE(PLAY(
    ["@6 C4C4C4D4:2E4D4:4C4E4D4D4:1C4", "@3 1:C34:D3D3E3C3:2D3E3:4D3C3C3C3"]
))
```

On peut faire des canons complètements fous, mais TLK-74 a des limites et il peut faire du caca au bout d'un moment.

```ts
$theme = "C4C4C4D4:2E4D4:4C4E4D4D4:1C4"
PAUSE(PLAY([
    $theme,
    "-" + $theme,
    "--" + $theme,
    "---" + $theme,
    "----" + $theme,
    "-----" + $theme,
    "------" + $theme,
    "-------" + $theme,
]))
```

----

Voir aussi [SOUND](SOUND), [STOP](STOP).
