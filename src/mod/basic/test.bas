# Programme de test.

$w = 640 / 8
$h = 480 / 8
$color = 0

FOR $y = 0 TO 479 STEP $h
   FOR $x = 0 TO 639 STEP $w
      PEN $color
      BOX $x, $y, $w, $h
      $color = $color + 1
   NEXT
NEXT

