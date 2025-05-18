# EXIT()

## `EXIT()`

Termine le programme immédiatement.

### Exemple

```ts
WHILE 1 {
  CLS(RANDOM(30))
  COLOR(RANDOM(1, 29))
  $reponse = ASK("Continuer ? (oui/non). ")
  IF $reponse <> "oui" {
    EXIT()
  }
}
```
