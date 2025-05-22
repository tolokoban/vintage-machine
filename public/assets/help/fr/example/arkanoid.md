# Arkanoïd

```ts
RESET()
REM BEGIN Variables globales
$limites_level = [
  -320, 320 - 16,
  224-(10*32), 224
]
$pad_radius = 30
REM END

DEF BIP1() SOUND(440, 1)
DEF BIP2() SOUND(330, 1)

DEF DRAW_BACKGROUND() {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $x = ($xmin + $xmax) / 2
  $y = ($ymin + $ymax) / 2
  COLOR(200)
  MOVE($x, $y)
  RECT(ABS($xmax-$xmin), ABS($ymax-$ymin))
  $x = $xmax + 8
  $y = $ymin
  for $i IN RANGE(11) {
    BRIQUE2($x, $y)
    $y = $y + 32
  }
  FOR $i IN RANGE(20) {
    $cmd = "C103R30,14"
    $x = ($i * 32) - 320
    $y = $ymin - 8    
    MOVE($x,$y) DRAW($cmd)
    $y = $ymax + 8    
    MOVE($x,$y) DRAW($cmd)
  }
}

REM BEGIN Brique
DEF BRIQUE($x, $y, $color) {
  MOVE($x, $y)
  DRAW("C", $color, "R14,30")
  DRAW("C", $color+2, "(m0,13R12,2)(m-5,0R2,28)") REM Ombre
  DRAW("C", $color+1, "(m0,-13R12,2)(m6,0R2,28)") REM Reflet
}
DEF BRIQUE1($x,$y) { BRIQUE($x, $y, 100) }
DEF BRIQUE2($x,$y) { BRIQUE($x, $y, 103) }
DEF COULEUR_BRIQUE($rouge, $vert, $bleu, $color) {
  $a = 30
  $b = 3
  INK($color, $rouge, $vert, $bleu)
  INK($color+1, ($a + $rouge) / $b, ($a + $vert) / $b, ($a + $bleu) / $b)
  INK($color+2, $rouge/2, $vert/2, $bleu/2)  
}
DEF COULEUR_BRIQUE1($r, $v, $b) { COULEUR_BRIQUE($r, $v, $b, 100) }
DEF COULEUR_BRIQUE2($r, $v, $b) { COULEUR_BRIQUE($r, $v, $b, 103) }
REM END

DEF DRAW_LEVEL($level) {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $x0 = $xmax - 8
  $y0 = $ymin + 16
  $x = $x0
  FOR $ligne IN $level {
    $y = $y0
    FOR $c IN $ligne {
      IF $c == "(" BRIQUE1($x, $y)
      ELIF $c == "[" BRIQUE2($x, $y)
      $y = $y + 16
    }
    $x = $x - 16
  }
}

DEF PAD_Y() {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $r = @pad_radius
  RETURN CLAMP(MOUSEY(), $ymin + $r + 8, $ymax - ($r + 8))
}
DEF DRAW_PAD() {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $x = $xmin + 8
  $y = PAD_Y()
  $r = @pad_radius
  DRAW(
    "M",$x,",",$y,"C6(m0,", -$r, "D6m0,",2*$r,"D6)",
    "C11R12,", $r*2
  )
}

DEF LEVEL_COL_ROW($x, $y) {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $col = INT((($y - $ymin) / 16) - 0.5)
  $row = INT((($xmax - $x) / 16) - 0.5)
  return [$col, $ROW]
}

DEF LEVEL1() {
  COULEUR_BRIQUE1(15, 10, 0)
  COULEUR_BRIQUE2(8, 8, 8)
  $level = [
      " " * 20,
      " " * 20,
      "   ()  ()  ()  ()",
      "  ()()  ()()  ()()   ",
      " ()[]()()[]()()[]()  ",
      "  ()()  ()()  ()()   ",
      " ()  ()  ()  ()  ()  ",
      " " * 20,
      " " * 20,
      "()" * 10,
      "()" * 10,
      "()" * 10,
  ]
  RETURN [$level]
}

DEF DRAW_BALL($coords, $dt) {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $r = 8
  $[x, y, vx, vy] = $coords
  $oldx = $x
  $oldy = $y
  $x = $x + $vx * $dt
  $y = $y + $vy * $dt
  if $y > $ymax - $r {
    $y = $ymax - $r
    $vy = -$vy
    BIP1()
  }
  ELIF $y < $ymin + $r {
    $y = $ymin + $r
    $vy = -$vy
    BIP1()
  }
  if $x > $xmax - $r {
    $x = $xmax - $r
    $vx = -$vx
    BIP1()
  }
  ELIF $x < $xmin + 24 {
    $dist = $y - PAD_Y()
    if ABS($dist) < @pad_radius {
      $x = $xmin + 24
      $vx = ABS($vx)
      $vy = $vy + ($dist / @pad_radius)
      BIP2()
    }
  }
  COLOR(26)
  MOVE($x,$y) DISK($r)
  RETURN [$x, $y, $vx, $vy, $oldx, $oldy]
}

DEF DT($t0) {
  $t1 = TIME()
  $dt = $t1 - $t0
  RETURN [$t1, $dt * 0.2]
}

DEF LEVEL_GET($level, $col, $row) {
  $v = $level[$row][$col]
  IF $v==0 RETURN " "
  RETURN $v
}

$[xmin, xmax, ymin, ymax] = $limites_level
$[level] = LEVEL1()
$ball_coords = [$xmin + 24, PAD_Y(), 1, 1]
$time = TIME()
WHILE 1 {
  $[time, dt] = DT($time)
  CLS(1)
  DRAW_BACKGROUND()
  DRAW_LEVEL($level)
  DRAW_PAD()
  $ball_coords = DRAW_BALL($ball_coords, $dt)
  $[x, y, vx, vy, oldx, oldy] = $ball_coords
  $[col1, row1] = LEVEL_COL_ROW($x, $y)
  $[col0, row0] = LEVEL_COL_ROW($oldx, $oldy)
  IF LEVEL_GET($level,$col0,$row0)==" " {
    $c = LEVEL_GET($level,$col1,$row1)
    IF $c<>" " {
      IF $row0==$row1 $ball_coords[3] = -$vy
      ELSE $ball_coords[2] = -$vx
      IF $c=="(" {
        $line = $level[$row1]
        $line[$col1, $col1+1] = "  "
        $level[$row1] = $line
      }
      ELIF $c==")" {
        $line = $level[$row1]
        $line[$col1-1, $col1] = "  "
        $level[$row1] = $line
      }
    }
  }
  IF $x < $xmin EXIT()
  PAUSE()
}
```
