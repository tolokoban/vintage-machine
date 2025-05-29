# Le combat dess gladiateurs

```ts
RESET()
REM Couleurs pour la barre de vie
for $c IN RANGE(16) {
  INK(200+$c, $c, 15)
  INK(216+$c, 15, 15-$c)
}

DEF TRI_PAR_BULLES($gladiators, $index) {
  $ok = 0
  WHILE NOT($ok) {
    $ok = 1
    for $i1 IN RANGE(LEN($gladiators)-1) {
      $i2 = $i1 + 1
      $glad1 = $gladiators[$i1]
      $glad2 = $gladiators[$i2]
      $v1 = $glad1[$index]
      $v2 = $glad2[$index]
      if $v1 < $v2 {
        $ok = 0
        $gladiators[$i1] = $glad2
        $gladiators[$i2] = $glad1
      }
    }
  }
  return $gladiators
}

DEF NEW_NAME() {
  $syllabes =[
    "to", "lo", "ko", "ban",
    "al", "ois", "ans", "elm",
    "le", "go", "las", "gim", "li",
    "ara", "gorn", "gan", "dalf",
    "gol", "do", "rak", "ac", "ta", "rus",
    "tech", "no", "li", "lian",
    "cro", "ko", "dil", "syr", "rius",
    "oc", "ta", "vius", "men", "wo",
    "hok", "park", "mir", "lars", "ak",
    "anu", "bis", "ra", "mon", "bo", "fis",
    "ju", "py", "ter", "ura", "nus",
    "ne", "fer", "ti", "cleo", "pa", "tre"
  ]
  $nom = ""
  for $i IN RANGE( 1, ranDom( 2,4 ) )
  $nom = $nom + PICK( $syllabes )
  return uppercase( $nom )
}

DEF NEW_GLADIATOR() {
  $att = RANDOM( 50,100 )
  $def = RANDOM( 50,100 )
  $deg = RANDOM( 10,299 )
  $pdv = RANDOM( 10, 99 ) * 10
  return[
    NEW_NAME(), $att, $def, $deg, $pdv, 0
  ]
}

DEF PRINT_GLADIATOR( $gladiator ) {
  $[ nom, att, def, deg, pdv, pts ]=$gladiator
  color( 24 )
  print( PADL( $nom, 18 ) )
  COLOR( 11 )
  print(
    PADR( $att, 4 ), PADR( $def, 4 ),
    PADR( $deg, 4 ), PADR( $pdv, 5 )
  )
  if $pts>0 COLOR(#12)
  ELIF $pts<0 COLOR(6)
  ELSE COLOR(#1A)
  print(PADR($pts, 5))
}

DEF print_gladiators($gladiators) {
  color(8)
  PRINTLN(
    PADL("Nom", 18), PADR("Att", 4), 
    PADR("Def", 4), PADR("Deg", 4), 
    PADR("PDV", 5), PADR("Pts", 5)
  )
  for $gladiator IN $gladiators PRINT_GLADIATOR($gladiator)
  PRiNTLN()
}

DEF append_GLADIATOR($gladiators)
$gladiators[] = new_gladiator()

DEF WAIT_USER() {
  $cls = "M0,232C0R640,16"
  DRAW($cls)
  COLOR(100)
  MOVE(0,232)
  LABEL("Tape ENTER pour continuer...")
  INK(100, 15, 15, 15)
  PAUSE(.5)
  WHILE NOT(KEY("Enter")) {
    $c = ABS(15 * SIN(TIME()/10))
    INK(100, $c, $c, $c)
    PAUSE()
  }
  DRAW($cls)
}

DEF PUNCH($att1, $def2, $deg1) {
  $att = $att1 + RANDOM(100)
  $def = $def2 + RANDOM(100)
  if $att > $def return RANDOM(2, $deg1)
  RETURN 0
}

DEF ENERGY_BAR($y, $pdv, $max, $nom) {
  $h = 60
  $percent = $pdv / $max
  COLOR(13)
  MOVE(0, $y) RECT(640, $h)
  COLOR(232 - INT($percent * 32))
  $x = (320*$percent) - 320
  MOVE($x, $y)
  RECT(640*$percent, $h)
  COLOR(26)
  MOVE(0, $y - 2) LABEL($nom, 2)
  COLOR(2)
  MOVE(0, $y) LABEL($nom, 2)
}

DEF battle($gladiators, $idx1, $idx2) {
  $pause = .2
  $cls = "M0,120C0R640,240"
  DRAW($cls)
  $glad1 = $gladiators[$idx1]
  $glad2 = $gladiators[$idx2]
  $[nom1, att1, def1, deg1, maxpdv1]=$glad1
  $[nom2, att2, def2, deg2, maxpdv2]=$glad2
  $pdv1 = $maxpdv1
  $pdv2 = $maxpdv2
  $blows1 = 0
  $blows2 = 0
  DRAW($cls)
  $total = 0
  WHILE ($pdv1>0)AND($pdv2>0) {
    $pdv1 = MAX(0, $pdv1 - 1)
    $pdv2 = MAX(0, $pdv2 - 1)
    $total = $total + 1
    ENERGY_BAR(80, $pdv1, $maxpdv1, $nom1 + " " + $blows1 + "/" + $total)
    ENERGY_BAR(160, $pdv2, $maxpdv2, $nom2 + " " + $blows2 + "/" + $total)
    $punch1 = PUNCH($att1, $def2, $deg1)
    if $punch1 > 0 {
      $pdv2 = MAX(0, $pdv2 - $punch1)
      $blows1 = $blows1 + 1
      PAUSE($pause)
    }
    $punch2 = PUNCH($att2, $def1, $deg2)
    if $punch2 > 0 {
      $pdv1 = MAX(0, $pdv1 - $punch2)
      $blows2 = $blows2 + 1
      PAUSE($pause)
    }
    PAUSE()
  }
  ENERGY_BAR(80, $pdv1, $maxpdv1, $nom1 + " " + $blows1 + "/" + $total)
  ENERGY_BAR(160, $pdv2, $maxpdv2, $nom2 + " " + $blows2 + "/" + $total)
  if $pdv1 < $pdv2 {
    $glad1[5] = $glad1[5] - 1
    $glad2[5] = $glad2[5] + 1
  } else {
    $glad1[5] = $glad1[5] + 1
    $glad2[5] = $glad2[5] - 1
  }
}

$gladiators = []
for $i IN RANGE( 12 ) append_gladiator($gladiators)
$gladiators = TRI_PAR_BULLES($gladiators, 4)

COLOR(15)
MOVE(0, -208)
LABEL("GLADIATORS", 2)
COLOR(24)
LOCATE(0, 5)
PRINT(
  "12  gladiateurs  vont  s'affronter  dans",
  "l'arene devant les yeux de l'empereur.  ",
  "Essaie de deviner qui sera le meilleur !"
)
PRINTLN()
PRINTLN()
PRINTLN()
print_gladiators($gladiators)
WAIT_USER()

FOR $boucle IN RANGE(LEN($gladiators)) {
  $gladiators = TRI_PAR_BULLES($gladiators, 5)
  FOR $idx1 IN RANGE(0, LEN($gladiators)-1, 2) {
    $idx2 = $idx1 + 1
    CLS()
    print_gladiators($gladiators)    
    $glad1 = $gladiators[$idx1]
    $glad2 = $gladiators[$idx2]
    COLOR(26)
    PRINTLN()
    PRINTLN("Prochain combat : ")
    PRINTLN()
    COLOR(24) PRINT($glad1[0])
    COLOR(26) PRINT(" / ")    
    COLOR(24) PRINT($glad2[0])
    PRINTLN()
    PRINTLN()
    PRINT_GLADIATORs([$glad1, $glad2])
    PRINTLN()
    $[nom1, att1, def1, deg1, pdv1] = $glad1
    $[nom2, att2, def2, deg2, pdv2] = $glad2
    $force1 = CLAMP(100 + ($att1- $def2), 0, 200)
    $force2 = CLAMP(100 + ($att2- $def1), 0, 200)
    $coup1 = $deg1 * $force1
    $coup2 = $deg1 * $force1
    $chance1 = $pdv1 / $coup2
    $chance2 = $pdv2 / $coup1
    COLOR(26) PRINT("Je parie sur ")
    COLOR(24)
    IF $force1 > $force2 PRINTLN($nom1)
    ELSE PRINTLN($nom2)
    COLOR(26) PRINT("Et toi ?")
    WAIT_USER()
    BATTLE($gladiators, $idx1, $idx2)
    WAIT_USER()
  }
}

CLS()
COLOR(8)
PRINTLN("Les combats sont termines !")
PRINTLN()
PRINTLN()
PRINT_GLADIATORS($gladiators)
```
