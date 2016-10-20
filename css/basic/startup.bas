PEN &FF0
PRINT "Bienvenue !  Je suis ", 1
PEN &F70
PRINT "TLK-74", 5
PEN &FF0
PRINT ", ton ordinateur personnel ", 1
PEN &0F0
PRINT "SUPER RAPIDE !"
PEN &FF0

$r = 200
$x = 320
$y = $r
$c0 = cos(0) * $r
$s0 = sin(0) * $r
$c1 = cos(120) * $r
$s1 = sin(120) * $r
$c2 = cos(240) * $r
$s2 = sin(240) * $r

POINT $x, $y, &fff
POINT $x + $c0, $y + $s0, &f00
POINT $x + $c1, $y + $s1, &0f0
TRIS
POINT $x - $c2, $y - $s2, &000
POINT $x + $c0, $y + $s0, &f00
POINT $x + $c1, $y + $s1, &0f0
TRIS

POINT $x, $y, &fff
POINT $x + $c1, $y + $s1, &0f0
POINT $x + $c2, $y + $s2, &00f
TRIS
POINT $x - $c0, $y - $s0, &000
POINT $x + $c1, $y + $s1, &0f0
POINT $x + $c2, $y + $s2, &00f
TRIS

POINT $x, $y, &fff
POINT $x + $c2, $y + $s2, &00f
POINT $x + $c0, $y + $s0, &f00
TRIS
POINT $x - $c1, $y - $s1, &000
POINT $x + $c2, $y + $s2, &00f
POINT $x + $c0, $y + $s0, &f00
TRIS

LOCATE 0,4
PRINT "Appuie sur la touche ", 1
PEN &FFF
PRINT "F1"
PEN &FF0
PRINT " pour commencer.", 1
