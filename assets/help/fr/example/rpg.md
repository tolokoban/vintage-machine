# Histoire dont tu es le héro

```ts
RESET()
INK(0, 2, 2, 2)
INK(1, 12, 12, 13)
INK(2, 0, 15, 5)
$CLEFS = [0,0,0,0,0]

def disp($txt) {
  COLOR(1)
  FOR $c IN $txt {
    PRINT($c)
    PAUSE()
  }
  printLN()
}
DEF MENU($items){
  PRINTLN()
  $choix=0
  for $item in $items {
    $choix= $choix+1
    COLOR(2)
    PRINT($choix, ") ")
    COLOR(1)
    PRINTLN($item)
    PRINTLN()
  }
  PRINTLN()
  PRINTLN("Fais ton choix aventurier !")
  PRINTLN()
  PRINTLN()
  WHILE 1 {
    $choix = INT(WAIT())
    if ($choix<1)OR($choix>LEN($ITEMS)){
      INK(0, 15, 7, 7)
      PAUSE(0.1)
      INK(0, 9, 9, 9)
    }
    ELSE {
      RETURN $choix
    }
    
  }
  
}
DEF room0(){
  DISP("Tu es devant une vieille maison")
  DISP("abandonnee.")
  disp("Elle ressemble a la description que")
  DISP("Baldur t'a faite.")
  $choix = menu([
  "Tu entres discretement",
  "Tu mets un grand coup de pied dans la porte"
  ])
  if $choix==2 {
    DISP("Tu y va franchement, mais la porte")
    disp("est solide et tu te casses la jambe.")
    PRINTLN()
    DISP("Dommage, ton aventure s'arrete ici.")
    RETURN ""
  }
  return "ROOM1"
}
DEF ROOM1() {
  DISP("Te voila dans le hall d'entree.")
  DISP("Il y a trois portes.")
  DISP("Laquelle vas-tu prendre ?")
  $choix=MENU([
  "En face", "A droite", "A gauche", "Tu veux sortir"
  ])
  IF $choix==1 return "ROOM4"
  IF $choix==2 RETUrN "ROOM3"
  IF $choix==3 RETURN "ROOM2"
  return "ROOM0"
}
DEF ROOM2($clefs) {
  DISP("C'est un placard a balais. Il y fait sombre.")
  IF $clefs[3] RETURN ROOM2OLD()
  RETURN ROOM2NEW($clefs)
}
def ROOM2OLD() {
  DISP("Tu a deja trouve la clef ici.")
  DISP("Que veux tu faire maintenant ?")
  $choix=MENU([
  "Chercher encore", "Sortir de la piece"])
  if $choix==1 {
    DISP("Tu fouilles le placard de fond en")
    disp("comble.")
    DISP("A force de tout remuer, tu te prends")
    DISP("les doigts dans une tapette a souris !")
    PRINTLN()
    DISP("Ca ne s'arrete plus de saigner et tu")
    DISP("meurs en faisant aie, aie, aie !!")
    return ""
  }
  return "ROOM1"
}
DEF ROOM2NEW($clefs) {
  DISP("Tu trouves une clef sur un gueridon.")
  $choix=MENU([
  "Tu la prends et sors de la piece",
  "Tu sors de la piece sans la prendre"
  ])
  if $choix==1 $clefs[3] = 1
  return "ROOM1"
}
DEF ROOM3($clefs) {
  IF $clefs[3]==0 {
    disp("La porte est fermee a clef.")
    $choix=menu([
    "Tu la defonces",
    "Tu laisses tomber"
    ])
    if $choix==2 return "ROOM1"
    DISp("Ta puissance est telle que la")
    disp("porte vole en eclats !")
    PRINTLN()
    disp("Malheureusement, le mur tombe,")
    DISP("ce qui fait s'effondrer le toit.")
    PRINTLN()
    DISP("Tu te fais ecraser par tout le manoir")
    DISP("et ca fait mal...")
    return ""
  }
  IF $clefs[4]==0 {
    DISP("La clef fonctionne et tu te retrouves")
    disp("dans une cuisine.")
    $choix=MENU([
    "Tu la prends et sors de la piece",
    "Tu sors de la piece sans la prendre"
    ])
    if $choix==1 $clefs[4] = 1
    return "ROOM1"
  }
  IF $clefs[4]==1 {
    DISP("Tu es deja venus dans cette cuisine.")
    DISP("Tu y a meme trouve une clef.")
    DISP("Que veux tu faire maintenant ?")
    $choix=MENU([
    "Chercher encore", "Sortir de la piece"])
    if $choix==2 return "ROOM1"
    disp("Tu as bien fait d'insister :")
    disp("Tu trouves une autre clef !")
    $choix = MENU([
    "Tu la prends et sors de la piece",
    "Tu sors de la piece sans la prendre"
    ])
    IF $choix==1     $clefs[4]=2
    return "ROOM1"
  }
  else {
    disp("Il n'y a vraiment plus rien a faire")
    disp("dans cette cuisine...")
    $choix=MENU(["Sortir de la cuisine"])
    return "ROOM1"
  }
  
}
DEF ROOM4($clefs) {
  IF $clefs[4]==0 {
    DISP("Cette porte est fermee a clef.")
    DISP("Et elle est trop solide pour")
    DISP("tenter de la briser.")
    if $clefs[3]==0 DISP("Il faut trouver une clef !")
    ELSE {
      DISP("Malheureusement, la clef que tu as")
      DISP("n'est pas la bonne...")
    }
    $choix=MENU(["Retourner dans le hall"])
    return "ROOM1"
  }
  IF $clefs[4]==1 {
    DISP("Cette porte est fermee a clef.")
    DISP("Tu essaies tes deux clefs, mais")
    DISP("aucune n'ouvre la porte.")
    $choix=MENU(["Retourner dans le hall"])
    return "ROOM1"
  }
  DISP("Tu utilises ta troisieme clef")
  DISP("et la porte d'ouvre !")
  PRINTLN()
  DISP("La piece est pleine de pieces d'or")
  DISP("et de joyaux de toutes sortes.")
  PRINTLN()
  DISP("Tu as gagne ta jounee !!")
  return ""
}
$room = "ROOM0"
WHile $ROOM<>""{
  CLS()
  IF $room=="ROOM0"$room = room0()
  ELIF $room=="ROOM1"$room = room1()
  ELIF $room=="ROOM2"$room = room2($clefs)
  ELIF $room=="ROOM3"$room = room3($clefs)
  ELIF $room=="ROOM4"$room = room4($clefs)
  ELSE {
    PRINT($room)
    $room=""
  }
  
}
PRINTLN()
PRINTLN("C'est fini.")
```
