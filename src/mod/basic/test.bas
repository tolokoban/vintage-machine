# Programme de test.

$w = 640 / 8
$h = 480 / 8

FOR $color = 0 TO 63
   $x = ($color % 8) * $w
   $y = (($color - ($color % 8)) / 8) * $h
   PEN0 $color
   POINT $x, $y
   POINT $x + $w, $y
   POINT $x, $y + $h
   TRIANGLE
NEXT

