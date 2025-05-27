# CALL

## `CALL( nom_fonction, arg1, arg2, ... )`

Appelle la fonction/procédure dont on passe le nom en argument.

### Exemple

On voit ici deux façons d'appeler les fonctions `ADD` et `MUL`.

```ts
RESET()

DEF ADD( $a, $b ) RETURN $a + $b
DEF MUL( $a, $b ) RETURN $a * $b

PRINTLN( ADD( 5, 7 ) )
PRINTLN( MUL( 5, 7 ) )

PRINTLN( CALL( "ADD", 5, 7 ) )
PRINTLN( CALL( "MUL", 5, 7 ) )
```

### Exemple

`CALL` devient puissant quand on utilise un variable en premier argument.

```ts
RESET()
DEF ROND() DISK( RANDOM( 20,80 ) )
DEF CARRE() RECT( RANDOM( 0,160 ) )
DEF BOUGE() MOVE(
  RANDOM( -320, 320 ),
  RANDOM( -240, 240 )
)
DEF COULEUR() COLOR( RANDOM( 256 ) )

$actions =[
  "ROND", "CARRE", "BOUGE", "COULEUR"
]
for $boucle in range( 100 ) {
  CALL( PICK( $actions ) )
  PAUSE()
}
```
