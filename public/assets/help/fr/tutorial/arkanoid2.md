Il nous faut maintenant un moyen de créer facilement différents tableaux,
en plaçant les briques où on veut.

Pour cela, on va utiliser du texte, et dessiner un tableau comme ça :

```ts
$tableau = [
    "()()()()()()()()()()",
    " ()()()()  ()()()() ",
    "  ()[]()    ()[]()  ",
    "   ()()      ()()  ",
]
```

On dira que les parenthèses représentent les briques normales,
et les crochets les briques incassables.

On va donc écrire une procédure comme celle-ci :

```ts
DEF DESSINER_TABLEAU($tableau) {
  $x0 = 0
  $y0 = 0
  $x = $x0
  FOR $ligne IN $tableau {
    $y = $y0
    FOR $c IN $ligne {
      IF $c == "(" {
        BRIQUE1($x, $y)
      }
      IF $c == "[" {
        BRIQUE2($x, $y)
      }
      $y = $y + 20
    }
    $x = $x - 5
  }
}

$tableau = [
    "()()()()()()()()()()",
    " ()()()()  ()()()() ",
    "  ()[]()    ()[]()  ",
    "   ()()      ()()  ",
]

DESSINER_TABLEAU($tableau)
```

Si tu te sens fortiche, essaie de corriger cette procédure pour qu'elle affiche le tableau
comme il faut.

<details>
<summary>Solution...</summary>

```ts
DEF DESSINER_TABLEAU($tableau) {
  $x0 = 296
  $y0 = -84
  $x = $x0
  FOR $ligne IN $tableau {
    $y = $y0
    FOR $c IN $ligne {
      IF $c == "(" {
        BRIQUE1($x, $y)
      }
      IF $c == "[" {
        BRIQUE2($x, $y)
      }
      $y = $y + 16
    }
    $x = $x - 16
  }
}
```

</details>
