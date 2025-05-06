REM Programme de test.
REM $total = ((&f90 + 16) * 2) + 2000
REM $text = "I am a bear." * 3.25

println("Bonjour le monde !")
println()
print("Quel est ton nom ? ")
color(18)
$nom = input()
color(24)
print("Quel est ton age ? ")
color(18)
$age = int(input())

color(24)
println()
println("Bonjour ", $nom, " !")
$delta = random(2, 99)
println("Dans ", $delta, " ans, tu auras ", $delta + $age, " ans.")