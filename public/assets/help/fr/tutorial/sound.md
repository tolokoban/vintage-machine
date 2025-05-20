## Faire un simple son

TLK-74 peut émettre des sons. Il n'a pas une très belle voix, soyons honnetes.
Mais c'est utilisable dans des jeux retro.

Essaie ça :

```ts
SOUND(440)
```

Pas facile à savoir, mais c'est un LA.
Essayons de le faire durer un peu plus longtemps.

```ts
SOUND(440, 2)
```

Cette fois, la note dure __2__ secondes. Si tu veux qu'elle dure 4 seondes, fait ceci :

```ts
SOUND(440, 5)
```

> Et c'est quoi le 440 ?

C'est ce qu'on appelle la fréquence de la note.
Voici un petit tableau qui te donne quelques notes avec leurs fréquences :

|           |       |       |       |       |       |       |       |
| --------- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Note      |   DO  |   RE  |   MI  |   FA  |  SOL  |   LA  |   SI  |
| Code      |   C3  |   D3  |   E3  |   F3  |   G3  |   A4  |   B4  |
| Fréquence | 130.8 | 146.9 | 164.8 | 174.6 | 196.0 | 220.0 | 246.9 |
| Code      |   C4  |   D4  |   E4  |   F4  |   G4  |   A5  |   B5  |
| Fréquence | 261.6 | 293.8 | 329.6 | 349.2 | 392.0 | 440.0 | 493.8 |

> Cool ! Alors, si je mets plusieurs `SOUND()` à la suite, je peux faire une musique ?

Pas vraiment... Essaie, tu vas voir ce que ça donne :

```ts
SOUND(261.6, 3)
SOUND(293.8, 3)
SOUND(329.6, 3)
SOUND(349.2, 3)
SOUND(392.0, 3)
SOUND(440.0, 3)
SOUND(493.8, 3)
```

> On dirait qu'il fait tout en meme temps, ce belu !

Et oui. C'est bien ce qu'il fait.
Si tu veux faire une morceau de musique avec des notes qui s'emchainent, il te faut autre chose.

## Jouer une partition

Si tu veux jouer plusieurs notes d'affilé, il faut donner une partition à TLK-74.
Dans son univers, les partitions sont des textes composés de notes, et de temps.

Les notes sont notés A, B, C, D, E, F et G. Comme dans le tableau qu'on a vu avant.
Il faut aussi ajouter l'octave à laquelle cette note est jouée. Il existe 9 octaves.
1 est la plus grave, et 9 la plus aigue.

Voici une petite partition :

```ts
PAUSE(
    PLAY(
      "E4 D#4 E4 D#4 E4 B3 D4 C4 A3 - C3 E3 A3 B3 - E3 G#3 B3 C4 - E3 E4 D#4 E4 D#4 E4 B3 D4 C4 A3 - C3 E3 A3 B3 - E3 C4 B3 A3"
    )
)
```

Ici, on utilise `PAUSE` pour lui dire d'attendre la fin de la musique. Sinon, le programme se terminerait avant la fin du morceau.

> Il y a quand meme des trucs louches ici...
> C'est quoi les tirets, et les dièses ?

Le tiret (__-__), c'est un __silence__. À cet endroit, le musicien TLK-74, doit faire une pause.
Et le dièse (__#__) c'est un dièse comme en musique. `D4#`, c'est un RE dièse.

Tu pourrais aussi ajouter un petit __b__ à la fin d'une note pour faire un bémol.

> Et si je veux des notes plus longues que d'autres ?

Si tu ne dis rien, toutes les notes sont des noires. Elles ont la valeur 4. Tu peux utiliser la notation `:2` pour changer la longueur des notes qui suivents. Le tableau suivant te donnes les détails :

|      |       |         |       |        |               |               |
| ---- | ----- | ------- | ----- | ------ | ------------- | ------------- |
| Code |    :1 |      :2 |    :4 |     :8 |           :16 |           :32 |
| Note | Ronde | Blanche | Noire | Croche | Double croche | Triple croche |

```ts
PAUSE(
    PLAY(
        ":1 E4 :2 D3 G3 :4 D3 G3 :8 D3 G3 :16 D3 G3 :1 E4"
    )
)
```

> Et si je mets :7, par exemple ?
> Il va faire quoi le TLK, hein ?

Rien ne lui fait peur. Il va simplement faire une note un peu plus longue qu'une croche.

Allez ! Amuse-toi à créer de magnifiques compositions pour tes jeux.
