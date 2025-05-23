# Arkanoïd

Pour jouer à ce casse-briques, tu dois utiliser les touches flèches haut/bas du clavier.

```ts
RESET()
REM BEGIN Variables globales
$limites_level = [
  -320, 320 - 16,
  (224-(10*32))-(16*4), 224-(16*4)
]
$pad_radius = 30
$levels = [
  [
    [
        " " * 20,
        " " * 20,
        "  " + ("()" * 8),
        "   " + ("()" * 7),
        "    " + ("()" * 6),
    ],
    [15, 10, 0],
    [8, 8, 8],
    [3, 3, 3],
  ],
  [
    [
        " " * 20,
        " " * 20,
        "   ()    ()    ()    ",
        "  ()()  ()()  ()()   ",
        " ()[]()()[]()()[]()  ",
        "  ()()  ()()  ()()   ",
        "   ()    ()    ()    ",
        " " * 20,
        " " * 20,
        " " * 20,
        "()" * 10,
        "()" * 10,
    ],
    [14, 14, 2],
    [15, 8, 7],
    [3, 4, 1],    
  ]
]
REM $levels[0] = $levels[1]
FOR $level_def IN $levels {
  $[level] = $level_def
  FOR $i IN range(LEN($level)) {
    $level[$i] = PADL($level[$i], 20)
  }
}

REM END

DEF BIP1() SOUND(440, 1)
DEF BIP2() SOUND(330, 1)
DEF BIP3() SOUND(600, 1)
DEF BIP4() SOUND(220, 1)

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
    $cmd = "C103 R30,14"
    + "C104(m0,-5 R26,2)"
    + "(m12,0 R2,12)"
    + "C105(m0,5 R26,2)"
    + "(m-12,0 R2,12)"
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

DEF DRAW_PAD($y) {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $x = $xmin + 8
  $r = @pad_radius
  DRAW(
    "M",$x,",",$y,"C6(m0,", -$r, "D6m0,",2*$r,"D6)",
    "C11R12,", $r*2
  )
}

DEF DRAW_LIFES() {
  $r = @pad_radius
  $x = 320 - (0 + (2 * $r))
  $y = 240 - 8
  FOR $life IN RANGE(@lives) {
    DRAW(
      "M",$x,",",$y,"C6(m", -$r, ",0D6m",2*$r,",0D6)",
      "C11R", $r*2,"12"
    )
    $x = $x - ((2 * $r) + 16)
  }
}

DEF LEVEL_COL_ROW($x, $y) {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $col = INT((($y - $ymin) / 16) - 0.5)
  $row = INT((($xmax - $x) / 16) - 0.5)
  return [$col, $ROW]
}

DEF DRAW_BALL($coords, $dt, $pady) {
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
    $dist = $y - $pady
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
  RETURN [$t1, $dt * 0.3]
}

DEF LEVEL_GET($level, $col, $row) {
  $v = $level[$row][$col]
  IF $v==0 RETURN " "
  RETURN $v
}

DEF MOVE_PAD($pady, $dt) {
  $[xmin, xmax, ymin, ymax] = @limites_level
  $r = @pad_radius
  $[dx, dy] = INPUTDIR()
  $speed = 2
  return CLAMP(
    $pady + ($speed * $dt * $dy),
    $ymin + $r + 8, 
    $ymax - ($r + 8)
  )
}

DEF COUNTDOWN($count) {
  $layer = LAYER()
  LAYER(2)
  MODE("alpha")
  INK(50, 0, 0, 0, 10)
  $t0 = TIME()
  $t = 0
  WHILE $t < $count {
    $t = (TIME() - $t0) / 1000
    CLS(50)
    MOVE(0,0)
    COLOR(24)
    $f = 1 - FRACT($t)
    LABEL($count - FLOOR($t), 10 * $f)
    PAUSE()
  }
  cls()
  LAYER($layer)
  STOP()
}
DEF GAME_OVER() {
  LAYER(2)
  MODE("alpha")
  INK(50, 0, 0, 0, 12)
  cls(50)
  MOVE(0,0)
  COLOR(24)
  LABEL("GAME OVER", 3)
  PAUSE(3)
}
DEF VICTORY() {
  LAYER(2)
  MODE("alpha")
  INK(50, 0, 0, 0, 10)
  WHILE 1 {
    cls(50)
    MOVE(0,0)
    COLOR(24)
    LABEL("VICTORY", 3 + SIN(TIME()))
    PAUSE()
  }
}

INK(0,0,0,0)
$[xmin, xmax, ymin, ymax] = $limites_level
$lives = 3
$score = 0
$score_time = TIME()
FOR $level_def IN $levels {
  $continue = 1
  WHILE $continue {
    $[level, color_brik1, color_brik2, color_back] = $level_Def
    $[r1, g1, b1] = $color_brik1
    COULEUR_BRIQUE1($r1, $g1, $b1)
    $[r2, g2, b2] = $color_brik2
    COULEUR_BRIQUE2($r2, $g2, $b2)
    $[r, g, b] = $color_back
    INK(200, $r, $g, $b)
    $pady = MOVE_PAD(($ymax + $ymin) / 2, 0)
    $bricks_count = 0
    FOR $line IN $level FOR $c IN $line
    IF $c=="(" $bricks_count=$bricks_count+1 
    $ball_coords = [$xmin + 24, $padY, 1, 1]
    LAYER(0)    
    CLS(1)
    COLOR(24)
    PRINTLN()
    PRINT(PADR($score, 6, "0"))
    DRAW_BACKGROUND()
    DRAW_LEVEL($level)
    DRAW_PAD($pady)
    DRAW_LIFES()
    COUNTDOWN(3)
    $time = TIME()
    $alive = 1
    WHILE ($bricks_count>0) AND $alive {
      $[time, dt] = DT($time)
      $[dx, dy]= INPUTDIR()
      LAYER(0)    
      CLS(1)
      COLOR(24)
      PRINTLN()
      PRINT(PADR($score, 6, "0"))
      DRAW_BACKGROUND()
      DRAW_LEVEL($level)
      DRAW_PAD($pady)
      DRAW_LIFES()      
      $pady = MOVE_PAD($pady, $dt)
      $ball_coords = DRAW_BALL($ball_coords, $dt, $pady)
      $[x, y, vx, vy, oldx, oldy] = $ball_coords
      $[col1, row1] = LEVEL_COL_ROW($x, $y)
      $[col0, row0] = LEVEL_COL_ROW($oldx, $oldy)
      IF LEVEL_GET($level,$col0,$row0)==" " {
        $c = LEVEL_GET($level,$col1,$row1)
        IF $c<>" " {
          $points = MAX(1, INT(
            10000 / MAX(100, (TIME() - $score_time))
          ))
          $score_time = TIME()
          IF $row0==$row1 $ball_coords[3] = -$vy
          ELSE $ball_coords[2] = -$vx
          IF $c=="(" {
            $line = $level[$row1]
            $line[$col1, $col1+1] = "  "
            $level[$row1] = $line
            $bricks_count = $bricks_count - 1
            BIP3()
            $score = $score + $points
          }
          ELIF $c==")" {
            $line = $level[$row1]
            $line[$col1-1, $col1] = "  "
            $level[$row1] = $line
            $bricks_count = $bricks_count - 1
            BIP3()
            $score = $score + $points
          }
          ELSE BIP4()
        }
      }
      IF $x < $xmin {
        $alive = 0
      }
      PAUSE()
    }
    if $bricks_count <= 0 $continue = 0
    ELSE {
      $ball_coords = [$xmin + 24, $padY, 1, 1]
      $lives = $lives - 1
      PLAY("C4C4C4 :2 C3 :1--------------------", 240)
      IF $lives > 0 $continue = 1
      ELSE {
        GAME_OVER()
        PAUSE(5)
        EXIT()
      }
    }
  }
}
VICTORY()
```
