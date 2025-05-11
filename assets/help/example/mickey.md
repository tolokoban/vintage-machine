# Mickey Mouse

```ts
CLS(11)
$x = 0
$y = 0
$noir = 27
$blanc = 26
color($noir)
rem Cheveux
move($x,$y)
disk(100)
rem Oreilles
MOVEr(-90, -90)
DISK(70)
MOVER(180,0)
disk(70)
mover(-90,90)
rem Visage (bas)
mover(5,55)
color($noir)
disk(100,45)
color($blanc)
disk(96,41)
mover(-5,-55)
rem Visage (haut)
mover(-25,-10)
color($blanc)
disk(45,60)
mover(50,0)
disk(45,60)
mover(-25,10)
REM Oeil gauche
mover(-25,-10)
COLOR($noir)
disk(24,34)
COLOR($blanc)
disk(20,30)
color($noir)
mover(5,10)
disk(13)
mover(25,0)
REM Oeil droit
mover(25,-10)
COLOR($noir)
disk(24,34)
COLOR($blanc)
disk(20,30)
color($noir)
mover(5,10)
disk(13)
mover(-25,10)
rem Nez
mover(0,20)
color($noir)
disk(20)
mover(0,-20)
rem Bouche
mover(0, 60)
color($noir)
rect(50,2)
```
