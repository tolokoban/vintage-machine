
## Créer sa propre procédure

Ce serait bien d'avoir une procécure qui dessine un mickey.
On pourrrait même l'appeler `MICKEY()` pour s'en souvenir facilement.

> On peut faire ça ?

Oui. Il suffit d'apprendre cette nouvelle procédure à TLK-74 grace à l'instruction
`DEF ...`.

```ts
RESET()
DEF Mickey() {
  $oeil = "C1D24,34C26D20,30C1m5,10D13"
  DRAW(
    "C1D100(m-90,-90D70)(m90,-90D70)",
    "(C1m5,55D100,45C26D96,41)",
    "C26(m-25,-10D45,60)(m25,-10D45,60)",
    "(m-25,-10", $oeil, ")",
    "(m25,-10", $oeil, ")",
    "(m5,27C1D20)",
    "(C1m10,60R50,2)",
  )
}

cls(11)
MOVE(-160,-80)
MICKEY()
MOVE(160,-80)
MICKEY()
MOVE(0,140)
mickey()
```
