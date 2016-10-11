# Programme de test.

FOR $color = 0 TO 63
  PEN0 $color
  POINT $color * 8, $color * 6
  POINT 640,0
  POINT 0,480
  TRIANGLE
NEXT

